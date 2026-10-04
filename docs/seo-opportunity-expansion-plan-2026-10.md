# UsefulVerse · ejecución del plan de 100 oportunidades SEO

Documento editable de trabajo. Fuente de keywords: análisis DataForSEO ya realizado y aprobado; no repetir consultas ni sumar volúmenes como si fueran tráfico. Ejecución en rama aislada y publicación solo después de las puertas de calidad.

## Objetivo y criterios de cierre

- Llevar las 100 oportunidades del plan original a una herramienta útil: URL nueva solo cuando resuelva una intención distinta; en otro caso, ampliar la página existente y registrar la fusión.
- Mantener el sitio estático: entrada, archivos y cálculos se procesan en el dispositivo; sin Functions, Workers de procesamiento, API por visita, D1, R2 ni almacenamiento remoto.
- Mantener los 36 idiomas y localizar títulos, descriptions, copy, controles, estados, errores, preguntas frecuentes, `lang`, canonical, hreflang y enlaces relacionados.
- Cada herramienta se prueba con datos de referencia, casos límite, entrada inválida, teclado, lector/aria, móvil/tablet/escritorio, consola y peticiones de red. Los flujos con cámara/micrófono liberan permisos y recursos al terminar.
- Lighthouse: objetivo 100/100/100/100 en las plantillas y motores representativos, con cobertura de las 100 rutas inglesas nuevas y muestras localizadas que cubran los 36 idiomas. Repetir de forma aislada los resultados por debajo de 100; no ejecutar miles de auditorías redundantes. Es una puntuación de laboratorio, no garantiza datos de campo ni posiciones.
- No desplegar con errores funcionales, traducciones absurdas, metadatos duplicados o por encima de límites, regresiones, assets mayores de 25 MiB o sitemap/artefacto fuera del límite de Pages.
- Verificar PR/CI, SHA de `main`, despliegue real de Cloudflare Pages, sitemap, robots, llm manifests, buscadores y limpieza total del clon/dependencias/QA temporales.

## Seguimiento de ejecución · 4 oct 2026

