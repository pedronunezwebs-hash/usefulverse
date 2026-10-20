# UsefulVerse · Peso mínimo y diseño impecable en cualquier pantalla

20-oct-2026 · Petición de Pedro: que UsefulVerse **pese lo menos posible** y que **todo el diseño tenga márgenes correctos y
sea responsive** en cualquier dispositivo. Es obligatorio y está en la puerta de calidad.

## 1. Peso medido hoy (20-oct-2026, sin comprimir)

| Página | HTML | Total (HTML+CSS+JS) | Lo que sobra |
|---|---|---|---|
| Home `usefulverse.com/` | **217 KB** | 342 KB | La home mete en el HTML el listado y los datos de todas las herramientas |
| Herramienta del dominio (p. ej. percentage) | 35 KB | ~160 KB | `app.js` común de **70 KB** (lógica de muchas herramientas) + `styles.css` de **53 KB** en todas las páginas |
| Herramienta en español | 34 KB | **325 KB** | `locale-es.js` de **167 KB** con los textos de **todas** las herramientas en español |
| `tools.` mortgage-calculator | **96 KB** | 119 KB | Contenido o datos incrustados en el HTML |
| `tools.` norway-income-tax | 85 KB | 138 KB | ~74 KB de JSON con textos de otras herramientas (`data-tool-copy`) + CSS de 47 KB |
| `tools.` hearts-game | 16 KB | 48 KB | Bien: es el modelo a seguir (CSS común + JS propio con hash) |

## 2. Presupuesto de peso (comprimido con Brotli, que Cloudflare aplica solo)

| Recurso | Máximo por página |
|---|---|
| HTML | **≤ 25 KB** (home incluida: el listado completo va paginado, por categorías o cargado al buscar) |
| CSS crítico en línea | ≤ 14 KB; CSS total ≤ 30 KB |
| JS al cargar | **0 KB bloqueante**; el JS de la herramienta ≤ 50 KB y se carga diferido. Las librerías pesadas (PDF, OCR, FFmpeg, IA) solo al usar esa función |
| Textos de idioma | **Solo los de esa herramienta y esa página** (nunca un paquete con todo el sitio) |
| Fuentes | 1 woff2 por escritura, subconjunto, ≤ 40 KB, solo la del idioma de la página |
| Imágenes | AVIF/WebP con `width`/`height` y `loading="lazy"` fuera de la primera pantalla |
| Total de la primera carga | **≤ 120 KB** en una herramienta típica |

## 3. Cómo se consigue (tareas del plan)

1. **Dividir `app.js` y los paquetes de idioma por herramienta** (code splitting con esbuild): cada página carga el
   núcleo común (≤ 15 KB) y **su** módulo. `locale-es.js` (167 KB) pasa a ser un archivo por herramienta y por idioma.
2. **Home ligera:** listado por categorías con enlaces; el buscador carga un índice compacto bajo demanda (JSON con nombre,
   slug y categoría, comprimido) solo al escribir.
3. **Sacar los datos incrustados del HTML** (`data-tool-copy` de 74 KB en market-tools, contenidos repetidos) y cargarlos
   solo si la herramienta los usa.
4. **CSS:** un CSS base pequeño compartido (sistema «Planeta Infinito») + CSS por familia; eliminar reglas sin usar
   (PurgeCSS o el análisis de esbuild); CSS crítico en línea.
5. **Assets con hash en el nombre** y caché larga (resuelve también el G1 de la auditoría). Nada sin hash con `immutable`.
6. **Librerías pesadas solo bajo demanda** y desde el propio sitio (PDF.js, Tesseract, FFmpeg/Mediabunny, ONNX): nunca
   en la carga inicial. Precargar con `<link rel="modulepreload">` solo cuando el usuario empieza a interactuar.
7. **Deduplicar vendor:** una sola copia de cada librería compartida entre el dominio y `tools.` (más fácil tras unificar el
   dominio, RUNBOOK §4b). Eliminar archivos que nadie carga (comprobado con un script que cruza referencias). Así también
   baja el número de archivos frente al límite de 100.000.
8. **Sin terceros** en la carga (ya es así). Los anuncios futuros, después de la interacción y con su espacio reservado.
9. **Test de presupuesto en CI:** el build falla si una página supera el presupuesto (script que mide HTML, CSS y JS por
   página con Brotli) + Lighthouse CI en una muestra. Informe del peso por página en cada PR.

## 4. Diseño responsive y márgenes (puerta obligatoria)

1. **Sistema de espaciado único** (tokens: 4-8-12-16-24-32-48-64 px) y **contenedor** con margen lateral mínimo de
   **16 px en móvil** y ancho máximo de lectura (~70 caracteres por línea). Nada pegado al borde.
2. **Anchos que hay que probar:** 320, 360, 390, 414, 768, 1024, 1280, 1440 y 1920 px, en vertical y horizontal, más
   el zoom del navegador al 200 % (reflujo sin perder contenido).
