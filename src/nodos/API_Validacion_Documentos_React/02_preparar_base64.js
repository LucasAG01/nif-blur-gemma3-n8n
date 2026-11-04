
const item = $input.first();

// Recuperar la fotografía recibida
const imagen = item.binary?.Imagen;

if (!imagen) {
  throw new Error("No se ha recibido ninguna imagen");
}

// Comprobar formato
const formatosPermitidos = [
  "image/jpeg",
  "image/png"
];

if (!formatosPermitidos.includes(imagen.mimeType)) {
  throw new Error("Formato no permitido. Usa JPG o PNG.");
}

// Recuperar los bytes de la imagen
const buffer = await this.helpers.getBinaryDataBuffer(
  0,
  "Imagen"
);

// Limitar a 8 MiB
if (buffer.length > 8 * 1024 * 1024) {
  throw new Error("La imagen supera el tamaño permitido");
}

// Convertir la imagen a Base64
const imagenBase64 = buffer.toString("base64");

return [{
  json: {
    ...item.json,
    imagenBase64,
    tamanoBytes: buffer.length,
    preparadaParaIA: true
  },
  binary: item.binary
}];
