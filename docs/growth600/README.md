# Plan de expansión a 600 herramientas · 2026-10-07

Plan y registro vivo de implementación. Rama de trabajo actual: `codex/growth600-interval-timer-20261011`; integrar en `main` tras superar CI y los gates de publicación de la candidata en curso.

- [Plan y checklist completo](PLAN-600.md): catálogo protegido de 277, 323 candidatas nuevas, 36 idiomas, fases, contratos y gates.
- [Progreso de implementación](PROGRESS.md): fases verificadas, decisiones, pilotos y siguiente acción para reanudar.
- `research-evidence-2026-10-07-0.json`: coste/ledger, IDs y métricas principales seleccionadas, consultas SERP puntuales.
- Archivos de evidencia `-1.json` a `-6.json`: 1.258 métricas país/query únicas; sin credenciales, cookies o datos de cuenta.
- `dataforseo-responses-2026-10-07.tar.gz`: las 13 respuestas originales de investigación, sus históricos mensuales, ledger y tabla de tarifas. No contiene respuestas de `user_data` ni credenciales; permite verificar datos sin repetir llamadas pagadas.

Coste real DataForSEO: 0,24852 USD. No autoriza nuevas llamadas al reanudar.
260 candidatas tienen al menos 1.000 búsquedas/mes en la query medida US/en; 63 tienen demanda media (260–880/mes). No son visitas garantizadas ni una previsión de CPM.

Último deploy confirmado al iniciar esta rama: #088 Julian Date Converter; 151 herramientas Growth600 en el hub, 5.472 URLs (151 × 36 + 36 portadas), y 10.260 URLs en el sitio principal. Total público: 428 herramientas y 15.732 URLs. PR #115, CI y ambos despliegues confirmados; publicar no equivale a indexación.

Candidata en esta rama: #120 Interval Timer; 152 herramientas, 5.508 URLs y 15.768 URLs combinadas en el build local. La suite enfocada, el chequeo de locales, la compilación y la QA de navegador pasan; el PR, despliegue y sitemap público siguen pendientes hasta que la CI termine.

Las casillas de producto permanecen sin marcar hasta que cada herramienta supere C/F/E/X/L/B/P/S. No llamar implementado, probado, traducido, publicado o indexado a lo que solo está planificado. Consultar `PROGRESS.md` antes de cada tanda; no rehacer investigación ni duplicar herramientas.
