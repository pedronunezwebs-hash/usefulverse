export const GOLF_COURT = Object.freeze({ width: 600, height: 390, radius: 7, holeRadius: 12 });

// Twelve hand-authored, original layouts. A share code chooses a deterministic
// order of nine different holes, so everyone can play the same local course.
const layouts = Object.freeze([
  { par: 2, tee: [54, 326], cup: [548, 62], bumpers: [[295, 198, 31]], water: [] },
  { par: 3, tee: [54, 332], cup: [546, 58], bumpers: [[220, 250, 24], [380, 145, 28]], water: [[286, 170, 30, 78]] },
  { par: 3, tee: [52, 55], cup: [548, 335], bumpers: [[185, 145, 25], [415, 245, 27]], water: [[278, 198, 48, 32]] },
  { par: 3, tee: [60, 195], cup: [540, 195], bumpers: [[210, 112, 22], [390, 278, 22]], water: [[285, 154, 34, 82]] },
  { par: 4, tee: [55, 332], cup: [545, 55], bumpers: [[175, 270, 24], [320, 198, 32], [455, 116, 22]], water: [[252, 92, 42, 58]] },
  { par: 3, tee: [55, 55], cup: [545, 55], bumpers: [[210, 158, 34], [390, 158, 34]], water: [[280, 215, 40, 96]] },
  { par: 4, tee: [55, 195], cup: [545, 70], bumpers: [[185, 195, 25], [330, 275, 28], [450, 190, 26]], water: [[300, 88, 36, 92]] },
  { par: 4, tee: [55, 55], cup: [545, 332], bumpers: [[190, 130, 28], [300, 205, 26], [430, 275, 30]], water: [[215, 245, 42, 54]] },
  { par: 3, tee: [55, 330], cup: [545, 330], bumpers: [[230, 260, 28], [365, 118, 30]], water: [[282, 74, 34, 86]] },
  { par: 4, tee: [55, 195], cup: [545, 195], bumpers: [[180, 118, 26], [300, 280, 28], [420, 118, 26]], water: [[268, 154, 64, 82]] },
  { par: 3, tee: [55, 330], cup: [545, 55], bumpers: [[195, 188, 26], [405, 188, 26]], water: [[282, 245, 40, 64], [282, 80, 40, 64]] },
  { par: 4, tee: [55, 55], cup: [545, 195], bumpers: [[205, 112, 25], [285, 280, 30], [425, 120, 24]], water: [[380, 190, 46, 70]] },
]);

export function normalizeCourseCode(value) {
  const match = /^UV-MG-([0-9A-Z]{7})$/iu.exec(String(value ?? '').trim());
  if (!match) return null;
  const seed = Number.parseInt(match[1], 36);
  return Number.isSafeInteger(seed) && seed >= 0 ? seed >>> 0 : null;
}

export function formatCourseCode(seed) {
  const normalizedSeed = (seed >>> 0) || 1;
  return `UV-MG-${normalizedSeed.toString(36).toUpperCase().padStart(7, '0').slice(-7)}`;
}

export function createGolfCourse(seed = 20261016) {
  let state = (seed >>> 0) || 1;
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 0x100000000; };
  const pool = layouts.map((_, index) => index);
  const holes = [];
  while (holes.length < 9) {
    const slot = Math.floor(random() * pool.length);
    holes.push(layouts[pool.splice(slot, 1)[0]]);
  }
  return holes.map((hole, index) => ({
    number: index + 1, par: hole.par, tee: [...hole.tee], cup: [...hole.cup],
    bumpers: hole.bumpers.map(([x, y, radius]) => ({ x, y, radius })),
    water: hole.water.map(([x, y, width, height]) => ({ x, y, width, height })),
  }));
}

export function createGolfState({ seed = 20261016, holeIndex = 0, best = Infinity } = {}) {
  const course = createGolfCourse(seed);
  const index = Math.max(0, Math.min(course.length - 1, Math.floor(holeIndex) || 0));
  const hole = course[index];
  return {
    seed: seed >>> 0, course, holeIndex: index, strokes: 0, scorecard: Array(9).fill(null),
    best: Number.isFinite(best) && best >= 9 ? Math.floor(best) : null,
    ball: { x: hole.tee[0], y: hole.tee[1], vx: 0, vy: 0 },
    angle: Math.atan2(hole.cup[1] - hole.tee[1], hole.cup[0] - hole.tee[0]), power: 5,
    status: 'aiming', lastStroke: null,
  };
}

export function aimGolf(state, angle = state.angle, power = state.power) {
  if (state.status !== 'aiming' || !Number.isFinite(angle) || !Number.isFinite(power)) return state;
  return { ...state, angle: Math.atan2(Math.sin(angle), Math.cos(angle)), power: Math.max(1, Math.min(10, Math.round(power))) };
}

export function puttGolf(state) {
  if (state.status !== 'aiming' || state.scorecard[state.holeIndex] !== null) return state;
  const speed = 90 + state.power * 23;
  return {
    ...state,
    strokes: state.strokes + 1,
    lastStroke: { ball: { ...state.ball }, strokes: state.strokes, status: state.status, best: state.best },
    ball: { ...state.ball, vx: Math.cos(state.angle) * speed, vy: Math.sin(state.angle) * speed },
    status: 'rolling',
  };
}

