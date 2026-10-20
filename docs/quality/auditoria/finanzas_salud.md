# Auditoría UsefulVerse: Finanzas y Salud/Fitness (20-oct-2026)

Alcance: 76 filas de finanzas y 26 de salud del rastreo. He leído el JS de producción de unas 45 herramientas (`app.js`, `opportunity-runtime.js`, `tool-suite-tools.js`, `plan-tools.js`, `market-tools/*.mjs` y `recovered-live-only-106/controllers/*`) y he ejecutado en Node los módulos de Noruega y Suiza. Marco con **[NV]** lo que no he verificado.

## Resumen

- **La base es muy sólida.** Las fórmulas son estándar (cuota de préstamo, interés compuesto, Mifflin-St Jeor, Naegele, US Navy, Widmark, NPV/IRR). Los avisos de salud del host `tools.` son ejemplares, y los parámetros de Noruega 2026, Suiza 2026/2027, la tasa de mora noruega y el tope de despido de Reino Unido coinciden con las fuentes oficiales.
- **Errores de lógica reales (3):**
  - `salary-to-hourly-calculator`: en modo semanal da una tarifa por hora inflada.
  - `rent-vs-buy-calculator`: sigue sumando la cuota de la hipoteca después de pagarla.
  - `loan-calculator`: el título y el schema prometen una «Amortization» que la interfaz no muestra.
- **Falta lo que más se busca.** No hay `mortgage-calculator`, ni salario neto o impuesto sobre la renta de EE. UU., Reino Unido, España o India, ni EMI/SIP, ni calculadora de embarazo semana a semana. El IMC no muestra la categoría. `tax-calculator` es en realidad un calculador de IVA o impuesto sobre ventas.
- **SEO estructural:**
  - Las 22 páginas `apex` tienen unas 230-300 palabras, una FAQ genérica («Is my data uploaded?»), el mismo patrón de título «— Free · no limits» y enlaces «relacionados» sin relación (Percentage / Random Number / Roman Numeral en IMC o embarazo).
  - En el host `tools.`, 401k, BAC, sueño y jubilación no enlazan a ninguna otra herramienta.
  - Las 26 páginas de país no tienen JSON-LD (sí tienen FAQ visible).
  - El host `tools.` devuelve 200 a cualquier URL inexistente (soft-404).
- **Vigencia:** 21 herramientas llevan «2026» en el título, la lógica o el CSV y caducan entre el 1-ene-2027 y el 6-abr-2027. Solo Suiza AHV, BVG y 3a traen ya 2027.

## Exactitud y vigencia

