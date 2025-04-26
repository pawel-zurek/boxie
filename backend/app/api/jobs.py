from fastapi import APIRouter, Depends
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
