# UsefulVerse · Método de traducción en masa

Fecha: 19 de octubre de 2026. **Especificación para la siguiente fase; no se ha instalado ni ejecutado el sistema propuesto.**

## Decisión recomendada

Construir **un único proceso local y reanudable**: inglés canónico → memoria de traducción compartida → lotes locales por idioma → comprobaciones → archivos estáticos. Una hoja XLSX o Google Sheets será una interfaz opcional de revisión. No hace falta crear una hoja en Drive para empezar.

La prioridad es traducir cada texto nuevo una sola vez, conservar las correcciones y evitar que el agente redacte manualmente 36 versiones de cada herramienta. No hace falta una voz literaria: sí conservar acciones, significado, unidades, negaciones y advertencias.

**Configuración inicial propuesta, que debe superar el piloto antes de congelarse:** CTranslate2 en CPU e INT8; M2M100 418M para los destinos que cubre; MADLAD400 3B exclusivamente para telugu, que M2M100 no cubre; OpenCC para derivar chino tradicional con revisión regional. Es una única cola con asignaciones fijas, no cambios improvisados de proveedor durante el trabajo. El modelo pequeño es una elección de ingeniería por tamaño; su ventaja de velocidad en este Mac todavía no está medida. Si el piloto no ofrece traducción correcta, se corrige la configuración antes de procesar las 300 herramientas.

