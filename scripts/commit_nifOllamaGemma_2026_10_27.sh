#!/usr/bin/env bash
set -euo pipefail
# Ejecutar desde cualquier ruta dentro de ~/Projects/nif-blur-gemma3-n8n
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: no estás dentro de un repositorio Git" >&2
  exit 1
fi
cd "$(git rev-parse --show-toplevel)"
if [[ ! -d 'src/nodos' || ! -d 'workflow' ]]; then
  echo "Error: estructura del repositorio no reconocida. No se creó ningún commit." >&2
  exit 1
fi
files=(
  docs/CAMBIOS_nifOllamaGemma_2026-10-27.md
  docs/MAPA_NODOS_nifOllamaGemma.md
  docs/MENSAJE_COMMIT_nifOllamaGemma.txt
  docs/PENDIENTES_nifOllamaGemma.md
  prompts/nifOllamaGemma/prompt_clasificacion_dni_nie.txt
  prompts/nifOllamaGemma/prompt_extraccion_documento.txt
  scripts/commit_nifOllamaGemma_2026_10_27.sh
  src/nodos/nifOllamaGemma/extraccion_nosql/01_conservar_imagen_validada.js
  src/nodos/nifOllamaGemma/extraccion_nosql/02_parsear_respuesta_ia.js
  src/nodos/nifOllamaGemma/extraccion_nosql/03_preparar_json_nosql.js
  src/nodos/nifOllamaGemma/extraccion_nosql/04_evaluar_extraccion.js
  src/nodos/nifOllamaGemma/intento_1/01_comprobar_formato_y_tamano.js
  src/nodos/nifOllamaGemma/intento_1/02_preparar_imagen_base64.js
  src/nodos/nifOllamaGemma/intento_1/03_interpretar_clasificacion.js
  src/nodos/nifOllamaGemma/intento_2/01_marcar_intento.js
  src/nodos/nifOllamaGemma/intento_2/02_comprobar_formato_y_tamano.js
  src/nodos/nifOllamaGemma/intento_2/03_preparar_imagen_base64.js
  src/nodos/nifOllamaGemma/intento_2/04_interpretar_clasificacion.js
  src/nodos/nifOllamaGemma/intento_3/01_marcar_intento.js
  src/nodos/nifOllamaGemma/intento_3/02_comprobar_formato_y_tamano.js
  src/nodos/nifOllamaGemma/intento_3/03_preparar_imagen_base64.js
  src/nodos/nifOllamaGemma/intento_3/04_interpretar_clasificacion.js
  src/nodos/nifOllamaGemma/validacion_nitidez/01_sharp_varianza_laplaciano.js
  workflow/nifOllamaGemma_limpio_2026-10-27.json
)
for p in "${files[@]}"; do
  if [[ ! -f "$p" ]]; then
    echo "Falta: $p. Copia el contenido del ZIP a la raíz del repo." >&2
    exit 1
  fi
done
# Solo añadir los archivos nuevos de esta entrega.
git add -- "${files[@]}"
if git diff --cached --quiet -- "${files[@]}"; then
  echo 'No se han encontrado cambios nuevos para este commit.'
  exit 0
fi

echo 'Se van a incluir los siguientes archivos:'
git diff --cached --name-status -- "${files[@]}"
git commit --only -m "feat(n8n): añadir workflow nifOllamaGemma y separar código de 16 nodos" -- "${files[@]}"
echo 'Commit local creado. Para publicar: git push origin main'
