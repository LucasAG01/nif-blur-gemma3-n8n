# Mapa exacto de archivos y nodos n8n

Cada ruta de abajo corresponde al contenido exportado de **un nodo específico** del workflow. No son versiones alternativas de código.

| Nodo en n8n | Tipo | Archivo de esta versión |
|---|---|---|
| `02 - Comprobar formato y tamaño1` | JavaScript | [`01_clasificacion/intento_1/01_comprobar_formato_y_tamano.js`](../01_clasificacion/intento_1/01_comprobar_formato_y_tamano.js) |
| `03 - Preparar imagen Base66` | JavaScript | [`01_clasificacion/intento_1/02_preparar_imagen_base64.js`](../01_clasificacion/intento_1/02_preparar_imagen_base64.js) |
| `03- Analizar si es un NIF1` | Prompt | [`01_clasificacion/intento_1/03_prompt_qwen3_vl.txt`](../01_clasificacion/intento_1/03_prompt_qwen3_vl.txt) |
| `Interpretar respuesta1` | JavaScript | [`01_clasificacion/intento_1/04_interpretar_respuesta.js`](../01_clasificacion/intento_1/04_interpretar_respuesta.js) |
| `Marcar intento` | JavaScript | [`01_clasificacion/intento_2/01_marcar_intento.js`](../01_clasificacion/intento_2/01_marcar_intento.js) |
| `02 - Comprobar formato y tamaño2` | JavaScript | [`01_clasificacion/intento_2/02_comprobar_formato_y_tamano.js`](../01_clasificacion/intento_2/02_comprobar_formato_y_tamano.js) |
| `03 - Preparar imagen Base67` | JavaScript | [`01_clasificacion/intento_2/03_preparar_imagen_base64.js`](../01_clasificacion/intento_2/03_preparar_imagen_base64.js) |
| `03- Analizar si es un NIF2` | Prompt | [`01_clasificacion/intento_2/04_prompt_gemma3.txt`](../01_clasificacion/intento_2/04_prompt_gemma3.txt) |
| `Interpretar respuesta2` | JavaScript | [`01_clasificacion/intento_2/05_interpretar_respuesta.js`](../01_clasificacion/intento_2/05_interpretar_respuesta.js) |
| `Marcar intento 1` | JavaScript | [`01_clasificacion/intento_3/01_marcar_intento.js`](../01_clasificacion/intento_3/01_marcar_intento.js) |
| `02 - Comprobar formato y tamaño3` | JavaScript | [`01_clasificacion/intento_3/02_comprobar_formato_y_tamano.js`](../01_clasificacion/intento_3/02_comprobar_formato_y_tamano.js) |
| `03 - Preparar imagen Base68` | JavaScript | [`01_clasificacion/intento_3/03_preparar_imagen_base64.js`](../01_clasificacion/intento_3/03_preparar_imagen_base64.js) |
| `03- Analizar si es un NIF3` | Prompt | [`01_clasificacion/intento_3/04_prompt_gemma3.txt`](../01_clasificacion/intento_3/04_prompt_gemma3.txt) |
| `Interpretar respuesta3` | JavaScript | [`01_clasificacion/intento_3/05_interpretar_respuesta.js`](../01_clasificacion/intento_3/05_interpretar_respuesta.js) |
| `03 - Ejecución validate1` | JavaScript | [`02_nitidez/01_validar_nitidez_sharp.js`](../02_nitidez/01_validar_nitidez_sharp.js) |
| `Extraccion a json de datos1` | JavaScript | [`03_extraccion/01_conservar_imagen_validada.js`](../03_extraccion/01_conservar_imagen_validada.js) |
| `Analyze image1` | Prompt | [`03_extraccion/02_prompt_qwen3_vl.txt`](../03_extraccion/02_prompt_qwen3_vl.txt) |
| `preparar resultado final` | JavaScript | [`03_extraccion/03_parsear_respuesta_ia.js`](../03_extraccion/03_parsear_respuesta_ia.js) |
| `Preparar Json` | JavaScript | [`04_resultado/01_preparar_json_nosql.js`](../04_resultado/01_preparar_json_nosql.js) |
| `Evaluar extraccion` | JavaScript | [`04_resultado/02_evaluar_extraccion.js`](../04_resultado/02_evaluar_extraccion.js) |

## Nodos que no requieren archivo de código separado

Los nodos de formulario (`On form submission3`, `Reintento 2 - Subir imagen1`, `Reintento 3 - Subir imagen3`, `Mostrar Resultado4`, `Ending desenfoque`, `Form`), los nodos `IF`, `Switch` y las notas adhesivas se configuran dentro de [`workflow/workflow_n8n.json`](../workflow/workflow_n8n.json).

El código de un nodo `Code` se modifica dentro de n8n. Si actualizas el workflow, vuelve a exportarlo y a sincronizar estos archivos; n8n **no los lee directamente del repositorio**.
