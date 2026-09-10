$ErrorActionPreference = 'SilentlyContinue'
try {
  $r = Invoke-WebRequest -Uri 'http://localhost:3200/api/health' -UseBasicParsing -TimeoutSec 5
  Write-Output ("BACKEND:" + $r.StatusCode)
} catch {
  Write-Output ("BACKEND_DOWN:" + $_.Exception.Message)
}
$p = Get-NetTCPConnection -LocalPort 4200 -State Listen -ErrorAction SilentlyContinue
if ($p) { Write-Output "PORT4200:IN_USE" } else { Write-Output "PORT4200:FREE" }
