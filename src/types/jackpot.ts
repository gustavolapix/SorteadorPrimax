export type Person = {
  name: string;
  location: string;
  document: string;
};

export type DecelerationProfile = "exponential" | "logarithmic" | "linear" | "casino";

/**
 * Calcula el intervalo (en ms) entre nombres según el progreso t in [0, 1]
 * y el perfil de desaceleración seleccionado.
 */
export function calculateInterval(
  progress: number,
  profile: DecelerationProfile,
  minInterval = 40,
  maxInterval = 650,
): number {
  const clampedT = Math.max(0, Math.min(1, progress));

  let factor = 0;
  switch (profile) {
    case "exponential":
      // Progresión exponencial pronunciada (e^kx normalizada)
      factor = (Math.exp(3.8 * clampedT) - 1) / (Math.exp(3.8) - 1);
      break;

    case "logarithmic":
      // Progresión logarítmica (frena desde el inicio)
      factor = Math.log1p(9 * clampedT) / Math.log1p(9);
      break;

    case "linear":
      // Progresión lineal continua
      factor = clampedT;
      break;

    case "casino":
      // Curva tipo easeOutCubic con acentuación al cierre
      factor = 1 - Math.pow(1 - clampedT, 3);
      break;
  }

  return minInterval + (maxInterval - minInterval) * factor;
}
