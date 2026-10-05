import { readingSpeedEnglishCopy, readingSpeedSample, readingSpeedUiKeys } from './reading-speed-source.mjs';
import { readingSpeedLocaleData } from './reading-speed.mjs';

export const readingSpeedRuntimeKeys = readingSpeedUiKeys;

export function readingSpeedContent(language = 'en') {
  if (language === 'en') return {
    ui: Object.fromEntries(readingSpeedUiKeys.map((key) => [key, key])),
    sample: readingSpeedSample,
    copy: readingSpeedEnglishCopy,
  };
  return readingSpeedLocaleData[language] ?? { ui: {}, sample: readingSpeedSample, copy: readingSpeedEnglishCopy };
}
