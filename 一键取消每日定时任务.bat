@echo off
setlocal

set TASK_DAILY=ZettaLab_Biomed_Radar_Daily_1000
set TASK_STARTUP=ZettaLab_Biomed_Radar_Startup_Catchup

echo [ZettaLab Radar] Removing scheduled tasks...
schtasks /Delete /TN "%TASK_DAILY%" /F
schtasks /Delete /TN "%TASK_STARTUP%" /F

echo.
echo [ZettaLab Radar] Scheduled tasks removed if they existed.
pause
