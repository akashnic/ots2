@echo off
SETLOCAL EnableDelayedExpansion

:: --- CONFIGURATION ---
SET PYTHON_VERSION=3.10
SET NODE_VERSION=18
SET PORT=8000
:: --- END CONFIGURATION ---

echo [1/5] Checking Prerequisites...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python %PYTHON_VERSION%+ and add it to PATH.
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js (LTS version).
    pause
    exit /b 1
)

echo [2/5] Setting up Backend...
cd backend
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate
echo Installing backend dependencies...
pip install -r requirements.txt

if not exist ".env" (
    echo Creating .env from template...
    echo SECRET_KEY=django-insecure-prod-key-%RANDOM% > .env
    echo DEBUG=False >> .env
    echo ALLOWED_HOSTS=* >> .env
)

echo Running migrations...
python manage.py migrate
python manage.py collectstatic --noinput

echo [3/5] Building Frontend...
cd ../frontend
echo Installing frontend dependencies...
npm install
echo Building React app...
npm run build

echo [4/5] Preparing Final Steps...
cd ..

echo.
echo ======================================================
echo   SETUP COMPLETE!
echo ======================================================
echo.
echo Your application is ready to run.
echo.
echo To start the server manually later, run:
echo   cd backend ^&^& .venv\Scripts\activate ^&^& waitress-serve --port=8000 core.wsgi:application
echo.
echo [5/5] Starting Server Now...
cd backend
waitress-serve --port=%PORT% core.wsgi:application

pause
