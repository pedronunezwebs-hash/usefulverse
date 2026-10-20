# Auditoría · Herramientas variadas (grupo «otros»)

## Resumen
- Alcance: 48 herramientas que no son juegos (los 12 juegos del CSV se han excluido). He revisado a fondo 30: HTML y JS de producción descargados con curl (`app.js`, `opportunity-runtime.js`, `print-studio-runtime.js`, `measurement-tools-runtime.js`, `plan-tools.js`, `advanced-tools.js`, `media-tools.js` y los controladores de `tools.usefulverse.com`). La lógica la he probado en Node. No he podido usar un navegador real: la navegación al dominio estaba bloqueada.
- Diagnóstico: casi todo funciona y respeta la privacidad, pero muchas herramientas son **demos mínimas con nombre de intención grande**:
  - el «Guitar chord finder» tiene 9 acordes;
  - el «Unit converter», 4 categorías y 21 unidades;
  - el «Function grapher» solo admite polinomios de grado ≤ 4;
  - el «Screen ruler» mide de 0 a 500 px;
  - el «File checksum» solo calcula SHA-256 y corta en 25 MB.
- Frente a líderes como unitconverters.net, subtitletools.com, iban.com, ultimate-guitar u oolimo, perdemos por **cobertura**, no por calidad técnica.
- Errores de exactitud confirmados:
  - Recipe scaler: «1/2 cup» ×2 da «2/2 cup».
  - Unit converter: redondea 1 mm → 0,000001 mi; el valor real es 6,2e-7.
  - Subtitle converter: rechaza el VTT sin horas, que es válido.
  - GEDCOM del árbol genealógico: los nombres compuestos salen mal y el sexo se asigna por orden.
  - Speaker tester: los botones se llaman «Left button / Right button».
- SEO: la plantilla de `usefulverse.com` es débil.
  - Título genérico «X — Free · no limits», que contradice límites reales.
  - Descripción con frase duplicada y, a veces, cortada con «…».
  - Solo 2 preguntas en el FAQ, una de ellas idéntica en las 30 páginas.
  - H2 sin sentido («X made simple.», «More useful tools» repetido y H2 vacíos).
  - Entre 220 y 330 palabras.
- En `tools.` hay 5 páginas «market-tools» **sin ningún JSON-LD**, y 23 páginas del sitio comparten el texto genérico «Enter your values and get a result on this device».

## Huecos frente a los líderes
Las palabras clave van en inglés. Los volúmenes no los he verificado: no he usado APIs de pago.

1. **Unit converter (la intención más grande del grupo).** Unitconverters.net tiene más de 70 conversores agrupados en Common, Engineering, Heat, Fluids, Light, Electricity, etc., y páginas dedicadas por par («cm to inches», «kg to lbs», «mph to kph»…), comprobado. Nosotros solo cubrimos longitud, peso, volumen y temperatura. Faltan:
   - área, velocidad, tiempo, almacenamiento de datos (MB/GB/GiB), presión, energía, potencia, consumo (mpg ↔ L/100 km), ángulo y frecuencia;
   - unidades imperiales clave: stone, fl oz, onza troy y galón imperial frente al de EE. UU.;
   - entrada compuesta pies + pulgadas;
   - conversión en vivo (ahora hay que pulsar «Convert»), botón para invertir el sentido, tabla de equivalencias y URL compartible.
2. **Subtitle converter.** Subtitletools ofrece SUP/IDX → SRT, texto plano, PDF, desplazamiento parcial, limpieza SDH, paso a UTF-8, fusión, LRC y extracción de vídeo, comprobado. Nosotros solo SRT ↔ VTT con desplazamiento global. Faltan ASS/SSA, SBV (YouTube), TTML/DFXP, LRC, cambio de fps (23,976 ↔ 25), resincronización por dos puntos, limpieza de etiquetas y SDH, y codificación.
3. **IBAN.** Iban.com identifica el BIC y valida el dígito nacional del BBAN en 48 países, comprobado. Nosotros solo comprobamos longitud y MOD-97. Faltan:
   - dígito de control nacional (ES DC, FR RIB, IT CIN, BE…);
   - entidad y BIC desde una tabla local para los principales países;
   - salida formateada en grupos de 4, validación por lotes;
   - «IBAN calculator» (generar el IBAN desde un CCC).
