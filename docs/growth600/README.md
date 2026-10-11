# Plan de expansión a 600 herramientas · 2026-10-07

Plan y registro vivo de implementación. Verificación directa del 11-oct-2026: producción tiene **164 herramientas Growth600** (sitemap: **5.940 URLs** = 164 × 36 + 36 portadas) y 277 herramientas originales (sitemap principal: **10.260 URLs**), para 441 herramientas y 16.200 URLs combinadas. Car Depreciation Calculator (#118) ya está publicada. Esta rama añade Stock Profit Calculator (#142) y Pension Calculator (#147) como candidatas 165–166; el build local previsto genera **6.012 URLs** (166 × 36 + 36 portadas), aún no está en producción. No confundir una build/PR con indexación.

- [Plan y checklist completo](PLAN-600.md): catálogo protegido de 277, 323 candidatas nuevas, 36 idiomas, fases, contratos y gates.
- [Progreso de implementación](PROGRESS.md): fases verificadas, decisiones, pilotos y siguiente acción para reanudar.
- `research-evidence-2026-10-07-0.json`: coste/ledger, IDs y métricas principales seleccionadas, consultas SERP puntuales.
- Archivos de evidencia `-1.json` a `-6.json`: 1.258 métricas país/query únicas; sin credenciales, cookies o datos de cuenta.
- `dataforseo-responses-2026-10-07.tar.gz`: las 13 respuestas originales de investigación, sus históricos mensuales, ledger y tabla de tarifas. No contiene respuestas de `user_data` ni credenciales; permite verificar datos sin repetir llamadas pagadas.

Coste real DataForSEO: 0,24852 USD. No autoriza nuevas llamadas al reanudar.
260 candidatas tienen al menos 1.000 búsquedas/mes en la query medida US/en; 63 tienen demanda media (260–880/mes). No son visitas garantizadas ni una previsión de CPM.

El inventario URL que sigue se genera desde los sitemaps de build: 10.260 URLs del sitio principal y 6.012 del hub de esta rama. Producción sigue en 5.940 URLs del hub, sin #142 ni #147. Después de publicar ambas, el total esperado es 443 herramientas entre ambos sitios y 16.272 URLs en los dos sitemaps. Publicar no equivale a indexación.

Stock Profit Calculator (#142) y Pension Calculator (#147) se están implementando/localizando en esta rama. Publicar depende de revisar el margen de GitHub Actions y evitar cargos. Continuar con la siguiente ficha abierta de `PLAN-600.md`, sin reabrir herramientas ya publicadas, repetir investigación de DataForSEO ni medir PageSpeed/Lighthouse sin petición expresa.

Las casillas de producto permanecen sin marcar hasta que cada herramienta supere C/F/E/X/L/B/P/S. No llamar implementado, probado, traducido, publicado o indexado a lo que solo está planificado. Consultar `PROGRESS.md` antes de cada tanda; no rehacer investigación ni duplicar herramientas.
