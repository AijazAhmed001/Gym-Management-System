@echo off
cd /d "%~dp0"

:: Find and kill the Node.js process running on port 3000
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    taskkill /PID %%p /F >nul 2>&1
)

if "%1"=="silent" exit /b 0

echo [IronPeak] Server stopped.
timeout /t 2 /nobreak >nul
