from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Trip
from schemas import TripCreate, TripOut
from auth import get_current_user
from models import User
from ai import generate_itinerary

router = APIRouter(prefix="/trips", tags=["trips"])


@router.post("/generate", response_model=TripOut, status_code=201)
def generate_trip(
    trip_in: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Call AI to generate itinerary
    itinerary_json = generate_itinerary(
        destination=trip_in.destination,
        date_range=trip_in.date_range,
        budget=trip_in.budget,
        travel_method=trip_in.travel_method,
        interests=trip_in.interests or "",
        travel_style=trip_in.travel_style or "moderate"
    )

    trip = Trip(
        user_id=current_user.id,
        destination=trip_in.destination,
        date_range=trip_in.date_range,
        budget=trip_in.budget,
        travel_method=trip_in.travel_method,
        interests=trip_in.interests,
        travel_style=trip_in.travel_style,
        itinerary=itinerary_json
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.get("/", response_model=list[TripOut])
def list_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Trip).filter(Trip.user_id == current_user.id)\
              .order_by(Trip.created_at.desc()).all()


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip
