# Control de desenfoque de NIF con n8n + Gemma 3 4B (IA local)

**Proyecto didáctico de DAW / FCT · Linux Mint y Windows · n8n + Ollama (Gemma 3 4B)**

Workflow construido **paso a paso** para recibir la imagen de un documento NIF **ficticio**, analizar visualmente su desenfoque (*blur*) con `gemma3:4b` y mostrar un resultado en un formulario de n8n. **La imagen se procesa localmente** en el entorno descrito; no se utiliza una API comercial de IA en este flujo.

> **Alcance de esta versión:** solo recepción, validación básica, preparación Base64, análisis visual de blur y presentación del resultado. **No** incluye React, Webhooks para frontend propio,/ `isImageBlurry`, OCR, extracción de datos, anonimización ni ocultación de datos. Son posibles fases posteriores y **no están implementadas en este repositorio**.

> **Aviso de privacidad:** usa documentos sintéticos. Base64 no anonimiza; n8n puede registrar entradas y salidas de las ejecuciones. No subas fotografías auténticas, secretos, credenciales, `.env` ni respuestas que contengan datos personales a GitHub. Esta herramienta **no verifica la autenticidad ni la validez legal de documentos** y la clasificación visual puede fallar.

## Vista general del workflow

```text
[1. Form Trigger: Imagen]
          |
[2. Code: Validar imagen]
          |
[3. Code: Preparar Base64]
          |
[4. HTTP Request: Ollama /api/chat (Gemma 3 4B)]
          |
[5. Code: Interpretar JSON]
          |
[6. Form Ending: Mostrar resultado]
```

**Salida esperada de ejemplo** (NO es una medición):

```json
{
  "estado": "REVISION_MANUAL",
  "desenfoque": "MEDIO",
  "motivo": "La imagen parece parcialmente desenfocada; se recomienda revisión manual."
}
```

Estados: `APTA`, `NO_APTA`, `REVISION_MANUAL`. Desenfoque: `BAJO`, `MEDIO`, `ALTO`; el paso de validación puede añadir `DESCONOCIDO` ante respuestas inválidas. Los resultados dependen de Gemma y no deben tratarse como medición objetiva.

## Estructura del repositorio

```text
nif-blur-gemma3-n8n/
├── README.md
├── .gitignore
├── src/
│   └── nodos/
│       ├── 02-validar-imagen.js
│       ├── 03-preparar-base64.js
│       └── 05-interpretar-resultado.js
├── config/
│   ├── 01-form-trigger.ejemplo.json
│   ├── 04-ollama-request.ejemplo.json
│   ├── 05-respuesta.ejemplo.json
│   └── 06-form-ending.ejemplo.json
├── workflow/
│   ├── nif-blur-gemma3-4b_RECONSTRUIDO.json
│   └── LEEME.md
└── docs/
    └── FAQ.md
```

Los archivos `.js` son **el código para pegar en los nodos Code de n8n**; no son un proyecto Node.js ejecutable por sí solo. Los JSON de `config/` son ejemplos explicativos y no workflows independientes. El archivo `workflow/*RECONSTRUIDO.json` es una **plantilla didáctica** recreada a partir de los seis pasos. Para conservar exactamente los nodos y ajustes de tu instalación, [exporta el workflow original](workflow/LEEME.md) y súbelo revisado.

## Requisitos

- Git y Docker Engine + Docker Compose (Linux), o Git y Docker Desktop con backend **WSL2** (Windows).
- Ollama ejecutándose como parte del **Self-hosted AI Starter Kit** de n8n.
- Modelo `gemma3:4b` descargado en ese Ollama de Docker (modelo con capacidad de visión).
- GPU NVIDIA compatible **opcional**; por CPU será más lento y se necesitará suficiente memoria.
- Puertos libres: `5678` (n8n) y normalmente `11434` (Ollama del host). Si el segundo está ocupado, se puede cambiar el puerto publicado al host **sin modificar el 11434 dentro de Docker**.

