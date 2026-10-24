# UsefulVerse · LOG de lotes

## 2026-10-24 · Codex · V22: zh-CN referencias rechazadas

[Informe](lotes/2026-10-24-piloto-v22.md).

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

Cierre v22: Retirada efectiva v22 pendiente; candado EN CURSO.

## 2026-10-24 · Codex · V21: indonesio: referencias 360/360 y completo conocido 1566/1566

[Informe](lotes/2026-10-24-piloto-v21.md). V21 corrige las 50 idas negativas de v20 mediante memoria exacta de fuente/hash/contexto. Conserva los 213 destinos previos: 263 destinos totales, incluidos 58 id. Los inputs controlados, gramática/perfil CLDR v19 y parser global se conservan; id sigue rechazado por el parser global. Catorce funciones de inferencia/gramática iguales por AST y los 13.910 registros anteriores mantienen sus flags con el prefijo original de 891 fixtures. No se cambian políticas, checkpoints ni rúbricas históricas.

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

Retirada efectiva el 2026-10-24T13:53:17.067234+07:00: eliminada directamente y sin Papelera solo la carpeta propia `usefulverse-codex-v21-20261024.ls3v43bl`; ruta comprobada ausente. Tamaño previo 551047861 bytes; disco libre posterior 37.7274 GiB (40509452288 bytes). Antes de borrar: 7569 archivos versionados y 562 críticos recuperables mediante árbol Git/índice; seis documentos idénticos, 209 archivos históricos, prefijo 891 y 100 grupos anteriores conservados; estados/slugs/capas de progress y src/public intactos. Código/datos/revisiones/fixtures iguales a CI final 40071558919; solo metadatos posteriores. Cero punteros LFS. Tres runs correctos y un intento previo fallido por test AST, sin inferencia; cuatro sin artefactos ni publicación y con limpieza correcta. Cero ZIP propios externos restantes. 4 ZIP internos retirados con clon, scripts, QA, binarios y cachés. Sin modelos de traducción ni builds completos locales. Fuentes verificadas: feature `89194337d1be0f8b975ef2ca024d0a05042f5db6`, main `dd53bb4108a8fa5d433e39f6c2223a0009e4b7bc`. Candado liberado después de la retirada.

## 2026-10-24 · Codex · V20: referencias id 360/360; completo rechazado 1454/1566, 130 fixtures nuevas

[Informe](lotes/2026-10-24-piloto-v20.md). V20 añade ocho memorias id exactas con fuente/hash/contexto: siete fallos reproducidos de v19 y la FAQ duplicada de tono, ligada por separado. 213 destinos de memoria; los 205 previos intactos. Contrato/gramática numérica v19 y parser global conservados; 14 funciones de inferencia/gramática iguales por AST. Los 13.577 registros históricos mantienen sus flags con el prefijo original de 761 fixtures. Un test v19 que incluía futuras políticas se fija al conjunto original sin bajar sus requisitos: 13.510 registros/prefijo 732.

[Referencias 40050138164](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40050138164), fuente 7b0efb01fc628315fcc8e40e81c04749a6437c3e: 67 fuentes/idas/vueltas leídas. Modelo 40: 360/360, pasa; legacy 27: 233/243, rechazado con cinco idas negativas. Mismas 27 claves 243/243 frente 233/243. Sus 20 registros con avisos y 17 hallazgos de vuelta conciliados antes de despachar el completo. Grados/gate/fuentes de referencia preservados; luego solo enlace suplementario recíproco de cobertura de avisos.

[Completo 40050727169](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40050727169), fuente 1dd6e08da8c9107112a93e13ce1750fd1b68cd8b: reanuda 67 registros exactos y añade 266. Las 333 fuentes/idas/vueltas actuales leídas, incluidas 174 no-referencias modelo y 92 legacy. Misma muestra fija 88: 722/792, rechazada; ampliado 174: 1454/1566, rechazado por 33 filas importantes y 17 leves, dos botones y un error matemático de regla. Veinte fallos están fuera de las 88 y también bloquean. Entre ellos triángulo por rectángulo, cookie inventada y sufijos unit-format. Legacy 92: 799/828, rechazado por 10 importantes/1 leve. Mismas 92 claves: 773/828 modelo frente 799/828 legacy; la copia existente puntúa más en este conjunto comparable. No se congela motor ni se publica idioma; no se comparan como equivalentes conjuntos de distinto tamaño. 75 avisos modelo/29 legacy y 38/27 hallazgos de vuelta del completo separados de la ida.

130 fixtures nuevas en el lote: 61 ida/69 vuelta (cinco de vuelta en referencias, 125 únicas en completo; una vuelta compartida por ambos candidatos). Primero rojo: memoria 4 tests/10 errores; cobertura de referencias 1 test/5 fallos; cobertura completo 1 test/126 fallos; después verde. Total 13.910 registros/5.417 evaluaciones con repeticiones/891 fixtures (648 ida, 243 vuelta). Historia/prefijos/96 grupos anteriores preservados. Suite local 131 (129 correctos/2 dependencias omitidas), corpus Node 2 correctos. Runners reales: 130 tests en referencias, 131 en completo, INT8 con los mismos hashes v19, limpieza correcta y 0 artefactos/publicaciones. Completo: 428,91 s totales/73,99 s conversión y pico 3.698.944 KiB; un hit de memoria nuevo y siete en referencias. Los fallos lingüísticos detectados siguen pendientes de corrección; CI verde solo valida infraestructura/regresiones, no los aprueba.

[CI final 40067902344](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40067902344), fuente `971dd8cf6bf11cb394aed0c18c6c4b8083cc4474`, correcta: 3.045 Node y 131 Python (129 correctos y 2 omitidos por dependencias). Check de 10.260 URLs, puerta de 20 locales existentes, hub 217+100+106 y preview de 11.293 archivos/10.800 herramientas y todas las homes noindex correctos; sitemap indexable 0. Ambas publicaciones y job de modelo omitidos, 0 artefactos. No certifica los 37 idiomas.

Producción GET/XML antes/después: 25.625 URLs sin cambios de estado, bytes o hash; tres rutas falsas del hub siguen 200 (soft404 pendientes de fase 0). Seguridad: Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum, 0 secretos tras excluir solo el falso positivo exacto de un objeto Git histórico verificado. Sin despliegue, activación, envío a buscadores ni cambios de src/public; 0/300 en main.

Inglés es fuente. Pasan muestra completa conocida: español (v15), noruego bokmål (v15), coreano (v18); no son paquetes de las 1.000 herramientas ni idiomas aprobados. Revisados sin pasar: indonesio (v20), alemán, francés, portugués de Brasil, japonés, hindi y árabe (históricos). Pendientes de revisión detallada 26: chino simplificado, bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, swahili, marathi, telugu, hausa, filipino, tamil, persa, amárico y gujarati. Los 36 destinos tienen referencias automáticas calculadas: 3 pasan muestra conocida, 7 revisados sin pasar, 26 pendientes; cero idiomas aprobados para publicación.

Pedro: P-001–P-008 pendientes, 0 FALLA y sin IDs nuevos para esta infraestructura. Revisión nativa, UI/dispositivos, visual/responsive/RTL 320–1920, márgenes, peso, accesibilidad y rendimiento no comprobados. Puerta 18/siete capas por herramienta, capacidad Pages y 37 traducciones revisadas/nb real pendientes; no avanzar fase 0. El recibo final de ESTADO/LOG/informe documenta el respaldo remoto y la retirada efectiva al liberar el turno.

Siguiente: Crear v21 independiente para las 50 idas modelo negativas de review-context-v20-full.json (33 importantes/17 leves), incluidas las 20 fuera de las 88. Primero reproducir cada callback/traza v20 y test rojo, después memoria exacta fuente/hash/contexto; usar las traducciones existentes mejor puntuadas como evidencia donde sean correctas, sin copiar sus 11 errores. Prioridad: regla numérica de Shikaku, rectángulo/triángulo, cookie inventada, unidades unit-format, carga local vs subida, parser vs procesador de textos y medir vs probar; completar etiquetas, navegación y naturalidad. Conservar v20 y todos sus crudos/revisiones/fixtures; 213 memorias previas y gramática v19/parser global intactos. Volver a referencias con todos sus avisos; completo solo si pasan, mismas 88 y lectura de todas 174+92, sin ocultar errores fuera de muestra. No repetir runs 40050138164/40050727169. Después 26 destinos pendientes comenzando zh-CN con contrato versionado primero; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15, KO v18; seis destinos conservan revisión histórica sin aprobar. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.

Retirada efectiva el 2026-10-24T12:59:55.950428+07:00: eliminada directamente y sin Papelera solo la carpeta propia `usefulverse-codex-v20-20261024.b1uqhuiy`; ruta comprobada ausente. Tamaño previo 548558729 bytes; disco libre posterior 37.7623 GiB (40546963456 bytes). Antes de borrar: 7546 archivos versionados y 540 críticos recuperables mediante árbol Git/índice; seis documentos idénticos, 192 archivos históricos, prefijo 761 y 96 grupos anteriores conservados; estados/slugs/capas de progress y src/public intactos. Código/datos/revisiones/fixtures iguales a CI final 40067902344; solo metadatos posteriores. Cero punteros LFS, tres runs correctos sin artefactos ni publicación; cero ZIP propios externos restantes. 3 ZIP internos retirados junto con clon, scripts, QA, binarios y cachés. Sin modelos de traducción ni builds completos locales. Fuentes verificadas: feature `89768fad52455e4cac997d9a5573b3ab2f35a360`, main `7c9a94f3bbd1994eb6a1331e6972b1457197475d`. Candado liberado después de la retirada.

## 2026-10-24 · Codex · V19: referencias id rechazadas, sin completo

