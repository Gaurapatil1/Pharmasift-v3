import pandas as pd
from sqlalchemy import create_engine
import os
import urllib.parse

# --- CONFIGURATION ---
DB_USER = os.getenv("DB_USER", "pharma_user")
RAW_PASSWORD = os.getenv("DB_PASSWORD", "@Gauravpatil211791")  # Replace with env var or default
DB_PASSWORD = urllib.parse.quote_plus(RAW_PASSWORD)  # Encode special chars like '@'
DB_HOST = "localhost"
DB_PORT = 3306
DB_NAME = "pharmasift"
CSV_FILE_PATH = "medicines.csv"  # Ensure this file exists in the working directory
TABLE_NAME = "medicines"
CHUNK_SIZE = 10000  # Number of rows per batch insert

# --- CREATE SQLALCHEMY ENGINE ---
engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

def import_csv_to_mysql():
    # Check if CSV file exists
    if not os.path.isfile(CSV_FILE_PATH):
        print(f"CSV file not found at path: {CSV_FILE_PATH}")
        return

    try:
        print("Starting import of CSV data to MySQL...")
        # Read CSV in chunks to avoid memory issues with large files
        chunk_iter = pd.read_csv(CSV_FILE_PATH, chunksize=CHUNK_SIZE)

        for idx, chunk in enumerate(chunk_iter):
            print(f"Inserting chunk {idx + 1}...")
            # Clean column names (strip whitespace)
            chunk.columns = [col.strip() for col in chunk.columns]

            # Insert chunk into MySQL table, append if table exists
            chunk.to_sql(
                TABLE_NAME,
                con=engine,
                if_exists="append",
                index=False,
                method="multi"  # insert multiple rows per SQL statement for speed
            )
        print("✅ Import completed successfully.")
    except Exception as e:
        print(f"❌ Error occurred during import: {e}")

if __name__ == "__main__":
    import_csv_to_mysql()
