# UsefulVerse · progreso del plan 277 → 600

Última verificación: 2026-10-09. Registro persistente de Growth600; las casillas de producto del plan solo cambian con evidencia de los gates C/F/E/X/L/B/P/S.

## Estado público actual · 2026-10-09

- **134 herramientas Growth600 publicadas** además del catálogo original protegido de 277; todas en 36 locales. El sitemap público de `tools.usefulverse.com` responde HTTP 200 con **4.860 URLs** (134 × 36 + 36 páginas de idioma): **411 herramientas públicas en total** y 15.120 URLs entre los dos sitios. Esto no equivale a que los buscadores hayan indexado cada URL.
- #148 Text to Binary Converter: PR #81 integrada; despliegue principal `37891603568` y despliegue del hub `37892340212` correctos. EN/ES/AR responden HTTP 200.
- #171 Schema Markup Validator, #172 Readability Checker y #173 Savings Goal Calculator ya aparecen en las 36 versiones públicas; verificaciones previas registradas debajo.
- #189 Certificate Decoder: 36 rutas públicas; detalles de pruebas y despliegue anotados abajo.
- #195 JSON↔XML Converter: 36 rutas públicas; PR #83 y publicación del hub verificadas, sitemap público actualizado a 4.428 URLs únicas.
- #215 HAR Viewer: PR #84 integrada en `4e4bab2f2b3a0386c23894b9542fbc091e1ce224`; CI y despliegues principal/hub (run `37899114343`) correctos. EN/AR y sitemap público HTTP 200; **4.464 URLs únicas**, incluidas sus 36 versiones. La herramienta procesa HAR localmente y minimiza valores sensibles; sin PageSpeed/Lighthouse ni afirmación de indexación.
- #223 Robots.txt Tester: PR [#85](https://github.com/pedronunezwebs-hash/usefulverse/pull/85) integrada en `3b9293def8c1cd4577a65d2fb30e9c99a7190e71`; CI `37900570648`, deploy principal `37900951430` y publicación del hub `37900970440` finalizaron correctamente. Rutas EN/AR HTTP 200; sitemap público con 4.500 URLs. Sin afirmación de indexación ni PageSpeed/Lighthouse.
- #235 JSON to Excel: PR [#86](https://github.com/pedronunezwebs-hash/usefulverse/pull/86) integrada en `a92891ad1c8f06be223d6a077e486d41be0d4f97`; CI y deploy principal `37903140579`, publicación del hub `37903965314` completados. EN/AR responden HTTP 200; sitemap verificado con **4.536 URLs únicas**, incluidas las 36 localizaciones. Sin afirmación de indexación ni PageSpeed/Lighthouse.
- #279 CSV Editor: PR [#89](https://github.com/pedronunezwebs-hash/usefulverse/pull/89) integrada en `386092975d0391e5ff70a91553b87716710bf7e5`; CI PR `37910003597`, despliegue principal `37910456234` y publicación del hub `37910981705` correctos. EN responde HTTP 200; sitemap público confirmado con **4.644 URLs únicas** y 36 variantes CSV. Publicación no equivale a indexación.
- #193 pH Calculator: PR #90, merge `24583f8b4af7ac8d8e2c1f2354bfc8fed4f22f2b`; CI PR `37912770314`, deploy principal `37913208934`, publicación del hub `37913602993`. EN/AR HTTP 200; sitemap con **4.680 URLs únicas** y 36 variantes. No equivale a indexación.
- #194 Section Modulus Calculator: PR #91 integrada en `d017bb54cc9bbc22f69bb5f91bc417778214760f`; CI PR `37914418310`, despliegue principal `37914713795` y publicación del hub `37915222949` completados. EN/AR HTTP 200; sitemap público **4.716 URLs únicas**, incluidas sus 36 versiones. No equivale a indexación.
- #197 Frequency & Wavelength Calculator: PR #92 integrada en `31740ff9e4fef3893f7430f0e3dc79cb750e1c84`; CI PR `37917275415`, deploy principal `37917709058` y publicación del hub `37919442515` completados. Suite **1.649/1.649**, `locale:release-check`, `npm run check` (10.260 URLs principales) y build aislado (**4.752 páginas**) pasan. QA Chrome: EN `100 MHz × 300.000.000 m/s → 3 m`; AR RTL a 390 px conserva 390 px de ancho, calcula el mismo resultado y no tiene errores de consola. Rutas EN/AR y sitemap (4.752 URLs) HTTP 200; no equivale a indexación. No se midió PageSpeed/Lighthouse.
- #198 Ideal Gas Law Calculator: PR #93 integrada en `2aca1084e1a0a934ac035af8aad14550e04ea5b6`; CI/deploy y publicación del hub `37920634145` completados. El sitemap público responde HTTP 200 con **4.788 URLs**, sin la ruta Torque. Cuenta como la herramienta #132 de Growth600.
- #201 Torque Calculator: PR #94 integrada en `d2a37fa5d3277bcbb043bc89d491e3037b2230c6`; CI PR `37923822746`, deploy principal `37924248092` y publicación del hub `37924710004` completados. Sitemap HTTP 200 con **4.824 URLs únicas**, exactamente 36 variantes Torque; las 36 rutas responden HTTP 200 y tienen canonical autorreferente. No se afirma indexación ni envío manual a buscadores.
- #203 Beam Deflection Calculator: PR [#95](https://github.com/pedronunezwebs-hash/usefulverse/pull/95) integrada en `d63a3a355d55d48bd5a1968a2a4a6fcf3d95e22f`; CI PR `37927224340`, publicación principal `37927684168` y hub `37928230741` correctas. Suite PR y gates de build/locale/hub pasaron. El hub responde con sitemap HTTP 200 y **4.860 URLs únicas**, incluidas las 36 variantes de Beam Deflection; las 36 rutas retornan HTTP 200 y canonical autorreferente. QA funcional local EN/AR comprobó carga central 1 kN en viga simple de 4 m (0,8333 mm), carga uniforme 1 kN/m (2,0833 mm) y voladizo (13,333 mm), incluido RTL sin overflow ni errores de consola. 36 borradores estáticos de Google Translate, sin traducción en runtime ni revisión nativa. Herramienta educativa Euler–Bernoulli; no certifica ni diseña estructuras. No se midió PageSpeed/Lighthouse ni se afirma indexación.
- `npm run check` conserva **10.260 URLs** del sitio principal. No se mide PageSpeed/Lighthouse.

## Publicada · Beam Deflection Calculator (#203 del plan)

- Implementa cuatro casos clásicos de viga Euler–Bernoulli (viga simplemente apoyada o voladizo; carga puntual o carga uniforme), conversiones explícitas SI/imperiales, deflexión máxima y ubicación, momento máximo, rigidez EI y curva SVG ligera.
- Límites y unidades declarados; solo estimación elástica lineal y pequeñas deflexiones. No calcula resistencia, cortante, pandeo, uniones, combinaciones ni cumplimiento de códigos. Copy advierte que es educativo y no sustituye a una persona ingeniera estructural.
- 36 copias estáticas desde inglés, aceptadas como traducción automática sencilla, sin servicio de traducción en runtime. Símbolos y nombres técnicos ajustados para árabe; no se presentan como revisión nativa.
- Pruebas de lógica focales **5/5**; suite CI completa verde; `npm run locale:release-check`; `npm run check` mantiene **10.260 URLs** principales; build del hub **4.860 páginas** (134 × 36 + 36 páginas de idioma).
- QA local: EN comprobó 0,8333 mm para 4 m/1.000 N/E=200 GPa/I=8.000 mm⁴, más caso uniforme y voladizo; AR RTL calculó igual, mantuvo 390/390 px y consola limpia.
- [x] P/S — PR #95; CI `37927224340`; despliegues `37927684168` (principal) y `37928230741` (hub). Las 36 URL localizadas públicas son HTTP 200 con canonical propio; sitemap contiene **4.860 URL únicas**. Publicación no equivale a indexación; no hubo envío manual a buscadores ni PageSpeed/Lighthouse.
- **Recuento tras publicación:** 134 herramientas Growth600 / 4.860 URLs de hub; 411 herramientas públicas y 15.120 URLs sumando el sitio principal. Las 277 originales quedan intactas.
- **Siguiente candidata:** #205 Led Resistor Calculator; detalles/estado actual en `PLAN-600.md`.

## Publicado · JSON to Excel (#235 del plan)

- Pasa arreglos JSON raíz o arreglos de nivel superior de un objeto a una hoja XLSX; aplana objetos anidados con rutas de encabezado escapadas y conserva arreglos internos como texto JSON. El arreglo nombrado se preselecciona si existe.
- Preserva cadenas numéricas como `001` y exporta valores que parecen fórmulas como cadenas XLSX inertes. Sin servidor, API, fetch, upload, almacenamiento ni fórmulas ejecutables. Límites explícitos: 2 MB, 50.000 valores, profundidad 32, 20.000 filas, 200 columnas, 200.000 celdas, 32.000 caracteres/celda y 12 MiB exportados.
- 36 copias estáticas traducidas desde inglés; no hay llamadas de traducción en el sitio. Suite completa previa a #270 **1.592/1.592**, release check, tests de formulario/catálogo/XLSX/contrato de locales, build principal **10.260 URLs** y build del hub **4.536 páginas** (125 × 36 + 36 portadas; 4.716 archivos) pasan.
- Chrome QA local: EN prueba los tres registros del ejemplo, columnas `id`, `name`, `profile.city` y `amount`; descarga interceptada en memoria como XLSX válido (firma ZIP `PK\x03\x04`, 1.719 bytes), conserva `001` y `=1+1` como texto. AR a 390×844 tiene `lang=ar`, `dir=rtl`, `scrollWidth=390` y cero errores de consola.
- [x] Publicación: PR #86 integrada; workflow principal y publicación del hub correctos; sitemap público contiene 4.536 URLs únicas e incluye las 36 localizaciones. No equivale a indexación; no se midió PageSpeed/Lighthouse.

## Publicada · Binary Files to Base64 & Data URI (#270 del plan)

- Convierte un archivo local de hasta 2 MiB a data URI MIME o Base64 puro; la vista previa se limita a PNG/JPEG/GIF/WebP/BMP/AVIF. MIME provisto por el navegador no valida el formato real; SVG y documentos no se abren en vista previa. Copiar/descargar texto de salida. Sin upload, API ni almacenamiento.
- 36 traducciones estáticas; tests dirigidos 239/239 y suite completa 1.599/1.599; `locale:release-check` pasa. `npm run check`: 10.260 URLs; hub: 4.572 páginas (126 × 36 + 36 portadas).
- Chrome: PNG creado en memoria, vista previa 2×1 válida y roundtrip de bytes exacto; modo Base64 omite solo el prefijo data URI. Sobre el límite, aviso localizado y no codifica. Árabe en móvil de 390 px, RTL sin overflow; consola sin errores.
- [x] P/S: PR #87 integrada en `a048d6c3294a3a88f01c4701006bd2fa871b656b`; CI y deploy principal `37904982465` correctos; publicación del hub `37905658056` completada. URL EN/AR HTTP 200; sitemap público con **4.572 entradas únicas** y 36 rutas de la herramienta. No se afirma indexación ni se ejecutó PageSpeed/Lighthouse.

## Publicada · JSON Model Generator (#273) · 2026-10-09

- Genera borradores TypeScript, C# y Java localmente desde JSON; infiere opcionales, null, arrays, objetos anidados y uniones. Limita entrada a 500 KB, 30.000 nodos, profundidad 24 y muestreo de 300 elementos por array. Trata raíces escalares y arrays de primitivos mediante wrappers; nombres y propiedades normalizados para evitar colisiones. Java usa nombres completos `java.util.List` sin declaraciones import dentro del módulo.
- 36 copias estáticas desde inglés. Se corrigieron manualmente cadenas árabes evidentes que Google Translate había convertido en falsos amigos; no se presentan como revisión nativa. No hay traducción en runtime.
- Tests focalizados **246/246**; suite completa **1.610/1.610**; `npm run locale:release-check` pasa; `npm run check` conserva **10.260 URLs principales**; build del hub **4.608 páginas** (127 × 36 + 36 portadas; 4.791 archivos, 138.454.969 bytes).
- [x] PR #88 integrada en `708905c9`; CI y deploy principal `37907098650` correctos; publicación del hub `37907444978`. 36 variantes públicas, EN/AR HTTP 200 y sitemap con 4.608 URLs únicas. No PageSpeed/Lighthouse ni afirmación de indexación.

## Publicado · CSV Editor (#279)

- Editor estático en navegador: detecta coma, punto y coma, tabulador o barra vertical; soporta BOM, comillas escapadas, CRLF y saltos de línea en celdas, repara filas desiguales con celdas vacías y deja elegir si la primera fila es encabezado.
- Edición acotada de celdas/encabezados, validación opcional de texto/número/fecha ISO/booleano sin transformar datos, búsqueda, 25 filas por página, añadir/eliminar filas y columnas, undo/redo de 50 pasos y exportación UTF-8 con delimitador elegido y BOM opcional. Máximo 5 MiB, 5.000 filas de datos, 80 columnas, 80.000 celdas y 20.000 caracteres/celda.
- 36 traducciones estáticas generadas desde inglés con el traductor web gratuito; no hay traducción en runtime ni revisión nativa. Títulos y descripciones dentro de límites; se corrigieron términos ambiguos en chino, japonés y ruso y títulos truncados en alemán, búlgaro, griego, ucraniano y filipino.
- Tests focales 252/252 y suite previa 1.624/1.624; PR #89, CI PR `37910003597`, despliegue principal `37910456234` y publicación del hub `37910981705` completados. La URL pública responde HTTP 200 y el sitemap tiene 4.644 URLs únicas. Chrome: CSV entrecomillado/multilínea editado y exportado correctamente; validación de tipos sin alterar datos; búsqueda, filas/columnas, undo/redo confirmados. Sin peticiones externas; árabe RTL 390×844 sin overflow ni avisos de consola. No equivale a indexación; no se midió PageSpeed/Lighthouse.

## Publicada · pH Calculator (#193) · 2026-10-09

- 4 modelos locales: ácido/base fuerte y ácido/base monoprótico débil; concentración H⁺/OH⁻, pH, pOH y porcentaje estimado de ionización. Equilibrio débil resuelto numéricamente incluyendo autoionización del agua; a 25 °C. Expone que es una estimación ideal basada en concentraciones/actividades y no una medición ni consejo técnico.
- 36 traducciones estáticas; `pH` y `pOH` se conservan como símbolos universales tras corregir traducciones ambiguas. Títulos ≤60 y descripciones ≤160 caracteres; traducción automática sencilla, no revisión nativa.
- Lógica específica 6/6; suite completa **1.633/1.633** en el PR; `locale:release-check` pasa; `npm run check` mantiene las 10.260 URLs principales; build aislado de Growth600: **4.680 páginas** (129 × 36 + 36 portadas).
- Chrome EN: ejemplo [H⁺]=1e−7 → pH/pOH 7; modelo débil Ka=1e−5 a 0,1 mol/L → pH 3,00217; formulario muestra/oculta Ka según el modelo. Chrome AR en móvil 390×844: etiquetas pH/pOH diferenciadas, `dir=rtl`, ancho 390/390, sin errores de consola ni peticiones externas.
- [x] P/S — PR #90, CI PR `37912770314`, merge `24583f8b4af7ac8d8e2c1f2354bfc8fed4f22f2b`, deploy principal `37913208934` y publicación hub `37913602993`. EN/AR HTTP 200; sitemap público **4.680 URLs únicas**, incluidas sus 36 versiones. Publicación no es indexación. No PageSpeed/Lighthouse.

## Publicada · Section Modulus Calculator (#194)

- Motor local para rectángulo, círculo, rectángulo hueco centrado, tubo circular y triángulo isósceles; reporta área, centroide, Ix/Iy y módulos Zx superior/inferior y Zy en la unidad elegida. Aclara que no calcula cargas, tensiones, pandeo ni seguridad estructural.
- 36 traducciones estáticas generadas con traductor web gratuito; se corrigió manualmente terminología técnica árabe. Títulos ≤60 y descripciones ≤160 caracteres; traducción sencilla, no revisión nativa ni servicio de traducción en runtime.
- Lógica 5/5; controlador/formulario/catálogo/localización integrados; suite completa **1.641/1.641**, `locale:release-check` y `git diff --check` pasan; `npm run check`: **10.260 URLs** principales; build aislado **4.716 páginas** (130 × 36 + 36 portadas).
- Chrome EN: cuadrado 10×10 mm → Ix=Iy=833,333333 mm⁴ y Zx/Zy=166,666667 mm³. Triángulo 6×3 mm → centroide y=1 mm, Ix=4,5 mm⁴, Zx superior/inferior=2,25/4,5 mm³. Chrome AR en móvil 390×844: `dir=rtl`, sin desbordamiento, errores de consola ni solicitudes externas.
- [x] P/S — PR #91 integrada en `d017bb54cc9bbc22f69bb5f91bc417778214760f`; CI PR `37914418310`, deploy principal `37914713795` y publicación hub `37915222949`. Rutas EN/AR HTTP 200; sitemap público **4.716 URLs únicas** con las 36 variantes. No implica indexación. No PageSpeed/Lighthouse.

## Publicada · Frequency & Wavelength Calculator (#197) · 2026-10-09

- Resuelve exactamente uno de frecuencia, longitud de onda o velocidad con `v = f × λ`; frecuencias Hz–THz, longitudes nm–km, velocidades m/s y km/s; permite luz en vacío/aire/agua/vidrio como aproximación o velocidad personalizada para sonido y otros medios. Límites numéricos, unidades, valores positivos y entradas exactamente completas validados. No es diseño de antenas ni herramienta de análisis de señal/seguridad.
- Cálculo local sin API, dependencias ni procesamiento de servidor. Copy estático Google Translate en 36 idiomas; títulos ≤60 y descripciones ≤160, marca `UsefulVerse` preservada. Sin traducción en tiempo de ejecución ni revisión nativa.
- Pruebas focales **255/255**; suite completa **1.649/1.649**; `npm run locale:release-check` pasa; `npm run check` conserva las **10.260 URLs principales**; build aislado Growth600 **4.752 páginas** (131 × 36 + 36 portadas).
- Chrome EN: 100 MHz y 300.000.000 m/s calcula 3 m; expone fórmula y tres valores. Chrome AR a 390×844: `lang=ar`, `dir=rtl`, ancho 390/390, cálculo correcto y consola sin errores.
- [x] P/S — PR #92 integrada en `31740ff9e4fef3893f7430f0e3dc79cb750e1c84`; CI PR `37917275415`, deploy principal `37917709058`, publicación del hub `37919442515`. Rutas EN/AR HTTP 200; sitemap público **4.752 URLs únicas** con las 36 variantes. No implica indexación. No PageSpeed/Lighthouse.

## Publicada · Ideal Gas Law Calculator (#198)

- Resuelve exactamente una incógnita de `PV = nRT` con R SI; convierte presión (Pa, kPa, MPa, bar, atm, torr, psi), volumen (m³, L, mL, ft³), cantidad (mol, mmol, kmol) y temperatura (K/°C). Unidades físicas equivalentes se convierten sin cambiar el estado calculado; exige presión absoluta y exactamente un campo vacío.
- Rechaza entradas no positivas, temperatura bajo cero absoluto, cero kelvin, infinitos y resultados fuera de límites. Presenta sustitución y resultado en unidades elegidas; revela que la ley de gas ideal es aproximada y no sirve para diseñar/validar la seguridad de recipientes o procesos. Cálculo en navegador, sin API, upload ni dependencias.
- 36 copias estáticas simples basadas en inglés (Google Translate web); títulos ≤60, descripciones ≤160 y marca UsefulVerse conservada. No hay traducción en runtime ni revisión nativa.
- Suite completa **1.658/1.658** y focal **258/258**; `locale:release-check` y `npm run check` (10.260 URLs principales) pasan. Build aislado: **4.788 páginas** (132 × 36 + 36 portadas).
- QA Chrome EN: ejemplo a 1 atm, 1 mol y 273,15 K calcula ~22,41397 L; al cambiar atm→kPa conserva la equivalencia. Temperatura −273,15 °C rechazada. AR `lang=ar`, RTL en móvil 390×844 sin overflow y el cálculo coincide.
- [x] P/S: PR #93 integrada; el workflow principal y publicación del hub `37920634145` finalizaron correctamente. La ruta y el sitemap público confirman 4.788 URLs únicas. No equivale a indexación; no PageSpeed/Lighthouse.

## Publicada · Torque Calculator (#201) · 2026-10-09

- Demanda ya investigada: `torque calculator`, 2.400 búsquedas/mes US/en, KD 6; sin nueva consulta ni gasto DataForSEO. Intención diferenciada del cálculo de fuerza y del horsepower (potencia de eje).
- Calcula torque, o despeja fuerza/brazo, con fuerza, brazo perpendicular/ángulo, dirección horaria/antihoraria y cinco unidades para fuerza/distancia/torque; muestra componentes, fórmula y croquis. Rechaza valores incompletos/incompatibles y casos geométricos degenerados; el aviso delimita expresamente uso ideal/no estructural.
- Toda la operación se realiza localmente. No se añadieron APIs, costes de runtime ni dependencias nuevas. Hay 36 copias estáticas; traducción automática básica y correcciones manuales visibles en español, sin revisión nativa.
- Calidad de metadata verificada por build para 36 idiomas: título ≤60, descripción ≤160 y `UsefulVerse` conservado. Se evitó repetir exactamente la FAQ principal en las adicionales.
- Suite global **1.668/1.668** antes de añadir una aserción focal de etiquetas ES; suite de formularios actual **69/69**, catálogo/locales/build específicos pasan. `npm run locale:release-check` pasa. `npm run check` conserva las **10.260 URLs** del dominio principal. Build aislado: **4.824 páginas** (133 × 36 + 36 portadas; 5.014 archivos; 144.605.995 bytes).
- QA Chrome local ES y AR: 10 N × 2 m a 90° da **20 N·m** antihorario, fórmula/componentes presentes. AR `lang=ar`, `dir=rtl`, no overflow en el viewport revisado ni errores de consola. No equivale a verificar todo idioma/dispositivo.
- P/S completados: PR #94 integrada; CI PR `37923822746`, deploy principal `37924248092` y publicación del hub `37924710004`. Sitemap público HTTP 200 con 4.824 URLs únicas, incluidas las 36 variantes. Las 36 rutas responden HTTP 200 y su canonical coincide con la URL propia. Publicar no equivale a indexación; no se enviaron solicitudes manuales a paneles de buscadores. No PageSpeed/Lighthouse.
- **Recuento tras Torque:** 133 herramientas Growth600 y 410 públicas en total; el sitemap del hub contiene 4.824 URLs (más las 10.260 del dominio principal, 15.084 combinadas).

## En implementación local · Beam Deflection Calculator (#203)

- Demanda ya investigada: `beam deflection calculator`, 1.000 búsquedas/mes US/en, KD 0; sin nueva consulta DataForSEO.
- Cálculo de flecha máxima, ubicación, momento flector y curva para cuatro casos clásicos: viga simplemente apoyada o en voladizo, con carga puntual central/extremo o carga uniformemente distribuida. Conversión SI/imperial explícita. Alcance Euler–Bernoulli de pequeñas deflexiones y advertencia visible: solo educativo; no sirve para dimensionar, aprobar ni certificar estructuras.
- Cálculo estático local, sin APIs, dependencias nuevas ni procesamiento de servidor. Google Translate gratuito se usa solo al generar los borradores locales: las 36 traducciones quedan estáticas y el sitio no consulta al traductor. Se corrigieron en árabe nombres de unidades y términos de ingeniería mal interpretados.
- [x] F/X — 5 pruebas de fórmula, unidades, validación y límites; la suite global **1.677/1.677** pasa. Pruebas dirigidas recientes **153/153**; `npm run locale:release-check` pasa; `npm run check` mantiene las **10.260 URLs principales**. Build local del hub: **4.860 páginas** (134 × 36 + 36 portadas), 5.051 archivos, 145.697.596 bytes; sitemap con 4.860 URLs únicas y 36 rutas beam con canonical propio.
- [x] L/B local — metadata dentro del límite (título ≤60; descripción ≤160) en 36 idiomas. Chrome EN: ejemplo 4 m / 1.000 N / E=200 GPa / I=8×10⁻⁶ m⁴ da 0,00083333 m de flecha máxima, 2 m de ubicación y 1.000 N·m. También comprobadas carga uniforme 1 kN/m (0,00208333 m) y voladizo con carga terminal (0,01333333 m). Chrome AR: mismas cifras, copia de resultados disponible y unidades mixtas legibles en RTL. No se revisó individualmente cada idioma ni dispositivo; no PageSpeed/Lighthouse.
- P/S pendientes hasta PR, CI, merge, deploy principal/hub y verificación de las 36 rutas públicas. No se afirma indexación.

## Herramientas verificadas en despliegue anterior · #171–#173

- [x] #171 Schema Markup Validator — 36 rutas del sitemap; EN/AR HTTP 200. Una muestra JSON-LD se informó sintácticamente válida, con una entidad tipada y cero advertencias; AR `dir=rtl`, 390 px sin desbordamiento ni avisos de consola.
- [x] #172 Readability Checker — 36 rutas; ejemplo EN devuelve Flesch 80,9 y métricas de palabras/frases sin error; AR `dir=rtl`, 390 px sin desbordamiento ni errores de consola.
- [x] #173 Savings Goal Calculator — 36 rutas; ejemplo de 1.200 en 12 meses al 0 % devuelve 100/mes; AR `dir=rtl`, 390 px sin desbordamiento ni errores de consola.
- No se midió PageSpeed/Lighthouse ni se afirma indexación individual.

## Publicada · Certificate Decoder (#189) · 2026-10-09

- [x] C/F — ficha preinvestigada: `certificate decoder`, 2.900 búsquedas/mes US/en, KD 29; secundaria `pem certificate decoder`, 90/mes, KD 16. Sin nuevas consultas ni gasto DataForSEO.
- [x] E/B — decodifica X.509 PEM/base64 DER o archivos PEM/CER/CRT/DER localmente (máximo 1 MiB): subject, issuer, serial, validez, SAN y huella SHA-256. Aviso claro: no valida firma, confianza, hostname ni revocación. Sin servidor, API, dependencias en runtime, red ni almacenamiento.
- [x] L — traducción estática automatizada desde inglés en 36 idiomas con el traductor gratuito; borrador sencillo, no revisión nativa. Excluye el fixture PEM del traductor.
- [x] X — 5 tests de parser; suite global **1.553/1.553**; build Growth600 **4.392 páginas** (121 × 36 + 36 portadas), 4.566 archivos, 131.225.163 bytes; `npm run check` mantiene **10.260 URLs** del sitio principal y el release check de idiomas pasa.
- [x] B — Chrome AR a 390×844: fixture decodificado con CN, serial, fechas, SAN y SHA-256; `dir=rtl`, ancho 390/390 antes y después, menú de idioma abierto íntegramente dentro del viewport y cerrado sin desbordamiento; cero errores de consola. Se corrigieron el menú RTL y el wrap de huellas largas. No se probaron todos los dispositivos/idiomas.
- [x] P/S — PR, CI y despliegue registrados en el cierre de GitHub; sitemap público con **4.392 URLs únicas**, 36 rutas del decodificador. No se afirma indexación ni envío manual a buscadores.
- **Recuento:** 121 herramientas Growth600 publicadas / 4.392 URLs de hub; las 277 originales intactas.

## Publicada · JSON Diff (#117) · 2026-10-09

- [x] C/F — reutiliza la ficha ya investigada: `json diff`, 8.100 búsquedas/mes US/en, KD 14; secundaria `json compare online`, 2.900. Sin DataForSEO nuevo.
- [x] E — comparación semántica (no diff de líneas), orden de claves de objetos ignorado, arrays por posición o propiedad única, resumen de altas/bajas/cambios y patch JSON descargable/copiable. #117 es distinta del comparador textual existente y del formateador JSON.
- [x] B — parseo local, límite de 200.000 caracteres/documento, 20.000 nodos, profundidad 64 y 500 cambios; JSON Pointer escapa `~` y `/`; resultados insertados con `textContent`. El patch sigue índices de array incluso al comparar visualmente por ID, advertido en UI. Sin API, dependencia, servidor ni subidas.
- [x] L — copy y metadata estáticos disponibles en los 36 idiomas, generados con Google Translate; traducción automática básica, no revisión nativa. Copy inglés y tres FAQs específicos.
- [x] X — pruebas específicas **91/91**; suite completa **1.537/1.537**; `npm run check` conserva **10.260 URLs** principales y `npm run locale:release-check` pasa. Build aislado: **4.320 páginas** (119 × 36 + 36 portadas), 4.492 archivos, 129.087.882 bytes.
- [x] B — Chrome EN con comparación de arrays por ID; Chrome AR a 390×844: ejemplo con cambios/altas y patch, `lang=ar`, `dir=rtl`, ancho 390/390, cero avisos/errores. No se probó cada idioma/dispositivo. Sin PageSpeed/Lighthouse.
- [x] P/S — PR #80 integrada como `a5623dff218c56d78e893e87f89e4a7f2ab098ce`; CI PR `37890180221`, deploy principal `37890504845` y deploy separado del hub `37890916012`, todos exitosos. Rutas EN/AR y sitemap HTTP 200; **4.320 URLs únicas**, 36 variantes JSON Diff. No se afirma indexación ni envío manual.
- **Recuento publicado en ese despliegue:** 119 herramientas Growth600 / 4.320 URLs de hub, incluido #323; las 277 originales intactas.
- **Siguiente candidata en ese momento:** #148 Text to Binary Converter (publicada después; ver estado actual arriba).

## Publicada · Text to Binary Converter (#148) · 2026-10-09

- [x] C/F — ficha existente del plan: `binary to text converter`, 5.400 búsquedas/mes US/en, KD 38; secundaria `text to binary converter`, 1.900. Sin consultas nuevas ni coste DataForSEO.
- [x] E/B — conversión texto↔bytes UTF-8 reales, con agrupación opcional y exportación local; conserva Unicode, BOM y saltos. Rechaza bits incompletos, UTF-8 inválido y entradas excesivas. `TextEncoder`/`TextDecoder` nativos; sin dependencia, red, servidor ni carga de archivos.
- [x] L — copy y metadata traducidos estáticamente a los 36 idiomas con el flujo automático de Google Translate aceptado por el propietario; borrador comprensible, no revisión nativa.
- [x] X — pruebas focales **91/91**; suite global rerun **1.545/1.545**; `npm run check` conserva **10.260 URLs** principales; `npm run locale:release-check` pasa. Build separado: **4.356 páginas** (120 × 36 + 36 portadas), 4.529 archivos, 130.181.912 bytes. Controlador: 3.336 bytes.
- [x] B — Chrome EN codifica y decodifica `ñ 👋` en UTF-8; rechaza byte inválido. Árabe `lang=ar`, `dir=rtl`, viewport 390×844 sin overflow ni mensajes de consola. No se midió PageSpeed/Lighthouse ni se probaron todos los navegadores/idiomas individualmente.
- [x] P/S — PR #81 integrada; despliegue principal `37891603568` y hub `37892340212` correctos. Sitemap público verificado: **4.356 URLs únicas**, 36 variantes de Text to Binary; EN/ES/AR HTTP 200. No se afirma indexación ni envío manual a buscadores.
- **Recuento tras esta publicación:** 120 herramientas Growth600 / 4.356 URLs.
- **Siguiente candidata nueva pendiente:** #189 Certificate Decoder; #171–#173 ya estaban publicadas y se documentan arriba.

## Publicada · Chinese Remainder Theorem Calculator (#323) · 2026-10-09

- [x] C/F — Ficha del plan: `crt calculator`, 260 búsquedas/mes US/en, KD 0; secundaria `chinese remainder theorem calculator`, 140/mes. Sin nuevas consultas a DataForSEO.
- [x] E/B — Solucionador CRT con `BigInt` exacto para 2–20 congruencias, incluido el caso no coprimo compatible; detecta incompatibilidad con gcd y diferencia, normaliza soluciones negativas y muestra la clase y módulo combinado. Entrada de pares o notación `x ≡ a (mod m)`, límites explícitos ±10¹², dígitos árabes/persas, ejemplo, copiar y reset. Sin APIs, dependencias, red, persistencia ni envío de entradas.
- [x] L — 36 traducciones estáticas desde inglés generadas con Google Translate, aceptadas como traducción automática sencilla y no revisión nativa. Ajustado a mano el copy técnico árabe después de encontrar una traducción errónea de “least nonnegative”; no hay traducción en runtime.
- [x] X — Suite completa **1.527/1.527**; `npm run check` mantiene las 10.260 URLs del sitio principal; `npm run locale:release-check` pasa. Build del hub: **4.284 páginas** (118 × 36 + 36 portadas), 4.455 archivos, 127.998.781 bytes. Sin PageSpeed/Lighthouse.
- [x] B — Chrome a 390×844: `x ≡ 2 (mod 3)` y `x ≡ 3 (mod 5)` → `x ≡ 8 (mod 15)`; árabe acepta dígitos arábigo-índicos, `lang=ar`, `dir=rtl`, ancho 390/390 y consola limpia. No se probó cada idioma/dispositivo.
- [x] P/S — PR #79 integrada como `0182616563777929c6ce09125e3cc4b86eacefa4`; CI `37889002769`, deploy principal `37889311273`, deploy del hub `37889323303`, todos exitosos. URLs EN/AR y sitemap HTTP 200; 4.284 URLs únicas y 36 variantes CRT. No se afirma indexación ni envío manual.
- **Recuento publicado:** 118 herramientas Growth600 / 4.284 URLs de hub; las 277 originales intactas.

## Publicada · Wilcoxon Signed Rank Test Calculator (#316) · 2026-10-09

- [x] C/F — Candidata medida en el plan: `wilcoxon signed rank test calculator`, 320 búsquedas/mes US/en, KD 0. Sin nuevas consultas a DataForSEO.
- [x] E/B — Diferencias pareadas después−antes; ceros omitidos; rangos medios en empates; sumas positiva/negativa; p bilateral exacta hasta 25 pares no nulos y aproximación normal bilateral con corrección de continuidad para muestras mayores. Caso todo-cero con explicación y sin p inventado. Tabla y CSV local; máximo 500 pares y magnitud ≤10¹², con supuestos/limitaciones explícitos.
- [x] L — 36 traducciones estáticas de Google Translate; borrador automático aceptado, no revisión nativa. Etiquetas del método y copia árabe corregidas; sin traducción en runtime.
- [x] X — Suite completa **1.517/1.517**; pruebas focales lógica/controlador/formulario/catálogo/contratos **218/218**. `npm run check` conserva **10.260 URLs** principales; `npm run locale:release-check` pasa. Hub: **4.248 rutas** (117 × 36 + 36 portadas), 4.418 archivos, 126.972.687 bytes. Sin cambios de CSS global: reutiliza la tabla existente y respeta el presupuesto de 24 KiB.
- [x] B — Chrome local a 390×844: ejemplo calcula p=0,4375 y muestra sumas, 1 cero, 2 grupos empatados y CSV. Caso todo-cero anuncia estado y no muestra p. Árabe `lang=ar`, `dir=rtl`, ancho del documento 390/390 sin overflow, tabla desplazable internamente y consola limpia. Sin PageSpeed/Lighthouse.
- [x] P/S — PR #78 integrada como `8e7759e61de569fb2013a8b5751d5c13a69b2762`; CI PR `37887628046`, deploy principal `37888013549` y publicación del hub `37888370863`, todos exitosos. Rutas EN/AR y sitemap público HTTP 200; **4.248 URLs únicas**, 36 variantes Wilcoxon.
- **Estado publicado:** 117 herramientas Growth600 adicionales; las 277 originales siguen intactas. No se afirma indexación ni envío manual a buscadores.

## Publicada · Spearman Correlation Calculator (#309) · 2026-10-09

- [x] P/S — PR #77 integrada como `1b66000e55efccffb44b588dd4437b4ab1acf55a`; CI PR `37886315394`, deploy principal `37886610317`, despliegue del hub `37887070482`. URL pública EN y sitemap HTTP 200; sitemap con **4.212 URLs únicas** y 36 variantes Spearman. No se declara indexación ni se envió solicitud manual. Sin PageSpeed/Lighthouse.
- **Estado publicado:** 116 herramientas Growth600 adicionales; las 277 originales siguen intactas.

## Publicada · Singular Value Decomposition Calculator (#306) · 2026-10-09

- [x] C/F — Ficha ya medida: `svd calculator`, 390 búsquedas/mes US/en, KD 2; secundaria `singular value decomposition calculator`, 110/mes, KD 3. Sin nuevas llamadas ni coste de DataForSEO.
- [x] E/B — SVD local de matrices rectangulares 2×2–8×8: U, Σ, Vᵀ, valores singulares, rango numérico con tolerancia explícita, reconstrucción y residuos. Entrada numérica acotada, sin `eval`, API, carga de archivos o persistencia; CSV generado en el dispositivo.
- [x] L — 36 copias estáticas traducidas con Google Translate desde inglés; traducción automática aceptada, no revisión nativa. Se conservan símbolos matemáticos y se corrigió manualmente el copy árabe.
- [x] X — Tests completos y suites específicas aprobados en CI; `npm run check` conserva las 10.260 URLs principales, `locale:release-check` pasa y el hub genera **4.176 páginas** (115 × 36 + 36 portadas), 4.344 archivos, 124.858.548 bytes. Bundle del controlador: 7.584 bytes.
- [x] B — Barridos numéricos 2×2–8×8; error relativo máximo 6,33e-12 y error de ortogonalidad 2,66e-15. Chrome móvil EN/AR: diagonal 3,2 devuelve valores singulares 3 y 2, error de reconstrucción cero; dígitos árabes, RTL, sin overflow ni errores de consola.
- [x] P/S — PR #76 integrada en `e645cbf020f79540f9f2cd344c2324e1ca3a95eb`; CI PR `37884506038`, deploy principal `37884830082` y publicación del hub `37885059577`, todos exitosos. Rutas EN/AR HTTP 200; sitemap público HTTP 200 con **4.176 URLs únicas** y 36 rutas SVD. No se afirma indexación ni se envió indexación manual.
- **Estado publicado:** 115 herramientas Growth600 adicionales; las 277 originales permanecen intactas. Sin PageSpeed/Lighthouse.
- **Siguiente herramienta:** #309 Spearman Correlation Calculator. Sin consultas nuevas a DataForSEO ni cambios a las 277 originales.

## En implementación local · Spearman Correlation Calculator (#309) · 2026-10-09

