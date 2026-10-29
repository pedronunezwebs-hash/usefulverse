# UsefulVerse · ESTADO (leer primero)

> Relevo operativo. Un solo resumen actual; historial y evidencias en LOG, informes de lotes y Git.

**Última actualización:** 2026-10-30 · **por:** Codex
**Turno actual (candado):** LIBRE

Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

**Decisión vigente de Pedro (28-oct): Actions solo para el traductor**, con sus controles/entrega/avisos intactos.
Pruebas/builds/mediciones/deploys de herramientas y webs: local/manual, sin Actions ni contratación/gasto adicional.
Los tres workflows de web están deshabilitados; PR de dependencias automáticas pausadas, alertas de seguridad conservadas.
Objetivo confirmado: `usefulverse.com` como único dominio público, con 301 de `tools.` en el corte validado; todavía no migrado.
[Operación y comprobaciones](lotes/2026-10-28-webs-manuales-traductor-intacto.md). Esta decisión sustituye las referencias previas
que exigían Actions para la web; no modifica la excepción del traductor ni las puertas de calidad.

## 1. Siguiente paso exacto

**Paso A inicial del RUNBOOK §7 completado (29-oct):** [PR #136 integrada](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), [merge 6f96ec7](https://github.com/pedronunezwebs-hash/usefulverse/commit/6f96ec7d574aec09ace5b8aff96dbc5c0987df0b). **300 / 300 fuentes en main, 300 subidas-noindex, 0 activadas.** Preview vigente: [draft-300-noindex](https://draft-300-noindex.usefulverse-tools.pages.dev); 11.100 rutas (300 × 37), 36 homes noindex, sitemap vacío, robots sin bloqueo. Diez URLs públicas correctas, siete destinos, sin recursos fallidos. nb conserva inglés explícito, 0 traducciones nb aprobadas. La integración bajo usefulverse.com sigue en §4b, después de fase 0: no se ha cortado ningún dominio ni publicado el candidato unificado. [Entrega y límites](runtime-v1/README.md), [lecturas públicas](runtime-v1/public-preview.json).

**Siguiente paso exacto: publicar el principal para completar fase0**, no antes del **31-oct00:00+07 (30-oct17:00UTC)**. El hub ya se publicó/verificó el30-oct00:03+07 desde main75b010f, despliegue7e74ca2e. Fuente de PR143 integrada enmain/e2286d9. Mantener las300noindex y el traductor; no publicar diseño/0b/unificación hasta verificar también el principal. [Entrega real del hub y receta](phase-0-delivery-20261030/README.md).

**Entrega parcial confirmada:** tools.usefulverse.com ya devuelve404 real en cuatro falsas, G1 usa namespace8dcb0a88a745596406d82318 y cachéimmutable de un año;37feeds/15.365URLs y diez muestras200/canonical/indexables. Dos pasadas públicas completas correctas después de una primera lecturaXML inválida de causa no identificada. Principal sigue18-oct: título/home y sus36feeds pendientes de publicar, como pronto31-oct00:00+07. Reconstruir desde main con≥10GB libres/≤2GB propios, comprobar coste/cuota, check/gate y fuente antes de ese único despliegue; su build ya coincidió byte a byte con el candidato previo. Verificar título/36feeds/10.260URLs y muestras. Solo después cerrar fase0+G1 y reenviar los índices limpios; no envíos masivos. Preparación aislada de mejoras sigue autorizada.

**Pruebas de entrega:** **3.255 Node, cero fallos/omisiones**; 47 de entrega/composición incluidas. npm run check principal y gate de 20 idiomas existentes repetidos/correctos. Runtime Static Assets real local: 93 checks HTTP/32 páginas (cabeceras/caché/404/redirects/query). axe 4.14: cero infracciones A/AA en 32 páginas; 104 comprobaciones de tareas correctas. Lighthouse móvil 13.6: cinco muestras 100/100/100, LCP 756–1.075 ms, CLS/TBT 0. Traza separada CPU×4/Slow4G: LCP 1.292 ms/CLS0. Teclado y sanitización DOMPurify correctos; no se certifica INP, Firefox/WebKit, hardware ni las siete capas de las 1.000. **Ninguna herramienta/idioma se da por terminado.** [Evidencia](runtime-v1/README.md).

**Composición futura ya comprobada:** 700+300, 38.817 archivos/1.425.287.923 B, 25.300 rutas existentes indexables y 11.100 nuevas noindex. Sitemap candidato: 25.589 canónicas al deduplicar 36 homes de los 25.625 URLs fuente; ninguna herramienta/slug eliminado. 37 homes existentes y 327 auxiliares nuevas noindex; directorio paginado con búsqueda completa bajo demanda, máxima home 10.024 B Brotli. Proyección máxima 1.996.857.176 B. No repetir esta investigación ni juntar tres árboles crudos y otra copia. [Receta secuencial](sequential-v1/README.md).

**Producción actual:** hub30-oct/7e74ca2e, principal18-oct/0bfcbf58 sin cambios;preview300/413cf159 sigue29-oct y noindex, sin activaciones. 25.625URLs públicas antes/después, delta0. El hub es estático sinFunctions/Worker, coste incremental0 y un despliegue el30-oct; ninguna compra/cambio de plan. [Versiones preservadas](phase-0-delivery-20261030/preserved-deployments.json). Dominio único aún pendiente de§4b.

**Seguridad:** main ya contiene DOMPurify 3.4.17 y URL vendor corregida; GitHub devuelve cero alertas abiertas tras actualizar el grafo. El principal conserva su despliegue anterior; el hub ya sirve el candidato verificado30-oct. No se da por cerrada la revisión integral de seguridad. PR #135 permanece abierta, sin cierre manual. GitHub ejecutó automáticamente update-graph 40792857131 al merge: 0 ms facturables; no fue un build/test/deploy de web ni una ejecución manual. Los tres workflows web siguen deshabilitados.

**Traductor:** aviso [#142](https://github.com/pedronunezwebs-hash/usefulverse/issues/142) confirmado:40565692987 terminó `success` el29-oct01:52 Asia/Saigon, con pendientes/cuarentena, sin publicación. La siguiente40658885003 ya terminó `success`, seis vueltas entregadas;40843674935 sigue automáticamente en curso;actualizada29-oct17:02UTC, con checkpoint del mismo run entregado. Aviso141 actualizado:última entrega automática de40843674935:120.294 entradas exportadas,0destinos nuevos aprobados/publicados; unidades/objetivos solapados, no páginas terminadas ni porcentaje comparable. [Lectura actual](phase-0-delivery-20261030/translation-status.json); [aviso original de Pedro](tools/time-duration-calculator/translation-notification-142.json). Siete workflows activos conservan sus bytes; modelos/política/memoria/campañas no reconfigurados ni cancelados. source_ref sigue apuntando a feat/new-tools-batch-1: conservar/alinear esa rama sin force. Fuentes inglesas de las1.000 (50.530 unidades/0 solo metadatos) ya están en main; inglés de14prototipos conectado por [PR149](https://github.com/pedronunezwebs-hash/usefulverse/pull/149), merge9eac161, con rama fuente alineada. La campaña activa conserva suSHA anterior; la siguiente verá el nuevo inglés. Sin servicio24/7/SLA garantizado. [Operación](translation-drafts/README.md).

**Pedro:** diez pruebas pendientes: P-001–P-008 sobre producción, P-010 plantilla común y P-011 impresión/lector de Barcode, estas dos bloqueadas hasta URL candidata; 0 FALLA. P-009 correo OK/push sin comprobar. Barcode añade solo P-011 para impresión/lector real aplicable, sin compras; ninguna cámara/micrófono para generar. Solo hardware aplicable. Todo el catálogo conserva siete capas/18 controles; subida-noindex no equivale a herramienta terminada.

**Orden posterior:** verificar fase 0 + G1 → fase 0b (26 errores, test antes del arreglo) → unificar dominio §4b → Planeta Infinito y bucle por herramienta según progress.csv.

**Decisión vigente de Pedro (29-oct): avanzar con inteligencia durante la espera.** El límite diario frena publicaciones, no preparar y probar mejoras visuales, funciones, contenido y cobertura de búsquedas en ramas separadas. Se autoriza adelantar ese trabajo sin plataformas SEO/API de pago ni aumento de URLs. Mantener pruebas, noindex de las 300, aprobación del diseño y puertas antes de publicar/cerrar. No convertir la espera de fase 0 en inactividad ni repetir QA ya válido sin cambios.

**Preparación lista para revisión, sin publicar:** `date-calculator`, prioridad 1/nivel A, rama `feat/date-calculator-planeta` ([PR144](https://github.com/pedronunezwebs-hash/usefulverse/pull/144), fuente e9e93b5). Planeta Infinito; diferencias y suma/resta años/meses/semanas/días; cuatro ejemplos, diez FAQ, privacidad y 24 intenciones dentro de la URL existente. Suite3.302/30 propias/10.000 casos aleatorios, tres motores/54 geometrías/axe0, Lighthouse100/100/100 LCP944ms y traza Slow4G CPU×4 LCP885ms/CLS0. Peso56.676B estimado; ninguna URL nueva/ninguna aprobación. [Fuente, capturas, 18 controles y pendientes](tools/date-calculator/README.md). Faltan integración/check/CSP del sitio, traducciones reales, zoom real200/lector de pantalla, aprobación visual y P-010 tras URL candidata. No repetir las pruebas de cálculo ni traducir manualmente. Mientras se espera fase0 se puede preparar la siguiente prioridad en otra rama; no publicar esta rama como candidato de fase0.


**Segunda preparación lista, sin publicar:** `time-duration-calculator`, prioridad2/nivelA, [PR145](https://github.com/pedronunezwebs-hash/usefulverse/pull/145), dependiente de PR144. Dos modos, zonas independientes, DST/horas repetidas explícitos, pausas, cuatro ejemplos/diez FAQ y20 intenciones; total74.989B. Plantilla/estilos/fuente/build compartidos y sonda Lighthouse reutilizable para todo el catálogo. Suite3.330 +58 focalizadas finales; Time39 controles/54 geometrías axe0, Date36/54 en tres motores; Lighthouse100/100/100 LCP1.255ms, traza910ms/CLS0. [Capturas/18 controles/pendientes](tools/time-duration-calculator/README.md). Ninguna herramienta/idioma terminada; queda la misma puerta de integración/idiomas/dispositivos. P-010 común, ningún ID físico nuevo. Roman ya preparado en PR146; Barcode ya preparado en PR147; prioridades5–14 ya preparadas enPR148;continuar OCR15 enPR150, reutilizando base/pruebas comunes y contenido específico. El inglés de14ya está conectado al corpus porPR149;la próxima campaña fijará suSHA, sin traducir manualmente ni reconfigurar el traductor. No alterar sus workflows/modelos/políticas ni traducir manualmente.


**Tercera preparación lista, sin publicar:** `roman-numeral-converter`, prioridad3/nivelA, [PR146](https://github.com/pedronunezwebs-hash/usefulverse/pull/146), fuente26c8f59, sobre PR145. Cuatro modos conservando fechas; Unicode, enteros grandes exactos, validación canónica y convención de miles agrupados explícita; lote/CSV íntegro en Worker cancelable. Cuatro ejemplos/diez FAQ/20 intenciones, 58.077B. Node3.359/29 focalizadas, 3.999 numerales exhaustivos/5.000 enteros generados;42 tareas/54 geometrías axe0 en tres motores. Lighthouse100/100/100 LCP936ms/CLS0,005925; traza886ms. [Capturas/18 controles/pendientes](tools/roman-numeral-converter/README.md). Producción antigua: tres conversiones normales correctas y cuatro URLs200; candidato no desplegado. Mismas puertas de idiomas/integración/diseño/P-010 común pendientes; ninguna herramienta/idioma terminada. **Barcode preparado enPR147;prioridades5–14enPR148 yOCR15enPR150**; sin esperar o repetir manualmente traducciones. Conservar pila PR144→145→146; integrar inglés al corpus activo en lote separado que preserve UI pública antes de exigir sus traducciones.


**Cuarta preparación lista, sin publicar:** `barcode-generator`, prioridad4/nivelA, [PR147](https://github.com/pedronunezwebs-hash/usefulverse/pull/147), sobre PR146. Conserva Code128/EAN13/UPC y SVG/PNG; añade EAN8/Code39, tamaños, ZIP con manifiesto/errores y Worker cancelable. Cap80 eliminado, cuatro ejemplos/diez FAQ/20 intenciones dentro de URL existente. Node3.382/23 focalizadas,12 referencias GS1,5.000 aleatorios y1.016 decodificaciones independientes;48 tareas/54 geometrías axe0 en tres motores.30 SVG/PNG descargados/decodificados,ZIP1.000 etiquetas por motor;73.117B, Lighthouse100/100/100 LCP934ms/CLS0, traza877ms. [Capturas/18 controles](tools/barcode-generator/README.md). Producción antigua: tres formatos correctos y límite81 reproducido; cuatro URLs200 Chrome. Candidato no desplegado: idiomas/integración/lector/zoom/diseño/widget pendientes. P-010 común y P-011 impresión/lector real, ambas bloqueadas hasta URL;10 Pedro pendientes/0FALLA. Traductor40843674935 sigue automáticamente con cuatro jobs primera vuelta, sin reconfigurar. Prioridades5–14ya enPR148;próxima preparación OCR15enPR150; conservar pila PR144→145→146→147 e incorporar inglés revisado al corpus activo en lote separado que preserve UI pública.

**Decisión de Pedro (29-oct, lote continuo):** encadenar varias herramientas sin cerrar el turno entre ellas. Reutilizar instalación, plantilla y controles comunes; mantener motores/contenido/pruebas propios y respaldos por lote. No rebajar puertas ni publicar antes de verificar fase0.

**Inglés entregado:** PR149 integrada,48.403→50.530 unidades/0solo metadatos/1.000propietarios,99IDs técnicos excluidos;3.557Node finales,14HTML/47archivos idénticos. [Entrega y compatibilidad](english-quality-v1/README.md). Traductor intacto/sin disparo manual; la siguiente campaña fijará las fuentes nuevas.

**Quinta preparación, lote continuo de diez:** [PR148](https://github.com/pedronunezwebs-hash/usefulverse/pull/148), prioridades5–14, sin publicar. Fracciones/primos/porcentajes/palabras/razones/descuentos/aleatorios/media/edad/combustible, motores propios y base compartida. Node3.542/160 focalizadas incluidas,121 referencias,303 controles/540 geometrías axe0 en tres motores; diezLH100/100/100,LCP934–941ms/CLS≤0,012608. [Capturas/18 controles/peso/relevo](math-batch-1/README.md). Cinco errores/límites públicos reproducidos y corregidos solo en candidato; fase0b no entregada. 0herramientas/idiomas terminados,0activaciones/delta0URLs. P-010 común,0IDs nuevos/10Pedro pendientes/0FALLA. Conservar pila PR144→145→146→147→148; inglés revisado ya entregado al corpus porPR149, sin modificar UI pública ni traductor. Prioridad15pdf-ocr ya iniciada enPR150, después16binary-converter. Fase0 sigue pendiente de ventana y ambos hosts.

**Sexta preparación iniciada, no terminada:** [PR150](https://github.com/pedronunezwebs-hash/usefulverse/pull/150), prioridad15pdf-ocr, sobrePR148. Base secuencial aislada sin cupo120;22tests de vida/cancelación,5.000rangos/1.000páginas,Node3.579correctas. Producción antigua: PDF121 pidiendo página1 rechaza por120; OCR real de un escaneo inglés reconoce3líneas exactas/sinPOST. [Reproducción/fixtures/relevo](tools/pdf-ocr/README.md). **Próxima preparación exacta: conectar adaptadores PDF.js/Tesseract7/pdf-lib al pipeline y demostrar PDFseleccionable con texto extraído y render comparado; después UIPlaneta/contenido/idiomas y siete capas.** No dar por acabado OCR ni saltarlo porunaUI nueva; no publicar fases posteriores antes de fase0. Ningún ID físico adicional sin candidato usable.

## 2. Pendiente de Pedro (decisiones o acciones humanas)

- [ ] **Pruebas para Pedro: 10 pendientes (P-010/P-011 bloqueadas) · 0 fallos abiertos** → `docs/quality/PRUEBAS-PEDRO.md` (móvil real, cámara, micrófono, altavoces…)

- [x] Limpieza de `/tmp` hecha el 20-oct con el OK de Pedro: 18 GB liberados (154 carpetas y archivos de usefulverse). Antes se
      respaldaron los restos sin commit de 5 reconstrucciones y 73 archivos de estado en el repo **privado**
      `usefulverse-300-worktree-backup-20261020` (ramas `backup/tmp-*`). Disco: 34 → 52 GB libres de copias temporales antiguas de UsefulVerse en `/tmp` (builds `merged-release-…`,
      `reconstruction…`, caché de MADLAD de 3,3 GB…), dejadas por sesiones del 17-19 oct. **No borrar
      `/tmp/usefulverse-300-implementation-20261019` hasta que su rama esté en GitHub.**
- [ ] Fichas de coste de las herramientas nuevas que necesiten servidor o API (test de velocidad, tiempo, chat de IA…), cuando aparezcan.
- [x] Dónde ejecutar la traducción masiva → **repo público + GitHub Actions** (decidido el 20-oct-2026)
- [ ] Opcional: revocar en Cloudflare el token antiguo que usaba el repo antes del 20-oct, si no lo usa nada más (hay varios
      tokens de Zenith y Joseph en la misma cuenta: no tocar sin identificarlo).
- [x] Operación de herramientas/webs sin Actions; excepción explícita del traductor preservada y dominio único confirmado.
- [ ] Confirmar que la tarjeta de Cloudflare sigue válida (dominio con renovación automática el 28-sep-2027 + Workers Paid mensual).
- [ ] Publicar en Product Hunt, Reddit o directorios cuando el agente deje los textos preparados (fase 7).

## 3. Checklist general

### Planificación
- [x] Plan, estrategia, RUNBOOK y progress.csv; marca Planeta Infinito aprobada · 20-oct.
- [x] Repo público, historial revisado sin secretos, bloqueo de push y acciones fijadas; no debilitar seguridad.
- [x] Respaldo de las 300 online; PR #136 integrada, 300 en main/subidas-noindex y cero activadas. Diez muestras públicas verificadas.
- [x] Pilotos históricos y regresiones preservados; informes y commits en LOG.md y lotes/.
- [x] V32/v33 ruso: cinco reparaciones; muestra conocida pasa. Publicación sigue sin aprobar.
- [x] CI del traductor anterior y retirada efectiva verificadas.
- [x] Adaptador conectado al build aislado: hash/contexto/políticas, respaldo inglés y comprobación del HTML real.
- [x] CI completa del adaptador 40646366137: 3.053 Node/448 Python, dos omisiones; builds, gate y preview correctos.
- [x] Puerta automática previa a modelos: 45 Python/seis Node correctos en Actions; cron del vigilante observado.
- [x] Capacidad medida en Actions; tres salidas separadas dentro del presupuesto, unión hub+300 bloqueada y colisiones documentadas.
- [x] Pruebas físicas solo aplicables; ocho IDs existentes enlazados en progress.csv, sin nuevas pruebas.

- [x] Copia inglesa centralizada de las 1.000 conectada: 14 mercados y 106 recuperadas; 0 solo metadatos. Literales JS/datos de juegos y calidad integral pendientes.

### Fase 0 · Arreglos urgentes (RUNBOOK §4)
- [x] 404 hub: publicado30-oct, cuatro falsas404/noindex verificadas en producción
- [ ] Título de home: código/tests listos en PR143; falta producción
- [ ] Sitemaps por idioma: hub37feeds/15.365URLs publicado/verificado;principal36feeds/10.260URLs pendiente
- [ ] Despliegue verificado + sitemaps reenviados

### Pruebas (`docs/quality/PRUEBAS.md`)
- [ ] Infraestructura: Playwright (Chromium, Firefox, WebKit), fast-check, axe, Lighthouse por ejecución local/manual
- [ ] Tests de regresión de los 26 errores de la auditoría (antes de arreglarlos)
- [ ] Revisión semanal local/manual sobre producción, con evidencia y comunicación de fallos
- [x] Columnas de pruebas en `progress.csv` · 2026-10-20 (las siete capas de las 300 siguen pendientes)

### Fase 0b · Errores confirmados (`AUDITORIA-CATALOGO.md` §2) · arreglados: **0 / 26**
- [x] G1 ·106JS/192dependencias con hash,3.816páginas comparadas;hub publicado30-oct,namespace/caché/arranque verificados
- [ ] Errores de cálculo y lógica (mates, finanzas, ciencia, otros, dev): test que lo reproduce + arreglo
- [ ] Juegos rotos (sudoku, 2048 táctil, palabra de 5 letras en inglés, kakuro y mahjong reales)

### Peso y diseño responsive (`PESO-Y-DISENO.md`)
- [ ] Dividir `app.js` (70 KB) y los paquetes de idioma (`locale-es.js` 167 KB) por herramienta
- [ ] Home ≤ 25 KB de HTML (hoy 217 KB) · sacar el JSON incrustado de market-tools (74 KB)
- [ ] Test de presupuesto de peso en CI + Lighthouse CI
- [ ] Repo ligero (`PESO-Y-DISENO.md` §5): 106 recuperadas a código fuente (−121 MB), investigación a una Release, traducciones divididas, sin binarios duplicados, `paths-ignore` de docs en el workflow · `main` 291 MB → < 80 MB
- [ ] Tokens de espaciado y contenedor; pruebas visuales en 320-1920 px; sin desbordamiento; RTL y textos largos

### Fase 1-2 · Diseño y plantilla (PLAN §3-4)
- [ ] Sistema de diseño «Planeta Infinito» en el repo (tokens, componentes, RTL)
- [ ] Plantilla nueva de herramienta (home, archivos, calculadora, juego) aprobada por Pedro en el móvil
- [ ] Páginas de confianza y hubs de categoría
- [ ] Unificación en un solo sitio (RUNBOOK §4b): Worker de Static Assets + regla 301 `tools.` → `usefulverse.com`
- [ ] Plantilla: títulos y descripciones reales (G3), contenido y FAQ por temática (G4), JSON-LD y migas en `tools.` (G5),
      relacionadas por grafo (G6), arrastrar y pegar archivos (G7), título = intención (G11), CSP (G12)
- [ ] `llms.txt`, JSON-LD revisado, presupuesto de rendimiento en CI
- [ ] Cloudflare Web Analytics + `docs/quality/KPIS.md`

### Fase 3-4 · Herramientas existentes (RUNBOOK §5-6) · el detalle está en `progress.csv`
- Terminadas: **0 / 700** · Con noruego `nb`: **100 / 700**

### Paridad PDF con iLovePDF (`docs/quality/PDF-VS-ILOVEPDF.md`) · nivel A, prioridad alta
- [ ] 16 páginas dedicadas por intención (compress, merge, split, pdf↔word/excel/powerpoint, edit, sign, watermark,
      rotate, protect, unlock, page numbers) reutilizando el motor · dentro del freno semanal
- [ ] Quitar los límites fijos (redact, crop, pdf→ppt, excel→pdf)
- [ ] OCR → PDF con texto seleccionable · escanear con perspectiva
- [ ] Editar PDF con objetos nativos · comparación visual
- [ ] Mejorar la fidelidad de Office (tablas; viabilidad de LibreOffice en WASM)
- [ ] Resumir y traducir PDF con IA en el dispositivo: diseño en `docs/quality/PDF-IA.md` (escalera Chrome IA → Transformers.js → modo ligero)

### Cobertura: las 1.000 herramientas pasan por el mismo plan
- 700 existentes → bucle de calidad (RUNBOOK §5) · 300 nuevas → RUNBOOK §7 (Paso A + Paso B), **con la misma puerta de calidad
  y las mismas pruebas** (PRUEBAS.md). Comprobado el 20-oct: las 300 de `progress.csv` coinciden con las 304 carpetas nuevas del
  respaldo de ChatGPT (299 por slug, `iching-cast` → `i-ching-oracle`, `capital-gains-tax-uk` → módulo `uk-capital-gains`;
  `pending-23`, `controller-helpers` y los tests son módulos compartidos, no herramientas).
- [ ] **Auditar las 300 nuevas con el mismo método** que las 700 (rastreo de la vista previa + auditoría por categoría frente a los
      líderes) **antes de activarlas**. Añadir sus hallazgos a `AUDITORIA-CATALOGO.md`.

### Herramientas nuevas (RUNBOOK §7)
- [x] Paso A inicial: 300 en main y preview vigente noindex, 37 rutas por herramienta/diez muestras públicas correctas. Integración en el dominio único pendiente de §4b · en main: **300 / 300**
- Paso B: activadas **0** (máximo 30 por semana) · semana actual: 0 / 30

### Fase 8 · Piloto automático y anuncios (REVISION-FINAL §3-5)
- [ ] Vigilancia semanal de la web por método local/manual sin Actions; conservar comprobaciones y evidencia, sin presentarla como servicio activo
- [ ] Aviso de datos caducados + Issue del 2 de enero
- [ ] Activación automática semanal de hasta 30 nuevas ya aprobadas
- [ ] Huecos de anuncio reservados y apagados, CMP certificado preparado, `ads.txt`, privacidad con sección de anuncios
- [ ] 2FA y avisos de facturación revisados
- [ ] **Web terminada** (checklist de REVISION-FINAL §5) → candado `TERMINADO · modo piloto automático`

### Fase 7 · Crecimiento (STRATEGY-1M)
- [ ] Widgets para insertar (enlace `nofollow` de marca) · [ ] PWA · [ ] Juegos diarios con tarjeta para compartir
- [ ] Listados de alternativas (textos preparados) · [ ] Páginas de «alternativa gratuita a X»

## 4. Últimos lotes

| Fecha | Lote | Resultado | Evidencia |
|---|---|---|---|
| 30-oct | Entrega hub fase0+G1 | 404 real/cachehash/37feeds/15.365URLs;principal aún pendiente | [Entrega](phase-0-delivery-20261030/README.md) |
| 29-oct | Diez matemáticas/cotidianas consecutivas | Node3.542/303 tareas/540 geometrías axe0/diezLH100; sin publicar | [PR148/evidencia](math-batch-1/README.md) |
| 29-oct | Barcode Generator | Node3.382/48 tareas/54 geometrías axe0,30 descargas decodificadas/ZIP1.000 imágenes,LH100; sin publicar | [PR147/evidencia](tools/barcode-generator/README.md) |
| 29-oct | Roman Numeral Converter | Node3.359/42 tareas/54 geometrías axe0, CSV1.000 filas, LH100; traductor continúa automáticamente; sin publicar | [PR146/evidencia](tools/roman-numeral-converter/README.md) |
| 29-oct | Time Duration y base compartida | Node3.330, dos calculadoras/tres motores/axe108, LH100; aviso142 comprobado; sin publicar | [PR145/evidencia](tools/time-duration-calculator/README.md) |
| 29-oct | Preparación Date Calculator nivel A | Planeta Infinito/24 intenciones; Node3.302, tres motores/axe54, Lighthouse100; sin publicar | [Prototipo](tools/date-calculator/README.md) |
| 29-oct | Entrega inicial del Paso A | PR #136 integrada; preview 300×37 noindex verificada; 3.255 Node/93 HTTP/axe32/Lighthouse5; 0 activaciones | [Lote](lotes/2026-10-29-entrega-inicial-paso-a.md) |
| 29-oct | Construcción secuencial completa | 36.400 rutas; 3.251 Node; 189 geometrías; sin publicar | [Lote](lotes/2026-10-29-construccion-secuencial-paso-a.md) |
| 28-oct | Seguridad y composición local | DOMPurify; 193 Node/108 muestras; unión parcial y home 23,7 KB; sin publicar | [Lote](lotes/2026-10-28-seguridad-y-composicion-paso-a.md) |
| 28-oct | UI inglesa de 106 recuperadas | +5.718 unidades; 0 propietarios solo metadatos; 147 Node/15 Python; motor y web intactos | [Lote](lotes/2026-10-28-ui-inglesa-106-recuperadas.md) |
| 28-oct | UI inglesa de 14 mercados | +632 unidades; seis formularios sin undefined; 478 tests/518 páginas/378 muestras Chrome; sin publicar | [Lote](lotes/2026-10-28-ui-inglesa-14-mercados.md) |
| 28-oct | Capacidad del Paso A | Tres salidas caben separadas; unión de 27.470 archivos excede presupuesto; pruebas físicas aplicables | [Lote](lotes/2026-10-28-capacidad-paso-a.md) |
| 28-oct | Puerta automática del traductor | 51 controles antes de modelos; CI completa de preview resuelta; sin activaciones | [Lote](lotes/2026-10-28-puerta-automatica-traducciones.md) |
| 27-oct | v32/v33 ruso | Muestra conocida pasa; cinco reparaciones; relevo compacto | [Informe](lotes/2026-10-27-piloto-v32-v33-ru.md) |
| 27-oct | v31 ruso | Cuatro defectos pendientes, ya preservados como negativos | [Informe](lotes/2026-10-27-piloto-v31-ru.md) |
| 26-oct | v30 ruso / v29 bengalí | Diagnóstico ruso / muestra bengalí pasa | [Historial](LOG.md) |

Todos los lotes anteriores, sus CI, retiradas y limitaciones siguen en LOG.md, lotes/ y los commits; no releerlos salvo que la tarea los necesite.

## 5. Métricas rápidas (actualizar cada 2 semanas)

| Fecha | Impresiones/día (Google) | Clics/día | Páginas con impresiones | Notas |
|---|---|---|---|---|
| 1-15 oct | 3.000-4.300 | 10-26 | 2.659 | Antes de la caída |
| 16-19 oct | 14-56 | 0 | casi 0 | Después de la caída |

---

## Protocolo de relevo (obligatorio)

**Al empezar:**
1. `git pull` (o un clon superficial nuevo) y leer **solo**: este archivo → `AGENTS.md` → la sección del RUNBOOK que toque.
2. Mirar el candado. Si está `EN CURSO` por otro agente, **no tocar** lo mismo: elegir otra tarea o esperar.
3. Poner el candado `EN CURSO · <agente> · <fecha y hora> · <qué>` y hacer commit con `[skip ci]`.
4. `git log --oneline -15` para ver qué ha cambiado desde la última actualización de este archivo.

**Al terminar (también si se corta a medias):**
1. Hacer commit y **push de todo** a una rama remota. **Nunca dejar trabajo solo en local o en `/tmp`.**
2. Actualizar este archivo: «Siguiente paso exacto», checklist, «Últimos lotes», contadores y candado → `LIBRE`.
3. Actualizar `docs/quality/progress.csv` (estado por herramienta) y añadir el informe a `docs/quality/LOG.md`.
4. Borrar las carpetas temporales propias (clones, `dist`, `node_modules`, modelos, capturas) y anotar el espacio libre del disco.


**Retirada actual:** Cierre 2026-10-29T17:31:04.536Z: diez candidatas PR148 y baseOCR PR150 respaldadas; inglés14 integradoPR149 y hubfase0 entregadoPR151/7e74ca2e. Ambos clones, builds, dependencias, navegadores/perfiles, cachés y QA propios eliminados antes deLIBRE; tres logs globales propios retirados, cero procesos propios en auditoría. 39.9GiB libres. Principal pendiente31-oct00:00+07;traductor sigue solo. [Recibo](phase-0-delivery-20261030/closure.json).

Antes de CI del traductor, si se recogen checkpoints: `python3 scripts/localization/pilot-checkpoint-inventory.py --write` y después el mismo comando sin `--write`. Actualiza solo inventario/total derivados; no crudos, juicios ni procedencia. No hace falta ejecutarlo para un lote de web sin recolección.
