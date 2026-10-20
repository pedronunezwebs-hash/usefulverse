# UsefulVerse · Caída de Google del 16-oct-2026: causa, solución y prevención

Diagnóstico hecho el 20-oct-2026 con datos reales de Search Console (API + panel), inspección de URLs,
estado en producción e historial del repo `pedronunezwebs-hash/usefulverse`.

---

## 1. Resumen en 30 segundos

- **No es un castigo manual ni un bloqueo técnico.** Acciones manuales: «No se ha detectado ningún problema».
  Robots, canonical, noindex, códigos HTTP y rastreo de Googlebot están bien.
- **Es una desindexación algorítmica por calidad/escala.** El 16-oct Google sacó del índice casi todas las
  páginas que daban impresiones. Las URL que antes rankeaban aparecen ahora como
  **«Rastreada: actualmente sin indexar»**: Google las rastrea, las lee y decide no mostrarlas.
- **Por qué:** en menos de 3 semanas el sitio pasó de **306 URLs (29-sep) a ~25.600 URLs** (10.260 en
  `usefulverse.com` + 15.365 en `tools.usefulverse.com`). Hay 36 idiomas, la mayoría con traducción automática
  (Google Translate, sin revisión nativa), y cientos de calculadoras producidas en serie (programa «Growth600»).
  Ese patrón es exactamente lo que Google define como *scaled content abuse* (contenido a escala con poco
  valor añadido): primero dio visibilidad de prueba y después reclasificó el sitio entero.
- **Solución:** congelar el crecimiento, reducir lo indexable a un núcleo de calidad (noindex + sacar del sitemap
  lo traducido a máquina y lo que no tiene demanda), mejorar ese núcleo y volver a crecer de forma escalonada
  y medida. Recuperar es posible, pero lleva semanas o meses: no hay botón de «reconsideración» porque no hay
  acción manual.

### Decisión del dueño · 20-oct-2026

**El catálogo queda congelado: no se construyen ni publican herramientas nuevas.** Hay 700 herramientas
públicas únicas (277 en `usefulverse.com` y 423 en `tools.usefulverse.com`), y todo el esfuerzo pasa a
**mejorar al máximo la calidad de las que ya existen**. Por eso, en este plan el paso 7 ya no consiste en
«volver a crecer»: consiste en **reactivar en el índice** las herramientas e idiomas que estén en `noindex` a
medida que alcancen el nivel de calidad. Las reglas para los agentes están en `AGENTS.md`, en la raíz del repo.

Propuesta del núcleo inicial, sacada de los datos: `docs/recovery/indexable-core-tools.csv`.
Son **128 herramientas indexables** (98 del dominio principal y 30 del subdominio) y **572 en `noindex`**, hasta
que se mejoren. El criterio: al menos 100 impresiones o 1 clic entre el 1 y el 15-oct.

---

## 2. Qué pasó: los datos

### 2.1 Rendimiento diario (Search Console, toda la propiedad `sc-domain:usefulverse.com`)

| Fecha | Clics | Impresiones | Posición media |
|---|---|---|---|
| 01-oct | 1 | 370 | 47,3 |
| 05-oct | 4 | 3.110 | 24,2 |
| 07-oct | 8 | **4.349** (máximo) | 23,3 |
| 13-oct | 26 | 3.342 | 37,6 |
| 14-oct | 13 | 3.465 | 40,9 |
| 15-oct | 17 | 3.698 | 45,6 |
| **16-oct** | **0** | **55** | 63,5 |
| 17-oct | 0 | 56 | 67,1 |
| 18-oct | 0 | 33 | 66,4 |
| 19-oct | 0 | 14 | 60,4 |

Caída del **98,5 % en un solo día**. No es una bajada gradual de posiciones: es una salida del índice.

Un detalle: aunque las impresiones subían, la **posición media empeoraba desde el 13-oct (37 → 45)**. Era una
señal previa de que Google estaba reevaluando el sitio a la baja.

### 2.2 Qué páginas desaparecieron

- Entre el 10 y el 15-oct, **2.659 URLs distintas** tenían impresiones (1.776 del dominio principal y 883 del
  subdominio `tools.`).
- Entre el 16 y el 19-oct, **el dominio principal tiene 0 páginas con impresiones**. Solo quedan
  restos mínimos del subdominio (1-16 impresiones por página).

