from sqlalchemy.orm import Session
from app.models.note import Note
from app.schemas.note import NoteCreate

def create_note(db: Session, note: NoteCreate):
    db_note = Note(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note
