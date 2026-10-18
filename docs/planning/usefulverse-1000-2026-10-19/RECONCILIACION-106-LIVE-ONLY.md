# Reconciliación de herramientas públicas ausentes del catálogo fuente

Fecha de inventario: 2026-10-19
Commit del inventario: `8dfcc147a34eb9442dc6e996f0da7ef2a3332818`. Checkout comparado: rama `codex/usefulverse-23-tools-20261015`, commit `c5cfde6`.

El inventario guardado registra 700 herramientas públicas; el checkout de reconciliación tiene 594 IDs únicos en `src/catalog.mjs`, `src/growth600/catalog.mjs` y `src/markets-no-ch/catalog.mjs`. **106 URLs públicas no tienen entrada en esos catálogos.**

No se añadieron filas incompletas al catálogo ejecutable: los módulos de lógica y los datos de interfaz de estas herramientas no aparecen en este checkout. Añadir solo metadatos SEO podría generar páginas sin una herramienta funcional y modificar los sitemaps al compilar. La producción permanece intacta.

## Criterio para cerrar el gate

1. Recuperar la fuente implementable de cada URL (lógica, dependencias, interfaz, copy y localizaciones) o decidir explícitamente su retirada con una migración que conserve las URLs cuando corresponda.
2. Incorporar los módulos recuperados al catálogo y al proceso de build de forma aditiva, sin reemplazar las herramientas actuales.
3. Compilar y comparar ambos sitemaps; confirmar que las URLs previas siguen presentes o que cada excepción tiene redirección/retirada intencional.
4. Solo entonces preparar cualquier publicación.

El archivo `reconciliacion-106-live-only.json` conserva las 106 URLs, títulos visibles, H1, descripciones, host y cobertura de idiomas observados en el inventario. `datos-plan.json` y `evidencias/` conservan el inventario y su contexto de análisis.

## IDs ausentes

