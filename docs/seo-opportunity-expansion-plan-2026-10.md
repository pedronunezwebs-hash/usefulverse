# UsefulVerse · ejecución del plan de 100 oportunidades SEO

Documento editable de trabajo. Fuente de keywords: análisis DataForSEO ya realizado y aprobado; no repetir consultas ni sumar volúmenes como si fueran tráfico. Ejecución en rama aislada y publicación solo después de las puertas de calidad.

## Objetivo y criterios de cierre

- Llevar las 100 oportunidades del plan original a una herramienta útil: URL nueva solo cuando resuelva una intención distinta; en otro caso, ampliar la página existente y registrar la fusión.
- Mantener el sitio estático: entrada, archivos y cálculos se procesan en el dispositivo; sin Functions, Workers de procesamiento, API por visita, D1, R2 ni almacenamiento remoto.
- Mantener los 36 idiomas y localizar títulos, descriptions, copy, controles, estados, errores, preguntas frecuentes, `lang`, canonical, hreflang y enlaces relacionados.
- Cada herramienta se prueba con datos de referencia, casos límite, entrada inválida, teclado, lector/aria, móvil/tablet/escritorio, consola y peticiones de red. Los flujos con cámara/micrófono liberan permisos y recursos al terminar.
- Meta de Lighthouse para cada URL nueva: 100 en Performance, Accessibility, Best Practices y SEO. Medir en el mismo entorno y guardar evidencia; no declarar el objetivo alcanzado si hay una auditoría por debajo de 100. La puntuación es de laboratorio y no garantiza datos de campo ni posiciones.
- No desplegar con errores funcionales, traducciones absurdas, metadatos duplicados o por encima de límites, regresiones, assets mayores de 25 MiB o sitemap/artefacto fuera del límite de Pages.
- Verificar PR/CI, SHA de `main`, despliegue real de Cloudflare Pages, sitemap, robots, llm manifests, buscadores y limpieza total del clon/dependencias/QA temporales.

## Seguimiento de ejecución · 4 oct 2026

- Rama aislada: `codex/100-tools-expansion-execution-2026-10`; la rama aún no se ha publicado en GitHub ni fusionado.
- Catálogo: **100 candidatas implementadas como herramientas con 100 slugs nuevos**, además de las 100 existentes: 200 herramientas × 36 idiomas.
- Build: **7.488 URLs** — 7.200 páginas de herramientas, 36 portadas y 252 páginas de guías— y **7.864 archivos** desplegables. Assets menores de 25 MiB; no se encontró carpeta `functions/` ni endpoint de procesamiento.
- Traducciones: las 100 páginas nuevas se generan en los 36 idiomas y cada página incluye metadatos localizados, canonical y alternates; `npm run check` pasó. `npm run locale:release-check` también pasó (revisión editorial ampliada: 20 idiomas).
- Pruebas: `npm test` pasó **511/511**; `git diff --check` pasó. Las suites nuevas incluyen validación de motores y límites, pero esto no sustituye probar cada combinación de entradas/dispositivo en navegador.
- Browser QA: LaTeX generó SVG real y descargable; SQLite ejecutó una consulta SQLite en memoria; gráfico/diagrama generaron SVG; la vista RTL árabe no mostró overflow a 390 px y no tuvo errores de consola. Siete rutas móviles muestreadas dieron 100 en accesibilidad, buenas prácticas y SEO en localhost; su rendimiento fue 94–98. En SQLite desktop aislado, Lighthouse dio 100 en las cuatro categorías.
- Previsualización no productiva de Pages: `https://uv-100-tools-20261004.usefulverse.pages.dev`; el smoke test SQLite pasó allí. La emulación móvil de Lighthouse en la previsualización dio 98 de rendimiento; las auditorías SEO de `pages.dev` no son representativas porque Cloudflare bloquea indexación en dominios de preview.
- **No está publicado en `usefulverse.com`**. El objetivo de 100/100/100/100 no está demostrado en todas las rutas; no afirmar “PageSpeed perfecto”. Faltan auditorías exhaustivas de los 100 motores/36 idiomas, revisión final del diff, push/PR/CI, despliegue de producción, sitemap/paneles de buscadores y limpieza tras respaldo online.

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
| 0 | Instrucciones, solapes y runtime sin servicios de procesamiento | Parcial | Catálogo y rutas no duplicadas por slug; falta revisión editorial completa de solapes por intención. |
| 1 | Motores, validación, accesibilidad y carga diferida | Implementación lista; QA parcial | 100 motores; suite general 511/511; no hay prueba interactiva exhaustiva para cada motor. |
| 2 | Candidatas prioritarias | Implementadas; QA parcial | Incluye pruebas de lógica y smoke tests representativos; falta evidencia de toda la matriz. |
| 3 | Matemática, finanzas y desarrollo | Implementadas; QA parcial | Build genera rutas para todas; faltan auditorías de cada función en navegador. |
| 4 | Productividad, diseño, música y dispositivos | Implementadas; QA parcial | Runtime estático local; permisos físicos deben validarse en los dispositivos/cámaras objetivo. |
| 5 | Salud/actividad con supuestos y límites | Implementadas; revisión parcial | Copy con límites; falta inspección individual de todos los textos localizados. |
| 6 | Traducciones, metadatos, UX y Lighthouse | Traducción/build listos; Lighthouse no pasa el objetivo | 36 idiomas generados; build aprobado. Móvil no logró 100 en las rutas medidas y falta auditar todas las URLs. |
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
4. Lighthouse cuatro categorías: recorrer todas las URLs nuevas; ante fallo, corregir plantilla/idioma y repetir. Guardar resumen verificable bajo QA temporal y no en el bundle público.
5. Revisar diff y abrir PR; esperar CI y revisar resultado. Integrar y comprobar SHA remoto.
6. Verificar deploy Cloudflare Pages, 200 de rutas elegidas en los 36 idiomas (incluidos RTL), robots/sitemap/llms.txt. Enviar sitemap e IndexNow únicamente tras publicar y diferenciar recepción de indexación.
7. Comprobar cada panel disponible (Google, Bing, Yandex, Naver); Brave: rastreo permitido, sin prometer alta/índice. No afirmar que se envió donde falten permisos.
8. Quitar el clon, node_modules, caché, build, informes y capturas propios solo después de respaldar/verificar online. Mantener intactos credenciales, repos e historial de Git.
