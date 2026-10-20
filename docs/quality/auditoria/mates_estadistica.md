# Auditoría · Matemáticas y estadística (UsefulVerse) · 20-oct-2026

Alcance y método: 141 filas del CSV. Unas 45 no son de matemáticas (bricolaje, Noruega, Suiza, numerología, carta natal, tallas…): solo las he revisado en bloque por métricas SEO. He probado en navegador sin interfaz (agent-browser, inglés) 30 herramientas de matemáticas y estadística, con casos límite. He leído las notas de límites de las 38 páginas de tools.usefulverse.com y he comparado con los listados públicos de calculator.net (≈50 calculadoras de matemáticas) y Omni (672 de matemáticas y 192 de estadística). Lo de Symbolab, Mathway, Desmos, GeoGebra y Wolfram sale de conocimiento general, sin verificarlo hoy. **No he probado** polynomial-factorization, complex-number, inequality, box-plot, histogram, SVD ni los tests no paramétricos más allá de sus notas de límites.

## Resumen

1. **Hay 3 errores de cálculo graves en herramientas de mucha demanda.** La desviación estándar ignora los espacios y tabuladores como separadores ("2 4 4 4 5 5 7 9" pasa a ser el número 24 445 579). La ecuación cuadrática da una raíz falsa por pérdida de precisión. La binomial devuelve `Infinity`/`NaN` con n grande.
2. **Varias promesas del título no se cumplen.** "Integral calculator", "Equation solver" y "Free · no limits" encabezan herramientas que solo integran polinomios metidos por coeficientes (máx. 21), solo resuelven ax²+bx+c, o limitan n ≤ 170, 100 números o 10¹².
3. **Las 25 páginas de usefulverse.com de esta categoría usan la misma plantilla pobre.** Tienen 217-259 palabras, 2 FAQ (una es la de privacidad), una sola frase de explicación, ni fórmula ni ejemplo. Además enlazan siempre a "Percentage / Random / Roman numeral", aunque la página sea de matrices.
4. **El hueco de catálogo es enorme frente a Omni y calculator.net.** Faltan las páginas propias de intención grande: media/mediana/moda, pendiente, distancia, punto medio, Pitágoras, triángulo rectángulo, logaritmos, raíz, error porcentual, prueba t de dos muestras, p-valor, área y derivada o integral de cualquier función.
5. **Lo que puede diferenciarnos:** pasos explicados gratis (Symbolab y Mathway los cobran), gráficas, resultado en la URL (hoy hay 0 llamadas a `history.replaceState` en los 6 bundles revisados) y pegar datos desde Excel en cualquier herramienta.

## Huecos frente a los líderes

