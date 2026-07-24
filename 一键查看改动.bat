@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [Git] 当前项目改动：
git status --short
echo.
echo [Git] 最近 5 次保存记录：
git log --oneline -5
pause

