@echo off
rem UPCT Racing Team - arranca el servidor local en http://localhost:8000 (Windows, sin instalar nada)
title UPCT Racing Team - servidor local
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor-local.ps1"
pause
