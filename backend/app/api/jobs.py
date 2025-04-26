from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.job import JobCreate, JobOut
from app.crud import job

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=JobOut)
def create_job(job_in: JobCreate, db: Session = Depends(get_db)):
    return job.create_job(db, job_in)

@router.get("/", response_model=List[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    return job.get_jobs(db)

@router.get("/{job_id}", response_model=JobOut)
def get_single_job(job_id: int, db: Session = Depends(get_db)):
    db_job = job.get_job(db, job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job
