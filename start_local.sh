#!/bin/bash

# Get the absolute path of the current directory
PROJECT_DIR=$(pwd)

echo "🚀 Starting Flare Trust Engine Locally..."

# 1. Start Backend in a new Terminal tab
echo "🔌 Booting Backend Server..."
osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR' && source .venv/bin/activate 2>/dev/null || true && uvicorn app.main:app --reload\""

# 2. Wait a moment
sleep 2

# 3. Start Frontend in a new Terminal tab
echo "🎨 Booting Frontend..."
osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR/frontend' && npm run dev\""

echo "✅ commands sent to Terminal."
echo "   - Backend: http://127.0.0.1:8000"
echo "   - Frontend: http://localhost:5173"
