# UsefulVerse · LOG de lotes

Un bloque por lote (plantilla en RUNBOOK §10). El más reciente arriba.

## 2026-10-21 · Codex · Hito v11:referencias revisadas,completo pendiente
- Run39629733667:160 registros,77 tests reales,21 memorias,cleanup correcto,0 artefactos. Fuente fe2acf3.
- ES y nb360/360 en40 referencias cada uno;14 registros con avisos reconciliados,9 defectos conocidos de vuelta separados.72 idas idénticas a v10 por hashes y8 revisadas nuevas.0 idiomas aprobados.
- Checkpoint/revisión/resúmenes respaldados antes del completo. Siguiente:68+20 conocidas y todos los avisos;sin deploy/activaciones ni avance de fase.

## 2026-10-21 · Codex · Hito v11 en curso
- Código `fe2acf3`: oraciones completas con traza y datos por oración/unidad; ambas FAQ de tono/velocidad y memoria NB de unidades.77 tests ligeros,75 correctos y dos dependencias. V2–v10 intactos.
- [Referencias39629733667](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39629733667) pendientes de revisión. No completo hasta pasar ambas referencias y todos los avisos.
- Sin publicación ni activación; Paso A abierto. Candado ocupado e informe v11 recuperable en rama del PR.

## 2026-10-21 · Codex · Paso A: v10, contrato tipado y omisión bloqueante
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador; `6d99ba9`…`1dd7f8c`. Unidades completas con cantidades regionales, invariantes separados, signo Unicode, cobertura numérica y preflight 214; políticas v2–v9 intactas.
- Run39623344071 falló por validar MP3 como cifra; 29 registros recuperados intactos. [Reanudación39624247518](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39624247518):131 nuevos, 160 totales; 70 tests reales, cleanup correcto, cero artefactos. Run anterior39623097623 cancelado con 0 registros/cleanup correcto.
- **es 358/360 rechazado**, omite tono alto/reproducción rápida; **nb 359/360 solo referencias**. No completo v10.80 idas/vueltas y diez registros con avisos reconciliados; 72 idas iguales por hashes, ocho nuevas.80 comparaciones legacy históricas no contadas como evaluaciones nuevas.
- **8.497 registros, 2.251 evaluaciones, 512 fixtures (481 ida, 31 vuelta), 0 aprobados.** Tres fixtures semánticos nuevos y 12 tests nuevos; reproducciones rojas antes de arreglos. Adenda histórica por hashes conserva la revisión v9 al añadir hallazgo posterior de vuelta.
- CI final [39626385396](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39626385396), código 1dd7f8c:**verde:3.045 Node; 71 Python (69 correctos y 2 omitidos por dependencias); check, idiomas, hub y preview verdes**. actionlint y Gitleaks correctos; 42 archivos remotos contrastados y nueve políticas medidas intactas.
- GET/XML de producción15:09 y15:26UTC:10.260+15.365=25.625 URLs; tres rutas falsas del hub200, sin deploy. No se certifican UI/responsive/RTL/peso/a11y/rendimiento/hardware, 18 puntos ni siete capas.
- Pedro:0 nuevas, P-001–P-008 pendientes, 0 FALLA. Siguiente v11 por cobertura semántica; referencias antes del completo, después 28 destinos y 80 muestras pocos recursos. Paso A/capacidad Pages/37 traducciones abiertos; sin fase 0. [Informe y limpieza](lotes/2026-10-21-piloto-v10.md).

## 2026-10-21 · Codex · Paso A: v9 por familia y auditoría regional/avisos
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador; `9b430c3`…`1a963cc`.
  V2–v9 medidos intactos; fuentes, slugs,700 existentes y estados de herramientas preservados; sin merge del código/deploy.
- V9 añade cuatro memorias completas para cubrir las cinco claves de duración/tamaño (una existente), ligadas a fuente/contexto.
  [Referencias 39547858733](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39547858733): es 360/360,nb 360/360.
  [Completo 39548546424](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39548546424): **fijo 88 es 772/792,nb 768/792, rechazados**.
  Misma muestra 68:592/612 y 588/612;20 adicionales conocidas180/180 ambos, no prueba ciega. Cleanup de los dos runners verificado.
