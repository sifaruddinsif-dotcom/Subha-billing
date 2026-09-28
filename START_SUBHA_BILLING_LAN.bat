@echo off
title SUBHA BILLING - Offline LAN
cd /d "%~dp0"
if not exist node_modules (
  echo.
  echo SUBHA BILLING is not installed yet.
  echo Run INSTALL_SUBHA_BILLING_OFFLINE.bat once while Internet is available.
  echo.
  pause
  exit /b 1
)
set DB_PATH=%~dp0subha-billing.db
set JWT_SECRET=subha-billing-local-secret
echo.
echo ==========================================
echo      SUBHA BILLING - OFFLINE LAN
echo ==========================================
echo.
echo Laptop address:
ipconfig | findstr /R /C:"IPv4 Address"
echo.
echo On the same Wi-Fi/hotspot, open on mobile:
echo http://LAPTOP-IP:3000
echo Example: http://192.168.137.1:3000
echo.
echo Keep this window OPEN while using SUBHA BILLING on mobile.
echo.
start "" http://localhost:3000
node server.js
pause
