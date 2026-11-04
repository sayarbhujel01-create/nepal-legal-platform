@echo off
title Push Nepal Citizens Rights Platform to GitHub
echo ====================================================================
echo   Push Project to GitHub
echo ====================================================================
echo.

where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not detected on your system PATH.
    echo.
    echo 1. Download and install Git: https://git-scm.com/download/win
    echo    (Or in a standard PowerShell terminal, run: winget install --id Git.Git -e)
    echo 2. Once installed, re-run this script to push automatically.
    echo.
    pause
    exit /b 1
)

echo [1/4] Initializing local Git repository...
git init
echo [2/4] Staging all platform files and seeded SQLite database...
git add .
echo [3/4] Creating initial commit...
git commit -m "feat: complete citizens rights & legal awareness platform for Nepal"
git branch -M main

echo.
echo Please create a new empty repository on your GitHub account (https://github.com/new).
set /p REPO_URL="Enter your GitHub repository URL (e.g. https://github.com/USERNAME/nepal-legal-platform.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL entered.
    pause
    exit /b 1
)

echo.
echo [4/4] Adding remote origin and pushing to GitHub...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ====================================================================
echo   Pushed successfully to GitHub!
echo ====================================================================
pause
