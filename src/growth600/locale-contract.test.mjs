import assert from 'node:assert/strict';
import test from 'node:test';
import { assertGrowthLocaleCoverage } from './locale-contract.mjs';
import { growthPilotTools } from './catalog.mjs';
import englishGrowthCopy from './locales/en.mjs';
import frenchGrowthCopy from './locales/fr.mjs';
import portugueseGrowthCopy from './locales/pt.mjs';
import germanGrowthCopy from './locales/de.mjs';
import japaneseGrowthCopy from './locales/ja.mjs';
import koreanGrowthCopy from './locales/ko.mjs';
import indonesianGrowthCopy from './locales/id.mjs';
import hindiGrowthCopy from './locales/hi.mjs';
import arabicGrowthCopy from './locales/ar.mjs';
import spanishGrowthCopy from './locales/es.mjs';
import simplifiedChineseGrowthCopy from './locales/zh.mjs';
import bengaliGrowthCopy from './locales/bn.mjs';
import russianGrowthCopy from './locales/ru.mjs';
import urduGrowthCopy from './locales/ur.mjs';
import turkishGrowthCopy from './locales/tr.mjs';
import vietnameseGrowthCopy from './locales/vi.mjs';
import italianGrowthCopy from './locales/it.mjs';
import traditionalChineseGrowthCopy from './locales/zh_tw.mjs';

const tools = [{ id: 'one' }, { id: 'two' }];
const locales = [{ key: 'en' }, { key: 'es' }];
const sampleHome = (language) => ({ title: `${language} tools | UsefulVerse`, description: 'Free browser tools.', intro: 'Simple tools.', directoryLabel: 'Tools', freeLabel: 'Free', footerFree: 'Free tools.', skipToTool: 'Skip', home: 'Home', languageLabel: 'Language', breadcrumbLabel: 'Breadcrumb', faqLabel: 'FAQ', copyLanguage: language });
const sample = (name) => ({ name, title: `${name} free | UsefulVerse`, description: `${name} works in your browser.`, intro: `${name} intro`, howQuestion: 'How?', howAnswer: 'Use it.', privacyQuestion: 'Private?', privacyAnswer: 'Local.', copyLanguage: name, });

test('growth release gate demands separate copy for every tool and every published language', () => {
  assert.equal(assertGrowthLocaleCoverage(tools, locales, { en: { _home: sampleHome('en'), one: sample('en'), two: sample('en') }, es: { _home: sampleHome('es'), one: sample('es'), two: sample('es') } }), true);
  assert.throws(() => assertGrowthLocaleCoverage(tools, locales, { en: { _home: sampleHome('en'), one: sample('en'), two: sample('en') } }), /es: locale copy is missing/);
  assert.throws(() => assertGrowthLocaleCoverage(tools, locales, { en: { _home: sampleHome('en'), one: sample('en'), two: sample('en') }, es: { _home: sampleHome('es'), one: sample('es') } }), /es\/two: translation is missing/);
});

test('growth release gate enforces metadata limits and language-specific copy', () => {
  const overlong = { ...sample('en'), title: `${'x'.repeat(61)} | UsefulVerse` };
  assert.throws(() => assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'en' }], { en: { _home: sampleHome('en'), one: overlong } }), /title is .*max 60/);
  assert.throws(() => assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'en' }], { en: { _home: sampleHome('en'), one: { ...sample('es'), copyLanguage: 'es' } } }), /copy language does not match/);
});

test('the first real English pilot copy satisfies every field, message, placeholder and title budget', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.ok(Object.values(englishGrowthCopy).every((copy) => copy.title.length <= 60));
});

test('the first Google Translate Spanish draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'es' }], { es: spanishGrowthCopy }), true);
  assert.ok(Object.values(spanishGrowthCopy).every((copy) => copy.copyLanguage === 'es'));
  assert.ok(Object.values(spanishGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
});

test('the first Google Translate French draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'fr' }], { fr: frenchGrowthCopy }), true);
  assert.ok(Object.values(frenchGrowthCopy).every((copy) => copy.copyLanguage === 'fr'));
  assert.ok(Object.values(frenchGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
});

test('the first Google Translate Portuguese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'pt' }], { pt: portugueseGrowthCopy }), true);
  assert.ok(Object.values(portugueseGrowthCopy).every((copy) => copy.copyLanguage === 'pt'));
  assert.ok(Object.values(portugueseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(portugueseGrowthCopy['auto-loan-refinance-calculator'].name, 'Calculadora de refinanciamento de carro');
  assert.equal(portugueseGrowthCopy.mancala.messages.pit, 'Casa');
});

test('the first Google Translate German draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'de' }], { de: germanGrowthCopy }), true);
  assert.ok(Object.values(germanGrowthCopy).every((copy) => copy.copyLanguage === 'de'));
  assert.ok(Object.values(germanGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(germanGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} Monate');
  assert.equal(germanGrowthCopy.mancala.messages.turn, '{player} ist am Zug.');
});

test('the first Google Translate Japanese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ja' }], { ja: japaneseGrowthCopy }), true);
  assert.ok(Object.values(japaneseGrowthCopy).every((copy) => copy.copyLanguage === 'ja'));
  assert.ok(Object.values(japaneseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(japaneseGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver}が{recipient}にプレゼントを贈ります。');
  assert.equal(japaneseGrowthCopy.mancala.messages.turn, '{player}の番です。');
});

test('the first Google Translate Korean draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ko' }], { ko: koreanGrowthCopy }), true);
  assert.ok(Object.values(koreanGrowthCopy).every((copy) => copy.copyLanguage === 'ko'));
  assert.ok(Object.values(koreanGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(koreanGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count}개월');
  assert.equal(koreanGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} 님이 {recipient} 님에게 선물을 줍니다.');
  assert.equal(koreanGrowthCopy.mancala.messages.turn, '{player} 차례입니다.');
});

