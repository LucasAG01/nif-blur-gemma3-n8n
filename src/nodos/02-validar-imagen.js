// Nodo 02 - Validar imagen
// Entrada: propiedad binaria «Imagen» del Form Trigger.
// Salida: metadatos y mismo archivo binario para el nodo siguiente.
// Ejecutar una vez para todos los ítems (Run Once for All Items).
const item = $input.first();

const imagen = item.binary?.Imagen;
if (!imagen) {
  throw new Error('No se ha recibido ninguna imagen');
}

if (!['image/jpeg', 'image/png'].includes(imagen.mimeType)) {
  throw new Error('Formato de imagen no permitido');
}

return [{
  json: {
    archivo: imagen.fileName,
    formato: imagen.mimeType,
    resultado: 'Imagen recibida correctamente'
  },
  binary: item.binary
}];
