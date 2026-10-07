# UsefulVerse · progreso del plan 277 → 600

Última verificación: 2026-10-07. Registro persistente de esta rama; las casillas de producto del plan solo cambian con evidencia de los gates C/F/E/X/L/B/P/S.

## Estado actual

- [x] F0 — Arranque: leídas las instrucciones vigentes de la agencia, operación online, FABLE y Cloudflare; clon temporal aislado; plan y evidencia de DataForSEO localizados en GitHub. No hay PR abierto. Auth de GitHub y Wrangler confirmada sin exponer secretos.
- [x] F1 — Snapshot: `main` sigue en `685f91adfc7818a54f6dc0a967e290d13137a3dd`, la misma base documentada en el plan. Inventario real: 277 herramientas, 36 idiomas. El `PLAN.md` del usuario coincide byte por byte con `docs/growth600/PLAN-600.md`.
- [x] F1 — Línea base técnica: `npm test`: 832 aprobados, 0 fallidos. `npm run check` completó; sitemap generado: 10.260 URLs. El build temporal contiene 10.728 archivos (incluye assets) y ocupa 495 MB; el proyecto tiene margen para crecer, pero no hasta 600 herramientas en una única salida Free.
- [x] F2 — Capacidad y coste estático comprobados: Cloudflare muestra un proyecto Pages actual (`usefulverse`). La documentación vigente indica hasta 100 proyectos por cuenta Free, 20.000 archivos por proyecto Free y peticiones a assets estáticos gratuitas e ilimitadas. La distribución planeada en una segunda salida estática es factible por cuota; no se ha creado todavía el segundo proyecto ni configurado su dominio.
- [ ] F2 — Crear el proyecto Pages gratuito `usefulverse-tools`, configurar build separado y `tools.usefulverse.com`; hacerlo después de que el piloto esté construido y validado localmente.
- [ ] F3 — Infraestructura aditiva para catálogo, renderer/origen canónico, 36 idiomas, builds y límites de tamaño. Parcial: catálogo contractual de cinco pilotos, renderer aislado por origen y puerta automática de cobertura/truncado; falta dataset de traducciones, formularios/controladores, build/sitemap separados y presupuestos.
- [ ] F4 — Piloto de cinco familias: `gravel-calculator`, `molar-mass-calculator`, `auto-loan-refinance-calculator`, `secret-santa-generator`, `mancala`. Los motores puros iniciales están implementados y tienen 7 pruebas; **ninguna herramienta está terminada**: faltan revisión integral, interfaz, exportación cuando aplique, 36 idiomas, build/presupuestos, publicación y sitemap (C/F/E/X/L/B/P/S).

## Avance de implementación · motores del piloto

- [x] Grava: área de rectángulo/círculo/triángulo, volumen, desperdicio, densidad, peso estimado y redondeo de sacos; entradas fuera de rango rechazadas.
- [x] Masa molar: parser local acotado para grupos, hidratos e isótopos expresamente incluidos; H₂O = 18,015 g/mol. Elementos/isótopos no soportados y fórmulas inválidas se rechazan; no se finge soporte universal.
- [x] Refinanciación auto: pagos amortizados con APR 0%, cargos iniciales o financiados, coste total y punto de equilibrio acumulado por mes; solo matemáticas, sin recomendar una tasa.
- [x] Secret Santa: emparejamiento sin autoasignación, exclusiones, imposibilidad explícita, fuente aleatoria inyectable y hasta 30 participantes.
- [x] Mancala/Kalah: siembra, omisión del almacén contrario, capturas, turno extra, barrido final, empate y rival local heurístico. Invariante: conserva semillas.
- [x] Suite piloto: `node --test src/growth600/tools/growth600-logic.test.mjs` — 7/7; incluye aceptación, límites, imposibilidad, variedad del sorteo y partidas deterministas con conservación de semillas.
- [x] Contrato del catálogo aditivo: 5 IDs comparados contra las 277 protegidas; pruebas rechazan colisión, duplicados, contratos incompletos y enlaces a herramientas inexistentes.
- [x] Renderer base: pruebas confirman canonical/hreflang en origen separado, `lang`/`dir` RTL, escape HTML y JSON-LD contra inyección, además de rechazo de origen no HTTPS. No es aún una página de producto completa.
- [x] Puerta de localización: comprueba cada herramienta en cada idioma y límites de títulos/descripciones; aún faltan los textos traducidos reales para los 36 idiomas.
- [ ] Generador estático independiente, sitemap/robots/llms por subdominio, conteo real de archivos y budgets; todavía no añadidos.
- [x] Regresión del repo: `npm test` — 844 aprobados, 0 fallidos; `USEFULVERSE_DIST=/tmp/usefulverse-impl.uEAJhh/baseline-dist npm run check` — las 9.972 páginas de herramientas actuales siguen generando correctamente y el sitemap root conserva 10.260 URLs.
- [ ] Interfaz/producto y localización de los cinco pilotos; aún no hay páginas generadas en el subdominio.
- [ ] Integración automática al `npm test` se verificará una vez implementados el builder y sus gates separados.

## Criterio y decisiones vigentes

- Base intacta: las 277 herramientas existentes conservan sus rutas, lógica y metadatos. Ninguna se ha editado en este avance.
- Las nuevas páginas vivirán en el subdominio y proyecto estático gratuito separados; no poner más de 20.000 archivos en el Pages actual.
- No se añaden Workers de cómputo, Functions, APIs de conversión, R2, llamadas pagadas ni nueva investigación de DataForSEO.
- No se marca ninguna de las cinco fichas hasta tener el caso de aceptación, errores/límites, exportación o explicación de N/A, todos los textos/rutas localizados, budgets/licencias y publicación verificada.
- FABLE: la implementación aditiva se mantiene en `src/growth600/`; no se integró al catálogo ni al runtime root.

## Evidencia y límites

- `main` y rama base del plan: `685f91adfc7818a54f6dc0a967e290d13137a3dd`.
- Cloudflare Pages Free: [límites oficiales](https://developers.cloudflare.com/pages/platform/limits/) (consulta de 2026-10-07); [precio de peticiones estáticas](https://developers.cloudflare.com/pages/functions/pricing/); [dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/).
- La línea base inicial `npm test`/`npm run check` fue previa a esta implementación; tras añadir motores, catálogo, gate de idioma y renderer, `npm test` completó 844/844 y `npm run check` conservó el build/sitemap root. El test puntual de renderer volvió a pasar tras endurecer JSON-LD. No se lanzó PageSpeed, tal como pide el plan.
- Ningún archivo se desplegó, ninguna URL nueva está publicada y el sitemap de producción no cambió.

## Próxima acción concreta

Completar el builder aislado: formularios/controladores accesibles para cinco pilotos, sitemap/robots/llms, cálculo/versionado de assets, censo de archivos y budgets; luego alimentar el gate con 36 copias reales. La solicitud de muestra al endpoint público de Google Translate devolvió HTTP 429; no insistir ni contarla como localización válida. El repo root y sus 277 herramientas permanecen intactos.
