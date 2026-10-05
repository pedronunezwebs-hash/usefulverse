const bundle = window.usefulverseLocale ?? { messages: {}, runtime: {} };
const lang = document.documentElement.lang || 'en';
const localeTag = bundle.tag ?? ({ en: 'en-US', es: 'es-ES', fr: 'fr-FR', 'pt-BR': 'pt-BR', de: 'de-DE' }[lang] ?? lang);
const englishStatusMessages = {
  'status.typingReady': 'Type to start the test.', 'status.working': 'Working…', 'status.done': 'Done.',
  'status.inputError': 'Check your input and try again.', 'status.timeUp': 'Time is up.', 'status.timerPaused': 'Timer paused.',
  'status.focusSession': 'Focus session', 'status.breakSession': 'Break', 'status.focusComplete': 'Focus session complete.',
  'status.breakComplete': 'Break complete.', 'status.copied': 'Copied.', 'status.emptyCopy': 'There is nothing to copy yet.',
  'status.copyFailed': 'Copy failed. Select and copy the result manually.', 'status.shiftLimit': 'You have reached the 14-shift limit.',
  'status.textRequired': 'Generate the text before downloading it.', 'status.downloadReady': 'Download ready.',
  'status.imageFileType': 'Choose a JPG, PNG, or WebP image up to 10 MB.',
  'status.imageReady': 'Image ready. Drag to crop or edit the coordinates.', 'status.imageOpenError': 'Could not open this image.',
  'status.imageRequired': 'Choose an image first.', 'status.choosePdf': 'Choose a PDF to begin.',
  'status.pdfProgress': 'Converting PDF pages…', 'status.pdfError': 'Could not convert the PDF. It may be password-protected or damaged.',
  'status.sqlLocal': 'SQL is processed in your browser.', 'status.sqlError': 'Could not format the SQL.',
  'status.needName': 'Add at least one name.', 'status.timerRunning': 'Timer is running.',
  'status.durationRequired': 'Enter a duration greater than zero.', 'status.ready': 'Ready.',
};
const t = (key) => bundle.runtime?.[key] ?? bundle.messages?.[key] ?? englishStatusMessages[key] ?? key;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const version = new URL(import.meta.url).searchParams.get('v');
const versioned = (path) => `${path}${version ? `?v=${encodeURIComponent(version)}` : ''}`;
const logic = await import(versioned('./new-tool-logic.mjs'));
const timerLogic = await import(versioned('./timer-logic.mjs'));
const objectUrls = new Set();
window.addEventListener('pagehide', () => objectUrls.forEach((url) => URL.revokeObjectURL(url)), { once: true });

function status(root, message, type = '') {
  const output = $('#tool-status', root);
  if (!output) return;
  const statusKey = `status.${message}`;
  const localizedStatus = t(statusKey);
  output.textContent = localizedStatus === statusKey ? t(message) : localizedStatus;
  output.className = `tool-status${type ? ` is-${type}` : ''}`;
}
function number(value) {
  const normalized = String(value).normalize('NFKC')
    .replace(/[०-९]/gu, (digit) => String(digit.codePointAt(0) - 0x966))
    .replace(/[০-৯]/gu, (digit) => String(digit.codePointAt(0) - 0x09e6))
    .replace(/[٠-٩]/gu, (digit) => String(digit.codePointAt(0) - 0x660))
    .replace(/[۰-۹]/gu, (digit) => String(digit.codePointAt(0) - 0x6f0))
    .replace(/\u066b/gu, '.').replace(/\u066c/gu, '').replace(/\s/gu, '').replace(',', '.');
  return normalized === '' ? NaN : Number(normalized);
}
function format(value, digits = 2) { return new Intl.NumberFormat(localeTag, { maximumFractionDigits: digits }).format(value); }
function formatMoney(value, currency) {
  try { return new Intl.NumberFormat(localeTag, { style: 'currency', currency }).format(value); }
  catch { return `${currency} ${format(value)}`; }
}
async function copy(value, root) {
  if (!value) return status(root, 'emptyCopy', 'error');
  try { await navigator.clipboard.writeText(value); status(root, 'copied', 'success'); }
  catch { status(root, 'copyFailed', 'error'); }
}
function download(blob, name, container = null) {
  const url = URL.createObjectURL(blob); objectUrls.add(url);
  const link = document.createElement('a'); link.href = url; link.download = name;
  if (container) { container.replaceChildren(link); link.className = 'button button--ghost file-download'; link.textContent = `${t('Download')} ${name}`; }
  else { link.style.display = 'none'; document.body.append(link); link.click(); link.remove(); setTimeout(() => { URL.revokeObjectURL(url); objectUrls.delete(url); }, 1000); }
}
function friendlyError(_error, fallback = 'inputError') { return fallback; }

