# Paso A · piloto de traducción en Actions · 20-oct-2026 · Codex

[PR #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136), rama `feat/new-tools-batch-1`, borrador.
Este lote resuelve infraestructura y obtiene evidencia lingüística; **no completa el Paso A ni certifica herramientas**.

## Alcance y evidencia recuperable

- Candado reservado en `main`: `6b0680d` (`[skip ci]`); checkout propio, superficial y filtrado.
- `46b53ea`: corpus real, runner y workflow manual de piloto. `46f3a8d`: sincronización del candado y dependencias CPU.
- `3d6fdc6`, `e7cfb77`: checkpoints de los dos motores y traducción actual; rechazo de errores observados.
- `5bb0a2a`, `82c28ac`, `0d719a4`: rúbrica, reanudación atómica, extracción segura de las 300 y controles de retrotraducción.
- Informe operativo: [translation-pilot.md](../translation-pilot.md). Datos, rúbricas, hashes y manifest:
  `docs/quality/translation-pilot/`. Los borradores se guardan como JSONL; no hay SQLite/LFS ni pesos de modelo en Git.

## Qué se ha comprobado

1. Corpus de `voice-changer`, `shikaku`, `dxf-viewer`: 214 unidades, 40 referencias, 37 idiomas incluyendo inglés y bokmål.
2. [Tanda corta 39402041888](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402041888):
   M2M100 y MADLAD en español/bokmål, más traducción actual y retrotraducción: **320 registros**.
3. [M2M100 referencias 39402644071](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402644071):
   **35 destinos × 40 referencias = 1.400 salidas del modelo**; con traducción actual, **2.371 registros** conservados.
   `te` se declara no soportado. Las 160 unidades ya medidas de es/nb se reutilizaron: no aparecen como nuevas en el run.
4. [MADLAD referencias 39402907694](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402907694):
   **en ejecución al redactar este bloque**; actualizar resultado y checkpoints antes de cerrar el lote.
5. Revisión del agente (sin afirmar revisión nativa): 240 traducciones de las 40 referencias es/nb y cribado de otras
   222 traducciones, 20 claves por destino en de/fr/pt-BR/ja/hi/ar (DXF actual ausente allí). Rúbrica 0–3 por significado,
   cifras/negaciones y naturalidad. Evaluaciones ligadas por hash a los textos observados.
6. **154 salidas incorrectas observadas** registradas por contexto, idioma y hash como regresiones permanentes.
   Incluyen borrar → «audio claro», reanudar → resumen/reciclar/biografía y negación → número. Las traducciones actuales
   también contienen fallos; no se importan como aprobadas por antigüedad.
7. Extracción reproducible de las 300 fuentes: **15.815 unidades**, **7.887 cadenas distintas**, **9.505 unidades de memoria
   con contexto**, **681.101 caracteres fuente**. Las rutas, archivos, revisor y fecha se conservan como datos sin traducir.
   El paquete incluye `sourceCopy`, requerido por el exportador de copy aprobado. Manifest y SHA-256 guardados.

## Regresiones y pruebas

- Primero se reprodujeron, después se corrigieron: contexto `runner.temp` inválido en env del job; dependencias NumPy/Python;
  pérdida del lote previo al recoger un run reanudado; slugs/revisores/archivos incluidos como texto traducible;
  pérdida de `.dxf`, `{duration}`, cifras/marcas en retrotraducción; falso positivo de extensión por un punto entre frases.
- Resumir/recoger resultados no aprueba copy. Un checkpoint completo evita descargar/importar modelos; probado sin pesos
  ni librerías de modelo en el Mac. Escritura atómica; log truncado/duplicado incompatible no sobrescribe el checkpoint.
- Tests ligeros actuales: **21 Python (19 pasan; 2 requieren las dependencias del job dedicado)** y cuatro tests Node
  focalizados. Las dos pruebas reales de dependencias se ejecutaron y pasaron en los jobs del piloto.
- Actionlint 1.7.12: workflow válido. Gitleaks 8.30.1: 0 secretos en los diffs publicados.
- CI de código completo pendiente de enlazar al último commit al cerrar. Los runs anteriores validaron ambos builds,
  `locale:release-check` y la preview aislada de las 300, sin desplegar.

## Producción, coste y límites

GET con `curl`, 20-oct a las 09:38 UTC: sitemaps XML de `usefulverse.com` **10.260** y de `tools.` **15.365**:
**25.625 → 25.625 URLs indexables**. `/tools/zzz-no-existe/`, `/es/zzz/` y `/zzz.html` del hub aún devuelven **200**.
La fase 0 y su arreglo siguen pendientes; no se ha avanzado de fase. Evidencia JSON del lote pendiente de incorporar.

**Sin merge, deploy, activaciones, 301, cambios de dominio ni envíos a buscadores.** GitHub Actions del repo público,
máquinas estándar `ubuntu-latest`, máximo dos jobs de traducción por run, sin artifacts/cachés nuevos ni APIs de pago.
Job con `contents: read`, checkout sin credenciales persistidas, sin secretos de Cloudflare ni pasos de publicación.
No se ha acreditado el coste global de Cloudflare del ciclo; no se ha hecho ninguna mutación en esa cuenta.

Los modelos se descargaron y eliminaron en los runners desechables, nunca en el Mac. Extracción local ligera de fuente;
sin builds completos locales. El directorio temporal propio se elimina después de comprobar el push; registrar limpieza real.

## Pendientes y relevo

- **0 idiomas aprobados por este piloto**. es/nb no superan el umbral con ninguno de los candidatos sin corregir;
  preferencias provisionales: actual corregido para es, MADLAD corregido para nb. No congelar motores con estas notas.
- Terminar la comparación de las 40 referencias en todos los destinos; glosario por sentido y protección de marcadores;
  corregir configuración antes de ampliar las combinaciones fallidas. Después, tres herramientas completas y muestra
  de 20 cadenas por idioma, umbral de RUNBOOK §8.1. No publicar fallbacks EN ni inventar revisiones.
- Capacidad del Paso A sigue abierta: sumar las 300 al hub excede Pages. RUNBOOK §4b está previsto después de fase 0;
  no se ha ejecutado ni dado por completado. Mantener el bloqueo explícito y resolver la dependencia antes de publicar.
- Los 301 paquetes de las 300 + chrome siguen sin aprobación. Fuente y manifest están listos para reextraer sin una BD local.
- Las siete capas, 18 puntos de puerta, responsive, RTL, hardware y rendimiento de las 300 permanecen pendientes.
- Pedro: **0 pruebas nuevas** de este lote; P-001–P-008 continúan pendientes, **0 FALLA**. No hay UI nueva publicada.
- Contadores: existentes terminadas **0/700**, con nb **100/700**, nuevas en main **0/300**, activadas **0**, semana **0/30**.

## Limpieza

Pendiente del cierre: comprobar todo en GitHub, liberar el candado en main y eliminar únicamente la carpeta temporal propia.
