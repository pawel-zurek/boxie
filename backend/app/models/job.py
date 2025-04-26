from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    person_id = Column(Integer, ForeignKey("persons.id"))
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    value = Column(Integer, nullable=True)
    close_date = Column(DateTime, nullable=True)
    status = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    person = relationship("Person", back_populates="jobs")
    activities = relationship("Activity", back_populates="job", cascade="all, delete")
    notes = relationship("Note", back_populates="job", cascade="all, delete")
