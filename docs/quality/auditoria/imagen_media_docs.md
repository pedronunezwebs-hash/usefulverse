# Auditoría · Imagen y diseño, Vídeo y audio, Documentos no PDF

Fecha: 20-oct-2026. Fuentes: los CSV de entrada, el HTML en inglés y los JS de producción descargados con curl (`usefulverse.com/assets/*.js` y `vendor/*.mjs`, además de los controladores de `tools.usefulverse.com/assets/`). He revisado en profundidad 31 herramientas y el resto en bloque. Las páginas `media-converter`, `media-transcriber`, `portrait-background-remover`, `subtitle-converter` y `spreadsheet-converter` venían en otro CSV, pero las incluyo porque son el núcleo de estas categorías. **[NV]** = no verificado.

## Resumen

- **Base técnica buena:** el vídeo se procesa con Mediabunny y WebCodecs, con escritura directa a disco mediante `showSaveFilePicker` y **sin límite fijo de tamaño**. El audio usa LAME, AAC y Opus en WASM. Hay OCR con Tesseract 7, transcripción local, MODNet y Open-Unmix en ONNX. Ningún competidor gratuito ofrece «sin subida y sin límites» con esta base.
- **La promesa «sin límites» se incumple en al menos 25 herramientas.** Hay topes fijos de 1 MP, 8 MP, 12 MP, 20 MP, 10 MB, 20 MB, 25 MB, 8 s, 30 s, 90 s, 3 min, 12 fotogramas o 20 imágenes. Varios títulos dicen «Free · no limits» y la propia página declara un límite, por ejemplo `audio-editor` y `audio-looper`.
- **Las 3 carencias que más tráfico cuestan:**
  1. El compresor de imágenes **no admite lotes** (no tiene `multiple`) y **no comprime PNG de verdad**.
  2. No existe un **quitafondos general**: solo hay uno de retratos.
  3. **No hay páginas dedicadas** para «png to jpg», «heic to jpg», «mp4 to mp3», «trim video» ni «video to gif». Todo está combinado en 1 o 2 herramientas.
- **UX:** ninguna herramienta acepta **arrastrar y soltar ni pegar** (0 apariciones de `dragover`, `drop` o `paste` en `app.js` y en los 16 módulos). En `tools.*` los inputs de archivo son nativos y no tienen clase (sin estilo).
- **SEO:** en `tools.*` hay 10 páginas sin FAQ ni JSON-LD (entre ellas `vocal-remover`, `voice-changer` y `resume-structure-checker`). En la raíz casi todas tienen solo 2 FAQ y 230–330 palabras, con títulos plantilla repetidos del tipo «X — Free · no limits | UsefulVerse».

## Límites encontrados

A = artificial (quitarlo o procesar por trozos). T = técnico del dispositivo (explicarlo como aviso, no como bloqueo).

