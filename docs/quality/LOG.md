# UsefulVerse · LOG de lotes

Un bloque por lote (plantilla en RUNBOOK §10). El más reciente arriba.

## 2026-10-20 · Codex · Paso A: fuente recuperada y CI verde; publicación pendiente
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136) en borrador, rama `feat/new-tools-batch-1`.
  Fuente de las 300 recuperada selectivamente del respaldo privado `27a2f174`, sin importar su historial.
- Commits de código: `7879f9a` (recuperación y noindex), `83efa8a` (CI aislada/estilos), `4e8d27c` (referencias del catálogo).
- [CI final](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39398910565): **3.041/3.041 tests**,
  `npm run check`, `locale:release-check`, hub público y build aislado de las 300 verdes. Preview: 11.293 archivos;
  10.800 páginas de herramientas con noindex + homes noindex; sitemap vacío. Noindex/hreflang/robots con regresión.
- Gitleaks: 0 secretos. Columnas de pruebas añadidas a `progress.csv`; las siete capas de las 300 siguen pendientes.
- Producción comprobada por HTTP: sitemaps con **25.625 URLs**; 10 URLs de la preview antigua con meta/cabecera noindex;
  las tres rutas inventadas del hub aún devuelven 200. El sitemap de la preview antigua respondió 403 al revalidarlo.
- **Sin merge, deploy, envíos a buscadores ni activaciones. Paso A NO terminado**: capacidad conjunta de Pages insuficiente
  y traducciones revisadas/nb pendientes. No se avanza de fase. En main: 0/300; activadas: 0; existentes terminadas: 0/700.
- Pedro: 0 pruebas nuevas, P-001 a P-008 siguen pendientes, 0 FALLA. Relevo y limpieza: `lotes/2026-10-20-paso-a.md`.

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
