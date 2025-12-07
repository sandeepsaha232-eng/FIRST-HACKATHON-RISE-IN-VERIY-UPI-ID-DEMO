import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

def test_auth():
    print("🔐 Testing Authentication Flow...")
    
    # 1. Register User (>18)
    user_data = {
        "full_name": "Test User",
        "email": "test@secure.app",
        "password": "securepassword123",
        "phone": "+1234567890",
        "dob": "1995-12-07T00:00:00" # > 18
    }
    
    try:
        print("1. Registering valid user...")
        r = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        if r.status_code == 200:
            print(f"✅ Registered: {r.json()['email']}")
        else:
            print(f"❌ Registration Failed: {r.text}")

        # 2. Login
        print("\n2. Logging in...")
        login_data = {"email": "test@secure.app", "password": "securepassword123"}
        r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if r.status_code == 200:
            user = r.json()
            print(f"✅ Login Success! Welcome {user['full_name']}")
        else:
            print(f"❌ Login Failed: {r.text}")

        # 3. Register Underage User (<18)
        print("\n3. Testing Age Validation (<18 year old)...")
        kid_data = user_data.copy()
        kid_data["email"] = "kid@secure.app"
        kid_data["dob"] = "2020-01-01T00:00:00" 
        
        r = requests.post(f"{BASE_URL}/auth/register", json=kid_data)
        if r.status_code == 400 and "over 18" in r.text:
             print("✅ Age Validation Passed (Blocked Underage)")
        else:
             print(f"❌ Age Validation Failed: {r.status_code} - {r.text}")

    except Exception as e:
        print(f"⚠️ Exception: {e}")

if __name__ == "__main__":
    test_auth()
