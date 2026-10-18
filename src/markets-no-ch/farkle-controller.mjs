import { bankFarkle, createFarkleGame, holdFarkleDice, playFarkleCpuTurn, rollFarkle, scoreFarkleDice } from './farkle.mjs';

const root = document.querySelector('[data-farkle-game]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  let game = null; let selected = new Set(); let undoStack = [];
  let statusOverride = '';
  const humanTurn = () => game?.status === 'playing' && game.players[game.currentPlayer]?.cpu === false;
  const addSnapshot = () => { if ($('[data-farkle-mode]').value === 'practice' && game) { undoStack.push(game); if (undoStack.length > 30) undoStack.shift(); } };
  const showStatus = (value) => { statusOverride = value; $('[data-farkle-status]').textContent = value; };
  const pointText = (number) => new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 0 }).format(number);
  const rollCpuTurns = () => {
    let count = 0;
    while (game?.status === 'playing' && game.players[game.currentPlayer]?.cpu && count < game.players.length) { game = playFarkleCpuTurn(game); count += 1; }
  };
  const dieLabel = (index, value) => (selected.has(index) ? f.selectedDie : f.notSelectedDie).replace('{number}', index + 1).replace('{face}', value);
  const render = () => {
    const board = $('[data-farkle-board]');
    board.hidden = !game;
    if (!game) { $('[data-farkle-status]').textContent = statusOverride || f.ready; return; }
    const current = game.players[game.currentPlayer];
    $('[data-farkle-current]').textContent = current?.cpu ? current.name : f.player;
    $('[data-farkle-risk]').textContent = pointText(game.turnPoints);
    $('[data-farkle-dice-left]').textContent = f.diceLeft.replace('{count}', game.remainingDice);
    const scoreRows = $('[data-farkle-scores]'); scoreRows.replaceChildren();
    for (const player of game.players) {
      const row = document.createElement('tr');
      const name = document.createElement('th'); name.scope = 'row'; name.textContent = player.name + (player.id === game.currentPlayer ? ' · ' + (player.cpu ? f.cpuTurn.replace('{player}', player.name) : f.yourTurn) : '');
      const total = document.createElement('td'); total.textContent = pointText(player.total);
      const state = document.createElement('td'); state.textContent = player.opened ? f.entered : f.entryNeeded.replace('{entry}', pointText(game.entryScore));
      row.append(name, total, state); scoreRows.append(row);
    }
    const dice = $('[data-farkle-dice]'); dice.replaceChildren();
    game.dice.forEach((face, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = `farkle-die${selected.has(index) ? ' is-selected' : ''}`; button.textContent = String(face); button.setAttribute('aria-pressed', String(selected.has(index))); button.setAttribute('aria-label', dieLabel(index, face)); button.disabled = !humanTurn();
      button.addEventListener('click', () => { if (selected.has(index)) selected.delete(index); else selected.add(index); render(); }); dice.append(button);
    });
    const selectedDice = [...selected].map((index) => game.dice[index]);
    let selectionScore = null;
    try { if (selectedDice.length) selectionScore = scoreFarkleDice(selectedDice, game.scoringVariant); } catch {}
    const validSelection = Boolean(selectionScore?.score && selectionScore.scoringDice === selectedDice.length);
    $('[data-farkle-selection-score]').textContent = selectedDice.length ? `${f.pointsFor}: ${validSelection ? pointText(selectionScore.score) : '—'}` : '';
    $('[data-farkle-roll]').disabled = !humanTurn() || Boolean(game.dice.length);
    $('[data-farkle-hold]').disabled = !humanTurn() || !game.dice.length || !validSelection;
    const player = game.players[game.currentPlayer];
    const canBank = humanTurn() && !game.dice.length && game.turnPoints > 0 && (player.opened || player.total + game.turnPoints >= game.entryScore);
    $('[data-farkle-bank]').disabled = !canBank;
    $('[data-farkle-undo]').disabled = $('[data-farkle-mode]').value !== 'practice' || !undoStack.length;
    $('[data-farkle-start]').disabled = game.status === 'playing';
    $('[data-farkle-export]').disabled = game.scoreSheet.length === 0;
    const settingsLocked = Boolean(game?.status === 'playing');
    $('[data-farkle-mode]').disabled = settingsLocked;
    $('[data-farkle-opponents]').disabled = settingsLocked || $('[data-farkle-mode]').value === 'practice';
    for (const selector of ['[data-farkle-variant]', '[data-farkle-entry]', '[data-farkle-target]']) $(selector).disabled = settingsLocked;
    const table = game.scoringVariant === 'fixed' ? f.fixedRules : f.doublingRules;
    $('[data-farkle-active-rules]').textContent = table;
    if (game.status === 'won') showStatus(f.won.replace('{player}', game.players[game.winner]?.name ?? f.player).replace('{total}', pointText(game.players[game.winner]?.total ?? 0)));
    else if (statusOverride) $('[data-farkle-status]').textContent = statusOverride;
    else if (!humanTurn()) $('[data-farkle-status]').textContent = f.cpuTurn.replace('{player}', current.name);
    else if (game.lastOutcome === 'farkle') $('[data-farkle-status]').textContent = f.farkle.replace('{points}', pointText(game.scoreSheet.at(-1)?.points ?? 0));
    else if (game.lastOutcome === 'hotDice') $('[data-farkle-status]').textContent = f.hotDice;
    else if (game.dice.length) $('[data-farkle-status]').textContent = f.chooseDice;
    else if (!current.opened && current.total + game.turnPoints < game.entryScore) $('[data-farkle-status]').textContent = f.entryNeeded.replace('{entry}', pointText(game.entryScore));
    else if (game.turnPoints) $('[data-farkle-status]').textContent = f.entered;
    else $('[data-farkle-status]').textContent = f.ready;
    if (game.status === 'won') $('[data-farkle-winner]').textContent = f.won.replace('{player}', game.players[game.winner]?.name ?? f.player).replace('{total}', pointText(game.players[game.winner]?.total ?? 0));
    const sheet = $('[data-farkle-history]'); sheet.replaceChildren();
    for (const turn of game.scoreSheet.slice(-8).reverse()) {
      const item = document.createElement('li'); item.textContent = `${turn.player}: ${turn.outcome === 'farkle' ? f.farkle.replace('{points}', pointText(turn.points)) : f.banked.replace('{points}', pointText(turn.points)).replace('{total}', pointText(turn.total))}`; sheet.append(item);
    }
  };
  const start = () => {
    const practice = $('[data-farkle-mode]').value === 'practice';
    const cpuCount = practice ? 0 : Number($('[data-farkle-opponents]').value);
    const names = [f.you, ...Array.from({ length: cpuCount }, (_, index) => `${f.computer} ${index + 1}`)];
    game = createFarkleGame({ seed: crypto.getRandomValues(new Uint32Array(1))[0] || Date.now(), names, cpuPlayers: names.map((_, index) => index > 0), targetScore: Number($('[data-farkle-target]').value), entryScore: Number($('[data-farkle-entry]').value), scoringVariant: $('[data-farkle-variant]').value });
    undoStack = []; selected.clear(); statusOverride = ''; render();
  };
  const afterHumanAction = () => { selected.clear(); rollCpuTurns(); render(); };
  $('[data-farkle-start]').addEventListener('click', () => { try { start(); } catch { showStatus(f.invalidSettings); } });
  $('[data-farkle-roll]').addEventListener('click', () => {
    if (!humanTurn()) return;
    addSnapshot(); selected.clear();
    try { game = rollFarkle(game); statusOverride = game.lastOutcome === 'farkle' ? f.farkle.replace('{points}', pointText(game.scoreSheet.at(-1)?.points ?? 0)) : ''; afterHumanAction(); }
    catch { showStatus(f.rollFirst); }
  });
  $('[data-farkle-hold]').addEventListener('click', () => {
    if (!humanTurn()) return;
    addSnapshot();
    try { game = holdFarkleDice(game, [...selected]); selected.clear(); statusOverride = game.lastOutcome === 'hotDice' ? f.hotDice : ''; render(); }
    catch { showStatus(f.invalidSelection); }
  });
  $('[data-farkle-bank]').addEventListener('click', () => {
    if (!humanTurn()) return;
    addSnapshot();
    try { const points = game.turnPoints; game = bankFarkle(game); const player = game.players.find(({ id }) => id === (game.currentPlayer - 1 + game.players.length) % game.players.length); statusOverride = game.status === 'won' ? '' : f.banked.replace('{points}', pointText(points)).replace('{total}', pointText(player?.total ?? 0)); afterHumanAction(); }
    catch { showStatus(f.entryNeeded.replace('{entry}', pointText(game.entryScore))); }
  });
  $('[data-farkle-undo]').addEventListener('click', () => { if ($('[data-farkle-mode]').value !== 'practice' || !undoStack.length) return; game = undoStack.pop(); selected.clear(); statusOverride = ''; render(); });
  $('[data-farkle-export]').addEventListener('click', () => {
    if (!game?.scoreSheet.length) return;
    const rows = [[f.player, f.turnPoints, f.total], ...game.scoreSheet.map((turn) => [turn.player, turn.outcome === 'farkle' ? `-${turn.points}` : turn.points, turn.total]), ...game.players.map((player) => [player.name, '', player.total])];
    const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'farkle-score-sheet.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('[data-farkle-mode]').addEventListener('change', () => { $('[data-farkle-opponents]').disabled = $('[data-farkle-mode]').value === 'practice'; });
  $('[data-farkle-start]').disabled = false;
  for (const selector of ['[data-farkle-variant]', '[data-farkle-entry]', '[data-farkle-target]', '[data-farkle-mode]', '[data-farkle-opponents]']) $(selector).addEventListener('change', () => { statusOverride = ''; });
  $('[data-farkle-variant]').addEventListener('change', () => { $('[data-farkle-active-rules]').textContent = $('[data-farkle-variant]').value === 'fixed' ? f.fixedRules : f.doublingRules; });
  render();
}
