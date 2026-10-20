export function normalizeTilt(value) {
  const angle = Number(value);
  if (!Number.isFinite(angle) || angle < -180 || angle > 180) throw new RangeError('Enter a tilt from −180° to 180°.');
  return Math.max(-45, Math.min(45, angle));
}
export function orientationTilt(event, axis = 'side-to-side') {
  const value = axis === 'front-to-back' ? event.beta : event.gamma;
  if (!Number.isFinite(value)) throw new TypeError('This device did not provide a usable orientation angle.');
  return normalizeTilt(value);
}
export function bubblePosition(angle, axis = 'side-to-side') {
  const offset = Math.max(-1, Math.min(1, normalizeTilt(angle) / 30));
  return Object.freeze(axis === 'front-to-back' ? { x: 0, y: offset } : { x: offset, y: 0 });
}
