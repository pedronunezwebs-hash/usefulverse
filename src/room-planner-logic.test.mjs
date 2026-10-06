import test from 'node:test';
import assert from 'node:assert/strict';
import { addFurniture, createRoomPlan, intersects, moveFurniture, removeFurniture, resizeRoom, rotateFurniture } from './room-planner-logic.mjs';

test('validates room dimensions and units', () => {
  assert.deepEqual(createRoomPlan(5, 4, 'm'), { width: 5, depth: 4, unit: 'm', items: [], nextId: 1 });
  assert.throws(() => createRoomPlan(1, 4), RangeError);
  assert.throws(() => createRoomPlan(5, 4, 'cm'), TypeError);
});

test('adds furniture within room bounds and finds non-overlapping default spots', () => {
  let plan = createRoomPlan();
  plan = addFurniture(plan, 'bed'); plan = addFurniture(plan, 'bed');
  assert.equal(plan.items.length, 2);
  assert.equal(intersects(plan.items[0], plan.items[1]), false);
  for (const item of plan.items) assert.ok(item.x >= 0 && item.y >= 0 && item.x + item.width <= plan.width && item.y + item.depth <= plan.depth);
  assert.throws(() => addFurniture(createRoomPlan(2, 2, 'ft'), 'bed'), RangeError);
  assert.throws(() => addFurniture(plan, 'spaceship'), TypeError);
});

test('moving snaps and clamps items, rotation preserves center where possible, and removal is safe', () => {
  let plan = addFurniture(createRoomPlan(5, 4), 'desk');
  const id = plan.items[0].id;
  plan = moveFurniture(plan, id, 4.95, 3.95);
  assert.ok(plan.items[0].x + plan.items[0].width <= plan.width);
  assert.ok(plan.items[0].y + plan.items[0].depth <= plan.depth);
  const rotated = rotateFurniture(plan, id);
  assert.equal(rotated.items[0].width, plan.items[0].depth);
  assert.equal(rotated.items[0].depth, plan.items[0].width);
  assert.equal(removeFurniture(rotated, id).items.length, 0);
  assert.equal(removeFurniture(rotated, 99), rotated);
  assert.throws(() => moveFurniture(rotated, id, NaN, 0), TypeError);
});

test('moving or rotating furniture cannot overlap another item', () => {
  let plan = createRoomPlan(5, 4);
  plan = addFurniture(plan, 'bed');
  plan = addFurniture(plan, 'desk');
  const [bed, desk] = plan.items;
  const blockedMove = moveFurniture(plan, desk.id, bed.x, bed.y);
  assert.equal(blockedMove, plan);
  const closePlan = Object.freeze({ ...plan, items: Object.freeze([Object.freeze({ ...bed, x: 0.4, y: 0 }), Object.freeze({ ...desk, x: 0, y: 1.5 })]) });
  assert.equal(rotateFurniture(closePlan, bed.id), closePlan);
});

test('changing room dimensions or units preserves valid furniture measurements and bounds', () => {
  const plan = addFurniture(createRoomPlan(5, 4, 'm'), 'bed');
  const feet = resizeRoom(plan, 16, 13, 'ft');
  assert.equal(feet.unit, 'ft');
  assert.ok(Math.abs(feet.items[0].width - 6.6) < 0.1);
  assert.ok(feet.items[0].x + feet.items[0].width <= feet.width);
  assert.throws(() => resizeRoom(plan, 2, 2, 'ft'), RangeError);
});