| slug | límite | A/T | evidencia | arreglo |
|---|---|---|---|---|
| image-upscaler | 1 MP de entrada, solo ×2 | A | `S(e,o,l=1e6)`; «maximum 1 megapixel». Ya procesa por teselas solapadas | Quitar el tope (las teselas acotan la memoria); avisar del tiempo estimado; añadir ×4 |
| image-vectorizer | traza a 256 px como máximo, 16 colores, 5 MiB | A | `maxDimension:256,maxPixels:65536`; «does not smooth curves» | Usar VTracer en WASM (MIT): curvas y resolución completa |
| gif-maker | vídeo ≤8 s, **≤12 fotogramas**, ≤250 000 px por fotograma, 2–12 imágenes, 20 MB por archivo | A | `pt=12`; `a.duration>8`; `l*u>25e4`; `Ce=20*1024*1024` | Fotogramas según los FPS, duración libre (con un aviso de tamaño) y hasta 100 imágenes |
| image-resizer-compressor | 8 000 px por lado y 40 MP de salida | A/T | `p>8e3\|\|f>8e3\|\|p*f>4e7` | Subir al máximo del canvas del navegador (aprox. 16 384 px o 268 MP); avisar en lugar de bloquear |
| image-format-converter | 20 imágenes por lote, 20 MP cada una | A | «Add up to 20 images… 20 megapixels per image» | Cola secuencial sin tope; 20 MP solo como aviso |
| image-to-pdf | 20 imágenes, 20 MP | A | CSV y `expanded-tools.js` | Igual que el conversor |
| image-cropper | 10 MB, 12 MP; solo JPG, PNG y WebP | A | `k=10*1024*1024`; `i.width*i.height>12e6` | Quitar el tope de MB; reutilizar el decodificador de HEIC y TIFF de `K()` |
| image-splitter | 12 MP | A | `maxPixels:v=12e6` | Trocear con OffscreenCanvas por teselas |
| image-sharpener / photo-to-sketch | 8 MP | A | `C(n,e,i=8e6)`, `k(t,n,d=8e6)` | Procesar por teselas |
| image-color-picker / image-region-redactor | 12 MP / 24 MP | A/T | `i=12e6`, `d=24e6` | Usar una vista reducida para elegir y la resolución completa para exportar |
| image-histogram, color-palette-from-image, logo-maker | 20 MiB | A | `a.size>20*1024*1024` | Basta un muestreo: quitar el tope |
| color-vision-simulator, favicon-generator, qr-code-reader | 10 MB (favicon además 40 MP) | A | CSV y `expanded-tools.js` | Quitar el tope de MB |
| image-editor, watermark, meme, passport | 30 MB, 20 MP | A | `o.size>30*1024*1024`; «20-megapixel device-memory limit» | Avisar en lugar de bloquear |
| image-collage-maker / image-to-text / image-metadata-remover | 2–20 imágenes, 20 MB | A | `s.length>20`, `Ce` | Quitar el número fijo y los MB |
| portrait-background-remover | 20 MP | T | `P>2e7` | Reducir automáticamente para la máscara y aplicarla a resolución completa |
| vocal-remover | **30 s**, 30 MB | A | `decoded.duration > 30`; «up to 30 seconds» | Separar por bloques solapados de 10 s (lo habitual con Open-Unmix) |
| voice-changer | 25 MB, 30 s o 60 s | A | `file.size > 25*1024*1024`, `duration > 30`, `> 60` | Procesar por bloques |
| audio-to-midi-transcriber | 25 MB, 30 s | A | `buffer.duration > 30` | Procesar por ventanas |
| audio-editor | 25 MB, 3 min | A | «limited to 25 MB and 3 minutes»; `audio-analysis-runtime q=25MB,P=180` | Edición no destructiva y exportación por streaming (Mediabunny) |
| audio-looper | 25 MB, 90 s, salida de 120 s, WAV de 128 MiB | A | `h.duration>90`, «120 seconds or less» | Exportar a MP3 u Opus por streaming |
| bpm-detector | 50 MB, 3 min | A | `S=50*1024*1024,T=180` | Analizar los primeros y los últimos N segundos de cualquier archivo |
| epub-reader / epub-metadata-editor / epub-to-pdf | 25 MB, 70 MB descomprimido | A | `Te=25*1024*1024,Ue=70*1024*1024` | Lectura perezosa del ZIP; subir a 200 MB o más |
| docx-editor | 25 MiB, 500 segmentos, 250 000 caracteres | A | Texto de la página | Paginar los segmentos en vez de cortarlos |
| resume-structure-checker | 20 MB, 50 páginas | T (razonable) | `MAX_FILE_BYTES = 20*1024*1024` | Mantenerlo (un CV no tiene 50 páginas); explicarlo |
| office-file-compressor | 100 MB, 200 MB descomprimido, 5 000 partes | T (seguridad contra bombas ZIP) | `Be={inputBytes:100MB…}` | Mantener la proporción de compresión y subir la entrada |
| json-to-excel | 2 MB de JSON, 20 000 filas, 200 columnas | A | `G={inputBytes:2e6,rows:2e4…}` | Parseo por streaming; tope solo por memoria |
| spreadsheet-converter | 20 MB | A | `s.size>2e7` | Quitarlo |
| markdown-editor / html-to-pdf | 500 000 / 250 000 caracteres | A | CSV | Quitarlo |
| media-transcriber | descarga de 43 a 58 MB del modelo | T | Mensajes de la página | Explicarlo; unificar las cifras |
| video-compressor, media-converter, audio-compressor | **sin tope fijo** | — | «There is no fixed file-size cap» | Modelo a seguir |

## Huecos frente a los líderes

Viabilidad: ✅ 100 % navegador con la base ya cargada · 🟡 navegador con un modelo nuevo o WASM nuevo · ❌ no viable.

