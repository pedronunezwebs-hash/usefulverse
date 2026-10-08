import { addMindMapNode, createMindMap, editMindMapNode, exportMindMapSvg, getMindMapRows, moveMindMapNode, removeMindMapNode, reorderMindMapNode, restoreMindMap, toggleMindMapNode } from './logic.mjs';
import { announce, clearResult, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="mind-map-maker"]');
const MAX_BACKUP_BYTES = 500_000;

if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const result = root.querySelector('[data-result]');
  const list = root.querySelector('[data-mind-map]');
  const topicInput = form.elements.namedItem('centralTopic');
  const newIdeaInput = form.elements.namedItem('newIdea');
  const undoButton = root.querySelector('[data-action="undo"]');
  const redoButton = root.querySelector('[data-action="redo"]');
  let map = null;
  let undoStack = [];
  let redoStack = [];

  const button = (action, text, id, disabled = false) => {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = 'button button--secondary';
    element.dataset.action = action;
    if (id) element.dataset.nodeId = id;
    element.textContent = text;
    element.disabled = disabled;
    return element;
  };

  function remember(next) {
    if (map) undoStack = [...undoStack.slice(-29), map];
    redoStack = [];
    map = next;
    render();
  }

  function render() {
    if (!map) return;
    result.hidden = false;
    undoButton.disabled = undoStack.length === 0;
    redoButton.disabled = redoStack.length === 0;
    const rows = getMindMapRows(map);
    const childrenByParent = new Set(map.nodes.filter(({ parentId }) => parentId !== null).map(({ parentId }) => parentId));
    const descendantsOf = (id) => {
      const found = new Set([id]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const item of map.nodes) if (found.has(item.parentId) && !found.has(item.id)) { found.add(item.id); changed = true; }
      }
      return found;
    };
    const elements = rows.map((node) => {
      const item = document.createElement('li');
      item.style.marginInlineStart = `${node.depth * 1.25}rem`;
      const row = document.createElement('div');
      row.className = 'actions';
      const editor = document.createElement('input');
      editor.type = 'text';
      editor.id = `mind-map-edit-${node.id}`;
      editor.name = `edit-${node.id}`;
      editor.maxLength = 160;
      editor.value = node.text;
      editor.dataset.editNode = node.id;
      editor.setAttribute('aria-label', `${copy.fields.editIdea}: ${node.text}`);
      row.append(editor);
      row.append(button('add-child', copy.actions.addChild, node.id));
      if (node.parentId !== null) {
        const excluded = descendantsOf(node.id);
        const parentSelect = document.createElement('select');
        parentSelect.id = `mind-map-parent-${node.id}`;
        parentSelect.name = `parent-${node.id}`;
        parentSelect.dataset.moveParent = node.id;
        parentSelect.setAttribute('aria-label', `${copy.fields.moveTo}: ${node.text}`);
        for (const candidate of map.nodes) if (!excluded.has(candidate.id)) {
          const option = document.createElement('option');
          option.value = candidate.id;
          option.textContent = candidate.text;
          option.selected = candidate.id === node.parentId;
          parentSelect.append(option);
        }
        row.append(parentSelect, button('move-node', copy.actions.moveNode, node.id));
        row.append(button('move-up', copy.actions.moveUp, node.id, !rows.some(({ id, parentId }, index) => id === node.id && rows.slice(0, index).some((previous) => previous.parentId === parentId))));
        row.append(button('move-down', copy.actions.moveDown, node.id, !rows.some(({ id, parentId }, index) => id === node.id && rows.slice(index + 1).some((next) => next.parentId === parentId))));
        row.append(button('remove-node', copy.actions.removeNode, node.id));
      }
      if (childrenByParent.has(node.id)) row.append(button('toggle-node', node.collapsed ? copy.actions.expand : copy.actions.collapse, node.id));
      item.append(row);
      return item;
    });
    list.replaceChildren(...elements);
  }

  function download(name, contents, type) {
    const url = URL.createObjectURL(new Blob([contents], { type }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function generate(event) {
    event?.preventDefault();
    clearResult(root);
    undoStack = [];
    redoStack = [];
    try {
      map = createMindMap(topicInput.value);
      render();
      announce(root, copy.messages.created, 'success');
    } catch {
      map = null;
      result.hidden = true;
      announce(root, copy.messages.checkTopic, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    topicInput.value = 'Plan a community event';
    newIdeaInput.value = '';
    map = addMindMapNode(createMindMap(topicInput.value), 'idea-1', 'Choose a date and venue');
    map = addMindMapNode(map, 'idea-1', 'Invite guests');
    map = addMindMapNode(map, 'idea-2', 'Book a community hall');
    undoStack = [];
    redoStack = [];
    render();
    announce(root, copy.messages.created, 'success');
  });
  form.addEventListener('submit', generate);
  form.addEventListener('reset', () => setTimeout(() => {
    map = null;
    undoStack = [];
    redoStack = [];
    list.replaceChildren();
    clearResult(root);
    result.hidden = true;
  }, 0));

  list.addEventListener('change', (event) => {
    const editor = event.target.closest('[data-edit-node]');
    if (!editor || !map) return;
    try {
      remember(editMindMapNode(map, editor.dataset.editNode, editor.value));
      announce(root, copy.messages.updated, 'success');
    } catch {
      announce(root, copy.messages.checkIdea, 'error');
      editor.value = map.nodes.find(({ id }) => id === editor.dataset.editNode)?.text ?? '';
    }
  });

  list.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action][data-node-id]');
    if (!control || !map) return;
    const { action, nodeId } = control.dataset;
    try {
      if (action === 'add-child') {
        if (!newIdeaInput.value.trim()) {
          announce(root, copy.messages.enterIdea, 'error');
          return;
        }
        remember(addMindMapNode(map, nodeId, newIdeaInput.value));
        newIdeaInput.value = '';
        announce(root, copy.messages.added, 'success');
      } else if (action === 'remove-node') {
        remember(removeMindMapNode(map, nodeId));
        announce(root, copy.messages.removed, 'success');
      } else if (action === 'move-up' || action === 'move-down') remember(reorderMindMapNode(map, nodeId, action === 'move-up' ? -1 : 1));
      else if (action === 'move-node') {
        const destination = [...list.querySelectorAll('[data-move-parent]')].find((select) => select.dataset.moveParent === nodeId)?.value;
        remember(moveMindMapNode(map, nodeId, destination));
      }
      else if (action === 'toggle-node') remember(toggleMindMapNode(map, nodeId));
    } catch (error) {
      announce(root, copy.messages.checkIdea, 'error');
    }
  });

  undoButton.addEventListener('click', () => {
    if (!undoStack.length || !map) return;
    redoStack = [...redoStack.slice(-29), map];
    map = undoStack.pop();
    render();
  });
  redoButton.addEventListener('click', () => {
    if (!redoStack.length || !map) return;
    undoStack = [...undoStack.slice(-29), map];
    map = redoStack.pop();
    render();
  });
  root.querySelector('[data-action="export-svg"]')?.addEventListener('click', () => {
    if (map) download('usefulverse-mind-map.svg', exportMindMapSvg(map), 'image/svg+xml;charset=utf-8');
  });
  root.querySelector('[data-action="export-json"]')?.addEventListener('click', () => {
    if (map) download('usefulverse-mind-map.json', JSON.stringify(map, null, 2), 'application/json;charset=utf-8');
  });
  form.elements.namedItem('jsonFile').addEventListener('change', async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new RangeError('File too large.');
      const imported = restoreMindMap(JSON.parse(await file.text()));
      topicInput.value = imported.nodes[0].text;
      undoStack = [];
      redoStack = [];
      map = imported;
      render();
      announce(root, copy.messages.imported, 'success');
    } catch {
      announce(root, copy.messages.importFailed, 'error');
    } finally {
      event.currentTarget.value = '';
    }
  });
}
