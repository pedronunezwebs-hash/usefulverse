# UsefulVerse · plan de expansión SEO en Noruega y Suiza

**Fecha de corte: 15-oct-2026. Encargo: investigación y planificación exclusivamente.**

Se planifican **100 candidatas distintas: 50 con Noruega como mercado principal y 50 con Suiza**. Los mercados principales sirven para priorizar; una herramienta general se traduce y puede captar público de ambos países, pero se cuenta una sola vez. La implementación futura mantiene las **600 herramientas ya publicadas**. En este encargo hay **0 herramientas nuevas hechas localmente, 0 traducidas, 0 pendientes de deploy y 0 nuevas publicadas**.

La investigación DataForSEO cuesta **0,25092 USD**, frente al tope previo de 0,30 USD. Hay **93 candidatas con una consulta principal medida de al menos 100 búsquedas/mes** y **36 con al menos 1.000/mes** en su país. Las otras **7 tienen menos de 100/mes** y se mantienen como reserva, no como oportunidades de demanda alta. Los importes son el coste devuelto por la API, no una conversión monetaria ni una previsión fiscal.

## 1. Cómo usar este archivo y conservar el contexto

Este Markdown es el documento maestro de la nueva expansión. El `PLAN.md` anterior es histórico: sus casillas de 83, 194, 300 o 577 herramientas corresponden a distintos cortes y **no se usan para calcular el avance actual**. La nueva base congelada es el inventario de 600 del anexo. No volver a investigar o construir herramientas publicadas porque una casilla antigua esté vacía.

**Punto de reanudación:** antes de construir, completar F0 — fuente/publicación, arquitectura aditiva y datos/licencias del piloto. Después seguir el orden propuesto por lotes. No hay código nuevo de producto en este encargo y no se ha concedido aquí una orden de ejecución o deploy de este nuevo plan.

### Reglas de recuento

1. Una herramienta = un ID y una intención funcional, con sus modos y formatos relacionados en una sola URL por idioma. Una traducción, un cambio de moneda, un modo diario o un tamaño de tablero no es otra herramienta.
2. Base protegida = 600 IDs distintos. Cada candidata nueva tiene un ID permanente `NO001–NO050` o `CH001–CH050` y un slug único. Nunca renumerar el resto al descartar una.
3. La checklist maestra que sigue es la única fuente editable del estado por candidata. Las fichas explican el contrato, pero no crean un segundo estado. Un JSON de progreso podrá generarse de ella; no se mantiene manualmente un contador paralelo.
4. Una candidata descartada permanece con su ID, motivo y estado `DESCARTADA`; no desaparece para cuadrar cifras. Una sustitución recibe un ID nuevo y deja un vínculo al anterior. La cuenta pública solo sube tras evidencia de publicación completa.
5. Fórmula del total: **600 + candidatas nuevas publicadas y únicas**. `PLANIFICADA`, `EN_CURSO`, `LOCAL`, `ESPERANDO_DEPLOY` y `BLOQUEADA` no aumentan el catálogo público. En este checkpoint el total sigue siendo **600**, no 700.
6. Los 37 idiomas de una candidata cuentan como una herramienta. No restar o sumar las 600 anteriores al preguntar «cuántas nuevas llevamos».
7. Tras cada herramienta terminada y antes de parar: actualizar su fila, guardar el último commit y evidencia, recalcular contadores y respaldar el archivo. No esperar al final de una noche para registrar 20 herramientas de memoria.

### Estados permitidos y evidencia

| Estado | Significado y evidencia mínima |
| --- | --- |
| PLANIFICADA | Ficha e investigación disponibles; ningún código de esa candidata se considera hecho. |
| EN_CURSO | Se abrió la tarea; registrar ruta, rama, commit base y siguiente gate concreto. |
| LOCAL | Funciones y UI completas, con casos propios y salidas reales; anotar commit local. |
| TRADUCIENDO | Implementación local preparada; registrar `n/37`, fuente inglesa y checkpoint de traducción. |
| QA | Están las cadenas y rutas; se están comprobando funciones, exportaciones y contratos. |
| ESPERANDO_DEPLOY | Local + 37/37 idiomas + QA + presupuestos + respaldo de código aprobados; falta orden/publicación. |
| PUBLICADA | Despliegue terminado, URL pública comprobada y matriz localizada disponible; guardar deployment/commit. |
| SITEMAP_VERIFICADO | Las 37 URLs están en el sitemap público correcto; acciones de buscadores registradas por separado. |
| BLOQUEADA | Falta concreta, evidencia, alternativa sin coste y próximo paso; no equivale a herramienta hecha. |
| RESERVA / DESCARTADA | No entra en la tanda activa o se excluye con motivo; no suma a las publicadas. |

La casilla principal solo se marca `[x]` al cerrar implementación, traducción, QA, publicación y sitemap. Mientras, el campo Estado explica con precisión el avance. **Local sí / Publicada no** es un estado normal y no se interpreta como fracaso ni como publicación.

## 2. Qué hay publicado: auditoría nueva, no recuentos históricos

| Host | URLs únicas del sitemap | Herramientas distintas | Idiomas por herramienta |
| --- | ---: | ---: | ---: |
| usefulverse.com | 10.260 | 277 | 36 |
| tools.usefulverse.com | 11.664 | 323 | 36 |
| Total | **21.924** | **600** | **36** |

Fuentes leídas en vivo: [sitemap principal](https://usefulverse.com/sitemap.xml) y [sitemap Tools](https://tools.usefulverse.com/sitemap.xml). No hay IDs de herramientas repetidos entre los hosts ni URLs repetidas dentro de cada sitemap. Se descargaron las 600 páginas inglesas y se inspeccionaron título, H1, descripción, encabezados y controles para revisar funciones e intenciones; las 600 respondieron correctamente y su canonical coincide con su URL. Cada herramienta aparece en los 36 idiomas del inventario. Este turno no repite pruebas interactivas de las 600 ni las certifica de nuevo.

**Huella de los sitemaps descargados (SHA-256):**

- Root: `071394119f41aeda8ad28534a4b5ce4a72924951ecd28c119f4a7fb0d711dbeb`.
- Tools: `6f30d3418537f13547cd26f8457f66f7b3abf6c7dbe63851c20635fd019d59ac`.

El anexo incluye las 600 herramientas por nombre, slug y host. `inventory.json` conserva además las descripciones y controles observados para que el próximo modelo pueda contrastar funciones sin volver a recorrer 21.924 URLs.

### Fuente de código y conservación de la publicación

Repositorio conocido: `pedronunezwebs-hash/usefulverse`. La rama `codex/usefulverse-23-tools-20261015` se comprobó en el commit `4dab8f873c249c5c553cd01eb9189551945b07d0`. Su registro `docs/growth600/PROGRESS.md` recoge la publicación estática aditiva de las últimas 23 y el corte de 600 herramientas. **Su catálogo Growth600 contiene 217 IDs, mientras la publicación Tools contiene 323**: un build de esa rama por sí solo no representa todo el artefacto actualmente servido. Esto no resta herramientas públicas; explica por qué no se debe sustituir el sitio con una salida parcial.

F0 debe identificar las fuentes de release de los 323 IDs y el procedimiento de composición. Reutilizar las implementaciones y ramas existentes, sin rehacer herramientas publicadas. Si se conserva el procedimiento aditivo que ya funcionó, crear una base verificable del artefacto público con todos sus assets y hashes, añadir únicamente rutas/índices del nuevo lote y comprobar que ninguna URL/asset anterior desaparece. Guardar las nuevas fuentes y un manifiesto reproducible de la composición. Un preview de 37 páginas no autoriza sobrescribir el catálogo completo.

## 3. Qué muestran los datos reales de Search Console

Lectura del panel realizada el 15-oct-2026, propiedad de dominio `sc-domain:usefulverse.com`, búsqueda Web, periodo con datos **27-sep a 12-oct-2026**. El selector estaba en tres meses, pero el sitio solo aporta datos desde el 27 de septiembre. Se leyeron las 175 filas de países. Totales: **118 clics, 32.938 impresiones, CTR mostrado 0,4% y posición media 25,7**.

| País | Clics | Impresiones | Posición media mostrada |
| --- | ---: | ---: | ---: |
| Estados Unidos | 5 | 3.225 | 34,4 |
| Alemania | 1 | 2.885 | 31,0 |
| Tailandia | 19 | 1.688 | 10,0 |
| Japón | 7 | 1.531 | 19,9 |
| Francia | 0 | 1.137 | 52,4 |
| Taiwán | 3 | 710 | 11,8 |
| Irán | 22 | 572 | 10,5 |
| Canadá | 0 | 316 | 32,6 |
| **Suiza** | **0** | **219** | **32,4** |
| Australia | 0 | 147 | 43,4 |
| **Noruega** | **0** | **17** | **35,9** |

Interpretación: el mayor número de clics de algunos países se acompaña de posiciones bastante mejores. **EE. UU. y Alemania ya lideran las impresiones**; no hay evidencia de que Google impida captar mercados de mayor valor. Noruega/Suiza están en una fase de presencia muy pequeña, por lo que esta expansión busca nuevas entradas locales y no constituye una explicación causal de ingresos o de éxito futuro. La posición media mezcla muchas consultas/páginas; no es la posición de una palabra concreta. Dieciséis días de datos no prueban una tendencia estable de monetización.

Los CPM de YouTube aportados por el dueño se tratan como motivación para elegir mercados, no como un ranking comprobado aplicable a banners de UsefulVerse. CPC de DataForSEO, CPM publicitario y RPM por página son métricas diferentes. Para esta web interesa medir más adelante **ingreso por 1.000 páginas reales, por país y tipo de herramienta**, además de impresiones/clics orgánicos. Google explica cómo se calcula [RPM en AdSense](https://support.google.com/adsense/answer/190515). No se crean previsiones de ingresos a partir de un CPM de vídeo.

## 4. Idiomas: corregir la premisa antes de programar

Los 36 idiomas observados son: `en`, `es`, `fr`, `pt-br`, `de`, `ja`, `ko`, `id`, `hi`, `ar`, `zh-cn`, `bn`, `ru`, `ur`, `tr`, `vi`, `it`, `zh-tw`, `bg`, `ca`, `nl`, `el`, `ms`, `pl`, `sv`, `th`, `uk`, `sw`, `mr`, `te`, `ha`, `tl`, `ta`, `fa`, `am`, `gu`.

- **Noruega:** todavía no hay `nb`/noruego en ninguno de los sitemaps. `sv` es sueco y no se presenta como traducción noruega. Planificar **Norsk bokmål**, identificador interno y `lang` `nb`, formato numérico `nb-NO`, ruta `/nb/`. DataForSEO confirma el mercado `Norway`, código 2578, idioma `nb`.
- **Suiza:** ya están alemán, francés e italiano; priorizar DE/FR y añadir las mismas fichas en IT. Usar alemán escrito apropiado para Suiza, CHF, apóstrofo/espacios y separadores numéricos admitidos; no confundir idioma con residencia fiscal. DataForSEO confirma `Switzerland`, código 2756, idiomas `de`, `fr`, `it`.
- **Nueva tanda:** contrato de **37 versiones por candidata**, las 36 actuales + `nb`. Las 600 antiguas permanecen protegidas; traducirlas también a noruego sería otra tarea que se puede evaluar después, no 600 páginas que esta investigación afirme ya creadas.
- Registrar el nuevo idioma solo en el builder/matriz de esta expansión hasta que existan sus cadenas. Evitar que un registro global genere de golpe rutas noruegas de las 600 con fallback inglés. Selector por disponibilidad real de cada herramienta; `/nb/` del hub puede listar las nuevas fichas que sí tienen traducción.
- Una herramienta de normativa noruega sigue siendo de Noruega aunque se lea en alemán. La interfaz puede traducirse a los 37 idiomas; la jurisdicción no se cambia por idioma/IP. Los diccionarios, corpus de juegos, patrones de guionado y estándares soportados se describen por separado: 37 interfaces traducidas no demuestran 37 diccionarios técnicos disponibles.

## 5. Demanda y selección: cifras útiles sin inflarlas

DataForSEO se consultó únicamente para Noruega/Bokmål y Suiza/DE-FR-IT. Se guardan peticiones, respuestas y coste; no repetirlas al implementar. **Una métrica vacía significa falta de dato, no cero demanda. KD vacío se muestra «—»; KD 0 no significa competencia inexistente.** Los volúmenes son estimaciones mensuales de un proveedor, no personas únicas ni tráfico garantizado.

| Mercado principal | Candidatas | ≥1.000/mes en la consulta elegida | ≥100/mes | <100/mes |
| --- | ---: | ---: | ---: | ---: |
| Noruega | 50 | 25 | 48 | 2 |
| Suiza | 50 | 11 | 45 | 5 |
| Total | **100** | **36** | **93** | **7** |

Se conservaron 1.191 filas de resultados entre 9 consultas pagadas. Las dos expansiones iniciales devolvieron mucho ruido geográfico/navegacional, que se excluyó; las siguientes consultas se hicieron sobre listas concretas. No se rellenó una ficha de herramienta con el volumen de «wetter Zürich», «NAV» o una noticia. Tampoco se multiplican volúmenes por 37 traducciones ni se suman cifras de la misma palabra obtenidas en varios idiomas suizos como si fueran audiencias independientes.

**Bandas de demanda:** A ≥10.000; B 1.000–9.999; C 100–999; D <100. La banda se refiere a la query exacta mostrada. Las queries amplias, de marcas o con mezcla de compras/juego/información llevan revisión de intención: su volumen completo no pertenece necesariamente al widget. `ordle` (201.000/mes) se conserva como competidor/navegación, no como demanda propia del juego nuevo. `minigolf online` tiene 50/mes; no se reemplaza por las 18.100 de «minigolf» para inflarlo. `notenrechner punkte` tiene 720/mes; el promedio de notas se queda en las herramientas actuales.

**Prioridades:** P1 = empezar por un producto local viable sin tabla legal externa compleja; P2 = buena oportunidad condicionada a datos/normativa, motor, licencias o intención; P3 = reserva de demanda pequeña. P1 no es aprobación para desplegar sin QA. La mezcla recomendada comienza con utilidades claras y juegos completos y va preparando las fuentes de las calculadoras fiscales más buscadas.

## 6. Contrato de anticannibalización

Cada ficha contiene su diferencia frente a las herramientas cercanas del inventario. No basta que el slug sea nuevo: antes de programarla se acepta por escrito **qué introduce el usuario, qué obtiene y por qué no lo resuelve ya una de las 600**. La revisión semántica actual se basa en títulos, descripciones y controles públicos de las 600; no afirma que se haya auditado cada rama interna de cada motor.

- IVA (`tax-calculator`) queda separado de renta/patrimonio y de las leyes nacionales nuevas. Los títulos de leyes de Noruega/Suiza nombran su jurisdicción y la explicación delimita hechos imponibles.
- Hay un solo conversor de divisas, un corrector ortográfico, un quiz geográfico, un conversor geográfico y un visor 3D multiformato. No duplicarlos para la otra mitad de este plan.
- QR-factura suiza tiene formato bancario, validación y salida física propios; no se cuenta otra página por generar un QR de texto o por verificar su referencia.
- Feriepenger, vacaciones proporcionales y día laborable son intenciones diferentes: dinero devengado, derecho contractual en días y cómputo de calendario. Mostrar esa diferencia al enlazarlos.
- Código compartido no obliga a fusionar intenciones distintas; tampoco justifica separar dos sinónimos. Agrupar modos/formatos que resuelven la misma tarea. Ejemplos: perros/gatos en una ficha; binoxxo/binairo/takuzu en una ficha; código/colores en una ficha; provincias/cantones en el mismo quiz geográfico.
- Los juegos nuevos deben tener reglas y estados diferentes de los actuales. No crear otra URL de Sudoku, Backgammon, Mahjong, GPA, contador de palabras, préstamo o PDF↔Office ya cubiertos.
- Si la revisión concreta encuentra una función antigua que invalida una candidata, registrar el conflicto y usar reserva solo con autorización de alcance; no ocultar el cambio, no marcar dos veces la misma herramienta y no rellenar el hueco con una URL vacía.

No existe una prueba que garantice por adelantado cómo agrupará Google todas las consultas. Esta arquitectura reduce colisiones de intención y deja visible el motivo de cada separación.

## 7. Cómo crear cada página y mantener la carga rápida desde el inicio

Aplicar al futuro código la arquitectura que ya usa la web. No reconstruir un framework, no introducir una app SPA obligatoria y no reescribir los motores de las 600. Propuesta de namespace aditivo, adaptada a los nombres reales del repo:

```text
src/markets-no-ch/catalog.mjs
src/markets-no-ch/tools/<slug>/logic.mjs       # funciones puras, sin DOM/red
src/markets-no-ch/tools/<slug>/controller.mjs  # interacción, errores, cancelar
src/markets-no-ch/tools/<slug>/view.mjs        # HTML estático accesible
src/markets-no-ch/locales/<locale>/<slug>.mjs  # cadenas, no lógica traducida
src/markets-no-ch/data/<dataset>/<version>/   # fuente, vigencia, licencia, hash
src/markets-no-ch/seo/<slug>.mjs              # intención, ejemplos y enlaces
docs/markets-no-ch/PLAN.md                    # este archivo maestro
docs/markets-no-ch/evidence/                  # métricas, fuentes y QA
scripts/build-markets-no-ch.mjs              # solo expansión y composición segura
```

Estas rutas son diseño de la futura implementación, no archivos ya creados. Al comenzar, seguir las convenciones actuales y documentar cualquier cambio de nombre.

### Carga inicial y presupuesto verificable

1. HTML con H1, introducción útil, controles, ejemplo, instrucciones, límites específicos y enlaces normales desde el servidor estático. Los bots y el usuario leen la página sin esperar a un modelo.
2. CSS compartido existente y pequeño; fuentes del sistema. El JS inicial monta el controlador de la herramienta actual, no el catálogo entero, diccionarios o textos de 37 idiomas.
3. Fórmulas pequeñas: módulo diferido desde la página. Motores de audio/CAD/IA/DICOM/diccionarios: `import()` al seleccionar archivo, idioma técnico o iniciar; estado de carga, reintento acotado y cancelación real. No precargar todo «por si acaso».
4. Worker/AudioWorklet para trabajo largo; parcelas de trabajo y progreso por etapas reales. Liberar buffers, texturas, object URLs, tracks de cámara/micrófono, timers y workers. Pestaña oculta pausa los juegos/audio cuando proceda.
5. Propuesta de presupuesto para nuevas dependencias ordinarias: shell adicional ≤24 KiB minificada, UI/traducción de la ficha ≤24 KiB, módulo de fórmula ≤24 KiB. Las bibliotecas especializadas pueden superar esto si se justifican y difieren; el bundle común protegido no aumenta de forma indiscriminada. Medir tamaños reales del build y dependencias, no inventar un porcentaje de mejora.
6. Una página no importa motores de otras familias. Evitar copias de la misma librería en cada idioma. Los 37 HTML comparten assets por contenido/hash; no multiplicar el JS de lógica por idioma.
7. Assets versionados con hash y caché larga; HTML revalidable. Los cambios de versión deben invalidar el archivo anterior de forma correcta. Medir cabeceras mediante peticiones pequeñas de muestras, sin rastreo de rendimiento masivo.
8. Reservar el espacio de previews/canvas; renderizar el formulario antes del motor; controles utilizables por teclado, foco visible y texto de error junto al campo. No esconder contenido hasta terminar una animación.
9. No agregar beacons, analytics, anuncios o popups globales como parte de este plan. Enlaces de herramientas relacionadas tras una acción en un bloque discreto con dos/tres alternativas útiles; no retrasar descarga ni tapar el resultado. Importar el resultado a otra herramienta requiere elección y puede usar un Blob local, nunca una subida oculta.
10. **Sin PageSpeed ni Lighthouse por URL.** Gates de tamaño/grafo, comprobación de carga bajo demanda en navegador y pruebas funcionales. Solo medir rendimiento de forma puntual si aparece una regresión concreta que no se explique con esos controles; requiere una tarea específica, no una nueva campaña de miles de auditorías.

No se promete un 100 fijo en cualquier red/equipo. Una plantilla compartida bien optimizada mejora las páginas que la usan; la velocidad del procesamiento de un archivo depende además del motor, formato y dispositivo.

### Producto completo

Toda ficha debe tener: caso de ejemplo correcto, validación de entradas, estados vacío/cargando/listo/error, reset coherente, copiar/exportar cuando aporta valor, cancelación si tarda y explicación de la fórmula/regla. La salida no puede ser un placeholder. Las opciones visibles tienen efecto comprobable. Números de muestra no se presentan como valores actuales de un impuesto o una prima.

En parsers: aceptar los separadores de NO/CH de forma inequívoca, mostrar lo interpretado y rechazar entradas ambiguas. Números monetarios con precisión decimal apropiada, no errores binarios acumulados. Fechas civiles con su zona y año de normativa; no usar `new Date('texto local')` como parser universal. Los títulos/labels traducidos no cambian valores internos ni algoritmos.

## 8. Coste cero por operación y control del alojamiento

La herramienta corre en el dispositivo. No añadir Functions, Workers de cálculo, R2, bases de usuarios, cron de cálculo, APIs de conversión, LLM remoto, Containers, servidores de partidas ni una suscripción para que funcione. No abrir productos de pago «porque tienen free tier». Las tablas se preparan como estáticos versionados; el usuario puede introducir/importar valores si el contrato de la herramienta lo permite. Las APIs públicas sin cuenta se evalúan por sus términos/CORS y tienen fallback claro, sin proxy propio ni secreto en el navegador.

Las [peticiones a assets estáticos de Pages](https://developers.cloudflare.com/pages/functions/pricing/) no tienen cargo por petición según la documentación consultada. [Los límites de Pages](https://developers.cloudflare.com/pages/platform/limits/) siguen aplicando: 20.000 archivos en Free, 25 MiB por archivo y cuotas de publicación. Un archivo de motor >25 MiB requiere un diseño estático legal y probado que quepa; no activar R2/Workers de pago para saltarlo. **25 MiB es el límite del asset publicado, no un límite universal de los archivos que el visitante procesa localmente.**

Si se aprueban las 100 candidatas y todas pasan sus gates en 37 idiomas, el añadido sería **3.700 URLs de herramientas**, más una portada noruega nueva si procede: Tools pasaría teóricamente de 11.664 a 15.365 URLs y ambos hosts a 25.625. Esto es una cuenta de planificación, no un sitemap creado. Hay que contar además TODOS los assets/archivos de la salida, idiomas, datos y motores; 15.365 URLs HTML no prueban que el proyecto cabe en 20.000 archivos.

Antes de una futura publicación: presupuesto GitHub 0 USD con bloqueo, comprobar triggers y cuotas, evitar Actions/LFS; build/QA locales y agrupar varias herramientas en una sola publicación cuando se ordene. Direct Upload evita minutos de Actions, pero no se declara inmune a límites de Pages: verificar cuota aplicable, archivos y tipo de proyecto. Cloudflare mantiene el techo operativo del dueño de 10 USD/ciclo incluidos 5 USD fijos; esta expansión no autoriza sobrecoste, nuevos productos o consumo variable sin control. Este turno no hace deploy.

Aviso breve solo donde ayude a decidir: «El archivo se procesa en tu dispositivo. En archivos grandes recomendamos un ordenador; la duración y el tamaño que puede manejar dependen de la memoria y del navegador». No poner «ilimitado sin ningún problema» cuando haya límites técnicos. Para cálculos pequeños no hace falta introducir avisos de RAM innecesarios.

## 9. Traducciones rápidas: conservar lo que funcionó

Se leyó el método real del repo: `scripts/localization/translate-writing-tracker-growth-drafts.mjs` y el relay `scripts/localization/google-translate-relay.mjs` en la rama fuente comprobada. La versión directa agrupa cadenas desde el objeto inglés, usa marcadores por fila, traduce por lotes en Google Translate, reconstituye las claves y guarda módulos estáticos por idioma. No requiere DOCX ni un modelo grande. La implementación consultada usa lotes de diez cadenas y pausas cortas; el relay tiene límites por caracteres y checkpoint JSONL. Son herramientas de generación, no dependencias de cada visita.

**Procedimiento para Luna:**

1. Terminar y congelar la fuente inglesa de la ficha antes de traducir. Recoger recursivamente todas las cadenas: SEO, H1, instrucciones, labels, opciones, botones, estados, errores, resultados, FAQs y accesibilidad. No traducir objetos de lógica ni claves.
2. Dedupe por texto fuente + contexto + idioma y usar caché incremental. Traducir cambios desde el hash de la fuente, no regenerar 37 packs por corregir una palabra de un idioma. No volver a descargar modelos ni usar Azure/API de pago.
3. Reutilizar el traductor por lotes conocido: hasta diez cadenas por lote y un límite conservador de caracteres del texto total, siguiendo el límite real del servicio. Si un lote lo excede, dividirlo por cadenas; si una cadena es larga, dividirla en unidades semánticas antes. No enviar bloques gigantes ni archivos que luego se descarguen sin traducir.
4. Marcadores estables por fila y tokens protegidos para `{placeholders}`, porcentajes dinámicos, fórmulas, unidades, código, URLs, nombres de formatos e IDs. **Validar que cada marcador/token vuelva exactamente una vez**; si falta o cambia, retraducir solo esa fila. No «arreglar» una traducción mala añadiendo el placeholder al final o copiando inglés en silencio.
5. Fuente `en`, objetivo correcto; el adaptador existente de Google puede usar `no` para noruego, pero el pack/ruta/`lang` es `nb`. No usar `sv`. Para chino tradicional, usar el código del servicio que corresponda y conservar `zh-tw` del sitio. No confundir `pt-br`, `tl`, `ha`, etc. con códigos alternativos sin mapear.
6. Una cola con concurrencia pequeña, respetar 429/Retry-After y detener reintentos repetidos; guardado tras cada lote, claves terminadas y hash. Si el endpoint público usado por el script deja de estar disponible o no está permitido, usar la interfaz web gratuita en bloques; no evadir límites, no cambiar a una API facturable sin orden.
7. Guardar módulos de texto estático en el repo. No traducir durante la visita ni depender del traductor para abrir la herramienta. Cambiar de idioma no descarga modelos ni vuelve a generar el texto.
8. Revisión suficiente: idioma realmente distinto del inglés donde procede, términos funcionales correctos, variables intactas, botones/resultados/errores comprensibles, sin palabras absurdas. Correcciones puntuales, sin pulir estilo nativo. Mantener `machine-accepted`/aceptación del dueño y no afirmar revisión nativa.
9. Comprobar 37/37 archivos y rutas por ficha, `lang`, `dir` de árabe/urdu/persa, ausencia de overflow básico y longitudes de metadata. Probar separadores numéricos en `nb-NO`, `de-CH`, `fr-CH`, además de un RTL y un CJK cuando hay controles numéricos. Las fórmulas y resultados son invariantes.
10. Registrar la traducción terminada por ID/idioma. «37 URLs existen» no equivale a «37 traducciones comprobadas» y no permite marcar el gate de locales.

La calidad pedida es sencilla y comprensible. Las cadenas con contenido legal/conceptual deben conservar su significado, año, moneda y ámbito incluso con estilo imperfecto. No traducir como norma nueva las cifras de un ejemplo o los nombres de los programas oficiales.

## 10. SEO: una intención fuerte por página y longtails útiles

### Títulos y descripciones

Palabra/intención principal primero; después gratuidad y ausencia de cuota de uso cuando quepan. Marca al final solo si no desplaza lo importante. Ejemplos de redacción a generar y validar en cada idioma:

- NB: `Feriepengekalkulator – Gratis og ubegrenset`.
- DE/CH: `QR-Rechnung erstellen – Kostenlos & unbegrenzt`.
- FR/CH: `Correcteur orthographe – Gratuit, sans limite`.
- EN: `Norway Income Tax Calculator – Free & Unlimited`.
- ES: `Calculadora de feriepenger – Gratis y sin límites`.

Son plantillas de planificación, no títulos ya publicados ni longitudes verificadas para 37 idiomas. Límite editorial interno recomendado: aproximadamente **50–60 caracteres de título y 140–160 de descripción**; se comprueba por cadena, palabras completas y ancho probable. **Google no fija un tope universal de caracteres** y puede truncar/reformular el resultado según dispositivo; ver [títulos](https://developers.google.com/search/docs/appearance/title-link) y [descripciones](https://developers.google.com/search/docs/appearance/snippet).

No recortar un title automáticamente en mitad de la palabra clave para conservar UsefulVerse. Usar versiones corta/larga del eslogan por idioma. Descripción: acción/resultado y diferencial real, después «gratis, sin cuenta/sin cuota de uso» o «en tu dispositivo» cuando sea verdad. «Seguro» no es una certificación ni una promesa de riesgo cero; no forzar las tres palabras si empobrecen claridad. Límites de memoria/compatibilidad van en las páginas que los necesitan, cerca de la entrada, sin ocupar todos los títulos con avisos.

### Contenido y enlaces

Cada URL contiene instrucciones para su tarea, un ejemplo que ejecuta el formulario, explicación de la regla/algoritmo, resultados comprensibles, 2–4 FAQs que respondan dudas reales y enlaces a 2–4 herramientas complementarias de intención diferente. Para NO/CH: moneda, ejemplos y datos locales; no basta sustituir el nombre del país. Una guía nueva solo cuando resuelva una pregunta independiente con información propia; no crear 100 blogs duplicados ni páginas por cada longtail.

Las longtails de las fichas se incorporan a funciones reales, headings pertinentes, ejemplos y preguntas naturales. Una longtail sin cifra está identificada como hipótesis semántica; no se inventa su volumen. Evitar listas de keywords visibles sin explicación y repeticiones mecánicas.

Rutas propuestas en el hub actual; sin nuevos dominios o subdominios por país. Canonical autorreferente, variantes de idioma recíprocas mediante `hreflang`, `x-default` coherente y un selector accesible con nombres propios del idioma. Enlazar solo variantes que existan y tengan traducción. No redirigir automáticamente por IP/idioma; Google recomienda URLs accesibles para [sitios multilingües/multirregionales](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

Las herramientas fiscales llevan `Norway`/`Schweiz`/equivalente en el contenido de todos sus idiomas; la interfaz en francés no convierte la calculadora noruega en una calculadora fiscal francesa. Para datos estructurados, representar solo el producto y las propiedades reales; no inventar reseñas, estrellas, ofertas o soporte online multiusuario.

## 11. Normativa, fuentes y alcance de las calculadoras locales

Todas las cifras legales, tarifas y límites se integran con: URL primaria exacta, documento/versión, año y fecha de vigencia, país/cantón, licencia de redistribución, fecha de consulta y hash del dataset. Este plan identifica familias y fuentes; **no ha validado todas las tablas normativas necesarias para implementar cada calculadora**. Esa validación está dentro de los gates de datos de la candidata y condiciona que se pueda publicar.

No extraer a ciegas un resultado de un simulador oficial y afirmar que se conoce su algoritmo. Preferir tablas/normas públicas y ejemplos contrastables. Los datos cambian: si una tabla deja de estar vigente, mostrar el año soportado y bloquear la afirmación de «actual»; nunca remendar con un porcentaje genérico escondido.

Las calculadoras locales pueden ser estáticas y gratuitas en ejecución, pero tienen trabajo de mantenimiento. No existe una promesa responsable de impuesto actual en todos los años/cantones sin revisar las normas. Para las siete reservas de demanda baja y los motores difíciles, la condición de aprobación pesa más que llegar a una cifra estética.

Fuentes por familia: Skatteetaten y Arbeidstilsynet para impuestos/trabajo; NAV, Husbanken y Lånekassen para prestaciones; NVE para apoyo eléctrico; operadores/AutoPASS para peajes; ESTV, BSV, SECO/arbeit.swiss, BWO y Priminfo para Suiza; SIX para QR-factura; swisstopo para proyecciones; OMS/CDC para curvas; bibliotecas y diccionarios con licencia propia. El anexo de fuentes enlaza las páginas consultadas y las entradas que deben ampliarse al implementar.

## 12. Pruebas funcionales proporcionadas, sin miles de auditorías de carga

**Cada herramienta nueva se prueba de verdad al menos en una interfaz completa** con sus casos de la ficha. Motor común: tests puros de casos típicos, fronteras, vacío, datos inválidos y propiedades invariantes; referencias externas cuando el algoritmo lo necesite. Cambiar la lógica obliga a repetir sus casos, no los de todas las 600 sin motivo.

- Exportadores: generar un archivo, abrirlo con un lector independiente y comprobar contenido/medidas/codificación. Una descarga exitosa con extensión correcta no demuestra que el archivo esté bien.
- Juegos/puzzles: legalidad, score, victoria/derrota/empate, reinicio, semilla y variedad. Solución única cuando se anuncia; resolver con un verificador independiente. No llamar «CPU» a tiradas o movimientos ilegales aleatorios.
- Audio/cámara: probar permiso aceptado/denegado, pista cortada y recursos liberados; sonidos solo tras gesto del usuario. En un grabador/visor no confundir renderización con medición certificada.
- Persistencia opcional: recarga, export/import, borrar, almacenamiento lleno/bloqueado; sin cuenta ni telemetría de datos introducidos.
- Fiscal/prestaciones: casos de referencia oficiales por régimen, año y cantón realmente anunciado; datos no cubiertos dan respuesta clara, no un importe inventado.
- Revisión estática de **todas las 37 rutas** de cada nueva herramienta: HTML no vacío, metadatos, lang/dir, labels/IDs, placeholders, canonical/hreflang, assets, links y sitemap. Es rápida y diferente a hacer PageSpeed.
- Navegador: funciones de las 100 en inglés o idioma prioritario, y parser/monedas en NB/DE-CH/FR-CH donde afecten; muestreo RTL/CJK por componentes y revisión de cada UI distinta. Móvil/tablet/escritorio en familias/componentes nuevos, sin concluir que una captura representa todo.
- Red: una carga inicial y una interacción por motor pesado prueban que se descarga al activar; ausencia de subidas de datos/secretos y operation offline con assets ya disponibles. Cancelar detiene trabajo, no solo la animación.

No se marca QA por el HTTP 200, ni por un test que reproduce exactamente la misma fórmula equivocada de la implementación. Los fixtures numéricos sintéticos de las fichas comprueban aritmética; los fixtures normativos oficiales comprueban la interpretación legal y son un gate adicional.

## 13. Orden de ejecución futura, hitos y pausa limpia

- [ ] **F0 · Base y contrato:** leer este archivo/instrucciones actuales; confirmar repo/rama/estado; proteger 600 IDs; recuperar fuente/manifiesto de release de ambos hosts; revisar intención/alcance del piloto y disponibilidad de datos/licencias. No repetir DataForSEO.
- [ ] **F1 · Infraestructura aditiva:** namespace, registro de 37 locales solo para nuevas fichas, parser numérico/fechas, build separado y conteo de archivos/depencias; sin tocar funciones antiguas. Preparar la actualización automática de contadores de esta checklist.
- [ ] **F2 · Piloto de cinco productos:** NO034 papel; NO022 punto; CH021 escala de notas; CH027 puzzle binario; NO004 feriepenger tras su gate normativo. Completar local/traducciones/QA por ficha antes de escalar una mala estructura. No es una orden de publicarlos hoy.
- [ ] **F3 · Utilidades de alta prioridad:** NO001 divisas (fuente fechada), NO024 fonético, NO026 anillos, NO029 mascotas; CH017 QR-factura (estándar vigente), CH022 guionado, CH037 ortografía (diccionarios), y otros P1 con contrato aprobado.
- [ ] **F4 · Captación local:** preparar primero NO002 renta, NO003 patrimonio, NO019 peajes, NO021 electricidad, CH001 nómina, CH002 impuesto anual, CH003 AHV y CH010 alquiler. Los de datos complejos avanzan cuando sus fuentes estén listas, sin bloquear todos los juegos/utilidades que ya pueden terminarse.
- [ ] **F5 · Juegos completos:** NO036/NO037/NO038, CH026/CH028 y después resto de juegos por demanda/intención/esfuerzo; corpus original, CPU legal y generación diaria distinta. No añadir multijugador de servidor.
- [ ] **F6 · Motores especializados:** NO032/NO033, CH041/CH042/CH043/CH045/CH046/CH050; smoke de capacidad en navegador, licencias y formatos antes de integrar; guía breve de PC en los que lo necesitan. Si no pasan, estado BLOQUEADA con motivo.
- [ ] **F7 · Cierre por candidata:** todas las funciones/exportaciones, 37/37 idiomas, SEO, QA y presupuestos. Llevar a ESPERANDO_DEPLOY; mantener lista exacta de qué está local y qué público.
- [ ] **F8 · Publicación autorizada por lotes:** revisar triggers/cuotas, diff, origen completo y manifiesto; backup fuente, deploy seguro y evidencia pública. Confirmar preservación de las 21.924 URLs previas y assets. No publicar una salida parcial de 217 fichas sobre el catálogo de 323.
- [ ] **F9 · Sitemaps y buscadores:** sitemap del host con solo rutas 200/canónicas; lastmod solo para cambios reales; Google/Bing y paneles existentes según acceso. Guardar acción/estado/fecha y lo bloqueado; enviado, leído e indexado son estados distintos. No borrar un sitemap registrado por capricho para aparentar actualización.
- [ ] **F10 · Cierre:** README/catálogo completo, este plan y evidencia respaldados; verificar SHA/deploy/contadores. Limpiar solo clones, descargas, modelos, QA y cachés propios que ya se puedan recuperar. El MD pedido por el dueño se conserva.

**Reservas de demanda (<100/mes): NO005, NO020, CH007, CH014, CH034, CH039 y CH040.** Mantenerlas identificadas; no son siete herramientas invisibles «que faltaban» ni tienen prioridad automática. Una futura orden de implementar las 100 puede incluirlas con sus contratos; mientras este encargo solo fija el plan.

### Protocolo al cambiar de modelo, cerrar el portátil o parar

1. Leer primero el encabezado de checkpoint y la checklist maestra, no los recuentos antiguos de la conversación. Verificar el último SHA y estado público guardados.
2. Mostrar al dueño cuatro números separados: nuevas completas locales, nuevas esperando deploy, nuevas publicadas y candidatas sin terminar. Base pública 600 por separado. Una herramienta EN_CURSO cuenta como en curso, no como acabada.
3. Antes de parar, escribir `ID actual`, `último gate correcto`, `comando/URL de evidencia`, `bloqueo si existe`, `archivo exacto pendiente` y `siguiente acción`. Si no hay código aún, decirlo.
4. Guardar traducción por idioma/lote/hash para continuar exactamente donde quedó. No repetir lotes completados ni descargas grandes.
5. Respaldar el plan y las fuentes de trabajo sin disparar workflows facturables. Si no se pueden respaldar, conservar la copia única y explicar el bloqueo antes de limpiar.
6. Al reanudar, reconciliar la checklist con los sitemaps solo para comprobar publicación. Las URLs no demuestran por sí solas que se hayan cerrado todas las funciones o traducciones.

## 14. Convención de las fichas que siguen

La consulta principal tiene volumen/KD de su mercado e idioma exactos. Cada ficha incluye longtails medidas cuando existen en esta investigación y marca el resto como hipótesis sin volumen. La prioridad combina demanda, esfuerzo y gates; no es una promesa de ranking. Sus funciones y pruebas son **contrato de producto futuro**, no funciones construidas en este encargo.

La fuente de verdad del estado por ID es la checklist maestra, que empieza completamente sin implementar. Las fuentes/librerías sugeridas son una base para evaluar licencia, tamaño y compatibilidad; no se anuncian como dependencias ya instaladas o capacidades probadas de un nuevo motor.


## 15. Checklist maestra · 100 candidatas nuevas

**Estado de implementación al entregar este plan:** 100 planificadas, 0 en curso/locales, 0 con 37/37 traducciones, 0 esperando deploy, 0 publicadas. Siete tienen prioridad P3 de reserva; conservan su ID y siguen visibles dentro de las 100 propuestas. Para activarlas se debe considerar esa menor demanda, no ocultarla.

### Noruega · 50 candidatas

- [ ] **NO001** — Conversor de divisas con fecha y comisiones · `currency-converter` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO002** — Calculadora de renta y nómina noruega · `norway-income-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO003** — Impuesto noruego sobre el patrimonio · `norway-wealth-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO004** — Feriepenger: paga de vacaciones noruega · `norway-holiday-pay-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO005** — Coste de contratación y cotización patronal noruega · `norway-employer-cost-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO006** — Retribución en especie por coche de empresa en Noruega · `norway-company-car-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO007** — Prestación noruega de desempleo · `norway-unemployment-benefit-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO008** — Prestación y calendario parental noruego · `norway-parental-benefit-planner` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO009** — Estimador noruego de manutención infantil · `norway-child-support-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO010** — Ayuda noruega para vivienda · `norway-housing-benefit-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO011** — Estimación noruega de prestación por incapacidad · `norway-disability-benefit-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO012** — Financiación estudiantil y conversión a beca en Noruega · `norway-student-finance-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO013** — Ahorro BSU y beneficio fiscal noruego · `norway-bsu-benefit-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO014** — Deducción noruega por desplazamientos al trabajo · `norway-commuting-deduction-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO015** — Reembolso de kilometraje noruego · `norway-mileage-reimbursement-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO016** — Interés de demora con periodos y pagos parciales · `late-payment-interest-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO017** — Costes de importar compras a Noruega · `norway-import-duty-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO018** — Coste de importar un coche a Noruega · `norway-car-import-cost-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO019** — Peajes noruegos por trayecto y tipo de vehículo · `norway-toll-cost-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO020** — Drecho documental al transmitir vivienda en Noruega · `norway-property-transfer-fee-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO021** — Norgespris frente a apoyo eléctrico noruego · `norway-electricity-support-comparator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO022** — Calculadora de muestras y adaptación de punto · `knitting-gauge-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO023** — Patrones de cuentas y bordado desde imagen · `bead-pattern-generator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO024** — Conversor al alfabeto fonético de radiocomunicaciones · `phonetic-alphabet-converter` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO025** — Juego de deducción de códigos y colores · `codebreaker-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO026** — Medidor y conversor de talla de anillo · `ring-size-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO027** — Conversor de tallas de calzado por longitud · `shoe-size-converter` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO028** — Curvas y percentiles de crecimiento infantil · `child-growth-percentile-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO029** — Edad equivalente de perros y gatos · `pet-age-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO030** — Prueba visual de pantalla y píxeles · `display-pixel-test` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO031** — Prueba de FPS y frecuencia observada del navegador · `browser-frame-rate-test` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO032** — Visor 3D local de mallas y STEP · `3d-model-viewer` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO033** — Visor de planos DXF con capas y medidas · `dxf-drawing-viewer` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO034** — Generador imprimible de papel cuadriculado y de puntos · `graph-paper-generator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO035** — Medidor local de nivel de micrófono · `microphone-level-meter` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO036** — Juego de dados tipo Yatzy y hoja de puntuación · `dice-poker-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO037** — Juego de lanzar burbujas · `bubble-shooter` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO038** — Juego de adivinar palabras con pistas por letra · `five-letter-word-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO039** — Bridge de contrato contra jugadores locales de ordenador · `bridge-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO040** — Farkle: dados y decisiones de riesgo · `farkle-dice-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO041** — Vri åtter / Crazy Eights · `crazy-eights-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO042** — Idiot: juego noruego de descarte · `idiot-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO043** — President: descarte por rangos y rondas · `president-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO044** — Krig / War con resolución de empates · `war-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO045** — Amerikaner: bazas con subasta noruega · `amerikaner-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO046** — Gris / Pig de cuatro cartas iguales · `pig-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO047** — Serpientes y escaleras · `snakes-and-ladders` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO048** — Pinball / flipper local · `pinball-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO049** — Práctica de mapas, países, banderas y regiones · `geography-map-quiz` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **NO050** — Shut the Box: dados y combinaciones · `shut-the-box` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —

### Suiza · 50 candidatas

- [ ] **CH001** — Salario neto suizo con desglose de nómina · `switzerland-net-salary-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH002** — Impuesto anual suizo por cantón y municipio · `switzerland-income-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH003** — Renta estatal AVS/AHV suiza · `switzerland-ahv-pension-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH004** — Pilar 3a: aportación y ahorro fiscal · `switzerland-pillar-3a-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH005** — Pensión ocupacional LPP/BVG suiza · `switzerland-bvg-pension-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH006** — Fiscalidad suiza del rescate de capital previsional · `switzerland-pension-withdrawal-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH007** — Franquicia del seguro de salud suizo · `switzerland-health-deductible-comparator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH008** — Reducción cantonal de primas de seguro · `switzerland-premium-subsidy-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH009** — Prestación de desempleo suiza · `switzerland-unemployment-benefit-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH010** — Ajuste del alquiler por tipo de referencia suizo · `switzerland-rent-adjustment-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH011** — Vacaciones proporcionales y saldo por contrato · `vacation-entitlement-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH012** — Plazos y carta de finalización de alquiler suizo · `switzerland-tenancy-notice-planner` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH013** — Impuesto suizo sobre plusvalía inmobiliaria · `switzerland-property-gains-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH014** — Impuesto suizo de herencias y donaciones · `switzerland-inheritance-gift-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH015** — Presupuesto de manutención suizo por método documentado · `switzerland-child-support-budget-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH016** — Validador de formato y dígito de UID/CHE · `swiss-uid-validator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH017** — QR-factura suiza con validación de referencia · `swiss-qr-bill-generator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH018** — Conversor geográfico LV95/LV03, WGS84 y UTM · `geographic-coordinate-converter` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH019** — Desplazamiento y holgura de llantas · `wheel-offset-clearance-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH020** — Escalas de planos y ajuste de impresión · `scale-drawing-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH021** — Escala de notas de examen a partir de puntos · `grade-scale-generator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH022** — Separación silábica y guiones de maquetación · `word-hyphenation-tool` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH023** — Punto de rocío y mezcla de humedad del aire · `dew-point-humidity-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH024** — Carta natal y ascendente como entretenimiento · `natal-chart-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH025** — Numerología recreativa con explicación del algoritmo · `numerology-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH026** — Jass: Schieber contra CPU local · `jass-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH027** — Puzzle binario Binairo / Takuzu · `binary-puzzle` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH028** — Juego del molino de nueve fichas · `nine-mens-morris` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH029** — Halma con saltos encadenados · `halma-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH030** — Canasta por parejas o modalidad de dos · `canasta-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH031** — Skat contra CPU con contratos declarados · `skat-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH032** — Doppelkopf local con parejas y anuncios · `doppelkopf-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH033** — Schafkopf de una modalidad completa · `schafkopf-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH034** — Schnapsen de dos jugadores · `schnapsen-card-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH035** — Puzzle de regiones Suguru · `suguru-puzzle` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH036** — Shikaku: partición de rectángulos · `shikaku-puzzle` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH037** — Corrector ortográfico local con diccionarios · `local-spell-checker` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH038** — Rompebloques con pala y física · `brick-breaker-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH039** — Minigolf de recorridos locales originales · `mini-golf-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH040** — Puzzle de alinear tres con cascadas · `match-three-game` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH041** — Separador local de voz y acompañamiento · `vocal-remover` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH042** — Audio musical a notas MIDI localmente · `audio-to-midi-transcriber` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH043** — Cambiador de voz y efectos de audio local · `voice-changer` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH044** — Generador de tonos y barridos de frecuencia · `frequency-tone-generator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH045** — Lector de códigos de barras lineales · `barcode-reader` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH046** — Comprobador local de estructura y lectura de CV · `resume-structure-checker` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH047** — Mezcla de agua para GH/KH y dureza · `aquarium-water-mixing-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH048** — Impuesto anual cantonal de vehículos suizos · `switzerland-vehicle-tax-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH049** — Huella de carbono por escenarios con factores citados · `carbon-footprint-calculator` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —
- [ ] **CH050** — Visor DICOM privado de imágenes médicas · `dicom-viewer` · Estado: PLANIFICADA · Local: no · Idiomas: 0/37 · QA: pendiente · Deploy: no · Sitemap: no · Evidencia: —

### Plantilla de actualización de una fila

```text
- [ ] **NOxxx** — Nombre · `slug` · Estado: ESPERANDO_DEPLOY · Local: sí · Idiomas: 37/37 · QA: aprobado · Deploy: no · Sitemap: no · Evidencia: commit <SHA>, informe <ruta/URL>
```

Al publicar, añadir deployment, URL pública y fecha. Al completar sitemap, marcar el gate y después la casilla. Registrar los envíos/lecturas de buscadores en el cierre del lote; no inventar que indexó Google cada URL.

## 16. Tabla de demanda medida para las 100

Volúmenes de la consulta exacta y país de la fila. Las fichas conservan fecha de actualización/consulta y fuentes de las cifras. No sumar las filas como estimación de visitantes únicos.

| ID | Mercado/idioma | Query exacta | Búsquedas/mes | KD | Banda | Prioridad |
| --- | --- | --- | ---: | ---: | --- | --- |
| NO001 | NO/nb | valutakalkulator | 246.000 | 21 | A: ≥10.000 | P1: empezar antes |
| NO002 | NO/nb | skattekalkulator | 18.100 | 29 | A: ≥10.000 | P2: datos/normativa |
| NO003 | NO/nb | formuesskatt kalkulator | 1300 | 0 | B: 1.000–9.999 | P2: datos/normativa |
| NO004 | NO/nb | feriepengekalkulator | 2900 | 0 | B: 1.000–9.999 | P2: datos/normativa |
| NO005 | NO/nb | arbeidsgiveravgift kalkulator | 20 | 0 | D: <100 | P3: reserva demanda |
| NO006 | NO/nb | firmabil kalkulator | 140 | 0 | C: 100–999 | P2: datos/normativa |
| NO007 | NO/nb | dagpenger kalkulator | 1000 | 0 | B: 1.000–9.999 | P2: datos/normativa |
| NO008 | NO/nb | foreldrepenger kalkulator | 1000 | 0 | B: 1.000–9.999 | P2: datos/normativa |
| NO009 | NO/nb | barnebidrag kalkulator | 2900 | 0 | B: 1.000–9.999 | P2: datos/normativa |
| NO010 | NO/nb | bostøtte kalkulator | 2400 | 12 | B: 1.000–9.999 | P2: datos/normativa |
| NO011 | NO/nb | uføretrygd kalkulator | 1300 | 0 | B: 1.000–9.999 | P2: datos/normativa |
| NO012 | NO/nb | studielån kalkulator | 390 | 48 | C: 100–999 | P2: datos/normativa |
| NO013 | NO/nb | bsu kalkulator | 110 | 0 | C: 100–999 | P2: datos/normativa |
| NO014 | NO/nb | reisefradrag kalkulator | 590 | 0 | C: 100–999 | P2: datos/normativa |
| NO015 | NO/nb | kjøregodtgjørelse kalkulator | 880 | 0 | C: 100–999 | P2: datos/normativa |
| NO016 | NO/nb | forsinkelsesrente kalkulator | 1600 | 8 | B: 1.000–9.999 | P2: datos/normativa |
| NO017 | NO/nb | tollkalkulator | 6600 | 43 | B: 1.000–9.999 | P2: datos/normativa |
| NO018 | NO/nb | import bil kalkulator | 110 | 0 | C: 100–999 | P2: datos/normativa |
| NO019 | NO/nb | bompengekalkulator | 49.500 | 2 | A: ≥10.000 | P2: gate técnico |
| NO020 | NO/nb | dokumentavgift kalkulator | 50 | 0 | D: <100 | P3: reserva demanda |
| NO021 | NO/nb | norgespris kalkulator | 5400 | 11 | B: 1.000–9.999 | P2: datos/normativa |
| NO022 | NO/nb | strikkekalkulator | 2400 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO023 | NO/nb | perlemønster | 880 | 0 | C: 100–999 | P1: empezar antes |
| NO024 | NO/nb | fonetisk alfabet | 5400 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO025 | NO/nb | mastermind spill | 720 | 0 | C: 100–999 | P2: gate técnico |
| NO026 | NO/nb | ringstørrelse | 1300 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO027 | NO/nb | skostørrelse | 390 | 0 | C: 100–999 | P1: empezar antes |
| NO028 | NO/nb | bmi barn | 720 | 4 | C: 100–999 | P2: gate técnico |
| NO029 | NO/nb | hundeår | 1000 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO030 | NO/nb | dead pixel test | 260 | 29 | C: 100–999 | P1: empezar antes |
| NO031 | NO/nb | fps test | 480 | 9 | C: 100–999 | P1: empezar antes |
| NO032 | NO/nb | step viewer | 210 | 50 | C: 100–999 | P2: gate técnico |
| NO033 | NO/nb | dxf viewer | 140 | 21 | C: 100–999 | P1: empezar antes |
| NO034 | NO/nb | ruteark | 480 | 0 | C: 100–999 | P1: empezar antes |
| NO035 | NO/nb | desibelmåler | 1000 | 0 | B: 1.000–9.999 | P2: gate técnico |
| NO036 | NO/nb | yatzy | 2900 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO037 | NO/nb | bubble shooter | 9900 | 58 | B: 1.000–9.999 | P1: empezar antes |
| NO038 | NO/nb | wordle norsk | 9900 | 0 | B: 1.000–9.999 | P2: gate técnico |
| NO039 | NO/nb | bridge spill | 880 | 0 | C: 100–999 | P1: empezar antes |
| NO040 | NO/nb | farkle | 320 | 20 | C: 100–999 | P1: empezar antes |
| NO041 | NO/nb | vri åtter | 1300 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO042 | NO/nb | idiot kortspill | 1000 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO043 | NO/nb | kortspill president | 480 | 0 | C: 100–999 | P1: empezar antes |
| NO044 | NO/nb | krig kortspill | 320 | 0 | C: 100–999 | P1: empezar antes |
| NO045 | NO/nb | amerikaner kortspill | 720 | 0 | C: 100–999 | P1: empezar antes |
| NO046 | NO/nb | gris kortspill | 590 | 0 | C: 100–999 | P1: empezar antes |
| NO047 | NO/nb | stigespill | 1000 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO048 | NO/nb | flipperspill | 590 | 4 | C: 100–999 | P1: empezar antes |
| NO049 | NO/nb | geografi quiz | 1600 | 0 | B: 1.000–9.999 | P1: empezar antes |
| NO050 | NO/nb | shut the box | 320 | 7 | C: 100–999 | P1: empezar antes |
| CH001 | CH/de | lohnrechner schweiz | 9900 | 26 | B: 1.000–9.999 | P2: datos/normativa |
| CH002 | CH/de | steuerrechner schweiz | 2900 | 31 | B: 1.000–9.999 | P2: datos/normativa |
| CH003 | CH/de | ahv rente berechnen | 3600 | 0 | B: 1.000–9.999 | P2: datos/normativa |
| CH004 | CH/de | säule 3a rechner | 210 | 4 | C: 100–999 | P2: datos/normativa |
| CH005 | CH/de | bvg rechner | 140 | 0 | C: 100–999 | P2: datos/normativa |
| CH006 | CH/de | kapitalauszahlungssteuer rechner | 260 | 6 | C: 100–999 | P2: datos/normativa |
| CH007 | CH/de | franchise rechner | 70 | 0 | D: <100 | P3: reserva demanda |
| CH008 | CH/de | prämienverbilligung rechner | 170 | 0 | C: 100–999 | P2: datos/normativa |
| CH009 | CH/de | arbeitslosengeld rechner schweiz | 320 | 3 | C: 100–999 | P2: datos/normativa |
| CH010 | CH/de | mietzinsrechner | 1300 | 11 | B: 1.000–9.999 | P2: datos/normativa |
| CH011 | CH/de | ferienrechner | 390 | 0 | C: 100–999 | P2: datos/normativa |
| CH012 | CH/de | kündigung mietvertrag vorlage | 320 | 0 | C: 100–999 | P2: datos/normativa |
| CH013 | CH/de | grundstückgewinnsteuer rechner | 140 | 9 | C: 100–999 | P2: datos/normativa |
| CH014 | CH/de | erbschaftssteuer rechner | 30 | — | D: <100 | P3: reserva demanda |
| CH015 | CH/de | unterhalt berechnen schweiz | 110 | 0 | C: 100–999 | P2: datos/normativa |
| CH016 | CH/de | uid nummer prüfen | 140 | 23 | C: 100–999 | P1: empezar antes |
| CH017 | CH/de | qr rechnung erstellen | 2900 | 37 | B: 1.000–9.999 | P1: empezar antes |
| CH018 | CH/de | koordinaten umrechnen | 390 | 17 | C: 100–999 | P1: empezar antes |
| CH019 | CH/de | et rechner | 320 | 5 | C: 100–999 | P1: empezar antes |
| CH020 | CH/de | maßstab rechner | 590 | 1 | C: 100–999 | P1: empezar antes |
| CH021 | CH/de | notenrechner punkte | 720 | 0 | C: 100–999 | P1: empezar antes |
| CH022 | CH/de | silbentrennung | 1300 | 8 | B: 1.000–9.999 | P1: empezar antes |
| CH023 | CH/de | taupunkt berechnen | 390 | 0 | C: 100–999 | P1: empezar antes |
| CH024 | CH/de | aszendent berechnen | 12.100 | 13 | A: ≥10.000 | P1: empezar antes |
| CH025 | CH/de | numerologie rechner | 590 | 0 | C: 100–999 | P1: empezar antes |
| CH026 | CH/de | jassen | 110.000 | 33 | A: ≥10.000 | P1: empezar antes |
| CH027 | CH/de | binoxxo | 4400 | 3 | B: 1.000–9.999 | P1: empezar antes |
| CH028 | CH/de | mühle online | 880 | 0 | C: 100–999 | P1: empezar antes |
| CH029 | CH/de | halma | 480 | 0 | C: 100–999 | P1: empezar antes |
| CH030 | CH/de | canasta online | 390 | 28 | C: 100–999 | P1: empezar antes |
| CH031 | CH/de | skat | 880 | 45 | C: 100–999 | P1: empezar antes |
| CH032 | CH/de | doppelkopf | 210 | 13 | C: 100–999 | P1: empezar antes |
| CH033 | CH/de | schafkopf | 170 | 27 | C: 100–999 | P1: empezar antes |
| CH034 | CH/de | schnapsen | 70 | 0 | D: <100 | P3: reserva demanda |
| CH035 | CH/de | suguru | 390 | 0 | C: 100–999 | P1: empezar antes |
| CH036 | CH/de | shikaku | 320 | 22 | C: 100–999 | P1: empezar antes |
| CH037 | CH/fr | correcteur orthographe | 49.500 | 55 | A: ≥10.000 | P2: gate técnico |
| CH038 | CH/de | brick breaker | 140 | 1 | C: 100–999 | P1: empezar antes |
| CH039 | CH/de | minigolf online | 50 | 5 | D: <100 | P3: reserva demanda |
| CH040 | CH/de | match 3 | 40 | 13 | D: <100 | P3: reserva demanda |
| CH041 | CH/de | vocal remover | 1900 | 3 | B: 1.000–9.999 | P2: gate técnico |
| CH042 | CH/de | audio to midi | 140 | 8 | C: 100–999 | P2: gate técnico |
| CH043 | CH/de | voice changer | 880 | 52 | C: 100–999 | P1: empezar antes |
| CH044 | CH/de | ton generator | 210 | 23 | C: 100–999 | P1: empezar antes |
| CH045 | CH/de | barcode scanner online | 170 | 21 | C: 100–999 | P1: empezar antes |
| CH046 | CH/de | ats resume checker | 260 | 25 | C: 100–999 | P2: gate técnico |
| CH047 | CH/de | wasserhärte umrechnen | 110 | 1 | C: 100–999 | P1: empezar antes |
| CH048 | CH/de | kfz steuer rechner schweiz | 170 | 9 | C: 100–999 | P2: datos/normativa |
| CH049 | CH/de | co2 rechner | 210 | 45 | C: 100–999 | P1: empezar antes |
| CH050 | CH/de | dicom viewer | 260 | 10 | C: 100–999 | P2: gate técnico |

## 17. Fichas de producto, longtails e implementación

### Fichas de Noruega

#### NO001 · Conversor de divisas con fecha y comisiones

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/currency-converter/` (EN: `https://tools.usefulverse.com/tools/currency-converter/`). Una misma ficha en 37 idiomas.
- **Demanda:** «valutakalkulator», NO/nb, 246.000/mes, KD 21. P1: empezar antes; A: ≥10.000. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 14:47:37 +00:00.
- **Funciones obligatorias:** NOK, CHF y monedas principales; invertir pareja; conversión de una tabla de importes; margen/comisión del banco; importar tipos CSV y usar copia local fechada. Botón opcional de actualización directa desde fuente pública cuando CORS y términos lo permitan.
- **Longtails y modos de la misma URL:** «euro nok»; «nok til euro»; «euro til nok»; «valutaomregner».
- **Longtails con dato en esta investigación:** «euro nok» 110.000/mes, KD 9 (NO/nb, no-nb-overview); «nok til euro» 6600/mes, KD 7 (NO/nb, no-nb-overview); «euro til nok» 9900/mes, KD 5 (NO/nb, no-nb-overview); «valutaomregner» 3600/mes, KD 32 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** unit-converter: convierte unidades físicas, no tipos de cambio ni márgenes bancarios; forex-position-size-calculator: calcula riesgo de una operación, no cambio de divisas.
- **Implementación en dispositivo:** Cálculo puro con tabla estática fechada/importada y procedencia por dato; actualización pública directa solo si se verifica CORS/términos. Sin backend, polling, cron facturable ni secreto en el cliente.
- **Caso/aceptación específico:** Tipo de prueba 1 EUR = 10 NOK: 20 EUR → 200 NOK; invertir sin perder precisión; comisión fija y porcentual separadas; fin de semana, caché caducada, error de red y conversión offline.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Los tipos son indicativos, llevan fecha y procedencia. Sin servidor/proxy ni API de pago; si falla la fuente se mantiene el modo manual/importado, nunca se presenta un dato viejo como tiempo real.
- **Fuentes iniciales:** [FX](#fuentes-de-fx). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO002 · Calculadora de renta y nómina noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-income-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-income-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «skattekalkulator», NO/nb, 18.100/mes, KD 29. P2: datos/normativa; A: ≥10.000. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 12:44:16 +00:00.
- **Funciones obligatorias:** Año fiscal, salario/pensión, tramos, deducciones y cotizaciones relevantes; desglose de impuesto y neto anual/mensual; comparación de dos escenarios. Excluir patrimonio, que tiene su ficha independiente.
- **Longtails y modos de la misma URL:** «skatteberegning»; «skatt på lønn»; «skatt på pensjon»; «lønn etter skatt kalkulator».
- **Longtails con dato en esta investigación:** «skatteberegning» 480/mes, KD 5 (NO/nb, no-nb-overview); «skatt på lønn» 110/mes, KD 0 (NO/nb, no-nb-overview); «skatt på pensjon» 2400/mes, KD 0 (NO/nb, no-nb-overview); «lønn etter skatt kalkulator» 320/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** tax-calculator: solo IVA/impuestos sobre un precio; salary-to-hourly-calculator: convierte periodicidad del bruto sin legislación de renta.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Crear fixtures del simulador oficial para asalariado, pensionista, renta cero y cada frontera de tramo; comparar año/régimen/municipio y rechazar casos no cubiertos.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Gate normativo: tablas oficiales por año, excepciones regionales y alcance publicados. No prometer una declaración ni liquidación fiscal oficial.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO003 · Impuesto noruego sobre el patrimonio

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-wealth-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-wealth-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «formuesskatt kalkulator», NO/nb, 1300/mes, KD 0. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 16:41:09 +00:00.
- **Funciones obligatorias:** Activos por clase, descuentos de valoración, vivienda habitual/secundaria, deudas y estado civil; resultado estatal/municipal; sensibilidad al valor declarado. Usar valor fiscal, no confundirlo con patrimonio de mercado.
- **Longtails y modos de la misma URL:** «formuesskatt»; «formuesskatt bolig»; «formuesskatt aksjer».
- **Longtails con dato en esta investigación:** «formuesskatt» 18.100/mes, KD 5 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «formuesskatt bolig»; «formuesskatt aksjer». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** net-worth-calculator: suma patrimonio económico; aquí se calculan bases y cuotas fiscales noruegas, no una suma de activos.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Fixtures oficiales por clase de activo; patrimonio bajo umbral, igual al umbral y superior; reparto de deuda y matrimonio; impedir aplicar dos descuentos al mismo activo.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No incluir este cálculo como una segunda página genérica de renta; intención de valoración patrimonial explícita y tablas versionadas.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO004 · Feriepenger: paga de vacaciones noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-holiday-pay-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-holiday-pay-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «feriepengekalkulator», NO/nb, 2900/mes, KD 0. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 17:24:48 +00:00.
- **Funciones obligatorias:** Base acumulada del año anterior, edad, semanas de vacaciones y porcentaje aplicable; paga devengada/cobrada; ajuste frente a la nómina ordinaria; exportar desglose.
- **Longtails y modos de la misma URL:** «feriepenger kalkulator»; «feriepenger»; «feriepenger over 60».
- **Longtails con dato en esta investigación:** «feriepenger kalkulator» 2900/mes, KD 0 (NO/nb, no-nb-overview); «feriepenger» 6600/mes, KD 30 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «feriepenger over 60». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** salary-to-hourly-calculator y time-card-calculator: no calculan derechos de feriepenger ni sustitución del sueldo durante vacaciones.
- **Implementación en dispositivo:** Funciones puras de importes/periodos; tablas laborales por fecha y zona; desglose con base/tasa/concepto. Reutilizar parsers y biblioteca monetaria, no la norma de otro país.
- **Caso/aceptación específico:** Con tasa sintética 12% y base 500.000 NOK, paga 60.000 NOK antes de ajustes; validar supuestos oficiales de edad, semanas, año anterior incompleto y cambio de empleo.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** La tasa del ejemplo de prueba no sustituye verificar la norma. Separar pago, cotización, retención e impuesto anual.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax), [NO-WORK](#fuentes-de-no-work). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO005 · Coste de contratación y cotización patronal noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-employer-cost-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-employer-cost-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «arbeidsgiveravgift kalkulator», NO/nb, 20/mes, KD 0. P3: reserva demanda; D: <100. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 22:11:54 +00:00.
- **Funciones obligatorias:** Zona de cotización, salario, pensión empresarial, feriepenger y costes adicionales declarados; coste anual y mensual; comparar dos ofertas de contratación con conceptos visibles.
- **Longtails y modos de la misma URL:** «arbeidsgiveravgift»; «ansattkostnad kalkulator»; «kostnad ansatt».
- **Longtails con dato en esta investigación:** «arbeidsgiveravgift» 2900/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «ansattkostnad kalkulator»; «kostnad ansatt». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** salary-to-hourly-calculator: salario del trabajador; profit-margin-calculator: margen comercial. Ninguna modela cotizaciones del empleador.
- **Implementación en dispositivo:** Funciones puras de importes/periodos; tablas laborales por fecha y zona; desglose con base/tasa/concepto. Reutilizar parsers y biblioteca monetaria, no la norma de otro país.
- **Caso/aceptación específico:** Tasa sintética 10% sobre 100.000 produce 10.000; después fixtures oficiales por zona, tope, actividad y exención. Evitar duplicar feriepenger ya incluidos en la base.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Consulta exacta de solo 20/mes: reserva comercial, no oportunidad masiva. El término informativo arbeidsgiveravgift tiene más demanda y no toda pertenece al widget.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax), [NO-WORK](#fuentes-de-no-work). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO006 · Retribución en especie por coche de empresa en Noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-company-car-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-company-car-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «firmabil kalkulator», NO/nb, 140/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 04:18:46 +00:00.
- **Funciones obligatorias:** Precio de lista, antigüedad, kilometraje documentado y categoría permitida; base imponible y coste personal estimado usando el tipo marginal introducido; comparar coche propio/empresa sin recomendar financiación.
- **Longtails y modos de la misma URL:** «firmabil skatt»; «firmabil beskatning»; «firmabil privat bruk».
- **Longtails con dato en esta investigación:** «firmabil skatt» 320/mes, KD 6 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «firmabil beskatning»; «firmabil privat bruk». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** car-running-cost-calculator y car-depreciation-calculator: gastos/valor del vehículo, no beneficio fiscal en nómina.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Fixtures oficiales a ambos lados de los tramos y por antigüedad; coste personal = beneficio imponible × tipo marginal de prueba; no usar el precio de compra como precio de lista.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No calcular silenciosamente el impuesto de renta completo; enlazar NO002.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO007 · Prestación noruega de desempleo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-unemployment-benefit-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-unemployment-benefit-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «dagpenger kalkulator», NO/nb, 1000/mes, KD 0. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 17:57:50 +00:00.
- **Funciones obligatorias:** Ingresos de los periodos oficiales, jornada perdida, límite de base, hijos y duración aplicable; estimación diaria/mensual y requisitos que faltan; conservar el cálculo local.
- **Longtails y modos de la misma URL:** «dagpengekalkulator»; «beregne dagpenger»; «dagpenger ved deltid».
- **Longtails con dato en esta investigación:** «dagpengekalkulator» 170/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «beregne dagpenger»; «dagpenger ved deltid». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** severance-pay-calculator: indemnización contractual de salida; esta prestación sigue reglas públicas y periodos de renta distintos.
- **Implementación en dispositivo:** Máquina de reglas determinista con fechas y tabla versionada; calcular pasos y exclusiones explícitos. Los valores se procesan localmente y no se persisten por defecto.
- **Caso/aceptación específico:** Casos oficiales con renta bajo/sobre el límite, empleo parcial y fechas de referencia; base cero y periodos incompletos; distinguir días de prestación de días naturales.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No solicitar BankID ni enviar una solicitud. Tablas NAV fechadas y versión soportada visible.
- **Fuentes iniciales:** [NO-NAV](#fuentes-de-no-nav). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO008 · Prestación y calendario parental noruego

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-parental-benefit-planner/` (EN: `https://tools.usefulverse.com/tools/norway-parental-benefit-planner/`). Una misma ficha en 37 idiomas.
- **Demanda:** «foreldrepenger kalkulator», NO/nb, 1000/mes, KD 0. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 10:19:51 +00:00.
- **Funciones obligatorias:** Cobertura, ingresos y topes; cuotas de cada progenitor, periodos compartidos, trabajo parcial y vacaciones; comparar calendarios e importar/exportar ICS local.
- **Longtails y modos de la misma URL:** «foreldrepermisjon kalkulator»; «foreldrepengekalkulator»; «fedrekvote kalkulator».
- **Longtails con dato en esta investigación:** «foreldrepermisjon kalkulator» 720/mes, KD 24 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «foreldrepengekalkulator»; «fedrekvote kalkulator». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** due-date-calculator estima fecha de parto; business-days-calculator suma días. Ninguna calcula cuotas parentales ni cobertura de renta.
- **Implementación en dispositivo:** Máquina de reglas determinista con fechas y tabla versionada; calcular pasos y exclusiones explícitos. Los valores se procesan localmente y no se persisten por defecto.
- **Caso/aceptación específico:** Calendarios oficiales de ejemplo; nacimiento/adopción y cambios de año; impedir solapamientos indebidos y contar los días según la norma elegida.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Documentar regímenes y fechas de vigencia. Los casos fuera de alcance van al simulador oficial, sin inventar elegibilidad.
- **Fuentes iniciales:** [NO-NAV](#fuentes-de-no-nav). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO009 · Estimador noruego de manutención infantil

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-child-support-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-child-support-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «barnebidrag kalkulator», NO/nb, 2900/mes, KD 0. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 17:32:18 +00:00.
- **Funciones obligatorias:** Edad del menor, ingresos de ambos progenitores, gastos admitidos, convivencia y capacidad de pago; desglose y escenarios, sin guardar identidades.
- **Longtails y modos de la misma URL:** «bidragskalkulator»; «beregne barnebidrag»; «samvær og barnebidrag».
- **Longtails con dato en esta investigación:** «bidragskalkulator» 2400/mes, KD 1 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «beregne barnebidrag»; «samvær og barnebidrag». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** household-budget-planner es presupuesto voluntario; aquí hay reglas de reparto de manutención, deducciones y topes específicos.
- **Implementación en dispositivo:** Máquina de reglas determinista con fechas y tabla versionada; calcular pasos y exclusiones explícitos. Los valores se procesan localmente y no se persisten por defecto.
- **Caso/aceptación específico:** Fixtures públicos NAV; custodia compartida, varios hijos, límite de capacidad y cambio de grupo de edad; nunca generar una obligación legal como resolución firme.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Mantenimiento normativo obligatorio. Tratar el resultado como estimación para conversar, no como acuerdo o resolución.
- **Fuentes iniciales:** [NO-NAV](#fuentes-de-no-nav). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO010 · Ayuda noruega para vivienda

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-housing-benefit-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-housing-benefit-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «bostøtte kalkulator», NO/nb, 2400/mes, KD 12. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 11:37:33 +00:00.
- **Funciones obligatorias:** Municipio, unidad familiar, ingresos y costes de vivienda; límites y base admitida; explicación de exclusiones; comparar cambios de renta/gasto.
- **Longtails y modos de la misma URL:** «bostøttekalkulator»; «beregne bostøtte»; «bostøtte inntekt».
- **Longtails con dato en esta investigación:** «bostøttekalkulator» 390/mes, KD 12 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «beregne bostøtte»; «bostøtte inntekt». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** rent-vs-buy-calculator compara decisiones patrimoniales; esta ficha estima una ayuda pública con reglas de hogar y renta.
- **Implementación en dispositivo:** Máquina de reglas determinista con fechas y tabla versionada; calcular pasos y exclusiones explícitos. Los valores se procesan localmente y no se persisten por defecto.
- **Caso/aceptación específico:** Comparar con ejemplos Husbanken del periodo; umbral exacto, aumento de renta, varios convivientes y municipio no soportado; no confundir importe de ayuda con gasto deducible.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Bloqueada para publicar hasta obtener tablas oficiales redistribuibles y casos comprobables del periodo.
- **Fuentes iniciales:** [NO-HOUSING](#fuentes-de-no-housing). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO011 · Estimación noruega de prestación por incapacidad

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-disability-benefit-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-disability-benefit-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «uføretrygd kalkulator», NO/nb, 1300/mes, KD 0. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-10-15 03:48:03 +00:00.
- **Funciones obligatorias:** Ingresos históricos, porcentaje reconocido por el usuario, periodo cotizado e ingresos compatibles; estimación bruta y desglose de reducción según régimen soportado.
- **Longtails y modos de la misma URL:** «uføretrygd beregning»; «uføretrygd og inntekt»; «uføretrygd grad».
- **Longtails con dato en esta investigación:** «uføretrygd beregning» 70/mes, KD 4 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «uføretrygd og inntekt»; «uføretrygd grad». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** pension-calculator modela una pensión definida por salario/servicio, sin evaluar las reglas de esta prestación.
- **Implementación en dispositivo:** Máquina de reglas determinista con fechas y tabla versionada; calcular pasos y exclusiones explícitos. Los valores se procesan localmente y no se persisten por defecto.
- **Caso/aceptación específico:** Fixtures NAV de porcentaje, mínimo/máximo y renta compatible; fechas de corte; rechazar datos incompletos en lugar de suponer un grado de incapacidad.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No diagnostica ni determina incapacidad. Requiere norma y límites oficiales antes de implementar el cálculo específico.
- **Fuentes iniciales:** [NO-NAV](#fuentes-de-no-nav). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO012 · Financiación estudiantil y conversión a beca en Noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-student-finance-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-student-finance-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «studielån kalkulator», NO/nb, 390/mes, KD 48. P2: datos/normativa; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 02:21:39 +00:00.
- **Funciones obligatorias:** Préstamo de estudios, situación académica, residencia, renta y patrimonio; separar préstamo, parte convertible en beca y calendario; escenario de amortización secundario.
- **Longtails y modos de la misma URL:** «lånekassen kalkulator»; «stipend kalkulator»; «omgjøring lån til stipend».
- **Longtails con dato en esta investigación:** «lånekassen kalkulator» 1000/mes, KD 46 (NO/nb, no-nb-overview); «stipend kalkulator» 110/mes, KD 49 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «omgjøring lån til stipend». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** loan-calculator ya amortiza deuda genérica; el valor nuevo es la conversión condicionada a beca y las reglas Lånekassen. No crear otra calculadora de préstamo simple.
- **Implementación en dispositivo:** Máquina de reglas determinista con fechas y tabla versionada; calcular pasos y exclusiones explícitos. Los valores se procesan localmente y no se persisten por defecto.
- **Caso/aceptación específico:** Fixtures Lånekassen con beca íntegra/parcial/nula, estudios incompletos y umbrales; el principal nunca se convierte dos veces; reconciliar saldo y pagos.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Si no se puede modelar la parte de beca con fuentes, excluir esta candidata; una simple amortización duplicaría el catálogo.
- **Fuentes iniciales:** [NO-STUDENT](#fuentes-de-no-student). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO013 · Ahorro BSU y beneficio fiscal noruego

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-bsu-benefit-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-bsu-benefit-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «bsu kalkulator», NO/nb, 110/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 07:45:25 +00:00.
- **Funciones obligatorias:** Aportación anual, saldo anterior, edad y capacidad de deducción; límite anual/total, desgravación efectiva y calendario de ahorro; comparar con ahorro ordinario.
- **Longtails y modos de la misma URL:** «bsu skattefradrag»; «bsu sparekalkulator»; «bsu innskudd grense».
- **Longtails con dato en esta investigación:** «bsu skattefradrag» 390/mes, KD 32 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «bsu sparekalkulator»; «bsu innskudd grense». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** compound-interest-calculator modela capitalización genérica, no restricciones BSU ni deducción condicionada.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Fixtures de límite anual/total, impuesto insuficiente para absorber deducción y transición de edad; tasa de prueba explícita; ningún ahorro fiscal puede superar el impuesto disponible.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No recomendar productos bancarios ni suponer tipos actuales de interés.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO014 · Deducción noruega por desplazamientos al trabajo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-commuting-deduction-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-commuting-deduction-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «reisefradrag kalkulator», NO/nb, 590/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 07:53:34 +00:00.
- **Funciones obligatorias:** Distancia de ida/vuelta, días efectivos, umbral y tarifas por ejercicio; deducción de base y ahorro fiscal estimado separados; comparar teletrabajo.
- **Longtails y modos de la misma URL:** «reisefradrag»; «reisefradrag hjem jobb»; «reisefradrag hjemmekontor».
- **Longtails con dato en esta investigación:** «reisefradrag» 1600/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «reisefradrag hjem jobb»; «reisefradrag hjemmekontor». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** fuel-cost-calculator calcula combustible real; este cálculo usa reglas de deducción y distancias, aunque el gasto real sea diferente.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Fixtures oficiales de umbral, límite, ida/vuelta y días no trabajados; el resultado nunca puede ser una devolución garantizada.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No geocodificar ni enviar direcciones; introducir distancia o importarla localmente.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO015 · Reembolso de kilometraje noruego

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-mileage-reimbursement-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-mileage-reimbursement-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «kjøregodtgjørelse kalkulator», NO/nb, 880/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 13:24:41 +00:00.
- **Funciones obligatorias:** Viajes de trabajo, kilómetros y suplementos admitidos; importe reembolsable, parte exenta y parte sujeta; hoja de gastos CSV/PDF local.
- **Longtails y modos de la misma URL:** «kjøregodtgjørelse»; «kjørebok»; «kilometergodtgjørelse beregne».
- **Longtails con dato en esta investigación:** «kjøregodtgjørelse» 1600/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «kjørebok»; «kilometergodtgjørelse beregne». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO014 es deducción por acudir al trabajo; NO015 es reembolso de viajes laborales. fuel-cost-calculator no determina su tratamiento fiscal.
- **Implementación en dispositivo:** Funciones puras de importes/periodos; tablas laborales por fecha y zona; desglose con base/tasa/concepto. Reutilizar parsers y biblioteca monetaria, no la norma de otro país.
- **Caso/aceptación específico:** Tarifa sintética 3 por km × 100 km = 300 antes de suplementos; probar múltiples viajes y conceptos excluidos; no duplicar kilómetros de ida y vuelta.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Mantener separadas tarifa pactada y exención fiscal; citar cada tabla.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax), [NO-WORK](#fuentes-de-no-work). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO016 · Interés de demora con periodos y pagos parciales

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/late-payment-interest-calculator/` (EN: `https://tools.usefulverse.com/tools/late-payment-interest-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «forsinkelsesrente kalkulator», NO/nb, 1600/mes, KD 8. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 05:31:38 +00:00.
- **Funciones obligatorias:** Capital, vencimiento, fecha final, cambios de tasa y pagos parciales; cálculo por intervalos y detalle diario; perfiles por jurisdicción sin duplicar URLs de la misma operación.
- **Longtails y modos de la misma URL:** «forsinkelsesrente»; «forsinkelsesrenter beregne»; «inkassokalkulator».
- **Longtails con dato en esta investigación:** «forsinkelsesrente» 1900/mes, KD 35 (NO/nb, no-nb-overview); «inkassokalkulator» 10/mes, KD — (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «forsinkelsesrenter beregne». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** compound-interest-calculator capitaliza ahorro; esta ficha usa deuda vencida, tasas segmentadas y pagos en fechas concretas.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Con 1.000, tasa simple 10%, 365 días y convención ACT/365 produce 100; años bisiestos, cambio de tipo a mitad de periodo y pago parcial; fixtures legales adicionales.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No convertir el cálculo en una reclamación legal automática ni inventar recargos cobrables. Un único motor/página para otros países futuros.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO017 · Costes de importar compras a Noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-import-duty-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-import-duty-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «tollkalkulator», NO/nb, 6600/mes, KD 43. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 03:09:20 +00:00.
- **Funciones obligatorias:** País/procedencia, categoría y valor, porte, moneda, arancel e IVA aplicable; desglose de impuestos frente a gastos privados del transportista; guardar caso local.
- **Longtails y modos de la misma URL:** «toll kalkulator»; «import mva kalkulator»; «tollkvote kalkulator».
- **Longtails con dato en esta investigación:** «toll kalkulator» 880/mes, KD 50 (NO/nb, no-nb-overview); «tollkvote kalkulator» 70/mes, KD 23 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «import mva kalkulator». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** tax-calculator añade un porcentaje a un precio; no determina base aduanera, categorías ni aranceles noruegos.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Casos oficiales de categoría exenta y gravada, portes incluidos, moneda y umbrales; impedir sumar IVA dos veces; tasas manuales claramente etiquetadas cuando falte catálogo.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Delimitar compras de bienes; vehículos completos se remiten a NO018 y cuotas de viajeros solo si tienen reglas propias verificadas.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax), [NO-CUSTOMS](#fuentes-de-no-customs). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO018 · Coste de importar un coche a Noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-car-import-cost-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-car-import-cost-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «import bil kalkulator», NO/nb, 110/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 07:34:59 +00:00.
- **Funciones obligatorias:** Precio/porte, características técnicas, antigüedad, emisiones y depreciación reglada; impuestos de importación/registro y tasas; comparación con precio nacional introducido.
- **Longtails y modos de la misma URL:** «engangsavgift kalkulator»; «omregistreringsavgift kalkulator»; «import bil kostnad».
- **Longtails con dato en esta investigación:** «engangsavgift kalkulator» 30/mes, KD 38 (NO/nb, no-nb-overview); «omregistreringsavgift kalkulator» 720/mes, KD 7 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «import bil kostnad». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO017 trata bienes ordinarios; la tributación de matriculación de vehículos requiere datos técnicos y reglas propias. car-running-cost-calculator calcula uso posterior.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Fixtures oficiales por fecha de primera matriculación y clase del vehículo; motor eléctrico/combustión si están soportados; rechazo de emisiones ausentes.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Un único producto para importación/matriculación del vehículo; no contar cada tasa como otra herramienta.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax), [NO-CUSTOMS](#fuentes-de-no-customs). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO019 · Peajes noruegos por trayecto y tipo de vehículo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-toll-cost-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-toll-cost-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «bompengekalkulator», NO/nb, 49.500/mes, KD 2. P2: gate técnico; A: ≥10.000. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-12 23:27:36 +00:00.
- **Funciones obligatorias:** Seleccionar pasos de peaje o importar GPX; hora, clase, energía y descuentos; reglas de repetición y límite cuando se documenten; comparación de recorridos guardados.
- **Longtails y modos de la misma URL:** «bompenger kalkulator»; «bompenger rute»; «bomstasjoner pris».
- **Hipótesis semánticas sin cifra consultada:** «bompenger kalkulator»; «bompenger rute»; «bomstasjoner pris». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** fuel-cost-calculator calcula combustible; NO017 es aduana. Aquí se calcula el pago de pasos reales por estaciones de carretera.
- **Implementación en dispositivo:** Cálculo puro con tabla estática fechada/importada y procedencia por dato; actualización pública directa solo si se verifica CORS/términos. Sin backend, polling, cron facturable ni secreto en el cliente.
- **Caso/aceptación específico:** Casos oficiales de operador; mismo grupo dentro/fuera de ventana, sentido, horas punta y eléctrico. Mostrar cobertura de plazas y fecha; GPX que cruza cerca de una plaza no basta sin sentido vial.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Demanda alta, pero gate técnico fuerte: catálogo de tarifas/licencia y reconocimiento de ruta fiables. No usar Google Maps Directions de pago ni prometer ruta completa sin implementarla; mantener en reserva técnica si falta la cobertura.
- **Fuentes iniciales:** [NO-TOLLS](#fuentes-de-no-tolls). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO020 · Drecho documental al transmitir vivienda en Noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-property-transfer-fee-calculator/` (EN: `https://tools.usefulverse.com/tools/norway-property-transfer-fee-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «dokumentavgift kalkulator», NO/nb, 50/mes, KD 0. P3: reserva demanda; D: <100. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 21:35:08 +00:00.
- **Funciones obligatorias:** Base de transmisión, cuota adquirida, clase de título y exenciones documentadas; coste documental separado de tasas de registro; caso imprimible.
- **Longtails y modos de la misma URL:** «dokumentavgift»; «dokumentavgift bolig»; «dokumentavgift fritak».
- **Longtails con dato en esta investigación:** «dokumentavgift» 2900/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «dokumentavgift bolig»; «dokumentavgift fritak». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** mortgage-affordability-calculator estima capacidad de compra; no decide este hecho imponible ni las exenciones documentales.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Con tasa sintética 2% y base 1.000.000, cuota 20.000; contrastar cooperativa/título directo, transmisión parcial y exención oficial; no gravar una exención.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Solo 50/mes en la consulta exacta: reserva priorizada por utilidad local, sin llamarla búsqueda masiva.
- **Fuentes iniciales:** [NO-TAX](#fuentes-de-no-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO021 · Norgespris frente a apoyo eléctrico noruego

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/norway-electricity-support-comparator/` (EN: `https://tools.usefulverse.com/tools/norway-electricity-support-comparator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «norgespris kalkulator», NO/nb, 5400/mes, KD 11. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 04:44:32 +00:00.
- **Funciones obligatorias:** Consumo por periodo, precios introducidos/importados y programa aplicable; comparar coste bajo alternativas y sin ayuda; separar energía, red, IVA y ayudas.
- **Longtails y modos de la misma URL:** «strømstøtte kalkulator»; «strømstøttekalkulator»; «norgespris lønner seg».
- **Longtails con dato en esta investigación:** «strømstøtte kalkulator» 320/mes, KD 0 (NO/nb, no-nb-overview); «strømstøttekalkulator» 10/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «norgespris lønner seg». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** electricity-cost-calculator multiplica kWh por precio; esta comparación calcula dos programas regulatorios y sus límites sobre una serie temporal.
- **Implementación en dispositivo:** Motor JS puro con decimales/BigInt cuando proceda; datasets inmutables por año/jurisdicción; funciones de base, tramos, deducciones y redondeo separadas. Sin API de cálculo; formulario y desglose se generan estáticos.
- **Caso/aceptación específico:** Serie sintética con precio bajo/alto el mismo mes; consumo bajo/sobre tope, vivienda/vivienda de vacaciones y zona; comprobar que la ayuda no se aplique a costes no cubiertos.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No cotizaciones comerciales en directo ni scraping de la factura. Verificar normativa y fechas antes de publicar cada programa.
- **Fuentes iniciales:** [NO-ENERGY](#fuentes-de-no-energy). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO022 · Calculadora de muestras y adaptación de punto

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/knitting-gauge-calculator/` (EN: `https://tools.usefulverse.com/tools/knitting-gauge-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «strikkekalkulator», NO/nb, 2400/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 08:49:01 +00:00.
- **Funciones obligatorias:** Muestra real y patrón original; adaptar puntos/vueltas a medidas; múltiples de repetición, simetría y aumentos/disminuciones; explicación y plantilla imprimible.
- **Longtails y modos de la misma URL:** «strikkefasthet kalkulator»; «maskekalkulator»; «garnkalkulator».
- **Longtails con dato en esta investigación:** «strikkefasthet kalkulator» 210/mes, KD 0 (NO/nb, no-nb-overview); «maskekalkulator» 260/mes, KD 10 (NO/nb, no-nb-overview); «garnkalkulator» 140/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** ratio-proportion-calculator no conoce repeticiones, orillos ni ajustes de prendas; la tarea es adaptar una pieza tejida, no mostrar una proporción aislada.
- **Implementación en dispositivo:** Operaciones de razón/medida y redondeo por múltiplos declarados; tabla explicativa y salida SVG/PDF diferida. Ninguna librería de IA o pago para escalar una muestra.
- **Caso/aceptación específico:** 20 puntos por 10 cm y anchura 50 cm → 100 puntos antes de ajustar repeticiones; probar unidades, muestra cero y redondeo simétrico; mostrar diferencia entre medida final y objetivo.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Consumo de hilo solo como estimación con muestra/peso aportados; no inventar patrones de pago ni medidas universales.

#### NO023 · Patrones de cuentas y bordado desde imagen

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/bead-pattern-generator/` (EN: `https://tools.usefulverse.com/tools/bead-pattern-generator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «perlemønster», NO/nb, 880/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-17 02:07:57 +00:00.
- **Funciones obligatorias:** Imagen local → cuadrícula de colores/símbolos; tamaño, paleta restringida y dithering; contador de piezas, leyenda y PDF/SVG imprimible; adaptar a cuentas o punto de cruz en el mismo producto.
- **Longtails y modos de la misma URL:** «perle mønster fra bilde»; «korssting mønster»; «strikkemønster generator».
- **Longtails con dato en esta investigación:** «korssting mønster» 110/mes, KD 0 (NO/nb, no-nb-extra); «strikkemønster generator» —/mes, KD — (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «perle mønster fra bilde». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** pixel-art-editor y photo-mosaic-maker crean arte visual; aquí se necesitan patrón físico, lista de materiales y leyenda de montaje.
- **Implementación en dispositivo:** Canvas/ImageBitmap y cuantización en Worker; paleta, símbolos y contadores deterministas; SVG/PNG/PDF generados localmente. Liberar bitmaps/URLs y mantener el original intacto.
- **Caso/aceptación específico:** Imagen 2×2 con dos colores → cuatro celdas y conteo exacto; transparencia, paleta de un color, retícula y hoja de impresión; comprobar que símbolos y colores coinciden.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** La query principal incluye búsqueda de plantillas ya hechas; no atribuir todo su volumen al generador. Arte propio, sin personajes/marcas copiados.

#### NO024 · Conversor al alfabeto fonético de radiocomunicaciones

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/phonetic-alphabet-converter/` (EN: `https://tools.usefulverse.com/tools/phonetic-alphabet-converter/`). Una misma ficha en 37 idiomas.
- **Demanda:** «fonetisk alfabet», NO/nb, 5400/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 20:37:33 +00:00.
- **Funciones obligatorias:** Texto → palabras normalizadas del alfabeto fonético; números/separadores y pronunciación escrita; reproducción local opcional con voces disponibles, práctica y copia.
- **Longtails y modos de la misma URL:** «nato alfabet»; «fonetisk alfabet navn»; «bokstaver radio».
- **Longtails con dato en esta investigación:** «nato alfabet» 140/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «fonetisk alfabet navn»; «bokstaver radio». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** morse-code-translator produce puntos/rayas; esta herramienta deletrea para comunicaciones habladas y practica reconocimiento.
- **Implementación en dispositivo:** Motor de tokens/patrones/diccionarios en JS o WASM licenciado y diferido por idioma técnico. Renderizar texto inerte; sin eval, modelo remoto o traducción en cada visita.
- **Caso/aceptación específico:** ABC → Alfa Bravo Charlie; tratar Æ/Ø/Å según opción documentada y avisar si no tienen una equivalencia estándar elegida; no silenciar símbolos sin explicación.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** El alfabeto técnico permanece estándar; traducir interfaz y explicación, no deformar los códigos. No descargar voces de pago.
- **Fuentes iniciales:** [DICTIONARIES](#fuentes-de-dictionaries). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO025 · Juego de deducción de códigos y colores

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/codebreaker-game/` (EN: `https://tools.usefulverse.com/tools/codebreaker-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «mastermind spill», NO/nb, 720/mes, KD 0. P2: gate técnico; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 06:24:03 +00:00.
- **Funciones obligatorias:** Código secreto, colores/símbolos accesibles, pistas de posición/presencia y control de repetición; varias longitudes, práctica/diario y modo difícil; tutorial.
- **Longtails y modos de la misma URL:** «mastermind spiel»; «mastermind online»; «code knacker spiel».
- **Hipótesis semánticas sin cifra consultada:** «mastermind spiel»; «mastermind online»; «code knacker spiel». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO038 usa diccionario lingüístico y palabras; aquí se deducen códigos arbitrarios con parámetros propios, sin corpus de palabras.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Código con colores repetidos y varias permutaciones; número de aciertos de posición y color correcto sin doble conteo; victoria y intentos agotados.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No usar Mastermind como marca propia ni copiar su presentación. La query genérica puede tener intención de producto/marca; hacer muestra de SERP antes de fijar title final.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO026 · Medidor y conversor de talla de anillo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/ring-size-calculator/` (EN: `https://tools.usefulverse.com/tools/ring-size-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «ringstørrelse», NO/nb, 1300/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-17 23:33:04 +00:00.
- **Funciones obligatorias:** Circunferencia/diámetro medidos, tallas EU/US/UK y tabla de equivalencias; tira imprimible con comprobador de escala; ajustes del usuario sin afirmar que sustituyen al fabricante.
- **Longtails y modos de la misma URL:** «ringstørrelse kalkulator»; «måle ringstørrelse»; «ring størrelse tabell».
- **Hipótesis semánticas sin cifra consultada:** «ringstørrelse kalkulator»; «måle ringstørrelse»; «ring størrelse tabell». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** bra-size-calculator y screen-ruler resuelven otras medidas; se aporta una tabla de anillos y medición física específica.
- **Implementación en dispositivo:** Modelo de medidas y tablas de equivalencias con fuente/versión; aritmética local y unidades explícitas. Exportación física con barra de comprobación cuando proceda.
- **Caso/aceptación específico:** Diámetro 20 mm → circunferencia aproximada 62,832 mm antes de consultar tabla; calibrar impresión con línea conocida; no usar una pantalla sin calibrar como regla exacta.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Separar talla nominal y medida real. La query general puede incluir compra de anillos; priorizar longtails de medir/convertir.

#### NO027 · Conversor de tallas de calzado por longitud

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/shoe-size-converter/` (EN: `https://tools.usefulverse.com/tools/shoe-size-converter/`). Una misma ficha en 37 idiomas.
- **Demanda:** «skostørrelse», NO/nb, 390/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-12 12:45:23 +00:00.
- **Funciones obligatorias:** Longitud del pie, unidad, grupo y sistema de talla; tabla de adulto/infantil si está verificada; ambos pies y longitud mayor; ficha descargable con margen elegido.
- **Longtails y modos de la misma URL:** «skostørrelse guide»; «skostørrelse omregner»; «sko cm størrelse».
- **Hipótesis semánticas sin cifra consultada:** «skostørrelse guide»; «skostørrelse omregner»; «sko cm størrelse». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** unit-converter no convierte sistemas de talla ni explica la diferencia entre pie, horma y talla comercial.
- **Implementación en dispositivo:** Modelo de medidas y tablas de equivalencias con fuente/versión; aritmética local y unidades explícitas. Exportación física con barra de comprobación cuando proceda.
- **Caso/aceptación específico:** Conversión basada en tablas documentadas por sistema; pares límite y medias tallas; coherencia al invertir; tabla no disponible → no inventar equivalencia.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No prometer ajuste de una marca concreta. Mantener el alcance en calzado, sin crear una URL por combinación de país o sexo.

#### NO028 · Curvas y percentiles de crecimiento infantil

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/child-growth-percentile-calculator/` (EN: `https://tools.usefulverse.com/tools/child-growth-percentile-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «bmi barn», NO/nb, 720/mes, KD 4. P2: gate técnico; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-16 10:19:34 +00:00.
- **Funciones obligatorias:** Edad exacta, sexo de referencia y medidas; peso/talla/IMC según estándar y rango de edad elegidos; percentiles y gráfico local; comparar mediciones sin subir datos.
- **Longtails y modos de la misma URL:** «vekstkurve barn»; «percentil barn»; «bmi barn alder».
- **Longtails con dato en esta investigación:** «vekstkurve barn» 320/mes, KD 0 (NO/nb, no-nb-extra); «percentil barn» 140/mes, KD 0 (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «bmi barn alder». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** adult-bmi-calculator excluye menores; esta herramienta requiere curvas por edad/sexo y estándares pediátricos específicos.
- **Implementación en dispositivo:** Tablas LMS/referencia con edad/unidades y algoritmo documentados, en Worker si hace falta; diferenciar estándares y sus edades. Importación/visualización local de mediciones, sin perfiles de pacientes en servidor.
- **Caso/aceptación específico:** Reproducir ejemplos oficiales OMS/CDC con edad exacta y unidades; frontera de edad, fecha imposible, prematuridad no soportada y medidas fuera de rango; nunca aplicar umbrales de IMC adulto.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Gate de tablas/licencia y validación médica de la interpretación. No diagnosticar ni recomendar dietas; explicar el resultado y sus límites con fuentes oficiales.
- **Fuentes iniciales:** [GROWTH](#fuentes-de-growth). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO029 · Edad equivalente de perros y gatos

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/pet-age-calculator/` (EN: `https://tools.usefulverse.com/tools/pet-age-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «hundeår», NO/nb, 1000/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-16 03:18:42 +00:00.
- **Funciones obligatorias:** Perro/gato, edad y grupo de tamaño cuando corresponda; mostrar tabla y evolución por etapas; método y límites explícitos; comparar varios animales sin datos personales.
- **Longtails y modos de la misma URL:** «katteår»; «hundens alder»; «hundejahre rechner»; «katzenjahre rechner».
- **Longtails con dato en esta investigación:** «katteår» 880/mes, KD 0 (NO/nb, no-nb-extra); «hundens alder» 90/mes, KD 0 (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «hundejahre rechner»; «katzenjahre rechner». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** age-calculator calcula tiempo civil entre fechas; aquí se aplica una tabla de etapas de envejecimiento por especie.
- **Implementación en dispositivo:** Modelo de medidas y tablas de equivalencias con fuente/versión; aritmética local y unidades explícitas. Exportación física con barra de comprobación cuando proceda.
- **Caso/aceptación específico:** Fixtures de la tabla veterinaria seleccionada, cachorro/adulto/senior y tamaños; no multiplicar todas las edades por siete como regla universal.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Una sola página para ambas especies y todos los idiomas. Es una equivalencia orientativa, no evaluación de salud.

#### NO030 · Prueba visual de pantalla y píxeles

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/display-pixel-test/` (EN: `https://tools.usefulverse.com/tools/display-pixel-test/`). Una misma ficha en 37 idiomas.
- **Demanda:** «dead pixel test», NO/nb, 260/mes, KD 29. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-18 00:01:13 +00:00.
- **Funciones obligatorias:** Fondos RGB/blanco/negro, gradientes y rejilla; pantalla completa voluntaria, instrucciones y cambio manual/automático pausado; salida clara y sin efectos de destello rápido.
- **Longtails y modos de la misma URL:** «pixel test»; «skjermtest»; «monitortest».
- **Longtails con dato en esta investigación:** «pixel test» 50/mes, KD 4 (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «skjermtest»; «monitortest». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** screen-ruler mide longitudes; color-vision-simulator transforma imágenes. Esta herramienta comprueba visualmente defectos/gradientes del panel.
- **Implementación en dispositivo:** APIs de navegador con detección de soporte y permisos solo al activar; rAF/canvas o capturas locales según contrato; limpieza de pistas y estado en stop. No inferir capacidades certificadas del hardware.
- **Caso/aceptación específico:** Cada control muestra el color exacto; Escape sale de pantalla completa; teclado y móvil; si fullscreen se bloquea la prueba sigue en su contenedor.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No afirmar que un navegador detecta o repara físicamente un píxel; el usuario observa la pantalla.

#### NO031 · Prueba de FPS y frecuencia observada del navegador

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/browser-frame-rate-test/` (EN: `https://tools.usefulverse.com/tools/browser-frame-rate-test/`). Una misma ficha en 37 idiomas.
- **Demanda:** «fps test», NO/nb, 480/mes, KD 9. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-17 22:55:59 +00:00.
- **Funciones obligatorias:** Escena canvas/WebGL controlada y medida rAF; FPS, intervalo medio, percentiles y estabilidad; elegir carga, duración y detener; exportar informe local de condiciones.
- **Longtails y modos de la misma URL:** «hz test»; «skjerm hz test»; «browser fps test».
- **Longtails con dato en esta investigación:** «hz test» 170/mes, KD 0 (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «skjerm hz test»; «browser fps test». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** reaction-time-test mide respuesta humana; aquí se mide el bucle de renderizado bajo una carga reproducible.
- **Implementación en dispositivo:** APIs de navegador con detección de soporte y permisos solo al activar; rAF/canvas o capturas locales según contrato; limpieza de pistas y estado en stop. No inferir capacidades certificadas del hardware.
- **Caso/aceptación específico:** Reloj simulado con 60 intervalos de 16,667 ms ≈60 FPS; detectar pestaña oculta y timer reducido; no reportar cero como frecuencia física del monitor.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No vender la medición rAF como frecuencia certificada del panel o rendimiento de todos los videojuegos. Detener animaciones al ocultarse la pestaña.

#### NO032 · Visor 3D local de mallas y STEP

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/3d-model-viewer/` (EN: `https://tools.usefulverse.com/tools/3d-model-viewer/`). Una misma ficha en 37 idiomas.
- **Demanda:** «step viewer», NO/nb, 210/mes, KD 50. P2: gate técnico; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-13 11:14:57 +00:00.
- **Funciones obligatorias:** STL/OBJ/GLTF y STEP solo cuando el importador esté validado; rotar, zoom, cortes o medición con unidades declaradas; propiedades de malla y captura; informe de formatos soportados.
- **Longtails y modos de la misma URL:** «stl viewer»; «3d viewer»; «step viewer gratis».
- **Longtails con dato en esta investigación:** «stl viewer» 170/mes, KD 14 (NO/nb, no-nb-extra); «3d viewer» 110/mes, KD 40 (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «step viewer gratis». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** molecule-viewer es una galería de moléculas 2D; no carga ensamblajes o mallas CAD del usuario.
- **Implementación en dispositivo:** Parser/importador y renderizador solo al abrir archivo; evaluar Three.js, un parser DXF y OCCT/STEP según el formato, con versión y licencia fijadas. Web Worker, límites de memoria observados y control de referencias externas.
- **Caso/aceptación específico:** Cubo sintético de lado 10 en unidades declaradas; bounding box exacta, orientación y normales; modelo corrupto, enorme y con referencias externas; sin solicitudes externas de texturas.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** STEP requiere kernel WASM separado y licencia comprobada, bajo demanda. Un único visor para sus formatos; no crear una herramienta por extensión.
- **Fuentes iniciales:** [LOCAL-CAD](#fuentes-de-local-cad). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO033 · Visor de planos DXF con capas y medidas

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/dxf-drawing-viewer/` (EN: `https://tools.usefulverse.com/tools/dxf-drawing-viewer/`). Una misma ficha en 37 idiomas.
- **Demanda:** «dxf viewer», NO/nb, 140/mes, KD 21. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-14 05:05:50 +00:00.
- **Funciones obligatorias:** Abrir DXF 2D, capas, unidades, pan/zoom, medidas y exportar SVG/imagen; listar entidades no compatibles; nunca ejecutar scripts ni enlaces del archivo.
- **Longtails y modos de la misma URL:** «dxf viewer online»; «åpne dxf»; «dxf til svg».
- **Hipótesis semánticas sin cifra consultada:** «dxf viewer online»; «åpne dxf»; «dxf til svg». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** svg-editor edita vectores SVG; NO032 muestra mallas/sólidos 3D. DXF 2D requiere entidades, capas y medidas de plano.
- **Implementación en dispositivo:** Parser/importador y renderizador solo al abrir archivo; evaluar Three.js, un parser DXF y OCCT/STEP según el formato, con versión y licencia fijadas. Web Worker, límites de memoria observados y control de referencias externas.
- **Caso/aceptación específico:** Fixture con línea 10 unidades, arco y dos capas; apagar capa y verificar exportación; codificación, unidades ausentes y entidades desconocidas; no dibujar algo incorrecto en silencio.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No anunciar DWG mientras no exista decodificador legal y probado. Exportar el subconjunto soportado con aviso preciso.
- **Fuentes iniciales:** [LOCAL-CAD](#fuentes-de-local-cad). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO034 · Generador imprimible de papel cuadriculado y de puntos

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/graph-paper-generator/` (EN: `https://tools.usefulverse.com/tools/graph-paper-generator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «ruteark», NO/nb, 480/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-16 16:17:48 +00:00.
- **Funciones obligatorias:** Tamaño A4/Letter/personalizado, cuadricula milimétrica, puntos e isométrica, margen y color; SVG/PDF o impresión a escala; varias páginas en un mismo producto.
- **Longtails y modos de la misma URL:** «millimeterpapir»; «grafpapir»; «ruteark skrive ut».
- **Longtails con dato en esta investigación:** «millimeterpapir» 210/mes, KD 0 (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «grafpapir»; «ruteark skrive ut». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** math-worksheet-generator crea ejercicios; aquí el resultado es papel técnico vacío con geometría y escala controladas.
- **Implementación en dispositivo:** SVG con unidades físicas y geometría pura; impresión/PDF bajo demanda con orientación, escala y márgenes comprobados. No cargar motores de conversión de otras herramientas.
- **Caso/aceptación específico:** Hoja con retícula de 5 mm y márgenes conocidos; comprobar tamaño físico del PDF, número de líneas y escala de impresión; evitar que el navegador ajuste sin avisar.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No crear una URL distinta para cada tamaño/color de cuadrícula.

#### NO035 · Medidor local de nivel de micrófono

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/microphone-level-meter/` (EN: `https://tools.usefulverse.com/tools/microphone-level-meter/`). Una misma ficha en 37 idiomas.
- **Demanda:** «desibelmåler», NO/nb, 1000/mes, KD 0. P2: gate técnico; B: 1.000–9.999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-14 03:07:36 +00:00.
- **Funciones obligatorias:** Nivel digital dBFS, pico/RMS, historial y calibración opcional con una referencia aportada; descarga CSV; parar y liberar el micrófono; advertencia visible si no está calibrado.
- **Longtails y modos de la misma URL:** «desibel måler»; «lydnivå måler»; «mikrofon nivå test».
- **Longtails con dato en esta investigación:** «desibel måler» 110/mes, KD 0 (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «lydnivå måler»; «mikrofon nivå test». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** decibel-calculator hace aritmética de niveles; voice-recorder graba. Aquí se analiza el nivel de una señal entrante en directo.
- **Implementación en dispositivo:** Web Audio/AudioWorklet o análisis por bloques; motor de efecto/medición con parámetros explícitos. Audio solo tras gesto, volumen prudente, stop/cancel y liberación de buffers/pistas; exportación WAV/formatos realmente soportados.
- **Caso/aceptación específico:** Señal digital de amplitud completa y silencio; relación RMS/dBFS correcta, desconexión/permiso denegado; sin calibración nunca etiquetar el resultado como dB SPL certificado.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No medidor certificado para salud, obra o cumplimiento. La demanda del término amplio no garantiza que el usuario acepte un medidor digital calibrable.

#### NO036 · Juego de dados tipo Yatzy y hoja de puntuación

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/dice-poker-game/` (EN: `https://tools.usefulverse.com/tools/dice-poker-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «yatzy», NO/nb, 2900/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 09:18:55 +00:00.
- **Funciones obligatorias:** Partida completa local, hasta tres tiradas, conservar dados, categorías, bonus y cierre; humano/CPU local y varios jugadores en un dispositivo; hoja de puntuación manual y exportación.
- **Longtails y modos de la misma URL:** «yatzy online»; «yatzy blokk»; «yatzy regler».
- **Longtails con dato en esta investigación:** «yatzy online» 720/mes, KD 36 (NO/nb, no-nb-overview); «yatzy blokk» 170/mes, KD 0 (NO/nb, no-nb-overview); «yatzy regler» 880/mes, KD 0 (NO/nb, no-ideas). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** random-number-generator no gestiona reglas, turnos, decisiones ni puntuación de esta partida.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Semillas reproducibles con póker/escalera/full; dados conservados intactos; casilla usada una vez, bonus correcto y fin tras todas las categorías; reparto cotidiano variado.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Arte y marca propios, sin copiar interfaces/activos de Yahtzee. Cero apuestas o dinero real.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO037 · Juego de lanzar burbujas

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/bubble-shooter/` (EN: `https://tools.usefulverse.com/tools/bubble-shooter/`). Una misma ficha en 37 idiomas.
- **Demanda:** «bubble shooter», NO/nb, 9900/mes, KD 58. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 07:02:50 +00:00.
- **Funciones obligatorias:** Puntería táctil/teclado, colisiones, grupos de color, piezas colgantes, puntuación y niveles; práctica y reto diario con semilla; pausa y nueva partida.
- **Longtails y modos de la misma URL:** «bubbleshooter»; «boblespill»; «bubble shooter gratis».
- **Longtails con dato en esta investigación:** «bubbleshooter» 9900/mes, KD 58 (NO/nb, no-nb-overview); «boblespill» 70/mes, KD 4 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «bubble shooter gratis». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** snake-game, 2048-game y mahjong-solitaire tienen reglas y entradas diferentes; no comparten esta intención de juego.
- **Implementación en dispositivo:** Canvas 2D y física de paso fijo desacoplada del dibujo; Pointer Events y teclado, rAF solo activo durante partida, pausa al ocultar. Niveles originales y colisiones verificadas con fixtures reproducibles.
- **Caso/aceptación específico:** Fixture de tres del mismo color, grupo que cae, rebote y derrota/victoria; que la generación produzca partidas jugables y no una imagen con botones sin física.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Motor y niveles originales, sin publicidad/popup que interrumpa la partida.

#### NO038 · Juego de adivinar palabras con pistas por letra

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/five-letter-word-game/` (EN: `https://tools.usefulverse.com/tools/five-letter-word-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «wordle norsk», NO/nb, 9900/mes, KD 0. P2: gate técnico; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 09:17:58 +00:00.
- **Funciones obligatorias:** Diccionario noruego licenciado, letras Æ/Ø/Å, pista por posición/presencia con control de repeticiones; modo diario y práctica; historial local, compartir resultado sin revelar solución.
- **Longtails y modos de la misma URL:** «ordspill fem bokstaver»; «wordle norsk»; «ordle».
- **Longtails con dato en esta investigación:** «wordle norsk» 9900/mes, KD 0 (NO/nb, no-nb-overview); «ordle» 201.000/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «ordspill fem bokstaver». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** word-puzzle-solver resuelve anagramas/patrones y hangman-game descubre letras; esta partida usa intentos de palabras completas con multiplicidad.
- **Implementación en dispositivo:** Corpus licenciado por lengua y motor determinista de pistas con control de letras repetidas; diccionario cargado bajo demanda. Modo diario con semilla/fecha y práctica variada; sin copiar soluciones del competidor.
- **Caso/aceptación específico:** Palabra con dos letras iguales frente a intento con una/tres; normalización Unicode, teclado táctil, palabra inexistente y cambio de día local; sin repetir siempre la misma solución.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** 201.000/mes de ordle se registran como competencia navegacional y no se usan como demanda propia. Nombre/arte/listas originales; no llamarse Ordle ni copiar su banco de respuestas.
- **Fuentes iniciales:** [DICTIONARIES](#fuentes-de-dictionaries). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO039 · Bridge de contrato contra jugadores locales de ordenador

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/bridge-game/` (EN: `https://tools.usefulverse.com/tools/bridge-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «bridge spill», NO/nb, 880/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 01:18:47 +00:00.
- **Funciones obligatorias:** Subasta, contrato, triunfo/sin triunfo, declarante/muerto y seguimiento de palo; puntuación de una modalidad declarada; tutorial y manos de práctica; CPU local con límites transparentes.
- **Longtails y modos de la misma URL:** «bridge kortspill»; «bridge online»; «lære bridge».
- **Longtails con dato en esta investigación:** «bridge kortspill» 390/mes, KD 3 (NO/nb, no-nb-overview); «bridge online» 320/mes, KD 64 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «lære bridge». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** spades-game usa otro sistema de contrato/puntuación; no hay subasta y muerto equivalentes en las herramientas actuales.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Manos prefijadas de subasta, muerto, obligación de asistir y contrato cumplido/fallado; vulnerabilidad y cierre; prohíbe jugadas ilegales y revela cartas según reglas.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Primero elegir y documentar modalidad/reglas completas. No simular juego online con otras personas si solo hay CPU local.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO040 · Farkle: dados y decisiones de riesgo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/farkle-dice-game/` (EN: `https://tools.usefulverse.com/tools/farkle-dice-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «farkle», NO/nb, 320/mes, KD 20. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 04:42:51 +00:00.
- **Funciones obligatorias:** Tirar, conservar combinaciones válidas, acumular o plantarse; reglas de entrada/objetivo configuradas; CPU local y hoja de resultados; deshacer solo en modo práctica.
- **Longtails y modos de la misma URL:** «farkle regler»; «terningspill 10000»; «farkle online».
- **Hipótesis semánticas sin cifra consultada:** «farkle regler»; «terningspill 10000»; «farkle online». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO036 rellena categorías por rondas; Farkle decide cuándo arriesgar una reserva de puntos con dados restantes.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Fixtures de 1/5, tríos, combinaciones múltiples, tirada sin puntos y dados calientes; conservar solo dados que puntúan; puntuación por modalidad declarada.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No contabilizar skins o variaciones de objetivo como herramientas nuevas.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO041 · Vri åtter / Crazy Eights

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/crazy-eights-card-game/` (EN: `https://tools.usefulverse.com/tools/crazy-eights-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «vri åtter», NO/nb, 1300/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 20:50:09 +00:00.
- **Funciones obligatorias:** Carta compatible por palo/rango, ochos y elección de palo, robo y final; CPU local o turnos compartidos; una variante inicial claramente documentada y variantes solo con reglas completas.
- **Longtails y modos de la misma URL:** «vri åtter regler»; «crazy eights»; «vri åtter online».
- **Hipótesis semánticas sin cifra consultada:** «vri åtter regler»; «crazy eights»; «vri åtter online». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** gin-rummy y solitaire tienen objetivos y legalidad diferentes; no se trata de generar cartas aleatorias.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Descartar ocho, elegir palo y obligar siguiente jugada; mazo agotado, última carta y jugada ilegal; puntuación final y reinicio.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No usar marca, baraja o apariencia de UNO; reglas clásicas y arte propio.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO042 · Idiot: juego noruego de descarte

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/idiot-card-game/` (EN: `https://tools.usefulverse.com/tools/idiot-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «idiot kortspill», NO/nb, 1000/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-17 03:18:30 +00:00.
- **Funciones obligatorias:** Cartas en mano, descubiertas y ocultas según variante elegida; turnos, cartas especiales, recoger montón y cierre; CPU local y tutorial visible.
- **Longtails y modos de la misma URL:** «idiot kortspill regler»; «idiot kortspill online»; «spille idiot».
- **Hipótesis semánticas sin cifra consultada:** «idiot kortspill regler»; «idiot kortspill online»; «spille idiot». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO041 es Crazy Eights, cuya legalidad se basa en palo/rango y ochos; Idiot tiene fases y recogida de montón distintas.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Escenarios de carta oculta inválida, recoger montón, cartas especiales y último jugador; conservación de las 52 cartas en cada transición.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Las reglas regionales varían: documentar una variante jugable, no mezclarlas accidentalmente.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO043 · President: descarte por rangos y rondas

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/president-card-game/` (EN: `https://tools.usefulverse.com/tools/president-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «kortspill president», NO/nb, 480/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 06:17:37 +00:00.
- **Funciones obligatorias:** Rondas con combinaciones de igual número de cartas, pasar, jerarquía de llegada e intercambio entre rondas cuando la variante lo use; CPU y varios jugadores locales.
- **Longtails y modos de la misma URL:** «president kortspill regler»; «president card game»; «president spill».
- **Hipótesis semánticas sin cifra consultada:** «president kortspill regler»; «president card game»; «president spill». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO042 usa montón y cartas ocultas, sin esta jerarquía e intercambio entre rondas; los juegos se validan por sus reglas distintas.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Pasar no cierra indebidamente la baza; combinación de tamaño equivocado se rechaza; final de ronda/asignación de roles e intercambio coherentes.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No contar variantes regionales del mismo juego como nuevas URLs.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO044 · Krig / War con resolución de empates

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/war-card-game/` (EN: `https://tools.usefulverse.com/tools/war-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «krig kortspill», NO/nb, 320/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 00:12:46 +00:00.
- **Funciones obligatorias:** Reparto, comparación, guerra en empate, animación controlable y velocidad; paso manual/automático, límite de seguridad con explicación y resolución de rondas.
- **Longtails y modos de la misma URL:** «krig kortspill regler»; «war card game»; «spille krig».
- **Hipótesis semánticas sin cifra consultada:** «krig kortspill regler»; «war card game»; «spille krig». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** Los juegos de bazas actuales no resuelven una partida automática por fuerza de cartas y guerras consecutivas.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Empate consecutivo y jugador sin cartas suficientes; ninguna carta se pierde/duplica; detectar ciclos/partidas largas sin afirmar victoria inventada.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Sin apuestas; permitir parar y reiniciar siempre, no bloquear CPU en ciclos largos.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO045 · Amerikaner: bazas con subasta noruega

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/amerikaner-card-game/` (EN: `https://tools.usefulverse.com/tools/amerikaner-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «amerikaner kortspill», NO/nb, 720/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 02:44:33 +00:00.
- **Funciones obligatorias:** Subasta y elección de compañero por carta según variante, triunfo, obligación de asistir, bazas y contrato; cuatro participantes con CPU local y registro de manos.
- **Longtails y modos de la misma URL:** «amerikaner regler»; «amerikaner kortspill online»; «spille amerikaner».
- **Hipótesis semánticas sin cifra consultada:** «amerikaner regler»; «amerikaner kortspill online»; «spille amerikaner». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** spades-game y NO039 Bridge tienen subasta/compañeros y puntuación diferentes; no reutilizar sus reglas bajo otro título.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Subasta, compañero revelado por carta, contrato cumplido/fallado y reparto igual; legalidad de triunfo/palo y puntuación contrastadas con las reglas elegidas.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Fuente de reglas específica noruega; completar partida, no solo una mesa que reparte cartas.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO046 · Gris / Pig de cuatro cartas iguales

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/pig-card-game/` (EN: `https://tools.usefulverse.com/tools/pig-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «gris kortspill», NO/nb, 590/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 20:42:32 +00:00.
- **Funciones obligatorias:** Pasar cartas para reunir cuatro iguales, señales/cierre de ronda y acumulación de penalización; modo CPU adecuado al navegador y reglas públicas de la variante.
- **Longtails y modos de la misma URL:** «gris kortspill regler»; «pig card game»; «spille gris».
- **Hipótesis semánticas sin cifra consultada:** «gris kortspill regler»; «pig card game»; «spille gris». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** memory-game compara parejas ocultas; este juego usa intercambio de una mano hasta reunir un rango completo.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Reparto y paso simultáneo conservan cartas; cuatro iguales dispara el estado final una sola vez; no dejar al usuario sin conocer que la ronda acabó.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Adaptar de forma explícita la señal física de mesa a una acción visible; no fingir interacción presencial.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO047 · Serpientes y escaleras

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/snakes-and-ladders/` (EN: `https://tools.usefulverse.com/tools/snakes-and-ladders/`). Una misma ficha en 37 idiomas.
- **Demanda:** «stigespill», NO/nb, 1000/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 10:42:32 +00:00.
- **Funciones obligatorias:** Tablero accesible, dado local, turnos con CPU/jugador compartido, escaleras y serpientes, final exacto configurable; tableros originales y velocidad de animación.
- **Longtails y modos de la misma URL:** «slange og stige»; «stigespill online»; «snakes and ladders».
- **Hipótesis semánticas sin cifra consultada:** «slange og stige»; «stigespill online»; «snakes and ladders». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** ludo-game usa salida de fichas, capturas y varias piezas; no equivale a este recorrido de una ficha y saltos.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Casillas de escalera/serpiente, exceso al llegar a meta y empate de turnos; semilla reproducible; teclado, movimiento reducido y nueva partida distinta.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No usar imágenes de tableros comerciales.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### NO048 · Pinball / flipper local

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/pinball-game/` (EN: `https://tools.usefulverse.com/tools/pinball-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «flipperspill», NO/nb, 590/mes, KD 4. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 16:18:43 +00:00.
- **Funciones obligatorias:** Física 2D con palas, lanzamiento, topes, bolas, puntuación y final; teclado/táctil, pausa, mute y modo de movimiento reducido compatible con las mecánicas.
- **Longtails y modos de la misma URL:** «pinball»; «flipper spill»; «pinball gratis».
- **Longtails con dato en esta investigación:** «pinball» 590/mes, KD 0 (NO/nb, no-nb-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «flipper spill»; «pinball gratis». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** Ninguna de las 600 usa esta mesa física de rebotes y palas; no es un skin de Snake ni de un puzzle de rejilla.
- **Implementación en dispositivo:** Canvas 2D y física de paso fijo desacoplada del dibujo; Pointer Events y teclado, rAF solo activo durante partida, pausa al ocultar. Niveles originales y colisiones verificadas con fixtures reproducibles.
- **Caso/aceptación específico:** Colisiones sin atravesar paredes a FPS bajo, ambas palas, caída de bola y reinicio; mismo estado con paso físico fijo independientemente de la tasa de dibujo.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Mesa, música y arte propios. Pausar en pestaña oculta y no reproducir audio antes del gesto de inicio.

#### NO049 · Práctica de mapas, países, banderas y regiones

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/geography-map-quiz/` (EN: `https://tools.usefulverse.com/tools/geography-map-quiz/`). Una misma ficha en 37 idiomas.
- **Demanda:** «geografi quiz», NO/nb, 1600/mes, KD 0. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-17 11:48:31 +00:00.
- **Funciones obligatorias:** Elegir mapa y modo, identificar países/banderas y regiones incluidas, práctica de fallos y progreso local; modos Noruega/Suiza como datasets del mismo producto cuando estén licenciados.
- **Longtails y modos de la misma URL:** «flagg quiz»; «europa quiz»; «norgeskart quiz»; «kantone schweiz quiz».
- **Longtails con dato en esta investigación:** «flagg quiz» 2900/mes, KD 0 (NO/nb, no-nb-overview); «europa quiz» 210/mes, KD 12 (NO/nb, no-nb-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «norgeskart quiz»; «kantone schweiz quiz». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** quiz-maker crea preguntas introducidas por el visitante; aquí hay corpus geográfico, mapa interactivo y progresión de aprendizaje ya preparados.
- **Implementación en dispositivo:** Corpus y mapas simplificados redistribuibles, IDs estables y validación por datos; SVG/Canvas accesible más alternativa por texto. Progreso opcional local y repaso de fallos, sin cuentas o ranking de servidor.
- **Caso/aceptación específico:** Respuesta por país/región se coteja con ID estable; nombres alternativos/locales, teclado, mapa pequeño y selección con pantalla táctil; no confundir bandera con código de idioma.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Un solo quiz geográfico; no contar otro nuevo para cantones suizos o cada continente. Verificar datos y licencias antes de distribuir.

#### NO050 · Shut the Box: dados y combinaciones

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/nb/tools/shut-the-box/` (EN: `https://tools.usefulverse.com/tools/shut-the-box/`). Una misma ficha en 37 idiomas.
- **Demanda:** «shut the box», NO/nb, 320/mes, KD 7. P1: empezar antes; C: 100–999. Fuente DataForSEO `no-nb-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-14 20:39:58 +00:00.
- **Funciones obligatorias:** Tirar, seleccionar casillas que suman el dado, estrategia de uno/dos dados según regla, puntuación y rondas; CPU opcional, tutorial y modo práctica.
- **Longtails y modos de la misma URL:** «shut the box regler»; «shut the box online»; «terningspill shut the box».
- **Hipótesis semánticas sin cifra consultada:** «shut the box regler»; «shut the box online»; «terningspill shut the box». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO036 usa categorías; NO040 reserva puntos de dados. Aquí se cierran casillas numéricas únicas que deben sumar la tirada.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Dado total 7 admite 7 o 3+4 si están libres; suma equivocada rechazada, sin jugadas posibles finaliza y todos cerrados reconoce victoria.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

### Fichas de Suiza

#### CH001 · Salario neto suizo con desglose de nómina

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-net-salary-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-net-salary-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «lohnrechner schweiz», CH/de, 9900/mes, KD 26. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 01:24:26 +00:00.
- **Funciones obligatorias:** Bruto, edad, cantón/régimen y cotizaciones; AVS/AI/APG/AC, pensión, seguros y retención cuando proceda; mensual/anual y 13ª paga proporcional dentro de la misma herramienta.
- **Longtails y modos de la misma URL:** «brutto netto rechner schweiz»; «salaire brut net suisse»; «calcolo stipendio netto svizzera».
- **Longtails con dato en esta investigación:** «brutto netto rechner schweiz» 6600/mes, KD 5 (CH/de, ch-de-overview); «salaire brut net suisse» 1300/mes, KD 10 (CH/fr, ch-fr-overview); «calcolo stipendio netto svizzera» 390/mes, KD 3 (CH/it, ch-it-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** salary-to-hourly-calculator convierte el bruto sin cotizaciones; CH002 calcula tributación anual, no el recibo de nómina.
- **Implementación en dispositivo:** Motor local por ejercicio y cantón, con datos de fuente primaria y fixtures; precisión decimal y política de redondeo por concepto. Bibliotecas matemáticas compartidas no convierten leyes distintas en un porcentaje universal.
- **Caso/aceptación específico:** Fixtures oficiales por edad y régimen, cuota patronal separada, techo de cotización y 12/13 pagas; no deducir renta anual ordinaria en nómina si no corresponde.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No crear URLs separadas para bruto/neto, 13ª paga y retención mensual. Tablas cantonales y año de cálculo explícitos.
- **Fuentes iniciales:** [CH-TAX](#fuentes-de-ch-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH002 · Impuesto anual suizo por cantón y municipio

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-income-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-income-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «steuerrechner schweiz», CH/de, 2900/mes, KD 31. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 09:53:57 +00:00.
- **Funciones obligatorias:** Renta/patrimonio imponibles y deducciones soportadas; familia, cantón, municipio e iglesia cuando aplique; desglose federal/cantonal/municipal y escenarios.
- **Longtails y modos de la misma URL:** «steuerrechner»; «calcul impôt suisse»; «calcolo imposte svizzera»; «vermögenssteuer berechnen».
- **Longtails con dato en esta investigación:** «steuerrechner» 8100/mes, KD 38 (CH/de, ch-de-overview); «calcul impôt suisse» 260/mes, KD 18 (CH/fr, ch-fr-overview); «calcolo imposte svizzera» 70/mes, KD 37 (CH/it, ch-it-overview); «vermögenssteuer berechnen» 70/mes, KD 35 (CH/de, ch-de-final). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** tax-calculator es IVA y CH001 nómina; esta ficha calcula el impuesto anual sobre bases imponibles y jurisdicción.
- **Implementación en dispositivo:** Motor local por ejercicio y cantón, con datos de fuente primaria y fixtures; precisión decimal y política de redondeo por concepto. Bibliotecas matemáticas compartidas no convierten leyes distintas en un porcentaje universal.
- **Caso/aceptación específico:** Fixtures ESTV de municipios y estados civiles; cambiar año, cantón y base manteniendo coherencia; evitar usar tipo marginal como tipo medio.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Alta complejidad de datos: si no se valida un municipio, no afirmar cobertura de toda Suiza. Integrar patrimonio como pestaña de este producto, no añadir otro contador.
- **Fuentes iniciales:** [CH-TAX](#fuentes-de-ch-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH003 · Renta estatal AVS/AHV suiza

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-ahv-pension-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-ahv-pension-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «ahv rente berechnen», CH/de, 3600/mes, KD 0. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 22:03:45 +00:00.
- **Funciones obligatorias:** Años cotizados, ingreso medio revalorizado aportado por usuario, créditos y situación familiar; jubilación anticipada/diferida solo en regímenes soportados; comparación y desglose.
- **Longtails y modos de la misma URL:** «ahv rechner»; «calcul rente avs»; «calcolo rendita avs».
- **Longtails con dato en esta investigación:** «ahv rechner» 720/mes, KD 1 (CH/de, ch-de-overview); «calcul rente avs» 720/mes, KD 0 (CH/fr, ch-fr-overview); «calcolo rendita avs» 170/mes, KD 0 (CH/it, ch-it-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** social-security-calculator usa AIME/SSA de EE.UU.; pension-calculator usa tasa de devengo genérica. AHV tiene reglas de carrera y topes propios.
- **Implementación en dispositivo:** Tablas/reglas locales por año/cantón cuando corresponda; separar elegibilidad asumida por el usuario, base, tipo, tope e importe. No llamar servicios de seguros ni de prestaciones.
- **Caso/aceptación específico:** Casos oficiales AVS de carrera completa/incompleta, mínimo/máximo y límites de pareja; régimen transitorio por año de nacimiento; nunca estimar carrera desde un único salario actual.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No sustituye el extracto individual ni previsión oficial de la caja.
- **Fuentes iniciales:** [CH-BSV](#fuentes-de-ch-bsv), [CH-EMPLOY](#fuentes-de-ch-employ). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH004 · Pilar 3a: aportación y ahorro fiscal

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-pillar-3a-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-pillar-3a-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «säule 3a rechner», CH/de, 210/mes, KD 4. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 23:38:56 +00:00.
- **Funciones obligatorias:** Aportación, afiliación previsional, renta imponible y cantón soportado; límite y diferencia de cuota con/sin aportación; escenarios de ahorro sin recomendar un producto bancario.
- **Longtails y modos de la misma URL:** «säule 3a steuerersparnis»; «3a steuerersparnis rechner»; «steuerersparnis 3a rechner».
- **Longtails con dato en esta investigación:** «säule 3a steuerersparnis» 140/mes, KD 6 (CH/de, ch-de-overview); «steuerersparnis 3a rechner» 10/mes, KD — (CH/de, ch-de-final). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «3a steuerersparnis rechner». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** compound-interest-calculator no impone límites 3a ni calcula diferencia fiscal; CH002 se reutiliza como biblioteca, no como página duplicada.
- **Implementación en dispositivo:** Motor local por ejercicio y cantón, con datos de fuente primaria y fixtures; precisión decimal y política de redondeo por concepto. Bibliotecas matemáticas compartidas no convierten leyes distintas en un porcentaje universal.
- **Caso/aceptación específico:** Con tasa marginal sintética 20%, deducción admitida 1.000 → diferencia orientativa 200 en modelo lineal; el resultado real se calcula por diferencia de cuotas oficiales, no solo multiplicación.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Depende de las tablas y fixtures fiscales de CH002. Si no existen, solo modo manual claramente etiquetado, sin prometer estimación cantonal.
- **Fuentes iniciales:** [CH-TAX](#fuentes-de-ch-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH005 · Pensión ocupacional LPP/BVG suiza

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-bvg-pension-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-bvg-pension-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «bvg rechner», CH/de, 140/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 13:57:13 +00:00.
- **Funciones obligatorias:** Sueldo asegurado, deducción de coordinación, edad, tipo de plan e interés hipotético; aportaciones y capital mínimo acumulado; proyección y conversión con hipótesis visibles.
- **Longtails y modos de la misma URL:** «pensionskasse berechnen»; «calcul lpp»; «calcolo lpp».
- **Longtails con dato en esta investigación:** «pensionskasse berechnen» 110/mes, KD 0 (CH/de, ch-de-overview); «calcul lpp» 110/mes, KD 0 (CH/fr, ch-fr-overview); «calcolo lpp» 40/mes, KD 13 (CH/it, ch-it-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** pension-calculator modela salario × años × devengo; BVG acumula un capital coordinado con reglas de cotización específicas.
- **Implementación en dispositivo:** Tablas/reglas locales por año/cantón cuando corresponda; separar elegibilidad asumida por el usuario, base, tipo, tope e importe. No llamar servicios de seguros ni de prestaciones.
- **Caso/aceptación específico:** Fixtures oficiales de acceso/coordination/edades; parte obligatoria y sobreobligatoria separadas; tasa de conversión no se aplica al saldo equivocado.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No inferir condiciones de una caja privada; permitir introducir las del certificado personal localmente.
- **Fuentes iniciales:** [CH-BSV](#fuentes-de-ch-bsv), [CH-EMPLOY](#fuentes-de-ch-employ). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH006 · Fiscalidad suiza del rescate de capital previsional

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-pension-withdrawal-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-pension-withdrawal-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «kapitalauszahlungssteuer rechner», CH/de, 260/mes, KD 6. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 04:27:22 +00:00.
- **Funciones obligatorias:** Capital retirado, año, cantón/municipio, estado civil y rescates concurrentes; comparar rescate único/escalonado si la norma aplicable lo permite; mostrar tributos separados.
- **Longtails y modos de la misma URL:** «kapitalbezugssteuer rechner»; «kapitalleistungssteuer rechner»; «calcul impôt retrait 3eme pilier».
- **Longtails con dato en esta investigación:** «kapitalbezugssteuer rechner» 40/mes, KD — (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «kapitalleistungssteuer rechner»; «calcul impôt retrait 3eme pilier». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** CH003/CH005 estiman rentas/capital acumulado; aquí se calcula el impuesto específico al rescatarlo, que no usa el régimen ordinario de renta.
- **Implementación en dispositivo:** Motor local por ejercicio y cantón, con datos de fuente primaria y fixtures; precisión decimal y política de redondeo por concepto. Bibliotecas matemáticas compartidas no convierten leyes distintas en un porcentaje universal.
- **Caso/aceptación específico:** Fixtures ESTV para capitales en cada tramo y agregación de rescates en el mismo periodo; cambiar fecha o cantón no conserva tasas incorrectas.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Escalonamiento solo como escenario matemático con restricciones legales comprobadas; no consejo personal de elusión.
- **Fuentes iniciales:** [CH-TAX](#fuentes-de-ch-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH007 · Franquicia del seguro de salud suizo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-health-deductible-comparator/` (EN: `https://tools.usefulverse.com/tools/switzerland-health-deductible-comparator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «franchise rechner», CH/de, 70/mes, KD 0. P3: reserva demanda; D: <100. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 13:55:58 +00:00.
- **Funciones obligatorias:** Primas introducidas por el usuario para franquicias legales, gastos médicos previstos y participación; coste anual total, umbrales de cruce y sensibilidad; adultos/menores solo si las reglas están verificadas.
- **Longtails y modos de la misma URL:** «krankenkasse franchise rechner»; «franchise berechnen»; «calcul franchise assurance maladie».
- **Longtails con dato en esta investigación:** «krankenkasse franchise rechner» 30/mes, KD 16 (CH/de, ch-de-overview); «franchise berechnen» 30/mes, KD 0 (CH/de, ch-de-overview); «calcul franchise assurance maladie» 10/mes, KD — (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** household-budget-planner solo registra gastos; esta ficha compara estructuras legales de prima, franquicia y copago.
- **Implementación en dispositivo:** Tablas/reglas locales por año/cantón cuando corresponda; separar elegibilidad asumida por el usuario, base, tipo, tope e importe. No llamar servicios de seguros ni de prestaciones.
- **Caso/aceptación específico:** Gasto cero, igual a franquicia, superior al tope de copago y escenarios de edad; comparar con Priminfo; no cobrar copago sobre el tramo aún cubierto por franquicia.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** 70/mes exactos: reserva de demanda pequeña pero uso local claro. No fingir una comparación en directo de todas las aseguradoras.
- **Fuentes iniciales:** [CH-HEALTH](#fuentes-de-ch-health). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH008 · Reducción cantonal de primas de seguro

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-premium-subsidy-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-premium-subsidy-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «prämienverbilligung rechner», CH/de, 170/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 14:56:29 +00:00.
- **Funciones obligatorias:** Cantón, hogar, renta y patrimonio de referencia, edad y prima pertinente; banda/importe según reglas de los cantones soportados; documentación y plazos visibles.
- **Longtails y modos de la misma URL:** «prämienverbilligung berechnen»; «réduction primes calculateur»; «ip v anspruch».
- **Hipótesis semánticas sin cifra consultada:** «prämienverbilligung berechnen»; «réduction primes calculateur»; «ip v anspruch». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** CH007 compara franquicias y gastos; aquí se estima una ayuda pública que depende de hogar/cantón, no la franquicia óptima.
- **Implementación en dispositivo:** Tablas/reglas locales por año/cantón cuando corresponda; separar elegibilidad asumida por el usuario, base, tipo, tope e importe. No llamar servicios de seguros ni de prestaciones.
- **Caso/aceptación específico:** Casos oficiales de cada cantón publicado; umbral de renta, menor/adulto, familia y exclusiones. Sin regla verificada para un cantón, mostrarlo como no cubierto.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Solo publicar cantones con datos y licencia completos; no llenar los otros con una regla nacional ficticia.
- **Fuentes iniciales:** [CH-HEALTH](#fuentes-de-ch-health), [CH-BSV](#fuentes-de-ch-bsv). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH009 · Prestación de desempleo suiza

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-unemployment-benefit-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-unemployment-benefit-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «arbeitslosengeld rechner schweiz», CH/de, 320/mes, KD 3. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 09:27:20 +00:00.
- **Funciones obligatorias:** Salario asegurado, jornada, cargas familiares, periodo cotizado y límites; diaria, mensual orientativa y duración; desglosar carencias/deducciones soportadas.
- **Longtails y modos de la misma URL:** «arbeitslosenkasse rechner»; «taggeld rechner»; «calcolo disoccupazione svizzera».
- **Longtails con dato en esta investigación:** «taggeld rechner» 10/mes, KD — (CH/de, ch-de-overview); «calcolo disoccupazione svizzera» 10/mes, KD — (CH/it, ch-it-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «arbeitslosenkasse rechner». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO007 tiene legislación y ámbito noruegos; severance-pay-calculator estima indemnización, no seguro de desempleo suizo.
- **Implementación en dispositivo:** Tablas/reglas locales por año/cantón cuando corresponda; separar elegibilidad asumida por el usuario, base, tipo, tope e importe. No llamar servicios de seguros ni de prestaciones.
- **Caso/aceptación específico:** Fixtures SECO/RAV de tipos y topes; meses de distinta duración, carencias y empleo parcial; distinguir días indemnizables de días naturales.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No decidir elegibilidad ni presentar solicitudes. Identidad de mercado/legislación en title, H1 y explicación.
- **Fuentes iniciales:** [CH-BSV](#fuentes-de-ch-bsv), [CH-EMPLOY](#fuentes-de-ch-employ). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH010 · Ajuste del alquiler por tipo de referencia suizo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-rent-adjustment-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-rent-adjustment-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «mietzinsrechner», CH/de, 1300/mes, KD 11. P2: datos/normativa; B: 1.000–9.999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 09:46:23 +00:00.
- **Funciones obligatorias:** Renta base, tipo de referencia contractual/actual, inflación y costes admitidos; desglose de subida/bajada y fecha pertinente; borrador de solicitud local con datos opcionales.
- **Longtails y modos de la misma URL:** «referenzzinssatz rechner»; «mietzinssenkung rechner»; «calcul baisse de loyer».
- **Longtails con dato en esta investigación:** «referenzzinssatz rechner» 170/mes, KD 0 (CH/de, ch-de-overview); «mietzinssenkung rechner» 20/mes, KD — (CH/de, ch-de-overview); «calcul baisse de loyer» 90/mes, KD 41 (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** rent-vs-buy-calculator compara compra/alquiler; aquí se revisa una renta contractual según un tipo de referencia regulado.
- **Implementación en dispositivo:** Cálculo local con reglas/fechas de contrato y fuentes jurídicas públicas. No enviar cartas ni datos, ni inferir condiciones contractuales ausentes. La exportación es un borrador editable.
- **Caso/aceptación específico:** Reproducir ejemplos BWO de cambio del tipo y compensación por otros costes; base sin componentes variables, contrato indexado no soportado y tasa igual.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** BWO señala que no se usa sin más el tipo director del banco central. Distinguir cálculo orientativo de derecho jurídicamente reconocido.
- **Fuentes iniciales:** [CH-RENT](#fuentes-de-ch-rent). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH011 · Vacaciones proporcionales y saldo por contrato

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/vacation-entitlement-calculator/` (EN: `https://tools.usefulverse.com/tools/vacation-entitlement-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «ferienrechner», CH/de, 390/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 18:56:05 +00:00.
- **Funciones obligatorias:** Derecho anual, fecha de entrada/salida, jornada y ausencias; vacaciones proporcionales, tomadas y saldo; separar días de vacaciones de días naturales; perfiles legales solo si están documentados.
- **Longtails y modos de la misma URL:** «ferienanspruch berechnen»; «ferienguthaben berechnen»; «calcul vacances prorata».
- **Longtails con dato en esta investigación:** «ferienanspruch berechnen» 70/mes, KD 0 (CH/de, ch-de-overview); «ferienguthaben berechnen» 50/mes, KD 3 (CH/de, ch-de-final); «calcul vacances prorata» 10/mes, KD — (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** business-days-calculator cuenta calendario; NO004 calcula dinero de feriepenger. Esta ficha calcula derecho y saldo de días laborales de vacaciones.
- **Implementación en dispositivo:** Aritmética de derechos/fechas civil, derecho contractual y perfil legal versionado; exportación CSV/ICS/impresión cuando aporte valor. No basar calendario en el idioma de la interfaz.
- **Caso/aceptación específico:** Derecho sintético 24 días/año y medio año completo → 12 antes de reglas de redondeo; jornada de cuatro días, cambio de contrato y saldo negativo; fixtures suizos.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Un único producto con perfiles; no una URL para cada porcentaje de jornada.
- **Fuentes iniciales:** [CH-LAW](#fuentes-de-ch-law). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH012 · Plazos y carta de finalización de alquiler suizo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-tenancy-notice-planner/` (EN: `https://tools.usefulverse.com/tools/switzerland-tenancy-notice-planner/`). Una misma ficha en 37 idiomas.
- **Demanda:** «kündigung mietvertrag vorlage», CH/de, 320/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 00:28:51 +00:00.
- **Funciones obligatorias:** Contrato y fecha de recepción objetivo, plazo pactado, fechas admitidas y reglas cantonales soportadas; calendario de vencimientos y carta editable; advertir recepción frente a envío.
- **Longtails y modos de la misma URL:** «kündigungsfrist rechner»; «mietvertrag kündigen frist»; «calcul délai résiliation».
- **Hipótesis semánticas sin cifra consultada:** «kündigungsfrist rechner»; «mietvertrag kündigen frist»; «calcul délai résiliation». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** business-letter-generator redacta cartas genéricas y date-calculator suma días; aquí se valida una secuencia contractual específica de recepción/plazo/fecha.
- **Implementación en dispositivo:** Cálculo local con reglas/fechas de contrato y fuentes jurídicas públicas. No enviar cartas ni datos, ni inferir condiciones contractuales ausentes. La exportación es un borrador editable.
- **Caso/aceptación específico:** Fixtures de fin de mes, año bisiesto, recepción tarde, festivo y firma conjunta; no inferir el plazo solo por la ciudad; carta exportada coincide con las fechas calculadas.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Depende de contrato y jurisdicción; no presentar el borrador como asesoría o entrega certificada.
- **Fuentes iniciales:** [CH-LAW](#fuentes-de-ch-law), [CH-RENT](#fuentes-de-ch-rent). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH013 · Impuesto suizo sobre plusvalía inmobiliaria

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-property-gains-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-property-gains-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «grundstückgewinnsteuer rechner», CH/de, 140/mes, KD 9. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 08:38:49 +00:00.
- **Funciones obligatorias:** Compra, venta, inversiones/costes admitidos, duración y cantón; ganancia imponible y cuota; exención/diferimiento solo con regla contrastada.
- **Longtails y modos de la misma URL:** «grundstückgewinnsteuer berechnen»; «calcul gains immobiliers»; «calcolo imposta utile immobiliare».
- **Hipótesis semánticas sin cifra consultada:** «grundstückgewinnsteuer berechnen»; «calcul gains immobiliers»; «calcolo imposta utile immobiliare». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** roi-cagr-calculator mide rendimiento y rental-yield-calculator rentabilidad del alquiler; ninguna calcula tributación inmobiliaria cantonal.
- **Implementación en dispositivo:** Motor local por ejercicio y cantón, con datos de fuente primaria y fixtures; precisión decimal y política de redondeo por concepto. Bibliotecas matemáticas compartidas no convierten leyes distintas en un porcentaje universal.
- **Caso/aceptación específico:** Fixtures de cada cantón que se ofrezca; ganancia cero/pérdida, duración a ambos lados de un umbral y gasto no admitido; desglose reproducible.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Tablas cantonales/licencia verificadas; no prometer cobertura completa de los 26 cantones por extrapolación.
- **Fuentes iniciales:** [CH-TAX](#fuentes-de-ch-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH014 · Impuesto suizo de herencias y donaciones

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-inheritance-gift-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-inheritance-gift-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «erbschaftssteuer rechner», CH/de, 30/mes, KD —. P3: reserva demanda; D: <100. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 05:57:39 +00:00.
- **Funciones obligatorias:** Cantón, parentesco, importe y modalidad; franquicias, exenciones y tramos; desglose y comparación de casos con reglas de vigencia explícitas.
- **Longtails y modos de la misma URL:** «schenkungssteuer rechner»; «calcul impôt succession»; «inheritance tax switzerland calculator».
- **Longtails con dato en esta investigación:** «schenkungssteuer rechner» 30/mes, KD 11 (CH/de, ch-de-overview); «calcul impôt succession» 10/mes, KD — (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «inheritance tax switzerland calculator». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** net-worth-calculator suma patrimonio; aquí se aplica una norma cantonal a una transmisión por causa/parentesco específicos.
- **Implementación en dispositivo:** Motor local por ejercicio y cantón, con datos de fuente primaria y fixtures; precisión decimal y política de redondeo por concepto. Bibliotecas matemáticas compartidas no convierten leyes distintas en un porcentaje universal.
- **Caso/aceptación específico:** Fixtures oficiales de parentesco exento/no exento, misma cantidad en dos cantones y frontera de tramo; no inventar un impuesto federal uniforme.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** 30/mes en la consulta exacta: reserva, no expansión prioritaria por volumen.
- **Fuentes iniciales:** [CH-TAX](#fuentes-de-ch-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH015 · Presupuesto de manutención suizo por método documentado

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-child-support-budget-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-child-support-budget-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «unterhalt berechnen schweiz», CH/de, 110/mes, KD 0. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-final`, consultada 15-oct-2026; última actualización informada: 2026-09-14 01:20:36 +00:00.
- **Funciones obligatorias:** Ingresos netos, necesidades admitidas, hijos/custodia y método judicial declarado; mínimos, superávit y escenarios; desglosar supuestos y evitar una cifra aparentemente universal.
- **Longtails y modos de la misma URL:** «unterhaltsrechner schweiz»; «kindesunterhalt rechner schweiz»; «calcul pension alimentaire suisse».
- **Longtails con dato en esta investigación:** «unterhaltsrechner schweiz» 70/mes, KD 0 (CH/de, ch-de-overview); «kindesunterhalt rechner schweiz» 10/mes, KD — (CH/de, ch-de-overview); «calcul pension alimentaire suisse» 30/mes, KD 38 (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** NO009 utiliza reglas NAV de Noruega; household-budget-planner no calcula reparto de manutención conforme a un método jurídico.
- **Implementación en dispositivo:** Cálculo local con reglas/fechas de contrato y fuentes jurídicas públicas. No enviar cartas ni datos, ni inferir condiciones contractuales ausentes. La exportación es un borrador editable.
- **Caso/aceptación específico:** Casos oficiales/documentados de método y cantón; insuficiencia de ingresos, custodia y varios hijos; números de gastos importados no se clasifican solos.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Gate jurídico fuerte: si no hay un método público reproducible aplicable, mantener la candidata en reserva; no vender cálculo legal exacto.
- **Fuentes iniciales:** [CH-LAW](#fuentes-de-ch-law), [CH-RENT](#fuentes-de-ch-rent). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH016 · Validador de formato y dígito de UID/CHE

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/swiss-uid-validator/` (EN: `https://tools.usefulverse.com/tools/swiss-uid-validator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «uid nummer prüfen», CH/de, 140/mes, KD 23. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 12:49:49 +00:00.
- **Funciones obligatorias:** Normalizar CHE/UID, comprobar estructura y checksum, y dar ejemplo sintético; pegar lista y CSV; distinguir UID de un número IVA activo.
- **Longtails y modos de la misma URL:** «mwst nummer prüfen»; «uid validator schweiz»; «che nummer prüfen».
- **Longtails con dato en esta investigación:** «mwst nummer prüfen» 30/mes, KD 48 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «uid validator schweiz»; «che nummer prüfen». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** iban-validator y file-checksum usan estándares diferentes. Esta ficha valida un identificador mercantil suizo, no una cuenta bancaria.
- **Implementación en dispositivo:** Motor de tokens/patrones/diccionarios en JS o WASM licenciado y diferido por idioma técnico. Renderizar texto inerte; sin eval, modelo remoto o traducción en cada visita.
- **Caso/aceptación específico:** Fixtures oficiales de checksum correcto/incorrecto, prefijos, espacios y lote; no llamar válida a una empresa solo porque el dígito coincide.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Sin consulta al registro ni afirmación de alta fiscal/identidad. Verificar algoritmo oficial antes de programar.
- **Fuentes iniciales:** [CH-UID](#fuentes-de-ch-uid). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH017 · QR-factura suiza con validación de referencia

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/swiss-qr-bill-generator/` (EN: `https://tools.usefulverse.com/tools/swiss-qr-bill-generator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «qr rechnung erstellen», CH/de, 2900/mes, KD 37. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 05:17:39 +00:00.
- **Funciones obligatorias:** IBAN/QR-IBAN, referencias QRR/SCOR, moneda, importe y direcciones estructuradas; sección de pago y recibo imprimibles; leer/validar el contenido de una factura local como función del mismo producto.
- **Longtails y modos de la misma URL:** «qr rechnung generator»; «qr rechnung kostenlos»; «générateur qr facture»; «fattura qr gratis».
- **Longtails con dato en esta investigación:** «qr rechnung generator» 210/mes, KD 34 (CH/de, ch-de-overview); «générateur qr facture» 110/mes, KD 0 (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «qr rechnung kostenlos»; «fattura qr gratis». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** qr-code-generator solo codifica texto; invoice-generator crea una factura simple. Ninguna genera la estructura bancaria Swiss QR-bill ni valida sus referencias.
- **Implementación en dispositivo:** Construir/validar payload Swiss QR-bill y PDF según la versión SIX vigente; QR y comprobaciones locales. No abrir una transferencia ni usar un proveedor de pagos para generar un documento.
- **Caso/aceptación específico:** Fixtures SIX de QRR/SCOR, cuenta incompatible, checksum, dirección y caracteres; decodificar el QR exportado y validar todo su payload; PDF con medidas físicas correctas.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Verificar versión vigente y transición: SIX publica cambio para 13-nov-2026. No afirmar certificación bancaria sin evidencia ni ejecutar pagos.
- **Fuentes iniciales:** [SWISS-QR](#fuentes-de-swiss-qr). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH018 · Conversor geográfico LV95/LV03, WGS84 y UTM

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/geographic-coordinate-converter/` (EN: `https://tools.usefulverse.com/tools/geographic-coordinate-converter/`). Una misma ficha en 37 idiomas.
- **Demanda:** «koordinaten umrechnen», CH/de, 390/mes, KD 17. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 17:45:30 +00:00.
- **Funciones obligatorias:** Latitud/longitud en decimal y DMS, coordenadas suizas LV95/LV03 y UTM con zona; conversión individual/lote y CSV; mostrar CRS, datum y precisión de la transformación.
- **Longtails y modos de la misma URL:** «schweizer koordinaten umrechnen»; «lv95 lv03 umrechnen»; «conversion coordonnées suisses».
- **Longtails con dato en esta investigación:** «schweizer koordinaten umrechnen» 170/mes, KD 8 (CH/de, ch-de-overview); «lv95 lv03 umrechnen» —/mes, KD — (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «conversion coordonnées suisses». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** coordinate-geometry-calculator trabaja geometría cartesiana, distancias/pendientes; aquí se transforman sistemas de referencia de la Tierra.
- **Implementación en dispositivo:** Proyecciones/fórmulas oficiales y librería local como Proj4js evaluada por versión/licencia; rejillas bajo demanda solo si son necesarias para la precisión anunciada. Las coordenadas no se envían a un servicio de transformación.
- **Caso/aceptación específico:** Puntos de control swisstopo y EPSG publicados; hemisferio/zona, signo y orden de ejes; ida/vuelta con tolerancia definida, no convertir metros a grados con una constante.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Biblioteca/proyecciones y rejillas solo si licencia y tamaño lo permiten. No prometer exactitud topográfica certificada.
- **Fuentes iniciales:** [SWISS-GEO](#fuentes-de-swiss-geo). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH019 · Desplazamiento y holgura de llantas

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/wheel-offset-clearance-calculator/` (EN: `https://tools.usefulverse.com/tools/wheel-offset-clearance-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «et rechner», CH/de, 320/mes, KD 5. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-10-15 05:41:36 +00:00.
- **Funciones obligatorias:** Anchura/ET de rueda actual y nueva, separadores y unidades; cambio de borde interior/exterior y línea central; esquema y comparación; neumático solo como dato geométrico auxiliar.
- **Longtails y modos de la misma URL:** «felgen et rechner»; «einpresstiefe rechner»; «calcul déport jante».
- **Longtails con dato en esta investigación:** «felgen et rechner» 90/mes, KD 7 (CH/de, ch-de-overview); «einpresstiefe rechner» 50/mes, KD 9 (CH/de, ch-de-overview); «calcul déport jante» 10/mes, KD — (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** tire-size-calculator compara diámetro, flanco y velocidad del neumático; sus controles no incluyen ancho de llanta/ET ni holgura interior.
- **Implementación en dispositivo:** Geometría y conversiones físicas en funciones puras, esquema SVG con medidas y resultado copiable. Pruebas de ida/vuelta y tolerancias numéricas; sin inferir homologación o seguridad mecánica.
- **Caso/aceptación específico:** Misma anchura con ET aumentado 10 mm → centro 10 mm hacia dentro; variar anchura y separador por separado; mm/pulgadas y redondeo consistente.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Resultado geométrico, no aprobación de compatibilidad mecánica/legal del vehículo.

#### CH020 · Escalas de planos y ajuste de impresión

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/scale-drawing-calculator/` (EN: `https://tools.usefulverse.com/tools/scale-drawing-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «maßstab rechner», CH/de, 590/mes, KD 1. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 15:39:35 +00:00.
- **Funciones obligatorias:** Escala 1:n, distancia real/dibujo, unidades y escala nueva; factor de ampliación para imprimir, barra de escala y hoja de comprobación; varias medidas en tabla.
- **Longtails y modos de la misma URL:** «maßstab berechnen»; «massstab rechner»; «calcul échelle».
- **Longtails con dato en esta investigación:** «maßstab berechnen» 480/mes, KD 0 (CH/de, ch-de-overview); «calcul échelle» 40/mes, KD — (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «massstab rechner». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** ratio-proportion-calculator maneja proporciones generales y screen-ruler mide pantalla; aquí hay escala física de dibujo, impresión y calibración.
- **Implementación en dispositivo:** Geometría y conversiones físicas en funciones puras, esquema SVG con medidas y resultado copiable. Pruebas de ida/vuelta y tolerancias numéricas; sin inferir homologación o seguridad mecánica.
- **Caso/aceptación específico:** 1:100 y 10 mm en papel → 1 m real; pasar de 1:100 a 1:50 → 200%; rechazar denominador cero y conservar relaciones al invertir.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Conservar esta intención de plano/impresión; no crear otra página genérica de ratios.

#### CH021 · Escala de notas de examen a partir de puntos

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/grade-scale-generator/` (EN: `https://tools.usefulverse.com/tools/grade-scale-generator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «notenrechner punkte», CH/de, 720/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 10:49:15 +00:00.
- **Funciones obligatorias:** Puntos máximos/obtenidos, notas mínima/máxima, umbral de aprobado, redondeo y curva declarada; tabla completa imprimible y conversión de puntos; presets suizos explicados.
- **Longtails y modos de la misma URL:** «notenskala rechner»; «noten berechnen punkte»; «calcul note points».
- **Longtails con dato en esta investigación:** «noten berechnen punkte» 110/mes, KD 0 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «notenskala rechner»; «calcul note points». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** gpa-calculator promedia letras con créditos; average-calculator promedia números. Aquí el profesor define una escala puntos→nota y genera su tabla.
- **Implementación en dispositivo:** Funciones puras de escala/tramos y redondeo, tabla generada y exportable; presets explícitos y configurables. El idioma no cambia la fórmula ni las notas.
- **Caso/aceptación específico:** Escala sintética lineal 1–6: 0/100→1, 60/100→4, 100/100→6; tabla monótona y umbral/redondeo coherentes; no convertir un GPA universitario en esta escala por regla de tres.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** La consulta amplia notenrechner schweiz puede buscar promedios; no atribuir sus 5.400 búsquedas a esta intención concreta de 720.

#### CH022 · Separación silábica y guiones de maquetación

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/word-hyphenation-tool/` (EN: `https://tools.usefulverse.com/tools/word-hyphenation-tool/`). Una misma ficha en 37 idiomas.
- **Demanda:** «silbentrennung», CH/de, 1300/mes, KD 8. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 09:11:42 +00:00.
- **Funciones obligatorias:** Idioma y diccionario de separación, palabras individuales/texto, guiones visibles o blandos y copia sin caracteres invisibles; ejemplos y casos excluidos.
- **Longtails y modos de la misma URL:** «silben trennen»; «worttrennung»; «séparer syllabes».
- **Longtails con dato en esta investigación:** «silben trennen» 1300/mes, KD 44 (CH/de, ch-de-overview); «séparer syllabes» 10/mes, KD — (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «worttrennung». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** word-counter cuenta unidades y readability-checker evalúa dificultad; aquí se obtienen puntos legales de guionado para composición de texto.
- **Implementación en dispositivo:** Motor de tokens/patrones/diccionarios en JS o WASM licenciado y diferido por idioma técnico. Renderizar texto inerte; sin eval, modelo remoto o traducción en cada visita.
- **Caso/aceptación específico:** Corpus oficial del patrón de guionado elegido; palabras compuestas, Unicode y soft hyphen; quitar guiones devuelve el texto inicial, sin prometer análisis fonológico universal.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Patrones/diccionarios por idioma bajo demanda y licencia propia. La interfaz traducida no significa que se soporte automáticamente la silabificación de 37 lenguas.
- **Fuentes iniciales:** [DICTIONARIES](#fuentes-de-dictionaries). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH023 · Punto de rocío y mezcla de humedad del aire

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/dew-point-humidity-calculator/` (EN: `https://tools.usefulverse.com/tools/dew-point-humidity-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «taupunkt berechnen», CH/de, 390/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 14:41:26 +00:00.
- **Funciones obligatorias:** Temperatura, humedad relativa y unidades; punto de rocío, humedad absoluta y gráfico; comparar superficie con punto de rocío para explicar condensación sin diagnosticar moho.
- **Longtails y modos de la misma URL:** «taupunktrechner»; «luftfeuchtigkeit rechner»; «calcul point rosée».
- **Longtails con dato en esta investigación:** «taupunktrechner» 110/mes, KD 0 (CH/de, ch-de-overview); «luftfeuchtigkeit rechner» 30/mes, KD 8 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «calcul point rosée». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** pressure-calculator calcula presión y heat-loss-calculator pérdidas térmicas; ninguna implementa propiedades psicrométricas del aire.
- **Implementación en dispositivo:** Modelo físico/químico declarado y rango de validez, unidades estrictas y explicación de variables. Rechazar combinaciones imposibles y no aplicar fórmulas fuera de dominio.
- **Caso/aceptación específico:** A humedad relativa 100%, punto de rocío ≈ temperatura; fixtures de referencia, Celsius/Fahrenheit y dominio del modelo; humedad negativa o >100 se rechaza.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Fórmula y rango declarados; separar cálculo de propiedades de una recomendación de ingeniería.

#### CH024 · Carta natal y ascendente como entretenimiento

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/natal-chart-calculator/` (EN: `https://tools.usefulverse.com/tools/natal-chart-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «aszendent berechnen», CH/de, 12.100/mes, KD 13. P1: empezar antes; A: ≥10.000. Fuente DataForSEO `ch-de-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-14 00:20:26 +00:00.
- **Funciones obligatorias:** Fecha, hora, zona horaria y coordenadas introducidas; ascendente y posiciones astronómicas con biblioteca licenciada; carta SVG y explicación de cada hipótesis; sin predicciones personales.
- **Longtails y modos de la misma URL:** «aszendent rechner»; «geburtshoroskop berechnen»; «mondzeichen berechnen».
- **Longtails con dato en esta investigación:** «aszendent rechner» 170/mes, KD 45 (CH/de, ch-de-extra); «geburtshoroskop berechnen» 390/mes, KD 16 (CH/de, ch-de-extra); «mondzeichen berechnen» 880/mes, KD 14 (CH/de, ch-de-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** sunrise-sunset-calculator y moon-phase-calculator no calculan una carta de posiciones/ascendente para una hora natal.
- **Implementación en dispositivo:** Biblioteca astronómica local redistribuible evaluada, conversión de hora/zona y geometría con fixtures independientes; SVG de carta generado. Separar datos astronómicos y explicación recreativa, sin LLM.
- **Caso/aceptación específico:** Fixtures astronómicos contrastados con fuente independiente; DST, hemisferio y hora desconocida; no calcular ascendente preciso si falta hora/ubicación.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Uso de entretenimiento; no presentar astrología como ciencia ni dar decisiones sanitarias/financieras. Cálculo local y datos de nacimiento sin envío.
- **Fuentes iniciales:** [LOCAL-ASTRO](#fuentes-de-local-astro). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH025 · Numerología recreativa con explicación del algoritmo

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/numerology-calculator/` (EN: `https://tools.usefulverse.com/tools/numerology-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «numerologie rechner», CH/de, 590/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-13 06:11:05 +00:00.
- **Funciones obligatorias:** Fecha o nombre opcional, sistema de reducción numérica declarado, pasos y resultados; reglas de diacríticos y números maestros documentadas; exportación local sin guardar nombres.
- **Longtails y modos de la misma URL:** «lebenszahl berechnen»; «name numerologie»; «numerologi kalkulator».
- **Longtails con dato en esta investigación:** «lebenszahl berechnen» 590/mes, KD 1 (CH/de, ch-de-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «name numerologie»; «numerologi kalkulator». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** number-to-words-converter y name-generator convierten/generan texto; aquí se muestra un algoritmo recreativo de reducción con sus pasos.
- **Implementación en dispositivo:** Algoritmo recreativo explícito y reproducible con texto propio; normalización y sumas en JS. Ningún resultado predictivo, scraping o perfil remoto.
- **Caso/aceptación específico:** Fecha y texto sintéticos con suma manual conocida; reducción y excepciones reproducibles, Unicode y entrada vacía; no generar una descripción con IA remota.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Claramente recreativo, sin promesas predictivas ni supuesta validación científica.

#### CH026 · Jass: Schieber contra CPU local

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/jass-game/` (EN: `https://tools.usefulverse.com/tools/jass-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «jassen», CH/de, 110.000/mes, KD 33. P1: empezar antes; A: ≥10.000. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 12:22:39 +00:00.
- **Funciones obligatorias:** Partida Schieber de cuatro, parejas, elección/paso de triunfo, modalidades admitidas, obligación de jugar y puntuación; reglas, tutorial, hoja de marcador y guardar partida local.
- **Longtails y modos de la misma URL:** «jassen schieber»; «schieber jass»; «jass zähler»; «jouer jass».
- **Longtails con dato en esta investigación:** «jassen schieber» 40.500/mes, KD 3 (CH/de, ch-ideas); «schieber jass» 1900/mes, KD 0 (CH/de, ch-de-overview); «jouer jass» 70/mes, KD — (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «jass zähler». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** spades-game, bridge y skat tienen contratos y puntuaciones distintos; no cambiar el nombre de un motor de otro juego.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Fixtures de cada modalidad anunciada; valor de cartas, última baza, obligación de asistir/triunfo y suma de puntos; pareja de CPU no conoce cartas ocultas ajenas salvo modo didáctico elegido.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Fuente suiza de reglas antes de construir. No servidor de partidas ni competiciones con dinero.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH027 · Puzzle binario Binairo / Takuzu

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/binary-puzzle/` (EN: `https://tools.usefulverse.com/tools/binary-puzzle/`). Una misma ficha en 37 idiomas.
- **Demanda:** «binoxxo», CH/de, 4400/mes, KD 3. P1: empezar antes; B: 1.000–9.999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 18:15:18 +00:00.
- **Funciones obligatorias:** Rejilla de dos símbolos, equilibrio, ausencia de triples y filas/columnas únicas; generador de solución única, dificultad, notas, deshacer y reto diario.
- **Longtails y modos de la misma URL:** «binairo»; «takuzu»; «binoxxo online».
- **Longtails con dato en esta investigación:** «binairo» 260/mes, KD 0 (CH/de, ch-de-overview); «takuzu» 110/mes, KD 11 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «binoxxo online». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** sudoku exige símbolos distintos por bloques y nonogram usa pistas de secuencias; este puzzle tiene restricciones binarias y equilibrio.
- **Implementación en dispositivo:** Generador, solver y verificador independientes dentro de Worker; contar soluciones y graduar dificultad con criterio propio. Semillas reproducibles/diarias, deshacer/notas y generador variado sin corpus editorial copiado.
- **Caso/aceptación específico:** Validar toda solución; contar soluciones con solver independiente; puzzles con pistas consistentes; semillas distintas y ninguna fila/columna repetida.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Nombre/arte propios y puzzles generados; revisar marcas de denominaciones comerciales. No copiar hojas editoriales de Binoxxo.
- **Fuentes iniciales:** [PUZZLE-INTENT](#fuentes-de-puzzle-intent). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH028 · Juego del molino de nueve fichas

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/nine-mens-morris/` (EN: `https://tools.usefulverse.com/tools/nine-mens-morris/`). Una misma ficha en 37 idiomas.
- **Demanda:** «mühle online», CH/de, 880/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-16 21:50:47 +00:00.
- **Funciones obligatorias:** Colocar, mover y formar molinos; retirada legal, fase final según variante y empate; CPU local, tutorial y nuevas partidas.
- **Longtails y modos de la misma URL:** «mühle spielen»; «mühle»; «jeu du moulin».
- **Longtails con dato en esta investigación:** «mühle spielen» 480/mes, KD 0 (CH/de, ch-de-overview); «mühle» 4400/mes, KD 34 (CH/de, ch-de-overview); «jeu du moulin» 260/mes, KD 0 (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Diferencia frente al catálogo existente y nuevas cercanas:** checkers captura saltando en damero y tic-tac-toe termina al alinear tres; Mühle tiene fases de colocación/movimiento y retirada.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Molino formado y pieza protegida, bloqueo del rival, fase de tres fichas y repetición; conservar piezas y turno en todas las fases.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** UI y CPU originales; declarar reglas de empate y fase de vuelo.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH029 · Halma con saltos encadenados

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/halma-game/` (EN: `https://tools.usefulverse.com/tools/halma-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «halma», CH/de, 480/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 10:43:56 +00:00.
- **Funciones obligatorias:** Tablero/modalidad declarada, desplazamientos y cadenas de saltos; resaltar movimientos, CPU local y turnos compartidos; objetivo de ocupar la zona contraria.
- **Longtails y modos de la misma URL:** «halma online»; «halma spiel»; «chinese checkers».
- **Longtails con dato en esta investigación:** «halma online» 40/mes, KD 0 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «halma spiel»; «chinese checkers». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** checkers elimina piezas al saltar; Halma desplaza las propias para llegar a una zona objetivo.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Cadena de saltos válida, paso a casilla ocupada rechazado y zonas objetivo correctas; las piezas saltadas no desaparecen como en damas.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No contar tablero cuadrado y estrella como dos herramientas; solo ofrecer variantes con reglas y tableros completos.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH030 · Canasta por parejas o modalidad de dos

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/canasta-card-game/` (EN: `https://tools.usefulverse.com/tools/canasta-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «canasta online», CH/de, 390/mes, KD 28. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 12:31:47 +00:00.
- **Funciones obligatorias:** Robar, descartar, melds, comodines, pila y canastas; requisitos de apertura y salida por modalidad; CPU local, marcador y guía de manos.
- **Longtails y modos de la misma URL:** «canasta»; «canasta regeln»; «canasta online kostenlos».
- **Longtails con dato en esta investigación:** «canasta» 720/mes, KD 7 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «canasta regeln»; «canasta online kostenlos». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** gin-rummy forma una mano cerrada distinta; Canasta requiere melds públicos, canastas y reglas de montón.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Canasta limpia/sucia, comodines, congelación de montón, salida ilegal y puntuación de ronda; conservar cartas en baraja doble.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Definir una modalidad inicial y completarla antes de añadir otras.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH031 · Skat contra CPU con contratos declarados

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/skat-card-game/` (EN: `https://tools.usefulverse.com/tools/skat-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «skat», CH/de, 880/mes, KD 45. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 17:59:04 +00:00.
- **Funciones obligatorias:** Tres jugadores, subasta, skat, modalidades de contrato implementadas, triunfo y puntuación; análisis de manos y práctica local; CPU con habilidad declarada.
- **Longtails y modos de la misma URL:** «skat online»; «skat rechner»; «skat regeln».
- **Longtails con dato en esta investigación:** «skat online» 50/mes, KD 45 (CH/de, ch-de-overview); «skat rechner» 10/mes, KD — (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «skat regeln». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** Jass y Spades tienen número de jugadores, subasta y valores distintos. La utilidad nueva es jugar Skat completo.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Fixtures de subasta/contrato, orden especial de triunfos y obligación de asistir; sobrepuja, manos y puntuación correctos; no anunciar modalidades ausentes.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** La query genérica incluye reglas y software; no todo su volumen es capturable por un juego nuevo.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH032 · Doppelkopf local con parejas y anuncios

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/doppelkopf-card-game/` (EN: `https://tools.usefulverse.com/tools/doppelkopf-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «doppelkopf», CH/de, 210/mes, KD 13. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 09:40:51 +00:00.
- **Funciones obligatorias:** Baraja doble, identificación de pareja, anuncio/contraanuncio de una variante definida, bazas y puntos; CPU local y tutorial; partidas sin cuentas.
- **Longtails y modos de la misma URL:** «doppelkopf online»; «doppelkopf regeln»; «doppelkopf lernen».
- **Longtails con dato en esta investigación:** «doppelkopf online» 10/mes, KD 52 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «doppelkopf regeln»; «doppelkopf lernen». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** skat usa tres jugadores y cartas únicas; este juego necesita cartas duplicadas, parejas y sistema de anuncios propio.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Doble carta idéntica, orden de triunfo, detección de pareja y anuncios; suma de puntos del mazo y cierre de ronda; ocultar información que el jugador no conoce.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Solo 10/mes en la variante online medida; 210 corresponde al término general. Complejidad alta frente a esa demanda.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH033 · Schafkopf de una modalidad completa

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/schafkopf-card-game/` (EN: `https://tools.usefulverse.com/tools/schafkopf-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «schafkopf», CH/de, 170/mes, KD 27. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 13:10:32 +00:00.
- **Funciones obligatorias:** Cuatro jugadores y contratos definidos, compañero por carta cuando aplique, triunfos, bazas y puntuación; CPU y modo de aprendizaje con ejemplos.
- **Longtails y modos de la misma URL:** «schafkopf online»; «schafkopf regeln»; «schafkopf lernen».
- **Longtails con dato en esta investigación:** «schafkopf online» 10/mes, KD — (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «schafkopf regeln»; «schafkopf lernen». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** CH031 y CH032 tienen reglas/contratos diferentes; el solapamiento de género cartas no sustituye la intención de aprender/jugar Schafkopf.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Jerarquía de triunfos por contrato, obligación de asistir y compañero; fixtures de cada modalidad publicada; nunca reutilizar el orden del Skat sin adaptarlo.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Término general de 170/mes; priorizar después de Jass y los juegos con más demanda exacta.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH034 · Schnapsen de dos jugadores

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/schnapsen-card-game/` (EN: `https://tools.usefulverse.com/tools/schnapsen-card-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «schnapsen», CH/de, 70/mes, KD 0. P3: reserva demanda; D: <100. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 21:22:30 +00:00.
- **Funciones obligatorias:** Bazas, puntuación objetivo, anuncios de pareja, intercambio/cierre del talón y obligación de asistir por fase; CPU local y tutorial completo.
- **Longtails y modos de la misma URL:** «schnapsen online»; «schnapsen regeln»; «66 kartenspiel».
- **Longtails con dato en esta investigación:** «schnapsen online» 10/mes, KD 50 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «schnapsen regeln»; «66 kartenspiel». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** gin-rummy es de combinaciones/descartes y no de estas bazas con fases; Jass usa otra baraja y puntuación.
- **Implementación en dispositivo:** Máquina de estados pura para legalidad/turnos/puntuación; RNG con semillas de QA y variedad en partidas reales. La CPU solo elige jugadas legales; cálculo complejo en Worker. UI y activos propios; sin servicio de partidas.
- **Caso/aceptación específico:** Cambio de fase al cerrar/agotar talón; anuncio válido/inválido, intercambio y cierre a ambos lados de puntuación objetivo; resolver última baza y partida.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** 70/mes de término general: reserva de baja demanda local.
- **Fuentes iniciales:** [GAME-RULES](#fuentes-de-game-rules). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH035 · Puzzle de regiones Suguru

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/suguru-puzzle/` (EN: `https://tools.usefulverse.com/tools/suguru-puzzle/`). Una misma ficha en 37 idiomas.
- **Demanda:** «suguru», CH/de, 390/mes, KD 0. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 19:07:39 +00:00.
- **Funciones obligatorias:** Regiones de tamaño variable, dígitos por región y prohibición de vecinos iguales; generador único, notas, pistas explicadas, deshacer y diario.
- **Longtails y modos de la misma URL:** «suguru online»; «suguru rätsel»; «suguru lösung».
- **Hipótesis semánticas sin cifra consultada:** «suguru online»; «suguru rätsel»; «suguru lösung». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** sudoku usa grupos fijos de nueve y kakuro sumas; aquí mandan tamaño de región y vecindad diagonal.
- **Implementación en dispositivo:** Generador, solver y verificador independientes dentro de Worker; contar soluciones y graduar dificultad con criterio propio. Semillas reproducibles/diarias, deshacer/notas y generador variado sin corpus editorial copiado.
- **Caso/aceptación específico:** Verificador independiente de región y ocho vecinos; solver cuenta una solución; regiones disconexas y puzzle ambiguo rechazados; variedad entre días.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Diseño propio y generador, sin copiar puzzles publicados por editoriales.
- **Fuentes iniciales:** [PUZZLE-INTENT](#fuentes-de-puzzle-intent). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH036 · Shikaku: partición de rectángulos

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/shikaku-puzzle/` (EN: `https://tools.usefulverse.com/tools/shikaku-puzzle/`). Una misma ficha en 37 idiomas.
- **Demanda:** «shikaku», CH/de, 320/mes, KD 22. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-13 09:51:36 +00:00.
- **Funciones obligatorias:** Dividir la cuadrícula en rectángulos con un número y área exacta; generador de solución única, arrastre/teclado, pistas y reinicio; práctica y diario.
- **Longtails y modos de la misma URL:** «shikaku online»; «shikaku rätsel»; «rectangles puzzle».
- **Hipótesis semánticas sin cifra consultada:** «shikaku online»; «shikaku rätsel»; «rectangles puzzle». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** nonogram rellena celdas según secuencias; Shikaku construye una partición geométrica, con controles y restricciones propios.
- **Implementación en dispositivo:** Generador, solver y verificador independientes dentro de Worker; contar soluciones y graduar dificultad con criterio propio. Semillas reproducibles/diarias, deshacer/notas y generador variado sin corpus editorial copiado.
- **Caso/aceptación específico:** Rectángulos cubren todas las celdas sin solaparse; área igual a pista y una pista por región; solver independiente y puzzles imposibles detectados.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Fuentes iniciales:** [PUZZLE-INTENT](#fuentes-de-puzzle-intent). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH037 · Corrector ortográfico local con diccionarios

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/fr/tools/local-spell-checker/` (EN: `https://tools.usefulverse.com/tools/local-spell-checker/`). Una misma ficha en 37 idiomas.
- **Demanda:** «correcteur orthographe», CH/fr, 49.500/mes, KD 55. P2: gate técnico; A: ≥10.000. Fuente DataForSEO `ch-fr-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-13 04:28:55 +00:00.
- **Funciones obligatorias:** Diccionarios de noruego y lenguas soportadas por licencia; resaltar palabras y ofrecer sugerencias; ignorar/añadir términos privados, deshacer y exportar; detectar idioma solo si se implementa con certeza.
- **Longtails y modos de la misma URL:** «rettskriving»; «rette tekst»; «correcteur orthographe»; «rechtschreibprüfung».
- **Longtails con dato en esta investigación:** «correcteur orthographe» 49.500/mes, KD 55 (CH/fr, ch-fr-overview); «rechtschreibprüfung» 18.100/mes, KD 48 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «rettskriving»; «rette tekst». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** readability-checker evalúa legibilidad y spelling-practice pregunta palabras del usuario; ninguna corrige texto libre con diccionario.
- **Implementación en dispositivo:** Motor de tokens/patrones/diccionarios en JS o WASM licenciado y diferido por idioma técnico. Renderizar texto inerte; sin eval, modelo remoto o traducción en cada visita.
- **Caso/aceptación específico:** Corpus pequeño por idioma con palabra correcta, errata, nombre propio, compuesto y apóstrofo; aciertos/errores conocidos; la opción de ignorar no modifica otras apariciones sin elección.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Una sola herramienta multilingüe, asignada al mercado suizo/francés por su demanda; no crear un segundo corrector noruego para inflar el número. No prometer revisión gramatical/semántica completa.
- **Fuentes iniciales:** [DICTIONARIES](#fuentes-de-dictionaries). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH038 · Rompebloques con pala y física

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/brick-breaker-game/` (EN: `https://tools.usefulverse.com/tools/brick-breaker-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «brick breaker», CH/de, 140/mes, KD 1. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 15:34:24 +00:00.
- **Funciones obligatorias:** Pala táctil/teclado, bola, ladrillos, vidas y niveles; editor sencillo o semillas de nivel válidas, pausa/mute y registro local.
- **Longtails y modos de la misma URL:** «breakout spiel»; «casse brique»; «bricks breaker».
- **Longtails con dato en esta investigación:** «breakout spiel» 10/mes, KD — (CH/de, ch-de-overview); «casse brique» 30/mes, KD 41 (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «bricks breaker». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** Pinball usa palas y mesa de objetivos diferentes; esta intención es destruir un muro con pala horizontal.
- **Implementación en dispositivo:** Canvas 2D y física de paso fijo desacoplada del dibujo; Pointer Events y teclado, rAF solo activo durante partida, pausa al ocultar. Niveles originales y colisiones verificadas con fixtures reproducibles.
- **Caso/aceptación específico:** Rebote en borde/cara/esquina, último ladrillo, pérdida de vida y velocidad alta sin atravesar objetos; física de paso fijo y liberación al salir.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Nombre, niveles y arte propios; no usar Arkanoid/Breakout como identidad del sitio.

#### CH039 · Minigolf de recorridos locales originales

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/mini-golf-game/` (EN: `https://tools.usefulverse.com/tools/mini-golf-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «minigolf online», CH/de, 50/mes, KD 5. P3: reserva demanda; D: <100. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-15 19:30:27 +00:00.
- **Funciones obligatorias:** Apuntar, potencia, obstáculos, golpes/par, nueve o dieciocho hoyos completos; práctica, reinicio y compartir código de recorrido; física local sin multijugador de servidor.
- **Longtails y modos de la misma URL:** «minigolf»; «mini golf»; «minigolf kostenlos online».
- **Longtails con dato en esta investigación:** «minigolf» 18.100/mes, KD 21 (CH/de, ch-de-overview); «mini golf» 18.100/mes, KD 0 (CH/fr, ch-fr-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «minigolf kostenlos online». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** golf handicap no existe en el catálogo, pero un handicap sería una calculadora; aquí hay una partida física completa de minigolf.
- **Implementación en dispositivo:** Canvas 2D y física de paso fijo desacoplada del dibujo; Pointer Events y teclado, rAF solo activo durante partida, pausa al ocultar. Niveles originales y colisiones verificadas con fixtures reproducibles.
- **Caso/aceptación específico:** Bola entra y se detiene en hoyo con velocidad admitida; paredes/cuestas y túneles soportados; contador y pasar de hoyo; recorrido no deja bola en un estado imposible.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** La query online medida tiene 50/mes; no usar las 18.100 del término minigolf como si todas buscaran un juego web.

#### CH040 · Puzzle de alinear tres con cascadas

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/match-three-game/` (EN: `https://tools.usefulverse.com/tools/match-three-game/`). Una misma ficha en 37 idiomas.
- **Demanda:** «match 3», CH/de, 40/mes, KD 13. P3: reserva demanda; D: <100. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-12 11:49:38 +00:00.
- **Funciones obligatorias:** Intercambiar piezas adyacentes, grupos/cascadas, objetivos y movimientos; varios niveles originales, ayudas opcionales y modo sin tiempo; pausa y guardado local.
- **Longtails y modos de la misma URL:** «3 gewinnt»; «match 3 spiele»; «match 3 gratuit».
- **Longtails con dato en esta investigación:** «3 gewinnt» 390/mes, KD 8 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «match 3 spiele»; «match 3 gratuit». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** 2048 combina potencias mediante deslizamiento y bubble-shooter dispara; ninguna resuelve este intercambio y eliminación por grupos.
- **Implementación en dispositivo:** Canvas 2D y física de paso fijo desacoplada del dibujo; Pointer Events y teclado, rAF solo activo durante partida, pausa al ocultar. Niveles originales y colisiones verificadas con fixtures reproducibles.
- **Caso/aceptación específico:** Intercambio sin match se revierte, cascada puntúa una vez por evento y tablero sin movimientos se resuelve de forma declarada; generar estado inicial válido.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** 40/mes en la query inequívoca; 3 gewinnt puede ser ambiguo. Reserva, sin copiar Candy Crush ni sus activos.

#### CH041 · Separador local de voz y acompañamiento

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/vocal-remover/` (EN: `https://tools.usefulverse.com/tools/vocal-remover/`). Una misma ficha en 37 idiomas.
- **Demanda:** «vocal remover», CH/de, 1900/mes, KD 3. P2: gate técnico; B: 1.000–9.999. Fuente DataForSEO `ch-de-overview`, consultada 15-oct-2026; última actualización informada: 2026-09-14 20:29:40 +00:00.
- **Funciones obligatorias:** Archivo local → dos pistas, preescucha comparada, progreso/cancelación y exportación; explicar calidad, formatos y duración práctica según memoria; modelo bajo demanda.
- **Longtails y modos de la misma URL:** «gesang entfernen»; «fjerne vokal»; «supprimer voix musique».
- **Hipótesis semánticas sin cifra consultada:** «gesang entfernen»; «fjerne vokal»; «supprimer voix musique». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** audio-editor recorta/aplica ganancia y media-transcriber extrae palabras; no separan fuentes musicales.
- **Implementación en dispositivo:** Descarga diferida de modelo/engine redistribuible; inferencia en Worker/WebGPU/WASM con fallback probado, procesamiento por bloques cuando el algoritmo lo admita y exportación real. Si no cabe/funciona útilmente, no sustituirlo por un efecto que no resuelve la tarea.
- **Caso/aceptación específico:** Mezcla sintética con voz/instrumento autorizados; longitud/canales alineados, exportaciones reproducibles, cancelación y consumo de memoria; medir separación sobre fixture, no solo que haya dos WAV.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Gate de modelo, licencia, memoria y salida útil. Un simple canal central cancelado no se anuncia como eliminación general de voz. No publicar si no pasa estos casos.
- **Fuentes iniciales:** [LOCAL-AUDIO](#fuentes-de-local-audio). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH042 · Audio musical a notas MIDI localmente

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/audio-to-midi-transcriber/` (EN: `https://tools.usefulverse.com/tools/audio-to-midi-transcriber/`). Una misma ficha en 37 idiomas.
- **Demanda:** «audio to midi», CH/de, 140/mes, KD 8. P2: gate técnico; C: 100–999. Fuente DataForSEO `ch-de-final`, consultada 15-oct-2026; última actualización informada: 2026-09-12 11:41:32 +00:00.
- **Funciones obligatorias:** Detectar notas, tiempos e intensidades de melodía/instrumentos en el alcance validado; teclado/piano roll para corregir, cuantización opcional y exportar MIDI; modelo o DSP cargado al activar.
- **Longtails y modos de la misma URL:** «mp3 to midi»; «wav to midi»; «audio midi converter».
- **Longtails con dato en esta investigación:** «mp3 to midi» 140/mes, KD 2 (CH/de, ch-de-final); «wav to midi» 40/mes, KD 40 (CH/de, ch-de-final). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «audio midi converter». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** media-transcriber convierte habla a texto y media-converter convierte contenedores/códecs; MIDI necesita inferencia de eventos musicales.
- **Implementación en dispositivo:** Descarga diferida de modelo/engine redistribuible; inferencia en Worker/WebGPU/WASM con fallback probado, procesamiento por bloques cuando el algoritmo lo admita y exportación real. Si no cabe/funciona útilmente, no sustituirlo por un efecto que no resuelve la tarea.
- **Caso/aceptación específico:** Melodía sintética con notas/onsets conocidos, silencios y acordes de prueba; reconstruir MIDI y comparar eventos; nada de transcribir voz hablada como notas o devolver un MIDI vacío.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Basic Pitch TS es una opción a validar, no una integración ya realizada. Explicar los instrumentos/texturas realmente probados y recomendar PC si requiere mucha memoria.
- **Fuentes iniciales:** [LOCAL-AUDIO](#fuentes-de-local-audio). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH043 · Cambiador de voz y efectos de audio local

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/voice-changer/` (EN: `https://tools.usefulverse.com/tools/voice-changer/`). Una misma ficha en 37 idiomas.
- **Demanda:** «voice changer», CH/de, 880/mes, KD 52. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-final`, consultada 15-oct-2026; última actualización informada: 2026-09-12 19:21:11 +00:00.
- **Funciones obligatorias:** Archivo o micrófono, tono y efectos explicados, preescucha/deshacer y exportar; monitor de micrófono apagado por defecto; evitar retorno de altavoces; detener libera pistas.
- **Longtails y modos de la misma URL:** «stimme verändern»; «stimmlage verändern»; «voice changer online».
- **Longtails con dato en esta investigación:** «stimme verändern» 40/mes, KD 23 (CH/de, ch-de-final). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «stimmlage verändern»; «voice changer online». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** audio-editor actual corta y ajusta ganancia/fades, no transforma timbre/tono de la voz; text-to-speech genera voz desde texto.
- **Implementación en dispositivo:** Web Audio/AudioWorklet o análisis por bloques; motor de efecto/medición con parámetros explícitos. Audio solo tras gesto, volumen prudente, stop/cancel y liberación de buffers/pistas; exportación WAV/formatos realmente soportados.
- **Caso/aceptación específico:** Señal sintética y voz propia de prueba; efecto cambia el parámetro esperado, duración/canales correctos y sin clipping extremo; permiso denegado y exportación cancelada.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No imitar identidades ni prometer clonación de voces de personas. Los efectos no necesitan un LLM ni servidor.

#### CH044 · Generador de tonos y barridos de frecuencia

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/frequency-tone-generator/` (EN: `https://tools.usefulverse.com/tools/frequency-tone-generator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «ton generator», CH/de, 210/mes, KD 23. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-13 23:07:57 +00:00.
- **Funciones obligatorias:** Frecuencia, forma de onda, canales y duración; volumen inicial bajo, start/stop con gesto, barrido y exportación WAV; presets de prueba de altavoces.
- **Longtails y modos de la misma URL:** «frequenzgenerator»; «online tone generator»; «lydfrekvens generator».
- **Longtails con dato en esta investigación:** «frequenzgenerator» 70/mes, KD 10 (CH/de, ch-de-extra); «online tone generator» 110/mes, KD 25 (CH/de, ch-de-extra). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «lydfrekvens generator». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** virtual-piano ofrece notas musicales y speaker-tester comprueba canales; aquí se configura una señal continua arbitraria y barridos.
- **Implementación en dispositivo:** Web Audio/AudioWorklet o análisis por bloques; motor de efecto/medición con parámetros explícitos. Audio solo tras gesto, volumen prudente, stop/cancel y liberación de buffers/pistas; exportación WAV/formatos realmente soportados.
- **Caso/aceptación específico:** 440 Hz sintético medido por análisis de señal, frecuencia de Nyquist y rampa sin click; stop y pestaña oculta cortan reproducción; amplitud de exportación coincide con ajuste.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No tratamiento de salud ni prueba auditiva clínica. Evitar volumen alto por defecto y sonidos sorpresivos.

#### CH045 · Lector de códigos de barras lineales

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/barcode-reader/` (EN: `https://tools.usefulverse.com/tools/barcode-reader/`). Una misma ficha en 37 idiomas.
- **Demanda:** «barcode scanner online», CH/de, 170/mes, KD 21. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-12 16:21:41 +00:00.
- **Funciones obligatorias:** Imagen local o cámara voluntaria; EAN/UPC/Code128 y formatos realmente soportados; rotación, varios códigos, checksum y copia/listado; no enviar imágenes ni consultar precios.
- **Longtails y modos de la misma URL:** «barcode scanner»; «barcode lesen»; «strekkode leser».
- **Longtails con dato en esta investigación:** «barcode scanner» 1600/mes, KD 20 (CH/de, ch-de-final); «barcode lesen» 70/mes, KD 0 (CH/de, ch-de-final). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «strekkode leser». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** barcode-generator crea códigos y qr-code-reader solo lee QR. Este producto decodifica simbologías lineales diferentes.
- **Implementación en dispositivo:** APIs de navegador con detección de soporte y permisos solo al activar; rAF/canvas o capturas locales según contrato; limpieza de pistas y estado en stop. No inferir capacidades certificadas del hardware.
- **Caso/aceptación específico:** Fixtures generados y conocidos de cada simbología; rotados, borrosos, dígito incorrecto y cámara no permitida; distinguir falta de lectura de código inexistente.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No prometer identificación comercial del producto: solo datos contenidos en el código. No duplicar el lector QR como función principal.

#### CH046 · Comprobador local de estructura y lectura de CV

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/resume-structure-checker/` (EN: `https://tools.usefulverse.com/tools/resume-structure-checker/`). Una misma ficha en 37 idiomas.
- **Demanda:** «ats resume checker», CH/de, 260/mes, KD 25. P2: gate técnico; C: 100–999. Fuente DataForSEO `ch-de-final`, consultada 15-oct-2026; última actualización informada: 2026-09-16 23:05:42 +00:00.
- **Funciones obligatorias:** PDF/DOCX local → orden de texto, encabezados y secciones detectados, enlaces y avisos de extracción; comparación opcional con descripción de oferta pegada y frecuencias explicadas; informe sin envío.
- **Longtails y modos de la misma URL:** «cv checker»; «lebenslauf check»; «bewerbung prüfen».
- **Longtails con dato en esta investigación:** «cv checker» 110/mes, KD 21 (CH/de, ch-de-final); «lebenslauf check» 20/mes, KD — (CH/de, ch-de-final). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «bewerbung prüfen». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** resume-builder crea un CV y pdf-accessibility-checker revisa etiquetas PDF; aquí se prueba extracción/estructura de un CV ya creado y su correspondencia textual con una oferta.
- **Implementación en dispositivo:** Parseo PDF/DOCX bajo demanda con biblioteca local, ZIP saneado y texto inerte; análisis de orden/estructura mediante reglas explicadas. No enviar CV ni ofertas ni calcular una supuesta probabilidad de contratación.
- **Caso/aceptación específico:** CV sintético con columna, imagen sin texto, caracteres, enlaces y encabezados; informe marca qué pudo leer y qué no; ningún porcentaje se presenta como probabilidad de contratación.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** La intención automática figura como navegacional: confirmar SERP genérica antes de title. No simular acceso a un ATS comercial ni puntuar el valor de una persona.

#### CH047 · Mezcla de agua para GH/KH y dureza

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/aquarium-water-mixing-calculator/` (EN: `https://tools.usefulverse.com/tools/aquarium-water-mixing-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «wasserhärte umrechnen», CH/de, 110/mes, KD 1. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-final`, consultada 15-oct-2026; última actualización informada: 2026-09-14 07:52:17 +00:00.
- **Funciones obligatorias:** Convertir unidades de dureza y calcular mezcla de agua del grifo/ósmosis por GH y KH introducidos; volúmenes finales y comprobación de compatibilidad de ambos objetivos.
- **Longtails y modos de la misma URL:** «wasserhärte rechner»; «aquarium wasser mischen»; «aquarium härte berechnen».
- **Longtails con dato en esta investigación:** «wasserhärte rechner» 20/mes, KD 43 (CH/de, ch-de-final). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «aquarium wasser mischen»; «aquarium härte berechnen». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** aquarium-calculator calcula volumen y dilution-calculator concentración de un soluto; aquí se verifican dos propiedades independientes de la misma mezcla y unidades de dureza.
- **Implementación en dispositivo:** Modelo físico/químico declarado y rango de validez, unidades estrictas y explicación de variables. Rechazar combinaciones imposibles y no aplicar fórmulas fuera de dominio.
- **Caso/aceptación específico:** 100 L, grifo GH10/KH5 y ósmosis GH0/KH0: 50/50 → GH5/KH2,5; si se exigen dos objetivos incompatibles, no inventar proporción; nunca interpolar pH linealmente.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** El motor actual de dilución no ofrece GH/KH simultáneos; la ficha debe conservar esa comprobación de compatibilidad como función central y no quedarse en un conversor de unidades. No recomendar parámetros de especies sin fuente.

#### CH048 · Impuesto anual cantonal de vehículos suizos

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/switzerland-vehicle-tax-calculator/` (EN: `https://tools.usefulverse.com/tools/switzerland-vehicle-tax-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «kfz steuer rechner schweiz», CH/de, 170/mes, KD 9. P2: datos/normativa; C: 100–999. Fuente DataForSEO `ch-de-final`, consultada 15-oct-2026; última actualización informada: 2026-09-13 21:49:18 +00:00.
- **Funciones obligatorias:** Cantón, clase, fecha, peso/potencia/emisiones y descuentos soportados; cuota anual/proporcional, desglose y comparación entre dos vehículos; tabla de cobertura cantonales.
- **Longtails y modos de la misma URL:** «fahrzeugsteuer rechner»; «strassenverkehrssteuer rechner»; «calcul taxe automobile suisse».
- **Longtails con dato en esta investigación:** «fahrzeugsteuer rechner» 10/mes, KD — (CH/de, ch-de-overview); «strassenverkehrssteuer rechner» 70/mes, KD 18 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «calcul taxe automobile suisse». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** car-running-cost-calculator acepta costes introducidos por el usuario; no implementa normas de tributación anual cantonal.
- **Implementación en dispositivo:** Motor local por ejercicio y cantón, con datos de fuente primaria y fixtures; precisión decimal y política de redondeo por concepto. Bibliotecas matemáticas compartidas no convierten leyes distintas en un porcentaje universal.
- **Caso/aceptación específico:** Fixtures oficiales de cantones publicados y corte temporal; cambiar cantón obliga a recalcular esquema; cero emisiones no implica exención universal.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No confundir importación/CO2 inicial con tasa de circulación anual. Documentar cada cantón soportado.
- **Fuentes iniciales:** [CH-TAX](#fuentes-de-ch-tax). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH049 · Huella de carbono por escenarios con factores citados

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/carbon-footprint-calculator/` (EN: `https://tools.usefulverse.com/tools/carbon-footprint-calculator/`). Una misma ficha en 37 idiomas.
- **Demanda:** «co2 rechner», CH/de, 210/mes, KD 45. P1: empezar antes; C: 100–999. Fuente DataForSEO `ch-de-final`, consultada 15-oct-2026; última actualización informada: 2026-09-15 06:31:32 +00:00.
- **Funciones obligatorias:** Electricidad/calefacción/transporte/vuelos y categorías soportadas; factores por país/año, límites de sistema y resultados por sector; comparar acciones editando entradas, sin cuenta.
- **Longtails y modos de la misma URL:** «co2 fussabdruck rechner»; «ecological footprint calculator»; «co2 rechner auto».
- **Longtails con dato en esta investigación:** «ecological footprint calculator» 50/mes, KD 87 (CH/de, ch-de-final); «co2 rechner auto» 30/mes, KD 27 (CH/de, ch-de-overview). Son alternativas, no volúmenes que se suman a la principal.
- **Hipótesis semánticas sin cifra consultada:** «co2 fussabdruck rechner». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** fuel-cost-calculator y car-running-cost-calculator calculan dinero/uso; no convierten consumos de varias actividades en emisiones con factores documentados.
- **Implementación en dispositivo:** Cálculo puro con tabla estática fechada/importada y procedencia por dato; actualización pública directa solo si se verifica CORS/términos. Sin backend, polling, cron facturable ni secreto en el cliente.
- **Caso/aceptación específico:** Fixture de 100 unidades × factor sintético 0,2 →20; impedir mezcla de kg/t, factores por pasajero frente a vehículo y doble conteo entre categorías.
- **Carga:** Módulo pequeño por herramienta; sin motores/modelos ni diccionarios ajenos en carga inicial. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** Huella de carbono y huella ecológica no son idénticas; la segunda query es referencia de demanda y no promesa de medir hectáreas. No certificado ni compensación pagada.
- **Fuentes iniciales:** [CH-FOOTPRINT](#fuentes-de-ch-footprint). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

#### CH050 · Visor DICOM privado de imágenes médicas

- **Ruta propuesta, aún no publicada:** `https://tools.usefulverse.com/de/tools/dicom-viewer/` (EN: `https://tools.usefulverse.com/tools/dicom-viewer/`). Una misma ficha en 37 idiomas.
- **Demanda:** «dicom viewer», CH/de, 260/mes, KD 10. P2: gate técnico; C: 100–999. Fuente DataForSEO `ch-de-extra`, consultada 15-oct-2026; última actualización informada: 2026-09-14 08:05:21 +00:00.
- **Funciones obligatorias:** Archivo/serie DICOM local, orden de cortes, window/level, orientación y metadatos; indicar objetos/códecs soportados y ocultar identificadores al compartir capturas; no enviar imágenes.
- **Longtails y modos de la misma URL:** «dicom viewer online»; «dcm datei öffnen»; «dicom bilder ansehen».
- **Hipótesis semánticas sin cifra consultada:** «dicom viewer online»; «dcm datei öffnen»; «dicom bilder ansehen». No volver a pagar su consulta por defecto; trabajar solo si la función y el contexto las justifican.
- **Diferencia frente al catálogo existente y nuevas cercanas:** image-format-converter transforma imágenes comunes y pdf-tools documentos; no interpretan objetos DICOM, series y ventanas médicas.
- **Implementación en dispositivo:** Evaluar Cornerstone/DICOM y sus códecs con licencia fijada y cargados al abrir archivo; fuentes File/Blob locales, no PACS/DICOMweb remoto. Respetar etiquetas, fotometría y transferencia; cancelar/liberar series completas.
- **Caso/aceptación específico:** Fixtures DICOM sintéticos/deidentificados y redistribuibles; orden de cortes, inversión MONOCHROME, transferencia soportada/no soportada y ventana; no sustituir un estudio que falla por una imagen vacía.
- **Carga:** Motor pesado diferido; Web Worker/AudioWorklet cuando proceda; muestra de RAM/cancelación obligatoria. Aplicar también controles de entrada, accesibilidad, exportación y locales de los apartados 7–12.
- **Gate o límite específico:** No visor certificado para diagnóstico ni envío de historiales. Biblioteca/códecs y fixtures con licencia; recomendar PC en series grandes y dar cancelación real.
- **Fuentes iniciales:** [DICOM](#fuentes-de-dicom). Completar fuentes exactas/versión/licencia y fixtures antes de dar el gate correspondiente por aprobado.

## 18. Exclusiones y consolidaciones para no repetir trabajo

| Consulta/idea examinada | Decisión y destino |
| --- | --- |
| mva kalkulator / IVA | Ya existe `tax-calculator`; no crear otra por el país o el porcentaje. |
| hypothekenrechner / lånekalkulator | Préstamo/hipoteca genérica ya existe en `loan-calculator`; las nuevas normas solo cuentan si añaden reglas propias distintas. |
| notenschnitt berechnen / snittkalkulator | Promedios/ponderaciones ya cubiertos por `average-calculator` y GPA; CH021 es tabla puntos→nota, no otro promedio. |
| 13 monatslohn / Quellensteuer mensual | Modos de CH001; no dos herramientas adicionales. La tributación anual se delimita en CH002. |
| Swiss QR referencia / QR reader de factura | Integrados en CH017; el QR genérico y el lector QR anteriores se conservan. |
| spell checker francés, alemán y noruego por separado | Una sola CH037 multilingüe. NO025 es un juego de códigos, no un segundo corrector. |
| cantones suizos, Noruega y banderas como tres quizzes | Una sola NO049 con datasets/modos; no otra herramienta por mapa. |
| hundeår / katteår / hundejahre | Una sola NO029 para especies y tablas correspondientes. |
| STL viewer / STEP viewer / OBJ viewer | Una sola NO032 con formatos validados; DXF 2D conserva capas/medidas y tiene su contrato propio NO033. |
| Binoxxo / Binairo / Takuzu | Una sola CH027; reglas/generación originales, revisar denominaciones. |
| Yatzy / Yahtzee / Kniffel | Una sola NO036; interfaces y arte propios. |
| Solitario, FreeCell, Spider, Mahjong, Backgammon, Sudoku, Nonogram, 2048, Chess | Ya están en el inventario de 600; sus consultas no justifican nuevas copias. |
| Kryssordhjelper, anagramas, rimord | Herramientas de palabras/rimas existentes; ampliar un diccionario no crea automáticamente un nuevo producto. |
| PDF, compresión de vídeo, formatos de imágenes comunes | Ya existen suites de procesamiento; no rehacerlas para añadir una palabra clave de otra dirección. |
| fraktkalkulator / portorechner | Demanda exacta y mantenimiento insuficientes para esta tanda; no sustituir por volumen del sitio postal de marca. |
| TWINT / Vipps QR de cobro | Demanda encontrada, pero no se ha demostrado una creación autónoma válida sin alta/proveedor; no simular un QR de pago funcional. |
| Ordle 201.000/mes | Consulta principalmente de un producto/competidor. NO038 usa la demanda de «wordle norsk» y debe tener identidad propia. |
| minigolf 18.100/mes | Incluye lugares/deporte; CH039 se valora por «minigolf online», 50/mes. |
| Cluedo, Rummikub, UNO, Skyjo, Wizard, Skip-Bo | No se convierten en clones de marca para completar cantidad; no hay gate jurídico/de activos aprobado. Los juegos clásicos seleccionados tienen contratos y nombres propios. |
| tarot / cartas diarias | La query herramienta no devolvió volumen útil; «tarotkort» puede ser compra de cartas. No se añade por 1.900 de una intención diferente. |
| audio normalizer | No se obtuvo dato de volumen en la query consultada; no integra las 100. Queda fuera, sin inventar demanda con compresión de vídeo. |
| IQ test, salud diagnóstica, ajuste DIN de fijaciones | No presentar pruebas recreativas o fórmulas incompletas como diagnóstico/certificación de seguridad. No necesarias para completar esta selección. |
| Tiempo real de bolsa/seguros/rutas con API facturable | No encaja con coste de operación cero. Datos manuales/estáticos solo cuando siguen resolviendo honestamente la intención. |

## 19. Gasto y evidencias conservadas

Tarifa consultada de Labs: 0,012 USD/tarea + 0,00012 USD/resultado; sin clickstream. Cada solicitud tuvo límite explícito; las peticiones de pago no tuvieron reintentos automáticos. La consulta gratuita de cuenta/mercados confirmó saldo suficiente y combinaciones disponibles sin guardar datos de facturación ni credenciales. Para los últimos lotes se usa una exclusión mutua de solicitudes y reserva previa del coste máximo.

| Consulta | Mercado | Máximo pedido | Filas devueltas | USD reales |
| --- | --- | ---: | ---: | ---: |
| no-ideas | NO/nb | 250 | 250 | 0.04200 |
| ch-ideas | CH/de | 250 | 250 | 0.04200 |
| no-nb-overview | NO/nb | 253 | 186 | 0.03432 |
| ch-de-overview | CH/de | 255 | 201 | 0.03612 |
| ch-fr-overview | CH/fr | 81 | 42 | 0.01704 |
| ch-it-overview | CH/it | 44 | 18 | 0.01416 |
| no-nb-extra | NO/nb | 137 | 83 | 0.02196 |
| ch-de-extra | CH/de | 147 | 116 | 0.02592 |
| ch-de-final | CH/de | 70 | 45 | 0.01740 |
| **Total** | | | **1191** | **0.25092** |

Los términos solicitados sin resultado siguen en los JSON de peticiones; no se transforman en ceros ni se ocultaron cambiándolos por queries más amplias. El libro de gasto coteja coste de respuesta con la petición guardada. La investigación queda cerrada: **ninguna llamada adicional de pago se autoriza por reabrir este archivo**.

**Respaldo documental previsto:** [carpeta privada del plan](https://github.com/pedronunezwebs-hash/usefulverse/tree/docs/no-ch-expansion-plan-20261015/docs/markets-no-ch), rama `docs/no-ch-expansion-plan-20261015`, carpeta `docs/markets-no-ch/`. La verificación de subida y hash se registra en el cierre de entrega; no es una publicación de páginas ni un merge a main.

Archivos que se conservan en el respaldo: este MD, inventario público, 100 fichas estructuradas, métricas, costes, snapshot de Search Console, fuentes y peticiones/respuestas DataForSEO. El usuario conserva además este Markdown descargable. Los scripts de auditoría/generación sin credenciales pueden respaldarse para repetir las comprobaciones locales; una futura ejecución pagada sigue necesitando una nueva orden.

## 20. Fuentes iniciales y alcance de su verificación

Fecha de consulta de la investigación: 15-oct-2026. Las páginas primarias enlazadas sirven de evidencia de método, reglas o viabilidad; las entradas que dicen «por verificar» identifican expresamente trabajo del futuro gate. No se han validado todas las tarifas, licencias o versiones de cada biblioteca ni probado nuevos modelos en este encargo.

<a id="fuentes-de-data-pricing"></a>

- **DATA-PRICING:** [Tarifas actuales de DataForSEO Labs](https://dataforseo.com/pricing/dataforseo-labs/dataforseo-google-api). Precio base/resultado; clickstream desactivado. El coste concreto procede de cada respuesta API guardada.

<a id="fuentes-de-data-overview"></a>

- **DATA-OVERVIEW:** [Keyword Overview: ubicación, idioma y métricas](https://docs.dataforseo.com/v3/dataforseo_labs-google-keyword_overview-live/). Las cifras dependen de mercado/idioma y fecha del proveedor; no son tráfico capturable.

<a id="fuentes-de-data-ideas"></a>

- **DATA-IDEAS:** [Keyword Ideas: expansión y filtros](https://docs.dataforseo.com/v3/dataforseo_labs-google-keyword_ideas-live/). Se filtraron resultados geográficos/navegacionales que no correspondían a una herramienta.

<a id="fuentes-de-google-title"></a>

- **GOOGLE-TITLE:** [Títulos en Google Search](https://developers.google.com/search/docs/appearance/title-link). Política de títulos descriptivos y truncado; 60 caracteres es presupuesto editorial propio.

<a id="fuentes-de-google-snippet"></a>

- **GOOGLE-SNIPPET:** [Descripciones y snippets](https://developers.google.com/search/docs/appearance/snippet). No hay máximo universal fijo de descripción; Google adapta el snippet.

<a id="fuentes-de-google-lang"></a>

- **GOOGLE-LANG:** [Sitios multilingües/multirregionales](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites). URLs por idioma, disponibilidad y selección accesible.

<a id="fuentes-de-adsense-rpm"></a>

- **ADSENSE-RPM:** [Definición de RPM](https://support.google.com/adsense/answer/190515). Evitar convertir CPM de YouTube o CPC de búsqueda en ingreso de la web.

<a id="fuentes-de-pages-price"></a>

- **PAGES-PRICE:** [Precios de solicitudes estáticas de Pages](https://developers.cloudflare.com/pages/functions/pricing/). Arquitectura de assets estáticos sin procesamiento facturable por operación.

<a id="fuentes-de-pages-limit"></a>

- **PAGES-LIMIT:** [Límites de Pages](https://developers.cloudflare.com/pages/platform/limits/). Verificar de nuevo plan, archivos, assets y publicaciones antes de deploy.

<a id="fuentes-de-no-tax"></a>

- **NO-TAX:** [Skatteetaten: simulador y tablas fiscales](https://www.skatteetaten.no/person/skatt/skattekalkulator/). Entrada oficial para normas/fixtures; ampliar a la norma y ejercicio exactos de cada ficha.

<a id="fuentes-de-no-wealth"></a>

- **NO-WEALTH:** [Patrimonio y descuentos de valoración](https://www.skatteetaten.no/nn/tabellar-og-satsar/formuesskatt/). Referencia específica de valoración patrimonial; no una suma de patrimonio de mercado.

<a id="fuentes-de-no-work"></a>

- **NO-WORK:** [Arbeidstilsynet: feriepenger](https://www.arbeidstilsynet.no/arbeidstid-og-organisering/ferie/feriepenger/). Cálculo sobre renta previa y reglas de vacaciones; validar año y excepciones al implementar.

<a id="fuentes-de-no-nav"></a>

- **NO-NAV:** [NAV: importes y prestaciones](https://www.nav.no/satser). Entrada oficial para tablas vigentes; cada prestación necesita su regla específica y ejemplos.

<a id="fuentes-de-no-parent"></a>

- **NO-PARENT:** [NAV: foreldrepenger](https://www.nav.no/foreldrepenger). Definir cobertura, periodo y supuestos soportados; no presentar solicitudes.

<a id="fuentes-de-no-child"></a>

- **NO-CHILD:** [NAV: barnebidrag](https://www.nav.no/barnebidrag). Reglas y alcance de manutención infantil.

<a id="fuentes-de-no-housing"></a>

- **NO-HOUSING:** [Husbanken: cálculo de bostøtte](https://www.husbanken.no/person/bostotte/beregning-av-bostotte/). Límites por hogar/ubicación; contrastar con calculadora oficial.

<a id="fuentes-de-no-student"></a>

- **NO-STUDENT:** [Lånekassen: conversión del préstamo a beca](https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/). Diferencial frente a una amortización genérica de préstamo.

<a id="fuentes-de-no-energy"></a>

- **NO-ENERGY:** [NVE: Norgespris y alternativas](https://www.nve.no/reguleringsmyndigheten/kunde/stroem/dette-er-norgespris/boer-jeg-velge-norgespris/). No prometer previsión de precios futuros; programas y condiciones versionados.

<a id="fuentes-de-no-tolls"></a>

- **NO-TOLLS:** [AutoPASS: directrices tarifarias](https://www.autopass.no/no/bompengebransjen/takstretningslinjene/). Base de reglas; aún se requieren datos por estación, licencia y ruta verificada.

<a id="fuentes-de-no-tolls-example"></a>

- **NO-TOLLS-EXAMPLE:** [Fjellinjen: ejemplo de calculadora de peajes](https://www.fjellinjen.no/bompengekalkulator). Referencia de intención/resultado esperado; no copiar sus tablas o resultados como si fueran un dataset licenciado.

<a id="fuentes-de-no-customs"></a>

- **NO-CUSTOMS:** [Tolletaten](https://www.toll.no/). Organismo primario identificado; localizar y leer tarifas/licencias exactas durante el gate, no norma ya auditada en este plan.

<a id="fuentes-de-fx"></a>

- **FX:** [Norges Bank: datos abiertos de tipos de cambio](https://www.norges-bank.no/en/topics/Statistics/open-data/). Fuente indicativa de tipos; comprobar acceso CORS, términos y fecha para consumo directo/importado.

<a id="fuentes-de-open-data"></a>

- **OPEN-DATA:** [SSB: API y licencia de datos abiertos](https://www.ssb.no/en/api). Fuentes oficiales pueden aportar tablas estáticas; cada dataset mantiene atribución y fecha. No es un permiso genérico para otros proveedores.

<a id="fuentes-de-ch-footprint"></a>

- **CH-FOOTPRINT:** [BAFU/FOEN: indicadores de huella ambiental suiza](https://www.bafu.admin.ch/en/footprint). Referencia metodológica de huella de consumo, distinta del inventario territorial. No aporta por sí sola licencia para redistribuir Ecoinvent ni factores de todos los escenarios: localizar factores abiertos, alcance, unidades, versión y permiso antes de implementar CH049.

<a id="fuentes-de-ch-tax"></a>

- **CH-TAX:** [ESTV: calculadora oficial de impuestos](https://www.estv.admin.ch/de/steuerrechner-steuern-berechnen). Identifica ámbitos federal/cantonal/municipal y clases; se deben obtener reglas/datos, no solo resultados opacos.

<a id="fuentes-de-ch-bsv"></a>

- **CH-BSV:** [BSV: jubilación](https://www.bsv.admin.ch/de/in-rente-gehen). Renta estatal y previsión oficial; ampliar tablas por año y supuestos.

<a id="fuentes-de-ch-employ"></a>

- **CH-EMPLOY:** [arbeit.swiss: desempleo](https://www.arbeit.swiss/de/stellensuchende/faq-zur-arbeitslosenentschaedigung). Referencia oficial de salario asegurado, reglas y límites; caso individual no garantizado.

<a id="fuentes-de-ch-law"></a>

- **CH-LAW:** [Derecho suizo y organismos oficiales](https://www.fedlex.admin.ch/). Fuente primaria identificada para completar fichas contractuales; la norma exacta sigue siendo un gate futuro.

<a id="fuentes-de-ch-rent"></a>

- **CH-RENT:** [BWO: tipo hipotecario de referencia](https://www.bwo.admin.ch/de/referenzzinssatz). Tipo específico de alquiler y efectos; no sustituirlo por tipo director.

<a id="fuentes-de-ch-health"></a>

- **CH-HEALTH:** [Priminfo: franquicias](https://www.priminfo.admin.ch/de/sparen/franchisenrechner). Comparación oficial de costes/participaciones; primas introducidas por el usuario si no se distribuye tabla aprobada.

<a id="fuentes-de-ch-uid"></a>

- **CH-UID:** [Registro oficial UID](https://www.uid.admin.ch/). Organismo primario identificado; algoritmo/checksum y ejemplos por verificar antes de implementar. El registro vivo no se infiere del checksum.

<a id="fuentes-de-swiss-qr"></a>

- **SWISS-QR:** [SIX: estándares QR-bill](https://www.six-group.com/en/products-services/banking-services/payment-standardization/standards/qr-bill.html). Estándar, direcciones y transición de versión; comprobar vigencia en la fecha del futuro release.

<a id="fuentes-de-swiss-geo"></a>

- **SWISS-GEO:** [swisstopo: marcos y fórmulas de referencia](https://www.swisstopo.admin.ch/de/geodaetischer-bezugsrahmen). Fórmulas/precisión y rejillas para transformación local; no subir coordenadas al API oficial por defecto.

<a id="fuentes-de-growth"></a>

- **GROWTH:** [OMS: estándares de crecimiento](https://www.who.int/toolkits/child-growth-standards). Tablas y rangos; completar fixture/interpretación/licencia antes del producto.

<a id="fuentes-de-growth-cdc"></a>

- **GROWTH-CDC:** [CDC: uso de curvas de crecimiento](https://www.cdc.gov/growth-chart-training/). Contrastar estándar/rangos y no aplicar IMC de adulto a menores.

<a id="fuentes-de-dictionaries"></a>

- **DICTIONARIES:** [LibreOffice: diccionarios y patrones](https://github.com/LibreOffice/dictionaries). Licencia por diccionario, codificación, tamaño y morfología; no asumir una sola licencia para todo el repositorio.

<a id="fuentes-de-dictionary-license"></a>

- **DICTIONARY-LICENSE:** [Licencias de diccionarios de LibreOffice](https://api.libreoffice.org/share/readme/LICENSE.html). Revisar avisos/licencias individuales y redistribución comercial.

<a id="fuentes-de-game-rules"></a>

- **GAME-RULES:** [Pagat: juegos de Noruega](https://www.pagat.com/national/norway.html). Familias/reglas locales, no código o ilustraciones para copiar; leer página específica de cada juego.

<a id="fuentes-de-amerikaner"></a>

- **AMERIKANER:** [Reglas de Amerikaner](https://www.pagat.com/boston/amerikaner.html). Diferencia de contratos/reglas frente a otros juegos de bazas.

<a id="fuentes-de-word-competitor"></a>

- **WORD-COMPETITOR:** [Ordle](https://ordle.no/). Ejemplo de intención navegacional/competidor; no apropiarse de marca, banco de respuestas o arte.

<a id="fuentes-de-puzzle-intent"></a>

- **PUZZLE-INTENT:** [Ejemplo público de puzzle binario](https://cattern.app/de/binairo/). Comprender intención de Binairo/Takuzu; no copiar puzzles/implementación.

<a id="fuentes-de-local-cad"></a>

- **LOCAL-CAD:** [OCCT Import JS](https://github.com/kovacsv/occt-import-js). Motor candidato para STEP local; evaluar versión, licencia, tamaño y memoria antes de seleccionarlo.

<a id="fuentes-de-local-audio"></a>

- **LOCAL-AUDIO:** [Basic Pitch TS](https://github.com/spotify/basic-pitch-ts). Candidato para inferencia musical local; licencia Apache 2.0 del proyecto no sustituye probar modelo/assets concretos.

<a id="fuentes-de-local-astro"></a>

- **LOCAL-ASTRO:** [Astronomy Engine](https://github.com/cosinekitty/astronomy). Candidato identificado para posiciones; revisar licencia/funciones/versiones y comparar fixtures al implementar.

<a id="fuentes-de-dicom"></a>

- **DICOM:** [Cornerstone3D](https://github.com/cornerstonejs/cornerstone3D). Biblioteca de imágenes médicas con licencia MIT en el repo; evaluar códecs/datos y configuración exclusivamente local.

## 21. Inventario protegido completo de las 600 publicadas

Todas las filas significan **presencia en sitemap + página inglesa y canonical comprobados el 15-oct-2026**, con 36 rutas de idioma observadas. No son tareas nuevas ni certificación funcional exhaustiva de este turno. Los primeros 277 están en el host raíz y los otros 323 en Tools.

| Base | ID publicado | Nombre observado | Host | Idiomas |
| --- | --- | --- | --- | ---: |
| BASE-001 | `word-counter` | [Word Counter ](https://usefulverse.com/tools/word-counter/) | usefulverse.com | 36 |
| BASE-002 | `text-case-converter` | [Text Case Converter ](https://usefulverse.com/tools/text-case-converter/) | usefulverse.com | 36 |
| BASE-003 | `remove-duplicate-lines` | [Remove Duplicate Lines ](https://usefulverse.com/tools/remove-duplicate-lines/) | usefulverse.com | 36 |
| BASE-004 | `json-formatter` | [JSON Formatter ](https://usefulverse.com/tools/json-formatter/) | usefulverse.com | 36 |
| BASE-005 | `base64-encoder-decoder` | [Base64 Encoder & Decoder ](https://usefulverse.com/tools/base64-encoder-decoder/) | usefulverse.com | 36 |
| BASE-006 | `url-encoder-decoder` | [URL Encoder & Decoder ](https://usefulverse.com/tools/url-encoder-decoder/) | usefulverse.com | 36 |
| BASE-007 | `text-to-slug` | [Text to Slug ](https://usefulverse.com/tools/text-to-slug/) | usefulverse.com | 36 |
| BASE-008 | `percentage-calculator` | [Percentage Calculator ](https://usefulverse.com/tools/percentage-calculator/) | usefulverse.com | 36 |
| BASE-009 | `password-generator` | [Password Generator ](https://usefulverse.com/tools/password-generator/) | usefulverse.com | 36 |
| BASE-010 | `timestamp-converter` | [Timestamp Converter ](https://usefulverse.com/tools/timestamp-converter/) | usefulverse.com | 36 |
| BASE-011 | `html-entity-encoder-decoder` | [HTML Entity Encoder & Decoder ](https://usefulverse.com/tools/html-entity-encoder-decoder/) | usefulverse.com | 36 |
| BASE-012 | `csv-to-json` | [CSV to JSON Converter ](https://usefulverse.com/tools/csv-to-json/) | usefulverse.com | 36 |
| BASE-013 | `json-to-csv` | [JSON to CSV Converter ](https://usefulverse.com/tools/json-to-csv/) | usefulverse.com | 36 |
| BASE-014 | `random-number-generator` | [Random Number Generator ](https://usefulverse.com/tools/random-number-generator/) | usefulverse.com | 36 |
| BASE-015 | `uuid-generator` | [UUID Generator ](https://usefulverse.com/tools/uuid-generator/) | usefulverse.com | 36 |
| BASE-016 | `sha256-hash-generator` | [SHA-256 Hash Generator ](https://usefulverse.com/tools/sha256-hash-generator/) | usefulverse.com | 36 |
| BASE-017 | `regex-tester` | [Regex Tester ](https://usefulverse.com/tools/regex-tester/) | usefulverse.com | 36 |
| BASE-018 | `jwt-decoder` | [JWT Decoder ](https://usefulverse.com/tools/jwt-decoder/) | usefulverse.com | 36 |
| BASE-019 | `color-converter` | [Color Converter ](https://usefulverse.com/tools/color-converter/) | usefulverse.com | 36 |
| BASE-020 | `url-parser` | [URL Parser ](https://usefulverse.com/tools/url-parser/) | usefulverse.com | 36 |
| BASE-021 | `roman-numeral-converter` | [Roman Numeral Converter ](https://usefulverse.com/tools/roman-numeral-converter/) | usefulverse.com | 36 |
| BASE-022 | `binary-converter` | [Binary Converter ](https://usefulverse.com/tools/binary-converter/) | usefulverse.com | 36 |
| BASE-023 | `prime-number-checker` | [Prime Number Checker ](https://usefulverse.com/tools/prime-number-checker/) | usefulverse.com | 36 |
| BASE-024 | `average-calculator` | [Average Calculator ](https://usefulverse.com/tools/average-calculator/) | usefulverse.com | 36 |
| BASE-025 | `ratio-proportion-calculator` | [Ratio & Proportion Calculator ](https://usefulverse.com/tools/ratio-proportion-calculator/) | usefulverse.com | 36 |
| BASE-026 | `time-duration-calculator` | [Time Duration Calculator ](https://usefulverse.com/tools/time-duration-calculator/) | usefulverse.com | 36 |
| BASE-027 | `number-to-words-converter` | [Number to Words Converter ](https://usefulverse.com/tools/number-to-words-converter/) | usefulverse.com | 36 |
| BASE-028 | `remove-line-breaks` | [Remove Line Breaks ](https://usefulverse.com/tools/remove-line-breaks/) | usefulverse.com | 36 |
| BASE-029 | `text-diff-checker` | [Text Diff Checker ](https://usefulverse.com/tools/text-diff-checker/) | usefulverse.com | 36 |
| BASE-030 | `unit-converter` | [Unit Converter ](https://usefulverse.com/tools/unit-converter/) | usefulverse.com | 36 |
| BASE-031 | `date-calculator` | [Date Calculator ](https://usefulverse.com/tools/date-calculator/) | usefulverse.com | 36 |
| BASE-032 | `qr-code-generator` | [QR Code Generator ](https://usefulverse.com/tools/qr-code-generator/) | usefulverse.com | 36 |
| BASE-033 | `time-zone-converter` | [Time Zone Converter ](https://usefulverse.com/tools/time-zone-converter/) | usefulverse.com | 36 |
| BASE-034 | `xml-formatter` | [XML Formatter & Validator ](https://usefulverse.com/tools/xml-formatter/) | usefulverse.com | 36 |
| BASE-035 | `color-contrast-checker` | [Color Contrast Checker ](https://usefulverse.com/tools/color-contrast-checker/) | usefulverse.com | 36 |
| BASE-036 | `tip-calculator` | [Tip Calculator & Bill Splitter ](https://usefulverse.com/tools/tip-calculator/) | usefulverse.com | 36 |
| BASE-037 | `gpa-calculator` | [GPA Calculator ](https://usefulverse.com/tools/gpa-calculator/) | usefulverse.com | 36 |
| BASE-038 | `file-checksum` | [File Checksum Calculator ](https://usefulverse.com/tools/file-checksum/) | usefulverse.com | 36 |
| BASE-039 | `image-resizer-compressor` | [Image Compressor & Resizer ](https://usefulverse.com/tools/image-resizer-compressor/) | usefulverse.com | 36 |
| BASE-040 | `pdf-tools` | [PDF Merge, Split & Compressor ](https://usefulverse.com/tools/pdf-tools/) | usefulverse.com | 36 |
| BASE-041 | `pdf-protect-unlock` | [Protect or Unlock a PDF with a Password ](https://usefulverse.com/tools/pdf-protect-unlock/) | usefulverse.com | 36 |
| BASE-042 | `pdf-repair` | [Repair a Damaged PDF File ](https://usefulverse.com/tools/pdf-repair/) | usefulverse.com | 36 |
| BASE-043 | `pdf-crop` | [Crop PDF Pages Online ](https://usefulverse.com/tools/pdf-crop/) | usefulverse.com | 36 |
| BASE-044 | `pdf-redact` | [Permanently Redact PDF Online ](https://usefulverse.com/tools/pdf-redact/) | usefulverse.com | 36 |
| BASE-045 | `pdf-to-pdfa` | [Convert PDF to PDF/A-1b as an image copy ](https://usefulverse.com/tools/pdf-to-pdfa/) | usefulverse.com | 36 |
| BASE-046 | `video-compressor` | [Video Compressor ](https://usefulverse.com/tools/video-compressor/) | usefulverse.com | 36 |
| BASE-047 | `audio-compressor` | [Audio Compressor ](https://usefulverse.com/tools/audio-compressor/) | usefulverse.com | 36 |
| BASE-048 | `media-transcriber` | [Audio & Video to Text Transcriber ](https://usefulverse.com/tools/media-transcriber/) | usefulverse.com | 36 |
| BASE-049 | `csv-viewer` | [CSV Viewer ](https://usefulverse.com/tools/csv-viewer/) | usefulverse.com | 36 |
| BASE-050 | `qr-code-reader` | [QR Code Reader ](https://usefulverse.com/tools/qr-code-reader/) | usefulverse.com | 36 |
| BASE-051 | `age-calculator` | [Age Calculator ](https://usefulverse.com/tools/age-calculator/) | usefulverse.com | 36 |
| BASE-052 | `business-days-calculator` | [Business Days Calculator ](https://usefulverse.com/tools/business-days-calculator/) | usefulverse.com | 36 |
| BASE-053 | `office-file-compressor` | [Word, Excel & PowerPoint File Compressor ](https://usefulverse.com/tools/office-file-compressor/) | usefulverse.com | 36 |
| BASE-054 | `image-to-pdf` | [Image to PDF Converter ](https://usefulverse.com/tools/image-to-pdf/) | usefulverse.com | 36 |
| BASE-055 | `favicon-generator` | [Favicon Generator ](https://usefulverse.com/tools/favicon-generator/) | usefulverse.com | 36 |
| BASE-056 | `image-format-converter` | [Image Format Converter ](https://usefulverse.com/tools/image-format-converter/) | usefulverse.com | 36 |
| BASE-057 | `markdown-html-converter` | [Markdown to HTML Converter ](https://usefulverse.com/tools/markdown-html-converter/) | usefulverse.com | 36 |
| BASE-058 | `json-yaml-converter` | [JSON to YAML Converter ](https://usefulverse.com/tools/json-yaml-converter/) | usefulverse.com | 36 |
| BASE-059 | `standard-deviation-calculator` | [Standard Deviation Calculator ](https://usefulverse.com/tools/standard-deviation-calculator/) | usefulverse.com | 36 |
| BASE-060 | `discount-calculator` | [Discount Calculator ](https://usefulverse.com/tools/discount-calculator/) | usefulverse.com | 36 |
| BASE-061 | `square-footage-calculator` | [Square Footage Calculator ](https://usefulverse.com/tools/square-footage-calculator/) | usefulverse.com | 36 |
| BASE-062 | `barcode-generator` | [Barcode Generator ](https://usefulverse.com/tools/barcode-generator/) | usefulverse.com | 36 |
| BASE-063 | `typing-speed-test` | [Typing Speed Test ](https://usefulverse.com/tools/typing-speed-test/) | usefulverse.com | 36 |
| BASE-064 | `fraction-calculator` | [Fraction Calculator ](https://usefulverse.com/tools/fraction-calculator/) | usefulverse.com | 36 |
| BASE-065 | `time-card-calculator` | [Time Card Calculator ](https://usefulverse.com/tools/time-card-calculator/) | usefulverse.com | 36 |
| BASE-066 | `online-timer` | [Online Timer, Stopwatch & Pomodoro ](https://usefulverse.com/tools/online-timer/) | usefulverse.com | 36 |
| BASE-067 | `lorem-ipsum-generator` | [Lorem Ipsum Generator ](https://usefulverse.com/tools/lorem-ipsum-generator/) | usefulverse.com | 36 |
| BASE-068 | `subnet-calculator` | [IPv4 Subnet Calculator ](https://usefulverse.com/tools/subnet-calculator/) | usefulverse.com | 36 |
| BASE-069 | `random-name-picker` | [Random Name Picker ](https://usefulverse.com/tools/random-name-picker/) | usefulverse.com | 36 |
| BASE-070 | `fuel-cost-calculator` | [Fuel Cost Calculator ](https://usefulverse.com/tools/fuel-cost-calculator/) | usefulverse.com | 36 |
| BASE-071 | `image-cropper` | [Image Cropper ](https://usefulverse.com/tools/image-cropper/) | usefulverse.com | 36 |
| BASE-072 | `pdf-to-image` | [PDF to JPG & PNG Converter ](https://usefulverse.com/tools/pdf-to-image/) | usefulverse.com | 36 |
| BASE-073 | `sql-formatter` | [SQL Formatter ](https://usefulverse.com/tools/sql-formatter/) | usefulverse.com | 36 |
| BASE-074 | `pdf-page-editor` | [PDF Page Organizer & Editor ](https://usefulverse.com/tools/pdf-page-editor/) | usefulverse.com | 36 |
| BASE-075 | `pdf-ocr` | [PDF OCR & Scanned Text Extractor ](https://usefulverse.com/tools/pdf-ocr/) | usefulverse.com | 36 |
| BASE-076 | `pdf-document-converter` | [PDF and Word Text Converter ](https://usefulverse.com/tools/pdf-document-converter/) | usefulverse.com | 36 |
| BASE-077 | `html-to-pdf` | [HTML to PDF Converter ](https://usefulverse.com/tools/html-to-pdf/) | usefulverse.com | 36 |
| BASE-078 | `pdf-to-markdown` | [PDF to Markdown Converter ](https://usefulverse.com/tools/pdf-to-markdown/) | usefulverse.com | 36 |
| BASE-079 | `pdf-form-filler` | [Fill PDF Forms & Add a Signature ](https://usefulverse.com/tools/pdf-form-filler/) | usefulverse.com | 36 |
| BASE-080 | `pdf-compare` | [Compare Two PDF Files ](https://usefulverse.com/tools/pdf-compare/) | usefulverse.com | 36 |
| BASE-081 | `zip-archive-tool` | [ZIP File Creator & Extractor ](https://usefulverse.com/tools/zip-archive-tool/) | usefulverse.com | 36 |
| BASE-082 | `media-converter` | [Audio & Video Converter and Trimmer ](https://usefulverse.com/tools/media-converter/) | usefulverse.com | 36 |
| BASE-083 | `scientific-calculator` | [Scientific Calculator ](https://usefulverse.com/tools/scientific-calculator/) | usefulverse.com | 36 |
| BASE-084 | `loan-calculator` | [Loan & Mortgage Payment Calculator ](https://usefulverse.com/tools/loan-calculator/) | usefulverse.com | 36 |
| BASE-085 | `compound-interest-calculator` | [Compound Interest & Savings Calculator ](https://usefulverse.com/tools/compound-interest-calculator/) | usefulverse.com | 36 |
| BASE-086 | `invoice-generator` | [Simple Invoice Generator ](https://usefulverse.com/tools/invoice-generator/) | usefulverse.com | 36 |
| BASE-087 | `resume-builder` | [Resume & CV Builder ](https://usefulverse.com/tools/resume-builder/) | usefulverse.com | 36 |
| BASE-088 | `portrait-background-remover` | [Portrait Background Remover ](https://usefulverse.com/tools/portrait-background-remover/) | usefulverse.com | 36 |
| BASE-089 | `gcd-lcm-calculator` | [GCD and LCM Calculator ](https://usefulverse.com/tools/gcd-lcm-calculator/) | usefulverse.com | 36 |
| BASE-090 | `scientific-notation-converter` | [Scientific Notation Converter ](https://usefulverse.com/tools/scientific-notation-converter/) | usefulverse.com | 36 |
| BASE-091 | `profit-margin-calculator` | [Profit Margin Calculator ](https://usefulverse.com/tools/profit-margin-calculator/) | usefulverse.com | 36 |
| BASE-092 | `salary-to-hourly-calculator` | [Salary to Hourly Pay Calculator ](https://usefulverse.com/tools/salary-to-hourly-calculator/) | usefulverse.com | 36 |
| BASE-093 | `image-to-text` | [Image to Text OCR ](https://usefulverse.com/tools/image-to-text/) | usefulverse.com | 36 |
| BASE-094 | `spreadsheet-converter` | [Spreadsheet to CSV Converter ](https://usefulverse.com/tools/spreadsheet-converter/) | usefulverse.com | 36 |
| BASE-095 | `subtitle-converter` | [SRT and VTT Subtitle Converter ](https://usefulverse.com/tools/subtitle-converter/) | usefulverse.com | 36 |
| BASE-096 | `image-collage-maker` | [Photo Collage Maker ](https://usefulverse.com/tools/image-collage-maker/) | usefulverse.com | 36 |
| BASE-097 | `image-metadata-remover` | [Image Metadata Remover ](https://usefulverse.com/tools/image-metadata-remover/) | usefulverse.com | 36 |
| BASE-098 | `gif-maker` | [Animated GIF Maker ](https://usefulverse.com/tools/gif-maker/) | usefulverse.com | 36 |
| BASE-099 | `screen-recorder` | [Screen Recorder ](https://usefulverse.com/tools/screen-recorder/) | usefulverse.com | 36 |
| BASE-100 | `voice-recorder` | [Voice Recorder ](https://usefulverse.com/tools/voice-recorder/) | usefulverse.com | 36 |
| BASE-101 | `room-planner` | [Free Online Room Planner — 2D Floor Plan ](https://usefulverse.com/tools/room-planner/) | usefulverse.com | 36 |
| BASE-102 | `go-game` | [Play Go Online Free — Local 9×9 Board Game ](https://usefulverse.com/tools/go-game/) | usefulverse.com | 36 |
| BASE-103 | `mahjong-solitaire` | [Mahjong Solitaire Online — Free Matching Puzzle ](https://usefulverse.com/tools/mahjong-solitaire/) | usefulverse.com | 36 |
| BASE-104 | `periodic-table` | [Interactive Periodic Table — Search Elements & Practice ](https://usefulverse.com/tools/periodic-table/) | usefulverse.com | 36 |
| BASE-105 | `audio-editor` | [Free Audio Editor Online — Trim, Fade & Export WAV ](https://usefulverse.com/tools/audio-editor/) | usefulverse.com | 36 |
| BASE-106 | `svg-editor` | [Free SVG Editor Online ](https://usefulverse.com/tools/svg-editor/) | usefulverse.com | 36 |
| BASE-107 | `seamless-pattern-maker` | [Free Seamless Pattern Generator ](https://usefulverse.com/tools/seamless-pattern-maker/) | usefulverse.com | 36 |
| BASE-108 | `html-form-builder` | [Free HTML Form Builder ](https://usefulverse.com/tools/html-form-builder/) | usefulverse.com | 36 |
| BASE-109 | `html-email-builder` | [Free HTML Email Template Builder ](https://usefulverse.com/tools/html-email-builder/) | usefulverse.com | 36 |
| BASE-110 | `color-vision-simulator` | [Free Color Blindness Simulator ](https://usefulverse.com/tools/color-vision-simulator/) | usefulverse.com | 36 |
| BASE-111 | `weekly-meal-planner` | [Free Weekly Meal Planner ](https://usefulverse.com/tools/weekly-meal-planner/) | usefulverse.com | 36 |
| BASE-112 | `reading-log` | [Free Reading Log ](https://usefulverse.com/tools/reading-log/) | usefulverse.com | 36 |
| BASE-113 | `time-tracker` | [Free Time Tracker ](https://usefulverse.com/tools/time-tracker/) | usefulverse.com | 36 |
| BASE-114 | `habit-tracker` | [Free Habit Tracker ](https://usefulverse.com/tools/habit-tracker/) | usefulverse.com | 36 |
| BASE-115 | `task-list` | [Task List ](https://usefulverse.com/tools/task-list/) | usefulverse.com | 36 |
| BASE-116 | `kanban-board` | [Kanban Board ](https://usefulverse.com/tools/kanban-board/) | usefulverse.com | 36 |
| BASE-117 | `reading-speed-test` | [Reading Speed Test Online ](https://usefulverse.com/tools/reading-speed-test/) | usefulverse.com | 36 |
| BASE-118 | `household-budget-planner` | [Household Budget Planner ](https://usefulverse.com/tools/household-budget-planner/) | usefulverse.com | 36 |
| BASE-119 | `seating-chart-maker` | [Seating Chart Maker ](https://usefulverse.com/tools/seating-chart-maker/) | usefulverse.com | 36 |
| BASE-120 | `gantt-chart-maker` | [Gantt Chart Maker ](https://usefulverse.com/tools/gantt-chart-maker/) | usefulverse.com | 36 |
| BASE-121 | `sprite-sheet-maker` | [Sprite Sheet Maker ](https://usefulverse.com/tools/sprite-sheet-maker/) | usefulverse.com | 36 |
| BASE-122 | `font-tester` | [Free Font Tester Online ](https://usefulverse.com/tools/font-tester/) | usefulverse.com | 36 |
| BASE-123 | `kakuro` | [Free Kakuro Sum Puzzle ](https://usefulverse.com/tools/kakuro/) | usefulverse.com | 36 |
| BASE-124 | `battleship` | [Free Battleship Game Online ](https://usefulverse.com/tools/battleship/) | usefulverse.com | 36 |
| BASE-125 | `drum-machine` | [Free Online Drum Machine ](https://usefulverse.com/tools/drum-machine/) | usefulverse.com | 36 |
| BASE-126 | `online-sequencer` | [Free Online Music Sequencer ](https://usefulverse.com/tools/online-sequencer/) | usefulverse.com | 36 |
| BASE-127 | `song-key-finder` | [Song Key Finder from Audio — Free Local Analysis ](https://usefulverse.com/tools/song-key-finder/) | usefulverse.com | 36 |
| BASE-128 | `audio-spectrogram` | [Audio Spectrogram — View Sound Frequencies Locally ](https://usefulverse.com/tools/audio-spectrogram/) | usefulverse.com | 36 |
| BASE-129 | `css-animation-generator` | [CSS Animation Generator ](https://usefulverse.com/tools/css-animation-generator/) | usefulverse.com | 36 |
| BASE-130 | `css-clip-path-editor` | [CSS Clip-Path Editor ](https://usefulverse.com/tools/css-clip-path-editor/) | usefulverse.com | 36 |
| BASE-131 | `css-filter-generator` | [CSS Filter Generator ](https://usefulverse.com/tools/css-filter-generator/) | usefulverse.com | 36 |
| BASE-132 | `api-request-builder` | [Create API Request Code — cURL & Fetch ](https://usefulverse.com/tools/api-request-builder/) | usefulverse.com | 36 |
| BASE-133 | `html-table-generator` | [Create HTML Tables from TSV ](https://usefulverse.com/tools/html-table-generator/) | usefulverse.com | 36 |
| BASE-134 | `pwa-manifest-generator` | [Create a PWA Web App Manifest ](https://usefulverse.com/tools/pwa-manifest-generator/) | usefulverse.com | 36 |
| BASE-135 | `connect-four` | [Four-in-a-Row Online — Local Two-Player Game ](https://usefulverse.com/tools/connect-four/) | usefulverse.com | 36 |
| BASE-136 | `reversi` | [Reversi Online — Local Two-Player Disk Game ](https://usefulverse.com/tools/reversi/) | usefulverse.com | 36 |
| BASE-137 | `checkers` | [Checkers Online — Free Local Two-Player Game ](https://usefulverse.com/tools/checkers/) | usefulverse.com | 36 |
| BASE-138 | `music-scale-finder` | [Music Scale Finder ](https://usefulverse.com/tools/music-scale-finder/) | usefulverse.com | 36 |
| BASE-139 | `fretboard-trainer` | [Guitar Fretboard Note Trainer ](https://usefulverse.com/tools/fretboard-trainer/) | usefulverse.com | 36 |
| BASE-140 | `bpm-detector` | [BPM Detector ](https://usefulverse.com/tools/bpm-detector/) | usefulverse.com | 36 |
| BASE-141 | `ear-training` | [Ear Training ](https://usefulverse.com/tools/ear-training/) | usefulverse.com | 36 |
| BASE-142 | `chess-clock` | [Chess Clock ](https://usefulverse.com/tools/chess-clock/) | usefulverse.com | 36 |
| BASE-143 | `tournament-bracket-generator` | [Tournament Bracket Generator ](https://usefulverse.com/tools/tournament-bracket-generator/) | usefulverse.com | 36 |
| BASE-144 | `mental-math-practice` | [Mental Math Practice ](https://usefulverse.com/tools/mental-math-practice/) | usefulverse.com | 36 |
| BASE-145 | `study-planner` | [Study Planner ](https://usefulverse.com/tools/study-planner/) | usefulverse.com | 36 |
| BASE-146 | `equation-solver` | [Equation Solver ](https://usefulverse.com/tools/equation-solver/) | usefulverse.com | 36 |
| BASE-147 | `system-of-equations-calculator` | [System of Equations Calculator ](https://usefulverse.com/tools/system-of-equations-calculator/) | usefulverse.com | 36 |
| BASE-148 | `polynomial-factorization-calculator` | [Polynomial Factorization Calculator ](https://usefulverse.com/tools/polynomial-factorization-calculator/) | usefulverse.com | 36 |
| BASE-149 | `probability-calculator` | [Probability Calculator ](https://usefulverse.com/tools/probability-calculator/) | usefulverse.com | 36 |
| BASE-150 | `z-score-calculator` | [Z-Score and Percentile Calculator ](https://usefulverse.com/tools/z-score-calculator/) | usefulverse.com | 36 |
| BASE-151 | `coordinate-geometry-calculator` | [Coordinate Geometry Calculator ](https://usefulverse.com/tools/coordinate-geometry-calculator/) | usefulverse.com | 36 |
| BASE-152 | `long-division-calculator` | [Long Division Calculator with Steps ](https://usefulverse.com/tools/long-division-calculator/) | usefulverse.com | 36 |
| BASE-153 | `rounding-calculator` | [Rounding and Significant Figures Calculator ](https://usefulverse.com/tools/rounding-calculator/) | usefulverse.com | 36 |
| BASE-154 | `tax-calculator` | [Sales Tax, VAT and GST Calculator ](https://usefulverse.com/tools/tax-calculator/) | usefulverse.com | 36 |
| BASE-155 | `commission-calculator` | [Commission Calculator ](https://usefulverse.com/tools/commission-calculator/) | usefulverse.com | 36 |
| BASE-156 | `credit-card-payoff-calculator` | [Credit Card Payoff Calculator ](https://usefulverse.com/tools/credit-card-payoff-calculator/) | usefulverse.com | 36 |
| BASE-157 | `unit-price-calculator` | [Unit Price Calculator ](https://usefulverse.com/tools/unit-price-calculator/) | usefulverse.com | 36 |
| BASE-158 | `concrete-calculator` | [Concrete Calculator ](https://usefulverse.com/tools/concrete-calculator/) | usefulverse.com | 36 |
| BASE-159 | `tile-calculator` | [Tile Calculator ](https://usefulverse.com/tools/tile-calculator/) | usefulverse.com | 36 |
| BASE-160 | `receipt-generator` | [Receipt Generator ](https://usefulverse.com/tools/receipt-generator/) | usefulverse.com | 36 |
| BASE-161 | `quotation-generator` | [Quotation and Estimate Generator ](https://usefulverse.com/tools/quotation-generator/) | usefulverse.com | 36 |
| BASE-162 | `morse-code-translator` | [Morse Code Translator ](https://usefulverse.com/tools/morse-code-translator/) | usefulverse.com | 36 |
| BASE-163 | `online-metronome` | [Online Metronome with Tap Tempo ](https://usefulverse.com/tools/online-metronome/) | usefulverse.com | 36 |
| BASE-164 | `keyboard-tester` | [Keyboard Tester ](https://usefulverse.com/tools/keyboard-tester/) | usefulverse.com | 36 |
| BASE-165 | `mouse-tester` | [Mouse Tester and Click Speed Test ](https://usefulverse.com/tools/mouse-tester/) | usefulverse.com | 36 |
| BASE-166 | `reaction-time-test` | [Reaction Time Test ](https://usefulverse.com/tools/reaction-time-test/) | usefulverse.com | 36 |
| BASE-167 | `combinatorics-calculator` | [Combinations and Permutations Calculator ](https://usefulverse.com/tools/combinatorics-calculator/) | usefulverse.com | 36 |
| BASE-168 | `probability-distribution-calculator` | [Normal, Binomial and Poisson Distribution Calculator ](https://usefulverse.com/tools/probability-distribution-calculator/) | usefulverse.com | 36 |
| BASE-169 | `confidence-interval-calculator` | [Confidence Interval Calculator for a Mean ](https://usefulverse.com/tools/confidence-interval-calculator/) | usefulverse.com | 36 |
| BASE-170 | `sample-size-calculator` | [Survey Sample Size Calculator ](https://usefulverse.com/tools/sample-size-calculator/) | usefulverse.com | 36 |
| BASE-171 | `linear-regression-calculator` | [Linear Regression and Correlation Calculator ](https://usefulverse.com/tools/linear-regression-calculator/) | usefulverse.com | 36 |
| BASE-172 | `triangle-calculator` | [Triangle Calculator from Three Sides ](https://usefulverse.com/tools/triangle-calculator/) | usefulverse.com | 36 |
| BASE-173 | `volume-calculator` | [Volume and Surface Area Calculator ](https://usefulverse.com/tools/volume-calculator/) | usefulverse.com | 36 |
| BASE-174 | `sequence-calculator` | [Arithmetic and Geometric Sequence Calculator ](https://usefulverse.com/tools/sequence-calculator/) | usefulverse.com | 36 |
| BASE-175 | `break-even-calculator` | [Break-Even Point Calculator ](https://usefulverse.com/tools/break-even-calculator/) | usefulverse.com | 36 |
| BASE-176 | `roi-cagr-calculator` | [ROI and CAGR Calculator ](https://usefulverse.com/tools/roi-cagr-calculator/) | usefulverse.com | 36 |
| BASE-177 | `depreciation-calculator` | [Depreciation Calculator ](https://usefulverse.com/tools/depreciation-calculator/) | usefulverse.com | 36 |
| BASE-178 | `dimensional-weight-calculator` | [Dimensional Weight Calculator ](https://usefulverse.com/tools/dimensional-weight-calculator/) | usefulverse.com | 36 |
| BASE-179 | `paint-calculator` | [Paint Calculator ](https://usefulverse.com/tools/paint-calculator/) | usefulverse.com | 36 |
| BASE-180 | `board-foot-calculator` | [Board Foot and Lumber Calculator ](https://usefulverse.com/tools/board-foot-calculator/) | usefulverse.com | 36 |
| BASE-181 | `recipe-scaler` | [Recipe Ingredient Scaler ](https://usefulverse.com/tools/recipe-scaler/) | usefulverse.com | 36 |
| BASE-182 | `iban-validator` | [IBAN Validator and Format Checker ](https://usefulverse.com/tools/iban-validator/) | usefulverse.com | 36 |
| BASE-183 | `utm-builder` | [UTM Link Builder ](https://usefulverse.com/tools/utm-builder/) | usefulverse.com | 36 |
| BASE-184 | `robots-txt-generator` | [Robots.txt Generator ](https://usefulverse.com/tools/robots-txt-generator/) | usefulverse.com | 36 |
| BASE-185 | `sitemap-xml-generator` | [XML Sitemap Generator from URLs ](https://usefulverse.com/tools/sitemap-xml-generator/) | usefulverse.com | 36 |
| BASE-186 | `json-ld-generator` | [JSON-LD Schema Generator ](https://usefulverse.com/tools/json-ld-generator/) | usefulverse.com | 36 |
| BASE-187 | `meta-tag-generator` | [Meta Tag and Open Graph Generator ](https://usefulverse.com/tools/meta-tag-generator/) | usefulverse.com | 36 |
| BASE-188 | `css-gradient-generator` | [CSS Gradient Generator ](https://usefulverse.com/tools/css-gradient-generator/) | usefulverse.com | 36 |
| BASE-189 | `css-box-shadow-generator` | [CSS Box Shadow Generator ](https://usefulverse.com/tools/css-box-shadow-generator/) | usefulverse.com | 36 |
| BASE-190 | `color-palette-generator` | [Color Palette Generator ](https://usefulverse.com/tools/color-palette-generator/) | usefulverse.com | 36 |
| BASE-191 | `css-grid-generator` | [CSS Grid and Flexbox Generator ](https://usefulverse.com/tools/css-grid-generator/) | usefulverse.com | 36 |
| BASE-192 | `polynomial-derivative-calculator` | [Polynomial Derivative Calculator ](https://usefulverse.com/tools/polynomial-derivative-calculator/) | usefulverse.com | 36 |
| BASE-193 | `polynomial-integral-calculator` | [Polynomial Integral Calculator ](https://usefulverse.com/tools/polynomial-integral-calculator/) | usefulverse.com | 36 |
| BASE-194 | `matrix-calculator` | [Matrix Calculator ](https://usefulverse.com/tools/matrix-calculator/) | usefulverse.com | 36 |
| BASE-195 | `truth-table-generator` | [Logic Truth Table Generator ](https://usefulverse.com/tools/truth-table-generator/) | usefulverse.com | 36 |
| BASE-196 | `cash-flow-irr-calculator` | [NPV and IRR Cash Flow Calculator ](https://usefulverse.com/tools/cash-flow-irr-calculator/) | usefulverse.com | 36 |
| BASE-197 | `debt-payoff-planner` | [Debt Payoff Planner: Avalanche vs Snowball ](https://usefulverse.com/tools/debt-payoff-planner/) | usefulverse.com | 36 |
| BASE-198 | `rent-vs-buy-calculator` | [Rent vs Buy Calculator ](https://usefulverse.com/tools/rent-vs-buy-calculator/) | usefulverse.com | 36 |
| BASE-199 | `statistical-test-calculator` | [Statistical Test Calculator ](https://usefulverse.com/tools/statistical-test-calculator/) | usefulverse.com | 36 |
| BASE-200 | `citation-generator` | [APA, MLA and Chicago Citation Generator ](https://usefulverse.com/tools/citation-generator/) | usefulverse.com | 36 |
| BASE-201 | `json-schema-validator` | [JSON Schema Validator ](https://usefulverse.com/tools/json-schema-validator/) | usefulverse.com | 36 |
| BASE-202 | `jsonpath-query-tool` | [JSONPath Query Tool ](https://usefulverse.com/tools/jsonpath-query-tool/) | usefulverse.com | 36 |
| BASE-203 | `printable-calendar-maker` | [Printable Calendar Maker ](https://usefulverse.com/tools/printable-calendar-maker/) | usefulverse.com | 36 |
| BASE-204 | `flashcard-maker` | [Flashcard Maker ](https://usefulverse.com/tools/flashcard-maker/) | usefulverse.com | 36 |
| BASE-205 | `word-search-maker` | [Word Search Puzzle Maker ](https://usefulverse.com/tools/word-search-maker/) | usefulverse.com | 36 |
| BASE-206 | `bingo-card-generator` | [Bingo Card Generator ](https://usefulverse.com/tools/bingo-card-generator/) | usefulverse.com | 36 |
| BASE-207 | `adult-bmi-calculator` | [Adult BMI Calculator ](https://usefulverse.com/tools/adult-bmi-calculator/) | usefulverse.com | 36 |
| BASE-208 | `bmr-tdee-calculator` | [BMR and TDEE Calculator ](https://usefulverse.com/tools/bmr-tdee-calculator/) | usefulverse.com | 36 |
| BASE-209 | `macro-calorie-calculator` | [Macro and Calorie Calculator ](https://usefulverse.com/tools/macro-calorie-calculator/) | usefulverse.com | 36 |
| BASE-210 | `running-pace-calculator` | [Running Pace Calculator ](https://usefulverse.com/tools/running-pace-calculator/) | usefulverse.com | 36 |
| BASE-211 | `one-rep-max-calculator` | [One Rep Max Calculator ](https://usefulverse.com/tools/one-rep-max-calculator/) | usefulverse.com | 36 |
| BASE-212 | `cover-letter-builder` | [Cover Letter Builder ](https://usefulverse.com/tools/cover-letter-builder/) | usefulverse.com | 36 |
| BASE-213 | `test-data-generator` | [Test Data Generator ](https://usefulverse.com/tools/test-data-generator/) | usefulverse.com | 36 |
| BASE-214 | `math-worksheet-generator` | [Math Worksheet Generator ](https://usefulverse.com/tools/math-worksheet-generator/) | usefulverse.com | 36 |
| BASE-215 | `local-notepad` | [Private Local Notepad ](https://usefulverse.com/tools/local-notepad/) | usefulverse.com | 36 |
| BASE-216 | `teleprompter-online` | [Online Teleprompter ](https://usefulverse.com/tools/teleprompter-online/) | usefulverse.com | 36 |
| BASE-217 | `function-grapher` | [Function Grapher ](https://usefulverse.com/tools/function-grapher/) | usefulverse.com | 36 |
| BASE-218 | `crossword-maker` | [Crossword Maker ](https://usefulverse.com/tools/crossword-maker/) | usefulverse.com | 36 |
| BASE-219 | `html-formatter` | [HTML Formatter and Minifier ](https://usefulverse.com/tools/html-formatter/) | usefulverse.com | 36 |
| BASE-220 | `css-formatter` | [CSS Formatter and Minifier ](https://usefulverse.com/tools/css-formatter/) | usefulverse.com | 36 |
| BASE-221 | `javascript-formatter` | [JavaScript Formatter and Minifier ](https://usefulverse.com/tools/javascript-formatter/) | usefulverse.com | 36 |
| BASE-222 | `html-css-js-playground` | [HTML CSS JavaScript Playground ](https://usefulverse.com/tools/html-css-js-playground/) | usefulverse.com | 36 |
| BASE-223 | `sqlite-playground` | [SQLite Playground ](https://usefulverse.com/tools/sqlite-playground/) | usefulverse.com | 36 |
| BASE-224 | `cron-expression-builder` | [Cron Expression Builder ](https://usefulverse.com/tools/cron-expression-builder/) | usefulverse.com | 36 |
| BASE-225 | `hex-editor` | [Hex Editor ](https://usefulverse.com/tools/hex-editor/) | usefulverse.com | 36 |
| BASE-226 | `image-editor` | [Image Editor ](https://usefulverse.com/tools/image-editor/) | usefulverse.com | 36 |
| BASE-227 | `image-watermark-tool` | [Image Watermark Tool ](https://usefulverse.com/tools/image-watermark-tool/) | usefulverse.com | 36 |
| BASE-228 | `passport-photo-maker` | [Passport Photo Maker ](https://usefulverse.com/tools/passport-photo-maker/) | usefulverse.com | 36 |
| BASE-229 | `meme-maker` | [Meme Maker ](https://usefulverse.com/tools/meme-maker/) | usefulverse.com | 36 |
| BASE-230 | `svg-optimizer` | [SVG Optimizer ](https://usefulverse.com/tools/svg-optimizer/) | usefulverse.com | 36 |
| BASE-231 | `pixel-art-editor` | [Pixel Art Editor ](https://usefulverse.com/tools/pixel-art-editor/) | usefulverse.com | 36 |
| BASE-232 | `chart-maker` | [Chart Maker from CSV ](https://usefulverse.com/tools/chart-maker/) | usefulverse.com | 36 |
| BASE-233 | `diagram-maker` | [Simple Diagram Maker ](https://usefulverse.com/tools/diagram-maker/) | usefulverse.com | 36 |
| BASE-234 | `latex-equation-renderer` | [LaTeX Equation Renderer ](https://usefulverse.com/tools/latex-equation-renderer/) | usefulverse.com | 36 |
| BASE-235 | `business-card-maker` | [Business Card Maker ](https://usefulverse.com/tools/business-card-maker/) | usefulverse.com | 36 |
| BASE-236 | `body-fat-calculator` | [Body Fat Estimate Calculator ](https://usefulverse.com/tools/body-fat-calculator/) | usefulverse.com | 36 |
| BASE-237 | `due-date-calculator` | [Pregnancy Due Date Calculator ](https://usefulverse.com/tools/due-date-calculator/) | usefulverse.com | 36 |
| BASE-238 | `cycle-calendar-estimator` | [Cycle Calendar Estimator ](https://usefulverse.com/tools/cycle-calendar-estimator/) | usefulverse.com | 36 |
| BASE-239 | `ascii-art-generator` | [ASCII Art Generator ](https://usefulverse.com/tools/ascii-art-generator/) | usefulverse.com | 36 |
| BASE-240 | `guitar-tuner` | [Guitar Tuner ](https://usefulverse.com/tools/guitar-tuner/) | usefulverse.com | 36 |
| BASE-241 | `virtual-piano` | [Virtual Piano ](https://usefulverse.com/tools/virtual-piano/) | usefulverse.com | 36 |
| BASE-242 | `guitar-chord-finder` | [Guitar Chord Finder ](https://usefulverse.com/tools/guitar-chord-finder/) | usefulverse.com | 36 |
| BASE-243 | `noise-generator` | [White, Pink and Brown Noise Generator ](https://usefulverse.com/tools/noise-generator/) | usefulverse.com | 36 |
| BASE-244 | `webcam-tester` | [Webcam Tester ](https://usefulverse.com/tools/webcam-tester/) | usefulverse.com | 36 |
| BASE-245 | `speaker-tester` | [Speaker and Channel Tester ](https://usefulverse.com/tools/speaker-tester/) | usefulverse.com | 36 |
| BASE-246 | `packing-list-maker` | [Free Packing List Maker ](https://usefulverse.com/tools/packing-list-maker/) | usefulverse.com | 36 |
| BASE-247 | `decision-matrix` | [Decision Matrix Calculator ](https://usefulverse.com/tools/decision-matrix/) | usefulverse.com | 36 |
| BASE-248 | `workout-planner` | [Workout Planner ](https://usefulverse.com/tools/workout-planner/) | usefulverse.com | 36 |
| BASE-249 | `quiz-maker` | [Free Quiz Maker ](https://usefulverse.com/tools/quiz-maker/) | usefulverse.com | 36 |
| BASE-250 | `memory-game` | [Free Online Memory Matching Game ](https://usefulverse.com/tools/memory-game/) | usefulverse.com | 36 |
| BASE-251 | `kana-practice` | [Free Hiragana and Katakana Practice ](https://usefulverse.com/tools/kana-practice/) | usefulverse.com | 36 |
| BASE-252 | `abacus-practice` | [Free Interactive Abacus Practice ](https://usefulverse.com/tools/abacus-practice/) | usefulverse.com | 36 |
| BASE-253 | `spelling-practice` | [Free Spelling Practice with Your Own Words ](https://usefulverse.com/tools/spelling-practice/) | usefulverse.com | 36 |
| BASE-254 | `hangul-practice` | [Free Hangul Practice for Korean Letters ](https://usefulverse.com/tools/hangul-practice/) | usefulverse.com | 36 |
| BASE-255 | `2048-game` | [Free 2048 Number Merge Puzzle ](https://usefulverse.com/tools/2048-game/) | usefulverse.com | 36 |
| BASE-256 | `sudoku` | [Free Sudoku Online — Unique Puzzles ](https://usefulverse.com/tools/sudoku/) | usefulverse.com | 36 |
| BASE-257 | `tic-tac-toe` | [Free Tic-Tac-Toe Online — Play vs Computer ](https://usefulverse.com/tools/tic-tac-toe/) | usefulverse.com | 36 |
| BASE-258 | `chess-game` | [Free Online Chess — Legal Moves & PGN ](https://usefulverse.com/tools/chess-game/) | usefulverse.com | 36 |
| BASE-259 | `solitaire` | [Free Online Solitaire — Klondike Card Game ](https://usefulverse.com/tools/solitaire/) | usefulverse.com | 36 |
| BASE-260 | `minesweeper` | [Free Online Minesweeper — Safe First Click ](https://usefulverse.com/tools/minesweeper/) | usefulverse.com | 36 |
| BASE-261 | `nonogram` | [Free Nonogram Puzzle — Unique Logic Picross ](https://usefulverse.com/tools/nonogram/) | usefulverse.com | 36 |
| BASE-262 | `sliding-puzzle` | [Free Sliding Puzzle — 3×3, 4×4 and 5×5 ](https://usefulverse.com/tools/sliding-puzzle/) | usefulverse.com | 36 |
| BASE-263 | `screen-ruler` | [Online Screen Ruler — Measure in Pixels ](https://usefulverse.com/tools/screen-ruler/) | usefulverse.com | 36 |
| BASE-264 | `protractor` | [Online Protractor — Measure an Angle ](https://usefulverse.com/tools/protractor/) | usefulverse.com | 36 |
| BASE-265 | `printable-label-maker` | [Printable Label Maker — Free A4 and Letter Sheets ](https://usefulverse.com/tools/printable-label-maker/) | usefulverse.com | 36 |
| BASE-266 | `poster-maker` | [Free Poster Maker — Create a Printable Poster ](https://usefulverse.com/tools/poster-maker/) | usefulverse.com | 36 |
| BASE-267 | `certificate-maker` | [Free Certificate Maker — Printable Award Template ](https://usefulverse.com/tools/certificate-maker/) | usefulverse.com | 36 |
| BASE-268 | `invitation-maker` | [Free Invitation Maker — Printable Event Invitation ](https://usefulverse.com/tools/invitation-maker/) | usefulverse.com | 36 |
| BASE-269 | `audio-looper` | [Free Audio Looper — Repeat a Clip and Export WAV ](https://usefulverse.com/tools/audio-looper/) | usefulverse.com | 36 |
| BASE-270 | `molecule-viewer` | [Interactive Molecule Viewer — Explore 2D Structures ](https://usefulverse.com/tools/molecule-viewer/) | usefulverse.com | 36 |
| BASE-271 | `photo-mosaic-maker` | [Photo Mosaic Maker — Create a Pixel Mosaic Locally ](https://usefulverse.com/tools/photo-mosaic-maker/) | usefulverse.com | 36 |
| BASE-272 | `epub-reader` | [Free EPUB Reader — Read a Book in Your Browser ](https://usefulverse.com/tools/epub-reader/) | usefulverse.com | 36 |
| BASE-273 | `epub-metadata-editor` | [EPUB Metadata Editor — Edit Book Details Locally ](https://usefulverse.com/tools/epub-metadata-editor/) | usefulverse.com | 36 |
| BASE-274 | `backgammon` | [Free Backgammon Game — Two Players on One Device ](https://usefulverse.com/tools/backgammon/) | usefulverse.com | 36 |
| BASE-275 | `tangram` | [Tangram Puzzle — Arrange Seven Pieces ](https://usefulverse.com/tools/tangram/) | usefulverse.com | 36 |
| BASE-276 | `jigsaw-puzzle` | [Jigsaw Puzzle Maker — Turn a Photo into a Puzzle ](https://usefulverse.com/tools/jigsaw-puzzle/) | usefulverse.com | 36 |
| BASE-277 | `music-score-editor` | [Music Score Editor — Write and Export a Simple Score ](https://usefulverse.com/tools/music-score-editor/) | usefulverse.com | 36 |
| BASE-278 | `btu-calculator` | [BTU calculator ](https://tools.usefulverse.com/tools/btu-calculator/) | tools.usefulverse.com | 36 |
| BASE-279 | `solar-panel-calculator` | [Solar panel calculator ](https://tools.usefulverse.com/tools/solar-panel-calculator/) | tools.usefulverse.com | 36 |
| BASE-280 | `paver-calculator` | [Paver calculator ](https://tools.usefulverse.com/tools/paver-calculator/) | tools.usefulverse.com | 36 |
| BASE-281 | `image-color-picker` | [Image color picker ](https://tools.usefulverse.com/tools/image-color-picker/) | tools.usefulverse.com | 36 |
| BASE-282 | `image-region-redactor` | [Image pixelator ](https://tools.usefulverse.com/tools/image-region-redactor/) | tools.usefulverse.com | 36 |
| BASE-283 | `image-sharpener` | [Image sharpener ](https://tools.usefulverse.com/tools/image-sharpener/) | tools.usefulverse.com | 36 |
| BASE-284 | `image-splitter` | [Image Splitter ](https://tools.usefulverse.com/tools/image-splitter/) | tools.usefulverse.com | 36 |
| BASE-285 | `image-upscaler` | [AI image upscaler ](https://tools.usefulverse.com/tools/image-upscaler/) | tools.usefulverse.com | 36 |
| BASE-286 | `wallpaper-calculator` | [Wallpaper calculator ](https://tools.usefulverse.com/tools/wallpaper-calculator/) | tools.usefulverse.com | 36 |
| BASE-287 | `mulch-calculator` | [Mulch calculator ](https://tools.usefulverse.com/tools/mulch-calculator/) | tools.usefulverse.com | 36 |
| BASE-288 | `pool-salt-calculator` | [Pool salt calculator ](https://tools.usefulverse.com/tools/pool-salt-calculator/) | tools.usefulverse.com | 36 |
| BASE-289 | `fence-calculator` | [Fence calculator ](https://tools.usefulverse.com/tools/fence-calculator/) | tools.usefulverse.com | 36 |
| BASE-290 | `baluster-spacing-calculator` | [Baluster Spacing Calculator ](https://tools.usefulverse.com/tools/baluster-spacing-calculator/) | tools.usefulverse.com | 36 |
| BASE-291 | `retaining-wall-calculator` | [Retaining Wall Calculator ](https://tools.usefulverse.com/tools/retaining-wall-calculator/) | tools.usefulverse.com | 36 |
| BASE-292 | `battery-runtime-calculator` | [Battery Runtime Calculator ](https://tools.usefulverse.com/tools/battery-runtime-calculator/) | tools.usefulverse.com | 36 |
| BASE-293 | `lumber-cut-calculator` | [Lumber Cut List Optimizer ](https://tools.usefulverse.com/tools/lumber-cut-calculator/) | tools.usefulverse.com | 36 |
| BASE-294 | `plant-spacing-calculator` | [Plant Spacing Calculator ](https://tools.usefulverse.com/tools/plant-spacing-calculator/) | tools.usefulverse.com | 36 |
| BASE-295 | `ev-charging-calculator` | [EV Charging Calculator ](https://tools.usefulverse.com/tools/ev-charging-calculator/) | tools.usefulverse.com | 36 |
| BASE-296 | `rainwater-harvesting-calculator` | [Rainwater Harvesting Calculator ](https://tools.usefulverse.com/tools/rainwater-harvesting-calculator/) | tools.usefulverse.com | 36 |
| BASE-297 | `ramp-calculator` | [Ramp Calculator ](https://tools.usefulverse.com/tools/ramp-calculator/) | tools.usefulverse.com | 36 |
| BASE-298 | `heat-loss-calculator` | [Heat Loss Calculator ](https://tools.usefulverse.com/tools/heat-loss-calculator/) | tools.usefulverse.com | 36 |
| BASE-299 | `heat-pump-calculator` | [Heat Pump Calculator ](https://tools.usefulverse.com/tools/heat-pump-calculator/) | tools.usefulverse.com | 36 |
| BASE-300 | `thermal-expansion-calculator` | [Thermal Expansion Calculator ](https://tools.usefulverse.com/tools/thermal-expansion-calculator/) | tools.usefulverse.com | 36 |
| BASE-301 | `specific-heat-calculator` | [Specific Heat Calculator ](https://tools.usefulverse.com/tools/specific-heat-calculator/) | tools.usefulverse.com | 36 |
| BASE-302 | `molarity-calculator` | [Molarity Calculator ](https://tools.usefulverse.com/tools/molarity-calculator/) | tools.usefulverse.com | 36 |
| BASE-303 | `ph-calculator` | [pH Calculator ](https://tools.usefulverse.com/tools/ph-calculator/) | tools.usefulverse.com | 36 |
| BASE-304 | `section-modulus-calculator` | [Section Modulus Calculator ](https://tools.usefulverse.com/tools/section-modulus-calculator/) | tools.usefulverse.com | 36 |
| BASE-305 | `frequency-wavelength-calculator` | [Frequency & Wavelength Calculator ](https://tools.usefulverse.com/tools/frequency-wavelength-calculator/) | tools.usefulverse.com | 36 |
| BASE-306 | `ideal-gas-law-calculator` | [Ideal Gas Law Calculator ](https://tools.usefulverse.com/tools/ideal-gas-law-calculator/) | tools.usefulverse.com | 36 |
| BASE-307 | `torque-calculator` | [Torque Calculator ](https://tools.usefulverse.com/tools/torque-calculator/) | tools.usefulverse.com | 36 |
| BASE-308 | `inductor-calculator` | [Inductor calculator ](https://tools.usefulverse.com/tools/inductor-calculator/) | tools.usefulverse.com | 36 |
| BASE-309 | `centripetal-force-calculator` | [Centripetal force calculator ](https://tools.usefulverse.com/tools/centripetal-force-calculator/) | tools.usefulverse.com | 36 |
| BASE-310 | `writing-tracker` | [Writing tracker ](https://tools.usefulverse.com/tools/writing-tracker/) | tools.usefulverse.com | 36 |
| BASE-311 | `beam-deflection-calculator` | [Beam Deflection Calculator ](https://tools.usefulverse.com/tools/beam-deflection-calculator/) | tools.usefulverse.com | 36 |
| BASE-312 | `led-resistor-calculator` | [LED Resistor Calculator ](https://tools.usefulverse.com/tools/led-resistor-calculator/) | tools.usefulverse.com | 36 |
| BASE-313 | `flow-rate-calculator` | [Flow Rate Calculator ](https://tools.usefulverse.com/tools/flow-rate-calculator/) | tools.usefulverse.com | 36 |
| BASE-314 | `reynolds-number-calculator` | [Reynolds Number Calculator ](https://tools.usefulverse.com/tools/reynolds-number-calculator/) | tools.usefulverse.com | 36 |
| BASE-315 | `three-phase-power-calculator` | [Three Phase Power Calculator ](https://tools.usefulverse.com/tools/three-phase-power-calculator/) | tools.usefulverse.com | 36 |
| BASE-316 | `dilution-calculator` | [Dilution Calculator ](https://tools.usefulverse.com/tools/dilution-calculator/) | tools.usefulverse.com | 36 |
| BASE-317 | `ohms-law-calculator` | [Ohm’s Law Calculator ](https://tools.usefulverse.com/tools/ohms-law-calculator/) | tools.usefulverse.com | 36 |
| BASE-318 | `transformer-calculator` | [Transformer Calculator ](https://tools.usefulverse.com/tools/transformer-calculator/) | tools.usefulverse.com | 36 |
| BASE-319 | `stoichiometry-calculator` | [Stoichiometry Calculator ](https://tools.usefulverse.com/tools/stoichiometry-calculator/) | tools.usefulverse.com | 36 |
| BASE-320 | `pressure-calculator` | [Pressure Calculator ](https://tools.usefulverse.com/tools/pressure-calculator/) | tools.usefulverse.com | 36 |
| BASE-321 | `pcb-trace-width-calculator` | [PCB Trace Width Calculator ](https://tools.usefulverse.com/tools/pcb-trace-width-calculator/) | tools.usefulverse.com | 36 |
| BASE-322 | `projectile-motion-calculator` | [Projectile Motion Calculator ](https://tools.usefulverse.com/tools/projectile-motion-calculator/) | tools.usefulverse.com | 36 |
| BASE-323 | `pulley-calculator` | [Pulley Calculator ](https://tools.usefulverse.com/tools/pulley-calculator/) | tools.usefulverse.com | 36 |
| BASE-324 | `rlc-circuit-calculator` | [RLC Circuit Calculator ](https://tools.usefulverse.com/tools/rlc-circuit-calculator/) | tools.usefulverse.com | 36 |
| BASE-325 | `antenna-length-calculator` | [Antenna Length Calculator ](https://tools.usefulverse.com/tools/antenna-length-calculator/) | tools.usefulverse.com | 36 |
| BASE-326 | `chemical-equation-balancer` | [Chemical Equation Balancer ](https://tools.usefulverse.com/tools/chemical-equation-balancer/) | tools.usefulverse.com | 36 |
| BASE-327 | `gear-ratio-calculator` | [Gear Ratio Calculator ](https://tools.usefulverse.com/tools/gear-ratio-calculator/) | tools.usefulverse.com | 36 |
| BASE-328 | `density-calculator` | [Density Calculator ](https://tools.usefulverse.com/tools/density-calculator/) | tools.usefulverse.com | 36 |
| BASE-329 | `compression-ratio-calculator` | [Compression Ratio Calculator ](https://tools.usefulverse.com/tools/compression-ratio-calculator/) | tools.usefulverse.com | 36 |
| BASE-330 | `hebrew-calendar-converter` | [Hebrew Calendar Converter ](https://tools.usefulverse.com/tools/hebrew-calendar-converter/) | tools.usefulverse.com | 36 |
| BASE-331 | `absolute-value-calculator` | [Absolute Value Calculator ](https://tools.usefulverse.com/tools/absolute-value-calculator/) | tools.usefulverse.com | 36 |
| BASE-332 | `radical-calculator` | [Square Root Simplifier ](https://tools.usefulverse.com/tools/radical-calculator/) | tools.usefulverse.com | 36 |
| BASE-333 | `limit-calculator` | [Limit Calculator ](https://tools.usefulverse.com/tools/limit-calculator/) | tools.usefulverse.com | 36 |
| BASE-334 | `inequality-calculator` | [Inequality Calculator ](https://tools.usefulverse.com/tools/inequality-calculator/) | tools.usefulverse.com | 36 |
| BASE-335 | `rref-calculator` | [RREF Calculator ](https://tools.usefulverse.com/tools/rref-calculator/) | tools.usefulverse.com | 36 |
| BASE-336 | `histogram-calculator` | [Histogram Calculator ](https://tools.usefulverse.com/tools/histogram-calculator/) | tools.usefulverse.com | 36 |
| BASE-337 | `differential-equation-solver` | [Differential Equation Solver ](https://tools.usefulverse.com/tools/differential-equation-solver/) | tools.usefulverse.com | 36 |
| BASE-338 | `prime-factorization-calculator` | [Prime Factorization Calculator ](https://tools.usefulverse.com/tools/prime-factorization-calculator/) | tools.usefulverse.com | 36 |
| BASE-339 | `rational-expression-calculator` | [Rational Expression Calculator ](https://tools.usefulverse.com/tools/rational-expression-calculator/) | tools.usefulverse.com | 36 |
| BASE-340 | `modulo-calculator` | [Modulo Calculator ](https://tools.usefulverse.com/tools/modulo-calculator/) | tools.usefulverse.com | 36 |
| BASE-341 | `stem-and-leaf-plot-generator` | [Stem and Leaf Plot Generator ](https://tools.usefulverse.com/tools/stem-and-leaf-plot-generator/) | tools.usefulverse.com | 36 |
| BASE-342 | `box-plot-calculator` | [Box Plot Calculator ](https://tools.usefulverse.com/tools/box-plot-calculator/) | tools.usefulverse.com | 36 |
| BASE-343 | `sleep-debt-calculator` | [Sleep Debt Calculator ](https://tools.usefulverse.com/tools/sleep-debt-calculator/) | tools.usefulverse.com | 36 |
| BASE-344 | `push-up-test` | [Push-Up Test & Set Tracker ](https://tools.usefulverse.com/tools/push-up-test/) | tools.usefulverse.com | 36 |
| BASE-345 | `sobriety-counter` | [Sobriety Day Counter ](https://tools.usefulverse.com/tools/sobriety-counter/) | tools.usefulverse.com | 36 |
| BASE-346 | `bac-calculator` | [BAC Calculator ](https://tools.usefulverse.com/tools/bac-calculator/) | tools.usefulverse.com | 36 |
| BASE-347 | `hiking-time-calculator` | [Hiking Time Calculator ](https://tools.usefulverse.com/tools/hiking-time-calculator/) | tools.usefulverse.com | 36 |
| BASE-348 | `pdf-flattener` | [PDF Form Flattener ](https://tools.usefulverse.com/tools/pdf-flattener/) | tools.usefulverse.com | 36 |
| BASE-349 | `pdf-metadata-editor` | [PDF Metadata Editor ](https://tools.usefulverse.com/tools/pdf-metadata-editor/) | tools.usefulverse.com | 36 |
| BASE-350 | `pdf-bookmarks-editor` | [PDF Bookmarks Editor ](https://tools.usefulverse.com/tools/pdf-bookmarks-editor/) | tools.usefulverse.com | 36 |
| BASE-351 | `pdf-page-size-converter` | [PDF Page Size Converter ](https://tools.usefulverse.com/tools/pdf-page-size-converter/) | tools.usefulverse.com | 36 |
| BASE-352 | `ics-viewer` | [ICS Calendar Viewer ](https://tools.usefulverse.com/tools/ics-viewer/) | tools.usefulverse.com | 36 |
| BASE-353 | `wilks-calculator` | [Wilks & DOTS Powerlifting Calculator ](https://tools.usefulverse.com/tools/wilks-calculator/) | tools.usefulverse.com | 36 |
| BASE-354 | `circle-calculator` | [Circle Calculator ](https://tools.usefulverse.com/tools/circle-calculator/) | tools.usefulverse.com | 36 |
| BASE-355 | `goal-planner` | [Goal Planner ](https://tools.usefulverse.com/tools/goal-planner/) | tools.usefulverse.com | 36 |
| BASE-356 | `mind-map-maker` | [Mind Map Maker ](https://tools.usefulverse.com/tools/mind-map-maker/) | tools.usefulverse.com | 36 |
| BASE-357 | `family-tree-maker` | [Family Tree Maker ](https://tools.usefulverse.com/tools/family-tree-maker/) | tools.usefulverse.com | 36 |
| BASE-358 | `mood-tracker` | [Mood Tracker ](https://tools.usefulverse.com/tools/mood-tracker/) | tools.usefulverse.com | 36 |
| BASE-359 | `journal-online` | [Online Journal ](https://tools.usefulverse.com/tools/journal-online/) | tools.usefulverse.com | 36 |
| BASE-360 | `travel-itinerary-planner` | [Travel Itinerary Planner ](https://tools.usefulverse.com/tools/travel-itinerary-planner/) | tools.usefulverse.com | 36 |
| BASE-361 | `polynomial-long-division-calculator` | [Polynomial Long Division Calculator ](https://tools.usefulverse.com/tools/polynomial-long-division-calculator/) | tools.usefulverse.com | 36 |
| BASE-362 | `half-life-calculator` | [Half-Life Calculator ](https://tools.usefulverse.com/tools/half-life-calculator/) | tools.usefulverse.com | 36 |
| BASE-363 | `mortgage-points-calculator` | [Mortgage Points Calculator ](https://tools.usefulverse.com/tools/mortgage-points-calculator/) | tools.usefulverse.com | 36 |
| BASE-364 | `trapezoid-calculator` | [Trapezoid Calculator ](https://tools.usefulverse.com/tools/trapezoid-calculator/) | tools.usefulverse.com | 36 |
| BASE-365 | `prayer-times-calculator` | [Prayer Times Calculator ](https://tools.usefulverse.com/tools/prayer-times-calculator/) | tools.usefulverse.com | 36 |
| BASE-366 | `miter-angle-calculator` | [Miter Angle Calculator ](https://tools.usefulverse.com/tools/miter-angle-calculator/) | tools.usefulverse.com | 36 |
| BASE-367 | `voltage-drop-calculator` | [Voltage Drop Calculator ](https://tools.usefulverse.com/tools/voltage-drop-calculator/) | tools.usefulverse.com | 36 |
| BASE-368 | `deck-calculator` | [Deck board calculator ](https://tools.usefulverse.com/tools/deck-calculator/) | tools.usefulverse.com | 36 |
| BASE-369 | `roofing-calculator` | [Roofing calculator ](https://tools.usefulverse.com/tools/roofing-calculator/) | tools.usefulverse.com | 36 |
| BASE-370 | `drywall-calculator` | [Drywall calculator ](https://tools.usefulverse.com/tools/drywall-calculator/) | tools.usefulverse.com | 36 |
| BASE-371 | `roof-pitch-calculator` | [Roof pitch calculator ](https://tools.usefulverse.com/tools/roof-pitch-calculator/) | tools.usefulverse.com | 36 |
| BASE-372 | `pool-volume-calculator` | [Pool volume calculator ](https://tools.usefulverse.com/tools/pool-volume-calculator/) | tools.usefulverse.com | 36 |
| BASE-373 | `soil-calculator` | [Soil calculator ](https://tools.usefulverse.com/tools/soil-calculator/) | tools.usefulverse.com | 36 |
| BASE-374 | `asphalt-calculator` | [Asphalt calculator ](https://tools.usefulverse.com/tools/asphalt-calculator/) | tools.usefulverse.com | 36 |
| BASE-375 | `stair-calculator` | [Stair calculator ](https://tools.usefulverse.com/tools/stair-calculator/) | tools.usefulverse.com | 36 |
| BASE-376 | `tire-size-calculator` | [Tire size calculator ](https://tools.usefulverse.com/tools/tire-size-calculator/) | tools.usefulverse.com | 36 |
| BASE-377 | `gravel-calculator` | [Gravel calculator ](https://tools.usefulverse.com/tools/gravel-calculator/) | tools.usefulverse.com | 36 |
| BASE-378 | `molar-mass-calculator` | [Molar mass calculator ](https://tools.usefulverse.com/tools/molar-mass-calculator/) | tools.usefulverse.com | 36 |
| BASE-379 | `auto-loan-refinance-calculator` | [Auto loan refinance calculator ](https://tools.usefulverse.com/tools/auto-loan-refinance-calculator/) | tools.usefulverse.com | 36 |
| BASE-380 | `heloc-calculator` | [HELOC payment calculator ](https://tools.usefulverse.com/tools/heloc-calculator/) | tools.usefulverse.com | 36 |
| BASE-381 | `secret-santa-generator` | [Secret Santa generator ](https://tools.usefulverse.com/tools/secret-santa-generator/) | tools.usefulverse.com | 36 |
| BASE-382 | `mancala` | [Mancala (Kalah) ](https://tools.usefulverse.com/tools/mancala/) | tools.usefulverse.com | 36 |
| BASE-383 | `dominoes-game` | [Dominoes game ](https://tools.usefulverse.com/tools/dominoes-game/) | tools.usefulverse.com | 36 |
| BASE-384 | `hitori` | [Hitori puzzle ](https://tools.usefulverse.com/tools/hitori/) | tools.usefulverse.com | 36 |
| BASE-385 | `nurikabe` | [Nurikabe puzzle ](https://tools.usefulverse.com/tools/nurikabe/) | tools.usefulverse.com | 36 |
| BASE-386 | `slitherlink` | [Slitherlink Puzzle ](https://tools.usefulverse.com/tools/slitherlink/) | tools.usefulverse.com | 36 |
| BASE-387 | `peg-solitaire` | [Peg Solitaire ](https://tools.usefulverse.com/tools/peg-solitaire/) | tools.usefulverse.com | 36 |
| BASE-388 | `futoshiki` | [Futoshiki ](https://tools.usefulverse.com/tools/futoshiki/) | tools.usefulverse.com | 36 |
| BASE-389 | `hashi-puzzle` | [Hashi Puzzle ](https://tools.usefulverse.com/tools/hashi-puzzle/) | tools.usefulverse.com | 36 |
| BASE-390 | `chess-puzzles` | [Chess Puzzles ](https://tools.usefulverse.com/tools/chess-puzzles/) | tools.usefulverse.com | 36 |
| BASE-391 | `chess-analysis-board` | [Chess Analysis Board ](https://tools.usefulverse.com/tools/chess-analysis-board/) | tools.usefulverse.com | 36 |
| BASE-392 | `chess-opening-trainer` | [Chess Opening Trainer ](https://tools.usefulverse.com/tools/chess-opening-trainer/) | tools.usefulverse.com | 36 |
| BASE-393 | `decibel-calculator` | [Decibel Calculator ](https://tools.usefulverse.com/tools/decibel-calculator/) | tools.usefulverse.com | 36 |
| BASE-394 | `openapi-editor` | [OpenAPI editor ](https://tools.usefulverse.com/tools/openapi-editor/) | tools.usefulverse.com | 36 |
| BASE-395 | `graphql-formatter` | [GraphQL Formatter ](https://tools.usefulverse.com/tools/graphql-formatter/) | tools.usefulverse.com | 36 |
| BASE-396 | `font-pairing-tool` | [Font Pairing Tool ](https://tools.usefulverse.com/tools/font-pairing-tool/) | tools.usefulverse.com | 36 |
| BASE-397 | `roth-vs-traditional-calculator` | [Roth vs Traditional IRA Calculator ](https://tools.usefulverse.com/tools/roth-vs-traditional-calculator/) | tools.usefulverse.com | 36 |
| BASE-398 | `polygon-calculator` | [Polygon Calculator ](https://tools.usefulverse.com/tools/polygon-calculator/) | tools.usefulverse.com | 36 |
| BASE-399 | `color-name-finder` | [Color name finder ](https://tools.usefulverse.com/tools/color-name-finder/) | tools.usefulverse.com | 36 |
| BASE-400 | `photo-to-sketch` | [Photo to sketch ](https://tools.usefulverse.com/tools/photo-to-sketch/) | tools.usefulverse.com | 36 |
| BASE-401 | `schema-markup-validator` | [Schema Markup Validator ](https://tools.usefulverse.com/tools/schema-markup-validator/) | tools.usefulverse.com | 36 |
| BASE-402 | `readability-checker` | [Readability Checker ](https://tools.usefulverse.com/tools/readability-checker/) | tools.usefulverse.com | 36 |
| BASE-403 | `savings-goal-calculator` | [Savings Goal Calculator ](https://tools.usefulverse.com/tools/savings-goal-calculator/) | tools.usefulverse.com | 36 |
| BASE-404 | `severance-pay-calculator` | [Severance Pay Calculator ](https://tools.usefulverse.com/tools/severance-pay-calculator/) | tools.usefulverse.com | 36 |
| BASE-405 | `divisibility-calculator` | [Divisibility Calculator ](https://tools.usefulverse.com/tools/divisibility-calculator/) | tools.usefulverse.com | 36 |
| BASE-406 | `number-line-graphing-tool` | [Number Line Generator ](https://tools.usefulverse.com/tools/number-line-graphing-tool/) | tools.usefulverse.com | 36 |
| BASE-407 | `laplace-transform-calculator` | [Laplace Transform Calculator ](https://tools.usefulverse.com/tools/laplace-transform-calculator/) | tools.usefulverse.com | 36 |
| BASE-408 | `vector-calculator` | [Vector Calculator ](https://tools.usefulverse.com/tools/vector-calculator/) | tools.usefulverse.com | 36 |
| BASE-409 | `cubic-quartic-equation-calculator` | [Cubic & Quartic Equation Calculator ](https://tools.usefulverse.com/tools/cubic-quartic-equation-calculator/) | tools.usefulverse.com | 36 |
| BASE-410 | `weight-loss-calculator` | [Weight loss scenario calculator ](https://tools.usefulverse.com/tools/weight-loss-calculator/) | tools.usefulverse.com | 36 |
| BASE-411 | `random-team-generator` | [Random team generator ](https://tools.usefulverse.com/tools/random-team-generator/) | tools.usefulverse.com | 36 |
| BASE-412 | `brick-calculator` | [Brick calculator ](https://tools.usefulverse.com/tools/brick-calculator/) | tools.usefulverse.com | 36 |
| BASE-413 | `rafter-calculator` | [Rafter calculator ](https://tools.usefulverse.com/tools/rafter-calculator/) | tools.usefulverse.com | 36 |
| BASE-414 | `carpet-calculator` | [Carpet calculator ](https://tools.usefulverse.com/tools/carpet-calculator/) | tools.usefulverse.com | 36 |
| BASE-415 | `aquarium-calculator` | [Aquarium volume calculator ](https://tools.usefulverse.com/tools/aquarium-calculator/) | tools.usefulverse.com | 36 |
| BASE-416 | `grass-seed-calculator` | [Grass seed calculator ](https://tools.usefulverse.com/tools/grass-seed-calculator/) | tools.usefulverse.com | 36 |
| BASE-417 | `insulation-calculator` | [Insulation R-value calculator ](https://tools.usefulverse.com/tools/insulation-calculator/) | tools.usefulverse.com | 36 |
| BASE-418 | `wall-framing-calculator` | [Wall framing calculator ](https://tools.usefulverse.com/tools/wall-framing-calculator/) | tools.usefulverse.com | 36 |
| BASE-419 | `electricity-cost-calculator` | [Electricity Cost Calculator ](https://tools.usefulverse.com/tools/electricity-cost-calculator/) | tools.usefulverse.com | 36 |
| BASE-420 | `compost-calculator` | [Compost Calculator ](https://tools.usefulverse.com/tools/compost-calculator/) | tools.usefulverse.com | 36 |
| BASE-421 | `pond-volume-calculator` | [Pond Volume Calculator ](https://tools.usefulverse.com/tools/pond-volume-calculator/) | tools.usefulverse.com | 36 |
| BASE-422 | `fertilizer-calculator` | [Fertilizer Calculator ](https://tools.usefulverse.com/tools/fertilizer-calculator/) | tools.usefulverse.com | 36 |
| BASE-423 | `complex-number-calculator` | [Complex Number Calculator ](https://tools.usefulverse.com/tools/complex-number-calculator/) | tools.usefulverse.com | 36 |
| BASE-424 | `eigenvalue-calculator` | [Eigenvalue Calculator ](https://tools.usefulverse.com/tools/eigenvalue-calculator/) | tools.usefulverse.com | 36 |
| BASE-425 | `bond-calculator` | [Bond Calculator ](https://tools.usefulverse.com/tools/bond-calculator/) | tools.usefulverse.com | 36 |
| BASE-426 | `stock-profit-calculator` | [Stock Profit Calculator ](https://tools.usefulverse.com/tools/stock-profit-calculator/) | tools.usefulverse.com | 36 |
| BASE-427 | `pension-calculator` | [Pension Calculator ](https://tools.usefulverse.com/tools/pension-calculator/) | tools.usefulverse.com | 36 |
| BASE-428 | `lifetime-value-calculator` | [Customer Lifetime Value Calculator ](https://tools.usefulverse.com/tools/lifetime-value-calculator/) | tools.usefulverse.com | 36 |
| BASE-429 | `polar-graphing-calculator` | [Polar Graphing Calculator ](https://tools.usefulverse.com/tools/polar-graphing-calculator/) | tools.usefulverse.com | 36 |
| BASE-430 | `boolean-algebra-calculator` | [Boolean Algebra Calculator ](https://tools.usefulverse.com/tools/boolean-algebra-calculator/) | tools.usefulverse.com | 36 |
| BASE-431 | `week-number-calculator` | [Week Number Calculator ](https://tools.usefulverse.com/tools/week-number-calculator/) | tools.usefulverse.com | 36 |
| BASE-432 | `kinetic-energy-calculator` | [Kinetic Energy Calculator ](https://tools.usefulverse.com/tools/kinetic-energy-calculator/) | tools.usefulverse.com | 36 |
| BASE-433 | `momentum-calculator` | [Momentum Calculator ](https://tools.usefulverse.com/tools/momentum-calculator/) | tools.usefulverse.com | 36 |
| BASE-434 | `resistor-color-code-calculator` | [Resistor Color Code Calculator ](https://tools.usefulverse.com/tools/resistor-color-code-calculator/) | tools.usefulverse.com | 36 |
| BASE-435 | `acceleration-calculator` | [Acceleration Calculator ](https://tools.usefulverse.com/tools/acceleration-calculator/) | tools.usefulverse.com | 36 |
| BASE-436 | `friction-calculator` | [Friction Calculator ](https://tools.usefulverse.com/tools/friction-calculator/) | tools.usefulverse.com | 36 |
| BASE-437 | `force-calculator` | [Force Calculator ](https://tools.usefulverse.com/tools/force-calculator/) | tools.usefulverse.com | 36 |
| BASE-438 | `horsepower-calculator` | [Horsepower Calculator ](https://tools.usefulverse.com/tools/horsepower-calculator/) | tools.usefulverse.com | 36 |
| BASE-439 | `rtf-converter` | [RTF Converter ](https://tools.usefulverse.com/tools/rtf-converter/) | tools.usefulverse.com | 36 |
| BASE-440 | `csv-to-pdf` | [CSV to PDF Converter ](https://tools.usefulverse.com/tools/csv-to-pdf/) | tools.usefulverse.com | 36 |
| BASE-441 | `round-robin-tournament-generator` | [Round Robin Tournament Generator ](https://tools.usefulverse.com/tools/round-robin-tournament-generator/) | tools.usefulverse.com | 36 |
| BASE-442 | `work-order-generator` | [Work Order Generator ](https://tools.usefulverse.com/tools/work-order-generator/) | tools.usefulverse.com | 36 |
| BASE-443 | `purchase-order-generator` | [Purchase Order Generator ](https://tools.usefulverse.com/tools/purchase-order-generator/) | tools.usefulverse.com | 36 |
| BASE-444 | `hijri-calendar-converter` | [Hijri Calendar Converter ](https://tools.usefulverse.com/tools/hijri-calendar-converter/) | tools.usefulverse.com | 36 |
| BASE-445 | `capacitor-calculator` | [Capacitor Calculator ](https://tools.usefulverse.com/tools/capacitor-calculator/) | tools.usefulverse.com | 36 |
| BASE-446 | `rc-time-constant-calculator` | [RC Time Constant Calculator ](https://tools.usefulverse.com/tools/rc-time-constant-calculator/) | tools.usefulverse.com | 36 |
| BASE-447 | `waist-to-hip-ratio-calculator` | [Waist to Hip Ratio Calculator ](https://tools.usefulverse.com/tools/waist-to-hip-ratio-calculator/) | tools.usefulverse.com | 36 |
| BASE-448 | `body-water-calculator` | [Body Water Calculator ](https://tools.usefulverse.com/tools/body-water-calculator/) | tools.usefulverse.com | 36 |
| BASE-449 | `555-timer-calculator` | [555 Timer Calculator ](https://tools.usefulverse.com/tools/555-timer-calculator/) | tools.usefulverse.com | 36 |
| BASE-450 | `fourier-series-calculator` | [Fourier Series Calculator ](https://tools.usefulverse.com/tools/fourier-series-calculator/) | tools.usefulverse.com | 36 |
| BASE-451 | `modular-inverse-calculator` | [Modular Inverse Calculator ](https://tools.usefulverse.com/tools/modular-inverse-calculator/) | tools.usefulverse.com | 36 |
| BASE-452 | `a-b-test-calculator` | [A/B Test Calculator ](https://tools.usefulverse.com/tools/a-b-test-calculator/) | tools.usefulverse.com | 36 |
| BASE-453 | `investment-allocation-calculator` | [Portfolio Allocation Calculator ](https://tools.usefulverse.com/tools/investment-allocation-calculator/) | tools.usefulverse.com | 36 |
| BASE-454 | `repeating-decimal-to-fraction` | [Repeating Decimal to Fraction Calculator ](https://tools.usefulverse.com/tools/repeating-decimal-to-fraction/) | tools.usefulverse.com | 36 |
| BASE-455 | `parametric-equation-calculator` | [Parametric Equation Calculator ](https://tools.usefulverse.com/tools/parametric-equation-calculator/) | tools.usefulverse.com | 36 |
| BASE-456 | `singular-value-decomposition-calculator` | [SVD Calculator ](https://tools.usefulverse.com/tools/singular-value-decomposition-calculator/) | tools.usefulverse.com | 36 |
| BASE-457 | `spearman-correlation-calculator` | [Spearman Correlation Calculator ](https://tools.usefulverse.com/tools/spearman-correlation-calculator/) | tools.usefulverse.com | 36 |
| BASE-458 | `wilcoxon-signed-rank-test-calculator` | [Wilcoxon Signed Rank Test Calculator ](https://tools.usefulverse.com/tools/wilcoxon-signed-rank-test-calculator/) | tools.usefulverse.com | 36 |
| BASE-459 | `statistical-power-calculator` | [Statistical Power Calculator ](https://tools.usefulverse.com/tools/statistical-power-calculator/) | tools.usefulverse.com | 36 |
| BASE-460 | `fisher-exact-test-calculator` | [Fisher Exact Test Calculator ](https://tools.usefulverse.com/tools/fisher-exact-test-calculator/) | tools.usefulverse.com | 36 |
| BASE-461 | `taylor-series-calculator` | [Taylor Series Calculator ](https://tools.usefulverse.com/tools/taylor-series-calculator/) | tools.usefulverse.com | 36 |
| BASE-462 | `effect-size-calculator` | [Effect Size Calculator ](https://tools.usefulverse.com/tools/effect-size-calculator/) | tools.usefulverse.com | 36 |
| BASE-463 | `ellipse-calculator` | [Ellipse Calculator ](https://tools.usefulverse.com/tools/ellipse-calculator/) | tools.usefulverse.com | 36 |
| BASE-464 | `mann-whitney-u-test-calculator` | [Mann–Whitney U Test Calculator ](https://tools.usefulverse.com/tools/mann-whitney-u-test-calculator/) | tools.usefulverse.com | 36 |
| BASE-465 | `linear-programming-calculator` | [Linear Programming Calculator ](https://tools.usefulverse.com/tools/linear-programming-calculator/) | tools.usefulverse.com | 36 |
| BASE-466 | `json-diff` | [JSON Diff ](https://tools.usefulverse.com/tools/json-diff/) | tools.usefulverse.com | 36 |
| BASE-467 | `text-to-binary-converter` | [Text to Binary Converter ](https://tools.usefulverse.com/tools/text-to-binary-converter/) | tools.usefulverse.com | 36 |
| BASE-468 | `certificate-decoder` | [X.509 Certificate Decoder ](https://tools.usefulverse.com/tools/certificate-decoder/) | tools.usefulverse.com | 36 |
| BASE-469 | `json-to-xml-converter` | [JSON to XML Converter ](https://tools.usefulverse.com/tools/json-to-xml-converter/) | tools.usefulverse.com | 36 |
| BASE-470 | `xml-to-csv-converter` | [XML to CSV Converter ](https://tools.usefulverse.com/tools/xml-to-csv-converter/) | tools.usefulverse.com | 36 |
| BASE-471 | `csv-merge` | [CSV Merge ](https://tools.usefulverse.com/tools/csv-merge/) | tools.usefulverse.com | 36 |
| BASE-472 | `sitemap-validator` | [Sitemap Validator ](https://tools.usefulverse.com/tools/sitemap-validator/) | tools.usefulverse.com | 36 |
| BASE-473 | `bcrypt-generator` | [Bcrypt Generator ](https://tools.usefulverse.com/tools/bcrypt-generator/) | tools.usefulverse.com | 36 |
| BASE-474 | `json-to-excel` | [JSON to Excel ](https://tools.usefulverse.com/tools/json-to-excel/) | tools.usefulverse.com | 36 |
| BASE-475 | `binary-base64-tool` | [File to Base64 & Data URI ](https://tools.usefulverse.com/tools/binary-base64-tool/) | tools.usefulverse.com | 36 |
| BASE-476 | `csv-editor` | [CSV Editor ](https://tools.usefulverse.com/tools/csv-editor/) | tools.usefulverse.com | 36 |
| BASE-477 | `json-model-generator` | [JSON Model Generator ](https://tools.usefulverse.com/tools/json-model-generator/) | tools.usefulverse.com | 36 |
| BASE-478 | `har-viewer` | [HAR Viewer ](https://tools.usefulverse.com/tools/har-viewer/) | tools.usefulverse.com | 36 |
| BASE-479 | `robots-txt-tester` | [Robots.txt Tester ](https://tools.usefulverse.com/tools/robots-txt-tester/) | tools.usefulverse.com | 36 |
| BASE-480 | `chinese-remainder-theorem-calculator` | [Chinese Remainder Theorem Calculator ](https://tools.usefulverse.com/tools/chinese-remainder-theorem-calculator/) | tools.usefulverse.com | 36 |
| BASE-481 | `effective-interest-rate-calculator` | [Effective Interest Rate Calculator ](https://tools.usefulverse.com/tools/effective-interest-rate-calculator/) | tools.usefulverse.com | 36 |
| BASE-482 | `interval-timer` | [Interval Timer ](https://tools.usefulverse.com/tools/interval-timer/) | tools.usefulverse.com | 36 |
| BASE-483 | `logic-grid-puzzle` | [Logic grid puzzle ](https://tools.usefulverse.com/tools/logic-grid-puzzle/) | tools.usefulverse.com | 36 |
| BASE-484 | `markdown-editor` | [Markdown Editor ](https://tools.usefulverse.com/tools/markdown-editor/) | tools.usefulverse.com | 36 |
| BASE-485 | `julian-date-converter` | [Julian Date Converter ](https://tools.usefulverse.com/tools/julian-date-converter/) | tools.usefulverse.com | 36 |
| BASE-486 | `529-calculator` | [529 College Savings Calculator ](https://tools.usefulverse.com/tools/529-calculator/) | tools.usefulverse.com | 36 |
| BASE-487 | `reverse-mortgage-calculator` | [Reverse Mortgage Calculator ](https://tools.usefulverse.com/tools/reverse-mortgage-calculator/) | tools.usefulverse.com | 36 |
| BASE-488 | `retirement-calculator` | [Retirement Calculator ](https://tools.usefulverse.com/tools/retirement-calculator/) | tools.usefulverse.com | 36 |
| BASE-489 | `required-minimum-distribution-calculator` | [RMD Calculator ](https://tools.usefulverse.com/tools/required-minimum-distribution-calculator/) | tools.usefulverse.com | 36 |
| BASE-490 | `protein-calculator` | [Protein Calculator ](https://tools.usefulverse.com/tools/protein-calculator/) | tools.usefulverse.com | 36 |
| BASE-491 | `mortgage-affordability-calculator` | [Mortgage Affordability Calculator ](https://tools.usefulverse.com/tools/mortgage-affordability-calculator/) | tools.usefulverse.com | 36 |
| BASE-492 | `401k-calculator` | [401(k) Calculator ](https://tools.usefulverse.com/tools/401k-calculator/) | tools.usefulverse.com | 36 |
| BASE-493 | `inflation-calculator` | [Inflation Calculator ](https://tools.usefulverse.com/tools/inflation-calculator/) | tools.usefulverse.com | 36 |
| BASE-494 | `car-depreciation-calculator` | [Car Depreciation Calculator ](https://tools.usefulverse.com/tools/car-depreciation-calculator/) | tools.usefulverse.com | 36 |
| BASE-495 | `aes-encryption-tool` | [AES encryption tool ](https://tools.usefulverse.com/tools/aes-encryption-tool/) | tools.usefulverse.com | 36 |
| BASE-496 | `jwt-encoder` | [JWT encoder ](https://tools.usefulverse.com/tools/jwt-encoder/) | tools.usefulverse.com | 36 |
| BASE-497 | `rsa-key-generator` | [RSA Key Generator ](https://tools.usefulverse.com/tools/rsa-key-generator/) | tools.usefulverse.com | 36 |
| BASE-498 | `log-analyzer` | [Access Log Analyzer ](https://tools.usefulverse.com/tools/log-analyzer/) | tools.usefulverse.com | 36 |
| BASE-499 | `text-to-speech` | [Text to Speech ](https://tools.usefulverse.com/tools/text-to-speech/) | tools.usefulverse.com | 36 |
| BASE-500 | `world-clock` | [World Clock ](https://tools.usefulverse.com/tools/world-clock/) | tools.usefulverse.com | 36 |
| BASE-501 | `euchre` | [Euchre ](https://tools.usefulverse.com/tools/euchre/) | tools.usefulverse.com | 36 |
| BASE-502 | `spades-game` | [Spades ](https://tools.usefulverse.com/tools/spades-game/) | tools.usefulverse.com | 36 |
| BASE-503 | `name-generator` | [Original Name Generator ](https://tools.usefulverse.com/tools/name-generator/) | tools.usefulverse.com | 36 |
| BASE-504 | `random-word-generator` | [Random Word Generator ](https://tools.usefulverse.com/tools/random-word-generator/) | tools.usefulverse.com | 36 |
| BASE-505 | `breathing-exercise` | [Breathing Exercise ](https://tools.usefulverse.com/tools/breathing-exercise/) | tools.usefulverse.com | 36 |
| BASE-506 | `alarm-clock` | [Online Alarm Clock ](https://tools.usefulverse.com/tools/alarm-clock/) | tools.usefulverse.com | 36 |
| BASE-507 | `dividend-calculator` | [Dividend Calculator ](https://tools.usefulverse.com/tools/dividend-calculator/) | tools.usefulverse.com | 36 |
| BASE-508 | `net-worth-calculator` | [Net Worth Calculator ](https://tools.usefulverse.com/tools/net-worth-calculator/) | tools.usefulverse.com | 36 |
| BASE-509 | `body-surface-area-calculator` | [Body Surface Area Calculator ](https://tools.usefulverse.com/tools/body-surface-area-calculator/) | tools.usefulverse.com | 36 |
| BASE-510 | `css-border-radius-generator` | [CSS Border Radius Generator ](https://tools.usefulverse.com/tools/css-border-radius-generator/) | tools.usefulverse.com | 36 |
| BASE-511 | `chore-chart-maker` | [Chore Chart Maker ](https://tools.usefulverse.com/tools/chore-chart-maker/) | tools.usefulverse.com | 36 |
| BASE-512 | `weekly-planner` | [Weekly Planner ](https://tools.usefulverse.com/tools/weekly-planner/) | tools.usefulverse.com | 36 |
| BASE-513 | `overtime-calculator` | [Overtime Calculator ](https://tools.usefulverse.com/tools/overtime-calculator/) | tools.usefulverse.com | 36 |
| BASE-514 | `meeting-minutes-template` | [Meeting Minutes Template ](https://tools.usefulverse.com/tools/meeting-minutes-template/) | tools.usefulverse.com | 36 |
| BASE-515 | `dots-and-boxes` | [Dots and Boxes ](https://tools.usefulverse.com/tools/dots-and-boxes/) | tools.usefulverse.com | 36 |
| BASE-516 | `color-mixer` | [Color Mixer ](https://tools.usefulverse.com/tools/color-mixer/) | tools.usefulverse.com | 36 |
| BASE-517 | `blackjack-game` | [Blackjack Game ](https://tools.usefulverse.com/tools/blackjack-game/) | tools.usefulverse.com | 36 |
| BASE-518 | `debt-to-income-ratio-calculator` | [Debt-to-Income Ratio Calculator ](https://tools.usefulverse.com/tools/debt-to-income-ratio-calculator/) | tools.usefulverse.com | 36 |
| BASE-519 | `car-lease-calculator` | [Car Lease Calculator ](https://tools.usefulverse.com/tools/car-lease-calculator/) | tools.usefulverse.com | 36 |
| BASE-520 | `fire-calculator` | [FIRE Calculator ](https://tools.usefulverse.com/tools/fire-calculator/) | tools.usefulverse.com | 36 |
| BASE-521 | `email-signature-generator` | [Email Signature Generator ](https://tools.usefulverse.com/tools/email-signature-generator/) | tools.usefulverse.com | 36 |
| BASE-522 | `image-vectorizer` | [Image Vectorizer ](https://tools.usefulverse.com/tools/image-vectorizer/) | tools.usefulverse.com | 36 |
| BASE-523 | `vo2-max-calculator` | [VO2 Max Calculator ](https://tools.usefulverse.com/tools/vo2-max-calculator/) | tools.usefulverse.com | 36 |
| BASE-524 | `calories-burned-calculator` | [Calories Burned Calculator ](https://tools.usefulverse.com/tools/calories-burned-calculator/) | tools.usefulverse.com | 36 |
| BASE-525 | `killer-sudoku` | [Killer Sudoku ](https://tools.usefulverse.com/tools/killer-sudoku/) | tools.usefulverse.com | 36 |
| BASE-526 | `sudoku-solver` | [Sudoku Solver ](https://tools.usefulverse.com/tools/sudoku-solver/) | tools.usefulverse.com | 36 |
| BASE-527 | `hangman-game` | [Hangman Game ](https://tools.usefulverse.com/tools/hangman-game/) | tools.usefulverse.com | 36 |
| BASE-528 | `rhyme-finder` | [Rhyme Finder ](https://tools.usefulverse.com/tools/rhyme-finder/) | tools.usefulverse.com | 36 |
| BASE-529 | `water-intake-calculator` | [Water Intake Calculator ](https://tools.usefulverse.com/tools/water-intake-calculator/) | tools.usefulverse.com | 36 |
| BASE-530 | `cpm-calculator` | [CPM calculator ](https://tools.usefulverse.com/tools/cpm-calculator/) | tools.usefulverse.com | 36 |
| BASE-531 | `aim-trainer` | [Aim Trainer ](https://tools.usefulverse.com/tools/aim-trainer/) | tools.usefulverse.com | 36 |
| BASE-532 | `annuity-calculator` | [Annuity Calculator ](https://tools.usefulverse.com/tools/annuity-calculator/) | tools.usefulverse.com | 36 |
| BASE-533 | `options-profit-calculator` | [Options Profit Calculator ](https://tools.usefulverse.com/tools/options-profit-calculator/) | tools.usefulverse.com | 36 |
| BASE-534 | `cribbage` | [Cribbage Score Calculator and Game ](https://tools.usefulverse.com/tools/cribbage/) | tools.usefulverse.com | 36 |
| BASE-535 | `gin-rummy` | [Gin Rummy ](https://tools.usefulverse.com/tools/gin-rummy/) | tools.usefulverse.com | 36 |
| BASE-536 | `gold-calculator` | [Gold Calculator ](https://tools.usefulverse.com/tools/gold-calculator/) | tools.usefulverse.com | 36 |
| BASE-537 | `mortgage-refinance-calculator` | [Mortgage Refinance Calculator ](https://tools.usefulverse.com/tools/mortgage-refinance-calculator/) | tools.usefulverse.com | 36 |
| BASE-538 | `cash-on-cash-return-calculator` | [Cash-on-Cash Return Calculator ](https://tools.usefulverse.com/tools/cash-on-cash-return-calculator/) | tools.usefulverse.com | 36 |
| BASE-539 | `forex-position-size-calculator` | [Forex Position Size Calculator ](https://tools.usefulverse.com/tools/forex-position-size-calculator/) | tools.usefulverse.com | 36 |
| BASE-540 | `lease-vs-buy-car-calculator` | [Lease vs Buy Car Calculator ](https://tools.usefulverse.com/tools/lease-vs-buy-car-calculator/) | tools.usefulverse.com | 36 |
| BASE-541 | `customer-acquisition-cost-calculator` | [Customer Acquisition Cost Calculator ](https://tools.usefulverse.com/tools/customer-acquisition-cost-calculator/) | tools.usefulverse.com | 36 |
| BASE-542 | `rental-yield-calculator` | [Rental Yield Calculator ](https://tools.usefulverse.com/tools/rental-yield-calculator/) | tools.usefulverse.com | 36 |
| BASE-543 | `epub-to-pdf` | [EPUB to PDF Converter ](https://tools.usefulverse.com/tools/epub-to-pdf/) | tools.usefulverse.com | 36 |
| BASE-544 | `pyramid-solitaire` | [Pyramid Solitaire ](https://tools.usefulverse.com/tools/pyramid-solitaire/) | tools.usefulverse.com | 36 |
| BASE-545 | `tripeaks-solitaire` | [Tripeaks Solitaire ](https://tools.usefulverse.com/tools/tripeaks-solitaire/) | tools.usefulverse.com | 36 |
| BASE-546 | `spider-solitaire` | [Spider Solitaire ](https://tools.usefulverse.com/tools/spider-solitaire/) | tools.usefulverse.com | 36 |
| BASE-547 | `freecell` | [FreeCell ](https://tools.usefulverse.com/tools/freecell/) | tools.usefulverse.com | 36 |
| BASE-548 | `snake-game` | [Snake Game ](https://tools.usefulverse.com/tools/snake-game/) | tools.usefulverse.com | 36 |
| BASE-549 | `gomoku` | [Gomoku ](https://tools.usefulverse.com/tools/gomoku/) | tools.usefulverse.com | 36 |
| BASE-550 | `poker-odds-calculator` | [Poker Odds Calculator ](https://tools.usefulverse.com/tools/poker-odds-calculator/) | tools.usefulverse.com | 36 |
| BASE-551 | `heart-rate-zone-calculator` | [Heart Rate Zone Calculator ](https://tools.usefulverse.com/tools/heart-rate-zone-calculator/) | tools.usefulverse.com | 36 |
| BASE-552 | `ideal-weight-calculator` | [Ideal Weight Calculator ](https://tools.usefulverse.com/tools/ideal-weight-calculator/) | tools.usefulverse.com | 36 |
| BASE-553 | `eisenhower-matrix` | [Eisenhower Matrix ](https://tools.usefulverse.com/tools/eisenhower-matrix/) | tools.usefulverse.com | 36 |
| BASE-554 | `social-security-calculator` | [Social Security Calculator ](https://tools.usefulverse.com/tools/social-security-calculator/) | tools.usefulverse.com | 36 |
| BASE-555 | `word-puzzle-solver` | [Word Puzzle Solver ](https://tools.usefulverse.com/tools/word-puzzle-solver/) | tools.usefulverse.com | 36 |
| BASE-556 | `rebus-puzzles` | [Rebus Puzzles ](https://tools.usefulverse.com/tools/rebus-puzzles/) | tools.usefulverse.com | 36 |
| BASE-557 | `ludo-game` | [Ludo Game ](https://tools.usefulverse.com/tools/ludo-game/) | tools.usefulverse.com | 36 |
| BASE-558 | `memory-test` | [Memory Test ](https://tools.usefulverse.com/tools/memory-test/) | tools.usefulverse.com | 36 |
| BASE-559 | `fuel-economy-calculator` | [Fuel Economy Calculator ](https://tools.usefulverse.com/tools/fuel-economy-calculator/) | tools.usefulverse.com | 36 |
| BASE-560 | `timeline-maker` | [Timeline Maker ](https://tools.usefulverse.com/tools/timeline-maker/) | tools.usefulverse.com | 36 |
| BASE-561 | `crossword-online` | [Crossword Online ](https://tools.usefulverse.com/tools/crossword-online/) | tools.usefulverse.com | 36 |
| BASE-562 | `extract-images-from-pdf` | [Extract Images from PDF ](https://tools.usefulverse.com/tools/extract-images-from-pdf/) | tools.usefulverse.com | 36 |
| BASE-563 | `business-letter-generator` | [Business Letter Generator ](https://tools.usefulverse.com/tools/business-letter-generator/) | tools.usefulverse.com | 36 |
| BASE-564 | `markdown-table-generator` | [Markdown Table Generator ](https://tools.usefulverse.com/tools/markdown-table-generator/) | tools.usefulverse.com | 36 |
| BASE-565 | `pdf-accessibility-checker` | [PDF Accessibility Checker ](https://tools.usefulverse.com/tools/pdf-accessibility-checker/) | tools.usefulverse.com | 36 |
| BASE-566 | `docx-editor` | [DOCX Editor ](https://tools.usefulverse.com/tools/docx-editor/) | tools.usefulverse.com | 36 |
| BASE-567 | `vcard-generator` | [VCard Generator ](https://tools.usefulverse.com/tools/vcard-generator/) | tools.usefulverse.com | 36 |
| BASE-568 | `meeting-planner` | [Meeting Planner ](https://tools.usefulverse.com/tools/meeting-planner/) | tools.usefulverse.com | 36 |
| BASE-569 | `moon-phase-calculator` | [Moon Phase Calculator ](https://tools.usefulverse.com/tools/moon-phase-calculator/) | tools.usefulverse.com | 36 |
| BASE-570 | `vcard-converter` | [VCF to CSV Converter ](https://tools.usefulverse.com/tools/vcard-converter/) | tools.usefulverse.com | 36 |
| BASE-571 | `hearts-game` | [Hearts card game ](https://tools.usefulverse.com/tools/hearts-game/) | tools.usefulverse.com | 36 |
| BASE-572 | `typing-practice` | [Typing practice ](https://tools.usefulverse.com/tools/typing-practice/) | tools.usefulverse.com | 36 |
| BASE-573 | `sokoban` | [Sokoban ](https://tools.usefulverse.com/tools/sokoban/) | tools.usefulverse.com | 36 |
| BASE-574 | `maze-generator` | [Maze generator ](https://tools.usefulverse.com/tools/maze-generator/) | tools.usefulverse.com | 36 |
| BASE-575 | `sleep-calculator` | [Sleep calculator ](https://tools.usefulverse.com/tools/sleep-calculator/) | tools.usefulverse.com | 36 |
| BASE-576 | `lean-body-mass-calculator` | [Lean body mass calculator ](https://tools.usefulverse.com/tools/lean-body-mass-calculator/) | tools.usefulverse.com | 36 |
| BASE-577 | `cycling-power-calculator` | [Cycling power calculator ](https://tools.usefulverse.com/tools/cycling-power-calculator/) | tools.usefulverse.com | 36 |
| BASE-578 | `sunrise-sunset-calculator` | [Sunrise and Sunset Calculator ](https://tools.usefulverse.com/tools/sunrise-sunset-calculator/) | tools.usefulverse.com | 36 |
| BASE-579 | `moonrise-moonset-calculator` | [Moonrise and Moonset Calculator ](https://tools.usefulverse.com/tools/moonrise-moonset-calculator/) | tools.usefulverse.com | 36 |
| BASE-580 | `persian-calendar-converter` | [Persian Calendar Converter ](https://tools.usefulverse.com/tools/persian-calendar-converter/) | tools.usefulverse.com | 36 |
| BASE-581 | `project-risk-matrix` | [Project Risk Matrix ](https://tools.usefulverse.com/tools/project-risk-matrix/) | tools.usefulverse.com | 36 |
| BASE-582 | `org-chart-maker` | [Organization Chart Maker ](https://tools.usefulverse.com/tools/org-chart-maker/) | tools.usefulverse.com | 36 |
| BASE-583 | `sankey-diagram-generator` | [Sankey Diagram Generator ](https://tools.usefulverse.com/tools/sankey-diagram-generator/) | tools.usefulverse.com | 36 |
| BASE-584 | `event-budget-calculator` | [Event Budget Calculator ](https://tools.usefulverse.com/tools/event-budget-calculator/) | tools.usefulverse.com | 36 |
| BASE-585 | `decision-tree-maker` | [Decision Tree Maker ](https://tools.usefulverse.com/tools/decision-tree-maker/) | tools.usefulverse.com | 36 |
| BASE-586 | `shift-scheduler` | [Shift Scheduler ](https://tools.usefulverse.com/tools/shift-scheduler/) | tools.usefulverse.com | 36 |
| BASE-587 | `subscription-tracker` | [Subscription Tracker ](https://tools.usefulverse.com/tools/subscription-tracker/) | tools.usefulverse.com | 36 |
| BASE-588 | `radar-chart-maker` | [Radar Chart Maker ](https://tools.usefulverse.com/tools/radar-chart-maker/) | tools.usefulverse.com | 36 |
| BASE-589 | `packing-box-calculator` | [Packing Box Calculator ](https://tools.usefulverse.com/tools/packing-box-calculator/) | tools.usefulverse.com | 36 |
| BASE-590 | `car-running-cost-calculator` | [Car Running Cost Calculator ](https://tools.usefulverse.com/tools/car-running-cost-calculator/) | tools.usefulverse.com | 36 |
| BASE-591 | `bra-size-calculator` | [Bra Size Calculator ](https://tools.usefulverse.com/tools/bra-size-calculator/) | tools.usefulverse.com | 36 |
| BASE-592 | `logo-maker` | [Simple Logo Maker ](https://tools.usefulverse.com/tools/logo-maker/) | tools.usefulverse.com | 36 |
| BASE-593 | `writing-prompt-generator` | [Writing Prompt Generator ](https://tools.usefulverse.com/tools/writing-prompt-generator/) | tools.usefulverse.com | 36 |
| BASE-594 | `color-palette-from-image` | [Color Palette from Image ](https://tools.usefulverse.com/tools/color-palette-from-image/) | tools.usefulverse.com | 36 |
| BASE-595 | `text-summarizer` | [Extractive Text Summarizer ](https://tools.usefulverse.com/tools/text-summarizer/) | tools.usefulverse.com | 36 |
| BASE-596 | `speed-reading-app` | [Speed Reading App ](https://tools.usefulverse.com/tools/speed-reading-app/) | tools.usefulverse.com | 36 |
| BASE-597 | `mockup-generator` | [Screenshot Mockup Generator ](https://tools.usefulverse.com/tools/mockup-generator/) | tools.usefulverse.com | 36 |
| BASE-598 | `acrostic-poem-maker` | [Acrostic Poem Maker ](https://tools.usefulverse.com/tools/acrostic-poem-maker/) | tools.usefulverse.com | 36 |
| BASE-599 | `word-frequency-counter` | [Word Frequency Counter ](https://tools.usefulverse.com/tools/word-frequency-counter/) | tools.usefulverse.com | 36 |
| BASE-600 | `image-histogram` | [Image Histogram ](https://tools.usefulverse.com/tools/image-histogram/) | tools.usefulverse.com | 36 |

## 22. Checkpoint de entrega y próxima acción exacta

- Planificación: 100 fichas y checklist, 50 NO + 50 CH.
- Base pública protegida: 600 herramientas / 21.924 URLs.
- Nuevas locales: 0. Nuevas con locales completos: 0. Nuevas esperando deploy: 0. Nuevas públicas: 0.
- Candidatas por implementar: 100; dentro de ellas, 7 de prioridad P3/reserva de demanda. No contar ninguna como terminada por estar descrita.
- Gasto cerrado DataForSEO: 0,25092 USD; no reconsultar la investigación al retomar.
- Siguiente tarea cuando el dueño ordene ejecutar: **F0**, comprobar fuente/manifiesto de publicación y preparar el piloto NO034/NO022/CH021/CH027/NO004; verificar primero sus contratos/datos/licencias.
- No hay una herramienta a medio hacer en este nuevo plan ni una cola de traducción iniciada. No inventar «faltan X» a partir de los mensajes del plan anterior.
- Este encargo no modifica páginas, sitemaps públicos, DNS, modelos de cobro, analítica ni paneles de buscadores. La nueva aprobación de ejecución determinará cuándo construir/publicar.

### Checklist de verificación de esta planificación

- [x] Instrucciones y ejemplo anterior leídos; método de traducción real recuperado.
- [x] Ambos sitemaps leídos y 600 fichas inglesas revisadas por metadatos/controles.
- [x] Search Console consultado, periodo y métricas por país registrados.
- [x] DataForSEO en NO/CH, coste real y respuestas conservadas.
- [x] 100 slugs/IDs distintos, sin intersección exacta con los 600; diferencias semánticas documentadas por ficha.
- [x] 50 candidatas por mercado, métricas exactas y reservas identificadas.
- [x] Contratos, longtails, implementación local, idiomas, QA, publicación futura y reanudación descritos.
- [x] Validación final del documento y coherencia de recuentos: 100 fichas, 600 existentes, métricas y coste cotejados; hashes de ambos sitemaps sin cambios.
- [ ] Respaldo privado verificado y apertura del documento editable.
- [ ] Limpieza de temporales propios tras comprobar recuperación.
