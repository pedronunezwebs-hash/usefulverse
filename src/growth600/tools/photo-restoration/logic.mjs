export const RESTORE_LIMITS = Object.freeze({ fileBytes: 15 * 1024 * 1024, pixels: 12_000_000, previewEdge: 1600, historyStrokes: 20, samplesPerStroke: 400 });
export function restoreCoordinate(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) throw new RangeError('The image preview is not visible.');
  return { x: Math.max(0, Math.min(canvas.width - 1, (event.clientX - rect.left) * canvas.width / rect.width)), y: Math.max(0, Math.min(canvas.height - 1, (event.clientY - rect.top) * canvas.height / rect.height)) };
}
export function boundedBrushSize(value) {
  const size = Number(value);
  if (!Number.isFinite(size)) throw new RangeError('Enter a valid brush size.');
  return Math.max(8, Math.min(120, Math.round(size)));
}
