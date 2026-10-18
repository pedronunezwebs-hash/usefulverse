import { createCodebreakerGame, dailyCodebreakerSeed, submitCodebreakerGuess } from './codebreaker.mjs';

const root = document.querySelector('[data-codebreaker-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const q = (selector) => root.querySelector(selector);
  const symbols = ['●', '■', '▲', '◆', '★', '⬟', '+', '×', '○', '◇'];
  const colors = ['#D64545', '#2878C7', '#32865A', '#E2B52B', '#8054B8', '#E47A26', '#20A9A8', '#D84B8A', '#805B3C', '#737B83'];
  const inkFor = (hex) => {
    const channels = hex.slice(1).match(/.{2}/gu).map((part) => parseInt(part, 16) / 255)
      .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 > 0.42 ? '#111' : '#fff';
  };
  let game = null;
  let currentSymbols = [];
  let daily = false;
  const date = new Date().toISOString().slice(0, 10);
  q('[data-codebreaker-date]').textContent = date;
  const difficultySettings = {
    relaxed: { length: 4, paletteSize: 6, duplicates: false, maxAttempts: 12 },
    standard: { length: 4, paletteSize: 6, duplicates: true, maxAttempts: 10 },
    challenge: { length: 5, paletteSize: 8, duplicates: true, maxAttempts: 7 },
  };

  function applyDifficulty() {
    const preset = difficultySettings[q('#codebreaker-difficulty').value];
    q('#codebreaker-length').value = String(preset.length);
    q('#codebreaker-symbol-count').value = String(preset.paletteSize);
    q('#codebreaker-duplicates').checked = preset.duplicates;
  }

  function setPalette(size) {
    const legend = q('[data-codebreaker-legend]');
    legend.replaceChildren();
    for (let index = 0; index < size; index += 1) {
      const row = document.createElement('tr');
      const symbol = document.createElement('td'); symbol.textContent = symbols[index];
      const color = document.createElement('td');
      const swatch = document.createElement('span'); swatch.className = 'codebreaker-swatch'; swatch.style.setProperty('--codebreaker-color', colors[index]); swatch.setAttribute('aria-hidden', 'true');
      color.append(swatch, document.createTextNode(f.colorNames[index]));
      row.append(symbol, color); legend.append(row);
    }
  }

  function buildGuessControls() {
    const length = Number(q('#codebreaker-length').value);
    const paletteSize = Number(q('#codebreaker-symbol-count').value);
    currentSymbols = Array(length).fill(0);
    const board = q('[data-codebreaker-current]'); board.replaceChildren();
    for (let position = 0; position < length; position += 1) {
      const label = document.createElement('label'); label.className = 'field';
      label.append(document.createTextNode(f.slot.replace('{number}', String(position + 1))));
      const select = document.createElement('select'); select.setAttribute('aria-label', f.selectSymbol.replace('{number}', String(position + 1)));
      for (let index = 0; index < paletteSize; index += 1) {
        const option = document.createElement('option'); option.value = String(index); option.textContent = `${symbols[index]} · ${f.colorNames[index]}`; select.append(option);
      }
      select.addEventListener('change', () => { currentSymbols[position] = Number(select.value); });
      label.append(select); board.append(label);
    }
    setPalette(paletteSize);
  }

  function renderHistory() {
    const list = q('[data-codebreaker-history]'); list.replaceChildren();
    if (!game.guesses.length) {
      const item = document.createElement('li'); item.textContent = f.historyEmpty; list.append(item);
    }
    game.guesses.forEach((guess, index) => {
      const item = document.createElement('li'); item.className = 'codebreaker-history-row';
      const code = document.createElement('span'); code.className = 'codebreaker-guess-symbols';
      guess.code.forEach((symbolIndex) => {
        const peg = document.createElement('span'); peg.textContent = symbols[symbolIndex]; peg.style.setProperty('--codebreaker-color', colors[symbolIndex]); peg.style.color = inkFor(colors[symbolIndex]);
        peg.setAttribute('aria-label', f.colorNames[symbolIndex]); code.append(peg);
      });
      const clue = document.createElement('span'); clue.textContent = f.feedback.replace('{exact}', String(guess.exact)).replace('{misplaced}', String(guess.misplaced));
      const turn = document.createElement('span'); turn.textContent = `${index + 1}`;
      item.append(turn, code, clue); list.append(item);
    });
    q('[data-codebreaker-attempts]').textContent = `${f.attempts}: ${Math.max(0, game.maxAttempts - game.guesses.length)} ${f.of} ${game.maxAttempts}`;
  }

  function startGame() {
    daily = q('#codebreaker-mode').value === 'daily';
    const settings = daily ? { length: 4, paletteSize: 6, duplicates: true, maxAttempts: 10, seed: dailyCodebreakerSeed(date) } : {
      length: Number(q('#codebreaker-length').value),
      paletteSize: Number(q('#codebreaker-symbol-count').value),
      duplicates: q('#codebreaker-duplicates').checked,
      maxAttempts: difficultySettings[q('#codebreaker-difficulty').value].maxAttempts,
      seed: crypto.getRandomValues(new Uint32Array(1))[0],
    };
    try { game = createCodebreakerGame(settings); }
    catch { q('[data-codebreaker-status]').textContent = f.invalidSetup; return; }
    q('[data-codebreaker-setup]').hidden = daily;
    q('[data-codebreaker-config]').hidden = daily;
    q('[data-codebreaker-setup]').disabled = true;
    q('[data-codebreaker-date-line]').hidden = !daily;
    q('[data-codebreaker-controls]').hidden = false;
    q('[data-codebreaker-status]').textContent = f.playing;
    buildGuessControls(); renderHistory();
    q('[data-codebreaker-guess]').disabled = false;
  }

  function submitGuess() {
    if (!game || game.status !== 'playing') return;
    try { game = submitCodebreakerGuess(game, currentSymbols); }
    catch { q('[data-codebreaker-status]').textContent = f.repeatError; return; }
    renderHistory();
    if (game.status === 'won') {
      const revealed = game.secret.map((index) => `${symbols[index]} ${f.colorNames[index]}`).join(', ');
      q('[data-codebreaker-status]').textContent = `${f.won} ${f.solvedCode.replace('{code}', revealed)}`;
      q('[data-codebreaker-guess]').disabled = true;
    } else if (game.status === 'lost') {
      q('[data-codebreaker-status]').textContent = f.lost.replace('{code}', game.secret.map((index) => `${symbols[index]} ${f.colorNames[index]}`).join(', '));
      q('[data-codebreaker-guess]').disabled = true;
    } else q('[data-codebreaker-status]').textContent = f.submitted;
  }

  q('#codebreaker-mode').addEventListener('change', () => {
    game = null;
    const isDaily = q('#codebreaker-mode').value === 'daily';
    q('[data-codebreaker-setup]').hidden = isDaily;
    q('[data-codebreaker-config]').hidden = isDaily;
    q('[data-codebreaker-setup]').disabled = isDaily;
    q('[data-codebreaker-controls]').hidden = true;
    q('[data-codebreaker-status]').textContent = f.ready;
    q('[data-codebreaker-guess]').disabled = true;
  });
  q('#codebreaker-length').addEventListener('change', buildGuessControls);
  q('#codebreaker-symbol-count').addEventListener('change', buildGuessControls);
  q('#codebreaker-difficulty').addEventListener('change', applyDifficulty);
  applyDifficulty();
  q('[data-codebreaker-start]').addEventListener('click', startGame);
  q('[data-codebreaker-guess]').addEventListener('click', submitGuess);
  q('[data-codebreaker-clear]').addEventListener('click', () => {
    currentSymbols.fill(0);
    q('[data-codebreaker-current]').querySelectorAll('select').forEach((select) => { select.value = '0'; });
  });
}