### 2.3 Inspección de URLs (API de inspección de Google)

| URL | Estado actual | Último rastreo |
|---|---|---|
| `/pl/tools/drum-machine/` (la que más clics daba) | Rastreada: actualmente sin indexar | 18-oct |
| `/am/tools/roman-numeral-converter/` | Rastreada: actualmente sin indexar | 14-oct |
| `/tools/word-counter/` (inglés) | Rastreada: actualmente sin indexar | 09-oct |
| `tools.…/it/tools/hearts-game/` | Rastreada: actualmente sin indexar | 16-oct |
| `/` (home) y `/es/tools/word-counter/` | Enviada e indexada | 01-08 oct |

En todos los casos: **rastreo correcto, robots permitido, indexación permitida y canonical propio**.
Google acepta técnicamente las páginas y decide no indexarlas. Ese «no» se basa en la calidad, no en un error.

### 2.4 Informe de indexación (panel)

- Indexadas: 7,39 mil (este informe va con varios días de retraso; la caída real aún no se refleja del todo).
- **Descubierta: actualmente sin indexar → 8.749.** Google conoce las URLs y ni siquiera se molesta en rastrearlas.
- **Rastreada: actualmente sin indexar → 530** (y subiendo).

### 2.5 Cómo creció el sitio (historial del repo)

| Fecha | URLs publicadas | Qué se añadió |
|---|---|---|
| 29-sep | 306 | 9 idiomas |
| 01-oct | 1.609 → 2.632 | 28 idiomas; 12 nuevos con Google Translate, sin revisión nativa (`docs/localization-28-rollout.md`) |
| 03-oct | 3.888 | 36 idiomas, 100 herramientas; 8 idiomas más con traducción automática (`docs/seo-growth-implementation-2026-10.md`) |
| 08-11 oct | ~25.600 | Programa **Growth600**: decenas de calculadoras al día (ingeniería, química, finanzas, salud…), cada una publicada en 36 idiomas, más el subdominio nuevo `tools.usefulverse.com` |

Ritmo real: los commits del 9 y el 11-oct publican **una herramienta nueva cada 15-25 minutos**, cada una
multiplicada por 36 idiomas. Son ~900 URLs nuevas al día en un dominio que tenía 3 semanas de vida.

### 2.6 Calidad de lo que veía Google

- 15 días (1-15 oct): **43.726 impresiones y 174 clics → CTR 0,4 %**, posición media 25-45. Google probó el
  sitio y los usuarios casi no hacían clic. Esa es una señal de poco interés.
- Las páginas de herramienta tienen **~350-650 palabras visibles**, y una parte es el menú de 36 idiomas. El texto es
  en su mayoría plantilla traducida a máquina (p. ej. en persa se lee como traducción literal).
- La demanda se concentra en muy pocas herramientas: de 432 con impresiones, **solo 93 tuvieron al menos 1 clic**
  y 72 superaron 100 impresiones. Las que tiraban: date-calculator, time-duration, roman-numeral, barcode,
  fraction, prime-number-checker, percentage, number-to-words, ratio, discount, random-number, average, age…
- El inglés aportaba solo el 18 % de las impresiones, repartidas entre 36 idiomas con señales débiles.
- Detalle de acabado: el título de la home dice «Everyday Online Tools — Free · no limits — **Free** | UsefulVerse»
  («Free» duplicado).

---

## 3. Qué NO es la causa (descartado con pruebas)

| Hipótesis | Veredicto | Prueba |
|---|---|---|
| Acción manual / penalización | **No** | Search Console → Acciones manuales: «No se ha detectado ningún problema» |
| robots.txt bloquea | **No** | `User-agent: * / Allow: /`; la inspección dice `robots ALLOWED` |
| `noindex` o canonical roto | **No** | Las páginas devuelven 200, sin meta robots ni X-Robots-Tag, con canonical propio |
| Cloudflare bloquea a Googlebot | **No** | La inspección muestra `pageFetchState: SUCCESSFUL` el 16 y el 18-oct |
| Un deploy rompió algo el 15-16 oct | **No** | No hay commits entre el 12 y el 17-oct; el primero posterior es del 18-oct |
| Actualización de Google anunciada | **No coincide** | El *September 2026 spam update* terminó el 8-oct; no se había anunciado ninguna actualización para mediados de octubre. La caída es una reevaluación del propio sitio, no un evento general |

