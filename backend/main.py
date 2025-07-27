from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import csv

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def load_medicines():
    meds = []
    with open("medicines.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            meds.append({
                "brand": row["brand"].replace('"', ''),
                "generic": row["generic"],
                "brandPrice": row["brandPrice"],
                "genericPrice": row["genericPrice"],
                "brandImage": row["brandImage"],
                "genericImage": row["genericImage"],
                "sideEffects": row["sideEffects"].split(";") if row["sideEffects"] else []
            })
    return meds

@app.get("/medicines")
def medicines():
    return {"medicines": load_medicines()}