function setupTyping(root) {
  const input = $('#typing-input', root); const prompt = $('#typing-prompt', root); const duration = $('#typing-duration', root);
  let startedAt = 0; let timer = 0; let finished = false;
  const renderMetrics = (elapsed) => {
    const stats = logic.typingMetrics(prompt.textContent, input.value, Math.max(1000, elapsed));
    $('#typing-wpm', root).textContent = format(stats.wpm, 1);
    $('#typing-accuracy', root).textContent = `${format(stats.accuracy, 1)}%`;
    $('#typing-correct', root).textContent = format(stats.correctCharacters);
  };
  const stop = () => { clearInterval(timer); timer = 0; };
  const reset = (focus = false) => { stop(); startedAt = 0; finished = false; input.value = ''; input.disabled = false; $('#typing-time', root).textContent = duration.value; $('#typing-wpm', root).textContent = '0'; $('#typing-accuracy', root).textContent = '100%'; status(root, 'typingReady'); if (focus) input.focus(); };
  duration.addEventListener('change', reset);
  input.addEventListener('input', () => {
    if (finished) return;
    if (!startedAt) { startedAt = performance.now(); status(root, 'working'); timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt; const left = Math.max(0, Number(duration.value) * 1000 - elapsed);
      $('#typing-time', root).textContent = String(Math.ceil(left / 1000)); renderMetrics(elapsed);
      if (!left) { finished = true; input.disabled = true; stop(); status(root, 'timeUp', 'success'); }
    }, 100); }
    renderMetrics(Math.max(1, performance.now() - startedAt));
  });
  root.addEventListener('click', (event) => { if (event.target.closest('[data-action="restart-typing"]')) reset(true); });
}

function setupFractions(root) {
  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-action="calculate-fraction"]')) return;
    try {
      const result = logic.calculateFraction($('#fraction-a', root).value, $('#fraction-b', root).value, $('#fraction-operation', root).value);
      $('#fraction-result', root).textContent = result.fraction;
      $('#fraction-mixed', root).textContent = result.mixed;
      $('#fraction-decimal', root).textContent = Number.isFinite(result.decimal) ? new Intl.NumberFormat(localeTag, { maximumFractionDigits: 12 }).format(result.decimal) : '—';
      status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
}

function setupTimeCard(root) {
  const rows = $('#timecard-shifts', root); const template = $('#timecard-row-template', root);
  const refreshNames = () => $$('.timecard-row', rows).forEach((row, index) => {
    row.querySelector('legend').textContent = `${t('Shift')} ${index + 1}`;
    row.querySelector('[data-action="remove-shift"]').disabled = rows.children.length === 1;
    for (const [field, key] of [['[data-shift-start]', 'start'], ['[data-shift-end]', 'end'], ['[data-shift-break]', 'break']]) {
      const input = row.querySelector(field);
      input.id = `timecard-shift-${index + 1}-${key}`;
      input.name = `shifts[${index}][${key}]`;
    }
  });
  const calculate = () => {
    try {
      const totals = logic.calculateTimeCard($$('.timecard-row', rows).map((row) => ({ start: $('[data-shift-start]', row).value, end: $('[data-shift-end]', row).value, breakMinutes: number($('[data-shift-break]', row).value || '0') })));
      const hours = totals.minutes / 60; const rateInput = $('#timecard-rate', root).value;
      const rate = rateInput ? number(rateInput) : NaN;
      if (rateInput && (!Number.isFinite(rate) || rate < 0)) throw new RangeError('Enter a valid hourly rate or leave it blank.');
      $('#timecard-hours', root).textContent = format(hours);
      $('#timecard-breaks', root).textContent = `${format(totals.breakMinutes)} min`;
      $('#timecard-pay-result', root).textContent = Number.isFinite(rate) ? formatMoney(hours * rate, $('#timecard-currency', root).value) : '—';
      status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  };
  root.addEventListener('click', (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'add-shift') {
      if (rows.children.length >= 14) return status(root, 'shiftLimit', 'error');
      rows.append(template.content.cloneNode(true)); refreshNames();
    }
    if (actionName === 'remove-shift') { if (rows.children.length > 1) event.target.closest('[data-shift-row]').remove(); refreshNames(); }
    if (actionName === 'calculate-timecard') calculate();
  });
  rows.addEventListener('change', calculate); $('#timecard-rate', root).addEventListener('input', calculate); $('#timecard-currency', root).addEventListener('change', calculate); refreshNames(); calculate();
}

