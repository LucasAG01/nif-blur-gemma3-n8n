const item = $input.first();

if (!item.binary?.Imagen) {
  throw new Error("No se recibió la segunda imagen");
}

return [{
  json: {
    ...item.json,
    intentos: 1
  },
  binary: item.binary
}];