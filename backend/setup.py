"""
Setup script to initialize the database and create necessary directories
Run this after setting up MySQL and configuring .env file
"""
import os
import mysql.connector
from mysql.connector import Error
from config import Config
from dotenv import load_dotenv

load_dotenv()

def create_database():
    """Create database if it doesn't exist"""
    try:
        connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD
        )
        
        cursor = connection.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.MYSQL_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"Database '{Config.MYSQL_DATABASE}' created or already exists")
        cursor.close()
        connection.close()
        
    except Error as e:
        print(f"Error creating database: {e}")
        return False
    
    return True

def create_directories():
    """Create necessary directories"""
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(Config.MODELS_FOLDER, exist_ok=True)
    print(f"Created directories: {Config.UPLOAD_FOLDER}, {Config.MODELS_FOLDER}")

def execute_schema():
    """Execute database schema SQL file"""
    try:
        # Read SQL file
        schema_path = os.path.join(os.path.dirname(__file__), 'database_schema.sql')
        with open(schema_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
        
        # Remove CREATE DATABASE and USE statements (already done)
        sql_script = sql_script.split('USE dataflow_ai;')[1]
        
        connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE
        )
        
        cursor = connection.cursor()
        
        # Execute each statement
        for statement in sql_script.split(';'):
            statement = statement.strip()
            if statement:
                try:
                    cursor.execute(statement)
                    connection.commit()
                except Error as e:
                    if "already exists" not in str(e).lower():
                        print(f"Warning: {e}")
        
        cursor.close()
        connection.close()
        print("Database schema executed successfully")
        return True
        
    except Error as e:
        print(f"Error executing schema: {e}")
        return False

if __name__ == '__main__':
    print("Setting up DataFlow AI Backend...")
    print("=" * 50)
    
    if create_database():
        create_directories()
        if execute_schema():
            print("=" * 50)
            print("Setup completed successfully!")
            print("You can now run: python app.py")
        else:
            print("Setup failed at schema execution")
    else:
        print("Setup failed at database creation")
        print("Please check your MySQL credentials in .env file")