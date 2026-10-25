# Referencias bn/ru/ur · 26-oct-2026 · EN CURSO

Lote bn/ru/ur:402 registros S/F/B existentes leídos directamente,321 juicios de ida y9 revisiones negativas independientes. MADLAD:bn341/360,ru346/360,ur311/360; referencias rechazadas, ampliado no ejecutado.106/120 frases lingüísticamente reutilizables pendientes de prueba v28;14 requieren corrección (3bn,3ru,8ur).183 fixtures nuevas,1334 totales;15443 registros sin nuevas inferencias y7271 evaluaciones con repeticiones/131 grupos.0 idiomas aprobados.

Se han leído las402 fuentes/idas/vueltas existentes de M2M100 y MADLAD:40 modelo
y27 legacy por idioma y motor. Legacy repite la misma ida entre motores; se evalúa
una vez con ambos IDs originales y dos vueltas independientes. No es evaluación
nativa/ciega, inferencia nueva ni aprobación de idioma o motor.

| Idioma | M2M100 /360 | MADLAD /360 | M2M100 mismas27 /243 | MADLAD mismas27 /243 | Legacy /243 |
|---|---:|---:|---:|---:|---:|
| bn |250|341|160|232|236|
| ru |292|346|193|233|234|
| ur |300|311|202|208|228|

Ninguna referencia pasa: hay botones incorrectos y datos sin prueba de perfil.
El ampliado no se ejecuta. Se preseleccionan106 idas con3/3/3 leídas directamente,
sin importarlas:37bn,37ru,32ur. Quedan14 claves para corrección nueva:

- bn: `dxf-viewer.fields.resetView`, `dxf-viewer.fields.zoomOut`, `shikaku.fields.check`.
- ru: `dxf-viewer.fields.resetView`, `voice-changer.fields.clear`, `voice-changer.fields.preview`.
- ur: `dxf-viewer.faq.2.a`, `dxf-viewer.fields.exportSvg`, `dxf-viewer.fields.measurement`,
  `dxf-viewer.fields.zoomOut`, `shikaku.fields.faq.1.a`, `voice-changer.fields.faq1a`,
  `voice-changer.fields.faq2a`, `voice-changer.fields.preview`.

`batch1-v28-candidate-plan.json` liga cada candidata a fuente/hash/contexto, texto,
registro completo y revisión originales. Su selección no acredita contrato tipado
ni vuelta nueva. Las cantidades escritas four/one/six, МБ y delimitación format.WAV
siguen sin prueba localizada. No se rebaja una nota lingüística correcta para
ocultar un límite del parser; `unproved-data` bloquea por separado.

Prueba roja antes de fixtures:202 observaciones fallan (137 ida,65 vuelta);
183 casos exactos deduplicados (122 ida,61 vuelta), enlazados a los IDs originales.
`test_translation_batch1_findings.py` conserva todos. El guard de aceleración dio
rojo al descubrirse estos avisos: se fija su experimento histórico al prefijo1151,
sin cambiar mediciones. Otro test comprueba las15443 filas con fixtures completas:
solo cambian los202 avisos semánticos de las observaciones exactas. Políticas,
runtime, mediciones, crudos y revisiones históricas intactos.

`pilot-baseline-review.py` admite únicamente revisiones negativas: vuelve a comprobar
checkpoints/contexto/hash/ID, cobertura y cada aviso. Rechaza aprobaciones, puerta
verde, notas perfectas de defectos, avisos omitidos o datos sin prueba descartados.
La vuelta Upload de un Download ruso correcto es fallo separado; «saved» urdu y
«corner» ruso no se falsean por una vuelta inexacta. Nueve archivos review-batch1,
language-status-batch1, métricas y resumen automático conservan las limitaciones.

Checklist FABLE7+9:
- [x] Lecturas actuales, clon propio, rama/remoto,>10GiB y candado propio.
- [x] Lectura íntegra S/F/B y legacy con procedencia para las tres lenguas.
- [x] Tests rojos antes de fixtures; decisiones explícitas por aviso.
- [x] Comparación con muestras equivalentes y preselección sin aprobación automática.
- [ ] CI completa, seguridad y comprobación GET/XML de producción.
- [ ] Seis documentos sincronizados, push verificado, retirada efectiva y LIBRE.

P-001–P-008:8 pendientes,0 FALLA;0 nuevas. UI, hardware, responsive y las18 puertas
y7 capas de herramientas no certificados por esta revisión.0 herramientas activadas,
0/300 en main,0 despliegues/envíos a buscadores/API pagadas/Cloudflare/Codespaces/
Containers/modelos locales. CI/builds completos solo Actions público estándar.

Siguiente: Crear v28 independiente empezando por bn: usar batch1-v28-candidate-plan.json y las9 review-batch1-*.json;37/40 idas bn preseleccionadas por revisión lingüística, corregir resetView,zoomOut yshikaku.check. Las37 no están importadas ni probadas por contrato: ligar cada memoria a fuente/hash/contexto exactos y su revisión; mantener procedencia, nunca contar la evidencia original como inferencia nueva. Probar cantidades y tokens por idioma, incluidos four,one,six,25MB,30seconds y negaciones; las pruebas chinas no validan bn/ru/ur. Primero test rojo del fallo antes de cada arreglo. Conservar477 memorias, políticas/perfiles/gramáticas/checkpoints/revisiones anteriores y prefijo1151 de1334 fixtures. Repetir40 referencias bn y todos los avisos con el perfil nuevo; solo si pasan, ampliado con mismas88 claves fijas y lectura de todas174 idas/vueltas y legacy disponible, también fuera88. Después ru (37 reutilizables/3 correcciones) y ur (32/8), con gates independientes. No repetir baseline ni v27 40196684338/40198168513. Los22 destinos restantes siguen en acceleration-review-batches.json (desde tr/vi/it), los6 históricos necesitan reparación; ha/am/te/gu/ta/mr/sw requieren80 muestras modelo. Compartir preparación y CI por lote, sin omitir suite ni revisión. Paso A sigue abierto por capacidad Pages,37 traducciones revisadas y nb real; no avanzar a fase0.

CI inicial40245562940: error de formato en fixtures nuevas (faltaba observed_candidate), corregido con procedencia exacta por ID. El test histórico y el test de hallazgos pasan sin rebajar comprobaciones; notas/avisos/textos/runtime intactos. Suite completa pendiente de repetir; no liberar candado.
