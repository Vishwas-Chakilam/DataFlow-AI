# DataFlow AI Backend - Setup Guide

This guide will help you set up the Flask backend for DataFlow AI.

## Prerequisites

1. **Python 3.8+** installed
2. **MySQL** installed and running
3. **Gemini API Key** (optional but recommended) - Get from https://makersuite.google.com/app/apikey

## Step-by-Step Setup

### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

If you encounter issues, try:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 2: Configure MySQL Database

1. **Start MySQL service** (if not already running)
   - Windows: Open Services, find MySQL, and start it
   - Linux/Mac: `sudo systemctl start mysql` or `brew services start mysql`

2. **Create MySQL user and set password** (if not already done)
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
   FLUSH PRIVILEGES;
   ```
   Or use MySQL Workbench / phpMyAdmin to set the password.

3. **Note your MySQL credentials:**
   - Host: `localhost` (usually)
   - Port: `3306` (default)
   - Username: `root` (or your MySQL username)
   - Password: Your MySQL password

### Step 3: Create Environment Variables File

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and update the following:
   ```env
   # Flask Configuration
   SECRET_KEY=change-this-to-a-random-secret-key
   JWT_SECRET_KEY=change-this-to-another-random-secret-key

   # MySQL Database Configuration
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password_here
   MYSQL_DATABASE=dataflow_ai

   # Gemini API Configuration (Optional but recommended)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   **Important:** Replace `your_mysql_password_here` with your actual MySQL password!

### Step 4: Execute Database Schema

**Option A: Using MySQL Command Line** (Recommended)

```bash
mysql -u root -p < database_schema.sql
```

When prompted, enter your MySQL password.

**Option B: Using MySQL Workbench or phpMyAdmin**

1. Open MySQL Workbench / phpMyAdmin
2. Connect to your MySQL server
3. Open the `database_schema.sql` file
4. Execute the entire script

**Option C: Using Python Setup Script**

```bash
python setup.py
```

This will:
- Create the database
- Create necessary directories
- Execute the schema

### Step 5: Verify Database Setup

Run this SQL query to verify tables were created:

```sql
USE dataflow_ai;
SHOW TABLES;
```

You should see:
- users
- datasets
- workflows
- models
- predictions
- visualizations
- project_sessions

### Step 6: Create Required Directories

The application will create these automatically, but you can create them manually:

```bash
mkdir uploads
mkdir models
```

### Step 7: Run the Backend Server

```bash
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
```

The API is now available at `http://localhost:5000`

### Step 8: Test the API

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

Or visit `http://localhost:5000/api/health` in your browser.

You should get:
```json
{"status": "healthy", "database": "connected"}
```

## Troubleshooting

### Issue: "Access denied for user 'root'@'localhost'"

**Solution:** Check your MySQL password in `.env` file. Make sure it matches your MySQL root password.

### Issue: "Can't connect to MySQL server"

**Solutions:**
1. Make sure MySQL service is running
2. Check if MySQL is running on port 3306: `netstat -an | grep 3306`
3. Verify MYSQL_HOST and MYSQL_PORT in `.env`

### Issue: "Unknown database 'dataflow_ai'"

**Solution:** Execute the database schema SQL script again.

### Issue: "ModuleNotFoundError: No module named 'flask'"

**Solution:** 
```bash
pip install -r requirements.txt
```

Make sure you're using the correct Python version (Python 3.8+).

### Issue: "Gemini API errors"

**Solution:** 
- Gemini API is optional. If you don't have an API key, the app will still work but AI features will be limited.
- To get an API key: https://makersuite.google.com/app/apikey
- Add it to `.env` file as `GEMINI_API_KEY=your_key_here`

### Issue: Port 5000 already in use

**Solution:** 
- Change the port in `app.py`: `app.run(debug=True, host='0.0.0.0', port=5001)`
- Or stop the process using port 5000

## Next Steps

1. **Frontend Integration:** Make sure your frontend is configured to connect to `http://localhost:5000`
2. **CORS:** The backend has CORS enabled to allow frontend connections
3. **Testing:** Test the authentication endpoints first, then dataset upload

## API Documentation

See `README.md` for full API endpoint documentation.

## Security Notes

- Change `SECRET_KEY` and `JWT_SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Consider using a more secure authentication method in production (currently using mock auth)