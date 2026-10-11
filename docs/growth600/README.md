# Plan de expansión a 600 herramientas · 2026-10-07

Plan y registro vivo de implementación. Verificación directa del 11-oct-2026: producción tiene **163 herramientas Growth600** (sitemap: **5.904 URLs** = 163 × 36 + 36 portadas) y 277 herramientas originales (sitemap principal: **10.260 URLs**). Reverse Mortgage Calculator (#101) ya figura en el sitemap público. Esta rama añade Car Depreciation Calculator (#118) como herramienta 164 del hub; su build local genera 5.940 URLs estáticas y todavía no es producción. No confundir una build/PR con indexación.

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
