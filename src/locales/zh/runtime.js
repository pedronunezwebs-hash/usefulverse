(() => {
  const digits = ['零','一','二','三','四','五','六','七','八','九'];
  const smallUnits = ['', '十', '百', '千'];
  const groupWords = (value, omitLeadingTen = false) => {
    let result = '', zero = false;
    for (let place = 3; place >= 0; place--) {
      const digit = Math.floor(value / (10 ** place)) % 10;
      if (!digit) { if (result && value % (10 ** place) !== 0) zero = true; continue; }
      if (zero) result += '零';
      zero = false;
      if (!(place === 1 && digit === 1 && result === '' && omitLeadingTen)) result += digits[digit];
      result += smallUnits[place];
    }
    return result;
  };
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return '零';
    const negative = value < 0n;
    let rest = negative ? -value : value;
    const groups = [];
    while (rest > 0n) { groups.push(Number(rest % 10000n)); rest /= 10000n; }
    const units = ['', '万', '亿'];
    const topIndex = groups.length - 1;
    let output = '', pendingZero = false;
    for (let index = topIndex; index >= 0; index--) {
      const group = groups[index];
      if (!group) { if (output) pendingZero = true; continue; }
      if (output && (pendingZero || group < 1000)) output += '零';
      output += groupWords(group, index === topIndex && group >= 10 && group < 20) + (units[index] ?? '');
      pendingZero = false;
    }
    return `${negative ? '负' : ''}${output}`;
  };
})();
