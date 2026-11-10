const item = $input.first();
const registro = item.json.registroNoSQL;

const documento = registro?.documento ?? {};

// Campos necesarios para el registro.
const camposObligatorios = [
  "numero_documento",
  "nombre",
  "apellidos"
];

const camposFaltantes = camposObligatorios.filter(
  campo =>
    typeof documento[campo] !== "string" ||
    !documento[campo].trim()
);

// Campos que requieren revisión humana.
const camposDudosos = Array.isArray(
  registro?.evaluacion?.campos_dudosos
)
  ? registro.evaluacion.campos_dudosos
  : [];

// Comparar el tipo reconocido al principio
// con el extraído después.
const tipoInicial = item.json.tipo_documento ?? null;
const tipoExtraido = documento.tipo_documento ?? null;

const tiposSinDeterminar = [
  "OTRO",
  "INDETERMINADO"
];

const tipoInconsistente =
  tipoInicial !== null &&
  tipoExtraido !== null &&
  !tiposSinDeterminar.includes(tipoInicial) &&
  !tiposSinDeterminar.includes(tipoExtraido) &&
  tipoInicial !== tipoExtraido;

let estadoProceso;

if (item.json.valida !== true) {
  estadoProceso = "IMAGEN_BORROSA";

} else if (!registro || item.json.errorExtraccion) {
  estadoProceso = "ERROR_EXTRACCION";

} else if (camposFaltantes.length > 0) {
  estadoProceso = "EXTRACCION_INCOMPLETA";

} else if (
  camposDudosos.length > 0 ||
  tipoInconsistente
) {
  estadoProceso = "REVISION_MANUAL";

} else {
  estadoProceso = "PENDIENTE_VERIFICACION";
}

return [{
  json: {
    ...item.json,
    estadoProceso,
    camposFaltantes,
    camposDudosos,
    tipoInconsistente,
    verificado: false,
    permitirGuardadoDefinitivo: false
  }
}];
