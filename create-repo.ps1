$headers = @{
    'Accept' = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
    'Authorization' = 'Bearer ' + (git credential-manager github token 2>$null | Select-String -Pattern 'password=(.+)$' | ForEach-Object { $_.Matches.Groups[1].Value })
}

Invoke-RestMethod -Uri 'https://api.github.com/user/repos' -Method POST -Headers $headers -Body '{"name":"pokedex-interactiva","description":"Pokédex interactiva con reconocimiento por cámara y voz en español","private":false}' -ContentType 'application/json'
