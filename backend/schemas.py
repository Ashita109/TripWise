from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Auth ──────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ── Trips ─────────────────────────────────────────────
class TripCreate(BaseModel):
    destination: str
    date_range: str
    budget: str
    travel_method: str
    interests: Optional[str] = ""
    travel_style: Optional[str] = "moderate"

class TripOut(BaseModel):
    id: int
    destination: str
    date_range: str
    budget: str
    travel_method: str
    interests: Optional[str]
    travel_style: Optional[str]
    itinerary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
