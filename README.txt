PARTÍCULA EN CAJA INFINITA… FOR BABIES
Libro interactivo educativo en diez pasos para el trabajo final PF3129.

REQUISITOS Y EJECUCIÓN
Node.js 22.12+ (o 20.19+), npm.
  npm ci
  npm run dev
Abrir la dirección local indicada por Vite.
  npm test         Pruebas del motor físico.
  npm run build    TypeScript y compilación estática en dist/.
  npm run preview  Previsualización local del resultado compilado.
No hay backend, base de datos, claves ni servicios externos de ejecución.
Las dependencias y fuentes KaTeX se empaquetan localmente al compilar.

ESTRUCTURA
src/physics.ts       Motor puro, independiente de React.
src/physics.test.ts  Pruebas de energía, escala, fronteras, nodos,
                     normalización numérica, ortogonalidad y validación.
src/App.tsx          Recorrido de diez páginas y controles progresivos.
src/Illustration.tsx Ilustraciones SVG simples, usando el motor existente.
src/StateChart.tsx   Curvas Recharts dentro de la caja compartida.
src/Equation.tsx     Símbolos KaTeX con explicaciones accesibles.
src/ProbabilityControl.tsx  Intervalo a/b y porcentaje.
src/References.tsx   Enlaces de las fuentes y fecha de consulta.
src/style.css        Diseño adaptable y estilos.
src/main.tsx         Entrada React.

MODELO FÍSICO Y UNIDADES
Electrón en un pozo de potencial infinito 1D entre x=0 y x=L.
V=0 dentro y V=infinito fuera. Modelo no relativista, sin espín.
n es entero entre 1 y 10; L se controla entre 0.2 y 5 nm.
E_n = n² h² / (8 m_e L²).
psi_n(x) = sqrt(2/L) sin(n pi x/L), dentro; cero en paredes y fuera.
rho(x) = |psi_n(x)|²; integral de rho entre 0 y L = 1.
La API espacial usa nm: psi está en nm^(-1/2) y rho en nm^(-1).
Para calcular energía se convierte L a metros y joules a eV.
h = 6.62607015e-34 J s (exacta).
m_e = 9.1093837139e-31 kg.
1 eV = 1.602176634e-19 J (exacta).
Fuente: NIST, CODATA 2022: https://physics.nist.gov/cuu/Constants/
Referencia independiente: E_1 para L=1 nm es aproximadamente 0.376030 eV.

INTERPRETACIÓN
Se muestra la parte espacial real de estados estacionarios, no trayectorias.
El signo de psi no es una probabilidad negativa. La densidad es no negativa;
la probabilidad de un intervalo es su integral, no la altura de la curva.
La fase temporal global no cambia la densidad. No se simulan superposiciones
ni mediciones.
Las curvas usan 601 muestras e incluyen ambas paredes; los cálculos son
analíticos. El área total no se estima a partir del dibujo en la interfaz.

PUBLICACIÓN FUTURA
El resultado dist/ se puede alojar en un servicio de archivos estáticos.
Para quantum.rodamaj.com: compilar, configurar alojamiento y dominio con
HTTPS. Este MVP no publica ni modifica DNS. No incluye CNAME todavía.
Vite usa base /, apropiada para la raíz de un subdominio. Si se publica en
una subcarpeta, configurar base antes de compilar.
Para adjuntar el código al trabajo, excluir node_modules/ y dist/;
incluir package-lock.json para instalaciones reproducibles.

RECORRIDO EDUCATIVO
1. Una bolita como analogía inicial de partícula.
2. Una dimensión, posición x y longitud L ajustable con slider.
3. Energía potencial: cero dentro e infinita fuera.
4. Del objeto cotidiano al electrón; la regla de Schrödinger.
5. La función de onda como solución, con su fórmula visible y derivación opcional.
6. Las paredes seleccionan estados n enteros; explicación opcional del seno.
7. La energía se deriva de Schrödinger y las condiciones de frontera.
8. Distribución de probabilidad y su densidad |psi|².
9. Integral por intervalo, área sombreada y porcentaje.
10. Experimento con n y L; curva elegible y probabilidad por intervalo.
Las referencias están disponibles en un desplegable al pie, fuera de los pasos.
Las fórmulas de repaso se abren a petición en la última pantalla.

