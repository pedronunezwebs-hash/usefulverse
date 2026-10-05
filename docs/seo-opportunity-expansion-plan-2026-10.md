# UsefulVerse · ejecución del plan de 100 oportunidades SEO

Documento editable de trabajo. Fuente de keywords: análisis DataForSEO ya realizado y aprobado; no repetir consultas ni sumar volúmenes como si fueran tráfico. Ejecución en rama aislada y publicación solo después de las puertas de calidad.

## Objetivo y criterios de cierre

- Llevar las 100 oportunidades del plan original a una herramienta útil: URL nueva solo cuando resuelva una intención distinta; en otro caso, ampliar la página existente y registrar la fusión.
- Mantener el sitio estático: entrada, archivos y cálculos se procesan en el dispositivo; sin Functions, Workers de procesamiento, API por visita, D1, R2 ni almacenamiento remoto.
- Mantener los 36 idiomas y localizar títulos, descriptions, copy, controles, estados, errores, preguntas frecuentes, `lang`, canonical, hreflang y enlaces relacionados.
- Cada herramienta se prueba con datos de referencia, casos límite, entrada inválida, teclado, lector/aria, móvil/tablet/escritorio, consola y peticiones de red. Los flujos con cámara/micrófono liberan permisos y recursos al terminar.
- Rendimiento: revisar código dividido, carga diferida, caché, solicitudes, recursos y presupuestos estáticos. **No ejecutar PageSpeed Insights ni Lighthouse en esta continuación**, por instrucción explícita del usuario del 4-oct-2026. Los resultados antiguos de Lighthouse que aparecen abajo son solo antecedentes históricos.
- No desplegar con errores funcionales, traducciones absurdas, metadatos duplicados o por encima de límites, regresiones, assets mayores de 25 MiB o sitemap/artefacto fuera del límite de Pages.
- Verificar PR/CI, SHA de `main`, despliegue real de Cloudflare Pages, sitemap, robots, llm manifests, buscadores y limpieza total del clon/dependencias/QA temporales.

## Seguimiento de ejecución · 4 oct 2026

- PR #34 se fusionó en `main` el 4-oct-2026. SHA de producción: `5912246ff276d6dafb874d80388cb9c497c5a7d7`; workflow `validate-and-deploy` pasó (run 37198039889). Cloudflare Pages confirmó el despliegue Production `ee3d5219` en `https://ee3d5219.usefulverse.pages.dev`; el dominio canónico `https://usefulverse.com/` sirve la versión nueva.
- Catálogo: **100 candidatas implementadas como herramientas con 100 slugs nuevos**, además de las 100 existentes: 200 herramientas × 36 idiomas.
- Build: **7.488 URLs** — 7.200 páginas de herramientas, 36 portadas y 252 páginas de guías— y **7.865 archivos** desplegables (7.491 HTML). El archivo más pesado mide 14.264.838 bytes, por debajo de 25 MiB; no se encontró carpeta `functions/` ni endpoint de procesamiento.
- Traducciones: las 100 páginas nuevas se generan en los 36 idiomas y cada página incluye metadatos localizados, canonical y alternates; `npm run check` pasó. `npm run locale:release-check` también pasó (revisión editorial ampliada: 20 idiomas).
- Pruebas: `npm test` pasó **519/519**; `npm run check` generó 7.488 URLs; `npm run locale:release-check` aprobó 20 idiomas ampliados; `git diff --check` pasó. Hay tests de lógica para el sorteo amidakuji y el cambio de era japonesa Heisei→Reiwa, además del test de estado inicial para campos condicionales; esto no sustituye probar cada combinación de entradas/dispositivo en navegador.
- Browser QA: LaTeX generó SVG real y descargable; SQLite ejecutó una consulta SQLite en memoria; gráfico/diagrama generaron SVG; la vista RTL árabe no mostró overflow a 390 px y no tuvo errores de consola. Siete rutas móviles muestreadas dieron 100 en accesibilidad, buenas prácticas y SEO en localhost; su rendimiento fue 94–98. En SQLite desktop aislado, Lighthouse dio 100 en las cuatro categorías.
- Correcciones confirmadas en Pages: estilos críticos para tarjetas relacionadas, FAQ/guías/footer, selector de idioma y campos condicionales; preload de CSS global; estado inicial según el primer select; escucha de `units` para BMI métrico/US. Se reparó el salto del selector de idioma en móvil y se probaron cálculos/alternancia de modo en browser.
- Mejoras a herramientas existentes del plan: promedio ponderado y nota necesaria en el examen final; aportaciones periódicas en interés compuesto; conteo de caracteres japoneses; sorteo amidakuji en el selector de nombres japonés; y conversión de fecha gregoriana a era japonesa en la calculadora de fechas. Las dos últimas ya están implementadas con lógica local y sin URLs nuevas.
- Lighthouse 13.5 en Pages, móvil, con Chrome 154; se omite únicamente `is-crawlable` por `noindex` intencional del preview. En el barrido inglés inicial, **94/100 rutas** dieron 100/100/100/100 en sus dos intentos; las seis restantes también dieron 100/100/100/100 en reintentos con procesos de Chrome aislados. Una ruta representativa pasó en **36/36 idiomas** (100/100/100/100). Tras los cambios finales del commit `c9e60b0`, las dos páginas japonesas modificadas —calculadora de fechas y selector de nombres— volvieron a dar **100/100/100/100** cada una en su primer Lighthouse aislado. Reportes temporales fuera del bundle público; verificar rastreabilidad en producción después del deploy.
- **Corrección adicional tras auditar el mapa de Lighthouse:** los paquetes de idioma serializaban dos mapas casi idénticos (`ui` y `runtime`). El bundle ahora los une sin perder claves y conserva la prioridad original de `runtime`; el objeto runtime vacío mantiene compatibilidad con módulos existentes. Pruebas nuevas comparan la salida y prioridad en francés, urdu, telugu y guyaratí. Reducción en bytes serializados: fr 48,0 %, ur 47,4 %, te 49,9 %, gu 49,8 %, fa 49,9 % y uk 50,0 %.
- Revalidación local sobre el cambio: `npm test` **516/516**, `npm run check` pasó con 7.488 URLs, `npm run locale:release-check` pasó (20 idiomas ampliados) y `git diff --check` pasó. La salida tiene 7.865 archivos y `sitemap.xml` ocupa 582.398 bytes; el verificador encontró 0 URLs sin validar y ningún archivo individual por encima del umbral configurado de 25 MiB.
- No se afirma que cada una de las 3.600 traducciones tenga una ejecución individual de Lighthouse: el plan adjunto pide auditoría de plantillas/motores representativos y evitar miles de corridas redundantes. Todas las URLs sí pasan validación estática en build; la muestra Lighthouse cubre las 100 herramientas nuevas en inglés y una ruta representativa por cada locale.
- Producción verificada tras el deploy: `/`, herramientas en inglés, japonés, español y árabe, `robots.txt`, `sitemap.xml` y `llms.txt` responden HTTP 200. El sitemap público válido tiene **7.488 `<loc>`**, todas bajo `https://usefulverse.com/`, y mide 582.398 bytes. `robots.txt` permite el rastreo general y anuncia `https://usefulverse.com/sitemap.xml`; las páginas inspeccionadas sirven canonical propio, 73 referencias hreflang y no llevan meta `noindex`.
- IndexNow se envió tras publicar el sitio al endpoint de Yandex: **HTTP 200 para 7.488 URLs**. Bing documenta el intercambio de URLs enviadas entre buscadores participantes de IndexNow; la aceptación de la petición solo notifica y no prueba rastreo, indexación o ranking. Brave puede rastrear las rutas permitidas; no existe un alta ordinaria que garantice inclusión.
- Paneles directos: la pestaña disponible de Google Search Console redirigió a inicio de sesión; no hay `.dev.vars` con credencial API en este clon. Tampoco existe `.env.yandex` para Yandex Webmaster OAuth; no se ha registrado una app OAuth. Por tanto, no se afirma que se haya hecho un envío manual en GSC ni una operación directa de Yandex Webmaster, Bing Webmaster o Naver. El sitemap estable ya está publicado y descubierto desde `robots.txt`; IndexNow fue enviado donde se podía sin credenciales.
- Cierre: la implementación está publicada y el workflow de producción está verde. Se limpiarán el clon, sus dependencias y los informes temporales después de confirmar esta actualización del plan en GitHub y la verificación del deploy de este PR documental. No se borra historial Git ni credenciales.