| keyword (EN) | situación actual | viabilidad | prioridad |
|---|---|---|---|
| compress jpg / compress png / compress image to 100kb | Combinado con el redimensionador; un solo archivo; el PNG sale «sin cambiar píxeles» (FAQ), es decir, sin compresión; no hay objetivo en KB | 🟡 jSquash: MozJPEG, OxiPNG y AVIF (Apache/BSD); cuantización PNG con UPNG.js (MIT); evitar libimagequant (GPL) | **P1** |
| bulk image compressor + ZIP | No existe (TinyPNG: 20 imágenes de 5 MB; iLoveIMG: lotes) | ✅ El ZIP ya existe en `image-splitter` | **P1** |
| remove background (general: productos, objetos) | Solo retratos (MODNet q8, 1 hilo) | 🟡 BiRefNet-lite o ISNet en ONNX con WebGPU; **revisar licencias de los pesos [NV]**; evitar RMBG-1.4/2.0 (no comerciales). remove.bg gratis ≈ 0,25 MP: ventaja clara | **P1** |
| png to jpg, jpg to png, webp to jpg, heic to jpg, avif to jpg, jpg to webp | Una única página titulada «PNG to WebP…» | ✅ El conversor ya decodifica HEIC, AVIF y TIFF | **P1** |
| mp4 to mp3 / extract audio from video | Escondido dentro de `media-converter` | ✅ | **P1** |
| trim video / cut video / mp3 cutter | El recorte con campos numéricos está en `media-converter`; no hay línea de tiempo visual | ✅ Mediabunny | **P1** |
| video to gif | `gif-maker` limitado a 8 s y 12 fotogramas, paleta fija | ✅ WebCodecs + gifenc (MIT) o gifski en WASM (AGPL: evitar) | **P1** |
| compress video for whatsapp / discord / email | Sin preajustes de tamaño objetivo | ✅ Calcular la tasa de bits = tamaño / duración | **P1** |
| screen recorder with audio | Graba sin audio: `getDisplayMedia({video:!0,audio:!1})` | ✅ Audio de pestaña o sistema + micrófono mezclado | **P1** |
| voice recorder mp3 / online voice recorder | Solo WebM u Opus (FAQ: «Will the recording always be MP3?») | ✅ El codificador LAME ya está en `media-converter.mjs` | **P1** |
| resize image for instagram / youtube thumbnail / passport photo | Sin preajustes; `passport-photo-maker` solo hace un recorte centrado de ancho × alto | ✅ Preajustes por red y por país (35×45, 2×2 in), guía facial, hoja de impresión 10×15 | P2 |
| webcam recorder / record video online | Solo existe un tester de webcam | ✅ MediaRecorder | P2 |
| audio converter (wav to mp3, m4a to mp3) / audio joiner / change audio speed / volume booster / ringtone maker | Parcial en el conversor; no hay unión, velocidad ni volumen | ✅ | P2 |
| merge videos / rotate video / crop video / mute video / video speed | No existen | ✅ Mediabunny + canvas | P2 |
| noise reduction audio | No existe | 🟡 RNNoise en WASM (BSD) | P2 |
| add text/subtitles to video (burn-in) | Solo existe el conversor SRT↔VTT | ✅ Canvas + WebCodecs | P3 |
| upscale image 4x | Solo ×2 | 🟡 | P3 |
| image to svg (vectorize) de calidad | Traza de píxeles a 256 px | 🟡 VTracer en WASM | P2 |
| rotate/flip image, circle crop, blur background, add text to photo | Parcial en `image-editor` (solo rotación) | ✅ | P3 |
| docx to pdf / pptx to pdf / xlsx viewer / docx viewer | Fuera del alcance de iLovePDF solo el visor: no existe | 🟡 Visualización con docx-preview (Apache) [NV] | P2 |
| csv to excel / excel to csv | `spreadsheet-converter` va solo de XLSX a CSV | ✅ El escritor XLSX ya está en `json-to-excel` | P2 |
| resume templates / cover letter generator | CV de texto plano, una plantilla, sin guardado | ✅ | P2 |
| markdown to docx | No existe | ✅ Ya se genera `word/document.xml` en `tool-suite-tools` | P3 |

## Páginas dedicadas y variantes

Regla: las variantes se diferencian y **nunca se borran**. Cada página dedicada reutiliza el mismo motor con un formato preseleccionado, y lleva H1, title, description, FAQ (4–6) y un ejemplo propios, además de un enlace canónico a sí misma.

