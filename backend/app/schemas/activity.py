from pydantic import BaseModel
from typing import Optional

class ActivityBase(BaseModel):
    desc: str
    status: bool = False  # default to not completed

class ActivityCreate(ActivityBase):
    job_id: int

class ActivityOut(ActivityBase):
    id: int
    job_id: int

    class Config:
        orm_mode = True

class ActivityUpdate(BaseModel):
    status: Optional[bool] = None
    desc: Optional[str] = None

    class Config:
        orm_mode = True
