$token = "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"

$headers = @{
    'Authorization' = "Bearer $token"
    'Accept' = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
}

$body = @{
    name = "pokedex-interactiva"
    description = "Pokédex interactiva con reconocimiento por cámara y voz en español"
    private = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri 'https://api.github.com/user/repos' -Method POST -Headers $headers -Body $body -ContentType 'application/json'
    Write-Host "✓ Repositorio creado exitosamente!" -ForegroundColor Green
    Write-Host "URL: $($response.html_url)" -ForegroundColor Cyan
    exit 0
} catch {
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "ℹ️  El repositorio ya existe" -ForegroundColor Yellow
        exit 0
    }
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
