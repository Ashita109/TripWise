# TripWise 🌍✈️

Your AI-powered travel companion for effortless journey planning.

## 🚀 Features
- **Smart Itinerary Generation**: Day-by-day travel plans using Google Gemini AI.
- **User Authentication**: Secure JWT-based register/login system.
- **Personalized Planning**: Form-based trip customization (budget, style, interests).
- **Dynamic UI**: Beautiful timeline view and interactive itinerary rendering.

---

## 🛠️ Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript.
- **Backend**: Python 3.13, FastAPI, SQLAlchemy, SQLite.
- **AI**: Google Generative AI (Gemini).

---

## 💻 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Ashita109/TripWise.git
cd TripWise
```

### 2. Backend Setup
```bash
cd backend
python3 -m pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to the .env file
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
In a new terminal (in the root directory):
```bash
python3 -m http.server 3000
```
Visit **[http://localhost:3000](http://localhost:3000)** to start planning!

---

## 🌐 Hosting Notes
- **Frontend**: Can be hosted via [GitHub Pages](https://pages.github.com/).
- **Backend**: Requires a Python host like [Render](https://render.com/) or [Railway](https://railway.app/).
