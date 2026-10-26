# UsefulVerse · Mapa del repo (para no explorarlo cada vez)

## V28 ·26-oct-2026 · estado actual

V28 bengalí: referencias conocidas360/360; ampliado rechazado1460/1566 (88 fijas696/792),41 idas modelo con defectos y23 variantes de datos sin prueba. Leídos333 registros S/F/B; legacy ampliado812/828,8 negativas y24 datos sin prueba.517 memorias actuales;15776 registros,7606 evaluaciones con repeticiones/136 grupos y1403 fixtures.0 idiomas aprobados. [Informe](lotes/2026-10-26-piloto-v28-bn.md).

Superan solo muestras completas conocidas: español, noruego bokmål, coreano, indonesio y chino simplificado. Nueve destinos revisados no pasan (de/fr/pt-BR/ja/hi/ar/bn/ru/ur);22 sin revisión detallada:tr,vi,it,zh-TW,bg,ca,nl,el,ms,pl,sv,th,uk,sw,mr,te,ha,fil,ta,fa,am,gu. Inglés es fuente;0/36 destinos aprobados para publicar. La memoria conocida no demuestra un motor genérico ni1000 herramientas revisadas. P-001–P-008:8 pendientes/0 FALLA;0 IDs nuevos. Sin certificación nativa/ciega/textos inéditos, UI/dispositivos, responsive320–1920/RTL/textos largos/márgenes/peso, accesibilidad/rendimiento ni puerta18/siete capas.0/300 fuentes nuevas en main;0 activadas;300 noindex en PR borrador;700 existentes conservadas.0 despliegues/envíos a buscadores.

**Siguiente:** Crear v29 independiente para bn usando next-v29-bn-plan.json: conservar517 destinos actuales, políticas/perfiles/gramáticas/crudos/revisiones y prefijo1334 de1403 fixtures. Las148 mejores candidatas exactas (132modelo/16legacy) están preparadas, NO importadas:15legacy evitan corregir idas modelo malas; quedan26 textos por validar/corregir (borradores preparados en el informe v28) y30 candidatas seleccionadas con datos sin prueba. Las41 idas modelo negativas originales permanecen como regresiones, no hay que corregirlas si se sustituye por una legacy mejor probada. Ligar cada importación a fuente/hash/contexto/registro/revisión exactos; mantener la procedencia y no contar reutilización como nueva generación. Defectos y puntuaciones en review-context-v28-full*.json/findings-v28.json; corregir unidades longitud→tiempo/almacenamiento, identificadores/símbolos/versiones, privacidad en pasado, instrucciones Shikaku y pitch/audio. Antes de cada arreglo, test rojo. Contratos finitos propios para cantidades/artículos/unidades/negaciones, incluyendo frases completas y fragmentos;30 variantes aún bloquean sin inventar error lingüístico. Fuente/imports/runtime v28 medidos NO se modifican; no repetir40251753561 ni40253948985. Referencias40 y todos sus avisos antes del ampliado condicional, mismas88 fijas y lectura de todas174 idas/vueltas +92legacy, también fuera88. Cualquier defecto observado o dato sin prueba bloquea global. Después ru (37 candidatas/3 correcciones) y ur (32/8) con gates propios; los22 destinos restantes desde tr/vi/it siguen en acceleration-review-batches.json; seis históricos necesitan reparación;ha/am/te/gu/ta/mr/sw requieren80 muestras. Paso A abierto por capacidad Pages,37 traducciones revisadas y nb real; no avanzar fase0.

