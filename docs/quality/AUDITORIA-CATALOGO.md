# UsefulVerse · Auditoría completa del catálogo (700 herramientas)

20-oct-2026. Método:
1. Rastreo automático de las 700 páginas en inglés (títulos, descripciones, palabras útiles, FAQ, JSON-LD, idiomas y
   límites declarados).
2. Siete auditorías por categoría, comparando con los líderes de cada sector. Cada una probó la lógica real ejecutando el
   JS de producción con casos conocidos.

Los informes completos están en `docs/quality/auditoria/` (unas 23.000 palabras, con evidencia de cada hallazgo).
Lo que no se pudo comprobar va marcado **[NV]** en cada informe. **Ninguna herramienta se borra**: las casi duplicadas
se diferencian.

| Informe | Herramientas | Problemas listados | Menciones P1 |
|---|---|---|---|
| `auditoria/mates_estadistica.md` | ~140 | 43 | 32 |
| `auditoria/juegos.md` | ~92 | 29 + rejugabilidad | 23 |
| `auditoria/imagen_media_docs.md` | ~105 | 30 + límites | 23 |
| `auditoria/otros.md` | ~48 | 41 | 18 |
| `auditoria/finanzas_salud.md` | ~102 | 33 | 11 |
| `auditoria/dev_texto.md` | ~86 | 34 + seguridad | 10 |
| `auditoria/ciencia_tiempo.md` | ~127 | 33 | 10 |
| PDF frente a iLovePDF | 34 | ver `PDF-VS-ILOVEPDF.md` y `PDF-IA.md` | — |

---

## 1. Problemas de todo el sitio (se arreglan una vez y mejoran cientos de páginas)

| # | Problema | Evidencia | Arreglo | Prioridad |
|---|---|---|---|---|
| G1 | **106 páginas cargan su JS sin hash y con caché de un año** (`immutable, max-age=31536000`): ningún arreglo llegará a quien ya las visitó | `/assets/recovered-live-only-106/…` | Hash en el nombre de cada asset, o `max-age` corto con revalidación. **Hacerlo ANTES de cualquier corrección** | P1 · fase 0 |
| G2 | `tools.usefulverse.com` devuelve 200 con la home en cualquier URL inexistente (soft 404) | curl a `/tools/zzz/` | `404.html` (fase 0) | P1 · fase 0 |
| G3 | **Plantilla de títulos engañosa:** «X — Free · no limits \| UsefulVerse» en ~194 páginas, incluso en herramientas con topes. Descripciones repetidas («Free and unlimited use… Free to use with no usage cap») o cortadas con «…» | rastreo | Títulos y descripciones por intención (fórmulas de PLAN §5); «no limits» solo si es verdad | P1 |
| G4 | **Páginas finas:** en `usefulverse.com`, mediana de **266 palabras** útiles y **2 FAQ genéricas** («How do I use…», «Is my data uploaded?») | rastreo | Plantilla por temática: fórmula o método, ejemplo resuelto, interpretación, errores típicos y 5-8 FAQ reales | P1 |
| G5 | **Datos estructurados:** ~100 páginas de `tools.` (incluidas 30 *market-tools* de Noruega o Suiza) **sin JSON-LD ni FAQ**; ninguna página de `tools.` tiene migas de pan | rastreo | Generar WebApplication, FAQPage y BreadcrumbList desde los datos de cada herramienta | P1 |
| G6 | **Enlaces relacionados sin relación o ausentes** (IMC → «Roman numerals»; varias de `tools.` no enlazan a ninguna otra; no hay enlaces entre los dos hosts) | informes de finanzas y dev | Grafo de herramientas (`tools-graph.json`) por categoría y entrada/salida; se resuelve del todo con la unificación de dominio | P1 |
| G7 | **No se puede arrastrar ni pegar archivos** en ninguna herramienta; en `tools.` el selector de archivo es nativo y sin estilo | 0 `dragover`/`paste` | Zona de soltar común + pegar del portapapeles + selector con estilo y `multiple` | P1 |
| G8 | **Límites artificiales** en más de 50 páginas (GIF de 8 s y 12 fotogramas, separador de voces 30 s, reescalado 1 MP, vectorizador 256 px, checksum 25 MB, diff JSON 200.000 caracteres, sorteos de hasta 100 nombres, números aleatorios hasta 100, mapa mental 500 ideas…) | ver tablas de límites de cada informe | Quitar los artificiales; los técnicos se procesan por partes (streaming, Web Workers) y se explican | P1 |
| G9 | **Datos que caducan:** 21 herramientas con cifras de 2026 caducan entre el 1-ene y el 6-abr-2027; algunas sin fuente ni fecha visibles | finanzas_salud §Exactitud | Selector de año, fuente y fecha visibles, aviso automático (REVISION-FINAL §3) | P1 |
| G10 | **Planificadores que pierden los datos al recargar** (subscription-tracker, weekly-planner, shift-scheduler, timeline-maker, mind-map-maker) | 0 `localStorage` | Autoguardado local con opción de borrar | P1 |
| G11 | **Títulos que no coinciden con el H1 o la intención** («Tax calculator» que es de IVA; «Integral calculator» que solo hace polinomios; crazy-eights con título en noruego) | informes | Título = intención real; la herramienta general se construye o el título se ajusta | P1 |
| G12 | Sin cabecera **CSP**: la privacidad es real (0 llamadas de red en los bundles revisados), pero no se puede demostrar | dev_texto §Seguridad | CSP estricta en `_headers` (compatible con los anuncios futuros) | P2 |
| G13 | *market-tools* cargan ~74 KB de textos de otras herramientas en cada página | juegos §market-tools | Dividir el JSON por herramienta | P2 |

