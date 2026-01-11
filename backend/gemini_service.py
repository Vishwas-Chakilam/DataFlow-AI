import google.generativeai as genai
import json
import logging
from config import Config

logger = logging.getLogger(__name__)

class GeminiService:
    """Handle Gemini API interactions for AI-powered insights"""
    
    def __init__(self):
        if Config.GEMINI_API_KEY:
            genai.configure(api_key=Config.GEMINI_API_KEY)
            self.model_name = 'gemini-1.5-flash'  # Default model
            self.model = None
            # Try to initialize model (will be lazy-loaded)
        else:
            self.model = None
            self.model_name = None
            logger.warning("Gemini API key not configured")
    
    def _get_model(self):
        """Lazy load model with fallback"""
        if not Config.GEMINI_API_KEY:
            return None
        if self.model:
            return self.model
        
        # Try different model names
        model_names = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
        for model_name in model_names:
            try:
                self.model = genai.GenerativeModel(model_name)
                self.model_name = model_name
                return self.model
            except Exception as e:
                logger.debug(f"Failed to load model {model_name}: {e}")
                continue
        
        logger.warning("Could not initialize any Gemini model")
        return None
    
    def get_data_insights(self, dataset_summary):
        """Get AI insights about dataset"""
        model = self._get_model()
        if not model:
            return "AI insights unavailable. Please configure GEMINI_API_KEY."
        
        try:
            prompt = f"""
            You are an expert Data Scientist. 
            Analyze the following dataset summary:
            {dataset_summary}
            
            Provide a brief, professional summary (under 150 words) of:
            1. Potential Data Cleaning steps required.
            2. Suggested Machine Learning models (e.g., Random Forest, Linear Regression).
            3. One interesting potential insight or pattern to look for.
            
            Format as markdown.
            """
            
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return f"Error generating insights: {str(e)}. Please check your API key and model availability."
    
    def suggest_models(self, dataset_summary):
        """Suggest suitable ML models for dataset"""
        model = self._get_model()
        if not model:
            return [
                'Random Forest',
                'Linear Regression',
                'Decision Tree',
                'K-Nearest Neighbors',
                'SVM'
            ]
        
        try:
            prompt = f"""
            Based on this dataset summary:
            {dataset_summary}
            
            Suggest the top 5 most suitable machine learning models.
            Return ONLY a JSON array of model names, like: ["Random Forest", "Linear Regression", ...]
            No explanations, just the JSON array.
            """
            
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Clean markdown if present
            text = text.replace('```json', '').replace('```', '').strip()
            
            try:
                suggestions = json.loads(text)
                if isinstance(suggestions, list):
                    return suggestions[:5]  # Limit to 5
            except:
                pass
            
            # Fallback to default models
            return [
                'Random Forest',
                'Linear Regression',
                'Decision Tree',
                'K-Nearest Neighbors',
                'SVM'
            ]
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return [
                'Random Forest',
                'Linear Regression',
                'Decision Tree',
                'K-Nearest Neighbors',
                'SVM'
            ]