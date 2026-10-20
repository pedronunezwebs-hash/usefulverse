# Paso A · contexto y literales · Codex · 20-oct-2026

Alcance: PR #136, rama `feat/new-tools-batch-1`, scripts del piloto y evidencia. Ningún cambio en la web publicada.
Hecho para este lote: repetición real de las 40 referencias es/nb en Actions, revisión y checkpoints remotos;
regresiones permanentes, CI y relevo recuperable. No equivale a aprobar idiomas ni a completar el Paso A.

Checklist (FABLE bug + multi-sesión y RUNBOOK):

- [x] Leer relevo/reglas, comprobar disco y P-001–P-008: 8 pendientes, 0 FALLA. Candado main `29eff0d`.
- [x] Reproducir pérdidas de `{duration}` y sentidos ambiguos mediante fixtures reales del piloto anterior.
- [x] Tests añadidos antes del cambio: tres errores por funciones todavía ausentes; tras implementación pasan.
- [x] Variante separada `context-v2`: diez sentidos explícitos en inglés controlado, sin cambiar la fuente canónica.
- [x] Proteger literales fuera del modelo; ensamblar posiciones conocidas, sin adivinar marcadores perdidos.
- [x] Conservar baseline; hash de la política en identidades; trazas de fragmentos y controles ida/vuelta.
- [ ] Repetir piloto corto real, revisar sentido/negaciones/números y conservar resultados en GitHub.
- [ ] Revisión adversarial del diff, tests vecinos, CI y verificación pública de lectura.
- [ ] Actualizar ESTADO, progress, LOG; push y SHA remoto; liberar candado y eliminar temporales propios.

La segmentación puede empeorar gramática u orden: es un experimento que requiere revisión, no una reparación automática
que permita aprobar el idioma. No hay sustituciones en destino ni revisión nativa inventada.