| Líder | Qué ofrece | Qué nos falta | Keyword | Prioridad |
|---|---|---|---|---|
| calculator.net, Omni | Media, mediana, moda y rango | Solo calculamos la media (average-calculator) | mean median mode calculator | P1 |
| Symbolab, Mathway, Wolfram | Derivada de cualquier función con pasos | Solo polinomios metidos por coeficientes | derivative calculator | P1 |
| Symbolab, Wolfram | Integral indefinida o definida de cualquier función con pasos | Solo polinomios, máx. 21 coeficientes | integral calculator | P1 |
| Mathway, Symbolab | Escribes la ecuación y la resuelve ("solve for x") | Solo coeficientes a, b, c | equation solver, solve for x | P1 |
| calculator.net | Fórmula cuadrática con raíces complejas, discriminante, vértice y pasos | Rechazamos raíces complejas, no hay pasos | quadratic formula calculator | P1 |
| calculator.net, Omni | Calculadoras propias de pendiente, distancia y punto medio con gráfica | Las tres van juntas en coordinate-geometry, sin gráfica | slope calculator · distance formula calculator · midpoint calculator | P1 |
| calculator.net, Omni | Triángulo por cualquier combinación SAS/ASA/AAS/SSA, triángulo rectángulo, Pitágoras | Solo SSS (tres lados) | triangle calculator · right triangle calculator · pythagorean theorem calculator | P1 |
| calculator.net | Log, exponente y raíz n-ésima | Solo dentro de la calculadora científica | log calculator · exponent calculator · square root calculator · cube root calculator | P1 |
| calculator.net, Omni | Error porcentual, diferencia porcentual, aumento y disminución | Tenemos 3 modos y ninguno de esos | percent error calculator · percentage difference calculator · percentage increase calculator | P1 |
| Omni | Prueba t de dos muestras y pareada, chi² de independencia, p-valor, valor crítico | Solo t de una muestra, chi² de bondad de ajuste y ANOVA | t test calculator · p value calculator · chi square calculator · critical value calculator | P1 |
| Omni, calculator.net | Intervalo de confianza t (σ desconocida) y de proporción | Solo z con σ conocida | confidence interval calculator | P1 |
| calculator.net, Omni | Calculadora de áreas y de superficie de muchas figuras | Solo 4 sólidos en volume-calculator | area calculator · surface area calculator | P1 |
| Omni | Fracción↔decimal, simplificar, números mixtos, comparar | Solo las 4 operaciones con 2 fracciones | decimal to fraction calculator · simplify fractions calculator | P1 |
| Symbolab | Multiplicar matrices A×B, sumar, potencia, rango, adjunta | Solo determinante, inversa y traspuesta de una matriz | matrix multiplication calculator | P1 |
| calculator.net | Cifras significativas | El H1 lo anuncia, pero no existe el modo | sig fig calculator | P1 |
| Omni | Normal inversa, área entre dos z, tabla z | Solo de valor a percentil | inverse normal calculator · z score to p value | P2 |
| Omni | Cuartiles, IQR, percentiles, resumen de 5 números | Solo dentro del diagrama de caja | IQR calculator · quartile calculator · percentile calculator | P2 |
| Omni | Varianza, MAD, coeficiente de variación, estadística descriptiva | Repartido o inexistente | variance calculator · descriptive statistics calculator | P2 |
| Symbolab, Wolfram | Valores propios de cualquier matriz, también complejos | Solo matrices simétricas de 2×2 a 8×8 | eigenvalue calculator | P2 |
| calculator.net | Calculadora de números grandes y factorial exacto | n ≤ 170, resultado en coma flotante | factorial calculator · big number calculator | P2 |
| Omni | Bayes, valor esperado, probabilidad de dados, lotería, lanzar moneda | Nada de esto | bayes theorem calculator · expected value calculator · dice probability | P2 |
| Omni | Círculo unitario, arcoseno/arcocoseno, grados↔radianes, longitud de arco | Nada de esto | unit circle · arcsin calculator · radians to degrees | P2 |
| Desmos, GeoGebra | Calculadora gráfica completa | function-grapher (de otra categoría, no lo he auditado) | graphing calculator | P2 (verificar) |
| Omni, Wolfram, calculator.net | Combinaciones con repetición, fracciones parciales, integrales dobles, aritmética binaria y hexadecimal | Nada de esto | partial fraction calculator · binary calculator | P3 |

## Páginas dedicadas y variantes

