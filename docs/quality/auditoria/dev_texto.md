# Auditoría · Desarrollo y datos + Texto e idiomas (UsefulVerse)

Fecha: 20-oct-2026. Alcance: 69 páginas de desarrollo y datos más 17 de texto e idiomas, según los CSV. He probado a fondo 31 herramientas en Chrome sin interfaz (agent-browser) sobre producción y he leído el JS que sirve cada una (`app.js` del dominio principal, sus módulos diferidos y los 24 paquetes de `tools.`). Etiquetas: **[V]** verificado con prueba o con código; **[NV]** sin verificar (sobre todo volúmenes de búsqueda, porque no he usado APIs de pago).

## Resumen

- **La privacidad está bien de verdad [V].** Ningún paquete descargado contiene `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket` ni analítica. Las herramientas sensibles usan WebCrypto en local: JWT encoder (HMAC), AES (AES-GCM con PBKDF2 de 600 000 iteraciones), RSA (`subtle.generateKey`) y bcrypt (en un Worker). La contraseña usa `crypto.getRandomValues` con muestreo por rechazo, así que no hay sesgo. Lo que falta es poder **demostrarlo**: ningún host envía cabecera CSP.
- **Calidad funcional bastante por debajo de los líderes.** Lo más grave:
  - el comparador de textos compara por posición de línea, no hace un diff real;
  - el probador de regex bloquea la pestaña 14,7 s con `(a+)+$`;
  - el validador de JSON Schema da «Valid» con datos que no lo son;
  - el constructor de cron solo genera 4 plantillas: no interpreta expresiones ni enseña las próximas ejecuciones;
  - JSONPath no admite `..`, filtros ni slices.
- **Hay muchos modos que deberían ser páginas propias** (codificar/decodificar, minificadores, JSON a TypeScript, MD5, SHA-1, SHA-512, character counter).
- **SEO.** Las páginas del dominio principal son finas: unas 220-250 palabras y 2 FAQ, frente a 300-430 palabras y 5 FAQ en `tools.`. Las tres herramientas siguientes llevan «Free & Unlimited» en el título y tienen topes duros:

  | Herramienta | Tope |
  |---|---|
  | json-diff | 200 000 caracteres |
  | graphql-formatter | 100 000 caracteres |
  | text-to-binary | 20 000 caracteres |

- **Los dos hosts no se enlazan entre sí**: 0 enlaces del principal a `tools.` y 0 de vuelta. Con eso se reparte la autoridad y se pierden parejas naturales: jwt-decoder con jwt-encoder, robots-txt-generator con robots-txt-tester, sitemap-xml-generator con sitemap-validator.
- **Ningún host tiene modo oscuro** [V]: no hay `prefers-color-scheme` en `styles.css` ni en `growth600.css`. Tampoco hay números de línea, resaltado de sintaxis ni atajos de teclado en los editores del dominio principal.

## Huecos frente a los líderes

Los volúmenes son estimación cualitativa **[NV]**.

