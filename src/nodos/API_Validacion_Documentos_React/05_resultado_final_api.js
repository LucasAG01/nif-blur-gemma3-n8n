
const datos = $input.first().json;

// Resultado de Gemma
const documentoOK =
  datos.estado === "APTA" &&
  datos.documentoReconocido === true &&
  datos.presentacionCorrecta === true;

// Resultado de Sharp
const nitidezOK =
  datos.valida === true &&
  datos.estadoNitidez === "NITIDA";

let estadoFinal;
let motivo;

if (datos.estado === "NO_APTA") {
  estadoFinal = "NO_APTA";
  motivo = datos.motivo || "Documento no admitido.";

  if (datos.valida === false) {
    motivo += " La imagen tampoco supera el control de nitidez.";
  }

} else if (datos.valida === false) {
  estadoFinal = "NO_APTA";
  motivo = datos.motivoNitidez ||
    "La fotografía está demasiado borrosa.";

} else if (documentoOK && nitidezOK) {
  estadoFinal = "APTA";
  motivo = "Documento reconocido, presentación correcta y nitidez suficiente.";

} else {
  estadoFinal = "REVISION_MANUAL";
  motivo = datos.motivo ||
    "No se pudo confirmar la validez de la imagen.";
}

// Respuesta final para React
return [{
  json: {
    apta: estadoFinal === "APTA",
    estado: estadoFinal,
    tipo_documento: datos.tipo_documento ?? "INDETERMINADO",
    nitidez: datos.estadoNitidez ?? "SIN_EVALUAR",
    varianza: datos.varianza ?? null,
    umbral: datos.umbral ?? null,
    requiere_nueva_foto: estadoFinal === "NO_APTA",
    requiere_revision_manual: estadoFinal === "REVISION_MANUAL",
    motivo
  }
}];
