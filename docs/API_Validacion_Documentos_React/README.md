# API de validación de documentos React — código organizado

Este paquete separa **sin modificar** el código que estaba dentro de `API - Validacion documentos React.json`, exportado desde n8n. Se ha conservado una copia íntegra del JSON para importación.

## Qué incluye

- `workflow/API_Validacion_Documentos_React.json`: workflow original exportado, **sin cambios**. Es la definición importable en n8n (8 nodos y conexiones).
- `src/nodos/API_Validacion_Documentos_React/`: **5 archivos `.js`**, uno por cada nodo Code. Son transcripciones exactas de `parameters.jsCode`.
- `prompts/API_Validacion_Documentos_React/prompt_clasificacion_documentos.txt`: prompt exacto de clasificación de Gemma 3 4B.
- `config/API_Validacion_Documentos_React/cuerpo_http_ollama_n8n.txt`: campo `jsonBody` exacto del nodo HTTP Request, incluido el prompt y la expresión de imagen.
- `docs/API_Validacion_Documentos_React/MAPA_NODOS.md`: correspondencia entre nodos y archivos, y funcionamiento.
- `docs/API_Validacion_Documentos_React/COMO_SUBIR_GITHUB.md`: comandos para integrar los archivos en el repositorio sin tocar el workflow original.

## Muy importante

**Los archivos `.js` separados NO son cargados automáticamente por n8n.** Si editas uno, no cambia el workflow publicado. Para ejecutar el flujo se importa o edita el JSON desde n8n. Tras modificar nodos en n8n, es necesario volver a exportarlos y sincronizar los `.js` separados.

### Estado real

El workflow de esta exportación valida una imagen en una sola llamada: recibe la imagen por Webhook, ejecuta Gemma + Sharp, y responde con JSON. **No** contiene aún la lógica persistente de tres intentos, la extracción de campos personales, Mindee ni Firebase. Eso continúa separado en el prototipo anterior y/o pendiente de integración.

### Requisitos locales

- n8n y Ollama accesible desde la red de contenedores en `http://ollama:11434/api/chat`.
- Modelo `gemma3:4b` disponible en Ollama.
- El entorno de ejecución JavaScript de n8n debe tener `sharp` disponible para `require("sharp")` (en este proyecto se configuró un runner personalizado).
- Peticiones multipart con campo binario **`Imagen`**.

### Prueba local (workflow publicado)

```bash
curl -sS -X POST \
  -F "Imagen=@/ruta/a/documento_ficticio.jpeg" \
  http://localhost:5678/webhook/validar-documento | python3 -m json.tool
```

> Usa solo documentos ficticios en pruebas. El Webhook exportado no especifica autenticación, y configurar CORS no equivale a proteger el endpoint. No expongas el endpoint públicamente ni compartas identificaciones reales antes de implementar autenticación, límites, políticas de retención y medidas de privacidad.

## Notas sobre exportación

El campo `active` del JSON exportado vale `false`. Este paquete no modifica ese estado. Para comprobar si un workflow está publicado o activo hay que revisarlo en la instancia n8n; el paquete es una copia de su configuración exportada.
