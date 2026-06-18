# Data Redundancy Removal System

A professional cloud-based solution for detecting, preventing, and managing duplicate data records. Built with FastAPI and React.

## Features

- **CSV Upload & Validation**: Securely process student datasets with real-time feedback.
- **Intelligent Duplicate Detection**: Scans for duplicates within the uploaded file and against the entire database ecosystem.
- **Persistence Strategy**: Automatically filters out redundant entries and only stores strictly unique, validated records.
- **Reporting Dashboard**: High-level statistics and bar chart visualizations of data health.
- **Detailed Inventories**: Searchable, sortable views for both verified records and rejected duplicates.
- **Export Capabilities**: Download a "clean" CSV of only unique records.

## Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic, PostgreSQL.
- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Recharts.
- **Database**: PostgreSQL (Compatible with Supabase).

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (Active instance or Supabase URL)

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate: `source venv/bin/activate` (Linux) or `venv\Scripts\activate` (Win).
4. Install dependencies: `pip install -r requirements.txt`.
5. Configuration: Create a `.env` file with `DATABASE_URL`.
6. Start the server: `uvicorn main:app --reload`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## API Documentation

- `POST /upload-csv`: Upload a dataset for processing.
- `GET /students`: Fetch unique records (supports `search`, `sort_by`, `skip`, `limit`).
- `GET /statistics`: Get system-wide data health metrics.
- `GET /upload-history`: View history of all processed files.
- `GET /duplicates`: Review all prevented duplicate entries.
- `GET /export-clean-csv`: Download the clean record set.

## Deployment Guide

### Database (Supabase)
1. Create a project on Supabase.
2. Copy the Connection String (URI).
3. Set it as `DATABASE_URL` in your environment variables.

### Backend (Render)
1. Link your GitHub repo to Render.
2. Create a "Web Service".
3. Set Build Command: `pip install -r backend/requirements.txt`.
4. Set Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`.
5. Add Environment Variables: `DATABASE_URL`.

### Frontend (Vercel)
1. Link your GitHub repo to Vercel.
2. Framework Preset: Vite.
3. Root Directory: `frontend`.
4. Set Environment Variables: `VITE_API_BASE_URL` pointing to your Render backend.

---
Development by Antigravity (CodeAlpha Internship Task 1)
