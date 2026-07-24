@echo off
setlocal
cd /d "%~dp0"

echo [ZettaLab Radar] Start daily digest.

if not exist ".venv\Scripts\python.exe" (
  echo [ZettaLab Radar] Creating local .venv ...
  py -3.11 -m venv .venv
  if errorlevel 1 python -m venv .venv
  if errorlevel 1 (
    echo [ZettaLab Radar] Failed to create .venv. Please install Python 3.10+.
    pause
    exit /b 1
  )
)

echo [ZettaLab Radar] Checking dependencies ...
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
  echo [ZettaLab Radar] Failed to install dependencies.
  pause
  exit /b 1
)

echo [ZettaLab Radar] Fetching RSS news and building digest ...
".venv\Scripts\python.exe" main.py --excel "auto_news_cn.xlsx" --fetch --dry-run --verbose
if errorlevel 1 (
  echo [ZettaLab Radar] Run failed. Please check the logs folder.
  pause
  exit /b 1
)

echo.
echo [ZettaLab Radar] Done.
echo Master Excel: %cd%\auto_news_cn.xlsx
echo Daily Excel : %cd%\outputs\auto_news_cn_YYYYMMDD.xlsx
echo Digest TXT  : %cd%\outputs\zettalab_digest_YYYYMMDD.txt
echo Digest HTML : %cd%\outputs\zettalab_digest_YYYYMMDD.html
echo.
pause
