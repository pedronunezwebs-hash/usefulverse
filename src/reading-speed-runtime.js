import { countReadingWords, formatElapsed, readingWordsPerMinute } from './reading-speed-logic.mjs';

export function setupReadingSpeed(root) {
  let messages = {};
  try { messages = JSON.parse(root.dataset.readingMessages ?? '{}'); } catch { /* fall back to source labels */ }
  const say = (key) => messages[key] ?? key;
  const text = root.querySelector('[data-reading-text]');
  const timer = root.querySelector('[data-reading-elapsed]');
  const count = root.querySelector('[data-reading-count]');
  const status = root.querySelector('[data-reading-status]');
  const result = root.querySelector('[data-reading-result]');
  const pace = root.querySelector('[data-reading-pace]');
  const rating = root.querySelector('[data-reading-rating]');
  const startButton = root.querySelector('[data-reading-start]');
  const pauseButton = root.querySelector('[data-reading-pause]');
  const resumeButton = root.querySelector('[data-reading-resume]');
  const finishButton = root.querySelector('[data-reading-finish]');
  const resetButton = root.querySelector('[data-reading-reset]');
  let wordCount = 0;
  let elapsed = 0;
  let startedAt = 0;
  let interval = 0;
  let running = false;
  let finished = false;

  const announce = (key) => { status.textContent = say(key); };
  const updateClock = () => { timer.textContent = formatElapsed(elapsed + (running ? performance.now() - startedAt : 0)); };
  const updateCount = () => {
    wordCount = countReadingWords(text.value, document.documentElement.lang || 'en');
    count.textContent = say('Words: {count}').replace('{count}', new Intl.NumberFormat(document.documentElement.lang || 'en').format(wordCount));
    startButton.disabled = wordCount === 0 || wordCount > 10000 || running;
    if (finished) resetSession();
  };
  const resetSession = () => {
    clearInterval(interval); interval = 0; running = false; finished = false; elapsed = 0; startedAt = 0;
    timer.textContent = '0:00'; result.hidden = true; pace.textContent = '—'; rating.value = '';
    rating.disabled = true; text.readOnly = false;
    startButton.disabled = wordCount === 0 || wordCount > 10000; startButton.hidden = false;
    pauseButton.disabled = true; pauseButton.hidden = false;
    resumeButton.disabled = true; resumeButton.hidden = true;
    finishButton.disabled = true; resetButton.hidden = true;
  };
  const start = () => {
    if (wordCount < 1 || wordCount > 10000) { announce(wordCount > 10000 ? 'Use no more than 10,000 words.' : 'Add or paste some text first.'); return; }
    elapsed = 0; startedAt = performance.now(); running = true; finished = false; text.readOnly = true;
    startButton.hidden = true; pauseButton.hidden = false; pauseButton.disabled = false;
    resumeButton.hidden = true; finishButton.disabled = false; resetButton.hidden = true;
    result.hidden = true; rating.disabled = true; announce('Reading test started.'); updateClock();
    interval = window.setInterval(updateClock, 250);
  };
  text.addEventListener('input', updateCount);
  root.querySelector('[data-reading-sample-button]').addEventListener('click', () => {
    text.value = root.dataset.readingSample ?? ''; updateCount(); text.focus(); announce('Use the sample text');
  });
  startButton.addEventListener('click', start);
  pauseButton.addEventListener('click', () => {
    if (!running) return;
    elapsed += performance.now() - startedAt; running = false; clearInterval(interval); interval = 0;
    updateClock(); pauseButton.hidden = true; resumeButton.hidden = false; resumeButton.disabled = false;
    announce('Reading paused.');
  });
  resumeButton.addEventListener('click', () => {
    if (running || finished) return;
    startedAt = performance.now(); running = true; resumeButton.hidden = true; pauseButton.hidden = false; pauseButton.disabled = false;
    announce('Reading resumed.'); updateClock(); interval = window.setInterval(updateClock, 250);
  });
  finishButton.addEventListener('click', () => {
    const measuredElapsed = elapsed + (running ? performance.now() - startedAt : 0);
    if (measuredElapsed < 1000) { announce('Read for at least one second to see a result.'); return; }
    elapsed = measuredElapsed;
    running = false; finished = true; clearInterval(interval); interval = 0; updateClock();
    pace.textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(readingWordsPerMinute(wordCount, elapsed));
    result.hidden = false; rating.disabled = false; text.readOnly = true;
    startButton.hidden = true; pauseButton.hidden = true; resumeButton.hidden = true; finishButton.disabled = true; resetButton.hidden = false;
    announce('Reading finished. Rate your understanding if you want.');
  });
  resetButton.addEventListener('click', () => { resetSession(); startButton.hidden = false; announce('Reading test reset.'); text.focus(); });
  rating.addEventListener('change', () => {
    if (rating.value && finished) announce('Reading finished. Rate your understanding if you want.');
  });
  updateCount(); resetSession();
}
