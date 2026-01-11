import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.svm import SVC, SVR
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    r2_score, mean_squared_error, mean_absolute_error,
    classification_report, confusion_matrix
)
import joblib
import os
import logging
from datetime import datetime
from config import Config

logger = logging.getLogger(__name__)

class MLProcessor:
    """Handle ML model training, prediction, and evaluation"""
    
    def __init__(self):
        self.model_map = {
            'Random Forest': {
                'classifier': RandomForestClassifier(n_estimators=100, random_state=42),
                'regressor': RandomForestRegressor(n_estimators=100, random_state=42)
            },
            'Linear Regression': {
                'regressor': LinearRegression()
            },
            'Logistic Regression': {
                'classifier': LogisticRegression(random_state=42, max_iter=1000)
            },
            'Decision Tree': {
                'classifier': DecisionTreeClassifier(random_state=42),
                'regressor': DecisionTreeRegressor(random_state=42)
            },
            'K-Nearest Neighbors': {
                'classifier': KNeighborsClassifier(n_neighbors=5),
                'regressor': KNeighborsRegressor(n_neighbors=5)
            },
            'SVM': {
                'classifier': SVC(random_state=42, probability=True),
                'regressor': SVR()
            }
        }
    
    def detect_problem_type(self, df, target_col):
        """Detect if problem is classification or regression"""
        if df[target_col].dtype in ['object', 'category', 'bool']:
            # Check if it's binary or multi-class
            unique_values = df[target_col].nunique()
            if unique_values <= 20:  # Likely classification
                return 'classification'
            else:
                return 'regression'  # Many unique values, treat as regression
        else:
            # Numeric - check if continuous or discrete
            unique_ratio = df[target_col].nunique() / len(df)
            if unique_ratio < 0.1:  # Less than 10% unique values
                return 'classification'
            else:
                return 'regression'
    
    def prepare_data(self, file_path, headers):
        """Prepare data for ML training"""
        try:
            df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
            
            # Select last column as target (or user can specify)
            if len(headers) < 2:
                raise ValueError("Dataset must have at least 2 columns")
            
            target_col = headers[-1]  # Use last column as target
            
            # Handle missing values - fill instead of drop to preserve more data
            df = df.dropna(subset=[target_col])  # Only drop rows where target is missing
            
            # Separate features and target
            feature_cols = [col for col in headers if col != target_col]
            X_df = df[feature_cols].copy()
            
            # Try to convert numeric strings to numbers
            for col in X_df.columns:
                if X_df[col].dtype == 'object':
                    # Try to convert to numeric
                    numeric_vals = pd.to_numeric(X_df[col], errors='coerce')
                    if not numeric_vals.isna().all():  # If at least some values are numeric
                        X_df[col] = numeric_vals
                        X_df[col] = X_df[col].fillna(X_df[col].median())
            
            # Handle categorical features by encoding them
            from sklearn.preprocessing import LabelEncoder
            le_dict = {}
            X_processed = pd.DataFrame(index=X_df.index)
            
            for col in X_df.columns:
                if X_df[col].dtype in [np.number, 'int64', 'float64', np.int64, np.float64]:
                    # Numeric column - use as is
                    X_processed[col] = X_df[col].fillna(X_df[col].median())
                else:
                    # Categorical column - encode it
                    le = LabelEncoder()
                    # Fill NaN with 'Unknown' before encoding
                    col_filled = X_df[col].fillna('Unknown').astype(str)
                    X_processed[col] = le.fit_transform(col_filled)
                    le_dict[col] = le
            
            if X_processed.empty or len(X_processed.columns) == 0:
                raise ValueError("No usable features found for training. Please ensure your dataset has numeric or categorical columns.")
            
            X = X_processed
            
            y = df.loc[X.index, target_col].copy()
            
            # Handle missing values in target - drop rows with NaN targets
            valid_mask = y.notna()
            X = X[valid_mask]
            y = y[valid_mask]
            
            # Encode target if categorical
            if y.dtype == 'object':
                from sklearn.preprocessing import LabelEncoder
                le = LabelEncoder()
                y = le.fit_transform(y.astype(str))
            else:
                # Fill numeric target missing values
                y = y.fillna(y.median())
            
            return X, y, list(X.columns), target_col
            
        except Exception as e:
            logger.error(f"Error preparing data: {e}")
            raise
    
    def train_model(self, file_path, headers, model_name, split_ratio, user_id, dataset_id):
        """Train a machine learning model"""
        try:
            # Prepare data
            X, y, feature_cols, target_col = self.prepare_data(file_path, headers)
            
            # Detect problem type
            problem_type = self.detect_problem_type(pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path), target_col)
            
            # Split data
            test_size = (100 - split_ratio) / 100
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=42
            )
            
            # Get model
            if model_name not in self.model_map:
                raise ValueError(f"Model {model_name} not supported")
            
            model_config = self.model_map[model_name]
            model_key = 'classifier' if problem_type == 'classification' else 'regressor'
            
            if model_key not in model_config:
                # If model doesn't support the problem type, use a default
                if problem_type == 'classification':
                    model = RandomForestClassifier(n_estimators=100, random_state=42)
                else:
                    model = RandomForestRegressor(n_estimators=100, random_state=42)
            else:
                model = model_config[model_key]
            
            # Train model
            model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test)
            
            metrics = {}
            if problem_type == 'classification':
                accuracy = accuracy_score(y_test, y_pred)
                precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
                recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
                f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
                
                metrics = {
                    'accuracy': float(accuracy),
                    'precision': float(precision),
                    'recall': float(recall),
                    'f1_score': float(f1)
                }
            else:  # regression
                r2 = r2_score(y_test, y_pred)
                mse = mean_squared_error(y_test, y_pred)
                mae = mean_absolute_error(y_test, y_pred)
                
                metrics = {
                    'r2_score': float(r2),
                    'mse': float(mse),
                    'mae': float(mae),
                    'rmse': float(np.sqrt(mse))
                }
                accuracy = r2  # Use R2 as accuracy metric for regression
            
            # Save model
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            model_filename = f"model_{user_id}_{dataset_id}_{model_name.replace(' ', '_')}_{timestamp}.pkl"
            model_path = os.path.join(Config.MODELS_FOLDER, model_filename)
            joblib.dump(model, model_path)
            
            return {
                'model_name': model_name,
                'model_type': 'Classification' if problem_type == 'classification' else 'Regression',
                'model_path': model_path,
                'accuracy': float(accuracy) * 100 if problem_type == 'classification' else float(accuracy) * 100,
                'metrics': metrics,
                'problem_type': problem_type,
                'feature_count': len(feature_cols)
            }
            
        except Exception as e:
            logger.error(f"Error training model: {e}")
            raise
    
    def predict(self, model_path, features, algorithm):
        """Make prediction using trained model"""
        try:
            # Load model
            model = joblib.load(model_path)
            
            # Convert features to numpy array
            feature_values = list(features.values())
            feature_array = np.array(feature_values).reshape(1, -1)
            
            # Make prediction
            prediction = model.predict(feature_array)[0]
            
            # Get prediction probabilities if classifier
            confidence = 0.95  # Default confidence
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(feature_array)[0]
                confidence = float(np.max(proba))
            
            return {
                'prediction': float(prediction) if isinstance(prediction, (np.integer, np.floating)) else str(prediction),
                'confidence': confidence,
                'algorithm': algorithm
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise