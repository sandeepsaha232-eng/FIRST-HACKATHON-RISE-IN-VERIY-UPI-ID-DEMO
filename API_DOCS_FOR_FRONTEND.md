# API Documentation for Frontend Integration

**Base URL**: `http://localhost:8000`

## 1. Trigger Verification
**Endpoint:** `POST /api/submit-proof`

Call this when the user pastes their Transaction Hash.

**Body:**
```json
{
  "user_id": 1,
  "tx_hash": "0xa6f...",
  "chain_id": "ETH",
  "amount": 50.0,
  "metadata_info": "Rent share"
}
```

**Response:**
Returns the Created Proof object. Store the `id` for polling.

## 2. Animation Driver (Polling Status)
**Endpoint:** `GET /api/status/{proof_id}`

**Usage:** Poll this every 1-2 seconds to update the Spline animation state.

### Status States & Animation Triggers:

| Status Value | Meaning | Spline Animation Action |
| :--- | :--- | :--- |
| `pending` | Received, waiting for worker | Show "Initializing" loader. |
| `verifying_on_chain` | **CRITICAL**: The backend is querying the Flare Network. | **Loop the "Mining/Verifying" animation.** (e.g. rotating block, scanning beam). |
| `verified` | Success! FDC confirmed validity. | **Trigger "Success/Shield" animation.** Unlock the UI. |
| `failed` | Invalid Hash or Network Error. | Trigger "Red X / Error" state. |

## 3. History
**Endpoint:** `GET /api/history/{user_id}`

Returns list of all past proofs.
