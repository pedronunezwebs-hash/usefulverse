# UsefulVerse PDF parity: opciones gratuitas y locales

Investigación técnica: 2026-10-01. Objetivo: cubrir funciones útiles de PDF sin subir documentos ni añadir cargos de procesamiento a UsefulVerse. «Gratis para el proyecto» no significa rendimiento ilimitado en el dispositivo, compatibilidad universal ni garantía legal.

## Conclusión ejecutiva

Sí hay más caminos locales de los que se habían considerado. No todas las funciones son equivalentes: unas se pueden completar con motores abiertos en navegador, otras se pueden ofrecer como una variante con pérdida explícita, y otras dependen de identidad/certificados o de servicios externos. Ninguna debe anunciarse como perfecta sin pruebas de salida reales.

| Capacidad | Opción sin coste de procesamiento para UsefulVerse | Qué recibe el usuario / límite | Decisión |
|---|---|---|---|
| Redacción permanente | PDF.js renderiza cada página; máscaras opacas se componen en píxeles; pdf-lib crea un PDF nuevo solo con esas imágenes | El texto deja de ser seleccionable/buscable. Se pierden formularios, enlaces, capas, firmas, accesibilidad y metadatos. Requiere revisar visualmente todas las páginas | Implementar como herramienta distinta de “cubrir texto”; probar extracción de texto y el PDF exportado |
| Crear PDF/A | PDF.js rasteriza cada página; PDFKit (MIT) crea en el navegador un nuevo PDF/A-1b con metadatos XMP y perfil sRGB OutputIntent; veraPDF se usa en pruebas externas | Queda como copia visual: pierde texto seleccionable/buscable, formularios, enlaces, firmas existentes, metadatos de origen y estructura accesible. El navegador no valida cada descarga; no equivale a certificación ni garantiza conformidad para todo archivo | Implementado como copia visual PDF/A-1b local. Muestras sintéticas, incluidas páginas rasterizadas, y un resultado generado desde el flujo real del navegador pasaron veraPDF 1b. La matriz amplia y validación automática individual siguen pendientes |
| Conversión a PDF/A con Ghostscript | Ghostscript soporta algunos perfiles PDF/A y puede compilarse a WASM | Requiere OutputIntent ICC, configuración de metadatos y abortar ante incompatibilidad. Ghostscript se distribuye bajo AGPL; para ciertas formas de distribución/uso cerrado puede hacer falta cumplir AGPL o licencia comercial | No usar el binario AGPL en la app sin decisión de licencia y revisión de obligaciones. Preferir prototipo propio raster + validator independiente |
| Firmar con certificado del usuario | Una firma criptográfica local es técnicamente posible si la persona trae su certificado y clave privada; nunca generar una identidad confiable en UsefulVerse | La clave permanece en el dispositivo, pero custodia, formatos, cadena de confianza, revocación, sello de tiempo y compatibilidad deben probarse. Una firma dibujada es solo una marca visual | Investigar lector de certificado y PAdES como función optativa. No llamarla “certificada” ni “cualificada” sin validación y marco jurídico |
| Firma cualificada (QES/eIDAS) | No se obtiene gratis solo escribiendo código: hacen falta certificado cualificado y QSCD; los flujos remotos suelen depender de un QTSP | La disponibilidad y el coste dependen del país/proveedor. En UE la equivalencia jurídica especial corresponde a QES; no generalizar a otros países | No prometer QES ni identidad verificada; integrar un proveedor solo tras aprobar coste, términos y cobertura |
| HTML a PDF | Vista previa saneada y diálogo nativo de impresión del navegador → “Guardar como PDF” | Depende de la configuración de impresión del usuario; no garantiza reproducción exacta de cualquier URL. No se deben cargar páginas remotas arbitrarias | Implementar una versión local de texto/HTML pegado, explicando que el navegador crea el PDF |
| Editar PDF | Añadir texto, imágenes, formas, anotaciones y páginas nuevas, y aplanar una copia; mantener la fuente intacta | El texto preexistente no se puede editar como en un procesador sin reconstrucción/fuentes/layout. Aplanar elimina interactividad y firma previa | Ampliar el editor por capas aditivas con avisos; distinguirlo de la edición semántica del contenido original |
| Escanear con cámara | `getUserMedia` o selector de archivo con captura en móvil; PDF.js/pdf-lib para ensamblar | Permiso explícito, HTTPS y cámara compatible. Corrección de perspectiva automática implicaría visión por computador adicional y más descarga | Implementar captura básica y luego probar recorte/rotación local; ofrecer subida de fotos como alternativa |
| PDF ↔ Office | DOCX → vista HTML/impresión a PDF; PDF → extracción de texto/estructura y DOCX/XLSX simple | El flujo, fuentes, tablas, imágenes, fórmulas y paginación pueden cambiar. Compatibilidad de Office fiel no está garantizada por convertir ZIP/XML a mano | Cubrir casos simples, conservar las páginas actuales text-first y mostrar límites antes de descargar |
| Resumen/traducción con IA | Inferencia en WASM/WebGPU con un modelo descargado como recurso estático y almacenado en caché | Descarga inicial grande, memoria/CPU/GPU, idiomas/calidad desiguales, compatibilidad variable y licencia comercial del modelo | Solo elegir pesos con licencia válida para monetización comercial. No usar NLLB-200: su ficha declara CC-BY-NC-4.0 y uso no comercial |
| Transcripción | Motor/modelo local como el actual, cargado a demanda | Modelo inicial pesado, duración limitada por el hardware; nunca sustituirlo silenciosamente por reconocimiento remoto del navegador | Mantener el modo local y medir descarga/rendimiento por modelo e idioma |
| Drive/Dropbox | OAuth directo en el navegador puede evitar nuestro backend para ciertos accesos | El documento sí viaja al proveedor de nube; requiere consentimiento, permisos mínimos, configuración de OAuth, cuotas y cumplimiento de políticas. No equivale a procesamiento local | No conectar por defecto. Tratar como exportar/abrir en proveedor, independiente del procesamiento |

