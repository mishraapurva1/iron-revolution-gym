@echo off
setlocal enabledelayedexpansion

echo ==============================================================
echo      IRON REVOLUTION 2.0 - GITHUB UPLOAD HELPER
echo ==============================================================
echo Repository: https://github.com/mishraapurva1/iron-revolution-gym.git
echo.

:: Ensure Git is in PATH
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

echo [1/3] Checking Git status...
git branch -M main

echo [2/3] Verifying commit...
git add .
git commit -m "Initial commit: IRON REVOLUTION 2.0 Web-Based Gym Management System by Apurva Mishra" 2>nul

echo [3/3] Setting remote origin...
git remote set-url origin https://github.com/mishraapurva1/iron-revolution-gym.git 2>nul || git remote add origin https://github.com/mishraapurva1/iron-revolution-gym.git

echo.
echo ==============================================================
echo Pushing your files to GitHub...
echo (A browser window or GitHub sign-in prompt will appear if you
echo are not already signed in. Please click 'Sign in' to allow)
echo ==============================================================
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==============================================================
    echo [SUCCESS] IRON REVOLUTION 2.0 uploaded to GitHub successfully!
    echo View it at: https://github.com/mishraapurva1/iron-revolution-gym
    echo ==============================================================
) else (
    echo.
    echo ==============================================================
    echo [PUSH NOTICE]
    echo If the push failed with an authentication or permission error:
    echo 1. Make sure you are signed into your GitHub account: mishraapurva1
    echo 2. If prompted for password, GitHub requires a Personal Access Token:
    echo    - Open https://github.com/settings/tokens
    echo    - Generate new token (classic) with 'repo' scope
    echo    - Use your token as the password
    echo ==============================================================
)

echo.
pause
