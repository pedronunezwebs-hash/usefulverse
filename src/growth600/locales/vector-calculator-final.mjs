import { localeEntries } from '../../locales.mjs';
import { vectorCalculatorEnglishCopy as english } from './vector-calculator.en.mjs';

export default Object.freeze(Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})])));
