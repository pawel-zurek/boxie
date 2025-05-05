from fastapi import APIRouter
from app.db.session import get_db



router = APIRouter()

@router.get("/")
def list_users():
    return {"message": "User listing endpoint (to implement later)"}
