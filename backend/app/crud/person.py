from sqlalchemy.orm import Session
from app.models.person import Person
from app.schemas.person import PersonCreate

def create_person(db: Session, person: PersonCreate):
    db_person = Person(**person.dict())
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person

def get_person(db: Session, person_id: int):
    return db.query(Person).filter(Person.id == person_id).first()
