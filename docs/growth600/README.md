# Plan de expansión a 600 herramientas · 2026-10-07

## Estado actual de la base · 2026-10-19

- Los sitemaps publicados contienen **10.260 URLs** en el sitio principal y **15.365 URLs** en el hub; juntos suman **25.625 URLs únicas**. El catálogo principal conserva 277 IDs. El hub cubre 423 IDs: 217 Growth, 100 de mercados y 106 páginas funcionales recuperadas desde los activos publicados.
- Las 106 herramientas se reconstruyeron como archivos editables desde los activos publicados: 3.816 HTML por idioma/ruta, 106 controladores formateados y recursos. Los módulos originales de autoría y sus source maps no se encontraron. La captura estática sigue como referencia verificable; el build consume `src/growth600/live-only-106-source/` y exige que su sitemap coincida exactamente con el inventario capturado.
- Validación local previa: `npm test` 2.595/2.595; `npm run check` conserva exactamente las 10.260 URLs principales; `npm run locale:release-check` pasó en los 20 locales expandidos. En esta continuación, el build del hub volvió a pasar y reprodujo exactamente sus 15.365 URLs; 106 controladores tienen sintaxis válida y cada herramienta conserva 36 rutas. No se ejecutó `npm test`.
- No se hizo commit, push ni deploy; producción permanece intacta. El plan de 300 herramientas nuevas está conservado en [`docs/planning/usefulverse-1000-2026-10-19/PLAN-1000.md`](../planning/usefulverse-1000-2026-10-19/PLAN-1000.md) y aún no se ha iniciado.

## Historial del plan y checkpoints previos

Plan y registro vivo de implementación. Verificación directa del 11-oct-2026: producción tenía **163 herramientas Growth600** (sitemap: **5.904 URLs** = 163 × 36 + 36 portadas) y 277 herramientas originales (sitemap principal: **10.260 URLs**). Reverse Mortgage Calculator (#101) ya figuraba en el sitemap público. La rama añadía Car Depreciation Calculator (#118) como herramienta 164 del hub; su build local generaba 5.940 URLs estáticas. Ese estado quedó superado por la reconciliación del 19-oct descrita arriba. No confundir una build/PR con indexación.

- [Plan y checklist completo](PLAN-600.md): catálogo protegido de 277, 323 candidatas nuevas, 36 idiomas, fases, contratos y gates.
- [Progreso de implementación](PROGRESS.md): fases verificadas, decisiones, pilotos y siguiente acción para reanudar.
- `research-evidence-2026-10-07-0.json`: coste/ledger, IDs y métricas principales seleccionadas, consultas SERP puntuales.
- Archivos de evidencia `-1.json` a `-6.json`: 1.258 métricas país/query únicas; sin credenciales, cookies o datos de cuenta.
- `dataforseo-responses-2026-10-07.tar.gz`: las 13 respuestas originales de investigación, sus históricos mensuales, ledger y tabla de tarifas. No contiene respuestas de `user_data` ni credenciales; permite verificar datos sin repetir llamadas pagadas.

Coste real DataForSEO: 0,24852 USD. No autoriza nuevas llamadas al reanudar.
260 candidatas tienen al menos 1.000 búsquedas/mes en la query medida US/en; 63 tienen demanda media (260–880/mes). No son visitas garantizadas ni una previsión de CPM.

En el checkpoint histórico, el inventario URL se generaba desde sitemaps de build con 10.260 URLs del sitio principal y 5.940 del hub; producción tenía 5.904 URLs del hub. El total esperado entonces era 441 herramientas y 16.200 URLs. Esa previsión quedó superada por los sitemaps observados el 19-oct. Publicar no equivale a indexación.

En el checkpoint previo, Car Depreciation Calculator (#118) estaba implementada y localizada estáticamente; faltaba integrar y publicar. Ese estado se conserva aquí como historial, no como el recuento actual del hub.

Las casillas de producto permanecen sin marcar hasta que cada herramienta supere C/F/E/X/L/B/P/S. No llamar implementado, probado, traducido, publicado o indexado a lo que solo está planificado. Consultar `PROGRESS.md` antes de cada tanda; no rehacer investigación ni duplicar herramientas.