---

## 4. La causa, explicada

Google tiene sistemas (SpamBrain y los de calidad/«contenido útil») que evalúan **el sitio en conjunto**, no
solo cada página. Cuando un dominio nuevo publica decenas de miles de páginas en pocos días, casi todas con
la misma plantilla, traducidas a máquina y con poca interacción, la política de spam de Google lo llama
**«abuso de contenido a escala»**. La intención da igual: lo que cuenta es el patrón.

Lo que suele ocurrir, y lo que ocurrió aquí:

1. **Fase de prueba** (1-15 oct): Google indexa y enseña páginas para medir la respuesta → impresiones al alza.
2. **Señales malas**: CTR 0,4 %, posiciones bajas y el volumen de URLs se multiplica por 80 en 2 semanas.
3. **Reclasificación del sitio** (16-oct): retira las páginas del índice («rastreada, sin indexar») y deja de
   rastrear lo nuevo («descubierta, sin indexar» → 8.749).

Como la valoración es del sitio, **también arrastra las páginas buenas** (por ejemplo, el word-counter en inglés).

---

## 5. Solución: plan paso a paso

> Orden obligatorio. No te saltes el paso 1: cada URL nueva que se publique ahora empeora la valoración.

### Paso 1 · Congelar el crecimiento (hoy)

1. Pausar el programa Growth600 y cualquier agente (Codex/ChatGPT/Claude) que publique herramientas o idiomas.
   Dejarlo por escrito en `docs/growth600/PROGRESS.md` y en `AGENTS.md`: **«congelado: no publicar URLs nuevas
   hasta que se cierre el plan de recuperación»**.
2. Detener los avisos automáticos de rastreo (IndexNow, envíos a Naver/Yandex) de URLs nuevas.
3. No borrar nada todavía ni cambiar URLs. Primero se decide qué queda (paso 2).

### Paso 2 · Decidir el núcleo indexable con datos

Objetivo: pasar de ~25.600 URLs indexables a **un núcleo de ~500-1.500** que merezca estar en Google.

**A. Idiomas.** Mantener indexables solo los que tienen **traducción revisada** y demanda demostrada. Propuesta
inicial (impresiones / clics del 1 al 15-oct):

| Mantener indexable | Pasar a `noindex` (la página sigue funcionando para el usuario) |
|---|---|
| en (8.006/10), es (2.928), de (4.500), fr (2.282), pt-br (1.379), ja (2.001), id (1.976), ko (416), hi (93); son los packs con glosario y control de calidad propio | Todos los añadidos con Google Translate sin revisión: los 12 del 01-oct y los 8 del 03-oct (incluidos mr, te, ha, tl, ta, fa, am, gu), más los que no tengan revisión nativa: ar, zh-cn, zh-tw, bn, ru, ur, tr, vi, it, bg, ca, nl, el, ms, pl, sv, th, uk, sw |

Excepción opcional: algún idioma automático con clics reales (th 24, fa 32, uk 11) puede volver al índice **después**,
cuando un nativo revise sus páginas top. Hasta entonces, `noindex`.

**B. Herramientas.** Mantener indexables solo las que tengan:
- impresiones ≥ 100 o al menos 1 clic en el periodo 1-15 oct (son ~72-93 herramientas), **o**
- una demanda clara de búsqueda y contenido propio que no repita otra herramienta.

Las demás pasan a `noindex` (no se borran). Hay que **fusionar** las que respondan a la misma intención. Ojo con
las dos webs: el subdominio `tools.usefulverse.com` duplica la estructura de catálogo del principal y reparte
autoridad. Se recomienda poner todo `tools.` en `noindex` salvo las herramientas con datos y, a medio plazo,
devolver esas pocas al dominio principal con redirección 301.

**Cómo sacar la lista:** usa la consulta del anexo (A1), que exporta por página y herramienta.
Guarda el resultado en `docs/recovery/indexable-core-tools.csv` (url, motivo, decisión).

### Paso 3 · Implementar el `noindex` en el generador (en una rama, con tests)

En el build estático (scripts de `scripts/` y los datos de `src/locales/` y del catálogo):

1. Añadir un campo `indexable: true|false` **por idioma** (en la config del pack) y **por herramienta** (en el catálogo).
   Por defecto, `false` para todo lo nuevo.