PROBABILIDAD POR INTERVALO
probabilityBetween(a,b,n,L) integra analíticamente la densidad:
P(a,b) = (b-a)/L - [sin(2 n pi b/L)-sin(2 n pi a/L)]/(2 n pi).
La API exige 0 <= a <= b <= L, con extremos en nm.
Los sliders guardan fracciones de L, para mantener el intervalo válido cuando
cambia la caja. La gráfica incluye los extremos exactos del intervalo.
El porcentaje se calcula con la integral, independientemente del muestreo.
Pruebas: intervalos vacíos, toda la caja, mitad, comparación con cuadratura,
aditividad, escalado de L y rechazo de parámetros inválidos.
Los cálculos de energía, función de onda y densidad originales se conservan.

REFERENCIAS
OpenStax, University Physics Volume 3:
§7.1 Wave Functions: función de onda, densidad e integración.
https://openstax.org/books/university-physics-volume-3/pages/7-1-wave-functions
§7.3 The Schrödinger Equation: ecuación y estados de energía definida.
https://openstax.org/books/university-physics-volume-3/pages/7-3-the-schrodinger-equation
§7.4 The Quantum Particle in a Box: pozo infinito, fronteras y soluciones.
https://openstax.org/books/university-physics-volume-3/pages/7-4-the-quantum-particle-in-a-box
NIST CODATA 2022: constantes físicas.
https://physics.nist.gov/cuu/Constants/
Consulta: 21 de noviembre de 2026. Redacción y dibujos propios adaptados al libro.
La bolita es una analogía inicial, no un modelo clásico literal del electrón.

ACCESIBILIDAD E INTERACCIÓN
Anterior/Siguiente recorren el libro y llevan el foco al título.
Los símbolos subrayados de las ecuaciones son botones: mouse o foco muestran
la explicación; clic/toque/Enter/Espacio la fija o la cierra. Escape, salir
del foco o tocar fuera cierra la explicación. Tab recorre los símbolos.
Los controles de n y L aceptan las flechas del teclado.
Las ecuaciones incluyen nombres y descripciones accesibles por símbolo.
Las gráficas indican magnitudes y unidades; el color no es la única señal.

DESARROLLO
Instalar con npm ci en la carpeta destino. No copiar node_modules como
archivos ordinarios: sus enlaces de ejecutables deben conservarse.
El servidor se inicia manualmente con npm run dev; Ctrl+C lo detiene.

CONTINUIDAD DEL LIBRO
Una ilustración SVG compartida mantiene paredes, suelo, longitud y posición
en los diez pasos. Recharts dibuja solo las curvas dentro de ese mismo marco. La zona de título y explicación reserva el mismo espacio
para que la caja no salte al cambiar de capítulo. El ancho es esquemático;
las gráficas posteriores usan posiciones cuantitativas en nanómetros.
L, n, curva e intervalo se conservan al avanzar, retroceder o volver al inicio.
Las páginas de energía, distribución e integral usan esos mismos valores.
Las explicaciones más profundas se abren a petición. Las potencias se
representan con KaTeX como un solo símbolo, con el exponente en su tooltip.

COORDENADAS Y CONTINUIDAD DE LAS GRÁFICAS
Desde el paso 2 aparecen x=0 nm y x=L con su valor numérico en la caja.
La curva usa el mismo marco SVG en todos los capítulos. El paso 8 cambia
solo la curva; el 9 añade el sombreado del intervalo; el 10 añade controles.
La línea de cero permanece fija al alternar onda y densidad. La escala
vertical se adapta a L y lleva valores numéricos desde el paso 8. El ancho
general de la ilustración es esquemático; las posiciones x y los porcentajes
se calculan con las unidades físicas del motor.
Illustration.test.tsx comprueba etiquetas y geometría compartida.

APARIENCIA Y CRÉDITOS
Paleta de referencia: Aloha Hawaii, azul #003049, rojo #D62828, naranja
#F77F00 y amarillo #FCBF49. La densidad usa una variante más oscura del
naranja (#B45B00) para mejorar su contraste sobre blanco.
https://www.schemecolor.com/aloha-hawaii-color-scheme.php
Inspiración editorial: Quantum Physics for Babies, de Chris Ferrie.
https://www.csferrie.com/books/quantum-physics-for-babies
La interfaz muestra este crédito al pie del libro.
