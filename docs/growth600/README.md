# Plan de expansión a 600 herramientas · 2026-10-07

Estado verificado tras la publicación directa del 12-oct-2026: **177 herramientas Growth600** en producción (**6.408 URLs** = 177 × 36 + 36 portadas) y 277 herramientas originales (**10.260 URLs**); **454 herramientas y 16.668 URLs** combinadas. La herramienta #321 RSA Key Generator se publicó directamente en el proyecto de Cloudflare Pages `usefulverse-tools` y su código quedó respaldado en la rama `codex/growth600-rsa-key-generator-20261012`, commit `0e6cb17`, sin `git push` a `main` ni ejecución de GitHub Actions. Sitemap público HTTP 200, 6.408 URLs únicas; RSA tiene 36 rutas localizadas; EN/ES/AR/JA/zh-TW verificadas HTTP 200 y canonical autorreferente. Esto no demuestra indexación.

- [Plan y checklist completo](PLAN-600.md): catálogo protegido de 277, 323 candidatas nuevas, 36 idiomas, fases, contratos y gates.
- [Progreso de implementación](PROGRESS.md): fases verificadas, decisiones, pilotos y siguiente acción para reanudar.
- `research-evidence-2026-10-07-0.json`: coste/ledger, IDs y métricas principales seleccionadas, consultas SERP puntuales.
- Archivos de evidencia `-1.json` a `-6.json`: 1.258 métricas país/query únicas; sin credenciales, cookies o datos de cuenta.
- `dataforseo-responses-2026-10-07.tar.gz`: las 13 respuestas originales de investigación, sus históricos mensuales, ledger y tabla de tarifas. No contiene respuestas de `user_data` ni credenciales; permite verificar datos sin repetir llamadas pagadas.

Coste real DataForSEO: 0,24852 USD. No autoriza nuevas llamadas al reanudar.
260 candidatas tienen al menos 1.000 búsquedas/mes en la query medida US/en; 63 tienen demanda media (260–880/mes). No son visitas garantizadas ni una previsión de CPM.

El inventario URL actualizado en `README.md` se genera desde los sitemaps de build: 10.260 URLs del sitio principal y 6.408 URLs del hub, y se verificó con el sitemap público después del upload. Los buscadores ya conocen la URL canónica del sitemap; este despliegue no confirma su rastreo ni indexación.

La herramienta #321 RSA Key Generator ya está publicada. Continuar con #322 Log Analyzer, la siguiente ficha abierta de `PLAN-600.md`, sin reabrir herramientas ya publicadas, repetir investigación de DataForSEO ni medir PageSpeed/Lighthouse sin petición expresa. Si el presupuesto de Actions está bloqueado, una nueva build de producción requiere carga directa a Pages y respaldo de fuente en una rama que no active el workflow de `main`.

Las casillas de producto permanecen sin marcar hasta que cada herramienta supere C/F/E/X/L/B/P/S. No llamar implementado, probado, traducido, publicado o indexado a lo que solo está planificado. Consultar `PROGRESS.md` antes de cada tanda; no rehacer investigación ni duplicar herramientas.
