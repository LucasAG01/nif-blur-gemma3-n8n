# Frontend: modos alumno y técnico

- **Alumno** (predeterminado): seleccionar foto/archivo, análisis, resultado sencillo, formulario editable y botón **Confirmar mis datos**.
- **Técnico**: añade nitidez, campos extraídos y JSON de respuesta. Este selector es solo para desarrollo: **no existe autenticación ni autorización**. No se debe publicar como un panel técnico protegido.
- Confirmación solamente en memoria de React, sin persistencia ni envío. Modificar un campo invalida la confirmación.
- La llamada de análisis existente **sí** envía la imagen al webhook `/api/validar-documento-api`; dependiendo de su configuración, **n8n puede seguir escribiendo la extracción original en Firestore**.
- El flujo de revisión manual aún necesita integración con el sistema real de matrícula.

## Probar

```bash
npm ci
npm run lint
npm run build
npm run dev
```

Configuración y proxy Vite no modificados.
