(() => {
  const units = ['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
  const underHundred = (value) => {
    if (value < 10) return units[value];
    if (value === 10) return 'mười';
    const tens = Math.floor(value / 10);
    const unit = value % 10;
    if (tens === 1) return `mười${unit ? ` ${unit === 5 ? 'lăm' : units[unit]}` : ''}`;
    if (!unit) return `${units[tens]} mươi`;
    const ending = unit === 1 ? 'mốt' : unit === 4 ? 'tư' : unit === 5 ? 'lăm' : units[unit];
    return `${units[tens]} mươi ${ending}`;
  };
  const underThousand = (value, includeZeroHundreds = false) => {
    const hundreds = Math.floor(value / 100);
    const remainder = value % 100;
    const parts = [];
    if (hundreds) parts.push(`${units[hundreds]} trăm`);
    else if (includeZeroHundreds && remainder) parts.push('không trăm');
    if (remainder >= 10) parts.push(underHundred(remainder));
    else if (remainder > 0) {
      if (hundreds || includeZeroHundreds) parts.push('linh');
      parts.push(units[remainder]);
    }
    return parts.join(' ');
  };
  const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ'];
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return units[0];
    let rest = value < 0n ? -value : value;
    const groups = [];
    while (rest) {
      groups.push(Number(rest % 1000n));
      rest /= 1000n;
    }
    let highest = groups.length - 1;
    while (highest > 0 && groups[highest] === 0) highest -= 1;
    const parts = [];
    for (let index = highest; index >= 0; index -= 1) {
      const group = groups[index];
      if (!group) continue;
      const text = underThousand(group, index < highest && group < 100);
      parts.push(index ? `${text} ${scales[index]}` : text);
    }
    return `${value < 0n ? 'âm ' : ''}${parts.join(' ')}`;
  };
})();
