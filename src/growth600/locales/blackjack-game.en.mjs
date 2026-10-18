export const blackjackGameEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Blackjack Game',
  title: 'Blackjack Game Online Free | UsefulVerse',
  description: 'Play free blackjack practice in your browser. Hit, stand, double or split a hand; no bets, chips, prizes or money.',
  intro: 'Practice blackjack with one shuffled deck. Hit, stand, double for one final card, or split equal ranks once. No chips, betting, prizes or real money.',
  howQuestion: 'How do I play this blackjack game?',
  howAnswer: 'Get closer to 21 than the dealer without going over. Double is allowed on a two-card hand and draws one final card. Split equal ranks once into two hands; play each hand in order. No wager is made or doubled.',
  privacyQuestion: 'Is this a real-money blackjack game?',
  privacyAnswer: 'No. This is a free practice game with no wager, chips, cash, prize, account or online opponent. The shuffled deck and session score stay in this browser tab.',
  fields: {
    player: 'Your hand', hand: 'Hand', dealer: 'Dealer hand', score: 'Hand value', hidden: 'Face-down card', remaining: 'Cards remaining',
    rounds: 'Rounds', wins: 'Wins', losses: 'Losses', pushes: 'Ties', gameStatus: 'Game status',
    suit_spades: 'spades', suit_hearts: 'hearts', suit_diamonds: 'diamonds', suit_clubs: 'clubs',
    rules: 'A fresh 52-card deck is shuffled each round. Double is available on a two-card hand and takes one card. Split is available once for two cards of the same rank; each new hand gets one card. No wager or payout exists. The dealer draws below 17 and stands on 17.',
    privacyNote: 'Practice only: no betting, chips, money, prizes, account or network play.',
  },
  actions: { newRound: 'New hand', hit: 'Hit', stand: 'Stand', double: 'Double (one card)', split: 'Split' },
  messages: {
    ready: 'Start a new hand when ready.', playerTurn: 'Your turn: hit or stand.', dealerTurn: 'Dealer plays.', playerWins: 'You win this hand.', dealerWins: 'Dealer wins this hand.', push: 'This hand is a tie.',
    bust: 'You went over 21. Dealer wins.', blackjack: 'Blackjack. You win this hand.', naturalPush: 'Both hands have blackjack. This hand is a tie.', invalidDouble: 'Double is available only on a two-card hand.', invalidSplit: 'Split needs two cards of the same rank and can be used once.', splitReady: 'The cards are split. Play the first hand.',
  },
  additionalFaqs: [
    { question: 'Can I bet or win money?', answer: 'No. There are no wagers, virtual chips, cash prizes or payment features. It is only a local practice game.' },
    { question: 'How does an ace count?', answer: 'An ace starts at 11. If that would put a hand over 21, it counts as 1 instead.' },
    { question: 'Does the dealer hit on 17?', answer: 'The dealer draws below 17 and stands on every 17, including a soft 17 in this simplified rule set.' },
    { question: 'Can I double down or split in this blackjack practice game?', answer: 'Yes. Double is allowed on a two-card hand and takes one card before the hand stands. You can split two equal ranks once and play both hands. These are practice actions only: no stake or payout is used.' },
  ],
});
export default blackjackGameEnglishCopy;
