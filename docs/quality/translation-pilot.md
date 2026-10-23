# Piloto de traducción · evidencia y reanudación

20-oct-2026 · Codex · PR [#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136).
Dependencia del Paso A; no habilita ninguna herramienta ni idioma. **Idiomas aprobados por este piloto: 0.**
Código y checkpoints de esta guía están en `feat/new-tools-batch-1` hasta integrar el PR; no confundirlos con `main`.

## V18 ·23-oct-2026 ·en curso

V18 incorpora memoria exacta de fuente/hash/contexto para las 37 idas coreanas negativas de v17. Conserva los 168 destinos anteriores: son 205 destinos de memoria (48 ko y 157 ES/NB). Políticas, gramática, checkpoints, revisiones y tres adendas anteriores intactos.

Cuatro tests nuevos reproducen los 37 callbacks/trazas reales: primero 4 tests con 40 errores antes del arreglo y después verdes. También verifican fuente/contexto obsoletos, herencia y ataques a datos sin fallback. Preflight: 214 entradas y 205 memorias válidas. Suite local inicial: 113 Python, 111 correctos y dos dependencias omitidas; dos Node de corpus.

[Referencias v18](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39979681259), fuente 8f88e8eea787eb73bd0adb23054582ec11f2a5f0: 67 crudos respaldados y leídos, 40 modelo + 27 legacy. Modelo 360/360, pasa; legacy 219/243, rechaza. 21+16 registros con avisos conciliados, mismos textos/trazas que v17. Diez memorias conocidas declaradas; no es prueba ciega, nativa ni de generalización. 113 tests con dependencias reales pasan en Actions. Modelo INT8 idéntico a v17; limpieza correcta, publicación omitida y cero artefactos.

Producción antes: GET/XML real, 25.625 URLs (10.260+15.365), tres soft404 pendientes. Seguridad: Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum, cero secretos tras excluir solo un falso positivo histórico de un objeto Git verificado. Ningún idioma aprobado, activación, despliegue o cambio de src/public.

Siguiente: Ejecutar el completo v18 ko: mismo plan fijo de 88 claves, lectura de todos los 174 modelos y 92 legacy fuera de referencias. Conciliar cada aviso y convertir cualquier fallo nuevo en test antes de cerrar. Después id y los otros 26 destinos pendientes; ha/am/te/gu/ta/mr/sw necesitan 80 muestras. Paso A abierto; no avanzar a fase 0.

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