## Estado inicial observado

- `main`: 100 herramientas × 36 idiomas, 3.600 páginas localizadas y 3.888 URLs en sitemap.
- Línea base limpia: `npm test` 473/473; `npm run check` 3.888 URLs; `npm run locale:release-check` aprobado.
- La investigación autorizada ya gastó $0,14088 y cubrió 387 combinaciones keyword/mercado/idioma. No volver a consultar DataForSEO para ejecutar esta lista.
- Las 100 candidatas medidas se implementan como páginas propias excepto las mejoras identificadas al final. Mantener activos los términos/volúmenes/KD en la fuente adjunta y no atribuir volúmenes medidos a sinónimos no consultados.

## Catálogo completo de candidatas

### Matemáticas y estadística (1–22)

1. Resolutor de ecuaciones (lineales y cuadráticas; comprobar soluciones).
2. Sistemas de ecuaciones 2×2 y 3×3 (una, ninguna o infinitas soluciones).
3. Factorización de polinomios (factorizar, expandir y comprobar equivalencia).
4. Graficador de funciones (varias curvas, zoom, puntos e intersecciones).
5. Derivadas simbólicas y evaluación en un punto.
6. Integrales definidas/indefinidas; separar resultado exacto y aproximado.
7. Matrices (operaciones, determinante, inversa, sistemas y singularidad).
8. Combinatoria (combinaciones, permutaciones y factoriales).
9. Probabilidad (unión, intersección, complemento y condicional).
10. Distribuciones normal, binomial y Poisson.
11. Intervalos de confianza para medias y proporciones, método explícito.
12. Tamaño de muestra, confianza, margen y población finita opcional.
13. Regresión lineal/correlación con pares, recta y gráfico.
14. Puntuación Z y percentiles, incluida desviación académica japonesa.
15. Resolutor de triángulos con casos ambiguos señalados.
16. Volumen/superficie de sólidos definidos (prismas, cilindros, esfera, cono).
17. Geometría de coordenadas (pendiente, distancia, punto medio, recta).
18. Progresiones aritméticas y geométricas (términos y sumas).
19. Tablas de verdad y exportación.
20. División larga mostrando pasos reales.
21. Redondeo y cifras significativas con reglas explícitas.
22. Pruebas estadísticas t, chi-cuadrado y ANOVA con supuestos y p-values.

### Finanzas y cálculos prácticos (23–39)

23. IVA/GST/impuesto de venta (añadir/extraer tasa manual).
24. Punto de equilibrio (costes fijos/variables, precio y unidades).
25. Comisiones por porcentaje, tramos e inversa.
26. ROI y CAGR.
27. Flujo de caja, VAN y TIR; detectar ausencia/múltiples soluciones.
28. Pago de tarjeta (interés, pago fijo/mínimo, plazo y coste total).
29. Varias deudas: avalancha frente a bola de nieve.
30. Alquilar frente a comprar con supuestos editables.
31. Depreciación por métodos y tabla anual.
32. Comparador de precio por unidad.
33. Peso volumétrico con divisor configurable.
34. Hormigón: losas/columnas/volumen/desperdicio/bolsas según rendimiento.
35. Pintura: paredes, huecos, capas y rendimiento elegido.
36. Baldosas: piezas, juntas y desperdicio configurable.
37. Madera/board feet y coste manual.
38. Escalador de recetas sin conversiones masa/volumen no justificadas.
39. Validador IBAN estructural + checksum, sin verificar titularidad/existencia.

### Documentos y productividad (40–51)

40. Recibos imprimibles/descargables con moneda y partidas.
41. Presupuestos con partidas, descuento, impuesto manual y vigencia.
42. Citas APA/MLA/Chicago con datos introducidos; bibliografía y cita en texto.
43. Carta de presentación editable, sin IA remota.
44. Calendarios imprimibles por mes/año, semana inicial, notas y tamaño.
45. Tarjetas de estudio con CSV e impresión/práctica local.
46. Sopa de letras con palabras, dificultad, solución.
47. Crucigramas con pistas, colocación válida y solución imprimible.
48. Cartones de bingo múltiples, con semilla reproducible.
49. Fichas de matemáticas con solucionario comprobado.
50. Bloc local con búsqueda, descarga y persistencia local optativa explicada.
51. Teleprompter con velocidad, tamaño, espejo, pausa y teclado.

### Desarrollo, datos y SEO (52–67)

52. Formateador/minificador HTML conservador.
53. Formateador/minificador CSS respetando variables y `calc()`.
54. Formateador/minificador JavaScript con errores sintácticos; nunca ejecutar para formatear.
55. Editor HTML/CSS/JS con preview aislada y ejecución manual.
56. Validador JSON Schema sin referencias remotas.
57. Consultas JSONPath y exportación local.
58. Conversor XML↔JSON con pérdidas/opciones visibles.
59. SQL Playground SQLite local, CSV de muestra/importación y reset.
60. Constructor/intérprete cron que distingue Unix/Quartz y zona horaria.
61. Datos de prueba con esquema, semilla, tipos y exportación JSON/CSV/SQL.
62. Editor hexadecimal y descarga de copia.
63. Generador robots.txt con comprobación sintáctica.
64. Generador sitemap XML desde URLs provistas, sin rastreo falso.
65. Generador JSON-LD por tipo, sin prometer rich results.
66. Generador de meta tags y preview de Open Graph/tarjetas sociales.
67. Constructor UTM que no altera el destino.

### Diseño e imágenes (68–80)

68. Editor de imágenes con ajustes/anotación, sin duplicar crop/resize existentes.
69. Marca de agua texto/logo, posición/opacidad/lotes.
70. Fotos de identificación con medidas configurables, sin garantizar aceptación oficial.
71. Generador de memes a partir de imagen del usuario; plantillas solo con licencia.
72. Optimizador SVG que conserva vector y verifica salida.
73. Editor de pixel art y escalado sin suavizado.
74. Paletas: extracción desde imagen, combinaciones y exportación.
75. Constructor de CSS gradients/sombras/bordes.
76. Constructor visual CSS Grid/Flexbox y exportación.
77. Gráficos desde datos/CSV (barras, líneas, sectores, dispersión).
78. Diagramas/mapas mentales, exportación.
79. Editor de ecuaciones LaTeX con SVG/PNG, no compilador de documentos.
80. Tarjetas de visita para imprimir con medidas configurables.

### Salud/actividad (81–88)

81. IMC solo adultos, fórmula/unidades y limitaciones.
82. BMR/TDEE/calorías con fórmula y nivel de actividad visibles.
83. Macronutrientes según objetivo calórico aportado; sin prescribir dietas.
84. Estimación de grasa corporal con método e incertidumbre.
85. Fecha estimada de parto/edad gestacional con supuestos, nunca predicción.
86. Calendario aproximado de ciclo/ovulación; nunca anticonceptivo fiable.
87. Ritmo de carrera/distancia/tiempo y proyecciones diferenciadas.
88. Estimación de repetición máxima con fórmulas/unidades comparables.

### Música/sonido/pruebas locales (89–100)

89. Traductor Morse texto↔Morse, reproducción y WAV; caracteres compatibles explícitos.
90. ASCII art de texto e imagen, tamaño y TXT.
91. Metrónomo con compás, acentos y tap tempo.
92. Afinador por micrófono con frecuencia/nota/desviación y limitación de ruido.
93. Piano virtual con teclado, ratón y táctil; Web Audio local.
94. Buscador de acordes, inversiones y diagramas en el alcance verificable.
95. Generador de ruido blanco/rosa/marrón, volumen bajo y temporizador.
96. Comprobador de teclado; advertir atajos interceptados por el sistema.
97. Comprobador de ratón: botones/rueda/clics/dobles clics.
98. Comprobador de webcam, resolución y preview local; liberar cámara.
99. Comprobador de altavoces/canales con volumen prudente.
100. Tiempo de reacción con rondas/mediana/salidas anticipadas y latencia.

## Mejoras que pertenecen a herramientas ya existentes (no crear URL)

- Average Calculator: promedio ponderado de notas y objetivo de nota final.
- Compound Interest: aportaciones periódicas/SIP con supuestos, sin rentabilidad prometida.
- Random Name Picker: modo sorteo japonés tipo amidakuji.
- Date Calculator: era japonesa ↔ gregoriano con fechas correctas.
- Word Counter: recuento por caracteres japoneses, no segmentación inglesa.

## Fases y estado

| Fase | Alcance | Estado | Evidencia |
|---|---|---|---|
| 0 | Instrucciones, solapes y runtime sin servicios de procesamiento | Implementada; revisión editorial continua | Se conservan funciones existentes cuando atacan la misma intención; las candidatas locales procesan en el navegador. |
| 1 | Motores, validación, accesibilidad y carga diferida | Implementada; gates automatizados aprobados | Suite final 519/519; la interacción se cubrió además con smoke tests representativos, no con toda combinación de dispositivo/entrada. |
| 2 | Candidatas prioritarias | Implementadas; lógica automatizada y smoke representativo | Las 100 candidatas están en el catálogo y build localizado. |
| 3 | Matemática, finanzas y desarrollo | Implementadas; estático/cliente | Rutas y metadatos validan; cálculos de referencia incluidos en tests y browser smoke. |
| 4 | Productividad, diseño, música y dispositivos | Implementadas; flujos de permisos revisados por código | Runtime local; la disponibilidad física de cámara/micrófono depende del navegador/dispositivo y no se extrapola a todos los equipos. |
| 5 | Salud/actividad con supuestos y límites | Implementada; avisos y supuestos incluidos | Alcance visible en copy de las herramientas; no es consejo clínico ni financiero. |
| 6 | Traducciones, metadatos, UX y Lighthouse | Build y auditoría representativa aprobados | 36 idiomas generados; Lighthouse 100/100/100/100 en las 100 nuevas URLs inglesas (incluidos seis reintentos aislados) y en una URL de muestra por cada uno de los 36 idiomas. |
| 7 | Sitemap, CI, PR, publicación, buscadores y limpieza | Implementada; producción publicada y verificada | PR #34 integrado; CI/deploy verdes; 7.488 URLs en el sitemap real; IndexNow aceptado HTTP 200. Los envíos de panel que requieren autenticación quedan explícitamente no realizados; aceptación no significa indexación. La limpieza local concluye tras integrar esta nota de cierre. |

