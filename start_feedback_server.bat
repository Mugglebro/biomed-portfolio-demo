@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 8765 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if not errorlevel 1 exit /b 0

start "" /B ".venv\Scripts\pythonw.exe" feedback_server.py
exit /b 0
