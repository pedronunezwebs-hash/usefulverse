// Generate one-time static Google Translate drafts; the published site never calls the service.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { beamDeflectionCalculatorEnglishCopy as source } from '../../src/growth600/locales/beam-deflection-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/beam-deflection-calculator.mjs', import.meta.url);
const localeCodes = { zh_tw: 'zh-TW', zh: 'zh-CN' };
const run = promisify(execFile);
function collect(value, path = [], rows = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage'].includes(path.at(-1))) rows.push({ path, source: value });
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)], rows));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key], rows);
  return rows;
}

function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}

async function request(locale, rows) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', localeCodes[locale] ?? locale.replace('_', '-')); url.searchParams.set('dt', 't');
  const markers = rows.map((_, index) => `987654${String(index).padStart(5, '0')}456789`);
  url.searchParams.set('q', rows.map((row, index) => `${markers[index]} ${row.source}`).join('\n'));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '30', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 120_000 });
  const body = JSON.parse(stdout);
  const translated = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('\n') : '';
  return markers.map((marker, index) => {
    const begin = translated.indexOf(marker);
    if (begin < 0) return rows[index].source;
    const start = begin + marker.length;
    const following = markers.slice(index + 1).map((next) => translated.indexOf(next, start)).filter((position) => position >= 0);
    const end = following.length ? Math.min(...following) : translated.length;
    const result = translated.slice(start, end).trim();
    return result || rows[index].source;
  });
}

async function translateBatch(locale, rows) {
  return request(locale, rows);
}

function normalize(copy) {
  const suffix = ' | UsefulVerse';
  const maxPrefix = 60 - [...suffix].length;
  let prefix = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxPrefix).join('').trimEnd();
  if ([...String(copy.title).split('|', 1)[0].trim()].length > maxPrefix) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}

