import { advanceCrokinoleGame, CROKINOLE_BOARD, createCrokinoleGame, shootCrokinole } from './logic.mjs';

export function mountCrokinole() {
  const form = document.querySelector('#tool-form.crokinole');
  if (!form) return;
  let copy = {};
  try { copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'); } catch { return; }
  const fields = copy.fields ?? {};
  const canvas = form.querySelector('canvas'); const context = canvas.getContext('2d');
  const status = form.querySelector('[data-crokinole-status]'); const score = form.querySelector('[data-crokinole-score]');
  const angle = form.elements.namedItem('angle'); const power = form.elements.namedItem('power');
  let game = createCrokinoleGame(); let lastFrame = 0;
  const setStatus = (key) => { status.textContent = fields[key] ?? fields.ready; };
  const draw = () => {
    const center = CROKINOLE_BOARD.size / 2; const radius = CROKINOLE_BOARD.radius;
    context.clearRect(0, 0, 600, 600); context.fillStyle = '#324a3d'; context.fillRect(0, 0, 600, 600);
    context.beginPath(); context.arc(center, center, radius, 0, Math.PI * 2); context.fillStyle = '#e4cc9a'; context.fill(); context.strokeStyle = '#624b32'; context.lineWidth = 5; context.stroke();
    for (const [ring, color] of [[220, '#a64b32'], [150, '#d69d45'], [90, '#c5ab6f'], [30, '#a83a39']]) { context.beginPath(); context.arc(center, center, ring, 0, Math.PI * 2); context.strokeStyle = color; context.lineWidth = ring === 30 ? 3 : 2; context.stroke(); }
    for (let i = 0; i < 8; i += 1) { const a = i * Math.PI / 4; context.beginPath(); context.arc(center + Math.cos(a) * 185, center + Math.sin(a) * 185, 4, 0, Math.PI * 2); context.fillStyle = '#3d342a'; context.fill(); }
    for (const puck of game.pucks) { context.beginPath(); context.arc(puck.x, puck.y, CROKINOLE_BOARD.puckRadius, 0, Math.PI * 2); context.fillStyle = puck.owner === 'one' ? '#f2eee6' : '#292c30'; context.fill(); context.strokeStyle = '#493a2c'; context.lineWidth = 1; context.stroke(); }
    score.textContent = `${fields.playerOne}: ${game.points.one} (${game.shots.one}/8) · ${fields.playerTwo}: ${game.points.two} (${game.shots.two}/8)`;
    form.querySelector('[data-crokinole-turn]').textContent = game.winner ? fields.gameOver : `${fields.turn}: ${game.turn === 'one' ? fields.playerOne : fields.playerTwo}`;
  };
  const loop = (now) => {
    if (!game.shot) return;
    const dt = lastFrame ? (now - lastFrame) / 1000 : 0; lastFrame = now;
    advanceCrokinoleGame(game, dt); draw();
    if (game.shot) requestAnimationFrame(loop);
    else { setStatus(game.last); form.querySelector('[data-crokinole-shoot]').disabled = Boolean(game.winner); }
  };
  form.addEventListener('submit', (event) => event.preventDefault());
  form.querySelector('[data-crokinole-shoot]').addEventListener('click', () => {
    try { if (shootCrokinole(game, angle.value, power.value)) { lastFrame = 0; form.querySelector('[data-crokinole-shoot]').disabled = true; setStatus('moving'); requestAnimationFrame(loop); } }
    catch { setStatus('invalid'); }
  });
  form.querySelector('[data-crokinole-reset]').addEventListener('click', () => { game = createCrokinoleGame(); draw(); setStatus('ready'); form.querySelector('[data-crokinole-shoot]').disabled = false; });
  const angleOutput = form.querySelector('[data-crokinole-angle-value]'); const powerOutput = form.querySelector('[data-crokinole-power-value]');
  const updateOutputs = () => { angleOutput.textContent = `${angle.value}°`; powerOutput.textContent = power.value; };
  angle.addEventListener('input', updateOutputs); power.addEventListener('input', updateOutputs); updateOutputs(); draw(); setStatus('ready');
}

mountCrokinole();
