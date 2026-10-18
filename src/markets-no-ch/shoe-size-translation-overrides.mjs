import { shoeSizeEnglish as en } from './shoe-size-copy-en.mjs';

export const shoeSizeTranslationOverrides = Object.freeze({
  es: Object.freeze({
    [en.intro]: 'Mide ambos pies mientras estás de pie y compara el más largo con una tabla actual que elijas. Puedes usar la tabla del fabricante, la tienda o el modelo que te interese.',
    [en.privacy]: 'Las medidas y la tabla que pegues permanecen en este navegador. No se cargan ni se guardan.',
    [en.example]: 'Si el pie izquierdo mide 252 mm y el derecho 258 mm, el más largo mide 258 mm. Pega una tabla con las tallas y la longitud correspondiente del pie o del interior del calzado para compararlas en este dispositivo.',
    [en.details]: 'La herramienta convierte mm, cm o pulgadas a milímetros, toma la medida más larga de los dos pies y busca la longitud más próxima en la tabla que pegues. Solo suma margen para la puntera si la columna indica la longitud interior del calzado. Mondopoint se muestra como la longitud medida del pie en milímetros; no se convierte a otro sistema.',
    [en.howItWorks]: 'Compara con una tabla que elijas',
    [en.limits]: 'No se presupone un país, una marca ni una categoría de edad. Tú aportas la tabla y la comparación se hace en este dispositivo. El resultado solo compara longitudes y no garantiza el ajuste. Se enlazan las referencias oficiales, pero no se incluyen sus tablas de conversión.',
    [en.fields.chartHeading]: 'Pega una tabla actual de calzado',
    [en.fields.chartLabel]: 'Nombre de la tabla, marca o modelo',
    [en.fields.chartDate]: 'Fecha de la tabla (opcional)',
    [en.fields.chartUnit]: 'Unidad de la tabla',
    [en.fields.chartBasis]: 'Qué indica la longitud de la tabla',
    [en.fields.ready]: 'Introduce la medida de ambos pies y pega una tabla actual de calzado.',
    [en.fields.allowanceHelp]: 'Solo se usa si los valores pegados indican la longitud interior del calzado. Elige el margen que recomienda el fabricante o el que prefieras.',
    [en.fields.closest]: 'Fila más cercana de la tabla',
    [en.fields.chartRange]: 'Intervalo de longitudes de la tabla',
    [en.fields.within]: 'Solo se comparan longitudes; confirma el ajuste con las indicaciones actuales del fabricante del calzado.',
    [en.faq[2].q]: '¿La fila más cercana de la tabla garantiza que el calzado ajuste?',
    [en.fields.scope]: 'Comparación global de longitudes · utiliza una tabla vigente para la marca, el modelo y el grupo de edad exactos.',
    [en.fields.chartHelp]: 'Pega entre 2 y 100 filas de datos, opcionalmente con una fila de encabezado, una por línea: etiqueta de talla y longitud en la unidad seleccionada. Separa las columnas con coma, punto y coma o tabulador. Ejemplo: 40; 258. Las longitudes no deben disminuir. Usa el grupo de edad y las instrucciones de ajuste de la tabla original.',
    [en.fields.outside]: 'Esta longitud queda fuera del intervalo de la tabla pegada. No uses la fila más cercana como recomendación.',
  }),
  pt: Object.freeze({
    [en.fields.chartHelp]: 'Cole de 2 a 100 linhas de dados, com cabeçalho opcional, uma por linha: nome do tamanho e comprimento na unidade selecionada. Separe com vírgula, ponto e vírgula ou tabulação. Exemplo: 40; 258. Os comprimentos não devem diminuir. Use a faixa etária e as instruções de ajuste da tabela original.',
  }),
  nb: Object.freeze({
    [en.intro]: 'Mål begge føttene mens du står, og sammenlign det lengste målet med en oppdatert størrelsestabell du velger. Bruk en tabell for det aktuelle merket, modellen eller butikken.',
    [en.fields.scope]: 'Global sammenligning av lengde · bruk en oppdatert tabell for riktig merke, modell og aldersgruppe.',
    [en.fields.chartHelp]: 'Lim inn 2–100 datarader, eventuelt med en overskriftsrad, én per linje: størrelsesnavn og lengde i valgt måleenhet. Bruk komma, semikolon eller tabulator som skilletegn. Eksempel: 40; 258. Lengdene må ikke bli mindre. Bruk tabellens aldersgruppe og tilpasningsråd.',
    [en.fields.outside]: 'Lengden ligger utenfor området i tabellen du limte inn. Ikke bruk nærmeste rad som anbefaling.',
  }),
  de: Object.freeze({
    [en.fields.outside]: 'Diese Länge liegt außerhalb des eingefügten Tabellenbereichs. Verwenden Sie den nächsten Eintrag nicht als Empfehlung.',
  }),
});
