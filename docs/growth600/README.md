# Plan de expansión a 600 herramientas · 2026-10-07

Plan y registro vivo de implementación. Verificación directa previa a este cambio: Absolute Value Calculator (#136) se integró mediante PR #125; el sitemap de producción del hub contiene **5.796 URLs** (160 herramientas Growth600 × 36 idiomas + 36 portadas), junto a las 277 herramientas del sitio principal y sus **10.260 URLs**. Esta rama añade Specific Heat Calculator como herramienta 161 del hub, con 5.832 URLs estáticas; la publicación aún está pendiente. No confundir una build/PR con producción o indexación.

- [Plan y checklist completo](PLAN-600.md): catálogo protegido de 277, 323 candidatas nuevas, 36 idiomas, fases, contratos y gates.
- [Progreso de implementación](PROGRESS.md): fases verificadas, decisiones, pilotos y siguiente acción para reanudar.
- `research-evidence-2026-10-07-0.json`: coste/ledger, IDs y métricas principales seleccionadas, consultas SERP puntuales.
- Archivos de evidencia `-1.json` a `-6.json`: 1.258 métricas país/query únicas; sin credenciales, cookies o datos de cuenta.
- `dataforseo-responses-2026-10-07.tar.gz`: las 13 respuestas originales de investigación, sus históricos mensuales, ledger y tabla de tarifas. No contiene respuestas de `user_data` ni credenciales; permite verificar datos sin repetir llamadas pagadas.

Coste real DataForSEO: 0,24852 USD. No autoriza nuevas llamadas al reanudar.
260 candidatas tienen al menos 1.000 búsquedas/mes en la query medida US/en; 63 tienen demanda media (260–880/mes). No son visitas garantizadas ni una previsión de CPM.

El inventario URL que sigue se genera desde los sitemaps de build: 10.260 URLs del sitio principal y 5.832 del hub de esta rama. El hub desplegado se mantiene en 5.796 URLs hasta completar su workflow; el próximo estado esperado es 161 herramientas Growth600 (5.832 URLs), 438 herramientas entre ambos sitios y 16.092 URLs totales. Publicar no equivale a indexación.

Specific Heat Calculator está implementada, traducida y validada localmente; falta integrar y publicar. Al completar ese flujo, continuar con la siguiente ficha abierta de `PLAN-600.md`, sin reabrir herramientas ya publicadas, repetir investigación de DataForSEO ni medir PageSpeed/Lighthouse sin petición expresa.

Las casillas de producto permanecen sin marcar hasta que cada herramienta supere C/F/E/X/L/B/P/S. No llamar implementado, probado, traducido, publicado o indexado a lo que solo está planificado. Consultar `PROGRESS.md` antes de cada tanda; no rehacer investigación ni duplicar herramientas.