- 177 nuevas evaluaciones del completo, incluida Visible es fuera de muestra.40 comparaciones legacy históricas solo verifican
  hashes, no se cuentan como nuevas evaluaciones ni revisión nueva de sus vueltas. Revisión de agente, sin nativos.
- Auditor permanente: cada aviso, hash y decisión; no heredar puntuación perfecta sobre un fixture ni omitir avisos fuera de muestra.
  Regresión de cobertura roja al quitar Visible. Guard regional separa cantidad literal inglesa de su lectura local en es/nb;
  detecta200,000 ambiguo sin modificar inferencia/checkpoints/políticas medidos. Sin reparar salidas ni relajar guards históricos.
- **8.337 registros,2.171 evaluaciones (con repeticiones),509 fixtures (479 ida,30 vuelta), 0 idiomas aprobados**.
  37 fixtures nuevos; suite ligera59 Python,57 correctos y 2 dependencias. CI final [39550210253](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39550210253), código 1a963cc: verde: 3.045 Node; 59 Python (57 correctos y 2 omitidos por dependencias); check, idiomas, hub y preview verdes.
  Gitleaks sin secretos y actionlint correcto. Los modelos probaron56/58 casos con dependencias según su commit; audit regional posterior.
- Producción por GET/XML, dos snapshots: **25.625→25.625 URLs**, tres falsos paths del hub aúnHTTP200. Sin activaciones ni envíos.
  No se certifican siete capas/18 controles, UI, responsive/RTL, a 11y/rendimiento o hardware.0 pruebas nuevas para Pedro;
  P-001–P-008 pendientes, 0 FALLA. Siguiente v10: contexto completo por familia +datos regionales/gramática, sin fase 0 ni masiva.
  Capacidad Pages/37 idiomas pendientes. [Informe, datos y limpieza](lotes/2026-10-21-piloto-v9.md).

## 2026-10-21 · Codex · Paso A: v7/v8, tipos numéricos y guard de cantidades inventadas
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador; código `203422e`…`96c7440`.
  Políticas v2–v8 medidas intactas. Solo runner/políticas/evidencia, sin cambios de src/public, merge del código o deploy.
- V7 tipa cantidades/coordenadas/paquetes, desambigua objetos geométricos y audio. Gate inicial retirado al reconciliar
  el aviso de respuesta negativa con la rúbrica v6. Completo 39484416039 cancelado antes de emitir datos; limpieza verificada.
- V8 añade No/Nei explícito en FAQ equivalentes y ejemplo Shikaku claro. [Referencias 39485133272](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39485133272):
  **es353/360 rechazado** por «30 10 segundos» frente a 30; **nb360/360 solo referencias**. No completo v8.
  La salida cruda queda bloqueada como machine-draft; no se repara eliminando el dato por conjetura.
- **7.481 registros, 1.914 evaluaciones registradas (con repeticiones), 472 fixtures (458 ida, 14 vuelta), 0 idiomas aprobados**.
  Contratos de memoria por hash/contexto, cobertura de errores ligada a rúbricas/checkpoints independientes y dirección back separada.
- Suite ligera: **55 Python, 53 correctos y 2 de dependencias**. Jobs reales: 51 y 53 con dependencias, antes de los dos
  últimos controles ligeros. CI final [39486540297](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39486540297), `96c7440`: **verde: 3.045 Node; 55 Python (53 correctos y 2 omitidos por dependencias); check, idiomas, hub y preview verdes**.
  Actionlint válido; Gitleaks sin secretos. Conflictos documentales de main integrados sin cambiar el árbol de código.
- Producción por GET de XML: **25.625→25.625 URLs**, tres rutas falsas del hub aún HTTP 200. Sin activaciones, 301 ni envíos.
  No certifica siete capas/18 controles de herramientas, UI, responsive/RTL, rendimiento o hardware.
- Pedro: **0 pruebas nuevas**, P-001–P-008 pendientes, 0 FALLA. Próximo v9 por familia de cantidades críticas;
  no masiva ni fase 0. Capacidad Pages y 37 idiomas siguen abiertos. [Informe y limpieza](lotes/2026-10-21-piloto-v7.md).

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