4. **Guitarra y música.**
   - Chord finder: 9 acordes en texto, sin diagrama. Faltan todas las tónicas, calidades (7, maj7, m7, sus, dim, aug, add9…), varias posiciones, diagrama SVG, sonido, buscador inverso por notas («what chord is this»), capo y transposición.
   - Ear training: musictheory.net cubre intervalos, acordes, escalas y modo armónico (no lo he verificado en esta sesión). Nosotros, 8 de 13 intervalos melódicos.
   - Fretboard: solo trastes 0–12, afinación estándar y únicamente sostenidos.
5. **Tests de dispositivo.**
   - Speaker: un tono de 440 Hz durante 0,7 s, solo izquierda/derecha. Faltan barrido 20 Hz–20 kHz, test de graves, polaridad/fase, envolvente 5.1/7.1 y voz «left/right».
   - Mouse: falta test de doble clic, botones 4/5 con nombre (back/forward) y polling rate.
   - FPS test: a la sombra de testufo.com; falta la intención «refresh rate test».
6. **Checksum.** La intención real es verificar ISO e instaladores de varios GB, y nosotros cortamos en 25 MB. Faltan MD5, SHA-1, SHA-512, CRC32 y BLAKE3, varios archivos a la vez y pegar un `.sha256sum`.
7. **Transcriptor.** Solo Whisper Tiny y texto plano. Faltan **SRT/VTT con marcas de tiempo** (intenciones «video to srt», «auto subtitle generator»), modelos base/small, timestamps por frase y 16 idiomas de los 99 que admite Whisper.
8. **Mapas mentales y diagramas.** Mindmeister y Coggle: lo de su nube no aplica, pero su autoguardado sí (no verificado). Nuestro mapa mental no guarda nada: se pierde al cerrar la pestaña. Faltan PNG/PDF, importar y exportar Markdown/OPML y atajos Tab/Enter. El diagram-maker es lineal, de 2 a 12 pasos y 48 caracteres.
9. **Árbol genealógico.** Faltan parejas/cónyuges, campo de sexo, fechas parciales («ABT 1900», solo año), importar GEDCOM, guardado local, PNG/PDF; además corta en 200 personas.
10. **Pósters, etiquetas, invitaciones y tarjetas.** Una sola plantilla SVG, Arial, 4 colores y sin imágenes. Faltan:
   - plantillas Avery (5160, 5163, L7160), muy buscadas;
   - tamaños A3, tabloide y 18×24;
   - código QR y vCard en la tarjeta;
   - exportar PNG/PDF.
11. **Pantalla.** El screen-ruler no tiene calibración con tarjeta de crédito (85,6 mm), que es el estándar de los líderes. El transportador no tiene modo 360° ni permite medir sobre una foto subida.
12. **Otros.**
   - Shoe size: no convierte tallas US/UK/EU/cm (ver P1).
   - Acrostic: no genera versos.
   - Molecule viewer: galería 2D sin SMILES/MOL/PDB ni 3D.
   - Reading speed: texto de unas 60 palabras y sin cuestionario de comprensión ni media de referencia.

## Páginas dedicadas y variantes
**Conversor de unidades: arquitectura propuesta, sin páginas plantilla.**
1. **Motor único** con unas 20 categorías y más de 150 unidades:
   - conversión en vivo y en ambos sentidos, con precisión significativa (no `maximumFractionDigits:6`);
   - estado en la URL (`?from=cm&to=in&v=170`) con canonical a la página del par.
2. **Unos 15 hubs por categoría** («length converter», «weight converter», «temperature converter», «area», «speed», «data storage», «pressure», «energy», «cooking measurement»…), cada uno con su tabla y su explicación del sistema.
3. **De 30 a 50 páginas por par, solo donde haya un valor añadido propio** que la versión genérica no da:
   - «cm to inches» y «inches to cm»: tabla de 1 a 100 y regla imprimible;
   - «feet and inches to cm» / «height converter»: entrada compuesta y tabla de alturas;
   - «kg to lbs»: incluye stone;
   - «celsius to fahrenheit»: temperaturas de horno, cuerpo y clima;
   - «ml to oz» y «cups to grams»: densidad por ingrediente (harina, azúcar, mantequilla);
   - «mpg to L/100 km»: es inversa, no lineal;
   - «MB to GB»: decimal frente a binario;
   - «mph to km/h», «km to miles», «liters to gallons»: galón de EE. UU. frente al imperial.
4. **Regla:** si un par no aporta una tabla, un contexto o una entrada distinta, se queda en el hub sin página propia. Antes de crear una página, priorizar con datos gratuitos (Search Console, autocompletar).
5. **Localización:** los slugs y textos por idioma deben seguir la intención local («pulgadas a cm», «Zoll in cm»), no ser traducciones literales.

