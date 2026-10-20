# Auditoría · Ciencia e ingeniería + Tiempo, fechas, planificación y aleatorios

Fecha: 20-oct-2026. Alcance: 66 páginas de ciencia y 61 de tiempo/planificación según los CSV, más las páginas clave de otras categorías que pediste revisar (date, age, business days, duration, online-timer, time zone, random number, name picker, resistor, concrete, unit converter). Revisé 34 en profundidad y el resto en bloque.

**Método.** Ejecuté en Node el JS de producción descargado con curl y comparé cada resultado con una referencia. No pude abrir las páginas en un navegador (navegación denegada), así que no comprobé la interfaz en vivo. Marco con **(NV)** todo lo que no está verificado.

## Resumen

- **Las fórmulas de física, química y electricidad son sólidas**: ley de Ohm, gas ideal, proyectil, LED, trifásica, Juliano, semana ISO y salida del sol dan el resultado correcto. Hay 3 errores reales de exactitud:
  - **Fases lunares:** fallan hasta 17 h y dan **fechas equivocadas**. P1.
  - **Calendario Hijri:** usa el calendario tabular y da 1 día menos que Umm al-Qura. P2.
  - **pH:** un ácido fuerte diluido sale "básico". P2.
- **El producto de tiempo es más débil que el de ciencia.**
  - El conversor de zonas horarias tiene **solo 13 zonas** fijas.
  - No hay **cronómetro, cuenta atrás a una fecha, rueda de sorteo, dados ni moneda** como páginas propias.
  - El timer junta tres intenciones en una URL y su título termina en "…".
- **Muchas herramientas tienen topes que contradicen el "unlimited"** del título:
  - aleatorio: 100 números como máximo;
  - sorteo de nombres: 100 elegidos;
  - equipos: 60 nombres;
  - amigo invisible: 30 personas;
  - kanban: 8 columnas;
  - reloj mundial: 8 relojes;
  - alarma: 1 sola y a 7 días como máximo;
  - red de resistencias: 20.
- **Hay planificadores que pierden los datos al recargar** (weekly-planner, shift-scheduler, subscription-tracker, timeline, world-clock, alarm, meeting-planner). Kanban, hábitos y diario sí guardan. Es incoherente.
- **SEO:**
  - 106 páginas de `tools.` cargan JS sin hash con `immutable, max-age=1 año`, entre ellas moon-phase, world-clock y week-number. Un arreglo no llegará a quien ya visitó la página. P1 global.
  - `tools.usefulverse.com/tools/<cualquier-slug>/` responde 200 con canonical a la home, es decir, un **soft 404**.
  - Las páginas del dominio principal tienen solo 2 FAQ genéricas y menos de 300 palabras.
  - 10 páginas de mis categorías usan texto plantilla ("Enter your values and get a result on this device").

## Exactitud

