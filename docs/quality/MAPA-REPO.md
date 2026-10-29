# UsefulVerse · Mapa del repo

Estado, candado, métricas y siguiente paso: **[ESTADO.md](ESTADO.md)**. Historial: [LOG.md](LOG.md) e informes de lotes. Este mapa conserva solo estructura y operación.

Repo público pedronunezwebs-hash/usefulverse; reglas en AGENTS.md. **PR #136 integrada en main el 29-oct**: fuente de las 300 en noindex y pipeline de preparación/QA disponibles. Preview existente actualizada (11.100 rutas/37 destinos), diez muestras públicas verificadas, cero activaciones. Las 700 publicadas siguen divididas entre los dos sitios; unificación §4b todavía pendiente. Conservar feat/new-tools-batch-1 mientras el traductor la use como source_ref; al cerrar este lote ambas ramas quedan alineadas. [Entrega](runtime-v1/README.md).

## Operación vigente · 28-oct

Actions solo para el traductor y sus verificaciones/avisos. Los tres workflows de web (`deploy-cloudflare.yml`,
`validate-staged.yml`, `measure-release-capacity.yml`) están deshabilitados; se conserva su código histórico.
QA/build/deploy de las herramientas: local/manual, Git normal, sin servicios facturables nuevos. Dependabot automático
pausado y alertas de vulnerabilidades conservadas. El destino sigue siendo un sitio en `usefulverse.com` con assets sin
script por visita; antes del corte se verifican plan/coste/collisiones y 301 de `tools.`. La web publicada sigue dividida.
[Decisión y recibo](lotes/2026-10-28-webs-manuales-traductor-intacto.md).

## Dos sitios, dos builds

| Sitio | Proyecto de Cloudflare Pages | Build | Salida | Catálogo | Plantilla |
|---|---|---|---|---|---|
| `usefulverse.com` (277 herramientas) | `usefulverse` | `npm run check` (= `scripts/build.mjs` + `scripts/check-build.mjs`) | `dist/` | `src/catalog.mjs` | `src/template.mjs` (`renderToolPage`, `renderHome`, `renderNotFoundPage` → genera `404.html`) |
| `tools.usefulverse.com` (423 herramientas, «hub Growth600») | `usefulverse-tools` | `npm run build:growth600` (= `scripts/build-growth600.mjs`) | `dist-growth600/` | `src/growth600/catalog.mjs` (+ `src/markets-no-ch/catalog.mjs`) | `src/growth600/render.mjs`, `build.mjs`, `site.css`, `rtl-fixes.css` — **no genera `404.html`** (por eso hay soft 404) |

> **Previsto:** unificar los dos sitios en un Worker de Static Assets en `usefulverse.com` (RUNBOOK §4b). El motivo de la
> división fue el límite de 20.000 archivos de Pages en el plan gratuito; Workers Static Assets admite 100.000 y la cuenta ya
> tiene Workers Paid.

## Despliegue y CI históricos (`.github/workflows/deploy-cloudflare.yml`, ahora deshabilitado)

- Push a main sin `[skip ci]`: tests, build principal, gate de idiomas, build del hub y publicación solo de usefulverse.com.
- El hub tools. se publica solo mediante workflow_dispatch en main y publish_growth600=true. No activarlo durante el piloto.
- PR a main: validación completa y preview aislada de las 300 en noindex; no publica.
- Piloto: workflow_dispatch, translation_pilot=true, perfil context-v33, engine madlad, locale ru y scope references/full; full exige referencias y avisos aprobados. No repetir los runs cerrados.
- Solo ubuntu-latest estándar. Sitio: 45 min; piloto: 90 min. Permisos contents:read, acciones por SHA. No usar runners de pago, artefactos ni cachés persistentes de modelos.
- Operación actual: modelos del traductor en Actions; pruebas/builds/deploys de web locales/manuales y dentro de presupuesto. No usar Codespaces ni Containers.
- CI histórica v33: <!-- V33_CHECK -->CI final [40509319243](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40509319243), fuente `660bb37d294ce392e3353ac4973e20521bb7baeb`: 3.045 Node y 396 Python (394 correctas, 2 omisiones opcionales), cero fallos/errores; Python 1632.236 s en cuatro procesos, cada ID una vez. Builds principal/hub, gate existente y preview noindex correctos; modelo y publicaciones omitidos. No acredita 37 locales ni revisión nativa.<!-- /V33_CHECK -->