**Otras variantes con intención propia** (son modos del mismo motor):
- Subtitles: «srt to vtt», «vtt to srt», «ass to srt», «sbv to srt», «subtitle shifter / sync», «change subtitle frame rate».
- Checksum: «md5 checksum», «sha1 checksum», «sha512 checksum», «crc32 checksum», «verify iso checksum».
- IBAN: «iban calculator», «iban to bic», «iban checker by country» (ES, DE, FR, IT, GB…).
- Chords: «chord finder by notes», «ukulele chords», «piano chord finder», «transpose chords», «capo calculator».
- Speaker: «bass test», «frequency sweep», «left right audio test», «5.1 surround test».
- Mouse: «double click test», «mouse polling rate test».
- Media: «mp4 to mp3», «webm to mp4», «mov to mp4», «video to gif»; transcriptor: «video to srt».
- Labels: «avery 5160 template» (y 5163, L7160).
- vCard: «csv to vcf», «vcf to excel», «merge vcf».
- ICS: «csv to ics», «ics to excel».

**Casi duplicados** (se diferencian, nunca se borran):
- reading-speed-test (medición) frente a speed-reading-app (lector RSVP).
- diagram-maker, decision-tree-maker, mind-map-maker y org-chart-maker.
- poster, invitation, certificate y business-card: una misma plantilla SVG con distintos campos.
- vcard-converter frente a vcard-generator.
- mouse-tester frente a keyboard-tester.
- media-converter frente a audio-compressor y video-compressor.

En cada caso: H1/H2 de intención exclusiva, enlace cruzado «¿Querías X?» y una funcionalidad distintiva por página.

