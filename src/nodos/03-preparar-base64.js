// Nodo 03 - Preparar imagen Base64
// Entrada: JSON + archivo binario «Imagen» del nodo 02.
// Salida: imagenBase64, tamaño y demás metadatos.
// Base64 NO es cifrado ni anonimización.
const item = $input.first();
const buffer = await this.helpers.getBinaryDataBuffer(0, 'Imagen');

if (buffer.length > 8 * 1024 * 1024) {
  throw new Error('La imagen supera los 8 MiB');
}

const imagenBase64 = buffer.toString('base64');

return [{
  json: {
    ...item.json,
    tamanoBytes: buffer.length,
    imagenBase64: imagenBase64
  },
  binary: item.binary
}];
