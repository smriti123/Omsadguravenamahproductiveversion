@echo off
cd /d "%~dp0"
echo Running pre-deploy checks...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\check-site-preflight.ps1"
echo.
if errorlevel 1 (
  echo Pre-deploy check failed. Do not upload yet.
  pause
  exit /b 1
)
echo Pre-deploy check passed. This build is ready to upload.
pause
