# api/job_status_history.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.security import get_current_user
from app.crud import status_history, job
from app.schemas.status_history import StatusHistoryOut
from app.db.session import get_db


router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("/{job_id}/status-history", response_model=List[StatusHistoryOut])
def get_job_status_history(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_job = job.get_job(db, job_id, owner_id=int(current_user))
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    return status_history.get_status_history_for_job(db, job_id)
