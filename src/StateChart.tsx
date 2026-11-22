import {useMemo} from 'react';
import {Area, ComposedChart, Line, ReferenceLine, XAxis, YAxis} from 'recharts';
import {sampleState, wavefunction} from './physics';
export type View = 'wave' | 'density';
/** Draw only the curve. Illustration owns the one shared box and coordinate frame. */
export default function StateChart({n, L, view, width, interval}: {
  n: number; L: number; view: View; width: number; interval?: [number, number];
}) {
  const a = interval?.[0], b = interval?.[1];
  const data = useMemo(() => {
    const samples = sampleState(n, L);
    if (a === undefined || b === undefined) return samples;
    for (const x of [a, b]) {
      if (!samples.some(point => point.x === x)) {
        const psi = wavefunction(x, n, L);
        samples.push({x, psi, density: psi ** 2});
      }
    }
    return samples.sort((p, q) => p.x - q.x).map(point => ({...point,
      selected: point.x >= a && point.x <= b ? point.density : null,
    }));
  }, [n, L, a, b]);
  const isWave = view === 'wave';
  const peak = isWave ? Math.sqrt(2 / L) : 2 / L;
  // Recharts clips to the axis domain, so margins alone cannot protect the stroke.
  // Keep both extrema inside that domain, symmetrically around the shared zero.
  return <ComposedChart width={width} height={150} data={data} margin={{top:0, right:0, bottom:0, left:0}} accessibilityLayer={false}>
    <XAxis hide dataKey="x" type="number" domain={[0,L]} padding={{left:0, right:0}}/>
    <YAxis hide type="number" domain={[-peak * 1.12, peak * 1.12]} allowDataOverflow/>
    <ReferenceLine y={0} stroke="#b0bec7" strokeWidth={1.5}/>
    {isWave ? <Line dataKey="psi" stroke="var(--wave)" strokeWidth={3} dot={false} isAnimationActive={false}/>
      : <Area dataKey="density" stroke="var(--density)" fill="var(--density)" fillOpacity={interval ? 0.05 : 0.14} strokeWidth={3} isAnimationActive={false}/>}
    {!isWave && interval && <>
      <Area dataKey="selected" tooltipType="none" stroke="none" fill="var(--density)" fillOpacity={0.35} isAnimationActive={false}/>
      <ReferenceLine x={a} stroke="var(--density)" strokeDasharray="4 4"/><ReferenceLine x={b} stroke="var(--density)" strokeDasharray="4 4"/>
    </>}
  </ComposedChart>;
}
