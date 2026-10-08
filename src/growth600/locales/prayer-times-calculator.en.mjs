export const prayerTimesCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Prayer Times Calculator',
  title: 'Prayer Times Calculator Free | UsefulVerse',
  description: 'Estimate daily prayer times from your date, coordinates and chosen calculation method. Free and local in your browser.',
  intro: 'Calculate an approximate daily schedule using a selected convention, coordinates and civil UTC offset. No account, location permission or upload.',
  howQuestion: 'How do I calculate prayer times for my location?',
  howAnswer: 'Enter the Gregorian date, latitude, longitude and the UTC offset used by the local civil clock on that date. Choose the calculation convention and Asr method used by your community. The calculator applies an approximate solar-position model locally; compare the result with a trusted local mosque or authority.',
  privacyQuestion: 'Does this calculator access or upload my location?',
  privacyAnswer: 'No. It does not request geolocation or send your coordinates anywhere. All calculations run locally in this browser.',
  fields: {
    date: 'Gregorian date', latitude: 'Latitude (−90 to 90)', longitude: 'Longitude (−180 to 180)', utcOffset: 'Local UTC offset in hours (include daylight saving)', method: 'Calculation convention',
    mwl: 'Muslim World League (MWL)', isna: 'Islamic Society of North America (ISNA)', egypt: 'Egyptian General Authority of Survey', makkah: 'Umm al-Qura (Makkah)', karachi: 'University of Islamic Sciences, Karachi', france: 'Muslims of France', russia: 'Spiritual Administration of Muslims of Russia', singapore: 'Islamic Religious Council of Singapore',
    asrMethod: 'Asr shadow method', standard: 'Standard (shadow factor 1)', hanafi: 'Hanafi (shadow factor 2)', highLatitudeMethod: 'High-latitude twilight fallback', angleBased: 'Angle-based', middleOfNight: 'Middle of the night', oneSeventh: 'One-seventh of the night', noAdjustment: 'No adjustment (show unavailable)', ramadan: 'Use the Makkah 120-minute Isha interval for Ramadan',
    accuracyNote: 'Approximate schedule, not an official timetable or religious ruling. Method, local convention and UTC offset affect results. For high-latitude dates with persistent twilight, the selected fallback is an estimate and will be marked. Confirm times with a trusted local authority. No automatic location lookup.',
  },
  actions: { calculate: 'Calculate times', reset: 'Reset', copy: 'Copy schedule', example: 'Load New York example', result: 'Estimated prayer times' },
  messages: {
    copied: 'Schedule copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimated times calculated.', checkInputs: 'Check the date, coordinates, UTC offset and options.', exampleLoaded: 'New York example loaded.',
    fajr: 'Fajr', sunrise: 'Sunrise', dhuhr: 'Dhuhr', asr: 'Asr', sunset: 'Sunset', maghrib: 'Maghrib', isha: 'Isha', unavailable: 'Unavailable for this date and location',
    highLatitudeAdjusted: 'High-latitude twilight estimate applied; verify it with a local authority.', methodLabel: 'Method', asrLabel: 'Asr method', offsetLabel: 'UTC offset',
  },
  additionalFaqs: [
    { question: 'Which calculation method should I choose?', answer: 'Use the convention followed by your local mosque or religious authority. Methods use different dawn and night-twilight parameters, so there is no single universal schedule.' },
    { question: 'Why can high-latitude prayer times be unavailable or estimated?', answer: 'At some dates and latitudes, the Sun does not reach the selected twilight angle, or does not rise or set. A selected fallback estimates missing twilight times; it is not an observed solar event and should be checked locally.' },
    { question: 'Does this provide an official or religiously authoritative timetable?', answer: 'No. This is an approximate astronomy-based calculator. Local authorities may apply different conventions, margins, coordinates or adjustments.' },
  ],
});
