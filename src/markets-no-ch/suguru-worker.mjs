import { countSuguruSolutions, generateSuguruPuzzle, validateSuguruBoard } from './suguru.mjs';

self.addEventListener('message', ({ data }) => {
  const { id, type, payload } = data ?? {};
  try {
    if (type === 'generate') {
      const puzzle = generateSuguruPuzzle(payload);
      self.postMessage({ id, ok: true, puzzle });
      return;
    }
    if (type === 'check') {
      const checked = validateSuguruBoard({ ...payload.puzzle, values: payload.values });
      const solved = checked.valid && checked.complete && payload.values.every((value, index) => value === payload.puzzle.solution[index]);
      self.postMessage({ id, ok: true, result: { ...checked, solved } });
      return;
    }
    if (type === 'hint') {
      const { puzzle, values, cell } = payload;
      if (!Number.isInteger(cell) || values[cell]) throw new Error('Select an empty cell first.');
      const region = puzzle.regions.find((cells) => cells.includes(cell));
      const used = new Set(region.filter((other) => values[other]).map((other) => values[other]));
      const row = Math.floor(cell / puzzle.width);
      const column = cell % puzzle.width;
      const adjacent = [];
      for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
        if (!dr && !dc) continue;
        const r = row + dr; const c = column + dc;
        if (r >= 0 && r < puzzle.height && c >= 0 && c < puzzle.width) adjacent.push(r * puzzle.width + c);
      }
      const neighborValues = new Set(adjacent.map((other) => values[other]).filter(Boolean));
      const candidates = Array.from({ length: region.length }, (_, index) => index + 1).filter((value) => !used.has(value) && !neighborValues.has(value));
      const independent = countSuguruSolutions({ width: puzzle.width, height: puzzle.height, regions: puzzle.regions, givens: values }, { limit: 1, maxNodes: 80_000 });
      self.postMessage({ id, ok: true, hint: { cell, candidates, value: puzzle.solution[cell], logical: candidates.length === 1, rule: candidates.length === 1 ? 'single-candidate' : 'regional-range-and-neighbors', consistent: independent.count > 0 } });
      return;
    }
    throw new Error('Unknown puzzle-worker action.');
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});
