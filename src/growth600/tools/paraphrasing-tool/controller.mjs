import { MAX_OUTPUT_TOKENS, validateParaphraseSource, validateParaphraseStyle } from './logic.mjs';
import { stripModelReasoning } from '../local-ai-chat/logic.mjs';

const root = document.querySelector('[data-paraphraser]');

if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const status = root.querySelector('[data-status]');
  const form = root.querySelector('[data-paraphraser-form]');
  const source = form.elements.namedItem('source');
  const style = form.elements.namedItem('style');
  const length = root.querySelector('[data-length]');
  const output = root.querySelector('[data-output]');
  const loadButton = root.querySelector('[data-load-model]');
  const rewriteButton = root.querySelector('[data-rewrite]');
  const copyButton = root.querySelector('[data-copy]');
  const stopButton = root.querySelector('[data-stop]');
  const modelId = 'Qwen3-0.6B-q4f16_1-MLC';
  const modelUrl = 'https://huggingface.co/mlc-ai/Qwen3-0.6B-q4f16_1-MLC/resolve/8c14ce481d4c692769976ad52afea453a102df19';
  const modelLib = 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/00fe7a40e57e5e8eb9fef87526a4bf28ad5846c0/web-llm-models/v0_2_86/base/Qwen3-0.6B-q4f16_1_cs1k-webgpu.wasm';
  const styleInstructions = { clear: 'clear and natural', formal: 'formal and professional', friendly: 'warm and conversational', concise: 'concise but preserve every important fact' };
  let engine;
  let requestId = 0;
  let generating = false;

  function announce(message, error = false) {
    status.textContent = message;
    status.classList.toggle('status--error', error);
    status.classList.toggle('status--success', Boolean(message) && !error);
  }

  function resetResult() {
    output.value = '';
    copyButton.disabled = true;
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
        initProgressCallback: ({ progress }) => {
          announce(copy.messages.downloading.replace('{percent}', String(Math.max(0, Math.min(100, Math.round((progress ?? 0) * 100))))));
        },
      });
      source.disabled = false;
      style.disabled = false;
      rewriteButton.disabled = false;
      announce(copy.messages.ready);
      source.focus();
    } catch (error) {
      engine = undefined;
      loadButton.disabled = false;
      const message = String(error?.message ?? '');
      announce(message.includes('fetch') || message.includes('network') ? copy.messages.downloadFailed : copy.messages.loadFailed, true);
    }
  });

  source.addEventListener('input', () => {
    length.textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(source.value.length);
    resetResult();
  });
  style.addEventListener('change', resetResult);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!engine || generating) return;
    let text;
    let selectedStyle;
    try {
      text = validateParaphraseSource(source.value);
      selectedStyle = validateParaphraseStyle(style.value);
    } catch (error) {
      announce(error.message === 'source-too-long' ? copy.messages.sourceTooLong : error.message === 'invalid-style' ? copy.messages.invalidStyle : copy.messages.emptySource, true);
      return;
    }
    const thisRequest = ++requestId;
    generating = true;
    source.disabled = true;
    style.disabled = true;
    rewriteButton.disabled = true;
    stopButton.hidden = false;
    resetResult();
    try {
      const stream = await engine.chat.completions.create({
        messages: [{ role: 'system', content: copy.fields.systemPrompt.replace('{style}', styleInstructions[selectedStyle]) }, { role: 'user', content: text }],
        temperature: 0.7,
        top_p: 0.8,
        max_tokens: MAX_OUTPUT_TOKENS,
        extra_body: { enable_thinking: false },
        stream: true,
      });
      let raw = '';
      for await (const chunk of stream) {
        raw += chunk.choices[0]?.delta?.content ?? '';
        if (thisRequest === requestId) output.value = stripModelReasoning(raw);
      }
      const result = stripModelReasoning(raw).trim();
      if (thisRequest !== requestId) return;
      output.value = result;
      copyButton.disabled = !result;
      announce(result ? copy.messages.complete : copy.messages.emptyResult, !result);
    } catch {
      if (thisRequest === requestId) announce(copy.messages.failed, true);
    } finally {
      if (thisRequest === requestId) {
        generating = false;
        source.disabled = false;
        style.disabled = false;
        rewriteButton.disabled = false;
        stopButton.hidden = true;
        source.focus();
      }
    }
  });

  stopButton.addEventListener('click', () => {
    if (!generating) return;
    requestId += 1;
    engine?.interruptGenerate?.();
    generating = false;
    source.disabled = false;
    style.disabled = false;
    rewriteButton.disabled = false;
    stopButton.hidden = true;
    announce(copy.messages.stopped);
  });

  form.addEventListener('reset', () => {
    if (generating) {
      requestId += 1;
      engine?.interruptGenerate?.();
      generating = false;
    }
    queueMicrotask(() => {
      output.value = '';
      copyButton.disabled = true;
      source.disabled = !engine;
      style.disabled = !engine;
      rewriteButton.disabled = !engine;
      stopButton.hidden = true;
      length.textContent = '0';
      announce(copy.messages.cleared);
    });
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      announce(copy.messages.copied);
    } catch {
      announce(copy.messages.copyFailed, true);
    }
  });
}
