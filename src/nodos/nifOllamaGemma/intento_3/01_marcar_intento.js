
const item = $input.first();

// Comprobar que hemos recibido una imagen nueva
if (!item.binary?.Imagen) {
  throw new Error("No se recibió la tercera imagen");
}

// Antes de analizar esta imagen ya hubo 2 intentos
return [{
  json: {
    ...item.json,
    intentos: 2
  },
  binary: item.binary
}];
