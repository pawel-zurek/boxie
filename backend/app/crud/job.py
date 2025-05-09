from typing import List
from sqlalchemy.orm import Session
from app.models.job import Job
from app.schemas.job import JobCreate, JobUpdate
from app.crud import status_history

def create_job(db: Session, job: JobCreate, owner_id: int):
    db_job = Job(**job.dict(), owner_id=owner_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    if db_job.status:
        status_history.create_status_entry(db, job_id=db_job.id, new_status=db_job.status)

    return db_job

def get_jobs(db: Session, owner_id: int):
    return db.query(Job).filter(Job.owner_id == owner_id).all()

def get_job(db: Session, job_id: int, owner_id: int):
    return db.query(Job).filter(Job.id == job_id, Job.owner_id == owner_id).first()

def update_job(db: Session, job: Job, job_update: JobUpdate):
    update_data = job_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job

def delete_job(db: Session, job: Job):
    db.delete(job)
    db.commit()

