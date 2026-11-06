Write-Host "=== Instalación del kit n8n + Ollama (AMD APU / CPU) ===" -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker no está instalado. Instala Docker Desktop para Windows." -ForegroundColor Red
    exit 1
}

Write-Host "Construyendo imagen de n8n con sharp..." -ForegroundColor Yellow
docker compose build

Write-Host "Iniciando contenedores..." -ForegroundColor Yellow
docker compose up -d

Write-Host "Esperando a que Ollama esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Descargando gemma3:4b (aprox. 3.4 GB)..." -ForegroundColor Yellow
docker compose exec ollama ollama pull gemma3:4b

Write-Host "Instalación completada. Abre http://localhost:5678" -ForegroundColor Green
Write-Host "Importa el workflow desde workflow/nifOllamaGemma_2026-11-06.json" -ForegroundColor Green
