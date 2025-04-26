from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.job import JobCreate, JobOut
from app.crud import job
from app.core.security import get_current_user
from fastapi import Depends


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[JobOut])
def list_jobs(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return job.get_jobs(db)

@router.get("/{job_id}", response_model=JobOut)
def get_single_job(job_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_job = job.get_job(db, job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job

@router.post("/", response_model=JobOut)
def create_job(job_in: JobCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return job.create_job(db, job_in)
