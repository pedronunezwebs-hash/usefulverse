// Character positions follow the Unicode Mathematical Alphanumeric Symbols chart:
// https://www.unicode.org/Public/UCD/latest/charts/nameslist/1d400/
const mathematicalStyles = {
  bold: { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce },
  italic: { upper: 0x1d434, lower: 0x1d44e, exceptions: { h: 0x210e } },
  boldItalic: { upper: 0x1d468, lower: 0x1d482 },
  boldScript: { upper: 0x1d4d0, lower: 0x1d4ea },
  boldFraktur: { upper: 0x1d56c, lower: 0x1d586 },
  sans: { upper: 0x1d5a0, lower: 0x1d5ba, digit: 0x1d7e2 },
  sansBold: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },
  sansItalic: { upper: 0x1d608, lower: 0x1d622 },
  sansBoldItalic: { upper: 0x1d63c, lower: 0x1d656 },
  monospace: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
};

const exceptions = {
  script: {
    A: 0x1d49c, B: 0x212c, C: 0x1d49e, D: 0x1d49f, E: 0x2130, F: 0x2131,
    G: 0x1d4a2, H: 0x210b, I: 0x2110, J: 0x1d4a5, K: 0x1d4a6, L: 0x2112,
    M: 0x2133, N: 0x1d4a9, O: 0x1d4aa, P: 0x1d4ab, Q: 0x1d4ac, R: 0x211b,
    S: 0x1d4ae, T: 0x1d4af, U: 0x1d4b0, V: 0x1d4b1, W: 0x1d4b2, X: 0x1d4b3,
    Y: 0x1d4b4, Z: 0x1d4b5, a: 0x1d4b6, b: 0x1d4b7, c: 0x1d4b8, d: 0x1d4b9,
    e: 0x212f, f: 0x1d4bb, g: 0x210a, h: 0x1d4bd, i: 0x1d4be, j: 0x1d4bf,
    k: 0x1d4c0, l: 0x1d4c1, m: 0x1d4c2, n: 0x1d4c3, o: 0x2134, p: 0x1d4c5,
    q: 0x1d4c6, r: 0x1d4c7, s: 0x1d4c8, t: 0x1d4c9, u: 0x1d4ca, v: 0x1d4cb,
    w: 0x1d4cc, x: 0x1d4cd, y: 0x1d4ce, z: 0x1d4cf,
  },
  fraktur: {
    C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128,
    a: 0x1d51e, b: 0x1d51f, c: 0x1d520, d: 0x1d521, e: 0x1d522, f: 0x1d523,
    g: 0x1d524, h: 0x1d525, i: 0x1d526, j: 0x1d527, k: 0x1d528, l: 0x1d529,
    m: 0x1d52a, n: 0x1d52b, o: 0x1d52c, p: 0x1d52d, q: 0x1d52e, r: 0x1d52f,
    s: 0x1d530, t: 0x1d531, u: 0x1d532, v: 0x1d533, w: 0x1d534, x: 0x1d535,
    y: 0x1d536, z: 0x1d537,
  },
  doubleStruck: {
    C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124,
  },
};

const styleDefinitions = [
  ['bold', 'bold'], ['italic', 'italic'], ['boldItalic', 'boldItalic'],
  ['script', 'script'], ['boldScript', 'boldScript'], ['fraktur', 'fraktur'],
  ['boldFraktur', 'boldFraktur'], ['doubleStruck', 'doubleStruck'], ['sans', 'sans'],
  ['sansBold', 'sansBold'], ['sansItalic', 'sansItalic'],
  ['sansBoldItalic', 'sansBoldItalic'], ['monospace', 'monospace'],
];
const legacyStyleBases = {
  script: { upper: 0x1d49c, lower: 0x1d4b6 },
  fraktur: { upper: 0x1d504, lower: 0x1d51e },
  doubleStruck: { upper: 0x1d538, lower: 0x1d552 },
};

function mapCharacter(character, style) {
  if (style === 'circled') {
    const code = character.codePointAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + code - 97);
    if (character === '0') return String.fromCodePoint(0x24ea);
    if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
    return character;
  }
  if (style === 'script' || style === 'fraktur' || style === 'doubleStruck') {
    const code = exceptions[style][character];
    if (code) return String.fromCodePoint(code);
    const sourceCode = character.codePointAt(0);
    const bases = legacyStyleBases[style];
    if (sourceCode >= 65 && sourceCode <= 90) return String.fromCodePoint(bases.upper + sourceCode - 65);
    if (sourceCode >= 97 && sourceCode <= 122) return String.fromCodePoint(bases.lower + sourceCode - 97);
    return character;
  }
  const definition = mathematicalStyles[style];
  if (!definition) return character;
  const code = character.codePointAt(0);
  if (definition.exceptions?.[character]) return String.fromCodePoint(definition.exceptions[character]);
  if (code >= 65 && code <= 90) return String.fromCodePoint(definition.upper + code - 65);
  if (code >= 97 && code <= 122) return String.fromCodePoint(definition.lower + code - 97);
  if (definition.digit && code >= 48 && code <= 57) return String.fromCodePoint(definition.digit + code - 48);
  if (style === 'script') {
    const index = character >= 'A' && character <= 'Z' ? code - 65 : code - 97;
    return String.fromCodePoint((character >= 'A' && character <= 'Z' ? 0x1d49c : 0x1d4b6) + index);
  }
  if (style === 'fraktur') {
    const index = character >= 'A' && character <= 'Z' ? code - 65 : code - 97;
    return String.fromCodePoint((character >= 'A' && character <= 'Z' ? 0x1d504 : 0x1d51e) + index);
  }
  if (style === 'doubleStruck') {
    const index = character >= 'A' && character <= 'Z' ? code - 65 : code - 97;
    return String.fromCodePoint((character >= 'A' && character <= 'Z' ? 0x1d538 : 0x1d552) + index);
  }
  return character;
}

export function generateFancyText(input) {
  const text = String(input ?? '').normalize('NFC');
  if (!text.trim()) throw new RangeError('Enter text to create styled versions.');
  if (Array.from(text).length > 3000) throw new RangeError('Enter no more than 3,000 characters.');
  const rows = styleDefinitions.map(([id, style]) => ({ id, value: Array.from(text, (character) => mapCharacter(character, style)).join('') }));
  rows.push({ id: 'circled', value: Array.from(text, (character) => mapCharacter(character, 'circled')).join('') });
  return Object.freeze(rows.map((row) => Object.freeze(row)));
}

export const fancyTextStyleIds = Object.freeze([...styleDefinitions.map(([id]) => id), 'circled']);
