@echo off
echo ===================================
echo    Starting Full2Win React App
echo         (Local Development)
echo ===================================
echo.

echo Checking MongoDB status...
echo.

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB is already running
) else (
    echo ❌ MongoDB is not running
    echo.
    echo Please start MongoDB first:
    echo 1. Open Command Prompt as Administrator
    echo 2. Run: net start mongodb
    echo    OR
    echo 3. Start MongoDB Compass and connect to mongodb://localhost:27017
    echo.
    pause
    exit /b 1
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d Backend && npm start"

echo.
echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d frontend && npm run dev"

echo.
echo ===================================
echo     Both servers are starting!
echo ===================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
