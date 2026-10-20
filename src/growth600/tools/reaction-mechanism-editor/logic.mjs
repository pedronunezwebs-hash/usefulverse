const ELEMENTS = Object.freeze(['H', 'B', 'C', 'N', 'O', 'F', 'Si', 'P', 'S', 'Cl', 'Br', 'I']);
const fail = (code, message) => Object.assign(new RangeError(message), { code });
const safeId = (value, name) => { const id = String(value ?? '').trim(); if (!/^[A-Za-z][A-Za-z0-9_-]{0,11}$/u.test(id)) throw fail('invalid-id', `${name} must start with a letter and contain at most 12 letters, numbers, underscores or hyphens.`); return id; };
const bounded = (value, name, min, max, integer = false) => { const n = Number(value); if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isInteger(n))) throw fail('invalid-value', `${name} must be from ${min} to ${max}${integer ? ' as a whole number' : ''}.`); return n; };
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const copyStep = (step) => ({ ...step, atoms: step.atoms.map((item) => ({ ...item })), bonds: step.bonds.map((item) => ({ ...item })), arrows: step.arrows.map((item) => ({ ...item })) });
const findStep = (mechanism, stepId) => mechanism?.steps?.find((step) => step.id === stepId);
const pairKey = (a, b) => [a, b].sort().join('|');

export const mechanismElements = ELEMENTS;

export function createMechanism(title = 'Mechanism') {
  const name = String(title ?? '').trim().slice(0, 80) || 'Mechanism';
  return Object.freeze({ title: name, steps: Object.freeze([Object.freeze({ id: 'S1', title: 'Step 1', atoms: Object.freeze([]), bonds: Object.freeze([]), arrows: Object.freeze([]) })]) });
}

export function addMechanismStep(mechanism, title) {
  if (!mechanism?.steps || mechanism.steps.length >= 12) throw fail('step-limit', 'A mechanism can contain at most 12 steps.');
  const index = mechanism.steps.length + 1;
  const name = String(title ?? '').trim().slice(0, 80) || `Step ${index}`;
  const step = Object.freeze({ id: `S${index}`, title: name, atoms: Object.freeze([]), bonds: Object.freeze([]), arrows: Object.freeze([]) });
  return Object.freeze({ ...mechanism, steps: Object.freeze([...mechanism.steps, step]) });
}

export function addMechanismAtom(mechanism, stepId, { id, element = 'C', x, y, charge = 0, lonePairs = 0 } = {}) {
  const current = findStep(mechanism, stepId);
  if (!current) throw fail('missing-step', 'Choose a step in this mechanism.');
  const atomId = safeId(id, 'Atom ID');
  if (!ELEMENTS.includes(element)) throw fail('invalid-element', 'Choose a supported element symbol.');
  if (current.atoms.some((atom) => atom.id.toLowerCase() === atomId.toLowerCase())) throw fail('duplicate-id', 'Atom IDs must be unique within a step.');
  const atom = Object.freeze({ id: atomId, element, x: bounded(x, 'X position', 40, 660), y: bounded(y, 'Y position', 100, 260), charge: bounded(charge, 'Formal charge', -3, 3, true), lonePairs: bounded(lonePairs, 'Lone pairs', 0, 4, true) });
  const next = copyStep(current); next.atoms.push(atom);
  return Object.freeze({ ...mechanism, steps: Object.freeze(mechanism.steps.map((step) => step.id === stepId ? Object.freeze({ ...next, atoms: Object.freeze(next.atoms), bonds: Object.freeze(next.bonds), arrows: Object.freeze(next.arrows) }) : step)) });
}

