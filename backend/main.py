from fastapi import FastAPI, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from urllib.parse import quote_plus
from sqlalchemy import create_engine
import pandas as pd
from fastapi import Depends
from sqlalchemy import text


# ------------------- Config -------------------
SECRET_KEY = "your-secret-key"  # Change for production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

DB_USER = "pharma_user"
DB_PASSWORD = quote_plus("@Gauravpatil211791")  # safely encode
DB_HOST = "localhost"
DB_PORT = 3306
DB_NAME = "pharmasift"

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory user storage — replace with real user table
fake_users_db = {}

# ------------------- Auth Utils -------------------
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid token scheme")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username or username not in fake_users_db:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ------------------- App Setup -------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- Schemas -------------------
class User(BaseModel):
    username: str
    password: str

class ChatRequest(BaseModel):
    message: str

# ------------------- Routes -------------------
@app.get("/")
def root():
    return {"message": "PharmaSift API is running"}
@app.post("/signup")
def signup(user: User):
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT COUNT(*) FROM users WHERE username = :username"),
            {"username": user.username}
        )
        if result.fetchone()[0] > 0:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed = hash_password(user.password)
        conn.execute(
            text("INSERT INTO users (username, hashed_password) VALUES (:username, :hashed)"),
            {"username": user.username, "hashed": hashed}
        )
        conn.commit()  # <-- commit here
    return {"message": "Signup successful"}


@app.post("/login")
def login(user: User):
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT hashed_password FROM users WHERE username = :username"),
            {"username": user.username}
        ).fetchone()

        if not result:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        hashed_password = result[0]
        print("Hashed from DB:", hashed_password)  # Debug print

        if not verify_password(user.password, hashed_password):
            print("Password verification failed")  # Debug print
            raise HTTPException(status_code=401, detail="Invalid username or password")

        token = create_access_token({"sub": user.username})
        return {"access_token": token}


@app.get("/search")
def search_medicines(query: str = Query(..., min_length=1)):
    sql = """
        SELECT name, short_composition1, price, manufacturer_name, pack_size_label
        FROM medicines
        WHERE LOWER(name) LIKE %s OR LOWER(short_composition1) LIKE %s
        LIMIT 15
    """
    param = f"%{query.lower()}%"
    df = pd.read_sql(sql, con=engine, params=(param, param))

    results = []
    for _, row in df.iterrows():
        price_val = row["price"]
        results.append({
            "brand": row["name"],
            "generic": row.get("short_composition1", "Unknown"),
            "price": f"₹{price_val:.2f}" if price_val and price_val > 0 else "N/A",
            "manufacturer": row.get("manufacturer_name", "Unknown"),
            "packSize": row.get("pack_size_label", "Unknown")
        })

    return {
        "suggestions": [r["brand"] for r in results],
        "results": results
    }

@app.get("/medicines")
def get_all_medicines():
    sql = """
        SELECT name AS brand, short_composition1 AS generic, price, 
               manufacturer_name, type, pack_size_label 
        FROM medicines 
        LIMIT 1000
    """
    df = pd.read_sql(sql, con=engine)

    def format_row(row):
        price = row["price"]
        return {
            "brand": row["brand"],
            "generic": row.get("generic", "Unknown"),
            "brandPrice": f"₹{price:.2f}" if price and price > 0 else "N/A",
            "genericPrice": f"₹{round(price * 0.4, 2):.2f}" if price and price > 0 else "N/A",
            "manufacturer": row.get("manufacturer_name", "Unknown"),
            "type": row.get("type", "Unknown"),
            "packSize": row.get("pack_size_label", "Unknown"),
            "sideEffects": []
        }

    return {"medicines": [format_row(row) for _, row in df.iterrows()]}

@app.get("/medicine")
def get_medicine_by_name(name: str):
    sql = """
        SELECT name, short_composition1, price, manufacturer_name, 
               type, pack_size_label, side_effects
        FROM medicines
        WHERE LOWER(name) LIKE %s
        ORDER BY CHAR_LENGTH(name) ASC
        LIMIT 1
    """
    param = f"%{name.lower().strip()}%"
    df = pd.read_sql(sql, con=engine, params=(param,))

    if df.empty:
        return {"medicine": None}

    row = df.iloc[0]
    side_effects = [s.strip() for s in (row.get("side_effects") or "").split(";") if s.strip()]

    return {
        "medicine": {
            "brand": row["name"],
            "generic": row.get("short_composition1", "Unknown"),
            "brandPrice": f"₹{row['price']:.2f}" if row["price"] and row["price"] > 0 else "N/A",
            "genericPrice": f"₹{round(row['price'] * 0.4, 2):.2f}" if row["price"] and row["price"] > 0 else "N/A",
            "sideEffects": side_effects,
            "manufacturer": row.get("manufacturer_name", "Unknown"),
            "type": row.get("type", "Unknown"),
            "packSize": row.get("pack_size_label", "Unknown")
        }
    }

@app.post("/chat")
def chat_with_ai(request: ChatRequest, user: str = Depends(get_current_user)):
    # Simple fake AI response (replace with real model/integration)
    reply = f"AI Response: Here’s some info about '{request.message}' (simulated)."
    return {"reply": reply}
