export const sokobanEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Sokoban',
  title: 'Sokoban game online free, unlimited | UsefulVerse',
  description: 'Play free Sokoban online. Push each box onto a goal, undo moves, restart levels, and use keyboard or touch controls in your browser.',
  intro: 'Push every box onto a goal without trapping it. Play two original short levels with undo, restart, move and push counts, and keyboard or touch controls.',
  howQuestion: 'How do you play Sokoban?',
  howAnswer: 'Move the player and push boxes onto every goal. You can push only one box at a time, never pull one, and undo a move if you need to try again.',
  privacyQuestion: 'Does Sokoban save or upload my game?',
  privacyAnswer: 'No. The two levels and all moves run in this browser. No account, upload or server is used.',
  fields: {
    level: 'Choose a level', board: 'Puzzle board', player: 'Player', playerOnGoal: 'Player on goal', box: 'Box', boxOnGoal: 'Box on goal', goal: 'Goal', floor: 'Floor', wall: 'Wall',
    moves: 'Moves', pushes: 'Pushes', accuracyNote: 'Two original local levels. A box cannot be pulled; use Undo if you need to reverse a push.',
    rules: 'Move with the arrow keys or W, A, S, D, or use the on-screen direction buttons. Push boxes onto all goals. Boxes cannot pass through walls, each other, or be pulled. Undo reverses the last move. Restart returns to the start of the selected level.',
  },
  actions: { newGame: 'New game', restart: 'Restart level', undo: 'Undo move', up: 'Move up', down: 'Move down', left: 'Move left', right: 'Move right', levelOne: 'First push', levelTwo: 'Up the lane', rules: 'How to play', result: 'Level result' },
  messages: {
    ready: 'Level ready. Move the player to push a box.', moved: 'Move {moves}; pushes {pushes}.', blocked: 'That move is blocked.', levelComplete: 'Level {level} complete in {moves} moves and {pushes} pushes.',
    undoEmpty: 'There is no move to undo.', restarted: 'Level restarted.', chooseLevel: 'Choose one of the available levels.',
  },
  additionalFaqs: [
    { question: 'Can I pull boxes in Sokoban?', answer: 'No. Boxes can only be pushed, one at a time. Undo can reverse your last move.' },
    { question: 'Can I play Sokoban without downloading anything?', answer: 'Yes. These two original levels run in your browser with keyboard or touch controls.' },
  ],
});
