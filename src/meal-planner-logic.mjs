const MAX_MEALS = 100;
const MAX_NAME_LENGTH = 120;
const MAX_INGREDIENTS = 100;
const MAX_INGREDIENT_LENGTH = 200;
const MEAL_TYPES = new Set(['breakfast', 'lunch', 'dinner', 'snack']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;

export function validMealDate(value) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function normalizeText(value, maxLength, label) {
  if (typeof value !== 'string') throw new TypeError(`${label} must be text.`);
  const normalized = value.normalize('NFC').trim().replace(/\s+/gu, ' ');
  if (!normalized) throw new TypeError(`${label} cannot be empty.`);
  if ([...normalized].length > maxLength) throw new RangeError(`${label} is too long.`);
  return normalized;
}

export function createMeal({ id, date, type, name, ingredients }) {
  if (typeof id !== 'string' || !/^[\w-]{1,80}$/u.test(id)) throw new TypeError('Meal ID is invalid.');
  if (!validMealDate(date)) throw new TypeError('Choose a valid day.');
  if (!MEAL_TYPES.has(type)) throw new TypeError('Choose a valid meal type.');
  if (!Array.isArray(ingredients)) throw new TypeError('Enter ingredients as a list.');
  const cleanIngredients = ingredients.map((item) => normalizeText(item, MAX_INGREDIENT_LENGTH, 'Ingredient'));
  if (!cleanIngredients.length || cleanIngredients.length > MAX_INGREDIENTS) throw new RangeError('Add between 1 and 100 ingredients.');
  return { id, date, type, name: normalizeText(name, MAX_NAME_LENGTH, 'Dish name'), ingredients: cleanIngredients };
}

export function addPlannedMeal(meals, meal) {
  if (!Array.isArray(meals) || meals.length >= MAX_MEALS) throw new RangeError('A weekly plan can contain up to 100 meals.');
  const next = createMeal(meal);
  if (meals.some(({ id }) => id === next.id)) throw new TypeError('Meal IDs must be unique.');
  return [...meals, next].sort((a, b) => a.date.localeCompare(b.date) || a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
}

export function buildShoppingList(meals) {
  if (!Array.isArray(meals)) throw new TypeError('Meal list is invalid.');
  const seen = new Set();
  const result = [];
  for (const meal of meals) {
    for (const ingredient of meal.ingredients) {
      const clean = normalizeText(ingredient, MAX_INGREDIENT_LENGTH, 'Ingredient');
      const key = clean.normalize('NFC').toLocaleLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(clean);
    }
  }
  return result;
}

export function serializeMealPlan(weekOf, meals) {
  const validated = validateMealPlan({ version: 1, weekOf, meals });
  return JSON.stringify(validated, null, 2);
}

export function validateMealPlan(value) {
  const data = typeof value === 'string' ? JSON.parse(value) : value;
  if (!data || data.version !== 1 || !validMealDate(data.weekOf) || !Array.isArray(data.meals) || data.meals.length > MAX_MEALS) throw new TypeError('This is not a supported meal-plan backup.');
  const monday = new Date(`${data.weekOf}T12:00:00Z`);
  if (monday.getUTCDay() !== 1) throw new TypeError('A weekly plan must start on Monday.');
  const ids = new Set();
  const meals = data.meals.map((item) => {
    const meal = createMeal(item);
    if (ids.has(meal.id)) throw new TypeError('Meal IDs must be unique.');
    ids.add(meal.id);
    const day = (Date.parse(`${meal.date}T12:00:00Z`) - monday.valueOf()) / 86_400_000;
    if (!Number.isInteger(day) || day < 0 || day > 6) throw new TypeError('Meals must fall within the selected week.');
    return meal;
  });
  return { version: 1, weekOf: data.weekOf, meals };
}
