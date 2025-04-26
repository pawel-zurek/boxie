from pydantic import BaseModel
from typing import Optional

class PersonBase(BaseModel):
    name: str
    role: str
    nip: Optional[int] = None

class PersonCreate(PersonBase):
    pass

class PersonOut(PersonBase):
    id: int

    class Config:
        orm_mode = True
