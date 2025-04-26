from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    language: Optional[str] = "en"
    role: Optional[str] = "User"

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    language: Optional[str]
    role: Optional[str]

    class Config:
        orm_mode = True
