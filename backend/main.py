import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base
import models  # ensure tables are created

# Create all tables
Base.metadata.create_all(bind=engine)

from auth import router as auth_router
from trips import router as trips_router

app = FastAPI(
    title="TripWise API",
    description="Backend for TripWise — AI-powered travel planning",
    version="1.0.0"
)

# ── CORS — allow the frontend to call the API ─────────
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────
app.include_router(auth_router)
app.include_router(trips_router)


@app.get("/")
def root():
    return {"message": "TripWise API is running 🚀", "docs": "/docs"}
