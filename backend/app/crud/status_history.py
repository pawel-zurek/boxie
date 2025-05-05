# crud/status_history.py
from sqlalchemy.orm import Session
from app.models.status_history import JobStatusHistory

def create_status_entry(db: Session, job_id: int, new_status: str):
    history = JobStatusHistory(job_id=job_id, status=new_status)
    db.add(history)
    db.commit()
    db.refresh(history)
    return history

def get_status_history_for_job(db: Session, job_id: int):
    return db.query(JobStatusHistory).filter(JobStatusHistory.job_id == job_id).order_by(JobStatusHistory.timestamp).all()
