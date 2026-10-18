# Plan de expansión a 600 herramientas · 2026-10-07

## Estado actual de la base para 300 herramientas · 2026-10-19

- `main` incluye la reconstrucción editable de las 106 páginas públicas y los arreglos del mezclador de colores y el planificador de reuniones. La reconstrucción se hizo desde activos publicados; no se encontraron los módulos originales previos al build.
- El hub está publicado en Cloudflare Pages en `tools.usefulverse.com` (deploy `d200c441`, código `18a8dbc`). Su sitemap mantiene **15.365 URLs**; la comparación de la versión compilada con producción dio 0 URLs faltantes y 0 adicionales. El sitemap principal conserva **10.260 URLs**.
- QA Chrome cubrió las 106 herramientas en móvil, tableta y escritorio (318 comprobaciones responsive), 73 ejemplos y 72 acciones primarias. La suite completa pasó **2.595/2.595**; `npm run check` validó el build principal y sus 10.260 URLs; `npm run locale:release-check` pasó en 20 locales.
- El build estático del hub generó 16.230 archivos, todos dentro de los límites revisados de Pages; el archivo más grande mide 14.264.838 bytes. No añade funciones ni APIs de pago. La ruta de verificación de IndexNow responde con la clave configurada.
- El método de traducción y las 300 fichas candidatas están en [`docs/planning/usefulverse-1000-2026-10-19/`](../planning/usefulverse-1000-2026-10-19/). La base está integrada y respaldada; la implementación de esas 300 herramientas aún no ha comenzado.

La integración a `main` quedó en `a52852e` con `[skip ci]`; el código desplegado está en su historial. No se ejecutó GitHub Actions ni se abrió un PR.

## Historial del plan y checkpoints previos

Plan y registro vivo de implementación. Verificación directa del 11-oct-2026: producción tenía **163 herramientas Growth600** (sitemap: **5.904 URLs** = 163 × 36 + 36 portadas) y 277 herramientas originales (sitemap principal: **10.260 URLs**). Reverse Mortgage Calculator (#101) ya figuraba en el sitemap público. Esta rama añadía Car Depreciation Calculator (#118) como herramienta 164 del hub; su build local generaba 5.940 URLs estáticas. Ese estado histórico quedó superado el 19-oct. No confundir una build/PR con indexación.

- [Plan y checklist completo](PLAN-600.md): catálogo protegido de 277, 323 candidatas nuevas, 36 idiomas, fases, contratos y gates.
- [Progreso de implementación](PROGRESS.md): fases verificadas, decisiones, pilotos y siguiente acción para reanudar.
- `research-evidence-2026-10-07-0.json`: coste/ledger, IDs y métricas principales seleccionadas, consultas SERP puntuales.
- Archivos de evidencia `-1.json` a `-6.json`: 1.258 métricas país/query únicas; sin credenciales, cookies o datos de cuenta.
- `dataforseo-responses-2026-10-07.tar.gz`: las 13 respuestas originales de investigación, sus históricos mensuales, ledger y tabla de tarifas. No contiene respuestas de `user_data` ni credenciales; permite verificar datos sin repetir llamadas pagadas.

Coste real DataForSEO: 0,24852 USD. No autoriza nuevas llamadas al reanudar.
260 candidatas tienen al menos 1.000 búsquedas/mes en la query medida US/en; 63 tienen demanda media (260–880/mes). No son visitas garantizadas ni una previsión de CPM.

El inventario URL que sigue se genera desde los sitemaps de build: 10.260 URLs del sitio principal y 5.940 del hub de esta rama. Producción sigue en 5.904 URLs del hub hasta completar este release. Después del deploy, el total esperado es 441 herramientas entre ambos sitios y 16.200 URLs en los dos sitemaps. Publicar no equivale a indexación.

Car Depreciation Calculator (#118) está implementada, localizada estáticamente y validada localmente; falta integrar y publicar. Al completar ese flujo, continuar con la siguiente ficha abierta de `PLAN-600.md`, sin reabrir herramientas ya publicadas, repetir investigación de DataForSEO ni medir PageSpeed/Lighthouse sin petición expresa.

Las casillas de producto permanecen sin marcar hasta que cada herramienta supere C/F/E/X/L/B/P/S. No llamar implementado, probado, traducido, publicado o indexado a lo que solo está planificado. Consultar `PROGRESS.md` antes de cada tanda; no rehacer investigación ni duplicar herramientas.