[Informe](lotes/2026-10-24-piloto-v19.md). V19 fija una gramática decimal indonesio por política, con fuentes CLDR/licencia versionadas por revisión y SHA-256. No amplía el parser global: id sigue rechazado en v16/v17/v18. Conserva 205 memorias previas y todos los inputs; siete funciones históricas iguales por AST y los 13.510 registros anteriores conservan sus flags con el prefijo original de 732 fixtures. Nuevos hallazgos lingüísticos pueden señalar crudos id antiguos idénticos, sin alterar sus bytes/digests.

[Referencias 40048103975](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40048103975), fuente `8e7ad90695d7b0c785588f17600c025fbe9c3fbb`: 67 fuentes/idas/vueltas leídas directamente. Modelo 40: **348/360, rechazado**; siete idas negativas (5 importantes/2 leves), 3 botones y 1 marcador. Legacy 27: **233/243, rechazado**; cinco idas negativas, 2 botones y 2 controles de marca. Mismas 27 claves: 239/243 modelo frente a 233/243 legacy; no se congela motor. **Completo no despachado.** No se decide por retrotraducción sola.

21 registros con avisos conciliados (13 modelo/8 legacy) y18 hallazgos de vuelta separados. 29 fixtures nuevas (12 ida/17 vuelta, una vuelta compartida por ambos candidatos): primero 1 test rojo/30 fallos y después verde. Gramática: 6 tests/36 errores antes de implementar, caso adicional de millón agrupado confundido con versión primero rojo y después verde; 9 tests numéricos finales incluyen 66 casos generados de ida/vuelta/cifra alterada. Total: **13.577 registros, 5.084 evaluaciones con repeticiones, 761 fixtures (587 ida/174 vuelta)**. Los 173 archivos históricos inmutables, tres adendas, 94 grupos de revisión anteriores y prefijo 732 intactos. Once tests nuevos; suite local 125 (123 correctos/2 dependencias omitidas) y 2 Node del corpus. El runner del modelo pasó 122 con dependencias reales, INT8 igual a v18, limpieza correcta, sin artefactos ni publicación. No se le atribuyen los tres tests añadidos después.

[CI final 40048923585](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40048923585), fuente `27a2d46194e03eaca86c5d4ef16a047948e1a116`, correcta: 3.045 Node y 125 Python (123 correctos, 2 dependencias omitidas). Check de 10.260 URLs, 20 locales existentes y hub 217+100+106 verdes; preview 11.293 archivos/10.800 herramientas y todas las homes noindex, sitemap indexable 0. Ambas publicaciones y job de modelo omitidos, 0 artefactos.

Producción GET/XML antes/después: 25.625→25.625 URLs, estados/bytes/hashes estables; tres rutas falsas del hub siguen 200 (soft404 pendientes de fase 0). No es una prueba de UI ni de indexación real en buscadores. Seguridad con Actionlint 1.7.12/Gitleaks 8.30.1 oficiales y checksum; 0 secretos tras excluir solo un falso positivo exacto de un objeto Git histórico verificado. Cero despliegues, activaciones, envíos o cambios de src/public; 0/300 en main. Puerta 18/siete capas y 37 traducciones revisadas pendientes.

Inglés es fuente. Pasan muestra completa conocida: español (v15), noruego bokmål (v15), coreano (v18); no son paquetes de las 1.000 herramientas ni idiomas aprobados. Revisados sin pasar: indonesio (v19); alemán, francés, portugués de Brasil, japonés, hindi y árabe (históricos). Pendientes de revisión detallada: chino simplificado, bengalí, ruso, urdu, turco, vietnamita, italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano, swahili, marathi, telugu, hausa, filipino, tamil, persa, amárico y gujarati. Los 36 destinos tienen referencias automáticas calculadas; 3 pasan muestra conocida, 7 revisados sin pasar, 26 pendientes. Cero idiomas aprobados para publicación.

Pedro: P-001–P-008 pendientes, 0 FALLA; ningún ID nuevo para esta infraestructura. Revisión nativa, UI/dispositivos, visual/responsive/RTL 320–1920, márgenes, peso, accesibilidad y rendimiento no comprobados. Respaldo remoto comprobado antes de la retirada; limpieza efectiva y candado final constan en ESTADO/LOG/informe al cerrar.

Retirada efectiva el 2026-10-24T08:23:07.742387+07:00: eliminada directamente y sin Papelera solo la carpeta propia `usefulverse-codex-v19-20261024.4dqttnzz`; ruta comprobada ausente. Tamaño previo 544321199 bytes; disco libre posterior 37.9630 GiB (40762478592 bytes). Antes de borrar: 7524 archivos versionados y 519 críticos recuperables mediante árbol Git/índice; seis documentos idénticos, 173 archivos históricos, prefijo de 732 fixtures y 94 grupos anteriores conservados; estados/slugs/capas de progress y src/public intactos. Código/datos/revisiones/fixtures iguales a CI final; solo metadatos posteriores. Cero punteros LFS, dos runs correctos sin artefactos ni publicación; cero ZIP propios externos. 2 ZIP internos retirados junto con clon, scripts, QA, binarios y cachés. Sin modelos de traducción ni builds completos locales. Fuentes verificadas: feature `75586eba172854831f4ab64a179fc4861435bf1a`, main `ac5c16856a47a9eb7ddad9c6d62a1152654a7dc6`. Candado liberado después de la retirada.

Siguiente: Crear v20 independiente para corregir las siete idas id negativas de review-context-v19-references.json por memoria exacta fuente/hash/contexto: primero reproducir callbacks/trazas v19 y test rojo; después loaded ({duration} intacto, didekode/Durasi), faq.2.a de DXF (penampil, acción de etiquetar y satuan gambar), resetView (encajar dibujo), cancel (pemuatan), unsupported (ASCII y .dxf separados), faq2a de voz (orden natural de pitch/velocidad) y measurement (Ukur jarak). Revisar la FAQ de tono duplicada con su propio contexto. Conservar política/gramática v19 y los históricos v16/v17/v18; el parser global debe seguir rechazando id. Referencias y todos sus avisos primero; completo solo si pasa el gate, con las mismas 88 claves y lectura de las 174 no-referencias. No repetir run 40048103975. Después los otros 26 destinos aún sin revisión; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15, KO v18 y seis destinos conservan revisión histórica sin aprobar. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.

## 2026-10-23 · Codex · V17: referencias ko 360/360; completo rechazado, 721 fixtures y CI final correcta

