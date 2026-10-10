@echo off
setlocal
cd /d "%~dp0source_code"
python app.py
if errorlevel 1 (
    echo.
    echo Could not start EconLand. Make sure Python and Flask are installed.
    pause
)
