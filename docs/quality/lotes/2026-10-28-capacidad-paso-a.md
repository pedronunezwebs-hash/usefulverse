# 28-oct · Capacidad del Paso A y pruebas físicas aplicables

Se completa la medición pendiente antes de publicar las 300 junto a las 700. La pasada integral de las 1.000 herramientas queda explícita en PRUEBAS.md: todas las capas aplicables antes de cerrar cada herramienta, con regresiones y vigilancia posterior. Pedro solo recibe los casos que requieran hardware, condiciones reales del dispositivo o juicio que el agente no pueda comprobar. No se crean pruebas físicas por defecto.

## Medición reproducible sin publicar

[Código d1a7429](https://github.com/pedronunezwebs-hash/usefulverse/commit/d1a7429f76e6bb4ba157bc38ad5dbb0a36ee8d72), [workflow 40652759818](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40652759818), [PR borrador #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136). Un job público estándar, solo lectura, 113 s, cero ms facturables reportados y cero artifacts. Tests del medidor, builds principal/hub/preview y gate de 20 locales correctos. No se repite la suite completa de herramientas porque no se modifica su código; su última CI completa sigue siendo 40646366137.

El presupuesto conservador empleado es el de Pages Free documentado en el repo: **20.000 archivos por despliegue y 25 MiB por archivo**, contrastado con [los límites vigentes de Pages](https://developers.cloudflare.com/pages/platform/limits/). No se consultó ni cambió el plan/facturación real de la cuenta. No se supone que Workers Paid aumente el límite de Pages. Contamos todos los archivos regulares, incluso configuración/metadatos; dos rutas con bytes idénticos siguen contando como dos archivos.

| Salida medida | Archivos | HTML | Bytes sin comprimir | Cabe en el presupuesto de archivos/asset |
|---|---:|---:|---:|---|
| Principal, 277 existentes | 10.728 | 10.263 | 486.992.641 | Sí |
| Hub, 423 existentes | 16.354 | 15.365 | 776.381.613 | Sí |
| Preview separada, 300 nuevas | 11.293 | 10.836 | 241.869.934 | Sí |
| Hub + candidatas, unión hipotética de rutas | **27.470** | 26.165 | 937.235.034* | **No: exceso mínimo de 7.470 archivos** |
| Referencia teórica de origen único | 38.117 | — | 1.394.578.017* | No para ese presupuesto; no se implementa la unificación |

\* La unión de rutas es un límite inferior de archivos, no una salida ensamblada. En colisiones se usa la variante mayor solo para no esconder assets demasiado grandes; sus bytes no describen un despliegue válido. Ningún asset individual de las tres salidas supera 25 MiB. Los bytes son almacenamiento de todos los recursos, incluidos los que se cargan al usar una función; no son el peso de la primera carga de una página ni certifican PESO-Y-DISENO.md.

**Hay 73 rutas con contenido distinto**, incluidas las 36 portadas, archivos `llms.txt` y el sitemap. Copiar la preview encima del hub puede sustituir portadas indexables por noindex y reemplazar el sitemap publicado por el vacío. El medidor informa de esas colisiones, conserva las entradas y nunca ensambla ni sobrescribe los builds. `deploymentApproved:false` también cuando un recuento cabe. [Informe completo y fingerprints](../capacity-v1/report.json), [recibo de CI](../capacity-v1/evidence.json).

La preview de esta medición utiliza las copias de borrador del build para medir capacidad; no importa memoria de traducción. Su tamaño es el de ese snapshot. La CI previa con paquetes revalidados conserva la prueba separada de traducción/procedencia y de 10.800 rutas noindex. Esto no aprueba idiomas, contenido, rendimiento ni funcionalidad de herramientas.

## Ruta compatible y límites del resultado

La ruta provisional compatible con el presupuesto es conservar los **dos despliegues actuales de las 700 y la preview ya existente de las 300**, cada salida por debajo de 20.000 archivos. Mantiene el orden del plan, sin un nuevo proyecto/subdominio/plan ni adelantar la unificación de dominio. No se publicó nada en este lote. Integrar la fuente en main y la publicación definitiva siguen pendientes del Paso A y sus puertas; no se resuelve mezclando carpetas. Las 300 continúan noindex y fuera de los sitemaps indexables; cero activaciones.

La referencia de origen único únicamente cuantifica el futuro problema; la unificación prevista se conserva para RUNBOOK §4b. Este informe no autoriza recursos, cambios de plan o consumo de Cloudflare.

## Pruebas y trazabilidad

- 13 pruebas del medidor correctas en Actions. Incluyen los bordes 20.000/20.001 y 25 MiB/+1, contenido idéntico con rutas distintas, colisiones de portadas, variantes de assets grandes, fingerprints, preservación de entradas, builds vacíos/solapados, symlinks, informes separados y permisos del workflow.
- Durante el desarrollo se reprodujeron antes del arreglo tres escapes: informe a través de alias de una carpeta de entrada, resumen a través de un symlink a HTML y resumen/JSON en el mismo archivo. Sus regresiones ya pasan. Tras observar el sitemap real se añadió su caso exacto: **14 pruebas locales correctas**. Ese último caso es un delta de test; no se atribuye al run anterior de 13.
- Las ocho pruebas físicas existentes P-001–P-008 se enlazan a sus ocho filas en progress.csv; estaban sin referencia allí. No se cambia su estado ni se añaden casos para las otras herramientas. P-009 mantiene correo confirmado y push sin probar. Ocho pendientes, cero FALLA, cero IDs nuevos.
- PRUEBAS.md ahora exige que el agente complete primero lo reproducible y arregle los fallos conocidos antes de pedir una comprobación física concreta. En un compresor de PDF corresponden integridad/contenido/compresión/descarga con fixtures y navegador; no una prueba de micrófono. No se usa `n/a` para omitir controles aplicables.

No se ha verificado una nueva versión en producción: se han medido builds en Actions sin desplegar. El último sondeo público, del lote anterior, mantiene 25.625 URLs y tres soft404 conocidas. No se certifican las siete capas/18 controles por herramienta ni se marca ninguna terminada.

## Siguiente paso exacto

Continuar dentro del Paso A con la extracción de UI inglesa de los 14 propietarios de mercado que solo tienen metadatos y después los 106 recuperados, usando el listado de `translation-drafts/preflight-v1/source-coverage.json`. Mantener separada la preview hasta que exista una integración de publicación compatible y verificada. La fase 0 sigue pendiente. GitHub continúa su campaña sin revisión frase a frase del agente; los contadores no son aprobaciones de herramientas.
