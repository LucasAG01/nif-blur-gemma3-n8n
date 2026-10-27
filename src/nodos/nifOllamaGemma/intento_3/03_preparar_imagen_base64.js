
const item = $input.first();

// Recuperar el contador actual
const intentos = Number(item.json.intentos ?? 2);

// Comprobar que existe la tercera imagen
if (!item.binary?.Imagen) {
  throw new Error("No se recibió la imagen del tercer intento");
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

// Convertir a Base64
const imagenBase64 = buffer.toString("base64");

// Devolver los datos conservando la imagen
return [{
  json: {
    ...item.json,
    intentos,
    tamanoBytes: buffer.length,
    imagenBase64
  },
  binary: item.binary
}];
