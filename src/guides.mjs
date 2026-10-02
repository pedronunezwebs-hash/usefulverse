import { locales, packs } from './locales.mjs';
import { guidePacks } from './locales/guide-packs.mjs';

const site = 'https://usefulverse.com';

export const guides = [
  {
    slug: 'how-to-calculate-a-weighted-grade',
    toolId: 'average-calculator',
    title: 'How to Calculate a Weighted Grade (With Examples)',
    description: 'Learn the weighted grade formula, calculate a current course grade with unfinished categories, and find the exam score needed for a target.',
    toolCta: 'Calculate a weighted grade or work out the score you need on your final.',
    intro: 'A weighted grade gives each assignment or category the share of your final result shown in the syllabus. This guide shows the calculation, how to handle a course that is still in progress, and how to work backwards from a target grade.',
    sections: [
      {
        heading: 'Start with the grading rules in your syllabus',
        blocks: [
          { type: 'p', text: 'Write down each category, its weight, and the percentage you earned in that category. Use category percentages, not raw points, when categories have different point totals. A homework average of 90% and an exam average of 80% are the inputs; the number of homework questions is not itself a weight unless the syllabus says it is.' },
          { type: 'note', title: 'Check the weights first', text: 'For a finished course, category weights commonly add to 100%. If a gradebook uses a running total or some categories have no grades yet, its displayed current grade may be normalized over completed work instead. Follow the syllabus or gradebook rules.' },
        ],
      },
      {
        heading: 'Use the weighted-average formula',
        blocks: [
          { type: 'formula', label: 'Final course grade', value: 'grade₁ × weight₁ + grade₂ × weight₂ + …' },
          { type: 'p', text: 'Convert percentage weights to decimals before multiplying. For example, 30% becomes 0.30. If homework is 92% and worth 40%, while exams are 84% and worth 60%, the result is (92 × 0.40) + (84 × 0.60) = 87.2%.' },
          { type: 'p', text: 'If your syllabus expresses weights as whole numbers such as 40 and 60, divide the weighted sum by their total: (92 × 40 + 84 × 60) ÷ 100 = 87.2%. The two forms are equivalent when the weights total 100.' },
        ],
      },
      {
        heading: 'Calculate a current grade when some categories are unfinished',
        blocks: [
          { type: 'p', text: 'When only some categories have grades, divide their weighted points by the sum of the weights that have grades. Suppose homework is 92% at 40% of the course and the midterm is 84% at 35%; the final exam is not graded yet.' },
          { type: 'formula', label: 'Current grade on completed work', value: '(92 × 0.40 + 84 × 0.35) ÷ (0.40 + 0.35) = 88.27%' },
          { type: 'p', text: 'That 88.27% describes completed categories only. It is not the same as the points already earned toward the final course grade, which are 66.2 percentage points before the remaining 25% is counted.' },
        ],
      },
      {
        heading: 'Find the score you need on a final exam',
        blocks: [
          { type: 'p', text: 'If your current grade represents all work outside the final exam, use the exam’s share of the total course grade to solve for the missing score.' },
          { type: 'formula', label: 'Required final-exam score', value: '(target grade − current grade × (1 − final weight)) ÷ final weight' },
          { type: 'p', text: 'Example: your current grade is 88%, the final is worth 30%, and your target is 90%. The calculation is (90 − 88 × 0.70) ÷ 0.30 = 94.67%. You would need about 94.7% on the final, assuming the current grade covers the other 70% exactly.' },
          { type: 'note', title: 'If the answer is above 100%', text: 'The target is mathematically out of reach under these assumptions. If it is below 0%, your current work already exceeds the target mathematically. Extra credit, dropped scores, curves, and category rules can change the real result.' },
        ],
      },
      {
        heading: 'Common mistakes to avoid',
        blocks: [
          { type: 'list', items: [
            'Averaging category grades equally when the syllabus gives them different weights.',
            'Using raw points from assignments with different possible totals instead of the category percentages.',
            'Treating a gradebook’s current running total as if it already included every ungraded category.',
            'Assuming a final-exam calculation accounts for extra credit, a curve, a dropped test, or a minimum-exam rule without checking the syllabus.',
          ] },
          { type: 'p', text: 'For a quick check, enter grades and weights in the free weighted-average and final-grade calculator. It runs in your browser and does not upload your scores.' },
        ],
      },
    ],
    sources: [
      { label: 'Northern Arizona University: Calculating weighted grades', url: 'https://www.cefns.nau.edu/~edo/Classes/HowtoCalcGrades.html' },
    ],
  },
  {
    slug: 'google-docs-word-count',
    toolId: 'word-counter',
    title: 'How to Check Word Count in Google Docs',
    description: 'Find the word count for a whole Google Doc or selected text, turn on a live count, and understand what Docs leaves out.',
    toolCta: 'Count words, characters, lines, sentences and estimated reading time from text copied from your document.',
    intro: 'Google Docs can show the count for a whole document or just a selected passage. Here are the desktop steps, what the built-in count includes, and a quick way to check copied text without changing your document.',
    sections: [
      {
        heading: 'Count the whole document on a computer',
        blocks: [
          { type: 'steps', items: [
            'Open the document in Google Docs.',
            'Choose Tools → Word count from the top menu.',
            'Read the words, characters, characters without spaces, and pages in the dialog, then close it.',
          ] },
          { type: 'p', text: 'For a short document, enable “Display word count while typing” in the same dialog. A small count appears at the bottom left; select it to see the other totals or hide it.' },
        ],
      },
      {
        heading: 'Count only a paragraph or selected text',
        blocks: [
          { type: 'p', text: 'Highlight the passage first, then open Tools → Word count. Docs reports the selected section rather than the entire document. This is useful when a prompt sets a limit for the body but excludes a title, references, or another section—select only the text that the instructions say to count.' },
          { type: 'note', title: 'Use the assignment’s counting rule', text: 'A word limit can define “words” differently from an app’s default. Check whether headings, citations, references, captions, or footnotes are included before submitting.' },
        ],
      },
      {
        heading: 'What Google Docs includes by default',
        blocks: [
          { type: 'p', text: 'Google’s help page says the count applies to the document except for headers, footers, and footnotes, unless you select a section. If your required count includes one of those areas, select the relevant text and check it separately.' },
          { type: 'p', text: 'The live count is convenient while drafting; the dialog is better when you need the character totals or want to count a specific selection.' },
        ],
      },
      {
        heading: 'Check text copied from Google Docs',
        blocks: [
          { type: 'p', text: 'If you only need a quick count for a passage, copy it and paste it into UsefulVerse’s word counter. Words, characters, lines, sentences, paragraphs, and estimated reading time update in your browser. The text is not uploaded, and the Google Doc is not changed.' },
          { type: 'note', title: 'Counts can differ slightly', text: 'Different apps may segment punctuation, hyphenated terms, symbols, and language-specific words differently. When a school, editor, or form specifies a particular counter, use that one for the final submission.' },
        ],
      },
    ],
    sources: [
      { label: 'Google Docs Editors Help: Count the words in a document', url: 'https://support.google.com/docs/answer/39003?hl=en' },
    ],
  },
  {
    slug: 'remove-duplicates-in-excel-safely',
    toolId: 'remove-duplicate-lines',
    title: 'How to Remove Duplicates in Excel Safely',
    description: 'Choose what counts as a duplicate in Excel, preview unique rows, keep the right record, and avoid deleting data by mistake.',
    toolCta: 'Remove repeated lines or tab-separated rows while keeping the first match and original order.',
    intro: 'Removing duplicate rows is easy; deciding what “duplicate” means is the important part. A repeated email, a repeated full row, and a repeated combination of name and date are different rules. Set that rule and protect the original before you remove anything.',
    sections: [
      {
        heading: 'Decide which columns define a duplicate',
        blocks: [
          { type: 'p', text: 'If every cell in two rows must match, compare the full row. If a customer ID alone identifies a record, compare that column. You can also use a combination—such as first name plus last name—when that is the key your task requires.' },
          { type: 'note', title: 'Excel may delete the whole row', text: 'When you choose one or more columns in Remove Duplicates, Excel uses those selected columns as the comparison key, but removes the duplicate row across the selected range. Other cells in that row are removed too.' },
        ],
      },
      {
        heading: 'Make a safe copy and preview the result',
        blocks: [
          { type: 'steps', items: [
            'Duplicate the worksheet or copy the original table to another sheet or workbook.',
            'If you are unsure what will match, highlight duplicates with Conditional Formatting or use Advanced Filter to copy unique records to a new location.',
            'Select the intended range, then choose Data → Remove Duplicates.',
            'Select only the columns that define a duplicate, confirm the result, and inspect several rows before continuing.',
          ] },
          { type: 'p', text: 'Excel keeps the first matching occurrence and removes later matches. If you need to keep the newest or highest-priority record instead, sort the data deliberately before deduplicating, and verify the result on the copy.' },
        ],
      },
      {
        heading: 'Watch for values that look the same but are not',
        blocks: [
          { type: 'list', items: [
            'Spaces at the beginning or end of a cell can make text values differ.',
            'Different date formats may display similarly while storing different values, or the same date can display in different formats.',
            'A name alone may not be a safe key when two different people share it.',
            'Selecting the wrong columns can remove rows that are not duplicates for your purpose.',
          ] },
          { type: 'p', text: 'Keep the backup until you have checked both the retained rows and the removal count. Excel’s Undo can help immediately, but a separate copy is safer if you continue working afterward.' },
        ],
      },
      {
        heading: 'Clean a pasted list without changing your spreadsheet',
        blocks: [
          { type: 'p', text: 'For a simple list or tab-separated rows, UsefulVerse’s duplicate-line remover keeps the first matching line and preserves the order. You can trim edge spaces, ignore letter case, or remove blank lines. It compares the entire line, so use Excel when the duplicate key should be only selected columns. Review the output before pasting it back.' },
        ],
      },
    ],
    sources: [
      { label: 'Microsoft Support: Filter for unique values or remove duplicate values', url: 'https://support.microsoft.com/en-us/excel/get-started/filter-for-unique-values-or-remove-duplicate-values' },
    ],
  },
  {
    slug: 'hexadecimal-to-binary-conversion',
    toolId: 'binary-converter',
    title: 'How to Convert Hexadecimal to Binary',
    description: 'Convert hexadecimal digits to binary one nibble at a time, use the 0–F lookup table, and keep the leading bits in each group.',
    toolCta: 'Convert whole numbers between hexadecimal, binary, decimal and other bases.',
    intro: 'You do not need to convert a hexadecimal number through decimal first. Replace each hex digit with its four-bit binary equivalent, then join the groups in order.',
    sections: [
      {
        heading: 'The four-bit rule',
        blocks: [
          { type: 'p', text: 'Hexadecimal uses sixteen symbols: 0–9 and A–F, where A is 10 and F is 15. Four binary bits can represent values from 0 through 15, so each hex digit maps to exactly one four-bit group.' },
          { type: 'table', caption: 'Hexadecimal digit to four-bit binary', headers: ['Hex', 'Binary', 'Hex', 'Binary'], rows: [
            ['0', '0000', '8', '1000'], ['1', '0001', '9', '1001'], ['2', '0010', 'A', '1010'], ['3', '0011', 'B', '1011'],
            ['4', '0100', 'C', '1100'], ['5', '0101', 'D', '1101'], ['6', '0110', 'E', '1110'], ['7', '0111', 'F', '1111'],
          ] },
        ],
      },
      {
        heading: 'Work through an example: 24D₁₆',
        blocks: [
          { type: 'steps', items: [
            'Split the hexadecimal number into digits: 2, 4, and D.',
            'Look up each four-bit group: 2 → 0010, 4 → 0100, D → 1101.',
            'Join the groups in the same order: 24D₁₆ = 0010 0100 1101₂.',
          ] },
          { type: 'p', text: 'As a check, 24D₁₆ equals 589 in decimal, and 0010 0100 1101₂ also equals 589. The four-bit groups make the conversion easier to verify.' },
        ],
      },
      {
        heading: 'Why the leading zeros matter',
        blocks: [
          { type: 'p', text: 'Keep all four bits while converting each digit: 2 is 0010, not just 10, in this grouped method. A leading zero does not change the numeric value, but it keeps each hexadecimal digit aligned with its four-bit group. That matters when you are reading bytes, bit fields, or a fixed-width value.' },
          { type: 'p', text: 'For example, 0A₁₆ becomes 0000 1010₂. If you only need the shortest ordinary binary representation of the number, you may remove zeros at the very beginning after joining the groups; do not remove zeros inside a group.' },
        ],
      },
      {
        heading: 'Convert a longer value without losing your place',
        blocks: [
          { type: 'list', items: [
            'Read from left to right and replace one hex digit at a time.',
            'Keep each result four bits wide, including zeros.',
            'Separate groups with spaces to check your work; remove the spaces only if your destination requires one continuous string.',
            'If the input includes a prefix such as 0x, remove the prefix before entering the digits in a converter that expects only the value.',
          ] },
          { type: 'p', text: 'For a fast check, UsefulVerse’s base converter converts integers between bases 2 and 36 directly in your browser. Choose hexadecimal as the input base and binary as the output base; your value stays on your device.' },
        ],
      },
    ],
    sources: [
      { label: 'Harvard CS 61: Number systems and hexadecimal/binary conversion (PDF)', url: 'https://www.read.seas.harvard.edu/~kohler/class/04f-aos/ref/carter03pc-2up.pdf' },
    ],
  },
];