function setupTimer(root) {
  const storageKey = 'usefulverse:pomodoro:v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch {}
  let settings = timerLogic.normalizePomodoroSettings(saved.settings);
  let mode = 'countdown'; let phase = 'focus'; let remaining = 300_000; let accumulated = 0;
  let deadline = 0; let stopwatchStarted = 0; let focusSegmentStartedAt = 0; let focusElapsedThisPhase = Number.isFinite(saved.focusElapsedThisPhase) && saved.focusElapsedThisPhase > 0 ? Math.min(180 * 60_000, saved.focusElapsedThisPhase) : 0; let ticker = 0; let running = false; let starting = false; let completed = Number.isInteger(saved.completed) && saved.completed > 0 ? saved.completed : 0;
  let focusMilliseconds = Number.isFinite(saved.focusMilliseconds) && saved.focusMilliseconds > 0 ? saved.focusMilliseconds : 0;
  let audioContext; let notificationRegistration; const originalTitle = document.title;
  if ('Notification' in window && Notification.permission === 'granted' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.showNotification) notificationRegistration = registration;
    }).catch(() => {});
  }
  const display = $('#timer-display', root);
  const audioNotice = $('#timer-audio-status', root);
  const showAudioUnavailable = () => {
    if (!audioNotice) return;
    audioNotice.textContent = t('Audio could not start. Check your browser audio settings.');
    audioNotice.hidden = false;
  };
  const clearAudioNotice = () => { if (audioNotice) { audioNotice.hidden = true; audioNotice.textContent = ''; } };
  const resumeAudio = async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    try {
      audioContext ??= new AudioContextClass();
      if (audioContext.state === 'suspended') await audioContext.resume();
      return audioContext.state === 'running';
    } catch { return false; }
  };
  const persist = () => { try { localStorage.setItem(storageKey, JSON.stringify({ settings, completed, focusMilliseconds, focusElapsedThisPhase })); } catch {} };
  const getDuration = (selectedMode = mode, selectedPhase = phase) => {
    if (selectedMode === 'pomodoro') {
      const minutes = selectedPhase === 'focus' ? settings.focusMinutes : selectedPhase === 'long-break' ? settings.longBreakMinutes : settings.shortBreakMinutes;
      return minutes * 60_000;
    }
    return (number($('#timer-minutes', root).value) * 60 + number($('#timer-seconds', root).value)) * 1000;
  };
  const phaseLabel = () => {
    if (mode !== 'pomodoro') return t(mode === 'stopwatch' ? 'Stopwatch' : 'Countdown');
    return t(phase === 'focus' ? 'status.focusSession' : phase === 'long-break' ? 'Long break' : 'Short break');
  };
  const showStats = () => {
    $('#timer-stats', root).hidden = mode !== 'pomodoro';
    $('#timer-completed', root).textContent = String(completed);
    const liveFocus = running && mode === 'pomodoro' && phase === 'focus' ? Math.max(0, performance.now() - focusSegmentStartedAt) : 0;
    $('#timer-focus-time', root).textContent = `${new Intl.NumberFormat(localeTag, { maximumFractionDigits: 1 }).format((focusMilliseconds + focusElapsedThisPhase + liveFocus) / 60_000)} min`;
  };
  const render = () => {
    let value;
    if (mode === 'stopwatch') value = accumulated + (running ? performance.now() - stopwatchStarted : 0);
    else value = running ? timerLogic.remainingUntil(deadline, performance.now()) : remaining;
    display.textContent = logic.formatTimer(value);
    $('#timer-phase', root).textContent = phaseLabel();
    const timerTitle = running && mode !== 'stopwatch' ? `(${logic.formatTimer(value)}) ${originalTitle}` : originalTitle;
    if (document.title !== timerTitle) document.title = timerTitle;
    const skipButton = $('[data-action="timer-skip"]', root);
    if (skipButton) skipButton.hidden = mode !== 'pomodoro';
    ['focus-minutes', 'break-minutes', 'long-break-minutes', 'long-break-every'].forEach((id) => { $(`#${id}`, root).disabled = running; });
    showStats();
  };
  const playAlert = async ({ preview = false } = {}) => {
    if ((!preview && !settings.sound) || settings.volume <= 0) return 'muted';
    if (!await resumeAudio()) return 'unavailable';
    try {
      for (let index = 0; index < 3; index += 1) {
        const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = index === 1 ? 880 : 660;
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime + index * 0.22);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, settings.volume / 100 * 0.18), audioContext.currentTime + index * 0.22 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + index * 0.22 + 0.18);
        oscillator.connect(gain); gain.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime + index * 0.22); oscillator.stop(audioContext.currentTime + index * 0.22 + 0.19);
      }
      return 'played';
    } catch { return 'unavailable'; }
  };
  const notify = async (title, body) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      const options = { body, icon: '/favicon.ico', tag: 'usefulverse-timer', data: { url: location.pathname } };
      if (notificationRegistration?.showNotification) await notificationRegistration.showNotification(title, options);
      else new Notification(title, options);
    } catch {}
  };
  const stopTicker = () => { clearInterval(ticker); ticker = 0; };
  const pause = () => {
    if (!running) return;
    const now = performance.now();
    if (mode === 'stopwatch') accumulated += performance.now() - stopwatchStarted;
    else {
      remaining = timerLogic.remainingUntil(deadline, now);
      if (mode === 'pomodoro' && phase === 'focus') {
        focusElapsedThisPhase = Math.min(getDuration('pomodoro', 'focus'), focusElapsedThisPhase + Math.max(0, now - focusSegmentStartedAt));
      }
    }
    running = false; focusSegmentStartedAt = 0; stopTicker(); persist(); render();
  };
  const completePhase = async () => {
    if (!running || mode === 'stopwatch') return;
    const now = performance.now();
    if (mode === 'pomodoro' && phase === 'focus') {
      focusElapsedThisPhase = Math.min(getDuration('pomodoro', 'focus'), focusElapsedThisPhase + Math.max(0, now - focusSegmentStartedAt));
      focusMilliseconds += focusElapsedThisPhase;
      focusElapsedThisPhase = 0;
    }
    running = false; stopTicker(); remaining = 0;
    focusSegmentStartedAt = 0;
    const finishedMode = mode; const finishedPhase = phase;
    void playAlert().then((result) => { if (result === 'unavailable') showAudioUnavailable(); });
    const title = t('Pomodoro');
    const message = finishedMode === 'pomodoro' ? t(finishedPhase === 'focus' ? 'status.focusComplete' : 'status.breakComplete') : t('status.timeUp');
    void notify(title, message);
    if (finishedMode === 'pomodoro') {
      if (finishedPhase === 'focus') {
        completed += 1;
        phase = timerLogic.nextPomodoroPhase('focus', completed, settings.longBreakEvery);
      } else { phase = 'focus'; focusElapsedThisPhase = 0; }
      remaining = getDuration('pomodoro', phase); persist();
      status(root, finishedPhase === 'focus' ? 'focusComplete' : 'breakComplete', 'success');
      if (settings.autoStart) { running = true; deadline = performance.now() + remaining; focusSegmentStartedAt = phase === 'focus' ? performance.now() : 0; ticker = window.setInterval(tick, 250); }
    } else status(root, 'timeUp', 'success');
    render();
  };
  const tick = () => {
    if (mode !== 'stopwatch' && timerLogic.remainingUntil(deadline, performance.now()) <= 0) { completePhase(); return; }
    render();
  };
  const reset = (announce = true) => {
    pause(); running = false; stopTicker(); focusMilliseconds += focusElapsedThisPhase; focusElapsedThisPhase = 0; focusSegmentStartedAt = 0; phase = 'focus'; accumulated = 0; remaining = getDuration(); persist(); render();
    if (announce) status(root, 'ready');
  };
  const start = async () => {
    if (running || starting) return;
    if (mode !== 'stopwatch' && remaining <= 0) remaining = getDuration();
    if (mode !== 'stopwatch' && (!Number.isFinite(remaining) || remaining <= 0)) return status(root, 'durationRequired', 'error');
    starting = true;
    if (settings.sound && settings.volume > 0 && !await resumeAudio()) showAudioUnavailable();
    running = true;
    if (mode === 'stopwatch') stopwatchStarted = performance.now();
    else {
      deadline = performance.now() + remaining;
      if (mode === 'pomodoro' && phase === 'focus') focusSegmentStartedAt = performance.now();
    }
    starting = false;
    stopTicker(); ticker = window.setInterval(tick, 250); status(root, 'timerRunning'); render();
  };
  const applySettings = () => {
    settings = timerLogic.normalizePomodoroSettings({
      focusMinutes: number($('#focus-minutes', root).value), shortBreakMinutes: number($('#break-minutes', root).value),
      longBreakMinutes: number($('#long-break-minutes', root).value), longBreakEvery: number($('#long-break-every', root).value),
      autoStart: $('#timer-auto-start', root).checked, sound: $('#timer-sound', root).checked, volume: number($('#timer-volume', root).value),
    });
    $('#focus-minutes', root).value = String(settings.focusMinutes); $('#break-minutes', root).value = String(settings.shortBreakMinutes);
    $('#long-break-minutes', root).value = String(settings.longBreakMinutes); $('#long-break-every', root).value = String(settings.longBreakEvery);
    $('#timer-auto-start', root).checked = settings.autoStart; $('#timer-sound', root).checked = settings.sound; $('#timer-volume', root).value = String(settings.volume);
    persist(); if (!running && mode === 'pomodoro') { remaining = getDuration(); render(); }
  };
  $('#focus-minutes', root).value = String(settings.focusMinutes); $('#break-minutes', root).value = String(settings.shortBreakMinutes);
  $('#long-break-minutes', root).value = String(settings.longBreakMinutes); $('#long-break-every', root).value = String(settings.longBreakEvery);
  $('#timer-auto-start', root).checked = settings.autoStart; $('#timer-sound', root).checked = settings.sound; $('#timer-volume', root).value = String(settings.volume);
  $('#timer-options', root).hidden = true; $('#timer-settings', root).hidden = false; $('#pomodoro-settings', root).hidden = true;
  root.addEventListener('click', async (event) => {
    const modeButton = event.target.closest('[data-timer-mode]');
    if (modeButton) {
      pause(); mode = modeButton.dataset.timerMode;
      $$('.timer-modes [data-timer-mode]', root).forEach((button) => { button.classList.toggle('is-active', button === modeButton); button.setAttribute('aria-pressed', String(button === modeButton)); });
      $('#timer-settings', root).hidden = mode === 'stopwatch' || mode === 'pomodoro';
      $('#pomodoro-settings', root).hidden = mode !== 'pomodoro'; $('#timer-options', root).hidden = mode !== 'pomodoro'; reset();
    }
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'timer-start') await start();
    if (actionName === 'timer-pause') { pause(); status(root, 'timerPaused'); }
    if (actionName === 'timer-reset') reset();
    if (actionName === 'timer-skip' && mode === 'pomodoro') {
      pause(); phase = phase === 'focus' ? 'short-break' : 'focus'; focusElapsedThisPhase = 0;
      remaining = getDuration(); render(); status(root, 'ready');
    }
    if (actionName === 'timer-test-sound') {
      const result = await playAlert({ preview: true });
      if (result === 'unavailable') showAudioUnavailable();
      else clearAudioNotice();
      status(root, 'ready');
    }
    if (actionName === 'timer-enable-notifications') {
      if (!('Notification' in window)) return status(root, 'Notifications are not available in this browser.', 'error');
      let permission;
      try { permission = await Notification.requestPermission(); }
      catch { return status(root, 'Notifications are not available in this browser.', 'error'); }
      if (permission === 'granted' && 'serviceWorker' in navigator) {
        try { notificationRegistration = await navigator.serviceWorker.register('/timer-notifications.js'); } catch {}
      }
      status(root, permission === 'granted' ? 'Notifications enabled.' : permission === 'denied' ? 'Notifications are blocked. Change this site\'s permission in browser settings.' : 'ready', permission === 'granted' ? 'success' : permission === 'denied' ? 'error' : '');
    }
    if (actionName === 'timer-clear-data') {
      pause(); settings = timerLogic.normalizePomodoroSettings(); completed = 0; focusMilliseconds = 0; focusElapsedThisPhase = 0;
      $('#focus-minutes', root).value = String(settings.focusMinutes); $('#break-minutes', root).value = String(settings.shortBreakMinutes);
      $('#long-break-minutes', root).value = String(settings.longBreakMinutes); $('#long-break-every', root).value = String(settings.longBreakEvery);
      $('#timer-auto-start', root).checked = settings.autoStart; $('#timer-sound', root).checked = settings.sound; $('#timer-volume', root).value = String(settings.volume);
      reset(false);
      try { localStorage.removeItem(storageKey); } catch {}
      render(); status(root, 'ready');
    }
  });
  ['focus-minutes', 'break-minutes', 'long-break-minutes', 'long-break-every', 'timer-auto-start', 'timer-sound', 'timer-volume'].forEach((id) => $(`#${id}`, root).addEventListener('change', applySettings));
  const syncCountdownInputs = () => {
    if (running || mode !== 'countdown') return;
    const minutes = number($('#timer-minutes', root).value); const seconds = number($('#timer-seconds', root).value);
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 999 || !Number.isInteger(seconds) || seconds < 0 || seconds > 59) return;
    remaining = (minutes * 60 + seconds) * 1000; render();
  };
  $('#timer-minutes', root).addEventListener('input', syncCountdownInputs);
  $('#timer-minutes', root).addEventListener('change', syncCountdownInputs);
  $('#timer-seconds', root).addEventListener('input', syncCountdownInputs);
  $('#timer-seconds', root).addEventListener('change', syncCountdownInputs);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  window.addEventListener('pagehide', () => { pause(); try { audioContext?.close(); } catch {} }, { once: true });
  remaining = getDuration(); render();
}

