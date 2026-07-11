@echo off
cd /d "%~dp0"
echo Starting local preview server...
echo.
echo Main homepage:
echo   http://127.0.0.1:5500/
echo.
echo Charan-Vandan section:
echo   http://127.0.0.1:5500/old-home#charan-vandan
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0.local-server.ps1"
echo.
echo Server stopped.
pause