## Problemas por herramienta
| slug | problema | evidencia | arreglo | prioridad |
|---|---|---|---|---|
| unit-converter | Solo 4 categorías y 21 unidades; sin área, velocidad, datos…; botón «Convert» obligatorio | objeto `re` en `app.js` | Motor de ~20 categorías, conversión en vivo, invertir, tablas | P1 |
| unit-converter | Precisión: 1 mm → mi da «0.000001», 1 mg → lb da «0.000002» | `Intl.NumberFormat({maximumFractionDigits:6})`, probado en Node | Cifras significativas (`maximumSignificantDigits`) o notación científica | P1 |
| unit-converter | 220 palabras, FAQ de 2 preguntas | CSV | Fórmulas, tablas y FAQ por categoría | P2 |
| recipe-scaler | «1/2 cup» ×2 → «2/2 cup»; «1 1/2» → «2 1/2»; «2,5 dl» → «4,5»; «½» y «Salt to taste» bloquean el cálculo | regex `^\s*(\d+(?:\.\d+)?|\.\d+)` en `wt()`, probado | Analizar fracciones, mixtos, Unicode y coma decimal; dejar sin escalar las líneas sin cantidad; convertir unidades | P1 |
| subtitle-converter | El VTT con `mm:ss.ttt` (sin horas, válido y habitual) da error | `ft()` exige `\d{1,2}:\d{2}:\d{2}` | Horas opcionales | P1 |
| subtitle-converter | Pierde los ajustes de cue VTT; las etiquetas `<v>`/`<c>` pasan al SRT | regex de tiempos en `Kt()` | Conservar ajustes en VTT → VTT y limpiar etiquetas al pasar a SRT | P2 |
| file-checksum | Límite de 25 MB, solo SHA-256 | `n.size>25*1024*1024`, `digest("SHA-256", arrayBuffer)` | Hash por streaming (WASM incremental), MD5/SHA-1/SHA-512/CRC32, varios archivos | P1 |
| iban-validator | Sin dígito nacional, BIC/entidad, formateo ni lotes; botón «Calculate» | `bt()` en `opportunity-runtime` | Añadir esas funciones; botón «Validate» | P1 |
| guitar-chord-finder | 9 acordes, una digitación, salida en texto, sin diagrama | `dn()` | Generador de acordes por teoría (12 tónicas × calidades), diagramas SVG, audio, búsqueda inversa | P1 |
| shoe-size-converter | El slug promete un conversor de tallas, pero obliga a pegar una tabla; el título dice «Foot Length Converter» | texto de la página | Tabla genérica orientativa (pies en cm frente a tallas US/UK/EU por género y niños) con aviso; mantener el modo «tu tabla» | P1 |
| geographic-coordinate-converter | Slug genérico con contenido solo suizo (LV95/LV03); se pierde la intención mundial (DMS ↔ decimal, UTM, MGRS) | H1 «Swiss Coordinate Converter» | Hacer genérico el conversor con el modo suizo como sección, o crear una página aparte (no borrar) | P1 |
| media-transcriber | Sin SRT/VTT ni timestamps; solo Whisper Tiny; dice «43 MB» y «58 MB» en la misma página | `media-tools.js` y texto | Exportar SRT/VTT, elegir modelo, unificar la cifra | P1 |
| speaker-tester | Los botones se llaman «Left button / Right button» | HTML y `opportunity-runtime` | «Left channel / Right channel»; añadir centro, barrido y graves | P1 |
| speaker-tester | Un tono de 0,7 s a 440 Hz, no se puede repetir en bucle | `setTimeout(t,700)` | Ruido rosa en bucle, barrido, polaridad | P2 |
| mind-map-maker | Sin autoguardado, se pierde al cerrar; tope de 500 ideas y profundidad 40 | texto «not automatically saved», `mind-map-maker.js` | Autoguardado en localStorage/IndexedDB, PNG/PDF, Markdown/OPML, atajos | P1 |
| family-tree-maker | GEDCOM: «Mary Ann Smith» sale como `Mary /Ann /Smith/`; HUSB/WIFE por orden de id, sin SEX | `M()` y `C()` en el controlador | Apellido configurable, campo de sexo, FAM sin género forzado | P1 |
| family-tree-maker | Sin parejas, sin importar GEDCOM, sin guardado; tope de 200 personas; solo fechas completas | controlador, `maxPeople:200` | Relaciones de pareja, importación, IndexedDB, fechas parciales | P2 |
| printable-label-maker | Rejilla 3×10 a sangre, no coincide con ninguna hoja Avery real | `print-studio-runtime` (ancho/3 × alto/10, sin márgenes) | Plantillas Avery y Herma con márgenes reales, cantidad por etiqueta, importar CSV | P1 |
| poster-maker / invitation-maker / business-card-maker | Una plantilla, Arial, sin imágenes; el texto SVG no se ajusta y el mensaje de 180 caracteres se sale del lienzo; la tarjeta solo junta texto | `c()` sin ajuste de línea, `fn()` | Ajuste de línea, fuentes, foto/logo, QR, tamaños, PNG/PDF; tarjeta 85×55 / 3,5×2" en lámina 10 por hoja | P2 |
| screen-ruler | Solo 0–500 px con deslizadores; calibración manual en px/mm | `E()` y `x()` en `measurement-tools-runtime` | Regla a pantalla completa en cm/in, calibración con tarjeta, guardar la calibración | P1 |
| protractor | Solo 0–180° enteros; no se puede medir sobre una foto | `v()` y `A()` | Modo 360°, decimales, imagen subida | P2 |
| function-grapher | Polinomios de grado ≤ 4 introducidos como coeficientes | `an()` | Analizador de expresiones (sin, cos, exp, log, ^), varias funciones, zoom; enlazar los graficadores polar y paramétrico | P1 |
| ear-training | 8 intervalos (faltan unísono, 6m, 6M, 7m, 7M); sin armónicos, acordes ni escalas | array `A` | Completar los 13, modo armónico, calidades de acorde, estadísticas locales | P2 |
| fretboard-trainer | Solo trastes 0–12, afinación estándar, solo sostenidos | `N()` (`%13`) | 24 trastes, afinaciones alternativas, bemoles, bajo/ukelele | P3 |
| mouse-tester | Sin test de doble clic ni polling rate; categoría «Developer» | runtime y breadcrumb | Añadirlos; categoría «Device tests» | P2 |
| teleprompter-online | Sin pantalla completa, espejo vertical, cuenta atrás, línea guía, control por voz ni cámara; el guion no se guarda | `Fn()` | Fullscreen, espejo vertical, atajos ±velocidad, Web Speech, superposición de webcam + grabación (ya existe screen-recorder) | P2 |
| speed-reading-app | Texto plantilla «Enter your values…», botón «Calculate / create», FAQ «How accurate is this result?» | HTML | Copy propio, enlaces cruzados con reading-speed-test | P2 |
| reading-speed-test | Muestra de ~60 palabras; comprensión autoevaluada | HTML y runtime | Pasajes de 300–500 palabras con 3–5 preguntas y una referencia media (cita verificable) | P2 |
| acrostic-poem-maker | No genera el poema («you write the poem lines»); texto plantilla | HTML | Sugerencias de palabras y versos por letra con diccionario local | P2 |
| decision-tree-maker | Entrada por texto con «|»; texto plantilla | HTML | Editor visual y exportación SVG/PNG | P3 |
| molecule-viewer | Galería 2D pequeña; la intención espera 3D/SMILES | texto «not a 3D molecular model» | Visor 3D de MOL/PDB/SMILES (reaprovechar 3d-model-viewer) | P2 |
| kana-practice | Solo los 46 kana básicos | texto «About» | Dakuten, yōon, modo de escritura | P3 |
| song-key-finder | 25 MB / 3 min; perfil de clases de tono simple | texto «About» | Añadir BPM (ya existe bpm-detector) y Camelot | P3 |
| browser-frame-rate-test | Sin JSON-LD ni FAQPage; bloque «Limits» con texto genérico («Use realistic values…») | CSV (`jsonld` vacío) y HTML | Schema y texto real; intención «refresh rate test» | P2 |
| dicom-viewer, swiss-uid-validator, geographic-coordinate-converter, shoe-size-converter | Sin ningún JSON-LD, pese a tener FAQ visible | CSV `jsonld` vacío | WebApplication + FAQPage + Breadcrumb | P2 |
| vcard-converter | Solo VCF → CSV; sin quoted-printable ni otros charsets (no decodifica vCard 2.1 de Android/Outlook) | texto de la página | Decodificar QP y charset, CSV → VCF | P2 |
| ics-viewer | Solo lectura; 5 MiB, 2.000 eventos y rango máximo de 366 días | texto | CSV → ICS, imprimir agenda, quitar el tope de rango | P3 |
| rtf-converter | El título dice «RTF to PDF», pero extrae solo texto | descripción y texto | Título honesto o conservar el formato básico (negrita, listas) | P2 |
| aes-encryption-tool | Bien (AES-GCM, PBKDF2 600k); el contenedor `.uvenc` es propietario | JS | Documentar el formato, compatibilidad con OpenSSL | P3 |
| Plantilla de `usefulverse.com` (30 páginas) | Título «X — Free · no limits» genérico y engañoso con topes; descripción con «Free and unlimited use in your browser. Free to use with no usage cap.»; descripciones cortadas con «…» (ear-training, reading-speed-test); H2 «X made simple.» y «More useful tools» ×2; H2 vacío (kana, molecule); 2 preguntas de FAQ; enlace del breadcrumb a `/#tools` | HTML y CSV | Títulos con la palabra clave principal («Mouse Test – Click & Scroll Checker»); descripción única de 140–155 caracteres; H2 de contenido; 5–8 preguntas reales; breadcrumb a la página de categoría | P1 |
| 23 páginas de `tools.` | «Free, browser-based tool. Enter your values and get a result on this device» | grep en el HTML | Introducciones propias | P2 |

