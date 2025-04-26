from typing import List
from sqlalchemy.orm import Session
from app.models.note import Note
from app.schemas.note import NoteCreate
from app.schemas.note import NoteUpdate

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

def update_note(db: Session, note: Note, note_update: NoteUpdate):
    update_data = note_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return note

def delete_note(db: Session, note: Note):
    db.delete(note)
    db.commit()
