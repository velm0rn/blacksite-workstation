@echo off
title BLACKSITE // LIVE WORKSTATION SERVER
color 0A
cd /d "%~dp0"

echo ============================================================
echo   BOOTING BLACKSITE WORKSTATION...
echo ============================================================
echo.
start "" http://localhost:5173
call npm run dev
pause
