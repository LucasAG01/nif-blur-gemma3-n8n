const sharp = require("sharp");

// CONFIGURACIÓN
const TARGET_SIZE = 512;
const BLUR_THRESHOLD = 220;

// Recuperar imagen original desde el nodo Base64
const imagenBase64 = $("03 - Preparar imagen Base65").first().json.imagenBase64;

if (!imagenBase64) {
  throw new Error("No se recibió ninguna imagen");
}

// Convertir Base64 a Buffer
const base64 = imagenBase64.replace(/^data:image\/[^;]+;base64,/, "");

const buffer = Buffer.from(base64, "base64");

// Obtener dimensiones originales
const metadata = await sharp(buffer).metadata();

// Normalizar imagen a 512x512
const { data, info } = await sharp(buffer)
  .rotate()
  .resize(TARGET_SIZE, TARGET_SIZE, {
    fit: "fill",
    kernel: "cubic",
  })
  .toColourspace("srgb")
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Convertir a escala de grises
const gray = new Float32Array(TARGET_SIZE * TARGET_SIZE);

for (let p = 0; p < gray.length; p++) {
  const i = p * info.channels;

  gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
}

// Calcular varianza del Laplaciano
let sum = 0;
let sumSq = 0;
let n = 0;

for (let y = 1; y < TARGET_SIZE - 1; y++) {
  const row = y * TARGET_SIZE;

  for (let x = 1; x < TARGET_SIZE - 1; x++) {
    const i = row + x;

    const v =
      4 * gray[i] -
      gray[i - 1] -
      gray[i + 1] -
      gray[i - TARGET_SIZE] -
      gray[i + TARGET_SIZE];

    sum += v;
    sumSq += v * v;
    n++;
  }
}

const mean = n ? sum / n : 0;

const variance = n ? sumSq / n - mean * mean : 0;

// Clasificación
const borrosa = variance < BLUR_THRESHOLD;

return [
  {
    json: {
      valida: !borrosa,
      estado: borrosa ? "BORROSA" : "NITIDA",
      varianza: Number(variance.toFixed(2)),
      umbral: BLUR_THRESHOLD,
      dimensionesOriginales: `${metadata.width}x${metadata.height}`,
      dimensionesAnalisis: "512x512",
      motivo: borrosa
        ? "La imagen no supera el umbral de nitidez."
        : "La imagen supera el umbral de nitidez.",
    },
  },
];
