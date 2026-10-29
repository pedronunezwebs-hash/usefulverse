export function estimateFaceShape({ foreheadWidth, cheekboneWidth, jawWidth, faceLength }) {
  const values = [foreheadWidth, cheekboneWidth, jawWidth, faceLength].map(Number);
  if (values.some((value) => !Number.isFinite(value) || value <= 0 || value > 1000)) throw new RangeError('Enter positive measurements using one unit.');
  const [forehead, cheek, jaw, length] = values;
  const maxWidth = Math.max(forehead, cheek, jaw), tolerance = .06;
  const near = (a,b) => Math.abs(a-b) / Math.max(a,b) <= tolerance;
  let shape;
  if (cheek > forehead * 1.08 && cheek > jaw * 1.08) shape = 'diamond';
  else if (forehead > jaw * 1.12 && jaw < cheek * .9) shape = 'heart';
  else if (length / cheek >= 1.55) shape = 'oblong';
  else if (length / cheek <= 1.22 && near(forehead, jaw) && near(forehead, cheek)) shape = 'round-or-square';
  else if (length / cheek <= 1.25 && near(forehead, jaw) && maxWidth - Math.min(forehead, cheek, jaw) <= cheek * .1) shape = 'square';
  else if (length / cheek >= 1.25 && length / cheek < 1.65 && forehead <= cheek * 1.08 && jaw <= cheek * 1.08) shape = 'oval';
  else if (forehead >= jaw * 1.08 && cheek >= jaw * 1.08) shape = 'heart';
  else shape = 'mixed';
  return Object.freeze({ shape, ratios: Object.freeze({ foreheadToCheek: forehead / cheek, jawToCheek: jaw / cheek, lengthToCheek: length / cheek }), largestWidth: forehead === maxWidth ? 'forehead' : cheek === maxWidth ? 'cheekbones' : 'jaw' });
}
