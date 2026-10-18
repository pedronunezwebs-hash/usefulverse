import { buildBeadPattern } from './bead-pattern.mjs';

self.addEventListener('message', ({ data }) => {
  const { id, ...options } = data;
  try {
    const pattern = buildBeadPattern(options);
    self.postMessage({ id, ok: true, pattern });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error?.message ?? 'Could not create this pattern.' });
  }
});
