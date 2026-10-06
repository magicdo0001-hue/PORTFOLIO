$ErrorActionPreference = 'Stop'
$taskNode = (Get-Command node -ErrorAction Stop).Source
Push-Location -LiteralPath $PSScriptRoot
try {
    & $taskNode (Join-Path $PSScriptRoot 'node_modules\vite\bin\vite.js') --host 127.0.0.1 --port 4190 --strictPort
} finally {
    Pop-Location
}
