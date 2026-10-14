import { createRebusSession, getCurrentRebus, nextRebusPuzzle, requestRebusHint, resetRebusSession, revealRebusAnswer, submitRebusAnswer } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="rebus-puzzles"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('[data-rebus-answer-form]');
  const input = root.querySelector('[data-answer]');
  const board = root.querySelector('[data-rebus-board]');
  const hint = root.querySelector('[data-hint]');
  const explanation = root.querySelector('[data-explanation]');
  let session = createRebusSession();
  let finished = false;

  function render() {
    const puzzle = getCurrentRebus(session);
    root.querySelector('[data-puzzle-index]').textContent = String(session.index + 1);
    root.querySelector('[data-puzzle-total]').textContent = String(session.order.length);
    root.querySelector('[data-score]').textContent = String(session.correct);
    root.querySelector('[data-attempts]').textContent = String(session.attempts);
    board.replaceChildren();
    if (puzzle) for (const rowText of puzzle.rows) {
      const row = document.createElement('span');
      row.className = 'rebus-row';
      row.textContent = rowText;
      board.append(row);
    }
    board.setAttribute('aria-label', puzzle?.rows.join(' / ') ?? copy.name);
    const hasAnswer = puzzle && (puzzle.solved || puzzle.revealed);
    hint.hidden = !puzzle?.hint;
    root.querySelector('[data-hint-text]').textContent = puzzle?.hint ?? '';
    explanation.hidden = !puzzle?.explanation;
    root.querySelector('[data-explanation-text]').textContent = puzzle?.explanation ?? '';
    input.disabled = !puzzle || hasAnswer || finished;
    root.querySelector('[data-action="check"]').disabled = !puzzle || hasAnswer || finished;
    root.querySelector('[data-action="hint"]').disabled = !puzzle || hasAnswer || finished || puzzle.hintsAvailable === 0;
    root.querySelector('[data-action="reveal"]').disabled = !puzzle || hasAnswer || finished;
    root.querySelector('[data-action="next"]').disabled = !puzzle || (!puzzle.solved && !puzzle.revealed) || finished;
    if (finished) {
      board.replaceChildren();
      board.textContent = copy.messages.completed;
      form.hidden = true;
    } else form.hidden = false;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input.value.trim()) { announce(root, copy.messages.answerRequired, 'info'); input.focus(); return; }
    const result = submitRebusAnswer(session, input.value);
    if (result.ignored) return;
    session = result.session;
    render();
    announce(root, result.correct ? copy.messages.correct : copy.messages.incorrect, result.correct ? 'success' : 'info');
  });
  root.querySelector('[data-action="hint"]').addEventListener('click', () => {
    const next = requestRebusHint(session);
    if (next === session) { announce(root, copy.messages.hintUnavailable, 'info'); return; }
    session = next; render();
  });
  root.querySelector('[data-action="reveal"]').addEventListener('click', () => {
    session = revealRebusAnswer(session); render(); announce(root, copy.messages.answerRevealed, 'info');
  });
  root.querySelector('[data-action="next"]').addEventListener('click', () => {
    const next = nextRebusPuzzle(session);
    if (!next) { finished = true; render(); announce(root, copy.messages.completed, 'success'); return; }
    session = next; input.value = ''; render(); announce(root, ''); input.focus();
  });
  root.querySelector('[data-action="restart"]').addEventListener('click', () => {
    session = resetRebusSession(); finished = false; input.value = ''; render(); announce(root, ''); input.focus();
  });
  render();
}
