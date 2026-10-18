export const sleepCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Sleep calculator',
  title: 'Sleep Calculator Online Free, Unlimited | UsefulVerse',
  description: 'Plan a bedtime or wake-up time from your chosen sleep duration and time to fall asleep. Free local sleep calculator, no account.',
  intro: 'Choose a reference time, how long you want to sleep, and how long you usually take to fall asleep. Get a suggested bedtime or wake-up time without claiming exact sleep cycles.',
  howQuestion: 'How does this sleep calculator work?',
  howAnswer: 'Choose a wake-up time to calculate when to get into bed, or choose a bedtime to estimate a wake-up time. The result adds or subtracts your selected sleep duration and time to fall asleep, including when the clock crosses midnight.',
  privacyQuestion: 'Is this sleep calculator free and private?',
  privacyAnswer: 'Yes. The calculation runs in this browser. No account or upload is needed, and your entries are not saved.',
  fields: {
    direction: 'I want to calculate', bedtimeMode: 'A suggested bedtime', wakeMode: 'A suggested wake-up time',
    wakeReference: 'Time you want to wake up', bedReference: 'Time you plan to get into bed', durationHours: 'Sleep duration (hours)', extraMinutes: 'Extra sleep minutes',
    latency: 'Time to fall asleep (minutes)', result: 'Suggested time', resultDetails: 'Calculation details', accuracyNote: 'This is simple time arithmetic based on your choices, not a prediction of sleep cycles or a medical recommendation. Sleep needs vary by age and person.',
  },
  actions: { calculate: 'Calculate time', example: 'Load example', reset: 'Reset', result: 'Sleep time result' },
  messages: {
    calculated: 'Suggested time: {time}.', checkInputs: 'Check the time, sleep duration and time-to-fall-asleep values.',
    previousDay: 'the previous day', nextDay: 'the next day', sameDay: 'the same day',
    result: 'For {duration} hours of sleep plus {latency} minutes to fall asleep; this falls on {day}.', reset: 'Inputs reset.',
  },
  additionalFaqs: [
    { question: 'Does this calculate exact 90-minute sleep cycles?', answer: 'No. Sleep cycles vary and are not reliably predicted by a fixed 90-minute rule. This tool only adds or subtracts the sleep duration and time to fall asleep that you enter.' },
    { question: 'What does time to fall asleep mean?', answer: 'It is the number of minutes you choose to allow between getting into bed and falling asleep. The result includes it so the planned sleep duration starts after that interval.' },
    { question: 'How much sleep should I get?', answer: 'Sleep needs vary with age and individual circumstances. This calculator does not prescribe a duration; ask a qualified healthcare professional if you have sleep or health concerns.' },
  ],
});
