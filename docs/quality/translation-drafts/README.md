# Traducciones automáticas en GitHub

Decisión de Pedro, 28-oct-2026: inglés comprensible traducido en segundo plano, controles automáticos y avisos si se para. El agente mejora la web y consulta informes; no traduce ni relee cada frase. Los pilotos v1–v33, sus juicios y memorias permanecen intactos.

## Operación normal

`UsefulVerse translation autopilot` se ejecuta a diario (02:23 UTC), cuando cambia `src/` o `translation-sources/`, o manualmente:

```sh
gh workflow run translation-autopilot.yml --repo pedronunezwebs-hash/usefulverse --ref main
```

Fija el SHA de la fuente al arrancar. La última rama inglesa se conserva en el manifiesto de resultados; inicialmente es `feat/new-tools-batch-1`. Solo admite esa rama o `main`. Al integrar Paso A, usar `source_ref=main`. No moverla antes de que main contenga las fuentes y scripts necesarios. Pausa: `scripts/localization/translation-control.json`, `enabled:false` en main. No ejecutar el workflow manual antiguo en paralelo.

Seis vueltas como máximo, cuatro grupos de destinos y cuatro modelos simultáneos. Se duplicó el paralelismo tras la prueba inicial sin cambiar ningún filtro de calidad. Cada job tiene presupuesto de hasta 120 min de generación y 120 de auditoría, más instalación, con timeout 330 min. La campaña deja de iniciar modelos al cumplir 24 h; las colas pueden añadir espera y reducir las vueltas útiles. `minutes=0,waves=1` recupera y guarda el informe sin descargar modelos. No hay un job de 24 h ni garantía de servicio continuo. El siguiente día recupera pendientes. Cuando todas las unidades están procesadas omite modelos; una cuarentena no se regenera indefinidamente.

## Trabajo automático

1. Extrae las fuentes inglesas reales de los 1.000 propietarios del catálogo y textos comunes. Medición inicial: 42.053 claves, 25.832 pares texto/contexto, 36 destinos. Cobertura parcial explícita: 106 recuperadas solo metadatos y otras 14 sin interfaz centralizada detectada. No acredita toda su UI. Una mejora puede añadir `translation-sources/<slug>.json` con `toolId` y `sourceCopy`; sustituye su extracción anterior.
2. Reutiliza únicamente identidad exacta de texto, contexto, idioma y configuración del modelo. Cambiar el inglés invalida el paquete afectado. MADLAD-400 3B CPU int8, revisión fija; datos protegidos, idioma/alfabeto, longitud, truncamiento y marcas se validan antes de aceptar nada.
3. Retrotraduce cada candidato estructuralmente válido que audita. Compara el significado con multilingual-e5-small y entailment/contradicción DeBERTa en ambas direcciones. Conserva cifras y orden, variables, URLs, código, negación, dirección de conversión, condiciones y estado de carga. Modelos y licencias en `semantic-policy.json`. Verifica diez referencias al cargar los modelos; un fallo cierra la aceptación. Los modelos también pueden equivocarse: este filtro no prueba fidelidad perfecta ni calidad nativa.
4. Deja en cuarentena lo dudoso y exporta solo entradas con todos los controles actuales. Las auditorías están ligadas a los bytes crudos y al hash de la política/código. No modifica evidencias antiguas ni finge aprobación humana.
5. Después de cada vuelta guarda memoria y paquetes en [automation/translation-results](https://github.com/pedronunezwebs-hash/usefulverse/tree/automation/translation-results). `report.json` contiene generadas, auditadas, pendientes y cuarentenas. `manifest.json` fija procedencia; `memory/` conserva registros originales y auditorías; `packages/` contiene solo entradas utilizables. Recupera también logs de jobs completados/cancelados y evita descargarlos otra vez cuando ya están guardados. Los logs son recuperación provisional, no respaldo permanente.
6. `automatic-packages.mjs` aplica entradas a la copia inglesa solo con hash/contexto/política coincidentes y conserva el inglés ante entradas faltantes o desfasadas. Es un adaptador de build preparado; **aún no está conectado al build de producción**. No cambia URLs, idiomas aprobados, noindex ni despliega. La puerta de herramienta y publicación sigue vigente.

## Avisos

`Translation alerts` vigila a los 13 y 43 minutos de cada hora y al terminar una tanda. Abre/actualiza una incidencia asignada y con mención a Pedro si falla, se cancela, queda en cola demasiado tiempo o falta el informe, GitHub lo desactiva o no arranca ninguna campaña durante más de 30 h con trabajo pendiente; también informa de fin/pendientes. No repite el mismo estado. La prueba real es [#137](https://github.com/pedronunezwebs-hash/usefulverse/issues/137): verificada en la bandeja GitHub como mención. El correo y el aviso del teléfono dependen de tus ajustes (P-009). Una caída global o retraso del propio GitHub puede retrasar también el aviso; no prometer notificación inmediata o fuera de GitHub.

## Coste y seguridad

**Presupuesto: 0 USD.** Repo público comprobado en cada campaña, solo `ubuntu-latest` estándar; se detiene si deja de ser público. Sin APIs pagadas, tokens de ChatGPT, artifacts, cachés persistentes, LFS, Packages, runners grandes/GPU, Codespaces, Containers ni Cloudflare. Se usa el token efímero nativo de Actions, sin secretos nuevos. Solo el publicador puede escribir y solo en la rama de datos y rutas permitidas, con push sin force. Modelos tienen lectura; vigilante tiene `issues:write`. Excepción acotada documentada en AGENTS.md por autorización de Pedro.

Los runners estándar públicos son gratuitos según [facturación de GitHub](https://docs.github.com/en/actions/concepts/billing-and-usage). Los [límites](https://docs.github.com/en/actions/reference/limits) y [retrasos/desactivación de cron](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) impiden garantizar 24/7. Revalidar condiciones antes de cambiar infraestructura. No se instala un monitor de Codex que consuma sesiones o dependa del Mac.

## Recuperación excepcional

No volver a pilotos manuales por idioma. Consultar `report.json`, resumen Actions e incidencia; arreglar el sistema con test permanente. Ante cancelación, la próxima vuelta/día recoge los logs aún retenidos, valida registros y guarda el respaldo. No borrar logs antes de comprobar el commit de datos. No forzar conflictos de checkpoint ni push. `Background translation drafts` queda como antecedente de migración, no como operación normal.