function improve(copy, locale) {
  Object.assign(copy.fields, {
    mm4: 'mm⁴', cm4: 'cm⁴', m4: 'm⁴', in4: 'in⁴', ft4: 'ft⁴',
  });
  const technicalNames = {
    fr: ['Calculateur de flèche de poutre', 'Calculateur de flèche de poutre'],
    pt: ['Calculadora de deflexão de vigas', 'Calculadora de deflexão de vigas'],
    pt_br: ['Calculadora de deflexão de vigas', 'Calculadora de deflexão de vigas'],
    de: ['Balkendurchbiegungsrechner', 'Balkendurchbiegung berechnen'],
    ja: ['梁のたわみ計算機', '梁のたわみ計算機'],
    ko: ['보 처짐 계산기', '보 처짐 계산기'],
    id: ['Kalkulator lendutan balok', 'Kalkulator lendutan balok'],
    hi: ['बीम विक्षेप कैलकुलेटर', 'बीम विक्षेप कैलकुलेटर'],
    ar: ['حاسبة انحراف العارضة', 'حاسبة انحراف العارضة'],
    zh: ['梁挠度计算器', '梁挠度计算器'],
    zh_tw: ['梁撓度計算器', '梁撓度計算器'],
    bn: ['বিমের বিচ্যুতি ক্যালকুলেটর', 'বিমের বিচ্যুতি ক্যালকুলেটর'],
    ru: ['Калькулятор прогиба балки', 'Калькулятор прогиба балки'],
    ur: ['بیم کے جھکاؤ کا کیلکولیٹر', 'بیم کے جھکاؤ کا کیلکولیٹر'],
    tr: ['Kiriş sehim hesaplayıcı', 'Kiriş sehim hesaplayıcı'],
    vi: ['Máy tính độ võng dầm', 'Máy tính độ võng dầm'],
    it: ['Calcolatore freccia trave', 'Calcolatore freccia trave'],
    nl: ['Doorbuigingscalculator voor balken', 'Doorbuiging van een balk berekenen'],
    pl: ['Kalkulator ugięcia belki', 'Kalkulator ugięcia belki'],
    sv: ['Balknedböjningskalkylator', 'Beräkna balknedböjning'],
    th: ['เครื่องคำนวณการโก่งตัวของคาน', 'เครื่องคำนวณการโก่งตัวของคาน'],
    uk: ['Калькулятор прогину балки', 'Калькулятор прогину балки'],
    sw: ['Kikokotoo cha kupinda kwa boriti', 'Kikokotoo cha kupinda kwa boriti'],
  };
  if (technicalNames[locale]) [copy.name, copy.title] = technicalNames[locale];
  if (locale === 'es') Object.assign(copy, {
    name: 'Calculadora de deflexión de vigas', title: 'Deflexión de vigas gratis | UsefulVerse',
    description: 'Estima la deflexión de una viga en cuatro casos clásicos. Gratis, en tu navegador y sin cuenta.',
    intro: 'Estima la deformación elástica de vigas con cargas puntuales o uniformes, compara apoyos y consulta la curva.',
    howQuestion: '¿Cómo se estima la deflexión de una viga?',
    howAnswer: 'Elige una viga simplemente apoyada o en voladizo, y una carga puntual centrada o uniforme en toda la luz. Introduce la longitud, carga, módulo elástico y segundo momento de área. Se usan ecuaciones clásicas para pequeñas deflexiones.',
    privacyQuestion: '¿Se suben los datos de la viga?', privacyAnswer: 'No. El cálculo y el gráfico se generan en este navegador; la herramienta no sube ni guarda tus valores.',
    fields: { ...copy.fields, support: 'Tipo de apoyo', simplySupported: 'Simplemente apoyada en ambos extremos', cantilever: 'Voladizo fijo en un extremo', loadCase: 'Tipo de carga', pointLoad: 'Carga puntual en el centro / extremo libre', uniformLoad: 'Carga uniforme en toda la luz', span: 'Luz de la viga', lengthUnit: 'Unidad de longitud', meters: 'Metros (m)', centimeters: 'Centímetros (cm)', millimeters: 'Milímetros (mm)', inches: 'Pulgadas (in)', feet: 'Pies (ft)', load: 'Carga aplicada', forceUnit: 'Unidad de fuerza', newtons: 'Newton (N)', kilonewtons: 'Kilonewton (kN)', poundsForce: 'Libra-fuerza (lbf)', modulus: 'Módulo de Young', modulusUnit: 'Unidad del módulo', pascals: 'Pascal (Pa)', megapascals: 'Megapascal (MPa)', gigapascals: 'Gigapascal (GPa)', psi: 'Libras por pulgada cuadrada (psi)', ksi: 'Kips por pulgada cuadrada (ksi)', inertia: 'Segundo momento de área, I', inertiaUnit: 'Unidad de I', mm4: 'mm⁴', cm4: 'cm⁴', m4: 'm⁴', in4: 'in⁴', ft4: 'ft⁴', loadUnitHint: 'En carga puntual, introduce fuerza. En carga uniforme, introduce fuerza por unidad de longitud seleccionada.', accuracyNote: 'Estimación clásica de Euler–Bernoulli: viga recta y prismática, E e I constantes, elasticidad lineal y deflexión pequeña. Solo incluye los apoyos y cargas indicados. Omite deformación por cortante, peso propio, otras cargas, estabilidad, uniones y normas de diseño. Solo con fines educativos; no sirve para aprobar o certificar una estructura real. Consulta a un ingeniero estructural cualificado.', sourceNote: 'Consulta las notas y supuestos de deflexión de vigas de la Universidad de Illinois.' },
    actions: { ...copy.actions, calculate: 'Calcular deflexión', reset: 'Restablecer', copy: 'Copiar resultados', example: 'Cargar ejemplo', result: 'Estimación de viga' },
    messages: { ...copy.messages, calculated: 'Estimación calculada.', checkInputs: 'Revisa los valores y las unidades.', exampleLoaded: 'Ejemplo calculado.', maxDeflection: 'Deflexión máxima', location: 'Ubicación de la deflexión máxima', maxMoment: 'Momento flector máximo', flexuralRigidity: 'Rigidez a flexión E·I', curveLabel: 'Curva estimada de deflexión de la viga', simplySupported: 'Simplemente apoyada', cantilever: 'Voladizo', pointLoad: 'Carga puntual', uniformLoad: 'Carga uniforme' },
    additionalFaqs: [
      { question: '¿Qué casos de vigas incluye la calculadora?', answer: 'Incluye una viga simplemente apoyada o un voladizo con carga puntual centrada o carga uniforme en toda la luz. Otros apoyos, cargas fuera del centro, cargas múltiples y secciones variables quedan fuera.' },
      { question: '¿Qué es el segundo momento de área?', answer: 'El segundo momento de área I describe la geometría de la sección respecto al eje de flexión. No es el momento de inercia de masa. Usa el eje correcto y unidades coherentes.' },
      { question: '¿Puedo usar el resultado para aprobar una viga?', answer: 'No. Esta estimación educativa omite comprobaciones estructurales como cortante, resistencia, estabilidad, uniones, combinaciones de carga y normas locales. Un ingeniero estructural debe revisar el diseño real.' },
    ],
  });
  if (locale === 'ar') Object.assign(copy, {
    name: 'حاسبة انحراف العارضة', title: 'حاسبة انحراف العارضة مجانًا | UsefulVerse',
    description: 'قدّر انحراف العارضة في أربع حالات تحميل شائعة. مجانية في المتصفح ودون حساب.',
    intro: 'قدّر انحناء العوارض المرن للأحمال النقطية والموزعة، وقارن الارتكازات وشاهد منحنى الانحراف.',
    howQuestion: 'كيف أقدّر انحراف العارضة؟',
    howAnswer: 'اختر عارضة بسيطة الارتكاز أو عارضة كابولية، ثم اختر حملاً نقطياً في المنتصف أو الطرف الحر، أو حملاً موزعاً على كامل البحر. أدخل طول البحر والحمل ومعامل المرونة وعزم المساحة الثاني. تستخدم الحاسبة معادلات الانحراف الصغير التقليدية وتعرض أكبر انحراف وموقعه.',
    privacyQuestion: 'هل تُرفع بيانات العارضة؟', privacyAnswer: 'لا. يجري الحساب والرسم في هذا المتصفح، ولا ترفع الأداة قيمك أو تحفظها.',
    fields: { ...copy.fields, support: 'نوع الارتكاز', simplySupported: 'عارضة بسيطة الارتكاز عند الطرفين', cantilever: 'عارضة كابولية مثبتة من طرف واحد', loadCase: 'نوع الحمل', pointLoad: 'حمل نقطي في المنتصف أو الطرف الحر', uniformLoad: 'حمل موزع بانتظام على كامل البحر', span: 'طول البحر', lengthUnit: 'وحدة الطول', meters: 'متر (m)', centimeters: 'سنتيمتر (cm)', millimeters: 'ملليمتر (mm)', inches: 'بوصة (in)', feet: 'قدم (ft)', load: 'الحمل المطبق', forceUnit: 'وحدة القوة', newtons: 'نيوتن (N)', kilonewtons: 'كيلو نيوتن (kN)', poundsForce: 'رطل-قوة (lbf)', modulus: 'معامل المرونة (E)', modulusUnit: 'وحدة معامل المرونة', pascals: 'باسكال (Pa)', megapascals: 'ميغاباسكال (MPa)', gigapascals: 'غيغاباسكال (GPa)', psi: 'رطل لكل بوصة مربعة (psi)', ksi: 'كيلو رطل لكل بوصة مربعة (ksi)', inertia: 'عزم المساحة الثاني (I)', inertiaUnit: 'وحدة عزم المساحة I', loadUnitHint: 'للحمل النقطي، أدخل القوة. للحمل الموزع، أدخل القوة لكل وحدة طول مختارة.', accuracyNote: 'تقدير وفق نظرية أويلر-بيرنولي: عارضة مستقيمة ومنتظمة، وثبات E وI، ومرونة خطية وانحراف صغير. يشمل فقط حالات الارتكاز والأحمال المذكورة. لا يشمل تشوه القص أو الوزن الذاتي أو أحمالاً أخرى أو الاستقرار أو الوصلات أو فحوصات الأكواد. للاستخدام التعليمي فقط، وليس لاختيار عارضة حقيقية أو اعتمادها. استشر مهندساً إنشائياً مؤهلاً.', sourceNote: 'اقرأ ملاحظات جامعة إلينوي حول انحراف العوارض وافتراضاتها.' },
    actions: { ...copy.actions, calculate: 'احسب الانحراف', reset: 'إعادة الضبط', copy: 'انسخ النتائج', example: 'حمّل مثالاً', result: 'تقدير العارضة' },
    messages: { ...copy.messages, calculated: 'اكتمل تقدير العارضة.', checkInputs: 'تحقق من القيم والوحدات.', exampleLoaded: 'اكتمل حساب المثال.', maxDeflection: 'أكبر انحراف', location: 'موضع أكبر انحراف', maxMoment: 'أكبر عزم انحناء', flexuralRigidity: 'صلابة الانحناء E·I', curveLabel: 'منحنى انحراف العارضة التقديري', simplySupported: 'بسيطة الارتكاز', cantilever: 'كابولية', pointLoad: 'حمل نقطي', uniformLoad: 'حمل موزع بانتظام' },
    additionalFaqs: [
      { question: 'ما حالات العوارض التي تشملها الحاسبة؟', answer: 'تشمل عارضة بسيطة الارتكاز أو عارضة كابولية، مع حمل نقطي في المنتصف أو الطرف الحر، أو حمل موزع بانتظام على كامل البحر. لا تشمل ارتكازات أخرى أو أحمالاً خارج المنتصف أو أحمالاً متعددة أو مقاطع متغيرة.' },
      { question: 'ما عزم المساحة الثاني؟', answer: 'يصف عزم المساحة الثاني I توزيع مساحة المقطع حول محور الانحناء؛ وهو ليس عزم القصور الذاتي للكتلة. استخدم قيمة المحور الصحيح ووحدات متوافقة.' },
      { question: 'هل تصلح النتيجة لاعتماد عارضة حقيقية؟', answer: 'لا. هذا تقدير تعليمي ولا يتضمن فحوص القص أو المقاومة أو الاستقرار أو الوصلات أو تراكيب الأحمال أو الأكواد المحلية. يجب أن يراجع مهندس إنشائي مؤهل التصميم الحقيقي.' },
    ],
  });
  return copy;
}

