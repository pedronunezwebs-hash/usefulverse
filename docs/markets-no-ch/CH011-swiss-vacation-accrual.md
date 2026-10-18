# CH011 · Prorrateo orientativo de vacaciones suizas

## Función y entradas

La persona introduce el derecho anual en semanas indicado por su contrato, sus días habituales de trabajo por semana, las fechas de inicio y fin de empleo dentro de un año natural y los días de vacaciones ya tomados. El resultado prorratea los días anuales por días naturales de empleo y resta los días usados. El cálculo se ejecuta en el navegador y no guarda ni transmite los datos.

No se deduce la edad ni el derecho contractual a partir del idioma o la ubicación. La interfaz recuerda que la guía federal establece al menos cuatro semanas por año de servicio, y cinco semanas para quienes aún no han cumplido 20 años; se pueden introducir derechos contractuales superiores.

## Supuesto y límites

La estimación supone un derecho anual constante durante el periodo introducido y una distribución uniforme por días naturales. No decide el saldo legal: no aplica reducciones por determinadas ausencias prolongadas, reglas de devengo o redondeo contractuales, convenios colectivos, días festivos, pago de vacaciones, arrastre ni acuerdos de terminación. Si el saldo es controvertido, comprobar contrato y registros de la empresa y pedir asesoramiento.

## Fuentes oficiales

- [SECO · Regulación del tiempo de trabajo y vacaciones mínimas](https://www.seco.admin.ch/en/posting-regulation-of-working-hours) — mínimos de cuatro semanas y cinco hasta cumplir 20 años; menciona dos semanas consecutivas y posibles derechos adicionales.
- [Portal oficial ch.ch · Vacaciones](https://www.ch.ch/de/arbeit/arbeitszeit/ferien--feiertage-und-arbeitsabwesenheiten/) — derecho mínimo y diferencias posibles según el empleador o convenio colectivo.
- [SECO · FAQ sobre vacaciones](https://www.seco.admin.ch/fr/faq-vacances) — reglas y supuestos de reducción por ausencias; no se calculan aquí.

## Estado de entrega

Implementación local, sin despliegue. El piloto aislado incluye las 37 rutas; las 36 rutas no inglesas usan copy fuente inglés como fallback seguro, no una traducción aprobada. La revisión nativa y la prueba visual en navegador quedan pendientes antes de publicar.
