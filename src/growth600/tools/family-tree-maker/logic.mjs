const MAX_PEOPLE = 200;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/u;

function cleanText(value, max, label, required = false) {
  const text = String(value ?? '').trim();
  if (required && !text) throw new RangeError(`${label} is required.`);
  if (text.length > max) throw new RangeError(`${label} is too long.`);
  return text;
}

function validateDate(value, label) {
  const date = String(value ?? '').trim();
  if (!date) return '';
  if (!DATE_RE.test(date)) throw new RangeError(`${label} must use YYYY-MM-DD.`);
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) throw new RangeError(`${label} is not a valid calendar date.`);
  return date;
}

function normalized(tree) {
  if (!tree || !Array.isArray(tree.people) || !Array.isArray(tree.parentChild)) throw new TypeError('A family tree is required.');
  return tree;
}

export function createFamilyTree() {
  return { people: [], parentChild: [] };
}

export function addFamilyPerson(tree, { id, name, birthDate = '', deathDate = '', notes = '' } = {}) {
  normalized(tree);
  if (tree.people.length >= MAX_PEOPLE) throw new RangeError(`A tree can contain up to ${MAX_PEOPLE} people.`);
  const personId = cleanText(id, 40, 'Person ID', true);
  if (tree.people.some((person) => person.id === personId)) throw new RangeError('Person IDs must be unique.');
  const birth = validateDate(birthDate, 'Birth date');
  const death = validateDate(deathDate, 'Death date');
  if (birth && death && death < birth) throw new RangeError('Death date cannot be earlier than birth date.');
  const person = Object.freeze({ id: personId, name: cleanText(name, 100, 'Name', true), birthDate: birth, deathDate: death, notes: cleanText(notes, 500, 'Notes') });
  tree.people.push(person);
  return person;
}

function hasPath(edges, startId, targetId) {
  const pending = [startId];
  const visited = new Set();
  while (pending.length) {
    const current = pending.pop();
    if (current === targetId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const [parent, child] of edges) if (parent === current) pending.push(child);
  }
  return false;
}

export function linkFamilyParent(tree, parentId, childId, relationship = 'biological') {
  normalized(tree);
  if (!['biological', 'adoptive', 'foster'].includes(relationship)) throw new RangeError('Choose a supported parent relationship.');
  if (parentId === childId) throw new RangeError('A person cannot be their own parent.');
  if (!tree.people.some(({ id }) => id === parentId) || !tree.people.some(({ id }) => id === childId)) throw new RangeError('Choose two people in this tree.');
  if (tree.parentChild.some(([parent, child]) => parent === parentId && child === childId)) throw new RangeError('This parent link already exists.');
  const parents = tree.parentChild.filter(([, child]) => child === childId);
  if (parents.length >= 2) throw new RangeError('A person can have at most two listed parents.');
  if (hasPath(tree.parentChild, childId, parentId)) throw new RangeError('This link would create a family-tree cycle.');
  const edge = Object.freeze([parentId, childId, relationship]);
  tree.parentChild.push(edge);
  return edge;
}

export function layoutFamilyTree(tree, { horizontalGap = 220, verticalGap = 140 } = {}) {
  normalized(tree);
  if (!Number.isFinite(horizontalGap) || horizontalGap < 80 || !Number.isFinite(verticalGap) || verticalGap < 80) throw new RangeError('Layout spacing must be at least 80 pixels.');
  const parentsByChild = new Map(tree.people.map(({ id }) => [id, []]));
  const childrenByParent = new Map(tree.people.map(({ id }) => [id, []]));
  for (const [parent, child] of tree.parentChild) {
    parentsByChild.get(child)?.push(parent);
    childrenByParent.get(parent)?.push(child);
  }
  const generations = new Map();
  const generationOf = (id, visiting = new Set()) => {
    if (generations.has(id)) return generations.get(id);
    if (visiting.has(id)) throw new RangeError('The family links contain a cycle.');
    visiting.add(id);
    const parents = parentsByChild.get(id) ?? [];
    const level = parents.length ? Math.max(...parents.map((parent) => generationOf(parent, visiting))) + 1 : 0;
    visiting.delete(id);
    generations.set(id, level);
    return level;
  };
  for (const { id } of tree.people) generationOf(id);
  const columns = new Map();
  for (const person of tree.people) {
    const level = generations.get(person.id);
    const column = columns.get(level) ?? [];
    column.push(person);
    columns.set(level, column);
  }
  const positions = [];
  for (const [level, people] of columns) {
    people.forEach((person, index) => positions.push(Object.freeze({ person, x: index * horizontalGap + horizontalGap / 2, y: level * verticalGap + verticalGap / 2, generation: level })));
  }
  return Object.freeze(positions);
}