## Traducción automática y vista previa · 28-oct

El controlador `translation-autopilot.yml` ejecuta la fuente fijada de `feat/new-tools-batch-1` en runners públicos estándar, con auditoría de significado, cuarentena, reanudación y entrega automática a `automation/translation-results`. Hasta seis vueltas, cuatro jobs simultáneos y plazo de 24 h; sin APIs pagadas, artifacts/cache persistente, Codespaces ni Cloudflare. `translation-watch.yml` avisa al finalizar y vigila cada 30 min; correo confirmado por Pedro y dos ejecuciones cron reales del vigilante; push sin comprobar y cron diario observado en [40658885003](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40658885003), pendiente; no acredita modelos ejecutados. [Operación y límites](translation-drafts/README.md).

- Corpus: 1.000 propietarios; copia centralizada de los 1.000 conectada; 0 solo metadatos. Las 14 fuentes de mercado usan alias y las 106 recuperadas usan `translation-sources/` con hashes/procedencia. No certifica todos los literales del JS ni calidad integral. Ningún idioma ni herramienta se aprueba por generar un paquete.
- `scripts/localization/prepare-preview-packages.py`: revalida memoria/semillas con Python 3.11 y exporta a un directorio temporal separado, sin red, inferencia ni escritura en la rama de datos.
- `automatic-packages.mjs` / `automatic-preview.mjs`: enlazan hash/contexto/políticas a hojas de copia. Solo preview optativo de los 300 `indexable:false`, con respaldo inglés normalizado; se comprueba el JSON renderizado de las 10.800 rutas. El build normal no consume paquetes ni modifica copias de las 700 existentes.
- `validate-staged.yml`: CI manual sin deploy. [40646366137](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40646366137) completa y correcta: 3.053 Node/448 Python, dos omisiones; builds principal/hub, gate y preview noindex correctos.
- `translation-preflight.yml` / `translation-preflight.py`: puerta reutilizable de 45 Python/seis Node antes de la primera vuelta, con el mismo SHA de fuente. Runner estándar/solo lectura, Python 3.11/Node fijado; falla antes de los modelos. Prueba real [40648113707](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40648113707) correcta, 24 s y cero ms facturables. No carga modelos ni altera políticas/memoria. [Lote](lotes/2026-10-28-puerta-automatica-traducciones.md).
- `translation-drafts.yml` y sus checkpoints siguen preservados como sistema anterior; no relanzarlos para sustituir el controlador autónomo ni cancelar la campaña activa 40565692987.

## Capacidad del Paso A

`measure-release-capacity.yml` es histórico y está deshabilitado desde la decisión del 28-oct. Ejecutó tests y tres builds en Actions estándar, sin publicar. `scripts/release-capacity.mjs` inventaría bytes/hash/ruta, rechaza entradas vacías/symlinks y salidas que modifiquen builds, y distingue capacidad de aprobación de despliegue. [40652759818](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40652759818): principal 10.728 archivos, hub 16.354, preview 11.293. Unión hipotética del hub y las 300: 27.470 y 73 conflictos (36 portadas/metadatos). Presupuesto conservador Pages Free 20.000/25 MiB; ningún cambio o consulta del plan real. Mantener la preview existente separada mientras siga abierta la integración definitiva. [Informe y fingerprints](capacity-v1/report.json), [decisión provisional](lotes/2026-10-28-capacidad-paso-a.md).

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
- La preview vigente tiene 37 destinos de ruta; nb es respaldo inglés declarado, no traducción aprobada. Ninguna muestra del piloto ni subida-noindex equivale a herramienta/idioma aprobado.
- 300 nuevas en noindex, fuera de sitemap/hreflang indexables y sin bloqueo robots; las 700 existentes se conservan indexables.
- Si src/markets-no-ch se usa en sparse-checkout, incluir las seis fuentes copy-en/translations de voice-changer, shikaku y dxf-viewer: los contratos verifican sus bytes.

