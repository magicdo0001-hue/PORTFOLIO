@echo off
setlocal
cd /d "%~dp0"
set "PREVIEW_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "PREVIEW_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
"%PREVIEW_NODE%" scripts\build-rhine-lab.mjs
if errorlevel 1 exit /b 1
"%PREVIEW_NODE%" node_modules\vinext\dist\cli.js dev --host 127.0.0.1 --port 4175
