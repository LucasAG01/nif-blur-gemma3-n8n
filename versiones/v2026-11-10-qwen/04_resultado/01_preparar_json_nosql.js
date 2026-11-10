const item = $input.first();
const datos = item.json.datosExtraidos;

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

// Conservar los textos sin inventar valores.
const texto = (campo) => {
  const valor = datos[campo];

  return typeof valor === "string" && valor.trim()
    ? valor.trim()
    : null;
};

// Campos que la IA ha identificado como dudosos.
const camposDudosos = Array.isArray(datos.campos_dudosos)
  ? datos.campos_dudosos.filter(
      campo => typeof campo === "string" && campo.trim()
    )
  : [];

// Validar fechas en formato AAAA-MM-DD.
const fecha = (campo) => {
  const valor = texto(campo);

  if (!valor) return null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    camposDudosos.push(campo);
    return null;
  }

  const objetoFecha = new Date(valor + "T00:00:00Z");

  if (
    Number.isNaN(objetoFecha.getTime()) ||
    objetoFecha.toISOString().slice(0, 10) !== valor
  ) {
    camposDudosos.push(campo);
    return null;
  }

  return valor;
};

const registroNoSQL = {
  version_esquema: 1,

  documento: {
    tipo_documento: texto("tipo_documento"),
    pais_emisor: texto("pais_emisor") ?? (texto("tipo_documento") === "DNI_NIF" ? "ESP" : null),
    numero_documento: texto("numero_documento"),
    numero_soporte: texto("numero_soporte"),
    nombre: texto("nombre"),
    apellidos: texto("apellidos"),
    fecha_nacimiento: fecha("fecha_nacimiento"),
    fecha_caducidad: fecha("fecha_caducidad"),
    nacionalidad: texto("nacionalidad")
  },

  evaluacion: {
    estado_nitidez: item.json.estadoNitidez ?? null,
    varianza: item.json.varianza ?? null,
    umbral: item.json.umbral ?? null,
    intento: item.json.intentos ?? null,
    campos_dudosos: [...new Set(camposDudosos)],
    verificado: false
  },

  metadatos: {
    fecha_procesamiento: new Date().toISOString(),
    origen: "n8n_local"
  }
};

return [{
  json: {
    ...item.json,
    registroNoSQL,
    jsonParaMostrar: JSON.stringify(registroNoSQL, null, 2)
  }
}];
