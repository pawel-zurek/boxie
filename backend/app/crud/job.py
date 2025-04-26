from typing import List
from sqlalchemy.orm import Session
from app.models.job import Job
from app.schemas.job import JobCreate

def create_job(db: Session, job: JobCreate, owner_id: int):
    db_job = Job(**job.dict(), owner_id=owner_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_jobs(db: Session, owner_id: int):
    return db.query(Job).filter(Job.owner_id == owner_id).all()

def get_job(db: Session, job_id: int, owner_id: int):
    return db.query(Job).filter(Job.id == job_id, Job.owner_id == owner_id).first()