- [x] C/F — Ficha del plan: `spearman correlation calculator`, 390 búsquedas/mes US/en, KD 5; secundaria `rank correlation calculator`, 10/mes. No se repitió investigación ni se hicieron llamadas a DataForSEO.
- [x] E/B — Implementación local con rangos promedio para empates, Spearman rho como correlación de rangos, diagrama SVG accesible de rangos, tabla inspeccionable y exportación CSV. 2–500 pares con límites numéricos explícitos; no calcula p-value ni intervalo de confianza, no interpreta causalidad y rechaza series constantes. Entradas permanecen en el navegador.
- [x] L — 36 copias estáticas traducidas desde inglés con Google Translate, aceptadas como traducción automática sencilla y no revisión nativa. Se corrigieron manualmente etiquetas de tabla/campo árabes que eran confusas; no hay traducción en runtime.
- [x] X — Suites específicas (85/85), suite completa (1.509/1.509), `npm run check` conserva 10.260 URLs del sitio principal, `locale:release-check` pasa. Build hub: 4.212 páginas (116 × 36 + 36 portadas), 4.381 archivos. Sin PageSpeed/Lighthouse.
- [x] B — Chrome local EN/AR a 390 px sobre el build final: ejemplo creciente produce rho=1, cinco puntos SVG y tabla; la etiqueta del gráfico es accesible. Árabe `lang=ar`/`dir=rtl`, sin desbordamiento (390/390 px) y consola sin mensajes; botón de borrar localizado.
- Bundle del controlador aislado: **6.298 bytes** (límite 24 KiB), sin red, `eval` ni almacenamiento.
- [ ] P/S — PR, integración, deploy y verificación pública/sitemap pendientes; no se afirma indexación.
- **Siguiente herramienta del plan:** #316 Wilcoxon Signed Rank Test Calculator, tras cerrar todos los gates de #309.

## Publicada · Investment Allocation Calculator (#301) · 2026-10-09

- [x] C/F — Ficha ya medida del plan: `portfolio allocation calculator`, 390 búsquedas/mes US/en, KD 0; secundaria `investment allocation calculator`, 20/mes, KD 0. CPC 6.10 USD (no CPM); sin nuevas llamadas ni gasto de DataForSEO.
- [x] E/B — Cálculo local para 2–8 activos, pesos objetivo que suman 100%, valor meta, reparto opcional de aportación y diferencia meta−actual. Validación estricta de cantidades/moneda y límites; no recomienda inversiones, predice rendimientos, calcula impuestos/comisiones ni emite instrucciones de compraventa. Sin red, cuenta, almacenamiento o servidor.
- [x] L — 36 traducciones estáticas generadas desde inglés con Google Translate. Metadatos dentro de los límites y Arabic UI revisada/corregida manualmente tras hallar traducciones literales confusas. Traducción automática aceptada, no revisión nativa ni servicio de runtime.
- [x] X — Suite completa **1.473/1.473**; `npm run check` conserva 10.260 URLs del sitio principal; `npm run locale:release-check` pasa. Build del hub: **4.068 rutas únicas** (112 × 36 + 36 portadas), 4.233 archivos, 121.935.907 bytes. Presupuesto conjunto CSS respetado al minificar en build con `csso`; sin cambiar hojas fuente.
- [x] B — Chrome local EN y AR: ejemplo 6.000 + 4.000 = 10.000, objetivos 6.000/4.000; estado anunciado. Árabe RTL verificado; tabla desplazable dentro del panel a 390 px, sin overflow del documento. Consola limpia y solo peticiones same-origin.
- [x] P/S — PR #73 integrada; CI principal `37873877741` y publicación del hub `37874322931` correctos. EN/AR HTTP 200; sitemap público HTTP 200 con **4.068 URLs únicas** (112 × 36 + 36 portadas). No se solicitó indexación manual ni se afirma que las páginas estén indexadas.
- **Estado publicado:** 112 herramientas Growth600 adicionales; las 277 originales siguen intactas. Sin PageSpeed/Lighthouse.

## Publicada · Repeating Decimal to Fraction Calculator (#302) · 2026-10-09

- [x] C/F — ficha reutilizada del plan: `repeating decimal to fraction calculator`, 390 búsquedas/mes US/en, KD 0; sin nueva consulta ni coste de DataForSEO.
- [x] E/B — acepta `0.(3)`, `0.1(6)`, `1.2(34)`, enteros con signo y hasta 18 cifras periódicas; usa `BigInt`, reduce exactamente y muestra la resta algebraica. Incluye número mixto, ejemplo, copiar, reset y manejo de límites/errores. Distingue explícitamente decimales periódicos de los finitos de `fraction-calculator`; sin API, upload, persistencia ni servicio de ejecución.
- [x] L — 36 copias estáticas traducidas por Google desde el inglés, aceptadas como traducción automática sencilla, no revisión nativa. Se normalizó la puntuación de los ejemplos para que coincida con el parser; se corrigieron títulos y etiquetas de reset de varios idiomas y el copy árabe principal. Sin traducción en runtime.
- [x] X — **1.484/1.484 pruebas globales**; locale contract **134/134**, suite funcional específica **7/7**, `npm run locale:release-check` aprobado; `npm run check` preserva 10.260 URLs del sitio principal. Build Growth600 final: **4.104 URLs** (113 × 36 + 36 portadas), 4.270 archivos y 122.866.350 bytes.
- [x] B — Bundle de controlador **3.191 bytes**. Chrome local EN: `1.2(34)` → `611/495`, forma mixta y demostración correctas; `0.1(6)` → `1/6`. AR acepta `٠.(٣)` → `1/3`; RTL a ancho mínimo reportado de 500 px sin overflow, consola limpia y solo solicitudes same-origin.
- [x] P/S — PR #74 integrada como `3e8430a59917a62ee4a95e65e9e63d25b53bda76`; CI de PR `37875365357` y publicación del hub `37875699978` correctos. Rutas EN/AR HTTP 200; sitemap público HTTP 200 con **4.104 URLs únicas** (113 × 36 + 36 portadas), confirmado también desde la URL de despliegue de Pages. No se envió indexación manual ni se afirma que estén indexadas.
- **Estado publicado:** 113 herramientas Growth600 adicionales; las 277 originales siguen intactas. Sin PageSpeed/Lighthouse.

## Publicada · Parametric Equation Calculator (#303) · 2026-10-09

- [x] C/F — Ficha existente del plan: `parametric graphing calculator`, 390 búsquedas/mes US/en, KD 0; secundaria `parametric equation calculator`, 260/mes, KD 14. Sin nuevas llamadas ni gasto de DataForSEO.
- [x] E/B — Gráfica local de x(t), y(t), con intervalo creciente y muestreo acotado 50–1.500; parser matemático de gramática limitada (sin `eval`) para aritmética, pi/e y funciones reales documentadas. Maneja singularidades como muestras inválidas, grafica con SVG accesible, incluye círculo unitario y descarga coordenadas válidas t/x/y como CSV. Distingue curvas paramétricas de y=f(x); no afirma prueba simbólica ni detecta asintotas con certeza. Sin red, API, cuenta ni persistencia.
- [x] L — 36 copias estáticas generadas por lotes con Google Translate desde inglés; aceptadas como borradores comprensibles, no revisión nativa. Se mantuvieron los identificadores/formato matemático, se corrigió el bloque árabe y los límites de metadatos; ninguna traducción ocurre en producción.
- [x] X — Pruebas específicas de lógica/parser/controlador, catálogo, formularios y build; suite completa **1.492/1.492**. `npm run check` conserva las **10.260 URLs** del sitio principal; `npm run locale:release-check` pasa. Build Growth600 aislado: **4.140 rutas** (114 × 36 + 36 portadas), 4.307 archivos, 123.874.280 bytes.
- [x] B — Chrome local EN a 390 px: círculo unitario, 360 muestras y CSV con 361 filas (encabezado + 360 puntos); entrada de código arbitrario rechazada y resultado anterior despejado. AR RTL: expresiones con dígitos árabes aceptadas, resultado 50/50, `lang=ar`/`dir=rtl`, sin desbordamiento a 390 px; consola limpia en comprobación final. Solo peticiones same-origin. No PageSpeed/Lighthouse.
- [x] P/S — PR #75 fusionada como `b600c31750fa0fe4f922298b39701c559c7595c2`; CI de PR `37876147758` y despliegue principal `37876183625` correctos. Publicación manual del hub `37876549373` correcta. Rutas EN/AR y sitemap públicos HTTP 200; sitemap con **4.140 URLs únicas** (114 × 36 + 36 portadas). No se afirma indexación.
- **Estado publicado:** 114 herramientas Growth600 adicionales; las 277 originales siguen intactas. Sin PageSpeed/Lighthouse.
- **Siguiente herramienta del plan:** #306 Singular Value Decomposition Calculator. No repetir DataForSEO ni tocar las 277 originales.

## Publicada · Fourier Series Calculator (#293) · 2026-10-09

- [x] C/F — Reutilizada la ficha del plan: `fourier series calculator`, 480 búsquedas/mes US/en, KD 0; `fourier coefficients calculator`, 480/mes, KD 0. Sin consultas nuevas a DataForSEO ni gasto de API.
- [x] E/B — Calculadora local de coeficientes reales de Fourier a partir de 4–128 muestras numéricas uniformes de un periodo; límite armónico inferior al Nyquist, componente DC, coeficientes seno/coseno, amplitud/fase, reconstrucción y error RMS sobre muestras. No acepta archivos de audio, no analiza espectros, no integra expresiones simbólicas ni sube datos. Gráfica SVG accesible.
- [x] X lógica/integración — pruebas específicas de lógica, formulario, catálogo, controlador y render pasan; regresión completa **1.447/1.447**. `npm run locale:release-check` pasa para las 20 lenguas expandidas; contrato del tool y auditoría del módulo confirman 36 copias, fórmula matemática idéntica, FAQs 3/idioma y metadata dentro de 60/160 caracteres.
- [x] B — controlador aislado minificado **7.365 bytes**, bajo el presupuesto de 24 KiB; guard de build acepta sin red ni código dinámico.
- [x] L — 36 copias estáticas derivadas del inglés con traducción automática Google solicitada/autorizada; metadatos saneados, fórmula inmutable y nombres/campos/mensajes/FAQs traducidos. Aceptada como traducción automática, no revisión nativa; sin traductor en producción.
- [x] X/B local — `npm run check` conserva 10.260 URLs del sitio principal; build Growth600 genera **3.960 rutas únicas** (109 herramientas × 36 + 36 portadas; 4.122 archivos, 118.764.343 bytes). Chrome EN/AR: coeficientes de seno conocidos, DC constante, caso no constante con cero armónicos, entrada inválida limpia resultados; dígitos árabes funcionan, RTL sin overflow y consola limpia. Sin peticiones de terceros; carga solo HTML/CSS/JS/favicons del build. No PageSpeed/Lighthouse.
- [x] P/S — PR #70 integrada en `69c50b13b7af7682940be358d75dce19fb07f69b`; pipeline principal `37867472931` y publicación del hub `37867798312` correctos. Rutas EN/AR HTTP 200; sitemap público HTTP 200 con **3.960 URLs únicas** (109 × 36 + 36 portadas). No se envió indexación manual ni se afirma indexación.
- **Estado publicado:** 109 herramientas adicionales; las 277 originales permanecen intactas. No PageSpeed/Lighthouse.

## Publicada · Modular Inverse Calculator (#299) · 2026-10-09

- [x] C/F — Ficha ya medida del plan: `modular inverse calculator`, 480 búsquedas/mes US/en, KD 11; `multiplicative inverse modulo calculator`, 480/mes, KD 11. Sin nuevas llamadas ni gasto DataForSEO.
- [x] E/B — Inverso multiplicativo con enteros firmados, normalización de residuo, existencia por mcd, coeficientes de Bézout y pasos del algoritmo de Euclides; cálculo y verificación en navegador con `BigInt`, sin API, cuenta, red ni subida. Límites absolutos de 10¹²; el módulo debe ser ≥2. Diferencia explícita frente a calculadora de resto.
- [x] L — 36 traducciones estáticas de Google desde inglés, aceptadas como borradores automáticos sencillos, no revisión nativa. Notación matemática idéntica y no traducida; explicación localizada. Títulos/descripciones dentro de límites. Se corrigieron a mano el español técnico incorrecto en el término de fórmula compartido y la etiqueta árabe del módulo.
- [x] X — Pruebas específicas de lógica/controlador, contrato de 36 locales, build y formularios; `npm run locale:release-check` pasa. `npm run check` conserva las **10.260 URLs** del sitio principal. Suite completa **1.456/1.456**. Build local del hub: **3.996 rutas** (110 × 36 + 36 portadas; 4.159 archivos, 119.670.862 bytes). Sin PageSpeed/Lighthouse.
- [x] B — Chrome EN: 3 mod 7 → inverso 5, identidad de Bézout y pasos Euclidianos; −3 mod 7 → 2; 6 mod 9 indica que no hay inverso. Chrome AR RTL: dígitos arábigos ٣ y ٧ → ٥; texto correcto, sin desbordamiento a viewport medible de 500 px ni consola. Sin red de terceros.
- [x] P/S — PR #71 integrada como `d2e86473078c03f4b40a6ed1839a7a023b256aed`; CI `37869480634`, publicación principal `37869993966` y publicación del hub `37870639147` correctas. EN/AR HTTP 200; sitemap público con 3.996 URLs únicas, 36 de Modular Inverse. No se envió indexación manual ni se afirma indexación.
- **Estado publicado:** 110 herramientas Growth600 adicionales; las 277 originales permanecen intactas. No PageSpeed/Lighthouse.
- **Siguiente candidata:** #300 A/B Test Calculator. Sin PageSpeed/Lighthouse ni nueva investigación de DataForSEO.

## Publicada · A/B Test Calculator (#300) · 2026-10-09

- [x] C/F — Ficha existente: `a b test calculator`, 480 búsquedas/mes US/en, KD 55; CPC 27,22 USD (no CPM). Secundaria `ab testing significance calculator`, 50/mes, KD 0. Sin llamadas adicionales a DataForSEO.
- [x] E/B — Comparación local de dos grupos independientes con conteos de visitas y conversiones, tasas, diferencia absoluta en puntos porcentuales, lift relativo, IC Wilson por grupo, IC Newcombe de diferencia y prueba z bilateral agrupada aproximada (α=.05). Incluye limitaciones: independencia, consultas repetidas, comparaciones múltiples, exposición desigual/cluster y ausencia de atribución causal. Sin red, API, cuenta ni subida.
- [x] L — 36 copias estáticas de Google Translate desde inglés; traducción automática sencilla, no revisión nativa. Títulos reparados dentro de 60 caracteres; nombres A/B y notación estadística coherentes. Sin traducción online.
- [x] X — Lógica/controlador/formulario/localización/build; suite completa **1.464/1.464**, `npm run check` conserva 10.260 URLs del sitio principal y `npm run locale:release-check` pasa. Build del hub: 4.032 rutas (111 × 36 + 36 portadas), 4.196 archivos, 120.681.277 bytes. No PageSpeed/Lighthouse.
- [x] B — Chrome EN/AR: 500/30 vs 500/40 da 6%, 8%, +2 pp y p≈0,2152 (inconcluso); entrada inválida 501/500 informa error y limpia resultado anterior; RTL a 500 px, consola limpia y sin peticiones externas.
- [x] P/S — PR #72 integrada como `c249372ff8344dcaac0fed4bc000b02e1f65543c`; CI PR `37871295972`, despliegue principal `37871634054` y publicación del hub `37872370399` completados. EN/ES/AR HTTP 200; sitemap público con 4.032 URLs únicas y las 36 variantes de A/B. No se envió indexación manual ni se afirma indexación.
- **Estado publicado:** 111 herramientas adicionales en el hub; las 277 originales permanecen intactas. No PageSpeed/Lighthouse.
- **Siguiente candidata:** #301 Investment Allocation Calculator; no rehacer DataForSEO.

## Publicada · 555 Timer Calculator (#292) · 2026-10-09

- [x] C/F — Ficha reutilizada del plan: `555 timer calculator`, 590 búsquedas/mes US/en, KD 23; `555 astable calculator`, 140/mes, KD 17; CPC 0,14 USD (no CPM). No se hicieron llamadas adicionales a DataForSEO.
- [x] E/B — Cálculo local del 555 astable (frecuencia, período, tiempos alto/bajo, ciclo de forma de onda y fracción de descarga) y monoestable (pulso ≈1,1RC), unidades de resistencias/capacitancia, ejemplos y aviso sobre la variación del circuito real. Distingue temporizador electrónico de `online-timer`; sin API, servidor, archivos ni coste por uso.
- [x] L — 36 copias estáticas basadas en inglés y traducción Google automática. Fórmulas matemáticas idénticas; las etiquetas del modo/ciclo y el aviso de frecuencia están localizados. Títulos ≤60 y descripciones ≤160, sin saltos de línea. Traducción automática, no revisión nativa.
- [x] X — Lógica: 5 pruebas específicas; gates focales de catálogo/formulario/build/locales **200/200**; `npm test` **1.438/1.438**, `npm run locale:release-check` y `npm run check` pasan. El sitio principal conserva 10.260 URLs; el build Growth600 genera **3.924 páginas** (108 × 36 + 36 portadas; 4.085 archivos; 117.681.050 bytes).
- [x] B — Chrome local EN y AR: ejemplo astable 10 kΩ/10 kΩ/10 μF → 4,810005 Hz, 207,9 ms, tiempos 138,6/69,3 ms y duty 66,6667%; ejemplo monoestable 100 kΩ/10 μF → 1,1 s. A 10 pF, 4,810005 MHz; el aviso >100 kHz aparece en EN/AR. Árabe RTL a 390 px sin overflow; sin errores/avisos de consola ni peticiones de terceros.
- [x] P/S — PR #69 integrada en `92a9553079e019c26d9250bf1636415f2f9b0a1e`; pipeline principal `37865313492` y publicación del hub `37866007189` terminaron correctamente. Rutas EN/AR HTTP 200; sitemap público HTTP 200 con **3.924 URLs únicas**, incluidas las 36 variantes de 555. Sin envío manual ni afirmación de indexación.
- **No PageSpeed/Lighthouse.**

## Publicada · Body Water Calculator (#291) · 2026-10-09

