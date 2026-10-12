export const ginRummyEnglishCopy = Object.freeze({
  name: 'Gin Rummy',
  title: 'Gin Rummy Game Online Free | UsefulVerse',
  description: 'Play Gin Rummy online against a local browser opponent. Form runs and sets, track deadwood, knock or go gin. Free, no account.',
  intro: 'Play a quick local Gin Rummy hand against a simple computer opponent. Draw, discard and watch your best runs, sets and deadwood total update.',
  howQuestion: 'How do you play this Gin Rummy game?',
  howAnswer: 'Draw one card from the stock or discard pile, then discard one card. Build same-suit runs or equal-rank sets; knock with 10 or fewer deadwood points, or go gin with no deadwood.',
  privacyQuestion: 'Does this Gin Rummy game upload my cards?',
  privacyAnswer: 'No. The deal and play run in this browser. There is no account, upload, server opponent or saved match.',
  additionalFaqs: [
    { question: 'Can I play Gin Rummy against the computer?', answer: 'Yes. One person plays locally against a lightweight browser opponent. It is not multiplayer.' },
    { question: 'What is deadwood in Gin Rummy?', answer: 'Cards not included in a run or set count as deadwood. Aces count as 1, number cards at face value, and face cards as 10.' },
    { question: 'Does this game support layoffs?', answer: 'No. Knock scoring uses the displayed no-layoff variant; house rules can differ.' },
  ],
  fields: {
    yourHand: 'Your hand', opponentHand: 'Opponent hand', stock: 'Cards in stock', discardPile: 'Discard pile top', deadwood: 'Deadwood', score: 'Points this hand', turn: 'Turn', rulesNote: 'Draw one card, then discard one. Sets have the same rank; runs are consecutive ranks in the same suit.', knockHint: 'You may declare knock after discarding with 10 or fewer deadwood points. This game uses a no-layoff scoring variant.', hiddenCard: 'Hidden opponent card', drawPrompt: 'Choose where to draw', discardPrompt: 'Choose a card to discard', rank: 'Rank', clubs: 'clubs', diamonds: 'diamonds', hearts: 'hearts', spades: 'spades', ace: 'Ace', jack: 'Jack', queen: 'Queen', king: 'King',
  },
  actions: { newGame: 'New game', drawStock: 'Draw from stock', drawDiscard: 'Take discard', discard: 'Discard selected card', knock: 'Declare knock' },
  messages: {
    chooseDraw: 'Your turn: draw from the stock or take the top discard.', chooseDiscard: 'Choose one card in your hand to discard.', opponentThinking: 'The local opponent is taking its turn…', playerTurn: 'Your turn.', drewStock: 'You drew from the stock. Discard one card.', drewDiscard: 'You took the top discard. You cannot discard that same card immediately.', invalidKnock: 'Knock requires 10 or fewer deadwood points after your discard.', roundGinYou: 'Gin! You win the hand and score {points} points.', roundGinOpponent: 'The opponent went gin and scored {points} points.', roundKnockYou: 'Your knock wins by {points} points.', roundKnockOpponent: 'The opponent knocked and wins by {points} points.', undercutYou: 'Undercut! The opponent had equal or lower deadwood and scores {points} points.', undercutOpponent: 'Your hand undercut the knock; you score {points} points.', stockEmpty: 'The stock is empty. Start a new hand.', gameStarted: 'New hand dealt. Your turn.',
  },
});