function setupLorem(root) {
  const output = $('#lorem-output', root); const mode = $('#lorem-mode', root); const amount = $('#lorem-amount', root);
  const updateLimit = () => { amount.max = ({ paragraphs: 50, sentences: 200, words: 5000 })[mode.value]; amount.value = String(Math.min(Number(amount.value), Number(amount.max))); };
  mode.addEventListener('change', updateLimit);
  root.addEventListener('click', async (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'generate-lorem') { try { output.value = logic.generateLorem(mode.value, number(amount.value)); status(root, 'done', 'success'); } catch (error) { status(root, friendlyError(error), 'error'); } }
    if (actionName === 'copy-lorem') await copy(output.value, root);
    if (actionName === 'download-lorem') { if (!output.value) return status(root, 'textRequired', 'error'); download(new Blob([output.value], { type: 'text/plain;charset=utf-8' }), 'lorem-ipsum.txt'); status(root, 'downloadReady', 'success'); }
  });
}

function setupSubnet(root) {
  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-action="calculate-subnet"]')) return;
    try {
      const result = logic.calculateSubnet($('#subnet-input', root).value);
      for (const [key, value] of Object.entries({ network: result.network, mask: result.mask, wildcard: result.wildcard, broadcast: result.broadcast, first: result.firstHost, last: result.lastHost, total: format(result.totalAddresses, 0), hosts: format(result.usableHosts, 0) })) $(`#subnet-${key}`, root).textContent = value;
      status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
  root.querySelector('[data-action="calculate-subnet"]').click();
}

