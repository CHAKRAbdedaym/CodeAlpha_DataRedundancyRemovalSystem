import pandas as pd
import io
from typing import List, Tuple, Dict
from schemas import StudentCreate, DuplicateRecord
from email_validator import validate_email, EmailNotValidError

def validate_csv_structure(df: pd.DataFrame) -> List[str]:
    required_columns = ["name", "email", "phone"]
    missing_columns = [col for col in required_columns if col not in df.columns]
    return missing_columns

def process_csv_file(content: bytes) -> Tuple[List[Dict], List[DuplicateRecord], List[str]]:
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        return [], [], [f"Invalid CSV file: {str(e)}"]

    errors = validate_csv_structure(df)
    if errors:
        return [], [], [f"Missing columns: {', '.join(errors)}"]

    valid_records = []
    duplicates = []
    seen_emails = set()

    for index, row in df.iterrows():
        name = str(row.get("name", "")).strip()
        email = str(row.get("email", "")).strip().lower()
        phone = str(row.get("phone", "")).strip()

        # Basic validation
        if not name or not email or not phone:
            duplicates.append(DuplicateRecord(
                name=name, email=email, phone=phone, 
                reason="Invalid Data: Missing required fields"
            ))
            continue

        try:
            validate_email(email, check_deliverability=False)
        except EmailNotValidError:
            duplicates.append(DuplicateRecord(
                name=name, email=email, phone=phone, 
                reason="Invalid Data: Invalid email format"
            ))
            continue

        # Internal duplicate detection
        if email in seen_emails:
            duplicates.append(DuplicateRecord(
                name=name, email=email, phone=phone, 
                reason="Duplicate Record: Found multiple times in the same file"
            ))
            continue
        
        seen_emails.add(email)
        valid_records.append({
            "name": name,
            "email": email,
            "phone": phone
        })

    return valid_records, duplicates, []