function xmlEscape(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function exportFamilyTreeSvg(tree) {
  const layout = layoutFamilyTree(tree);
  const width = Math.max(440, ...layout.map(({ x }) => x + 180));
  const height = Math.max(180, ...layout.map(({ y }) => y + 80));
  const byId = new Map(layout.map(({ person, x, y }) => [person.id, { x, y }]));
  const lines = tree.parentChild.map(([parent, child]) => {
    const a = byId.get(parent); const b = byId.get(child);
    return `<path d="M ${a.x} ${a.y + 24} C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y - 24}" fill="none" stroke="#64748b" stroke-width="2"/>`;
  }).join('');
  const nodes = layout.map(({ person, x, y }) => `<g><rect x="${x - 84}" y="${y - 24}" width="168" height="48" rx="10" fill="#fff" stroke="#475569"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-family="sans-serif" font-size="14">${xmlEscape(person.name)}</text></g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Family tree" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${lines}${nodes}</svg>`;
}

function gedcomEscape(value) { return String(value).replace(/[\r\n/]/gu, ' ').trim(); }
function gedcomDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}

export function exportFamilyTreeGedcom(tree) {
  normalized(tree);
  const lines = ['0 HEAD', '1 SOUR UsefulVerse', '1 GEDC', '2 VERS 5.5.1', '2 FORM LINEAGE-LINKED', '1 CHAR UTF-8'];
  const peopleById = new Map(tree.people.map((person, index) => [person.id, { person, xref: `@I${index + 1}@` }]));
  const families = new Map();
  for (const [, childId] of tree.parentChild) {
    const parents = tree.parentChild.filter(([, child]) => child === childId).map(([parent]) => parent).sort();
    const key = `${parents.join('|')}=>${childId}`;
    if (!families.has(key)) families.set(key, { parents, children: [] });
    const family = families.get(key);
    if (!family.children.includes(childId)) family.children.push(childId);
  }
  const familyRecords = [...families.values()];
  const familyXrefs = new Map();
  const childFamilyXrefs = new Map();
  familyRecords.forEach((family, index) => {
    const xref = `@F${index + 1}@`;
    for (const id of family.parents) familyXrefs.set(`${id}:child`, [...(familyXrefs.get(`${id}:child`) ?? []), xref]);
    for (const id of family.children) childFamilyXrefs.set(id, [...(childFamilyXrefs.get(id) ?? []), { xref, family }]);
  });
  for (const { person, xref } of peopleById.values()) {
    lines.push(`0 ${xref} INDI`, `1 NAME ${gedcomEscape(person.name).replace(/\s+/gu, ' /')}/`);
    if (person.birthDate) lines.push('1 BIRT', `2 DATE ${gedcomDate(person.birthDate)}`);
    if (person.deathDate) lines.push('1 DEAT', `2 DATE ${gedcomDate(person.deathDate)}`);
    if (person.notes) lines.push(`1 NOTE ${gedcomEscape(person.notes)}`);
    for (const family of familyXrefs.get(`${person.id}:child`) ?? []) lines.push(`1 FAMS ${family}`);
    for (const { xref } of childFamilyXrefs.get(person.id) ?? []) {
      const relations = tree.parentChild.filter(([, child]) => child === person.id).map(([, , relation]) => relation);
      const relation = new Set(relations).size === 1 ? relations[0] : 'other';
      const pedigree = { biological: 'BIRTH', adoptive: 'ADOPTED', foster: 'FOSTER', other: 'OTHER' }[relation];
      lines.push(`1 FAMC ${xref}`, `2 PEDI ${pedigree}`);
    }
  }
  familyRecords.forEach((family, index) => {
    lines.push(`0 @F${index + 1}@ FAM`);
    family.parents.slice(0, 2).forEach((id, parentIndex) => lines.push(`1 ${parentIndex === 0 ? 'HUSB' : 'WIFE'} ${peopleById.get(id).xref}`));
    for (const childId of family.children) lines.push(`1 CHIL ${peopleById.get(childId).xref}`);
  });
  lines.push('0 TRLR');
  return `${lines.join('\r\n')}\r\n`;
}

export const FAMILY_TREE_LIMITS = Object.freeze({ maxPeople: MAX_PEOPLE });
