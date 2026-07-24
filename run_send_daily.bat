@echo off
setlocal
cd /d "%~dp0"

echo [ZettaLab Radar] Start fetch and send mode.

if not exist ".venv\Scripts\python.exe" (
  echo [ZettaLab Radar] Creating local .venv ...
  py -3.11 -m venv .venv
  if errorlevel 1 python -m venv .venv
  if errorlevel 1 (
    echo [ZettaLab Radar] Failed to create .venv. Please install Python 3.10+.
    exit /b 1
  )
)

".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
  echo [ZettaLab Radar] Failed to install dependencies.
  exit /b 1
)

".venv\Scripts\python.exe" main.py --excel "auto_news_cn.xlsx" --fetch --send --verbose
if errorlevel 1 (
  echo [ZettaLab Radar] Run or email sending failed. Please check logs and .env.
  exit /b 1
)

echo [ZettaLab Radar] Done.