## 2. Errores de cálculo o lógica confirmados (arreglar primero, son daño directo al usuario)

| Herramienta | Error | Caso probado |
|---|---|---|
| standard-deviation-calculator | Espacios y tabuladores no separan valores (pegar desde Excel falla) | «2 4 4 4 5 5 7 9» → 1 valor = 24.445.579 |
| equation-solver (cuadrática) | Raíz falsa por cancelación numérica | a=1, b=−1e8, c=1 → x=0 (su comprobación da f(0)≈1) |
| probability-distribution-calculator | Desbordamiento | binomial n=2000 → Infinity/NaN (real ≈ 0,0178) |
| rounding-calculator | El modo de cifras significativas anunciado no existe | 0,000123456 a 2 c. s. → 0,00 |
| volume-calculator | El cono pide un «segundo lado» inexistente | r=3, h=4 → error |
| eigenvalue-calculator | Rechaza matrices no simétricas | [[1,2],[3,4]] → «not symmetric» |
| salary-to-hourly-calculator | Modo semanal sobrestima la tarifa | fórmula `m=s*52`, `d=o*c` |
| rent-vs-buy-calculator | Suma la cuota tras liquidar la hipoteca | `qt()` |
| loan-calculator | Promete tabla de amortización y no la muestra | `vt()` sin pintar |
| moon-phase-calculator | Fechas de fase equivocadas (error de hasta ~17 h) | Luna nueva 11-oct en vez de 10-oct-2026 |
| hijri-calendar (conversor) | Un día por detrás del calendario oficial Umm al-Qura | ciencia_tiempo §Exactitud |
| ph-calculator | Ácido fuerte diluido sale «básico» | ciencia_tiempo §Exactitud |
| unit-converter | Precisión: 1 mm → 0,000001 mi (real 0,00000062) | `maximumFractionDigits:6` |
| recipe-scaler | «1/2 cup» ×2 → «2/2 cup»; «1 1/2» → «2 1/2» | regex de `wt()` |
| subtitle-converter | Rechaza VTT válido sin horas (`mm:ss.ttt`) | `ft()` |
| family-tree-maker | GEDCOM rompe nombres compuestos | «Mary Ann Smith» → `Mary /Ann /Smith/` |
| text-diff-checker | Compara por posición: insertar una línea marca todo como distinto | «a b c d» frente a «x a b c d» → 5 diferencias |
| regex-tester | `(a+)+$` bloquea la pestaña 14,7 s (ReDoS) | ejecutar en un Worker con tiempo máximo |
| json-schema-validator | Falsos «Valid» (ignora uniqueItems, pattern, format, additionalProperties) | `[1,2,2]` con uniqueItems → Valid |
| json-formatter | Pierde precisión en enteros grandes sin avisar | 12345678901234567890 |
| text-case-converter | Title Case destroza acrónimos y marcas | NASA→Nasa, iPhone→Iphone |
| speaker-tester | Canales etiquetados como «Left/Right button» | HTML |
| sudoku / killer sudoku | Siempre la misma estructura de cuadrícula; la dificultad solo cuenta huecos | 200 de 200 iguales |
| 2048 | No se puede jugar deslizando en el móvil | sin eventos `touch`/`pointer` |
| five-letter-word-game | En inglés solo hay lista noruega | opciones `nb` y `custom` |
| kakuro / mahjong-solitaire | No son los juegos reales (4×4 de sumas; 48 fichas planas) | runtime |

