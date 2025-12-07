from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
import re

from . import models, schemas
from .core import database

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/api/auth", tags=["auth"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def validate_age_and_email(user_data: schemas.UserCreate):
    # Email Validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format (must contain @ and domain)")
    
    # Age Validation (>18)
    today = datetime.now()
    age = (today - user_data.dob).days / 365.25
    if age < 18:
        raise HTTPException(status_code=400, detail="Registration blocked: User must be over 18.")

@router.post("/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Log the data to prove connection
    print(f"🔥 EMERGENCY REGISTER REQUEST: {user}")
    
    try:
        # 2. Try to create the user directly (Force Create)
        # Using HARDCODED values for Demo Stability as requested
        print("🛠️ FORCING CREATION: Name=Sandeep, Phone=8327458900")
        
        hashed_pwd = get_password_hash(user.password) # Still hash the password
        
        new_user = models.User(
            full_name="Sandeep", # Hardcoded for Demo
            email=user.email,
            password_hash=hashed_pwd,
            phone="8327458900", # Hardcoded
            dob=datetime(2006, 1, 1), # Hardcoded: 2006-01-01
            wallet_address=f"0xMOCK_WALLET_{user.phone[-4:]}"
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"✅ REGISTRATION SUCCESSFUL: User ID {new_user.id}")
        return new_user

    except Exception as e:
        print(f"❌ SAVE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@router.post("/login", response_model=schemas.UserResponse)
def login(creds: schemas.UserLogin, db: Session = Depends(get_db)):
    print(f"🔑 LOGIN REQUEST: {creds.email}")
    user = db.query(models.User).filter(models.User.email == creds.email).first()
    if not user:
        print(f"❌ Login Failed: User {creds.email} NOT FOUND")
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(creds.password, user.password_hash):
        print(f"❌ Login Failed: Incorrect Password for {creds.email}")
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    print(f"✅ Login Success: {user.email}")
    return user
