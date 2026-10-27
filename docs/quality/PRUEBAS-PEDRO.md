# UsefulVerse · Pruebas para Pedro (lo que solo una persona con un dispositivo real puede comprobar)

Cómo funciona (`docs/quality/PRUEBAS.md` §4): el agente añade aquí cada prueba que no puede hacer, con los pasos exactos. Tú las
haces cuando puedas, por tandas, y cambias el **Estado** a `OK` o a `FALLA` con una nota o una captura. El siguiente agente arregla
los `FALLA`. Una herramienta con una prueba pendiente aquí **no se da por terminada**.

**Resumen:** 8 pendientes · 0 fallos abiertos · última actualización 2026-10-28 (Codex)

> Estas primeras pruebas salen de la auditoría del 20-oct y comprueban **el estado actual**. Cuando se arreglen las
> herramientas, el agente las volverá a poner en `pendiente` para confirmar el arreglo. Si prefieres esperar a que estén
> arregladas, déjalas para entonces.

| ID | Herramienta | Por qué no lo puede probar un agente | Dispositivo | Pasos | Qué debería pasar | Estado | Nota de Pedro |
|---|---|---|---|---|---|---|---|
| P-001 | [2048](https://usefulverse.com/tools/2048-game/) | Gesto táctil real | Móvil (iPhone y Android) | 1. Abre la página. 2. Desliza el dedo en las 4 direcciones sobre el tablero | Las fichas se mueven con cada deslizamiento (hoy la auditoría indica que NO funciona) | pendiente | |
| P-002 | [Grabadora de pantalla](https://usefulverse.com/tools/screen-recorder/) | Permiso real para grabar la pantalla y el audio | Ordenador con Chrome | 1. Abre un vídeo de YouTube en otra pestaña. 2. Graba esa pestaña 10 s. 3. Descarga y reproduce el archivo | Se oye el audio del vídeo (hoy la auditoría indica que se graba sin audio) | pendiente | |
| P-003 | [Grabadora de voz](https://usefulverse.com/tools/voice-recorder/) | Micrófono real | iPhone (Safari) y ordenador | 1. Graba 10 s hablando. 2. Descarga. 3. Abre el archivo | Se oye bien; anota el formato del archivo (MP3, WebM…) | pendiente | |
| P-004 | [Imágenes a PDF](https://usefulverse.com/tools/image-to-pdf/) | Foto HEIC real y cámara | iPhone | 1. Elige 3 fotos de tu galería (son HEIC). 2. Prueba también «hacer foto». 3. Crea el PDF y ábrelo | PDF con las 3 fotos bien orientadas y nítidas | pendiente | |
| P-005 | [Test de altavoces](https://usefulverse.com/tools/speaker-tester/) | Altavoces y auriculares reales | Ordenador con auriculares | 1. Pulsa izquierda y después derecha | Cada sonido sale por el lado correcto | pendiente | |
| P-006 | [Medidor de micrófono](https://tools.usefulverse.com/tools/microphone-level-meter/) | Micrófono real | Móvil y ordenador | 1. Da permiso. 2. Habla y después quédate en silencio | La barra sube al hablar y baja en silencio | pendiente | |
| P-007 | [Sudoku](https://usefulverse.com/tools/sudoku/) | Sensación de juego en pantalla táctil | Móvil | 1. Juega 2 partidas en nivel difícil. 2. Escribe números y bórralos | Fácil de tocar las casillas; ¿se nota difícil de verdad? (la auditoría dice que todas las cuadrículas tienen la misma estructura) | pendiente | |
| P-008 | [Compresor de vídeo](https://usefulverse.com/tools/video-compressor/) | Vídeo real de móvil y rendimiento del aparato | iPhone y ordenador | 1. Comprime un vídeo de 1 min grabado con el móvil. 2. Reprodúcelo | Termina sin colgarse; anota el tiempo, el tamaño antes y después y la calidad | pendiente | |

| P-009 | [Avisos del traductor](https://github.com/pedronunezwebs-hash/usefulverse/issues/137) | Entrega real de correo/push y ajustes de Pedro | Móvil o navegador (2–3 min) | 1. Abre las notificaciones de tu cuenta GitHub. 2. Busca la mención de prueba #137. 3. En Settings → Notifications comprueba el canal elegido para menciones/asignaciones. 4. Anota si llegó correo o aviso al teléfono | La mención aparece en GitHub; correo/push solo si están habilitados. El agente verificó la notificación web por API | OK | Pedro confirmó el 28-oct por chat y captura que recibe los correos de GitHub (prueba, pendientes y cancelación). Correo probado; push del teléfono no comprobado. |

Nota: comprueba que cada enlace lleve a la herramienta correcta. Los slugs salen del rastreo del 20-oct; si alguno ha
cambiado, el agente lo corrige.