export function addMechanismBond(mechanism, stepId, { id, from, to, order = 1 } = {}) {
  const current = findStep(mechanism, stepId);
  if (!current) throw fail('missing-step', 'Choose a step in this mechanism.');
  const bondId = safeId(id, 'Bond ID');
  const a = safeId(from, 'First atom'), b = safeId(to, 'Second atom');
  if (a === b || !current.atoms.some((atom) => atom.id === a) || !current.atoms.some((atom) => atom.id === b)) throw fail('invalid-endpoint', 'Choose two different atoms in this step.');
  if (current.bonds.some((bond) => bond.id.toLowerCase() === bondId.toLowerCase() || pairKey(bond.from, bond.to) === pairKey(a, b))) throw fail('duplicate-bond', 'Bond IDs and atom pairs must be unique in a step.');
  const bond = Object.freeze({ id: bondId, from: a, to: b, order: bounded(order, 'Bond order', 1, 3, true) });
  const next = copyStep(current); next.bonds.push(bond);
  return Object.freeze({ ...mechanism, steps: Object.freeze(mechanism.steps.map((step) => step.id === stepId ? Object.freeze({ ...next, atoms: Object.freeze(next.atoms), bonds: Object.freeze(next.bonds), arrows: Object.freeze(next.arrows) }) : step)) });
}

function validEndpoint(step, endpoint) {
  const [kind, id] = String(endpoint ?? '').split(':');
  if (kind === 'atom' && step.atoms.some((atom) => atom.id === id)) return { kind, id };
  if (kind === 'bond' && step.bonds.some((bond) => bond.id === id)) return { kind, id };
  throw fail('invalid-endpoint', 'Arrow endpoints must name an atom or bond in this step.');
}

export function addMechanismArrow(mechanism, stepId, { id, from, to, kind = 'pair' } = {}) {
  const current = findStep(mechanism, stepId);
  if (!current) throw fail('missing-step', 'Choose a step in this mechanism.');
  if (current.arrows.length >= 24) throw fail('arrow-limit', 'A step can contain at most 24 electron arrows.');
  const arrowId = safeId(id, 'Arrow ID'), start = validEndpoint(current, from), end = validEndpoint(current, to);
  if (`${start.kind}:${start.id}` === `${end.kind}:${end.id}`) throw fail('invalid-endpoint', 'An electron arrow must start and end at different features.');
  if (!['pair', 'single'].includes(kind)) throw fail('invalid-arrow', 'Choose a two-electron arrow or a single-electron fishhook.');
  if (current.arrows.some((arrow) => arrow.id.toLowerCase() === arrowId.toLowerCase())) throw fail('duplicate-id', 'Arrow IDs must be unique within a step.');
  const arrow = Object.freeze({ id: arrowId, from: `${start.kind}:${start.id}`, to: `${end.kind}:${end.id}`, kind });
  const next = copyStep(current); next.arrows.push(arrow);
  return Object.freeze({ ...mechanism, steps: Object.freeze(mechanism.steps.map((step) => step.id === stepId ? Object.freeze({ ...next, atoms: Object.freeze(next.atoms), bonds: Object.freeze(next.bonds), arrows: Object.freeze(next.arrows) }) : step)) });
}

function featurePoint(step, reference) {
  const [kind, id] = reference.split(':');
  if (kind === 'atom') { const atom = step.atoms.find((item) => item.id === id); return [atom.x, atom.y]; }
  const bond = step.bonds.find((item) => item.id === id), a = step.atoms.find((item) => item.id === bond.from), b = step.atoms.find((item) => item.id === bond.to);
  return [(a.x + b.x) / 2, (a.y + b.y) / 2];
}

