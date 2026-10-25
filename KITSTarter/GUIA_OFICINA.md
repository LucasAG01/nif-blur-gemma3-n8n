# Demostración en ThinkPad (Linux Mint): n8n + Gemma 3 4B

Este pequeño kit va **dentro de la raíz del repositorio GitHub** que ya contiene el workflow real (`.json`) del proyecto de Lucas. No borra el README, el código JavaScript ni las notas existentes.

## Objetivo

Ejecutar el workflow de seis nodos construido en n8n (Form Trigger → validar imagen → Base64 → HTTP Request a Ollama/Gemma → interpretar JSON → Form Ending) **en un ThinkPad sin necesidad de gráfica NVIDIA**.

**Solo se usan dos servicios:** n8n y Ollama. No hace falta el Starter Kit grande, PostgreSQL ni Qdrant para este workflow; n8n guarda sus datos en SQLite dentro de un volumen Docker.

**Recomendación:** 16 GiB RAM, varios GB de almacenamiento libre para Docker y el modelo (`gemma3:4b` ocupa aproximadamente 3,4 GB), conexión a Internet durante la instalación. Con CPU sin GPU dedicada, el análisis visual puede tardar bastante. En 8 GiB puede ser impracticablemente lento; comprueba `free -h`.

## Preparar el repositorio (una sola vez, ordenador de Lucas)

Copia estos archivos a la **raíz de tu repositorio ya existente**:

```text
compose.yaml
instalar.sh
iniciar.sh
apagar.sh
GUIA_OFICINA.md
```

Conserva dentro de `workflow/` **tu exportación original de n8n, con tus notas**. No sustituyas ese JSON por ninguna reconstrucción de ejemplo. Sube los cinco archivos nuevos a GitHub con `git add ...`, `git commit` y `git push`.

## Instalación desde cero en ThinkPad (una vez por ordenador)

Abre Kitty u otra terminal en Linux Mint (Fish también sirve; los scripts se ejecutan con Bash):

```bash
sudo apt update && sudo apt install -y git
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
bash instalar.sh
```

Sustituye la URL y el nombre de la carpeta por los de **tu repositorio real**. `instalar.sh` instala Docker y Compose desde los repositorios de Mint/Ubuntu si faltan, arranca n8n + Ollama y descarga Gemma 3 4B. Si Docker ya está instalado, no lo sustituye. No usa NVIDIA ni CUDA.

> Los paquetes `docker.io` y `docker-compose-v2` están disponibles en la base Ubuntu 24.04 (Linux Mint 22.x). Si tu ThinkPad utiliza LMDE o una base diferente, sigue la documentación de Docker para esa distribución.

## Importar el workflow (una vez por ordenador)

1. Abre **http://localhost:5678** y crea la cuenta **local** de n8n (no es necesario registrarse en n8n Cloud).
2. Pulsa **Build a workflow** → menú **...** → **Import from File**.
3. Selecciona el archivo **`.json` REAL** que has subido al directorio `workflow/` del repositorio.
4. Revisa que el campo del formulario se llama `Imagen` y acepta JPG/PNG.
5. Revisa el nodo **HTTP Request**: método `POST`, URL `http://ollama:11434/api/chat`, modelo `gemma3:4b`, sin API Key externa.
6. Guarda el workflow. Pulsa **Execute workflow** (no solo Execute step), abre el formulario de prueba y sube una **imagen ficticia**.
7. Comprueba que el formulario final muestra `estado`, `desenfoque` y `motivo`.

Si el ThinkPad es lento y la petición falla por tiempo de espera, aumenta en el nodo HTTP Request el **Timeout** a `600000` milisegundos (10 minutos). Es una medida de diagnóstico, no un rendimiento aceptable para producción.

**IMPORTANTE:** `http://ollama:11434` es la URL *interna* entre contenedores. Ollama no expone el puerto 11434 en tu portátil; no necesitas instalar Ollama fuera de Docker. Si usas la URL de formulario de producción, publica primero el workflow. En pruebas, pulsa Execute workflow para habilitar la URL de prueba.

## Cada día: encender y apagar

Desde la carpeta clonada:

```bash
bash iniciar.sh
# Abre http://localhost:5678
bash apagar.sh
```

No se pierden el workflow, el usuario ni el modelo al apagar: se guardan en los volúmenes `n8n_data` y `ollama_data`.

Otros comandos útiles:

```bash
sudo docker compose ps
sudo docker compose exec -T ollama ollama list
sudo docker compose logs --tail=50 n8n
sudo docker compose logs --tail=50 ollama
```

**NO EJECUTAR:** `sudo docker compose down -v` (borra los volúmenes y los datos).

## Qué se demuestra al equipo

- Workflow propio con **seis nodos**: recepción, validación, Base64, Gemma, interpretación y visualización.
- **Gemma 3 4B** se ejecuta en local y recibe una imagen en su API a través de Ollama.
- El formulario de n8n muestra un resultado **APTA / NO_APTA / REVISION_MANUAL** y un nivel de desenfoque.
- Esta versión **no incluye todavía** el detector de varianza/Laplaciano desarrollado por el compañero, ni React, ni extracción/ocultación de datos personales.

## Problemas frecuentes

| Síntoma | Solución |
|---|---|
| `docker: command not found` | Ejecuta `bash instalar.sh` desde el repo (o instala Docker para tu versión de Mint). |
| `permission denied` al usar Docker | Usa los comandos con `sudo` como en esta guía. |
| `address already in use` en `5678` | Otro n8n usa ese puerto: detén el servicio anterior o cambia **solo** `127.0.0.1:5678:5678` a `127.0.0.1:5679:5678` y entra en `localhost:5679`. |
| Ollama: `ECONNREFUSED` | Dentro de n8n comprueba `http://ollama:11434/api/chat`, no `localhost:11434`. |
| `model not found` | `sudo docker compose exec -T ollama ollama pull gemma3:4b`. |
| El workflow no aparece | Importa el `.json` manualmente desde el editor; clonar GitHub **no lo importa automáticamente** en la base SQLite de n8n. |
| Gemma tarda demasiado | ThinkPad sin NVIDIA = inferencia en CPU. Cierra programas pesados, comprueba la RAM, aumenta Timeout si es necesario. |
| Fish rechaza `<<EOF` | Esta guía evita heredocs; usa `bash instalar.sh`. |

## Seguridad y limitaciones

**Utiliza solo NIF ficticios/sintéticos en las demostraciones.** n8n puede guardar la imagen y su Base64 en el historial de ejecuciones. No copies secretos, credenciales ni expedientes auténticos al repositorio ni a las demostraciones. `127.0.0.1` limita el acceso al editor al propio portátil: para que otro compañero lo use, mejor que clone el repositorio y monte el suyo.

La detección de blur mediante Gemma es una **estimación visual**, no una comprobación criptográfica, biométrica o de autenticidad documental.

## Fuentes oficiales

- https://docs.n8n.io/ (Docker y nodos de formulario)
- https://ollama.com/library/gemma3
- https://docs.docker.com/engine/install/ubuntu/
