const finite = (n) => Number.isFinite(n);
const fmt = (n) => Number(n.toFixed(3));

export function createFingerJointBox({ width, depth, height, thickness, clearance = 0.15, fingers = 5 }) {
  const values = [width, depth, height, thickness, clearance].map(Number);
  [width, depth, height, thickness, clearance] = values;
  fingers = Number(fingers);
  if (![width, depth, height, thickness, clearance, fingers].every(finite)
    || width < 20 || depth < 20 || height < 10 || width > 600 || depth > 600 || height > 600
    || thickness < 2 || thickness > 12 || clearance < 0 || clearance > 0.5
    || !Number.isInteger(fingers) || fingers < 2 || fingers > 12) {
    throw new RangeError('Use width/depth 20–600 mm, height 10–600 mm, material 2–12 mm, clearance 0–0.5 mm, and 2–12 fingers.');
  }
  if (width < (fingers * 2 + 1) * thickness || depth < (fingers * 2 + 1) * thickness) throw new RangeError('Panel edges are too short for the selected finger count and material thickness.');
  const fingerWidth = width / (2 * fingers);
  const slotWidth = fingerWidth + clearance;
  const slotDepth = thickness + clearance;
  const makeBottomEdge = (span, count) => {
    const step = span / (2 * count);
    let d = 'M0 0';
    for (let i = 0; i < count * 2; i += 1) {
      const x = (i + 1) * step;
      d += `H${fmt(x)}${i % 2 === 0 ? `v${fmt(thickness)}` : `v-${fmt(thickness)}`}`;
    }
    return d;
  };
  const cutouts = [];
  const addSlots = (span, edge, count) => {
    const step = span / (2 * count);
    for (let i = 0; i < count * 2; i += 1) {
      if (i % 2 !== 0) continue;
      const center = (i + 0.5) * step;
      if (edge === 'top') cutouts.push(`M${fmt(center - slotWidth / 2)} 0h${fmt(slotWidth)}v${fmt(slotDepth)}h-${fmt(slotWidth)}Z`);
      if (edge === 'bottom') cutouts.push(`M${fmt(center - slotWidth / 2)} ${fmt(depth - slotDepth)}h${fmt(slotWidth)}v${fmt(slotDepth)}h-${fmt(slotWidth)}Z`);
      if (edge === 'left') cutouts.push(`M0 ${fmt(center - slotWidth / 2)}h${fmt(slotDepth)}v${fmt(slotWidth)}h-${fmt(slotDepth)}Z`);
      if (edge === 'right') cutouts.push(`M${fmt(width - slotDepth)} ${fmt(center - slotWidth / 2)}h${fmt(slotDepth)}v${fmt(slotWidth)}h-${fmt(slotDepth)}Z`);
    }
  };
  addSlots(width, 'top', fingers); addSlots(width, 'bottom', fingers);
  const depthStep = depth / (2 * fingers);
  for (let i = 0; i < fingers * 2; i += 1) {
    if (i % 2 !== 0) continue;
    const center = (i + 0.5) * depthStep;
    cutouts.push(`M0 ${fmt(center - slotWidth / 2)}h${fmt(slotDepth)}v${fmt(slotWidth)}h-${fmt(slotDepth)}Z`);
    cutouts.push(`M${fmt(width - slotDepth)} ${fmt(center - slotWidth / 2)}h${fmt(slotDepth)}v${fmt(slotWidth)}h-${fmt(slotDepth)}Z`);
  }
  const base = `<path d="M0 0H${width}V${depth}H0Z ${cutouts.join(' ')}" fill-rule="evenodd"/>`;
  const walls = [
    { name: 'Front wall', x: 0, y: depth + 24, w: width, h: height },
    { name: 'Back wall', x: width + 24, y: 0, w: width, h: height },
    { name: 'Left wall', x: width + 24, y: height + 24, w: depth, h: height },
    { name: 'Right wall', x: 2 * width + 48, y: height + 24, w: depth, h: height },
  ];
  const margin = 18;
  const sheetWidth = Math.ceil(2 * width + depth + 3 * 24 + margin * 2);
  const sheetHeight = Math.ceil(depth + 2 * height + 2 * 24 + margin * 2);
  const wallSvg = walls.map(({ name, x, y, w, h }) => `<g transform="translate(${x + margin} ${y + margin})"><path d="${makeBottomEdge(w, fingers)}V${fmt(h)}H0Z"/><text x="4" y="14">${name}</text></g>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}mm" height="${sheetHeight}mm" viewBox="0 0 ${sheetWidth} ${sheetHeight}"><title>Parametric finger-joint box layout</title><g fill="none" stroke="#172033" stroke-width="0.2"><g transform="translate(${margin} ${margin})">${base}</g>${wallSvg}</g></svg>`;
  return Object.freeze({ width, depth, height, thickness, clearance, fingers, fingerWidth: fmt(fingerWidth), slotWidth: fmt(slotWidth), slotDepth: fmt(slotDepth), sheetWidth, sheetHeight, svg });
}

export function downloadSvg(svg, filename = 'finger-joint-box.svg') {
  if (typeof svg !== 'string' || svg.length > 200_000 || !svg.startsWith('<svg ')) throw new RangeError('Invalid SVG document.');
  return Object.freeze({ blob: new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), filename });
}