Los modelos y revisiones se fijan en el manifiesto. M2M100 declara MIT y MADLAD declara Apache 2.0. El modelo OPUS inglés-dravídico también tiene licencia Apache 2.0 y cubre telugu, pero sus resultados publicados son débiles: no lo elegiría como sustituto automático solo por ser pequeño. NLLB-200 tiene licencia no comercial y no es la opción de este sitio con publicidad. [M2M100](https://huggingface.co/facebook/m2m100_418M), [MADLAD](https://huggingface.co/google/madlad400-3b-mt), [OPUS](https://huggingface.co/Helsinki-NLP/opus-mt-en-dra), [NLLB](https://huggingface.co/facebook/nllb-200-distilled-600M).

Referencias recuperables del piloto: M2M100 revisión `55c2e61bbf05dfb8d7abccdc3fae6fc8512fd636`; MADLAD revisión `fa184c675da0b5c9e1c8694fccd4e12e2d422094`. Conservar licencias, tokenizer y checksum de la conversión INT8. No descargar versiones móviles sin registrar el cambio.

## Lo que se ha observado en el proyecto

- Hay 700 herramientas públicas. El dominio principal tiene 277 herramientas con 36 versiones; el subdominio tiene 323 con 36 y 100 con 37. La nueva tanda debe usar 37 idiomas de forma explícita.
- El repositorio ya tiene traducción por lotes con Argos/CTranslate2. También hay un script antiguo que llama al endpoint no oficial de Google, agrupa textos con marcadores y escribe el paquete completo al finalizar. No partimos de cero; hay que unificar rutas, memoria y recuperación.
- Se inspeccionaron los paquetes ingleses de `voice-changer`, `shikaku` y `dxf-viewer`: 220 textos, 204 textos distintos entre los tres, 9.226 caracteres originales y 8.395 después de eliminar duplicados exactos. Esto no mide la calidad de traducción ni representa todas las herramientas.
- Escenario ilustrativo: repetir el tamaño medio de esos tres paquetes para 300 herramientas y 36 destinos supone unos **33,2 millones de caracteres fuente-destino antes de deduplicar**. Solo esos módulos de copy: el catálogo y otros textos pueden añadir volumen. No es una predicción exacta del proyecto.
- El equipo observado tiene Apple M3 y 16 GiB de RAM. No se descargaron pesos ni se midieron tiempos de inferencia en esta investigación.

## Comparación de vías

| Vía | Qué resuelve | Límites o costes relevantes | Decisión |
|---|---|---|---|
| Proceso local con memoria y CTranslate2 | Lotes, control de versiones, reanudación y coste por carácter cero | Consume tiempo, electricidad, RAM y disco; calidad por idioma a comprobar | Base recomendada |
| Argos Translate actual | Ya existe integración local, sin cuota de proveedor | Cobertura, licencias de paquetes y traducción puente varían | Migrar resultados útiles y aprovechar código; no suponer 37 idiomas completos |
| M2M100 418M | Modelo relativamente pequeño, muchos destinos, licencia MIT | No incluye telugu; no distingue pt-BR o zh-TW como modelos regionales | Motor principal candidato |
| MADLAD400 3B | Cobertura amplia, licencia Apache 2.0 | Más pesado; compatibilidad y rendimiento local pendientes | Destino telugu en la configuración inicial; evaluar antes de congelar |
| Google Sheets `GOOGLETRANSLATE` | Prototipos y revisión visible | No hay garantía de cuota ilimitada ni de procesamiento masivo estable | Interfaz opcional; no motor de producción |
| Apps Script `LanguageApp` | Automatización dentro de una hoja | Cuotas publicadas y límites de ejecución; no son las mismas cuotas que la fórmula de Sheets | No base del proceso |
| Google Cloud Translation | API documentada | Crédito equivalente a los primeros 500.000 caracteres mensuales para NMT; después precio por uso | No activar para esta tarea |
| Azure Translator F0 | API con tramo gratuito | 2 millones de caracteres al mes y límites por petición/tiempo; requiere cuenta y configuración | Alternativa con cuota, no método principal |
| DeepL API Free | API documentada | 500.000 caracteres mensuales; cobertura y límite no equivalen a infinitas traducciones | No cubre este lote sin esperas o pago |
| OpenAI Batch | Trabajos asíncronos con descuento del 50% frente a la modalidad síncrona correspondiente | API facturada, ventana de 24 h, 50.000 solicitudes/200 MB por archivo y cuotas de tokens por modelo | Alternativa de pago, no activada |
| Crowdin / Weblate alojados | Revisión, glosario y coordinación | Hosting privado y volumen de cadenas pueden ser de pago; el motor externo también cobra | Excesivo para un dueño y textos cortos |
| Weblate local | Gestor de traducciones libre | Servidor, mantenimiento e integración; no elimina el coste de un motor externo | Posible más adelante, innecesario para empezar |
| Endpoint no oficial de Google | Traducción aparentemente gratuita | Sin contrato estable de API, bloqueos y cambios de formato | Retirarlo del camino de producción futuro |

Fuentes de límites y alcance: [CTranslate2](https://opennmt.net/CTranslate2/guides/transformers.html), [INT8](https://opennmt.net/CTranslate2/quantization.html), [Argos](https://github.com/argosopentech/argos-translate), [Sheets](https://support.google.com/docs/answer/3093331?hl=en), [Apps Script](https://developers.google.com/apps-script/guides/services/quotas), [Google Cloud](https://cloud.google.com/products/translate/pricing), [Azure F0](https://learn.microsoft.com/en-us/samples/azure/azure-quickstart-templates/cognitive-services-translate/), [límites Azure](https://learn.microsoft.com/en-us/azure/ai-services/translator/service-limits), [DeepL](https://support.deepl.com/hc/en-us/articles/360020685720-Usage-count-and-billing-in-DeepL-API), [OpenAI Batch](https://developers.openai.com/api/docs/guides/batch), [creación de batches](https://developers.openai.com/api/reference/cli/resources/batches/methods/create), [Crowdin](https://crowdin.com/pricing), [Weblate](https://weblate.org/en/hosting/).

**Corrección del texto adjunto:** envolver `GOOGLETRANSLATE` en `ARRAYFORMULA` no elimina cuotas ni convierte el servicio en ilimitado. La fórmula documentada recibe texto, origen y destino. Se podría aplicar por fila en un rango acotado, pero no da una garantía para decenas de miles de filas. Tampoco OpenAI Batch es ilimitado ni está incluido sin coste adicional en la suscripción del chat. [ARRAYFORMULA](https://support.google.com/docs/answer/3093275?hl=en).

## Paso a paso de implementación futura

### 1. Capturar una línea base recuperable

Crear un manifiesto de las 700 herramientas y sus URLs antes de cualquier build. Resolver las 106 herramientas públicas ausentes del catálogo fuente. Conservar identificadores y traducciones existentes. No convertir la reconstrucción del catálogo en una oportunidad para renombrar o eliminar rutas.

### 2. Fijar los 37 locales y el inglés canónico

Locales del proyecto: `en`, `es`, `fr`, `pt-BR`, `de`, `ja`, `ko`, `id`, `hi`, `ar`, `zh-CN`, `bn`, `ru`, `ur`, `tr`, `vi`, `it`, `zh-TW`, `bg`, `ca`, `nl`, `el`, `ms`, `pl`, `sv`, `th`, `uk`, `sw`, `mr`, `te`, `ha`, `fil`, `ta`, `fa`, `am`, `gu`, `nb-NO`.

El identificador de ruta existente para filipino debe conservarse aunque el modelo use `tl` o `fil`. Leer el mapeo real del código antes de generar enlaces. M2M100 usa `tl`, `no`, `pt` y `zh`; el manifest debe mapearlos desde los locales del producto. Inglés no necesita traducción. `pt-BR` necesita glosario regional; `nb-NO` requiere comprobar que no aparezcan formas de nynorsk. OpenCC transforma escritura china, no demuestra adecuación cultural ni técnica. [OpenCC](https://github.com/BYVoid/OpenCC).

### 3. Extraer texto, no código

Recoger títulos, botones, etiquetas, estados, errores, ayuda, accesibilidad y metadatos SEO mediante claves estables. No enviar módulos JavaScript completos al modelo. Separar frases de HTML, URLs, expresiones regulares, fórmulas, nombres de archivo y unidades. Definir ramas plurales de forma estructurada; no concatenar fragmentos traducidos.

### 4. Importar una memoria compartida

Reutilizar traducciones existentes solo cuando coincidan fuente y contexto. Marcar su procedencia como `legacy-import`, sin llamarles revisadas si no lo están. La clave de memoria incluye idioma fuente, texto normalizado, contexto semántico, firma de placeholders y destino. No fusionar indiscriminadamente un `Save` que significa guardar con otro contexto que significa ahorrar.

Usar SQLite como cola y memoria local, con transacciones y copia recuperable del estado. Mantener motor, revisión y fecha como metadatos. Una actualización del modelo no debe invalidar silenciosamente traducciones ya aprobadas.

### 5. Proteger elementos que deben conservarse

Extraer y validar placeholders (`{count}`, `{value}`, `%s`), tags permitidos, enlaces y tokens. Restaurarlos después de traducir y exigir igualdad de conjunto y multiplicidad. Si el modelo pierde un token, la cadena queda pendiente; no se publica una reconstrucción adivinada. Cifras de ejemplo, signos y negaciones requieren comprobación específica.

### 6. Glosario corto y reutilizable

Empezar con acciones y términos recurrentes: calcular, copiar, borrar, reiniciar, descargar, archivo, fila, columna, tasa, plazo y cuota. Guardar una traducción por sentido y destino. Aprobar estas cadenas una sola vez y bloquearlas frente a retraducciones automáticas. El glosario reduce tanto inferencia como inconsistencias.

### 7. Correr lotes por idioma, longitud y motor

Mantener un proceso por motor y cargar pesos una vez. Agrupar cadenas de longitud similar. Empezar el piloto con lotes pequeños, un trabajador y un límite de hilos; ajustar tamaño por RAM observada. Limitar tokens de salida, conservar texto completo y dividir por límites de frase, nunca truncar contenido para que quepa.

La configuración inicial puede usar beam pequeño y traducción determinista, pero el tamaño del lote, número de hilos y máximo de tokens se fijan tras medir. CTranslate2 soporta M2M100, Marian y T5; no se debe asumir aceleración CUDA en un Mac. No ejecutar inferencia en Workers, Containers ni APIs de pago.

### 8. Guardar cada lote y poder reanudar

Estados: `pending → running → translated → checks-passed → approved → exported`, con `needs-review` y `failed` explícitos. Confirmar cada lote en una transacción. Exportar archivos temporales y hacer reemplazo atómico. Al interrumpirse, devolver a pendiente los trabajos incompletos y saltar los hashes ya terminados.

Un chat nuevo debe leer el manifiesto y el progreso, no reconstruirlo de memoria. Esto conserva trabajo ante interrupciones; no elimina ni elude límites de uso de Codex o de otros servicios.

### 9. Comprobar corrección funcional mínima

Exigir: todas las claves presentes, ninguna cadena vacía, placeholders idénticos, no alteración de cifras normativas, ningún fallback inglés contado como traducción terminada y recursos de idioma correctos. La detección automática de idioma y escritura es una señal, no una prueba de significado.

Revisar los verbos de acción, errores, resultados y advertencias de cada idioma, más una muestra inicial de al menos 20 cadenas variadas por destino. Mantener un pequeño conjunto de frases de referencia comprobadas y registrar fallos de sentido. La retrotraducción puede detectar problemas, pero no valida por sí sola la corrección. Ante un error repetido se detiene esa combinación de modelo/idioma y se corrige antes de ampliar el lote.

Instrumentos clínicos, citas legales y textos normativos con traducción oficial deben conservar la versión autorizada: no reemplazarlos por traducción automática para completar una casilla.

### 10. Revisar lógica global

Idioma, país, moneda, unidades y reglas son elecciones separadas. Una persona que abre la interfaz española no debe recibir automáticamente normativa española ni juegos cuya cultura desconoce. Los juegos deben mostrar las reglas o permitir elegir una variante; los cuestionarios deben identificar el instrumento; las calculadoras nacionales deben nombrar la jurisdicción y el año.

Usar `Intl` para cifras, fechas y moneda, con entrada que admita formatos locales. Contemplar RTL, textos largos y alfabetos no latinos. Una herramienta estadounidense puede ser útil en español, pero debe seguir identificándose como estadounidense. No traducir un nombre de impuesto como si fuese equivalente en otro país.

### 11. Hoja de revisión opcional

Columnas: `tool_id`, `key`, `source_en`, `context`, `locale`, `translation`, `status`, `source_hash`, `engine_revision`, `review_note`. Una fila es una traducción concreta. La importación se hace por clave y hash, no por posición de fila. Importar solo traducciones marcadas y verificar que la fuente no haya cambiado. Tratar entradas que empiezan por `=`, `+`, `-` o `@` como texto cuando sean contenido, para evitar fórmulas no deseadas.

Si se usa Google Sheets, trabajar con rangos acotados y congelar resultados como valores antes de exportar. No introducir claves de API, datos de usuarios ni documentos privados. No es necesario que Pedro mantenga manualmente 300 hojas.

### 12. Exportar una vez y desplegar después de la verificación

Generar los módulos de idioma, rutas, canonical y hreflang desde el mismo manifest. La aceptación futura requiere 37 versiones completas de cada herramienta nueva y conservación de todas las URLs previas válidas. El proyecto tiene actualmente 25.625 URLs de sitemap entre ambos hosts; no debe sustituirse esa línea base por el catálogo incompleto de 594 herramientas.

Los comandos de un futuro runner podrían ser `extract`, `translate --resume`, `review-export`, `review-import`, `validate` y `build`. **Son una interfaz propuesta, todavía no comandos disponibles en este repositorio.**

## Piloto antes de procesar 300

1. Usar tres herramientas con vocabulario distinto, reutilizando las muestras examinadas, y los 36 destinos.
2. Registrar cadenas nuevas, aciertos de memoria, caracteres, tiempo de arranque, tiempo total, errores y pico de RAM. Comparar una ejecución completa y otra de reanudación sin cambios.
3. Interrumpir un lote de prueba y comprobar que solo se repite la unidad incompleta. Esto se hará al implementar, no durante esta tarea de planificación.
4. Comprobar significado de acciones y resultados, no estilo nativo. Telugú, hausa, amárico y otros destinos con menos recursos requieren una muestra reforzada, no aprobación automática.
5. Medir `horas_estimadas = cadenas_nuevas / cadenas_por_hora_observadas`; publicar rango y margen. No dar hoy una cifra de horas inventada.
6. Congelar motor, revisiones, glosario y parámetros tras superar el piloto. Procesar el resto por tandas recuperables, sin reabrir la elección de proveedor para cada herramienta.

## Coste y actualización

La ruta recomendada no tiene factura por carácter ni una cuota mensual de proveedor. Sí tiene coste de equipo, electricidad, almacenamiento y tiempo. No se activó ninguna API de traducción, suscripción o descarga de pesos en esta tarea. El límite autorizado de 3 USD corresponde exclusivamente a la investigación SEO.

Traducir automáticamente no mantiene vigentes las leyes ni los datos. Cada herramienta dependiente de datos tendrá `source_url`, `license`, `effective_from`, `checked_at`, `review_due`, versión y propietario de actualización. Si una fuente o regla caduca, mostrar su fecha y suspender la estimación que dependa de ella hasta revisarla. Un feed meteorológico se refresca por la cadencia del proveedor; una tabla fiscal, cuando cambie su ejercicio o norma. No es correcto prometer «actualizada siempre» sin una política de caducidad y seguimiento.

## Resultado de esta tarea

Se entrega el método, el diseño de cola/memoria, el piloto y los criterios de aceptación. Quedan para la fase de implementación: instalar dependencias en entorno aislado, obtener los modelos con sus revisiones, medir velocidad/calidad, programar el runner y generar traducciones. No se ha modificado el código publicado.