| slug | caso probado | nuestro resultado | referencia | ¿correcto? | caduca |
|---|---|---|---|---|---|
| loan-calculator | 200.000, 6 %, 30 años | 1.199,10/mes | fórmula estándar (= calculator.net) | Sí (pero sin tabla de amortización visible) | No |
| loan-calculator | 25.000, 6,5 %, 5 años (valores por defecto) | 489,15 | fórmula estándar | Sí | No |
| compound-interest-calculator | 1.000 + 100/mes, 5 %, 10 años, mensual | 17.175,24 | FV con anualidad vencida | Sí | No |
| adult-bmi-calculator | 175 cm/70 kg; 5'9"/160 lb | 22,9; 23,6 | fórmula CDC | Sí; **no muestra categoría** | No |
| bmr-tdee-calculator | hombre, 30 años, 80 kg, 180 cm, ×1,55 | 1.780 / 2.759 kcal | Mifflin-St Jeor | Sí | No |
| due-date-calculator | FUR 1-ene-2026, ciclo de 28 días | 8-oct-2026 | Naegele, 280 d (ACOG) | Sí | No |
| body-fat-calculator | hombre, 178/85/38 cm | 16,4 % | US Navy (log10, cm) | Sí (solo cm) | No |
| one-rep-max-calculator | 100 kg × 5; 100 kg × 1 | Epley 116,7 / Brzycki 112,5; Epley a 1 rep = 103,3 | Epley/Brzycki | Parcial: a 1 rep debería dar 100 | No |
| **salary-to-hourly-calculator** | 1.000/semana, 40 h, 48 semanas | **27,08/h** | 1.000/40 = 25,00 | **No**: anualiza ×52 pero divide entre 48 semanas | No |
| **rent-vs-buy-calculator** | horizonte de 40 años, hipoteca de 30 | suma 120 cuotas de más (unos 230.000 con 320k al 6 %) | lectura de código (`A+=k` sin comprobar el saldo) | **No** | No |
| tax-calculator (IVA) | 100 + 21 % | 121 / 21 | aritmética | Sí | No |
| debt-payoff-planner / credit-card-payoff | avalanche/snowball, mínimo 2 % | lógica coherente | NerdWallet (mismo método) | Sí [NV contra el líder en vivo] | No |
| depreciation-calculator | DDB | no cambia a lineal al final | práctica contable | Parcial | No |
| norway-income-tax-calculator | salario 600.000 NOK, zona estándar | impuesto 144.182; neto 455.818 (22 % ordinario; trinnskatt 12.835; trygdeavgift 7,6 %) | tramos 2026 de Skatteetaten (226.100/318.300/725.050/980.100/1.467.200; 1,7/4/13,7/16,8/17,8 %) | Sí en parámetros; total [NV contra el simulador oficial] | **1-ene-2027** |
| norway (zona Finnmark) | 18,5 % + 45.000 NOK | aplicado | Skatteetaten 2026 | Sí | 1-ene-2027 |
| norway-wealth-tax | límite exento 1,9 M; vivienda 25 % hasta 14 M | — | [NV] | ? | 1-ene-2027 |
| norway-holiday-pay | 10,2 / 12 % y +2,3 pp a partir de 60 años | correcto | Ferieloven | Parcial: el suplemento de 60+ debería limitarse a 6G | Revisar G (mayo) |
| late-payment-interest | perfil Noruega 2026 | 12,00 % (S1) / 12,25 % (S2) | Finanstilsynet | Sí | **1-ene-2027** (falta el tipo del S1-2027) |
| switzerland-net-salary | 8.000 CHF × 13 pagas | neto 97.344 (AHV 5,3 %, ALV 1,1 % hasta 148.200) | BSV 2026 | Sí | **1-ene-2027** (solo reglas de 2026) |
| switzerland-ahv-pension | RAM máximo, 44 años | 2.520/mes; 2027: 1.280–2.560 | admin.ch (2-oct-2026, +1,59 %) | Sí | Ya incluye 2027 |
| switzerland-pillar-3a | límites | 7.258 / 36.288; 2027: 7.373 / 36.864 | prensa citando la decisión federal | Sí (la cifra 36.864 de 2027 [NV]) | Ya incluye 2027 |
| switzerland-bvg | umbrales | 2027: 23.040 / 26.880 | weka.ch / BSV | Sí | Ya incluye 2027 |
| severance-pay (GB) | tope semanal | 751 £ desde 6-abr-2026 | CIPP / GOV.UK | Sí | **6-abr-2027** |
| inflation-calculator | IPC-U EE. UU. anual | 2025 = 321,943; año máximo 2025 | serie BLS (vía FRED) | Sí | **ene-2027** (añadir la media de 2026) |
| 401k-calculator | aportación de 30.000 | no avisa del límite IRS (24.500 $ en 2026) | IRS [NV hoy] | Hueco | Límite de 2027 en nov-2026 |
| bac-calculator | 70 kg, 4 × 355 ml al 5 %, 2 h | rango 0,040–0,158 % | Widmark clásico: hombre 0,088 / mujer 0,116 | Coherente con sus supuestos; el límite bajo es optimista | No |
| heart-rate-zone | máximo estimado | solo 220 − edad | Tanaka (208 − 0,7·edad) más preciso | Parcial | No |
| child-growth-percentile | CDC 2000, 2–20 años | — | CDC | Sí; sin OMS 0–2 años | No |

**Vigencia:** las páginas de Noruega (13 herramientas) y Suiza que llevan «2026» en el título deberían usar un año dinámico, con selector de 2026 y 2027 como ya hacen AHV, BVG y 3a. `norway-income-tax-calculator` y `norway-wealth-tax` no muestran ni fuente ni «fecha de revisión», mientras que BSU, NAV y crecimiento infantil sí («checked 17 October 2026»). Hay que unificarlo en todas.

