from pydantic import BaseModel
from typing import Optional

class NoteBase(BaseModel):
    text: str

class NoteCreate(NoteBase):
    job_id: int

class NoteOut(NoteBase):
    id: int
    job_id: int

    class Config:
        orm_mode = True

class NoteBase(BaseModel):
    text: str

class NoteCreate(NoteBase):
    job_id: int

class NoteUpdate(BaseModel):
    text: Optional[str] = None

    class Config:
        orm_mode = True

class NoteOut(NoteBase):
    id: int
    job_id: int

    class Config:
        orm_mode = True