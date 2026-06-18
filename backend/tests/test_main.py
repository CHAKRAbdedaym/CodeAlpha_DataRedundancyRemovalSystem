import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
import os

# Set environment to test to avoid connecting to real DB during import
os.environ["ENV"] = "test"

from backend.main import app
from backend.database import Base, get_db
from sqlalchemy.orm import sessionmaker
import io

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_upload_csv():
    csv_content = "name,email,phone\nAhmed,ahmed@gmail.com,0611111111\nSara,sara@gmail.com,0622222222\nAhmed,ahmed@gmail.com,0611111111"
    files = {"file": ("test.csv", csv_content, "text/csv")}
    response = client.post("/upload-csv", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["summary"]["total_records"] == 3
    assert data["summary"]["unique_records"] == 2
    assert data["summary"]["duplicate_records"] == 1
    assert len(data["duplicates"]) == 1
    assert data["duplicates"][0]["reason"] == "Duplicate Record: Found multiple times in the same file"

def test_duplicate_against_db():
    # First upload
    csv1 = "name,email,phone\nJohn,john@example.com,0633333333"
    client.post("/upload-csv", files={"file": ("test1.csv", csv1, "text/csv")})
    
    # Second upload with same email
    csv2 = "name,email,phone\nJohn Doe,john@example.com,0633333333"
    response = client.post("/upload-csv", files={"file": ("test2.csv", csv2, "text/csv")})
    
    assert response.status_code == 200
    data = response.json()
    assert data["summary"]["unique_records"] == 0
    assert data["summary"]["duplicate_records"] == 1
    assert data["duplicates"][0]["reason"] == "Duplicate Record: Email already exists in database"
