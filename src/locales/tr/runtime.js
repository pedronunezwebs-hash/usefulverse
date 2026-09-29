(() => {
  const units = ['sıfır','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'];
  const tens = ['','','yirmi','otuz','kırk','elli','altmış','yetmiş','seksen','doksan'];
  const underThousand = (value) => {
    const parts = [];
    if (value >= 100) {
      const hundreds = Math.floor(value / 100);
      parts.push(hundreds === 1 ? 'yüz' : `${units[hundreds]} yüz`);
      value %= 100;
    }
    if (value >= 10 && value < 20) parts.push(value === 10 ? 'on' : `on ${units[value - 10]}`);
    else if (value >= 20) {
      parts.push(tens[Math.floor(value / 10)]);
      value %= 10;
      if (value) parts.push(units[value]);
    } else if (value) parts.push(units[value]);
    return parts.join(' ');
  };
  const scales = [[1000000000n,'milyar'],[1000000n,'milyon'],[1000n,'bin']];
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return units[0];
    let rest = value < 0n ? -value : value;
    const parts = [];
    for (const [size, name] of scales) {
      const count = Number(rest / size);
      rest %= size;
      if (!count) continue;
      if (size === 1000n && count === 1) parts.push('bin');
      else parts.push(`${underThousand(count)} ${name}`);
    }
    if (rest) parts.push(underThousand(Number(rest)));
    return `${value < 0n ? 'eksi ' : ''}${parts.join(' ')}`;
  };
})();
