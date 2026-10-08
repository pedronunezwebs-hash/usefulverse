export const dominoesGameEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Dominoes game',
  title: 'Dominoes game free online, unlimited | UsefulVerse',
  description: 'Play double-six dominoes online against the computer or with a friend. Draw or block rules, free and no download.',
  intro: 'Start a double-six game, match either open end and choose draw or block rules. Play solo against a simple local opponent or pass one device.',
  howQuestion: 'How do you play dominoes online?',
  howAnswer: 'Each player gets seven tiles. The highest double in either hand opens; if neither hand has a double, the highest-value tile opens. Match one end of a tile to either open end of the line. In draw mode, take tiles from the stock until you can play or it is empty. In block mode, pass when you cannot play. The round ends when a hand is empty or neither player can move; the player with fewer remaining pips wins a blocked round.',
  privacyQuestion: 'Are my game or moves uploaded?',
  privacyAnswer: 'No. The deal, board and computer opponent run in this browser. There is no account, upload or online multiplayer.',
  fields: {
    mode: 'Play mode', variant: 'Rules', board: 'Domino line', stock: 'Tiles left to draw', hand: 'Your tiles', opponentHand: "Opponent's tiles",
    accuracyNote: 'A local double-six game. Rules and opening conventions can vary by region. The computer uses a simple strategy, not an online opponent.',
    rules: 'Match the number at one open end. Choose a legal tile and side. Draw mode lets you draw until a move is available or the stock is empty; block mode skips drawing. If the stock is empty and both players are blocked, the player with fewer pips in hand wins. A player who uses every tile wins the round.',
  },
  actions: {
    newGame: 'New game', rules: 'How to play', result: 'Round result', computer: 'Play against computer', twoPlayers: 'Two players on this device',
    drawRule: 'Draw dominoes', blockRule: 'Block dominoes', draw: 'Draw a tile', pass: 'Pass turn', playLeft: 'Play left', playRight: 'Play right',
  },
  messages: {
    playerOne: 'Player one', playerTwo: 'Player two', turn: "{player}'s turn.", played: 'Tile played.', drew: 'Tile drawn.', passed: 'Turn passed.',
    noMoves: 'No legal move. Draw a tile or pass.', stockEmpty: 'The draw pile is empty.', playerOneWins: 'Player one wins the round.', playerTwoWins: 'Player two wins the round.',
    tie: 'The round is a tie.', gameOver: 'Round over.',
  },
  additionalFaqs: [
    { question: 'What is the difference between draw and block dominoes?', answer: 'In draw dominoes, a player with no legal tile draws from the stock until they can play or the stock runs out. In block dominoes, that player passes instead. This page supports both options.' },
    { question: 'Can I play dominoes with another person?', answer: 'Yes. Choose two players on this device and take turns. The game does not connect players over the internet.' },
  ],
});
