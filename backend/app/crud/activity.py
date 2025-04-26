from typing import List
from sqlalchemy.orm import Session
from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate

def create_activity(db: Session, activity: ActivityCreate):
    db_activity = Activity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def get_activities(db: Session, skip: int = 0, limit: int = 100) -> List[Activity]:
    return db.query(Activity).offset(skip).limit(limit).all()

def get_activity(db: Session, activity_id: int) -> Activity:
    return db.query(Activity).filter(Activity.id == activity_id).first()

def update_activity(db: Session, activity: Activity, activity_update: ActivityUpdate):
    update_data = activity_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(activity, field, value)
    db.commit()
    db.refresh(activity)
    return activity

def delete_activity(db: Session, activity: Activity):
    db.delete(activity)
    db.commit()