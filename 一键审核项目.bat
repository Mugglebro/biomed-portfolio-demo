@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [Audit] 检查 JavaScript 语法...
node --check "biomed_radar_web\app.js"
echo.
echo [Audit] 检查是否包含常见敏感信息...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$exclude=@('.git','.venv','logs','outputs','backups','feedback','cloud_feedback','cloud_feedback_pages','portfolio','portfolio_demo','__pycache__'); $files=Get-ChildItem -Recurse -File -Include *.py,*.js,*.html,*.css,*.md,*.yaml,*.yml,*.json,*.bat | Where-Object { $p=$_.FullName; -not ($exclude | Where-Object { $p -like ('*\' + $_ + '\*') }) }; $files | Select-String -Pattern '真实密码|真实授权码|@yanyin\.tech|[A-Za-z0-9]{16,}' | ForEach-Object { $_.Path + ':' + $_.LineNumber + ' ' + $_.Line }"
echo.
echo [Audit] 若上方没有敏感信息命中，说明基础审核通过。
pause
