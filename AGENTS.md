# AGENTS.md · UsefulVerse

Reglas para cualquier agente (Codex, ChatGPT, Claude u otro) que trabaje en este repositorio.
Prevalecen sobre cualquier plan anterior de `docs/` (incluido `docs/growth600/`).

## Catálogo congelado · decisión del dueño (20-oct-2026)

- **Prohibido crear o publicar herramientas nuevas, idiomas nuevos, subdominios o rutas indexables nuevas.**
  El catálogo queda fijado en las 700 herramientas públicas actuales (277 en `usefulverse.com` y 423 en
  `tools.usefulverse.com`). El programa Growth600 y cualquier plan de expansión quedan **cerrados**.
- El trabajo permitido es **mejorar la calidad** de las herramientas existentes: lógica, UX, contenido propio,
  ejemplos, FAQ, títulos y descripciones, revisión de traducciones, accesibilidad y rendimiento.
- Motivo: el 16-oct-2026 Google retiró del índice casi todo el sitio (de 3.698 a 55 impresiones diarias)
  tras pasar de 306 a ~25.600 URLs en menos de 3 semanas, con traducción automática a escala. No hay acción
  manual. El diagnóstico y el plan completos están en `docs/recovery/README.md`.

## Cómo trabajar

Ejecuta el trabajo con **`docs/recovery/RUNBOOK.md`** (lotes, puerta de calidad, disco, verificación) y lleva el
estado en `docs/quality/progress.csv`. Plan completo: `docs/quality/PLAN.md`. Marca aprobada: `docs/design/planeta-infinito/`.

## Recuperación SEO: reglas obligatorias

1. Antes de tocar SEO, indexación, sitemap, hreflang o la plantilla, lee `docs/recovery/README.md`.
2. **Decisión del dueño (20-oct-2026): no se aplica `noindex` masivo.** Los 36 idiomas y las 700 herramientas
   siguen indexables. La recuperación se hará **mejorando la calidad en el sitio**, por orden de prioridad
   (`docs/recovery/indexable-core-tools.csv` = orden de trabajo, empezando por las 128 con datos). No añadas
   `noindex` a ninguna página sin aprobación explícita del dueño.
3. **Herramientas nuevas (de las 300 candidatas, que aún NO están construidas):** cada una se publica completa en cuanto
   pasa la puerta de calidad de `docs/recovery/RUNBOOK.md` §6, con un **freno de 30 herramientas nuevas por semana**.
   Las 231 de reserva y todo lo que necesite servidor o API de pago, solo con aprobación de Pedro.
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
