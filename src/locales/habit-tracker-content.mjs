import { habitTrackerEnglishCopy, habitTrackerUiKeys } from './habit-tracker-source.mjs';
import { habitTrackerLocaleData } from './habit-tracker.mjs';

const corrections = {
  pt: { ui: { 'Current streak': 'Sequência atual', 'Best streak': 'Maior sequência', 'Check-in removed.': 'Registro do dia removido.', 'Today’s check-in': 'Registro de hoje' } },
  de: { ui: { 'Current streak': 'Aktuelle Serie', 'Best streak': 'Längste Serie' }, copy: { 0: 'Kostenloser Gewohnheitstracker', 1: 'Gewohnheitstracker' } },
  id: { ui: { 'Current streak': 'Rangkaian hari saat ini', 'Best streak': 'Rangkaian hari terpanjang', 'Check-in removed.': 'Catatan hari ini dihapus.', 'Today’s check-in': 'Catatan hari ini' } },
  ar: { ui: { 'Current streak': 'سلسلة الأيام المتتالية الحالية', 'Best streak': 'أطول سلسلة أيام متتالية' } },
  zh: { ui: { 'Current streak': '当前连续打卡天数', 'Best streak': '最长连续打卡天数' } },
  zh_tw: { ui: { 'Current streak': '目前連續打卡天數', 'Best streak': '最長連續打卡天數' } },
  it: { ui: { 'Current streak': 'Serie attuale', 'Best streak': 'Serie più lunga', 'Check-in removed.': 'Registrazione di oggi rimossa.', 'Today’s check-in': 'Registrazione di oggi' } },
  uk: { ui: { 'Current streak': 'Поточна серія днів', 'Best streak': 'Найдовша серія днів' } },
  vi: { ui: { 'Today’s check-in': 'Ghi nhận hôm nay' } },
  bn: { ui: { 'Current streak': 'বর্তমান ধারাবাহিক দিন', 'Best streak': 'দীর্ঘতম ধারাবাহিক দিন' }, copy: { 0: 'বিনামূল্যের অভ্যাস ট্র্যাকার', 1: 'অভ্যাস ট্র্যাকার' } },
  ur: { ui: { 'Current streak': 'مسلسل موجودہ دن', 'Best streak': 'سب سے زیادہ مسلسل دن' }, copy: { 0: 'مفت عادت ٹریکر', 1: 'عادت ٹریکر' } },
  hi: { ui: { 'Current streak': 'लगातार दिनों की वर्तमान संख्या', 'Best streak': 'लगातार दिनों की सबसे लंबी संख्या' } },
  ms: { ui: { 'Current streak': 'Hari berturut-turut semasa', 'Best streak': 'Hari berturut-turut paling lama' } },
  sv: { ui: { 'Current streak': 'Nuvarande följd', 'Best streak': 'Längsta följd', 'Habit added.': 'Vanen har lagts till.' }, copy: { 0: 'Gratis vanespårare', 1: 'Vanespårare' } },
  th: { ui: { 'Current streak': 'จำนวนวันที่ทำต่อเนื่อง', 'Best streak': 'จำนวนวันที่ทำต่อเนื่องสูงสุด', 'Habit removed from this page. Save to keep the change.': 'ลบนิสัยออกจากหน้านี้แล้ว บันทึกเพื่อเก็บการเปลี่ยนแปลง' } },
  sw: { ui: { 'Current streak': 'Siku za sasa mfululizo', 'Best streak': 'Siku nyingi zaidi mfululizo', 'Habit removed from this page. Save to keep the change.': 'Tabia imeondolewa kwenye ukurasa huu. Hifadhi ili kuweka mabadiliko.' }, copy: { 0: 'Kifuatiliaji cha tabia bila malipo', 1: 'Kifuatiliaji cha tabia' } },
  mr: { ui: { 'Current streak': 'सध्याचे सलग दिवस', 'Best streak': 'सर्वाधिक सलग दिवस' } },
  te: { ui: { 'Current streak': 'ప్రస్తుత వరుస రోజులు', 'Best streak': 'అత్యధిక వరుస రోజులు' }, copy: { 0: 'ఉచిత అలవాట్ల ట్రాకర్', 1: 'అలవాట్ల ట్రాకర్' } },
  ta: { ui: { 'Current streak': 'தற்போதைய தொடர்ச்சியான நாட்கள்', 'Best streak': 'அதிகபட்ச தொடர்ச்சியான நாட்கள்' }, copy: { 0: 'இலவச பழக்கக் கண்காணிப்பான்', 1: 'பழக்கக் கண்காணிப்பான்' } },
  fa: { ui: { 'Current streak': 'روزهای متوالی فعلی', 'Best streak': 'بیشترین روزهای متوالی' } },
  gu: { ui: { 'Current streak': 'હાલના સતત દિવસો', 'Best streak': 'સૌથી વધુ સતત દિવસો' }, copy: { 1: 'આદત ટ્રેકર' } },
  tl: { ui: { 'Current streak': 'Kasalukuyang sunod-sunod na araw', 'Best streak': 'Pinakamaraming sunod-sunod na araw', 'Habit added.': 'Naidagdag ang ugali.' }, copy: { 0: 'Libreng tagasubaybay ng ugali', 1: 'Tagasubaybay ng ugali' } },
  ha: {
    ui: {
      'Habit name': 'Sunan al’ada', 'Habit added.': 'An ƙara al’ada.',
      'Days completed in the last 30': 'Kwanakin da aka kammala a cikin kwanaki 30 da suka gabata',
      'Habit removed from this page. Save to keep the change.': 'An cire al’ada daga wannan shafin. Ajiye domin kiyaye canjin.',
      'Check-in removed.': 'An cire alamar kammalawa.',
      'Habit names must be 80 characters or fewer.': 'Dole ne sunayen al’ada su kasance haruffa 80 ko ƙasa da haka.',
      'Habit names must be unique.': 'Dole ne sunayen al’ada su bambanta.',
      'Current streak': 'Kwanakin da aka yi a jere yanzu', 'Best streak': 'Mafi yawan kwanaki a jere',
    },
    copy: {
      0: 'Mai bin diddigin al’ada kyauta', 1: 'Mai bin diddigin al’ada',
      2: 'Bibiyi al’adun yau da kullum da wannan kayan aiki na kyauta da ke kiyaye sirrinka. Yi wa kwanaki 35 da suka wuce alama, duba kwanakin da ka yi a jere, sannan ka ajiye ko fitar da madadin a na’urarka.',
      3: 'mai bin diddigin al’ada kyauta, bin al’adun yau da kullum, kalandar al’ada, bin kwanakin al’ada a jere',
      4: 'Ƙara al’ada ta yau da kullum, sannan ka yi wa kowace rana da ka cika alama. Duba kalandarka ta baya-bayan nan da jerin kwanakin da ka kammala.',
      5: 'Jerin al’adunka yana cikin wannan burauzar sai ka zaɓi ajiyewa ko sauke madadi. Babu asusu ko daidaitawa. Na’urarka na iya share bayanan burauza; sauke kwafi idan kana son adana su.',
    },
  },
  am: { ui: { 'Days completed in the last 30': 'ባለፉት 30 ቀናት የተጠናቀቁ ቀናት' } },
  ca: { ui: { 'Habit removed from this page. Save to keep the change.': 'Hàbit eliminat d’aquesta pàgina. Desa’l per conservar el canvi.' } },
};

export function habitTrackerContent(language) {
  if (language === 'en') return {
    ui: Object.fromEntries(habitTrackerUiKeys.map((key) => [key, key])),
    copy: habitTrackerEnglishCopy,
  };
  const data = habitTrackerLocaleData[language];
  if (!data || habitTrackerUiKeys.some((key) => !data.ui?.[key]) || data.copy?.length !== habitTrackerEnglishCopy.length) {
    throw new Error(`Habit tracker translations are incomplete for ${language}.`);
  }
  const correction = corrections[language];
  const copy = [...data.copy];
  for (const [index, value] of Object.entries(correction?.copy ?? {})) copy[Number(index)] = value;
  return { ui: { ...data.ui, ...correction?.ui }, copy };
}
