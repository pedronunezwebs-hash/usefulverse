# UsefulVerse · Estrategia hacia 1 millón de visitas al día

Versión 1 · 20-oct-2026 · Análisis del plan completo y de lo que falta para llegar a la meta.
Principio que no se toca: **gratis, sin límites, sin suscripciones, para todo el mundo**. **No se borra ninguna herramienta.**

---

## 1. Dónde estamos y qué significa 1 millón al día

| | Hoy | Meta |
|---|---|---|
| Visitas al día | ~0-30 clics de Google (antes de la caída: ~10-26 clics/día con ~3.500 impresiones) | 1.000.000 |
| Visitas al mes | < 1.000 | ~30 millones |
| Herramientas | 700 (+300 casi listas) | las mismas, mucho mejores |
| Idiomas | 36-37 | 37 |

**Referencia real del sector** (estimaciones de Semrush, no oficiales): iLovePDF ≈ 190-226 millones de visitas al mes
y Smallpdf ≈ 40 millones. Ambos llevan más de 10 años, tienen una autoridad de dominio altísima y una marca que la gente
busca por nombre. **30 millones al mes** te pondría en el top mundial de sitios de herramientas: es posible, pero es una
meta de **varios años**, no de meses. Nadie llega ahí solo con SEO de páginas. Hace falta lo que tienen todos los grandes:

1. **Autoridad** (otros sitios que te enlazan y te citan).
2. **Marca** (gente que escribe «usefulverse» o vuelve directamente).
3. **Producto que se comparte y al que se vuelve** (uso repetido, no visitas de una vez).
4. **Muchísimas búsquedas long-tail bien resueltas, en muchos idiomas.**

Tu plan actual cubre muy bien el punto 4 y parte del 3. **Le faltan el 1 y el 2.** Este documento los añade.

### Escalera realista (orientativa, sin garantía)

| Escalón | Visitas/día | Qué lo desbloquea | Horizonte estimado |
|---|---|---|---|
| 0 → 1.000 | 1.000 | Recuperar la confianza de Google (calidad, fase 0, sin picos de URLs) | 2-6 meses |
| 1.000 → 10.000 | 10.000 | Las 128 herramientas con datos y las 50 nuevas de alta demanda, excelentes en sus 37 idiomas; primeros enlaces y menciones | 6-12 meses |
| 10.000 → 100.000 | 100.000 | Autoridad (cientos de dominios que enlazan), marca reconocible, uso repetido (juegos diarios, PWA) y long-tail de variantes | 12-24 meses |
| 100.000 → 1.000.000 | 1.000.000 | Marca global: búsquedas por nombre, tráfico directo y recurrente, ser «la alternativa gratuita» citada por medios, Reddit y las IA | 2-4+ años |

---

## 2. Análisis de la estrategia actual

**Lo que está muy bien:**
- **Todo en el navegador, sin servidor.** Es tu mayor ventaja: con 1 millón de visitas al día el coste sigue siendo casi 0 en
  Cloudflare. Los competidores con servidor pagan por cada archivo; tú no. Por eso puedes ser «sin límites» de verdad.
  → **Regla de oro: ninguna herramienta debe depender de un servidor de pago**, o el «gratis e ilimitado» deja de ser
  sostenible.
- 37 idiomas: los grandes cubren bien inglés y algunos idiomas europeos, pero en muchos mercados (indonesio, vietnamita,
  tailandés, turco, persa, bengalí, hindi, swahili, polaco, ucraniano…) hay mucha menos competencia buena. Ahí puedes ganar antes.
- Catálogo enorme (1.000 herramientas): muchas puertas de entrada distintas.
- Prioridad por datos (`progress.csv`) y puerta de calidad por herramienta.

**Lo que frena o falta:**
1. **Autoridad casi inexistente** (sin medir; probablemente muy pocos dominios enlazan a UsefulVerse). Sin autoridad, Google no
   confía en 25.000 URLs de un dominio de 2 meses. **Es el mayor freno para pasar de 10.000 a 100.000 visitas al día.**
2. **Marca invisible:** nadie busca «usefulverse» todavía. El rediseño «Planeta Infinito» ayuda, pero la marca crece con uso y
   con menciones.
