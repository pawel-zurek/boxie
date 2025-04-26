from pydantic import BaseModel, EmailStr
from typing import Optional

class PersonBase(BaseModel):
    name: str
    role: str
    nip: Optional[int] = None
    email: Optional[EmailStr] = None
    phone_no: Optional[str] = None

class PersonCreate(PersonBase):
    pass

class PersonUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    nip: Optional[int] = None
    email: Optional[EmailStr] = None
    phone_no: Optional[str] = None

    class Config:
        orm_mode = True

class PersonOut(PersonBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True
