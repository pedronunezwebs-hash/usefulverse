import { addPlannedMeal, buildShoppingList, serializeMealPlan, validateMealPlan } from './meal-planner-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const mondayOf = (date) => {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
};

export function setupWeeklyMealPlanner(root) {
  const ui = JSON.parse(root.dataset.mealMessages || '{}');
  const say = (key) => ui[key] ?? key;
  const status = $('[data-meal-status]', root);
  const weekOf = isoDate(mondayOf(new Date()));
  const storageKey = `usefulverse:meal-planner:v1:${weekOf}`;
  const locale = document.documentElement.lang || 'en';
  const meals = [];
  const days = $('[data-meal-day]', root);
  const form = $('[data-meal-form]', root);
  const name = $('[data-meal-name]', root);
  const ingredients = $('[data-meal-ingredients]', root);
  const list = $('[data-meal-list]', root);
  const empty = $('[data-meal-empty]', root);
  const shoppingList = $('[data-meal-shopping-list]', root);
  const shoppingEmpty = $('[data-meal-shopping-empty]', root);
  let shoppingBuilt = false;
  let idCounter = 0;
  const announce = (message, error = false) => {
    status.textContent = say(message);
    status.className = `tool-status${error ? ' is-error' : ' is-success'}`;
  };
  const dateLabel = (value) => new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`));
  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(`${weekOf}T12:00:00`);
    date.setDate(date.getDate() + offset);
    const option = document.createElement('option');
    option.value = isoDate(date);
    option.textContent = dateLabel(option.value);
    days.append(option);
  }
  const render = () => {
    list.replaceChildren();
    for (const meal of meals) {
      const item = document.createElement('li');
      const heading = document.createElement('strong');
      heading.textContent = `${dateLabel(meal.date)} · ${say(meal.type[0].toUpperCase() + meal.type.slice(1))}: ${meal.name}`;
      const details = document.createElement('p');
      details.textContent = meal.ingredients.join(', ');
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'button button--ghost';
      remove.dataset.mealRemove = meal.id;
      remove.textContent = say('Remove meal');
      item.append(heading, details, remove);
      list.append(item);
    }
    empty.hidden = meals.length > 0;
    shoppingEmpty.hidden = shoppingBuilt && shoppingList.children.length > 0;
  };
  const storageAvailable = () => {
    try {
      const exists = localStorage.getItem(storageKey) !== null;
      $('[data-meal-load]', root).disabled = !exists;
      $('[data-meal-delete]', root).disabled = !exists;
    } catch {
      $('[data-meal-load]', root).disabled = true;
      $('[data-meal-delete]', root).disabled = true;
    }
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const selectedDay = days.value;
      const selected = addPlannedMeal(meals, {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${idCounter++}`,
        date: selectedDay,
        type: $('[data-meal-type]', root).value,
        name: name.value,
        ingredients: ingredients.value.split(/\r?\n/u).map((item) => item.trim()).filter(Boolean),
      });
      meals.splice(0, meals.length, ...selected);
      form.reset();
      days.value = selectedDay;
      shoppingBuilt = false;
      shoppingList.replaceChildren();
      render();
      announce('Meal added to your week.');
      name.focus();
    } catch { announce('A meal needs a day, dish name and at least one ingredient.', true); }
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-meal-remove]');
    if (!button) return;
    const index = meals.findIndex(({ id }) => id === button.dataset.mealRemove);
    if (index < 0) return;
    meals.splice(index, 1);
    shoppingBuilt = false;
    shoppingList.replaceChildren();
    render();
    announce('Meal removed.');
  });
  $('[data-meal-build-list]', root).addEventListener('click', () => {
    shoppingList.replaceChildren();
    const items = buildShoppingList(meals);
    shoppingBuilt = items.length > 0;
    for (const ingredient of items) {
      const item = document.createElement('li');
      item.textContent = ingredient;
      shoppingList.append(item);
    }
    shoppingEmpty.hidden = items.length > 0;
    if (!items.length) announce('Add ingredients to your meals to build a list.', true);
  });
  $('[data-meal-save]', root).addEventListener('click', () => {
    try {
      localStorage.setItem(storageKey, serializeMealPlan(weekOf, meals));
      storageAvailable();
      announce('Plan saved on this device.');
    } catch { announce('Could not save the plan. Browser storage may be unavailable or full.', true); }
  });
  $('[data-meal-load]', root).addEventListener('click', () => {
    let raw;
    try { raw = localStorage.getItem(storageKey); }
    catch { announce('Could not load the plan.', true); return; }
    if (raw === null) return announce('No saved plan was found.', true);
    try {
      const loaded = validateMealPlan(raw);
      if (loaded.weekOf !== weekOf) throw new Error('The saved plan belongs to another week.');
      meals.splice(0, meals.length, ...loaded.meals);
      shoppingBuilt = false;
      shoppingList.replaceChildren();
      render();
      announce('Saved plan loaded.');
    } catch { announce('The plan could not be loaded.', true); }
  });
  $('[data-meal-delete]', root).addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); storageAvailable(); announce('Saved plan deleted.'); }
    catch { announce('Could not load the plan.', true); }
  });
  $('[data-meal-download]', root).addEventListener('click', () => {
    try {
      const blob = new Blob([serializeMealPlan(weekOf, meals)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `usefulverse-meal-plan-${weekOf}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce('Backup download started.');
    } catch { announce('Could not create the backup.', true); }
  });
  const fileInput = $('[data-meal-import]', root);
  $('[data-meal-import-trigger]', root).addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw new Error('Plan backup exceeds size limit.');
      const loaded = validateMealPlan(await file.text());
      if (loaded.weekOf !== weekOf) throw new Error('Backup belongs to another week.');
      meals.splice(0, meals.length, ...loaded.meals);
      shoppingBuilt = false;
      shoppingList.replaceChildren();
      render();
      announce('Plan backup imported.');
    } catch { announce('Choose a valid plan backup.', true); }
    finally { fileInput.value = ''; }
  });
  $('[data-meal-clear]', root).addEventListener('click', () => {
    meals.length = 0;
    shoppingBuilt = false;
    shoppingList.replaceChildren();
    render();
    announce('This week was cleared. Saved data was not deleted.');
  });
  storageAvailable();
  render();
}
