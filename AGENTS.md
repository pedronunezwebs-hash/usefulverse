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

## Recuperación SEO: reglas obligatorias

1. Antes de tocar SEO, indexación, sitemap, hreflang o la plantilla, lee `docs/recovery/README.md`.
2. **Decisión del dueño (20-oct-2026): no se aplica `noindex` masivo.** Los 36 idiomas y las 700 herramientas
   siguen indexables. La recuperación se hará **mejorando la calidad en el sitio**, por orden de prioridad
   (`docs/recovery/indexable-core-tools.csv` = orden de trabajo, empezando por las 128 con datos). No añadas
   `noindex` a ninguna página sin aprobación explícita del dueño.
3. **Las 300 herramientas preparadas se publican por goteo (decisión del dueño, 20-oct-2026), solo en inglés:**
   - Como máximo **30 herramientas por semana**, empezando por las de mayor potencial de búsqueda.
   - Cada una entra **únicamente en inglés** (una URL por herramienta). Sus otros 36 idiomas se publican más
     tarde, cuando Search Console muestre recuperación estable 3-4 semanas, y también de forma gradual.
   - Antes de publicarla, cada herramienta pasa la **puerta mínima**: funciona en móvil y escritorio (con tests), sin
     límites artificiales, contenido propio (cómo se usa, ejemplos, 6+ FAQ reales), título y descripción únicos y
     verdaderos, schema válido y enlaces a 3 herramientas relacionadas. El rediseño completo llegará después
     con el resto del sitio.
   - Las herramientas de cada tanda van en un único PR, con la lista y el recuento de URLs antes y después.
   - Ningún envío masivo a buscadores: basta con actualizar el sitemap.
4. **Excepción aprobada por el dueño (20-oct-2026): cobertura de 37 idiomas.** Todas las herramientas publicadas
   deben existir en los 37 idiomas definidos. Hoy a 600 les falta el noruego bokmål (`/nb/`: 277 del dominio
   principal y 323 del subdominio). Se puede añadir `nb` a una herramienta **solo cuando esa herramienta ya
   haya pasado la puerta de calidad en inglés**, junto con su traducción, de forma gradual y dentro del
   límite de crecimiento. Es la única ampliación de URLs permitida.
5. Prohibido enviar URLs en masa a buscadores (IndexNow, Naver, Yandex o Google) mientras dure la recuperación.
   Solo se reenvían los sitemaps limpios cuando el dueño lo pida.
6. No publicar traducciones automáticas sin revisión en URLs indexables.
7. Cada PR indica cuántas URLs indexables había antes y después. Si el número sube, el PR necesita la
   aprobación explícita del dueño.
