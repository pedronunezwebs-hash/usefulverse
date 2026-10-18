const PUZZLES = Object.freeze([
  Object.freeze({ id: 'head-heels', rows: ['HEAD', 'HEELS'], answer: 'head over heels', hints: ['Read the two words from top to bottom.', 'One word is positioned over the other.'], explanation: 'HEAD is placed over HEELS, so the phrase is “head over heels”.' }),
  Object.freeze({ id: 'man-overboard', rows: ['MAN', 'BOARD'], answer: 'man overboard', hints: ['The first word sits above the second.', 'Read MAN over BOARD.'], explanation: 'MAN appears over BOARD: “man overboard”.' }),
  Object.freeze({ id: 'i-understand', rows: ['I', 'STAND'], answer: 'i understand', hints: ['Say the letter name and the lower word together.', 'I is placed over STAND.'], explanation: 'I over STAND sounds like “I understand”.' }),
  Object.freeze({ id: 'mind-over-matter', rows: ['MIND', 'MATTER'], answer: 'mind over matter', hints: ['The top word is positioned over the lower one.', 'Read MIND over MATTER.'], explanation: 'MIND is over MATTER: “mind over matter”.' }),
  Object.freeze({ id: 'between-lines', rows: ['────────', 'READ', '────────', 'THE', 'LINES'], answer: 'read between the lines', hints: ['READ is inside two horizontal lines.', 'The words “the lines” complete the phrase.'], explanation: 'READ sits between the lines, giving “read between the lines”.' }),
  Object.freeze({ id: 'tricycle', rows: ['CYCLE  CYCLE  CYCLE'], answer: 'tricycle', hints: ['Count how many times CYCLE appears.', 'There are three cycles.'], explanation: 'Three cycles combine to suggest “tricycle”.' }),
  Object.freeze({ id: 'five-in-a-row', rows: ['1  2  3  4  5'], answer: 'five in a row', hints: ['There are five numbers.', 'They are arranged on one horizontal line.'], explanation: 'Five items appear in one row: “five in a row”.' }),
  Object.freeze({ id: 'broken-in-two', rows: ['BRO', '—', 'KEN'], answer: 'broken in two', hints: ['The word BROKEN is split into two parts.', 'The dash marks the break between the parts.'], explanation: 'BROKEN is shown in two pieces: “broken in two”.' }),
  Object.freeze({ id: 'top-secret', rows: ['TOP', 'SECRET'], answer: 'top secret', hints: ['The first word is above the second.', 'Read the two words literally.'], explanation: 'TOP is above SECRET: “top secret”.' }),
  Object.freeze({ id: 'once-upon-time', rows: ['ONCE', 'UPON', 'A', 'TIME'], answer: 'once upon a time', hints: ['Read each line in order.', 'The four lines form a familiar opening phrase.'], explanation: 'The stacked words read “once upon a time”.' }),
]);

export function normalizeRebusAnswer(value) {
  if (typeof value !== 'string') return '';
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/gu, '').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/gu, ' ');
}

function shuffle(values, random) {
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('The random source must return a value from 0 inclusive to 1 exclusive.');
    const j = Math.floor(value * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createRebusSession({ random = Math.random } = {}) {
  return Object.freeze({ order: Object.freeze(shuffle(PUZZLES.map(({ id }) => id), random)), index: 0, hintLevel: 0, solved: false, revealed: false, correct: 0, attempts: 0 });
}

export function getCurrentRebus(session) {
  const id = session?.order?.[session.index];
  const puzzle = PUZZLES.find((item) => item.id === id);
  if (!puzzle) return null;
  return Object.freeze({ id: puzzle.id, rows: puzzle.rows, hint: session.hintLevel > 0 ? puzzle.hints[Math.min(session.hintLevel - 1, puzzle.hints.length - 1)] : '', explanation: session.solved || session.revealed ? puzzle.explanation : '', answer: session.solved || session.revealed ? puzzle.answer : '', solved: Boolean(session.solved), revealed: Boolean(session.revealed), hintLevel: session.hintLevel, hintsAvailable: puzzle.hints.length - session.hintLevel });
}

export function submitRebusAnswer(session, value) {
  const puzzle = PUZZLES.find(({ id }) => id === session?.order?.[session.index]);
  if (!puzzle || session.solved || session.revealed) return Object.freeze({ session, correct: false, ignored: true });
  const correct = normalizeRebusAnswer(value) === normalizeRebusAnswer(puzzle.answer);
  const next = Object.freeze({ ...session, solved: correct, attempts: session.attempts + 1, correct: session.correct + Number(correct) });
  return Object.freeze({ session: next, correct, ignored: false });
}

export function requestRebusHint(session) {
  const puzzle = PUZZLES.find(({ id }) => id === session?.order?.[session.index]);
  if (!puzzle || session.solved || session.revealed || session.hintLevel >= puzzle.hints.length) return session;
  return Object.freeze({ ...session, hintLevel: session.hintLevel + 1 });
}

export function revealRebusAnswer(session) {
  if (!session || session.solved || session.revealed) return session;
  return Object.freeze({ ...session, revealed: true });
}

export function nextRebusPuzzle(session) {
  if (!session || session.index >= session.order.length - 1) return null;
  return Object.freeze({ ...session, index: session.index + 1, hintLevel: 0, solved: false, revealed: false });
}

export function resetRebusSession({ random = Math.random } = {}) {
  return createRebusSession({ random });
}

export const REBUS_PUZZLE_COUNT = PUZZLES.length;
