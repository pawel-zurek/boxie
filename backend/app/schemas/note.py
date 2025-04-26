from pydantic import BaseModel

class NoteBase(BaseModel):
    text: str

class NoteCreate(NoteBase):
    job_id: int

class NoteOut(NoteBase):
    id: int
    job_id: int

    class Config:
        orm_mode = True
