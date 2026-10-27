
const item = $input.first();

// Número de intentos realizados antes de esta imagen
const intentos = Number(item.json.intentos ?? 1);

// Comprobar que existe la imagen actual
if (!item.binary?.Imagen) {
  throw new Error("No se recibió la imagen del segundo intento");
}

// Obtener los bytes de la imagen actual
const buffer = await this.helpers.getBinaryDataBuffer(
  0,
  "Imagen"
);

// Comprobar tamaño máximo: 8 MiB
if (buffer.length > 8 * 1024 * 1024) {
  throw new Error("La imagen supera los 8 MiB");
}

// Convertir a Base64 para Gemma
const imagenBase64 = buffer.toString("base64");

return [{
  json: {
    ...item.json,
    intentos,
    tamanoBytes: buffer.length,
    imagenBase64
  },
  binary: item.binary
}];
