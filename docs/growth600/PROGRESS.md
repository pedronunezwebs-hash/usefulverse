# UsefulVerse · progreso del plan 277 → 600

Última verificación: 2026-10-07. Registro persistente de esta rama; las casillas de producto del plan solo cambian con evidencia de los gates C/F/E/X/L/B/P/S.

## Estado actual

- [x] F0 — Arranque: leídas las instrucciones vigentes de la agencia, operación online, FABLE y Cloudflare; clon temporal aislado; plan y evidencia de DataForSEO localizados en GitHub. No hay PR abierto. Auth de GitHub y Wrangler confirmada sin exponer secretos.
- [x] F1 — Snapshot: `main` sigue en `685f91adfc7818a54f6dc0a967e290d13137a3dd`, la misma base documentada en el plan. Inventario real: 277 herramientas, 36 idiomas. El `PLAN.md` del usuario coincide byte por byte con `docs/growth600/PLAN-600.md`.
- [x] F1 — Línea base técnica: `npm test`: 832 aprobados, 0 fallidos. `npm run check` completó; sitemap generado: 10.260 URLs. El build temporal contiene 10.728 archivos (incluye assets) y ocupa 495 MB; el proyecto tiene margen para crecer, pero no hasta 600 herramientas en una única salida Free.
- [x] F2 — Capacidad y coste estático comprobados: Cloudflare muestra un proyecto Pages actual (`usefulverse`). La documentación vigente indica hasta 100 proyectos por cuenta Free, 20.000 archivos por proyecto Free y peticiones a assets estáticos gratuitas e ilimitadas. La distribución planeada en una segunda salida estática es factible por cuota; no se ha creado todavía el segundo proyecto ni configurado su dominio.
- [ ] F2 — Crear el proyecto Pages gratuito `usefulverse-tools`, configurar build separado y `tools.usefulverse.com`; hacerlo después de que el piloto esté construido y validado localmente.
- [ ] F3 — Infraestructura aditiva para catálogo, renderer/origen canónico, 36 idiomas, builds y límites de tamaño.
- [ ] F4 — Piloto de cinco familias: `gravel-calculator`, `molar-mass-calculator`, `auto-loan-refinance-calculator`, `secret-santa-generator`, `mancala`. Todas pendientes de implementar y pasar C/F/E/X/L/B/P/S. Este orden cubre hogar, ciencias, finanzas, organización y juegos.

## Criterio y decisiones vigentes

- Base intacta: las 277 herramientas existentes conservan sus rutas, lógica y metadatos. Ninguna se ha editado en este avance.
- Las nuevas páginas vivirán en el subdominio y proyecto estático gratuito separados; no poner más de 20.000 archivos en el Pages actual.
- No se añaden Workers de cómputo, Functions, APIs de conversión, R2, llamadas pagadas ni nueva investigación de DataForSEO.
- No se marca ninguna de las cinco fichas hasta tener el caso de aceptación, errores/límites, exportación o explicación de N/A, todos los textos/rutas localizados, budgets/licencias y publicación verificada.
- FABLE: el siguiente bloque comienza inspeccionando la estructura real del catálogo, la ruta `renderToolPage`, las localizaciones y las pruebas; conservar comportamiento de las 277.

## Evidencia y límites

- `main` y rama base del plan: `685f91adfc7818a54f6dc0a967e290d13137a3dd`.
- Cloudflare Pages Free: [límites oficiales](https://developers.cloudflare.com/pages/platform/limits/) (consulta de 2026-10-07); [precio de peticiones estáticas](https://developers.cloudflare.com/pages/functions/pricing/); [dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/).
- `npm test` y `npm run check` se ejecutaron sin modificar el código fuente. No se lanzó PageSpeed, tal como pide el plan.
- Ningún archivo se desplegó, ninguna URL nueva está publicada y el sitemap de producción no cambió.

## Próxima acción concreta

Diseñar el renderer/build de `growth600` separado del renderer actual: el renderer común fija `https://usefulverse.com` en canonical y alternates, por lo que el nuevo render debe recibir un origen explícito y demostrar con pruebas que la salida root de las 277 sigue idéntica. Luego implementar un primer caso de la familia hogar y revisar el piloto local antes de ampliar.
