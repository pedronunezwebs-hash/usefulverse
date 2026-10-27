# UsefulVerse · ESTADO (léelo primero; actualízalo al terminar)

> Archivo de relevo entre agentes (ChatGPT/Codex ↔ Claude). En 1 minuto dice **dónde estamos, qué falta y por dónde
> seguir**, sin analizar la web. Si algo no cuadra con el repo, manda el repo: corrige este archivo.

**Última actualización:** 2026-10-27 · **por:** Codex
**Turno actual (candado):** EN CURSO · Codex · 2026-10-27T07:04:07.264092+00:00 · v31 ruso;24 reparaciones, contratos y validación más rápida;sin publicación
Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

---

## 1. Siguiente paso exacto


1. **Paso A sigue en el [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`.** Las300 nuevas conservan `indexable:false`;0/300 en main y0 activadas. Las700 existentes no cambian. Capacidad Pages,37 traducciones revisadas y nb real pendientes: no avanzar a fase0.

   **V31 ru:** V31, ruso: referencias conocidas 360/360; ampliado rechazado con 1562/1.566 y 789/792 en las 88 claves fijas. Leídos los 333 registros actuales de fuente/ida/vuelta. Las 214 idas modelo son memoria revisada, con cero generación nueva de ida; las vueltas son nuevas. Modelo ampliado: 4 defectos y 0 datos sin prueba. Legacy ampliado: 805/828, 16 negativas y 1 datos sin prueba; rechazado. Memoria:905 textos. Historial:16.775 registros,8.605 evaluaciones con repeticiones en148 grupos y1507casos permanentes.0idiomas aprobados para publicar. [Informe](lotes/2026-10-27-piloto-v31-ru.md).

   **Siguiente paso exacto:** Preparar v32 ruso independiente desde next-v32-ru-plan.json y retired-memory-v31.json:210positivas actuales y4retiradas explícitas,con cuatro borradores probados por datos pero no importados. Mantener el snapshot905y sus juicios históricos;en el perfil nuevo retirar solo las cuatro variantes con su negativo actual emparejado. Preparar v32 ruso independiente para resolver las filas negativas o datos sin prueba de review-context-v31-full*.json. Conservar905memorias y todos los33archivos medidos,datos y pruebas. Tests rojos antes de arreglos,referencias y avisos antes del ampliado condicional. No repetir los runs40466449927/40467626526. Paso A sigue abierto por capacidad Pages,37traducciones revisadas y nb real;no avanzar a fase0.

   **Idiomas:** Pasan muestras completas conocidas: es, nb-NO, ko, id, zh-CN, bn. Revisados sin pasar(8): de, fr, pt-BR, ja, hi, ar, ru, ur. Pendientes de revisión detallada(22): tr, vi, it, zh-TW, bg, ca, nl, el, ms, pl, sv, th, uk, sw, mr, te, ha, fil, ta, fa, am, gu. Inglés es fuente. Muestras de tres herramientas,no1.000herramientas traducidas;0/36destinos aprobados para publicar. [Listado](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/translation-pilot/language-status-v31.json).

   **Verificación:** CI final [40472276030](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40472276030),fuente`1b0ace0cede22b40a71ccf81fa8ce89788125ceb`,correcta:3045Node y377Python(375correctas,dos omisiones opcionales),1113.394s Python. Cada ID ejecutado una vez. Principal9972páginas+36homes/sitemap10260URLs;gate20locales existentes correcto. Hub217Growth+100mercado+106editables;Growth7848páginas/8253archivos. Preview11293archivos,10800páginas y todas sus homes noindex;sitemap0URLs indexables.36locales,no acredita37. Modelo/publicaciones omitidos,0artefactos. Producción5GET/2XML idénticos al inicio,25625URLs;tres soft404 siguen200. Gitleaks sin hallazgos nuevos. Respaldo y retirada efectiva aún pendientes; candado EN CURSO.

2. **Fase 0** del RUNBOOK §4 + **caché con hash de los 106 JS** (AUDITORIA-CATALOGO G1) + **fase 0b**:
   los 26 errores confirmados de `AUDITORIA-CATALOGO.md` §2, primero test y después arreglo.
   Fase 0:404 real en `tools.usefulverse.com`, título de la home e índice de sitemaps por idioma.
3. **Unificar en un solo sitio** (RUNBOOK §4b): Worker de Static Assets y 301 de `tools.`→`usefulverse.com`.
4. Después: diseño «Planeta Infinito» y bucle de calidad RUNBOOK §5, en orden de `progress.csv`.

## 2. Pendiente de Pedro (decisiones o acciones humanas)

- [ ] **Pruebas para Pedro: 8 pendientes · 0 fallos abiertos** → `docs/quality/PRUEBAS-PEDRO.md` (móvil real, cámara, micrófono, altavoces…)

- [x] Limpieza de `/tmp` hecha el 20-oct con el OK de Pedro: 18 GB liberados (154 carpetas y archivos de usefulverse). Antes se
      respaldaron los restos sin commit de 5 reconstrucciones y 73 archivos de estado en el repo **privado**
      `usefulverse-300-worktree-backup-20261020` (ramas `backup/tmp-*`). Disco: 34 → 52 GB libres de copias temporales antiguas de UsefulVerse en `/tmp` (builds `merged-release-…`,
      `reconstruction…`, caché de MADLAD de 3,3 GB…), dejadas por sesiones del 17-19 oct. **No borrar
      `/tmp/usefulverse-300-implementation-20261019` hasta que su rama esté en GitHub.**
- [ ] Fichas de coste de las herramientas nuevas que necesiten servidor o API (test de velocidad, tiempo, chat de IA…), cuando aparezcan.
- [x] Dónde ejecutar la traducción masiva → **repo público + GitHub Actions** (decidido el 20-oct-2026)
- [ ] Opcional: revocar en Cloudflare el token antiguo que usaba el repo antes del 20-oct, si no lo usa nada más (hay varios
      tokens de Zenith y Joseph en la misma cuenta: no tocar sin identificarlo).
- [ ] Confirmar que la tarjeta de Cloudflare sigue válida (dominio con renovación automática el 28-sep-2027 + Workers Paid mensual).
- [ ] Publicar en Product Hunt, Reddit o directorios cuando el agente deje los textos preparados (fase 7).

## 3. Checklist general (marcar con [x] y fecha)

### Planificación
- [x] V31 ruso: V31, ruso: referencias conocidas 360/360; ampliado rechazado con 1562/1.566 y 789/792 en las 88 claves fijas. Leídos los 333 registros actuales de fuente/ida/vuelta. Las 214 idas modelo son memoria revisada, con cero generación nueva de ida; las vueltas son nuevas. Modelo ampliado: 4 defectos y 0 datos sin prueba. Legacy ampliado: 805/828, 16 negativas y 1 datos sin prueba; rechazado. Memoria:905 textos. Historial:16.775 registros,8.605 evaluaciones con repeticiones en148 grupos y1507casos permanentes.0idiomas aprobados para publicar. CI final [40472276030](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40472276030),fuente`1b0ace0cede22b40a71ccf81fa8ce89788125ceb`,correcta:3045Node y377Python(375correctas,dos omisiones opcionales),1113.394s Python. Cada ID ejecutado una vez. Principal9972páginas+36homes/sitemap10260URLs;gate20locales existentes correcto. Hub217Growth+100mercado+106editables;Growth7848páginas/8253archivos. Preview11293archivos,10800páginas y todas sus homes noindex;sitemap0URLs indexables.36locales,no acredita37. Modelo/publicaciones omitidos,0artefactos. Producción5GET/2XML idénticos al inicio,25625URLs;tres soft404 siguen200. Gitleaks sin hallazgos nuevos. Respaldo y retirada efectiva aún pendientes; candado EN CURSO. ·2026-10-27.
- [x] V30 ruso: V30, ruso: referencias conocidas 360/360; ampliado rechazado, 1504/1.566 y 763/792 en las 88 claves fijas. Leídos los 333 registros actuales de fuente/ida/vuelta: 40 referencias de memoria, 174 idas modelo nuevas y 119 legacy (27 de referencia y 92 ampliadas). Modelo ampliado: 33 idas con defectos y seis datos sin prueba, con solapamiento en limits. Legacy ampliado: 807/828, 14 negativas y un dato sin prueba. Hay 731 textos en memoria, 16.442 registros, 8.272 evaluaciones con repeticiones en 144 grupos y 1484 casos permanentes (1.403 globales, 14 de vuelta v29 y 67 v30). Cero idiomas aprobados para publicar. CI final [40324945714](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40324945714), fuente `0159802ac2f59186e13030abfd635b0e1e480afa`, correcta: 3.045 Node y 363 Python (361 correctas y dos omisiones por dependencias opcionales); Python 893.794 s. Principal: 9.972 páginas de herramientas, 36 homes y 10.260 URLs en sitemap. Gate de 20 locales existentes correcto. Hub: 217 herramientas Growth, 100 de mercado y 106 recuperadas editables. Growth: 7.848 páginas y 8.253 archivos. Preview: 11.293 archivos, 10.800 páginas de herramientas y todas sus homes en noindex, cero URLs indexables. Son 36 locales: no acredita 37. Modelo y publicaciones omitidos; cero artefactos. Producción: cinco GET y dos XML idénticos al inicio, 25.625 URLs; tres soft404 siguen dando 200. Gitleaks sin hallazgos nuevos. Respaldo y retirada efectiva verificados; candado LIBRE. ·2026-10-26.
- [x] V29 bengalí: V29, bengalí: referencias conocidas 360/360; muestra ampliada pasa con 1566/1.566 y 792/792 en las 88 claves fijas. Se leyeron las 333 fuentes, idas y vueltas actuales. Hay 0 idas modelo con defectos y 0 datos sin prueba. Legacy: 812/828, 8 idas negativas y 16 datos sin prueba; rechazado. Memoria: 691 textos, incluidos 214 bn. Historial: 16.109 registros, 7.939 evaluaciones con repeticiones en 140 grupos y 1.417 casos permanentes (1.403 globales y 14 de vuelta ligados a la ida). Cero idiomas aprobados para publicar. CI final [40289374472](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40289374472), fuente `66fc8069997e97d6c385ef690d501d7523d93597`, correcta: 3.045 Node y 346 Python (344 correctas y dos omisiones por dependencias opcionales); Python, 932.653 s. Build principal: 9.972 páginas y 36 homes; sitemap de 10.260 URLs. Gate de los 20 locales existentes correcto. Hub: 217 herramientas Growth, 100 de mercado y 106 recuperadas editables; Growth genera 7.848 páginas y 8.253 archivos. Preview: 11.293 archivos y 10.800 páginas de herramientas con todas sus homes en noindex, cero URLs indexables; 36 locales, sin acreditar 37. Modelo y ambas publicaciones omitidos; cero artefactos. Producción: cinco GET y dos XML idénticos al inicio, 25.625 URLs; tres soft404 siguen devolviendo 200. Gitleaks sin hallazgos nuevos y Actionlint 1.7.12 correcto. Corrección posterior de metadatos: el contador de políticas pasa de 27 a 28, con un test permanente primero rojo y después verde en local; inventario actual 347 tests, de los que 346 corresponden a esta CI. Traducciones/runtime y sus pruebas originales permanecen iguales. Respaldo y retirada efectiva verificados; candado LIBRE. ·2026-10-26.
- [x] V28 bengalí: referencias conocidas360/360; ampliado rechazado1460/1566 (88 fijas696/792),41 idas modelo con defectos y23 variantes de datos sin prueba. Leídos333 registros S/F/B; legacy ampliado812/828,8 negativas y24 datos sin prueba.517 memorias actuales;15776 registros,7606 evaluaciones con repeticiones/136 grupos y1403 fixtures.0 idiomas aprobados. ·2026-10-26. CI final[40274336760](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40274336760), fuente`a56790699da358cc0331902051b42debcd6dbf65`, correcta:3045 Node y327 Python(325 correctas,2 omisiones por dependencias), Python1177.897s.38 tests enfocados correctos; gitleaks sin secretos nuevos. Build principal9972 páginas+36 homes/10260 URLs; gate20 locales existentes; hub217 herramientas Growth+100 mercado+106 recuperadas editables; Growth7848 páginas/8253 archivos. Preview11293 archivos/10800 páginas y todas las homes noindex,0 URLs indexables;36 locales, no acredita37. Modelo y ambas publicaciones omitidos;0 artefactos. Producción:5 GET y2 XML comparados con el inicio, mismos estados/bytes/SHA256,25625 URLs;3 soft404 siguen200. No UI/dispositivos/índice Google certificados.0 deploys/activaciones/envíos. Relevo y retirada efectiva verificados; candado LIBRE.
- [x] Lote bn/ru/ur:402 registros S/F/B existentes leídos directamente,321 juicios de ida y9 revisiones negativas independientes. MADLAD:bn341/360,ru346/360,ur311/360; referencias rechazadas, ampliado no ejecutado.106/120 frases lingüísticamente reutilizables pendientes de prueba v28;14 requieren corrección (3bn,3ru,8ur).183 fixtures nuevas,1334 totales;15443 registros sin nuevas inferencias y7271 evaluaciones con repeticiones/131 grupos.0 idiomas aprobados. ·2026-10-26.
- [x] Aceleración: los 15.443 registros conservan exactamente todos sus indicadores. Benchmark local con cProfile: 51,77→29,34 s (1,76×); aperturas reales de archivo: 432.950→33. Cachés acotadas en RAM y casos de corrupción conservados. Los25 destinos que estaban pendientes tienen nueve lotes preparados;bn/ru/ur ya revisados;quedan22. Estos lotes cuentan con evidencia existente; cero inferencia nueva y cero idiomas aprobados. ·2026-10-26.
- [x] V27: la muestra china con memoria revisada pasa referencias (360/360) y ampliado (1.566/1.566; 88 claves fijas: 792/792). Hay 477 traducciones en memoria, 214 en chino; cero generación nueva de ida. Legacy: 778/828 y 25 negativas. Historial: 15.443 registros, 6.950 evaluaciones con repeticiones y 1.151 fixtures. Cero idiomas aprobados para publicar. ·2026-10-25.
- [x] V26: nueve correcciones/pruebas finitas y334 memorias; zh-CN referencias360/360 lingüístico, gate bloqueado por1cantidad sin prueba en shikaku.example; completo NO ejecutado. Legacy223/243 y8negativas.15.110 registros/6.617 evaluaciones con repeticiones/1146 fixtures.0 idiomas aprobados. ·2026-10-25.
- [x] V25: zh-CN referencias360/360; completo1564/1566 bloqueado por2 leves y7 variantes sin prueba finita (0 graves y0 errores lingüísticos confirmados de cifras/negaciones). Legacy778/828,25 negativas (17 graves/8 leves).15.043 registros/6.550 evaluaciones con repeticiones/1146 fixtures.0 idiomas aprobados para publicar. ·2026-10-25.
- [x] V24: chino simplificado referencias360/360; completo rechazado 1481/1566,50 idas modelo/24 legacy y51 cantidades no probadas;149 fixtures nuevas (1120 totales). CI final40148453347 correcta; respaldo y retirada efectiva verificados ·2026-10-25.

- [x] V23: nueve idas zh-CN corregidas y 16 contratos resueltos; 360/360 lingüístico, gate bloqueado por 1 input completo sin prueba; aceleración gratuita y cuatro regresiones nuevas ·2026-10-24. CI final 40111019015 correcta; retirada efectiva verificada.
- [x] V22 infraestructura/referencias zh-CN revisadas: gate rechazado,37 fixtures y 16 datos no probados separados; completo no ejecutado ·2026-10-24. CI final correcta; retirada efectiva verificada.
- [x] Diagnóstico de la caída del 16-oct (`docs/recovery/README.md`) · 2026-10-20
- [x] Decisiones: sin `noindex` masivo en las 700; 37 idiomas; no se borra ninguna herramienta · 2026-10-20
- [x] Plan de calidad (`docs/quality/PLAN.md`), estrategia hacia 1M visitas al día (`STRATEGY-1M.md`), RUNBOOK y `progress.csv` · 2026-10-20
- [x] Marca «Planeta Infinito» aprobada; prototipo en `docs/design/planeta-infinito/` · 2026-10-20
- [x] **Repo hecho público con seguridad** (20-oct): historial (448 commits), PRs/issues (132) y registros de Actions (369
      ejecuciones) analizados con gitleaks → 0 secretos; token nuevo solo de Pages; escaneo de secretos y bloqueo de push;
      Dependabot; acciones fijadas por SHA; `main` y `backup/*` protegidas; PR externos con aprobación · 2026-10-20
- [x] Copia de seguridad del trabajo de las 300 en `backup/codex-300-tools-20261020` · 2026-10-20
- [x] Fuente completa de las 300 recuperada en rama pública `feat/new-tools-batch-1`, PR #136 (borrador), con noindex explícito y CI verde · 2026-10-20; en `main` y publicadas por este lote: **0 / 300**, activadas: **0**
- [~] Piloto v16 histórico: ko 344/360 y legacy 219/243, referencias rechazadas y completo no ejecutado; 12.844 registros/4.351 evaluaciones/623 fixtures. **0 idiomas aprobados** · 2026-10-23

- [~] Piloto v17: referencias ko 360/360; completo rechazado, 721 fixtures y CI final correcta · 2026-10-23

- [~] Piloto v18: Coreano: referencias 360/360 y completo 1566/1566; CI final verde · 2026-10-23

- [~] Piloto v19: referencias id348/360 y legacy233/243 rechazadas;29 fixtures nuevas, completo no ejecutado;0 idiomas aprobados ·2026-10-24

- [~] Piloto v20: referencias id 360/360; completo rechazado 1454/1566, 130 fixtures nuevas · 2026-10-24

- [~] Piloto v21: indonesio: referencias 360/360 y completo conocido 1566/1566 · 2026-10-24

### Fase 0 · Arreglos urgentes (RUNBOOK §4)
- [ ] `404.html` en la salida del hub (`dist-growth600`) + test; verificar 404 en `/tools/zzz/`, `/es/zzz/` y `/zzz.html`
- [ ] Título de la home sin «Free» repetido + test de títulos
- [ ] Índice de sitemaps por idioma en ambos hosts
- [ ] Despliegue verificado + sitemaps reenviados

### Pruebas (`docs/quality/PRUEBAS.md`)
- [ ] Infraestructura: Playwright (Chromium, Firefox, WebKit), fast-check, axe, Lighthouse CI en Actions
- [ ] Tests de regresión de los 26 errores de la auditoría (antes de arreglarlos)
- [ ] Action semanal sobre producción que abre un Issue si algo falla
- [x] Columnas de pruebas en `progress.csv` · 2026-10-20 (las siete capas de las 300 siguen pendientes)

### Fase 0b · Errores confirmados (`AUDITORIA-CATALOGO.md` §2) · arreglados: **0 / 26**
- [ ] G1 · Hash en los 106 JS de `recovered-live-only-106` (o caché corta)
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
- [~] Paso A: las 300 están en una **vista previa** con `noindex` (`draft-300-noindex.usefulverse-tools.pages.dev`); falta integrarlas en
      `main` y en el sitio unificado con `noindex` · en `main`: **0 / 300**
- Paso B: activadas **0** (máximo 30 por semana) · semana actual: 0 / 30

### Fase 8 · Piloto automático y anuncios (REVISION-FINAL §3-5)
- [ ] Action semanal de vigilancia (URLs, 404, sitemaps, alarma de Search Console → Issue)
- [ ] Aviso de datos caducados + Issue del 2 de enero
- [ ] Activación automática semanal de hasta 30 nuevas ya aprobadas
- [ ] Huecos de anuncio reservados y apagados, CMP certificado preparado, `ads.txt`, privacidad con sección de anuncios
- [ ] 2FA y avisos de facturación revisados
- [ ] **Web terminada** (checklist de REVISION-FINAL §5) → candado `TERMINADO · modo piloto automático`

### Fase 7 · Crecimiento (STRATEGY-1M)
- [ ] Widgets para insertar (enlace `nofollow` de marca) · [ ] PWA · [ ] Juegos diarios con tarjeta para compartir
- [ ] Listados de alternativas (textos preparados) · [ ] Páginas de «alternativa gratuita a X»

## 4. Últimos lotes (el más reciente arriba; detalle en `docs/quality/LOG.md`)

| Fecha | Agente | Qué | PR / commit | Verificado en producción |
|---|---|---|---|---|
| 2026-10-26 | Codex | V30 ruso y aceleración; referencia360/360, ampliado revisado y regresiones | [PR#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136) | 5GET/2XML,25625URLs;sin deploy |
| 2026-10-26 | Codex | V28 bn:refs360/360;completo1460/1566 rechazado,69 fixtures,148 candidatas/26 borradores v29 | [PR#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136),`17c1602` | 5GET/2XML:25625 URLs y3soft404 sin cambios;0deploys. |
|2026-10-26|Codex|Aceleración: los 15.443 registros conservan exactamente todos sus indicadores. Benchmark local con cProfile: 51,77→29,34 s (1,76×); aperturas reales de archivo: 432.950→33. Cachés acotadas en RAM y casos de corrupción conservados. Los25 destinos que estaban pendientes tienen nueve lotes preparados;bn/ru/ur ya revisados;quedan22. Estos lotes cuentan con evidencia existente; cero inferencia nueva y cero idiomas aprobados.|[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136)|GET/XML inicial:25.625 URLs; tres soft404; sin deploy.|
|2026-10-25|Codex|V27: la muestra china con memoria revisada pasa referencias (360/360) y ampliado (1.566/1.566; 88 claves fijas: 792/792). Hay 477 traducciones en memoria, 214 en chino; cero generación nueva de ida. Legacy: 778/828 y 25 negativas. Historial: 15.443 registros, 6.950 evaluaciones con repeticiones y 1.151 fixtures. Cero idiomas aprobados para publicar.|[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136)|GET/XML inicial25.625URLs,3soft404,sin deploy.|
|2026-10-25|Codex|V26: nueve correcciones/pruebas finitas y334 memorias; zh-CN referencias360/360 lingüístico, gate bloqueado por1cantidad sin prueba en shikaku.example; completo NO ejecutado. Legacy223/243 y8negativas.15.110 registros/6.617 evaluaciones con repeticiones/1146 fixtures.0 idiomas aprobados.|[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136)|GET/XML inicial25.625 URLs,hashes idénticos;3soft404,sin deploy.|
|2026-10-25|Codex|V25: referencias360/360; completo1564/1566 y7 variantes sin prueba|[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136)|GET/XML25.625URLs sin cambios; tres soft404;sin deploy.|
|2026-10-25|Codex|V24: contrato inglés resuelto; completo chino rechazado,50 idas y149 fixtures nuevas|[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136)|GET/XML25.625 URLs y hashes sin cambios; tres soft404. Sin deploy.|
|2026-10-24|Codex|V23: zh-CN 360/360, bloqueado por 1 contrato; validación7, 65× y 5/103 fragmentos evitados|[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136)|GET/XML inicial25.625 URLs; tres soft404. Sin deploy.|
|2026-10-24|Codex|V22: zh-CN referencias 344/360 rechazadas;37 fixtures, sin completo|[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136)|GET/XML inicial 25.625 URLs, tres soft 404. Sin deploy.|
| 2026-10-24 | Codex | V21: indonesio: referencias 360/360 y completo conocido 1566/1566 | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136) | GET/XML 25.625 URLs; tres soft404 pendientes. Sin deploy. |
| 2026-10-24 | Codex | V20: referencias id 360/360; completo rechazado 1454/1566, 130 fixtures nuevas | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136) | GET/XML 25.625 URLs; tres soft404 pendientes. Sin deploy. |
| 2026-10-24 | Codex | V19: gramática id versionada,67 textos revisados, referencias rechazadas y29 fixtures nuevas | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136) | GET/XML25.625 URLs; tres soft404 pendientes. Sin deploy. |
| 2026-10-23 | Codex | Coreano: referencias 360/360 y completo 1566/1566; CI final verde | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136) | GET/XML 25.625 URLs; tres soft404 pendientes. Sin deploy. |
| 2026-10-23 | Codex | V17: referencias ko 360/360; completo rechazado, 721 fixtures y CI final correcta | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136) | GET/XML 25.625→25.625 URLs y hashes estables; tres soft404 pendientes. Sin deploy. |
| 2026-10-23 | Codex | V16: gramática ko fijada, 67 referencias leídas; gate rechazado, 38 fixtures nuevas | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `aedd468`…`11b047f` | GET/XML 25.625→25.625 URLs y hashes estables; tres soft 404. Sin deploy. |
| 2026-10-23 | Codex | V15: calco ES corregido; referencias y completo conocidos revisados; 585 fixtures | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `a591e4b`…`5ab99a1` | GET/XML: 25.625 URLs y tres soft 404; sin deploy. |
| 2026-10-22 | Codex | V14: dos Shikaku corregidas, un calco ES pendiente; 428 candidatos leídos, 585 fixtures y retiro histórico explícito | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `48e0fcf`…`2f1b4c2` | GET/XML: 25.625 URLs; tres soft 404. Sin deploy. |
| 2026-10-22 | Codex | V13: 23 fallos corregidos, 428 candidatos leídos; dos leves nuevos bloquean el global ampliado; 580 fixtures | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `717c7aa`…`92c4eea` | GET/XML: 25.625 URLs; tres soft 404. Sin deploy. |
| 2026-10-22 | Codex | V12: 428 candidatos leídos; 88 conocidas pasan y global rechazado por 23 fallos fuera de muestra; 571 fixtures y cobertura histórica con hashes | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `32142e3`…`a427cba` | GET: 25.625→25.625 URLs, tres soft 404; sin deploy. |
| 2026-10-21 | Codex | V11: oraciones completas; referencias pasan, completo rechazado es 785/792 y nb 776/792; 9.353 registros, 2.508 evaluaciones, 525 fixtures | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `fe2acf3`…`aa40244` | GET: 25.625→25.625 URLs, tres soft 404; sin deploy. |
| 2026-10-21 | Codex | V10: unidades completas/contrato tipado;referencias es 358/360 rechazadas por omisión,nb 359/360;8.497 registros,2.251 evaluaciones,512 fixtures;sin completo | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `6d99ba9`…`1dd7f8c` | GET:25.625 URLs,tres soft404;sin deploy. |
| 2026-10-21 | Codex | V9: frases completas para duración/tamaño, auditor de avisos y lectura regional; referencias pasan, completo es/nb rechazado; 8.337 registros, 2.171 evaluaciones, 509 regresiones | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `9b430c3`…`1a963cc` | GET: 25.625 URLs, tres soft404; sin deploy. |
| 2026-10-21 | Codex | V7/v8: cantidades/coordenadas, sentidos técnicos y respuesta explícita; 7.481 registros, 1.914 evaluaciones, 472 regresiones; v8 es añade 10 a 30 segundos y queda bloqueado | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `203422e`…`96c7440` | GET: 25.625 URLs, tres soft 404; sin deploy. |
| 2026-10-21 | Codex | V5/v6: oraciones trazables, datos protegidos y memoria; 7.161 registros, 1.754 evaluaciones, 464 regresiones; completo es/nb rechazado | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `4c477b7`…`bd74b32` | GET: 25.625 URLs y tres soft 404; sin deploy. |
| 2026-10-20 | Codex | Glosario por sentido y memoria exacta; piloto completo es/nb; 6.145 registros, 1.378 evaluaciones, 410 regresiones; 0 idiomas aprobados | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `2c75dc2`…`dfe55ae` | GET: 25.625 URLs y tres soft 404; sin deploy. |
| 2026-10-20 | Codex | Piloto CPU reanudable: 4.809 registros, 642 traducciones evaluadas, 202 regresiones; extracción segura de las 300 | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `46b53ea`…`f8fe929` | GET de sitemaps: 25.625 URLs; tres rutas falsas aún 200. Sin deploy. |
| 2026-10-20 | Codex | Fuente de las 300 + noindex por catálogo + CI de preview aislada; Paso A sin publicar | [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), `7879f9a`, `83efa8a`, `4e8d27c` | Sitemaps: 25.625 URLs; 10 URLs de la preview antigua con noindex. Sin deploy nuevo; soft 404 persiste. |
| 2026-10-20 | Claude | Auditoría de las 700 herramientas (`AUDITORIA-CATALOGO.md` + `auditoria/`) y diseño de PDF con IA (`PDF-IA.md`) | `04099ce` | Web sin cambios |
| 2026-10-20 | Claude | Comparación con iLovePDF (`PDF-VS-ILOVEPDF.md`) | `ae9a27f` | Web sin cambios |
| 2026-10-20 | Claude | Repo público con seguridad (ver checklist) | `5af802b` + ajustes en GitHub y Cloudflare | Web sin cambios |
| 2026-10-20 | Claude | Documentación: diagnóstico, plan, RUNBOOK, estrategia, ESTADO, mapa del repo y copia de seguridad de las 300 | `d938d8b`…, `backup/codex-300-tools-20261020` | Sin cambios en la web |

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

Retirada efectiva el 2026-10-24T13:53:17.067234+07:00: eliminada directamente y sin Papelera solo la carpeta propia `usefulverse-codex-v21-20261024.ls3v43bl`; ruta comprobada ausente. Tamaño previo 551047861 bytes; disco libre posterior 37.7274 GiB (40509452288 bytes). Antes de borrar: 7569 archivos versionados y 562 críticos recuperables mediante árbol Git/índice; seis documentos idénticos, 209 archivos históricos, prefijo 891 y 100 grupos anteriores conservados; estados/slugs/capas de progress y src/public intactos. Código/datos/revisiones/fixtures iguales a CI final 40071558919; solo metadatos posteriores. Cero punteros LFS. Tres runs correctos y un intento previo fallido por test AST, sin inferencia; cuatro sin artefactos ni publicación y con limpieza correcta. Cero ZIP propios externos restantes. 4 ZIP internos retirados con clon, scripts, QA, binarios y cachés. Sin modelos de traducción ni builds completos locales. Fuentes verificadas: feature `89194337d1be0f8b975ef2ca024d0a05042f5db6`, main `dd53bb4108a8fa5d433e39f6c2223a0009e4b7bc`. Candado liberado después de la retirada.

## Cierre v22

Retirada efectiva el 2026-10-24T18:48:55.162410+07:00: eliminada directamente y sin Papelera solo la carpeta propia usefulverse-codex-v22-20261024.pbdcr7j4; ruta comprobada ausente. Tamaño previo 548751808 bytes; disco libre posterior 38.3213 GiB (41147142144 bytes). Antes de borrar: 7595 archivos versionados y 594 críticos recuperables por árbol Git/índice; seis documentos idénticos,229 archivos históricos, prefijo930 y104 grupos anteriores conservados; estados/slugs/capas de progress y src/public intactos. Código/datos/revisiones/fixtures iguales a CI final40090517822; solo metadatos/documentación posteriores, incluida errata editorial explícita. Cero punteros LFS. Dos runs correctos, cero artefactos/publicaciones y limpieza de modelos correcta. Cero ZIP propios externos restantes; 2 ZIP internos retirados con clon, scripts, QA, binarios y cachés. Sin modelos de traducción ni builds completos locales. Fuentes verificadas: feature 58dee9d7fdf5d4036a592b7252f6ea770e600eee, main bd7dd5ab74ae49f22342ac7634eb21f30b2c5455. Candado liberado después de la retirada.

## Cierre v23

Retirada efectiva el 2026-10-24T23:30:33.226240+07:00: eliminada directamente y sin Papelera solo la carpeta propia usefulverse-codex-v23-20261024.ew4x29t7; ruta comprobada ausente. Tamaño lógico previo 552363050 bytes; disco libre posterior 38.0762 GiB (40884035584 bytes). Antes de borrar: 7625 archivos versionados recuperables por árbol Git/índice, seis documentos idénticos, 250 archivos históricos, prefijo 967,106 grupos y nueve adendas conservados; estados/slugs/capas de progress y src/public intactos. Código/datos/revisiones/fixtures iguales a CI final 40111019015; después solo documentación/metadatos. Cero punteros LFS. Dos runs correctos y un intento previo fallido por prueba Unicode sin inferencia; cero artefactos/publicaciones y limpieza de modelos correcta. Cero ZIP propios externos restantes; tres ZIP de Actions internos y un ZIP de biblioteca versionada retirados con el clon propio, scripts, QA, binarios y cachés (originales recuperables en Git). Sin modelos de traducción ni builds completos locales. Fuentes verificadas antes de retirar: feature d96b8535e0d87a098d93187692a971387d945806, main ec2c46110c1050d15e9d35684f772e9c2a4794b0. Candado liberado después de la retirada.

Cierre efectivo v24: 2026-10-25T01:03:28.982275+00:00; raíz propia eliminada directamente y ausencia comprobada antes de LIBRE. Disco libre al cerrar: 44.87GiB; cachés CLI propios de los tres runs:0 residuos. [Evidencia remota](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/translation-pilot/remote-v24-verification.json).


CI final[40168659587](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40168659587), fuente `75fe35402e3dda14984e1273aeccbd34550e57cc`, correcta:3.045 Node y233 Python (231 correctas/dos dependencias omitidas); build principal10.260 URLs, puerta20 locales existentes, hub217+100+106. Preview11.293 archivos/10.800 páginas y todas las homes noindex, sitemap0 indexables;36 locales de preview, no certifica37 idiomas. Ambas publicaciones y modelo omitidos;0 artefactos. GET/XML antes/después:25.625 URLs, mismos estados/bytes/SHA256 de ambos sitemaps y tres rutas falsas; estas siguen200 (soft404, fase0 pendiente). No verifica UI ni índice de Google. Ocho pruebas enfocadas reconstruidas correctas. Respaldo y retirada efectiva se consignan en el recibo final de cierre.


Retirada efectiva v25: 2026-10-25T06:35:20.349228+00:00; raíz propia .usefulverse-v25-cierre-20261025 eliminada directamente y comprobada ausente antes de LIBRE. Disco libre 40.86GiB,0 ZIP propios externos restantes. Originales versionados recuperables por árbol Git; código/datos/revisiones/fixtures iguales a CI final40168659587. Seis documentos sincronizados. Evidencia: docs/quality/translation-pilot/remote-v25-verification.json y cli-cache-v25-cleanup.json.

CI inicial40245562940: error de formato en fixtures nuevas (faltaba observed_candidate), corregido con procedencia exacta por ID. El test histórico y el test de hallazgos pasan sin rebajar comprobaciones; notas/avisos/textos/runtime intactos. Suite completa repetida y correcta en40246599367; el error de formato queda documentado y su prueba histórica se conserva.


CI final[40246599367](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40246599367), fuente`7ec358639d326a2dafdd29e556dd4724a6a34f66`, correcta:3045 Node y308 Python (306 correctas,2 omisiones por dependencias), Python593.43s. Build principal9972 páginas+36 homes/10260 URLs; gate20 locales existentes; hub:217 herramientas Growth,100 de mercado y106 recuperadas editables; buildGrowth7848 páginas/8253 archivos. Preview11293 archivos/10800 páginas y todas las homes noindex,0 URLs indexables;36 locales, no acredita37. Modelo y ambas publicaciones omitidos;0 artefactos.21 tests enfocados correctos y gitleaks sin secretos nuevos. Producción antes/después:5 GET y2 XML con mismos estados/bytes/SHA256,25625 URLs;3 soft404 siguen200. Sin UI/nativo/hardware/responsive/índice Google certificados.0 nuevas pruebas Pedro;P-001–P-008 pendientes.

Recibos: docs/quality/translation-pilot/ci-batch1-verification.json y remote-batch1-verification.json (en la rama del PR). Retirada efectiva ejecutada y verificada, recibo al cierre.

Retirada efectiva: 2026-10-26T00:08:01.808972+00:00; raíz propia .usefulverse-batch-bn-ru-ur-20261026 eliminada y comprobada ausente antes de LIBRE. 7792 archivos versionados cotejados con el árbol remoto; código/datos/revisiones/fixtures iguales a CI final40246599367; solo6 documentos y recibos posteriores. Seis documentos idénticos en main/feature; main solo cambia esos6. Cero cachés/ZIP propios externos restantes; originales recuperables en GitHub. Disco libre 41.76GiB. Evidencia: remote-batch1-verification.json y cli-cache-batch1-cleanup.json (rama del PR#136).

Retirada efectiva v28:2026-10-26T05:54:00.396215+00:00; raíz propia .usefulverse-v28-bn-20261026 eliminada directamente y comprobada ausente antes de LIBRE. 7825 archivos versionados cotejados con el árbol remoto; código/datos/revisiones/fixtures iguales a CI40274336760, después solo seis documentos y recibos.26 borradores recuperables en el informe remoto;517 memorias intactas. Seis documentos sincronizados; main solo cambia esos6. Cero cachés/ZIP propios externos restantes. Disco libre 41.66GiB. Evidencia:remote-v28-verification.json ycli-cache-v28-cleanup.json (rama del PR#136).