| Hueco (keyword EN) | Líder de referencia | Qué tenemos | Demanda |
|---|---|---|---|
| md5 generator / sha1 / sha512 / hmac generator | CyberChef, codebeautify, freeformatter | Solo `sha256-hash-generator` (texto) y `file-checksum` | Muy alta |
| cron expression explainer / "crontab guru" / next run | crontab.guru | Un constructor de 4 plantillas | Muy alta |
| fancy text / unicode font / small text / bold text generator | lingojam, convertcase | Nada | Muy alta |
| character counter (página propia) | wordcounter.net, charactercountonline | Va metido dentro de word-counter | Muy alta |
| json to typescript / c# / java / go / zod / python | transform.tools, quicktype | `json-model-generator` (TS/C#/Java) sin páginas propias; sin Go, Zod, Python, Kotlin, Swift ni Rust | Alta |
| css / js / html minifier | toptal, codebeautify | Solo un modo dentro de los formateadores | Alta |
| base64 to image / base64 decode file | base64decode.org, base64.guru | Solo de archivo a Base64 | Alta |
| camelCase / snake_case / kebab / alternating / inverse case | convertcase.net | 4 modos | Alta |
| regex replace / explain / cheatsheet / flavors | regex101 | Solo coincidencias | Alta |
| xml to json, yaml validator, toml↔json, json to sql, csv to sql | transform.tools, codebeautify | Solo json→xml y xml→csv | Media-alta |
| jwt verify RS256/ES256 + JWKS | jwt.io | Decoder sin verificación; encoder solo HS256 | Media-alta |
| uuid v7 / ulid / nanoid / guid / uuid validator | uuidgenerator.net | Solo v4 y como mucho 100 | Media |
| sort lines, reverse text, find & replace, add line numbers, remove extra spaces | textfixer, convertcase | Solo dedupe y quitar saltos de línea | Media |
| rot13 / caesar cipher, base32, punycode, hex↔text | CyberChef | Nada | Media |
| chmod calculator, http status codes, user-agent parser, curl to code, .htaccess redirect | varios | Nada (api-request-builder solo genera código) | Media |
| SERP snippet preview (pixel width), Open Graph preview, hreflang generator, llms.txt / security.txt generator | Mangools, metatags.io | meta-tag, robots, sitemap y json-ld | Media (llms.txt en alza) |
| Hemingway: frases difíciles, pasiva, adverbios; Flesch-Kincaid Grade, Gunning Fog, SMOG | Hemingway, readable | Un índice por idioma, sin resaltados | Alta |
| morse audio / luz / velocidad WPM | morsecode.world | Solo texto | Media |

## Páginas dedicadas y variantes

Regla: cada variante usa el mismo motor con un modo preestablecido, pero lleva H1, intro, ejemplos y FAQ propios, y canonical a sí misma. No se borra ni se redirige nada.

1. **Separar intenciones combinadas:**
   - `base64-encoder-decoder` → base64-encode, base64-decode, base64url y base64-to-image;
   - `url-encoder-decoder` → url-encode, url-decode y query-string-encode;
   - `html-entity-encoder-decoder` → html-encode y html-decode;
   - `json-yaml-converter` → json-to-yaml y yaml-to-json;
   - `markdown-html-converter` → markdown-to-html y html-to-markdown;
   - `morse-code-translator` → text-to-morse y morse-to-text.
2. **Minificadores** a partir de html, css y javascript-formatter, más json-minify (sale de json-formatter).
3. **json-model-generator** → json-to-typescript, json-to-csharp y json-to-java; luego Go, Zod y Python.
4. **Familia hash:** md5, sha1, sha512, sha3 y hmac-generator, sobre el mismo motor que sha256.
5. **Contadores:** character-counter, sentence-counter, paragraph-counter y words-to-minutes (tiempo de lectura y de discurso).
6. **Mayúsculas/minúsculas:** title-case-converter con estilos APA/Chicago/AP, uppercase, lowercase, camelcase y snake-case.
7. **binary-converter** → hex-to-binary, binary-to-decimal, decimal-to-hex y hex-to-text.
8. **sql-formatter** → mysql, postgresql y sql-server formatter (cuando haya dialectos).
9. **uuid-generator** → guid-generator, uuid-v7-generator y uuid-validator.
10. **Long-tail en español** (siempre que la página ES tenga contenido real): «legibilidad Fernández-Huerta», «contador de caracteres para Twitter/X» y «convertir CSV con punto y coma de Excel a JSON».
11. **Casi duplicados que conviene diferenciar y enlazar** (no borrar):
    - csv-viewer (principal) y csv-editor (`tools.`);
    - markdown-html-converter y markdown-editor;
    - word-counter y word-frequency-counter;
    - base64-encoder-decoder y binary-base64-tool;
    - jwt-decoder y jwt-encoder.

    Cada pareja necesita un bloque «¿Buscas…?» con enlace en las dos direcciones.

