$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $projectRoot "backend"
$python311 = "C:\Users\Hanuman Singh\AppData\Local\Programs\Python\Python311\python.exe"

if (-not (Test-Path $python311)) {
  throw "Python 3.11 not found at: $python311"
}

Push-Location $backendDir
try {
  # Ensure runtime deps are present for this interpreter.
  & $python311 -m pip install -r requirements.txt | Out-Host

  Write-Host "Starting backend on http://127.0.0.1:8000 ..."
  & $python311 -m uvicorn main:app --host 127.0.0.1 --port 8000
}
finally {
  Pop-Location
}
