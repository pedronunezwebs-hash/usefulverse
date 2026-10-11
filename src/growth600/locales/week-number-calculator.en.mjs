export const weekNumberCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Week Number Calculator',
  title: 'Week Number Calculator Free | UsefulVerse',
  description: 'Find the ISO week number and week-year for any date, or compare a custom week start. Free, private browser calculator.',
  intro: 'Enter a date to find its ISO 8601 week number, week-year and Monday-to-Sunday dates. You can also compare a calendar-week rule that starts on Sunday, Monday or Saturday.',
  howQuestion: 'How do I find the week number for a date?',
  howAnswer: 'Choose ISO 8601 or a calendar-week rule, enter the date and calculate. ISO weeks start Monday, and week 1 is the week containing January 4. The week-year can differ from the calendar year near New Year.',
  privacyQuestion: 'Is my date sent to a server?',
  privacyAnswer: 'No. This date calculation runs in your browser. The date is not uploaded or saved by this tool.',
  fields: {
    date: 'Date', mode: 'Week-number system', isoMode: 'ISO 8601 (Monday; week 1 contains January 4)',
    customMode: 'Calendar week (week 1 contains January 1)', weekStart: 'First day of week',
    sunday: 'Sunday', monday: 'Monday', saturday: 'Saturday',
    accuracyNote: 'Custom mode counts the week containing January 1 as week 1 and labels it with the calendar year. ISO 8601 can assign dates near New Year to a different week-year. Date-only calculations use UTC; no time-zone conversion or fiscal-calendar rules are applied.',
  },
  actions: { calculate: 'Find week', reset: 'Reset', example: 'Try an example', result: 'Week details', copy: 'Copy result' },
  messages: {
    weekNumber: 'Week number', weekYear: 'Week-year', weekStarts: 'Week starts', weekEnds: 'Week ends',
    calculated: 'Week details ready.', checkInputs: 'Enter a valid date and choose a week-number system.',
  },
  additionalFaqs: [
    { question: 'Why can the ISO week-year differ from the calendar year?', answer: 'An ISO week belongs to the year containing its Thursday. A date in early January can therefore belong to the last ISO week of the previous year, and a date in late December can belong to week 1 of the next ISO year.' },
    { question: 'What does the custom calendar-week option mean?', answer: 'It numbers the seven-day period that contains January 1 as week 1, using the selected first day. The label stays with the calendar year. This is a transparent comparison rule, not a claim about your country or employer’s official convention.' },
    { question: 'Does this calculate fiscal week numbers?', answer: 'No. Fiscal calendars can use organization-specific start dates and 4-4-5 or other rules. This tool only calculates ISO weeks or the stated January 1 calendar-week rule.' },
  ],
});
