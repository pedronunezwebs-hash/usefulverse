import { createWordGame, dailyWordIndex, splitLetters, submitWordGuess, validateWordBank, wordBankFingerprint } from './five-letter-word.mjs';

const root = document.querySelector('[data-five-letter-game]');
if (root) {
  const q = (selector) => root.querySelector(selector);
  const toolCopy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const copy = toolCopy.fields ?? {};
  const bankSelect = q('[data-word-bank]');
  const importPanel = q('[data-word-import]');
  const bankStatus = q('[data-word-bank-status]');
  const guessInput = q('[data-word-guess]');
  q('#word-list').dir = 'auto';
  guessInput.dir = 'auto';
  const submitButton = q('[data-word-submit]');
  const board = q('[data-word-board]');
  const status = q('[data-word-status]');
  const storageKey = 'usefulverse-five-letter-word-bank-v1';
  const historyKey = 'usefulverse-five-letter-word-history-v1';
  let accepted = [];
  let targets = [];
  let game = null;
  let bankId = 'nb';
  let customLocale;
  let customBank = null;
  let practiceCounter = 0;
  let history = [];

  function readHistory() {
    try { const value = JSON.parse(localStorage.getItem(historyKey) ?? '[]'); return Array.isArray(value) ? value.slice(0, 12) : []; } catch { return []; }
  }
  function renderHistory() {
    const node = q('[data-word-history]');
    node.textContent = history.length ? `${copy.history} ${history.map(({ date, result }) => `${date}: ${result}`).join(' · ')}` : copy.history;
  }
  function saveResult() {
    if (!game || !['won', 'lost'].includes(game.status)) return;
    const day = game.playDate;
    const result = game.status === 'won' ? `${game.guesses.length}/6` : 'X/6';
    const entry = { date: day, result, bankId, mode: game.daily ? 'daily' : 'practice', time: Date.now() };
    history = [entry, ...history.filter((item) => game.daily ? item.date !== day || item.bankId !== bankId || item.mode !== 'daily' : item.time !== entry.time)].slice(0, 12);
    try { localStorage.setItem(historyKey, JSON.stringify(history)); } catch { /* history is optional */ }
    renderHistory();
  }
  function render() {
    board.replaceChildren();
    for (let row = 0; row < game?.maxGuesses; row += 1) {
      const guess = game.guesses[row];
      for (let col = 0; col < 5; col += 1) {
        const tile = document.createElement('span');
        tile.className = `five-letter-tile${guess ? ` is-${guess.marks[col]}` : ''}`;
        tile.textContent = guess ? splitLetters(guess.word, game.locale)[col] ?? '' : '';
        tile.setAttribute('aria-label', guess ? `${tile.textContent}: ${copy[guess.marks[col]]}` : '');
        board.append(tile);
      }
    }
    const active = game?.status === 'playing';
    guessInput.disabled = !active;
    submitButton.disabled = !active;
    q('[data-word-share]').disabled = !game || game.guesses.length === 0;
    if (game?.status === 'won') status.textContent = copy.won;
    else if (game?.status === 'lost') status.textContent = copy.lost.replace('{answer}', game.answer);
    else if (game) status.textContent = copy.guessesLeft.replace('{count}', String(game.maxGuesses - game.guesses.length));
  }
  async function loadBank() {
    const mode = bankSelect.value;
    importPanel.hidden = mode !== 'custom';
    game = null;
    board.replaceChildren();
    guessInput.value = '';
    q('[data-word-new]').disabled = true;
    if (!mode) {
      accepted = []; targets = []; bankStatus.textContent = '';
      status.textContent = copy.ready;
      return;
    }
    if (mode === 'custom') {
      bankId = 'custom';
      try {
        let stored = customBank;
        try { stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null') ?? customBank; } catch { /* session copy remains available */ }
        customLocale = stored?.locale || undefined;
        q('#word-list').lang = customLocale ?? document.documentElement.lang;
        accepted = validateWordBank(stored?.words ?? [], customLocale);
        targets = accepted;
        q('#word-language-name').value = String(stored?.languageName ?? '').slice(0, 40);
        q('#word-language-tag').value = String(stored?.locale ?? '').slice(0, 35);
        q('#word-list').value = accepted.join('\n');
        bankStatus.textContent = copy.listCount.replace('{count}', String(accepted.length));
        bankSelect.querySelector('option[value="custom"]').textContent = `${copy.own} — ${stored?.languageName || ''}`.trim();
        q('[data-word-new]').disabled = false;
      } catch {
        accepted = []; targets = [];
        bankStatus.textContent = copy.invalidBank;
        q('[data-word-new]').disabled = true;
      }
      return;
    }
    bankId = 'nb-bokmal-2026-05-21';
    status.textContent = copy.ready;
    try {
      const [acceptedResponse, targetResponse] = await Promise.all([
        fetch('/assets/five-letter-word-bank/nb-accepted.txt'), fetch('/assets/five-letter-word-bank/nb-targets.txt'),
      ]);
      if (!acceptedResponse.ok || !targetResponse.ok) throw new Error('Word bank unavailable.');
      [accepted, targets] = await Promise.all([acceptedResponse.text(), targetResponse.text()]).then(([a, t]) => [a.trim().split(/\r?\n/u), t.trim().split(/\r?\n/u)]);
      bankStatus.textContent = copy.listCount.replace('{count}', String(accepted.length));
      q('[data-word-new]').disabled = false;
    } catch {
      bankStatus.textContent = copy.invalidBank;
      status.textContent = copy.invalidBank;
    }
  }
  function startGame() {
    if (!accepted.length || !targets.length) return;
    const daily = q('[data-word-mode]').value === 'daily';
    const now = new Date();
    const index = daily ? dailyWordIndex(now, targets.length, bankId) : (Math.floor(Math.random() * targets.length) + practiceCounter++) % targets.length;
    const locale = bankSelect.value === 'nb' ? 'nb' : customLocale;
    game = { ...createWordGame({ answer: targets[index], acceptedWords: accepted, locale }), daily, playDate: now.toISOString().slice(0, 10), bankId };
    guessInput.lang = locale ?? document.documentElement.lang;
    guessInput.value = '';
    render();
    guessInput.focus();
  }
  q('#word-file').addEventListener('change', async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (file.size > 200000) { bankStatus.textContent = copy.invalidBank; return; }
    try { q('#word-list').value = await file.text(); }
    catch { bankStatus.textContent = copy.invalidBank; }
  });
  q('[data-word-save]').addEventListener('click', () => {
    try {
      const localeInput = q('#word-language-tag').value.trim();
      let locale;
      try { locale = localeInput ? Intl.getCanonicalLocales(localeInput)[0] : undefined; }
      catch { bankStatus.textContent = copy.languageTag; return; }
      const words = validateWordBank(q('#word-list').value.split(/[\s,;]+/u), locale);
      const languageName = q('#word-language-name').value.trim().slice(0, 40);
      if (!languageName) { bankStatus.textContent = copy.languageName; return; }
      accepted = [...words]; targets = [...words]; customLocale = locale; bankId = wordBankFingerprint(words);
      q('#word-list').lang = locale ?? document.documentElement.lang;
      customBank = { words, languageName, locale: locale ?? '', updatedAt: new Date().toISOString() };
      bankSelect.querySelector('option[value="custom"]').textContent = `${copy.own} — ${languageName}`;
      bankStatus.textContent = copy.listCount.replace('{count}', String(words.length));
      q('[data-word-new]').disabled = false;
      status.textContent = copy.ready;
      try { localStorage.setItem(storageKey, JSON.stringify(customBank)); }
      catch { bankStatus.textContent += ` ${copy.customBankNote}`; }
    } catch { bankStatus.textContent = copy.invalidBank; }
  });
  q('[data-word-clear]').addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); } catch { /* storage is optional */ }
    customBank = null;
    accepted = []; targets = []; game = null; bankStatus.textContent = copy.invalidBank;
    q('#word-language-name').value = '';
    q('#word-language-tag').value = '';
    q('#word-list').value = '';
    bankSelect.querySelector('option[value="custom"]').textContent = copy.own;
    q('[data-word-new]').disabled = true; render();
  });
  bankSelect.addEventListener('change', loadBank);
  q('[data-word-new]').addEventListener('click', startGame);
  q('[data-word-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    try { game = submitWordGuess(game, guessInput.value); guessInput.value = ''; render(); saveResult(); }
    catch { status.textContent = copy.invalidWord; guessInput.focus(); }
  });
  q('[data-word-share]').addEventListener('click', async () => {
    if (!game) return;
    const result = `${toolCopy.name} ${game.status === 'won' ? `${game.guesses.length}/6` : 'X/6'}\n${game.guesses.map(({ marks }) => marks.map((mark) => ({ correct: '🟩', present: '🟨', absent: '⬜' })[mark]).join('')).join('\n')}`;
    try { await navigator.clipboard.writeText(result); status.textContent = copy.copied; }
    catch { status.textContent = copy.copyFailed; }
  });
  q('[data-word-history-clear]').addEventListener('click', () => {
    history = [];
    try { localStorage.removeItem(historyKey); } catch { /* history is optional */ }
    renderHistory();
    status.textContent = copy.historyCleared;
  });
  history = readHistory();
  renderHistory();
  loadBank();
}
