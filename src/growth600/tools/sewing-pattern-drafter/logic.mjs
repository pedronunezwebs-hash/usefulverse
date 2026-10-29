export const MAX_SEWING_MM = 3000;

export function draftHalfCircleSkirt({ waistMm, easeMm = 0, lengthMm, seamAllowanceMm = 10, hemAllowanceMm = 25 } = {}) {
  const values = { waistMm, easeMm, lengthMm, seamAllowanceMm, hemAllowanceMm };
  for (const [name, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0 || value > MAX_SEWING_MM) throw new Error(`invalid-${name}`);
  }
  if (waistMm < 300 || waistMm > 2000) throw new Error('invalid-waistMm');
  if (lengthMm < 100 || lengthMm > 1500) throw new Error('invalid-lengthMm');
  if (seamAllowanceMm > 50 || hemAllowanceMm > 100) throw new Error('invalid-allowance');
  const finishedWaistMm = waistMm + easeMm;
  const radiusMm = finishedWaistMm / Math.PI;
  const hemStitchRadiusMm = radiusMm + lengthMm;
  const cutWaistRadiusMm = radiusMm - seamAllowanceMm;
  const cutHemRadiusMm = hemStitchRadiusMm + hemAllowanceMm;
  if (cutWaistRadiusMm <= seamAllowanceMm) throw new Error('allowance-too-large');
  const innerX = Math.sqrt(cutWaistRadiusMm ** 2 - seamAllowanceMm ** 2);
  const outerX = Math.sqrt(cutHemRadiusMm ** 2 - seamAllowanceMm ** 2);
  const widthMm = 2 * cutHemRadiusMm + 30;
  const heightMm = 2 * cutHemRadiusMm + seamAllowanceMm + 30;
  if (!Number.isFinite(widthMm * heightMm) || widthMm > 7000 || heightMm > 7000 || widthMm * heightMm > 35_000_000) throw new Error('pattern-too-large');
  const centerX = cutHemRadiusMm + 15;
  const centerY = cutHemRadiusMm + seamAllowanceMm + 15;
  const cutPath = `M ${centerX - innerX} ${centerY - seamAllowanceMm} L ${centerX - outerX} ${centerY - seamAllowanceMm} A ${cutHemRadiusMm} ${cutHemRadiusMm} 0 0 1 ${centerX + outerX} ${centerY + seamAllowanceMm} L ${centerX + innerX} ${centerY + seamAllowanceMm} A ${cutWaistRadiusMm} ${cutWaistRadiusMm} 0 0 0 ${centerX - innerX} ${centerY - seamAllowanceMm} Z`;
  const stitchPath = `M ${centerX - radiusMm} ${centerY} A ${radiusMm} ${radiusMm} 0 0 1 ${centerX + radiusMm} ${centerY} M ${centerX - hemStitchRadiusMm} ${centerY} A ${hemStitchRadiusMm} ${hemStitchRadiusMm} 0 0 1 ${centerX + hemStitchRadiusMm} ${centerY} M ${centerX - radiusMm} ${centerY} L ${centerX - hemStitchRadiusMm} ${centerY} M ${centerX + radiusMm} ${centerY} L ${centerX + hemStitchRadiusMm} ${centerY}`;
  return Object.freeze({ finishedWaistMm, radiusMm, hemStitchRadiusMm, cutWaistRadiusMm, cutHemRadiusMm, widthMm, heightMm, centerX, centerY, cutPath, stitchPath });
}

export function createHalfCircleSkirtSvg(draft, label = 'Half circle skirt pattern', description = 'Full-scale sewing pattern in millimetres.', calibrationLabel = '50 mm print check') {
  if (!draft || !Number.isFinite(draft.widthMm) || !Number.isFinite(draft.heightMm) || typeof draft.cutPath !== 'string' || typeof draft.stitchPath !== 'string') throw new Error('invalid-pattern');
  const width = draft.widthMm.toFixed(2), height = draft.heightMm.toFixed(2);
  const square = 50;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${escapeXml(label)}</title><desc id="desc">${escapeXml(description)}</desc><path d="${draft.cutPath}" fill="#fff" stroke="#111" stroke-width="1.2"/><path d="${draft.stitchPath}" fill="none" stroke="#2456a6" stroke-width="0.8" stroke-dasharray="4 3"/><path d="M 15 15 h ${square} v ${square} h -${square} Z" fill="none" stroke="#111" stroke-width="0.8"/><text x="15" y="12" font-size="8">${escapeXml(calibrationLabel)}</text></svg>`;
}

function escapeXml(value) { return String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]); }