| slug | caso | nuestro | referencia | ¿correcto? |
|---|---|---|---|---|
| time-zone-converter | NY 09:00, 20-mar-2026 (EE. UU. ya en horario de verano, UE no) → Madrid | 14:00 CET | 14:00 | Sí |
| time-zone-converter | Sídney 09:00, 4-oct-2026 (día del cambio de hora) → Londres | 23:00 BST del 3-oct | 23:00 | Sí |
| time-zone-converter | Kolkata 12:00 → Katmandú | 12:15 | 12:15 | Sí |
| time-zone-converter | Madrid 02:30, 29-mar-2026 (hora que no existe) | 03:30 CEST, sin aviso | se debe avisar (timeanddate lo hace) | Sí, pero calla |
| date-calculator | 1-ene → 31-ene | 30 (o 31 contando ambos días) | 30/31 | Sí |
| age-calculator | 29-feb-2000 → 28-feb-2025, regla "28 feb" | 25 a 0 m 0 d | 25 a | Sí |
| age-calculator | 29-feb-2000 → 28-feb-2025, regla "1 mar" | 24 a 11 m 30 d | 24 a 11 m 30 d | Sí |
| age-calculator | 31-ene-1990 → 28-feb-2026 | 36 a **1 m 0 d** | 36 a 0 m 28 d (calculator.net, **NV**) | Otra convención; no se explica en la página |
| business-days | oct-2026, lunes a viernes, contando ambos días | 22 (21 con festivo el 12-oct) | 22 / 21 | Sí |
| business-days | +10 días laborables desde vie 16-oct | 30-oct | 30-oct | Sí |
| week-number | 31-dic-2026 / 30-dic-2024 / 3-ene-2021 | S53-2026 / S1-2025 / S53-2020 | ISO 8601 | Sí |
| julian-date-converter | JD 2451545 | 2000-01-01 12:00 UTC (MJD 51544,5) | igual | Sí |
| hijri-calendar-converter | 20-oct-2026 | **8** Yumada I 1448 | **9** Yumada I 1448 (Umm al-Qura, Intl) | **No** (1 día) |
| hijri-calendar-converter | 18-feb-2026 | 1 Ramadán 1447 | 1 Ramadán 1447 | Sí |
| moon-phase-calculator | luna nueva oct-2026 | **11-oct** 09:13 UTC | **10-oct** 15:50 UTC | **No** |
| moon-phase-calculator | cuarto menguante oct-2026 | **4-oct** 00:03 UTC | **3-oct** 13:24 UTC | **No** |
| moon-phase-calculator | luna llena oct-2026 | 26-oct 03:36 UTC | 26-oct 04:11 UTC | Sí (35 min) |
| moon-phase-calculator | luna llena ene-2024 | **26-ene** 02:38 UTC | **25-ene** 17:54 UTC | **No** |
| sunrise-sunset | Madrid, 21-jun-2026 | 06:44 / 21:48 CEST | ≈06:44 / 21:48 (**NV**, de memoria) | Sí |
| sunrise-sunset | Tromsø, 21-dic (noche polar) | sin salida de sol; crepúsculo 09:30–13:53 | noche polar | Sí |
| ohms-law | 12 V, 6 Ω | 2 A, 24 W | 2 A, 24 W | Sí |
| ohms-law | 5 V, 10 MΩ | 5e-7 A en el cálculo; con 6 decimales se mostraría "0.000001 A" (**NV** en vivo) | 0,5 µA | **No**: el redondeo de la pantalla lo deforma |
| resistor-color-code | amarillo-violeta-rojo-oro | 4,7 kΩ ±5 % | igual | Sí |
| resistor-color-code | codificar 4750 Ω con 4 bandas | amarillo-**gris**-rojo = 4,8 kΩ | ese valor no existe en E24; lo normal es 4,7 kΩ | Mejorable |
| led-resistor | 5 V, Vf 2 V, 20 mA | 150 Ω, 0,06 W, recomienda 1/8 W | igual | Sí |
| voltage-drop | Cu, 30 m, 16 A, 2,5 mm², 230 V | 6,62 V (2,88 %) | 6,62 V con ρ a 20 °C; ≈8,3 V (3,6 %) con conductor caliente (ρ×1,25) | Solo para conductor frío |
| ph-calculator | HCl 1e-8 M | **pH 8,00 "básico"** | **6,98** (hay que sumar los iones del agua) | **No** |
| ph-calculator | ácido acético 0,1 M, Ka 1,8e-5 | 2,875 | 2,87 | Sí |
| projectile-motion | 20 m/s, 45° | alcance 40,79 m; altura máx. 10,20 m | igual | Sí |
| ideal-gas-law | 1 atm, 1 mol, 273,15 K | 22,414 L | 22,414 L | Sí |
| concrete-calculator | losa 10×10 ft × 4 in | la profundidad solo admite ft (hay que poner 0,333) → 33,3 ft³; **no da yd³** | 1,23 yd³ | Correcto, pero inutilizable en EE. UU. |
| random-number-generator | pedir 101 números | error "Choose a number from 1 to 100" | sin límite | Límite artificial |

## Huecos frente a los líderes

Keywords en inglés. La demanda es una estimación cualitativa: no consulté APIs de pago (**NV**).

