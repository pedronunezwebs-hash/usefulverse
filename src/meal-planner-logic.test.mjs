import test from 'node:test';
import assert from 'node:assert/strict';
import { addPlannedMeal, buildShoppingList, createMeal, serializeMealPlan, validateMealPlan } from './meal-planner-logic.mjs';

const monday = '2026-10-05';
const meal = (id, day, name, ingredients, type = 'dinner') => createMeal({ id, date: day, type, name, ingredients });

test('meal planner preserves Unicode, normalizes names and sorts the week', () => {
  const first = meal('one', monday, '  Crème   brûlée ', [' eggs ', 'Milk']);
  const second = meal('two', '2026-10-06', 'sopa de arroz', ['arroz', 'agua'], 'lunch');
  assert.equal(first.name, 'Crème brûlée');
  assert.deepEqual(addPlannedMeal([second], first).map(({ id }) => id), ['one', 'two']);
});

test('shopping list merges exact case-insensitive duplicates and keeps the first wording', () => {
  const meals = [meal('one', monday, 'Soup', ['Rice', 'Water']), meal('two', monday, 'Rice bowl', ['rice', 'Beans'])];
  assert.deepEqual(buildShoppingList(meals), ['Rice', 'Water', 'Beans']);
});

test('meal plan backup round-trips and rejects dates outside its Monday-to-Sunday range', () => {
  const meals = [meal('one', monday, 'Soup', ['Rice'])];
  const value = serializeMealPlan(monday, meals);
  assert.deepEqual(validateMealPlan(value), { version: 1, weekOf: monday, meals });
  assert.throws(() => validateMealPlan({ version: 1, weekOf: monday, meals: [meal('two', '2026-10-12', 'Soup', ['Rice'])] }));
});

test('meal input rejects empty, malformed, duplicated and overlong records', () => {
  assert.throws(() => meal('one', monday, '', ['Rice']));
  assert.throws(() => meal('one', '2026-02-31', 'Soup', ['Rice']));
  assert.throws(() => addPlannedMeal([meal('one', monday, 'Soup', ['Rice'])], meal('one', monday, 'Again', ['Rice'])));
  assert.throws(() => meal('one', monday, 'Soup', ['x'.repeat(201)]));
});

test('meal backup rejects non-Monday starts and malformed schemas', () => {
  assert.throws(() => validateMealPlan({ version: 1, weekOf: '2026-10-06', meals: [] }));
  assert.throws(() => validateMealPlan({ version: 2, weekOf: monday, meals: [] }));
});
