@echo off
setlocal

set TASK_DAILY=ZettaLab_Biomed_Radar_Daily_1000

echo [ZettaLab Radar] Cancelling scheduled tasks...
schtasks /Delete /TN "%TASK_DAILY%" /F

echo [ZettaLab Radar] Done.
pause
