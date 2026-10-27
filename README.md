# Análisis de documentos NIF/NIE con n8n, Gemma 3 y Sharp

**Proyecto de DAW / FCT · n8n + Ollama (IA local) + JavaScript + Sharp · Linux Mint**

Prototipo para procesar fotografías de documentos identificativos españoles (DNI/NIF y determinados documentos NIE) mediante un workflow de **n8n**. El sistema clasifica visualmente la imagen con **Gemma 3 4B**, evalúa su nitidez con **Sharp** y prepara los datos extraídos en un JSON estructurado para una futura integración con una base de datos NoSQL.

> **Estado: prototipo en desarrollo.** El flujo procesa imágenes y genera resultados, pero **no verifica identidades, autenticidad documental ni exactitud de los datos extraídos**. Para las pruebas se utilizan documentos ficticios.

## Funcionalidades actuales

- Recepción de fotografías mediante un formulario de n8n (`Imagen`, JPG/JPEG/PNG).
- Comprobación básica del formato y límite de **8 MiB** durante la preparación Base64.
- Clasificación visual de DNI/NIF, TIE/NIE y otros documentos admitidos mediante `gemma3:4b` en Ollama local.
- **Hasta tres intentos de reconocimiento**, con formularios para volver a subir la fotografía.
- Evaluación de nitidez con **Sharp**: imagen normalizada a 512 × 512, varianza del Laplaciano y umbral configurable (actualmente `220`).
- Extracción experimental de campos con Gemma y preparación de un objeto JSON orientado a NoSQL.
- Comprobación básica de campos obligatorios y estado **`PENDIENTE_VERIFICACION`**; los datos no se consideran verificados.
- Pantallas finales para resultado, documento no reconocido o imagen borrosa.

### Resumen del flujo

```text
Formulario: subir imagen
         │
         ▼
Validar formato → preparar Base64
         │
         ▼
Gemma 3: identificar tipo de documento
         │
         ├── No reconocido → reintento 2 → reintento 3 → revisión manual
         │
         └── Reconocido
                    │
                    ▼
          Sharp: comprobar nitidez
                    │
             ┌──────┴────────┐
             │               │
           Borrosa          Nítida
             │               │
       Fin con aviso     Gemma: extraer campos
                             │
                      Preparar JSON NoSQL
                             │
                       Evaluar extracción
                             │
                   Resultado: pendiente
                       de verificación
```