## Huecos frente a los líderes

**Calculadoras muy buscadas que no tenemos** (keyword en inglés; nada de esto está en `urls.txt`):

1. `mortgage calculator`: la keyword financiera nº 1. Hoy `loan-calculator` se titula «Loan & Mortgage» pero no tiene impuestos, seguro, HOA ni PMI. Haría falta PITI, gráfica, tabla anual/mensual y CSV o PDF.
2. `amortization calculator` / `amortization schedule`: el cálculo ya existe (`vt()` genera `schedule`); solo falta pintarlo.
3. `paycheck calculator` / `take home pay calculator` / `salary calculator`, para EE. UU. (federal + FICA + estado), Reino Unido (PAYE + NI) y España («calculadora sueldo neto», IRPF de la AEAT).
4. `income tax calculator` para EE. UU., Reino Unido, India, España y Alemania (Brutto-Netto).
5. `EMI calculator`, `SIP calculator`, `FD calculator`, `PPF calculator`: demanda india enorme, y ya tenemos hindi, maratí, télugu, tamil, guyaratí y bengalí.
6. `auto loan calculator` / `car payment calculator`: solo existe el de refinanciación.
7. `simple interest`, `CD calculator`, `investment calculator`, `Roth IRA`, `social security`, `HELOC`, `student loan`, `personal loan`.
8. `hourly to salary`, `overtime`, `time and a half`: hoy `salary-to-hourly` solo funciona en un sentido.
9. `VAT calculator`, `GST calculator`, `sales tax calculator` por estado: existe la lógica en `tax-calculator`, pero sin páginas dedicadas.
10. Salud: `pregnancy calculator` (semana actual, trimestre, hitos), `conception calculator`, `ovulation calculator` (existe `cycle-calendar-estimator`, pero no está enlazado desde embarazo), `calorie calculator` / `calorie deficit` / `weight loss` (objetivo ±), `TDEE` con unidades imperiales, `pregnancy weight gain`, `A1C to glucose`, `steps to calories`, `alcohol units` (Reino Unido), `sleep cycle` (opciones de 90 minutos con aviso).

**Modos que ofrecen los líderes y nos faltan:**

- **Tabla de amortización y gráfica:** calculator.net, Bankrate y NerdWallet la tienen; en `loan`, `credit-card-payoff`, `debt-payoff`, `compound-interest` y `retirement` hay que añadirla. La pila ya tiene `chart-runtime.js`.
- **Exportar CSV o PDF:** solo lo tienen las herramientas de país, `child-growth` y `late-payment`. Faltan en todas las calculadoras `apex`.
- **Comparar escenarios A/B:** solo Noruega lo hace. Encaja muy bien en préstamo, hipoteca e interés compuesto.
- **IMC con categoría OMS/CDC y rango de peso sano:** `ideal-weight` ya calcula 18,5–24,9 y se puede reutilizar.
- **Objetivo calórico** (perder/mantener/ganar) en BMR/TDEE, y **sugerir TDEE** en `macro-calorie-calculator` (hoy exige escribir el objetivo a mano).
- **Hipoteca asumible con regla 28/36:** hoy `mortgage-affordability` solo aplica el ratio total del 36 %.
- **Límites IRS** en 401k (aportación + catch-up), solo como aviso.
- **Tanaka y FC de reserva por defecto** en las zonas cardiacas.
- **Divisas:** `currency-converter` arranca con «No rates loaded» y obliga a pulsar «Update rates». Los líderes convierten al instante.

## Páginas dedicadas y variantes

Cada página nueva va **en una URL propia con el mismo motor y otros valores por defecto, contenido y FAQ**. Nunca se borra lo que ya existe.

