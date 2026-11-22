import {useRef, useState} from 'react';
import Equation from './Equation';
import Illustration from './Illustration';
import {type View} from './StateChart';
import ProbabilityControl, {type Interval} from './ProbabilityControl';
import References from './References';
import {energyEV} from './physics';
const chapters = [
  {title: 'Empecemos con una bolita', text: 'Imaginá una bolita entre dos paredes. Para estudiar solo su movimiento, podemos dejar de lado su forma y tratarla como una partícula.'},
  {title: 'La caja tiene un tamaño', text: 'Nuestra partícula solo puede moverse hacia la izquierda o la derecha. La distancia entre las paredes es la longitud de la caja: la llamamos L.'},
  {title: 'Las paredes son una barrera de energía', text: 'La energía potencial es la energía asociada al lugar donde está la partícula. En nuestra caja ideal vale cero adentro e infinito afuera.'},
  {title: 'Ahora, imaginá un electrón', text: 'Un electrón es una partícula diminuta. No se comporta como nuestra bolita: para describirlo usamos las reglas de la mecánica cuántica.'},
  {title: 'La respuesta tiene forma de onda', text: 'Al resolver la ecuación de Schrödinger dentro de la caja, obtenemos funciones de onda. La letra ψ, que se lee «psi», representa una de ellas.'},
  {title: 'Pero la onda debe encajar', text: 'Las paredes obligan a que la onda valga cero en ambos extremos. Solo algunas soluciones de Schrödinger cumplen esa condición: las identificamos con n = 1, 2, 3…'},
  {title: 'Cada estado tiene su energía', text: 'Schrödinger relaciona cada onda permitida con una energía. Como las ondas permitidas tienen números n enteros, sus energías también forman un conjunto separado de valores.'},
  {title: '¿Dónde encontraremos el electrón?', text: 'La onda nos permite calcular una distribución de probabilidad. Su densidad indica cómo se reparte la posibilidad de encontrar el electrón a lo largo de la caja.'},
  {title: 'Un área se convierte en probabilidad', text: 'Para saber la probabilidad de encontrar el electrón entre dos lugares, sumamos el área bajo la densidad en ese intervalo. Esa suma se llama integral.'},
  {title: 'Ahora sí, experimentá', text: 'Ya conocés la historia: Schrödinger, las paredes, las ondas permitidas y sus probabilidades. Cambiá n o L y explorá al electrón en su caja.'},
];
const fmt = (v: number) => v.toLocaleString('es', {maximumFractionDigits: 4});
function ViewSwitch({view, onChange}: {view: View; onChange: (v: View) => void}) {
  return <div className="view-switch" role="group" aria-label="Qué curva mostrar"><button aria-pressed={view === 'wave'} onClick={() => onChange('wave')}>Función de onda</button><button aria-pressed={view === 'density'} onClick={() => onChange('density')}>Distribución de probabilidad</button></div>;
}
function LengthControl({L, onChange}: {L: number; onChange: (L: number) => void}) {
  return <div className="control"><label htmlFor="length">Longitud <i>L</i><output htmlFor="length">{fmt(L)} nm</output></label><input id="length" type="range" min="0.2" max="5" step="0.1" value={L} onChange={e => onChange(Number(e.target.value))}/><div className="range-ends"><span>0,2 nm</span><span>5 nm</span></div></div>;
}
function StateControl({n, onChange}: {n: number; onChange: (n: number) => void}) {
  return <div className="control"><label htmlFor="state">Estado <i>n</i><output htmlFor="state">{n}</output></label><input id="state" type="range" min="1" max="10" step="1" value={n} onChange={e => onChange(Number(e.target.value))}/><div className="range-ends"><span>1</span><span>10</span></div></div>;
}
export default function App() {
  const [page, setPage] = useState(0);
  const [n, setN] = useState(1);
  const [L, setL] = useState(1);
  const [view, setView] = useState<View>('wave');
  const [interval, setInterval] = useState<Interval>([0, 50]);
  const heading = useRef<HTMLHeadingElement>(null);
  const chapter = chapters[page];
  function go(next: number) {
    setPage(next);
    if (next === 8) setView('density');
    // Keep L, n, view and interval throughout the story, including back navigation.
    requestAnimationFrame(() => {
      heading.current?.focus({preventScroll: true});
      window.scrollTo(0, 0);
    });
  }
  return <div className="book"><header className="book-header"><p className="book-name">Partícula en caja infinita<span>… for babies.</span></p><span className="course">PF3129</span></header>
    <main className={`page page-${page + 1} has-illustration`}>
      <div className="chapter-copy"><p className="page-count">Un pequeño libro interactivo <span aria-hidden="true">·</span> {page + 1} de {chapters.length}</p><h1 ref={heading} tabIndex={-1}>{chapter.title}</h1><p className="explanation">{chapter.text}</p></div>
      <section className="scene" aria-label="Explorá esta idea">
        <Illustration kind={page < 4 ? 'particle' : page >= 7 && view === 'density' ? 'density' : 'wave'} L={L} n={n} lengthLabel={page >= 1} ball={page === 0} electron={page >= 3} potential={page >= 2} quantitative={page >= 7} interval={page >= 8 && view === 'density' ? [interval[0] / 100 * L, interval[1] / 100 * L] : undefined}/>
        {page === 0 && <><p className="one-idea">La bolita es nuestro punto de partida, una forma fácil de imaginar una partícula.</p></>}
        {page === 1 && <><div className="single-control length-intro"><LengthControl L={L} onChange={setL}/></div><p className="one-idea">La pared izquierda está en x = 0. La derecha, en x = L.</p><details className="energy-details"><summary>Un poco más: la escala del dibujo</summary><p>Un nanómetro (nm) es una milmillonésima de metro. El dibujo es esquemático: ensanchamos la caja al aumentar L; las etiquetas x indican la posición real en nm. La escala vertical de las curvas se adapta para que puedan leerse, sin mover las paredes ni la línea de cero.</p></details></>}
        {page === 2 && <><p className="one-idea">Con energía finita, la partícula no puede entrar en una región de potencial infinito. Por eso no sale.</p><details className="energy-details"><summary>Un poco más: potencial y energía</summary><p>Elegimos el potencial cero dentro como referencia. Eso no significa que la energía total sea cero: el electrón también tiene energía cinética.</p></details></>}
        {page === 3 && <><p className="one-idea">La ecuación de Schrödinger es esa regla: relaciona el potencial, el estado y su energía.</p><Equation kind="schrodinger"/><p className="quiet-note">Esta es la versión para estados de energía definida. No necesitás resolverla: vamos a mirar sus respuestas.</p></>}
        {page === 4 && <><p className="one-idea">Esta fórmula se deriva de la ecuación de Schrödinger del paso anterior, al resolverla con las paredes de nuestra caja.</p><Equation kind="wave"/><details className="energy-details"><summary>Un poco más: de dónde sale esta forma</summary><p>Dentro, el potencial es cero. Schrödinger admite senos y cosenos; exigir que la onda sea cero en la pared izquierda elimina el coseno. La pared derecha selecciona los valores de n.</p><p>El factor √(2/L) ajusta la onda para que la probabilidad total sea 1. La onda describe un estado, no una trayectoria.</p></details></>}
        {page === 5 && <><div className="single-control"><StateControl n={n} onChange={setN}/></div><p className="one-idea" aria-live="polite">{n} {n === 1 ? 'media onda encaja' : 'medias ondas encajan'} entre las paredes. Probá otro número entero.</p><details className="energy-details"><summary>Un poco más: ¿de dónde sale n?</summary><p>La solución tiene la forma de un seno. Para valer cero también en x = L, su argumento allí debe ser π, 2π, 3π…</p><Equation kind="boundary"/><p>De ahí salen n = 1, 2, 3…: cada entero cuenta las medias ondas que encajan. n = 0 daría una onda cero en todas partes; no describiría una partícula.</p></details></>}
        {page === 6 && <><div className="single-control energy-state"><StateControl n={n} onChange={setN}/></div><div className="energy-story" aria-live="polite"><span>Electrón en nuestra caja de L = {fmt(L)} nm</span><strong>{fmt(energyEV(n, L))} <small>eV</small></strong><p>{n === 1 ? 'Esta es la menor energía permitida.' : `Es ${n * n} veces la energía del estado 1.`}</p></div><Equation kind="energy"/><p className="one-idea">Esta fórmula sale de sustituir las ondas que encajan en Schrödinger. No podemos elegir cualquier energía: está cuantizada.</p><p className="quiet-note">eV significa electronvoltio, una unidad de energía. Un nanómetro (nm) es una milmillonésima de metro.</p></>}
        {page === 7 && <><ViewSwitch view={view} onChange={setView}/><p className="one-idea" aria-live="polite">{view === 'wave' ? 'Esta es la onda del estado seleccionado. Su signo puede ser positivo o negativo.' : 'Esta es su densidad: nunca es negativa. Más altura significa más probabilidad por unidad de longitud.'}</p><Equation kind="density"/><p className="quiet-note">Se calcula tomando el módulo de ψ y elevándolo al cuadrado. La altura de la densidad no es un porcentaje.</p></>}
        {page === 8 && <><ProbabilityControl n={n} L={L} interval={interval} onChange={setInterval}/><Equation kind="probability"/><p className="one-idea">Mové los extremos: el área verde más oscura es la probabilidad del intervalo. Toda la caja suma 100 %.</p><p className="quiet-note">Seguimos con n = {n} y L = {fmt(L)} nm, los valores de nuestra caja.</p></>}
        {page === 9 && <><div className="experiment-controls"><StateControl n={n} onChange={setN}/><LengthControl L={L} onChange={setL}/><div className="energy-readout" aria-live="polite"><span>Energía</span><strong>{fmt(energyEV(n, L))} <small>eV</small></strong></div></div><ViewSwitch view={view} onChange={setView}/>{view === 'density' && <ProbabilityControl n={n} L={L} interval={interval} onChange={setInterval}/>}<p className="one-idea">{view === 'wave' ? 'La onda sigue siendo cero en ambas paredes.' : 'El intervalo conserva su proporción de la caja al cambiar L. El área total sigue siendo 100 %.'}</p><details className="energy-details"><summary>Recordar las ecuaciones</summary><Equation kind={view}/><Equation kind="energy"/>{view === 'density' && <Equation kind="probability"/>}<p>Más n aumenta la energía. Más L la reduce. Las ecuaciones de la onda y la energía se obtienen de Schrödinger con estas paredes; la probabilidad se obtiene de la onda.</p></details></>}
      </section>
      <nav className="page-navigation" aria-label="Páginas del libro"><button className="previous" disabled={page === 0} onClick={() => go(page - 1)}>Anterior</button><span className="navigation-count" aria-label={`Página ${page + 1} de ${chapters.length}`}>{page + 1} / {chapters.length}</span>{page < chapters.length - 1 ? <button className="next" onClick={() => go(page + 1)}>Siguiente</button> : <button className="next" onClick={() => go(0)}>Volver al inicio</button>}</nav>
    </main><footer className="book-footer"><p>Una idea a la vez.</p><References/></footer>
  </div>;
}