**Tiempo (timeanddate, calculator.net, online-stopwatch)**
- `stopwatch` / `online stopwatch`, con vueltas y parciales. Hoy es una pestaña de online-timer y no tiene vueltas. Demanda muy alta.
- `countdown timer` / `countdown to date`, con un evento compartible por URL. No existe: el timer solo admite minutos y segundos.
- `5 minute timer`, `10 minute timer`, `1 hour timer`… Long-tail enorme. No hay presets ni parámetros en la URL.
- `pomodoro timer`. Ya existe dentro de online-timer; merece página propia.
- `days until christmas` / `new year countdown`. Estacional; el pico empieza ahora.
- `time calculator` (sumar o restar h:m:s) y `hours calculator`. time-duration solo resta dos fechas.
- `add months to date`, `add weeks/years`, y diferencia en años/meses/semanas. date-calculator solo trabaja en días.
- `day of the week calculator` y `leap year`. No existen.
- `military time converter` / `24 hour time`. No existe.
- `what time is it in <ciudad>`, `EST to IST`, `PST to EST`. Son páginas de pares de zonas, una long-tail masiva de timeanddate.
- `calendar 2027 printable`, `yearly calendar`, `calendar with holidays`. printable-calendar-maker solo saca un mes en texto, con un botón "Calculate" y en la categoría "Writing".
- `daylight saving time 2026/2027` (fechas por país). No existe.
- `epoch converter` con elección de zona y µs/ns. timestamp-converter solo muestra hora local y UTC.

**Aleatorios (wheelofnames, random.org)**
- `spin the wheel` / `wheel of names` / `yes or no wheel`. No hay rueda: random-name-picker es una lista de texto, sin animación, sin guardar la lista y sin eliminar al ganador.
- `dice roller`, `flip a coin`, `random letter generator`, `lottery number generator`, `random card`, `random date`. No existen. Son baratas de hacer y de alta demanda.

**Planificación (Trello)**
- Kanban con arrastrar y soltar, descripción, fecha límite, etiquetas y varios tableros. Hoy: solo título, flechas o botones, 8 columnas y guardado manual.

**Electricidad (RapidTables, Omni)**
- `wire size calculator` / `AWG`. voltage-drop solo admite mm².
- `watts to amps`, `amps to watts`, `kva calculator`, `power factor`. No existen.
- `series and parallel resistor` y `voltage divider`. Lo primero está escondido dentro de ohms-law; lo segundo no existe.
- `smd resistor code`, `capacitor code` (104 → 100 nF), `E-series nearest value`. No existen.

**Construcción (Omni, calculator.net)**
- `cubic yard calculator`, `concrete bag calculator` (bolsas de 40/60/80 lb), `concrete column/footing/stairs`, `rebar`, `concrete block`, `concrete driveway cost`. Hoy solo hay losa, sin bolsas por defecto.

**Física y química (Omni)**
- Física: `speed distance time`, `velocity`, `free fall`, `potential energy` (escondida en kinetic), `work/power`, `Hooke`, `buoyancy`, `Snell`.
- Química: `percent yield`, `molality`, `grams to moles`, `empirical formula`, `percent composition`, `Henderson-Hasselbalch` / `buffer`, `titration`.

**Conversiones**
- unit-converter tiene solo 4 categorías y 21 unidades. Faltan área, velocidad, presión, energía, potencia, datos, tiempo, cucharadas, piedras (stone) y millas náuticas.

## Páginas dedicadas y variantes

Separar sin borrar nada: la página combinada se queda como hub.

