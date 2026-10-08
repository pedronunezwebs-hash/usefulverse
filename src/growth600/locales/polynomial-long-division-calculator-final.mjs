import { localeEntries } from '../../locales.mjs';
import { polynomialLongDivisionCalculatorEnglishCopy as english } from './polynomial-long-division-calculator.en.mjs';

const copies = Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})]));

export default Object.freeze(copies);
