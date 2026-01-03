import io
import re
from typing import Optional, Dict, Any
from PIL import Image, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True
try:
    from pyzbar.pyzbar import decode
    PYZBAR_AVAILABLE = True
except (ImportError, OSError):
    PYZBAR_AVAILABLE = False
    print("⚠️ Warning: zbar shared library not found. QR decoding disabled.")

try:
    import pytesseract
    OCR_AVAILABLE = True
except (ImportError, OSError):
    OCR_AVAILABLE = False
    print("⚠️ Warning: tesseract not found. OCR disabled.")
from urllib.parse import urlparse, parse_qs

class OCRService:
    def __init__(self):
        # Regex for UPI ID: username@bank
        # This is a broad regex. We can refine it. 
        # Typical UPI: [a-zA-Z0-9.\-_]{3,}@[a-zA-Z]{3,}
        self.upi_regex = r'[a-zA-Z0-9.\-_]+@[a-zA-Z]+'

    def extract_upi_id(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Extracts UPI ID from an image using QR code decoding or OCR.
        Returns a dictionary with the result.
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            return {"error": f"Invalid image format: {str(e)}"}

        # 1. Try QR Code Decoding
        if PYZBAR_AVAILABLE:
            try:
                decoded_objects = decode(image)
                for obj in decoded_objects:
                    data = obj.data.decode('utf-8')
                    if data.startswith("upi://"):
                        # Parse UPI URI
                        parsed = urlparse(data)
                        params = parse_qs(parsed.query)
                        pa = params.get('pa')
                        if pa:
                            return {
                                "upi_id": pa[0],
                                "method": "QR_CODE",
                                "raw_data": data
                            }
            except Exception as e:
                print(f"QR decoding failed: {e}")
                # Continue to OCR
        
        # 2. Key OCR Processing (Fallback)
        if OCR_AVAILABLE:
            try:
                # Optional: Preprocessing (Grayscale)
                # image = image.convert('L') 
                
                raw_text = pytesseract.image_to_string(image)
                
                # Search for UPI ID in text
                matches = re.findall(self.upi_regex, raw_text)
                
                # Simple heuristic: take the first match that looks valid
                # Or filter. For now, let's take the first one.
                if matches:
                    return {
                        "upi_id": matches[0],
                        "method": "OCR",
                        "raw_text": raw_text
                    }
                
                return {
                    "upi_id": None,
                    "method": "FAILED",
                    "raw_text": raw_text # Return raw text for debugging
                }
            except Exception as e:
                 return {
                    "error": f"OCR processing failed: {str(e)}",
                    "method": "ERROR"
                }

        return {
             "error": "Image processing libraries (zbar/tesseract) not installed on server.",
             "method": "UNAVAILABLE"
        }

ocr_service = OCRService()
