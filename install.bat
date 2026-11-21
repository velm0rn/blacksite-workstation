@echo off
title BLACKSITE // WORKSTATION INSTALLER
color 0A
cd /d "%~dp0"

echo ============================================================
echo   BLACKSITE CYBER INTELLIGENCE WORKSTATION // SETUP
echo ============================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in your system PATH.
    echo Please install Node.js LTS from https://nodejs.org/ and run this again.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Detected Node.js %NODE_VER%
echo.

:: 2. Install npm dependencies
echo [1/3] Installing dependencies via npm...
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] npm install failed. Check your internet connection and try again.
    pause
    exit /b 1
)

:: 3. Generate the reusable run.bat launcher
echo.
echo [2/3] Generating run.bat launcher...
(
echo @echo off
echo title BLACKSITE // LIVE WORKSTATION SERVER
echo color 0A
echo cd /d "%%~dp0"
echo.
echo echo ============================================================
echo echo   BOOTING BLACKSITE WORKSTATION...
echo echo ============================================================
echo echo.
echo start "" http://localhost:5173
echo call npm run dev
echo pause
) > "%~dp0run.bat"

echo [OK] Created run.bat successfully.
echo.

:: 4. Launch immediately
echo [3/3] Launching BLACKSITE Workstation...
timeout /t 2 /nobreak >nul
call "%~dp0run.bat"