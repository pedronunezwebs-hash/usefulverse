# UsefulVerse vs iLovePDF · comparación de herramientas PDF

Comprobado el 20-oct-2026. Fuentes: catálogo público de ilovepdf.com (31 herramientas), los sitemaps de los dos sitios de
UsefulVerse y `docs/pdf-parity-roadmap.md` (auditoría del 1-oct-2026).

## 1. Resumen

- **Funciones: 29 de 31 cubiertas.** Faltan **Resumir PDF** y **Traducir PDF**, que en iLovePDF usan IA en servidor.
- **Problema principal de SEO:** 13 de las funciones de iLovePDF están **metidas dentro de páginas combinadas**. Por ejemplo,
  «Comprimir, unir y dividir» comparten una sola URL, y Word/Excel/PowerPoint ↔ PDF otra. iLovePDF tiene **una página por
  intención** (`/compress_pdf`, `/merge_pdf`…), y cada una rankea para su búsqueda. Una página combinada no puede ser la
  mejor respuesta a «comprimir pdf», «unir pdf» y «dividir pdf» a la vez. **Es la mayor oportunidad de tráfico de todo
  el catálogo PDF.**
- **Calidad:** varias funciones están por debajo de iLovePDF (conversiones Office solo de texto, OCR sin PDF con texto
  seleccionable, edición que convierte la página en imagen, comparación solo de texto) y algunas tienen **límites fijos**
  que chocan con la promesa «sin límites».
- **Ventajas de UsefulVerse:** gratis y sin límites de uso, todo en el dispositivo (los archivos no se suben), **37
  idiomas frente a 26**, y herramientas que iLovePDF no tiene: extraer imágenes, editor de metadatos, marcadores, aplanar
  formularios, cambiar el tamaño de página, comprobador de accesibilidad, CSV/EPUB a PDF, editor DOCX y compresor de
  archivos Office.

## 2. Tabla herramienta por herramienta

| iLovePDF | UsefulVerse hoy | Estado | Qué falta para igualar o superar |
|---|---|---|---|
| Merge PDF | `pdf-tools` (combinada) | ✓ función · ✗ URL propia | Página dedicada `merge-pdf` |
| Split PDF | `pdf-tools` + `pdf-page-editor` | ✓ · ✗ URL | Página dedicada `split-pdf` |
| Compress PDF | `pdf-tools` (combinada) | ✓ · ✗ URL | Página dedicada `compress-pdf` (máxima prioridad: es la búsqueda más grande) |
| PDF to Word | `pdf-document-converter` | ◐ solo texto | URL propia + mejor fidelidad (ver §3) |
| PDF to PowerPoint | dentro del conversor | ◐ diapositivas de imagen | URL propia + fidelidad |
| PDF to Excel | dentro del conversor | ◐ texto por líneas, sin tablas | URL propia + detección de tablas |
| Word to PDF | `pdf-document-converter` | ◐ vista de impresión | URL propia + fidelidad |
| PowerPoint to PDF | dentro del conversor | ◐ parcial | URL propia + fidelidad |
| Excel to PDF | dentro del conversor | ◐ parcial (límites de hojas y filas) | URL propia + quitar límites fijos |
| Edit PDF | editor visual (rasteriza) | ◐ | Añadir texto, imágenes y formas como objetos PDF nativos (pdf-lib), sin rasterizar; URL propia `edit-pdf` |
| PDF to JPG | `pdf-to-image` | ✓ | — |
| JPG to PDF | `image-to-pdf` | ✓ | — |
| Sign PDF | dentro de `pdf-form-filler` | ◐ firma visual | URL propia `sign-pdf` (firma dibujada, escrita o subida; honesta: no es firma certificada) |
| Watermark | dentro de `pdf-page-editor` | ✓ · ✗ URL | URL propia `watermark-pdf` |
| Rotate PDF | dentro de `pdf-page-editor` | ✓ · ✗ URL | URL propia `rotate-pdf` |
| HTML to PDF | `html-to-pdf` | ✓ | — |
| Unlock PDF | `pdf-protect-unlock` | ✓ · ✗ URL | URL propia `unlock-pdf` (siempre con la contraseña actual) |
| Protect PDF | `pdf-protect-unlock` | ✓ · ✗ URL | URL propia `protect-pdf` |
| Organize PDF | `pdf-page-editor` | ✓ | — |
| PDF to PDF/A | `pdf-to-pdfa` | ✓ (copia visual) | — |
| Repair PDF | `pdf-repair` | ✓ | — |
| Page numbers | dentro de `pdf-page-editor` | ✓ · ✗ URL | URL propia `add-page-numbers-to-pdf` |
| Scan to PDF | cámara en `image-to-pdf` | ◐ sin corrección de perspectiva | URL propia `scan-to-pdf` + recorte de bordes y perspectiva (OpenCV.js o canvas) |
| OCR PDF | `pdf-ocr` | ◐ solo exporta texto | Generar **PDF con texto seleccionable** (salida PDF de Tesseract) |
| Compare PDF | `pdf-compare` | ◐ solo texto | Añadir comparación visual (superposición de píxeles con PDF.js) |
| Redact PDF | `pdf-redact` | ✓ (límite fijo 50 MB / 100 págs) | Quitar el tope fijo: procesar página a página |
| Crop PDF | `pdf-crop` | ✓ (límite fijo 100 MB / 300 págs) | Quitar el tope fijo |
| PDF Forms | `pdf-form-filler` | ✓ rellenar | Opcional: crear campos de formulario |
| Summarize PDF | — | ✗ | IA en el navegador con modelo de licencia comercial (WebGPU/WASM, descarga perezosa). Viable con límites de dispositivo; no hay que prometer calidad de servidor |
| Translate PDF | — | ✗ | Igual: modelos Opus-MT/MADLAD en el navegador o la traducción del sistema; honesto sobre los límites |
| PDF to Markdown | `pdf-to-markdown` | ✓ | — |

