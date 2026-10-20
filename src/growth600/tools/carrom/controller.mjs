import { advanceCarromGame, CARROM_BOARD, createCarromGame, shootCarrom } from './logic.mjs';

export function mountCarrom() {
  const form = document.querySelector('#tool-form.carrom');
  if (!form) return;
  let copy = {};
  try { copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'); } catch { return; }
  const fields = copy.fields ?? {};
  const canvas = form.querySelector('canvas');
  const context = canvas.getContext('2d');
  const status = form.querySelector('[data-carrom-status]');
  const score = form.querySelector('[data-carrom-score]');
  const aim = form.elements.namedItem('aim');
  const power = form.elements.namedItem('power');
  let game = createCarromGame();
  let lastFrame = 0;
  const setStatus = (key) => { status.textContent = fields[key] ?? fields.ready; };
  const draw = () => {
    const size = CARROM_BOARD.size;
    context.clearRect(0, 0, size, size);
    context.fillStyle = '#b97b42'; context.fillRect(0, 0, size, size);
    context.fillStyle = '#f0d39a'; context.fillRect(36, 36, size - 72, size - 72);
    context.strokeStyle = '#5b3822'; context.lineWidth = 5; context.strokeRect(70, 70, size - 140, size - 140);
    context.beginPath(); context.arc(300, 300, 82, 0, Math.PI * 2); context.stroke();
    for (const x of [80, 520]) for (const y of [80, 520]) { context.beginPath(); context.fillStyle = '#24180f'; context.arc(x, y, CARROM_BOARD.pocketRadius, 0, Math.PI * 2); context.fill(); }
    context.strokeStyle = '#875a3a'; context.lineWidth = 2;
    for (const y of [100, 500]) { context.beginPath(); context.moveTo(230, y); context.lineTo(370, y); context.stroke(); context.beginPath(); context.arc(300, y, 42, 0, Math.PI * 2); context.stroke(); }
    for (const coin of game.coins) {
      context.beginPath(); context.fillStyle = coin.kind === 'queen' ? '#c63439' : coin.owner === 'one' ? '#f7f2e8' : '#292521';
      context.arc(coin.x, coin.y, CARROM_BOARD.coinRadius, 0, Math.PI * 2); context.fill();
      context.strokeStyle = '#553c2a'; context.lineWidth = 1; context.stroke();
    }
    if (game.striker) { context.beginPath(); context.fillStyle = '#4287c7'; context.arc(game.striker.x, game.striker.y, CARROM_BOARD.strikerRadius, 0, Math.PI * 2); context.fill(); context.stroke(); }
    else if (!game.winner) { context.beginPath(); context.fillStyle = '#4287c7'; context.arc(300, game.turn === 'one' ? 500 : 100, CARROM_BOARD.strikerRadius, 0, Math.PI * 2); context.fill(); context.stroke(); }
    score.textContent = `${fields.playerOne}: ${game.score.one} · ${fields.playerTwo}: ${game.score.two}`;
    form.querySelector('[data-carrom-turn]').textContent = game.winner ? fields.gameOver : `${fields.turn}: ${game.turn === 'one' ? fields.playerOne : fields.playerTwo}`;
  };
  const loop = (now) => {
    if (!game.shot) return;
    const dt = lastFrame ? (now - lastFrame) / 1000 : 0;
    lastFrame = now;
    advanceCarromGame(game, dt);
    draw();
    if (game.shot) requestAnimationFrame(loop);
    else { setStatus(game.last); form.querySelector('[data-carrom-shoot]').disabled = Boolean(game.winner); }
  };
  form.addEventListener('submit', (event) => event.preventDefault());
  form.querySelector('[data-carrom-shoot]').addEventListener('click', () => {
    try { if (shootCarrom(game, aim.value, power.value)) { lastFrame = 0; form.querySelector('[data-carrom-shoot]').disabled = true; setStatus('moving'); requestAnimationFrame(loop); } }
    catch { setStatus('invalid'); }
  });
  form.querySelector('[data-carrom-reset]').addEventListener('click', () => { game = createCarromGame(); draw(); setStatus('ready'); form.querySelector('[data-carrom-shoot]').disabled = false; });
  form.querySelector('[data-carrom-aim-value]').textContent = `${aim.value}°`;
  form.querySelector('[data-carrom-power-value]').textContent = power.value;
  aim.addEventListener('input', () => { form.querySelector('[data-carrom-aim-value]').textContent = `${aim.value}°`; });
  power.addEventListener('input', () => { form.querySelector('[data-carrom-power-value]').textContent = power.value; });
  draw(); setStatus('ready');
}

mountCarrom();
