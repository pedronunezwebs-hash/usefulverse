// Manual corrections for newly added group-rule controls where a literal machine translation changed the card-game meaning.
export const presidentCardGameTranslationOverrides = Object.freeze({
  fr: Object.freeze({
    'Player holding 3♣': 'Joueur qui possède le 3 de trèfle',
  }),
  it: Object.freeze({
    '{player} finished first.': '{player} si è classificato al primo posto.',
  }),
  ja: Object.freeze({
    'This match uses {opening} to start the first deal, {reentry} after passing and card exchange {exchange}. The first player to reach {target} points wins. One deck is used for 3–6 players and two for 7–8; no jokers.': 'この対戦では、最初の配りで{opening}を使い、パス後の再参加は{reentry}、カード交換は{exchange}に設定されています。先に{target}点に達したプレイヤーが勝ちです。3〜6人では52枚のデッキを1組、7〜8人では2組を使い、ジョーカーは使いません。',
  }),
  zh_tw: Object.freeze({
    'Group rules this game: first lead — {opening}; rejoining after passing — {reentry}; position exchange — {exchange}; first to {target} points wins.': '本場遊戲的群組規則：首輪由{opening}開始；出牌後可否重新加入：{reentry}；依排名交換手牌：{exchange}。第一位達到{target}分的玩家獲勝。',
  }),
  es: Object.freeze({
    'Who starts the first deal?': '¿Quién sale primero en la primera ronda?',
    'Can a player rejoin after passing?': '¿Permitir que alguien vuelva a jugar después de pasar?',
    Enabled: 'Permitido',
    Disabled: 'No permitido',
    'Exchange cards by finish position': 'Intercambiar cartas según la posición final',
    'Group rules this game: first lead — {opening}; rejoining after passing — {reentry}; position exchange — {exchange}.': 'Reglas de grupo: salida inicial — {opening}; volver tras pasar — {reentry}; intercambio según la posición — {exchange}.',
    'Group rules this game: first lead — {opening}; rejoining after passing — {reentry}; position exchange — {exchange}; first to {target} points wins.': 'Reglas de esta partida: primera salida — {opening}; volver tras pasar — {reentry}; intercambio de cartas — {exchange}. Gana quien llegue primero a {target} puntos.',
    'This match uses {opening} to start the first deal, {reentry} after passing and card exchange {exchange}. The first player to reach {target} points wins. One deck is used for 3–6 players and two for 7–8; no jokers.': 'Esta partida usa {opening} para empezar, {reentry} para permitir volver tras pasar y el intercambio de cartas {exchange}. Gana quien alcance primero {target} puntos. Se usa una baraja para 3–6 jugadores y dos para 7–8; no hay comodines.',
  }),
  nb: Object.freeze({
    'Who starts the first deal?': 'Hvem starter den første given?',
    'Player holding 3♣': 'Spilleren som har kløver 3',
    'Can a player rejoin after passing?': 'Tillat å spille igjen etter at du har meldt pass?',
    Enabled: 'Ja',
    Disabled: 'Nei',
    'Exchange cards by finish position': 'Kortbytte etter plassering',
    'Group rules this game: first lead — {opening}; rejoining after passing — {reentry}; position exchange — {exchange}.': 'Gruppens regler: første utspill — {opening}; spille igjen etter pass — {reentry}; kortbytte etter plassering — {exchange}.',
    'Group rules this game: first lead — {opening}; rejoining after passing — {reentry}; position exchange — {exchange}; first to {target} points wins.': 'Gruppens regler: første utspill — {opening}; spille igjen etter pass — {reentry}; kortbytte — {exchange}. Første spiller til {target} poeng vinner.',
    'This match uses {opening} to start the first deal, {reentry} after passing and card exchange {exchange}. The first player to reach {target} points wins. One deck is used for 3–6 players and two for 7–8; no jokers.': 'I dette spillet brukes {opening} ved første utspill, {reentry} etter pass og kortbytte {exchange}. Første spiller til {target} poeng vinner. Det brukes én kortstokk for 3–6 spillere og to for 7–8; ingen jokere.',
    'Game started. Player 1 leads the first deal.': 'Spillet startet. Spiller 1 starter den første given.',
  }),
});
