from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, UploadFile
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List

from . import models, schemas
from .core import database
from .services.flare_service import flare_service, trust_oracle_service
from .services.flare_service import flare_service, trust_oracle_service
from .services.ocr_service import ocr_service
from .services.upi_validation_service import upi_validation_service
from . import auth
import random
from datetime import datetime

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        models.Base.metadata.create_all(bind=database.engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {str(e)}")
    yield

app = FastAPI(title="Flare Trust Engine", version="2.0", lifespan=lifespan)

# CORS Configuration - EXPLICITLY ALLOW ALL FOR DEBUGGING
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow ALL origins (localhost:5173, localhost:3000, etc.)
    allow_credentials=True,
    allow_methods=["*"], # Allow ALL methods (GET, POST, OPTIONS)
    allow_headers=["*"], # Allow ALL headers
)

app.include_router(auth.router)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return "Server is Running" # EMERGENCY FIX: Simple String Response

# STEP 1: The Connection Test
@app.get("/test")
def test_connection():
    return {"status": "alive", "message": "Server is Alive"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Ping DB
        db.execute(text("SELECT 1"))
        return {"database": "connected", "status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.post("/api/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.wallet_address == user.wallet_address).first()
    if db_user:
        return db_user
    new_user = models.User(name=user.name, wallet_address=user.wallet_address)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/submit-proof", response_model=schemas.ProofResponse)
def submit_proof(
    proof: schemas.ProofSubmit, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == proof.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_proof = models.ExpenseProof(
        user_id=proof.user_id,
        tx_hash=proof.tx_hash,
        chain_id=proof.chain_id,
        amount_wei=proof.amount_wei,
        metadata_info=proof.metadata_info,
        status=models.VerificationStatus.PENDING
    )
    db.add(new_proof)
    db.commit()
    db.refresh(new_proof)

    # Trigger async verification via Flare Service
    background_tasks.add_task(flare_service.verify_transaction, new_proof.id)

    return new_proof

@app.post("/api/submit-gasless", response_model=schemas.ProofResponse)
async def submit_gasless(
    submission: schemas.GaslessSubmission,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == submission.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delegate to Flare Service Relayer
    new_proof = await flare_service.submit_gasless_transaction(submission, db)
    return new_proof

# -------------------------------------------------------------------------
# HYBRID TRUTH ENGINE ENDPOINT
# -------------------------------------------------------------------------

from fastapi import Form
import json

@app.post("/api/upload-receipt")
async def upload_receipt(
    file: UploadFile,
    background_tasks: BackgroundTasks,
    ocr_data: str = Form(None),
    db: Session = Depends(get_db)
):
    """
    Simulates the full Hybrid Web2/Web3 Pipeline with Persistence.
    1. Mock OCR -> get TX ID (or use Client-Side OCR)
    2. Simulate Multi-Source Check -> get Votes
    3. Submit to Trust Oracle -> get Final Result
    4. Save to DB
    """
    
    # 1. OCR Handling
    ocr_tx_id = None
    amount_str = "0"
    
    if ocr_data:
        try:
            parsed_data = json.loads(ocr_data)
            print(f"📥 Received OCR Data: {parsed_data}")
            ocr_tx_id = parsed_data.get("txId")
            amount_str = parsed_data.get("amount", "0")
        except:
            print("⚠️ Failed to parse OCR Data")

    # Fallback to Mock OCR if client-side failed
    mock_tx_id = ocr_tx_id or f"mock-tx-{random.randint(1000, 9999)}-{file.filename}"
    print(f"📄 Processing ID: {mock_tx_id}")

    # 2. Simulate Multi-Source Checks (Web2 Layer)
    votes = [True, True, random.choice([True, False])] 
    
    # 3. Submit to Trust Oracle (Web3 Layer)
    result = await trust_oracle_service.submit_oracle_votes(mock_tx_id, votes)
    
    # 4. Persistence (Phase 2 Requirement)
    # For now, assigning to User ID 1 (Mock) or we need Auth Dependency
    # TODO: Add 'user_id' to form or header
    new_proof = models.ExpenseProof(
        user_id=1, # Mock User for MVP
        tx_hash=mock_tx_id,
        chain_id="FLR",
        amount_wei=amount_str,
        metadata_info=f"OCR Verified: {file.filename}",
        status=models.VerificationStatus.VERIFIED if result["is_valid"] else models.VerificationStatus.FAILED,
        verified_at=datetime.utcnow()
    )
    db.add(new_proof)
    db.commit()
    
    return result

@app.post("/api/analyze-image")
async def analyze_image(
    file: UploadFile,
    db: Session = Depends(get_db)
):
    """
    Analyzes an uploaded image to extract UPI ID (VPA).
    First tries QR Code decoding.
    If that fails, falls back to OCR.
    """
    contents = await file.read()
    result = ocr_service.extract_upi_id(contents)
    
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
        
    if not result.get("upi_id") and result.get("method") != "FAILED":
         # If no error but no ID found (and not explicitly failed method which has raw_text)
         pass

    return result

@app.post("/api/verify-upi")
async def verify_upi(
    payload: dict,
    db: Session = Depends(get_db)
):
    """
    Step 2 & 3: Validates the UPI ID and requests Flare Attestation.
    Input: { "upi_id": "example@bank" }
    """
    upi_id = payload.get("upi_id")
    if not upi_id:
        raise HTTPException(status_code=400, detail="UPI ID is required")

    # 1. Validation (Step 2D)
    validation_result = await upi_validation_service.validate_upi_id(upi_id)
    
    # 2. Flare FDC Attestation (Step 3)
    attestation = await flare_service.attest_upi_verification(validation_result)
    
    # 3. Persistence
    # Create a record of this verification. Using ExpenseProof for now (or a new model).
    # Since we don't have a transaction hash/amount from image yet, we store mock values.
    
    new_proof = models.ExpenseProof(
        user_id=1, # Mock User
        tx_hash=attestation.get("proof") or "0xFAILED",
        chain_id="FLR",
        amount_wei="0",
        metadata_info=f"UPI Verification: {upi_id} - {validation_result['status_message']}",
        status=models.VerificationStatus.VERIFIED if attestation['attestation_status'] == "VERIFIED" else models.VerificationStatus.FAILED,
        verified_at=datetime.utcnow()
    )
    db.add(new_proof)
    db.commit()

    return {
        "validation": validation_result,
        "attestation": attestation,
        "record_id": new_proof.id
    }

@app.get("/api/status/{proof_id}", response_model=schemas.ProofResponse)
def get_proof_status(proof_id: int, db: Session = Depends(get_db)):
    proof = db.query(models.ExpenseProof).filter(models.ExpenseProof.id == proof_id).first()
    if not proof:
        raise HTTPException(status_code=404, detail="Proof not found")
    return proof

@app.get("/api/history/{user_id}", response_model=List[schemas.ProofResponse])
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    proofs = db.query(models.ExpenseProof).filter(models.ExpenseProof.user_id == user_id).all()
    return proofs
