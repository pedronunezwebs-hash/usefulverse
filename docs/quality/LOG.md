# UsefulVerse · LOG de lotes

Un bloque por lote (plantilla en RUNBOOK §10). El más reciente arriba.

## 2026-10-20 · Codex · Paso A: fuente recuperada, publicación pendiente
- Rama `feat/new-tools-batch-1`: recuperación selectiva del respaldo privado `27a2f174` de las 300; no se importa historial privado.
- Todas con `indexable: false`; tests de noindex, sitemap, hreflang, robots y protección de existentes; build público conserva 700.
- Paso A NO terminado: capacidad de Pages insuficiente al juntarlas y traducciones revisadas/nb pendientes. No avanzar de fase.
- Detalle, checklist y reproducción: `lotes/2026-10-20-paso-a.md`. CI completo pendiente; no desplegado.

## 2026-10-20 · Claude · Auditoría del catálogo y PDF con IA
- Rastreo de las 700 páginas EN + 7 auditorías por categoría frente a los líderes → `AUDITORIA-CATALOGO.md` (13 problemas de
  todo el sitio, 26 errores confirmados, huecos) y `auditoria/*.md` con evidencia. Rastreo en `auditoria/rastreo-700-en.csv`.
- `PDF-VS-ILOVEPDF.md` (29/31 funciones; 16 páginas por intención) y `PDF-IA.md` (resumir y traducir en el dispositivo).
- Sin cambios en la web.

## 2026-10-20 · Claude · Repo público con seguridad
- gitleaks: historial (448 commits), PRs/issues (132) y registros de Actions (369) → 0 secretos.
- Token de Cloudflare nuevo solo de Pages (`usefulverse-github-deploy`); escaneo de secretos con bloqueo de push; Dependabot;
  acciones fijadas por SHA; ruleset `main` + `backup/*`; PRs externos con aprobación. Repo → público.
- Unificación de dominio diseñada (RUNBOOK §4b). Revisión final (REVISION-FINAL.md).

## 2026-10-20 · Claude · Documentación y relevo
- Diagnóstico, plan de calidad, estrategia 1M, RUNBOOK, ESTADO.md, MAPA-REPO.md, progress.csv.
- Copia de seguridad del trabajo sin guardar de las 300 herramientas: rama `backup/codex-300-tools-20261020` (commit `636f3c1`).
- Sin cambios en la web. Siguiente: ver ESTADO.md §1.
