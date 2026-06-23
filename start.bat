@echo off
setlocal enabledelayedexpansion
title IronPeak Fitness — Starting...
cd /d "%~dp0"

:: ── Create logs folder ──────────────────────────────────────────────────────
if not exist "logs" mkdir logs

:: ── Check if server is already running on port 3000 ─────────────────────────
netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo [IronPeak] Server already running. Opening browser...
    goto :openbrowser
)

:: ── Check Node.js is installed ───────────────────────────────────────────────
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║          Node.js is NOT installed!                      ║
    echo ║                                                          ║
    echo ║  Please download and install Node.js from:              ║
    echo ║  https://nodejs.org  (choose LTS version)               ║
    echo ║                                                          ║
    echo ║  After installing, run this file again.                  ║
    echo ╚══════════════════════════════════════════════════════════╝
    echo.
    start "" "https://nodejs.org/en/download"
    pause
    exit /b 1
)

:: ── Check if dependencies are installed ─────────────────────────────────────
if not exist "node_modules" (
    echo [IronPeak] node_modules missing. Installing dependencies...
    echo [IronPeak] This may take 2-3 minutes on first run...
    call npm install --silent 2>> logs\setup.log
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed. Check logs\setup.log
        pause
        exit /b 1
    )
    echo [IronPeak] Dependencies installed!
)

:: ── Regenerate Prisma client if needed ───────────────────────────────────────
if not exist "node_modules\.prisma\client\index.js" (
    echo [IronPeak] Setting up database client...
    call npx prisma generate >> logs\setup.log 2>&1
)

:: ── Check if production build exists ─────────────────────────────────────────
if not exist ".next\BUILD_ID" (
    echo [IronPeak] Production build missing. Building app...
    echo [IronPeak] This takes 1-2 minutes. Please wait...
    call npm run build >> logs\setup.log 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed. Check logs\setup.log
        pause
        exit /b 1
    )
    echo [IronPeak] Build complete!
)

:: ── Check if database exists and has data ─────────────────────────────────────
if not exist "prisma\dev.db" (
    echo [IronPeak] Database not found. Creating and seeding...
    call npx prisma db push >> logs\setup.log 2>&1
    call npm run db:seed >> logs\setup.log 2>&1
    echo [IronPeak] Database ready!
)

:: ── Start production server ──────────────────────────────────────────────────
echo [IronPeak] Starting server on http://localhost:3000 ...
start "" /B cmd /c "npm run start > logs\server.log 2>&1"

:: ── Wait for server to be ready ──────────────────────────────────────────────
set /a attempts=0
:waitloop
timeout /t 1 /nobreak >nul
set /a attempts+=1
netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 goto :serverready
if %attempts% lss 15 goto :waitloop
echo [WARNING] Server taking longer than expected. Opening browser anyway...

:serverready
echo [IronPeak] ✓ Server is ready!

:openbrowser
:: ── Open in Chrome first, Edge second, then default browser ─────────────────
set CHROME_PATH=
for %%p in (
    "%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"
    "%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe"
    "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
) do (
    if exist "%%~p" (
        set CHROME_PATH=%%~p
        goto :foundChrome
    )
)
:foundChrome

if defined CHROME_PATH (
    start "" %CHROME_PATH% "http://localhost:3000" --new-window
) else (
    :: Try Edge
    set EDGE_PATH=
    for %%p in (
        "%PROGRAMFILES%\Microsoft\Edge\Application\msedge.exe"
        "%PROGRAMFILES(X86)%\Microsoft\Edge\Application\msedge.exe"
    ) do (
        if exist "%%~p" (
            set EDGE_PATH=%%~p
            goto :foundEdge
        )
    )
    :foundEdge
    if defined EDGE_PATH (
        start "" %EDGE_PATH% "http://localhost:3000" --new-window
    ) else (
        start "" "http://localhost:3000"
    )
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║    🏋️  IronPeak Fitness is Running!                    ║
echo ║                                                          ║
echo ║    URL: http://localhost:3000                            ║
echo ║                                                          ║
echo ║    Admin:  admin@ironpeak.com / admin123                 ║
echo ║    Member: john.doe@email.com / member123                ║
echo ║                                                          ║
echo ║    To stop: Run stop.bat or close this window            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo [IronPeak] Server running. Press any key to STOP the server.
pause >nul

:: Kill the server when user presses a key
call "%~dp0stop.bat" silent
exit /b 0
