@echo off
cd /d "%~dp0"
echo Site public: http://127.0.0.1:8787/
echo Panou proprietar: http://127.0.0.1:8787/owner
node local-server.cjs
