
const respuesta = $input.first().json.message?.content;

// Recuperamos los datos de la segunda imagen
const origen = $("03 - Preparar imagen Base67").first();

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

// Tipos documentales permitidos
const tiposAdmitidos = [
  "DNI_NIF",
  "TIE_NIE",
  "CERTIFICADO_NIE",
  "DOCUMENTO_NIF"
];

const documentoReconocido =
  documento.estado === "APTA" &&
  tiposAdmitidos.includes(documento.tipo_documento);

// Incrementar el contador
const intentosPrevios = Number(origen.json.intentos ?? 1);
const intentos = intentosPrevios + 1;

// Devolver el resultado y conservar la imagen
return [{
  json: {
    ...documento,
    documentoReconocido,
    intentos,
    imagenAnalizada: "intento_2"
  },
  binary: origen.binary
}];
