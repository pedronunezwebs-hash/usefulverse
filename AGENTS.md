# AGENTS.md · UsefulVerse

> **Antes de nada lee `docs/quality/ESTADO.md`** (estado, candado de turno y siguiente paso) y `docs/quality/MAPA-REPO.md`
> (estructura del repo). **Al terminar, actualiza `ESTADO.md` y haz push de todo:** nunca dejes trabajo solo en local o en `/tmp`.

Reglas para cualquier agente (Codex, ChatGPT, Claude u otro) que trabaje en este repositorio.
Prevalecen sobre cualquier plan anterior de `docs/` (incluido `docs/growth600/`).

## Catálogo en pausa · decisión del dueño (20-oct-2026)

- **Pausa (no límite definitivo):** por ahora no se crean herramientas ni idiomas nuevos más allá de las 300 ya hechas y de
  la cobertura `nb`. Cuando el sitio se recupere, Pedro podrá reabrir la ampliación con las reglas de `docs/quality/STRATEGY-1M.md`:
  demanda demostrada, puerta de calidad, freno semanal y nada de servidores de pago. Prohibido abrir subdominios nuevos.
  El catálogo queda fijado en las 700 herramientas públicas actuales (277 en `usefulverse.com` y 423 en
  `tools.usefulverse.com`). El programa Growth600 y cualquier plan de expansión quedan **cerrados**.
- El trabajo permitido es **mejorar la calidad** de las herramientas existentes: lógica, UX, contenido propio,
  ejemplos, FAQ, títulos y descripciones, revisión de traducciones, accesibilidad y rendimiento.
- Motivo: el 16-oct-2026 Google retiró del índice casi todo el sitio (de 3.698 a 55 impresiones diarias)
  tras pasar de 306 a ~25.600 URLs en menos de 3 semanas, con traducción automática a escala. No hay acción
  manual. El diagnóstico y el plan completos están en `docs/recovery/README.md`.

## Seguridad (repo PÚBLICO desde el 20-oct-2026)

- El repo es público. **Nunca** se suben claves, tokens, `.env`, cuentas de servicio ni datos personales. GitHub tiene
  activados el escaneo de secretos y el **bloqueo de push con secretos**: si salta, se arregla el commit y nunca se fuerza.
- Los secretos viven **solo** en GitHub → Settings → Secrets. `CLOUDFLARE_API_TOKEN` es un token **solo de Cloudflare
  Pages** (`usefulverse-github-deploy`). Para la migración a Workers (RUNBOOK §4b) se crea otro token mínimo; no se usa
  nunca la llave global.
- Workflows: permisos `contents: read`, acciones fijadas por SHA, nunca `pull_request_target` ni secretos en jobs de
  PR. Los PR de personas externas necesitan aprobación de Pedro. `main` y `backup/*` no se pueden borrar ni sobrescribir.
- **Excepción acotada autorizada por Pedro (28-oct-2026):** la entrega automática de traducciones puede usar `contents: write` únicamente en el job `deliver` de `translation-wave.yml`, para commits sin force a `automation/translation-results` y solo `memory/`, `packages/`, `manifest.json` y `report.json`. Los jobs de modelos mantienen `contents: read`; no escriben código, `main`, `backup/*` ni producción. `translation-watch.yml` puede usar `issues: write` para avisar a Pedro de cambios de estado. No añade colaboradores, apps, secretos ni servicios de pago.
- Solo Pedro tiene permiso de escritura. No añadir colaboradores ni apps con escritura sin su aprobación.

## Pruebas (obligatorio, decisión de Pedro 20-oct-2026)

Ninguna herramienta se da por terminada ni se activa sin pasar las **7 capas de `docs/quality/PRUEBAS.md`** (valores de
referencia con fuente, propiedades, regresión, navegador de extremo a extremo, dispositivos e idiomas, accesibilidad y
rendimiento, y revisión). **Cada error encontrado se convierte en un test permanente.** Lo que no puedas probar
(dispositivo real, cámara, micrófono, permisos, archivos reales, sensaciones) se apunta en
`docs/quality/PRUEBAS-PEDRO.md` con los pasos exactos; Pedro lo prueba y el siguiente agente arregla lo que falle.

