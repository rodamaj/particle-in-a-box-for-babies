/** Caja 1D no relativista: V = 0 dentro, infinito fuera.
 * API espacial en nm; psi en nm^(-1/2), densidad en nm^(-1).
 * La energía convierte L a metros y devuelve eV. Constantes CODATA 2022 (NIST).
 */
export const PLANCK = 6.62607015e-34;
export const ELECTRON_MASS = 9.1093837139e-31;
export const ELECTRON_VOLT = 1.602176634e-19;
function validate(n: number, lengthNm: number) {
  if (!Number.isSafeInteger(n) || n < 1) throw new RangeError('n debe ser un entero positivo.');
  if (!Number.isFinite(lengthNm) || lengthNm <= 0) throw new RangeError('L debe ser positiva y finita.');
}
export function energyEV(n: number, lengthNm: number): number {
  validate(n, lengthNm);
  return n ** 2 * PLANCK ** 2 / (8 * ELECTRON_MASS * (lengthNm * 1e-9) ** 2) / ELECTRON_VOLT;
}
export function wavefunction(xNm: number, n: number, lengthNm: number): number {
  validate(n, lengthNm);
  if (!Number.isFinite(xNm)) throw new RangeError('x debe ser finita.');
  if (xNm <= 0 || xNm >= lengthNm) return 0;
  return Math.sqrt(2 / lengthNm) * Math.sin(n * Math.PI * xNm / lengthNm);
}
export function density(xNm: number, n: number, lengthNm: number): number {
  return wavefunction(xNm, n, lengthNm) ** 2;
}
export function sampleState(n: number, lengthNm: number) {
  validate(n, lengthNm);
  return Array.from({length: 601}, (_, i) => {
    const x = i / 600 * lengthNm;
    const psi = wavefunction(x, n, lengthNm);
    return {x, psi, density: psi ** 2};
  });
}

/** Exact integral of density over [a,b], all lengths in nm. */
export function probabilityBetween(a: number, b: number, n: number, lengthNm: number): number {
  validate(n, lengthNm);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b > lengthNm || a > b) {
    throw new RangeError('El intervalo debe cumplir 0 ≤ a ≤ b ≤ L.');
  }
  const u = a / lengthNm, v = b / lengthNm;
  const probability = v - u - (Math.sin(2 * n * Math.PI * v) - Math.sin(2 * n * Math.PI * u)) / (2 * n * Math.PI);
  return Math.min(1, Math.max(0, probability));
}
