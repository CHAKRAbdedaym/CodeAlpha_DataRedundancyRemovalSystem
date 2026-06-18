from sqlalchemy.orm import Session
from models import Student
from schemas import DuplicateRecord
from typing import List, Tuple, Dict

def check_database_duplicates(db: Session, records: List[Dict]) -> Tuple[List[Dict], List[DuplicateRecord]]:
    unique_to_db = []
    db_duplicates = []
    
    # Batch check emails to improve performance
    emails = [r["email"] for r in records]
    existing_students = db.query(Student).filter(Student.email.in_(emails)).all()
    existing_emails = {s.email for s in existing_students}

    for record in records:
        if record["email"] in existing_emails:
            db_duplicates.append(DuplicateRecord(
                name=record["name"],
                email=record["email"],
                phone=record["phone"],
                reason="Duplicate Record: Email already exists in database"
            ))
        else:
            unique_to_db.append(record)
            
    return unique_to_db, db_duplicates
