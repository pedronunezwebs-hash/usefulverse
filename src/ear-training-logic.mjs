export const EAR_INTERVALS = Object.freeze([
  { id: 'minor-second', semitones: 1, label: 'Minor second' },
  { id: 'major-second', semitones: 2, label: 'Major second' },
  { id: 'minor-third', semitones: 3, label: 'Minor third' },
  { id: 'major-third', semitones: 4, label: 'Major third' },
  { id: 'perfect-fourth', semitones: 5, label: 'Perfect fourth' },
  { id: 'tritone', semitones: 6, label: 'Tritone' },
  { id: 'perfect-fifth', semitones: 7, label: 'Perfect fifth' },
  { id: 'octave', semitones: 12, label: 'Octave' },
]);

export function createEarTrainingQuestion({ intervals = EAR_INTERVALS.map(({ id }) => id), direction = 'ascending', random = Math.random } = {}) {
  if (!Array.isArray(intervals) || !intervals.length || intervals.some((id) => !EAR_INTERVALS.some((item) => item.id === id))) {
    throw new RangeError('Choose at least one supported interval.');
  }
  if (!['ascending', 'descending', 'random'].includes(direction)) throw new RangeError('Choose ascending, descending or random direction.');
  const choices = EAR_INTERVALS.filter(({ id }) => intervals.includes(id));
  const interval = choices[Math.floor(random() * choices.length) % choices.length];
  const actualDirection = direction === 'random' ? (random() < 0.5 ? 'ascending' : 'descending') : direction;
  const firstMidi = 60 + Math.floor(random() * 13);
  return {
    intervalId: interval.id,
    semitones: interval.semitones,
    direction: actualDirection,
    firstMidi,
    secondMidi: firstMidi + (actualDirection === 'ascending' ? interval.semitones : -interval.semitones),
  };
}

export function validateEarTrainingSettings({ questions, direction } = {}) {
  const count = Number(questions);
  if (![5, 10, 20].includes(count)) throw new RangeError('Choose 5, 10 or 20 questions.');
  if (!['ascending', 'descending', 'random'].includes(direction)) throw new RangeError('Choose ascending, descending or random direction.');
  return { questions: count, direction };
}

export function checkEarTrainingAnswer(question, intervalId) {
  return Boolean(question && EAR_INTERVALS.some(({ id }) => id === intervalId) && question.intervalId === intervalId);
}