## Pruebas matemáticas mínimas

| Entrada | Resultado de referencia |
|---|---|
| `x² − 5x + 6 = 0` | raíces 2 y 3 |
| `x+y=3`, `x−y=1` | x=2, y=1 |
| `x²−9` | `(x−3)(x+3)` |
| derivada de `x³` | `3x²` |
| integral definida de x en [0,1] | 0,5 |
| det([[1,2],[3,4]]) | −2 |
| puntos (0,0),(2,4) | pendiente 2; distancia √20; punto medio (1,2) |
| 10 ÷ 3 | cociente 3; resto 1 |
| total 120 con impuesto incluido del 20 % | base 100; impuesto 20 |
| deuda 1.200, interés 0 y cuota 100 | 12 meses |
| flujos −100,+110 con descuento 10 % | VAN 0; TIR 10 % |
| IMC, 70 kg y 1,75 m | aprox. 22,86 (solo cálculo, sin diagnóstico) |
| Morse `SOS` | `... --- ...` |

Añadir pruebas de vacío, negativos, extremos, entradas inválidas, singularidades, locale decimal, unidades, TZ, Unicode/RTL y repetición/cancelación.

## Gates de publicación

1. `npm test`, `npm run check`, `npm run locale:release-check`, `git diff --check`.
2. Validar cada HTML generado: título/description únicos, canonical, hreflang recíproco, sitemap exacto y XML válido. Reducir alternates del sitemap si hace falta y conservar hreflang HTML.
3. Assets locales y diferidos; ningún formulario/archivo se manda a terceros. No añadir Worker/API de procesamiento.
4. PageSpeed/Lighthouse: omitido en esta ejecución por instrucción explícita. Validar rendimiento con inspección de módulos, tamaños del build, carga diferida, caché y red; no sustituirlo por un barrido de URLs.
5. Revisar diff y abrir PR; esperar CI y revisar resultado. Integrar y comprobar SHA remoto.
6. Verificar deploy Cloudflare Pages, 200 de rutas elegidas en los 36 idiomas (incluidos RTL), robots/sitemap/llms.txt. Enviar sitemap e IndexNow únicamente tras publicar y diferenciar recepción de indexación.
7. Comprobar cada panel disponible (Google, Bing, Yandex, Naver); Brave: rastreo permitido, sin prometer alta/índice. No afirmar que se envió donde falten permisos.
8. Quitar el clon, node_modules, caché, build, informes y capturas propios solo después de respaldar/verificar online. Mantener intactos credenciales, repos e historial de Git.

## Seguimiento incremental de la continuación · 5 oct 2026

- El catálogo real ya no es de 200: la rama de trabajo contiene **214 herramientas, 36 idiomas y 7.992 URLs de build/sitemap** (7.704 páginas de herramientas y 36 portadas; las restantes son guías). No confundir este SHA de rama con producción: aún no está integrado ni desplegado.
- Fase 0: `docs/functional-audit.csv` ya tiene una fila por herramienta. La matriz debe seguir actualizándose con evidencia, no convertir un HTTP 200 o una sola ruta feliz en “verificada”.
- Fase 1: política de micrófono limitada a las rutas que la necesitan y controles Pomodoro/audio ya están cubiertos por comprobaciones del build/tests; siguen pendientes verificaciones físicas de permisos, sonido y entrega real de avisos en navegador/OS.
- En esta tanda, `screen-recorder` pasó a **corregida, no verificada en navegador real**: pruebas de APIs simuladas cubren inicio por clic, formato anunciado por el navegador simulado, parada/preview/descarga, liberación de pista, denegación y fin de la pista compartida.
- La evidencia PDF existente permite clasificar `pdf-tools`, `pdf-protect-unlock`, `pdf-repair`, `pdf-redact`, `pdf-to-pdfa` y `pdf-page-editor` como **corregidas con cobertura parcial**; no equivale a una auditoría de archivos adversariales ni a garantía de compatibilidad universal. La matriz conserva los límites por herramienta.
- En una prueba aislada de Chrome local para `html-to-pdf`, se introdujeron Unicode, tabla, manejador de evento, script, imagen remota y enlace. La vista previa y el traspaso a impresión funcionaron; se escapó el título y se quitaron scripts, eventos, imágenes, href y estilos introducidos, sin petición externa ni error de consola. La vista de impresión se capturó con un `window.open` de prueba, así que no se guardó ni verificó un PDF real: estado **corregida/parcial**, no totalmente verificada. No contarla como totalmente comprobada por solo generar la vista previa o abrir el traspaso de impresión.
- `pdf-document-converter`: Chrome local convirtió un PDF sintético de una página (generado en memoria, 868 bytes) a un DOCX de 980 bytes; se abrió el ZIP de salida y `word/document.xml` conservó “Hello UsefulVerse PDF”. Es **corregida/parcial**; todavía no prueba PDF→XLSX/PPTX ni las tres rutas Office→PDF/Word→PDF, interoperabilidad con Office o documentos complejos. El fixture y la salida se mantuvieron en memoria; no se guardaron archivos en disco.
- `pdf-form-filler`: Chrome local abrió un PDF de una página creado en memoria con un campo de texto y una casilla, rellenó ambos, dibujó la firma con los manejadores reales del canvas y exportó otra copia. Al reabrirla se confirmó el texto, la casilla marcada, una página y un XObject de imagen para la firma; el original conservó campo vacío y casilla desmarcada. Estado **corregida/parcial**: XFA, otros tipos AcroForm, casos multipágina/rotados, lectores reales y variaciones de PDF quedan por comprobar. Los archivos de prueba permanecieron en memoria.
- `image-to-text`: Chrome local procesó una imagen PNG sintética de 1000×280 con texto inglés grande; la salida fue exactamente `USEFULVERSE OCR 123`. El motor, worker, WASM y datos de idioma se solicitaron solo al empezar y desde el propio sitio. Sin solicitudes externas ni errores de consola. **Corregida/parcial**: otros idiomas, formatos, calidades de imagen, cancelación y descarga no se verificaron.
- `pdf-ocr`: la misma imagen sintética se incrustó en un PDF escaneado de una página, creado en memoria. La herramienta devolvió `--- Page 1 ---` y el texto exacto; no se modificó el original. OCR local y bajo demanda; sin errores de consola ni solicitudes externas (el modelo inglés ya estaba en caché tras la prueba anterior). **Corregida/parcial**: no cubre manuscritos, idiomas adicionales, PDFs multipágina/rotados, rangos, cancelación ni documentos grandes.
- `portrait-background-remover`: Chrome generó en memoria un PNG sintético de retrato 512×512 y ejecutó la eliminación real. El modelo/WASM del mismo sitio se cargó solo tras pulsar Start; el PNG resultante fue válido, 512×512 y con transparencia en las cuatro esquinas más alfa parcial en los bordes del sujeto. Limpiar quitó vistas previas y descarga; sin errores de consola ni solicitudes de terceros. **Corregida/parcial**: faltan fotos reales y variedad de poses/iluminación, entradas grandes, cancelación y otros navegadores.
- `media-transcriber`: Chrome local transcribió un MP3 sintético en inglés de 23 KB. Una frase clara de unos cinco segundos dio “Hello, welcome to Useful Verse. This is a short transcription test. The sky is blue.” El manejador de descarga generó el nombre `clear-test-transcript.txt` y su contenido exacto se leyó desde Blob; se interceptó el clic final para no guardar ningún archivo. La red mostró descargas del modelo/configuración/ONNX/WASM de Hugging Face/CDN, pero ninguna subida del audio; la inferencia es local. Una primera frase demasiado corta salió mal: Whisper Tiny puede equivocarse, como ya advierte la página. **Corregida/parcial**: faltan otros idiomas/códecs, medios largos, cancelación y grabaciones reales.
- Los siete flujos antes marcados sin evidencia suficiente (`html-to-pdf`, `pdf-document-converter`, `pdf-form-filler`, `image-to-text`, `pdf-ocr`, `portrait-background-remover` y `media-transcriber`) tienen ya una prueba de navegador acotada; no equivale a cobertura completa. Siguen pendientes combinaciones de entrada y dispositivos descritas en sus filas. No se publican las conclusiones como garantías universales.
- Verificación de esta tanda: `npm test` **646/646**, `npm run check` genera y valida 7.992 URLs, `npm run locale:release-check` aprobado para 20 locales ampliados, y `git diff --check` limpio. Son pruebas de la rama, no del despliegue público.
- Fases 2–8 aún no cerradas para el nuevo plan de 78 candidatas: hay herramientas de la primera tanda prioritaria ya incluidas, pero las fases de crecimiento restantes, integración final, publicación, actualización del sitemap externo y comprobación de buscadores siguen pendientes. DataForSEO ya costó **$0,05076**; no repetir consultas.

