# Paso A · contexto y literales · Codex · 20-oct-2026

Alcance: PR #136, rama `feat/new-tools-batch-1`, scripts del piloto y evidencia. Ningún cambio en la web publicada.
Hecho para este lote: repetición real de las 40 referencias es/nb en Actions, revisión y checkpoints remotos;
regresiones permanentes, CI y relevo recuperable. No equivale a aprobar idiomas ni a completar el Paso A.

Checklist (FABLE bug + multi-sesión y RUNBOOK):

- [x] Leer relevo/reglas, comprobar disco y P-001–P-008: 8 pendientes, 0 FALLA. Candado main `29eff0d`.
- [x] Reproducir pérdidas de `{duration}` y sentidos ambiguos mediante fixtures reales del piloto anterior.
- [x] Tests añadidos antes del cambio: tres errores por funciones todavía ausentes; tras implementación pasan.
- [x] Variante separada `context-v2`: diez sentidos explícitos en inglés controlado, sin cambiar la fuente canónica.
- [x] Proteger literales fuera del modelo; ensamblar posiciones conocidas, sin adivinar marcadores perdidos.
- [x] Conservar baseline; hash de la política en identidades; trazas de fragmentos y controles ida/vuelta.
- [x] Repetir tres configuraciones, revisar y conservar referencias; solo v4 supera su umbral es/nb.
- [x] Revisión adversarial, tests vecinos, CI y GET de producción.
- [ ] Actualizar ESTADO, progress, LOG; push y SHA remoto; liberar candado y eliminar temporales propios.

La segmentación puede empeorar gramática u orden: es un experimento que requiere revisión, no una reparación automática
que permita aprobar el idioma. No hay sustituciones en destino ni revisión nativa inventada.

## Resultado de las referencias y cambios

- `2c75dc2`: inglés controlado por sentido, políticas con identidad separada y segmentación de literales con trazas.
- `b78b2fb`: variante de frases completas, auditoría independiente de las trazas y revisión de de/fr.
- `b2386e6`: 160 registros v2, revisión ligada al texto y rechazo de suplantación de checkpoint contextual/baseline.
- `2dff90b`: memoria revisada exacta; nunca se reconstruye un marcador perdido ni se atribuye su salida al modelo.
- `d79cde9`: puerta de referencias v4 y control de tokens técnicos en la vuelta.
- `a549d1f`, `6d85955`: validación de todos los registros y resolución de dos conflictos documentales al integrar main.
  Se compararon ambas versiones: main no aportaba cambios de contenido adicionales que se perdiesen al conservar la guía ampliada.

| Variante | Idioma | Puntos / 360 | Decisión de referencias |
|---|---|---:|---|
| M2M100 v2, segmentado | es | 267 | Rechazado; no ampliar |
| M2M100 v2, segmentado | nb | 264 | Rechazado; no ampliar |
| MADLAD v2, segmentado | es | 307 | Rechazado; no ampliar |
| MADLAD v2, segmentado | nb | 306 | Rechazado; no ampliar |
| MADLAD v3, frases | es | 353 | Rechazado: traduce `{duration}` |
| MADLAD v3, frases | nb | 347 | Rechazado: marcador y `.dxf` |
| MADLAD v4, frases + memoria | es | 360 | Pasa referencias; falta piloto completo |
| MADLAD v4, frases + memoria | nb | 358 | Pasa referencias (2 leves/40); falta piloto completo |

Comparación v4 de 80 salidas del sistema híbrido, no del modelo crudo: 7 aciertos de memoria (2 es, 5 nb).
La copia actual también se conserva y retrotraduce. Rúbricas por texto/hash, origen y registro en la rama del PR;
ninguna revisión se presenta como nativa. Las dos concordancias leves nb siguen registradas para pulirlas.
Las señales de longitud de Resume/Clear rectangles/Fit drawing se revisaron: el inglés controlado desambigua la acción.

[Run v2 39434607232](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39434607232):
320 registros. M2M100: 60,33 s, conversión 34,11 s, pico inferencia 841.480 KiB;
MADLAD: 259,27 s, conversión 84,34 s, pico 3.662.376 KiB.
[Run v3 39435208282](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39435208282):
160 registros, 217,00 s.
[Referencias v4 39436428601](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39436428601):
160 registros, 250,87 s. Revisión antes de ampliar al piloto completo.

## Verificación y límites

- Antes del arreglo: tests nuevos fallaron por funciones ausentes; la suplantación contextual falló porque no se
  rechazaba el registro; el control técnico de vuelta falló por campo inexistente. Después pasan.
- Pruebas permanentes de pérdida/multiplicidad de marcadores, literales técnicos, glosario obsoleto, memoria por contexto,
  procedencia de memoria, 1.000 formas de entrada y reanudación de los 160 registros reales sin modelo.
- La auditoría de las trazas rechaza prosa vacía o un ensamblado que no coincida con los fragmentos guardados.
  Un marcador correcto de ida no oculta un número o extensión incorrectos a la vuelta.
