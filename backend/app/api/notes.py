from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.note import NoteCreate, NoteOut
from app.crud import note

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=NoteOut)
def create_note(note_in: NoteCreate, db: Session = Depends(get_db)):
    return note.create_note(db, note_in)
