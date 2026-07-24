@echo off
setlocal
cd /d "%~dp0"

set TASK_DAILY=ZettaLab_Biomed_Radar_Daily_1000
set TASK_STARTUP=ZettaLab_Biomed_Radar_Startup_Catchup
set SCRIPT=%~dp0一键生成并发送日报.bat

echo [ZettaLab Radar] Installing scheduled tasks...
echo Daily time: 10:00

schtasks /Create /TN "%TASK_DAILY%" /TR "\"%SCRIPT%\"" /SC DAILY /ST 10:00 /F /RL LIMITED
if errorlevel 1 (
  echo [ZettaLab Radar] Failed to create daily task.
  pause
  exit /b 1
)

schtasks /Create /TN "%TASK_STARTUP%" /TR "\"%SCRIPT%\"" /SC ONLOGON /DELAY 0005:00 /F /RL LIMITED
if errorlevel 1 (
  echo [ZettaLab Radar] Failed to create startup catch-up task.
  echo [ZettaLab Radar] Daily 10:00 task has been created.
  pause
  exit /b 1
)

echo.
echo [ZettaLab Radar] Scheduled tasks installed.
echo - %TASK_DAILY% runs every day at 10:00.
echo - %TASK_STARTUP% runs 5 minutes after logon as catch-up.
echo To cancel, run: 一键取消每日定时任务.bat
pause
