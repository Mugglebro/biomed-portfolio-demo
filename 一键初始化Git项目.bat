@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [Git] 初始化当前项目仓库...
git init
git config user.name "Zhong"
git config user.email "local-radar@example.com"
echo.
echo [Git] 初始化完成。下一步请运行：一键审核项目.bat
pause

