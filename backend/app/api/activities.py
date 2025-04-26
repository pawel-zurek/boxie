from fastapi import APIRouter, Depends
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
