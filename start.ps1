# Quick Start Script for MedManager Frontend

Write-Host "🚀 Starting MedManager Frontend..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    Write-Host ""
}

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating one..." -ForegroundColor Yellow
    @"
VITE_API_BASE_URL=https://localhost:5001
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Created .env file with default API URL" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🔧 Configuration:" -ForegroundColor Cyan
Write-Host "   API URL: $(Get-Content .env | Select-String 'VITE_API_BASE_URL')" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Available Routes:" -ForegroundColor Cyan
Write-Host "   User Interface:" -ForegroundColor White
Write-Host "     • Home:                 http://localhost:5173/" -ForegroundColor Gray
Write-Host "     • Drug Search:          http://localhost:5173/drug-search" -ForegroundColor Gray
Write-Host "     • Interaction Checker:  http://localhost:5173/interaction-checker" -ForegroundColor Gray
Write-Host "     • Disease Treatment:    http://localhost:5173/disease-treatment" -ForegroundColor Gray
Write-Host ""
Write-Host "   Admin Interface:" -ForegroundColor White
Write-Host "     • Admin Dashboard:      http://localhost:5173/admin" -ForegroundColor Gray
Write-Host "     • Manage Drugs:         http://localhost:5173/admin/drugs" -ForegroundColor Gray
Write-Host "     • Manage Interactions:  http://localhost:5173/admin/interactions" -ForegroundColor Gray
Write-Host "     • Manage Diseases:      http://localhost:5173/admin/diseases" -ForegroundColor Gray
Write-Host ""

Write-Host "⚡ Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Tip: Make sure the backend API is running at https://localhost:5001" -ForegroundColor Magenta
Write-Host ""

# Start the development server
npm run dev
