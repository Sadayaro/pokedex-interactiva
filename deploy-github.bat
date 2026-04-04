@echo off
chcp 65001 >nul
echo ==========================================
echo   POKEDEX INTERACTIVA - Deploy a GitHub
echo ==========================================
echo.
echo Este script subirá tu Pokédex a GitHub
echo.

REM Verificar si gh está instalado
where gh >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/4] Instalando GitHub CLI...
    winget install --id GitHub.cli --accept-package-agreements --accept-source-agreements
    echo Por favor cierra y vuelve a abrir la terminal después de instalar
    pause
    exit
)

echo [1/4] GitHub CLI detectado
echo.

REM Verificar autenticación
echo [2/4] Verificando autenticación...
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo Necesitas iniciar sesión en GitHub
    gh auth login --web
    echo.
    echo Por favor completa la autenticación en tu navegador
echo y luego presiona cualquier tecla para continuar...
    pause >nul
)

echo [2/4] Autenticación verificada
echo.

REM Crear repositorio si no existe
echo [3/4] Creando repositorio en GitHub...
gh repo create pokedex-interactiva --public --description "Pokédex interactiva con reconocimiento por cámara y voz en español" --source=. --remote=origin --push 2>nul

if %errorlevel% neq 0 (
    echo El repositorio ya existe o hay un error. Intentando push...
    git push -u origin master
)

echo [3/4] Repositorio configurado
echo.

REM Push final
echo [4/4] Subiendo archivos...
git push -u origin master

echo.
echo ==========================================
echo   ¡POKEDEX SUBIDA EXITOSAMENTE!
echo ==========================================
echo.
echo Tu Pokédex está disponible en:
echo https://github.com/Sadayaro/pokedex-interactiva
echo.
pause
