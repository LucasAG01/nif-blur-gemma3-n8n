# Mapa de nodos — API de validación de documentos

| Orden | Nodo en n8n | Archivo generado | Función |
|---|---|---|---|
| 1 | `Webhook` | En el JSON | POST `/validar-documento`; admite origen `http://localhost:5173` |
| 2 | `Code in JavaScript` | `src/nodos/API_Validacion_Documentos_React/01_recibir_imagen.js` | Detecta el archivo binario y su metadato |
| 3 | `base64` | `src/nodos/API_Validacion_Documentos_React/02_preparar_base64.js` | Comprueba JPEG/PNG y límite de 8 MiB, codifica Base64 |
| 4 | `03- Analizar si es un NIF1` | `config/API_Validacion_Documentos_React/cuerpo_http_ollama_n8n.txt` y `prompts/.../prompt_clasificacion_documentos.txt` | Llama a `gemma3:4b` mediante Ollama |
| 5 | `Interpretar la API` | `src/nodos/API_Validacion_Documentos_React/03_interpretar_respuesta_gemma.js` | Interpreta respuesta JSON y conserva el binario |
| 6 | `03 - Ejecución validate1` | `src/nodos/API_Validacion_Documentos_React/04_validar_nitidez_sharp.js` | Varianza del laplaciano con Sharp, umbral 220 |
| 7 | `Resultado final API` | `src/nodos/API_Validacion_Documentos_React/05_resultado_final_api.js` | Combina clasificación y nitidez y genera resultado simple |
| 8 | `Respond to Webhook` | En el JSON | Devuelve el JSON a quien hizo la solicitud |

## Procedencia

- Dos nodos principales se copiaron/adaptaron del workflow anterior: `03- Analizar si es un NIF1` (Gemma) y `03 - Ejecución validate1` (Sharp).
- La preparación y la interpretación de datos usan lógica adaptada del flujo anterior.
- La recepción HTTP, el resultado final y la respuesta HTTP son específicos de esta API.

## Campos habituales del JSON de salida

`apta`, `estado`, `tipo_documento`, `nitidez`, `varianza`, `umbral`, `requiere_nueva_foto`, `requiere_revision_manual`, `motivo`.

**Importante:** el estado `APTA` significa que la imagen superó las reglas configuradas; no comprueba autenticidad, identidad ni vigencia documental.

## Trabajo pendiente

- Definir e implementar política de reintentos/sesiones (con n8n como responsable principal si se confirma).
- Integrar extracción de datos y evaluación de campos faltantes.
- Coordinar el interfaz React y el servicio de OCR Mindee, así como la confirmación humana y persistencia en Firestore.
- Calibrar el umbral de nitidez con imágenes de prueba variadas y establecer gestión de errores.
- Añadir autenticación al Webhook y revisar almacenamiento y retención de datos sensibles.
