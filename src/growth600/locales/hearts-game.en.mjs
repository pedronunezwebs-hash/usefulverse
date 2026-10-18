export const heartsGameEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Hearts card game',
  title: 'Hearts card game online free, unlimited | UsefulVerse',
  description: 'Play a free Hearts card game online against three local computer players. Pass cards, follow suit and score the queen of spades.',
  intro: 'Play a full four-player Hearts hand in your browser. Pass three cards, follow suit, avoid points and see the score after the last trick.',
  howQuestion: 'How do you play Hearts online?',
  howAnswer: 'Choose three cards to pass left, right or across, or choose hold. The player with the two of clubs leads. Follow suit when you can. Each heart is one point and the queen of spades is thirteen. The lowest score wins; taking every point in one hand is called shooting the moon.',
  privacyQuestion: 'Are my cards or moves uploaded?',
  privacyAnswer: 'No. The deal, cards and computer players run in this browser. There is no account, upload or online multiplayer.',
  fields: {
    passDirection: 'Pass cards', board: 'Current trick', hand: 'Your hand', scores: 'Hand scores', clubs: 'clubs', diamonds: 'diamonds', spades: 'spades', hearts: 'hearts',
    accuracyNote: 'This free local game uses the visible standard rules: hearts are one point, the queen of spades is thirteen, and shooting the moon gives 26 points to each opponent. House rules can differ.',
    rules: 'Pass three cards left, right or across, or hold. The two of clubs leads. Follow the suit led if you have it. On the first trick, avoid points unless you cannot discard another card. You cannot lead hearts until they are broken, unless your hand only has hearts. Hearts score one point each; the queen of spades scores thirteen. If one player takes all 26 points, that player shoots the moon and each opponent receives 26. Lowest score wins the hand.',
  },
  actions: { newGame: 'New hand', passCards: 'Pass selected cards', passLeft: 'Pass left', passRight: 'Pass right', passAcross: 'Pass across', hold: 'Hold cards', playCard: 'Play card', rules: 'How to play', result: 'Hand result' },
  messages: {
    you: 'You', computer: 'Computer', passing: 'Choose three cards to pass.', selectThree: 'Selected: {count} of 3 cards.', holdReady: 'Keep your cards for this hand.', yourTurn: 'Your turn. Choose a legal card.', computerTurn: 'Computer players are taking their turns.',
    cardPlayed: 'Card played.', trickWon: 'Trick won.', roundWon: 'Hand complete.', roundComplete: 'Hand complete. The scores are shown above.', invalidPass: 'Choose exactly three cards from your hand.', moonShot: 'A player shot the moon.',
  },
  additionalFaqs: [
    { question: 'Can I play Hearts without signing up?', answer: 'Yes. The game runs in this browser, needs no account and does not connect to online players.' },
    { question: 'How are points counted in Hearts?', answer: 'Each heart is one point and the queen of spades is thirteen. The player with the lowest score wins. Taking all 26 points in a hand is called shooting the moon.' },
  ],
});