| URL propuesta | Intención o keyword | Motor que reutiliza | Justificación |
|---|---|---|---|
| /tools/mean-median-mode-calculator/ | mean median mode calculator | El analizador de average y el cálculo de standard-deviation | Una de las búsquedas más grandes de estadística y no tiene URL |
| /tools/weighted-average-calculator/ | weighted average calculator | Modo 2 de average-calculator | Hoy le roba el título a "average calculator" |
| /tools/final-grade-calculator/ | final grade calculator | Modo 3 de average-calculator | Intención distinta, muy estacional, con demanda propia |
| /tools/quadratic-formula-calculator/ | quadratic formula calculator | equation-solver | Así equation-solver queda libre para un resolvedor general |
| /tools/slope-calculator/ · /distance-formula-calculator/ · /midpoint-calculator/ | slope / distance / midpoint | coordinate-geometry | Tres keywords grandes que hoy compiten dentro de una sola URL |
| /tools/right-triangle-calculator/ · /pythagorean-theorem-calculator/ | right triangle / pythagorean | triangle-calculator (con resolvedor ampliado) | calculator.net y Omni tienen ambas |
| /tools/surface-area-calculator/ · /area-calculator/ | surface area / area | volume-calculator, circle, polygon, trapezoid | Agrega figuras que ya existen |
| /tools/percent-error-calculator/ · /percentage-increase-calculator/ · /percentage-difference-calculator/ · /percent-of-what-calculator/ | Variantes de porcentaje | percentage-calculator | Cada una tiene SERP propia |
| /tools/permutation-calculator/ · /factorial-calculator/ | permutation / factorial | combinatorics (pasado a BigInt) | La permutación hoy es un desplegable |
| /tools/normal-distribution-calculator/ · /binomial-distribution-calculator/ · /poisson-distribution-calculator/ | Una por distribución | probability-distribution | Hoy salen los 7 campos a la vez sea cual sea la distribución |
| /tools/p-value-calculator/ · /inverse-normal-calculator/ | p value / inverse normal | z-score y la función de distribución normal ya existente | Intención de examen, muy buscada |
| /tools/t-test-calculator/ · /anova-calculator/ · /chi-square-calculator/ | Una por prueba | statistical-test | Hoy hay 3 pruebas detrás de un selector |
| /tools/variance-calculator/ | variance calculator | standard-deviation | Variante directa |
| /tools/gcf-calculator/ · /lcm-calculator/ | greatest common factor / LCM | gcd-lcm | En EE. UU. se busca "GCF", no "GCD" |
| /tools/significant-figures-calculator/ | sig fig calculator | rounding (añadiendo el modo) | El H1 ya lo promete |
| /tools/correlation-coefficient-calculator/ | correlation coefficient | linear-regression | El r de Pearson ya se calcula |
| /tools/margin-of-error-calculator/ | margin of error | confidence-interval y sample-size | Cálculo inverso trivial |
| /tools/matrix-multiplication-calculator/ · /determinant-calculator/ · /inverse-matrix-calculator/ | Una por operación | matrix-calculator | Patrón de Symbolab y Omni |
| /tools/decimal-to-fraction-calculator/ · /simplify-fractions-calculator/ | Conversión y simplificación | fraction-calculator | repeating-decimal-to-fraction deja fuera los decimales finitos |
| /tools/square-root-calculator/ · /cube-root-calculator/ · /log-calculator/ | Raíces y logaritmos | El evaluador de scientific y radical | Hoy no tienen URL |
| /tools/dice-roller/ · /coin-flip/ | dice roller / coin flip | random-number-generator | Omni tiene más de 10 variantes de dados |

## Problemas por herramienta

