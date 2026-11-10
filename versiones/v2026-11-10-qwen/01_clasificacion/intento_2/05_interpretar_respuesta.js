const respuesta = $input.first().json.message?.content;

// Recuperar la imagen y los datos del SEGUNDO intento
const origen = $("03 - Preparar imagen Base67").first();

if (!origen.binary?.Imagen) {
  throw new Error("No se encuentra la imagen del segundo intento");
}

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

  if (
    !documento ||
    typeof documento !== "object" ||
    Array.isArray(documento)
  ) {
    throw new Error("Respuesta JSON incorrecta");
  }

} catch (error) {
  documento = {
    estado: "REVISION_MANUAL",
    tipo_documento: "INDETERMINADO",
    motivo: "No se pudo interpretar la respuesta",
    documento_visible: null,
    documento_completo: null,
    mano_externa_visible: null,
    persona_externa_visible: null
  };
}

const tiposAdmitidos = [
  "DNI_NIF",
  "TIE_NIE",
  "CERTIFICADO_NIE",
  "DOCUMENTO_NIF",
  "PASAPORTE"
];

const tipoAdmitido =
  tiposAdmitidos.includes(documento.tipo_documento);

const presentacionCorrecta =
  documento.documento_visible === true &&
  documento.documento_completo === true &&
  documento.mano_externa_visible === false &&
  documento.persona_externa_visible === false;

const documentoReconocido =
  documento.estado === "APTA" &&
  tipoAdmitido &&
  presentacionCorrecta;

const presentacionIncorrecta =
  documento.mano_externa_visible === true ||
  documento.persona_externa_visible === true ||
  documento.documento_completo === false;

const estado =
  documentoReconocido ? "APTA" :
  presentacionIncorrecta ? "NO_APTA" :
  documento.estado === "NO_APTA" ? "NO_APTA" :
  "REVISION_MANUAL";

// Incrementar desde el contador del SEGUNDO intento
const intentos = Number(origen.json.intentos ?? 1) + 1;

return [{
  json: {
    ...documento,
    estado,
    documentoReconocido,
    presentacionCorrecta,
    intentos,
    imagenAnalizada: "intento_2"
  },
  binary: origen.binary
}];
