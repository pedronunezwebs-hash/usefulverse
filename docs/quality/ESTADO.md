# UsefulVerse · ESTADO (léelo primero; actualízalo al terminar)

> Archivo de relevo entre agentes (ChatGPT/Codex ↔ Claude). En 1 minuto dice **dónde estamos, qué falta y por dónde
> seguir**, sin analizar la web. Si algo no cuadra con el repo, manda el repo: corrige este archivo.

**Última actualización:** 2026-10-24 · **por:** Codex
**Turno actual (candado):** LIBRE
Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

---

## 1. Siguiente paso exacto


1. **Paso A continúa en el [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`.**
   Las 300 fuentes conservan `indexable:false`, fuera de sitemap/hreflang y sin bloqueo robots. Las 700 existentes se conservan.
   **0/300 en main; 0 activadas.** Capacidad Pages y 37 traducciones revisadas/nb real pendientes; no avanzar a fase 0.

   **V21 · indonesio: referencias 360/360 y completo conocido 1566/1566:**

   V21 corrige las 50 idas negativas de v20 mediante memoria exacta de fuente/hash/contexto. Conserva los 213 destinos previos: 263 destinos totales, incluidos 58 id. Los inputs controlados, gramática/perfil CLDR v19 y parser global se conservan; id sigue rechazado por el parser global. Catorce funciones de inferencia/gramática iguales por AST y los 13.910 registros anteriores mantienen sus flags con el prefijo original de 891 fixtures. No se cambian políticas, checkpoints ni rúbricas históricas.

   El [primer intento 40069125442](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40069125442), fuente `4f88860864a5f70cb8a7c7d98097d0ff6afe006f`, falló por un test AST nuevo: el formato por defecto de ast.dump difiere entre Python 3.14 del Mac y 3.11 del runner. No produjo registros del piloto y la limpieza pasó. Se añadió primero una regresión roja y se compara ahora la estructura de campos, conservando listas vacías/None y omitiendo solo type_params vacío; los hashes se fijan desde el código original, sin tocar inferencia. Fuente primaria: [Python AST](https://docs.python.org/3/library/ast.html#ast.dump).

   [Referencias 40069534310](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40069534310), fuente `fb099fce1f3eabde54a82ac0bc004a387c947471`: 67 fuentes/idas/vueltas leídas directamente. Modelo 40: 360/360, pasa; legacy 27: 233/243, rechazado por cinco idas negativas, dos botones y dos controles de marca. Mismas 27 claves: 243/243 frente a 233/243. Se conciliaron 20 registros con avisos (11 modelo/9 legacy) y 17 hallazgos de vuelta (9/8) antes de despachar el completo. Se leyeron también las variantes nuevas, sin inferir notas por detector o vuelta aislada. Gate/notas/fuentes previos al completo preservados; después solo se añadió enlace recíproco de cobertura de avisos.

   [Completo 40070361820](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40070361820), fuente `b7979a85517024ac173ba19720811b60991bfe9e`: 67 crudos reanudados con bytes idénticos y 266 nuevos. Las 333 fuentes/idas/vueltas actuales leídas, incluidas todas las 174 no-referencias modelo y 92 legacy. Mismas 88 claves: 792/792, pasan; ampliado 174: 1566/1566, pasa la muestra conocida, con cero errores de ida observados, botones/cifras/negaciones correctos y ningún fallo oculto fuera de las 88. Son 51 memorias conocidas y 123 inferencias fuera de referencias. Legacy 92: 799/828, rechazado por diez importantes y uno leve. Mismas 92 claves: modelo 828/828 frente a legacy 799/828. No se congela motor ni se aprueba un idioma por esta muestra conocida; no es revisión nativa, ciega o de texto no visto.

   Se conciliaron los 77 registros con avisos del completo (49 modelo/28 legacy) y 73 hallazgos de vuelta (47/26), separados de la calidad de ida. Incluyen yardas→metros, eco→gemas, voces→vocales del alfabeto y pérdida de exactamente una vez; las idas actuales conservan sus sentidos. 39 fixtures nuevas, todas de vuelta (seis en referencias y 33 en completo): primero test rojo con seis y 33 fallos, después verde. Total: 14.243 registros, 5.750 evaluaciones con repeticiones y 930 fixtures (648 ida/282 vuelta). Tres entradas nuevas en el registro de adendas de vuelta, ligadas a hashes, cubren crudos históricos coincidentes. Sus seis entradas previas, las rúbricas/gates originales y los 100 grupos de métricas previos se conservan; 209 archivos anteriores de evidencia permanecen idénticos.

   Suite local final: 138 tests (136 correctos/dos dependencias omitidas) y dos Node de corpus. Siete tests nuevos respecto a v20; memoria primero roja (cinco tests/52 errores), portabilidad AST primero roja (un test/un error) y cobertura actual roja antes de cada grupo de fixtures. Runners reales: 137 tests en las referencias correctas y 138 en completo, anteriores a las 33 fixtures nuevas del completo; la CI final verifica el estado definitivo. INT8 con los mismos hashes v20, limpieza correcta y cero artefactos/publicaciones en todos los intentos. Completo: 327,58 s totales, 122,35 s de conversión y pico 3.712.364 KiB. Modelos y builds completos solo en Actions.

   [CI final 40071558919](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40071558919), fuente `212760583100753802a3528d4ef21c66c4aad061`, correcta: 3.045 Node y 138 Python (136 correctos y dos omitidos por dependencias). Check de 10.260 URLs, puerta de 20 locales existentes, hub 217+100+106 y preview de 11.293 archivos/10.800 herramientas y todas las homes noindex correctos; sitemap indexable 0. Ambas publicaciones y job de modelo omitidos, cero artefactos. No certifica los 37 idiomas.

   Producción GET/XML antes/después: 25.625 URLs sin cambios de estado, bytes o hash; tres rutas falsas del hub siguen 200 (soft404 pendientes de fase 0). Seguridad: Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum; cero secretos tras excluir solo el falso positivo exacto de un objeto Git histórico verificado. Sin despliegue, activación, envío a buscadores ni cambios de src/public; 0/300 en main.

   Inglés es fuente. Pasan muestra completa conocida: español (v15), noruego bokmål (v15), coreano (v18) e indonesio (v21); no son paquetes de las 1.000 herramientas ni idiomas aprobados. Seis destinos conservan revisión histórica sin pasar: alemán, francés, portugués de Brasil, japonés, hindi y árabe. Pendientes de revisión detallada 26: chino simplificado, bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, swahili, marathi, telugu, hausa, filipino, tamil, persa, amárico y gujarati. Los 36 destinos tienen referencias automáticas calculadas: cuatro pasan muestra conocida, seis revisados sin pasar y 26 pendientes; cero idiomas aprobados para publicación.

   Pedro: P-001–P-008 pendientes, cero FALLA y sin IDs nuevos para esta infraestructura. Revisión nativa, UI/dispositivos, visual/responsive/RTL 320–1920, márgenes, peso, accesibilidad y rendimiento no comprobados. Puerta 18/siete capas por herramienta, capacidad Pages y 37 traducciones revisadas/nb real pendientes; no avanzar fase 0. El recibo final de ESTADO/LOG/informe documenta el respaldo remoto y la retirada efectiva al liberar el turno.

   **Siguiente exacto:** Iniciar v22 para zh-CN. Primero reproducir con test rojo el contrato numérico no soportado, fijar fuentes CLDR/licencia por revisión y SHA-256 y añadir una gramática zh-CN versionada por política. Conservar gramática v19, parser global, 263 memorias y todas las políticas/crudos/revisiones/fixtures/adendas anteriores; no ampliar el parser global ni aceptar cifras por defecto. Referencias y todos sus avisos primero; completo solo si pasan, mismas 88 claves y lectura de todas las 174 no-referencias modelo y 92 legacy disponibles. Después los otros 25 destinos aún sin revisión detallada; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15, KO v18 e ID v21; los seis destinos antiguos conservan evidencia histórica sin aprobar. No repetir los runs v21 40069125442, 40069534310 ni 40070361820. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar a fase 0.

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
