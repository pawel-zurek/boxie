from pydantic import BaseModel

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
