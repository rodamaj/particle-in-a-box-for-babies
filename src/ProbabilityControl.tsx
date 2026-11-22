import {probabilityBetween} from './physics';
export type Interval = [number, number];
const fmt = (v: number) => v.toLocaleString('es', {maximumFractionDigits: 3});
/** Store percentages of L so changing the box never invalidates the interval. */
export default function ProbabilityControl({n, L, interval, onChange}: {
  n: number; L: number; interval: Interval; onChange: (v: Interval) => void;
}) {
  const [a, b] = interval;
  const probability = probabilityBetween(a / 100 * L, b / 100 * L, n, L);
  return <div className="probability-control"><div className="interval-sliders">
    <div className="control"><label htmlFor="start">Desde <i>a</i><output htmlFor="start">{fmt(a / 100 * L)} nm</output></label><input id="start" aria-label="Inicio del intervalo a" type="range" min="0" max="100" step="1" value={a} onChange={e => onChange([Math.min(Number(e.target.value), b), b])}/></div>
    <div className="control"><label htmlFor="end">Hasta <i>b</i><output htmlFor="end">{fmt(b / 100 * L)} nm</output></label><input id="end" aria-label="Fin del intervalo b" type="range" min="0" max="100" step="1" value={b} onChange={e => onChange([a, Math.max(a, Number(e.target.value))])}/></div>
  </div><p className="probability-result" aria-live="polite"><strong>{(probability * 100).toLocaleString('es', {minimumFractionDigits: 1, maximumFractionDigits: 1})} %</strong><span>de probabilidad de encontrar el electrón entre a y b.</span></p></div>;
}
