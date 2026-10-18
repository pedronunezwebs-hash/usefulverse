export const choreChartMakerEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Chore Chart Maker', title: 'Chore Chart Maker Free & Printable | UsefulVerse',
  description: 'Make a free rotating family chore chart. Balance weekly tasks by effort, print the schedule, or export CSV. No account needed.',
  intro: 'Create a rotating weekly chore chart for your household. Add people, chores and simple effort points; the schedule balances assignments across the weeks you choose.',
  howQuestion: 'How do I make a rotating chore chart?',
  howAnswer: 'Enter each household member and chore on its own line, choose a Monday start date and up to 12 weeks, then generate the schedule. Print it or download a CSV copy.',
  privacyQuestion: 'Are names or chores uploaded?',
  privacyAnswer: 'No. The schedule is generated in this browser. Names and chores are not uploaded or saved by the tool; they remain in the current tab unless you export or print them.',
  examplePeople: 'Alex\nSam\nRiley', exampleChores: 'Kitchen | 3\nTrash | 1\nLaundry | 2',
  fields: { people: 'Household members', peopleHint: 'One name per line; up to 12.', chores: 'Weekly chores', choresHint: 'One chore per line. Optional effort weight: Chore | 1–5. Default is 1.', startDate: 'First Monday', weeks: 'Weeks to schedule', week1: '1 week', week2: '2 weeks', week4: '4 weeks', week8: '8 weeks', week12: '12 weeks', accuracyNote: 'Effort points are a simple balancing aid, not a measure of time or difficulty.', privacyNote: 'Everything is generated in this tab. Export only if you want to keep a copy.', resultTitle: 'Your rotating chore chart', weekLabel: 'Week', startsLabel: 'Starts', choreLabel: 'Chore', assignedToLabel: 'Assigned to', pointsLabel: 'Effort points', loadSummary: 'Total effort points by person', loadSpread: 'Difference between highest and lowest total' },
  actions: { generate: 'Make chore chart', example: 'Load example', reset: 'Clear', result: 'Schedule', print: 'Print schedule', downloadCsv: 'Download CSV' },
  messages: { empty: 'Add at least one person and one chore.', invalidPeople: 'Check the member list; names must be unique.', invalidChores: 'Check the chore list and effort points from 1 to 5.', invalidDate: 'Choose a valid Monday as the start date.', invalidWeeks: 'Choose between 1 and 12 weeks.', generated: 'Chore chart created.', downloaded: 'CSV schedule downloaded.', copied: 'Copied.', copyUnavailable: 'Clipboard is unavailable.' },
  additionalFaqs: [
    { question: 'Can I make a printable weekly chore chart?', answer: 'Yes. Generate a schedule and use Print schedule to print or save it as a PDF from your browser.' },
    { question: 'How does the rotation balance chores?', answer: 'Each chore can have a simple effort weight from 1 to 5. The scheduler uses those points to spread assignments across the selected weeks; points do not predict actual time.' },
    { question: 'Can I set different chores for different weeks?', answer: 'This version repeats the listed weekly chores and rotates who is assigned. Edit the list and generate a new chart when the household routine changes.' },
  ],
});