[Informe](lotes/2026-10-23-piloto-v17.md). V17 corrige los diez fallos ko de referencias y la FAQ de tono duplicada mediante memoria exacta de fuente/hash/contexto: **11 destinos ko**, junto a los 157 ES/NB conservados (96 claves/168 destinos). [Corrección 0ede677](https://github.com/pedronunezwebs-hash/usefulverse/commit/0ede67759de2b9ff883312fb65d306fc8e4e378c) y [revisión 4d27099](https://github.com/pedronunezwebs-hash/usefulverse/commit/4d27099b639a7cbda942cf35569cd2d719c8dc8c). Políticas/gramática anteriores y diez funciones iguales por AST; 152 archivos históricos, tres adendas, 86 grupos antiguos y prefijo de 623 fixtures intactos.

[Referencias 39944893447](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39944893447): **360/360, pasan**; legacy 219/243, rechaza. 40 modelo + 27 legacy, diez memorias y 108 tests con dependencias reales. [Completo 39946160052](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39946160052): 266 nuevos + 67 reanudados, una memoria adicional y 109 tests reales. Todas las 333 fuentes/idas/vueltas leídas. **174 modelos: 1508/1566, rechazado**, 37 idas negativas (seis graves/31 leves), diez fuera de las 88 predeclaradas; esas 88: 746/792. Legacy 92: 812/828, diez negativas. Comparación común de 92: modelo 801 frente a legacy 812; ambos rechazan, sin motor congelado ni sustitución de copia pública.

163 registros con avisos conciliados por hashes (21+16 referencias; 88+38 completo); 69 hallazgos de vuelta separados. No se culpa a una ida correcta por Harmonic, audio-element o desigualdades inventadas en la vuelta. Cinco tests Python nuevos, tres tandas rojas antes de corregir/añadir fixtures (13 errores, 6 fallos, 96 fallos) y después verdes. **98 fixtures nuevas: 47 ida/51 vuelta. Total: 13.177 registros, 4.684 evaluaciones con repeticiones y 721 fixtures (575 ida/146 vuelta)**. Un agregado desactualizado detectado por test existente se recomputó, sin tocar crudos. El gate previo al completo y sus bytes recuperables en la fuente 31e719d; solo se añadió cobertura recíproca a la revisión actual de referencias, sin cambiar notas/gate/datos.

[CI final 39949596494](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39949596494), fuente `3716f107a927e38f53298a9aa00d83aef49b97eb`, correcta: **3.045 Node y 109 Python (107 correctos/dos dependencias omitidas)**. Check de 10.260 URLs, 20 locales existentes y hub 217+100+106 verdes. Preview: 11.293 archivos, 10.800 páginas de herramienta y todas las homes noindex; sitemap indexable vacío. Publicación omitida, cero artefactos. Local 109 Python (107+2) y dos Node del corpus; builds completos/modelos solo en Actions. INT8 igual a v16 y limpieza de ambos runners correcta.

Producción: GET/XML real antes/después, **25.625→25.625 URLs** y bytes/hashes estables. Tres rutas falsas del hub siguen 200: soft404 pendientes de fase 0. Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum: correctos, cero secretos tras excluir solo el falso positivo histórico de un objeto Git verificado. Cero idiomas aprobados, cero despliegues/activaciones/envíos y 0/300 en main. Capacidad Pages, 37 traducciones revisadas/nb real y puerta 18/siete capas pendientes. Pedro P-001–P-008 pendientes, 0 FALLA; ningún ID nuevo. Revisión nativa, visual/UI, responsive/RTL, peso, accesibilidad, rendimiento y dispositivos no comprobados. Candado se libera solo después de respaldo completo y limpieza efectiva, con recibo al final.

Siguiente: Crear v18 independiente para corregir las 37 idas de modelo ko negativas de [review-context-v17-full.json](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/translation-pilot/review-context-v17-full.json) por memoria exacta fuente/hash/contexto: primero reproducir callbacks/trazas v17 y test rojo. Corregir CAD 도면/etiquetas, loglevel y Web Audio exactos, decámetros 데카미터 (no 데시미터), retirar unit-format, jugar frente a 재생, tecla Tab, áreas/solución única, cookie inventada, privacidad/audio de FAQ duplicada, fluidez y locally. Preferencias ortográficas se distinguen de cambios reales de unidad/valor. Conservar política/gramática v16/v17, checkpoints, revisiones y tres adendas históricas; no repetir runs 39944893447/39946160052. Referencias y todos los avisos primero; completo solo si pasa el gate, las mismas 88 claves más las 174 entradas fuera de referencias y 92 legacy. Después id y los otros 26 destinos pendientes; ha/am/te/gu/ta/mr/sw requieren 80 muestras. ES/NB conservan v15 y los otros seis destinos conservan evidencia histórica, sin validación nueva v17. Paso A abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar fase 0.


## 2026-10-23 · Codex · v16: gramática ko y referencias rechazadas

[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136); [informe](lotes/2026-10-23-piloto-v16.md). CLDR fijada por revisión/hash, once tests de gramática/datos y uno de revisión legacy incluidos. Cinco tandas rojas→verdes, 38 fixtures nuevas; 80 archivos históricos/adendas/prefijo585 intactos. Seis funciones iguales por AST, contratos globales y por oración conservados. Ninguna memoria ko.

Run [39939504317](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39939504317), fuente `11b047f`: 67 registros (40 modelo/27 legacy), 103 tests reales, INT8 igual a v15, cleanup correcto, cero artefactos/sitio omitido. Leídas las 67 fuentes/idas/vueltas. Modelo 344/360, legacy 219/243; 23+16 avisos y 22 hallazgos de vuelta. Contrato six→6 falla por multiplicidad, no por cambiar el valor. Completo no despachado. 12.844 registros/4.351 evaluaciones con repeticiones/623 fixtures (528 ida/95 vuelta), cero idiomas aprobados.

Local: 104 Python (102+2), dos Node. CI final [39941496076](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39941496076) correcta (`4120e82`): 3.045 Node; 104 Python (102 correctos/dos dependencias omitidas), check de 10.260 URLs, 20 locales existentes, hub217+100+106 y preview verdes. Preview 11.293 archivos/10.800 herramientas y homes noindex, sitemap indexable vacío. Publicación omitida y cero artefactos. GET/XML 25.625→25.625 URLs y hashes estables; tres soft404 pendientes; sin deploy/código a main/activaciones/envíos. Pedro P-001–P-008 pendientes/0 FALLA, ningún ID nuevo; puerta18/siete capas y dispositivos pendientes. Candado LIBRE tras CI y relevo respaldados; limpieza efectiva propia tras recuperación online, recibo real al final. Siguiente: v17 para los diez defectos de ida ko, después referencias y completo condicionado; no repetir v16 ni avanzar fase0.

Un bloque por lote (plantilla en RUNBOOK §10). El más reciente arriba.

## 2026-10-23 · Codex · V15: calco informático ES corregido y completo revisado

El calco informático ES `voice-changer.fields.device` queda corregido mediante memoria exacta antes de inferir: «procesamiento más fluido». 91 claves/157 destinos, ligados a fuente/hash/contexto; no se reparan salidas crudas ni se atribuye memoria al modelo. Dos tests primero rojos (tres errores), después verdes. Siete funciones de inferencia iguales por AST; 57 archivos históricos y los tres manifiestos de adendas intactos. El retiro explícito de la falsa nota perfecta v12 permanece visible y negativo.

[Referencias 39905785741](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39905785741), fuente `a591e4b`: ES/NB 360/360; las 80 fuentes/idas/vueltas actuales leídas (40+40). Todas las idas y vueltas coinciden con v14 por hashes. 14 avisos reconciliados y nueve hallazgos de vuelta separados. 160 registros y 21 memorias.
[Completo 39906585266](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39906585266), fuente `63443a6`: 696 nuevos +160 reanudados =856 registros. 157 idas de memoria y 271 idas puras del modelo entre ambos runs. Los dos jobs pasaron 91 tests con dependencias reales; limpieza correcta y cero artefactos.

Todos los 428 candidatos actuales leídos. Las 88 conocidas: es 792/792, nb-NO 792/792. Ampliado de 174 no-referencias: es: 1566/1566, pasa muestra conocida; nb-NO: 1566/1566, pasa muestra conocida. Muestra conocida, no ciega ni demostración de generalización. 347/348 idas y 347/348 vueltas coinciden con v14 por hashes; la única ida cambiada fue leída directamente. 47+14 avisos reconciliados; 37+9 hallazgos de vuelta separados. No se cambia una ida correcta por un defecto de vuelta.

Inventario: 12.777 registros machine-draft, 4.284 evaluaciones con repeticiones y 585 fixtures (511 ida/74 vuelta). 0 fixtures nuevas en v15; el prefijo de 585 queda intacto. Comparaciones legacy históricas por hashes no se suman como evaluaciones nuevas de ida. Cero idiomas aprobados, sin motor congelado ni traducción masiva.

[CI final 39908407189](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39908407189), fuente `5ab99a1`: 3.045 Node; 92 Python (90 correctos/dos dependencias omitidas). Check de 10.260 URLs, 20 locales existentes, hub 217+100+106 y preview verdes. Preview: 11.293 archivos, 10.800 herramientas y todas las homes noindex, sitemap indexable vacío. Publicación omitida y cero artefactos. No certifica 37 traducciones, puerta de 18 puntos/siete capas ni revisión nativa, visual, responsive, RTL, peso, accesibilidad, rendimiento o dispositivos.

Producción GET/XML antes/después: 25.625→25.625 URLs y hashes estables; tres rutas falsas del hub siguen devolviendo 200. Sin merge de código a main, deploy, activación ni envíos a buscadores. Paso A abierto: 0/300 en main, 0 activadas; capacidad Pages y 37 traducciones pendientes.

Siguiente: Crear lote v16 independiente para verificar primero la gramática numérica de ko (siguiente destino sin revisión), con fuentes oficiales CLDR fijadas por revisión/hash y tests rojos de agrupación, decimal, signos Unicode, cobertura de dígitos, 200000, versiones, coordenadas y código. Preservar políticas v2–v15, datos/trazas globales y por oración, las dos FAQ de tono completas, adendas y retiro histórico explícito; las gramáticas desconocidas deben seguir bloqueando. Solo después, referencias ko con lectura directa de fuente/ida/vuelta y todos los avisos; completo condicionado al gate, sin aprobar por retrotraducción sola. Continuar por los otros 27 destinos sin revisión; ha/am/te/gu/ta/mr/sw requieren 80 muestras predeclaradas. Los seis destinos revisados históricamente además de ES/NB conservan su evidencia, sin validación nueva v15. No repetir los runs v15 ni avanzar a fase 0; Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real.
Pedro: ningún ID nuevo; P-001–P-008 pendientes, cero FALLA.

Retirada efectiva el 2026-10-23T13:05:24.121282+07:00: eliminada directamente, sin Papelera, solo la carpeta propia `usefulverse-codex-v15-20261023.jqvztggo`; ruta comprobada ausente. Tamaño previo 560032 KiB; disco libre posterior 50.6633 GiB (54399324160 bytes). Antes de borrar: 7434 archivos versionados recuperables, 85 críticos verificados, seis documentos idénticos, 57 archivos históricos conservados, prefijo de fixtures/adendas intactos y código/datos iguales a la CI final. Cero punteros LFS, cuatro runs correctos sin artefactos/publicación y cero ZIP propios externos. Los cuatro ZIP internos, clon, QA, logs, binarios, cachés y auxiliares se retiraron con la carpeta. Fuentes verificadas: feature 5adfa5d31f68cbc51a6a77bba10020f9aee918a2; main 1a7f16f8c59ad119d5dc43a17b0ec8449ae60180.

## 2026-10-22 · Codex · V12: lectura completa detecta fallos fuera de la muestra; relevo v13

- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador. Política `32142e3`, datos/auditor `0acd1ad`, sincronización de main `a427cba` con árbol idéntico antes de CI.
- Referencias [39730087914](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39730087914): es/nb 360/360. Completo [39730859028](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39730859028): 696+160=856 registros, 131 memorias entre ambos runs, 80 tests reales por run, limpieza correcta y 0 artefactos. Completo: 800,09 s y pico 3.748.548 KiB.
- Plan ampliado antes de recoger resultados: los 428 candidatos actuales leídos. Las 88 conocidas alcanzan 792/792 por idioma; aparecen 23 fallos de ida fuera de ellas (ES 12/NB 11). Global rechazado y 0 idiomas aprobados. 79 registros actuales con avisos reconciliados y 34 hallazgos de vuelta del completo separados.
- 46 casos nuevos primero rojos, luego 571 fixtures (508 ida/63 vuelta). Cobertura detectó otros 58 registros históricos de v9/v11: dos suplementos y tres vínculos con hashes, 32 archivos originales intactos. Dos tests nuevos rojos antes de reforzar el auditor; prohíbe regraduar originales, pasar gates, aprobar idiomas o mezclar políticas.
- Inventario: 10.209 registros y 2.994 evaluaciones con repeticiones; las 120 comparaciones legacy son históricas por hashes. [CI final 39734259820](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39734259820), fuente `a427cba`: 3.045 Node, 82 Python (80+2 dependencias), check/20 locales existentes/hub/preview verdes. Preview: 11.293 archivos, 10.800 herramientas y homes noindex, sitemap indexable vacío; deploy omitido. Actionlint y Gitleaks correctos.
- GET/XML antes/después: 25.625→25.625 URLs y hashes iguales; tres rutas falsas del hub siguen en 200. Sin merge de código a main, deploy, activación, envíos, API pagada, Codespaces ni operación Cloudflare. `src/` y `public/` intactos respecto al cierre v11.
- Siguiente: v13 independiente para los 23 fallos de ida; referencias antes del completo y lectura de los 428. Después 28 destinos/80 muestras reforzadas. Paso A abierto, 0/300 main y 0 activadas; capacidad/37 traducciones pendientes. Pedro: 0 nuevas, P-001–P-008 pendientes, 0 FALLA. Respaldo y eliminación efectiva en el [informe del lote](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-21-piloto-v12.md).

## 2026-10-21 · Codex · V11: referencias pasan, completo rechazado; relevo v12
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador; rama feat/new-tools-batch-1. Código fe2acf3, datos 3259799, cobertura `aa40244`.
- Oraciones completas/datos en contexto, traza y contrato por oración; ambas FAQ de tono conservadas; una memoria NB de unidades. Seis tests rojos antes del arreglo.
- Referencias 39629733667: es/nb 360; completo 39631325214:856 registros (696+160), 115 memorias, 77 tests reales por run, cleanup correcto, 0 artefactos. Muestra conocida 68+20: es 785/792 y nb 776/792, rechazados por API/registro/compuestos. 257 idas/vueltas leídas; 57 registros con avisos reconciliados.
- 9.353 registros, 2.508 evaluaciones, 525 fixtures (485 ida/40 vuelta), 0 idiomas aprobados. 13 regresiones nuevas primero rojas; una adenda nueva con dos hallazgos de vuelta mantiene revisiones históricas intactas. Test de cobertura detectó enlace suplementario faltante; corregido, 77 tests ligeros 75+2 dependencias. CI de `3259799` sustituida/cancelada.
- [CI final 39634328120](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39634328120), código `aa40244`: 3.045 Node, 77 Python (75+2), check/20 locales existentes/hub/preview verdes. Preview 11.293 archivos, 10.800 herramientas y homes noindex, sitemap indexable vacío. actionlint/Gitleaks correctos.
- GET/XML propio antes/después: 25.625→25.625 URLs, hashes iguales; tres rutas falsas hub 200. Sin merge de código a main, deploy, activación, envíos, APIs pagadas, Codespaces ni operaciones Cloudflare. Fuente/assets públicos intactos.
- Siguiente: v12 por familia de API/registro/compuestos, 40 referencias antes del completo; después 28 destinos/80 muestras reforzadas. Paso A sigue abierto, 0/300 main, 0 activadas; capacidad/37 traducciones pendientes. Pedro: 0 nuevas, P-001–P-008 pendientes, 0 FALLA. Evidencia/limpieza en [informe](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/lotes/2026-10-21-piloto-v11.md).

## 2026-10-21 · Codex · Hito v11:referencias revisadas,completo pendiente
- Run39629733667:160 registros,77 tests reales,21 memorias,cleanup correcto,0 artefactos. Fuente fe2acf3.
- ES y nb360/360 en40 referencias cada uno;14 registros con avisos reconciliados,9 defectos conocidos de vuelta separados.72 idas idénticas a v10 por hashes y8 revisadas nuevas.0 idiomas aprobados.
- Checkpoint/revisión/resúmenes respaldados antes del completo. Completo39631325214 fuente40fef81 en curso:recuperar antes de repetir.68+20 conocidas y todos los avisos;sin deploy/activaciones ni avance de fase.

## 2026-10-21 · Codex · Hito v11 en curso
- Código `fe2acf3`: oraciones completas con traza y datos por oración/unidad; ambas FAQ de tono/velocidad y memoria NB de unidades.77 tests ligeros,75 correctos y dos dependencias. V2–v10 intactos.
- [Referencias39629733667](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39629733667) pendientes de revisión. No completo hasta pasar ambas referencias y todos los avisos.
- Sin publicación ni activación; Paso A abierto. Candado ocupado e informe v11 recuperable en rama del PR.

## 2026-10-21 · Codex · Paso A: v10, contrato tipado y omisión bloqueante
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador; `6d99ba9`…`1dd7f8c`. Unidades completas con cantidades regionales, invariantes separados, signo Unicode, cobertura numérica y preflight 214; políticas v2–v9 intactas.
- Run39623344071 falló por validar MP3 como cifra; 29 registros recuperados intactos. [Reanudación39624247518](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39624247518):131 nuevos, 160 totales; 70 tests reales, cleanup correcto, cero artefactos. Run anterior39623097623 cancelado con 0 registros/cleanup correcto.
- **es 358/360 rechazado**, omite tono alto/reproducción rápida; **nb 359/360 solo referencias**. No completo v10.80 idas/vueltas y diez registros con avisos reconciliados; 72 idas iguales por hashes, ocho nuevas.80 comparaciones legacy históricas no contadas como evaluaciones nuevas.
- **8.497 registros, 2.251 evaluaciones, 512 fixtures (481 ida, 31 vuelta), 0 aprobados.** Tres fixtures semánticos nuevos y 12 tests nuevos; reproducciones rojas antes de arreglos. Adenda histórica por hashes conserva la revisión v9 al añadir hallazgo posterior de vuelta.
- CI final [39626385396](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39626385396), código 1dd7f8c:**verde:3.045 Node; 71 Python (69 correctos y 2 omitidos por dependencias); check, idiomas, hub y preview verdes**. actionlint y Gitleaks correctos; 42 archivos remotos contrastados y nueve políticas medidas intactas.
- GET/XML de producción15:09 y15:26UTC:10.260+15.365=25.625 URLs; tres rutas falsas del hub200, sin deploy. No se certifican UI/responsive/RTL/peso/a11y/rendimiento/hardware, 18 puntos ni siete capas.
- Pedro:0 nuevas, P-001–P-008 pendientes, 0 FALLA. Siguiente v11 por cobertura semántica; referencias antes del completo, después 28 destinos y 80 muestras pocos recursos. Paso A/capacidad Pages/37 traducciones abiertos; sin fase 0. [Informe y limpieza](lotes/2026-10-21-piloto-v10.md).

## 2026-10-21 · Codex · Paso A: v9 por familia y auditoría regional/avisos
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador; `9b430c3`…`1a963cc`.
  V2–v9 medidos intactos; fuentes, slugs,700 existentes y estados de herramientas preservados; sin merge del código/deploy.
- V9 añade cuatro memorias completas para cubrir las cinco claves de duración/tamaño (una existente), ligadas a fuente/contexto.
  [Referencias 39547858733](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39547858733): es 360/360,nb 360/360.
  [Completo 39548546424](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39548546424): **fijo 88 es 772/792,nb 768/792, rechazados**.
  Misma muestra 68:592/612 y 588/612;20 adicionales conocidas180/180 ambos, no prueba ciega. Cleanup de los dos runners verificado.
- 177 nuevas evaluaciones del completo, incluida Visible es fuera de muestra.40 comparaciones legacy históricas solo verifican
  hashes, no se cuentan como nuevas evaluaciones ni revisión nueva de sus vueltas. Revisión de agente, sin nativos.
- Auditor permanente: cada aviso, hash y decisión; no heredar puntuación perfecta sobre un fixture ni omitir avisos fuera de muestra.
  Regresión de cobertura roja al quitar Visible. Guard regional separa cantidad literal inglesa de su lectura local en es/nb;
  detecta200,000 ambiguo sin modificar inferencia/checkpoints/políticas medidos. Sin reparar salidas ni relajar guards históricos.
- **8.337 registros,2.171 evaluaciones (con repeticiones),509 fixtures (479 ida,30 vuelta), 0 idiomas aprobados**.
  37 fixtures nuevos; suite ligera59 Python,57 correctos y 2 dependencias. CI final [39550210253](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39550210253), código 1a963cc: verde: 3.045 Node; 59 Python (57 correctos y 2 omitidos por dependencias); check, idiomas, hub y preview verdes.
  Gitleaks sin secretos y actionlint correcto. Los modelos probaron56/58 casos con dependencias según su commit; audit regional posterior.
- Producción por GET/XML, dos snapshots: **25.625→25.625 URLs**, tres falsos paths del hub aúnHTTP200. Sin activaciones ni envíos.
  No se certifican siete capas/18 controles, UI, responsive/RTL, a 11y/rendimiento o hardware.0 pruebas nuevas para Pedro;
  P-001–P-008 pendientes, 0 FALLA. Siguiente v10: contexto completo por familia +datos regionales/gramática, sin fase 0 ni masiva.
  Capacidad Pages/37 idiomas pendientes. [Informe, datos y limpieza](lotes/2026-10-21-piloto-v9.md).

## 2026-10-21 · Codex · Paso A: v7/v8, tipos numéricos y guard de cantidades inventadas
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador; código `203422e`…`96c7440`.
  Políticas v2–v8 medidas intactas. Solo runner/políticas/evidencia, sin cambios de src/public, merge del código o deploy.
- V7 tipa cantidades/coordenadas/paquetes, desambigua objetos geométricos y audio. Gate inicial retirado al reconciliar
  el aviso de respuesta negativa con la rúbrica v6. Completo 39484416039 cancelado antes de emitir datos; limpieza verificada.
- V8 añade No/Nei explícito en FAQ equivalentes y ejemplo Shikaku claro. [Referencias 39485133272](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39485133272):
  **es353/360 rechazado** por «30 10 segundos» frente a 30; **nb360/360 solo referencias**. No completo v8.
  La salida cruda queda bloqueada como machine-draft; no se repara eliminando el dato por conjetura.
- **7.481 registros, 1.914 evaluaciones registradas (con repeticiones), 472 fixtures (458 ida, 14 vuelta), 0 idiomas aprobados**.
  Contratos de memoria por hash/contexto, cobertura de errores ligada a rúbricas/checkpoints independientes y dirección back separada.
- Suite ligera: **55 Python, 53 correctos y 2 de dependencias**. Jobs reales: 51 y 53 con dependencias, antes de los dos
  últimos controles ligeros. CI final [39486540297](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39486540297), `96c7440`: **verde: 3.045 Node; 55 Python (53 correctos y 2 omitidos por dependencias); check, idiomas, hub y preview verdes**.
  Actionlint válido; Gitleaks sin secretos. Conflictos documentales de main integrados sin cambiar el árbol de código.
- Producción por GET de XML: **25.625→25.625 URLs**, tres rutas falsas del hub aún HTTP 200. Sin activaciones, 301 ni envíos.
  No certifica siete capas/18 controles de herramientas, UI, responsive/RTL, rendimiento o hardware.
- Pedro: **0 pruebas nuevas**, P-001–P-008 pendientes, 0 FALLA. Próximo v9 por familia de cantidades críticas;
  no masiva ni fase 0. Capacidad Pages y 37 idiomas siguen abiertos. [Informe y limpieza](lotes/2026-10-21-piloto-v7.md).

## 2026-10-21 · Codex · Paso A: v5/v6 y control independiente de regresiones
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, `4c477b7`…`bd74b32`. Sin merge del código ni publicación.
- V5 cubre cada oración, conserva versiones/símbolos por posiciones conocidas y memoria exacta; rechaza privacidad es.
  V6 añade el sentido de no subir ni guardar: referencias es360/360, nb359/360, solo referencias.
- [Completo v6 39455323981](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39455323981): 856 registros,
  160 reutilizados y 696 nuevos; 71 aciertos de memoria, 930,07 s. **Rechazados es y nb** por sentidos técnicos/privacidad,
  Name en el nombre nb, gramática y compuestos. Las omisiones finales revisadas, símbolos y versiones se conservan.
- Misma muestra de 68 claves +20 adicionales fijadas con semilla: 176 candidatos revisados y 40 actuales conservados por hash.
  **7.161 registros, 1.754 evaluaciones registradas (con repeticiones), 464 fixtures (456 ida, 8 vuelta), 0 idiomas aprobados**.
- 45 tests Python (43 pasan localmente, 2 de dependencias en runner); cobertura cruza rúbricas/checkpoints independientes.
  Control de identificadores de paquetes, trazas, memoria y auditoría de vuelta separada. Políticas v2–v6 medidas intactas.
- CI final verificada y verde: [39460406968](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39460406968), `bd74b32`.
  3.045 Node y 43 Python correctos, 2 omitidos por dependencias; check, idiomas, hub y preview verdes. Dependencias reales probadas en los jobs de modelos. Actionlint válido, Gitleaks sin secretos en 2,83 MB de diff y el refuerzo posterior.
- Producción GET: 25.625→25.625 URLs en sitemaps; tres rutas falsas del hub aún 200. Sin deploy, activaciones, 301 ni envíos.
  Las siete capas de herramientas, responsive/RTL, rendimiento y hardware no se certifican por este lote de infraestructura.
- Pedro: ninguna prueba nueva; P-001–P-008 pendientes y 0 FALLA. Siguiente v7 por familias; no ampliar ni fase 0.
  [Informe y cierre](lotes/2026-10-20-piloto-v5.md); capacidad de Pages y 37 idiomas siguen abiertos.

## 2026-10-20 · Codex · Paso A: referencias corregidas y piloto completo es/nb rechazado
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador. `2c75dc2`…`dfe55ae`.
  Inglés controlado por sentido, tres variantes separadas y siete entradas de memoria exacta revisadas por el agente.
- Referencias v4: es 360/360 y nb 358/360; cero errores en botones/cifras/negaciones, dos leves/40 en nb.
  Después, [piloto completo 39437391534](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39437391534):
  214 cadenas × 2 idiomas × (sistema híbrido + actual) = **856 registros**; reutiliza 160 y añade 696.
- **6.145 registros** totales; **1.378 evaluaciones** del agente (pueden repetir texto entre variantes), **410 regresiones**.
  **0 idiomas aprobados**: el completo revela nuevos Clear/clean incorrectos, omisiones de No/privacidad/límites,
  versiones y símbolos de unidad alterados. No ampliar esas combinaciones hasta corregir en una política nueva.
- Memoria con origen/digest; checkpoints inmutables por política; control de símbolos de unidad y tokens técnicos en la vuelta;
  reanudación real sin modelo y rechazo de suplantación de identidad. MADLAD baseline de seis destinos más revisado.
- [CI final 39440552803](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39440552803), `dfe55ae`:
  **3.045 Node**, 33 Python pasan + 2 de dependencias reservados al job de modelos; check, idiomas, hub y preview verdes.
  Dependencias reales probadas en Actions. Actionlint válido; Gitleaks sin secretos en los diffs.
- Producción GET: **25.625 → 25.625 URLs**, tres rutas falsas del hub aún 200; sin merge del código a main, deploy,
  activaciones, 301 ni envíos a buscadores. Las siete capas y la puerta de herramientas siguen pendientes.
- Pedro: **0 pruebas nuevas**, P-001–P-008 pendientes, **0 FALLA**. Relevo y limpieza:
  [informe](lotes/2026-10-20-piloto-contexto.md); datos y rúbricas en la rama del PR.

## 2026-10-20 · Codex · Paso A: referencias de traducción computadas; 0 idiomas aprobados
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), rama `feat/new-tools-batch-1`; sin merge/publicación.
- Corpus real de tres herramientas, 40 referencias, 37 idiomas. Tanda es/nb de ambos motores: 320 registros.
  M2M100: 40 referencias en 35 destinos soportados (2.371 registros); MADLAD en los 36 destinos (2.438).
  **4.809 registros** conservados y fusionados sin perder las tandas previas; te solo con MADLAD.
