const rows = `H:Hydrogen|He:Helium|Li:Lithium|Be:Beryllium|B:Boron|C:Carbon|N:Nitrogen|O:Oxygen|F:Fluorine|Ne:Neon|Na:Sodium|Mg:Magnesium|Al:Aluminum|Si:Silicon|P:Phosphorus|S:Sulfur|Cl:Chlorine|Ar:Argon|K:Potassium|Ca:Calcium|Sc:Scandium|Ti:Titanium|V:Vanadium|Cr:Chromium|Mn:Manganese|Fe:Iron|Co:Cobalt|Ni:Nickel|Cu:Copper|Zn:Zinc|Ga:Gallium|Ge:Germanium|As:Arsenic|Se:Selenium|Br:Bromine|Kr:Krypton|Rb:Rubidium|Sr:Strontium|Y:Yttrium|Zr:Zirconium|Nb:Niobium|Mo:Molybdenum|Tc:Technetium|Ru:Ruthenium|Rh:Rhodium|Pd:Palladium|Ag:Silver|Cd:Cadmium|In:Indium|Sn:Tin|Sb:Antimony|Te:Tellurium|I:Iodine|Xe:Xenon|Cs:Cesium|Ba:Barium|La:Lanthanum|Ce:Cerium|Pr:Praseodymium|Nd:Neodymium|Pm:Promethium|Sm:Samarium|Eu:Europium|Gd:Gadolinium|Tb:Terbium|Dy:Dysprosium|Ho:Holmium|Er:Erbium|Tm:Thulium|Yb:Ytterbium|Lu:Lutetium|Hf:Hafnium|Ta:Tantalum|W:Tungsten|Re:Rhenium|Os:Osmium|Ir:Iridium|Pt:Platinum|Au:Gold|Hg:Mercury|Tl:Thallium|Pb:Lead|Bi:Bismuth|Po:Polonium|At:Astatine|Rn:Radon|Fr:Francium|Ra:Radium|Ac:Actinium|Th:Thorium|Pa:Protactinium|U:Uranium|Np:Neptunium|Pu:Plutonium|Am:Americium|Cm:Curium|Bk:Berkelium|Cf:Californium|Es:Einsteinium|Fm:Fermium|Md:Mendelevium|No:Nobelium|Lr:Lawrencium|Rf:Rutherfordium|Db:Dubnium|Sg:Seaborgium|Bh:Bohrium|Hs:Hassium|Mt:Meitnerium|Ds:Darmstadtium|Rg:Roentgenium|Cn:Copernicium|Nh:Nihonium|Fl:Flerovium|Mc:Moscovium|Lv:Livermorium|Ts:Tennessine|Og:Oganesson`.split('|');
const groupFor = (number) => number <= 2 ? (number === 1 ? 1 : 18)
  : number <= 4 ? number - 2
    : number <= 10 ? number + 8
      : number <= 12 ? number - 10
        : number <= 18 ? number
          : number <= 36 ? number - 18
            : number <= 54 ? number - 36
              : number <= 56 ? number - 54
                : number <= 71 ? 3
                  : number <= 86 ? number - 68
                    : number <= 88 ? number - 86
                      : number <= 103 ? 3 : number - 100;
const metalloids = new Set(['B','Si','Ge','As','Sb','Te','Po']);
const nonmetals = new Set(['H','C','N','O','P','S','Se']);
export const elements = Object.freeze(rows.map((row, index) => {
  const [symbol, name] = row.split(':'); const number = index + 1;
  const period = number <= 2 ? 1 : number <= 10 ? 2 : number <= 18 ? 3 : number <= 36 ? 4 : number <= 54 ? 5 : number <= 86 ? 6 : 7;
  const group = groupFor(number);
  const family = number >= 57 && number <= 71 ? 'Lanthanide' : number >= 89 && number <= 103 ? 'Actinide' : metalloids.has(symbol) ? 'Metalloid' : nonmetals.has(symbol) || group >= 17 ? 'Nonmetal' : 'Metal';
  return Object.freeze({ number, symbol, name, group, period, family });
}));

export function filterElements({ query = '', family = 'all', group = 'all' } = {}, translatedNames = {}) {
  const needle = normalize(query);
  return elements.filter((element) => {
    const name = translatedNames[element.name] || element.name;
    return (!needle || normalize(`${element.number} ${element.symbol} ${element.name} ${name}`).includes(needle))
      && (family === 'all' || element.family === family)
      && (group === 'all' || String(element.group) === String(group));
  });
}

export function compareElements(numbers) {
  if (!Array.isArray(numbers) || numbers.length < 2 || numbers.length > 3) throw new TypeError('Choose two or three elements to compare.');
  const unique = [...new Set(numbers.map(Number))];
  if (unique.length !== numbers.length) throw new TypeError('Choose different elements.');
  const selected = unique.map((number) => elements[number - 1]);
  if (selected.some((element) => !element)) throw new RangeError('Choose elements from 1 to 118.');
  return selected;
}

export function chooseQuizElement(random = Math.random) {
  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random source must return a value from 0 up to 1.');
  return elements[Math.floor(sample * elements.length)];
}

export function checkElementAnswer(element, answer) {
  return Boolean(element) && normalize(answer) === normalize(element.symbol);
}

function normalize(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/gu, '').trim().toLocaleLowerCase();
}