## 3. Huecos frente a los líderes (resumen; detalle y keywords en cada informe)

- **Matemáticas** (Omni, calculator.net, Symbolab): media/mediana/moda, derivadas e integrales de cualquier función,
  resolver ecuaciones escritas, cuadrática con complejos y pasos, pendiente, distancia y punto medio, triángulos
  (cualquier combinación), logaritmos y raíces, error y diferencia porcentual, prueba t de dos muestras y p-valor,
  áreas, fracción↔decimal, matrices A×B. **~40 páginas propuestas que reutilizan motores existentes.**
- **Juegos** (sudoku.com, Lichess, NYT, solitaired): IA en ajedrez y juegos de tablero (Stockfish ya está alojado),
  generador real de sudoku con dificultad por técnicas y reto diario, palabra de 5 letras en más idiomas, mahjong real
  por capas, bancos grandes de crucigramas, ahorcado y problemas de ajedrez (Lichess CC0), solitario con arrastrar y
  puntuación. Modelo interno a copiar: **suguru** (reto diario, estadísticas, racha).
- **Imagen, audio y vídeo** (TinyPNG, iLoveIMG, remove.bg, 123apps): compresor por lotes con PNG real y objetivo en KB,
  quitafondos general (BiRefNet o ISNet; revisar la licencia de los pesos), páginas png→jpg, heic→jpg, mp4→mp3,
  recortar vídeo, vídeo→GIF, comprimir vídeo para WhatsApp/Discord, grabador de pantalla con audio, grabadora de voz
  a MP3.
- **Desarrollo y texto** (CyberChef, regex101, jwt.io, crontab.guru): diff real (Myers), regex con grupos, sustitución
  y sin bloqueo, JSON Schema con Ajv, JSONPath completo, cron que interpreta y muestra próximas ejecuciones, JWT con
  caducidad, MD5/SHA-1/SHA-512, contador de caracteres, minificadores, JSON→TypeScript, fancy text, más modos de
  mayúsculas.
- **Finanzas y salud** (calculator.net, NerdWallet): hipoteca completa, salario neto e impuesto sobre la renta por país,
  EMI/SIP, embarazo semana a semana, IMC con categoría, tabla de amortización, tipos de cambio precargados (BCE con fecha).
- **Tiempo y ciencia** (timeanddate, Omni): zonas horarias IANA completas (hoy solo 13), cronómetro con vueltas, cuenta
  atrás a una fecha, rueda de sorteo, dados, moneda, días laborables, calendarios imprimibles anuales; hormigón con
  unidades mixtas y bolsas.
- **Otros**: conversor de unidades con ~20 categorías (hoy 4) y hubs por categoría + 30-50 pares con demanda, acordes de
  guitarra generados por teoría con diagramas (hoy 9), etiquetas Avery reales, regla de pantalla calibrada, graficador
  de funciones con expresiones, transcriptor con SRT/VTT.
- **PDF**: 16 páginas por intención + resumir y traducir con IA en el dispositivo (`PDF-VS-ILOVEPDF.md`, `PDF-IA.md`).

**Sobre las páginas nuevas:** todas reutilizan motores que ya existen y responden a una intención con demanda real.
Aun así son URLs nuevas: entran **dentro del freno semanal** (máximo 30 herramientas o páginas nuevas por semana) y
**después de que las 700 actuales pasen la puerta mínima**. Primero se arregla lo que hay y después se amplía.

## 4. Orden de ejecución (añadido al RUNBOOK y a ESTADO)

1. **Fase 0** (ya prevista) + **G1 (caché con hash)** + **G2**.
2. **Fase 0b · errores confirmados** (tabla §2): un PR por familia, con un test que reproduzca cada error antes de arreglarlo.
3. **Plantilla del sitio** (con el rediseño): G3, G4, G5, G6, G7, G11 y G12. Mejora las 700 de golpe.
4. **Límites artificiales (G8) y persistencia (G10)**, herramienta por herramienta, dentro del bucle de calidad.
5. **Datos que caducan (G9)** antes del 1-dic-2026.
6. **Huecos y páginas por intención (§3)**, por orden de demanda, dentro del freno semanal.
