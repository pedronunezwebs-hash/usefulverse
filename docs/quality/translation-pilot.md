# Piloto de traducción · evidencia y reanudación

20-oct-2026 · Codex · PR [#136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136).
Dependencia del Paso A; no habilita ninguna herramienta ni idioma. **Idiomas aprobados por este piloto: 0.**

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
- [ ] Comparación real corta de ambos motores en Actions.
- [ ] 40 referencias por destino, incluida la traducción actual donde existe.
- [ ] Rúbrica del agente y elección documentada por idioma; no inventar revisión nativa.
- [ ] Tres herramientas completas, muestra de 20 frases por idioma, bokmål confirmado y umbral superado.
- [ ] Memoria y paquetes reales de las 300 en los idiomas aprobados.

Fuentes primarias: [M2M100](https://huggingface.co/facebook/m2m100_418M),
[MADLAD-400](https://huggingface.co/google/madlad400-3b-mt),
[conversión CTranslate2](https://opennmt.net/CTranslate2/guides/transformers.html),
[facturación de Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
