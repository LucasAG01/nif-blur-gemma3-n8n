
const contenido = $input.first().json.content;

// Recuperar resultados de Sharp
const nitidez = $("03 - Ejecución validate1").first().json;

let datosExtraidos = null;
let errorExtraccion = null;

try {
  if (typeof contenido !== "string") {
    throw new Error("La IA no devolvió texto");
  }

  // Eliminar los delimitadores de Markdown
  const limpio = contenido
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  // Convertir el texto de Gemma a objeto JSON
  datosExtraidos = JSON.parse(limpio);

  if (
    !datosExtraidos ||
    typeof datosExtraidos !== "object" ||
    Array.isArray(datosExtraidos)
  ) {
    throw new Error("La respuesta no es un objeto JSON");
  }

} catch (error) {
  errorExtraccion = error.message;
}

// Preparar un estado final
let estadoFinal;

if (!nitidez.valida) {
  estadoFinal = "REVISIÓN MANUAL";
} else if (errorExtraccion) {
  estadoFinal = "ERROR DE EXTRACCIÓN";
} else {
  estadoFinal = "EXTRACCIÓN FINALIZADA";
}

return [{
  json: {
    ...nitidez,
    datosExtraidos,
    errorExtraccion,
    estadoFinal,
    verificacionPendiente: true
  }
}];
