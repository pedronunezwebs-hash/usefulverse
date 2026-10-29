import { GAD7_ITEM_COUNT, scoreGad7, validateGad7Difficulty } from './logic.mjs';

const root = document.querySelector('[data-gad7]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-gad7-form]');
  const result = root.querySelector('[data-result]');
  const scoreText = root.querySelector('[data-score]');
  const bandText = root.querySelector('[data-band]');
  const difficultyText = root.querySelector('[data-difficulty]');
  const status = root.querySelector('[data-status]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const data = new FormData(form);
      const scored = scoreGad7(Array.from({ length: GAD7_ITEM_COUNT }, (_, i) => Number(data.get(`q${i + 1}`))));
      const difficulty = validateGad7Difficulty(data.get('difficulty'));
      scoreText.textContent = copy.messages.total.replace('{score}', String(scored.total));
      bandText.textContent = copy.fields[scored.severity];
      difficultyText.textContent = `${copy.fields.difficultyResult}: ${copy.fields[`difficulty${difficulty}`]}`;
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
    result.hidden = true;
    scoreText.textContent = ''; bandText.textContent = ''; difficultyText.textContent = '';
    status.textContent = ''; status.classList.remove('status--error', 'status--success');
  }));
}
