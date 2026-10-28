# Fuentes inglesas recuperadas

Estos 106 JSON son entradas de texto para el recolector ya existente: `autopilot-source.mjs` lee `toolId` y `sourceCopy` desde esta carpeta. No cambian los modelos, políticas, memoria, avisos ni workflows. Las campañas anteriores mantienen su SHA; la nueva copia entra cuando una campaña use el commit que contiene estas fuentes.

Se recuperan del bloque `application/json[data-tool-copy]` de cada HTML inglés, vinculado al ID del catálogo y a su controlador. `provenance` conserva rutas y SHA-256 del HTML, payload y JS. La marca histórica `localizationStatus: approved` se descarta: **ninguna herramienta o traducción queda aprobada por esta extracción**.

- `sourceCopy`: interfaz, mensajes, ayudas y ejemplos explicados, conservados literalmente.
- `nonTranslatableCopy`: XML/CSV de ejemplo, datos de puzzles, valores internos y parámetros de ejemplos. Se guardan completos fuera de la traducción automática. En un consumidor futuro deben restaurarse con su estructura original; no se deben traducir métodos, cartas, semillas ni coordenadas como si fueran texto.
- `provenance`: origen verificable, sin aprobación de calidad/publicación.

Los datos de juegos requieren una adaptación por idioma que conserve sus reglas. Esta captura tampoco demuestra que todos los literales de los controladores estén centralizados. El bucle de calidad y los controles completos siguen pendientes; el HTML y el JS publicados no cambian en este lote.

```sh
python3 scripts/recovery/extract-recovered-copy.py --check
python3 -m unittest discover -s scripts/recovery -p 'test_*.py'
node --test src/growth600/recovered-copy-source.test.mjs
```

El recuperador no ejecuta HTML/JS ni usa red. `--write --output <carpeta-nueva>` crea una extracción reproducible y se niega a sobrescribir fuentes mejoradas. Para un cambio intencional del inglés hay que revisar origen/procedencia y el diff; no regenerar encima de trabajo de otro autor. Los 106 JSON actuales proceden de la captura conservada en Git, no de una nueva lectura de producción ni de módulos originales que no se recuperaron.
