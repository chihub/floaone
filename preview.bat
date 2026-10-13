@echo off
rem Preview floa.one locally. Double-click this file.
rem Starts the small static file server (unless it is already running), then opens the site.
rem Close the "floa.one preview server" window to stop the server.

cd /d "%~dp0"

powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:8080/ | Out-Null; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  start "floa.one preview server" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0.claude\serve.ps1" -Port 8080
  timeout /t 2 /nobreak >nul
)

start "" http://localhost:8080/