| Slug | Problema | Evidencia | Arreglo | Prioridad |
|---|---|---|---|---|
| standard-deviation-calculator | Los espacios y tabuladores no separan valores (pegar desde Excel falla) | "2 4 4 4 5 5 7 9" → COUNT 1, AVERAGE 24,445,579, SD 0. "2⇥4⇥4⇥4" → "needs at least two values". "1,5 2,5 3,5" → COUNT 4, media 27.75 | Usar el analizador de average-calculator, que con los mismos datos da 5 (separar por `[\s,;]+`). Si se detecta coma decimal, avisar | P1 |
| standard-deviation-calculator | Etiqueta copiada de otra herramienta | El campo se llama "Numbers to average" | "Data values" | P3 |
| equation-solver | Pérdida de precisión (cancelación catastrófica) | a=1, b=−1e8, c=1 → "x = 100000000, x = 0" y su propia comprobación dice "f(0) ≈ 1" | Fórmula estable: q = −(b + sign(b)√D)/2; x₁ = q/a; x₂ = c/q | P1 |
| equation-solver | El título promete un resolvedor general; no hay raíces complejas ni pasos | Solo hay campos a, b, c. 1,2,5 → "Complex roots are outside this calculator's scope" | Separar la cuadrática (ver tabla anterior); mostrar raíces complejas, discriminante, vértice y pasos | P1 |
| polynomial-integral-calculator | Afirmación engañosa y entrada poco usable | Título "Integral calculator — Free · no limits". Error "Enter 1–21 finite coefficients". "x^2+1" rechazado | Aceptar polinomios escritos: polynomial-long-division ya analiza `2x^3 - x + 4`. Título "Polynomial Integral Calculator". Crear la integral general aparte | P1 |
| polynomial-derivative-calculator | La misma entrada por coeficientes ("lowest power first") | Snapshot | Igual que la anterior | P2 |
| scientific-calculator | Sin teclado en pantalla y funciones básicas sin soporte | Solo hay un cuadro de texto. "5!" → "Unsupported character: !". "2(3+4)" → error. "cbrt(27)" y "nCr(5,2)" no se reconocen | Teclado, historial, `!`, multiplicación implícita, cbrt, nCr/nPr, botón Ans | P1 |
| scientific-calculator | tan(90°) devuelve un número en vez de "indefinido", con precisión falsa | tan(90) → 16,331,239,353,200,000 | Detectar múltiplos de 90° impares y no formatear miles en notación científica | P2 |
| probability-distribution-calculator | Desbordamiento en la binomial | n=2000, p=0.5, k=1000 → "P(X = 1000) = Infinity, P(X ≤ 1000) = NaN" (el valor real es ≈0.0178) | Usar log-gamma. Mostrar solo los campos de la distribución elegida. Añadir P(X ≥ k) y "entre" | P1 |
| volume-calculator | El cono exige un "segundo lado" que no existe | r=3, h=4 con el campo 2 vacío → "Enter a valid radius or width." Las etiquetas son genéricas ("Radius or first side") | Etiquetas y campos según la figura. Añadir cubo, pirámide, semiesfera, tronco, cápsula y elipsoide | P1 |
| triangle-calculator | Solo lados conocidos (SSS) | Solo hay campos a, b, c | Resolvedor para cualquier combinación de 3 datos, con caso ambiguo SSA y dibujo | P1 |
| long-division-calculator | Solo enteros no negativos, sin decimales ni la división dibujada | 10.5/2.5 y −17/5 → rechazados. 1/3 → "Quotient 0 Remainder 1". Los pasos van en una sola línea | Cociente decimal con periodo, divisor decimal, signos y la cuadrícula clásica de la división | P1 |
| rounding-calculator | El modo de cifras significativas que promete el H1 no existe | H1 "Rounding and Significant Figures". 0.000123456 a "2" → 0.00 (con 2 cifras significativas sería 0.00012) | Selector decimales/cifras significativas/decena/centena/millar. El redondeo decimal ya funciona: 1.005 → 1.01 | P1 |
| average-calculator | 3 intenciones en una URL y el título no apunta a la keyword principal | Título "Weighted Average Calculator for Grades"; botones Simple / Weighted / Final grade | Título "Average Calculator – Mean, Weighted & Grades" y páginas propias para las variantes | P1 |
| confidence-interval-calculator | Solo z con σ conocida y valor por defecto raro | El valor por defecto es 90% | Intervalo t con los datos en bruto, intervalo de proporción, 95% por defecto. El cálculo es correcto: 100 ± 5.879892 | P1 |
| statistical-test-calculator | Falta la prueba más buscada | Solo t de una muestra, chi² de bondad de ajuste y ANOVA. La t de una muestra cuadra (t=0.939, p=0.3907) | Añadir t de dos muestras (Welch), t pareada y chi² de independencia | P1 |
| matrix-calculator | 3 operaciones, una sola matriz, sin fracciones exactas ni pasos | La inversa de [[1,2],[3,4]] sale como "1.5, −0.5", no como 3/2 y −1/2 | Matrices A y B, multiplicar, sumar, potencia, rango; modo exacto con fracciones; pasos de Gauss-Jordan | P1 |
| eigenvalue-calculator | Rechaza el ejemplo de libro | [[1,2],[3,4]] → "This matrix is not symmetric". Nota: "2×2 to 8×8 … ±1,000,000" | Algoritmo QR con Hessenberg para matrices generales, con valores propios complejos | P1 |
| coordinate-geometry-calculator | 3 intenciones en una URL, sin gráfica | 4 campos de puntos; 241 palabras | Separar y dibujar en SVG | P1 |
| Plantilla de las 25 páginas de usefulverse.com | Contenido escaso | 217-259 palabras, 2 FAQ ("How do I use…" y privacidad), "made simple" en una frase; z-score sin fórmula ni ejemplo | Fórmula, ejemplo resuelto, interpretación, errores típicos y 5-6 FAQ reales: más de 600 palabras | P1 |
| Plantilla de las 25 páginas de usefulverse.com | Enlazado interno irrelevante y miga de pan floja | z-score y matrix enlazan a Percentage, Random y Roman numeral. Breadcrumb "Everyday" | Enlaces dentro del tema (matrix→rref/eigen/svd) y una categoría "Math/Statistics" | P2 |
| combinatorics-calculator | Límite artificial y resultado aproximado | "0 ≤ r ≤ n ≤ 170". C(100,50) → "1.0089134454556422e+29" | BigInt exacto (sin tope práctico), con repetición, y listar combinaciones | P2 |
| random-number-generator | El límite contradice el "no limits" del título | "How many numbers?" con 100000 → "Choose a number from 1 to 100." | Subir a 10⁵ o más y exportar a CSV | P2 |
| prime-number-checker | Límite artificial y respuesta seca | 9007199254740993 → "from 0 to 1,000,000,000,000". 561 → "Not prime" sin decir por qué | Miller-Rabin con BigInt y mostrar el menor divisor | P2 |
| prime-factorization-calculator | Límite de 10¹² | "Enter an integer from 1 to 1,000,000,000,000" | Pollard rho con BigInt | P3 |
| limit-calculator | Solo numérico: da dígitos falsos o falla | (1+1/x)^x en +∞ → 2.71828307 (e = 2.7182818…). x·sin(1/x) en 0 → error genérico (el límite es 0). Tope de 120 caracteres | Extrapolación de Richardson, reconocer constantes, L'Hôpital simbólico para casos 0/0 sencillos, quitar el tope | P2 |
| fraction-calculator | Tras un error se queda el resultado anterior | 1/2 ÷ 0 → "Check your input and try again." mientras sigue visible −1/3 | Vaciar el resultado y dar un mensaje concreto. Añadir pasos (mínimo común denominador) y más de 2 fracciones | P2 |
| gcd-lcm-calculator | El mismo resultado obsoleto tras un error; sin pasos | "4.5, 9" → "Use whole numbers only." con el MCD y mcm anteriores aún visibles. Con BigInt funciona bien | Vaciar el resultado; mostrar Euclides y la factorización | P2 |
| percentage-calculator | Pocos modos y errores mudos | "From 0" → "—" con "Calculation complete." | Mensaje "variación indefinida desde 0" y los modos de la tabla de huecos | P2 |
| z-score-calculator | Solo en una dirección | z=6.5 → "100%". Sin p-valor de una o dos colas, sin inverso, sin área | Añadir esos modos y una curva sombreada | P2 |
| cubic-quartic-equation-calculator | Solo raíces reales | Nota: "Real roots only… ±1,000,000" | Raíces complejas con Durand-Kerner, que es trivial | P2 |
| taylor-series-calculator | Solo 6 funciones fijas | "eˣ, sin(x), cos(x), ln(x), 1/x and √x" | Derivación automática para cualquier expresión | P2 |
| spearman-correlation-calculator | Sin inferencia | "does not report a p-value" | p exacto o aproximación t | P2 |
| fisher-exact, rref, number-line, linear-programming, histogram, box-plot, laplace | Topes declarados o motor limitado | "Maximum 10,000 per cell", "Up to 12 rows", "Up to 20 rows", "at most eight constraints", "1–5,000 values", "1–2,000 values"; laplace "table-based" (242 palabras) | Subir o quitar los topes (son cálculos baratos en el navegador); fracciones parciales en laplace | P3 |
| radical-calculator | El slug y el H1 apuntan a cosas distintas | H1 y título "Square Root Simplifier" | Título "Radical Calculator – Simplify Square & nth Roots" | P2 |
| Títulos de más de 60 caracteres | Se cortan en Google | standard-deviation 65, number-to-words 65, age 64, business-days 64, scientific 64, confidence-interval 63, time-card 63, gcd-lcm 62, scientific-notation 62, linear-regression 61, percentage 61; en tools: ring-size 68, norway-employer 85, norway-property 71, norway-student 62, norway-mileage 61 | Recortar a ≤ 60 | P2 |
| Descripciones de más de 155 caracteres | Se cortan | wheel-offset 176, norway-mileage 168, norway-toll 168, aquarium-water-mixing 166, norway-employer 165, norway-commuting 161, norway-student 204 | Recortar | P3 |
| Palabras repetidas en el título | Repetición | grade-scale "grade", natal-chart "chart", norway-employer "employer", norway-property "transfer", norway-student "loan", swiss-premium "premium" | Reescribir | P3 |
| 16 páginas sin FAQ ni JSON-LD | Sin schema | aquarium-water-mixing, grade-scale, knitting-gauge, natal-chart (141 palabras), numerology, pet-age, ring-size, vacation-entitlement, wheel-offset, swiss-premium y las 6 de Noruega | Añadir FAQPage y WebApplication | P2 |
| Páginas de tools.usefulverse.com | Sin BreadcrumbList (según el CSV) | Columna jsonld | Añadirlo | P3 |
| Clasificación | ~45 de 141 páginas no son de matemáticas | brick, mulch, bra-size, natal-chart, Noruega… | Revisar la taxonomía: diluye el hub de matemáticas | P2 |
| Casi duplicadas (diferenciar, nunca borrar) | Intenciones que se solapan | z-score ↔ probability-distribution (normal); average ↔ standard-deviation; equation-solver ↔ cubic-quartic ↔ inequality; matrix ↔ rref ↔ eigen ↔ svd; fraction ↔ repeating-decimal; scientific-notation ↔ rounding | Una intención clara en el H1 de cada una y enlaces cruzados ("¿Buscas…?") | P2 |
| Todas | Sin estado en la URL ni gráficas en estadística | 0 llamadas a `replaceState`/`pushState`. Regresión y distribuciones solo muestran texto | Ver ideas | P2 |

