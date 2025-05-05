from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.person import PersonCreate, PersonOut, PersonUpdate
from app.crud import person
from app.core.security import get_current_user
from fastapi import Depends
from typing import List
from app.schemas.person import PersonOut
from app.db.session import get_db


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PersonOut)
def create_person(person_in: PersonCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return person.create_person(db, person_in, owner_id=int(current_user))

@router.get("/{person_id}", response_model=PersonOut)
def get_person(person_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_person = person.get_person(db, person_id, owner_id=int(current_user))
    if not db_person:
        raise HTTPException(status_code=404, detail="Person not found")
    return db_person

@router.get("/", response_model=List[PersonOut])
def list_persons(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return person.get_persons(db, owner_id=int(current_user))

@router.patch("/{person_id}", response_model=PersonOut)
def update_person(
    person_id: int,
    person_in: PersonUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_person = person.get_person(db, person_id, owner_id=int(current_user))
    if not db_person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person.update_person(db, db_person, person_in)

@router.delete("/{person_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_person(
    person_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_person = person.get_person(db, person_id, owner_id=int(current_user))
    if not db_person:
        raise HTTPException(status_code=404, detail="Person not found")
    person.delete_person(db, db_person)
    return Response(status_code=status.HTTP_204_NO_CONTENT)