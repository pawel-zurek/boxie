from sqlalchemy.orm import Session
from app.models.activity import Activity
from app.schemas.activity import ActivityCreate

def create_activity(db: Session, activity: ActivityCreate):
    db_activity = Activity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity
