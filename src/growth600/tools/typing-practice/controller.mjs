import { evaluateTyping, getTypingPrompt, validateCustomPrompt } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="typing-practice"]');
if (root) {
  const copy = readToolCopy(root);
  const mode = root.querySelector('[data-mode]');
  const promptOutput = root.querySelector('[data-prompt]');
  const typingInput = root.querySelector('[data-typing-input]');
  const customInput = root.querySelector('[data-custom-text]');
  const progress = root.querySelector('[data-progress]');
  const progressLabel = root.querySelector('[data-progress-label]');
  let promptIndex = 0;
  let activePrompt = '';
  let customMode = false;
  let completed = false;

  function setPrompt(value) {
    activePrompt = value;
    completed = false;
    promptOutput.textContent = activePrompt;
    typingInput.value = '';
    progress.value = 0;
    progressLabel.textContent = '0 / ' + [...activePrompt].length;
    announce(root, copy.messages.lessonReady, 'info');
    typingInput.focus();
  }

  function nextLesson() {
    customMode = false;
    promptIndex += 1;
    try {
      setPrompt(getTypingPrompt(mode.value, promptIndex));
    } catch {
      announce(root, copy.messages.invalidMode, 'error');
    }
  }

  function updateProgress() {
    const result = evaluateTyping(activePrompt, typingInput.value);
    progress.value = result.total ? Math.floor((result.correct / result.total) * 100) : 0;
    progressLabel.textContent = result.correct + ' / ' + result.total + ' · ' + result.accuracy + '%';
    const status = copy.messages.inputProgress
      .replace('{correct}', String(result.correct))
      .replace('{total}', String(result.total))
      .replace('{accuracy}', String(result.accuracy));
    if (result.complete && !completed) {
      completed = true;
      announce(root, copy.messages.lessonComplete.replace('{accuracy}', String(result.accuracy)), 'success');
    } else if (result.typed > 0 && result.typed % 10 === 0) {
      announce(root, status, 'info');
    }
  }

  root.querySelector('[data-action="new-lesson"]')?.addEventListener('click', nextLesson);
  root.querySelector('[data-action="start-over"]')?.addEventListener('click', () => setPrompt(activePrompt));
  mode.addEventListener('change', () => { promptIndex = 0; customMode = false; setPrompt(getTypingPrompt(mode.value)); });
  typingInput.addEventListener('input', updateProgress);
  root.querySelector('[data-action="apply-custom-text"]')?.addEventListener('click', () => {
    const result = validateCustomPrompt(customInput.value);
    if (!result.ok) {
      const message = result.reason === 'too-long' ? copy.messages.customTextTooLong : copy.messages.customTextEmpty;
      announce(root, message, 'error');
      return;
    }
    customMode = true;
    setPrompt(result.prompt);
    announce(root, copy.messages.customTextLoaded, 'success');
  });
  root.querySelector('[data-action="clear-custom-text"]')?.addEventListener('click', () => {
    customInput.value = '';
    if (customMode) { customMode = false; setPrompt(getTypingPrompt(mode.value)); }
  });
  setPrompt(getTypingPrompt(mode.value));
}
