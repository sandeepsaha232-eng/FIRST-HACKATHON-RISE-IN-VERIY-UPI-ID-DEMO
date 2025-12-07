import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_trust_engine():
    print(f"Testing Flare Trust Engine on {BASE_URL}...")
    
    # 1. Create User
    user_payload = {"name": "Test User", "wallet_address": "0x123"}
    try:
        r = requests.post(f"{BASE_URL}/api/users", json=user_payload)
        user_id = r.json()["id"]
        print(f"✅ User Created: ID {user_id}")
    except Exception as e:
        print(f"⚠️ User creation failed/exists: {e}")
        user_id = 1 # Fallback

    # 2. Submit Gasless Transaction (Relayer)
    gasless_payload = {
        "user_id": user_id,
        "tx_hash": "0xTEST_VALID", # Use Magic Hash for success
        "signature": "0xMOCKSIGHASH",
        "proof_data": "0xPROOF",
        "chain_id": "ETH",
        "amount_wei": "50000000000000000" # 0.05 ETH
    }
    
    print("\n📡 Submitting Gasless Proof to Relayer...")
    r = requests.post(f"{BASE_URL}/api/submit-gasless", json=gasless_payload)
    
    if r.status_code == 200:
        data = r.json()
        proof_id = data["id"]
        print(f"✅ Relayer Accepted Proof: ID {proof_id}")
        
        # 3. Poll for Verification (FDC Check)
        print("⏳ Waiting for FDC Verification...")
        for _ in range(10):
            time.sleep(1)
            status_r = requests.get(f"{BASE_URL}/api/status/{proof_id}")
            status = status_r.json()["status"]
            print(f"   Status: {status}")
            
            if status == "verified":
                print("\n🎉 Proof Verified by Flare Network!")
                print(f"   USD Value (FTSO): ${status_r.json()['amount_usd']}")
                break
            elif status == "failed":
                print("❌ Verification Failed.")
                break
    else:
        print(f"❌ Relayer Failed: {r.status_code} - {r.text}")

if __name__ == "__main__":
    test_trust_engine()