Antes de CI, tras cada recolección: `python3 scripts/localization/pilot-checkpoint-inventory.py --write` y después el mismo comando sin `--write`. Solo actualiza y comprueba inventario/total derivados; no modifica crudos, juicios ni procedencia de los runs.

## Traductor autónomo · 28-oct

Operación actual: [translation-drafts/README.md](translation-drafts/README.md). `translation-autopilot.yml` coordina hasta seis vueltas con cuatro modelos simultáneos de `translation-wave.yml`; fuente fijada de la rama permitida, modelos solo lectura y publicador acotado a `automation/translation-results`. Cron diario y cambios del inglés; omite modelos si la cola está procesada. `translation-watch.yml` comprueba estados cada 30 min y crea avisos nativos GitHub. Main registra controladores; el runtime/extractor se ejecuta desde el SHA de la fuente (inicialmente feat/new-tools-batch-1). No activar el source_ref main antes de integrar esas fuentes. No ejecuta deploy.

Validación ampliada histórica: `validate-staged.yml` (ahora deshabilitado), solo manual/lectura y sin ningún paso de deploy; conserva intactos los bytes de `deploy-cloudflare.yml`. CI vigente 40646366137 correcta; el cambio posterior de puerta automática pasó 45 Python/seis Node en 40648113707. Los motores y las políticas se mantienen sin cambios.

## UI inglesa de los 14 mercados · 28-oct

`src/markets-no-ch/market-ui-copy-en.mjs` expone las fuentes existentes bajo el nombre de su modo para el recolector automático, sin cambiar scripts del traductor. `remaining-tools-copy-en.mjs` separa mensajes/ejemplos de campos; el controlador usa ese contrato y el asunto de carta se localiza desde la copia ya traducida. 478 tests locales, build parcial de 518 rutas y 378 muestras Chrome; los checks globales y la aprobación integral siguen pendientes. Código solo en la rama del PR. [Lote y relevo](lotes/2026-10-28-ui-inglesa-14-mercados.md).

## UI inglesa de las 106 recuperadas · 28-oct

`translation-sources/<id>.json` alimenta el recolector existente mediante `sourceCopy`; `nonTranslatableCopy` conserva datos técnicos, ejemplos estructurados y puzzles fuera de la traducción. `scripts/recovery/extract-recovered-copy.py --check` compara con el HTML/JS inglés capturado, sin ejecutar código/red; la escritura solo admite una carpeta nueva. 147 tests Node/15 Python verifican los 106 y sus límites; no cambian motores/modelos/workflows ni HTML/JS. La expectativa antigua de 106 solo metadatos se actualiza en el test de cobertura, con prueba independiente por propietario. 48.403 unidades, ninguna herramienta/idioma aprobada. Estos datos son entradas del traductor para campañas que usen el commit nuevo; no sustituyen por sí solos el runtime de las páginas ni acreditan actualización de la campaña antigua. [Lote y pendientes](lotes/2026-10-28-ui-inglesa-106-recuperadas.md).

Para cualquier tarea de corpus con sparse-checkout, incluir **`translation-sources`** además de `src`, `scripts` y los documentos necesarios; `git add --sparse -- translation-sources` permite preparar sus entradas si el clon no la incluye. Verificar los 106 JSON en el árbol remoto antes de cerrar. Sin esa carpeta el recolector vuelve a metadatos; las regresiones deben fallar.
