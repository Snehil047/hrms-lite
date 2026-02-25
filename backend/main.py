import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List
from datetime import date

from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session


SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hrms.db")

if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DBEmployee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    department = Column(String, nullable=False)

class DBAttendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(String, ForeignKey("employees.emp_id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)

Base.metadata.create_all(bind=engine)

class EmployeeCreate(BaseModel):
    emp_id: str = Field(..., description="Unique Employee ID")
    name: str = Field(..., min_length=1)
    email: EmailStr 
    department: str = Field(..., min_length=1)

class EmployeeResponse(EmployeeCreate):
    id: int
    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    emp_id: str
    date: date
    status: str = Field(..., pattern="^(Present|Absent)$") 

class AttendanceResponse(AttendanceCreate):
    id: int
    class Config:
        from_attributes = True

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "HRMS API is running!"}

# --- 1. Employee Management ---

@app.post("/employees/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_emp = db.query(DBEmployee).filter(DBEmployee.emp_id == employee.emp_id).first()
    if db_emp:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    new_employee = DBEmployee(**employee.model_dump())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

@app.get("/employees/", response_model=List[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(DBEmployee).all()

@app.delete("/employees/{emp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(emp_id: str, db: Session = Depends(get_db)):
    db_emp = db.query(DBEmployee).filter(DBEmployee.emp_id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.query(DBAttendance).filter(DBAttendance.emp_id == emp_id).delete()
    
    db.delete(db_emp)
    db.commit()
    return None

# --- 2. Attendance Management ---

@app.post("/attendance/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    db_emp = db.query(DBEmployee).filter(DBEmployee.emp_id == attendance.emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found. Cannot mark attendance.")
    
    existing_record = db.query(DBAttendance).filter(
        DBAttendance.emp_id == attendance.emp_id, 
        DBAttendance.date == attendance.date
    ).first()
    if existing_record:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date.")

    new_attendance = DBAttendance(**attendance.model_dump())
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance

@app.get("/attendance/{emp_id}", response_model=List[AttendanceResponse])
def get_attendance(emp_id: str, db: Session = Depends(get_db)):
    db_emp = db.query(DBEmployee).filter(DBEmployee.emp_id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    records = db.query(DBAttendance).filter(DBAttendance.emp_id == emp_id).all()
    return records