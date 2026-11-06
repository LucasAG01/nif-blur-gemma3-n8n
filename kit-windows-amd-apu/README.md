# Kit starter para Windows (AMD APU / CPU) — n8n + Ollama

Este kit permite probar el workflow `nifOllamaGemma_2026-11-06` en un equipo Windows con APU AMD. Ollama se ejecutará en **modo CPU**, por lo que el rendimiento será más lento que con una GPU dedicada, pero funcional.

## Requisitos

- **Docker Desktop para Windows** con backend WSL 2 (recomendado). Descárgalo desde [docker.com](https://www.docker.com/products/docker-desktop).
- **16 GB de RAM** o más. Con 8 GB el análisis de imágenes puede ser muy lento o fallar.
- **Espacio en disco**: al menos 10 GB libres (imagen de n8n + modelo `gemma3:4b`).
- **Virtualización habilitada** en la BIOS/UEFI.

## Instalación

1. Abre PowerShell como administrador.
2. Navega a la carpeta del kit:
   ```powershell
   cd ruta\al\kit-windows-amd-apu
```

3. Ejecuta:

```
.\instalar.ps1
```

El script construye la imagen, inicia los contenedores y descarga el modelo.

## Uso diario

- **Iniciar**: `.\iniciar.ps1`
- **Apagar**: `.\apagar.ps1`

## Importar el workflow

1. Abre `http://localhost:5678` en el navegador.
2. Crea un usuario local (no necesitas n8n Cloud).
3. Menú **...** → **Import from File**.
4. Selecciona `workflow/nifOllamaGemma_2026-11-06.json`.
5. Revisa el nodo **Analyze image1** y asegúrate de que el modelo sea `gemma3:4b`.
6. Guarda el workflow y pruébalo con una imagen ficticia (JPG o PNG).

## Notas importantes

- **Rendimiento**: Al usar CPU, el análisis de una imagen puede tardar entre 30 segundos y varios minutos. Ten paciencia.
- **Sharp**: La imagen de n8n se ha construido con `sharp` instalado. Si actualizas n8n a una versión ≥ 1.94.0, `sharp` dejará de funcionar y el nodo de nitidez fallará.
- **Datos**: Los volúmenes `n8n_data` y `ollama_data` conservan workflows, credenciales y el modelo entre reinicios. No uses `docker compose down -v`.
- **Seguridad**: El endpoint de n8n queda expuesto en `localhost:5678`. No lo publiques en Internet sin añadir autenticación.

## Solución de problemas

- **`docker: command not found`**: Docker Desktop no está en el PATH. Reinicia la sesión de PowerShell o reinstala Docker Desktop.
- **Ollama no responde**: Verifica que el contenedor esté en ejecución con `docker compose ps`. Si es necesario, reinicia con `.\apagar.ps1` y `.\iniciar.ps1`.
- **El workflow falla en el nodo de nitidez**: Asegúrate de que la imagen se construyó con el `Dockerfile` incluido (versión 1.93.0 + sharp).


