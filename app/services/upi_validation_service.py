import random
import asyncio

class UPIValidationService:
    async def validate_upi_id(self, upi_id: str) -> dict:
        """
        Simulates verifying a VPA (UPI ID) against a Payment Gateway API (e.g., Razorpay, PayU).
        """
        print(f"🔄 Payment Gateway: Validating VPA {upi_id}...")
        
        # Simulate Network Delay
        await asyncio.sleep(1)
        
        # Mock Logic
        # In a real scenario, this would be: 
        # response = requests.post("https://api.razorpay.com/v1/payments/validate/vpa", ...)
        
        is_valid = True
        name = "Unknown User"
        
        if "invalid" in upi_id.lower():
            is_valid = False
            message = "VPA does not exist"
        else:
            # Generate a mock name based on the handle
            handle = upi_id.split('@')[0] if '@' in upi_id else "User"
            name = f"{handle.capitalize()} (Verified)"
            message = "VPA is active"

        return {
            "upi_id": upi_id,
            "is_active": is_valid,
            "registered_name": name if is_valid else None,
            "status_message": message,
            "provider_response_code": "SUCCESS" if is_valid else "INVALID_VPA"
        }

upi_validation_service = UPIValidationService()
