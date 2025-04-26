from sqlalchemy.orm import Session
from app.models.person import Person
from app.schemas.person import PersonCreate
from typing import List

def create_person(db: Session, person_in: PersonCreate, owner_id: int):
    db_person = Person(**person_in.dict(), owner_id=owner_id)
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person

def get_person(db: Session, person_id: int, owner_id: int):
    return db.query(Person).filter(Person.id == person_id, Person.owner_id == owner_id).first()

def get_persons(db: Session, owner_id: int) -> List[Person]:
    return db.query(Person).filter(Person.owner_id == owner_id).all()


