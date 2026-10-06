import { hangulChoices, makeHangulRound } from './local-planners-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);

export function setupHangulPractice(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const status = (key, type = '', values = {}) => {
    const output = $('#op-status', root);
    output.textContent = say(key, values);
    output.className = `tool-status${type ? ` is-${type}` : ''}`;
  };
  const section = $('[data-hangul-round]', root);
  let round = [];
  let index = 0;
  let score = 0;
  let answered = false;

  const render = () => {
    const item = round[index];
    answered = false;
    section.hidden = !item;
    if (!item) return;
    $('[data-hangul-progress]', root).textContent = say('Question {current} of {total}', { current: index + 1, total: round.length });
    $('[data-hangul-symbol]', root).textContent = item.symbol;
    $('[data-hangul-feedback]', root).textContent = '';
    const choices = $('[data-hangul-choices]', root);
    choices.replaceChildren();
    hangulChoices(item.answer).forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button button--ghost';
      button.textContent = choice;
      button.dataset.hangulCorrect = String(choice === item.answer);
      choices.append(button);
    });
    $('[data-hangul-next]', root).hidden = true;
  };

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-hangul-start]')) {
      try {
        round = makeHangulRound($('[data-hangul-group]', root).value, Number($('[data-hangul-count]', root).value));
        index = 0;
        score = 0;
        render();
        status('');
      } catch (error) {
        status(error instanceof Error ? error.message : 'Start a round to practice.', 'error');
      }
      return;
    }
    const choice = event.target.closest('[data-hangul-choices] button');
    if (choice && !answered) {
      answered = true;
      if (choice.dataset.hangulCorrect === 'true') {
        score += 1;
        $('[data-hangul-feedback]', root).textContent = say('Correct!');
      } else {
        $('[data-hangul-feedback]', root).textContent = say('Not quite. The reading is {answer}.', { answer: round[index].answer });
      }
      $('[data-hangul-choices]', root).querySelectorAll('button').forEach((button) => { button.disabled = true; });
      const next = $('[data-hangul-next]', root);
      next.textContent = say(index === round.length - 1 ? 'Finish round' : 'Next');
      next.hidden = false;
      return;
    }
    if (event.target.closest('[data-hangul-next]') && answered) {
      index += 1;
      if (index === round.length) {
        round = [];
        section.hidden = true;
        status('Round complete: {score} of {total} correct.', 'success', { score, total: index });
      } else render();
    }
  });
}
