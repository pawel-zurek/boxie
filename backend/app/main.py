from fastapi import FastAPI
from app.api import auth, users, persons, jobs, activities, notes
from app.db.session import engine
from app.models import user, person, job, activity, note

# Create tables
user.Base.metadata.create_all(bind=engine)
person.Base.metadata.create_all(bind=engine)
job.Base.metadata.create_all(bind=engine)
activity.Base.metadata.create_all(bind=engine)
note.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(persons.router, prefix="/api/persons", tags=["persons"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(activities.router, prefix="/api/activities", tags=["activities"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])

@app.get("/")
def root():
    return {"message": "Backend is running!"}
