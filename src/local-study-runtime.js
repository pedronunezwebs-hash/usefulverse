import { abacusValue, kanaChoices, makeAbacusProblem, makeKanaRound, makeMemoryDeck, normalizeQuizQuestion, shuffleItems } from './local-planners-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const download = (data) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, questions: data }, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-quiz.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export function setupLocalStudyTool(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const status = (key, type = '', values = {}) => { const output = $('#op-status', root); output.textContent = say(key, values); output.className = `tool-status${type ? ` is-${type}` : ''}`; };

  if (root.dataset.opEngine === 'abacus-practice') {
    const rods = $('[data-abacus-rods]', root); const problemText = $('[data-abacus-problem]', root); const result = $('[data-abacus-value]', root);
    const digits = [0, 0, 0, 0, 0]; let problem = null;
    const render = () => {
      const value = abacusValue(digits); result.textContent = say('Your value: {value}', { value });
      rods.replaceChildren();
      for (let place = 4; place >= 0; place -= 1) {
        const digit = digits[place]; const placeValue = 10 ** place;
        const rod = document.createElement('section'); rod.className = 'calculator-card'; rod.setAttribute('role', 'group'); rod.setAttribute('aria-label', say('Place {value}', { value: placeValue }));
        const label = document.createElement('p'); label.textContent = say('Place {value}', { value: placeValue }); rod.append(label);
        const beads = document.createElement('p'); beads.setAttribute('aria-hidden', 'true'); beads.textContent = `${digit >= 5 ? '●' : '○'}  ${'●'.repeat(digit % 5)}${'○'.repeat(4 - (digit % 5))}`; rod.append(beads);
        const output = document.createElement('output'); output.textContent = String(digit); output.setAttribute('aria-live', 'polite'); rod.append(output);
        const input = document.createElement('input'); input.className = 'tool-input'; input.type = 'number'; input.min = '0'; input.max = '9'; input.step = '1'; input.value = String(digit); input.dataset.abacusPlace = String(place); input.setAttribute('aria-label', say('Place {value}', { value: placeValue })); rod.append(input);
        rods.append(rod);
      }
    };
    const newProblem = () => { problem = makeAbacusProblem(); digits.fill(0); problemText.textContent = `${problem.left} + ${problem.right} = ?`; result.textContent = say('Your value: {value}', { value: 0 }); status(''); render(); };
    root.addEventListener('click', (event) => {
      if (event.target.closest('[data-abacus-new]')) { newProblem(); return; }
      if (event.target.closest('[data-abacus-check]')) {
        if (!problem) return status('Get an addition problem to begin.', 'error');
        const value = abacusValue(digits);
        if (value !== problem.sum) return status('Not yet. Adjust the rods and try again.', 'error');
        status('Correct! {left} + {right} = {sum}.', 'success', problem);
      }
    });
    rods.addEventListener('input', (event) => {
      const input = event.target.closest('[data-abacus-place]'); if (!input) return;
      const place = Number(input.dataset.abacusPlace); const value = Number(input.value);
      if (!Number.isInteger(value) || value < 0 || value > 9 || !Number.isInteger(place) || place < 0 || place >= digits.length) { input.value = String(digits[place] ?? 0); return; }
      digits[place] = value; render(); status(''); $('[data-abacus-rods] [data-abacus-place="' + place + '"]', root).focus();
    });
    render(); return;
  }

  if (root.dataset.opEngine === 'quiz-maker') {
    let bank = []; let rounds = []; let index = 0; let score = 0; let answered = false;
    const round = $('[data-quiz-round]', root);
    const render = () => {
      $('[data-quiz-count]', root).textContent = String(bank.length);
      $('[data-quiz-export]', root).disabled = $('[data-quiz-clear]', root).disabled = !bank.length;
      round.hidden = !rounds.length || index >= rounds.length;
      if (round.hidden) return;
      const item = rounds[index]; answered = false;
      $('[data-quiz-progress]', root).textContent = say('Question {current} of {total}', { current: index + 1, total: rounds.length });
      $('[data-quiz-prompt]', root).textContent = item.question;
      $('[data-quiz-feedback]', root).textContent = '';
      const choices = $('[data-quiz-choices]', root); choices.replaceChildren();
      shuffleItems(item.answers.map((text, answerIndex) => ({ text, correct: answerIndex === item.correct }))).forEach((answer) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--ghost'; button.textContent = answer.text; button.dataset.quizCorrect = String(answer.correct); choices.append(button);
      });
      $('[data-quiz-next]', root).hidden = true;
    };
    $('[data-quiz-form]', root).addEventListener('submit', (event) => {
      event.preventDefault();
      if (bank.length >= 100) return status('You can add up to 100 questions.', 'error');
      try { bank.push(normalizeQuizQuestion($('[data-quiz-question]', root).value, [...root.querySelectorAll('[data-quiz-answer]')].map((input) => input.value))); event.currentTarget.reset(); render(); status('Question added.', 'success'); }
      catch (error) { status(error instanceof Error ? error.message : 'Fill in the question and all four different answers.', 'error'); }
    });
    root.addEventListener('click', (event) => {
      const choice = event.target.closest('[data-quiz-choices] button');
      if (choice && !answered) {
        answered = true; const item = rounds[index];
        $('[data-quiz-feedback]', root).textContent = choice.dataset.quizCorrect === 'true' ? (score += 1, say('Correct!')) : say('Not quite. The correct answer was: {answer}', { answer: item.answers[item.correct] });
        $('[data-quiz-choices]', root).querySelectorAll('button').forEach((button) => { button.disabled = true; });
        const next = $('[data-quiz-next]', root); next.textContent = say(index === rounds.length - 1 ? 'Finish quiz' : 'Next question'); next.hidden = false;
      }
      if (event.target.closest('[data-quiz-start]')) { if (!bank.length) return status('Add at least one question before starting.', 'error'); rounds = shuffleItems(bank); index = 0; score = 0; render(); status(''); }
      if (event.target.closest('[data-quiz-next]') && answered) { index += 1; if (index === rounds.length) { rounds = []; round.hidden = true; status('Quiz complete: {score} out of {total}.', 'success', { score, total: bank.length }); } else render(); }
      if (event.target.closest('[data-quiz-export]')) { if (!bank.length) return status('No questions to download.', 'error'); download(bank); status('Quiz backup downloaded.', 'success'); }
      if (event.target.closest('[data-quiz-clear]')) { bank = []; rounds = []; index = 0; render(); round.hidden = true; status('Quiz cleared.'); }
    });
    render(); return;
  }

  if (root.dataset.opEngine === 'memory-game') {
    let deck = []; let open = []; let matched = new Set(); let moves = 0; let startedAt = 0; let ticker = 0; let mismatchTimeout = 0; let active = false;
    const board = $('[data-memory-board]', root); const movesOutput = $('[data-memory-moves]', root); const timeOutput = $('[data-memory-time]', root);
    const elapsed = () => active ? Math.floor((Date.now() - startedAt) / 1000) : 0;
    const renderTime = () => { const total = elapsed(); timeOutput.textContent = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`; };
    const stop = () => { clearInterval(ticker); clearTimeout(mismatchTimeout); ticker = 0; mismatchTimeout = 0; active = false; };
    const reset = (announce = false) => { stop(); deck = []; open = []; matched = new Set(); moves = 0; startedAt = 0; movesOutput.textContent = '0'; timeOutput.textContent = '0:00'; board.replaceChildren(); status(announce ? 'Game reset.' : 'Choose a board size and start.'); };
    const start = () => {
      reset(); deck = makeMemoryDeck(Number($('[data-memory-size]', root).value)); active = true; startedAt = Date.now(); ticker = setInterval(renderTime, 1000);
      board.style.gridTemplateColumns = `repeat(${deck.length === 36 ? 6 : 4}, minmax(2.5rem, 1fr))`;
      deck.forEach((card, index) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--ghost'; button.dataset.memoryCard = String(index); button.textContent = '•'; button.setAttribute('aria-label', say('Hidden card')); button.setAttribute('aria-pressed', 'false'); board.append(button); });
      status('');
    };
    root.addEventListener('click', (event) => {
      if (event.target.closest('[data-memory-start]')) { start(); return; }
      if (event.target.closest('[data-memory-reset]')) { reset(true); return; }
      const button = event.target.closest('[data-memory-card]');
      if (!button || !active || open.length >= 2) return;
      const cardIndex = Number(button.dataset.memoryCard); if (matched.has(cardIndex) || open.includes(cardIndex)) return;
      open.push(cardIndex); button.textContent = deck[cardIndex].symbol; button.setAttribute('aria-label', say('Card {number}', { number: cardIndex + 1 })); button.setAttribute('aria-pressed', 'true');
      if (open.length !== 2) return;
      moves += 1; movesOutput.textContent = String(moves);
      if (deck[open[0]].pair === deck[open[1]].pair) {
        open.forEach((i) => { matched.add(i); board.children[i].disabled = true; board.children[i].setAttribute('aria-label', `${say('Matched pair')}: ${deck[i].symbol}`); }); open = []; status('Matched pair', 'success');
      } else {
        const misses = [...open]; status('Try again'); mismatchTimeout = setTimeout(() => { if (!active) return; misses.forEach((i) => { const cardButton = board.children[i]; cardButton.textContent = '•'; cardButton.setAttribute('aria-label', say('Hidden card')); cardButton.setAttribute('aria-pressed', 'false'); }); open = []; mismatchTimeout = 0; }, 700);
      }
      if (matched.size === deck.length) { renderTime(); const time = timeOutput.textContent; stop(); status('You matched all {pairs} pairs in {moves} moves and {time}.', 'success', { pairs: deck.length / 2, moves, time }); }
    });
    window.addEventListener('pagehide', stop, { once: true });
    return;
  }

  if (root.dataset.opEngine === 'kana-practice') {
    let round = []; let missed = []; let index = 0; let score = 0; let answered = false;
    const section = $('[data-kana-round]', root);
    const reviewButton = $('[data-kana-review]', root);
    const render = () => {
      const item = round[index]; answered = false; section.hidden = !item;
      if (!item) return;
      $('[data-kana-progress]', root).textContent = say('Question {current} of {total}', { current: index + 1, total: round.length });
      $('[data-kana-symbol]', root).textContent = item.symbol;
      $('[data-kana-feedback]', root).textContent = '';
      const choices = $('[data-kana-choices]', root); choices.replaceChildren();
      kanaChoices(item.answer).forEach((choice) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--ghost'; button.textContent = choice; button.dataset.kanaCorrect = String(choice === item.answer); choices.append(button);
      });
      $('[data-kana-next]', root).hidden = true;
    };
    const begin = (items = null) => {
      const script = $('[data-kana-script]', root).value; const count = Number($('[data-kana-count]', root).value);
      round = items ?? makeKanaRound(script, count); missed = []; score = 0; index = 0; reviewButton.hidden = true; render(); status('');
    };
    root.addEventListener('click', (event) => {
      if (event.target.closest('[data-kana-start]')) { begin(); return; }
      const choice = event.target.closest('[data-kana-choices] button');
      if (choice && !answered) {
        answered = true; const item = round[index];
        if (choice.dataset.kanaCorrect === 'true') { score += 1; $('[data-kana-feedback]', root).textContent = say('Correct!'); }
        else { missed.push(item); $('[data-kana-feedback]', root).textContent = say('Not quite. The answer is {answer}.', { answer: item.answer }); }
        $('[data-kana-choices]', root).querySelectorAll('button').forEach((button) => { button.disabled = true; });
        const next = $('[data-kana-next]', root); next.textContent = say(index === round.length - 1 ? 'Finish round' : 'Next'); next.hidden = false;
      }
      if (event.target.closest('[data-kana-next]') && answered) {
        index += 1;
        if (index >= round.length) { const total = round.length; section.hidden = true; status('Round complete: {score} of {total} correct.', 'success', { score, total }); reviewButton.hidden = missed.length === 0; }
        else render();
      }
      if (event.target.closest('[data-kana-review]') && missed.length) { const review = [...missed]; begin(review); }
    });
  }
}
