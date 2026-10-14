export const chessAnalysisBoardEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Chess Analysis Board',
  title: 'Free Chess Analysis Board & Engine | UsefulVerse',
  description: 'Analyze chess locally with a free lite engine. Replay FEN or PGN, compare up to three lines and stop the search at any time.',
  intro: 'Replay a game, explore legal moves, or load a FEN or PGN. When you choose Analyze, a lite chess engine runs on this device and can be stopped at any time.',
  howQuestion: 'What can I do on this chess analysis board?',
  howAnswer: 'Move pieces, step through a game, load FEN or PGN, then choose a search depth or time and select Analyze. The engine runs locally and Stop terminates its worker.',
  privacyQuestion: 'Does chess analysis upload my game?',
  privacyAnswer: 'No. The board and optional Stockfish Lite engine run in your browser. The engine files download only after you choose Analyze; positions are not sent to a server.',
  fields: {
    board: 'Chess board', instructions: 'Select one of your pieces, then a legal destination. Use the previous and next buttons to replay moves.', square: 'Square', empty: 'empty', piece_k: 'king', piece_q: 'queen', piece_r: 'rook', piece_b: 'bishop', piece_n: 'knight', piece_p: 'pawn',
    fen: 'FEN position', fenHint: 'Leave blank to start from the standard chess position.', pgn: 'PGN game', pgnHint: 'Paste a PGN game to load it locally.',
    promotion: 'Promote pawn to', queen: 'Queen', rook: 'Rook', bishop: 'Bishop', knight: 'Knight',
    currentPosition: 'Current position', moveNumber: 'Move', moveList: 'Moves', noMoves: 'No moves yet.',
    white: 'White', black: 'Black', check: 'Check', checkmate: 'Checkmate', draw: 'Draw',
    fenOutput: 'Current FEN', pgnOutput: 'Current PGN', analysisNote: 'Stockfish Lite is smaller and weaker than the full engine. Its evaluation can be incomplete and is not advice.', engineTitle: 'Local engine analysis', engineMode: 'Limit by', engineDepth: 'Depth', engineTime: 'Time (seconds)', engineLines: 'Up to three principal variations. Scores are engine output, not advice.', engineScore: 'Score', mate: 'Mate in', engineLicense: 'Engine licence and source',
    notes: 'Private notes for this position', notesHint: 'Notes stay only in this page and are not saved or uploaded.', privacyNote: 'No account, upload or saved history. Imported games stay in this browser tab.',
  },
  actions: { newGame: 'Standard position', loadFen: 'Load FEN', loadPgn: 'Load PGN', previous: 'Previous move', next: 'Next move', copyFen: 'Copy FEN', copyPgn: 'Copy PGN', analyze: 'Analyze', stop: 'Stop' },
  messages: { ready: 'Standard chess position is ready.', moved: 'Legal move played.', illegal: 'That move is not legal.', loadedFen: 'FEN position loaded.', loadedPgn: 'PGN game loaded.', invalidFen: 'Could not load that FEN position.', invalidPgn: 'Could not read that PGN game.', copiedFen: 'FEN copied.', copiedPgn: 'PGN copied.', copyUnavailable: 'Copy is not available here.', beginning: 'Already at the start.', end: 'Already at the latest move.', check: 'The side to move is in check.', checkmate: 'Checkmate.', draw: 'The game is drawn.', engineLoading: 'Loading the local chess engine. This downloads about 1.8 MB once.', engineReady: 'Local engine is ready.', analysisRunning: 'Analyzing this position on your device…', analysisComplete: 'Analysis complete.', analysisStopped: 'Analysis stopped; the engine worker was closed.', engineUnavailable: 'This browser could not start the local chess engine.', engineFailed: 'The local engine stopped unexpectedly.', noVariation: 'The engine did not return a variation.' },
  additionalFaqs: [
    { question: 'Does this chess board analyze positions with Stockfish?', answer: 'Yes. On request it loads the lite single-threaded Stockfish engine in a browser worker, with depth or time limits and up to three principal variations. The engine is weaker than the full build and does not provide guaranteed advice.' },
    { question: 'Can I open a PGN game or a FEN position?', answer: 'Yes. Paste one into the matching field and choose its load button. The input stays in this browser tab and is bounded in size.' },
    { question: 'Can I save my notes or game online?', answer: 'No. Notes and moves are not uploaded or automatically saved. Copy the FEN or PGN if you want to keep a position or game elsewhere.' },
  ],
});
export default chessAnalysisBoardEnglishCopy;
