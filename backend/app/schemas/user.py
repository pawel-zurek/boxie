from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    language: Optional[str] = "en"
    role: Optional[str] = "User"

class UserCreate(UserBase):
    password: str  # password raw input from frontend

class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True
