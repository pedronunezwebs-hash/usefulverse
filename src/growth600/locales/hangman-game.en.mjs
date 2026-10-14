export const hangmanGameEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Hangman Game',
  title: 'Hangman Game Free Online | UsefulVerse',
  description: 'Play a free hangman word game with three difficulty levels, letter hints and a fresh local word. No account or upload.',
  intro: 'Guess the hidden word one letter at a time. Repeated guesses do not use a turn; choose a hint or change difficulty whenever you like.',
  howQuestion: 'How do you play Hangman?',
  howAnswer: 'Choose one letter per turn. Correct letters appear in every matching position; each incorrect guess uses an attempt. Solve the word before the drawing is complete. Repeating a letter never costs an attempt.',
  privacyQuestion: 'Is this Hangman game free and private?',
  privacyAnswer: 'Yes. The word bank and game run in this browser. Guesses are not uploaded or saved as a history.',
  fields: { difficulty: 'Difficulty', letter: 'Guess one letter', word: 'Hidden word', attempts: 'Wrong guesses', remaining: 'Attempts left', used: 'Guessed letters', privacyNote: 'The translated word bank and game run in this browser. No account, upload or saved history.', rules: 'Guess one letter at a time. Correct guesses uncover every matching letter; a wrong guess uses one attempt. Repeating a guessed letter does not use an attempt. Reveal a letter for a hint or choose a new word.', easy: 'Easy · 10 misses', regular: 'Regular · 8 misses', hard: 'Hard · 6 misses' },
  actions: { newWord: 'New word', guess: 'Guess letter', hint: 'Reveal a letter', restart: 'Play again' },
  messages: { ready: 'New word ready.', correct: 'That letter is in the word.', wrong: 'That letter is not in the word.', duplicate: 'You already guessed that letter. No attempt was used.', invalid: 'Enter one letter or number.', won: 'You solved the word!', lost: 'No attempts remain. The word is shown above.', hint: 'One hidden letter was revealed; no wrong attempt was used.', noHint: 'There are no hidden letters left to reveal.', finished: 'This round is over. Start a new word to keep playing.' },
  wordBank: ['apple', 'forest', 'river', 'mountain', 'library', 'candle', 'planet', 'garden', 'kitchen', 'bridge', 'window', 'ocean', 'bicycle', 'cloud', 'flower', 'lantern', 'island', 'summer', 'coffee', 'music', 'camera', 'pencil', 'pocket', 'shadow'],
  additionalFaqs: [
    { question: 'Do repeated letters use a turn?', answer: 'No. A repeated guess is identified and does not increase the wrong-guess count.' },
    { question: 'How does difficulty work?', answer: 'Difficulty changes the number of incorrect guesses allowed: 10 on easy, 8 on regular and 6 on hard.' },
    { question: 'Are the word lists translated?', answer: 'The page uses a small static word bank translated for each page language. It is not a live dictionary or an unlimited word feed.' },
  ],
});
export default hangmanGameEnglishCopy;
