from fastapi import FastAPI, HTTPException, Depends, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
# import openai  # NEW: import OpenAI client

# === JWT CONFIG ===
SECRET_KEY = "your-secret-key"  # Change in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
fake_users_db = {}

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

# === FastAPI App ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load medicines CSV ===
df = pd.read_csv("medicines.csv")

medicines_data = []
for _, row in df.iterrows():
    generic = row.get("short_composition1", "") or "Unknown"
    side_effects = row["side_effects"].split(";") if pd.notna(row["side_effects"]) else []

    try:
        brand_price = float(row["price"])
    except:
        brand_price = 0.0

    generic_price = round(brand_price * 0.4, 2) if brand_price > 0 else 0.0

    medicines_data.append({
        "brand": row["name"],
        "generic": generic,
        "brandPrice": f"₹{brand_price:.2f}" if brand_price > 0 else "N/A",
        "genericPrice": f"₹{generic_price:.2f}" if generic_price > 0 else "N/A",
        "brandImage": f"https://via.placeholder.com/150?text={row['name'].replace(' ', '+')}",
        "genericImage": f"https://via.placeholder.com/150?text={generic.replace(' ', '+')}",
        "sideEffects": side_effects,
        "manufacturer": row.get("manufacturer_name", "Unknown"),
        "type": row.get("type", "Unknown"),
        "packSize": row.get("pack_size_label", "Unknown")
    })

# === Schemas ===
class User(BaseModel):
    username: str
    password: str

# === NEW: Schema for chat request
class ChatRequest(BaseModel):
    message: str

# === Routes ===

@app.get("/")
def root():
    return {"message": "PharmaSift API is running"}

@app.get("/medicines")
def get_all_medicines():
    return {"medicines": medicines_data}

@app.get("/search")
def search_medicines(query: str):
    query = query.strip().lower()
    matches = [
        med["brand"]
        for med in medicines_data
        if query in med["brand"].lower()
    ]
    return {"suggestions": matches[:10]}

@app.get("/medicine")
def get_medicine_by_name(name: str):
    name = name.lower()
    for med in medicines_data:
        if med["brand"].lower() == name:
            return {"medicine": med}
    return {"medicine": None}

@app.post("/signup")
def signup(user: User):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    fake_users_db[user.username] = hash_password(user.password)
    return {"message": "Signup successful"}

@app.post("/login")
def login(user: User):
    hashed = fake_users_db.get(user.username)
    if not hashed or not verify_password(user.password, hashed):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token({"sub": user.username})
    return {"access_token": token}

@app.get("/ai-assist")
def ai_assist(name: str, current_user: str = Depends(get_current_user)):
    for med in medicines_data:
        if med["brand"].lower() == name.lower():
            return {
                "ai_summary": f"{name.title()} is commonly used to relieve pain and reduce fever. Always consult a doctor before use.",
                "user": current_user
            }
    return {"ai_summary": "Medicine not found."}

# === NEW: /chat endpoint with OpenAI ===
# openai.api_key = "YOUR_OPENAI_API_KEY"  # Replace with your key or load from env

# @app.post("/chat")
# def chat(request: ChatRequest, current_user: str = Depends(get_current_user)):
#     system_prompt = (
#         "You are a helpful assistant specializing in medicines. "
#         "Answer questions about medicine names, prices, side effects, generic vs branded drugs, and usage."
#     )
#     try:
#         response = openai.ChatCompletion.create(
#             model="gpt-4",
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": request.message}
#             ],
#             max_tokens=500,
#             temperature=0.7,
#         )
#         ai_reply = response.choices[0].message.content
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

#     return {"reply": ai_reply}
