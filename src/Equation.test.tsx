import katex from 'katex';
import {expect, it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import Equation, {type EquationKind} from './Equation';
it.each<EquationKind>(['schrodinger', 'wave', 'energy', 'density', 'probability', 'boundary'])('renderiza la ecuación %s sin errores de KaTeX y con símbolos accesibles', kind => {
  const html = renderToStaticMarkup(<Equation kind={kind}/>);
  expect(html).not.toContain('katex-error');
  expect(html).toContain('class="katex"');
  expect(html).toContain('aria-label=');
  expect(html).toContain('aria-expanded="false"');
});

it('conserva las órdenes LaTeX de la derivada, psi y la integral', () => {
  const schrodinger = renderToStaticMarkup(<Equation kind="schrodinger"/>);
  const probability = renderToStaticMarkup(<Equation kind="probability"/>);
  for (const formula of [String.raw`\frac{d^2\psi}{dx^2}`, String.raw`\psi`]) {
    expect(schrodinger).toContain(katex.renderToString(formula, {output: 'html'}));
  }
  expect(probability).toContain(katex.renderToString(String.raw`\int_a^b`, {output: 'html'}));
});

it('mantiene cada variable al cuadrado en un único símbolo completo', () => {
  const html = renderToStaticMarkup(<Equation kind="energy"/>);
  expect(html).not.toContain('aria-label="Cuadrado"');
  for (const formula of ['n^2', 'L^2', String.raw`\hbar^2`, String.raw`\pi^2`]) {
    expect(html).toContain(katex.renderToString(formula, {output: 'html'}));
  }
});
