import { createCounter, countDown, countUp } from './logic.mjs';

const root = document.querySelector('[data-tool="prayer-beads-counter"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const fields = copy.fields;
  const save = form.elements.namedItem('remember');
  const haptics = form.elements.namedItem('haptics');
  const storageKey = 'usefulverse-prayer-counter-v1';
  let state = createCounter();

  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = String(text);
    if (className) element.className = className;
    return element;
  };
  function persist() {
    if (!save.checked) return true;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ target: state.target, count: state.count, completedSets: state.completedSets }));
      return true;
    } catch {
      status.textContent = copy.messages.storageUnavailable;
      status.classList.add('status--error');
      return false;
    }
  }
  function vibrate() {
    if (haptics.checked && typeof navigator.vibrate === 'function') navigator.vibrate(25);
  }
  function paint() {
    content.replaceChildren();
    const display = node('p', `${fields.currentCount}: ${state.count}`, 'pending-counter-number');
    display.setAttribute('aria-live', 'polite');
    content.append(display);
    if (state.target) {
      content.append(node('p', `${fields.target}: ${state.target}`), node('p', `${fields.completedSets}: ${state.completedSets}`));
      const beads = node('ol', undefined, 'pending-beads');
      beads.setAttribute('aria-label', fields.progress);
      for (let index = 0; index < Math.min(state.target, 60); index++) {
        const bead = node('li', undefined, 'pending-bead');
        if (index < state.count) bead.classList.add('pending-bead--filled');
        beads.append(bead);
      }
      if (state.target > 60) content.append(node('p', fields.visualLimit));
      content.append(beads);
    }
    const actions = node('div', undefined, 'pending-counter-actions');
    for (const [key, change] of [
      ['decrement', () => { state = countDown(state); vibrate(); status.textContent = state.reachedStart ? copy.messages.atStart : ''; }],
      ['increment', () => { state = countUp(state); vibrate(); status.textContent = state.reachedTarget ? copy.messages.targetReached : ''; }],
    ]) {
      const button = node('button', fields[key], 'button button--secondary');
      button.type = 'button';
      button.addEventListener('click', () => { change(); persist(); paint(); });
      actions.append(button);
    }
    const reset = node('button', fields.resetCount, 'button button--secondary');
    reset.type = 'button';
    reset.addEventListener('click', () => { state = createCounter({ target: state.target }); status.textContent = copy.messages.reset; persist(); paint(); });
    actions.append(reset);
    content.append(actions);
    result.hidden = false;
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const target = Number(form.elements.namedItem('target').value || 0);
      const start = Number(form.elements.namedItem('start').value || 0);
      state = createCounter({ target, start });
      status.textContent = copy.messages.ready;
      status.classList.remove('status--error');
      persist();
      paint();
    } catch (error) {
      status.textContent = error.message;
      status.classList.add('status--error');
      result.hidden = false;
    }
  });
  save.addEventListener('change', () => {
    if (save.checked) persist();
    else { try { localStorage.removeItem(storageKey); status.textContent = copy.messages.cleared; } catch { status.textContent = copy.messages.storageUnavailable; } }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    state = createCounter();
    try { localStorage.removeItem(storageKey); } catch {}
    content.replaceChildren();
    result.hidden = true;
    status.textContent = '';
    status.classList.remove('status--error');
  }));
  {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (stored && Number.isInteger(stored.target) && Number.isInteger(stored.count) && Number.isInteger(stored.completedSets) && stored.target >= 0 && stored.target <= 1000000 && stored.count >= 0 && stored.count <= 1000000 && stored.completedSets >= 0) {
        state = { target: stored.target, count: stored.count, completedSets: stored.completedSets };
        save.checked = true;
        paint();
      }
    } catch {
      status.textContent = copy.messages.storageUnavailable;
      status.classList.add('status--error');
    }
  }
}
