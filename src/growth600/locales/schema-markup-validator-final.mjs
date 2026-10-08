import { localeEntries } from '../../locales.mjs';
import { schemaMarkupValidatorEnglishCopy as english } from './schema-markup-validator.en.mjs';

const drafts = Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})]));

export default Object.freeze(drafts);
