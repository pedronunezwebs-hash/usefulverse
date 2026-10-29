# UsefulVerse · ESTADO (leer primero)

> Relevo operativo. Un solo resumen actual; historial y evidencias en LOG, informes de lotes y Git.

**Última actualización:** 2026-10-29 · **por:** Codex
**Turno actual (candado):** EN CURSO · Codex · 2026-10-28T18:29:55.353Z · ensayo local Static Assets/cabeceras/a11y; aviso #141 revisado; traductor intacto

Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

**Decisión vigente de Pedro (28-oct): Actions solo para el traductor**, con sus controles/entrega/avisos intactos.
Pruebas/builds/mediciones/deploys de herramientas y webs: local/manual, sin Actions ni contratación/gasto adicional.
Los tres workflows de web están deshabilitados; PR de dependencias automáticas pausadas, alertas de seguridad conservadas.
Objetivo confirmado: `usefulverse.com` como único dominio público, con 301 de `tools.` en el corte validado; todavía no migrado.
[Operación y comprobaciones](lotes/2026-10-28-webs-manuales-traductor-intacto.md). Esta decisión sustituye las referencias previas
que exigían Actions para la web; no modifica la excepción del traductor ni las puertas de calidad.

## 1. Siguiente paso exacto

**Paso A sigue abierto** en [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`. Las 300 conservan `indexable:false`: **0 en main, 0 activadas**. Las 700 existentes conservan indexación. No avanzar a fase 0 ni cortar el dominio antes de la verificación de entrega.

**Siguiente paso exacto:** integrar PR #136 conservando las dos historias/documentación y publicar manualmente la preview estática existente tras verificar la fuente remota. Los checks de runtime/a11y/Lighthouse ya están comprobados en muestras; cerrar con diez lecturas públicas antes de marcar subida-noindex. Contexto anterior: preparar la entrega manual del Paso A desde la fuente final respaldada. La construcción/unión local completa ya está comprobada: no repetir investigación ni traducciones. Revisar cabeceras, redirecciones y fallback en un ensayo local del runtime real de Static Assets (el servidor HTTP usado no los simula), a11y/Lighthouse y muestras de rutas; verificar plan/cuota/coste vigente antes de cualquier publicación. Resolver la entrega sin adelantar el corte de §4b: la preview existente separada tiene 11.593 archivos y la unión 38.817 (no cabe en Pages Free). Integrar código solo con los checks requeridos verdes; mantener los 37 destinos nuevos noindex y verificar diez URLs de la versión entregada antes de registrar `subida-noindex`. No se autoriza nuevo gasto ni se contrata/cambia plan. Traductor intacto; cero Actions de web.

**Entrega · 29-oct en curso:** 3.255 Node finales, check principal/gate20 correctos; 93 checks HTTP del runtime real/32 páginas, axe sin infracciones en 32 páginas y 104 tareas, Lighthouse móvil 100 en tres categorías/cinco muestras. Preview completa reconstruida: 11.100 payloads/37 destinos noindex. Plan/cuota/coste actual comprobados para entrega estática sin cargo adicional; falta integrar la rama y publicar/verificar la preview existente. PR #136 requiere reconciliar el historial de documentación de main; no resolver sobrescribiendo cambios ajenos. [Evidencia](runtime-v1/README.md). Ninguna herramienta/idioma aprobado.

**Lote 29-oct comprobado:** 700+300, **36.400 rutas de herramienta**, 38.817 archivos/1.425.287.923 bytes. 25.300 rutas existentes indexables; **11.100 nuevas noindex** (300 × 37), fuera de sitemap/hreflang y sin bloqueo robots. Las 300 nb son inglés declarado, no traducciones noruegas aprobadas. El sitemap candidato tiene **25.589 canónicas** (25.625 de los dos inputs menos 36 homes duplicadas); no se borra ninguna herramienta ni se cambia slug. 37 homes existentes indexables y 327 páginas auxiliares nuevas de directorio noindex; todas las herramientas conservan enlace estático a través de la paginación. Principal con búsqueda completa bajo demanda; nb conserva su directorio anterior. Máxima home: 10.024 B Brotli. Huella proyectada 1.996.857.176 B; sin superar 2 GB. [Informe](lotes/2026-10-29-construccion-secuencial-paso-a.md), [datos/comandos](sequential-v1/README.md).

**Pruebas:** suite general final **3.251 Node, cero fallos/omisiones**; 43 de composición incluidas, tres Python de dependencias. `npm run check` principal y gate de 20 idiomas existentes correctos; hub completo reanudado/verificado tras corregir la recuperación de rutas con espacios. Chrome: **189 geometrías/53 comprobaciones**, siete idiomas/nueve anchos, más extracción de una imagen PDF sintética. Revisión visual móvil/tablet/escritorio. No Firefox/WebKit, axe/Lighthouse, dispositivos físicos ni auditoría integral de las 1.000; ninguna herramienta/idioma se da por terminado.

**Fallos resueltos en rama:** ruta con espacios/Unicode del recuperador; atributos meta con saltos de línea; guías confundidas con homes; guarda que impide inventar homes indexables desde preview; presupuesto de portadas traducidas mediante paginación. Dos capturas antiguas de home HTML con nombre JS se excluyen solo de la unión mediante hashes/callers fijados; originales intactos y worker PDF real comprobado. Regresiones permanentes y paquetes verificables antes de retirar salidas crudas.

**Seguridad antes de publicar:** DOMPurify 3.4.17 y URL vendor corregidos/probados en esta rama; main/producción siguen con versión anterior. Tres alertas y PR #135 continúan abiertas. No marcar resuelto ni publicar sin integración/QA.

**Producción (lectura, 29-oct):** word-counter 200, canonical propio, sin noindex; tools./tools/zzz/ aún 200 con home (fase 0 pendiente); preview grammar-checker 200/noindex. Esa preview anterior conserva canonical tools.; no es la composición de esta rama. Sin despliegue, corte, activaciones ni envíos a buscadores. Base pública documentada: 25.625 URLs, delta publicado 0; no se releyeron los XML de producción en este lote. [Lecturas](sequential-v1/production.json).

**Traductor intacto:** siete workflows activos, tres workflows de web deshabilitados; campaña 40565692987 observada `in_progress`, siguiente 40658885003 `pending`, vigilante 40706243406 correcto. Sin cancelación/reinicio ni cambios en `.github`, `scripts/localization` o `translation-sources` durante este lote; modelos/memoria/paquetes no tocados. Sin promesa de servicio 24/7 o SLA. [Snapshot](sequential-v1/github-status.json).

**Fuentes de traducción:** 1.000 propietarios/48.403 unidades, 0 solo metadatos; los 14 mercados y 106 recuperados ya están conectados. No es aprobación de todos los literales heredados ni idiomas. 36 destinos de traducción y nb gradual tras puerta inglesa; **0 destinos aprobados para publicar**. Pilotos, negativos/juicios, checkpoints y 905 memorias históricos conservados. GitHub genera/revisa significado/retiene dudas y reanuda; los agentes no releen frases como tarea de rutina. [Operación](translation-drafts/README.md).

**Pedro:** P-001–P-008, ocho pruebas físicas pendientes/0 FALLA; P-009 correo OK/push sin comprobar; **0 IDs nuevos**. Solo se asigna hardware si aplica. Las 1.000 conservan siete capas/18 controles; no existe una fase «P108».

**Orden posterior:** fase 0 (404 real, título home, sitemaps por idioma) + G1 (hash de 106 JS) → fase 0b (26 errores, test antes del arreglo) → unificar dominio (RUNBOOK §4b) → Planeta Infinito y bucle por herramienta según progress.csv.

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

- [x] Copia inglesa centralizada de las 1.000 conectada: 14 mercados y 106 recuperadas; 0 solo metadatos. Literales JS/datos de juegos y calidad integral pendientes.

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
| 29-oct | Construcción secuencial completa | 36.400 rutas; 3.251 Node; 189 geometrías; sin publicar | [Lote](lotes/2026-10-29-construccion-secuencial-paso-a.md) |
| 28-oct | Seguridad y composición local | DOMPurify; 193 Node/108 muestras; unión parcial y home 23,7 KB; sin publicar | [Lote](lotes/2026-10-28-seguridad-y-composicion-paso-a.md) |
| 28-oct | UI inglesa de 106 recuperadas | +5.718 unidades; 0 propietarios solo metadatos; 147 Node/15 Python; motor y web intactos | [Lote](lotes/2026-10-28-ui-inglesa-106-recuperadas.md) |
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


**Retirada actual:** Cierre 2026-10-28T18:25:51.951Z: fuente y árbol remoto verificados en [900621a](https://github.com/pedronunezwebs-hash/usefulverse/commit/900621a9fe95265b40ae38dfd1d05b633354f587); clon, builds, dependencias, descargas y cachés propios eliminados antes de LIBRE. 42.94 GiB libres. Servidores detenidos; pestaña QA en blanco/emulación restablecida. Cero deploy/activaciones/Actions web/Cloudflare; traductor intacto. [Recibo](sequential-v1/closure.json).

Antes de CI del traductor, si se recogen checkpoints: `python3 scripts/localization/pilot-checkpoint-inventory.py --write` y después el mismo comando sin `--write`. Actualiza solo inventario/total derivados; no crudos, juicios ni procedencia. No hace falta ejecutarlo para un lote de web sin recolección.
