@echo off
title Citizens' Rights & Legal Awareness Platform (Nepal)
echo ====================================================================
echo   Starting Citizens' Rights & Legal Awareness Platform (Nepal)
echo   "Your Rights. Your Laws. Your Knowledge."
echo ====================================================================
echo.
echo Opening browser at http://localhost:3000 ...
start http://localhost:3000
echo.
echo Server running on port 3000. Press Ctrl+C to terminate.
echo.
where agy-node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    agy-node server.js
) else (
    node server.js
)
pause
