import { cyclingPowerCalculatorEnglishCopy } from './cycling-power-calculator.en.mjs';
import translatedRows from './cycling-power-calculator-translated-rows.mjs';

const locales = Object.freeze({
  en: cyclingPowerCalculatorEnglishCopy,
  ...Object.fromEntries(Object.entries(translatedRows).map(([copyLanguage, values]) => {
    if (values.length !== 39 || values.some((value) => typeof value !== 'string' || !value.trim())) {
      throw new Error(`Incomplete Cycling Power Calculator translation: ${copyLanguage}`);
    }
    const [name, rawTitle, rawDescription, intro, howQuestion, howAnswer, privacyQuestion, privacyAnswer,
      mass, speed, gradientPercent, headwind, rollingResistance, dragArea, airDensity, drivetrainEfficiency,
      unitSystem, metric, imperial, accuracyNote, calculate, example, reset, copy, result, calculated,
      checkInputs, riderPower, wattsPerKg, aerodynamicPower, rollingPower, climbingPower, wheelPower,
      copied, copyUnavailable, faq1Question, faq1Answer, faq2Question, faq2Answer] = values;
    const suffix = ' | UsefulVerse';
    const titlePrefixMax = 60 - suffix.length;
    let titlePrefix = rawTitle.split('|')[0].trim();
    if (titlePrefix.length > titlePrefixMax) titlePrefix = titlePrefix.slice(0, titlePrefixMax).replace(/\s+\S*$/u, '').trim();
    const title = `${titlePrefix.replace(/[,:;–—-]+$/u, '').trim()}${suffix}`;
    const description = rawDescription.length <= 160
      ? rawDescription
      : `${rawDescription.slice(0, 157).replace(/\s+\S*$/u, '').trimEnd()}…`;
    return [copyLanguage, Object.freeze({
      copyLanguage,
      name,
      title,
      description,
      intro,
      howQuestion,
      howAnswer,
      privacyQuestion,
      privacyAnswer,
      fields: { mass, speed, gradientPercent, headwind, rollingResistance, dragArea, airDensity, drivetrainEfficiency, unitSystem, metric, imperial, accuracyNote },
      actions: { calculate, example, reset, copy, result },
      messages: { calculated, checkInputs, riderPower, wattsPerKg, aerodynamicPower, rollingPower, climbingPower, wheelPower, copied, copyUnavailable },
      additionalFaqs: [{ question: faq1Question, answer: faq1Answer }, { question: faq2Question, answer: faq2Answer }],
      localizationStatus: 'machine-accepted',
      localizationAcceptedBy: 'site-owner',
      localizationAcceptedAt: '2026-10-14',
    })];
  })),
});

export default locales;