function secureIndex(max) {
  if (!globalThis.crypto?.getRandomValues || !Number.isInteger(max) || max < 1 || max > 0xffffffff) throw new Error('Secure random selection is not available in this browser.');
  const range = 0x100000000; const limit = range - (range % max); const values = new Uint32Array(1); let value;
  do { crypto.getRandomValues(values); value = values[0]; } while (value >= limit);
  return value % max;
}
function setupNamePicker(root) {
  root.addEventListener('click', (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'clear-picker') { $('#picker-names', root).value = ''; $('#picker-winners', root).replaceChildren(); $('#amidakuji-result', root)?.setAttribute('hidden', ''); $('#amidakuji-status', root)?.replaceChildren(); status(root, 'needName'); return; }
    if (actionName === 'amidakuji-picker') {
      const feedback = $('#amidakuji-status', root); const resultPanel = $('#amidakuji-result', root); const svg = $('#amidakuji-svg', root);
      try {
        const names = $('#picker-names', root).value.split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
        const draw = logic.createAmidakujiDraw(names, secureIndex);
        const width = 640; const height = 380; const left = 50; const right = width - left; const top = 60; const bottom = height - 50;
        const gap = (right - left) / (names.length - 1); const rowGap = (bottom - top) / (draw.rows.length + 1);
        svg.replaceChildren(); svg.setAttribute('viewBox', `0 0 ${width} ${height}`); svg.setAttribute('aria-label', `あみだくじ。${names.length}人から選ばれたのは${names[draw.winnerIndex]}です。`);
        const addLine = (x1, y1, x2, y2) => { const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); for (const [key, value] of Object.entries({ x1, y1, x2, y2, stroke: '#17191f', 'stroke-width': 3, 'stroke-linecap': 'round' })) line.setAttribute(key, String(value)); svg.append(line); };
        const addLabel = (text, x, y, full = text) => { const label = document.createElementNS('http://www.w3.org/2000/svg', 'text'); label.setAttribute('x', String(x)); label.setAttribute('y', String(y)); label.setAttribute('text-anchor', 'middle'); label.setAttribute('font-size', '12'); label.setAttribute('fill', '#17191f'); label.textContent = full.length > 10 ? `${full.slice(0, 9)}…` : text; svg.append(label); };
        names.forEach((name, column) => { const x = left + gap * column; addLabel(name, x, 28, name); addLine(x, top, x, bottom); });
        draw.rows.forEach((bars, row) => bars.forEach((connected, column) => { if (connected) { const y = top + rowGap * (row + 1); addLine(left + gap * column, y, left + gap * (column + 1), y); } }));
        names.forEach((_, column) => addLabel(column === draw.target ? '当たり' : 'はずれ', left + gap * column, height - 14));
        $('#amidakuji-winner', root).textContent = `当たり：${names[draw.winnerIndex]}`;
        resultPanel.hidden = false; feedback.textContent = 'あみだくじを作成しました。下の結果を確認してください。';
      } catch (error) {
        resultPanel.hidden = true;
        feedback.textContent = error instanceof RangeError ? '名前を2〜8人分入力してください。各名前は80文字以内です。' : '抽選を作成できませんでした。入力を確認して、もう一度お試しください。';
      }
      return;
    }
    if (actionName !== 'pick-names') return;
    try {
      const entries = $('#picker-names', root).value.split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
      if (!entries.length) throw new TypeError('Add at least one name.');
      const count = number($('#picker-count', root).value); const noRepeat = $('#picker-no-repeat', root).checked;
      if (!Number.isInteger(count) || count < 1 || count > 100 || (noRepeat && count > entries.length)) throw new RangeError('Choose a valid number of picks for the list.');
      const winners = [];
      if (noRepeat) { const pool = [...entries]; for (let i = 0; i < count; i += 1) winners.push(pool.splice(secureIndex(pool.length), 1)[0]); }
      else for (let i = 0; i < count; i += 1) winners.push(entries[secureIndex(entries.length)]);
      const list = $('#picker-winners', root); list.replaceChildren(...winners.map((name) => { const item = document.createElement('li'); item.textContent = name; return item; })); status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
}

function setupFuel(root) {
  const system = $('#fuel-units', root); const updateLabel = () => {
    const metric = system.value === 'metric';
    $('#fuel-efficiency-label', root).firstChild.textContent = t(metric ? 'Efficiency (L/100 km)' : 'Efficiency (MPG)');
    $('#fuel-price-label', root).firstChild.textContent = t(metric ? 'Fuel price per liter' : 'Fuel price per gallon');
  };
  system.addEventListener('change', updateLabel);
  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-action="calculate-fuel"]')) return;
    try {
      const result = logic.calculateFuelCost({ distance: number($('#fuel-distance', root).value), efficiency: number($('#fuel-efficiency', root).value), price: number($('#fuel-price', root).value), passengers: number($('#fuel-passengers', root).value), system: system.value, roundTrip: $('#fuel-round-trip', root).checked });
      $('#fuel-used', root).textContent = `${format(result.fuel)} ${result.fuelUnit}`;
      $('#fuel-cost', root).textContent = formatMoney(result.cost, $('#fuel-currency', root).value);
      $('#fuel-share', root).textContent = formatMoney(result.perPassenger, $('#fuel-currency', root).value);
      status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
  updateLabel();
}

function setupCropper(root) {
  const fileInput = $('#crop-file', root); const canvas = $('#crop-canvas', root); const ctx = canvas.getContext('2d'); const fileList = $('#crop-downloads', root);
  const fields = { x: $('#crop-x', root), y: $('#crop-y', root), width: $('#crop-width', root), height: $('#crop-height', root) };
  let bitmap = null; let drag = null; let selection = { x: 0, y: 0, width: 0, height: 0 }; let scale = 1; let currentUrl = '';
  const maxSize = 10 * 1024 * 1024; const setSelection = (next) => {
    if (!bitmap) return;
    const xValue = Number.isFinite(next.x) ? Math.round(next.x) : selection.x; const yValue = Number.isFinite(next.y) ? Math.round(next.y) : selection.y;
    const widthValue = Number.isFinite(next.width) ? Math.round(next.width) : selection.width; const heightValue = Number.isFinite(next.height) ? Math.round(next.height) : selection.height;
    const x = Math.max(0, Math.min(bitmap.width - 1, xValue)); const y = Math.max(0, Math.min(bitmap.height - 1, yValue));
    selection = { x, y, width: Math.max(1, Math.min(bitmap.width - x, widthValue)), height: Math.max(1, Math.min(bitmap.height - y, heightValue)) };
    for (const key of Object.keys(fields)) fields[key].value = String(selection[key]); draw();
  };
  const draw = () => {
    if (!bitmap) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const x = selection.x * scale; const y = selection.y * scale; const width = selection.width * scale; const height = selection.height * scale;
    ctx.save(); ctx.fillStyle = 'rgb(0 0 0 / 42%)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.clearRect(x, y, width, height); ctx.drawImage(bitmap, selection.x, selection.y, selection.width, selection.height, x, y, width, height); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(2, 2 / scale); ctx.setLineDash([7, 4]); ctx.strokeRect(x, y, width, height); ctx.restore();
  };
  const updateRatio = () => {
    if (!bitmap) return;
    const ratio = $('#crop-ratio', root).value;
    if (ratio === 'free') return;
    const [w, h] = ratio.split(':').map(Number); const target = w / h;
    let width = selection.width; let height = selection.height;
    if (width / height > target) width = height * target; else height = width / target;
    setSelection({ x: selection.x + (selection.width - width) / 2, y: selection.y + (selection.height - height) / 2, width, height });
  };
  fileInput.addEventListener('change', async () => {
    bitmap?.close?.(); bitmap = null; fileList.replaceChildren();
    const file = fileInput.files[0]; if (!file) return;
    if (file.size > maxSize || !/^image\/(?:jpeg|png|webp)$/u.test(file.type)) { status(root, 'imageFileType', 'error'); fileInput.value = ''; return; }
    try {
      if (typeof createImageBitmap === 'function') bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      else {
        if (currentUrl) { URL.revokeObjectURL(currentUrl); objectUrls.delete(currentUrl); }
        currentUrl = URL.createObjectURL(file); objectUrls.add(currentUrl);
        bitmap = await new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = currentUrl; });
      }
      if (bitmap.width * bitmap.height > 12_000_000) { bitmap.close?.(); bitmap = null; throw new RangeError('Choose an image with 12 megapixels or fewer.'); }
      scale = Math.min(1, 1400 / bitmap.width, 900 / bitmap.height); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      let width = bitmap.width; let height = bitmap.height;
      if ($('#crop-ratio', root).value !== 'free') { const [w, h] = $('#crop-ratio', root).value.split(':').map(Number); const target = w / h; if (width / height > target) width = height * target; else height = width / target; }
      selection = { x: Math.round((bitmap.width - width) / 2), y: Math.round((bitmap.height - height) / 2), width: Math.round(width), height: Math.round(height) };
      setSelection(selection); status(root, 'imageReady', 'success');
    } catch (error) { status(root, friendlyError(error, 'imageOpenError'), 'error'); }
  });
  $('#crop-ratio', root).addEventListener('change', updateRatio);
  for (const [key, input] of Object.entries(fields)) input.addEventListener('change', () => setSelection({ ...selection, [key]: number(input.value) }));
  const point = (event) => { const rect = canvas.getBoundingClientRect(); return { x: Math.max(0, Math.min(bitmap.width, (event.clientX - rect.left) * bitmap.width / rect.width)), y: Math.max(0, Math.min(bitmap.height, (event.clientY - rect.top) * bitmap.height / rect.height)) }; };
  canvas.addEventListener('pointerdown', (event) => { if (!bitmap) return; drag = point(event); canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const current = point(event); let width = Math.abs(current.x - drag.x); let height = Math.abs(current.y - drag.y);
    const ratio = $('#crop-ratio', root).value;
    if (ratio !== 'free') {
      const [ratioWidth, ratioHeight] = ratio.split(':').map(Number); const target = ratioWidth / ratioHeight;
      if (width / Math.max(height, 1) > target) width = height * target; else height = width / target;
    }
    const x = current.x < drag.x ? drag.x - width : drag.x; const y = current.y < drag.y ? drag.y - height : drag.y;
    setSelection({ x, y, width, height });
  });
  canvas.addEventListener('pointerup', () => { drag = null; });
  canvas.addEventListener('pointercancel', () => { drag = null; });
  root.addEventListener('click', async (event) => {
    if (!event.target.closest('[data-action="crop-download"]')) return;
    try {
      if (!bitmap) return status(root, 'imageRequired', 'error');
      if (selection.width * selection.height > 12_000_000) throw new RangeError('The crop is too large. Reduce it to 12 megapixels or fewer.');
      const output = document.createElement('canvas'); output.width = selection.width; output.height = selection.height;
      const outputContext = output.getContext('2d'); if (!outputContext) throw new Error('Canvas is unavailable.');
      outputContext.drawImage(bitmap, selection.x, selection.y, selection.width, selection.height, 0, 0, output.width, output.height);
      const type = $('#crop-format', root).value;
      const blob = await new Promise((resolve, reject) => output.toBlob((result) => result ? resolve(result) : reject(new Error('The cropped image could not be created.')), type, 0.9));
      const extension = type === 'image/jpeg' ? 'jpg' : type === 'image/webp' ? 'webp' : 'png'; download(blob, `usefulverse-crop.${extension}`, fileList); output.width = 1; output.height = 1; status(root, 'downloadReady', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
}

let pdfModulePromise;
function loadPdfJs() {
  pdfModulePromise ??= import(versioned('/assets/vendor/pdf.min.mjs')).then((pdfjs) => { pdfjs.GlobalWorkerOptions.workerSrc = versioned('/assets/vendor/pdf.worker.min.mjs'); return pdfjs; });
  return pdfModulePromise;
}
async function readPdf(file) {
  if (!file || file.size > 10 * 1024 * 1024) throw new RangeError('PDF must be 10 MB or smaller.');
  const header = new TextDecoder('latin1').decode(await file.slice(0, 1024).arrayBuffer());
  if (!header.includes('%PDF-')) throw new TypeError('Choose a valid PDF file.');
  return new Uint8Array(await file.arrayBuffer());
}
function setupPdfImages(root) {
  const fileInput = $('#pdf-image-file', root); const downloads = $('#pdf-image-downloads', root); let operation = 0;
  root.addEventListener('click', async (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'clear-pdf-images') { operation += 1; fileInput.value = ''; $('#pdf-page-range', root).value = 'all'; downloads.replaceChildren(); status(root, 'choosePdf'); return; }
    if (actionName !== 'convert-pdf-images') return;
    const current = ++operation; downloads.replaceChildren(); const button = event.target.closest('[data-action]'); button.disabled = true;
    let loadingTask; let pdf;
    try {
      const file = fileInput.files[0]; if (!file) return status(root, 'choosePdf', 'error');
      const bytes = await readPdf(file); const pdfjs = await loadPdfJs();
      loadingTask = pdfjs.getDocument({ data: bytes }); pdf = await loadingTask.promise;
      const pages = logic.parsePdfPageRanges($('#pdf-page-range', root).value, pdf.numPages);
      const format = $('#pdf-image-format', root).value; const scaleLimit = Number($('#pdf-image-scale', root).value); const imageType = format === 'image/jpeg' ? 'jpg' : 'png';
      const files = []; let totalPixels = 0; let totalBytes = 0; const maxTotalPixels = 12_000_000; const maxZipBytes = 30 * 1024 * 1024;
      for (const pageNumber of pages) {
        if (current !== operation) return;
        const page = await pdf.getPage(pageNumber); const unit = page.getViewport({ scale: 1 });
        const available = maxTotalPixels - totalPixels; const actualScale = Math.min(scaleLimit, Math.sqrt(available / (unit.width * unit.height)));
        if (!Number.isFinite(actualScale) || actualScale < 0.2) throw new RangeError('This PDF is too large to render safely in one batch. Select fewer pages.');
        const viewport = page.getViewport({ scale: actualScale }); const pixels = Math.ceil(viewport.width) * Math.ceil(viewport.height); totalPixels += pixels;
        const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d', { alpha: format === 'image/png' }); if (!context) throw new Error('Canvas is unavailable.');
        if (format === 'image/jpeg') { context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); }
        status(root, 'pdfProgress');
        await page.render({ canvasContext: context, viewport, ...(format === 'image/jpeg' ? { background: '#ffffff' } : {}) }).promise;
        const blob = await new Promise((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('An image page could not be created.')), format, format === 'image/jpeg' ? 0.9 : undefined));
        if (totalBytes + blob.size > maxZipBytes) throw new RangeError('The selected pages are too large for one download. Choose fewer pages or use JPG.');
        totalBytes += blob.size;
        files.push({ name: `page-${String(pageNumber).padStart(3, '0')}.${imageType}`, data: new Uint8Array(await blob.arrayBuffer()) });
        canvas.width = 1; canvas.height = 1; page.cleanup();
      }
      if (current !== operation) return;
      const zip = logic.createZip(files); download(zip, 'pdf-pages.zip', downloads); status(root, 'downloadReady', 'success');
    } catch (error) { if (current === operation) status(root, friendlyError(error, 'pdfError'), 'error'); }
    finally { try { await pdf?.destroy(); } catch {} try { await loadingTask?.destroy(); } catch {} if (current === operation) button.disabled = false; }
  });
}

function setupSql(root) {
  const input = $('#sql-input', root); const output = $('#sql-output', root);
  root.addEventListener('click', async (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'format-sql') { try { output.value = logic.formatSql(input.value, $('#sql-uppercase', root).checked); status(root, 'done', 'success'); } catch (error) { output.value = ''; status(root, friendlyError(error, 'sqlError'), 'error'); } }
    if (actionName === 'copy-sql') await copy(output.value, root);
    if (actionName === 'clear-sql') { input.value = ''; output.value = ''; status(root, 'sqlLocal'); input.focus(); }
  });
}

const setups = {
  'typing-speed-test': setupTyping, 'fraction-calculator': setupFractions, 'time-card-calculator': setupTimeCard,
  'online-timer': setupTimer, 'lorem-ipsum-generator': setupLorem, 'subnet-calculator': setupSubnet,
  'random-name-picker': setupNamePicker, 'fuel-cost-calculator': setupFuel, 'image-cropper': setupCropper,
  'pdf-to-image': setupPdfImages, 'sql-formatter': setupSql,
};
export function setupNewTool(id, root) { setups[id]?.(root); }
