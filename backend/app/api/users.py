from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_users():
    return {"message": "User listing endpoint (to implement later)"}
