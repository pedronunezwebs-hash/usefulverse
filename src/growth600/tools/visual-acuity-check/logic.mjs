export const ACUITY_LEVELS_LOGMAR = Object.freeze([1, .8, .6, .4, .2, 0]);
export function optotypeSizeCssPx({ distanceCm, logmar, cardWidthPx }) {
  const distance = Number(distanceCm), level = Number(logmar), px = Number(cardWidthPx);
  if (!Number.isFinite(distance) || distance < 100 || distance > 600 || !Number.isFinite(level) || level < 0 || level > 1 || !Number.isFinite(px) || px < 80 || px > 500) throw new RangeError('Check viewing distance and screen calibration.');
  const angleRadians = 5 * 10 ** level * Math.PI / (180 * 60);
  const physicalHeightMm = 2 * distance * 10 * Math.tan(angleRadians / 2);
  return physicalHeightMm * (px / 85.6);
}
export function scoreAcuityLine(answers, expected) {
  if (!Array.isArray(answers) || answers.length !== 5 || !Array.isArray(expected) || expected.length !== 5) throw new RangeError('Each line needs five responses.');
  const correct = answers.reduce((count, answer, i) => count + (answer === expected[i] ? 1 : 0), 0);
  return Object.freeze({ correct, total: 5, passed: correct >= 4 });
}
