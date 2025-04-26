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
    owner_id: int

    class Config:
        orm_mode = True

class PersonUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    nip: Optional[int] = None

    class Config:
        orm_mode = True