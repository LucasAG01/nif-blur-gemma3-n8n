# nifOllamaGemma — Workflow limpio, 27 de octubre de 2026

## Qué es esta entrega

Paquete realizado a partir del **JSON que se ha facilitado ahora**, no de versiones anteriores ni de capturas. El flujo se llama **`nifOllamaGemma`** y tiene **34 nodos**, de los cuales **16 son `Code` con JavaScript**.

### Contenido

- `workflow/nifOllamaGemma_limpio_2026-10-27.json`: exportación n8n para versionado/compartición.
- `src/nodos/nifOllamaGemma/`: los **16 códigos JavaScript extraídos literalmente**, separados por nodo e intento; ver `docs/MAPA_NODOS_nifOllamaGemma.md`.
- `prompts/nifOllamaGemma/`: prompt de clasificación (compartido por 3 nodos HTTP) y prompt de extracción visual de Gemma.
- `docs/PENDIENTES_nifOllamaGemma.md`: límites conocidos y tareas pendientes, sin dar por probadas funciones que no lo están.
- `scripts/commit_nifOllamaGemma_2026_10_27.sh`: crea un commit acotado a los archivos de este paquete.

### Qué hace el workflow (según su configuración)

1. Recibe un archivo desde `On form submission3` y valida su formato JPG/PNG.
2. Gemma 3 4B clasifica si parece un DNI/NIE/documento admitido.
3. Ofrece formularios para segundo y tercer intento si el documento no es reconocido.
4. Si se reconoce, Sharp calcula la varianza del Laplaciano sobre 512 × 512 con umbral 220; una imagen borrosa termina en mensaje informativo.
5. Una imagen con nitidez suficiente pasa al nodo de extracción visual, se convierte el texto JSON en objeto, y se prepara `registroNoSQL`.
6. Evalúa presencia de campos obligatorios y presenta un resumen final como **pendiente de verificación**.

### Importar en n8n

1. En n8n, elige **Import from File** y selecciona `workflow/nifOllamaGemma_limpio_2026-10-27.json`.
2. Vuelve a escoger/crear la credencial de `Ollama account` en **Analyze image1**.
3. Revisa URL `http://ollama:11434` y que `gemma3:4b` está descargado en tu Ollama local.
4. Comprueba que `Imagen` sea el nombre de campo binario para imágenes, y vuelve a generar/revisar las URLs de formulario si n8n las solicita.
5. Prueba **solamente con documentos ficticios o de muestra**. No se ha probado esta copia importada durante la preparación del ZIP.

**Para GitHub:** de este export se eliminaron únicamente identificadores de instancia/versión, IDs de webhooks de formulario y la referencia a la credencial Ollama. Los nombres de nodos, las conexiones, los prompts y **todos los JS del flujo siguen iguales**. Tu export original sigue siendo tu copia local de referencia.

### Añadir estos cambios al repositorio

1. Abre la raíz del clon de tu repo (el directorio que contiene `.git`).
2. Extrae **el contenido** del ZIP dentro del clon, de modo que `src/nodos/nifOllamaGemma/`, `workflow/`, `prompts/nifOllamaGemma/`, `docs/` y `scripts/` queden en la raíz.
3. Revisa los archivos y ejecuta:

```bash
bash scripts/commit_nifOllamaGemma_2026_10_27.sh
```

4. Sube el commit:

```bash
git push origin main
```

El script crea un commit limitado a los archivos de este paquete; no debería meter cambios de otros trabajos en el mismo commit.

### Commit propuesto

```text
feat(n8n): documentar flujo limpio con reintentos, Sharp y JSON NoSQL
```

> No se ha ejecutado un commit sobre tu repositorio remoto: el paquete prepara los archivos y el mensaje para que lo hagas en tu clon.

**Compatibilidad con el repositorio actual:** se preservan `README.md`, `src/nodos/*.js`, `config/`, `KITSTarter/`, `docs/FAQ.md` y las versiones anteriores de `workflow/`. No se sobrescribe ninguno de esos archivos.
