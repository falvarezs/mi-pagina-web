@echo off
echo ====================================
echo Guardando cambios en GitHub...
echo ====================================
git add .
git commit -m "Actualizacion automatica %date% %time%"
git push
echo.
echo ====================================
echo Cambios guardados exitosamente!
echo ====================================
pause