const rows = collect(source);
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function checkpoint() {
  await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
}
copies.en = normalize({ ...structuredClone(source), localizationStatus: 'approved' });
await checkpoint();
for (const locale of Object.keys(locales)) {
  if (locale === 'en') continue;
  if (copies[locale]?.intro && copies[locale].intro !== source.intro) {
    copies[locale] = normalize(improve(structuredClone(copies[locale]), locale));
    await checkpoint(); console.log(`${locale}: retained existing draft`); continue;
  }
  const copy = structuredClone(source);
  const groups = []; let group = []; let length = 0;
  for (const row of rows) {
    const item = row;
    const size = [...item.source].length + 24;
    if (group.length && length + size > 2_700) { groups.push(group); group = []; length = 0; }
    group.push(item); length += size;
  }
  if (group.length) groups.push(group);
  for (const batch of groups) {
    const translated = await translateBatch(locale, batch);
    batch.forEach((row, index) => setAtPath(copy, row.path, translated[index] || row.source));
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  copies[locale] = normalize(improve(copy, locale));
  await checkpoint();
  console.log(`${locale}: ${rows.length} strings translated`);
}

for (const locale of Object.keys(locales)) {
  const copy = copies[locale];
  if (!copy || copy.copyLanguage !== locale || copy.additionalFaqs?.length !== 3 || [...copy.title].length > 60 || [...copy.description].length > 160) throw new Error(`Incomplete localized copy for ${locale}.`);
}
await checkpoint();
console.log(`Wrote ${Object.keys(copies).length} static locale copies to ${target.pathname}`);
