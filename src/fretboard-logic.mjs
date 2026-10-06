export const NOTE_NAMES = Object.freeze(['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']);
export const FRETBOARD_STRINGS = Object.freeze([
  { string: 6, openNote: 4, label: 'Low E' },
  { string: 5, openNote: 9, label: 'A' },
  { string: 4, openNote: 2, label: 'D' },
  { string: 3, openNote: 7, label: 'G' },
  { string: 2, openNote: 11, label: 'B' },
  { string: 1, openNote: 4, label: 'High E' },
]);

export function noteAtPosition(stringNumber, fret) {
  if (!Number.isInteger(stringNumber) || stringNumber < 1 || stringNumber > 6) throw new RangeError('String must be an integer from 1 to 6.');
  if (!Number.isInteger(fret) || fret < 0 || fret > 24) throw new RangeError('Fret must be an integer from 0 to 24.');
  const string = FRETBOARD_STRINGS.find((item) => item.string === stringNumber);
  return NOTE_NAMES[(string.openNote + fret) % 12];
}

export function createFretboardQuestion(random = Math.random, previous = null) {
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random value must be in [0, 1).');
  const position = Math.floor(value * 78);
  const question = { string: FRETBOARD_STRINGS[Math.floor(position / 13)].string, fret: position % 13 };
  if (previous && previous.string === question.string && previous.fret === question.fret) {
    question.fret = (question.fret + 1) % 13;
  }
  return { ...question, note: noteAtPosition(question.string, question.fret) };
}

export function isCorrectNote(question, answer) {
  return Boolean(question && NOTE_NAMES.includes(question.note) && answer === question.note);
}
