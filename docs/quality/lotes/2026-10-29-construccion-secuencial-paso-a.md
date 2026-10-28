# 29-oct · Construcción secuencial del Paso A

En curso, PR #136/feat/new-tools-batch-1. Sin publicar, cerrar Paso A o activar herramientas.

Preview nativa completa: 300 × 37 = **11.100 rutas**, 36 homes noindex, cero URLs en sitemap. Se inspecciona el JSON real de cada ruta. Las 300 nb son respaldo inglés declarado (`lang=en`, JSON-LD en inglés, `copyLanguage=en`, no aprobación), sin crear home nb; no se presentan como traducciones noruegas terminadas. Excepción solo en borradores explícitos/noindex; la publicación indexable y las copias existentes no reciben esa excepción. Traductor intacto. [Verificación](../sequential-v1/preview.json).

Chrome real: 126 geometrías (grammar-checker/fancy-text-generator × en/es/de/ar/ja/hi/nb × nueve anchos), metadata/márgenes/overflow correctos y 21 comprobaciones de tareas/recursos. Revisión visual de nb en 390/768/1440; no aprobación integral ni dispositivo físico. [Datos](../sequential-v1/browser.json).

Principal completo: `npm run check` correcto, 10.260 URLs; gate de 20 idiomas existentes correcto. Npm test completo: 3.241 correctos, ninguna omisión. Primer intento: 3.239/3.240 por documento ausente en sparse; recuperado y suite entera repetida. Hub en comprobación final tras reanudación: 106 herramientas/3.816 páginas recuperadas, sitemap exacto 15.365. El recuperador trataba espacios/Unicode del checkout como URL codificada: regresión previa y arreglo con fileURLToPath.

`packed-build.mjs` comprime cada fichero por separado y conserva un índice con tamaño/offset/SHA-256; mide tamaño exacto antes de escribir, verifica cada fichero y no modifica entradas. El lector permite componer directamente sin expandir los tres builds a la vez. Pruebas de corrupción, límites, rutas/symlinks, staging de metadatos y equivalencia byte a byte con composición ordinaria. Los paquetes son QA regenerable local y no se suben al repo.

Principal: 486.993.584 B → 136.166.612 B. Preview: 246.762.594 B → 78.338.135 B. Ambos verificados antes de retirar árboles crudos. El hub usa staging local con enlaces duros en assets/tool HTML inmutables y copias independientes para homes/sitemaps/llms; la ruta anterior sigue por defecto. El contador de huella cuenta inodos únicos, sin seguir enlaces simbólicos.

`install-local-build-deps.py` prepara un lock derivado acotado, sin modificar manifest/lock originales. Omite onnxruntime-node/sharp y conserva bytes/versiones de navegador fijados; verifica el tar de Transformers. El primer entorno omitió onnxruntime-common raíz: corregido, con regresión de grafo/versiones y tres Python correctos. Sin modelos de traducción/inferencia ejecutados ni hooks de instalación.

Pendiente: verificación final de hub, empaquetado, composición completa y todos sus bloqueos; main/publicación siguen sin las 300. No avanzar a fase 0/corte hasta cerrar Paso A. Ocho pruebas físicas existentes pendientes, cero FALLA; ninguna nueva.
