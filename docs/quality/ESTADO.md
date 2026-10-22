# UsefulVerse · ESTADO (léelo primero; actualízalo al terminar)

> Archivo de relevo entre agentes (ChatGPT/Codex ↔ Claude). En 1 minuto dice **dónde estamos, qué falta y por dónde
> seguir**, sin analizar la web. Si algo no cuadra con el repo, manda el repo: corrige este archivo.

**Última actualización:** 2026-10-22 · **por:** Codex
**Turno actual (candado):** LIBRE
Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

---

## 1. Siguiente paso exacto

1. **Paso A continúa en el [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`.**
   Las 300 fuentes están recuperadas con `indexable:false`, fuera de sitemap/hreflang y sin bloqueo robots.
   Las 700 existentes se conservan. **0/300 en main; 0 activadas.** Faltan capacidad Pages (>20.000 archivos con el hub),
   37 traducciones revisadas y nb real. La preview antigua no despliega esta rama. No avanzar a fase 0.

   **V14 cerrada:** los dos fallos Shikaku v13 están corregidos por memoria exacta antes de inferencia:
   ES `statusPlaced` incluye «un»; NB `statusRevealed` incluye «for å». Dos claves/destinos nuevos;
   **90 claves/156 destinos** ligados a fuente/hash/contexto. Memoria con procedencia explícita, no calidad atribuida al modelo.
   V2–v14 originales conservados; siete funciones de inferencia iguales por AST a la base v13.

   [Referencias 39768400364](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39768400364), fuente `48e0fcf`:
   ES/NB 360/360; 80 fuentes/idas/vueltas leídas. 14 registros con avisos y nueve defectos solo de vuelta.
   75 idas y 72 vueltas idénticas a v13 por hashes; cinco idas nuevas revisadas. 160 registros y 21 memorias.
   [Completo 39769512465](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39769512465), fuente `08a0498`:
   696 nuevos +160 reanudados =856 registros. 135 memorias adicionales: **156 memorias y 272 idas puras del modelo**.
   Ambos jobs: 87 tests con dependencias reales, limpieza correcta, cero artefactos. Completo: 832,6409 s,
   conversión 106,5998 s, pico 3.777.264 KiB; no extrapolar a las 300.

   **Todos los 428 candidatos actuales leídos.** Las 88 conocidas pasan 792/792 por idioma.
   En 174 no-referencias, ES obtiene **1565/1566** por un calco leve fuera de las 88; NB obtiene **1566/1566**
   y pasa esta muestra conocida. Sin errores observados de botones, cifras o negaciones.
   El mínimo de estilo 1/20 sí se cumple; el plan ampliado previo exige resolver cualquier defecto observado fuera de las 88,
   por eso ES y el conjunto siguen bloqueados. **0 idiomas aprobados**, sin motor congelado ni generalización demostrada.
   332/348 idas y 310/348 vueltas del completo idénticas a v13 por hashes; las 16 idas nuevas y todas las vueltas leídas.
   48 avisos del completo +14 de referencias reconciliados; 37 +9 hallazgos de vuelta separados.

   **Cinco observaciones primero rojas y después fixtures:** un calco de ida ES y cuatro variantes de vuelta.
   Total: **585 (511 ida/74 vuelta)**. Tres evaluaciones históricas nuevas (v6/v9/v11) y tres vínculos de cobertura;
   seis vínculos anteriores intactos. Ocho decisiones históricas adicionales solo de vuelta, con cuatro vínculos nuevos;
   las dos entradas anteriores intactas. La misma ida tenía una nota perfecta en v12: retirada **explícita** con hashes,
   original visible e inmutable, valoración nueva 3/3/2 y bloqueo obligatorio. El gate v12 ya era rechazado y no cambia.
   Dos tests nuevos primero rojos; 30 ataques a procedencia, hashes, fuente/contexto, notas, puntuación, duplicados,
   fixture ausente, aprobación, gates pasados y rutas. No permite mejorar notas ni ocultar una aprobación histórica.

   **Inventario: 11.921 registros machine-draft; 3.856 evaluaciones con repeticiones.** Incluye la reevaluación negativa
   explícita; 120 comparaciones legacy por hashes y ocho decisiones solo de vuelta no se suman como nuevas evaluaciones de ida.
   [CI final 39773203261](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39773203261), fuente `2f1b4c2`:
   **3.045 Node; 89 Python (87 correctos y dos dependencias omitidas)**. La CI inicial 39768406467 pasó 87 Python.
   Check de 10.260 páginas, 20 locales existentes, hub 217+100+106 y preview verdes. Preview: 11.293 archivos,
   10.800 páginas de herramientas y homes noindex, sitemap indexable vacío; publicación omitida, cero artefactos.
   Los jobs de modelo ocurrieron antes de añadir los dos tests del auditor; no se inventa que ejecutaran 89.
   No certifica 37 traducciones de las 300, puerta de 18 puntos/siete capas, revisión nativa ni UI/dispositivos.
   Producción GET/XML: 25.625→25.625 URLs y hashes estables; las tres rutas falsas del hub siguen devolviendo 200.
   Sin deploy, activación, merge de código a main ni envíos a buscadores. Modelos/builds completos solo en Actions estándar.

   **Siguiente exacto:** recuperar la rama y leer `review-context-v14-full.json`, `regression-v14-evidence.json`,
   `review-withdrawal-addenda.json`, `review-coverage-addenda.json`, `review-warning-addenda.json`,
   `automatic-summary.json`, `full-sample-v14-plan.json` y `docs/quality/lotes/2026-10-22-piloto-v14.md`.
   **No repetir los runs v14 guardados.** Crear v15 independiente para ES voice-changer.fields.device: sustituir el calco «procesamiento más suave» por una formulación informática natural («procesamiento más fluido»), por fuente/hash/contexto. Primero reproducción y test; no editar v2–v14. Conservar contratos y el retiro explícito. Referencias ES/NB y todos sus avisos; solo si pasan ambas, completo con las 88 conocidas y lectura de los 428 candidatos. Muestra conocida, no ciega. Después, gramáticas numéricas verificadas y los 28 destinos aún sin revisión, incluidos ha/am/te/gu/ta/mr/sw con 80 muestras. No repetir runs guardados ni pasar a fase 0.
   Antes de ampliar idiomas, verificar sus gramáticas numéricas: hoy solo en/es/nb, las demás bloquean.
   Los otros seis destinos revisados históricamente conservan esa evidencia; no tienen una validación nueva con v14.
   Mantener preflight de 214, datos globales/por oración, signos Unicode, cobertura de dígitos, coordenadas/versiones/código,
   200000 local probado y ambas FAQ de tono completas. No cambiar idas correctas por errores solo de vuelta.

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
- [~] Piloto: 11.921 registros, 3.856 evaluaciones, 585 fixtures; v14 referencias 360/360 y 88 conocidas 792/792; ES ampliado bloqueado por un calco, NB pasa muestra conocida. **0 idiomas aprobados** · 2026-10-22

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
