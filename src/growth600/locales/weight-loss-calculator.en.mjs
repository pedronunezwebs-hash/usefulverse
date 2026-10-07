export const weightLossCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Weight loss scenario calculator',
  title: 'Weight loss calculator free | UsefulVerse',
  description: 'Explore a simple weight-goal timeline from your own inputs. Free, private browser math—not a diet plan or body-weight prediction.',
  intro: 'Explore a transparent, simplified energy-balance scenario for a weight goal. It is arithmetic, not a prediction of how your body will respond.',
  howQuestion: 'How does this weight loss calculator work?',
  howAnswer: 'Enter a current weight, a lower goal weight and a daily calorie deficit you already want to examine. The page applies a fixed linear energy-per-weight assumption to show a mathematical scenario. It does not recommend a calorie deficit, create a diet or predict your actual weight change.',
  privacyQuestion: 'Are my weight details uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser and the entered numbers are not sent to a server or saved by this page.',
  fields: {
    currentWeight: 'Current weight', targetWeight: 'Goal weight', dailyDeficit: 'Daily calorie deficit for this scenario (kcal)', unit: 'Weight unit',
    methodNote: 'Simplified linear arithmetic only: 7,700 kcal per kg or 3,500 kcal per lb. Real body-weight change is dynamic; this is not a physiological forecast.',
    healthNote: 'This page does not tell you what to eat or how large a deficit to choose. Health, medicines and individual needs matter. Ask a qualified health professional before changing diet or activity; do not use this estimate as medical advice.',
    sourceNiddk: 'Why body-weight change is dynamic:', sourceCdc: 'gradual-change information',
  },
  actions: { calculate: 'Calculate scenario', reset: 'Reset', example: 'Try example', copy: 'Copy result', result: 'Scenario result', kilograms: 'Kilograms (kg)', pounds: 'Pounds (lb)', dayUnit: 'days', weekUnit: 'weeks', kilocalories: 'kcal', perWeek: 'per week' },
  messages: {
    copied: 'Result copied.', copyUnavailable: 'Copy is not available in this browser.', checkInputs: 'Enter a positive current weight, a goal no higher than it, and a daily deficit of zero or more.',
    estimateOnly: 'Mathematical scenario only—not a body-weight prediction or diet recommendation.', weightToLose: 'Weight difference', energyEquivalent: 'Linear energy equivalent', timeline: 'Simple linear timeline', weeklyRate: 'Implied weekly rate',
    noDeficitChange: 'With a zero entered deficit, this model shows no change and cannot estimate a timeline.', paceNote: 'This linear scenario is above the CDC pace often described as gradual for many adults. It is not a recommended target; ask a health professional.',
  },
  additionalFaqs: [
    { question: 'Is this a prediction of how much weight I will lose?', answer: 'No. It applies a fixed linear calorie-to-weight assumption. NIDDK explains that body-weight change is dynamic, so this simple arithmetic can overstate longer-term change.' },
    { question: 'What happens when the daily deficit is zero?', answer: 'The modeled energy change is zero, so the page reports no modeled weight change and no finite timeline.' },
  ],
});
