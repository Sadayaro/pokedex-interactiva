# Script para subir Pokédex a GitHub automáticamente
# Autor: Sadayaro

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   POKEDEX INTERACTIVA - Deploy a GitHub" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git no encontrado. Por favor instala Git primero." -ForegroundColor Red
    exit 1
}

# Configurar Git si es necesario
$gitUser = git config user.name
$gitEmail = git config user.email

if (!$gitUser) {
    git config user.name "Sadayaro"
    Write-Host "✓ Git user.name configurado" -ForegroundColor Green
}

if (!$gitEmail) {
    git config user.email "sebastian.next@gmail.com"
    Write-Host "✓ Git user.email configurado" -ForegroundColor Green
}

# Verificar autenticación GitHub
Write-Host ""
Write-Host "Verificando autenticación con GitHub..." -ForegroundColor Yellow

$githubAuth = git credential-manager github list 2>$null

if (!$githubAuth) {
    Write-Host ""
    Write-Host "⚠️  No estás autenticado en GitHub." -ForegroundColor Yellow
    Write-Host "Abriendo navegador para autenticar..." -ForegroundColor Cyan
    Write-Host ""
    
    # Intentar autenticación automática
    git credential-manager github login
    
    Start-Sleep -Seconds 3
    
    # Verificar nuevamente
    $githubAuth = git credential-manager github list 2>$null
    
    if (!$githubAuth) {
        Write-Host ""
        Write-Host "Por favor completa la autenticación en tu navegador." -ForegroundColor Yellow
        Write-Host "Presiona cualquier tecla cuando hayas terminado..." -ForegroundColor Cyan
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Verificar si el repositorio existe
Write-Host ""
Write-Host "Verificando repositorio remoto..." -ForegroundColor Yellow

$remotes = git remote -v 2>$null
if (!$remotes -or !$remotes.Contains("origin")) {
    git remote add origin https://github.com/Sadayaro/pokedex-interactiva.git 2>$null
    Write-Host "✓ Repositorio remoto configurado" -ForegroundColor Green
}

# Crear repositorio en GitHub si no existe usando la API
Write-Host ""
Write-Host "Creando repositorio en GitHub (si no existe)..." -ForegroundColor Yellow

try {
    # Intentar crear el repositorio vía API
    $body = @{
        name = "pokedex-interactiva"
        description = "Pokédex interactiva con reconocimiento por cámara y voz en español"
        private = $false
        auto_init = $false
    } | ConvertTo-Json

    # Usar Invoke-RestMethod con autenticación de Git Credential Manager
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue
    Write-Host "✓ Repositorio creado en GitHub" -ForegroundColor Green
} catch {
    # El repositorio probablemente ya existe
    Write-Host "ℹ️  El repositorio ya existe o hay un error (esto es normal)" -ForegroundColor Yellow
}
}

# Push al repositorio
Write-Host ""
Write-Host "Subiendo archivos a GitHub..." -ForegroundColor Yellow
Write-Host "Esto puede tomar unos segundos..." -ForegroundColor Gray
Write-Host ""

git branch -M master 2>$null

# Intentar push
$pushResult = git push -u origin master 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "   ¡ÉXITO! Repositorio subido" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu Pokédex está disponible en:" -ForegroundColor Cyan
    Write-Host "https://github.com/Sadayaro/pokedex-interactiva" -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host "   Error al subir repositorio" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Mensaje de error:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Gray
    Write-Host ""
    Write-Host "Solución manual:" -ForegroundColor Cyan
    Write-Host "1. Abre GitHub Desktop" -ForegroundColor White
    Write-Host "2. Haz clic en 'Publish repository'" -ForegroundColor White
    Write-Host "3. Nombre: pokedex-interactiva" -ForegroundColor White
    Write-Host ""
}

Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
