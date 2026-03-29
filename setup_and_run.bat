@echo off
SETLOCAL EnableDelayedExpansion

:: --- CONFIGURATION ---
SET PYTHON_CMD=python
SET PORT=8000
:: --- END CONFIGURATION ---

echo ======================================================
echo   OTS2 DEPLOYMENT TOOL (DEBUG MODE)
echo ======================================================
echo.

:: 1. Check Python
echo [1/5] Checking Prerequisites...
%PYTHON_CMD% --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [RETRY] 'python' not found, trying 'python3'...
    SET PYTHON_CMD=python3
    !PYTHON_CMD! --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo [ERROR] Python not found. Please install Python 3.10+ and check 'Add to PATH'.
        pause
        exit /b 1
    )
)
echo Python found: 
%PYTHON_CMD% --version

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js (LTS version).
    pause
    exit /b 1
)
echo Node.js found: 
node --version

:: 2. Setup Backend
echo.
echo [2/5] Setting up Backend...
if not exist "backend" (
    echo [ERROR] 'backend' folder not found. Are you running this from the project root?
    pause
    exit /b 1
)

pushd backend
if not exist ".venv" (
    echo Creating virtual environment...
    %PYTHON_CMD% -m venv .venv
)

echo Installing/Updating backend dependencies...
call .venv\Scripts\activate
pip install -r requirements.txt

if not exist ".env" (
    echo Creating default .env file...
    echo SECRET_KEY=django-insecure-prod-key-%RANDOM% > .env
    echo DEBUG=False >> .env
    echo ALLOWED_HOSTS=* >> .env
)

echo Running migrations...
python manage.py migrate
echo Collecting static files...
python manage.py collectstatic --noinput
popd

:: 3. Build Frontend
echo.
echo [3/5] Building Frontend...
if not exist "frontend" (
    echo [ERROR] 'frontend' folder not found.
    pause
    exit /b 1
)

pushd frontend
echo Installing frontend dependencies (this may take a minute)...
call npm install
echo Building React app...
call npm run build
popd

echo.
echo ======================================================
echo   SETUP COMPLETE!
echo ======================================================
echo.
echo To start the server manually later, run:
echo   cd backend ^&^& .venv\Scripts\activate ^&^& waitress-serve --port=8000 core.wsgi:application
echo.
echo [5/5] Starting Server Now...
echo Access the site at: http://localhost:%PORT%
echo.

pushd backend
:: Use the full path to waitress-serve to be safe
.venv\Scripts\waitress-serve --port=%PORT% core.wsgi:application
popd

pause
