# Piloto de traducción · evidencia y reanudación

20-oct-2026 · Codex · PR [#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136).
Dependencia del Paso A; no habilita ninguna herramienta ni idioma. **Idiomas aprobados por este piloto: 0.**
Código y checkpoints de esta guía están en `feat/new-tools-batch-1` hasta integrar el PR; no confundirlos con `main`.

## Corpus y método

- Tres herramientas reales del método: `voice-changer`, `shikaku`, `dxf-viewer`.
- 214 unidades de contenido; 40 referencias fijas con botones, errores, cifras, marcadores y negaciones.
- 37 idiomas, contando inglés fuente y `nb-NO`. La ausencia de traducciones actuales se conserva como `null`.
- Corpus reproducible: `node scripts/localization/pilot-corpus.mjs <salida.json>`.
  SHA-256 de fuentes/contextos: `973363f6406d71eb55da472f83cfa0b75c33f95a106ddd48f12bdda2cc118554`.
- Candidatos: traducción publicada actual, M2M100 418M (MIT) y MADLAD-400 3B (Apache-2.0), revisiones fijadas
  en `scripts/localization/translation-pilot.py`. M2M100 no soporta `te`: no se inventa cobertura.
- Cada candidato se retrotraduce. Se guardan texto crudo y restaurado, marcadores, cifras, idioma detectado,
  alfabeto, longitud, truncamiento, tiempos, revisión del modelo y commit/run de procedencia.
- `machine-draft` es el único estado permitido a la salida automática. La puntuación y la aprobación requieren
  revisión separada con la rúbrica 0–3 de REVISION-FINAL §2 y el umbral de RUNBOOK §8.1.

## Ejecución sin gasto variable

Solo GitHub Actions del repositorio público, `ubuntu-latest`, máximo dos máquinas estándar simultáneas,
90 minutos por trabajo. Sin GPU, máquinas grandes, API de pago, artefactos nuevos, cachés persistentes ni LFS.
El job tiene `contents: read`, checkout sin credenciales persistidas y ningún secreto/paso de publicación.
La ejecución/descarga de modelos se rechaza fuera de Actions Linux. En el Mac solo se extrae el corpus y pasan tests ligeros.

```sh
gh workflow run deploy-cloudflare.yml -R pedronunezwebs-hash/usefulverse \
  --ref feat/new-tools-batch-1 -f translation_pilot=true \
  -f pilot_engine=both -f pilot_scope=references -f pilot_locales=es,nb-NO
```

Primero se mide esta tanda corta; después las 40 referencias de los 36 destinos y las tres herramientas completas.
No confundir un job verde con aprobación lingüística.

## Recuperar resultados, incluso si se interrumpe el job

Los registros completos aparecen individualmente en los logs como `UVPILOT_RECORD` (JSON/base64).
No contienen secretos ni datos de usuarios: únicamente copy público y traducciones candidatas.

```sh
gh run view <run-id> -R pedronunezwebs-hash/usefulverse --log > <logs-locales>
python3 scripts/localization/translation-pilot.py collect \
  --logs <logs-locales> --output docs/quality/translation-pilot/checkpoints/<motor>.jsonl
```

Para ambos motores, recoger el log de cada job en su archivo. Se rechazan registros aprobados, fuentes obsoletas,
revisiones desconocidas y duplicados contradictorios. Hacer commit/push de los checkpoints antes de cerrar.
El workflow los usa al reanudar; un checkpoint completo evita incluso descargar el modelo. Un cambio en fuente,
contexto, modelo, traducción actual o beam genera una identidad distinta y se vuelve a medir.

## Estado

- [x] Corpus y contratos de seguridad/reanudación con tests permanentes.
- [x] Workflow validado con Actionlint 1.7.12.
- [x] Comparación real corta de ambos motores en Actions; 320 registros, incluyendo la traducción actual.
- [x] 40 referencias computadas por destino, incluida la traducción actual donde existe; 4.809 registros guardados.
- [ ] Rúbrica del agente y elección documentada por idioma; no inventar revisión nativa.
- [ ] Tres herramientas completas, muestra de 20 frases por idioma, bokmål confirmado y umbral superado.
- [ ] Memoria y paquetes reales de las 300 en los idiomas aprobados.

## Primera comparación real: español y bokmål

[Run 39402041888](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402041888), commit `46f3a8d`.
Ambos jobs completados; el job de publicación quedó omitido. 40 frases × 2 destinos × 2 candidatos × 2 motores =
320 registros recuperados de los logs y guardados como JSONL. La traducción actual se revisa una vez aunque tenga
dos retrotraducciones. [Rúbrica del agente](https://github.com/pedronunezwebs-hash/usefulverse/blob/f8fe9291a4364431699fffe3b5af6d1593ebf1a8/docs/quality/translation-pilot/review-es-nb.json): 240 traducciones únicas evaluadas,
sin afirmar revisión nativa. Cada evaluación referencia el hash del texto y los registros concretos; un test impide
desvincular la puntuación de la traducción observada.

| Destino | Actual | M2M100 | MADLAD | Decisión |
|---|---:|---:|---:|---|
| es | 349/360 | 267/360 | 324/360 | Ninguno supera el umbral; preferencia provisional por actual tras corregir |
| nb-NO | 329/360 | 275/360 | 350/360 | Ninguno supera el umbral; preferencia provisional por MADLAD tras corregir |

La nota total no sustituye el umbral de cero errores en botones, cifras y negaciones. En esta primera tanda se registraron 60 salidas
incorrectas observadas como regresiones de contexto/hash, incluidas las negaciones `Nr.` de la traducción actual.
El control de tokens técnicos detecta además la pérdida de `.dxf`; la pérdida de `{duration}` de MADLAD se rechaza,
sin reconstruir ni adivinar el marcador. `automatic-summary.json` se recalcula desde los checkpoints con las reglas
actuales. **Estas combinaciones es/nb no pasan a traducción masiva.** Se necesitan glosario por sentido y una nueva
configuración piloto; no basta con un modelo más grande.

| Motor | Conversión | Total de la tanda | Pico RSS del proceso de inferencia |
|---|---:|---:|---:|
| M2M100 | 18,81 s | 70,99 s | 844.460 KiB |
| MADLAD | 77,21 s | 281,74 s | 3.771.300 KiB |

Son medidas de dos destinos y 40 referencias, no una predicción de las 300 herramientas ni de todo el catálogo.
El pico no incluye el subproceso de conversión. Los checksums de los modelos INT8 están en `UVPILOT_MODEL` del run;
se conservarán en el informe del lote. Dependencias pesadas verificadas en Actions: CPU-only Torch, conversor,
tokenizers y carga del modelo binario de langid. NumPy está fijado en 2.2.6: la primera ejecución con 2.5.4 falló
en Python 3.11 y las versiones ≥2.3 eliminan una operación binaria usada por langid 1.1.6.

Al recuperar una ejecución reanudada, el recolector **fusiona** sus registros con el checkpoint anterior y reemplaza
el JSONL de forma atómica. Los tests cubren conservación del lote previo, logs truncados y duplicados incompatibles.
Un cambio en el algoritmo de inferencia requiere cambiar la versión de formato/identidad antes de reutilizar resultados.

## Referencias adicionales y fuentes de las 300

[M2M100 completo de referencias](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402644071):
40 frases en sus 35 destinos soportados; `te` queda explícitamente sin ese motor. Checkpoint fusionado de **2.371 registros**
(1.400 salidas del modelo y 971 actuales con retrotraducción). Las 160 filas iniciales es/nb se reutilizaron;
el run añadió 2.211 registros en 481,10 s, incluidos 33,59 s de conversión. Pico RSS de inferencia: 1.019.372 KiB.

La [revisión de otros seis destinos](https://github.com/pedronunezwebs-hash/usefulverse/blob/f8fe9291a4364431699fffe3b5af6d1593ebf1a8/docs/quality/translation-pilot/review-core-six.json) compara las **40 referencias** en
de/fr/pt-BR/ja/hi/ar: 402 traducciones (40 del modelo + 27 actuales por destino; faltan las 13 actuales de DXF).
Con es/nb, **642 traducciones únicas evaluadas** por el agente y **202 salidas rechazadas** registradas como regresiones.
Esas combinaciones no superan el umbral. Esta revisión tampoco afirma revisión nativa ni sustituye los controles del lote.
No interpretar `known_semantic_errors=0` en los otros destinos como aprobación: falta su revisión.
La longitud y el alfabeto son señales de revisión; las siglas técnicas y la densidad del chino pueden producir avisos
sin un error de sentido. La retrotraducción se valida por separado: un texto correcto de ida no oculta cifras perdidas a la vuelta.

[MADLAD completo de referencias](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402907694):
**36 destinos × 40 referencias = 1.440 salidas del modelo**, más 998 actuales con retrotraducción, **2.438 registros**.
Se reutilizaron 160 filas es/nb y se añadieron 2.278. Tiempo del run: **2.278,69 s** (conversión: 136,74 s);
pico RSS de inferencia: **3.985.808 KiB**. Los hashes de las conversiones INT8 coinciden entre la tanda corta y la
completa en ambos motores. Detalle: `run-evidence.json` y `reference-coverage.json`.
Con los dos motores, **4.809 registros** guardados. Es la comparación de referencias; **el piloto completo de tres
herramientas y la aprobación de idiomas siguen pendientes**. No procesar las 300 con una combinación que haya fallado.

Preparar las fuentes de las 300 sin importar una BD ni traducir nada:

```sh
node scripts/localization/prepare-candidate-sources.mjs <directorio-temporal>
```

Produce 300 JSON con `sourceCopy` + unidades estables y un manifest reproducible: **15.815 unidades**, **7.887 textos
distintos**, **9.505 unidades con contexto**, **681.101 caracteres fuente**. El manifest está guardado en
`translation-pilot/candidate-source-manifest.json`; los JSON completos se regeneran desde la fuente versionada.
`relatedTools`, `outputName`, identidades y fechas de revisión quedan intactos. Los tests evitan volver a enviarlos al motor
y verifican que estén las 300 candidatas exactas, incluidos sus slugs históricos. No son paquetes aprobados para publicar.

Fuentes primarias: [M2M100](https://huggingface.co/facebook/m2m100_418M),
[MADLAD-400](https://huggingface.co/google/madlad400-3b-mt),
[conversión CTranslate2](https://opennmt.net/CTranslate2/guides/transformers.html),
[facturación de Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

## Segundo lote: sentido, literales y memoria revisada

Las variantes se conservan separadas, con su JSON de política inmutable y digest en la identidad de checkpoint.
No editar una política ya medida: crear una versión nueva. Baseline sigue intacto (4.809 registros).

- `context-v2`: diez sentidos explícitos en inglés y segmentación alrededor de todos los literales. Ambos motores
  terminaron las referencias es/nb, 320 registros. **Descartada**: conserva muchos tokens, pero rompe la gramática,
  elimina condiciones (milímetros) e inventa cifras. M2M100 no se amplía en esos pares.
- `context-v3`: mantiene frases completas y literales visibles, sin marcadores artificiales. MADLAD, 160 registros.
  Mejora el sentido, pero traduce `{duration}` y pierde `.dxf` en bokmål; los controles lo rechazan.
- `context-v4`: frases completas y **siete entradas exactas de memoria revisadas por el agente** (dos es, cinco nb).
  Un acierto evita inferencia de ida; se marca `translation_origin=reviewed-memory` y su digest, nunca como salida cruda
  del modelo. Se retrotraduce igualmente. No se adivina la restauración de un marcador que el modelo haya perdido.
  Las fuentes canónicas y la interfaz publicada no cambian. La memoria exige coincidencia de clave, fuente, hash,
  contexto y destino; no se aplica por palabras parecidas ni por posición.

[Referencias v4, run 39436428601](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39436428601):
40 frases por idioma; 160 registros incluyendo copia actual y retrotraducción. Resultado de revisión del agente:
**es 360/360; nb 358/360**, cero errores en botones/cifras/negaciones y dos leves de concordancia en 40 frases nb.
Cumple el umbral de referencias (máximo 1 leve/20); **no aprueba el idioma ni la herramienta**. Seis señales de
longitud son acciones inglesas muy cortas desambiguadas; revisadas expresamente en la rúbrica, siguen visibles.
Las dos mejoras de concordancia nb permanecen como regresiones pendientes de pulir.

Solo después de esa revisión se inició el [piloto completo es/nb 39437391534](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39437391534),
214 unidades en total entre las tres herramientas, conservando y reutilizando los 160 registros de
referencias. El estado final y los fallos están en `lotes/2026-10-20-piloto-contexto.md`; no inferir aprobación del job verde.

```sh
gh workflow run deploy-cloudflare.yml -R pedronunezwebs-hash/usefulverse \
  --ref feat/new-tools-batch-1 -f translation_pilot=true -f pilot_engine=madlad \
  -f pilot_policy=context-v4 -f pilot_scope=full -f pilot_locales=es,nb-NO
```

Los checkpoints de cada variante van en `checkpoints/context-vN/<motor>.jsonl`. Recoger cada log del job con `collect`
(fusiona el checkpoint previo) y regenerar los informes. `summarize` distingue política, motor, idioma y candidato;
recalcula los controles y audita la traza de fragmentos. El test de reanudación usa el checkpoint real de referencias;
no descarga ni importa un modelo en el Mac. Una identidad contextual no puede hacerse pasar por baseline ni viceversa.
Los tokens técnicos se comprueban también en la vuelta: una ida correcta no oculta que desaparezca `.dxf` al volver.

Las 40 referencias MADLAD baseline en de/fr/pt-BR/ja/hi/ar están ahora revisadas por el agente, sin afirmar revisión
nativa. Sus rúbricas se conservan ligadas a los registros exactos; todas esas combinaciones necesitan correcciones.
Las cifras de evaluaciones pueden repetir texto entre candidatos y variantes: no llamarlas frases únicas nuevas.

### Resultado del piloto completo v4 es/nb

[Run 39437391534](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39437391534) terminado:
**856 registros** (214 unidades × 2 idiomas × sistema híbrido/actual), de los que 160 se reutilizaron y 696 son nuevos.
975,22 s, incluida conversión 74,97 s; pico de inferencia 4.065.256 KiB. **Ambos idiomas rechazados** tras la muestra
ampliada fijada antes de recoger resultados (`full-sample-plan.json`): 68 claves del sistema híbrido y 20 actuales por
idioma, 176 evaluaciones nuevas, además de las referencias. Hay Clear/clean incorrectos, frases finales omitidas,
versiones y símbolos de unidad alterados. No confundir computar las 214 cadenas con aprobarlas.

Total guardado: **6.145 registros**, **1.378 evaluaciones** que pueden repetir texto entre variantes y **410 salidas
problemáticas registradas como regresiones**. `automatic-summary.json` se recalcula para todas las políticas; las
alertas de longitud/igualdad pueden necesitar juicio técnico, pero los fallos de privacidad/cifras/botones impiden aprobar.
El control de unidades solo aplica a sus etiquetas: no interpreta la preposición inglesa in como símbolo de pulgadas.

Siguiente: **v5 nueva**, manteniendo v2/v3/v4 y sus checkpoints. Corregir familias completas y FAQ duplicadas por sentido;
conservar todas las frases de cada párrafo; tratar versiones y símbolos como datos. Repetir primero referencias y luego
el completo es/nb con la misma muestra y controles. Después los otros 28 destinos pendientes de revisión.
**0 idiomas aprobados, 0 paquetes de las 300 publicados por este piloto.** Detalle de fallos: `review-context-v4-full.json`.

## Variante v5 · oraciones cubiertas y datos tipados

`context-v5` conserva v2/v3/v4 sin cambios. Fuente: `pilot-coverage-policy.json`: 22 entradas de inglés controlado
por clave/hash/contexto y 69 destinos de memoria revisada (presets, acciones, unidades, licencias y correcciones anteriores).
Las FAQ duplicadas tienen entradas explícitas del mismo sentido; no se fusionan textos por parecido.
Cada oración se envía y registra por separado. Versiones, símbolos de unidad, URLs, código y placeholders se copian en
sus posiciones conocidas, con trazas completas de origen/ensamblado. No se reparan marcadores deduciendo dónde estaban.
La cobertura de oraciones comprueba que ninguna se omite como unidad; no demuestra que el modelo conserve todas las
ideas dentro de una oración. La rúbrica del agente y los controles de cifras/negaciones siguen siendo obligatorios.
Las versiones se comprueban también en la vuelta, recalculando las señales de checkpoints antiguos sin alterarlos.

Regresiones nuevas: párrafo con privacidad/límites al final, oración intermedia vacía, lote incompleto, datos repetidos,
inyección de unidad, URLs/código que contienen versiones/símbolos, procedencia y fuentes exactas. 42 tests Python
(40 correctos; 2 dependen del job de modelos), además de los tests Node de corpus. No es certificación de las siete capas.
Referencias: [run 39452889204](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39452889204), código `4c477b7`.
La política es un candidato híbrido con memoria, no una medición del modelo sin ayudas ni una revisión nativa.
Los resultados y la decisión se añaden tras leer las traducciones y las vueltas. No hay idiomas aprobados.

### Decisión de referencias v5 y repetición v6

160 registros v5, 80 evaluaciones ligadas a texto/hash: es **357/360, rechazado** por negación de privacidad ambigua
(«not uploaded» → «no es cargado»); nb **359/360**, solo referencias, un leve Det/Den. No se ejecutó el completo v5.
V4 decía «no es subido»: el fallo se observa en el candidato nuevo, no se atribuye a una ida previa correcta.
Dos fixtures nuevos elevan regresiones a **412**. Se conservan las políticas/checkpoints anteriores.
`context-v6` (`pilot-privacy-policy.json`) hereda la cobertura v5 y añade un sentido y dos destinos de memoria de
privacidad: **23 entradas controladas, 71 destinos de memoria**. El resto del corpus y la rúbrica se mantienen.
[Referencias v6 39454358926](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39454358926), código `7212c33`;
se decide el completo únicamente tras leer el nuevo resultado. No hay idiomas aprobados.

La revisión de PLAN §9 exige muestra doble en ha/ am/ te/ gu/ ta/ mr/ sw: **80 cadenas**, no solo las 40 referencias.
Antes de aprobar esos destinos se debe ejecutar el corpus completo y fijar la muestra ampliada, además de los controles
automáticos. Los checkpoints baseline de 40 no cierran ese gate; no hay ninguno aprobado.

### Completo v6 · rechazado en es y nb

[Run 39455323981](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39455323981), fuente `0e8e63e`:
856 registros (160 referencias reutilizadas + 696 nuevas), 214 unidades por destino y candidato/actual, 71 aciertos de
memoria en total. 930,07 s, conversión 91,89 s, pico inferencia 3.852.792 KiB. Tests reales del runner: 44 correctos;
la auditoría posterior añade control de identificadores de paquete y se comprueba con 45 tests en CI.

Se mantienen las 68 claves v4 y se añaden 20 fijadas por semilla en `b8776ae` antes de recoger resultados.
176 candidatos revisados + 40 evaluaciones actuales conservadas al verificar fuente/texto idénticos = 216 evaluaciones.
Con las referencias: 128/214 candidatos revisados por destino, no todo el texto. Revisión del agente, no nativa.

| Candidato/muestra | es | nb | Decisión |
|---|---:|---:|---|
| v4, mismas 68 claves | 539/612 | 555/612 | Rechazado |
| v6, mismas 68 claves | 586/612 | 569/612 | Rechazado |
| v6, 20 adicionales | 169/180 | 166/180 | Rechazado: 4 y 5 filas imperfectas, respectivamente |

En los candidatos v6 no hay pérdidas de símbolos/ versiones ni trazas vacías; se conservan las frases finales
omitidas por v4 en los casos revisados. Persisten: worker como empleado humano; upload/load en privacidad DXF;
Drawing bounds como acción de dibujar; vocals como vocales; aplica como concierne; pitch-rate sin traducir; Name
pegado al nombre nb; concordancias y compuestos. Las salidas concretas quedan como regresiones.
200.000/200 000 y coordenadas sin espacios conservan valores, pero el contrato literal actual no lo reconoce:
requiere datos tipados, sin normalización adivinada. Una vuelta cambia dxf-parser a dxf parser aunque conserva versiones:
el nuevo control de identificadores lo detecta. Fallos de vuelta se señalan sin atribuirlos a idas correctas.

**7.161 registros · 1.754 evaluaciones registradas (con texto/rúbricas repetidas) · 464 fixtures (456 ida, 8 vuelta).**
**0 idiomas aprobados**. Siguiente: política v7 independiente para las familias anteriores, tipos de coordenadas/números
y nombres de software. No editar v2–v6 medidos. Repetir referencias y el mismo completo es/nb antes de ampliar; después
revisar 28 destinos restantes, con muestra de 80 en los siete idiomas de pocos recursos. Sin traducción masiva ni fase 0.


## Contexto técnico v7 · decisión inicial retirada

Política independiente `pilot-technical-policy.json` (38 entradas controladas, 53 memorias por clave y 101 destinos).
Desambigua worker como tarea en segundo plano, entity como objeto geométrico y vocals como pista de voz;
explicita los efectos de audio y la relación tono/velocidad. Conserva las FAQ de fuente idéntica por contexto.
Nombres y etiquetas ambiguas proceden de memoria revisada por el agente, con origen/digest explícitos, sin
revisión nativa ni atribución al modelo. V2–v6 medidos permanecen intactos.

El segmentador v7 copia cantidades, coordenadas y nombres de software en posiciones de origen conocidas.
Los auditores de valores usan Decimal exacto y coordenadas ordenadas; diferencian un formato local equivalente
de un cambio de valor. El contrato literal previo se conserva por separado y no se reparan salidas del modelo.
Notación numérica copiada literalmente = contrato de dato de origen; si cambia, gramática explícita es/nb,
sin inferir formatos de otros idiomas ni grupos mal formados. Versiones/URLs/código no se cuentan como cantidades.

51 tests Python locales (49 pasan, 2 dependencias reservadas a Actions). Código `203422e`.
[Referencias v7 39483290546](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39483290546),
es359/360 y nb360/360: solo referencias. Rúbrica y tres hallazgos de vuelta guardados; completo todavía pendiente. `full-sample-v7-plan.json`
conserva las 68 claves y 20 adicionales de v6: ya observadas, no son una muestra ciega de v7. No se aprueba idioma
alguno por tests verdes ni se avanza a fase 0. [Informe del lote](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-21-piloto-v7.md).

Referencias v7: 160 registros, 13 aciertos de memoria, 186,10 s; 51 tests reales pasan. Tras el refuerzo del auditor: 52 tests locales (50 correctos y 2 de dependencias), 467 fixtures. Total 7.321 registros y 1.834 evaluaciones, 0 idiomas aprobados. La capitalización del ejemplo español es un caso leve ya conocido; las vueltas se auditan por separado.


### Corrección del gate v7 y variante v8

La evaluación inicial v7 de 359/360 y 360/360 se retiró al contrastarla con los avisos del registro: la respuesta
a «Is my recording uploaded?» no conservaba No/Nei explícito, aunque negaba recepción por UsefulVerse.
La rúbrica heredada no había resuelto esa contradicción. Evaluación corregida **357/360 y 358/360**: ambos
rechazados, sin afirmar una fuga de audio. Completo v7 39484416039 cancelado, 0 registros emitidos, limpieza
correcta. Política v7 intacta; decisiones anteriores conservadas en Git y en `supersedes`.

V8 (`pilot-explicit-negative-policy.json`) hereda v7 y añade memoria precisa para ambas FAQ y el ejemplo español:
55 claves/106 destinos. Inglés controlado con «never uploaded». 53 tests locales (51 correctos, 2 dependencias),
468 fixtures; sin modelos en Mac. Mismo plan de muestra en `full-sample-v8-plan.json`; referencias por repetir,
0 idiomas aprobados. Ninguna traducción masiva ni fase 0 con el Paso A abierto.


### Resultado v8 · gate numérico cerrado

[Referencias v8 39485133272](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39485133272): 160 registros,
16 memorias, 268,07 s; 53 tests reales con dependencias pasan, limpieza correcta. **es353/360 rechazado** por
«30 10 segundos» frente a 30. El guard rechaza el dato añadido, conserva el crudo y no lo repara por conjetura.
**nb360/360 pasa solo referencias**. No se ejecuta completo v8. Fuente/pesos iguales no garantizan frases iguales
al variar la composición del lote; solo se reutiliza una rúbrica por hashes de fuente/texto idénticos.

**7.481 registros, 1.914 evaluaciones registradas, 472 fixtures (458 ida/14 vuelta), 0 idiomas aprobados**.
Suite ligera: 55 Python (53 correctos, 2 de dependencias; estas se probaron en los jobs reales antes de los dos
últimos controles ligeros de auditoría). Próximo v9 por familia de cantidades críticas y prosa junto a números;
no restaurar cifras por suposición. Repetir ambas referencias antes del completo; nada de masiva ni fase 0.


## V9 · Límites críticos como frases completas (21-oct)

Política independiente `context-v9`, `pilot-quantity-memory-policy.json`; v2–v8 medidas sin cambios.
Las cinco claves de tamaño/duración del corpus tienen memoria exacta completa es/nb ligada a fuente/hash/contexto:
fileHelp, tooLarge y tooLong de voz, tooLarge y limits de DXF. Cuatro memorias nuevas; 59 claves, 114 destinos.
La salida v8 «30 10 segundos» queda cruda y rechazada: v9 no quita el 10 ni repara la salida.
Otros destinos siguen pendientes de piloto y revisión; la estrategia tipada y los guards no se relajan.
Referencias v9 aún pendientes de run y rúbrica. Muestra completa fijada en `full-sample-v9-plan.json`, mismas
68 claves y 20 adicionales conocidas desde v6; no ciega. Completo solo tras pasar y reconciliar los avisos de referencias.

Las revisiones v9 y posteriores deben incluir `warning_reconciliation`. `audit_review_warnings(review, records)`
y la suite permanente comparan cada aviso actual, registro y hashes. Un aviso de ida no puede pasar como de vuelta;
los contratos de datos de ida rotos bloquean el gate. Esta auditoría no sustituye la revisión de significado.

Comando de auditoría (sin modelos):
```bash
python3 scripts/localization/translation-pilot.py audit-review \
  --review docs/quality/translation-pilot/review-context-v9-references.json \
  --checkpoints docs/quality/translation-pilot/checkpoints/context-v9/madlad.jsonl
```
Se ejecuta cuando existen los resultados y su revisión; comprueba consistencia, no aprueba idiomas automáticamente.

Referencias v9 [39547858733](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39547858733):
es360/360 y nb360/360, solo referencias;76 idas iguales a v8 y cuatro memorias completas nuevas.
160 registros,20 aciertos de memoria,250,01 s;56 tests reales y cleanup correctos.
13 registros de avisos reconciliados (señales de longitud y defectos de vuelta);473 fixtures.
7.641 registros/1.994 evaluaciones acumulados,0 aprobados; completo aún pendiente.

Audit regional posterior a las inferencias v9: `localized_numeric_values_identical` distingue copiar el dato inglés
de conservar su lectura en el idioma destino.200,000 es decimal en es/nb;200.000 es/200 000 nb representan200000.
El audit source-literal sigue separado e intacto. Ni números nuevos ni cambios de separador se reparan por conjetura.
Resumen/auditor recomputan este control desde los crudos, sin editar checkpoints/políticas medidas.
