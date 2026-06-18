from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import pandas as pd
import io
import os

from .database import engine, Base, get_db
from .models import Student, UploadHistory, DuplicateRecord as DuplicateModel
from .schemas import Student as StudentSchema, UploadHistory as UploadHistorySchema, Statistics, UploadResponse, DuplicateRecord
from .services.csv_service import process_csv_file
from .services.duplicate_service import check_database_duplicates

# Create database tables (only if not running tests)
if os.getenv("ENV") != "test":
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database connection failed: {e}")

app = FastAPI(title="Data Redundancy Removal System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/upload-csv", response_model=UploadResponse)
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    content = await file.read()
    valid_records, internal_duplicates, errors = process_csv_file(content)

    if errors:
        raise HTTPException(status_code=400, detail=errors[0])

    # Check against database
    unique_records, db_duplicates = check_database_duplicates(db, valid_records)

    # Insert unique records
    for record in unique_records:
        db_student = Student(**record)
        db.add(db_student)
    
    # Save upload history
    history = UploadHistory(
        filename=file.filename,
        total_records=len(valid_records) + len(internal_duplicates),
        unique_records=len(unique_records),
        duplicate_records=len(internal_duplicates) + len(db_duplicates)
    )
    db.add(history)
    db.flush() # Get history.id before commit

    # Store duplicates for reporting
    for dup in (internal_duplicates + db_duplicates):
        db_dup = DuplicateModel(
            name=dup.name,
            email=dup.email,
            phone=dup.phone,
            reason=dup.reason,
            upload_id=history.id
        )
        db.add(db_dup)

    db.commit()
    db.refresh(history)

    return {
        "message": f"Successfully processed {file.filename}",
        "summary": history,
        "duplicates": internal_duplicates + db_duplicates
    }

@app.get("/students", response_model=List[StudentSchema])
def get_students(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    sort_by: str = "created_at",
    order: str = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    if search:
        query = query.filter(
            (Student.name.ilike(f"%{search}%")) | 
            (Student.email.ilike(f"%{search}%")) | 
            (Student.phone.ilike(f"%{search}%"))
        )
    
    # Simple sorting logic
    sort_attr = getattr(Student, sort_by, Student.created_at)
    if order == "desc":
        query = query.order_by(sort_attr.desc())
    else:
        query = query.order_by(sort_attr.asc())

    return query.offset(skip).limit(limit).all()

@app.get("/statistics", response_model=Statistics)
def get_statistics(db: Session = Depends(get_db)):
    total_records = db.query(Student).count()
    history = db.query(UploadHistory).all()
    
    total_processed = sum(h.total_records for h in history)
    total_duplicates = sum(h.duplicate_records for h in history)
    total_unique = sum(h.unique_records for h in history)
    
    return {
        "total_records": total_processed,
        "unique_records": total_unique,
        "duplicate_records": total_duplicates,
        "successfully_inserted": total_records,
        "rejected_records": total_duplicates
    }

@app.get("/upload-history", response_model=List[UploadHistorySchema])
def get_upload_history(db: Session = Depends(get_db)):
    return db.query(UploadHistory).order_by(UploadHistory.upload_date.desc()).all()

@app.get("/duplicates")
def get_duplicates(db: Session = Depends(get_db)):
    return db.query(DuplicateModel).order_by(DuplicateModel.created_at.desc()).all()

@app.get("/export-clean-csv")
def export_clean_csv(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    data = [
        {"name": s.name, "email": s.email, "phone": s.phone}
        for s in students
    ]
    df = pd.DataFrame(data)
    
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    from fastapi.responses import StreamingResponse
    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=clean_data.csv"}
    )