## Problemas por herramienta

| slug | problema | evidencia | arreglo | prio |
|---|---|---|---|---|
| text-diff-checker | Compara línea a línea por posición: si se inserta una línea arriba, todas salen distintas | «a b c d» frente a «x a b c d» → «5 different lines found» [V] | Diff Myers/LCS (jsdiff), detalle por palabra y carácter, vista lado a lado y unificada | P1 |
| regex-tester | ReDoS bloquea el hilo principal; los grupos (incluidos los nombrados) no se muestran; no hay sustitución ni resaltado; se añade `g` a la fuerza; el error sale duplicado | `(a+)+$` con 30 caracteres → 14 665 ms; flags `z` → «Invalid flags… 'zg'»; «Invalid regular expression: Invalid regular expression:» [V] | Ejecutar en un Worker con timeout de 1-2 s y `terminate()`; tabla de grupos e índices; modo replace; modo en vivo; explicación de tokens | P1 |
| json-schema-validator | Falsos «Valid»: ignora `uniqueItems`, `pattern`, `format` y `additionalProperties`; `$ref` no admitido | `[1,2,2]` con uniqueItems → «Valid»; `"a"` con `^[A-Z]` no da error; `$ref` → «$ref is not supported» [V] | Ajv local (draft-07 y 2020-12); mientras tanto, nunca responder «Valid» si el esquema usa palabras clave no soportadas | P1 |
| jsonpath-query-tool | No hay `..`, filtros `?()`, slices ni uniones | `$..t` → «Recursive descent (..) is not supported»; `[?(@.p<10)]`, `[-1:]` y `[0,2]` fallan [V] | Implementar RFC 9535 completo | P1 |
| cron-expression-builder | Solo 4 frecuencias; no interpreta una expresión pegada; no explica en lenguaje humano; no muestra próximas ejecuciones; no admite rangos, pasos ni listas; rechaza el weekday 7; acepta el día 31 sin aviso | Formulario hourly/daily/weekly/monthly; día 31 → `30 9 31 * *` sin aviso [V] | Campo de expresión editable, descripción en 37 idiomas (cronstrue), próximas 10 ejecuciones con zona horaria, @daily, opción Quartz/6 campos | P1 |
| json-formatter | Pierde precisión en enteros grandes sin avisar; descarta claves duplicadas sin avisar; el error de coma final no da línea ni columna; sin indentación configurable, árbol, descarga, archivo ni «reparar» | `12345678901234567890` → `…567000`; `"dup":1,"dup":2` → solo 2; coma final → mensaje V8 sin línea [V]; 6 MB tardaron 18 s en headless [V, entorno headless] | Tokenizador sin pérdida o aviso de enteros fuera de `Number.MAX_SAFE_INTEGER`; aviso de duplicados; calcular línea:columna; repair (comillas simples y comas finales); vista árbol; worker | P1 |
| text-case-converter | Title Case destroza acrónimos y marcas; pone mayúscula a artículos y preposiciones; fallo con el apóstrofo; solo 4 modos | «NASA»→«Nasa», «iPhone»→«Iphone», «Of/The/And», «Istanbul'Da» [V] | Estilos APA/AP/Chicago, respetar palabras ya en mayúsculas y camel; camel, snake, kebab, alternating e inverse; locale (turco) | P1 |
| jwt-decoder | No convierte `exp`/`iat` a fecha ni dice si el token ha caducado; no avisa de `alg:none`; falla con el prefijo «Bearer »; muestra el error crudo de `atob`; no verifica la firma | Token con exp 2018 decodificado sin aviso; «Failed to execute 'atob' on 'Window'…» [V] | Quitar «Bearer»; insignias de caducado y alg none; verificación HS/RS/ES con clave o JWKS en local; enlace al encoder | P1 |
| json-diff, graphql-formatter, text-to-binary-converter | «Free & Unlimited» en el título pese al tope | 200 000, 100 000 y 20 000 caracteres en el código y en la página [V] | Subir o quitar el tope (Worker, streaming) o quitar «Unlimited» | P1 |
| html/css/javascript-formatter | Tope de 200 000 caracteres; el botón dice «Calculate» | `t.length>2e5` en code-formatter-runtime [V] | Etiqueta «Format» o «Minify»; tope ≥5 MB en un Worker | P2 |
| base64-encoder-decoder | Rechaza base64url; un binario decodificado sale como `�` sin avisar | `PDw_Pz8-Pg` → «not valid Base64»; `/w==` → «�» [V] | Detectar url-safe; si los bytes no son UTF-8, mostrar hex y ofrecer descarga | P2 |
| url-encoder-decoder | Solo codifica como componente (también `:` y `/`); `+` no se decodifica como espacio | URL completa → `https%3A%2F%2F…`; `a+b` → «a+b» [V] | Modos «URL completa», «componente» y «formulario (+)» | P2 |
| csv-to-json | No detecta el `;` (Excel en España); descarta columnas sobrantes sin avisar; todo sale como texto | `name;age` → una sola columna; `2,3,4` pierde el 4 [V] | Autodetectar `, ; \t \|`; avisar de filas irregulares; inferencia de tipos opcional; quitar el BOM; descarga | P2 |
| json-to-csv | No aplana objetos anidados; rechaza un objeto suelto; no protege contra fórmulas al abrir en Excel | `{"a":1}` → error; `=SUM(A1)` pasa tal cual [V] | Aplanado con puntos, aceptar un objeto, opción anti-inyección, elección de separador, descarga | P2 |
| sql-formatter | Mayúsculas inconsistentes («left JOIN», «group BY»); WHERE mal indentado; espacio inicial antes de WITH; sin dialectos | Salida real de la prueba [V] | Librería sql-formatter con dialectos y modo minify | P2 |
| uuid-generator | Solo v4, máximo 100, sin opciones de formato ni validador | `max="100"`, «Choose a number from 1 to 100» [V] | v7, v1, ULID; 10 000 por lote; mayúsculas, llaves, sin guiones; descarga | P2 |
| sha256-hash-generator | Un solo algoritmo y solo texto | La interfaz solo tiene «Create SHA-256 hash» [V] | Selector MD5/SHA-1/256/384/512, HMAC, mayúsculas, comparar hashes | P2 |
| password-generator | La fuerza dice «Good» incluso con 8 minúsculas; máximo 64; solo deslizador; sin frase de contraseña ni entropía | `g>=20&&r.length>=3?"Strong":"Good"`; `min=8 max=64` [V] | Mostrar bits de entropía; 4-128 con campo numérico; passphrase (diceware) local | P2 |
| timestamp-converter | Microsegundos dan el año 56157 sin avisar; salto en el umbral 1e11; resultado viejo visible tras un error; sin zona elegible ni entrada ISO | `1710000000123456` → `+056157…`; `99999999999` → 5138 y `100000000000` → 1973 [V] | Detectar s/ms/µs/ns por número de dígitos; reloj «ahora»; selector de zona; limpiar la salida al dar error | P2 |
| text-to-slug | Con la opción por defecto, cirílico, árabe y CJK dan un slug vacío; «½» → «12» | «Привет мир» → vacío (preserve=false por defecto) [V] | Transliterar (ICU/tabla) o conservar por defecto; avisar si queda vacío | P2 |
| morse-code-translator | Sin Ñ ni acentos; no acepta `·` ni `−` pegados; sin audio | «The character “Ñ” is not supported»; `…. ——— ·−··` es rechazado [V] | Tabla extendida (Ñ `--.--`, É…), normalizar puntos y rayas Unicode, audio WebAudio con WPM | P2 |
| xml-formatter | El error no da línea ni columna; añade una declaración XML que no estaba | `<a><b></a>` → mensaje genérico; añade `encoding="UTF-8"` [V] | Extraer la línea de `parsererror`; conservar el prólogo original; minify y XML→JSON | P2 |
| json-yaml-converter | Error genérico sin línea; no admite varios documentos `---`; `no` y `on` sin comillas (riesgo para consumidores de YAML 1.1) | Prueba real [V] | Usar `mark.line`/`column` de js-yaml; loadAll; opción de entrecomillar ambiguos | P2 |
| readability-checker | Un único índice por idioma; sin grado escolar, Fog ni SMOG; sin resaltar frases difíciles | EN solo «Flesch Reading Ease», ES solo «Fernández-Huerta» [V] | Añadir FK Grade, Fog, SMOG, Coleman-Liau, ARI y Szigriszt; resaltados al estilo Hemingway | P2 |
| word-counter | El texto CJK cuenta como 1 palabra; los emoji se cuentan por punto de código; recalcula en cada tecla | 「日本語の文章です。中文测试」→ 1; «😀 👍🏽 🇪🇸» → 7 caracteres; 3,4 MB ≈ 0,9 s por tecla [V] | `Intl.Segmenter` (palabra y grafema), debounce o Worker, densidad de keywords, tiempo de discurso, límites de X y meta | P2 |
| text-summarizer y otros | Botones genéricos: «Calculate / create» y «Calculate» en json-schema-validator, jsonpath y playground | Interfaz [V] | Verbos propios: «Summarize», «Validate», «Run» | P2 |
| url-parser | Sin usuario, contraseña ni puerto por separado; exige el esquema | `user:pw@…:8080` → Host «ex.com:8080»; `example.com/…` → error [V] | Campos completos, añadir `https://` automáticamente, editar y recomponer | P3 |
| jwt-encoder | Solo HS256; la descripción ES dice «notificaciones JSON» (por *claims*) y trata de «usted», mientras el principal tutea | Meta ES [V] | RS/ES con clave local; «claims (declaraciones)»; tuteo uniforme | P2 |
| binary-base64-tool | Solo convierte de archivo a Base64 | Interfaz [V] | Modo inverso de Base64/Data URI a archivo con vista previa | P2 |
| Dev tools en `tools.` | `applicationCategory` «UtilitiesApplication»; migas «Home > JWT encoder» sin categoría ni BreadcrumbList; jwt-encoder carga `har-viewer.css`; rutas `recovered-live-only-106` | HTML y JSON-LD [V]; el origen de las rutas es una inferencia [NV] | DeveloperApplication + BreadcrumbList; confirmar que esos controladores tienen fuente en el repo | P2 |
| Bloque de herramientas relacionadas (principal) | Siempre las mismas 3 (base64, json, url), también en robots-txt-generator | HTML [V] | Relacionadas por tema y entre hosts | P2 |
| Páginas del principal | Unas 220-250 palabras, 2 FAQ; títulos con coletilla de 32 caracteres; modificadores que estrechan la intención («for Google Docs», «for Excel», «for Dates»); css-grid-generator titulado «CSS layout generator»; H1 «Text to Slug» con título «Slug Generator» | crawl.csv [V] | 600-900 palabras útiles (ejemplos, casos límite, atajos), 5-8 FAQ, keyword principal al inicio del título | P1 |
| local-spell-checker, phonetic-alphabet-converter, word-hyphenation-tool | Sin FAQ ni JSON-LD | crawl.csv (faq=0, jsonld vacío) [V] | Añadir WebApplication + FAQPage | P2 |
| Datos de categoría | En el lote hay herramientas que no son del área: norway-*, ratio-proportion, certificate-maker y sobriety-counter; además keyboard-tester aparece bajo «Developer» | CSV y cats.json [V] | Recategorizar en el hub | P3 |