1. **online-timer** → `/stopwatch/`, `/countdown-timer/`, `/pomodoro-timer/`. Añadir presets prerenderizados (`/timer/5-minutes/`, 1, 2, 3, 10, 15, 20, 25, 30, 45, 60, 90 min), cada uno con title, H1 y FAQ propios. Arreglar el título truncado.
2. **date-calculator** → `/add-days-to-date/`, `/days-between-dates/`, `/days-until/<evento>/` (christmas, new year, halloween, thanksgiving, easter), `/day-of-the-week/`, `/weeks-between-dates/`.
3. **time-zone-converter** → la lista completa de `Intl.supportedValuesOf('timeZone')` con buscador por ciudad. Variantes de pares de alta demanda (EST↔IST, PST↔EST, GMT↔EST, CET↔EST, UTC↔IST). Más `/time-in/<ciudad>/`.
4. **random-name-picker** → `/spin-the-wheel/` (rueda animada), `/yes-or-no-wheel/`, `/raffle-picker/`. Y como páginas nuevas, no variantes: `/dice-roller/`, `/coin-flip/`.
5. **random-number-generator** → `/random-number-1-10/`, `1-100`, `/lottery-number-generator/`.
6. **ohms-law-calculator** → `/series-parallel-resistor-calculator/` (sacar el modo "network"), `/watts-to-amps/`, `/voltage-divider-calculator/`.
7. **concrete-calculator** → `/concrete-bag-calculator/`, `/cubic-yard-calculator/`, `/concrete-column-calculator/`.
8. **kinetic-energy-calculator** → `/potential-energy-calculator/`, porque el modo ya existe dentro.
9. **printable-calendar-maker** → `/calendar-2027/` y `/calendar-2026/`, anual en PDF o imprimible, con festivos opcionales.
10. **Mal categorizadas:**
    - word-frequency-counter → Texto;
    - statistical-power-calculator → Estadística;
    - norway-electricity-support-comparator → Finanzas/Noruega;
    - bcrypt-generator, rsa-key-generator, vcard-generator, email-signature-generator, mockup-generator, cribbage, bead-pattern → no son de tiempo;
    - concrete, paint, tile y square-footage → breadcrumb "Everyday" en vez de Construcción;
    - printable-calendar → "Writing".

    Corregir el hub y el breadcrumb mejora el enlazado interno.

## Problemas por herramienta

