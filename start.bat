@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo node_modules topilmadi, o`rnatilmoqda...
  call npm install
)
echo Tasvir AI ishga tushmoqda...
call npm run dev
pause
