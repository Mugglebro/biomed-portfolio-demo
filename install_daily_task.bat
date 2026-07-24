@echo off
setlocal
cd /d "%~dp0"

set TASK_DAILY=ZettaLab_Biomed_Radar_Daily_1000
set SCRIPT=%~dp0run_send_daily.bat

echo [ZettaLab Radar] Installing scheduled tasks...
echo Daily time: 10:00

schtasks /Create /TN "%TASK_DAILY%" /TR "\"%SCRIPT%\"" /SC DAILY /ST 10:00 /F /RL LIMITED
if errorlevel 1 (
  echo [ZettaLab Radar] Failed to create daily task.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$task=Get-ScheduledTask -TaskName '%TASK_DAILY%'; $task.Settings.StartWhenAvailable=$true; $task.Settings.DisallowStartIfOnBatteries=$false; $task.Settings.StopIfGoingOnBatteries=$false; Set-ScheduledTask -InputObject $task | Out-Null"

echo.
echo [ZettaLab Radar] Scheduled tasks installed.
echo - %TASK_DAILY% runs every day at 10:00.
echo - If the computer was off at 10:00, Windows will run it as soon as possible after startup/login.
echo To cancel, run: cancel_daily_task.bat
pause
