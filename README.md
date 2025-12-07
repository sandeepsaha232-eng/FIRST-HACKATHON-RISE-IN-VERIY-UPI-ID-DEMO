# Antigravity: Cross-Chain Expense Proof App

Welcome to the backend service for the **"Cross-Chain Expense Proof & Reimbursement App"**.
This service verifies cross-chain payment proofs using the **Flare Network** (FDC & FTSO).

## 🚀 Setup & Installation

### 1. Prerequisites
- Python 3.9+
- Pip

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```bash
# Flare Coston2 Testnet RPC
FLARE_RPC_URL="https://coston2-api.flare.network/ext/C/rpc"

# Deployed Contract Address (ExpenseShield.sol)
# Use "0x..." if mocking, or the real address if deployed
CONTRACT_ADDRESS="0x0000000000000000000000000000000000000000"
```

## 🛠️ Running the App

Start the FastAPI server in development mode:

```bash
uvicorn app.main:app --reload
```

## 🎨 API-to-Spline Animation Mapping

The frontend should poll `GET /api/status/{proof_id}` and trigger animations based on the `status` field.

| Backend Status (`status`) | Spline Animation Trigger | Behavior |
| :--- | :--- | :--- |
| `pending` | `Idle` | Loop |
| `verifying_on_chain` | `Mining_Loop` | Loop |
| `verified` | `Shield_Lock` | One-Shot |
| `failed` | `Error_Red` | One-Shot |

## 📂 Project Structure
- `app/` - Core application code.
- `contracts/` - Solidity contracts (`ExpenseShield.sol`).
- `test_workflow.py` - E2E verification script.
