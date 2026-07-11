@echo off
cd /d "%~dp0"
echo Opening local preview...
start "Oms Preview Server" powershell.exe -NoProfile -ExecutionPolicy Bypass -NoExit -File "%~dp0.local-server.ps1"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5500/old-home#charan-vandan"
