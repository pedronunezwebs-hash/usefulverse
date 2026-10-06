import { readFile, writeFile } from 'node:fs/promises';
import { opportunityTools } from '../../src/opportunity-tools.mjs';
import { opportunityLocaleData as existingOpportunityLocaleData } from '../../src/locales/opportunity-tools.mjs';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR;
if (!directory) throw new Error('Set USEFULVERSE_TRANSLATION_DIR to the isolated temporary translation directory.');
const input = JSON.parse(await readFile(directory + '/draft-input.json', 'utf8'));
const rows = (await readFile(directory + '/google-translate-output.jsonl', 'utf8')).trim().split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
const result = {};
const leakedRow = /(?:UVR|УВР|یو\s*وی\s*آر|\d{8})/u;
const uiOverrides = {
  // Short labels are ambiguous in machine translation without UI context.
  ru: { Stop: 'Остановить' },
  it: { Shopping: 'Acquisti' },
  ca: { Sessions: 'Sessions d’estudi', Major: 'Escala major', Blues: 'Escala de blues', Transport: 'Desplaçaments' },
  id: { Tritone: 'Tritonus', Blues: 'Musik blues', Dorian: 'Modus Dorian', Mixolydian: 'Modus Mixolydian' },
  nl: { Score: 'Punten', 'Score: {score}': 'Punten: {score}', 'Correct!': 'Goed!', Blues: 'Bluestoonladder', Transport: 'Vervoer' },
  pl: { Transport: 'Dojazdy' },
  sv: { Transport: 'Resor' },
  tl: {
    Streak: 'Sunod-sunod na tamang sagot', 'Streak: {streak}': 'Sunod-sunod na tamang sagot: {streak}',
    'Round {n}': 'Yugto {n}', Tritone: 'Agwat na anim na semitone',
    'Root note': 'Pangunahing nota', Major: 'Mayor', 'Natural minor': 'Likas na menor',
    'Harmonic minor': 'Harmonikong menor', 'Major pentatonic': 'Pentatonikong mayor',
    'Minor pentatonic': 'Pentatonikong menor', Blues: 'Iskalang blues',
    Dorian: 'Modong Dorian', Mixolydian: 'Modong Mixolydian',
  },
  ar: { 'Between 2 and 64 unique names. Matches and byes are handled in this browser.': 'أدخل من اسمين إلى 64 اسماً مختلفاً. تُدار المباريات وحالات الإعفاء من الجولة في هذا المتصفح.' },
  ha: {
    'Each round is generated on this device. Your answers are not uploaded.': 'Ana samar da kowane zagaye a wannan naurar. Ba a loda amsoshinka ba.',
    Tritone: 'Tazara ta sautuna shida', Octave: 'Tazarar oktob',
    'Start practice': 'Fara atisaye', 'Question {current} of {total}': 'Tambaya {current} cikin {total}',
    Score: 'Maki', Streak: 'Jerin amsoshi daidai', Time: 'Lokaci', 'Your answer': 'Amsarka',
    'Check answer': 'Duba amsa', 'Next question': 'Tambaya ta gaba', 'Ready when you are.': 'Ka shirya.',
    'Enter a whole-number answer.': 'Shigar da cikakkiyar lamba a matsayin amsa.', Correct: 'Daidai!',
    'Correct!': 'Daidai!', 'Not quite. Answer: {answer}.': 'Ba daidai ba. Amsa: {answer}.',
    'Round complete. Score: {score}/{total} ({accuracy}%).': 'An kammala zagaye. Maki: {score}/{total} ({accuracy}%).',
    Operation: 'Aiki', Mixed: 'Haɗe-haɗe', Addition: 'Ƙari', Subtraction: 'Ragi',
    Multiplication: 'Ninkawa', Division: 'Rarrabawa', Difficulty: 'Matsayin wahala',
    Easy: 'Mai sauƙi', Medium: 'Matsakaici', Hard: 'Mai wahala', Questions: 'Tambayoyi',
    '5 questions': 'Tambayoyi 5', '10 questions': 'Tambayoyi 10', '20 questions': 'Tambayoyi 20',
    'Root note': 'Tushen sauti', Major: 'Babban', 'Natural minor': 'Karamin na halitta',
    'Harmonic minor': 'Karamin mai jituwa', 'Major pentatonic': 'Pentatonic na babba',
    'Minor pentatonic': 'Pentatonic na karami', Blues: 'Kiɗan blues',
    Dorian: 'Yanayin Dorian', Mixolydian: 'Yanayin Mixolydian',
  },
  // Music theory names are short in the UI. Localize the scale labels rather
  // than relying on machine-translation output that can leave them in English.
  tr: { Blues: 'Blues müziği', Dorian: 'Dor modu' },
  vi: { Blues: 'Nhạc blues', Dorian: 'Điệu Dorian', Mixolydian: 'Điệu Mixolydian' },
  it: { Blues: 'Scala blues' },
  el: { Blues: 'Κλίμακα μπλουζ' },
  ms: { Major: 'Skala major', Blues: 'Skala blues', Dorian: 'Mod Dorian', Mixolydian: 'Mod Mixolydian' },
  sv: { Blues: 'Bluesskala', Research: 'Förberedelser' },
  sw: { Dorian: 'Modi ya Doria', Mixolydian: 'Modi ya Mixolydia' },
  ha: { Blues: 'Kiɗan blues', Major: 'Babban', 'Natural minor': 'Karamin na halitta', 'Harmonic minor': 'Karamin mai jituwa', 'Major pentatonic': 'Pentatonic na babba', 'Minor pentatonic': 'Pentatonic na karami', Dorian: 'Yanayin Dorian', Mixolydian: 'Yanayin Mixolydian' },
};
const copyOverrides = {
  it: {
    'ear-training': [
      'Allenamento dell’orecchio', 'Allenamento uditivo',
      'Esercitati a riconoscere gli intervalli musicali con suoni sintetizzati localmente e sequenze ascendenti o discendenti personalizzabili.',
      'allenamento dell’orecchio, esercizi sugli intervalli, riconoscimento degli intervalli musicali, esercizi di ascolto online',
      'Ascolta due note, identifica l’intervallo e accumula punti durante una breve sessione di pratica.',
      'I suoni vengono generati direttamente nel browser. È un semplice esercizio di riconoscimento degli intervalli; non registra né carica audio e non valuta le abilità musicali complessive.',
    ],
  },
  ha: {
    'mental-math-practice': [
      'Atisayen lissafin tunani', 'Atisayen lissafi',
      'Ƙara saurin lissafin tunani ta amfani da ƙari, ragi, ninkawa, rarrabawa da gaurayen zagaye.',
      'atisayen lissafin tunani, atisayen lissafi, atisayen ƙari da ragi, atisayen ninkawa',
      'Zaɓi ayyukan lissafi, matakin wahala da tsawon zagaye. Amsa tambaya ɗaya a lokaci guda; wannan shafi yana nuna maki da jerin amsoshin daidai.',
      'Ana samar da tambayoyi a naurarka. Ba a buƙatar asusu, kuma wannan atisayen ba maki na makaranta ba ne.',
    ],
  },
  tl: {
    'bpm-detector': [
      'Tagatukoy ng BPM', 'Pagsukat ng tempo',
      'Tantiyahin ang tempo ng kanta mula sa lokal na audio file, ihambing ang malalapit na hula at tapikin kasabay ng tugtog upang suriin ang beat.',
      'tagatukoy ng BPM, sukat ng tibok kada minuto, tagatukoy ng tempo ng kanta, tap tempo, pagsusuri ng BPM ng audio',
      'Pumili ng maikling audio file upang tantiyahin ang mga tibok kada minuto nito, o tapikin kasabay ng beat upang sukatin ang tempo nang manu-mano.',
      'Ide-decode at susuriin ang audio sa browser mo; hindi ito ia-upload. Mga pagtatantya ang resulta at maaaring kalahati o doble ng beat na naririnig mo. Para sa pinakamainam na resulta, gumamit ng malinaw at tuloy-tuloy na bahagi sa computer. Maaaring lumampas sa memorya ng device o limitasyon ng audio decoder ng browser ang malalaki o mahahabang file.',
    ],
    'seating-chart-maker': [
      'Tagagawa ng tsart ng upuan', 'Tsart ng upuan',
      'Ayusin ang mga bisita sa mga mesa, ayusin ang mga upuan gamit ang kamay at i-save o i-export ang iyong plano sa device na ito.',
      'tagagawa ng tsart ng upuan, plano ng upuan para sa mga bisita, tsart ng upuan para sa kasal, tagaplano ng upuan sa mesa, ayusin ang mga bisita sa mga mesa',
      'Magdagdag ng isang bisita bawat linya, piliin ang kapasidad ng iyong mesa at lumikha ng isang balanseng draft. Maaari mong ilipat ang bawat bisita sa ibang mesa pagkatapos.',
      'Ang mga pangalan ng bisita at mga plano ng upuan ay mananatili sa browser na ito maliban kung magda-download ka ng kopya. Gumagawa ang tool na ito ng balanseng draft ngunit hindi nito hinuhulaan ang mga relasyon, pangangailangan sa accessibility o iba pang limitasyon sa upuan; suriin at ayusin ang bawat mesa nang mag-isa.',
    ],
    'gantt-chart-maker': [
      'Tagagawa ng Gantt Chart', 'Tsart ng Gantt',
      'Gumawa ng malinaw na timeline ng proyekto mula sa mga gawaing may petsa, opsyonal na dependency, lokal na pag-save at pag-export ng CSV.',
      'tagagawa ng Gantt chart, online na Gantt chart, tagaplano ng timeline ng proyekto, tsart ng dependency ng gawain, template ng iskedyul ng proyekto',
      'Maglagay ng isang gawain bawat linya kasama ang petsa ng pagsisimula at tagal. Magdagdag ng numero ng naunang gawain upang ipakita ang dependency.',
      'Ginagawa ang tsart sa browser mo. Sinusuri ang mga petsa at dependency, ngunit hindi isinasaalang-alang ng plano ang mga holiday, kapasidad ng team o awtomatikong pag-level ng mga mapagkukunan. Suriin ang iskedyul bago ito pagkatiwalaan.',
    ],
  },
  ta: {
    'household-budget-planner': [
      'வீட்டு வரவு செலவுத் திட்டம்', 'வீட்டு பட்ஜெட்',
      'மாத வருமானம் மற்றும் செலவுகளைப் பதிவு செய்து இருப்பைப் பார்க்கவும்; CSV ஆக ஏற்றுமதி செய்யவும்.',
      'வீட்டு பட்ஜெட், மாத வருமான செலவு, குடும்ப செலவு கணக்கு',
      'மாதம் மற்றும் நாணயத்தைத் தேர்ந்தெடுத்து வருமானம் அல்லது செலவைச் சேர்க்கவும். கணக்குகள் இந்தச் சாதனத்தில் இருக்கும்.',
      'நீங்கள் சேமித்தால், தரவு இந்த உலாவியில் மட்டும் இருக்கும். வங்கிகளுடன் இணைப்பு இல்லை; நிதி ஆலோசனையும் இல்லை. உலாவித் தரவை அழித்தால் சேமித்த தரவு நீங்கலாம்.',
    ],
  },
};
for (const [language, target] of Object.entries(input.targets)) {
  const translated = new Map(rows.filter((row) => row.language === language).map((row) => [row.unitId, row.translation]));
  const expected = Object.keys(target.units);
  const missing = expected.filter((key) => !translated.has(key));
  if (missing.length) throw new Error(language + ' is missing ' + missing.length + ' translations: ' + missing.slice(0, 8).join(', '));
  const ui = {};
  const copy = {};
  for (const [unitId, source] of Object.entries(target.units)) {
    const rawValue = translated.get(unitId)
      .replace(/\s+\d+\s+checkbox\b[\s\S]*$/u, '')
      .replace(/\s+Enviar comentarios Paneles laterales Historial Guardadas Resultados de traducción disponibles[\s\S]*$/u, '')
      .replace(/\s+-\s+(?:button|link|navigation|generic)\b[\s\S]*$/u, '')
      .replace(/\s+Resultados de traducción disponible[\s\S]*$/u, '')
      .replace(/\s+-\s*$/u, '')
      .replace(/\s+["'”’]$/u, '')
      .trim();
    // The free Google Translate UI sometimes appends the next row's marker and
    // translation to an RTL result. Keep only the current row, never publish a
    // sentinel or another field's copy as part of this translation.
    const value = rawValue.split(/\r?\n/u).filter((line) => !leakedRow.test(line)).join(' ').trim() || source;
    if (unitId.startsWith('ui.')) ui[source] = uiOverrides[language]?.[source] ?? value;
    else {
      const [, id, property] = unitId.split('.');
      (copy[id] ??= {})[property] = value;
    }
  }
  const selectedIds = process.env.USEFULVERSE_TRANSLATION_TOOL_IDS?.split(',').filter(Boolean);
  const selectedTools = selectedIds ? opportunityTools.filter((tool) => selectedIds.includes(tool.id)) : opportunityTools;
  for (const tool of selectedTools) {
    if (copyOverrides[language]?.[tool.id]) {
      copy[tool.id] = copyOverrides[language][tool.id];
      continue;
    }
    const values = copy[tool.id];
    const fields = ['title', 'shortTitle', 'description', 'keywords', 'intro', 'body'];
    if (!values || fields.some((key) => !values[key])) throw new Error('Incomplete translated copy: ' + language + '/' + tool.id);
    copy[tool.id] = fields.map((key) => values[key]);
  }
  for (const id of Object.keys(copy)) if (!selectedTools.some((tool) => tool.id === id)) delete copy[id];
  result[language] = selectedIds
    ? { ui: { ...(existingOpportunityLocaleData[language]?.ui ?? {}), ...ui }, copy: { ...(existingOpportunityLocaleData[language]?.copy ?? {}), ...copy } }
    : { ui, copy };
}
const output = 'export const opportunityLocaleData = ' + JSON.stringify(result) + ';\n';
await writeFile(new URL('../../src/locales/opportunity-tools.mjs', import.meta.url), output);
console.log('Compiled ' + Object.keys(result).length + ' language packs for ' + opportunityTools.length + ' tools.');
