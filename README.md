# HRMS Lite

Live Frontend Link: https://hrms-lite-nine-livid.vercel.app/
Live Backend Link: https://hrms-lite-production-e476.up.railway.app/docs

## Project Overview

HRMS Lite is a web-based basic internal Human Resource Management System. It provides a simple, usable, and professional interface for administrators to manage essential HR operations.

The application is divided into two core modules:

1. **Employee Management:** Allows the admin to add new employees (with unique IDs, valid emails, and department mapping), view a complete directory, and safely delete records.
2. **Attendance Management:** Allows the admin to track daily attendance, mark employees as Present or Absent for specific dates, and view comprehensive attendance histories.

## Tech Stack Used

This project is built using a modern full-stack architecture:

**Frontend:**

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS & shadcn/ui
- **Form Handling & Validation:** Formik
- **HTTP Client:** Axios
- **Notifications:** Sonner (Toast notifications)
- **Icons:** Lucide React

**Backend & Database:**

- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy
- **Data Validation:** Pydantic
- **Database:** SQLite (Local Development) / PostgreSQL (Production)

## Steps to Run the Project Locally

### Prerequisites

- Node.js (v18+ recommended)
- Python (3.8+ recommended)

### 1. Backend Setup for Local Env

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   run pip install -r requirements.txt
   uvicorn main:app --reload
   The backend API is now running at http://127.0.0.1:8000
   ```

### 2. Frontend Setup

1. Open a new, separate terminal window and navigate to your frontend directory:

   cd hrms
   npm install
   Create a new file named exactly .env.local in the root of your frontend folder.
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   npm run dev
