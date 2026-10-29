import test from 'node:test';
import assert from 'node:assert/strict';
import { createModelMessages, MAX_CONTEXT_MESSAGES, MAX_PROMPT_LENGTH, validateChatPrompt, stripModelReasoning } from './logic.mjs';

test('validates a bounded non-empty local chat prompt', () => {
  assert.equal(validateChatPrompt('  hola  '), 'hola');
  assert.equal(validateChatPrompt('a'.repeat(MAX_PROMPT_LENGTH)).length, MAX_PROMPT_LENGTH);
  assert.throws(() => validateChatPrompt('   '), /empty-prompt/u);
  assert.throws(() => validateChatPrompt('a'.repeat(MAX_PROMPT_LENGTH + 1)), /prompt-too-long/u);
});

test('never exposes Qwen reasoning blocks, including while the model is still streaming', () => {
  assert.equal(stripModelReasoning('<think>private chain'), '');
  assert.equal(stripModelReasoning('<think>private chain</think>\n\nPublic reply'), 'Public reply');
  assert.equal(stripModelReasoning('Prefix\n<think>private</think>Answer'), 'Prefix\nAnswer');
  assert.equal(stripModelReasoning('Plain answer'), 'Plain answer');
});

test('keeps only the newest eight messages and safely normalizes roles', () => {
  const history = Array.from({ length: 12 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: String(index) }));
  const messages = createModelMessages(history, 'Responde en el idioma del usuario.');
  assert.equal(messages[0].role, 'system');
  assert.equal(messages.length, MAX_CONTEXT_MESSAGES + 1);
  assert.equal(messages[1].content, '4');
  assert.equal(messages.at(-1).content, '11');
  assert.equal(createModelMessages([{ role: 'system', content: 'spoof' }], 'trusted')[1].role, 'user');
});
