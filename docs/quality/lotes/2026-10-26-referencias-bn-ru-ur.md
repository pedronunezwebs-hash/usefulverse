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
- [x] CI completa, seguridad y comprobación GET/XML de producción.
- [ ] Seis documentos sincronizados, push verificado, retirada efectiva y LIBRE.

P-001–P-008:8 pendientes,0 FALLA;0 nuevas. UI, hardware, responsive y las18 puertas
y7 capas de herramientas no certificados por esta revisión.0 herramientas activadas,
0/300 en main,0 despliegues/envíos a buscadores/API pagadas/Cloudflare/Codespaces/
Containers/modelos locales. CI/builds completos solo Actions público estándar.

Siguiente: Crear v28 independiente empezando por bn: usar batch1-v28-candidate-plan.json y las9 review-batch1-*.json;37/40 idas bn preseleccionadas por revisión lingüística, corregir resetView,zoomOut yshikaku.check. Las37 no están importadas ni probadas por contrato: ligar cada memoria a fuente/hash/contexto exactos y su revisión; mantener procedencia, nunca contar la evidencia original como inferencia nueva. Probar cantidades y tokens por idioma, incluidos four,one,six,25MB,30seconds y negaciones; las pruebas chinas no validan bn/ru/ur. Primero test rojo del fallo antes de cada arreglo. Conservar477 memorias, políticas/perfiles/gramáticas/checkpoints/revisiones anteriores y prefijo1151 de1334 fixtures. Repetir40 referencias bn y todos los avisos con el perfil nuevo; solo si pasan, ampliado con mismas88 claves fijas y lectura de todas174 idas/vueltas y legacy disponible, también fuera88. Después ru (37 reutilizables/3 correcciones) y ur (32/8), con gates independientes. No repetir baseline ni v27 40196684338/40198168513. Los22 destinos restantes siguen en acceleration-review-batches.json (desde tr/vi/it), los6 históricos necesitan reparación; ha/am/te/gu/ta/mr/sw requieren80 muestras modelo. Compartir preparación y CI por lote, sin omitir suite ni revisión. Paso A sigue abierto por capacidad Pages,37 traducciones revisadas y nb real; no avanzar a fase0.

CI inicial40245562940: error de formato en fixtures nuevas (faltaba observed_candidate), corregido con procedencia exacta por ID. El test histórico y el test de hallazgos pasan sin rebajar comprobaciones; notas/avisos/textos/runtime intactos. Suite completa repetida y correcta en40246599367; el error de formato queda documentado y su prueba histórica se conserva.


Borradores de arranque v28bn (propuestas nuevas, sin nota, sin importar ni pasar puerta; requieren revisión directa, vínculo fuente/hash/contexto, contrato y vuelta nueva):

| Clave | Propuesta | Intención que debe conservar |
|---|---|---|
| `dxf-viewer.fields.resetView` | অঙ্কনটি পর্দায় ফিট করুন | Ajustar todo el dibujo al área visible, sin convertir la acción en dibujar. |
| `dxf-viewer.fields.zoomOut` | ছোট করে দেখুন | Alejar/reducir la vista; nunca ampliar. |
| `shikaku.fields.check` | ধাঁধা যাচাই করুন | Acción de comprobar el puzle, no un sustantivo sobre examen. |

Estas propuestas no alteran las106 candidatas previas ni eliminan las14 correcciones pendientes. No son nuevas evaluaciones ni memoria aprobada.


CI final[40246599367](https://github.com/pedronunezwebs-hash/usefulverse/actions/runs/40246599367), fuente`7ec358639d326a2dafdd29e556dd4724a6a34f66`, correcta:3045 Node y308 Python (306 correctas,2 omisiones por dependencias), Python593.43s. Build principal9972 páginas+36 homes/10260 URLs; gate20 locales existentes; hub217 archivos/100 páginas/106JS. Preview11293 archivos/10800 páginas y todas las homes noindex,0 URLs indexables;36 locales, no acredita37. Modelo y ambas publicaciones omitidos;0 artefactos.21 tests enfocados correctos y gitleaks sin secretos nuevos. Producción antes/después:5 GET y2 XML con mismos estados/bytes/SHA256,25625 URLs;3 soft404 siguen200. Sin UI/nativo/hardware/responsive/índice Google certificados.0 nuevas pruebas Pedro;P-001–P-008 pendientes.

Recibos: docs/quality/translation-pilot/ci-batch1-verification.json y remote-batch1-verification.json (en la rama del PR). Retirada efectiva pendiente de ejecutar; no declararla ni liberar candado antes.
