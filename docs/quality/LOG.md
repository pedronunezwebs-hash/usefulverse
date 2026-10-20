# UsefulVerse · LOG de lotes

Un bloque por lote (plantilla en RUNBOOK §10). El más reciente arriba.

## 2026-10-21 · Codex · Paso A: v5/v6 y control independiente de regresiones
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, `4c477b7`…`bd74b32`. Sin merge del código ni publicación.
- V5 cubre cada oración, conserva versiones/símbolos por posiciones conocidas y memoria exacta; rechaza privacidad es.
  V6 añade el sentido de no subir ni guardar: referencias es360/360, nb359/360, solo referencias.
- [Completo v6 39455323981](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39455323981): 856 registros,
  160 reutilizados y 696 nuevos; 71 aciertos de memoria, 930,07 s. **Rechazados es y nb** por sentidos técnicos/privacidad,
  Name en el nombre nb, gramática y compuestos. Las omisiones finales revisadas, símbolos y versiones se conservan.
- Misma muestra de 68 claves +20 adicionales fijadas con semilla: 176 candidatos revisados y 40 actuales conservados por hash.
  **7.161 registros, 1.754 evaluaciones registradas (con repeticiones), 464 fixtures (456 ida, 8 vuelta), 0 idiomas aprobados**.
- 45 tests Python (43 pasan localmente, 2 de dependencias en runner); cobertura cruza rúbricas/checkpoints independientes.
  Control de identificadores de paquetes, trazas, memoria y auditoría de vuelta separada. Políticas v2–v6 medidas intactas.
- CI final verificada y verde: [39460406968](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39460406968), `bd74b32`.
  3.045 Node y 43 Python correctos, 2 omitidos por dependencias; check, idiomas, hub y preview verdes. Dependencias reales probadas en los jobs de modelos. Actionlint válido, Gitleaks sin secretos en 2,83 MB de diff y el refuerzo posterior.
- Producción GET: 25.625→25.625 URLs en sitemaps; tres rutas falsas del hub aún 200. Sin deploy, activaciones, 301 ni envíos.
  Las siete capas de herramientas, responsive/RTL, rendimiento y hardware no se certifican por este lote de infraestructura.
- Pedro: ninguna prueba nueva; P-001–P-008 pendientes y 0 FALLA. Siguiente v7 por familias; no ampliar ni fase 0.
  [Informe y cierre](lotes/2026-10-20-piloto-v5.md); capacidad de Pages y 37 idiomas siguen abiertos.

## 2026-10-20 · Codex · Paso A: referencias corregidas y piloto completo es/nb rechazado
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador. `2c75dc2`…`dfe55ae`.
  Inglés controlado por sentido, tres variantes separadas y siete entradas de memoria exacta revisadas por el agente.
- Referencias v4: es 360/360 y nb 358/360; cero errores en botones/cifras/negaciones, dos leves/40 en nb.
  Después, [piloto completo 39437391534](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39437391534):
  214 cadenas × 2 idiomas × (sistema híbrido + actual) = **856 registros**; reutiliza 160 y añade 696.
- **6.145 registros** totales; **1.378 evaluaciones** del agente (pueden repetir texto entre variantes), **410 regresiones**.
  **0 idiomas aprobados**: el completo revela nuevos Clear/clean incorrectos, omisiones de No/privacidad/límites,
  versiones y símbolos de unidad alterados. No ampliar esas combinaciones hasta corregir en una política nueva.
- Memoria con origen/digest; checkpoints inmutables por política; control de símbolos de unidad y tokens técnicos en la vuelta;
  reanudación real sin modelo y rechazo de suplantación de identidad. MADLAD baseline de seis destinos más revisado.
- [CI final 39440552803](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39440552803), `dfe55ae`:
  **3.045 Node**, 33 Python pasan + 2 de dependencias reservados al job de modelos; check, idiomas, hub y preview verdes.
  Dependencias reales probadas en Actions. Actionlint válido; Gitleaks sin secretos en los diffs.
- Producción GET: **25.625 → 25.625 URLs**, tres rutas falsas del hub aún 200; sin merge del código a main, deploy,
  activaciones, 301 ni envíos a buscadores. Las siete capas y la puerta de herramientas siguen pendientes.
- Pedro: **0 pruebas nuevas**, P-001–P-008 pendientes, **0 FALLA**. Relevo y limpieza:
  [informe](lotes/2026-10-20-piloto-contexto.md); datos y rúbricas en la rama del PR.

## 2026-10-20 · Codex · Paso A: referencias de traducción computadas; 0 idiomas aprobados
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), rama `feat/new-tools-batch-1`; sin merge/publicación.
- Corpus real de tres herramientas, 40 referencias, 37 idiomas. Tanda es/nb de ambos motores: 320 registros.
  M2M100: 40 referencias en 35 destinos soportados (2.371 registros); MADLAD en los 36 destinos (2.438).
  **4.809 registros** conservados y fusionados sin perder las tandas previas; te solo con MADLAD.
- 642 traducciones evaluadas por el agente, sin revisión nativa inventada; 202 salidas rechazadas como regresiones.
  **0 idiomas aprobados**: glosario y marcadores deben corregirse antes de ampliar combinaciones fallidas.
- Extracción segura de las 300: 15.815 unidades; 7.887 cadenas distintas; slugs, archivos y datos del revisor conservados.
  Tests de reanudación atómica, no descarga con checkpoint completo y retrotraducción. Detalle:
  [informe del lote](lotes/2026-10-20-piloto-actions.md) y
  [piloto en la rama](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/translation-pilot.md).
- Producción por GET: sitemaps **25.625 → 25.625**; tres rutas falsas devuelven 200. Sin deploy, activaciones ni cambios de fase.
  [CI final 39405978076](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39405978076), `f8fe929`:
  **3.045 tests Node**; 19 Python pasan, 2 de dependencias solo en el job de modelos; builds y puerta de idiomas verdes.
  Pedro: ninguna prueba nueva, P-001–P-008 pendientes y 0 FALLA. Limpieza real anotada en el informe tras borrar el clon.

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
