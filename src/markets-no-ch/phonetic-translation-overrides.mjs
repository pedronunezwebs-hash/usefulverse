import { english } from './copy-en.mjs';

const en = english.phonetic;

export const phoneticTranslationOverrides = Object.freeze({
  es: Object.freeze({
    [en.name]: 'Convertidor del alfabeto fonético',
    [en.title]: 'Alfabeto fonético OTAN/ICAO · conversor A–Z',
  }),
  ar: Object.freeze({
    [en.name]: 'محول الأبجدية الصوتية',
    [en.title]: 'محول الأبجدية الصوتية · تهجئة واضحة وفق أبجدية الناتو',
    [en.description]: 'حوّل النص إلى كلمات الأبجدية الصوتية لحلف الناتو والعودة منها. يشمل كلمات نطق الأرقام وعلامات الترقيم، مع تدريب اختياري. تبقى المعالجة في متصفحك.',
    [en.intro]: 'اكتب الرسائل بوضوح باستخدام أبجدية الناتو/منظمة الطيران المدني الدولي الصوتية، أو حوّل الكلمات الصوتية المعروفة إلى نص. تبقى المعالجة على هذا الجهاز.',
  }),
});
