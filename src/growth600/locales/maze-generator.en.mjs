export const mazeGeneratorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Maze generator',
  title: 'Maze Generator Online Free, Unlimited | UsefulVerse',
  description: 'Generate a free maze online, solve or play it, reuse a seed, and download an SVG. Runs in your browser with no account.',
  intro: 'Create a fresh maze, follow a generated route or try to reach the exit yourself. Set its size and seed, then save a clean SVG copy.',
  howQuestion: 'How does the maze seed work?',
  howAnswer: 'The same seed and grid size always create the same maze. Change the seed to get another layout, or leave it blank for a random seed.',
  privacyQuestion: 'Is the maze generator free and local?',
  privacyAnswer: 'Yes. Maze creation, solving, play and SVG export run in this browser. Nothing is uploaded and no account is needed.',
  fields: {
    width: 'Width in cells', height: 'Height in cells', seed: 'Seed (optional)', board: 'Maze board', start: 'Start', finish: 'Exit', player: 'Player', path: 'Path', wall: 'Wall', steps: 'Moves', solutionNote: 'The highlighted route is one valid path to the exit.',
    accuracyNote: 'Choose odd dimensions from 9 to 41 columns and 9 to 31 rows. A seed recreates the same layout.',
    rules: 'Use arrow keys or W, A, S, D on the maze, or tap the direction buttons. Reach the pink exit. Show route reveals a path. Generate builds a new maze. Export downloads the maze as SVG.',
  },
  actions: { generate: 'Generate maze', solve: 'Show route', hideSolution: 'Hide route', restart: 'Restart', exportSvg: 'Download SVG', up: 'Move up', down: 'Move down', left: 'Move left', right: 'Move right', rules: 'How to play', result: 'Maze result' },
  messages: {
    ready: 'Maze ready. Find the exit.', generated: 'New maze generated.', blocked: 'A wall blocks that way.', moved: 'Moves: {moves}.', solved: 'You reached the exit in {moves} moves!', routeShown: 'A route to the exit is highlighted.', routeHidden: 'The route is hidden.', restarted: 'Back at the entrance.', downloaded: 'SVG maze downloaded.', invalidSettings: 'Enter odd maze sizes in the supported range.',
  },
  additionalFaqs: [
    { question: 'Can I make the same maze again?', answer: 'Yes. Reuse the same seed and width and height to recreate its layout.' },
    { question: 'Can I print or edit a generated maze?', answer: 'Download the SVG to print it or open it in an SVG editor. It is generated locally in your browser.' },
  ],
});