- **Hipoteca:** `mortgage-calculator` (PITI), `amortization-calculator`, `mortgage-payoff-calculator` (pagos extra), `15-vs-30-year-mortgage`.
- **Préstamos:** `auto-loan-calculator`, `personal-loan-calculator`, `student-loan-calculator`, `emi-calculator` (India; también `home-loan-emi` y `car-loan-emi`).
- **Impuestos y nómina por país:** `us-paycheck-calculator` (+ por estado más adelante), `uk-take-home-pay-calculator` (2026/27, con caducidad el 6-abr), `spain-net-salary-calculator` (IRPF 2026, AEAT), `germany-net-salary`, `india-income-tax` (nuevo régimen), `vat-calculator` y `gst-calculator` como variantes de `tax-calculator`.
- **Inversión:** `sip-calculator`, `cd-calculator`, `savings-calculator` (variante de compound-interest), `roth-ira-calculator`.
- **Salud:** `bmi-calculator` (alias más buscado que `adult-bmi`; usar canonical o 301 hacia la versión principal), `pregnancy-week-calculator`, `conception-date-calculator`, `calorie-deficit-calculator`, `tdee-calculator`, `ovulation-calculator` (enlazado con `cycle-calendar-estimator`), `bmi-calculator-for-kids` (con `child-growth` y la referencia OMS para 0–2 años).
- **Renombrar intención (sin borrar):** a `tax-calculator` le corresponde el título «Sales Tax & VAT Calculator». Hoy title y H1 no coinciden, y la URL capta una búsqueda de impuesto sobre la renta que no resolvemos: hay que enlazar desde ella a las calculadoras de renta.
- **`late-payment-interest-calculator`:** crear la variante `norway-late-payment-interest-calculator` (forsinkelsesrente). La genérica se mantiene.

## Problemas por herramienta

