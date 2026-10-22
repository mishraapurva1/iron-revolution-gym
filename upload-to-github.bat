@echo off
setlocal enabledelayedexpansion

echo ==============================================================
echo      IRON REVOLUTION 2.0 - GITHUB UPLOAD HELPER
echo ==============================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not detected in your PATH.
    echo If you just installed Git, please close and reopen this terminal window,
    echo or download Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking Git repository initialization...
if not exist ".git" (
    echo Initializing local git repository on branch main...
    git init -b main
) else (
    echo Local git repository already exists.
    git branch -M main
)

echo.
echo [2/4] Staging project files...
git add .

echo.
echo [3/4] Creating commit...
git commit -m "Initial commit: IRON REVOLUTION 2.0 Web-Based Gym Management System by Apurva Mishra"

echo.
echo [4/4] Remote repository connection...
set "CURRENT_ORIGIN="
for /f "tokens=*" %%a in ('git remote get-url origin 2^>nul') do set "CURRENT_ORIGIN=%%a"

if defined CURRENT_ORIGIN (
    echo Current remote origin: %CURRENT_ORIGIN%
    set /p "CHANGE_ORIGIN=Do you want to change this GitHub URL? (y/N): "
    if /i "!CHANGE_ORIGIN!"=="y" (
        set /p "REPO_URL=Enter your GitHub repository URL (e.g. https://github.com/username/repo.git): "
        git remote set-url origin !REPO_URL!
    )
) else (
    echo Please create an empty repository on https://github.com/new first.
    echo (Do NOT initialize it with README, .gitignore, or license)
    echo.
    set /p "REPO_URL=Enter your GitHub repository URL: "
    git remote add origin !REPO_URL!
)

echo.
echo Pushing to GitHub (main branch)...
echo If prompted, authenticate in the browser or enter your GitHub Personal Access Token.
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==============================================================
    echo [SUCCESS] Your project has been uploaded to GitHub successfully!
    echo ==============================================================
) else (
    echo.
    echo ==============================================================
    echo [NOTICE] If the push failed due to authentication:
    echo 1. Ensure your GitHub repo URL is correct.
    echo 2. If GitHub asks for a password, use a Personal Access Token:
    echo    GitHub -> Settings -> Developer Settings -> Personal Access Tokens (Tokens classic).
    echo ==============================================================
)

echo.
pause
