# Construcción secuencial · Paso A · 29-oct-2026

Evidencia local de la rama de PR #136. No es un despliegue, corte de dominio ni aprobación de herramienta/idioma.

- `preview.json`: inspección de los 11.100 payloads (300 × 37), noindex, sin URLs de sitemap. Las 300 nb son inglés declarado, no traducciones noruegas aprobadas.
- `composition.json`: tres builds nativos unidos; 38.817 archivos, 25.300 rutas existentes y 11.100 nuevas. Las 700 existentes conservan indexación. El sitemap unificado tiene 25.589 canónicas: 25.625 de entrada menos 36 homes duplicadas entre hosts. No se elimina ninguna herramienta.
- `written-verification.json`: segunda lectura de la salida, todos los sitemaps/rutas/recursos enlazados; 1.425.287.923 bytes reales. No quedan hosts antiguos ni HTML disfrazado de JS/CSS. Las 327 páginas auxiliares de directorio son nuevas, noindex y fuera del sitemap/hreflang.
- `*-brotli-pack.json`: archivos comprimidos v2, hashes/tamaños y verificación de cada fichero antes de retirar la entrada. Huella proyectada máxima al unir: 1.996.857.176 B (<2.000.000.000); disco libre >45 GB. No ejecutar los builds en paralelo ni guardar tres árboles crudos más su unión.
- `composition-browser.json`: 63 geometrías, siete idiomas, 320–1920 px, RTL, márgenes y 32 comprobaciones de búsqueda/paginación/recursos. `browser.json`: otras 126 geometrías y 21 comprobaciones en dos borradores. Chrome; no dispositivos físicos ni Firefox/WebKit.
- `pdf-browser.json`: PDF sintético local; una imagen roja 120×80 extraída mediante el worker correcto. No acredita el conjunto de funciones PDF.
- `production.json`: tres navegaciones de lectura sobre la versión publicada; no verifican esta rama. El soft404 de tools. sigue pendiente.

## Repetir sin Actions de web ni modelos en el Mac

1. Checkout ligero de la rama con los archivos fuente necesarios; ≥10 GB libres y control de huella ≤2 GB. Preparar dependencias con `python3 scripts/install-local-build-deps.py .qa-<lote>/deps --install`; enlazar su node_modules desde la raíz. No modificar el lock original.
2. Ejecutar `npm test`, `npm run check` y `npm run locale:release-check`. Guardar principal fuera de dist por `USEFULVERSE_DIST`. Empaquetarlo con `packBuild({input,output,workingRoot,compression:'brotli'})`; retirar árbol crudo solo después de `verifiedEveryFile` y fuente remota verificada.
3. Preview: `GROWTH600_NOINDEX_DRAFT_RELEASE=1 GROWTH600_PREVIEW_ONLY=1 GROWTH600_PREVIEW_NB=1 GROWTH600_DIST=<preview> node scripts/build-growth600.mjs`. Ejecutar `verify-draft-preview.mjs`; empaquetar/verificar/retirar árbol crudo.
4. Hub: `GROWTH600_LOCAL_LINK_STAGING=1 GROWTH600_DIST=<hub> npm run build:growth600`. Staging comparte solo bytes inmutables; metadatos mutables se copian. El error histórico de recuperación con espacios está corregido con fileURLToPath. Empaquetar/verificar antes de retirar el árbol.
5. `composeSites` acepta los tres archivos comprimidos directamente. `catalog.json` es el catálogo congelado de este lote, con hashes de las seis fuentes en `catalog-sources.json`; regenerarlo si cambian esas fuentes. La CLI completa deriva el catálogo del repo. Conservar todos sus bloqueos de indexación, colisiones, archivos, peso y disco.
6. Servir la salida solo en loopback y ejecutar `tests/browser/composition-paginated.js`, `draft-nb-preview.js` y `composition-pdf-extraction.js` mediante DevTools. Comprobar visualmente móvil/tablet/escritorio. El servidor HTTP ordinario **no** simula `_headers`, `_redirects` ni el fallback de Workers: quedan para el ensayo del runtime real antes de publicar.

El directorio paginado mantiene 100 enlaces por página y todos los enlaces en conjunto. La búsqueda descarga una sola vez el índice completo al escribir; incluye títulos/descripciones y vocabulario anterior. Sin índice funciona el respaldo nombre/slug de la página visible. Las categorías del principal se conservan; las herramientas sin categoría equivalente permanecen bajo la etiqueta existente de todas. nb conserva su directorio previo, sin inventar una home nueva ni una traducción.

Dos capturas antiguas de HTML (`pdf.worker.mjs`, `qcms_bg.js`) se excluyen solo del resultado compuesto; originales intactos. Se fijan sus hashes y los seis callers revisados; cambios o referencias nuevas bloquean la composición. No se reescriben assets con hash. El extractor real carga `extract-images-pdf-worker.mjs`, comprobado en Chrome.

Pendiente de Paso A: checks del runtime real/cabeceras, integración y entrega manual de la versión final en la preview existente, diez muestras publicadas y registro de subida. No anticipar fase 0 ni el corte de §4b. Antes de cualquier publicación: plan/cuota/coste vigente comprobados, sin nuevo gasto, y reglas de entrega del RUNBOOK. Traductor intacto y siete workflows activos; tres workflows de web deshabilitados.
