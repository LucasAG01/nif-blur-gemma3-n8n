#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"

echo '=== Instalación ThinkPad / Linux Mint: n8n + Ollama (CPU) ==='
if ! command -v docker >/dev/null 2>&1; then
  echo 'Docker no está instalado; usando paquetes de Linux Mint/Ubuntu.'
  sudo apt update
  sudo apt install -y docker.io docker-compose-v2
fi
if ! sudo docker compose version >/dev/null 2>&1; then
  echo 'ERROR: Docker existe, pero falta Docker Compose v2.'
  echo 'Instala Compose según el proveedor de tu Docker y vuelve a ejecutar el script.'
  exit 1
fi
sudo systemctl enable --now docker

RAM_GIB=$(awk '/MemTotal/ { printf "%.0f", $2 / 1048576 }' /proc/meminfo)
echo "RAM total detectada: ~${RAM_GIB} GiB. Recomendados: 16 GiB o más."
if (( RAM_GIB < 12 )); then
  echo 'AVISO: puede responder muy despacio o quedarse sin memoria con gemma3:4b.'
fi

echo 'Arrancando n8n y Ollama...'
sudo docker compose up -d

echo 'Comprobando Ollama...'
ready=0
for _ in $(seq 1 30); do
  if sudo docker compose exec -T ollama ollama list >/dev/null 2>&1; then
    ready=1; break
  fi
  sleep 2
done
if (( ready == 0 )); then
  echo 'Ollama aún no está listo. Consulta: sudo docker compose logs ollama'
  exit 1
fi

echo 'Descargando el modelo con visión gemma3:4b (aprox. 3,4 GB)...'
sudo docker compose exec -T ollama ollama pull gemma3:4b

echo
sudo docker compose ps
printf '\nLISTO. Abre http://localhost:5678, crea tu usuario e importa tu JSON desde workflow/.\n'
printf 'En el nodo HTTP Request usa: http://ollama:11434/api/chat\n'
