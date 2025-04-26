from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.person import PersonCreate, PersonOut
from app.crud import person
from app.core.security import get_current_user
from fastapi import Depends

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PersonOut)
def create_person(person_in: PersonCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return person.create_person(db, person_in)

@router.get("/{person_id}", response_model=PersonOut)
def get_person(person_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_person = person.get_person(db, person_id)
    if not db_person:
        raise HTTPException(status_code=404, detail="Person not found")
    return db_person
