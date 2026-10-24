export const MAX_PROMPT_LENGTH = 2000;
export const MAX_CONTEXT_MESSAGES = 8;
export const MAX_REPLY_TOKENS = 512;

export function validateChatPrompt(value) {
  const prompt = String(value ?? '').trim();
  if (!prompt) throw new Error('empty-prompt');
  if (prompt.length > MAX_PROMPT_LENGTH) throw new Error('prompt-too-long');
  return prompt;
}

export function createModelMessages(history, systemPrompt) {
  const messages = Array.isArray(history) ? history : [];
  return [
    { role: 'system', content: String(systemPrompt ?? '') },
    ...messages.slice(-MAX_CONTEXT_MESSAGES).map(({ role, content }) => ({
      role: role === 'assistant' ? 'assistant' : 'user',
      content: String(content ?? ''),
    })),
  ];
}

export function stripModelReasoning(value) {
  const text = String(value ?? '');
  const start = text.indexOf('<think>');
  if (start < 0) return text;
  const end = text.indexOf('</think>', start + 7);
  if (end < 0) return text.slice(0, start);
  return `${text.slice(0, start)}${text.slice(end + 8).replace(/^\s+/u, '')}`;
}
