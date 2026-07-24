@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [Git] 保存前状态：
git status --short
echo.
set /p msg=请输入本次保存说明，例如：完善网页工作台原型：
if "%msg%"=="" set msg=保存项目更新
git add .
git commit -m "%msg%"
echo.
echo [Git] 最近保存记录：
git log --oneline -5
pause

