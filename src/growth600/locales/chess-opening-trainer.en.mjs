export const chessOpeningTrainerEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Chess Opening Trainer',
  title: 'Free Chess Opening Trainer | UsefulVerse',
  description: 'Practice 10 chess opening lines online for free. Play as White or Black, get move corrections and keep every move on your device.',
  intro: 'Practice a small set of familiar opening lines by making the moves yourself. Choose a line and a side; the other side follows the example automatically.',
  howQuestion: 'How do you practice a chess opening here?',
  howAnswer: 'Choose an opening and play as White or Black. Select one of your pieces, then its destination square. Correct moves continue the line; an off-line move is undone and the expected move is shown. Use Hint to highlight the next move or New line to restart.',
  privacyQuestion: 'Are my chess moves uploaded or saved?',
  privacyAnswer: 'No. The board and move checks run in this browser. Moves are not uploaded or saved to a profile.',
  fields: {
    opening: 'Opening line', side: 'Practice as', white: 'White', black: 'Black', board: 'Chess board', moves: 'Moves played', progressLabel: 'Line progress', square: 'Square', empty: 'empty square', accuracyNote: 'This is a short sample repertoire, not complete opening theory, engine analysis or coaching. Chess rules are checked locally in your browser.',
    opening_italian: 'Italian Game', opening_sicilian: 'Sicilian Defense', opening_ruy_lopez: 'Ruy Lopez', opening_french: 'French Defense', opening_caro_kann: 'Caro-Kann Defense', opening_queens_gambit: "Queen's Gambit Declined", opening_london: 'London System', opening_scandinavian: 'Scandinavian Defense', opening_english: 'English Opening', opening_kings_indian: "King's Indian Defense",
    piece_wp: 'white pawn', piece_wn: 'white knight', piece_wb: 'white bishop', piece_wr: 'white rook', piece_wq: 'white queen', piece_wk: 'white king', piece_bp: 'black pawn', piece_bn: 'black knight', piece_bb: 'black bishop', piece_br: 'black rook', piece_bq: 'black queen', piece_bk: 'black king',
    rules: 'Choose an opening and a side. Click or focus one of your pieces, then choose a destination square. Use the arrow keys to move around the board. Correct moves continue the selected line; a legal move outside it is undone and the expected move is shown. Hint highlights the next move.',
  },
  actions: { newGame: 'New line', hint: 'Hint', rules: 'Rules' },
  messages: {
    ready: '{opening}: play {move}.', progress: 'Moves in line: {played} of {total}.', selectPiece: 'Choose one of your pieces first.',
    wrong: 'That move is legal, but outside this sample line. The expected move is {expected}.', illegal: 'That is not a legal move for this piece.', correct: 'Correct move. Continue the line.',
    opponentMove: 'The other side played {moves}. Your turn.', lineComplete: 'Line complete. Start again or choose another opening.', hint: 'The next move is highlighted on the board.',
  },
  additionalFaqs: [
    { question: 'Can I practice as Black?', answer: 'Yes. Choose Black in the side menu. The White moves in the example are played automatically, then you practice Black’s replies.' },
    { question: 'Does this trainer include every chess opening?', answer: 'No. It has ten short sample lines for practice. It is not a complete opening database or a chess engine.' },
    { question: 'Does the chess opening trainer save my progress?', answer: 'No. Moves stay in the current browser page and are not uploaded or saved to an account.' },
  ],
  localizationStatus: 'approved',
});
