# Fase 0 + G1 · candidato local · 29-oct-2026

Fuente integrada en main por PR143, merge `e2286d9`; [recibo](integration.json). Rama histórica `fix/phase-0-g1`, desde main `911187d`. No es una publicación ni una aprobación de herramientas/idiomas.

Cambios: 404 real del hub reutilizando la página existente; portada principal sin aplicar dos veces el SEO; sitemaps por idioma en ambos hosts; namespace de contenido para las dependencias de las 106 recuperadas. Fuentes capturadas, slugs, traducciones y workflows intactos. Las 300 siguen en noindex y fuera del sitemap.

## Comprobaciones

- Regresiones rojas antes de los arreglos: título duplicado, longitud, 106 controladores sin versión, 404 ausente e índice de idiomas ausente. La revisión real encontró contraste 4,21:1, enlaces pequeños, idioma del navegador por delante de la ruta y favicon implícito inexistente; también tienen regresión permanente.
- `responsive-404.json`: 27 geometrías Chromium (es/de/ar × 320,360,390,414,768,1024,1280,1440,1920), cero infracciones axe 4.14 A/AA, márgenes ≥24px y 38 enlaces por página con tamaño ≥44px. Teclado Tab→marca→botón con foco visible; Enter volvió a `/es/`. [Móvil RTL](404-mobile-ar.webp), [tablet alemana](404-tablet-de.webp), [escritorio](404-desktop.webp).
- `local-cache.json`: runtime **Pages dev de Wrangler 4.154**, sin Functions/bindings remotos y sin credenciales. HTML con revalidación y JS/CSS con hash con `max-age=31536000, immutable`, sin combinar la caché global del HTML. Tres rutas falsas respondieron 404/noindex en el runtime. `local-initial.json` conserva el hallazgo inicial de contraste, resuelto posteriormente.
- Suite completa: **3.272 Node correctas, cero fallos/omisiones**. La regresión final de favicon y la ampliación de referencias de los 106 propietarios pasaron en la ejecución focalizada final de **18 pruebas** (se solapa con la suite; no se suman). `validation.json` conserva el alcance exacto. No se aprueban las siete capas de ningún propietario por estas pruebas de infraestructura.
- Principal: **10.764 archivos / 487.000.155 B / 10.260 URLs / 36 idiomas**; `npm run check` y gate de 20 idiomas correctos. Hub: **16.392 archivos / 776.765.871 B / 15.365 URLs / 37 idiomas**; inventario idéntico al público capturado. **3.816 páginas / 106 propietarios / 192 assets versionados**, comparados byte a byte; ningún contenido/lógica de las recuperadas cambió. `native-main.json` y `native-hub.json` guardan fingerprints.
- Pages dev sirvió el **hub completo**: tres falsas 404/noindex, 37 feeds/15.365 URLs y controlador 401k con namespace `8dcb0a88a745596406d82318`, HTTP200/JavaScript/caché immutable. Cero recursos fallidos de arranque y cero mensajes de consola; los tres 404 de `native-hub-http.json` son las peticiones deliberadas del probe.
- Guardia local cada 2s: máximo **muestreado** 1.839.490.266 B y mínimo 44.564.971.520 B libres; cotas 2GB/10GB. Las salidas/dependencias se procesaron secuencialmente. No hubo modelos locales ni nueva infraestructura.
- Aviso existente: el `_headers` principal tiene tres patrones CSP con doble comodín que Pages ignora. No se modificaron en fase 0; el compositor futuro ya los normaliza. G12 y la revisión integral de seguridad siguen pendientes.

## Fechas del sitemap

`lastmod` es una fecha de cambio del contenido, nunca la fecha del build. Se registra **2026-10-29** para las 36 portadas principales revisadas y las 3.816 páginas recuperadas cuyas referencias cambian por G1. Las fechas históricas desconocidas de las demás páginas se omiten; no se inventa una actualización. El campo es opcional según [Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). La prueba permanente exige estabilidad al reconstruir y rechaza fechas imposibles. Las fechas deben actualizarse al cambiar nuevamente esas páginas.

