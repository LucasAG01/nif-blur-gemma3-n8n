# Pendientes y limitaciones del flujo (sin modificar el export)

Esta entrega refleja el estado actual compartido, **no una revisión corregida** del workflow.

- El reconocimiento/lectura de Gemma **puede intercambiar el nombre y los apellidos** en un DNI de muestra. La calidad de extracción no está verificada y NO significa autenticidad del documento.
- El umbral de nitidez de Sharp (`220`) es orientativo y no prueba la legibilidad de todos los campos.
- La pantalla de desenfoque finaliza la ejecución: **aún no utiliza el mismo contador de tres reintentos** que el reconocimiento de documento.
- La creación del objeto `registroNoSQL` es solo preparación de datos; **no hay ninguna escritura a Firebase/Firestore**.
- En `If1` aparecen dos condiciones unidas mediante `OR` (`documentoReconocido` o `intentos >= 3`); comprobar si responde a la lógica prevista. El tercer intento se gestiona en `If3`.
- El nodo `03 - Preparar imagen Base66` conserva una referencia al nodo de comprobación y una llamada a `getBinaryDataBuffer` con un tercer argumento. Revisarlo cuando se refactorice; esta entrega copia su versión exacta.
- Las fechas devueltas por IA pueden no respetar siempre ISO `YYYY-MM-DD`; hacen falta validadores de formato y de coherencia independientes.
- No guardar DNI/NIE reales o imágenes originales en un repositorio público. Antes de guardar en Firestore, definir consentimiento o base jurídica, permisos, retención, revisión humana y cifrado cuando corresponda.
- Reasignar la credencial de Ollama tras importar el JSON público. Comprobar el nombre de la propiedad binaria `Imagen`, los nodos Code y el modelo local `gemma3:4b`.
- Las notas adhesivas incluidas en el workflow pertenecen al propio flujo operativo. No se eliminaron para conservar el material entregado.