3. **Sin desbordamiento horizontal** en ninguna página e idioma (test automático: `scrollWidth ≤ innerWidth`).
4. **Zonas táctiles ≥ 44 × 44 px** y separación entre botones; formularios con el teclado correcto (`inputmode`).
5. **Zonas seguras** del iPhone (`env(safe-area-inset-*)`) en barras fijas; nada tapado por la barra del navegador.
6. **Tablas y código anchos** con su propio scroll horizontal (no el de la página); resultados largos con salto de línea.
7. **RTL** (`ar`, `fa`, `ur`) y **textos largos** (`de`, `fi`…) en cada componente; alfabetos altos (tailandés, devanagari)
   sin recortes.
8. **Pruebas visuales:** capturas de Playwright de cada plantilla tipo en los anchos de arriba, comparadas con la versión
   aprobada (regresión visual) en cada PR que toque el diseño. Si algo se mueve sin querer, el PR falla.
9. **Revisión humana:** las capturas en móvil de cada tanda van al PR. Pedro aprueba el sistema de diseño una vez (fase 1),
   y después solo se revisan los cambios.

## 5. Peso del repo de GitHub y de lo que se sube a Cloudflare

### Medido el 20-oct-2026

- **Repo:** 145 MB empaquetado; el árbol actual de `main` ocupa **291 MB** en 6.516 archivos.
- **Lo que más pesa:**

| Qué | Peso | Problema |
|---|---|---|
| `src/growth600/live-only-106-source/` | **95 MB, 4.011 archivos (3.819 HTML)** | Las 106 herramientas «recuperadas» están guardadas como **páginas ya generadas**, no como código fuente: pesan mucho, no se pueden mejorar de forma ordenada y son la causa de la caché sin hash (auditoría G1) |
| `live-only-106.snapshot.json.gz` + `legacy-tools-archive-2026-10-15.tar.gz` | 13,2 + 12,7 MB | El mismo contenido otras dos veces, como copia comprimida |
| `src/growth600/locales/` | 33 MB, 454 archivos | Traducciones generadas en archivos muy grandes |
| `src/locales/` (`plan-language-data.mjs` 6 MB, `opportunity-tools.mjs` 4,8 MB, `generated-opportunity-copy.mjs` 4,5 MB) | 25 MB | Archivos gigantes: **cada pequeño cambio guarda otra copia entera en el historial** (ya hay 3-4 versiones de 3,5-4,5 MB de cada uno) |
| Archivos `.gz` de investigación y `docs/planning/` | ~51 MB en 37 `.gz` + 13,8 MB | Datos de investigación (DataForSEO, evidencias) dentro del código |
| `public/` (OCR 17 MB, modelos ONNX 11,7 MB, wasm 9 MB) | ~40 MB | Necesarios para las herramientas: se mantienen, pero sin copias duplicadas |

### Objetivo y acciones

**Objetivo:** el árbol de `main` pasa de 291 MB a **menos de 80 MB**, y ningún archivo de código supera **500 KB**.

1. **Pasar las 106 herramientas recuperadas a código fuente de verdad** (entradas de catálogo + textos por idioma +
   plantilla común), como el resto. Después se retiran de `main` las 3.819 páginas HTML congeladas y las dos copias
   comprimidas (**−121 MB**). Quedan en el historial y en una rama `archive/live-only-106` por si hiciera falta consultarlas.
   Se hace junto con G1 (caché con hash) y el rediseño, porque toca las mismas páginas.
2. **Investigación fuera del código:** los `.gz`, los JSON de evidencias y `docs/planning/` pasan a **assets de una Release
   de GitHub** («archivo-investigacion-2026-10»; gratis, hasta 2 GB por archivo, no se descargan al clonar). En el repo
   queda solo un índice `.md` con los enlaces.
3. **Traducciones y datos generados divididos** por herramienta y por idioma (lo mismo que pide el peso de las páginas, §3.1).
   Los archivos que se generan con un script **no se suben**: se generan en el build. Archivos pequeños = historial ligero.
4. **Sin duplicados de binarios** (modelos, wasm, OCR): una sola copia compartida por los dos sitios (más fácil tras unificar el
   dominio). Test de CI que falla si se añade un archivo de más de 5 MB sin aprobación o un binario duplicado (mismo hash).
5. **No reescribir el historial** (el repo es público, puede haber forks y `main` está protegida). Los agentes clonan siempre en
   modo ligero (`--depth 1 --filter=blob:none`), así que el historial antiguo no les afecta. Si un día el repo superara 1 GB, se
   valoraría `git filter-repo` con aprobación expresa de Pedro.
6. **Ahorro de GitHub Actions:** el workflow de despliegue ignora los cambios solo de documentación (`paths-ignore: docs/**,
   *.md`); caché de `node_modules` (`actions/setup-node` con `cache: npm`); un solo build por push.
7. **Cloudflare:** los assets estáticos no tienen coste de almacenamiento, pero cuentan para el límite de **100.000 archivos**
   y de **25 MiB por archivo**. Medidas:
   - script que borra de la salida del build todo archivo que ninguna página referencia;
   - nombres con hash, para que Wrangler solo suba lo que cambia;
   - una sola copia de cada librería;
   - informe de número de archivos y peso total en cada PR, con aviso al pasar de 80.000 archivos.