3. **Visitas de una sola vez:** si el usuario resuelve su tarea y no vuelve, cada visita hay que «ganarla» en Google otra vez.
   Los grandes viven de usuarios recurrentes.
4. **Dos dominios** (`usefulverse.com` y `tools.`): se reparte la autoridad y parece una estrategia para esconder volumen.
5. **Medición:** no hay analítica de uso (qué herramientas se completan, cuántos vuelven).
6. **Cómo se mantiene el proyecto:** «gratis para siempre» necesita ingresos que no estropeen la experiencia (sección 8).

---

## 3. Palanca 1 · Autoridad y menciones (lo que más falta)

Todo **limpio y dentro de las políticas de Google**: nada de comprar enlaces, redes de blogs ni intercambios masivos.

1. **Widgets para incrustar («Embed this tool»).** Calculadoras, conversores y juegos que blogs, escuelas y foros pueden
   insertar en su web con un `<iframe>`. Es el motor histórico de sitios como Omni o calculator.net.
   - El enlace de crédito del widget **va con `rel="nofollow"` y con el nombre de la marca** («UsefulVerse»), nunca con
     palabras clave. Google considera esquema de enlaces los enlaces con palabras clave dentro de widgets.
   - El valor no es el enlace en sí: son las **visitas directas, la marca y las menciones** que generan. Los sitios que te
     incrustan acaban enlazándote de forma natural.
2. **Aparecer en las listas de «alternativas gratuitas»:** AlternativeTo, SaaSHub, Product Hunt (un lanzamiento por categoría,
   no uno solo), directorios de herramientas educativas, listas «awesome» de GitHub y recursos de profesores. Con cuenta real y
   descripción honesta.
3. **Páginas de «alternativa gratuita a X»** (para iLovePDF, usar la comparación honesta de `PDF-VS-ILOVEPDF.md` §4) (p. ej. «Alternativa gratis a iLovePDF sin límites»): comparación honesta, sin
   copiar su marca ni hablar mal de ella. Captan a gente cansada de los límites y suscripciones, que es exactamente tu
   público.
4. **Contenido que merece enlaces (linkable assets):** guías definitivas por categoría («Cómo reducir un PDF para email,
   paso a paso»), tablas de referencia (conversiones, fórmulas), datos propios agregados y anónimos («los tamaños de PDF más
   comunes»). Los profesores, los periodistas y Wikipedia citan referencias, no herramientas.
5. **Comunidades:** responder de verdad en Reddit, Quora, Stack Exchange o foros cuando alguien pregunta por una herramienta
   gratis, diciendo que eres el creador. Una respuesta útil a la semana vale más que cien enlaces.
6. **Código abierto (opcional y muy potente):** publicar en GitHub una o varias piezas (p. ej. el compresor de PDF en el
   navegador o el generador de sudokus) como librería libre. Atrae desarrolladores, estrellas, enlaces y confianza. No hace
   falta abrir todo el repo.
7. **Medir la autoridad gratis:** informe «Enlaces» de Search Console (mensual) y Bing Webmaster Tools (backlinks). Objetivo de
   escalones: 50 → 300 → 1.000+ dominios que enlazan.

---

## 4. Palanca 2 · Marca y tráfico directo

1. **«Planeta Infinito» en todas partes:** favicon, el loader con la lunita, el «pop» de éxito y los colores por categoría.
   Coherencia total = reconocimiento.
2. **PWA instalable:** «Añadir a la pantalla de inicio», funcionar sin conexión una vez cargado (archivos locales) y abrir
   archivos PDF o imágenes desde el sistema (File Handling API donde exista). Un icono en el móvil = visitas directas.
3. **Recientes y favoritas** en la home (guardadas en el dispositivo) y **«Guárdanos» discreto** (ya existe; mejorarlo).
4. **Extensión de navegador** (fase posterior): clic derecho → «Comprimir / convertir con UsefulVerse». Muy buena para la
   recurrencia y gratuita de mantener si todo es local.
5. **Nombre en los resultados:** el título termina en «| UsefulVerse», `Organization` + `WebSite` en JSON-LD y el
   logo correcto, para que Google muestre la marca.

---

