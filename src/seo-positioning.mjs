const positioning = {
  en: ['Free · no limits', 'Free to use with no usage cap.'],
  es: ['Gratis · sin límites', 'Gratis y sin límite de usos.'],
  fr: ['Gratuit · sans limite', 'Gratuit, sans limite d’utilisation.'],
  pt: ['Grátis · sem limites', 'Grátis, sem limite de uso.'],
  de: ['Gratis · ohne Limit', 'Kostenlos und ohne Nutzungslimit.'],
  ja: ['無料・利用制限なし', '無料で、利用回数に制限はありません。'],
  ko: ['무료 · 사용 제한 없음', '무료이며 사용 횟수 제한이 없습니다.'],
  id: ['Gratis · tanpa batas', 'Gratis tanpa batas penggunaan.'],
  hi: ['मुफ़्त · कोई सीमा नहीं', 'मुफ़्त और उपयोग की कोई सीमा नहीं।'],
  ar: ['مجاني · بلا حدود', 'مجاني، بلا حدّ للاستخدام.'],
  zh: ['免费 · 不限使用', '免费使用，没有次数限制。'],
  bn: ['বিনামূল্যে · সীমাহীন', 'বিনামূল্যে ব্যবহার করুন, ব্যবহারের কোনো সীমা নেই।'],
  ru: ['Бесплатно · без лимитов', 'Бесплатно, без ограничений по числу использований.'],
  ur: ['مفت · کوئی حد نہیں', 'مفت، استعمال کی کوئی حد نہیں۔'],
  tr: ['Ücretsiz · sınırsız', 'Ücretsizdir ve kullanım sayısı sınırlı değildir.'],
  vi: ['Miễn phí · không giới hạn', 'Miễn phí, không giới hạn số lần sử dụng.'],
  it: ['Gratis · senza limiti', 'Gratis, senza limiti di utilizzo.'],
  zh_tw: ['免費 · 不限使用', '免費使用，沒有次數限制。'],
  bg: ['Безплатно · без лимит', 'Безплатно, без ограничение на броя използвания.'],
  ca: ['Gratis · sense límits', 'Gratis i sense límit d’ús.'],
  nl: ['Gratis · zonder limiet', 'Gratis, zonder limiet op het gebruik.'],
  el: ['Δωρεάν · χωρίς όρια', 'Δωρεάν, χωρίς όριο στον αριθμό χρήσεων.'],
  ms: ['Percuma · tanpa had', 'Percuma tanpa had penggunaan.'],
  pl: ['Bezpłatnie · bez limitu', 'Bezpłatnie, bez limitu użyć.'],
  sv: ['Gratis · utan gräns', 'Gratis utan begränsning av antal användningar.'],
  th: ['ฟรี · ไม่จำกัด', 'ใช้ฟรีโดยไม่จำกัดจำนวนครั้ง'],
  uk: ['Безкоштовно · без лімітів', 'Безкоштовно, без обмежень на кількість використань.'],
  sw: ['Bure · bila kikomo', 'Bure kutumia, bila kikomo cha matumizi.'],
  mr: ['मोफत · कोणतीही मर्यादा नाही', 'मोफत, वापर मर्यादा नाही.'],
  te: ['ఉచితం · పరిమితులు లేవు', 'ఉచితం, వినియోగ పరిమితి లేదు.'],
  ha: ['Kyauta · babu iyaka', 'Kyauta ne, babu iyakar amfani.'],
  tl: ['Libre · walang limitasyon', 'Libre gamitin, walang limitasyon sa paggamit.'],
  ta: ['இலவசம் · வரம்புகள் இல்லை', 'இலவசம், பயன்பாட்டு வரம்பு இல்லை.'],
  fa: ['رایگان · بدون محدودیت', 'رایگان، بدون محدودیت استفاده.'],
  am: ['ነፃ · ገደብ የለም', 'ነፃ ነው፣ የአጠቃቀም ገደብ የለም።'],
  gu: ['મફત · કોઈ મર્યાદા નથી', 'મફત, ઉપયોગની કોઈ મર્યાદા નથી.'],
};

const brandSuffix = ' | UsefulVerse';
const shorten = (value, limit) => {
  const text = String(value ?? '').trim().replace(/\s+/gu, ' ');
  if (text.length <= limit) return text;
  const prefix = text.slice(0, limit);
  const boundary = prefix.lastIndexOf(' ');
  return `${prefix.slice(0, boundary > limit * 0.6 ? boundary : limit - 1).replace(/[\s,;:—–-]+$/u, '')}…`;
};

export function positionSeoMetadata(metadata, language = 'en', { titleLimit = 65 } = {}) {
  const [fullTitle, compactDescription] = positioning[language] ?? positioning.en;
  const inputTitle = String(metadata.title ?? '').trim();
  const title = inputTitle
    .replace(/\s*\|\s*UsefulVerse$/u, '')
    .replace(/^UsefulVerse\s*[—–-]\s*/u, '')
    .trim();
  const description = String(metadata.description ?? '').trim();

  // Keep the search intent at the beginning. Add the free/no-usage-cap claim only
  // when the complete title still fits the project's 65-character release gate.
  const candidateTitle = `${title} — ${fullTitle}${brandSuffix}`;
  const compactTitle = `${title} — ${language === 'en' ? 'Free' : fullTitle.split(/[·,]/u)[0].trim()}${brandSuffix}`;
  const boundedTitle = candidateTitle.length <= titleLimit
    ? candidateTitle
    : compactTitle.length <= titleLimit
      ? compactTitle
      : `${title}${brandSuffix}`.length <= titleLimit
        ? `${title}${brandSuffix}`
        : `${shorten(title, Math.min(49, titleLimit - brandSuffix.length))}${brandSuffix}`;

  // Don't cut useful query-specific copy just to force a slogan into every snippet.
  const candidateDescription = `${description.replace(/[.。！？!？\s]+$/u, '')}. ${compactDescription}`;
  const finalDescription = candidateDescription.length <= 155 ? candidateDescription : shorten(description, 155);
  return { ...metadata, title: boundedTitle, description: finalDescription };
}

export const supportedPositioningLocales = Object.keys(positioning);
