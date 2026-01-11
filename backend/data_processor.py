import pandas as pd
import numpy as np
import json
import logging

logger = logging.getLogger(__name__)

class DataProcessor:
    """Handle data processing workflows: gathering, cleaning, transformation"""
    
    def load_dataset(self, file_path, filename):
        """Load dataset from file (CSV or Excel)"""
        try:
            file_ext = filename.rsplit('.', 1)[1].lower()
            
            if file_ext == 'csv':
                df = pd.read_csv(file_path)
            elif file_ext in ['xlsx', 'xls']:
                df = pd.read_excel(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_ext}")
            
            # Convert to list of dictionaries
            data = df.to_dict('records')
            headers = list(df.columns)
            
            return {
                'name': filename,
                'file_type': file_ext,
                'headers': headers,
                'row_count': len(df),
                'column_count': len(headers),
                'data': data
            }
        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            raise
    
    def process_gathering(self, file_path, headers):
        """Data gathering and standardization"""
        try:
            df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
            
            # Standardize column names (lowercase, replace spaces)
            df.columns = df.columns.str.lower().str.replace(' ', '_')
            
            # Standardize data types
            for col in df.columns:
                # Try to convert to numeric if possible
                if df[col].dtype == 'object':
                    try:
                        numeric_vals = pd.to_numeric(df[col], errors='coerce')
                        # Only convert if at least 80% of values are numeric
                        if numeric_vals.notna().sum() / len(df) > 0.8:
                            df[col] = numeric_vals
                    except:
                        pass
            
            # Return standardized data summary
            return {
                'row_count': len(df),
                'column_count': len(df.columns),
                'headers': list(df.columns),
                'data_types': {col: str(df[col].dtype) for col in df.columns},
                'sample_data': df.head(10).to_dict('records')
            }
        except Exception as e:
            logger.error(f"Error in data gathering: {e}")
            raise
    
    def process_cleaning(self, file_path):
        """Data cleaning - handle missing values, duplicates, bias"""
        try:
            df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
            original_count = len(df)
            
            # Remove duplicates
            df = df.drop_duplicates()
            duplicates_removed = original_count - len(df)
            
            # Handle missing values
            missing_stats = {}
            for col in df.columns:
                missing_count = df[col].isna().sum()
                if missing_count > 0:
                    missing_stats[col] = {
                        'count': int(missing_count),
                        'percentage': round((missing_count / len(df)) * 100, 2)
                    }
                    # Fill numeric columns with median
                    if df[col].dtype in ['int64', 'float64']:
                        df[col].fillna(df[col].median(), inplace=True)
                    # Fill categorical columns with mode
                    else:
                        df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown', inplace=True)
            
            # Detect and handle outliers (using IQR method for numeric columns)
            outlier_stats = {}
            for col in df.select_dtypes(include=[np.number]).columns:
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
                if len(outliers) > 0:
                    outlier_stats[col] = len(outliers)
                    # Cap outliers (winsorization)
                    df[col] = df[col].clip(lower=lower_bound, upper=upper_bound)
            
            return {
                'original_rows': original_count,
                'cleaned_rows': len(df),
                'duplicates_removed': duplicates_removed,
                'missing_values': missing_stats,
                'outliers_handled': outlier_stats,
                'stats': {
                    'total_cleaned': len(df),
                    'columns_cleaned': len(df.columns)
                },
                'sample_data': df.head(10).to_dict('records')
            }
        except Exception as e:
            logger.error(f"Error in data cleaning: {e}")
            raise
    
    def process_transformation(self, file_path, headers):
        """Feature engineering and ETL/ELT processes"""
        try:
            df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
            
            feature_engineering = {}
            
            # Create date features if date columns exist
            date_cols = df.select_dtypes(include=['datetime64']).columns
            for col in date_cols:
                df[f'{col}_year'] = df[col].dt.year
                df[f'{col}_month'] = df[col].dt.month
                df[f'{col}_day'] = df[col].dt.day
                feature_engineering[f'{col}_date_features'] = ['year', 'month', 'day']
            
            # Encode categorical variables
            categorical_cols = df.select_dtypes(include=['object']).columns
            encoded_features = {}
            for col in categorical_cols[:10]:  # Limit to first 10 categorical columns
                try:
                    df[f'{col}_encoded'] = pd.Categorical(df[col]).codes
                    encoded_features[col] = f'{col}_encoded'
                except:
                    pass
            
            # Create interaction features for numeric columns
            numeric_cols = df.select_dtypes(include=[np.number]).columns[:5]  # Limit to first 5
            interaction_features = []
            if len(numeric_cols) >= 2:
                col1, col2 = numeric_cols[0], numeric_cols[1]
                df[f'{col1}_x_{col2}'] = df[col1] * df[col2]
                interaction_features.append(f'{col1}_x_{col2}')
            
            # Normalize numeric features (standard scaling)
            for col in numeric_cols:
                if df[col].std() > 0:
                    df[f'{col}_normalized'] = (df[col] - df[col].mean()) / df[col].std()
            
            return {
                'original_features': list(headers),
                'new_features': list(df.columns),
                'feature_count': len(df.columns),
                'feature_engineering': feature_engineering,
                'encoded_features': encoded_features,
                'interaction_features': interaction_features,
                'sample_data': df.head(10).to_dict('records'),
                'features': {
                    'total': len(df.columns),
                    'numeric': len(df.select_dtypes(include=[np.number]).columns),
                    'categorical': len(df.select_dtypes(include=['object']).columns)
                }
            }
        except Exception as e:
            logger.error(f"Error in data transformation: {e}")
            raise
    
    def generate_visualizations(self, file_path, headers, viz_type='auto'):
        """Generate visualization data"""
        try:
            df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
            
            visualizations = []
            
            # Auto-detect best visualization type
            if viz_type == 'auto':
                # Generate multiple visualization types
                numeric_cols = df.select_dtypes(include=[np.number]).columns
                
                if len(numeric_cols) > 0:
                    # Bar chart for first numeric column
                    col = numeric_cols[0]
                    chart_data = df.head(20)[col].value_counts().head(10).to_dict()
                    visualizations.append({
                        'type': 'bar',
                        'title': f'Distribution of {col}',
                        'data': [{'name': str(k), 'value': float(v)} for k, v in chart_data.items()],
                        'config': {'xAxis': col, 'yAxis': 'Count'}
                    })
                    
                    # Line chart for time series if applicable
                    if len(numeric_cols) >= 2:
                        chart_data = df.head(20).to_dict('records')
                        visualizations.append({
                            'type': 'line',
                            'title': f'{numeric_cols[0]} vs {numeric_cols[1]}',
                            'data': chart_data,
                            'config': {'xAxis': numeric_cols[0], 'yAxis': numeric_cols[1]}
                        })
            
            return {
                'title': 'Data Visualizations',
                'data': visualizations[0]['data'] if visualizations else [],
                'config': visualizations[0]['config'] if visualizations else {},
                'visualizations': visualizations
            }
        except Exception as e:
            logger.error(f"Error generating visualizations: {e}")
            return {
                'title': 'Data Visualizations',
                'data': [],
                'config': {},
                'error': str(e)
            }