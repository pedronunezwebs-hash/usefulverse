import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { marketTools } from '../../src/markets-no-ch/catalog.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { swissWheelOffsetEnglish } from '../../src/markets-no-ch/swiss-wheel-offset-copy-en.mjs';
import { petAgeEnglish } from '../../src/markets-no-ch/pet-age-copy-en.mjs';
import { swissUidEnglish } from '../../src/markets-no-ch/swiss-uid-copy-en.mjs';
import { swissCoordinateEnglish } from '../../src/markets-no-ch/swiss-coordinate-copy-en.mjs';
import { norwayCompanyCarEnglish } from '../../src/markets-no-ch/norway-company-car-copy-en.mjs';
import { norwayEmployerCostEnglish } from '../../src/markets-no-ch/norway-employer-cost-copy-en.mjs';
import { frequencyToneEnglish } from '../../src/markets-no-ch/frequency-tone-generator-copy-en.mjs';
import { pinballEnglish } from '../../src/markets-no-ch/pinball-copy-en.mjs';
import { amerikanerCardGameEnglish } from '../../src/markets-no-ch/amerikaner-card-game-copy-en.mjs';
import { presidentCardGameEnglish } from '../../src/markets-no-ch/president-card-game-copy-en.mjs';
import { geographyQuizEnglish } from '../../src/markets-no-ch/geography-quiz-copy-en.mjs';
import { norwayChildSupportEnglish } from '../../src/markets-no-ch/norway-child-support-copy-en.mjs';
import { norwayParentalBenefitEnglish } from '../../src/markets-no-ch/norway-parental-benefit-copy-en.mjs';
import { norwayUnemploymentBenefitEnglish } from '../../src/markets-no-ch/norway-unemployment-benefit-copy-en.mjs';
import { norwayHousingBenefitEnglish } from '../../src/markets-no-ch/norway-housing-benefit-copy-en.mjs';
import { swissVehicleTaxEnglish } from '../../src/markets-no-ch/switzerland-vehicle-tax-copy-en.mjs';
import { carbonFootprintEnglish } from '../../src/markets-no-ch/carbon-footprint-copy-en.mjs';
import { dewPointEnglish } from '../../src/markets-no-ch/dew-point-copy-en.mjs';
import { aquariumWaterMixingEnglish } from '../../src/markets-no-ch/aquarium-water-mixing-copy-en.mjs';
import { barcodeReaderEnglish } from '../../src/markets-no-ch/barcode-reader-copy-en.mjs';
import { numerologyEnglish } from '../../src/markets-no-ch/numerology-copy-en.mjs';
import { nineMensMorrisEnglish } from '../../src/markets-no-ch/nine-mens-morris-copy-en.mjs';
import { halmaGameEnglish } from '../../src/markets-no-ch/halma-game-copy-en.mjs';
import { canastaCardGameEnglish } from '../../src/markets-no-ch/canasta-card-game-copy-en.mjs';
import { skatCardGameEnglish } from '../../src/markets-no-ch/skat-card-game-copy-en.mjs';
import { doppelkopfEnglish } from '../../src/markets-no-ch/doppelkopf-copy-en.mjs';
import { schafkopfEnglish } from '../../src/markets-no-ch/schafkopf-copy-en.mjs';
import { schnapsenEnglish } from '../../src/markets-no-ch/schnapsen-copy-en.mjs';
import { suguruEnglish } from '../../src/markets-no-ch/suguru-copy-en.mjs';
import { shikakuEnglish } from '../../src/markets-no-ch/shikaku-copy-en.mjs';
import { brickBreakerEnglish } from '../../src/markets-no-ch/brick-breaker-copy-en.mjs';
import { miniGolfEnglish } from '../../src/markets-no-ch/minigolf-copy-en.mjs';
import { matchThreeEnglish } from '../../src/markets-no-ch/match-three-copy-en.mjs';
import { audioToMidiEnglish } from '../../src/markets-no-ch/audio-to-midi-copy-en.mjs';
import { voiceChangerEnglish } from '../../src/markets-no-ch/voice-changer-copy-en.mjs';
import { dicomViewerEnglish } from '../../src/markets-no-ch/dicom-viewer-copy-en.mjs';
import { crazyEightsEnglish } from '../../src/markets-no-ch/crazy-eights-copy-en.mjs';
import { idiotCardGameEnglish } from '../../src/markets-no-ch/idiot-card-game-copy-en.mjs';
import { jassEnglish } from '../../src/markets-no-ch/jass-copy-en.mjs';
import { warCardGameEnglish } from '../../src/markets-no-ch/war-card-game-copy-en.mjs';
import { natalChartEnglish } from '../../src/markets-no-ch/natal-chart-copy-en.mjs';
import { remainingToolsEnglish as addedToolCopy } from '../../src/markets-no-ch/remaining-tools-copy-en.mjs';
import { english } from '../../src/markets-no-ch/copy-en.mjs';
import { scaleDrawingEnglish } from '../../src/markets-no-ch/scale-drawing-copy-en.mjs';
import { shutTheBoxEnglish } from '../../src/markets-no-ch/shut-the-box-copy-en.mjs';
import { snakesAndLaddersEnglish } from '../../src/markets-no-ch/snakes-and-ladders-copy-en.mjs';

