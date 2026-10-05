import { buildAnimationCss, buildClipPathCss, buildFilterCss } from './css-design-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const say = (root, key) => {
  try { return JSON.parse(root.dataset.cssMessages || '{}')[key] ?? key; }
  catch { return key; }
};

export function setupCssDesignTool(root) {
  const ui = $('[data-css-design]', root);
  if (!ui) return;
  const kind = ui.dataset.cssDesign;
  const output = $('[data-css-output]', ui);
  const status = $('#op-status', ui);
  const message = (text, success = false) => { status.textContent = say(root, text); status.className = `tool-status${success ? ' is-success' : ''}`; };
  const update = () => {
    try {
      if (kind === 'animation') {
        const effect = $('[data-css-effect]', ui).value;
        const duration = $('[data-css-duration]', ui).value;
        const delay = $('[data-css-delay]', ui).value;
        const iterations = $('[data-css-count]', ui).value;
        const timing = $('[data-css-timing]', ui).value;
        output.value = buildAnimationCss({ effect, duration, delay, iterations, timing });
        $('[data-css-duration-value]', ui).value = `${duration} s`;
        $('[data-css-delay-value]', ui).value = `${delay} s`;
        const preview = $('[data-css-animation-preview]', ui);
        preview.style.animation = 'none';
        void preview.offsetWidth;
        preview.style.animation = `uv-${effect} ${duration}s ${timing} ${delay}s ${iterations}`;
      } else if (kind === 'clip-path') {
        const shape = $('[data-clip-shape]', ui).value;
        output.value = buildClipPathCss(shape);
        $('[data-clip-preview]', ui).style.clipPath = buildClipPathCss(shape).match(/clip-path: ([^;]+);/u)[1];
      } else {
        const values = Object.fromEntries([...ui.querySelectorAll('[data-filter]')].map((input) => [input.dataset.filter, input.value]));
        output.value = buildFilterCss(values);
        for (const input of ui.querySelectorAll('[data-filter]')) $(`[data-filter-value="${input.dataset.filter}"]`, ui).value = input.value;
        $('[data-filter-preview]', ui).style.filter = output.value.match(/filter: ([^;]+);/u)[1];
      }
    } catch { message('Check the selected values and try again.'); }
  };
  ui.addEventListener('input', update);
  ui.addEventListener('change', update);
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-css-replay]')) { update(); return; }
    if (!event.target.closest('[data-css-copy]')) return;
    try { await navigator.clipboard.writeText(output.value); message('CSS copied.', true); }
    catch { output.focus(); output.select(); message('Copy was blocked. Select the CSS and copy it manually.'); }
  });
  update();
}
