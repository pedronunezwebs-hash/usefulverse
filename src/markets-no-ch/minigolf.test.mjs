import test from 'node:test';
import assert from 'node:assert/strict';
import { GOLF_COURT, aimGolf, createGolfCourse, createGolfState, formatCourseCode, nextGolfHole, normalizeCourseCode, puttGolf, resetGolfHole, tickGolf, undoGolfStroke } from './minigolf.mjs';

test('builds nine different original holes deterministically and round-trips full-width codes', () => {
  for (const seed of [1, 20261016, 0xffffffff]) {
    const course = createGolfCourse(seed);
    assert.equal(course.length, 9);
    assert.equal(new Set(course.map(({ number }) => number)).size, 9);
    assert.deepEqual(course, createGolfCourse(seed));
    assert.equal(normalizeCourseCode(formatCourseCode(seed)), seed >>> 0);
  }
  assert.equal(formatCourseCode(0), formatCourseCode(1));
  assert.equal(normalizeCourseCode(formatCourseCode(0)), 1);
  assert.equal(normalizeCourseCode('not-a-course'), null);
  assert.equal(normalizeCourseCode('UV-MG-00000A1'), 361);
});

test('aim controls clamp power and prevent strokes while rolling', () => {
  const state = createGolfState({ seed: 17 });
  assert.equal(aimGolf(state, 1, 99).power, 10);
  assert.equal(aimGolf(state, 1, 0).power, 1);
  const rolling = puttGolf(state);
  assert.equal(rolling.status, 'rolling');
  assert.equal(rolling.strokes, 1);
  assert.equal(puttGolf(rolling), rolling);
});

test('course walls reflect a high-speed shot without leaving the playable field', () => {
  const state = createGolfState({ seed: 17 });
  const rolling = { ...state, status: 'rolling', ball: { x: 9, y: 180, vx: -420, vy: 0 } };
  const next = tickGolf(rolling, 0.1);
  assert.ok(next.ball.x >= GOLF_COURT.radius && next.ball.x <= GOLF_COURT.width - GOLF_COURT.radius);
  assert.ok(next.ball.vx > 0);
});

test('water adds one penalty stroke and returns the ball to the tee', () => {
  const state = createGolfState({ seed: 17 });
  const hole = { ...state.course[0], water: [{ x: 95, y: 95, width: 30, height: 30 }] };
  const rolling = { ...state, status: 'rolling', strokes: 2, ball: { x: 100, y: 100, vx: 0, vy: 0 }, course: [hole, ...state.course.slice(1)] };
  const next = tickGolf(rolling, 1 / 60);
  assert.equal(next.status, 'aiming');
  assert.equal(next.strokes, 3);
  assert.deepEqual(next.ball, { x: hole.tee[0], y: hole.tee[1], vx: 0, vy: 0 });
});

test('a low-speed ball drops into cup, records strokes, and advances exactly one hole', () => {
  const state = createGolfState({ seed: 17, holeIndex: 0 });
  const first = { ...state.course[0], bumpers: [], water: [], cup: [240, 180] };
  const rolling = { ...state, status: 'rolling', holeIndex: 0, strokes: 3, course: [first, ...state.course.slice(1)], ball: { x: 233, y: 180, vx: 25, vy: 0 } };
  const complete = tickGolf(rolling, 0.04);
  assert.equal(complete.status, 'holeComplete');
  assert.equal(complete.scorecard[0], 3);
  assert.equal(nextGolfHole(complete).holeIndex, 1);
  assert.equal(nextGolfHole(rolling), rolling);
});

test('undo and restart restore only the current hole state', () => {
  const state = createGolfState({ seed: 17 });
  const shot = puttGolf(aimGolf(state, 0.15, 4));
  const stopped = { ...shot, status: 'aiming', ball: { x: 211, y: 122, vx: 0, vy: 0 } };
  const undone = undoGolfStroke(stopped);
  assert.equal(undone.strokes, 0);
  assert.deepEqual(undone.ball, state.ball);
  const reset = resetGolfHole({ ...stopped, strokes: 4 });
  assert.equal(reset.strokes, 0);
  assert.equal(reset.scorecard[0], null);
  assert.deepEqual(reset.ball, { x: state.course[0].tee[0], y: state.course[0].tee[1], vx: 0, vy: 0 });
});

test('a completed ninth hole records a nine-hole round best', () => {
  const initial = createGolfState({ seed: 202, holeIndex: 8 });
  const last = { ...initial.course[8], bumpers: [], water: [], cup: [240, 180] };
  const rolling = { ...initial, status: 'rolling', strokes: 4, course: [...initial.course.slice(0, 8), last], scorecard: [2, 3, 2, 3, 4, 2, 3, 4, null], ball: { x: 233, y: 180, vx: 25, vy: 0 } };
  const complete = tickGolf(rolling, 0.04);
  assert.equal(complete.status, 'roundComplete');
  assert.equal(complete.best, 27);
});

test('undoing a cup-winning putt reopens the hole and permits another shot', () => {
  const initial = createGolfState({ seed: 17 });
  const first = { ...initial.course[0], bumpers: [], water: [], cup: [240, 180] };
  const rolling = {
    ...initial, status: 'rolling', holeIndex: 0, strokes: 4,
    course: [first, ...initial.course.slice(1)],
    ball: { x: 233, y: 180, vx: 25, vy: 0 },
    lastStroke: { ball: { x: 233, y: 180, vx: 0, vy: 0 }, strokes: 3, status: 'aiming', best: 31 },
  };
  const completed = tickGolf(rolling, 0.04);
  assert.equal(completed.status, 'holeComplete');
  assert.equal(completed.scorecard[0], 4);
  const undone = undoGolfStroke(completed);
  assert.equal(undone.status, 'aiming');
  assert.equal(undone.scorecard[0], null);
  assert.equal(undone.strokes, 3);
  assert.equal(undone.best, 31);
  assert.equal(puttGolf(undone).status, 'rolling');
});
