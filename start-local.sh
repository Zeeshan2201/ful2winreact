#!/bin/bash

echo "==================================="
echo "   Starting Full2Win React App"
echo "       (Local Development)"
echo "==================================="
echo

echo "Checking MongoDB status..."
echo

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✓ MongoDB is already running"
else
    echo "❌ MongoDB is not running"
    echo
    echo "Please start MongoDB first:"
    echo "1. Run: sudo systemctl start mongod"
    echo "   OR"
    echo "2. Run: brew services start mongodb/brew/mongodb-community (macOS)"
    echo "   OR"
    echo "3. Start MongoDB manually: mongod --dbpath /data/db"
    echo
    read -p "Press Enter to continue when MongoDB is running..."
fi

echo
echo "Starting Backend Server..."
cd Backend
npm start &
BACKEND_PID=$!

echo
echo "Waiting 5 seconds for backend to initialize..."
sleep 5

echo
echo "Starting Frontend Server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "==================================="
echo "    Both servers are running!"
echo "==================================="
echo
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop the servers
wait $BACKEND_PID $FRONTEND_PID
