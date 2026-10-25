#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"
sudo docker compose stop
printf '\nContenedores detenidos. Los workflows y modelos permanecen guardados.\n'
