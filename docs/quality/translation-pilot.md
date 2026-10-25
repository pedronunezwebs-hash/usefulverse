# Piloto de traducción · evidencia y reanudación

## Aceleración de validación y revisión por lotes · 2026-10-26

Aceleración: los 15.443 registros conservan exactamente todos sus indicadores. Benchmark local con cProfile: 51,77→29,34 s (1,76×); aperturas reales de archivo: 432.950→33. Cachés acotadas en RAM y casos de corrupción conservados. Los 25 destinos pendientes tienen nueve lotes preparados con evidencia existente; cero inferencia nueva y cero idiomas aprobados.

Sin cambios en src/public, catálogo, slugs, indexabilidad, políticas o evidencias lingüísticas anteriores. Siguen 15.443 registros, 6.950 evaluaciones con repeticiones, 1.151 fixtures y 477 memorias. Las muestras conocidas es/nb/ko/id/zh-CN conservan su estado; 31 destinos siguen pendientes y cero idiomas están autorizados para publicar. P-001–P-008 pendientes, cero FALLA, sin IDs nuevos. Sin certificación de herramientas, UI, dispositivos, responsive, puerta de 18 puntos ni siete capas. Cero despliegues, activaciones y envíos a buscadores.

45 comprobaciones enfocadas correctas. Suite final esperada: 300 Python; CI global y GET/XML final pendientes. Relevo y respaldo remoto en verificación; limpieza efectiva pendiente. **Siguiente:** Continuar la revisión por lotes con bengalí, ruso y urdu: `python3 scripts/localization/pilot-review-batch.py --locales bn,ru,ur --format markdown`. Leer sus 201 registros S/F/B y todos los avisos, contrastar legacy y registrar cada decisión por idioma. La preparación no es revisión ni aprobación. No repetir inferencias baseline ni los modelos v27 (40196684338/40198168513). Usar memoria exacta solo con fuente, hash y contexto coincidentes; la evidencia reutilizada conserva su registro y procedencia originales, nunca se cuenta como inferencia nueva. Empezar la política v28 independiente de bn y sus contratos numéricos; las pruebas chinas no aceptan otros idiomas. Conservar las 477 memorias, políticas/perfiles/gramáticas, crudos, revisiones, 1.151 fixtures y adendas históricas. Cada error real: test rojo antes del arreglo. Referencias y todos sus avisos antes del ampliado de cada idioma; mismas 88 claves fijas, leer todos los 174 registros modelo y legacy disponible, también fuera de las 88. Un idioma con referencias fallidas no entra al ampliado aunque otro del lote pase. Los siete ha/am/te/gu/ta/mr/sw requieren 80 muestras modelo: los 40 registros existentes no bastan. Compartir preparación y CI entre cambios del mismo lote, manteniendo la suite completa y el resultado independiente de cada idioma. Usar la cola acceleration-review-batches.json para los otros ocho lotes; los seis idiomas históricos siguen pendientes de reparación. Paso A continúa abierto por capacidad Pages, 37 traducciones revisadas y nb real; no avanzar a fase 0.

Uso: `python3 scripts/localization/pilot-review-batch.py --locales bn,ru,ur --format markdown` (también JSON). Agrupa 1–5 destinos; se empieza con tres. Relee fuente/ida/vuelta y avisos existentes, verifica hashes/contexto contra el corpus fijado y conserva IDs y procedencia. No invoca modelos, no asigna notas y no aprueba idiomas. Los siete destinos de pocos recursos mantienen 80 muestras mínimas. `acceleration-review-batches.json` fija nueve lotes y 1.675 registros existentes.

La aceleración se instala con un bootstrap explícito; el AST de todo el módulo anterior, salvo ese bootstrap, permanece idéntico. Caché compartida de bytes de archivo (32 MiB) y SHA256 por bytes exactos (32 MiB); huellas dev/inodo/tamaño/mtime_ns/ctime_ns, rechazo de lectura inestable y lectura normal cuando falta precisión temporal. JSON se vuelve a analizar en objetos nuevos. Solo las políticas cargadas y profundamente congeladas permiten reutilizar sus digest; copias mutables y contenedores arbitrarios se recalculan. Pruebas de cambio con mtime restaurado, sustitución, borrado, symlink, otros roots, mutación, excepciones y corrupción con caché caliente. No hay caché en disco ni aprobaciones guardadas.

## V27 ·25-oct-2026 · muestra conocida pasa con memoria revisada

V27: la muestra china con memoria revisada pasa referencias (360/360) y ampliado (1.566/1.566; 88 claves fijas: 792/792). Hay 477 traducciones en memoria, 214 en chino; cero generación nueva de ida. Legacy: 778/828 y 25 negativas. Historial: 15.443 registros, 6.950 evaluaciones con repeticiones y 1.151 fixtures. Cero idiomas aprobados para publicar.

[Informe](lotes/2026-10-25-piloto-v27.md). Superan muestras completas conocidas: español y noruego bokmål (v15), coreano (v18), indonesio (v21) y chino simplificado (v27: sus 214 idas usan memoria revisada). Seis históricos siguen sin pasar: alemán, francés, portugués de Brasil, japonés, hindi y árabe. Otros 25 requieren revisión detallada: bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, swahili, marathi, telugu, hausa, filipino, tamil, persa, amárico y guyaratí. Inglés es la fuente. Una muestra conocida no acredita las 1.000 herramientas traducidas, un motor genérico ni la aprobación del idioma.

P-001–P-008 pendientes/0FALLA; sin IDs nuevos para infraestructura. No certificados: revisión nativa/ciega/textos inéditos, UI/dispositivos, responsive320–1920/RTL/textos largos/márgenes/peso, a11y/rendimiento, puerta18/siete capas.0/300en main,0activadas;300fuentes noindex en PR borrador;700 existentes conservadas.0deploys/envíos. Paso A sigue abierto por capacidad Pages/37traducciones revisadas/nb real; no avanzar fase0.

[CI final 40215319807](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40215319807) correcta sobre e39fa7f: 3.045 pruebas Node y 276 Python (274 correctas y 2 omisiones por dependencias). Builds principal/hub y puerta de los 20 locales existentes correctos; preview de 10.800 páginas y todas sus homes con noindex, sitemap con cero URLs indexables. Preview de 36 locales: no certifica 37. Modelo y ambas publicaciones omitidos; cero artefactos. Producción: 5 GET y 2 XML, 25.625→25.625 URLs, mismos estados, bytes y hashes; tres soft 404 pendientes y cero despliegues. Respaldo remoto y retirada efectiva verificados después de eliminar realmente el clon/QA/cachés propios. Respaldo remoto y retirada efectiva verificados el 2026-10-25T17:28:48.091414+00:00: clon/QA/binarios/dependencias/cachés propios eliminados sin Papelera;0ZIPs propios residuales. Candado LIBRE. Sin deploy ni activaciones. **Siguiente:** Empezar bengalí (bn) con política v28 independiente. Leer primero los 40 registros modelo y 27 legacy de bn disponibles en checkpoints/madlad.jsonl y su corpus canónico; no repetir los modelos v27 (40196684338/40198168513) ni inferencias baseline ya calculadas. Revisar fuente, ida, vuelta y todos los avisos; convertir cada error real en test rojo antes del arreglo, distinguir datos no probados de errores lingüísticos y contrastar legacy objetivamente. Reutilizar traducciones correctas ya revisadas con memoria exacta ligada a fuente, hash y contexto. Conservar las 477 memorias y todas las políticas, perfiles, gramáticas, crudos y revisiones anteriores, incluidas las cinco fixtures nuevas de vuelta y dos adendas históricas no bloqueantes. Resolver contratos de cifras propios de bn con fuentes fijadas y pruebas de corrupción y caché caliente; la prueba china no permite aceptar otro idioma. Referencias antes del ampliado condicional: mismas 88 claves fijas y lectura de los 174 registros modelo más legacy disponible; cualquier defecto fuera de las 88 también bloquea. El precheck real de v27 completo tardó 643,418 s; CI normal dispone de 30 min y modelo de 90 min. Una aceleración de hashes o datos inmutables debe probar equivalencia de toda la historia y rechazo de fuentes alteradas, sin cambiar la política medida. Después: otros 24 destinos; ha/am/te/gu/ta/mr/sw requieren 80 muestras, y los seis históricos siguen pendientes. Paso A continúa abierto por capacidad Pages, 37 traducciones revisadas y nb real; no avanzar a fase 0.

## V26 ·25-oct-2026 · referencias bloqueadas; completo no ejecutado

V26: nueve correcciones/pruebas finitas y334 memorias; zh-CN referencias360/360 lingüístico, gate bloqueado por1cantidad sin prueba en shikaku.example; completo NO ejecutado. Legacy223/243 y8negativas.15.110 registros/6.617 evaluaciones con repeticiones/1146 fixtures.0 idiomas aprobados.

[Informe](lotes/2026-10-25-piloto-v26.md). Pasan muestras completas conocidas: español y noruego bokmål(v15),coreano(v18),indonesio(v21). Chino simplificado v26 sigue bloqueado. Seis históricos sin pasar: alemán,francés,portugués de Brasil,japonés,hindi,árabe.25 sin revisión detallada: bengalí,ruso,urdu,turco,vietnamita,italiano,chino tradicional,búlgaro,catalán,neerlandés,griego,malayo,polaco,sueco,tailandés,ucraniano,swahili,marathi,telugu,hausa,filipino,tamil,persa,amárico,gujarati. Inglés es fuente. Una muestra conocida no equivale a1.000 herramientas traducidas ni a idioma aprobado.

P-001–P-008 pendientes/0 FALLA; sin IDs nuevos para esta infraestructura. No certificados: revisión nativa/ciega/textos inéditos, UI/dispositivos, responsive320–1920/RTL/textos largos/márgenes/peso, accesibilidad/rendimiento, puerta18/siete capas.0/300 en main,0 activadas;300 fuentes noindex en PR borrador;700 existentes conservadas.0 deploys/envíos. Paso A sigue abierto por capacidad Pages/37 traducciones revisadas/nb real; no avanzar fase0.

