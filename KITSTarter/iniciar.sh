#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"
sudo systemctl start docker
sudo docker compose up -d
sudo docker compose ps
printf '\nAccede a http://localhost:5678\n'
