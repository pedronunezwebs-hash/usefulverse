# UsefulVerse · progreso del plan 277 → 600

Última verificación: 2026-10-07. Registro persistente de esta rama; las casillas de producto del plan solo cambian con evidencia de los gates C/F/E/X/L/B/P/S.

## Estado actual

- [x] F0 — Arranque: leídas las instrucciones vigentes de la agencia, operación online, FABLE y Cloudflare; clon temporal aislado; plan y evidencia de DataForSEO localizados en GitHub. No hay PR abierto. Auth de GitHub y Wrangler confirmada sin exponer secretos.
- [x] F1 — Snapshot: `main` sigue en `685f91adfc7818a54f6dc0a967e290d13137a3dd`, la misma base documentada en el plan. Inventario real: 277 herramientas, 36 idiomas. El `PLAN.md` del usuario coincide byte por byte con `docs/growth600/PLAN-600.md`.
- [x] F1 — Línea base técnica inicial: `npm test`: 832 aprobados, 0 fallidos. `npm run check` completó; sitemap generado: 10.260 URLs. El build temporal contiene 10.728 archivos (incluye assets) y ocupa 495 MB; el proyecto tiene margen para crecer, pero no hasta 600 herramientas en una única salida Free.
- [x] F2 — Capacidad y coste estático comprobados: Cloudflare muestra un proyecto Pages actual (`usefulverse`). La documentación vigente indica hasta 100 proyectos por cuenta Free, 20.000 archivos por proyecto Free y peticiones a assets estáticos gratuitas e ilimitadas. La distribución planeada en una segunda salida estática es factible por cuota; no se ha creado todavía el segundo proyecto ni configurado su dominio.
- [ ] F2 — Crear el proyecto Pages gratuito `usefulverse-tools`, configurar build separado y `tools.usefulverse.com`; hacerlo después de que el piloto esté construido y validado localmente.
- [ ] F3 — Infraestructura aditiva para catálogo, renderer/origen canónico, 36 idiomas, builds y límites de tamaño. Parcial: catálogo, renderer, gate estricto por idioma, formularios y builder/sitemap separados están probados; `build:growth600` exige los 36 módulos antes de escribir salida. Solo existe copy real en inglés; faltan 35 locales y budgets/licencias finales.
- [ ] F4 — Piloto de cinco familias: `gravel-calculator`, `molar-mass-calculator`, `auto-loan-refinance-calculator`, `secret-santa-generator`, `mancala`. Motores y cinco controladores locales están conectados. **Ninguna herramienta está terminada/publicable**: falta localizar a 36 idiomas, revisión móvil/teclado ampliada, build/presupuestos y publicación+sitemap (C/F/E/X/L/B/P/S).

## Avance de implementación · motores del piloto