[CI final40192256469](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40192256469) correcta sobre48a1694:3.045Node/255Python (253+2omisiones), builds principal/hub/20locales existentes y preview10.800páginas+homes noindex/sitemap0indexables. Preview36locales, no certifica37. Modelo/publicaciones omitidos/0artefactos. GET/XML25.625→25.625URLs,estados/bytes/hashes idénticos;3soft404pendientes,0deploys. Respaldo remoto y retirada efectiva verificados después de eliminar realmente el clon/QA/cachés propios. Respaldo remoto y retirada efectiva verificados el 2026-10-25T12:26:10.578704+00:00: clon/QA/binarios/dependencias/cachés propios eliminados sin Papelera;0ZIPs propios residuales. Candado LIBRE. Sin deploy ni activaciones. **Siguiente:** Crear v27 independiente para zh-CN, sin repetir40190935942 ni runs v25. Reproducir la traza actual de shikaku.example (13b71b671428d304447f8543e16143f971f4d7d36e34ee5a87c92ffbd76117a1), cuyo chino conserva pista6/un rectángulo/seis casillas pero 位于…内 no tiene prueba finita. Conservar la política/perfil/gramática/raws/revisiones v26 y334 memorias; su registry es auditoría negativa, nunca aceptación. Añadir memoria exacta fuente/hash/contexto y contratos finitos del nuevo texto/fragmentos/input; resolver también la vuelta variante de shikaku.fields.faq.1.a sin inventar defecto de ida. Preflight debe cubrir214 registros modelo v25 y40 modelo v26 con todas sus trazas, además334 memorias; no basta repetir v25. Contrastar legacy y elegir la cadena mejor solo tras revisión exacta. Referencias y todos sus avisos antes del completo condicional, mismas88 y lectura174 modelo+92 legacy; cualquier defecto fuera88 bloquea. Se puede priorizar memoria exacta de traducciones ya revisadas del mismo corpus para evitar variación/calls, declarando muestra conocida y sin aprobación genérica. Después25 destinos empezando bn; ha/am/te/gu/ta/mr/sw requieren80 muestras; seis históricos siguen sin pasar. Paso A abierto por capacidad Pages/37 traducciones revisadas/nb real; no avanzar fase0.

## V25 ·25-oct-2026 · completo revisado y bloqueado

V25: zh-CN referencias360/360; completo1564/1566 bloqueado por2 leves y7 variantes sin prueba finita (0 graves y0 errores lingüísticos confirmados de cifras/negaciones). Legacy778/828,25 negativas (17 graves/8 leves).15.043 registros/6.550 evaluaciones con repeticiones/1146 fixtures.0 idiomas aprobados para publicar.

[Informe](lotes/2026-10-25-piloto-v25.md). Pasan muestras completas conocidas: español y noruego bokmål(v15),coreano(v18),indonesio(v21). Chino simplificado v25 sigue bloqueado. Seis históricos sin pasar: alemán,francés,portugués de Brasil,japonés,hindi,árabe.25 sin revisión detallada: bengalí,ruso,urdu,turco,vietnamita,italiano,chino tradicional,búlgaro,catalán,neerlandés,griego,malayo,polaco,sueco,tailandés,ucraniano,swahili,marathi,telugu,hausa,filipino,tamil,persa,amárico,gujarati. Inglés es fuente. Una muestra conocida no equivale a1.000 herramientas traducidas ni a idioma aprobado.

P-001–P-008 pendientes/0 FALLA; sin IDs nuevos para esta infraestructura. Revisión nativa/oculta/textos inéditos, UI/dispositivos reales, responsive320–1920/RTL/textos largos, márgenes, peso, accesibilidad/rendimiento y puerta18/siete capas completas no certificados.0/300 en main,0 activadas,300 fuentes noindex en PR borrador;700 existentes conservadas.0 deploys/envíos. No avanzar fase0.

CI final y GET/XML correctos; respaldo y retirada efectiva se consignan en el recibo final de cierre. **Siguiente:** Crear v26 independiente para zh-CN, sin repetir40151851906/40152812589/40153243412. Primero reproducir callbacks/trazas v25 y test rojo de dxf-viewer.example y voice-changer.intro, más las siete variantes de unproved-data-v25-full.json. Corregir por memoria exacta fuente/hash/contexto conservando325 destinos y resolver por contratos finitos cada nueva fuente/input/fragmento/salida; sin Han universal ni cambio del parser global. Conservar política/perfil/gramática/checkpoints/revisiones v25 e historia. El registro de siete es auditoría negativa, nunca aceptación; todas son variantes sin memoria. Preflight debe cubrir las salidas reales v25, además de los callbacks v24. Referencias y todos sus avisos antes del completo condicional; mismas88 claves y lectura174 modelo+92 legacy, cualquier defecto fuera88 bloquea. ES/NBv15,KOv18,IDv21 se conservan. Después25 destinos sin revisión detallada empezando bn; ha/am/te/gu/ta/mr/sw requieren80 muestras y seis históricos siguen sin pasar. Paso A abierto por capacidad Pages y37 traducciones revisadas/nb real; no avanzar fase0.

