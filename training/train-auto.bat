@echo off
chcp 65001 >nul
title Entrenamiento Automático de Modelo CNN para Pokémon
cls

echo ============================================
echo   🎮 ENTRENAMIENTO AUTOMÁTICO DE MODELO CNN
echo   Para reconocimiento de 151 Pokémon
echo ============================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo Por favor instala Node.js 16+ desde:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detectado:
node --version
echo.

REM Crear directorio de training si no existe
if not exist "..\training" (
    echo ❌ ERROR: No se encuentra el directorio 'training'
    echo Asegúrate de ejecutar este script desde la carpeta correcta.
    pause
    exit /b 1
)

cd ..\training

echo 📦 Paso 1/4: Instalando dependencias...
echo ----------------------------------------
call npm install
if errorlevel 1 (
    echo ❌ ERROR: Falló la instalación de dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

echo 🖼️  Paso 2/4: Descargando dataset de imágenes...
echo ----------------------------------------
echo Esto descargará ~7,500 imágenes de los 151 Pokémon
echo Puede tardar varios minutos...
echo.
node download-images.js
if errorlevel 1 (
    echo ❌ ERROR: Falló la descarga de imágenes
    pause
    exit /b 1
)
echo ✅ Dataset descargado
echo.

echo 🧠 Paso 3/4: Creando modelo CNN base...
echo ----------------------------------------
node create-model.js
if errorlevel 1 (
    echo ❌ ERROR: Falló la creación del modelo
    pause
    exit /b 1
)
echo ✅ Modelo CNN creado
echo.

echo 🚀 Paso 4/4: Entrenando modelo...
echo ----------------------------------------
echo ⚠️  Este proceso puede tardar 30-60 minutos
echo    (10x más rápido con GPU)
echo.
echo Presiona cualquier tecla para comenzar el entrenamiento...
pause >nul

node train.js
if errorlevel 1 (
    echo ❌ ERROR: Falló el entrenamiento
    pause
    exit /b 1
)

echo.
echo ============================================
echo   ✅ ENTRENAMIENTO COMPLETADO
echo ============================================
echo.
echo El modelo ha sido guardado en:
echo   training/model/
echo   pokemon-model/ (copia para la web)
echo.
echo Instrucciones:
echo 1. Abre la Pokédex en tu navegador
echo 2. Haz clic en "🔧 Estado del Modelo"
echo 3. Verás "Modelo CNN: ✅ Entrenado"
echo 4. El reconocimiento ahora tendrá 75-85%% de precisión
echo.
pause