## Cómo trabajar

**No se borra ninguna herramienta** (decisión de Pedro, 20-oct-2026). Las casi duplicadas se diferencian; una fusión con 301, solo con su aprobación. Estrategia de crecimiento: `docs/quality/STRATEGY-1M.md`. Niveles de esfuerzo, traducción, piloto automático y anuncios: `docs/quality/REVISION-FINAL.md`. Auditoría de las 700 herramientas (errores, límites, huecos): `docs/quality/AUDITORIA-CATALOGO.md` y `docs/quality/auditoria/`. PDF: `PDF-VS-ILOVEPDF.md` y `PDF-IA.md`.

Ejecuta el trabajo con **`docs/recovery/RUNBOOK.md`** (lotes, puerta de calidad, disco, verificación) y lleva el
estado en `docs/quality/progress.csv`. Plan completo: `docs/quality/PLAN.md`. Marca aprobada: `docs/design/planeta-infinito/`.

## Recuperación SEO: reglas obligatorias

1. Antes de tocar SEO, indexación, sitemap, hreflang o la plantilla, lee `docs/recovery/README.md`.
2. **Decisión del dueño (20-oct-2026): no se aplica `noindex` masivo.** Los 36 idiomas y las 700 herramientas
   siguen indexables. La recuperación se hará **mejorando la calidad en el sitio**, por orden de prioridad
   (`docs/recovery/indexable-core-tools.csv` = orden de trabajo, empezando por las 128 con datos). No añadas
   `noindex` a ninguna página sin aprobación explícita del dueño.
3. **Herramientas nuevas (las 300 hechas con ChatGPT) · decisión del dueño, 20-oct-2026: se suben ya con `noindex` y se
   activan poco a poco.**
   - Se pueden publicar todas ya, pero **cada una nace en `noindex`**: `<meta name="robots" content="noindex, follow">`
     en sus 37 idiomas.
   - Mientras estén en `noindex`: **fuera del sitemap**, **fuera de los `hreflang`** de las páginas indexables, **nunca
     bloqueadas en `robots.txt`** y sin envíos a buscadores. Sí se pueden enlazar desde el sitio y desde «siguiente paso».
   - **Activar** una herramienta (quitar el `noindex`, añadirla al sitemap y a los `hreflang`) solo cuando pase la puerta de
     calidad de `docs/recovery/RUNBOOK.md` §6, con un **máximo de 30 activaciones por semana**. Cada activación se
     anota en `docs/quality/progress.csv` (`estado=activa`).
   - Las 231 de reserva y todo lo que necesite servidor o API de pago, solo con aprobación de Pedro.
4. **Excepción aprobada por el dueño (20-oct-2026): cobertura de 37 idiomas.** Todas las herramientas publicadas
   deben existir en los 37 idiomas definidos. Hoy a 600 les falta el noruego bokmål (`/nb/`: 277 del dominio
   principal y 323 del subdominio). Se puede añadir `nb` a una herramienta **solo cuando esa herramienta ya
   haya pasado la puerta de calidad en inglés**, junto con su traducción, de forma gradual y dentro del
   límite de crecimiento. Es la única ampliación de URLs permitida.
5. Prohibido enviar URLs en masa a buscadores (IndexNow, Naver, Yandex o Google) mientras dure la recuperación.
   Solo se reenvían los sitemaps limpios cuando el dueño lo pida.
6. Solo se publican traducciones de idiomas que hayan pasado el piloto y los controles de `docs/recovery/RUNBOOK.md` §8.
7. Cada PR indica cuántas URLs indexables había antes y después. Si el número sube, el PR necesita la
   aprobación explícita del dueño.
