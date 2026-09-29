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

})();
