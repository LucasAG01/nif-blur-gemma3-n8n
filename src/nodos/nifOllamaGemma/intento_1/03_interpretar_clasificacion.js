
const respuesta = $input.first().json.message?.content;

// Imagen y datos del primer intento
const origen = $("03 - Preparar imagen Base66").first();

let documento;

try {
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

const tiposAdmitidos = [
  "DNI_NIF",
  "TIE_NIE",
  "CERTIFICADO_NIE",
  "DOCUMENTO_NIF"
];

const documentoReconocido =
  documento.estado === "APTA" &&
  tiposAdmitidos.includes(documento.tipo_documento);

const intentos = Number(origen.json.intentos ?? 0) + 1;

return [{
  json: {
    ...documento,
    documentoReconocido,
    intentos,
    imagenAnalizada: "intento_1"
  },
  binary: origen.binary
}];
