# UsefulVerse · ESTADO (léelo primero; actualízalo al terminar)

> Archivo de relevo entre agentes (ChatGPT/Codex ↔ Claude). En 1 minuto dice **dónde estamos, qué falta y por dónde
> seguir**, sin analizar la web. Si algo no cuadra con el repo, manda el repo: corrige este archivo.

**Última actualización:** 2026-10-22 · **por:** Codex
**Turno actual (candado):** EN CURSO · Codex · 2026-10-22T18:04:52+07:00 · v14: dos frases Shikaku, referencias y completo ES/NB
Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

---

## 1. Siguiente paso exacto

V14 references: [39768400364](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39768400364), fuente `48e0fcfffa0c19b83a1746c397718f7b9abdd13a`. En curso; recuperar este run antes de relanzar. Sin despliegue ni aprobación.

**V14 EN CURSO:** tests rojos/reproducción de dos fallos v13 completados; política independiente preparada y validada: 87 tests (85 correctos, dos dependencias omitidas), preflight 214/156 y seguridad verdes. Referencias todavía pendientes. No repetir v13. Informe: `docs/quality/lotes/2026-10-22-piloto-v14.md`. Sin despliegue.

1. **Paso A sigue en el [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`.**
   Las 300 fuentes están recuperadas del respaldo privado sin su historial, todas con `indexable:false`,
   fuera de sitemap/hreflang y sin bloqueo robots. Las 700 existentes se conservan.
   **0/300 en main; 0 activadas.** El conjunto con hub excede 20.000 archivos Pages. Faltan 37 traducciones
   revisadas y nb real. La preview antigua no despliega esta rama. No avanzar a fase 0.

   **V13 cerrada:** corrige los 23 fallos de ida v12 mediante memoria exacta antes de inferencia:
   18 claves/23 destinos nuevos; **88 claves/154 destinos** en total, ligados a fuente/hash/contexto.
   Procedencia explícita: la memoria no se atribuye al modelo ni demuestra generalización.
   V2–v12 originales conservados; siete funciones de inferencia iguales por AST a la fuente completa v13.
   Modelos y builds completos solo en Actions estándar, nunca en el Mac.

   [Referencias 39736865789](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39736865789), fuente `717c7aa`:
   ES/NB 360/360; 80 idas/vueltas leídas, 13 registros con avisos y ocho defectos solo de vuelta.
   75/80 idas y 72/80 vueltas idénticas a v12 por hashes; las cinco idas nuevas revisadas directamente.
   [Completo 39737830473](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39737830473), fuente `22e139e`:
   696 nuevos + 160 reanudados = 856 registros; 133 memorias adicionales, 154 entre ambos runs.
   Ambos: 85 tests con dependencias reales, limpieza correcta y cero artefactos.
   Completo: 799,1188 s, conversión 133,6414 s y pico 7.516.772 KiB; no extrapolar a las 300.

   **Todos los 428 candidatos leídos. Las 88 conocidas pasan 792/792 por idioma; el global ampliado sigue bloqueado.**
   ES y NB obtienen 1565/1566 en 174 no-referencias: un defecto leve nuevo de gramática por idioma, fuera de las 88.
   Sin errores observados de botones, cifras o negaciones. El mínimo de estilo de 1/20 sí se cumple;
   el plan ampliado previo exige reparar los defectos observados fuera de la muestra y conserva el bloqueo.
   309/348 idas del completo idénticas a v12 por hashes, 39 cambiadas; vueltas actuales leídas separadamente.
   47 registros con avisos del completo + 13 de referencias reconciliados; 35 + 8 hallazgos de vuelta separados.
   Nueve casos primero rojos (dos ida, siete variantes de vuelta), después 580 fixtures.
   El auditor detecta una coincidencia histórica fuera de muestra por política v9/v11: dos suplementos,
   dos evaluaciones y tres vínculos nuevos por hashes; no reemplazan rúbricas ni gates originales.

   **Inventario: 11.065 registros machine-draft; 3.424 evaluaciones con repeticiones;
   580 fixtures (510 ida/70 vuelta); 0 idiomas aprobados.** Las 120 comparaciones legacy reutilizan
   notas históricas por hashes y no cuentan como evaluaciones nuevas.
   [CI final 39740313985](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39740313985), fuente `d6d4019`
   (árbol idéntico a datos `92c4eea`): 3.045 Node; 85 Python (83 correctos, dos dependencias omitidas).
   Check de 10.260 páginas, 20 locales existentes, hub 217+100+106 y preview verdes. Preview: 11.293 archivos,
   10.800 páginas de herramientas y homes noindex; sitemap indexable vacío. Publicación omitida.
   No certifica las 37 traducciones de las 300, puerta de 18 puntos/siete capas, revisión nativa ni UI/dispositivos.
   Producción GET/XML: 25.625 URLs, hashes de sitemaps estables; tres rutas falsas del hub siguen devolviendo 200.
   Sin despliegue, activación, merge de código a main ni envíos a buscadores.

   **Siguiente exacto:** recuperar la rama del PR #136. No repetir los runs v13 guardados.
   Leer `review-context-v13-full.json`, `regression-v13-evidence.json`, `review-coverage-addenda.json`,
   `automatic-summary.json`, `full-sample-v13-plan.json` y `docs/quality/lotes/2026-10-22-piloto-v13.md`.
   Crear **v14 independiente**, sin editar v2–v13. Corregir por fuente/hash/contexto:

   - ES `shikaku.fields.statusPlaced`: «Se ha añadido rectángulo.» omite «un».
   - NB `shikaku.fields.statusRevealed`: «Start en ny oppgave å spille igjen.» omite «for» ante «å».

   Separar los siete defectos nuevos de vuelta; no alterar idas correctas por ellos.
   Conservar preflight de 214, contrato tipado global/por oración, signos Unicode, cobertura de dígitos,
   coordenadas/versiones/código, 200000 local probado, ambas FAQ de tono completas y auditor con hashes.
   Primero 40 referencias ES/NB y todos sus avisos; solo si pasan ambas, completo con las 88 comparables
   y lectura de los 428 candidatos. Muestra conocida, no ciega; memoria no demuestra calidad en textos nuevos.
   Después, 28 destinos sin revisión, incluidos los siete con 80 muestras ha/am/te/gu/ta/mr/sw.
   Antes, ampliar y probar gramáticas numéricas: hoy solo en/es/nb; las demás bloquean y no se relaja el contrato.
   No congelar motor sin comparación objetiva ni pasar a fase 0 mientras Paso A siga abierto.

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
- [~] Piloto: 11.065 registros, 3.424 evaluaciones, 580 fixtures; v13 referencias 360/360 y 88 conocidas 792/792 por idioma; global ampliado bloqueado por dos leves fuera de las 88. **0 idiomas aprobados** · 2026-10-22

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
