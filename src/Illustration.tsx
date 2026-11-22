import {useId} from 'react';
import StateChart from './StateChart';

type Props = {
  kind: 'particle' | 'wave' | 'density';
  interval?: [number, number];
  quantitative?: boolean;
  n?: number;
  L?: number;
  lengthLabel?: boolean;
  ball?: boolean;
  electron?: boolean;
  potential?: boolean;
};
/** One shared schematic: walls, floor and length marker never change by chapter.
 * Width is a schematic mapping of L; the x positions and curve values use physical units.
 */
export default function Illustration({kind, n = 1, L = 1, lengthLabel = false, ball = false, electron = false, potential = false, interval, quantitative = false}: Props) {
  const hatchId = useId();
  const width = 200 + L * 68;
  const left = 360 - width / 2, right = 360 + width / 2;
  const peak = kind === 'density' ? 2 / L : Math.sqrt(2 / L);
  const fmt = (v: number) => v.toLocaleString('es', {maximumFractionDigits:3});
  const title = `${kind === 'density' ? `Densidad de probabilidad del estado n = ${n}` : kind === 'wave' ? `Onda del estado n = ${n}` : ball ? 'Una bolita' : electron ? 'Un electrón' : 'Una partícula'} en la misma caja${lengthLabel ? ` de longitud ${L.toLocaleString('es')} nm` : ''}${potential ? ', con potencial infinito fuera' : ''}`;
  return <svg className="illustration" viewBox="0 0 720 320" role="img" aria-label={title}>
    <defs><pattern id={hatchId} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line y2="9" stroke="#c9d4da" strokeWidth="2"/></pattern></defs>
    <rect x={left - 28} y="60" width="28" height="185" rx="4" fill={`url(#${hatchId})`}/>
    <rect x={right} y="60" width="28" height="185" rx="4" fill={`url(#${hatchId})`}/>
    <path d={`M${left} 60 V245 H${right} V60`} fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"/>
    {potential && <>
      <text x={left - 38} y="42" textAnchor="middle" className="infinity">∞</text><text x={right + 38} y="42" textAnchor="middle" className="infinity">∞</text>
      <text x="360" y="54" textAnchor="middle" className="drawing-small">potencial cero adentro</text>
    </>}
    {kind === 'particle' ? <>
      <circle cx="360" cy="155" r={electron ? 8 : 22} fill={electron ? 'var(--wave)' : '#f77f00'}/>
      {!electron && <circle cx="354" cy="148" r="5" fill="#fff" opacity=".4"/>}
      <text x="360" y="212" textAnchor="middle" className="drawing-small">{ball ? 'una bolita' : electron ? 'un electrón' : 'una partícula'}</text>
    </> : <>
      <foreignObject x={left} y="80" width={width} height="150" className="box-curve">
        <StateChart n={n} L={L} view={kind} width={width} interval={interval}/>
      </foreignObject>
      <circle cx={left} cy="155" r="4" fill={kind === 'density' ? 'var(--density)' : 'var(--wave)'}/><circle cx={right} cy="155" r="4" fill={kind === 'density' ? 'var(--density)' : 'var(--wave)'}/>
      {quantitative && <>
        <text x="360" y="18" textAnchor="middle" className="drawing-small">{kind === 'density' ? 'Densidad |ψ|² (nm⁻¹)' : 'Función de onda ψ (nm⁻¹ᐟ²)'}</text>
        <text x={left - 12} y="87" textAnchor="end" className="axis-value">{fmt(peak)}</text>
        <text x={left - 12} y="161" textAnchor="end" className="axis-value">0</text>
        {kind === 'wave' && <text x={left - 12} y="234" textAnchor="end" className="axis-value">{fmt(-peak)}</text>}
      </>}
    </>}
    {lengthLabel ? <>
      <text x={left} y="263" textAnchor="start" className="position-value">x = 0 nm</text>
      <text x={right} y="263" textAnchor="end" className="position-value">x = L = {fmt(L)} nm</text>
      <path d={`M${left} 274 H${right} M${left} 268 V280 M${right} 268 V280`} stroke="#8499a6" strokeWidth="1.5"/>
      <text x="360" y="307" textAnchor="middle" className="drawing-small">L = {L.toLocaleString('es', {maximumFractionDigits:1})} nm</text>
    </> : <text x="360" y="290" textAnchor="middle" className="drawing-small">la caja</text>}
  </svg>;
}
