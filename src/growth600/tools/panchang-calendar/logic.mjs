import { EclipticGeoMoon, Observer, SearchRiseSet, SunPosition, Body } from 'astronomy-engine';

const TITHI_COUNT = 30;
const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const YOGAS = ['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyana','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti'];
const MOVABLE_KARANAS = ['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti'];
const norm = (degrees) => ((degrees % 360) + 360) % 360;
const finite = (value, label, min, max) => {
  const number = Number(value);
  if (value === '' || !Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} is outside the supported range.`);
  return number;
};

function localNoonUtc(dateText, timeZone) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(dateText))) throw new RangeError('Choose a valid local date.');
  const [year, month, day] = dateText.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day, 12);
  if (new Date(target).toISOString().slice(0, 10) !== dateText) throw new RangeError('Choose a valid local date.');
  let instant = target;
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    for (let attempt = 0; attempt < 4; attempt++) {
      const values = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(({ type, value }) => [type, value]));
      const represented = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second));
      instant += target - represented;
    }
    const check = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(instant));
    const values = Object.fromEntries(check.map(({ type, value }) => [type, value]));
    if (`${values.year}-${values.month}-${values.day}` !== dateText || Number(values.hour) !== 12) throw new Error('Local noon could not be resolved.');
    return instant;
  } catch { throw new RangeError('Enter a valid IANA time zone, such as Asia/Kolkata.'); }
}

export function calculatePanchangSnapshot({ date, latitude, longitude, timeZone = 'Asia/Kolkata' } = {}) {
  const lat = finite(latitude, 'Latitude', -90, 90);
  const lon = finite(longitude, 'Longitude', -180, 180);
  const noon = localNoonUtc(date, timeZone);
  const observer = new Observer(lat, lon, 0);
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, new Date(noon - 18 * 60 * 60_000), 1, 0);
  if (!sunrise) throw new RangeError('The Sun does not rise at this location on the selected local date.');

  const sunTropical = norm(SunPosition(sunrise).elon);
  const moonTropical = norm(EclipticGeoMoon(sunrise).lon);
  const yearStart = Date.UTC(sunrise.date.getUTCFullYear(), 0, 1);
  const yearFraction = (sunrise.date.getTime() - yearStart) / (Date.UTC(sunrise.date.getUTCFullYear() + 1, 0, 1) - yearStart);
  const lahiriApprox = 23.8531 + (sunrise.date.getUTCFullYear() + yearFraction - 2000) * 0.0139694;
  const sunSidereal = norm(sunTropical - lahiriApprox);
  const moonSidereal = norm(moonTropical - lahiriApprox);
  const lunarElongation = norm(moonTropical - sunTropical);
  const tithiIndex = Math.min(TITHI_COUNT - 1, Math.floor(lunarElongation / 12));
  const halfTithi = Math.min(59, Math.floor(lunarElongation / 6));
  const karana = halfTithi === 0 ? 'Kimstughna'
    : halfTithi === 57 ? 'Shakuni'
    : halfTithi === 58 ? 'Chatushpada'
    : halfTithi === 59 ? 'Naga'
    : MOVABLE_KARANAS[(halfTithi - 1) % 7];
  const nakshatraIndex = Math.floor(moonSidereal / (360 / 27));
  const yogaIndex = Math.floor(norm(sunSidereal + moonSidereal) / (360 / 27));
  return Object.freeze({
    localDate: date, timeZone, latitude: lat, longitude: lon, sunriseUtc: sunrise.date.toISOString(),
    tithiNumber: (tithiIndex % 15) + 1, paksha: tithiIndex < 15 ? 'bright' : 'dark',
    nakshatra: NAKSHATRAS[nakshatraIndex], yoga: YOGAS[yogaIndex], karana,
    ayanamsaDegrees: Math.round(lahiriApprox * 1000) / 1000,
  });
}
