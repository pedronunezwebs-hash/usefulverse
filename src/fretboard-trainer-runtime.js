import { createFretboardQuestion, isCorrectNote, NOTE_NAMES } from './fretboard-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);

export function setupFretboardTrainer(root) {
  const workspace = $('[data-fretboard-trainer]', root);
  const prompt = $('[data-fretboard-prompt]', workspace);
  const answers = $('[data-fretboard-answers]', workspace);
  const status = $('[data-fretboard-status]', workspace);
  const scoreOutput = $('[data-fretboard-score]', workspace);
  const nextButton = $('[data-fretboard-next]', workspace);
  const resetButton = $('[data-fretboard-reset]', workspace);
  const messageSource = root.matches('[data-planner-messages]') ? root : root.querySelector('[data-planner-messages]');
  const messages = JSON.parse(messageSource?.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  let question;
  let correct = 0;
  let streak = 0;
  let answered = false;

  const updateScore = () => { scoreOutput.textContent = say('Correct: {correct} · streak: {streak}', { correct, streak }); };
  const startQuestion = () => {
    question = createFretboardQuestion(Math.random, question);
    answered = false;
    prompt.textContent = say('Which note is on string {string}, fret {fret}?', { string: question.string, fret: question.fret });
    status.textContent = say('Choose a note.');
    status.classList.remove('is-error', 'is-success');
    answers.querySelectorAll('button').forEach((button) => { button.disabled = false; button.setAttribute('aria-pressed', 'false'); });
    nextButton.disabled = true;
  };

  answers.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fretboard-note]');
    if (!button || answered) return;
    if (!isCorrectNote(question, button.dataset.fretboardNote)) {
      streak = 0;
      status.textContent = say('Not quite. Try another note.');
      status.classList.add('is-error');
      updateScore();
      return;
    }
    answered = true;
    correct += 1;
    streak += 1;
    status.textContent = say('Correct! The note is {note}.', { note: question.note });
    status.classList.remove('is-error');
    status.classList.add('is-success');
    button.setAttribute('aria-pressed', 'true');
    answers.querySelectorAll('button').forEach((item) => { item.disabled = true; });
    nextButton.disabled = false;
    updateScore();
  });

  nextButton.addEventListener('click', startQuestion);
  resetButton.addEventListener('click', () => { correct = 0; streak = 0; updateScore(); startQuestion(); });
  updateScore();
  startQuestion();
}

export { NOTE_NAMES };
