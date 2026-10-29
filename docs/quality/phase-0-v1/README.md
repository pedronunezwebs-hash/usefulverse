# Fase 0 + G1 · candidato local · 29-oct-2026

Rama `fix/phase-0-g1`, desde main `911187d`. No es una publicación ni una aprobación de herramientas/idiomas.

Cambios: 404 real del hub reutilizando la página existente; portada principal sin aplicar dos veces el SEO; sitemaps por idioma en ambos hosts; namespace de contenido para las dependencias de las 106 recuperadas. Fuentes capturadas, slugs, traducciones y workflows intactos. Las 300 siguen en noindex y fuera del sitemap.

## Comprobaciones

- Regresiones rojas antes de los arreglos: título duplicado, longitud, 106 controladores sin versión, 404 ausente e índice de idiomas ausente. La revisión real encontró contraste 4,21:1, enlaces pequeños, idioma del navegador por delante de la ruta y favicon implícito inexistente; también tienen regresión permanente.
- `responsive-404.json`: 27 geometrías Chromium (es/de/ar × 320,360,390,414,768,1024,1280,1440,1920), cero infracciones axe 4.14 A/AA, márgenes ≥24px y 38 enlaces por página con tamaño ≥44px. Teclado Tab→marca→botón con foco visible; Enter volvió a `/es/`. [Móvil RTL](404-mobile-ar.webp), [tablet alemana](404-tablet-de.webp), [escritorio](404-desktop.webp).
- `local-cache.json`: runtime **Pages dev de Wrangler 4.154**, sin Functions/bindings remotos y sin credenciales. HTML con revalidación y JS/CSS con hash con `max-age=31536000, immutable`, sin combinar la caché global del HTML. Tres rutas falsas respondieron 404/noindex en el runtime. `local-initial.json` conserva el hallazgo inicial de contraste, resuelto posteriormente.
- Builds completos y cierre de la suite: se registrarán en `validation.json` después de su ejecución. No se aprueban las siete capas de ningún propietario por estas pruebas de infraestructura.

## Fechas del sitemap

`lastmod` es una fecha de cambio del contenido, nunca la fecha del build. Se registra **2026-10-29** para las 36 portadas principales revisadas y las 3.816 páginas recuperadas cuyas referencias cambian por G1. Las fechas históricas desconocidas de las demás páginas se omiten; no se inventa una actualización. El campo es opcional según [Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). La prueba permanente exige estabilidad al reconstruir y rechaza fechas imposibles. Las fechas deben actualizarse al cambiar nuevamente esas páginas.

El namespace de 24 dígitos hexadecimales se deriva del inventario ordenado de rutas y SHA-256 de **todos** los bytes originales de las dependencias recuperadas, antes de reescribir referencias absolutas. Evita hashes circulares y conserva imports/Workers relativos. Cambiar un vendor cambia también la URL de los 106 puntos de entrada; una reconstrucción idéntica conserva el namespace. Los originales del traductor no cambian. Las dos capturas HTML conocidas siguen sujetas a la cuarentena y revisión fijadas por hash del compositor futuro.

## Producción y siguiente publicación

`production-main.json` y `production-hub.json`: lecturas desde Chrome normal, 29-oct. **10.260 + 15.365 = 25.625 URLs** en los XML públicos; las tres rutas falsas siguen 200, título duplicado y controlador 401k sin hash/caché de un año. La terminal recibió 403; sus respuestas no se usaron para certificar el sitio. No se ha desplegado este lote ni reenviado feeds.

El despliegue del 29-oct ya se consumió con la preview del Paso A. Respetar **uno por día Asia/Saigon**: primero hub no antes del **30-oct 00:00 +07**; principal en un día posterior (como pronto **31-oct 00:00 +07**). Revalidar coste/cuota/Direct Upload y candidato completo antes de cada publicación. Verificar 404, HTML/indexación, inventario de sitemaps y URLs/caché de assets en producción; solo entonces cerrar fase 0 + G1 y reenviar únicamente los sitemaps limpios. No anticipar errores de fase 0b, corte de dominio ni diseño.

## Repetición sin Actions

1. Clon propio ligero, ≥10 GB libres; `python3 scripts/install-local-build-deps.py .qa-<lote>/deps --install`, enlazar `node_modules`. Un proceso pesado cada vez y huella ≤2 GB.
2. `npm test -- --test-concurrency=1`; primero muestra real `node scripts/security/build-composition-smoke.mjs .qa-step-a/<nuevo> --extended`. Servir por `wrangler pages dev` solo local, sin variables/bindings remotos. Para el 404 cargar axe solo en QA y ejecutar `tests/browser/phase-zero.js`.
3. `USEFULVERSE_DIST=.qa-<lote>/main npm run check`; `npm run locale:release-check`. Inventariar/verificar; retirar salida cruda antes de ensamblar el hub.
4. `GROWTH600_LOCAL_LINK_STAGING=1 GROWTH600_DIST=.qa-<lote>/hub npm run build:growth600`. Mantener `flat-staging` exclusivamente durante los merges internos; el resultado final debe tener índice por idioma. Auditar 15.365 URLs y las 3.816 páginas/106 scripts recuperados.
5. Para servir el hub completo bajo 2 GB, retirar dependencias de build después de verificarlo e instalar solo el runtime local. Guardar evidencia, push verificado y retirar todo el material propio antes de LIBRE. Sin Actions web, modelos locales, activaciones ni servicios nuevos.

Pruebas Pedro: ocho pendientes anteriores, cero FALLA y **ningún ID nuevo**; este lote no necesita cámara/micrófono ni archivos físicos. Firefox/WebKit, dispositivos reales, zoom real del navegador al 200%, INP y revisión integral de las herramientas no se certifican aquí.
