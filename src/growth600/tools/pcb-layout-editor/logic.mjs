const FOOTPRINTS = Object.freeze({
  resistor: Object.freeze({ label: 'Axial resistor, 7.62 mm', padDiameter: 1.8, drillDiameter: 0.8, pads: Object.freeze([[-3.81, 0], [3.81, 0]]) }),
  'header-2': Object.freeze({ label: '2-pin header, 2.54 mm', padDiameter: 1.8, drillDiameter: 1, pads: Object.freeze([[0, -1.27], [0, 1.27]]) }),
  led: Object.freeze({ label: '5 mm LED', padDiameter: 2, drillDiameter: 0.9, pads: Object.freeze([[-1.27, 0], [1.27, 0]]) }),
  'dip-8': Object.freeze({ label: 'DIP-8, 7.62 mm', padDiameter: 1.8, drillDiameter: 0.8, pads: Object.freeze([[-3.81, -3.81], [-3.81, -1.27], [-3.81, 1.27], [-3.81, 3.81], [3.81, 3.81], [3.81, 1.27], [3.81, -1.27], [3.81, -3.81]]) }),
});
const fail = (code, message) => Object.assign(new RangeError(message), { code });
const number = (value, name, min, max) => { const result = Number(value); if (!Number.isFinite(result) || result < min || result > max) throw fail('invalid-dimension', `${name} must be from ${min} to ${max} mm.`); return Math.round(result * 1000) / 1000; };
const safeName = (value, name) => { const result = String(value ?? '').trim(); if (!/^[A-Za-z][A-Za-z0-9_-]{0,11}$/u.test(result)) throw fail('invalid-name', `${name} must start with a letter and contain at most 12 letters, numbers, underscores or hyphens.`); return result; };
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const rotate = (x, y, angle) => { const radians = angle * Math.PI / 180; return [x * Math.cos(radians) - y * Math.sin(radians), x * Math.sin(radians) + y * Math.cos(radians)]; };
const boardPoint = (board, point) => Array.isArray(point) && point.length === 2 && Number.isFinite(point[0]) && Number.isFinite(point[1]) && point[0] >= 0 && point[0] <= board.width && point[1] >= 0 && point[1] <= board.height;
function absolutePads(part) {
  const footprint = FOOTPRINTS[part.footprint];
  return footprint.pads.map(([x, y], index) => { const [dx, dy] = rotate(x, y, part.rotation); return Object.freeze({ ref: part.ref, pad: index + 1, x: Math.round((part.x + dx) * 1000) / 1000, y: Math.round((part.y + dy) * 1000) / 1000, diameter: footprint.padDiameter, drill: footprint.drillDiameter }); });
}

export const pcbFootprints = Object.freeze(Object.fromEntries(Object.entries(FOOTPRINTS).map(([id, value]) => [id, Object.freeze({ label: value.label, padCount: value.pads.length, padDiameter: value.padDiameter, drillDiameter: value.drillDiameter })])));

export function createPcbBoard({ width = 50, height = 40, grid = 1 } = {}) {
  return Object.freeze({ width: number(width, 'Board width', 10, 200), height: number(height, 'Board height', 10, 200), grid: number(grid, 'Grid', 0.25, 5), parts: Object.freeze([]), tracks: Object.freeze([]) });
}

export function addPcbPart(board, { ref, footprint, x, y, rotation = 0 } = {}) {
  if (!board || !Array.isArray(board.parts) || !FOOTPRINTS[footprint]) throw fail('invalid-footprint', 'Choose a supported through-hole footprint.');
  const reference = safeName(ref, 'Reference');
  if (board.parts.some((part) => part.ref.toLowerCase() === reference.toLowerCase())) throw fail('duplicate-reference', 'Each component reference must be unique.');
  const angle = Number(rotation);
  if (![0, 90, 180, 270].includes(angle)) throw fail('invalid-rotation', 'Rotation must be 0, 90, 180 or 270 degrees.');
  const part = Object.freeze({ ref: reference, footprint, x: number(x, 'X position', 0, board.width), y: number(y, 'Y position', 0, board.height), rotation: angle });
  const pads = absolutePads(part);
  if (pads.some((pad) => pad.x - pad.diameter / 2 < 0 || pad.y - pad.diameter / 2 < 0 || pad.x + pad.diameter / 2 > board.width || pad.y + pad.diameter / 2 > board.height)) throw fail('outside-board', 'Every pad must remain inside the board outline.');
  return Object.freeze({ ...board, parts: Object.freeze([...board.parts, part]) });
}

export function removePcbPart(board, ref) {
  if (!board?.parts?.some((part) => part.ref === ref)) throw fail('missing-part', 'Choose a component on this board.');
  const padPrefix = `${ref}.`;
  return Object.freeze({ ...board, parts: Object.freeze(board.parts.filter((part) => part.ref !== ref)), tracks: Object.freeze(board.tracks.filter((track) => !track.from.startsWith(padPrefix) && !track.to.startsWith(padPrefix))) });
}

