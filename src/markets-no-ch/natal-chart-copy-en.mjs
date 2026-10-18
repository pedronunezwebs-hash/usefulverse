const f = Object.freeze({
  date: 'Birth date', time: 'Birth time', latitude: 'Latitude', longitude: 'Longitude', timezone: 'Time zone',
  calculate: 'Calculate chart', ready: 'Enter birth details to calculate a local chart.', loading: 'Calculating chart…', complete: 'Chart calculated. Astrology is for reflection, not science.',
  invalid: 'Check the date, time and coordinates.', invalidDate: 'Enter a valid calendar date.', invalidTimeZone: 'Choose a valid time zone.',
  dateRange: 'Use a date from 1800 through 2200.', coordinateRange: 'Latitude must be −90 to 90 and longitude −180 to 180.',
  dstGap: 'That local time does not exist because the clocks moved forward.', dstFold: 'That local time occurs twice because the clocks moved back.',
  dstOffset: 'The time-zone offset was resolved for this birth date.', offsetMismatch: 'The selected offset does not match the time zone on this date.',
  planetNames: ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'], signs: ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'],
  signTraits: ['initiative','stability','curiosity','care','expression','craft','balance','focus','exploration','discipline','originality','imagination'],
  degree: '°', direct: 'Direct', retrograde: 'Retrograde', ascendant: 'Ascendant', ascendantShort: 'ASC', midheaven: 'Midheaven', sunRole: 'Sun', moonRole: 'Moon', ascendantRole: 'Ascendant', chartAlt: 'Astrology chart wheel', libraryError: 'The astronomy library could not load. Check your connection and retry.',
});
export const natalChartEnglish = Object.freeze({
  name: 'Natal Chart Calculator', title: 'Natal Chart Calculator — Free Birth Chart',
  description: 'Calculate an astrology chart from a birth date, time and location in your browser.',
  intro: 'Enter the birth details and time zone to calculate planetary positions, ascendant and midheaven.',
  example: 'Results depend on the date, local time, time zone and coordinates you enter.',
  details: 'The chart is calculated on this device with an astronomy library. Your birth details are not uploaded.',
  limits: 'Astrology is a cultural and symbolic practice, not a scientific assessment or prediction. Coordinates and time zone must be accurate.',
  faq: [], fields: f,
});