> **El Starter Kit no es código propio de este repositorio**: se instala por separado desde el [repositorio oficial de n8n](https://github.com/n8n-io/self-hosted-ai-starter-kit). Incluye PostgreSQL y Qdrant, aunque **este workflow concreto no consulta Qdrant ni requiere una base de datos vectorial**.

## Instalación en Linux (Ubuntu / Linux Mint)

### 1. Docker, Git y GPU (si corresponde)

Instala Docker Engine y el complemento Compose siguiendo la [guía oficial de Docker para Ubuntu](https://docs.docker.com/engine/install/ubuntu/). Linux Mint se basa en Ubuntu, pero Docker no garantiza soporte específico para Mint. Comprueba:

```bash
sudo docker --version
sudo docker compose version
git --version
```

Si usas NVIDIA, comprueba el driver y configura [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) antes de usar el perfil GPU:

```bash
nvidia-smi
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
sudo docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
```

`nvidia-ctk` se ejecuta **después** de instalar `nvidia-container-toolkit` y sus requisitos. Si no tienes GPU NVIDIA compatible, utiliza el perfil `cpu` en los siguientes comandos.

### 2. Descargar y configurar el Starter Kit

```bash
git clone https://github.com/n8n-io/self-hosted-ai-starter-kit.git
cd self-hosted-ai-starter-kit
cp .env.example .env
```

Edita `.env` con claves y contraseñas propias; **no lo subas a GitHub**. Los ejemplos de este README usan Fish o Bash y no necesitan heredoc.

Para limitar servicios al propio equipo, revisa los `ports:` de `docker-compose.yml` y publica n8n en `127.0.0.1:5678:5678` y Qdrant en `127.0.0.1:6333:6333`. Para Ollama, usa `127.0.0.1:11434:11434` si ese puerto está libre.

Si ya existe otro Ollama nativo escuchando en `127.0.0.1:11434`, cambia **solo la asignación externa** de Ollama a `127.0.0.1:11435:11434`.

### 3. Arrancar y descargar el modelo

Con NVIDIA:

```bash
sudo docker compose --profile gpu-nvidia up -d
sudo docker exec ollama ollama pull gemma3:4b
sudo docker exec ollama ollama list
```

Sin NVIDIA (CPU):

```bash
sudo docker compose --profile cpu up -d
sudo docker exec ollama ollama pull gemma3:4b
```

Abre <http://localhost:5678>. Crea la cuenta local de n8n si es la primera vez.

## Instalación en Windows 10/11 (PowerShell)

### 1. Requisitos

1. Instala [Git para Windows](https://git-scm.com/downloads/win) y [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/).
2. Activa el backend **WSL 2 / Linux containers** de Docker Desktop.
3. Para NVIDIA: instala controladores NVIDIA compatibles con WSL2 y usa `wsl --update`. El soporte GPU para contenedores Linux se realiza con WSL2; [consulta los requisitos de Docker](https://docs.docker.com/desktop/features/gpu/).
4. Abre **Docker Desktop** y confirma que está arrancado antes de usar `docker compose`.

Para comprobar:

```powershell
wsl --status
docker --version
docker compose version
git --version
```

### 2. Descargar y arrancar

En **PowerShell**:

```powershell
git clone https://github.com/n8n-io/self-hosted-ai-starter-kit.git
cd self-hosted-ai-starter-kit
Copy-Item .env.example .env
notepad .env
```

Sustituye las contraseñas de ejemplo en `.env`. Antes de ejecutar, revisa `docker-compose.yml`: limita los puertos al host (`127.0.0.1`) y cambia el puerto externo de Ollama a `11435` si el `11434` está ocupado, igual que en Linux.

**Con GPU NVIDIA compatible y WSL2 configurado:**

```powershell
docker compose --profile gpu-nvidia up -d
docker exec ollama ollama pull gemma3:4b
docker exec ollama ollama list
```

**Sin GPU NVIDIA / si la GPU no está disponible en Docker:**

```powershell
docker compose --profile cpu up -d
docker exec ollama ollama pull gemma3:4b
```

Abre <http://localhost:5678> y configura n8n. En Windows con Docker Desktop **no se usa `sudo`**.

## Importar el workflow de este proyecto

1. En n8n → **Build a workflow** / nuevo workflow.
2. Menú `...` → **Import from File**.
3. Importa `workflow/nif-blur-gemma3-4b_RECONSTRUIDO.json` para usar la plantilla o, preferiblemente, el JSON exacto que hayas exportado de tu instalación.
4. Revisa que el campo de archivo se llame exactamente `Imagen` (con mayúscula inicial).
5. Comprueba que el nodo HTTP llama a `http://ollama:11434/api/chat` y selecciona `gemma3:4b`.
6. En el primer nodo `Respond When = Workflow Finishes` y al final `Form Ending / Show Completion Screen`.
7. Guarda. Ejecuta el **Form Trigger de prueba** y sube una fotografía **sintética** JPG, JPEG o PNG.

> Dentro de Docker, `http://ollama:11434` llega al servicio local de Ollama. El puerto `11435` (si lo configuraste) es solo para acceder **desde el host**. No uses `localhost:11434` desde el contenedor de n8n.

## Los seis nodos, explicados

| # | Nodo n8n | Función | Código/configuración |
|---|---|---|---|
| 1 | `On form submission` (Form Trigger) | Formulario, campo obligatorio `Imagen`, acepta JPG/JPEG/PNG | [`config/01`](config/01-form-trigger.ejemplo.json) |
| 2 | `Code` | Comprueba si existe la imagen y valida MIME | [`02-validar-imagen.js`](src/nodos/02-validar-imagen.js) |
| 3 | `Code` | Lee bytes, limita a 8 MiB, codifica a Base64 | [`03-preparar-base64.js`](src/nodos/03-preparar-base64.js) |
| 4 | `HTTP Request` | `POST` local a Ollama/Gemma con imagen en `messages[0].images` | [`config/04`](config/04-ollama-request.ejemplo.json) |
| 5 | `Code` | Interpreta `message.content` como JSON, valida estados | [`05-interpretar-resultado.js`](src/nodos/05-interpretar-resultado.js) |
| 6 | `Form` → `Form Ending` | Presenta `estado`, `desenfoque`, `motivo` al usuario | [`config/06`](config/06-form-ending.ejemplo.json) |

Los nodos 2, 3 y 5 se han guardado deliberadamente como **JavaScript independiente**. Puedes abrir cada archivo en VS Code, estudiar su código y pegarlo en el editor JavaScript del nodo correspondiente. El JSON del nodo 4 es **solo un ejemplo de petición**: debes insertar el dato dinámico `$json.imagenBase64` como expresión en n8n, **no** el texto literal `BASE64_DE_LA_IMAGEN_AQUI`.

### Configuración detallada del nodo HTTP Request (4)

- Método: `POST`
- URL: `http://ollama:11434/api/chat`
- Autenticación: `None` (Ollama de Docker accesible solo desde la red de contenedores)
- `Send Body`: activado
- `Body Content Type`: `JSON`
- `Specify Body`: `Using JSON`
- Modelo: `gemma3:4b`
- Sin streaming: `stream: false`
- `format: json`: pide una respuesta JSON del modelo, que llega como texto en `message.content`
- Campo de imagen: `images: ["{{ $json.imagenBase64 }}"]`

El nodo 5 aplica una regla defensiva: **si Gemma responde `APTA` pero no indica desenfoque `BAJO`, el estado pasa a `REVISION_MANUAL`**. En una fase posterior podrán incorporarse validaciones más estrictas y una medición cuantitativa de blur, pero **no forman parte de esta entrega**.

## Arrancar y detener el entorno otro día

### Linux Mint (desde la carpeta del Starter Kit)

```bash
cd ~/self-hosted-ai-starter-kit
sudo docker compose --profile gpu-nvidia up -d
sudo docker compose --profile gpu-nvidia ps
# Al terminar:
sudo docker compose --profile gpu-nvidia stop
```

### Windows (PowerShell, desde la carpeta del Starter Kit)

```powershell
cd self-hosted-ai-starter-kit
docker compose --profile gpu-nvidia up -d
docker compose --profile gpu-nvidia ps
# Al terminar:
docker compose --profile gpu-nvidia stop
```

**Si elegiste CPU**, sustituye `gpu-nvidia` por `cpu` en los comandos. Docker Desktop debe estar iniciado en Windows. `stop` conserva los datos. **No ejecutes `docker compose down -v`**: la opción `-v` elimina volúmenes persistentes.

## Comprobar qué modelo se usa

```bash
# Linux Mint:
sudo docker exec ollama ollama list
sudo docker exec ollama ollama show gemma3:4b
sudo docker exec ollama ollama ps
```

En Windows usa los mismos comandos quitando `sudo`. `ollama ps` muestra el procesador utilizado solo cuando el modelo está cargado. Para comprobar que se usa GPU, ejecuta antes una consulta.

## Pruebas y límites

- Probar tres imágenes **ficticias**: nítida, con desenfoque fuerte e intermedia.
- Registrar si hay resultados estables o contradictorios; si el modelo duda, `REVISION_MANUAL`.
- Gemma realiza una **estimación visual subjetiva**; no se calcula actualmente ninguna puntuación de blur mediante OpenCV.
- La detección de blur no equivale a un control de autenticidad documental.
- El ejemplo puede tardar más la primera vez mientras se carga el modelo en la memoria.

## Problemas habituales

| Problema | Solución |
|---|---|
| `address already in use` en `11434` | Cambiar solo la asignación publicada al host (`11435:11434`), manteniendo `ollama:11434` dentro de Docker. |
| `ECONNREFUSED` en n8n | Verificar que Ollama está en ejecución y que la URL interna es `http://ollama:11434`. |
| `model not found` | Ejecutar `docker exec ollama ollama pull gemma3:4b`. |
| `Imagen` no encontrada en nodo 2/3 | Revisar el nombre exacto del campo binario del formulario y que el archivo siga asociado al ítem. |
| El formulario no presenta el resultado | `Respond When = Workflow Finishes` y nodo final `Form Ending`. |
| n8n no abre | Revisar Docker Desktop/servicio Docker, `docker compose ... ps` y el puerto 5678. |
| `fish: Expected a string, but found a redirection` | En Fish no se usa el heredoc de Bash `<<EOF`; los comandos del README no dependen de eso. |

Más detalles en [FAQ](docs/FAQ.md).

## Publicarlo en GitHub

La carpeta `nif-blur-gemma3-n8n` es un **repositorio propio y separado** del Starter Kit oficial. Revísala antes de subirla:

```bash
cd nif-blur-gemma3-n8n
git init
git add .
git status
git commit -m "Documentar workflow local Gemma 3 4B para blur"
```

Crea un repositorio vacío en GitHub y sigue los comandos que te muestre para conectar el remoto (`git remote add origin ...` y `git push -u origin main`). Si Git usa otra rama, renómbrala con `git branch -M main` antes del push. No pegues tokens de acceso en scripts o README.

**No** conviertas en repo público un workflow que contenga datos corporativos o documentación privada sin permiso expreso.

## Referencias oficiales

- [n8n Self-hosted AI Starter Kit](https://github.com/n8n-io/self-hosted-ai-starter-kit)
- [Docker Engine en Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Desktop en Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- [GPU NVIDIA con Docker Desktop / WSL2](https://docs.docker.com/desktop/features/gpu/)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- [Documentación de la API de Ollama](https://docs.ollama.com/api/chat)
- [Documentación n8n](https://docs.n8n.io/)
