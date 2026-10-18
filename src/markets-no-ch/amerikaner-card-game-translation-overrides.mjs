import { amerikanerCardGameTranslationsByLocale } from './amerikaner-card-game-translations.mjs';

const sharedSourceName = 'Norske kortspill · Amerikaner';
const locales = ['es', 'fr', 'pt', 'de', 'ja', 'ko', 'id', 'hi', 'ar', 'zh', 'bn', 'ru', 'ur', 'tr', 'vi', 'it', 'zh_tw', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw', 'mr', 'te', 'ha', 'tl', 'ta', 'fa', 'am', 'gu', 'nb'];
const preserveSourceTitle = Object.fromEntries(locales.map((locale) => [locale, { [sharedSourceName]: sharedSourceName }]));

const zhTwBase = Object.fromEntries(Object.entries(amerikanerCardGameTranslationsByLocale.zh_tw).map(([source, text]) => [source, text
  .replaceAll('美式紙牌遊戲', 'Amerikaner 紙牌遊戲')
  .replaceAll('美式撲克', 'Amerikaner')
  .replaceAll('美國佬', 'Amerikaner')]));
const zhTw = {
  ...zhTwBase,
  'Amerikaner Card Game': 'Amerikaner 紙牌遊戲',
  'Amerikaner Card Game Online — Bid, Find a Partner and Win Tricks': 'Amerikaner 紙牌遊戲線上版 — 叫牌、尋找搭檔並贏取牌墩',
  'Play the Norwegian Amerikaner card game locally with three to six players. Bid for tricks, choose trump, find your partner and keep the score on this device.': '與三至六名玩家在本機暢玩挪威 Amerikaner 紙牌遊戲。叫牌爭取牌墩、選擇王牌花色、尋找搭檔，並在此裝置上記錄分數。',
  'Learn the Norwegian Amerikaner trick-taking game: bid how many tricks you and an unknown partner can take, set trump with your lead, and request the card that reveals your partner.': '認識挪威 Amerikaner 牌墩遊戲：叫牌預測你和一位尚未揭曉的搭檔能贏得多少牌墩，以首張出牌決定王牌花色，並指定一張牌來揭曉搭檔。',
  'What does Amerikaner mean?': '「Amerikaner」是什麼意思？',
  'Play Amerikaner': '開始玩 Amerikaner',
  'Call Amerikaner': '宣布「Amerikaner」',
  'Successful Amerikaner: 52 points.': '「Amerikaner」成功：52 分。',
  'Failed Amerikaner: −52 points.': '「Amerikaner」失敗：−52 分。',
};
const tl = {
  'Amerikaner Card Game': 'Larong baraha na Amerikaner',
  'Amerikaner Card Game Online — Bid, Find a Partner and Win Tricks': 'Amerikaner Online — mag-bid, maghanap ng kapareha at manalo ng mga trick',
  'Play Amerikaner': 'Maglaro ng Amerikaner',
  'Call Amerikaner': 'Tawagin ang Amerikaner',
  'Bid at least half your hand rounded up and higher than the current bid, pass for this auction, or call Amerikaner to try every trick alone.': 'Mag-bid ng hindi bababa sa kalahati ng iyong mga baraha, i-round up at lampasan ang kasalukuyang bid; maaari ka ring pumasa o tumawag ng Amerikaner upang subukang kunin ang lahat ng trick nang mag-isa.',
  '{player} called Amerikaner: every trick alone, no trump.': '{player} ay tumawag ng Amerikaner: lahat ng trick ay kukunin nang mag-isa at walang trump.',
  'Successful Amerikaner: 52 points.': 'Matagumpay na Amerikaner: 52 puntos.',
  'Failed Amerikaner: −52 points.': 'Nabigong Amerikaner: −52 puntos.',
  'One standard 52-card deck, no jokers. Deal evenly for 3–6 players by setting aside enough twos. A regular bid starts at half the hand rounded up and must top the previous bid. Call Amerikaner to take all tricks alone. On a regular bid, lead to set trump and request a partner card. Follow suit when able. The team each gains or loses the bid; other players gain their trick counts. Highest score wins once a score reaches 52.': 'Gumamit ng isang karaniwang deck na may 52 baraha at walang joker. Para sa 3–6 na manlalaro, itabi ang sapat na mga two para pantay ang baraha ng bawat isa. Dapat hindi bababa sa kalahati ng iyong kamay, ni-round up, ang regular na bid at lampasan nito ang naunang bid. Tawagin ang Amerikaner para subukang kunin nang mag-isa ang lahat ng trick. Sa regular na bid, mag-lead para itakda ang trump at humiling ng baraha para sa partner. Sundan ang suit kapag kaya. Makukuha o mawawala sa magkapareha ang halaga ng bid; makakakuha naman ang iba ng puntos ayon sa mga trick na napanalunan nila. Panalo ang may pinakamataas na puntos kapag may umabot sa 52.',
};

export const amerikanerCardGameTranslationOverrides = Object.freeze({
  ...preserveSourceTitle,
  zh_tw: { ...preserveSourceTitle.zh_tw, ...zhTw, [sharedSourceName]: sharedSourceName },
  tl: { ...preserveSourceTitle.tl, ...tl },
});
