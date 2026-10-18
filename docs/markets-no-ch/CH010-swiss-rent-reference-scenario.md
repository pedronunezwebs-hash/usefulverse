# CH010 · Escenario del tipo de referencia para alquiler suizo

Estado local: motor pequeño y formulario implementados; piloto de 37 rutas. Los borradores automáticos no superaron la revisión de calidad y las 36 rutas no inglesas usan fallback fuente en inglés. La localización no está aprobada y la herramienta no está publicada.

## Fuentes y actualización

- [Oficina Federal de Vivienda (BWO), tipo hipotecario de referencia](https://www.bwo.admin.ch/de/referenzzinssatz): fuente federal aplicable a los ajustes de alquiler en Suiza; publica el dato trimestralmente. La herramienta no copia ni congela el dato: el usuario introduce el tipo que figura en su contrato o última notificación y el tipo actual consultado en la fuente oficial.
- La página BWO vigente al 18 de octubre de 2026 indica que el tipo actual es 1,25 %, en vigor desde el 2 de septiembre de 2025, confirmado sin cambio el 2 de septiembre de 2026. Esta cifra se documenta aquí como evidencia de investigación; no es un valor predeterminado dentro del producto.
- BWO indica en su guía actual que un alza de 0,25 puntos puede justificar, en principio, un aumento del 3 %, y una bajada de 0,25 puntos puede justificar una reducción del 2,91 %. La herramienta aplica esos efectos en secuencia para cada paso de cuarto de punto, hasta el máximo soportado de 5 %.

## Alcance funcional

El cálculo es local en el navegador. La persona introduce el alquiler neto mensual, el tipo de referencia usado para fijarlo y el tipo actual tomado de BWO. Se presenta el efecto mensual y anual del factor de referencia y un alquiler hipotético tras ese factor.

La fórmula para el paso `n` es `1.03^n` cuando el tipo sube y `(1 / 1.03)^|n|` cuando baja, con `n = (tipo actual - tipo del contrato) / 0.25`. Por ejemplo, una bajada de 1,75 % a 1,50 % produce aproximadamente −2,91 %, coherente con el ejemplo BWO.

## Límites que ve la persona usuaria

No es un dictamen legal ni calcula el alquiler total admisible. Excluye inflación, variación de costes generales, mejoras, reservas contractuales, alquileres indexados o escalonados, fechas de notificación y plazos cantonales. El resultado es un escenario de un solo factor; las otras circunstancias pueden compensar o alterar el efecto. La fuente oficial se enlaza directamente para que el dato no quede obsoleto.

No recopila ni transmite información, no redacta ni envía reclamaciones y no consulta servicios externos. El piloto confirma 37 rutas estáticas, no 37 traducciones. Hace falta una traducción revisada en contexto para cada idioma antes de publicar.