- **Desde `image-format-converter`:** `png-to-jpg`, `jpg-to-png`, `webp-to-jpg`, `webp-to-png`, `heic-to-jpg`, `avif-to-jpg`, `jpg-to-webp`, `svg-to-png`, `tiff-to-jpg`, `gif-to-png`. Hoy el título solo apunta a PNG↔WebP.
- **Separar `image-resizer-compressor`** (mantener la página actual como resumen) en `image-compressor` con lotes y objetivo en KB, `compress-jpg`, `compress-png`, `image-resizer`, `resize-image-to-kb` (20/50/100 KB) y `resize-image-for-instagram`.
- **Desde `media-converter`:** `mp4-to-mp3`, `video-to-mp3`, `mov-to-mp4`, `webm-to-mp4`, `mkv-to-mp4`, `wav-to-mp3`, `m4a-to-mp3`, `trim-video`, `mp3-cutter`. El title actual, «Audio and Video Converter… · no limits», mide 65 caracteres y no ataca ninguna intención concreta.
- **Desde `video-compressor`:** `compress-video-for-whatsapp`, `compress-video-for-discord` (10 MB), `compress-video-for-email` (25 MB) y `compress-mp4`.
- **Desde `gif-maker`:** `video-to-gif` y `images-to-gif`, una vez quitados los topes.
- **`portrait-background-remover`:** añadir `remove-background` (general) como herramienta nueva y no como renombre; enlazarlas entre sí.
- **Casi duplicados que conviene diferenciar en el copy y en los enlaces cruzados:**
  - `audio-editor` (recorte y fundidos a WAV) frente a `media-converter` (recorte con conversión) frente a `audio-looper`.
  - `image-editor` frente a `image-cropper` frente a `passport-photo-maker` (hoy el último es un recorte genérico).
  - `image-color-picker` frente a `color-palette-from-image`.
  - `image-region-redactor` (title «Image pixelator») frente a una futura `blur-face`.
  - `resume-builder` (raíz) frente a `resume-structure-checker` (`tools.*`): cada uno debe enlazar al otro.
  - `epub-reader` y `epub-metadata-editor` (raíz) frente a `epub-to-pdf` (`tools.*`).
  - `microphone-level-meter` (`tools.*`) frente a `voice-recorder`.

## Problemas por herramienta

