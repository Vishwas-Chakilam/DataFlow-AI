from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import json
import logging
from datetime import datetime
from config import Config
from database import db
from ml_processor import MLProcessor
from data_processor import DataProcessor
from gemini_service import GeminiService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
JWTManager(app)

# Initialize services
Config.init_app(app)
ml_processor = MLProcessor()
data_processor = DataProcessor()
gemini_service = GeminiService()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

# ==================== AUTHENTICATION ENDPOINTS ====================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        username = data.get('username') or data.get('email', '').split('@')[0]
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user exists
        existing = db.execute_query(
            "SELECT id FROM users WHERE email = %s OR username = %s",
            (email, username)
        )
        
        if existing:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create user (mock auth - just store for now)
        password_hash = generate_password_hash(password)
        user_id = db.execute_query(
            """INSERT INTO users (username, email, password_hash) 
               VALUES (%s, %s, %s)""",
            (username, email, password_hash),
            fetch=False
        )
        
        # Create access token
        access_token = create_access_token(identity=str(user_id))
        
        return jsonify({
            'message': 'User created successfully',
            'token': access_token,
            'user': {
                'id': user_id,
                'username': username,
                'email': email
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Signup error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/signin', methods=['POST'])
def signin():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        users = db.execute_query(
            "SELECT id, username, email, password_hash FROM users WHERE email = %s",
            (email,)
        )
        
        if not users:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        user = users[0]
        
        # Verify password hash
        if not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['id']))
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Signin error: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== DATASET ENDPOINTS ====================

@app.route('/api/datasets/upload', methods=['POST'])
@jwt_required()
def upload_dataset():
    """Upload dataset (CSV or Excel)"""
    try:
        user_id = int(get_jwt_identity())
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: CSV, XLSX, XLS'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
        file.save(filepath)
        
        # Process file
        dataset_info = data_processor.load_dataset(filepath, filename)
        
        # Save to database
        dataset_id = db.execute_query(
            """INSERT INTO datasets 
               (user_id, name, filename, file_path, file_type, row_count, column_count, headers, status)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'processed')""",
            (
                user_id,
                dataset_info['name'],
                filename,
                filepath,
                dataset_info['file_type'],
                dataset_info['row_count'],
                dataset_info['column_count'],
                json.dumps(dataset_info['headers'])
            ),
            fetch=False
        )
        
        return jsonify({
            'message': 'Dataset uploaded successfully',
            'dataset': {
                'id': dataset_id,
                'name': dataset_info['name'],
                'headers': dataset_info['headers'],
                'row_count': dataset_info['row_count'],
                'column_count': dataset_info['column_count'],
                'data': dataset_info['data'][:10]  # First 10 rows for preview
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/datasets/<int:dataset_id>', methods=['GET'])
@jwt_required()
def get_dataset(dataset_id):
    """Get dataset details"""
    try:
        user_id = int(get_jwt_identity())
        
        datasets = db.execute_query(
            """SELECT id, name, filename, file_type, row_count, column_count, headers, status, created_at
               FROM datasets WHERE id = %s AND user_id = %s""",
            (dataset_id, user_id)
        )
        
        if not datasets:
            return jsonify({'error': 'Dataset not found'}), 404
        
        dataset = datasets[0]
        dataset['headers'] = json.loads(dataset['headers']) if dataset['headers'] else []
        
        # Load actual data
        file_path = db.execute_query(
            "SELECT file_path FROM datasets WHERE id = %s",
            (dataset_id,)
        )[0]['file_path']
        
        dataset_info = data_processor.load_dataset(file_path, dataset['filename'])
        dataset['data'] = dataset_info['data'][:100]  # First 100 rows
        
        return jsonify(dataset), 200
        
    except Exception as e:
        logger.error(f"Get dataset error: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== DATA PROCESSING ENDPOINTS ====================

@app.route('/api/process/gathering', methods=['POST'])
@jwt_required()
def data_gathering():
    """Data gathering and standardization"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        dataset_id = data.get('dataset_id')
        
        if not dataset_id:
            return jsonify({'error': 'dataset_id is required'}), 400
        
        # Get dataset
        datasets = db.execute_query(
            "SELECT file_path, headers FROM datasets WHERE id = %s AND user_id = %s",
            (dataset_id, user_id)
        )
        if not datasets:
            return jsonify({'error': 'Dataset not found'}), 404
        
        dataset = datasets[0]
        file_path = dataset['file_path']
        headers = json.loads(dataset['headers'])
        
        # Process data
        processed_data = data_processor.process_gathering(file_path, headers)
        
        # Save workflow
        workflow_id = db.execute_query(
            """INSERT INTO workflows 
               (dataset_id, user_id, workflow_type, status, output_data, metadata)
               VALUES (%s, %s, 'gathering', 'completed', %s, %s)""",
            (
                dataset_id,
                user_id,
                json.dumps(processed_data),
                json.dumps({'standardized': True})
            ),
            fetch=False
        )
        
        # Use Gemini for insights
        summary = f"Headers: {', '.join(headers)}. Processed {processed_data.get('row_count', 0)} rows."
        insights = gemini_service.get_data_insights(summary)
        
        return jsonify({
            'message': 'Data gathering completed',
            'workflow_id': workflow_id,
            'data': processed_data,
            'insights': insights
        }), 200
        
    except Exception as e:
        logger.error(f"Data gathering error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/process/cleaning', methods=['POST'])
@jwt_required()
def data_cleaning():
    """Data cleaning - handle missing values, duplicates, bias"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        dataset_id = data.get('dataset_id')
        
        if not dataset_id:
            return jsonify({'error': 'dataset_id is required'}), 400
        
        # Get dataset
        datasets = db.execute_query(
            "SELECT file_path FROM datasets WHERE id = %s AND user_id = %s",
            (dataset_id, user_id)
        )
        if not datasets:
            return jsonify({'error': 'Dataset not found'}), 404
        
        file_path = datasets[0]['file_path']
        
        # Process cleaning
        cleaned_data = data_processor.process_cleaning(file_path)
        
        # Save workflow
        workflow_id = db.execute_query(
            """INSERT INTO workflows 
               (dataset_id, user_id, workflow_type, status, output_data, metadata)
               VALUES (%s, %s, 'cleaning', 'completed', %s, %s)""",
            (
                dataset_id,
                user_id,
                json.dumps(cleaned_data),
                json.dumps(cleaned_data.get('stats', {}))
            ),
            fetch=False
        )
        
        return jsonify({
            'message': 'Data cleaning completed',
            'workflow_id': workflow_id,
            'data': cleaned_data
        }), 200
        
    except Exception as e:
        logger.error(f"Data cleaning error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/process/transformation', methods=['POST'])
@jwt_required()
def data_transformation():
    """Feature engineering and ETL/ELT processes"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        dataset_id = data.get('dataset_id')
        
        if not dataset_id:
            return jsonify({'error': 'dataset_id is required'}), 400
        
        # Get dataset
        datasets = db.execute_query(
            "SELECT file_path, headers FROM datasets WHERE id = %s AND user_id = %s",
            (dataset_id, user_id)
        )
        if not datasets:
            return jsonify({'error': 'Dataset not found'}), 404
        
        file_path = datasets[0]['file_path']
        headers = json.loads(datasets[0]['headers'])
        
        # Process transformation
        transformed_data = data_processor.process_transformation(file_path, headers)
        
        # Save workflow
        workflow_id = db.execute_query(
            """INSERT INTO workflows 
               (dataset_id, user_id, workflow_type, status, output_data, metadata)
               VALUES (%s, %s, 'transformation', 'completed', %s, %s)""",
            (
                dataset_id,
                user_id,
                json.dumps(transformed_data),
                json.dumps(transformed_data.get('features', {}))
            ),
            fetch=False
        )
        
        return jsonify({
            'message': 'Data transformation completed',
            'workflow_id': workflow_id,
            'data': transformed_data
        }), 200
        
    except Exception as e:
        logger.error(f"Data transformation error: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== ML MODELING ENDPOINTS ====================

@app.route('/api/models/suggest', methods=['POST'])
@jwt_required()
def suggest_models():
    """Use AI to suggest suitable ML models"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        dataset_id = data.get('dataset_id')
        
        if not dataset_id:
            return jsonify({'error': 'dataset_id is required'}), 400
        
        # Get dataset info
        datasets = db.execute_query(
            "SELECT file_path, headers, row_count FROM datasets WHERE id = %s AND user_id = %s",
            (dataset_id, user_id)
        )
        if not datasets:
            return jsonify({'error': 'Dataset not found'}), 404
        
        dataset = datasets[0]
        headers = json.loads(dataset['headers'])
        
        # Use Gemini to suggest models
        summary = f"Dataset with {len(headers)} columns, {dataset['row_count']} rows. Columns: {', '.join(headers)}"
        suggestions = gemini_service.suggest_models(summary)
        
        return jsonify({
            'suggestions': suggestions
        }), 200
        
    except Exception as e:
        logger.error(f"Suggest models error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/train', methods=['POST'])
@jwt_required()
def train_model():
    """Train ML models"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        dataset_id = data.get('dataset_id')
        model_names = data.get('models', [])
        split_ratio = data.get('split_ratio', 70)
        
        if not dataset_id or not model_names:
            return jsonify({'error': 'dataset_id and models are required'}), 400
        
        # Get dataset
        datasets = db.execute_query(
            "SELECT file_path, headers FROM datasets WHERE id = %s AND user_id = %s",
            (dataset_id, user_id)
        )
        if not datasets:
            return jsonify({'error': 'Dataset not found'}), 404
        
        file_path = datasets[0]['file_path']
        headers = json.loads(datasets[0]['headers'])
        
        # Get latest workflow
        workflows = db.execute_query(
            "SELECT id FROM workflows WHERE dataset_id = %s ORDER BY id DESC LIMIT 1",
            (dataset_id,)
        )
        workflow_id = workflows[0]['id'] if workflows else None
        
        # Train models
        trained_models = []
        for model_name in model_names:
            try:
                result = ml_processor.train_model(
                    file_path, headers, model_name, split_ratio, user_id, dataset_id
                )
                
                # Save model to database
                model_id = db.execute_query(
                    """INSERT INTO models 
                       (workflow_id, dataset_id, user_id, model_name, model_type, algorithm, 
                        model_path, train_test_split, accuracy, metrics, status, description)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'trained', %s)""",
                    (
                        workflow_id,
                        dataset_id,
                        user_id,
                        result['model_name'],
                        result['model_type'],
                        model_name,
                        result['model_path'],
                        split_ratio,
                        result.get('accuracy'),
                        json.dumps(result.get('metrics', {})),
                        f"Trained {model_name} on dataset"
                    ),
                    fetch=False
                )
                
                result['id'] = model_id
                trained_models.append(result)
                
            except Exception as e:
                logger.error(f"Error training {model_name}: {e}")
                continue
        
        return jsonify({
            'message': 'Models trained successfully',
            'models': trained_models
        }), 200
        
    except Exception as e:
        logger.error(f"Train model error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/<int:model_id>', methods=['GET'])
@jwt_required()
def get_model(model_id):
    """Get model details and metrics"""
    try:
        user_id = int(get_jwt_identity())
        
        models = db.execute_query(
            """SELECT id, model_name, model_type, algorithm, accuracy, precision_score, 
                      recall_score, f1_score, r2_score, mse, mae, metrics, status, 
                      description, created_at, trained_at
               FROM models WHERE id = %s AND user_id = %s""",
            (model_id, user_id)
        )
        
        if not models:
            return jsonify({'error': 'Model not found'}), 404
        
        model = models[0]
        model['metrics'] = json.loads(model['metrics']) if model['metrics'] else {}
        
        return jsonify(model), 200
        
    except Exception as e:
        logger.error(f"Get model error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/<int:model_id>/predict', methods=['POST'])
@jwt_required()
def predict(model_id):
    """Make predictions using trained model"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        features = data.get('features', {})
        
        if not features:
            return jsonify({'error': 'Features are required'}), 400
        
        # Get model
        models = db.execute_query(
            "SELECT model_path, algorithm, dataset_id FROM models WHERE id = %s AND user_id = %s",
            (model_id, user_id)
        )
        if not models:
            return jsonify({'error': 'Model not found'}), 404
        
        model_info = models[0]
        
        # Make prediction
        prediction = ml_processor.predict(model_info['model_path'], features, model_info['algorithm'])
        
        # Save prediction
        prediction_id = db.execute_query(
            """INSERT INTO predictions (model_id, user_id, input_features, prediction_result, confidence_score)
               VALUES (%s, %s, %s, %s, %s)""",
            (
                model_id,
                user_id,
                json.dumps(features),
                json.dumps(prediction),
                prediction.get('confidence', 0)
            ),
            fetch=False
        )
        
        return jsonify({
            'prediction_id': prediction_id,
            'prediction': prediction
        }), 200
        
    except Exception as e:
        logger.error(f"Predict error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/<int:model_id>/download', methods=['GET'])
@jwt_required()
def download_model(model_id):
    """Download trained model as .pkl file"""
    try:
        user_id = int(get_jwt_identity())
        
        models = db.execute_query(
            "SELECT model_path, model_name FROM models WHERE id = %s AND user_id = %s",
            (model_id, user_id)
        )
        
        if not models:
            return jsonify({'error': 'Model not found'}), 404
        
        model_path = models[0]['model_path']
        model_name = models[0]['model_name']
        
        if not os.path.exists(model_path):
            return jsonify({'error': 'Model file not found'}), 404
        
        return send_file(
            model_path,
            as_attachment=True,
            download_name=f"{model_name}_{model_id}.pkl",
            mimetype='application/octet-stream'
        )
        
    except Exception as e:
        logger.error(f"Download model error: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== VISUALIZATION ENDPOINTS ====================

@app.route('/api/visualizations/generate', methods=['POST'])
@jwt_required()
def generate_visualization():
    """Generate data visualizations"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        dataset_id = data.get('dataset_id')
        viz_type = data.get('type', 'auto')
        
        if not dataset_id:
            return jsonify({'error': 'dataset_id is required'}), 400
        
        # Get dataset
        datasets = db.execute_query(
            "SELECT file_path, headers FROM datasets WHERE id = %s AND user_id = %s",
            (dataset_id, user_id)
        )
        if not datasets:
            return jsonify({'error': 'Dataset not found'}), 404
        
        file_path = datasets[0]['file_path']
        headers = json.loads(datasets[0]['headers'])
        
        # Generate visualizations
        viz_data = data_processor.generate_visualizations(file_path, headers, viz_type)
        
        # Save visualization
        viz_id = db.execute_query(
            """INSERT INTO visualizations (dataset_id, user_id, viz_type, title, data, config)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (
                dataset_id,
                user_id,
                viz_type,
                viz_data.get('title', 'Data Visualization'),
                json.dumps(viz_data.get('data', [])),
                json.dumps(viz_data.get('config', {}))
            ),
            fetch=False
        )
        
        return jsonify({
            'visualization_id': viz_id,
            'data': viz_data
        }), 200
        
    except Exception as e:
        logger.error(f"Generate visualization error: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== HISTORY ENDPOINTS ====================

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get user's project history"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get project sessions with model info
        sessions = db.execute_query(
            """SELECT ps.id, ps.session_name, ps.insights, ps.created_at, ps.updated_at,
                      m.id as model_id, m.model_name, m.accuracy, m.model_type,
                      d.name as dataset_name
               FROM project_sessions ps
               LEFT JOIN models m ON ps.model_id = m.id
               LEFT JOIN datasets d ON ps.dataset_id = d.id
               WHERE ps.user_id = %s
               ORDER BY ps.created_at DESC
               LIMIT 50""",
            (user_id,)
        )
        
        return jsonify({'history': sessions}), 200
        
    except Exception as e:
        logger.error(f"Get history error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/history/<int:session_id>/load', methods=['POST'])
@jwt_required()
def load_history_session(session_id):
    """Load a previous project session"""
    try:
        user_id = int(get_jwt_identity())
        
        sessions = db.execute_query(
            """SELECT * FROM project_sessions WHERE id = %s AND user_id = %s""",
            (session_id, user_id)
        )
        
        if not sessions:
            return jsonify({'error': 'Session not found'}), 404
        
        session = sessions[0]
        session['workflow_summary'] = json.loads(session['workflow_summary']) if session['workflow_summary'] else {}
        
        return jsonify(session), 200
        
    except Exception as e:
        logger.error(f"Load history error: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.get_connection()
        return jsonify({'status': 'healthy', 'database': 'connected'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)