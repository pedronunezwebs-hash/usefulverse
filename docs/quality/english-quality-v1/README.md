# Inglés de catorce prototipos conectado al corpus

29-oct-2026. Fuentes Date/Time/Roman/Barcode y las diez calculadoras de PR148, preparadas para el recolector existente.
Este lote entrega **entrada inglesa revisada**, sin traducir manualmente ni modificar motor, modelos, workflows,
políticas, memoria, campaña activa o publicación. No aprueba idiomas ni herramientas.

[Medición](corpus-proof.json):1.000 propietarios conservados,0 solo metadatos;48.403→50.530 unidades inglesas,
36 destinos,32.834 pares texto/contexto distintos. Incremento neto2.127 unidades; no son páginas ni traducciones terminadas.
El cambio no acelera por sí mismo los modelos: evita que la campaña siguiente siga traduciendo únicamente la copia antigua.

Se detectaron **99 identificadores técnicos** dentro de ejemplos/enlaces:56 IDs de botones,42 slugs y un host.
Ahora viven en `nonTranslatableCopy`, junto a los datos de ejemplos ya existentes. Las frases mantienen sus claves/contexto;
el extractor automático ya solo lee `sourceCopy`. No se cambia ninguna regla del traductor.
Estos99 valores ya no crean objetivos inútiles ni corren el riesgo de traducirse y romper botones/rutas.

## Pruebas y límites

- [Regresión antes](corpus-before.log):14 fallos reproducidos; cada fuente mezclaba datos técnicos con prosa.
- [Después](corpus-after.log):17 pruebas correctas, dos de cobertura existente y14 de fuentes más una del ensamblador.
  `scripts/localization/quality-copy-source.test.mjs` queda permanente y se incluye en la suite ordinaria.
- [Suite completa](node-after-source.log):3.557 correctas/0fallos/0omisiones,49.678ms, en la pila de prototipos.
  No es el resultado de correr todas esas pruebas desde main: este PR solo añade la prueba de14 fuentes.
- [Catorce renderizados](render-equivalence.json) y [47 rutas/recursos del build conjunto de diez](build-equivalence.json)
  son idénticos byte a byte antes/después. Los hashes usan placeholders fijos para los renderizados individuales;
  el build completo compara archivos reales y sus rutas. Se conserva la QA visual/navegador/Lighthouse anterior.
- El PR de entrada inglesa modifica solo14 JSON, una prueba y documentación. Todos los archivos de runtime,
  builders, índices, workflows, dependencias y activos públicos de main conservan sus bytes.
  No se repite un build completo nativo por añadir fuentes que no consume. Sin despliegue ni cambio de URLs públicas.

Los prototipos ensamblan copia y datos con `src/quality/shared/source-copy.mjs`, manteniendo compatibilidad con su forma antigua.
El helper ignora IDs/rutas que aparezcan accidentalmente en prosa traducida, conserva los IDs del dato técnico y valida
slugs/hosts y correspondencia de arrays. La compatibilidad se incorpora también a PR144–147 antes de integrar las fuentes.
Este helper solo afecta a los builders optativos; no pertenece al lote de main de entrada inglesa.

Tras integrar el PR y alinear sin force `feat/new-tools-batch-1`, **la próxima campaña que fije ese SHA verá el inglés nuevo**.
La campaña ya arrancada conserva su SHA anterior y no se cancela/reinicia; no se promete traducción inmediata ni servicio24/7.
No lanzar otra campaña manual ni cambiar source_ref/modelos para forzar trabajo. El cron/cola existentes continúan solos.
Las salidas aún necesitarán integración, comprobación real y puerta de publicación; generar paquetes no equivale a aprobarlos.

Reproducción mínima (sin modelos/red):

```sh
node --test scripts/localization/autopilot-source.test.mjs scripts/localization/quality-copy-source.test.mjs
node scripts/localization/autopilot-source.mjs .qa-source/corpus.json
```

Crear primero una carpeta temporal propia; respetar≥10GB libres/≤2GB de huella. No conservar el corpus completo en Git.
La prueba de ensamblado vive solo en las ramas de prototipos; allí se ejecuta además `node --test src/quality/shared/source-copy.test.mjs`.

**Entrega verificada:** [PR149](https://github.com/pedronunezwebs-hash/usefulverse/pull/149) integrada mediante9eac161;[recibo](delivery.json). Fuente automática alineada sin force. [Compatibilidad de cuatro ramas](compatibility.json), con diez renderizados históricos idénticos; [alcance del PR](scope-proof.json). La campaña activa sigue usando suSHA anterior.
