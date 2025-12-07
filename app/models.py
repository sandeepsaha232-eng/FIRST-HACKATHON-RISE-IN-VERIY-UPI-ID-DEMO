from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SqEnum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from .core.database import Base

class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFYING_ON_CHAIN = "verifying_on_chain"
    VERIFIED = "verified"
    FAILED = "failed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    phone = Column(String)
    dob = Column(DateTime) # For >18 check
    wallet_address = Column(String, unique=True, index=True, nullable=True) # Optional now

    proofs = relationship("ExpenseProof", back_populates="owner")

class ExpenseProof(Base):
    __tablename__ = "expense_proofs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    tx_hash = Column(String, index=True)
    chain_id = Column(String) # e.g., "ETH", "BTC"
    
    amount_wei = Column(String) # Store large integers as string
    amount_usd = Column(Float, nullable=True) # From FTSO
    
    status = Column(SqEnum(VerificationStatus), default=VerificationStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
    
    metadata_info = Column(String, nullable=True)

    owner = relationship("User", back_populates="proofs")
