export const aimTrainerEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Aim Trainer', title: 'Aim Trainer Online Free | UsefulVerse',
  description: 'Practice mouse or touch aim in quick rounds. Track hits, misses and accuracy with targets kept inside the play area. Runs in your browser.',
  intro: 'Start a 15, 30 or 60 second round. Click the target for a hit; click elsewhere in the play area for a miss. Your score stays on this device.',
  howQuestion: 'How does this online aim trainer work?',
  howAnswer: 'Choose a round length and target size, then start. One click counts as one hit or miss. The target moves only after a click and stays inside the play area. This is a simple browser practice tool, not a measure of skill in a specific game.',
  privacyQuestion: 'Is this aim trainer free and private?',
  privacyAnswer: 'Yes. The practice round runs locally in your browser. It does not upload clicks, use an account or save a score history.',
  fields: {
    duration: 'Round length', duration15: '15 seconds', duration30: '30 seconds', duration60: '60 seconds',
    targetSize: 'Target size', targetLarge: 'Large', targetRegular: 'Medium', targetSmall: 'Small',
    areaLabel: 'Aim practice area', areaNote: 'Click the target to score a hit. Click the empty area to record a miss.',
    target: 'Target', hits: 'Hits', misses: 'Misses', accuracy: 'Accuracy', timeLeft: 'Time left',
    resultTitle: 'Round result', privacyNote: 'No account, upload or saved history. Mouse and touch input are supported.',
  },
  actions: { start: 'Start round', restart: 'Play again' },
  messages: { starting: 'Round started.', hit: 'Hit.', miss: 'Miss.', finished: 'Round finished.', ready: 'Choose settings and start.' },
  additionalFaqs: [
    { question: 'Can I use this aim trainer on a phone?', answer: 'Yes. You can tap the targets. A mouse is not required, though the exercise is designed for mouse or touch practice.' },
    { question: 'Does this test gaming skill or mouse hardware?', answer: 'No. It is a simple target-click exercise. It does not emulate a game, measure device polling rate or diagnose hardware.' },
    { question: 'Is my score saved?', answer: 'No. The current round is held in the page memory and is cleared when you leave or reload.' },
  ],
});
export default aimTrainerEnglishCopy;
