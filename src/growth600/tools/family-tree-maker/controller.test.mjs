import assert from 'node:assert/strict';
import test from 'node:test';
import { familyTreeMakerEnglishCopy as copy } from '../../locales/family-tree-maker.en.mjs';

class Node {
  constructor(value = '') { this.value = value; this.textContent = ''; this.hidden = false; this.dataset = {}; this.listeners = new Map(); this.children = []; this.style = {}; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  fire(type = 'click') { this.listeners.get(type)?.({ preventDefault() {}, target: this }); }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute() {}
  querySelector() { return new Node(); }
  click() {}
  reset() {}
}

test('controller keeps entered data in memory and rejects a parent cycle through the accessible form flow', async () => {
  const previousDocument = globalThis.document;
  const fields = Object.fromEntries(['personName', 'birthDate', 'deathDate', 'notes', 'parentId', 'childId', 'relationship'].map((name) => [name, new Node(name === 'relationship' ? 'biological' : '')]));
  const form = new Node(); form.elements = { namedItem: (name) => fields[name] };
  const status = new Node(); const people = new Node(); const preview = new Node(); const result = new Node();
  const copyNode = new Node(); copyNode.textContent = JSON.stringify(copy);
  const actions = Object.fromEntries(['addPerson', 'linkPeople', 'exportSvg', 'exportGedcom', 'reset'].map((action) => [action, new Node()]));
  const selectors = { '#tool-form': form, '[data-tool-copy]': copyNode, '[data-status]': status, '[data-result]': result, '[data-family-people]': people, '[data-family-svg]': preview, ...Object.fromEntries(Object.entries(actions).map(([action, node]) => [`[data-action="${action}"]`, node])) };
  const root = { querySelector: (selector) => selectors[selector] ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: () => root, createElement: () => new Node() };
  try {
    await import(`./controller.mjs?test=${Date.now()}`);
    fields.personName.value = 'Alex'; actions.addPerson.fire();
    fields.personName.value = 'Casey'; actions.addPerson.fire();
    assert.equal(people.children.length, 2);
    fields.parentId.value = 'P1'; fields.childId.value = 'P2'; actions.linkPeople.fire();
    assert.equal(status.textContent, copy.messages.linkAdded);
    fields.parentId.value = 'P2'; fields.childId.value = 'P1'; actions.linkPeople.fire();
    assert.equal(status.textContent, copy.messages.invalidEntry);
    assert.match(preview.innerHTML, /Alex/u);
    assert.match(preview.innerHTML, /Casey/u);
  } finally {
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});