export function renderMechanismSvg(mechanism) {
  if (!mechanism?.steps?.length) throw fail('invalid-mechanism', 'Create a mechanism with at least one step.');
  const stepHeight = 330, height = 70 + mechanism.steps.length * stepHeight;
  const panels = mechanism.steps.map((step, index) => {
    const offset = 70 + index * stepHeight;
    const bonds = step.bonds.map((bond) => {
      const a = step.atoms.find((atom) => atom.id === bond.from), b = step.atoms.find((atom) => atom.id === bond.to);
      const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy) || 1, offsetX = -dy / length * 4, offsetY = dx / length * 4;
      const lines = Array.from({ length: bond.order }, (_, i) => { const shift = (i - (bond.order - 1) / 2) * 8; return `<line x1="${(a.x + offsetX * shift / 4).toFixed(1)}" y1="${(a.y + offsetY * shift / 4 + offset).toFixed(1)}" x2="${(b.x + offsetX * shift / 4).toFixed(1)}" y2="${(b.y + offsetY * shift / 4 + offset).toFixed(1)}" stroke="#334155" stroke-width="2.5"/>`; }).join('');
      return `<g>${lines}<text x="${((a.x + b.x) / 2).toFixed(1)}" y="${(((a.y + b.y) / 2) + offset - 8).toFixed(1)}" font-family="sans-serif" font-size="10" fill="#64748b">${escape(bond.id)}</text></g>`;
    }).join('');
    const arrows = step.arrows.map((arrow, arrowIndex) => {
      const [x1, y1] = featurePoint(step, arrow.from), [x2, y2] = featurePoint(step, arrow.to), curve = Math.min(48, Math.max(22, Math.abs(x2 - x1) * 0.18)), sign = arrowIndex % 2 ? 1 : -1;
      const d = `M ${x1} ${y1 + offset - 16} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + offset + sign * curve} ${x2} ${y2 + offset - 16}`;
      return `<path d="${d}" fill="none" stroke="${arrow.kind === 'single' ? '#7c3aed' : '#dc2626'}" stroke-width="2" marker-end="url(#${arrow.kind === 'single' ? 'fishhook' : 'pairArrow'})"/><text x="${((x1 + x2) / 2).toFixed(1)}" y="${(((y1 + y2) / 2) + offset + sign * curve).toFixed(1)}" font-family="sans-serif" font-size="10" fill="#475569">${escape(arrow.id)}</text>`;
    }).join('');
    const atoms = step.atoms.map((atom) => {
      const pairs = Array.from({ length: atom.lonePairs }, (_, i) => `<circle cx="${atom.x + (i % 2 ? 13 : -13)}" cy="${atom.y + offset + 19 + Math.floor(i / 2) * 4}" r="1.8" fill="#0f172a"/>`).join('');
      const charge = atom.charge ? `<text x="${atom.x + 11}" y="${atom.y + offset - 9}" font-family="sans-serif" font-size="12" fill="#b91c1c">${atom.charge > 0 ? '+' : '−'}${Math.abs(atom.charge) === 1 ? '' : Math.abs(atom.charge)}</text>` : '';
      return `<g><circle cx="${atom.x}" cy="${atom.y + offset}" r="18" fill="#fff" stroke="#64748b" stroke-width="1.5"/><text x="${atom.x}" y="${atom.y + offset + 5}" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="600" fill="#0f172a">${escape(atom.element)}</text><text x="${atom.x}" y="${atom.y + offset + 34}" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#64748b">${escape(atom.id)}</text>${pairs}${charge}</g>`;
    }).join('');
    return `<g><rect x="24" y="${offset - 44}" width="672" height="300" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="40" y="${offset - 18}" font-family="sans-serif" font-size="16" font-weight="700" fill="#172033">${index + 1}. ${escape(step.title)}</text>${bonds}${arrows}${atoms}</g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${height}" role="img"><defs><marker id="pairArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#dc2626"/></marker><marker id="fishhook" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9" fill="none" stroke="#7c3aed" stroke-width="1.6"/></marker></defs><rect width="100%" height="100%" fill="#fff"/><text x="24" y="35" font-family="sans-serif" font-size="19" font-weight="700" fill="#172033">${escape(mechanism.title)}</text>${panels}</svg>`;
}

export function exportMechanismJson(mechanism) {
  if (!mechanism?.steps?.length) throw fail('invalid-mechanism', 'Create a mechanism with at least one step.');
  return JSON.stringify(mechanism, null, 2);
}
