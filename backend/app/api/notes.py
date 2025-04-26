from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.note import NoteCreate, NoteOut
from app.crud import note
from app.core.security import get_current_user
from fastapi import Depends

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=NoteOut)
def create_note(note_in: NoteCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return note.create_note(db, note_in)

@router.get("/", response_model=List[NoteOut])
def list_notes(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return note.get_notes(db)

@router.get("/{note_id}", response_model=NoteOut)
def get_single_note(note_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_note = note.get_note(db, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note
