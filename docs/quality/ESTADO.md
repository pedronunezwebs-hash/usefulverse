# UsefulVerse · ESTADO (leer primero)

> Relevo operativo. Un solo resumen actual; historial y evidencias en LOG, informes de lotes y Git.

**Última actualización:** 2026-10-29 · **por:** Codex
**Turno actual (candado):** EN CURSO · Codex · 2026-10-29T05:57:36.845Z · PR143 integrada; preparación visual/funcional y long-tail de date-calculator, sin publicar

Si el candado lleva más de 24 h en `EN CURSO` sin commits nuevos, se considera abandonado: anótalo y continúa.

**Decisión vigente de Pedro (28-oct): Actions solo para el traductor**, con sus controles/entrega/avisos intactos.
Pruebas/builds/mediciones/deploys de herramientas y webs: local/manual, sin Actions ni contratación/gasto adicional.
Los tres workflows de web están deshabilitados; PR de dependencias automáticas pausadas, alertas de seguridad conservadas.
Objetivo confirmado: `usefulverse.com` como único dominio público, con 301 de `tools.` en el corte validado; todavía no migrado.
[Operación y comprobaciones](lotes/2026-10-28-webs-manuales-traductor-intacto.md). Esta decisión sustituye las referencias previas
que exigían Actions para la web; no modifica la excepción del traductor ni las puertas de calidad.

## 1. Siguiente paso exacto

