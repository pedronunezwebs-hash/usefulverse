import { localeEntries } from '../../locales.mjs';
import { complexNumberCalculatorEnglishCopy as english } from './complex-number-calculator.en.mjs';

export default Object.freeze(Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})])));
