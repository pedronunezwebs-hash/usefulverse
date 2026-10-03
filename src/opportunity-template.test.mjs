import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunityToolMarkup } from './opportunity-template.mjs';

function cardAttributes(markup, fieldId) {
  const fieldIndex = markup.indexOf(`data-op-field="${fieldId}"`);
  assert.notEqual(fieldIndex, -1, `Expected field ${fieldId} in rendered markup`);
  const sectionStart = markup.lastIndexOf('<section class="calculator-card"', fieldIndex);
  const sectionEnd = markup.indexOf('>', sectionStart);
  return markup.slice(sectionStart, sectionEnd + 1);
}

test('conditional fields render in their default visible state before JavaScript initializes', () => {
  const bmi = opportunityToolMarkup('adult-bmi-calculator');
  assert.doesNotMatch(cardAttributes(bmi, 'heightCm'), /\shidden(?:\s|>)/u);
  assert.doesNotMatch(cardAttributes(bmi, 'weightKg'), /\shidden(?:\s|>)/u);
  assert.match(cardAttributes(bmi, 'heightFt'), /\shidden(?:\s|>)/u);

  const statistics = opportunityToolMarkup('statistical-test-calculator');
  assert.doesNotMatch(cardAttributes(statistics, 'sample'), /\shidden(?:\s|>)/u);
  assert.doesNotMatch(cardAttributes(statistics, 'mu0'), /\shidden(?:\s|>)/u);
  assert.match(cardAttributes(statistics, 'observed'), /\shidden(?:\s|>)/u);
});
