# Quick Start Guide

## 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 2. Configure MySQL

Create a `.env` file:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=dataflow_ai
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
```

## 3. Execute SQL Script

**Run this command in your terminal:**

```bash
mysql -u root -p < database_schema.sql
```

When prompted, enter your MySQL password.

**OR execute the SQL manually:**

1. Open MySQL Command Line or MySQL Workbench
2. Connect to MySQL server
3. Copy and paste the entire contents of `database_schema.sql`
4. Execute the script

## 4. Run the Server

```bash
python app.py
```

The API will be available at: `http://localhost:5000`

## 5. Test

Visit: `http://localhost:5000/api/health`

Should return: `{"status": "healthy", "database": "connected"}`