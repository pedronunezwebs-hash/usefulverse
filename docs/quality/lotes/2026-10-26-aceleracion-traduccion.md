# Aceleración de traducción · 26-oct-2026 · CERRADO

Petición de Pedro: acelerar sin reducir calidad ni usar servicios de pago.
Hecho significa demostrar resultados idénticos sobre todos los registros actuales,
conservar todas las políticas y evidencias, rechazar datos alterados con caché caliente,
medir antes/después y verificar CI, respaldo y retirada efectiva antes de LIBRE.

Checklist FABLE 3 + 7:
- [x] Lecturas frescas, remoto/rama/checkout propio, candado y disco >10 GiB.
- [x] Medir el cuello de botella con el código anterior.
- [x] Test rojo de repetición innecesaria y casos adversarios antes del arreglo.
- [x] Aplicar reutilización limitada a datos inmutables conocidos y comparar resultados.
- [x] Facilitar revisión por lotes y reutilizar evidencia exacta sin fingir inferencia nueva.
- [x] CI completa, GET/XML, seis documentos de relevo y respaldo remoto.
- [x] Eliminar clon, binarios y cachés propios; comprobar ausencia y liberar candado.

N/A para este lote de infraestructura: UI, responsive, dispositivos y pruebas físicas.
P-001–P-008: ocho pendientes, cero FALLA; ninguna herramienta ni idioma se aprueba.
No se modifica el catálogo, los slugs o la indexabilidad. Cero despliegues/activaciones,
APIs pagadas, Codespaces, Containers o almacenamiento persistente de modelos.


Aceleración: los 15.443 registros conservan exactamente todos sus indicadores. Benchmark local con cProfile: 51,77→29,34 s (1,76×); aperturas reales de archivo: 432.950→33. Cachés acotadas en RAM y casos de corrupción conservados. Los 25 destinos pendientes tienen nueve lotes preparados con evidencia existente; cero inferencia nueva y cero idiomas aprobados.

Sin cambios en src/public, catálogo, slugs, indexabilidad, políticas o evidencias lingüísticas anteriores. Siguen 15.443 registros, 6.950 evaluaciones con repeticiones, 1.151 fixtures y 477 memorias. Las muestras conocidas es/nb/ko/id/zh-CN conservan su estado; 31 destinos siguen pendientes y cero idiomas están autorizados para publicar. P-001–P-008 pendientes, cero FALLA, sin IDs nuevos. Sin certificación de herramientas, UI, dispositivos, responsive, puerta de 18 puntos ni siete capas. Cero despliegues, activaciones y envíos a buscadores.

[CI final 40219774134](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40219774134) correcta sobre a04f913: 3.045 pruebas Node y 300 Python (298 correctas, dos omisiones por dependencias), Python 525.834 s. Builds principal/hub, puerta de 20 locales existentes y preview de 10.800 páginas y todas sus homes noindex; sitemap vacío. Preview de 36 locales: no certifica 37. Modelo y ambas publicaciones omitidos; cero artefactos. Producción: 5 GET y 2 XML, 25.625→25.625 URLs, mismos estados/bytes/hashes; tres soft404 pendientes. Respaldo remoto verificado y clon/QA/cachés propios eliminados antes de LIBRE. **Siguiente:** Continuar la revisión por lotes con bengalí, ruso y urdu: `python3 scripts/localization/pilot-review-batch.py --locales bn,ru,ur --format markdown`. Leer sus 201 registros S/F/B y todos los avisos, contrastar legacy y registrar cada decisión por idioma. La preparación no es revisión ni aprobación. No repetir inferencias baseline ni los modelos v27 (40196684338/40198168513). Usar memoria exacta solo con fuente, hash y contexto coincidentes; la evidencia reutilizada conserva su registro y procedencia originales, nunca se cuenta como inferencia nueva. Empezar la política v28 independiente de bn y sus contratos numéricos; las pruebas chinas no aceptan otros idiomas. Conservar las 477 memorias, políticas/perfiles/gramáticas, crudos, revisiones, 1.151 fixtures y adendas históricas. Cada error real: test rojo antes del arreglo. Referencias y todos sus avisos antes del ampliado de cada idioma; mismas 88 claves fijas, leer todos los 174 registros modelo y legacy disponible, también fuera de las 88. Un idioma con referencias fallidas no entra al ampliado aunque otro del lote pase. Los siete ha/am/te/gu/ta/mr/sw requieren 80 muestras modelo: los 40 registros existentes no bastan. Compartir preparación y CI entre cambios del mismo lote, manteniendo la suite completa y el resultado independiente de cada idioma. Usar la cola acceleration-review-batches.json para los otros ocho lotes; los seis idiomas históricos siguen pendientes de reparación. Paso A continúa abierto por capacidad Pages, 37 traducciones revisadas y nb real; no avanzar a fase 0.

Uso: `python3 scripts/localization/pilot-review-batch.py --locales bn,ru,ur --format markdown` (también JSON). Agrupa 1–5 destinos; se empieza con tres. Relee fuente/ida/vuelta y avisos existentes, verifica hashes/contexto contra el corpus fijado y conserva IDs y procedencia. No invoca modelos, no asigna notas y no aprueba idiomas. Los siete destinos de pocos recursos mantienen 80 muestras mínimas. `acceleration-review-batches.json` fija nueve lotes y 1.675 registros existentes.

La aceleración se instala con un bootstrap explícito; el AST de todo el módulo anterior, salvo ese bootstrap, permanece idéntico. Caché compartida de bytes de archivo (32 MiB) y SHA256 por bytes exactos (32 MiB); huellas dev/inodo/tamaño/mtime_ns/ctime_ns, rechazo de lectura inestable y lectura normal cuando falta precisión temporal. JSON se vuelve a analizar en objetos nuevos. Solo las políticas cargadas y profundamente congeladas permiten reutilizar sus digest; copias mutables y contenedores arbitrarios se recalculan. Pruebas de cambio con mtime restaurado, sustitución, borrado, symlink, otros roots, mutación, excepciones y corrupción con caché caliente. No hay caché en disco ni aprobaciones guardadas.

El benchmark incluye cProfile en el mismo Mac y no mide velocidad de inferencia. Fuente anterior: 4c3c76e1775416c327c79cebff104365134f06e1. Test rojo de digest repetido y test rojo de contexto canónico sustituido ejecutados antes del arreglo; hashes en acceleration-measurements.json.


Después de esta CI, código y datos de medición/cola quedan congelados; solo se actualizan los seis documentos y recibos de verificación. Se comprobaron cinco respuestas y dos XML; no se rastrearon las25.625páginas ni se verificaron UI, dispositivos o indexación de Google.


Retirada efectiva verificada el 2026-10-25T18:26:56.289729+00:00: clon, QA, binarios y cachés propios eliminados sin Papelera; cero ZIP propios residuales. Candado LIBRE.
