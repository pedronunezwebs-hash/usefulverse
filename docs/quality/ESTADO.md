# UsefulVerse · ESTADO (léelo primero; actualízalo al terminar)

> Archivo de relevo entre agentes (ChatGPT/Codex ↔ Claude). En 1 minuto dice **dónde estamos, qué falta y por dónde
> seguir**, sin analizar la web. Si algo no cuadra con el repo, manda el repo: corrige este archivo.

**Última actualización:** 2026-10-22 · **por:** Codex
**Turno actual (candado):** EN CURSO · Codex · 2026-10-21 23:39:13 +0700 · Paso A, v12 API/registro/compuestos; referencias es/nb antes del completo
Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

---

## 1. Siguiente paso exacto

1. **Paso A preparado en el PR [#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`.**
   Las 300 fuentes del respaldo privado `usefulverse-300-worktree-backup-20261020`, rama
   `backup/usefulverse-300-implementation` (`27a2f174`), están recuperadas sin historial privado.
   Todas `indexable:false`, fuera de sitemap/hreflang y sin bloqueo robots; 700 existentes preservadas.
   **Paso A abierto: 0/300 en main, 0 activadas.** El conjunto con hub excede 20.000 archivos Pages;
   faltan 37 traducciones revisadas y nb real. No avanzar a fase 0. La preview antigua no despliega esta rama.
   [CI inicial v12](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39730074541), código `32142e3`: 3.045 Node; 80 Python (78 correctos, 2 dependencias omitidas);
   check, 20 locales ampliados existentes, hub y preview verdes. Preview aislada: 11.293 archivos,
   10.800 páginas de herramientas noindex y homes noindex, sitemap indexable vacío. No certifica 37 traducciones,
   puerta 18 puntos ni siete capas de cada herramienta.

   **Piloto: 10.209 registros machine-draft, 2.994 evaluaciones registradas** (con repeticiones),
   **571 fixtures (508 ida, 63 vuelta), 0 idiomas aprobados.** V2–v11 y sus datos/revisiones originales conservados.
   Adendas ligadas a hashes solo añaden defectos posteriores de vuelta, sin cambiar rúbricas ni gates históricos.
   Modelos/builds completos solo en Actions estándar; ninguno en Mac.

   **V11 cerrada:** oraciones completas con datos dentro de la oración, traza de cada entrada y contrato tipado global/por oración.
   Ambas FAQ equivalentes de tono conservan tono bajo→más lento y alto→más rápido; memoria NB de unidades corregida
   por fuente/hash/contexto. [Referencias 39629733667](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39629733667), fuente `fe2acf3`:
   es 360/360 y nb 360/360, 80 idas/vueltas leídas, 14 registros con avisos reconciliados. Solo prerrequisito al completo.
   [Completo 39631325214](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39631325214), fuente `40fef81`: 696 nuevos + 160 reanudados = 856;
   115 memorias entre ambos runs (21+94), sin atribuirlas al modelo. 77 tests con dependencias reales por run,
   limpieza de runners correcta y 0 artefactos. Mismas 68+20 conocidas desde v6; 177 idas/vueltas revisadas,
   167 fuentes/idas idénticas a v9 por hashes y 10 nuevas; 43 registros con avisos más 14 de referencias.
   **Completo rechazado: es 785/792** (7 leves y pérdida del identificador Web Audio), **nb 776/792**
   (4 importantes, 5 leves de concordancia/compuestos). Cero errores en botones/cifras/negaciones en la muestra;
   eso no compensa los demás fallos. 13 regresiones nuevas (4 ida, 9 vuelta) probadas primero en rojo.
   40 comparaciones legacy de muestra y 80 de referencias reutilizan solo puntuaciones históricas por hashes,
   no son nuevas evaluaciones. No se congela motor ni se aprueba idioma.

   **V12: resultado lingüístico cerrado, CI final y relevo pendientes (22-oct).** Política independiente:
   10 claves/16 destinos de memoria exacta nuevos, 70/131 totales. Los 16 fallos v11 están corregidos
   por fuente/hash/contexto y con procedencia de memoria; no se atribuyen al modelo ni demuestran generalización.
   [Referencias 39730087914](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39730087914), fuente `32142e3`:
   es/nb 360/360, 80 idas/vueltas leídas, 14 registros con avisos. [Completo 39730859028](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39730859028),
   fuente `5801f4a`: 696 nuevos + 160 reanudados = 856; 131 memorias entre ambos runs (21+110),
   80 tests con dependencias reales por run, cleanup correcto y cero artefactos. Completo:800,09 s, pico 3.748.548 KiB.
   **Las 88 conocidas pasan: 792/792 en cada idioma. La lectura ampliada de los 428 candidatos rechaza el global:**
   ES 12 fallos (5 importantes, 7 leves), NB 11 (2 importantes, 9 leves), todos fuera de las 88.
   Ejemplos: Home→Hogar, casillas→plazas, volumen→producción, audio→dibujar, títulos ingleses y compuestos/concordancia.
   No se avanzó de fase. 65 registros con avisos de completo + 14 de referencias reconciliados; 34 hallazgos de vuelta
   del completo, separados de la ida. 310/348 fuentes/idas idénticas a v11 por hashes y 38 cambiadas; vueltas releídas.
   46 regresiones nuevas primero rojas (23 ida/23 vuelta), luego 571 fixtures. El test de cobertura detectó
   29 salidas históricas por política v9/v11 antes no revisadas: dos suplementos nuevos, 58 evaluaciones,
   tres vínculos con hashes; los 32 archivos históricos originales intactos. Auditor reforzado con dos tests primero rojos,
   sin permitir reemplazos de rúbrica, gate, política ni aprobación. Suite ligera actual:82 tests (80+2 dependencias).
   Las 120 comparaciones legacy son históricas por hashes (80 referencias +40 completo), no evaluaciones nuevas.
   **0 idiomas aprobados; sin motor congelado, traducción masiva, publicación ni fase 0.**

   **Siguiente exacto dentro del Paso A:** esperar/verificar CI final de los datos y auditor v12; después cerrar
   relevo/candado y borrar el clon propio. Ambos runs ya están recuperados: no repetir v12.
   Para el siguiente lote, crear **v13 independiente**, conservando v2–v12. Leer
   `review-context-v12-full.json`, `regression-v12-evidence.json`, `review-coverage-addenda.json`,
   `automatic-summary.json` y `full-sample-v12-plan.json` en `feat/new-tools-batch-1`.
   Corregir los 23 fallos de ida por familia: navegación Home/Inicio, casillas, nivel de salida, renderizar audio,
   títulos sin inglés residual, registro ES, compuestos y neutro NB; no usar los 23 defectos nuevos de vuelta
   para alterar idas correctas. Memoria solo por fuente/hash/contexto, sin reparar salidas perdidas.
   Conservar contrato tipado/signo Unicode/cobertura de dígitos/preflight214/coordenadas/versiones/código,
   200000 local probado y ambas FAQ de tono completas. Primero 40 referencias por es/nb y todos los avisos;
   solo si ambas pasan, completo con las 88 comparables y lectura de todos los 428 candidatos.
   No es muestra ciega; los 23 fallos fuera de las 88 también deben quedar resueltos antes de pasar el global.
   Después 28 destinos restantes y 80 muestras reforzadas ha/am/te/gu/ta/mr/sw; gramáticas desconocidas bloquean.
   Capacidad Pages y 37 traducciones revisadas pendientes, fuente reextraíble 15.815 unidades;
   slugs/metadatos preservados. Revisión nativa, puerta18/siete capas y UI/dispositivos no realizadas.
   [Informe v12](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-21-piloto-v12.md).

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
- [~] Piloto: 10.209 registros, 2.994 evaluaciones, 571 fixtures; v12 referencias360/360 y 88 conocidas792/792 por idioma, global rechazado al leer todos428 (ES12/NB11 fallos); **0 idiomas aprobados** ·2026-10-22

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