Leyenda: ✓ igualado · ◐ por debajo de iLovePDF · ✗ falta.

## 3. Plan para igualar y superar (en orden de impacto)

1. **Páginas dedicadas por intención (prioridad máxima, nivel A).** Unas 16 páginas nuevas que **reutilizan el mismo motor**
   con el modo preseleccionado: `compress-pdf`, `merge-pdf`, `split-pdf`, `pdf-to-word`, `word-to-pdf`, `pdf-to-excel`,
   `excel-to-pdf`, `pdf-to-powerpoint`, `powerpoint-to-pdf`, `edit-pdf`, `sign-pdf`, `watermark-pdf`, `rotate-pdf`,
   `protect-pdf`, `unlock-pdf` y `add-page-numbers-to-pdf`.
   - Cada una con su título, H1, contenido, ejemplos y FAQ propios de esa tarea. No son copias: es lo mismo que hace iLovePDF.
   - Las páginas combinadas actuales se mantienen (no se borra nada) como «suite» que enlaza a las dedicadas.
   - Son unas 16 × 37 ≈ 590 URLs: entran **dentro del freno semanal** y van primero en la cola de activación.
2. **Quitar los límites fijos** en redactar, recortar, PDF a PowerPoint y Excel a PDF: procesar página a página, con
   aviso solo cuando la memoria del dispositivo no dé para más.
3. **OCR con PDF de texto seleccionable** y **escanear a PDF con corrección de perspectiva**.
4. **Editar PDF de verdad:** texto, imágenes, formas y resaltado como objetos PDF nativos, sin convertir la página en imagen.
5. **Comparación visual** de PDFs.
6. **Conversiones Office de más calidad:** detectar tablas en PDF a Excel y conservar el maquetado básico en PDF a Word.
   Investigar si LibreOffice compilado a WebAssembly es viable en el navegador (descarga pesada y perezosa, licencia
   MPL). Mientras no se demuestre, se mantiene el aviso honesto de «conversión de texto».
7. **Resumir y traducir PDF** con IA en el navegador, solo con modelos de licencia comercial y sin servidor. Es lo último,
   porque es lo más pesado.

## 4. Ventaja frente a iLovePDF (para el copy y las páginas de «alternativa gratuita»)

- Gratis de verdad: sin límite diario de tareas, sin límite de archivos ni de tamaño y sin cuenta.
- Privacidad: los archivos no se suben; se procesan en el dispositivo.
- 37 idiomas.
- Herramientas extra que iLovePDF no tiene (lista del §1).
Usarlo en la página «Alternativa gratis a iLovePDF» (STRATEGY-1M §3.3), con una comparación honesta: decir también
dónde iLovePDF es mejor (fidelidad de Office, IA en servidor).