const protectedGuideFields = new Set(['slug', 'toolId', 'type', 'value', 'url']);

// Curated search-result metadata corrections for localized guide drafts. These
// overrides fix specific truncation/length issues; they do not certify the
// surrounding guide prose as linguistically reviewed.
const guideMetadataOverrides = {
  es: {
    'how-to-calculate-a-weighted-grade': { description: 'Aprende la fórmula de la nota ponderada, calcula tu nota con categorías pendientes y averigua qué puntuación necesitas para alcanzar tu meta.' },
    'google-docs-word-count': { description: 'Consulta el recuento de palabras de un documento o selección en Google Docs, activa el contador en tiempo real y descubre qué contenido queda fuera.' },
  },
  fr: {
    'how-to-calculate-a-weighted-grade': { description: 'Comprenez la moyenne pondérée, calculez votre note avec des catégories en cours et trouvez la note nécessaire à l’examen pour atteindre votre objectif.' },
    'remove-duplicates-in-excel-safely': { description: 'Choisissez les critères des doublons, vérifiez les lignes uniques, gardez les bonnes données et évitez les suppressions accidentelles dans Excel.' },
  },
  pt: {
    'google-docs-word-count': { description: 'Veja a contagem de palavras de um documento ou seleção no Google Docs, ative o contador em tempo real e saiba o que fica de fora.' },
  },
  de: {
    'how-to-calculate-a-weighted-grade': { description: 'Lerne die Formel für gewichtete Noten, berechne deinen aktuellen Stand mit offenen Kategorien und finde die nötige Prüfungsnote für dein Ziel.' },
  },
  id: {
    'how-to-calculate-a-weighted-grade': { description: 'Pelajari rumus nilai berbobot, hitung nilai saat ini dengan kategori yang belum selesai, dan cari nilai ujian untuk mencapai target.' },
  },
  it: {
    'how-to-calculate-a-weighted-grade': {
      title: 'Come calcolare una media ponderata (con esempi)',
      description: 'Scopri la formula della media ponderata, calcola il voto con categorie incomplete e trova il punteggio d’esame per raggiungere il tuo obiettivo.',
    },
    'google-docs-word-count': { title: 'Come contare le parole in Google Docs' },
    'remove-duplicates-in-excel-safely': { description: 'Scegli i criteri dei duplicati in Excel, controlla l’anteprima delle righe uniche, conserva i dati corretti ed evita cancellazioni accidentali.' },
  },
  nl: {
    'hexadecimal-to-binary-conversion': {
      title: 'Hexadecimaal naar binair omzetten',
      description: 'Zet elk hexadecimaal cijfer om in vier binaire bits, gebruik de 0–F-tabel en behoud de voorloopnullen van elke groep.',
    },
  },
  el: {
    'remove-duplicates-in-excel-safely': { title: 'Αφαίρεση διπλοτύπων στο Excel με ασφάλεια' },
    'hexadecimal-to-binary-conversion': { title: 'Μετατροπή δεκαεξαδικού σε δυαδικό' },
    'how-to-calculate-a-weighted-grade': {
      title: 'Σταθμισμένος βαθμός: υπολογισμός και παραδείγματα',
      description: 'Μάθετε τον τύπο του σταθμισμένου βαθμού, υπολογίστε την τρέχουσα επίδοση με εκκρεμείς κατηγορίες και βρείτε τον βαθμό εξέτασης που χρειάζεστε.',
    },
  },
  ms: {
    'how-to-calculate-a-weighted-grade': { title: 'Cara mengira markah berwajaran' },
    'google-docs-word-count': { title: 'Cara kira perkataan dalam Google Docs' },
    'remove-duplicates-in-excel-safely': { title: 'Cara buang data pendua dalam Excel' },
    'hexadecimal-to-binary-conversion': { title: 'Heksadesimal kepada binari: cara menukar' },
  },
  tr: {
    'google-docs-word-count': { title: 'Google Dokümanlar’da kelime sayısı' },
  },
  th: {
    'how-to-calculate-a-weighted-grade': { title: 'วิธีคำนวณเกรดแบบถ่วงน้ำหนัก (พร้อมตัวอย่าง)' },
  },
  sw: {
    'how-to-calculate-a-weighted-grade': { title: 'Jinsi ya kuhesabu alama zenye uzani' },
    'google-docs-word-count': { title: 'Jinsi ya kuhesabu maneno kwenye Google Docs' },
    'remove-duplicates-in-excel-safely': { title: 'Jinsi ya kuondoa nakala rudufu kwenye Excel' },
    'hexadecimal-to-binary-conversion': { title: 'Heksadesimali kwenda mfumo wa jozi' },
  },
  sv: {
    'google-docs-word-count': { title: 'Räkna ord i Google Dokument' },
    'remove-duplicates-in-excel-safely': { title: 'Ta bort dubbletter i Excel säkert' },
  },
  zh: {
    'how-to-calculate-a-weighted-grade': { title: '加权平均成绩怎么算？公式与示例' },
    'hexadecimal-to-binary-conversion': { title: '十六进制转二进制：分组换算方法' },
  },
  zh_tw: {
    'how-to-calculate-a-weighted-grade': { title: '加權成績如何計算？公式與範例說明' },
  },
};