## PDF/A: protocolo de prueba antes de publicarlo

1. Mantener el original byte por byte sin modificar.
2. Renderizar la página completa, incluidas las anotaciones visibles, sobre un fondo opaco; descartar el árbol de objetos del documento de origen.
3. Crear un nuevo PDF con páginas raster, perfil sRGB embebido como OutputIntent y XMP con el perfil de conformidad escogido.
4. Ejecutar veraPDF contra el perfil anunciado (primera candidata: PDF/A-1b) en muestras de páginas de distinto tamaño/rotación, transparencia, anotaciones, formularios, imágenes, PDFs escaneados y fuentes incrustadas. Hasta ahora pasaron muestras sintéticas y un resultado de dos páginas creado con la herramienta en Chrome; esto no cubre toda la variedad de PDFs reales.
5. No exponer una etiqueta de conformidad si veraPDF falla o si una característica visible no quedó renderizada. Comparar el resultado en al menos dos lectores PDF.
6. Avisar antes de ejecutar que la copia no tendrá texto seleccionable, búsqueda, formularios, enlaces, firma digital, estructura accesible ni edición original; la calidad dependerá de DPI y del dispositivo.

veraPDF publica perfiles formales de validación PDF/A. Su CLI es Java, adecuado para QA/CI y no se carga en cada visita. La ruta usa PDFKit 0.20.2, con licencia MIT; el worker de navegador generado ocupa aproximadamente 532 KiB en este build y solo se descarga al abrir esta herramienta. La validación de unas pocas muestras no convierte cualquier PDF futuro del usuario en garantía universal.

## Coste y límites de Cloudflare

La arquitectura sin procesamiento servidor mantiene cada conversión en el navegador y no requiere Pages Functions, Workers, R2, base de datos ni una API de conversión. Cloudflare distingue el límite por archivo publicado del PDF local del visitante: el límite de 25 MiB es por asset desplegado, no el tamaño máximo intrínseco de un archivo procesado en cliente. La conversión no añade un cargo por documento; el worker PDF/A sí suma unos 532 KiB de recurso estático que el visitante descarga al usarla y puede consumir ancho de banda sujeto al plan y a las condiciones vigentes. No es preciso prometer que la web nunca tendrá límites/costes o que el único gasto posible será el dominio.

## Cobertura y traducciones

UsefulVerse dispone en esta rama de 16 idiomas. La captura de iLovePDF enumera 26 idiomas: faltan 12 (italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano y suajili), y bengalí/urdu son dos idiomas extra. La paridad lingüística completa representa 28 idiomas.

No basta traducir el selector. Cada idioma nuevo debe tener páginas, navegación, metadatos, herramienta y sus controles, ayuda/FAQ, dirección RTL donde corresponda, canonical, alternates recíprocos y sitemap. Mientras el generador trate todos los catálogos como una matriz completa, no se debe habilitar un idioma que muestre inglés de relleno. Antes de escalar los 28 idiomas, conviene separar el catálogo PDF de las demás categorías para publicar solo rutas PDF completamente localizadas sin fingir la traducción de las otras herramientas.

## Fuentes primarias

- Cloudflare Pages: <https://developers.cloudflare.com/pages/platform/limits/> y <https://developers.cloudflare.com/pages/functions/pricing/>.
- Ghostscript: <https://ghostscript.readthedocs.io/en/latest/VectorDevices.html> y licencia <https://ghostscript.com/faq/>.
- veraPDF validación/CLI: <https://docs.verapdf.org/validation/> y <https://docs.verapdf.org/cli/validation/>.
- PDFKit (generación PDF en navegador y licencia MIT): <https://github.com/foliojs/pdfkit>.
- ICC sRGB: <https://www.color.org/srgbprofiles.xalter>.
- Comisión Europea, firma electrónica y QES: <https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/880312429/eSignature+FAQ>.
- Web Speech API: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API>.
- Transformers.js: <https://github.com/huggingface/transformers.js>; modelo NLLB y licencia: <https://huggingface.co/facebook/nllb-200-distilled-600M>.
- Google Drive API, cuotas actuales: <https://developers.google.com/workspace/drive/api/guides/limits>.
- Impresión PDF del navegador: <https://developer.mozilla.org/en-US/docs/Web/API/Window/print>.
