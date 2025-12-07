from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .models import VerificationStatus

class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str
    phone: str
    dob: datetime

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    wallet_address: Optional[str]
    
    class Config:
        from_attributes = True

class User(UserResponse):
    pass

class ProofSubmit(BaseModel):
    user_id: int
    tx_hash: str
    chain_id: str
    amount_wei: str
    metadata_info: Optional[str] = None

class GaslessSubmission(BaseModel):
    user_id: int
    tx_hash: str
    signature: str # Hex string of signature
    proof_data: Optional[str] = "0x" # Mock FDC proof data
    chain_id: str
    amount_wei: str

class ProofResponse(BaseModel):
    id: int
    user_id: int
    tx_hash: str
    chain_id: str
    amount_wei: Optional[str]
    amount_usd: Optional[float]
    status: VerificationStatus
    created_at: datetime
    metadata_info: Optional[str]

    class Config:
        from_attributes = True
