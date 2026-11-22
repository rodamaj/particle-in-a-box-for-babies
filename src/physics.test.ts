import {describe, it, expect} from 'vitest';
import {energyEV, wavefunction, density, probabilityBetween} from './physics';
describe('Caja infinita', () => {
  it('da 0.376030 eV para un electrón con n=1 y L=1 nm', () => {
    expect(energyEV(1, 1)).toBeCloseTo(0.376030162, 8);
  });
  it('escala como n² y como 1/L²', () => {
    expect(energyEV(3, 1) / energyEV(1, 1)).toBeCloseTo(9, 12);
    expect(energyEV(1, 2) / energyEV(1, 1)).toBeCloseTo(0.25, 12);
  });
  it('se anula en las paredes y fuera de ellas', () => {
    for (const x of [-1, 0, 2, 3]) expect(wavefunction(x, 4, 2)).toBe(0);
  });
  it('tiene n−1 nodos interiores y conserva el signo de psi', () => {
    for (let k = 1; k < 5; k++) expect(wavefunction(k * 2 / 5, 5, 2)).toBeCloseTo(0, 12);
    expect(wavefunction(0.75, 2, 1)).toBeLessThan(0);
    expect(density(0.75, 2, 1)).toBeGreaterThan(0);
  });
  it.each([1, 2, 5, 10])('normaliza la densidad y es ortogonal para n=%i', n => {
    for (const L of [0.2, 1, 5]) {
      let integral = 0, overlap = 0;
      const dx = L / 10000;
      for (let i = 0; i < 10000; i++) {
        const x = (i + 0.5) * dx;
        integral += density(x, n, L) * dx;
        overlap += wavefunction(x, n, L) * wavefunction(x, n + 1, L) * dx;
      }
      expect(integral).toBeCloseTo(1, 10);
      expect(overlap).toBeCloseTo(0, 10);
    }
  });
  it('rechaza parámetros no físicos', () => {
    for (const n of [0, -1, 1.5, NaN, Infinity]) expect(() => energyEV(n, 1)).toThrow(RangeError);
    for (const L of [0, -1, NaN, Infinity]) expect(() => wavefunction(0, 1, L)).toThrow(RangeError);
    expect(() => density(NaN, 1, 1)).toThrow(RangeError);
  });
});

describe('Probabilidad de un intervalo (integral analítica)', () => {
  it('da 0 para un intervalo vacío, 1 para la caja y 1/2 para media caja', () => {
    for (const n of [1, 2, 7, 10]) {
      expect(probabilityBetween(0.3, 0.3, n, 1)).toBe(0);
      expect(probabilityBetween(0, 1, n, 1)).toBeCloseTo(1, 14);
      expect(probabilityBetween(0, 0.5, n, 1)).toBeCloseTo(0.5, 14);
    }
  });
  it('concuerda con integrar numéricamente la densidad', () => {
    for (const n of [1, 3, 10]) for (const L of [0.2, 1, 5]) {
      const a = L * 0.13, b = L * 0.73, dx = (b - a) / 20000;
      let integral = 0;
      for (let i = 0; i < 20000; i++) integral += density(a + (i + 0.5) * dx, n, L) * dx;
      expect(probabilityBetween(a, b, n, L)).toBeCloseTo(integral, 7);
    }
  });
  it('suma intervalos adyacentes y conserva proporciones al cambiar L', () => {
    expect(probabilityBetween(0, 0.3, 2, 1) + probabilityBetween(0.3, 1, 2, 1)).toBeCloseTo(1, 13);
    expect(probabilityBetween(0.2, 0.7, 3, 1)).toBeCloseTo(probabilityBetween(1, 3.5, 3, 5), 13);
  });
  it('rechaza extremos y parámetros inválidos', () => {
    for (const [a, b] of [[-1, 1], [0, 2], [0.7, 0.3], [NaN, 1], [0, Infinity]]) expect(() => probabilityBetween(a, b, 1, 1)).toThrow(RangeError);
    expect(() => probabilityBetween(0, 1, 0, 1)).toThrow(RangeError);
  });
});