- [x] C/F — Reutilizada la ficha del inventario: `body water calculator`, 590 búsquedas/mes US/en, KD 6; `total body water calculator`, 590/mes, KD 0. CPC no se reporta como CPM; sin nueva llamada a DataForSEO.
- [x] E/B — Estimación adulta local usando ecuaciones Watson (1980), entradas métricas/imperiales; muestra litros y fracción aproximada de masa corporal. No mide hidratación, no ofrece consumo recomendado ni uso clínico; rangos explícitos y limitaciones visibles.
- [x] L — 36 traducciones estáticas desde inglés. Títulos reconstruidos desde nombres traducidos, ≤60 caracteres; descripciones ≤160. Se detectó y eliminó un marcador de traducción filtrado y se fijaron sin traducir los coeficientes para preservar la ecuación exacta. Borradores automáticos, no revisión nativa.
- [x] X — Lógica y validación focal **70/70**; regresión `npm test` **1.432/1.432**; `npm run locale:release-check`, `npm run check` y `git diff --check` pasan. La web principal conserva **10.260 URLs**. Build del hub **3.888 URLs únicas** (107 × 36 + 36 portadas), 4.048 archivos y 116.607.832 bytes.
- [x] B — Chrome EN/AR: 30 años, 175 cm, 70 kg → 41,92 L y 59,89%; unidades imperiales equivalentes producen el mismo valor; dígitos árabes parseados, edad 17 invalida y elimina resultado obsoleto; RTL a 390 px sin overflow, consola limpia. La carga del hub no incorpora traducción online.
- [x] P/S — PR [#68](https://github.com/pedronunezwebs-hash/usefulverse/pull/68) fusionada en `8ffc4dd9f896139e8bb1d07f15a16dd6708a8a25`; pipeline principal **37863855116** y publicación del hub **37864335180** correctos. URLs EN/AR HTTP 200. Sitemap público: **3.888 URLs únicas**, con las 36 variantes de Body Water. No se envió una solicitud manual a buscadores ni se afirma indexación. No PageSpeed/Lighthouse.
- **Siguiente candidata:** #293 Fourier Series Calculator. No PageSpeed/Lighthouse ni nueva investigación de DataForSEO.

## Publicada · Capacitor Calculator (#290) · 2026-10-09

- [x] C/F — Reutilizada la ficha ya contrastada: `capacitor calculator`, 590 búsquedas/mes US/en, KD 2; `capacitor series parallel calculator`, 110/mes, KD 0. CPC registrado de 4,29 USD; no es CPM. Sin nuevas llamadas ni gasto de DataForSEO.
- [x] E — Separación de intención: red de capacitores, capacitancia equivalente, carga/energía ideal; distinta de la red de resistencias existente. No se altera el catálogo original de 277.
- [x] B — Implementación local: conexión serie/paralelo, 1–20 entradas en una unidad compartida y tensión opcional para carga/energía y valores por capacitor. Prueba de aceptación: 2 × 100 μF en paralelo → 200 μF; a 5 V → 1 mC y 0,0025 J.
- [x] L — 36 copias estáticas generadas; títulos claros y bajo 60 caracteres, con UsefulVerse intacto. Corregí etiquetas de carga eléctrica y conexiones serie/paralelo en los 36 idiomas tras detectar traducciones ambiguas. Traducción automática revisada en términos técnicos clave; no equivale a revisión nativa.
- [x] X — Lógica 19/19 en pruebas focalizadas; suite completa **1.427/1.427**; `locale:release-check`, `npm run check` y `git diff --check` pasan. Original conserva **10.260 URLs**. Build hub **3.852 páginas** (106 × 36 + 36 portadas), 4.011 archivos, 115.623.399 bytes. Bundle de herramienta 5.382 bytes.
- [x] B — Chrome: EN/AR/RU en build estático; árabe RTL y números arábigos locales funcionan. Caso paralelo 2×100 μF a 5 V → 200 μF, 1 mC, 2,5 mJ y 5 V por componente; serie 100/200 μF a 12 V → 66,666667 μF, 800 μC, 4,8 mJ y 8/4 V. Entrada inválida oculta resultado anterior; reset limpia. A 390 px CSS (Chrome reportó 500 px de viewport) sin overflow; consola limpia; carga solo HTML, CSS, bundle local y favicon. Sin PageSpeed/Lighthouse.
- [x] P/S — PR #67 fusionada; CI run `37862013320`, despliegue principal `37862359298` y del hub `37862369399` correctos. EN y AR responden HTTP 200; sitemap del hub tiene 3.852 URLs únicas, 36 de Capacitor.
- **Estado:** publicada en 36 locales; publicar no confirma indexación y no se envió petición manual a buscadores. No PageSpeed/Lighthouse.

## Publicada · Hijri Calendar Converter (#289) · 2026-10-09

- [x] C/F — Se reutilizó la ficha ya investigada: `hijri calendar converter`, 590 búsquedas/mes US/en, KD 0; sin llamada nueva ni gasto de DataForSEO.
- [x] E/B — Conversor local bidireccional entre gregoriano e Hijri con calendario civil tabular fijo de 30 años; valida límites y fechas imposibles. Declara que no es Umm al-Qura ni un cálculo por avistamiento y que no es guía religiosa.
- [x] L — 36 copias estáticas traducidas desde inglés con el flujo aprobado; sin traducción en producción. Los textos informan el método y sus límites; no son revisión nativa.
- [x] X — Suite completa **1.420/1.420**; `locale:release-check`, `npm run check` y `git diff --check` pasan. La web original sigue en **10.260 URLs**. Build aislado actualizado: **3.816 URLs** (105 herramientas × 36 idiomas + 36 portadas; 3.974 archivos).
- [x] B — Chrome EN y AR real: 11 Mar 2024 ↔ 1 Ramadan 1445; fecha imposible rechazada; RTL en 390 px sin overflow ni errores de consola. Se quitó “AH” de la salida para evitar mezcla innecesaria en árabe. No PageSpeed/Lighthouse.
- [x] P/S — PR [#66](https://github.com/pedronunezwebs-hash/usefulverse/pull/66), CI run `37860169696`, merge commit `42dfa253d0c1acf34ab4a9c7a1e814e52941c2e4`, deploy del sitio principal run `37860417059` y del hub run `37860750067` completados. EN y AR responden HTTP 200; sitemap del hub tiene **3.816 URLs únicas**, 36 de Hijri. No se envió indexación manual ni se afirma indexación.
- **Estado publicado:** 105 candidatas Growth600 en el hub; originales 277 intactas. La siguiente ficha en progreso es #290 Capacitor Calculator. No PageSpeed/Lighthouse.

## Publicada · Thermal Expansion Calculator (#288) · 2026-10-09

- [x] C/F/E/X/L/B — Validación documentada en el cambio anterior; datos ya medidos y traducciones estáticas en los 36 idiomas.
- [x] P/S — Merge commit `4d999e338d76e924485b18606cbe75813c85167e`; despliegue principal run `37858771766` y publicación del hub run `37859095394` completados correctamente. Rutas EN y AR HTTP 200; título inglés correcto; el sitemap separado anuncia **3.780 URLs** (104 herramientas × 36 locales + 36 portadas). El sitemap principal sigue separado.
- **Estado publicado:** 104 candidatas Growth600; luego se añadió #289 Hijri Calendar Converter (105 en total). Publicación no equivale a indexación; no se envió solicitud manual a buscadores. No PageSpeed/Lighthouse.

## Publicada · Friction Calculator (#287) · 2026-10-09

- [x] C/F — Se reutilizó la ficha del plan: `friction calculator`, 590 búsquedas/mes US/en, KD 0; `friction force calculator`, 590/mes. Sin nuevas consultas ni gasto de DataForSEO.
- [x] E/B — Calculadora local de fricción de Coulomb en modo de fuerza normal conocida o masa en plano inclinado; μs/μk, fuerza adicional con signo, estado de movimiento, fuerzas y aceleración. Explica supuestos y límites; no ofrece consejo de ingeniería ni elige coeficientes seguros.
- [x] L — Copias estáticas en los 36 idiomas activos, generadas con el flujo Google Translate aceptado por el propietario. Títulos/descripciones y contrato de locales pasan los gates; no se presentan como revisión nativa. Corregí manualmente en árabe la fuerza normal, el estado de reposo y las etiquetas SI tras ver la página real; la notación μs/μk rusa también está preservada.
- [x] X/E — Suite focalizada **196/196** y suite completa **1.406/1.406** aprobadas; `locale:release-check` pasa; `npm run check` mantiene las **10.260 URLs** del sitio principal. Build aislado: **3.744 páginas** para 103 herramientas × 36 idiomas, más 36 portadas (3.900 archivos).
- [x] B — Chrome árabe RTL real: modo de ejemplo en plano inclinado, 10 kg y 30° → normal 84,928 N, gravedad tangencial 49,033 N, fricción cinética 25,478 N, fuerza neta 23,555 N y aceleración 2,355 m/s²; etiquetas/unidades coherentes, sin overflow a ancho móvil de prueba ni errores de consola. No PageSpeed/Lighthouse.
- [x] P/S — PR [#64](https://github.com/pedronunezwebs-hash/usefulverse/pull/64) fusionada como `743039f`; CI y despliegues de UsefulVerse y el hub terminaron correctamente (runs 37856830249 y 37856839303). Las rutas EN y AR responden HTTP 200; sitemap público del hub: 3.744 URLs. No se envió solicitud de indexación manual; publicado no equivale a indexado.
- **Estado publicado:** 103/323 candidatas Growth600; 220 pendientes. Las 277 herramientas originales permanecen intactas. La siguiente candidata en trabajo es #288 Thermal Expansion Calculator.

## Publicada · Polygon Calculator (#285; candidata 102/323) · 2026-10-09

- [x] C/F — Reutilizada la medición existente del plan: `polygon calculator` y `regular polygon calculator`, 590 búsquedas/mes US/en cada una, KD 0; sin llamadas nuevas a DataForSEO.
- [x] E/B — Cálculo geométrico local para 4–1.000 lados; permite entrada por lado, distancia centro-lado o centro-vértice; deriva perímetro, área y ángulos; se excluyen triángulos para no competir con `triangle-calculator`.
- [x] L — 36 borradores estáticos traducidos desde inglés; términos especializados descritos en lenguaje simple; título y descripción revisados por gates automáticos. Traducción automática, no revisión nativa.
- [x] E/X — 5 pruebas de matemática y gates de catálogo, formularios, bundle y localización; suite focal 193/193, suite general 1.398/1.398, `npm run locale:release-check` pasa y `npm run check` conserva las 10.260 URLs de la web principal. Build aislado: 3.708 URLs (102 herramientas × 36 idiomas + 36 portadas).
- [x] B — Chrome EN y AR: hexágono de lado 1 cm devuelve perímetro 6 cm, área 2,59807621 cm², apotema 0,8660254 cm y ángulos 120°/60°; árabe comprobado a 500 px sin overflow ni errores de consola. Sin PageSpeed/Lighthouse.
- [x] P/S — PR [#63](https://github.com/pedronunezwebs-hash/usefulverse/pull/63) fusionada como `22a36c5`; el CI y el despliegue aislado del hub (run 37854181493) finalizaron correctamente. Ruta pública HTTP 200; sitemap del hub contiene 3.708 URLs y el principal conserva 10.260. No se envió solicitud de indexación manual; publicado no equivale a indexado. No PageSpeed/Lighthouse.
- **Estado publicado:** 102/323 candidatas Growth600; 221 pendientes. Las 277 herramientas originales permanecen intactas. La siguiente candidata de esta continuación es #287 Friction Calculator; #286 Heat Pump Calculator está registrada aparte en este plan.

## Publicada · Roth Vs Traditional Calculator (#284; candidata 101/323) · 2026-10-09

- [x] C/F — Reutilizados los datos ya medidos en el plan: `roth ira vs traditional ira calculator` 590 búsquedas/mes US/en, KD 0; `roth vs traditional calculator` 320/mes, KD 5. CPC 2.61 USD (no CPM); sin llamadas nuevas ni gasto de DataForSEO.
- [x] E/B — Comparación matemática local sobre el mismo presupuesto bruto anual; aportaciones al final del año; tasas actual/futura, rentabilidad y horizonte configurables. Muestra saldo Roth tras la tasa actual asumida y tradicional antes/después de tasa futura; límites explícitos, fuente informativa del IRS y aviso de que no es asesoramiento ni aplica reglas de elegibilidad/límites/deducciones.
- [x] L — 36 copias estáticas traducidas desde inglés con el flujo Google Translate ya autorizado; títulos ≤60 y descripciones ≤160; la nota árabe fue corregida manualmente para evitar traducir “rates” como precios. Traducción automática, no revisión nativa.
- [x] E/X — 5 pruebas de lógica más catálogo/formulario/locales/build; suite focal 189/189; `npm test` 1.390/1.390; `npm run check` conserva 10.260 URLs originales; `npm run locale:release-check` pasa. Build aislado del hub: 3.672 páginas (101 candidatas × 36 idiomas + 36 portadas).
- [x] B — Chrome EN y AR RTL: cálculo igual con tasas iguales, validación de cambios, resultado/status se ocultan al editar; árabe a 500 px sin desbordamiento; consola limpia, solo HTML/CSS/JS/favicon locales. No se ejecutó PageSpeed/Lighthouse.
- [x] P/S — PR [#62](https://github.com/pedronunezwebs-hash/usefulverse/pull/62) fusionada en `0e781e5`; validación PR 37851536013 y publicación principal/hub 37851994699 correctas. EN/ES/AR HTTP 200; sitemap del hub 3.672 URLs y sitemap principal 10.260. No se envió manualmente en Search Console ni se comprobó indexación. No PageSpeed/Lighthouse.
- **Estado publicado:** 101/323 candidatas Growth600; 222 pendientes. Las 277 herramientas originales siguen intactas. Siguiente candidata: #285 Polygon Calculator.

## Publicada · Font Pairing Tool (#283; candidata 100/323) · 2026-10-09

- [x] C/F — Reutilizada la ficha: `font pair generator` 720 búsquedas/mes US/en, KD 37; `font pairing tool` 90/mes, KD 24. CPC 4.74 USD (no CPM). Sin gasto/llamadas nuevas a DataForSEO.
- [x] E/B — Presets de tipografía, vista previa de jerarquía heading/body, tamaños/pesos/leading, intercambio y CSS exportable. Stacks del sistema; opción de elegir archivos locales hasta 8, 5 MiB por archivo/15 MiB total. Sin catálogo remoto, fuentes externas, upload al servidor, API o worker. Licencias de archivos fuera del alcance.
- [x] L — Copia estática traducida desde inglés mediante el flujo Google Translate ya autorizado, 36 locales; títulos/descripciones bajo 60/160 caracteres y sin cortes dentro de palabras. Traducción automática, no revisión nativa.
- [x] E/X — Lógica/catálogo/formulario 57/57; build/locale/bundler focal 128/128; suite global 1.382/1.382; `locale:release-check` pasa; guard de bundle y `git diff --check` limpios. El sitio principal mantiene 10.260 URLs. Build aislado del hub: 3.636 URLs (100 × 36 + 36 portadas).
- [x] B — Chrome EN y AR RTL: seis presets, swap y reset; sin overflow, errores visibles ni peticiones remotas. En la carga inicial solo se pidieron HTML/CSS/JS/favicon locales. El control de archivos no permitió subir una fuente real por la restricción de acceso a archivos del navegador; sus límites/formato sí pasan unit tests. No PageSpeed/Lighthouse.
- [x] P/S — PR [#61](https://github.com/pedronunezwebs-hash/usefulverse/pull/61) fusionada en `636e134c860f019a169ca13cf230691a5fd23476`; validación PR 37849556075, deploy principal 37849893982 y publicación separada del hub 37850612894 correctos. Rutas públicas EN/ES/AR HTTP 200; el sitemap del hub devuelve 3.636 URLs y 36 variantes de la herramienta; el sitemap principal conserva 10.260. No se ejecutó PageSpeed/Lighthouse. Search Console no se pudo abrir en la sesión autenticada disponible; no afirmar envío manual ni indexación.
- **Estado publicado:** 100/323 candidatas Growth600; 223 pendientes. Las 277 herramientas originales no se modificaron. Siguiente candidata: #284 Roth vs Traditional Calculator.

## Publicada · OpenAPI Editor (#282; 99.ª herramienta Growth600) · 2026-10-09

- [x] C/F — Reutilizada la evidencia de la ficha: `swagger editor online` 720 búsquedas/mes US/en, KD 32; `openapi editor` 390/mes, KD 41. CPC 8,70 USD (no CPM); sin llamadas nuevas a DataForSEO.
- [x] E/B — Editor local OpenAPI 3.0/3.1 JSON/YAML con formato, importación local hasta 300 KB, preview de operaciones, lint estructural acotado, referencias JSON Pointer locales y rechazo de `$ref` remoto. No ejecuta endpoints, no baja referencias externas y no promete conformidad completa del estándar.
- [x] L — 36 páginas estáticas con metadatos, FAQ, canonical y `hreflang`. Copia traducida desde inglés con Google Translate como borrador comprensible autorizado para publicar; no se presenta como revisión nativa. Títulos conservan `UsefulVerse` una sola vez y el contrato limita título/description.
- [x] E/X — 8 tests específicos; suite focal 63/63; `npm test` 1.377/1.377; `npm run check` conserva 10.260 URLs principales; `locale:release-check` pasa. Build aislado: 3.600 URLs (99 × 36 + 36 portadas).
- [x] B — Parser `js-yaml` 4.3.2 MIT (43.8 KB minificado) como archivo estático del mismo origen, se carga solo al usar YAML; licencia incluida. JSON no lo descarga. Chrome local: YAML de ejemplo aprobado, JSON parseado, `$ref` remoto rechazado, texto de contrato renderizado con `textContent`, AR RTL/zh-TW sin overflow y consola limpia. No se ejecutó PageSpeed/Lighthouse.
- [x] P/S — PR [#60](https://github.com/pedronunezwebs-hash/usefulverse/pull/60) fusionada en `e2b8963353e3c1b544add93ca6d86c988a41d344`; CI/deploy principal 37846520218 y publicación del hub 37846877937 correctos. Se verificaron las 36 rutas HTTP 200, sus metadatos/canonical/hreflang y los assets/license HTTP 200. Sitemap público: 3.600 URLs únicas. Publicar no garantiza indexación.
- **Estado:** 99/323 candidatas principales; 224 pendientes. Las 277 herramientas originales no se modificaron. Siguiente ficha: #283 Font Pairing Tool.

## Publicada · Decibel Calculator (#281; 98.ª herramienta Growth600) · 2026-10-09

- [x] C/F — Reutilizada la ficha del plan: `decibel calculator` 720 búsquedas/mes US/en, KD 19; `db calculator` 480/mes, KD 3. CPC 1,25 USD (no CPM). Sin consultas nuevas a DataForSEO.
- [x] E/B — Calcula dB↔ratios de potencia/amplitud, suma 2–20 niveles incoherentes con suma logarítmica estable y aplica ganancia/atenuación. Límites finitos explícitos. No afirma medir SPL, calibrar micrófono ni reproducir audio; la relación de amplitud presupone igual impedancia y la suma, fuentes no correlacionadas.
- [x] L — 36 páginas estáticas; textos traducidos automáticamente desde inglés como borradores comprensibles, con restablecer revisado para evitar falsos sentidos, etiquetas técnicas y supuestos explícitos. Títulos y descripciones pasan el contrato; `hreflang` y canonicals generados por la plantilla.
- [x] E/X — 40 pruebas específicas de lógica, más contrato de catálogo/formulario/locales; `npm test` pasa 1.367/1.367, `locale:release-check` pasa y `npm run check` conserva las 10.260 URLs del sitio principal.
- [x] B — Build aislado del hub: 3.564 páginas/URLs (98 herramientas × 36 locales + 36 portadas), 3.713 archivos y 107.612.103 bytes. Chrome local en español y árabe: cálculos de ejemplo, selector de modo, reset, textos, dirección RTL y ancho móvil correctos; sin desbordamiento horizontal ni errores/avisos de consola. No se ejecutó PageSpeed/Lighthouse.
- [x] P/S — PR [#58](https://github.com/pedronunezwebs-hash/usefulverse/pull/58) fusionada en `bde5565790889c0d7512abb69d37d233fd87f672`; validación PR 37842387921 y despliegue principal 37842817210 correctos; publicación separada del hub 37843288478 correcta. Se comprobó HTTP 200 en las 36 rutas; inglés/español LTR y árabe RTL.
- [x] Sitemap público del hub: **3.564 `<loc>` únicas**, incluidas 36 versiones de Decibel Calculator; sitemap principal aún contiene 10.260. La publicación y el envío del sitemap no garantizan indexación.
- **Estado publicado:** 98/323 candidatas Growth600; 225 pendientes. El catálogo original de 277 herramientas sigue intacto. Próxima candidata: #282 OpenAPI Editor.

## Publicada · Chess Opening Trainer (#280; 97.ª herramienta Growth600) · 2026-10-09

- [x] C/F — Ficha existente del plan: `chess openings practice` 720 búsquedas/mes US/en, KD 17; `chess opening trainer` 390/mes, KD 25. CPC 0,99 USD (no CPM); sin DataForSEO nuevo.
- [x] E/B/L/X/P/S — Trainer de diez líneas de apertura, movimientos legales y feedback, traducido en 36 locales. PR [#57](https://github.com/pedronunezwebs-hash/usefulverse/pull/57), despliegue principal 37839908944 y publicación del hub 37840590010 correctos; 3.528 URLs únicas en el sitemap del hub. EN/ES LTR, AR RTL. Véanse sus pruebas y alcance en el registro de Chess del plan.

## Publicada · Hashi Puzzle (#260; 96.ª herramienta Growth600) · 2026-10-09

- [x] C/F — Reutilizada la ficha del plan: `hashi puzzle` 1.000 búsquedas/mes US/en, KD 31; `bridges puzzle online` 10/mes, KD 17. Sin consulta nueva a DataForSEO.
- [x] E/B — Puzzle de islas conectadas por puentes sencillos o dobles, con grados exactos, comprobación de cruces/conectividad, pista, deshacer, borrar y niveles. Generación y juego local; no duplica Kakuro ni Futoshiki.
- [x] L — 36 páginas estáticas con metadatos, FAQ, hreflang y copy localizado; títulos y descripciones pasan el contrato multilingüe. Las traducciones automáticas se consideran borradores comprensibles, no revisión nativa.
- [x] E/X — Tests del juego, formulario, catálogo y contratos pasan en el pipeline de GitHub; CI y builds principal/hub verdes. `npm run check` conserva las 10.260 URLs del catálogo principal.
- [x] P/S — PR [#56](https://github.com/pedronunezwebs-hash/usefulverse/pull/56) fusionada en `8cda264a7c16d7e70f86576f22b72b8135058730`; validación/deploy principal 37836786097 y deploy del hub 37837845643 completados. Rutas públicas EN/ES/AR HTTP 200; inglés/español LTR y árabe RTL.
- [x] Sitemap público del hub: **3.492 URLs únicas** (96 herramientas × 36 idiomas + 36 portadas), incluidas 36 variantes de Hashi; el sitemap principal conserva 10.260 URLs. Publicar/enviar sitemap no garantiza indexación.
- [x] README actualizado a 96 herramientas Growth600 y 3.492 URLs del hub.
- **Estado publicado:** 96/323 candidatas adicionales; 227 pendientes. Mantener intacto el catálogo original de 277. Siguiente herramienta en curso: #280 Chess Opening Trainer.

## Implementación · Futoshiki (#222; 95.ª herramienta Growth600) · 2026-10-09

- [x] C/F — Reutilizada la medición ya incluida en el plan: `futoshiki` 1.900 búsquedas/mes US/en, KD 33; `futoshiki puzzle online` 10/mes, KD 7. Sin llamadas nuevas a DataForSEO.
- [x] E/B — Puzzle Latin 4×4, 5×5 o 6×6 con desigualdades horizontales/verticales, dificultades, generador aleatorio con solución única verificada, comprobación, pista de una celda, deshacer hasta 100 acciones y modo de notas/candidatos. Explica que no usa las cajas 3×3 de Sudoku. Resolver/generar sucede localmente; sin API, dependencias runtime, almacenamiento ni cuenta.
- [x] L — 36 páginas estáticas traducidas desde inglés por lotes de Google Translate. Español y árabe se ajustaron manualmente; traducciones restantes son borradores automáticos comprensibles, no revisión nativa. Metatítulos conservan `UsefulVerse` y máximo 60 caracteres; descripciones hasta 160; placeholders verificados.
- [x] E/X — Suite focal de catálogo/formulario/contrato/lógica: 174/174; `npm test`: 1.342/1.342. `npm run check` conserva el sitio principal en 10.260 URLs; `locale:release-check` pasa para los 20 locales ampliados.
- [x] X/B — Chrome local en ES/AR: botones y estados localizados, candidato añadible con anuncio accesible y undo correcto; tamaño 6 crea 36 celdas. Árabe conserva `lang=ar`, página RTL y cuadrícula LTR; español `lang=es`, LTR. Móvil 390 px y escritorio 1440 px sin desbordamiento; consola sin errores/avisos. No se ejecutó PageSpeed/Lighthouse.
- [x] Build aislado — 3.456 páginas/URLs (95 herramientas × 36 idiomas + 36 portadas), 3.602 archivos, 104.673.047 bytes; sitemap con 3.456 `<loc>` únicas y 36 variantes de Futoshiki.
- [x] P/S — PR #55 fusionada en `b81fa8779b61265b3e57baa8f0aeedce82514e1c`; validación PR 37833297489, publicación principal 37833785332 y publicación del hub 37834374001 correctas. Rutas públicas EN/ES/AR y sitemap comprobados: HTTP 200; sitemap del hub contiene 3.456 URLs únicas y 36 variantes de Futoshiki. El sitemap del sitio principal conserva sus 10.260 URLs. Publicar no equivale a indexación; no se ejecutó PageSpeed/Lighthouse.
- [x] README actualizado a 95 herramientas Growth600 y 3.456 URLs del hub.
- **Estado publicado:** 95/323 candidatas adicionales; 228 pendientes. Siguiente candidata del plan: #260 Hashi Puzzle. Mantener intacto el catálogo original de 277.

## Publicada · Slitherlink (#186; 93.ª herramienta Growth600) · 2026-10-09

- [x] C/F — Reutilizada la ficha y demanda existente: `slitherlink` 2.900 búsquedas/mes US/en, KD 18; `slitherlink puzzle online` 10/mes. Sin DataForSEO nuevo.
- [x] Lógica + interfaz inicial — Motor propio para tableros 4×4 a 6×6: genera bucles a partir de poliominós, comprueba grado 2 y conectividad, cuenta pistas, ejecuta solver acotado y solo acepta puzzles con solución única; deja como máximo 20% de casillas sin pista. Formulario/controlador con cambiar tamaño, marcar líneas, comprobar, pista, deshacer y limpiar; controles etiquetados, pistas leídas como números y flechas para moverse. En el dispositivo, sin API/cuenta.
- [x] L — Copias estáticas en 36 idiomas mediante Google Translate; nombre del juego conservado en las metadescripciones/títulos donde la traducción automática lo deformó, títulos y descripciones dentro de límites. Botones ES/AR corregidos manualmente; traducción aceptada como borrador automático, no revisión nativa ni llamada al visitar.
- [x] E — Lógica, catálogo, formulario y contrato de localización: 171/171 pruebas focalizadas; suite general `npm test`: 1.328/1.328; `locale:release-check` pasa. 300 tableros deterministas (100 por tamaño 4/5/6) generados y verificados; únicos por solver acotado. Controlador minificado: 9.873 B (<24 KiB).
- [x] X/B — Chrome EN/ES/AR comprobado sobre el build final: 60 aristas en tablero 5×5; marcar línea, pista, deshacer, limpiar y feedback de comprobación; árabe RTL con botones localizados; consola sin errores. `npm run check` mantiene el sitio principal en 10.260 URLs.
- [x] Build/sitemap aislado: 3.384 locs únicas (93 herramientas × 36 locales + 36 portadas), 3.528 archivos, 102.888.467 bytes.
- [x] P/S — PR #52 fusionada en `eb166a30c889e94349a8bd55480d5ae1dec2c457`; CI 37824491231 y publicación principal 37824909881 correctos. Publicación separada del hub: workflow 37824928039 correcto. URLs EN/ES/AR y sitemap del hub comprobados públicamente: HTTP 200; título/H1/idioma correctos, árabe `dir=rtl`; sitemap contiene **3.384 URLs únicas** y las 36 variantes de Slitherlink.
- **Decisión UX** — El usuario puede tocar/clicar líneas; hay pistas, comprobar, deshacer y limpiar. Estado accesible con botones etiquetados por orientación/coordenadas, tablero bidimensional navegable por flechas y pistas como etiquetas leídas por tecnologías de asistencia. La generación valida soluciones en el navegador; mensaje honesto sobre posible espera en dispositivos lentos.
- [x] README actualizado a 93 herramientas Growth600 y 3.384 URLs públicas. **93/323 candidatas principales publicadas; 230 pendientes.** El sitemap principal permanece separado en 10.260 URLs. Publicación verificada; no equivale a indexación. No PageSpeed/Lighthouse.
- **Siguiente en ese checkpoint:** #199 Peg Solitaire; no se repitió la investigación DataForSEO.

## Publicada · Peg Solitaire (#199; 94.ª herramienta Growth600) · 2026-10-09

- [x] C/F — Ficha del plan: `peg solitaire` 2.400 búsquedas/mes US/en, KD 4; CPC 0.35 USD, no CPM. Sin consultas nuevas a DataForSEO.
- [x] E/B — Tablero clásico de 33 huecos, saltos ortogonales, estado ganado/bloqueado, pista de jugada legal, deshacer y reinicio; pista no promete resolver. Sin cuenta, API, almacenamiento, backend ni dependencia runtime.
- [x] L — 36 copias estáticas generadas por lotes desde inglés; traducción aceptada como borrador automática. Ajustes ES/AR para evitar falsos sentidos sobre clavijas y tablero. Sin traducción en runtime.
- [x] X/B — Suite focalizada 175/175; `npm test` 1.335/1.335 antes del ajuste visual de la pista y suite focalizada repetida después. `npm run check`: sitio principal sigue en 10.260 URLs; `locale:release-check` pasa. Chrome a 390 px EN/ES/AR probó movimiento, recuento, deshacer, pista, reinicio, `lang`/`dir`, teclado y ausencia de overflow/errores de consola.
- [x] Build/sitemap — 3.420 URLs únicas (94 herramientas × 36 idiomas + 36 portadas), 3.565 archivos, 103.738.804 bytes.
- [x] P/S — PR #53 fusionada en `64ee36f`; CI 37828766687, deploy principal 37829289936 y deploy del hub 37829832286 correctos. URLs EN/ES/AR y sitemap públicos HTTP 200; 3.420 URLs únicas, incluidas las 36 variantes.
- [x] README actualizado a 94 herramientas Growth600 y 3.420 URLs. **94/323 candidatas principales publicadas; 229 pendientes.** El sitemap principal sigue separado en 10.260 URLs. Publicar no garantiza indexación; no se ejecutó PageSpeed/Lighthouse.
- **Siguiente:** #222 Futoshiki; reutilizar demanda del plan, sin repetir DataForSEO.

## Implementación de Peg Solitaire (#199; checkpoint previo al despliegue)

- [x] F0/F1 — instrucciones releídas; rama aislada `codex/growth600-peg-solitaire-2026-10-09`, remoto `usefulverse.git`, sin cambios de terceros identificados.
- [x] C/F — reutilizada la ficha del plan: `peg solitaire` 2.400 búsquedas/mes US/en, KD 4; CPC, no CPM. Sin consultas nuevas a DataForSEO.
- [x] E/B — tablero inglés clásico 7×7/33 huecos, 32 clavijas y centro vacío; saltos ortogonales legales, victoria con una clavija, bloqueo sin jugadas, pista de una jugada legal (no promete resolver), deshacer hasta 100 jugadas y reinicio. No añade variantes redundantes, almacenamiento, cuenta, API, servicio ni dependencia runtime.
- [x] L — 36 copias estáticas generadas desde inglés por lotes, con aceptación explícita como traducción automática. ES/AR ajustados para corregir falsos sentidos detectados en tablero/estados/FAQ; límites de título/descripción y `hreflang` comprobados por los gates del hub.
- [x] X/B — 175 pruebas focalizadas pasan; `npm test` 1.335/1.335; `npm run check` conserva el sitio principal en 10.260 URLs; `locale:release-check` pasa. Chrome real a 390 px verificó tablero y recuento, movimiento 32→31, undo 31→32, pista y reinicio; ES/AR con `lang`/dirección correctos; sin errores de consola. Página solo solicita CSS global y JS propio (4.0 KB); no carga modelos ni recursos remotos.
- [x] Build/sitemap aislado — 3.420 `<loc>` únicas (94 herramientas × 36 idiomas + 36 portadas), 3.565 archivos, 103.738.804 bytes.
- [x] P/S — cerrado después; ver registro «Publicada · Peg Solitaire» anterior.

## Publicada · Work Order Generator (#185; 92.ª herramienta Growth600) · 2026-10-09

- [x] C/F — Se reutilizó la medición del plan: `work order template` 2.900 búsquedas/mes US/en, KD 14; `work order generator` 140/mes, KD 0. Sin consultas nuevas a DataForSEO.
- [x] E/B — Orden de servicio local con cliente, ubicación, responsable, fechas/estado, instrucciones, checklist, materiales y horas; lista horas; descarga CSV segura e impresión/guardar PDF. No es presupuesto, factura, nómina ni documento legal. Datos locales, sin precios, cuenta, servidor ni API.
- [x] L — 36 traducciones estáticas desde inglés con Google Translate por lotes de parámetros individuales; etiquetas de formatos creadas con campos locales para conservar separadores. Aceptadas como traducción automática básica, sin revisión nativa ni peticiones de traducción al visitar.
- [x] E/X — Suite focal build 172/172; `npm test` 1.320/1.320; `npm run check` conserva 10.260 URLs; `npm run locale:release-check` pasa. Chrome local AR RTL verificó ejemplo, 3 tareas, 2 materiales, 2 actividades, 1,75 h y consola limpia. Build aislado: 3.348 páginas (92 × 36 + 36 portadas), 3.491 archivos, 102.002.016 bytes.
- [x] P/S — PR #51 fusionada en `c6d5048256ee4a88549ee79dd15b37e75f5d2097`; CI 37820016811 y deploy principal 37820464968 correctos. Deploy del hub verificado en workflow 37821071714. Rutas públicas EN/ES/AR HTTP 200 con los títulos y H1 propios; sitemap del hub HTTP 200 con **3.348 URLs únicas**, e incluye las 36 variantes. Publicación verificada; no equivale a indexación. No PageSpeed/Lighthouse.
- [x] README actualizado a 92 herramientas Growth600 y 3.348 URLs públicas. **92/323 candidatas publicadas; 231 pendientes.** El inventario y sitemap del sitio principal siguen separados y conservan 10.260 URLs.
- **Siguiente:** #186 Slitherlink; no repetir la investigación DataForSEO existente.

## Publicada · Round Robin Tournament Generator (#184) · 2026-10-09

- [x] C/F/B — Genera rondas de todos contra todos para 2–32 participantes, bye automático cuando el número es impar, liga de una o dos vueltas con localía inversa; permite mezclar el sorteo, anotar marcadores, calcular tabla 3/1/0 con desempates explícitos, descargar CSV seguro y abrir impresión/guardar como PDF. Entrada local; nombres como texto, sin HTML ejecutable ni subida.
- [x] E — 8 pruebas unitarias de calendario, byes, vuelta inversa, aleatorización inyectable, validaciones, posiciones, límites de goles y CSV. Regresión completa `npm test`: 1.313/1.313; `locale:release-check` correcto; `npm run check` conserva las 10.260 URLs originales; `git diff --check` limpio. Build aislado local: 3.312 páginas (91 herramientas × 36 idiomas + 36 portadas), 3.454 archivos, 100.967.193 bytes.
- [x] L/B — 36 copias estáticas desde inglés con Google Translate, aceptadas como traducción automática sencilla, no revisada por nativos; metadatos dentro de presupuesto. Se corrigieron manualmente las etiquetas y FAQs árabes que podían confundir (marcador local/visitante, descanso y clasificación). Sin llamada de traducción en tiempo de ejecución ni APIs pagadas.
- [x] X — Chrome local inglés y árabe: ejemplo de cinco equipos genera 5 jornadas, 10 partidos, 5 descansos y 20 campos de marcador; al registrar Eagles 2–1 Tigers se actualiza la tabla y se asignan 3 puntos. Árabe verificado con `lang=ar`, `dir=rtl`, etiquetas de marcador localizadas y clasificación en vivo. Campos numéricos con `id`/`name`; consola de ambas páginas limpia.
- [x] P/S — El despliegue automático del hub terminó correctamente (workflow 37816919483); la publicación de #184 y su sitemap se verificaron después. Cuenta como publicada; no se afirma que ya esté indexada.
- #183 `fertilizer-calculator` continúa como herramienta ya existente; no duplicarla.

## Checkpoint de implementación · Work Order Generator (#185) · 2026-10-09

- [x] C/F — Reutilicé la medición del plan: `work order template` 2.900 búsquedas/mes US/en, KD 14; `work order generator` 140/mes, KD 0. Sin consultas nuevas a DataForSEO.
- [x] E/B — Genera orden de servicio/mantenimiento con cliente, ubicación, responsable, fechas/estado, instrucciones, checklist verificable, materiales y horas; actualiza checks, suma horas y ofrece CSV seguro o impresión/guardar PDF. No es presupuesto, factura, nómina ni documento legal. No precios, cuentas, servidor ni APIs; los datos se quedan en la página.
- [x] Límites/seguridad — Máximo 40 líneas por sección, cantidades y horas acotadas, fechas ISO comprobadas, estados explícitos y fecha obligatoria al marcar trabajo terminado. CSV entrecomilla Unicode y neutraliza prefijos de fórmulas; la vista previa e impresión usan `textContent`/DOM y mantienen RTL.
- [x] L — 36 copias estáticas traducidas desde inglés con Google Translate en lotes de parámetros individuales para impedir que el servicio mezcle frases reordenando etiquetas. Borradores aceptados como traducción automática sencilla; no revisión nativa ni servicio ejecutado al visitar la web. Title ≤60, description ≤160; ejemplos de formato construidos con etiquetas locales para mantener el orden de delimitadores.
- [x] E/X — Pruebas focalizadas con build 172/172 y `npm test` completo 1.320/1.320; `npm run check` conserva las 10.260 URLs protegidas; `npm run locale:release-check` correcto. Chrome local AR: carga del ejemplo, 3 tareas, 2 materiales y 2 actividades; suma 1,75 h; campos y formatos en árabe RTL; consola sin errores. Build aislado: 3.348 páginas (92 × 36 + 36 portadas), 3.491 archivos, 102.002.016 bytes.
- [x] P/S — Estado de publicación y evidencias registrados en la cabecera; entradas conservadas como detalle de implementación.

## Publicada · RTF Converter (#181) · 2026-10-08

- [x] C/F/B — Conversión local RTF→texto con párrafos, tabs, secuencias escapadas, Unicode y símbolos; límites de entrada/salida y profundidad, validación de cabecera/grupos/bloques binarios. Copiar/descargar texto y abrir diálogo de impresión a PDF; no conserva maquetación, imágenes, tablas ni todos los estilos. Archivo original intacto; no hay carga a servidor.
- [x] L — Copia estática para 36 idiomas generada en lotes desde inglés con Google Translate; sin API pagada ni traducción en tiempo de ejecución. Títulos conservan `UsefulVerse` y cumplen el límite, descripciones ≤160; traducción automática no equivale a revisión nativa.
- [x] E — Lógica focal 9/9; regresión total `npm test` 1.292/1.292; `npm run check` confirma 10.260 URLs originales intactas; `locale:release-check` correcto. Build local del hub: 3.240 URLs (89 herramientas × 36 idiomas + 36 portadas), 3.380 archivos. `git diff --check` limpio.
- [x] X — Chrome local: extracción de RTF sintético mostró «Hello world», párrafo separado, `é` y em dash; estado accesible de éxito. Árabe comprobado con `lang=ar`, `dir=rtl`, controles en RTL y consola sin errores.
- [x] P/S — PR #47 fusionada en `548163c5e7aa14b66c5879a89b00a5d19c2e7d16`; CI 37808096142, publicación principal 37808599909 y publicación separada del hub 37809172150 terminaron correctamente. La ruta RTF pública responde HTTP 200; el sitemap del hub devuelve HTTP 200 con 3.240 `<loc>` (89 herramientas × 36 idiomas + 36 portadas). Publicación verificada, no indexación. No se ejecutó PageSpeed/Lighthouse.
- [x] README actualizado con 89 herramientas añadidas y 3.240 URLs públicas. 89/323 candidatas publicadas; 234 pendientes al inicio del siguiente ciclo.

## Publicada · CSV to PDF (#182) · 2026-10-08

- [x] C/F/B — CSV local con detección de coma, punto y coma, tabulación o barra vertical; UTF-8, Windows-1252 y UTF-16; encabezado opcional; vista previa accesible y controles A4/Carta, orientación y márgenes. Imprime desde el navegador para guardar como PDF; no ejecuta fórmulas ni sube datos. No conserva estilos, fórmulas, gráficas ni hojas de Excel.
- [x] Límites visibles y comprobados: archivo ≤5 MiB, 2.000 filas de datos, 40 columnas y 50.000 celdas normalizadas; preview inicial de 100 filas. Datos largos envuelven en impresión y se insertan como texto.
- [x] L — 36 copias estáticas; 35 idiomas adicionales traducidos desde inglés en lotes con Google Translate, aceptadas como traducción automática sencilla, sin revisión nativa ni llamadas de traducción en el sitio. Título incluye la marca y cabe en 60; descripción ≤160.
- [x] E — pruebas focalizadas 9/9; conjunto de pruebas del repositorio 1.303/1.303; `npm run locale:release-check` correcto; `npm run check` conserva las 10.260 URLs del catálogo original. Build aislado del hub: 3.276 URLs (90 × 36 + 36 portadas), 3.417 archivos; contenido estático aprox. 100 MB.
- [x] X — Chrome local EN/AR: ejemplo y preview funcionan; el árabe usa `lang=ar` y `dir=rtl`. CSV sintético con HTML literal, ceros iniciales y celda multilínea se muestra como texto sin crear elementos. Se comprobó la llamada a impresión y que el documento impreso contiene 2 filas; consola EN/AR limpia.
- [x] P/S — PR #48 fusionada en `82475ab108062f93a6bae9cc55a847addb5cfb1b`; CI 37811428445 y deploy principal/hub 37812563433 correctos. Las rutas públicas EN/ES/AR responden HTTP 200; sitemap del hub HTTP 200 con 3.276 URLs y las 36 variantes CSV→PDF. Publicado no significa indexado. No se ejecutó PageSpeed/Lighthouse.
- [x] README actualizado con 90 herramientas añadidas y 3.276 URLs públicas. 90/323 candidatas publicadas; 233 pendientes.
- **Siguiente:** evaluar #184 Round Robin Tournament Generator; #183 Fertilizer Calculator ya tiene un módulo registrado en el catálogo y debe auditarse antes de contarlo como pendiente o duplicarlo.

## Publicada · Horsepower Calculator (#180) · 2026-10-08

- [x] C/F — potencia de eje ideal desde torque y RPM; despeja torque o RPM a partir de las otras magnitudes. Convierte N·m/lb·ft y W/kW/hp/PS; explica que no representa potencia medida en ruedas ni pérdidas reales.
- [x] B/X — modos dinámicos, ejemplo, validación de ceros/singularidades, unidades, reset/copia y resultados accesibles. Verificado en Chrome: 100 N·m a 1.000 RPM → 10,471976 kW, 14,043150 hp y 14,237924 PS; modos inversos recuperan 95,492966 N·m y 1.000 RPM.
- [x] L — 36 locales estáticos a partir del inglés mediante Google Translate; no revisión nativa. Ajustadas expresiones obvias del español y límites de metadescripción. Auditoría de build: todos los títulos ≤60 y descripciones ≤160 caracteres renderizados.
- [x] E — lógica focal 5/5; regresión `npm test` 1.281/1.281; `npm run check` confirma 10.260 URLs protegidas; `locale:release-check` correcto. Build del hub: 3.204 URLs únicas (88 herramientas × 36 idiomas + 36 portadas; 3.343 archivos). `git diff --check` limpio.
- [x] X — Chrome local: inglés funcional directo; español con cadenas revisadas; árabe `lang=ar`, `dir=rtl`, cálculo inverso funcional. Consola sin errores y recursos solo del mismo origen.
- [x] P/S — PR #45 fusionada en `7f91d475cf09edc9b1fb6397382b90ecb85d91af`; CI y publicación principal 37804057904 correctos; publicación manual del hub 37804650210 correcta. EN/ES/AR responden HTTP 200; sitemap público HTTP 200 con 3.204 `<loc>` únicas e incluye las 36 versiones. Esto confirma publicación, no indexación. No se ejecutó PageSpeed/Lighthouse.
- **Siguiente:** #181 `rtf-converter`; 88/323 candidatas adicionales publicadas y 235 pendientes.

## Publicada · Force Calculator (#179) · 2026-10-08

- [x] PR #44 fusionado en `c4ea55cfe57bca860532363ccf3a055a97b6adc1`; pipeline del hub 37799721532 y ejecución manual 37800203046 finalizaron correctamente.
- [x] Página EN responde HTTP 200; sitemap público verificado con 3.168 `<loc>` únicas. Los motores ya conocen la URL canónica; esto no prueba rastreo ni indexación y no se volvieron a usar paneles.
- [x] 87/323 candidatas nuevas de Growth600 estaban publicadas antes de #180. Las 277 herramientas originales permanecen protegidas.

## Completada y publicada · Acceleration Calculator (#178) · 2026-10-08

- [x] C/F/E — contrato sin duplicación: cuatro incógnitas de cinemática 1D con aceleración constante; unidades métricas/imperiales; alcance y supuestos visibles. No se alteró ninguna herramienta existente.
- [x] L — 36 idiomas como textos estáticos; textos automáticos aceptados según el flujo acordado. Reparados marcadores filtrados en Marathi y términos físicos árabes obvios; el resto no se presenta como traducción nativa revisada.
- [x] B — formulario accesible con modos dinámicos, campos requeridos coherentes, ejemplo, reset, copia y resultados anunciados.
- [x] E — focalizadas 161/161; luego cambios solo de copy (labels AR/MR), contrato de localización 117/117. Regresión total 1.269/1.269; `npm run check` pasó: 10.260 URLs protegidas sin cambios.
- [x] X/B/S — build aislado: 3.132 rutas únicas (86 herramientas × 36 locales + 36 portadas), 3.269 archivos; prueba real de navegador EN/AR, aceptación 4 m/s² y 50 m, modo imperial 2 ft/s² y 25 ft, RTL móvil 390 px sin overflow ni errores/conexiones externas; etiquetas Marathi inspeccionadas.
- [x] P — PR #42 fusionado en `main` mediante `8c9ded9afd741f4af7af16f2f50c8bc143d55546`; workflow 37789761618 publicó el sitio principal y workflow_dispatch 37790375128 publicó el hub separado. Rutas EN/ES/AR responden HTTP 200; títulos, lang/dir correctos. Sitemap público HTTP 200 con **3.132 `<loc>` únicas** e incluye las 36 rutas de la herramienta.
- [x] S — el sitemap estático de producción cambió en la URL ya conocida. Google, Bing y Yandex habían recibido esa URL canónica anteriormente; en este turno no se volvió a pulsar “enviar” en sus paneles. No hay garantía de rastreo/indexación por publicar/enviar. Naver sigue pendiente de confirmar desde su panel.
- [ ] Próxima candidata: #179 `force-calculator`; mantener #163 `half-life-calculator` como duplicado/no recrear.

## Punto de reanudación vigente · 2026-10-08

Este bloque prevalece sobre notas históricas de etapas anteriores que describen despliegues o traducciones todavía pendientes en ese momento.

- [x] Ficha #138/323 `kinetic-energy-calculator`: implementada, probada, integrada y publicada; 277 herramientas protegidas intactas.
- [x] Gates C/F/E/X/L/B/P/S de #138: 1.262 pruebas completas; CI 37781969260 y `npm run check` correctos. Probados cálculo directo/inverso, copia, RTL árabe, CJK japonés, viewport 390 px y consola limpia; build con 84 herramientas × 36 idiomas + 36 portadas.
- [x] Producción #138: merge `1d14d207cad7114a95714e3a8db8bda993616722`; Pages deployment `ce2460ae-7ff6-411e-8469-d33d7daa8014`. EN/ja/ar y sitemap respondieron HTTP 200; `https://tools.usefulverse.com/sitemap.xml` contiene 3.060 `<loc>` únicas (84 × 36 + 36).
- [x] #158 `resistor-color-code-calculator`: 1.264/1.264 pruebas; CI 37785744156; `npm run check`; build aislado de 3.096 URLs únicas (85 herramientas × 36 idiomas + 36 portadas). Verificados decodificación 4/6 bandas, modo inverso, copiar, ES/AR RTL, 390 px sin overflow y consola limpia. Google Translate estático (no revisión nativa); corregida una frase gujarati ambigua. Sin PageSpeed.
- [x] Producción #158: PR #41 fusionado en `40e466c3356c1374616fb9af09d762e065aec180`; despliegue `78a117d0-1b8e-4e90-bb78-4a4f940fc755`. EN/ES/AR y sitemap públicos HTTP 200; sitemap contiene ahora 3.096 `<loc>` únicas e incluye esta herramienta en 36 idiomas.
- [x] Google/Bing/Yandex ya recibieron la misma URL canónica del sitemap en la tanda anterior; el XML público se actualizó al desplegar la herramienta. El reenvío no demuestra rastreo ni indexación. Los estados previos del panel continúan siendo los últimos observados.
- [ ] Naver Search Advisor: confirmar propiedad/envío del sitemap al recuperar acceso al panel; no afirmar que se envió.
- [~] Ficha #163 `half-life-calculator`: no crear; el catálogo ya contiene herramienta, lógica y traducciones equivalentes. Se respeta la regla anti-duplicación.
- [ ] Próxima candidata única: #178 `acceleration-calculator`; releer frontera y aceptación de `PLAN-600.md`, conservar las 277 herramientas protegidas y las herramientas existentes sin cambios.

- [x] Publicación de la tanda previa: PR #39 integrado en `main` mediante merge `ded42fed1b0b6893418f5442116bc6017022f72d`; el workflow principal/hub terminó correctamente.
- [x] Traducción: las 84 herramientas publicadas antes de #158 están en los 36 idiomas activos. Las nuevas herramientas #138 y #158 tienen versiones estáticas en los 36 idiomas; las cadenas de #158 son traducción automática comprensible y no revisión nativa. No regenerar idiomas de herramientas ya cerradas.
- [x] Sitemap público del hub: `https://tools.usefulverse.com/sitemap.xml` respondió HTTP 200 con 3.096 URLs únicas (85 herramientas × 36 idiomas + 36 portadas). El sitemap del sitio principal conserva 10.260 URLs; son hosts/sitemaps distintos.
- [x] Google Search Console: el sitemap del hub se envió el 2026-10-08 y la interfaz confirmó el envío. El panel había mostrado 216 páginas descubiertas antes del último despliegue; no es la lectura actual ni prueba de rastreo/indexación de las 3.096 URLs.
- [x] Bing Webmaster: enviado `https://tools.usefulverse.com/sitemap.xml` desde la propiedad principal; el panel lo muestra con fecha 2026-10-08 y estado `Processing`, sin error. Su propiedad `tools.usefulverse.com` respondió “User is unauthorized to access the site”; por ello no asumir que las métricas estén asociadas a una propiedad propia del subdominio.
- [x] Yandex Webmaster: propiedad separada de `https://tools.usefulverse.com` verificada como Owner por DNS TXT. Se añadió `https://tools.usefulverse.com/sitemap.xml`; Yandex confirmó que está en la cola de procesamiento (puede tardar 1–2 semanas). El TXT de verificación se conserva en Cloudflare DNS.
- [ ] Naver Search Advisor: la pestaña del panel llegó a inicio de sesión. Falta que el propietario inicie sesión, confirmar/añadir la propiedad del subdominio, y enviar allí el sitemap. No se cambió configuración ni se envió nada a Naver.
- [ ] Tras procesarse Google/Bing/Yandex/Naver, registrar fechas/estados visibles y distinguir “enviado”, “procesado”, “URLs descubiertas” e “indexado”. No afirmar indexación por el mero envío. Los sitemaps y `robots.txt` son públicos y favorecen el descubrimiento aunque un panel no esté accesible.
- [ ] Próxima implementación: #178 `acceleration-calculator`; no tocar las 277 protegidas ni recrear `half-life-calculator`. Confirmar catálogo y plan actuales en `main` al reanudar.

### Método breve de traducción que se debe conservar

- Traducir desde el texto inglés en tandas pequeñas mediante Google Translate, respetando su límite visible (aprox. 4.000 caracteres por bloque si sigue aplicando); priorizar rapidez y comprensión sencilla, no pulido nativo.
- Incluir metadatos SEO, H1, textos visibles, controles, estados, errores, FAQ y avisos. Preservar placeholders, variables, etiquetas HTML, nombres propios, fórmulas, códigos, IDs y formatos exactamente.
- Marcar el resultado como traducción automática; no afirmar revisión nativa. Revisar que no haya cadenas vacías, texto fuente olvidado o frases absurdas; probar una muestra RTL y una CJK cuando estén implicadas.
- Ejecutar el gate de traducción, pruebas/build y conteo de sitemap antes de publicar. El gate no sustituye comprobar el despliegue y el estado de cada panel de buscador.
- La copia que el propietario guarda en `~/Downloads/PLAN.md` difiere de la fuente actual del repositorio y conserva secciones anteriores a la implementación. En la reanudación, usar y releer `docs/growth600/PLAN-600.md` en `main`; no sustituirlo por esa copia descargada ni repetir el trabajo ya cerrado.

## Estado actual

- [x] F0 — Arranque: leídas las instrucciones vigentes de la agencia, operación online, FABLE y Cloudflare; clon temporal aislado; plan y evidencia de DataForSEO localizados en GitHub. `gh auth status` confirma GitHub. La primera comprobación de `wrangler whoami` recibió un 502 con HTML y no hubo operaciones Cloudflare en ese momento; en la comprobación más reciente de este turno volvió a responder correctamente. Para Yandex se añadió después únicamente el TXT de verificación de `tools.usefulverse.com`.
- [x] F1 — Snapshot histórico inicial: `origin/main` estaba en `a8a8a2c9aaa240e7cc0195d9044d312a06309577`, merge de PR #38. Inventario base: 277 herramientas y 36 idiomas. **Corrección:** el `PLAN.md` actual de Descargas no coincide con la versión canónica `docs/growth600/PLAN-600.md` y es anterior a las verificaciones/publicaciones registradas aquí; usar el plan del repositorio.
- [x] F1 — Línea base técnica inicial: `npm test`: 832 aprobados, 0 fallidos. `npm run check` completó; sitemap generado: 10.260 URLs. El build temporal contiene 10.728 archivos (incluye assets) y ocupa 495 MB; el proyecto tiene margen para crecer, pero no hasta 600 herramientas en una única salida Free.
- [x] F2 — Capacidad y coste estático comprobados: la cuenta tiene los proyectos Pages `usefulverse` y `usefulverse-tools`. La documentación oficial consultada el 2026-10-08 mantiene el límite Free de 20.000 archivos por proyecto, hasta 500 builds al mes y máximo 25 MiB por archivo; no se añaden Pages Functions ni servicios de procesamiento. El proyecto de herramientas ya tiene `tools.usefulverse.com` asociado.
- [x] F2 — Reservar el proyecto Pages gratuito `usefulverse-tools`: creado con Wrangler el 2026-10-07 y confirmado en la respuesta de Cloudflare. No se alteró `usefulverse`, DNS ni billing.
- [x] F2 — El workflow construye el hub aislado y permite despliegue manual opt-in desde `main`. Cloudflare Pages confirma el dominio `tools.usefulverse.com` en `usefulverse-tools` y un deployment de producción en `main` desde `0ee5ae80149ec26d6aeb0f6c1e74e5d9c9b42ae7` (deployment `74fdc6ed-e1df-4c70-971e-fdc9d0b2613c`, verificado el 2026-10-08). El sitemap público devuelve HTTP 200 y **216 URLs**; `robots.txt` lo declara. Esta comprobación no cambió DNS, billing ni producción.
- [ ] F3 — Infraestructura aditiva para catálogo, renderer/origen canónico, 36 idiomas, builds y límites de tamaño. Parcial: catálogo, renderer, gate estricto por idioma, formularios, builder/sitemap separados y paso de build CI están probados/preparados; los 36 módulos ya están presentes. Quedan verificación final de budgets/licencias y habilitar/ejecutar la operación de publicación después de los gates.
- [ ] F4 — Piloto original de cinco familias: `gravel-calculator`, `molar-mass-calculator`, `auto-loan-refinance-calculator`, `secret-santa-generator`, `mancala`. Los cinco están publicados (PR #37; deployment de producción confirmado) y el sitemap público de 216 URLs responde correctamente. Falta confirmar en los paneles de buscadores el envío/lectura del sitemap para `tools.usefulverse.com`; F4/S no queda cerrado hasta verificarlo.

## Continuación · Mortgage Points Calculator (#164) · 2026-10-08

- [x] C/F — herramienta propia para comparar el coste pagado al cierre por puntos hipotecarios frente a dos APR cotizadas para el mismo principal y plazo. El plan registra `mortgage points calculator` 3.600 búsquedas/mes US/en, KD 7 y `discount points calculator` 3.600, KD 5; no se volvió a consultar DataForSEO.
- [x] E/X — amortización mensual hasta 600 meses, APR 0–100%, coste inicial explícito y comparación configurable hasta el plazo. Informa pagos, intereses totales, saldos a horizonte, efecto neto y dos puntos de equilibrio diferentes; un coste positivo sin ahorro nunca se presenta como recuperado. Excluye impuestos/deducibilidad, cargos adicionales, escrow, seguros, tasas variables y reglas del prestamista.
- [x] B — controles etiquetados, ejemplo, reinicio, copia, salida anunciada y cálculo local sin APIs ni subida. Incluye advertencia: estimación educativa, no oferta ni consejo financiero; comparar cotizaciones reales.
- [x] L (fuente) — copy inglés con FAQs y supuestos explícitos. Los otros 35 idiomas son borradores estructurales marcados `pending-tool-specific-translation`; bloqueados para publicación.
- [x] E — pruebas focalizadas de lógica, catálogo, formularios, contrato de localización y build: **130/130 aprobadas**; `node --check` y `git diff --check` limpios.
- [x] X — Chrome local aislado: ejemplo calcula coste 2.000, reducción mensual 33,75 y neto estimado a 60 meses 519,23; con APR idéntica indica cero ahorros y que no se recupera el coste; principal inválido muestra error accesible. Móvil emulado 390×844 sin overflow; consola sin errores/avisos y solo solicitudes del propio servidor local.
- [ ] B/P — no se validó el bundle minificado final ni su presupuesto con las dependencias de compilación fijadas. No está integrado ni desplegado, no se cambió sitemap ni se envió a buscadores. PageSpeed/Lighthouse no se ejecutó.
- **Recuento al cerrar #164:** 67/323 candidatas implementadas en inglés; quedaban 256 filas (255 candidatas válidas + una reserva). Incluidas las 277 herramientas protegidas, eran 344 implementaciones inglesas/base; no equivale a páginas traducidas o publicadas.

## Continuación · Trapezoid Calculator (#165) · 2026-10-08

- [x] C/F — herramienta geométrica distinta del calculador de superficie rectangular: área de trapecio desde bases paralelas y altura, lados/perímetro desde desplazamiento de la base superior, y croquis. El plan registra `trapezoid area calculator` 3.600 búsquedas/mes US/en, KD 10; `trapezoid calculator` 2.400, KD 0. No hubo nueva consulta a DataForSEO.
- [x] E/X — área `(baseA + baseB) × height / 2`; lados derivados con Pitágoras; valida dimensiones finitas acotadas y rechaza desplazamientos que cruzan lados/no formen un cuadrilátero convexo. Desplazamiento no cambia el área. Todas las longitudes deben usar una unidad común; el área se rotula en unidades cuadradas.
- [x] B — controles etiquetados, selector mm/cm/m/in/ft, diagrama accesible que se ajusta a la geometría, ejemplo, reinicio, copia y errores anunciados; matemáticas locales, sin APIs.
- [x] L (fuente) — copy inglés con supuestos, límites, FAQs y fórmula. Los otros 35 idiomas son borradores estructurales marcados pendientes y bloqueados para publicación.
- [x] E — pruebas focalizadas de lógica, catálogo, formulario, contrato de localización y build: **131/131 aprobadas**; sintaxis y `git diff --check` correctos.
- [x] X — Chrome local aislado: ejemplo de bases 6/4, altura 3 y desplazamiento 1 devuelve área 15, lados √10 y perímetro 16,3246; un desplazamiento que cruza lados muestra el error. Móvil emulado 390×844 sin overflow; consola sin errores/avisos y solo solicitudes al servidor local de QA.
- [ ] B/P — el bundle minificado final y su presupuesto quedan sin validar porque este checkout no tiene la dependencia de build fijada. No se integró/desplegó, no se cambió sitemap ni se informó a buscadores. PageSpeed/Lighthouse no se ejecutó.
- **Recuento al cerrar #165:** 68/323 candidatas implementadas en inglés; quedan 255 filas (254 candidatas válidas + una reserva). Incluidas las 277 protegidas, son 345 implementaciones inglesas/base; no son páginas traducidas ni publicadas.

## Continuación · Prayer Times Calculator (#166) · 2026-10-08

- [x] C/F — herramienta local de horarios astronómicos para oración, separada del cálculo civil de fechas y conversión de zonas horarias. La demanda registrada en el plan es `prayer time calculator` 3.600 búsquedas/mes US/en, KD 13; no se volvió a consultar DataForSEO.
- [x] E — fecha gregoriana 1900–2100, coordenadas manuales, offset UTC explícito (incluida hora de verano), ocho métodos de ángulo/intervalo, Asr estándar/Hanafi y alternativas de latitud alta. Modelo solar aproximado con ecuación del tiempo y declinación; muestra “Unavailable” cuando no existe salida/puesta y solo estima Fajr/Isha ausentes bajo la corrección elegida. Sin geolocalización, llamadas externas, carga ni almacenamiento.
- [x] Aceptación reproducible del motor: New York, 2026-03-20, 40.7128/−74.006, UTC−4, ISNA → salida 07:00, Dhuhr 13:04, horarios ordenados; offset UTC−5 desplaza el reloj una hora conservando intervalos; Makkah Isha 90 minutos o 120 al marcar Ramadan; en 89° N no inventa amanecer ni ocaso.
- [x] B — formulario con fecha/offset explícitos, selectores nombrados, ejemplo, cálculo, reset, copia, anuncios accesibles y aviso de que es un horario aproximado, no una autoridad religiosa/local. Las estimaciones de latitud alta se explicitan.
- [x] E — pruebas focales de motor, catálogo, formulario, contrato de los 36 locales y build: **135/135 aprobadas**; aceptación, UTC/DST, métodos, Asr Hanafi, Ramadan, casos polares y entradas inválidas cubiertos.
- [ ] X/B/P — no se completó una pasada visual en Chrome ni se midió el bundle minificado real; el checkout carece de las dependencias de build fijadas y no se instalaron. No se ejecutó PageSpeed/Lighthouse.
- [ ] L — inglés completo; las otras 35 localizaciones son copias estructurales inglesas con `pending-tool-specific-translation` y continúan bloqueadas. No se ha integrado, desplegado, añadido al sitemap de producción ni enviado a buscadores.
- **Método consultado:** [Pray Times: algoritmos y ajustes de latitud](https://praytime.info/docs/calculation), [parámetros de métodos](https://praytime.info/docs/methods), [U.S. Naval Observatory: ecuación del tiempo](https://aa.usno.navy.mil/faq/eqtime). Las convenciones pueden diferir; la interfaz recomienda verificar con una autoridad local.
- **Recuento al cerrar #166:** 69/323 candidatas implementadas en inglés; quedan 254 filas (253 candidatas válidas + una reserva). Con las 277 herramientas originales intactas: 346 implementaciones inglesas/base, no 346 herramientas traducidas ni publicadas.

## Continuación · Polynomial Long Division Calculator (#162) · 2026-10-08

- [x] C/F — candidata distinta de la división entera existente: divide polinomios de una variable, devuelve cociente, resto y operaciones de cada paso. El plan registra `polynomial long division calculator` con 3.600 búsquedas mensuales US/en, KD 0; no se consultó DataForSEO de nuevo.
- [x] L (fuente) — copy inglés con límites explícitos: x, exponentes enteros, coeficientes de entrada enteros, grado máximo 20, 64 términos y 256 caracteres; resultados racionales exactos. Metadatos dentro del contrato. Las otras 35 localizaciones son solo borradores estructurales y siguen bloqueadas; esto no pasa la puerta de publicación.
- [x] E/X — aritmética racional exacta con reducción por MCD, pasos acotados, rechazo de sintaxis no soportada y división por cero; cubiertos cociente exacto, fracciones, polinomios dispersos y entradas límite.
- [x] B — formulario accesible, ejemplo/reset/copia y salida anunciada; sin API, subida, almacenamiento, servicio de pago o dependencia de procesamiento remoto.
- [x] E — pruebas focalizadas de lógica, catálogo, formularios, contrato de locales y builder: **127/127 aprobadas**; `node --check` y `git diff --check` limpios.
- [x] X — Chrome local aislado: ejemplo x²−1 entre x−1 devuelve x+1, resto 0 y dos pasos; caso 2x²+1 entre 2x+1 devuelve x−1/2, resto 3/2; sintaxis no admitida muestra error sin romper la página. En móvil 390×844 no hay overflow, no aparecen errores/avisos de consola y no hay peticiones externas.
- [ ] B/P — no se validó bundle minificado final ni tamaño porque el clon carece de dependencias fijadas de build; no se instalaron. No se ha integrado ni desplegado, no se modificó ningún sitemap ni panel de buscadores. PageSpeed/Lighthouse no se ejecutó, conforme al plan.
- **Recuento al cerrar #162:** 65/323 candidatas implementadas en inglés; quedaban 258 filas del plan (257 candidatas válidas + una reserva). Sumadas a las 277 herramientas protegidas, había 342 implementaciones inglesas/base, pero esta ampliación no estaba publicada y las nuevas páginas no estaban listas en todos los idiomas.

## Continuación · Half-Life Calculator (#163) · 2026-10-08

- [x] C/F — herramienta de decaimiento exponencial distinta del interés compuesto; resuelve cantidad inicial, cantidad restante, tiempo transcurrido o vida media con las otras tres variables. El plan registra `half life calculator` 3.600 búsquedas/mes US/en, KD 6, y `radioactive decay calculator` 1.000/mes, KD 0; sin nueva consulta ni gasto de DataForSEO.
- [x] E/X — fórmula `remaining = initial × (1/2)^(elapsed/half-life)`, soluciones inversas y porcentaje/restos de vidas medias. Entradas acotadas, unidades de tiempo compartidas, validación para no crecimiento, cero, infinito, subdesbordamiento y resultados fuera de rango. Pruebas cubren cuatro incógnitas y errores.
- [x] B — selector del valor por resolver que deshabilita y desmarca como obligatorio el campo desconocido, ejemplo 100→50 tras una vida media, salida/copia accesibles y advertencia explícita de que no es una herramienta médica, de dosis, exposición ni seguridad.
- [x] L (fuente) — copy inglés completo, FAQs y metadatos dentro de límites. 35 idiomas adicionales son borradores estructurales, permanecen bloqueados y no se consideran traducciones listas.
- [x] E — pruebas focalizadas de lógica, catálogo, formulario, contrato de localización y builder: **128/128 aprobadas**; `node --check` y `git diff --check` correctos.
- [x] X — Chrome local aislado: calcula 50% después de una vida media; modo inverso calcula 20 unidades de tiempo para 100→25 con vida media 10; el ejemplo carga y calcula 50%; vista móvil emulada 390×844 sin overflow ni solicitudes externas, sin errores/avisos de consola.
- [ ] B/P — falta validar bundle minificado/tamaño con dependencias de build; no se instalaron. No está integrada ni desplegada, no toca sitemaps ni paneles. No se ejecutó PageSpeed/Lighthouse.
- **Recuento al cerrar #163:** 66/323 candidatas implementadas en inglés; quedaban 257 filas del plan (256 candidatas válidas + una reserva). Incluidas las 277 protegidas, eran 343 implementaciones inglesas/base, no publicaciones listas: la ampliación permanece fuera de producción y faltan traducciones/gates.

## Avance de expansión · Brick Calculator

- [x] C — Añadida `brick-calculator` (#116) como herramienta distinta de `tile-calculator`: estima ladrillos, hiladas aproximadas, huecos, capas de muro, desperdicio y volumen de mortero, con cálculo íntegramente local y copy estático en los 36 idiomas. No hubo nuevas consultas a DataForSEO.
- [x] F/X/L — Motor con entradas acotadas, conversiones métricas/imperiales, huecos repetidos, límite para aperturas mayores que el muro, capas enteras y rendimiento de saco opcional. Formulario con ejemplo, reinicio, copia, anuncios accesibles y nota clara de que es una estimación no estructural.
- [ ] E/B/P/S — Aún falta cerrar revisión funcional y visual del builder, integración/publicación, comprobar URL/sitemap público y confirmar envío/lectura de sitemap en paneles. La candidata sigue fuera de `main` y no debe contarse como publicada.
- **Recuento al cerrar Brick Calculator:** 64/323 implementadas en inglés. Quedaban 259 entradas del plan: 258 candidatas válidas sin implementar y una reserva para sustituir `API Request Builder` (ya existe entre las 277 protegidas y no cuenta como nueva). Mind Map Maker, Mood Tracker, Journal Online y Travel Itinerary Planner esperan las otras 35 traducciones cada una y no se consideran publicadas. Las 277 originales permanecen intactas.

## Avance de implementación · motores del piloto

- [x] Grava: área de rectángulo/círculo/triángulo, volumen, desperdicio, densidad, peso estimado y redondeo de sacos; entradas fuera de rango rechazadas.
- [x] Masa molar: parser local acotado para grupos, hidratos e isótopos expresamente incluidos; H₂O = 18,015 g/mol. Elementos/isótopos no soportados y fórmulas inválidas se rechazan; no se finge soporte universal.
- [x] Refinanciación auto: pagos amortizados con APR 0%, cargos iniciales o financiados, coste total y punto de equilibrio acumulado por mes; solo matemáticas, sin recomendar una tasa.
- [x] Secret Santa: emparejamiento sin autoasignación, exclusiones, imposibilidad explícita, fuente aleatoria inyectable y hasta 30 participantes.
- [x] Mancala/Kalah: siembra, omisión del almacén contrario, capturas, turno extra, barrido final, empate y rival local heurístico. Invariante: conserva semillas.
- [x] Suite piloto: `node --test src/growth600/tools/growth600-logic.test.mjs` — 7/7; incluye aceptación, límites, imposibilidad, variedad del sorteo y partidas deterministas con conservación de semillas.
- [x] Contrato del catálogo aditivo: 5 IDs comparados contra las 277 protegidas; pruebas rechazan colisión, duplicados, contratos incompletos y enlaces a herramientas inexistentes.
- [x] Renderer base: pruebas confirman canonical/hreflang en origen separado, `lang`/`dir` RTL, escape HTML y JSON-LD contra inyección, además de rechazo de origen no HTTPS. No es aún una página de producto completa.
- [x] Formularios estáticos y controladores reales para los cinco pilotos; datos locales en `<script type="application/json">` con escape de contenido; tests verifican labels, submit/reset y copia segura.
- [x] Bundles por herramienta minificados y separados; tamaños observados: grava 3.995 B, masa molar 4.713 B, refinanciación 3.820 B, Secret Santa 4.858 B, Mancala 3.875 B; bajo el presupuesto de 24 KiB, sin llamadas remotas ni ejecución dinámica.
- [x] Puerta de localización: comprueba cada herramienta en cada idioma y límites de títulos/descripciones; los 36 borradores están presentes, con placeholders conservados y copy SEO dentro del contrato.
- [x] Builder separado probado con el build real temporal: 36 idiomas × (5 herramientas + portada), 216 URLs de sitemap únicas, robots/llms, canonicals, hreflang y assets versionados; rechaza sobreescrituras, archivos de más, controladores ausentes y copy incompleto. Tras incluir favicon y el ajuste CSS RTL: 262 archivos / 3.519.822 bytes; no es un deploy ni una salida del sitio principal.
- [x] Medición de assets del build real: CSS 5.785 B; controladores minificados de 3.820–4.858 B; todos bajo 24 KiB. En 216 HTML se verificaron title, description, canonical, x-default, lang, ausencia de `undefined` y referencias a assets existentes.
- [x] Recorrido funcional en navegador local de los cinco pilotos: grava (cálculo, inválido y reset), fórmula `Ca(OH)2` (74,092 g/mol) y rechazo de `XeF4`, refinanciación (cuotas/coste/break-even), sorteo con exclusión y revelado privado paso a paso, Mancala con turno extra y respuesta del ordenador. Las pruebas detectaron y corrigieron botones de envío mal tipados y el adaptador aleatorio criptográfico.
- [x] Muestra real gujarati en navegador: entrada 5 × 4 m y profundidad 0,1 m devolvió 20 m² y 2 m³; labels, botones y resultado se mostraron en gujarati. Es una comprobación de escritorio, no reemplaza la revisión móvil pendiente.
- [x] Regresión completa con los 36 idiomas y el ajuste RTL: `npm test` — 889/889, 0 fallidos.
- [x] Localización de los cinco pilotos: inglés fuente más borradores automáticos comprensibles para las 252 cadenas del home y los cinco pilotos. Están materializados español, francés, portugués, alemán, japonés, coreano, indonesio, hindi, árabe, chino simplificado, bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, suajili, maratí, telugu, hausa, filipino, tamil, persa, amhárico y gujarati. El build exige todos los 36 locales.
- [x] Infraestructura de los 36 idiomas: materializador indexado preserva placeholders y fuente; metadatos cumplen topes; páginas generadas usan copy localizado sin `undefined`. Contratos, renderer y build real pasan.
- [x] Borrador hindi: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; presupuesto de metadata y render con `lang="hi"`/hreflang cubiertos por test.
- [x] Borrador árabe: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; presupuesto de metadata y render RTL con `lang="ar"`/hreflang cubiertos por test.
- [x] Borrador chino simplificado: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; topes de metadata y render con `lang="zh-CN"`, ruta `/zh-cn/` y hreflang cubiertos por test. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador bengalí: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; title/description dentro de los límites contractuales y render con `lang="bn"`, ruta `/bn/` y hreflang cubiertos por tests. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador ruso: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; title/description dentro de los topes, title con sufijo de marca y render con `lang="ru"`, ruta `/ru/` y hreflang cubiertos por tests. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador urdu: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos dentro de los topes y salida RTL con `lang="ur"`, `dir="rtl"`, ruta `/ur/` y hreflang cubiertos por tests. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador turco: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; title/description dentro de los topes y salida con `lang="tr"`, ruta `/tr/` y hreflang cubiertos por pruebas de contrato y render. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador vietnamita: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; title/description dentro de los topes y salida con `lang="vi"`, ruta `/vi/` y hreflang cubiertos por pruebas de contrato y render. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador italiano: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; title/description dentro de los topes y salida con `lang="it-IT"`, ruta `/it/` y hreflang cubiertos por pruebas de contrato y render. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador chino tradicional: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; title/description dentro de los topes y salida con `lang="zh-TW"`, ruta `/zh-tw/` y hreflang cubiertos por pruebas de contrato y render. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador búlgaro: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; title/description dentro de los topes y salida con `lang="bg-BG"`, ruta `/bg/` y hreflang cubiertos por pruebas de contrato y render. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador catalán: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; title/description dentro de los topes y salida con `lang="ca-ES"`, ruta `/ca/` y hreflang cubiertos por pruebas de contrato y render. Es traducción automática comprensible, no revisión nativa.
- [x] Borrador neerlandés: 252 cadenas indexadas, placeholders conservados; metadatos y render con `lang="nl-NL"`, ruta `/nl/` y hreflang cubiertos por pruebas. Traducción automática comprensible, no revisión nativa.
- [x] Borrador griego: 252 cadenas indexadas, placeholders conservados; metadatos y render con `lang="el-GR"`, ruta `/el/` y hreflang cubiertos por pruebas. Traducción automática comprensible, no revisión nativa.
- [x] Borrador malayo: 252 cadenas indexadas, placeholders conservados; metadatos y render con `lang="ms-MY"`, ruta `/ms/` y hreflang cubiertos por pruebas. Traducción automática comprensible, no revisión nativa.
- [x] Borrador polaco: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="pl-PL"`, ruta `/pl/` y hreflang cubiertos por pruebas. Traducción automática comprensible, no revisión nativa.
- [x] Borrador sueco: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="sv-SE"`, ruta `/sv/` y hreflang cubiertos por pruebas. Traducción automática comprensible, no revisión nativa.
- [x] Borrador tailandés: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="th-TH"`, ruta `/th/` y hreflang cubiertos por pruebas. Traducción comprensible, no revisión nativa.
- [x] Borrador ucraniano: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="uk-UA"`, ruta `/uk/` y hreflang cubiertos por pruebas. Traducción comprensible, no revisión nativa.
- [x] Borrador suajili: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="sw-KE"`, ruta `/sw/` y hreflang cubiertos por pruebas. Traducción comprensible, no revisión nativa.
- [x] Borrador maratí: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="mr-IN"`, ruta `/mr/` y hreflang cubiertos por pruebas. Traducción comprensible, no revisión nativa.
- [x] Borrador telugu: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="te-IN"`, ruta `/te/` y hreflang cubiertos por pruebas. Traducción comprensible, no revisión nativa.
- [x] Borrador hausa: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="ha-NG"`, ruta `/ha/` y hreflang cubiertos por pruebas. Traducción comprensible, no revisión nativa.
- [x] Borrador filipino: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render mantienen `<html lang="fil-PH">`, URL `/tl/` y hreflang `tl` conforme a la regla del proyecto. Traducción comprensible, no revisión nativa.
- [x] Borrador tamil: 252 cadenas indexadas, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` preservados; metadatos y render con `lang="ta-IN"`, ruta `/ta/` y hreflang cubiertos por pruebas. Traducción comprensible, no revisión nativa.
- [x] Borrador persa: 252 cadenas del home y los cinco pilotos, placeholders preservados, títulos y descripciones dentro de límites, `lang="fa-IR"`, ruta `/fa/` y render RTL cubiertos por pruebas. Traducción automática comprensible, no revisión nativa.
- [x] Borrador amhárico: 252 cadenas del home y los cinco pilotos, placeholders preservados, títulos y descripciones dentro de límites, `lang="am-ET"`, ruta `/am/` y render cubiertos por pruebas. Traducción automática comprensible, no revisión nativa.
- [x] Borrador gujarati: 252 cadenas del home y cinco pilotos, placeholders `{count}`, `{giver}`, `{recipient}` y `{player}` conservados, títulos/descripciones dentro de topes, render con `lang="gu-IN"`, rutas `/gu/` y `hreflang` cubiertos por pruebas y build real. Traducción automática comprensible, no revisión nativa.
- [x] Etiquetas hreflang: el renderer mantiene la ruta existente `/tl/` y `<html lang="fil-PH">`, pero emite `hreflang="tl"` según el código ISO 639-1 requerido por Google. Cubierto para páginas de herramienta y portada.
- [x] Integración de bundle checks al `npm test`; `npm run build:growth600` falla de forma cerrada con lista de locales faltantes y no genera salida. Con los 36 módulos presentes, el build real de revisión generó 216 páginas temporales.

## Criterio y decisiones vigentes

- Base intacta: las 277 herramientas existentes conservan sus rutas, lógica y metadatos. Ninguna se ha editado en este avance.
- Las nuevas páginas vivirán en el subdominio y proyecto estático gratuito separados; no poner más de 20.000 archivos en el Pages actual.
- No se añaden Workers de cómputo, Functions, APIs de conversión, R2, llamadas pagadas ni nueva investigación de DataForSEO.
- No se marca ninguna de las cinco fichas hasta tener el caso de aceptación, errores/límites, exportación o explicación de N/A, todos los textos/rutas localizados, budgets/licencias y publicación verificada.
- FABLE: la implementación aditiva se mantiene en `src/growth600/`; no se integró al catálogo ni al runtime root.

## Evidencia y límites

- `main` y rama base del plan: `685f91adfc7818a54f6dc0a967e290d13137a3dd`.
- Cloudflare Pages Free: [límites oficiales](https://developers.cloudflare.com/pages/platform/limits/) (consulta de 2026-10-07); [precio de peticiones estáticas](https://developers.cloudflare.com/pages/functions/pricing/); [dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/).
- Regresión completa con gujarati incluido: `npm test` — 889/889, 0 fallidos. `npm run build:growth600` generó correctamente 216 URLs en 36 idiomas (262 archivos, 3.519.822 bytes) en una carpeta temporal; auditoría estática de las 216 páginas pasó. No se lanzó PageSpeed, tal como pide el plan.
- El piloto de cinco herramientas está publicado en el host separado `tools.usefulverse.com` con 216 URLs en su sitemap. Las **35 candidatas adicionales de esta rama** (incluidas Solar, BTU, Brick, Rafter, Carpet, Aquarium, Grass Seed e Insulation Calculator) no se han fusionado ni publicado; el sitemap de producción de UsefulVerse no se modificó.

## Cierre técnico de la vista previa

- [x] Corregido el 404 local del favicon en la salida aislada: home y herramientas enlazan `/favicon.svg`, y el builder copia el recurso existente desde `public/favicon.svg`.
- [x] Build completo revisado de nuevo: 216 HTML, 216 `<loc>` en sitemap y enlace al favicon en las 216 páginas; el favicon se incluye como archivo estático en la salida. `npm test`: 888/888 y `git diff --check` sin errores.
- [x] Smoke HTTP tras la corrección: home Gujarati, calculadora, CSS y `/favicon.svg` respondieron 200; la repetición de recursos estáticos devolvió 304 según caché. En emulación táctil de 390 × 844 px, la calculadora Gujarati no tuvo desbordamiento horizontal; los controles mostraron nombres accesibles, el foco de teclado alcanzó el enlace para saltar al formulario y el cálculo 5 × 4 × 0,1 devolvió 20 m² / 2 m³.
- [x] Recorrido móvil representativo (390 × 844 px): las otras cuatro familias en inglés no tuvieron overflow horizontal ni controles sin nombre accesible. Se detectó en Mancala árabe que el skip-link oculto con `left:-9999px` provocaba un ancho de documento de 10.389 px pese al viewport móvil.
- [x] Corrección RTL compartida: el skip-link ahora se oculta verticalmente con `position: fixed` y transform, respetando `dir=rtl`; test de regresión añadido. Tras el fix, Mancala árabe mostró `dir=rtl`, viewport/documento de 390 px y ningún overflow global; tablero y hoyos conservan etiquetas accesibles.
- [x] Matriz automatizada de viewport móvil para las cinco familias en árabe, persa y urdu (15 rutas, 390 × 844 px): las 15 respetaron `dir=rtl`, no tuvieron overflow horizontal y no presentaron controles sin nombre accesible.
- [ ] Falta inspección visual manual en dispositivos físicos y muestreo visual adicional de traducciones no RTL. La matriz comprueba geometría/nombres accesibles, no cada traducción o dispositivo. Ninguno de estos cambios modifica el sitio principal.

## Próxima acción concreta

Este era el checkpoint inicial previo a #104 y quedó superado. El conteo actual y la siguiente candidata están al final de este archivo. Las fichas nuevas siguen fuera de producción hasta cerrar los gates globales C/F/E/X/L/B/P/S; el sitemap de producción no cambia y no se envían URLs de staging a buscadores. Las 277 rutas originales permanecen protegidas.

## Continuación · 2026-10-07

- [x] El builder ahora genera en un directorio de staging privado y renombra la salida solo después de pasar todas las comprobaciones. Si excede el máximo de archivos o el límite por archivo, elimina el staging y no deja un directorio de publicación parcial; mantiene la negativa a sobrescribir una salida existente.
- [x] Regresión focalizada después del cambio: `node --test src/growth600/build.test.mjs src/growth600/tools/growth600-logic.test.mjs` — 9/9 pruebas aprobadas, incluyendo exceso de archivos, exceso de tamaño y limpieza del staging tras rechazo. `git diff --check` pasó.
- [x] Build completo aislado de la tanda piloto: 216 HTML en 36 locales (5 herramientas + portada), 216 URL únicas en `sitemap.xml`, 262 archivos y 3.519.822 bytes. El resultado se generó bajo `/tmp` y no se desplegó.
- [ ] No se repitió `npm ci` completo: la instalación temporal comenzó a descargar runtimes binarios multiplataforma ajenos al piloto. Se detuvo para limitar espacio/recursos; las pruebas específicas y el build real anteriores sí terminaron. La regresión general previamente registrada (889/889) no sustituye una regresión completa tras integrar todo el lote.
- [ ] La revisión visual representativa del piloto ya está registrada abajo; faltan gates de release, P/S. El segundo Pages está creado pero sin dominio ni deployment. Este trabajo no publicó ni envió el sitemap y no cambió las 277 herramientas de producción.

## QA visual local · 2026-10-07

- [x] Chrome DevTools real: se revisaron visualmente las cinco rutas piloto en emulación móvil de 390 × 844 px; se capturaron además referencias de Mancala en tablet (768 × 1024) y escritorio (1440 × 900), y de la calculadora de grava en escritorio. La composición conserva jerarquía, controles visibles y lectura; no es una prueba en hardware físico.
- [x] Matriz de geometría repetida para las cinco herramientas en 390, 768 y 1440 px: `documentElement.scrollWidth` coincide con el viewport en las 15 combinaciones. Los cuatro formularios no presentan elementos desplazables inesperados; el único desplazamiento interno es el tablero de Mancala a 390 px (340 px visibles / 378 px de contenido), con seis hoyos y almacenes alcanzables por desplazamiento táctil. A 768 y 1440 px el tablero completo cabe.
- [x] Consola limpia en las cinco rutas en inglés. Teclado: primer Tab en Mancala enfoca el enlace accesible «Skip to tool»; los hoyos tienen nombre accesible por jugador, índice y semillas.
- [x] Muestreo RTL añadido: Mancala en urdu renderiza `lang="ur"`, `dir="rtl"`, sin overflow del documento a 390 px; un toque/clic legal conserva el total de 48 semillas tras la respuesta del rival. Muestreo CJK: masa molar en japonés no desborda, controles y mensajes están traducidos; H₂O da 18.015 g/mol y XeF4 recibe un error localizado.
- [ ] La inspección física en dispositivos reales y la lectura nativa/lingüística de las 36 traducciones siguen fuera de este QA; el plan solo exige una revisión visual representativa, pero estas limitaciones no deben presentarse como si fueran pruebas ya hechas. En ese QA del 2026-10-07 la publicación aún no estaba verificada; actualmente sí está confirmado el piloto, pero el envío/lectura del sitemap en paneles (P/S) sigue pendiente.
- [x] Workflow revisado: el build `growth600` se valida junto al pipeline existente; el deploy de `usefulverse-tools` requiere ejecución manual desde `main` con el input `publish_growth600=true`, y solo tras configurar el dominio y cerrar gates. Los nombres de los secretos Cloudflare requeridos existen en GitHub Actions (sus valores no se consultaron). YAML y `git diff --check` pasan. No se inició ningún workflow ni deploy en este paso.
- [x] Gate B local del piloto: la salida tiene 262 archivos y 3.519.822 bytes; los cinco controladores minificados son 3.820–4.858 B y CSS 5.785 B. El builder comprueba 20.000 archivos/24 KiB de asset, inspecciona que no haya requests remotos ni ejecución dinámica y el código del piloto solo usa módulos locales/APIs nativas. `esbuild` es dependencia de build MIT; no se empaqueta en el navegador. No se añadieron Functions, APIs, fuentes externas ni servicios facturables.

## Continuación · Fence Calculator (#093) · 2026-10-08

- [x] Herramienta aditiva y una sola intención por ruta: estima tramos rectos, aperturas de puertas, postes extremos, paneles o piquetes como alternativas, separación ajustada, desperdicio y costes opcionales. No ofrece ubicaciones exactas de puertas; divide el tramo restante uniformemente y lo explica en la interfaz y FAQs.
- [x] Aceptación de sección aislada: el modelo siempre cuenta dos postes extremos. Ejemplo 100 ft con una abertura de 48 in produce 2 secciones de 48 ft, 14 postes, 12 paneles base/14 con extra y 156 piquetes base/172 con extra.
- [x] La lógica valida unidades métricas/imperiales, cantidades y máximos; los costes permanecen opcionales y solo se muestran con datos suficientes. Añadí regresión para gaps físicamente superiores a 1 m y corregí la validación que comparaba pulgadas directamente con metros.
- [x] Suite específica final: 80/80 pruebas aprobadas incluyendo catálogo aditivo, formularios, contrato de los 36 idiomas, renderer, builder, límites de bundle y lógica.
- [x] Build aislado de lote: 576 páginas (15 herramientas × 36 idiomas + 36 portadas), 576 URLs de sitemap, 632 archivos y 11.763.123 bytes. Las 36 páginas Fence tienen canonical, 37 alternates hreflang, FAQPage, idioma correcto, title ≤60, descripción ≤160 y sin marcadores `undefined`.
- [x] Controlador minificado: 6.383 B (≤24 KiB), local, sin API ni llamadas externas. No añade funciones de servidor ni coste por ejecución.
- [x] Chrome DevTools local: ejemplo funcional en inglés; consola limpia. Árabe RTL comprobado a 390 y 1.440 px: documento sin overflow (390/390 y 1.440/1.440); ejemplo arroja los mismos totales. No se probaron dispositivos físicos.
- [ ] Las traducciones son borradores automáticos y no revisión humana nativa. No se ejecutó Lighthouse/PageSpeed por instrucción del proyecto. Ninguna URL de este candidato se publicó; sitemap de producción, buscadores y las 277 herramientas originales no cambiaron. Gates C/F/E/X/L/B/P/S continúan abiertos para release coordinado.

## Continuación · Pool Salt Calculator (#094) · 2026-10-08

- [x] C — ID aditivo, intención diferenciada de `pool-volume-calculator` y colisión con las 277 herramientas protegidas comprobados por el catálogo. Los enlaces a otros candidatos solo aceptan IDs existentes y prohíben autorreferencias.
- [x] F/E — volumen, salinidad medida/objetivo, pureza y bolsas; conversiones L/galón US/galón imperial y kg/lb. Aceptación: 1.000 L × 1.000 ppm = 1 kg de sal pura. Se prueban pureza 99%, redondeo de bolsas, salinidad igual/por encima del objetivo y rechazos de límites/unidades.
- [x] X — ejemplo, cálculo, copia y reinicio. Chrome local confirmó copia y resultado de 1 kg; entrada cero produce un aviso de error y mantiene enfocado el control. No exporta archivos, así que descarga/importación no aplica.
- [x] L — copy y metadatos en 36 idiomas; tests verifican los campos, dos FAQs adicionales y el contrato de idioma. QA corrigió “pool” como “grupo” en el aviso español, “pounds” como moneda en árabe y el rótulo de ajuste por pureza; además, localizó el título y nombre español, que mezclaban inglés. Son borradores automáticos, no traducciones revisadas por nativos.
- [x] B local — build estático real: 612 HTML/URLs (16 herramientas × 36 idiomas + 36 portadas), 669 archivos y 12.569.293 bytes; sitemap de staging con 612 URLs únicas. El builder conserva su presupuesto de 20.000 archivos y 24 KiB, y los bundles no incluyen llamadas remotas ni ejecución dinámica. Sin Functions, R2 ni servicio de conversión.
- [x] Chrome local: ejemplo de 1.000 L → 1 kg probado; español actualizado con título “Calculadora de sal para piscina gratis” y H1 “Calculadora de sal para piscinas”, anchos sin overflow en 390, 768 y 1.440 px, consola vacía; árabe RTL validado en 390 px, copia funcional y consola vacía. No se probaron dispositivos físicos ni se hizo PageSpeed/Lighthouse.
- [x] Auditoría estática corregida: 612 URLs únicas con fichero, canonical propio, H1 y 37 alternates hreflang en cada página. Se decodificaron entidades HTML antes de comprobar longitudes de title/description (evita contar `&#39;` como seis caracteres); también se descartó el falso positivo del detector sobre el texto alemán “größer als null” (mayor que cero). Cero problemas en las 612 páginas.
- [ ] `npm test` completo del repositorio y pipeline de release no ejecutados. Suite focalizada de catálogo/formularios/idiomas/render/build/bundles/lógica: 82/82 aprobadas. No hubo revisión humana nativa de las traducciones.
- [ ] P/S abiertos: sin merge, deploy, altas ni envíos de sitemap a buscadores. #094 sigue sin marcar en `PLAN-600.md`; sitemap de producción y las 277 herramientas originales no cambiaron.

## Continuación · Roofing Calculator (#078) · 2026-10-07

- [x] Herramienta de estimación local diferenciada de `roof-pitch`: convierte área proyectada en superficie inclinada, aplica desperdicio configurable, calcula cuadrados de cubierta, paquetes enteros de tejas y coste opcional. No promete ajuste estructural, cumplimiento normativo ni presupuesto profesional.
- [x] Aceptación y validación: con 1.200 ft², pitch 6:12, 10% de extra y 3 paquetes/cuadrado calcula 1.341,64 ft² inclinados, 1.475,8 ft² de pedido, 14,76 cuadrados y 45 paquetes; a 36 por paquete, total 1.620. Rechaza rise=0 y límites/entradas inválidas; reset, copia y foco/error comprobados.
- [x] Copy y metadata en los 36 idiomas, con dos FAQ y aviso de estimación; títulos ≤60 y descripciones ≤160 caracteres. Textos autogenerados/traducidos como borrador comprensible, no revisión nativa. QA estático confirma lang, 37 hreflang, canonical, FAQPage y ausencia de marcadores o undefined en todas las rutas.
- [x] Gates focalizados: 68/68 pruebas de catálogo/formularios/contratos/build y lógica aprobadas; `git diff --check` sin errores. Bundle minificado 4.031 B, sin servicios de conversión ni llamadas externas de runtime.
- [x] Build aislado: 504 URLs únicas de sitemap (468 herramientas + 36 portadas), 558 archivos y 9.872.395 bytes; todas las 36 páginas de Roofing pasan la auditoría estática. El contenido generado solo estuvo en `/tmp`; no es producción.
- [x] Chrome DevTools local: recorrido inglés con el ejemplo y validación; Arabic RTL a 390×844, sin overflow horizontal, controles sin nombre ausente ni errores de consola. Inspección puntual del ejemplo y coste; no equivale a hardware físico o revisión humana de 36 traducciones.
- [ ] No desplegado ni remitido a los buscadores. Se conserva en esta rama hasta cerrar los gates de release globales; no se modificó el sitemap de producción ni el catálogo de las 277 herramientas existentes.

## Continuación · Deck Calculator (#083) · 2026-10-07

- [x] Herramienta diferenciada de `board-foot-calculator`: calcula superficie rectangular, filas de tablas con separación, piezas/tablones de stock con allowance conservadora de desperdicio, líneas de apoyo y fijaciones estimadas. Si el stock es corto, informa las uniones aproximadas; exige planificar y apoyar cada unión, sin fingir un cut map.
- [x] Unidades separadas para la estructura y las tablas/apoyos: el ejemplo legible usa 16 × 12 ft, tabla de 5,5 in, gap de 0,25 in, tabla stock de 16 ft y apoyos cada 16 in. Devuelve 26 filas, 29 piezas con 10% extra, 13 líneas de apoyo y 676 fijaciones; si las tablas son de 8 ft, muestra 26 uniones. Evita conversiones manuales y números largos en la UI.
- [x] Copy, metadata, FAQ, units y avisos en 36 idiomas. Títulos ≤60, descriptions ≤160 en el contenido decodificado, canonical y 37 alternates en cada ruta. Traducción automática estática; no se vende como revisión nativa.
- [x] Suite focalizada tras la integración de unidades: 70/70 aprobadas, incluido build y bundle bajo 24 KiB; Deck bundle 4.584 B. Build real temporal: 540 páginas de sitemap (504 tools + 36 home), 540 URLs únicas, 595 archivos y 10.783.628 bytes. Auditoría de las 36 páginas de Deck aprobada.
- [x] Chrome DevTools: ejemplo, coste opcional, conteo conservador con juntas de tablones cortos y rechazo/foco de dimensión inválida; la muestra árabe en RTL a 390 × 844 no desborda (390 px document/body) ni presenta consola con errores ni inputs/selects sin etiqueta.
- [ ] `npm test` ejecutado en el clon temporal, pero no puede dar verde total con las dependencias ausentes del checkout (`prettier`, `fflate` y variantes `to-words/*`); fallan suites ajenas por `ERR_MODULE_NOT_FOUND`. No se instaló el conjunto completo porque incluye dependencias grandes no necesarias para este piloto. Las 70 pruebas focalizadas sí pasan; CI limpio sigue siendo gate antes de publicar.
- [ ] No desplegado ni enviado a buscadores; el sitemap de producción sigue intacto.

## Publicación del piloto · 2026-10-07

- [x] PR #37 integrada en `main`: merge commit `0ee5ae80149ec26d6aeb0f6c1e74e5d9c9b42ae7`. Pipeline completo de `main` correcto (run `37631460233`); despliegue habitual del sitio principal completado sin cambios en sus 277 herramientas.
- [x] Dominio personalizado conectado al proyecto Pages separado: `tools.usefulverse.com` → CNAME proxied hacia `usefulverse-tools.pages.dev`; Cloudflare reporta estado `active`. El registro DNS fue creado únicamente después de asociar el dominio al proyecto.
- [x] Hub piloto publicado por el workflow manual aprobado desde `main` (run `37632022388`, conclusión `success`). Proyecto: `usefulverse-tools`; salida estática, sin Functions ni APIs.
- [x] Smoke público: home, grava en inglés, Mancala en español y urdu, y masa molar en japonés respondieron HTTP 200. Verificados robots.txt, canonical en urdu y hreflang inglés/urdu.
- [x] Sitemap servido en `https://tools.usefulverse.com/sitemap.xml`: 216 URLs (36 portadas + 5 herramientas × 36 idiomas). Comprobación HTTP de las 216 URLs: 216 respuestas 200, cero fallos.
- [ ] Aún no se ha enviado el nuevo sitemap a Search Console/Bing/Yandex/Naver ni verificada su recepción. No afirmar que ya fue aceptado o indexado; continuar esta fase solo después de inspeccionar el estado de propiedades y usar los accesos autorizados disponibles.
- [ ] La nueva sección del sitemap vive en el subdominio separado; registrar enlaces HTML contextuales entre la home/catálogo UsefulVerse y el hub en el siguiente cambio de arquitectura, sin sugerir que las visitas por sí solas transfieren autoridad o elevan rankings del dominio raíz. Las páginas del hub pueden posicionarse por sí mismas; los enlaces rastreables pueden comunicar relación y señales entre páginas. No migrar URLs sin decisión y plan de redirects/canónicos.
- [ ] El objetivo 277→600 sigue incompleto: las cinco herramientas del piloto están publicadas, pero faltan las siguientes tandas de herramientas únicas y sus localizaciones, QA, documentación y sitemaps.

## Continuación · Tire Size Calculator (#016) · 2026-10-07

- [x] Contrato aditivo y deduplicación: calculadora geométrica de medidas métricas `ancho/perfilRllanta`; amplía la comparación de neumáticos y enlaza solo a la herramienta existente de conversión de unidades. El test de catálogo vuelve a comprobar colisiones/IDs contra las 277 herramientas protegidas.
- [x] Función y límites: diámetro, altura de flanco, circunferencia, vueltas/km, diferencia porcentual, cambio de altura libre y velocidad estimada; se limita la entrada a neumáticos métricos convencionales y a velocidades 1–300 km/h o 1–200 mph. Se muestra que no certifica ajuste, seguridad ni legalidad.
- [x] Localización: interfaz, FAQ y metadatos para 36 idiomas; el contrato obliga dos FAQ extra completas (compatibilidad y cálculo de velocidad), además de las dos FAQ comunes. Se generan cuatro FAQ útiles en cada una de las 36 páginas.
- [x] Pruebas focalizadas: `node --test src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/locale-utils.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs src/growth600/tools/growth600-logic.test.mjs` — 61/61 aprobadas. Incluye cálculo de aceptación 205/55R16, tamaños idénticos, entradas inválidas, velocidades fuera de rango, cobertura completa de copy, FAQs y build seguro.
- [x] Build estático de los seis candidatos actuales: 252 HTML localizados (6 herramientas × 36 idiomas + 36 portadas), sitemap con 252 URLs únicas, 299 archivos y 4.226.339 bytes. Auditoría HTML de las 252 rutas confirma canonical propio, title/description, hreflang presente y ausencia de `undefined`; las 36 páginas de neumáticos contienen cuatro FAQ.
- [x] Recorrido en Chrome móvil (390 × 844): español, japonés y árabe; ejemplo real en japonés/árabe produce 631,9/634,3 mm, velocidad estimada 100,4 km/h, traducción y dirección RTL apropiadas, sin overflow. Español: tamaño idéntico produce diferencia cero; una entrada de 201 mph se rechaza, enfoca el campo y marca `aria-invalid`.
- [x] Recorrido visual adicional en escritorio (1440 × 900) y tablet (768 × 1024): sin desbordamiento; cuatro FAQ visibles, controles etiquetados, consola limpia. La navegación cargó solamente HTML/CSS/JS locales. El enlace al conversor actual de UsefulVerse respondió HTTP 200.
- [ ] Regresión completa del repositorio (`npm test`) no se ejecutó en este turno: faltan dependencias ajenas a esta tanda; no usar el resultado focalizado para afirmar que toda la suite es verde. Tampoco se probaron dispositivos físicos ni se hizo revisión humana nativa de 36 traducciones.
- [ ] Gates P/S de #016 pendientes: no integrado ni desplegado; sitemap de producción no cambia y no se envió a buscadores. Por ello la casilla de #016 en `PLAN-600.md` permanece sin marcar. No se declara candidato publicado.

## Continuación · Stair Calculator (#052) · 2026-10-07

- [x] Función local: calcula altura total, número entero de contrahuellas, altura de cada contrahuella, huellas (una menos que las contrahuellas), recorrido, ángulo y larguero aproximado; dibuja perfil lateral SVG y admite m/cm/ft/in. Ejemplo: 2,8 m, 16 contrahuellas y huella de 0,28 m → 0,175 m por contrahuella, 15 huellas, recorrido de 4,2 m y larguero aproximado de 5,0478 m.
- [x] Límite de seguridad del producto: es solo geometría; no consulta ni certifica normativa, altura libre, descansillos, estructura, barandas ni condiciones de obra. La interfaz lo indica y deriva la verificación a normativa local y profesional cualificado. No se añadieron servicios externos ni coste de ejecución.
- [x] Sin canibalización añadida: una única intención/URL por idioma, vínculo contextual al conversor de unidades existente; el catálogo conserva comprobación de unicidad y colisión contra herramientas existentes.
- [x] Interfaz y FAQs localizadas en 36 idiomas; títulos y descripciones pasan los límites automáticos del release contract. Se requieren dos FAQs adicionales completas por idioma.
- [x] Pruebas focalizadas: `node --test src/growth600/tools/growth600-logic.test.mjs src/growth600/forms.test.mjs src/growth600/catalog.test.mjs src/growth600/locale-contract.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs` — 59/59 aprobadas. Incluye conversión de unidades, rango y entradas enteras, límites, controles, FAQs, hreflang y builder.
- [x] Build aislado real: 288 HTML estáticos para 7 candidatos × 36 idiomas + 36 portadas; sitemap con 288 URLs únicas; 336 archivos, 4.901.689 bytes. Auditoría de las 36 páginas de escaleras: canonical/title presentes, 37 hreflang (36 idiomas + x-default), SVG y sin `undefined`.
- [x] Chrome DevTools: ejemplo válido, salida métrica e imperial, error de 1,5 contrahuellas con `aria-invalid`, reinicio y dibujo SVG; 390 × 844 sin overflow. Árabe comprobado en 390, 768 y 1440 px: `dir=rtl`, sin overflow, cuatro FAQs y salida traducida. Consola limpia; únicamente HTML/CSS/JS/favicon del servidor estático local fueron solicitados.
- [ ] No se probaron dispositivos físicos ni se hizo revisión nativa humana de las 36 traducciones. La salida local es de staging, no es publicación. No cambia el sitemap de producción ni se envió a buscadores.
- [ ] F4/P/S siguen pendientes; `PLAN-600.md` permanece sin marcar para #052 hasta pasar los gates de release. Cloudflare CLI devolvió 502 en comprobación previa; no se intentó cambiar/deplegar recursos de Cloudflare.

## Continuación · Asphalt Calculator (#057) · 2026-10-07

- [x] Contrato distinto del calculador de hormigón: estima pavimento asfáltico por área y espesor compactado, convierte volumen a masa/toneladas y permite presupuesto opcional con precio introducido por la persona. Enlaza a la herramienta existente de hormigón solo como alternativa para otra intención. El test aditivo protege los IDs originales.
- [x] Fórmula y límites: unidades métricas/imperiales de área, espesor y densidad; volumen compactado y volumen de pedido con desperdicio 0–30%; toneladas métricas y short tons; precio solo por tonelada métrica, sin asumir moneda ni sumar entrega, mano de obra, impuestos o cargos. No presenta el valor por defecto de 2.400 kg/m³ como dato de proveedor.
- [x] Pruebas de lógica, errores y renderer: la suite focalizada `node --test src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/locale-utils.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs src/growth600/tools/growth600-logic.test.mjs` pasa 65/65. Incluye la aceptación 100 m² × 0,05 m × 2.400 kg/m³ = 12 t, conversiones imperiales, coste/desperdicio, rangos y rechazo de unidades no soportadas.
- [x] Localización y salida estática: copy presente para 36 idiomas. Build aislado real: 324 páginas (8 herramientas × 36 + 36 portadas), 324 URLs sitemap únicas, 373 archivos, 5.688.221 bytes reportados por el builder. Auditoría de cada una de las 36 páginas de asfalto: canonical propio, `lang`, 37 alternates `hreflang`, title ≤60 y description ≤160 caracteres (contados tras decodificar entidades), H1, FAQPage, controlador y sin `undefined`, `null` ni marcadores de traducción filtrados.
- [x] Budget/carga inicial: CSS común 6.065 B; controlador de asfalto 4.049 B; sin fetch, WebSocket, XHR, servicios externos ni ejecución dinámica en el controlador. El navegador pidió solo HTML, CSS, JS de esta herramienta y favicon desde el servidor local.
- [x] Chrome DevTools, inglés: ejemplo devuelve 5 m³ compactados, 12 t y 13,228 short tons; con 5% extra y precio 95 devuelve 5,25 m³, 12,6 t y coste 1.197. También se comprobó 100 ft² × 2 in × 150 lb/ft³ = 1,134 t. Copiar muestra estado localizado.
- [x] RTL: árabe con `lang="ar"` y `dir="rtl"`; sin overflow a 390, 768 o 1.440 px. Ejemplo, etiquetas, cuatro FAQ y enlace relacionado se muestran en árabe; consola sin errores.
- [ ] No se han probado dispositivos físicos ni se ha hecho revisión humana nativa de los 36 borradores de traducción. El cálculo es una estimación de planificación, no una especificación de mezcla ni una cotización.
- [ ] Gates P/S pendientes: candidato sin merge ni deploy, producción/sitemap de producción intactos y sin envíos a buscadores. La casilla C/F/E/X/L/B/P/S de #057 sigue abierta hasta completar la publicación conjunta y verificar sitemap/URL pública.

## Continuación · Soil Calculator (#060) · 2026-10-07

- [x] Intención distinta de calculadoras de cobertura/mulch: estima volumen para camas rectangulares y macetas cilíndricas; varias unidades iguales, porcentaje extra y número entero de bolsas opcional. Sin cálculo de peso, nutrientes ni cobertura de terreno.
- [x] Lógica local con m/cm/ft/in, litros/ft³ para bolsas y límites explícitos; aceptación: recipiente cúbico de 1 m = 1 m³. Los resultados aclaran que macetas cónicas, asentamiento y drenaje cambian la compra real.
- [x] Formularios accesibles: campos condicionados por forma, cálculo, copia, ejemplo, restablecimiento y errores con `aria-invalid`/anuncio. Pruebas focalizadas: `node --test src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/locale-utils.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs src/growth600/tools/growth600-logic.test.mjs` — 67/67 aprobadas.
- [x] Copy estático para 36 idiomas, con FAQs, controles y metadatos que pasan el contrato automatizado. Son borradores de traducción automática comprensibles; no revisión humana nativa. No se invoca ningún traductor desde producción.
- [x] Builder temporal real: 360 páginas (9 herramientas × 36 + 36 portadas), 360 URLs únicas de sitemap y 410 archivos / 6.529.589 bytes. Auditoría de las 36 rutas de suelo: canonicals, alternates, idioma, metadata dentro del contrato, FAQ, controlador presente y sin cadenas `undefined`.
- [x] Presupuesto y privacidad: controlador minificado 4.606 B (≤24 KiB); código de cálculo se ejecuta en el dispositivo. Navegador local pidió solo los recursos estáticos del sitio, sin API, fetch externo, XHR o WebSocket del módulo.
- [x] Chrome DevTools: cubo de 1 m, cama múltiple con desperdicio/bolsas, maceta circular convertida desde centímetros y error por cantidad fraccionaria; reset limpia campos, error y resultados. A 500 px no hubo desbordamiento horizontal; consola limpia.
- [ ] `npm test` completo no se volvió a ejecutar después de esta candidata: el intento global previo señaló dependencias/pruebas ajenas incompletas (`prettier`, `to-words/gu-IN`). La suite focalizada de esta candidata sí pasa. Sin dispositivos físicos ni revisión nativa de cada borrador.
- [ ] #060 permanece en staging local: sin merge, deploy, cambio de sitemap de producción ni envío a buscadores. C/F/E/X/L/B/P/S se cierra en la publicación coordinada y comprobación online, no durante el build local.

## Continuación · Pool Volume Calculator (#067) · 2026-10-07

- [x] Una URL por idioma que agrupa piscinas rectangulares, circulares y ovaladas; fondo plano o inclinado con promedio de profundidad. El contrato la distingue de la calculadora general de volumen existente. No genera URL por forma ni por unidad.
- [x] Fórmula local con metros, centímetros, pies y pulgadas; volumen en m³, litros, galones estadounidenses y galones imperiales claramente separados. Aceptación 2 × 3 × 1 m = 6.000 L. El aviso aclara límites de geometría y recomienda usar capacidad verificada del fabricante para dosificar químicos.
- [x] Suite focalizada final: 70/70 aprobadas (`catalog`, forms, 36-locale contract/utils, render, build, controller bundle y lógica). Incluye tres formas, conversión imperial, fondo inclinado, rangos, metadata y FAQs.
- [x] Localización estática en 36 idiomas y dos FAQs por idioma. Title con marca UsefulVerse preservada y límites del release contract cumplidos. Traducción automática comprensible; no revisión nativa humana.
- [x] Build temporal final: 396 páginas (10 candidatos × 36 + 36 portadas), 396 URLs únicas de sitemap, 447 archivos / 7.387.218 bytes. Auditoría de las 36 páginas pool: metadata, canonical, hreflang, FAQPage, controlador presentes y sin `undefined`.
- [x] Budget/privacy: JS minificado 4.583 B (≤24 KiB), sin red externa ni ejecución dinámica; herramienta se calcula en navegador. La salida de staging fue local, estática y no agrega Functions/APIs.
- [x] Chrome DevTools local: ejemplo válido 6.000 L/1.585 US gal/1.320 imp gal; óvalo inclinado de 8×4 m y profundidad media de 1,5 m devuelve 37.699 L. Cero de entrada activa `aria-invalid`, enfoca campo y anuncia error; reset limpia estado. A 390 px no hay overflow; muestra árabe RTL con `lang=ar`, `dir=rtl` también sin overflow; consola sin errores.
- [ ] No se probaron hardware físico ni revisión nativa de 36 borradores. Candidato #067 en staging: sin deploy, sin sitemap de producción actualizado y sin envío a motores. Los gates C/F/E/X/L/B/P/S solo se cierran en la publicación conjunta con comprobación de URLs públicas.

## Continuación · Wallpaper Calculator (#097) · 2026-10-08

- [x] Implementada como herramienta diferenciada de `paint-calculator`: calcula tiras por perímetro y ancho de rollo, ajusta cada caída al patrón repetido, añade 10 cm de margen de corte, estima caídas por rollo y descuenta aperturas proporcionalmente. La página explica que es una estimación de planificación, no un plano de corte por pared ni una alineación exacta del patrón.
- [x] Cálculo local y acotado, con metros/pies, desperdicio configurable y validación de valores. Aceptación: 12 m × 2,4 m, rollo 0,53 m × 10,05 m, sin desperdicio = 6 rollos; patrón de 0,32 m = 8 rollos. El resultado aumenta con el desperdicio y las entradas inválidas/rangos no admitidos se rechazan.
- [x] 36 copias de idioma con labels, acciones, mensajes, metadatos y FAQs; contratos rechazan campos faltantes y desborde de límites de metadatos. Son borradores de traducción automática comprensibles; no revisión humana nativa. La traducción se materializa antes de publicar: no hay llamada de traducción en tiempo de ejecución.
- [x] Regresión focalizada de catálogo, formularios, contratos, utilidades de locale, renderer, builder y lógica: **86/86 aprobadas**. El build separado real produjo 648 páginas (17 herramientas × 36 locales + 36 portadas), 648 URLs de sitemap, 706 archivos y 13.395.741 bytes; no se reejecuta sobre una carpeta existente, de acuerdo con el guard del builder.
- [x] Auditoría estática de las 36 URLs de Wallpaper: 36 presentes en el sitemap, canonical propio, 37 alternates hreflang, título ≤60 caracteres, descripción ≤160 y sin marcadores `undefined`/traducción filtrados. Bundle minificado del controlador: 4.248 B, bajo el límite de 24 KiB. `git diff --check` pasó.
- [x] QA de Chrome DevTools local: ejemplos de aceptación de 6 y 8 rollos; árabe con `lang="ar"`, `dir="rtl"` y cálculo visible; en viewport móvil 390×844 y escritorio 1440×900 no aparece desbordamiento horizontal. Consola sin errores ni warnings.
- [ ] No probado en hardware físico ni revisado por hablantes nativos. No se ejecutó el `npm test` global completo en este paso; pasó la suite focalizada. No hay PageSpeed/Lighthouse por instrucción expresa del proyecto.
- [ ] Solo staging local en rama de trabajo: sin merge, dominio/DNS, deploy, sitemap de producción o envío a buscadores. Los gates P/S de publicación quedan abiertos; el candidato #097 sigue sin marcar en `PLAN-600.md` hasta que el release coordinado verifique la URL pública.

## Continuación · Roof Pitch Calculator (#071) · 2026-10-07

- [x] Función local enfocada a una intención: calcula pendiente como X:12 y porcentaje, ángulo en grados/radianes y longitud geométrica aproximada de la viga; acepta altura, recorrido horizontal y alero opcional en m/cm/mm/ft/in. La aceptación 3:3 devuelve 12:12, 100%, 45° y 4,24 m; con 0,5 m de alero devuelve 4,61 m.
- [x] No pretende sustituir cálculo estructural, normativa, cargas, ventilación o impermeabilización; advierte que se consulte a un profesional. Sin solaparse con la calculadora de triángulos existente: se añadió enlace contextual a esa herramienta para la geometría general.
- [x] Textos y FAQs estáticos para los 36 idiomas; no hay servicio de traducción en producción. Son borradores automáticos comprensibles, no revisados por hablantes nativos.
- [x] Suite focalizada tras añadir la herramienta: 72/72 aprobadas (catálogo, formularios, contratos de idioma, renderer, builder, bundle y lógica).
- [x] Build local aislado: 432 páginas HTML (11 herramientas × 36 idiomas + 36 portadas), 432 URL únicas en el sitemap; 484 archivos / 8.130.911 bytes. Las 36 páginas de techo tienen canonical, 37 alternates hreflang (36 idiomas + x-default), FAQPage y controlador con hash; sin placeholders.
- [x] JS minificado de la herramienta: 3.247 B (≤24 KiB); el cálculo permanece en el dispositivo y no añade API, Worker ni dependencia remota.
- [x] Chrome DevTools: entrada 3 m / 3 m y alero 0,5 m mostró 12:12, 100%, 45°, 0,79 rad y 4,61 m. Árabe móvil a 390 × 844 px: `dir=rtl`, ancho del documento 390 px, sin overflow y consola limpia.
- [ ] No se probaron dispositivos físicos ni hubo revisión nativa humana de las 36 traducciones. El build y QA son de staging local: no se desplegó, el sitemap de producción no cambió y no se mandó a buscadores. Gates C/F/E/X/L/B/P/S continúan para el release coordinado.

## Continuación · Drywall Calculator (#077) · 2026-10-07

- [x] Una URL por idioma para presupuestar paredes y, opcionalmente, techo en varias habitaciones iguales; resta el área total de ventanas/puertas por habitación. No crea rutas separadas por techos, paredes, placas, tornillos o coste.
- [x] Estima hojas enteras por superficie neta y desperdicio (0–30%), cobertura nominal, tornillos según cantidad editable por placa, juntas lineales aproximadas por disposición geométrica básica y coste opcional por placa sin asumir moneda. Aceptación: habitación de 4 × 3 × 2,5 m, techo incluido, sin aperturas ni desperdicio, placas 1,2 × 2,4 m → 47 m² y 17 placas que cubren 48,96 m².
- [x] Conversión correcta de dimensiones y aperturas cuadradas entre m/cm/mm/ft/in. Test imperial comprobado: 10 × 8 × 8 ft, 20 ft² de aperturas, solo paredes y placas 4 × 8 ft → 268 ft² netos y 9 placas. Se corrigió una conversión de aperturas que detectó el test antes de QA.
- [x] Límites visibles: es una estimación por área, no un plano de corte ni una especificación de juntas, tornillos, resistencia al fuego/humedad/acústica o cumplimiento normativo; desperdicio/offcuts y disposición pueden cambiar la compra real. Precio interpretado en la moneda que introduce la persona.
- [x] Copia y FAQs estáticos para 36 idiomas; títulos/descripciones, canonical, `lang`, 37 hreflang y FAQPage pasan el control de las 36 rutas. Se eliminaron saltos de línea del texto traducido de metadatos antes de generar HTML. Traducciones automáticas comprensibles, no revisión nativa humana.
- [x] Pruebas focalizadas: 74/74 (`catalog`, renderer, contratos, idiomas, builder, bundle y lógica); bundle JS 5.215 B (≤24 KiB). Build aislado: 468 páginas (12 × 36 herramientas + 36 portadas), 468 URLs sitemap únicas, 521 archivos y 9.051.968 bytes.
- [x] Chrome DevTools: ejemplo muestra 47 m², 17 placas, cobertura 48,96 m², 544 tornillos y 48 m de juntas aproximadas; apertura mayor al área de pared enfoca y marca el campo con `aria-invalid`; reset limpia. Flujo imperial con precio devuelve 268 ft², 9 placas, 288 ft² de cobertura, 288 tornillos y coste 108. Árabe móvil 390 × 844: `dir=rtl`, ancho total 390 px y consola limpia.
- [ ] Sin dispositivos físicos ni revisión nativa humana de los 36 textos. Build/QA son staging local. Ninguna ruta nueva publicada; sitemap de producción y buscadores intactos. Gates C/F/E/X/L/B/P/S siguen abiertos hasta release coordinado.

## Continuación · Image Region Redactor (#098) · 2026-10-08

- [x] Herramienta local de privacidad por regiones, diferenciada del mosaico global y del recortador: cargar una imagen, añadir varias regiones por coordenadas o arrastrando, deshacer/quitar/limpiar, elegir negro sólido/pixelado/desenfoque y exportar una copia PNG/JPEG. El original del usuario no se sobrescribe. Negro sólido se identifica como opción más fuerte; el copy advierte que pixelación/desenfoque no garantizan ocultación segura.
- [x] Límites explícitos: imágenes raster que el navegador pueda decodificar (PNG/JPEG/WebP/GIF/AVIF/BMP), 24 megapíxeles máximo y consumo de RAM/compatibilidad del dispositivo. Sin carga a servidor, API ni petición externa de procesamiento.
- [x] Robustez: validación de dimensiones/regiones/modos; invalida y revoca exportaciones viejas al cambiar imagen/región/efecto; ignora decodificaciones/exportaciones asíncronas obsoletas; errores de decodificación/exportación anunciados y botón reactivado; canvas temporal liberado.
- [x] Copy, FAQs, labels y metadatos estáticos en 36 idiomas. Se corrigió el generador para reanudar drafts sin perder strings nuevos y no cortar la última palabra del título cuando ya cabe. Las traducciones son borradores automáticos comprensibles, no revisión humana nativa. La prueba permite términos matemáticos traducidos (p. ej. «null» alemán) y detecta marcadores reales.
- [x] Suite focalizada de catálogo, forms, copy, locales, renderer, builder, bundles y lógica: **90/90 aprobadas**. El builder produjo 684 páginas estáticas (18 herramientas × 36 idiomas + 36 portadas), 684 URLs únicas en el sitemap, 743 archivos y 14.334.799 bytes. Auditoría de las 684 rutas: canonical propio, title ≤60, description ≤160 (longitudes tras decodificar entidades HTML), 37 alternates hreflang y sin marcadores. Controlador minificado: 8.129 B (límite 24 KiB). No se ejecutó PageSpeed/Lighthouse ni la suite total del repositorio.
- [x] QA Chrome local: PNG sintético con región negra verificada en píxel exportado `[0,0,0,255]`; píxel exterior intacto `[20,40,220,255]`; enlace/descarga y export JPEG MIME `image/jpeg` probados; cambio de modo invalida el enlace previo; consola limpia y cero peticiones externas de la página.
- [x] Ruta árabe comprobada con `lang=ar`, `dir=rtl`, formulario presente y sin overflow en el viewport reportado por el navegador (500 px); no se probó un teléfono físico.
- [ ] **No publicar todavía:** candidata local en rama `codex/growth600-tire-size-phase`, no integrada ni desplegada; sitemap de producción y Search Console/Bing/Yandex/Naver sin cambios. No se han cerrado los gates coordinados C/F/E/X/L/B/P/S ni se debe marcar #098 en `PLAN-600.md`. El push de esta rama no activa el workflow de producción.
- [ ] Falta QA en hardware/dispositivos físicos y revisión humana de traducciones; tampoco se ha ejecutado la suite global del repositorio. Esta evidencia cubre el candidato local, no equivale a certificar 100% de archivos/dispositivos/navegadores.

## Continuación · Image Sharpener (#109) · 2026-10-08

- [x] Herramienta diferenciada del mosaico/redactor y del recortador: afilado local con máscara de enfoque y controles de intensidad, radio y umbral; comparación con el original; vista previa reducida y exportación PNG/JPEG a las dimensiones de origen. No promete reconstruir detalle perdido ni aplica un editor general.
- [x] Límites y seguridad visibles: acepta formatos raster que el navegador pueda decodificar; máximo 8 megapíxeles; usa memoria/CPU del dispositivo; original nunca se sobrescribe ni se envía a un servidor. GIF animado se exporta como imagen fija y no conserva movimiento. Intensidad cero deja los píxeles RGBA decodificados sin cambios en el procesamiento; PNG conserva los valores probados. JPEG se indica como codificación con pérdida.
- [x] Procesamiento: blur separable por filas con memoria temporal acotada; exportación cede el hilo entre lotes, invalida resultados viejos, revoca URLs de Blob y libera canvas/bitmap. Ajustar controles no duplica eventos de rango `input`/`change`.
- [x] Catálogo e interfaces aditivos; copia estática en 36 idiomas, con título/descripción bajo contrato, FAQs, advertencias y enlaces relacionados. Se reparó la alineación de traducción por segmentos fuente, se comprobó que no quedan marcadores y se corrigieron siete nombres de herramienta ambiguos. Draft automático comprensible, sin revisión nativa humana.
- [x] Suite focalizada de catálogo, forms, locale contract, render, builder, bundle, utilidades y lógica: **93/93 aprobadas**. Build aislado: 720 páginas HTML (19 herramientas × 36 idiomas + 36 portadas), 720 URLs sitemap únicas, 780 archivos y 15.201.320 bytes. Auditoría de todas las rutas nuevas: canonical, x-default y 36 hreflang, controlador enlazado y ningún marcador de traducción. Controlador del afilador: 5.598 B, bajo 24 KiB.
- [x] Chrome DevTools local con PNG sintético 64×32: intensidad cero exportó un PNG con cero canales RGBA diferentes; intensidad 2 produjo cambios RGB en bordes, cero cambios alfa y dimensiones idénticas. Botón/enlace de exportación quedó listo; consola sin errores y seis solicitudes totales, de las que cuatro fueron recursos del sitio local y dos Blob locales. En el build final, la página árabe declara `lang=ar`, `dir=rtl`, muestra la nota de GIF fijo, carga solo cuatro recursos del sitio y no presenta overflow en viewport reportado de 500 px.
- [ ] No se probaron dispositivos físicos, AVIF/GIF en todos los navegadores, casos cercanos al tope de memoria ni revisión humana de 36 idiomas. No se ejecutó la suite global ni PageSpeed/Lighthouse.
- [ ] **No publicado:** sigue en `codex/growth600-tire-size-phase`; no se integró ni desplegó, no se modificó el sitemap de producción y no se enviaron URLs a Google/Bing/Yandex/Naver. Los gates coordinados C/F/E/X/L/B/P/S siguen pendientes; #109 continúa sin marcar en `PLAN-600.md`.

## Continuación · Image Color Picker (#034) · 2026-10-08

- [x] Herramienta aditiva para seleccionar píxeles de imágenes raster locales, con zoom 1×/2×/4×/8×, coordenadas originales, HEX/RGB/alpha, navegación por teclado, paleta de hasta 24 muestras y copiar/quitar/limpiar. No duplica `color-converter`: esta selecciona colores en una imagen; aquella convierte un color escrito.
- [x] Límites claros: PNG/JPEG/WebP/GIF/AVIF/BMP si el navegador los decodifica; máximo 12 megapíxeles. Imagen y lectura de píxeles permanecen en el navegador; el controlador no usa red ni APIs de conversión. El bundle minificado mide **7.515 B**, por debajo de 24 KiB.
- [x] Copy estático en los 36 idiomas, con etiquetas SEO dentro de los topes, dos FAQs, nota de privacidad/dispositivo y enlaces a herramientas relacionadas. Se corrigió el título suajili; los borradores son traducciones automáticas comprensibles, no revisión nativa.
- [x] Suite de todos los tests de `src/growth600/`: **73/73 aprobados**. Build aislado: **756 páginas** (20 herramientas × 36 idiomas + 36 portadas), **756 URLs únicas** en `sitemap.xml`, 817 archivos y 16.050.987 bytes. No se sobrescribió ninguna salida previa.
- [x] QA en Chrome DevTools local con PNG sintético 3×2: píxel rojo exacto `(1,0)` → `#FF0000` / RGB 255,0,0; transparente `(2,0)` → `#00000000`; flecha derecha mueve la coordenada un píxel; añadir, limpiar y resetear funcionan. Consola sin errores. En árabe, `dir=rtl`, viewport emulado 390 px sin overflow; cuatro solicitudes, todas al servidor local.
- [ ] La ejecución global `npm test` no se declara aprobada: el clon limpio no tiene el árbol completo de dependencias y varias pruebas dependientes del resto del producto no pudieron resolver módulos como `to-words/gu-IN`. Los 73 tests growth600 sí se ejecutaron completos. No se ejecutó `npm run check` ni PageSpeed/Lighthouse.
- [ ] **No publicado:** no se integró a `main`, no se desplegó el sitio principal ni `tools.usefulverse.com`; sitemap de producción y paneles de buscadores siguen sin cambios. Gates C/F/E/X/L/B/P/S sin cerrar y la casilla de #034 continúa sin marcar en `PLAN-600.md`.

## Continuación · Dominoes Game (#035) · 2026-10-08

- [x] Añadida como herramienta nueva y separada de Mancala y los juegos de cartas: dominó doble-seis, 28 fichas únicas, 7 por mano, apertura con el doble más alto (o ficha de mayor valor si no hay dobles), extremos legales izquierdo/derecho y dos reglas configurables (robar/bloquear). Partida contra rival local simple o dos personas en el mismo dispositivo. Sin cuentas, red, API ni proceso servidor.
- [x] Lógica: barajado aleatorio con fuente inyectable para reproducibilidad en test; validación de fuente; identidad única de fichas; conservación del set entre manos, reserva y mesa; robo solo bajo reglas draw y sin jugadas; pase solo cuando corresponde; fin por mano vacía o bloqueo y puntuación de pips. Una simulación automatizada termina partida completa.
- [x] QA de integración detectó y corrigió un defecto que las pruebas del motor no captaban: el rival local seguía jugando el turno humano al abrir; ahora su ciclo se detiene al cambiar de jugador. También se actualiza el contador de fichas de la computadora después de su apertura.
- [x] Interfaz y contenido estáticos en 36 idiomas, controles etiquetados, avisos de turno/resultado y FAQ; el controlador local minificado mide **6.687 B** (presupuesto 24 KiB). Traducciones automáticas comprensibles; no revisión humana nativa.
- [x] Suite focalizada `src/growth600/*.test.mjs`: **70/70 aprobadas**. Build aislado a `tools.usefulverse.com`: **792 páginas HTML** (21 candidatas × 36 idiomas + 36 portadas), 792 rutas únicas en el sitemap, 854 archivos y 16.906.857 bytes; dentro del límite estático de 18.500 archivos y 24 KiB por bundle.
- [x] Chrome local: se comprobaron aperturas humanas y de computadora; turno humano válido tras la apertura, recuentos 7/6 cuando la computadora abre, jugada humana con réplica del rival, cambio a reglas de bloqueo y modo de dos jugadores. Cero errores/avisos de consola y cero solicitudes a otros orígenes.
- [x] Auditoría de las 792 rutas HTML: todas incluyen canonical, x-default y 36 alternates hreflang; sin faltantes en el sitemap aislado.
- [x] Chrome móvil emulado a 390 × 844: página árabe `lang=ar`, `dir=rtl`, ancho del documento 390 px sin desbordamiento horizontal; controles/labels localizados y consola sin errores. No se probó un teléfono físico.
- [ ] No hubo revisión humana nativa de las 36 traducciones; son borradores automáticos comprensibles.
- [ ] **No publicado:** sigue en `codex/growth600-tire-size-phase`; todavía no se ha integrado ni desplegado. Sitemap de producción y paneles de Google/Bing/Yandex/Naver sin cambios. Gates coordinados C/F/E/X/L/B/P/S siguen abiertos; por eso #035 permanece sin marcar como release-completo en `PLAN-600.md`.

## Continuación · Weight Loss Calculator (#036) · 2026-10-08

- [x] Candidata aditiva, diferenciada del calculador BMR/TDEE existente: acepta únicamente el déficit que la propia persona quiere examinar; no recomienda déficit, dieta ni pérdida de peso. Se validó el límite clínico con NIDDK y CDC: este modelo lineal estático no predice la respuesta real del cuerpo y se explica claramente en la página.
- [x] Cálculo local en navegador: equivalencias estáticas 7.700 kcal/kg y 3.500 kcal/lb, conversión de unidades, plazo matemático, tasa semanal, rechazo de valores imposibles y aviso si el escenario supera la referencia gradual general citada por CDC. Déficit cero da cambio modelado cero y no inventa un plazo.
- [x] Copia estática comprensible generada para 36 idiomas; límites/títulos, mensajes, formularios, FAQs y direcciones RTL pasan el contrato automatizado. Son borradores automáticos, sin revisión nativa humana. Fuentes públicas enlazadas: NIDDK Body Weight Planner y CDC Steps for Losing Weight.
- [x] Pruebas focalizadas growth600: **72/72 aprobadas**. Bundle del controlador: **3.798 B**, bajo el presupuesto de 24 KiB, sin red, APIs ni ejecución dinámica. Build temporal aislado: **828 páginas** (22 herramientas × 36 idiomas + 36 portadas), **828 URLs únicas** en el sitemap, 891 archivos / 17.766.060 bytes. Auditoría de 828 HTML: canonical, x-default y los 36 alternates hreflang presentes en todos.
- [x] Chrome local: ejemplo 80→70 kg con déficit introducido de 500 kcal/día informa 77.000 kcal y 154 días/22 semanas; déficit cero y objetivo superior al peso actual comprobados; aviso live funciona. En árabe, formulario localizado, `lang=ar`, `dir=rtl`, viewport móvil emulado 390 × 844 sin overflow y consola limpia; solicitudes únicamente al servidor local. No se comprobó en dispositivo físico.
- [ ] `npm test` global no se ejecutó; el trabajo queda verificado por la suite específica growth600. No PageSpeed/Lighthouse.
- [ ] **No publicado:** rama `codex/growth600-tire-size-phase`; no merge, deploy de `tools.usefulverse.com`, sitemap de producción ni envío a buscadores. Gates globales C/F/E/X/L/B/P/S abiertos; #036 no queda marcada como release-completa en `PLAN-600.md`.

## Continuación · Image Upscaler (#037) · 2026-10-08

- [x] Herramienta diferenciada del redimensionador y del afilador: modelo Swin2SR ligero fijado a revisión y SHA-256, ampliación de superresolución 2× por teselas solapadas, vista previa, progreso, cancelación y descarga PNG. Explica que los detalles son inferidos, no recuperados; el original no se sobrescribe.
- [x] Todo el cómputo de imagen se ejecuta en un Web Worker del navegador. Imagen nunca se envía a servidor; modelo/runtime son archivos estáticos servidos por el mismo sitio. No hay Functions ni API de procesamiento. Límite de 1 megapíxel; CPU/RAM y rendimiento dependen del dispositivo; recomienda ordenador. Transparencia compuesta sobre blanco. Modelo y wasm juntos ≈19,9 MB, más el worker pequeño; la nota pública dice «unos 20 MB» en el primer uso.
- [x] Dependencias/límites: modelo CAIDAS Swin2SR bajo Apache-2.0, Transformers.js 4.3.0 y ONNX Runtime Web `1.31.0-dev.20260914-8d85527a0` con licencias/notices guardados; ONNX usa `new Function` interno para dispatch. Solo se permite esa construcción dinámica en el worker específico que carga la librería fijada; controladores de herramientas mantienen el gate que la prohíbe y el builder falla si un worker no listado la usa.
- [x] Copy generado para 36 idiomas, con campos, acciones, cancelación, límite del dispositivo, FAQs, privacidad y metadatos dentro de límites; títulos ≤60, descriptions ≤160 y 37 hreflang. Traducción automática comprensible, no revisión humana nativa. Corregida la terminología española y una traducción francesa incoherente.
- [x] Suite enfocada completa `node --test src/growth600/*.test.mjs src/growth600/tools/image-upscaler/logic.test.mjs`: **76/76 aprobadas**. Incluye tiles/dimensiones, todos los contratos lingüísticos, worker/recursos, tamaño por archivo y build seguro. Bundle del worker ≈548 KB; archivos bajo el límite estático de 25 MiB.
- [x] Build aislado local: **864 páginas** (23 herramientas × 36 idiomas + 36 portadas), 864 URLs sitemap únicas, 937 archivos, 39.119.252 bytes; archivo individual más grande 14.264.838 bytes. No se sobrescribió una salida previa.
- [x] Chrome con imagen PNG local sintética de 64 × 64: generó archivo PNG de 128 × 128 y mostró enlace de descarga; cancelación detuvo el worker, conservó el original y no dejó descarga. El límite rechazó en árabe una imagen de 1.001.000 píxeles. Página árabe `lang=ar`, `dir=rtl`, viewport emulado 390 px sin desbordamiento y label asociado. Consola limpia; durante el procesamiento solo se solicitaron los HTML/CSS/JS/worker/modelo/wasm del staging en `127.0.0.1` y un Blob local.
- [ ] No se probaron teléfonos/dispositivos físicos, límites cercanos a memoria en equipos modestos, ni revisión humana nativa de 36 idiomas. No se ejecutó la suite global ni PageSpeed/Lighthouse.
- [ ] **No publicado:** permanece en `codex/growth600-tire-size-phase`; sin merge, deploy, cambios en sitemap de producción ni envíos a Google/Bing/Yandex/Naver. La fila 037 de `PLAN-600.md` no se marca release-completa hasta pasar los gates coordinados C/F/E/X/L/B/P/S.

## Continuación · HELOC Calculator (#038) · 2026-10-08

- [x] Candidata de finanzas medida y separada del préstamo personal existente: `heloc calculator` US/en 49.500 búsquedas/mes, KD 2 y CPC 9,43 USD; CA 1.900, UK 140 y AU 40. CPC no se interpreta como CPM. La página enlaza a `loan-calculator` sin cambiar su función.
- [x] Motor local: saldo disponible, interés mensual solo durante la fase de disposición y después pago mensual amortizado de principal+interés; permite moneda visible USD/CAD/AUD/GBP/EUR, límites de línea/saldo, APR y plazos ajustables. Casos: 12.000 al 10% = 100/mes; línea 25.000 deja 13.000 disponibles; APR cero funciona; saldo cero produce cero pagos; saldo sobre límite y rangos inválidos se rechazan.
- [x] Supuestos explícitos en la página: APR fijo, saldo sin cambios y sin pago de principal durante la disposición; no modela nuevos retiros, tasas variables, comisiones ni términos particulares. Es matemática ilustrativa, no cotización ni consejo financiero. La ruta no usa backend, API, cuenta ni almacenamiento.
- [x] Copia estática presente en **36 idiomas**, con campos, acciones compartidas localizadas, mensajes, límites, dos FAQs y metadatos dentro del contrato. Borradores automáticos comprensibles, no revisados por hablantes nativos. Se corrigió una etiqueta árabe repetida; no se sube traducción en tiempo de ejecución.
- [x] Suite focalizada completa: **79/79 aprobadas** en catálogo, formularios, contrato de idiomas, render, builder, bundles y lógica. Build aparte: **900 páginas HTML** (24 herramientas × 36 idiomas + 36 portadas), sitemap con 900 URLs, **974 archivos / 39.943.388 bytes**. Auditoría de las 36 rutas HELOC: canonicals, `lang`, 37 alternate links, controles, enlace relacionado y ausencia de marcadores/`undefined` correctos. Controlador HELOC minificado: **4.026 B** (≤24 KiB); no se descargó modelo pesado.
- [x] Chrome DevTools local: ejemplo devuelve 100/mes, 115,80/mes tras la disposición y 13.000 de crédito disponible; saldo cero, saldo superior al límite y reset también verificados. Consola sin mensajes. Móvil 390×844: sin desbordamiento en inglés y árabe; árabe `lang=ar`, `dir=rtl`. Cada página pidió solo documento/CSS/controlador del servidor local; sin servicios externos.
- [ ] No probado en teléfonos físicos ni revisado por hablantes nativos. La prueba no certifica todos los tipos de préstamo, políticas de prestamistas, países, dispositivos o navegadores.
- [ ] **No publicado:** el código va en la rama de trabajo `codex/growth600-tire-size-phase`; no está fusionado a `main`, desplegado en `tools.usefulverse.com` ni enviado a buscadores. El sitemap de producción permanece intacto. Por el gate S, #038 sigue sin marcar como release-completa en `PLAN-600.md`.

## Continuación · Random Team Generator (#069) · 2026-10-08

- [x] Candidata distinta del selector aleatorio existente: reparte participantes en equipos equilibrados, admite reglas de incompatibilidad, semilla reproducible, copia y CSV local. No necesita cuenta, API, almacenamiento ni procesamiento servidor. Métricas copiadas del plan aprobado; no se hicieron consultas nuevas a DataForSEO.
- [x] Lógica y casos límite: 2–60 participantes, 2–12 equipos, nombres duplicados, exclusiones, balance, semillas, imposibilidad real frente a límite de búsqueda y protección CSV contra fórmulas. Las 36 versiones de interfaz/copy están incluidas como traducciones automáticas comprensibles, sin revisión nativa humana.
- [x] Suite growth600: **139/139 aprobadas**. Build aislado: **72 páginas** (36 locales de esta candidata + 36 portadas), 72 URLs únicas en el sitemap temporal, 114 archivos, 1.054.196 bytes; controlador de la herramienta **8.474 B** (presupuesto 24 KiB).
- [x] Chrome local: reparto de ejemplo equilibrado y exclusiones respetadas; semilla repite el resultado; incompatibilidad imposible comunica el problema; CSV probado sin guardar archivo en Descargas. Inglés y árabe (RTL) sin overflow a 500/1.280 px; consola limpia y sin solicitudes externas.
- [ ] No probado en dispositivos físicos ni revisado por hablantes nativos. No se ejecutó PageSpeed/Lighthouse.
- [ ] **No publicado:** continúa en `codex/growth600-tire-size-phase`; sin merge a `main`, deploy, sitemap de producción ni envíos a buscadores. La fila 069 de `PLAN-600.md` no se marca release-completa hasta pasar los gates coordinados C/F/E/X/L/B/P/S.

## Continuación · Mulch Calculator (#033) · 2026-10-08

- [x] C/F/E — candidata aditiva y diferenciada de grava/suelo: estima camas rectangulares o circulares repetidas, convierte unidades métricas/imperiales, profundidad y volumen de bolsa, permite extra opcional y redondea las bolsas hacia arriba. Precio y moneda son optativos; no consulta precios ni inventa costes.
- [x] X — caso aceptado: dos camas rectangulares 5×4 m a 5 cm = 20 m², 1 m³ y 20 bolsas de 50 L. Navegador también confirmó camas circulares, volumen extra, coste, rechazo de profundidad cero y reset; el total local de la prueba circular fue 35 bolsas / 105 EUR.
- [x] L — textos estáticos en los 36 idiomas del proyecto, con dos FAQs, metadatos y controles. La revisión de Arabic RTL detectó etiquetas automáticas confusas; se sustituyeron por texto árabe directo y se volvió a probar la ruta. El resto son borradores automáticos comprensibles, no revisión nativa humana.
- [x] B local — controlador minificado **5.892 B**, CSS compartido **10.988 B**. Build aislado de todas las candidatas registradas: **972 HTML y 972 URLs únicas de sitemap** (26 herramientas × 36 idiomas + 36 portadas), 1.039 archivos y 21.024.360 bytes; salida temporal, sin Functions, APIs ni servicios de procesamiento.
- [x] Chrome DevTools local: ejemplo y validación funcionales; Arabic `lang=ar`, `dir=rtl`, viewport móvil 390 px sin overflow, controles con nombre y consola limpia. La ruta solo solicitó documento, CSS, controlador local y favicon; nada de terceros. No equivale a prueba en dispositivo físico.
- [x] `node --test src/growth600/*.test.mjs src/growth600/tools/growth600-logic.test.mjs src/growth600/tools/*/*.test.mjs`: **144/144 aprobadas**; `git diff --check` limpio.
- [ ] No se ha ejecutado la regresión completa de todo el repositorio; tampoco PageSpeed/Lighthouse ni revisión nativa de los 36 idiomas.
- [ ] **No publicado:** continúa en `codex/growth600-tire-size-phase`; no merge a `main`, deploy, actualización del sitemap de producción ni envíos a buscadores. #033 sigue sin marcar como release-completa en `PLAN-600.md` hasta cerrar los gates coordinados C/F/E/X/L/B/P/S.

## Continuación · Paver Calculator (#099) · 2026-10-08

- [x] C/F — una intención nueva (estimación de pavimento por módulo repetido), diferenciada de `tile-calculator` (azulejos) y `gravel-calculator` (árido suelto). La candidata registrada mide 12.100 búsquedas/mes en US/en, KD 12; CPC $0,87, no CPM. No se consultó DataForSEO en esta tanda.
- [x] Lógica de navegador: calcula área rectangular, módulos completos en el sentido indicado, número de piezas por módulo, desperdicio opcional, perímetro para bordes, volumen de base y costes solo con precios que introduzca el usuario. Explica que no genera plan de cortes ni evalúa suelo, drenaje, cargas, heladas o normativa. Ningún dato se envía al servidor.
- [x] E — ejemplo de aceptación probado: 10 × 10 m con módulos 40 × 40 cm y una pieza por módulo = 625 módulos/piezas, perímetro 40 m y capa base de 10 cm = 10 m³. Tests extra validan unidades imperiales, patrón múltiple, allowance, precios, base omitida, límites y valores demasiado grandes.
- [x] X — Chrome local: ejemplo y resultado, validación de largo cero con foco y `aria-invalid`, y reinicio de campos. Arabic RTL `lang=ar`, `dir=rtl` en 390 × 844, ancho de documento y cuerpo 390 px; resultado muestra 625 piezas y 40 m de borde. Sin errores de consola; solo documento, CSS, JS y favicon locales.
- [x] L — interfaz, FAQs y metadatos estáticos en 36 idiomas. Se reemplazaron en árabe, japonés, chino simplificado y tradicional varias traducciones automáticas incompletas/confusas por copy directo comprensible. Otros locales son borradores automáticos; no hubo revisión nativa humana.
- [x] B local — bundles minificados: paver 6.254 B y grava 3.995 B (límite 24 KiB). Build aislado válido de estas dos calculadoras relacionadas: 108 HTML/sitemap URLs únicas (dos rutas × 36 idiomas + 36 portadas), 151 archivos y 1.860.607 bytes. Las 36 rutas Paver pasan la auditoría de canonical, 37 hreflang, metadatos de título/descripción, idioma, y ausencia de `undefined`/duplicados en sitemap.
- [x] Suite focalizada de la familia Growth600 — **148/148 pruebas aprobadas**; `git diff --check` limpio. No se ejecutaron PageSpeed/Lighthouse.
- [ ] No se ha probado en dispositivos físicos ni por hablantes nativos. El build fue una muestra aislada de Paver + Gravel para resolver enlaces y no equivale al build integral actual de todos los candidatos.
- [ ] **No publicado:** sin merge, deploy ni envío a buscadores; no se alteró el sitemap de producción ni las 277 herramientas protegidas. #099 permanece sin marcar en `PLAN-600.md` hasta cierre coordinado de los gates de release C/F/E/X/L/B/P/S.

## Continuación · Solar Panel Calculator (#104) · 2026-10-08

- [x] C — candidata aditiva, sin colisión con el catálogo protegido ni con `fuel-cost-calculator`: calcula generación solar, no consumo de combustible. El catálogo de expansión ya contiene **28** de las 323 incorporaciones objetivo; quedan **295** candidatas por implementar.
- [x] F/E — modo de producción desde cantidad de paneles y modo de dimensionado desde una meta diaria; permite pérdidas, superficie opcional, tarifa, moneda y coste de instalación. Pruebas: 1 kW × 5 horas × 0 % = 5 kWh/día; con 20 % de pérdidas = 4 kWh/día; para 4 kWh con paneles de 400 W y 5 horas a 20 % redondea a 3 paneles y estima 4,8 kWh/día. Aclara que generación, ahorro y retorno no están garantizados.
- [x] X — Chrome local: botón de ejemplo, dimensionado, entradas incompletas y reset; el campo que falta queda enfocado y marcado. El ejemplo mostró el error «undefined» en el periodo de retorno; se corrigió leyendo la etiqueta `years` desde acciones y se volvió a comprobar que muestra «18.26 years».
- [x] L — textos presentes para los **36 idiomas**, validación de campos/acciones/mensajes y dos FAQs por idioma. Titles ≤60 caracteres, descriptions ≤160 y sufijo de marca exacto `UsefulVerse`; ningún marcador automático se filtra. Son traducciones automáticas comprensibles, no revisión humana nativa.
- [x] B local — bundle real del controlador de **6.433 B** (bajo el presupuesto de 24 KiB); CSS compartido 10.988 B. Build aislado local de las páginas solar en EN/ES/AR: 6 HTML y 6 URLs en sitemap, 15 archivos en total. No se ejecutó el build de release con modelos/dependencias completos.
- [x] QA navegador RTL/móvil: árabe en 390 × 844, `lang=ar`, `dir=rtl`, ancho del documento 390 px, sin overflow; el ejemplo mostró estado/resultados localizados y consola limpia. Las solicitudes fueron solo documento, CSS y bundle local; no hubo llamadas externas.
- [x] Pruebas growth600 completas disponibles en este clon: **134/134** aprobadas (esbuild temporal MIT instalado en `/tmp` para ejecutar la prueba de bundles). La suite focal solar/catalog/forms/locale/build: **78/78**.
- [ ] No se ejecutaron `npm test` del repositorio completo, el build oficial con dependencias de modelos, PageSpeed/Lighthouse ni revisión humana nativa. No se probó en hardware físico.
- [ ] **No publicado:** Solar sigue en la rama de trabajo, sin merge ni deploy. No cambia el sitemap de producción ni se envía URL a buscadores. La casilla #104 de `PLAN-600.md` permanece abierta hasta los gates de publicación P/S coordinados y las comprobaciones de release.

## Continuación · BTU Calculator (#107) · 2026-10-08

- [x] C — candidata aditiva para dimensionar un aire acondicionado de habitación. La ficha aprobada registra `btu calculator` en US/en con 9.900 búsquedas mensuales, KD 9 y CPC 2,40 USD (CPC, no CPM). No se volvió a consultar ni consumir DataForSEO.
- [x] F/E — estimación en el navegador según las bandas publicadas de ENERGY STAR, con área y volumen visibles, altura de techo, ajuste de aislamiento explícito por el usuario, exposición solar, ocupantes extra y cocina. Para 12 × 12 × 8 ft, dos personas y sol típico: 144 ft², 1.152 ft³ y 5.000 Btu/h. Cero área devuelve cero; por debajo de 100 ft² avisa que la tabla empieza en 100; más de 2.500 ft² se rechaza en vez de extrapolar. No pretende sustituir Manual J, diseño HVAC ni asesoramiento profesional. Referencia: [ENERGY STAR — room air conditioners](https://www.energystar.gov/products/room_air_conditioners).
- [x] X — Chrome local emulado a 390 × 844: ejemplo y cálculo verificados en español y árabe; controles/valores legibles, `lang` y dirección correctos (`es/ltr`, `ar/rtl`), documento de 390 px sin overflow horizontal. Consola árabe limpia; recursos solicitados solo al servidor local. No se probó en teléfonos físicos.
- [x] L — copy estático en 36 idiomas. Se corrigieron los textos españoles de personas, unidades y resultado, y términos árabes que Google Translate había convertido en «pasajeros» o «número»; árabe mantiene rótulos RTL comprensibles. Los demás idiomas son borradores automáticos, no revisión nativa humana.
- [x] B — suite enfocada `node --test src/growth600/*.test.mjs src/growth600/tools/btu-calculator/logic.test.mjs`: **83/83 aprobadas**. `git diff --check` limpio. Bundle BTU minificado **5.824 B** (límite 24 KiB). Build temporal de la candidata: **72 páginas / 72 URLs de sitemap** (36 locales + 36 portadas), 114 archivos y 1.080.073 bytes; no es el sitemap de producción.
- [ ] No se ejecutó la regresión completa del repositorio ni PageSpeed/Lighthouse; tampoco revisión nativa de todos los idiomas o pruebas en equipo físico. La estimación de BTU es orientativa; el ajuste de aislamiento es una hipótesis manual, no un dato medido.
- [ ] **No publicado:** permanece en `codex/growth600-tire-size-phase`; no se ha fusionado, desplegado ni enviado a buscadores. Sitemap de producción intacto. #107 sigue sin marcar como publicación completa en `PLAN-600.md` hasta cerrar los gates coordinados C/F/E/X/L/B/P/S.

## Estado actual del plan 277 → 600

- **Candidatas nuevas presentes en el catálogo de esta rama:** 50/323; **273 por implementar**. Solar, BTU, Brick, Rafter, Carpet, Aquarium, Grass Seed, Insulation, Wall Framing, Electricity Cost, Compost, Pond Volume, Fertilizer, Baluster Spacing, Retaining Wall, Battery Runtime, Lumber Cut List Optimizer, Plant Spacing Calculator, EV Charging Calculator, Rainwater Harvesting Calculator, Ramp Calculator, Heat Loss Calculator y Heat Pump Calculator están en la rama; las candidatas nuevas con localización incompleta no pasan el gate de publicación. Las 277 herramientas originales no se tocaron.
- **Siguiente paso:** implementar el próximo candidato pendiente según el orden de `PLAN-600.md`, manteniendo las herramientas fuera de producción hasta los gates globales de publicación.

## Continuación · Rafter Calculator (#126) · 2026-10-08

- [x] Registrada como candidata nueva y diferenciada de la calculadora de inclinación: usa la luz completa del techo, descuenta media tabla de cumbrera y estima longitud del cabio, pendiente y ángulo básico de corte a plomo; permite entrada por elevación o pendiente (rise/12), unidades métricas/imperiales y alero horizontal opcional.
- [x] Motor geométrico en el navegador, con validación de unidades y rangos. La prueba del plan (luz 20 ft, elevación 6 ft, cumbrera 1,5 in) confirma que el alero aumenta la longitud; acepta también pendiente 3:12. El resultado no diseña birdsmouth/asiento, sección estructural, uniones, cargas ni cumplimiento de código.
- [x] Formulario con cambio accesible entre los modos de entrada, ejemplo, reinicio, copia, mensajes de estado y diagrama SVG con etiqueta accesible. Bundle incluido en la prueba de presupuesto, sin red ni código dinámico.
- [x] Regresión focalizada de catálogo, formularios, contrato de idiomas, renderer, build y controladores: **102/102 aprobadas**; `git diff --check` limpio.
- [ ] Localización final pendiente: para no seguir golpeando el endpoint gratuito después de HTTP 429, los borradores de los otros 35 idiomas reutilizan etiquetas/FAQ de la calculadora de inclinación y algunas frases propias de Rafter siguen en inglés. No está listo para publicar; falta traducir el copy específico y revalidar títulos/metadatos.
- [ ] Sin revisión visual con navegador, prueba en hardware físico ni PageSpeed. No se ha fusionado/desplegado; no cambia el sitemap productivo ni se ha enviado a buscadores. La casilla C/F/E/X/L/B/P/S de #126 permanece abierta.

## Continuación · Carpet Calculator (#134) · 2026-10-08

- [x] Añadida como candidata separada de la calculadora de superficie: estima cortes de alfombra en rollo por habitación rectangular, costuras, orientación del pelo, rollos idénticos y margen de cortes. Se corrigió el enlace relacionado inexistente `flooring-calculator`; conserva solo `square-footage-calculator`.
- [x] Motor local con unidades m/ft, validación de límites, comparación de orientación de cortes, redondeo de cortes enteros y superficie de compra superior a la superficie de suelo cuando sobran anchos. El caso del plan (habitación 4 × 5 m, rollo de 3 m, pelo a lo largo de 4 m) devuelve dos cortes, una costura y piezas de 4 m.
- [x] Formulario con unidades, varias habitaciones idénticas, orientación elegida o automática, margen configurable, ejemplo, reset, copia, errores accesibles, resultado desglosado y alternativa de orientación. Aviso: estimación para habitaciones rectangulares/alfombra lisa, no plan de instalación ni patrón, escaleras, recortes o reutilización de sobrantes.
- [x] Bundle estático por herramienta y pruebas de catálogo, formulario, lógica, renderer y build sintético. Suite enfocada: **105/105 aprobadas**; `git diff --check` limpio.
- [x] Gate de localización: los rótulos comunes reutilizan traducciones existentes, pero los 35 copies no ingleses se marcan `pending-tool-specific-translation`. El build de publicación los rechaza explícitamente; no se confunden drafts estructurales con traducciones listas.
- [ ] L/P/S y publicación siguen abiertos: falta traducir copy específico en 35 idiomas, revisar visualmente y probar el build productivo después de levantar el gate. No se modifica ni se envía el sitemap de producción. No se llamó DataForSEO ni PageSpeed.

## Continuación · Aquarium Calculator (#135) · 2026-10-08

- [x] Añadida como herramienta de volumen útil de pecera, distinta de la calculadora de piscina: usa medidas interiores rectangulares, resta cámara de aire y desplazamiento estimado del sustrato y muestra capacidad geométrica, agua útil, litros, galones US/imperiales y masa aproximada del agua.
- [x] El porcentaje sólido del sustrato es editable y visible; el peso utiliza aproximadamente 1 kg/L y excluye tanque, soporte, piedras, equipo y decoración. El aviso explica que el resultado no determina capacidad estructural ni sustituye la ficha del fabricante.
- [x] Formulario accesible con unidades cm/in/m/ft, ejemplo, reset, copia, resultados desglosados y error cuando sustrato más cámara de aire no dejan agua. Caso de aceptación: tanque 60×30×36 cm, sustrato 5 cm al 50% y cámara 3 cm → 54,9 L y ≈54,9 kg de agua.
- [x] Suite enfocada de lógica, formulario, catálogo, renderer, bundles y builder sintético: **107/107 aprobadas**; `git diff --check` limpio.
- [x] Gate de localización cierra el paso de publicación: se reusan solo rótulos genéricos disponibles en las traducciones existentes; las 35 copias no inglesas se marcan `pending-tool-specific-translation`.
- [ ] Falta traducir copy específico para los 35 idiomas, revisión visual y cerrar L/P/S. No se ha fusionado, desplegado ni enviado sitemap; sin llamadas a DataForSEO o PageSpeed.

## Continuación · Grass Seed Calculator (#137) · 2026-10-08

- [x] C — incorporada como candidata #34 del catálogo, distinta de `mulch-calculator`: calcula semilla por dosis superficial elegida por la persona, mezcla de dos variedades y bolsas enteras opcionales. Demanda de la ficha del plan: `grass seed calculator`, 5.400 búsquedas mensuales US/en, KD 4; secundaria `lawn seed calculator`, 320/mes. No se hicieron llamadas nuevas a DataForSEO.
- [x] F — cálculo exclusivamente local: área m²/ft²/acre; dosis elegida en g/m² o lb/1.000 ft²; extra opcional 0–50%; mezcla A/B que debe sumar exactamente 100%; bolsa opcional en kg/lb, redondeada hacia arriba. Nombres de mezcla vacíos usan etiquetas genéricas y los nombres tienen límite de 50 caracteres.
- [x] E — acepta el caso del plan: 100 m² × 30 g/m² = 3 kg; pruebas adicionales cubren conversión imperial, acre, mezcla, redondeo de bolsas, valores inválidos y suma de porcentajes. Suite focal de catálogo, formularios, contratos de idioma, renderer, build sintético, bundles y lógica: **109/109 aprobadas**.
- [x] X — límite de producto explícito: no recomienda una tasa universal; remite al envase/proveedor y aclara que no modela germinación, suelo, clima, preparación ni cobertura irregular. Sin APIs, subida, base de datos ni coste de procesamiento.
- [x] L — inglés completo y borradores estructurales en los otros 35 idiomas. Se reutilizan únicamente labels genéricos disponibles; el contenido específico está marcado `pending-tool-specific-translation` y el gate automático bloquea su publicación. No afirmar que sus 36 versiones estén traducidas/listas.
- [x] B — builder sintético verificado por la suite y controlador aislado bajo el presupuesto común de bundles; suite focal 109/109 y `git diff --check` limpios. Revisión visual en navegador todavía pendiente.
- [ ] P/S — no integrado ni desplegado. No modifica el sitemap de producción ni se envió a buscadores; quedan traducciones específicas, revisión visual y los gates coordinados de publicación.

## Continuación · Insulation Calculator (#140) · 2026-10-08

- [x] C — incorporada como candidata #35, diferenciada de `drywall-calculator` (resistencia térmica por capas, no paneles). La ficha del plan indica `insulation calculator` con 5.400 búsquedas mensuales US/en, KD 13; secundaria `insulation R value calculator`, 320/mes, KD 2. Sin llamadas nuevas a DataForSEO.
- [x] F — suma de capas en serie con cantidad por capa, hasta cuatro entradas de interfaz (motor acotado a ocho), conversión R estadounidense ↔ RSI métrico y recíproco U como conversión de unidades. Aceptación: R2 + R3 = R5; RSI 1 + RSI 2 = RSI 3; capas sin valor se ignoran.
- [x] E — pruebas cubren aceptación, cantidades repetidas, conversión y rechazo de cantidades fraccionarias/unidades inválidas/sin resistencia positiva. Suite enfocada de catálogo, forms, localización, renderer, build sintético, bundles y lógica: **111/111 aprobadas**.
- [x] X — copy delimita el cálculo aritmético y advierte que no representa el valor efectivo de un muro con montantes, puentes térmicos, filtraciones, humedad, instalación ni requisitos normativos. No recomienda materiales ni diseño. Todo local; sin servicios de pago.
- [x] L — inglés completo y borradores estructurales para los otros 35 idiomas, marcados `pending-tool-specific-translation`; release gate los bloquea, sin hacer pasar texto inglés por traducción terminada.
- [x] B — controlador y builder sintético incluidos en pruebas; bundle pasa el presupuesto compartido. `git diff --check` limpio. No se ha realizado revisión visual en navegador.
- [ ] P/S — sin merge ni deploy, sitemap de producción sin cambios, sin envío a buscadores. Traducciones específicas, revisión visual y gates globales siguen pendientes.

## Continuación · Wall Framing Calculator (#153) · 2026-10-08

- [x] C — candidata #36/323, para estimar montantes y placas de una pared recta; distinta de `drywall-calculator` (placas de yeso) y `deck-calculator` (tarima). Intenciones: `stud calculator`, `wall framing calculator`, `wall stud spacing calculator`, `wall plate material calculator`. No se consultó DataForSEO.
- [x] F — cálculo local de posiciones distribuidas para no superar la separación máxima indicada; admite pared en m/ft, separación en m/cm/mm/ft/in, hasta tres huecos con posiciones explícitas desde el extremo izquierdo, marca opcional para huecos que interrumpen la placa inferior, y número de filas de placas superior/inferior. Cuenta extremos de pared y bordes de los huecos; estima metros lineales de material.
- [x] E — caso de aceptación probado: pared 8 × 8 ft, separación máxima 16 in y hueco entre 2–5 ft marcado como corte de placa produce posiciones `[0, 1, 2, 5, 6, 7, 8]`, 7 montantes, 56 ft de montante, 16 ft de placa superior y 5 ft de placa inferior. El mismo hueco sin marcar como corte conserva los 8 ft de placa inferior. Se corrigió un residuo de coma flotante visible (`6.999999999999999`) redondeando las posiciones convertidas a 9 decimales. La suite Growth600 focal pasó **114/114**.
- [x] X — rechaza huecos incompletos, solapados o que toquen/dejen sin apoyo los extremos; limita entradas. El aviso delimita que no calcula cargaderos, montantes king/jack, dinteles, refuerzos, cargas, cortes comerciales ni cumplimiento normativo. No es un plano estructural.
- [x] L — texto inglés completo; las otras 35 versiones son borradores estructurales `pending-tool-specific-translation` y la puerta de salida bloquea publicarlas como traducciones completas.
- [x] B — formulario, controlador y módulo aparecen cubiertos por los tests focales del catálogo, formulario, localización, builder y bundle; `git diff --check` pasó sin errores.
- [ ] E/X visual — falta recorrer el flujo en navegador y revisar móvil/RTL; los tests de lógica no sustituyen esa inspección.
- [ ] P/S — sin merge ni deploy; sitemap de producción intacto y sin envíos a buscadores. Los gates globales C/F/E/X/L/B/P/S y las traducciones específicas siguen pendientes; no ejecutar PageSpeed/Lighthouse.

## Continuación · Electricity Cost Calculator (#154) · 2026-10-08

- [x] C — candidata #37/323, enfocada en consumo y coste técnico por aparato; distinta de `household-budget-planner` (presupuesto doméstico) y `solar-panel-calculator` (generación fotovoltaica). La ficha del plan registra `electricity cost calculator`: 4.400 búsquedas/mes US/en, KD 7 y CPC 9,26 USD (no CPM); `stromkostenrechner`: 6.600/mes DE/de, KD 2. No se volvió a consultar DataForSEO.
- [x] F — estima hasta cuatro aparatos en local: W/kW, cantidad, horas por día activo, días de uso dentro del periodo (1–31 días), tarifa editable por kWh, moneda ISO de tres letras y cargo fijo opcional. Desglosa energía/coste por aparato, total del periodo y promedio diario. No presupone que su tarifa sea universal.
- [x] E — aceptación: 1.000 W × 1 h × 1 día × 0,20/kWh = 1 kWh y 0,20 antes de cargos fijos. Casos adicionales validan kW, varios aparatos, cargo fijo, promedio diario, falta de entradas, filas incompletas, días fuera del periodo y unidades inválidas. Suite Growth600 focal: **117/117 aprobadas**.
- [x] X — el texto explica que ciclos del aparato, standby, ajustes, tarifas horarias/escalonadas, impuestos y cargos reales pueden diferir; no consulta tarifas en vivo ni recomienda planes. No sube datos ni llama APIs.
- [x] L — fuente inglesa completa; borradores de estructura para los otros 35 idiomas identificados como `pending-tool-specific-translation`, bloqueados por el gate de publicación.
- [x] B — renderer, formulario, catálogo, locale-contract y bundle incluidos en la suite focal; build sintético pasó con el catálogo ampliado. `git diff --check` pasó sin errores.
- [ ] E/X visual — navegador, móvil y RTL pendientes; no se declara revisión visual.
- [ ] P/S — sin merge/deploy ni alteración del sitemap de producción; sin envíos a buscadores. Falta traducción específica, QA visual y gates globales C/F/E/X/L/B/P/S. No se ejecutó PageSpeed/Lighthouse.

## Continuación · Compost Calculator (#155) · 2026-10-08

- [x] C — candidata #38/323, mezcla de compost por masa y estimación de relación C:N; diferenciada de `soil-calculator` (volumen de suelo) y `mulch-calculator` (cobertura). La ficha del plan indica `compost calculator`: 4.400 búsquedas/mes US/en, KD 9 y CPC 1,18 USD (no CPM); no se hizo consulta nueva a DataForSEO. El término `compost carbon nitrogen calculator` no tiene volumen medido.
- [x] F — hasta cuatro materiales; masa húmeda, humedad, carbono como porcentaje de materia seca y C:N por material; deriva por separado masa seca, agua, carbono y nitrógeno, suma C/N para obtener el ratio real ponderado por masas y humedad global. Opcionalmente estima agua a añadir o retirar hacia un porcentaje introducido por la persona. Unidades kg/lb.
- [x] E — ejemplo: 10 kg de hojas (20% humedad, 45% C seco, C:N 60) + 10 kg de restos orgánicos (70%, 45%, C:N 15) → 20 kg húmedos, 11 kg secos, C:N 33:1 y 45% humedad; para una meta personal de 55%, balance estima añadir ≈4,44 kg de agua. Rechaza mezcla vacía/masa cero, fila parcial, unidades y rangos inválidos; prueba también objetivo que requiere retirar agua. Suite Growth600 focal: **120/120 aprobadas**.
- [x] X — explica que depende de la calidad/base de los datos y no modela descomposición, patógenos, temperatura, aireación, madurez, normativas ni conveniencia agronómica; no prescribe un objetivo universal. No hay APIs, subida de datos ni cálculo remoto.
- [x] L — inglés completo; borradores estructurales para otros 35 idiomas marcados `pending-tool-specific-translation`, con puerta de publicación cerrada.
- [x] B — forms, locale-contract, builder sintético y bundle cubiertos por pruebas; `git diff --check` ejecutado antes del checkpoint.
- [ ] E/X visual — falta navegador, móvil y RTL; no se ha hecho inspección visual.
- [ ] P/S — sin merge/deploy, sin cambio en sitemap de producción ni envío a buscadores; traducción específica, QA visual y gates coordinados siguen pendientes. No se ejecutó PageSpeed/Lighthouse.

## Continuación · Pond Volume Calculator (#177) · 2026-10-08

- [x] C — candidata #39/323, para estanques de jardín, distinta de `pool-volume-calculator` (piscinas). Intenciones `pond volume calculator` (2.900 búsquedas/mes US/en, KD 0; CPC 0,66 USD) y `pond liner calculator` (1.000/mes, KD 0), según el plan existente; sin llamadas nuevas a DataForSEO.
- [x] F — formas rectangular, circular y oval; capacidad geométrica por área de planta × profundidad media; volumen a nivel de llenado configurable; lámina rectangular mínima estimada con la profundidad máxima aplicada a todo el perímetro más el solape elegido por borde. Muestra litros, galones US/imperiales y dimensiones/área de lámina en m/ft.
- [x] E — aceptación: rectángulo 5 × 3 m, profundidad media 0,6 m, máxima 0,8 m, solape 0,3 m y llenado 90% → 9 m³ geométricos, 8,1 m³ de agua y lámina 7,2 × 5,2 m. Pruebas confirman mayor profundidad media ⇒ más volumen, mayor máxima ⇒ lámina mayor; también círculo, óvalo, unidades y límites. Suite Growth600 focal: **123/123 aprobadas**.
- [x] X — advierte que no modela taludes, repisas, rocas, pliegues, anclaje ni reglas del proveedor; no es plano constructivo ni calcula tratamiento de agua. No requiere API ni procesa datos en servidor.
- [x] L — inglés completo; borradores estructurales en otros 35 idiomas quedan en `pending-tool-specific-translation`, por lo que no pasan el gate de publicación.
- [x] B — controlador, formulario, catálogos de locales, builder y bundle incluidos en pruebas. `git diff --check` pasó sin errores.
- [ ] E/X visual — falta revisión del formulario/ejemplo en navegador, móvil y RTL.
- [ ] P/S — no merge/deploy, sitemap de producción sin cambios ni envío a buscadores. Faltan traducciones, QA visual y gates de release globales; no se ejecutó PageSpeed/Lighthouse.

## Continuación · Baluster Spacing Calculator (#192) · 2026-10-08

- [x] C — candidata #41/323, especializada en repartir balaustres dentro de un vano y enlazada a `fence-calculator` sin duplicar su estimación general de cercado. La ficha del plan registra `baluster spacing calculator` con 2.400 búsquedas/mes US/en, KD 0; secundaria `spindle spacing calculator`, 480/mes. Sin consultas nuevas a DataForSEO.
- [x] F/E — dos modos locales: hallar el mínimo número de piezas para un hueco máximo introducido por el usuario, o hallar el hueco uniforme dado un número fijo. Incluye huecos iguales en ambos extremos y unidades mm/cm/m/in/ft. Ejemplo: vano 1.200 mm, piezas de 40 mm, máximo de 100 mm → 8 piezas y 9 huecos de ≈97,778 mm; con 7 piezas el hueco sería 115 mm. La suma de anchos y huecos conserva el ancho del vano. Pruebas cubren modo fijo, métrico/imperial, sobrellenado, unidades/modo inválidos y límite de 1.000 piezas. Suite focal: **129/129 aprobadas**.
- [x] X — aclara que es solo aritmética de distribución; no verifica código de barandillas, aberturas permitidas, cargas, resistencia, fijaciones ni seguridad. Recomienda revisar la normativa local y consultar a un profesional cualificado.
- [x] B — formulario semántico con cambio de modo, ejemplo, reset, copia, resultado accesible y validación; renderer, catálogo, contrato de idioma, controller y builder de pruebas añadidos.
- [ ] L — inglés completo; las otras 35 versiones son borradores `pending-tool-specific-translation`; el gate de publicación no las acepta.
- [ ] E/X visual — falta comprobar el flujo en navegador, móvil y RTL; los tests no son revisión visual ni prueba en dispositivos físicos.
- [ ] P/S — sin merge/deploy ni sitemap productivo actualizado y sin enviar URLs a buscadores. Los gates globales siguen abiertos; no se ejecutó PageSpeed/Lighthouse.

## Continuación · Retaining Wall Calculator (#210) · 2026-10-08

- [x] C — candidata #42/323, centrada en muros de contención rectos, distinta de `brick-calculator` (mampostería general). La ficha existente registra `retaining wall calculator` con 1.900 búsquedas/mes US/en, KD 0; `retaining wall blocks calculator`, 170/mes. Sin nuevas consultas a DataForSEO.
- [x] F/E — cuenta cursos y bloques completos redondeando módulo de bloque + junta; estima base y relleno como prismas rectangulares definidos por el usuario, y aplica margen configurable. Aceptación cero altura → cero cursos, bloques y volúmenes; prueba adicional en imperial: muro 20 × 4 ft, bloque 16 × 6 × 12 in, junta 0,25 in, 5% extra → 8 cursos, 15 bloques/curso, 120 base y 126 a pedir; base y relleno 20 ft³ y 80 ft³ antes del extra. También se probó una conversión métrica. Suite focal completa: **132/132 aprobadas**.
- [x] X — copy y FAQs prohíben inferir diseño seguro: no calcula estabilidad, presión del terreno, drenaje, geogrid, refuerzos, cimentación, cargas ni normativa; las dimensiones de base/relleno son entradas del usuario, no recomendaciones. Exhorta a revisión profesional.
- [x] B — formulario semántico con unidades métricas/imperiales, ejemplo, reset, copia, salida accesible y validación; añadido al catálogo, locales estructurales, renderer, bundle y builder sintético.
- [ ] L — inglés completo; otros 35 locales son `pending-tool-specific-translation` y el release gate bloquea publicación.
- [ ] E/X visual — navegador, móvil y RTL pendientes; no equivale a una prueba visual o física.
- [ ] P/S — no merge/deploy, no cambio del sitemap de producción ni envío a buscadores; gates globales pendientes. No se ejecutó PageSpeed/Lighthouse.

## Continuación · Battery Runtime Calculator (#211) · 2026-10-08

- [x] C — candidata #43/323, estima autonomía de batería para una carga constante y no distancia de vehículo; la ficha registra `battery runtime calculator` con 1.900 búsquedas/mes US/en, KD 0. Sin nueva consulta a DataForSEO.
- [x] F/E — permite capacidad en Wh/kWh o Ah × voltaje; calcula energía utilizable tras profundidad de descarga y eficiencia asumidas y divide por vatios de carga. Casos: 100 Wh/10 W = 10 h ideal; 80% de descarga × 90% de eficiencia = 7,2 h; 20 Ah × 12 V con 50%/80% y 24 W = 4 h. Incluye validación, cero de descarga y errores de modo/unidades. Suite focal: **135/135 aprobadas**.
- [x] X — muestra capacidad nominal, energía utilizable, horas y días equivalentes. Advierte que es idealizado, no promesa de runtime, y enumera química, tasa, temperatura, envejecimiento, caída de voltaje, inversor y cutoff; no dimensiona ni instala sistemas eléctricos.
- [x] B — interfaz con modos condicionales, ejemplo, reset, copia, estados accesibles, módulo puro y controller aislado incluido en budget/builder tests.
- [ ] L — inglés completo; otros 35 idiomas con marcador `pending-tool-specific-translation`; el gate impide publicar placeholders.
- [ ] E/X visual — falta recorrido en navegador, móvil, RTL y dispositivos físicos.
- [ ] P/S — sin merge/deploy, sitemap productivo intacto y sin envíos a buscadores. Gates de publicación abiertos; no se ejecutó PageSpeed/Lighthouse.

## Continuación · Lumber Cut List Optimizer (#219) · 2026-10-08

- [x] C/F/E — candidata #44/323, distinta de `board-foot-calculator`: distribuye longitudes lineales entre tablones, con kerf editable y unidades compartidas. El plan previo registra `cut list optimizer` con 1.900 búsquedas/mes US/en, KD 13 y secundaria `lumber cut calculator` con 70/mes, KD 15. Sin llamadas nuevas a DataForSEO.
- [x] X — algoritmo local best-fit-decreasing determinista, con límite de 300 piezas/tablones, cuotas validadas, parséo explícito de longitudes/cantidades, kerf cargado por cada pieza y sobrante por tablón. La aceptación 2.400 mm / kerf 3 mm / cortes 1.200 + 800 + 390 da un tablón, 2.399 mm ocupados y 1 mm restante. Caso de corte mayor que tablón, formatos erróneos y exceso de entradas cubiertos por tests. No promete el mínimo global; informa la heurística y sus omisiones (vetas, defectos, extremos y cortes angulados).
- [x] B — formulario semántico con selector de unidad común, longitud de stock, kerf, lista multilínea, ejemplo, reset, copia y resultado accesible construido con nodos/texto DOM; cálculo solo local. El módulo y controller quedan en el catálogo y el budget/fixture de build.
- [ ] L — copy inglesa completa; los otros 35 idiomas siguen como `pending-tool-specific-translation`, por lo que el gate impide publicar placeholders.
- [x] E — suite focal Growth600 (`catalog`, `forms`, `locale-contract`, `locale-utils`, `render`, `build`, `bundle-controllers`, `growth600-logic`): **139/139 aprobadas**; `git diff --check` limpio.
- [ ] X/E visual — no se pudo ejecutar el build integral: este worktree no tiene instalado `onnxruntime-web` (el builder requiere su runtime para otros módulos); no repetí `npm ci`, porque la instalación completa descarga runtimes binarios pesados. Falta además recorrido visual en navegador/móvil/RTL y dispositivos reales.
- [ ] P/S — sin merge/deploy, sitemap de producción intacto y sin envío a buscadores; no ejecutar PageSpeed/Lighthouse.

## Continuación · Plant Spacing Calculator (#237) · 2026-10-08

- [x] C/F/E/X — candidata #45/323, distinta de `room-planner`: cuenta filas y plantas en una cama rectangular con márgenes de media separación; compara cuadrícula regular frente a filas alternas desplazadas media separación. El plan registra `plant spacing calculator` con 1.600 búsquedas/mes US/en, KD 11; `plant population calculator` con 170/mes, KD 0. Sin nuevas llamadas a DataForSEO.
- [x] B — formulario semántico local con patrón, unidad común, medidas de cama, separación entre plantas y filas, ejemplo, reset, copia, resultado accesible y nota sobre los supuestos geométricos.
- [x] X — prueba: 5 × 3 m y espaciamiento 0,5 m da 60 en cuadrícula y 57 en triangular; al pasar ambos espaciamientos a 1 m la cuadrícula baja a 15. Cobertura añadida para unidades imperiales, cero plantas por bordes, valores inválidos y límites de densidad. Suite focal completa: **143/143 aprobadas**.
- [ ] L — copy inglesa completa; otros 35 idiomas son borradores `pending-tool-specific-translation`; el gate no permite publicarlos.
- [ ] E/X — correr suite focal y luego falta inspección visual en navegador, móvil, RTL y dispositivos reales.
- [ ] P/S — sin merge/deploy, sitemap público intacto y sin envío a buscadores; no ejecutar PageSpeed/Lighthouse.

## Continuación · EV Charging Calculator (#256) · 2026-10-08

- [x] C/F — candidata #46/323, distinta de `fuel-cost-calculator`: cubre energía de batería entre dos estados de carga, consumo de red, tiempo de carga ideal y coste opcional. El plan registra `ev charging calculator` con 1.000 búsquedas/mes US/en, KD 11 y `electric car charging cost calculator` con 1.000/mes, KD 24. Sin nuevas llamadas a DataForSEO.
- [x] E/X — caso plan 50 kWh × (80% − 20%) = 30 kWh a batería; con 90% de eficiencia son 33,333 kWh de red; a 7,2 kW constantes son 4,6296 h. Coste opcional de usuario; tarifa cero admitida; moneda ISO de tres letras requerida cuando se calcula coste. No pronostica curvas de vehículo y expone límites por taper, temperatura, equipo y tarifas.
- [x] B — formulario semántico con niveles de carga, batería, potencia de entrada, eficiencia, tarifa opcional y moneda, ejemplo/reset/copia/resultado accesible. Motor local puro y sin API.
- [ ] L — inglés completo; 35 locales siguen `pending-tool-specific-translation` y no pasan el gate.
- [x] E — suite focal del catálogo, formularios, contrato de locales, render, build de pruebas, presupuesto de bundles y lógica: **147/147 aprobadas**; diff limpio pendiente del commit.
- [ ] X/E visual — falta inspección en navegador, móvil, RTL y dispositivos reales.
- [ ] P/S — no merge/deploy ni actualización del sitemap de producción/envío a buscadores; PageSpeed no se ejecuta.

## Continuación · Rainwater Harvesting Calculator (#258) · 2026-10-08

- [x] C/F — candidata #47/323; el plan registra `rainwater harvesting calculator` con 1.000 búsquedas/mes US/en, KD 21, y `rainwater collection calculator` con 1.000/mes, KD 29. Sin nuevas llamadas a DataForSEO; distinta de la calculadora de volumen de piscina.
- [x] E/X — balance con 12 lluvias mensuales, 12 demandas, área de cubierta, porcentaje de escorrentía, capacidad/unidad y almacenamiento inicial. Aceptación: 10 mm × 100 m² = 1.000 L; caso de tanque 800 L y demanda prueba 200 L de desbordamiento, almacenamiento 500 L y 100 L de demanda no cubierta al mes siguiente. Mensualidad suma lluvia antes de demanda; se declara el supuesto y que agua captada no es necesariamente potable. Unidades m²/ft², mm/in, L/gal y entradas negativas/cantidad de meses cubiertas por pruebas.
- [x] B — dos listas multilínea accesibles (enero–diciembre), formulario local, ejemplo, reset, copia y resumen anual/mensual con lluvia, rebose, almacenamiento y demanda incumplida.
- [ ] L — inglés completo; 35 locales en borrador estructural y bloqueados por el gate.
- [x] E — suite focal del catálogo/formularios/locales/render/build/bundle/lógica: **151/151 aprobadas**; validación estática y `git diff --check` ejecutadas.
- [ ] X/E visual — revisión en navegador, móvil, RTL y dispositivos físicos pendiente.
- [ ] P/S — no deploy, sitemap productivo ni envío a buscadores.

## Continuación · Ramp Calculator (#265) · 2026-10-08

- [x] C/F — candidata #48/323; el plan registra `ramp calculator` con 880 búsquedas/mes US/en, KD 0 y `wheelchair ramp calculator`/`ramp slope calculator` como intenciones complementarias; sin nuevas consultas a DataForSEO. Diferenciada de `stair-calculator` por rampa/ratio.
- [x] E/X — aceptación 1 m a 1:12 da 12 m de run y sqrt(145) m de superficie inclinada; caso de dos descansos suma 3 m horizontales al plan de 12 m. Unidades mm/cm/m/in/ft. Ratio personalizado; no se imponen ni certifican normas. Mensaje claro de que no revisa accesibilidad, estructura, códigos o reglas locales.
- [x] B — interfaz semántica local con altura, ratio, cantidad/profundidad de descansos, unidad, ejemplo, reset, copia y salida accesible.
- [ ] L — inglés completo; 35 locales en borrador estructural y bloqueados hasta traducir.
- [x] E — suite focal Growth600 para catálogo/formulario/locales/render/build/bundle/lógica: **155/155 aprobadas**; validaciones de sintaxis y `git diff --check` se ejecutan al cerrar el checkpoint.
- [ ] X/E visual — inspección de navegador, móvil, RTL y dispositivos físicos sigue pendiente.
- [ ] P/S — no merge/deploy, sitemap productivo intacto ni envíos a buscadores.

## Continuación · Fertilizer Calculator (#183) · 2026-10-08

- [x] C — candidata #40/323, distinta de `grass-seed-calculator`: calcula nutrientes de una etiqueta N-P₂O₅-K₂O y cantidad de producto desde área × tasa indicada por el usuario. La ficha del plan registra `fertilizer calculator` con 2.900 búsquedas mensuales US/en, KD 5; secundaria `npk calculator`, 140/mes. Sin consultas nuevas a DataForSEO.
- [x] F/E — dos modos: masa del producto o área y tasa elegidas por el usuario; unidades kg/lb, m²/ha/ft²/acre y cuatro unidades de tasa. Aceptación: 10 kg al 20% N = 2 kg N; también verifica N-P₂O₅-K₂O, área/tasa y conversiones imperiales. Entradas, unidades y combinaciones no válidas se rechazan. Suite focal: **126/126 aprobadas**.
- [x] X — cálculo estático local, sin APIs ni subida. Avisa que P₂O₅/K₂O son equivalentes de etiqueta, no masas elementales; no recomienda tipo, dosis, cultivo, calendario ni objetivo nutricional. Remite a etiqueta, análisis de suelo y orientación local cualificada.
- [x] B — formulario con modos, ejemplo, reinicio, copia, resultado desglosado y estado accesible; integración en catálogo, controller, locale contract, bundle y fixture de build cubierta por tests.
- [ ] L — inglés completo; los otros 35 idiomas son borradores estructurales marcados `pending-tool-specific-translation`, por lo que el gate impide publicarlos como traducciones.
- [ ] E/X visual — pendiente revisión en navegador, móvil y RTL; los tests automatizados no sustituyen inspección visual/dispositivo.
- [ ] P/S — no merge/deploy ni sitemap productivo actualizado; sin envío a buscadores. Se mantienen abiertos los gates globales de publicación y no se ejecutó PageSpeed/Lighthouse.

## Continuación · Heat Loss Calculator (#274) · 2026-10-08

- [x] C/F — candidata #49/323 del orden del plan. Cubre pérdida térmica estacionaria por paredes, techo, ventanas y suelo, más un término simplificado de ventilación; distinta del cálculo de capacidad de refrigeración BTU y de costes eléctricos. La ficha registra `heat loss calculator` con 720 búsquedas mensuales US/en, KD 3; secundaria `room heat loss calculator`, 20/mes. No se hicieron nuevas llamadas a DataForSEO.
- [x] E/X — transmisión `área × U × diferencia K`; ventilación aproximada con `0,33 × volumen m³ × ACH × diferencia K`; conversión separada de m²/ft², m³/ft³ y K/°F; total en W y BTU/h. El caso U=1 W/(m²·K), 10 m² y 20 K entrega 200 W; pruebas cubren sumas, ventilación, conversiones imperiales y rechazos de unidad/rango.
- [x] B — formulario localizado por contrato, cuatro pares área/U, unidades editables, volumen/ACH, ejemplo, reset, copia y salida anunciada. Controlador pequeño, cálculo local; copy explica que no es Manual J, no elige equipos ni predice factura.
- [x] E — pruebas focalizadas catálogo/formulario/contrato de locales/renderer/builder/bundles/lógica: **158/158 aprobadas** después de reparar un valor esperado incorrecto en la propia prueba. `git diff --check` y sintaxis se registran al cerrar el checkpoint.
- [ ] La regresión completa `npm test` se intentó, pero el clon ligero carece de dependencias de suites ajenas a Growth600 (`prettier`, `fflate`, `to-words/gu-IN` y otras); el resultado global no puede declararse verde. No instalé todo `node_modules` ni descargué los motores pesados. El build integral sigue además bloqueado por el runtime WASM de OCR ausente en este clon.
- [ ] L — inglés completo; 35 locales se mantienen como borradores estructurales `pending-tool-specific-translation`, y el gate de publicación los rechaza.
- [ ] X/E visual — falta recorrido real en navegador, móvil y RTL; el test de formulario y build no sustituye esa revisión.
- [ ] P/S — no merge/deploy, no cambio de sitemap de producción ni envío a buscadores; no se ejecutó PageSpeed/Lighthouse. Las puertas globales de publicación siguen pendientes.

## Continuación · Heat Pump Calculator (#286) · 2026-10-08

- [x] C/F — candidata #50/323 del plan. Estima potencia eléctrica, energía diaria y coste con COP/tarifa del usuario; añade comparación explícita contra resistencia idealizada COP 1 para cubrir también la intención de coste de funcionamiento, sin crear URLs por unidad o modalidad. La ficha registra `heat pump calculator` con 590 búsquedas mensuales US/en, KD 0; `heat pump running cost calculator`, 10/mes. No se hicieron nuevas llamadas a DataForSEO.
- [x] E/X — fórmula `potencia térmica/COP`; kWh como potencia eléctrica × horas; costes con precio por kWh. 10 kW térmicos, COP 5, 1 hora y tarifa 0,20 entregan 2 kW, 2 kWh y 0,40 unidades monetarias; comparación COP 1 calcula 10 kWh y diferencia diaria 8 kWh. Pruebas cubren BTU/h, código de moneda, cero de tarifa y rangos/unidades no válidos.
- [x] B — entrada de calor en kW/BTU/h, COP, tarifa, horas al día, moneda, ejemplo, reset, copiar y resultado accesible. Advierte COP variable, referencia de 30 días y límites del comparador; no dimensiona equipos ni estima una factura real.
- [x] E — suite focal de catálogo, formulario, gate de idiomas, renderer, builder, bundles y lógica: **161/161 aprobadas**; incluye ambas nuevas candidatas. Validaciones de sintaxis y diff al cerrar el checkpoint.
- [ ] L — inglés completo; los otros 35 idiomas están como borradores `pending-tool-specific-translation`, bloqueados por el gate de lanzamiento.
- [ ] X/E visual — recorrido real en navegador, móvil y RTL todavía pendiente; no declarado probado visualmente.
- [ ] P/S — no merge/deploy, sitemap de producción sin cambios y sin envíos a buscadores. No se ejecuta PageSpeed/Lighthouse; puertas de publicación continúan abiertas.

## Continuación · Miter Angle Calculator (#294) · 2026-10-08

- [x] C/F — candidata #51/323, diferenciada del transportador de ángulos: resuelve ajustes simétricos de inglete y corte compuesto de moldura corona plana. Demanda ya registrada en el plan: `miter angle calculator` 480 búsquedas/mes US/en, KD 0; `compound miter calculator` 260/mes. Sin nuevas consultas ni gasto de DataForSEO.
- [x] E/X — cálculo simple: ángulo interior/2. Modo compuesto: convención de ángulo de resorte medida desde el reverso apoyado en pared; 90°/38° → 31,62° de inglete y 33,86° de bisel, cotejado con tabla del manual DEWALT enlazado en la ficha. Valida ángulos interiores 1°–179° y resorte 0°–90°; no informa orientación izquierda/derecha.
- [x] B — formulario local con modo simple/compuesto, resorte contextual, ejemplo, reset, copiar, resultado accesible y SVG explicativo; bundle separado, sin servicios ni dependencias de red.
- [x] E — suite focal de catálogo/formularios/locales/render/build/bundle/lógica: **163/163 aprobadas**; sintaxis de controladores y `git diff --check` se verifican antes del checkpoint.
- [ ] L — copy fuente en inglés completo; 35 locales son borradores estructurales y están bloqueados para publicación hasta traducirse.
- [ ] X/E visual — falta recorrido de interacción en navegador, móvil y RTL. SVG y tests no equivalen a validación visual/dispositivo.
- [ ] P/S — no merge/deploy ni sitemap productivo actualizado; no se envió a buscadores. No se lanzó PageSpeed/Lighthouse; gates generales de publicación siguen abiertos.

## Continuación · Voltage Drop Calculator (#059) · 2026-10-08

- [x] C/F — candidata #52/323, intención de caída de tensión en conductores, separada de cualquier calculadora de tensión genérica. El plan registra `voltage drop calculator` 27.100 búsquedas/mes US/en, KD 21 y CPC 1,86 USD (no CPM), más `wire voltage drop calculator` 260/mes. No se gastó DataForSEO adicional.
- [x] E/X — ecuación resistiva a 20 °C: `ρ·L·I/A`; ida/vuelta (factor 2) para CC/monofásico y √3 para trifásico equilibrado; cosφ multiplica la parte resistiva para CA. 20 A, 30 m, cobre 2,5 mm² y 230 V monofásicos producen 8,2752 V (≈3,598%); longitud cero = cero. Cobre/aluminio, áreas y unidades acotadas. Contraste conceptual con Electrical Installation Guide y resistividad de conductores NIST documentados en la ficha.
- [x] B — formulario local con circuitos CC/CA, material, longitud editable en m/ft, corriente, sección, voltaje, factor de potencia contextual, ejemplo, reset, copiar y resultado anunciado.
- [x] E — suite focal Growth600 de catálogo/formulario/gate-locales/render/build/bundles/lógica: **165/165 aprobadas**, tras corregir en el catálogo una sugerencia del plan que refería a una herramienta de ley de Ohm inexistente. No se crea un enlace ficticio.
- [ ] L — inglés fuente completo; los otros 35 locales quedan como borradores estructurales bloqueados.
- [ ] X/E visual — falta interacción real de navegador, móvil y RTL; no declarada inspección visual.
- [ ] P/S — sin deploy, sitemap de producción intacto y sin envíos a buscadores; PageSpeed/Lighthouse no se ejecutó. Gates globales siguen abiertos.

## Continuación · Molarity Calculator (#068) · 2026-10-08

- [x] C/F — candidata #53/323, distinta de masa molar: calcula cantidad-concentración/volumen de solución, no la masa de una fórmula química. La ficha registra `molarity calculator` 22.200 búsquedas mensuales US/en, KD 8; secundaria `solution concentration calculator` 210/mes. Sin nuevas consultas ni gasto DataForSEO.
- [x] E/X — resuelve concentración `n/V`, moles `cV`, volumen `n/c` y masa de soluto `c·V·Mᵣ`; L/mL normalizados a litros. Aceptación 1 mol/2 L = 0,5 mol/L; 0,5 M × 2 L × 58,44 g/mol = 58,44 g. Casos cero/rangos, masa molar no positiva y unidad desconocida probados. Base conceptual cotejada con IUPAC Gold Book.
- [x] B — formulario local con cinco objetivos seleccionables y campos contextuales, ejemplo, reset, copiar, FAQs educativas y aclaración de volumen final. No especifica una receta de laboratorio ni pasos de manipulación química.
- [x] E — suite focal catálogo/formularios/localización/render/build/bundles/lógica: **167/167 aprobadas**; el motor y controlador pasan `node --check`.
- [ ] L — fuente completa en inglés; 35 borradores de idiomas aún pendientes y bloqueados por el gate de producción.
- [ ] X/E visual — falta recorrido real en navegador, móvil y RTL; las pruebas automatizadas no equivalen a inspección visual.
- [ ] P/S — no merge/deploy, sitemap productivo sin cambios ni avisos a buscadores; sin PageSpeed/Lighthouse. Gates globales siguen abiertos.

## Continuación · Dilution Calculator (#087) · 2026-10-08

- [x] C/F — candidata #54/323, distinta de Molarity: resuelve C₁V₁=C₂V₂ y series de dilución, no concentración genérica. El plan registra `dilution calculator` 14.800 búsquedas US/en, KD 16, CPC 5,58 USD (no CPM); `c1v1 c2v2 calculator` 880/mes, KD 0. Sin consultas adicionales a DataForSEO.
- [x] E/X — modo directo 10 M→2 M en 1 L: 0,2 L stock y 0,8 L diluyente; modo serial reparte un factor total de 1.000 en tres pasos iguales (factor 10 por paso), calculando transferencias y volumen idealizado. Rechaza concentraciones objetivo mayores que stock, volúmenes inválidos, unidad desconocida y pasos no enteros o fuera de 1–20. Precisa que es matemática, no un protocolo seguro de laboratorio.
- [x] B — formulario estático local con modo directo/serie, campos de concentración y volumen, paso contextual, ejemplo, reset, copia, FAQ y estado accesible.
- [x] E — suite focal catálogo/formulario/locales/render/build/bundles/lógica: **169/169 aprobadas**. Primer fallo fue una aserción de igualdad exacta con flotantes; cambiada a tolerancia numérica, sin redondear el motor.
- [ ] L — inglés completo; 35 idiomas siguen como borradores bloqueados hasta localización específica.
- [ ] X/E visual — revisión real de interacción, móvil y RTL pendiente.
- [ ] P/S — no deploy ni sitemap productivo actualizado; no envíos a buscadores ni PageSpeed/Lighthouse. Permanecen los gates globales.

## Continuación · Ohm’s Law Calculator (#089) · 2026-10-08

- [x] C/F — candidata #55/323, distinta de `voltage-drop-calculator`: resuelve ley de Ohm para resistencias DC ideales y ofrece equivalentes serie/paralelo. Demanda del plan: 14.800 búsquedas/mes US/en, KD 31, CPC USD 0,60 (no CPM); `voltage current resistance calculator` 140/mes, KD 14. Sin nuevas llamadas a DataForSEO.
- [x] E/X — motor local sin dependencias, cubre las seis parejas de V/I/R/P y redes de 2–20 resistencias. Aceptación 12 V/6 Ω → 2 A/24 W; 2, 3 y 6 Ω en paralelo → 1 Ω. Rechaza datos incompletos, no positivos, extremos y topología inválida.
- [x] B — formulario con modos solver/red, ejemplo, resultado anunciado, copia, reinicio y límites de seguridad eléctrica en lenguaje claro.
- [x] E — suite focal Growth600 (`catalog`, `forms`, `locale-contract`, `locale-utils`, `render`, `build`, `bundle-controllers`, `growth600-logic`): **171/171 aprobadas**; sintaxis de lógica/controlador/locales comprobada y `git diff --check` limpio.
- [x] B/L-bundle — controlador aislado y estático de **4.260 bytes**, por debajo del budget de 24 KiB; no usa API, red externa ni dependencia de ejecución.
- [x] E/X navegador — un build local inglés de 2 herramientas verificó los dos flujos: 12 V/6 Ω → 2 A/24 W y 2/3/6 Ω en paralelo → 1 Ω; campos parciales no activan validación nativa incorrecta, y campo vacío anuncia error. A 390 px no hay overflow horizontal; consola sin warnings/errores. La primera pasada encontró campos solver marcados accidentalmente como obligatorios; se quitó esa restricción y se repitió el flujo correctamente.
- [ ] L — texto fuente en inglés listo; otros 35 idiomas permanecen como borradores estructurales bloqueados.
- [ ] X/E visual — flujo funcional probado en Chrome móvil; todavía falta inspección visual de escritorio y RTL.
- [ ] P/S — no merge/deploy ni cambio del sitemap de producción; sin envío a buscadores. No se ejecuta PageSpeed/Lighthouse.

## Continuación · Chemical Equation Balancer (#100) · 2026-10-08

- [x] C/F — candidata #56/323; balancea ecuaciones químicas moleculares neutras, sin solaparse con `molar-mass-calculator` (masa de una fórmula) ni con `molarity-calculator` (concentración de soluciones). Demanda guardada en el plan: `chemical equation balancer` 12.100/mes US/en, KD 12; secundaria 5.400/mes. Sin consultas nuevas a DataForSEO.
- [x] E/X — matriz de conservación por elemento con fracciones BigInt exactas, normalización a coeficientes enteros, verificación de conteos a ambos lados y búsqueda acotada para ecuaciones subdeterminadas. Confirmados H₂/O₂/H₂O → 2,1,2; Ca(OH)₂/HCl → 1,2,1,2; Fe/O₂/Fe₂O₃ → 4,3,2; C/O₂/CO/CO₂ → 3,2,2,1. Parser reutiliza las fórmulas/elementos soportados por masa molar.
- [x] B — controlador local, ejemplo, reinicio, copiar, resultado accesible y mensajes de conteo de átomos. Límite de 500 caracteres, 16 especies y fórmulas de hasta 160; no promete ecuaciones iónicas, electrones, predicción de productos ni mínimo global en casos subdeterminados complejos. Sin API ni nueva dependencia.
- [x] E — suite focal Growth600 de catálogo, formularios, localización, renderer, build, bundles y lógica: **173/173 aprobadas**; el primer pase reveló que elementos ausentes de una especie producían `NaN` en el conteo. Se corrigió con cero explícito y la suite completa pasó.
- [ ] L — copy fuente en inglés; las otras 35 locales son borradores y permanecen bloqueadas en el gate de producción.
- [x] X/E navegador — build local aislado confirmó el ejemplo H₂/O₂, la reacción agrupada Ca(OH)₂, la ecuación C/CO/CO₂ con aviso de múltiples resultados, y rechazo de carga iónica con mensaje accesible. Se revisó visualmente en escritorio y en móvil a 390 px; ancho 390/390 sin overflow y consola limpia.
- [ ] X/E visual — falta revisar la versión RTL localizada; las 35 traducciones siguen bloqueadas y no se publican como si estuvieran completas.
- [ ] P/S — sin deploy, sitemap de producción intacto y sin envíos a buscadores; sin PageSpeed/Lighthouse. El catálogo total de la rama queda en 56 candidatas: 267 aún no implementadas.

## Continuación · Gear Ratio Calculator (#102) · 2026-10-08

- [x] C/F — candidata #57/323, no estaba en el catálogo base ni en las candidatas previas; trabaja transmisión mecánica, no velocidad de carrera, y no duplica conversores/unidades. Demanda ya investigada en el plan: `gear ratio calculator` 12.100 búsquedas/mes US/en, KD 28, CPC 0,83 USD (no CPM); `gear speed calculator` 590/mes. Sin consultas nuevas a DataForSEO.
- [x] E/X — una a seis etapas con dientes de driver:driven; encadenamiento asumido en ejes compuestos. `20:40`, 1.500 RPM y 10 N·m → ratio 2:1, 750 RPM y 20 N·m ideal. Cadena de 10:30 y 20:40 → ratio 6:1; 1.800 RPM → 300 RPM; 5 N·m y 90% por etapa → 24,3 N·m. Comprueba aumento de velocidad, sentido de giro, límites, dientes enteros y eficiencia ingresada.
- [x] B — formulario local con selección de engranajes externos o cadena sin cruzar; pares por línea, RPM, par opcional, eficiencia por etapa opcional, ejemplo, reinicio, copia y resultado accesible. Bundle independiente **5.038 bytes**; no API, dependencias ni ejecución remota.
- [x] E — suite focal catálogo/formulario/gate de localización/render/build/bundles/lógica: **175/175 aprobadas**, incluyendo entradas inválidas y seis etapas fuera de rango.
- [x] X/E navegador — build estático local; se verificó el ejemplo 20:40, tren compuesto de cadena con eficiencia, invalidación/aviso, vista escritorio y móvil 390 px (sin overflow); consola sin errores.
- [ ] L — inglés fuente listo; los otros 35 idiomas son borradores estructurales y permanecen bloqueados para producción.
- [ ] X/E — falta revisión visual con la versión RTL traducida; aún no está localizada.
- [ ] P/S — sin deploy ni actualización del sitemap de producción/envío a buscadores; PageSpeed/Lighthouse no se ejecuta. Total de la rama: 57 candidatas implementadas, 266 pendientes.

## Continuación · Density Calculator (#108) · 2026-10-08

- [x] C/F — candidata #58/323 del plan; cubre ρ=m/V y `mass volume density calculator`, sin competir con `volume-calculator`, que resuelve geometría. Demanda ya registrada en DataForSEO: `density calculator` 9.900 búsquedas/mes US/en, KD 14; CPC 5,62 USD (no CPM); `mass volume density calculator` 720/mes. Sin consultas nuevas ni gasto adicional.
- [x] E/X — resuelve masa, volumen o densidad con las otras dos; 10 kg/2 m³ → 5 kg/m³ y conversiones; mezcla suma hasta 12 filas y declara la hipótesis de volumen aditivo. Límites y rechazos probados: campos insuficientes/excesivos, sintaxis incorrecta y más de 12 componentes.
- [x] B/L fuente — formulario por modo, copiar, reiniciar, ejemplo, mensajes accesibles, FAQs, privacidad y límites físicos explícitos. JavaScript local; sin API, dependencias, carga remota ni coste por uso.
- [x] E — pruebas focales de catálogo/formulario/localización/render/lógica: **174/174 aprobadas**.
- [x] E build/bundle — las pruebas del builder y bundler pasaron (3/3 adicionales); controlador minificado específico: **4.435 bytes**, debajo del límite de 24 KiB. El builder valida markup/rutas con los fixtures de prueba.
- [ ] X/E navegador — falta interacción visual real en Chrome de la ruta generada, incluyendo la edición de campos y el cambio a modo de mezcla. No se declara pasada.
- [ ] L — copy completo en inglés; los otros 35 idiomas están marcados `pending-tool-specific-translation`, bloqueados por el gate de producción.
- [ ] P/S — no merge ni deploy; sitemap de producción y paneles de buscadores intactos. No se ejecutó PageSpeed/Lighthouse. Total de rama: 58 candidatas implementadas, 265 pendientes.

## Continuación · Compression Ratio Calculator (#131) · 2026-10-08

- [x] C/F — candidata #59/323 del plan; `compression ratio calculator`, distinta de la calculadora de volumen geométrico. La demanda ya guardada en DataForSEO indica 6.600 búsquedas/mes US/en, KD 23; CPC 0,91 USD (no CPM); `engine compression calculator` 720/mes. Sin consultas ni gasto adicional.
- [x] E/X — calcula barrido desde bore × stroke, clearance por cámara/junta/deck/corona de pistón, relación estática, volumen total de 1–16 cilindros y relación bore:stroke. Unidades métricas/imperiales equivalentes; dome negativo y dish positivo. Valida holgura y límites; no modela compresión dinámica ni detonación.
- [x] B/L fuente — formulario con ejemplo 10:1, reinicio/copia, unidades, FAQ y advertencia de medición/seguridad. Cálculo local; sin API ni dependencias de ejecución.
- [x] E — suite focal de catálogo/formulario/localización/render/lógica: **176/176 aprobadas**; incluye equivalencia mm↔in, cc↔in³, aportaciones de junta/deck/corona y errores de holgura/cantidad de cilindros.
- [x] E build/bundle — builder y bundle tests: **3/3 aprobados**; controlador minificado **4.997 bytes** (<24 KiB).
- [ ] X/E navegador — falta interacción visual con ruta generada, incluido cambiar unidades y comparar entradas equivalentes. No se declara comprobada.
- [ ] L — inglés fuente completo; los otros 35 locales están marcados `pending-tool-specific-translation` y no pasan el gate de publicación.
- [ ] P/S — no merge/deploy; sitemap productivo y paneles de buscadores no cambiaron. No se ejecutó PageSpeed/Lighthouse. Total de rama: 59 candidatas implementadas, 264 pendientes.

## Continuación · Goal Planner (#132) · 2026-10-08

- [x] C/F — candidata #60 codificada; plan medible con hitos, no una segunda lista de tareas. La investigación ya incluida en el plan indica `smart goals template` 6.600 búsquedas/mes US/en, KD 30 y `goal planner` 1.900/mes; sin llamadas adicionales a DataForSEO.
- [x] E — progreso ascendente/descendente, límites acotados, fechas de calendario, hitos ordenados/comprobados, seguimiento hasta 366 mediciones, progreso retrospectivo sin reemplazar la medición más reciente, completar hitos y restauración JSON validada.
- [x] B — formulario accesible en inglés, ejemplo con fechas dinámicas, guardado local optativo al crear, copia, descarga/restauración JSON (máximo 100 KB), reinicio y enlace a la lista de tareas. Sin APIs, dependencias de ejecución ni servicios con coste por uso.
- [x] E — suite focal completa: catálogo, contrato, formulario, render, build, bundles y lógica; incluidos casos de entrada inválida, fecha pasada y backup malformado.
- [ ] L — inglés fuente listo; otras 35 locales permanecen explícitamente `pending-tool-specific-translation`. El gate de publicación lo bloquea.
- [ ] X — falta prueba de interacción en navegador y revisión visual RTL/escritorio; no se declara comprobado.
- [ ] P/S — no merge/deploy ni cambio del sitemap productivo o paneles. No ejecutar PageSpeed/Lighthouse. Total: 60 candidatas del plan codificadas, 263 filas por resolver y un duplicado conocido que requiere una sustitución única.

## Continuación · Mind Map Maker (#151) · 2026-10-08

- [x] C/F — candidata añadida al catálogo aditivo, separada de `diagram-maker`: esta es una estructura radial/arbórea de ideas que se puede reordenar, no un editor de diagramas de flujo.
- [x] E — motor local: crear/editar, añadir hijos, mover y reordenar ramas, colapsar, eliminar subárbol, historial undo/redo, validar importación JSON y exportar SVG/JSON. Rechaza ciclos, mover/eliminar la raíz, profundidad >40, texto >160 caracteres, más de 500 nodos y archivos JSON >500 KB. SVG escapa texto del usuario.
- [x] B/X — formulario inglés accesible, ejemplo funcional y acciones verificadas en Chrome local: cargar ejemplo, añadir una rama y editarla; la edición se anuncia y queda en el árbol. Los controles dinámicos tienen `id`, `name` y etiqueta accesible; consola sin avisos tras la corrección. Viewport móvil 390 × 844: sin overflow horizontal.
- [x] E — suite focal de lógica, catálogo, formulario, contrato de locale, render, build y presupuestos de bundle: **126/126 aprobadas**. Build aislado: 2 páginas estáticas (home + herramienta), 9 archivos; controlador minificado **10.302 bytes**, bajo el presupuesto de 24 KiB. No se agregan APIs, Functions, almacenamiento remoto ni dependencias de producción.
- [ ] L — fuente inglesa lista; los 35 locales restantes están explícitamente marcados `pending-tool-specific-translation`. La puerta de publicación lo bloquea.
- [ ] P/S — sin merge/deploy, sin cambios al sitemap de producción y sin envío a buscadores. No se ejecutó PageSpeed/Lighthouse.
- **Recuento neto actualizado antes de Mood Tracker:** 61 candidatas codificadas; 262 filas pendientes entonces (261 válidas + una reserva para sustituir API Request Builder). Mind Map Maker no se cuenta como publicada.

## Continuación · Mood Tracker (#159) · 2026-10-08

- [x] C/F — candidata añadida como diario breve de reflexión emocional, distinta de `habit-tracker`; no diagnostica ni interpreta tendencias. La demanda ya incluida en el plan: `mood tracker` 4.400 búsquedas/mes US/en, KD 39; no se hicieron llamadas nuevas a DataForSEO.
- [x] E — una entrada por día con escala personal 1–5, etiquetas y nota opcionales, calendario, resumen descriptivo de siete días, distribución, backup JSON validado, importación y borrado.
- [x] Privacidad local — no lee/escribe localStorage al abrir ni guarda sin consentimiento explícito; al desactivarlo elimina la copia persistida y conserva solo la memoria de esta pestaña. Aclara que las notas locales no son una bóveda cifrada y que no es una herramienta clínica.
- [x] B/X — página inglesa renderizada y probada en Chrome: registro sin guardar automáticamente, activación del consentimiento, retirar consentimiento y borrar la copia persistida. Vista móvil emulada sin overflow horizontal; consola sin errores.
- [x] E/B — suite focal de catálogo, formulario, contrato de locales, render, builder, bundles y lógica: **127/127 aprobadas**. Build estático aislado: 2 páginas (home + herramienta), 9 archivos, 41.406 bytes; bundle minificado **10.140 bytes**, bajo 24 KiB. Importación limitada a 500 KB.
- [ ] L — inglés fuente listo; otras 35 traducciones marcadas `pending-tool-specific-translation`; el gate impide publicarlas como localizadas.
- [ ] RTL visual — pendiente hasta disponer de traducciones aprobadas en árabe, persa y urdu.
- [ ] P/S — sin merge/deploy, sitemap productivo intacto y sin envíos a buscadores. PageSpeed/Lighthouse no ejecutados.
- **Recuento actualizado:** 62 candidatas codificadas; 261 filas por terminar, incluida una reserva de sustitución. De ellas, 260 son candidatas válidas aún sin implementar.

## Continuación · Journal Online (#160) · 2026-10-08

- [x] C/F — candidata del plan, separada de `local-notepad`: diario de varias entradas fechadas, no un bloc de texto único. Demanda registrada previamente en DataForSEO: `journal online` 4.400 búsquedas/mes US/en, KD 51; CPC 3,03 USD (no CPM). No se realizaron nuevas consultas ni hubo gasto de API.
- [x] E — crea varias entradas por fecha, edita con ID estable, busca títulos/cuerpo/etiquetas con normalización Unicode y limita por fechas; acepta fechas reales de 1900–2100, máximo 1.000 entradas, títulos de 160, cuerpo de 8.000 caracteres y 12 etiquetas de 32 caracteres.
- [x] Privacidad y recuperación — no lee ni escribe localStorage por defecto; solo guarda tras consentimiento explícito. Desactivar el consentimiento elimina la copia persistida y conserva la sesión actual. El JSON se valida; la importación pide confirmación antes de reemplazar datos. Backup cifrado separado AES-256-GCM con clave PBKDF2-HMAC-SHA-256 (600.000 iteraciones), salt/IV aleatorios, verificación de autenticidad y contraseña no almacenada ni transmitida. UI avisa que el almacenamiento local normal no se cifra y que la contraseña del backup no se puede recuperar.
- [x] E — suite focal de lógica, catálogo, contrato de formularios, gate de locales, renderer, builder y bundle: **127/127 aprobadas** en la última ejecución. Incluye fechas, límites, varios registros el mismo día, edición estable, filtros, exportación/importación, contraseña incorrecta, parámetros alterados y ciphertext manipulado.
- [x] X/E navegador — build aislado: **2 páginas, 9 archivos, 43.486 bytes**; controlador minificado **12.188 bytes** (<24 KiB). En Chrome se verificaron no-guardado automático, dos entradas, búsqueda de etiqueta sin distinguir mayúsculas, rango de fechas, edición de una entrada filtrada sin duplicado, opt-in y borrado al retirar consentimiento. Se verificó importación cifrada de ida y vuelta: tras limpiar el filtro activo reaparecen ambas entradas; cancelar importación preserva datos. Móvil 390 px: 390/390 px, sin desbordamiento horizontal; recarga limpia con consola sin errores. Solicitudes del documento solo a localhost, CSS/JS estáticos y un icono `data:`; no hay llamadas de aplicación a terceros.
- [ ] L — copy fuente en inglés; otras 35 traducciones permanecen `pending-tool-specific-translation` y bloqueadas por el release gate.
- [ ] RTL — no revisado aún; se hará con copy RTL real, no con texto inglés bajo `lang=ar`.
- [ ] P/S — sin merge/deploy ni cambios al sitemap de producción o paneles de buscadores. No se ejecutó PageSpeed/Lighthouse.
- **Recuento actualizado:** 63/323 filas implementadas en inglés; 260 filas por terminar (259 candidatas válidas y una reserva). Todas las 277 herramientas originales continúan intactas.

## Continuación · Travel Itinerary Planner (#161) · 2026-10-08

- [x] C/F — candidata #64/323; cubre creación manual de un itinerario por días, no equipaje ni coste de combustible. DataForSEO ya figuraba en el plan: `travel itinerary planner` 4.400 búsquedas mensuales US/en, KD 71; `trip itinerary maker` 3.600/mes. No hubo llamadas nuevas a DataForSEO ni gasto de API.
- [x] E — fechas reales acotadas a 1900–2100, viajes de hasta 366 días, hasta 250 paradas y eventos del mismo día. Impide horarios inválidos, IDs duplicados y fechas fuera del viaje. Análisis O(n²) acotado encuentra todos los solapamientos incluso dentro de eventos largos; el aviso de margen se calcula contra la parada previa que termina más cerca.
- [x] B — formulario accesible con seis categorías, edición/eliminación, ejemplo, margen mínimo de conexión, aviso claro de hora local sin conversión, datos de reserva sensibles, consentimiento explícito para almacenamiento local, JSON validado de hasta 1 MB, ICS y vista de impresión. No usa mapas, reservas, API, Functions ni llamadas de red.
- [x] E — pruebas focalizadas de catálogo, formulario, 36-locales/gate, renderer/build y lógica: **126/126 aprobadas**. Incluyen overlaps anidados, fechas/horas, importación JSON dañada, IDs estables, escaping/continuation UTF-8/CRLF ICS.
- [ ] E — `npm test` completo no es verde en este clon porque faltan dependencias fijadas del proyecto (`prettier`, `esbuild`, `fflate` y otras); no se instalaron paquetes. La suite focal de la candidata sí pasa. Tampoco se midió el bundle real minificado.
- [x] Revisión de copia/contrato: etiquetas para los seis tipos requeridas; límite 366 días/250 paradas expuesto; fallos al borrar una copia local se anuncian sin desmarcar falsamente el consentimiento. Inglés completo; otros 35 idiomas siguen explícitamente bloqueados.
- [x] X/E — prueba manual en Chrome local aislado: crear viaje, tres paradas, solapamiento de 15 min, margen real de 10 min frente a 30 elegidos, editar parada sin duplicarla, exportar ICS/JSON (capturados en memoria, sin crear descargas), importar el JSON en el formulario y vaciar el selector tras importar. Se encontró y corrigió un error asíncrono al limpiar el selector; la repetición restauró dos paradas y dejó la consola sin errores. Vista móvil emulada 390×844: 390 px de documento, sin overflow horizontal; revisión visual del formulario y acciones. No se usaron datos reales del usuario.
- [ ] B/X — la prueba de navegador usó módulos ESM locales separados y la plantilla final; no se ha validado el bundle minificado de producción ni su presupuesto. RTL queda pendiente hasta disponer de copy RTL real.
- [ ] L — 35 locales estructurales `pending-tool-specific-translation`; el gate impide publicación.
- [ ] B/P/S — falta medir el bundle real minificado y resolver la traducción antes de los gates globales de publicación. La revisión visual fue en inglés y RTL sigue pendiente de copy RTL real. No se hizo deploy, el sitemap público queda intacto y no se envió nada a buscadores; no se ejecutó PageSpeed/Lighthouse.
- **Recuento vigente:** 64/323 candidatas adicionales implementadas en inglés; quedan 259 entradas del plan (258 válidas + una reserva). Las 277 herramientas base no se tocaron. Esta candidata no cuenta como publicada.

## Continuación · Hitori (#167) · 2026-10-08

- [x] C/F/E — candidato único incorporado al catálogo como rompecabezas Hitori, no sudoku ni nonogram. Tableros 5×5 a 8×8, tres niveles, selección con ratón/táctil y teclado, comprobación de reglas, pista de una celda y reinicio.
- [x] Generador acotado — prueba de solución única con máximo de dos resultados, reglas de duplicados por fila/columna, negros no adyacentes y blancos conectados; si agota intentos usa una plantilla única validada y transformada aleatoriamente. La suite prueba las 12 combinaciones de tamaño/nivel y puzzles con semillas diferentes.
- [x] Accesibilidad — rejilla/filas/celdas semánticas, nombres que anuncian coordenada/valor/color, `aria-pressed`, foco único y navegación por flechas; mensajes de estado para resolver, validar, pedir pista y cambiar marca.
- [x] Integración — formulario y CSS del tablero; extensión de idioma; catálogo comprueba IDs únicos y no colisión con las 277 herramientas protegidas. El contrato exige campos, acciones, mensajes y dos FAQs.
- [x] Pruebas focalizadas finales: `node --test src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs src/growth600/tools/hitori/logic.test.mjs` — **141/141 aprobadas**. Incluye plantillas fallback únicas en las 12 combinaciones. `node --check` para lógica, controlador y fuentes de idioma; `git diff --check` limpio.
- [ ] No se pudo medir el bundle real ni probar el controlador en Chrome en este entorno porque `node_modules` y `esbuild` no están disponibles; no instalé dependencias. No registrar como navegador verificado.
- [ ] L — inglés listo; otros 35 idiomas permanecen `pending-tool-specific-translation`, comprobado por un test que exige que el release gate los rechace. Las traducciones de fixture de build no aprueban copy real ni abren el gate de producción.
- [ ] P/S — no desplegado, sin merge y sin cambios ni envíos del sitemap de producción.
- **Recuento vigente:** 70/323 candidatos con implementación inglesa en catálogo; 253 filas por resolver (252 válidas y una reserva, según el plan). Las 277 herramientas existentes están intactas. Hitori cuenta como implementación inglesa, no como herramienta completamente localizada/publicada.

## Continuación · Nurikabe (#168) · 2026-10-08

- [x] C/F — candidata distinta de Hitori y Nonogram: rompecabezas de islas numeradas y mar; 3.600 búsquedas/mes US/en, KD 19, registrado en la investigación ya pagada. No se repitieron llamadas ni hubo gasto de DataForSEO.
- [x] E — generación 5×5 en tres niveles; el solucionador distingue “una solución probada” de “búsqueda cortada por presupuesto”. Solo acepta una solución si la búsqueda fue exhaustiva. Generación acotada por 800 intentos y 200.000 nodos totales; fallback verificado y transformado para no repetir siempre el mismo diseño.
- [x] E — checker detecta pista marcada como mar, bloque 2×2, mar desconectado, islas que se tocan, región sin pista y tamaño incorrecto. Pistas de una celda.
- [x] B — controles localizados, teclado/foco, botones táctiles, nombres de fila/columna, estado anunciado, dificultad, nueva partida, comprobar, pista y borrar marcas. Copy en inglés con reglas, privacidad y dos FAQs; ruta y módulo registrados en catálogo/formulario/estilos.
- [x] E — pruebas focalizadas finales: `node --test src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs src/growth600/tools/nurikabe/logic.test.mjs` — **144/144 aprobadas**. Incluye unicidad demostrada, presupuesto agotado, casos inválidos, pistas, respaldo único en tres niveles y variedad entre partidas.
- [ ] B/X — no hay `node_modules` ni `esbuild` en el clon; no instalé dependencias. En un preview local temporal comprobé interacción con ratón/teclado, validación, pista, limpiar y cambio de dificultad. El servidor temporal falló al servir recursos durante la comprobación móvil posterior; por eso no doy por validado el render móvil ni la consola de ese preview. No pude compilar el bundle final; `node --check` sí valida la sintaxis.
- [ ] L — inglés fuente listo; 35 locales siguen marcados `pending-tool-specific-translation` y el gate los bloquea.
- [ ] RTL — sin revisión de render RTL; se hará cuando haya traducciones RTL reales.
- [ ] P/S — sin merge ni deploy; no se alteraron sitemaps de producción ni se enviaron URLs a buscadores.
- **Recuento vigente:** 71/323 candidatas nuevas con implementación inglesa en catálogo; quedan 252 filas por resolver (251 candidatas válidas y una reserva). Las 277 herramientas originales siguen intactas. Nurikabe no cuenta como localizada, publicada ni indexada.

## Continuación · Color Name Finder (#169 detallado del plan) · 2026-10-08

- [x] C/F — candidata única tras contrastar el catálogo protegido: buscar nombres CSS estándar desde HEX. El plan detallado registra `color name finder` (3.600 búsquedas mensuales US/en, KD 23); su tabla-resumen asigna el mismo número a `confidence interval calculator`, pero esa intención y URL ya existen en las 277 herramientas protegidas. No implementé ni conté esa duplicada; necesita reemplazo en el inventario maestro.
- [x] E — paleta CSS estándar local (148 nombres, 139 valores RGB únicos, alias agrupados); normaliza HEX de 3/6 dígitos, calcula distancia perceptual en OKLab, ordena resultados de forma determinista, distingue coincidencia exacta de aproximación y limita el número de resultados.
- [x] B — selector nativo de color, entrada HEX, validación accesible, resultados con muestras visuales, alias y distancia, botones para copiar nombre/HEX. Cálculo local; no sube ni persiste datos. Copy aclara que una aproximación no es un nombre universal u oficial.
- [x] Integración — catálogo aditivo, módulo aislado, renderer, estilos, idioma fuente inglés, FAQs, pruebas y registro en el sitio piloto. El gate de publicación rechaza expresamente el copy pendiente de 35 idiomas.
- [x] Verificación focalizada: `node --test src/growth600/tools/color-name-finder/logic.test.mjs src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/locale-utils.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs` — **148/148 aprobadas**; sintaxis de módulo/controlador/copy y `git diff --check` pasan. El test de build aislado crea y elimina sus salidas temporales.
- [ ] L — solo copy inglesa aprobada; las otras 35 rutas son borradores estructurales, no traducciones.
- [ ] B/X — sin bundle real ni prueba de interacción en navegador en esta continuación; esbuild/dependencias no se instalaron.
- [ ] P/S — sin merge, deploy, sitemap de producción ni envíos a buscadores. No ejecutar PageSpeed/Lighthouse.
- **Recuento vigente:** 72/323 candidatas con implementación inglesa; quedan 251 entradas por resolver, incluyendo una duplicada identificada que requiere sustitución. Las 277 herramientas base permanecen intactas. Color Name Finder no cuenta como localizada, publicada ni indexada.

## Continuación · Photo To Sketch (#170 detallado del plan) · 2026-10-08

- [x] C/F/E — filtro local de bordes/tonos para fotos, distinto del enfoque de nitidez: controles de intensidad y detalle, comparación reversible y exportación PNG separada. La ficha registra `photo to sketch` 3.600 búsquedas/mes US/en (KD 24) y `image to pencil sketch` 720 (KD 19); no hubo consultas nuevas ni gasto de DataForSEO.
- [x] E — acepta PNG/JPEG/WebP/GIF/AVIF/BMP decodificables por el navegador, limita a 8 MP, conserva dimensiones y alfa, rechaza opciones inválidas, no muta los píxeles fuente y permite cancelar exportación en lotes. Los formatos animados salen como un fotograma; metadatos no se conservan. No se promete generación artística/IA.
- [x] B — formulario con rangos accesibles, comparación, estado anunciado, cancelación, reset y PNG independiente. Explica el consumo local de CPU/memoria, el límite y que escritorio es preferible para imágenes grandes. Sin subida, API, almacenamiento ni procesamiento servidor.
- [x] Integración — catálogo, renderer, CSS, extensión locale, FAQs, contrato y pruebas de build; la prueba confirma que los otros 35 idiomas siguen bloqueados en vez de publicar inglés como traducción.
- [x] Verificación focalizada final: `node --test src/growth600/tools/photo-to-sketch/logic.test.mjs src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/locale-utils.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs` — **149/149 aprobadas**; `node --check` en lógica/controlador/copy/registro y `git diff --check` limpios. Build de prueba estático crea y elimina su salida temporal.
- [ ] X — no se probó controlador en Chrome ni bundle optimizado real; no hay dependencias instaladas en este clon y no se descargaron. La comprobación no demuestra todas las variantes de decodificación/permisos/memoria del navegador.
- [ ] L — la fuente inglesa pasa contrato y límites de metadatos; 35 idiomas permanecen como borradores `pending-tool-specific-translation` y se comprobó que el gate los rechaza.
- [ ] P/S — sin merge, deploy, actualización del sitemap público o envíos a buscadores.
- **Recuento vigente:** **73/323** candidatas con implementación inglesa. Quedan **250 filas** del plan por resolver, incluida una fila duplicada previamente detectada que debe sustituirse; las demás 249 son candidatas pendientes. Las 277 herramientas protegidas siguen intactas. Photo To Sketch no cuenta como completamente traducida, publicada ni indexada.

## Continuación · Schema Markup Validator (#171 detallado del plan) · 2026-10-08

- [x] C/F — herramienta local para revisar sintaxis JSON y reconocer tipos/propiedades de Schema.org en JSON-LD. La ficha del plan ya tenía volumen/competencia (3.600 búsquedas/mes US/en, KD 32 para `schema markup validator`; 140, KD 22 para `structured data validator`); no repetí llamadas a DataForSEO.
- [x] E — vocabulario oficial Schema.org v30.1 fijado; dataset transformado a un archivo estático compacto de 40.683 bytes. Incluye atribución/licencia CC BY-SA 3.0 y script reproducible que valida conteos mínimos antes de actualizar. No almacena la descarga sin filtrar.
- [x] E — parser local limitado a 300.000 caracteres, acepta raíz objeto/array, recorre `@graph`, reconoce contexto Schema.org y prefijos, y reporta términos ausentes como advertencias (no invalida automáticamente). No descarga `@context` remotos ni aplica dominio/rango como reglas rígidas. Las raíces JSON que no son objeto/array sí son error bloqueante.
- [x] B — controlador carga el vocabulario del mismo origen solo tras enviar el formulario; el texto del usuario no se transmite. Salida con `textContent`, lista de hallazgos limitada a 100, accesible con mensajes anunciados, ejemplo, copia y reinicio. Declara expresamente que no sustituye la prueba de resultados enriquecidos de Google.
- [x] Integración — catálogo aditivo, formulario, fuente inglesa, contrato de idioma, activo estático y tests. No colisiona con las 277 herramientas protegidas.
- [x] Pruebas focalizadas finales: `node --test src/growth600/tools/schema-markup-validator/logic.test.mjs src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs` — **151/151 aprobadas**; `node --check` en lógica, controlador, inglés y script de vocabulario; `git diff --check` limpio. La prueba de build temporal escribe/sella sus archivos y los limpia automáticamente.
- [ ] X — no se hizo QA de interacción en Chrome ni prueba de paquete final del sitio publicado; no se afirma validación integral de navegador.
- [ ] L — copy inglesa aprobada; 35 idiomas siguen `pending-tool-specific-translation`, y el release gate los rechaza.
- [ ] P/S — no hubo merge, deploy, alteración del sitemap público ni solicitudes de indexación.
- **Recuento vigente:** **74/323** candidatas con implementación inglesa; quedan **249 filas** del plan por resolver (248 candidatas y una fila duplicada pendiente de sustituir). Las 277 herramientas originales siguen intactas. Esta herramienta todavía no cuenta como completamente localizada, publicada ni indexada.

## Continuación · Readability Checker (#172 detallado del plan) · 2026-10-08

- [x] C/F — candidata única, separada del contador de palabras: medición estructural de legibilidad y métricas de texto. DataForSEO ya registraba `readability checker` —3.600 búsquedas/mes US/en, KD 34— y `Flesch reading ease calculator` —1.300/mes, KD 34—; no repetí consultas ni consumí más cuota.
- [x] E — selector explícito del idioma del texto; fórmulas distintas: Flesch Reading Ease (inglés), Fernández-Huerta (español), Kandel–Moles (francés), Amstad (alemán) y Gulpease (italiano). El resto de las 36 lenguas puede tener textos contados, pero no obtiene falsamente una puntuación con coeficientes ingleses.
- [x] E — conteo de palabras con `Intl.Segmenter`, frases, letras/caracteres con y sin espacios, longitud media y palabras largas. Los estimadores de sílabas son heurísticos, declarados; los textos <100 palabras muestran aviso de baja fiabilidad. Límite real de entrada 100.000 caracteres, indicado en la página y en el snippet, sin prometer uso literalmente ilimitado.
- [x] B — copia/ejemplo por idioma de fórmula, selector preseleccionado cuando el idioma de interfaz coincide con un idioma compatible, resultados accesibles, botón de copiar, limpiar, descarte de resultados obsoletos y controles locales. La entrada no se guarda ni se envía. Enlace/intent separado del word counter.
- [x] Integración — catálogo aditivo con referencia al contador existente, formulario semántico, contrato de copy, FAQs y extensión inglesa. Las demás 35 copias siguen marcadas `pending-tool-specific-translation`; el gate de build no las considera traducciones.
- [x] Pruebas focalizadas: `node --test src/growth600/tools/readability-checker/logic.test.mjs src/growth600/tools/readability-checker/controller.test.mjs src/growth600/catalog.test.mjs src/growth600/forms.test.mjs src/growth600/locale-contract.test.mjs src/growth600/render.test.mjs src/growth600/build.test.mjs` — **151/151 aprobadas**; incluyen aritmética de las fórmulas, idioma de fórmula, CJK, entrada vacía/grande, controlador con DOM simulado y bloqueo de los otros locales. `node --check` para lógica/controlador/copy y `git diff --check` pasan.
- [x] Bundle comprobado de forma aislada: **5.581 bytes** minificados; el guard de controller y red lo acepta. Esbuild y su caché se descargaron en un directorio temporal explícito y se eliminaron al concluir; no se instalaron dependencias en el repo.
- [ ] X — el controlador se probó con un DOM simulado, pero no hubo interacción visual real en Chrome ni comprobación de cada combinación de teclado/dispositivo; no marcar como QA integral.
- [ ] L — copy inglesa aprobada; 35 idiomas siguen bloqueados hasta traducir la herramienta.
- [ ] P/S — sin merge, deploy, sitemap público ni solicitud de indexación.
- **Recuento vigente:** **75/323** candidatas nuevas con implementación inglesa; quedan **248 candidatas válidas** y **1 fila duplicada** que debe reemplazarse por una herramienta única antes de poder contar 600. Las 277 herramientas protegidas permanecen intactas. Esta candidata no se considera aún completamente localizada, publicada o indexada.

## Continuación · Savings Goal Calculator (#173) · 2026-10-08

- [x] C/F — candidata específica de ahorro inverso; DataForSEO ya indicaba `savings goal calculator` 3.600 búsquedas/mes US/en, KD 36; `savings target calculator` 3.600, KD 36 y Alemania `sparziel rechner` 70, KD 18. No repetí consultas ni consumí cuota.
- [x] E — calcula la aportación mensual para un objetivo/plazo o el primer mes en que se alcanza un objetivo con aportación fija; saldo inicial y APR nominal opcionales; capitalización mensual; pagos al inicio o final de mes; contribuciones/interés/saldo desglosados. Rango de 0–100% APR, cantidades acotadas y plazo máximo de 1.200 meses. El caso matemático sin interés 1.200/12 da 100 al mes. Distingue meta ya alcanzada, inalcanzable y resultado que excede el horizonte.
- [x] B — formulario accesible de dos modos con campos que se activan/desactivan coherentemente, ejemplo, copiar, limpiar y descarte de resultados obsoletos. Avisos de estimación, mismo código monetario en todos los importes, sin conversión de divisas ni consejo financiero.
- [x] Integración — catálogo aditivo, render de formulario, contrato de campos/acciones/mensajes/FAQs, copy fuente en inglés y 35 borradores marcados `pending-tool-specific-translation`; gate de idiomas los rechaza. Enlaza como herramienta relacionada al compound-interest calculator y goal planner sin fusionar intenciones.
- [x] Pruebas focalizadas: lógica, controlador con DOM simulado, catálogo, formulario, contrato de locales, render y build — **155/155 aprobadas**. Incluye goal acceptance, redondeo al primer mes, inicio/fin de período, tasa cero, tope 100 años, validación, alternancia de modos y ocultación de resultados obsoletos.
- [x] Bundle compilado de manera aislada con Esbuild fijado en 0.28.2: **5.562 bytes minificados**, bajo el límite de 24 KiB. El paquete, la caché y el resultado se borraron del directorio temporal al terminar; el repositorio quedó sin dependencias instaladas.
- [ ] X — no se validó la interacción visual real en Chrome ni la versión final del pipeline completo. Se intentó `npm test`, pero la batería total no es reproducible en este clon sin instalar dependencias del proyecto (fallan módulos ausentes como `prettier` y `esbuild`); las 155 pruebas focalizadas sí pasaron.
- [ ] L — copy inglés aprobada; los otros 35 idiomas siguen bloqueados como borradores.
- [ ] P/S — no hay merge/deploy, sitemap público ni solicitud de indexación.
- **Recuento vigente:** **76/323** candidatas con implementación inglesa; quedan **247 candidatas válidas** y una fila duplicada del plan por sustituir. Las 277 herramientas protegidas siguen intactas. Esta herramienta no está completamente localizada, publicada ni indexada.

## Continuación · Severance Pay Calculator (#174) · 2026-10-08

- [x] C/F — candidato de estimación de indemnización distinto del salario periódico; volumen ya registrado en el plan: `severance pay calculator` 2.900/mes US/en, KD 0; no repetí llamadas a DataForSEO ni consumí cuota.
- [x] E — modo flexible calcula salario semanal × años × semanas/año desde supuestos del usuario. Modo Great Britain aplica la escala por edad, servicio completo, mínimo general de 2 años, máximo de 20 años y límites vigentes desde 2026-04-06: £751/semana y £22.530. Se restringe explícitamente a Inglaterra, Escocia y Gales; Irlanda del Norte tiene reglas distintas. Pide salario semanal promedio y fecha de nacimiento, inicio de empleo y despido. Incluye el aviso de que es un cálculo simplificado, no decide derechos, y enlaza fuente oficial.
- [x] X/E — suite focal inicial de catálogo/formularios/contrato de locales/render/build y lógica/controlador: **155/155 pruebas aprobadas tras corregir el conteo legal de años hacia atrás**. Aceptación flexible 500 × 10 × 2 = 10.000; pruebas de topes y 20 años; mínimo de dos años; cumpleaños dentro de un bloque anual; límite de banda de edad; año bisiesto; fechas inválidas y estado de formulario/controlador.
- [x] L parcial — fuente inglesa comprobada dentro de límites de metadata y dos FAQs. Borradores de los otros 35 idiomas permanecen explícitamente sin traducción específica; el gate de release los bloquea.
- [x] B parcial — código de cálculo en módulo local, sin API/servidor ni dependencias de runtime; formulario con dos modos, inputs desactivados coherentemente, copy/reset/ejemplo, aviso accesible y no persistencia de datos.
- [x] B — bundle independiente compilado temporalmente con Esbuild 0.28.2: **5.677 bytes**, dentro del límite de 24 KiB; pasa `assertLocalController` (sin llamadas externas ni ejecución dinámica). Se borraron paquete, caché y salida temporal.
- [ ] X — no se revisó en Chrome ni en dispositivos reales. Las pruebas focalizadas de Node/build pasan, pero no equivalen a QA visual real.
- [ ] L — faltan 35 traducciones específicas para que el tool sea publicable en los 36 idiomas.
- [ ] P/S — no fusionado ni desplegado; no se modificó el sitemap de producción ni se enviaron URLs. Los gates globales siguen abiertos; PageSpeed/Lighthouse no se ejecutó.
- **Recuento vigente:** **77/323** candidatas nuevas con implementación inglesa. Quedan **246 espacios del plan** por cerrar; el conjunto incluye una candidata previamente marcada para sustitución por duplicidad, que no debe computarse como una herramienta adicional hasta reemplazarla. Las 277 herramientas protegidas siguen intactas. #174 no está completamente localizada, publicada ni indexada.
- **Corrección legal revisada (2026-10-08):** la primera versión evaluaba la banda de edad desde aniversarios contados desde la contratación. Eso no seguía el método de la sección 162: contar los años de empleo hacia atrás desde el final del empleo. Se sustituyó por bloques anuales hacia atrás y se añadió una prueba donde un cumpleaños cae dentro de uno de esos bloques; el bloque parcial no asciende a la banda superior. Fuente primaria: [Employment Rights Act 1996, sección 162](https://www.legislation.gov.uk/ukpga/1996/18/section/162); contraste operativo: [GOV.UK para empleadores](https://www.gov.uk/staff-redundant/redundancy-pay). El formulario ahora aclara que la fecha final introducida puede diferir de la fecha legal pertinente por reglas de preaviso u otras circunstancias. Por ello sigue siendo una estimación simplificada, no una liquidación legal individual.

## Continuación · Divisibility Calculator (#175) · 2026-10-08

- [x] C/F — candidato registrado en DataForSEO: `divisibility calculator`, 2.900 búsquedas/mes US/en, KD 0; variante `divisibility rules calculator`, 2.900, KD 0. Reutilicé la investigación existente; no hice nuevas consultas ni consumí cuota.
- [x] E — herramienta diferenciada de `prime-number-checker` y `gcd-lcm-calculator`: contrasta un entero con una lista de hasta 30 divisores positivos, muestra divisibilidad, resto no negativo y cociente exacto, con reglas conocidas para divisores frecuentes. No lista todos los factores ni calcula MCD.
- [x] B — cálculo entero con `BigInt`, hasta 150 dígitos, sin errores de precisión de coma flotante. Incluye reglas 1–13, 25, 100 y 1000, divisor genérico, signo negativo, deduplicación, entradas inválidas, ejemplo 123/2/3, preset de divisores comunes, copiar, limpiar y ocultar resultados obsoletos. El procesamiento es local, sin API ni dependencias de runtime.
- [x] X — integración y pruebas focalizadas de lógica/controlador simulado/formulario/catálogo/render/contrato/build: **157/157 aprobadas**. El gate sigue rechazando correctamente los otros 35 locales sin traducción específica.
- [x] Metadata y contenido inglés con dos FAQs y límites de título/descripción comprobados por el contrato. Los borradores de las otras lenguas son explícitamente pendientes; no se afirma que estén traducidos.
- [x] Bundle aislado con Esbuild 0.28.2: **3.466 bytes minificados**. `assertLocalController` lo acepta bajo el presupuesto de 24 KiB, sin llamadas remotas ni ejecución dinámica. Paquete, caché y salida compilada temporales eliminados.
- [ ] X visual — aún falta QA interactiva real en Chrome; la suite usa DOM simulado y no reemplaza esa revisión.
- [ ] L — traducir y revisar las 35 lenguas pendientes antes del gate de publicación.
- [ ] P/S — no desplegado, no sitemap público modificado y no se solicitó indexación.
- **Recuento vigente:** **78/323** candidatas con implementación inglesa. Quedan **245 filas** del plan, una de las cuales está marcada previamente como duplicada y debe ser sustituida por una candidata única antes de poder alcanzar 600 herramientas únicas. Las 277 herramientas protegidas permanecen intactas. Esta herramienta nueva todavía no se cuenta como localizada, publicada o indexada.

## Continuación · Number Line Graphing Tool (#176) · 2026-10-08

- [x] C/F — intención y métricas ya investigadas en el plan: `number line generator`, 2.900 búsquedas/mes US/en, KD 0; variante `number line graphing tool` sin métrica medida. No repetí búsquedas ni consumí DataForSEO.
- [x] E — crea gráficos desde hasta 20 intervalos/puntos, uno por línea; acepta decimales, fracciones y extremos infinitos abiertos. Distingue extremo abierto/cerrado y no pretende resolver desigualdades. Incluye salida SVG descargable.
- [x] B — parser con límites explícitos, rechazo de intervalos vacíos/reversos, límite numérico, validación de fracciones/divisor no nulo, SVG construido con DOM/textContent, etiquetas de ticks localizadas y control para descargar SVG. Sin APIs ni procesamiento servidor.
- [x] X — pruebas de parser, aceptación `(1,3]`, fracciones/puntos/infinito, límites, controlador simulado, formulario, catálogo, contrato de locale, render y build: suite focalizada conjunta **163/163 aprobadas**.
- [x] Bundle aislado con Esbuild 0.28.2: **4.870 bytes minificados**, aceptado por `assertLocalController` (máximo 24 KiB; sin red remota/código dinámico). Caché, paquete y artefacto de comprobación temporal borrados.
- [ ] X visual — aún falta revisión de uso real en Chrome/dispositivo.
- [ ] L — inglés aprobado; los otros 35 idiomas son borradores explícitamente pendientes y continúan bloqueados para release.
- [ ] P/S — no desplegado; sitemap público e indexación intactos.
- **Bundle:** **4.888 bytes** minificados.
- **Recuento vigente:** **79/323** candidatas nuevas con implementación inglesa. Quedan **244 filas** del plan, incluida una duplicada que debe reemplazarse por una propuesta única. Las 277 herramientas existentes siguen intactas. #176 no está localizada en todos los idiomas, publicada ni indexada.

## Continuación · Laplace Transform Calculator (#196) · 2026-10-08

- [x] C/F — se reutilizaron datos del plan, sin volver a consultar DataForSEO: `laplace transform calculator`, 2.400 búsquedas/mes US/en, KD 1; secundaria medida `inverse laplace calculator`, 1.900/mes, KD 7.
- [x] E — dos direcciones: Laplace unilateral directa para sumas explícitas de constantes, potencias tⁿ, exp(a·t), senos/cosenos y exponenciales moduladas; inversa de polos simples/repetidos y fracciones parciales seno/coseno estándar, una por línea. Muestra región de convergencia en el cálculo directo.
- [x] B — gramática acotada, máximo 500 caracteres/12 términos, potencias hasta t⁸, validación y rechazo de formas no soportadas. No estima algebra simbólica general ni calcula fracciones parciales automáticamente. Totalmente local y sin dependencias ni API de conversión.
- [x] X — **159/159 pruebas** focales de lógica, controlador, catálogo, formulario, contrato de locales, render y build aprobadas; aceptación directa `1 → 1/s`, inversa `1/s → 1`, términos desplazados, seno/coseno y errores de sintaxis.
- [x] L parcial — copy inglés, metadata con límites y dos FAQs; los otros 35 locales son borradores no aprobados. El gate los mantiene fuera de publicación.
- [x] B — bundle minificado **6.719 bytes**, compilado con Esbuild 0.28.2 temporal desde el paquete ya presente en la caché local. `assertLocalController` lo acepta bajo 24 KiB y sin servicios remotos/código dinámico.
- [ ] X visual — falta QA real en Chrome/dispositivos; las pruebas automatizadas no la sustituyen.
- [ ] P/S — no desplegada; sitemap e indexación de producción intactos.
- **Recuento vigente:** **80/323** candidatas nuevas con implementación inglesa; quedan **243 filas** del plan, incluida una duplicada por sustituir. Las 277 originales siguen intactas. #196 no está traducida a todos los locales, publicada ni indexada.

## Continuación · Vector Calculator (#200) · 2026-10-08

- [x] C/F — reutilicé la investigación existente: `vector calculator`, 2.400 búsquedas/mes US/en, KD 5; `vector operations calculator`, 10/mes, KD 9. No se hicieron consultas adicionales ni se consumió cuota de DataForSEO.
- [x] E — suma y resta 2D/3D; productos escalar y vectorial (en 2D muestra el componente z firmado); magnitudes, normalización, ángulo en grados y proyección de A sobre B. El ejemplo de ejes x/y confirma producto escalar 0 y producto vectorial `(0,0,1)`.
- [x] B — aritmética local sin dependencias ni datos: límites explícitos de ±1.000.000.000 por componente; valida entradas, dimensiones y resultados; explica unidades compatibles y los casos no definidos de vector cero. El selector 2D oculta y desactiva z, se limpia cualquier resultado obsoleto, los errores visibles son localizables y el resultado se anuncia de forma accesible.
- [x] Integración — catálogo aditivo, formulario, copy inglés con dos FAQs, borradores de los otros 35 idiomas con estado pendiente y contrato que impide publicarlos sin traducción aprobada. Las 277 herramientas originales no se modificaron.
- [x] Pruebas focalizadas de lógica, controlador, catálogo, formulario, contrato de 36 locales, render y build: **158/158 aprobadas**. `node --check` pasó para lógica, controlador y módulos de copy; `git diff --check` limpio.
- [x] Bundle independiente con Esbuild 0.28.2: **3.896 bytes** minificados. `assertLocalController` lo acepta bajo 24 KiB, sin llamadas remotas ni ejecución dinámica. Se borraron el paquete temporal instalado, su log npm y el bundle de prueba.
- [ ] X visual — falta revisión interactiva real en Chrome/dispositivo; Node/build no la sustituyen.
- [ ] L — solo el inglés está aprobado; los otros 35 idiomas continúan bloqueados como borradores sin traducción específica.
- [ ] P/S — no fusionado ni desplegado; sitemap público e indexación no se tocaron.
- **Recuento vigente:** **81/323** candidatas con implementación inglesa; quedan **242 candidatas únicas válidas y una fila duplicada que debe reemplazarse**. Las 277 herramientas existentes siguen intactas. Vector Calculator aún no se cuenta como completamente localizada, publicada o indexada.

## Continuación · Cubic & Quartic Equation Calculator (#202) · 2026-10-08

- [x] C/F — reutilicé el dato del plan: `cubic equation calculator`, 2.400 búsquedas/mes US/en, KD 7; secundaria `polynomial roots calculator`, 390/mes, KD 0. No volví a consultar DataForSEO ni consumí cuota.
- [x] E/B — calcula raíces reales numéricas para polinomios cúbicos y cuárticos desde coeficientes, ordena las raíces distintas, estima multiplicidad y muestra residuo absoluto. La vista indica cuando no hay raíces reales o cuando no muestra raíces complejas. No promete CAS, factorización ni exactitud simbólica.
- [x] Controles — coeficientes finitos limitados a ±1.000.000; término principal distinto de cero y ratio mínimo 1e−12; cota de raíces que evita rangos extremos; errores claros, ejemplo `x³−1`, selector de grado con `x⁴` inactivo y deshabilitado en cúbica; resultados seguros vía `textContent`, estado accesible y limpieza de resultados obsoletos.
- [x] Integración — catálogo aditivo, formulario, controlador, copy inglés con dos FAQs, extensión locale para 36 entradas, contrato y fixture de build. Las 277 herramientas protegidas no se tocaron.
- [x] X automática — pruebas focalizadas de lógica, controlador, formulario, catálogo, contrato, render y build: **161/161 aprobadas**. Además, 200 conjuntos deterministas de raíces reales generadas pasaron la comprobación de cardinalidad y tolerancia.
- [x] B — bundle de controlador minificado: **4.461 bytes**; `assertLocalController` lo acepta bajo 24 KiB y sin llamadas remotas/código dinámico. No necesita API, consulta de datos ni proceso de servidor.
- [ ] X visual — revisión interactiva real en Chrome aún pendiente.
- [ ] L — solo inglés aprobado; los otros 35 locales siguen como borradores explícitamente pendientes y bloqueados para release.
- [ ] P/S — no fusionado ni desplegado; sitemap e indexación públicos no se modificaron.
- **Recuento vigente:** **82/323** candidatas con implementación inglesa; quedan **240 candidatas únicas válidas y una fila duplicada que debe sustituirse**. Las 277 herramientas existentes siguen intactas. Esta candidata no está localizada en todos los idiomas, publicada ni indexada.

## Continuación · Complex Number Calculator (#204 / herramienta 83) · 2026-10-08

- [x] C/F — candidata de números complejos diferenciada de la calculadora científica general: aritmética rectangular, módulo/argumento, conversiones polar-cartesiano y raíces n-ésimas 2–12; incluye la aceptación `i × i = −1`. Sin nueva consulta a DataForSEO.
- [x] E/X — suma/resta/producto, división con fórmula estable, conversión de ángulos en grados/radianes, rama principal, todas las raíces y controles de rango; división por cero y argumento indefinido de cero se exponen explícitamente. Operaciones locales y resultado insertado como texto, nunca HTML.
- [x] B/L — formulario adaptado a la operación elegida, entradas requeridas activas/desactivadas correctamente, ejemplo, reinicio, mensajes accesibles y copy/FAQs/metadata ingleses aprobados (title/description dentro de límites). No se agregó endpoint, API, coste ni carga remota.
- [x] E — pruebas focalizadas de lógica, controlador, formulario, catálogo, contrato de idioma y build: **161 aprobadas, 0 fallidas**. `node --check`/budget minificado final aún no acreditados.
- [ ] X/B/P/S — revisión visual/browser y bundle final no completados: el checkout no tiene `esbuild` (dependencia declarada del repositorio); `npm test` completo falla en múltiples módulos por paquetes locales ausentes, no por fallos de lógica de la herramienta. No instalé dependencias ni toqué Cloudflare/producción.
- [ ] L — solo inglés aprobado; los otros 35 idiomas continúan como borradores ingleses `pending-tool-specific-translation`. La puerta real de publicación rechaza esas 35 versiones. Por ello no desplegué, no alteré el sitemap de producción y no lo envié a Google/Bing/Yandex/Naver.
- **Recuento:** **83/323** candidatas implementadas en inglés; quedan **239 candidatas únicas válidas más una fila duplicada/reserva por sustituir**. Las 277 originales permanecen intactas. Esto no significa 360 páginas publicadas ni localizadas.
- **Siguiente reanudación:** traducir y revisar esta herramienta en los 35 idiomas; obtener dependencias reproducibles del repo sin alterar el lockfile; pasar X/B/P/S; después integrar/desplegar en el proyecto Pages de herramientas y actualizar/verificar su sitemap. Para pausar ahora, la rama debe conservar el respaldo remoto.

## Continuación · traducción y publicación de la tanda existente · 2026-10-08

- [x] L — los textos de las **83 herramientas** de Growth600 ya están disponibles en los **36 idiomas activos**. La tanda incluye 58 módulos de traducción completados en 35 destinos no ingleses; los cinco idiomas de la publicación piloto conservan sus traducciones aprobadas. Las traducciones nuevas se hicieron con Google Translate, se registran como `machine-accepted` a petición del propietario y no se presentan como revisadas por hablantes nativos.
- [x] Preservación — no se modificó la lógica de herramientas ni el catálogo protegido de 277 herramientas.
- [x] Validación — `npm run locale:release-check` pasó; `npm run check` generó 10.260 URLs del sitio principal; `npm test` pasó **1.260/1.260**; `npm run build:growth600` generó **3.024 páginas** (83 herramientas + 36 portadas × 36 idiomas), dentro del presupuesto estático configurado. `git diff --check` pasó.
- [x] Correcciones de release descubiertas por el build: permitir como vocabulario estático la URL literal `schema.org` sin permitir solicitudes remotas; usar las etiquetas de `fields` como fallback cuando un control de formulario está definido ahí.
- [x] P — integrada por PR #39 y publicada en `tools.usefulverse.com`; ambos workflows de despliegue terminaron correctamente. Se verificaron rutas públicas de ejemplo con idiomas RTL/CJK y el sitemap final.
- [x] S — sitemap de 3.024 URLs publicado y enviado en Google Search Console (Correcto; el panel aún refleja 216 URLs de la lectura anterior), Bing Webmaster (Processing) y Yandex Webmaster (en cola, hasta 1–2 semanas). Los paneles no confirman todavía el recuento nuevo/indexación.
- [ ] S — Naver Search Advisor pendiente de inicio de sesión y envío manual del sitemap del hub; no confundir sitemap accesible o envío aceptado con rastreo/indexación.
- **Alcance anterior a la publicación:** el hub tenía el piloto de 5 herramientas y 216 URLs. Tras la publicación, el sitemap pasó a **3.024 URLs**.
