@echo off
title SUBHA BILLING - Offline
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
start "" http://localhost:3000
node server.js
pause
