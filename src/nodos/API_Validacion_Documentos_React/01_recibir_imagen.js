
const item = $input.first();

// Buscar el archivo que haya llegado al Webhook
const campos = Object.keys(item.binary ?? {});

const campoImagen = campos.includes("Imagen")
  ? "Imagen"
  : campos.length === 1
    ? campos[0]
    : null;

const imagen = campoImagen
  ? item.binary[campoImagen]
  : null;

return [{
  json: {
    imagenRecibida: Boolean(imagen),
    campoBinario: campoImagen,
    archivo: imagen?.fileName ?? null,
    formato: imagen?.mimeType ?? null,
    mensaje: imagen
      ? "Imagen recibida correctamente"
      : "No se ha recibido ninguna imagen"
  },
  binary: item.binary
}];