export function routePcbTrack(board, { net, from, to, waypoints = [], width = 0.3 } = {}) {
  const netName = safeName(net, 'Net name');
  const trackWidth = number(width, 'Track width', 0.15, 2);
  const pads = board?.parts?.flatMap(absolutePads) ?? [];
  const findPad = (selector) => pads.find((pad) => pad.ref === selector?.ref && pad.pad === Number(selector?.pad));
  const start = findPad(from), end = findPad(to);
  if (!start || !end || (start.ref === end.ref && start.pad === end.pad)) throw fail('invalid-endpoint', 'Choose two different existing component pads.');
  const routedWaypoints = waypoints.map((point) => { const x = Number(point?.x), y = Number(point?.y); if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > board.width || y < 0 || y > board.height) throw fail('outside-board', 'Every track point must be inside the board outline.'); return [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]; });
  const points = [[start.x, start.y], ...routedWaypoints, [end.x, end.y]];
  if (points.some((point) => !boardPoint(board, point))) throw fail('outside-board', 'Every track point must be inside the board outline.');
  if (points.some((point, index) => index && point[0] === points[index - 1][0] && point[1] === points[index - 1][1])) throw fail('zero-length-segment', 'Track points must not repeat.');
  const track = Object.freeze({ net: netName, from: `${start.ref}.${start.pad}`, to: `${end.ref}.${end.pad}`, width: trackWidth, points: Object.freeze(points.map((point) => Object.freeze(point))) });
  return Object.freeze({ ...board, tracks: Object.freeze([...board.tracks, track]) });
}

function coord(mm) { return String(Math.round(mm * 1_000_000)).padStart(9, '0'); }
function gerberHeader(name, functionName, apertures) { return [`G04 UsefulVerse PCB draft: ${name}*`, '%FSLAX36Y36*%', '%MOMM*%', '%LPD*%', `%TF.FileFunction,${functionName}*%`, ...apertures.map(([code, diameter]) => `%ADD${code}C,${diameter.toFixed(3)}*%`)]; }

export function exportPcbArtifacts(board) {
  if (!board || !Array.isArray(board.parts) || !Array.isArray(board.tracks)) throw fail('invalid-board', 'Create a board before exporting.');
  const pads = board.parts.flatMap(absolutePads);
  const sizes = [...new Set([0.1, ...pads.map((pad) => pad.diameter), ...board.tracks.map((track) => track.width)])].sort((a, b) => a - b);
  const apertures = sizes.map((diameter, index) => [10 + index, diameter]);
  const apertureFor = new Map(apertures.map(([code, diameter]) => [diameter, code]));
  const copper = gerberHeader('F.Cu', 'Copper,L1,Top', apertures);
  for (const pad of pads) copper.push(`D${apertureFor.get(pad.diameter)}*`, `X${coord(pad.x)}Y${coord(pad.y)}D03*`);
  for (const track of board.tracks) { copper.push(`D${apertureFor.get(track.width)}*`); for (let i = 1; i < track.points.length; i += 1) { const [x0, y0] = track.points[i - 1], [x1, y1] = track.points[i]; copper.push(`X${coord(x0)}Y${coord(y0)}D02*`, `X${coord(x1)}Y${coord(y1)}D01*`); } }
  copper.push('M02*');
  const edgeCode = apertureFor.get(0.1), edge = gerberHeader('Edge.Cuts', 'Profile,NP', apertures);
  edge.push(`D${edgeCode}*`, `X${coord(0)}Y${coord(0)}D02*`, `X${coord(board.width)}Y${coord(0)}D01*`, `X${coord(board.width)}Y${coord(board.height)}D01*`, `X${coord(0)}Y${coord(board.height)}D01*`, `X${coord(0)}Y${coord(0)}D01*`, 'M02*');
  const drillSizes = [...new Set(pads.map((pad) => pad.drill))].sort((a, b) => a - b), drillLines = ['M48', 'METRIC,TZ', ...drillSizes.map((diameter, index) => `T${String(index + 1).padStart(2, '0')}C${diameter.toFixed(3)}`), '%', 'G90', 'G05'];
  const toolFor = new Map(drillSizes.map((diameter, index) => [diameter, index + 1]));
  for (const diameter of drillSizes) { drillLines.push(`T${String(toolFor.get(diameter)).padStart(2, '0')}`); for (const pad of pads.filter((item) => item.drill === diameter)) drillLines.push(`X${String(Math.round(pad.x * 1000)).padStart(6, '0')}Y${String(Math.round(pad.y * 1000)).padStart(6, '0')}`); }
  drillLines.push('M30');
  return Object.freeze({ 'F.Cu.gbr': copper.join('\n') + '\n', 'Edge.Cuts.gbr': edge.join('\n') + '\n', 'PTH.drl': drillLines.join('\n') + '\n' });
}

export function renderPcbPreviewSvg(board) {
  if (!board || !Array.isArray(board.parts) || !Array.isArray(board.tracks)) throw fail('invalid-board', 'Create a board before previewing.');
  const scale = 10, pad = 24, width = board.width * scale + pad * 2, height = board.height * scale + pad * 2;
  const paths = board.tracks.map((track) => `<polyline points="${track.points.map(([x, y]) => `${pad + x * scale},${pad + (board.height - y) * scale}`).join(' ')}" fill="none" stroke="#d97706" stroke-width="${track.width * scale}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const components = board.parts.map((part) => { const pads = absolutePads(part).map((pin) => `<circle cx="${pad + pin.x * scale}" cy="${pad + (board.height - pin.y) * scale}" r="${pin.diameter * scale / 2}" fill="#fbbf24" stroke="#713f12"/><circle cx="${pad + pin.x * scale}" cy="${pad + (board.height - pin.y) * scale}" r="${pin.drill * scale / 2}" fill="#fff"/>`).join(''); return `<g>${pads}<text x="${pad + part.x * scale + 5}" y="${pad + (board.height - part.y) * scale - 5}" font-family="sans-serif" font-size="12" fill="#172033">${esc(part.ref)}</text></g>`; }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img"><rect width="100%" height="100%" fill="#f8fafc"/><rect x="${pad}" y="${pad}" width="${board.width * scale}" height="${board.height * scale}" fill="#166534" stroke="#172033" stroke-width="2"/>${paths}${components}</svg>`;
}
