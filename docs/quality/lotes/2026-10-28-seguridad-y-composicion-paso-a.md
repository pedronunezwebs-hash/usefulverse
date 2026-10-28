# 28-oct · Seguridad, responsive y composición local del Paso A

Rama `feat/new-tools-batch-1`, PR #136. Lote parcial verificado; no se publica ni se cierra Paso A.

## Hito 1 · DOMPurify y vista previa Markdown

Revisada manualmente la PR #135 y la [versión oficial 3.4.17](https://github.com/cure53/DOMPurify/releases/tag/3.4.17). Se incorpora a esta rama la misma actualización de DOMPurify en manifest/lock, conservando todas las demás dependencias. En los usos actuales no se observan las combinaciones específicas de flags/hooks de las tres alertas; no se afirma ausencia universal de exposición.

En Chrome real se reprodujeron los tres fallos de 3.4.16 (shadow DOM/template, neutralización de nodos retirados por hooks y SMIL/XHTML). Con 3.4.17 pasan los tres y una prueba de contenido normal, sin evaluar los payloads ni clicar enlaces. Las regresiones quedan en `tests/browser/dompurify-security.mjs`; [resultado y fuentes](../security-dompurify-v1/browser.json).

El hub copia y solicita `purify-3.4.17.min.js`, evitando reutilizar la URL inmutable anterior. El sitio principal ya incorpora lock y bytes vendor en su versión de assets. Dos regresiones Node comprueban la versión segura, lock y correspondencia entre URL y archivo copiado.

Se construyó Markdown con su controlador, CSS específico y librerías reales: seis páginas (herramienta y home en en/es/ar), 19 archivos, 160.197 bytes. Es una prueba parcial, no el build publicable. La vista previa conserva el contenido normal, elimina marcado ejecutable y mantiene el iframe sandbox.

La prueba encontró y reprodujo otros tres defectos: el skip link desplazado a `left:-9999px` ensanchaba páginas RTL; los márgenes móviles eran de 8 px; botones y checkbox de Markdown tenían zonas de menos de 44 px. Se corrigen con posición lógica/fija del skip link, margen mínimo de 16 px y controles de 44 px. `tests/browser/page-layout.mjs` verifica geometría y foco. Matriz final: **27 muestras** (en/es/ar × nueve anchos 320–1920), sin desbordamiento, con márgenes y zonas táctiles correctas. Teclado real en Chrome: Tab alcanza el skip link visible, Enter lleva a `#tool` y el siguiente Tab queda dentro del contenido. [Evidencia](../security-dompurify-v1/markdown-browser.json).

**153 tests Node correctos**, incluidos los 106 propietarios recuperados, paquetes/preview y las regresiones previas. No equivale a `npm test` global ni a las siete capas completas de una herramienta. No se aprueba ningún idioma ni herramienta.

Las alertas seguirán abiertas en la rama por defecto mientras no se integre allí el parche; PR #135 se conserva abierta. La actualización y estos arreglos aún no están en producción. Sin Actions de web, cambios de traductor, modelos iniciados por el agente, Cloudflare, activaciones o nuevas pruebas físicas.

## Hito 2 · Composición

Se añade `scripts/compose-sites.mjs`, separado de despliegue: inventaría entradas sin modificarlas y bloquea colisiones de herramientas/archivos, noindex incorrecto, pérdidas de sitemap, hreflang hacia borradores, XML/canonical inseguros, cabeceras/redirects no revisados y exceso de presupuestos. Los assets con host antiguo se reconstruyen en origen; no se reescribe JS con hash. En HTML/metadatos se normalizan canonical, enlaces y hosts al dominio principal. Genera sitemap índice y ficheros por idioma, conserva 404 y reúne llms.txt.

