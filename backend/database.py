import mysql.connector
from mysql.connector import Error
from config import Config
import logging

logger = logging.getLogger(__name__)

class Database:
    _instance = None
    _connection = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
        return cls._instance
    
    def get_connection(self):
        """Get or create MySQL connection"""
        if self._connection is None or not self._connection.is_connected():
            try:
                self._connection = mysql.connector.connect(
                    host=Config.MYSQL_HOST,
                    port=Config.MYSQL_PORT,
                    user=Config.MYSQL_USER,
                    password=Config.MYSQL_PASSWORD,
                    database=Config.MYSQL_DATABASE,
                    autocommit=False
                )
                logger.info("MySQL connection established")
            except Error as e:
                logger.error(f"Error connecting to MySQL: {e}")
                raise
        return self._connection
    
    def close_connection(self):
        """Close MySQL connection"""
        if self._connection and self._connection.is_connected():
            self._connection.close()
            self._connection = None
            logger.info("MySQL connection closed")
    
    def execute_query(self, query, params=None, fetch=True):
        """Execute a query and return results"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute(query, params or ())
            if fetch:
                result = cursor.fetchall()
            else:
                connection.commit()
                result = cursor.lastrowid
            cursor.close()
            return result
        except Error as e:
            connection.rollback()
            logger.error(f"Error executing query: {e}")
            raise
    
    def execute_many(self, query, params_list):
        """Execute a query with multiple parameter sets"""
        connection = self.get_connection()
        cursor = connection.cursor()
        try:
            cursor.executemany(query, params_list)
            connection.commit()
            cursor.close()
        except Error as e:
            connection.rollback()
            logger.error(f"Error executing batch query: {e}")
            raise

# Global database instance
db = Database()