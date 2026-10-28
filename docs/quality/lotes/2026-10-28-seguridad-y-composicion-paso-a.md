# 28-oct · Seguridad, responsive y composición local del Paso A

Trabajo en curso, rama `feat/new-tools-batch-1`, PR #136. No se publica ni se cierra Paso A.

## Hito 1 · DOMPurify y vista previa Markdown

Revisada manualmente la PR #135 y la [versión oficial 3.4.17](https://github.com/cure53/DOMPurify/releases/tag/3.4.17). Se incorpora a esta rama la misma actualización de DOMPurify en manifest/lock, conservando todas las demás dependencias. En los usos actuales no se observan las combinaciones específicas de flags/hooks de las tres alertas; no se afirma ausencia universal de exposición.

En Chrome real se reprodujeron los tres fallos de 3.4.16 (shadow DOM/template, neutralización de nodos retirados por hooks y SMIL/XHTML). Con 3.4.17 pasan los tres y una prueba de contenido normal, sin evaluar los payloads ni clicar enlaces. Las regresiones quedan en `tests/browser/dompurify-security.mjs`; [resultado y fuentes](../security-dompurify-v1/browser.json).

El hub copia y solicita `purify-3.4.17.min.js`, evitando reutilizar la URL inmutable anterior. El sitio principal ya incorpora lock y bytes vendor en su versión de assets. Dos regresiones Node comprueban la versión segura, lock y correspondencia entre URL y archivo copiado.

Se construyó Markdown con su controlador, CSS específico y librerías reales: seis páginas (herramienta y home en en/es/ar), 19 archivos, 160.197 bytes. Es una prueba parcial, no el build publicable. La vista previa conserva el contenido normal, elimina marcado ejecutable y mantiene el iframe sandbox.

La prueba encontró y reprodujo otros tres defectos: el skip link desplazado a `left:-9999px` ensanchaba páginas RTL; los márgenes móviles eran de 8 px; botones y checkbox de Markdown tenían zonas de menos de 44 px. Se corrigen con posición lógica/fija del skip link, margen mínimo de 16 px y controles de 44 px. `tests/browser/page-layout.mjs` verifica geometría y foco. Matriz final: **27 muestras** (en/es/ar × nueve anchos 320–1920), sin desbordamiento, con márgenes y zonas táctiles correctas. Teclado real en Chrome: Tab alcanza el skip link visible, Enter lleva a `#tool` y el siguiente Tab queda dentro del contenido. [Evidencia](../security-dompurify-v1/markdown-browser.json).

**153 tests Node correctos**, incluidos los 106 propietarios recuperados, paquetes/preview y las regresiones previas. No equivale a `npm test` global ni a las siete capas completas de una herramienta. No se aprueba ningún idioma ni herramienta.

Las alertas seguirán abiertas en la rama por defecto mientras no se integre allí el parche; PR #135 se conserva abierta. La actualización y estos arreglos aún no están en producción. Sin Actions de web, cambios de traductor, modelos iniciados por el agente, Cloudflare, activaciones o nuevas pruebas físicas.

## Hito 2 · Composición

En curso: preparar una composición local que preserve rutas y noindex, resuelva los metadatos comunes y no mezcle cabeceras contradictorias. Antes del corte siguen pendientes checks globales, capacidad/coste real y verificación de publicación. Se mantiene la preview separada.
