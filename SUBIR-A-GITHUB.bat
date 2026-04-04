@echo off
echo ==========================================
echo   SUBIR A GITHUB - POKEDEX INTERACTIVA
echo ==========================================
echo.
echo PASO 1: Abriendo navegador para autenticar...
echo.
start https://github.com/new

echo.
echo INSTRUCCIONES:
echo 1. Crea un repositorio llamado: pokedex-interactiva
echo 2. NO inicialices con README
echo 3. Copia la URL del repositorio
echo 4. Vuelve aqui y presiona cualquier tecla
echo.
pause >nul

echo.
echo PASO 2: Configurando repositorio remoto...
cd /d "%~dp0"
git remote remove origin 2>nul
git remote add origin https://github.com/Sadayaro/pokedex-interactiva.git
git branch -M master

echo.
echo PASO 3: Subiendo archivos...
git push -u origin master

echo.
echo ==========================================
if %errorlevel% == 0 (
    echo   ¡EXITO! Repositorio subido.
    echo   https://github.com/Sadayaro/pokedex-interactiva
) else (
    echo   ERROR: Intenta subir manualmente desde GitHub Desktop
)
echo ==========================================
echo.
pause
