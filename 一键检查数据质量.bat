@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo [ZettaLab Radar] .venv not found. Please run daily digest first.
  pause
  exit /b 1
)

".venv\Scripts\python.exe" main.py --excel "auto_news_cn.xlsx" --validate-only --verbose
echo.
pause