- `radical-calculator` — [Square Root Simplifier](https://tools.usefulverse.com/tools/radical-calculator/) (36 idiomas)
- `limit-calculator` — [Limit Calculator](https://tools.usefulverse.com/tools/limit-calculator/) (36 idiomas)
- `inequality-calculator` — [Inequality Calculator](https://tools.usefulverse.com/tools/inequality-calculator/) (36 idiomas)
- `rref-calculator` — [RREF Calculator](https://tools.usefulverse.com/tools/rref-calculator/) (36 idiomas)
- `histogram-calculator` — [Histogram Calculator](https://tools.usefulverse.com/tools/histogram-calculator/) (36 idiomas)
- `differential-equation-solver` — [Differential Equation Solver](https://tools.usefulverse.com/tools/differential-equation-solver/) (36 idiomas)
- `prime-factorization-calculator` — [Prime Factorization Calculator](https://tools.usefulverse.com/tools/prime-factorization-calculator/) (36 idiomas)
- `rational-expression-calculator` — [Rational Expression Calculator](https://tools.usefulverse.com/tools/rational-expression-calculator/) (36 idiomas)
- `modulo-calculator` — [Modulo Calculator](https://tools.usefulverse.com/tools/modulo-calculator/) (36 idiomas)
- `stem-and-leaf-plot-generator` — [Stem and Leaf Plot Generator](https://tools.usefulverse.com/tools/stem-and-leaf-plot-generator/) (36 idiomas)
- `box-plot-calculator` — [Box Plot Calculator](https://tools.usefulverse.com/tools/box-plot-calculator/) (36 idiomas)
- `sleep-debt-calculator` — [Sleep Debt Calculator](https://tools.usefulverse.com/tools/sleep-debt-calculator/) (36 idiomas)
- `push-up-test` — [Push-Up Test & Set Tracker](https://tools.usefulverse.com/tools/push-up-test/) (36 idiomas)
- `sobriety-counter` — [Sobriety Day Counter](https://tools.usefulverse.com/tools/sobriety-counter/) (36 idiomas)
- `bac-calculator` — [BAC Calculator](https://tools.usefulverse.com/tools/bac-calculator/) (36 idiomas)
- `hiking-time-calculator` — [Hiking Time Calculator](https://tools.usefulverse.com/tools/hiking-time-calculator/) (36 idiomas)
- `pdf-flattener` — [PDF Form Flattener](https://tools.usefulverse.com/tools/pdf-flattener/) (36 idiomas)
- `pdf-metadata-editor` — [PDF Metadata Editor](https://tools.usefulverse.com/tools/pdf-metadata-editor/) (36 idiomas)
- `pdf-bookmarks-editor` — [PDF Bookmarks Editor](https://tools.usefulverse.com/tools/pdf-bookmarks-editor/) (36 idiomas)
- `pdf-page-size-converter` — [PDF Page Size Converter](https://tools.usefulverse.com/tools/pdf-page-size-converter/) (36 idiomas)
- `ics-viewer` — [ICS Calendar Viewer](https://tools.usefulverse.com/tools/ics-viewer/) (36 idiomas)
- `wilks-calculator` — [Wilks & DOTS Powerlifting Calculator](https://tools.usefulverse.com/tools/wilks-calculator/) (36 idiomas)
- `circle-calculator` — [Circle Calculator](https://tools.usefulverse.com/tools/circle-calculator/) (36 idiomas)
- `family-tree-maker` — [Family Tree Maker](https://tools.usefulverse.com/tools/family-tree-maker/) (36 idiomas)
- `stock-profit-calculator` — [Stock Profit Calculator](https://tools.usefulverse.com/tools/stock-profit-calculator/) (36 idiomas)
- `pension-calculator` — [Pension Calculator](https://tools.usefulverse.com/tools/pension-calculator/) (36 idiomas)
- `lifetime-value-calculator` — [Customer Lifetime Value Calculator](https://tools.usefulverse.com/tools/lifetime-value-calculator/) (36 idiomas)
- `polar-graphing-calculator` — [Polar Graphing Calculator](https://tools.usefulverse.com/tools/polar-graphing-calculator/) (36 idiomas)
- `boolean-algebra-calculator` — [Boolean Algebra Calculator](https://tools.usefulverse.com/tools/boolean-algebra-calculator/) (36 idiomas)
- `week-number-calculator` — [Week Number Calculator](https://tools.usefulverse.com/tools/week-number-calculator/) (36 idiomas)
- `statistical-power-calculator` — [Statistical Power Calculator](https://tools.usefulverse.com/tools/statistical-power-calculator/) (36 idiomas)
- `fisher-exact-test-calculator` — [Fisher Exact Test Calculator](https://tools.usefulverse.com/tools/fisher-exact-test-calculator/) (36 idiomas)
- `taylor-series-calculator` — [Taylor Series Calculator](https://tools.usefulverse.com/tools/taylor-series-calculator/) (36 idiomas)
- `effect-size-calculator` — [Effect Size Calculator](https://tools.usefulverse.com/tools/effect-size-calculator/) (36 idiomas)
- `ellipse-calculator` — [Ellipse Calculator](https://tools.usefulverse.com/tools/ellipse-calculator/) (36 idiomas)
- `mann-whitney-u-test-calculator` — [Mann–Whitney U Test Calculator](https://tools.usefulverse.com/tools/mann-whitney-u-test-calculator/) (36 idiomas)
- `linear-programming-calculator` — [Linear Programming Calculator](https://tools.usefulverse.com/tools/linear-programming-calculator/) (36 idiomas)
- `xml-to-csv-converter` — [XML to CSV Converter](https://tools.usefulverse.com/tools/xml-to-csv-converter/) (36 idiomas)
- `csv-merge` — [CSV Merge](https://tools.usefulverse.com/tools/csv-merge/) (36 idiomas)
- `sitemap-validator` — [Sitemap Validator](https://tools.usefulverse.com/tools/sitemap-validator/) (36 idiomas)
- `bcrypt-generator` — [Bcrypt Generator](https://tools.usefulverse.com/tools/bcrypt-generator/) (36 idiomas)
- `retirement-calculator` — [Retirement Calculator](https://tools.usefulverse.com/tools/retirement-calculator/) (36 idiomas)
- `required-minimum-distribution-calculator` — [RMD Calculator](https://tools.usefulverse.com/tools/required-minimum-distribution-calculator/) (36 idiomas)
- `protein-calculator` — [Protein Calculator](https://tools.usefulverse.com/tools/protein-calculator/) (36 idiomas)
- `mortgage-affordability-calculator` — [Mortgage Affordability Calculator](https://tools.usefulverse.com/tools/mortgage-affordability-calculator/) (36 idiomas)
- `401k-calculator` — [401(k) Calculator](https://tools.usefulverse.com/tools/401k-calculator/) (36 idiomas)
- `inflation-calculator` — [Inflation Calculator](https://tools.usefulverse.com/tools/inflation-calculator/) (36 idiomas)
- `text-to-speech` — [Text to Speech](https://tools.usefulverse.com/tools/text-to-speech/) (36 idiomas)
- `world-clock` — [World Clock](https://tools.usefulverse.com/tools/world-clock/) (36 idiomas)
- `euchre` — [Euchre](https://tools.usefulverse.com/tools/euchre/) (36 idiomas)
- `spades-game` — [Spades](https://tools.usefulverse.com/tools/spades-game/) (36 idiomas)
- `name-generator` — [Original Name Generator](https://tools.usefulverse.com/tools/name-generator/) (36 idiomas)
- `random-word-generator` — [Random Word Generator](https://tools.usefulverse.com/tools/random-word-generator/) (36 idiomas)
- `breathing-exercise` — [Breathing Exercise](https://tools.usefulverse.com/tools/breathing-exercise/) (36 idiomas)
- `alarm-clock` — [Online Alarm Clock](https://tools.usefulverse.com/tools/alarm-clock/) (36 idiomas)
- `dividend-calculator` — [Dividend Calculator](https://tools.usefulverse.com/tools/dividend-calculator/) (36 idiomas)
- `net-worth-calculator` — [Net Worth Calculator](https://tools.usefulverse.com/tools/net-worth-calculator/) (36 idiomas)
- `body-surface-area-calculator` — [Body Surface Area Calculator](https://tools.usefulverse.com/tools/body-surface-area-calculator/) (36 idiomas)
- `weekly-planner` — [Weekly Planner](https://tools.usefulverse.com/tools/weekly-planner/) (36 idiomas)
- `overtime-calculator` — [Overtime Calculator](https://tools.usefulverse.com/tools/overtime-calculator/) (36 idiomas)
- `meeting-minutes-template` — [Meeting Minutes Template](https://tools.usefulverse.com/tools/meeting-minutes-template/) (36 idiomas)
- `color-mixer` — [Color Mixer](https://tools.usefulverse.com/tools/color-mixer/) (36 idiomas)
- `debt-to-income-ratio-calculator` — [Debt-to-Income Ratio Calculator](https://tools.usefulverse.com/tools/debt-to-income-ratio-calculator/) (36 idiomas)
- `car-lease-calculator` — [Car Lease Calculator](https://tools.usefulverse.com/tools/car-lease-calculator/) (36 idiomas)
- `fire-calculator` — [FIRE Calculator](https://tools.usefulverse.com/tools/fire-calculator/) (36 idiomas)
- `email-signature-generator` — [Email Signature Generator](https://tools.usefulverse.com/tools/email-signature-generator/) (36 idiomas)
- `image-vectorizer` — [Image Vectorizer](https://tools.usefulverse.com/tools/image-vectorizer/) (36 idiomas)
- `vo2-max-calculator` — [VO2 Max Calculator](https://tools.usefulverse.com/tools/vo2-max-calculator/) (36 idiomas)
- `calories-burned-calculator` — [Calories Burned Calculator](https://tools.usefulverse.com/tools/calories-burned-calculator/) (36 idiomas)
- `rhyme-finder` — [Rhyme Finder](https://tools.usefulverse.com/tools/rhyme-finder/) (36 idiomas)
- `water-intake-calculator` — [Water Intake Calculator](https://tools.usefulverse.com/tools/water-intake-calculator/) (36 idiomas)
- `cpm-calculator` — [CPM calculator](https://tools.usefulverse.com/tools/cpm-calculator/) (36 idiomas)
- `annuity-calculator` — [Annuity Calculator](https://tools.usefulverse.com/tools/annuity-calculator/) (36 idiomas)
- `options-profit-calculator` — [Options Profit Calculator](https://tools.usefulverse.com/tools/options-profit-calculator/) (36 idiomas)
- `cribbage` — [Cribbage Score Calculator and Game](https://tools.usefulverse.com/tools/cribbage/) (36 idiomas)
- `gin-rummy` — [Gin Rummy](https://tools.usefulverse.com/tools/gin-rummy/) (36 idiomas)
- `gold-calculator` — [Gold Calculator](https://tools.usefulverse.com/tools/gold-calculator/) (36 idiomas)
- `mortgage-refinance-calculator` — [Mortgage Refinance Calculator](https://tools.usefulverse.com/tools/mortgage-refinance-calculator/) (36 idiomas)
- `cash-on-cash-return-calculator` — [Cash-on-Cash Return Calculator](https://tools.usefulverse.com/tools/cash-on-cash-return-calculator/) (36 idiomas)
- `forex-position-size-calculator` — [Forex Position Size Calculator](https://tools.usefulverse.com/tools/forex-position-size-calculator/) (36 idiomas)
- `lease-vs-buy-car-calculator` — [Lease vs Buy Car Calculator](https://tools.usefulverse.com/tools/lease-vs-buy-car-calculator/) (36 idiomas)
- `epub-to-pdf` — [EPUB to PDF Converter](https://tools.usefulverse.com/tools/epub-to-pdf/) (36 idiomas)
- `spider-solitaire` — [Spider Solitaire](https://tools.usefulverse.com/tools/spider-solitaire/) (36 idiomas)
- `freecell` — [FreeCell](https://tools.usefulverse.com/tools/freecell/) (36 idiomas)
- `snake-game` — [Snake Game](https://tools.usefulverse.com/tools/snake-game/) (36 idiomas)
- `gomoku` — [Gomoku](https://tools.usefulverse.com/tools/gomoku/) (36 idiomas)
- `poker-odds-calculator` — [Poker Odds Calculator](https://tools.usefulverse.com/tools/poker-odds-calculator/) (36 idiomas)
- `heart-rate-zone-calculator` — [Heart Rate Zone Calculator](https://tools.usefulverse.com/tools/heart-rate-zone-calculator/) (36 idiomas)
- `ideal-weight-calculator` — [Ideal Weight Calculator](https://tools.usefulverse.com/tools/ideal-weight-calculator/) (36 idiomas)
- `eisenhower-matrix` — [Eisenhower Matrix](https://tools.usefulverse.com/tools/eisenhower-matrix/) (36 idiomas)
- `social-security-calculator` — [Social Security Calculator](https://tools.usefulverse.com/tools/social-security-calculator/) (36 idiomas)
- `word-puzzle-solver` — [Word Puzzle Solver](https://tools.usefulverse.com/tools/word-puzzle-solver/) (36 idiomas)
- `ludo-game` — [Ludo Game](https://tools.usefulverse.com/tools/ludo-game/) (36 idiomas)
- `memory-test` — [Memory Test](https://tools.usefulverse.com/tools/memory-test/) (36 idiomas)
- `fuel-economy-calculator` — [Fuel Economy Calculator](https://tools.usefulverse.com/tools/fuel-economy-calculator/) (36 idiomas)
- `timeline-maker` — [Timeline Maker](https://tools.usefulverse.com/tools/timeline-maker/) (36 idiomas)
- `crossword-online` — [Crossword Online](https://tools.usefulverse.com/tools/crossword-online/) (36 idiomas)
- `extract-images-from-pdf` — [Extract Images from PDF](https://tools.usefulverse.com/tools/extract-images-from-pdf/) (36 idiomas)
- `business-letter-generator` — [Business Letter Generator](https://tools.usefulverse.com/tools/business-letter-generator/) (36 idiomas)
- `markdown-table-generator` — [Markdown Table Generator](https://tools.usefulverse.com/tools/markdown-table-generator/) (36 idiomas)
- `pdf-accessibility-checker` — [PDF Accessibility Checker](https://tools.usefulverse.com/tools/pdf-accessibility-checker/) (36 idiomas)
- `docx-editor` — [DOCX Editor](https://tools.usefulverse.com/tools/docx-editor/) (36 idiomas)
- `vcard-generator` — [VCard Generator](https://tools.usefulverse.com/tools/vcard-generator/) (36 idiomas)
- `meeting-planner` — [Meeting Planner](https://tools.usefulverse.com/tools/meeting-planner/) (36 idiomas)
- `moon-phase-calculator` — [Moon Phase Calculator](https://tools.usefulverse.com/tools/moon-phase-calculator/) (36 idiomas)
- `vcard-converter` — [VCF to CSV Converter](https://tools.usefulverse.com/tools/vcard-converter/) (36 idiomas)

## Búsqueda de fuente recuperable

Se inspeccionaron los catálogos de siete ramas históricas candidatas de GitHub, además de la rama actual: `codex/usefulverse-600-implementation-2026-10-07`, `codex/100-tools-expansion-execution-2026-10`, `feat/expanded-local-tool-suite`, `feat/expanded-browser-tools`, `codex/usefulverse-functional-expansion-2026-10`, `codex/usefulverse-seo-expansion-2026-10` y `codex/usefulverse-seo-expansion`. Ninguno contiene IDs de esta lista de 106 en sus archivos de catálogo. Esto no descarta respaldos fuera de esas ramas; sí confirma que no hay una fuente recuperable en el checkout inspeccionado ni en esas ramas.


## Resultado de recuperación editable · 2026-10-19

No aparecieron los módulos originales ni source maps en las ramas/PRs revisados. Se generó una representación editable desde los archivos servidos en producción: `src/growth600/live-only-106-source/` contiene 3.816 páginas HTML (106 × 36 idiomas), 106 controladores JS formateados, estilos y recursos estáticos. La captura exacta permanece en `src/growth600/live-only-106.snapshot.json.gz`; hashes y procedencia, en `source-inventory.json`.

`npm run build:growth600` ahora consume esa estructura y completó el build con 15.365 URLs, coincidentes con el inventario público capturado. `node --check` pasó en los 106 controladores. Esta recuperación mantiene el comportamiento publicado, pero no restaura la organización, comentarios ni nombres del código fuente original anterior al build. No se hizo commit, push ni deploy.