- [x] Grava: área de rectángulo/círculo/triángulo, volumen, desperdicio, densidad, peso estimado y redondeo de sacos; entradas fuera de rango rechazadas.
- [x] Masa molar: parser local acotado para grupos, hidratos e isótopos expresamente incluidos; H₂O = 18,015 g/mol. Elementos/isótopos no soportados y fórmulas inválidas se rechazan; no se finge soporte universal.
- [x] Refinanciación auto: pagos amortizados con APR 0%, cargos iniciales o financiados, coste total y punto de equilibrio acumulado por mes; solo matemáticas, sin recomendar una tasa.
- [x] Secret Santa: emparejamiento sin autoasignación, exclusiones, imposibilidad explícita, fuente aleatoria inyectable y hasta 30 participantes.
- [x] Mancala/Kalah: siembra, omisión del almacén contrario, capturas, turno extra, barrido final, empate y rival local heurístico. Invariante: conserva semillas.
- [x] Suite piloto: `node --test src/growth600/tools/growth600-logic.test.mjs` — 7/7; incluye aceptación, límites, imposibilidad, variedad del sorteo y partidas deterministas con conservación de semillas.
- [x] Contrato del catálogo aditivo: 5 IDs comparados contra las 277 protegidas; pruebas rechazan colisión, duplicados, contratos incompletos y enlaces a herramientas inexistentes.
- [x] Renderer base: pruebas confirman canonical/hreflang en origen separado, `lang`/`dir` RTL, escape HTML y JSON-LD contra inyección, además de rechazo de origen no HTTPS. No es aún una página de producto completa.
- [x] Formularios estáticos y controladores reales para los cinco pilotos; datos locales en `<script type="application/json">` con escape de contenido; tests verifican labels, submit/reset y copia segura.
- [x] Bundles por herramienta minificados y separados; tamaños observados: grava 3.995 B, masa molar 4.713 B, refinanciación 3.820 B, Secret Santa 4.858 B, Mancala 3.875 B; bajo el presupuesto de 24 KiB, sin llamadas remotas ni ejecución dinámica.
- [x] Puerta de localización: comprueba cada herramienta en cada idioma y límites de títulos/descripciones; aún faltan los textos traducidos reales para los 36 idiomas.
- [x] Builder separado probado temporalmente: 2 idiomas de fixture × (5 herramientas + portada), sitemap/robots/llms, canonicals y assets versionados; rechaza sobreescrituras, archivos de más, controladores ausentes y copy incompleto. El fixture no es un build listo para publicar.
- [ ] Medir assets con las 36 traducciones reales; aún solo se midieron los cinco bundles de controlador y el CSS.
- [x] Recorrido funcional en navegador local de los cinco pilotos: grava (cálculo, inválido y reset), fórmula `Ca(OH)2` (74,092 g/mol) y rechazo de `XeF4`, refinanciación (cuotas/coste/break-even), sorteo con exclusión y revelado privado paso a paso, Mancala con turno extra y respuesta del ordenador. Las pruebas detectaron y corrigieron botones de envío mal tipados y el adaptador aleatorio criptográfico.
- [x] Regresión del repo (checkpoint actual): `npm test -- --test-reporter=spec` — 854 aprobados, 0 fallidos; `USEFULVERSE_DIST=/tmp/usefulverse-impl.uEAJhh/baseline-dist npm run check` — código 0. El root conserva 9.972 páginas de herramientas y 10.260 URLs. `git diff --check` también pasó.
- [ ] Localización de los cinco pilotos: `src/growth600/locales/en.mjs` es copy fuente y español es el primer borrador importado desde Google Translate, para las 252 cadenas del home y los cinco pilotos. Falta validar su calidad humana y crear las otras 34 locales; el gate impide construir una publicación parcial.
- [x] Infraestructura del locale español: materializador de traducciones indexadas preserva placeholders y fuente; metadatos cumplen topes; la página generada usa el copy traducido y no filtra `undefined`. Pruebas de locale/build: 10/10.
- [x] Etiquetas hreflang: el renderer mantiene la ruta existente `/tl/` y `<html lang="fil-PH">`, pero emite `hreflang="tl"` según el código ISO 639-1 requerido por Google. Cubierto para páginas de herramienta y portada.
- [x] Integración de bundle checks al `npm test`; `npm run build:growth600` falla de forma cerrada con lista de locales faltantes y no genera salida.

## Criterio y decisiones vigentes

- Base intacta: las 277 herramientas existentes conservan sus rutas, lógica y metadatos. Ninguna se ha editado en este avance.
- Las nuevas páginas vivirán en el subdominio y proyecto estático gratuito separados; no poner más de 20.000 archivos en el Pages actual.
- No se añaden Workers de cómputo, Functions, APIs de conversión, R2, llamadas pagadas ni nueva investigación de DataForSEO.
- No se marca ninguna de las cinco fichas hasta tener el caso de aceptación, errores/límites, exportación o explicación de N/A, todos los textos/rutas localizados, budgets/licencias y publicación verificada.
- FABLE: la implementación aditiva se mantiene en `src/growth600/`; no se integró al catálogo ni al runtime root.

## Evidencia y límites

- `main` y rama base del plan: `685f91adfc7818a54f6dc0a967e290d13137a3dd`.
- Cloudflare Pages Free: [límites oficiales](https://developers.cloudflare.com/pages/platform/limits/) (consulta de 2026-10-07); [precio de peticiones estáticas](https://developers.cloudflare.com/pages/functions/pricing/); [dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/).
- La última suite completa y el build root acabaron con código 0. `build:growth600` se debe volver a probar: ahora el único locale adicional es `es`, así que siguen faltando 34 locales; no debe crear salida parcial. `src/growth600/` aún no se integra al root. No se lanzó PageSpeed, tal como pide el plan.
- Ningún archivo se desplegó, ninguna URL nueva está publicada y el sitemap de producción no cambió.

## Próxima acción concreta

Siguiente: traducir el inglés restante por lotes dentro del límite visible de Google Translate; importar y probar primero francés, después continuar el catálogo de locales en orden definido por el plan. Antes de avanzar a más funciones de cada herramienta, terminar la puerta común de localización de los cinco pilotos. Al completar las 36 locales, compilar en salida efímera y revisar rutas, sitemap, hreflang y budgets. El endpoint no oficial devolvió HTTP 429: no reintentar. Las 277 rutas originales siguen intactas.