function circleHit(ball, bumper) {
  const dx = ball.x - bumper.x;
  const dy = ball.y - bumper.y;
  const distance = Math.hypot(dx, dy);
  const min = GOLF_COURT.radius + bumper.radius;
  if (distance >= min) return false;
  const nx = distance > 0 ? dx / distance : 1;
  const ny = distance > 0 ? dy / distance : 0;
  return { nx, ny, overlap: min - distance };
}

function inWater(ball, water) {
  const x = Math.max(water.x, Math.min(ball.x, water.x + water.width));
  const y = Math.max(water.y, Math.min(ball.y, water.y + water.height));
  return (ball.x - x) ** 2 + (ball.y - y) ** 2 <= GOLF_COURT.radius ** 2;
}

export function tickGolf(state, seconds) {
  if (state.status !== 'rolling' || !Number.isFinite(seconds) || seconds <= 0) return state;
  let remaining = Math.min(seconds, 0.1);
  let ball = { ...state.ball };
  const hole = state.course[state.holeIndex];
  let waterPenalty = false;
  while (remaining > 1e-8) {
    const dt = Math.min(remaining, 1 / 240); remaining -= dt;
    ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    const drag = Math.exp(-0.72 * dt); ball.vx *= drag; ball.vy *= drag;
    if (ball.x < GOLF_COURT.radius) { ball.x = GOLF_COURT.radius; ball.vx = Math.abs(ball.vx) * 0.72; }
    if (ball.x > GOLF_COURT.width - GOLF_COURT.radius) { ball.x = GOLF_COURT.width - GOLF_COURT.radius; ball.vx = -Math.abs(ball.vx) * 0.72; }
    if (ball.y < GOLF_COURT.radius) { ball.y = GOLF_COURT.radius; ball.vy = Math.abs(ball.vy) * 0.72; }
    if (ball.y > GOLF_COURT.height - GOLF_COURT.radius) { ball.y = GOLF_COURT.height - GOLF_COURT.radius; ball.vy = -Math.abs(ball.vy) * 0.72; }
    for (const bumper of hole.bumpers) {
      const hit = circleHit(ball, bumper); if (!hit) continue;
      const dot = ball.vx * hit.nx + ball.vy * hit.ny;
      if (dot < 0) { ball.vx -= 2 * dot * hit.nx; ball.vy -= 2 * dot * hit.ny; }
      ball.x += hit.nx * (hit.overlap + 0.05); ball.y += hit.ny * (hit.overlap + 0.05);
    }
    if (hole.water.some((area) => inWater(ball, area))) {
      waterPenalty = true;
      ball = { x: hole.tee[0], y: hole.tee[1], vx: 0, vy: 0 };
      break;
    }
    const toCup = Math.hypot(ball.x - hole.cup[0], ball.y - hole.cup[1]);
    const speed = Math.hypot(ball.vx, ball.vy);
    if (toCup <= GOLF_COURT.holeRadius - 2 && speed < 92) {
      ball = { x: hole.cup[0], y: hole.cup[1], vx: 0, vy: 0 };
      const scorecard = [...state.scorecard]; scorecard[state.holeIndex] = state.strokes;
      const status = state.holeIndex === 8 ? 'roundComplete' : 'holeComplete';
      return { ...state, ball, scorecard, best: status === 'roundComplete' ? Math.min(state.best ?? Infinity, scorecard.reduce((sum, value) => sum + value, 0)) : state.best, status };
    }
    if (speed < 3.2) {
      ball.vx = 0; ball.vy = 0;
      return { ...state, ball, status: 'aiming', strokes: state.strokes + (waterPenalty ? 1 : 0) };
    }
  }
  return { ...state, ball, status: waterPenalty ? 'aiming' : 'rolling', strokes: state.strokes + (waterPenalty ? 1 : 0) };
}

export function undoGolfStroke(state) {
  if (!state.lastStroke || state.status === 'rolling') return state;
  const scorecard = [...state.scorecard];
  if (state.status === 'holeComplete' || state.status === 'roundComplete') scorecard[state.holeIndex] = null;
  return { ...state, ball: { ...state.lastStroke.ball }, strokes: state.lastStroke.strokes, scorecard, best: state.lastStroke.best, status: state.lastStroke.status, lastStroke: null };
}

export function resetGolfHole(state) {
  const hole = state.course[state.holeIndex];
  return { ...state, ball: { x: hole.tee[0], y: hole.tee[1], vx: 0, vy: 0 }, strokes: 0, scorecard: state.scorecard.map((score, index) => index === state.holeIndex ? null : score), status: 'aiming', lastStroke: null };
}

export function nextGolfHole(state) {
  if (state.status !== 'holeComplete' || state.holeIndex >= 8) return state;
  const next = createGolfState({ seed: state.seed, holeIndex: state.holeIndex + 1, best: state.best ?? Infinity });
  return { ...next, scorecard: [...state.scorecard], best: state.best };
}
