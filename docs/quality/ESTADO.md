# UsefulVerse · ESTADO (leer primero)

> Relevo operativo. Un solo resumen actual; historial y evidencias en LOG, informes de lotes y Git.

**Última actualización:** 2026-10-27 · **por:** Codex
**Turno actual (candado):** EN CURSO · Codex · 2026-10-27T12:32:29.200026+00:00 · cierre v32/v33 ruso y CI final; sin publicación

## 1. Siguiente paso exacto

**Paso A sigue abierto** en [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`. Las 300 nuevas conservan `indexable:false`: 0 en main, 0 activadas. Las 700 existentes se conservan. Pendientes: capacidad Pages, 37 traducciones revisadas y nb real; no avanzar a fase 0.

Ruso v33: referencias 360/360; ampliado conocido 1566/1566 y 792/792 en las 88 claves fijas. Cero defectos de ida o datos sin prueba en modelo. Cinco reparaciones en este lote (cuatro v32 y una v33); perfil actual: 213 destinos conservados y uno corregido; 214 idas de memoria y cero idas modelo nuevas. Retrotraducciones actuales; 333 registros S/F/B actuales: 279 exactos ya leídos en esta misma sesión y 54 nuevos leídos directamente, con procedencia comprobada; no se declara una revisión independiente. Legacy mantiene sus fallos y no pasa. 905 memorias; 9271 evaluaciones con repeticiones / 156 grupos. Cero idiomas aprobados para publicar. [Informe](lotes/2026-10-27-piloto-v32-v33-ru.md).

**Siguiente paso exacto:** Crear v34 urdu independiente desde translation-pilot/next-v34-ur-plan.json y batch1-v28-candidate-plan.json: 32 candidatas exactas y ocho reparaciones, ninguna importada ni probada por contrato urdu. Test rojo antes de cada arreglo; ligar fuente, hash, contexto, registro y juicio exactos. Mantener las 905 memorias, los 51 archivos medidos, los crudos y todos los juicios históricos. Retirar solo variantes con negativo emparejado. Probar datos del urdu en textos completos y fragmentos. Primero 40 referencias y todos sus avisos; solo si pasan, ampliado con las mismas 88 claves y lectura completa de 174 modelo + 92 legacy, también fuera de las 88. No repetir v32 (40477109792/40478376896) ni v33 (40480964445/40502016693). Después los 22 destinos de acceleration-review-batches.json; ha/am/te/gu/ta/mr/sw requieren 80 muestras. No avanzar a fase 0.

**Idiomas:** pasan muestras conocidas es, nb-NO, ko, id, zh-CN, bn y ru. Siete revisados sin pasar: de, fr, pt-BR, ja, hi, ar, ur. Veintidós sin revisión detallada: tr, vi, it, zh-TW, bg, ca, nl, el, ms, pl, sv, th, uk, sw, mr, te, ha, fil, ta, fa, am, gu. Inglés es fuente. Son muestras de tres herramientas; 0/36 destinos aprobados para publicar. [Listado](translation-pilot/language-status-v33.json).

**Verificación:** <!-- V33_CHECK -->CI final pendiente; no se declara verificación completa del lote hasta su resultado.<!-- /V33_CHECK -->

**Producción:** 5 GET y 2 XML: 25.625 URLs; tres rutas inexistentes siguen dando 200 (soft404 pendientes). Sin despliegue, activación ni envío a buscadores. P-001–P-008: ocho pendientes, cero FALLA, sin IDs nuevos. No certificados: revisión nativa/ciega/textos inéditos, motor genérico, UI/dispositivos, responsive/RTL/textos largos/peso, a11y/rendimiento ni puerta de 18 puntos/siete capas.

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
- [ ] Confirmar que la tarjeta de Cloudflare sigue válida (dominio con renovación automática el 28-sep-2027 + Workers Paid mensual).
- [ ] Publicar en Product Hunt, Reddit o directorios cuando el agente deje los textos preparados (fase 7).

## 3. Checklist general

### Planificación
- [x] Plan, estrategia, RUNBOOK y progress.csv; marca Planeta Infinito aprobada · 20-oct.
- [x] Repo público, historial revisado sin secretos, bloqueo de push y acciones fijadas; no debilitar seguridad.
- [x] Respaldo de las 300 recuperable online; fuente con noindex en PR #136, cero en main/activadas.
- [x] Pilotos históricos y regresiones preservados; informes y commits en LOG.md y lotes/.
- [x] V32/v33 ruso: cuatro reparaciones; muestra conocida pasa. Publicación sigue sin aprobar.
- [ ] CI final y retirada efectiva verificadas antes de LIBRE.

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

## 4. Últimos lotes

| Fecha | Lote | Resultado | Evidencia |
|---|---|---|---|
| 27-oct | v32/v33 ruso | Muestra conocida pasa; cuatro reparaciones; relevo compacto | [Informe](lotes/2026-10-27-piloto-v32-v33-ru.md) |
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


**Retirada actual:** pendiente; antes de liberar verificar push, árbol remoto, seis documentos idénticos y recuperación de originales. Evidencias históricas: translation-pilot/remote-v*-verification.json y cli-cache-v*-cleanup.json, en la rama del PR #136.
