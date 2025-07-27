@echo off
echo ====================================
echo Ejecutando pruebas en Angular 20.1.0
echo ====================================
echo.

echo Verificando version de Angular...
cmd /c "npx ng version | findstr Angular"
echo.

echo Ejecutando pruebas unitarias con coverage...
echo.

npm run test:coverage

echo.
echo ====================================
echo Las pruebas han finalizado.
echo El reporte de coverage se encuentra en: coverage/ntt-data-frontend/index.html
echo ====================================
pause
