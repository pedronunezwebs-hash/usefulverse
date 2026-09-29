(() => {
  // 漢数字 (命数法, 4-digit groups 万・億・兆): no 一 before 十・百・千 inside a group (十, 百, 千, 千万),
  // always before a group word (一万, 一億); zero 零; negative マイナス.
  // 大字 line: only the legally prescribed 壱・弐・参・拾 (戸籍法施行規則31条, 商業登記規則48条, 公証人法37条),
  // with 壱 written before 拾・百・千 too (壱拾, 壱百, 壱千) as anti-tampering practice; 百・千・万・億 unchanged.
  const kanji = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const daiji = ['', '壱', '弐', '参', '四', '五', '六', '七', '八', '九'];
  const scales = ['', '万', '億', '兆'];
  const group = (n, formal) => { // 1..9999
    const digits = formal ? daiji : kanji; let text = '';
    for (const [unit, name] of [[1000, '千'], [100, '百'], [10, formal ? '拾' : '十']]) {
      const digit = Math.floor(n / unit) % 10;
      if (digit) text += (digit === 1 && !formal ? '' : digits[digit]) + name;
    }
    return text + digits[n % 10];
  };
  const words = (value, formal) => {
    if (value === 0n) return '零';
    let rest = value < 0n ? -value : value; let text = '';
    for (let index = 0; rest > 0n; index += 1, rest /= 10000n) {
      const part = Number(rest % 10000n);
      if (part) text = group(part, formal) + scales[index] + text;
    }
    return (value < 0n ? 'マイナス' : '') + text;
  };
  window.usefulverseLocale.numberToWords = (value) => `${words(value, false)}\n大字：${words(value, true)}`;

  // ponytail: the shared ui keys "From" (変換元, unit/time zone converters) and "Whole number" (整数, prime/kanji
  // tools) also label the percentage-change and share fields, where they read wrong. Relabel those two here
  // until src/template.mjs gives the percentage calculator its own keys; then delete this block.
  const relabel = (selector, text) => {
    const node = typeof document === 'undefined' ? null : document.querySelector(selector);
    if (node?.firstChild) node.firstChild.textContent = text;
  };
  relabel('label[for="percent-old"]', '変化前 ');
  relabel('label[for="percent-whole"] .sr-only', '全体の数');

  // ponytail: src/app.js reads these fields without NFKC (or, for 漢数字, without the IME's ー/− as minus), so
  // IME input such as ３０, ー30, ＦＦ or Ⅻ failed. Normalize them in the capture phase, before app.js's click
  // handler on .tool-workspace. #date-offset gets a full keyboard: the iOS numeric pad has no minus key for 〇日前.
  // Delete once app.js normalizes these inputs itself (GLOSSARY §7).
  if (typeof document !== 'undefined' && document.addEventListener) {
    const imeFields = ['date-offset', 'words-number', 'timestamp-unix', 'binary-input', 'roman-input'];
    document.addEventListener('click', (event) => {
      if (!event.target.closest?.('[data-action]')) return;
      for (const id of imeFields) {
        const input = document.getElementById(id);
        if (input) input.value = input.value.normalize('NFKC').trim().replace(/^[ー−‐―–]/u, '-');
      }
    }, true);
    document.addEventListener('DOMContentLoaded', () => {
      const offset = document.getElementById('date-offset');
      if (offset) offset.inputMode = 'text';
    });
  }
})();
