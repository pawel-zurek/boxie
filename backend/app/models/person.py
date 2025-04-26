from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    nip = Column(Integer, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    jobs = relationship("Job", back_populates="person")