## Continuación · 5 oct 2026 (segunda tanda)

- Revisión concreta de `/tools/online-timer/`: el `intro` en inglés y los 20 idiomas ampliados afirmaba que el temporizador mantenía precisión si la pestaña dormía, en contradicción con la advertencia correcta de la propia página sobre retrasos de pestañas en segundo plano/dispositivos suspendidos. Se sustituyó por una explicación prudente y localizada en los 20 idiomas afectados; se añadió una regresión que recorre las 36 traducciones publicadas y comprueba las 20 correcciones.
- El panel contextual posresultado ya estaba implementado: aparece al éxito, admite cerrar, muestra hasta tres enlaces distintos en el idioma activo y dispone de pruebas automáticas; no se duplicó.
- Verificación de esta tanda: `npm test` **647/647**, `npm run check` valida **7.992 URLs** (7.704 páginas de herramientas, 36 portadas y 252 páginas de guías) y `npm run locale:release-check` aprobado para 20 locales ampliados. Chrome local confirmó visualmente el aviso italiano actualizado. No se ejecutó PageSpeed/Lighthouse ni DataForSEO.
- Esta es solo una corrección de copy/SEO funcional; no cierra las fases pendientes del plan de expansión, no implica que se haya publicado ni enviado el sitemap. Se conserva la rama y el despliegue de producción hasta que las fases restantes y sus gates estén completados.

## Continuación · 5 oct 2026 (habit tracker)

- Se añadió **Habit Tracker** como siguiente candidata del catálogo, en una única URL por idioma (sin generar variantes que se canibalicen): calendario de 35 días, rachas actual/mejor, progreso de 30 días, límite visible de 20 hábitos, guardado local explícito, importación/exportación JSON y borrado de prueba/datos guardados.
- La herramienta no hace peticiones de procesamiento, no usa Functions/APIs y no necesita servicios de pago. La lógica está cubierta por pruebas de calendario, UTC/local, Unicode, duplicados, límites, rachas y copias JSON; runtime y CSS se descargan bajo demanda solo al entrar en esta herramienta. Se añadió un presupuesto de tamaño del bundle y se comprobó que los tamaños de idioma permanecen dentro de su límite.
- La UI y el copy SEO estático están presentes en **36 idiomas**. Las traducciones se generaron como borradores automáticos y se corrigieron errores literales conocidos; no se afirma revisión nativa integral.
- Chrome local verificó añadir, marcar hoy, guardar, recargar y recuperar un hábito. Se borró el hábito y la copia de prueba al concluir. La salida de descarga JSON real y la compatibilidad con todos los navegadores/dispositivos aún no se certifican.
- `npm test` **656/656** pasó; `npm run check` generó y validó **8.028 URLs** (7.740 herramientas, 36 portadas, 252 guías; 215 herramientas × 36 idiomas); `npm run locale:release-check` pasó para los 20 locales ampliados; `git diff --check` limpio. No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. Estas son verificaciones locales de la rama, no de producción.
- Esta tanda es incremental. No marca terminadas las candidatas restantes del plan, no integra a `main`, no despliega a producción ni afirma que los paneles de buscadores hayan recibido este sitemap. La rama se conserva respaldada en GitHub; el cierre de producción y los envíos externos siguen pendientes hasta terminar las fases planeadas.

