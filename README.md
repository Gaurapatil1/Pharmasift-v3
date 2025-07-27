
# 💊 Pharmasift — Compare Branded & Generic Medicines with AI

Pharmasift helps users **compare expensive branded medicines** with their **affordable generic alternatives** — including **price**, **images**, and **side effects**. It's built for affordability awareness and future-ready with **AI assistance**.

![Screenshot](https://github.com/Gauravpatil1/Pharmasift-3/blob/main/IMG-20250726-WA0000.jpg?raw=true)

## 🚀 Features

- 🔍 **Search Branded Medicines**
- 🧾 **Compare with Generic Equivalents**
- 🖼️ **Visuals for Both Medicines**
- 📉 **Price Comparison**
- ⚠️ **List of Known Side Effects**
- 🤖 **AI-Powered Explanation (Coming Soon)**
- 📱 **Mobile-Responsive UI**
- 🧠 **Powered by OpenAI + FastAPI**



## 📂 Project Structure



#pharmasift/
<pre lang="markdown"> ``` #pharmasift/ ├── backend/ │ ├── main.py # FastAPI backend │ ├── medicines.csv # Real medicine data │ └── static/images/ # Medicine images ├── frontend/ │ ├── pages/ │ ├── components/ │ │ └── CompareSection.tsx # Compare UI with Tailwind │ └── public/ │ └── images/ # Synced frontend images ├── README.md └── package.json / requirements.txt ``` </pre>


## 🛠️ Tech Stack

- **Frontend:** React + Tailwind CSS (Next.js optional)
- **Backend:** FastAPI (Python)
- **AI Integration:** OpenAI GPT-4 API (coming soon)
- **Data Format:** CSV for easy scalability



## 🧪 Quick Start

### 1. Backend Setup

```bash
cd backend
pip install fastapi uvicorn pandas
uvicorn main:app --reload
````

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> 📦 Make sure `medicines.csv` and image paths are properly set!



## 📊 Sample Data (`medicines.csv`)

```csv
brand,generic,brandPrice,genericPrice,brandImage,genericImage,sideEffects
Dolo 650,Paracetamol,45,3,dolo.png,paracetamol.png,"Nausea;Rash"
Lipitor,Atorvastatin,160,12,lipitor.png,atorvastatin.png,"Muscle pain;Liver issues"
```



## ✨ AI Features (In Progress)

* 🧠 Side effect explanation
* 💬 Natural language chat comparison
* 📈 Intelligent generic medicine suggestions



## 📱 Mobile Ready

The UI is fully **responsive** — compare medicines from any device!



## 🤝 Contributions

Got ideas? Found data? PRs are welcome. Let’s make medicine affordable with tech!

---

## 🏆 Perfect for

* 🚀 Hackathons (Innovation + Social Impact)
* 🧑‍⚕️ Health tech startups
* 🧠 AI education projects
* 🇮🇳 India-focused affordability tools



## 📃 License

MIT License © 2025



## 🙌 Acknowledgements

* OpenAI GPT
* Jan Aushadhi Yojana (for inspiration)
* FastAPI & React communities

```


