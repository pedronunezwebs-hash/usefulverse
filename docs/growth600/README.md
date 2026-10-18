# Plan de expansión a 600 herramientas · 2026-10-07

## Base consolidada para la planificación de 300 herramientas · 2026-10-19

- Producción contiene 277 herramientas originales y 423 herramientas en el hub independiente, con 10.260 y 15.365 URLs respectivamente. Se verificó que el sitemap local del hub y el público tienen el mismo conjunto exacto de **15.365 URLs** (cero URLs añadidas o perdidas); los dos sitemaps suman 25.625 URLs únicas.
- Los 106 IDs del hub que faltaban en el catálogo fuente ahora tienen reconstrucción editable desde la publicación: 3.816 HTML, controladores, estilos y recursos. No se halló el código fuente de autoría anterior al build; la reconstrucción no se presenta como el original.
- QA visual en Chrome: 106/106 herramientas en móvil, tableta y escritorio (318 comprobaciones sin overflow). Se cargaron 73 ejemplos y se probaron 72 acciones primarias. Se corrigieron los fallos detectados en mezclador de colores y planificador de reuniones; ambos quedan sin errores de consola.
- PR #131 restaura el sitio con un archivo estático de respaldo; esta rama sustituye esa etapa de build por los 106 archivos recuperados y conserva el mecanismo de clave de IndexNow de PR #132. El build estático no añade APIs, servicios facturables ni dependencia nueva.
- El método de traducción y las 300 fichas candidatas guardadas están en [`docs/planning/usefulverse-1000-2026-10-19/`](../planning/usefulverse-1000-2026-10-19/). No empezar su implementación hasta integrar y respaldar esta base.
- Se validó el build del hub y el sitemap. La suite completa no se repitió en este QA. No implica indexación.

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
