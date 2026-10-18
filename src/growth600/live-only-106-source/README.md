# Recuperación editable de las 106 herramientas públicas

Las páginas y recursos se recuperaron del HTML y los assets servidos públicamente por https://tools.usefulverse.com. Los controladores JavaScript y estilos CSS propios de cada herramienta se formatearon como archivos editables; sus páginas HTML están organizadas por idioma y ruta.

**No son los módulos originales de autoría.** La búsqueda en Git y en los PRs disponibles no encontró esos fuentes ni source maps. Los bundles conservan la lógica publicada, pero no se pueden recuperar desde ellos los nombres locales, comentarios ni la estructura previa al build.

- `pages/<locale>/tools/<id>/index.html`: HTML publicado por ruta e idioma (el idioma base vive en `pages/tools/<id>/index.html`).
- `assets/recovered-live-only-106/controllers/<id>.js` y `styles/<id>.css`: controladores y estilos editables.
- `assets/recovered-live-only-106/published/`: recursos compartidos, aislados para evitar colisiones con los assets actuales.
- `source-inventory.json`: IDs, sitemap, hashes y rutas de los recursos capturados.

El build importa estas páginas y assets. Compara las ediciones con la captura comprimida `../live-only-106.snapshot.json.gz` y revisa los 36 idiomas antes de publicar.