const tools = [
  ['swiss-wheel-offset', swissWheelOffsetEnglish, 'swissWheelOffsetTranslationsByLocale'],
  ['pet-age', petAgeEnglish, 'petAgeTranslationsByLocale'],
  ['swiss-uid', swissUidEnglish, 'swissUidTranslationsByLocale'],
  ['swiss-coordinate', swissCoordinateEnglish, 'swissCoordinateTranslationsByLocale'],
  ['norway-company-car', norwayCompanyCarEnglish, 'norwayCompanyCarTranslationsByLocale'],
  ['norway-employer-cost', norwayEmployerCostEnglish, 'norwayEmployerCostTranslationsByLocale', true],
  ['frequency-tone-generator', frequencyToneEnglish, 'frequencyToneTranslationsByLocale'],
  ['pinball', pinballEnglish, 'pinballTranslationsByLocale'],
  ['amerikaner-card-game', amerikanerCardGameEnglish, 'amerikanerCardGameTranslationsByLocale'],
  ['president-card-game', presidentCardGameEnglish, 'presidentCardGameTranslationsByLocale'],
  ['geography-quiz', geographyQuizEnglish, 'geographyQuizTranslationsByLocale', true],
  ['norway-child-support', norwayChildSupportEnglish, 'norwayChildSupportTranslationsByLocale', true],
  ['norway-parental-benefit', norwayParentalBenefitEnglish, 'norwayParentalBenefitTranslationsByLocale', true],
  ['norway-unemployment-benefit', norwayUnemploymentBenefitEnglish, 'norwayUnemploymentBenefitTranslationsByLocale', true],
  ['norway-housing-benefit', norwayHousingBenefitEnglish, 'norwayHousingBenefitTranslationsByLocale', true],
  ['switzerland-vehicle-tax', swissVehicleTaxEnglish, 'swissVehicleTaxTranslationsByLocale', true],
  ['carbon-footprint', carbonFootprintEnglish, 'carbonFootprintTranslationsByLocale', true],
  ['dew-point', dewPointEnglish, 'dewPointTranslationsByLocale', true],
  ['aquarium-water-mixing', aquariumWaterMixingEnglish, 'aquariumWaterMixingTranslationsByLocale', true],
  ['barcode-reader', barcodeReaderEnglish, 'barcodeReaderTranslationsByLocale', true],
  ['scale-drawing', scaleDrawingEnglish, 'scaleDrawingTranslationsByLocale', true],
  ['shut-the-box', shutTheBoxEnglish, 'shutTheBoxTranslationsByLocale', true],
  ['snakes-and-ladders', snakesAndLaddersEnglish, 'snakesAndLaddersTranslationsByLocale', true],
  ['numerology', numerologyEnglish, 'numerologyTranslationsByLocale', true],
  ['nine-mens-morris', nineMensMorrisEnglish, 'nineMensMorrisTranslationsByLocale', true],
  ['halma-game', halmaGameEnglish, 'halmaGameTranslationsByLocale', true],
  ['canasta-card-game', canastaCardGameEnglish, 'canastaCardGameTranslationsByLocale', true],
  ['skat-card-game', skatCardGameEnglish, 'skatCardGameTranslationsByLocale', true],
  ['doppelkopf', doppelkopfEnglish, 'doppelkopfTranslationsByLocale', true],
  ['schafkopf', schafkopfEnglish, 'schafkopfTranslationsByLocale', true],
  ['schnapsen', schnapsenEnglish, 'schnapsenTranslationsByLocale', true],
  ['suguru', suguruEnglish, 'suguruTranslationsByLocale', true],
  ['shikaku', shikakuEnglish, 'shikakuTranslationsByLocale', true],
  ['brick-breaker', brickBreakerEnglish, 'brickBreakerTranslationsByLocale', true],
  ['minigolf', miniGolfEnglish, 'minigolfTranslationsByLocale', true],
  ['match-three', matchThreeEnglish, 'matchThreeTranslationsByLocale', true],
  ['audio-to-midi', audioToMidiEnglish, 'audioToMidiTranslationsByLocale', true],
  ['voice-changer', voiceChangerEnglish, 'voiceChangerTranslationsByLocale', true],
  ['dicom-viewer', dicomViewerEnglish, 'dicomViewerTranslationsByLocale', true],
  ['crazy-eights', crazyEightsEnglish, 'crazyEightsTranslationsByLocale', true],
  ['idiot-card-game', idiotCardGameEnglish, 'idiotCardGameTranslationsByLocale', true],
  ['jass', jassEnglish, 'jassTranslationsByLocale', true],
  ['war-card-game', warCardGameEnglish, 'warCardGameTranslationsByLocale', true],
  ['natal-chart', natalChartEnglish, 'natalChartTranslationsByLocale', true],
  ['microphone', addedToolCopy.microphone, 'microphoneTranslationsByLocale', true],
  ['bubble-shooter', addedToolCopy.bubbleShooter, 'bubbleShooterTranslationsByLocale', true],
  ['yatzy', english.yatzy, 'yatzyTranslationsByLocale', true],
  ['related-market-metadata', Object.fromEntries(marketTools.map(({ id, name, title, description }) => [id, { name, title, description }])), 'relatedMarketMetadataTranslationsByLocale', true],
  ['legacy-market-copy', {
    holidayPay: english.holidayPay,
    norwayTax: english.norwayTax,
    norwayWealthTax: english.norwayWealthTax,
    swissQrBill: english.swissQrBill,
    grades: english.grades,
  }, 'legacyMarketCopyTranslationsByLocale', true],
];
const locales = [...localeEntries.filter(({ key }) => key !== 'en').map(({ key }) => key), 'nb'].sort();
const codes = { pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' };
const progressPath = '/private/tmp/usefulverse-market-copy-translation-progress.json';
let progress = {};
try { progress = JSON.parse(await readFile(progressPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const flatten = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out));
  return out;
};
const targetUrl = (locale, rows, offset) => {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  const markers = rows.map((_, index) => `UVMKT${String(offset + index).padStart(4, '0')}X`);
  const query = rows.map((source, index) => `${markers[index]}|${source}`).join('\n');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: codes[locale] ?? locale, dt: 't', q: query })) url.searchParams.set(key, value);
  return { url, markers };
};
async function translateChromeBatch(locale, protectedNumbers, offset) {
  const markers = protectedNumbers.map((_, index) => `UVMKT${String(offset + index).padStart(4, '0')}X`);
  const query = protectedNumbers.map(({ protectedSource }, index) => `${markers[index]}|${protectedSource}`).join('\n');
  const url = new URL('https://clients5.google.com/translate_a/t');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: codes[locale] ?? locale, q: query })) url.searchParams.set(key, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw Object.assign(new Error(`Free Chrome translation endpoint returned HTTP ${response.status} for ${locale}.`), { status: response.status });
  const data = await response.json();
  const result = typeof data?.[0] === 'string' ? data[0] : Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = markers.map((marker) => {
    const index = result.indexOf(marker);
    if (index < 0) return '';
    const start = index + marker.length;
    const nextMarker = result.indexOf('UVMKT', start);
    return result.slice(start, nextMarker < 0 ? undefined : nextMarker).replace(/^\s*[|｜:]?\s*/u, '').trim();
  });
  const batchPreservedTokens = values.every((value, index) =>
    (value.match(/ZXQNUM\d{3}QZX/gu) ?? []).length === protectedNumbers[index].originals.length
    && (value.match(/ZXQVAR\d{3}QZX/gu) ?? []).length === protectedNumbers[index].variables.length);
  if (values.some((value) => !value) || !batchPreservedTokens) {
    const recovered = [];
    for (const { protectedSource, originals, variables } of protectedNumbers) {
      const singleUrl = new URL('https://clients5.google.com/translate_a/t');
      for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: codes[locale] ?? locale, q: protectedSource })) singleUrl.searchParams.set(key, value);
      const singleResponse = await fetch(singleUrl, { signal: AbortSignal.timeout(30000) });
      if (!singleResponse.ok) throw Object.assign(new Error(`Free Chrome translation endpoint returned HTTP ${singleResponse.status} for ${locale}.`), { status: singleResponse.status });
      const singleData = await singleResponse.json();
      const translated = typeof singleData?.[0] === 'string' ? singleData[0] : Array.isArray(singleData?.[0]) ? singleData[0].map((part) => part?.[0] ?? '').join('') : '';
      recovered.push(restoreTokens(translated, originals, variables));
    }
    return recovered;
  }
  return values.map((value, index) => restoreTokens(value, protectedNumbers[index].originals, protectedNumbers[index].variables));
}
function restoreTokens(value, originals, variables) {
  return value
    .replace(/ZXQNUM(\d{3})QZX/gu, (token, number) => originals[Number(number)] ?? token)
    .replace(/ZXQVAR(\d{3})QZX/gu, (token, number) => variables[Number(number)] ?? token);
}
async function translateSingle(locale, source) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: codes[locale] ?? locale, dt: 't', q: source })) url.searchParams.set(key, value);
  let response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok && response.status === 429) {
    const fallback = new URL('https://clients5.google.com/translate_a/t');
    for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: codes[locale] ?? locale, q: source })) fallback.searchParams.set(key, value);
    response = await fetch(fallback, { signal: AbortSignal.timeout(30000) });
  }
  if (!response.ok) throw Object.assign(new Error(`Free translation endpoints returned HTTP ${response.status} for ${locale}.`), { status: response.status });
  const data = await response.json();
  const result = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
  const chromeResult = typeof data?.[0] === 'string' ? data[0] : '';
  const translated = result || chromeResult;
  if (!translated.trim()) throw new Error(`Translation response was empty for ${locale}.`);
  return translated.trim();
}
async function translateWithProtectedTokens(locale, source) {
  // Public translation endpoints sometimes rewrite opaque placeholder markers.
  // Translate only prose fragments and preserve variables and numeric facts
  // byte-for-byte so recovery cannot alter rates, years, amounts or examples.
  const parts = source.split(/(\{[^{}]+\}|\d+(?:[,.]\d+)*)/gu);
  const translated = [];
  for (const part of parts) {
    if (!part || /^\{[^{}]+\}$/u.test(part) || /^\d+(?:[,.]\d+)*$/u.test(part)) translated.push(part);
    else translated.push(await translateSingle(locale, part));
  }
  return translated.join('');
}
async function translateBatch(locale, rows, offset) {
  const protectedNumbers = rows.map((source) => {
    const originals = [];
    const variables = [];
    const protectedSource = source.replace(/\{[^{}]+\}/gu, (variable) => {
      const token = `ZXQVAR${String(variables.length).padStart(3, '0')}QZX`;
      variables.push(variable);
      return token;
    }).replace(/\d+(?:[,.]\d+)*/gu, (number) => {
      const token = `ZXQNUM${String(originals.length).padStart(3, '0')}QZX`;
      originals.push(number);
      return token;
    });
    return { protectedSource, originals, variables, originalSource: source };
  });
  const { url, markers } = targetUrl(locale, protectedNumbers.map(({ protectedSource }) => protectedSource), offset);
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (response.status === 429) return await translateChromeBatch(locale, protectedNumbers, offset);
      if (!response.ok) throw Object.assign(new Error(`Free translation endpoint returned HTTP ${response.status} for ${locale}.`), { status: response.status });
      const data = await response.json();
      const result = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
      const values = markers.map((marker) => {
        const index = result.indexOf(marker);
        if (index < 0) return '';
        const start = index + marker.length;
        const nextMarker = result.indexOf('UVMKT', start);
        return result.slice(start, nextMarker < 0 ? undefined : nextMarker).replace(/^\s*[|｜:]?\s*/u, '').trim();
      });
      if (values.some((value) => !value)) return await translateChromeBatch(locale, protectedNumbers, offset);
      if (values.every(Boolean)) {
        const preservedTokens = values.every((value, index) =>
          (value.match(/ZXQNUM\d{3}QZX/gu) ?? []).length === protectedNumbers[index].originals.length
          && (value.match(/ZXQVAR\d{3}QZX/gu) ?? []).length === protectedNumbers[index].variables.length);
        if (!preservedTokens) return await translateChromeBatch(locale, protectedNumbers, offset);
        return values.map((value, index) => restoreTokens(value, protectedNumbers[index].originals, protectedNumbers[index].variables));
      }
      // Some scripts transliterate or discard opaque markers. Fall back to
      // one public string per request so a lost delimiter cannot corrupt copy.
      const recovered = [];
      for (const { protectedSource, originals, variables } of protectedNumbers) recovered.push(restoreTokens(await translateSingle(locale, protectedSource), originals, variables));
      return recovered;
    } catch (error) {
      lastError = error;
      if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, lastError.status === 429 ? Math.min(30000, 5000 * (2 ** attempt)) : 1000 * (attempt + 1)));
    }
  }
  throw lastError;
}
const tokens = (text, expression) => text.match(expression) ?? [];
const manualOverrides = {
  pinball: {
    ca: { 'Pinball Game — Free Local Flipper and Bumper Table': 'Joc de Pinball — Taula local gratuïta de flippers i bumpers' },
    ha: { 'Pinball Game — Free Local Flipper and Bumper Table': 'Wasan Pinball — Teburin gida na flipper da bumpers kyauta' },
    nb: { 'Pinball Game — Free Local Flipper and Bumper Table': 'Finnballspill — gratis flipperspill med støtfangere for nettleseren' },
    nl: { 'Pinball Game — Free Local Flipper and Bumper Table': 'Flipperspel — gratis lokaal flipperspel met bumpers' },
    pl: { 'Pinball Game — Free Local Flipper and Bumper Table': 'Gra typu pinball — darmowy lokalny flipper z bumperami' },
    tl: { 'Pinball Game — Free Local Flipper and Bumper Table': 'Laro ng Pinball — Libreng lokal na mesa na may mga flipper at bumper' },
    tr: { 'Pinball Game — Free Local Flipper and Bumper Table': 'Langırt Oyunu — Ücretsiz yerel palet ve tampon masası' },
    vi: { 'Pinball Game — Free Local Flipper and Bumper Table': 'Trò Chơi Pinball — Bàn lật và bảng bội thu cục bộ miễn phí' },
  },
  'norway-company-car': {
    pt: {
      'This is a Norway-specific planning estimate using Skatteetaten’s 2026 standard company-car rates, checked 16 October 2026. The rules do not depend on the language selected on this page. It is not an official tax return, full tax calculation or legal decision. Special vehicles and exceptions are excluded. Rates are static in this build and do not refresh in the background; check Skatteetaten for the current year before relying on them.': 'Esta é uma estimativa de planejamento específica para a Noruega, baseada nas taxas padrão de 2026 da Skatteetaten para carros da empresa, verificadas em 16 de outubro de 2026. As regras não dependem do idioma escolhido nesta página. Não é uma declaração de imposto oficial, um cálculo completo de impostos nem uma decisão jurídica. Veículos especiais e exceções não estão incluídos. As taxas são fixas nesta versão e não são atualizadas em segundo plano; consulte a Skatteetaten para confirmar o ano vigente antes de usar os valores.',
    },
  },
  'amerikaner-card-game': {
    es: {
      'Amerikaner Card Game Online — Bid, Find a Partner and Win Tricks': 'Juego de cartas Amerikaner en línea: apuesta, busca pareja y gana bazas',
      'Learn the Norwegian Amerikaner trick-taking game: bid how many tricks you and an unknown partner can take, set trump with your lead, and request the card that reveals your partner.': 'Juega al Amerikaner noruego, un juego de bazas: apuesta cuántas bazas puedes ganar junto con una pareja aún desconocida, establece el triunfo al salir y pide la carta que revela quién es tu pareja.',
    },
    tl: {
      'Amerikaner Card Game Online — Bid, Find a Partner and Win Tricks': 'Amerikaner Online — mag-bid, humanap ng kapareha at manalo ng mga trick',
      'Learn the Norwegian Amerikaner trick-taking game: bid how many tricks you and an unknown partner can take, set trump with your lead, and request the card that reveals your partner.': 'Laruin ang larong Norwegian Amerikaner, isang trick-taking game: mag-bid kung ilang trick ang kaya ninyong makuha ng hindi pa kilalang kapareha, itakda ang trump sa iyong lead, at hingin ang barahang magbubunyag sa kapareha mo.',
    },
    nb: {
      'Amerikaner Card Game Online — Bid, Find a Partner and Win Tricks': 'Kortspillet Amerikaner på nett — meld, finn en makker og vinn stikk',
      'Learn the Norwegian Amerikaner trick-taking game: bid how many tricks you and an unknown partner can take, set trump with your lead, and request the card that reveals your partner.': 'Spill det norske kortspillet Amerikaner: meld hvor mange stikk du og en ukjent makker kan ta, velg trumf med utspillet ditt og be om kortet som avslører makkeren din.',
    },
    ur: {
      'Amerikaner Card Game Online — Bid, Find a Partner and Win Tricks': 'Amerikaner کارڈ گیم آن لائن — بولی لگائیں، ساتھی تلاش کریں اور چالیں جیتیں',
      'Learn the Norwegian Amerikaner trick-taking game: bid how many tricks you and an unknown partner can take, set trump with your lead, and request the card that reveals your partner.': 'ناروے کے تاش کے کھیل Amerikaner میں سیکھیں کہ کتنی چالیں بولی جائیں، نامعلوم ساتھی کو کیسے تلاش کریں، اپنے پہلے پتے سے ٹرمپ کیسے مقرر کریں اور ساتھی ظاہر کرنے والا پتہ کیسے مانگیں۔',
    },
    th: { 'Your lead is on the table.': 'ถึงตาคุณเป็นฝ่ายนำ' },
  },
  'president-card-game': {
    fr: { 'Player holding 3♣': 'Joueur qui possède le 3 de trèfle' },
    it: { '{player} finished first.': '{player} si è classificato al primo posto.' },
    ja: {
      'This match uses {opening} to start the first deal, {reentry} after passing and card exchange {exchange}. The first player to reach {target} points wins. One deck is used for 3–6 players and two for 7–8; no jokers.': 'この対戦では、最初の配りで{opening}を使い、パス後の再参加は{reentry}、カード交換は{exchange}に設定されています。先に{target}点に達したプレイヤーが勝ちです。3〜6人では52枚のデッキを1組、7〜8人では2組を使い、ジョーカーは使いません。',
    },
    zh_tw: {
      'Group rules this game: first lead — {opening}; rejoining after passing — {reentry}; position exchange — {exchange}; first to {target} points wins.': '本場遊戲的群組規則：首輪由{opening}開始；出牌後可否重新加入：{reentry}；依排名交換手牌：{exchange}。第一位達到{target}分的玩家獲勝。',
    },
  },
  'pet-age': {
    ar: {
      'A 1-year-old cat maps to 15 comparison years on the FelineVMA 2025 chart. A 10-year-old dog with an entered 12-year expected lifespan is shown as senior; no human-years multiplier is applied.': 'قطة عمرها 1 سنة تقابل 15 سنة مقارنة في مخطط FelineVMA لعام 2025. يظهر كلب عمره 10 سنوات مع عمر متوقع مدخل قدره 12 سنة على أنه مسن؛ ولا يُستخدم معامل تحويل إلى سنوات بشرية.',
    },
  },
  'shut-the-box': {
    es: {
      'Shut the Box': 'Cierra la caja',
      'Shut the Box Online — Free Dice and Number-Tile Game': 'Cierra la caja en línea — juego gratuito de dados y fichas numeradas',
      'Choose a dice rule before starting. Each turn, roll and close a legal combination. If no combination matches, your turn ends and the remaining tile values are your score for that round. The lowest total wins. You can practise alone or take turns against a local computer on the same device.': 'Elige las reglas para los dados antes de empezar. En cada turno, tira y cierra una combinación válida. Si ninguna combinación coincide, termina tu turno y los valores de las fichas restantes serán tus puntos de esa ronda. Gana la puntuación total más baja. Puedes practicar a solas o jugar por turnos contra el ordenador local en el mismo dispositivo.',
      'There is no online multiplayer. In computer mode, you and a local computer opponent take turns on this device.': 'No existe una modalidad multijugador en línea. En el modo contra el ordenador, tú y un rival local os turnáis en este dispositivo.',
    },
    ta: {
      'Dice rule': 'பகடை விதி',
      'Roll dice': 'பகடைகளை உருட்டு',
      'Dice': 'பகடை',
      'Open tiles': 'திறந்த கட்டைகள்',
      'Tile {number}, {state}': 'கட்டை {number}, {state}',
    },
  },
  'canasta-card-game': {
    bn: {
      'The minimum is 50 points below 1,500 cumulative points, 90 from 1,500, 120 from 3,000 and 150 from 5,000. Existing meld points are not counted toward a new opening.': '1,500 মোট পয়েন্টের নিচে ন্যূনতম স্কোর 50; 1,500 থেকে 90, 3,000 থেকে 120 এবং 5,000 থেকে 150। নতুন করে খোলার ন্যূনতম স্কোরে আগের মেল্ডের পয়েন্ট যোগ হয় না।',
    },
    gu: {
      'The minimum is 50 points below 1,500 cumulative points, 90 from 1,500, 120 from 3,000 and 150 from 5,000. Existing meld points are not counted toward a new opening.': '1,500 કુલ પોઇન્ટથી ઓછા સ્કોર માટે લઘુત્તમ 50 પોઇન્ટ છે; 1,500થી 90, 3,000થી 120 અને 5,000થી 150. નવા મેલ્ડની શરૂઆત માટે અગાઉના મેલ્ડના પોઇન્ટ ગણાતા નથી.',
    },
    mr: {
      'The minimum is 50 points below 1,500 cumulative points, 90 from 1,500, 120 from 3,000 and 150 from 5,000. Existing meld points are not counted toward a new opening.': 'एकूण गुण 1,500 पेक्षा कमी असताना किमान 50 गुण आवश्यक; 1,500 पासून 90, 3,000 पासून 120 आणि 5,000 पासून 150 गुण आवश्यक आहेत. नव्या मेल्डसाठी उघडण्याच्या किमान गुणांमध्ये आधीच्या मेल्डचे गुण मोजले जात नाहीत.',
    },
    zh_tw: {
      'The minimum is 50 points below 1,500 cumulative points, 90 from 1,500, 120 from 3,000 and 150 from 5,000. Existing meld points are not counted toward a new opening.': '累積分數未滿 1,500 分時，起手最低須達 50 分；累積達 1,500、3,000、5,000 分時，起手最低分別為 90、120、150 分。既有牌組的分數不計入新開局的最低分。',
    },
  },
  yatzy: {
    es: {
      'Play a free single-player Yatzy-style dice game. Hold dice, fill 15 scoring categories, track the bonus and export your score sheet.': 'Juega gratis a Yatzy en solitario. Conserva los dados que quieras, completa las 15 categorías, sigue la bonificación y exporta tu hoja de puntuación.',
      'Hold die': 'Mantener el dado',
      'Die': 'Dado',
      'Rolls left': 'Tiradas restantes',
      'Roll at least once before scoring.': 'Haz al menos una tirada antes de puntuar.',
      'A roll of 2, 2, 3, 3, 3 scores 13 in Full house or 6 in One pair. You choose one unused category for the whole turn.': 'Con una tirada de 2, 2, 3, 3, 3 se obtienen 13 puntos en Casa llena o 6 puntos en Un par. Elige una categoría sin puntuar para toda la tirada.',
      'The score sheet uses six upper categories, five-of-a-kind and common lower combinations. The upper section earns a 50-point bonus at 63 or more. Each category can be used once; zero is a valid score.': 'La hoja de puntuación incluye seis categorías superiores, cinco iguales y combinaciones inferiores habituales. La sección superior concede 50 puntos extra al alcanzar 63 o más. Cada categoría se puntúa una vez; cero también es válido.',
      'This version is a single-player score sheet. It does not support pass-and-play or computer opponents.': 'Esta versión es una hoja de puntuación para una sola persona. No admite partidas por turnos entre varias personas ni rivales controlados por el ordenador.',
      'No. Dice rolls and scores stay in your browser; no match data is uploaded.': 'No. Las tiradas de dados y las puntuaciones permanecen en tu navegador; no se suben datos de la partida.',
    },
    ha: {
      'A roll of 2, 2, 3, 3, 3 scores 13 in Full house or 6 in One pair. You choose one unused category for the whole turn.': 'Jefa 2, 2, 3, 3, 3 na ba da maki 13 a rukunin Full House ko maki 6 a One Pair. Zaɓi rukuni guda ɗaya da ba a yi amfani da shi ba domin dukkan juyin.',
    },
    zh_tw: {
      'A roll of 2, 2, 3, 3, 3 scores 13 in Full house or 6 in One pair. You choose one unused category for the whole turn.': '擲出 2、2、3、3、3 時，在 Full House（葫蘆）項目得 13 分，或在 One Pair（一對）項目得 6 分。整個回合只能選一個尚未使用的計分項目。',
    },
  },
  'related-market-metadata': {
    es: {
      'Swiss QR-bill Generator': 'Generador de facturas QR suizas',
    },
    nb: {
      'Grade Scale Generator': 'Karakterkalkulator',
      'Swiss Child Support Budget Scenario': 'Budsjettscenario for sveitsisk barnebidrag',
      'Codebreaker Logic Game': 'Kodeknekkerspill',
      'Child Growth Percentile Calculator — CDC US Reference': 'Kalkulator for barns vekstpercentiler — CDCs referanse for USA',
      'Swiss Health Premium Reduction Calculator': 'Kalkulator for reduksjon av sveitsisk helseforsikringspremie',
      'Swiss Rent Reference-Rate Scenario Calculator': 'Scenario for sveitsisk justering av husleie ved referanserente',
      'Schieber Jass Game': 'Schieber Jass-spill',
      'Nine Men’s Morris Online — Free Mill Game vs Computer': 'Nimannsmølle på nett — gratis møllespill mot datamaskinen',
      'Resume Structure Checker': 'CV-struktursjekker',
      'World Geography Map Quiz': 'Quiz om verdensgeografi',
      'Norway Property Transfer Cost Estimator': 'Kalkulator for kostnader ved eiendomsoverføring i Norge',
      'Bubble Shooter': 'Bobleskytespill',
      'Bubble Shooter Online — Free Color Match Game': 'Bobleskytespill på nett — gratis fargematch',
      'Carbon Footprint Scenario Calculator': 'Kalkulator for klimafotavtrykk',
      'Carbon Footprint Calculator — Compare Emission Scenarios': 'Kalkulator for klimafotavtrykk — sammenlign utslippsscenarioer',
      'Brick Breaker Game': 'Mursteinssprettspill',
      'Brick Breaker Online — Free Paddle and Brick Game': 'Mursteinssprett på nett — gratis spill med padle og klosser',
      'Frequency Tone Generator': 'Frekvens- og tonegenerator',
      'Tone Generator Online — Free Frequency & Sweep Tool': 'Tonegenerator på nett — gratis verktøy for frekvens og sveip',
      'Norway Unemployment Benefit Estimator': 'Kalkulator for norske dagpenger',
      'Norway Unemployment Benefit Calculator 2026 — Dagpenger Estimate': 'Norsk dagpengekalkulator 2026 — estimat',
      'Norway Student Loan-to-Grant Estimator': 'Kalkulator for norsk studielån og stipend',
      'Norway Student Loan Calculator 2026 — Loan-to-Grant Conversion': 'Norsk studielånskalkulator 2026 — omgjøring fra lån til stipend',
      'Norway Commuting Deduction Estimator': 'Kalkulator for norsk reisefradrag',
      'Norway Commuting Deduction Calculator 2026 — Home to Work': 'Norsk reisefradragskalkulator 2026 — mellom hjem og jobb',
      'Norway Disability Benefit Estimator': 'Kalkulator for norsk uføretrygd',
      'Norway Disability Benefit Calculator 2026 — Gross Scenario': 'Norsk uføretrygdkalkulator 2026 — brutto scenario',
      'Norway Import Cost Estimator': 'Kalkulator for importkostnader til Norge',
      'Norway Import Cost Calculator — Customs Duty, VAT and Fees': 'Kalkulator for import til Norge — toll, merverdiavgift og gebyrer',
      'Norway Toll Route Cost Estimator': 'Kalkulator for bompengekostnader i Norge',
      'Norway Toll Calculator — Route, Vehicle and Time of Day': 'Bompengekalkulator for Norge — rute, kjøretøy og tidspunkt',
      'Norway Electricity Support Comparator': 'Sammenligning av norsk strømstøtte',
      'Norway Electricity Support Calculator — Norgespris or Electricity Support': 'Norsk strømstøttekalkulator — Norgespris eller strømstøtte',
      'Estimate Norwegian holiday pay from your holiday-pay basis. Compare common rates for standard leave, a fifth week and employees aged 60 or over.': 'Beregn norske feriepenger fra feriepengegrunnlaget ditt. Sammenlign vanlige satser for standardferie, en femte ferieuke og ansatte som er 60 år eller eldre.',
    },
    sv: { 'Grade Scale Generator': 'Betygsskalagenerator' },
    tl: {
      'Norway Holiday Pay Calculator': 'Kalkulador ng bayad sa bakasyon sa Norway',
      'Norway Income Tax Calculator': 'Kalkulador ng buwis sa kita sa Norway',
      'Norway Wealth Tax Calculator': 'Kalkulador ng buwis sa yaman sa Norway',
      'Swiss QR-bill Generator': 'Tagagawa ng Swiss QR invoice',
      'Grade Scale Generator': 'Tagabuo ng antas ng marka',
    },
  },
  'legacy-market-copy': {
    es: {
      'Swiss QR-bill Generator': 'Generador de facturas QR suizas',
      '2-letter country code': 'Código de país de 2 letras',
      'SIX · Swiss QR-bill standard': 'SIX · estándar suizo de factura QR',
    },
    nb: {
      'Norway Holiday Pay Calculator — Free Gross Estimate': 'Norsk feriepengerkalkulator — gratis bruttoberegning',
      'Enter the feriepengegrunnlag shown on your payslip. Compare common Norwegian gross holiday-pay rates for your age and agreed holiday length.': 'Oppgi feriepengegrunnlaget på lønnsslippen. Sammenlign vanlige norske brutto feriepengesatser etter alder og avtalt ferielengde.',
      'I am 60 or older in the holiday year': 'Jeg fyller 60 år eller mer i ferieåret',
      'My agreement includes a fifth holiday week': 'Avtalen min inkluderer en femte ferieuke',
      Scenario: 'Scenario', 'Scenario 1': 'Alternativ 1', 'Scenario 2': 'Alternativ 2',
      'SIX · Swiss QR-bill standard': 'SIX · sveitsisk standard for QR-faktura',
      'Grade Scale Generator': 'Karakterkalkulator',
      'Estimate Norwegian holiday pay from your holiday-pay basis. Compare common rates for standard leave, a fifth week and employees aged 60 or over.': 'Beregn norske feriepenger fra feriepengegrunnlaget ditt. Sammenlign vanlige satser for standardferie, en femte ferieuke og ansatte som er 60 år eller eldre.',
    },
    sv: {
      Scenario: 'Scenario', 'Scenario 1': 'Alternativ 1', 'Scenario 2': 'Alternativ 2',
      'Grade Scale Generator': 'Betygsskalagenerator',
    },
    it: { Scenario: 'Scenario', 'Scenario 1': 'Scenario 1', 'Scenario 2': 'Scenario 2' },
    nl: { Scenario: 'Scenario', 'Scenario 1': 'Scenario 1', 'Scenario 2': 'Scenario 2' },
    tl: {
      'Norway Holiday Pay Calculator': 'Kalkulador ng bayad sa bakasyon sa Norway',
      'Norway Income Tax Calculator': 'Kalkulador ng buwis sa kita sa Norway',
      'Gross annual income (NOK)': 'Kabuuang taunang kita (NOK)',
      'Tax zone': 'Sona ng buwis', 'Bracket tax': 'Buwis ayon sa antas',
      'Norway Wealth Tax Calculator': 'Kalkulador ng buwis sa yaman sa Norway',
      'Swiss QR-bill Generator': 'Tagagawa ng Swiss QR invoice',
      'Postal code': 'Kodigo postal', Account: 'Account',
      'Print scale check · 100 mm': 'Suriin ang sukat ng pag-print · 100 mm',
      'Grade Scale Generator': 'Tagabuo ng antas ng marka',
    },
  },
};
let progressWrite = Promise.resolve();
function saveProgress() {
  progressWrite = progressWrite.then(() => writeFile(progressPath, JSON.stringify(progress)));
  return progressWrite;
}
const digitStarts = [0x30,0x660,0x6f0,0x966,0x9e6,0xa66,0xae6,0xb66,0xbe6,0xc66,0xce6,0xd66,0xe50,0xed0,0xf20,0x1040,0x17e0,0x1810,0xff10];
const normalizeDigits = (text) => [...text].map((char) => {
  const code = char.codePointAt(0);
  const start = digitStarts.find((candidate) => code >= candidate && code <= candidate + 9);
  return start === undefined ? char : String(code - start);
}).join('');
const normalizeNumbers = (text) => tokens(normalizeDigits(text), /\d+(?:(?:[,.\u066b]\d+)|(?:[ \u00a0\u202f\u066c]\d{3}(?!\d)))*/gu).map((value) => {
  let normalized = value.replace(/[ \u00a0\u202f\u066c]/gu, '').replaceAll('\u066b', '.');
  if (normalized.includes(',') && normalized.includes('.')) {
    const decimalAt = Math.max(normalized.lastIndexOf(','), normalized.lastIndexOf('.'));
    normalized = normalized.slice(0, decimalAt).replace(/[,.]/gu, '') + '.' + normalized.slice(decimalAt + 1);
  } else if (/^\d{1,3}(?:([,.])\d{3})+$/u.test(normalized)) {
    normalized = normalized.replace(/[,.]/gu, '');
  } else {
    normalized = normalized.replace(',', '.');
  }
  return Number(normalized);
}).sort((a, b) => a - b);
const spelledOne = {
  am: /አንድ/u, ar: /واحد|واحدة/u, bg: /един|една|едно/u, bn: /এক/u, ca: /\b(?:un|una)\b/iu,
  de: /\b(?:ein|eine|einen|einem|einer)\b/iu, el: /ένα|ένας|μία/u, es: /\b(?:uno|una|un)\b/iu,
  fa: /یک/u, fr: /\b(?:un|une)\b/iu, gu: /એક/u, ha: /daya/u, hi: /एक/u, id: /satu/u,
  it: /\b(?:uno|una|un)\b/iu, ja: /一/u, ko: /하나/u, mr: /एक/u, ms: /satu/u, nb: /\b(?:en|ett)\b/iu,
  nl: /\been\b/iu, pl: /jeden|jedna|jedno/u, pt: /\b(?:um|uma)\b/iu, ru: /один|одна|одно/u,
  sv: /\b(?:en|ett)\b/iu, sw: /moja/u, ta: /ஒன்று/u, te: /ఒకటి/u, th: /หนึ่ง/u, tl: /isa/u,
  tr: /\bbir\b/iu, uk: /один|одна|одне/u, ur: /ایک/u, vi: /một/u, zh: /一/u, zh_tw: /一/u,
};
function validTranslation(source, translated, locale) {
  if (!translated?.trim() || /UVMKT\d{4}X|ZXQ(?:NUM|VAR)\d{3}QZX/u.test(translated)) return false;
  const sourcePlaceholders = tokens(source, /\{[^{}]+\}/gu).sort();
  const translatedPlaceholders = tokens(translated, /\{[^{}]+\}/gu).sort();
  const sourceNumbers = normalizeNumbers(source).filter((number) => number !== 0);
  const translatedNumbers = normalizeNumbers(translated).filter((number) => number !== 0);
  const sourceOnes = sourceNumbers.filter((number) => number === 1).length;
  const translatedOnes = translatedNumbers.filter((number) => number === 1).length;
  const oneWrittenAsWord = sourceOnes === 1 && translatedOnes === 0 && spelledOne[locale]?.test(translated);
  const comparableSource = oneWrittenAsWord ? sourceNumbers.filter((number) => number !== 1) : sourceNumbers;
  const numbersPreserved = comparableSource.every((number) => translatedNumbers.filter((candidate) => candidate === number).length >= comparableSource.filter((candidate) => candidate === number).length);
  return JSON.stringify(sourcePlaceholders) === JSON.stringify(translatedPlaceholders) && numbersPreserved;
}
for (const [slug, english, exportName, includeCommon = false] of tools) {
  const generic = new Set(Object.keys(translationsByLocale.es ?? {}));
  const sources = [...new Set(flatten(english).filter((source) => includeCommon || !generic.has(source)))];
  const packs = progress[slug] ??= {};
  let nextLocale = 0;
  async function processLocale(locale) {
    const pack = packs[locale] ??= {};
    const missing = sources.filter((source) => !validTranslation(source, manualOverrides[slug]?.[locale]?.[source] ?? pack[source], locale));
    let offset = 0;
    for (let start = 0; start < missing.length; start += 8) {
      const rows = missing.slice(start, start + 8);
      const translated = await translateBatch(locale, rows, start);
      for (let index = 0; index < rows.length; index += 1) {
        if (!validTranslation(rows[index], translated[index], locale)) {
          translated[index] = await translateWithProtectedTokens(locale, rows[index]);
        }
      }
      rows.forEach((source, index) => { pack[source] = translated[index]; });
      offset += rows.length;
      await saveProgress();
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    for (const source of sources) {
      const value = manualOverrides[slug]?.[locale]?.[source] ?? pack[source];
      pack[source] = value;
      if (!validTranslation(source, value, locale)) throw new Error(`${slug}/${locale} changed a number or placeholder in: ${source} → ${value}`);
    }
    if (offset) console.log(`${slug}/${locale}: translated ${offset} strings`);
  }
  async function localeWorker() {
    while (nextLocale < locales.length) {
      const locale = locales[nextLocale++];
      await processLocale(locale);
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, locales.length) }, () => localeWorker()));
  if (slug === 'shut-the-box') {
    for (const locale of locales) {
      const name = packs[locale][english.name];
      const title = packs[locale][english.title];
      if (!title.startsWith(name)) {
        const suffix = title.split(/\s+[—–-]\s+/u).at(-1)?.trim();
        packs[locale][english.title] = `${name} — ${suffix || title}`;
      }
    }
    await saveProgress();
  }
  if (slug === 'geography-quiz') {
    for (const locale of locales) {
      if (locale === 'nb') packs[locale][english.name] = 'Verdenskartquiz i geografi';
      const name = packs[locale][english.name];
      const title = packs[locale][english.title];
      const titleWithoutName = title.startsWith(name) ? title.slice(name.length).replace(/^[\s—–:·-]+/u, '').trim() : '';
      const suffix = titleWithoutName || title.split(/\s+[—–:·-]\s+/u).slice(1).join(' — ').trim();
      packs[locale][english.title] = suffix ? `${name} — ${suffix}` : name;
    }
    await saveProgress();
  }
  const ordered = Object.fromEntries(locales.map((locale) => [locale, Object.fromEntries(sources.map((source) => [source, packs[locale][source]]))]));
  const output = `// Static machine-translated draft copy; visitors make no translation requests. Native review is still required before public release.\nexport const ${exportName} = Object.freeze(${JSON.stringify(ordered)});\n`;
  await writeFile(new URL(`../../src/markets-no-ch/${slug}-translations.mjs`, import.meta.url), output);
  console.log(`${slug}: wrote ${sources.length} strings for ${locales.length} non-English locales.`);
}
