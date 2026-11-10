# Validación y extracción documental — versión Qwen3-VL (10/11/2026)

**Empieza aquí.** Esta carpeta contiene **una única versión autocontenida** de la solución n8n. Está separada de los workflows y scripts anteriores del repositorio para que nadie tenga que mezclar archivos de distintas fechas.

## Para utilizarla

1. Abre [`workflow/workflow_n8n.json`](workflow/workflow_n8n.json) e impórtalo desde n8n (Import from File).
2. Configura la credencial de Ollama del nodo `Analyze image1` (se ha eliminado del export para publicar de forma segura) y comprueba la conectividad de los HTTP Request con `http://ollama:11434/api/chat`.
3. Verifica que están disponibles los modelos `qwen3-vl:4b-instruct` y `gemma3:4b` en Ollama; comprueba la instalación de Sharp y los task runners de los nodos `Code`.
4. Ejecuta pruebas usando **documentos sintéticos** de prueba; confirma el JSON, las fechas, la nitidez y los reintentos antes de usar datos reales.

Consulta los detalles en [`docs/INSTALACION_Y_USO.md`](docs/INSTALACION_Y_USO.md).

## Secuencia real del workflow

```text
Formulario de entrada
  |
  v
01. CLASIFICACIÓN visual / intento 1 (Qwen3-VL)
  |--- NO APTA --> intento 2 (Gemma 3)
  |                  |--- NO APTA --> intento 3 (Gemma 3)
  |                  |                    |--- NO APTA --> revisión manual
  |                  |                    `--- APTA ----+
  |                  `--- APTA -----------------------+
  `--- APTA -----------------------------------------+
                                                      |
                                                      v
02. Control de nitidez con Sharp
  |--- borrosa --> reintento según el número de intento / fin
  `--- nítida
         |
         v
03. Extracción con Qwen3-VL -> análisis del JSON recibido
         |
         v
04. Preparar JSON NoSQL -> evaluar extracción -> mostrar resultado
```

**Nota:** este esquema describe las ramas principales, no todos los casos internos del `IF` y `Switch`. El JSON del workflow es la fuente de verdad.

## Carpetas de esta versión

- [`01_clasificacion/intento_1/`](01_clasificacion/intento_1/): validación inicial, imagen Base64, prompt Qwen e interpretación de la respuesta.
- [`01_clasificacion/intento_2/`](01_clasificacion/intento_2/): código y prompt Gemma del segundo intento.
- [`01_clasificacion/intento_3/`](01_clasificacion/intento_3/): código y prompt Gemma del tercer intento.
- [`02_nitidez/`](02_nitidez/): cálculo de varianza del Laplaciano con Sharp.
- [`03_extraccion/`](03_extraccion/): mantener la imagen, prompt de extracción de Qwen y tratamiento de JSON.
- [`04_resultado/`](04_resultado/): registro NoSQL y evaluación final.
- [`workflow/`](workflow/): export completo importable en n8n.
- [`docs/`](docs/): instrucciones, lista de nodos y referencias históricas.

## Puntos importantes

- Hay **16 archivos JavaScript**, uno por cada nodo `Code`, y **4 prompts** extraídos de los nodos IA.
- La clasificación del intento 1 y la extracción son con **Qwen3-VL**; los reintentos 2 y 3 mantienen **Gemma 3**.
- No se incluye lógica de clasificación de documentos de muestra. Se conserva la revisión humana antes de un guardado definitivo.
- Todo el código está **copiado directamente del workflow**; los archivos `.js` y `.txt` son documentación de referencia, no dependencias cargadas desde disco durante una ejecución normal de n8n.
- El workflow está **sin credenciales** para publicarlo; necesitarás reconectar Ollama al importarlo.
- Este paquete **no se ha probado ejecutándolo en una instancia n8n real**. Comprueba el flujo entero antes de utilizarlo en producción.

Para localizar cualquier nodo, abre [`docs/MAPA_NODOS.md`](docs/MAPA_NODOS.md). Las versiones anteriores se documentan aparte en [`docs/REFERENCIAS_ANTERIORES.md`](docs/REFERENCIAS_ANTERIORES.md).