- Rama aislada remota: `codex/100-tools-expansion-execution-2026-10`; PR #34 está abierto contra `main` y todavía no se ha fusionado. SHA vigente: `b738140ec13e75beb8240ffa2948418534d6749e`; CI pasó para ese SHA y el preview manual `https://a04d1b84.usefulverse.pages.dev` corresponde a ese build. El deploy de producción se omite en eventos PR.
- Catálogo: **100 candidatas implementadas como herramientas con 100 slugs nuevos**, además de las 100 existentes: 200 herramientas × 36 idiomas.
- Build: **7.488 URLs** — 7.200 páginas de herramientas, 36 portadas y 252 páginas de guías— y **7.865 archivos** desplegables (7.491 HTML). El archivo más pesado mide 14.264.838 bytes, por debajo de 25 MiB; no se encontró carpeta `functions/` ni endpoint de procesamiento.
- Traducciones: las 100 páginas nuevas se generan en los 36 idiomas y cada página incluye metadatos localizados, canonical y alternates; `npm run check` pasó. `npm run locale:release-check` también pasó (revisión editorial ampliada: 20 idiomas).
- Pruebas: `npm test` pasó **519/519**; `npm run check` generó 7.488 URLs; `npm run locale:release-check` aprobó 20 idiomas ampliados; `git diff --check` pasó. Hay tests de lógica para el sorteo amidakuji y el cambio de era japonesa Heisei→Reiwa, además del test de estado inicial para campos condicionales; esto no sustituye probar cada combinación de entradas/dispositivo en navegador.
- Browser QA: LaTeX generó SVG real y descargable; SQLite ejecutó una consulta SQLite en memoria; gráfico/diagrama generaron SVG; la vista RTL árabe no mostró overflow a 390 px y no tuvo errores de consola. Siete rutas móviles muestreadas dieron 100 en accesibilidad, buenas prácticas y SEO en localhost; su rendimiento fue 94–98. En SQLite desktop aislado, Lighthouse dio 100 en las cuatro categorías.
- Correcciones confirmadas en Pages: estilos críticos para tarjetas relacionadas, FAQ/guías/footer, selector de idioma y campos condicionales; preload de CSS global; estado inicial según el primer select; escucha de `units` para BMI métrico/US. Se reparó el salto del selector de idioma en móvil y se probaron cálculos/alternancia de modo en browser.
- Mejoras a herramientas existentes del plan: promedio ponderado y nota necesaria en el examen final; aportaciones periódicas en interés compuesto; conteo de caracteres japoneses; sorteo amidakuji en el selector de nombres japonés; y conversión de fecha gregoriana a era japonesa en la calculadora de fechas. Las dos últimas ya están implementadas con lógica local y sin URLs nuevas.
- Lighthouse 13.5 en Pages, móvil, con Chrome 154; se omite únicamente `is-crawlable` por `noindex` intencional del preview. En el barrido inglés inicial, **94/100 rutas** dieron 100/100/100/100 en sus dos intentos; las seis restantes también dieron 100/100/100/100 en reintentos con procesos de Chrome aislados. Una ruta representativa del grupo de herramientas pasó en **36/36 idiomas** (100/100/100/100). Reportes temporales fuera del bundle público; verificar rastreabilidad en producción después del deploy.
- **Corrección adicional tras auditar el mapa de Lighthouse:** los paquetes de idioma serializaban dos mapas casi idénticos (`ui` y `runtime`). El bundle ahora los une sin perder claves y conserva la prioridad original de `runtime`; el objeto runtime vacío mantiene compatibilidad con módulos existentes. Pruebas nuevas comparan la salida y prioridad en francés, urdu, telugu y guyaratí. Reducción en bytes serializados: fr 48,0 %, ur 47,4 %, te 49,9 %, gu 49,8 %, fa 49,9 % y uk 50,0 %.
- Revalidación local sobre el cambio: `npm test` **516/516**, `npm run check` pasó con 7.488 URLs, `npm run locale:release-check` pasó (20 idiomas ampliados) y `git diff --check` pasó. La salida tiene 7.865 archivos y `sitemap.xml` ocupa 582.398 bytes; el verificador encontró 0 URLs sin validar y ningún archivo individual por encima del umbral configurado de 25 MiB.
- No se afirma que cada una de las 3.600 traducciones tenga una ejecución individual de Lighthouse: el plan adjunto pide auditoría de plantillas/motores representativos y evitar miles de corridas redundantes. Todas las URLs sí pasan validación estática en build; la muestra Lighthouse cubre las 100 herramientas nuevas en inglés y una ruta representativa por cada locale.
- **Aún no está publicado en `usefulverse.com`**. El PR #34 sigue abierto; CI aprobó `b738140`. Próximas puertas: actualizar verificaciones posteriores al merge, integrar y verificar Cloudflare Pages, sitemap/robots/llms y notificaciones disponibles a buscadores. Limpiar temporales propios solo después de confirmar el respaldo remoto y el deploy.

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
| 7 | Sitemap, CI, PR, publicación, buscadores y limpieza | En curso, solo preview | Preview Pages comprobada; producción/sitemaps/paneles aún intactos. No borrar el clon antes del respaldo y cierre online. |

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
4. Lighthouse cuatro categorías: medir plantillas y motores representativos (esta ejecución cubre las 100 rutas inglesas nuevas y un ejemplo en cada locale); ante fallo, aislar y repetir. No agotar minutos con miles de mediciones redundantes. Guardar evidencia bajo QA temporal y no en el bundle público.
5. Revisar diff y abrir PR; esperar CI y revisar resultado. Integrar y comprobar SHA remoto.
6. Verificar deploy Cloudflare Pages, 200 de rutas elegidas en los 36 idiomas (incluidos RTL), robots/sitemap/llms.txt. Enviar sitemap e IndexNow únicamente tras publicar y diferenciar recepción de indexación.
7. Comprobar cada panel disponible (Google, Bing, Yandex, Naver); Brave: rastreo permitido, sin prometer alta/índice. No afirmar que se envió donde falten permisos.
8. Quitar el clon, node_modules, caché, build, informes y capturas propios solo después de respaldar/verificar online. Mantener intactos credenciales, repos e historial de Git.
