from typing import List
from sqlalchemy.orm import Session
from app.models.note import Note
from app.schemas.note import NoteCreate

def create_note(db: Session, note: NoteCreate):
    db_note = Note(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes(db: Session, skip: int = 0, limit: int = 100) -> List[Note]:
    return db.query(Note).offset(skip).limit(limit).all()

def get_note(db: Session, note_id: int) -> Note:
    return db.query(Note).filter(Note.id == note_id).first()
