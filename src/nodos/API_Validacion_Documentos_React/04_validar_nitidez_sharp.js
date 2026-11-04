
const sharp = require("sharp");

const item = $input.first();

// CONFIGURACIÓN
const TARGET_SIZE = 512;
const BLUR_THRESHOLD = 220;

// Comprobar que llega una imagen
if (!item.binary?.Imagen) {
  throw new Error("Sharp no recibió la imagen aprobada");
}

// Recuperar los bytes de la imagen actual
const buffer = await this.helpers.getBinaryDataBuffer(
  0,
  "Imagen"
);

// Obtener dimensiones originales
const metadata = await sharp(buffer).metadata();

// Normalizar a 512x512
const { data, info } = await sharp(buffer)
  .rotate()
  .resize(TARGET_SIZE, TARGET_SIZE, {
    fit: "fill",
    kernel: "cubic"
  })
  .toColourspace("srgb")
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Convertir a escala de grises
const gray = new Float32Array(
  TARGET_SIZE * TARGET_SIZE
);

for (let p = 0; p < gray.length; p++) {
  const i = p * info.channels;

  gray[p] =
    0.299 * data[i] +
    0.587 * data[i + 1] +
    0.114 * data[i + 2];
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

const variance = n
  ? sumSq / n - mean * mean
  : 0;

// Clasificar nitidez
const borrosa = variance < BLUR_THRESHOLD;

return [{
  json: {
    ...item.json,
    valida: !borrosa,
    estadoNitidez: borrosa ? "BORROSA" : "NITIDA",
    varianza: Number(variance.toFixed(2)),
    umbral: BLUR_THRESHOLD,
    dimensionesOriginales:
      `${metadata.width}x${metadata.height}`,
    dimensionesAnalisis: "512x512",
    motivoNitidez: borrosa
      ? "La imagen no supera el umbral de nitidez."
      : "La imagen supera el umbral de nitidez."
  },
  binary: item.binary
}];
