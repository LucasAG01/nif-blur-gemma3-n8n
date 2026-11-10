const respuesta = $input.first().json.message?.content;
const origen = $("03 - Preparar imagen Base66").first();

let documento;
let errorInterpretacion = null;

try {
  if (typeof respuesta !== "string" || !respuesta.trim()) {
    throw new Error("Respuesta vacía");
  }

  const limpio = respuesta
    .trim()
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
  errorInterpretacion = error.message;

  documento = {
    estado: "REVISION_MANUAL",
    tipo_documento: "INDETERMINADO",
    motivo: "No se pudo interpretar la respuesta de la IA",
    documento_visible: null,
    documento_completo: null,
    mano_externa_visible: null,
    persona_externa_visible: null
  };
}

// Tipos admitidos, incluidos los latinoamericanos.
const tiposAdmitidos = [
  "DNI_NIF",
  "TIE_NIE",
  "CERTIFICADO_NIE",
  "DOCUMENTO_NIF",
  "ID_LATAM",
  "PASAPORTE"
];

const tipoAdmitido = tiposAdmitidos.includes(
  documento.tipo_documento
);

// Conservar el estado original de Qwen.
const estadoIA = documento.estado;

// Comprobaciones básicas.
const documentoVisible =
  documento.documento_visible === true;

const documentoCompleto =
  documento.documento_completo === true;

// Las manos visibles ya NO implican rechazo automático.
// Qwen debe evaluar si realmente impiden analizar el documento.

// La presentación es correcta cuando Qwen la considera
// APTA y los indicadores esenciales son coherentes.
const presentacionCorrecta =
  estadoIA === "APTA" &&
  documentoVisible &&
  documentoCompleto;

// Un documento reconocido debe pertenecer
// a una categoría admitida.
const documentoReconocido =
  tipoAdmitido &&
  presentacionCorrecta;

// Decisión final.
let estado;

if (
  documento.documento_visible === false ||
  documento.documento_completo === false ||
  documento.tipo_documento === "OTRO"
) {
  // No hay documento admitido o faltan partes esenciales.
  estado = "NO_APTA";

} else if (
  !tipoAdmitido ||
  !documentoVisible ||
  !documentoCompleto
) {
  // No hay información suficiente para aceptar.
  estado = "REVISION_MANUAL";

} else if (estadoIA === "NO_APTA") {
  // Qwen ha identificado una presentación inadecuada.
  estado = "NO_APTA";

} else if (estadoIA === "APTA") {
  // Documento admitido, completo y aprobado por Qwen.
  // Puede haber una mano visible si no impide la lectura.
  estado = "APTA";

} else {
  estado = "REVISION_MANUAL";
}

const intentos = Number(origen.json.intentos ?? 0) + 1;

return [{
  json: {
    ...documento,

    estadoOriginalIA: estadoIA,
    estado,

    tipoAdmitido,
    documentoReconocido: estado === "APTA",
    presentacionCorrecta: estado === "APTA",

    errorInterpretacion,

    intentos,
    imagenAnalizada: "intento_1"
  },

  binary: origen.binary
}];
