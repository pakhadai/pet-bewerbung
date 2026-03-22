# Kill common Vite ports then start dev server (run: powershell -File scripts/restart-dev.ps1)
$ErrorActionPreference = 'SilentlyContinue'
$ports = 3000, 3001, 5173
foreach ($port in $ports) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Set-Location $PSScriptRoot\..
npx vite --port 3000 --host
