# Exportar tu workflow exacto

**El JSON `nif-blur-gemma3-4b_RECONSTRUIDO.json` es una reconstrucción didáctica de nuestros seis pasos, NO una exportación de tu n8n real.** Se ha validado su estructura como JSON, pero no ejecutado en tu instalación.

Para compartir la versión exacta que construiste:

1. Entra en `http://localhost:5678` y abre **tu workflow de seis nodos**.
2. Menú `...` arriba a la derecha → **Download / Export**.
3. Guarda el archivo como `nif-blur-gemma3-4b.json` en esta carpeta.
4. Abre el JSON y revisa que NO contenga imágenes en Base64, datos de documentos reales, tokens, URLs internas o credenciales. Borra datos de prueba y `pinData` si los hay.
5. Haz `git add` y `git commit` únicamente después de revisarlo.

Para importar en otro n8n: workflow nuevo → menú `...` → **Import from File** → elegir el JSON. Puede haber pequeñas diferencias de interfaz entre versiones. Comprueba el Form Trigger, el cuerpo HTTP y el Form Ending antes de probarlo.

Los scripts JavaScript del directorio `src/nodos/` están escritos por separado para que sea fácil estudiar y copiar cada nodo, **no se ejecutan por separado con Node.js**. Dependen del contexto `$input` y `this.helpers` de n8n.
