import { createPoolGame, isPoolCuePlacementValid, resolvePoolShot, shootCueBall, simulatePoolStep, TABLE } from './logic.mjs';

const root = document.querySelector('[data-tool="pool-game"]');
if (root) {
  const canvas = root.querySelector('[data-pool-table]');
  const context = canvas?.getContext('2d');
  if (context && canvas) {
    const pixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
    canvas.width = TABLE.width * pixelRatio; canvas.height = TABLE.height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }
  const status = root.querySelector('[data-pool-status]');
  const reset = root.querySelector('[data-pool-reset]');
  const shoot = root.querySelector('[data-pool-shoot]');
  const angleInput = root.querySelector('[data-pool-angle]');
  const powerInput = root.querySelector('[data-pool-power]');
  const placement = root.querySelector('[data-pool-placement]');
  const cueXInput = root.querySelector('[data-pool-cue-x]');
  const cueYInput = root.querySelector('[data-pool-cue-y]');
  const placeButton = root.querySelector('[data-pool-place]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let game = createPoolGame();
  let balls = game.balls;
  let last = 0;
  let pointer = null;
  let sunk = 0;
  let shot = null;
  let renderScheduled = false;
  const active = () => balls.some(({ vx, vy }) => Math.hypot(vx, vy) > 0.1);
  const scheduleRender = () => {
    if (renderScheduled) return;
    renderScheduled = true;
    requestAnimationFrame((time) => { renderScheduled = false; render(time); });
  };
  const placeCue = (x, y) => {
    const cue = balls.find(({ kind }) => kind === 'cue');
    if (!cue || !isPoolCuePlacementValid(balls, x, y)) return false;
    cue.x = x; cue.y = y; game.ballInHand = false; status.textContent = copy.messages.cuePlaced;
    scheduleRender();
    return true;
  };

  function drawBall(ball) {
    context.beginPath(); context.arc(ball.x, ball.y, TABLE.ballRadius, 0, Math.PI * 2);
    context.fillStyle = ball.color; context.fill();
    if (ball.kind === 'stripe') {
      context.save(); context.beginPath(); context.arc(ball.x, ball.y, TABLE.ballRadius, 0, Math.PI * 2); context.clip();
      context.fillStyle = '#fff'; context.fillRect(ball.x - 15, ball.y - 5, 30, 10); context.restore();
    }
    context.beginPath(); context.arc(ball.x, ball.y, TABLE.ballRadius, 0, Math.PI * 2); context.strokeStyle = '#1118'; context.lineWidth = 1.5; context.stroke();
    if (ball.kind !== 'cue') {
      context.beginPath(); context.arc(ball.x, ball.y, 6.2, 0, Math.PI * 2); context.fillStyle = '#fff'; context.fill();
      context.fillStyle = '#171717'; context.font = 'bold 7px system-ui'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(String(ball.id), ball.x, ball.y + 0.3);
    }
  }

  function render(time = 0) {
    if (!context) return;
    const elapsed = last ? Math.min((time - last) / 1000, 1 / 30) : 0; last = time;
    if (shot) {
      sunk += simulatePoolStep(balls, elapsed, shot);
      if (!active()) {
        const outcome = resolvePoolShot(game, shot);
        if (game.ballInHand) {
          const cue = balls.find(({ kind }) => kind === 'cue');
          if (cueXInput) cueXInput.value = String(Math.round(cue.x / 5) * 5);
          if (cueYInput) cueYInput.value = String(Math.round(cue.y / 5) * 5);
        }
        status.textContent = game.winner !== null
          ? outcome.kind === 'win' ? copy.messages.win : copy.messages.loss
          : outcome.foul ? copy.messages.foul
            : outcome.kind === 'continue' ? copy.messages.continue
              : copy.messages.turn;
        if (game.ballInHand) status.textContent += ` ${copy.messages.ballInHand}`;
        shot = null;
      }
    }
    const score = root.querySelector('[data-pool-score]');
    if (score) score.textContent = `${sunk} / 15`;
    const turn = root.querySelector('[data-pool-turn]');
    if (placement) placement.hidden = !game.ballInHand;
    if (turn) {
      const player = game.turn === 0 ? copy.fields.playerOne : copy.fields.playerTwo;
      const group = game.groups[game.turn] ? copy.fields[game.groups[game.turn]] : copy.fields.openTable;
      turn.textContent = game.winner === null ? `${player} · ${group}` : `${copy.fields.winner}: ${game.winner === 0 ? copy.fields.playerOne : copy.fields.playerTwo}`;
    }
    context.clearRect(0, 0, TABLE.width, TABLE.height);
    context.fillStyle = '#49311f'; context.fillRect(0, 0, TABLE.width, TABLE.height);
    context.fillStyle = '#126344'; context.fillRect(34, 34, TABLE.width - 68, TABLE.height - 68);
    context.strokeStyle = '#d5b47a'; context.lineWidth = 3; context.strokeRect(47, 47, TABLE.width - 94, TABLE.height - 94);
    for (const [x, y] of [[0,0],[500,0],[1000,0],[0,500],[500,500],[1000,500]]) {
      context.beginPath(); context.arc(x, y, TABLE.pocketRadius, 0, Math.PI * 2); context.fillStyle = '#111'; context.fill();
    }
    for (const ball of balls) drawBall(ball);
    const cue = balls.find(({ kind }) => kind === 'cue');
    if (cue && !active() && game.winner === null && !game.ballInHand) {
      const angle = Number(angleInput?.value ?? 0) * Math.PI / 180;
      const dx = pointer ? cue.x - pointer.x : Math.cos(angle); const dy = pointer ? cue.y - pointer.y : Math.sin(angle); const length = Math.hypot(dx, dy) || 1;
      context.beginPath(); context.moveTo(cue.x, cue.y); context.lineTo(cue.x + dx / length * 150, cue.y + dy / length * 150);
      context.strokeStyle = '#fff9'; context.lineWidth = 2; context.setLineDash([7, 6]); context.stroke(); context.setLineDash([]);
    }
    if (shoot) shoot.disabled = active() || game.ballInHand || game.winner !== null;
    if (shot || active()) scheduleRender();
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * TABLE.width / rect.width, y: (event.clientY - rect.top) * TABLE.height / rect.height };
  }
  canvas?.addEventListener('pointerdown', (event) => {
    if (active()) return;
    const position = point(event);
    if (game.ballInHand) {
      placeCue(position.x, position.y);
      return;
    }
    if (game.winner !== null) return;
    pointer = position; canvas.setPointerCapture(event.pointerId); scheduleRender();
  });
  canvas?.addEventListener('pointermove', (event) => { if (pointer) { pointer = point(event); scheduleRender(); } });
  canvas?.addEventListener('pointerup', (event) => {
    if (!pointer || active() || game.ballInHand || game.winner !== null) { pointer = null; return; }
    const cue = balls.find(({ kind }) => kind === 'cue');
    const target = point(event); const dx = cue.x - target.x; const dy = cue.y - target.y; const pull = Math.hypot(dx, dy);
    if (pull > 8) {
      shot = { firstContactId: null, firstContactKind: null, railAfterContact: false, pocketed: [], cueScratch: false };
      shootCueBall(balls, dx, dy, Math.min(850, pull * 4.5));
      if (status) status.textContent = copy.messages.shot;
    }
    pointer = null;
    scheduleRender();
  });
  canvas?.addEventListener('pointercancel', () => { pointer = null; scheduleRender(); });
  angleInput?.addEventListener('input', scheduleRender);
  shoot?.addEventListener('click', () => {
    if (active() || game.ballInHand || game.winner !== null) return;
    const angle = Number(angleInput?.value ?? 0) * Math.PI / 180;
    const power = Number(powerInput?.value ?? 40) / 100 * 850;
    if (shootCueBall(balls, Math.cos(angle), Math.sin(angle), power)) {
      shot = { firstContactId: null, firstContactKind: null, railAfterContact: false, pocketed: [], cueScratch: false };
      if (status) status.textContent = copy.messages.shot;
      scheduleRender();
    }
  });
  placeButton?.addEventListener('click', () => placeCue(Number(cueXInput?.value), Number(cueYInput?.value)));
  reset?.addEventListener('click', () => {
    game = createPoolGame(); balls = game.balls; sunk = 0; pointer = null; last = 0; shot = null;
    if (status) status.textContent = copy.messages.reset;
    scheduleRender();
  });
  scheduleRender();
}
