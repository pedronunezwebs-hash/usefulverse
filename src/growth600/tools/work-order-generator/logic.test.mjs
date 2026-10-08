import assert from 'node:assert/strict';
import test from 'node:test';
import { createWorkOrder, workOrderToCsv } from './logic.mjs';

const valid = {
  number: 'WO-2026-01', issuedDate: '2026-10-09', scheduledDate: '2026-10-10', completedDate: '', status: 'in-progress',
  customer: 'Northwind', contact: 'Ada', location: '12 Main St', assignedTo: 'Sam', title: 'Repair gate', details: 'Replace the hinge.',
  tasks: 'Inspect gate\nReplace hinge', materials: 'Hinge | 2 | each\nScrews | 8 | each', labor: 'Inspection | 0.5\nRepair | 1.25', notes: 'Call on arrival.',
};

test('creates a bounded work order, checklist, material list and labor-hour total', () => {
  const order = createWorkOrder(valid);
  assert.equal(order.customer, 'Northwind');
  assert.deepEqual(order.tasks.map(({ description, done }) => [description, done]), [['Inspect gate', false], ['Replace hinge', false]]);
  assert.deepEqual(order.materials.map(({ quantity, unit }) => [quantity, unit]), [[2, 'each'], [8, 'each']]);
  assert.equal(order.totalLaborHours, 1.75);
});

test('accepts an explicitly completed order only with a valid completion date', () => {
  assert.throws(() => createWorkOrder({ ...valid, status: 'completed' }), /completion date/i);
  assert.throws(() => createWorkOrder({ ...valid, status: 'completed', completedDate: '2026-10-08' }), /before the issue date/i);
  assert.equal(createWorkOrder({ ...valid, status: 'completed', completedDate: '2026-10-11' }).completedDate, '2026-10-11');
});

test('uses the supplied local issue date and preserves checked task state when rebuilding', () => {
  const order = createWorkOrder({ ...valid, issuedDate: '', scheduledDate: '', completedTasks: [1] }, { today: '2026-10-12' });
  assert.equal(order.issuedDate, '2026-10-12');
  assert.deepEqual(order.tasks.map(({ done }) => done), [false, true]);
});

test('requires customer, summary and at least one work entry', () => {
  assert.throws(() => createWorkOrder({ ...valid, customer: '' }), /customer/i);
  assert.throws(() => createWorkOrder({ ...valid, title: '' }), /summary/i);
  assert.throws(() => createWorkOrder({ ...valid, tasks: '', materials: '', labor: '' }), /at least one/i);
});

test('rejects invalid dates, order, status and excessive or malformed rows', () => {
  assert.throws(() => createWorkOrder({ ...valid, issuedDate: '2026-02-30' }), /valid date/i);
  assert.throws(() => createWorkOrder({ ...valid, scheduledDate: '2026-10-08' }), /before the issue date/i);
  assert.throws(() => createWorkOrder({ ...valid, status: 'cancelled' }), /status/i);
  assert.throws(() => createWorkOrder({ ...valid, materials: 'Hinge | 0 | each' }), /positive quantity/i);
  assert.throws(() => createWorkOrder({ ...valid, materials: 'Hinge | 2 | each | extra' }), /description \| quantity \| unit/i);
  assert.throws(() => createWorkOrder({ ...valid, labor: 'Repair | -1' }), /hours from 0/i);
  assert.throws(() => createWorkOrder({ ...valid, labor: 'Repair | 1 | extra' }), /activity \| hours/i);
  assert.throws(() => createWorkOrder({ ...valid, tasks: Array(41).fill('Task').join('\n') }), /up to 40/i);
});

test('CSV safely quotes Unicode and neutralizes spreadsheet formulas', () => {
  const order = createWorkOrder({ ...valid, customer: '=SUM(1,1)', tasks: 'Review, repair' });
  const csv = workOrderToCsv(order);
  assert.match(csv, /'=SUM\(1,1\)/u);
  assert.match(csv, /"Review, repair"/u);
  assert.match(csv, /"Hinge","2","each"/u);
});
