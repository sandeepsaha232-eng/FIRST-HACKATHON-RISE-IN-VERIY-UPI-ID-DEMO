FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzbar0 \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port (Render sets PORT env va, but we default to 8000)
# Use the PORT environment variable if available
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port \${PORT:-8000}"
