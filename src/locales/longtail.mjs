// Human-written, task-specific copy for the first SEO priority tools.
// Keep every example within the exact behavior and limits of src/app.js.
const tools = {
  'roman-numeral-converter': {
    en: {
      body: 'For example, 2026 is MMXXVI and 49 is XLIX. The converter accepts standard whole-number notation from 1 to 3,999; forms such as IIII for 4 are rejected.',
      faq: [
        { question: 'What is 2026 in Roman numerals?', answer: '2026 is MMXXVI: MM is 2,000, XX is 20 and VI is 6. Enter 2026 to convert it, or enter MMXXVI to convert it back.' },
        { question: 'Can I convert any number or Roman numeral?', answer: 'The tool accepts whole numbers from 1 to 3,999 and standard Roman numerals made from I, V, X, L, C, D and M. Non-standard forms such as IIII are not accepted.' },
      ],
    },
    es: {
      body: 'Por ejemplo, 2026 se escribe MMXXVI y 49 se escribe XLIX. El conversor admite la notación romana estándar para enteros del 1 al 3.999; no acepta formas no estándar como IIII para el 4.',
      faq: [
        { question: '¿Cómo se escribe 2026 en números romanos?', answer: '2026 se escribe MMXXVI: MM equivale a 2.000, XX a 20 y VI a 6. Introduce 2026 para convertirlo o MMXXVI para obtener el número.' },
        { question: '¿Qué números romanos y valores admite el conversor?', answer: 'Admite enteros del 1 al 3.999 y números romanos estándar formados con I, V, X, L, C, D y M. Rechaza formas no estándar como IIII para representar el 4.' },
      ],
    },
    fr: {
      body: 'Par exemple, 2026 s’écrit MMXXVI et 49 s’écrit XLIX. Le convertisseur accepte la notation romaine standard pour les entiers de 1 à 3 999 ; il refuse les formes non standard comme IIII pour 4.',
      faq: [
        { question: 'Comment écrire 2026 en chiffres romains ?', answer: '2026 s’écrit MMXXVI : MM vaut 2 000, XX vaut 20 et VI vaut 6. Saisissez 2026 pour le convertir, ou MMXXVI pour retrouver le nombre.' },
        { question: 'Quelles valeurs et écritures romaines sont acceptées ?', answer: 'L’outil accepte les entiers de 1 à 3 999 et les chiffres romains standard composés de I, V, X, L, C, D et M. Une écriture non standard comme IIII pour 4 est refusée.' },
      ],
    },
    pt: {
      body: 'Por exemplo, 2026 em algarismos romanos é MMXXVI e 49 é XLIX. O conversor aceita a notação romana padrão para números inteiros de 1 a 3.999 e rejeita formas não padrão, como IIII para 4.',
      faq: [
        { question: 'Como escrever 2026 em algarismos romanos?', answer: '2026 é MMXXVI: MM vale 2.000, XX vale 20 e VI vale 6. Digite 2026 para converter ou MMXXVI para voltar ao número.' },
        { question: 'Quais números e algarismos romanos são aceitos?', answer: 'A ferramenta aceita números inteiros de 1 a 3.999 e algarismos romanos padrão formados por I, V, X, L, C, D e M. Formas não padrão, como IIII para 4, são rejeitadas.' },
      ],
    },
    de: {
      body: 'Zum Beispiel wird 2026 als MMXXVI und 49 als XLIX geschrieben. Der Rechner akzeptiert die übliche römische Schreibweise für ganze Zahlen von 1 bis 3.999; nicht standardisierte Formen wie IIII für 4 werden abgelehnt.',
      faq: [
        { question: 'Wie schreibt man 2026 in römischen Zahlen?', answer: '2026 wird MMXXVI geschrieben: MM steht für 2.000, XX für 20 und VI für 6. Geben Sie 2026 zum Umwandeln oder MMXXVI für die Rückumwandlung ein.' },
        { question: 'Welche Zahlen und römischen Schreibweisen werden unterstützt?', answer: 'Unterstützt werden ganze Zahlen von 1 bis 3.999 und standardmäßige römische Zahlen aus I, V, X, L, C, D und M. Nicht standardisierte Formen wie IIII für 4 werden abgelehnt.' },
      ],
    },
  },
  'binary-converter': {
    en: {
      body: 'For a quick check, decimal 25 is binary 11001, octal 31 and hexadecimal 19. Convert signed whole numbers between any bases 2–36, including hexadecimal to binary; fractions and prefixes such as 0b or 0x are not accepted.',
      faq: [
        { question: 'What is 25 in binary?', answer: 'Decimal 25 is 11001 in binary. Select Decimal as the input base and Binary as the output base, then enter 25.' },
        { question: 'Which number bases and values can I convert?', answer: 'Convert signed whole numbers between any base from 2 to 36. Digits 0–9 and letters A–Z represent values; fractions and prefixes such as 0b or 0x are not accepted.' },
      ],
    },
    es: {
      body: 'Como ejemplo, 25 en decimal equivale a 11001 en binario, 31 en octal y 19 en hexadecimal. Convierte enteros positivos o negativos entre cualquier base del 2 al 36, incluida la conversión de hexadecimal a binario; no admite fracciones ni prefijos como 0b o 0x.',
      faq: [
        { question: '¿Cuánto es 25 en binario?', answer: 'El número decimal 25 equivale a 11001 en binario. Elige Decimal como base de origen y Binario como base de destino, e introduce 25.' },
        { question: '¿Qué bases y números acepta el conversor?', answer: 'Convierte enteros positivos y negativos entre cualquier base del 2 al 36. Usa los dígitos del 0 al 9 y las letras de la A a la Z; no admite fracciones ni prefijos como 0b o 0x.' },
      ],
    },
    fr: {
      body: 'Par exemple, 25 en décimal vaut 11001 en binaire, 31 en octal et 19 en hexadécimal. Convertissez des entiers positifs ou négatifs entre toutes les bases de 2 à 36, y compris de l’hexadécimal au binaire ; les fractions et préfixes comme 0b ou 0x ne sont pas acceptés.',
      faq: [
        { question: 'Combien vaut 25 en binaire ?', answer: 'Le nombre décimal 25 s’écrit 11001 en binaire. Choisissez Décimal comme base d’entrée et Binaire comme base de sortie, puis saisissez 25.' },
        { question: 'Quelles bases et quelles valeurs le convertisseur accepte-t-il ?', answer: 'Il convertit les entiers signés entre toutes les bases de 2 à 36. Les chiffres de 0 à 9 et les lettres de A à Z représentent les valeurs ; les fractions et préfixes comme 0b ou 0x ne sont pas acceptés.' },
      ],
    },
    pt: {
      body: 'Por exemplo, 25 em decimal equivale a 11001 em binário, 31 em octal e 19 em hexadecimal. Converta números inteiros positivos ou negativos entre qualquer base de 2 a 36, inclusive de hexadecimal para binário; frações e prefixos como 0b ou 0x não são aceitos.',
      faq: [
        { question: 'Quanto é 25 em binário?', answer: 'O número decimal 25 equivale a 11001 em binário. Selecione Decimal como base de entrada e Binário como base de saída e digite 25.' },
        { question: 'Quais bases e números o conversor aceita?', answer: 'Converta números inteiros positivos ou negativos entre qualquer base de 2 a 36. Os dígitos de 0 a 9 e as letras de A a Z representam os valores; frações e prefixos como 0b ou 0x não são aceitos.' },
      ],
    },
    de: {
      body: 'Zum Beispiel entspricht 25 im Dezimalsystem der Binärzahl 11001, der Oktalzahl 31 und der Hexadezimalzahl 19. Ganze positive und negative Zahlen lassen sich zwischen allen Basen von 2 bis 36 umwandeln, auch von Hexadezimal zu Binär; Brüche und Präfixe wie 0b oder 0x sind nicht zulässig.',
      faq: [
        { question: 'Was ist 25 im Binärsystem?', answer: 'Die Dezimalzahl 25 entspricht der Binärzahl 11001. Wählen Sie Dezimal als Ausgangsbasis und Binär als Zielbasis und geben Sie 25 ein.' },
        { question: 'Welche Zahlensysteme und Werte unterstützt der Rechner?', answer: 'Ganze Zahlen mit Vorzeichen lassen sich zwischen allen Basen von 2 bis 36 umwandeln. Ziffern von 0 bis 9 und Buchstaben von A bis Z stehen für die Werte; Brüche und Präfixe wie 0b oder 0x werden nicht unterstützt.' },
      ],
    },
  },
  'prime-number-checker': {
    en: {
      body: 'A prime number is a whole number greater than 1 with exactly two positive divisors. For example, 97 is prime, while 1 and 91 are not. Check non-negative integers up to 1,000,000,000,000 in your browser.',
      faq: [
        { question: 'Is 1 a prime number?', answer: 'No. A prime number is greater than 1 and has exactly two positive divisors: 1 and itself. The smallest prime is 2; 97 is another example.' },
        { question: 'What numbers can this prime checker test?', answer: 'It tests whole numbers from 0 through 1,000,000,000,000. Decimal values, negative values and prime factorization are not supported.' },
      ],
    },
    es: {
      body: 'Un número primo es un entero mayor que 1 con exactamente dos divisores positivos. Por ejemplo, 97 es primo, pero 1 y 91 no lo son. Comprueba enteros no negativos de hasta 1.000.000.000.000 directamente en tu navegador.',
      faq: [
        { question: '¿El 1 es un número primo?', answer: 'No. Un número primo es mayor que 1 y tiene exactamente dos divisores positivos: 1 y él mismo. El menor primo es 2; 97 es otro ejemplo.' },
        { question: '¿Hasta qué número llega el comprobador de primos?', answer: 'Comprueba números enteros del 0 al 1.000.000.000.000. No admite decimales, números negativos ni descomposición en factores primos.' },
      ],
    },
    fr: {
      body: 'Un nombre premier est un entier supérieur à 1 qui possède exactement deux diviseurs positifs. Par exemple, 97 est premier, contrairement à 1 et 91. Vérifiez dans le navigateur les entiers positifs jusqu’à 1 000 000 000 000.',
      faq: [
        { question: 'Le nombre 1 est-il premier ?', answer: 'Non. Un nombre premier est supérieur à 1 et possède exactement deux diviseurs positifs : 1 et lui-même. Le plus petit nombre premier est 2 ; 97 en est un autre exemple.' },
        { question: 'Jusqu’à quelle valeur le test de primalité fonctionne-t-il ?', answer: 'Il vérifie les entiers de 0 à 1 000 000 000 000. Les nombres décimaux, négatifs et la décomposition en facteurs premiers ne sont pas pris en charge.' },
      ],
    },
    pt: {
      body: 'Um número primo é um inteiro maior que 1 com exatamente dois divisores positivos. Por exemplo, 97 é primo, enquanto 1 e 91 não são. Verifique inteiros não negativos até 1.000.000.000.000 diretamente no navegador.',
      faq: [
        { question: 'O número 1 é primo?', answer: 'Não. Um número primo é maior que 1 e tem exatamente dois divisores positivos: 1 e ele mesmo. O menor número primo é 2; 97 é outro exemplo.' },
        { question: 'Até qual número este verificador testa se é primo?', answer: 'Ele verifica números inteiros de 0 a 1.000.000.000.000. Decimais, valores negativos e fatoração em números primos não são aceitos.' },
      ],
    },
    de: {
      body: 'Eine Primzahl ist eine ganze Zahl größer als 1 mit genau zwei positiven Teilern. Zum Beispiel ist 97 eine Primzahl, 1 und 91 sind es nicht. Prüfen Sie nicht negative ganze Zahlen bis 1.000.000.000.000 direkt im Browser.',
      faq: [
        { question: 'Ist 1 eine Primzahl?', answer: 'Nein. Eine Primzahl ist größer als 1 und hat genau zwei positive Teiler: 1 und sich selbst. Die kleinste Primzahl ist 2; 97 ist ein weiteres Beispiel.' },
        { question: 'Bis zu welcher Zahl funktioniert der Primzahltest?', answer: 'Geprüft werden ganze Zahlen von 0 bis 1.000.000.000.000. Dezimalzahlen, negative Werte und eine Primfaktorzerlegung werden nicht unterstützt.' },
      ],
    },
  },
  'average-calculator': {
    en: {
      body: 'Calculate a weighted average for grades with different credits: scores 90 and 80 with weights 3 and 1 give 87.5. Switch to simple average for an arithmetic mean; the tool also shows the sum, count, minimum and maximum. Paste values or grades from a spreadsheet.',
      faq: [
        { question: 'What is the average of 10, 12 and 14?', answer: 'Add the values (10 + 12 + 14 = 36), then divide by 3. The arithmetic mean is 12.' },
        { question: 'How do I calculate a weighted average for grades?', answer: 'Enter each grade and its matching credit or weight in the same order. For example, (90 × 3 + 80 × 1) ÷ (3 + 1) = 87.5.' },
        { question: 'Can I paste a column of grades or measurements?', answer: 'Yes. Paste values separated by commas, spaces or line breaks. Use the weighted mode for matching grade and credit lists; the tool does not calculate a median.' },
      ],
    },
    es: {
      body: 'Calcula la media ponderada de notas con créditos distintos: una nota de 90 con peso 3 y otra de 80 con peso 1 dan 87,5. Cambia a media simple para obtener la media aritmética; también verás suma, cantidad, mínimo y máximo. Puedes pegar datos de una hoja de cálculo.',
      faq: [
        { question: '¿Cuál es la media de 10, 12 y 14?', answer: 'Suma los valores (10 + 12 + 14 = 36) y divide el resultado entre 3. La media aritmética es 12.' },
        { question: '¿Cómo se calcula la media ponderada de las notas?', answer: 'Introduce cada nota y su crédito o peso correspondiente en el mismo orden. Por ejemplo, (90 × 3 + 80 × 1) ÷ (3 + 1) = 87,5.' },
        { question: '¿Puedo pegar una columna de notas o mediciones?', answer: 'Sí. Pega valores separados por comas, espacios o saltos de línea. Usa el modo ponderado para listas de notas y créditos; la herramienta no calcula la mediana.' },
      ],
    },
    fr: {
      body: 'Calculez la moyenne pondérée de notes avec des crédits différents : une note de 90 avec un poids de 3 et une note de 80 avec un poids de 1 donnent 87,5. Passez en mode simple pour la moyenne arithmétique ; le résultat affiche aussi la somme, le nombre de valeurs, le minimum et le maximum.',
      faq: [
        { question: 'Quelle est la moyenne de 10, 12 et 14 ?', answer: 'Additionnez les valeurs (10 + 12 + 14 = 36), puis divisez la somme par 3. La moyenne arithmétique est 12.' },
        { question: 'Comment calculer une moyenne pondérée de notes ?', answer: 'Saisissez chaque note et le crédit ou poids correspondant dans le même ordre. Par exemple, (90 × 3 + 80 × 1) ÷ (3 + 1) = 87,5.' },
        { question: 'Puis-je coller une liste de notes ou de mesures ?', answer: 'Oui. Collez les valeurs séparées par des virgules, des espaces ou des retours à la ligne. Utilisez le mode pondéré pour les listes de notes et de crédits ; l’outil ne calcule pas la médiane.' },
      ],
    },
    pt: {
      body: 'Calcule a média ponderada de notas com créditos diferentes: uma nota 90 com peso 3 e outra 80 com peso 1 resultam em 87,5. Mude para a média simples para obter a média aritmética; o resultado também mostra soma, quantidade, mínimo e máximo.',
      faq: [
        { question: 'Qual é a média de 10, 12 e 14?', answer: 'Some os valores (10 + 12 + 14 = 36) e divida o total por 3. A média aritmética é 12.' },
        { question: 'Como calcular a média ponderada das notas?', answer: 'Informe cada nota e o crédito ou peso correspondente na mesma ordem. Por exemplo, (90 × 3 + 80 × 1) ÷ (3 + 1) = 87,5.' },
        { question: 'Posso colar uma coluna de notas ou medições?', answer: 'Sim. Cole os valores separados por ponto e vírgula, espaços ou quebras de linha. Use o modo ponderado para listas correspondentes de notas e créditos; a ferramenta não calcula a mediana.' },
      ],
    },
    de: {
      body: 'Berechnen Sie einen gewichteten Notendurchschnitt mit unterschiedlichen Leistungspunkten: Die Noten 90 mit Gewicht 3 und 80 mit Gewicht 1 ergeben 87,5. Wechseln Sie zum einfachen Durchschnitt für den arithmetischen Mittelwert; zusätzlich sehen Sie Summe, Anzahl, Minimum und Maximum.',
      faq: [
        { question: 'Wie hoch ist der Durchschnitt von 10, 12 und 14?', answer: 'Addieren Sie die Werte (10 + 12 + 14 = 36) und teilen Sie die Summe durch 3. Der arithmetische Mittelwert beträgt 12.' },
        { question: 'Wie berechne ich einen gewichteten Notendurchschnitt?', answer: 'Geben Sie jede Note und die passende Anzahl an Leistungspunkten oder das Gewicht in derselben Reihenfolge ein. Beispiel: (90 × 3 + 80 × 1) ÷ (3 + 1) = 87,5.' },
        { question: 'Kann ich eine Spalte mit Noten oder Messwerten einfügen?', answer: 'Ja. Fügen Sie durch Semikolons, Leerzeichen oder Zeilenumbrüche getrennte Werte ein. Für Noten mit Leistungspunkten verwenden Sie den gewichteten Modus; einen Median berechnet das Tool nicht.' },
      ],
    },
  },
  'ratio-proportion-calculator': {
    en: {
      body: 'For A:B = C:X, the missing value is X = B × C ÷ A. For example, 2:3 = 8:X gives X = 12. With integer inputs, the tool also simplifies A:B; all three inputs must be greater than zero.',
      faq: [
        { question: 'How do I solve 2:3 = 8:X?', answer: 'Use X = B × C ÷ A: 3 × 8 ÷ 2 = 12. Enter 2, 3 and 8 in the A, B and C fields to get X = 12.' },
        { question: 'Can this calculator simplify a ratio such as 12:18?', answer: 'Yes. When A, B and C are whole numbers, it reduces A:B by their greatest common divisor, so 12:18 becomes 2:3. Enter positive values only.' },
      ],
    },
    es: {
      body: 'En A:B = C:X, el valor que falta es X = B × C ÷ A. Por ejemplo, 2:3 = 8:X da X = 12. Si introduces enteros, la herramienta también simplifica A:B; los tres valores deben ser mayores que cero.',
      faq: [
        { question: '¿Cómo se resuelve la proporción 2:3 = 8:X?', answer: 'Aplica X = B × C ÷ A: 3 × 8 ÷ 2 = 12. Introduce 2, 3 y 8 en los campos A, B y C para obtener X = 12.' },
        { question: '¿La calculadora puede simplificar una razón como 12:18?', answer: 'Sí. Si A, B y C son enteros, reduce A:B usando su máximo común divisor; por eso 12:18 se convierte en 2:3. Introduce únicamente valores positivos.' },
      ],
    },
    fr: {
      body: 'Dans A:B = C:X, la valeur manquante est X = B × C ÷ A. Par exemple, 2:3 = 8:X donne X = 12. Avec des valeurs entières, l’outil simplifie aussi A:B ; les trois valeurs saisies doivent être positives.',
      faq: [
        { question: 'Comment résoudre la proportion 2:3 = 8:X ?', answer: 'Appliquez X = B × C ÷ A : 3 × 8 ÷ 2 = 12. Saisissez 2, 3 et 8 dans les champs A, B et C pour obtenir X = 12.' },
        { question: 'La calculatrice peut-elle simplifier un rapport comme 12:18 ?', answer: 'Oui. Lorsque A, B et C sont des entiers, elle réduit A:B par leur plus grand commun diviseur : 12:18 devient donc 2:3. Saisissez uniquement des valeurs positives.' },
      ],
    },
    pt: {
      body: 'Em A:B = C:X, o valor que falta é X = B × C ÷ A. Por exemplo, 2:3 = 8:X resulta em X = 12. Com valores inteiros, a ferramenta também simplifica A:B; os três valores informados precisam ser positivos.',
      faq: [
        { question: 'Como resolver a proporção 2:3 = 8:X?', answer: 'Use X = B × C ÷ A: 3 × 8 ÷ 2 = 12. Informe 2, 3 e 8 nos campos A, B e C para obter X = 12.' },
        { question: 'A calculadora simplifica uma razão como 12:18?', answer: 'Sim. Quando A, B e C são inteiros, ela reduz A:B pelo máximo divisor comum; assim, 12:18 vira 2:3. Informe apenas valores positivos.' },
      ],
    },
    de: {
      body: 'Bei A:B = C:X lautet der fehlende Wert X = B × C ÷ A. Zum Beispiel ergibt 2:3 = 8:X den Wert X = 12. Bei ganzen Eingaben kürzt das Tool auch A:B; alle drei Werte müssen größer als null sein.',
      faq: [
        { question: 'Wie löse ich die Proportion 2:3 = 8:X?', answer: 'Verwenden Sie X = B × C ÷ A: 3 × 8 ÷ 2 = 12. Geben Sie 2, 3 und 8 in die Felder A, B und C ein; das Ergebnis ist X = 12.' },
        { question: 'Kann der Rechner ein Verhältnis wie 12:18 kürzen?', answer: 'Ja. Wenn A, B und C ganze Zahlen sind, kürzt das Tool A:B mit dem größten gemeinsamen Teiler. Aus 12:18 wird so 2:3. Geben Sie nur positive Werte ein.' },
      ],
    },
  },
  'time-duration-calculator': {
    en: {
      body: 'For example, 9:15 a.m. to 5:45 p.m. on the same date is 8 hours 30 minutes. Choose both dates as well as both times for an overnight or multi-day interval; breaks are not deducted automatically.',
      faq: [
        { question: 'How many hours are there from 9:15 a.m. to 5:45 p.m.?', answer: 'On the same date, the elapsed time is 8 hours 30 minutes, or 8.5 hours. Enter both start and end dates and times to calculate it.' },
        { question: 'Can I calculate an overnight shift or subtract a break?', answer: 'Yes, for an overnight shift choose the next calendar date as the end date. The calculator reports elapsed time, but it does not subtract meal breaks or unpaid time.' },
      ],
    },
    es: {
      body: 'Por ejemplo, de 9:15 a 17:45 del mismo día transcurren 8 horas y 30 minutos. Para un turno nocturno o un intervalo de varios días, selecciona también cada fecha; las pausas no se descuentan automáticamente.',
      faq: [
        { question: '¿Cuántas horas hay de 9:15 a 17:45?', answer: 'Si ambos horarios son del mismo día, transcurren 8 horas y 30 minutos, es decir, 8,5 horas. Introduce tanto la fecha como la hora de inicio y de fin.' },
        { question: '¿Puedo calcular un turno nocturno o descontar una pausa?', answer: 'Sí, para un turno nocturno selecciona el día siguiente como fecha final. La calculadora muestra el tiempo transcurrido, pero no descuenta descansos ni pausas para comer.' },
      ],
    },
    fr: {
      body: 'Par exemple, de 9 h 15 à 17 h 45 le même jour, il s’écoule 8 heures et 30 minutes. Pour un service de nuit ou un intervalle de plusieurs jours, choisissez aussi chaque date ; les pauses ne sont pas déduites automatiquement.',
      faq: [
        { question: 'Combien d’heures y a-t-il entre 9 h 15 et 17 h 45 ?', answer: 'Pour une même journée, la durée écoulée est de 8 heures et 30 minutes, soit 8,5 heures. Saisissez la date et l’heure de début ainsi que celles de fin.' },
        { question: 'Puis-je calculer un service de nuit ou déduire une pause ?', answer: 'Oui, choisissez le lendemain comme date de fin pour un service de nuit. La calculatrice mesure le temps écoulé, mais ne déduit pas les pauses ni le temps de repas.' },
      ],
    },
    pt: {
      body: 'Por exemplo, das 9h15 às 17h45 no mesmo dia são 8 horas e 30 minutos. Em um turno noturno ou período de vários dias, selecione também cada data; pausas não são descontadas automaticamente.',
      faq: [
        { question: 'Quantas horas há entre 9h15 e 17h45?', answer: 'No mesmo dia, o tempo decorrido é de 8 horas e 30 minutos, ou 8,5 horas. Informe tanto a data e o horário inicial quanto a data e o horário final.' },
        { question: 'Posso calcular um turno noturno ou descontar uma pausa?', answer: 'Sim. Para um turno noturno, escolha o dia seguinte como data final. A calculadora mostra o tempo decorrido, mas não desconta intervalos ou pausas para refeição.' },
      ],
    },
    de: {
      body: 'Zum Beispiel liegen zwischen 9:15 und 17:45 Uhr am selben Tag 8 Stunden und 30 Minuten. Wählen Sie für eine Nachtschicht oder einen Zeitraum über mehrere Tage auch beide Daten aus; Pausen werden nicht automatisch abgezogen.',
      faq: [
        { question: 'Wie viele Stunden liegen zwischen 9:15 und 17:45 Uhr?', answer: 'Am selben Tag beträgt die verstrichene Zeit 8 Stunden und 30 Minuten, also 8,5 Stunden. Geben Sie Start- und Enddatum sowie die jeweilige Uhrzeit ein.' },
        { question: 'Kann ich eine Nachtschicht berechnen oder eine Pause abziehen?', answer: 'Ja. Wählen Sie für eine Nachtschicht den nächsten Kalendertag als Enddatum. Der Rechner zeigt die verstrichene Zeit, zieht Pausen oder Essenszeiten aber nicht automatisch ab.' },
      ],
    },
  },
  'date-calculator': {
    en: {
      body: 'From January 1 to January 31 is 30 elapsed days because the starting date is not counted as a full day. You can also add or subtract a whole number of calendar days; weekends and public holidays are not excluded.',
      faq: [
        { question: 'How many days are between January 1 and January 31?', answer: 'There are 30 elapsed calendar days. The calculator does not count the starting date as a full day; counting both dates inclusively would give 31 calendar dates.' },
        { question: 'Can I add 30 days to a date or count business days?', answer: 'Enter a starting date and 30 to find the date 30 calendar days later; use -30 to go back. Weekends and public holidays are included, so this is not a business-day calculator.' },
      ],
    },
    es: {
      body: 'Del 1 al 31 de enero hay 30 días transcurridos, porque no se cuenta el día inicial como un día completo. También puedes sumar o restar un número entero de días naturales; no se excluyen fines de semana ni festivos.',
      faq: [
        { question: '¿Cuántos días hay entre el 1 y el 31 de enero?', answer: 'Hay 30 días naturales transcurridos. La calculadora no cuenta el día de inicio como un día completo; contando ambas fechas de forma inclusiva, serían 31 días del calendario.' },
        { question: '¿Puedo sumar 30 días a una fecha o contar días laborables?', answer: 'Introduce una fecha inicial y 30 para hallar la fecha de 30 días naturales después; usa -30 para retroceder. Se cuentan sábados, domingos y festivos, así que no calcula días laborables.' },
      ],
    },
    fr: {
      body: 'Du 1er au 31 janvier, il s’écoule 30 jours, car le jour de départ n’est pas compté comme une journée entière. Vous pouvez aussi ajouter ou soustraire un nombre entier de jours calendaires ; les week-ends et jours fériés sont inclus.',
      faq: [
        { question: 'Combien de jours y a-t-il entre le 1er et le 31 janvier ?', answer: 'Il s’écoule 30 jours calendaires. Le calcul ne compte pas le jour de départ comme une journée entière ; en comptant les deux dates inclusivement, on obtient 31 dates du calendrier.' },
        { question: 'Puis-je ajouter 30 jours à une date ou compter les jours ouvrés ?', answer: 'Saisissez une date de départ et 30 pour trouver la date située 30 jours calendaires plus tard ; utilisez -30 pour revenir en arrière. Les week-ends et jours fériés sont inclus : ce n’est pas un calcul de jours ouvrés.' },
      ],
    },
    pt: {
      body: 'Entre 1º e 31 de janeiro há 30 dias decorridos, pois o dia inicial não é contado como um dia completo. Você também pode somar ou subtrair um número inteiro de dias corridos; fins de semana e feriados não são excluídos.',
      faq: [
        { question: 'Quantos dias há entre 1º e 31 de janeiro?', answer: 'São 30 dias corridos. A calculadora não conta o dia inicial como um dia completo; contando as duas datas de forma inclusiva, seriam 31 datas no calendário.' },
        { question: 'Posso somar 30 dias a uma data ou contar dias úteis?', answer: 'Informe uma data inicial e 30 para encontrar a data 30 dias corridos depois; use -30 para voltar. Fins de semana e feriados entram na conta, portanto não é um cálculo de dias úteis.' },
      ],
    },
    de: {
      body: 'Vom 1. bis zum 31. Januar vergehen 30 Tage, da der Starttag nicht als voller Tag mitgezählt wird. Sie können auch eine ganze Anzahl von Kalendertagen addieren oder abziehen; Wochenenden und Feiertage werden nicht ausgelassen.',
      faq: [
        { question: 'Wie viele Tage liegen zwischen dem 1. und dem 31. Januar?', answer: 'Es vergehen 30 Kalendertage. Der Starttag wird nicht als voller Tag mitgezählt; bei einer inklusiven Zählung beider Daten wären es 31 Kalendertage.' },
        { question: 'Kann ich 30 Tage zu einem Datum addieren oder Arbeitstage zählen?', answer: 'Geben Sie ein Startdatum und 30 ein, um das Datum 30 Kalendertage später zu finden; mit -30 rechnen Sie zurück. Wochenenden und Feiertage zählen mit, daher ist dies kein Arbeitstage-Rechner.' },
      ],
    },
  },
  'remove-line-breaks': {
    en: {
      body: 'Use “Join with spaces” for wrapped sentences copied from a PDF or email, so words stay separated. Choose “Remove breaks” only when you want adjacent lines joined without a separator. Both actions collapse repeated spaces and tabs and merge blank paragraphs.',
      faq: [
        { question: 'How do I remove line breaks from text copied from a PDF?', answer: 'Paste the text and choose “Join with spaces” to replace line breaks with spaces and make a readable paragraph. The tool also reduces repeated spaces and tabs to one space.' },
        { question: 'What is the difference between joining with spaces and removing breaks?', answer: '“Join with spaces” puts a space where each line break was. “Remove breaks” joins the lines directly, which can be useful when a word or URL was split mid-line. Both options merge blank paragraph breaks.' },
      ],
    },
    es: {
      body: 'Usa «Unir con espacios» para reconstruir frases partidas al copiar un PDF o correo, sin pegar las palabras. Elige «Quitar saltos» solo si quieres unir líneas sin separador. Ambas opciones reducen espacios y tabulaciones repetidos y también unen los párrafos vacíos.',
      faq: [
        { question: '¿Cómo quito los saltos de línea de un texto copiado de un PDF?', answer: 'Pega el texto y pulsa «Unir con espacios» para sustituir los saltos por espacios y formar un párrafo legible. La herramienta también reduce los espacios y tabulaciones repetidos a uno.' },
        { question: '¿Qué diferencia hay entre unir con espacios y quitar saltos?', answer: '«Unir con espacios» coloca un espacio donde había cada salto. «Quitar saltos» une las líneas directamente; puede servir cuando una palabra o URL quedó partida. Ambas opciones también unen los párrafos vacíos.' },
      ],
    },
    fr: {
      body: 'Choisissez « Joindre avec des espaces » pour reconstituer les phrases coupées lors de la copie d’un PDF ou d’un e-mail, sans coller les mots. Utilisez « Supprimer les retours » pour joindre les lignes sans séparateur. Les deux options réduisent les espaces et tabulations répétés et fusionnent les paragraphes vides.',
      faq: [
        { question: 'Comment supprimer les retours à la ligne d’un texte copié depuis un PDF ?', answer: 'Collez le texte puis choisissez « Joindre avec des espaces » pour remplacer les retours par des espaces et former un paragraphe lisible. Les espaces et tabulations répétés sont également ramenés à un seul espace.' },
        { question: 'Quelle différence entre joindre avec des espaces et supprimer les retours ?', answer: '« Joindre avec des espaces » insère un espace à chaque retour. « Supprimer les retours » colle directement les lignes, ce qui peut être utile si un mot ou une URL a été coupé. Les deux options fusionnent aussi les paragraphes vides.' },
      ],
    },
    pt: {
      body: 'Use “Unir com espaços” para reconstruir frases quebradas ao copiar um PDF ou e-mail, sem grudar as palavras. Escolha “Remover quebras” somente se quiser unir linhas sem separador. As duas opções reduzem espaços e tabulações repetidos e também unem parágrafos vazios.',
      faq: [
        { question: 'Como remover as quebras de linha de um texto copiado de PDF?', answer: 'Cole o texto e escolha “Unir com espaços” para trocar as quebras por espaços e formar um parágrafo legível. A ferramenta também reduz espaços e tabulações repetidos a um único espaço.' },
        { question: 'Qual é a diferença entre unir com espaços e remover quebras?', answer: '“Unir com espaços” coloca um espaço onde havia cada quebra. “Remover quebras” une as linhas diretamente, o que pode ajudar quando uma palavra ou URL foi cortada. As duas opções também unem parágrafos vazios.' },
      ],
    },
    de: {
      body: 'Verwenden Sie „Mit Leerzeichen verbinden“, um beim Kopieren aus PDFs oder E-Mails getrennte Sätze wieder lesbar zu machen. „Zeilenumbrüche entfernen“ verbindet Zeilen ohne Trennzeichen. Beide Optionen reduzieren wiederholte Leerzeichen und Tabstopps und führen auch leere Absätze zusammen.',
      faq: [
        { question: 'Wie entferne ich Zeilenumbrüche aus kopiertem PDF-Text?', answer: 'Fügen Sie den Text ein und wählen Sie „Mit Leerzeichen verbinden“, damit Zeilenumbrüche durch Leerzeichen ersetzt und lesbare Absätze gebildet werden. Mehrere Leerzeichen und Tabstopps werden ebenfalls auf ein Leerzeichen reduziert.' },
        { question: 'Was ist der Unterschied zwischen Verbinden mit Leerzeichen und Entfernen?', answer: '„Mit Leerzeichen verbinden“ fügt an jedem Zeilenumbruch ein Leerzeichen ein. „Zeilenumbrüche entfernen“ fügt die Zeilen direkt zusammen, etwa wenn ein Wort oder eine URL getrennt wurde. Beide Optionen verbinden auch leere Absätze.' },
      ],
    },
  },
};

export const longtailBodies = Object.fromEntries(Object.entries(tools).map(([id, languages]) => [
  id,
  Object.fromEntries(Object.entries(languages).map(([language, content]) => [language, content.body])),
]));

export const longtailFaqs = Object.fromEntries(Object.entries(tools).map(([id, languages]) => [
  id,
  Object.fromEntries(Object.entries(languages).map(([language, content]) => [language, content.faq])),
]));
