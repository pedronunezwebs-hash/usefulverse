import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';
import { compareJsonDocuments } from './logic.mjs';

const root = document.querySelector('[data-tool="json-diff"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('arrayMode');
  const keyField = form.elements.namedItem('arrayKey');
  const list = root.querySelector('[data-diff-list]');
  const patchField = root.querySelector('[data-json-patch]');
  let summaryText = '';
  let patchText = '';

  function clear() {
    clearResult(root);
    list.replaceChildren();
    patchField.value = '';
    summaryText = '';
    patchText = '';
  }

  function valueLabel(value) {
    if (value === undefined) return '—';
    const serialized = JSON.stringify(value);
    return serialized.length > 240 ? `${serialized.slice(0, 237)}…` : serialized;
  }

  function compare(event) {
    event?.preventDefault();
    clear();
    try {
      const result = compareJsonDocuments(form.elements.namedItem('before').value, form.elements.namedItem('after').value, {
        arrayKey: mode.value === 'key' ? keyField.value : '',
      });
      showRows(root, [
        [copy.fields.added, String(result.summary.added)],
        [copy.fields.removed, String(result.summary.removed)],
        [copy.fields.changed, String(result.summary.changed)],
      ]);
      if (result.changes.length === 0) {
        const item = document.createElement('li'); item.textContent = copy.fields.noChanges; list.append(item);
        announce(root, copy.messages.noChanges, 'success');
      } else {
        const fragment = document.createDocumentFragment();
        for (const change of result.changes) {
          const item = document.createElement('li');
          const heading = document.createElement('strong'); heading.textContent = `${copy.fields[change.kind] ?? change.kind}: ${change.path}`;
          const detail = document.createElement('p'); detail.textContent = `${copy.fields.oldValue}: ${valueLabel(change.before)} · ${copy.fields.newValue}: ${valueLabel(change.after)}`;
          item.append(heading, detail); fragment.append(item);
        }
        list.append(fragment);
        announce(root, copy.messages.compared, 'success');
      }
      patchText = JSON.stringify(result.patch, null, 2);
      patchField.value = patchText;
      summaryText = `${copy.fields.added}: ${result.summary.added}\n${copy.fields.removed}: ${result.summary.removed}\n${copy.fields.changed}: ${result.summary.changed}\n\n${result.changes.map((change) => `${change.kind}: ${change.path}\n  ${copy.fields.oldValue}: ${valueLabel(change.before)}\n  ${copy.fields.newValue}: ${valueLabel(change.after)}`).join('\n')}`;
    } catch (error) {
      announce(root, error.message?.includes('too many changes') ? copy.fields.tooMany : copy.messages.invalid, 'error');
    }
  }

  form.addEventListener('submit', compare);
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  mode.addEventListener('change', () => { keyField.disabled = mode.value !== 'key'; clear(); announce(root, ''); });
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); keyField.disabled = mode.value !== 'key'; announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('before').value = copy.exampleBefore;
    form.elements.namedItem('after').value = copy.exampleAfter;
    mode.value = 'key'; keyField.value = 'id'; keyField.disabled = false;
    compare();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (summaryText) copyText(root, summaryText, copy);
    else announce(root, copy.messages.invalid, 'error');
  });
  root.querySelector('[data-action="copyPatch"]')?.addEventListener('click', () => {
    if (patchText) copyText(root, patchText, copy);
    else announce(root, copy.messages.invalid, 'error');
  });
  root.querySelector('[data-action="downloadPatch"]')?.addEventListener('click', () => {
    if (!patchText) return announce(root, copy.messages.invalid, 'error');
    const url = URL.createObjectURL(new Blob([patchText], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'json-patch.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
  keyField.disabled = mode.value !== 'key';
}
