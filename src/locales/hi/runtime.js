(() => {
  // Hindi cardinals, Indian system (Unicode CLDR hi spellout-cardinal; spellings per GLOSSARY.md §7):
  // खरब 10^11, अरब 10^9, करोड़ 10^7, लाख 10^5, हज़ार 10^3, सौ 10^2; the multiplier is always said (एक सौ, एक हज़ार).
  const words = ('शून्य एक दो तीन चार पाँच छह सात आठ नौ '
    + 'दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस '
    + 'बीस इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस '
    + 'तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस '
    + 'चालीस इकतालीस बयालीस तैंतालीस चौवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास '
    + 'पचास इक्यावन बावन तिरेपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ '
    + 'साठ इकसठ बासठ तिरेसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर '
    + 'सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उनासी '
    + 'अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी नवासी '
    + 'नब्बे इक्यानवे बानवे तिरानवे चौरानवे पचानवे छियानवे सत्तानवे अट्ठानवे निन्यानवे').split(' ');
  const scales = [[100000000000n, 'खरब'], [1000000000n, 'अरब'], [10000000n, 'करोड़'], [100000n, 'लाख'], [1000n, 'हज़ार'], [100n, 'सौ']];
  window.usefulverseLocale.numberToWords = (value) => {
    if (value === 0n) return words[0];
    let rest = value < 0n ? -value : value; const parts = [];
    for (const [size, name] of scales) {
      const count = rest / size; rest %= size;
      if (count) parts.push(`${words[Number(count)]} ${name}`);
    }
    if (rest) parts.push(words[Number(rest)]);
    return `${value < 0n ? 'ऋण ' : ''}${parts.join(' ')}`;
  };
})();
// Input fixes that shared app.js lacks (reported as infra): Hindi InScript keyboards type ०-९, which
// Number() rejects, so numeric fields get Latin digits; home search matches with or without the nukta
// (फुट finds फ़ुट) and with precomposed फ़/ज़ (NFC splits them like the pack stores them).
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  for (const card of document.querySelectorAll('[data-search]')) card.dataset.search += ` ${card.dataset.search.replace(/़/gu, '')}`;
  document.addEventListener('input', (event) => {
    const field = event.target;
    if (event.isComposing || typeof field?.value !== 'string') return;
    const numeric = field.inputMode === 'decimal' || field.inputMode === 'numeric' || field.id === 'average-input';
    const fixed = field.id === 'tool-search' ? field.value.normalize('NFC')
      : numeric ? field.value.replace(/[०-९]/gu, (digit) => digit.charCodeAt(0) - 0x966) : field.value;
    if (fixed === field.value) return;
    const caret = fixed.length - (field.value.length - (field.selectionEnd ?? field.value.length));
    field.value = fixed;
    field.setSelectionRange?.(caret, caret);
  }, true);
}
