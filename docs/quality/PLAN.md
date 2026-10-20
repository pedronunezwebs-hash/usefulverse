# UsefulVerse · Plan de calidad máxima

> Estrategia de crecimiento hacia 1 millón de visitas al día (autoridad, marca, recurrencia, sostenibilidad): **`docs/quality/STRATEGY-1M.md`**. Este plan cubre la calidad; aquel, el crecimiento.: marca, rediseño y mejora herramienta por herramienta

Versión 1 · 20-oct-2026 · Autor: Claude (para Pedro)
Ámbito: `usefulverse.com` y `tools.usefulverse.com` (700 herramientas públicas hoy, 300 preparadas sin publicar).
Restricciones fijas: **ninguna API de pago** (ni DataForSEO, ni Google Cloud Translation, ni OpenAI). Solo
herramientas gratuitas: Search Console por API, navegador, tests locales y el método de traducción propio
(`METODO-TRADUCCION.md`).

---

## 0. Antes de empezar: 5 avisos que cambian el plan

1. **Las 300 herramientas nuevas (casi terminadas con ChatGPT)** se suben ya con `noindex` y se activan al pasar la puerta
   de calidad, como máximo 30 por semana (sección 14 y `RUNBOOK.md` §7).
2. **La traducción es el punto débil número uno de la caída.** Este plan multiplica el texto por herramienta
   (FAQ, ejemplos, guías), así que también multiplica el texto traducido. El método propuesto en
   `METODO-TRADUCCION.md` (M2M100 418M local) es gratis, pero es un modelo pequeño y su calidad puede quedar por
   debajo de la de Google Translate. Antes de usarlo a escala hay que pasar el **piloto con puerta de calidad**
   (sección 9). Si no la pasa, no se publica ese idioma con el texto nuevo: se mantiene la versión actual y se
   prueba otro motor gratuito.
3. **«Gratis, ilimitado y seguro» solo se escribe donde sea verdad.** Google y los usuarios castigan las promesas
   falsas. Por eso la auditoría de límites (sección 6) va **antes** de reescribir títulos. «Seguro» se expresa con
   un hecho comprobable: «tus archivos no salen de tu dispositivo» (procesado local en el navegador).
4. **Los resultados enriquecidos de FAQ ya no existen** (Google los retiró el 7-may-2026, según la prensa SEO). Las
   FAQ siguen siendo muy útiles en la página para usuarios, búsquedas long-tail e IA, y el marcado `FAQPage` se
   puede mantener, pero no van a dar «desplegables» en Google. HowTo tampoco. No se inventan valoraciones
   (`AggregateRating`) sin reseñas reales.
5. **Coste de CI.** Mejorar 700-1.000 herramientas con un PR y un despliegue cada una agotaría los minutos
   gratuitos de GitHub Actions. Ya iban 297 de 2.000 a primeros de octubre, y el presupuesto de GitHub debe
   quedarse en 0 $. Por eso **se agrupan los despliegues**: un lote verificado al día como máximo. Detalle en la
   sección 12.

---

## 1. Objetivo y definición de «terminado»

**Objetivo:** que cada URL de UsefulVerse sea la mejor respuesta de internet a su búsqueda: herramienta sin
límites artificiales, contenido útil y propio, diseño reconocible y rápido en móvil, en 37 idiomas, y que invite
a seguir usando otras herramientas.

**Una herramienta está «terminada» cuando supera los 12 controles de la puerta de calidad** (sección 10) en
inglés y, después, en cada idioma. Hasta entonces sigue publicada como está. No se borra nada ni se cambian URLs.

---

## 2. Orden de trabajo (fases)

| Fase | Qué | Puerta para pasar a la siguiente |
|---|---|---|
| 0 | Línea base: manifiesto de 700 herramientas, métricas de Search Console y estado de cada herramienta | Manifiesto y tabla de progreso en el repo |
| 1 | **Marca y sistema de diseño** (logo, símbolo, colores, tipografía, componentes, RTL) | Prototipo de home + 1 herramienta aprobado por Pedro en móvil y escritorio |
| 2 | **Rediseño técnico del sitio:** plantilla nueva, rendimiento, datos estructurados, sitemaps, hreflang, `llms.txt`, fusión del subdominio | Lighthouse ≥ 95 en móvil en las 5 plantillas tipo; 0 errores de schema; redirecciones 301 verificadas |
| 3 | **Herramienta por herramienta en inglés:** límites, funcionalidad, rejugabilidad, contenido, metadatos y siguiente paso | Cada herramienta pasa la puerta de calidad (sección 10) |
| 4 | **Traducción** de cada herramienta terminada a 36 idiomas con el método propio y su puerta de calidad | Cada idioma pasa el piloto y los controles automáticos |
| 5 | **Medición y ajuste** (CTR, indexación, uso) | Revisión cada 2 semanas; iterar títulos con CTR bajo |
| 7 | **Crecimiento** (autoridad, marca, recurrencia): ver `docs/quality/STRATEGY-1M.md` | En paralelo desde que termina la fase 0 |
| 6 | **Publicación de las 300 nuevas**, ya con la plantilla y la puerta de calidad | Recuperación estable 3-4 semanas; máximo +10-15 % de URLs por semana |