**Importante:** los tres intentos corresponden al **reconocimiento del documento**. Actualmente, si Sharp detecta desenfoque, se muestra una pantalla final; todavía no se reutilizan esos intentos para la nitidez.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| [n8n](https://n8n.io/) | Formularios, nodos, condiciones y orquestación |
| [Ollama](https://ollama.com/) + `gemma3:4b` | Clasificación visual y extracción experimental, en local |
| JavaScript | Procesamiento de respuestas, contadores y construcción de JSON |
| [Sharp](https://sharp.pixelplumbing.com/) | Procesamiento de imágenes y cálculo de nitidez |
| Docker Compose | Ejecución local de los servicios |
| NoSQL / Firestore | **Integración futura; no guarda datos actualmente** |

## Entornos de trabajo: PC de casa y portátil

Este proyecto se utiliza en **dos equipos con instalaciones diferentes**. Comparten el **mismo repositorio GitHub**, pero **no** la misma instalación de n8n, sus datos, sus modelos descargados ni sus volúmenes Docker.

| Entorno | Ubicación | ¿Para qué sirve? |
| --- | --- | --- |
| **PC de casa — entorno completo** | `~/self-hosted-ai-starter-kit/` (directorio independiente del repositorio) | Desarrollar y probar el workflow completo, con n8n, Ollama/Gemma, Sharp mediante un runner JavaScript configurado, PostgreSQL y Qdrant. Puede utilizar GPU NVIDIA. |
| **Portátil ThinkPad — `KITSTarter`** | `KITSTarter/` dentro de este repositorio, en la ruta donde lo hayas clonado | Entorno ligero de demostración y aprendizaje: **n8n + Ollama**, preparado para ejecutarse en **CPU**, sin necesitar una GPU NVIDIA. |

### 1. PC de casa: Self-hosted AI Starter Kit oficial

El entorno completo se basa en el [Self-hosted AI Starter Kit de n8n](https://github.com/n8n-io/self-hosted-ai-starter-kit), instalado **por separado** de este repositorio. Su archivo de Docker Compose levanta varios servicios: **n8n** (automatizaciones), **Ollama** (modelo local `gemma3:4b`), **PostgreSQL** (persistencia de n8n) y **Qdrant** (base vectorial incluida en el kit, aunque este workflow de DNI/NIE no la utiliza).

La comprobación de nitidez mediante **Sharp** requiere, además, una configuración específica del **runner JavaScript de n8n** con el paquete `sharp` accesible. **No basta con instalar el Starter Kit oficial sin más.**

Desde `~/self-hosted-ai-starter-kit/` en Linux Mint:

```bash
sudo docker compose --profile gpu-nvidia up -d   # Arrancar
sudo docker compose --profile gpu-nvidia ps      # Comprobar servicios
sudo docker compose --profile gpu-nvidia stop    # Detener sin borrar datos
```

Si ese ordenador no dispone de GPU NVIDIA configurada, utiliza el perfil `cpu`. Abre n8n en **http://localhost:5678**.

### 2. Portátil: `KITSTarter` del repositorio

La carpeta [`KITSTarter/`](KITSTarter/) es un **kit simplificado propio para el portátil**: permite levantar una demostración local sin instalar todo el Starter Kit oficial. Su contenido es:

| Archivo | Utilidad |
| --- | --- |
| [`compose.yaml`](KITSTarter/compose.yaml) | Define dos contenedores: **n8n** y **Ollama**. Guarda sus datos en volúmenes Docker (`n8n_data` y `ollama_data`). No incluye PostgreSQL, Qdrant ni runner de Sharp. |
| [`instalar.sh`](KITSTarter/instalar.sh) | Instalación inicial: comprueba Docker/Compose, arranca los contenedores y descarga `gemma3:4b` en Ollama. Requiere conexión para las descargas. |
| [`iniciar.sh`](KITSTarter/iniciar.sh) | Arranca los servicios cuando vuelvas a trabajar con el portátil. |
| [`apagar.sh`](KITSTarter/apagar.sh) | Detiene los contenedores **sin borrar los volúmenes**. |
| [`GUIA_OFICINA.md`](KITSTarter/GUIA_OFICINA.md) | Manual detallado para instalar, importar el workflow y resolver problemas comunes en Linux Mint. |

**Primera instalación** (desde la carpeta del repositorio clonado en el portátil):

```bash
cd KITSTarter
bash instalar.sh
```

**Días posteriores**, desde esa misma carpeta:

```bash
bash iniciar.sh
# Abrir http://localhost:5678
bash apagar.sh    # Ejecutar al terminar
```

El portátil emplea el `compose.yaml` de `KITSTarter` **sin perfiles** (`docker compose up -d`); no requiere `--profile gpu-nvidia` ni `--profile cpu`. La primera ejecución puede ser lenta si procesa imágenes únicamente con CPU.

> **Compatibilidad actual:** `KITSTarter` es adecuado para probar workflows básicos basados en formularios y Ollama. **El workflow completo `nifOllamaGemma_limpio_2026-10-27.json` no funcionará sin cambios en el portátil**, porque usa un nodo que necesita el runner JavaScript con `sharp`, que el kit ligero no proporciona. Para usarlo allí, habría que añadir ese runner y verificar los recursos disponibles.

> **Muy importante:** `git clone` o `git pull` actualizan **los archivos del repositorio**, pero **no importan automáticamente workflows a n8n** ni copian las cuentas, credenciales, imágenes o modelos entre ordenadores. Los workflows se importan desde sus JSON; el modelo se descarga por separado en cada Ollama. No utilices `docker compose down -v` si quieres conservar los datos.

## Estructura del repositorio

```text
nif-blur-gemma3-n8n/
├── README.md
├── KITSTarter/                   # Kit ligero para portátil (n8n + Ollama en CPU)
│   ├── compose.yaml              # Servicios y volúmenes Docker
│   ├── instalar.sh               # Preparación inicial
│   ├── iniciar.sh                # Encender los servicios
│   ├── apagar.sh                 # Detener sin borrar datos
│   └── GUIA_OFICINA.md           # Guía del portátil
├── config/                       # Ejemplos de configuración de la versión inicial
├── src/nodos/
│   ├── 02-validar-imagen.js      # Versión inicial
│   ├── 03-preparar-base64.js
│   ├── 05-interpretar-resultado.js
│   └── nifOllamaGemma/          # 16 JS del workflow actual
│       ├── intento_1/
│       ├── intento_2/
│       ├── intento_3/
│       ├── validacion_nitidez/
│       └── extraccion_nosql/
├── prompts/nifOllamaGemma/      # Prompts de clasificación y extracción
├── workflow/                    # Exportaciones JSON de n8n
└── docs/                        # FAQ, mapa de nodos, cambios y pendientes
```

El workflow más reciente de esta entrega es **[`workflow/nifOllamaGemma_limpio_2026-10-27.json`](workflow/nifOllamaGemma_limpio_2026-10-27.json)**. Las versiones anteriores se conservan para consultar la evolución del proyecto.

Los archivos `.js` están separados para facilitar su lectura y mantenimiento en VS Code. **No se ejecutan directamente desde esas carpetas**: el código ya está incluido dentro de los nodos `Code` del workflow exportado.

## Puesta en marcha rápida

### Requisitos

- Git, Docker Engine + Docker Compose (Linux) o Docker Desktop con WSL2 (Windows).
- Para el **PC de casa**, [Self-hosted AI Starter Kit oficial de n8n](https://github.com/n8n-io/self-hosted-ai-starter-kit); para el **portátil**, el kit ligero de `KITSTarter/`.
- Modelo de visión `gemma3:4b` descargado en Ollama.
- **Runner JavaScript de n8n con el paquete `sharp` disponible** para el nodo de nitidez. No viene garantizado en una instalación básica.
- GPU NVIDIA opcional. También puede utilizarse CPU, con menor rendimiento.

### PC de casa: Linux Mint / Ubuntu (kit oficial)

```bash
# Instalar el entorno base (si todavía no lo tienes)
git clone https://github.com/n8n-io/self-hosted-ai-starter-kit.git
cd self-hosted-ai-starter-kit
cp .env.example .env
# Editar .env antes de arrancar y establecer contraseñas propias
sudo docker compose --profile gpu-nvidia up -d
sudo docker exec ollama ollama pull gemma3:4b
```

Sin GPU NVIDIA, sustituye `gpu-nvidia` por `cpu`. Si Docker está configurado para tu usuario, puedes omitir `sudo`.

### Otro equipo con Windows (PowerShell; kit oficial)

```powershell
git clone https://github.com/n8n-io/self-hosted-ai-starter-kit.git
cd self-hosted-ai-starter-kit
Copy-Item .env.example .env
# Editar .env y arrancar Docker Desktop (WSL2)
docker compose --profile cpu up -d
docker exec ollama ollama pull gemma3:4b
```

En Windows también se puede usar el perfil `gpu-nvidia` si la GPU y WSL2 están correctamente configurados.

Abre **http://localhost:5678** para acceder a n8n en el equipo en el que hayas arrancado los contenedores. Dentro de la red Docker, el servicio Ollama se consulta mediante `http://ollama:11434`; si publicas el puerto `11435` en el equipo anfitrión, esa dirección interna **no cambia**. Para instalar o arrancar el **portátil**, utiliza los scripts de `KITSTarter/` indicados arriba, no estos comandos del kit oficial.

> Estos pasos preparan el entorno base. Para ejecutar el workflow completo es necesario configurar también la credencial de Ollama en n8n y su runner JavaScript con Sharp. Consulta la [FAQ](docs/FAQ.md) y la [documentación de cambios](docs/CAMBIOS_nifOllamaGemma_2026-10-27.md). No subas el archivo `.env` al repositorio.

### Importar y ejecutar el workflow (cada equipo por separado)

1. Descarga o clona este repositorio y abre n8n.
2. Crea un workflow y selecciona **Import from File** con [`nifOllamaGemma_limpio_2026-10-27.json`](workflow/nifOllamaGemma_limpio_2026-10-27.json).
3. Configura la conexión de Ollama del nodo **`Analyze image1`** y comprueba que el modelo `gemma3:4b` está disponible.
4. Verifica que las llamadas HTTP utilizan `http://ollama:11434/api/chat`, que Sharp está disponible y que el archivo se recibe en la propiedad binaria **`Imagen`**.
5. Ejecuta el formulario en modo de prueba y sube una **imagen ficticia** JPG o PNG. Comprueba las diferentes salidas antes de activarlo para otros usos.

Para arrancar y detener el **PC de casa** otro día, usa Docker Compose desde `~/self-hosted-ai-starter-kit/`. En el **portátil**, utiliza `bash iniciar.sh` y `bash apagar.sh` desde `KITSTarter/`. Ambos conservan los datos mientras no se borren sus volúmenes.

## Limitaciones y próximos pasos

- **La nitidez no garantiza legibilidad:** el umbral `220` es orientativo y necesita pruebas con imágenes variadas.
- **La IA puede equivocarse:** se han observado intercambios de nombre y apellidos, campos dudosos y fechas inconsistentes. No tratar la extracción como verificada.
- El control `Evaluar extraccion` comprueba presencia de campos, **no su veracidad** ni los dígitos de control del DNI/NIE.
- Unificar reintentos de reconocimiento y desenfoque, mejorar el control de errores y definir validaciones independientes de la IA.
- Preparar la comunicación con el frontend React y, posteriormente, una integración segura con Firestore; **ninguna de esas integraciones forma parte aún de este flujo**.

Consulta el [listado de pendientes](docs/PENDIENTES_nifOllamaGemma.md) para más detalles.

## Documentación

- [Correspondencia entre los nodos y los 16 archivos JavaScript](docs/MAPA_NODOS_nifOllamaGemma.md)
- [Cambios de la versión del 27/10/2026](docs/CAMBIOS_nifOllamaGemma_2026-10-27.md)
- [Limitaciones y pendientes](docs/PENDIENTES_nifOllamaGemma.md)
- [Preguntas frecuentes](docs/FAQ.md)
- [Notas sobre exportación e importación de workflows](workflow/LEEME.md)
- [Kit ligero para el portátil: archivos y scripts](KITSTarter/)
- [Guía del kit de oficina (Linux Mint)](KITSTarter/GUIA_OFICINA.md)

## Privacidad y uso responsable

**Utiliza únicamente imágenes sintéticas o documentos de prueba autorizados.** Base64 **no anonimiza** el contenido; n8n puede conservar entradas y salidas en el historial de ejecuciones. No publiques datos personales, fotografías reales, contraseñas, credenciales ni archivos `.env` en GitHub.

Este es un **proyecto formativo**, no un sistema de verificación de identidad, autenticidad documental ni validez jurídica.