## Ideas para superar a la competencia
1. **Un motor de unidades como producto estrella:** entrada en lenguaje natural («5'11 in cm», «350 F en C»), tablas imprimibles, historial local, offline (PWA) y 37 idiomas con unidades locales. Ninguno de los líderes es 100 % local y sin anuncios (no verificado al 100 %).
2. **Hacer real el «sin límites»:** streaming (checksum, conversor de medios) e IndexedDB en lugar de topes como 25 MB, 200 personas o 500 px. Donde quede algún límite técnico, quitar «no limits» del título.
3. **Autoguardado local en todos los editores** (mapa mental, árbol, teleprompter, pósters, actas) con un aviso «guardado en este dispositivo». Es la ventaja de Coggle sin su cuenta.
4. **Suite de subtítulos completa y local:** convertir, resincronizar, cambiar fps, limpiar, unir y transcribir a SRT con Whisper. Hoy la de subtitletools.com se apoya en un servidor (no verificado).
5. **Música con teoría generativa:** acordes, escalas y posiciones calculados por código, no por tablas (miles de variantes sin páginas plantilla), con audio y diagramas SVG imprimibles.
6. **Laboratorio de tests de dispositivo:** un hub de ratón, teclado, altavoz, micro, webcam, píxeles y FPS con informe exportable (PDF/JSON) para soporte técnico.
7. **Imprimibles de verdad:** plantillas Avery, Herma y A3, código QR y vCard en la tarjeta, ajuste de texto automático y PDF vectorial directo.
8. **Exactitud demostrable:** tests unitarios con casos límite (fracciones, coma decimal, VTT sin horas, nombres compuestos en GEDCOM, unidades muy pequeñas) en la CI.

*No verificado: volúmenes de búsqueda, funciones de musictheory.net, Coggle y Mindmeister, si los líderes son 100 % locales, y el comportamiento en un navegador real (la navegación estaba bloqueada; todo se ha probado leyendo el JS y con Node).*