## 5. Palanca 3 · Producto que se comparte y al que se vuelve

1. **Juegos diarios estilo Wordle:** reto del día (misma semilla para todos), racha y una **tarjeta de resultado para compartir**
   (texto o imagen sin datos personales: «Sudoku diario #142 · 6:31»). Es el mecanismo viral más probado de internet y
   genera visitas diarias recurrentes. Aplicar a sudoku, crucigrama, sopa de letras, palabra de 5 letras, nonogramas, etc.
2. **«Siguiente paso» con el archivo:** encadenar herramientas (comprimir → unir → proteger) sin volver a subir nada.
   Más herramientas por visita = más señales de satisfacción.
3. **Enlace con el resultado:** las calculadoras guardan los valores en la URL («?a=15&b=200»), para que la gente comparta
   un cálculo exacto. Esas URLs llevan `canonical` a la página base para no crear duplicados.
4. **Colecciones por tarea** («Kit para estudiantes», «Kit para freelancers», «Kit para profesores»): páginas útiles que se
   comparten y se enlazan desde escuelas y blogs.
5. **Cero fricción:** ni registro, ni marca de agua, ni esperas artificiales, ni ventanas emergentes. Es tu diferenciador
   emocional frente a la competencia («odio las suscripciones»): **dilo en la marca** («Free forever. No limits. No
   sign-up.»).

---

## 6. Palanca 4 · Long-tail y variantes (bien hecho, después de la recuperación)

Mucho tráfico de los grandes viene de **variantes concretas**: «comprimir PDF a 100 KB», «JPG a PDF en iPhone»,
«15 % de 80», «5 pies en cm», «días entre dos fechas». Reglas para hacerlo **sin repetir la caída**:
1. **Solo después de la recuperación** y dentro del freno semanal de URLs.
2. **Solo variantes con demanda demostrada** (consultas reales en Search Console, sugerencias de Google).
3. Cada variante es **la misma herramienta precargada** con su caso, más contenido propio de ese caso (ejemplo resuelto,
   tabla cercana, preguntas de ese caso). Nunca páginas plantilla que solo cambian el número.
4. Empezar con 20-50 variantes en inglés, medir 4 semanas y ampliar solo lo que funcione.
5. Antes de crear la variante, **mejorar la página base** para que ya responda a esas búsquedas (FAQ y ejemplos). A veces no
   hace falta una URL nueva.

---

## 7. Palanca 5 · SEO técnico y de IA (añadidos al plan)

1. **Un solo dominio:** migrar `tools.usefulverse.com` → `usefulverse.com` con 301 una a una (ya en el plan; súbelo de
   prioridad tras la fase 0). Toda la autoridad en un sitio.
2. **Soft 404 del subdominio** (fase 0, urgente).
3. **Hubs de categoría fuertes** con enlazado interno temático: cada herramienta a 3-5 hermanas y a su guía. Es la vía por
   la que la autoridad llega a las 1.000 herramientas.
4. **Otros buscadores:** Bing (alimenta también a ChatGPT y a otros), Yandex (ruso), Naver (coreano), Seznam (checo), Yahoo
   Japan (usa Google). Dar de alta los sitemaps y usar IndexNow **solo para URLs realmente cambiadas**.
5. **IA (GEO):** `llms.txt`, primer párrafo que responde directamente, FAQ claras y estar en las listas de «mejores herramientas
   gratis». Las IA recomiendan lo que el resto de internet menciona: las palancas 1 y 2 son también SEO para IA.
6. **Core Web Vitals reales (no solo de laboratorio):** activar Cloudflare Web Analytics (gratis, sin cookies) y mirar el
   LCP/INP de usuarios reales por país. En mercados con móviles lentos (India, Indonesia, Nigeria…), ser ligero es una
   ventaja decisiva.
7. **Frescura honesta:** revisar cada herramienta al menos una vez al año y que `lastmod` refleje los cambios reales.

---

## 8. Sostenibilidad: «gratis para siempre» sin traicionar al usuario

Con 1 millón de visitas al día, hosting estático en Cloudflare ≈ coste casi 0, **siempre que todo siga siendo local**. Aun así,
el proyecto necesita ingresos para el tiempo, los dominios y el crecimiento. Opciones compatibles con la promesa:
1. **Publicidad ligera y respetuosa** (si se usa): un solo bloque por página, **debajo del resultado**, con su espacio
   reservado (sin saltos de diseño), sin ventanas emergentes, sin vídeo automático y sin rastreo invasivo en la UE (consentimiento).
   Que nunca baje el LCP ni el INP del presupuesto. Desactivada en las herramientas mientras procesan.
2. **Donaciones o «invítame a un café»** discretas.
3. **Patrocinios de categoría** (una marca afín patrocina «PDF», sin tocar la herramienta).
4. Nunca: muros de pago, límites para empujar a pagar, marca de agua ni venta de datos. Es tu promesa de marca.

---

## 9. Medición (lo que no se mide no crece)

1. **Cloudflare Web Analytics** (gratis, sin cookies): visitas, páginas, países y Core Web Vitals reales.
2. **Eventos de producto** (sin datos personales y agregados): «tarea completada» por herramienta, «siguiente paso usado»,
   «volvió en 7 días» (contador local).
3. **Search Console** cada 2 semanas: impresiones, CTR, indexación y enlaces.
4. **Panel único** (`docs/quality/KPIS.md`, actualizado por el agente cada 2 semanas):

| KPI | Por qué importa |
|---|---|
| Visitas/día y por idioma | La meta |
| Tareas completadas/día | Valor real entregado |
| % de visitas que usan 2+ herramientas | Calidad del «siguiente paso» |
| % de usuarios que vuelven (7 y 30 días) | Marca y recurrencia |
| Búsquedas de «usefulverse» (Search Console) | Fuerza de la marca |
| Dominios que enlazan | Autoridad |
| Herramientas activas / terminadas / pendientes | Avance del plan |
| CTR medio por posición | Calidad de títulos y descripciones |

---

## 10. Cambios aplicados al plan por este análisis

1. **Ninguna herramienta se borra.** Si dos herramientas son casi iguales, se **diferencian** (cada una con su caso de uso,
   su contenido y su intención). Solo se fusionan con 301 si Pedro lo aprueba expresamente.
2. **Regla de oro técnica:** todo en el navegador. Las herramientas que necesiten servidor solo se construyen con una ficha de
   costes aprobada (ya estaba) y **nunca como dependencia para el uso ilimitado**.
3. **Nueva fase 7 · Crecimiento** (en paralelo desde que termine la fase 0): widgets incrustables con `nofollow`, listas de
   alternativas, páginas de «alternativa gratuita a X», guías enlazables, comunidades y código abierto opcional.
4. **Recurrencia en la puerta de calidad:** juegos con reto diario y tarjeta para compartir; calculadoras con resultado en la URL;
   PWA instalable a nivel del sitio.
5. **Fusión del subdominio** pasa a ser la prioridad técnica siguiente a la fase 0.
6. **Medición:** Cloudflare Web Analytics y panel de KPIs cada 2 semanas.
7. **Variantes long-tail:** solo tras la recuperación, con demanda demostrada y contenido propio.

---

## 11. Qué no hacer nunca (protege la meta)

- Comprar enlaces, PBN, intercambios masivos o enlaces con palabras clave en widgets.
- Publicar miles de URLs de golpe o variantes plantilla sin contenido propio.
- Prometer «100 % seguro», «el mejor» o «ilimitado» donde no sea verdad.
- Meter publicidad que tape la herramienta, mueva el diseño o ralentice el móvil.
- Añadir servidores de pago a herramientas «ilimitadas».
- Borrar herramientas o cambiar URLs sin 301.

---

### Fuentes

- Estimaciones de tráfico (Semrush): https://sv.semrush.com/website/ilovepdf.com/competitors · https://cw.semrush.com/website/smallpdf.com/overview · https://tr.semrush.com/website/ilovepdf.com/overview
- Google y los enlaces en widgets: https://searchengineland.com/official-googles-latest-official-stance-on-links-within-widgets-181475 · https://seroundtable.com/google-widget-links-33055.html · https://searchenginewatch.com/sew/news/2323764/google-updates-widget-link-scheme-definition
- Políticas de spam de Google: https://developers.google.com/search/docs/essentials/spam-policies
