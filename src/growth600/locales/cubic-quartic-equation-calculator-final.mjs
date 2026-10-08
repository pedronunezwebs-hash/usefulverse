import { localeEntries } from '../../locales.mjs';
import { cubicQuarticEquationCalculatorEnglishCopy as english } from './cubic-quartic-equation-calculator.en.mjs';

export default Object.freeze(Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})])));
