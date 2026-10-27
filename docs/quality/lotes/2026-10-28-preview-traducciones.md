# 28-oct · Paquetes verificados conectados a la vista previa

Se conecta el adaptador de traducciones al build aislado de las 300 herramientas. Es optativo y exige simultáneamente `GROWTH600_NOINDEX_DRAFT_RELEASE=1`, `GROWTH600_PREVIEW_ONLY=1` y solo candidatos con `indexable:false`. No permite usar este camino en el build publicado ni sustituye copias de las 700 existentes. [Código f0960a3](https://github.com/pedronunezwebs-hash/usefulverse/commit/f0960a31dea95a2daec2c4c0bd90bb33a422edc8), [PR borrador #136](https://github.com/pedronunezwebs-hash/usefulverse/pull/136).

## Flujo y garantías comprobables

1. Actions lee una instantánea de `automation/translation-results` sin escribir en ella. Python 3.11 vuelve a validar los registros/auditorías y las semillas conservadas con las políticas actuales, incluido el veto de errores históricos y los refinamientos ligados a su original. No ejecuta modelos ni hace llamadas de traducción para preparar la vista previa.
2. El build consume exclusivamente esos paquetes recién exportados, ligados a política semántica, política de calidad, instantánea de fuentes, hash del inglés y contexto. Aplica solo las entradas válidas; faltantes o fuentes/contextos desactualizados conservan el inglés normalizado. Una procedencia inválida bloquea el build. No incorpora traducciones antiguas sin comprobar para rellenar huecos.
3. Las rutas conservan su idioma y estado de borrador. Títulos sin marca o que excedan 60 caracteres y descripciones que excedan 160 usan el respaldo inglés; no se trunca una traducción para simular que pasa. Las variantes pt/zh/zh_tw/tl se resuelven a pt-BR/zh-CN/zh-TW/fil. Esta vista previa mantiene los 36 idiomas existentes; no añade ni aprueba nb-NO.
4. Se compara el JSON real que consume cada controlador en el HTML generado con la copia preparada. Se comprueban noindex y exclusión del sitemap; se exige haber aplicado alguna traducción real para evitar un éxito vacío. El camino normal de publicación sigue sin consumir estos paquetes.

## Evidencia y límites

- [CI 40599566567](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40599566567), fuente f0960a3: pasos de revalidación de memoria y build de la vista previa correctos. El build comprueba las 10.800 rutas de herramientas (300 × 36), sus payloads, noindex, homes y sitemap sin URLs indexables. **Suite completa y builds publicados todavía en curso al guardar este relevo; no declararlos correctos.** [Estado observado](../translation-drafts/preview-v1/ci.json).
- Local, sin modelos ni builds completos: seis pruebas Node y 24 Python enfocadas correctas. Cuatro casos Node nuevos cubren render real/escape HTML, respaldo inglés, metadatos largos/sin marca, hash/contexto desactualizados, aliases/RTL, procedencia y bloqueo fuera de preview. Cuatro Python comprueban selección de los 300, memoria inmutable, ausencia de red, salida separada, faltantes y symlinks de entrada.
- No se ha desplegado ni comprobado esta integración en producción. Tampoco se certifican funcionalidad de herramientas, responsive 320–1920, dispositivos físicos, accesibilidad, rendimiento ni las siete capas/18 puntos. No se aprueba ninguna herramienta ni idioma y no se avanza a fase 0.
- P-001–P-008 siguen pendientes, cero FALLA. P-009 conserva el correo confirmado por Pedro; push del teléfono sin comprobar. Sin nuevos IDs físicos: este cambio afecta al build aislado y aún no ofrece una URL publicada para probar.

La campaña 40565692987 continúa fijada a e8a7cb9 con cuatro jobs; no se cancela ni se modifica su memoria. No esperar a que termine la cola ni volver a revisar traducciones una a una en el chat. El control automático conserva los criterios y 46 errores conocidos, pero no demuestra equivalencia universal con la lectura anterior del agente.

Solo se usan runners estándar de un repositorio público, sin APIs pagadas, caché/artifacts persistentes, Codespaces ni Cloudflare. [Reglas de facturación de GitHub](https://docs.github.com/en/billing/concepts/product-billing/github-actions). No se promete ejecución ininterrumpida ni disponibilidad permanente de GitHub.

## Relevo

Consultar primero la conclusión de 40599566567 y sus logs. Si falla, reproducir el error en una regresión y corregir antes de aceptar este lote. Si pasa, guardar contadores reales/consumo y continuar los pendientes del Paso A: capacidad de publicación, cobertura de UI de los 120 propietarios con solo metadatos, puertas funcionales/visuales y restantes comprobaciones del RUNBOOK §7. La conexión a preview no habilita importar estos paquetes a producción. Mantener PR #136 en borrador y 300 en noindex.