## Continuación · 5 oct 2026 (herramientas de planificación y práctica)

- Se añadieron ocho candidatas locales que no estaban en la rama: lista de equipaje, matriz de decisiones, planificador de entrenamiento, creador de cuestionarios, juego de memoria, práctica de kana, práctica de ábaco y práctica de ortografía. Se añadió también una práctica básica de Hangul, sin duplicar la práctica japonesa.
- Cada herramienta tiene una URL por idioma, controles con etiquetas/estados accesibles y contenido localizado en los 36 idiomas mediante borradores de traducción automática; no se afirma revisión humana nativa. Hangul deja claro que cubre 14 consonantes y 10 vocales básicas y que la romanización es aproximada.
- Runtime bajo demanda: planificadores y juegos se separan del código general; ortografía y Hangul tienen módulos específicos, incluidos en el hash de assets para invalidar caché al cambiar. Ningún procesamiento/archivo se envía a servidor y no se añadieron APIs de pago ni servicios remotos por usuario.
- Pruebas reales en Chrome local cubrieron los flujos principales de las nueve herramientas. Se actualizaron sus filas de evidencia en `docs/functional-audit.csv`; el auditor generó filas para **227 herramientas y cero sin evidencia**. Esto registra un smoke acotado, no prueba todas las opciones, formatos, idiomas o dispositivos; cada limitación restante aparece en su fila.
- Verificación local: `npm test` **687/687**; `npm run check` valida **8.460 URLs** (8.172 páginas de herramientas × los idiomas publicados, 36 portadas y 252 guías); `npm run locale:release-check` aprobado para 20 locales ampliados; auditor funcional con cero filas pendientes y `git diff --check` limpio. El primer gate detectó tres cadenas inglesas en páginas traducidas; se corrigieron y el build volvió a pasar. No se ejecutaron DataForSEO ni PageSpeed/Lighthouse.
- Estado: cambio aún en la rama local, no fusionado ni desplegado. Quedan candidatas y ampliaciones de la lista, además de revisar los restantes flujos funcionales, la publicación y los envíos de sitemap posteriores. Este hito no cierra el plan completo.

## Continuación · 5 oct 2026 (juegos locales)

- Se añadieron **2048** y **Sudoku** como dos herramientas, no como variaciones de URL. Sudoku genera tableros aleatorios con solución única; usa `crypto.getRandomValues` cuando está disponible y conserva solo hasta 64 huellas de 64 bits de tableros recientes en almacenamiento local para reducir repeticiones entre días. No persiste el tablero resuelto, las notas ni el progreso. Con almacenamiento bloqueado sigue funcionando con aleatoriedad del dispositivo y memoria de la sesión.
- Chrome local comprobó 2048 con movimiento, deshacer y teclado; Sudoku con rechazo de conflicto, notas accesibles, pista correcta, aviso de tablero incompleto, 31 pistas en dificultad difícil y desplazamiento de selección con teclado. Las pruebas de lógica validan que Sudoku tenga una sola solución. No se afirma un recorrido completo de resolución ni compatibilidad universal.
- El catálogo de la rama contiene ahora **229 herramientas × 36 idiomas**: 8.244 URLs de herramientas, 36 portadas y 252 guías; **8.532 URLs** totales. El build y el sitemap XML locales pasan. `npm test`: **690/690** antes del último refuerzo de historial aleatorio; las pruebas se vuelven a ejecutar al cerrar esta tanda. `npm run locale:release-check` y `git diff --check` también pasan en la rama.
- Sigue siendo trabajo local en la rama, no producción. No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. Aún faltan juegos/candidatas del plan, el repaso final funcional, el despliegue y los envíos externos del sitemap.

## Continuación · 5 oct 2026 (tres en raya)

- Se añadió **Tic-tac-toe** como una sola página en los 36 idiomas, con modo contra computadora o dos jugadores en el mismo dispositivo, turnos, resultado, marcador de sesión y reinicio. El rival usa minimax local y la búsqueda exhaustiva en pruebas confirma que no pierde; no existe modo multijugador en red.
- El motor y su CSS son específicos de esta página, con presupuestos de tamaño y carga bajo demanda; no requiere cuentas, funciones de servidor, API ni coste por uso. Las traducciones se generaron con el flujo gratuito ya usado para los borradores. El control de build detectó “Computer” sin traducir en neerlandés/tagalo; ambas etiquetas se corrigieron antes de pasar.
- Chrome local confirmó respuesta de computadora, victoria de X en dos jugadores, actualización del marcador y borrado del marcador. Pruebas de lógica cubren ocho líneas ganadoras, empate, jugadas inmediatas, inmutabilidad y todos los posibles movimientos humanos frente al rival. No se probó una partida completa en cada navegador/dispositivo.
- `npm test`: **694/694**; `npm run check`: **8.568 URLs** (8.280 herramientas, 36 portadas y 252 guías); `npm run locale:release-check` aprobado para 20 locales ampliados; auditor funcional: **230 herramientas, 0 filas sin evidencia**. `git diff --check` limpio. Estas son verificaciones locales de rama, no de producción.
- No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. El plan aún mantiene candidatas y mejoras pendientes; todavía no se han integrado, desplegado ni enviado estos nuevos URLs a los paneles de buscadores.

## Continuación · 6 oct 2026 (Sudoku aleatorio y ajedrez local)

