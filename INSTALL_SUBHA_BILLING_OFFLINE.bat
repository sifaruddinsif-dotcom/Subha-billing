@echo off
title SUBHA BILLING - Offline Setup
cd /d "%~dp0"
echo.
echo ==========================================
echo        SUBHA BILLING OFFLINE SETUP
echo ==========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install Node.js 20+ first, then run this file again.
  pause
  exit /b 1
)
node -v
echo.
echo Installing local dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo Installation failed. Please check the error above.
  pause
  exit /b 1
)
echo.
echo Setup complete.
echo Your local database will be stored as:
echo %~dp0subha-billing.db
echo.
echo You can now use START_SUBHA_BILLING_OFFLINE.bat
pause
