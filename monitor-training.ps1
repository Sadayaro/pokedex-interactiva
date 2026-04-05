# Monitor script for training
param()

$LogFile = "training.log"
$WeightsFile = "public/pokemon-model/weights.bin"
$InitialSize = (Get-Item $WeightsFile).Length
$InitialTime = (Get-Item $WeightsFile).LastWriteTime

Write-Host "====================================="
Write-Host "Monitor de Entrenamiento iniciado"
Write-Host "====================================="
Write-Host "Hora inicio: $(Get-Date)"
Write-Host "Tamaño inicial weights.bin: $([math]::Round($InitialSize/1MB, 2)) MB"
Write-Host ""
Write-Host "Monitoreando... (Ctrl+C para detener)"
Write-Host ""

$CheckCount = 0
while ($true) {
    Start-Sleep -Seconds 30
    $CheckCount++
    
    # Verificar procesos Node
    $NodeProcesses = Get-Process node -ErrorAction SilentlyContinue
    $CurrentSize = (Get-Item $WeightsFile).Length
    $CurrentTime = (Get-Item $WeightsFile).LastWriteTime
    
    $Timestamp = Get-Date -Format "HH:mm:ss"
    
    if (-not $NodeProcesses) {
        Write-Host "[$Timestamp] PROCESOS NODE DETENIDOS"
        if ($CurrentSize -ne $InitialSize -or $CurrentTime -ne $InitialTime) {
            Write-Host "[$Timestamp] ENTRENAMIENTO COMPLETADO!"
            Write-Host "[$Timestamp] Tamaño final: $([math]::Round($CurrentSize/1MB, 2)) MB"
            Write-Host "[$Timestamp] Guardado: $CurrentTime"
            Write-Host ""
            Write-Host "====================================="
            Write-Host "NOTIFICACION: El modelo ha sido entrenado"
            Write-Host "====================================="
            break
        } else {
            Write-Host "[$Timestamp] Entrenamiento fallo (archivo no actualizado)"
            break
        }
    }
    
    # Mostrar progreso cada 5 minutos (10 checks = 5 min)
    if ($CheckCount % 10 -eq 0) {
        $Minutes = ($CheckCount * 30) / 60
        Write-Host "[$Timestamp] Entrenando... ($Minutes minutos transcurridos)"
        
        # Mostrar ultima linea del log
        $LastLine = Get-Content $LogFile -Tail 1 -ErrorAction SilentlyContinue
        if ($LastLine -match "Epoch|epoch|loss|accuracy") {
            Write-Host "[$Timestamp] $LastLine"
        }
    }
}
