import {useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode} from 'react';
import katex from 'katex';

function MathText({value}: {value: string}) {
  return <span aria-hidden="true" dangerouslySetInnerHTML={{__html: katex.renderToString(value, {throwOnError: false, output: 'html'})}} />;
}

/** Every symbol is a native button: hover/focus explains; click/tap pins. */
function Symbol({value, label, children}: {value: string; label: string; children: ReactNode}) {
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({left: 0, top: 0});
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  function show() {
    document.dispatchEvent(new CustomEvent('equation-symbol-open', {detail: id}));
    setOpen(true);
  }
  useLayoutEffect(() => {
    if (!open || !root.current || !tip.current) return;
    const anchor = root.current.getBoundingClientRect();
    const width = tip.current.getBoundingClientRect().width;
    setPosition({left: Math.max(12, Math.min(anchor.left + anchor.width / 2 - width / 2, window.innerWidth - width - 12)), top: anchor.top - 10});
  }, [open]);
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) {setOpen(false); setPinned(false);}
    }
    function dismiss() {setOpen(false); setPinned(false);}
    function keyboard(event: KeyboardEvent) {if (event.key === 'Escape') dismiss();}
    function otherSymbol(event: Event) {if ((event as CustomEvent<string>).detail !== id) dismiss();}
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keyboard);
    document.addEventListener('equation-symbol-open', otherSymbol);
    window.addEventListener('resize', dismiss);
    window.addEventListener('scroll', dismiss, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', keyboard);
      document.removeEventListener('equation-symbol-open', otherSymbol);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('scroll', dismiss, true);
    };
  }, [open, id]);
  return <span className="math-symbol" ref={root}
    onMouseEnter={show} onMouseLeave={() => {if (!pinned) setOpen(false);}}>
    <button type="button" aria-label={label} aria-describedby={open ? id : undefined}
      aria-expanded={open} onFocus={show}
      onBlur={() => {setOpen(false); setPinned(false);}}
      onClick={() => {setPinned(!pinned); if (pinned) setOpen(false); else show();}}
      onKeyDown={e => {if (e.key === 'Escape') {setOpen(false); setPinned(false); e.stopPropagation();}}}>
      <MathText value={value}/>
    </button>
    {open && <span className="symbol-tooltip" role="tooltip" id={id} ref={tip} style={{left: position.left, top: position.top}}>{children}</span>}
  </span>;
}
const descriptions = {
  n: ['n', 'Número cuántico', 'Identifica el estado de energía: 1, 2, 3… Solo puede ser un entero positivo.'],
  L: ['L', 'Longitud de la caja', 'Es la distancia entre las dos paredes de la caja.'],
  x: ['x', 'Posición', 'Es la posición dentro de la caja, medida desde la pared izquierda.'],
  psi: ['\\psi_n', 'Función de onda', 'Describe el estado cuántico seleccionado. Su signo no es una probabilidad.'],
  rho: ['\\rho', 'Densidad de probabilidad', 'El área bajo esta curva en un intervalo da la probabilidad de encontrar allí la partícula.'],
  E: ['E_n', 'Energía del estado', 'Es la energía del electrón en el estado seleccionado. Aquí la expresamos en electronvoltios (eV).'],
  m: ['m_e', 'Masa del electrón', 'Es la masa del electrón. En este modelo permanece fija.'],
  hbar: ['\\hbar', 'Constante de Planck reducida', 'Es una constante de la naturaleza: la constante de Planck dividida entre 2π.'],
  pi: ['\\pi', 'Pi', 'Es la constante matemática pi, aproximadamente 3,1416.'],
  nSquared: ['n^2', 'Número cuántico al cuadrado', 'Es el número cuántico al cuadrado: n multiplicado por sí mismo. Por eso la energía crece como n².'],
  LSquared: ['L^2', 'Longitud al cuadrado', 'Es la longitud de la caja al cuadrado. Al estar en el denominador, una caja más grande tiene menor energía.'],
  hbarSquared: ['\\hbar^2', 'Constante de Planck reducida al cuadrado', 'Es la constante de Planck reducida al cuadrado: ℏ multiplicada por sí misma.'],
  piSquared: ['\\pi^2', 'Pi al cuadrado', 'Es la constante pi al cuadrado: π multiplicada por sí misma.'],
  sin: ['\\sin', 'Seno', 'Es la función matemática que dibuja esta onda.'],
  norm: ['\\sqrt{2/L}', 'Factor de normalización', 'Ajusta la altura de la onda para que la probabilidad total dentro de la caja sea 1.'],
} as const;
type Key = keyof typeof descriptions;
function S({name}: {name: Key}) {
  const [value, label, description] = descriptions[name];
  return <Symbol value={value} label={label}>{description}</Symbol>;
}
function Fraction({top, bottom}: {top: ReactNode; bottom: ReactNode}) {
  return <span className="fraction"><span>{top}</span><span>{bottom}</span></span>;
}
export type EquationKind = 'wave' | 'density' | 'energy' | 'schrodinger' | 'probability' | 'boundary';
export default function Equation({kind}: {kind: EquationKind}) {
  return <div className="equation-wrap">
    <div className="equation" role="group" aria-label={`Ecuación de ${kind === 'wave' ? 'la función de onda' : kind === 'density' ? 'la densidad de probabilidad' : kind === 'energy' ? 'la energía' : kind === 'schrodinger' ? 'Schrödinger, independiente del tiempo' : kind === 'boundary' ? 'las ondas que encajan en las paredes' : 'la probabilidad en un intervalo'}. Explorá sus símbolos.`}>
      {kind === 'boundary' ? <><Symbol value={String.raw`\sin(kL)=0`} label="La onda vale cero en la pared derecha">Para que el seno sea cero en la pared derecha, k por L debe ser un múltiplo entero de π.</Symbol><span>;</span><Symbol value={String.raw`kL=n\pi`} label="Condición de ondas permitidas">k describe cuántas oscilaciones caben por unidad de longitud. n es un entero positivo: n = 0 daría una onda nula, que no puede representar al electrón.</Symbol></>
      : kind === 'schrodinger' ? <><span>−</span><Fraction top={<><S name="hbarSquared"/></>} bottom={<>2<S name="m"/></>}/><Symbol value={String.raw`\frac{d^2\psi}{dx^2}`} label="Curvatura de la función de onda">Indica cómo se curva la función de onda al cambiar la posición. No necesitás resolver esta derivada para seguir la historia.</Symbol><span> + </span><Symbol value="V(x)" label="Energía potencial">Es la energía potencial en cada posición: cero dentro de nuestra caja e infinita fuera.</Symbol><Symbol value={String.raw`\psi`} label="Psi, función de onda">Describe el estado del electrón. Las soluciones que respetan las paredes nos dan los estados permitidos.</Symbol><span> = </span><Symbol value="E" label="Energía">Es la energía del estado que buscamos.</Symbol><Symbol value={String.raw`\psi`} label="Psi, función de onda">La misma función de onda aparece a ambos lados de la ecuación.</Symbol></>
      : kind === 'probability' ? <><Symbol value="P(a,b)" label="Probabilidad entre a y b">Es la probabilidad de encontrar el electrón entre las dos posiciones seleccionadas.</Symbol><span> = </span><Symbol value={String.raw`\int_a^b`} label="Integral desde a hasta b">Suma el área bajo la densidad desde a, el inicio del intervalo, hasta b, su final.</Symbol><S name="rho"/><span>(</span><S name="x"/><span>)</span><Symbol value="dx" label="Pequeño tramo de posición">La integral suma contribuciones de tramos cada vez más pequeños de la posición.</Symbol></>
      : kind === 'energy' ? <><S name="E"/><span>=</span><Fraction top={<><S name="nSquared"/><S name="piSquared"/><S name="hbarSquared"/></>} bottom={<>2<S name="m"/><S name="LSquared"/></>}/></>
      : kind === 'wave' ? <><S name="psi"/><span>(</span><S name="x"/><span>) = </span><S name="norm"/><S name="sin"/><span>(</span><Fraction top={<><S name="n"/><S name="pi"/><S name="x"/></>} bottom={<S name="L"/>}/><span>)</span></>
      : <><S name="rho"/><span>(</span><S name="x"/><span>) = </span><Symbol value={String.raw`|\psi_n(x)|^2`} label="Módulo de la función de onda al cuadrado">Es el módulo de la función de onda al cuadrado. Da una densidad de probabilidad que nunca es negativa.</Symbol></>}
    </div>
    <p className="equation-hint">Seleccioná un símbolo para ver su significado.</p>
  </div>;
}
