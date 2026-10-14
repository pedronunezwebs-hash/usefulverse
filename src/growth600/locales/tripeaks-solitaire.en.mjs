export const tripeaksSolitaireEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Tripeaks Solitaire',
  title: 'Tripeaks Solitaire Online Free | UsefulVerse',
  description: 'Play Tripeaks Solitaire free. Clear exposed cards one rank above or below the waste, score 10 points per card and undo moves.',
  intro: 'Clear all three peaks by removing an exposed card one rank above or below the waste card. Draw from the stock when no match is available.',
  howQuestion: 'How do you play Tripeaks Solitaire?',
  howAnswer: 'Remove exposed tableau cards one rank above or below the waste; aces connect to kings and twos. Each cleared card scores 10 points. Draw when needed, undo a move or start a new deal.',
  privacyQuestion: 'Is this Tripeaks Solitaire game free and private?',
  privacyAnswer: 'Yes. The shuffled deck and moves run in this browser. There is no account, upload, online opponent or saved score history.',
  fields: {
    instructions: 'Remove any exposed card one rank above or below the waste card. Aces connect to kings and twos. Draw a card when no move is available.',
    board: 'Three-peaks tableau', stock: 'Stock', waste: 'Waste pile', emptyWaste: 'No waste card yet', faceDown: 'Face-down card', removed: 'Cleared card', covered: 'Covered card', exposed: 'Exposed card',
    moves: 'Moves', score: 'Score', remaining: 'Cards left in peaks', status: 'Game status', hint: 'A playable card is highlighted.', privacyNote: 'Each tableau card cleared earns 10 points; drawing earns none. Runs on this device. No account, upload or saved game history.',
  },
  actions: { newGame: 'New deal', draw: 'Draw card', undo: 'Undo', hint: 'Show a move' },
  messages: { ready: 'New deal. Remove a card that matches the waste by one rank.', drawn: 'Card drawn.', removed: 'Card cleared.', noMove: 'No exposed card matches the waste. Draw from the stock.', noHint: 'There is no available move. Draw from the stock.', won: 'All three peaks are clear. You win!', stuck: 'No moves remain. Start a new deal.', undone: 'Last move undone.', invalidMove: 'Choose an exposed card one rank above or below the waste.', stockEmpty: 'The stock is empty.' },
  additionalFaqs: [
    { question: 'Which cards can I remove in Tripeaks?', answer: 'You can remove any uncovered tableau card one rank above or below the top waste card. Aces connect to kings and twos.' },
    { question: 'Can I recycle the stock pile?', answer: 'No. This version uses one pass through the stock, so plan around the cards available in the current deal.' },
    { question: 'Does this solitaire game save my progress?', answer: 'No. The deal and undo history stay only in the current browser tab and are not uploaded or saved.' },
  ],
});
export default tripeaksSolitaireEnglishCopy;