| slug | problema | evidencia | arreglo | P |
|---|---|---|---|---|
| (todas) | No se puede arrastrar ni pegar un archivo; en `tools.*` el input es nativo y sin estilo | 0 `dragover`/`paste` en `app.js` y en 16 módulos; inputs de `tools.*` sin `class` | Zona de soltar común + `paste` del portapapeles + estilo `file-picker` en los dos hosts | **P1** |
| image-resizer-compressor | Sin lotes; el PNG no se comprime (`canvas.toBlob`); sin AVIF; reducción en un solo paso, sin suavizado de calidad; la description promete «compare with your original» y solo se ve la salida | sin `multiple`; `T.drawImage(C,0,0,p,f)`; `#image-preview` muestra una sola `<img>` | Lotes + ZIP, codificadores jSquash, `imageSmoothingQuality='high'` o reducción por pasos, comparador con deslizador antes/después, ofrecer el original si la salida pesa más | **P1** |
| image-resizer-compressor | Si se borra el formulario, los campos vuelven a 1200×800 | `i.value="1200",c.value="800"` | Dejarlos vacíos o en 100 % hasta que haya imagen | P3 |
| gif-maker | Máximo 12 fotogramas: un GIF de 8 s queda a 1,5 fps; paleta fija RGB332 sin tramado: colores pobres | `pt=12`; `h.data[s]&224\|(h.data[s+1]&224)>>3\|h.data[s+2]>>6` | Cuantizador adaptativo con tramado (gifenc), FPS configurables, recorte de inicio y fin | **P1** |
| screen-recorder | Sin audio, sin webcam superpuesta, sin pausa (la del voz sí existe); en Chrome sale WebM | `audio:!1`; MIME `video/webm;codecs=vp9,opus` | Audio de sistema + micrófono, opción de pausa, conversión a MP4 con Mediabunny tras grabar | **P1** |
| voice-recorder | Sin MP3, sin forma de onda en vivo, sin recorte | Opciones MIME solo WebM, MP4 u OGG | Exportar a MP3 con LAME; enlazar al recorte | **P1** |
| portrait-background-remover | Solo retratos; ONNX con `numThreads=1` (lento); sin fondo de color ni borrado o restauración manual | `Tv("background-removal","Xenova/modnet",{dtype:"q8"})`, `numThreads=1` | WebGPU o varios hilos si hay `crossOriginIsolated`; selector de fondo; pincel de corrección | P1 |
| vocal-remover | 30 s; el modelo se baja de `huggingface.co/MixDirective/...` (un tercero y no el propio sitio); sin FAQ ni JSON-LD; licencia de los pesos UMX-HQ (entrenados con MUSDB18) | `mt_vocal-worker.mjs` | Servir el modelo desde `/assets/models-*` con hash; procesar por bloques; **confirmar la licencia comercial [NV]**; FAQ y schema | **P1** |
| media-converter | Recorte solo con números de segundos; sin WAV, FLAC ni GIF de salida; sin lotes; title genérico | `#suite-media-start/end` numéricos | Línea de tiempo con forma de onda o miniaturas; añadir WAV y FLAC (`@mediabunny/flac-encoder` ya está empaquetado) | P1 |
| video-compressor | Sin tamaño objetivo en MB; solo 3 calidades y 3 alturas; sin vista previa antes/después | `#video-quality` y `#video-height` | Modo «tamaño objetivo», 480p, FPS, quitar audio; reproductor comparativo | P1 |
| audio-compressor | Bien hecho (sin tope); faltan kbps manuales, mono y vista previa | Selects de 3 calidades | kbps y mono/estéreo; reproductor previo | P2 |
| media-transcriber | El copy no cuadra: dice «43 MB from Hugging Face» y «58 MB», y el modelo viene de un tercero | Texto de la página | Unificar la cifra; alojar el modelo en el propio sitio; exportar SRT y VTT si no se hace ya [NV] | P2 |
| image-upscaler | 1 MP pese a procesar por teselas; title «AI image upscaler, 2×» sin «4x»; solo 339 palabras | Ver la tabla de límites | Quitar el tope y añadir ×4 | P2 |
| image-vectorizer | Calidad muy inferior a la de vectorizer.ai o Vectorizer.io: escalones de píxel a 256 px | `maxDimension:256` | VTracer en WASM | P2 |
| passport-photo-maker | Recorte centrado sin preajustes por país, sin guía facial, sin fondo blanco, sin hoja 4×6 | `n==="id-photo"` → `drawImage` centrado | Preajustes por país + MODNet para el fondo blanco + hoja de impresión | P2 |
| image-collage-maker | Celdas fijas de 520×360: salida de baja resolución; sin plantillas | `u=520,m=360` | Plantillas y exportación a la resolución de origen | P2 |
| image-metadata-remover | No acepta HEIC, el formato con más EXIF y GPS (iPhone); recodifica en lugar de eliminar los bloques [NV] | `accept="image/jpeg,image/png,image/webp,image/bmp"` | Aceptar HEIC; para JPEG, quitar los segmentos APP1 sin recodificar (sin pérdida) | P2 |
| image-cropper | Solo 4 proporciones; sin HEIC; 10 MB | `#crop-ratio` | Proporciones 3:2, 9:16, 2:3 y círculo; decodificador común | P3 |
| image-editor | Solo brillo, contraste, saturación y rotación; input sin `accept` | `<input … type="file" data-op-field="file">` | Recorte, volteo, filtros y texto; `accept="image/*"` | P3 |
| audio-editor / audio-looper | Title «· no limits» con un límite declarado de 25 MB y 3 min o 90 s: **afirmación engañosa** | H1 y texto de la página | Quitar los límites o retirar «no limits» del title | **P1** |
| resume-builder | Textareas planos, una sola plantilla, sin guardado local ni foto; no enlaza al verificador ATS | `dr(e)`: secciones `<p class="pre">` | 3–5 plantillas, guardado en `localStorage`, importación desde el verificador | P2 |
| resume-structure-checker | Sin FAQ ni JSON-LD; vive en `tools.*` | crawl: faq 0, sin LD | FAQ y `SoftwareApplication`; enlace cruzado | P2 |
| docx-editor | Solo reemplaza texto de runs existentes: el title «Edit DOCX Online» promete más | Texto de la página | Title más honesto («Edit DOCX Text…») o visor docx-preview con edición | P2 |
| json-to-excel | 2 MB | `G.inputBytes:2e6` | Streaming | P3 |
| spreadsheet-converter | Solo XLSX→CSV; el title lo dice, pero falta el sentido CSV→XLSX | `accept=".xlsx,.csv"` | Bidireccional | P2 |
| office-file-compressor | No informa de qué recomprime (¿solo ZIP o también imágenes?) [NV] | — | Recomprimir las imágenes internas (WebP/JPEG) con un control de calidad | P2 |
| tools.* (vocal-remover, voice-changer, audio-to-midi, microphone-level-meter, resume-structure-checker, 3d-model-viewer, dxf-drawing-viewer, display-pixel-test, barcode-reader, scale-drawing-calculator) | Sin FAQ ni JSON-LD; categoría vacía en el breadcrumb | crawl `faq=0`, `NO-LD`; `cats.json` `['','','']` | Plantilla común con FAQPage, WebApplication y BreadcrumbList | **P1** |
| apex (≈60 páginas) | Solo 2 FAQ; 230–330 palabras; title plantilla «X — Free · no limits \| UsefulVerse» | crawl | 5–6 FAQ por intención; titles con la keyword principal y su variante | P1 |
| tools.* (image-histogram 137 palabras, color-palette-from-image 149, logo-maker 177, mockup-generator 156) | Contenido escaso y descriptions de 77–87 caracteres | crawl | Ampliar a 400 palabras o más con casos de uso | P2 |
| Categorización | En los CSV de imagen y audio entran resistor-color-code, dew-point, swiss-qr-bill, vector-calculator y switzerland-inheritance; el breadcrumb de `tools.*` es «Home» sin categoría | `cats.json` | Asignar el hub correcto (Ciencia, Finanzas) | P3 |

