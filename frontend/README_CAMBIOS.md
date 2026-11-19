# Cambios de la demo de matrícula

- Dos botones: **Hacer foto** (usa `capture="environment"` cuando el navegador lo admite) y **Subir archivo**.
- Se conservan vista previa, control de JPG/PNG y límite de 8 MiB.
- Tras `PENDIENTE_VERIFICACION`, los datos se muestran en un formulario editable.
- No se envían ni almacenan todavía las correcciones. El workflow actual puede guardar en Firestore los datos OCR originales antes de la confirmación: NO usar este flujo como matrícula definitiva.
- La URL API actual es `/api/validar-documento-api`; proxy Vite la redirige a `/webhook/validar-documento-api` en localhost:5678. Ajustar cuando se conozca el endpoint de producción del centro.
- Para arrancar: `npm ci && npm run dev` (dentro de `frontend/`).
- Para desplegar y verificar: `npm run lint && npm run build`.
- Los datos reales requieren control de acceso y política de conservación, y una operación de confirmación explícita antes del guardado definitivo.
