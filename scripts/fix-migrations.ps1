$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Database Migration Fix..." -ForegroundColor Cyan

# --- Environment Setup (Handle missing PATH) ---
$DotnetPath = "dotnet"
$EfPath = "dotnet-ef"

# Locate local dotnet if not in PATH
$LocalDotnetDir = "$HOME\dotnet"
$LocalDotnetExe = "$LocalDotnetDir\dotnet.exe"

if (-not (Get-Command "dotnet" -ErrorAction SilentlyContinue)) {
    if (Test-Path $LocalDotnetExe) {
        $DotnetPath = $LocalDotnetExe
        # CRITICAL: Set DOTNET_ROOT so global tools can find the runtime
        $ENV:DOTNET_ROOT = $LocalDotnetDir
        $ENV:PATH = "$LocalDotnetDir;" + $ENV:PATH
        Write-Host "💡 Using local dotnet at: $DotnetPath (DOTNET_ROOT set)" -ForegroundColor Yellow
    }
}

# Locate local dotnet-ef if not in PATH
if (-not (Get-Command "dotnet-ef" -ErrorAction SilentlyContinue)) {
    $LocalEf = "$HOME\.dotnet\tools\dotnet-ef.exe"
    if (Test-Path $LocalEf) {
        $EfPath = $LocalEf
        Write-Host "💡 Using local dotnet-ef at: $EfPath" -ForegroundColor Yellow
    }
}

# 1. Clean up old binary builds
Write-Host "🧹 Cleaning solution..."
& $DotnetPath clean backend/AgencyCrm.sln

# 2. Add the migration targeting PostgreSQL
Write-Host "🏗️ Generating fresh PostgreSQL migration..."
$ENV:DATABASE_URL = "postgres://user:pass@localhost:5432/dummy" # Force PostgreSQL provider path
& $EfPath migrations add InfrastructureHardeningAndOnboarding --project backend/Crm.Infrastructure --startup-project backend/Crm.Api

Write-Host "✅ Migration generated successfully!" -ForegroundColor Green

Write-Host "`nNext steps:"
Write-Host "1. Push these changes to your repository."
Write-Host "2. Railway will automatically build and run migrations on startup."
Write-Host "3. The logs will show the 'Applying migrations to Railway...' message."
