# UsefulVerse · Protocolo de pruebas (obligatorio en cada herramienta)

20-oct-2026 · Decisión de Pedro: **toda herramienta se verifica de forma exhaustiva antes de darla por terminada, y se
vuelve a verificar de forma automática cada semana.** Lo que un agente no puede probar (dispositivo real, permisos,
sensaciones) se apunta en `docs/quality/PRUEBAS-PEDRO.md` para que Pedro lo haga, con los pasos exactos.

Motivo: la auditoría del 20-oct encontró 26 errores reales (cálculos, juegos y conversiones) que habían pasado los tests
existentes. Un test que no comprueba el resultado correcto no protege a nadie.

La pasada integral abarca las 1.000 herramientas: 700 existentes y 300 en noindex. Antes de cerrar cada una deben quedar
resueltas todas sus capas aplicables; los pendientes concretos se conservan en `progress.csv`, sin marcarla terminada.
Después del cierre se mantienen las regresiones y la vigilancia semanal.

---

## 1. Las 7 capas de prueba (una herramienta está «verificada» solo si pasa todas las que le aplican)

| Capa | Qué comprueba | Cómo | Dónde corre |
|---|---|---|---|
| **1. Valores de referencia** | El resultado es **correcto**, no solo «que sale algo» | Mínimo 10 casos con la respuesta conocida de una **fuente externa** (libro, fuente oficial, líder del sector); se anota la fuente junto al caso. Incluye ceros, negativos, decimales, números enormes, coma decimal, unidades, años bisiestos y horario de verano | `npm test` (Node) |
| **2. Propiedades y casos aleatorios** | No se rompe con entradas raras | Pruebas con miles de entradas generadas (`fast-check`): ida y vuelta (A→B→A ≈ A), sin `NaN`, `Infinity` ni bloqueos; juegos: cada partida es válida y resoluble, y 1.000 generaciones no se repiten | `npm test` |
| **3. Regresión** | Un error arreglado no vuelve nunca | **Cada error encontrado se convierte en un test permanente** con el caso exacto que lo provocó (los 26 de la auditoría, los primeros) | `npm test` |
| **4. Navegador de extremo a extremo** | Funciona como lo usa una persona | Playwright: carga sin errores de consola; tarea principal con datos de ejemplo → resultado esperado; archivos de prueba (pequeño, grande, dañado, varios a la vez, arrastrar y pegar); botones copiar, descargar y siguiente paso | Ejecución local/manual |
| **5. Dispositivos e idiomas** | Funciona en todas partes | Viewport móvil 390 px con táctil, tablet y escritorio; solo teclado; **Chromium, Firefox y WebKit**; idiomas `en`, `es`, `de` (textos largos), `ar` (derecha a izquierda), `ja`, `hi` y `nb`; ningún texto en inglés en las páginas traducidas; sin desbordamiento horizontal; **regresión visual** con capturas en 320-1920 px (`PESO-Y-DISENO.md` §4); **presupuesto de peso** por página (§2) | Ejecución local/manual |
| **6. Accesibilidad y rendimiento** | Se puede usar y es rápido | axe-core sin errores; Lighthouse móvil dentro del presupuesto (LCP < 1,8 s, CLS < 0,05, INP < 150 ms) | Ejecución local/manual |
| **7. Revisión humana o de agente** | La experiencia es buena, no solo correcta | Test del niño de 8 años, comparación con el líder del sector y lectura del contenido. Lo que solo una persona con un dispositivo real puede juzgar → `PRUEBAS-PEDRO.md` | Agente + Pedro |

Decisión vigente de Pedro (28-oct): estas pruebas de herramientas se ejecutan local/manualmente, sin Actions.
Solo el traductor conserva sus Actions, incluidos sus propios controles y avisos; esa canalización no cambia.

## 2. Cuándo se ejecutan

- **En cada PR:** capas 1-3 completas y capas 4-6 de las herramientas que cambian.
- **Cada semana, sobre producción, las 700 (luego 1.000) herramientas:** capa 4 en modo rápido (carga sin errores
  y tarea principal) y capa 5 en Chromium móvil y WebKit. La revisión se ejecutará local/manualmente mientras rija el
  veto de Actions para webs; guardar el resultado y comunicar fallos sin afirmar que existe un vigilante web activo.
  La automatización futura debe respetar esta restricción y conservar los controles de calidad.
