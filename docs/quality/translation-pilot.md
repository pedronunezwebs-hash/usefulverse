# Piloto de traducción · evidencia y reanudación

20-oct-2026 · Codex · PR [#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136).
Dependencia del Paso A; no habilita ninguna herramienta ni idioma. **Idiomas aprobados por este piloto: 0.**
Código y checkpoints de esta guía están en `feat/new-tools-batch-1` hasta integrar el PR; no confundirlos con `main`.

## Corpus y método

- Tres herramientas reales del método: `voice-changer`, `shikaku`, `dxf-viewer`.
- 214 unidades de contenido; 40 referencias fijas con botones, errores, cifras, marcadores y negaciones.
- 37 idiomas, contando inglés fuente y `nb-NO`. La ausencia de traducciones actuales se conserva como `null`.
- Corpus reproducible: `node scripts/localization/pilot-corpus.mjs <salida.json>`.
  SHA-256 de fuentes/contextos: `973363f6406d71eb55da472f83cfa0b75c33f95a106ddd48f12bdda2cc118554`.
- Candidatos: traducción publicada actual, M2M100 418M (MIT) y MADLAD-400 3B (Apache-2.0), revisiones fijadas
  en `scripts/localization/translation-pilot.py`. M2M100 no soporta `te`: no se inventa cobertura.
- Cada candidato se retrotraduce. Se guardan texto crudo y restaurado, marcadores, cifras, idioma detectado,
  alfabeto, longitud, truncamiento, tiempos, revisión del modelo y commit/run de procedencia.
- `machine-draft` es el único estado permitido a la salida automática. La puntuación y la aprobación requieren
  revisión separada con la rúbrica 0–3 de REVISION-FINAL §2 y el umbral de RUNBOOK §8.1.

## Ejecución sin gasto variable

Solo GitHub Actions del repositorio público, `ubuntu-latest`, máximo dos máquinas estándar simultáneas,
90 minutos por trabajo. Sin GPU, máquinas grandes, API de pago, artefactos nuevos, cachés persistentes ni LFS.
El job tiene `contents: read`, checkout sin credenciales persistidas y ningún secreto/paso de publicación.
La ejecución/descarga de modelos se rechaza fuera de Actions Linux. En el Mac solo se extrae el corpus y pasan tests ligeros.

```sh
gh workflow run deploy-cloudflare.yml -R pedronunezwebs-hash/usefulverse \
  --ref feat/new-tools-batch-1 -f translation_pilot=true \
  -f pilot_engine=both -f pilot_scope=references -f pilot_locales=es,nb-NO
```

Primero se mide esta tanda corta; después las 40 referencias de los 36 destinos y las tres herramientas completas.
No confundir un job verde con aprobación lingüística.

## Recuperar resultados, incluso si se interrumpe el job

Los registros completos aparecen individualmente en los logs como `UVPILOT_RECORD` (JSON/base64).
No contienen secretos ni datos de usuarios: únicamente copy público y traducciones candidatas.

```sh
gh run view <run-id> -R pedronunezwebs-hash/usefulverse --log > <logs-locales>
python3 scripts/localization/translation-pilot.py collect \
  --logs <logs-locales> --output docs/quality/translation-pilot/checkpoints/<motor>.jsonl
```

Para ambos motores, recoger el log de cada job en su archivo. Se rechazan registros aprobados, fuentes obsoletas,
revisiones desconocidas y duplicados contradictorios. Hacer commit/push de los checkpoints antes de cerrar.
El workflow los usa al reanudar; un checkpoint completo evita incluso descargar el modelo. Un cambio en fuente,
contexto, modelo, traducción actual o beam genera una identidad distinta y se vuelve a medir.

## Estado

- [x] Corpus y contratos de seguridad/reanudación con tests permanentes.
- [x] Workflow validado con Actionlint 1.7.12.
- [x] Comparación real corta de ambos motores en Actions; 320 registros, incluyendo la traducción actual.
- [x] 40 referencias computadas por destino, incluida la traducción actual donde existe; 4.809 registros guardados.
- [ ] Rúbrica del agente y elección documentada por idioma; no inventar revisión nativa.
- [ ] Tres herramientas completas, muestra de 20 frases por idioma, bokmål confirmado y umbral superado.
- [ ] Memoria y paquetes reales de las 300 en los idiomas aprobados.

## Primera comparación real: español y bokmål

[Run 39402041888](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402041888), commit `46f3a8d`.
Ambos jobs completados; el job de publicación quedó omitido. 40 frases × 2 destinos × 2 candidatos × 2 motores =
320 registros recuperados de los logs y guardados como JSONL. La traducción actual se revisa una vez aunque tenga
dos retrotraducciones. [Rúbrica del agente](https://github.com/pedronunezwebs-hash/usefulverse/blob/f8fe9291a4364431699fffe3b5af6d1593ebf1a8/docs/quality/translation-pilot/review-es-nb.json): 240 traducciones únicas evaluadas,
sin afirmar revisión nativa. Cada evaluación referencia el hash del texto y los registros concretos; un test impide
desvincular la puntuación de la traducción observada.

| Destino | Actual | M2M100 | MADLAD | Decisión |
|---|---:|---:|---:|---|
| es | 349/360 | 267/360 | 324/360 | Ninguno supera el umbral; preferencia provisional por actual tras corregir |
| nb-NO | 329/360 | 275/360 | 350/360 | Ninguno supera el umbral; preferencia provisional por MADLAD tras corregir |

La nota total no sustituye el umbral de cero errores en botones, cifras y negaciones. En esta primera tanda se registraron 60 salidas
incorrectas observadas como regresiones de contexto/hash, incluidas las negaciones `Nr.` de la traducción actual.
El control de tokens técnicos detecta además la pérdida de `.dxf`; la pérdida de `{duration}` de MADLAD se rechaza,
sin reconstruir ni adivinar el marcador. `automatic-summary.json` se recalcula desde los checkpoints con las reglas
actuales. **Estas combinaciones es/nb no pasan a traducción masiva.** Se necesitan glosario por sentido y una nueva
configuración piloto; no basta con un modelo más grande.

| Motor | Conversión | Total de la tanda | Pico RSS del proceso de inferencia |
|---|---:|---:|---:|
| M2M100 | 18,81 s | 70,99 s | 844.460 KiB |
| MADLAD | 77,21 s | 281,74 s | 3.771.300 KiB |

Son medidas de dos destinos y 40 referencias, no una predicción de las 300 herramientas ni de todo el catálogo.
El pico no incluye el subproceso de conversión. Los checksums de los modelos INT8 están en `UVPILOT_MODEL` del run;
se conservarán en el informe del lote. Dependencias pesadas verificadas en Actions: CPU-only Torch, conversor,
tokenizers y carga del modelo binario de langid. NumPy está fijado en 2.2.6: la primera ejecución con 2.5.4 falló
en Python 3.11 y las versiones ≥2.3 eliminan una operación binaria usada por langid 1.1.6.

Al recuperar una ejecución reanudada, el recolector **fusiona** sus registros con el checkpoint anterior y reemplaza
el JSONL de forma atómica. Los tests cubren conservación del lote previo, logs truncados y duplicados incompatibles.
Un cambio en el algoritmo de inferencia requiere cambiar la versión de formato/identidad antes de reutilizar resultados.

## Referencias adicionales y fuentes de las 300

[M2M100 completo de referencias](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402644071):
40 frases en sus 35 destinos soportados; `te` queda explícitamente sin ese motor. Checkpoint fusionado de **2.371 registros**
(1.400 salidas del modelo y 971 actuales con retrotraducción). Las 160 filas iniciales es/nb se reutilizaron;
el run añadió 2.211 registros en 481,10 s, incluidos 33,59 s de conversión. Pico RSS de inferencia: 1.019.372 KiB.

La [revisión de otros seis destinos](https://github.com/pedronunezwebs-hash/usefulverse/blob/f8fe9291a4364431699fffe3b5af6d1593ebf1a8/docs/quality/translation-pilot/review-core-six.json) compara las **40 referencias** en
de/fr/pt-BR/ja/hi/ar: 402 traducciones (40 del modelo + 27 actuales por destino; faltan las 13 actuales de DXF).
Con es/nb, **642 traducciones únicas evaluadas** por el agente y **202 salidas rechazadas** registradas como regresiones.
Esas combinaciones no superan el umbral. Esta revisión tampoco afirma revisión nativa ni sustituye los controles del lote.
No interpretar `known_semantic_errors=0` en los otros destinos como aprobación: falta su revisión.
La longitud y el alfabeto son señales de revisión; las siglas técnicas y la densidad del chino pueden producir avisos
sin un error de sentido. La retrotraducción se valida por separado: un texto correcto de ida no oculta cifras perdidas a la vuelta.

[MADLAD completo de referencias](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/39402907694):
**36 destinos × 40 referencias = 1.440 salidas del modelo**, más 998 actuales con retrotraducción, **2.438 registros**.
Se reutilizaron 160 filas es/nb y se añadieron 2.278. Tiempo del run: **2.278,69 s** (conversión: 136,74 s);
pico RSS de inferencia: **3.985.808 KiB**. Los hashes de las conversiones INT8 coinciden entre la tanda corta y la
completa en ambos motores. Detalle: `run-evidence.json` y `reference-coverage.json`.
Con los dos motores, **4.809 registros** guardados. Es la comparación de referencias; **el piloto completo de tres
herramientas y la aprobación de idiomas siguen pendientes**. No procesar las 300 con una combinación que haya fallado.

Preparar las fuentes de las 300 sin importar una BD ni traducir nada:

```sh
node scripts/localization/prepare-candidate-sources.mjs <directorio-temporal>
```

Produce 300 JSON con `sourceCopy` + unidades estables y un manifest reproducible: **15.815 unidades**, **7.887 textos
distintos**, **9.505 unidades con contexto**, **681.101 caracteres fuente**. El manifest está guardado en
`translation-pilot/candidate-source-manifest.json`; los JSON completos se regeneran desde la fuente versionada.
`relatedTools`, `outputName`, identidades y fechas de revisión quedan intactos. Los tests evitan volver a enviarlos al motor
y verifican que estén las 300 candidatas exactas, incluidos sus slugs históricos. No son paquetes aprobados para publicar.

Fuentes primarias: [M2M100](https://huggingface.co/facebook/m2m100_418M),
[MADLAD-400](https://huggingface.co/google/madlad400-3b-mt),
[conversión CTranslate2](https://opennmt.net/CTranslate2/guides/transformers.html),
[facturación de Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
