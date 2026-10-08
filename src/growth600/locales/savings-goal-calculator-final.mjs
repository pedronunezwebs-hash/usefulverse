import { localeEntries } from '../../locales.mjs';
import { savingsGoalCalculatorEnglishCopy as english } from './savings-goal-calculator.en.mjs';

const drafts = Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})]));

export default Object.freeze(drafts);