2. Para cada página no indexable, el generador debe:
   - emitir `<meta name="robots" content="noindex, follow">`;
   - **quitarla del sitemap**;
   - **quitarla de los `hreflang`** de las páginas indexables. Los hreflang solo deben enlazar versiones
     indexables entre sí; si no, Google recibe 36 alternativas cuando solo 8 valen.
3. Sitemap: dividirlo en un índice de sitemaps (uno por idioma indexable) con `lastmod` real. Hoy es un archivo de
   ~15 MB con 10.260 URLs.
4. Corregir el título duplicado de la home («— Free · no limits — Free»).
5. Tests nuevos (que fallen si se rompe la regla):
   - ninguna URL `noindex` aparece en el sitemap ni en los hreflang;
   - toda URL del sitemap devuelve 200, no lleva `noindex` y tiene canonical propio;
   - **límite de crecimiento**: el número de URLs indexables no puede crecer más de X % respecto a la versión
     publicada sin un flag de aprobación explícito (ver paso 7).
6. Desplegar y verificar en producción (`curl` de una muestra de cada tipo: indexable / noindex).

> **Por qué `noindex` y no borrar (410):** se conserva el tráfico directo y el de otros buscadores, y se puede
> reactivar una página sin perder la URL. Si hay páginas sin ningún valor ni visitas (calculadoras duplicadas),
> sí se pueden devolver como 410 para que Google las suelte antes.

### Paso 4 · Subir la calidad del núcleo (las ~70-90 herramientas con datos, en los idiomas que se queden)

Por cada herramienta del núcleo, empezando por las 20 con más impresiones:

1. **Contenido propio, no plantilla:** explicación de cómo funciona, la fórmula con su fuente, 2-3 ejemplos
   resueltos con números reales, casos de uso y errores frecuentes. Que una persona aprenda algo aunque no use
   la herramienta.
2. **FAQ basada en búsquedas reales** (tus consultas de Search Console: p. ej. «roman numeral calculator 2015 mmxv»,
   «first tuesday of a month», «metronome with decimals»).
3. **Título y meta description** que respondan a la búsqueda concreta y den motivos para el clic. El CTR del
   0,4 % es el síntoma más claro.
4. **Enlazado interno temático:** de cada herramienta a 3-5 relacionadas y a una guía, sin el bloque gigante de
   «todas las herramientas».
5. **Revisión nativa** de cada idioma que se mantenga (como mínimo títulos, descripciones, H1 e intro de las 20 top).
6. Señales de confianza: página «Sobre nosotros», contacto, política de privacidad, quién hay detrás y por qué
   las herramientas son fiables.

### Paso 5 · Avisar a Google del cambio

1. Volver a enviar los sitemaps nuevos (solo URLs indexables) en Search Console y en Bing.
2. Pedir indexación manual («Inspeccionar URL → Solicitar indexación») **solo** para las 10-20 páginas top
   mejoradas. No hagas envíos masivos.
3. No hace falta (ni se puede) pedir reconsideración: no hay acción manual.

### Paso 6 · Medir la recuperación (semanal)

| Indicador | Dónde | Señal buena |
|---|---|---|
| Impresiones diarias | Search Console → Rendimiento | Repunte sostenido |
| «Rastreada: sin indexar» del núcleo | Informe de Páginas | Baja |
| Estado de las 20 URLs top | API de inspección (anexo A2) | Pasan a «Enviada e indexada» |
| CTR y posición del núcleo | Rendimiento, filtrado por página | CTR > 1,5 % y posición en mejora |

Expectativa realista: si el problema es de calidad/escala, la recuperación suele empezar a notarse
**en 4-12 semanas** después de limpiar, y a veces coincide con la siguiente actualización principal de Google.
No hay garantía de volver a 3.000-4.000 impresiones diarias; con un núcleo sano se puede superar después,
pero de forma estable.

### Paso 7 · Reactivar en el índice, con freno (no hay herramientas nuevas)

Decisión del dueño: **no se añaden herramientas**. Solo se devuelven al índice las existentes, y solo cuando el
núcleo esté recuperado (impresiones estables durante 3-4 semanas seguidas):
- Lotes pequeños: como máximo +10-15 % de URLs indexables por semana, empezando en inglés.
- Una herramienta pasa de `noindex` a indexable solo si cumple la puerta de calidad del paso 4 (contenido
  propio, ejemplos, FAQ, título único). Hay que fusionar o retirar las duplicadas en vez de reactivarlas.
