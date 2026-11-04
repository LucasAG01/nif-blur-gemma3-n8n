
const respuesta = $input.first().json.message?.content;

// Recuperar la imagen original del nodo base64
const origen = $("base64").first();

if (!origen.binary?.Imagen) {
  throw new Error("No se encuentra la imagen original");
}

let documento;

try {
  if (typeof respuesta !== "string") {
    throw new Error("Respuesta vacía de Gemma");
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
    throw new Error("JSON incorrecto");
  }

} catch (error) {
  documento = {
    estado: "REVISION_MANUAL",
    tipo_documento: "INDETERMINADO",
    motivo: "No se pudo interpretar la respuesta de la IA"
  };
}


let tipoDocumento =
  documento.tipo_documento ?? "INDETERMINADO";

// Si la IA confirma que no existe documento visible,
// no conservamos un tipo documental inventado.
if (documento.documento_visible === false) {
  tipoDocumento = "OTRO";
} else if (documento.documento_visible !== true) {
  tipoDocumento = "INDETERMINADO";
}

// Tipos de documentos permitidos
const tiposAdmitidos = [
  "DNI_NIF",
  "TIE_NIE",
  "CERTIFICADO_NIE",
  "DOCUMENTO_NIF",
  "PASAPORTE"
];

// Comprobaciones visuales
const presentacionCorrecta =
  documento.documento_visible === true &&
  documento.documento_completo === true &&
  documento.mano_externa_visible === false &&
  documento.persona_externa_visible === false;

// Determinar si puede continuar
const documentoReconocido =
  documento.estado === "APTA" &&
  tiposAdmitidos.includes(tipoDocumento) &&
  presentacionCorrecta;

// Detectar incumplimientos claros
const incumplimiento =
  documento.documento_visible === false ||
  documento.documento_completo === false ||
  documento.mano_externa_visible === true ||
  documento.persona_externa_visible === true;

const estado = documentoReconocido
  ? "APTA"
  : (documento.estado === "NO_APTA" || incumplimiento)
    ? "NO_APTA"
    : "REVISION_MANUAL";

// Devolver únicamente los datos necesarios
return [{
  json: {
    estado,
    tipo_documento: tipoDocumento,
    documentoReconocido,
    presentacionCorrecta,
    motivo: estado === "APTA" || estado === documento.estado
      ? (documento.motivo ?? "Sin explicación")
      : "No se cumplen con seguridad las condiciones de presentación."
  },

  // Conservar la imagen para analizarla con Sharp después
  binary: origen.binary
}];
