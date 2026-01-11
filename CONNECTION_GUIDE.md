# DataFlow AI - Fullstack Connection Guide

## ✅ What Has Been Completed

The application has been fully connected! Here's what was implemented:

### 1. **Real Authentication (JWT-based)**
- ✅ Password hashing with Werkzeug (bcrypt)
- ✅ JWT token generation and validation
- ✅ Token storage in localStorage
- ✅ Automatic token inclusion in API requests
- ✅ Secure logout functionality

### 2. **Backend-Frontend Connection**
- ✅ Complete API service layer (`services/api.ts`)
- ✅ All endpoints connected:
  - Authentication (signup/signin)
  - Dataset upload
  - Data processing (gathering, cleaning, transformation)
  - ML model training and prediction
  - History management
  - Model download

### 3. **Updated Components**
- ✅ **Auth.tsx** - Real API authentication with error handling
- ✅ **App.tsx** - JWT token management
- ✅ **Dashboard.tsx** - Complete API integration for all workflows
- ✅ **History.tsx** - Real history from database
- ✅ **Layout.tsx** - Proper logout with token cleanup

## 🚀 Setup Instructions

### Frontend Configuration

1. **Create `.env` file in root directory:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Start Frontend:**
   ```bash
   npm install  # If not already done
   npm run dev
   ```

### Backend Configuration

1. **Create `backend/.env` file:**
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=dataflow_ai
   GEMINI_API_KEY=your_gemini_api_key_here
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here
   ```

2. **Setup Database:**
   ```bash
   mysql -u root -p < backend/database_schema.sql
   ```

3. **Start Backend:**
   ```bash
   cd backend
   python app.py
   ```

## 🔗 API Endpoints

All endpoints are now connected:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Datasets
- `POST /api/datasets/upload` - Upload CSV/Excel files
- `GET /api/datasets/<id>` - Get dataset details

### Processing
- `POST /api/process/gathering` - Data gathering
- `POST /api/process/cleaning` - Data cleaning
- `POST /api/process/transformation` - Feature engineering

### Models
- `POST /api/models/suggest` - AI model suggestions
- `POST /api/models/train` - Train models
- `GET /api/models/<id>` - Get model details
- `POST /api/models/<id>/predict` - Make predictions
- `GET /api/models/<id>/download` - Download model (.pkl)

### History
- `GET /api/history` - Get user history
- `POST /api/history/<id>/load` - Load session

## 🔐 Security Features

1. **Password Hashing**: Uses Werkzeug's password hashing (pbkdf2:sha256)
2. **JWT Tokens**: Secure token-based authentication
3. **Token Storage**: Secure localStorage storage
4. **CORS**: Enabled for frontend-backend communication
5. **Protected Routes**: All API endpoints require authentication (except auth endpoints)

## 📝 Key Changes Made

### Backend (`backend/app.py`)
- ✅ Enabled real password hash verification (removed mock auth)
- ✅ All endpoints return proper JSON responses
- ✅ File upload handling for CSV/Excel
- ✅ ML model training and prediction
- ✅ Database integration

### Frontend (`services/api.ts`)
- ✅ Complete API service layer
- ✅ Token management
- ✅ Error handling
- ✅ File upload support
- ✅ Type-safe API calls

### Components
- ✅ **Auth.tsx**: Real authentication with API calls
- ✅ **Dashboard.tsx**: Complete workflow integration
- ✅ **History.tsx**: Real database data
- ✅ **App.tsx**: JWT token management

## 🧪 Testing the Connection

1. **Start Backend:**
   ```bash
   cd backend
   python app.py
   ```
   Should see: `Running on http://0.0.0.0:5000`

2. **Start Frontend:**
   ```bash
   npm run dev
   ```
   Should see: `Local: http://localhost:3000`

3. **Test Authentication:**
   - Go to http://localhost:3000/#/signup
   - Create an account
   - Login with credentials
   - Check browser DevTools > Application > Local Storage for token

4. **Test Dashboard:**
   - Upload a CSV file
   - Process data
   - Train a model
   - Make predictions
   - Download model

## 🐛 Troubleshooting

### CORS Errors
- Make sure backend CORS is enabled (already done)
- Check that backend is running on port 5000
- Verify VITE_API_URL in frontend .env

### Authentication Errors
- Check that JWT_SECRET_KEY is set in backend .env
- Verify token is being stored in localStorage
- Check browser console for API errors

### Database Errors
- Verify MySQL is running
- Check database credentials in backend .env
- Ensure database_schema.sql was executed

### File Upload Errors
- Check file size (50MB limit)
- Verify file format (CSV, XLSX, XLS)
- Check backend uploads/ directory permissions

## ✅ Everything is Connected!

The application is now a fully functional fullstack application with:
- ✅ Real authentication
- ✅ Database persistence
- ✅ File uploads
- ✅ ML model training
- ✅ Real-time predictions
- ✅ History tracking
- ✅ Model downloads

All mock data has been replaced with real API calls!