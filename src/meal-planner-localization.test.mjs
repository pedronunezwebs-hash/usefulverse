import test from 'node:test';
import assert from 'node:assert/strict';
import { locales } from './locales.mjs';
import { opportunityToolMarkup } from './opportunity-template.mjs';
import { opportunityTools } from './opportunity-tools.mjs';
import { mealPlannerContent } from './locales/meal-planner-content.mjs';
import { mealPlannerUiKeys } from './locales/meal-planner-source.mjs';

test('weekly meal planner localizes its full workflow in every active locale', () => {
  const tool = opportunityTools.find(({ id }) => id === 'weekly-meal-planner');
  assert.ok(tool);
  assert.equal(Object.keys(locales).length, 36);
  for (const language of Object.keys(locales)) {
    const content = mealPlannerContent(language);
    const markup = opportunityToolMarkup('weekly-meal-planner', language, content.ui, content.copy[0]);
    assert.equal(Object.keys(content.ui).length, mealPlannerUiKeys.length, `${language}: full UI key set`);
    assert.ok(content.copy.every((line) => line.trim()), `${language}: SEO copy exists`);
    for (const control of ['data-meal-form', 'data-meal-day', 'data-meal-type', 'data-meal-name', 'data-meal-ingredients', 'data-meal-list', 'data-meal-build-list', 'data-meal-save', 'data-meal-load', 'data-meal-delete', 'data-meal-download', 'data-meal-import', 'data-meal-clear']) {
      assert.ok(markup.includes(control), `${language}: ${control}`);
    }
    assert.match(markup, /data-meal-messages=/u, `${language}: runtime strings are embedded for this route only`);
  }
});
