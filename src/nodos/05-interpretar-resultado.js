// Nodo 05 - Interpretar resultado de Gemma
// Entrada: respuesta de POST /api/chat de Ollama en message.content.
// Salida: estado, desenfoque y motivo para la pantalla final.
const respuesta = $input.first().json.message?.content;
if (!respuesta) {
  throw new Error('Gemma no devolvió una respuesta');
}

let analisis;
try {
  analisis = JSON.parse(respuesta);
} catch (error) {
  analisis = {
    estado: 'REVISION_MANUAL',
    desenfoque: 'DESCONOCIDO',
    motivo: 'No se pudo interpretar la respuesta de Gemma'
  };
}

const estados = ['APTA', 'NO_APTA', 'REVISION_MANUAL'];
const niveles = ['BAJO', 'MEDIO', 'ALTO'];
let estado = estados.includes(analisis?.estado)
  ? analisis.estado
  : 'REVISION_MANUAL';
const desenfoque = niveles.includes(analisis?.desenfoque)
  ? analisis.desenfoque
  : 'DESCONOCIDO';

// No aprobar cuando la clasificación de blur sea contradictoria o incierta.
if (estado === 'APTA' && desenfoque !== 'BAJO') {
  estado = 'REVISION_MANUAL';
}

return [{
  json: {
    estado,
    desenfoque,
    motivo: typeof analisis?.motivo === 'string'
      ? analisis.motivo
      : 'Se necesita revisar la imagen'
  }
}];