| slug | problema | evidencia | arreglo | prioridad |
|---|---|---|---|---|
| moon-phase-calculator | Usa un ciclo sinódico medio, sin perturbaciones; error de hasta ~17 h y fecha equivocada | Nueva: 11-oct vs 10-oct-2026. Llena: 26-ene vs 25-ene-2024 | Algoritmo de Meeus (cap. 49) para las fases y fracción iluminada real | P1 |
| (global, 106 páginas) | JS en `/assets/recovered-live-only-106/…` sin hash, con `immutable, max-age=31536000` | `curl -I` de world-clock.js | Poner hash en el nombre o usar `max-age` corto con revalidación; afecta a moon-phase, world-clock, week-number, alarm, meeting-planner, sobriety, timeline, weekly-planner | P1 |
| time-zone-converter | Solo 13 zonas; faltan París, Berlín, México, São Paulo, Dubái, Shanghái, Singapur… | 26 `<option>` (13 × 2) | Lista IANA completa con buscador y alias de ciudades; avisar de horas inexistentes o repetidas | P1 |
| online-timer | Tres intenciones en una URL; sin vueltas, sin pantalla completa, sin presets; título con "…" | `<title>…Free Countdown and… \| UsefulVerse`; no hay `lap` ni `fullscreen` en el JS | Separar páginas (ver arriba); vueltas y parciales con exportación CSV; pantalla completa; presets | P1 |
| random-name-picker | Sin rueda, sin guardar la lista, sin "quitar al ganador", tope de 100 | `a>100` en new-tools.js | Rueda en canvas con animación, lista en localStorage, pesos, historial | P1 |
| concrete-calculator | Solo losa; profundidad en ft; sin yd³ ni bolsas; 2 FAQ y 239 palabras | Código `Qe` | Unidades mixtas (ft + in, m + cm), yd³, bolsas de 40/60/80 lb y 25 kg, formas columna/zapata/escalera, coste | P1 |
| subscription-tracker, weekly-planner, shift-scheduler, timeline-maker | Los datos se pierden al recargar (0 `localStorage`) | grep en el JS | Autoguardado local con opción de desactivarlo, como kanban y hábitos | P1 |
| printable-calendar-maker | Un solo mes, salida en texto, "Calculate", categoría Writing | Texto de la página | Anual y mensual en PDF, festivos, fases lunares, semana ISO | P1 (estacional) |
| kanban-board | 8 columnas, sin drag & drop, sin descripción ni fecha, guardado manual | `length>8` en kanban-runtime | Drag & drop accesible, campos de tarjeta, autoguardado, varios tableros, export CSV | P2 |
| ph-calculator | Un ácido o base fuerte diluido ignora el Kw | 1e-8 M → pH 8 "basic" | Resolver [H⁺] = (C + √(C² + 4Kw))/2 | P2 |
| hijri-calendar-converter | Calendario tabular (civil), no Umm al-Qura | 20-oct-2026: 8 vs 9 Yumada I | Selector Umm al-Qura (Intl `islamic-umalqura`) por defecto y tabular como opción | P2 |
| ohms-law-calculator | Sin prefijos (mA, kΩ, MΩ); 6 decimales fijos; red con tope de 20 | Inputs sin selector de unidad | Selectores SI y salida en notación de ingeniería (0,5 µA) | P2 |
| kinetic-energy, density | Solo admiten SI (kg, m/s, m³) | Campos `massKg`, `velocityMps` | Selectores de unidades como en force/pressure | P2 |
| voltage-drop-calculator | Sin AWG; ρ a 20 °C sin opción de temperatura | `crossSectionMm2`, ρ = 0,01724 | AWG/kcmil, temperatura del conductor, reactancia opcional, tamaño de cable recomendado | P2 |
| age-calculator | Convención de fin de mes no explicada; sin semanas, horas ni "edad en planetas"; 2 FAQ | 31-ene → 28-feb = "1 m 0 d" | Explicarla en la página, ampliar la salida, añadir FAQ y HowTo | P2 |
| date-calculator | Solo días: no da años/meses/semanas ni día de la semana, no suma meses | Código `rt` | Desglose Y/M/W/D, día de la semana, sumar meses y años | P2 |
| world-clock | Tope de 8 relojes; ciudades no guardadas; entrada de texto | Texto "up to 8 clocks" | Sin tope práctico, persistencia, buscador, diferencia horaria | P2 |
| meeting-planner | Hay que escribir los nombres IANA a mano; tope de 8 zonas; no guarda | Texto de la página | Buscador por ciudad, guardar participantes, compartir por URL | P2 |
| alarm-clock | Una alarma, solo 7 días, se pierde al recargar | Texto de la página | Varias alarmas, repetición, sonidos, persistencia | P2 |
| random-number-generator | Tope de 100; decimales sin precisión; sin ordenar ni exportar | `r>100` | Hasta 10⁵ con descarga CSV, decimales configurables, ordenar | P2 |
| random-team-generator / secret-santa | Topes de 60 y 30 personas | `length>60`, "between 2 and 30 people" | Subir a ≥1000; exclusiones de pareja en el amigo invisible | P2 |
| name-generator | Título "Fantasy" con listas cortas y genéricas (14 adjetivos × 18 sustantivos) | Arrays del JS | Listas por género (élfico, enano, ciudad, nave…) con miles de combinaciones | P2 |
| sleep-calculator | Da una sola hora; no ofrece la lista de ciclos de 90 min | Función `p` | Mostrar 4–6 opciones por ciclos, como sleepcalculator.com | P2 |
| sunrise-sunset, moonrise | Latitud, longitud y zona IANA a mano; sin geolocalización; ~170 palabras y texto plantilla | `timeZone` es un campo de texto | Buscador de ciudad, botón "mi ubicación" opcional, tabla mensual, duración del día | P2 |
| tools.usefulverse.com | Soft 404: un slug inexistente da 200 con canonical a la home | `/tools/zzz…/` → 200 | Devolver 404 real | P2 |
| 10 páginas de mis categorías (shift-scheduler, subscription-tracker, org-chart, radar, sankey, mockup, persian-calendar, sunrise, moonrise, word-frequency) | Texto plantilla "Free, browser-based tool. Enter your values…"; FAQ genéricas | grep | Introducción, ejemplos y FAQ específicas | P2 |
| páginas de usefulverse.com (date, age, timer, concrete, kanban…) | Solo 2 FAQ, 230–330 palabras, títulos "— Free · no limits" repetidos | crawl.csv | 5–7 FAQ reales, ejemplos resueltos y título con la intención principal | P2 |
| concrete-calculator (meta) | Descripción redundante | "Free and unlimited use in your browser. Free to use with no usage cap." | Quitar la frase repetida | P3 |
| resistor-color-code | Codifica valores que no son estándar; faltan 3 bandas y tolerancias IEC nuevas | 4750 → 4,8 kΩ | Ajustar al E-series más cercano y avisar; modo de 3 bandas | P3 |
| timestamp-converter | Corte en 1e11 para distinguir s de ms; sin µs/ns; sin elegir zona | `Math.abs(i)>=1e11` | Detección por número de dígitos, µs/ns y selector de zona | P3 |
| time-zone / time-duration | Horas de cambio de hora inexistentes o repetidas, sin aviso | Caso de Madrid del 29-mar | Mensaje explícito | P3 |
| interval-timer | Tope de 99 rondas; sin rutinas guardadas | `max="99"` | Guardar rutinas y sin tope | P3 |
| graph-paper, bead-pattern, switzerland-tenancy, norway-electricity | Sin FAQ ni JSON-LD | crawl.csv | Añadir el schema WebApplication y FAQPage del resto | P3 |

