const respuesta = $input.first().json.message?.content;

let documento;

try {
  documento = JSON.parse(respuesta);
} catch (error) {
  documento = {
    estado: "REVISION_MANUAL",
    tipo_documento: "INDETERMINADO",
    motivo: "No se pudo interpretar la respuesta de la IA",
  };
}

const tiposAdmitidos = [
  "DNI_NIF",
  "TIE_NIE",
  "CERTIFICADO_NIE",
  "DOCUMENTO_NIF",
];

const documentoReconocido =
  documento.estado === "APTA" &&
  tiposAdmitidos.includes(documento.tipo_documento);

return [
  {
    json: {
      ...documento,
      documentoReconocido,
    },
  },
];
