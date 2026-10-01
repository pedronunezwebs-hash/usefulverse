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
| HTML a PDF | Herramienta local de texto/HTML pegado, vista previa saneada y diálogo nativo de impresión → “Guardar como PDF” | Depende de la configuración de impresión; no procesa cualquier URL ni garantiza la reproducción exacta de CSS o recursos externos | Implementado; conservar el aviso sobre contenido permitido y la impresión controlada por el navegador |
| Editar PDF | Herramienta local de cubrir un área y colocar texto o imagen sobre ella; conservar la fuente intacta | Es una sustitución visual, no edición de objetos PDF: la página editada se rasteriza, pierde texto seleccionable y puede ocultar demasiado o dejar restos si el área se marca mal | Implementado y publicado con aviso visible. No presentarlo como edición nativa; mantener la fuente y revisar la copia exportada |
| Escanear con cámara | Captura básica en navegador cuando hay cámara compatible, más selección de fotos | Requiere permiso, HTTPS y soporte del navegador. No corrige automáticamente perspectiva, sombras ni bordes | Implementado como captura básica; mantener la subida de fotos como alternativa y no prometer calidad de escáner dedicado |
| PDF ↔ Office | Seis rutas locales disponibles: PDF↔DOCX, PDF↔XLSX y PDF↔PPTX | PDF→XLSX estima filas por posición del texto seleccionable; PDF→PPTX genera diapositivas como imágenes. XLSX/PPTX→PDF reconstruye solo contenido compatible y abre la impresión del navegador. Fórmulas, diseño, fuentes, gráficos y paginación pueden cambiar | Implementado como conversión limitada, con límites y avisos visibles; no equivale a una conversión fiel de Office. Probar con archivos sintéticos, conservar el original y revisar cada resultado |
| Resumen/traducción con IA | Inferencia en WASM/WebGPU con un modelo descargado como recurso estático y almacenado en caché | Descarga inicial grande, memoria/CPU/GPU, idiomas/calidad desiguales, compatibilidad variable y licencia comercial del modelo | Solo elegir pesos con licencia válida para monetización comercial. No usar NLLB-200: su ficha declara CC-BY-NC-4.0 y uso no comercial |
| Transcripción | Motor/modelo local como el actual, cargado a demanda | Modelo inicial pesado, duración limitada por el hardware; nunca sustituirlo silenciosamente por reconocimiento remoto del navegador | Mantener el modo local y medir descarga/rendimiento por modelo e idioma |
| Drive/Dropbox | OAuth directo en el navegador puede evitar nuestro backend para ciertos accesos | El documento sí viaja al proveedor de nube; requiere consentimiento, permisos mínimos, configuración de OAuth, cuotas y cumplimiento de políticas. No equivale a procesamiento local | No conectar por defecto. Tratar como exportar/abrir en proveedor, independiente del procesamiento |

## PDF/A: QA y límites de la implementación publicada

1. Mantener el original byte por byte sin modificar; la herramienta exporta una copia.
2. Renderizar la página completa, incluidas las anotaciones visibles, sobre un fondo opaco; descartar el árbol de objetos del documento de origen.
3. Crear un nuevo PDF con páginas raster, perfil sRGB embebido como OutputIntent y XMP con el perfil de conformidad escogido.
4. Ejecutar veraPDF contra el perfil anunciado (PDF/A-1b) en pruebas representativas. Pasaron muestras sintéticas y un resultado de dos páginas creado con la herramienta en Chrome; esto no cubre toda la variedad de PDFs reales.
5. No exponer una etiqueta de conformidad si veraPDF falla o si una característica visible no quedó renderizada. Comparar el resultado en al menos dos lectores PDF.
6. Avisar antes de ejecutar que la copia no tendrá texto seleccionable, búsqueda, formularios, enlaces, firma digital, estructura accesible ni edición original; la calidad dependerá de DPI y del dispositivo.

veraPDF publica perfiles formales de validación PDF/A. Su CLI es Java, adecuado para QA/CI y no se carga en cada visita. La ruta usa PDFKit 0.20.2, con licencia MIT; el worker de navegador generado ocupa aproximadamente 532 KiB en este build y solo se descarga al abrir esta herramienta. La validación de unas pocas muestras no convierte cualquier PDF futuro del usuario en garantía universal.

## Coste y límites de Cloudflare

La arquitectura sin procesamiento servidor mantiene cada conversión en el navegador y no requiere Pages Functions, Workers, R2, base de datos ni una API de conversión. Cloudflare distingue el límite por archivo publicado del PDF local del visitante: el límite de 25 MiB es por asset desplegado, no el tamaño máximo intrínseco de un archivo procesado en cliente. La conversión no añade un cargo por documento; el worker PDF/A sí suma unos 532 KiB de recurso estático que el visitante descarga al usarla y puede consumir ancho de banda sujeto al plan y a las condiciones vigentes. No es preciso prometer que la web nunca tendrá límites/costes o que el único gasto posible será el dominio.

## Cobertura y traducciones

UsefulVerse tiene 16 idiomas en el catálogo general. La captura de iLovePDF enumera 26 idiomas: esos 26 están cubiertos por la suite PDF, además de bengalí y urdu como dos extras. Los 12 idiomas añadidos son italiano, chino tradicional, búlgaro, catalán, neerlandés, griego, malayo, polaco, sueco, tailandés, ucraniano y suajili; están limitados deliberadamente a las 15 herramientas PDF para no fingir que el resto del sitio está traducido.

Cada idioma PDF añadido tiene páginas, navegación, metadatos, controles, ayuda/FAQ, dirección RTL cuando corresponde, canonical, alternates recíprocos y entradas de sitemap. El build separa el catálogo PDF para que esos idiomas no publiquen rutas de otras herramientas con texto inglés de relleno. El sitemap de producción quedó verificado después del despliegue con 1.609 URLs.

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
