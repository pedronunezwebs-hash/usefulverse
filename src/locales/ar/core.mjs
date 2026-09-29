// العربية الفصحى الحديثة. Keys are the English source strings; only values are localized.
export const meta = {
  code: 'ar', name: 'العربية', prefix: '/ar', tag: 'ar', direction: 'rtl',
  homeTitle: 'أدوات مجانية للنصوص والبيانات والحسابات | UsefulVerse',
  homeDescription: 'أدوات سريعة ومجانية للنصوص والبيانات والحسابات اليومية. تعمل في متصفحك، بلا حساب وبلا رفع ملفات.',
  homeLabel: 'الرئيسية', homeMarker: 'الأدوات', keepEnglish: ['JSON Web Token', 'UTC', 'UUID', 'SHA-256', 'Base64', 'HEX', 'RGB', 'HSL', 'HTML', 'CSV', 'SEO', 'name,age\nAda,36\nLinus,55', '\\bUseful\\w*\\b', 'https://example.com/search?q=useful&lang=en'],
  runtime: { textNumberInputs: true, wordSegmentation: true, numberingSystem: 'arab', readingRate: 180, longDates: true, timeZones: { from: 'Asia/Riyadh', to: 'America/New_York' } },
};

export const page = {
  faqHow: 'كيف أستخدم {name}؟', privacyQuestion: 'هل تُرسل بياناتي إلى خادم؟',
  privacyAnswer: 'لا. تتم المعالجة في متصفحك ولا تُرفع بياناتك.', about: 'حول {title}.',
  madeSimple: '{title} ببساطة.', categoryTool: 'أداة {category}', workspace: 'مساحة عمل {title}',
};

export const templates = {
  'reading.minutes': '{count} د',
  summary: 'الكلمات: {words}\nالأحرف: {characters}\nالأحرف بلا مسافات: {noSpaces}\nالأسطر: {lines}\nوقت القراءة: {reading} د',
  'dedupe.kept': { other: 'تم الاحتفاظ بـ {count} سطر فريد.' },
  'percent.of': '{percent}% من {base} = {result}', 'percent.share': '{part} تساوي {result}% من {whole}',
  'percent.change': 'التغير من {from} إلى {to} = {change}%',
  'rows.converted': { other: 'تم تحويل {count} صف.' }, 'uuid.generated': { other: 'تم إنشاء {count} معرّف UUID محليًا.' },
  'regex.matches': { other: 'تم العثور على {count} تطابق.' },
  'duration.exact': '{days} يوم · {hours} س · {minutes} د · {seconds} ث',
  'diff.found': { other: 'تم العثور على اختلاف في {count} سطر.' }, 'diff.line': 'السطر {line}:',
  'diff.empty': '(فارغ)', 'date.days': { other: '{count} يوم' }, 'url.none': '(لا شيء)',
  'timestamp.local': 'الوقت المحلي: {value}', 'timestamp.seconds': 'الثواني: {value}', 'timestamp.milliseconds': 'المللي ثانية: {value}',
};

export const ui = Object.fromEntries([
  ['UsefulVerse home','الصفحة الرئيسية لـ UsefulVerse'],['Main navigation','التنقل الرئيسي'],['Tools','الأدوات'],['How it works','طريقة العمل'],['Find a tool','ابحث عن أداة'],['Language','اللغة'],
  ['A useful place on the internet','مكان مفيد على الإنترنت'],['Do the small things','أنجز المهام الصغيرة'],['faster.','بسرعة أكبر.'],
  ['Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.','أدوات بسيطة في المتصفح للنصوص والبيانات والمهام اليومية. بلا حساب أو رفع ملفات؛ افتح الأداة وأنجز المهمة.'],
  ['Explore tools','استكشف الأدوات'],['UsefulVerse principles','مبادئ UsefulVerse'],['Fast by default','سريعة من البداية'],['Private by design','الخصوصية أساس التصميم'],['Free to use','مجانية الاستخدام'],
  ['The toolbox','صندوق الأدوات'],['Find the right tool.','اعثر على الأداة المناسبة.'],['Search tools','ابحث في الأدوات'],['Tool categories','فئات الأدوات'],['All','الكل'],
  ['Writing','الكتابة'],['Text','النصوص'],['Developer','للمطورين'],['SEO','تحسين محركات البحث'],['Everyday','للاستخدام اليومي'],['Privacy','الخصوصية'],['Data','البيانات'],['Design','التصميم'],
  ['Open tool','افتح الأداة'],['No tools match that search yet. Try another word.','لا توجد أداة تطابق بحثك. جرّب كلمة أخرى.'],['Why UsefulVerse','لماذا UsefulVerse؟'],
  ['Small tools.','أدوات صغيرة.'],['Clear answers.','إجابات واضحة.'],['Open a tool','افتح أداة'],['Each tool has one clear job. You can start in seconds.','لكل أداة مهمة واحدة واضحة. ابدأ خلال ثوانٍ.'],
  ['Work privately','اعمل بخصوصية'],['Your text stays in your browser for browser-first tools.','في الأدوات التي تعمل محليًا، يبقى نصك في متصفحك.'],['Take the result','احصل على النتيجة'],['Copy it or use it where you need it next.','انسخها أو استخدمها حيث تحتاج إليها.'],
  ['Simple tools that respect your time and your files.','أدوات بسيطة تحترم وقتك وملفاتك.'],['All tools','كل الأدوات'],['Privacy first','الخصوصية أولًا'],['Breadcrumb','مسار التنقل'],['Runs in your browser. No upload.','تعمل في متصفحك. لا يتم رفع أي شيء.'],
  ['Clear','مسح'],['About this tool','حول هذه الأداة'],['Common questions','أسئلة شائعة'],['Keep going','تابع الاستكشاف'],['More useful tools','أدوات مفيدة أخرى'],['Browse all tools','تصفح كل الأدوات'],
  ['Result','النتيجة'],['Copy result','نسخ النتيجة'],['Whole number','عدد صحيح'],['From','من'],['Minimum','الحد الأدنى'],['Maximum','الحد الأقصى'],
]);

export const runtimeMessages = {
  'There is nothing to copy yet.':'لا يوجد شيء لنسخه بعد.','Copied to your clipboard.':'تم النسخ إلى الحافظة.','Copy was blocked. Select the result and copy it manually.':'تعذّر النسخ. حدّد النتيجة وانسخها يدويًا.',
  'Choose a valid date and time.':'اختر تاريخًا ووقتًا صحيحين.','Number converted locally.':'تم تحويل العدد في متصفحك.',
};
export const toolUi = { 'percentage-calculator': { 'Whole number':'العدد الكامل' } };
