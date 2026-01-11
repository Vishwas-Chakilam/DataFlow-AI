# DataFlow AI 🤖

<div align="center">
  <h3>Automated Machine Learning Platform for Non-Technical Users</h3>
  <p>Build, train, and deploy ML models without writing code</p>
  
  [![GitHub](https://img.shields.io/github/license/Vishwas-Chakilam/DataFlow-AI)](https://github.com/Vishwas-Chakilam/DataFlow-AI)
  [![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
  [![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
</div>

---

## 🌟 Features

- **🎯 Automated ML Pipeline**: End-to-end ML workflow from data upload to model deployment
- **📊 Data Processing**: Automatic data cleaning, transformation, and feature engineering
- **🧠 AI-Powered Insights**: Gemini AI integration for intelligent model suggestions
- **📈 Real-time Predictions**: Make predictions using trained models
- **💾 Model Management**: Save, download, and reuse trained models
- **📚 Project History**: Track all your ML experiments
- **🎨 Modern UI**: Beautiful, Apple-inspired design with smooth animations
- **🔐 Secure Authentication**: JWT-based authentication system

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Flask** REST API
- **MySQL** database
- **Scikit-learn** for ML models
- **Pandas** for data processing
- **Google Gemini API** for AI insights
- **JWT** for authentication

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.8+)
- **MySQL** (8.0+)
- **Gemini API Key** (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vishwas-Chakilam/DataFlow-AI.git
   cd DataFlow-AI
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MySQL credentials and API keys
   
   # Setup database
   mysql -u root -p < database_schema.sql
   
   # Run backend
   python app.py
   ```

3. **Setup Frontend**
   ```bash
   # In project root
   npm install
   
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   echo "GEMINI_API_KEY=your_key_here" >> .env
   
   # Run frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 Documentation

- [Backend Setup Guide](backend/SETUP_GUIDE.md) - Detailed backend setup instructions
- [Connection Guide](CONNECTION_GUIDE.md) - Frontend-backend integration guide
- [API Documentation](backend/README.md) - Complete API endpoint documentation
- [Error Fixes](backend/ERROR_FIXES.md) - Common issues and solutions

## 🎯 Workflow

1. **Upload Data** - Upload CSV or Excel files
2. **Data Gathering** - Automatic data standardization
3. **Data Cleaning** - Handle missing values, duplicates, outliers
4. **Transformation** - Feature engineering and ETL processes
5. **Model Selection** - AI-suggested or manual model selection
6. **Training** - Train multiple models with customizable train/test split
7. **Prediction** - Real-time predictions using trained models
8. **Download** - Export models as .pkl files

## 📁 Project Structure

```
DataFlow-AI/
├── backend/              # Flask backend
│   ├── app.py           # Main Flask application
│   ├── database.py      # Database connection handler
│   ├── ml_processor.py  # ML training and prediction
│   ├── data_processor.py # Data processing workflows
│   ├── gemini_service.py # Gemini API integration
│   └── database_schema.sql # Database schema
├── components/          # React components
├── pages/              # Page components
├── services/           # API service layer
├── App.tsx            # Main app component
└── package.json       # Frontend dependencies
```

## 🔑 Environment Variables

### Backend (.env)
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=dataflow_ai
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
GEMINI_API_KEY=your_gemini_api_key
```

## 🎨 Features Showcase

- ✅ **Real Authentication** - JWT-based secure authentication
- ✅ **Dataset Upload** - Support for CSV, XLSX, XLS formats
- ✅ **Automated Data Cleaning** - Missing values, duplicates, outliers
- ✅ **Feature Engineering** - Automatic feature transformation
- ✅ **Multiple ML Models** - Random Forest, Linear/Logistic Regression, Decision Tree, KNN, SVM
- ✅ **AI-Powered Suggestions** - Gemini AI for model recommendations
- ✅ **Model Metrics** - Accuracy, Precision, Recall, F1, R2, MSE, MAE
- ✅ **Real-time Predictions** - Interactive prediction interface
- ✅ **Model Download** - Export models as .pkl files
- ✅ **Project History** - Track all experiments
- ✅ **Data Visualization** - Charts and graphs for insights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Vishwas Chakilam**

- Email: vishwas.chakilam@gmail.com
- GitHub: [@Vishwas-Chakilam](https://github.com/Vishwas-Chakilam)
- LinkedIn: [vishwas-chakilam](https://linkedin.com/in/vishwas-chakilam)

## 🙏 Acknowledgments

- Google Gemini API for AI insights
- Scikit-learn for ML algorithms
- React and Flask communities
- All open-source contributors

---

<div align="center">
  Made with ❤️ by Vishwas Chakilam
</div>