import asyncio
import json
from datetime import datetime
from sqlalchemy.orm import Session
from web3 import Web3
from .. import models
from ..core import database

# Generic mock ABI for the purpose of the skeleton.
# In production, user would import the JSON compiled by Hardhat.
EXPENSE_SHIELD_ABI = [
    {
        "inputs": [],
        "name": "verifyPayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "symbol", "type": "string"}],
        "name": "getUsdValue",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "txHash", "type": "bytes32"},
            {"name": "proof", "type": "bytes"},
            {"name": "signature", "type": "bytes"},
            {"name": "user", "type": "address"}
        ],
        "name": "submitProofForUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

class FlareService:
    def __init__(self):
        # Flare Coston2 RPC
        self.rpc_url = "https://coston2-api.flare.network/ext/C/rpc"
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Address of deployed ExpenseShield contract (Mock Address)
        self.contract_address = "0x0000000000000000000000000000000000000000" 
        self.contract = self.w3.eth.contract(address=self.contract_address, abi=EXPENSE_SHIELD_ABI)

    async def verify_transaction(self, proof_id: int):
        """
        Simulates the verification process with the FDC Hub and FTSO Registry.
        """
        db_gen = database.get_db()
        db = next(db_gen)
        
        try:
            proof = db.query(models.ExpenseProof).filter(models.ExpenseProof.id == proof_id).first()
            if not proof:
                return

            # Stage 1: Update status to VERIFYING_ON_CHAIN
            print(f"Began verification for proof {proof_id}")
            proof.status = models.VerificationStatus.VERIFYING_ON_CHAIN
            db.commit()
            
            # Simulate Blockchain/FDC Delay
            await asyncio.sleep(3) 

            # Mock Logic: Check for magic hash or even length
            if proof.tx_hash == "0xTEST_VALID":
                success = True
                price = 3000.50 # Mock ETH price
            else:
                success = len(proof.tx_hash) % 2 == 0
                price = 100.0

            if success:
                proof.status = models.VerificationStatus.VERIFIED
                proof.verified_at = datetime.utcnow()
                
                # FTSO: Calculate USD Value using current rate
                proof.amount_usd = float(proof.amount_wei or 0) * price 
                
                print(f"Proof {proof_id} verified via Flare FDC")
            else:
                proof.status = models.VerificationStatus.FAILED
                print(f"Proof {proof_id} failed verification")
                
            db.commit()
            
        except Exception as e:
            print(f"Error validating proof {proof_id}: {e}")
            if proof:
                proof.status = models.VerificationStatus.FAILED
                db.commit()
        finally:
            db.close()
    
    async def submit_gasless_transaction(self, submission_data, db: Session):
        """
        Relayer Function: Submits the proof to the blockchain on behalf of the user.
        Pays the gas fees.
        """
        # 1. Create the Proof record in DB (Pending)
        new_proof = models.ExpenseProof(
            user_id=submission_data.user_id,
            tx_hash=submission_data.tx_hash,
            chain_id=submission_data.chain_id,
            amount_wei=submission_data.amount_wei,
            status=models.VerificationStatus.PENDING
        )
        db.add(new_proof)
        db.commit()
        db.refresh(new_proof)

        # 2. Verify Signature Off-Chain (Mock)
        # In real world: w3.eth.account.recover_message(...)
        # For Demo: Assume signature is valid if present
        print(f"Relayer: Verifying signature {submission_data.signature} for user {submission_data.user_id}")

        # 3. Submit to Blockchain (Mock)
        # In real app:
        # tx = contract.functions.submitProofForUser(...).build_transaction(...)
        # signed_tx = w3.eth.account.sign_transaction(tx, private_key=RELAYER_KEY)
        # w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"Relayer: Submitting Tx {submission_data.tx_hash} to Flare Network (Gas Paid)")
        
        # 4. Trigger standard verification flow
        await self.verify_transaction(new_proof.id)
        
        return new_proof

   
    def get_crypto_price(self, symbol: str) -> float:
        return 3000.0

flare_service = FlareService()

# -------------------------------------------------------------------------
# TRUST ORACLE EXTENSION
# -------------------------------------------------------------------------

TRUST_ORACLE_ABI = [
    {
        "inputs": [
            {"name": "txId", "type": "string"},
            {"name": "votes", "type": "bool[]"}
        ],
        "name": "submitVotes",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "txId", "type": "string"}],
        "name": "getResult",
        "outputs": [
            {"name": "isValid", "type": "bool"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "voteCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class TrustOracleService:
    def __init__(self):
        # Using Coston2 RPC
        self.rpc_url = "https://coston2-api.flare.network/ext/C/rpc"
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Mock Address for TrustOracle
        self.contract_address = "0x0000000000000000000000000000000000000001" 
        self.contract = self.w3.eth.contract(address=self.contract_address, abi=TRUST_ORACLE_ABI)

    async def submit_oracle_votes(self, tx_id: str, votes: list[bool]):
        """
        Submits simulation votes to the smart contract.
        Since we don't have a real deployed contract, we mock the 'write' 
        and return the expected aggregation result.
        """
        print(f"🗳️ TrustOracle: Submitting votes for {tx_id}: {votes}")
        
        # In Real Life:
        # tx = self.contract.functions.submitVotes(tx_id, votes).build_transaction(...)
        # sign & send...
        
        await asyncio.sleep(2) # Simulate Blockchain Confirmation

        # Calculate Result Locally for Demo Return
        true_votes = sum(votes)
        false_votes = len(votes) - true_votes
        decision = true_votes > false_votes
        
        return {
            "tx_id": tx_id,
            "is_valid": decision,
            "timestamp": datetime.utcnow(),
            "vote_count": len(votes)
        }

trust_oracle_service = TrustOracleService()
