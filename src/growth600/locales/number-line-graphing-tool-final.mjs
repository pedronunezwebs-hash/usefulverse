import { localeEntries } from '../../locales.mjs';
import { numberLineGraphingEnglishCopy as english } from './number-line-graphing-tool.en.mjs';

export default Object.freeze(Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})])));
