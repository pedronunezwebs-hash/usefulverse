import { copyText } from '../controller-helpers.mjs';
import { loveNameScore } from '../pending-23/logic.mjs';

const root = document.querySelector('[data-tool="love-calculator"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const node = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };
  const clear = () => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); clear();
    const names = Object.fromEntries([...form.querySelectorAll('[data-input]')].map((control) => [control.dataset.input, control.value]));
    try {
      const score = loveNameScore(names);
      const card = node('article', undefined, 'pending-love-card');
      card.setAttribute('aria-label', copy.fields.resultTitle);
      card.append(node('p', copy.fields.cardTitle, 'pending-love-card__eyebrow'));
      card.append(node('h3', `${score.nameA} ♥ ${score.nameB}`));
      const scoreLine = node('p', undefined, 'pending-love-card__score');
      scoreLine.append(node('strong', new Intl.NumberFormat(copy.copyLanguage?.replaceAll('_', '-') ?? undefined).format(score.score)), node('span', ` ${copy.fields.outOf} 100`));
      card.append(scoreLine, node('p', copy.fields.formulaNote, 'pending-love-card__note'));
      const button = node('button', copy.fields.copyCard, 'button button--secondary'); button.type = 'button';
      button.addEventListener('click', () => copyText(root, `${score.nameA} + ${score.nameB}: ${score.score}/100. ${copy.fields.formulaNote}`, copy));
      content.append(card, button); result.hidden = false; status.textContent = copy.messages.complete;
    } catch {
      status.textContent = copy.messages.error;
      status.classList.add('status--error');
    }
  });
  form.addEventListener('reset', () => queueMicrotask(clear));
  for (const control of form.querySelectorAll('[data-input]')) control.addEventListener('input', clear);
}