## Ideas para superar a la competencia

1. **Lema verificable: «Sin subida, sin cola, sin marca de agua, sin tope de archivos».** Kapwing y Clideo ponen marca de agua; FreeConvert ronda 1 GB por archivo; CloudConvert va por minutos al día; remove.bg da 0,25 MP gratis; TinyPNG, 20 imágenes de 5 MB (cifras de terceros, aprox.). Una tabla comparativa honesta en cada página dedicada sería un argumento de venta y además texto SEO.
2. **Motor común de cola por lotes:** un solo componente de soltar, pegar, carpeta y lista de archivos con progreso, cancelación y ZIP por streaming, para todas las herramientas de imagen y medios. Quita a la vez el hueco de los lotes y el de la UX.
3. **Comparador antes/después con deslizador y tamaño en vivo** (estilo Squoosh) en el compresor, el conversor, la nitidez, el reescalado y el quitafondos.
4. **Preajustes por destino:** WhatsApp, Discord, email, Instagram (1080×1350), YouTube (1280×720), pasaporte por país e imagen de 20/50/100 KB. Son intenciones de cola larga con mucho volumen.
5. **Vídeo y audio con encadenado:** grabar pantalla con audio → recortar → comprimir → MP4, todo sin salir de la pestaña y con el mismo objeto `File`. Ningún competidor gratuito lo hace en local.
6. **WebGPU cuando esté disponible** (quitafondos, reescalado, separación de voces, transcripción) y WASM con varios hilos (se necesita COOP/COEP para `crossOriginIsolated`; hoy `numThreads=1`).
7. **Alojar todos los modelos en el propio dominio**, con hash y licencia enlazada. Hoy el transcriptor y el separador de voces dependen de huggingface.co, lo que debilita el mensaje de que todo es local.
8. **Modo sin conexión (PWA)** para los conversores básicos: es un diferenciador real frente a todos los líderes.
9. **Textos de límites técnicos honestos:** sustituir «Choose X under 25 MB» por «Tu dispositivo podría ir lento con más de N MB; ¿continuar?». Esto cumple la promesa «sin límites» sin bloquear a nadie.

*Fuentes externas de los límites de la competencia:* [remove.bg: Is remove.bg free?](https://remove.bg/help/a/is-remove-bg-free-), [freetier.co · TinyPNG](https://freetier.co/directory/products/tinypng), [downbeach.com · CloudConvert vs FreeConvert](https://downbeach.com/news/2025/dec/08/cloudconvert-vs-freeconvert-which-one-is-better). Los límites de 123apps, Kapwing, Clideo y Zamzar no se han verificado hoy **[NV]**.
