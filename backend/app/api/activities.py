from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.activity import ActivityCreate, ActivityOut, ActivityUpdate
from app.crud import activity
from app.core.security import get_current_user
from fastapi import Depends
from app.db.session import get_db


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[ActivityOut])
def list_activities(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return activity.get_activities(db)

@router.post("/", response_model=ActivityOut)
def create_activity(activity_in: ActivityCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return activity.create_activity(db, activity_in)

@router.get("/{activity_id}", response_model=ActivityOut)
def get_single_activity(activity_id: int, db: Session = Depends(get_db),  current_user: str = Depends(get_current_user)):
    db_activity = activity.get_activity(db, activity_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return db_activity

@router.patch("/{activity_id}", response_model=ActivityOut)
def update_activity(
    activity_id: int,
    activity_in: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_activity = activity.get_activity(db, activity_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    db_job = job.get_job(db, db_activity.job_id, owner_id=int(current_user))
    if not db_job:
        raise HTTPException(status_code=403, detail="Not authorized to modify this activity")

    return activity.update_activity(db, db_activity, activity_in)

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_activity = activity.get_activity(db, activity_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    db_job = job.get_job(db, db_activity.job_id, owner_id=int(current_user))
    if not db_job:
        raise HTTPException(status_code=403, detail="Not authorized to delete this activity")

    activity.delete_activity(db, db_activity)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