function applyGuideMetadataOverrides(language, localizedGuides) {
  const overrides = guideMetadataOverrides[language];
  if (!overrides) return localizedGuides;
  return localizedGuides.map((guide) => ({ ...guide, ...(overrides[guide.slug] ?? {}) }));
}

function materializeGuideTranslation(value, translations, language, field = '') {
  if (Array.isArray(value)) return value.map((item) => materializeGuideTranslation(item, translations, language, field));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      key,
      materializeGuideTranslation(item, translations, language, key),
    ]));
  }
  if (typeof value !== 'string' || protectedGuideFields.has(field) || /^[0-9A-F]+$/u.test(value)) return value;
  const translated = translations[value];
  if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Missing reviewed guide translation for ${language}: ${value}`);
  return translated;
}

export function guidesForLocale(language) {
  if (language === 'en') return guides;
  const guidePack = guidePacks[language];
  if (Array.isArray(guidePack?.guides)) return applyGuideMetadataOverrides(language, guidePack.guides);
  if (guidePack?.text) return applyGuideMetadataOverrides(language, guides.map((guide) => materializeGuideTranslation(guide, guidePack.text, language)));
  return applyGuideMetadataOverrides(language, packs[language]?.guides ?? []);
}

export const guidePath = (slug = '', language = 'en') => {
  const prefix = locales[language]?.prefix ?? '';
  return `${prefix}/guides/${slug ? `${slug}/` : ''}`;
};

export function guideCanonical(slug = '', language = 'en') {
  return `${site}${guidePath(slug, language)}`;
}
