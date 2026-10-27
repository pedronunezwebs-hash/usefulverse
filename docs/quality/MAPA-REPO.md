# UsefulVerse · Mapa del repo

Estado, candado, métricas y siguiente paso: **[ESTADO.md](ESTADO.md)**. Historial: [LOG.md](LOG.md) e informes de lotes. Este mapa conserva solo estructura y operación.

Repo público `pedronunezwebs-hash/usefulverse`; reglas de seguridad y catálogo en AGENTS.md. Código del Paso A y piloto actual solo en `feat/new-tools-batch-1`, [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador. Main recibe el relevo y los controladores/workflows del traductor con `[skip ci]`, sin publicar las 300 ni cambiar la web.

## Dos sitios, dos builds

| Sitio | Proyecto de Cloudflare Pages | Build | Salida | Catálogo | Plantilla |
|---|---|---|---|---|---|
| `usefulverse.com` (277 herramientas) | `usefulverse` | `npm run check` (= `scripts/build.mjs` + `scripts/check-build.mjs`) | `dist/` | `src/catalog.mjs` | `src/template.mjs` (`renderToolPage`, `renderHome`, `renderNotFoundPage` → genera `404.html`) |
| `tools.usefulverse.com` (423 herramientas, «hub Growth600») | `usefulverse-tools` | `npm run build:growth600` (= `scripts/build-growth600.mjs`) | `dist-growth600/` | `src/growth600/catalog.mjs` (+ `src/markets-no-ch/catalog.mjs`) | `src/growth600/render.mjs`, `build.mjs`, `site.css`, `rtl-fixes.css` — **no genera `404.html`** (por eso hay soft 404) |

> **Previsto:** unificar los dos sitios en un Worker de Static Assets en `usefulverse.com` (RUNBOOK §4b). El motivo de la
> división fue el límite de 20.000 archivos de Pages en el plan gratuito; Workers Static Assets admite 100.000 y la cuenta ya
> tiene Workers Paid.

## Despliegue y CI (`.github/workflows/deploy-cloudflare.yml`)

- Push a main sin `[skip ci]`: tests, build principal, gate de idiomas, build del hub y publicación solo de usefulverse.com.
- El hub tools. se publica solo mediante workflow_dispatch en main y publish_growth600=true. No activarlo durante el piloto.
- PR a main: validación completa y preview aislada de las 300 en noindex; no publica.
- Piloto: workflow_dispatch, translation_pilot=true, perfil context-v33, engine madlad, locale ru y scope references/full; full exige referencias y avisos aprobados. No repetir los runs cerrados.
- Solo ubuntu-latest estándar. Sitio: 45 min; piloto: 90 min. Permisos contents:read, acciones por SHA. No usar runners de pago, artefactos ni cachés persistentes de modelos.
- Pipeline local ligero: pruebas enfocadas, extracción de corpus y análisis estático. Modelos/builds completos exclusivamente en Actions. No usar Codespaces ni Containers.
- CI histórica v33: <!-- V33_CHECK -->CI final [40509319243](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40509319243), fuente `660bb37d294ce392e3353ac4973e20521bb7baeb`: 3.045 Node y 396 Python (394 correctas, 2 omisiones opcionales), cero fallos/errores; Python 1632.236 s en cuatro procesos, cada ID una vez. Builds principal/hub, gate existente y preview noindex correctos; modelo y publicaciones omitidos. No acredita 37 locales ni revisión nativa.<!-- /V33_CHECK -->

## Traducción automática en segundo plano · 27-oct

`translation-drafts.yml` es un workflow separado, solo manual y solo repo público. Se registra también en main para poder lanzarlo, pero su código/fuentes actuales se ejecutan desde `feat/new-tools-batch-1`. No cambia el workflow de deploy ni dispara builds por cada idioma.

- Dos vueltas de cuatro jobs `ubuntu-latest`, dos simultáneos; cada uno tiene 240 min de presupuesto y 300 min de timeout.
- `background-source.mjs` extrae las 300 fuentes actuales: 15.815 unidades / 9.505 pares de texto-contexto; 36 destinos.
- `background-drafts.py` deduplica por texto, contexto e idioma; fija MADLAD; comprueba datos protegidos, vacío, truncamiento, inglés idéntico, idioma/escritura y una muestra de negaciones por retrotraducción.
- No escribe repos ni usa secretos, artefactos, cachés remotas, Cloudflare o API de traducción. Recupera automáticamente checkpoints anteriores con permiso `actions:read`, guarda registros acumulados en logs recuperables y conserva `approved:false`.
- Recolección mecánica, checkpoints en Git y reanudación: [README](translation-drafts/README.md). Generar borradores no aprueba su publicación.

- CI actual de automatización: [40523434352](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40523434352), fuente `65626e5`, 3.045 Node + 409 Python, cero fallos/errores, dos omisiones opcionales. Tanda remota: [40523422271](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40523422271); no esperar en el chat a que termine.

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

- Clon/worktree propio; preservar cambios ajenos. Confirmar remoto, rama y estado antes de editar o sincronizar.
- No dejar trabajo solo en local o /tmp. Push y comprobación remota antes de eliminar originales únicos.
- No empezar con menos de 10 GB libres. Clones superficiales con filtro blob:none; dependencias/QA/cachés dentro de su carpeta temporal y retirados al cerrar.
- Los 106 JS recuperados siguen pendientes de hash. El hub no genera 404.html; tres rutas falsas responden 200.
- La preview construida tiene 36 locales; no acredita 37 ni nb real. Ninguna muestra del piloto equivale a un idioma aprobado para publicar.
- 300 nuevas en noindex, fuera de sitemap/hreflang indexables y sin bloqueo robots; las 700 existentes se conservan indexables.
- Si src/markets-no-ch se usa en sparse-checkout, incluir las seis fuentes copy-en/translations de voice-changer, shikaku y dxf-viewer: los contratos verifican sus bytes.

Antes de CI, tras cada recolección: `python3 scripts/localization/pilot-checkpoint-inventory.py --write` y después el mismo comando sin `--write`. Solo actualiza y comprueba inventario/total derivados; no modifica crudos, juicios ni procedencia de los runs.

## Traductor autónomo · 28-oct

Operación actual: [translation-drafts/README.md](translation-drafts/README.md). `translation-autopilot.yml` coordina tres vueltas de `translation-wave.yml`; fuente fijada de la rama permitida, modelos solo lectura y publicador acotado a `automation/translation-results`. Cron diario y cambios del inglés; omite modelos si la cola está procesada. `translation-watch.yml` comprueba estados cada 30 min y crea avisos nativos GitHub. Main registra controladores; el runtime/extractor se ejecuta desde el SHA de la fuente (inicialmente feat/new-tools-batch-1). No activar el source_ref main antes de integrar esas fuentes. No ejecuta deploy.
