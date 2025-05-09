from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.activity import ActivityOut
from app.schemas.note import NoteOut


class JobBase(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    value: Optional[int] = None
    close_date: Optional[datetime] = None
    status: Optional[str] = None

class JobCreate(JobBase):
    person_id: int

class JobOut(JobBase):
    id: int
    person_id: int
    owner_id: int
    activities: List[ActivityOut] = []
    notes: List[NoteOut] = []

    class Config:
        orm_mode = True

class JobUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    value: Optional[int] = None
    close_date: Optional[datetime] = None
    status: Optional[str] = None

    class Config:
        orm_mode = True