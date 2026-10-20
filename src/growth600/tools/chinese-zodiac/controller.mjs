import { chineseZodiac } from '../pending-23/logic.mjs';
import { mountPendingTool } from '../pending-23/controller.mjs';

mountPendingTool('chinese-zodiac', (input) => chineseZodiac({ ...input, locale: document.documentElement.lang || navigator.language || 'en' }));
