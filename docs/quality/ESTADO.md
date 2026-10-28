# UsefulVerse · ESTADO (leer primero)

> Relevo operativo. Un solo resumen actual; historial y evidencias en LOG, informes de lotes y Git.

**Última actualización:** 2026-10-28 · **por:** Codex
**Turno actual (candado):** EN CURSO · Codex · 2026-10-28T08:55:07.119486+00:00 · UI inglesa de los 14 propietarios de mercado; pruebas locales, traductor intacto

Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

**Decisión vigente de Pedro (28-oct): Actions solo para el traductor**, con sus controles/entrega/avisos intactos.
Pruebas/builds/mediciones/deploys de herramientas y webs: local/manual, sin Actions ni contratación/gasto adicional.
Los tres workflows de web están deshabilitados; PR de dependencias automáticas pausadas, alertas de seguridad conservadas.
Objetivo confirmado: `usefulverse.com` como único dominio público, con 301 de `tools.` en el corte validado; todavía no migrado.
[Operación y comprobaciones](lotes/2026-10-28-webs-manuales-traductor-intacto.md). Esta decisión sustituye las referencias previas
que exigían Actions para la web; no modifica la excepción del traductor ni las puertas de calidad.

## 1. Siguiente paso exacto

**Paso A sigue abierto** en [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`. Las 300 nuevas conservan `indexable:false`: 0 en main, 0 activadas. Las 700 existentes se conservan. No avanzar a fase 0 sin verificar Paso A.

**Siguiente paso exacto:** las 14 fuentes de mercado ya están conectadas en `feat/new-tools-batch-1` (42.685 unidades; [lote](lotes/2026-10-28-ui-inglesa-14-mercados.md)). Continuar ahora con la UI inglesa de los **106 recuperados**, empezando por `radical-calculator` según `src/growth600/live-only-106.manifest.json`: inventariar HTML/JS inglés, separar prosa de fórmulas/datos y añadir una fuente reutilizable con regresión previa, sin tocar el motor/umbrales/modelos del traductor. Mantener Paso A abierto y preview separada; no avanzar a fase 0. Preparar después el build único de RUNBOOK §4b sin Actions de web, resolviendo colisiones y verificando plan/coste antes de publicar. Git normal/local manual, ≥10 GB libres/≤2 GB por lote; ninguna activación.

**Pendiente de seguridad antes de publicar:** GitHub mantiene tres alertas abiertas de DOMPurify (crítica/alta/baja); las tres indican 3.4.17 como corregida. Revisar manualmente la PR #135 y sus usos/regresiones, sin Actions de web ni cambios del traductor. Este lote no cambia dependencias ni da esa revisión por hecha. [Registro](market-ui-v1/security-alerts.json).

**Lote UI inglesa (rama de PR, todavía sin publicar):** 14 propietarios dejan de ser solo metadatos: **120 → 106**, todos recuperados; +632 unidades netas y cero cambios de unidades fuera de esos 14. Se arreglan mensajes/ejemplos `undefined` en seis formularios y el asunto de carta fijo en inglés, con regresión previa. **478 pruebas locales** correctas; build parcial 518 páginas/37 locales; **378 muestras Chrome** en siete idiomas/nueve anchos sin overflow ni errores de consola. No se ejecutan los checks globales ni Firefox/WebKit/axe/Lighthouse: ninguna herramienta/idioma aprobado ni despliegue. [Evidencia](market-ui-v1/evidence.json).

**Capacidad medida:** [40652759818](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40652759818), fuente d1a7429: 13 tests, tres builds/gate correctos, 113 s, cero ms facturables/artifacts. El medidor solo lee los builds y escribe un informe separado; una medición correcta no aprueba publicar. Caso posterior del sitemap: 14 tests locales correctos, sin cambio del algoritmo. Presupuesto conservador de Pages Free, no plan real de la cuenta consultado ni modificado. [Datos](capacity-v1/report.json), [evidencia](capacity-v1/evidence.json).

**CI completa de preview resuelta:** [40646366137](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40646366137), fuente 1d67bdf, correcta: 3.053 Node y 448 Python (446 correctas, dos omisiones, cero fallos/errores; 1316,672 s/cuatro procesos). Builds principal/hub y gate de 20 locales existentes correctos. Se comprobaron las 10.800 rutas de preview (300 × 36), su JSON real, noindex, homes y sitemap sin URLs indexables. Se aplicaron 29.934 entradas parciales en 9.448 rutas; 1.052 rutas de destino usaron respaldo inglés íntegro y 238 metadatos largos/sin marca conservaron el inglés. No son herramientas completamente traducidas ni idiomas aprobados. [Recibo](translation-drafts/preflight-v1/evidence.json).

**Traductor autónomo y nueva puerta:** GitHub genera, comprueba significado, aparta dudas, guarda paquetes/checkpoints y reanuda según su controlador. Antes de programar modelos, futuras campañas con trabajo deben pasar `translation-preflight.yml` con el mismo SHA de fuente: 45 pruebas Python y seis Node, bloqueo ante fallo y clasificación por el vigilante. [Prueba real 40648113707](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40648113707) correcta en 24 s, cero ms facturables/cero artifacts. Primera llamada desde una campaña posterior aún no observada. No cambia motores, umbrales ni hashes de política; cinco archivos críticos conservan exactamente sus bytes. Sin APIs pagadas, tokens ChatGPT en ejecución, Codespaces, Containers ni Cloudflare. Main registra workflows; no cambiar `source_ref` a main hasta integrar allí fuentes/runtime.

**Campaña activa:** [40565692987](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40565692987), fuente e8a7cb9, tres vueltas entregadas y cuatro jobs en vuelta 4. Snapshot: 65,955 unidades generadas vigentes, 48,836 auditadas, 23,273 retenidas y 881,116 pendientes; 62,034 entradas exportadas expanden claves repetidas, no frases únicas. Usa su política anterior fijada; el consumo en preview revalida la actual. No cancelarla ni escribir datos por fuera de su publicador. [Contadores](capacity-v1/translation-progress.json), [operación](translation-drafts/README.md).

**Calidad conservada sin promesas absolutas:** veto de los 46 errores conocidos entre 1.586 juicios anteriores, reintento acotado para dudas (máximo dos propuestas) y mismos umbrales. Prueba previa: cuatro de doce dudas rescatadas, ocho retenidas. No se demuestra equivalencia universal con lectura del agente o revisión nativa. El corpus de la rama cubre 1.000 propietarios/42.685 claves/36 destinos; quedan 106 recuperados solo con metadatos. Las 14 fuentes de mercado ya están conectadas, sin certificar todos los literales heredados. Cero destinos aprobados para publicar; nb solo después de la puerta inglesa por herramienta. Pilotos históricos intactos: 35 checkpoints/17.441 registros y 905 memorias.

**Vigilancia:** dos ejecuciones reales por `schedule` acreditadas: 40595965237 y 40616437013. Es el cron del vigilante, sin cadencia/SLA garantizados; el cron diario del controlador de generación todavía no tiene evento observado. Avisos de fin/cancelación y correo a Pedro ya probados (P-009 OK); push del teléfono no comprobado. No garantizar avisos si también falla/desactiva GitHub el vigilante.

**Última comprobación previa de producción (no revalidada en este lote):** cinco GET y dos XML, 25.625 URLs (10.260 + 15.365); tres rutas falsas del hub siguen en 200 (fase 0). En la preview publicada anterior, diez muestras en Chrome: 200/noindex, fuera del sitemap, robots sin bloqueo global y sitemap vacío. El HTTP automatizado recibió 403/1010; el navegador ordinario funcionó sin cambios de seguridad. Esa preview antigua no acredita la versión de esta rama ni las traducciones recién generadas. Cero despliegues, activaciones o envíos. [GET/XML](translation-drafts/preflight-v1/production.json), [navegador](translation-drafts/preflight-v1/existing-preview-browser.json).

**Herramientas y Pedro:** P-001–P-008 son ocho pruebas físicas pendientes, cero FALLA; no una fase «P108». P-009 correo OK, push sin probar. Los ocho IDs se enlazan a sus herramientas en progress.csv. Las pruebas físicas solo se asignan si aplican y el agente no puede reproducirlas; primero se comprueba y arregla lo automatizable. La pasada integral abarca las 1.000, sin pruebas físicas por defecto. Cada herramienta conserva el bucle del RUNBOOK §5, sus 18 controles de §6 y las siete capas de PRUEBAS.md, con pruebas responsive 320–1920, RTL/textos largos, a11y/rendimiento, lógica/contenido/UX y dispositivos. Ninguna herramienta se marca terminada por superar el traductor.

**Orden posterior:** fase 0 (404 real, título home, sitemaps por idioma) + G1 (hash de 106 JS) → fase 0b (26 errores, test antes del arreglo) → unificar dominio (RUNBOOK §4b) → Planeta Infinito y bucle de calidad según progress.csv.

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
- [x] Operación de herramientas/webs sin Actions; excepción explícita del traductor preservada y dominio único confirmado.
- [ ] Confirmar que la tarjeta de Cloudflare sigue válida (dominio con renovación automática el 28-sep-2027 + Workers Paid mensual).
- [ ] Publicar en Product Hunt, Reddit o directorios cuando el agente deje los textos preparados (fase 7).

## 3. Checklist general

### Planificación
- [x] Plan, estrategia, RUNBOOK y progress.csv; marca Planeta Infinito aprobada · 20-oct.
- [x] Repo público, historial revisado sin secretos, bloqueo de push y acciones fijadas; no debilitar seguridad.
- [x] Respaldo de las 300 recuperable online; fuente con noindex en PR #136, cero en main/activadas.
- [x] Pilotos históricos y regresiones preservados; informes y commits en LOG.md y lotes/.
- [x] V32/v33 ruso: cinco reparaciones; muestra conocida pasa. Publicación sigue sin aprobar.
- [x] CI del traductor anterior y retirada efectiva verificadas.
- [x] Adaptador conectado al build aislado: hash/contexto/políticas, respaldo inglés y comprobación del HTML real.
- [x] CI completa del adaptador 40646366137: 3.053 Node/448 Python, dos omisiones; builds, gate y preview correctos.
- [x] Puerta automática previa a modelos: 45 Python/seis Node correctos en Actions; cron del vigilante observado.
- [x] Capacidad medida en Actions; tres salidas separadas dentro del presupuesto, unión hub+300 bloqueada y colisiones documentadas.
- [x] Pruebas físicas solo aplicables; ocho IDs existentes enlazados en progress.csv, sin nuevas pruebas.

### Fase 0 · Arreglos urgentes (RUNBOOK §4)
- [ ] `404.html` en la salida del hub (`dist-growth600`) + test; verificar 404 en `/tools/zzz/`, `/es/zzz/` y `/zzz.html`
- [ ] Título de la home sin «Free» repetido + test de títulos
- [ ] Índice de sitemaps por idioma en ambos hosts
- [ ] Despliegue verificado + sitemaps reenviados

### Pruebas (`docs/quality/PRUEBAS.md`)
- [ ] Infraestructura: Playwright (Chromium, Firefox, WebKit), fast-check, axe, Lighthouse por ejecución local/manual
- [ ] Tests de regresión de los 26 errores de la auditoría (antes de arreglarlos)
- [ ] Revisión semanal local/manual sobre producción, con evidencia y comunicación de fallos
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
- [ ] Vigilancia semanal de la web por método local/manual sin Actions; conservar comprobaciones y evidencia, sin presentarla como servicio activo
- [ ] Aviso de datos caducados + Issue del 2 de enero
- [ ] Activación automática semanal de hasta 30 nuevas ya aprobadas
- [ ] Huecos de anuncio reservados y apagados, CMP certificado preparado, `ads.txt`, privacidad con sección de anuncios
- [ ] 2FA y avisos de facturación revisados
- [ ] **Web terminada** (checklist de REVISION-FINAL §5) → candado `TERMINADO · modo piloto automático`

### Fase 7 · Crecimiento (STRATEGY-1M)
- [ ] Widgets para insertar (enlace `nofollow` de marca) · [ ] PWA · [ ] Juegos diarios con tarjeta para compartir
- [ ] Listados de alternativas (textos preparados) · [ ] Páginas de «alternativa gratuita a X»

## 4. Últimos lotes

| Fecha | Lote | Resultado | Evidencia |
|---|---|---|---|
| 28-oct | UI inglesa de 14 mercados | +632 unidades; seis formularios sin undefined; 478 tests/518 páginas/378 muestras Chrome; sin publicar | [Lote](lotes/2026-10-28-ui-inglesa-14-mercados.md) |
| 28-oct | Capacidad del Paso A | Tres salidas caben separadas; unión de 27.470 archivos excede presupuesto; pruebas físicas aplicables | [Lote](lotes/2026-10-28-capacidad-paso-a.md) |
| 28-oct | Puerta automática del traductor | 51 controles antes de modelos; CI completa de preview resuelta; sin activaciones | [Lote](lotes/2026-10-28-puerta-automatica-traducciones.md) |
| 27-oct | v32/v33 ruso | Muestra conocida pasa; cinco reparaciones; relevo compacto | [Informe](lotes/2026-10-27-piloto-v32-v33-ru.md) |
| 27-oct | v31 ruso | Cuatro defectos pendientes, ya preservados como negativos | [Informe](lotes/2026-10-27-piloto-v31-ru.md) |
| 26-oct | v30 ruso / v29 bengalí | Diagnóstico ruso / muestra bengalí pasa | [Historial](LOG.md) |

Todos los lotes anteriores, sus CI, retiradas y limitaciones siguen en LOG.md, lotes/ y los commits; no releerlos salvo que la tarea los necesite.

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


**Retirada actual:** clon, datos descargados, logs y pycache propios eliminados tras respaldo online verificado; 40.7 GiB libres. [Recibo](translation-drafts/quality-v1/closure.json).

Antes de CI, tras cada recolección: `python3 scripts/localization/pilot-checkpoint-inventory.py --write` y después el mismo comando sin `--write`. Solo actualiza y comprueba inventario/total derivados; no modifica crudos, juicios ni procedencia de los runs.

**Cierre 28-oct verificado:** respaldo online de código/docs/resultados; clon y temporales propios eliminados sin Papelera antes de LIBRE; 42,1 GiB libres. Cuatro jobs de traducción siguen activos en GitHub. Cron registrado, aún sin disparo `schedule` observado; los avisos por fin/cancelación y la mención real sí están probados. [Recibo](translation-drafts/closure-20261028.json).

**Cierre calidad 28-oct:** código, doce semillas y evidencias recuperables online; retirada propia verificada antes de LIBRE. Correo confirmado por Pedro (P-009 OK); ocho pruebas físicas pendientes, cero FALLA y push no probado. La campaña activa continúa y la mejora entra en la siguiente. [Recibo](translation-drafts/quality-v1/closure.json).