20-oct-2026 · Codex · PR [#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136).
Dependencia del Paso A; no habilita ninguna herramienta ni idioma. **Idiomas aprobados por este piloto: 0.**
Código y checkpoints de esta guía están en `feat/new-tools-batch-1` hasta integrar el PR; no confundirlos con `main`.

## V23 ·24-oct-2026 · contrato bloqueante

V23 corrige las nueve idas negativas zh-CN mediante memoria exacta fuente/hash/contexto:274 destinos (263+11; dos duplicadas con contexto propio). Las16 carencias léxicas v22 quedan resueltas con 56 textos ligados a evidencia y Unicode17 fijado por URL/SHA/licencia, sin gramática Han universal ni cambio del parser global/v19/v22. Referencias modelo 360/360 y legacy 223/243; mismas27 claves243/243 frente 223/243. El gate sigue bloqueado por 1 input controlado completo sin prueba; marker_restore_ok permanece falso.67 fuentes/idas/vueltas leídas y 58 registros con avisos conciliados; 17 hallazgos de vuelta separados de los 8 defectos legacy de ida. Cuatro fixtures de vuelta nuevas, 971 totales (665 ida/306 vuelta), 14.377 registros y 5.884 evaluaciones con repeticiones. Completo no ejecutado y 0 idiomas aprobados.

[Referencias 40109970196](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40109970196), fuente `5d3fad0fa0e408331bd06c18f32dd1beca7153d5`:184 tests con dependencias reales correctos, 67 crudos respaldados antes de revisión, nueve aciertos de memoria; 171, 884 s, conversión92, 169 s y pico3.699.860 KiB. INT8 idéntico a v22, limpieza correcta, site omitido y cero artefactos. Primer intento40108791297 detenido por dos negativos sobre 两/兩, antes de inferencia: fuente y fallo conservados; tabla Unicode fijada y test rojo→verde que simula el UCD del runner. No se repite ese run.

Aceleración sin gasto: misma validación de 14.310 registros de 5, 9398 a 0, 7761 s (7, 65× medido localmente), manteniendo hashes/flags y todos los controles. Caché solo de políticas profundamente inmutables; copias mutables nunca se cachean. Caché cruda RAM de v23 evita5 de 103 solicitudes de fragmentos (98 inferencias, 14 llamadas); no normaliza, no acepta salidas ni persiste modelos. No se atribuye7, 65× al modelo ni se inventa un ahorro de segundos contrafactual.

Historia preservada:19 funciones por AST, run histórico salvo la ruta v23 exacta, 14310 flags anteriores con prefijo967; políticas/inputs/gramáticas/checkpoints/revisiones/adendas anteriores intactos, salvo cuatro agregados de inventario. Los106 grupos previos y nueve adendas conservados. El nuevo estado unproved-data solo clasifica el rechazo observado, nunca altera la inferencia, los crudos ni aprueba un gate. Test rojo1 fallo/1 error→dos verdes y negativos de gate, trace, cifra, placeholder, política y truncamiento; cuatro hallazgos de vuelta primero rojos, después fixtures verdes.

Sin deploy/activaciones/envíos, 0/300 en main y 300 noindex en PR #136. Cuatro destinos pasan muestra completa conocida:es/nb-NOv15, ko v18, id v21; zh-CN bloqueado, seis históricos sin pasar y 25 sin revisión detallada. Ver language-status-v23.json para los 37 nombres/estados; no significa1000 herramientas traducidas. P-001–P-008 pendientes/0 FALLA, cero pruebas nuevas. Revisión nativa/oculta/textos inéditos, UI real, 320–1920 px/RTL/textos largos, accesibilidad, peso, rendimiento, dispositivos y puerta 18/siete capas siguen pendientes; este lote no cambia interfaz ni da herramientas por terminadas.

Suite local final:187 tests (185 correctos/dos dependencias omitidas), 47, 562 s. Secretos cero hallazgos y actionlint correcto; 250 archivos históricos idénticos, 106 grupos y nueve adendas conservados. [CI final 40111019015](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40111019015), fuente `b0c84a6dee6e146ef82044fc0f74dde272e5cf25`, correcta: 3.045 Node y 187 Python (185 correctos/dos dependencias omitidas). Check de 10.260 URLs, puerta de 20 locales existentes, hub 217+100+106 y preview de 11.293 archivos/10.800 herramientas con todas sus homes noindex; sitemap indexable 0. Ambas publicaciones y modelo omitidos, cero artefactos. No certifica 37 idiomas ni puerta por herramienta. Después solo documentación/metadatos de cierre.

Producción comprobada por GET y lectura XML antes/después: 25.625 URLs, mismos estados/bytes/SHA256 en ambos sitemaps y tres rutas inexistentes. Esas tres rutas siguen con HTTP 200 (soft404, fase 0 pendiente). No verifica interfaz ni índice de Google. Sin despliegue, activaciones o envíos.

Retirada efectiva el 2026-10-24T23:30:33.226240+07:00: eliminada directamente y sin Papelera solo la carpeta propia usefulverse-codex-v23-20261024.ew4x29t7; ruta comprobada ausente. Tamaño lógico previo 552363050 bytes; disco libre posterior 38.0762 GiB (40884035584 bytes). Antes de borrar: 7625 archivos versionados recuperables por árbol Git/índice, seis documentos idénticos, 250 archivos históricos, prefijo 967,106 grupos y nueve adendas conservados; estados/slugs/capas de progress y src/public intactos. Código/datos/revisiones/fixtures iguales a CI final 40111019015; después solo documentación/metadatos. Cero punteros LFS. Dos runs correctos y un intento previo fallido por prueba Unicode sin inferencia; cero artefactos/publicaciones y limpieza de modelos correcta. Cero ZIP propios externos restantes; tres ZIP de Actions internos y un ZIP de biblioteca versionada retirados con el clon propio, scripts, QA, binarios y cachés (originales recuperables en Git). Sin modelos de traducción ni builds completos locales. Fuentes verificadas antes de retirar: feature d96b8535e0d87a098d93187692a971387d945806, main ec2c46110c1050d15e9d35684f772e9c2a4794b0. Candado liberado después de la retirada.

Siguiente: Crear v24 independiente sin repetir los runs v23. Primero reproducir el callback/traza real de shikaku.fields.faq.1.a en context-v23: marker_restore_ok es falso aunque la fuente canónica y los fragmentos pasan; test rojo que exija prueba del input controlado completo. Añadir contrato léxico explícito de A rectangle cannot contain multiple number clues. Each rectangle must contain exactly one number clue. ligado a model_input/hash/contexto/registro observado; no cambiar política, perfil, Unicode17 fijado, checkpoints o revisiones v23 ni gramáticas históricas. Hacer preflight de las 214 fuentes, inputs controlados completos y sus fragmentos ingleses para detectar otros huecos de prueba antes del modelo. Conservar los 274 destinos de memoria, caché cruda por instancia/dirección y el bloqueo de cualquier cifra desconocida; parser global sigue rechazando zh-CN/id. Referencias y todos los avisos primero; completo solo si pasa el gate, mismas 88 claves y lectura de todas las 174 modelo+92 legacy disponibles. Después los otros 25 destinos sin revisión detallada; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15, KO v18 e ID v21; seis destinos antiguos conservan evidencia histórica sin aprobar. No repetir 40108791297/40109970196 ni 40089099175. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.

## V22 · 24-oct-2026 · referencias rechazadas

V22 fija una gramática decimal zh-CN independiente con CLDR/licencia por revisión y SHA-256. Mantiene parser global (zh-CN sigue rechazado), gramática id v19, inputs controlados y 263 destinos de memoria. Trece funciones históricas iguales por AST; run conserva todo su árbol salvo el dispatch v22 exacto, con negativo frente a ruta alterada y cambios ajenos. Los 14.243 registros previos conservan flags con el prefijo original 930. No se altera ninguna política, checkpoint, rúbrica, gate o adenda anterior; 229 archivos antiguos de evidencia idénticos, cuatro agregados actualizados y 104 grupos de métricas conservados.

[Referencias 40089099175](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40089099175), fuente `cfa913c230680f3b77e275baed50f79b6ebad50b`: 67 fuentes/idas/vueltas leídas directamente (40 modelo+27 legacy). Modelo 344/360, rechazado: cuatro importantes y cinco leves; tres botones y dos controles de datos/negaciones. Legacy 223/243, rechazado: seis importantes y dos leves; cinco botones y tres controles de negaciones. Mismas 27 claves: 232/243 modelo frente 223/243 legacy. La copia existente es mejor en el error de decodificación y en {duration}; no se elige motor comparando muestras desiguales ni se congela. **Completo no despachado**.

Se separan 16 contratos no probados (11 modelo/5 legacy) de los 17 defectos lingüísticos reales: uno/六/6, clasificadores y 二进制 quedan fuera del subconjunto decimal. Las notas pueden conservar 3/3/3 si el texto es correcto, pero unproved-data siempre bloquea explícitamente el gate y nunca cambia la aceptación, salida, política o gramática de inferencia. Solo v22, datos conocidos intactos y traza completa; no permite cifras arábigas inventadas, tokens dañados, rutas históricas o gates aprobados. Cinco tests permanentes protegen estas condiciones; fuente inglesa six no se confunde con un 6 inventado. Se leyeron todos los textos, sin asignar notas por detector o retrotraducción aislada.

Los 60 registros con avisos (34 modelo/26 legacy) están conciliados por hashes. Se separan 22 hallazgos de vuelta (12/10), incluidos los inducidos por la ida. 37 fixtures únicas nuevas (17 ida/20 vuelta) cubren 39 hallazgos; primero test rojo con 39 fallos, después verde. Total 14.310 registros, 5.817 evaluaciones con repeticiones y 967 fixtures (665 ida/302 vuelta). Las nueve adendas previas permanecen intactas, sin añadir ni reescribir historia. Fallos reales: redirección inventada en vez de error de decodificar, marcador traducido, ASCII.dxf unido, orden de encajar dibujo incompleta, tradicional en zh-CN y calcos de naturalidad; en legacy también currículum, adjetivos transparente/nítido y No. convertido en numeración.

Pruebas primero rojas: contrato inicial, exclusiones Han (Unicode no reconoce 丗 de CLDR), límites de palabra del auditor, clasificación bloqueante de datos no probados y cobertura exacta de hallazgos. Suite local final: 156 tests (154 correctos y dos omitidos por dependencias). Dos tests Node de corpus correctos. Runner real: 148 tests con dependencias, anteriores a ocho tests añadidos después; INT8 con mismos hashes v21, limpieza correcta, site omitido y cero artefactos/publicaciones. 197,19 s totales de piloto, 124,90 s conversión y pico 7.538.964 KiB. La revisión posterior añade solo auditoría/regresiones; no altera la inferencia original ni los crudos.

[CI final 40090517822](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40090517822), fuente `cb29e337de884b344ba4667e9294d64d18ae65cb`, correcta: 3.045 Node y 156 Python (154 correctos/dos dependencias omitidas). Build/check de 10.260 URLs, puerta de 20 locales existentes, hub 217+100+106 y preview de 11.293 archivos/10.800 herramientas y todas las homes con noindex; sitemap indexable 0. Ambas publicaciones y modelo omitidos, cero artefactos. No certifica 37 idiomas ni la puerta por herramienta.

Producción inicial GET/XML: 25.625 URLs (10.260+15.365), tres rutas falsas del hub siguen 200. GET/XML después: mismos estados, bytes y SHA-256 en las cinco respuestas; 25.625→25.625 URLs. No prueba UI ni indexación real en buscadores. Seguridad: Actionlint 1.7.12/Gitleaks 8.30.1 oficiales con checksums; cero secretos tras excluir solo el falso positivo exacto de un blob Git histórico verificado, sin ignore en repo. Cero despliegues, activaciones, envíos a buscadores o cambios de src/public; 0/300 en main. Solo runners estándar del repo público, sin artefactos/caché persistente, LFS, Packages, Codespaces, Cloudflare/Containers o API de pago. Facturación global no auditada; alcance de coste basado en [Actions público estándar](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

Inglés es fuente. Pasan muestra completa conocida: español(v15), noruego bokmål(v15), coreano(v18), indonesio(v21). No son paquetes de 1.000 herramientas ni idiomas aprobados. Revisados sin pasar: chino simplificado(v22, referencias) y seis destinos históricos (alemán, francés, portugués de Brasil, japonés, hindi y árabe). Pendientes de revisión detallada 25: bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, swahili, marathi, telugu, hausa, filipino, tamil, persa, amárico y gujarati.36 destinos tienen referencias automáticas calculadas; cuatro pasan muestra conocida, siete revisados sin pasar y 25 pendientes. Cero idiomas aprobados.

P-001–P-008 pendientes, cero FALLA, ningún ID nuevo para esta infraestructura. Nativo, UI/dispositivos reales, responsive/RTL 320–1920, márgenes, peso, accesibilidad/rendimiento y puerta 18/siete capas por herramienta no verificados en este lote. Capacidad Pages y 37 traducciones revisadas/nb real pendientes; no avanzar fase 0.

Siguiente: Crear v23 independiente: primero reproducir callbacks/trazas y test rojo de las nueve idas modelo negativas de review-context-v22-references.json (loaded, decodeFailed, faq 1 a, faq 2 a de voz; daily de Shikaku; faq.2.a, unsupported, measurement y resetView de DXF), después correcciones por memoria exacta fuente/hash/contexto. Conservar las 263 memorias previas. Antes de volver a referencias, resolver mediante contrato zh-CN versionado y tests los 16 datos no probados: clasificadores 一个/最后一个, 四 y 六/6, one/six en fuente y 二进制 como término binario; no ampliar el parser global, no aceptar por defecto ni cambiar la gramática/política/crudos/revisiones v22 o v19. No inventar defectos lingüísticos a partir de gramática no soportada ni aprobar un gate con unproved-data. Referencias y todos sus avisos primero; completo solo si pasan, mismas 88 claves y lectura de todas 174 modelo+92 legacy disponibles. Después los otros 25 destinos sin revisión detallada; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservanv15, KOv18 e IDv21; seis destinos antiguos conservan evidencia histórica sin aprobar. No repetir run 40089099175. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.

[Informe v22](lotes/2026-10-24-piloto-v22.md).

## V21 · 24-oct-2026 · verificado

V21 corrige las 50 idas negativas de v20 mediante memoria exacta de fuente/hash/contexto. Conserva los 213 destinos previos: 263 destinos totales, incluidos 58 id. Los inputs controlados, gramática/perfil CLDR v19 y parser global se conservan; id sigue rechazado por el parser global. Catorce funciones de inferencia/gramática iguales por AST y los 13.910 registros anteriores mantienen sus flags con el prefijo original de 891 fixtures. No se cambian políticas, checkpoints ni rúbricas históricas.

El [primer intento 40069125442](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40069125442), fuente `4f88860864a5f70cb8a7c7d98097d0ff6afe006f`, falló por un test AST nuevo: el formato por defecto de ast.dump difiere entre Python 3.14 del Mac y 3.11 del runner. No produjo registros del piloto y la limpieza pasó. Se añadió primero una regresión roja y se compara ahora la estructura de campos, conservando listas vacías/None y omitiendo solo type_params vacío; los hashes se fijan desde el código original, sin tocar inferencia. Fuente primaria: [Python AST](https://docs.python.org/3/library/ast.html#ast.dump).

[Referencias 40069534310](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40069534310), fuente `fb099fce1f3eabde54a82ac0bc004a387c947471`: 67 fuentes/idas/vueltas leídas directamente. Modelo 40: 360/360, pasa; legacy 27: 233/243, rechazado por cinco idas negativas, dos botones y dos controles de marca. Mismas 27 claves: 243/243 frente a 233/243. Se conciliaron 20 registros con avisos (11 modelo/9 legacy) y 17 hallazgos de vuelta (9/8) antes de despachar el completo. Se leyeron también las variantes nuevas, sin inferir notas por detector o vuelta aislada. Gate/notas/fuentes previos al completo preservados; después solo se añadió enlace recíproco de cobertura de avisos.

[Completo 40070361820](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40070361820), fuente `b7979a85517024ac173ba19720811b60991bfe9e`: 67 crudos reanudados con bytes idénticos y 266 nuevos. Las 333 fuentes/idas/vueltas actuales leídas, incluidas todas las 174 no-referencias modelo y 92 legacy. Mismas 88 claves: 792/792, pasan; ampliado 174: 1566/1566, pasa la muestra conocida, con cero errores de ida observados, botones/cifras/negaciones correctos y ningún fallo oculto fuera de las 88. Son 51 memorias conocidas y 123 inferencias fuera de referencias. Legacy 92: 799/828, rechazado por diez importantes y uno leve. Mismas 92 claves: modelo 828/828 frente a legacy 799/828. No se congela motor ni se aprueba un idioma por esta muestra conocida; no es revisión nativa, ciega o de texto no visto.

Se conciliaron los 77 registros con avisos del completo (49 modelo/28 legacy) y 73 hallazgos de vuelta (47/26), separados de la calidad de ida. Incluyen yardas→metros, eco→gemas, voces→vocales del alfabeto y pérdida de exactamente una vez; las idas actuales conservan sus sentidos. 39 fixtures nuevas, todas de vuelta (seis en referencias y 33 en completo): primero test rojo con seis y 33 fallos, después verde. Total: 14.243 registros, 5.750 evaluaciones con repeticiones y 930 fixtures (648 ida/282 vuelta). Tres entradas nuevas en el registro de adendas de vuelta, ligadas a hashes, cubren crudos históricos coincidentes. Sus seis entradas previas, las rúbricas/gates originales y los 100 grupos de métricas previos se conservan; 209 archivos anteriores de evidencia permanecen idénticos.

Suite local final: 138 tests (136 correctos/dos dependencias omitidas) y dos Node de corpus. Siete tests nuevos respecto a v20; memoria primero roja (cinco tests/52 errores), portabilidad AST primero roja (un test/un error) y cobertura actual roja antes de cada grupo de fixtures. Runners reales: 137 tests en las referencias correctas y 138 en completo, anteriores a las 33 fixtures nuevas del completo; la CI final verifica el estado definitivo. INT8 con los mismos hashes v20, limpieza correcta y cero artefactos/publicaciones en todos los intentos. Completo: 327,58 s totales, 122,35 s de conversión y pico 3.712.364 KiB. Modelos y builds completos solo en Actions.

[CI final 40071558919](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40071558919), fuente `212760583100753802a3528d4ef21c66c4aad061`, correcta: 3.045 Node y 138 Python (136 correctos y dos omitidos por dependencias). Check de 10.260 URLs, puerta de 20 locales existentes, hub 217+100+106 y preview de 11.293 archivos/10.800 herramientas y todas las homes noindex correctos; sitemap indexable 0. Ambas publicaciones y job de modelo omitidos, cero artefactos. No certifica los 37 idiomas.

Producción GET/XML antes/después: 25.625 URLs sin cambios de estado, bytes o hash; tres rutas falsas del hub siguen 200 (soft404 pendientes de fase 0). Seguridad: Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum; cero secretos tras excluir solo el falso positivo exacto de un objeto Git histórico verificado. Sin despliegue, activación, envío a buscadores ni cambios de src/public; 0/300 en main.

Inglés es fuente. Pasan muestra completa conocida: español (v15), noruego bokmål (v15), coreano (v18) e indonesio (v21); no son paquetes de las 1.000 herramientas ni idiomas aprobados. Seis destinos conservan revisión histórica sin pasar: alemán, francés, portugués de Brasil, japonés, hindi y árabe. Pendientes de revisión detallada 26: chino simplificado, bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, swahili, marathi, telugu, hausa, filipino, tamil, persa, amárico y gujarati. Los 36 destinos tienen referencias automáticas calculadas: cuatro pasan muestra conocida, seis revisados sin pasar y 26 pendientes; cero idiomas aprobados para publicación.

Pedro: P-001–P-008 pendientes, cero FALLA y sin IDs nuevos para esta infraestructura. Revisión nativa, UI/dispositivos, visual/responsive/RTL 320–1920, márgenes, peso, accesibilidad y rendimiento no comprobados. Puerta 18/siete capas por herramienta, capacidad Pages y 37 traducciones revisadas/nb real pendientes; no avanzar fase 0. El recibo final de ESTADO/LOG/informe documenta el respaldo remoto y la retirada efectiva al liberar el turno.

Siguiente: Iniciar v22 para zh-CN. Primero reproducir con test rojo el contrato numérico no soportado, fijar fuentes CLDR/licencia por revisión y SHA-256 y añadir una gramática zh-CN versionada por política. Conservar gramática v19, parser global, 263 memorias y todas las políticas/crudos/revisiones/fixtures/adendas anteriores; no ampliar el parser global ni aceptar cifras por defecto. Referencias y todos sus avisos primero; completo solo si pasan, mismas 88 claves y lectura de todas las 174 no-referencias modelo y 92 legacy disponibles. Después los otros 25 destinos aún sin revisión detallada; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15, KO v18 e ID v21; los seis destinos antiguos conservan evidencia histórica sin aprobar. No repetir los runs v21 40069125442, 40069534310 ni 40070361820. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar a fase 0.

[Informe](lotes/2026-10-24-piloto-v21.md).

## V20 · 24-oct-2026 · verificado

V20 añade ocho memorias id exactas con fuente/hash/contexto: siete fallos reproducidos de v19 y la FAQ duplicada de tono, ligada por separado. 213 destinos de memoria; los 205 previos intactos. Contrato/gramática numérica v19 y parser global conservados; 14 funciones de inferencia/gramática iguales por AST. Los 13.577 registros históricos mantienen sus flags con el prefijo original de 761 fixtures. Un test v19 que incluía futuras políticas se fija al conjunto original sin bajar sus requisitos: 13.510 registros/prefijo 732.

[Referencias 40050138164](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40050138164), fuente 7b0efb01fc628315fcc8e40e81c04749a6437c3e: 67 fuentes/idas/vueltas leídas. Modelo 40: 360/360, pasa; legacy 27: 233/243, rechazado con cinco idas negativas. Mismas 27 claves 243/243 frente 233/243. Sus 20 registros con avisos y 17 hallazgos de vuelta conciliados antes de despachar el completo. Grados/gate/fuentes de referencia preservados; luego solo enlace suplementario recíproco de cobertura de avisos.

[Completo 40050727169](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40050727169), fuente 1dd6e08da8c9107112a93e13ce1750fd1b68cd8b: reanuda 67 registros exactos y añade 266. Las 333 fuentes/idas/vueltas actuales leídas, incluidas 174 no-referencias modelo y 92 legacy. Misma muestra fija 88: 722/792, rechazada; ampliado 174: 1454/1566, rechazado por 33 filas importantes y 17 leves, dos botones y un error matemático de regla. Veinte fallos están fuera de las 88 y también bloquean. Entre ellos triángulo por rectángulo, cookie inventada y sufijos unit-format. Legacy 92: 799/828, rechazado por 10 importantes/1 leve. Mismas 92 claves: 773/828 modelo frente 799/828 legacy; la copia existente puntúa más en este conjunto comparable. No se congela motor ni se publica idioma; no se comparan como equivalentes conjuntos de distinto tamaño. 75 avisos modelo/29 legacy y 38/27 hallazgos de vuelta del completo separados de la ida.

130 fixtures nuevas en el lote: 61 ida/69 vuelta (cinco de vuelta en referencias, 125 únicas en completo; una vuelta compartida por ambos candidatos). Primero rojo: memoria 4 tests/10 errores; cobertura de referencias 1 test/5 fallos; cobertura completo 1 test/126 fallos; después verde. Total 13.910 registros/5.417 evaluaciones con repeticiones/891 fixtures (648 ida, 243 vuelta). Historia/prefijos/96 grupos anteriores preservados. Suite local 131 (129 correctos/2 dependencias omitidas), corpus Node 2 correctos. Runners reales: 130 tests en referencias, 131 en completo, INT8 con los mismos hashes v19, limpieza correcta y 0 artefactos/publicaciones. Completo: 428,91 s totales/73,99 s conversión y pico 3.698.944 KiB; un hit de memoria nuevo y siete en referencias. Los fallos lingüísticos detectados siguen pendientes de corrección; CI verde solo valida infraestructura/regresiones, no los aprueba.

[CI final 40067902344](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40067902344), fuente `971dd8cf6bf11cb394aed0c18c6c4b8083cc4474`, correcta: 3.045 Node y 131 Python (129 correctos y 2 omitidos por dependencias). Check de 10.260 URLs, puerta de 20 locales existentes, hub 217+100+106 y preview de 11.293 archivos/10.800 herramientas y todas las homes noindex correctos; sitemap indexable 0. Ambas publicaciones y job de modelo omitidos, 0 artefactos. No certifica los 37 idiomas.

Producción GET/XML antes/después: 25.625 URLs sin cambios de estado, bytes o hash; tres rutas falsas del hub siguen 200 (soft404 pendientes de fase 0). Seguridad: Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum, 0 secretos tras excluir solo el falso positivo exacto de un objeto Git histórico verificado. Sin despliegue, activación, envío a buscadores ni cambios de src/public; 0/300 en main.

Inglés es fuente. Pasan muestra completa conocida: español (v15), noruego bokmål (v15), coreano (v18); no son paquetes de las 1.000 herramientas ni idiomas aprobados. Revisados sin pasar: indonesio (v20), alemán, francés, portugués de Brasil, japonés, hindi y árabe (históricos). Pendientes de revisión detallada 26: chino simplificado, bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, swahili, marathi, telugu, hausa, filipino, tamil, persa, amárico y gujarati. Los 36 destinos tienen referencias automáticas calculadas: 3 pasan muestra conocida, 7 revisados sin pasar, 26 pendientes; cero idiomas aprobados para publicación.

Pedro: P-001–P-008 pendientes, 0 FALLA y sin IDs nuevos para esta infraestructura. Revisión nativa, UI/dispositivos, visual/responsive/RTL 320–1920, márgenes, peso, accesibilidad y rendimiento no comprobados. Puerta 18/siete capas por herramienta, capacidad Pages y 37 traducciones revisadas/nb real pendientes; no avanzar fase 0. El recibo final de ESTADO/LOG/informe documenta el respaldo remoto y la retirada efectiva al liberar el turno.

Siguiente: Crear v21 independiente para las 50 idas modelo negativas de review-context-v20-full.json (33 importantes/17 leves), incluidas las 20 fuera de las 88. Primero reproducir cada callback/traza v20 y test rojo, después memoria exacta fuente/hash/contexto; usar las traducciones existentes mejor puntuadas como evidencia donde sean correctas, sin copiar sus 11 errores. Prioridad: regla numérica de Shikaku, rectángulo/triángulo, cookie inventada, unidades unit-format, carga local vs subida, parser vs procesador de textos y medir vs probar; completar etiquetas, navegación y naturalidad. Conservar v20 y todos sus crudos/revisiones/fixtures; 213 memorias previas y gramática v19/parser global intactos. Volver a referencias con todos sus avisos; completo solo si pasan, mismas 88 y lectura de todas 174+92, sin ocultar errores fuera de muestra. No repetir runs 40050138164/40050727169. Después 26 destinos pendientes comenzando zh-CN con contrato versionado primero; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15, KO v18; seis destinos conservan revisión histórica sin aprobar. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.

[Informe](lotes/2026-10-24-piloto-v20.md).

## V19 ·24-oct-2026 ·verificado

V19 fija una gramática decimal indonesio por política, con fuentes CLDR/licencia versionadas por revisión y SHA-256. No amplía el parser global: id sigue rechazado en v16/v17/v18. Conserva 205 memorias previas y todos los inputs; siete funciones históricas iguales por AST y los 13.510 registros anteriores conservan sus flags con el prefijo original de 732 fixtures. Nuevos hallazgos lingüísticos pueden señalar crudos id antiguos idénticos, sin alterar sus bytes/digests.

[Referencias 40048103975](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40048103975), fuente `8e7ad90695d7b0c785588f17600c025fbe9c3fbb`: 67 fuentes/idas/vueltas leídas directamente. Modelo 40: **348/360, rechazado**; siete idas negativas (5 importantes/2 leves), 3 botones y 1 marcador. Legacy 27: **233/243, rechazado**; cinco idas negativas, 2 botones y 2 controles de marca. Mismas 27 claves: 239/243 modelo frente a 233/243 legacy; no se congela motor. **Completo no despachado.** No se decide por retrotraducción sola.

21 registros con avisos conciliados (13 modelo/8 legacy) y18 hallazgos de vuelta separados. 29 fixtures nuevas (12 ida/17 vuelta, una vuelta compartida por ambos candidatos): primero 1 test rojo/30 fallos y después verde. Gramática: 6 tests/36 errores antes de implementar, caso adicional de millón agrupado confundido con versión primero rojo y después verde; 9 tests numéricos finales incluyen 66 casos generados de ida/vuelta/cifra alterada. Total: **13.577 registros, 5.084 evaluaciones con repeticiones, 761 fixtures (587 ida/174 vuelta)**. Los 173 archivos históricos inmutables, tres adendas, 94 grupos de revisión anteriores y prefijo 732 intactos. Once tests nuevos; suite local 125 (123 correctos/2 dependencias omitidas) y 2 Node del corpus. El runner del modelo pasó 122 con dependencias reales, INT8 igual a v18, limpieza correcta, sin artefactos ni publicación. No se le atribuyen los tres tests añadidos después.

[CI final 40048923585](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40048923585), fuente `27a2d46194e03eaca86c5d4ef16a047948e1a116`, correcta: 3.045 Node y 125 Python (123 correctos, 2 dependencias omitidas). Check de 10.260 URLs, 20 locales existentes y hub 217+100+106 verdes; preview 11.293 archivos/10.800 herramientas y todas las homes noindex, sitemap indexable 0. Ambas publicaciones y job de modelo omitidos, 0 artefactos.

Producción GET/XML antes/después: 25.625→25.625 URLs, estados/bytes/hashes estables; tres rutas falsas del hub siguen 200 (soft404 pendientes de fase 0). No es una prueba de UI ni de indexación real en buscadores. Seguridad con Actionlint 1.7.12/Gitleaks 8.30.1 oficiales y checksum; 0 secretos tras excluir solo un falso positivo exacto de un objeto Git histórico verificado. Cero despliegues, activaciones, envíos o cambios de src/public; 0/300 en main. Puerta 18/siete capas y 37 traducciones revisadas pendientes.

Inglés es fuente. Pasan muestra completa conocida: español (v15), noruego bokmål (v15), coreano (v18); no son paquetes de las 1.000 herramientas ni idiomas aprobados. Revisados sin pasar: indonesio (v19); alemán, francés, portugués de Brasil, japonés, hindi y árabe (históricos). Pendientes de revisión detallada: chino simplificado, bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, swahili, marathi, telugu, hausa, filipino, tamil, persa, amárico y gujarati. Los 36 destinos tienen referencias automáticas calculadas; 3 pasan muestra conocida, 7 revisados sin pasar, 26 pendientes. Cero idiomas aprobados para publicación.

Pedro: P-001–P-008 pendientes, 0 FALLA; ningún ID nuevo para esta infraestructura. Revisión nativa, UI/dispositivos, visual/responsive/RTL 320–1920, márgenes, peso, accesibilidad y rendimiento no comprobados. Respaldo remoto comprobado antes de la retirada; limpieza efectiva y candado final constan en ESTADO/LOG/informe al cerrar.

Siguiente: Crear v20 independiente para corregir las siete idas id negativas de review-context-v19-references.json por memoria exacta fuente/hash/contexto: primero reproducir callbacks/trazas v19 y test rojo; después loaded ({duration} intacto, didekode/Durasi), faq.2.a de DXF (penampil, acción de etiquetar y satuan gambar), resetView (encajar dibujo), cancel (pemuatan), unsupported (ASCII y .dxf separados), faq2a de voz (orden natural de pitch/velocidad) y measurement (Ukur jarak). Revisar la FAQ de tono duplicada con su propio contexto. Conservar política/gramática v19 y los históricos v16/v17/v18; el parser global debe seguir rechazando id. Referencias y todos sus avisos primero; completo solo si pasa el gate, con las mismas 88 claves y lectura de las 174 no-referencias. No repetir run 40048103975. Después los otros 26 destinos aún sin revisión; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15, KO v18 y seis destinos conservan revisión histórica sin aprobar. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.

[Informe](lotes/2026-10-24-piloto-v19.md).

## V18 · 23-oct-2026 ·verificado

V18 corrige las 37 idas coreanas negativas de v17 mediante memoria exacta de fuente/hash/contexto. Conserva los 168 destinos anteriores: 205 destinos de memoria (48 ko y 157 ES/NB). Políticas, gramática, checkpoints, revisiones y tres adendas anteriores intactos; diez funciones iguales por AST. [Corrección](https://github.com/pedronunezwebs-hash/usefulverse/commit/489185efa98d32eb2704e09384f016bbe8076ccb).

[Referencias 39979681259](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39979681259): modelo 360/360, pasa; legacy 219/243, rechaza. [Completo 39980833943](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39980833943): 266 registros nuevos y las 67 referencias reanudadas exactamente. Las 333 fuentes/idas/vueltas se leyeron directamente. Modelo: 174 entradas, 1566/1566, sin idas negativas; mismas 88 claves fijas, 792/792. Son 38 memorias conocidas y 136 inferencias fuera de referencias. Legacy: 92 entradas, 812/828 y diez negativas. Comparación común de 92: modelo 828/828 frente a legacy 812/828. Pasa esta muestra conocida; no es validación ciega, nativa ni de texto no visto, ni aprobación de un idioma.

151 registros con avisos conciliados (21+16 referencias y 76+38 completo), 61 hallazgos de vuelta separados de la calidad de ida. Once fallos nuevos de vuelta —área/anchura, casilla/columna, mezcla de duración/tono, ámbito de procesamiento y otros— tienen fixtures exactas: primero un test rojo con 11 fallos, después verde. Cinco tests Python nuevos; suite local final 114 (112 correctos, dos dependencias omitidas) y dos Node de corpus. Los runners pasaron 113/114 tests con dependencias reales, modelo INT8 idéntico a v17, limpieza correcta y cero artefactos/publicación. Se corrigieron metadatos detectados por tests y la etiqueta de tres vueltas legacy inducidas, sin tocar crudos, notas ni gates históricos. Total: 13.510 registros, 5.017 evaluaciones con repeticiones y 732 fixtures (575 ida/157 vuelta).

Producción antes: GET/XML real, 25.625 URLs y tres soft404 pendientes. Seguridad verificada con Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum, excluyendo solo el falso positivo histórico de un objeto Git comprobado. [CI final 39983727423](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39983727423), fuente `82f69e28f5d4767eb5ce520d0897ac565fc1b7af`, correcta: 3.045 Node, 114 Python (112 correctos y 2 omitidos por dependencias). Validadas 10.260 URLs de sitemap, 20 locales existentes, hub 217+100+106 y preview de 11.293 archivos / 10.800 páginas de herramienta y todas las homes noindex; cero URLs indexables en su sitemap. Ambas publicaciones omitidas, job de modelo omitido y cero artefactos. GET/XML antes/después: 25.625→25.625 URLs con estados, bytes y hashes estables; tres rutas falsas siguen 200. No es prueba de UI ni de indexación real en buscadores. Cero idiomas aprobados, activaciones, despliegues o cambios de src/public.

ES/NB conservan la muestra conocida de v15; coreano pasa ahora la muestra conocida v18. El piloto de los 37 idiomas sigue abierto, sin motor congelado ni paquete nuevo publicado. Candado se libera solo después de verificar respaldo completo y retirar realmente los temporales propios; recibo al cerrar.

Siguiente: Iniciar v19 para id: reproducir primero el contrato numérico no soportado con un test rojo, fijar fuentes CLDR y gramática id versionada por política; conservar conducta y digests históricos de v16/v17/v18, sin ampliar el parser global ni aceptar cifras por defecto. Referencias y todos sus avisos primero; completo solo si pasan. Después los otros 26 destinos pendientes; ha/am/te/gu/ta/mr/sw necesitan 80 muestras. ES/NB conservan v15 y los seis destinos antiguos conservan evidencia histórica, sin validación nueva de v18. Paso A abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar a fase 0. No repetir runs v18 39979681259/39980833943.

[Informe](lotes/2026-10-23-piloto-v18.md).

## V17 · 23-oct-2026 · histórico

V17 corrige los diez fallos ko de referencias y la FAQ de tono duplicada mediante memoria exacta de fuente/hash/contexto: **11 destinos ko**, junto a los 157 ES/NB conservados (96 claves/168 destinos). [Corrección 0ede677](https://github.com/pedronunezwebs-hash/usefulverse/commit/0ede67759de2b9ff883312fb65d306fc8e4e378c) y [revisión 4d27099](https://github.com/pedronunezwebs-hash/usefulverse/commit/4d27099b639a7cbda942cf35569cd2d719c8dc8c). Políticas/gramática anteriores y diez funciones iguales por AST; 152 archivos históricos, tres adendas, 86 grupos antiguos y prefijo de 623 fixtures intactos.

[Referencias 39944893447](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39944893447): **360/360, pasan**; legacy 219/243, rechaza. 40 modelo + 27 legacy, diez memorias y 108 tests con dependencias reales. [Completo 39946160052](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39946160052): 266 nuevos + 67 reanudados, una memoria adicional y 109 tests reales. Todas las 333 fuentes/idas/vueltas leídas. **174 modelos: 1508/1566, rechazado**, 37 idas negativas (seis graves/31 leves), diez fuera de las 88 predeclaradas; esas 88: 746/792. Legacy 92: 812/828, diez negativas. Comparación común de 92: modelo 801 frente a legacy 812; ambos rechazan, sin motor congelado ni sustitución de copia pública.

163 registros con avisos conciliados por hashes (21+16 referencias; 88+38 completo); 69 hallazgos de vuelta separados. No se culpa a una ida correcta por Harmonic, audio-element o desigualdades inventadas en la vuelta. Cinco tests Python nuevos, tres tandas rojas antes de corregir/añadir fixtures (13 errores, 6 fallos, 96 fallos) y después verdes. **98 fixtures nuevas: 47 ida/51 vuelta. Total: 13.177 registros, 4.684 evaluaciones con repeticiones y 721 fixtures (575 ida/146 vuelta)**. Un agregado desactualizado detectado por test existente se recomputó, sin tocar crudos. El gate previo al completo y sus bytes recuperables en la fuente 31e719d; solo se añadió cobertura recíproca a la revisión actual de referencias, sin cambiar notas/gate/datos.

[CI final 39949596494](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39949596494), fuente `3716f107a927e38f53298a9aa00d83aef49b97eb`, correcta: **3.045 Node y 109 Python (107 correctos/dos dependencias omitidas)**. Check de 10.260 URLs, 20 locales existentes y hub 217+100+106 verdes. Preview: 11.293 archivos, 10.800 páginas de herramienta y todas las homes noindex; sitemap indexable vacío. Publicación omitida, cero artefactos. Local 109 Python (107+2) y dos Node del corpus; builds completos/modelos solo en Actions. INT8 igual a v16 y limpieza de ambos runners correcta.

Producción: GET/XML real antes/después, **25.625→25.625 URLs** y bytes/hashes estables. Tres rutas falsas del hub siguen 200: soft404 pendientes de fase 0. Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum: correctos, cero secretos tras excluir solo el falso positivo histórico de un objeto Git verificado. Cero idiomas aprobados, cero despliegues/activaciones/envíos y 0/300 en main. Capacidad Pages, 37 traducciones revisadas/nb real y puerta 18/siete capas pendientes. Pedro P-001–P-008 pendientes, 0 FALLA; ningún ID nuevo. Revisión nativa, visual/UI, responsive/RTL, peso, accesibilidad, rendimiento y dispositivos no comprobados. Candado se libera solo después de respaldo completo y limpieza efectiva, con recibo al final.

Siguiente: Crear v18 independiente para corregir las 37 idas de modelo ko negativas de [review-context-v17-full.json](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/translation-pilot/review-context-v17-full.json) por memoria exacta fuente/hash/contexto: primero reproducir callbacks/trazas v17 y test rojo. Corregir CAD 도면/etiquetas, loglevel y Web Audio exactos, decámetros 데카미터 (no 데시미터), retirar unit-format, jugar frente a 재생, tecla Tab, áreas/solución única, cookie inventada, privacidad/audio de FAQ duplicada, fluidez y locally. Preferencias ortográficas se distinguen de cambios reales de unidad/valor. Conservar política/gramática v16/v17, checkpoints, revisiones y tres adendas históricas; no repetir runs 39944893447/39946160052. Referencias y todos los avisos primero; completo solo si pasa el gate, las mismas 88 claves más las 174 entradas fuera de referencias y 92 legacy. Después id y los otros 26 destinos pendientes; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15 y los otros seis destinos conservan evidencia histórica, sin validación nueva v17. Paso A abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.

[Informe](lotes/2026-10-23-piloto-v17.md).

## V16 · 23-oct-2026 · histórico

Gramática decimal ko CLDR fijada por revisión/hash, once tests de contratos y uno de revisión incluyendo legacy. Referencias [39939504317](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39939504317), fuente `11b047f`: 40 modelo+27 legacy leídos directamente; sin memorias ko. Modelo **344/360**, legacy **219/243**, ambos rechazados. Sobre 27 claves comunes: 231/243 frente a 219/243, sin congelar motor. **Completo no despachado.** No se aprueba mediante la vuelta inglesa; 이력서→Resume y 녹화→recording ocultan errores de ida.

23+16 registros con avisos conciliados, 18 idas con nota negativa y 22 hallazgos de vuelta. 38 fixtures nuevas (17 ida/21 vuelta), prefijo585/adendas/datos históricos intactos. `six→6` conserva valor pero rompe la multiplicidad canónica; limitación de notación explícita. Total **12.844 registros/4.351 evaluaciones con repeticiones/623 fixtures**, cero idiomas aprobados. No revalidar ES/NB u otros destinos por este run: sus pruebas anteriores siguen históricas.

Local: **104 Python (102+2)** y dos Node del corpus; el modelo ejecutó **103 con dependencias reales** antes del test adicional. INT8 igual a v15, cleanup success y cero artefactos, sin publicación. CI final [39941496076](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39941496076) correcta (`4120e82`): 3.045 Node; 104 Python (102 correctos/dos dependencias omitidas), check de 10.260 URLs, 20 locales existentes, hub217+100+106 y preview verdes. Preview 11.293 archivos/10.800 herramientas y homes noindex, sitemap indexable vacío. Publicación omitida y cero artefactos. GET/XML antes/después 25.625 URLs y hashes estables, tres soft404 pendientes. 0/300 main, 0 activadas; capacidad Pages, 37 traducciones, puerta18/siete capas, revisión nativa/UI/dispositivos pendientes. [Informe v16](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-23-piloto-v16.md).

Siguiente: Crear v17 independiente para corregir los diez registros de ida del modelo ko señalados en review-context-v16-references.json, por memoria exacta fuente/hash/contexto, con reproducción de callbacks/trazas y test rojo antes del arreglo. Usar 도면 para CAD, separar ASCII .dxf, aclarar botones/locally, 녹음 para audio, límite inclusivo 25 MB 이하 y la FAQ de tono completa; para shikaku.example conservar el valor seis sin añadir un segundo dígito (여섯), sin llamar al caso corrupción de valor. No modificar política/gramática v16 ni checkpoints/revisiones/adendas/retirada histórica. Referencias ko y todos los avisos primero; completo solo si pasa el gate con muestra predeclarada y lectura de las 174 no-referencias. No repetir el run v16 ni los v15. Después verificar gramática de id y los otros 26 destinos aún sin revisión; ha/am/te/gu/ta/mr/sw requieren 80 muestras. Los seis destinos revisados históricamente además de ES/NB conservan evidencia, sin validación nueva v16. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.

## V15 · 23-oct-2026 · histórico

El calco informático ES `voice-changer.fields.device` queda corregido mediante memoria exacta antes de inferir: «procesamiento más fluido». 91 claves/157 destinos, ligados a fuente/hash/contexto; no se reparan salidas crudas ni se atribuye memoria al modelo. Dos tests primero rojos (tres errores), después verdes. Siete funciones de inferencia iguales por AST; 57 archivos históricos y los tres manifiestos de adendas intactos. El retiro explícito de la falsa nota perfecta v12 permanece visible y negativo.

[Referencias 39905785741](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39905785741), fuente `a591e4b`: ES/NB 360/360; las 80 fuentes/idas/vueltas actuales leídas (40+40). Todas las idas y vueltas coinciden con v14 por hashes. 14 avisos reconciliados y nueve hallazgos de vuelta separados. 160 registros y 21 memorias.
[Completo 39906585266](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39906585266), fuente `63443a6`: 696 nuevos +160 reanudados =856 registros. 157 idas de memoria y 271 idas puras del modelo entre ambos runs. Los dos jobs pasaron 91 tests con dependencias reales; limpieza correcta y cero artefactos.

Todos los 428 candidatos actuales leídos. Las 88 conocidas: es 792/792, nb-NO 792/792. Ampliado de 174 no-referencias: es: 1566/1566, pasa muestra conocida; nb-NO: 1566/1566, pasa muestra conocida. Muestra conocida, no ciega ni demostración de generalización. 347/348 idas y 347/348 vueltas coinciden con v14 por hashes; la única ida cambiada fue leída directamente. 47+14 avisos reconciliados; 37+9 hallazgos de vuelta separados. No se cambia una ida correcta por un defecto de vuelta.

Inventario: 12.777 registros machine-draft, 4.284 evaluaciones con repeticiones y 585 fixtures (511 ida/74 vuelta). 0 fixtures nuevas en v15; el prefijo de 585 queda intacto. Comparaciones legacy históricas por hashes no se suman como evaluaciones nuevas de ida. Cero idiomas aprobados, sin motor congelado ni traducción masiva.

[CI final 39908407189](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39908407189), fuente `5ab99a1`: 3.045 Node; 92 Python (90 correctos/dos dependencias omitidas). Check de 10.260 URLs, 20 locales existentes, hub 217+100+106 y preview verdes. Preview: 11.293 archivos, 10.800 herramientas y todas las homes noindex, sitemap indexable vacío. Publicación omitida y cero artefactos. No certifica 37 traducciones, puerta de 18 puntos/siete capas ni revisión nativa, visual, responsive, RTL, peso, accesibilidad, rendimiento o dispositivos.

Producción GET/XML antes/después: 25.625→25.625 URLs y hashes estables; tres rutas falsas del hub siguen devolviendo 200. Sin merge de código a main, deploy, activación ni envíos a buscadores. Paso A abierto: 0/300 en main, 0 activadas; capacidad Pages y 37 traducciones pendientes.

Siguiente: Crear lote v16 independiente para verificar primero la gramática numérica de ko (siguiente destino sin revisión), con fuentes oficiales CLDR fijadas por revisión/hash y tests rojos de agrupación, decimal, signos Unicode, cobertura de dígitos, 200000, versiones, coordenadas y código. Preservar políticas v2–v15, datos/trazas globales y por oración, las dos FAQ de tono completas, adendas y retiro histórico explícito; las gramáticas desconocidas deben seguir bloqueando. Solo después, referencias ko con lectura directa de fuente/ida/vuelta y todos los avisos; completo condicionado al gate, sin aprobar por retrotraducción sola. Continuar por los otros 27 destinos sin revisión; ha/am/te/gu/ta/mr/sw requieren 80 muestras predeclaradas. Los seis destinos revisados históricamente además de ES/NB conservan su evidencia, sin validación nueva v15. No repetir los runs v15 ni avanzar a fase 0; Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real.
[Informe](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-23-piloto-v15.md).

## V14 · 22-oct-2026 · histórico

Los dos fallos Shikaku están corregidos mediante memoria exacta por fuente/hash/contexto: 90 claves y 156 destinos.
Se leyeron los 428 candidatos actuales. Las 88 conocidas pasan con 792/792 por idioma. En las 174 no-referencias,
ES obtiene 1565/1566 por un calco leve y NB obtiene 1566/1566. Se cumple el mínimo de estilo de 1/20;
la puerta ampliada mantiene ES bloqueado hasta reparar el defecto observado. Cero idiomas aprobados.
La memoria se declara como tal: 156 idas de memoria y 272 idas puras del modelo. Muestra conocida, no ciega ni prueba de generalización.

[Referencias 39768400364](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39768400364), fuente `48e0fcf`:
ES/NB 360/360; 80 fuentes, idas y vueltas leídas, 14 avisos y nueve defectos solo de vuelta.
[Completo 39769512465](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39769512465), fuente `08a0498`:
696 nuevos + 160 reanudados = 856 registros. Ambos jobs pasaron 87 tests con dependencias reales, limpiaron y no crearon artefactos.
Completo: 832,6409 s; conversión: 106,5998 s; pico: 3.777.264 KiB. No extrapolar a las 300.
332/348 idas y 310/348 vueltas coinciden con v13 por hashes; las 16 idas nuevas y todas las vueltas actuales se leyeron.
48 + 14 avisos reconciliados y 37 + 9 hallazgos de vuelta separados.

Cinco casos primero rojos: un calco ES y cuatro variantes de vuelta. Total: 585 fixtures (511 ida/74 vuelta), prefijo de 580 intacto.
Tres filas históricas nuevas v6/v9/v11 y tres vínculos de cobertura; ocho decisiones adicionales solo de vuelta.
Una falsa nota perfecta v12 se retira explícitamente por hashes, con el original visible y el gate ya rechazado.
Dos tests nuevos primero rojos y 30 ataques: prohíben aprobar, mejorar notas, mezclar fuente/contexto/hashes o retirar sin fixture permanente.
Inventario: 11.921 registros y 3.856 evaluaciones con repeticiones, incluida la reevaluación negativa.
Las 120 comparaciones legacy y las ocho decisiones solo de vuelta no se suman como evaluaciones nuevas de ida.

[CI final 39773203261](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39773203261), fuente `2f1b4c2`:
3.045 Node y 89 Python (87 correctos y dos dependencias omitidas); check de 10.260 páginas, 20 locales existentes, hub y preview verdes.
Preview: 11.293 archivos, 10.800 páginas y homes noindex, sitemap indexable vacío. Sin deploy ni artefactos.
Los modelos pasaron 87 tests antes de añadir los dos del auditor; no se les atribuyen 89.
No certifica las 37 traducciones, puerta de 18 puntos/siete capas, revisión nativa ni UI/dispositivos.
Producción GET/XML: 25.625 URLs y tres soft 404 pendientes. Paso A: 0/300 en main, 0 activadas; no se congela motor ni se avanza a fase 0.

Siguiente: Crear v15 independiente para ES voice-changer.fields.device: sustituir el calco «procesamiento más suave» por una formulación informática natural («procesamiento más fluido»), por fuente/hash/contexto. Primero reproducción y test; no editar v2–v14. Conservar contratos y el retiro explícito. Referencias ES/NB y todos sus avisos; solo si pasan ambas, completo con las 88 conocidas y lectura de los 428 candidatos. Muestra conocida, no ciega. Después, gramáticas numéricas verificadas y los 28 destinos aún sin revisión, incluidos ha/am/te/gu/ta/mr/sw con 80 muestras. No repetir runs guardados ni pasar a fase 0.
[Informe](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-22-piloto-v14.md).

## V13 · 22-oct-2026 · histórico

Los 23 fallos v12 están corregidos por memoria exacta: 88 claves/154 destinos ligados a fuente/hash/contexto.
La memoria no es modelo ni demuestra generalización. Referencias 39736865789 (`717c7aa`): ES/NB 360/360;
80 idas/vueltas leídas, 13 avisos y ocho defectos solo de vuelta. Completo 39737830473 (`22e139e`):
696 nuevos + 160 reanudados = 856 registros; 154 memorias entre ambos runs. 85 tests reales por run,
limpieza correcta y cero artefactos. Todos los 428 candidatos leídos; 88 conocidas con 792/792 por idioma.

Dos leves nuevos fuera de las 88 bloquean el global ampliado previo: ES artículo en `statusPlaced` y NB «for å»
en `statusRevealed`. El mínimo de estilo de 1/20 sí se cumple; el plan ampliado exige reparar los defectos observados.
47 + 13 registros con avisos reconciliados; 35 + 8 hallazgos de vuelta separados. 309/348 idas del completo
idénticas a v12 por hashes, 39 cambiadas. Nueve casos primero rojos y después 580 fixtures (510 ida/70 vuelta).
Dos suplementos históricos v9/v11, de una fila cada uno, con tres vínculos por hashes; rúbricas/gates originales intactos.
Inventario: 11.065 registros y 3.424 evaluaciones con repeticiones. 120 comparaciones legacy por hashes no son evaluaciones nuevas.

[CI final 39740313985](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39740313985), fuente `d6d4019`
(árbol idéntico a datos `92c4eea`): 3.045 Node, 85 Python (83 correctos/dos dependencias omitidas), check,
20 locales existentes, hub y preview verdes; sin deploy. Cero idiomas aprobados. 37 traducciones, capacidad Pages,
puerta de 18 puntos/siete capas, revisión nativa y UI/dispositivos pendientes.
Siguiente: v14 independiente para los dos fallos de ida, conservando contratos; referencias ES/NB y después completo.
Luego, 28 destinos, incluidos siete con muestra reforzada; probar sus gramáticas numéricas antes de ampliar.
No repetir los runs v13. [Informe del lote](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-22-piloto-v13.md).

## V12 · 22-oct-2026 · histórico

Los 16 fallos de ida v11 se corrigen mediante memoria exacta con fuente/hash/contexto, antes de inferencia.
La política independiente conserva oraciones completas y contrato tipado; tiene 70 claves/131 destinos de memoria.
No se atribuye esa memoria al modelo ni se demuestra calidad sobre textos nuevos.

[Referencias 39730087914](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39730087914), fuente `32142e3`:
ES y NB 360/360; 160 registros y 21 memorias. [Completo 39730859028](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39730859028),
fuente `5801f4a`: 696 nuevos +160 reanudados =856; 110 memorias adicionales. Ambos runs pasan 80 tests con dependencias reales,
limpian sus modelos y no crean artefactos. Completo: 800,09 s, conversión 74,71 s y pico 3.748.548 KiB; no extrapolar a las 300.

Antes de recoger el completo se amplió la lectura a los 428 candidatos actuales, manteniendo la muestra común de 88.
Las 88 alcanzan **792/792 en cada idioma**, pero fuera de ellas se encuentran **23 errores de ida**: ES 12 (5 importantes/7 leves),
NB 11 (2 importantes/9 leves). Home/Hogar, casillas/plazas, salida/producción, renderizar/dibujar audio, títulos ingleses y gramática.
**Global rechazado y cero idiomas aprobados.** Los 34 hallazgos de vuelta del completo están separados; sus 65 registros con avisos
y los 14 de referencias tienen decisiones ligadas a los textos crudos. 310/348 idas del completo conservan los hashes v11 y 38 cambian.

46 observaciones nuevas fallaron en el test permanente antes de registrarse (23 ida/23 vuelta); 571 fixtures (508 ida/63 vuelta).
La cobertura detectó también 58 registros históricos coincidentes de v9/v11 fuera de las muestras antiguas. Dos suplementos y
`review-coverage-addenda.json` vinculan original y suplemento por hashes de bytes/digest. El auditor exige misma política,
fuente/ida ligadas y cada aviso resuelto; prohíbe reemplazar rúbricas existentes, pasar gates o aprobar idiomas con el suplemento.
Los 32 archivos históricos originales y las diez políticas previas quedan intactos. Dos tests adversariales primero rojos.

Inventario: **10.209 registros, 2.994 evaluaciones con repeticiones**. Las 120 comparaciones legacy reutilizan notas históricas
solo tras comprobar hashes; no se cuentan como evaluaciones nuevas. [CI final 39734259820](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39734259820),
fuente `a427cba`: 3.045 Node, 82 Python (80+2 dependencias), check/20 locales existentes/hub/preview verdes, sin despliegue.
No certifica revisión nativa, 37 traducciones de las 300, puerta de 18 puntos, siete capas por herramienta, UI/RTL/peso/dispositivos.

Próximo: v13 independiente para los 23 fallos de ida, separando los defectos de vuelta. Primero 40 referencias es/nb y todos los
avisos; después el completo con las 88 comparables y lectura de los 428. Muestra conocida, no ciega. Después 28 destinos y
80 muestras reforzadas en ha/am/te/gu/ta/mr/sw; gramáticas desconocidas bloquean. No repetir v12 ni hacer traducción masiva.
Evidencia y cierre en el [informe v12](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-21-piloto-v12.md).

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


### Completo v9 rechazado (21-oct)

[39548546424](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39548546424), fuente13a2ae0:
696 nuevos,94 memorias,465,53 s, cleanup correcto. Muestra68:es592/612,nb588/612;20 adicionales conocidas:
180/180 ambos. El fijo88 queda772/792 y768/792, rechazado por lectura regional de200,000 y fragmentación/gramática.
177 evaluaciones nuevas incluyen Visible es fuera de muestra;40 comparaciones legacy históricas solo verifican
hashes y no se suman como nuevas evaluaciones.44 registros con avisos del completo reconciliados, complementados
por las referencias; cobertura permanente de todos los avisos del candidato.
8.337 registros/2.171 evaluaciones,509 fixtures (479 ida,30 vuelta),0 aprobados.59 tests locales,57 correctos+2 deps.
Siguiente v10 independiente por familia de fragmentación/datos regionales, conservando v2–v9;40 referencias
antes del completo68+20 conocido. Sin masiva, publicación ni fase0 con estos gates abiertos.

## Unidades completas v10 · referencias rechazadas (21-oct)

`pilot-whole-unit-policy.json` conserva políticas v2–v9; transmite cada unidad completa para mantener sintaxis junto a 2D/coordenadas/API. Nuevo contrato compara cantidades por valor/gramática local y controla aparte datos opacos, versiones, coordenadas ordenadas, dimensiones, identificadores y unidades. El audit literal histórico sigue visible; solo una prueba tipada recalculada puede explicar su diferencia de formato. Memoria DXF:200.000 es/200 000 nb; esto se prueba por contrato, no como muestra lingüística completa.

Regresiones reales: signo U+2212 omitido por parseo, dígitos no interpretados, MP3 clasificado como cifra, inventario sin v9 y hallazgo posterior upload/loading. Se corrigieron con pruebas rojas antes; preflight 214 evita descargar modelos ante entrada inválida. Adenda de vuelta ligada a digest/textos mantiene intacta la revisión v9, sin cambiar puntuación/gate.71 tests locales, 69 correctos+2 dependencias.

Run39623344071 falló con 29 registros recuperables; [39624247518](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39624247518), fuente f930275, reanuda29 y emite131.160 registros; 20 memorias (3+17),70 tests reales/cleanup correctos, cero artefactos.228,07s/conversión94,21s/pico3.705.872KiB son del run reanudado; el fallido no emitió resumen de tiempos.72/80 idas idénticas por hashes, ocho nuevas; todas las vueltas revisadas.

**es 358/360 rechazado** por omitir toda la cláusula tono alto/reproducción rápida.**nb 359/360 solo referencias**.Diez registros con avisos reconciliados; no se ejecuta completo v10,0 aprobados.80 comparaciones históricas de legacy por hashes (es 349, nb 329), 0 nuevas evaluaciones.8.497 registros/2.251 evaluaciones/512 fixtures (481 ida, 31 vuelta); tres nuevos. Al cerrar v10, el último completo seguía siendo v9, rechazado.

CI [39626385396](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39626385396), código 1dd7f8c:verde:3.045 Node; 71 Python (69 correctos y 2 omitidos por dependencias); check, idiomas, hub y preview verdes. Todos los datos/código de esta sección están en la rama del PR; [informe, fallos y limpieza](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-21-piloto-v10.md). Sin despliegue; GET/XML25.625 URLs y tres soft404. UI/hardware no certificados; Pedro sin nuevas pruebas, P-001–P-008 pendientes.

Siguiente v11 independiente: cobertura de cada oración sin fragmentar junto a datos, especialmente las dos FAQ de tono/velocidad y la redacción NB de unidades; traza completa no equivale a corrección semántica. Conservar contrato tipado, memorias por fuente/hash/contexto, preflight 214, guards y políticas medidas. Repetir 40 referencias es/nb y todos los avisos; solo si pasan, completo68+20 conocidas y avisos adicionales. Después 28 destinos y 80 muestras por ha/am/te/gu/ta/mr/sw. No masiva, publicación ni fase 0 con gates abiertos.

## Oraciones completas v11 · referencias pasan, completo rechazado (21-oct)

Política independiente `pilot-complete-sentence-policy.json`; v2–v10 intactas. Se traducen oraciones completas conservando datos en contexto, con reconstrucción exacta y contrato tipado por oración/global; una traza no demuestra significado. Se mantiene memoria exacta y se corrige una FAQ NB de etiquetas de unidades. Seis tests nuevos primero rojos; ambas FAQ de tono y entradas 214 cubiertas.

[Referencias 39629733667](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39629733667), fuente fe2acf3:160 registros, 21 memorias, es 360/360 y nb 360/360; 14 avisos reconciliados. [Completo 39631325214](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39631325214), fuente 40fef81:696 nuevos + 160 reanudados = 856,94 memorias nuevas (115 total).77 tests reales por job, 0 artefactos y limpieza correcta. Conversión/total/pico: referencias 84,66s/256,83s/3.694.240 KiB; completo 116,99s/629,13s/3.782.200 KiB; solo estos runs, no extrapolación masiva.

Mismas 68+20 conocidas desde v6: es **785/792** (7 leves, Web Audio traducido), nb **776/792** (4 importantes, 5 leves), ambos rechazados; botones/cifras/negaciones sin errores en la muestra. 177 idas/vueltas leídas, 167 fuentes/idas idénticas a v9 por hashes y 10 nuevas; 43 avisos del completo+14 de referencias, todos reconciliados. 13 nuevas regresiones (4 ida, 9 vuelta) primero rojas; 525 totales (485/40). Dos hallazgos antiguos de vuelta se añaden por hashes sin editar la revisión v9. Un enlace de cobertura entre referencias/completo faltaba y el test lo rechazó; corregido sin cambiar rúbricas ni eximir avisos. CI de `3259799` cancelada por quedar sustituida; CI final abajo.

9.353 registros/2.508 evaluaciones registradas; comparaciones legacy históricas 40 de muestra+80 de referencias no son nuevas evaluaciones. **0 idiomas aprobados.** [CI final 39634328120](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39634328120), código `aa40244`: 3.045 Node, 77 Python (75+2 dependencias), check/20 locales existentes/hub/preview verdes. No certifica 37 destinos ni herramientas completas. [Informe y relevo](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-21-piloto-v11.md). GET/XML 25.625→25.625 URLs y tres soft 404; sin deploy, activaciones o envíos. Pedro: 0 nuevas, P-001–P-008 pendientes.

Siguiente: v12 independiente para registro, concordancia/compuestos y API en oración completa, conservando datos/FAQ/fixtures. Primero 40 referencias es/nb, después completo solo si ambas pasan, mismas 68+20 conocidas y todos los avisos. Después 28 destinos y 80 muestras de idiomas con menos recursos; gramáticas desconocidas bloquean. Capacidad Pages y 37 traducciones revisadas pendientes; sin fase 0.


## V24 · contrato completo chino simplificado · 25-oct-2026

V24: chino simplificado referencias360/360; completo rechazado 1481/1566,50 idas modelo/24 legacy y51 cantidades no probadas;149 fixtures nuevas (1120 totales). Referencias modelo360/360 y legacy223/243; mismas27 claves243/243 frente223/243. Completo174 modelo+92 legacy, mismas88 claves y18 defectos modelo fuera de ellas. Comparación justa92 claves: modelo782/828 frente legacy779/828. Ningún motor/idioma congelado o aprobado.

Lectura directa de todos333 S/F/B (los266 no referencia se releen tras recuperar los crudos remotos).74 idas negativas y78 hallazgos de vuelta;149 fixtures nuevas,971 anteriores intactos. Los51 contratos de cantidad (33 modelo/18 legacy) y2 dimensiones no demostrados bloquean sin inventar defectos de significado; no son51 errores extra. Perfil/política/crudos no se modifican para aprobar.CI final[40148453347](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40148453347) correcta:3.045 Node y206 Python (204 correctas/dos dependencias omitidas). Datos de esta rama: [gate](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/translation-pilot/full-v24-gate-decision.json), [idiomas](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/translation-pilot/language-status-v24.json).

Aceleración gratis:274 destinos de memoria intactos,9 aciertos referencias+2 completo. Caché cruda exacta RAM por instancia/dirección evita5/103 fragmentos en referencias y53/509 en completo;456 inferencias/56 llamadas/278,821s de modelo.421,775s total/132,748s conversión/pico7.654.404KiB completo. No es una comparación controlada de velocidad de pared. Modelos y builds solo Actions estándar público; sin API de pago/Codespaces/Containers/artefactos/modelos persistentes. GitHub devuelve steps[]: limpieza de los dos runs comprobada mediante comando ejecutado en log, job correcto y fuente sin continue-on-error; no se inventa resultado de pasos de API.

Crear v25 independiente, sin repetir 40113864520/40114620348 ni los runs v23. Primero reproducir con los callbacks/trazas v24 los 50 textos de ida negativos de review-context-v24-full.json (test rojo antes de corregir). Añadir correcciones por memoria exacta con fuente/hash/contexto; conservar los274 destinos previos y preferir legacy solo cuando la cadena revisada sea mejor y corresponda a la misma fuente/contexto, sin importar sus24 defectos. Corregir unidades/símbolos, polilíneas, regla valor de pista frente a cantidad de pistas, acciones/UI, Web Audio/loglevel, residuos de byte fallback y grafías regionales. Resolver por contratos finitos y ligados a cada fuente las51 cantidades no probadas (incluidos caracteres con Numeric_Value dentro de palabras, clasificadores, ordinales y nombres de unidad) y las2 dimensiones 2D→二维 pendientes, sin aceptar Han universalmente ni inventar notas negativas por datos desconocidos. Mantener inmutables política/perfil/13 pruebas inglesas/Unicode17/checkpoints/revisiones v24, los1120 fixtures y la historia; parser global sigue rechazando zh-CN/id. Preflight214 fuentes/inputs/fragmentos y274 memorias; referencias y todos sus avisos antes del completo condicional. Mismas88 claves y lectura de todas174 modelo+92 legacy; cualquier defecto fuera de88 bloquea. ES/NB conservan v15, KOv18, IDv21. Después otros25 destinos; ha/am/te/gu/ta/mr/sw requieren80 muestras y seis destinos históricos siguen sin pasar. Paso A abierto por capacidad Pages y37 traducciones revisadas/nb real; no avanzar fase0.


CI final[40168659587](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40168659587), fuente `75fe35402e3dda14984e1273aeccbd34550e57cc`, correcta:3.045 Node y233 Python (231 correctas/dos dependencias omitidas); build principal10.260 URLs, puerta20 locales existentes, hub217+100+106. Preview11.293 archivos/10.800 páginas y todas las homes noindex, sitemap0 indexables;36 locales de preview, no certifica37 idiomas. Ambas publicaciones y modelo omitidos;0 artefactos. GET/XML antes/después:25.625 URLs, mismos estados/bytes/SHA256 de ambos sitemaps y tres rutas falsas; estas siguen200 (soft404, fase0 pendiente). No verifica UI ni índice de Google. Ocho pruebas enfocadas reconstruidas correctas. Respaldo y retirada efectiva se consignan en el recibo final de cierre.


Retirada efectiva v25: 2026-10-25T06:35:20.349228+00:00; raíz propia .usefulverse-v25-cierre-20261025 eliminada directamente y comprobada ausente antes de LIBRE. Disco libre 40.86GiB,0 ZIP propios externos restantes. Originales versionados recuperables por árbol Git; código/datos/revisiones/fixtures iguales a CI final40168659587. Seis documentos sincronizados. Evidencia: docs/quality/translation-pilot/remote-v25-verification.json y cli-cache-v25-cleanup.json.
