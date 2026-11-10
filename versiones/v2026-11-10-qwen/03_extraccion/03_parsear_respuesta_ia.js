const contenido = $input.first().json.content;

// Recuperar los resultados de Sharp.
const nitidez = $("03 - Ejecución validate1").first().json;

let datosExtraidos = null;
let errorExtraccion = null;

try {
  if (typeof contenido !== "string" || !contenido.trim()) {
    throw new Error("La IA no devolvió texto");
  }

  const limpio = contenido
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  datosExtraidos = JSON.parse(limpio);

  if (
    !datosExtraidos ||
    typeof datosExtraidos !== "object" ||
    Array.isArray(datosExtraidos)
  ) {
    throw new Error("La respuesta no es un objeto JSON");
  }

  // Comprobar que es una respuesta de extracción.
  const clavesPrincipales = [
    "tipo_documento",
    "numero_documento",
    "nombre",
    "apellidos"
  ];

  if (!clavesPrincipales.some(
    campo => Object.prototype.hasOwnProperty.call(
      datosExtraidos,
      campo
    )
  )) {
    throw new Error("La respuesta no tiene el esquema esperado");
  }

} catch (error) {
  errorExtraccion = error.message;
  datosExtraidos = null;
}

let estadoFinal;

if (nitidez.valida !== true) {
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
