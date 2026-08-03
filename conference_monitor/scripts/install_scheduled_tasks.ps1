$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Runner = Join-Path $Root "scripts\run_daily.cmd"
$TaskDaily = "WeChatBiomedConferenceMonitor_Daily10"
$TaskLogon = "WeChatBiomedConferenceMonitor_LogonCatchup"

if (-not (Test-Path $Runner)) {
  throw "Cannot find run_daily.cmd at $Runner"
}

$Action = New-ScheduledTaskAction -Execute $Runner -WorkingDirectory $Root
$TriggerDaily = New-ScheduledTaskTrigger -Daily -At 10:00
$TriggerLogon = New-ScheduledTaskTrigger -AtLogOn
$Settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew
$Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $TaskDaily -Action $Action -Trigger $TriggerDaily -Settings $Settings -Principal $Principal -Force | Out-Null

$logonInstalled = $false
try {
  Register-ScheduledTask -TaskName $TaskLogon -Action $Action -Trigger $TriggerLogon -Settings $Settings -Principal $Principal -Force | Out-Null
  $logonInstalled = $true
} catch {
  $Startup = [Environment]::GetFolderPath("Startup")
  $ShortcutPath = Join-Path $Startup "WeChatBiomedConferenceMonitor_LogonCatchup.lnk"
  $Shell = New-Object -ComObject WScript.Shell
  $Shortcut = $Shell.CreateShortcut($ShortcutPath)
  $Shortcut.TargetPath = $Runner
  $Shortcut.WorkingDirectory = $Root
  $Shortcut.Description = "Run WeChat biomedical conference monitor at user logon"
  $Shortcut.Save()
}

Write-Host "Installed scheduled tasks:"
Write-Host " - ${TaskDaily}: daily at 10:00, start when available"
if ($logonInstalled) {
  Write-Host " - ${TaskLogon}: run at user logon and send only if today's report was not sent"
} else {
  Write-Host " - Startup shortcut: run at user logon and send only if today's report was not sent"
}
