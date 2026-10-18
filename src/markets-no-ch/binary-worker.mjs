import { generateBinaryPuzzle } from './logic.mjs';

self.addEventListener('message', ({ data }) => {
  try {
    const puzzle = generateBinaryPuzzle(data);
    self.postMessage({ ok: true, puzzle });
  } catch (error) {
    self.postMessage({ ok: false, message: String(error?.message || 'Unable to make a puzzle.') });
  }
});
