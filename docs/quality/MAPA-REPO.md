# UsefulVerse · Mapa del repo (para no explorarlo cada vez)

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
  `ubuntu-latest`, sin secretos ni despliegue. `pilot_policy` separa baseline, segmentos v2, frases v3, memoria revisada v4 y cobertura de oraciones/datos tipados v5/v6/v7. Parámetros, checkpoints y resultados: `docs/quality/translation-pilot.md`.

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
