import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Starting Verification Tests...")

    # 1. Create User
    print("\n[1] Creating User...")
    try:
        res = requests.post(f"{BASE_URL}/api/users", json={
            "name": "Alice", 
            "wallet_address": "0xAlice123"
        })
        res.raise_for_status()
        user = res.json()
        print(f"User created: {user}")
    except Exception as e:
        print(f"Failed to create user: {e}")
        return

    # 2. Submit Proof
    print("\n[2] Submitting Expense Proof (Hash length even -> Verified)...")
    tx_hash_success = "0x123456" # Even length = 8 chars
    res = requests.post(f"{BASE_URL}/api/submit-proof", json={
        "user_id": user["id"],
        "tx_hash": tx_hash_success,
        "chain_id": "ETH",
        "amount": 50.0,
        "metadata_info": "Dinner"
    })
    if res.status_code != 200:
        print(f"Failed submit: {res.text}")
        return
    proof = res.json()
    proof_id = proof["id"]
    print(f"Proof submitted: {proof}")

    # 3. Poll Status
    print("\n[3] Polling Status (expecting PENDING -> VERIFYING -> VERIFIED)...")
    for _ in range(10):
        res = requests.get(f"{BASE_URL}/api/status/{proof_id}")
        data = res.json()
        status = data["status"]
        print(f"Current Status: {status}")
        
        if status == "verified":
            print("SUCCESS: Proof Verified!")
            break
        if status == "failed":
            print("FAILURE: Proof Failed!")
            break
        
        time.sleep(1)

    # 4. History
    print("\n[4] Checking History...")
    res = requests.get(f"{BASE_URL}/api/history/{user['id']}")
    history = res.json()
    print(f"Found {len(history)} proofs in history.")

if __name__ == "__main__":
    # Wait for server to be up
    print("Waiting for server to start...")
    for _ in range(10):
        try:
            requests.get(f"{BASE_URL}/docs")
            break
        except:
            time.sleep(1)
    
    run_tests()
