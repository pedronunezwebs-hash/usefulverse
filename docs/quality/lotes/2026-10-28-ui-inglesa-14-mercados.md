# 28-oct-2026 · Fuentes inglesas de las 14 herramientas de mercado

Las 14 herramientas que solo aportaban tres metadatos al corpus ahora exponen sus fuentes inglesas existentes de interfaz. El recolector ya admite exportaciones por modo; un módulo pequeño de alias conecta los objetos originales, sin duplicar ni reescribir su texto. No cambia el motor del traductor, modelos, políticas, memoria, checkpoints, workflows ni campaña activa.

## Resultado

- Corpus de 1.000 herramientas: **42.053 → 42.685 unidades**, +632 netas. Las 14 pasan de 42 a 674 unidades en conjunto. Los otros 988 documentos (incluidos dos compartidos) y sus unidades conservan sus hashes.
- Propietarios solo con metadatos: **120 → 106**, todos recuperados. La conexión de copia centralizada no acredita cada literal heredado de JavaScript ni una herramienta completa.
- Los mensajes y ejemplos de seis formularios aparecían como `undefined`: siete llamadas al constructor (una de ellas de un modo antiguo sin ruta activa) colocaban los mensajes dentro de los campos y el ejemplo en el argumento de mensajes. Se separan correctamente los argumentos sin cambiar fórmulas, tasas ni supuestos. Los controladores de ortografía y guionado se adaptan al contrato de mensajes, con pruebas de éxito/error mediante un portapapeles simulado; no se modifica el portapapeles de Pedro.
- El asunto inicial de la carta de alquiler estaba fijo en inglés. Usa ahora el campo traducido que ya existía, escapado como atributo HTML.

## Pruebas locales/manuales

Primero se reprodujeron los fallos y después se corrigieron. Regresiones permanentes en `market-ui-source.test.mjs` y `remaining-tools-copy.test.mjs`; [fallos anteriores](../market-ui-v1/regressions-before.txt).

- **478 pruebas Node correctas**, cero fallos/omisiones: todas las de `src/markets-no-ch/*.test.mjs` más las de fuente y extracción. [Salida](../market-ui-v1/tests.txt).
- Build parcial real de **14 × 37 = 518 páginas**, 652 archivos; cero `undefined` visible. Cambian 222 páginas (seis herramientas × 37) y un controlador respecto al build anterior al arreglo; el resto conserva sus bytes.
- Chrome sobre el build final: **378 comprobaciones** (seis formularios × `en/es/de/ar/ja/hi/nb` × 320/360/390/414/768/1024/1280/1440/1920), sin scroll horizontal, mensajes/ejemplos vacíos, asunto deslocalizado ni errores/avisos de consola.
- Revisión visual inline: móvil inglés 390, tablet árabe 768 y escritorio alemán 1440. La captura de escritorio permitió encontrar el asunto fijo. DevTools rechazó guardar capturas en el workspace; se inspeccionaron inline, sin archivos de capturas guardados.
- Tareas reales en Chrome: ganancia 5.000 y resultado 500 al 10%; base de herencia 900 y resultado 90 al 10%; vista previa de texto idéntica a la entrada. Son comprobaciones del funcionamiento, no validación jurídica/fiscal completa.
- Una primera ejecución ampliada necesitó dos dependencias bloqueadas en el lockfile y un documento omitido del sparse checkout; se recuperaron localmente y la ejecución final pasó. No se modifican dependencias/versiones del repo.

[Corpus y contadores](../market-ui-v1/report.json) · [comandos, versiones y límites](../market-ui-v1/evidence.json) · [navegador](../market-ui-v1/browser.json).

## Límites y relevo

No se ejecutaron el `npm test` global, los builds completos principal/hub, el gate global de locales, Firefox/WebKit ni axe/Lighthouse. No se publican ni se dan por terminadas estas herramientas: siguen pendientes las siete capas y los 18 controles completos, además de los hallazgos de auditoría (por ejemplo FAQ/JSON-LD). Los arreglos nuevos de interfaz no cierran ninguno de los 26 errores de fase 0b.

Sin despliegue ni comprobación de una versión nueva en producción; delta de URLs indexables **0**, cero activaciones, cero idiomas aprobados, cero nuevos tests físicos para Pedro. P-006 de micrófono se conserva; ocho pendientes/cero FALLA en total. Fuente solamente en `feat/new-tools-batch-1`, PR #136 borrador; `main` recibe el relevo y la evidencia, sin las 300 ni este runtime. No se inicia ningún Action de web ni se toca Cloudflare.

**Siguiente:** extraer la UI inglesa de los 106 recuperados, empezando por `radical-calculator` en `live-only-106.manifest.json`: inventariar HTML/JS inglés y separar texto de fórmulas/datos antes de conectar una fuente reutilizable con pruebas. Mantener la preview separada y Paso A abierto. Después siguen los gates de Paso A; todavía no avanzar a fase 0 ni ejecutar la migración del dominio.

**Código respaldado:** [ee9035d](https://github.com/pedronunezwebs-hash/usefulverse/commit/ee9035d5b5c40cbb8b6b1f5001bfb58a44d3a3db).

**Alertas existentes antes de publicar:** el push notificó tres alertas abiertas de DOMPurify en la rama por defecto (crítica/alta/baja); la API confirma que las tres indican 3.4.17 como primera versión corregida. Existe PR #135 para revisión manual. Este lote no modifica dependencias ni afirma que la aplicación esté expuesta a todos esos modos de uso; revisar usos y regresiones antes de integrar/publicar. [Datos de GitHub](../market-ui-v1/security-alerts.json).

Cierre UI-14 2026-10-28T09:20:26.426094+00:00: código/reportes comprobados en GitHub antes de eliminar el clon y todos los temporales propios (811 MB); servidor detenido y pestaña propia en blanco. 43.15 GiB libres. Candado LIBRE; 106 fuentes recuperadas y revisión manual DOMPurify PR #135 pendientes; cero despliegues, activaciones o Actions de web. [Recibo](../market-ui-v1/closure.json).