Las fases 3 y 4 avanzan en cinta: cuando una herramienta termina en inglés, pasa a traducción y la siguiente entra
en mejora.

**Prioridad dentro de la fase 3** (usar `docs/recovery/indexable-core-tools.csv`):
1. Las 128 herramientas con impresiones o clics (empezando por date-calculator, time-duration, roman-numeral,
   barcode, fraction, prime-number-checker, percentage, number-to-words, ratio, discount…).
2. Familias completas que se enlazan entre sí (PDF, imagen, vídeo/audio, texto, calculadoras financieras…). Así
   el «siguiente paso» apunta a herramientas ya mejoradas.
3. Juegos y generadores, que necesitan el trabajo de rejugabilidad (sección 7).
4. El resto, por categoría.

---

## 3. Fase 1 · Marca reconocible

### 3.1 Qué hace que iLovePDF se reconozca

Un **símbolo simple que se repite en todas partes** (el corazón), **un color que no cambia** (el rojo) y **un tono
de voz constante**. Ninguna de sus páginas es espectacular por separado: lo que se recuerda es la repetición
idéntica del mismo sistema.

### 3.2 Tres conceptos de marca (elige uno, o pide variaciones)

**A · «El Planeta Infinito» (recomendado).** UsefulVerse = un universo de herramientas. El símbolo es un
**planeta pequeño con un anillo en forma de ∞**, que significa a la vez «universo» e «ilimitado».
- Funciona a 16 px (favicon) y a 200 px.
- Tiene momentos de marca propios: el anillo gira mientras se procesa un archivo (el *loader*) y hace un pequeño
  «pop» al terminar (el *success*).
- Cada categoría tiene su color de planeta: PDF en coral, imagen en violeta, cálculo en verde, juegos en
  amarillo… pero el anillo ∞ es siempre igual.
- Lema corto y traducible: *«Free. Unlimited. Yours.»* / *«Gratis. Sin límites. Tuyo.»*

**B · «El Punto Útil».** Un punto grande de color vivo (●) que funciona como «botón de acción» en todo el sitio:
en el logo, en las viñetas y en el botón principal. Es más minimalista y aún más ligero, pero tiene menos
personalidad que A.

**C · «Las Piezas».** Cada herramienta es una pieza de un mosaico, y el logo son 4 piezas formando una «U». Encaja
con un catálogo enorme, pero es menos expresivo en el *loader* y en el éxito.

### 3.3 Sistema de diseño (con el concepto A)

