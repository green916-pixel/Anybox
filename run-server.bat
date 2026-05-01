@echo off
REM AnyBox - Start Local Server
REM This batch file starts the Python HTTP server on port 8000

title AnyBox - Local Server
cd /d "%~dp0"

echo.
echo ============================================
echo     AnyBox - Video Link Player
echo     Local Server Starting...
echo ============================================
echo.
echo Your site will be available at:
echo   http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

python -m http.server 8000

pause
