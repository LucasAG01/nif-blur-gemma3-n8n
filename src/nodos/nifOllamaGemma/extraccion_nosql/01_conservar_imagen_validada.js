
const item = $input.first();

// Utilizar la fotografía que ha pasado Sharp
if (!item.binary?.Imagen) {
  throw new Error(
    "No se recibió la imagen validada"
  );
}

// Mantener los resultados y la imagen correcta
return [{
  json: {
    ...item.json
  },
  binary: item.binary
}];
