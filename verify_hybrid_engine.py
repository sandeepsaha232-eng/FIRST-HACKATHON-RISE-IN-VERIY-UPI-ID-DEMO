import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_hybrid_engine():
    print("Testing Hybrid Truth Engine Endpoint...")
    
    # Create a dummy file
    files = {'file': ('receipt.jpg', b'fake_image_bytes', 'image/jpeg')}
    data = {'ocr_data': json.dumps({"txId": "OCR-TEST-123", "amount": "99.99"})}
    
    try:
        response = requests.post(f"{BASE_URL}/upload-receipt", files=files, data=data)
        
        if response.status_code == 200:
            print("✅ Upload & Verification Success!")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"⚠️ Exception: {e}")

if __name__ == "__main__":
    test_hybrid_engine()