## Seguridad y privacidad

- **Procesamiento local [V].** Busqué `fetch(`, `XMLHttpRequest`, `sendBeacon`, `WebSocket` y `EventSource` en `app.js`, `advanced-logic.mjs`, los 9 módulos diferidos del principal y 27 paquetes de `tools.`: no hay ninguna coincidencia. Tampoco hay analítica (gtag, Cloudflare Insights, Clarity) en el HTML de jwt-decoder, jwt-encoder ni password-generator. Lo que no he auditado son los motores `formatter-*-engine.js` ni los proveedores (`vendor/js-yaml.mjs`, pdf), que se cargan desde el mismo origen **[NV]**.
- **Criptografía [V]:**
  - JWT encoder: HS256 con `subtle.sign`, secreto de al menos 32 bytes y verificación de exp/nbf;
  - AES: AES-GCM con PBKDF2 de 600 000 iteraciones;
  - RSA: WebCrypto;
  - bcrypt: en un Worker;
  - UUID: `crypto.randomUUID`;
  - contraseña: `getRandomValues` sin sesgo de módulo.

  `Math.random` solo aparece en juegos, fichas y ruido, nunca en algo de seguridad.
- **Markdown [V]:** la vista previa se sanea (quita `onerror`, `<script>` y `javascript:`) y va en un iframe `sandbox=""` con CSP `default-src 'none'`. El playground HTML/CSS/JS usa `sandbox="allow-scripts"` sin `allow-same-origin`, que es lo correcto.
- **Pendiente:**
  1. **No hay cabecera CSP** en ninguno de los dos hosts [V]. Conviene una CSP con `connect-src 'self'` (o `'none'` en herramientas sensibles), que hace verificable la promesa de «nada sale del navegador». Mostrarlo en la página con un sello «0 peticiones de red», comprobable en DevTools.
  2. Si se añade compartir por URL, que use **solo `#fragment`**, nunca la query (los servidores no la reciben), y que esté desactivado en JWT, contraseñas, AES, bcrypt y hash con secreto.
  3. El decoder JWT debería avisar «no pegues tokens de producción en webs ajenas: aquí no salen del navegador». Es un argumento de venta frente a jwt.io.
  4. En json-to-csv, ofrecer protección contra inyección de fórmulas (`=`, `+`, `-`, `@`).

