
const item = $input.first();
const registro = item.json.registroNoSQL;
const documento = registro?.documento ?? {};

const camposObligatorios = [
  "numero_documento",
  "nombre",
  "apellidos"
];

const camposFaltantes = camposObligatorios.filter(
  campo => !documento[campo]
);

let estadoProceso;

if (!item.json.valida) {
  estadoProceso = "IMAGEN_BORROSA";
} else if (!registro) {
  estadoProceso = "ERROR_EXTRACCION";
} else if (camposFaltantes.length > 0) {
  estadoProceso = "EXTRACCION_INCOMPLETA";
} else {
  estadoProceso = "PENDIENTE_VERIFICACION";
}

return [{
  json: {
    ...item.json,
    estadoProceso,
    camposFaltantes,
    verificado: false,
    permitirGuardadoDefinitivo: false
  }
}];
