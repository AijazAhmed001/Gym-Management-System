@echo off
cd /d "%~dp0"
title IronPeak Fitness — Database Reset

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║          ⚠  DATABASE RESET WARNING                     ║
echo ║                                                          ║
echo ║  This will DELETE all data and restore demo data.        ║
echo ║  Members, workouts, bookings will be LOST.               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
set /p confirm=Type YES to continue, anything else to cancel: 
if /i not "%confirm%"=="YES" (
    echo Cancelled. No changes made.
    pause
    exit /b 0
)

echo.
echo [1/3] Stopping server if running...
call "%~dp0stop.bat" silent

echo [2/3] Resetting database...
call npx prisma db push --force-reset >> logs\reset.log 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Database reset failed. Check logs\reset.log
    pause
    exit /b 1
)

echo [3/3] Seeding demo data...
call npm run db:seed >> logs\reset.log 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Seeding failed. Check logs\reset.log
    pause
    exit /b 1
)

echo.
echo ✓ Database reset complete! Demo data restored.
echo   Admin:  admin@ironpeak.com / admin123
echo   Member: john.doe@email.com / member123
echo.
pause
