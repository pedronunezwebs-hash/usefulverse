export const HEARING_TONE_FREQUENCIES_HZ = Object.freeze([250, 500, 1000, 2000, 4000, 6000]);

export function createHearingObservation(responses = {}) {
  const entries = HEARING_TONE_FREQUENCIES_HZ.map((frequency) => {
    const response = responses[frequency] ?? 'skipped';
    if (!['heard', 'not-heard', 'skipped'].includes(response)) throw new RangeError('Choose heard, not heard or skipped for each tone.');
    return Object.freeze({ frequency, response });
  });
  return Object.freeze(entries);
}