El namespace de 24 dígitos hexadecimales se deriva del inventario ordenado de rutas y SHA-256 de **todos** los bytes originales de las dependencias recuperadas, antes de reescribir referencias absolutas. Evita hashes circulares y conserva imports/Workers relativos. Cambiar un vendor cambia también la URL de los 106 puntos de entrada; una reconstrucción idéntica conserva el namespace. Los originales del traductor no cambian. Las dos capturas HTML conocidas siguen sujetas a la cuarentena y revisión fijadas por hash del compositor futuro.

## Producción y siguiente publicación

`production-main.json` y `production-hub.json`: lecturas desde Chrome normal, 29-oct. **10.260 + 15.365 = 25.625 URLs** en los XML públicos; las tres rutas falsas siguen 200, título duplicado y controlador 401k sin hash/caché de un año. La terminal recibió 403; sus respuestas no se usaron para certificar el sitio. No se ha desplegado este lote ni reenviado feeds.

El despliegue del 29-oct ya se consumió con la preview del Paso A. Respetar **uno por día Asia/Saigon**: primero hub no antes del **30-oct 00:00 +07**; principal en un día posterior (como pronto **31-oct 00:00 +07**). Revalidar coste/cuota/Direct Upload y candidato completo antes de cada publicación. Verificar 404, HTML/indexación, inventario de sitemaps y URLs/caché de assets en producción; solo entonces cerrar fase 0 + G1 y reenviar únicamente los sitemaps limpios. No publicar cambios de fase 0b, corte de dominio ni diseño hasta verificar ambos. Pedro autorizó preparar/probar mejoras en ramas separadas el 29-oct, sin esperar a esa publicación.

## Repetición sin Actions

1. Clon propio ligero, ≥10 GB libres; `python3 scripts/install-local-build-deps.py .qa-<lote>/deps --install`, enlazar `node_modules`. Un proceso pesado cada vez y huella ≤2 GB.
2. `npm test -- --test-concurrency=1`; primero muestra real `node scripts/security/build-composition-smoke.mjs .qa-step-a/<nuevo> --extended`. Servir por `wrangler pages dev` solo local, sin variables/bindings remotos. Para el 404 cargar axe solo en QA y ejecutar `tests/browser/phase-zero.js`.
3. `USEFULVERSE_DIST=.qa-<lote>/main npm run check`; `npm run locale:release-check`. Inventariar/verificar; retirar salida cruda antes de ensamblar el hub.
4. `GROWTH600_LOCAL_LINK_STAGING=1 GROWTH600_DIST=.qa-<lote>/hub npm run build:growth600`. Mantener `flat-staging` exclusivamente durante los merges internos; el resultado final debe tener índice por idioma. Auditar 15.365 URLs y las 3.816 páginas/106 scripts recuperados.
5. Para servir el hub completo bajo 2 GB, retirar dependencias de build después de verificarlo e instalar solo el runtime local. Guardar evidencia, push verificado y retirar todo el material propio antes de LIBRE. Sin Actions web, modelos locales, activaciones ni servicios nuevos.

Pruebas Pedro: ocho pendientes anteriores, cero FALLA y **ningún ID nuevo**; este lote no necesita cámara/micrófono ni archivos físicos. Firefox/WebKit, dispositivos reales, zoom real del navegador al 200%, INP y revisión integral de las herramientas no se certifican aquí.

**Preflight29-oct16:32UTC:** acceso Pages/WorkersPaid existente y uso actual bajo techo10 comprobados solo lectura; producción sigue18oct/preview29oct. [Registro sin facturación privada](preflight-20261029-1632.json). No despliegue todavía, ventana30-oct00:00+07. [Receta de lectura](preflight-recipe.mjs), ejecutar desde clon con OUTPUT bajo .qa-; se comprueba la API con paginación10. Antes de publicar aún hay que inventariar toda la cuota mensual y comprobar el árbol exacto sin Functions/Worker.
