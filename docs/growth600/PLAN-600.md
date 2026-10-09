# UsefulVerse: plan ejecutable para pasar de 277 a 600 herramientas

Fecha de investigación: 7 de octubre de 2026. Documento de planificación y checklist, no de implementación terminada.

## 1. Mandato y estado inicial

- [x] Leer las instrucciones actuales de la agencia y el ejemplo de plan facilitado por Pedro.
- [x] Revisar el catálogo real del repositorio `pedronunezwebs-hash/usefulverse`.
- [x] Comprobar la base de planificación: **277 herramientas y 36 idiomas**.
- [x] Investigar demanda con un gasto acotado en DataForSEO y registrar los resultados reales.
- [x] Consolidar variantes antes de fijar el nuevo catálogo, sin contar una dirección de conversión como otra herramienta.
- [ ] Implementar las nuevas herramientas. **Progreso al 9 de octubre de 2026: 138/323 herramientas Growth600 publicadas (415 en total con las 277 originales); #230 está en validación local.** Consultar `docs/growth600/PROGRESS.md` para el estado y evidencia de cada entrega; las métricas históricas no implican indexación.

Snapshot consultado: rama `main`, commit `685f91adfc7818a54f6dc0a967e290d13137a3dd`. Catálogo: `src/catalog.mjs`; funciones y contratos representativos: `src/app.js`, módulos de lógica, `src/opportunity-tools.mjs`, `src/seo.mjs`, locales, build y documentación del repo. Se inspeccionaron los metadatos de las 277 herramientas y contratos clave para descartar duplicados; esto **no es una nueva auditoría funcional completa de las 277**.

**Corrección de cantidad:** 600 − 277 = **323 herramientas nuevas**. Añadir 333 produciría 610. Este documento define 323 candidatas principales, con identificadores únicos, y una reserva claramente separada. No convertir sinónimos o lenguajes de programación en contadores artificiales.

Reglas de alcance:

1. Las 277 herramientas actuales quedan protegidas: no reescribir funciones, sustituir URLs, cambiar sus títulos/keywords ni crear otra página que intente quitarles la misma intención.
2. Se permiten archivos nuevos, catálogo adicional, enlaces necesarios desde la portada/directorios y documentación. Si una solución exige cambiar lógica de una herramienta antigua, esa solución queda fuera del alcance: no hacerlo silenciosamente.
3. No ampliar los 36 idiomas. Traducir todas las nuevas interfaces y páginas a los ya disponibles.
4. Procesamiento en navegador/dispositivo; sin servidor de cálculo, suscripciones de conversión, LLM remoto, Functions, R2, base de datos de usuarios o tareas programadas.
5. Gratis para el visitante, sin cuenta obligatoria ni límites de cantidad de usos. Los límites de compatibilidad, memoria y algoritmos deben ser reales y visibles cuando afecten.
6. No usar PageSpeed, Lighthouse ni un escaneo de rendimiento de miles de URLs. Sí probar funciones y aplicar presupuestos técnicos de tamaño/carga.
7. No prometer 100/100 en todas las condiciones, «100% seguro», todo formato imaginable o ausencia absoluta de fallos. Calidad por diseño y pruebas reducen riesgos, no los eliminan.
8. Investigación pagada solo en EE. UU., Canadá, Reino Unido, Australia y Alemania. Son mercados publicitarios estratégicos elegidos como hipótesis, **no un ranking demostrado de CPM**. CPC de anuncios de búsqueda no es CPM de anuncios en nuestra web.

## 2. Lo que sí y lo que no demuestran los números

La meta de un millón de visitas diarias equivale aproximadamente a 30 millones al mes. No depende de alcanzar un número mágico de herramientas. Un millón de clics diarios **solo desde Google** requeriría una demanda y presencia enormes; por ejemplo, con CTR agregado del 10%, 30 millones de clics mensuales exigirían unos 300 millones de impresiones. Es aritmética ilustrativa, no una previsión ni un CTR prometido.

Los volúmenes del catálogo siguiente son estimaciones mensuales de DataForSEO por país/idioma. No son visitas, usuarios únicos, clics de herramientas, CPM ni consultas independientes que se puedan sumar sin solapamiento. Palabras amplias como «breathing exercise» o «memory test» contienen intenciones informativas: su volumen no acredita que todo ese público quiera nuestro widget. Las consultas navegacionales/de marca descartadas tampoco son demanda transferible.

No llamar «todas de altísima demanda» a una lista que también incluye nichos medianos. La investigación encontró candidatas grandes y otras útiles pero menores; se etiquetan por separado. KD es una estimación del proveedor, no la probabilidad de ganar ni el coste de implementación. **KD 0 no significa competencia inexistente.**

Un agregado de volúmenes solo sirve para orientar el repertorio. No multiplicarlo por 36 idiomas; no extrapolar EE. UU. a todo el mundo; no presentar sesiones largas con una pestaña de juego abierta como impresiones publicitarias visibles.

## 3. Orden estratégico de construcción

El número de ficha es una referencia estable, ordenada inicialmente por demanda medida, **no una orden de programar las 323 por volumen bruto**. La fase, facilidad técnica y riesgo deciden la secuencia. Mantener ese número al actualizar el checklist.

### Ola inicial: demanda tangible y motores ligeros

- [ ] Calculadoras de grava, mulch, sustrato, neumáticos, asfalto, escaleras, cercas, papel pintado y materiales de tarima/cubierta.
- [ ] Masa molar, balanceo de ecuaciones, ley de Ohm, resistencias por bandas y relación de engranajes, con ejemplos de referencia.
- [ ] Equipos aleatorios y Secret Santa, con manejo de restricciones imposibles.
- [ ] Refinanciación de vehículo e hipoteca, HELOC, puntos hipotecarios y CPM, con hipótesis manuales y sin asesoría personalizada.
- [ ] Recogida de colores, partición de imágenes y extracción de paleta: probar exportaciones, no solo preview.
- [ ] Un juego de tablero ligero de alta demanda y reglas distintas, por ejemplo Mancala, antes de abrir muchas líneas de desarrollo complejas.

### Después

Completar familias por tandas de 8–15 herramientas, reutilizando helpers locales pero preservando propietarios SEO distintos. Mezclar oportunidades fáciles con una herramienta «cabecera» competitiva por tanda. No dejar todos los juegos grandes, motores matemáticos o editores pesados para una última tanda gigantesca.

1. Hogar/materiales/energía y física/química escolar.
2. Finanzas matemáticas y estadística, con fuentes/supuestos; tablas normativas solo cuando puedan mantenerse versionadas.
3. Documentos, datos y desarrollo: artefactos de salida fiables, roundtrips y seguridad de parsers.
4. Productividad, relojes y astronomía: guardar/exportar y distinguir suspensión del navegador de temporizador fiable.
5. Juegos y utilidades creativas: reglas completas, datasets originales/licenciados, partidas variadas y accesibilidad.
6. Salud, nutrición y funciones con modelos locales: última validación específica de precisión/seguridad antes de publicar, no un atajo para capitalizar volumen.
7. Tanda de demanda media: las candidatas C se construyen después de las A/B, priorizando una utilidad inequívoca y señales de intención; no gastar otra investigación por defecto para rellenar cuotas.

Un índice no sustituye un producto. Cada candidata tiene funciones mínimas, frontera SEO y caso de prueba. Si no puede cumplir el contrato, marcar **bloqueada con motivo**; sustituirla por una candidata de reserva que pase todos los gates antes de contar 600. No fusionar dos herramientas ya contadas al final ni ocultar una baja.

## 4. Gate de alojamiento sin nuevos costes

**Resolverlo ANTES de fabricar 11.628 páginas nuevas.** Cloudflare Pages Free limita cada proyecto a 20.000 archivos publicados. Solo 600 × 36 herramientas serían 21.600 HTML, sin portadas, guías ni assets. El límite de 25 MiB es por archivo publicado, no un límite universal de los archivos que procesa un visitante. [Límites de Pages](https://developers.cloudflare.com/pages/platform/limits/).

Arquitectura aprobada y en implementación; la cuenta ya permite el proyecto aislado, pero aún faltan su dominio, el pipeline y el primer deploy del piloto:

- Conservar el proyecto/root actuales y todas las URLs de las 277 herramientas.
- Usar el **segundo proyecto Pages Free estático** `usefulverse-tools`, reservado el 2026-10-07 con rama de producción `main`. El subdominio candidato sigue siendo `tools.usefulverse.com`, bajo el mismo dominio comprado y el mismo repositorio GitHub.
- Publicar allí las 323 nuevas herramientas: 323 × 36 = **11.628 páginas de herramienta**. Con 36 portadas del nuevo hub serían 11.664 HTML, más directorios/guías/archivos; contar cada salida real antes de subirla y dejar margen.
- Los 10.260 registros de la base actual más esas 11.664 páginas darían **21.924 URLs como mínimo orientativo**, antes de añadir nuevos directorios/guías. No confundir esta proyección con el sitemap publicado hoy.
- No replicar las herramientas existentes en el subdominio, ni replicar las nuevas en el root. Una sola ubicación canónica por herramienta e idioma.
- Enlazar el hub nuevo desde la portada/directorios existentes con un cambio aditivo pequeño; mantener las funciones, URLs y metadatos de las herramientas antiguas intactos. El nuevo catálogo puede enlazar a las 277 URLs originales.
- Reutilizar fuentes de diseño/build donde sea seguro, con salidas y assets independientes. No añadir 323 registros al builder antiguo si eso hace que publique todo dos veces o rompa sus gates.
- Atención al código real: `src/template.mjs` contiene enlaces canonical/hreflang con `https://usefulverse.com` escrito directamente. La nueva plantilla debe recibir `baseOrigin` y construir sus enlaces desde el catálogo/prefijos nuevos; importarla sin adaptar ese contrato produciría canonicals hacia páginas inexistentes del root. Resolverlo en el renderer nuevo, no reescribiendo los metadatos de las 277 protegidas.
- Custom domain/DNS/SSL del subdominio y las verificaciones de propiedad de buscadores se realizan en la futura fase de despliegue; no dar acceso por hecho solo porque existe una propiedad del root.
- Si la cuenta no permite otro proyecto gratuito o algún límite impide esta partición, detener esa operación y documentar una alternativa estática sin coste. **No activar un plan de pago, Worker dinámico, R2 o proxy por petición para salvar la cuota.**

Las peticiones de assets estáticos son gratuitas según las condiciones actuales; eso no elimina límites de archivos, builds, account quotas ni cambios futuros de servicio. Revisar las condiciones vigentes antes de implementar. [Assets estáticos de Cloudflare](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

- [x] Confirmar proyectos, método de deploy y cuotas gratuitas disponibles, sin cambiar billing. Evidencia: dos Pages projects (el nuevo aún vacío) y Wrangler deploy estático; límites oficiales vigentes: 100 proyectos/20.000 archivos por proyecto Free, 500 builds/mes; assets estáticos con requests gratuitas. Ver fuentes y fecha en `docs/growth600/PROGRESS.md`.
- [x] Reservar `usefulverse-tools` en Cloudflare Pages con rama de producción `main`; creación verificada con Wrangler el 2026-10-07. No se ha desplegado contenido.
- [ ] Configurar el pipeline para construir/desplegar la salida separada y asociar `tools.usefulverse.com` al proyecto Pages; hacerlo solo cuando el piloto pase los gates de publicación. El subdominio no está asociado y no hay cambios DNS.
- [ ] Añadir un `maxPublishedFiles` por salida, preferiblemente ≤18.500 para dejar margen; fallar build antes de superar el máximo contratado.
- [ ] Ningún asset publicado >25 MiB; motores grandes deben fragmentarse mediante mecanismos soportados y comprobados, no con rutas ficticias.
- [ ] Ausencia de Functions/Workers de cálculo, servicios pagados y secretos en el HTML/JS publicado.
- [ ] Mantener gasto de GitHub Actions dentro de lo incluido y bloqueo de gasto; verificar cuota actual, no reutilizar el dato histórico de 297 minutos.
- [ ] No ejecutar workflows por cada traducción ni usar Codespaces facturable; agrupar tandas, cancelar duplicados y eliminar entorno temporal solo tras respaldo.

## 5. Contrato técnico de cada nueva herramienta

### Archivos sugeridos

Adaptar los nombres al repo real sin copiar una arquitectura ficticia encima:

```text
src/growth600/
  catalog.mjs                 # solo herramientas nuevas; IDs estables
  tools/<id>/logic.mjs         # funciones puras; sin DOM ni red
  tools/<id>/controller.js     # estados, interacción, worker y cancelación
  tools/<id>/template.mjs      # formulario/resultado HTML estático
  tools/<id>/logic.test.mjs
  tools/<id>/fixtures/         # pequeñas, sintéticas/licenciadas
  locales/<locale>/<id>.mjs    # textos y mensajes de esa herramienta
  seo/<id>.mjs                 # intención, ejemplo, FAQs y fuentes
scripts/build-growth600.mjs    # salida estática aparte
docs/growth600/progress.json   # estados/evidencias, sin secretos
docs/growth600/keywords.csv    # datos medidos de esta investigación
```

No colocar toda la lógica nueva ni todos los diccionarios en `app.js`. Compartir helpers aritméticos, fechas y parsers, pero cargar cada motor por necesidad. No modificar APIs públicas antiguas para hacer caber una nueva herramienta.

### Carga y rendimiento por diseño, sin PageSpeed

- HTML inicial útil y rastreable: H1, instrucciones, controles, ejemplo, límites y enlaces reales están presentes sin esperar al motor pesado.
- Mostrar formulario y CTA desde el principio. Para motores chicos, `type=module` y ejecución diferida. Para motores grandes, cargar al seleccionar archivo/activar la función; indicador visible, retry controlado y cancelar.
- No descargar modelos, WASM, diccionarios, 36 idiomas o un motor de otra herramienta al abrir una página. Prefetch opcional solo si hay intención de usuario y no desperdicia datos; nunca prefetch indiscriminado.
- Usar Worker para cálculos largos, generación de puzzles, hashing costoso y procesado de imágenes; CPU fallback cuando exista y ruta honesta de incompatibilidad cuando no exista. No imponer WebGPU como único camino silencioso.
- Chunking/streaming y liberación de `ArrayBuffer`, `ImageBitmap`, object URLs, workers y timers. Cancelar también cancela trabajo, no solo oculta el spinner.
- Evitar duplicación de librerías. Parser/editor/engine solo bajo demanda; licencias, hashes y versiones fijados. No importar paquetes gigantes para una fórmula sencilla.
- CSS compartido pequeño, sistema tipográfico, sin fuentes obligatorias remotas; espacio reservado para canvas/preview para evitar saltos.
- Assets con hash de contenido y caché larga; HTML revalidable. No cachear una URL mutable de motor con `immutable` y luego sobrescribirla.
- Mantener los gates actuales: `app.js` ≤72 KiB, CSS ≤54 KiB, locales existentes ≤320 KiB. El check ejecutable de `opportunity-runtime.js` usa actualmente 132 KiB; la documentación de presupuestos menciona 128 KiB. No resolver la discrepancia incrementando todo ni tocar el bundle protegido para esta expansión.
- Para el nuevo hub: shell JS propuesto ≤24 KiB minificado, locale/UI de la herramienta ≤24 KiB, módulo de fórmula ordinaria ≤24 KiB; excepciones de editores/motores documentadas y diferidas. Son presupuestos propios, no cifras observadas ni garantía de velocidad.
- Gate automático de dependencias iniciales: prohibir import de familias ajenas y modelos en la ruta de carga inicial. Obtener tamaños del build y grafo de imports, no lanzar un Lighthouse por URL.
- No activar analytics, publicidad, popups o beacons nuevos. Si luego se monetiza, medir el efecto de esa integración por separado, sin adulterar estas pruebas.

No existe una estructura que garantice un 100 fijo de rendimiento en cualquier equipo, red, idioma y momento. Este plan reduce regresiones sin gastar horas midiendo puntuaciones. Tampoco supone que una medición de carga inicial pruebe rapidez del procesamiento de un archivo.

### Producto completo, no checkbox vacío

Cada herramienta debe tener: entrada evidente; ejemplo rellenado o botón de ejemplo; validación explicada junto al campo; ejecutar/pausar/cancelar según aplique; progreso real; resultado interpretable; copiar/descargar con estado confirmado; reset; límite de compatibilidad visible; y una salida que no destruya el original.

Estados: vacío → listo → trabajando → resultado; caminos de error y cancelación desde donde corresponda. No publicar CTA sin handler, features deshabilitadas ocultas, resultados de mentira o una herramienta que devuelve siempre la misma muestra.

En herramientas recurrentes: guardar localmente solo con explicación clara, exportar/importar backup y borrar datos. El navegador puede limpiar almacenamiento y el subdominio tiene otro origen: **no prometer que los datos del root aparecen automáticamente en el hub**. Migración solo mediante export/import explícito, sin cookies compartidas ni un servicio remoto. [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

En juegos: teclado/touch, pausa, reinicio, reglas, undo cuando tenga sentido, score verificable, RNG apropiado y semilla opcional. Puzzles diarios y modo ilimitado no deben ser un pequeño lote reciclado vendido como partidas infinitas. Validar solución y, cuando se prometa, unicidad; reintentos de generación acotados y mensaje honesto si no se produce uno válido. No copiar assets, bancos de preguntas, datasets ni identidad visual de marcas.

Audio/notificaciones: gesto de usuario, botón «Probar sonido», volumen, mute y permiso opcional; no autoplay. No afirmar que una alarma despertará un teléfono suspendido. Alertas calculadas desde timestamps; al volver a la pestaña, recomputar estado y explicar alertas tardías. Sonidos sintetizados locales o assets propios.

### Aviso de recursos

Usarlo donde proceda, no en todas las fórmulas triviales:

> Gratis y sin límites de cantidad de usos. El proceso se realiza en tu dispositivo y puede utilizar memoria y batería. Para archivos grandes o tareas complejas recomendamos una computadora. Los formatos disponibles, el tamaño posible y el tiempo dependen de tu navegador y equipo. Tu original no se modifica.

Adaptar la última frase a la operación. No decir «no se sube nada» si se habilita una voz remota, una fuente externa o un servicio optativo; explicar esa excepción antes de activarla. Ningún usuario debe descubrir un límite duro después de esperar mucho: advertir y validar antes de iniciar.

## 6. SEO de cada nueva URL y anticannibalización

### Propiedad de intención

- [ ] Registrar para cada ficha: ID, canonical inglés, familia, acción primaria, objeto, entradas, salida, intención excluida, vecinos protegidos y consultas medidas.
- [ ] Comparar con el anexo de 277 y con las otras 322 nuevas. Que cambie el nombre o material no basta; debe cambiar el problema, workflow o artefacto de salida.
- [ ] Una página por intención principal, incluyendo dirección inversa, ajustes y variantes cercanas. Ejemplos consolidados: Base64↔archivo; JSON→TypeScript/C#/Java; palabras por anagramas/patrones; nombres de negocio/usuario/ficción.
- [ ] No crear páginas por cada duración, ciudad, formato equivalente, idioma de código, tono de nombre, fórmula inversa o parámetro. Esas son opciones, ejemplos o anchors dentro de la propietaria.
- [ ] No competir desde una nueva landing con «flowchart maker»: la página protegida `diagram-maker` ya usa ese término; fue descartada antes de fijar 323.
- [ ] Revisar hasta tres resultados/competidores pertinentes de las candidatas prioritarias por navegación gratuita al diseñar la función; anotar qué resuelven y qué falla. No copiar texto ni afirmar que esta investigación revisó tres competidores de todas las 323.
- [ ] Si aparece una colisión real antes del desarrollo, no construir ambas para arreglarla después. Sustituir la candidata conflictiva y actualizar conteo/registro, con demanda acreditada y motivo.

La revisión realizada es semántica y por contratos. Hubo seis consultas SERP puntuales, no un estudio exhaustivo de cada combinación. Algunas respuestas mostraron resultados poco representativos o de países/idiomas ajenos pese al targeting solicitado; no usarlas como prueba firme de separación de intención. No existe un certificado «cero canibalización futura»: comprobar señales reales tras indexación.

### Estructura de contenido

1. Title y H1 describen la herramienta/resultado, no una colección de keywords.
2. Formulario y CTA inmediatamente accesibles; breve promesa correcta.
3. Ejemplo práctico con entrada y salida verificadas, unidades y supuestos.
4. Funciones relevantes que resuelven las consultas secundarias; explicar cuándo usarlas.
5. Método/fórmula o formato, limitaciones, privacidad y compatibilidad; fuentes donde se necesiten.
6. 3–5 FAQs útiles y específicas, sin repetir «¿es gratis?» cinco veces ni FAQs falsas para schema.
7. Enlaces a 2–4 herramientas relacionadas por tarea, con un próximo paso no intrusivo. Tras exportar, sugerencia inline descartable, **no popup bloqueante**.
8. Guardar/copy link opcional. No prometer añadir automáticamente a marcadores cuando el navegador no lo admite.

Las consultas secundarias medidas y ángulos longtail de las fichas se trabajan en la función, ejemplo y FAQs de esa misma URL. Las sugerencias derivadas están etiquetadas **sin volumen medido**. Traducir una query no acredita demanda local: adaptar la intención y, con datos futuros de Search Console, corregir términos sin inventar cifras.

### Titles y descriptions

Prioridad: keyword/beneficio principal → «Gratis» → «Sin límites de uso» si cabe y es cierto → marca opcional. «Seguro» no es obligatorio ni reemplaza la descripción; preferir «local» o «privado» cuando sea demostrable. No afirmar seguridad absoluta en title ni en página.

Ejemplos editoriales, no títulos ya publicados:

- `Gravel Calculator – Free, No Usage Limits`
- `Calculadora de grava gratis, sin límites de uso`
- `Spider Solitaire – Free, Unlimited Games`
- `JSON Model Generator – Free & Local`

Para keywords largas, acortar el eslogan, no mutilar la intención. Evaluar anchura visual y claridad: **Google no impone un máximo fijo de caracteres para title** y puede truncarlo o reescribirlo. Referencias editoriales de ~50–60 caracteres para title y ~140–160 para description no son límites oficiales ni garantías. Otros idiomas tienen anchuras distintas. [Title links de Google](https://developers.google.com/search/docs/appearance/title-link).

Description: acción + rasgo específico + gratis/sin cuenta + privacidad o limitación necesaria. No poner los cuatro eslóganes si convierte la descripción en ruido. No afirmar «sin límites de archivo» cuando el motor tiene un máximo real.

Schema solo de entidades y propiedades realmente implementadas y visibles; no inventar estrellas, reviews, ofertas, capacidades de IA ni aprobación de Google. No añadir FAQ schema esperando un rich result automático para una web de herramientas.

### Guides

Crear una guía solo si resuelve una necesidad diferente a ejecutar el widget: método, comparación o workflow. No 323 artículos reescritos con la keyword. Agrupar temas y enlazar bidireccionalmente; revisar demanda/intención gratuitamente antes de añadir páginas. La calidad funcional y contenido útil son la base, no una cantidad arbitraria de texto. [Contenido útil de Google](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## 7. Traducción de las 36 versiones

Importar la lista real de `src/locales.mjs`, no reconstruir prefijos de memoria. En particular, `zh_tw` es una clave interna, pero la URL pública usa **`/zh-tw`**. Preservar `pt-BR` y los códigos regionales existentes.

**Compatibilidad de etiquetas nuevas:** el inventario refleja el código actual `fil-PH` de Filipino. Google documenta códigos de idioma ISO 639-1 para hreflang: en el hub nuevo separar el código de interfaz (`fil-PH`, si corresponde) del hreflang compatible (`tl` o `tl-PH`) y verificar el mapeo. Mantener la ruta `/tl`; no copiar un código automáticamente porque pase el check antiguo ni modificar las 277 páginas protegidas en este alcance. [Versiones localizadas y códigos admitidos](https://developers.google.com/search/docs/specialty/international/localized-versions).

- Inglés como fuente simple; frases cortas y un término estable por concepto.
- Generar borradores mediante recursos gratuitos autorizados o traducción directa por el modelo; no Azure, nuevas suscripciones, descargas de modelos gigantes o APIs pagadas sin nueva autorización.
- Si se usa una interfaz pública de traducción, respetar sus límites/condiciones, caché por cadena y no evadir controles de servicio. Traducir solo contenido público, sin secretos ni datos de usuarios.
- Traducir title, description, H1, instrucciones, labels, placeholder, opciones visibles, acciones, progreso, errores, resultados, unidades descriptivas, FAQs y límites. No entregar una página con título localizado y todos los controles ingleses.
- No traducir IDs, enums, nombres de formatos, código, fórmulas o claves exportadas. No convertir el nombre de un algoritmo en otro ni intercambiar «comprimir», «convertir», «cifrar» y «recortar».
- RTL para árabe, urdu y persa; código/números/fórmulas aislados en LTR cuando corresponda. Comprobar foco, canvas y controles sin invertir la lógica de un tablero o fórmula.
- Datasets de palabras, nombres, rimas y puzzles son distintos del idioma de interfaz. Permitir selección de idioma del dataset/lista propia. No fingir 36 diccionarios de calidad si solo existe uno. La interfaz puede estar traducida mientras explica qué idiomas de datos están disponibles.
- Normas de un país no se convierten en la norma de otro por traducirlas. 401(k), RMD y Social Security se identifican como US; redundancia legal UK se etiqueta UK. El keyword alemán «Rentenrechner» puede implicar pensión pública alemana: no adjudicárselo a un modelo estadounidense sin cumplir esa intención.
- Validación sencilla y eficaz: ninguna cadena vacía, variables conservadas, término principal coherente, botones/errores inteligibles y ausencia de palabras absurdas. No perseguir estilo de escritor nativo ni correcciones interminables.
- Revisar en DOM todos los controles generados y automatizar detección de claves sin traducción. Revisión visual representativa de RTL, CJK y texto expansivo; no repetir toda la lógica matemática 36 veces si comparte motor.

## 8. Pruebas y criterio de terminado

No marcar una ficha terminada solo porque hay HTML o porque pasa un test genérico. Cada herramienta exige evidencias asociadas a su ID:

| Código | Gate obligatorio |
| --- | --- |
| C | Contrato e intención revisados, sin colisión con protegidas/nuevas |
| F | Funciones previstas implementadas y caso de la ficha contrastado |
| E | Vacío, inválido, límites, cancelación y fallos probados |
| X | Copia/descarga/export y reapertura/import cuando aplique |
| L | 36 interfaces/textos SEO y rutas completas; RTL/CJK probados |
| B | Budgets, carga aislada, licencias, privacidad y seguridad pasan |
| P | Commit integrado, deployment confirmado y URL pública validada |
| S | Sitemap canónico actualizado y envíos/estados registrados |

La casilla principal de cada ficha solo se tacha cuando **C/F/E/X/L/B/P/S** están cumplidos o cuando un gate no aplica con explicación. Un requisito externo pendiente no se transforma en verde.

Plan de QA rápido:

- Funciones puras por herramienta: caso representativo, extremos, entrada inválida y al menos una propiedad/invariante relevante.
- Fórmulas: ejemplo de fuente fiable, unidades y tolerancia documentada; no comparar implementación consigo misma como única prueba.
- Archivos: fixture sintética pequeña, salida reabierta por un parser/visor diferente cuando sea posible, contenido/estructura comprobados, original sin cambios.
- Matemática avanzada: biblioteca compatible, gramática declarada, problemas no soportados claramente rechazados; no usar `eval` con expresiones del visitante.
- Juegos: legalidad de todas las acciones, score, victoria/derrota/empate y generación; corpus de semillas y verificación de variedad/solubilidad.
- Persistencia: volver a cargar, export/import, borrar, cuota llena y navegador que rechaza almacenamiento. No afirmar persistencia ilimitada.
- Interfaz: probar las 323 en inglés mediante casos propios, no un clic idéntico para todas. Validar todas las versiones construidas por análisis de HTML/rutas/labels, y muestrear inglés/español/RTL/CJK por familia. Repetir pruebas locales de parseo/fechas cuando el idioma afecte datos.
- Móvil/tablet/escritorio: muestras por familia y todos los componentes nuevos, teclado/foco, consola y targets táctiles. Si una herramienta tiene un UI distinto, también se revisa; no extrapolar una captura a todo.
- Red: observar que el contenido de inputs/archivos/secretos no se envía; solo motores/assets bajo demanda. Probar una operación después de desconectar red cuando el motor ya se descargó.
- HTML de todas las nuevas URLs: canonical, hreflang recíproco/autorreferencia, lang/dir, H1, enlaces, noindex ausente cuando proceda, metadatos, assets y sitemap. Esto es mucho más barato que medir cada URL con PageSpeed.

## 9. Precisión, datos estáticos y límites legales/técnicos

- Finanzas: separar matemática de cotizaciones, aprobación crediticia y asesoría. Tasas, tarifas y precios manuales; si se usa un índice o tabla, citar URL primaria, fecha, país, licencia y rango. No dejar una tabla legal vieja funcionando como si estuviera actualizada.
- Salud: fórmulas reconocidas, población y limitaciones explícitas; no usar para dosificación, diagnóstico o recomendar prácticas extremas. BAC no sirve para decidir si conducir. Peso ideal, ingesta de agua/calorías y recuperación necesitan información responsable y límites de población; las fichas son estimaciones, no recomendaciones personales.
- Ingeniería: educativo, no dimensionamiento certificado de una instalación o estructura. No aplicar una norma eléctrica/inmobiliaria universal a todos los países. Mostrar inputs y unidades y rechazar modelos fuera de rango.
- Licencias: diccionarios, tablas, puzzles, fuentes, librerías y modelos deben permitir redistribución web/comercial si se monetiza. Código abierto no significa cualquier uso sin obligaciones.
- Crypto/keys: `crypto.getRandomValues`, protocolos estándar, exportación deliberada, nada de secretos en URLs/logs/almacenamiento sin elección. Evitar claims de auditoría criptográfica inexistente.
- HTML/XML/Markdown/documentos: sanitización, iframe aislado y prohibir ejecución de scripts/entidades externas; proteger contra ZIP bombs, inputs enormes, regex patológicas y nombres de archivo maliciosos.
- Nunca tocar originales: nueva copia, nombre claro, review antes de exportar. Un formato no soportado produce error útil, no un archivo con extensión bonita y contenido incorrecto.

Estas comprobaciones son gates de la futura implementación, no funciones o fuentes normativas ya validadas en esta investigación.

## 10. Fases de ejecución y seguimiento para Luna

No rehacer la investigación, no gastar DataForSEO automáticamente, no perder el estado al cambiar de conversación.

- [x] **F0 — Arranque:** leer instrucciones actuales; confirmar repo/remoto/rama; cargar este MD y progreso online; crear checkout aislado temporal si hace falta; conservar trabajo ajeno. Evidencia: `docs/growth600/PROGRESS.md`.
- [x] **F1 — Snapshot:** importar manifiesto protegido de 277, comparar con main actual y actualizar el inventario si hubo cambios antes de implementar; no seguir con una base desfasada. Evidencia: `main` en `685f91adfc7818a54f6dc0a967e290d13137a3dd`, 277 IDs/36 locales, misma copia exacta del plan; línea base `npm test` 832/832 y sitemap generado 10.260 URLs. Registro en `docs/growth600/PROGRESS.md`.
- [ ] **F2 — Alojamiento:** pasar gate de dos salidas gratuitas, identificar destino canónico y construir hub piloto sin inventar disponibilidad de cuenta.
- [ ] **F3 — Infraestructura aditiva:** catálogo nuevo, tests, fragmentos locales, builds separados y gates; ningún cambio funcional a las 277.
- [ ] **F4 — Piloto:** implementar 5 nuevas de familias diferentes, cumplir todos los gates y verificar publicación antes de repetir una mala estructura 323 veces.
- [ ] **F5 — Ola inicial:** completar la tanda de oportunidades accesibles indicada arriba, traducir y publicar por lotes verificables.
- [ ] **F6 — Expansión A/B:** terminar las otras candidatas A/B por familias, incluyendo juegos de reglas completas y editores con salidas reales.
- [ ] **F7 — Completar C:** implementar las de demanda media solo con valor propio confirmado; si una falla su contrato, sustitución documentada antes de contarla.
- [ ] **F8 — SEO/localización:** cerrar 36 versiones por nueva herramienta, enlaces, ejemplos/FAQs y metadatos; ningún idioma placeholder.
- [ ] **F9 — QA de cierre:** ejecutar pruebas funcionales completas de nuevas herramientas, análisis estático de todas sus rutas y regresión de la shell protegida. No PageSpeed.
- [ ] **F10 — Integrar/publicar:** revisar diff, commit/push, pipeline y merge autorizados; confirmar deploy real de cada proyecto, robots/sitemap/canonical y muestras públicas.
- [ ] **F11 — Buscadores:** realizar envíos correctos y guardar evidencias; no declarar indexadas todas las URLs porque un envío devuelve 200.
- [ ] **F12 — Documentación/limpieza:** README/catálogo URLs/progreso respaldados online; limpiar solo QA, clones, motores y cachés propios ya recuperables; conservar artefactos pedidos por el usuario.

`progress.json` sugerido por ID: `{ contract, implemented, tests, exports, locales, budgets, commit, deployment, sitemap, blockers, evidence }`. Esquema descriptivo, no un archivo ya existente. Una evidencia debe incluir comando/resultado o URL/fecha; una casilla sin respaldo no es avance.

Tras cada lote actualizar ESTE checklist online y el registro; al reanudar, leerlos y continuar el primer gate incompleto, no inventar tareas ni rehacer las terminadas. No crear automatizaciones periódicas, no enviar mensajes a otros chats sin autorización, no prometer trabajo en una sesión futura como si ya estuviera ejecutándose.

## 11. Sitemaps, publicación y buscadores — futura implementación

- Cada host tendrá su sitemap válido de URLs de ese host; mantener la URL existente del root. Solo URLs 200 indexables y canónicas, no preview, fixtures, parámetros, redirecciones ni candidatas sin producto.
- Para un sitemap index, respetar alcance de host/propiedad y las reglas del buscador; no asumir que un XML del root puede declarar cualquier subdominio sin verificación. Presentar por separado el sitemap del nuevo host cuando corresponda.
- `lastmod` refleja cambios reales de contenido, no la hora de cada build. Hreflang en el HTML de cada grupo; no insertar 36 alternates en todas las entradas del XML solo para inflarlo.
- Google: comprobar propiedad y enviar sitemap; confirmar registro/estado y lectura cuando esté disponible. La propiedad de dominio puede cubrir subdominios, pero acceso/API y permiso se verifican.
- Bing: sitemap del nuevo host y key/host de IndexNow si aplica. No asumir que el archivo de verificación del root o una key ligada a otro host basta; comprobar scope y respuesta real.
- Yandex: propiedad nueva si la cuenta lo necesita, sitemap y herramientas permitidas; no inventar token OAuth ni crear uno sin la autorización/configuración pertinente.
- Naver: registro/verificación del nuevo host y sitemap desde Search Advisor cuando la sesión permita hacerlo. No llamar al panel actualizado por el mero envío de IndexNow.
- Brave y otros rastreadores: HTML/enlaces/robots/sitemap accesibles, sin panel/envío ficticio. Ecosia/Qwant pueden descubrir resultados por sus proveedores/índices; no afirmar un trámite que no existe.
- El usuario inicia sesión si falta una sesión válida. No pedir contraseñas, tokens o códigos en el chat y no eludir CAPTCHAs.
- Registrar por buscador: host, sitemap, acción, respuesta, hora y lo pendiente. Enviar no equivale a rastrear/indexar/posicionar; no garantizar una fecha de lectura.

## 12. Limpieza y cierre sin perder respaldo

En la implementación: conservar originales, investigación, progreso y fuentes en GitHub. Después de verificar push y deploy, eliminar únicamente checkout/deps/modelos/fixtures/cachés de la tarea, con rutas exactas. No borrar credenciales, documentos personales, otros proyectos, historial Git o archivos únicos porque parezcan viejos. Mantener el arranque mínimo de la agencia según sus instrucciones actuales.

Este turno solo produce el plan solicitado y respaldo documental; no cambia producción ni reenvía un sitemap sin nuevas páginas. El MD descargable es un artefacto pedido y se conserva; las copias temporales de investigación se retiran tras comprobar su recuperación online.

## 13. Datos, catálogo nuevo e inventario protegido

Las secciones siguientes contienen el coste exacto, la evidencia de demanda, las 323 fichas y el inventario de 277 herramientas. Todos los estados de implementación empiezan vacíos. Una URL propuesta no es una URL publicada.

**Respaldo para reanudar:** rama documental `docs/seo-expansion-600-plan-2026-10-07` del repo privado `pedronunezwebs-hash/usefulverse`; carpeta `docs/growth600/`, con este plan y siete archivos de evidencia. No se fusionó a `main` ni se desplegó, porque este encargo es solo planificación. Recuperar esa rama antes de volver a pagar la investigación. [Respaldo online del plan](https://github.com/pedronunezwebs-hash/usefulverse/blob/docs/seo-expansion-600-plan-2026-10-07/docs/growth600/PLAN-600.md).

**Lectura eficiente:** leer las reglas/fases completas y el inventario protegido; consultar las fichas y evidencia por lote/ID, sin volcar todas las respuestas API en el contexto de cada conversación. Usar encabezados, búsquedas y rangos para localizar las tareas; una salida truncada no significa que el contenido restante esté leído. Las casillas y el registro online son la fuente del avance, no el recuerdo de conversaciones anteriores.

## 14. Evidencia DataForSEO y gasto cerrado

**Coste real de las respuestas API: 0.24852 USD. Tope previo: 0,30 USD.** No se autorizan llamadas adicionales al implementar por el hecho de reabrir este archivo.

Requests agrupados, caché de respuesta y sin retry de llamadas pagadas; clickstream desactivado. Tarifa observada para Labs: 0,012 USD por petición + 0,00012 USD por resultado; SERP live consultado: 0,002 USD por petición. El coste del campo API no es una conversión a euros ni una promesa sobre impuestos de facturación.

| Consulta | Mercado | Keywords/resultados pedidos | Resultados devueltos | USD reales |
| --- | --- | ---: | ---: | ---: |
| SERP puntual · html to pdf | US/en | 1 | 9 | 0.00200 |
| Overview | US/en | 140 | 129 | 0.02748 |
| SERP puntual · flowchart maker | US/en | 1 | 8 | 0.00200 |
| SERP puntual · anagram solver | US/en | 1 | 9 | 0.00200 |
| Overview | UK/en | 70 | 70 | 0.02040 |
| Ideas | US/en | 200 | 200 | 0.03600 |
| Overview | AU/en | 70 | 70 | 0.02040 |
| SERP puntual · text to pdf | US/en | 1 | 9 | 0.00200 |
| Overview | DE/de | 60 | 58 | 0.01896 |
| SERP puntual · diagram maker | US/en | 1 | 8 | 0.00200 |
| SERP puntual · word finder | US/en | 1 | 9 | 0.00200 |
| Overview | US/en | 700 | 674 | 0.09288 |
| Overview | CA/en | 70 | 70 | 0.02040 |

840 términos iniciales consultados en US/en, 70 términos seleccionados en cada uno de CA/UK/AU, 60 términos en alemán y 200 ideas obtenidas en US/en. Se deduplicaron consultas y variantes al elegir herramientas; una métrica inexistente no se trata como cero demanda global. La expansión de ideas devolvió numerosas herramientas ya existentes: se descartaron, no se reutilizaron para inflar el objetivo.

Fuentes de método: [Keyword Overview](https://docs.dataforseo.com/v3/dataforseo_labs-google-keyword_overview-live/), [Labs pricing](https://dataforseo.com/pricing/dataforseo-labs/dataforseo-google-api), [SERP live](https://docs.dataforseo.com/v3/serp/google/organic/live/advanced/). Datos consultados para esta investigación, no volúmenes sacados de memoria.

| Nivel | Criterio de volumen de una query US/en por candidata | Herramientas | Acción |
| --- | --- | ---: | --- |
| A | ≥10.000/mes | 104 | Gran mercado; revisar intención/competencia y esfuerzo. |
| B | 1.000–9.999/mes | 156 | Buena demanda de nicho; construir antes de C. |
| C | 100–999/mes; seleccionadas 260–880 | 63 | Demanda media; no anunciar como masiva ni priorizar por cantidad. |

**260 de las 323 tienen ≥1.000/mes en la query elegida de US/en; 104 tienen ≥10.000/mes.** Las otras 63 no se ocultan como si fueran igual de demandadas. La suma matemática de una query US por herramienta es 17.343.120 búsquedas mensuales; NO es demanda única ni tráfico capturable. No sumamos sinónimos, países muestreados y 36 traducciones para producir una previsión inflada.

Cada ficha muestra la query exacta de la métrica. En algunos casos la query principal de demanda no coincide con el nombre del widget porque se consolidó una suite. Las variantes medibles se trabajan en la misma URL. Consulta fuente/actualización se conserva en la evidencia online; los datos no son eternos.

### Ejemplos del muestreo internacional

| Herramienta | Query / US volumen, KD | CA | UK | AU | DE |
| --- | --- | ---: | ---: | ---: | ---: |
| Snake Game | `snake game` · 7.480.000, KD 53 | 450.000 · `snake game` | 368.000 · `snake game` | 368.000 · `snake game` | 18.100 · `snake spiel` |
| Spider Solitaire | `spider solitaire` · 1.000.000, KD 57 | 201.000 · `spider solitaire` | 246.000 · `spider solitaire` | 110.000 · `spider solitaire` | 165.000 · `spider solitär` |
| Freecell | `freecell` · 673.000, KD 57 | 135.000 · `freecell` | 110.000 · `freecell` | 60.500 · `freecell` | 14.800 · `freecell kostenlos` |
| Word Puzzle Solver: Anagrams & Patterns | `word finder` · 673.000, KD 68 | 90.500 · `word finder` | 1.000.000 · `anagram solver` | 165.000 · `anagram solver` | 1.900 · `anagramm löser` |
| Spades Game | `spades game` · 550.000, KD 53 | 33.100 · `spades game` | 27.100 · `spades game` | 14.800 · `spades game` | — |
| Inflation Calculator | `inflation calculator` · 550.000, KD 70 | 33.100 · `inflation calculator` | 60.500 · `inflation calculator` | 14.800 · `inflation calculator` | 14.800 · `inflationsrechner` |
| Retirement Calculator | `retirement calculator` · 368.000, KD 54 | 12.100 · `retirement calculator` | 8.100 · `retirement calculator` | 6.600 · `retirement calculator` | 60.500 · `rentenrechner` |
| Text To Speech | `text to speech` · 301.000, KD 94 | 33.100 · `text to speech` | 49.500 · `text to speech` | 22.200 · `text to speech` | 2.900 · `text vorlesen` |
| World Clock | `world clock` · 301.000, KD 100 | 22.200 · `world clock` | 60.500 · `world clock` | 27.100 · `world clock` | 60.500 · `weltuhr` |
| Euchre | `euchre` · 201.000, KD 30 | 49.500 · `euchre` | 6.600 · `euchre` | 14.800 · `euchre` | — |
| Original Name Generator | `fantasy name generator` · 165.000, KD 15 | 14.800 · `fantasy name generator` | 14.800 · `fantasy name generator` | 9.900 · `fantasy name generator` | — |
| Cribbage | `cribbage` · 165.000, KD 33 | 60.500 · `cribbage` | 27.100 · `cribbage` | 8.100 · `cribbage` | — |
| Gin Rummy | `gin rummy` · 165.000, KD 43 | 14.800 · `gin rummy` | 12.100 · `gin rummy` | 8.100 · `gin rummy` | — |
| Random Word Generator | `random word generator` · 135.000, KD 21 | 14.800 · `random word generator` | 33.100 · `random word generator` | 14.800 · `random word generator` | — |
| Breathing Exercise | `breathing exercise` · 135.000, KD 33 | 3.600 · `breathing exercise` | 49.500 · `breathing exercise` | 2.900 · `breathing exercise` | — |
| Hearts Game | `hearts card game online` · 135.000, KD 42 | 33.100 · `hearts card game online` | 12.100 · `hearts card game online` | 5.400 · `hearts card game online` | — |
| Sleep Calculator | `sleep calculator` · 135.000, KD 49 | 18.100 · `sleep calculator` | 18.100 · `sleep calculator` | 12.100 · `sleep calculator` | 5.400 · `schlafrechner` |
| Typing Practice | `typing practice` · 135.000, KD 51 | 27.100 · `typing practice` | 9.900 · `typing practice` | 8.100 · `typing practice` | — |
| Logo Maker | `logo maker` · 135.000, KD 94 | 18.100 · `logo maker` | 40.500 · `logo maker` | 18.100 · `logo maker` | — |
| Protein Calculator | `protein calculator` · 110.000, KD 34 | 14.800 · `protein calculator` | 8.100 · `protein calculator` | 9.900 · `protein calculator` | 1.000 · `proteinbedarf rechner` |
| Molar Mass Calculator | `molecular weight calculator` · 90.500, KD 18 | 390 · `molecular weight calculator` | 3.600 · `molecular weight calculator` | 390 · `molecular weight calculator` | 1.600 · `molare masse berechnen` |
| Mortgage Affordability Calculator | `how much house can i afford` · 90.500, KD 47 | 2.400 · `how much house can i afford` | 1.600 · `how much house can i afford` | 140 · `how much house can i afford` | 3.600 · `wie viel haus kann ich mir leisten` |
| Mancala | `mancala` · 74.000, KD 17 | 5.400 · `mancala` | 4.400 · `mancala` | 2.900 · `mancala` | — |
| Auto Loan Refinance Calculator | `auto loan refinance calculator` · 60.500, KD 0 | 390 · `auto loan refinance calculator` | 480 · `auto loan refinance calculator` | 590 · `auto loan refinance calculator` | — |
| Gravel Calculator | `gravel calculator` · 60.500, KD 9 | 6.600 · `gravel calculator` | 2.900 · `gravel calculator` | 880 · `gravel calculator` | 170 · `kies rechner` |
| Mortgage Refinance Calculator | `mortgage refinance calculator` · 60.500, KD 20 | 1.900 · `mortgage refinance calculator` | 110 · `mortgage refinance calculator` | 2.400 · `mortgage refinance calculator` | 110 · `umschuldungsrechner` |
| Mulch Calculator | `mulch calculator` · 60.500, KD 24 | 2.400 · `mulch calculator` | 140 · `mulch calculator` | 1.600 · `mulch calculator` | — |
| Image Color Picker | `image color picker` · 60.500, KD 26 | 4.400 · `image color picker` | 880 · `image color picker` | 1.900 · `image color picker` | — |
| Dominoes Game | `dominoes game` · 60.500, KD 48 | 4.400 · `dominoes game` | 9.900 · `dominoes game` | 2.900 · `dominoes game` | — |
| Weight Loss Calculator | `weight loss calculator` · 60.500, KD 52 | 6.600 · `weight loss calculator` | 12.100 · `weight loss calculator` | 4.400 · `weight loss calculator` | — |
| Image Upscaler | `image upscaler` · 60.500, KD 56 | 12.100 · `image upscaler` | 14.800 · `image upscaler` | 8.100 · `image upscaler` | 3.600 · `bild hochskalieren` |
| Heloc Calculator | `heloc calculator` · 49.500, KD 2 | 1.900 · `heloc calculator` | 140 · `heloc calculator` | 40 · `heloc calculator` | — |
| Secret Santa Generator | `secret santa generator` · 49.500, KD 13 | 5.400 · `secret santa generator` | 22.200 · `secret santa generator` | 8.100 · `secret santa generator` | 480 · `wichteln generator` |
| Epub To Pdf | `epub to pdf` · 49.500, KD 20 | 12.100 · `epub to pdf` | 8.100 · `epub to pdf` | 4.400 · `epub to pdf` | — |

«—» = no se consultó o no se obtuvo esa métrica; no significa cero. Los volúmenes de otros países pueden referirse a una variante distinta explícita. Es una muestra de oportunidades, no una comparación estadística de CPM entre países.

### Recuento por familia

| Familia | Nuevas |
| --- | ---: |
| Hogar, construcción y energía | 39 |
| Física, química y electrónica | 43 |
| Finanzas matemáticas | 37 |
| Matemática y estadística | 41 |
| Datos y desarrollo | 21 |
| Documentos y formatos | 20 |
| Relojes, calendarios y astronomía | 14 |
| Organización y productividad | 25 |
| Imagen, lenguaje y creación | 27 |
| Juegos y práctica | 37 |
| Estimaciones de salud y actividad | 19 |

## Checklist · Hogar, construcción y energía

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Geometría/unidades en lógica pura, modelo de compra/cortes cuando corresponda; medidas, densidades, precios y normas manuales o tablas citadas. Dibujo SVG liviano.

**Pruebas adicionales para cada ficha:** Conservar cantidades/área, redondeo de piezas y desperdicio visibles; cero, unidades inversas y casos físicamente imposibles.

### 016 · Tire Size Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `tire-size-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/tire-size-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `tire size calculator` — 165.000 búsquedas/mes US/en, KD 44; nivel A. CPC 5.11 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Comparar neumáticos por ancho, perfil y llanta; diámetro, perímetro, giro, desviación de velocímetro y dibujo. No certificar compatibilidad mecánica.
- **Prueba de aceptación específica:** 205/55R16 da diámetro nominal 631.9 mm; el mismo tamaño da diferencia cero.
- **Frontera con otras herramientas:** unit-converter: geometría y comparación de neumáticos, no conversión de unidades aislada. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Motor y experiencia en inglés implementados; la lógica, el bundle local y el build están probados. Otras 35 traducciones permanecen pendientes. El caso específico se amplió a prueba de reemplazo, cifrado autenticado, límites distintos de backup cifrado y normal, y ausencia de red.
- **Consultas secundarias del mismo propietario:**
  - `tire diameter calculator` — sin métrica obtenida; no atribuir volumen.
  - `tire size calculator free online`; `tire size calculator with example`; `tire size calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Cierre (2026-10-09):** PR #81 integrada; pipeline principal y publicación del hub correctos. Muestras EN/ES/AR HTTP 200 y sitemap sin duplicados. Traducción automática básica, no revisión nativa; no se afirma indexación.
- **Avance comprobado (2026-10-08):** herramienta local en inglés implementada con modos directo/inverso para sumas acotadas de polinomios, exponentiales y seno/coseno; la inversa acepta términos parciales estándar ya separados. Muestra ROC, límites de sintaxis y resultado accesible; no usa CAS ni API externa. Suite focalizada (lógica, controlador, formulario, catálogo, contrato de 36 locales, render y build): **159/159 aprobadas**. Bundle minificado y validado por el guard local: **6.719 bytes**. Los otros 35 idiomas siguen pendientes, el release gate los bloquea; faltan QA visual y despliegue. Recuento: **80/323** candidatas con implementación inglesa; quedan 243 filas del plan, incluida una duplicada que debe sustituirse.
- **Estado de implementación (2026-10-08):** motor local para las tres incógnitas, conversiones de unidades y estimación explícita de mezcla; formulario/controlador, copy inglés, límites y pruebas añadidos como candidata #58/323. Suite focal sin bundling: 174/174 aprobadas. Los 35 locales no ingleses siguen pendientes y bloqueados para publicación; build bundle y QA visual pendientes porque `esbuild` no está disponible en este clon. No desplegada.

### 031 · Gravel Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `gravel-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/gravel-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `gravel calculator` — 60.500 búsquedas/mes US/en, KD 9; nivel A. CPC 2.71 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Volumen, densidad y peso para capas y figuras de patio
- **Prueba de aceptación específica:** 10m² por0.1m da1m³
- **Frontera con otras herramientas:** concrete-calculator: áridos y densidad granular. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `gravel volume calculator` — 260/mes US/en; KD 0.
  - `gravel calculator free online`; `gravel calculator with example`; `gravel calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `gravel calculator` 6.600/mes, KD 18; UK/en `gravel calculator` 2.900/mes, KD 0; AU/en `gravel calculator` 880/mes, KD 2; DE/de `kies rechner` 170/mes, KD 0.

### 033 · Mulch Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `mulch-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mulch-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `mulch calculator` — 60.500 búsquedas/mes US/en, KD 24; nivel A. CPC 2.66 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Camas, profundidad, volumen de bolsa, coste y desperdicio
- **Prueba de aceptación específica:** 20m² a0.05m da1m³
- **Frontera con otras herramientas:** gravel-calculator: compra mulch por bolsas y jardines. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `mulch bags calculator` — 720/mes US/en; KD 33.
  - `mulch calculator free online`; `mulch calculator with example`; `mulch calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `mulch calculator` 2.400/mes, KD 31; UK/en `mulch calculator` 140/mes, KD 0; AU/en `mulch calculator` 1.600/mes, KD 1.

### 052 · Stair Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `stair-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/stair-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `stair calculator` — 33.100 búsquedas/mes US/en, KD 10; nivel A. CPC 0.38 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Altura total, peldaños, huella y dibujo; normas locales no certificadas
- **Prueba de aceptación específica:** Suma contrahuellas da altura total
- **Frontera con otras herramientas:** room-planner: escalera dimensionada no mobiliario. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `stair rise run calculator` — 1.600/mes US/en; KD 7.
  - `stair calculator free online`; `stair calculator with example`; `stair calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `stair calculator` 8.100/mes, KD 12; UK/en `stair calculator` 1.300/mes, KD 15; AU/en `stair calculator` 2.400/mes, KD 8; DE/de `treppenrechner` 1.000/mes, KD 0.

### 057 · Asphalt Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `asphalt-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/asphalt-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `asphalt calculator` — 27.100 búsquedas/mes US/en, KD 0; nivel A. CPC 3.29 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Área, espesor compacto, densidad, toneladas y presupuesto
- **Prueba de aceptación específica:** 100m² por0.05m por2400 da12000kg
- **Frontera con otras herramientas:** concrete-calculator: pavimento asfáltico y masa de compra. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `asphalt tonnage calculator` — 2.400/mes US/en; KD 0.
  - `asphalt calculator free online`; `asphalt calculator with example`; `asphalt calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `asphalt calculator` 1.600/mes, KD 0; UK/en `asphalt calculator` 720/mes, KD 0; AU/en `asphalt calculator` 390/mes, KD 0.

### 060 · Soil Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `soil-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/soil-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `soil calculator` — 27.100 búsquedas/mes US/en, KD 24; nivel A. CPC 1.22 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Bancales, macetas, capas y volumen de sustrato
- **Prueba de aceptación específica:** Cubo1m da1m³
- **Frontera con otras herramientas:** mulch-calculator: relleno de contenedores, no cobertura. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `soil volume calculator` — 1.300/mes US/en; KD 28.
  - `soil calculator free online`; `soil calculator with example`; `soil calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `soil calculator` 2.900/mes, KD 13; UK/en `soil calculator` 1.300/mes, KD 5; AU/en `soil calculator` 1.900/mes, KD 2; DE/de `erde rechner` 50/mes, KD 0.

### 067 · Pool Volume Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `pool-volume-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pool-volume-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pool volume calculator` — 22.200 búsquedas/mes US/en, KD 7; nivel A. CPC 0.24 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Piscinas por forma, pendiente de fondo y galones/litros
- **Prueba de aceptación específica:** 2x3x1m da6000L
- **Frontera con otras herramientas:** volume-calculator: vaso con profundidad variable. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `swimming pool gallons calculator` — 5.400/mes US/en; KD 5.
  - `pool volume calculator free online`; `pool volume calculator with example`; `pool volume calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `pool volume calculator` 4.400/mes, KD 6; UK/en `pool volume calculator` 320/mes, KD 0; AU/en `pool volume calculator` 2.400/mes, KD 0.

### 071 · Roof Pitch Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `roof-pitch-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/roof-pitch-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `roof pitch calculator` — 22.200 búsquedas/mes US/en, KD 23; nivel A. CPC 2.16 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Pendiente, rise/run, ángulo y longitud de faldón
- **Prueba de aceptación específica:** Rise=run da45 grados
- **Frontera con otras herramientas:** triangle-calculator: aplicaciones cubierta con pitch y escala. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `roof slope calculator` — 22.200/mes US/en; KD 25.
  - `roof pitch calculator free online`; `roof pitch calculator with example`; `roof pitch calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `roof pitch calculator` 2.900/mes, KD 9; UK/en `roof pitch calculator` 1.900/mes, KD 3; AU/en `roof pitch calculator` 2.900/mes, KD 0; DE/de `dachneigung berechnen` 2.400/mes, KD 0.

### 077 · Drywall Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `drywall-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/drywall-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `drywall calculator` — 18.100 búsquedas/mes US/en, KD 15; nivel A. CPC 0.85 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Paredes/techo, placas, juntas, tornillos y presupuesto
- **Prueba de aceptación específica:** Área cubierta por placas no inferior a área requerida
- **Frontera con otras herramientas:** tile-calculator: placas de pared, techo y fijaciones. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `plasterboard calculator` — 390/mes US/en; KD 0.
  - `drywall calculator free online`; `drywall calculator with example`; `drywall calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 078 · Roofing Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `roofing-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/roofing-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `roofing calculator` — 18.100 búsquedas/mes US/en, KD 21; nivel A. CPC 13.94 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Superficie real, squares, bundles, desperdicio y coste
- **Prueba de aceptación específica:** Inclinación aumenta área frente a proyección
- **Frontera con otras herramientas:** roof-pitch-calculator: compra de materiales no ángulo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `roof shingles calculator` — 5.400/mes US/en; KD 6.
  - `roofing calculator free online`; `roofing calculator with example`; `roofing calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 083 · Deck Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `deck-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/deck-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `deck calculator` — 14.800 búsquedas/mes US/en, KD 0; nivel A. CPC 4.01 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Tarima, separaciones, cortes, fijaciones y coste desde medidas
- **Prueba de aceptación específica:** Longitud tablón insuficiente exige unión o rechazo
- **Frontera con otras herramientas:** board-foot-calculator: despiece y piezas no volumen madera. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `deck board calculator` — 14.800/mes US/en; KD 12.
  - `deck calculator free online`; `deck calculator with example`; `deck calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 093 · Fence Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `fence-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/fence-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `fence calculator` — 12.100 búsquedas/mes US/en, KD 0; nivel A. CPC 5.41 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Tramos, postes, puertas, paneles y espacio entre lamas
- **Prueba de aceptación específica:** Un tramo aislado requiere postes extremos
- **Frontera con otras herramientas:** room-planner: lista de materiales no distribución habitación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `fence materials calculator` — 1.000/mes US/en; KD 10.
  - `fence calculator free online`; `fence calculator with example`; `fence calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `zaun rechner` 30/mes, KD 44.

### 094 · Pool Salt Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `pool-salt-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pool-salt-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pool salt calculator` — 12.100 búsquedas/mes US/en, KD 1; nivel A. CPC 5.67 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Volumen, salinidad actual/objetivo y masa de sal
- **Prueba de aceptación específica:** 1000L subir1000ppm requiere1kg ideal
- **Frontera con otras herramientas:** pool-volume-calculator: ajuste salino; no tratamiento químico genérico. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pool salinity calculator` — 12.100/mes US/en; KD 1.
  - `pool salt calculator free online`; `pool salt calculator with example`; `pool salt calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 097 · Wallpaper Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `wallpaper-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/wallpaper-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `wallpaper calculator` — 12.100 búsquedas/mes US/en, KD 9; nivel A. CPC 2.84 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Repetición patrón, altura, perímetro, rollos y aperturas
- **Prueba de aceptación específica:** Mayor repeat puede aumentar rollos necesarios
- **Frontera con otras herramientas:** paint-calculator: rollos y patrón no pintura. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `wallpaper roll calculator` — 210/mes US/en; KD 9.
  - `wallpaper calculator free online`; `wallpaper calculator with example`; `wallpaper calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `tapetenrechner` 880/mes, KD 1.

### 099 · Paver Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `paver-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/paver-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `paver calculator` — 12.100 búsquedas/mes US/en, KD 12; nivel A. CPC 0.87 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Patrón modular, bordes, piezas y capas de base
- **Prueba de aceptación específica:** Suma módulos cubre superficie respetando patrón
- **Frontera con otras herramientas:** tile-calculator: cercanía; solo patrón modular y capas nuevas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `paver pattern calculator` — 30/mes US/en; KD 2.
  - `paver calculator free online`; `paver calculator with example`; `paver calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 104 · Solar Panel Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `solar-panel-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/solar-panel-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `solar panel calculator` — 12.100 búsquedas/mes US/en, KD 41; nivel A. CPC 8.49 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Paneles, horas solares manuales, pérdidas, área y retorno con tarifa manual
- **Prueba de aceptación específica:** 1kW por5h da5k Wh antes de pérdidas
- **Frontera con otras herramientas:** fuel-cost-calculator: generación solar no combustible. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `solar energy calculator` — 8.100/mes US/en; KD 52.
  - `solar panel calculator free online`; `solar panel calculator with example`; `solar panel calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `solarrechner` 2.900/mes, KD 45.

### 107 · Btu Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `btu-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/btu-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `btu calculator` — 9.900 búsquedas/mes US/en, KD 9; nivel B. CPC 2.4 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Estimación térmica con volumen, aislamiento y parámetros manuales
- **Prueba de aceptación específica:** Carga cero no produce capacidad negativa
- **Frontera con otras herramientas:** insulation-calculator: equipo térmico estimado no R. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `air conditioner size calculator` — 1.900/mes US/en; KD 12.
  - `btu calculator free online`; `btu calculator with example`; `btu calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 116 · Brick Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `brick-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/brick-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `brick calculator` — 8.100 búsquedas/mes US/en, KD 10; nivel B. CPC 6.81 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Hiladas, ladrillos, juntas, aperturas y mortero orientativo
- **Prueba de aceptación específica:** Puerta reduce cantidad frente a pared cerrada
- **Frontera con otras herramientas:** tile-calculator: mampostería con hiladas y mortero. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `brick wall calculator` — 720/mes US/en; KD 10.
  - `brick calculator free online`; `brick calculator with example`; `brick calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 126 · Rafter Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `rafter-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rafter-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rafter calculator` — 6.600 búsquedas/mes US/en, KD 0; nivel B. CPC 4.87 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Luz, overhang, ridge thickness y cortes con esquema
- **Prueba de aceptación específica:** Sin alero se reduce longitud
- **Frontera con otras herramientas:** roof-pitch-calculator: dimensiones de corte, cercanía controlar SERP. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rafter length calculator` — 5.400/mes US/en; KD 0.
  - `rafter calculator free online`; `rafter calculator with example`; `rafter calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 134 · Carpet Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `carpet-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/carpet-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `carpet calculator` — 5.400 búsquedas/mes US/en, KD 1; nivel B. CPC 3.82 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cortes por anchura de rollo, continuidad y dirección de pelo
- **Prueba de aceptación específica:** Ancho menor que habitación obliga más de un corte
- **Frontera con otras herramientas:** square-footage-calculator: plan de corte de rollos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `carpet roll calculator` — 70/mes US/en; KD 0.
  - `carpet calculator free online`; `carpet calculator with example`; `carpet calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 135 · Aquarium Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `aquarium-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/aquarium-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `fish tank volume calculator` — 5.400 búsquedas/mes US/en, KD 1; nivel B. CPC 0.09 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Volumen interno, sustrato y espacio de aire, masa aproximada
- **Prueba de aceptación específica:** 1L agua aproxima1kg sin recipiente
- **Frontera con otras herramientas:** volume-calculator: volumen utilizable y carga no sólidos genéricos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `aquarium calculator` — 4.400/mes US/en; KD 16.
  - `fish tank volume calculator free online`; `fish tank volume calculator with example`; `fish tank volume calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 137 · Grass Seed Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `grass-seed-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/grass-seed-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `grass seed calculator` — 5.400 búsquedas/mes US/en, KD 4; nivel B. CPC 2.19 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Área, tasa de siembra elegida, mezcla y bolsas
- **Prueba de aceptación específica:** 100m² a30g/m² da3kg
- **Frontera con otras herramientas:** mulch-calculator: semilla por dosis superficial. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `lawn seed calculator` — 320/mes US/en; KD 4.
  - `grass seed calculator free online`; `grass seed calculator with example`; `grass seed calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 140 · Insulation Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `insulation-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/insulation-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `insulation calculator` — 5.400 búsquedas/mes US/en, KD 13; nivel B. CPC 3.04 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resistencias térmicas por capa, unidades y cantidad
- **Prueba de aceptación específica:** R2 másR3 daR5 en serie
- **Frontera con otras herramientas:** drywall-calculator: propiedades térmicas no placas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `insulation r value calculator` — 320/mes US/en; KD 2.
  - `insulation calculator free online`; `insulation calculator with example`; `insulation calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 153 · Wall Framing Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `wall-framing-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/wall-framing-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `stud calculator` — 4.400 búsquedas/mes US/en, KD 0; nivel B. CPC 3.84 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Paredes, studs, aperturas, espaciamiento y placas
- **Prueba de aceptación específica:** Extremos de pared siempre soportados en conteo
- **Frontera con otras herramientas:** drywall-calculator: entramado no revestimiento. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `wall framing calculator` — 590/mes US/en; KD 0.
  - `stud calculator free online`; `stud calculator with example`; `stud calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 154 · Electricity Cost Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `electricity-cost-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/electricity-cost-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `electricity cost calculator` — 4.400 búsquedas/mes US/en, KD 7; nivel B. CPC 9.26 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Potencia, horas, tarifa y calendario de consumo por aparato
- **Prueba de aceptación específica:** 1000W durante1h a0.2 da0.2
- **Frontera con otras herramientas:** household-budget-planner: consumo eléctrico técnico. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `appliance energy cost calculator` — 90/mes US/en; KD 42.
  - `electricity cost calculator free online`; `electricity cost calculator with example`; `electricity cost calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `stromkostenrechner` 6.600/mes, KD 2.

### 155 · Compost Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `compost-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/compost-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `compost calculator` — 4.400 búsquedas/mes US/en, KD 9; nivel B. CPC 1.18 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Mezcla con ratios y cantidades introducidas, humedad estimada
- **Prueba de aceptación específica:** Entradas cero rechazan cálculo de mezcla
- **Frontera con otras herramientas:** soil-calculator: composición y relación C:N. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `compost carbon nitrogen calculator` — sin métrica obtenida; no atribuir volumen.
  - `compost calculator free online`; `compost calculator with example`; `compost calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 177 · Pond Volume Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `pond-volume-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pond-volume-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pond volume calculator` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC 0.66 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Lámina, bordes, profundidad y volumen geométrico estimado
- **Prueba de aceptación específica:** Mayor profundidad exige lámina mayor
- **Frontera con otras herramientas:** pool-volume-calculator: estanque y corte de lámina. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pond liner calculator` — 1.000/mes US/en; KD 0.
  - `pond volume calculator free online`; `pond volume calculator with example`; `pond volume calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 183 · Fertilizer Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `fertilizer-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/fertilizer-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `fertilizer calculator` — 2.900 búsquedas/mes US/en, KD 5; nivel B. CPC 1.58 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Área, dosis nutricional declarada y porcentaje NPK; no recomendaciones agronómicas
- **Prueba de aceptación específica:** 10kg al20% N aporta2kg N
- **Frontera con otras herramientas:** grass-seed-calculator: nutrientes no semillas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `npk calculator` — 140/mes US/en; KD 1.
  - `fertilizer calculator free online`; `fertilizer calculator with example`; `fertilizer calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 192 · Baluster Spacing Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `baluster-spacing-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/baluster-spacing-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `baluster spacing calculator` — 2.400 búsquedas/mes US/en, KD 0; nivel B. CPC 5.87 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Hueco libre, grosor y número, esquema y límites introducidos
- **Prueba de aceptación específica:** Huecos uniformes suman anchura total
- **Frontera con otras herramientas:** fence-calculator: distribución de balaustres dentro de vano. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `spindle spacing calculator` — 480/mes US/en; KD 0.
  - `baluster spacing calculator free online`; `baluster spacing calculator with example`; `baluster spacing calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 210 · Retaining Wall Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `retaining-wall-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/retaining-wall-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `retaining wall calculator` — 1.900 búsquedas/mes US/en, KD 0; nivel B. CPC 5.35 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Bloques, hiladas, base y relleno; sin diseño estructural
- **Prueba de aceptación específica:** Altura cero devuelve cero materiales
- **Frontera con otras herramientas:** brick-calculator: muro de contención y capas, no estabilidad. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `retaining wall blocks calculator` — 170/mes US/en; KD 0.
  - `retaining wall calculator free online`; `retaining wall calculator with example`; `retaining wall calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 211 · Battery Runtime Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `battery-runtime-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/battery-runtime-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `battery runtime calculator` — 1.900 búsquedas/mes US/en, KD 0; nivel B. CPC 3.86 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Ah/Wh, voltaje, potencia, eficiencia y profundidad de descarga
- **Prueba de aceptación específica:** 100Wh con10W ideal da10h
- **Frontera con otras herramientas:** ev-range-calculator: alimentación de aparatos no distancia. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `battery life calculator` — 1.900/mes US/en; KD 8.
  - `battery runtime calculator free online`; `battery runtime calculator with example`; `battery runtime calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `batterie laufzeit rechner` 10/mes, KD —.

### 219 · Lumber Cut Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `lumber-cut-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/lumber-cut-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `cut list optimizer` — 1.900 búsquedas/mes US/en, KD 13; nivel B. CPC 3.2 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Optimizar cortes lineales con kerf y sobrantes; cotas de cómputo
- **Prueba de aceptación específica:** Cortes no exceden tablón ni olvidan kerf; la prueba local actual deja 1 mm al encajar 1.200 + 800 + 390 mm con kerf de 3 mm en tablón de 2.400 mm.
- **Frontera con otras herramientas:** board-foot-calculator: optimización de cortes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Motor local de asignación 1D best-fit-decreasing, con límite de 300 piezas/tablas y kerf por pieza. Es una heurística, no garantiza óptimo global; verificar unidades/formato y validar el despiece en el material real. Seguir los gates globales; el caso de aceptación no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `lumber cut calculator` — 70/mes US/en; KD 15.
  - `cut list optimizer free online`; `cut list optimizer with example`; `cut list optimizer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 237 · Plant Spacing Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `plant-spacing-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/plant-spacing-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `plant spacing calculator` — 1.600 búsquedas/mes US/en, KD 11; nivel B. CPC 0.78 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Separación filas/plantas, rejilla triangular y conteo
- **Prueba de aceptación específica:** Más separación reduce número plantas
- **Frontera con otras herramientas:** room-planner: plantación y densidad. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Motor local por conteo geométrico sin iterar sobre cada planta; límite de 100.000 filas y 1.000.000 de plantas para acotar cómputo. Cuadrícula con bordes a media separación y triangular con filas alternadas a media separación. No prescribe distancias para especies; seguir los gates globales y probar unidades/formatos.
- **Consultas secundarias del mismo propietario:**
  - `plant population calculator` — 170/mes US/en; KD 0.
  - `plant spacing calculator free online`; `plant spacing calculator with example`; `plant spacing calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 256 · Ev Charging Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `ev-charging-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/ev-charging-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `ev charging calculator` — 1.000 búsquedas/mes US/en, KD 11; nivel B. CPC 7.77 USD (no CPM).
- **Función mínima y ampliaciones útiles:** SOC, capacidad utilizable, potencia, pérdidas, tiempo y tarifa
- **Prueba de aceptación específica:** Una batería de50 kWh de20% a80% requiere30 kWh a la batería antes de pérdidas; calcular tiempo desde energía de red y potencia de cargador.
- **Frontera con otras herramientas:** fuel-cost-calculator: carga eléctrica y tiempo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Distinguir energía añadida a batería de energía tomada de red; tiempo con potencia de entrada constante y tarifa/coste opcional. Aclarar que la carga real suele reducir potencia al subir el estado de carga. No asumir modelo de coche, curva, tarifa ni seguridad de instalación; seguir gates globales.
- **Consultas secundarias del mismo propietario:**
  - `electric car charging cost calculator` — 1.000/mes US/en; KD 24.
  - `ev charging calculator free online`; `ev charging calculator with example`; `ev charging calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `ladekosten elektroauto rechner` 10/mes, KD —.

### 258 · Rainwater Harvesting Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `rainwater-harvesting-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rainwater-harvesting-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rainwater harvesting calculator` — 1.000 búsquedas/mes US/en, KD 21; nivel B. CPC 0.91 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cubierta, lluvia manual, escorrentía, depósito y balance mensual
- **Prueba de aceptación específica:** 10 mm sobre 100 m² a 100% de escorrentía da 1.000 L antes de capacidad del depósito/demanda; conservar un balance que no exceda el tanque.
- **Frontera con otras herramientas:** pool-volume-calculator: captación y almacenamiento. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Balance mensual de 12 valores de lluvia y 12 de demanda; incorpora área de cubierta, coeficiente de escorrentía, capacidad y almacenamiento inicial. Modelo ordena lluvia antes de demanda dentro del mes, y explicita que no representa cronología diaria, primera descarga, evaporación ni potabilidad. Procesamiento local acotado.
- **Consultas secundarias del mismo propietario:**
  - `rainwater collection calculator` — 1.000/mes US/en; KD 29.
  - `rainwater harvesting calculator free online`; `rainwater harvesting calculator with example`; `rainwater harvesting calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 265 · Ramp Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `ramp-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/ramp-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `ramp calculator` — 880 búsquedas/mes US/en, KD 0; nivel C. CPC 1.52 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Altura, pendiente objetivo, longitudes y descansos; norma elegida por usuario
- **Prueba de aceptación específica:** 1 m a 1:12 necesita 12 m de recorrido horizontal y sqrt(145) m de superficie inclinada, antes de contar descansos.
- **Frontera con otras herramientas:** slope-grade-calculator: diseño con descansos; no certificación accesibilidad. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `wheelchair ramp calculator` — sin métrica obtenida; no atribuir volumen.
  - `ramp calculator free online`; `ramp calculator with example`; `ramp calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 274 · Heat Loss Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `heat-loss-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/heat-loss-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `heat loss calculator` — 720 búsquedas/mes US/en, KD 3; nivel C. CPC 2.61 USD (no CPM).
- **Función mínima y ampliaciones útiles:** calcular pérdidas de transmisión por separado para paredes, techo, ventanas y suelo a partir de área y valor U; sumar una aproximación de ventilación mediante volumen y renovaciones/hora; admitir áreas en m²/ft², volumen en m³/ft³ y diferencia térmica en K/°F; mostrar W y BTU/h.
- **Prueba de aceptación específica:** U = 1 W/(m²·K) × 10 m² × diferencia de 20 K = 200 W para esa superficie. El total debe sumar transmisión de cada componente y ventilación de forma independiente.
- **Frontera con otras herramientas:** btu-calculator: cargas detalladas, validar distinción de intención. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** cálculo estacionario simplificado y local. Los valores U y renovaciones de aire son datos ingresados por la persona. No equivale a un cálculo Manual J, una auditoría energética ni a dimensionar un sistema; deja fuera puentes térmicos, ganancias solares/internas, humedad, viento, ductos, clima local y operación dinámica. No recomendar equipos ni predecir facturas; mostrar esta frontera con claridad.
- **Consultas secundarias del mismo propietario:**
  - `room heat loss calculator` — 20/mes US/en; KD 0.
  - `heat loss calculator free online`; `heat loss calculator with example`; `heat loss calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 286 · Heat Pump Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `heat-pump-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/heat-pump-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `heat pump calculator` — 590 búsquedas/mes US/en, KD 0; nivel C. CPC 3.61 USD (no CPM).
- **Función mínima y ampliaciones útiles:** convertir la potencia térmica introducida en kW o BTU/h; estimar potencia eléctrica y kWh diarios según COP y horas de uso; estimar coste horario/diario/30 días con tarifa y código de moneda introducidos; comparar con una resistencia idealizada de COP 1 para el mismo calor entregado.
- **Prueba de aceptación específica:** 10 kW térmicos con COP 5 requieren 2 kW eléctricos; por 1 hora son 2 kWh. A una tarifa introducida de 0,20 unidades/kWh, el coste de esa hora es 0,40 unidades.
- **Frontera con otras herramientas:** electricity-cost-calculator: rendimiento térmico y demanda. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** aritmética local; COP, potencia térmica, horario, tarifa y código ISO de moneda son entradas del usuario. COP cambia con clima y sistema. La comparación de resistencia presupone COP 1; las cifras mensuales repiten 30 días idénticos y no son una factura real. Sin rendimiento estacional, impuestos, cargos fijos, dimensionamiento, recomendación de compra ni asesoría.
- **Consultas secundarias del mismo propietario:**
  - `heat pump running cost calculator` — 10/mes US/en; KD 0.
  - `heat pump calculator free online`; `heat pump calculator with example`; `heat pump calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 294 · Miter Angle Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `miter-angle-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/miter-angle-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `miter angle calculator` — 480 búsquedas/mes US/en, KD 0; nivel C. CPC 0.95 USD (no CPM).
- **Función mínima y ampliaciones útiles:** corte simple simétrico del ángulo interior; modo compuesto para moldura corona plana que devuelve magnitudes de inglete y bisel; diagrama accesible y ejemplo 90°/38°. Convención compuesta declarada: ángulo de resorte medido desde el reverso de la moldura que apoya en la pared.
- **Prueba de aceptación específica:** esquina interior de 90° → inglete simple 45°; en modo compuesto con ángulo de resorte 38°, inglete ≈31,62° y bisel ≈33,86°, concordante con la tabla del [manual de sierra DEWALT](https://www.dewalt.com/GLOBALBOM/QU/DCS361B/20/Instruction_Manual/EN/NA379781_DCS361_NA.pdf).
- **Frontera con otras herramientas:** protractor: calcular corte no medir ángulo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** motor local ligero, entradas acotadas (interior 1°–179°, resorte 0°–90°), grados y redondeo de presentación a dos decimales. Fórmulas compuestas solo para moldura corona plana; resultados sin orientación izquierda/derecha. Verificar perfil, escala del fabricante y corte de prueba. Geometry only, no consejo estructural o de seguridad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `compound miter calculator` — 260/mes US/en; KD 0.
  - `miter angle calculator free online`; `miter angle calculator with example`; `miter angle calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Física, química y electrónica

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Fórmulas exactas o modelo numérico acotado; solver de incógnitas y unidades separado del UI. Tablas/c constantes con fuente y referencia. Uso educativo, no certificación.

**Pruebas adicionales para cada ficha:** Dimensiones coherentes, conservación/invariante y caso analítico; no NaN/Infinity como resultado. Mostrar aproximaciones.

### 026 · Molar Mass Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `molar-mass-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/molar-mass-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `molecular weight calculator` — 90.500 búsquedas/mes US/en, KD 18; nivel A. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Parsear fórmulas, paréntesis, isótopos soportados y masas citadas
- **Prueba de aceptación específica:** H2O aproxima18.015g/mol
- **Frontera con otras herramientas:** periodic-table: fórmulas y cálculo no consulta elementos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `molar mass calculator` — 5.400/mes US/en; KD 26.
  - `molecular weight calculator free online`; `molecular weight calculator with example`; `molecular weight calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `molecular weight calculator` 390/mes, KD 16; UK/en `molecular weight calculator` 3.600/mes, KD 9; AU/en `molecular weight calculator` 390/mes, KD 20; DE/de `molare masse berechnen` 1.600/mes, KD 0.

### 059 · Voltage Drop Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `voltage-drop-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/voltage-drop-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `voltage drop calculator` — 27.100 búsquedas/mes US/en, KD 21; nivel A. CPC 1.86 USD (no CPM).
- **Función mínima y ampliaciones útiles:** material cobre/aluminio, longitud de ida, corriente, sección transversal, voltaje, circuito DC/monofásico/trifásico equilibrado y factor de potencia para CA; caída en V y porcentaje, más voltaje estimado de carga.
- **Prueba de aceptación específica:** longitud cero da caída cero; el caso de referencia 20 A, 30 m, 2,5 mm² de cobre, 230 V monofásico y factor de potencia 1 calcula 8,2752 V (≈3,598%).
- **Frontera con otras herramientas:** la ficha sugiere ley de Ohm, pero no existe una herramienta con ese ID en el catálogo base ni en Growth600 actual; por tanto no añadir enlace roto. Mantener el alcance específico de pérdida resistiva en conductores, sin fingir diseño de circuitos. Aplicar además §6; no crear URLs duplicadas por fase o unidades.
- **Implementación/riesgo:** fórmula resistiva local con resistividades nominales a 20 °C (cobre 0,01724 y aluminio 0,02806 Ω·mm²/m); 2·I·L·ρ/A para CC/monofásico y √3·I·L·ρ/A·cosφ para trifásico equilibrado. Contrastar con la [guía de cálculo de caída de tensión](https://www.electrical-installation.org/enwiki/Calculation_of_voltage_drop_in_steady_load_conditions) y los datos de resistividad comercial del [NIST](https://nvlpubs.nist.gov/nistpubs/bulletin/07/nbsbulletinv7n1p103_A2b.pdf). La aproximación omite calentamiento, reactancia CA, armónicos, conectores, método de instalación, ampacidad, protecciones y códigos; no calcular calibre ni certificar seguridad. Un electricista cualificado debe validar diseño y normativa local.
- **Consultas secundarias del mismo propietario:**
  - `wire voltage drop calculator` — 260/mes US/en; KD 12.
  - `voltage drop calculator free online`; `voltage drop calculator with example`; `voltage drop calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `voltage drop calculator` 4.400/mes, KD 19; UK/en `voltage drop calculator` 3.600/mes, KD 19; AU/en `voltage drop calculator` 3.600/mes, KD 10; DE/de `spannungsfall rechner` 880/mes, KD 0.

### 068 · Molarity Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `molarity-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/molarity-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `molarity calculator` — 22.200 búsquedas/mes US/en, KD 8; nivel A. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resolver molaridad desde moles y volumen final; moles desde M y volumen; volumen desde moles y M; y masa del soluto desde M, volumen final y masa molar ingresada. Incluir selector de incógnita, unidades mol/L (M), L/mL, ejemplo, modo de preparación aritmética y distinción breve entre molaridad y molalidad.
- **Prueba de aceptación específica:** 1 mol en 2 L de solución final da 0,5 mol/L = 0,5 M; 0,5 M × 2 L × 58,44 g/mol da 58,44 g de soluto para la concentración/volumen objetivo.
- **Frontera con otras herramientas:** stoichiometry-calculator: soluciones no reacción. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: aritmética local acotada, volumen convertido a litros, masa molar proporcionada por la persona. La concentración es cantidad de constituyente dividida por volumen de la mezcla/solución según IUPAC: [Gold Book, amount concentration](https://goldbook.iupac.org/terms/view/A00295). Mostrar explícitamente que es volumen final de solución, no volumen inicial de disolvente. Sin correcciones de pureza, hidratación, densidad, temperatura o no idealidad; no convertir el resultado en procedimiento químico ni consejo de laboratorio/medicina. Seguir los gates globales; el ejemplo no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `solution concentration calculator` — 210/mes US/en; KD 19.
  - `molarity calculator free online`; `molarity calculator with example`; `molarity calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `molarity calculator` 1.600/mes, KD 4; UK/en `molarity calculator` 4.400/mes, KD 5; AU/en `molarity calculator` 1.300/mes, KD 5.

### 087 · Dilution Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `dilution-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/dilution-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `dilution calculator` — 14.800 búsquedas/mes US/en, KD 16; nivel A. CPC 5.58 USD (no CPM).
- **Función mínima y ampliaciones útiles:** modo directo `C₁V₁=C₂V₂` con alícuota de stock, volumen final y diluyente idealizado; modo de serie que divide un factor total en pasos iguales y muestra alícuota/diluyente por paso. Concentraciones en la misma unidad elegida y volúmenes L/mL.
- **Prueba de aceptación específica:** stock 10 M → objetivo 2 M y 1 L final requiere 0,2 L de stock + 0,8 L de diluyente (asumiendo aditividad); factor total 10× repartido en 3 pasos da factor por paso `10^(1/3)`.
- **Frontera con otras herramientas:** molarity-calculator: misma familia; flujo de dilución por serie distinto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** motor local acotado; rechazar objetivo mayor que stock, volúmenes no positivos y pasos fraccionarios o >20. La serie calcula factores/volúmenes matemáticos, no un procedimiento de laboratorio. Concentraciones deben estar en unidades consistentes; volumen de diluyente es estimado y asume mezcla ideal con volúmenes aditivos. Sin pureza, compatibilidad, temperatura, incertidumbre ni peligros. Seguir el patrón de familia y gates globales.
- **Consultas secundarias del mismo propietario:**
  - `c1v1 c2v2 calculator` — 880/mes US/en; KD 0.
  - `dilution calculator free online`; `dilution calculator with example`; `dilution calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 089 · Ohms Law Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `ohms-law-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/ohms-law-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `ohms law calculator` — 14.800 búsquedas/mes US/en, KD 31; nivel A. CPC 0.6 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resolver voltaje, corriente, resistencia y potencia introduciendo cualquier pareja válida de valores. En la misma página, modo separado para equivalentes de 2–20 resistencias en serie o paralelo. Mostrar V, A, Ω y W, ejemplo, copiar, reiniciar y límites de cálculo.
- **Prueba de aceptación específica:** 12 V entre 6 Ω da 2 A y 24 W; 2 Ω, 3 Ω y 6 Ω en paralelo dan 1 Ω. Probar las seis parejas posibles, entrada incompleta, cero/negativos, valores extremos y ambas topologías.
- **Frontera con otras herramientas:** complementa `voltage-drop-calculator` (caída en conductor, no ley de Ohm de dos valores) y `unit-converter`; no crea URLs por fórmula, variable desconocida ni topología.
- **Implementación/riesgo:** L: aritmética pura en JavaScript, sin dependencias ni procesamiento remoto. Las fórmulas de V=IR, P=VI, resistencia en serie y paralelo se contrastan con [OpenStax, resistors in series and parallel](https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel) y [OpenStax, key equations](https://openstax.org/books/physics/pages/19-key-equations). Solo circuito resistivo DC ideal: no usar para certificar seguridad o seleccionar componentes; declarar límites, verificar hojas de datos y pedir revisión profesional.
- **Consultas secundarias del mismo propietario:**
  - `voltage current resistance calculator` — 140/mes US/en; KD 14.
  - `ohms law calculator free online`; `ohms law calculator with example`; `ohms law calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `ohmsches gesetz rechner` 480/mes, KD 0.

- **Estado de implementación (2026-10-08):** motor local, dos modos, formulario accesible, ejemplo y resultado copiable implementados en el checkpoint de Growth600. El copy completo solo está listo en inglés; las otras 35 localizaciones permanecen bloqueadas como borradores. No desplegar hasta cerrar traducción y todos los gates C/F/E/X/L/B/P/S.

### 100 · Chemical Equation Balancer

- [ ] **C/F/E/X/L/B/P/S completos — `chemical-equation-balancer`** (motor/formulario implementados en esta rama; traducción, QA de navegador y publicación siguen abiertas)
- **Destino propuesto:** `https://tools.usefulverse.com/tools/chemical-equation-balancer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `chemical equation balancer` — 12.100 búsquedas/mes US/en, KD 12; nivel A. CPC 2.2 USD (no CPM).
- **Función mínima y ampliaciones útiles:** recibir ecuación neutral con flecha y especies separadas por `+`; leer fórmulas con los elementos/paréntesis/grupos admitidos por el parser de masa molar; balancear por reducción racional exacta; mostrar coeficientes y conteo por elemento; copiar, reiniciar y ofrecer ejemplo. Si hay varias soluciones, mostrar que el resultado es una solución pequeña acotada, no afirmar un mínimo global.
- **Prueba de aceptación específica:** `H2 + O2 -> H2O` devuelve `2H2 + O2 → 2H2O`; `Ca(OH)2 + HCl -> CaCl2 + H2O` devuelve `Ca(OH)2 + 2HCl → CaCl2 + 2H2O`. Probar también hierro y la ecuación subdeterminada C/CO/CO₂, sintaxis rota, especies repetidas, notación iónica y límites.
- **Frontera con otras herramientas:** complementa `molar-mass-calculator` (masa de fórmula), no `molecule-viewer` inexistente. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** motor local sin librerías/API, fracciones exactas BigInt; parser reutilizado de masa molar. Acotar a 500 caracteres, 16 especies, 160 caracteres por fórmula y hasta tres variables libres con búsqueda acotada. No prometer química iónica/carga/electrones, predicción de reacción, rendimiento, seguridad ni mínimo global para sistemas con múltiples soluciones fuera del rango. Copy fuente inglés listo; los 35 borradores restantes no se publican sin traducción aprobada.
- **Consultas secundarias del mismo propietario:**
  - `balance chemical equation calculator` — 5.400/mes US/en; KD 4.
  - `chemical equation balancer free online`; `chemical equation balancer with example`; `chemical equation balancer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `reaktionsgleichung ausgleichen` 880/mes, KD 0.

- **Estado de implementación (2026-10-08):** motor, formulario semántico, controlador, pruebas y flujo visual inglés de escritorio/móvil implementados en la rama como candidata #56/323. Suite Growth600: 173/173 aprobadas. Falta revisión RTL, traducción específica de 35 idiomas y gates de publicación; no está desplegada.

### 102 · Gear Ratio Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `gear-ratio-calculator`** (motor/formulario y QA de navegador implementados en rama; localización y publicación siguen abiertas)
- **Destino propuesto:** `https://tools.usefulverse.com/tools/gear-ratio-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `gear ratio calculator` — 12.100 búsquedas/mes US/en, KD 28; nivel A. CPC 0.83 USD (no CPM).
- **Función mínima y ampliaciones útiles:** relación driven/driver de dientes para engranajes externos o cadena sin cruzar; 1–6 etapas con cálculo acumulado; RPM de salida; par de entrada y par ideal opcionales; eficiencia por etapa editable que se compone a través de las etapas; indicación de dirección bajo supuestos explícitos; copiar, ejemplo y reiniciar.
- **Prueba de aceptación específica:** 20:40, 1.500 RPM y 10 N·m → ratio 2:1, 750 RPM, 20 N·m ideales; dos etapas 10:30 y 20:40 → 6:1, 1.800 RPM→300 RPM y, con 5 N·m y 90% de eficiencia por etapa, 24,3 N·m estimados.
- **Frontera con otras herramientas:** no confundir con `running-pace-calculator`: una calcula transmisión mecánica; la otra ritmo de carrera. No se crea una URL separada para engranajes y piñones porque comparten la relación de dientes.
- **Implementación/riesgo:** JavaScript local sin dependencias; acotar a 6 etapas, 100.000 dientes por componente, ratio acumulada de 10⁻⁹ a 10⁹, 1.000.000.000 RPM/par como máximo y eficiencia por etapa >0–100%. Asume par compuesto entre etapas; no modela geometría, idlers, deslizamiento, resistencia de diente/eje, lubricación ni cargas/seguridad. La eficiencia introducida por la persona es una hipótesis aplicada a cada etapa, no una medición. Sin calcular potencia, límites de diseño ni conformidad mecánica.
- **Consultas secundarias del mismo propietario:**
  - `gear speed calculator` — 590/mes US/en; KD 28.
  - `gear ratio calculator free online`; `gear ratio calculator with example`; `gear ratio calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

- **Estado de implementación (2026-10-08):** herramienta local implementada como candidata #57/323, build estático y flujo escritorio/móvil revisados, suite focal **175/175**; bundle controlador 5.038 bytes. Copy fuente inglés listo, 35 locales aún pendientes y bloqueados por el gate de publicación; no está desplegada.

### 108 · Density Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `density-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/density-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `density calculator` — 9.900 búsquedas/mes US/en, KD 14; nivel B. CPC 5.62 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Introducir exactamente dos de masa (kg), volumen (m³) y densidad (kg/m³) para resolver el tercero; informar también en g/cm³ y lb/ft³. Modo opcional de mezcla: hasta 12 filas masa,volumen, sumar ambas magnitudes y estimar la densidad agregada bajo la hipótesis explícita de volúmenes aditivos.
- **Prueba de aceptación específica:** 10 kg en 2 m³ da 5 kg/m³ (0,005 g/cm³; aproximadamente 0,31214 lb/ft³). 10 kg a 5 kg/m³ da 2 m³; 2 m³ a 5 kg/m³ da 10 kg. Filas 2 kg/1 m³ y 3 kg/0,5 m³ dan 5 kg / 1,5 m³ / 3,333333 kg/m³.
- **Frontera con otras herramientas:** `volume-calculator` resuelve geometría para obtener volumen; esta herramienta relaciona propiedades físicas de masa, volumen y densidad. No crear URL por valor desconocido o unidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `mass volume density calculator` — 720/mes US/en; KD 1.
  - `density calculator free online`; `density calculator with example`; `density calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 131 · Compression Ratio Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `compression-ratio-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/compression-ratio-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `compression ratio calculator` — 6.600 búsquedas/mes US/en, KD 23; nivel B. CPC 0.91 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Calcular volumen barrido por cilindro desde diámetro y carrera; sumar volumen de cámara, junta comprimida, altura de deck con signo y cazoleta/cúpula del pistón para obtener volumen de holgura y relación estática. Unidades mm/in y cc/in³, cantidad de cilindros (1–16), desplazamiento total y relación diámetro/carrera.
- **Prueba de aceptación específica:** 9 cc barridos + 1 cc de holgura → 10:1. Inputs equivalentes convertidos entre mm/cc e in/in³ producen la misma relación. Validar cúpula que reduzca holgura a cero/negativa, valores no finitos, unidad desconocida y límites de cilindros.
- **Frontera con otras herramientas:** volume-calculator: motor y varios volúmenes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `engine compression calculator` — 720/mes US/en; KD 7.
  - `compression ratio calculator free online`; `compression ratio calculator with example`; `compression ratio calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

- **Estado de implementación (2026-10-08):** motor de geometría local, formulario, controlador y copy completo en inglés implementados como candidata #59/323. Pruebas focales 176/176; builder/bundler 3/3; bundle 4.997 B. Las 35 traducciones específicas, la prueba visual en navegador y la publicación siguen pendientes; el release gate no permite sacarla aún.

### 138 · Kinetic Energy Calculator

- [x] **C/F/E/X/L/B/P/S completos — `kinetic-energy-calculator`**
- **Destino:** `https://tools.usefulverse.com/tools/kinetic-energy-calculator/` y 35 variantes localizadas, publicado en el hub.
- **Demanda:** `kinetic energy calculator` — 5.400 búsquedas/mes US/en, KD 5; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Energía cinética/potencial, velocidad inversa y referencia altura
- **Prueba de aceptación específica:** 2kg a3m/s da9J
- **Frontera con otras herramientas:** force-calculator: energía no fuerza. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** cálculo local, sin API ni procesamiento servidor; límites y supuestos de gravedad/pérdidas indicados. No sustituye evaluación de ingeniería o seguridad.
- **Consultas secundarias del mismo propietario:**
  - `kinetic potential energy calculator` — 10/mes US/en; KD 16.
  - `kinetic energy calculator free online`; `kinetic energy calculator with example`; `kinetic energy calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

- **Estado de implementación (2026-10-08):** C/F/E/X/L/B/P/S cerrados. 36 copias estáticas con Google Translate y dos etiquetas maratíes ajustadas; 1.262 pruebas completas y CI 37781969260 aprobados. Verificados cálculo directo/inverso, copiar, RTL árabe, CJK japonés, 390 px y consola limpia. Integrado en `main` (1d14d20) y desplegado en Cloudflare (ce2460ae); URLs EN/ja/ar responden 200 y `https://tools.usefulverse.com/sitemap.xml` anuncia 3.060 URLs únicas. Sin pruebas PageSpeed.

### 158 · Resistor Color Code Calculator

- [x] **C/F/E/X/L/B/P/S completos — `resistor-color-code-calculator`**
- **Destino:** `https://tools.usefulverse.com/tools/resistor-color-code-calculator/` y 35 variantes localizadas, publicado en el hub.
- **Demanda:** `resistor color code calculator` — 4.400 búsquedas/mes US/en, KD 29; nivel B. CPC 0.77 USD (no CPM).
- **Función mínima y ampliaciones útiles:** 4-6 bandas, tolerancia, temperatura y código inverso
- **Prueba de aceptación específica:** Marrón negro rojo oro da1kΩ5%
- **Frontera con otras herramientas:** ohms-law-calculator: lectura de marcado no circuito. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** motor local sin API/servidor; rangos y bandas normalizadas; advierte que no determina idoneidad, potencia ni seguridad del circuito y que se verifique la hoja de datos.
- **Consultas secundarias del mismo propietario:**
  - `resistor band calculator` — 320/mes US/en; KD 26.
  - `resistor color code calculator free online`; `resistor color code calculator with example`; `resistor color code calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `widerstand farbcode rechner` 1.000/mes, KD 0.
- **Estado de implementación (2026-10-08):** C/F/E/X/L/B/P/S completos. 1.264 pruebas y CI 37785744156 aprobados. Build aislado: 3.096 páginas para 85 herramientas × 36 idiomas + 36 portadas. Navegador verificó 4 bandas (1 kΩ ±5%), 6 bandas (1 kΩ ±1%, 50 ppm/K), modo inverso, copiar, ES/AR (RTL), 390 px y consola limpia. 77 cadenas × 36 idiomas traducidas automáticamente con Google Translate; no es revisión nativa. Integrado mediante PR #41, merge `40e466c3`, Pages `78a117d0-1b8e-4e90-bb78-4a4f940fc755`; EN/ES/AR y sitemap públicos HTTP 200 con 3.096 `<loc>` únicos. Sin PageSpeed.

### 163 · Half Life Calculator

- [~] **No crear otra URL — `half-life-calculator` ya existe en el catálogo Growth600**, con lógica, control, página estática y traducciones. Cubre esta intención y debe permanecer intacta.
- **Destino existente:** `https://tools.usefulverse.com/tools/half-life-calculator/` y sus versiones localizadas. El plan no cambia ni duplica el producto existente.
- **Demanda:** `half life calculator` — 3.600 búsquedas/mes US/en, KD 6; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Exponencial, vida media, cantidad y tiempo; sin dosificación
- **Prueba de aceptación específica:** Una vida media deja50%
- **Frontera con otras herramientas:** compound-interest-calculator: desintegración física. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Estado:** candidata descartada por duplicación detectada durante la revisión; no se modificó la herramienta existente.
- **Consultas secundarias del mismo propietario:**
  - `radioactive decay calculator` — 1.000/mes US/en; KD 0.
  - `half life calculator free online`; `half life calculator with example`; `half life calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 178 · Acceleration Calculator

- [x] **C/F/E/X/L/B/P/S completos — `acceleration-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/acceleration-calculator/`; otras 35 versiones con los prefijos del anexo.
- **Demanda:** `acceleration calculator` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Velocidades inicial/final, tiempo, posición y MRUA
- **Prueba de aceptación específica:** De0 a20m/s en5s da4m/s²
- **Frontera con otras herramientas:** cinemática de aceleración constante, con cuatro incógnitas; no es una URL por dirección inversa o modalidad. Evita prometer frenado real, resistencia o seguridad de vehículos.
- **Implementación/riesgo:** motor local ligero; cuatro modos de cálculo y unidades métricas/imperiales, con conversión interna SI. Aceptación y bordes cubiertos por pruebas focalizadas; no sustituye consejo de ingeniería.
- **Avance comprobado (2026-10-08):** 36 copias estáticas (42 cadenas por idioma), incluida la corrección de etiquetas de física árabes y dos rótulos Marathi que contenían un marcador de lote. Catálogo, formulario, controlador, contrato de locales y build pasan; suite focalizada 161/161 antes de dos ajustes de copy, contrato de locales/lógica 121/121 después. Suite total 1.269/1.269; `npm run check` valida 10.260 URLs originales sin cambios. Build aislado produce **3.132 URLs únicas** (86 herramientas × 36 idiomas + 36 portadas). Chrome: ejemplo 0→20 m/s en 5 s da 4 m/s² y 50 m; modo inverso e imperial verificados; móvil árabe RTL 390 px sin overflow, errores de consola ni recursos externos. PR #42 fusionado en `8c9ded9a`; el workflow 37789761618 publicó el sitio principal y 37790375128 publicó el hub. Comprobadas las rutas EN/ES/AR y el sitemap público actualizado con 3.132 URLs únicas. No ejecutado PageSpeed.
- **Consultas secundarias del mismo propietario:**
  - `acceleration velocity calculator` — 30/mes US/en; KD 2.
  - `acceleration calculator free online`; `acceleration calculator with example`; `acceleration calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 179 · Force Calculator

- [x] **C/F/E/X/L/B/P/S completos — `force-calculator`**
- **Estado (2026-10-08):** PR #44 fusionado; producción y sitemap confirmados con 3.168 URLs.
- **Destino:** `https://tools.usefulverse.com/tools/force-calculator/`; otras 35 versiones con los prefijos del anexo.
- **Demanda:** `force calculator` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Masa/aceleración, fuerzas colineales y diagrama
- **Prueba de aceptación específica:** 2kg por3m/s² da6N
- **Frontera con otras herramientas:** unit-converter: mecánica no conversión. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `newtons second law calculator` — sin métrica obtenida; no atribuir volumen.
  - `force calculator free online`; `force calculator with example`; `force calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 180 · Horsepower Calculator

- [x] **C/F/E/X/L/B/P/S completos — `horsepower-calculator`**
- **Estado (2026-10-08):** motor estático y textos de 36 idiomas; regresión 1.281/1.281, `npm run check` (10.260 URLs protegidas) y control de localización correctos. Build del hub: 3.204 URLs únicas, 3.343 archivos. Browser QA EN/ES/AR: cálculo directo e inversos, RTL y consola sin errores; títulos ≤60/descripciones ≤160 caracteres renderizados. Sin PageSpeed/Lighthouse.
- **Publicado:** `https://tools.usefulverse.com/tools/horsepower-calculator/` y sus otras 35 versiones. PR #45 fusionada en `7f91d475cf09edc9b1fb6397382b90ecb85d91af`; CI/publicación principal 37804057904 y publicación del hub 37804650210 correctos. Sitemap del hub público con 3.204 URLs.
- **Demanda:** `horsepower calculator` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC 1.39 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Par, RPM y potencia con sistemas de unidades
- **Prueba de aceptación específica:** Par cero da potencia cero
- **Frontera con otras herramientas:** gear-ratio-calculator: potencia no transmisión. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `engine power calculator` — 70/mes US/en; KD 0.
  - `horsepower calculator free online`; `horsepower calculator with example`; `horsepower calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 193 · Ph Calculator

- [x] **C/F/E/X/L/B/P/S completos — `ph-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/ph-calculator/` + otras 35 versiones; sitemap público confirmado. Ver gates y pruebas en `docs/growth600/PROGRESS.md`.
- **Demanda:** `ph calculator` — 2.400 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Ácido/base fuerte y débil acotados, pH/pOH y método
- **Prueba de aceptación específica:** ConcentraciónH+1e-7 da pH7 bajo supuesto25C
- **Frontera con otras herramientas:** molarity-calculator: equilibrio químico no concentración aislada. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `ph poh calculator` — 110/mes US/en; KD 0.
  - `ph calculator free online`; `ph calculator with example`; `ph calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 194 · Section Modulus Calculator

- [x] **C/F/E/X/L/B/P/S completos — `section-modulus-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/section-modulus-calculator/` y las otras 35 versiones; sitemap del hub confirmado tras PR #91. Gates detallados en `docs/growth600/PROGRESS.md`.
- **Demanda:** `moment of inertia calculator` — 2.400 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Secciones simples, centroide, Ix/Iy y módulo
- **Prueba de aceptación específica:** Cuadrado tiene Ix=Iy
- **Frontera con otras herramientas:** beam-deflection-calculator: propiedades de sección no carga; no aparece como ruta activa en el catálogo actual. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `section modulus calculator` — 480/mes US/en; KD 2.
  - `moment of inertia calculator free online`; `moment of inertia calculator with example`; `moment of inertia calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 197 · Frequency Wavelength Calculator

- [x] **C/F/E/X/L/B/P/S completos — `frequency-wavelength-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/frequency-wavelength-calculator/`; otras 35 versiones con los prefijos del anexo. PR #92 integrada y publicación del hub verificada; sitemap 4.752 URLs.
- **Demanda:** `wavelength calculator` — 2.400 búsquedas/mes US/en, KD 2; nivel B. CPC 1.83 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Frecuencia, longitud y velocidad en medio elegido
- **Prueba de aceptación específica:** c=300000000 y f=100MHz da3m
- **Frontera con otras herramientas:** unit-converter: relación de propagación no unidades aisladas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `frequency wavelength calculator` — 1.000/mes US/en; KD 9.
  - `wavelength calculator free online`; `wavelength calculator with example`; `wavelength calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 198 · Ideal Gas Law Calculator

- [x] **C/F/E/X/L/B/P/S completos — `ideal-gas-law-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/ideal-gas-law-calculator/`; 36 locales. PR #93 integrada; CI y publicación del hub `37920634145` completados. Sitemap público verificado con 4.788 URLs.
- **Demanda:** `ideal gas law calculator` — 2.400 búsquedas/mes US/en, KD 3; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resolver P, V, n, T y unidades absolutas
- **Prueba de aceptación específica:** Temperatura cero Kelvin se rechaza
- **Frontera con otras herramientas:** density-calculator: estado gaseoso. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: cálculo de punto flotante local, sin dependencia. Usar unidades absolutas, detectar sobre/subdesbordamiento y mostrar la aproximación del modelo; los casos anotados en PROGRESS no sustituyen todos los gates de publicación.
- **Consultas secundarias del mismo propietario:**
  - `pv nrt calculator` — 590/mes US/en; KD 0.
  - `ideal gas law calculator free online`; `ideal gas law calculator with example`; `ideal gas law calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 201 · Torque Calculator

- [x] **C/F/E/X/L/B/P/S completos — `torque-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/torque-calculator/`; 36 locales. PR #94 integrada, CI y despliegues principal/hub completados; sitemap confirmado con 4.824 URLs únicas y 36 rutas Torque, todas HTTP 200 y con canonical autorreferente. La publicación no implica indexación.
- **Demanda:** `torque calculator` — 2.400 búsquedas/mes US/en, KD 6; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Brazo, fuerza, ángulo, equilibrio y croquis
- **Prueba de aceptación específica:** 10N a2m perpendicular da20Nm
- **Frontera con otras herramientas:** force-calculator: momentos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `moment of force calculator` — 20/mes US/en; KD 4.
  - `torque calculator free online`; `torque calculator with example`; `torque calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 203 · Beam Deflection Calculator

- [x] **C/F/E/X/L/B/P/S completos — `beam-deflection-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/beam-deflection-calculator/`; 35 versiones localizadas adicionales. Sitemap verificado: 36 variantes, todas HTTP 200 y canonical autorreferente.
- **Demanda:** `beam calculator` — 2.400 búsquedas/mes US/en, KD 8; nivel B. CPC 2.1 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Vigas simples, cargas definidas, diagramas, flecha; solo educativo
- **Prueba de aceptación específica:** Carga cero da deformación cero
- **Frontera con otras herramientas:** force-calculator: estructura elástica, requiere fuente ingeniería. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `beam deflection calculator` — 1.000/mes US/en; KD 0.
  - `beam calculator free online`; `beam calculator with example`; `beam calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 205 · Led Resistor Calculator

- [x] **C/F/E/X/L/B/P/S completos — `led-resistor-calculator`**
- **Destino:** `https://tools.usefulverse.com/tools/led-resistor-calculator/`; las 36 versiones localizadas están publicadas.
- **Demanda:** `led resistor calculator` — 2.400 búsquedas/mes US/en, KD 11; nivel B. CPC 1.28 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Caída LED, corriente, alimentación y potencia mínima
- **Prueba de aceptación específica:** 12V menos2V con0.02A requiere500Ω
- **Frontera con otras herramientas:** ohms-law-calculator: circuito LED y potencias de componentes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `led series resistor calculator` — 170/mes US/en; KD 18.
  - `led resistor calculator free online`; `led resistor calculator with example`; `led resistor calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Cierre verificado:** PR #96 fusionada como `ee6d0597450184fe64637cf4f339fc5af649508e`; CI `37929414805`, despliegue principal `37929894867` y publicación del hub `37930526779` exitosos. Sitemap HTTP 200 con 4.896 URLs únicas; las 36 rutas de esta herramienta devuelven HTTP 200 y canonical autorreferente. QA local EN/AR validó 12 V, 2 V, 20 mA → 500 Ω; E12 sugiere 560 Ω y calcula corriente/potencia. Sin PageSpeed/Lighthouse; indexación no comprobada.

### 212 · Flow Rate Calculator

- [x] **C/F/E/X/L/B/P/S completos — `flow-rate-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/flow-rate-calculator/`; las 36 versiones publicadas. PR #97, CI `37931992182`, despliegue principal `37932399268`, publicación del hub `37932777118`; sitemap HTTP 200 con 4.932 URLs, 36 rutas y canonicals autorreferentes verificados.
- **Demanda:** `flow rate calculator` — 1.900 búsquedas/mes US/en, KD 0; nivel B. CPC 3.54 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Sección, velocidad, caudal y llenar depósito
- **Prueba de aceptación específica:** Sección2m² a3m/s da6m³/s
- **Frontera con otras herramientas:** pressure-calculator: flujo no presión. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pipe flow calculator` — 880/mes US/en; KD 3.
  - `flow rate calculator free online`; `flow rate calculator with example`; `flow rate calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Cierre verificado:** 2 m² × 3 m/s → 6 m³/s; 1 m³ a 1 L/s → 16,6667 min. QA local EN/AR confirmó selector de modo y campos condicionales. Publicar no equivale a indexación; no se midió PageSpeed/Lighthouse.

### 213 · Reynolds Number Calculator

- [x] **C/F/E/X/L/B/P/S completos — `reynolds-number-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/reynolds-number-calculator/`; 36 versiones publicadas. PR #98, CI `37935068996`, deploy principal `37935552312`, publicación del hub `37935586544`; sitemap HTTP 200 con 4.968 URLs y 36 rutas/canonicals comprobados.
- **Demanda:** `reynolds number calculator` — 1.900 búsquedas/mes US/en, KD 0; nivel B. CPC 3.7 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Densidad, velocidad, longitud, viscosidad y régimen contextual
- **Prueba de aceptación específica:** Velocidad cero da Re0
- **Frontera con otras herramientas:** flow-rate-calculator: similitud y régimen. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `reynolds calculator` — 1.900/mes US/en; KD 4.
  - `reynolds number calculator free online`; `reynolds number calculator with example`; `reynolds number calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Cierre verificado:** Re ≈49.810 para agua en ejemplo dinámico; Re=50.000 con ν=1 cSt; velocidad cero → Re=0. QA EN/AR y RTL a 390 px sin overflow ni errores de consola. No se afirma indexación; no PageSpeed/Lighthouse.

### 229 · Three Phase Power Calculator

- [x] **C/F/E/X/L/B/P/S completos — `three-phase-power-calculator`**
- **Estado:** publicada y comprobada en sus 36 locales; no se afirma indexación.
- **Destino:** `https://tools.usefulverse.com/tools/three-phase-power-calculator/`; las otras 35 versiones usan los prefijos del anexo.
- **Demanda:** `three phase power calculator` — 1.600 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Monofásica/trifásica, estrella/triángulo, PF y magnitudes
- **Prueba de aceptación específica:** sqrt3 V I PF en trifásica balanceada
- **Frontera con otras herramientas:** ohms-law-calculator: AC trifásica no DC. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `3 phase power calculator` — 1.600/mes US/en; KD 0.
  - `three phase power calculator free online`; `three phase power calculator with example`; `three phase power calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Cierre:** PR #99 integrada (`8d215ca2726d0682a754a6d3a4e3415df15ea8ca`); CI `37938016624`, deploy principal `37938508014`, publicación del hub `37938544108`. Sitemap HTTP 200 con 5.004 URLs. EN/AR verificadas HTTP 200, incluidas en sitemap y con canonical propio. Sin PageSpeed/Lighthouse; publicación no equivale a indexación.

### 230 · Momentum Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `momentum-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/momentum-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `momentum calculator` — 1.600 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** momento con signo y choques 1D elásticos/inelásticos; velocidades iniciales/finales, conservación de momento, energía antes/después y energía convertida según coeficiente de restitución.
- **Prueba de aceptación específica:** Masas iguales choque elástico intercambian velocidades
- **Frontera con otras herramientas:** kinetic-energy-calculator: conservación de momento. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** motor local ligero; kg/g/toneladas y m/s, km/h o ft/s. Modelo clásico aislado, una dimensión; explicita límites educativos y no pretende análisis de ingeniería o seguridad. Sin API, dependencias externas ni carga de servidor. La suite global, build y revisión browser/RTL siguen gates obligatorios antes del deploy.
- **Consultas secundarias del mismo propietario:**
  - `collision calculator` — 70/mes US/en; KD 0.
  - `momentum calculator free online`; `momentum calculator with example`; `momentum calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 234 · Transformer Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `transformer-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/transformer-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `transformer calculator` — 1.600 búsquedas/mes US/en, KD 3; nivel B. CPC 5.9 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Relación vueltas, tensión, corriente y eficiencia
- **Prueba de aceptación específica:** Ratio2:1 transforma120V ideal a60V
- **Frontera con otras herramientas:** ohms-law-calculator: transformador ideal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `transformer turns ratio calculator` — 260/mes US/en; KD 0.
  - `transformer calculator free online`; `transformer calculator with example`; `transformer calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 246 · Stoichiometry Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `stoichiometry-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/stoichiometry-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `stoichiometry calculator` — 1.300 búsquedas/mes US/en, KD 4; nivel B. CPC 2.03 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Reactivos, masas, moles, limitante, rendimiento y explicación
- **Prueba de aceptación específica:** 2molH2 y1molO2 generan2molH2O teórico
- **Frontera con otras herramientas:** chemical-equation-balancer: cantidades no solo balance. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `limiting reactant calculator` — 480/mes US/en; KD 0.
  - `stoichiometry calculator free online`; `stoichiometry calculator with example`; `stoichiometry calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 249 · Pressure Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `pressure-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pressure-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pressure calculator` — 1.300 búsquedas/mes US/en, KD 12; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Fuerza por área y presión hidrostática
- **Prueba de aceptación específica:** 100N sobre2m² da50Pa
- **Frontera con otras herramientas:** force-calculator: presión y columna de líquido. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `force area pressure calculator` — 50/mes US/en; KD 0.
  - `pressure calculator free online`; `pressure calculator with example`; `pressure calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 251 · Pcb Trace Width Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `pcb-trace-width-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pcb-trace-width-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pcb trace width calculator` — 1.300 búsquedas/mes US/en, KD 38; nivel B. CPC 1.36 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Corriente, cobre, subida térmica y fórmula IPC citada
- **Prueba de aceptación específica:** Corriente cero produce caso no dimensionable
- **Frontera con otras herramientas:** voltage-drop-calculator: PCB y térmica, no cable. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pcb current calculator` — 50/mes US/en; KD 0.
  - `pcb trace width calculator free online`; `pcb trace width calculator with example`; `pcb trace width calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 252 · Projectile Motion Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `projectile-motion-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/projectile-motion-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `projectile motion calculator` — 1.000 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Trayectoria sin arrastre, altura inicial, alcance y animación
- **Prueba de aceptación específica:** Lanzamiento vertical sin componente x da alcance0
- **Frontera con otras herramientas:** function-grapher: física de trayectoria. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `projectile calculator` — 140/mes US/en; KD 0.
  - `projectile motion calculator free online`; `projectile motion calculator with example`; `projectile motion calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 257 · Pulley Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `pulley-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pulley-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pulley calculator` — 1.000 búsquedas/mes US/en, KD 11; nivel B. CPC 0.94 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Diámetros, centros, longitud de correa, RPM y croquis
- **Prueba de aceptación específica:** Poleas iguales dan igualRPM
- **Frontera con otras herramientas:** gear-ratio-calculator: geometría de correa. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `belt length calculator` — 1.000/mes US/en; KD 2.
  - `pulley calculator free online`; `pulley calculator with example`; `pulley calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 266 · Rlc Circuit Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `rlc-circuit-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rlc-circuit-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `resonant frequency calculator` — 880 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resonancia, Q, ancho de banda y impedancia
- **Prueba de aceptación específica:** L y C positivos dan frecuencia real positiva
- **Frontera con otras herramientas:** rc-time-constant-calculator: resonancia no carga exponencial. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rlc circuit calculator` — 170/mes US/en; KD 0.
  - `resonant frequency calculator free online`; `resonant frequency calculator with example`; `resonant frequency calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 267 · Antenna Length Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `antenna-length-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/antenna-length-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `dipole antenna calculator` — 880 búsquedas/mes US/en, KD 3; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Media/quarter wavelength con factor acortamiento editable
- **Prueba de aceptación específica:** 100MHz en vacío media onda1.5m
- **Frontera con otras herramientas:** frequency-wavelength-calculator: geometría de antena no solo relación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `antenna length calculator` — 480/mes US/en; KD 3.
  - `dipole antenna calculator free online`; `dipole antenna calculator with example`; `dipole antenna calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 272 · Specific Heat Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `specific-heat-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/specific-heat-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `specific heat calculator` — 720 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Q, m, c, deltaT, mezcla térmica ideal y pérdidas manuales
- **Prueba de aceptación específica:** 1kg con c1000 ydelta10 da10000J
- **Frontera con otras herramientas:** heat-loss-calculator: calor sensible de material no habitación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `heat capacity calculator` — 210/mes US/en; KD 0.
  - `specific heat calculator free online`; `specific heat calculator with example`; `specific heat calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 275 · Rc Time Constant Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `rc-time-constant-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rc-time-constant-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rc time constant calculator` — 720 búsquedas/mes US/en, KD 3; nivel C. CPC 1.84 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Carga/descarga, tau, umbrales y gráfico
- **Prueba de aceptación específica:** 1000Ω por100uF da0.1s
- **Frontera con otras herramientas:** capacitor-calculator: evolución temporal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rc circuit calculator` — 590/mes US/en; KD 9.
  - `rc time constant calculator free online`; `rc time constant calculator with example`; `rc time constant calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 281 · Decibel Calculator

- [x] **C/F/E/X/L/B/P/S completos — `decibel-calculator`**
- **Publicado:** `https://tools.usefulverse.com/tools/decibel-calculator/` y 35 versiones localizadas; las 36 responden HTTP 200 y se incluyen en el sitemap público del hub.
- **Demanda:** `decibel calculator` — 720 búsquedas/mes US/en, KD 19; nivel C. CPC 1.25 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Ganancia de amplitud/potencia, suma de niveles incoherentes y atenuación
- **Prueba de aceptación específica:** Potencia diez veces da10dB
- **Frontera con otras herramientas:** speaker-tester: cálculo logarítmico no reproducción. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `db calculator` — 480/mes US/en; KD 3.
  - `decibel calculator free online`; `decibel calculator with example`; `decibel calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 287 · Friction Calculator

- [x] **C/F/E/X/L/B/P/S completos — `friction-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/friction-calculator/`; otras 35 versiones con los prefijos del anexo.
- **Demanda:** `friction calculator` — 590 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Normal, coeficiente, inclinación y umbral estático
- **Prueba de aceptación específica:** Mu0 da fuerza fricción0
- **Frontera con otras herramientas:** force-calculator: rozamiento y planos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `friction force calculator` — 590/mes US/en; KD 0.
  - `friction calculator free online`; `friction calculator with example`; `friction calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Publicado y comprobado (2026-10-09):** motor local de Coulomb para fuerza normal conocida y plano inclinado, con fricción estática/cinética, sentido de movimiento, componente gravitatoria, fuerza neta y aceleración cuando se conoce la masa. El modo plano usa gravedad/coeficientes ingresados y declara sus límites; no dimensiona ni aconseja ingeniería. 36 copias estáticas; gates de locales y metadata aprobados. Suite focal 196/196 y suite completa 1.406/1.406 aprobadas; `locale:release-check`, `npm run check`, CI y despliegue correctos. El sitemap principal conserva 10.260 URLs. El sitemap público del hub contiene 3.744 URLs (103 herramientas × 36 idiomas + 36 portadas) e incluye rutas inglesa y árabe, ambas HTTP 200. Chrome real: ejemplo inclinado y página árabe RTL comprobados; sin overflow en viewport móvil de prueba ni errores de consola. No PageSpeed/Lighthouse. Publicada no significa indexación garantizada; no se solicitó indexación manual.

### 288 · Thermal Expansion Calculator

- [x] **C/F/E/X/L/B/P/S completos — `thermal-expansion-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/thermal-expansion-calculator/`; otras 35 versiones con los prefijos del anexo.
- **Demanda:** `thermal expansion calculator` — 590 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Expansión lineal, superficial, volumétrica y coeficiente manual
- **Prueba de aceptación específica:** DeltaT cero conserva longitud
- **Frontera con otras herramientas:** specific-heat-calculator: dimensiones térmicas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `linear expansion calculator` — 590/mes US/en; KD 0.
  - `thermal expansion calculator free online`; `thermal expansion calculator with example`; `thermal expansion calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Cierre comprobado (2026-10-09):** CI/deploy principal run `37858771766` y publicación separada run `37859095394` correctos; EN y AR HTTP 200; sitemap del hub 3.780 URLs. No se afirma indexación ni envío manual a buscadores.

### 290 · Capacitor Calculator

- [x] **C/F/E/X/L/B/P/S completos — `capacitor-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/capacitor-calculator/`; otras 35 versiones con los prefijos del anexo.
- **Demanda:** `capacitor calculator` — 590 búsquedas/mes US/en, KD 2; nivel C. CPC 4.29 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Capacitancia equivalente, carga y energía
- **Prueba de aceptación específica:** Dos100uF paralelo dan200uF
- **Frontera con otras herramientas:** resistor-series-parallel-calculator: capacitores y energía. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `capacitor series parallel calculator` — 110/mes US/en; KD 0.
  - `capacitor calculator free online`; `capacitor calculator with example`; `capacitor calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Publicación comprobada (2026-10-09):** motor local y 36 copias estáticas; pruebas focales 19/19; suite **1.427/1.427**; `locale:release-check` y `npm run check` pasan (10.260 URLs originales). Build del hub **3.852 URLs**. Chrome EN/AR/JA/RU confirmó circuitos, validación, reset, RTL y consola limpia. PR #67, CI run `37862013320`, merge `dbed4f4b199ee4691d03f9d91888cc7a77c08421`, deploy principal `37862359298` y deploy hub `37862369399` correctos. URLs EN/AR responden HTTP 200; sitemap del hub **3.852 URLs únicas**, 36 variantes. Publicado no implica indexado; no se envió petición manual. No PageSpeed/Lighthouse.

### 292 · 555 Timer Calculator

- [x] **C/F/E/X/L/B/P/S completos — `555-timer-calculator`**
- **Destino:** `https://tools.usefulverse.com/tools/555-timer-calculator/`; otras 35 versiones estáticas en los idiomas del sitio (36 rutas).
- **Demanda:** `555 timer calculator` — 590 búsquedas/mes US/en, KD 23; `555 astable calculator` — 140/mes, KD 17. CPC 0,14 USD (no CPM). Sin llamada nueva a DataForSEO.
- **Función implementada:** Oscilador astable (frecuencia, período, tiempos alto/bajo, duty de salida y fracción de descarga) y monoestable (ancho de pulso aproximado); resistencias en Ω/kΩ/MΩ, condensadores F/mF/μF/nF/pF, ejemplos, copiar y limpiar. Cálculo estático en el navegador, sin API, upload ni procesamiento de servidor.
- **Prueba de aceptación:** 10 kΩ + 10 kΩ + 10 μF → 4,810005 Hz, 207,9 ms, 138,6/69,3 ms y 66,6667%; monoestable 100 kΩ × 10 μF → 1,1 s. Valores inválidos limpian resultados antiguos; >100 kHz añade un aviso localizado para consultar la hoja de datos exacta.
- **Frontera con otras herramientas:** online-timer: circuito integrado no reloj UI. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Fórmulas estimativas, no simulación SPICE. TI documenta tHIGH≈0,693(RA+RB)C, tLOW≈0,693RBC y tMONO≈1,1RC; el aviso también informa que un NE555 típico se recomienda a 100 kHz o menos para limitar distorsión. Ver la [hoja de datos TI NE555](https://www.ti.com/lit/ds/symlink/ne555.pdf); las tolerancias, fugas, temperatura, parasíticos y carga cambian el resultado.
- **Consultas secundarias del mismo propietario:**
  - `555 astable calculator` — 140/mes US/en; KD 17.
  - `555 timer calculator free online`; `555 timer calculator with example`; `555 timer calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Verificación local (2026-10-09):** 36 textos estáticos traducidos automáticamente con el flujo Google Translate autorizado; ecuaciones preservadas y etiquetas localizadas. Metadatos ≤60/160; sin saltos. Gates focales **200/200**, suite global **1.438/1.438**, `locale:release-check` y `npm run check` pasan; sitio principal conserva 10.260 URLs; build separado: **3.924 páginas** (108 × 36 + 36 portadas; 4.085 archivos; 117.681.050 bytes). Chrome EN/AR: astable, monoestable y aviso >100 kHz correctos; árabe RTL a 390 px sin overflow/consola; carga inicial solo HTML/CSS/JS locales. Sin PageSpeed/Lighthouse. Traducción automática comprensible, no validación nativa.
- **Publicación comprobada (2026-10-09):** PR #69 fusionada; workflows principal `37865313492` y hub `37866007189` correctos. URLs EN/AR HTTP 200; sitemap público HTTP 200 con **3.924 URLs únicas** e incluye los 36 idiomas. No se envió solicitud manual de indexación; publicación no implica indexación.

### 310 · Inductor Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `inductor-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/inductor-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `inductance calculator` — 390 búsquedas/mes US/en, KD 6; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Bobinas con fórmulas geométricas aproximadas y número de vueltas
- **Prueba de aceptación específica:** Mayor vueltas aumenta inductancia según método
- **Frontera con otras herramientas:** rlc-circuit-calculator: diseño de bobina no circuito. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `inductor calculator` — 210/mes US/en; KD 35.
  - `inductance calculator free online`; `inductance calculator with example`; `inductance calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 311 · Centripetal Force Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `centripetal-force-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/centripetal-force-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `centripetal force calculator` — 390 búsquedas/mes US/en, KD 9; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Radio, velocidad, frecuencia, aceleración y fuerza
- **Prueba de aceptación específica:** Duplicar velocidad cuadruplica fuerza
- **Frontera con otras herramientas:** torque-calculator: movimiento circular. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `circular motion calculator` — 30/mes US/en; KD 0.
  - `centripetal force calculator free online`; `centripetal force calculator with example`; `centripetal force calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Finanzas matemáticas

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Funciones numéricas puras; flujos monetarios y amortización con moneda/unidades separadas. Tasas/precios manuales; tabla normativa solo con fuente/año. Exportar escenarios sin ejecutar fórmulas de datos no confiables.

**Pruebas adicionales para cada ficha:** Probar tasa cero, plazo cero, importes negativos/inválidos y comparación de escenarios. No red con inputs.

### 006 · Inflation Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `inflation-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/inflation-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `inflation calculator` — 550.000 búsquedas/mes US/en, KD 70; nivel A. CPC 2.87 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Índice CPI oficial estático por año US y tasa manual para otros mercados
- **Prueba de aceptación específica:** Índice de 100 a 110 transforma 100 en 110
- **Frontera con otras herramientas:** roi-cagr-calculator: poder adquisitivo, no retorno nominal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `purchasing power calculator` — 3.600/mes US/en; KD 24.
  - `inflation calculator free online`; `inflation calculator with example`; `inflation calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `inflation calculator` 33.100/mes, KD 78; UK/en `inflation calculator` 60.500/mes, KD 51; AU/en `inflation calculator` 14.800/mes, KD 75; DE/de `inflationsrechner` 14.800/mes, KD 0.

### 007 · Retirement Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `retirement-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/retirement-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `retirement calculator` — 368.000 búsquedas/mes US/en, KD 54; nivel A. CPC 2.64 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Acumulación y retirada, inflación, horizonte y escenarios conservadores
- **Prueba de aceptación específica:** Retirada nula no reduce saldo
- **Frontera con otras herramientas:** compound-interest-calculator: objetivo de jubilación y fase de retirada. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `retirement savings calculator` — 22.200/mes US/en; KD 48.
  - `retirement calculator free online`; `retirement calculator with example`; `retirement calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `retirement calculator` 12.100/mes, KD 47; UK/en `retirement calculator` 8.100/mes, KD 29; AU/en `retirement calculator` 6.600/mes, KD 4; DE/de `rentenrechner` 60.500/mes, KD 35.

### 014 · 401K Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `401k-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/401k-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `401k calculator` — 165.000 búsquedas/mes US/en, KD 36; nivel A. CPC 1.75 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Aportación personal, employer match y vesting configurables; sin tablas fiscales vivas
- **Prueba de aceptación específica:** Match 50% sobre 4000 da 2000
- **Frontera con otras herramientas:** retirement-calculator: reglas de aportación del plan US. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `401k contribution calculator` — 3.600/mes US/en; KD 13.
  - `401k calculator free online`; `401k calculator with example`; `401k calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 024 · Required Minimum Distribution Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `required-minimum-distribution-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/required-minimum-distribution-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `required minimum distribution calculator` — 110.000 búsquedas/mes US/en, KD 22; nivel A. CPC 0.53 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Tabla oficial versionada, edad, saldo y divisor con año visible
- **Prueba de aceptación específica:** Saldo dividido por divisor oficial reproduce ejemplo IRS
- **Frontera con otras herramientas:** retirement-calculator: retirada mínima legal US; verificar fuente antes de publicar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rmd calculator` — 110.000/mes US/en; KD 34.
  - `required minimum distribution calculator free online`; `required minimum distribution calculator with example`; `required minimum distribution calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 027 · Mortgage Affordability Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `mortgage-affordability-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mortgage-affordability-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `how much house can i afford` — 90.500 búsquedas/mes US/en, KD 47; nivel A. CPC 3.26 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Ingreso, deudas, entrada, impuestos y escenarios con desglose mensual
- **Prueba de aceptación específica:** Ingreso cero rechaza; mayor deuda reduce capacidad
- **Frontera con otras herramientas:** loan-calculator: capacidad de compra, no cuota de un préstamo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `mortgage affordability calculator` — 49.500/mes US/en; KD 44.
  - `how much house can i afford free online`; `how much house can i afford with example`; `how much house can i afford no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `how much house can i afford` 2.400/mes, KD 57; UK/en `how much house can i afford` 1.600/mes, KD 32; AU/en `how much house can i afford` 140/mes, KD 45; DE/de `wie viel haus kann ich mir leisten` 3.600/mes, KD 4.

### 029 · Gold Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `gold-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/gold-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `gold calculator` — 74.000 búsquedas/mes US/en, KD 19; nivel A. CPC 3.47 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Peso, quilates o pureza, unidad y precio introducido por usuario; contenido de metal, descuentos y desglose. Sin cotización en directo.
- **Prueba de aceptación específica:** 10 g a 18 quilates equivalen a 7.5 g de oro fino; sin precio no inventar valor monetario.
- **Frontera con otras herramientas:** unit-price-calculator: pureza, quilates y metales, no precio por unidad simple. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `scrap gold calculator` — 40.500/mes US/en; KD 26.
  - `gold calculator free online`; `gold calculator with example`; `gold calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 030 · Auto Loan Refinance Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `auto-loan-refinance-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/auto-loan-refinance-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `auto loan refinance calculator` — 60.500 búsquedas/mes US/en, KD 0; nivel A. CPC 4.05 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Coste restante frente a nueva financiación, comisiones y duración
- **Prueba de aceptación específica:** APR cero y misma duración solo cambia por comisiones
- **Frontera con otras herramientas:** mortgage-refinance-calculator: vehículo, sin puntos ni impuestos inmobiliarios. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `car refinance calculator` — 60.500/mes US/en; KD 0.
  - `auto loan refinance calculator free online`; `auto loan refinance calculator with example`; `auto loan refinance calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `auto loan refinance calculator` 390/mes, KD 13; UK/en `auto loan refinance calculator` 480/mes, KD 10; AU/en `auto loan refinance calculator` 590/mes, KD 14.

### 032 · Mortgage Refinance Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `mortgage-refinance-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mortgage-refinance-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `mortgage refinance calculator` — 60.500 búsquedas/mes US/en, KD 20; nivel A. CPC 6.82 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Préstamo actual y nuevo, gastos, ahorro, amortización y punto de recuperación
- **Prueba de aceptación específica:** Gasto 3000 y ahorro 100 da 30 meses
- **Frontera con otras herramientas:** loan-calculator: comparación de refinanciación con gastos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `refinance break even calculator` — 720/mes US/en; KD 13.
  - `mortgage refinance calculator free online`; `mortgage refinance calculator with example`; `mortgage refinance calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `mortgage refinance calculator` 1.900/mes, KD 35; UK/en `mortgage refinance calculator` 110/mes, KD 36; AU/en `mortgage refinance calculator` 2.400/mes, KD 1; DE/de `umschuldungsrechner` 110/mes, KD 0.

### 038 · Heloc Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `heloc-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/heloc-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `heloc calculator` — 49.500 búsquedas/mes US/en, KD 2; nivel A. CPC 9.43 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Fase de disposición e interés solamente seguida de amortización; límites editables
- **Prueba de aceptación específica:** Saldo 12000 al 10% da 100 de interés mensual
- **Frontera con otras herramientas:** loan-calculator: dos fases de línea de crédito. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `heloc payment calculator` — 27.100/mes US/en; KD 6.
  - `heloc calculator free online`; `heloc calculator with example`; `heloc calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `heloc calculator` 1.900/mes, KD 1; UK/en `heloc calculator` 140/mes, KD 11; AU/en `heloc calculator` 40/mes, KD 6.

### 043 · Social Security Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `social-security-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/social-security-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `social security calculator` — 49.500 búsquedas/mes US/en, KD 60; nivel A. CPC 0.56 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Estimador US con bend points oficiales por año y edad; sin acceso a cuenta personal
- **Prueba de aceptación específica:** Comparar con ejemplos SSA del año seleccionado
- **Frontera con otras herramientas:** pension-calculator: programa público US con fuente y supuestos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `social security benefits calculator` — 40.500/mes US/en; KD 69.
  - `social security calculator free online`; `social security calculator with example`; `social security calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 051 · Options Profit Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `options-profit-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/options-profit-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `options profit calculator` — 33.100 búsquedas/mes US/en, KD 10; nivel A. CPC 5.54 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Payoff de opciones vanilla al vencimiento, prima y estrategias básicas
- **Prueba de aceptación específica:** Call strike 100, subyacente 120, prima 5 da 15 por unidad
- **Frontera con otras herramientas:** stock-profit-calculator: derivados y curvas no cotizaciones. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `options payoff calculator` — 90/mes US/en; KD 9.
  - `options profit calculator free online`; `options profit calculator with example`; `options profit calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `options profit calculator` 6.600/mes, KD 9; UK/en `options profit calculator` 720/mes, KD 6; AU/en `options profit calculator` 480/mes, KD 9.

### 053 · Cpm Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `cpm-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/cpm-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `cpm calculator` — 33.100 búsquedas/mes US/en, KD 19; nivel A. CPC 31.47 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Impresiones, gasto, CPM y coste inverso con escenarios
- **Prueba de aceptación específica:** Gasto 10 y 1000 impresiones da CPM 10
- **Frontera con otras herramientas:** commission-calculator: impresión publicitaria, sin ingresos prometidos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `cost per mille calculator` — 33.100/mes US/en; KD 19.
  - `cpm calculator free online`; `cpm calculator with example`; `cpm calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `cpm calculator` 2.400/mes, KD 16; UK/en `cpm calculator` 3.600/mes, KD 0; AU/en `cpm calculator` 2.900/mes, KD 2.

### 054 · Annuity Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `annuity-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/annuity-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `annuity calculator` — 33.100 búsquedas/mes US/en, KD 32; nivel A. CPC 5.24 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Aportación inicial y pagos periódicos, valor presente y futuro de una anualidad
- **Prueba de aceptación específica:** Interés cero da capital dividido por número de pagos
- **Frontera con otras herramientas:** loan-calculator: flujo de renta, no cuota de deuda. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `annuity payout calculator` — 9.900/mes US/en; KD 23.
  - `annuity calculator free online`; `annuity calculator with example`; `annuity calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `annuity calculator` 2.900/mes, KD 21; UK/en `annuity calculator` 12.100/mes, KD 2; AU/en `annuity calculator` 1.000/mes, KD 24.

### 058 · Dividend Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `dividend-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/dividend-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `dividend calculator` — 27.100 búsquedas/mes US/en, KD 9; nivel A. CPC 3.64 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Participaciones, precio, dividendo, frecuencia y reinversión sin cotizaciones
- **Prueba de aceptación específica:** 100 acciones por dividendo 2 da 200
- **Frontera con otras herramientas:** compound-interest-calculator: acciones y distribuciones. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `dividend reinvestment calculator` — 4.400/mes US/en; KD 8.
  - `dividend calculator free online`; `dividend calculator with example`; `dividend calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `dividend calculator` 3.600/mes, KD 1; UK/en `dividend calculator` 4.400/mes, KD 4; AU/en `dividend calculator` 880/mes, KD 9; DE/de `dividendenrechner` 1.900/mes, KD 0.

### 063 · Net Worth Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `net-worth-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/net-worth-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `net worth calculator` — 27.100 búsquedas/mes US/en, KD 48; nivel A. CPC 1.65 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Activos y pasivos, categorías, evolución local y CSV
- **Prueba de aceptación específica:** Activos 100000 menos pasivos 40000 da 60000
- **Frontera con otras herramientas:** household-budget-planner: balance patrimonial, no gasto mensual. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `personal net worth calculator` — 480/mes US/en; KD 37.
  - `net worth calculator free online`; `net worth calculator with example`; `net worth calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `net worth calculator` 1.900/mes, KD 15; UK/en `net worth calculator` 1.000/mes, KD 33; AU/en `net worth calculator` 1.000/mes, KD 32; DE/de `vermögen berechnen` 70/mes, KD 2.

### 066 · Overtime Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `overtime-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/overtime-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `overtime calculator` — 22.200 búsquedas/mes US/en, KD 7; nivel A. CPC 4.34 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Umbral semanal y multiplicadores editables, horas normales y extraordinarias
- **Prueba de aceptación específica:** 40 normales más 5 a 1.5 y tarifa 20 da 950
- **Frontera con otras herramientas:** time-card-calculator: reglas de recargo, no suma de fichajes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `overtime pay calculator` — 4.400/mes US/en; KD 22.
  - `overtime calculator free online`; `overtime calculator with example`; `overtime calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `overtime calculator` 590/mes, KD 8; UK/en `overtime calculator` 1.300/mes, KD 0; AU/en `overtime calculator` 390/mes, KD 4.

### 076 · Debt To Income Ratio Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `debt-to-income-ratio-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/debt-to-income-ratio-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `debt to income ratio calculator` — 22.200 búsquedas/mes US/en, KD 57; nivel A. CPC 2.3 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Deudas mensuales, ingreso bruto, DTI delantero y total con explicación
- **Prueba de aceptación específica:** 2000 deudas y 5000 ingreso da 40%
- **Frontera con otras herramientas:** mortgage-affordability-calculator: diagnóstico de proporción, no precio de vivienda. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `dti calculator` — 18.100/mes US/en; KD 48.
  - `debt to income ratio calculator free online`; `debt to income ratio calculator with example`; `debt to income ratio calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `debt to income ratio calculator` 720/mes, KD 42; UK/en `debt to income ratio calculator` 320/mes, KD 36; AU/en `debt to income ratio calculator` 170/mes, KD 21.

### 079 · Car Lease Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `car-lease-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/car-lease-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `car lease calculator` — 18.100 búsquedas/mes US/en, KD 31; nivel A. CPC 3.82 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Valor residual, coste capitalizado, money factor, entrada e impuestos manuales
- **Prueba de aceptación específica:** Depreciación 12000 a 36 meses da 333.33 antes de otros costes
- **Frontera con otras herramientas:** loan-calculator: arrendamiento con residual. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `auto lease calculator` — 18.100/mes US/en; KD 36.
  - `car lease calculator free online`; `car lease calculator with example`; `car lease calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `leasingrechner` 1.600/mes, KD 12.

### 080 · Fire Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `fire-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/fire-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `fire calculator` — 18.100 búsquedas/mes US/en, KD 41; nivel A. CPC 2.89 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Gasto anual, tasa de retirada editable y años hasta independencia
- **Prueba de aceptación específica:** Gasto 40000 y 4% da objetivo 1000000
- **Frontera con otras herramientas:** retirement-calculator: capital objetivo de independencia. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `financial independence calculator` — 1.600/mes US/en; KD 34.
  - `fire calculator free online`; `fire calculator with example`; `fire calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 086 · 529 Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `529-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/529-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `529 calculator` — 14.800 búsquedas/mes US/en, KD 10; nivel A. CPC 1.54 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Ahorro educativo, años hasta universidad, inflación de matrícula y becas manuales
- **Prueba de aceptación específica:** Meta 10000 y plazo cero exige 10000 ahora
- **Frontera con otras herramientas:** compound-interest-calculator: brecha educativa y calendario de matrícula. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `college savings calculator` — 4.400/mes US/en; KD 11.
  - `529 calculator free online`; `529 calculator with example`; `529 calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 101 · Reverse Mortgage Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `reverse-mortgage-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/reverse-mortgage-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `reverse mortgage calculator` — 12.100 búsquedas/mes US/en, KD 17; nivel A. CPC 30.95 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Proyección matemática de saldo con anticipos, comisiones e intereses; sin cotización comercial
- **Prueba de aceptación específica:** Anticipo cero e interés cero deja saldo inicial
- **Frontera con otras herramientas:** loan-calculator: saldo creciente, no aprobación ni pagos deudores. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `reverse mortgage balance calculator` — 10/mes US/en; KD —.
  - `reverse mortgage calculator free online`; `reverse mortgage calculator with example`; `reverse mortgage calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 118 · Car Depreciation Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `car-depreciation-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/car-depreciation-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `car depreciation calculator` — 8.100 búsquedas/mes US/en, KD 22; nivel B. CPC 2.54 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Curva de valor por años y kilómetros con tasas elegidas; no precios vivos
- **Prueba de aceptación específica:** 10000 y 10% anual da 9000 tras un año
- **Frontera con otras herramientas:** depreciation-calculator: reventa del vehículo y escenarios no contables. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `vehicle depreciation calculator` — 8.100/mes US/en; KD 23.
  - `car depreciation calculator free online`; `car depreciation calculator with example`; `car depreciation calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `wertverlust auto rechner` 320/mes, KD 100.

### 129 · Bond Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `bond-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/bond-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `bond calculator` — 6.600 búsquedas/mes US/en, KD 10; nivel B. CPC 2.94 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Precio, cupón, vencimiento, YTM numérico y curva precio-rendimiento
- **Prueba de aceptación específica:** Bono a par con cupón 5% tiene YTM 5%
- **Frontera con otras herramientas:** cash-flow-irr-calculator: bonos con cupón y calendario. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `bond yield calculator` — 720/mes US/en; KD 12.
  - `bond calculator free online`; `bond calculator with example`; `bond calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 142 · Stock Profit Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `stock-profit-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/stock-profit-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `stock profit calculator` — 5.400 búsquedas/mes US/en, KD 16; nivel B. CPC 2.95 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Precio compra/venta, comisiones, tamaño y lotes con coste medio
- **Prueba de aceptación específica:** 10 títulos comprados a 20 y vendidos a 30 da 100 antes de gastos
- **Frontera con otras herramientas:** roi-cagr-calculator: transacciones y coste base, no inversión global. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `stock gain calculator` — 720/mes US/en; KD 20.
  - `stock profit calculator free online`; `stock profit calculator with example`; `stock profit calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `aktien gewinn rechner` 210/mes, KD 0.

### 147 · Pension Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `pension-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pension-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pension calculator` — 5.400 búsquedas/mes US/en, KD 31; nivel B. CPC 3.72 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Prestación definida desde sueldo, servicio y factor; renta frente a pago único
- **Prueba de aceptación específica:** 30 años por 2% por 50000 da 30000 anual
- **Frontera con otras herramientas:** retirement-calculator: prestación definida y derechos manuales. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pension lump sum calculator` — 210/mes US/en; KD 9.
  - `pension calculator free online`; `pension calculator with example`; `pension calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 164 · Mortgage Points Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `mortgage-points-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mortgage-points-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `mortgage points calculator` — 3.600 búsquedas/mes US/en, KD 7; nivel B. CPC 4.39 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Comparar pagar puntos frente a intereses, horizonte y amortización
- **Prueba de aceptación específica:** Coste positivo con ahorro cero no se recupera
- **Frontera con otras herramientas:** `loan-calculator` / refinanciación de automóvil: comparar un coste inicial de puntos para hipoteca y amortización a horizonte, no cuotas genéricas ni refinanciación de un vehículo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `discount points calculator` — 3.600/mes US/en; KD 5.
  - `mortgage points calculator free online`; `mortgage points calculator with example`; `mortgage points calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 173 · Savings Goal Calculator

- [x] **C/F/E/X/L/B/P/S completos — `savings-goal-calculator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/savings-goal-calculator/` + 35 variantes localizadas, presentes en el sitemap público. QA funcional y RTL documentados en `docs/growth600/PROGRESS.md`.
- **Demanda:** `savings goal calculator` — 3.600 búsquedas/mes US/en, KD 36; nivel B. CPC 3.72 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resolver aportación o plazo para una meta con fecha y saldo actual
- **Prueba de aceptación específica:** Meta 1200 a 12 meses sin interés da 100 por mes
- **Frontera con otras herramientas:** compound-interest-calculator: objetivo inverso, no proyección genérica. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** cálculo financiero determinista sin dependencia, red ni servidor. APR nominal dividida entre doce, capitalización mensual y aportaciones al inicio/fin del mes declaradas como supuestos; límite de 1.200 meses y entradas acotadas.
- **Consultas secundarias del mismo propietario:**
  - `savings target calculator` — 3.600/mes US/en; KD 36.
  - `savings goal calculator free online`; `savings goal calculator with example`; `savings goal calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `sparziel rechner` 70/mes, KD 18.
- **Cierre (2026-10-09):** aparece en 36 rutas públicas; la muestra meta 1.200/12 meses/0 % devuelve 100 al mes. RTL AR comprobado en 390 px sin overflow ni errores de consola. Sin PageSpeed/Lighthouse ni afirmación de indexación.

### 174 · Severance Pay Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `severance-pay-calculator` (implementación inglesa en curso; no publicada)**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/severance-pay-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `severance pay calculator` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC 1.75 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Escenarios desde años de servicio y semanas por año; estimación normativa opcional para Gran Bretaña, versionada desde 6 de abril de 2026
- **Prueba de aceptación específica:** 10 años por 2 semanas por 500 da 10000
- **Frontera con otras herramientas:** salary-to-hourly-calculator: indemnización, no sueldo periódico. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, ámbito geográfico y fecha visibles. La estimación Great Britain/Gran Bretaña cubre Inglaterra, Escocia y Gales, no Irlanda del Norte; requiere salario semanal promedio en GBP, nacimiento, inicio de empleo y fecha final introducida. Cuenta los años completos hacia atrás desde el final del empleo y aplica 0,5/1/1,5 semanas según la edad al borde más antiguo de cada bloque anual, de modo que un año parcialmente pasado en una banda superior no se ascienda. El resultado no determina la fecha legal pertinente si el preaviso u otras circunstancias la modifican. Aplica mínimo general de 2 años, máximo 20 años, tope semanal £751 y máximo £22.530 bajo reglas desde 6 de abril de 2026. No determina elegibilidad ni modela indemnización contractual, continuidad controvertida, aviso, vacaciones, fiscalidad o circunstancias individuales; enlaza GOV.UK y la sección 162 de la Employment Rights Act 1996. El modo flexible es solo aritmética con supuestos del usuario. Seguir los gates globales; el caso de aceptación no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `redundancy pay calculator` — 70/mes US/en; KD 24.
  - `severance pay calculator free online`; `severance pay calculator with example`; `severance pay calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Avance comprobado (2026-10-08):** catálogo aditivo, motor, modos separados, formulario/controlador accesibles, fuente inglesa, dos FAQs y borradores de los otros idiomas integrados. La ley y los topes se contrastaron con [GOV.UK: statutory redundancy pay](https://www.gov.uk/redundancy-your-rights/redundancy-pay), [guía GOV.UK para empleadores](https://www.gov.uk/staff-redundant/redundancy-pay), [Employment Rights Act 1996, sección 162](https://www.legislation.gov.uk/ukpga/1996/18/section/162) y [Employment Rights (Increase of Limits) Order 2026](https://www.legislation.gov.uk/uksi/2026/310/made). Al revisar, corregí el cálculo: los años completos y sus bandas se cuentan hacia atrás desde el final del empleo, no desde los aniversarios de contratación. Suite focalizada actual: **155/155 aprobadas**, incluyendo el cumpleaños dentro de un bloque, límites, elegibilidad básica, años bisiestos, fechas inválidas, formulario, controlador simulado, contrato de idioma y build. Bundle independiente actual: **5.677 bytes**, bajo 24 KiB y aprobado por el guard local, sin red externa ni código dinámico. Los otros 35 locales siguen marcados `pending-tool-specific-translation` y bloqueados por el release gate. Falta inspección en navegador y traducción específica; no está publicada ni su sitemap enviado.

### 207 · Lifetime Value Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `lifetime-value-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/lifetime-value-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `customer lifetime value calculator` — 2.400 búsquedas/mes US/en, KD 27; nivel B. CPC 8.23 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Ingreso por cliente, margen, retención/churn y LTV por método
- **Prueba de aceptación específica:** Ingreso 100, margen 50%, churn 5% da LTV simple 1000
- **Frontera con otras herramientas:** profit-margin-calculator: retención y economía de clientes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `lifetime value calculator` — 480/mes US/en; KD 30.
  - `customer lifetime value calculator free online`; `customer lifetime value calculator with example`; `customer lifetime value calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 231 · Cash On Cash Return Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `cash-on-cash-return-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/cash-on-cash-return-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `cash on cash return calculator` — 1.600 búsquedas/mes US/en, KD 1; nivel B. CPC 3.09 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Flujo anual y efectivo aportado, hipoteca y desembolso inicial
- **Prueba de aceptación específica:** Flujo 6000 por inversión 60000 da 10%
- **Frontera con otras herramientas:** cap-rate-calculator: capital propio apalancado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `cash on cash calculator` — 1.600/mes US/en; KD 9.
  - `cash on cash return calculator free online`; `cash on cash return calculator with example`; `cash on cash return calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 239 · Forex Position Size Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `forex-position-size-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/forex-position-size-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `forex position size calculator` — 1.600 búsquedas/mes US/en, KD 13; nivel B. CPC 3.9 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Balance, riesgo, stop, tamaño de pip y conversión manual
- **Prueba de aceptación específica:** Riesgo 100 con pérdida 10 por unidad da 10 unidades
- **Frontera con otras herramientas:** stock-profit-calculator: dimensionar riesgo antes de operar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `forex risk calculator` — 390/mes US/en; KD 27.
  - `forex position size calculator free online`; `forex position size calculator with example`; `forex position size calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 242 · Lease Vs Buy Car Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `lease-vs-buy-car-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/lease-vs-buy-car-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `lease vs buy car calculator` — 1.300 búsquedas/mes US/en, KD 0; nivel B. CPC 1.02 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Coste total comparado, valor de reventa, kilometraje y mantenimiento
- **Prueba de aceptación específica:** Todos los costes cero dan empate
- **Frontera con otras herramientas:** rent-vs-buy-calculator: vehículos y límites de kilometraje. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `car lease vs buy calculator` — 1.300/mes US/en; KD 0.
  - `lease vs buy car calculator free online`; `lease vs buy car calculator with example`; `lease vs buy car calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `leasing oder kaufen rechner` 140/mes, KD 0.

### 268 · Effective Interest Rate Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `effective-interest-rate-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/effective-interest-rate-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `effective interest rate calculator` — 880 búsquedas/mes US/en, KD 7; nivel C. CPC 14.04 USD (no CPM).
- **Función mínima y ampliaciones útiles:** APR nominal, frecuencias, APY y conversión inversa
- **Prueba de aceptación específica:** 12% mensual compuesto da 12.6825% APY
- **Frontera con otras herramientas:** compound-interest-calculator: equivalencia de tasas, sin saldo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `apr to apy calculator` — 880/mes US/en; KD 1.
  - `effective interest rate calculator free online`; `effective interest rate calculator with example`; `effective interest rate calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `effektivzins rechner` 90/mes, KD 0.

### 284 · Roth Vs Traditional Calculator

- [x] **C/F/E/X/L/B/P/S completos — `roth-vs-traditional-calculator`**
- **Publicado:** `https://tools.usefulverse.com/tools/roth-vs-traditional-calculator/` y otras 35 versiones con los prefijos del anexo.
- **Demanda:** `roth ira vs traditional ira calculator` — 590 búsquedas/mes US/en, KD 0; nivel C. CPC 2.61 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Comparar tasas actuales y futuras manuales y crecimiento después de impuestos
- **Prueba de aceptación específica:** Tasas iguales y supuestos iguales comparables
- **Frontera con otras herramientas:** 401k-calculator: tratamiento fiscal comparado, no match. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `roth vs traditional calculator` — 320/mes US/en; KD 5.
  - `roth ira vs traditional ira calculator free online`; `roth ira vs traditional ira calculator with example`; `roth ira vs traditional ira calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Avance publicado (2026-10-09):** comparación local con aportaciones al final de año y mismo presupuesto antes de impuestos, tasas introducidas por usuario y nota expresa de que no asesora ni modela reglas de elegibilidad/contribución. 36 traducciones estáticas; PR #62 fusionada en `0e781e5`; validación PR 37851536013 y publicación principal/hub 37851994699 correctas. EN/ES/AR responden HTTP 200; sitemap del hub tiene 3.672 `<loc>` (101 × 36 + 36 portadas); sitemap principal conserva 10.260. No se envió manualmente en Search Console ni se comprobó indexación. No se ejecutó PageSpeed/Lighthouse. Sigue la #285.

### 301 · Investment Allocation Calculator

- [x] **C/F/E/X/L/B/P/S completos — `investment-allocation-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/investment-allocation-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `portfolio allocation calculator` — 390 búsquedas/mes US/en, KD 0; nivel C. CPC 6.1 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Distribuir aportación y rebalancear cartera por porcentajes objetivo
- **Prueba de aceptación específica:** 60% de 10000 da 6000 y pesos suman 100
- **Frontera con otras herramientas:** household-budget-planner: cartera y rebalanceo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `investment allocation calculator` — 20/mes US/en; KD 0.
  - `portfolio allocation calculator free online`; `portfolio allocation calculator with example`; `portfolio allocation calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

- **Publicado (2026-10-09):** PR #73 integrada; workflow principal `37873877741` y workflow de publicación independiente del hub `37874322931` correctos. EN/AR HTTP 200; sitemap público con **4.068 URLs únicas** (112 herramientas × 36 idiomas + 36 portadas). No se envió indexación manual ni se afirma indexación.

### 315 · Customer Acquisition Cost Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `customer-acquisition-cost-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/customer-acquisition-cost-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `customer acquisition cost calculator` — 390 búsquedas/mes US/en, KD 26; nivel C. CPC 5.61 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Gastos de captación, clientes nuevos, coste y payback con margen
- **Prueba de aceptación específica:** 1000 de gasto y 10 clientes da CAC 100
- **Frontera con otras herramientas:** lifetime-value-calculator: adquisición, no valor acumulado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `cac calculator` — 320/mes US/en; KD 0.
  - `customer acquisition cost calculator free online`; `customer acquisition cost calculator with example`; `customer acquisition cost calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 320 · Rental Yield Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `rental-yield-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rental-yield-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rental yield calculator` — 320 búsquedas/mes US/en, KD 19; nivel C. CPC 3.63 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Rentabilidad bruta/neta de alquiler, vacancia y gastos anuales
- **Prueba de aceptación específica:** 12000 de renta y precio 200000 da 6% bruto
- **Frontera con otras herramientas:** rent-vs-buy-calculator: inversor arrendador, no residencia habitual. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rental property yield calculator` — 10/mes US/en; KD 13.
  - `rental yield calculator free online`; `rental yield calculator with example`; `rental yield calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Matemática y estadística

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Parser de expresiones/BigInt o motor numérico/simbólico local según contrato, con gramática y rango declarados. Cálculo puro, pasos verificables y worker para operaciones largas.

**Pruebas adicionales para cada ficha:** Contrastar ejemplo, identidad/invariante y caso singular/fuera de dominio; tolerancia documentada. No eval.

### 092 · Radical Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `radical-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/radical-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `square root simplifier` — 12.100 búsquedas/mes US/en, KD 0; nivel A. CPC 1.52 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Simplificación exacta de radicales y racionalización
- **Prueba de aceptación específica:** Raíz de72 da6 raíz de2
- **Frontera con otras herramientas:** scientific-calculator: resultado simbólico exacto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `radical calculator` — 6.600/mes US/en; KD 0.
  - `square root simplifier free online`; `square root simplifier with example`; `square root simplifier no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 095 · Limit Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `limit-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/limit-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `limit calculator` — 12.100 búsquedas/mes US/en, KD 7; nivel A. CPC 0.37 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Límites por reglas y evaluación, laterales e infinito para expresiones soportadas
- **Prueba de aceptación específica:** sin(x)/x al0 da1
- **Frontera con otras herramientas:** polynomial-derivative-calculator: límites no derivadas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `limit solver` — 1.300/mes US/en; KD 1.
  - `limit calculator free online`; `limit calculator with example`; `limit calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `grenzwert rechner` 320/mes, KD 8.

### 096 · Circle Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `circle-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/circle-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `circle calculator` — 12.100 búsquedas/mes US/en, KD 8; nivel A. CPC 0.67 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Radio, diámetro, área, perímetro, arcos y segmentos
- **Prueba de aceptación específica:** Radio1 da área pi y perímetro2pi
- **Frontera con otras herramientas:** volume-calculator: geometría plana circular. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `circle area circumference calculator` — sin métrica obtenida; no atribuir volumen.
  - `circle calculator free online`; `circle calculator with example`; `circle calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 115 · Rref Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `rref-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rref-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rref calculator` — 8.100 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Forma escalonada reducida y operaciones fila por fila
- **Prueba de aceptación específica:** Matriz identidad queda identidad
- **Frontera con otras herramientas:** matrix-calculator: reducción y pivotes no determinante. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `row reduction calculator` — 1.600/mes US/en; KD 9.
  - `rref calculator free online`; `rref calculator with example`; `rref calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 123 · Inequality Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `inequality-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/inequality-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `inequality calculator` — 6.600 búsquedas/mes US/en, KD 0; nivel B. CPC 0.46 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Inecuaciones lineales/cuadráticas, intervalos y recta con extremos abiertos
- **Prueba de aceptación específica:** 2x mayor que 6 da x mayor que3
- **Frontera con otras herramientas:** equation-solver: conjuntos intervalares no raíces. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `inequality solver` — 1.900/mes US/en; KD 9.
  - `inequality calculator free online`; `inequality calculator with example`; `inequality calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 124 · Histogram Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `histogram-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/histogram-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `histogram maker` — 6.600 búsquedas/mes US/en, KD 0; nivel B. CPC 5.41 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Bins editables, frecuencias, normalización y exportación
- **Prueba de aceptación específica:** Cada valor entra en exactamente un intervalo
- **Frontera con otras herramientas:** chart-maker: agrupar distribución, no graficar categorías. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `histogram calculator` — 480/mes US/en; KD 0.
  - `histogram maker free online`; `histogram maker with example`; `histogram maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 128 · Eigenvalue Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `eigenvalue-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/eigenvalue-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `eigenvalue calculator` — 6.600 búsquedas/mes US/en, KD 3; nivel B. CPC 0.08 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Autovalores/autovectores y verificación A v=lambda v
- **Prueba de aceptación específica:** Diagonal2,3 devuelve2,3
- **Frontera con otras herramientas:** matrix-calculator: descomposición espectral no inversa. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `eigenvector calculator` — 2.400/mes US/en; KD 0.
  - `eigenvalue calculator free online`; `eigenvalue calculator with example`; `eigenvalue calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 136 · Absolute Value Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `absolute-value-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/absolute-value-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `absolute value calculator` — 5.400 búsquedas/mes US/en, KD 3; nivel B. CPC 0.53 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Ecuaciones e inecuaciones de valor absoluto con representación por tramos
- **Prueba de aceptación específica:** Abs(x)=3 da menos3 y3
- **Frontera con otras herramientas:** inequality-calculator: restricción de valor absoluto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `absolute value equation calculator` — 210/mes US/en; KD 0.
  - `absolute value calculator free online`; `absolute value calculator with example`; `absolute value calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 141 · Differential Equation Solver

- [ ] **C/F/E/X/L/B/P/S completos — `differential-equation-solver`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/differential-equation-solver/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `differential equation solver` — 5.400 búsquedas/mes US/en, KD 15; nivel B. CPC 0.97 USD (no CPM).
- **Función mínima y ampliaciones útiles:** ODE de primer orden y aproximación RK4, condición inicial y gráfico
- **Prueba de aceptación específica:** y'=y con y0=1 aproxima e^x
- **Frontera con otras herramientas:** polynomial-integral-calculator: ecuaciones diferenciales con estado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `ode solver calculator` — 10/mes US/en; KD —.
  - `differential equation solver free online`; `differential equation solver with example`; `differential equation solver no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 144 · Prime Factorization Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `prime-factorization-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/prime-factorization-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `prime factorization calculator` — 5.400 búsquedas/mes US/en, KD 26; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Descomponer enteros en primos con pasos y exponentes
- **Prueba de aceptación específica:** 360 da 2^3 por 3^2 por 5
- **Frontera con otras herramientas:** prime-number-checker y polynomial-factorization: factores enteros. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `prime factors calculator` — 5.400/mes US/en; KD 28.
  - `prime factorization calculator free online`; `prime factorization calculator with example`; `prime factorization calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `primfaktorzerlegung rechner` 590/mes, KD 0.

### 152 · Rational Expression Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `rational-expression-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rational-expression-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rational expression simplifier` — 4.400 búsquedas/mes US/en, KD 0; nivel B. CPC 2.2 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Simplificar cocientes polinómicos, factores y restricciones de dominio
- **Prueba de aceptación específica:** x/x da 1 solo si x distinto de cero
- **Frontera con otras herramientas:** polynomial-factorization-calculator: cocientes y exclusiones. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rational expression calculator` — 390/mes US/en; KD 0.
  - `rational expression simplifier free online`; `rational expression simplifier with example`; `rational expression simplifier no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 156 · Modulo Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `modulo-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/modulo-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `modulo calculator` — 4.400 búsquedas/mes US/en, KD 16; nivel B. CPC 0.87 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resto euclídeo, dividendos negativos y congruencia
- **Prueba de aceptación específica:** Menos 7 mod 3 da 2 con regla euclídea
- **Frontera con otras herramientas:** long-division-calculator: aritmética modular explícita. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `mod calculator` — 4.400/mes US/en; KD 53.
  - `modulo calculator free online`; `modulo calculator with example`; `modulo calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 162 · Polynomial Long Division Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `polynomial-long-division-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/polynomial-long-division-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `polynomial long division calculator` — 3.600 búsquedas/mes US/en, KD 0; nivel B. CPC 0.38 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cociente y resto de polinomios con pasos y recomposición
- **Prueba de aceptación específica:** x^2 menos1 entre x menos1 da x+1
- **Frontera con otras herramientas:** long-division-calculator: polinomios, no enteros. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `polynomial division calculator` — 2.400/mes US/en; KD 0.
  - `polynomial long division calculator free online`; `polynomial long division calculator with example`; `polynomial long division calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 165 · Trapezoid Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `trapezoid-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/trapezoid-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `trapezoid area calculator` — 3.600 búsquedas/mes US/en, KD 10; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Bases, altura, lados, área y croquis
- **Prueba de aceptación específica:** Bases4,6 y altura3 da área15
- **Frontera con otras herramientas:** `square-footage-calculator` resuelve área rectangular; esta herramienta resuelve el área de un trapecio desde sus dos bases paralelas y altura, y además deriva lados/perímetro según el desplazamiento de la base superior. No existe un `polygon-calculator` protegido en el catálogo actual. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `trapezoid calculator` — 2.400/mes US/en; KD 0.
  - `trapezoid area calculator free online`; `trapezoid area calculator with example`; `trapezoid area calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 175 · Divisibility Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `divisibility-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/divisibility-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `divisibility calculator` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Comprobar divisibilidad y explicar reglas por divisor
- **Prueba de aceptación específica:** 123 divisible por 3, no por 2
- **Frontera con otras herramientas:** gcd-lcm-calculator: criterios de divisibilidad, no MCD. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `divisibility rules calculator` — 2.900/mes US/en; KD 0.
  - `divisibility calculator free online`; `divisibility calculator with example`; `divisibility calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Avance comprobado (2026-10-08):** motor exacto local, formulario/controlador con validación, cocientes/restos, reglas comunes, ejemplo, preset de divisores, copia y limpieza de resultados obsoletos. La suite focalizada pasa **157/157**. El bundle minificado es de **3.466 bytes**. Solo inglés está listo; 35 idiomas siguen bloqueados como borradores. Sin inspección visual real, despliegue ni sitemap actualizado. Recuento: **78/323** con implementación inglesa; 245 filas restantes incluyendo una duplicada que se debe sustituir.

### 176 · Number Line Graphing Tool

- [ ] **C/F/E/X/L/B/P/S completos — `number-line-graphing-tool`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/number-line-graphing-tool/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `number line generator` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC 4.67 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Dibujar intervalos, puntos, fracciones y exportar
- **Prueba de aceptación específica:** Intervalo(1,3] muestra extremos correcto
- **Frontera con otras herramientas:** inequality-calculator: dibujo desde datos, no resolver desigualdad. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `number line graphing tool` — sin métrica obtenida; no atribuir volumen.
  - `number line generator free online`; `number line generator with example`; `number line generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Avance comprobado (2026-10-08):** parser/formulario/controlador inglés para intervalos, puntos, fracciones y extremos infinitos abiertos; diagrama SVG accesible con círculos abiertos/cerrados y descarga del SVG. Suite focalizada conjunta con la candidata anterior: **163/163** aprobadas. Bundle minificado: **4.888 bytes**. Los otros 35 locales siguen bloqueados como borradores; faltan QA visual, traducciones específicas y publicación. Recuento: **79/323** con implementación inglesa; quedan 244 filas, incluida una duplicada por sustituir.

### 196 · Laplace Transform Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `laplace-transform-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/laplace-transform-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `laplace transform calculator` — 2.400 búsquedas/mes US/en, KD 1; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Transformada e inversa desde gramática acotada y tabla licenciada
- **Prueba de aceptación específica:** Transformada de1 da1/s
- **Frontera con otras herramientas:** polynomial-integral-calculator: dominio s no integrales corrientes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `inverse laplace calculator` — 1.900/mes US/en; KD 7.
  - `laplace transform calculator free online`; `laplace transform calculator with example`; `laplace transform calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 200 · Vector Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `vector-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/vector-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `vector calculator` — 2.400 búsquedas/mes US/en, KD 5; nivel B. CPC 3.57 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Norma, producto escalar/vectorial, proyección y ángulo
- **Prueba de aceptación específica:** Ejes x e y dan producto escalar0 y vector z
- **Frontera con otras herramientas:** coordinate-geometry-calculator: vectores 2D/3D. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** no requiere tablas, normas por país ni datos versionados: es álgebra vectorial dimensional. Tratar unidades como valores compatibles introducidos por la persona y hacer explícita esa condición; el cálculo debe seguir local, acotado y comprobado con casos 2D/3D y vectores nulos.
- **Consultas secundarias del mismo propietario:**
  - `vector operations calculator` — 10/mes US/en; KD 9.
  - `vector calculator free online`; `vector calculator with example`; `vector calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Avance de implementación (2026-10-08):** herramienta inglesa integrada en el catálogo aditivo, formulario, controlador local, FAQs, contrato de copy y pruebas del build. Incluye suma/resta, producto escalar/vectorial (en 2D indica su componente z con signo), magnitudes, normalización, ángulo en grados y proyección. Componentes limitados a ±1.000.000.000; rechaza entradas incompletas, resultados no finitos y operaciones no definidas con el vector cero. No usa datos, APIs ni servicios de servidor. Suite focalizada: **158/158 aprobadas**; controlador minificado: **3.896 bytes**, aceptado por `assertLocalController` bajo el límite de 24 KiB. Los otros 35 idiomas siguen como borradores bloqueados; falta QA visual real y publicación. Recuento de implementaciones inglesas: **81/323**.

### 202 · Cubic & Quartic Equation Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `cubic-quartic-equation-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/cubic-quartic-equation-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `cubic equation calculator` — 2.400 búsquedas/mes US/en, KD 7; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Raíces cúbicas/cuarticas y multiplicidades con residuos numéricos
- **Prueba de aceptación específica:** x³ − 1 tiene raíz real 1, multiplicidad 1 y residuo próximo a cero.
- **Frontera con otras herramientas:** equation-solver: polinomios de grado3-4. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** resolver raíces reales numéricamente mediante aislamiento por puntos críticos y bisección acotada; no anunciar raíces complejas, factorización simbólica ni certeza formal. Limitar coeficientes y descartar polinomios mal condicionados; mostrar residuo y límites visibles.
- **Consultas secundarias del mismo propietario:**
  - `polynomial roots calculator` — 390/mes US/en; KD 0.
  - `cubic equation calculator free online`; `cubic equation calculator with example`; `cubic equation calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Avance de implementación (2026-10-08):** motor real local para grado 3/4, raíces distintas ordenadas, multiplicidad aproximada y residuo absoluto; ejemplo `x³−1`, cuártica con cuatro raíces, raíces dobles/triples y caso sin raíces reales. Formulario accesible cambia entre cúbica/cuártica y deshabilita el coeficiente principal extra en modo cúbico; resultados se insertan como texto y limpian al cambiar entradas. Coeficientes acotados a ±1.000.000; exige coeficiente líder no nulo y ratio mínimo 1e−12. 161/161 pruebas focalizadas aprobadas y otros 200 polinomios deterministas verificados; bundle 4.461 bytes, aceptado por `assertLocalController` (<24 KiB, sin red/código dinámico). Copy inglés aprobado, 35 idiomas siguen como borradores bloqueados; falta QA visual, traducción completa, publicación y sitemap. Recuento inglés: 82/323.

### 204 · Complex Number Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `complex-number-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/complex-number-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `complex number calculator` — 2.400 búsquedas/mes US/en, KD 10; nivel B. CPC 0.78 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Suma, división, polar/cartesiano, módulo, argumento y raíces
- **Prueba de aceptación específica:** i por i da menos1
- **Frontera con otras herramientas:** scientific-calculator: números complejos y plano complejo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `complex calculator` — 720/mes US/en; KD 3.
  - `complex number calculator free online`; `complex number calculator with example`; `complex number calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `komplexe zahlen rechner` 390/mes, KD 0.
- **Avance de implementación (2026-10-08):** motor local para operaciones rectangulares, división numéricamente estable, módulo/argumento principal, conversiones polar-cartesiano en grados/radianes y raíces 2–12. Aceptación `i × i = −1`; inputs y resultados acotados, división por cero y argumento de cero informados con errores específicos. Formulario adaptable por operación, resultados con `textContent` y estado accesible; sin API ni subida. Pruebas focalizadas de lógica/controlador/formulario/catálogo/localización y build de contrato aprobadas. Copy inglés aprobado. Los otros 35 idiomas son borradores estructurales no traducidos, la verificación de bundle final requiere instalar la dependencia fijada ausente en el clon y la revisión visual de navegador está pendiente. **No publicada; no añadida al sitemap ni notificada a buscadores.** Ver `docs/growth600/PROGRESS.md`.

### 208 · Polar Graphing Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `polar-graphing-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/polar-graphing-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `polar graphing calculator` — 1.900 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Radio por ángulo, puntos polares y gráficos exportables
- **Prueba de aceptación específica:** r=1 da círculo unitario
- **Frontera con otras herramientas:** parametric-equation-calculator: representación polar dedicada. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `polar equation graphing calculator` — 1.900/mes US/en; KD 0.
  - `polar graphing calculator free online`; `polar graphing calculator with example`; `polar graphing calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 209 · Boolean Algebra Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `boolean-algebra-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/boolean-algebra-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `boolean algebra calculator` — 1.900 búsquedas/mes US/en, KD 0; nivel B. CPC 3.08 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Simplificación lógica y Karnaugh con equivalencia verificable
- **Prueba de aceptación específica:** A OR NOT A da verdadero
- **Frontera con otras herramientas:** truth-table-generator: minimizar circuitos, no enumerar tabla. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `boolean simplifier` — 1.600/mes US/en; KD 0.
  - `boolean algebra calculator free online`; `boolean algebra calculator with example`; `boolean algebra calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 226 · Stem And Leaf Plot Generator

- [ ] **C/F/E/X/L/B/P/S completos — `stem-and-leaf-plot-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/stem-and-leaf-plot-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `stem and leaf plot generator` — 1.600 búsquedas/mes US/en, KD 0; nivel B. CPC 4.84 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Organizar datos, claves, hojas dobles y exportación
- **Prueba de aceptación específica:** 12,13,21 da tallos1 y2
- **Frontera con otras herramientas:** chart-maker: representación específica no barras/líneas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `stem leaf calculator` — 20/mes US/en; KD 0.
  - `stem and leaf plot generator free online`; `stem and leaf plot generator with example`; `stem and leaf plot generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 227 · Box Plot Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `box-plot-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/box-plot-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `box plot calculator` — 1.600 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cuartiles, IQR, outliers y múltiples muestras con método indicado
- **Prueba de aceptación específica:** 1,2,3,4,5 tiene mediana3
- **Frontera con otras herramientas:** standard-deviation-calculator: distribución robusta y gráfico de cajas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `box and whisker plot calculator` — 720/mes US/en; KD 0.
  - `box plot calculator free online`; `box plot calculator with example`; `box plot calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 236 · Statistical Power Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `statistical-power-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/statistical-power-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `power analysis calculator` — 1.600 búsquedas/mes US/en, KD 9; nivel B. CPC 3.08 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Potencia prospectiva para diseños acotados y tamaños de efecto
- **Prueba de aceptación específica:** Mayor n aumenta potencia en mismo diseño
- **Frontera con otras herramientas:** sample-size-calculator: planificación de experimento no encuesta. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `statistical power calculator` — 720/mes US/en; KD 17.
  - `power analysis calculator free online`; `power analysis calculator with example`; `power analysis calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 243 · Fisher Exact Test Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `fisher-exact-test-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/fisher-exact-test-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `fisher exact test calculator` — 1.300 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Tabla2x2, probabilidades exactas, alternativas y odds ratio
- **Prueba de aceptación específica:** Tabla simétrica no evidencia de asociación
- **Frontera con otras herramientas:** statistical-test-calculator: exacta, no chi-cuadrado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `fisher test 2x2 calculator` — sin métrica obtenida; no atribuir volumen.
  - `fisher exact test calculator free online`; `fisher exact test calculator with example`; `fisher exact test calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 247 · Taylor Series Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `taylor-series-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/taylor-series-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `taylor series calculator` — 1.300 búsquedas/mes US/en, KD 5; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Polinomio de Taylor, centro, orden y error en intervalo
- **Prueba de aceptación específica:** Exp(x) orden2 en0 da1+x+x²/2
- **Frontera con otras herramientas:** sequence-calculator: expansión de funciones no progresión. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `maclaurin series calculator` — 260/mes US/en; KD 2.
  - `taylor series calculator free online`; `taylor series calculator with example`; `taylor series calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 255 · Effect Size Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `effect-size-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/effect-size-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `effect size calculator` — 1.000 búsquedas/mes US/en, KD 8; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cohen d/Hedges g, tamaños y desviaciones de dos muestras
- **Prueba de aceptación específica:** Medias iguales dan d0
- **Frontera con otras herramientas:** statistical-test-calculator: magnitud no contraste. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `cohens d calculator` — sin métrica obtenida; no atribuir volumen.
  - `effect size calculator free online`; `effect size calculator with example`; `effect size calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 261 · Ellipse Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `ellipse-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/ellipse-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `ellipse area calculator` — 880 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Área, focos, excentricidad y perímetro aproximado con método
- **Prueba de aceptación específica:** Semiejes3,2 dan área6pi
- **Frontera con otras herramientas:** circle-calculator: elipse no círculo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `ellipse calculator` — 590/mes US/en; KD 5.
  - `ellipse area calculator free online`; `ellipse area calculator with example`; `ellipse area calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 262 · Mann Whitney U Test Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `mann-whitney-u-test-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mann-whitney-u-test-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `mann whitney u test calculator` — 880 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Prueba no paramétrica dos muestras, empates, método y tamaño efecto
- **Prueba de aceptación específica:** Muestras idénticas dan resultado no significativo
- **Frontera con otras herramientas:** statistical-test-calculator: prueba ordinal no t/chi/ANOVA. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `wilcoxon rank sum calculator` — 20/mes US/en; KD 0.
  - `mann whitney u test calculator free online`; `mann whitney u test calculator with example`; `mann whitney u test calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 263 · Linear Programming Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `linear-programming-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/linear-programming-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `simplex method calculator` — 880 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Objetivo lineal, restricciones2D y simplex acotado con explicación
- **Prueba de aceptación específica:** Max x+y con x+y menor o igual5 da5
- **Frontera con otras herramientas:** system-of-equations-calculator: optimización no resolver igualdades. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `linear programming calculator` — 320/mes US/en; KD 0.
  - `simplex method calculator free online`; `simplex method calculator with example`; `simplex method calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 285 · Polygon Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `polygon-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/polygon-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `polygon calculator` — 590 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** N lados, ángulos, apotema, área y perímetro de regulares
- **Prueba de aceptación específica:** Hexágono lado1 da perímetro6
- **Frontera con otras herramientas:** triangle-calculator: polígonos N mayor o igual4. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `regular polygon calculator` — 590/mes US/en; KD 0.
  - `polygon calculator free online`; `polygon calculator with example`; `polygon calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 293 · Fourier Series Calculator

- [x] **C/F/E/X/L/B/P/S completos — `fourier-series-calculator`**
- **Publicado:** PR #70; commit `69c50b13b7af7682940be358d75dce19fb07f69b`; pipelines `37867472931` (sitio principal) y `37867798312` (hub); 36 versiones y sitemap público con 3.960 URLs únicas verificado. Publicado no equivale a indexado.
- **Demanda:** `fourier series calculator` — 480 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Coeficientes periódicos numéricos, armónicos y reconstrucción
- **Prueba de aceptación específica:** Señal constante tiene solo DC
- **Frontera con otras herramientas:** audio-spectrogram: funciones analíticas, no sonido. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Avance verificado (2026-10-09):** motor numérico en navegador para muestras uniformes, componente DC, coeficientes reales seno/coseno, amplitud/fase, reconstrucción y error RMS; 4–128 datos, amplitud y periodo acotados, frecuencia por unidad temporal y armónicos por debajo de Nyquist. Aceptación señal constante = DC únicamente; sin audio, CAS, subida, API ni cálculo servidor. SVG accesible, copy localizado y mensajes de error que eliminan resultados obsoletos. Suite focal y regresión **1.447/1.447**; `locale:release-check`, `npm run check` y auditoría de 36 copias pasan. Bundle minificado **7.365 bytes** (<24 KiB). Build: **3.960 páginas** (109 × 36 + 36 portadas). Chrome EN/AR cubre coeficientes, señal constante, armónicos cero, dígitos árabes, error, RTL y consola/red. 36 traducciones automáticas estáticas; no revisión nativa. Rutas EN/AR y sitemap público verificados tras PR #70 y los workflows registrados en `PROGRESS.md`. Sin PageSpeed/Lighthouse.
- **Consultas secundarias del mismo propietario:**
  - `fourier coefficients calculator` — 480/mes US/en; KD 0.
  - `fourier series calculator free online`; `fourier series calculator with example`; `fourier series calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 299 · Modular Inverse Calculator

- [ ] **C/F/E/X/L/B completos; P/S pendientes — `modular-inverse-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/modular-inverse-calculator/`; otras 35 versiones con los prefijos del anexo.
- **Demanda:** `modular inverse calculator` — 480 búsquedas/mes US/en, KD 11; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Algoritmo de Euclides extendido, pasos y existencia
- **Prueba de aceptación específica:** Inverso de 3 módulo 7 da 5
- **Frontera con otras herramientas:** modulo-calculator: resolver inverso no resto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Motor local con `BigInt`; módulo ≥2 y entradas dentro de ±10¹². Muestra inverso solo si mcd=1; no compite con una calculadora de resto. Sin servidor ni API.
- **Avance (2026-10-09):** suite completa 1.456/1.456, check de locales, build de 3.996 rutas (110 × 36 + 36 portadas); aceptación 3 mod 7 = 5 y no-inverso 6 mod 9; Chrome EN/AR y RTL confirmados. Traducción automática estática, no revisión nativa. Pendientes PR/CI/despliegue/sitemap público.
- **Consultas secundarias del mismo propietario:**
  - `multiplicative inverse modulo calculator` — 480/mes US/en; KD 11.
  - `modular inverse calculator free online`; `modular inverse calculator with example`; `modular inverse calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 300 · A B Test Calculator

- [x] **C/F/E/X/L/B/P/S completos — `a-b-test-calculator`**
- **Publicado:** `https://tools.usefulverse.com/tools/a-b-test-calculator/`; otras 35 versiones con los prefijos del anexo.
- **Demanda:** `a b test calculator` — 480 búsquedas/mes US/en, KD 55; nivel C. CPC 27.22 USD (no CPM).
- **Función entregada:** tasas y comparación entre dos grupos independientes; diferencia absoluta y lift relativo; intervalos Wilson/Newcombe; prueba z bilateral agrupada, explicación de α=.05, ejemplos, manejo accesible de errores y limitaciones estadísticas. Sin servidor ni llamadas de red.
- **Pruebas de aceptación:** grupos idénticos muestran diferencia 0; 500/30 vs 500/40 da 6%, 8%, +2 pp y p≈0,2152 (no significativo al 5%); conversiones superiores a visitas se rechazan y limpian resultado anterior.
- **Publicado (2026-10-09):** suite completa **1.464/1.464**, `npm run locale:release-check`, `npm run check` y gates de catálogo/formulario/build pasan; 36 traducciones estáticas automáticas; build local 4.032 rutas (111 × 36 + 36 portadas), 4.196 archivos, 120.681.277 bytes. Chrome EN/AR y RTL verificados, sin peticiones externas. PR #72, CI `37871295972`, despliegue principal `37871634054` y publicación del hub `37872370399` correctos. EN/ES/AR HTTP 200; sitemap público con 4.032 URLs únicas. Traducción automática, no revisión nativa. No PageSpeed/Lighthouse ni indexación manual.
- **Frontera con otras herramientas:** conversion-rate-calculator: inferencia, no tasa aislada. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `ab testing significance calculator` — 50/mes US/en; KD 0.
  - `a b test calculator free online`; `a b test calculator with example`; `a b test calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 302 · Repeating Decimal to Fraction Calculator

- [x] **C/F/E/X/L/B/P/S completos — `repeating-decimal-to-fraction`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/repeating-decimal-to-fraction/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `repeating decimal to fraction calculator` — 390 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Decimales periódicos exactos y demostración con periodo configurable
- **Prueba de aceptación específica:** 0.333 periódico da1/3
- **Frontera con otras herramientas:** fraction-calculator: periódico simbólico, no decimal finito. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `repeating decimal to fraction calculator free online`; `repeating decimal to fraction calculator with example`; `repeating decimal to fraction calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

- **Publicado (2026-10-09):** lógica exacta con `BigInt`, 36 copias estáticas, PR #74 integrada (`3e8430a`), CI y publicación del hub `37875699978` correctos. Sitemap público HTTP 200 con 4.104 URLs únicas y rutas EN/AR HTTP 200. No se afirma indexación.

### 303 · Parametric Equation Calculator

- [x] **C/F/E/X/L/B/P/S completos — `parametric-equation-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/parametric-equation-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `parametric graphing calculator` — 390 búsquedas/mes US/en, KD 0; nivel C. CPC sin dato documentado en el registro; no es CPM.
- **Función mínima y ampliaciones útiles:** Curvas x(t), y(t), rango y puntos con exportación
- **Prueba de aceptación específica:** cos(t), sin(t) dibuja círculo unitario
- **Frontera con otras herramientas:** function-grapher: curva paramétrica no y=f(x). Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `parametric equation calculator` — 260/mes US/en; KD 14.
  - `parametric graphing calculator free online`; `parametric graphing calculator with example`; `parametric graphing calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

- **Publicado (2026-10-09):** parser numérico acotado sin `eval`, gráfica x(t)/y(t) con SVG y descarga CSV local, 36 copias estáticas derivadas con Google Translate y revisión puntual de notación/árabe. PR #75 fusionada; validación principal y publicación del hub `37876549373` correctas. EN/AR HTTP 200; sitemap con 4.140 URLs únicas. No se afirma indexación ni se hizo PageSpeed/Lighthouse.

### 306 · Singular Value Decomposition Calculator

- [x] **C/F/E/X/L/B/P/S** — publicada y verificada en producción.
- **Destino:** `https://tools.usefulverse.com/tools/singular-value-decomposition-calculator/` y 35 versiones estáticas localizadas.
- **Demanda:** `svd calculator` — 390 búsquedas/mes US/en, KD 2; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Descomposición SVD, rango, reconstrucción y error
- **Prueba de aceptación específica:** Reconstrucción U S Vt recupera entrada
- **Frontera con otras herramientas:** `matrix-calculator` resuelve determinante, inversa y transpuesta de matrices pequeñas; SVD factoriza matrices rectangulares en U, Σ y Vᵀ. No se encontró una calculadora de eigenvalores en el catálogo protegido. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `singular value decomposition calculator` — 110/mes US/en; KD 3.
  - `svd calculator free online`; `svd calculator with example`; `svd calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Publicado (2026-10-09):** SVD compacta local para matrices 2×2 a 8×8, entradas acotadas, rango con tolerancia visible, reconstrucción/residuo, CSV y 36 copias estáticas traducidas desde inglés (borradores automáticos aceptados, no revisión nativa). Suites aprobadas; build: 4.176 páginas (115 × 36 + 36 portadas). Chrome EN/AR móvil: matriz diagonal devuelve valores 3 y 2, residuo 0; dígitos árabes procesados, RTL sin overflow y consola limpia. PR #76 integrada (`e645cbf020f79540f9f2cd344c2324e1ca3a95eb`); CI `37884506038`, deploy principal `37884830082`, deploy del hub `37885059577`, todos exitosos. Sitemap público con 4.176 URLs únicas y 36 rutas SVD. No se afirma indexación; sin PageSpeed/Lighthouse.

### 309 · Spearman Correlation Calculator

- [x] **C/F/E/X/L/B/P/S** — Spearman está implementado, verificado y publicado en los 36 idiomas.
- **Destino:** `https://tools.usefulverse.com/tools/spearman-correlation-calculator/` y 35 rutas localizadas; sitemap público comprobado.
- **Demanda:** `spearman correlation calculator` — 390 búsquedas/mes US/en, KD 5; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Rangos con empates, rho, gráfico y explicación
- **Prueba de aceptación específica:** Series crecientes iguales dan rho1
- **Frontera con otras herramientas:** linear-regression-calculator: relación ordinal no Pearson. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rank correlation calculator` — 10/mes US/en; KD —.
  - `spearman correlation calculator free online`; `spearman correlation calculator with example`; `spearman correlation calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Implementación publicada (2026-10-09):** rangos promedio para empates, rho calculado como Pearson sobre rangos, diagrama SVG accesible de dispersión de rangos, tabla y exportación CSV local; 2–500 pares y límite de magnitud ±10¹². No calcula p-value/intervalo de confianza ni implica causalidad; rechaza series constantes. 36 copias estáticas de Google Translate (no revisión nativa), con algunas etiquetas árabes corregidas manualmente. Suite completa 1.509/1.509; pruebas focales 85/85; release-check y `npm run check` pasan. Build: 4.212 rutas (116 × 36 + 36 portadas), 4.381 archivos; controlador 6.298 bytes. Chrome EN/AR a 390 px confirma rho=1, cinco puntos, etiqueta accesible, RTL sin overflow y consola limpia. PR #77 integrada como `1b66000e55efccffb44b588dd4437b4ab1acf55a`; CI PR `37886315394`, deploy principal `37886610317`, deploy del hub `37887070482`. Página EN y sitemap público HTTP 200; el sitemap enumera 4.212 URLs únicas y 36 variantes Spearman. Sin PageSpeed/Lighthouse ni consultas nuevas a DataForSEO.

### 316 · Wilcoxon Signed Rank Test Calculator

- [x] **C/F/E/X/L/B/P/S** — herramienta publicada en 36 idiomas estáticos.
- **Destino:** `https://tools.usefulverse.com/tools/wilcoxon-signed-rank-test-calculator/`; 36 variantes con los prefijos del anexo. Sitemap público verificado con 4.248 URLs únicas.
- **Demanda:** `wilcoxon signed rank test calculator` — 320 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Diferencias pareadas, ceros y corrección de empates
- **Prueba de aceptación específica:** Diferencias todas cero requiere mensaje especial
- **Frontera con otras herramientas:** mann-whitney-u-test-calculator: pares, no grupos independientes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/publicación (2026-10-09):** diferencias después−antes; ceros omitidos, empates con rangos medios, p bilateral exacta hasta 25 pares no nulos y aproximación normal bilateral con corrección de continuidad para muestras mayores. Sumas, método, tabla y CSV local; sin p inventado para el caso todo-cero. Entrada 2–500 pares, magnitud ≤10¹² y supuestos explícitos. 36 traducciones estáticas de Google Translate (no revisión nativa). Suite 1.517/1.517; sitio principal 10.260 URLs y release-check aprobados; build hub 4.248 páginas (117 × 36 + 36 portadas), 4.418 archivos. Chrome EN/AR 390 px confirma ejemplo, caso all-zero y RTL sin overflow. PR #78 (`8e7759e61de569fb2013a8b5751d5c13a69b2762`); CI `37887628046`, deploy principal `37888013549`, hub `37888370863`; rutas EN/AR y sitemap público con 4.248 URLs únicas, incluidas 36 variantes. No se afirma indexación ni envío manual; sin PageSpeed/Lighthouse ni nueva consulta DataForSEO.
- **Consultas secundarias del mismo propietario:**
  - `paired wilcoxon calculator` — sin métrica obtenida; no atribuir volumen.
  - `wilcoxon signed rank test calculator free online`; `wilcoxon signed rank test calculator with example`; `wilcoxon signed rank test calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 323 · Chinese Remainder Theorem Calculator

- [x] **C/F/E/X/L/B/P/S** — completa y publicada en 36 idiomas estáticos.
- **Destino:** `https://tools.usefulverse.com/tools/chinese-remainder-theorem-calculator/`; 36 versiones con los prefijos del anexo.
- **Demanda:** `crt calculator` — 260 búsquedas/mes US/en, KD 0; nivel C. CPC 2.2 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resolver sistema modular con módulos coprimos y detectar conflicto
- **Prueba de aceptación específica:** x mod 3=2 y mod 5=3 da 8 mod15
- **Frontera con otras herramientas:** system-of-equations-calculator: congruencias no ecuaciones reales. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** implementación propia con `BigInt` nativo; sin dependencia externa, API, worker ni costes por consulta. Límites de entrada y número de congruencias acotan el cálculo local.
- **Implementación/publicación (2026-10-09):** admite pares `resto, módulo` y notación congruente; resuelve sistemas compatibles coprimos y no coprimos, informa conflictos y explica el cálculo combinado. Límites ±10¹², de 2 a 20 congruencias, dígitos árabes/persas. 36 copias estáticas generadas con Google Translate; traducción técnica árabe corregida manualmente tras detectar error en “least nonnegative”; no es revisión nativa. Regresión 1.527/1.527, `npm run check` preserva 10.260 URLs y release-check pasa; build 4.284 páginas (118 × 36 + 36 portadas), 4.455 archivos. Chrome EN/AR a 390 px: ejemplo → 8 mod 15, RTL sin overflow y consola limpia. PR #79 integrada en `0182616563777929c6ce09125e3cc4b86eacefa4`; CI `37889002769`, deploy principal `37889311273` y hub `37889323303`, todos exitosos. URLs EN/AR y sitemap público HTTP 200, 4.284 URLs únicas y 36 variantes CRT. No se afirma indexación ni envío manual. Sin PageSpeed/Lighthouse ni llamada adicional DataForSEO.
- **Consultas secundarias del mismo propietario:**
  - `chinese remainder theorem calculator` — 140/mes US/en; KD 0.
  - `crt calculator free online`; `crt calculator with example`; `crt calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Datos y desarrollo

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Parser específico seguro y motor local; WebCrypto/worker si aplica. Escape/sanitización, errores con ubicación, salida copiable/descargable. Nunca ejecutar ni enviar secretos.

**Pruebas adicionales para cada ficha:** Fixtures válidas y malformadas, roundtrip cuando sea posible, Unicode, control de tamaños/DoS e intento de inyección.

### 117 · Json Diff

- [x] **C/F/E/X/L/B/P/S completos — `json-diff` (publicada)**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/json-diff/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `json diff` — 8.100 búsquedas/mes US/en, KD 14; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Comparación semántica de objetos, orden de claves irrelevante, arrays por índice/ID y JSON Patch; los textos permanecen locales.
- **Prueba de aceptación específica:** Claves distinto orden no dan cambio
- **Frontera con otras herramientas:** text-diff-checker: semántica objetos no líneas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `json compare online` — 2.900/mes US/en; KD 16.
  - `json diff free online`; `json diff with example`; `json diff no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Publicación verificada (2026-10-09):** PR #80, merge `a5623dff218c56d78e893e87f89e4a7f2ab098ce`; CI `37890180221`, deploy principal `37890504845`, hub `37890916012`; URLs EN/AR y sitemap HTTP 200, 4.320 URLs únicas con 36 variantes JSON Diff. No implica indexación ni envío manual.

### 148 · Text To Binary Converter

- [x] **C/F/E/X/L/B/P/S completos — `text-to-binary-converter`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/text-to-binary-converter/` + 35 variantes localizadas; incluido en el sitemap público de 4.356 URLs únicas.
- **Demanda:** `binary to text converter` — 5.400 búsquedas/mes US/en, KD 38; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Texto↔bytes binarios UTF-8, errores de decodificación, agrupación y exportación; conservar caracteres Unicode, no convertir solo un entero.
- **Prueba de aceptación específica:** Texto ñ produce bytes UTF8 correctos
- **Frontera con otras herramientas:** binary-converter: texto y bytes no enteros. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `text to binary converter` — 1.900/mes US/en; KD 14.
  - `binary to text converter free online`; `binary to text converter with example`; `binary to text converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 171 · Schema Markup Validator

- [x] **C/F/E/X/L/B/P/S completos — `schema-markup-validator`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/schema-markup-validator/` + 35 variantes localizadas, presentes en el sitemap público. QA funcional y RTL documentados en `docs/growth600/PROGRESS.md`.
- **Demanda:** `schema markup validator` — 3.600 búsquedas/mes US/en, KD 32; nivel B. CPC 16.59 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Parsear JSON-LD y vocabulario Schema.org versionado, señalar campos y errores; no prometer validación Google ni rich results garantizados.
- **Prueba de aceptación específica:** JSONinválido nopasa; tipo desconocido reportado
- **Frontera con otras herramientas:** json-ld-generator: validación noauthoring. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `structured data validator` — 140/mes US/en; KD 22.
  - `schema markup validator free online`; `schema markup validator with example`; `schema markup validator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 189 · Certificate Decoder

- [x] **C/F/E/X/L/B/P/S completos — `certificate-decoder`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/certificate-decoder/` + 35 variantes localizadas; aparecen en el sitemap público.
- **Demanda:** `certificate decoder` — 2.900 búsquedas/mes US/en, KD 29; nivel B. CPC 18.32 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Leer X.509 PEM/DER, SAN, emisor, fechas y fingerprints; decodificar no equivale a verificar una cadena de confianza.
- **Prueba de aceptación específica:** Fixture conocido devuelve CN yfecha
- **Frontera con otras herramientas:** jwt-decoder: certificados no token. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pem certificate decoder` — 90/mes US/en; KD 16.
  - `certificate decoder free online`; `certificate decoder with example`; `certificate decoder no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Cierre (2026-10-09):** 36 locales estáticos; fixture X.509 de prueba devuelve subject/issuer, serial, fechas, SAN y SHA-256. 5 tests de parser pasan; suite global 1.553/1.553; build hub 4.392 páginas; `npm run check` conserva 10.260 URLs principales; release-locale pasa. Chrome AR a 390 px: decodificación funcional, menú de idiomas abre dentro del viewport, resultado largo se envuelve (390/390), consola limpia. Sin PageSpeed/Lighthouse ni afirmación de indexación.

### 195 · Json To Xml Converter

- [ ] **C/F/E/X/L/B/P/S completos — `json-to-xml-converter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/json-to-xml-converter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `xml to json converter` — 2.400 búsquedas/mes US/en, KD 0; nivel B. CPC 4.87 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Conversión bidireccional con política de atributos/arrays, nombres inválidos y pérdidas documentadas; no ejecutar DTD ni entidades externas.
- **Prueba de aceptación específica:** Elemento repetido conserva array
- **Frontera con otras herramientas:** json-yaml-converter y xml-formatter: puente formatos distinto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `json to xml converter` — 590/mes US/en; KD 0.
  - `xml to json converter free online`; `xml to json converter with example`; `xml to json converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Checkpoint local (2026-10-09; todavía no publicado):** motor bidireccional, límite de 200.000 caracteres, 20.000 nodos/profundidad 64/5.000 elementos por array, escape XML y bloqueo de DTD/entidades; arrays de nivel superior se envuelven bajo la raíz elegida. UI con ejemplo, dirección, raíz, indentación y copiar/descargar; notas explican pérdida de tipos/representación. Las 36 localizaciones estáticas incluyen metadatos y FAQ, manteniendo `@name`, `#text` y los ejemplos. Lógica/controlador, catálogo, formularios, contratos de idioma y build ya tienen pruebas. Suite global 1.566/1.566, `npm run check`, `npm run locale:release-check` y build aislado (4.428 URLs únicas: 122 × 36 herramientas + 36 páginas de idioma) pasan. Chrome local: conversión en ambas direcciones, arrays superiores, XML inválido anunciado y español a 390 px sin overflow (390/390); consola sin errores/avisos. Quedan revisión final, publicación y verificación online; no se ha medido PageSpeed/Lighthouse ni se afirma indexación.

### 215 · Har Viewer

- [ ] **C/F/E/X/L/B/P/S completos — `har-viewer`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/har-viewer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `har analyzer` — 1.900 búsquedas/mes US/en, KD 3; nivel B. CPC 6.87 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Waterfall y resumen de un HAR local, filtros y advertencia sobre cookies/tokens contenidos; no subir archivos ni publicar secretos al exportar.
- **Prueba de aceptación específica:** Entradas conheaders no seenvían; tiempos se suman
- **Frontera con otras herramientas:** url-parser: diagnóstico captura tráfico no URL. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `har viewer` — 480/mes US/en; KD 14.
  - `har analyzer free online`; `har analyzer with example`; `har analyzer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Checkpoint local (2026-10-09; publicación pendiente):** visor HAR 1.2 procesado enteramente en el navegador; abre archivo o texto pegado, limita entrada a 5 MiB/5.000 entradas/120.000 valores/profundidad 48, presenta resumen y waterfall paginado, filtros de texto/método/estado, y censura valores de query, credenciales y fragmentos. No muestra headers ni cuerpos, no hace fetch/importación remota, replay, upload ni exportación; advierte que host y ruta todavía podrían identificar sistemas privados. 36 packs estáticos traducidos automáticamente desde inglés; sin traducción runtime. Pruebas de parser/controlador/formulario/catálogo/locales/build más suite completa **1.574/1.574**, release locales y build principal **10.260 URLs** pasan. Build del hub: **4.464 URLs únicas** (123 × 36 + 36 portadas), 4.641 archivos; CSS común minificado **24.336 bytes** bajo el máximo de 24 KiB y hoja de ruta exclusiva pequeña para no cargarla en otras herramientas. Chrome local: fixture detecta 1 error 503 de 3 solicitudes y censura `token=sample`; sin peticiones externas ni errores de consola. EN y AR RTL a 390 px sin desbordamiento del documento. Falta PR/CI, publicación y verificación pública; no PageSpeed/Lighthouse ni afirmación de indexación.

### 223 · Robots Txt Tester

- [x] **C/F/E/X/L/B/P/S completos — `robots-txt-tester`**
- **Publicado:** `https://tools.usefulverse.com/tools/robots-txt-tester/` y las otras 35 versiones. PR #85 integrada; CI `37900570648`, deploy principal `37900951430` y publicación del hub `37900970440` correctos. Sitemap público verificado: 4.500 URLs, incluidas las 36 variantes. EN/AR HTTP 200. No se afirma indexación; sin PageSpeed/Lighthouse.
- **Demanda:** `robots txt tester` — 1.900 búsquedas/mes US/en, KD 35; nivel B. CPC 11.02 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Evaluar un robots.txt aportado frente a URLs y user-agent, explicar regla ganadora; no rastrear sitios ni modificar robots actual de Useful Verse.
- **Prueba de aceptación específica:** Disallow/private bloquea solo rutacorrespondiente
- **Frontera con otras herramientas:** robots-txt-generator: evaluación noauthoring, revisarcanibalización. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `robots txt validator` — 880/mes US/en; KD 35.
  - `robots txt tester free online`; `robots txt tester with example`; `robots txt tester no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.


### 235 · Json To Excel

- [ ] **C/F/E/X/L/B/P/S completos — `json-to-excel`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/json-to-excel/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `json to excel` — 1.600 búsquedas/mes US/en, KD 5; nivel B. CPC 3.77 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Mapear JSON a hojas/columnas y exportar XLSX con tipos, datos anidados y preservación de ceros iniciales. No ejecutar fórmulas de entradas no confiables.
- **Prueba de aceptación específica:** Identificador001 permanece cadena
- **Frontera con otras herramientas:** json-to-csv y spreadsheet-converter: flujo puede componerse; revisar intención. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `json to xlsx converter` — 880/mes US/en; KD 0.
  - `json to excel free online`; `json to excel with example`; `json to excel no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Implementación/publicación (2026-10-09):** JSON pegado se convierte localmente en una hoja XLSX; autoelige el primer arreglo de nivel superior, admite elegir otras matrices o el objeto raíz, aplana campos anidados y conserva arreglos internos como JSON. Cadenas "001" y fórmulas aparentes permanecen texto inerte. 36 traducciones estáticas; sin servicio de traducción en runtime. Límites de entrada, nodos, profundidad, filas, columnas, celdas, longitud de celda y tamaño de descarga aplicados. Suite **1.592/1.592**, release locales, `npm run check` (**10.260 URLs principales**) y build Growth600 (**4.536 páginas; 125 × 36 + 36 portadas**) pasaron. QA Chrome EN/AR a 390 px: XLSX válido; `001` sin perder cero, AR `dir=rtl` y sin overflow. PR #86, merge `a92891ad1c8f06be223d6a077e486d41be0d4f97`, deploy principal `37903140579` y hub `37903965314`; rutas EN/AR y sitemap público 4.536 URLs únicas. No se afirma indexación ni se midió PageSpeed/Lighthouse.

### 270 · Binary Files to Base64 & Data URI

- [x] **C/F/E/X/L/B/P/S completos — `binary-base64-tool` (publicada 2026-10-09; PR #87)**
- **Destino publicado:** `https://tools.usefulverse.com/tools/binary-base64-tool/`; 35 versiones con los prefijos del anexo. Las 36 rutas se incluyen en el sitemap público.
- **Demanda:** `base64 image encoder` — 880 búsquedas/mes US/en, KD 42; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Archivo a data URI, vista previa MIME y exportación sin upload
- **Prueba de aceptación específica:** PNG roundtrip recupera bytes idénticos
- **Frontera con otras herramientas:** base64-encoder-decoder: archivos binarios no texto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `image to base64 converter` — 390/mes US/en; KD 31.
  - `base64 image encoder free online`; `base64 image encoder with example`; `base64 image encoder no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Pruebas/publicación (2026-10-09):** codifica archivos locales (máx. 2 MiB) como Base64 o URI de datos; vista previa solo PNG/JPEG/GIF/WebP/BMP/AVIF; copia/descarga texto. El MIME del navegador es metadato, no verificación de seguridad. 36 traducciones estáticas, sin traducción runtime. Tests dirigidos 239/239 y suite 1.599/1.599; build principal 10.260 URLs y hub 4.572 páginas. Chrome confirmó PNG 2×1 y roundtrip exacto, Base64 sin prefijo, rechazo localizado del exceso de tamaño y árabe RTL sin overflow. PR #87 merge `a048d6c3294a3a88f01c4701006bd2fa871b656b`, deploy principal `37904982465`, hub `37905658056`; rutas EN/AR y sitemap con 4.572 URLs únicas verificados. Sin PageSpeed/Lighthouse ni afirmación de indexación.

### 273 · JSON to TypeScript, C# & Java Models

- [x] **C/F/E/X/L/B/P/S completos — `json-model-generator` (publicada 2026-10-09; PR #88)**
- **Destino publicado:** `https://tools.usefulverse.com/tools/json-model-generator/`; otras 35 versiones con los prefijos del anexo. Las 36 rutas y el sitemap se verificaron tras publicar.
- **Demanda:** `json to csharp` — 720 búsquedas/mes US/en, KD 1; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Inferir modelos TypeScript, C# y Java desde ejemplos JSON; opcionales, arrays, null y nombres editables. Un solo propietario SEO para generar código de modelos.
- **Prueba de aceptación específica:** `null` más cadena produce una unión declarada y los campos ausentes en elementos de muestra se marcan opcionales.
- **Frontera con otras herramientas:** json-schema-validator: genera tipos no validar datos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Motor local ligero, sin dependencia ni red. El muestreo no reemplaza un esquema ni garantiza que el código compile; validar salida y límites; seguir gates globales.
- **Consultas secundarias del mismo propietario:**
  - `json to typescript` — 480/mes US/en; KD 19.
  - `json to csharp free online`; `json to csharp with example`; `json to csharp no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Pruebas/publicación (2026-10-09):** lógica TypeScript/C#/Java en el navegador, sin dependencia ni red. Tests focales 246/246, suite completa 1.610/1.610; release locale y builds principal (10.260 URLs) y hub (4.608 páginas; 127 × 36 + 36 portadas) aprobados. Chrome confirma generación de los tres lenguajes, copiar código y árabe RTL 390×844 sin overflow ni errores de consola. PR #88 integrada en `708905c9`; deploy principal `37907098650` y publicación del hub `37907444978` exitosos. Sitemap público: 4.608 URLs únicas; EN/AR HTTP 200. Sin PageSpeed/Lighthouse ni afirmación de indexación.

### 279 · Csv Editor

- [x] **C/F/E/X/L/B/P/S completos — `csv-editor` (publicado 2026-10-09; PR #89)**
- **Destino publicado:** `https://tools.usefulverse.com/tools/csv-editor/`; las 36 versiones aparecen en el sitemap público.
- **Demanda:** `csv editor` — 720 búsquedas/mes US/en, KD 10; nivel C. CPC 2.85 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Editor de celdas y columnas, búsqueda, tipos, undo y exportación con delimitador/encoding; manejar comillas y filas multilinea sin perder datos.
- **Prueba de aceptación específica:** Comillas y multilinea sobreviven edición
- **Frontera con otras herramientas:** csv-viewer: vista no editable, contrato nuevo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Parser local ligero, sin dependencia ni red; límites para evitar presión excesiva de memoria. Los tipos de columna son comprobaciones seleccionadas por la persona: no cambian ni se incluyen en los valores CSV.
- **Consultas secundarias del mismo propietario:**
  - `edit csv online` — 390/mes US/en; KD 0.
  - `csv editor free online`; `csv editor with example`; `csv editor no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Pruebas/publicación (2026-10-09):** 36 traducciones estáticas; títulos ≤60 y descripciones ≤160 caracteres. Tests específicos 252/252 y suite completa previa 1.624/1.624; release check y build principal (10.260 URLs) pasan. Chrome verificó carga/edición/exportación con CSV entrecomillado y multilinea, validación de tipos sin alterar datos, búsqueda, filas/columnas, undo/redo y exportación UTF-8; sin peticiones externas. Árabe RTL 390×844 sin desbordamiento ni errores de consola. PR #89 integrada en `386092975d0391e5ff70a91553b87716710bf7e5`, CI PR `37910003597`, deploy principal `37910456234` y publicación del hub `37910981705`; EN HTTP 200 y sitemap público con 4.644 URLs únicas (128 × 36 + 36 portadas). Sin PageSpeed/Lighthouse; publicar no garantiza indexación.

### 282 · OpenAPI Editor

- [x] **C/F/E/X/L/B/P/S completos — `openapi-editor` (publicada 2026-10-09; PR #60)**
- **Destino publicado:** `https://tools.usefulverse.com/tools/openapi-editor/`; 35 variantes con los prefijos del anexo. Las 36 URLs responden HTTP 200.
- **Demanda:** `swagger editor online` — 720 búsquedas/mes US/en, KD 32; nivel C. CPC 8.7 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Contrato OpenAPI YAML/JSON con lint, referencias locales y preview; no hacer peticiones a endpoints ni resolver referencias externas silenciosamente.
- **Prueba de aceptación específica superada:** OpenAPI 3.1 YAML de ejemplo produce una operación `GET /items/{itemId}`; se señalan contrato incompleto, operationId duplicado, respuesta no descrita, parámetro de ruta ausente y referencia no resuelta. Las referencias remotas se rechazan sin solicitud de red.
- **Frontera con otras herramientas:** api-request-builder: contratodeAPI no comando. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo cerrados:** Parser `js-yaml` 4.3.2 con licencia MIT, paquete fijado y asset minificado de 43.8 KB cargado desde el mismo origen solo cuando se usa YAML; licencia incluida. JSON no descarga el parser. Límite de entrada 300 KB y 500 rutas; no es una certificación completa OpenAPI. No hay API, Worker ni coste de proceso remoto.
- **Pruebas/publicación:** suite focal 63/63 y `npm test` 1.377/1.377; build del sitio principal conserva 10.260 URLs; build Growth600 3.600 URLs. Localización en 36 idiomas; títulos/descripciones, canonical y `hreflang` validados por build. Navegador en inglés, español, árabe y chino tradicional; consola limpia, sin peticiones a endpoints externos y sin desbordamiento en las muestras. No PageSpeed/Lighthouse. PR #60 y deploy confirmados; sitemap del hub contiene 3.600 URLs únicas (no implica indexación).
- **Consultas secundarias del mismo propietario:**
  - `openapi editor` — 390/mes US/en; KD 41.
  - `swagger editor online free online`; `swagger editor online with example`; `swagger editor online no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 295 · Xml To Csv Converter

- [ ] **C/F/E/X/L/B/P/S completos — `xml-to-csv-converter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/xml-to-csv-converter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `xml to csv converter` — 480 búsquedas/mes US/en, KD 0; nivel C. CPC 5.27 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Mapear rutas XML a columnas y volver con política explícita, atributos y escapes; bloquear entidades externas y documentar estructura no recuperable.
- **Prueba de aceptación específica:** Ampersand escapado y campos concoma preservados
- **Frontera con otras herramientas:** spreadsheet-converter: transformación jerárquicaXML. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `csv to xml converter` — 110/mes US/en; KD 0.
  - `xml to csv converter free online`; `xml to csv converter with example`; `xml to csv converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 296 · Csv Merge

- [ ] **C/F/E/X/L/B/P/S completos — `csv-merge`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/csv-merge/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `merge csv files` — 480 búsquedas/mes US/en, KD 0; nivel C. CPC 10.59 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Concatenar varios CSV por nombre de encabezado, delimitadores y origen; no confundir concatenar con join relacional.
- **Prueba de aceptación específica:** Columnas desordenadas se alinean pornombre
- **Frontera con otras herramientas:** csv-editor: unión de archivos no edición. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `csv merge` — 260/mes US/en; KD 0.
  - `merge csv files free online`; `merge csv files with example`; `merge csv files no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 307 · Sitemap Validator

- [ ] **C/F/E/X/L/B/P/S completos — `sitemap-validator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/sitemap-validator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `sitemap validator` — 390 búsquedas/mes US/en, KD 3; nivel C. CPC 6.41 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Validar XML introducido: URLs, duplicados, fechas, límites y namespaces; no crawl, no reenvío de sitemaps del cliente y no prometer indexación.
- **Prueba de aceptación específica:** URLduplicada yfecha inválida señaladas
- **Frontera con otras herramientas:** sitemap-xml-generator: validación nosolo creación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `xml sitemap checker` — 260/mes US/en; KD 1.
  - `sitemap validator free online`; `sitemap validator with example`; `sitemap validator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 308 · Bcrypt Generator

- [ ] **C/F/E/X/L/B/P/S completos — `bcrypt-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/bcrypt-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `bcrypt generator` — 390 búsquedas/mes US/en, KD 4; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Hash y verificación locales, sal criptográfica y coste explícito; worker y cancelación. Nunca persistir la contraseña por defecto.
- **Prueba de aceptación específica:** Hash de contraseña verifica y otra falla
- **Frontera con otras herramientas:** password-generator: hash no contraseña nueva. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `bcrypt hash checker` — 10/mes US/en; KD —.
  - `bcrypt generator free online`; `bcrypt generator with example`; `bcrypt generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 313 · Aes Encryption Tool

- [ ] **C/F/E/X/L/B/P/S completos — `aes-encryption-tool`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/aes-encryption-tool/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `aes decrypt online` — 390 búsquedas/mes US/en, KD 12; nivel C. CPC 10.49 USD (no CPM).
- **Función mínima y ampliaciones útiles:** AES-GCM local, texto/archivos, PBKDF2 parametrizado, salt/IV aleatorios y contenedor versionado; clave incorrecta falla de forma autenticada y no revela basura.
- **Prueba de aceptación específica:** Clave incorrecta no produce plaintext
- **Frontera con otras herramientas:** pdf-protect-unlock: cifrado de datos generales. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `aes encryption tool` — 90/mes US/en; KD 18.
  - `aes decrypt online free online`; `aes decrypt online with example`; `aes decrypt online no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 314 · Jwt Encoder

- [ ] **C/F/E/X/L/B/P/S completos — `jwt-encoder`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/jwt-encoder/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `jwt encoder` — 390 búsquedas/mes US/en, KD 16; nivel C. CPC 6.43 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Construir y firmar JWT con algoritmos permitidos y secreto local, expiración y preview; no interpretar emisión como autenticación ni verificar usuarios.
- **Prueba de aceptación específica:** TokenHS256 verifica contra vector
- **Frontera con otras herramientas:** jwt-decoder: emitir y firmar no inspeccionar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `jwt builder` — 30/mes US/en; KD 24.
  - `jwt encoder free online`; `jwt encoder with example`; `jwt encoder no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 317 · Graphql Formatter

- [ ] **C/F/E/X/L/B/P/S completos — `graphql-formatter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/graphql-formatter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `graphql formatter` — 320 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Parser de queries y SDL, formato y error con ubicación; no ejecutar queries ni enviar datos a un GraphQL remoto.
- **Prueba de aceptación específica:** Querymalformada no ejecuta
- **Frontera con otras herramientas:** json-formatter: lenguaje GraphQL distinto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `graphql validator online` — 10/mes US/en; KD 16.
  - `graphql formatter free online`; `graphql formatter with example`; `graphql formatter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 321 · Rsa Key Generator

- [ ] **C/F/E/X/L/B/P/S completos — `rsa-key-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rsa-key-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rsa key generator` — 320 búsquedas/mes US/en, KD 22; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Claves Web Crypto, formatos SPKI/PKCS8, fingerprint y cifrado de mensajes del tamaño permitido; no confundir clave pública con certificado ni prometer certificados de confianza.
- **Prueba de aceptación específica:** Encrypt/decrypt recupera entrada
- **Frontera con otras herramientas:** aes-encryption-tool: claves asimétricas y formatos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rsa encryption online` — 210/mes US/en; KD 0.
  - `rsa key generator free online`; `rsa key generator with example`; `rsa key generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 322 · Log Analyzer

- [ ] **C/F/E/X/L/B/P/S completos — `log-analyzer`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/log-analyzer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `log analyzer` — 320 búsquedas/mes US/en, KD 24; nivel C. CPC 57.71 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Importar access logs locales con parser declarado, filtros, agrupación de códigos/fechas y CSV; señalar líneas inválidas y no enviar IPs a servidores.
- **Prueba de aceptación específica:** Líneas inválidas se cuentan y muestran
- **Frontera con otras herramientas:** csv-viewer: formatoslogs yagrupación errores. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `log file analyzer online` — 10/mes US/en; KD 37.
  - `log analyzer free online`; `log analyzer with example`; `log analyzer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Documentos y formatos

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Lector/escritor local del formato y preview seguro, conservando el original. Exportación/reapertura independientes; detectar cifrado/DRM/features no soportadas antes de prometer fidelidad.

**Pruebas adicionales para cada ficha:** Reabrir salida, comprobar contenido/páginas/propiedades esperadas y input intacto. Error, cancelar y nombre/extensión/MIME correctos.

### 040 · Epub To Pdf

- [ ] **C/F/E/X/L/B/P/S completos — `epub-to-pdf`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/epub-to-pdf/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `epub to pdf` — 49.500 búsquedas/mes US/en, KD 20; nivel A. CPC 4.57 USD (no CPM).
- **Función mínima y ampliaciones útiles:** EPUB sin DRM, respetar spine, estilos básicos y paginación local; crear PDF con diálogo de imprimir cuando sea necesario. No declarar descarga silenciosa si depende del navegador.
- **Prueba de aceptación específica:** Ordenchaptersmantienespine; scriptsnuncaejecutados
- **Frontera con otras herramientas:** epub-reader: exportpaginadonoleer. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `ebook to pdf converter` — 140/mes US/en; KD 19.
  - `epub to pdf free online`; `epub to pdf with example`; `epub to pdf no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `epub to pdf` 12.100/mes, KD 18; UK/en `epub to pdf` 8.100/mes, KD 20; AU/en `epub to pdf` 4.400/mes, KD 14.

### 070 · Meeting Minutes Template

- [ ] **C/F/E/X/L/B/P/S completos — `meeting-minutes-template`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/meeting-minutes-template/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `meeting minutes template` — 22.200 búsquedas/mes US/en, KD 19; nivel A. CPC 3.26 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Agenda, asistentes, decisiones y acciones con dueño/fecha; edición, exportación Markdown y print. No inventar lo que se dijo en una reunión.
- **Prueba de aceptación específica:** Acciónconsresponsableyfecha seexporta
- **Frontera con otras herramientas:** local-notepad: registroestructurado no notaslibres. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `meeting minutes generator` — 30/mes US/en; KD 1.
  - `meeting minutes template free online`; `meeting minutes template with example`; `meeting minutes template no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `meeting minutes template` 3.600/mes, KD 9; UK/en `meeting minutes template` 3.600/mes, KD 9; AU/en `meeting minutes template` 4.400/mes, KD 12.

### 081 · Email Signature Generator

- [ ] **C/F/E/X/L/B/P/S completos — `email-signature-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/email-signature-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `email signature generator` — 18.100 búsquedas/mes US/en, KD 44; nivel A. CPC 7.59 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Bloque de firma HTML con enlaces, identidad e imágenes locales; sanitización, preview y copia. Aclarar diferencias entre clientes de correo.
- **Prueba de aceptación específica:** URLjavascriptrechazadaytextoescapado
- **Frontera con otras herramientas:** html-email-builder: bloque firma noemail entero. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `html email signature maker` — 720/mes US/en; KD 39.
  - `email signature generator free online`; `email signature generator with example`; `email signature generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 119 · PDF Form & Annotation Flattener

- [ ] **C/F/E/X/L/B/P/S completos — `pdf-flattener`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pdf-flattener/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pdf flatten` — 8.100 búsquedas/mes US/en, KD 25; nivel B. CPC 3.05 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Flatten de formularios y anotaciones con apariencia visible, copia separada y advertencia de pérdida de interactividad/firma; no confundirlo con rellenar campos.
- **Prueba de aceptación específica:** Campocompletadopermanecevisual trasflatten
- **Frontera con otras herramientas:** pdf-form-filler: cerrarformularionorellenar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `flatten pdf forms` — sin métrica obtenida; no atribuir volumen.
  - `pdf flatten free online`; `pdf flatten with example`; `pdf flatten no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 122 · Markdown Editor

- [ ] **C/F/E/X/L/B/P/S completos — `markdown-editor`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/markdown-editor/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `markdown editor` — 8.100 búsquedas/mes US/en, KD 45; nivel B. CPC 7.44 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Editor persistente con undo, tablas, tareas, navegación, preview seguro y exportación Markdown; no hacer otra página de conversión Markdown↔HTML.
- **Prueba de aceptación específica:** Scripts en Markdown noejecutan
- **Frontera con otras herramientas:** markdown-html-converter: ya preview; soloadmitir editorpersistente completo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `markdown editor online` — 1.600/mes US/en; KD 42.
  - `markdown editor free online`; `markdown editor with example`; `markdown editor no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 127 · Purchase Order Generator

- [ ] **C/F/E/X/L/B/P/S completos — `purchase-order-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/purchase-order-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `purchase order template` — 6.600 búsquedas/mes US/en, KD 0; nivel B. CPC 7.3 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Proveedor, pedido, partidas, cantidades, moneda y condiciones; totales, numeración y print. Orden de compra, no factura ni recibo.
- **Prueba de aceptación específica:** Sumapartidas coincidecontotal
- **Frontera con otras herramientas:** invoice-generator: ordenprecompra nofacturación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `purchase order generator` — 390/mes US/en; KD 8.
  - `purchase order template free online`; `purchase order template with example`; `purchase order template no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 181 · Rtf Converter

- [x] **C/F/E/X/L/B/P/S completos — `rtf-converter`**
- **Destino:** `https://tools.usefulverse.com/tools/rtf-converter/`; 35 versiones adicionales con los prefijos del anexo.
- **Demanda:** `rtf to pdf converter` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC 1.15 USD (no CPM).
- **Función implementada:** extrae texto legible de RTF local y conserva párrafos, tabulaciones, escapes, Unicode y símbolos comunes. Permite copiar/descargar texto o abrir la impresión del navegador para guardar como PDF. No convierte a HTML.
- **Frontera y límites visibles:** procesa hasta 5 MiB en el dispositivo; ignora códigos de formato, imágenes, tablas y metadatos. El resultado no conserva el diseño original ni todas las características de Word; el archivo fuente no cambia ni se sube.
- **Pruebas de aceptación:** las palabras de control RTF no aparecen como texto; se comprueban páginas malformadas, profundidad/tamaño máximos, caracteres escapados y fallos de lectura; validar también que el texto impreso use `textContent` y no se interprete como HTML.
- **Frontera con otras herramientas:** conversión a texto/PDF impreso, no edición DOCX ni conservación de maquetación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Estado local (2026-10-08):** lógica focal 9/9; regresión `npm test` 1.292/1.292; `npm run check` preserva las 10.260 URLs originales; `locale:release-check` correcto. Build local: 3.240 URLs únicas (89 herramientas × 36 idiomas + 36 portadas), 3.380 archivos. Chrome EN/AR: extracción de ejemplo, `dir=rtl` árabe y consola sin errores. Sin PageSpeed/Lighthouse.
- **Publicación comprobada (2026-10-08):** PR #47, merge `548163c5e7aa14b66c5879a89b00a5d19c2e7d16`; CI 37808096142, despliegue principal 37808599909 y despliegue del hub 37809172150 correctos. Ruta pública HTTP 200; sitemap público contiene 3.240 URLs. Publicar no demuestra indexación.
- **Consultas secundarias del mismo propietario:**
  - `rtf converter` — 140/mes US/en; KD 0.
  - `rtf to pdf converter free online`; `rtf to pdf converter with example`; `rtf to pdf converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 182 · Csv To Pdf

- [x] **C/F/E/X/L/B/P/S completos — `csv-to-pdf`**
- **Destino:** `https://tools.usefulverse.com/tools/csv-to-pdf/`; 35 versiones adicionales con los prefijos del anexo.
- **Demanda:** `csv to pdf` — 2.900 búsquedas/mes US/en, KD 0; nivel B. CPC 2.76 USD (no CPM).
- **Implementación:** importa CSV local con separador automático o elegido, filas entrecomilladas/multilínea, UTF-8, Windows-1252 y UTF-16, encabezado opcional, vista previa accesible, orientación y papel A4/Carta, márgenes y diálogo de impresión del navegador para guardar como PDF.
- **Pruebas de aceptación:** separadores citados, comillas escapadas, CRLF, Unicode, saltos de línea, ceros iniciales y contenido HTML literal permanecen en celdas seguras; CSV malformado y límites se rechazan; la impresión envuelve filas largas y repite cabecera; el original no cambia ni se transmite.
- **Frontera con otras herramientas:** CSV no contiene fórmulas ejecutables ni formato de hoja; no reemplaza la conversión de libros XLSX. Usa el diálogo PDF nativo del navegador y permanece local.
- **Estado local (2026-10-08):** lógica focal 9/9; suite `npm test` 1.303/1.303; `locale:release-check` correcto; `npm run check` preserva las 10.260 URLs originales. Build: 3.276 URLs únicas (90 herramientas × 36 locales + 36 portadas), 3.417 archivos. Chrome EN/AR: preview, texto hostil literal, impresión local y consola limpia. Traducciones automáticas sencillas en 36 idiomas, no revisadas como nativas. Sin PageSpeed/Lighthouse.
- **Publicación comprobada (2026-10-08):** PR #48, merge `82475ab108062f93a6bae9cc55a847addb5cfb1b`; CI 37811428445 y deploy principal/hub 37812563433 correctos. Las rutas EN/ES/AR responden HTTP 200; el sitemap público responde HTTP 200 con 3.276 URLs y 36 rutas de CSV→PDF. Publicación no demuestra indexación.
- **Consultas secundarias del mismo propietario:**
  - `table to pdf converter` — 10/mes US/en; KD 57.
  - `csv to pdf free online`; `csv to pdf with example`; `csv to pdf no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 185 · Work Order Generator

- [x] **C/F/E/X/L/B/P/S completos — `work-order-generator`; publicado y comprobado el 2026-10-09.**
- **Destino:** `https://tools.usefulverse.com/tools/work-order-generator/`; otras 35 versiones con los prefijos del anexo. Hub sitemap verificado con 3.348 URLs únicas.
- **Demanda:** `work order template` — 2.900 búsquedas/mes US/en, KD 14; nivel B. CPC 11.94 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Encargo confirmado, materiales, horas, checklist, estado y copia imprimible; separar de presupuestos de venta existentes.
- **Prueba de aceptación específica:** Comprobar orden con checklist/materiales/horas; el estado «completado» requiere fecha válida, el total de horas coincide y CSV/impresión reflejan los datos sin tratar contenido como HTML.
- **Frontera con otras herramientas:** quotation-generator: encargo y ejecución nopresupuesto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Implementación local, sin API/servicio. Materiales: `descripción | cantidad | unidad`; mano de obra: `actividad | horas`; hasta 40 líneas en cada sección, con límites de texto/cantidad/horas y sanitización de fórmulas CSV. El formulario construye formatos desde etiquetas localizadas para evitar reordenación por traducción.
- **Estado de validación (2026-10-09):** C/F ya medidos en este plan; no se repitió DataForSEO. L completada en 36 idiomas con traducción automática sencilla. Pruebas focales build 172/172, regresión `npm test` 1.320/1.320, `npm run check` preserva las 10.260 URLs originales, `locale:release-check` pasa. Chrome local árabe RTL confirmó ejemplo, 1,75 horas totales y consola limpia. No PageSpeed/Lighthouse.
- **Publicación verificada:** PR #51/commit `c6d5048256ee4a88549ee79dd15b37e75f5d2097`; CI 37820016811, deploy principal 37820464968, deploy del hub 37821071714. Rutas EN/ES/AR HTTP 200 con contenido localizado; sitemap HTTP 200, 3.348 URLs únicas e incluye variantes EN/ES/AR. Publicada no significa indexada.
- **Consultas secundarias del mismo propietario:**
  - `work order generator` — 140/mes US/en; KD 0.
  - `work order template free online`; `work order template with example`; `work order template no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 190 · Extract Images From Pdf

- [ ] **C/F/E/X/L/B/P/S completos — `extract-images-from-pdf`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/extract-images-from-pdf/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `extract images from pdf` — 2.900 búsquedas/mes US/en, KD 33; nivel B. CPC 2.16 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Extraer objetos de imagen con resolución nativa cuando sea posible, lista/preview y ZIP; no rasterizar páginas y llamarlo extracción original.
- **Prueba de aceptación específica:** Fixtureimagen recupera dimensióndeobjeto
- **Frontera con otras herramientas:** pdf-to-image: extraeobjetos no rasterizapágina. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pdf image extractor` — 2.900/mes US/en; KD 33.
  - `extract images from pdf free online`; `extract images from pdf with example`; `extract images from pdf no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 206 · Business Letter Generator

- [ ] **C/F/E/X/L/B/P/S completos — `business-letter-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/business-letter-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `formal letter template` — 2.400 búsquedas/mes US/en, KD 19; nivel B. CPC 0.35 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Carta formal editable con destinatario/remitente, fecha, asunto y firma; estilos sencillos y print, sin redactar asesoría jurídica.
- **Prueba de aceptación específica:** Datos largos nodesbordanpapel
- **Frontera con otras herramientas:** cover-letter-builder: correspondencia general no candidatura. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `business letter generator` — 20/mes US/en; KD 0.
  - `formal letter template free online`; `formal letter template with example`; `formal letter template no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 216 · Markdown Table Generator

- [ ] **C/F/E/X/L/B/P/S completos — `markdown-table-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/markdown-table-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `markdown table generator` — 1.900 búsquedas/mes US/en, KD 5; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Edición de celdas, alineación, import TSV/CSV, escape de pipes y copia Markdown; no generar una tabla HTML como único resultado.
- **Prueba de aceptación específica:** Pipe encontenidoescapado, filasigualcolumnas
- **Frontera con otras herramientas:** html-table-generator: formato yeditorMD. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `markdown table maker` — 1.900/mes US/en; KD 5.
  - `markdown table generator free online`; `markdown table generator with example`; `markdown table generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 221 · Pdf Accessibility Checker

- [ ] **C/F/E/X/L/B/P/S completos — `pdf-accessibility-checker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pdf-accessibility-checker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pdf accessibility checker` — 1.900 búsquedas/mes US/en, KD 20; nivel B. CPC 7.79 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Inspección parcial de tags, texto, idioma y orden, informe de señales y limitaciones; nunca declarar conformidad PDF/UA completa con un chequeo superficial.
- **Prueba de aceptación específica:** PDFsin tags reportaausencia
- **Frontera con otras herramientas:** pdf-to-pdfa: accesibilidadnoconformidadarchivo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pdf tag checker` — sin métrica obtenida; no atribuir volumen.
  - `pdf accessibility checker free online`; `pdf accessibility checker with example`; `pdf accessibility checker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 224 · Docx Editor

- [ ] **C/F/E/X/L/B/P/S completos — `docx-editor`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/docx-editor/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `edit word document online` — 1.900 búsquedas/mes US/en, KD 37; nivel B. CPC 2.81 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Edición local de párrafos/tablas en OOXML soportado, preview y copia; conservar partes no editadas y declarar limitaciones de fidelidad, macros y cambios controlados. No afirmar ser Microsoft Word completo.
- **Prueba de aceptación específica:** Párrafosnoeditados conservadostrasroundtrip
- **Frontera con otras herramientas:** pdf-document-converter: autoríaDOCX noconversión. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `docx editor` — 1.000/mes US/en; KD 25.
  - `edit word document online free online`; `edit word document online with example`; `edit word document online no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 269 · Vcard Generator

- [ ] **C/F/E/X/L/B/P/S completos — `vcard-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/vcard-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `vcard generator` — 880 búsquedas/mes US/en, KD 20; nivel C. CPC 5.06 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Campos de contacto, v Card 3/4, Unicode, escapes y foto opcional; preview y descargar VCF sin tocar la libreta de contactos.
- **Prueba de aceptación específica:** Importcontactoreproduce Unicode y teléfono
- **Frontera con otras herramientas:** business-card-maker: contacto digital no tarjetaimpresa. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `vcf contact maker` — sin métrica obtenida; no atribuir volumen.
  - `vcard generator free online`; `vcard generator with example`; `vcard generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 277 · Pdf Metadata Editor

- [ ] **C/F/E/X/L/B/P/S completos — `pdf-metadata-editor`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pdf-metadata-editor/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pdf metadata editor` — 720 búsquedas/mes US/en, KD 6; nivel C. CPC 3.78 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Leer/cambiar título, autor, asunto y fechas, limpiar metadatos elegidos y descargar copia. Mantener páginas y contenido, no prometer eliminar todo dato forense.
- **Prueba de aceptación específica:** Cambiarautor no modificanúmeropáginas
- **Frontera con otras herramientas:** pdf-page-editor: propiedadesdeldocumento. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `edit pdf metadata` — 720/mes US/en; KD 0.
  - `pdf metadata editor free online`; `pdf metadata editor with example`; `pdf metadata editor no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 278 · Vcard Converter

- [ ] **C/F/E/X/L/B/P/S completos — `vcard-converter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/vcard-converter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `vcf to csv converter` — 720 búsquedas/mes US/en, KD 8; nivel C. CPC 2.89 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Importar varios contactos VCF, elegir campos y convertir a CSV; manejar propiedades repetidas y nunca escribir en la agenda del usuario.
- **Prueba de aceptación específica:** Ncontactosdan Nfilas, sinescribiragenda
- **Frontera con otras herramientas:** vcard-generator: conversióncontactosnocreación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `vcard converter` — 170/mes US/en; KD 6.
  - `vcf to csv converter free online`; `vcf to csv converter with example`; `vcf to csv converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 297 · Pdf Bookmarks Editor

- [ ] **C/F/E/X/L/B/P/S completos — `pdf-bookmarks-editor`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pdf-bookmarks-editor/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `add bookmarks to pdf` — 480 búsquedas/mes US/en, KD 5; nivel C. CPC 8.15 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Jerarquía de marcadores, destinos, títulos, orden e import/export; abrir un marcador debe llevar a su página correcta.
- **Prueba de aceptación específica:** Bookmarkpágina2 abre página2enlector
- **Frontera con otras herramientas:** pdf-page-editor: navegación, no ordenarpáginas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pdf bookmarks editor` — 10/mes US/en; KD 0.
  - `add bookmarks to pdf free online`; `add bookmarks to pdf with example`; `add bookmarks to pdf no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 304 · Pdf Page Size Converter

- [ ] **C/F/E/X/L/B/P/S completos — `pdf-page-size-converter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pdf-page-size-converter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `resize pdf page size` — 390 búsquedas/mes US/en, KD 0; nivel C. CPC 3.66 USD (no CPM).
- **Función mínima y ampliaciones útiles:** A4/Letter/tamaño propio, escalar y centrar contenido, preview y copia; no recortar salvo decisión explícita ni preservar firmas válidas tras cambios.
- **Prueba de aceptación específica:** No recortacontenido salvoelecciónexplícita
- **Frontera con otras herramientas:** pdf-crop: escalado enpapelnuevo nocortar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pdf page size converter` — 90/mes US/en; KD 6.
  - `resize pdf page size free online`; `resize pdf page size with example`; `resize pdf page size no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 305 · Ics Viewer

- [ ] **C/F/E/X/L/B/P/S completos — `ics-viewer`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/ics-viewer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `ics viewer` — 390 búsquedas/mes US/en, KD 0; nivel C. CPC 1.18 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Leer agenda ICS, recurrencias, excepciones, zonas y filtros, exportar lista; no acceder a calendarios online.
- **Prueba de aceptación específica:** Recurrenciasrespetan EXDATE
- **Frontera con otras herramientas:** ics-calendar-generator: lecturaagenda noautoría. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `icalendar viewer online` — sin métrica obtenida; no atribuir volumen.
  - `ics viewer free online`; `ics viewer with example`; `ics viewer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Relojes, calendarios y astronomía

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Intl/Temporal o biblioteca de fechas/astronomía local de licencia compatible; zona y calendario explícitos. Timestamp real, DST, suspensión y eventos inexistentes tratados.

**Pruebas adicionales para cada ficha:** Fixtures de cambio de día/año/DST, zona distinta y dato inválido; sonido solo por gesto y probado cuando aplique.

### 009 · World Clock

- [ ] **C/F/E/X/L/B/P/S completos — `world-clock`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/world-clock/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `world clock` — 301.000 búsquedas/mes US/en, KD 100; nivel A. CPC 3.64 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Relojes actuales por ciudad, hora 12/24, fecha local, DST y favoritos. Un solo intervalo visible; dejar de redibujar pestañas ocultas y recalcular al volver.
- **Prueba de aceptación específica:** UTCy Tokyodiferenciacorrecta
- **Frontera con otras herramientas:** time-zone-converter: relojactualcontinuo no convertirinstande. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `world time clock` — 201.000/mes US/en; KD 94.
  - `world clock free online`; `world clock with example`; `world clock no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `world clock` 22.200/mes, KD 94; UK/en `world clock` 60.500/mes, KD 100; AU/en `world clock` 27.100/mes, KD 82; DE/de `weltuhr` 60.500/mes, KD 49.

### 018 · Breathing Exercise

- [ ] **C/F/E/X/L/B/P/S completos — `breathing-exercise`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/breathing-exercise/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `breathing exercise` — 135.000 búsquedas/mes US/en, KD 33; nivel A. CPC 2 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Patrones de inhalar/retener/exhalar, duración ajustable, señal visual y audio opcional. Respetar reducción de movimiento; no prometer tratamiento clínico.
- **Prueba de aceptación específica:** Transicionescontiempoycancelacióninstantánea
- **Frontera con otras herramientas:** online-timer: guíade respiración no cronómetro. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `breathing timer online` — 50/mes US/en; KD 4.
  - `breathing exercise free online`; `breathing exercise with example`; `breathing exercise no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `breathing exercise` 3.600/mes, KD 29; UK/en `breathing exercise` 49.500/mes, KD 32; AU/en `breathing exercise` 2.900/mes, KD 53.

### 056 · Online Alarm Clock

- [ ] **C/F/E/X/L/B/P/S completos — `alarm-clock`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/alarm-clock/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `online alarm clock` — 33.100 búsquedas/mes US/en, KD 39; nivel A. CPC 1.68 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Alarma a una hora absoluta, sonido activado por gesto, prueba del sonido, posponer y alertas opcionales. Advertir que cerrar la página o dormir el dispositivo puede retrasarla.
- **Prueba de aceptación específica:** Alarmafunciona trasactivaciónusuario; bloqueoreportado
- **Frontera con otras herramientas:** online-timer: horaabsoluta ydespertadornosolocuenta. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `alarm clock browser` — 40/mes US/en; KD 60.
  - `online alarm clock free online`; `online alarm clock with example`; `online alarm clock no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `online alarm clock` 3.600/mes, KD 56; UK/en `online alarm clock` 3.600/mes, KD 58; AU/en `online alarm clock` 2.400/mes, KD 58; DE/de `online wecker` 6.600/mes, KD 0.

### 088 · Julian Date Converter

- [ ] **C/F/E/X/L/B/P/S completos — `julian-date-converter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/julian-date-converter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `julian date converter` — 14.800 búsquedas/mes US/en, KD 24; nivel A. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Fecha UTC a JD/MJD y vuelta, fracción de día, calendario aplicado y precisión. JD 2451545 corresponde a 2000-01-01 12:00 UTC.
- **Prueba de aceptación específica:** 2000-01-01T12Z daJD2451545
- **Frontera con otras herramientas:** timestamp-converter: calendarioastronómico noepoch Unix. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `julian day calculator` — 14.800/mes US/en; KD 31.
  - `julian date converter free online`; `julian date converter with example`; `julian date converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 120 · Interval Timer

- [ ] **C/F/E/X/L/B/P/S completos — `interval-timer`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/interval-timer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `interval timer` — 8.100 búsquedas/mes US/en, KD 34; nivel B. CPC 1.02 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Secuencias de trabajo/descanso, vueltas, presets, audio probado y opcional, pausa y reanudación. Medir con marcas temporales, no acumulando intervalos.
- **Prueba de aceptación específica:** Cicloscumplentiempos ypausa no pierdefase
- **Frontera con otras herramientas:** online-timer: programaciónmultifaseentrenamiento vs Pomodoro. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `hiit interval timer` — 260/mes US/en; KD 13.
  - `interval timer free online`; `interval timer with example`; `interval timer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `intervall timer` 1.600/mes, KD 9.

### 133 · Hebrew Calendar Converter

- [ ] **C/F/E/X/L/B/P/S completos — `hebrew-calendar-converter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/hebrew-calendar-converter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `hebrew calendar converter` — 6.600 búsquedas/mes US/en, KD 31; nivel B. CPC 4.73 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Conversión bidireccional, meses de años bisiestos y salida legible; documentar calendario y límites históricos.
- **Prueba de aceptación específica:** AdarII soloañosbisiestos
- **Frontera con otras herramientas:** hijri-calendar-converter: sistema calendárico distinto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `hebrew date converter` — 6.600/mes US/en; KD 27.
  - `hebrew calendar converter free online`; `hebrew calendar converter with example`; `hebrew calendar converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 149 · Moon Phase Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `moon-phase-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/moon-phase-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `moon phase calculator` — 5.400 búsquedas/mes US/en, KD 49; nivel B. CPC 4.94 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Fase, iluminación aproximada y calendario lunar con método astronómico; no confundir fase global con hora local de salida.
- **Prueba de aceptación específica:** Lunanuevallena coherentesconefemérides
- **Frontera con otras herramientas:** sunrise-sunset-calculator: órbita lunar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `lunar phase calculator` — 5.400/mes US/en; KD 55.
  - `moon phase calculator free online`; `moon phase calculator with example`; `moon phase calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `mondphase berechnen` 210/mes, KD 1.

### 157 · Meeting Planner

- [ ] **C/F/E/X/L/B/P/S completos — `meeting-planner`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/meeting-planner/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `meeting planner` — 4.400 búsquedas/mes US/en, KD 21; nivel B. CPC 4.94 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Comparar disponibilidad de varias zonas con DST, rangos nocturnos y ventanas comunes; tabla de horas y exportación ICS sin conexión con agendas.
- **Prueba de aceptación específica:** DSTydíacambianhorarioscorrectamente
- **Frontera con otras herramientas:** time-zone-converter: optimización disponibilidadmultizona. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `world meeting planner` — 2.900/mes US/en; KD 27.
  - `meeting planner free online`; `meeting planner with example`; `meeting planner no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 166 · Prayer Times Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `prayer-times-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/prayer-times-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `prayer time calculator` — 3.600 búsquedas/mes US/en, KD 13; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Coordenadas manuales, fecha, zona y método astronómico declarado; ajustes de latitudes altas y horarios sin geolocalización obligatoria.
- **Prueba de aceptación específica:** New York (40.7128, −74.0060), 20-mar-2026, UTC−4, ISNA, Asr estándar → sunrise 07:00, Dhuhr 13:04; UTC−5 desplaza el horario −60 min. En 89° N durante el solsticio de junio, sunrise/sunset deben salir como no disponibles. Para el caso en que hay salida/puesta pero no se alcanza el ángulo de twilight, comparar fallback seleccionado (angle/middle/seventh) y marcar que es una estimación.
- **Frontera con otras herramientas:** date-calculator: horariosastronómicos; no ubicación automática. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `prayer times calculator` — 140/mes US/en; KD 25.
  - `prayer time calculator free online`; `prayer time calculator with example`; `prayer time calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 191 · Sunrise Sunset Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `sunrise-sunset-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/sunrise-sunset-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `sunrise sunset calculator` — 2.900 búsquedas/mes US/en, KD 79; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Fecha, coordenadas y zona introducidas; amanecer, ocaso, crepúsculos y condiciones polares. Contrastar con efemérides públicas y mostrar precisión aproximada.
- **Prueba de aceptación específica:** Díapolarmuestraausenciano error
- **Frontera con otras herramientas:** prayer-times-calculator: fenómenossolares nohorariosreligiosos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `sunrise calculator` — 720/mes US/en; KD 83.
  - `sunrise sunset calculator free online`; `sunrise sunset calculator with example`; `sunrise sunset calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `sonnenaufgang rechner` 30/mes, KD 26.

### 214 · Week Number Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `week-number-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/week-number-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `week number calculator` — 1.900 búsquedas/mes US/en, KD 0; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Semanas ISO y sistema alternativo elegido, primer/último día de semana y año de semana diferente del año civil cuando corresponda.
- **Prueba de aceptación específica:** 2021-01-01 es semanaISO53de2020
- **Frontera con otras herramientas:** date-calculator: clasificaciónsemanano diferencia. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `iso week calculator` — 1.900/mes US/en; KD 17.
  - `week number calculator free online`; `week number calculator with example`; `week number calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 250 · Moonrise Moonset Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `moonrise-moonset-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/moonrise-moonset-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `moonrise calculator` — 1.300 búsquedas/mes US/en, KD 17; nivel B. CPC 0.03 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Salidas y puestas para coordenadas/fecha/zona; múltiples eventos o ausencia de evento tratados explícitamente.
- **Prueba de aceptación específica:** Fechasinmoonrise no inventaevento
- **Frontera con otras herramientas:** moon-phase-calculator: evento local noevoluciónde fase. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `moonrise moonset calculator` — sin métrica obtenida; no atribuir volumen.
  - `moonrise calculator free online`; `moonrise calculator with example`; `moonrise calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 254 · Persian Calendar Converter

- [ ] **C/F/E/X/L/B/P/S completos — `persian-calendar-converter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/persian-calendar-converter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `persian calendar converter` — 1.000 búsquedas/mes US/en, KD 7; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Conversión Jalali↔gregoriano con método y rango declarado; verificar Nowruz y años bisiestos contra fuente.
- **Prueba de aceptación específica:** Nowruzconocidoreproducidopor fuente
- **Frontera con otras herramientas:** hijri-calendar-converter: solariranínoislámicolunar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `jalali date converter` — 10/mes US/en; KD —.
  - `persian calendar converter free online`; `persian calendar converter with example`; `persian calendar converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 289 · Hijri Calendar Converter

- [x] **C/F/E/X/L/B/P/S completos — `hijri-calendar-converter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/hijri-calendar-converter/`; otras 35 versiones con los prefijos del anexo. Pendiente de PR y publicación.
- **Demanda:** `hijri calendar converter` — 590 búsquedas/mes US/en, KD 0; nivel C. CPC 0.08 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Conversión gregoriana e Hijri tabular, método visible y advertencia de diferencias observacionales; años y fechas inválidas rechazados.
- **Prueba de aceptación específica:** una fecha válida completa round trip bajo el mismo método tabular; se rechazan fechas gregorianas imposibles y días que no existen en el mes Hijri de ese año.
- **Frontera con otras herramientas:** `date-calculator`: calendario islámico distinto y conversión explícita no cubierta allí. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `gregorian hijri converter` — sin métrica obtenida; no atribuir volumen.
  - `hijri calendar converter free online`; `hijri calendar converter with example`; `hijri calendar converter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Cierre comprobado (2026-10-09):** motor aritmético local del calendario civil tabular islámico, ciclo bisiesto de 30 años y rangos limitados; 36 copias lingüísticas estáticas. Suite general **1.420/1.420**, `locale:release-check`, `npm run check` (10.260 URLs originales) y build del hub **3.816 URLs** (105 herramientas × 36 idiomas + 36 portadas) pasan. Chrome EN/AR: 11 Mar 2024 ↔ 1 Ramadan 1445; fecha inválida rechazada; árabe RTL a 390 px, sin overflow ni errores de consola. PR #66, CI y deploys principal/hub completados; público EN/AR HTTP 200 y sitemap hub 3.816 URLs. No es Umm al-Qura, observación lunar ni guía religiosa; no se afirma indexación. No PageSpeed/Lighthouse.

## Checklist · Organización y productividad

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Modelo de datos propio validado, IndexedDB optativo y export/import JSON/CSV/SVG/ICS según contrato. Sin cuenta, backend o sincronización remota ficticia.

**Pruebas adicionales para cada ficha:** Persistencia, backup, reimportación, borrado, ciclos/conflictos y almacenamiento denegado; funcionamiento sin red.

### 039 · Secret Santa Generator

- [ ] **C/F/E/X/L/B/P/S completos — `secret-santa-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/secret-santa-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `secret santa generator` — 49.500 búsquedas/mes US/en, KD 13; nivel A. CPC 2.43 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Asignaciones sin auto-regalo, exclusiones y detección de imposibilidad; revelar individualmente en el mismo dispositivo y exportar de forma deliberada. No envío automático de email.
- **Prueba de aceptación específica:** Nadieasí mismo y cada quienunreceptor
- **Frontera con otras herramientas:** random-team-generator: asignacióncíclicadepersonas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `secret santa name draw` — 3.600/mes US/en; KD 27.
  - `secret santa generator free online`; `secret santa generator with example`; `secret santa generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `secret santa generator` 5.400/mes, KD 15; UK/en `secret santa generator` 22.200/mes, KD 16; AU/en `secret santa generator` 8.100/mes, KD 15; DE/de `wichteln generator` 480/mes, KD 0.

### 042 · Eisenhower Matrix

- [ ] **C/F/E/X/L/B/P/S completos — `eisenhower-matrix`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/eisenhower-matrix/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `eisenhower matrix` — 49.500 búsquedas/mes US/en, KD 54; nivel A. CPC 0.63 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cuatro cuadrantes, mover tareas, reglas de urgencia/importancia, guardar y exportar; no duplicar Kanban ni convertirse en una segunda lista simple.
- **Prueba de aceptación específica:** Cada tareaenunacuadranteno duplicada
- **Frontera con otras herramientas:** task-list y kanban-board: metodología depriorización diferente. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `urgent important matrix` — 3.600/mes US/en; KD 37.
  - `eisenhower matrix free online`; `eisenhower matrix with example`; `eisenhower matrix no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `eisenhower matrix` 6.600/mes, KD 46; UK/en `eisenhower matrix` 14.800/mes, KD 53; AU/en `eisenhower matrix` 6.600/mes, KD 46.

### 061 · Family Tree Maker

- [ ] **C/F/E/X/L/B/P/S completos — `family-tree-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/family-tree-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `family tree maker` — 27.100 búsquedas/mes US/en, KD 35; nivel A. CPC 2.82 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Personas, relaciones familiares, fechas, fotos locales, validación de ciclos y exportación SVG/GEDCOM; sin base genealógica remota.
- **Prueba de aceptación específica:** Cicloparentalrechazado
- **Frontera con otras herramientas:** mind-map-maker: relacionesgenealógicas no árboldeideas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `genealogy chart maker` — 50/mes US/en; KD 19.
  - `family tree maker free online`; `family tree maker with example`; `family tree maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `family tree maker` 3.600/mes, KD 33; UK/en `family tree maker` 6.600/mes, KD 18; AU/en `family tree maker` 3.600/mes, KD 16; DE/de `stammbaum erstellen` 8.100/mes, KD 0.

### 065 · Weekly Planner

- [ ] **C/F/E/X/L/B/P/S completos — `weekly-planner`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/weekly-planner/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `weekly planner` — 22.200 búsquedas/mes US/en, KD 6; nivel A. CPC 1.11 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Agenda semanal general por bloques, solapes, turnos nocturnos, vista imprimible y backup JSON; no modificar el planificador de estudios existente.
- **Prueba de aceptación específica:** Solapesmarcadosyhoras nocturnasexplicadas
- **Frontera con otras herramientas:** study-planner: agendageneral no planexam. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `weekly schedule maker` — 880/mes US/en; KD 18.
  - `weekly planner free online`; `weekly planner with example`; `weekly planner no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `wochenplan erstellen` 390/mes, KD 0.

### 069 · Random Team Generator

- [ ] **C/F/E/X/L/B/P/S completos — `random-team-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/random-team-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `random team generator` — 22.200 búsquedas/mes US/en, KD 9; nivel A. CPC 1.38 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Repartir participantes equilibradamente, restricciones compatibles, semilla opcional y exportación; cada persona aparece exactamente una vez.
- **Prueba de aceptación específica:** Todaspersonasunavezytamaños difierenmáximo1
- **Frontera con otras herramientas:** random-name-picker: repartir noelegirganador. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `team generator` — 9.900/mes US/en; KD 20.
  - `random team generator free online`; `random team generator with example`; `random team generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 112 · Fuel Economy Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `fuel-economy-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/fuel-economy-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `fuel economy calculator` — 9.900 búsquedas/mes US/en, KD 49; nivel B. CPC 6.52 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Rendimientodesderepostajes, historial ycoste/km
- **Prueba de aceptación específica:** 100km con5L da5L/100km
- **Frontera con otras herramientas:** fuel-cost-calculator: medirrendimientono proyectarviaje. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `mpg calculator` — 9.900/mes US/en; KD 41.
  - `fuel economy calculator free online`; `fuel economy calculator with example`; `fuel economy calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 113 · Timeline Maker

- [ ] **C/F/E/X/L/B/P/S completos — `timeline-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/timeline-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `timeline maker` — 9.900 búsquedas/mes US/en, KD 56; nivel B. CPC 9.62 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Eventos históricos con puntos/rangos, zoom, orden, CSV y SVG; no convertirlo en otra herramienta Gantt de proyectos.
- **Prueba de aceptación específica:** Ordencronológicosemantiene
- **Frontera con otras herramientas:** gantt-chart-maker: acontecimientos históricosno tareasdependientes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `historical timeline maker` — 480/mes US/en; KD 39.
  - `timeline maker free online`; `timeline maker with example`; `timeline maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 132 · Goal Planner

- [ ] **C/F/E/X/L/B/P/S completos — `goal-planner`**
- **Estado de implementación (2026-10-08):** motor, formulario y copy en inglés implementados como candidata #60 de la rama; suite focal pasa. Las otras 35 traducciones, prueba de navegador, revisión RTL y publicación siguen pendientes; no está en producción ni en el sitemap.
- **Destino propuesto:** `https://tools.usefulverse.com/tools/goal-planner/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `smart goals template` — 6.600 búsquedas/mes US/en, KD 30; nivel B. CPC 1.36 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Objetivo, métrica, plazo, hitos y seguimiento local; separar resultado final de la lista de tareas existente.
- **Prueba de aceptación específica:** Hitosfechadonoantesdeinicio
- **Frontera con otras herramientas:** task-list: progresoresultados no tareasaisladas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `goal planner` — 1.900/mes US/en; KD 15.
  - `smart goals template free online`; `smart goals template with example`; `smart goals template no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 151 · Mind Map Maker

- [ ] **C/F/E/X/L/B/P/S completos — `mind-map-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mind-map-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `mind map maker` — 5.400 búsquedas/mes US/en, KD 69; nivel B. CPC 12.24 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Árbol de ideas editable, ramas, reordenar, colapsar, undo y SVG/JSON; estructura arbórea explícita y ciclos prohibidos.
- **Prueba de aceptación específica:** al mover una idea a otra rama, el árbol se actualiza; intentar moverla bajo sí misma o uno de sus descendientes se rechaza y el mapa permanece válido.
- **Frontera con otras herramientas:** diagram-maker: árbolinteractivo vsprocesolineal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** motor y página en inglés implementados localmente; no usan servicios externos. L sigue bloqueado hasta completar las otras 35 traducciones. Suite focal 126/126, build aislado 2 páginas/9 archivos, bundle 10.302 B y flujo básico comprobado en Chrome móvil (390 × 844, sin overflow). Sin publicación ni sitemap de producción hasta superar localización y gates globales.
- **Consultas secundarias del mismo propietario:**
  - `mind map online` — 880/mes US/en; KD 78.
  - `mind map maker free online`; `mind map maker with example`; `mind map maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `mindmap erstellen` 8.100/mes, KD 31.

### 159 · Mood Tracker

- [ ] **C/F/E/X/L/B/P/S completos — `mood-tracker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mood-tracker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `mood tracker` — 4.400 búsquedas/mes US/en, KD 39; nivel B. CPC 0.86 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Registro privado de etiquetas y notas de ánimo, calendario, tendencias y backup; guardar solo con elección clara y no inferir diagnóstico.
- **Prueba de aceptación específica:** una entrada del 2026-10-08 con ánimo 5 y etiqueta `grateful` aparece en calendario y resumen; no existe en localStorage antes del consentimiento; al activarlo queda una entrada JSON local; al desactivarlo se borra la copia persistida pero permanece visible durante esta pestaña. Fechas fuera de 1900–2100, escala distinta de 1–5, etiquetas no permitidas, duplicados en backup y nota >500 caracteres se rechazan.
- **Frontera con otras herramientas:** habit-tracker: registroemocional no hábito completado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** lógica local, backup/import y formulario inglés implementados; sin API ni diagnóstico automatizado. 35 traducciones siguen pendientes: no publicar hasta copy específico, revisión y build para los 36 idiomas.
- **Consultas secundarias del mismo propietario:**
  - `mood journal online` — 10/mes US/en; KD 65.
  - `mood tracker free online`; `mood tracker with example`; `mood tracker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 160 · Journal Online

- [ ] **C/F/E/X/L/B/P/S completos — `journal-online`** (motor y experiencia de escritorio implementados; faltan traducciones y gates globales)
- **Destino propuesto:** `https://tools.usefulverse.com/tools/journal-online/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `journal online` — 4.400 búsquedas/mes US/en, KD 51; nivel B. CPC 3.03 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Entradas por fecha, búsqueda local, exportación y borrado; cifrado opcional bien implementado y sin presentar local Storage como una caja fuerte.
- **Prueba de aceptación específica:** Crear varias entradas el mismo día; editar sin duplicar; buscar por título/cuerpo/etiquetas y filtrar por fechas; eliminar una o todas; el guardado local solo ocurre tras consentimiento explícito y se elimina al desactivarlo; importar/exportar JSON válido; backup cifrado AES-GCM de ida y vuelta, contraseña incorrecta y archivo alterado rechazados; avisar si falla el borrado del almacenamiento; confirmar cero peticiones de red con datos de diario.
- **Frontera con otras herramientas:** local-notepad: diaryestructurado no texto único. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `private journal browser` — sin métrica obtenida; no atribuir volumen.
  - `journal online free online`; `journal online with example`; `journal online no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 161 · Travel Itinerary Planner

- [ ] **C/F/E/X/L/B/P/S completos — `travel-itinerary-planner`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/travel-itinerary-planner/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `travel itinerary planner` — 4.400 búsquedas/mes US/en, KD 71; nivel B. CPC 3.95 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Días, visitas, horarios y reservas manuales, detectar solapes y exportar ICS/print. Sin API de viajes ni mapas obligatorios.
- **Prueba de aceptación específica:** Un itinerario de tres días acepta paradas solo dentro del rango. Dos eventos 09:00–10:00 y 09:45–10:30 muestran un solapamiento de 15 min; una parada 10:40 tras terminar a las 10:30 muestra un margen de 10 min si se eligieron 30 min. Editar conserva el ID y el número de paradas. JSON vuelve a importarse; ICS usa líneas CRLF escapadas/dobladas y horas locales flotantes.
- **Frontera con otras herramientas:** `fuel-cost-calculator` estima combustible/precio del viaje; esta herramienta organiza paradas y horarios, no coste. No se enlaza a una lista de equipaje inexistente ni se crean rutas por modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `trip itinerary maker` — 3.600/mes US/en; KD 45.
  - `travel itinerary planner free online`; `travel itinerary planner with example`; `travel itinerary planner no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Estado del checkpoint 2026-10-08:** motor, formulario, controlador, copy inglés y fixtures están implementados; 35 locales siguen como borradores y bloqueados por el gate. No se publica esta URL hasta cerrar idioma, QA visual y gates globales.

### 184 · Round Robin Tournament Generator

- [ ] **P/S pendientes; C/F/E/X/L/B implementados localmente — `round-robin-tournament-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/round-robin-tournament-generator/`; otras 35 versiones con los prefijos del anexo. No declarar publicada hasta confirmar workflows, rutas y sitemap en producción.
- **Demanda:** `round robin tournament generator` — 2.900 búsquedas/mes US/en, KD 8; nivel B. CPC 2.74 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Calendario todos contra todos, descansos, ida/vuelta y clasificación local; no usar cuadro eliminatorio como sustituto.
- **Prueba de aceptación específica:** 4equiposgeneran6partidosunavuelta
- **Frontera con otras herramientas:** tournament-bracket-generator: ligano eliminación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `round robin schedule generator` — 480/mes US/en; KD 15.
  - `round robin tournament generator free online`; `round robin tournament generator with example`; `round robin tournament generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Checkpoint local 2026-10-09:** círculo Berger, 2–32 participantes, descansos, ida/vuelta con localía revertida, sorteo opcional, puntuación y clasificación en vivo, CSV seguro e impresión local; 36 copias estáticas. 8 pruebas focalizadas; 1.313/1.313 regresiones, gate de traducciones aprobado, build del hub 3.312 páginas. Chrome EN/AR confirma cinco rondas/diez partidos para cinco participantes, tabla reactiva y consola limpia; campos de resultado accesibles con `id` y `name`. P/S todavía pendiente; ver `PROGRESS.md`.

### 187 · Project Risk Matrix

- [ ] **C/F/E/X/L/B/P/S completos — `project-risk-matrix`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/project-risk-matrix/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `risk assessment matrix` — 2.900 búsquedas/mes US/en, KD 19; nivel B. CPC 11.52 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Probabilidad, impacto, mitigación, responsable y exportación CSV; fórmula y escalas visibles, sin certificación de seguridad.
- **Prueba de aceptación específica:** Bajarprobabilidad reducepuntaje
- **Frontera con otras herramientas:** decision-matrix: riesgosnotomasdedecisión. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `project risk matrix` — 40/mes US/en; KD 12.
  - `risk assessment matrix free online`; `risk assessment matrix with example`; `risk assessment matrix no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 188 · Org Chart Maker

- [ ] **C/F/E/X/L/B/P/S completos — `org-chart-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/org-chart-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `org chart maker` — 2.900 búsquedas/mes US/en, KD 23; nivel B. CPC 22.73 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Jerarquía de cargos/equipos, referencias de personas y fotos locales, importar/exportar; modo de múltiples responsables declarado, no un árbol de ideas renombrado.
- **Prueba de aceptación específica:** Dosjefes incompatibles segúnmodo rechazados
- **Frontera con otras herramientas:** mind-map-maker: estructuraorganizativano ideas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `organizational chart maker` — 2.900/mes US/en; KD 20.
  - `org chart maker free online`; `org chart maker with example`; `org chart maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `organigramm erstellen` 3.600/mes, KD 3.

### 217 · Sankey Diagram Generator

- [ ] **C/F/E/X/L/B/P/S completos — `sankey-diagram-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/sankey-diagram-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `sankey diagram generator` — 1.900 búsquedas/mes US/en, KD 10; nivel B. CPC 3.16 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Flujos ponderados, balance por nodo, layout y exportación SVG; ciclos y pérdidas tratados según modelo documentado.
- **Prueba de aceptación específica:** Entradas/salidasseexplican yanchossiguenpesos
- **Frontera con otras herramientas:** chart-maker: flujoponderado no bar/line. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `sankey chart maker` — 170/mes US/en; KD 11.
  - `sankey diagram generator free online`; `sankey diagram generator with example`; `sankey diagram generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 220 · Event Budget Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `event-budget-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/event-budget-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `wedding budget calculator` — 1.900 búsquedas/mes US/en, KD 15; nivel B. CPC 4.64 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Partidas fijas y por asistente, reservas de contingencia, planificado/real y exportación; un evento, no un segundo presupuesto doméstico.
- **Prueba de aceptación específica:** Aumentarinvitadosaumentacostesvariables
- **Frontera con otras herramientas:** household-budget-planner: evento único y costeporpersona. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `event budget calculator` — 30/mes US/en; KD 0.
  - `wedding budget calculator free online`; `wedding budget calculator with example`; `wedding budget calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 232 · Decision Tree Maker

- [ ] **C/F/E/X/L/B/P/S completos — `decision-tree-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/decision-tree-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `decision tree maker` — 1.600 búsquedas/mes US/en, KD 1; nivel B. CPC 6.8 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Decisiones y azar, probabilidades, pagos y valor esperado; validar suma de ramas y exportar el árbol y tabla de cálculos.
- **Prueba de aceptación específica:** Ramasprobabilidadsumana1
- **Frontera con otras herramientas:** decision-matrix: árbolconeventos no criterioponderado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `decision tree diagram tool` — sin métrica obtenida; no atribuir volumen.
  - `decision tree maker free online`; `decision tree maker with example`; `decision tree maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 238 · Shift Scheduler

- [ ] **C/F/E/X/L/B/P/S completos — `shift-scheduler`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/shift-scheduler/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `shift scheduler` — 1.600 búsquedas/mes US/en, KD 12; nivel B. CPC 23.31 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Turnos por persona, disponibilidad, pausas, totales y conflictos; calendario futuro, no duplicar registro de horas.
- **Prueba de aceptación específica:** Nopersonacon2turnossuperpuestos
- **Frontera con otras herramientas:** time-card-calculator: asignaciónfutura no fichajes. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `employee shift schedule maker` — 10/mes US/en; KD 67.
  - `shift scheduler free online`; `shift scheduler with example`; `shift scheduler no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 240 · Subscription Tracker

- [ ] **C/F/E/X/L/B/P/S completos — `subscription-tracker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/subscription-tracker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `subscription tracker` — 1.600 búsquedas/mes US/en, KD 38; nivel B. CPC 15.41 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Planes recurrentes, coste anual, próxima fecha y revisión, exportación; sin cancelar servicios ni acceder a cuentas ajenas.
- **Prueba de aceptación específica:** 10mesesda120anual
- **Frontera con otras herramientas:** household-budget-planner: recurrenciasplanesno presupuesto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `subscription cost calculator` — 30/mes US/en; KD 0.
  - `subscription tracker free online`; `subscription tracker with example`; `subscription tracker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 244 · Radar Chart Maker

- [ ] **C/F/E/X/L/B/P/S completos — `radar-chart-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/radar-chart-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `radar chart maker` — 1.300 búsquedas/mes US/en, KD 0; nivel B. CPC 6.45 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Múltiples perfiles con ejes normalizados y escalas visibles, labels y SVG; no presentar magnitudes incompatibles como comparables.
- **Prueba de aceptación específica:** Métricasenrango, noaltera unidadesocultamente
- **Frontera con otras herramientas:** chart-maker: representaciónespecializada, validarworkflow. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** D: dato/norma versionado, país y año visibles. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `spider chart generator` — 40/mes US/en; KD 0.
  - `radar chart maker free online`; `radar chart maker with example`; `radar chart maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 248 · Packing Box Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `packing-box-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/packing-box-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `moving box calculator` — 1.300 búsquedas/mes US/en, KD 11; nivel B. CPC 1.45 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Inventario de mudanza, tamaños/peso de cajas y estimación de agrupación; señalar objetos que no caben, no certificar packing óptimo.
- **Prueba de aceptación específica:** Objetograndenoencaja muestraexcepción
- **Frontera con otras herramientas:** packing-list-maker: mudanzayvolumen no checklistviaje. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `packing box calculator` — 30/mes US/en; KD 2.
  - `moving box calculator free online`; `moving box calculator with example`; `moving box calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 271 · Car Running Cost Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `car-running-cost-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/car-running-cost-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `car ownership cost calculator` — 880 búsquedas/mes US/en, KD 54; nivel C. CPC 0.53 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Costes fijos, combustible/energía, mantenimiento, seguro y depreciación manual; coste anual/km y comparación entre vehículos.
- **Prueba de aceptación específica:** Kmcero impidecosteporkmpero noanual
- **Frontera con otras herramientas:** fuel-cost-calculator: costetotalno combustible. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `car running cost calculator` — 20/mes US/en; KD 48.
  - `car ownership cost calculator free online`; `car ownership cost calculator with example`; `car ownership cost calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 312 · Writing Tracker

- [ ] **C/F/E/X/L/B/P/S completos — `writing-tracker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/writing-tracker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `writing tracker` — 390 búsquedas/mes US/en, KD 9; nivel C. CPC 9.7 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Sesiones y proyectos, metas de palabras, tendencia y exportación; historial, no repetir un contador instantáneo de texto.
- **Prueba de aceptación específica:** Sesionesnosuman dosveces
- **Frontera con otras herramientas:** word-counter: historialdeproyectos no conteoinstantáneo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `daily writing tracker` — 10/mes US/en; KD —.
  - `writing tracker free online`; `writing tracker with example`; `writing tracker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 318 · Chore Chart Maker

- [ ] **C/F/E/X/L/B/P/S completos — `chore-chart-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/chore-chart-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `chore chart maker` — 320 búsquedas/mes US/en, KD 4; nivel C. CPC 3.57 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Personas, tareas, rotaciones, distribución de carga y calendario imprimible; asignación familiar con reglas explícitas.
- **Prueba de aceptación específica:** Distribucióncarga noomitetarea
- **Frontera con otras herramientas:** task-list: distribuciónrotativafamiliar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `chore schedule generator` — 10/mes US/en; KD —.
  - `chore chart maker free online`; `chore chart maker with example`; `chore chart maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Imagen, lenguaje y creación

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Canvas/SVG o transformador de texto local; diccionario/modelo solo bajo demanda con licencia. Preview antes/después, undo/reset y copia/export. No inventar capacidades de IA.

**Pruebas adicionales para cada ficha:** Salida real reabierta, Unicode/RTL cuando aplique, transparencia/dimensiones, cancelación y original intacto.

### 004 · Word Puzzle Solver: Anagrams & Patterns

- [ ] **C/F/E/X/L/B/P/S completos — `word-puzzle-solver`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/word-puzzle-solver/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `word finder` — 673.000 búsquedas/mes US/en, KD 68; nivel A. CPC 1.8 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Anagramas, comodines y patrones de letras en una única página; diccionarios por idioma bajo demanda, longitud, letras excluidas y filtros. Incluir ayuda de crucigramas sin prometer resolver pistas semánticas.
- **Prueba de aceptación específica:** Todasletrasde salidaprovienende entrada
- **Frontera con otras herramientas:** random-word-generator: resolver letrasno generarazar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `anagram solver` — 301.000/mes US/en; KD 34.
  - `word finder free online`; `word finder with example`; `word finder no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `word finder` 90.500/mes, KD 97; UK/en `anagram solver` 1.000.000/mes, KD 25; AU/en `anagram solver` 165.000/mes, KD 41; DE/de `anagramm löser` 1.900/mes, KD 0.

### 008 · Text To Speech

- [ ] **C/F/E/X/L/B/P/S completos — `text-to-speech`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/text-to-speech/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `text to speech` — 301.000 búsquedas/mes US/en, KD 94; nivel A. CPC 2.1 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Lectura de texto con voces locales disponibles, velocidad, pausa, reanudación y resaltado; advertir cuando la voz sea remota y no seleccionarla por defecto. Sin voz instalada, explicar la limitación; no prometer MP3 si el navegador no lo exporta.
- **Prueba de aceptación específica:** Stopcancelaasícomovozausente semuestra
- **Frontera con otras herramientas:** media-transcriber: reproducciónno reconocimiento; privacidadvozverificarse. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `tts reader online` — 390/mes US/en; KD 43.
  - `text to speech free online`; `text to speech with example`; `text to speech no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `text to speech` 33.100/mes, KD 73; UK/en `text to speech` 49.500/mes, KD 77; AU/en `text to speech` 22.200/mes, KD 76; DE/de `text vorlesen` 2.900/mes, KD 8.

### 011 · Original Name Generator

- [ ] **C/F/E/X/L/B/P/S completos — `name-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/name-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `fantasy name generator` — 165.000 búsquedas/mes US/en, KD 15; nivel A. CPC 2.47 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Suite local de nombres de negocios, usuarios y personajes con reglas distintas, diccionarios originales/licenciados, filtros, seed y favoritos; nunca afirmar disponibilidad de marcas o dominios.
- **Prueba de aceptación específica:** No afirmarmarcadisponible
- **Frontera con otras herramientas:** random-name-picker: generanombresnocoge lista. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `business name generator` — 49.500/mes US/en; KD 62.
  - `random username generator` — 12.100/mes US/en; KD 24.
  - `fantasy name generator free online`; `fantasy name generator with example`; `fantasy name generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `fantasy name generator` 14.800/mes, KD 16; UK/en `fantasy name generator` 14.800/mes, KD 17; AU/en `fantasy name generator` 9.900/mes, KD 13.

### 017 · Random Word Generator

- [ ] **C/F/E/X/L/B/P/S completos — `random-word-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/random-word-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `random word generator` — 135.000 búsquedas/mes US/en, KD 21; nivel A. CPC 3.74 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Palabras de un diccionario por idioma, filtros de longitud/categoría y generación sin repetir; copiar, guardar listas y cambiar semilla.
- **Prueba de aceptación específica:** Palabrasdelidiomaelegido, sinrellenoinglés
- **Frontera con otras herramientas:** lorem-ipsum-generator: estímuloléxico no textoplaceholder. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `random words generator` — 1.900/mes US/en; KD 36.
  - `random word generator free online`; `random word generator with example`; `random word generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `random word generator` 14.800/mes, KD 34; UK/en `random word generator` 33.100/mes, KD 36; AU/en `random word generator` 14.800/mes, KD 34.

### 020 · Bra Size Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `bra-size-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/bra-size-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `bra size calculator` — 135.000 búsquedas/mes US/en, KD 45; nivel A. CPC 2.05 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Medidas manuales, tabla de tallas por sistema y equivalencias. Mostrar cómo medir, diferencias entre marcas y ajuste orientativo; ninguna valoración médica ni promesa de talla perfecta.
- **Prueba de aceptación específica:** Mismas medidas y tabla producen talla reproducible; centímetros y pulgadas coinciden.
- **Frontera con otras herramientas:** unit-converter: patrón de tallaje y ajuste orientativo, no unidades ni diagnóstico. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `bra size conversion calculator` — sin métrica obtenida; no atribuir volumen.
  - `bra size calculator free online`; `bra size calculator with example`; `bra size calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 023 · Logo Maker

- [ ] **C/F/E/X/L/B/P/S completos — `logo-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/logo-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `logo maker` — 135.000 búsquedas/mes US/en, KD 94; nivel A. CPC 4.61 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Asistente de wordmarks y geometría original: tipografía local, espaciado, alineación, versiones monocromas y exportación SVG/PNG. No copiar marcas, ni afirmar que un nombre está disponible.
- **Prueba de aceptación específica:** NombretextoescapadoySVG legible
- **Frontera con otras herramientas:** svg-editor: muycerca; solo si workflowlogotiporealnuevo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `text logo maker` — 260/mes US/en; KD 97.
  - `logo maker free online`; `logo maker with example`; `logo maker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `logo maker` 18.100/mes, KD 91; UK/en `logo maker` 40.500/mes, KD 92; AU/en `logo maker` 18.100/mes, KD 91.

### 034 · Image Color Picker

- [ ] **C/F/E/X/L/B/P/S completos — `image-color-picker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/image-color-picker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `image color picker` — 60.500 búsquedas/mes US/en, KD 26; nivel A. CPC 2.34 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Elegir píxel con zoom y teclado, mostrar coordenadas, alpha, HEX/RGB y copiar una lista de muestras. La imagen permanece local.
- **Prueba de aceptación específica:** Pixelrojo daHEXff0000
- **Frontera con otras herramientas:** color-converter: seleccionarimagen noconvertircolor ingresado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pick color from image` — 1.300/mes US/en; KD 21.
  - `image color picker free online`; `image color picker with example`; `image color picker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `image color picker` 4.400/mes, KD 25; UK/en `image color picker` 880/mes, KD 31; AU/en `image color picker` 1.900/mes, KD 19.

### 037 · Image Upscaler

- [ ] **C/F/E/X/L/B/P/S completos — `image-upscaler`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/image-upscaler/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `image upscaler` — 60.500 búsquedas/mes US/en, KD 56; nivel A. CPC 3.71 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Superresolución con un modelo local de licencia compatible; procesar por teselas, mostrar progreso y cancelar. Si el modelo no cabe o no funciona en CPU/WASM, no lanzar una promesa de IA: mantener la candidata bloqueada.
- **Prueba de aceptación específica:** Dimensiones2x, cancelación, pérdidacuidadocumentada
- **Frontera con otras herramientas:** image-resizer-compressor: detalleinferido no simpleescalado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `upscale image online` — 880/mes US/en; KD 59.
  - `image upscaler free online`; `image upscaler with example`; `image upscaler no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `image upscaler` 12.100/mes, KD 58; UK/en `image upscaler` 14.800/mes, KD 60; AU/en `image upscaler` 8.100/mes, KD 55; DE/de `bild hochskalieren` 3.600/mes, KD 0.

### 049 · Rhyme Finder

- [ ] **C/F/E/X/L/B/P/S completos — `rhyme-finder`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rhyme-finder/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rhyming dictionary` — 40.500 búsquedas/mes US/en, KD 50; nivel A. CPC 2.22 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Diccionarios fonéticos licenciados por idioma, rimas exactas/aproximadas y filtros de sílabas. Sin diccionario fiable, permitir listas propias y explicar lo que no se puede evaluar.
- **Prueba de aceptación específica:** Palabrasconmismosufijofonémicoseagrupan
- **Frontera con otras herramientas:** spelling-practice: léxicocreativo no evaluación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `rhyme finder` — 1.600/mes US/en; KD 48.
  - `rhyming dictionary free online`; `rhyming dictionary with example`; `rhyming dictionary no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `rhyming dictionary` 4.400/mes, KD 46; UK/en `rhyming dictionary` 9.900/mes, KD 51; AU/en `rhyming dictionary` 1.900/mes, KD 44; DE/de `reimfinder` 590/mes, KD 0.

### 073 · Color Mixer

- [ ] **C/F/E/X/L/B/P/S completos — `color-mixer`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/color-mixer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `color mixer` — 22.200 búsquedas/mes US/en, KD 33; nivel A. CPC 0.26 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Mezcla RGB lineal, pesos editables y modo de pigmentos solo con modelo citado. Mostrar que la mezcla física de pinturas no se predice exactamente con una pantalla.
- **Prueba de aceptación específica:** 50%rojo50%azulsimétrico
- **Frontera con otras herramientas:** color-palette-generator: mezclafísica/digital no armonía. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `mix paint colors online` — 10/mes US/en; KD 19.
  - `color mixer free online`; `color mixer with example`; `color mixer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 082 · Image Vectorizer

- [ ] **C/F/E/X/L/B/P/S completos — `image-vectorizer`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/image-vectorizer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `image vectorizer` — 18.100 búsquedas/mes US/en, KD 51; nivel A. CPC 4.01 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Trazado local real a paths SVG: número de colores, umbral, simplificación de nodos, preview y descarga. No incrustar un bitmap y llamarlo vectorización.
- **Prueba de aceptación específica:** PNG simpleproduce pathsSVGno imagenembebida
- **Frontera con otras herramientas:** image-format-converter: vectorreal no rasterencapsulado. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `png to svg vectorizer` — 20/mes US/en; KD —.
  - `image vectorizer free online`; `image vectorizer with example`; `image vectorizer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `bild vektorisieren` 880/mes, KD 12.

### 085 · Image Splitter

- [ ] **C/F/E/X/L/B/P/S completos — `image-splitter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/image-splitter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `image splitter` — 14.800 búsquedas/mes US/en, KD 5; nivel A. CPC 2.05 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Dividir por rejilla o tamaño, ordenar teselas, opción de solapamiento y descargar un ZIP. El conjunto debe reconstruir la imagen original sin huecos.
- **Prueba de aceptación específica:** Teselas reconstruyen raster original sinhuecos
- **Frontera con otras herramientas:** image-cropper: particiónpor lotes no recorteindividual. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `split image into tiles` — 20/mes US/en; KD 18.
  - `image splitter free online`; `image splitter with example`; `image splitter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `bild aufteilen` 70/mes, KD 0.

### 098 · Image Region Redactor: Pixelate or Blur

- [ ] **C/F/E/X/L/B/P/S completos — `image-region-redactor`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/image-region-redactor/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `image pixelator` — 12.100 búsquedas/mes US/en, KD 9; nivel A. CPC 6.52 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Seleccionarregiones, pixelar/blur, salidanueva ycomprobarexport
- **Prueba de aceptación específica:** Redactada región no recupera píxelesoriginales enoutput
- **Frontera con otras herramientas:** photo-mosaic-maker: privacidadporregion noefectoglobal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `blur face online` — 210/mes US/en; KD 16.
  - `image pixelator free online`; `image pixelator with example`; `image pixelator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 109 · Image Sharpener

- [ ] **C/F/E/X/L/B/P/S completos — `image-sharpener`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/image-sharpener/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `image sharpener` — 9.900 búsquedas/mes US/en, KD 23; nivel B. CPC 3.3 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Unsharp mask con radio, cantidad y umbral; comparar antes/después, deshacer y descargar copia. Ninguna solicitud con la imagen ni mejora de detalle inexistente prometida.
- **Prueba de aceptación específica:** Amount0 conserva cada píxel RGBA decodificado dentro del procesamiento; salida PNG conserva sus valores, JPEG se reconoce como formato con pérdida
- **Frontera con otras herramientas:** image-editor: mejoraedgefilter, soloadmitir si nofunción existente. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `sharpen image online` — 880/mes US/en; KD 27.
  - `image sharpener free online`; `image sharpener with example`; `image sharpener no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 139 · Writing Prompt Generator

- [ ] **C/F/E/X/L/B/P/S completos — `writing-prompt-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/writing-prompt-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `writing prompt generator` — 5.400 búsquedas/mes US/en, KD 10; nivel B. CPC 6.26 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Componer personaje, situación y conflicto desde textos originales/licenciados; filtros, semilla, favoritos y estructura de argumento. No usar LLM remoto ni repetir una segunda URL para plot generator.
- **Prueba de aceptación específica:** SinconectarseLLM; resultadoconsistente
- **Frontera con otras herramientas:** random-word-generator: consignanarrativa no lista. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `story prompt generator` — 1.600/mes US/en; KD 16.
  - `writing prompt generator free online`; `writing prompt generator with example`; `writing prompt generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 145 · Color Palette From Image

- [ ] **C/F/E/X/L/B/P/S completos — `color-palette-from-image`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/color-palette-from-image/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `color palette from image` — 5.400 búsquedas/mes US/en, KD 27; nivel B. CPC 5.37 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Extraer colores dominantes mediante clustering local, pesos, HEX/RGB y tokens CSS/JSON. Mostrar porcentaje de cada color y excluir alpha transparente cuando corresponda.
- **Prueba de aceptación específica:** Imagenunicolor extraeuncolor dominante
- **Frontera con otras herramientas:** color-palette-generator: extraerpixelno generarteoría. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `image color palette extractor` — 210/mes US/en; KD 19.
  - `color palette from image free online`; `color palette from image with example`; `color palette from image no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 150 · Text Summarizer

- [ ] **C/F/E/X/L/B/P/S completos — `text-summarizer`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/text-summarizer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `text summarizer` — 5.400 búsquedas/mes US/en, KD 62; nivel B. CPC 3.85 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Resumen extractivo local: seleccionar oraciones de la entrada por ranking, ajustar extensión y revisar las oraciones elegidas. No prometer un resumen generativo ni inventar hechos; método por idioma documentado.
- **Prueba de aceptación específica:** Cadaoraciónsale de entrada, nohechosinventados
- **Frontera con otras herramientas:** word-counter: reducircontenidono contar. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `extractive text summarizer` — sin métrica obtenida; no atribuir volumen.
  - `text summarizer free online`; `text summarizer with example`; `text summarizer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 169 · Color Name Finder

- [ ] **C/F/E/X/L/B/P/S completos — `color-name-finder`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/color-name-finder/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `color name finder` — 3.600 búsquedas/mes US/en, KD 23; nivel B. CPC 0.75 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Buscar el nombre más próximo en una paleta licenciada, distancia perceptual y coincidencia exacta. No atribuir nombres oficiales a resultados aproximados.
- **Prueba de aceptación específica:** Color exactoenlistatiene distancia0
- **Frontera con otras herramientas:** color-converter: nombresemánticono conversiónespacios. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `nearest color name` — sin métrica obtenida; no atribuir volumen.
  - `color name finder free online`; `color name finder with example`; `color name finder no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 170 · Photo To Sketch

- [ ] **C/F/E/X/L/B/P/S completos — `photo-to-sketch`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/photo-to-sketch/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `photo to sketch` — 3.600 búsquedas/mes US/en, KD 24; nivel B. CPC 4.17 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Filtro local de bordes y tonos con intensidad, detalle, comparación y salida PNG. Conservar el original y explicar que no es una reconstrucción manual.
- **Prueba de aceptación específica:** Entradablancaproducesalidablanca yoriginalintacto
- **Frontera con otras herramientas:** image-editor: transformación artística distinta de slidersbásicos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `image to pencil sketch` — 720/mes US/en; KD 19.
  - `photo to sketch free online`; `photo to sketch with example`; `photo to sketch no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 172 · Readability Checker

- [x] **C/F/E/X/L/B/P/S completos — `readability-checker`**
- **Destino publicado:** `https://tools.usefulverse.com/tools/readability-checker/` + 35 variantes localizadas, presentes en el sitemap público. QA funcional y RTL documentados en `docs/growth600/PROGRESS.md`.
- **Demanda:** `readability checker` — 3.600 búsquedas/mes US/en, KD 34; nivel B. CPC 5.86 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Fórmulas de legibilidad apropiadas para cada idioma soportado, números intermedios y explicación. Donde no exista fórmula fiable, no aplicar Flesch inglés silenciosamente.
- **Prueba de aceptación específica:** Ejemploverificado coincideconfórmula
- **Frontera con otras herramientas:** reading-speed-test: legibilidad estimada no tiempolector. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `flesch reading ease calculator` — 1.300/mes US/en; KD 34.
  - `readability checker free online`; `readability checker with example`; `readability checker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 218 · Speed Reading App

- [ ] **C/F/E/X/L/B/P/S completos — `speed-reading-app`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/speed-reading-app/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `speed reading app` — 1.900 búsquedas/mes US/en, KD 12; nivel B. CPC 3.29 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Lectura RSVP y modo normal con texto propio, velocidad, pausa, retroceso, progreso y contexto. No afirmar que mejora comprensión o velocidad de todas las personas.
- **Prueba de aceptación específica:** Ordenpalabrasymarcadoresseconservan
- **Frontera con otras herramientas:** reading-speed-test: entrenamientolecturano medirvelocidad. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `spritz reader` — 90/mes US/en; KD 4.
  - `speed reading app free online`; `speed reading app with example`; `speed reading app no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 225 · Mockup Generator

- [ ] **C/F/E/X/L/B/P/S completos — `mockup-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mockup-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `mockup generator` — 1.900 búsquedas/mes US/en, KD 60; nivel B. CPC 4.38 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Plantillas de dispositivos originales SVG, insertar una captura local, ajustar recorte/perspectiva y exportar PNG. Ningún asset comercial ni foto remota obligatoria.
- **Prueba de aceptación específica:** Imagensolo local, cornersnofiltranfuera
- **Frontera con otras herramientas:** image-overlay: presentaciónproducto, no capaslibres. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `device mockup generator` — 70/mes US/en; KD 36.
  - `mockup generator free online`; `mockup generator with example`; `mockup generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 245 · Acrostic Poem Maker

- [ ] **C/F/E/X/L/B/P/S completos — `acrostic-poem-maker`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/acrostic-poem-maker/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `acrostic poem generator` — 1.300 búsquedas/mes US/en, KD 1; nivel B. CPC 2.27 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Acrósticos guiados a partir de iniciales, palabras propias y plantillas originales; vista previa y exportación. No prometer poesía generativa libre.
- **Prueba de aceptación específica:** Primerasletrascoincidenconentrada
- **Frontera con otras herramientas:** writing-prompt-generator: composiciónpoéticaestructurada. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `acrostic poem generator free online`; `acrostic poem generator with example`; `acrostic poem generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 259 · Word Frequency Counter

- [ ] **C/F/E/X/L/B/P/S completos — `word-frequency-counter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/word-frequency-counter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `keyword density checker` — 1.000 búsquedas/mes US/en, KD 29; nivel B. CPC 11.22 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Contar términos y n-gramas, stopwords editables, frecuencia absoluta/relativa, búsqueda y CSV; separar de recuento total de palabras protegido.
- **Prueba de aceptación específica:** Texto aa aa bb da conteo2y1
- **Frontera con otras herramientas:** word-counter: analítica léxica no conteototal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `word frequency counter` — 880/mes US/en; KD 0.
  - `keyword density checker free online`; `keyword density checker with example`; `keyword density checker no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 276 · Image Histogram

- [ ] **C/F/E/X/L/B/P/S completos — `image-histogram`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/image-histogram/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `image histogram` — 720 búsquedas/mes US/en, KD 3; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Histogramas por canal y luminancia, clipping, comparación y exportación; todos los píxeles deben pertenecer a los bins definidos.
- **Prueba de aceptación específica:** Suma bins correspondecantidadpíxeles
- **Frontera con otras herramientas:** image-color-picker: distribución no muestraaislada. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `photo histogram analyzer` — sin métrica obtenida; no atribuir volumen.
  - `image histogram free online`; `image histogram with example`; `image histogram no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 283 · Font Pairing Tool

- [x] **C/F/E/X/L/B/P/S completos — `font-pairing-tool`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/font-pairing-tool/`; otras 35 versiones con los prefijos del anexo.
- **Demanda:** `font pair generator` — 720 búsquedas/mes US/en, KD 37; nivel C. CPC 4.74 USD (no CPM).
- **Función y frontera comprobadas:** Comparar jerarquía de encabezado/cuerpo con seis presets de stacks del sistema, escalas, pesos y altura de línea ajustables, vista previa, intercambio de roles y exportación CSS. Hasta ocho fuentes seleccionadas del dispositivo (TTF/OTF/WOFF/WOFF2), máximo 5 MiB por archivo/15 MiB total; se cargan en memoria del navegador solo al elegirlas, no se suben ni se descargan fuentes externas. El usuario debe comprobar las licencias; no se ofrecen presets externos bajo una licencia supuesta.
- **Pruebas de aceptación superadas:** Cero solicitudes de fuente/red externa en carga inicial; los seis presets producen los pares definidos; intercambio y reset restauran valores coherentes; CSS solo acepta stacks y nombres internos permitidos. Las validaciones limitan formato, cantidad y tamaño, y limpiar elimina las entradas `FontFace` de la sesión. El upload real de una fuente no se pudo probar porque el control de navegador no permite acceder a ese archivo del sistema; formato/tamaño y lógica pasan pruebas automatizadas.
- **Frontera con otras herramientas:** font-tester: combinaciones tipográficas no inspecciónfont. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Solo lectura local de archivo elegida por el usuario y uso temporal de memoria; límites explícitos y nota sobre recursos/licencia del dispositivo. No hay API, Worker ni procesamiento remoto.
- **Pruebas/publicación:** suite focal 57/57; `npm test` 1.382/1.382; `npm run check` preserva 10.260 URLs del sitio principal; `locale:release-check` pasa. Build aislado: 3.636 páginas (100 herramientas × 36 idiomas + 36 portadas). Chrome EN/AR: presets, swap, reset, LTR/RTL y ausencia de peticiones de fuentes externas; sin errores visibles. No se ejecutó PageSpeed/Lighthouse.
- **Consultas secundarias del mismo propietario:**
  - `font pairing tool` — 90/mes US/en; KD 24.
  - `font pair generator free online`; `font pair generator with example`; `font pair generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Publicación confirmada:** PR [#61](https://github.com/pedronunezwebs-hash/usefulverse/pull/61) fusionada en `636e134c860f019a169ca13cf230691a5fd23476`; validación PR 37849556075; deploy principal 37849893982; publicación del hub 37850612894. Rutas EN/ES/AR HTTP 200; sitemap del hub 3.636 URLs únicas con 36 rutas de esta candidata; sitemap principal 10.260. Publicación no demuestra indexación ni se declara envío manual a Search Console.
- **Estado de la candidata:** publicada en 36 locales; copy automático comprensible sin revisión nativa; metadatos dentro de los límites.
- **Longtails funcionales:** ya cubiertas en preview de parejas heading/body, presets, jerarquía tipográfica, carga local y exportación CSS; no publicar una URL por modificador.

### 319 · Css Border Radius Generator

- [ ] **C/F/E/X/L/B/P/S completos — `css-border-radius-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/css-border-radius-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `border radius generator` — 320 búsquedas/mes US/en, KD 12; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Radios independientes y elípticos, porcentajes, preview y copiar CSS; control por teclado y casos de radios que el navegador normaliza.
- **Prueba de aceptación específica:** Todosradios0generanrectángulo
- **Frontera con otras herramientas:** css-clip-path-editor: radiosdelborde no clip. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `css border radius generator` — 90/mes US/en; KD 8.
  - `border radius generator free online`; `border radius generator with example`; `border radius generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Juegos y práctica

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Motor de reglas separado, assets originales/licenciados y estado serializable; bot/generador en worker si hace falta. RNG, seed y corpus de partidas para comprobar reglas.

**Pruebas adicionales para cada ficha:** Legalidad, score y estados finales; miles de semillas/pruebas de propiedades con ejecución acotada para puzzles complejos. No repetir siempre la misma partida.

### 001 · Snake Game

- [ ] **C/F/E/X/L/B/P/S completos — `snake-game`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/snake-game/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `snake game` — 7.480.000 búsquedas/mes US/en, KD 53; nivel A. CPC 0.76 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Juego original de serpiente, crecimiento, colisiones, velocidad, controles touch/teclado, pausa y récord local; obstáculos/semilla opcionales y partidas nuevas.
- **Prueba de aceptación específica:** Comer añade longitud; tocar una pared/cuerpo según reglas termina; la pausa no mueve el tablero.
- **Frontera con otras herramientas:** sliding-puzzle: mecánica distinta. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `snake online` — 74.000/mes US/en; KD 47.
  - `snake game free online`; `snake game with example`; `snake game no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `snake game` 450.000/mes, KD 50; UK/en `snake game` 368.000/mes, KD 52; AU/en `snake game` 368.000/mes, KD 47; DE/de `snake spiel` 18.100/mes, KD 22.

### 002 · Spider Solitaire

- [ ] **C/F/E/X/L/B/P/S completos — `spider-solitaire`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/spider-solitaire/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `spider solitaire` — 1.000.000 búsquedas/mes US/en, KD 57; nivel A. CPC 0.45 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Spider de 1/2/4 palos, movimientos legales, reparto, secuencias completas, undo, sugerencia y nuevos deals con seed.
- **Prueba de aceptación específica:** Una secuencia K→A del mismo palo se retira; cartas ocultas se exponen según reglas; no duplicar cartas.
- **Frontera con otras herramientas:** solitaire: variante conreglasdistintas de Klondike. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `spider solitaire online` — 33.100/mes US/en; KD 55.
  - `spider solitaire free online`; `spider solitaire with example`; `spider solitaire no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `spider solitaire` 201.000/mes, KD 53; UK/en `spider solitaire` 246.000/mes, KD 53; AU/en `spider solitaire` 110.000/mes, KD 44; DE/de `spider solitär` 165.000/mes, KD 0.

### 003 · Freecell

- [ ] **C/F/E/X/L/B/P/S completos — `freecell`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/freecell/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `freecell` — 673.000 búsquedas/mes US/en, KD 57; nivel A. CPC 0.24 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Free Cell completo: celdas libres, columnas, foundations, supermoves, undo, sugerencias y deals reproducibles.
- **Prueba de aceptación específica:** Capacidad de supermove calculada según celdas y columnas libres; mazo conserva exactamente 52 cartas.
- **Frontera con otras herramientas:** solitaire: juegodistinto de Klondike. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `freecell solitaire online` — 4.400/mes US/en; KD 55.
  - `freecell free online`; `freecell with example`; `freecell no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `freecell` 135.000/mes, KD 53; UK/en `freecell` 110.000/mes, KD 53; AU/en `freecell` 60.500/mes, KD 54; DE/de `freecell kostenlos` 14.800/mes, KD 10.

### 005 · Spades Game

- [ ] **C/F/E/X/L/B/P/S completos — `spades-game`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/spades-game/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `spades game` — 550.000 búsquedas/mes US/en, KD 53; nivel A. CPC 2.63 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Parejas con bots locales, bids, bags, trump, seguir palo, manos y puntuación; dificultad sin red.
- **Prueba de aceptación específica:** No jugar otro palo teniendo el requerido; cumplir bids y bags altera score según reglas anunciadas.
- **Frontera con otras herramientas:** hearts-game: contratopuentesybids noevitarpuntos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `spades online` — 165.000/mes US/en; KD 33.
  - `spades game free online`; `spades game with example`; `spades game no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `spades game` 33.100/mes, KD 32; UK/en `spades game` 27.100/mes, KD 52; AU/en `spades game` 14.800/mes, KD 35.

### 010 · Euchre

- [ ] **C/F/E/X/L/B/P/S completos — `euchre`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/euchre/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `euchre` — 201.000 búsquedas/mes US/en, KD 30; nivel A. CPC 3.39 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Baraja de 24, equipos, bidding, trump y bowers; bot local y score de ronda.
- **Prueba de aceptación específica:** El left bower cuenta como trump, no como su palo impreso; follow-suit utiliza esa transformación.
- **Frontera con otras herramientas:** spades-game: baraja24ybowers distinto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `euchre card game online` — 8.100/mes US/en; KD 27.
  - `euchre free online`; `euchre with example`; `euchre no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `euchre` 49.500/mes, KD 25; UK/en `euchre` 6.600/mes, KD 20; AU/en `euchre` 14.800/mes, KD 25.

### 013 · Cribbage

- [ ] **C/F/E/X/L/B/P/S completos — `cribbage`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/cribbage/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `cribbage` — 165.000 búsquedas/mes US/en, KD 33; nivel A. CPC 1.65 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Pegging, pares, runs, quince, crib, show y bot local, con explicación de score.
- **Prueba de aceptación específica:** Una combinación que suma 15 vale 2; las combinaciones de score se cuentan sin duplicar identidades.
- **Frontera con otras herramientas:** gin-rummy: puntuaciónsuma ypegging distinta. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `cribbage game online` — 49.500/mes US/en; KD 24.
  - `cribbage free online`; `cribbage with example`; `cribbage no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `cribbage` 60.500/mes, KD 31; UK/en `cribbage` 27.100/mes, KD 24; AU/en `cribbage` 8.100/mes, KD 24.

### 015 · Gin Rummy

- [ ] **C/F/E/X/L/B/P/S completos — `gin-rummy`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/gin-rummy/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `gin rummy` — 165.000 búsquedas/mes US/en, KD 43; nivel A. CPC 2.42 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Melds, deadwood, robo/descarte, knock, gin, bot local, score y nuevos deals.
- **Prueba de aceptación específica:** Una carta no puede pertenecer a melds incompatibles; deadwood se minimiza por combinaciones válidas.
- **Frontera con otras herramientas:** spades-game: combinaciones no trucos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `gin rummy online` — 22.200/mes US/en; KD 43.
  - `gin rummy free online`; `gin rummy with example`; `gin rummy no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `gin rummy` 14.800/mes, KD 40; UK/en `gin rummy` 12.100/mes, KD 25; AU/en `gin rummy` 8.100/mes, KD 41.

### 019 · Hearts Game

- [ ] **C/F/E/X/L/B/P/S completos — `hearts-game`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/hearts-game/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `hearts card game online` — 135.000 búsquedas/mes US/en, KD 42; nivel A. CPC 2.58 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cuatro manos con bots locales, seguir palo, pasar cartas, romper corazones, puntos y shoot the moon; reglas visibles.
- **Prueba de aceptación específica:** Respetar palo obligatorio y restricciones de primera baza; score total de una mano conserva los puntos previstos.
- **Frontera con otras herramientas:** solitaire: juego detrucos distintodelsolitario. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `hearts game` — 33.100/mes US/en; KD 57.
  - `hearts card game online free online`; `hearts card game online with example`; `hearts card game online no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `hearts card game online` 33.100/mes, KD 34; UK/en `hearts card game online` 12.100/mes, KD 41; AU/en `hearts card game online` 5.400/mes, KD 34.

### 022 · Typing Practice

- [ ] **C/F/E/X/L/B/P/S completos — `typing-practice`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/typing-practice/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `typing practice` — 135.000 búsquedas/mes US/en, KD 51; nivel A. CPC 0.84 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Lecciones progresivas por dedos/filas/layout, texto por idioma, feedback, precisión y progreso local.
- **Prueba de aceptación específica:** La lección usa las teclas previstas; score ignora teclas de control y no duplica pulsaciones.
- **Frontera con otras herramientas:** typing-speed-test: entrenamientono examen WPM. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `touch typing lessons` — 27.100/mes US/en; KD 30.
  - `typing practice free online`; `typing practice with example`; `typing practice no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `typing practice` 27.100/mes, KD 44; UK/en `typing practice` 9.900/mes, KD 45; AU/en `typing practice` 8.100/mes, KD 51.

### 028 · Mancala

- [ ] **C/F/E/X/L/B/P/S completos — `mancala`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/mancala/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `mancala` — 74.000 búsquedas/mes US/en, KD 17; nivel A. CPC 0.3 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Kalah con siembra, captura, turno extra, final y bot local; reglas visibles y reinicio.
- **Prueba de aceptación específica:** Total de semillas se conserva; captura, turno extra y recogida final aplican correctamente.
- **Frontera con otras herramientas:** backgammon: semillas no dados. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `mancala game online` — 4.400/mes US/en; KD 26.
  - `mancala free online`; `mancala with example`; `mancala no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `mancala` 5.400/mes, KD 24; UK/en `mancala` 4.400/mes, KD 15; AU/en `mancala` 2.900/mes, KD 25.

### 035 · Dominoes Game

- [ ] **C/F/E/X/L/B/P/S completos — `dominoes-game`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/dominoes-game/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `dominoes game` — 60.500 búsquedas/mes US/en, KD 48; nivel A. CPC 0.76 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Dominó doble-seis, modalidad draw/block, extremos legales, score y bot local.
- **Prueba de aceptación específica:** Fichas encajan en extremo compatible; todas pertenecen al set sin duplicar identidad.
- **Frontera con otras herramientas:** battleship: tiles ymanosdistintas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `dominoes online` — 12.100/mes US/en; KD 38.
  - `dominoes game free online`; `dominoes game with example`; `dominoes game no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `dominoes game` 4.400/mes, KD 45; UK/en `dominoes game` 9.900/mes, KD 18; AU/en `dominoes game` 2.900/mes, KD 29.

### 041 · Pyramid Solitaire

- [ ] **C/F/E/X/L/B/P/S completos — `pyramid-solitaire`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/pyramid-solitaire/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `pyramid solitaire` — 49.500 búsquedas/mes US/en, KD 41; nivel A. CPC 2.16 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Parejas que suman 13, reyes solos, stock/waste, reglas de reciclado elegidas, undo y repartos nuevos.
- **Prueba de aceptación específica:** El rey puede salir solo; una carta cubierta no se juega; todas las cartas mantienen identidad.
- **Frontera con otras herramientas:** solitaire: mecánicadeparejasdistinta. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `pyramid solitaire online` — 2.900/mes US/en; KD 29.
  - `pyramid solitaire free online`; `pyramid solitaire with example`; `pyramid solitaire no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `pyramid solitaire` 6.600/mes, KD 36; UK/en `pyramid solitaire` 6.600/mes, KD 28; AU/en `pyramid solitaire` 2.900/mes, KD 38.

### 044 · Rebus Puzzles

- [ ] **C/F/E/X/L/B/P/S completos — `rebus-puzzles`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/rebus-puzzles/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `rebus puzzles` — 40.500 búsquedas/mes US/en, KD 5; nivel A. CPC 0.32 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Acertijos visuales originales/licenciados, hints, solución revisada y variedad; controles y texto accesibles.
- **Prueba de aceptación específica:** Cada respuesta explica el acertijo y fue revisada; no repetir un único puzzle como juego ilimitado.
- **Frontera con otras herramientas:** crossword-online: acertijovisual distinto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `picture word puzzles` — 1.000/mes US/en; KD 18.
  - `rebus puzzles free online`; `rebus puzzles with example`; `rebus puzzles no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `rebus puzzles` 5.400/mes, KD 6; UK/en `rebus puzzles` 3.600/mes, KD 7; AU/en `rebus puzzles` 6.600/mes, KD 9.

### 046 · Killer Sudoku

- [ ] **C/F/E/X/L/B/P/S completos — `killer-sudoku`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/killer-sudoku/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `killer sudoku` — 40.500 búsquedas/mes US/en, KD 27; nivel A. CPC 4.09 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Sudoku con cages de suma, notas, checker, hints y puzzles nuevos cuya solución se valida.
- **Prueba de aceptación específica:** Todas las cages cumplen suma y no repetición; filas/columnas/bloques válidos; unicidad comprobada si se promete.
- **Frontera con otras herramientas:** sudoku: variante sustancial; revisarintenciónmantenersolocages. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `killer sudoku online` — 4.400/mes US/en; KD 25.
  - `killer sudoku free online`; `killer sudoku with example`; `killer sudoku no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `killer sudoku` 8.100/mes, KD 9; UK/en `killer sudoku` 40.500/mes, KD 24; AU/en `killer sudoku` 8.100/mes, KD 26.

### 047 · Sudoku Solver

- [ ] **C/F/E/X/L/B/P/S completos — `sudoku-solver`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/sudoku-solver/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `sudoku solver` — 40.500 búsquedas/mes US/en, KD 34; nivel A. CPC 0.25 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Introducir puzzle externo, errores por unidad, solución, unicidad y pasos compatibles con técnicas realmente implementadas.
- **Prueba de aceptación específica:** Un puzzle inválido falla; uno sin solución lo indica; no inventar unicidad con la primera solución encontrada.
- **Frontera con otras herramientas:** sudoku: juego propio; resolverexternosconexplicación. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `solve sudoku online` — 3.600/mes US/en; KD 36.
  - `sudoku solver free online`; `sudoku solver with example`; `sudoku solver no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `sudoku solver` 5.400/mes, KD 32; UK/en `sudoku solver` 18.100/mes, KD 22; AU/en `sudoku solver` 8.100/mes, KD 33.

### 048 · Hangman Game

- [ ] **C/F/E/X/L/B/P/S completos — `hangman-game`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/hangman-game/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `hangman game` — 40.500 búsquedas/mes US/en, KD 42; nivel A. CPC 0.32 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Palabraslicenciadasporidioma, dificultad, letras, ayuda ypartidasazar
- **Prueba de aceptación específica:** Letrasrepetidasno gastanintento
- **Frontera con otras herramientas:** spelling-practice: juegoazar no listapersonal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `hangman online` — 8.100/mes US/en; KD 41.
  - `hangman game free online`; `hangman game with example`; `hangman game no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `hangman game` 3.600/mes, KD 39; UK/en `hangman game` 6.600/mes, KD 41; AU/en `hangman game` 2.900/mes, KD 40; DE/de `galgenmännchen spiel` 1.300/mes, KD 0.

### 055 · Aim Trainer

- [ ] **C/F/E/X/L/B/P/S completos — `aim-trainer`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/aim-trainer/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `aim trainer` — 33.100 búsquedas/mes US/en, KD 36; nivel A. CPC 3.39 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Objetivos, duración, precisión, dificultad, mouse/touch y score; no afirmar equivalencia a rendimiento de un videojuego concreto.
- **Prueba de aceptación específica:** Hit y miss suman intentos; un clic cuenta una sola vez; targets no aparecen fuera del área.
- **Frontera con otras herramientas:** mouse-tester: habilidad nohardware. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `mouse accuracy trainer` — 20/mes US/en; KD —.
  - `aim trainer free online`; `aim trainer with example`; `aim trainer no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `aim trainer` 6.600/mes, KD 28; UK/en `aim trainer` 6.600/mes, KD 35; AU/en `aim trainer` 4.400/mes, KD 34.

### 062 · Chess Puzzles

- [ ] **C/F/E/X/L/B/P/S completos — `chess-puzzles`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/chess-puzzles/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `chess puzzles` — 27.100 búsquedas/mes US/en, KD 35; nivel A. CPC 0.23 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Posiciones originales/licenciadas, tácticas/mates, validación de movimientos, hints y retos variados; no publicar respuestas no comprobadas.
- **Prueba de aceptación específica:** La secuencia propuesta es legal y satisface el objetivo en la posición; puzzles malformados no se muestran.
- **Frontera con otras herramientas:** chess-game: entrenamiento no partida. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `chess tactics trainer` — 170/mes US/en; KD 1.
  - `chess puzzles free online`; `chess puzzles with example`; `chess puzzles no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `chess puzzles` 5.400/mes, KD 25; UK/en `chess puzzles` 5.400/mes, KD 34; AU/en `chess puzzles` 2.400/mes, KD 33; DE/de `schachaufgaben` 1.300/mes, KD 6.

### 072 · Dots And Boxes

- [ ] **C/F/E/X/L/B/P/S completos — `dots-and-boxes`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/dots-and-boxes/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `dots and boxes` — 22.200 búsquedas/mes US/en, KD 25; nivel A. CPC 0.47 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Líneas, cajas, turnos adicionales, score y bot local; controles touch/teclado.
- **Prueba de aceptación específica:** Cerrar una caja añade un punto y conserva turno según reglas; cada caja se cuenta una sola vez.
- **Frontera con otras herramientas:** tic-tac-toe: bordesycajasno alineaciones. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `dots boxes game online` — sin métrica obtenida; no atribuir volumen.
  - `dots and boxes free online`; `dots and boxes with example`; `dots and boxes no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 074 · Chess Analysis Board

- [ ] **C/F/E/X/L/B/P/S completos — `chess-analysis-board`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/chess-analysis-board/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `chess analysis board` — 22.200 búsquedas/mes US/en, KD 49; nivel A. CPC 1.46 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Importar FEN/PGN, engine WASM local bajo demanda, profundidad/tiempo elegidos, líneas y cancelar; no usar engine remoto.
- **Prueba de aceptación específica:** FEN inválido se rechaza; variantes son legales; detener corta el engine y no congela el UI.
- **Frontera con otras herramientas:** chess-game: análisiscomputer no passandplay. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `chess engine analysis` — 480/mes US/en; KD 49.
  - `chess analysis board free online`; `chess analysis board with example`; `chess analysis board no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 075 · Blackjack Game

- [ ] **C/F/E/X/L/B/P/S completos — `blackjack-game`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/blackjack-game/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `blackjack game` — 22.200 búsquedas/mes US/en, KD 50; nivel A. CPC 5.27 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Práctica sin dinero real ni premios: shoe, hit/stand/double/split permitidos, reglas y score de aprendizaje.
- **Prueba de aceptación específica:** Ases valen 1 u 11 para evitar bust cuando sea posible; split y cierre de manos cumplen la regla elegida.
- **Frontera con otras herramientas:** solitaire: juego21 noapuesta real. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `blackjack practice` — 1.900/mes US/en; KD 39.
  - `blackjack game free online`; `blackjack game with example`; `blackjack game no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 090 · Tripeaks Solitaire

- [ ] **C/F/E/X/L/B/P/S completos — `tripeaks-solitaire`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/tripeaks-solitaire/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `tripeaks solitaire` — 14.800 búsquedas/mes US/en, KD 53; nivel A. CPC 4.03 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Tres picos, cartas expuestas, valores adyacentes, stock, score, undo y repartos nuevos.
- **Prueba de aceptación específica:** Una carta cubierta no es jugable; rango adyacente según política de wrap elegida.
- **Frontera con otras herramientas:** pyramid-solitaire: secuenciasdevalor no parejas13. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `tripeaks card game` — 210/mes US/en; KD 52.
  - `tripeaks solitaire free online`; `tripeaks solitaire with example`; `tripeaks solitaire no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 103 · Gomoku

- [ ] **C/F/E/X/L/B/P/S completos — `gomoku`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/gomoku/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `gomoku` — 12.100 búsquedas/mes US/en, KD 29; nivel A. CPC 0.37 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Tablero libre 15×15, cinco en línea, reglas claras y bot local acotado.
- **Prueba de aceptación específica:** Una línea de cinco gana, cuatro no; no aceptar jugada fuera de tablero ni sobre piedra existente.
- **Frontera con otras herramientas:** connect-four: tablero libre nocolumnasgravedad. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `five in a row online` — 20/mes US/en; KD 39.
  - `gomoku free online`; `gomoku with example`; `gomoku no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 105 · Poker Odds Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `poker-odds-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/poker-odds-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `poker odds calculator` — 9.900 búsquedas/mes US/en, KD 7; nivel B. CPC 7.03 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cartas conocidas, manos válidas, enumeración o Monte Carlo local con seed, intervalos/progreso y cancelar; sin apuestas ni enlaces de juego.
- **Prueba de aceptación específica:** Rechazar cartas repetidas; win/tie/loss suman 100%; casos deterministas coinciden con enumeración exacta.
- **Frontera con otras herramientas:** probability-calculator: motorcartasespecífico. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `texas holdem odds calculator` — 590/mes US/en; KD 10.
  - `poker odds calculator free online`; `poker odds calculator with example`; `poker odds calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 110 · Ludo Game

- [ ] **C/F/E/X/L/B/P/S completos — `ludo-game`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/ludo-game/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `ludo game` — 9.900 búsquedas/mes US/en, KD 29; nivel B. CPC 0.58 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Juego de recorrido local con dados, casillas seguras, entrada/salida, finish y bots/pass-and-play; reglas visibles.
- **Prueba de aceptación específica:** Una ficha no entra ni captura fuera de las reglas; terminar exige la política de tirada exacta elegida.
- **Frontera con otras herramientas:** backgammon: carreraporpista no24puntos. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `ludo online local` — 10/mes US/en; KD —.
  - `ludo game free online`; `ludo game with example`; `ludo game no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 111 · Sequence Memory Practice

- [ ] **C/F/E/X/L/B/P/S completos — `memory-test`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/memory-test/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `memory test` — 9.900 búsquedas/mes US/en, KD 41; nivel B. CPC 2.48 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Retención de dígitos y patrones visuales, dificultad progresiva, demostración y respuesta separadas, score local. No inferir IQ, diagnóstico ni capacidad clínica.
- **Prueba de aceptación específica:** Duracióndemostraciónacordealargo, answercorrecto
- **Frontera con otras herramientas:** memory-game: retención secuencial no parejas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `digit span test` — 1.600/mes US/en; KD 0.
  - `memory test free online`; `memory test with example`; `memory test no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 114 · Crossword Online

- [ ] **C/F/E/X/L/B/P/S completos — `crossword-online`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/crossword-online/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `crossword online` — 9.900 búsquedas/mes US/en, KD 73; nivel B. CPC 0.43 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Crucigramas de pistas originales/licenciadas, teclado, hints, comprobación y selección aleatoria; distinto del creador de crucigramas propios.
- **Prueba de aceptación específica:** Letras cruzadas y respuestas coinciden; ninguna pista sin respuesta ni permiso de redistribución.
- **Frontera con otras herramientas:** crossword-maker: crear conparespropios vsjugarpistaslicenciadas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `play crossword online` — 590/mes US/en; KD 80.
  - `crossword online free online`; `crossword online with example`; `crossword online no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 121 · Logic Grid Puzzle

- [ ] **C/F/E/X/L/B/P/S completos — `logic-grid-puzzle`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/logic-grid-puzzle/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `logic grid puzzle` — 8.100 búsquedas/mes US/en, KD 38; nivel B. CPC 1.11 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Entidades y pistas originales, matriz de exclusiones, notas, checker, hints y generador/banco con soluciones verificadas.
- **Prueba de aceptación específica:** Existe exactamente una asignación que satisface las pistas cuando se promete unicidad.
- **Frontera con otras herramientas:** nurikabe: deducciónsemántica no islas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `logic puzzle online` — 5.400/mes US/en; KD 40.
  - `logic grid puzzle free online`; `logic grid puzzle with example`; `logic grid puzzle no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 143 · Sokoban

- [ ] **C/F/E/X/L/B/P/S completos — `sokoban`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/sokoban/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `sokoban` — 5.400 búsquedas/mes US/en, KD 25; nivel B. CPC 0.13 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Niveles originales/licenciados, empujar cajas, objetivos, undo, reinicio, teclado/touch y progreso local.
- **Prueba de aceptación específica:** Cajas no atraviesan paredes; un nivel publicado tiene una solución verificada y todos los objetivos alcanzables.
- **Frontera con otras herramientas:** sliding-puzzle: jugador/cajas no deslizarnúmeros. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `sokoban online` — 260/mes US/en; KD 11.
  - `sokoban free online`; `sokoban with example`; `sokoban no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `sokoban online` 320/mes, KD 3.

### 146 · Maze Generator

- [ ] **C/F/E/X/L/B/P/S completos — `maze-generator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/maze-generator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `maze generator` — 5.400 búsquedas/mes US/en, KD 30; nivel B. CPC 1.44 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Laberintos con tamaño, seed, generación, solución, juego de navegación y SVG; una URL para crear y jugar.
- **Prueba de aceptación específica:** Todas las celdas accesibles según modo; ruta al destino existe; seed reproduce el mismo laberinto.
- **Frontera con otras herramientas:** sliding-puzzle: laberintos distinto. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `maze maker` — 1.000/mes US/en; KD 21.
  - `maze generator free online`; `maze generator with example`; `maze generator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 167 · Hitori

- [ ] **C/F/E/X/L/B/P/S completos — `hitori`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/hitori/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `hitori` — 3.600 búsquedas/mes US/en, KD 18; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Tachar números para eliminar duplicados, negros no adyacentes, blancos conectados, hints y puzzles nuevos.
- **Prueba de aceptación específica:** Solución no deja números repetidos en filas/columnas blancas; los blancos siguen conectados.
- **Frontera con otras herramientas:** nonogram: descartarnúmerosno dibujarimagen. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `hitori puzzle online` — 10/mes US/en; KD 11.
  - `hitori free online`; `hitori with example`; `hitori no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 168 · Nurikabe

- [ ] **C/F/E/X/L/B/P/S completos — `nurikabe`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/nurikabe/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `nurikabe` — 3.600 búsquedas/mes US/en, KD 19; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Islas con tamaños, mar conectado y regla de no 2×2; notas, hints y puzzles variados.
- **Prueba de aceptación específica:** Mar conectado y sin 2×2; cada isla contiene exactamente un número y tamaño correcto.
- **Frontera con otras herramientas:** nonogram: particiónregionesdistinta. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `nurikabe puzzle online` — 30/mes US/en; KD 9.
  - `nurikabe free online`; `nurikabe with example`; `nurikabe no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 186 · Slitherlink

- [x] **C/F/E/X/L/B/P/S completos — `slitherlink`**
- **Destino:** `https://tools.usefulverse.com/tools/slitherlink/` y otras 35 versiones con los prefijos del anexo. Publicado y sitemap público verificado.
- **Demanda:** `slitherlink` — 2.900 búsquedas/mes US/en, KD 18; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Bucle único, contadores, marcas, undo, checker y generación de puzzles comprobados.
- **Prueba de aceptación específica:** Cada nodo del bucle tiene grado 2; no existen bucles separados ni una bifurcación.
- **Frontera con otras herramientas:** nonogram: líneasno cuadradospintados. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Generador local de 4×4 a 6×6, con solver acotado que comprueba unicidad antes de aceptar cada tablero. Comprueba un único bucle continuo y pistas; sin backend, API o dependencias remotas. La generación usa CPU del dispositivo y puede tardar más en hardware lento; el navegador informa de ese límite.
- **Estado (2026-10-09):** lógica, formulario, copy en 36 idiomas y QA local completados. Suite focalizada 171/171; `npm test` 1.328/1.328; `npm run check` conserva las 10.260 URLs principales; `locale:release-check` pasa. Controlador minificado 9.873 B. Chrome EN/ES/AR comprobado, árabe RTL; consola limpia. Build/sitemap aislado con 3.384 URLs únicas. PR #52 fusionada (`eb166a30c889e94349a8bd55480d5ae1dec2c457`), CI 37824491231, deploy principal 37824909881 y deploy del hub 37824928039 correctos. Rutas EN/ES/AR y sitemap público HTTP 200; 3.384 `<loc>` únicas, incluidas las 36 variantes. Publicación no equivale a indexación; sin PageSpeed/Lighthouse.
- **Consultas secundarias del mismo propietario:**
  - `slitherlink puzzle online` — 10/mes US/en; KD —.
  - `slitherlink free online`; `slitherlink with example`; `slitherlink no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 199 · Peg Solitaire

- [x] **C/F/E/X/L/B/P/S completos — `peg-solitaire`**
- **Destino:** `https://tools.usefulverse.com/tools/peg-solitaire/` y otras 35 versiones con los prefijos del anexo. Publicado y sitemap público verificado.
- **Demanda:** `peg solitaire` — 2.400 búsquedas/mes US/en, KD 4; nivel B. CPC 0.35 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Tablero inglés clásico de 33 huecos; saltos legales, pista de una jugada legal, deshacer y reinicio; anuncia victoria o bloqueo. La pista no promete una solución completa.
- **Prueba de aceptación específica:** Salto consume la pieza intermedia y ocupa destino vacío; conteo disminuye exactamente una pieza por jugada.
- **Frontera con otras herramientas:** solitaire: tablero de clavijasnocartas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Estado (2026-10-09):** motor/controlador y 36 localizaciones estáticas. Suite focalizada 175/175; `npm test` 1.335/1.335 antes del último ajuste visual de pista, suite focalizada 175/175 repetida después; `npm run check` conserva las 10.260 URLs principales; `locale:release-check` pasa. Build aislado 3.420 URLs únicas; Chrome EN/ES/AR a 390 px, movimientos, deshacer, pista, reinicio, RTL y consola sin errores. PR #53 fusionada (`64ee36f`); CI 37828766687 y deploy principal 37829289936 correctos; publicación del hub 37829832286 correcta. URLs EN/ES/AR y sitemap público HTTP 200; **3.420 URLs únicas**, con las 36 variantes de Peg Solitaire. Publicado no equivale a indexado. No PageSpeed/Lighthouse.
- **Consultas secundarias del mismo propietario:**
  - `peg solitaire online` — 260/mes US/en; KD 0.
  - `peg solitaire free online`; `peg solitaire with example`; `peg solitaire no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 222 · Futoshiki

- [ ] **C/F/E/X/L/B/P/S — `futoshiki`** (implementación y validación listas; P/S pendientes)
- **Destino:** `https://tools.usefulverse.com/tools/futoshiki/`; otras 35 versiones con los prefijos del anexo. La publicación final se registra en `docs/growth600/PROGRESS.md`.
- **Demanda:** `futoshiki` — 1.900 búsquedas/mes US/en, KD 33; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cuadrícula Latin con desigualdades, notas, checker, hints y generación con unicidad comprobada.
- **Prueba de aceptación específica:** Todas las desigualdades se cumplen; cada fila/columna contiene los valores permitidos una vez.
- **Frontera con otras herramientas:** sudoku: desigualdades no bloques3x3. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** Generador y solver propios, sin dependencia, llamada de red, almacenamiento ni API; cómputo acotado y bajo demanda en el navegador. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `futoshiki puzzle online` — 10/mes US/en; KD 7.
  - `futoshiki free online`; `futoshiki with example`; `futoshiki no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 260 · Hashi Puzzle

- [ ] **C/F/E/X/L/B/P/S completos — `hashi-puzzle`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/hashi-puzzle/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `hashi puzzle` — 1.000 búsquedas/mes US/en, KD 31; nivel B. CPC 1.28 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Islas y puentes simples/dobles, grados, conectividad, no cruces, hints y puzzles variados.
- **Prueba de aceptación específica:** Grafo final conectado, grados exactos y puentes sin cruces; una isla no queda aislada incorrectamente.
- **Frontera con otras herramientas:** kakuro: puentesno sumas. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `bridges puzzle online` — 10/mes US/en; KD 17.
  - `hashi puzzle free online`; `hashi puzzle with example`; `hashi puzzle no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 280 · Chess Opening Trainer

- [x] **C/F/E/X/L/B/P/S completos — `chess-opening-trainer`**
- **Publicado:** `https://tools.usefulverse.com/tools/chess-opening-trainer/` y 35 versiones localizadas; las 36 forman parte del sitemap público del hub.
- **Demanda:** `chess openings practice` — 720 búsquedas/mes US/en, KD 17; nivel C. CPC 0.99 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Árbol de aperturas original/licenciado, repaso de variantes, respuestas y progreso local; no otra partida libre de ajedrez.
- **Prueba de aceptación específica:** Cada variante son movimientos legales desde posición inicial; la desviación explica el movimiento esperado.
- **Frontera con otras herramientas:** chess-puzzles: aperturas no tácticafinal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** L: motor local ligero previsto; verificar alcance y unidades/formato. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `chess opening trainer` — 390/mes US/en; KD 25.
  - `chess openings practice free online`; `chess openings practice with example`; `chess openings practice no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Checklist · Estimaciones de salud y actividad

Tachar la casilla de una herramienta solo al cerrar C/F/E/X/L/B/P/S. Las etapas internas se conservan en el registro online, no se infieren de tener una URL.

**Patrón técnico de esta familia:** Fórmula/protocolo citado con población, supuestos y unidades; cálculo local sin recomendar tratamiento. Si no hay método responsable para el alcance anunciado, bloquear la publicación.

**Pruebas adicionales para cada ficha:** Comparar con ejemplo de fuente primaria; unidades métricas/imperiales, extremos y fuera de población. No diagnóstico ni resultados con falsa precisión.

### 012 · Bac Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `bac-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/bac-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `bac calculator` — 165.000 búsquedas/mes US/en, KD 28; nivel A. CPC 5.67 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Estimación Widmark y rango incertidumbre; no decidir conducción ni seguridad
- **Prueba de aceptación específica:** Alcohol0 da estimación0
- **Frontera con otras herramientas:** unit-converter: modelo fisiológico, publicación solo con fuente/revisión. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `blood alcohol calculator` — 165.000/mes US/en; KD 46.
  - `bac calculator free online`; `bac calculator with example`; `bac calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 021 · Sleep Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `sleep-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/sleep-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `sleep calculator` — 135.000 búsquedas/mes US/en, KD 49; nivel A. CPC 5.32 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Horarios desde despertar/dormir, latencia editable y descanso; no ciclos exactos prometidos
- **Prueba de aceptación específica:** 8h antes de07:00 da23:00 sin latencia
- **Frontera con otras herramientas:** online-timer: planificación sueño no cuenta atrás. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `sleep cycle calculator` — 9.900/mes US/en; KD 45.
  - `sleep calculator free online`; `sleep calculator with example`; `sleep calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `sleep calculator` 18.100/mes, KD 46; UK/en `sleep calculator` 18.100/mes, KD 47; AU/en `sleep calculator` 12.100/mes, KD 46; DE/de `schlafrechner` 5.400/mes, KD 0.

### 025 · Protein Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `protein-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/protein-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `protein calculator` — 110.000 búsquedas/mes US/en, KD 34; nivel A. CPC 0.38 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Rango por peso y actividad con fuente, unidades y explicación
- **Prueba de aceptación específica:** Factor1.2 por70kg da84g
- **Frontera con otras herramientas:** macro-calorie-calculator: necesidad proteica por factor no reparto porcentual. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `daily protein calculator` — 720/mes US/en; KD 27.
  - `protein calculator free online`; `protein calculator with example`; `protein calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `protein calculator` 14.800/mes, KD 32; UK/en `protein calculator` 8.100/mes, KD 8; AU/en `protein calculator` 9.900/mes, KD 24; DE/de `proteinbedarf rechner` 1.000/mes, KD 0.

### 036 · Weight Loss Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `weight-loss-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/weight-loss-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `weight loss calculator` — 60.500 búsquedas/mes US/en, KD 52; nivel A. CPC 1.1 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Escenarios de balance energético y plazo, sin dietas extremas ni garantías
- **Prueba de aceptación específica:** Déficit cero no produce descenso proyectado
- **Frontera con otras herramientas:** bmr-tdee-calculator: proyección por objetivo y límites; revisión salud requerida. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `weight loss calorie deficit calculator` — 1.600/mes US/en; KD 58.
  - `weight loss calculator free online`; `weight loss calculator with example`; `weight loss calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `weight loss calculator` 6.600/mes, KD 49; UK/en `weight loss calculator` 12.100/mes, KD 46; AU/en `weight loss calculator` 4.400/mes, KD 33.

### 045 · Calories Burned Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `calories-burned-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/calories-burned-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `calories burned calculator` — 40.500 búsquedas/mes US/en, KD 23; nivel A. CPC 0.41 USD (no CPM).
- **Función mínima y ampliaciones útiles:** MET por actividad con base estática citada, duración y peso
- **Prueba de aceptación específica:** MET1 equivale a gasto de referencia por definición usada
- **Frontera con otras herramientas:** bmr-tdee-calculator: sesión deportiva no gasto diario. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `exercise calorie calculator` — 3.600/mes US/en; KD 41.
  - `calories burned calculator free online`; `calories burned calculator with example`; `calories burned calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `calories burned calculator` 3.600/mes, KD 34; UK/en `calories burned calculator` 2.900/mes, KD 34; AU/en `calories burned calculator` 1.900/mes, KD 39; DE/de `kalorienverbrauch rechner` 2.400/mes, KD 23.

### 050 · Water Intake Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `water-intake-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/water-intake-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `water intake calculator` — 33.100 búsquedas/mes US/en, KD 3; nivel A. CPC 1.79 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Referencia orientativa según fuente y aportación de alimentos, sin diagnóstico
- **Prueba de aceptación específica:** Conversión consistente de litros y tazas
- **Frontera con otras herramientas:** body-water-calculator: ingesta orientativa no agua corporal. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `daily water calculator` — 27.100/mes US/en; KD 4.
  - `water intake calculator free online`; `water intake calculator with example`; `water intake calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `water intake calculator` 2.400/mes, KD 31; UK/en `water intake calculator` 880/mes, KD 18; AU/en `water intake calculator` 1.300/mes, KD 31; DE/de `wasserbedarf rechner` 590/mes, KD 5.

### 064 · Body Surface Area Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `body-surface-area-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/body-surface-area-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `body surface area calculator` — 22.200 búsquedas/mes US/en, KD 4; nivel A. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Mosteller y Du Bois, comparación métrica/imperial; sin dosificación
- **Prueba de aceptación específica:** 170cm y70kg Mosteller aproxima1.818m²
- **Frontera con otras herramientas:** adult-bmi-calculator: área superficial no IMC. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `bsa calculator` — 22.200/mes US/en; KD 4.
  - `body surface area calculator free online`; `body surface area calculator with example`; `body surface area calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** CA/en `body surface area calculator` 1.900/mes, KD 0; UK/en `body surface area calculator` 2.400/mes, KD 0; AU/en `body surface area calculator` 1.600/mes, KD 0.

### 084 · Vo2 Max Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `vo2-max-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/vo2-max-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `vo2 max calculator` — 14.800 búsquedas/mes US/en, KD 2; nivel A. CPC 0.57 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Protocolos campo definidos Cooper/Rockport con condiciones y fuente
- **Prueba de aceptación específica:** Ejemplo publicado del protocolo recupera VO2
- **Frontera con otras herramientas:** heart-rate-zone-calculator: capacidad aeróbica no frecuencia. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `vo2 calculator` — 14.800/mes US/en; KD 2.
  - `vo2 max calculator free online`; `vo2 max calculator with example`; `vo2 max calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 091 · Ideal Weight Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `ideal-weight-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/ideal-weight-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `ideal weight calculator` — 14.800 búsquedas/mes US/en, KD 62; nivel A. CPC 1.06 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Rango de peso adulto y métodos comparados, sin objetivo clínico prescrito
- **Prueba de aceptación específica:** Unidades imperial y métrica producen mismo rango
- **Frontera con otras herramientas:** adult-bmi-calculator: objetivos por métodos, posible cercanía; fuente clínica requerida. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `healthy weight range calculator` — 110/mes US/en; KD 62.
  - `ideal weight calculator free online`; `ideal weight calculator with example`; `ideal weight calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 106 · Heart Rate Zone Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `heart-rate-zone-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/heart-rate-zone-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `heart rate zone calculator` — 9.900 búsquedas/mes US/en, KD 8; nivel B. CPC 1.28 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Métodos frecuencia máxima y Karvonen, zonas editables y límites
- **Prueba de aceptación específica:** Reposo60, máx180 y50% reserva da120
- **Frontera con otras herramientas:** workout-planner: intensidad calculada no agenda. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `target heart rate calculator` — 9.900/mes US/en; KD 36.
  - `heart rate zone calculator free online`; `heart rate zone calculator with example`; `heart rate zone calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Otras métricas muestreadas:** DE/de `pulszonen rechner` 50/mes, KD 20.

### 125 · Lean Body Mass Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `lean-body-mass-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/lean-body-mass-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `lean body mass calculator` — 6.600 búsquedas/mes US/en, KD 0; nivel B. CPC 1.46 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Estimación por masa grasa conocida y ecuaciones publicadas
- **Prueba de aceptación específica:** 80kg con20% grasa da64kg
- **Frontera con otras herramientas:** body-fat-calculator: masa libre de grasa no porcentaje. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `lean body mass formula calculator` — 20/mes US/en; KD 0.
  - `lean body mass calculator free online`; `lean body mass calculator with example`; `lean body mass calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 130 · Waist To Hip Ratio Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `waist-to-hip-ratio-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/waist-to-hip-ratio-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `waist to hip ratio calculator` — 6.600 búsquedas/mes US/en, KD 20; nivel B. CPC 1.02 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Cintura, cadera, razón y explicación sin diagnóstico individual
- **Prueba de aceptación específica:** Cintura80 cadera100 da0.8
- **Frontera con otras herramientas:** body-fat-calculator: razón corporal no grasa. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `waist hip ratio calculator` — 6.600/mes US/en; KD 12.
  - `waist to hip ratio calculator free online`; `waist to hip ratio calculator with example`; `waist to hip ratio calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 228 · Sleep Debt Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `sleep-debt-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/sleep-debt-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `sleep debt calculator` — 1.600 búsquedas/mes US/en, KD 0; nivel B. CPC 1.87 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Registro local de sueño y referencia elegida, balance semanal
- **Prueba de aceptación específica:** 7 días con déficit1h da7h orientativas
- **Frontera con otras herramientas:** sleep-calculator: historial y déficit, no hora de acostarse. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `sleep deficit calculator` — 1.600/mes US/en; KD 0.
  - `sleep debt calculator free online`; `sleep debt calculator with example`; `sleep debt calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 233 · Push Up Test

- [ ] **C/F/E/X/L/B/P/S completos — `push-up-test`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/push-up-test/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `push up test` — 1.600 búsquedas/mes US/en, KD 2; nivel B. CPC 1.61 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Registro manual de series, pausas y progresión; no activar cámara
- **Prueba de aceptación específica:** Serie vacía no cuenta repetición
- **Frontera con otras herramientas:** workout-planner: registro de prueba, no prescripción. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `push up fitness test` — 210/mes US/en; KD 0.
  - `push up test free online`; `push up test with example`; `push up test no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 241 · Sobriety Counter

- [ ] **C/F/E/X/L/B/P/S completos — `sobriety-counter`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/sobriety-counter/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `sobriety counter` — 1.600 búsquedas/mes US/en, KD 43; nivel B. CPC 2.99 USD (no CPM).
- **Función mínima y ampliaciones útiles:** Hitos desde una fecha, registro optativo local y notas privadas
- **Prueba de aceptación específica:** Fecha inicial hoy da0 días
- **Frontera con otras herramientas:** date-calculator: historial/hitos de recuperación; no consejo clínico. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `days sober calculator` — 880/mes US/en; KD 3.
  - `sobriety counter free online`; `sobriety counter with example`; `sobriety counter no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 253 · Hiking Time Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `hiking-time-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/hiking-time-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `hiking time calculator` — 1.000 búsquedas/mes US/en, KD 4; nivel B. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Distancia, ascenso, método y ritmo personalizado
- **Prueba de aceptación específica:** Ascenso adicional aumenta tiempo
- **Frontera con otras herramientas:** fuel-cost-calculator: estimación senderismo no trayecto vehicular. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `naismith rule calculator` — 10/mes US/en; KD 37.
  - `hiking time calculator free online`; `hiking time calculator with example`; `hiking time calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 264 · Wilks Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `wilks-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/wilks-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `dots calculator powerlifting` — 880 búsquedas/mes US/en, KD 0; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Puntuación de levantamiento por fórmulas versionadas y sexo de competición
- **Prueba de aceptación específica:** Caso de federación reproduce puntuación
- **Frontera con otras herramientas:** one-rep-max-calculator: ranking relativo no fuerza máxima. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `wilks calculator` — 590/mes US/en; KD 0.
  - `dots calculator powerlifting free online`; `dots calculator powerlifting with example`; `dots calculator powerlifting no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

### 291 · Body Water Calculator

- [x] **C/F/E/X/L/B/P/S completos — `body-water-calculator`**
- **Destino:** `https://tools.usefulverse.com/tools/body-water-calculator/`; 35 versiones adicionales, un total de 36.
- **Demanda:** `body water calculator` — 590 búsquedas/mes US/en, KD 6; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Ecuaciones adultas publicadas y límites de estimación
- **Prueba de aceptación específica:** Ejemplo de fuente reproducido, no prescribir hidratación
- **Frontera con otras herramientas:** bmr-tdee-calculator: composición hídrica no calorías. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `total body water calculator` — 590/mes US/en; KD 0.
  - `body water calculator free online`; `body water calculator with example`; `body water calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.
- **Implementación y límites:** estimación adulta de agua corporal con las ecuaciones Watson; acepta altura y peso métricos o imperiales, muestra litros y proporción aproximada del peso. No diagnostica hidratación ni recomienda ingesta; excluye menores y situaciones clínicas. Cálculo local, sin API/servidor.
- **Fuente del método:** Watson et al. 1980, [PubMed](https://pubmed.ncbi.nlm.nih.gov/6986753/), [DOI](https://doi.org/10.1093/ajcn/33.1.27). Se conservan literalmente los coeficientes en todos los idiomas porque la traducción automática alteró algunos números en la muestra.
- **Publicación comprobada (2026-10-09):** 36 copias estáticas; títulos ≤60 caracteres, descripciones ≤160. Pruebas focales 70/70; suite completa previa al siguiente trabajo **1.432/1.432**; `locale:release-check`, `npm run check` (10.260 URLs originales) y build del hub (3.888 URLs, 107 × 36 + 36 portadas; 4.048 archivos). Chrome EN/AR: ejemplo 30 años/175 cm/70 kg → 41,92 L y 59,89%; unidades imperiales equivalentes dan el mismo resultado; números arábigos en árabe funcionan; edad inválida borra el resultado previo; RTL a 390 px sin overflow ni consola. PR [#68](https://github.com/pedronunezwebs-hash/usefulverse/pull/68), CI **37863855116**, merge `8ffc4dd9f896139e8bb1d07f15a16dd6708a8a25`, publicación del hub **37864335180**; URLs EN/AR HTTP 200 y sitemap público con **3.888 URLs únicas**, incluidas las 36 rutas. No se pidió indexación manual; publicar no garantiza indexación. No PageSpeed/Lighthouse.

### 298 · Cycling Power Calculator

- [ ] **C/F/E/X/L/B/P/S completos — `cycling-power-calculator`**
- **Destino propuesto:** `https://tools.usefulverse.com/tools/cycling-power-calculator/`; otras 35 versiones con los prefijos del anexo. No está declarado publicado.
- **Demanda:** `cycling watts calculator` — 480 búsquedas/mes US/en, KD 9; nivel C. CPC — USD (no CPM).
- **Función mínima y ampliaciones útiles:** Modelo aerodinámico, masa, pendiente, viento y potencia
- **Prueba de aceptación específica:** En llano aumentar velocidad aumenta potencia
- **Frontera con otras herramientas:** running-pace-calculator: potencia mecánica de ciclismo. Aplicar además las consolidaciones de §6; no crear otra URL por dirección inversa o modalidad.
- **Implementación/riesgo:** S: método/población y advertencias de salud; H: dependencia/cómputo bajo demanda; verificar licencia y compatibilidad. Seguir el patrón de la familia y los gates globales; el caso anterior no sustituye todos los tests.
- **Consultas secundarias del mismo propietario:**
  - `cycling power calculator` — 320/mes US/en; KD 10.
  - `cycling watts calculator free online`; `cycling watts calculator with example`; `cycling watts calculator no sign up` — **sugerencias sin volumen medido**, solo donde el producto resuelva realmente esa intención.
- **Longtails funcionales:** convertir las opciones concretas de «función mínima» y el ejemplo de aceptación en secciones/FAQs específicas. Añadir casos de entrada, unidades, errores y artefactos propios; no publicar una URL por modificador y no rellenar la página con frases genéricas.

## Anexo A · 277 herramientas protegidas

Metadatos del snapshot del repo, no resultados de una nueva auditoría funcional ni afirmación de deploy comprobado hoy. Las 36 URLs actuales de cada una se derivan de `https://usefulverse.com` + prefijo real + `/tools/<id>/`. Conservar todas; no replicarlas en el hub nuevo.

| # | ID / nombre actual | Función declarada y términos ya usados |
| --- | --- | --- |
| 1 | `word-counter` · Word Counter | Count words, characters, lines and reading time in one clear view.<br>Keywords: word counter, character counter, letter counter, reading time<br>Title SEO específico: Word Counter for Google Docs & Text |
| 2 | `text-case-converter` · Text Case Converter | Change text to uppercase, lowercase, sentence case or title case.<br>Keywords: uppercase converter, lowercase converter, title case, sentence case<br>Title SEO específico: Text Case Converter – Upper, Lower & Title |
| 3 | `remove-duplicate-lines` · Remove Duplicate Lines | Clean a list by removing repeated lines while keeping the original order.<br>Keywords: remove duplicate lines, unique lines, deduplicate list, clean list<br>Title SEO específico: Remove Duplicate Lines for Excel |
| 4 | `json-formatter` · JSON Formatter | Format, minify and validate JSON directly on your device.<br>Keywords: json formatter, json validator, json beautifier, json minifier<br>Title SEO específico: JSON Formatter & Validator Online |
| 5 | `base64-encoder-decoder` · Base64 Encoder & Decoder | Encode text to Base64 or decode Base64 back to readable text.<br>Keywords: base64 encoder, base64 decoder, encode base64, decode base64<br>Title SEO específico: Base64 Encoder & Decoder Online |
| 6 | `url-encoder-decoder` · URL Encoder & Decoder | Encode text for a URL or decode URL-encoded text instantly.<br>Keywords: url encoder, url decoder, percent encoding, decode URL<br>Title SEO específico: URL Encoder & Decoder Online |
| 7 | `text-to-slug` · Text to Slug | Turn a title into a clean, lowercase URL slug ready to use.<br>Keywords: text to slug, slug generator, URL slug generator, SEO slug<br>Title SEO específico: Slug Generator – SEO-Friendly URLs |
| 8 | `percentage-calculator` · Percentage Calculator | Find percentages, percentage changes and the value of a percentage in seconds.<br>Keywords: percentage calculator, percent calculator, percentage change, calculate percentage<br>Title SEO específico: Percentage Calculator – Percent & Change |
| 9 | `password-generator` · Password Generator | Create a random password locally with the length and characters you choose.<br>Keywords: password generator, strong password, random password, secure password<br>Title SEO específico: Password Generator – Strong Random Passwords |
| 10 | `timestamp-converter` · Timestamp Converter | Convert Unix timestamps to dates and dates to seconds or milliseconds.<br>Keywords: unix timestamp converter, epoch converter, timestamp to date, date to timestamp<br>Title SEO específico: Unix Timestamp Converter |
| 11 | `html-entity-encoder-decoder` · HTML Entity Encoder & Decoder | Encode special characters for HTML or decode entities back into readable text.<br>Keywords: html entity encoder, html entity decoder, escape html, html special characters<br>Title SEO específico: HTML Entity Encoder & Decoder |
| 12 | `csv-to-json` · CSV to JSON Converter | Convert comma-separated data into clean JSON in your browser.<br>Keywords: csv to json, csv converter, convert csv to json, csv parser<br>Title SEO específico: CSV to JSON Converter Online |
| 13 | `json-to-csv` · JSON to CSV Converter | Turn an array of JSON objects into a CSV file-ready table.<br>Keywords: json to csv, json converter, convert json to csv, export json csv<br>Title SEO específico: JSON to CSV Converter Online |
| 14 | `random-number-generator` · Random Number Generator | Generate secure random integers or decimal numbers between two limits.<br>Keywords: random number generator, random integer, random decimal, number picker<br>Title SEO específico: Random Number Generator 1–100 & More |
| 15 | `uuid-generator` · UUID Generator | Generate one or many version 4 UUIDs locally with a secure random source.<br>Keywords: uuid generator, guid generator, random uuid, uuid v4 generator<br>Title SEO específico: UUID Generator – UUID v4 Online |
| 16 | `sha256-hash-generator` · SHA-256 Hash Generator | Create a SHA-256 hash from text directly in your browser without uploading it.<br>Keywords: sha256 hash generator, sha-256 online, text hash, checksum generator<br>Title SEO específico: SHA-256 Hash Generator Online |
| 17 | `regex-tester` · Regex Tester | Test a regular expression against sample text and see matches clearly.<br>Keywords: regex tester, regular expression tester, regex validator, regexp online<br>Title SEO específico: Regex Tester Online |
| 18 | `jwt-decoder` · JWT Decoder | Read the header and payload of a JSON Web Token locally, without verifying it.<br>Keywords: jwt decoder, decode jwt, json web token decoder, jwt parser<br>Title SEO específico: JWT Decoder Online |
| 19 | `color-converter` · Color Converter | Convert colors between HEX, RGB and HSL and preview the result instantly.<br>Keywords: color converter, hex to rgb, rgb to hex, hex to hsl, color picker<br>Title SEO específico: Color Converter – HEX, RGB & HSL |
| 20 | `url-parser` · URL Parser | Break a URL into its protocol, host, path, query parameters and hash.<br>Keywords: url parser, parse url, query parameter viewer, url components<br>Title SEO específico: URL Parser – Query Parameters & More |
| 21 | `roman-numeral-converter` · Roman Numeral Converter | Convert numbers to Roman numerals and Roman numerals back to numbers instantly.<br>Keywords: roman numeral converter, convert roman numerals, number to roman numeral, roman numeral date converter<br>Title SEO específico: Roman Numeral Converter for Dates |
| 22 | `binary-converter` · Binary Converter | Convert integers between binary, decimal, hexadecimal and octal formats.<br>Keywords: binary converter, binary number converter, number base converter, decimal to binary, hexadecimal to binary<br>Title SEO específico: Hexadecimal to Binary & Base Converter |
| 23 | `prime-number-checker` · Prime Number Checker | Check whether an integer is prime with a clear local result.<br>Keywords: prime number checker, prime checker online, is this number prime, prime number test<br>Title SEO específico: Prime Number Checker Online |
| 24 | `average-calculator` · Average Calculator | Calculate the mean, sum, count, minimum and maximum of a list of numbers.<br>Keywords: average calculator, mean calculator, calculate average, average of numbers<br>Title SEO específico: Weighted Average Calculator for Grades |
| 25 | `ratio-proportion-calculator` · Ratio & Proportion Calculator | Solve a missing value in a ratio and simplify ratios in seconds.<br>Keywords: ratio calculator, proportion calculator, ratio and proportion, solve a proportion<br>Title SEO específico: Ratio & Proportion Calculator |
| 26 | `time-duration-calculator` · Time Duration Calculator | Find the exact duration between two dates and times in days, hours and minutes.<br>Keywords: time duration calculator, duration calculator, date time duration, hours calculator<br>Title SEO específico: Time Duration Calculator – Hours & Days |
| 27 | `number-to-words-converter` · Number to Words Converter | Convert whole numbers into clear English words directly in your browser.<br>Keywords: number to words converter, numbers to words, words to number, number converter online<br>Title SEO específico: Number to Words Converter Online |
| 28 | `remove-line-breaks` · Remove Line Breaks | Join text lines with spaces or remove line breaks instantly in your browser.<br>Keywords: remove line breaks, remove line breaks online, remove line breaks from text, line break remover<br>Title SEO específico: Remove Line Breaks from Text |
| 29 | `text-diff-checker` · Text Diff Checker | Compare two pieces of text line by line and see what changed.<br>Keywords: text diff checker, compare text online, text comparison tool, diff checker online<br>Title SEO específico: Text Diff Checker – Compare Text |
| 30 | `unit-converter` · Unit Converter | Convert common length, weight, temperature and volume units in seconds.<br>Keywords: unit converter, unit of measurement converter, measurement converter, unit converter online<br>Title SEO específico: Unit Converter – Length, Weight & More |
| 31 | `date-calculator` · Date Calculator | Calculate days between dates or add and subtract days from a date.<br>Keywords: date calculator, days between dates, date difference calculator, add days to date<br>Title SEO específico: Date Calculator – Days Between Dates |
| 32 | `qr-code-generator` · QR Code Generator | Create a downloadable QR code from a link or short text directly in your browser.<br>Keywords: qr code generator, qr generator, create qr code, qr code maker online<br>Title SEO específico: QR Code Generator – Create QR Codes |
| 33 | `time-zone-converter` · Time Zone Converter | Convert a date and time between common time zones with daylight saving support.<br>Keywords: time zone converter, date time zone converter, time zone difference, timezone converter online<br>Title SEO específico: Time Zone Converter – Compare Times |
| 34 | `xml-formatter` · XML Formatter & Validator | Format XML with readable indentation and check that its tags and structure are valid.<br>Keywords: xml formatter, xml validator, format xml online, xml beautifier, check xml syntax<br>Title SEO específico: XML Formatter & Validator Online |
| 35 | `color-contrast-checker` · Color Contrast Checker | Check text contrast against WCAG AA and AAA levels using two colors.<br>Keywords: color contrast checker, WCAG contrast checker, contrast ratio calculator, accessible color checker<br>Title SEO específico: Color Contrast Checker – WCAG AA & AAA |
| 36 | `tip-calculator` · Tip Calculator & Bill Splitter | Calculate a tip and split the total bill evenly between people.<br>Keywords: tip calculator, tip calculator by percent, split bill calculator, restaurant bill splitter<br>Title SEO específico: Tip Calculator & Bill Splitter Online |
| 37 | `gpa-calculator` · GPA Calculator | Calculate a credit-weighted GPA on a common 4.0 letter-grade scale.<br>Keywords: GPA calculator, college GPA calculator, weighted GPA calculator, calculate GPA by credits<br>Title SEO específico: GPA Calculator – Weighted 4.0 Scale |
| 38 | `file-checksum` · File Checksum Calculator | Create a SHA-256 checksum for a file in your browser and compare it with a known hash.<br>Keywords: file checksum calculator, SHA-256 file hash, checksum file online, verify file integrity<br>Title SEO específico: File Checksum Calculator – SHA-256 |
| 39 | `image-resizer-compressor` · Image Compressor & Resizer | Resize JPG, PNG, WebP, HEIC and other common images, then save a local copy as JPG, PNG or WebP.<br>Keywords: image compressor, image resizer, compress image online, reduce image file size, compress JPG, compress JPEG, compress PNG, compress WebP, compress TIFF, compress TIF, resize image online, resize image pixels, JPG image compressor, PNG image compressor, WebP compressor, TIFF to JPG, TIF to PNG<br>Title SEO específico: Image Compressor Online & Image Resizer |
| 40 | `pdf-tools` · PDF Merge, Split & Compressor | Merge or split PDFs, optimize structure while keeping text, or make a stronger image-based copy locally.<br>Keywords: compress PDF online, reduce PDF file size, PDF compressor, optimize PDF locally, compress PDF without rasterizing, merge PDF, split PDF by pages, combine PDF files, extract PDF pages, make scanned PDF smaller<br>Title SEO específico: Compress PDF Online, Merge & Split |
| 41 | `pdf-protect-unlock` · Protect or Unlock a PDF with a Password | Encrypt a PDF with separate passwords, or remove its password when you already know it. Runs locally with AES-256.<br>Keywords: protect PDF with password, password protect PDF, encrypt PDF online locally, unlock PDF with password, remove password from PDF, AES-256 PDF encryption<br>Title SEO específico: Protect or Unlock a PDF with AES-256 Password |
| 42 | `pdf-repair` · Repair a Damaged PDF File | Try to rebuild a damaged PDF locally and check that the new copy can be parsed. Recovery is best effort, not guaranteed.<br>Keywords: repair PDF, fix corrupted PDF, recover damaged PDF file, PDF repair tool online, rebuild PDF locally<br>Title SEO específico: Repair a Damaged PDF File Locally |
| 43 | `pdf-crop` · Crop PDF Pages Online | Crop PDF page margins locally with millimeter controls. This changes the visible page area but does not securely erase hidden content.<br>Keywords: crop PDF, crop PDF pages, crop PDF margins, trim PDF margins, change PDF page area, crop PDF online locally<br>Title SEO específico: Crop PDF Pages Online by Custom Margins |
| 44 | `pdf-redact` · Permanently Redact PDF Online | Permanently remove sensitive PDF content in your browser by rebuilding pages with opaque black areas.<br>Keywords: redact PDF, permanently redact PDF, remove sensitive text from PDF, black out PDF text, redact PDF online without upload<br>Title SEO específico: Permanently Redact PDF – Remove Sensitive Text |
| 45 | `pdf-to-pdfa` · Convert PDF to PDF/A-1b as an Image Copy | Create a browser-local PDF/A-1b archival copy by rebuilding each page as an image. Text and interactive content are not retained.<br>Keywords: convert PDF to PDF/A-1b, PDF/A converter locally, make scanned PDF archival, image-only PDF/A, PDF/A-1b online without upload<br>Title SEO específico: Convert PDF to PDF/A-1b – Visual Archive Copy |
| 46 | `video-compressor` · Video Compressor | Compress video to MP4 or WebM in your browser, adjust quality and resolution, and keep the original untouched.<br>Keywords: video compressor, compress video online, reduce video file size, MP4 compressor, WebM compressor, compress video without upload<br>Title SEO específico: Video Compressor Online – Reduce Video File Size |
| 47 | `audio-compressor` · Audio Compressor | Compress MP3, M4A or OGG audio in your browser. Choose a smaller file or clearer sound; your original stays on your device.<br>Keywords: audio compressor, compress audio online, reduce audio file size, MP3 compressor, compress MP3, M4A compressor, OGG compressor, compress audio without upload<br>Title SEO específico: Audio Compressor Online – MP3, M4A & OGG |
| 48 | `media-transcriber` · Audio & Video to Text Transcriber | Transcribe speech from an audio or video file to text in your browser. The media stays on your device; no server upload.<br>Keywords: audio to text, video to text, speech to text, transcribe audio online free, transcribe video online free, MP3 to text, MP4 to text, local audio transcription, private transcription<br>Title SEO específico: Audio to Text & Video Transcriber Online |
| 49 | `csv-viewer` · CSV Viewer | Open a CSV file as a searchable table in your browser without sending it anywhere.<br>Keywords: CSV viewer, open CSV online, CSV reader, view CSV file, CSV table viewer<br>Title SEO específico: CSV Viewer – Open and Search CSV Files |
| 50 | `qr-code-reader` · QR Code Reader | Read a QR code from an image or your camera, right in your browser.<br>Keywords: QR code reader, QR scanner online, scan QR code from image, QR code camera scanner<br>Title SEO específico: QR Code Reader – Scan an Image or Camera |
| 51 | `age-calculator` · Age Calculator | Calculate your exact age in years, months and days, or find how old you were on a past date.<br>Keywords: age calculator, exact age calculator, age in years months days, age on a date, days until birthday, birthday countdown<br>Title SEO específico: Age Calculator – Exact Years, Months & Days |
| 52 | `business-days-calculator` · Business Days Calculator | Count working days between dates or add and subtract workdays with custom weekends and holidays.<br>Keywords: business days calculator, working days between dates, add business days, subtract workdays, exclude holidays<br>Title SEO específico: Business Days Calculator – Exclude Holidays |
| 53 | `office-file-compressor` · Word, Excel & Power Point File Compressor | Try to reduce DOCX, XLSX and PPTX file size locally without changing document contents.<br>Keywords: compress Word document, compress DOCX, reduce DOCX file size, compress Excel file, compress XLSX, compress Power Point, compress PPTX, shrink Office file<br>Title SEO específico: Compress Word, Excel & Power Point Files |
| 54 | `image-to-pdf` · Image to PDF Converter | Convert JPG, PNG, HEIC, WebP and other images to PDF. Reorder pages and choose A4, US Letter or image size.<br>Keywords: image to PDF, JPG to PDF, JPEG to PDF, PNG to PDF, WebP to PDF, HEIC to PDF, AVIF to PDF, TIFF to PDF, TIF to PDF, convert photos to PDF, multiple images to one PDF, pictures to PDF, image PDF maker, JPG to PDF A4, photos to PDF Letter<br>Title SEO específico: Images to PDF Converter – JPG, PNG & HEIC |
| 55 | `favicon-generator` · Favicon Generator | Create a favicon package from a logo with ICO, PNG, Apple touch icon, web manifest and HTML tags.<br>Keywords: favicon generator, favicon.ico generator, favicon from PNG, website icon generator, Apple touch icon, favicon HTML code<br>Title SEO específico: Favicon Generator – ICO, PNG & HTML Code |
| 56 | `image-format-converter` · Image Format Converter | Convert JPG, PNG, WebP, HEIC, AVIF, BMP, GIF or SVG images to JPG, PNG or WebP in private batches.<br>Keywords: image format converter, image converter, PNG to WebP, WebP to PNG, WebP to JPG, JPG to WebP, JPG to PNG, PNG to JPG, JPEG to PNG, PNG to JPEG, HEIC to JPG, HEIF to JPG, AVIF to JPG, AVIF to PNG, TIFF to JPG, TIFF to PNG, TIF to JPG, SVG to PNG, SVG to JPG, BMP to PNG, convert image online, batch image converter<br>Title SEO específico: PNG to WebP, WebP to PNG & Image Converter |
| 57 | `markdown-html-converter` · Markdown to HTML Converter | Convert Markdown to HTML or HTML to Markdown with a safe preview and Git Hub Flavored Markdown options.<br>Keywords: Markdown to HTML, HTML to Markdown, Markdown converter, Git Hub Flavored Markdown converter, preview Markdown HTML<br>Title SEO específico: Markdown to HTML & HTML to Markdown |
| 58 | `json-yaml-converter` · JSON to YAML Converter | Convert JSON to YAML or YAML to formatted JSON in your browser, with safe parsing and downloadable output.<br>Keywords: JSON to YAML, YAML to JSON, JSON YAML converter, convert JSON config to YAML, convert YAML config to JSON<br>Title SEO específico: JSON to YAML & YAML to JSON Converter |
| 59 | `standard-deviation-calculator` · Standard Deviation Calculator | Calculate population or sample standard deviation, variance, mean and count from a list of numbers.<br>Keywords: standard deviation calculator, sample standard deviation, population standard deviation, variance calculator, standard deviation from a data set<br>Title SEO específico: Standard Deviation Calculator – Sample & Population |
| 60 | `discount-calculator` · Discount Calculator | Find a sale price, the amount saved or the discount percentage from the original and sale prices.<br>Keywords: discount calculator, percent off calculator, sale price calculator, calculate discount amount, reverse discount calculator<br>Title SEO específico: Discount Calculator – Sale Price & Percent Off |
| 61 | `square-footage-calculator` · Square Footage Calculator | Calculate floor area in square feet and square meters, then add a waste allowance for flooring estimates.<br>Keywords: square footage calculator, square feet calculator, room area calculator, calculate square feet from length and width, flooring waste calculator<br>Title SEO específico: Square Footage Calculator – Room Area & Flooring |
| 62 | `barcode-generator` · Barcode Generator | Generate Code 128, EAN-13 or UPC-A barcodes and download a sharp SVG or PNG without uploading your data.<br>Keywords: barcode generator, Code 128 generator, EAN-13 barcode generator, UPC-A barcode generator, create barcode online<br>Title SEO específico: Barcode Generator – Code 128, EAN-13 & UPC-A |
| 63 | `typing-speed-test` · Typing Speed Test | Take a 15, 30 or 60 second typing test and see your WPM, accuracy and correct characters instantly.<br>Keywords: typing test, typing speed test, WPM test, words per minute test, typing accuracy test, free typing test online<br>Title SEO específico: Typing Speed Test – WPM, Accuracy & Timer |
| 64 | `fraction-calculator` · Fraction Calculator | Add, subtract, multiply, divide and simplify fractions, mixed numbers and decimals with exact results.<br>Keywords: fraction calculator, add fractions, subtract fractions, multiply fractions, divide fractions, simplify fractions, mixed number calculator<br>Title SEO específico: Fraction Calculator – Add, Subtract & Simplify |
| 65 | `time-card-calculator` · Time Card Calculator | Add work shifts, subtract unpaid breaks and total weekly hours, including overnight shifts and optional gross pay.<br>Keywords: time card calculator, hours calculator, work hours calculator, timesheet calculator, time sheet calculator, calculate hours worked, time card calculator with breaks<br>Title SEO específico: Time Card Calculator – Work Hours & Breaks |
| 66 | `online-timer` · Online Timer, Stopwatch & Pomodoro | Use a countdown timer, stopwatch or Pomodoro focus timer in one simple browser tool.<br>Keywords: online timer, countdown timer, online stopwatch, Pomodoro timer, focus timer, free timer online<br>Title SEO específico: Online Timer & Pomodoro – Free Countdown and Stopwatch |
| 67 | `lorem-ipsum-generator` · Lorem Ipsum Generator | Generate placeholder text by paragraphs, sentences or words and copy it without an account.<br>Keywords: lorem ipsum generator, lorem ipsum text, dummy text generator, placeholder text generator, lorem ipsum paragraphs<br>Title SEO específico: Lorem Ipsum Generator – Placeholder Text |
| 68 | `subnet-calculator` · IPv4 Subnet Calculator | Calculate IPv4 network, subnet mask, wildcard, broadcast address and host range from an IP/CIDR.<br>Keywords: subnet calculator, IP subnet calculator, IPv4 subnet calculator, CIDR calculator, subnet mask calculator, network address calculator<br>Title SEO específico: IPv4 Subnet Calculator – CIDR & Subnet Mask |
| 69 | `random-name-picker` · Random Name Picker | Pick one or several random names from a list, with an option to prevent repeat winners.<br>Keywords: random name picker, pick a random name, name picker wheel alternative, random student picker, choose a winner from a list<br>Title SEO específico: Random Name Picker – Pick a Winner from a List |
| 70 | `fuel-cost-calculator` · Fuel Cost Calculator | Estimate trip fuel use and cost from distance, vehicle efficiency and your local fuel price.<br>Keywords: fuel cost calculator, gas cost calculator, trip fuel calculator, fuel consumption calculator, cost of driving calculator, road trip gas calculator<br>Title SEO específico: Fuel Cost Calculator – Estimate Trip Gas Cost |
| 71 | `image-cropper` · Image Cropper | Crop a picture to a custom area or common aspect ratio and download it as PNG, JPG or WebP.<br>Keywords: image cropper, crop image online, photo cropper, crop picture, square image crop, crop image to aspect ratio<br>Title SEO específico: Image Cropper – Crop Photos to Any Ratio |
| 72 | `pdf-to-image` · PDF to JPG & PNG Converter | Convert PDF pages to JPG or PNG images in your browser and download the selected pages together.<br>Keywords: PDF to JPG, PDF to PNG, convert PDF to image, PDF pages to pictures, PDF image converter, save PDF pages as images<br>Title SEO específico: PDF to JPG & PNG Converter – Export PDF Pages |
| 73 | `sql-formatter` · SQL Formatter | Format and indent SQL queries with readable line breaks while keeping your code on your device.<br>Keywords: SQL formatter, SQL beautifier, format SQL online, SQL query formatter, SQL indent, SQL code formatter<br>Title SEO específico: SQL Formatter – Format & Indent SQL Online |
| 74 | `pdf-page-editor` · PDF Page Organizer & Editor | Reorder, rotate, remove and extract PDF pages, then add page numbers or a simple text watermark locally.<br>Keywords: organize PDF pages, reorder PDF pages, rotate PDF pages, delete PDF pages, extract PDF pages, add page numbers to PDF, PDF watermark<br>Title SEO específico: PDF Page Organizer – Remove, Extract & Reorder |
| 75 | `pdf-ocr` · PDF OCR & Scanned Text Extractor | Extract selectable PDF text or recognize a scanned page locally and download the result as a text file.<br>Keywords: OCR PDF, searchable scanned PDF text, extract text from scanned PDF, PDF to text, recognize PDF text<br>Title SEO específico: PDF OCR – Extract Text from Scanned PDFs |
| 76 | `pdf-document-converter` · PDF and Word Text Converter | Extract PDF text into a simple editable DOCX or open DOCX text in a print-ready page, all in your browser.<br>Keywords: PDF to Word, PDF to DOCX, Word to PDF, DOCX to PDF, convert PDF to editable Word, extract PDF text<br>Title SEO específico: Convert PDF to Word and Word to PDF |
| 77 | `html-to-pdf` · HTML to PDF Converter | Print simple HTML text and tables to PDF using your browser. Local preview, no upload, and no website URL fetching.<br>Keywords: HTML to PDF, convert HTML to PDF, print HTML to PDF, HTML document to PDF, save HTML as PDF, HTML code to PDF<br>Title SEO específico: HTML to PDF Converter – Print HTML Locally |
| 78 | `pdf-to-markdown` · PDF to Markdown Converter | Extract selectable text from a PDF into a Markdown file with page headings, locally in your browser.<br>Keywords: PDF to Markdown, convert PDF to Markdown, PDF to MD, extract PDF text to Markdown, PDF Markdown converter<br>Title SEO específico: PDF to Markdown Converter – Extract Text Online |
| 79 | `pdf-form-filler` · Fill PDF Forms & Add a Signature | Fill supported PDF form fields and place a drawn signature on a page without uploading the document.<br>Keywords: fill PDF form online, sign PDF locally, add signature to PDF, fill and sign PDF, PDF form filler<br>Title SEO específico: Fill PDF Forms and Add a Signature |
| 80 | `pdf-compare` · Compare Two PDF Files | Compare selectable text in two PDF files page by page and review which pages changed.<br>Keywords: compare PDF files, PDF comparison, compare two PDFs, PDF text diff, find changes between PDF documents<br>Title SEO específico: Compare Two PDF Files and Find Text Changes |
| 81 | `zip-archive-tool` · ZIP File Creator & Extractor | Create a ZIP archive from selected files or extract a standard ZIP on your device.<br>Keywords: create ZIP file, unzip files online, extract ZIP, compress files to ZIP, ZIP extractor, ZIP file opener<br>Title SEO específico: Create and Extract ZIP Files Online |
| 82 | `media-converter` · Audio & Video Converter and Trimmer | Convert supported audio or video formats, trim a clip or extract audio from a video in your browser.<br>Keywords: audio converter, video converter, convert MP4 to WebM, convert audio to MP3, extract audio from video, trim video online<br>Title SEO específico: Audio and Video Converter Online |
| 83 | `scientific-calculator` · Scientific Calculator | Calculate scientific expressions with parentheses, powers, square roots, logarithms and trigonometry.<br>Keywords: scientific calculator online, online scientific calculator, sin cos tan calculator, logarithm calculator, square root calculator<br>Title SEO específico: Scientific Calculator – Trigonometry & More |
| 84 | `loan-calculator` · Loan & Mortgage Payment Calculator | Estimate monthly loan payments, total interest and payoff time, with an optional extra payment.<br>Keywords: loan payment calculator, mortgage calculator, monthly loan payment, loan amortization calculator, extra payment mortgage calculator<br>Title SEO específico: Loan Payment Calculator and Amortization |
| 85 | `compound-interest-calculator` · Compound Interest & Savings Calculator | Estimate savings growth from a starting balance, monthly contributions, interest rate and compounding frequency.<br>Keywords: compound interest calculator, savings calculator with monthly contributions, compound growth calculator, investment growth calculator<br>Title SEO específico: Compound Interest Calculator with Contributions |
| 86 | `invoice-generator` · Simple Invoice Generator | Create a simple invoice with line items, tax and totals in your browser, then print or save it as a PDF.<br>Keywords: free invoice generator, simple invoice template, invoice maker, create invoice PDF, invoice with tax calculator<br>Title SEO específico: Simple Invoice Generator – Download a PDF |
| 87 | `resume-builder` · Resume & CV Builder | Draft a simple resume or CV with a live preview and print it or save it as a PDF on your device.<br>Keywords: resume builder, CV maker, create resume online free, simple resume template, print resume to PDF<br>Title SEO específico: Resume and CV Builder – Print to PDF |
| 88 | `portrait-background-remover` · Portrait Background Remover | Remove the background from a portrait using an optional small AI model that runs on your device.<br>Keywords: remove portrait background, background remover for people, remove photo background locally, transparent portrait PNG<br>Title SEO específico: Portrait Background Remover Online |
| 89 | `gcd-lcm-calculator` · GCD and LCM Calculator | Find the greatest common divisor and least common multiple of two or more whole numbers.<br>Keywords: gcd calculator, greatest common divisor calculator, lcm calculator, least common multiple, gcd and lcm<br>Title SEO específico: GCD and LCM Calculator – Greatest Common Divisor |
| 90 | `scientific-notation-converter` · Scientific Notation Converter | Convert decimal numbers to scientific notation and convert scientific notation back to standard form.<br>Keywords: scientific notation converter, standard form to scientific notation, decimal to scientific notation, scientific notation to decimal<br>Title SEO específico: Scientific Notation Converter |
| 91 | `profit-margin-calculator` · Profit Margin Calculator | Calculate profit, profit margin, markup and selling price from your cost and revenue.<br>Keywords: profit margin calculator, gross margin calculator, markup calculator, profit percentage calculator, selling price calculator<br>Title SEO específico: Profit Margin Calculator – Margin and Markup |
| 92 | `salary-to-hourly-calculator` · Salary to Hourly Pay Calculator | Estimate an hourly rate from annual, monthly, weekly or daily pay and your work schedule.<br>Keywords: salary to hourly calculator, annual salary to hourly, hourly wage calculator, monthly salary to hourly rate<br>Title SEO específico: Salary to Hourly Calculator – Pay Rate Estimate |
| 93 | `image-to-text` · Image to Text OCR | Extract selectable text from a JPG, PNG or WebP image with browser-based OCR.<br>Keywords: image to text, photo to text, OCR online, extract text from image, JPG to text, PNG to text<br>Title SEO específico: Image to Text OCR – Extract Text from a Photo |
| 94 | `spreadsheet-converter` · Spreadsheet to CSV Converter | Convert XLSX spreadsheet sheets to CSV or preview CSV data locally before downloading.<br>Keywords: XLSX to CSV, spreadsheet to CSV, Excel to CSV converter, convert CSV online, CSV sheet converter<br>Title SEO específico: XLSX to CSV Converter – Convert Spreadsheet Sheets |
| 95 | `subtitle-converter` · SRT and VTT Subtitle Converter | Convert subtitle files between SRT and WebVTT, adjust timing and preview captions.<br>Keywords: SRT to VTT, VTT to SRT, subtitle converter, subtitle timing adjuster, convert captions online<br>Title SEO específico: SRT to VTT Converter – Convert Subtitle Files |
| 96 | `image-collage-maker` · Photo Collage Maker | Arrange photos into a simple grid, change spacing and background, then download a collage image.<br>Keywords: photo collage maker, picture collage online, image grid maker, combine photos into one image<br>Title SEO específico: Photo Collage Maker – Combine Pictures into a Grid |
| 97 | `image-metadata-remover` · Image Metadata Remover | Create a clean copy of an image without embedded EXIF data such as GPS location.<br>Keywords: remove image metadata, remove EXIF data, remove GPS from photos, EXIF remover online, photo metadata cleaner<br>Title SEO específico: Remove EXIF Data – Image Metadata Remover |
| 98 | `gif-maker` · Animated GIF Maker | Create a GIF from 2–12 images or one video up to 8 seconds. Video support varies by browser; GIF colors, memory use and output size depend on the source.<br>Keywords: GIF maker, create animated GIF from images, image to GIF, video to GIF, GIF animation maker online<br>Title SEO específico: GIF Maker – Create a GIF from Images or Video |
| 99 | `screen-recorder` · Screen Recorder | Record a browser tab, window or screen to a video file supported by your browser.<br>Keywords: screen recorder online, record screen in browser, free screen capture video, screen recording tool<br>Title SEO específico: Screen Recorder Online – Record a Tab or Screen |
| 100 | `voice-recorder` · Voice Recorder | Record voice from a microphone and download the audio format supported by your browser.<br>Keywords: voice recorder online, record audio in browser, microphone recorder, audio recorder free<br>Title SEO específico: Voice Recorder Online |
| 101 | `room-planner` · Free Online Room Planner — 2D Floor Plan | Arrange furniture in a measured 2D room plan. Move and rotate items, then export an SVG copy locally.<br>Keywords: free online room planner, 2d room planner, furniture layout planner, floor plan furniture layout |
| 102 | `go-game` · Play Go Online Free — Local 9×9 Board Game | Play a local two-player 9×9 Go game with captures, legal-move checks, pass turns and simple area scoring.<br>Keywords: go game online free, 9x9 go board game, play baduk locally, two player go game |
| 103 | `mahjong-solitaire` · Mahjong Solitaire Online — Free Matching Puzzle | Match free tile pairs in a short, randomized Mahjong-style solitaire puzzle. Play locally in your browser.<br>Keywords: mahjong solitaire online, free mahjong matching game, mahjong tiles puzzle, mahjong solitaire for beginners |
| 104 | `periodic-table` · Interactive Periodic Table — Search Elements & Practice | Explore all 118 elements by symbol, name, group or period, compare elements, and practice their symbols.<br>Keywords: periodic table, periodic table of elements, element search, periodic table quiz, chemical element groups |
| 105 | `audio-editor` · Free Audio Editor Online — Trim, Fade & Export WAV | Trim a short audio clip, set volume and fades, preview the selection, and export a WAV file locally.<br>Keywords: audio editor online, trim audio online, cut audio file, fade audio in and out, wav audio editor |
| 106 | `svg-editor` · Free SVG Editor Online | Create a small vector graphic from editable shapes and text, then preview and download the SVG locally.<br>Keywords: svg editor online, edit svg online free, simple vector editor, create svg shapes and text |
| 107 | `seamless-pattern-maker` · Free Seamless Pattern Generator | Make a repeatable SVG tile from simple dot, grid, diagonal or cross motifs and download it locally.<br>Keywords: seamless pattern generator, repeating pattern maker, svg pattern generator, create a tileable background |
| 108 | `html-form-builder` · Free HTML Form Builder | Describe common form fields and generate labelled HTML controls you can copy into your own project.<br>Keywords: html form builder, create html form code, accessible form generator, html form fields generator |
| 109 | `html-email-builder` · Free HTML Email Template Builder | Build a simple table-based HTML email with your own text, button and safe HTTPS link.<br>Keywords: html email template builder, email html generator, responsive email template code, create email html online |
| 110 | `color-vision-simulator` · Free Color Blindness Simulator | Preview how an image may look with common color vision deficiencies using a local browser-only simulation.<br>Keywords: color blindness simulator, color vision deficiency simulator, protanopia simulator, deuteranopia simulator, tritanopia simulator, simulate color blindness on image |
| 111 | `weekly-meal-planner` · Free Weekly Meal Planner | Plan breakfast, lunch, dinner and snacks for the week, then build one shopping list from your ingredients.<br>Keywords: free weekly meal planner, meal planner online, weekly menu planner, meal plan and grocery list, meal planning tool |
| 112 | `reading-log` · Free Reading Log | Keep a private reading log, track book progress and compare weekly pages with a goal.<br>Keywords: free reading log, book reading tracker, reading progress tracker, reading pages tracker, personal reading log<br>Title SEO específico: Free Reading Log and Book Tracker |
| 113 | `time-tracker` · Free Time Tracker | Track work sessions by task or project, pause and resume timers, then save locally or export a CSV.<br>Keywords: free time tracker, project time tracker, task time tracker, work session tracker, time log, free online time tracker |
| 114 | `habit-tracker` · Free Habit Tracker | Track daily habits with a private, free habit tracker. Mark past 35 days, review streaks and save or export a backup on your device.<br>Keywords: free habit tracker, daily habit tracker, habit tracker calendar, habit streak tracker, track habits online free |
| 115 | `task-list` · Task List | A free task list with priorities, optional due dates and subtasks. Filter active or completed work, save a local copy, or export your tasks.<br>Keywords: task list, free online task list, task list with subtasks, task priority planner, simple task manager |
| 116 | `kanban-board` · Kanban Board | Move cards through custom workflow columns with a free online Kanban board. Undo changes, save a local copy, or export a JSON backup.<br>Keywords: free online kanban board, kanban board maker, online kanban tool, kanban board with custom columns, personal workflow board |
| 117 | `reading-speed-test` · Reading Speed Test Online | Try a free online reading speed test. Read a short passage, see an estimated words-per-minute pace, and optionally rate your own comprehension. Text stays in your browser.<br>Keywords: reading speed test, words per minute test, reading test online, reading speed calculator, reading comprehension self test |
| 118 | `household-budget-planner` · Household Budget Planner | Track monthly household income and expenses by category, then see your balance and export a local CSV.<br>Keywords: household budget planner, monthly household budget, budget planner with categories, track income and expenses, family budget tracker |
| 119 | `seating-chart-maker` · Seating Chart Maker | Arrange guests at tables, adjust seats by hand and save or export your plan on this device.<br>Keywords: seating chart maker, seating plan for guests, wedding seating chart, table seating planner, arrange guests at tables |
| 120 | `gantt-chart-maker` · Gantt Chart Maker | Turn dated tasks into a clear project timeline with optional dependencies, local saving and CSV export.<br>Keywords: gantt chart maker, gantt chart online, project timeline planner, task dependency chart, project schedule template |
| 121 | `sprite-sheet-maker` · Sprite Sheet Maker | Arrange image frames into a PNG sprite sheet and export frame coordinates as JSON or CSS, locally in your browser.<br>Keywords: sprite sheet maker, sprite sheet generator, sprite sheet from images, sprite sheet coordinates, CSS sprite generator |
| 122 | `font-tester` · Free Font Tester Online | Preview WOFF, WOFF2, TTF or OTF fonts with your own text and size in your browser.<br>Keywords: font tester online, preview font file, test fonts online, WOFF2 font preview, TTF font tester |
| 123 | `kakuro` · Free Kakuro Sum Puzzle | Play a free Kakuro-style cross-sum puzzle. Fill a 4 × 4 grid with digits 1–9 to match row and column sums.<br>Keywords: kakuro online, free kakuro puzzle, cross sums puzzle, kakuro number puzzle, online number sum puzzle |
| 124 | `battleship` · Free Battleship Game Online | Play a free local Battleship-style game against a simple computer opponent. Place a small fleet automatically and take turns guessing hidden ship locations.<br>Keywords: battleship game online, play battleship free, battleship against computer, online battleship board game |
| 125 | `drum-machine` · Free Online Drum Machine | Create a drum beat with a 16-step sequencer, adjust the tempo and play it locally in your browser.<br>Keywords: online drum machine, drum beat maker, drum pattern maker, step sequencer drums, create drum beats online |
| 126 | `online-sequencer` · Free Online Music Sequencer | Compose a short melody with a 16-step piano-roll sequencer. Play and save your pattern locally in the browser.<br>Keywords: online sequencer, music sequencer online, melody maker, piano roll sequencer, create music pattern |
| 127 | `song-key-finder` · Song Key Finder from Audio — Free Local Analysis | Estimate a likely musical key from an audio file in your browser and compare nearby alternatives.<br>Keywords: song key finder, key finder from audio, music key detector, find the key of a song, song key analyzer |
| 128 | `audio-spectrogram` · Audio Spectrogram — View Sound Frequencies Locally | Visualize the frequency content of a short audio file with a local spectrogram in your browser.<br>Keywords: audio spectrogram online, sound spectrogram, spectrogram maker, audio frequency visualizer, spectrogram from audio |
| 129 | `css-animation-generator` · CSS Animation Generator | Create and preview a CSS keyframe animation. Adjust motion, timing, duration and repetition, then copy the CSS.<br>Keywords: css animation generator, css keyframes generator, animation css code, css animation preview |
| 130 | `css-clip-path-editor` · CSS Clip-Path Editor | Preview common CSS clip-path shapes and copy the generated CSS for a clipped element.<br>Keywords: css clip path editor, clip-path generator, polygon clip path css, css shape generator |
| 131 | `css-filter-generator` · CSS Filter Generator | Adjust CSS image-filter values, preview the effect and copy the generated filter rule.<br>Keywords: css filter generator, css image filter generator, css brightness contrast filter, css filter preview |
| 132 | `api-request-builder` · API Request Builder — cURL & Fetch | Build a cURL command or Java Script Fetch snippet from an HTTP method, URL, headers and body. Nothing is sent.<br>Keywords: api request builder, curl command builder, fetch request generator, generate curl from headers, http request code generator |
| 133 | `html-table-generator` · HTML Table Generator from TSV | Turn tab-separated rows into an escaped, semantic HTML table with optional column headings and caption.<br>Keywords: html table generator, convert tab separated text to html table, html table code, accessible html table generator |
| 134 | `pwa-manifest-generator` · PWA Manifest Generator | Create a web app manifest JSON file with a same-site start URL, display mode and theme colors.<br>Keywords: pwa manifest generator, web app manifest generator, manifest json generator, create manifest.json |
| 135 | `connect-four` · Four-in-a-Row Online — Local Two-Player Game | Play a four-in-a-row game with another person on the same device. Drop colored discs, make a line of four and start a fresh board anytime.<br>Keywords: connect four online, connect 4 game, four in a row online, two player connect four |
| 136 | `reversi` · Reversi Online — Local Two-Player Disk Game | Play local two-player Reversi with legal moves, forced passes and a final disc count. No account or server match is needed.<br>Keywords: reversi online, reversi game, two player reversi, reversi legal moves |
| 137 | `checkers` · Checkers Online — Free Local Two-Player Game | Play American-style checkers on one device with mandatory captures, multi-jump turns, kings and a new-game button.<br>Keywords: checkers online, checkers game, play checkers with a friend, draughts online local |
| 138 | `music-scale-finder` · Music Scale Finder | Find the notes and degrees in common musical scales, then hear them played locally in your browser.<br>Keywords: music scale finder, scale finder by notes, guitar scale notes, major scale notes, minor scale notes, play musical scales online |
| 139 | `fretboard-trainer` · Guitar Fretboard Note Trainer | Practice naming notes on the guitar fretboard with short randomized questions and a local score.<br>Keywords: guitar fretboard trainer, guitar note practice, guitar fretboard notes quiz, learn notes on guitar neck, guitar note finder practice |
| 140 | `bpm-detector` · BPM Detector | Estimate a song’s tempo from an audio file locally, compare nearby tempo guesses and tap along to check the beat.<br>Keywords: bpm detector, beats per minute finder, song tempo finder, tap tempo bpm, audio bpm analyzer |
| 141 | `ear-training` · Ear Training | Practice identifying musical intervals with locally synthesized tones and adjustable ascending or descending rounds.<br>Keywords: ear training, interval ear training, music interval recognition, ear training intervals online |
| 142 | `chess-clock` · Chess Clock | Use a two-player chess clock with configurable starting time and per-move increment.<br>Keywords: chess clock, chess clock with increment, online chess timer, two player chess clock |
| 143 | `tournament-bracket-generator` · Tournament Bracket Generator | Create a single-elimination bracket for 2 to 64 participants, advance winners and handle byes automatically.<br>Keywords: tournament bracket generator, single elimination bracket, free tournament maker, bracket maker online |
| 144 | `mental-math-practice` · Mental Math Practice | Build mental calculation speed with addition, subtraction, multiplication, division and mixed rounds.<br>Keywords: mental math practice, mental calculation practice, arithmetic drills, multiplication practice |
| 145 | `study-planner` · Study Planner | Build a practical study schedule from your subjects, exam dates, available time and topic estimates.<br>Keywords: study planner, exam study schedule, study plan by subject, daily exam revision planner |
| 146 | `equation-solver` · Equation Solver | Solve linear and quadratic equations and check each solution in the original equation.<br>Keywords: equation solver, linear equation solver, quadratic equation solver, solve for x |
| 147 | `system-of-equations-calculator` · System of Equations Calculator | Solve two or three simultaneous linear equations and identify unique, no or infinite solutions.<br>Keywords: system of equations calculator, solve simultaneous equations, 2x2 system solver, 3x3 equations |
| 148 | `polynomial-factorization-calculator` · Polynomial Factorization Calculator | Factor integer quadratics, expand the result and verify that it matches the input polynomial.<br>Keywords: factoring calculator, factor polynomial, quadratic factorization, expand factors |
| 149 | `probability-calculator` · Probability Calculator | Calculate event probabilities, union, intersection, complements and conditional probability.<br>Keywords: probability calculator, conditional probability calculator, probability of A or B, event probability |
| 150 | `z-score-calculator` · Z-Score and Percentile Calculator | Convert a value to a Z-score and estimate its percentile in a normal distribution.<br>Keywords: z score calculator, z score to percentile, standard score calculator, deviation score |
| 151 | `coordinate-geometry-calculator` · Coordinate Geometry Calculator | Find slope, distance, midpoint and line equation from two coordinate points.<br>Keywords: slope calculator, midpoint calculator, distance between two points, line equation calculator |
| 152 | `long-division-calculator` · Long Division Calculator with Steps | Divide whole numbers and see quotient, remainder and the actual subtraction steps.<br>Keywords: long division calculator, long division calculator with steps, quotient and remainder calculator |
| 153 | `rounding-calculator` · Rounding and Significant Figures Calculator | Round a number to decimal places or significant figures using a clearly stated rule.<br>Keywords: rounding calculator, significant figures calculator, round to nearest hundredth, decimal places |
| 154 | `tax-calculator` · Sales Tax, VAT and GST Calculator | Add tax to a net price or extract included tax with a rate you enter.<br>Keywords: sales tax calculator, VAT calculator, GST calculator, reverse sales tax calculator, remove tax |
| 155 | `commission-calculator` · Commission Calculator | Calculate commission from a sale, or find the rate from a known commission amount.<br>Keywords: commission calculator, sales commission calculator, commission rate, reverse commission calculator |
| 156 | `credit-card-payoff-calculator` · Credit Card Payoff Calculator | Estimate payoff time, total interest and payments from a balance, APR and monthly payment.<br>Keywords: credit card payoff calculator, credit card interest calculator, payoff time calculator, monthly payment calculator |
| 157 | `unit-price-calculator` · Unit Price Calculator | Compare two package prices by converting both to the same unit price.<br>Keywords: unit price calculator, price per unit calculator, compare price per ounce, cost per item |
| 158 | `concrete-calculator` · Concrete Calculator | Estimate concrete volume for a slab and add a configurable waste allowance.<br>Keywords: concrete calculator, concrete slab calculator, concrete volume calculator, concrete bags calculator |
| 159 | `tile-calculator` · Tile Calculator | Estimate floor area, tile count and a configurable allowance for cuts and waste.<br>Keywords: tile calculator, tile square footage calculator, how many tiles do I need, tile waste calculator |
| 160 | `receipt-generator` · Receipt Generator | Create and print a simple payment receipt with items, tax and payment details.<br>Keywords: receipt maker, receipt generator free, payment receipt template, printable receipt |
| 161 | `quotation-generator` · Quotation and Estimate Generator | Draft a simple customer quotation with itemized prices, optional tax and a validity date.<br>Keywords: quotation maker, quotation template free, estimate generator, price quote maker |
| 162 | `morse-code-translator` · Morse Code Translator | Translate supported English letters, numbers and punctuation to Morse or back.<br>Keywords: morse code translator, text to morse code, morse code audio, morse code decoder |
| 163 | `online-metronome` · Online Metronome with Tap Tempo | Set BPM, beat accents and time signature, or tap a rhythm to find its tempo.<br>Keywords: online metronome, tap bpm, metronome with tap tempo, bpm metronome |
| 164 | `keyboard-tester` · Keyboard Tester | Press keys to see which keyboard events reach this browser page.<br>Keywords: keyboard tester, keyboard test online, key test, keyboard key checker |
| 165 | `mouse-tester` · Mouse Tester and Click Speed Test | Test mouse buttons, wheel input and clicks per second in your browser.<br>Keywords: mouse tester, mouse click test, mouse scroll wheel test, clicks per second test |
| 166 | `reaction-time-test` · Reaction Time Test | Measure click reaction time over several rounds and compare the median.<br>Keywords: reaction time test, human benchmark reaction test, reflex test online, reaction speed test |
| 167 | `combinatorics-calculator` · Combinations and Permutations Calculator | Calculate combinations, permutations and factorial-style selections, with a clear note about order.<br>Keywords: combination calculator, permutation calculator, factorial calculator, n choose r calculator |
| 168 | `probability-distribution-calculator` · Normal, Binomial and Poisson Distribution Calculator | Estimate point and cumulative probabilities for normal, binomial and Poisson models.<br>Keywords: normal distribution calculator, binomial probability calculator, poisson distribution calculator, cumulative probability |
| 169 | `confidence-interval-calculator` · Confidence Interval Calculator for a Mean | Calculate a z confidence interval for a mean when the population standard deviation is known.<br>Keywords: confidence interval calculator, z confidence interval, margin of error calculator, mean interval calculator |
| 170 | `sample-size-calculator` · Survey Sample Size Calculator | Estimate a survey sample size from confidence, margin of error and expected proportion.<br>Keywords: sample size calculator, survey sample size calculator, margin of error sample size, finite population sample size |
| 171 | `linear-regression-calculator` · Linear Regression and Correlation Calculator | Fit a least-squares line to x, y pairs and calculate Pearson correlation and R-squared.<br>Keywords: linear regression calculator, correlation calculator, least squares calculator, regression line calculator |
| 172 | `triangle-calculator` · Triangle Calculator from Three Sides | Find all angles, perimeter and area from three valid triangle side lengths.<br>Keywords: triangle calculator, triangle side calculator, triangle area calculator, triangle angle calculator |
| 173 | `volume-calculator` · Volume and Surface Area Calculator | Calculate volume and surface area for a sphere, cylinder, cone or rectangular prism.<br>Keywords: volume calculator, sphere volume calculator, cylinder volume calculator, cone surface area calculator |
| 174 | `sequence-calculator` · Arithmetic and Geometric Sequence Calculator | Find an arithmetic or geometric sequence term and the sum of its first n terms.<br>Keywords: arithmetic sequence calculator, geometric sequence calculator, sequence sum calculator, nth term calculator |
| 175 | `break-even-calculator` · Break-Even Point Calculator | Estimate break-even units and sales from fixed costs, unit price and variable cost.<br>Keywords: break even calculator, break even point formula, break even units and sales |
| 176 | `roi-cagr-calculator` · ROI and CAGR Calculator | Calculate total return on investment and compound annual growth rate from starting value, ending value and time.<br>Keywords: ROI calculator, CAGR calculator, return on investment calculator, annualized return |
| 177 | `depreciation-calculator` · Depreciation Calculator | Build an estimated asset depreciation schedule using straight-line or declining-balance methods.<br>Keywords: depreciation calculator, straight line depreciation calculator, declining balance depreciation |
| 178 | `dimensional-weight-calculator` · Dimensional Weight Calculator | Estimate dimensional shipping weight using package dimensions and a carrier divisor you provide.<br>Keywords: dimensional weight calculator, volumetric weight calculator, shipping dimensional weight |
| 179 | `paint-calculator` · Paint Calculator | Estimate paint quantity from wall dimensions, doors and windows, coats and coverage.<br>Keywords: paint calculator, how much paint do I need, wall paint coverage calculator |
| 180 | `board-foot-calculator` · Board Foot and Lumber Calculator | Calculate board feet and estimate lumber cost from thickness, width, length and quantity.<br>Keywords: board foot calculator, lumber board feet calculator, board foot price calculator |
| 181 | `recipe-scaler` · Recipe Ingredient Scaler | Scale ingredient amounts up or down when changing the number of servings.<br>Keywords: recipe scaler, recipe converter servings, scale recipe ingredients |
| 182 | `iban-validator` · IBAN Validator and Format Checker | Check an IBAN country-length pattern and checksum locally without contacting a bank.<br>Keywords: IBAN validator, IBAN checker, validate IBAN checksum, IBAN format checker |
| 183 | `utm-builder` · UTM Link Builder | Add campaign source, medium and name parameters to a URL without sending it anywhere.<br>Keywords: UTM builder, UTM link builder, campaign URL builder, Google Analytics URL builder |
| 184 | `robots-txt-generator` · Robots.txt Generator | Draft a robots.txt file from user-agent, allow, disallow and sitemap fields.<br>Keywords: robots.txt generator, create robots txt file, robots.txt rules generator |
| 185 | `sitemap-xml-generator` · XML Sitemap Generator from URLs | Create a sitemap XML draft from URLs you provide, without crawling a website.<br>Keywords: XML sitemap generator, sitemap generator from URL list, create sitemap XML |
| 186 | `json-ld-generator` · JSON-LD Schema Generator | Draft basic Organization, Web Site or Article JSON-LD from details you provide.<br>Keywords: JSON-LD generator, schema markup generator, structured data JSON-LD |
| 187 | `meta-tag-generator` · Meta Tag and Open Graph Generator | Draft HTML title, description, canonical, Open Graph and social card tags with a live text preview.<br>Keywords: meta tag generator, Open Graph tag generator, social media preview generator |
| 188 | `css-gradient-generator` · CSS Gradient Generator | Create a CSS linear or radial gradient from validated colors and stops.<br>Keywords: CSS gradient generator, linear gradient CSS, radial gradient generator |
| 189 | `css-box-shadow-generator` · CSS Box Shadow Generator | Build a CSS box-shadow declaration with offset, blur, spread, color and inset options.<br>Keywords: CSS box shadow generator, box shadow CSS, CSS shadow maker |
| 190 | `color-palette-generator` · Color Palette Generator | Generate complementary and analogous palette colors from a starting hex color.<br>Keywords: color palette generator, color scheme generator, complementary color palette |
| 191 | `css-grid-generator` · CSS Grid and Flexbox Generator | Generate a responsive CSS Grid or Flexbox layout declaration from columns, gap and alignment settings.<br>Keywords: CSS grid generator, CSS flexbox generator, CSS layout generator |
| 192 | `polynomial-derivative-calculator` · Polynomial Derivative Calculator | Differentiate a polynomial from its coefficients and optionally evaluate the derivative at a point.<br>Keywords: derivative calculator, polynomial derivative calculator, derivative at a point |
| 193 | `polynomial-integral-calculator` · Polynomial Integral Calculator | Find a polynomial antiderivative and evaluate a definite integral between two bounds.<br>Keywords: integral calculator, polynomial integral calculator, definite integral calculator |
| 194 | `matrix-calculator` · Matrix Calculator | Calculate a square matrix determinant or inverse, or transpose a matrix entered by rows.<br>Keywords: matrix calculator, matrix determinant calculator, matrix inverse calculator, transpose matrix |
| 195 | `truth-table-generator` · Logic Truth Table Generator | Build a truth table for a Boolean expression with up to six variables and common logic operators.<br>Keywords: truth table generator, logic truth table calculator, boolean expression truth table |
| 196 | `cash-flow-irr-calculator` · NPV and IRR Cash Flow Calculator | Calculate net present value at a rate you choose and estimate all IRR roots for equally spaced cash flows.<br>Keywords: irr calculator, npv calculator, internal rate of return calculator, net present value cash flow |
| 197 | `debt-payoff-planner` · Debt Payoff Planner: Avalanche vs Snowball | Compare avalanche and snowball payoff plans using your debts, APRs, minimum payments and monthly budget.<br>Keywords: debt payoff calculator, debt snowball calculator, debt avalanche calculator, multiple debt payoff planner |
| 198 | `rent-vs-buy-calculator` · Rent vs Buy Calculator | Compare rent paid with estimated ownership costs and home equity using assumptions you enter.<br>Keywords: rent vs buy calculator, should I rent or buy calculator, home buying cost calculator |
| 199 | `statistical-test-calculator` · Statistical Test Calculator | Run a one-sample t-test, chi-square goodness-of-fit test or one-way ANOVA with stated assumptions.<br>Keywords: t test calculator, chi square test calculator, one way ANOVA calculator, p value calculator |
| 200 | `citation-generator` · APA, MLA and Chicago Citation Generator | Format a basic book or webpage citation from details you enter, then copy it.<br>Keywords: citation generator, APA citation generator, MLA citation maker, Chicago citation generator |
| 201 | `json-schema-validator` · JSON Schema Validator | Validate JSON against a local JSON Schema using common Draft 7 keywords.<br>Keywords: JSON schema validator, validate JSON against schema, JSON schema online |
| 202 | `jsonpath-query-tool` · JSONPath Query Tool | Query JSON locally with a safe subset of JSONPath selectors and filters.<br>Keywords: JSONPath online, JSONPath evaluator, query JSON |
| 203 | `printable-calendar-maker` · Printable Calendar Maker | Create a clean monthly calendar grid you can copy or print from this device.<br>Keywords: printable calendar maker, monthly calendar generator, blank calendar template |
| 204 | `flashcard-maker` · Flashcard Maker | Turn term-and-definition rows into a simple study deck for review or printing.<br>Keywords: flashcard maker, study flashcards online, printable flash cards |
| 205 | `word-search-maker` · Word Search Puzzle Maker | Generate a word search puzzle that preserves letters from your writing system, with an answer key.<br>Keywords: word search maker, word search generator printable, create a word search, multilingual word search |
| 206 | `bingo-card-generator` · Bingo Card Generator | Generate reproducible 5×5 bingo cards from your own word or number pool.<br>Keywords: bingo card generator, printable bingo cards, custom bingo maker |
| 207 | `adult-bmi-calculator` · Adult BMI Calculator | Calculate body mass index from adult height and weight using metric or US units.<br>Keywords: BMI calculator, adult BMI calculator, body mass index calculator kg cm |
| 208 | `bmr-tdee-calculator` · BMR and TDEE Calculator | Estimate resting energy and daily energy needs from the Mifflin–St Jeor equation and an activity factor.<br>Keywords: BMR calculator, TDEE calculator, maintenance calories calculator, daily energy expenditure |
| 209 | `macro-calorie-calculator` · Macro and Calorie Calculator | Split a calorie target you provide into protein, carbohydrate and fat grams by percentage.<br>Keywords: macro calculator, macronutrient calculator, protein carb fat calculator |
| 210 | `running-pace-calculator` · Running Pace Calculator | Calculate pace or finish time from a distance and elapsed time.<br>Keywords: running pace calculator, pace per mile calculator, running speed and time calculator |
| 211 | `one-rep-max-calculator` · One Rep Max Calculator | Estimate a one-repetition maximum from a submaximal weight and repetitions using common formulas.<br>Keywords: one rep max calculator, 1RM calculator, max bench press calculator |
| 212 | `cover-letter-builder` · Cover Letter Builder | Draft a concise editable cover letter from your own role, experience and contact details.<br>Keywords: cover letter builder, cover letter maker free, job application letter generator |
| 213 | `test-data-generator` · Test Data Generator | Generate repeatable sample records from a small field schema and export-ready JSON.<br>Keywords: test data generator, fake data generator JSON CSV, sample dataset generator |
| 214 | `math-worksheet-generator` · Math Worksheet Generator | Create a printable arithmetic worksheet with a separate answer key and reproducible questions.<br>Keywords: math worksheet generator, printable math worksheets, addition subtraction worksheet maker |
| 215 | `local-notepad` · Private Local Notepad | Write, search, copy and download notes in your browser without sending them to a server.<br>Keywords: online notepad, private notepad online, browser notepad with download |
| 216 | `teleprompter-online` · Online Teleprompter | Read a script with adjustable scroll speed and text size, plus pause and mirror controls.<br>Keywords: online teleprompter, teleprompter app free, scrolling teleprompter with speed control |
| 217 | `function-grapher` · Function Grapher | Plot supported polynomial functions locally and inspect a chosen x-value.<br>Keywords: function grapher online, graph function calculator, plot equations |
| 218 | `crossword-maker` · Crossword Maker | Arrange your own answer-and-clue pairs into a connected printable crossword.<br>Keywords: crossword maker, create crossword puzzle, printable crossword generator |
| 219 | `html-formatter` · HTML Formatter and Minifier | Format HTML or conservatively minify markup with local parsing; input is never executed.<br>Keywords: HTML formatter online, HTML beautifier, HTML minifier |
| 220 | `css-formatter` · CSS Formatter and Minifier | Indent CSS or remove comments and whitespace while preserving strings, custom properties and calc expressions.<br>Keywords: CSS formatter online, CSS beautifier, CSS minifier |
| 221 | `javascript-formatter` · Java Script Formatter and Minifier | Format Java Script with a bundled parser and minify without executing the source.<br>Keywords: Java Script formatter online, Java Script beautifier, JS minifier |
| 222 | `html-css-js-playground` · HTML CSS Java Script Playground | Edit a small page and preview it in a sandboxed frame on your device.<br>Keywords: HTML CSS Java Script editor online, front end playground |
| 223 | `sqlite-playground` · SQLite Playground | Run SQLite queries on a temporary in-memory database in your browser.<br>Keywords: SQLite playground online, run SQLite in browser, SQL sandbox |
| 224 | `cron-expression-builder` · Cron Expression Builder | Build and explain common five-field Unix cron schedules with a chosen time zone note.<br>Keywords: cron expression generator, cron schedule builder, cron next run |
| 225 | `hex-editor` · Hex Editor | Inspect bytes as hexadecimal and text, edit a bounded byte sequence and download a new file.<br>Keywords: hex editor online, view file bytes, hexadecimal editor |
| 226 | `image-editor` · Image Editor | Make simple brightness, contrast, saturation and rotation adjustments locally.<br>Keywords: image editor online free, adjust image brightness contrast, rotate image |
| 227 | `image-watermark-tool` · Image Watermark Tool | Add a text watermark to an image in your browser and download a separate copy.<br>Keywords: add watermark to image online, watermark photo free, batch image watermark |
| 228 | `passport-photo-maker` · Passport Photo Maker | Crop a personal photo to a custom width and height and download it locally.<br>Keywords: passport photo maker online, crop ID photo, visa photo size |
| 229 | `meme-maker` · Meme Maker | Add top and bottom text to an image you provide and download the result.<br>Keywords: meme maker online, add text to image meme, create meme free |
| 230 | `svg-optimizer` · SVG Optimizer | Remove safe comments and redundant whitespace from an SVG while preserving vector markup.<br>Keywords: SVG optimizer online, clean SVG, reduce SVG file size |
| 231 | `pixel-art-editor` · Pixel Art Editor | Draw on a small pixel grid and export a crisp PNG without smoothing.<br>Keywords: pixel art maker online, pixel drawing grid, pixel art editor free |
| 232 | `chart-maker` · Chart Maker from CSV | Create a simple bar or line chart from local CSV data and download it as SVG.<br>Keywords: chart maker online, create chart from CSV, graph data free |
| 233 | `diagram-maker` · Simple Diagram Maker | Turn one label per line into a simple connected process diagram for local export.<br>Keywords: diagram maker online, flowchart maker free, simple process diagram |
| 234 | `latex-equation-renderer` · La TeX Equation Renderer | Render a supported math expression locally and copy or download its SVG.<br>Keywords: La TeX equation editor online, render math equation, equation to SVG |
| 235 | `business-card-maker` · Business Card Maker | Arrange your own contact details on a standard-size card and print or save a PDF.<br>Keywords: business card maker online, printable business card template, create business card |
| 236 | `body-fat-calculator` · Body Fat Estimate Calculator | Estimate adult body-fat percentage from circumference measurements using a published Navy method.<br>Keywords: body fat calculator, body fat percentage estimate, US Navy body fat method |
| 237 | `due-date-calculator` · Pregnancy Due Date Calculator | Estimate a pregnancy due date from a date and cycle-length assumption.<br>Keywords: pregnancy due date calculator, estimated due date from last period, pregnancy weeks calculator |
| 238 | `cycle-calendar-estimator` · Cycle Calendar Estimator | Estimate a calendar from a period start date and average cycle length without storing it.<br>Keywords: menstrual cycle calendar, period tracker calendar, ovulation date estimate |
| 239 | `ascii-art-generator` · ASCII Art Generator | Convert short text or a small image to a plain-text ASCII-style output locally.<br>Keywords: ASCII art generator, text to ASCII art, image to ASCII online |
| 240 | `guitar-tuner` · Guitar Tuner | Listen to a microphone locally and show the nearest note and frequency estimate.<br>Keywords: online guitar tuner, tune guitar by microphone, guitar tuning standard |
| 241 | `virtual-piano` · Virtual Piano | Play a small piano keyboard with mouse, touch or computer keys using browser audio.<br>Keywords: virtual piano online, play piano keyboard browser, free piano keys |
| 242 | `guitar-chord-finder` · Guitar Chord Finder | Look up common guitar chord shapes and notes in standard tuning.<br>Keywords: guitar chord finder, guitar chord chart online, chord notes and fingering |
| 243 | `noise-generator` · White, Pink and Brown Noise Generator | Generate white, pink or brown noise locally with smooth volume and an optional auto-stop timer.<br>Keywords: white noise generator, pink noise online, brown noise sound |
| 244 | `webcam-tester` · Webcam Tester | Preview a camera stream and inspect its reported dimensions in this browser.<br>Keywords: webcam test online, check camera browser, webcam resolution test |
| 245 | `speaker-tester` · Speaker and Channel Tester | Play a short low-volume tone to check basic audio output and left/right balance.<br>Keywords: speaker test online, stereo left right speaker test, audio channel test |
| 246 | `packing-list-maker` · Free Packing List Maker | Build a reusable packing checklist by trip, category and item, then mark what is packed and export a copy.<br>Keywords: packing list maker, travel packing checklist, vacation packing list, printable packing list |
| 247 | `decision-matrix` · Decision Matrix Calculator | Compare options with weighted criteria and transparent scores in a private, local decision matrix.<br>Keywords: decision matrix, weighted decision matrix, decision matrix template, compare options with weighted criteria |
| 248 | `workout-planner` · Workout Planner | Organize your own exercises, sets, reps and rest periods into a printable workout plan.<br>Keywords: workout planner, exercise routine planner, workout plan maker, gym routine tracker |
| 249 | `quiz-maker` · Free Quiz Maker | Create a multiple-choice quiz from your own questions, practice it in your browser and review your score.<br>Keywords: free quiz maker, create a quiz online, multiple choice quiz maker, study quiz generator |
| 250 | `memory-game` · Free Online Memory Matching Game | Play a quick card-matching memory game, choose a board size and try to find every pair in fewer moves.<br>Keywords: memory matching game, play memory game online, concentration game, free matching pairs game |
| 251 | `kana-practice` · Free Hiragana and Katakana Practice | Practice recognizing basic hiragana and katakana in short rounds with answers and a score, right in your browser.<br>Keywords: hiragana practice, katakana practice, learn kana online, Japanese kana quiz, hiragana chart practice |
| 252 | `abacus-practice` · Free Interactive Abacus Practice | Practice place value and addition with a five-rod interactive abacus. Move each digit with simple controls and check the sum locally.<br>Keywords: abacus practice online, interactive abacus, abacus addition practice, learn abacus arithmetic |
| 253 | `spelling-practice` · Free Spelling Practice with Your Own Words | Create a spelling practice list from your own words and hints, answer one at a time, and review missed words in your browser.<br>Keywords: spelling practice online, spelling test with your own words, vocabulary spelling quiz, custom spelling words practice |
| 254 | `hangul-practice` · Free Hangul Practice for Korean Letters | Practice recognizing basic Korean Hangul consonants and vowels in short browser-based rounds.<br>Keywords: hangul practice online, korean alphabet quiz, learn korean letters, hangul consonant vowel practice |
| 255 | `2048-game` · Free 2048 Number Merge Puzzle | Play a local number-merging puzzle: slide matching tiles, plan merges and try to reach 2048.<br>Keywords: 2048 game online, play 2048 puzzle, number merge game, 2048 puzzle with undo |
| 256 | `sudoku` · Free Sudoku Online — Unique Puzzles | Play a free Sudoku puzzle in your browser. Choose a difficulty, add notes, check your answers or reveal a hint.<br>Keywords: sudoku online, free sudoku puzzle, easy sudoku, medium sudoku, hard sudoku, sudoku with hints, sudoku notes |
| 257 | `tic-tac-toe` · Free Tic-Tac-Toe Online — Play vs Computer | Play tic-tac-toe online against an unbeatable local computer or another person on the same device.<br>Keywords: tic tac toe online, play tic tac toe vs computer, free noughts and crosses, two player tic tac toe |
| 258 | `chess-game` · Free Online Chess — Legal Moves & PGN | Play a two-player chess game on one device with legal moves, castling, en passant, promotion, undo and PGN save or download.<br>Keywords: chess online, play chess online two player, legal chess moves board, save chess PGN, chess game no account |
| 259 | `solitaire` · Free Online Solitaire — Klondike Card Game | Play Klondike solitaire in your browser. Move cards by suit and rank, draw one or three cards, and undo moves locally.<br>Keywords: solitaire online, klondike solitaire, solitaire draw 1, solitaire draw 3, free solitaire card game |
| 260 | `minesweeper` · Free Online Minesweeper — Safe First Click | Play Minesweeper in your browser with a safe first click, three board sizes, flags, a timer and no account.<br>Keywords: minesweeper online, free minesweeper, minesweeper game, minesweeper easy medium hard, minesweeper flag game |
| 261 | `nonogram` · Free Nonogram Puzzle — Unique Logic Picross | Solve a free nonogram puzzle in your browser. Use row and column clues to reveal a unique 5×5 picture logic grid.<br>Keywords: nonogram puzzle, picross puzzle online, free nonogram game, picture logic puzzle |
| 262 | `sliding-puzzle` · Free Sliding Puzzle — 3×3, 4×4 and 5×5 | Play a number sliding puzzle in your browser. Choose 3×3, 4×4 or 5×5, move tiles and solve the board.<br>Keywords: sliding puzzle online, number puzzle game, 15 puzzle, 8 puzzle, free sliding tile puzzle |
| 263 | `screen-ruler` · Online Screen Ruler — Measure in Pixels | Measure a length in CSS pixels with an adjustable on-screen ruler. Optional calibration estimates physical units.<br>Keywords: screen ruler online, pixel ruler, measure screen pixels, online ruler for web design |
| 264 | `protractor` · Online Protractor — Measure an Angle | Set two rays on a digital 180-degree protractor and read their angle in degrees.<br>Keywords: online protractor, angle finder online, measure an angle, digital protractor |
| 265 | `printable-label-maker` · Printable Label Maker — Free A4 and Letter Sheets | Arrange up to 30 lines of text on a simple printable label sheet and download a local SVG.<br>Keywords: printable label maker, address label template, make labels online, A4 label sheet |
| 266 | `poster-maker` · Free Poster Maker — Create a Printable Poster | Create a simple text poster with a title, subtitle, message and color theme, then download SVG.<br>Keywords: poster maker online, create a poster, printable poster maker, simple poster design |
| 267 | `certificate-maker` · Free Certificate Maker — Printable Award Template | Create a decorative certificate with a recipient, award, issuer and date, then download SVG.<br>Keywords: certificate maker online, printable certificate template, create an award certificate free |
| 268 | `invitation-maker` · Free Invitation Maker — Printable Event Invitation | Design a simple event invitation with date, time, place and RSVP details and download it as SVG.<br>Keywords: invitation maker online, printable invitation template, create event invitation, party invitation maker |
| 269 | `audio-looper` · Free Audio Looper — Repeat a Clip and Export WAV | Repeat a short audio selection locally for practice and export the repeated clip as WAV.<br>Keywords: audio looper online, loop audio clip, repeat audio, practice music loop |
| 270 | `molecule-viewer` · Interactive Molecule Viewer — Explore 2D Structures | Explore a small gallery of familiar molecules with labeled atoms, bonds and formulas.<br>Keywords: molecule viewer online, molecular structure viewer, view molecule formula |
| 271 | `photo-mosaic-maker` · Photo Mosaic Maker — Create a Pixel Mosaic Locally | Turn a local photo into a block-style mosaic image with adjustable tile size.<br>Keywords: photo mosaic maker online, pixel mosaic effect, make image mosaic |
| 272 | `epub-reader` · Free EPUB Reader — Read a Book in Your Browser | Open a text-based EPUB locally and browse its chapter text without uploading the book.<br>Keywords: epub reader online, read epub in browser, open epub file free |
| 273 | `epub-metadata-editor` · EPUB Metadata Editor — Edit Book Details Locally | Change an EPUB title, author and language metadata locally and create a separate EPUB copy.<br>Keywords: epub metadata editor, edit epub title author, change ebook metadata |
| 274 | `backgammon` · Free Backgammon Game — Two Players on One Device | Play a local two-player backgammon game with dice, legal moves, hitting and bearing off.<br>Keywords: backgammon online two player, play backgammon free, backgammon game |
| 275 | `tangram` · Tangram Puzzle — Arrange Seven Pieces | Arrange seven geometric tangram pieces to match a simple silhouette using touch, mouse or keyboard controls.<br>Keywords: tangram puzzle online, seven piece tangram, play tangram free |
| 276 | `jigsaw-puzzle` · Jigsaw Puzzle Maker — Turn a Photo into a Puzzle | Create and play a small jigsaw puzzle from a photo stored on your device.<br>Keywords: jigsaw puzzle maker from photo, make a jigsaw puzzle online, picture puzzle |
| 277 | `music-score-editor` · Music Score Editor — Write and Export a Simple Score | Build a simple single-staff melody, hear it with browser audio and export a printable SVG score.<br>Keywords: music score editor online, write sheet music, music notation editor free |

Adicionalmente se detectaron en la lógica de la calculadora de promedio modos de promedio ponderado y nota necesaria en examen final. **No crear final-grade/weighted-grade como nuevas herramientas aunque no estén destacadas en el nombre breve del catálogo.** Inventario de IDs no equivale a inventario de cada subfunción; por eso se contrastaron contratos clave y debe conservarse ese gate.

## Anexo B · 36 idiomas y rutas reales

| # | Idioma mostrado | Clave interna | Código HTML/hreflang de referencia | Prefijo URL |
| --- | --- | --- | --- | --- |
| 1 | English | `en` | `en` | `/ (inglés)` |
| 2 | Español | `es` | `es` | `/es` |
| 3 | Français | `fr` | `fr` | `/fr` |
| 4 | Português (Brasil) | `pt` | `pt-BR` | `/pt-br` |
| 5 | Deutsch | `de` | `de` | `/de` |
| 6 | 日本語 | `ja` | `ja` | `/ja` |
| 7 | 한국어 | `ko` | `ko` | `/ko` |
| 8 | Bahasa Indonesia | `id` | `id` | `/id` |
| 9 | हिन्दी | `hi` | `hi` | `/hi` |
| 10 | العربية | `ar` | `ar` | `/ar` |
| 11 | 简体中文 | `zh` | `zh-CN` | `/zh-cn` |
| 12 | বাংলা | `bn` | `bn` | `/bn` |
| 13 | Русский | `ru` | `ru` | `/ru` |
| 14 | اردو | `ur` | `ur` | `/ur` |
| 15 | Türkçe | `tr` | `tr` | `/tr` |
| 16 | Tiếng Việt | `vi` | `vi` | `/vi` |
| 17 | Italiano | `it` | `it-IT` | `/it` |
| 18 | 中文（繁體） | `zh_tw` | `zh-TW` | `/zh-tw` |
| 19 | Български | `bg` | `bg-BG` | `/bg` |
| 20 | Català | `ca` | `ca-ES` | `/ca` |
| 21 | Nederlands | `nl` | `nl-NL` | `/nl` |
| 22 | Ελληνικά | `el` | `el-GR` | `/el` |
| 23 | Bahasa Melayu | `ms` | `ms-MY` | `/ms` |
| 24 | Polski | `pl` | `pl-PL` | `/pl` |
| 25 | Svenska | `sv` | `sv-SE` | `/sv` |
| 26 | ไทย | `th` | `th-TH` | `/th` |
| 27 | Українська | `uk` | `uk-UA` | `/uk` |
| 28 | Kiswahili | `sw` | `sw-KE` | `/sw` |
| 29 | मराठी | `mr` | `mr-IN` | `/mr` |
| 30 | తెలుగు | `te` | `te-IN` | `/te` |
| 31 | Hausa | `ha` | `ha-NG` | `/ha` |
| 32 | Filipino | `tl` | `fil-PH` | `/tl` |
| 33 | தமிழ் | `ta` | `ta-IN` | `/ta` |
| 34 | فارسی | `fa` | `fa-IR` | `/fa` |
| 35 | አማርኛ | `am` | `am-ET` | `/am` |
| 36 | ગુજરાતી | `gu` | `gu-IN` | `/gu` |

## Anexo C · Descartes y reserva, no contabilizados como nuevas publicables

Para no inventar 323 oportunidades masivas se descartaron variantes, marcas y proyectos sin viabilidad acreditada. Esta sección no es otro lote autorizado ni suma al objetivo de 600.

### Consolidaciones/descartes explícitos

| Query/candidata | Motivo |
| --- | --- |
| `flowchart maker` | El catálogo protegido ya apunta a flowchart maker; no crear otra URL con ese objetivo. |
| `word finder` | Consolidar patrones, anagramas y ayuda léxica en una sola nueva herramienta. |
| `json to csharp` | Incluir C# y Java en la misma suite nueva de modelos JSON→código. |
| `data uri decoder` | Dirección inversa de archivos Base64: una sola página bidireccional. |
| `protobuf to json` | Codificar y decodificar Protobuf en una sola página. |
| `plot generator` | Subfunción del generador de consignas narrativas. |
| `resistor series parallel calculator` | Incluir redes de resistencias en la nueva calculadora de Ohm. |
| `image overlay` | Demasiado cercana al flujo existente de marca de agua/collage para prometer otra intención. |
| `text to pdf` | El flujo TXT→PDF está demasiado cerca del conversor de documentos protegido; no repartirlo. |
| `slope grade calculator` | El catálogo protegido ya posee slope calculator y cálculo de pendientes. |
| `exponent calculator` | La intención genérica ya la resuelve la calculadora científica. |
| `grammar checker` | Una revisión gramatical completa en 36 idiomas no está demostrada localmente; no vender una versión incompleta como equivalente. |
| `image colorizer` | No hay un modelo local pequeño/licenciado validado en esta planificación; reservar, no contar. |
| `braille translator` | Transcribir correctamente todos los idiomas exige tablas específicas; reserva accesibilidad para no producir salidas engañosas. |
| `ipa converter` | Cobertura fonética en 36 idiomas no validada; no inventar pronunciaciones. |
| `tetris online` | No atribuir demanda de una marca a una herramienta genérica; revisar formato original por separado. |
| `wordle game` | El volumen de la marca no acredita demanda del juego genérico; reservar. |
| `kenken` | Nombre comercial: el genérico calcudoku medido tiene demanda mucho menor; reservar. |
| `yahtzee game` | No usar el volumen de una marca para justificar una implementación sin licencia. |
| `boggle game` | No usar el volumen de una marca para justificar una implementación sin licencia. |
| `simon game` | Solapa las pruebas de secuencias; no duplicar ni basar demanda en una marca. |
| `visual memory test` | Modo visual dentro de la misma nueva prueba de memoria, no una URL adicional. |
| `url regex generator` | Demanda escasa y demasiado próximo al probador de regex protegido. |
| `uuid validator` | El generador existente posee contrato de UUID; la validación sola es demasiado pequeña. |
| `roas calculator` | El ROI protegido ya cubre la operación esencial; evitar una fórmula renombrada. |
| `ctr calculator` | Es un porcentaje simple sin flujo nuevo suficiente frente al porcentaje protegido. |
| `conversion rate calculator` | Tasa simple ya resuelta por porcentaje; no contar una fórmula renombrada. |
| `simple interest calculator` | Demasiado cerca de los modelos financieros protegidos para una nueva página genérica. |
| `fractional ownership calculator` | Porcentajes sin workflow societario suficiente; si se necesita, modo de cap table futura. |
| `random username generator` | Modo del generador de nombres nuevos con formatos de usuario; no contar otra URL. |
| `fantasy name generator` | Gramática/tema dentro de una suite de nombres nuevos, no repetir otra página de nombres. |
| `baby name generator` | No se obtuvo demanda en el término consultado; no fabricar etimologías ni un catálogo vacío. |
| `nato phonetic alphabet translator` | Utilidad pequeña cercana a traductores de letras; fuera de la tanda de alta demanda. |
| `color temperature calculator` | Demanda baja y cercanía al conversor de color; fuera del objetivo. |
| `swim pace calculator` | El ritmo numérico ya existe; no vender otro deporte como otra herramienta. |
| `race split calculator` | Parciales próximos al ritmo existente; no multiplicar por variantes deportivas. |
| `training pace calculator` | Solapa el predictor de carreras y ritmo; mantener una sola herramienta nueva de rendimiento. |
| `salary increase calculator` | Porcentaje de aumento ya resuelto; el ajuste por inflación se incorpora a inflación. |
| `mastermind game` | No atribuir demanda de la marca al juego genérico code breaker; la consulta genérica medida tiene 170/mes. Excluir de esta tanda. |

### Descartes de la primera revisión semántica

| Candidata | Frontera/motivo |
| --- | --- |
| `emergency fund calculator` | household-budget-planner: reserva de contingencia, no presupuesto |
| `crypto profit calculator` | stock-profit-calculator: token y comisiones de red; excluir si SERP coincide totalmente |
| `sinking fund calculator` | savings-goal-calculator: duplicado potencial, dejar reserva si no cambia el flujo |
| `present value calculator` | cash-flow-irr-calculator: duplicado potencial de VAN, reserva |
| `rule of 72 calculator` | compound-interest-calculator: duplicado potencial, reserva si solo añade fórmula |
| `cap rate calculator` | rental-yield-calculator: posible solapamiento; inversión comercial y NOI obligatorio |
| `logarithm calculator` | scientific-calculator: reservar si no aporta explicación y resolución inversa |
| `mixed number to improper fraction` | fraction-calculator: ya cubierto, excluir |
| `fraction to percent calculator` | fraction-calculator y percentage-calculator: ya cubierto, excluir |
| `synthetic division calculator` | polynomial-long-division-calculator: mismo objetivo, agrupar y excluir como URL |
| `completing the square calculator` | equation-solver: transformación no resolución; reservar si intención coincide |
| `dot product calculator` | vector-calculator: incluir ahí, excluir URL |
| `distance formula calculator` | coordinate-geometry-calculator: ya cubierto, excluir |
| `pythagorean theorem calculator` | triangle-calculator: ya cubierto por triángulos, excluir |
| `arc length calculator` | circle-calculator: incluir ahí, excluir URL |
| `weighted standard deviation calculator` | standard-deviation-calculator: duplicado funcional probable; reservar |
| `outlier calculator` | box-plot-calculator: limpieza y revisión de casos, posible solapamiento |
| `bayes theorem calculator` | probability-calculator: ya cubierto condicional parcialmente; reservar |
| `hypergeometric calculator` | probability-distribution-calculator: distribución nueva; reservar si puede ampliar existente |
| `geometric distribution calculator` | probability-distribution-calculator: extensión del motor, excluir nueva URL |
| `walking calorie calculator` | calories-burned-calculator: mismo propósito; agrupar y excluir URL |
| `running calorie calculator` | calories-burned-calculator: incluir modalidad, excluir URL |
| `sand calculator` | gravel-calculator: parecido; reservar si solo sustituye material |
| `flooring calculator` | square-footage-calculator y tile-calculator: ya cubierto, excluir |
| `wire size calculator` | voltage-drop-calculator: mismo modelo inverso; agrupar/excluir URL si sin normativa propia |
| `speed distance time calculator` | running-pace-calculator: mismo modelo; reservar salvo física explicada distinta |
| `ascii converter` | text-to-binary-converter: mismo objetivo; agrupar/excluir URL |
| `json to java` | json-to-typescript: mismo uso; preferir suite de modelos y excluir separada |
| `yaml validator` | json-yaml-converter: ya valida; excluir |
| `hex to rgba converter` | color-converter: ya cubierto/extendible, excluir |
| `nanoid generator` | uuid-generator: IDscompactos conprobabilidad; reserva si compite mismaintención |
| `regex replace` | regex-tester: ya posiblesubfunción, reserva |
| `crontab guru` | cron-expression-builder: ya cubierto, excluir |
| `cron to calendar` | cron-expression-builder: mismaintención, excluir |
| `epub to txt` | epub-reader: extracciónyahecha, excluir |
| `pages converter` | odt-converter: alto riesgodecompatibilidad, reserva técnica |
| `timesheet template` | time-card-calculator: ya cubierto, excluir |
| `meditation timer` | online-timer: posiblesubfunción, reserva si noaporta interacciónpropia |
| `day of week calculator` | date-calculator: subfunción fecha, excluirURL |
| `image joiner` | image-collage-maker: mismaintención, excluir |
| `photo frame maker` | image-editor: posible subfunción, reservar |
| `coloring page generator` | photo-to-sketch: contornospintables vs sombreado, posible solapamiento |
| `palette contrast checker` | color-contrast-checker: ya cubierto a pares, reservar |
| `cubic bezier generator` | css-animation-generator: posiblemente subfunción easing, reservar |
| `css triangle generator` | css-clip-path-editor: mismoresultado, excluir |
| `css aspect ratio calculator` | ratio-proportion-calculator: ya cubierto, excluir |
| `css sprite generator` | sprite-sheet-maker: ya cubierto, excluir |
| `monogram maker` | logo-maker: mismafamiliacomposición, agrupar yexcluir |
| `team name generator` | business-name-generator: intenciónparecida; reservarsi diccionario solamente |
| `word unscrambler` | anagram-solver: mismaintención, excluir |
| `crossword solver` | word-finder: mismopatron, agrupar/excluir |
| `venn diagram maker` | set-calculator: representaciónmisma, agrupar/excluir |
| `pie chart maker` | chart-maker: mismo propósito, reservarampliacióndeexistente |
| `pros and cons list` | decision-matrix: similar comparación, reserva |
| `reading tracker` | reading-log: ya cubierto, excluir |
| `sudoku generator` | sudoku: ya cubierto, excluirURL |
| `word search game` | word-search-maker: actualsolo generadorimprimible; posible mismoURL, reservar |
| `speed math game` | mental-math-practice: ya cubierto, excluirURL |
| `2048 solver` | 2048-game: mismo motor, reservar |
| `maze game` | maze-generator: incluirjuegoahí, excluirsegundaURL |

### Reserva por menor demanda o alcance por verificar

No sustituir una ficha bloqueada con una reserva automáticamente. Primero acreditar demanda/función propia, coste cero, licencias y separación SEO. Una ausencia de dato no significa ausencia de mercado mundial.

| ID / consulta exacta | Volumen US/en | KD | Frontera |
| --- | ---: | ---: | --- |
| `percentile-rank-calculator` / `percentile rank calculator` | 260 | 0 | z-score-calculator: percentil empírico no modelo normal |
| `radiator-size-calculator` / `radiator size calculator` | 260 | 0 | heat-loss-calculator: emisores y corrección térmica |
| `protobuf-decoder` / `protobuf decoder` | 260 | 0 | hex-editor: semánticabuffers |
| `unicode-character-detector` / `unicode inspector` | 260 | 3 | word-counter: inspección no recuento |
| `lens-calculator` / `lens calculator` | 260 | 11 | protractor: óptica geométrica |
| `bernoulli-equation-calculator` / `bernoulli equation calculator` | 210 | 0 | pressure-calculator: balance energético de flujo |
| `ulid-generator` / `ulid generator` | 210 | 0 | uuid-generator: ID ULID distinto |
| `photo-contact-sheet` / `photo contact sheet` | 210 | 1 | image-collage-maker: índicecontactono collagedecorativo |
| `takuzu` / `takuzu` | 210 | 3 | sudoku: lógicabinaria no dígitos1-9 |
| `sql-query-builder` / `sql query builder` | 210 | 6 | sql-formatter: composición noformato |
| `sql-schema-designer` / `database diagram tool` | 210 | 23 | diagram-maker: modelorelacional específico |
| `css-button-generator` / `css button generator` | 210 | 62 | css-box-shadow-generator: componente no una propiedad |
| `ev-range-calculator` / `ev range calculator` | 170 | 0 | ev-charging-calculator: alcance no carga |
| `ini-editor` / `ini editor` | 170 | 0 | toml-validator: configuración INI distinta |
| `irrigation-calculator` / `irrigation calculator` | 170 | 13 | rainwater-harvesting-calculator: aplicación, no captación |
| `hreflang-checker` / `hreflang checker` | 170 | 29 | meta-tag-generator: relaciónmultiidioma no metatagsgenerales |
| `set-calculator` / `set calculator` | 140 | 2 | probability-calculator: conjuntos explícitos, no probabilidades |
| `semaphore-translator` / `semaphore translator` | 140 | 4 | morse-code-translator: sistemavisual distinto |
| `rf-link-budget-calculator` / `link budget calculator` | 140 | 7 | decibel-calculator: cadena RF completa |
| `bill-reminder` / `bill reminder` | 140 | 16 | household-budget-planner: calendariocobros no gasto |
| `continued-fraction-calculator` / `continued fraction calculator` | 110 | 0 | fraction-calculator: aproximaciones y convergentes |
| `op-amp-calculator` / `op amp calculator` | 110 | 7 | ohms-law-calculator: amplificador |
| `json-merge` / `json merge` | 110 | 8 | json-diff: combinación no comparación |
| `equity-dilution-calculator` / `equity dilution calculator` | 90 | 0 | ownership-percentage-calculator: rondas y dilución sucesiva |
| `markov-chain-calculator` / `markov chain calculator` | 90 | 0 | matrix-calculator: proceso estocástico no operaciones de matriz |
| `sheet-cutting-optimizer` / `sheet cutting optimizer` | 90 | 15 | lumber-cut-calculator: cortes bidimensionales |
| `pdf-imposition` / `pdf imposition` | 90 | 19 | pdf-page-editor: imposiciónlibreto no organizaciónsimple |
| `json-flatten` / `json flatten` | 70 | 0 | json-formatter: transformación de estructura |
| `toml-validator` / `toml validator` | 70 | 0 | json-yaml-converter: formato TOML distinto |
| `hmac-generator` / `hmac generator` | 70 | 0 | sha256-hash-generator: autenticación conclave |
| `odt-converter` / `odt converter` | 70 | 0 | pdf-document-converter: Open Document distinto |
| `packing-slip-generator` / `packing slip generator` | 70 | 0 | packing-list-maker: cumplimiento de pedido no viaje |
| `sql-to-json` / `sql to json` | 70 | 2 | sqlite-playground: generación deinsert no consultasDB |
| `css-clamp-generator` / `css clamp generator` | 70 | 6 | css-grid-generator: tipografíano layout |
| `csp-generator` / `csp generator` | 70 | 9 | meta-tag-generator: política deseguridad noSEO |
| `running-race-predictor` / `running race predictor` | 70 | 14 | running-pace-calculator: extrapolación de marcas no velocidad simple |
| `network-graph-maker` / `network graph maker` | 70 | 27 | diagram-maker: relacionesmultiredno cadena |
| `geometric-transformation-calculator` / `geometric transformation calculator` | 50 | 0 | coordinate-geometry-calculator: transformaciones de figuras |
| `snells-law-calculator` / `refraction calculator` | 50 | 0 | lens-calculator: interfaz refractante |
| `base-number-arithmetic-calculator` / `binary arithmetic calculator` | 50 | 1 | binary-converter: operaciones no conversiones |
| `text-encoding-converter` / `text encoding converter` | 50 | 11 | text-to-binary-converter: archivos y charset no representaciónbinaria |
| `ecommerce-profit-calculator` / `ecommerce profit calculator` | 30 | 0 | profit-margin-calculator: economía por pedido desglosada |
| `csv-join` / `csv join` | 30 | 0 | csv-merge: relación porclave no concatenar |
| `image-quality-analyzer` / `image quality analyzer` | 30 | 0 | image-sharpener: diagnóstico no aplicarfiltró |
| `nginx-config-generator` / `nginx config generator` | 30 | 5 | htaccess-generator: servidor Nginx distinto; posible suite |
| `htaccess-generator` / `htaccess generator` | 30 | 19 | robots-txt-generator: servidor Apache no crawlers |
| `css-glassmorphism-generator` / `css glassmorphism generator` | 20 | 5 | css-filter-generator: componente compuesto no filtroaislado |
| `msgpack-to-json` / `msgpack to json` | 20 | 19 | protobuf-decoder: formato sin schema |
| `csv-pivot` / `csv pivot` | 10 | — | chart-maker: agregación pivote no gráficos |
| `env-file-generator` / `env file generator` | 10 | — | ini-editor: sintaxisdotenv y secretos locales |
| `argon2-generator` / `argon2 generator` | 10 | — | bcrypt-generator: algoritmo alterno; preferir password-hashing suite si SERP igual |
| `permissions-policy-generator` / `permissions policy generator` | 10 | — | csp-generator: permisosbrowser no fuentescontenido |
| `cors-header-generator` / `cors header generator` | 10 | — | api-request-builder: configuraciónrespuestas no solicitud |
| `ics-calendar-generator` / `ics calendar generator` | 10 | 0 | printable-calendar-maker: evento digital no rejillaimpresa |
| `raci-matrix-generator` / `raci matrix generator` | 10 | — | org-chart-maker: responsabilidadportarea no jerarquía |
| `swiss-tournament-pairing` / `swiss pairing generator` | 10 | 2 | round-robin-tournament-generator: sistema Suizonoliga |
| `css-transform-generator` / `css transform generator` | 10 | 8 | css-animation-generator: transformestático no keyframes |
| `graphql-schema-generator` / `graphql schema generator` | 10 | 17 | graphql-formatter: autoría schema vsformateo |
| `pdf-attachments-extractor` / `extract embedded files from pdf` | 10 | 21 | pdf-ocr: binarioembedded notextopágina |
| `css-loader-generator` / `css loader generator` | 10 | 45 | css-animation-generator: componenteestado de carga |
| `diff-patch-generator` / `diff patch generator` | 0 | — | text-diff-checker: artefacto patch ejecutable no visual |

Otras ideas detectadas pero no contadas: height calculator (110.000 US/en, KD 28) exige un método de estimación de estatura responsable; BAH calculator (74.000, KD 15) exige tablas oficiales US versionadas; birth chart/rising sign implican entretenimiento y cálculo astronómico preciso. No añadirlas por un volumen alto sin resolver el contrato. Las consultas de competidores y marcas no justifican una copia.

## Anexo D · Handoff y definición de cierre

**Instrucción al siguiente modelo:** leer el documento completo y el estado online; no replanificar ni investigar con API pagada; ejecutar F0–F12, manteniendo las 277 protegidas. Trabajar por fichas y registrar evidencias. No sustituir funcionalidad por texto SEO ni declarar terminado lo que no se ha publicado. Si hay un bloqueo externo real, identificarlo exactamente y continuar el trabajo independiente permitido; no fingir permisos/credenciales ni contratar servicios.

- [ ] 323 IDs nuevos únicos, 277 protegidos conservados y exactamente 600 herramientas contando solo productos que pasan los gates.
- [ ] 36 versiones funcionales por nueva herramienta: 11.628 páginas de herramientas nuevas, sin placeholders ni clones de keywords.
- [ ] Toda función anunciada tiene test/fixture; exportaciones reabiertas, juegos con reglas y variedad, nada marcado verificado si sigue pendiente.
- [ ] Hosting estático repartido sin plan pagado nuevo, sin costes por archivo ni procesamiento servidor; límites de cuenta comprobados.
- [ ] Presupuestos técnicos y carga diferida pasan; no pruebas de PageSpeed solicitadas ni scores inventados.
- [ ] Commit/push/merge/deploy confirmados, URLs públicas, sitemaps y documentación consistentes con el catálogo real.
- [ ] Estado por buscador separado de indexación efectiva; no «todos actualizados» si falta un panel o lectura.
- [ ] README con todas las herramientas, hosts, idiomas y archivo/listado completo de URLs reales; indicar totales reales, no la proyección de este plan.
- [ ] Plan/progreso/datasets/artefactos respaldados online y temporales propios eliminados tras verificar recuperación.

**Cierre de ESTE documento:** planificación entregada; no se ha implementado ni desplegado la expansión. Ninguna casilla de producto se ha tachado para hacer pasar un plan por trabajo terminado.