## Ideas para superar a la competencia

1. **«Privacidad demostrable»** como marca: CSP estricta, un contador de peticiones en vivo y un modo sin conexión (PWA o service worker) para las herramientas de desarrollo. CyberChef funciona offline; la mayoría de jsonformatter y codebeautify, no.
2. **Un editor común para todas las herramientas de código**: números de línea, resaltado, modo oscuro, abrir y arrastrar archivos, descarga, `Ctrl+Enter`, recordar la última entrada en `localStorage` (opcional y borrable) y Worker para cargas grandes. Es una sola pieza que mejora unas 30 páginas.
3. **Errores con línea:columna y un botón para ir al error** en JSON, XML, YAML, SQL y regex. Es la principal ventaja de jsonformatter.org y regex101.
4. **Multilingüe de verdad**, la ventaja que ningún líder tiene: cron explicado en 37 idiomas, Title Case con reglas por idioma, legibilidad con fórmulas nativas (Szigriszt-Pazos, Kandel-Moles, Amstad, Gulpease), Morse con Ñ y acentos, slugs transliterados por idioma.
5. **Cadenas de herramientas**: un botón «Enviar a…» que pasa la salida de una a la entrada de otra sin servidor (CSV → JSON → JSON Schema → TypeScript). Es la «receta» de CyberChef, pero guiada.
6. **Paridad mínima en las de más demanda**, en este orden: diff real, regex en Worker con replace, cron que interpreta, familia de hashes, JSON con repair y árbol, case converter con 10 modos, character counter.
7. **Contenido que gana long-tail**: en cada página, ejemplos reales copiables, una tabla de casos límite (base64url, BOM, `;` de Excel, microsegundos) y un FAQ propio. Es justo lo que falta en las páginas finas del principal.
