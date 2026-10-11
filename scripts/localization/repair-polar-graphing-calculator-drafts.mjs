// Patch a few short/full-sentence Google Translate fallbacks in the static draft.
import { rename, writeFile } from 'node:fs/promises';
const sourceUrl = new URL('../../src/growth600/locales/polar-graphing-calculator-final.mjs', import.meta.url);
const copies = structuredClone((await import(`${sourceUrl.href}?repair=${Date.now()}`)).default);
const corrections = {
  hi: { intro: 'कोण θ के फलन के रूप में त्रिज्या r दर्ज करके ध्रुवीय समीकरण का ग्राफ बनाएं। डिग्री या रेडियन चुनें, कोण सीमा और नमूना संख्या बदलें, फिर वक्र देखें और निर्देशांक डाउनलोड करें।', example: 'इकाई वृत्त r=1 लोड करें', calculate: 'ग्राफ बनाएं', loadExample: 'इकाई वृत्त लोड करें', copy: 'नमूना बिंदुओं की प्रतिलिपि बनाएं' },
  ar: { example: 'تحميل مثال الدائرة الوحدة r=1', calculate: 'ارسم المنحنى', loadExample: 'تم تحميل مثال الدائرة الوحدة.', copy: 'نسخ النقاط النموذجية' },
  zh: { intro: '输入角度 θ 的半径函数 r 来绘制极坐标方程。选择角度制或弧度制，调整角度范围和采样数量，然后查看曲线并下载坐标。', howAnswer: '输入半径表达式（例如 1 或 2*cos(θ)），选择角度范围和单位后计算。图形会将每个采样极坐标点转换为 x=r cos(θ)、y=r sin(θ)。当 r=1 且角度范围为 0° 到 360° 时，结果是单位圆。' },
  it: { example: 'Carica il cerchio unitario r=1', calculate: 'Disegna il grafico', loadExample: 'Esempio del cerchio unitario caricato.', reset: 'Azzera', copy: 'Copia i punti di esempio', faqAnswer: 'Sì. Dopo aver creato il grafico, scarica un CSV con ogni angolo campionato valido, il raggio e le coordinate cartesiane x e y.' },
  bg: { example: 'Зареди единичната окръжност r=1', calculate: 'Начертай графиката', loadExample: 'Примерът за единична окръжност е зареден.', copy: 'Копирай примерните точки', samples: 'Брой точки', chartLabel: 'Графика на полярно уравнение', resultCount: 'Валидни точки', calculated: 'Полярната графика е създадена.' },
  ca: { howTo: ['Introdueix una expressió del radi amb θ (o t), nombres, operacions, pi, e i funcions admeses com sin, cos, tan, sqrt i abs.', 'Tria radians o graus i indica angles inicial i final creixents, amb 50 a 1.500 mostres.', 'Calcula per veure el gràfic, copiar un resum de coordenades o baixar totes les mostres finites en CSV.'], radians: 'Radians' },
  sw: { radiusExpression: 'Radiusi r(θ)' },
  mr: { angleMin: 'सुरुवातीचा कोन' },
  te: { intro: 'కోణం θకు అనుగుణంగా వ్యాసార్థం rను నమోదు చేసి ధ్రువ సమీకరణాన్ని గ్రాఫ్ చేయండి. డిగ్రీలు లేదా రేడియన్లు ఎంచుకోండి, కోణ పరిధి మరియు నమూనాల సంఖ్యను సర్దుబాటు చేయండి; ఆపై వక్రరేఖను చూసి కోఆర్డినేట్‌లను డౌన్‌లోడ్ చేయండి.', example: 'యూనిట్ వృత్తం r=1ను లోడ్ చేయండి', loadExample: 'యూనిట్ వృత్తం ఉదాహరణ లోడ్ అయింది.' },
  tl: { name: 'Polar Graphing Calculator', privacyQuestion: 'Ina-upload ba ang equation ko?', calculate: 'I-plot ang graph', result: 'Polar na graph', radiusExpression: 'Radius r(θ)', angleUnit: 'Yunit ng anggulo', degrees: 'Degrees', chartLabel: 'Graph ng polar equation' },
  ta: { copy: 'மாதிரி புள்ளிகளை நகலெடு' },
  fa: { howTo: ['عبارت شعاع را با θ (یا t)، اعداد، عملیات، pi، e و توابع پشتیبانی‌شده مانند sin، cos، tan، sqrt و abs وارد کنید.', 'رادیان یا درجه را انتخاب کنید و زاویه آغاز و پایان افزایشی و ۵۰ تا ۱٬۵۰۰ نمونه وارد کنید.', 'برای دیدن نمودار، کپی خلاصه مختصات یا دریافت CSV همه نقاط متناهی محاسبه را بزنید.'] },
  am: { calculate: 'ግራፉን አሳይ', result: 'የፖላር ግራፍ', downloadCsv: 'CSV አውርድ', radiusExpression: 'ራዲየስ r(θ)', angleMin: 'መነሻ አንግል', angleMax: 'መጨረሻ አንግል', angleUnit: 'የአንግል አሃድ', radians: 'ሬዲያን', samples: 'የናሙና ነጥቦች', chartLabel: 'የፖላር ቀመር ግራፍ', resultCount: 'ትክክለኛ ነጥቦች', calculated: 'የፖላር ግራፍ ተፈጥሯል.' },
};
for (const [locale, values] of Object.entries(corrections)) {
  const copy = copies[locale];
  if (!copy) throw new Error(`Missing ${locale} locale.`);
  if (values.intro) copy.intro = values.intro;
  if (values.howAnswer) copy.howAnswer = values.howAnswer;
  if (values.name) copy.name = values.name;
  if (values.privacyQuestion) copy.privacyQuestion = values.privacyQuestion;
  if (values.howTo) copy.howTo = values.howTo;
  for (const key of ['calculate', 'result', 'downloadCsv', 'reset', 'copy']) if (values[key]) copy.actions[key] = values[key];
  if (values.example) copy.example.label = values.example;
  if (values.loadExample) copy.messages.exampleLoaded = values.loadExample;
  if (values.calculated) copy.messages.calculated = values.calculated;
  if (values.faqAnswer) copy.additionalFaqs[1].answer = values.faqAnswer;
  for (const key of ['radiusExpression', 'angleUnit', 'degrees', 'radians', 'samples', 'chartLabel', 'resultCount', 'angleMin', 'angleMax']) if (values[key]) copy.fields[key] = values[key];
}
const tempUrl = new URL(`${sourceUrl.href}.tmp`);
await writeFile(tempUrl, `// Static machine-translation drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
await rename(tempUrl, sourceUrl);
console.log(`Patched fallbacks in ${Object.keys(corrections).length} localized drafts.`);
