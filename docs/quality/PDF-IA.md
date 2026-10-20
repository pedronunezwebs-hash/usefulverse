# UsefulVerse · Resumir y traducir PDF con IA en el dispositivo (gratis y sin servidor)

Investigación del 20-oct-2026. Son las 2 funciones de iLovePDF que nos faltan (`PDF-VS-ILOVEPDF.md`). Conclusión:
**se pueden hacer gratis y sin límites con la potencia del ordenador o del móvil del usuario**, igual que el resto de
UsefulVerse, usando una **escalera de motores** que elige el mejor disponible en cada dispositivo.

## 1. La escalera de motores

| Nivel | Motor | Dónde funciona | Descarga para el usuario | Calidad |
|---|---|---|---|---|
| 1 | **IA integrada en Chrome** (Summarizer API, Translator API, Language Detector API; modelo Gemini Nano en el dispositivo) | Chrome de escritorio 138+ (estable). La documentación oficial dice que **Android e iOS aún no** son compatibles | Ninguna desde nuestra web: Chrome descarga el modelo una sola vez para todos los sitios | Buena; el contexto es limitado (~8K tokens, cifra de terceros), así que hay que trocear |
| 2 | **Transformers.js con WebGPU** (WASM si no hay GPU) | Chrome/Edge en escritorio y Android con GPU reciente; Safari 26 (iOS/macOS) con WebGPU | Una vez y queda en caché: traducción ~75-300 MB por par de idiomas; resumen ~0,5-1,2 GB (modelo pequeño cuantizado) | Traducción buena en pares grandes; resumen correcto con modelos pequeños |
| 3 | **Modo ligero sin IA** | Cualquier navegador y móvil | 0 MB | Resumen **extractivo** (elige las frases más importantes con TextRank, en JS puro). No traduce |

La página detecta qué hay disponible (`'Summarizer' in self`, `navigator.gpu`, `navigator.deviceMemory`) y lo explica antes
de empezar. Nunca hay servidor: el texto del PDF **no sale del dispositivo**.

## 2. Modelos permitidos (licencia comercial verificada en Hugging Face el 20-oct-2026)

| Uso | Modelo | Licencia |
|---|---|---|
| Traducción por pares | Helsinki-NLP **opus-mt-en-xx** / **opus-mt-xx-en** (p. ej. `opus-mt-en-es`) y `opus-mt-en-mul` como respaldo | Apache 2.0 |
| Resumen multilingüe (y traducción de respaldo) | **Qwen3-0.6B** / **Qwen3-1.7B**; Qwen2.5-1.5B-Instruct | Apache 2.0 |
| Alternativa ligera | SmolLM2-1.7B-Instruct | Apache 2.0 |
| Alternativa de más calidad (solo equipos potentes) | Phi-4-mini-instruct | MIT |
| **Prohibido** | NLLB-200 | CC-BY-NC (no comercial): incompatible con un sitio con anuncios |

Atribución de cada modelo en la página de licencias. Antes de publicar se fija la versión exacta de cada uno (hash de
la revisión).

## 3. Cómo funciona (sin límites artificiales)

1. **Extraer el texto** con PDF.js (ya está en el sitio). Si la página es una imagen, se ofrece primero el OCR local
   (`pdf-ocr`).
2. **Trocear** por páginas o párrafos para respetar el contexto del modelo.
3. **Resumir:** se resume cada trozo y después se resumen los resúmenes (*map-reduce*). Así funciona con PDFs de cualquier
   longitud; solo tarda más. Opciones: corto, medio, puntos clave, y el idioma de salida.
4. **Traducir:** frase a frase o párrafo a párrafo, conservando el orden de páginas, con progreso, pausa y cancelación.
   - Salidas: texto o Markdown, DOCX y **un PDF nuevo con el texto traducido** (maquetado simple).
   - Honestidad: la maqueta original (columnas, imágenes en su sitio) no se conserva tal cual. Más adelante se puede
     estudiar superponer el texto traducido en su posición.
5. **Caché:** el modelo se guarda en el navegador (Cache Storage u OPFS) y la segunda vez empieza al instante.
6. **Dónde se alojan los modelos:** primero desde la CDN gratuita de Hugging Face (solo se descarga el modelo, nunca datos
   del usuario). Si un día fallara, una copia en R2. Los archivos de modelo superan el límite de 25 MiB por archivo de
   Cloudflare Static Assets: si se alojan en el sitio, hay que trocearlos. Antes de usar R2, revisar el coste (el
   almacenamiento y la salida tienen tramo gratuito, pero hay que comprobar las operaciones a escala).

## 4. Aviso al usuario (lo que pidió Pedro, siempre visible antes de empezar)

> **Gratis y sin límites, en tu propio dispositivo.** Para que esto sea gratuito para todo el mundo, el resumen y la
> traducción se hacen con la potencia de tu ordenador o móvil: tu PDF nunca se sube a ningún servidor.
> - La primera vez se descarga un modelo de IA de **~X MB** (se guarda para la próxima).
> - **Recomendado:** ordenador con Chrome o Edge actualizados. En móviles puede ir lento o no estar disponible.
> - La IA puede equivocarse: revisa el resultado si es importante.

Además: estimación de tiempo según el tamaño del PDF, barra de progreso real, botón para cancelar, y un aviso si el
dispositivo no tiene memoria suficiente, ofreciendo el **modo ligero** en lugar de fallar.

## 5. Criterios de aceptación

- Funciona en Chrome de escritorio (nivel 1), en un portátil sin GPU dedicada (nivel 2 con WASM o modo ligero), en Android
  con WebGPU y en Safari 26. En cada caso, captura y tiempo medido.
- PDF de 1, 50 y 300 páginas: no falla por longitud (map-reduce), y la memoria se controla página a página.
- Sin peticiones de red con el contenido del PDF (comprobado en la pestaña de red).
- Traducción probada en 10 pares (en↔es, fr, de, pt, ja, ar, hi, id, ru, tr) con el piloto de calidad de la traducción
  del sitio (REVISION-FINAL §2).
- Páginas dedicadas: `summarize-pdf` y `translate-pdf` (más las variantes «translate pdf to spanish»… solo si hay
  demanda), con el aviso, una FAQ honesta y JSON-LD.
- Rendimiento: el JS y el modelo **solo** se cargan cuando el usuario pulsa «Resumir» o «Traducir»; la página carga igual
  de rápido que las demás.

## 6. Riesgos

- Dispositivos modestos: lentitud. Se mitiga con el modo ligero y el aviso.
- Cambios en las APIs de Chrome: se detectan por funciones (*feature detection*), con respaldo automático al nivel 2.
- Calidad de modelos pequeños: aviso honesto y revisión con el piloto antes de publicar.

Fuentes: Chrome for Developers (Summarizer API, Built-in AI APIs, novedades de I/O 2025); Transformers.js (WebGPU);
WebLLM (artículo); fichas de licencia de Hugging Face (consultadas por API el 20-oct-2026).
