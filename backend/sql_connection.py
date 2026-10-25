



import os
from dotenv import load_dotenv
import mysql.connector

# Load .env from the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))


def get_sql_connection():
    print("Opening mysql connection")

    connection = mysql.connector.connect(
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "grocery_store"),
        connection_timeout=10,
        autocommit=True
    )

    return connection