- Se volvió a comprobar Sudoku en Chrome local: el botón de nueva partida y una recarga entregaron tableros diferentes. El motor genera aleatoriamente la solución y las pistas, usando `crypto.getRandomValues` si está disponible; retiene hasta 4.096 huellas recientes (unos 11 años a una partida diaria) para reducir repeticiones. Borrar o bloquear el almacenamiento del navegador elimina esa memoria; no se promete unicidad absoluta si el usuario limpia los datos. Los tableros/progreso no se guardan. Las pruebas comparan partidas consecutivas y una muestra de 30 días distintos, y confirman una única solución por tablero.
- Se añadió una página de ajedrez local, sin modo en red ni servidor: movimientos reglamentarios, jaque/mate/tablas, enroque, captura al paso, promoción elegible, deshacer, giro del tablero, PGN guardado explícitamente en el dispositivo con opción de borrado y descarga PGN. El motor chess.js se descarga solo en esa página y su licencia BSD-2-Clause está publicada.
- Chrome local verificó legal highlights e2→e3/e4, jugada y cambio de turno, deshacer, guardar/recuperar/borrar PGN y jaque mate con Fool’s Mate. Árabe RTL conserva el tablero LTR y expone 64 casillas nombradas accesibles; el build valida las 36 traducciones. Las pruebas del motor cubren aperturas legales, jugadas ilegales, ambos enroques, captura al paso, promoción, mate, ahogado, PGN y deshacer. Descarga física, almacenamiento denegado y variedad de dispositivos/navegadores siguen sin comprobarse.
- `npm test`: **699/699**; `npm run check`: **8.604 URLs** (8.316 páginas de herramientas × 36 idiomas, 36 portadas y 252 páginas de guías); `npm run locale:release-check` aprobado para 20 locales ampliados. El auditor funcional ahora tiene evidencia para 231 herramientas; cada registro sigue siendo un smoke específico, no certificación de todo flujo/archivo/dispositivo.
- No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. La rama permanece sin merge ni deploy; no se han enviado los cambios del sitemap a producción ni a paneles de buscadores. El plan completo conserva más carencias/fases por ejecutar.

## Continuación · 6 oct 2026 (Solitario Klondike)

- Se añadió **Solitario Klondike** como una URL por idioma: 1 o 3 cartas por robo, siete columnas, cuatro fundaciones, movimientos descendentes alternando color, revelar cartas, reciclaje del mazo y deshacer. La partida vive en memoria de la pestaña; no se guarda ni se sube. Un reparto aleatorio no garantiza que toda partida tenga solución.
- La lógica tiene pruebas de reparto de 52 cartas únicas, reglas de tableau/fundación, movimientos y revelado, robo de una/tres cartas, reciclaje y copias independientes para deshacer. Chrome local verificó 7 cartas visibles/21 ocultas, robo, deshacer, un reparto nuevo diferente, ausencia de botones HTML anidados y el selector traducido con `dir=rtl` en árabe.
- La nueva interfaz se localizó en las 36 lenguas publicadas mediante traducción automática sencilla. El gate encontró “Tableau” sin traducir en neerlandés; se corrigió a “Speelveld” antes de completar. No equivale a revisión nativa completa.
- `npm test`: **705/705**; `npm run check`: **8.640 URLs** (8.352 páginas de herramientas, 36 portadas y 252 guías); `npm run locale:release-check`: aprobado para 20 locales ampliados; auditor funcional: **232 herramientas, 0 sin evidencia**; `git diff --check` limpio. El tamaño del motor y CSS está acotado y solo se carga en esta ruta.
- La evidencia funcional de Solitario es parcial: no se completó una partida ganadora en Chrome ni se recorrieron allí todas las variantes de movimiento; los tests unitarios sí cubren las reglas descritas. Sin compatibilidad universal certificada.
- No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. Todo sigue local en la rama aislada, sin despliegue ni envío de sitemap a producción. Las demás candidatas del plan siguen pendientes.

## Continuación · 6 oct 2026 (Buscaminas)

- Se añadió **Buscaminas** con tableros clásico fácil (9×9/10 minas), medio (16×16/40) y difícil (30×16/99); el primer clic mantiene libre una zona 3×3 y abre automáticamente las áreas vacías. Incluye banderas por modo explícito (móvil/teclado) o clic derecho, pistas numéricas, acción de despejar alrededor de una pista, contador, cronómetro y reinicio. No guarda partidas ni requiere servicios/llamadas por uso.
- Siete pruebas unitarias cubren dificultad, vecindad, aleatoriedad/reparto, primer clic seguro, conteos, despeje, banderas/límites, combinación correcta/incorrecta de banderas, victoria/derrota y parada del cronómetro. Chrome local confirmó primer clic seguro con apertura de zona, navegación por flechas con un solo tab stop, atajo F para bandera y contador, reinicio, tablero difícil de 480 celdas y traducción RTL árabe. Se usaron borradores automáticos en los 36 idiomas; no revisión nativa integral.
- `npm run check` genera **8.676 URLs** (8.388 páginas de herramientas, 36 portadas y 252 guías); se debe volver a correr al cerrar esta tanda junto con test completo, revisión de idiomas, auditor funcional y `git diff --check`. No se afirma que la muestra de navegador cubra cada partida, dispositivo o lector de pantalla.
- No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. Sigue en la rama aislada: sin merge/deploy ni envío a buscadores. Quedan herramientas candidatas y fases de publicación/SEO del plan.

## Continuación · 6 oct 2026 (Nonogram y rompecabezas deslizante)

- Nonogram se añadió como puzzle 5×5 con generación local y verificación de solución única; pruebas de lógica y smoke de navegador cubrieron marcado, limpieza, feedback incompleto, nueva partida y árabe. El juego completo en navegador no se completó.
- Se añadió **Sliding Puzzle** con tamaños 3×3, 4×4 y 5×5. Cada tablero parte ordenado y se mezcla mediante movimientos legales aleatorios, por lo que conserva una ruta de solución; incluye contador, nuevo tablero, clic y flechas, con fichas nombradas y aria-live. No persiste ni transmite estado.
- El nuevo runtime/CSS se construye aparte, bajo demanda y con presupuesto; se añadieron traducciones automáticas de borrador para 36 idiomas y corrección del rótulo que el gate detectó sin traducir en tagalo. No se presenta como revisión nativa.
- Chrome local comprobó 4×4, dos movimientos legales (clic y teclado), cambio a 3×3 y 5×5 y Arabic RTL. Tres tests específicos validan permutaciones, paridad de resolubilidad, movimientos y límites; no se resolvió una partida completa en navegador.
- Estado del build tras Sliding Puzzle: **8.748 URLs** (235 herramientas × 36 idiomas, 36 portadas y 252 páginas de guías). Antes de integrar o publicar, volver a ejecutar suite completa, auditor funcional y checks de localización/build. El conteo es del sitemap local de la rama, no de producción.
- No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. La rama sigue sin merge ni despliegue; aún quedan fases/candidatas del plan y el cierre de SEO/publicación.

