import { scorePhq9, validateDifficulty } from './logic.mjs';

const root = document.querySelector('[data-phq9]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-phq9-form]'), result = root.querySelector('[data-result]');
  const scoreText = root.querySelector('[data-score]'), bandText = root.querySelector('[data-band]');
  const difficultyText = root.querySelector('[data-difficulty]'), safety = root.querySelector('[data-safety]');
  const status = root.querySelector('[data-status]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const data = new FormData(form);
      const scored = scorePhq9(Array.from({length:9},(_,i)=>Number(data.get(`q${i+1}`))));
      const difficulty = validateDifficulty(data.get('difficulty'));
      scoreText.textContent = copy.messages.total.replace('{score}',String(scored.total));
      bandText.textContent = copy.fields[scored.severity];
      difficultyText.textContent = `${copy.fields.difficultyResult}: ${copy.fields[`difficulty${difficulty}`]}`;
      safety.hidden = !scored.selfHarmItemPositive;
      result.hidden = false;
      status.textContent = copy.messages.complete;
      status.classList.remove('status--error');
      status.classList.add('status--success');
    } catch {
      status.textContent = copy.messages.incomplete;
      status.classList.remove('status--success');
      status.classList.add('status--error');
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    result.hidden = true; safety.hidden = true;
    scoreText.textContent = ''; bandText.textContent = ''; difficultyText.textContent = '';
    status.textContent = ''; status.classList.remove('status--error','status--success');
  }));
}
