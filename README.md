# 💊 PharmaSift — Compare Branded & Generic Medicines with AI

PharmaSift helps users **compare expensive branded medicines** with their **affordable generic alternatives** — including **price**, **images**, and **side effects**. It's designed to improve affordability awareness and is future-ready with **AI-powered features** (coming soon).

![Screenshot](https://github.com/Gauravpatil1/Pharmasift-3/blob/main/IMG-20250726-WA0000.jpg?raw=true)

---

## 🚀 Features

- 🔍 **Search Branded Medicines**
- 💊 **Compare with Generic Equivalents**
- 🖼️ **View Images of Both Medicines**
- 📉 **Price Comparison (Branded vs Generic)**
- ⚠️ **List of Side Effects**
- 🤖 **AI Assistant for Explanations (Coming Soon)**
- 📱 **Mobile-Responsive UI**
- 🔐 **OpenAI-Powered Backend Chatbot (Planned)**

---



---

## 🛠️ Tech Stack

- **Frontend:** HTML, Tailwind CSS, TypeScript, React (Next.js optional)
- **Backend:** FastAPI (Python)
- **Database:** MySQL (locally or hosted)
- **AI Integration:** OpenAI GPT-4 (for chatbot features)
- **Data Format:** CSV (for flexibility and performance)

---

## ⚙️ Installation Guide (Local Setup)

### 🔧 Backend Setup

```bash
# Step 1: Navigate to backend folder
cd backend

# Step 2: Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Run FastAPI server
uvicorn main:app --reload

> Make sure your medicines.csv file and images are in the correct path (static/images/).




---

🌐 Frontend Setup

# Step 1: Navigate to frontend folder
cd frontend

# Step 2: Install frontend dependencies
npm install

# Step 3: Run frontend in development mode
npm run dev

> Ensure your frontend fetches from the correct backend URL (e.g., http://localhost:8000).




---

📊 Sample Data Preview (medicines.csv)

brand,generic,brandPrice,genericPrice,brandImage,genericImage,sideEffects
Dolo 650,Paracetamol,45,3,dolo.png,paracetamol.png,"Nausea; Rash"
Lipitor,Atorvastatin,160,12,lipitor.png,atorvastatin.png,"Muscle pain; Liver issues"


---

🤖 AI Features (Coming Soon)

💬 Natural language chatbot using OpenAI

🧠 Side-effect explanation in simple terms

📈 Intelligent generic medicine suggestions



---

📱 Mobile-Friendly

The UI is built with Tailwind CSS and is fully responsive – works smoothly on both desktop and mobile devices.


---




---

🏆 Use Cases

🚀 Hackathons (Innovation + Healthcare)

🧠 AI/ML Learning Projects

🏥 HealthTech Startups





---

📄 License

MIT License © 2025 Gaurav Patil


---




