from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.activity import ActivityCreate, ActivityOut
from app.crud import activity

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ActivityOut)
def create_activity(activity_in: ActivityCreate, db: Session = Depends(get_db)):
    return activity.create_activity(db, activity_in)

@router.get("/", response_model=List[ActivityOut])
def list_activities(db: Session = Depends(get_db)):
    return activity.get_activities(db)

@router.get("/{activity_id}", response_model=ActivityOut)
def get_single_activity(activity_id: int, db: Session = Depends(get_db)):
    db_activity = activity.get_activity(db, activity_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return db_activity
