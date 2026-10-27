const datosEntrada = $input.first();

const imagen = datosEntrada.binary?.Imagen;

if (!imagen) {
  throw new Error("No se ha recibido ninguna imagen");
}

if (!["image/jpeg", "image/png"].includes(imagen.mimeType)) {
  throw new Error("Formato de imagen no permitido");
}

return [{
  json: {
    archivo: imagen.fileName,
    formato: imagen.mimeType,
    resultado: "Imagen recibida correctamente",
    intentos: Number(datosEntrada.json.intentos ?? 0)
  },
  binary: datosEntrada.binary
}];