CI final[40274336760](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40274336760), fuente`a56790699da358cc0331902051b42debcd6dbf65`, correcta:3045 Node y327 Python(325 correctas,2 omisiones por dependencias), Python1177.897s.38 tests enfocados correctos; gitleaks sin secretos nuevos. Build principal9972 páginas+36 homes/10260 URLs; gate20 locales existentes; hub217 herramientas Growth+100 mercado+106 recuperadas editables; Growth7848 páginas/8253 archivos. Preview11293 archivos/10800 páginas y todas las homes noindex,0 URLs indexables;36 locales, no acredita37. Modelo y ambas publicaciones omitidos;0 artefactos. Producción:5 GET y2 XML comparados con el inicio, mismos estados/bytes/SHA256,25625 URLs;3 soft404 siguen200. No UI/dispositivos/índice Google certificados.0 deploys/activaciones/envíos. Relevo y retirada efectiva pendientes de ejecutar; candado propio. Código/datos/revisiones solo en [PR#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136);main recibe estos seis documentos con[skip ci].

Aceleración ·2026-10-26: Aceleración: los 15.443 registros conservan exactamente todos sus indicadores. Benchmark local con cProfile: 51,77→29,34 s (1,76×); aperturas reales de archivo: 432.950→33. Cachés acotadas en RAM y casos de corrupción conservados. Los 25 destinos pendientes tienen nueve lotes preparados con evidencia existente; cero inferencia nueva y cero idiomas aprobados. [Informe](lotes/2026-10-26-aceleracion-traduccion.md).

[CI final 40219774134](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40219774134) correcta sobre a04f913: 3.045 pruebas Node y 300 Python (298 correctas, dos omisiones por dependencias), Python 525.834 s. Builds principal/hub, puerta de 20 locales existentes y preview de 10.800 páginas y todas sus homes noindex; sitemap vacío. Preview de 36 locales: no certifica 37. Modelo y ambas publicaciones omitidos; cero artefactos. Producción: 5 GET y 2 XML, 25.625→25.625 URLs, mismos estados/bytes/hashes; tres soft404 pendientes. Respaldo remoto verificado y clon/QA/cachés propios eliminados antes de LIBRE.

Nuevo: `scripts/localization/pilot-validation-cache.py` y `pilot-review-batch.py`. Código y evidencias solo en PR #136; main recibe seis documentos.

V27 ·25-oct-2026: V27: la muestra china con memoria revisada pasa referencias (360/360) y ampliado (1.566/1.566; 88 claves fijas: 792/792). Hay 477 traducciones en memoria, 214 en chino; cero generación nueva de ida. Legacy: 778/828 y 25 negativas. Historial: 15.443 registros, 6.950 evaluaciones con repeticiones y 1.151 fixtures. Cero idiomas aprobados para publicar. [Informe](lotes/2026-10-25-piloto-v27.md). Código/datos solo en PR #136; main solo seis documentos de relevo.

[CI final 40215319807](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40215319807) correcta sobre e39fa7f: 3.045 pruebas Node y 276 Python (274 correctas y 2 omisiones por dependencias). Builds principal/hub y puerta de los 20 locales existentes correctos; preview de 10.800 páginas y todas sus homes con noindex, sitemap con cero URLs indexables. Preview de 36 locales: no certifica 37. Modelo y ambas publicaciones omitidos; cero artefactos. Producción: 5 GET y 2 XML, 25.625→25.625 URLs, mismos estados, bytes y hashes; tres soft 404 pendientes y cero despliegues. Respaldo remoto y retirada efectiva verificados después de eliminar realmente el clon/QA/cachés propios.

V26 ·25-oct-2026: V26: nueve correcciones/pruebas finitas y334 memorias; zh-CN referencias360/360 lingüístico, gate bloqueado por1cantidad sin prueba en shikaku.example; completo NO ejecutado. Legacy223/243 y8negativas.15.110 registros/6.617 evaluaciones con repeticiones/1146 fixtures.0 idiomas aprobados. [Informe](lotes/2026-10-25-piloto-v26.md). Código/datos solo en PR #136; main solo seis documentos de relevo.

[CI final40192256469](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40192256469) correcta sobre48a1694:3.045Node/255Python (253+2omisiones), builds principal/hub/20locales existentes y preview10.800páginas+homes noindex/sitemap0indexables. Preview36locales, no certifica37. Modelo/publicaciones omitidos/0artefactos. GET/XML25.625→25.625URLs,estados/bytes/hashes idénticos;3soft404pendientes,0deploys. Respaldo remoto y retirada efectiva verificados después de eliminar realmente el clon/QA/cachés propios.

V25 ·25-oct-2026: V25: zh-CN referencias360/360; completo1564/1566 bloqueado por2 leves y7 variantes sin prueba finita (0 graves y0 errores lingüísticos confirmados de cifras/negaciones). Legacy778/828,25 negativas (17 graves/8 leves).15.043 registros/6.550 evaluaciones con repeticiones/1146 fixtures.0 idiomas aprobados para publicar. Política/código solo en rama PR #136; main recibe seis documentos de relevo,0/300 fuentes nuevas. Capacidad Pages/37 traducciones revisadas pendientes. [Informe](lotes/2026-10-25-piloto-v25.md).

Revisado el 20-oct-2026 sobre `main` (`pedronunezwebs-hash/usefulverse`, **público desde el 20-oct**, ~130 MB). Seguridad: ver `AGENTS.md`. Si cambias la estructura, actualiza este mapa.

## Dos sitios, dos builds

| Sitio | Proyecto de Cloudflare Pages | Build | Salida | Catálogo | Plantilla |
|---|---|---|---|---|---|
| `usefulverse.com` (277 herramientas) | `usefulverse` | `npm run check` (= `scripts/build.mjs` + `scripts/check-build.mjs`) | `dist/` | `src/catalog.mjs` | `src/template.mjs` (`renderToolPage`, `renderHome`, `renderNotFoundPage` → genera `404.html`) |
| `tools.usefulverse.com` (423 herramientas, «hub Growth600») | `usefulverse-tools` | `npm run build:growth600` (= `scripts/build-growth600.mjs`) | `dist-growth600/` | `src/growth600/catalog.mjs` (+ `src/markets-no-ch/catalog.mjs`) | `src/growth600/render.mjs`, `build.mjs`, `site.css`, `rtl-fixes.css` — **no genera `404.html`** (por eso hay soft 404) |

> **Previsto:** unificar los dos sitios en un Worker de Static Assets en `usefulverse.com` (RUNBOOK §4b). El motivo de la
> división fue el límite de 20.000 archivos de Pages en el plan gratuito; Workers Static Assets admite 100.000 y la cuenta ya
> tiene Workers Paid.

## Despliegue (`.github/workflows/deploy-cloudflare.yml`)

- Push a `main` → `npm ci` → `npm test` → `npm run check` → `npm run locale:release-check` → `npm run build:growth600`
  → **publica solo `usefulverse.com`** (`pages deploy dist --project-name=usefulverse`).
- **El hub `tools.` solo se publica a mano:** *Run workflow* (`workflow_dispatch`) en `main` con `publish_growth600 = true`
  (`pages deploy dist-growth600 --project-name=usefulverse-tools`).
- Los PR a `main` ejecutan las validaciones sin publicar. `[skip ci]` en el mensaje evita la ejecución.
- En `feat/new-tools-batch-1`, `workflow_dispatch` con `translation_pilot=true` ejecuta **solo** el piloto CPU en
  `ubuntu-latest`, sin secretos ni despliegue. `pilot_policy` separa baseline, segmentos v2, frases v3, memoria revisada v4 y cobertura de oraciones/datos tipados v5/v6/v7/v8/v9. V10 añade unidades completas/contrato tipado. V11 añade oraciones completas y control por oración: referencias es/nb 360, completo rechazado es 785/792 y nb 776/792; 0 idiomas aprobados. V12 añade memoria exacta para 16 fallos y auditor de cobertura histórica con hashes; las 88 conocidas pasan, pero leer todos los 428 candidatos detecta otros 23 fallos de ida y rechaza el global. V13 corrige los 23 fallos por memoria exacta; referencias 360/360 y 88 conocidas 792/792, pero dos leves nuevos fuera de muestra mantienen el bloqueo global ampliado. 580 fixtures y cero idiomas aprobados; sin despliegue. Parámetros, checkpoints y resultados: `docs/quality/translation-pilot.md`.

- **V14 (histórico):** dos Shikaku por memoria exacta; referencias ES/NB pasan, 88 conocidas pasan y ampliado ES queda bloqueado por un calco leve, NB pasa muestra conocida. 585 fixtures y cero idiomas aprobados. Auditor con retiro explícito y negativo de una falsa nota perfecta histórica, ligado a bytes/digest/fuente/contexto; no muta originales ni permite aprobar gates. Políticas v2–v14 conservadas; sin despliegue.

- **V15 (histórico):** calco informático ES corregido por memoria exacta; 91 claves/157 destinos. Referencias ES/NB 360/360, completo conocido revisado: es: 1566/1566, pasa muestra conocida; nb-NO: 1566/1566, pasa muestra conocida. 585 fixtures, cero idiomas aprobados. Datos y trazas globales/por oración y retiro histórico explícito conservados; sin despliegue.

- **V16 (histórico):** gramática ko CLDR fijada por revisión/hash; run 39939504317, 40 modelo+27 legacy leídos directamente. Modelo 344/360 y legacy 219/243, rechazados; completo no despachado. 12.844 registros/4.351 evaluaciones/623 fixtures. 104 Python locales/CI (102+2), 3.045 Node y preview noindex verdes en CI39941496076; 103 reales en el modelo. Cero idiomas aprobados, activación o despliegue. Políticas/datos anteriores y adendas intactos. [Informe](lotes/2026-10-23-piloto-v16.md).

- **V17:** referencias ko 360/360; completo rechazado, 721 fixtures y CI final correcta. [Informe](lotes/2026-10-23-piloto-v17.md). Solo se registra política v17 y se amplían conjuntos de auditoría; gramática/inferencia previas intactas. 333 textos leídos, gate completo rechazado;0 idiomas aprobados/activadas/despliegues. CI 39949596494 verde.

- **V18 · verificado:** Coreano: referencias 360/360 y completo 1566/1566; CI final verde. [Informe](lotes/2026-10-23-piloto-v18.md). Políticas/datos/gramática anteriores intactos; solo registro v18 y auditoría ampliada. Cero idiomas/herramientas aprobados o publicados.

- **V19 ·24-oct:** contrato id versionado, parser global/historia intactos. Referencias modelo348/360 y legacy 233/243 rechazadas; completo no ejecutado.761 fixtures/0 idiomas aprobados, sin despliegue. [Informe](lotes/2026-10-24-piloto-v19.md).

- **V20 · 24-oct:** referencias id 360/360; completo rechazado 1454/1566, 130 fixtures nuevas. Gramática v19 y todos los históricos conservados; sin publicación/aprobación de idioma. [Informe](lotes/2026-10-24-piloto-v20.md).

- **V21 · 24-oct:** indonesio: referencias 360/360 y completo conocido 1566/1566. Gramática v19 y todos los históricos conservados; sin publicación/aprobación de idioma. [Informe](lotes/2026-10-24-piloto-v21.md).

- **V22 · 24-oct:** gramática decimal zh-CN independiente; parser global, v19 y 263 memorias intactos. Referencias 344/360, legacy 223/243 rechazadas; 16 datos no probados bloquean por separado, 37 fixtures nuevas.67 textos y 60 avisos revisados; completo no ejecutado. CI final correcta; retirada efectiva verificada, sin despliegue/aprobación. [Informe](lotes/2026-10-24-piloto-v22.md).

- **V23 ·24-oct:** nueve idas zh-CN corregidas y 16 carencias léxicas resueltas; referencias360/360, gate bloqueado por 1 input completo sin prueba. Caché de políticas inmutables7, 65× local y caché RAM exacta evita5/103 fragmentos del modelo; 274 memorias, 971 fixtures. Unicode17 fijado, historia/global intactos; no completo/deploy/aprobación. CI final 40111019015 correcta; retirada efectiva verificada. [Informe](lotes/2026-10-24-piloto-v23.md).

- **V24 ·25-oct:** contrato de13 textos ingleses ligado a214 fuentes/inputs; referencias360/360, completo1481/1566 rechazado por50 idas y51 cantidades sin prueba.149 fixtures nuevas/1120 totales; caché evita53/509 fragmentos del completo. CI final40148453347 correcta; retirada efectiva verificada. Cero aprobación/publicación. [Informe](lotes/2026-10-24-piloto-v24.md).

## Carpetas clave

| Ruta | Qué hay |
|---|---|
| `src/*.mjs` / `*-logic.mjs` / `*-runtime.js` / `*.css` | Lógica, ejecución en el navegador y estilos de las herramientas del dominio principal (una familia por archivo, con `*.test.mjs` al lado) |
| `src/seo.mjs`, `src/seo-positioning.mjs` | Títulos, descripciones y JSON-LD del dominio principal |
| `src/locales/<idioma>/` y `src/locales/*.mjs` | Packs de idioma (core, herramientas, runtime, GLOSSARY), `release-gate.mjs` y `bundle.mjs` |
| `src/locales.mjs` | Lista de locales, rutas por idioma y packs |
| `src/guides.mjs` | Guías |
| `src/growth600/` | Todo el hub: catálogo, render, formularios, contrato de locales (`locale-contract.mjs`), controladores y `locales/<herramienta>-final.mjs` |
| `src/growth600/live-only-106.*` | Fuente recuperada de 106 herramientas que estaban publicadas sin fuente |
| `scripts/localization/` | Scripts de traducción por herramienta y comprobaciones (`check-release.mjs`, `report-coverage.mjs`) |
| `scripts/indexnow.mjs`, `scripts/yandex-webmaster.mjs` | Envíos a buscadores (**no usar en masa durante la recuperación**) |
| `public/` | Estáticos: modelos, vendor de growth600, licencias, idiomas de OCR |
| `docs/recovery/` | Diagnóstico, **RUNBOOK**, CSV de impresiones |
| `docs/quality/` | **ESTADO.md**, PLAN, STRATEGY-1M, progress.csv, LOG.md, KPIS.md, este mapa |
| `docs/design/planeta-infinito/` | Prototipo de marca aprobado |
| `docs/growth600/`, `docs/planning/` | Historial de planes anteriores (solo consulta) |

## Comandos útiles

```bash
npm test                                   # todas las pruebas (node --test)
npm run check                              # build + validación del dominio principal
npm run build:growth600                    # build del hub tools.
npm run locale:release-check               # puerta de idiomas
USEFULVERSE_DIST=<tmp>/dist USEFULVERSE_PACKS=ja npm run build   # build parcial y aislado (no pisa dist/)
```

## Trampas conocidas

- Codex/ChatGPT y Claude trabajan sobre el mismo repo: **worktree o clon propio siempre**; nunca en el checkout del otro.
- Las ramas locales sin push se pierden: `/tmp` se vacía al reiniciar el Mac.
- `node_modules` + `dist` + `dist-growth600` + modelos de traducción ocupan GB: en el Mac, solo en carpetas temporales que se borran al terminar.
- Un build completo regenera ~25.000 páginas: en local, usar builds parciales.

En la rama del PR #136, validate-and-deploy dispone de30 minutos en v27: el precheck real del modelo tardó643,418s antes de ampliar a333registros revisados. Mismo runner público estándar; inferencia/piloto90min y condiciones de publicación intactos. Main recibe solo los seis documentos de relevo con [skip ci].


Retirada efectiva v25: 2026-10-25T06:35:20.349228+00:00; raíz propia .usefulverse-v25-cierre-20261025 eliminada directamente y comprobada ausente antes de LIBRE. Disco libre 40.86GiB,0 ZIP propios externos restantes. Originales versionados recuperables por árbol Git; código/datos/revisiones/fixtures iguales a CI final40168659587. Seis documentos sincronizados. Evidencia: docs/quality/translation-pilot/remote-v25-verification.json y cli-cache-v25-cleanup.json.


## Referencias bn/ru/ur ·26-oct-2026 · lote cerrado

Lote bn/ru/ur:402 registros S/F/B existentes leídos directamente,321 juicios de ida y9 revisiones negativas independientes. MADLAD:bn341/360,ru346/360,ur311/360; referencias rechazadas, ampliado no ejecutado.106/120 frases lingüísticamente reutilizables pendientes de prueba v28;14 requieren corrección (3bn,3ru,8ur).183 fixtures nuevas,1334 totales;15443 registros sin nuevas inferencias y7271 evaluaciones con repeticiones/131 grupos.0 idiomas aprobados.

Código/datos solo en PR#136. Main recibe únicamente los6 documentos de relevo con[skip ci]. Workflow, src/public y despliegue intactos. Siguiente: Crear v28 independiente empezando por bn: usar batch1-v28-candidate-plan.json y las9 review-batch1-*.json;37/40 idas bn preseleccionadas por revisión lingüística, corregir resetView,zoomOut yshikaku.check. Las37 no están importadas ni probadas por contrato: ligar cada memoria a fuente/hash/contexto exactos y su revisión; mantener procedencia, nunca contar la evidencia original como inferencia nueva. Probar cantidades y tokens por idioma, incluidos four,one,six,25MB,30seconds y negaciones; las pruebas chinas no validan bn/ru/ur. Primero test rojo del fallo antes de cada arreglo. Conservar477 memorias, políticas/perfiles/gramáticas/checkpoints/revisiones anteriores y prefijo1151 de1334 fixtures. Repetir40 referencias bn y todos los avisos con el perfil nuevo; solo si pasan, ampliado con mismas88 claves fijas y lectura de todas174 idas/vueltas y legacy disponible, también fuera88. Después ru (37 reutilizables/3 correcciones) y ur (32/8), con gates independientes. No repetir baseline ni v27 40196684338/40198168513. Los22 destinos restantes siguen en acceleration-review-batches.json (desde tr/vi/it), los6 históricos necesitan reparación; ha/am/te/gu/ta/mr/sw requieren80 muestras modelo. Compartir preparación y CI por lote, sin omitir suite ni revisión. Paso A sigue abierto por capacidad Pages,37 traducciones revisadas y nb real; no avanzar a fase0.

CI final, seguridad, GET/XML y retirada efectiva verificados en los recibos de cierre.

CI inicial40245562940: error de formato en fixtures nuevas (faltaba observed_candidate), corregido con procedencia exacta por ID. El test histórico y el test de hallazgos pasan sin rebajar comprobaciones; notas/avisos/textos/runtime intactos. Suite completa repetida y correcta en40246599367; el error de formato queda documentado y su prueba histórica se conserva.


CI final[40246599367](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40246599367), fuente`7ec358639d326a2dafdd29e556dd4724a6a34f66`, correcta:3045 Node y308 Python (306 correctas,2 omisiones por dependencias), Python593.43s. Build principal9972 páginas+36 homes/10260 URLs; gate20 locales existentes; hub:217 herramientas Growth,100 de mercado y106 recuperadas editables; buildGrowth7848 páginas/8253 archivos. Preview11293 archivos/10800 páginas y todas las homes noindex,0 URLs indexables;36 locales, no acredita37. Modelo y ambas publicaciones omitidos;0 artefactos.21 tests enfocados correctos y gitleaks sin secretos nuevos. Producción antes/después:5 GET y2 XML con mismos estados/bytes/SHA256,25625 URLs;3 soft404 siguen200. Sin UI/nativo/hardware/responsive/índice Google certificados.0 nuevas pruebas Pedro;P-001–P-008 pendientes.

Recibos: docs/quality/translation-pilot/ci-batch1-verification.json y remote-batch1-verification.json (en la rama del PR). Retirada efectiva ejecutada y verificada, recibo al cierre.

Retirada efectiva: 2026-10-26T00:08:01.808972+00:00; raíz propia .usefulverse-batch-bn-ru-ur-20261026 eliminada y comprobada ausente antes de LIBRE. 7792 archivos versionados cotejados con el árbol remoto; código/datos/revisiones/fixtures iguales a CI final40246599367; solo6 documentos y recibos posteriores. Seis documentos idénticos en main/feature; main solo cambia esos6. Cero cachés/ZIP propios externos restantes; originales recuperables en GitHub. Disco libre 41.76GiB. Evidencia: remote-batch1-verification.json y cli-cache-batch1-cleanup.json (rama del PR#136).
