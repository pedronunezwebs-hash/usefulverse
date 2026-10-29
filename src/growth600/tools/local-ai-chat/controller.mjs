import { createModelMessages, validateChatPrompt, stripModelReasoning, MAX_REPLY_TOKENS } from './logic.mjs';

const root = document.querySelector('[data-local-ai-chat]');

if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const status = root.querySelector('[data-status]');
  const messages = root.querySelector('[data-messages]');
  const form = root.querySelector('[data-chat-form]');
  const prompt = form.elements.namedItem('prompt');
  const loadButton = root.querySelector('[data-load-model]');
  const clearButton = root.querySelector('[data-clear-chat]');
  const downloadButton = root.querySelector('[data-download-chat]');
  const sendButton = root.querySelector('[data-send]');
  const stopButton = root.querySelector('[data-stop]');
  const modelId = 'Qwen3-0.6B-q4f16_1-MLC';
  const modelUrl = 'https://huggingface.co/mlc-ai/Qwen3-0.6B-q4f16_1-MLC/resolve/8c14ce481d4c692769976ad52afea453a102df19';
  const modelLib = 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/00fe7a40e57e5e8eb9fef87526a4bf28ad5846c0/web-llm-models/v0_2_86/base/Qwen3-0.6B-q4f16_1_cs1k-webgpu.wasm';
  const history = [];
  let engine;
  let generating = false;

  function announce(message, error = false) {
    status.textContent = message;
    status.classList.toggle('status--error', error);
    status.classList.toggle('status--success', Boolean(message) && !error);
  }

  function addMessage(role, text) {
    const item = document.createElement('li');
    item.className = `local-ai-chat__message local-ai-chat__message--${role}`;
    const heading = document.createElement('strong');
    heading.textContent = role === 'user' ? copy.fields.you : copy.fields.assistant;
    const body = document.createElement('p');
    body.textContent = text;
    item.append(heading, body);
    messages.append(item);
    item.scrollIntoView({ block: 'nearest' });
    downloadButton.disabled = false;
    return body;
  }

  loadButton.addEventListener('click', async () => {
    if (engine || loadButton.disabled) return;
    if (!globalThis.isSecureContext || !navigator.gpu) {
      announce(copy.messages.unsupported, true);
      return;
    }
    loadButton.disabled = true;
    try {
      announce(copy.messages.loading);
      const { CreateMLCEngine, prebuiltAppConfig } = await import('/assets/local-ai-chat/web-llm-0.2.86.mjs');
      const appConfig = {
        ...prebuiltAppConfig,
        model_list: [...prebuiltAppConfig.model_list, {
          model: modelUrl,
          model_id: modelId,
          model_lib: modelLib,
          vram_required_MB: 1000,
          low_resource_required: true,
          overrides: { context_window_size: 4096 },
        }],
      };
      engine = await CreateMLCEngine(modelId, {
        appConfig,
        initProgressCallback: ({ text, progress }) => {
          const percent = Math.max(0, Math.min(100, Math.round((progress ?? 0) * 100)));
          announce(copy.messages.downloading.replace('{percent}', String(percent)) + (text ? ` ${text}` : ''));
        },
      });
      prompt.disabled = false;
      sendButton.disabled = false;
      announce(copy.messages.ready);
      prompt.focus();
    } catch (error) {
      engine = undefined;
      loadButton.disabled = false;
      const message = String(error?.message ?? '');
      announce(message.includes('fetch') || message.includes('network') ? copy.messages.downloadFailed : copy.messages.loadFailed, true);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let question;
    try { question = validateChatPrompt(prompt.value); } catch (error) {
      announce(error.message === 'prompt-too-long' ? copy.messages.promptTooLong : copy.messages.emptyPrompt, true);
      return;
    }
    if (!engine || !question || generating) return;
    generating = true;
    clearButton.disabled = true;
    prompt.disabled = true;
    sendButton.disabled = true;
    stopButton.hidden = false;
    addMessage('user', question);
    history.push({ role: 'user', content: question });
    const answerNode = addMessage('assistant', '');
    try {
      const stream = await engine.chat.completions.create({
        messages: createModelMessages(history, copy.fields.systemPrompt),
        temperature: 0.7,
        top_p: 0.8,
        max_tokens: MAX_REPLY_TOKENS,
        extra_body: { enable_thinking: false },
        stream: true,
      });
      let rawAnswer = '';
      for await (const chunk of stream) {
        rawAnswer += chunk.choices[0]?.delta?.content ?? '';
        answerNode.textContent = stripModelReasoning(rawAnswer);
      }
      const answer = stripModelReasoning(rawAnswer).trim();
      answerNode.textContent = answer;
      history.push({ role: 'assistant', content: answer });
      if (!answer.trim()) answerNode.textContent = copy.messages.emptyReply;
      else announce(copy.messages.complete);
      prompt.value = '';
    } catch {
      history.pop();
      answerNode.textContent = copy.messages.generateFailed;
      announce(copy.messages.generateFailed, true);
    } finally {
      generating = false;
      clearButton.disabled = false;
      prompt.disabled = false;
      sendButton.disabled = false;
      stopButton.hidden = true;
      prompt.focus();
    }
  });

  stopButton.addEventListener('click', () => {
    if (!generating) return;
    engine?.interruptGenerate?.();
    announce(copy.messages.stopping);
  });

  clearButton.addEventListener('click', () => {
    if (generating) return;
    history.splice(0);
    messages.replaceChildren();
    downloadButton.disabled = true;
    prompt.value = '';
    announce(copy.messages.cleared);
  });

  downloadButton.addEventListener('click', () => {
    const text = [...messages.querySelectorAll('.local-ai-chat__message')]
      .map((item) => `${item.querySelector('strong').textContent}\n${item.querySelector('p').textContent}`)
      .join('\n\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    link.download = 'usefulverse-local-chat.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });
}