- 642 traducciones evaluadas por el agente, sin revisión nativa inventada; 202 salidas rechazadas como regresiones.
  **0 idiomas aprobados**: glosario y marcadores deben corregirse antes de ampliar combinaciones fallidas.
- Extracción segura de las 300: 15.815 unidades; 7.887 cadenas distintas; slugs, archivos y datos del revisor conservados.
  Tests de reanudación atómica, no descarga con checkpoint completo y retrotraducción. Detalle:
  [informe del lote](lotes/2026-10-20-piloto-actions.md) y
  [piloto en la rama](https://github.com/pedronunezwebs-hash/usefulverse/blob/feat/new-tools-batch-1/docs/quality/translation-pilot.md).
- Producción por GET: sitemaps **25.625 → 25.625**; tres rutas falsas devuelven 200. Sin deploy, activaciones ni cambios de fase.
  [CI final 39405978076](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39405978076), `f8fe929`:
  **3.045 tests Node**; 19 Python pasan, 2 de dependencias solo en el job de modelos; builds y puerta de idiomas verdes.
  Pedro: ninguna prueba nueva, P-001–P-008 pendientes y 0 FALLA. Limpieza real anotada en el informe tras borrar el clon.

## 2026-10-20 · Codex · Paso A: fuente recuperada y CI verde; publicación pendiente
- [PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136) en borrador, rama `feat/new-tools-batch-1`.
  Fuente de las 300 recuperada selectivamente del respaldo privado `27a2f174`, sin importar su historial.
- Commits de código: `7879f9a` (recuperación y noindex), `83efa8a` (CI aislada/estilos), `4e8d27c` (referencias del catálogo).
- [CI final](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39398910565): **3.041/3.041 tests**,
  `npm run check`, `locale:release-check`, hub público y build aislado de las 300 verdes. Preview: 11.293 archivos;
  10.800 páginas de herramientas con noindex + homes noindex; sitemap vacío. Noindex/hreflang/robots con regresión.
- Gitleaks: 0 secretos. Columnas de pruebas añadidas a `progress.csv`; las siete capas de las 300 siguen pendientes.
- Producción comprobada por HTTP: sitemaps con **25.625 URLs**; 10 URLs de la preview antigua con meta/cabecera noindex;
  las tres rutas inventadas del hub aún devuelven 200. El sitemap de la preview antigua respondió 403 al revalidarlo.
- **Sin merge, deploy, envíos a buscadores ni activaciones. Paso A NO terminado**: capacidad conjunta de Pages insuficiente
  y traducciones revisadas/nb pendientes. No se avanza de fase. En main: 0/300; activadas: 0; existentes terminadas: 0/700.
- Pedro: 0 pruebas nuevas, P-001 a P-008 siguen pendientes, 0 FALLA. Relevo y limpieza: `lotes/2026-10-20-paso-a.md`.

## 2026-10-20 · Claude · Auditoría del catálogo y PDF con IA
- Rastreo de las 700 páginas EN + 7 auditorías por categoría frente a los líderes → `AUDITORIA-CATALOGO.md` (13 problemas de
  todo el sitio, 26 errores confirmados, huecos) y `auditoria/*.md` con evidencia. Rastreo en `auditoria/rastreo-700-en.csv`.
- `PDF-VS-ILOVEPDF.md` (29/31 funciones; 16 páginas por intención) y `PDF-IA.md` (resumir y traducir en el dispositivo).
- Sin cambios en la web.

## 2026-10-20 · Claude · Repo público con seguridad
- gitleaks: historial (448 commits), PRs/issues (132) y registros de Actions (369) → 0 secretos.
- Token de Cloudflare nuevo solo de Pages (`usefulverse-github-deploy`); escaneo de secretos con bloqueo de push; Dependabot;
  acciones fijadas por SHA; ruleset `main` + `backup/*`; PRs externos con aprobación. Repo → público.
- Unificación de dominio diseñada (RUNBOOK §4b). Revisión final (REVISION-FINAL.md).

## 2026-10-20 · Claude · Documentación y relevo
- Diagnóstico, plan de calidad, estrategia 1M, RUNBOOK, ESTADO.md, MAPA-REPO.md, progress.csv.
- Copia de seguridad del trabajo sin guardar de las 300 herramientas: rama `backup/codex-300-tools-20261020` (commit `636f3c1`).
- Sin cambios en la web. Siguiente: ver ESTADO.md §1.


## 2026-10-22 · Codex · v13 en curso

Candado 239e101. V12 cruda reproducida en23 casos;3 tests primero rojos y luego verdes, memoria fuente/hash/contexto88claves154destinos. Lecturas y plan en `lotes/2026-10-22-piloto-v13.md`. Referencias pendientes;0idiomas aprobados,0deploy,25.625URLs indexables previstas sin cambio.

Referencias en curso: [39736865789](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39736865789), fuente `717c7aa7e9617f2e7cf3bae2f338a8a9e9f8fbff`. Recuperar logs/checkpoint; no relanzar. CI PR39736862405 en paralelo, sin deploy.

V13 referencias verificadas:39736865789,fuente717c7aa,ES/NB360/360;80 idas/vueltas,13avisos,8defectos solo vuelta.75 fuentes/idas iguales a v12 por hash y5 cambiadas revisadas.85tests reales,runner limpio,0artefactos.10.369registros/3.074evaluaciones/571fixtures. Plan de completo declarado antes del run:88 comparables+todos428.0aprobados,0deploy.

**Completo v13 en curso:** [39737830473](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39737830473), fuente `22e139ef094cff6c0e677cee5b721e0687e6146d`; reanuda160 registros. Recuperar este run y sus logs, no relanzar. Revisión completa pendiente;0idiomas aprobados.

V13 completo revisado:23 fallos anteriores corregidos,2 leves nuevos fuera de88;88 conocidas792/792 por idioma, global conservador bloqueado.428 candidatos leídos,47+13avisos,35+8hallazgos de vuelta separados.9casos primero rojos;580fixtures510ida/70vuelta. Suplementos históricosv9/v11:1fila cada uno,3vínculos por hashes, originales intactos.11.065registros/3.424evaluaciones.85tests ligeros(83+2dependencias).CI final y cierre pendientes;0idiomas aprobados/0deploy.

**CI final v13 en curso:** [39740313985](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39740313985), fuente `d6d4019fa0ef79b7c399c4130c10c376d90d3904`, árbol idéntico a datos `92c4eea`. Recuperar este run; no desplegar.


## 2026-10-22 · Codex · V13 cerrada

Resultado: los 23 fallos de ida de v12 están corregidos. Tras leer los 428 candidatos actuales aparecen dos fallos leves nuevos,
fuera de las 88 cadenas comparables. El global ampliado sigue bloqueado; cero idiomas aprobados.

[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`.
Política y corrección: [717c7aa](https://github.com/pedronunezwebs-hash/usefulverse/commit/717c7aa7e9617f2e7cf3bae2f338a8a9e9f8fbff).
Datos y regresiones: [92c4eea](https://github.com/pedronunezwebs-hash/usefulverse/commit/92c4eea1505ec9ea862446e943ebc342376867f9).
La sincronización `d6d4019` conserva el árbol completo de `92c4eea`; cambia solo la ascendencia.
700 existentes y 300 candidatas conservadas. Paso A: 0/300 en main y 0 activadas. Sin merge de código, despliegue ni envíos.

Causa: conservar datos y oraciones no demuestra gramática ni contexto. La memoria corrige fuentes conocidas, antes de inferir,
con fuente, hash, contexto y procedencia. No se atribuye al modelo ni demuestra generalización. Algunas salidas varían entre runs,
aunque la revisión y los hashes de los pesos coincidan; por eso se leen los textos actuales.

- [x] Lectura fresca ESTADO → AGENTS → MAPA → RUNBOOK §7A/8 y puerta §6; PRUEBAS/Pedro, REVISION-FINAL §2, PLAN §9,
  método, PESO-Y-DISENO §1–4 y reglas canónicas/FABLE. Pedro: ocho pendientes, cero FALLA.
- [x] Candado `239e101`, 13:48:29 +07:00. Base main `a048330`, feature `9335c51`. Clon superficial aislado;
  inicio: unos 46,94 GiB libres. Modelos y builds completos solo en Actions estándar.
- [x] 23 trazas crudas v12 reproducidas sin nueva inferencia ni reparación. Tres tests primero rojos (26 errores porque
  v13 aún no existía), después verdes. Se añaden 18 claves/23 destinos de memoria: 88 claves/154 destinos totales.
  Preflight de 214 entradas válido. Cantidades, signos Unicode, coordenadas, versiones, identificadores y ambas FAQ de tono conservados.
- [x] [Referencias 39736865789](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39736865789), fuente `717c7aa`:
  ES/NB 360/360. Las 80 fuentes, idas y vueltas leídas; 13 registros con avisos y ocho defectos solo de vuelta.
  75/80 idas y 72/80 vueltas idénticas a v12 por hashes; cinco idas nuevas revisadas. 160 registros, 21 memorias,
  85 tests con dependencias reales, limpieza correcta y cero artefactos. Solo prerrequisito al completo.
- [x] [Completo 39737830473](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39737830473), fuente `22e139e`:
  696 nuevos + 160 reanudados = 856 registros. 133 memorias adicionales, 154 entre ambos runs.
  85 tests reales, limpieza correcta y cero artefactos. Total: 799,1188 s; conversión: 133,6414 s;
  pico: 7.516.772 KiB. No extrapolar estos tiempos a las 300.
- [x] Plan declarado antes del run: 88 comparables y lectura de todos los 428 candidatos. Las 88 pasan con 792/792 por idioma;
  las 20 adicionales conocidas, con 180/180. Los 23 fallos v12 están reparados. Aparecen dos leves nuevos fuera de las 88:
  ES «Se ha añadido rectángulo.» omite «un»; NB «Start en ny oppgave å spille igjen.» omite «for».
  Cada idioma obtiene 1565/1566 en 174 no-referencias, sin errores observados de botones, cifras o negaciones.
  El mínimo de estilo de 1/20 sí se cumple. El plan ampliado previo exige reparar los defectos observados y mantiene el bloqueo global.
- [x] 309/348 idas del completo idénticas a v12 por hashes; 39 cambiadas. Todas las vueltas actuales leídas.
  47 registros con avisos del completo y 13 de referencias reconciliados; 35 + 8 hallazgos de vuelta separados de la ida.
  Siete variantes nuevas de vuelta: casillas → centros de votación/paneles/rutas, brillo de audio → glow,
  tono del audio → tono del aparato, timbre → reverberación y aislar voces → distinguirlas. Las idas correctas se conservan.
- [x] Los nueve casos nuevos provocan nueve subtests rojos antes de añadir fixtures. Total: 580 (510 ida, 70 vuelta).
  El auditor detecta el mismo defecto ES en una fila histórica v9 y otra v11 antes fuera de muestra. Dos revisiones nuevas
  y tres vínculos por hashes, sin reemplazar rúbricas ni gates originales. 49 archivos históricos idénticos; tres entradas
  anteriores de cobertura preservadas y tres añadidas. Once políticas previas intactas y prefijo de 571 fixtures conservado.
- [x] [CI final 39740313985](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39740313985), fuente `d6d4019`:
  3.045 Node; 85 Python (83 correctos y dos dependencias omitidas). Check de 10.260 páginas, 20 locales existentes,
  hub 217 + 100 + 106 y preview verdes. Preview: 11.293 archivos, 10.800 páginas de herramientas y homes noindex;
  sitemap indexable vacío. Publicación omitida y cero artefactos. No certifica la puerta de 18 puntos ni siete capas por herramienta.
- [x] Actionlint 1.7.12 y Gitleaks 8.30.1 de releases oficiales, con checksums verificados: cero secretos.
  Dos snapshots GET/XML propios: 25.625 → 25.625 URLs (10.260 + 15.365), hashes iguales. Las tres rutas falsas del hub
  siguen devolviendo 200 con la home. Solo HTTP; sin revisión visual, responsive, RTL, peso, accesibilidad, rendimiento o hardware.
- [x] Respaldo recuperado al retomar: 118 blobs críticos en Git Trees no truncados. Código y datos coinciden con la CI;
  las dos actualizaciones de metadata CI/seguridad se recuperan por su blob. Se preservan los 49 archivos históricos.
  Siete funciones de inferencia iguales por AST a `22e139e`; `src/` y `public/` intactos respecto a `9335c51`.
- [x] Se detectan seis ZIP de logs propios fuera del clon (v12/v13): 1.804.932 bytes. Retirados tras verificar recuperación
  y runs; se corrige ese residuo del cierre anterior. Los logs posteriores usan caché dentro del lote.
- [x] Eliminación efectiva del clon/QA/logs/descargas/caché propios después de verificar recuperación en ambas ramas.

Inventario: 11.065 registros machine-draft y 3.424 evaluaciones con repeticiones. Las 120 comparaciones legacy
(80 referencias + 40 completo) reutilizan notas históricas por hashes y no cuentan como evaluaciones nuevas.
Siguen pendientes las 37 traducciones revisadas, capacidad Pages, puerta de 18 puntos/siete capas, revisión nativa y UI/dispositivos.
Sin motor congelado, idioma aprobado ni traducción masiva. Pedro: ningún ID nuevo; P-001–P-008 pendientes y cero FALLA.

Siguiente: recuperar la rama y leer `review-context-v13-full.json`, `regression-v13-evidence.json`,
`review-coverage-addenda.json`, `automatic-summary.json` y `full-sample-v13-plan.json`. No repetir los runs guardados.
Crear v14 independiente, conservando v2–v13. Corregir los dos fallos de ida por fuente/hash/contexto; separar los siete de vuelta.
Conservar contratos, preflight de 214, 200000 local probado, ambas FAQ completas y cobertura histórica ligada a hashes.
Primero 40 referencias ES/NB y todos sus avisos; solo si pasan, completo con las 88 comparables y lectura de los 428 candidatos.
Muestra conocida, no ciega. Después, 28 destinos aún sin revisión, incluidos los siete con 80 muestras ha/am/te/gu/ta/mr/sw.
Antes de ampliarlos, probar las gramáticas numéricas: hoy solo en/es/nb; las demás bloquean y no se relaja el contrato.
No congelar motor sin comparación objetiva ni avanzar a fase 0 mientras Paso A siga abierto.

Coste: runner estándar del repo público; sin artefactos, cachés persistentes, Packages, LFS, Codespaces, API de pago u operación
Cloudflare. [GitHub, consultado 22-oct](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
No se audita facturación global. Onboarding Cloudflare, diseño Zenith y reenvío de sitemaps: N/A, piloto aislado sin publicación.

Al retomar a las 17:48 +07:00, la carpeta temporal anterior ya estaba ausente. No se atribuye su retirada a este cierre
ni se inventa su instante o tamaño. Código, checkpoints y CI se recuperaron de GitHub sin repetir modelos o builds.
La retirada medida de la nueva carpeta de cierre figura al final.

Retirada efectiva de la carpeta de cierre el 2026-10-22T17:59:30.648930+07:00 (2026-10-22T10:59:30.648930+00:00 UTC): se eliminó directamente, sin Papelera, solo /private/tmp/usefulverse-codex-v13-cierre-20261022.9tw_spk4. Tamaño medido antes de retirar: 30812 KiB. Disco libre después: 50.3661 GiB. Ruta, auxiliar del arranque y ZIP de logs propios externos comprobados ausentes. La carpeta v13 original ya estaba ausente al retomar; no se inventan su tamaño ni fecha de retirada. Antes de borrar se verificaron 120 archivos críticos, seis documentos idénticos en ambas ramas y recuperación de todos los archivos de proyecto locales; feature cda7b22e17c2d2a8ab2577669b9e668f7232e332, main 54b429415cf4b20c8f22b2d8be09004cf9b3833b. Código de rama idéntico a CI final, main solo cambió documentación; PR abierto, borrador y fusionable.


## V14 · 2026-10-22 · Codex · en curso

Candado 572d1d8; fuente previa feature 1a34b53/main 8cda84d. Dos casos crudos v13 reproducidos y dos tests rojos antes del arreglo (cuatro errores por política inexistente). Dos memorias nuevas; política independiente, referencias/completo pendientes. Plan e informe persistentes. Sin deploy.

V14 references: [39768400364](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39768400364), fuente `48e0fcfffa0c19b83a1746c397718f7b9abdd13a`. En curso; recuperar este run antes de relanzar. Sin despliegue ni aprobación.

**V14 referencias verificadas:** run 39768400364, fuente 48e0fcf; ES/NB 360/360. Las 80 fuentes/idas/vueltas leídas, 14 avisos reconciliados y nueve defectos solo de vuelta; 75 idas/72 vueltas idénticas a v13 por hashes, cinco idas nuevas. 160 registros, 21 memorias, 87 tests reales, limpieza correcta, cero artefactos. Suite local del checkpoint 87 (85 correctos, dos dependencias omitidas). Completo autorizado por este prerrequisito; aún no lanzado. No repetir referencias ni v13.

V14 full: [39769512465](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39769512465), fuente `08a0498a2dd1e14b8ee7330a577366c87f9f0276`. En curso; recuperar este run antes de relanzar. Sin despliegue ni aprobación.

**V14 completo revisado:** run 39769512465, fuente 08a0498; 856 registros (696 nuevos/160 reanudados), 156 memorias totales y 272 idas puras del modelo. 428 candidatos leídos; 88 conocidas 792/792 por idioma. Global ampliado: ES 1565/1566, bloqueado por el calco leve procesamiento más suave en voice-changer.fields.device; NB 1566/1566, muestra conocida aprobada, sin aprobar el idioma. Mínimo de estilo cumplido. 48+14 avisos reconciliados, 37+9 hallazgos de vuelta separados. Cinco casos primero rojos y 585 fixtures. 11.921 registros y 3.856 evaluaciones con repeticiones, incluida una retirada explícita de nota perfecta v12 ligada por hashes. 89 tests locales (87 correctos/dos dependencias omitidas); ambos jobs de modelo pasaron sus 87 tests reales, limpieza y cero artefactos. CI final pendiente; no repetir modelos. Siguiente tras cierre: v15 independiente para ese único calco ES. Sin deploy.

CI final v14 [39773203261](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39773203261), fuente `2f1b4c2f478ba1a9f312d629bda04fabf04c1b69`: en curso. Recuperar antes de repetir; validará las 585 regresiones y el retiro explícito con 89 tests Python. La CI inicial 39768406467 está verificada (3.045 Node/87 Python, 85+dos dependencias); sin publicación. Modelos ya revisados, no relanzar.


## V14 · cierre verificado · 2026-10-22 · Codex

V14 corrige los dos fallos Shikaku por memoria exacta (90 claves/156 destinos). 428 candidatos leídos: 88 conocidas 792/792 por idioma; ampliado ES 1565/1566 bloqueado por un calco leve y NB 1566/1566 pasa la muestra conocida. Mínimo de estilo 1/20 cumplido. 11.921 registros, 3.856 evaluaciones con repeticiones, 585 fixtures (511 ida/74 vuelta); cero idiomas aprobados.
Corrección 48e0fcf; datos/auditor 2f1b4c2; CI 39773203261 (3.045 Node, 89 Python: 87 + dos dependencias). Modelos 39768400364/39769512465,
87 tests reales por job, limpieza correcta, cero artefactos.48 + 14 avisos y 37 + 9 hallazgos de vuelta separados. Cinco casos primero rojos;
prefijo 580 conservado. Tres filas históricas negativas nuevas y una retirada explícita de falsa nota perfecta v12; originales/gates intactos.
Ocho decisiones adicionales solo de vuelta; seis vínculos de cobertura y dos entradas de vuelta anteriores preservados.
Retiro con hashes y 30 ataques; no puede aprobar, mejorar notas ni usar datos/fixture ajenos.
Producción GET/XML: 25.625→25.625 y hashes estables, tres soft 404 siguen devolviendo 200. Sin deploy, activación, merge de código o envíos.
No certifica las 37 traducciones, puerta 18/siete capas, revisión nativa o UI/hardware. Pedro: ningún ID nuevo, P-001–P-008 pendientes, cero FALLA.
Siguiente: Crear v15 independiente para ES voice-changer.fields.device: sustituir el calco «procesamiento más suave» por una formulación informática natural («procesamiento más fluido»), por fuente/hash/contexto. Primero reproducción y test; no editar v2–v14. Conservar contratos y el retiro explícito. Referencias ES/NB y todos sus avisos; solo si pasan ambas, completo con las 88 conocidas y lectura de los 428 candidatos. Muestra conocida, no ciega. Después, gramáticas numéricas verificadas y los 28 destinos aún sin revisión, incluidos ha/am/te/gu/ta/mr/sw con 80 muestras. No repetir runs guardados ni pasar a fase 0.
Retirada efectiva el 2026-10-22T19:05:47.850637+07:00 (2026-10-22T12:05:47.850637+00:00 UTC): se eliminó directamente, sin Papelera, solo la carpeta temporal propia `usefulverse-codex-v14-20261022.rfxlfdh8`. Tamaño previo: 556608 KiB; disco libre posterior: 50.4247 GiB. Antes de borrar: 7417 archivos versionados recuperables en GitHub, 79 archivos críticos comprobados, seis documentos de relevo idénticos en ambas ramas, 50 archivos históricos intactos y código igual al de la CI final. Cero punteros LFS y cero ZIP de logs propios fuera del lote. Los cuatro ZIP internos, clon, QA, binarios de verificación, logs, cachés y auxiliares propios se retiraron con la carpeta. Fuentes verificadas antes de retirar: feature 88cf1f5787b9556f3b164b55f43ab55a2aec680d; main f799c176165024b0f90bef43680edf8643630b15. PR abierto, borrador y fusionable; cuatro runs correctos, cero artefactos y ninguna publicación. Ruta comprobada ausente después.


## 2026-10-23 · Codex · v15 iniciado

Candado 4f11323; raw v14 device reproducido, test primero rojo (2 tests/3 errores), política exacta v15 preparada. Pendiente suite, referencias, completo condicionado, CI/HTTP y cierre. Paso A abierto; sin despliegue.

V15 references lanzado: [39905785741](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39905785741), fuente `a591e4bb7f92eaeae85bc762d7e6254b88b6ae33`. Recuperar este run antes de repetir; sin despliegue.

V15 referencias verificadas: run 39905785741 ES/NB 360/360, todos los 80 textos/idas/vueltas leídos, 14 avisos y nueve defectos de vuelta separados. 160 registros. Completo permitido como siguiente hito; no publicación ni aprobación de idioma.

V15 full lanzado: [39906585266](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39906585266), fuente `63443a6fdc9bb97ce07ba9f872cf5d340d4d8321`. Recuperar este run antes de repetir; sin despliegue.

CI inicial 39906569320 correcta: 3.045 Node, 91 Python (89 correctos/dos dependencias), check/20 locales existentes/hub/preview, publicación omitida y cero artefactos. Preview real: 11.293 archivos y 10.800 herramientas noindex. Un test permanente primero rojo corrigió un error del recolector nuevo (había leído 8.253 archivos del hub como preview); evidencia histórica intacta. Suite actual: 92 Python (90+2). Los jobs de modelo ejecutan 91 de su fuente original, no 92.

V15 completo 39906585266 recuperado y 428 candidatos leídos: ambas muestras conocidas pasan; 12.777 registros, 4.284 evaluaciones y 585 fixtures. 47+14 avisos y 37+9 hallazgos de vuelta separados. 92 tests locales (90+2); CI final pendiente.

CI final v15 [39908407189](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39908407189), fuente `5ab99a10ff5351637227d68610cb441dc4973dc6`. Recuperar resultado antes de repetir; cierre y limpieza pendientes.

Retirada efectiva el 2026-10-23T17:57:15.427184+07:00: eliminada directamente, sin Papelera, solo la carpeta propia `usefulverse-codex-v16-20261023.o52orrtk`; ruta comprobada ausente. Tamaño previo 555716 KiB; disco libre posterior 49.4914 GiB (53141037056 bytes). Antes de borrar: 7457 archivos versionados recuperables y 110 críticos verificados online; seis documentos idénticos, 80 históricos/adendas/prefijo585 intactos, código/checkpoints/revisiones/fixtures iguales a la CI final. Cero punteros LFS, los dos runs correctos sin artefactos/publicación y cero ZIP propios externos. 2 ZIP internos de logs retirados con clon, QA, binarios, fuentes auxiliares y cachés; sin modelos ni builds locales. Fuentes verificadas: feature 9ce625395c78d3cf8ecc6c00c8359cc2d4df26af; main 7734a99bca907e1e30dd626d7e5cdc6a4e5d8144.

Retirada efectiva el 2026-10-23T22:25:00.279423+07:00: eliminada directamente, sin Papelera, solo la carpeta propia `usefulverse-codex-v17-20261023.tue22ugt`; ruta comprobada ausente. Tamaño previo 560284 KiB; disco libre posterior 36.0278 GiB (38684532736 bytes). Antes de borrar: 7479 archivos versionados recuperables y 196 críticos comparados online mediante árbol Git/índice; seis documentos idénticos,152 históricos/adendas/prefijo623 y86 grupos antiguos conservados; código/checkpoints/revisiones/fixtures iguales a CI final. Cero punteros LFS; tres runs correctos sin artefactos/publicación y cero ZIP propios externos. 3 ZIP internos retirados con clon, scripts, QA, binarios, fuentes auxiliares y cachés; sin modelos ni builds locales. Fuentes verificadas: feature `cafdba114539e0983709a3b6792c70c5324e6dfd`; main `d10ceb25280b22c31d25ce6921af9acac1bf1ee9`. Candado liberado solo tras esta retirada.


---

# Lote v18 · Paso A · Codex · 23-oct-2026

[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), borrador, rama `feat/new-tools-batch-1`.

V18 corrige las 37 idas coreanas negativas de v17 mediante memoria exacta de fuente/hash/contexto. Conserva los 168 destinos anteriores: 205 destinos de memoria (48 ko y 157 ES/NB). Políticas, gramática, checkpoints, revisiones y tres adendas anteriores intactos; diez funciones iguales por AST. [Corrección](https://github.com/pedronunezwebs-hash/usefulverse/commit/489185efa98d32eb2704e09384f016bbe8076ccb).

[Referencias 39979681259](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39979681259): modelo 360/360, pasa; legacy 219/243, rechaza. [Completo 39980833943](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39980833943): 266 registros nuevos y las 67 referencias reanudadas exactamente. Las 333 fuentes/idas/vueltas se leyeron directamente. Modelo: 174 entradas, 1566/1566, sin idas negativas; mismas 88 claves fijas, 792/792. Son 38 memorias conocidas y 136 inferencias fuera de referencias. Legacy: 92 entradas, 812/828 y diez negativas. Comparación común de 92: modelo 828/828 frente a legacy 812/828. Pasa esta muestra conocida; no es validación ciega, nativa ni de texto no visto, ni aprobación de un idioma.

151 registros con avisos conciliados (21+16 referencias y 76+38 completo), 61 hallazgos de vuelta separados de la calidad de ida. Once fallos nuevos de vuelta —área/anchura, casilla/columna, mezcla de duración/tono, ámbito de procesamiento y otros— tienen fixtures exactas: primero un test rojo con 11 fallos, después verde. Cinco tests Python nuevos; suite local final 114 (112 correctos, dos dependencias omitidas) y dos Node de corpus. Los runners pasaron 113/114 tests con dependencias reales, modelo INT8 idéntico a v17, limpieza correcta y cero artefactos/publicación. Se corrigieron metadatos detectados por tests y la etiqueta de tres vueltas legacy inducidas, sin tocar crudos, notas ni gates históricos. Total: 13.510 registros, 5.017 evaluaciones con repeticiones y 732 fixtures (575 ida/157 vuelta).

Producción antes: GET/XML real, 25.625 URLs y tres soft404 pendientes. Seguridad verificada con Actionlint 1.7.12 y Gitleaks 8.30.1 oficiales con checksum, excluyendo solo el falso positivo histórico de un objeto Git comprobado. [CI final 39983727423](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39983727423), fuente `82f69e28f5d4767eb5ce520d0897ac565fc1b7af`, correcta: 3.045 Node, 114 Python (112 correctos y 2 omitidos por dependencias). Validadas 10.260 URLs de sitemap, 20 locales existentes, hub 217+100+106 y preview de 11.293 archivos / 10.800 páginas de herramienta y todas las homes noindex; cero URLs indexables en su sitemap. Ambas publicaciones omitidas, job de modelo omitido y cero artefactos. GET/XML antes/después: 25.625→25.625 URLs con estados, bytes y hashes estables; tres rutas falsas siguen 200. No es prueba de UI ni de indexación real en buscadores. Cero idiomas aprobados, activaciones, despliegues o cambios de src/public.

ES/NB conservan la muestra conocida de v15; coreano pasa ahora la muestra conocida v18. El piloto de los 37 idiomas sigue abierto, sin motor congelado ni paquete nuevo publicado. Candado se libera solo después de verificar respaldo completo y retirar realmente los temporales propios; recibo al cerrar.

Siguiente: Iniciar v19 para id: reproducir primero el contrato numérico no soportado con un test rojo, fijar fuentes CLDR y gramática id versionada por política; conservar conducta y digests históricos de v16/v17/v18, sin ampliar el parser global ni aceptar cifras por defecto. Referencias y todos sus avisos primero; completo solo si pasan. Después los otros 26 destinos pendientes; ha/am/te/gu/ta/mr/sw necesitan 80 muestras. ES/NB conservan v15 y los seis destinos antiguos conservan evidencia histórica, sin validación nueva de v18. Paso A abierto por capacidad Pages y 37 traducciones revisadas/nb real; no avanzar a fase 0. No repetir runs v18 39979681259/39980833943.

Checklist del lote:

- [x] Lecturas frescas, candado y clon aislado
- [x] 37 reproducciones rojas→verdes, herencia y preflight
- [x] Referencias y todos sus avisos conciliados
- [x] 333 fuentes/idas/vueltas y todos sus avisos revisados
- [x] CI final/HTTP/seguridad y respaldo remoto
- [ ] Limpieza local efectiva (tras respaldo remoto; recibo al cerrar)

Alcance: política/memoria y evidencia del piloto; 0/300 en main, 0 activadas, 0 idiomas aprobados, 0 despliegues/envíos. Paso A sigue abierto por capacidad Pages y 37 traducciones revisadas/nb real. No avanzar fase 0. Puerta 18/siete capas pendientes.

Pedro P-001–P-008 pendientes, 0 FALLA, sin IDs nuevos. No hay cambio de UI/hardware: revisión nativa, dispositivos, visual/responsive/RTL 320–1920, márgenes, peso, accesibilidad y rendimiento no comprobados.

Cómputo: repo público, ubuntu-latest estándar, 0 USD según [GitHub](https://docs.github.com/en/billing/concepts/product-billing/github-actions), leído el 23-oct; no es una auditoría de la factura global. Sin API de pago, Cloudflare, Containers, Codespaces, Packages, LFS, artefactos nuevos ni cachés persistentes. Modelos y builds completos solo en Actions.

Retirada efectiva el 2026-10-23T23:16:07.484944+07:00: eliminada directamente, sin Papelera, solo la carpeta propia `usefulverse-codex-v18-20261023.cvrdmt_r`; ruta comprobada ausente. Tamaño previo 569636 KiB; disco libre posterior 35.9419 GiB (38592286720 bytes). Antes de borrar: 7501 archivos versionados recuperables y 226 críticos comparados online mediante árbol Git/índice; seis documentos idénticos, 155 archivos históricos, prefijo de 721 fixtures y 90 grupos antiguos conservados. Código, checkpoints, revisiones y fixtures iguales a CI final. Cero punteros LFS; tres runs correctos sin artefactos/publicación y cero ZIP propios externos. 3 ZIP internos retirados con clon, scripts, QA, binarios, fuentes auxiliares y cachés; sin modelos ni builds locales. Fuentes verificadas: feature `e9ec076a4843390666862d1c45e4bca4ae95b70e`; main `a88a4cfeaaf1cd62f1198934a4d8a097b26ff51c`. Candado liberado solo tras esta retirada.
