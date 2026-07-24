@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo [ZettaLab Radar] .venv not found. Please run daily digest first.
  pause
  exit /b 1
)

".venv\Scripts\python.exe" test_mail.py
if errorlevel 1 (
  echo [ZettaLab Radar] Test email failed. Please check .env SMTP settings.
  pause
  exit /b 1
)

echo [ZettaLab Radar] Test email sent.
pause
