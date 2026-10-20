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
2. La lista de herramientas indexables y `noindex` la decide el dueño a partir de
   `docs/recovery/indexable-core-tools.csv`. No cambies una herramienta de `noindex` a indexable sin su aprobación.
3. Una página `noindex` nunca aparece en el sitemap ni en los `hreflang` de otras páginas.
4. Prohibido enviar URLs en masa a buscadores (IndexNow, Naver, Yandex o Google) mientras dure la recuperación.
   Solo se reenvían los sitemaps limpios cuando el dueño lo pida.
5. No publicar traducciones automáticas sin revisión en URLs indexables.
6. Cada PR indica cuántas URLs indexables había antes y después. Si el número sube, el PR necesita la
   aprobación explícita del dueño.
