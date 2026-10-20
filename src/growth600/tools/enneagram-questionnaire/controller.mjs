import { announce, readToolCopy } from '../controller-helpers.mjs';
import { ENNEAGRAM_QUESTION_THEMES, scoreEnneagramReflection } from './logic.mjs';

const root = document.querySelector('[data-tool="enneagram-questionnaire"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const result = root.querySelector('[data-enneagram-result]');
  const output = root.querySelector('[data-enneagram-output]');
  const progress = root.querySelector('[data-enneagram-progress]');
  const calculate = form.querySelector('button[type="submit"]');
  const shuffled = ENNEAGRAM_QUESTION_THEMES.map((theme, index) => ({ theme, index }));
  const random = () => {
    if (!globalThis.crypto?.getRandomValues) return Math.random();
    const word = new Uint32Array(1); globalThis.crypto.getRandomValues(word); return word[0] / 0x1_0000_0000;
  };
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1)); [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  const locale = document.documentElement.lang || 'en';
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const updateProgress = () => {
    const answered = shuffled.filter(({ index }) => form.elements.namedItem(`q${String(index + 1).padStart(2, '0')}`)?.value).length;
    progress.textContent = copy.fields.progress.replace('{answered}', number.format(answered)).replace('{total}', number.format(shuffled.length));
    calculate.disabled = answered !== shuffled.length;
  };
  const addTheme = (parent, entry) => {
    const article = document.createElement('article'); article.className = 'enneagram-result__theme';
    const title = document.createElement('h4'); title.textContent = `${copy.fields.themeLabel} ${number.format(entry.theme)} · ${copy.fields.themeNames[entry.theme - 1]}`;
    const points = document.createElement('p'); points.textContent = `${copy.fields.scoreLabel}: ${number.format(entry.points)} / ${number.format(entry.outOf)}`;
    const description = document.createElement('p'); description.textContent = copy.fields.themeDescriptions[entry.theme - 1];
    article.append(title, points, description); parent.append(article);
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const responses = shuffled.map(({ index }) => form.elements.namedItem(`q${String(index + 1).padStart(2, '0')}`)?.value ?? '');
    try {
      const summary = scoreEnneagramReflection(responses, shuffled.map(({ theme }) => theme));
      output.replaceChildren();
      output.append(Object.assign(document.createElement('p'), { textContent: summary.leaders.length > 1 ? copy.fields.tieNotice : copy.fields.leadNotice }));
      summary.leaders.forEach((entry) => addTheme(output, entry));
      if (summary.closeMatches.length) {
        output.append(Object.assign(document.createElement('h3'), { textContent: copy.fields.closeThemes }));
        summary.closeMatches.forEach((entry) => addTheme(output, entry));
      }
      output.append(Object.assign(document.createElement('p'), { className: 'hint', textContent: copy.fields.caveat }));
      result.hidden = false; announce(root, copy.messages.complete, 'success');
    } catch {
      announce(root, copy.messages.error, 'error');
    }
  });
  form.addEventListener('reset', () => {
    result.hidden = true; output.replaceChildren();
    queueMicrotask(() => { updateProgress(); announce(root, copy.messages.reset); });
  });
  form.addEventListener('change', () => {
    updateProgress(); result.hidden = true; output.replaceChildren();
    const status = root.querySelector('[data-status]'); if (status) { status.textContent = ''; status.removeAttribute('data-kind'); }
  });
  updateProgress();
}
