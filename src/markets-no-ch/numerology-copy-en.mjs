export const numerologyEnglish = Object.freeze({
  name: 'Numerology Calculator',
  title: 'Numerology Calculator — Free Life Path & Name Numbers',
  description: 'Calculate a life path and birthday number, plus optional Pythagorean name numbers. See every reduction step. Free, private and for entertainment only.',
  intro: 'Explore a traditional numerology calculation from a birth date and optional name. The page shows the exact letter values and digit-sum steps; it does not predict your future or describe facts about you.',
  example: 'For 1990-06-15, add the date digits: 1+9+9+0+0+6+1+5 = 31, then 3+1 = 4. For ANNA, the letter values are 1+5+5+1 = 12, then 1+2 = 3.',
  details: 'This tool uses one stated Pythagorean letter cycle: A=1 through I=9, then repeat. It treats A, E, I, O and U as vowels; Y is a consonant. It keeps 11, 22 and 33 when a reduction ends at one of those numbers. These are symbolic traditions, not scientific measurements.',
  limits: 'Numerology is not a scientific method and these results are not predictions, assessments or advice. Name calculations support Latin letters; selected accents and characters are normalized. Other scripts are reported and omitted from name totals. Your date and name are calculated locally and are not saved or uploaded.',
  faq: [
    { q: 'What is the life path number?', a: 'The tool adds the digits in the entered date and repeats the digit sum until it reaches 1–9 or a retained master number 11, 22 or 33. The steps are shown so you can check the arithmetic.' },
    { q: 'Which name-number method is used?', a: 'A repeating Pythagorean A–Z cycle assigns 1–9 to letters. Vowels A, E, I, O, U make the optional vowel total; all other supported letters, including Y, make the consonant total.' },
    { q: 'Does numerology tell me what will happen?', a: 'No. The numbers are presented as traditional symbolism for entertainment and reflection. They are not evidence about your personality or future.' },
  ],
  fields: {
    birthDate: 'Date of birth', name: 'Name (optional)', nameHelp: 'Use the name you want to explore. The text stays on this device and is not stored.',
    calculate: 'Calculate numbers', sample: 'Load example', clear: 'Clear', ready: 'Enter a date, then calculate.', loading: 'Calculating locally…', invalid: 'Check the date and try again.',
    results: 'Your calculation', lifePath: 'Life path number', birthday: 'Birthday number', expression: 'Expression / name number', soulUrge: 'Vowel / soul urge number', personality: 'Consonant / personality number',
    dateSteps: 'Date digit steps', birthdaySteps: 'Birthday steps', expressionSteps: 'Name letter values and reduction', vowelSteps: 'Vowel values and reduction', consonantSteps: 'Consonant values and reduction',
    method: 'Method', masterNote: 'Master numbers 11, 22 and 33 are kept when a reduction ends on them.', unsupported: 'These letters use another writing system and were left out of the optional name calculation:', noSupportedName: 'No supported A–Z letters were found. The date numbers are still available.',
    download: 'Download calculation as CSV', print: 'Print calculation', sourceName: 'Name not included in this file', csvHeader: 'Number,Value,Reduction steps',
    sourceDateError: 'Enter a real date of birth.',
  },
});
