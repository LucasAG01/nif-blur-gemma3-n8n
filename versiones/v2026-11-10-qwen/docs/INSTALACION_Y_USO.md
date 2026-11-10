# Instalación y uso

## Requisitos comprobables

- Una instancia de n8n con soporte para los tipos de nodos del workflow exportado.
- Ollama accesible **desde la red donde se ejecuta n8n**. El workflow utiliza `http://ollama:11434/api/chat` para la clasificación visual. Si Ollama no se llama `ollama` en esa red, hay que cambiar la URL en los tres nodos HTTP.
- Modelos de Ollama: `qwen3-vl:4b-instruct` para el intento 1 y la extracción; `gemma3:4b` para los reintentos 2 y 3.
- Módulo `sharp` disponible en el entorno que ejecuta el nodo `Code` de nitidez.
- Nodo `Analyze image1` reconectado a las credenciales locales de Ollama después de importar el JSON.

## Importar

1. En n8n, crea un workflow nuevo y elige *Import from File*.
2. Selecciona [`workflow_n8n.json`](../workflow/workflow_n8n.json).
3. Revisa las credenciales y ejecuta los nodos individualmente al principio.
4. Comprueba el nombre del campo binario: `Imagen`.
5. Envia JPG/PNG de prueba a través del formulario.
6. Comprueba las salidas del filtro visual, el nodo Sharp, el parseo y el registro NoSQL.
7. Prueba el ciclo de segundo/tercer intento y los rechazos de nitidez.

## Edición y sincronización

La copia **ejecutable** es el JSON importado en n8n. Los `.js` y `.txt` contienen una copia exacta de la configuración exportada para consulta, aprendizaje y control de cambios. Si editas un archivo `.js` en GitHub, n8n no lo aplicará solo; copia el contenido al nodo correspondiente y exporta una nueva versión del workflow.

## Privacidad y verificación

No publiques documentos de identidad reales, imágenes con datos personales, resultados con DNI/NIE auténticos ni credenciales. Para probar utiliza imágenes sintéticas. La extracción OCR puede equivocarse: el resultado `PENDIENTE_VERIFICACION` no significa identidad verificada.

## Repositorio anterior

Para el entorno Docker y las instrucciones adicionales consulta [las referencias de infraestructura existente](REFERENCIAS_ANTERIORES.md). Algunos componentes antiguos pueden necesitar ajuste y no deben combinarse automáticamente con esta versión.
