# schemas/status_history.py
from pydantic import BaseModel
from datetime import datetime

class StatusHistoryOut(BaseModel):
    id: int
    status: str
    timestamp: datetime

    class Config:
        orm_mode = True
