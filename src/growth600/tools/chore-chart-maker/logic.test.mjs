import assert from 'node:assert/strict';
import test from 'node:test';
import { choreScheduleToCsv, createChoreSchedule, parseChorePeople, parseChores } from './logic.mjs';

const sample = { people: 'Alex\nSam\nRiley', chores: 'Kitchen | 3\nTrash | 1\nLaundry | 2', startDate: '2026-10-12', weeks: 4 };

test('chore chart creates weekly assignments for every task and balances load over rotating weeks', () => {
  const schedule = createChoreSchedule(sample);
  assert.equal(schedule.schedule.length, 4);
  assert.deepEqual(schedule.schedule.map(({ startDate }) => startDate), ['2026-10-12', '2026-10-19', '2026-10-26', '2026-11-02']);
  for (const week of schedule.schedule) {
    assert.equal(week.assignments.length, 3);
    assert.deepEqual(new Set(week.assignments.map(({ chore }) => chore)), new Set(['Kitchen', 'Trash', 'Laundry']));
    assert.ok(week.assignments.every(({ person }) => schedule.people.includes(person)));
  }
  assert.ok(schedule.loadSpread <= 3, `weighted workload spread was ${schedule.loadSpread}`);
  assert.notEqual(schedule.schedule[0].assignments.find(({ chore }) => chore === 'Kitchen').person, schedule.schedule[1].assignments.find(({ chore }) => chore === 'Kitchen').person);
});

test('chore chart requires Monday, bounded weeks, unique names, and valid task effort', () => {
  assert.throws(() => createChoreSchedule({ ...sample, startDate: '2026-10-13' }), /Monday/u);
  assert.throws(() => createChoreSchedule({ ...sample, weeks: 13 }), /1 to 12 weeks/u);
  assert.throws(() => parseChorePeople('Alex\nalex'), /listed more than once/u);
  assert.throws(() => parseChores('Kitchen | 9'), /Chore 1/u);
  assert.throws(() => parseChores('Kitchen\nkitchen'), /listed more than once/u);
  assert.throws(() => createChoreSchedule({ ...sample, people: '' }), /1 to 12/u);
});

test('CSV export escapes commas, quotes and line breaks without altering schedule data', () => {
  const schedule = createChoreSchedule({ people: 'A "B"', chores: 'Wipe, clean | 2', startDate: '2026-10-12' });
  const csv = choreScheduleToCsv(schedule);
  assert.match(csv, /"Wipe, clean","A ""B""","2"/u);
  assert.equal(schedule.schedule[0].assignments[0].chore, 'Wipe, clean');
});
