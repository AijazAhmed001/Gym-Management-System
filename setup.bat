@echo off
setlocal enabledelayedexpansion
title IronPeak Fitness — Setup
color 0A
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║   🏋️  IronPeak Fitness — First Time Setup              ║
echo ║   This will prepare everything on your PC               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

:: ── STEP 1: Check Node.js ────────────────────────────────────────────────────
echo [1/7] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║   ✗ Node.js is NOT installed on this PC!               ║
    echo ║                                                          ║
    echo ║   REQUIRED: Node.js version 18 or higher                ║
    echo ║                                                          ║
    echo ║   1. Opening download page for you...                    ║
    echo ║   2. Download the LTS version                            ║
    echo ║   3. Install it (click Next, Next, Finish)               ║
    echo ║   4. RESTART this computer                               ║
    echo ║   5. Run setup.bat again                                 ║
    echo ╚══════════════════════════════════════════════════════════╝
    echo.
    echo Opening https://nodejs.org ...
    start "" "https://nodejs.org/en/download"
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo     ✓ Node.js %NODE_VER% found

:: ── STEP 2: Create logs folder ───────────────────────────────────────────────
echo [2/7] Creating log folder...
if not exist "logs" mkdir logs
echo     ✓ Logs folder ready

:: ── STEP 3: Install dependencies ─────────────────────────────────────────────
echo [3/7] Installing dependencies (may take 2-3 min on first run)...
if exist "node_modules" (
    echo     ✓ Dependencies already installed, skipping...
) else (
    call npm install --silent 2>> logs\setup.log
    if %errorlevel% neq 0 (
        echo     ✗ npm install FAILED. Check logs\setup.log
        pause
        exit /b 1
    )
    echo     ✓ Dependencies installed
)

:: ── STEP 4: Generate Prisma client ───────────────────────────────────────────
echo [4/7] Setting up database client...
call npx prisma generate >> logs\setup.log 2>&1
if %errorlevel% neq 0 (
    echo     ✗ Prisma generate FAILED. Check logs\setup.log
    pause
    exit /b 1
)
echo     ✓ Database client ready

:: ── STEP 5: Initialize database ──────────────────────────────────────────────
echo [5/7] Setting up database...
if exist "prisma\dev.db" (
    echo     ✓ Database already exists, skipping...
) else (
    call npx prisma db push >> logs\setup.log 2>&1
    call npm run db:seed >> logs\setup.log 2>&1
    if %errorlevel% neq 0 (
        echo     ✗ Database setup FAILED. Check logs\setup.log
        pause
        exit /b 1
    )
    echo     ✓ Database created and seeded with demo data
)

:: ── STEP 6: Build production app ─────────────────────────────────────────────
echo [6/7] Building production app (1-2 min)...
if exist ".next\BUILD_ID" (
    echo     ✓ Production build already exists, skipping...
) else (
    call npm run build >> logs\setup.log 2>&1
    if %errorlevel% neq 0 (
        echo     ✗ Build FAILED. Check logs\setup.log
        pause
        exit /b 1
    )
    echo     ✓ Production build complete
)

:: ── STEP 7: Create Desktop Shortcut ──────────────────────────────────────────
echo [7/7] Creating Desktop shortcut...
set VBS_PATH=%~dp0IronPeak.vbs
set SHORTCUT_PATH=%USERPROFILE%\Desktop\IronPeak Fitness.lnk

powershell -NoProfile -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $sc = $ws.CreateShortcut('%SHORTCUT_PATH%'); ^
   $sc.TargetPath = 'wscript.exe'; ^
   $sc.Arguments = '\"%VBS_PATH%\"'; ^
   $sc.WorkingDirectory = '%~dp0'; ^
   $sc.Description = 'IronPeak Fitness Management Portal'; ^
   $sc.IconLocation = '%~dp0public\favicon.ico'; ^
   $sc.Save()" >nul 2>&1

if exist "%SHORTCUT_PATH%" (
    echo     ✓ Desktop shortcut created: "IronPeak Fitness"
) else (
    echo     ! Shortcut creation skipped (no permission or Desktop path unusual)
    echo     You can still run: double-click IronPeak.vbs in the portal folder
)

:: ── OPTIONAL: Auto-start on Windows Login ────────────────────────────────────
echo.
echo ─────────────────────────────────────────────────────────
echo  Optional: Auto-start server when Windows starts?
echo  This means the portal is always ready without clicking anything.
echo ─────────────────────────────────────────────────────────
set /p autostart=Auto-start on login? (Y/N): 
if /i "%autostart%"=="Y" (
    set STARTUP_VBS=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\IronPeak.vbs
    copy "%~dp0IronPeak.vbs" "!STARTUP_VBS!" >nul 2>&1
    if exist "!STARTUP_VBS!" (
        echo     ✓ Auto-start enabled. Server will start when you log into Windows.
    ) else (
        echo     ! Could not add to startup. You can manually copy IronPeak.vbs to:
        echo       %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\
    )
) else (
    echo     Skipped. You can enable later by copying IronPeak.vbs to your Startup folder.
)

:: ── Done ──────────────────────────────────────────────────────────────────────
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║   ✓ SETUP COMPLETE!                                    ║
echo ║                                                          ║
echo ║   HOW TO USE:                                            ║
echo ║   • Double-click "IronPeak Fitness" on your Desktop      ║
echo ║   • Or run: IronPeak.vbs in this folder                  ║
echo ║                                                          ║
echo ║   DEMO CREDENTIALS:                                      ║
echo ║   Admin:  admin@ironpeak.com  / admin123                 ║
echo ║   Member: john.doe@email.com  / member123                ║
echo ║                                                          ║
echo ║   Portal URL: http://localhost:3000                      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

set /p launch=Launch IronPeak Fitness now? (Y/N): 
if /i "%launch%"=="Y" (
    start "" wscript.exe "%~dp0IronPeak.vbs"
)

echo.
echo Setup log saved to: logs\setup.log
pause
