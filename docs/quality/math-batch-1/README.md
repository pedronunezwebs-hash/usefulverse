# Diez herramientas consecutivas · prioridades5–14

29-oct-2026 · [PR148](https://github.com/pedronunezwebs-hash/usefulverse/pull/148), sobre PR147→146→145→144.
Fuente c056ff1, última modificación funcional; mejoras posteriores del arnés no alteran producto.
**Preparadas sin publicar, ninguna terminada.** Lote continuo solicitado por Pedro; instalación, base visual y controles reutilizados.
25.625 URLs públicas antes/después, delta0; cero activaciones/300 noindex. Sin Actions web, deploy, API pagada ni nuevo servicio.

| Herramienta | Referencias | Intenciones | Carga estimada B | LCP ms | CLS |
|---|---|---|---|---|---|
| [fraction-calculator](../tools/fraction-calculator/README.md) | 12 | 22 | 56,609 | 935 | 0.00000 |
| [prime-number-checker](../tools/prime-number-checker/README.md) | 13 | 19 | 56,032 | 934 | 0.01261 |
| [percentage-calculator](../tools/percentage-calculator/README.md) | 12 | 26 | 56,424 | 936 | 0.00568 |
| [number-to-words-converter](../tools/number-to-words-converter/README.md) | 12 | 21 | 56,445 | 935 | 0.00252 |
| [ratio-proportion-calculator](../tools/ratio-proportion-calculator/README.md) | 12 | 21 | 56,440 | 935 | 0.01018 |
| [discount-calculator](../tools/discount-calculator/README.md) | 12 | 22 | 56,953 | 934 | 0.00337 |
| [random-number-generator](../tools/random-number-generator/README.md) | 12 | 19 | 57,249 | 936 | 0.00000 |
| [average-calculator](../tools/average-calculator/README.md) | 12 | 20 | 57,433 | 936 | 0.00933 |
| [age-calculator](../tools/age-calculator/README.md) | 12 | 18 | 57,001 | 941 | 0.00179 |
| [fuel-cost-calculator](../tools/fuel-cost-calculator/README.md) | 12 | 20 | 57,366 | 935 | 0.00000 |

## Qué cambió y qué se probó

Diez motores ligeros, Worker por herramienta, plantilla Planeta Infinito, entradas exactas, resultado con pasos y TXT completo.
Conserva media ponderada/nota final, convenciones del29febrero, todas las unidades de combustible y funciones nativas anteriores.
No tiene cupos de10^12/999.999.999.999/100 resultados. Fallos, datos inválidos y cancelación borran respuestas antiguas.
Compartir incluye solo valores visibles y conserva canonical base; aleatorios comparte opciones y hace otra tirada.
Cuatro ejemplos/diez FAQ por página, privacidad real y contenido propio; máxima similitud5-gram10,27%.
Los keywords son funciones/preguntas inferidas: no se inventan cifras, posiciones ni observaciones de Google.
Search Console/PAA y revisión completa de tres competidores por intención aún pendientes.

- [Node completo](node-full.log):3.542 correctas/0fallos/0omisiones,50.090ms. [160 focalizadas](focused-ten-v1.log) incluidas.
  121 referencias independientes Python Fraction/datetime/primalidad y to-words7.1.0, más5.000 comparaciones adicionales de palabras;
  propiedades racionales5.000, porcentajes/razones5.000, descuentos/media5.000, combustible5.000, aleatorios1.000 únicos/5.000 rangos grandes;
  primos0–10.000 exhaustivos y pseudoprimos de64bits. No son3.542 revisiones humanas ni1.000 herramientas aprobadas.
- [Navegadores](browser.json):303 controles con tarea real y540 geometrías axe0, tres motores secuenciales, nueve anchos/dos temas;
  120 apaisados, fixtures RTL/largos/texto200; listas de1.000, etiquetas/formas de todos los modos, descargasTXT completas,
  copia denegada/fallback, parámetros maliciosos, offline y cancelación real de Mersenne de19.937bits.
  Se retiraron30 envoltorios de checks que no ejecutaban tarea; el recuento303 los excluye.
  [Mejora final del arnés](random-share-followup.json), repetida en tres motores, verifica opciones/restauración y validez del nuevo sorteo, sin comparar un valor consigo mismo. Primer intento de seguimiento no pudo conectar porque el servidor temporal había terminado; reiniciado, las tres ejecuciones pasan.
- Lighthouse13.6 individual: diez100/100/100, LCP934–941ms, CLS≤0,012608/TBT0.
  Sin traza separada Slow4G×4 en este lote, sin INP de campo ni garantías de dispositivo real.
- [Regresiones](regressions.json): cinco límites/errores públicos reproducidos y cinco errores detectados/corregidos del prototipo;
  cada caso tiene test permanente. No se marca fase0b entregada: ninguno está publicado.
- [Producción](production.json): widgets antiguos básicos correctos y errores/límites documentados;22 navegaciones Chrome200,
  diez páginas del lote y doce relacionadas adicionales. No sustituye verificación pública de los candidatos.
- [Gate20 existente](locale-release.txt) correcto; no aprueba el nuevo texto ni37 destinos.
- Capturas originales por herramienta y revisión real de composiciones móvil390/tablet768/escritorio1440;
  contacto comparativo solo para triage, no se usa como imagen de producto ni suplanta capturas originales.

## Límites y siguiente integración

Cada README incluye18 controles: faltan traducciones reales/hreflang, sitio integrado/check/CSP/caché, lector de pantalla,
zoom real200 y diseño común Pedro/P-010; widget de inserción nivelA e investigación ampliada siguen pendientes.
No cámara/micrófono/altavoces para estas calculadoras. Diez pruebas Pedro existentes/0FALLA, sin IDs nuevos.
El inglés de14 prototipos necesita lote separado hacia el corpus activo, preservando UI pública y traductor.
Los siete workflows/modelos/memoria/políticas no se modifican ni se dispara una campaña manual.
La campaña40843674935 continúa sola; [lectura](translation-status.json). El último aviso141 es pending de la tanda anterior.

Fase0 mantiene prioridad de entrega: hub no antes30-oct00:00+07 y principal otro día; sin cerrar fase hasta ambos verificados.
La espera permite preparar fuentes, no publicar cambios posteriores. Siguiente prioridad de herramientas:15pdf-ocr; leer PDF-VS-ILOVEPDF/PDF-IA antes de editar.

## Receta eficiente

Clon ligero/≥10GB libres/≤2GB propios, dependencias pinned y caché/navegadores/perfiles dentro del clon, un trabajo pesado a la vez.
Reutilizar base y corpus existente. QA adicional to-words7.1.0 es solo verificador; no se entrega en el navegador.
`capture-recipe.mjs` se ejecuta desde la carpeta .qa-math/ del clon para conservar sus rutas relativas.

```sh
node --test src/quality/math-family/*.test.mjs
node scripts/build-quality-math-batch.mjs .qa-math/build
python3 -m http.server 54839 --bind 127.0.0.1 --directory .qa-math/build/site
PLAYWRIGHT_BROWSERS_PATH="$PWD/.qa-math/browsers" node scripts/security/math-quality-browser.mjs http://127.0.0.1:54839/ .qa-math/browser.json
node scripts/security/quality-lighthouse.mjs http://127.0.0.1:54839/tools/fraction-calculator/ .qa-math/lighthouse.json
```

Repetir Lighthouse por cada herramienta. El servidor Python no representa cabeceras/compresión de Cloudflare.
Recibo final de retirada se añade al liberar candado; no interpretar la preparación como aprobación/publicación.