Comprobado como correcto: el MCD con BigInt, la inversa de matriz con pivoteo (ε=1e-17), la regresión (acepta tabuladores), el tamaño de muestra (385 y 278 con N=1000), Φ(1.96)=0.975002, Poisson, el redondeo half-up y half-even, y la t de una muestra.

## Ideas para superar a la competencia

1. **Pasos explicados gratis en todo**, que es lo que Symbolab y Mathway cobran. Un motor compartido en el navegador (math.js o nerdamer para el cálculo, KaTeX para mostrarlo) cubre derivadas, cuadráticas, fracciones, Gauss-Jordan, división larga y Euclides.
2. **Una entrada matemática única:** el usuario escribe `2x^2+3x-5=0` o `[[1,2],[3,4]]` y le llevamos a la herramienta correcta, con vista previa en LaTeX y teclado de símbolos en móvil.
3. **Gráfica en SVG en cada resultado:** parábola, triángulo a escala, nube de puntos con su recta, área sombreada bajo la normal o la binomial.
4. **Resultado en la URL** (`?a=1&b=-3&c=2`) con "Copiar enlace", y un modo `?embed=1` para insertar en blogs educativos. Es una vía de backlinks.
5. **Un analizador de datos único** para todas las herramientas: pegar desde Excel (tabuladores y saltos de línea), CSV y coma decimal con aviso. Arregla de raíz el error de la desviación estándar.
6. **Modo exacto** con fracciones y BigInt (matrices, combinatoria, primos), para ser "sin límites" de verdad.
7. **Historial local** y "usar este resultado en…" (de la media a la desviación estándar y de ahí al intervalo de confianza).
8. **"Comprobar mi respuesta"** para estudiantes, enlazado con math-worksheet-generator; exportar los pasos a PDF o LaTeX.
9. **Panel de estadística descriptiva** del que salen, con un clic y los mismos datos, la prueba t, el intervalo de confianza y la regresión. Omni lo reparte en páginas sueltas.