- **Color:** un color de marca fijo de alta saturación (propuesta: violeta eléctrico, ≈ #5B3DF5), más un acento
  cálido para el *success* (≈ #FFB020) y 6-8 colores de categoría. Todos los pares texto/fondo con contraste
  AA (≥ 4.5:1) en modo claro y oscuro.
- **Tipografía:** una sola familia variable, con subconjuntos por escritura: latín, cirílico, griego, árabe,
  devanagari, CJK, tailandés, etíope, bengalí, tamil, telugu y gujarati. Solo se carga el subconjunto del
  idioma de la página. Fuente de sistema como respaldo para que el texto se vea al instante (`font-display: swap`).
- **Componentes únicos de marca:** tarjeta de herramienta con el planeta de su categoría, zona de soltar archivos
  con el anillo ∞, barra de progreso en forma de órbita, tarjeta de «siguiente paso» y migas de pan.
- **Voz:** frases cortas, segunda persona, verbos de acción, cero tecnicismos en la interfaz (ver el «test del
  niño de 8 años», sección 8.4).
- **Iconos:** set SVG propio, monocolor y en línea. Nada de emojis.

### 3.4 Diseño para 37 idiomas y RTL

- Usar **propiedades lógicas de CSS** (`margin-inline-start`, `padding-inline`, `inset-inline-end`), nunca
  izquierda/derecha fijas.
- `dir="rtl"` en árabe, urdu y persa; los iconos direccionales (flechas, «siguiente») se reflejan y los
  universales (play, descargar) no.
- Números, fórmulas y nombres de archivo se aíslan con `<bdi>` o `unicode-bidi: isolate`.
- Prever textos un 30-40 % más largos (alemán, finés) y alfabetos altos (tailandés, devanagari): botones con
  altura flexible y sin texto cortado.
- QA visual en 320, 390, 768, 1024, 1440 px con `en`, `de`, `ar`, `ja`, `hi` y `th` como idiomas testigo.

### 3.5 Presupuesto de rendimiento (móvil, 4G simulado)

| Métrica | Objetivo |
|---|---|
| LCP | < 1,8 s |
| INP | < 150 ms |
| CLS | < 0,05 |
| CSS crítico | en línea, < 14 KB; total CSS < 40 KB |
| JS al cargar | 0 KB bloqueante; el JS de la herramienta se carga diferido |
| Fuentes | 1 archivo woff2 por escritura, < 40 KB, precargado solo el del idioma |
| Terceros en la carga | 0 (la publicidad, si la hay, después de la interacción y sin mover el diseño) |

El sitio ya es estático y local en el navegador: es la base perfecta para cumplirlo.

**Puerta de la fase 1:** Pedro aprueba el prototipo (home + una herramienta de archivos + una calculadora + un
juego) visto en el móvil.

---

## 4. Fase 2 · Rediseño técnico del sitio

1. **Plantilla única de herramienta** con estas secciones, en este orden:
   1. Migas de pan → H1 (palabra clave principal) → subtítulo con la promesa verificada.
   2. **La herramienta, arriba del todo** (visible sin hacer scroll en el móvil).
   3. Tarjeta de **siguiente paso** (aparece al terminar; ver la sección 8.3).
   4. «Cómo se usa», en 3 pasos.
   5. Ejemplos resueltos o casos reales.
   6. «Para qué sirve»: usos y long-tail.
   7. «Límites reales y privacidad»: qué procesa el dispositivo, qué no, y qué depende de la memoria.
   8. Consejos y errores frecuentes.
   9. FAQ (de 6 a 12 preguntas).
   10. Herramientas relacionadas de la misma familia.
   11. Pie de página con las páginas de confianza.
2. **Páginas de confianza:** Sobre UsefulVerse (quién está detrás y por qué es gratis), Cómo funciona (procesado
   local), Contacto, Privacidad, Términos, Accesibilidad, y Metodología para las calculadoras (fuentes de
   fórmulas y fecha de revisión).
3. **Hubs de categoría** con una introducción útil, un filtro y la lista de herramientas (`ItemList`). Son la
   estructura que reparte autoridad.
4. **Un solo dominio:** migrar `tools.usefulverse.com` a `usefulverse.com/<idioma>/tools/<slug>/` con una
   redirección 301 por URL (unas 15.000 reglas; Cloudflare Pages admite `_redirects` con comodines, y se usan
   patrones por slug). Así se evita parecer «varios sitios para ocultar la escala», que Google cita
   expresamente como abuso. Antes de migrar, comprobar que ningún slug choca entre los dos catálogos (hoy no
   chocan: 0 solapes).
5. **Datos estructurados** (JSON-LD, generados desde el mismo manifiesto; ver la sección 5.4).
6. **Sitemaps:** un índice con un sitemap por idioma; `lastmod` solo cambia cuando la página mejora de verdad.
   Nada de envíos masivos (ni IndexNow, ni Naver, ni Yandex) de URLs que no han cambiado.
7. **hreflang:** recíproco entre los 37 idiomas, más `x-default` → inglés. Lo valida un test.
8. **Para la IA:** `llms.txt` en la raíz (qué es UsefulVerse, categorías y enlaces a los hubs). Todo el contenido
   en HTML estático (no se genera con JS). `robots.txt` permite los buscadores de IA, y se comprueba que AI Crawl
   Control de Cloudflare no los bloquea. Cada página empieza con un párrafo que responde directamente «qué
   hace esta herramienta y cómo».
9. **Accesibilidad:** foco visible, etiquetas en todos los campos, estados `aria-live` para el progreso y los
   resultados, todo usable con el teclado, y `prefers-reduced-motion` (el anillo ∞ no gira).

**Puerta de la fase 2:**
- Lighthouse móvil ≥ 95 en rendimiento y 100 en accesibilidad, buenas prácticas y SEO en las 5 plantillas tipo.
- Schema sin errores en el validador.
- Las 301 del subdominio devuelven 301 → 200 con el canonical correcto en una muestra de 200 URLs.
- Búsqueda de caracteres de idioma incorrecto = 0.

---

## 5. Metatítulos, descripciones y datos estructurados

### 5.1 Lo que dicen los datos

- Google reescribe gran parte de los títulos (61 % en el estudio de Zyppy de 2022; estudios de 2025 hablan de
  ~76 %). Los títulos de **51-60 caracteres** son los que menos se reescriben; por encima de 60, la reescritura
  pasa del 76 %.
- La marca al final es lo primero que Google quita cuando no aporta. Conviene que sea corta («| UsefulVerse»).
- Estudios de terceros asocian más CTR a números, a palabras de beneficio («gratis») y a títulos que responden
  exactamente a la búsqueda. No hay estudios específicos de herramientas: lo que funcione aquí se mide en
  Search Console.
- Los líderes en herramientas usan: **verbo o keyword + beneficio concreto + «gratis/online» + sin
  registro**. Ejemplos: Smallpdf, «Compress PDF: Reduce PDF File Size with Free Compressor»; iLovePDF,
  «Compress PDF online. Same PDF quality less file size».

### 5.2 Fórmulas de título (≤ 60 caracteres, keyword primero, un título único por URL)

| Tipo | Fórmula | Ejemplo (en / es) |
|---|---|---|
| Archivos (PDF, imagen, vídeo) | `{Acción + objeto}: {beneficio}, gratis y sin límites` | «Compress PDF: Smaller Files, Free & Unlimited» / «Comprimir PDF: menos peso, gratis y sin límites» |
| Calculadoras | `{Calculadora X}: {las 2-3 cosas que calcula}` | «Percentage Calculator: % of, Change & Difference» |
| Conversores | `{A} to {B} Converter – {beneficio}` | «Roman Numeral Converter – Years, Dates & 1–3,999» |
| Juegos | `{Juego} online gratis: {variedad}` | «Sudoku Online Free: Endless Puzzles, 4 Levels» |
| Generadores | `{X} Generator – {cantidad o opciones}, Free` | «Coloring Pages Generator – Thousands, Print Free» |

Reglas:
- La palabra clave principal en los primeros 30 caracteres.
- «Free» o «Gratis» **una sola vez**. Hoy la home dice «Free · no limits — Free».
- «Unlimited» o «Sin límites» solo si la auditoría de límites lo confirma.
- Sin mayúsculas en todo el título, sin emojis y sin años salvo en las herramientas con normativa anual.
- El título del idioma no se traduce literal: se usa **la keyword del idioma** (sección 5.5).

### 5.3 Fórmula de descripción (120-155 caracteres)

`{Verbo} + {qué consigues} + {diferencial verificable} + {cierre de acción}`

- «Compress PDFs right in your browser — no sign-up, no file limits. Your files never leave your device. Start free.»
- «Comprime PDF en tu navegador, sin registro ni límite de archivos. Tus archivos no salen de tu dispositivo.
  Empieza gratis.»

Diferenciales posibles (usar los que sean verdad en cada herramienta): sin registro · sin límite de archivos ·
sin marca de agua · los archivos no salen de tu dispositivo · funciona sin conexión una vez cargada · resultados
al instante · 37 idiomas.

### 5.4 Datos estructurados por página

| Tipo | Dónde | Notas |
|---|---|---|
| `WebSite` + `Organization` | Home (y referenciado en todas) | logo, sameAs (si hay redes reales) |
| `BreadcrumbList` | Todas | coincide con las migas visibles |
| `WebApplication` | Cada herramienta | `applicationCategory`, `operatingSystem: "Any"`, `offers` con precio 0, `isAccessibleForFree: true`, `browserRequirements`, `featureList`, `inLanguage` |
| `FAQPage` | Herramientas con FAQ visible | Ya no da resultado enriquecido; se mantiene porque describe la página. Idéntico al texto visible |
| `ItemList` | Hubs de categoría | lista ordenada de herramientas |
| `Article` | Guías | autor real, fechas reales |

**Prohibido:** `AggregateRating` sin reseñas reales, `HowTo` como truco y cualquier dato que no esté en la página.

### 5.5 Long-tail sin APIs de pago

Por cada herramienta, el agente investigador junta:
1. **Search Console por API** (gratis, ya funciona): consultas reales de esa URL y de las herramientas cercanas, en
   todos los idiomas, de los últimos 3 meses.
2. **Navegador** (manual con el agente): sugerencias del buscador de Google, «Otras preguntas de los usuarios» y
   búsquedas relacionadas para la keyword principal en inglés y en los 5 idiomas con más impresiones.
3. **Los 3 primeros competidores:** sus H2, sus FAQ y lo que les falta. Nunca se copia: se cubre mejor.
4. **El propio producto:** qué casos resuelve que los demás no (sin límites, local, lotes).

Resultado: `keywords.json` por herramienta con la keyword principal, 10-30 long-tail agrupadas por intención y
las preguntas para la FAQ. La keyword de cada idioma sale de Search Console o del navegador en ese idioma, y si no
hay datos, del glosario. Se guarda para que el traductor la use en títulos y H1.

---

## 6. Límites: ilimitado de verdad

### 6.1 Auditoría (por herramienta)

Inventario automático con un script que busca constantes y validaciones en el código (`max`, `limit`, `slice(0,`,
`length >`, `MB`, `files`, `pages`, `megapixel`), más una prueba manual. Cada límite se clasifica:

| Clase | Ejemplo | Acción |
|---|---|---|
| **Artificial** (no tiene razón técnica) | «máximo 20 PDFs», «máximo 3 tableros» | **Quitar** |
| **Técnico con solución** | lote de 200 imágenes que agota la memoria si se cargan a la vez | Procesar **en cola**, de uno en uno o de N en N, con Web Workers, liberando memoria; progreso y botón de cancelar |
| **Técnico real del dispositivo o del navegador** | códecs de vídeo, RAM, 40 megapíxeles de canvas | Mantener, explicar en lenguaje simple («depende de la memoria de tu dispositivo») y avisar **antes** de fallar |
| **Legal o de datos** | normativa de un año concreto | Mostrar jurisdicción, año y fecha de revisión |

### 6.2 Patrón técnico para lotes grandes

- Seleccionar y soltar sin tope (`multiple`, carpetas cuando el navegador lo permita).
- Cola con concurrencia adaptativa (`navigator.hardwareConcurrency`, `deviceMemory`) y procesamiento en Web Workers.
- Descarga: archivo a archivo, o un ZIP generado en streaming (sin cargar todo en memoria).
- Si algo falla en el archivo 137, no se pierden los otros 136: informe de errores al final.
- **Test de aceptación:** 200 archivos de prueba en un móvil de gama media emulado sin cuelgues; el tiempo y el
  pico de memoria quedan registrados.

### 6.3 Texto en la página

Sección «Límites reales y privacidad» con 2-4 frases claras. Por ejemplo: «No ponemos límite de archivos ni de
tamaño. Todo se procesa en tu dispositivo, así que con lotes muy grandes la velocidad depende de tu móvil u
ordenador.»

---

## 7. Rejugabilidad: herramientas para volver mil veces

Para juegos, puzles, generadores y actividades (sudoku, crucigramas, colorear, sopas de letras, laberintos,
cartas, trivia…):

1. **Generación procedural con semilla:** cada partida se genera al momento a partir de una semilla aleatoria, en
   vez de salir de una lista fija. Ejemplo: sudoku con solución única verificada por el propio solver, en 4-5
   niveles.
2. **Reto diario:** la semilla es la fecha, así que todo el mundo juega el mismo reto ese día. Da un motivo
   para volver cada día.
3. **Variantes y modos:** niveles, tamaños, temas, contrarreloj, modo zen y reglas regionales cuando existan
   (cartas).
4. **Progreso local:** rachas, récords y estadísticas en el dispositivo (`localStorage`), sin cuenta.
5. **Compartir una partida:** enlace con la semilla («juega este mismo tablero»).
6. **Colorear:** un generador procedural de dibujos SVG (mandalas, patrones, geometría, paisajes combinables),
   más una biblioteca amplia de dibujos con licencia libre verificada (CC0 o dominio público, con su origen
   registrado). Nunca personajes con derechos de autor.
7. **Criterio de aceptación:** 1.000 generaciones seguidas sin ninguna repetida (test automático), cada una
   válida (resoluble, sin errores), y al menos 3 niveles de dificultad cuando aplique.

Para calculadoras y conversores: botón «Ejemplo» que rellena un caso realista, historial local de cálculos,
copiar el resultado con un toque y explicación paso a paso del resultado.

---

## 8. Experiencia de usuario

### 8.1 Principios
- Una acción principal por pantalla y valores por defecto útiles.
- Resultado visible sin hacer scroll en el móvil.
- Errores en positivo: qué pasó y cómo arreglarlo.
- Nada de ventanas emergentes al entrar, ni muros de registro ni cuentas atrás.

### 8.2 Velocidad percibida
Respuesta inmediata al tocar, progreso real (no un spinner infinito) y precarga del JS de la herramienta en
cuanto el usuario interactúa con la zona de archivos.

### 8.3 «Siguiente paso»: que el usuario se quede y se enamore

- **Grafo de herramientas** (`tools-graph.json`): cada herramienta declara qué recibe (PDF, imagen, texto,
  número…), qué produce, su categoría y sus intenciones. Del grafo salen las sugerencias automáticamente.
- **Al terminar una tarea** aparece una **tarjeta en la propia página** (no una ventana emergente que tape el
  contenido): «Listo. ¿Ahora quieres…? Dividir el PDF · Convertirlo a Word · Proteger con contraseña».
  Máximo 3 sugerencias, las más probables primero.
- **Traspaso del archivo:** si el usuario elige «Dividir el PDF», el archivo resultante pasa a la siguiente
  herramienta sin volver a subirlo. Se guarda temporalmente en el navegador (IndexedDB) y se borra al
  terminar. Es lo que convierte una visita en tres.
- **Recientes y favoritas** en el dispositivo, visibles en la home y en el menú.
- **Medición:** porcentaje de sesiones que usan una segunda herramienta (con analítica sin cookies, como el
  beacon de Cloudflare, ya permitido por la CSP).

### 8.4 Test del «niño de 8 años» (en cada herramienta)

1. **Automático** (inglés): el texto de interfaz y la intro deben tener un nivel de lectura de primaria (Flesch-Kincaid
   ≤ 6), frases de 20 palabras como máximo y ninguna palabra técnica sin explicar.
2. **Revisión del agente:** «¿Un niño de 8 años sabría qué hacer en 5 segundos?». Un agente revisor lee la página
   como un niño y lista cada punto donde se perdería.
3. **Prueba de tarea:** el revisor completa la tarea principal solo con la interfaz (sin leer la ayuda) en ≤ 3
   pasos. Si no puede, se rediseña la interfaz, no la ayuda.

---

## 9. Traducción (fase 4)

Se aplica `METODO-TRADUCCION.md` (inglés canónico → memoria compartida → lotes locales → comprobaciones →
estáticos), con estas condiciones añadidas por la caída de Google:

1. **Se traduce solo lo que ya ha pasado la puerta de calidad en inglés.** Nunca se traduce un borrador.
2. **Las keywords de cada idioma no se traducen literalmente:** el título, el H1 y la descripción usan la
   keyword del `keywords.json` de ese idioma.
3. **Piloto con puerta de calidad por idioma**, antes de traducir a escala:
   - 40 cadenas de prueba por idioma (botones, errores, una FAQ, un ejemplo con cifras).
   - Controles automáticos: placeholders idénticos, cifras y unidades intactas, el idioma detectado coincide y no
     queda nada en inglés.
   - Retrotraducción al inglés de toda la muestra. El agente revisor marca cambios de significado, negaciones
     perdidas o frases sin sentido.
   - **Umbral:** 0 errores en botones, cifras y negaciones; ≤ 1 error leve de estilo cada 20 frases. Si el idioma no
     lo pasa con M2M100, se prueba MADLAD400 o el motor actual del repo, y si ninguno lo pasa, ese idioma conserva
     su versión actual hasta resolverlo.
4. **Idiomas de pocos recursos** (hausa, amárico, telugu, gujarati, tamil, marathi, swahili): la muestra de revisión es el
   doble de grande.
5. El texto traducido mantiene el test del niño de 8 años: frases cortas en inglés = traducciones más limpias.
6. Las herramientas con normativa (impuestos, salud, legal) llevan su jurisdicción y no se «adaptan» al país del
   idioma.

### 9.1 Cobertura obligatoria: las 37 lenguas en todas las herramientas

**Requisito de Pedro: todas las herramientas deben existir en los 37 idiomas definidos**, ni más ni menos:
`en, es, fr, pt-BR, de, ja, ko, id, hi, ar, zh-CN, bn, ru, ur, tr, vi, it, zh-TW, bg, ca, nl, el, ms, pl, sv, th,
uk, sw, mr, te, ha, fil, ta, fa, am, gu, nb-NO`.

Estado medido en los sitemaps públicos el 20-oct-2026:

| Catálogo | Herramientas | Con 37 idiomas | Con 36 (falta noruego) |
|---|---|---|---|
| `usefulverse.com` | 277 | 0 | **277** (el dominio no tiene noruego, ni siquiera en la home) |
| `tools.usefulverse.com` | 423 | 100 | **323** |
| **Total** | **700** | **100** | **600** |

Cómo se cierra el hueco:
- **El noruego bokmål es el único idioma que falta.** Su ruta debe ser la que ya usa el subdominio (`/nb/`). Si se
  fusiona el subdominio, se mantiene `/nb/` en el dominio principal.
- **Se añade a cada herramienta en el momento de traducirla** (fase 4), junto con los otros 36 idiomas. Nunca
  antes de que la herramienta pase la puerta de calidad en inglés. Así se cumple la regla de no traducir
  borradores.
- También se crean en noruego la home, los hubs de categoría, las guías y las páginas de confianza, y se añade
  `nb` al selector de idioma, a los `hreflang` recíprocos y al índice de sitemaps (`sitemap-nb.xml`).
- Volumen: unas **610 URLs nuevas** en total (600 herramientas + home, hubs y guías), un +2,4 %. Entran
  **de forma gradual**, al ritmo de las herramientas terminadas y dentro del freno de crecimiento de la sección 12.
  No se publican todas de golpe.
- El piloto de traducción (punto 3) incluye el noruego: hay que comprobar que es bokmål y no nynorsk, como ya
  avisa `METODO-TRADUCCION.md`.
- **Test de cobertura en el build:** falla si alguna herramienta publicada no tiene exactamente las 37 versiones
  o si algún `hreflang` apunta a una versión inexistente. Mientras dure la transición, el test solo admite 36
  idiomas en las herramientas que todavía están en la cola de la fase 4, marcadas en `progress.csv`.

---

## 10. Puerta de calidad por URL (definición de «terminado»)

Una herramienta solo pasa a «terminada» si cumple **los 12 puntos**. Cada uno se comprueba con evidencia (test,
captura o medición), no con «debería funcionar».

| # | Control | Cómo se comprueba |
|---|---|---|
| 1 | **Funciona** con casos normales, extremos y entradas inválidas | Tests unitarios + prueba en navegador |
| 2 | **Sin límites artificiales**; los técnicos están explicados | Auditoría de la sección 6 + test de 200 archivos o 1.000 generaciones |
| 3 | **Rejugable/reutilizable** (si aplica) | Test de no repetición, niveles, reto diario |
| 4 | **Contenido propio y útil:** cómo se usa, ejemplos, usos, límites, consejos y 6-12 FAQ desde long-tail real | Revisión editorial + similitud < 30 % con cualquier otra herramienta (test de n-gramas) |
| 5 | **Exactitud:** fórmulas con fuente y ejemplos recalculados | Test que recalcula cada ejemplo publicado |
| 6 | **Título y descripción** según las fórmulas de la sección 5, únicos y con promesas verificadas | Test de longitud, unicidad y palabras repetidas |
| 7 | **Datos estructurados** válidos e idénticos al contenido visible | Validador schema.org en el build |
| 8 | **Siguiente paso** con 1-3 sugerencias relevantes del grafo, y traspaso de archivo si aplica | Prueba en navegador |
| 9 | **Test del niño de 8 años** superado | Sección 8.4 |
| 10 | **Móvil rápido:** LCP < 1,8 s, CLS < 0,05, INP < 150 ms | Lighthouse móvil en la URL |
| 11 | **Accesible:** teclado, lector de pantalla y contraste AA | axe-core + prueba con teclado |
| 12 | **RTL y textos largos** sin cortes (prueba en ar y de) | Captura en 390 px |

Las herramientas casi iguales a otra **no se borran ni se fusionan**: se **diferencian** (caso de uso, contenido e
intención propios). Solo se fusionan con 301 si Pedro lo aprueba expresamente.
---

## 11. Cómo se ejecuta herramienta por herramienta (proceso de agentes)

Unidad de trabajo = **una herramienta**. Estado en `docs/quality/progress.csv`: `slug, familia, prioridad, fase,
estado, fecha, PR, notas`, con los estados `pendiente → investigando → construyendo → QA → revisión → arreglos →
terminada-en → traduciendo → terminada`.

Por cada herramienta:
1. **Investigador:** intención, `keywords.json`, competidores, auditoría de límites y lista de mejoras.
2. **Constructor:** implementa las mejoras de lógica, límites, rejugabilidad, contenido y metadatos, y escribe
   los tests.
3. **QA en navegador:** casos reales en móvil y escritorio, 200 archivos o 1.000 generaciones, capturas.
4. **Tres revisores independientes:** contenido y exactitud; SEO y schema; UX con el test del niño de 8 años y
   accesibilidad.
5. **Arreglos** de todo lo que encuentren. Se vuelve a revisar solo lo afectado.
6. **Marcar como terminada** cuando pasa los 12 puntos. Entra en la cola de traducción.

Reglas:
- Ninguna herramienta nueva ni URL nueva.
- No se borra ninguna herramienta ni se cambian slugs. Una fusión, solo con aprobación de Pedro y con 301.
- Un agente no trabaja en el mismo checkout que otro: worktree propio, como ya pasó con Codex.
- Todo se puede reanudar: un chat nuevo lee `progress.csv` y continúa.

**Ritmo orientativo:** depende de la herramienta. Una calculadora simple puede quedar en una sesión, y un editor
de PDF o un juego pueden necesitar varias. Con 700 herramientas, es un trabajo de meses. Por eso el orden de
prioridad importa: las 128 con datos primero.

---

## 12. Publicación y coste

- **Lotes:** se juntan de 5 a 20 herramientas terminadas en una rama, y como máximo **un despliegue al día**.
  Los cambios de documentación llevan `[skip ci]`.
- **Minutos de GitHub Actions:** comprobar antes de cada lote que quedan minutos gratuitos (presupuesto de 0 $ con
  bloqueo). Si se acercan al límite, se pausan los despliegues hasta el ciclo siguiente.
- **Cloudflare Pages:** sin coste adicional por despliegue estático. Respetar el límite de archivos por despliegue
  y el máximo de 25 MiB por archivo; el sitemap actual de 15 MB pasa a un índice de sitemaps por idioma.
- **Buscadores:** tras cada lote, solo se actualiza el `lastmod` de las URLs mejoradas y se reenvía el índice de
  sitemaps. Indexación manual solo para las 10 URLs más importantes de cada lote.
- **APIs de pago:** ninguna. Si alguna vez hiciera falta una, se consulta antes con una estimación de coste.

---

## 13. Medición (fase 5)

Cada 2 semanas, con la API de Search Console:

| Indicador | Línea base (1-15 oct) | Señal de que vamos bien |
|---|---|---|
| Impresiones diarias | 3.000-4.300 (antes de la caída) / 14-56 (después) | Repunte sostenido |
| CTR | 0,4 % | > 1,5 % en herramientas terminadas |
| Páginas con impresiones | 2.659 | Crece cada quincena |
| «Rastreada: sin indexar» | 530 y subiendo | Baja |
| URLs top inspeccionadas | «sin indexar» | Pasan a «indexada» |
| Uso de una segunda herramienta | sin medir | > 15 % de las sesiones |

**Títulos:** las URLs con CTR por debajo de lo esperado para su posición se reescriben y se vuelven a medir
a las 4 semanas.

**Alarma diaria** (ya propuesta en `docs/recovery/README.md`): aviso si las impresiones caen más de un 50 % frente a la
media de 7 días, o si la posición empeora más de 10 puntos en 5 días.

---

## 14. Las 300 herramientas nuevas: se suben ya con `noindex` y se activan poco a poco

Decisión de Pedro (20-oct-2026). Están casi terminadas con ChatGPT:
1. **Se suben todas ya con `noindex`** (en sus 37 idiomas): existen y se pueden usar, pero Google no las indexa ni cuentan en
   la valoración del sitio. Fuera del sitemap y de los `hreflang`, nunca bloqueadas en `robots.txt`, y sin envíos a
   buscadores.
2. **Se activan** (sin `noindex`, en el sitemap y en los `hreflang`) cuando cada una pasa la puerta de calidad y el piloto de
   traducción: **máximo 30 por semana**. Primero las 50 con demanda confirmada.
3. Las que necesiten servidor o API de pago, solo con una ficha de costes aprobada. Las 231 de reserva no se activan sin
   decisión de Pedro.

Procedimiento exacto: `docs/recovery/RUNBOOK.md` §7.

## 15. Riesgos y cómo se cubren

| Riesgo | Mitigación |
|---|---|
| La traducción local es peor que la actual | Piloto con umbral por idioma; si falla, se conserva la versión actual |
| Contenido «inflado» para llegar a un número de palabras | No hay objetivo de palabras: hay preguntas reales que responder y un test de similitud |
| Promesas falsas («ilimitado», «seguro») | Auditoría de límites antes de reescribir títulos; «seguro» = hecho verificable |
| El rediseño empeora el rendimiento | Presupuesto de la sección 3.5 como test que bloquea el build |
| La fusión del subdominio pierde señales | 301 una a una, verificación por muestreo y sitemap actualizado el mismo día |
| Agotar los minutos gratuitos de CI | Despliegues por lotes, máximo uno al día, y comprobar la cuota antes |
| Otro agente publica herramientas nuevas | `AGENTS.md` lo prohíbe; un test de CI bloquea el aumento de URLs sin aprobación |
| Expectativas de recuperación | Google reevalúa un sitio en meses; se mide cada 2 semanas y se ajusta |

---

## 16. Checklist resumida

- [ ] Fase 0 · manifiesto + `progress.csv` + línea base de Search Console
- [ ] Fase 1 · concepto de marca elegido + sistema de diseño + prototipo aprobado en el móvil
- [ ] Fase 2 · plantilla nueva + páginas de confianza + hubs + fusión del subdominio con 301 + schema + sitemaps por idioma + `llms.txt` + presupuesto de rendimiento en CI
- [ ] Fase 3 · herramientas en inglés por prioridad, cada una con los 12 puntos
- [ ] Fase 4 · piloto de traducción aprobado por idioma + traducción de las terminadas a los **37 idiomas** (noruego `nb` incluido: faltan 600 herramientas)
- [ ] Fase 7 · crecimiento: widgets con nofollow, listados de alternativas, páginas de «alternativa gratuita a X», PWA, juegos diarios para compartir, analítica + KPIS.md (STRATEGY-1M.md)
- [ ] Fase 5 · medición quincenal + reescritura de títulos con CTR bajo
- [ ] Herramientas nuevas: subida en `noindex` + activación ≤ 30/semana al pasar la puerta (RUNBOOK §7)

---

### Fuentes

- Google · Políticas de spam (scaled content abuse): https://developers.google.com/search/docs/essentials/spam-policies
- Google · Sitios multirregionales y multilingües: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Zyppy · Google reescribe el 61 % de los títulos: https://zyppy.com/seo/google-title-rewrites/
- Retirada de los resultados enriquecidos de FAQ (2026): https://ppc.land/google-kills-faq-rich-results-what-seos-saw-coming-since-2019/ · https://jsonld.com/google-faq-rich-results-deprecated/
- Google retira la guía de bloquear traducciones automáticas: https://www.searchenginejournal.com/google-removes-robots-txt-guidance-for-blocking-auto-translated-pages/548870/
- Títulos y descripciones observados el 20-oct-2026 en iLovePDF, Smallpdf, TinyWow y Omni Calculator (consulta directa).
