from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.job import JobCreate, JobOut, JobUpdate
from app.crud import job, status_history
from app.core.security import get_current_user
from fastapi import Depends
from app.db.session import get_db


router = APIRouter()


@router.post("/", response_model=JobOut)
def create_job(job_in: JobCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return job.create_job(db, job_in, owner_id=int(current_user))

@router.get("/", response_model=List[JobOut])
def list_jobs(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return job.get_jobs(db, owner_id=int(current_user))

@router.get("/{job_id}", response_model=JobOut)
def get_single_job(job_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_job = job.get_job(db, job_id, owner_id=int(current_user))
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job

@router.patch("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    job_in: JobUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_job = job.get_job(db, job_id, owner_id=int(current_user))
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")


    if "status" in job_in.dict(exclude_unset=True) and job_in.status != db_job.status:
        status_history.create_status_entry(db, job_id=db_job.id, new_status=job_in.status)

    return job.update_job(db, db_job, job_in)

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_job = job.get_job(db, job_id, owner_id=int(current_user))
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.delete_job(db, db_job)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
