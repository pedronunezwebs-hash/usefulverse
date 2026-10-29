import { scoreAsrsV11 } from './logic.mjs';

const root = document.querySelector('[data-asrs]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-asrs-form]'), result = root.querySelector('[data-result]');
  const scoreText = root.querySelector('[data-score]'), bandText = root.querySelector('[data-band]'), status = root.querySelector('[data-status]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const data = new FormData(form);
      const scored = scoreAsrsV11(Array.from({length:6},(_,i)=>Number(data.get(`q${i+1}`))));
      scoreText.textContent = copy.messages.total.replace('{score}',String(scored.total));
      bandText.textContent = copy.fields[scored.band];
      result.hidden = false;
      status.textContent = copy.messages.complete;
      status.classList.remove('status--error'); status.classList.add('status--success');
    } catch {
      status.textContent = copy.messages.incomplete;
      status.classList.remove('status--success'); status.classList.add('status--error');
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    result.hidden = true; scoreText.textContent = ''; bandText.textContent = '';
    status.textContent = ''; status.classList.remove('status--error','status--success');
  }));
}
