
const respuesta = $input.first().json.message?.content;

// Recuperamos la imagen del tercer intento
const origen = $("03 - Preparar imagen Base68").first();

let documento;

try {
  if (typeof respuesta !== "string") {
    throw new Error("Respuesta vacía");
  }

  const limpio = respuesta
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  documento = JSON.parse(limpio);

} catch (error) {
  documento = {
    estado: "REVISION_MANUAL",
    tipo_documento: "INDETERMINADO",
    motivo: "No se pudo interpretar la respuesta de Gemma"
  };
}

// Tipos de documento admitidos
const tiposAdmitidos = [
  "DNI_NIF",
  "TIE_NIE",
  "CERTIFICADO_NIE",
  "DOCUMENTO_NIF"
];

// Comprobar si se ha reconocido
const documentoReconocido =
  documento.estado === "APTA" &&
  tiposAdmitidos.includes(documento.tipo_documento);

// Incrementar el contador
const intentosPrevios = Number(origen.json.intentos ?? 2);
const intentos = intentosPrevios + 1;

// Devolver resultado y conservar la tercera imagen
return [{
  json: {
    ...documento,
    documentoReconocido,
    intentos,
    imagenAnalizada: "intento_3"
  },
  binary: origen.binary
}];
