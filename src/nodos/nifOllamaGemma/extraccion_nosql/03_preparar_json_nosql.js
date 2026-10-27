
const item = $input.first();
const datos = item.json.datosExtraidos;

// Comprobamos que la IA haya devuelto datos utilizables

if (
  !datos ||
  typeof datos !== "object" ||
  Array.isArray(datos)
) {
  return [{
    json: {
      ...item.json,
      registroNoSQL: null,
      jsonParaMostrar: "Extracción no disponible",
      estadoFinal: "REVISIÓN MANUAL",
      verificacionPendiente: true
    }
  }];
}


// Conservamos los textos sin inventar valores
const texto = (campo) => {
  const valor = datos[campo];
  return typeof valor === "string" && valor.trim()
    ? valor.trim()
    : null;
};

// Objeto preparado para una base de datos NoSQL
const registroNoSQL = {
  version_esquema: 1,

  documento: {
    tipo_documento: texto("tipo_documento"),
    pais_emisor: texto("pais_emisor"),
    numero_documento: texto("numero_documento"),
    numero_soporte: texto("numero_soporte"),
    nombre: texto("nombre"),
    apellidos: texto("apellidos"),
    fecha_nacimiento: texto("fecha_nacimiento"),
    fecha_caducidad: texto("fecha_caducidad"),
    nacionalidad: texto("nacionalidad"),
    es_especimen:
      typeof datos.es_especimen === "boolean"
        ? datos.es_especimen
        : null
  },

  evaluacion: {
    estado_nitidez: item.json.estadoNitidez ?? null,
    varianza: item.json.varianza ?? null,
    umbral: item.json.umbral ?? null,
    intento: item.json.intentos ?? null,
    campos_dudosos: Array.isArray(datos.campos_dudosos)
      ? datos.campos_dudosos
      : [],
    verificado: false
  },

  metadatos: {
    fecha_procesamiento: new Date().toISOString(),
    origen: "n8n_local"
  }
};

// Devolvemos el objeto y una versión legible
return [{
  json: {
    ...item.json,
    registroNoSQL,
    jsonParaMostrar: JSON.stringify(registroNoSQL, null, 2)
  }
}];
