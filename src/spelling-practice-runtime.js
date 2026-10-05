import { checkSpelling, parseSpellingWords, shuffleItems } from './local-planners-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);

export function setupSpellingPractice(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const status = (key, type = '', values = {}) => {
    const output = $('#op-status', root);
    output.textContent = say(key, values);
    output.className = `tool-status${type ? ` is-${type}` : ''}`;
  };
  let bank = []; let round = []; let missed = []; let index = 0; let score = 0; let answered = false;
  const section = $('[data-spelling-round]', root);
  const input = $('[data-spelling-guess]', root);
  const review = $('[data-spelling-review]', root);
  const startButton = $('[data-spelling-start]', root);
  const render = () => {
    const item = round[index]; answered = false; section.hidden = !item;
    if (!item) return;
    $('[data-spelling-progress]', root).textContent = say('Word {current} of {total}', { current: index + 1, total: round.length });
    $('[data-spelling-hint]', root).textContent = item.hint; input.value = '';
    $('[data-spelling-feedback]', root).textContent = '';
    $('[data-spelling-check]', root).disabled = false;
    $('[data-spelling-next]', root).hidden = true;
    input.focus();
  };
  const begin = (entries) => { round = shuffleItems(entries); missed = []; index = 0; score = 0; review.hidden = true; render(); status(''); };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-spelling-start]')) {
      try { bank = parseSpellingWords($('[data-spelling-list]', root).value); begin(bank); startButton.textContent = say('New round'); status('Practice list loaded.', 'success'); }
      catch (error) {
        const message = ['Enter between 2 and 100 non-empty word | hint lines.', 'Each line needs a word and a hint separated by |.', 'Words must be unique.'].includes(error.message)
          ? error.message : 'Each line needs a word and a hint separated by |.';
        status(message, 'error');
      }
      return;
    }
    if (event.target.closest('[data-spelling-check]')) {
      if (!round[index] || answered) return;
      if (!input.value.trim()) return status('Enter a spelling before checking.', 'error');
      const item = round[index]; answered = true;
      if (checkSpelling(input.value, item.word)) { score += 1; $('[data-spelling-feedback]', root).textContent = say('Correct!'); }
      else { missed.push(item); $('[data-spelling-feedback]', root).textContent = say('Not quite. The answer is {answer}.', { answer: item.word }); }
      $('[data-spelling-check]', root).disabled = true;
      $('[data-spelling-next]', root).hidden = false;
      return;
    }
    if (event.target.closest('[data-spelling-next]') && answered) {
      index += 1;
      if (index >= round.length) { section.hidden = true; status('Round complete: {score} of {total} correct.', 'success', { score, total: round.length }); review.hidden = missed.length === 0; }
      else render();
      return;
    }
    if (event.target.closest('[data-spelling-review]') && missed.length) { begin(missed); return; }
    if (event.target.closest('[data-spelling-clear]')) {
      bank = []; round = []; missed = []; index = 0; $('[data-spelling-list]', root).value = '';
      startButton.textContent = say('Load practice list'); section.hidden = true; review.hidden = true; status('List cleared.');
    }
  });
}
