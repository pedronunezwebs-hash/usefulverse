import { createHangmanGame, getHangmanVisibleWord, guessHangmanLetter } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="hangman-game"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('[data-guess-form]');
  const input = root.querySelector('[data-letter]');
  const difficulty = root.querySelector('[data-difficulty]');
  const word = root.querySelector('[data-word]');
  const used = root.querySelector('[data-used]');
  const progress = root.querySelector('[data-progress]');
  const drawing = [...root.querySelectorAll('[data-part]')];
  const attemptLabel = root.querySelector('[data-attempt-label]');
  let game;
  let previousWord = '';

  function newRound({ announceReady = true } = {}) {
    const bank = copy.wordBank.filter((item) => item !== previousWord);
    game = createHangmanGame({ wordBank: bank.length ? bank : copy.wordBank, difficulty: difficulty.value });
    previousWord = game.word;
    input.value = '';
    announce(root, announceReady ? copy.messages.ready : '');
    render();
    input.focus();
  }

  function render() {
    const visible = getHangmanVisibleWord(game);
    word.replaceChildren();
    for (const character of visible) {
      const cell = document.createElement('span');
      cell.className = 'hangman-game__letter';
      cell.textContent = character;
      cell.setAttribute('aria-hidden', 'true');
      word.append(cell);
    }
    word.setAttribute('aria-label', `${copy.fields.word}: ${visible.join(' ')}`);
    used.textContent = game.guessed.length ? `${copy.fields.used}: ${game.guessed.join(', ')}` : `${copy.fields.used}: —`;
    const remaining = game.maxAttempts - game.wrong;
    attemptLabel.textContent = `${copy.fields.attempts}: ${game.wrong} · ${copy.fields.remaining}: ${remaining}`;
    progress.textContent = game.status === 'won' ? copy.messages.won : game.status === 'lost' ? copy.messages.lost : attemptLabel.textContent;
    for (const part of drawing) part.hidden = game.wrong < Number(part.dataset.part);
    const finished = game.status !== 'playing';
    input.disabled = finished;
    form.querySelector('[data-action="guess"]').disabled = finished;
    root.querySelector('[data-action="hint"]').disabled = finished || !visible.includes('＿');
    root.querySelector('[data-action="restart"]').disabled = !finished;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = guessHangmanLetter(game, input.value);
    input.value = '';
    if (!result.accepted) {
      announce(root, result.reason === 'duplicate' ? copy.messages.duplicate : result.reason === 'finished' ? copy.messages.finished : copy.messages.invalid, 'info');
      input.focus();
      return;
    }
    game = result.game;
    render();
    announce(root, game.status === 'won' ? copy.messages.won : game.status === 'lost' ? copy.messages.lost : result.hit ? copy.messages.correct : copy.messages.wrong, game.status === 'won' ? 'success' : 'info');
  });

  root.querySelector('[data-action="hint"]').addEventListener('click', () => {
    const hidden = getHangmanVisibleWord(game).filter((character) => character === '＿');
    if (!hidden.length) { announce(root, copy.messages.noHint, 'info'); return; }
    const candidates = [...new Set(game.letters.filter((letter) => /[\p{L}\p{N}]/u.test(letter) && !game.guessed.some((usedLetter) => usedLetter.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase() === letter.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase())))];
    if (!candidates.length) { announce(root, copy.messages.noHint, 'info'); return; }
    const result = guessHangmanLetter(game, candidates[Math.floor(Math.random() * candidates.length)]);
    game = result.game;
    render();
    announce(root, game.status === 'won' ? copy.messages.won : copy.messages.hint, game.status === 'won' ? 'success' : 'info');
  });
  root.querySelector('[data-action="new-word"]').addEventListener('click', () => newRound());
  root.querySelector('[data-action="restart"]').addEventListener('click', () => newRound());
  difficulty.addEventListener('change', () => newRound());
  newRound({ announceReady: false });
}
