# PowerShell script to start both backend and frontend servers
# This script starts the backend server on port 3001 and frontend on port 5173

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DRN Development Server Starter" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Gray
Write-Host ""

# Function to handle cleanup
function Cleanup {
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    if ($backendJob) {
        Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    }
    if ($frontendJob) {
        Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    }
    Write-Host "Servers stopped." -ForegroundColor Green
    exit
}

# Register cleanup handler
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }

# Check if backend node_modules exist
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
    Set-Location ..
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
}

# Check if frontend node_modules exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}

Write-Host ""

# Get the current directory (project root)
$projectRoot = Get-Location

# Start backend server
Write-Host "[BACKEND] Starting backend server..." -ForegroundColor Cyan
$backendScriptBlock = {
    param($root)
    Set-Location $root
    Set-Location backend
    npm start
}

$backendJob = Start-Job -ScriptBlock $backendScriptBlock -ArgumentList $projectRoot.Path -Name "BackendServer"

# Start frontend server
Write-Host "[FRONTEND] Starting frontend server..." -ForegroundColor Cyan
$frontendScriptBlock = {
    param($root)
    Set-Location $root
    npm run dev
}

$frontendJob = Start-Job -ScriptBlock $frontendScriptBlock -ArgumentList $projectRoot.Path -Name "FrontendServer"

# Wait a moment for servers to start
Start-Sleep -Seconds 3

# Monitor and display output from both jobs
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers are running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    while ($true) {
        # Display backend output
        $backendOutput = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
        if ($backendOutput) {
            foreach ($line in $backendOutput) {
                Write-Host "[BACKEND] $line" -ForegroundColor Blue
            }
        }

        # Display frontend output
        $frontendOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
        if ($frontendOutput) {
            foreach ($line in $frontendOutput) {
                Write-Host "[FRONTEND] $line" -ForegroundColor Magenta
            }
        }

        # Check if jobs are still running
        if ($backendJob.State -eq "Failed" -or $frontendJob.State -eq "Failed") {
            Write-Host "One of the servers has failed. Check the output above." -ForegroundColor Red
            break
        }

        Start-Sleep -Milliseconds 500
    }
} catch {
    Write-Host "Error monitoring servers: $_" -ForegroundColor Red
} finally {
    Cleanup
}

