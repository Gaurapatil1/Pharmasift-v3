from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from typing import List, Dict
import os
from dotenv import load_dotenv

# Load environment variables from .env file (optional and recommended)
load_dotenv()

app = FastAPI()

# Enable CORS for all origins (safe for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def load_medicines_from_db() -> List[Dict]:
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "pharma_user"),
            password=os.getenv("DB_PASSWORD", "@Gauravpatil211791"),
            database=os.getenv("DB_NAME", "pharmasift")
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM medicines")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
    except mysql.connector.Error as e:
        print("[ERROR] MySQL Error:", e)
        return []

    meds = []
    for row in rows:
        meds.append({
            "brand": row["name"],
            "generic": row["generic_name"],
            "brandPrice": str(row["price"]),
            "genericPrice": str(row["price"]),  # adjust if needed
            "brandImage": row["image_url"],
            "genericImage": row["image_url"],   # adjust if needed
            "sideEffects": row["side_effects"].split(";") if row.get("side_effects") else []
        })
    return meds

# ✅ Home route
@app.get("/")
def root():
    return {"message": "PharmaSift API is running"}

# ✅ Medicines endpoint
@app.get("/medicines")
def get_medicines():
    medicines = load_medicines_from_db()
    print("[DEBUG] Medicines fetched:", medicines)
    if not medicines:
        raise HTTPException(status_code=404, detail="No medicines found or DB error")
    return {"medicines": medicines}
