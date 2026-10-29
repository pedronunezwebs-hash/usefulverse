# Entrega del hub · fase0 + G1 ·30-oct-2026

**Publicado y verificado solo el hub. Fase0 aún pendiente del principal.**
Fuente [main75b010f](https://github.com/pedronunezwebs-hash/usefulverse/commit/75b010fb88579332896b96ad8fb00141ec19b891), con PR143 ya integrada.
Despliegue [7e74ca2e](https://7e74ca2e.usefulverse-tools.pages.dev), producción `usefulverse-tools`,
creado30-oct00:03:38+07. [Recibo](deployment.json).
Se respetó la ventana diaria; coste incremental0, sin plan nuevo, Functions, Worker de visitas ni Containers.
No se publicó el diseño ni las herramientas candidatas PR144–148/150.

## Qué se comprobó

- [Producción final](production-final.json): `/tools/zzz/`, `/es/zzz/`, `/zzz.html` y `/tools/zzz-no-existe/`
  responden **404/noindex**, con idioma de ruta correcto. Ya no devuelven200 con la portada.
- Controlador401k en namespace `8dcb0a88a745596406d82318`:HTTP200, JavaScript y
  `public, max-age=31536000, immutable`, sin mezclar `max-age=0`.
  La página carga sin errores; no se presenta como revisión de su fórmula financiera.
- **37 feeds y15.365 URLs**, sin duplicados/canónicas ajenas. Diez HTML en en/es/ar/ja/hi/de/fr/ru/nb:
  200, canonical propio, sin noindex y presentes en su sitemap. Nueve muestras recuperadas usan el nuevo namespace;
  nb es una herramienta de mercado ya existente, no una activación de nb para las106.
- Una primera pasada encontróXML inválido en un feed. No se guardaron su ruta/respuesta cruda en ese primer intento,
  por lo que **la causa no está identificada**. Propagación transitoria es solo una inferencia.
  La [segunda pasada](production-hub2.json) y la final con diez muestras completaron correctamente los37feeds,
  sin cambiar fuente ni hacer otro despliegue. [Evento y límites](initial-probe-event.json).
  La sonda permanente ahora guarda fallos con ruta/prefijo, valida todos losXML y pone plazo a cada fetch.
- [Principal y preview300](preserved-deployments.json) mantienen sus versiones:principal18-oct/0bfcbf58,
  preview29-oct/413cf159. **300 noindex,0activaciones y25.625URLs públicas antes/después:delta0**.
  La verificación de esta entrega no aprueba las siete capas de ninguna herramienta/idioma.

## Fuente, builds y comprobaciones locales

| Salida | Archivos | Bytes | URLs | Fingerprint |
|---|---|---|---|---|
| Principal, no publicado |10.764|487.000.155|10.260|cbbaa444ff53362c7fd1a24471b20ab89872d886ea475bba1772ee65b6c2788d|
| Hub publicado |16.392|776.765.871|15.365|f3c7a647a4a7a8886798723cfaf29c7586b1f6b0ccc79d469803555c50f36eb8|

Ambos árboles son **idénticos byte a byte a los ya verificados** en phase-0-v1; no se repitió su investigación.
[Principal](native-main.json),[hub](native-hub.json). No raíz `_worker.js` ni `functions/`.
El inventario incluye `_headers`; Wrangler cuenta16.391 assets y sube las cabeceras aparte.

- [3.287 Node](node-tests.log),0fallos/0omisiones,53.614ms, sobre main exacta; check principal y gate20 correctos.
  No sumar con3.579 de la pila de prototipos, que incluye pruebas de candidatas aún no integradas.
- [Pages local4.155](local-runtime.json): tres falsas404, caché/37feeds correctos y27geometrías es/de/ar,
 320–1920px, axe0, márgenes/objetivos44px. Se conservan las capturas previas por igualdad de bytes.
- Dependencias de build fijadas por el lock, sin inferencia nativa ni modelos nuevos; retiradas antes del navegador.
 La instalación nativa no incluía Playwright: QA ligero se instaló en prefijo propio. Wrangler global4.107 no soportaba
 la fecha actual de compatibilidad; se usó4.155 local, sin modificar la instalación global.
- Hub/páginas de build se procesaron secuencialmente. Hub máximo **muestreado1.852.879.007B**/mínimo libre41,8GB,
 dentro de2GB/10GB. Ver informes de recursos. Un solapamiento inicial breve entre Node y build se detectó y se añadió
 [flock no bloqueante](bounded-runner.py) con [regresión permanente](bounded-regression.py), que también comprueba
 que el siguiente trabajo arranque al liberar el bloqueo. No se superó el presupuesto.

## Coste y traducción

[Preflight](cost-before-upload.json): WorkersPaid ya existente, planes/uso actual bajo el techo10USD,
 sin publicar filas privadas de facturación. [Cuota](quota.json):229eventos del mes contados conservadoramente antes
 de esta entrega y un evento adicional dentro del presupuesto500; no son minutos facturables medidos.
Dos proyectos UsefulVerse sin fuenteGit automática. Assets Pages sin Functions tienen
 [peticiones estáticas gratuitas](https://developers.cloudflare.com/pages/functions/pricing/).
Máximo de archivo14,26MB, por debajo25MiB, y16.392archivos dentro20.000; DirectUpload documentado por
 [Cloudflare](https://developers.cloudflare.com/pages/get-started/direct-upload/).
No se lanzó Actions de web, se contrató servicio ni se cambiaron límites/planes.

[Traductor](translation-status.json):40843674935 sigue automáticamente; última entrega120.294entradas exportadas.
No páginas/porcentaje/idiomas aprobados; unidades y objetivos se solapan. El aviso141 corresponde a la tanda anterior.
La campaña activa conserva el corpus48.403/unSHA anterior; PR149 entrega50.530unidades para una campaña futura.
No se reconfiguró ni reinició el traductor ni se tradujo manualmente.

## Siguiente paso

**Principal: no antes31-oct00:00+07 (30-oct17:00UTC), otro día de publicación.**
Desde main, comprobar instrucciones/candado/coste/cuota y reconstruir el principal con el instalador local y≤2GB.
Su fingerprint ya está validado; no mezclar las candidatas de diseño/OCR. Ejecutar check/gate, publicar solo el principal
y verificar título sin duplicados,36feeds/10.260URLs y muestras. Solo entonces cerrar fase0+G1 y reenviar los índices
limpios. No se reenviaron sitemaps ni URLs en esta entrega.

Mientras se espera se puede continuar **PR150: adaptadores reales PDF.js/Tesseract/pdf-lib y salidaPDF seleccionable**,
conservando sus pruebas/fixtures. Las diez calculadoras dePR148 están preparadas sin publicar; P-010 común sigue
bloqueada hasta URL candidata. Diez pruebas Pedro pendientes/0FALLA, sin IDs físicos nuevos.

Recetas de lectura/QA: `runtime-probe.mjs` desde la raíz del clon con origen local conocido o el público y salida bajo
`.qa-phase0/`; para la regresión del bloqueo ejecutar `python3 docs/quality/phase-0-delivery-20261030/bounded-regression.py`.
La cuota y el preflight solo leen APIs, no crean recursos. El servidor local debe iniciarse sin credenciales/bindings remotos.
Fuente/proofs respaldados antes de retirar cada clon; [retirada del primer entorno](math-retirement.json).
Recibo final de retirada y LIBRE se añade al terminar, no antes de eliminar los temporales propios.

[Lock exacto del QA ligero](qa-package-lock.json), además del lock principal usado por el instalador de build. Sin modelos ni credenciales.
