import { previousGraphemeBoundary } from './logic.mjs';

const root = document.querySelector('[data-tool="virtual-keyboard"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const rowsInput = form.querySelector('[data-input="rows"]');
  const textInput = form.querySelector('[data-input="text"]');
  const button = (label, className = 'button button--secondary') => {
    const item = document.createElement('button'); item.type = 'button'; item.className = className; item.textContent = label; return item;
  };
  const insert = (value) => {
    const start = textInput.selectionStart ?? textInput.value.length;
    const end = textInput.selectionEnd ?? start;
    textInput.setRangeText(value, start, end, 'end');
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    textInput.focus();
  };
  const removePrevious = () => {
    const start = textInput.selectionStart ?? textInput.value.length;
    const end = textInput.selectionEnd ?? start;
    if (start !== end) { textInput.setRangeText('', start, end, 'end'); }
    else if (start > 0) {
      const before = textInput.value.slice(0, start);
      const boundary = previousGraphemeBoundary(before);
      textInput.setRangeText('', boundary, start, 'end');
    }
    textInput.dispatchEvent(new Event('input', { bubbles: true })); textInput.focus();
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error');
    const rows = rowsInput.value.split(/\r?\n/u).map((line) => line.trim().split(/\s+/u).filter(Boolean)).filter((line) => line.length);
    if (!rows.length || rows.length > 12 || rows.some((line) => line.length > 30 || line.some((key) => [...key].length > 12))) {
      result.hidden = false; status.textContent = copy.messages.error; status.classList.add('status--error'); return;
    }
    const keyboard = document.createElement('section'); keyboard.className = 'pending-virtual-keys'; keyboard.setAttribute('aria-label', copy.fields.resultTitle);
    for (const row of rows) {
      const rowElement = document.createElement('div'); rowElement.className = 'pending-virtual-keys__row';
      for (const key of row) {
        const keyButton = button(key, 'button button--secondary pending-virtual-keys__button'); keyButton.setAttribute('aria-label', key);
        keyButton.addEventListener('click', () => insert(key)); rowElement.append(keyButton);
      }
      keyboard.append(rowElement);
    }
    content.append(keyboard);
    const actions = document.createElement('div'); actions.className = 'pending-virtual-actions';
    const space = button(copy.fields.insertSpace); space.addEventListener('click', () => insert(' '));
    const lineBreak = button(copy.fields.insertLineBreak); lineBreak.addEventListener('click', () => insert('\n'));
    const backspace = button(copy.fields.backspace); backspace.addEventListener('click', removePrevious);
    const clear = button(copy.fields.clearText); clear.addEventListener('click', () => { textInput.value = ''; textInput.focus(); });
    const copyText = button(copy.fields.copyText); copyText.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(textInput.value); status.textContent = copy.messages.copied; }
      catch { status.textContent = copy.messages.copyUnavailable; status.classList.add('status--error'); }
    });
    actions.append(space, lineBreak, backspace, clear, copyText); content.append(actions); result.hidden = false;
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
