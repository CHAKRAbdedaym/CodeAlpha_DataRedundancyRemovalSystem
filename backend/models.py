from sqlalchemy import Column, Integer, String, DateTime, Index
from sqlalchemy.sql import func
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_student_email", "email"),
    )

class UploadHistory(Base):
    __tablename__ = "upload_history"

    id = Column(Integer, primary_key=True, index=True)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    filename = Column(String, nullable=False)
    total_records = Column(Integer, default=0)
    unique_records = Column(Integer, default=0)
    duplicate_records = Column(Integer, default=0)

class DuplicateRecord(Base):
    __tablename__ = "duplicate_records"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    upload_id = Column(Integer, index=True)
