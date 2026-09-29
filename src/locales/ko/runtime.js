(() => {
  // 숫자 한글 변환 (GLOSSARY §6.1). Line 1: reading, spaced by 만 units (한글 맞춤법 제44항), no 일 before
  // 십/백/천 or before a 만 group equal to 1, 일 always before 억; 0 = 영, negative = 마이너스.
  // Line 2 (positive only): contract/receipt amount, 일 before every unit and no spaces against tampering
  // (국립국어원: 금 일천이백만팔천삼백십원정 / 금일십일만삼천오백육십원). No digits: the pack test forbids them.
  const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const units = ['', '십', '백', '천'];
  const scales = ['', '만', '억'];
  const group = (n, formal) => {
    let text = '';
    for (let place = 3; place >= 0; place -= 1) {
      const digit = Math.floor(n / 10 ** place) % 10;
      if (digit) text += (digit === 1 && place && !formal ? '' : digits[digit]) + units[place];
    }
    return text;
  };
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return '영';
    const negative = value < 0n; const reading = []; const formal = [];
    for (let index = 0, rest = negative ? -value : value; rest; index += 1, rest /= 10000n) {
      const n = Number(rest % 10000n);
      if (!n) continue;
      reading.unshift(index === 1 && n === 1 ? '만' : group(n, false) + scales[index]);
      formal.unshift(group(n, true) + scales[index]);
    }
    return negative ? `마이너스 ${reading.join(' ')}` : `${reading.join(' ')}\n일금 ${formal.join('')}원정`;
  };

  // Slug tool (GLOSSARY §6.4): keep Hangul by default, otherwise a Korean title gives an empty slug.
  if (typeof document !== 'undefined' && document.querySelector) {
    const keepHangul = () => { const box = document.querySelector('#preserve-language'); if (box) box.checked = true; };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', keepHangul); else keepHangul();
  }
})();
