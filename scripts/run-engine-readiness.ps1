# Engine readiness debug script — run tests and optional health checks.
# Usage: .\scripts\run-engine-readiness.ps1 [-ApiBaseUrl "http://localhost:5000"]
# Requires: Python 3.11+ with pytest (pip install -r requirements-test.txt), .NET 10 for engine-api.

param([string]$ApiBaseUrl = "")

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
if (-not $Root) { $Root = (Get-Location).Path }
Set-Location $Root

$ConfigPath = Join-Path $Root "config\engine-readiness.json"
if (-not (Test-Path $ConfigPath)) {
    Write-Host "Config not found: $ConfigPath" -ForegroundColor Red
    exit 1
}
$Config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
$Checks = $Config.checks.PSObject.Properties

Write-Host "=== NEXUS Engine Readiness Check ===" -ForegroundColor Cyan
Write-Host ""

# Python / pytest
$pythonCmd = $null
foreach ($cmd in @("python", "python3", "py")) {
    try {
        $v = & $cmd --version 2>&1
        if ($LASTEXITCODE -eq 0) { $pythonCmd = $cmd; break }
    } catch {}
}
$pytestOk = $false
if ($pythonCmd) {
    try {
        $null = & $pythonCmd -m pytest --version 2>&1
        $pytestOk = $LASTEXITCODE -eq 0
    } catch {}
}
if (-not $pytestOk) {
    Write-Host "Python/pytest: Install with: pip install -r requirements-test.txt" -ForegroundColor Yellow
} else {
    Write-Host "Python: $pythonCmd | pytest: OK" -ForegroundColor Green
}

# .NET
$dotnetVersion = $null
try {
    $dotnetVersion = dotnet --version 2>&1
} catch {}
$dotnet10 = $dotnetVersion -match "10\."
Write-Host ".NET: $dotnetVersion" -NoNewline
if ($dotnet10) { Write-Host " (OK for engine-api)" -ForegroundColor Green } else { Write-Host " (engine-api needs .NET 10)" -ForegroundColor Yellow }
Write-Host ""

$Results = @{}
foreach ($prop in $Checks) {
    $name = $prop.Name
    $c = $prop.Value
    $Results[$name] = @{ tests = "skip"; health = "skip" }
    $path = Join-Path $Root $c.path

    if ($c.tests -eq $true -and (Test-Path $path)) {
        if ($c.dotnet -eq $true) {
            if ($dotnet10) {
                Push-Location (Join-Path $Root "engine-api")
                try {
                    $out = dotnet test -v q 2>&1
                    if ($LASTEXITCODE -eq 0) { $Results[$name].tests = "pass" } else { $Results[$name].tests = "fail" }
                } catch { $Results[$name].tests = "error" }
                finally { Pop-Location }
            } else {
                $Results[$name].tests = "skip (.NET 10 required)"
            }
        } else {
            if ($pytestOk) {
                Push-Location $path
                try {
                    $out = & $pythonCmd -m pytest . -v --tb=line -q 2>&1
                    if ($LASTEXITCODE -eq 0) { $Results[$name].tests = "pass" } else { $Results[$name].tests = "fail" }
                } catch { $Results[$name].tests = "error" }
                finally { Pop-Location }
            } else {
                $Results[$name].tests = "skip (pytest)"
            }
        }
    }

    if ($c.health -eq $true -and $c.healthPath -and $ApiBaseUrl) {
        try {
            $url = $ApiBaseUrl.TrimEnd("/") + $c.healthPath
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
            if ($r.StatusCode -eq 200) { $Results[$name].health = "pass" } else { $Results[$name].health = "fail" }
        } catch {
            $Results[$name].health = "fail (API not reachable?)"
        }
    }
}

Write-Host "--- Results ---" -ForegroundColor Cyan
foreach ($name in $Results.Keys | Sort-Object) {
    $r = $Results[$name]
    $t = $r.tests
    $h = $r.health
    $tc = if ($t -eq "pass") { "Green" } elseif ($t -eq "fail" -or $t -eq "error") { "Red" } else { "Gray" }
    $hc = if ($h -eq "pass") { "Green" } elseif ($h -eq "fail") { "Red" } else { "Gray" }
    Write-Host ("  {0,-22} tests: " -f $name) -NoNewline
    Write-Host $t -ForegroundColor $tc -NoNewline
    Write-Host "  | health: " -NoNewline
    Write-Host $h -ForegroundColor $hc
}
Write-Host ""
Write-Host "Done. Fix failing tests or install .NET 10 / pytest to run full check." -ForegroundColor Cyan
