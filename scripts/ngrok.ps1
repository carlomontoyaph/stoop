# ngrok.ps1 — Start dev server + ngrok tunnel in one step
#
# Usage:  .\scripts\ngrok.ps1
# Requires: Node.js, npm, ngrok (https://ngrok.com/download)
#
# The dev server runs in the background; ngrok runs in the foreground.
# Press Ctrl+C to stop ngrok. The dev server job will be cleaned up automatically.

$job = Start-Job -ScriptBlock { Set-Location $using:PWD; npm run dev }
Write-Host "Dev server starting on http://localhost:5173 ..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
Write-Host "Starting ngrok tunnel..." -ForegroundColor Cyan
ngrok http 5173
Stop-Job $job; Remove-Job $job
