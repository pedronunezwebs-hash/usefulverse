export const dotsAndBoxesEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Dots and Boxes',
  title: 'Dots and Boxes Online Free | UsefulVerse',
  description: 'Play Dots and Boxes against the computer or a friend. Choose a board size, draw lines, complete boxes and keep your score locally.',
  intro: 'Take turns joining neighboring dots. Complete the fourth side of a box to claim it and play again. The player with the most boxes wins.',
  howQuestion: 'How do you play Dots and Boxes?',
  howAnswer: 'Choose a board and mode, then draw one line between neighboring dots. Completing a box scores one point and keeps your turn. If no box is completed, the turn passes. The game ends when all boxes are claimed.',
  privacyQuestion: 'Is this Dots and Boxes game free and private?',
  privacyAnswer: 'Yes. The board and score run in this browser. There is no account, upload, online opponent or saved score history.',
  fields: {
    boardSize: 'Boxes per side', size3: '3 by 3', size4: '4 by 4', size5: '5 by 5',
    mode: 'Play mode', computer: 'Against the computer', twoPlayers: 'Two players on this device',
    board: 'Game board', instructions: 'Draw one line between neighboring dots. Complete a box to score and keep your turn.',
    playerOne: 'Player 1', playerTwo: 'Player 2', computerName: 'Computer',
    score: 'Score', currentTurn: 'Current turn', horizontalEdge: 'Horizontal line', verticalEdge: 'Vertical line',
    rules: 'A completed box is marked for its owner. In computer mode, the computer closes available boxes first.',
    privacyNote: 'Runs on this device. No account, network game, upload or saved history.',
  },
  actions: { newGame: 'New game' },
  messages: {
    ready: 'New game. Player 1 starts.',
    turnPlayerOne: 'Player 1 to move.',
    turnPlayerTwo: 'Player 2 to move.',
    captured: '{player} completed {count} box. Take another turn.',
    capturedMany: '{player} completed {count} boxes. Take another turn.',
    won: '{player} wins with {count} boxes.',
    tie: 'The game is tied at {count} boxes each.',
  },
  additionalFaqs: [
    { question: 'Can I play against the computer?', answer: 'Yes. The local computer closes a box when it can and otherwise chooses a line that does not immediately give away a box when possible. It is a simple opponent, not a chess-like strategy engine.' },
    { question: 'Can two people play on one device?', answer: 'Yes. Choose two-player mode and take turns on the same screen.' },
    { question: 'Does the game save my score?', answer: 'No. Scores exist only for the current game in this browser tab.' },
    { question: 'How does the computer choose a line?', answer: 'It first takes a line that completes a box. Otherwise it avoids giving away a box immediately when it can, then chooses among remaining lines.' },
  ],
});

export default dotsAndBoxesEnglishCopy;
