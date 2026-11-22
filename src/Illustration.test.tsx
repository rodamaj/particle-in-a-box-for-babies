import {it, expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import Illustration from './Illustration';
function frame(html: string) {
  return html.match(/<path d="(M[^\"]*V245[^\"]*)"/)?.[1];
}
it('conserva el marco al pasar de partícula a onda y a densidad con intervalo', () => {
  const particle = renderToStaticMarkup(<Illustration kind="particle" L={2.8} lengthLabel/>);
  const wave = renderToStaticMarkup(<Illustration kind="wave" L={2.8} n={3} lengthLabel potential quantitative/>);
  const density = renderToStaticMarkup(<Illustration kind="density" L={2.8} n={3} lengthLabel potential quantitative interval={[0.3, 1.4]}/>);
  expect(frame(particle)).toBeDefined();
  expect(frame(wave)).toBe(frame(particle));
  expect(frame(density)).toBe(frame(particle));
  for (const html of [particle, wave, density]) {
    expect(html).toContain('x = 0 nm');
    expect(html).toContain('x = L = 2,8 nm');
  }
});
it('actualiza el extremo derecho y su etiqueta cuando cambia L', () => {
  const small = renderToStaticMarkup(<Illustration kind="density" L={0.2} lengthLabel/>);
  const big = renderToStaticMarkup(<Illustration kind="density" L={5} lengthLabel/>);
  expect(frame(small)).not.toBe(frame(big));
  expect(small).toContain('x = L = 0,2 nm');
  expect(big).toContain('x = L = 5 nm');
});