La unión de cabeceras conserva caché inmutable de assets, evita concatenar un Cache-Control global contradictorio, elige DENY en el conflicto revisado y convierte el primer comodín de rutas localizadas a `:locale`. Weather conserva la posibilidad de geolocalización consentida mediante excepción acotada; no se relaja la política global. Los límites de [cabeceras](https://developers.cloudflare.com/workers/static-assets/headers/) y [redirects](https://developers.cloudflare.com/workers/static-assets/redirects/) se comprueban localmente. No se ha probado su aplicación en Cloudflare ni se ha consultado/cambiado el plan de la cuenta.

La home usa la plantilla principal y enlaces compactos a todas las herramientas disponibles. Categorías del principal conservadas; otras herramientas aparecen bajo el filtro «Todas» y en búsqueda. Es un directorio provisional, no Planeta Infinito ni taxonomía final aprobada. La prueba con textos reales detectó **59.117 bytes Brotli**, sobre presupuesto; se saca vocabulario/descripciones a JSON con hash, descargado solo al escribir. Conserva palabras clave anteriores y usa nombres/slugs si no hay red, sin reintentos por pulsación. La plantilla principal con las 277 tarjetas originales y **1.000 nombres ingleses** queda en **23.684 bytes Brotli**. No mide aún todas las homes reales/idiomas ni toda la primera carga.

La composición real parcial incluye word-counter, Markdown y grammar-checker, en en/es/ar: **38 archivos, 900.144 bytes, seis rutas existentes y tres nuevas en noindex**; sitemap con nueve URLs indexables, tres idiomas, seis colisiones de home y seis de llms resueltas. Se encontró y reprodujo margen de 12–14 px en el principal; queda en 16 px. La primera versión del arnés omitía dos bundles de idioma: se corrige con `localeBundleSource` real y queda una comprobación permanente de recursos.

**193 tests Node correctos**, incluidos 40 de composición/capacidad/búsqueda. Chrome: **108 muestras** (home + tres herramientas × tres idiomas × nueve anchos), con metadata, márgenes y sin overflow; **25 comprobaciones** de búsqueda, índice bajo demanda/una petición, recursos y tareas reales. Contador: tres palabras/13 caracteres; corrector mecánico: tres patrones; preview Markdown nativa mantiene DOMPurify 3.4.17, negrita, sandbox y eliminación de script. Inspección visual árabe en 390/768/1440, última fila centrada. Chromium únicamente; no Firefox/WebKit/axe/Lighthouse ni gate integral. [Datos](../composition-v1/evidence.json), [reproducción](../composition-v1/README.md).

La composición comprueba la huella completa de su directorio de trabajo y espacio libre antes de escribir (≤2 GB y ≥10 GB tras salida). La prueba real proyecta ~586 MB con el clon. El método ingenuo de mantener tres builds completos y copiarlos otra vez no cabe: queda pendiente una construcción secuencial recuperable. La CLI también exige `nb`, además de los 36 locales comunes: **no se afirma cobertura de 37 páginas nuevas por herramienta**. No inventa una home indexable cuando falta plantilla principal; ese caso requiere revisión.

## Producción y relevo

Sondeo HTTPS de solo lectura: word-counter responde 200; tools./tools/zzz/ aún responde 200 con home (soft 404 pendiente de fase 0); preview grammar-checker responde 200/noindex y conserva canonical del host anterior. La comprobación completa de Markdown encontró 403 y no acredita versión publicada. El código nuevo está solo en la rama; main y producción no reciben el parche en este lote.

API de GitHub: tres workflows de web deshabilitados, siete de traducción activos; campaña 40565692987 en ejecución y 40658885003 pendiente. No se cancela ni relanza nada. No cambia motor/modelos/memoria/políticas/checkpoints/fuentes inglesas. Sin Actions de web, nuevas APIs/recursos facturables, Cloudflare, despliegues, activaciones ni pruebas físicas nuevas. P-001–P-008 siguen pendientes; cero FALLA. Delta de URLs indexables: **0**.

Siguiente: build/composición completa 700+300 con 37 destinos nuevos, salida secuencial y recuperación verificada, gates globales y plan/coste real antes de integrar/publicar. Paso A permanece abierto; fase 0/G1/corte de dominio y pasada integral de cada herramienta siguen pendientes. Retirada y refs definitivas en `composition-v1/closure.json` al cerrar.