## Ideas para superar a la competencia

1. **Una "suite de tiempo" enlazada.**
   - Cada resultado ofrece el siguiente paso: date → añadir al calendario (.ics), days-until → cuenta atrás compartible, zona horaria → meeting-planner con los mismos participantes.
   - El estado va en la URL (`?from=Europe/Madrid&to=Asia/Kolkata&t=…`), así que se puede compartir sin cuenta. timeanddate no deja enlazar la mayoría de sus resultados de forma limpia.
2. **Páginas prerenderizadas de timer y cuenta atrás.**
   - 12 duraciones y 15 eventos × 37 idiomas, con la herramienta funcional nada más cargar.
   - Es contenido único por intención (FAQ de cada evento), no duplicado.
3. **Rueda superior a wheelofnames.**
   - Lista ilimitada guardada en local, pesos, imágenes y emojis, modo "eliminar ganador", historial exportable, pantalla completa y resultado justo verificable (CSPRNG ya disponible).
   - Todo sin anuncios ni cuenta: es el argumento de venta frente a wheelofnames.
4. **Ingeniería "lista para obra".**
   - Concreto con bolsas por marca y presentación, yd³ y m³, y coste.
   - Caída de tensión con el tamaño de cable recomendado en mm² y AWG, según el porcentaje objetivo.
   - Resistencias con el valor E12/E24/E96 más cercano.
   - Omni no junta estos tres pasos en el mismo flujo.
5. **Exactitud citable.**
   - Algoritmos de Meeus para luna y sol, y Umm al-Qura.
   - Una línea "Método y precisión" con fuente en cada página de astronomía, química y electricidad, más tests de regresión con los casos de la tabla anterior. Eso da autoridad E-E-A-T frente a calculadoras genéricas.
6. **Planificadores sin perder datos.**
   - Autoguardado local, copia de seguridad JSON/CSV/ICS, impresión limpia y modo "compartir por enlace" codificado en la URL, sin servidor.
   - Es el hueco de Trello gratis: privacidad y cero registro.
7. **Quitar los topes o documentarlos en un solo sitio.** Si el título dice "unlimited", el límite debe ser solo técnico (≥10⁴). Si no, cambiar el título.
8. **Arreglar el caché y el soft 404 antes de corregir fórmulas.** Si no, los arreglos de moon-phase y world-clock no llegarán a quien ya tiene el JS en caché.

**Fuentes de referencia:** las fases lunares de oct-2026 están contrastadas con [calendar-12.com](https://calendar-12.com/moon_phases/2026) y [my-zodiac-ai.com](https://my-zodiac-ai.com/moon-calendar/moon-calendar-october-2026). Umm al-Qura sale de Intl (ICU). Las fórmulas físicas, químicas y eléctricas están comprobadas a mano.
