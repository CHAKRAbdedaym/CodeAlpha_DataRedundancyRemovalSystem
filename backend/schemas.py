from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

class StudentBase(BaseModel):
    name: str
    email: EmailStr
    phone: str

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UploadHistoryBase(BaseModel):
    filename: str
    total_records: int
    unique_records: int
    duplicate_records: int

class UploadHistory(UploadHistoryBase):
    id: int
    upload_date: datetime

    model_config = {"from_attributes": True}

class Statistics(BaseModel):
    total_records: int
    unique_records: int
    duplicate_records: int
    successfully_inserted: int
    rejected_records: int

class DuplicateRecord(BaseModel):
    name: str = Field(..., description="Name of the duplicate entry")
    email: str = Field(..., description="Email of the duplicate entry")
    phone: str = Field(..., description="Phone of the duplicate entry")
    reason: str = Field(..., description="Reason for being classified as duplicate (e.g., 'Internal Duplicate' or 'Database Duplicate')")

class UploadResponse(BaseModel):
    message: str
    summary: UploadHistoryBase
    duplicates: List[DuplicateRecord]
