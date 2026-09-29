(() => {
  // Russian cardinal numerals with gender agreement for тысяч and correct one/few/many scale forms.
  const units = ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
  const underThousand = (value, feminine = false) => {
    const parts = [];
    if (value >= 100) { parts.push(hundreds[Math.floor(value / 100)]); value %= 100; }
    if (value >= 10 && value < 20) parts.push(teens[value - 10]);
    else if (value >= 20) {
      parts.push(tens[Math.floor(value / 10)]);
      value %= 10;
      if (value) parts.push(feminine && value === 1 ? 'одна' : feminine && value === 2 ? 'две' : units[value]);
    } else if (value) parts.push(feminine && value === 1 ? 'одна' : feminine && value === 2 ? 'две' : units[value]);
    return parts.join(' ');
  };
  const scaleForm = (count, one, few, many) => {
    const lastTwo = count % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return many;
    const last = count % 10;
    return last === 1 ? one : last >= 2 && last <= 4 ? few : many;
  };
  const scales = [
    [1000000000n, 'миллиард', 'миллиарда', 'миллиардов', false],
    [1000000n, 'миллион', 'миллиона', 'миллионов', false],
    [1000n, 'тысяча', 'тысячи', 'тысяч', true],
  ];
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return units[0];
    let rest = value < 0n ? -value : value;
    const parts = [];
    for (const [size, one, few, many, feminine] of scales) {
      const count = Number(rest / size);
      rest %= size;
      if (count) parts.push(underThousand(count, feminine) + ' ' + scaleForm(count, one, few, many));
    }
    if (rest) parts.push(underThousand(Number(rest)));
    return (value < 0n ? 'минус ' : '') + parts.join(' ');
  };
})();
