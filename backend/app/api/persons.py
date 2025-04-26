from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.person import PersonCreate, PersonOut
from app.crud import person

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PersonOut)
def create_person(person_in: PersonCreate, db: Session = Depends(get_db)):
    return person.create_person(db, person_in)

@router.get("/{person_id}", response_model=PersonOut)
def get_person(person_id: int, db: Session = Depends(get_db)):
    db_person = person.get_person(db, person_id)
    if not db_person:
        raise HTTPException(status_code=404, detail="Person not found")
    return db_person
