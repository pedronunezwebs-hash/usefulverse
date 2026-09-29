(() => {
  // Terbilang (EYD V): "se-" only for 10, 11, 100 and a thousands group of exactly 1 (seribu); juta/miliar keep "satu".
  const digits = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const underHundred = (n) => {
    if (n < 10) return digits[n];
    if (n === 10) return 'sepuluh';
    if (n === 11) return 'sebelas';
    if (n < 20) return `${digits[n % 10]} belas`;
    return `${digits[Math.floor(n / 10)]} puluh${n % 10 ? ` ${digits[n % 10]}` : ''}`;
  };
  const underThousand = (n) => {
    const hundreds = Math.floor(n / 100); const rest = n % 100;
    const head = hundreds === 0 ? '' : hundreds === 1 ? 'seratus' : `${digits[hundreds]} ratus`;
    return [head, rest ? underHundred(rest) : ''].filter(Boolean).join(' ');
  };
  const scales = ['', 'ribu', 'juta', 'miliar'];
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return 'nol';
    let rest = value < 0n ? -value : value; const words = [];
    for (let index = 0; rest > 0n; index += 1, rest /= 1000n) {
      const group = Number(rest % 1000n);
      if (!group) continue;
      words.unshift(index === 1 && group === 1 ? 'seribu' : [underThousand(group), scales[index]].filter(Boolean).join(' '));
    }
    return `${value < 0n ? 'minus ' : ''}${words.join(' ')}`;
  };
})();
