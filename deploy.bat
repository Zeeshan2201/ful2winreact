@echo off
echo Starting deployment process...

echo.
echo [1/4] Building frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Frontend build completed successfully!

echo.
echo [3/4] Copying production script...
copy /Y public\production-script.js dist\production-script.js
copy /Y public\modified-script.js dist\modified-script.js

echo.
echo [4/4] Deployment ready!
echo.
echo Now deploy:
echo 1. Backend to Render (push changes to backend repo)
echo 2. Frontend to Render (push changes to frontend repo)
echo.
echo Don't forget to check Render logs for any issues!
pause
