export const julianDateConverterEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Julian Date Converter',
  title: 'Julian Date Converter — Free JD & MJD Tool | UsefulVerse',
  description: 'Convert UTC dates to Julian Date (JD) and Modified Julian Date (MJD), or convert JD/MJD back to UTC. Free, instant, no account.',
  intro: 'Convert a Gregorian UTC date and time to Julian Date and Modified Julian Date, or turn a JD/MJD value back into UTC. This lightweight calculator runs locally in your browser.',
  howQuestion: 'How do I convert a UTC date to Julian Date?',
  howAnswer: 'Choose a conversion direction, enter a UTC date and time or a JD/MJD value, then convert. The result states UTC, the proleptic Gregorian calendar and millisecond output precision.',
  privacyQuestion: 'Is my date sent to a server?',
  privacyAnswer: 'No. The conversion runs in this browser. No date is uploaded or saved by this tool.',
  fields: {
    direction: 'Conversion direction', toJulian: 'UTC date to JD and MJD', toUtc: 'JD or MJD to UTC',
    utcDate: 'UTC date and time', julianValue: 'Julian date value', dateKind: 'Value type', jd: 'Julian Date (JD)', mjd: 'Modified Julian Date (MJD)',
    accuracyNote: 'Uses the proleptic Gregorian calendar and UTC, with no leap-second representation. JD begins at noon; MJD = JD − 2,400,000.5. Reverse conversion is rounded to the nearest millisecond. Supported years: 0001–9999.',
  },
  actions: { calculate: 'Convert date', reset: 'Reset', copy: 'Copy result', example: 'Load example', result: 'Conversion result' },
  messages: {
    calculated: 'Conversion complete.', checkInputs: 'Check the date, value and selected type.', exampleLoaded: 'Example loaded.',
    jd: 'Julian Date (JD)', mjd: 'Modified Julian Date (MJD)', utc: 'UTC date and time', dayFraction: 'Fraction of UTC day', calendar: 'Calendar', calendarValue: 'Proleptic Gregorian', timeScale: 'Time scale', precision: 'Output precision',
  },
  additionalFaqs: [
    { question: 'What is the Julian Date at the J2000 epoch?', answer: 'For 2000-01-01 12:00 UTC, this converter returns JD 2451545 and MJD 51544.5.' },
    { question: 'What is the difference between JD and MJD?', answer: 'Modified Julian Date is calculated as MJD = JD − 2400000.5. This shifts the day boundary to midnight and gives smaller values.' },
    { question: 'Does this converter handle leap seconds or local time zones?', answer: 'No. Enter UTC. Leap seconds are not represented; the tool uses ordinary Gregorian calendar dates and UTC clock time.' },
  ],
});