## Continuación · 6 oct 2026 (aleatoriedad Sudoku, secuenciador y generadores CSS)

- Sudoku conserva generación criptográficamente aleatoria con fallback del navegador, solución única por puzzle y hasta 4.096 huellas recientes en almacenamiento local para reducir repeticiones. La suite ahora compara 100 tableros distintos; en Chrome local “Nuevo puzzle” mostró un tablero diferente. La memoria anti-repetición se pierde si se borra o bloquea el almacenamiento; no se afirma que jamás se repita.
- Se añadieron tres herramientas locales: generador/preview de animaciones CSS, editor de formas `clip-path` y generador/preview de filtros CSS. Sus módulos y estilos son diferidos a sus rutas; la salida está acotada/validada y no necesita servidor ni API.
- Chrome local: Bounce mostró keyframes 0/65/100 y “Copy CSS” completó; Triangle produjo el polígono esperado; el filtro actualizó `brightness(100%)` a `135%`; la página suajili mostró controles y etiquetas localizados. El secuenciador permitió marcar C5/step 1, iniciar reproducción (estado “Stop melody”) y detenerla (estado “Playback stopped”). Esta muestra no certifica todos los navegadores, equipos, presets ni cada control.
- La matriz funcional se regeneró contra el catálogo actual: **240 herramientas, 0 filas pendientes**, con evidencia acotada y límites declarados. El secuenciador y estas tres herramientas tienen módulo y evidencia asignados; las filas “verified” describen la muestra comprobada, no compatibilidad universal.
- `npm test`: **733/733**; `npm run check`: **8.928 URLs** (8.640 páginas de herramientas en 36 idiomas, 36 portadas y 252 páginas de guías); `npm run locale:release-check`: aprobado en 20 locales ampliados; `git diff --check`: limpio.
- README actualizado a 240 herramientas y 8.928 URLs, con un inventario literal generado de todas las `<loc>` del sitemap local mediante `npm run docs:urls`. El inventario y la salida son de build local, no implican que estén publicados.
- No se usaron DataForSEO ni PageSpeed/Lighthouse. Este corte sigue siendo local; no afirmar integración, despliegue ni notificación a buscadores hasta completar las candidatas/fases restantes y verificar el flujo remoto.

## Continuación · 6 oct 2026 (Conecta 4, Reversi y actualización de inventario)

- Se añadieron **Conecta 4** y **Reversi** en las 36 rutas localizadas, con motor separado y cargado solo en estas páginas. Son partidas locales para dos personas en el mismo dispositivo; no tienen matchmaking, IA ni sincronización.
- Reversi ahora centraliza el desenlace de turno en una función de lógica pura. La suite cubre turno normal, pase forzado, fin de partida y marcador. Chrome local jugó una respuesta válida para ambos colores y confirmó el volteo de fichas; el reinicio en árabe restauró el tablero inicial. RTL y nombres de casillas estuvieron localizados. Conecta 4 ya tenía una victoria horizontal completa comprobada en la sesión y cinco familias de reglas probadas.
- `npm test`: **747/747**; `npm run check`: **9.108 URLs** (245 herramientas × 36 idiomas, 36 portadas y 252 guías); `npm run locale:release-check` aprobado para 20 paquetes ampliados. La auditoría se regeneró para **245 herramientas, cero sin evidencia**; “sin evidencia” no significa que todas estén exhaustivamente verificadas. Se añadieron límites reales a los dos registros nuevos.
- README y su inventario literal de todas las URLs se regeneraron desde `dist/sitemap.xml`; cache global/HTML y assets inmutables versionados quedaron revisados en `public/_headers`. El build y su hash incluyen el runtime local de estos juegos. `git diff --check` limpio.
- No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. El cambio aún permanece en una rama local y no está publicado; la ejecución de fases/candidatas restantes y publicación externa sigue abierta.

## Continuación · 6 oct 2026 (damas / Checkers)

- Se incorporó **Checkers (damas estilo estadounidense)** en las 36 versiones localizadas, como partida local para dos personas: tablero 8×8, movimientos diagonales, capturas obligatorias, saltos múltiples, coronación y fin cuando el rival no puede mover. Se explicita que no incluye reglas de reclamación de tablas/repetición ni oponente en línea.
- Las pruebas detectaron y corrigieron dos problemas antes de cerrar este bloque: el motor obtenía incorrectamente los índices de las piezas desde `flatMap`, y la selección de fichas dependía de un estado local al renderizar. Se añadieron estados de foco/selección accesibles y se corrigió el falso `aria-pressed` de las fichas ocupadas. La interfaz usa un runtime y CSS local diferidos, compartidos únicamente por los tres juegos de tablero.
- Cinco pruebas nuevas cubren posición inicial y siete movimientos por jugador, captura obligatoria, secuencia de dos capturas, promoción y movimiento hacia atrás de rey, entradas ilegales y victoria por falta de jugadas. En Chrome local se comprobó selección, movimiento diagonal, cambio de turno, reinicio, etiquetas árabes y RTL. La guía árabe recibió correcciones explícitas tras detectar que el traductor confundía «checker» con un verificador.
- `npm test`: **752/752**; `npm run check`: **9.144 URLs** (246 herramientas × 36 idiomas, 36 portadas y 252 guías); `npm run locale:release-check`: aprobado para 20 locales ampliados; auditor funcional actualizado a **246 herramientas** (205 con evidencia específica, 41 corregidas con evidencia específica, 0 pendientes en la matriz); `git diff --check`: limpio. “Sin pendientes en la matriz” no garantiza cobertura exhaustiva; las limitaciones quedan registradas por herramienta.
- README e inventario literal de URLs regenerados desde el sitemap local con `npm run docs:urls`. La nueva ruta `/tools/checkers/` y sus 35 traducciones están incluidas. No se ejecutaron DataForSEO ni PageSpeed/Lighthouse. El cambio sigue en la rama aislada, aún no desplegado ni enviado a buscadores.
- Esta herramienta termina solo el elemento Checkers de la lista. Todavía hay candidatas nuevas y mejoras del plan sin completar; el plan general permanece abierto.