- Un idioma en `noindex` solo pasa a indexable tras la revisión nativa de sus páginas top.

---

## 6. Cómo asegurar que no vuelva a pasar

1. **Freno en CI (obligatorio):** el build falla si las URLs indexables crecen más del umbral sin el flag
   `ALLOW_INDEX_GROWTH=<motivo>` aprobado por el dueño. Es la regla que habría frenado Growth600.
2. **Indexable por defecto = no:** toda herramienta o idioma nuevo nace con `noindex` y se promueve a mano.
3. **Prohibido publicar traducción automática sin revisión en URLs indexables.** Puede existir para el usuario,
   pero siempre con `noindex`.
4. **Puerta de calidad por página** (test): mínimo de texto propio fuera de la plantilla, sin frases repetidas
   entre herramientas, título único y sin palabras duplicadas.
5. **Alarma diaria de Search Console** (GitHub Action gratuita o cron con la cuenta de servicio que ya tiene acceso):
   - avisa si las impresiones del día anterior caen más de un 50 % frente a la media de 7 días;
   - avisa si la posición media empeora más de 10 puntos en 5 días (pasó del 13 al 15-oct: era el aviso previo);
   - inspecciona cada semana 20 URLs clave y avisa si alguna pasa a «sin indexar».
6. **Una sola estrategia de dominio:** no abrir subdominios con más catálogo. Todo en `usefulverse.com`.
7. **Reglas para los agentes** en `AGENTS.md` del repo: ningún agente (Codex, ChatGPT, Claude) publica URLs
   indexables nuevas sin pasar el freno de CI y sin aprobación del dueño. Cada lote debe dejar escrito
   cuántas URLs añade.

---

## 7. Checklist de ejecución

- [x] Paso 1 · Catálogo congelado por decisión del dueño (20-oct); reglas en `AGENTS.md` y aviso en `docs/growth600/PROGRESS.md`
- [x] Paso 2 · Propuesta en `docs/recovery/indexable-core-tools.csv`: 128 indexables y 572 en `noindex`. Los idiomas están en la tabla del paso 2. **Pendiente: revisión del dueño antes de implementar el paso 3**
- [ ] Paso 3 · Campo `indexable` + `noindex` + sitemap/hreflang filtrados + tests + título home + despliegue verificado
- [ ] Paso 4 · Top 20 herramientas reescritas con contenido propio y revisión nativa en los idiomas que se mantienen
- [ ] Paso 5 · Sitemaps nuevos enviados a Google y Bing + indexación manual de las 20 top
- [ ] Paso 6 · Seguimiento semanal (anexo A1/A2) anotado en `docs/recovery/seguimiento.md`
- [ ] Paso 7 · Freno de crecimiento en CI activo antes de reanudar cualquier lote
- [ ] Prevención · Alarma diaria de Search Console funcionando

---

## Anexo · Comandos usados para el diagnóstico

Se usa la cuenta de servicio ya configurada en `~/.config/agencia-webs/gsc-service-account.json`
(propietaria de `sc-domain:usefulverse.com`). El token OAuth se genera con JWT firmado con `openssl`.

**A1 · Rendimiento por página (para decidir el núcleo):**
```
POST https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ausefulverse.com/searchAnalytics/query
{"startDate":"2026-10-01","endDate":"2026-10-15","dimensions":["page"],"rowLimit":25000,"dataState":"all"}
```

**A2 · Estado de indexación de una URL:**
```
POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect
{"inspectionUrl":"https://usefulverse.com/tools/word-counter/","siteUrl":"sc-domain:usefulverse.com"}
```

**A3 · Comprobación de producción:** `curl -sI -A "Googlebot" <url>` (código, X-Robots-Tag) y búsqueda de
`<meta name="robots">` y `<link rel="canonical">` en el HTML.

Contexto externo: el *September 2026 spam update* de Google se desplegó del 24-sep al 8-oct
([Search Engine Land](https://searchengineland.com/google-september-2026-spam-update-done-rolling-out-493550),
[Google Search Status](https://status.search.google.com/incidents/XhUDXP7A67iHCD2kmbVu)). No coincide con la
fecha de la caída (16-oct).
