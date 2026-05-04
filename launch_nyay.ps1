# Nyay-Mitra Startup Script (PowerShell)

Write-Host "--- Starting Nyay-Mitra Ecosystem ---" -ForegroundColor Cyan

# Load .env file if it exists
if (Test-Path "backend/.env") {
    Write-Host "Loading environment variables from backend/.env..." -ForegroundColor Gray
    Get-Content "backend/.env" | Where-Object { $_ -match "=" -and $_ -notmatch "^#" } | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        [System.Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), "Process")
    }
}

# Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js not found in PATH." -ForegroundColor Red
    exit 1
}

# Check for Maven
if (!(Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Maven not found in PATH." -ForegroundColor Red
    exit 1
}

# Check for Python
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Python not found in PATH." -ForegroundColor Red
    exit 1
}

# 1. Start Frontend
Write-Host "Launching Frontend Dashboard (localhost:3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# 2. Start Java Kernel
Write-Host "Launching Java Kernel (backend/nyay-kernel)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/nyay-kernel; mvn spring-boot:run"

# 3. Start Python Microservices
Write-Host "Launching Python Services..." -ForegroundColor Yellow

# Nyay-Vani (Port 8003)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/nyay-vani; python -m uvicorn app.main:app --host 0.0.0.0 --port 8003"

# Nyay-Bridge (Port 8002)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/nyay-bridge; python -m uvicorn app.main:app --host 0.0.0.0 --port 8002"

# Nyay-Audit (Port 8001)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/nyay-audit; python -m uvicorn app.main:app --host 0.0.0.0 --port 8001"

# Nyay-Graph (Port 8004)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/nyay-graph; python -m uvicorn app.main:app --host 0.0.0.0 --port 8004"

Write-Host "All services have been initiated." -ForegroundColor Green
Write-Host "Dashboard: http://localhost:3000" -ForegroundColor Green
Write-Host "Kernel Health: http://localhost:8080/health" -ForegroundColor Green