- **Antes de activar** una herramienta nueva (las 300) o de marcar una existente como terminada: las 7 capas, con la evidencia
  en el PR.

## 3. Herramientas que NO se pueden probar del todo de forma automática

**Aplicabilidad · decisión de Pedro, 28-oct-2026:** las pruebas físicas no se asignan por defecto a cada herramienta.
El agente prueba con fixtures, archivos y navegadores todo lo que pueda reproducir y solo pide a Pedro lo que requiera
hardware, condiciones reales del dispositivo o un juicio que no pueda comprobar. Por ejemplo, comprimir un PDF no
requiere probar un micrófono: integridad, contenido, compresión y descarga deben verificarse con archivos de prueba y navegador; no se crea una
fila de prueba física de micrófono. Si queda una limitación real de archivo/dispositivo, se añade solo ese caso concreto.
No se rebajan las siete capas aplicables ni se usa `n/a` para omitir una comprobación que sí corresponde.

WebKit en Playwright **no es** Safari de un iPhone de verdad, y un navegador sin interfaz no tiene cámara, micrófono,
altavoces ni permisos reales. Estas pruebas van a `PRUEBAS-PEDRO.md`:
- **Dispositivo real:** iPhone (Safari), Android de gama media (Chrome) y tablet.
- **Hardware y permisos:** cámara y escaneo, micrófono y grabadora, altavoces, grabar la pantalla con audio, portapapeles,
  pantalla completa, vibración, imprimir y guardar en PDF.
- **Archivos reales:** HEIC hecho con un iPhone, vídeos de móvil, PDFs grandes o escaneados, documentos de Office reales.
- **App instalable y sin conexión:** instalar en la pantalla de inicio, abrir sin internet y actualizar.
- **Sensaciones:** que el juego «se sienta bien» (táctil, sonido, dificultad) y la calidad del audio o del vídeo resultante.
- **IA en el dispositivo:** tiempos reales de resumir y traducir en el móvil y el portátil de Pedro.

## 4. Cómo se apunta una prueba para Pedro

El agente añade una fila en `PRUEBAS-PEDRO.md` con **todo lo necesario para hacerla en 2-5 minutos sin pensar**:
- **ID y herramienta** (enlace directo a la URL).
- **Por qué no lo puede probar el agente** (dispositivo, permiso, archivo real…).
- **Dispositivo:** iPhone / Android / ordenador.
- **Pasos numerados** («1. Abre…, 2. Pulsa…, 3. Elige un archivo HEIC de tu galería…»).
- **Qué debería pasar** (resultado esperado concreto).
- **Estado:** `pendiente`, después `OK` o `FALLA` + una nota de Pedro (o una captura).

Antes de pedirla, el agente completa las comprobaciones que sí puede hacer y arregla los fallos que ya pueda reproducir.
No se encarga a Pedro repetir un error conocido que el agente pueda comprobar por sí mismo; la prueba física confirma
únicamente el comportamiento o límite que queda fuera de esa comprobación. Los IDs aplicables se enlazan en la fila de
la herramienta en `progress.csv`; no se crean filas físicas para las herramientas que no las necesitan.

Pedro hace las pruebas pendientes cuando quiera (mejor por tandas). El agente siguiente:
1. Lee las filas `FALLA`, reproduce el problema si puede, lo arregla y vuelve a poner la fila en `pendiente` para
   confirmarlo.
2. Lleva el contador en `ESTADO.md` («Pruebas para Pedro: X pendientes · Y fallos abiertos»).
3. **Una herramienta con una prueba de Pedro pendiente no se marca como terminada.**

## 5. En `progress.csv`

Columnas nuevas por herramienta: `capa1_ref` · `capa2_prop` · `capa3_regr` · `capa4_e2e` · `capa5_disp` · `capa6_a11y_perf` ·
`capa7_revision` · `pruebas_pedro` (IDs pendientes). Una herramienta pasa a `terminada` solo con todas en `ok` o `n/a`
justificado.
