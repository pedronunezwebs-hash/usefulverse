(() => {
  // Urdu cardinal spellings 0–99 use the irregular traditional forms; larger values use South Asian scales.
  const words = ('صفر ایک دو تین چار پانچ چھ سات آٹھ نو '
    + 'دس گیارہ بارہ تیرہ چودہ پندرہ سولہ سترہ اٹھارہ انیس '
    + 'بیس اکیس بائیس تئیس چوبیس پچیس چھبیس ستائیس اٹھائیس انتیس '
    + 'تیس اکتیس بتیس تینتیس چونتیس پینتیس چھتیس سینتیس اڑتیس انتالیس '
    + 'چالیس اکتالیس بیالیس تینتالیس چوالیس پینتالیس چھیالیس سینتالیس اڑتالیس انچاس '
    + 'پچاس اکیاون باون ترپن چوّن پچپن چھپن ستاون اٹھاون انسٹھ '
    + 'ساٹھ اکسٹھ باسٹھ تریسٹھ چونسٹھ پینسٹھ چھیاسٹھ سڑسٹھ اڑسٹھ انہتر '
    + 'ستر اکہتر بہتر تہتر چوہتر پچہتر چھہتر ستتر اٹھہتر اناسی '
    + 'اسی اکیاسی بیاسی تراسی چوراسی پچاسی چھیاسی ستاسی اٹھاسی نواسی '
    + 'نوے اکیانوے بانوے ترانوے چورانوے پچانوے چھیانوے ستانوے اٹھانوے ننانوے').split(' ');
  const scales = [[100000000000n, 'کھرب'], [1000000000n, 'ارب'], [10000000n, 'کروڑ'], [100000n, 'لاکھ'], [1000n, 'ہزار']];
  const underThousand = (value) => {
    const parts = [];
    if (value >= 100) { parts.push(words[Math.floor(value / 100)] + ' سو'); value %= 100; }
    if (value) parts.push(words[value]);
    return parts.join(' ');
  };
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return words[0];
    let rest = value < 0n ? -value : value;
    const parts = [];
    for (const [size, name] of scales) {
      const count = rest / size;
      rest %= size;
      if (count) parts.push(underThousand(Number(count)) + ' ' + name);
    }
    if (rest) parts.push(underThousand(Number(rest)));
    return (value < 0n ? 'منفی ' : '') + parts.join(' ');
  };
})();