| slug | problema | evidencia | arreglo | prioridad |
|---|---|---|---|---|
| salary-to-hourly-calculator | En modo semanal sobrestima la tarifa | `plan-tools.js`: `m=s*{week:52}` y `d=o*c` (c = semanas trabajadas) | Semanal → `s/o`; mensual → `s*12/(o*c)` documentado; añadir el sentido inverso (hora → año) | P1 |
| rent-vs-buy-calculator | Cuota sumada tras liquidar la hipoteca | `opportunity-runtime.js` `qt()`: `A+=k+…` en todos los meses | Sumar `k` solo si `R>0`; añadir costes de compraventa y la inversión del ahorro mensual | P1 |
| loan-calculator | Title y JSON-LD dicen «Amortization schedule» y no se muestra | `vt()` devuelve `schedule` (12 meses + último) y `cr()` no lo pinta | Pintar la tabla completa (anual/mensual) + gráfica + CSV | P1 |
| adult-bmi-calculator | Solo el número, sin categoría ni rango sano | `Xt()` devuelve `BMI: x` | Categorías OMS adultos + rango de peso + aviso actual | P1 |
| tax-calculator | Choque de intención; title ≠ H1 | title «Tax calculator», H1 «Sales Tax, VAT and GST» | Title «Sales Tax & VAT Calculator…» + enlaces a las de renta | P1 |
| currency-converter | Sin tipos al cargar | «No rates loaded. Update from the ECB» | Precargar la última instantánea BCE en build (con fecha) y actualizar al abrir | P1 |
| 22 páginas apex (finanzas+salud) | Contenido escaso, FAQ genérica y enlaces relacionados sin relación | 230–300 palabras; FAQ «Is my data uploaded?»; relacionados Percentage/Random/Roman en IMC o embarazo | Plantilla por temática: fórmula, ejemplo resuelto, 5–6 FAQ reales y clúster relacionado | P1 |
| 401k, bac, sleep, retirement (tools.) | Sin enlaces internos a otras herramientas | ningún `href` a otro `/tools/` | Bloque «Related» por clúster | P1 |
| Noruega y Suiza (26 páginas) | Sin JSON-LD (WebApplication/FAQPage/Breadcrumb) | `ld+json: 0` (sí hay FAQ visible) | Generar schema desde el mismo `copy.faq` | P1 |
| norway-* y switzerland-net-salary | Caducan con el ejercicio 2026; sin selector de año | `RULES_2026`, CSV `norway-tax-estimate-2026.csv` | Selector 2026/2027 (como AHV/BVG/3a), año dinámico en el título, test que falle en 2027 | P1 |
| norway-income-tax, norway-wealth-tax | Sin fuente ni fecha visibles | no hay enlace a skatteetaten.no (BSU sí lo tiene) | Mostrar «Fuente: Skatteetaten · revisado dd-mm-aaaa» | P1 |
| Host tools. | Soft-404 | `/tools/zzz-nonexistent-tool/` → 200, canonical a la home (apex → 404) | Devolver 404 de verdad | P2 |
| bac-calculator | El límite bajo (r 0,80, β 0,03) queda muy por debajo de Widmark | 0,040 % frente a 0,088 % (hombre) | Pedir sexo, centrar en r 0,68/0,55 y β 0,015, destacar el valor alto (los avisos ya son excelentes) | P2 |
| mortgage-affordability-calculator | Solo DTI total del 36 % | `z()`: `F=r*p/100-g` | Añadir el ratio de vivienda (28 %) y mostrar ambos | P2 |
| bmr-tdee-calculator | Solo métrico; sin objetivo | etiquetas «Height (cm)», «Weight (kg)» | Unidades imperiales + objetivo ±500 kcal (con límites y aviso) | P2 |
| macro-calorie-calculator | Exige saber el objetivo calórico | «Daily calorie target you chose» | Enlace o cálculo opcional desde TDEE + plantillas (equilibrada/alta en proteína/keto) | P2 |
| due-date-calculator | Solo la fecha | `cn()` devuelve una línea | Semana y día de hoy, trimestre, fecha de concepción, métodos por concepción, FIV o ecografía | P2 |
| sleep-calculator | Una sola hora y la FAQ se niega a recomendar | «does not prescribe a duration» | Ofrecer 3–4 opciones; citar el ≥7 h de AASM/CDC como guía pública | P2 |
| water-intake-calculator | No personaliza (referencia fija 2,7/3,7 L) | `y()`: `{women:2.7,men:3.7}` | Modo «estimación por peso, actividad y clima» con aviso; mantener la comparación | P2 |
| inflation-calculator | Solo hasta 2025 y anual | `t>2025` | Añadir 2026 en ene-2027 y una serie mensual; más IPC de otros países (INE, ONS, Eurostat) | P2 |
| compound-interest-calculator | Sin gráfica, sin tabla anual, sin inflación | 3 resultados | Gráfica de aportado frente a intereses + tabla + CSV | P2 |
| credit-card-payoff / debt-payoff | Sin calendario ni gráfica | salida en texto | Tabla mes a mes + CSV | P2 |
| 401k-calculator | No avisa de los límites IRS | FAQ «does not check IRS limits» | Aviso al superar 24.500 $ / catch-up [NV] por año | P2 |
| norway-holiday-pay | El suplemento de 60+ no se limita a 6G | `norwayHolidayPay()` aplica 2,3 pp a toda la base | Limitar a 6G | P2 |
| heart-rate-zone | Solo 220 − edad | `x=220-age` | Añadir Tanaka y Gulati (mujeres) a elegir | P3 |
| one-rep-max | Epley ≠ peso a 1 rep | `o*(1+r/30)` | Si r = 1, devolver el peso | P3 |
| depreciation-calculator | DDB sin cambio a lineal | `ht()` | Cambio a lineal y opción SYD/MACRS | P3 |
| stock-profit / bac / debt-payoff | Límites artificiales (10 lotes, 8 bebidas, 20 deudas) | selects y validaciones | Subir o quitar los límites (filas dinámicas) | P3 |
| Metadatos de país | Descripciones de 166–242 caracteres; títulos de 62–72; sin marca; en ES, 87 caracteres | CSV `dlen`/`tlen`; /es/ Noruega | ≤155 y ≤60 caracteres; revisar las traducciones automáticas | P3 |
| market-tools/* | Unos 76 KB de JSON de copy no relacionado (juegos) en cada página de 85–91 KB | blob `data-tool-copy` con «New best score» | Copy por herramienta | P3 |
| recovered-live-only-106/* | Controladores «recuperados» que incluyen código ajeno (tabla de notas GPA en hipoteca y proteína) | `Y={'A+':4,…}` dentro de mortgage-affordability | Recuperar el código fuente, quitar el código muerto y añadir tests | P3 |
| Categorías del CSV | Herramientas mal clasificadas | finanzas incluye differential-equation, schema-validator y sleep-debt; salud incluye boolean-algebra, periodic-table, abacus, portrait-bg-remover y carbon; 14 de Noruega/Suiza están en «mates», «dev» o «imagen» | Reclasificar (afecta a hubs y migas, todas en «Everyday») | P2 |
| Casi duplicados | Pueden competir entre sí | sleep vs sleep-debt; fuel-cost vs fuel-economy vs car-running-cost; depreciation vs car-depreciation; rental-yield vs cash-on-cash; debt-payoff vs credit-card-payoff; adult-bmi vs ideal-weight | Diferenciar la intención en title, H1 y FAQ, y enlazarlas entre sí. **No borrar** | P2 |

## Ideas para superar a la competencia

1. **«Calculadora oficial explicada»** en cada herramienta de país: desglose línea a línea con la casilla oficial (por ejemplo, «trinnskatt trinn 2»), enlace a la norma, fecha de revisión y selector de año. Ni Skatteetaten ni la ESTV explican así. Ya está a medias en Noruega y Suiza: hay que hacerlo en todas.
2. **Motor de caducidad:** constante `validUntil` por regla, un test de CI que falle 30 días antes y un banner automático «cifras de 2026; 2027 pendiente». Así no se vuelve a quedar un año desfasado.
3. **Escenarios A/B y CSV o PDF en todas las calculadoras de dinero**, con URL compartible por parámetros (nunca datos personales en la query, solo los números del escenario). Bankrate y NerdWallet no permiten comparar sin registro.
4. **Clústeres temáticos con hub** (Hipoteca, Deudas, Jubilación, Fitness, Embarazo, Noruega, Suiza) para sustituir el «Everyday» genérico: más enlazado interno, migas reales y relevancia.
5. **Ventaja del 100 % local:** «tu salario no sale del navegador» en las de nómina, que en los líderes piden email o cuenta. Es argumento de título y description en las de país.
6. **Localización real, no solo traducción:** variantes por país en los idiomas que ya tenemos (EMI/SIP en hindi y otras lenguas indias, IRPF en español, Brutto-Netto en alemán, PAYE en inglés de Reino Unido). Es más tráfico con el mismo motor.
7. **Salud al nivel de MDCalc sin dar consejo:** referencias citadas (OMS, CDC, NASEM, Compendium 2024), y un «qué significa este número» con rangos poblacionales y cuándo consultar. Mantener los avisos actuales, que ya superan a calculator.net.
8. **Gráficas ligeras con `chart-runtime.js`** (ya existe) en préstamo, interés compuesto, jubilación, deuda e IMC, para igualar el principal diferencial visual de Omni y calculator.net.

**Sin verificar [NV]:** el total del impuesto noruego contra el simulador de Skatteetaten; los parámetros del impuesto de patrimonio noruego 2026; el límite 401k 2026 (24.500 $, de memoria); la cifra 3a 2027 sin segundo pilar; la escala AHV 44 exacta para 60.000 CHF (2.117). Tampoco he comprobado la UI en navegador: todo sale de la lectura de código y HTML.

Fuentes: [Skatteetaten bracket tax 2026](https://www.skatteetaten.no/en/rates/bracket-tax/), [Skatteetaten Finnmarksfradraget 2026](https://www.skatteetaten.no/satser/finnmarksfradraget/?year=2026), [Finanstilsynet forsinkelsesrente 1-jul-2026](https://www.finanstilsynet.no/nyhetsarkiv/nyheter/2026/forsinkelsesrente-og-standardkompensasjon-for-inndrivelseskostnader-fra-1.-juli-2026), [admin.ch AHV 2027](https://www.admin.ch/de/newnsb/BqB41FVYi5FB), [weka.ch límites 2027](https://www.weka.ch/themen/personal/sozialversicherungen/sozialversicherungsbeitraege/article/ahv-beitraege-diese-grenzbetraege-gelten-neu/), [cash.ch 3a 2027](https://www.cash.ch/news/top-news/mehr-ahv-mehr-3a-hohere-steuerabzuge-und-was-man-2027-bei-vorsorgeeinkaufen-beachten-sollte-974737), [CIPP redundancy 2026/27](https://www.cipp.org.uk/resources/news/statutory-redundancy-rates-announced-for-2026-27.html), [IPC-U 2025 (tercero, serie FRED)](https://ryanoconnellfinance.com/inflation-calculator/2025/).
