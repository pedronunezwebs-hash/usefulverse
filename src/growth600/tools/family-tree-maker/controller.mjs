import { announce } from '../controller-helpers.mjs';
import { addFamilyPerson, createFamilyTree, exportFamilyTreeGedcom, exportFamilyTreeSvg, layoutFamilyTree, linkFamilyParent } from './logic.mjs';

const root = document.querySelector('[data-tool="family-tree-maker"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const status = root.querySelector('[data-status]');
  const result = root.querySelector('[data-result]');
  const peopleList = root.querySelector('[data-family-people]');
  const preview = root.querySelector('[data-family-svg]');
  const parentSelect = form.elements.namedItem('parentId');
  const childSelect = form.elements.namedItem('childId');
  let tree = createFamilyTree();
  let nextId = 1;

  function fillSelect(select, placeholder, options, selected = '') {
    select.replaceChildren();
    const empty = document.createElement('option');
    empty.value = ''; empty.textContent = placeholder;
    select.append(empty);
    for (const person of options) {
      const option = document.createElement('option');
      option.value = person.id; option.textContent = person.name;
      select.append(option);
    }
    select.value = selected;
  }

  function render() {
    result.hidden = tree.people.length === 0;
    peopleList.replaceChildren();
    for (const person of tree.people) {
      const item = document.createElement('li');
      const dates = [person.birthDate, person.deathDate].filter(Boolean).join(' – ');
      item.textContent = dates ? `${person.name} (${dates})` : person.name;
      peopleList.append(item);
    }
    const oldParent = parentSelect.value;
    const oldChild = childSelect.value;
    fillSelect(parentSelect, copy.fields.parent, tree.people, oldParent);
    fillSelect(childSelect, copy.fields.child, tree.people, oldChild);
    if (!tree.people.length) { preview.replaceChildren(); return; }
    const layout = layoutFamilyTree(tree);
    const width = Math.max(440, ...layout.map(({ x }) => x + 180));
    preview.style.overflowX = 'auto';
    preview.innerHTML = exportFamilyTreeSvg(tree);
    preview.querySelector('svg')?.setAttribute('aria-label', copy.actions.result);
    preview.querySelector('svg')?.setAttribute('role', 'img');
    preview.style.maxWidth = `${width}px`;
  }

  function download(filename, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = filename; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    announce(root, copy.messages.exported, 'success');
  }

  root.querySelector('[data-action="addPerson"]')?.addEventListener('click', () => {
    try {
      addFamilyPerson(tree, {
        id: `P${nextId++}`,
        name: form.elements.namedItem('personName').value,
        birthDate: form.elements.namedItem('birthDate').value,
        deathDate: form.elements.namedItem('deathDate').value,
        notes: form.elements.namedItem('notes').value,
      });
      form.elements.namedItem('personName').value = '';
      form.elements.namedItem('birthDate').value = '';
      form.elements.namedItem('deathDate').value = '';
      form.elements.namedItem('notes').value = '';
      render(); announce(root, copy.messages.personAdded, 'success');
    } catch { announce(root, copy.messages.invalidEntry, 'error'); }
  });

  root.querySelector('[data-action="linkPeople"]')?.addEventListener('click', () => {
    try {
      linkFamilyParent(tree, parentSelect.value, childSelect.value, form.elements.namedItem('relationship').value);
      render(); announce(root, copy.messages.linkAdded, 'success');
    } catch { announce(root, copy.messages.invalidEntry, 'error'); }
  });

  root.querySelector('[data-action="exportSvg"]')?.addEventListener('click', () => {
    if (!tree.people.length) return announce(root, copy.messages.emptyTree, 'error');
    download('family-tree.svg', exportFamilyTreeSvg(tree), 'image/svg+xml;charset=utf-8');
  });
  root.querySelector('[data-action="exportGedcom"]')?.addEventListener('click', () => {
    if (!tree.people.length) return announce(root, copy.messages.emptyTree, 'error');
    download('family-tree.ged', exportFamilyTreeGedcom(tree), 'text/plain;charset=utf-8');
  });
  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    tree = createFamilyTree(); nextId = 1; form.reset(); render(); announce(root, '');
  });
  render();
}
