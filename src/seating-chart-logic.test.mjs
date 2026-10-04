import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeatingPlan, moveGuestToTable, parseGuestNames, validateSeatingPlan } from './seating-chart-logic.mjs';

test('guest parsing keeps Unicode, trims blank lines, and allows duplicate names with unique IDs', () => {
  assert.deepEqual(parseGuestNames('  Zoë  \n\n李雷\nZoë'), [
    { id: 'guest-1', name: 'Zoë' }, { id: 'guest-2', name: '李雷' }, { id: 'guest-3', name: 'Zoë' },
  ]);
});

test('seating plan shuffles deterministically and distributes guests without exceeding capacity', () => {
  const plan = createSeatingPlan({ guests: 'A\nB\nC\nD\nE', tableCount: 3, seatsPerTable: 2, random: () => 0 });
  assert.deepEqual(plan.tables.map((table) => table.guests.map((guest) => guest.name)), [['B', 'E'], ['C', 'A'], ['D']]);
});

test('capacity, table count, seats, guest count, name size, and random source are bounded', () => {
  assert.throws(() => createSeatingPlan({ guests: 'A\nB\nC', tableCount: 1, seatsPerTable: 2 }), /Capacity is 2/u);
  assert.throws(() => createSeatingPlan({ guests: 'A', tableCount: 0, seatsPerTable: 2 }), /Table count/u);
  assert.throws(() => createSeatingPlan({ guests: 'A', tableCount: 1, seatsPerTable: 21 }), /Seats per table/u);
  assert.throws(() => parseGuestNames(''), /at least one/u);
  assert.throws(() => parseGuestNames('x'.repeat(101)), /100 characters/u);
  assert.throws(() => createSeatingPlan({ guests: 'A\nB', tableCount: 2, seatsPerTable: 2, random: () => 1 }), /Random source/u);
});

test('moving guests preserves input plan and enforces destination capacity', () => {
  const original = createSeatingPlan({ guests: 'A\nB\nC', tableCount: 2, seatsPerTable: 2, random: () => 0 });
  const moved = moveGuestToTable(original, original.tables[0].guests[0].id, original.tables[1].id);
  assert.equal(original.tables[0].guests.length, 2);
  assert.equal(moved.tables[0].guests.length, 1);
  assert.equal(moved.tables[1].guests.length, 2);
  assert.throws(() => moveGuestToTable(moved, moved.tables[0].guests[0].id, moved.tables[1].id), /full/u);
});

test('validated exported plans round-trip and reject duplicate IDs or excess capacity', () => {
  const plan = createSeatingPlan({ guests: 'Ana\n李雷', tableCount: 2, seatsPerTable: 2, random: () => 0 });
  assert.deepEqual(validateSeatingPlan(JSON.parse(JSON.stringify(plan))), plan);
  const duplicate = structuredClone(plan);
  duplicate.tables[1].guests[0].id = duplicate.tables[0].guests[0].id;
  assert.throws(() => validateSeatingPlan(duplicate), /duplicated/u);
  const overCapacity = structuredClone(plan);
  overCapacity.seatsPerTable = 0;
  assert.throws(() => validateSeatingPlan(overCapacity), /Seats per table/u);
});
