(() => {
  const unit = ['','واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة'];
  const teens = ['عشرة','أحد عشر','اثنا عشر','ثلاثة عشر','أربعة عشر','خمسة عشر','ستة عشر','سبعة عشر','ثمانية عشر','تسعة عشر'];
  const tens = ['','','عشرون','ثلاثون','أربعون','خمسون','ستون','سبعون','ثمانون','تسعون'];
  const hundreds = ['','مائة','مائتان','ثلاثمائة','أربعمائة','خمسمائة','ستمائة','سبعمائة','ثمانمائة','تسعمائة'];
  const underHundred = (n) => n < 10 ? unit[n] : n < 20 ? teens[n - 10] : n % 10 ? `${unit[n % 10]} و${tens[Math.floor(n / 10)]}` : tens[n / 10];
  const underThousand = (n) => {
    const h = Math.floor(n / 100), rest = n % 100;
    return h && rest ? `${hundreds[h]} و${underHundred(rest)}` : h ? hundreds[h] : underHundred(rest);
  };
  const scales = [[1000000000n,'مليار','ملياران','مليارات','مليارًا'],[1000000n,'مليون','مليونان','ملايين','مليونًا'],[1000n,'ألف','ألفان','آلاف','ألفًا']];
  const scaleWords = (n, forms) => n === 1 ? forms[0] : n === 2 ? forms[1] : n <= 10 ? `${underThousand(n)} ${forms[2]}` : `${underThousand(n)} ${n % 100 === 0 ? forms[0] : forms[3]}`;
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return 'صفر';
    let rest = value < 0n ? -value : value;
    const parts = [];
    for (const [size, ...forms] of scales) {
      const count = Number(rest / size); rest %= size;
      if (count) parts.push(scaleWords(count, forms));
    }
    if (rest) parts.push(underThousand(Number(rest)));
    return `${value < 0n ? 'سالب ' : ''}${parts.join(' و')}`;
  };
})();