test('the first Google Translate Indonesian draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'id' }], { id: indonesianGrowthCopy }), true);
  assert.ok(Object.values(indonesianGrowthCopy).every((copy) => copy.copyLanguage === 'id'));
  assert.ok(Object.values(indonesianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(indonesianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} bulan');
  assert.equal(indonesianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} memberikan hadiah kepada {recipient}.');
  assert.equal(indonesianGrowthCopy.mancala.messages.turn, 'Giliran {player} bermain.');
});

test('the first Google Translate Hindi draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'hi' }], { hi: hindiGrowthCopy }), true);
  assert.ok(Object.values(hindiGrowthCopy).every((copy) => copy.copyLanguage === 'hi'));
  assert.ok(Object.values(hindiGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(hindiGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} महीने');
  assert.equal(hindiGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} ने {recipient} को उपहार दिया।');
  assert.equal(hindiGrowthCopy.mancala.messages.turn, '{player} की चाल।');
});

test('the first Google Translate Arabic draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ar' }], { ar: arabicGrowthCopy }), true);
  assert.ok(Object.values(arabicGrowthCopy).every((copy) => copy.copyLanguage === 'ar'));
  assert.ok(Object.values(arabicGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(arabicGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} شهراً');
  assert.equal(arabicGrowthCopy['secret-santa-generator'].messages.privatePair, 'يقدم {giver} هدية إلى {recipient}.');
  assert.equal(arabicGrowthCopy.mancala.messages.turn, 'دور {player}.');
});

test('the first Google Translate simplified Chinese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'zh' }], { zh: simplifiedChineseGrowthCopy }), true);
  assert.ok(Object.values(simplifiedChineseGrowthCopy).every((copy) => copy.copyLanguage === 'zh'));
  assert.ok(Object.values(simplifiedChineseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(simplifiedChineseGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} 个月');
  assert.equal(simplifiedChineseGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} 赠送礼物给 {recipient}。');
  assert.equal(simplifiedChineseGrowthCopy.mancala.messages.turn, '轮到 {player} 走棋。');
  assert.equal(simplifiedChineseGrowthCopy['gravel-calculator'].actions.generate, '开始抽签');
});

test('the first Google Translate Bengali draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'bn' }], { bn: bengaliGrowthCopy }), true);
  assert.ok(Object.values(bengaliGrowthCopy).every((copy) => copy.copyLanguage === 'bn'));
  assert.ok(Object.values(bengaliGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(bengaliGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} মাস');
  assert.equal(bengaliGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} {recipient}-কে উপহার দিচ্ছেন।');
  assert.equal(bengaliGrowthCopy.mancala.messages.turn, '{player}-এর চাল।');
});

test('the first Google Translate Russian draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ru' }], { ru: russianGrowthCopy }), true);
  assert.ok(Object.values(russianGrowthCopy).every((copy) => copy.copyLanguage === 'ru'));
  assert.ok(Object.values(russianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(russianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} мес.');
  assert.equal(russianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} дарит подарок {recipient}.');
  assert.equal(russianGrowthCopy.mancala.messages.turn, 'Ход игрока {player}.');
});

test('the first Google Translate Urdu draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ur' }], { ur: urduGrowthCopy }), true);
  assert.ok(Object.values(urduGrowthCopy).every((copy) => copy.copyLanguage === 'ur'));
  assert.ok(Object.values(urduGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(urduGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} مہینے');
  assert.equal(urduGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver}، {recipient} کو تحفہ دیتا ہے۔');
  assert.equal(urduGrowthCopy.mancala.messages.turn, '{player} کی باری ہے۔');
});

test('the first Turkish draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'tr' }], { tr: turkishGrowthCopy }), true);
  assert.ok(Object.values(turkishGrowthCopy).every((copy) => copy.copyLanguage === 'tr'));
  assert.ok(Object.values(turkishGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(turkishGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} ay');
  assert.equal(turkishGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver}, {recipient} kişisine hediye veriyor.');
  assert.equal(turkishGrowthCopy.mancala.messages.turn, 'Sıra {player} oyuncusunda.');
});

test('the first Vietnamese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'vi' }], { vi: vietnameseGrowthCopy }), true);
  assert.ok(Object.values(vietnameseGrowthCopy).every((copy) => copy.copyLanguage === 'vi'));
  assert.ok(Object.values(vietnameseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(vietnameseGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} tháng');
  assert.equal(vietnameseGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} tặng quà cho {recipient}.');
  assert.equal(vietnameseGrowthCopy.mancala.messages.turn, 'Đến lượt {player}.');
  assert.equal(vietnameseGrowthCopy['secret-santa-generator'].title.length <= 60, true);
});

test('the first Italian draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'it' }], { it: italianGrowthCopy }), true);
  assert.ok(Object.values(italianGrowthCopy).every((copy) => copy.copyLanguage === 'it'));
  assert.ok(Object.values(italianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(italianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} mesi');
  assert.equal(italianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} fa un regalo a {recipient}.');
  assert.equal(italianGrowthCopy.mancala.messages.turn, 'Tocca a {player}.');
});

test('the first Traditional Chinese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'zh_tw' }], { zh_tw: traditionalChineseGrowthCopy }), true);
  assert.ok(Object.values(traditionalChineseGrowthCopy).every((copy) => copy.copyLanguage === 'zh_tw'));
  assert.ok(Object.values(traditionalChineseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(traditionalChineseGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} 個月');
  assert.equal(traditionalChineseGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} 送禮給 {recipient}。');
  assert.equal(traditionalChineseGrowthCopy.mancala.messages.turn, '輪到玩家 {player}。');
});