- Los JSON de política medidos quedan inmutables; una configuración posterior usa otro ID/digest y conserva la evidencia anterior.
- Revisión MADLAD baseline de 40 referencias en cada uno de de/fr/pt-BR/ja/hi/ar terminada. Ninguna combinación pasa sin corregir.
- Node focalizado: 4/4; Python ligero: 34 casos (32 pasan, 2 requieren dependencias reales del job de modelos).
  Actionlint 1.7.12 sin errores; Gitleaks 8.30.1 sin secretos en los diffs publicados.
- No se certifican las siete capas ni los 18 puntos de puerta de ninguna herramienta: es infraestructura/evaluación del piloto.
  Navegadores, responsive/RTL, rendimiento y hardware quedan pendientes. No hay nueva interfaz publicada.

## Producción, costes y Pedro

GET con curl del 20-oct, 14:02 UTC: sitemap principal **10.260** y hub **15.365**, total **25.625 → 25.625**.
Las tres rutas falsas del hub siguen devolviendo **200**, pendiente de fase 0. Datos:
`translation-pilot/production-context-check.json` en la rama del PR.
Sin merge a main del código, despliegues, activaciones, 301 ni envíos a buscadores. Solo runners estándar del repo público,
sin artifacts/cachés persistentes, LFS, API de pago, cambios de Cloudflare ni Containers. No se acredita el coste global del
ciclo de Cloudflare; este lote no realiza mutaciones en esa cuenta. Modelos/builds completos únicamente en Actions.

Pedro: **ninguna prueba nueva**; P-001–P-008 siguen pendientes, **0 FALLA**. No se necesita dispositivo real para verificar
los cambios del runner; eso no valida el audio, el juego ni el visor reales.
Contadores: existentes terminadas **0/700**, con nb **100/700**, nuevas en main **0/300**, activadas **0**, semana **0/30**.
Capacidad del Paso A y las traducciones de las 300 permanecen abiertas; no se avanza a fase 0.

## Piloto completo y siguiente paso exacto

[Run 39437391534](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39437391534), código `d79cde9`:
**856 registros** (214 unidades × es/nb × candidato/actual), 160 reutilizados y 696 nuevos. Cómputo 975,22 s,
conversión 74,97 s, pico de inferencia 4.065.256 KiB. Los modelos convertidos coinciden por hash con los runs anteriores.
La copia actual se conserva incluso cuando falla; no se reemplaza lo publicado por las salidas candidatas.

La muestra se comprometió antes de recoger los resultados (`4b8a92a`): 20 claves por idioma, ampliadas a 68 por botones,
cifras, negaciones y todas las etiquetas de unidades; además las 20 actuales por idioma. **176 evaluaciones nuevas**.
**Piloto completo rechazado en es y nb**, aunque las referencias pasasen. Casos concretos:

- `dxf-viewer.fields.clear` / `clearMeasure`: «Dibujo claro», «Una medición clara», «Tydelig måling» en vez de eliminar.
- `voice-changer.fields.clean`: es un preset neutro según el código; «Fjern» no es el sentido correcto.
- `dxf-viewer.limits` es: desaparecen máximo 10 MB y 200,000 registros; `voice-changer.details` es pierde no enviar audio;
  `voice-changer.description` de ambos pierde gratis/privado/sin subida; `shikaku.limits` es pierde no necesitar cuenta/subida.
- FAQ duplicadas no recibieron el inglés controlado de sus equivalentes; vuelven a omitir la negación inicial.
- Símbolos (in)/(mm) traducidos a palabras y (km) → (miles) en la vuelta; versiones 1.1.2/1.9.2 separadas por espacios.
  El control contextual nuevo (`dfe55ae`) detecta símbolos en ambas direcciones sin tratar la preposición in como unidad.
- La copia actual también falla: Nr. por Nei, Clean como acción de limpiar y traducción sin carga por sin subida.
  Diferencias de formato como 200 000 pueden conservar el valor; aun así, la comprobación literal falla y queda pendiente,
  sin restauración adivinada ni aprobación automática. Un fallo de vuelta no se atribuye sin más a una ida correcta.

**Total: 6.145 registros, 1.378 evaluaciones (no frases únicas), 410 regresiones**. Datos/rúbricas/checksums:
`translation-pilot/` en `feat/new-tools-batch-1`; resumen recalculado de las 158 combinaciones política/motor/idioma/candidato.
35 tests Python ligeros: **33 pasan y 2 de dependencias se reservan al job de modelos**. Las dependencias reales sí se
probaron en los jobs del piloto. [CI final 39440552803](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39440552803),
`dfe55ae`: 3.045 Node; principal 10.260 páginas, release de idiomas, hub y preview 11.293 archivos/10.800 herramientas noindex verdes.

Para Claude: crear **context-v5** sin editar políticas medidas; corregir las familias de acciones/presets y los alias de FAQ;
controlar inglés por frases sin omitir ninguna; sacar versiones y símbolos del texto traducible o usar memoria exacta
revisada por contexto. Repetir referencias y completo es/nb con la misma muestra antes de ampliar. Después revisar los
28 destinos restantes y congelar elección por idioma. **0 idiomas aprobados, sin traducción masiva ni avance a fase 0.**

## Limpieza del lote

PENDIENTE-LIMPIEZA-CONTEXTO: se anotará online después de verificar hashes remotos y eliminar realmente el clon propio.
