# 28-oct · Calidad automática sin repetir revisión manual

Pedro acepta algo más de tiempo de CPU gratuito para conservar significado, sin invertir días en una frase ni revisar idioma por idioma en el chat. Se conserva el motor fijado y se añade una única búsqueda adicional de hasta dos propuestas (beam 4) solo a las dudas. Cada propuesta conserva estructura/datos, se retrotraduce y pasa los umbrales semánticos actuales. La que no pasa sigue retenida. No se sustituye un original que pasa todos los controles actuales.

## Evidencia

- [Prueba actual 40578541656](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40578541656), fuente abcafa4: 4 de 12 cuarentenas rescatadas; ocho siguen retenidas; 19 originales conservados. Mediana 2,4585 s y máximo 8,793 s por frase en esta muestra, tras inicialización de 217,031 s; cero ms facturables reportados. No son cuatro herramientas ni idiomas terminados.
- 1.586 juicios anteriores del agente se compilan con fuente/destino/ubicación y hashes de revisión/registro; no son juicios nuevos ni revisión nativa. Se conservan las 905 memorias y los 35 checkpoints/17.441 registros históricos.
- Calibración automática de 186 casos: 140 aceptados antes y 46 rechazados. El filtro de similitud/retrotraducción por sí solo aceptaba 29 errores conocidos: la regresión exacta ahora veta los 46. No se declara equivalencia universal con revisión del agente; solo 73/140 ejemplos aceptados antes pasan también el filtro automático y los demás quedan retenidos por prudencia. Ningún idioma queda aprobado para publicar.
- [CI completa 40577503166](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40577503166), fuente 8209261: 3.049 Node + 441 Python (439 correctas, dos omisiones), cero fallos/errores; Python 1587,204 s/cuatro procesos. Builds principal/hub, gate existente y 10.800 páginas noindex correctos, cero deploys.
- Cambios posteriores de presupuesto/semillas: 34 contratos Python y dos Node en la prueba real; último test de carga/reanudación: 35 Python enfocados y dos Node correctos localmente. Hay regresión roja/verde para no dar por terminado un intento cuyo tiempo vence, límite de alternativas, texto vacío/entrada >512 tokens, datos cambiados, aprobación falsa y modificación de juicios previos. Los umbrales y la evidencia histórica no se rebajan.

## Operación

Los registros originales son inmutables. `UVREFINE_RECORD` conserva propuestas y decisión ligadas a sus bytes y a la política, incluyendo el hash del veto histórico. Un intento completado no se repite; uno incompleto queda pendiente. Doce resultados exactos de la prueba se guardan en `quality-v1/checkpoints/` y se recuperan mecánicamente para no repetirlos. El informe añade resultados por idioma, pendientes de refinamiento y rescatados. El adaptador de paquetes verifica también `quality_policy`; todavía no se conecta a producción ni activa herramientas.

La campaña 40565692987 continúa sin cancelarse, fijada a su fuente anterior; la nueva calidad entra cuando arranque la siguiente campaña desde la rama de fuentes actual. No escribir datos nuevos en la rama de resultados mientras el escritor antiguo sigue activo. Todo sigue en Actions público estándar CPU; sin APIs de pago, artifacts/cache facturable, Codespaces, Containers ni Cloudflare.

Producción: cinco GET y dos XML, 25.625 URLs; las tres rutas falsas del hub siguen respondiendo 200. Sin despliegues/activaciones/envíos. Pedro confirma por captura la recepción de correos de GitHub: P-009 OK; ocho pruebas físicas pendientes, cero FALLA y push del teléfono no comprobado. Los mensajes `stopped`/`pending` de la captura pertenecen a la migración y a la prueba previa; la tanda actual sigue activa.

Fuentes: [decodificación CTranslate2](https://opennmt.net/CTranslate2/decoding.html), [Actions público gratuito](https://docs.github.com/en/actions/concepts/billing-and-usage). Evidencia: [benchmark](../translation-drafts/quality-v1/benchmark.json), [CI](../translation-drafts/quality-v1/ci.json), [GET/XML](../translation-drafts/quality-v1/production.json). Siguiente: dejar que GitHub continúe y retomar los pendientes de Paso A, sin avanzar fase ni releer todas las traducciones.

Cierre: respaldo remoto y eliminación directa del clon/datos/logs/pycache propios comprobados, 40.7 GiB libres; candado LIBRE. [Retirada y estado](../translation-drafts/quality-v1/closure.json).
