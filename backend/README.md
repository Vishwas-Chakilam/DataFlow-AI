# DataFlow AI - Backend

Flask backend for DataFlow AI application with MySQL database.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup MySQL Database

1. Make sure MySQL is installed and running
2. Update the `.env` file with your MySQL credentials:
   ```
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your-password
   MYSQL_DATABASE=dataflow_ai
   ```

3. Execute the database schema:
   ```bash
   mysql -u root -p < database_schema.sql
   ```
   Or manually execute the SQL script in your MySQL client.

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   - MySQL credentials
   - Gemini API key (get from https://makersuite.google.com/app/apikey)
   - Secret keys for Flask and JWT

### 4. Create Required Directories

The application will automatically create these directories, but you can create them manually:
```bash
mkdir uploads
mkdir models
```

### 5. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Datasets
- `POST /api/datasets/upload` - Upload dataset (CSV/Excel)
- `GET /api/datasets/<id>` - Get dataset details

### Data Processing
- `POST /api/process/gathering` - Data gathering and standardization
- `POST /api/process/cleaning` - Data cleaning
- `POST /api/process/transformation` - Feature engineering

### ML Models
- `POST /api/models/suggest` - Get AI-suggested models
- `POST /api/models/train` - Train ML models
- `GET /api/models/<id>` - Get model details
- `POST /api/models/<id>/predict` - Make predictions
- `GET /api/models/<id>/download` - Download model as .pkl

### Visualizations
- `POST /api/visualizations/generate` - Generate visualizations

### History
- `GET /api/history` - Get user history
- `POST /api/history/<id>/load` - Load previous session

### Health Check
- `GET /api/health` - Health check endpoint

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `datasets` - Uploaded datasets
- `workflows` - Data processing workflows
- `models` - Trained ML models
- `predictions` - Prediction history
- `visualizations` - Generated visualizations
- `project_sessions` - Project history

## Notes

- For development, authentication is simplified (mock auth)
- All endpoints require JWT token except `/api/health` and auth endpoints
- File uploads are limited to 50MB
- Supported file formats: CSV, XLSX, XLS