**Paso A inicial del RUNBOOK §7 completado (29-oct):** [PR #136 integrada](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), [merge 6f96ec7](https://github.com/pedronunezwebs-hash/usefulverse/commit/6f96ec7d574aec09ace5b8aff96dbc5c0987df0b). **300 / 300 fuentes en main, 300 subidas-noindex, 0 activadas.** Preview vigente: [draft-300-noindex](https://draft-300-noindex.usefulverse-tools.pages.dev); 11.100 rutas (300 × 37), 36 homes noindex, sitemap vacío, robots sin bloqueo. Diez URLs públicas correctas, siete destinos, sin recursos fallidos. nb conserva inglés explícito, 0 traducciones nb aprobadas. La integración bajo usefulverse.com sigue en §4b, después de fase 0: no se ha cortado ningún dominio ni publicado el candidato unificado. [Entrega y límites](runtime-v1/README.md), [lecturas públicas](runtime-v1/public-preview.json).

**Siguiente paso exacto: entrega de fase 0 + G1**, candidato preparado en [PR #143](https://github.com/pedronunezwebs-hash/usefulverse/pull/143), rama `fix/phase-0-g1` (código base [fdd7c20](https://github.com/pedronunezwebs-hash/usefulverse/commit/fdd7c20e1d1d49361f6500b2482fbba0709402c9)). Cuatro arreglos implementados: 404 del hub, portada sin SEO duplicado, índices por idioma en ambos hosts y namespace por contenido de los 106 JS/dependencias. Suite completa 3.272 Node correcta + 18 regresiones focalizadas finales (solapadas); check principal/gate20 y build completo hub correctos. 10.260 + 15.365 = **25.625 URLs, delta 0**. Pages local confirma 404/caché real; 27 geometrías 320–1920 es/de/ar, axe0 y objetivos44px. Huella máxima muestreada 1.839.490.266 B. [Evidencia, fingerprints y receta](phase-0-v1/README.md). No repetir la investigación ni declarar la fase cerrada: **fuente integrada en main por PR143 (merge e2286d9); publicación pendiente**.

**Publicación pendiente y orden exacto:** un solo despliegue por día Asia/Saigon. La preview del 29-oct ya consumió el de hoy; primero el hub no antes del **30-oct 00:00 +07 (29-oct 17:00 UTC)**; después el principal en otro día, como pronto **31-oct 00:00 +07**. Partir de main (PR143 integrada), revisar/reconstruir el candidato desde su fuente remota con ≥10GB libres/≤2GB de huella; comprobar coste/cuota/Direct Upload antes de cada publicación. Verificar en vivo las tres rutas falsas, la URL/caché de JS, título y todos los feeds sin crecimiento; reenviar solo los sitemaps limpios. Mantener las 300 noindex y el traductor intacto. **No publicar cambios de fases posteriores ni declarar fase 0 superada hasta verificar los dos hosts. La preparación local en ramas separadas sí está autorizada por la decisión del 29-oct siguiente.**

**Pruebas de entrega:** **3.255 Node, cero fallos/omisiones**; 47 de entrega/composición incluidas. npm run check principal y gate de 20 idiomas existentes repetidos/correctos. Runtime Static Assets real local: 93 checks HTTP/32 páginas (cabeceras/caché/404/redirects/query). axe 4.14: cero infracciones A/AA en 32 páginas; 104 comprobaciones de tareas correctas. Lighthouse móvil 13.6: cinco muestras 100/100/100, LCP 756–1.075 ms, CLS/TBT 0. Traza separada CPU×4/Slow4G: LCP 1.292 ms/CLS0. Teclado y sanitización DOMPurify correctos; no se certifica INP, Firefox/WebKit, hardware ni las siete capas de las 1.000. **Ninguna herramienta/idioma se da por terminado.** [Evidencia](runtime-v1/README.md).

**Composición futura ya comprobada:** 700+300, 38.817 archivos/1.425.287.923 B, 25.300 rutas existentes indexables y 11.100 nuevas noindex. Sitemap candidato: 25.589 canónicas al deduplicar 36 homes de los 25.625 URLs fuente; ninguna herramienta/slug eliminado. 37 homes existentes y 327 auxiliares nuevas noindex; directorio paginado con búsqueda completa bajo demanda, máxima home 10.024 B Brotli. Proyección máxima 1.996.857.176 B. No repetir esta investigación ni juntar tres árboles crudos y otra copia. [Receta secuencial](sequential-v1/README.md).

**Producción existente conservada:** los dos despliegues de las 700 siguen exactamente en sus versiones del 18-oct; contador 200/sin noindex y tools./tools/zzz/ aún 200 con home. Fase 0 pendiente. 25.625 URLs indexables públicas documentadas, delta de este lote 0; las 11.100 de preview no se indexan. La preview tiene canonical tools. hasta el corte posterior; no es el sitio único. [Huella de despliegue](runtime-v1/deployment.json).

**Seguridad:** main ya contiene DOMPurify 3.4.17 y URL vendor corregida; GitHub devuelve cero alertas abiertas tras actualizar el grafo. Los sitios existentes conservan la versión anterior hasta el próximo despliegue verificado. PR #135 permanece abierta, sin cierre manual. GitHub ejecutó automáticamente update-graph 40792857131 al merge: 0 ms facturables; no fue un build/test/deploy de web ni una ejecución manual. Los tres workflows web siguen deshabilitados.

**Traductor:** la campaña 40565692987 terminó correctamente; 40658885003 continúa automáticamente (último sondeo: cuatro jobs en vuelta 2). El aviso #141 de 28-oct 21:28 Asia/Saigon corresponde a esa segunda tanda mientras esperaba; coincide con lo comunicado por Pedro. Siete workflows activos conservan exactamente sus bytes; modelos/política/memoria/campañas no reconfigurados ni cancelados. source_ref sigue apuntando a feat/new-tools-batch-1: conservar esa rama y mantenerla alineada sin force mientras sea fuente; no borrarla al integrar PRs. Fuentes inglesas de las 1.000 (48.403 unidades/0 solo metadatos) ya están en main; 0 destinos de traducción aprobados para publicar. Sin servicio 24/7/SLA garantizado. [Operación](translation-drafts/README.md).

**Pedro:** ocho pruebas físicas P-001–P-008 pendientes, 0 FALLA; P-009 correo OK/push sin comprobar; 0 IDs nuevos. Solo hardware aplicable. Todo el catálogo conserva siete capas/18 controles; subida-noindex no equivale a herramienta terminada.

**Orden posterior:** verificar fase 0 + G1 → fase 0b (26 errores, test antes del arreglo) → unificar dominio §4b → Planeta Infinito y bucle por herramienta según progress.csv.

**Decisión vigente de Pedro (29-oct): avanzar con inteligencia durante la espera.** El límite diario frena publicaciones, no preparar y probar mejoras visuales, funciones, contenido y cobertura de búsquedas en ramas separadas. Se autoriza adelantar ese trabajo sin plataformas SEO/API de pago ni aumento de URLs. Mantener pruebas, noindex de las 300, aprobación del diseño y puertas antes de publicar/cerrar. No convertir la espera de fase 0 en inactividad ni repetir QA ya válido sin cambios.

**Preparación activa:** `date-calculator`, prioridad 1 y nivel A; diseño Planeta Infinito, suma/resta y diferencias de fechas, ejemplos/FAQ y búsquedas de la URL existente. Rama prevista `feat/date-calculator-planeta`. No terminada ni publicada; versiones traducidas actuales preservadas hasta que el nuevo inglés y sus traducciones pasen las puertas.

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
- [x] Respaldo de las 300 online; PR #136 integrada, 300 en main/subidas-noindex y cero activadas. Diez muestras públicas verificadas.
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
- [ ] 404 hub: código/QA local listos en PR143; falta verificar las tres falsas en producción
- [ ] Título de home: código/tests listos en PR143; falta producción
- [ ] Sitemaps por idioma: ambos candidatos verificados, 25.625 URLs/delta0; falta publicar
- [ ] Despliegue verificado + sitemaps reenviados

### Pruebas (`docs/quality/PRUEBAS.md`)
- [ ] Infraestructura: Playwright (Chromium, Firefox, WebKit), fast-check, axe, Lighthouse por ejecución local/manual
- [ ] Tests de regresión de los 26 errores de la auditoría (antes de arreglarlos)
- [ ] Revisión semanal local/manual sobre producción, con evidencia y comunicación de fallos
- [x] Columnas de pruebas en `progress.csv` · 2026-10-20 (las siete capas de las 300 siguen pendientes)

### Fase 0b · Errores confirmados (`AUDITORIA-CATALOGO.md` §2) · arreglados: **0 / 26**
- [ ] G1 · 106 JS/192 dependencias versionados y 3.816 páginas comparadas en PR143; falta entrega/verificación pública
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
- [x] Paso A inicial: 300 en main y preview vigente noindex, 37 rutas por herramienta/diez muestras públicas correctas. Integración en el dominio único pendiente de §4b · en main: **300 / 300**
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
| 29-oct | Entrega inicial del Paso A | PR #136 integrada; preview 300×37 noindex verificada; 3.255 Node/93 HTTP/axe32/Lighthouse5; 0 activaciones | [Lote](lotes/2026-10-29-entrega-inicial-paso-a.md) |
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


**Retirada actual:** Cierre 2026-10-29T00:35:03.889Z: fuente/publicación y árbol remoto verificados; clon, builds, dependencias, descargas y cachés propios retirados antes de LIBRE. 43.32 GiB libres; servidor detenido y pestaña QA en blanco. Paso A inicial completado, 0 activaciones; un despliegue estático, sin cargo adicional. [Recibo](runtime-v1/closure.json).

Antes de CI del traductor, si se recogen checkpoints: `python3 scripts/localization/pilot-checkpoint-inventory.py --write` y después el mismo comando sin `--write`. Actualiza solo inventario/total derivados; no crudos, juicios ni procedencia. No hace falta ejecutarlo para un lote de web sin recolección.
