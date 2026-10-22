@echo off
echo ==============================================================
echo        IRON REVOLUTION - RESET & SEED DATABASE
echo ==============================================================
echo Resetting and populating database with demo accounts...
npx.cmd tsx prisma/seed.ts
echo.
echo Database successfully seeded!
pause
