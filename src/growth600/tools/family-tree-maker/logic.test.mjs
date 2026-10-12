import assert from 'node:assert/strict';
import test from 'node:test';
import { addFamilyPerson, createFamilyTree, exportFamilyTreeGedcom, exportFamilyTreeSvg, layoutFamilyTree, linkFamilyParent } from './logic.mjs';

function sampleTree() {
  const tree = createFamilyTree();
  for (const person of [
    { id: 'p1', name: 'Ana Example', birthDate: '1950-01-01' },
    { id: 'p2', name: 'Luis Example' },
    { id: 'c1', name: 'Sam Example', notes: 'Private note' },
  ]) addFamilyPerson(tree, person);
  linkFamilyParent(tree, 'p1', 'c1');
  linkFamilyParent(tree, 'p2', 'c1', 'adoptive');
  return tree;
}

test('adds bounded family records and rejects invalid dates, duplicate IDs and excessive text', () => {
  const tree = createFamilyTree();
  assert.throws(() => addFamilyPerson(tree, { id: 'x', name: 'A', birthDate: '2025-02-30' }), /valid calendar date/u);
  addFamilyPerson(tree, { id: 'x', name: 'A', birthDate: '2000-02-29', deathDate: '2020-01-01' });
  assert.throws(() => addFamilyPerson(tree, { id: 'x', name: 'B' }), /unique/u);
  assert.throws(() => addFamilyPerson(tree, { id: 'y', name: 'B', birthDate: '2022-01-01', deathDate: '2021-01-01' }), /earlier/u);
});

test('parent links require existing distinct people, cap parent count and reject duplicate links', () => {
  const tree = sampleTree();
  assert.throws(() => linkFamilyParent(tree, 'c1', 'p1'), /cycle/u);
  assert.throws(() => linkFamilyParent(tree, 'p1', 'c1'), /already exists/u);
  addFamilyPerson(tree, { id: 'p3', name: 'Third Parent' });
  assert.throws(() => linkFamilyParent(tree, 'p3', 'c1'), /at most two/u);
  assert.throws(() => linkFamilyParent(tree, 'absent', 'c1'), /two people/u);
  assert.throws(() => linkFamilyParent(tree, 'p3', 'p3'), /own parent/u);
});

test('acyclic ancestry layout places every parent in an earlier generation than the child', () => {
  const tree = sampleTree();
  const points = new Map(layoutFamilyTree(tree).map(({ person, generation }) => [person.id, generation]));
  assert.ok(points.get('p1') < points.get('c1'));
  assert.ok(points.get('p2') < points.get('c1'));
  assert.throws(() => layoutFamilyTree(tree, { horizontalGap: 10 }), /spacing/u);
});

test('SVG escapes names and GEDCOM export retains dates, family links and notes locally', () => {
  const tree = sampleTree();
  tree.people[0] = Object.freeze({ ...tree.people[0], name: '<Ana & Luis>' });
  const svg = exportFamilyTreeSvg(tree);
  assert.match(svg, /&lt;Ana &amp; Luis&gt;/u);
  assert.doesNotMatch(svg, /<Ana & Luis>/u);
  const gedcom = exportFamilyTreeGedcom(tree);
  assert.match(gedcom, /2 DATE 1 JAN 1950/u);
  assert.match(gedcom, /1 CHIL @I3@/u);
  assert.match(gedcom, /2 PEDI OTHER/u);
  assert.match(gedcom, /1 NOTE Private note/u);
  assert.match(gedcom, /0 TRLR\r\n$/u);

  const adoption = createFamilyTree();
  addFamilyPerson(adoption, { id: 'p', name: 'Parent' });
  addFamilyPerson(adoption, { id: 'c', name: 'Child' });
  linkFamilyParent(adoption, 'p', 'c', 'adoptive');
  assert.match(exportFamilyTreeGedcom(adoption), /2 PEDI ADOPTED/u);
});
