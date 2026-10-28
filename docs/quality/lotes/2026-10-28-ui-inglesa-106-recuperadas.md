# 28-oct-2026 · UI inglesa de las 106 recuperadas

Se conectan las fuentes de interfaz de los 106 propietarios que aún aportaban solo nombre, título y descripción. Todas las páginas inglesas recuperadas contienen un JSON de copia; se extrae sin ejecutar HTML/JS ni usar red. El recolector existente admite estos archivos mediante `translation-sources/`, por lo que no cambia el motor del traductor ni su configuración.

## Resultado comprobado

- **42.685 → 48.403 unidades inglesas**, +5.718 netas. Propietarios solo con metadatos: **106 → 0**. Los otros 896 documentos (894 herramientas y dos compartidos) y sus unidades conservan sus hashes.
- 106 entradas pequeñas, 540.394 bytes en total, con campos, acciones, mensajes, ayudas y ejemplos explicados. Se verifica idioma `en`, propietario, nombre, controlador y hashes SHA-256 del HTML, JSON y JS. `push-up-test` y `memory-test` conservan sus nombres reales `*.controller.js`.
- Se descartan 103 marcas históricas `localizationStatus: approved`. No acreditan revisión actual. **Cero herramientas, idiomas o traducciones aprobados.**
- Datos de puzzles, XML/CSV, cartas, métodos y parámetros internos de ejemplos se conservan aparte en `nonTranslatableCopy`. Las siete etiquetas visibles de categoría se mantienen como prosa; una regresión distingue estas etiquetas de `example.category`, que es un valor interno. El texto traducible y estos datos reconstruyen exactamente el JSON original, salvo los metadatos de idioma/aprobación descartados. No se traducen respuestas de juegos o parámetros como si fueran prosa.
- El HTML y los controladores recuperados conservan sus bytes. No cambia la web publicada ni se integra este código en `main`.

## Pruebas y procedencia

Antes de conectar las fuentes, la nueva regresión reprodujo la falta de UI en los 106 propietarios: 107 fallos contando el test padre. [Salida resumida](../recovered-ui-v1/regressions-before.txt).

Después: **147 tests Node + 15 Python correctos**, cero fallos/omisiones. [Node](../recovered-ui-v1/node-tests.txt) · [Python](../recovered-ui-v1/python-tests.txt). Se comprueba cada propietario, copia completa con restauración de datos, hashes, campos/acciones/mensajes, separación de datos y ausencia de aprobación heredada. Las pruebas del recuperador cubren idiomas/propietarios mezclados, IDs duplicados/traversal, JSON/atributos duplicados, claves inseguras, números no finitos, archivos ausentes/enlazados, controladores mezclados, fuentes obsoletas y negativa a sobrescribir trabajo mejorado.

`python3 scripts/recovery/extract-recovered-copy.py --check` reproduce y verifica los 106 paquetes, sin escritura. `--write` solo crea una carpeta nueva tras validar todos los inputs y publica mediante un rename; se niega a sobrescribir una fuente existente. Las entradas se guardan en Git como texto recuperado para editar por herramienta, sin nuevos dumps HTML, modelos ni binarios. [Contrato](../../../translation-sources/README.md).

El único cambio bajo `scripts/localization/` es el test de cobertura: la expectativa antigua de 106 propietarios solo con metadatos pasa a cero y conserva la advertencia sobre los literales del runtime. Se añade la comprobación independiente de los 106 propietarios, sin rebajar los controles. `autopilot-source.mjs`, motores, umbrales, modelos, workflows, datos/memoria, checkpoints y avisos permanecen intactos. Los workflows existentes ya contemplan `translation-sources/**` y hacen checkout del SHA completo; una futura campaña que use este commit recibe las entradas. No se reinicia ni cancela la campaña fijada anteriormente.

[Contadores por herramienta](../recovered-ui-v1/report.json) · [evidencia, comandos y límites](../recovered-ui-v1/evidence.json).

## Pendiente y relevo

Esto completa la conexión de **copia centralizada**, no la revisión integral de cada interfaz ni de todos los literales del JS. Los juegos necesitan datos coherentes por idioma; no se certifican por traducir botones. Siguen pendientes las siete capas/18 controles de cada herramienta y los 26 errores de fase 0b.

No se ejecutan `npm test`/builds/gate globales ni navegador/dispositivos/axe/Lighthouse en este lote de datos; no hay cambios de HTML/JS que publicar. Cero Actions de web, ejecuciones de modelos iniciadas por el agente, despliegues, activaciones, envíos a buscadores, nuevas pruebas físicas o cambios Cloudflare. No se verifica una versión nueva en producción. Delta de URLs indexables **0**; P-001–P-008 siguen pendientes, cero FALLA.

**Siguiente:** cerrar los requisitos pendientes del Paso A con ejecución local/manual: revisar DOMPurify/PR #135 antes de publicar; preparar la composición de principal/hub/300 conservando la preview separada hasta resolver las 73 colisiones y validar capacidad/rutas/noindex. Preparar los checks globales dentro de ≥10 GB libres/≤2 GB de huella. Verificar plan y ausencia de costes nuevos antes de publicar. No dar Paso A por cerrado ni avanzar a fase 0 o efectuar la migración sin sus verificaciones.

**Respaldo comprobado:** [47c1adc](https://github.com/pedronunezwebs-hash/usefulverse/commit/47c1adc7db351cfd76ffbddd0fcdeb1dd494da85) contiene los 106 JSON y README, verificados individualmente por hash del árbol remoto; su padre conserva recuperador/regresiones/documentación. El primer preparado del clon ligero omitió la carpeta fuera del sparse-checkout; se corrigió con `git add --sparse` y un commit adicional sin force. No se inició ninguna ejecución de modelos ni se publicó la web por estos commits; la campaña antigua continuó intacta.
