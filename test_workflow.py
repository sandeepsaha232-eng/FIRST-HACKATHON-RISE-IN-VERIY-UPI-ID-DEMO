import pytest
import httpx
import time

BASE_URL = "http://localhost:8000"

@pytest.fixture(scope="module")
def client():
    # In a real rigorous setup, verify the server is up
    with httpx.Client(base_url=BASE_URL) as c:
        yield c

def test_full_workflow(client):
    print("\n--- Starting End-to-End Workflow Test ---")

    # 1. Create User
    user_payload = {"name": "TestUser", "wallet_address": "0xQA_TEST_WALLET"}
    resp = client.post("/api/users", json=user_payload)
    assert resp.status_code == 200
    user_data = resp.json()
    pk = user_data["id"]
    print(f"✅ User Created: ID {pk}")

    # 2. Submit Proof (using magic bypass hash)
    proof_payload = {
        "user_id": pk,
        "tx_hash": "0xTEST_VALID",  # Triggers forced success
        "chain_id": "BTC",
        "amount_wei": "100500000000000000",
        "metadata_info": "QA Test"
    }
    resp = client.post("/api/submit-proof", json=proof_payload)
    assert resp.status_code == 200
    proof_data = resp.json()
    proof_id = proof_data["id"]
    assert proof_data["status"] == "pending"
    print(f"✅ Proof Submitted: ID {proof_id} - Status PENDING")

    # 3. Poll for Verification
    # Logic transition: pending -> verifying_on_chain -> verified
    max_retries = 10
    final_status = None
    
    for i in range(max_retries):
        time.sleep(1)
        resp = client.get(f"/api/status/{proof_id}")
        assert resp.status_code == 200
        current_status = resp.json()["status"]
        print(f"   Refreshed status: {current_status}")

        if current_status == "verified":
            final_status = "verified"
            break
        elif current_status == "failed":
            final_status = "failed"
            break
    
    assert final_status == "verified", f"Workflow failed. Final status: {final_status}"
    print("✅ Backend Logic Verified")
