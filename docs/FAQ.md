# FAQ — Workflow n8n + Gemma 3 4B

**¿Hay que instalar Gemma cada día?** No. El modelo queda guardado en el volumen de Ollama. Basta con arrancar los contenedores.

**¿Es necesario n8n Cloud?** No; todo funciona en una instancia local de n8n. El navegador se conecta por `http://localhost:5678`.

**¿La IA sale a Internet para evaluar la imagen?** El nodo HTTP de este proyecto llama a Ollama **dentro de Docker**. Ello no prueba que toda la instalación esté aislada de Internet: descarga de imágenes/modelos, actualizaciones y telemetría requieren revisión separada.

**¿Por qué Gemma 3 y no Llama 3.2?** Se escogió `gemma3:4b` por su capacidad de entrada visual para este experimento.

**¿Es una medición numérica del blur?** No. El resultado es una clasificación visual mediante un modelo generativo y puede equivocarse.

**¿Qué es Base64?** Una codificación del binario como texto; NO protege los datos.

**¿Puedo compartir en GitHub el contenido de `imagenBase64`?** No, porque codifica la imagen completa.

**¿Por qué hay varios archivos `.js`?** Cada uno representa el contenido de un nodo Code de n8n, para consultarlos desde el editor y controlar cambios en Git.

**¿Debo instalar Node.js para esos scripts?** No: se ejecutan dentro de n8n y dependen de sus variables especiales.

**¿El JSON de `config/04` se importa como workflow?** No. Es un ejemplo del cuerpo HTTP para Ollama. El workflow importable se encuentra en `workflow/`.

**¿Por qué el workflow se llama RECONSTRUIDO?** Es una plantilla reproducida a partir de los pasos documentados en el chat, no el archivo exacto descargado de tu instancia. Exporta tu versión final.

**¿Cómo se apaga sin perder datos?** `docker compose --profile gpu-nvidia stop` (o `cpu`). No uses `down -v`.

**¿Por qué veo dos Ollama?** Puedes tener uno nativo en el host (`11434`) y otro en Docker expuesto en el host (`11435`). n8n se comunica con el de Docker por `http://ollama:11434`.

**¿Puede usar Windows sin tarjeta NVIDIA?** Sí, con `--profile cpu`, aunque suele ser más lento. Con NVIDIA en Docker Desktop se necesita configuración WSL2 compatible.

**¿Qué pasa si el modelo devuelve JSON mal formado?** El nodo 05 trata de asignar `REVISION_MANUAL` cuando no puede interpretarlo.

**¿Se extraen o tapan datos del NIF?** No. No se hace OCR ni anonimización en esta versión.

**¿Se puede usar un NIF real?** No se recomienda en el prototipo ni en un repositorio público. Requiere controles de acceso, retención y tratamiento de datos, así como autorización.

**¿Se requiere Qdrant en este flujo?** No; Qdrant forma parte del Starter Kit, pero no se utiliza para comprobar blur.
