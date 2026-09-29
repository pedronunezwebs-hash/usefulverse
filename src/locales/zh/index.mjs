import * as core from './core.mjs';
import * as a from './tools-a.mjs';
import * as b from './tools-b.mjs';
import * as c from './tools-c.mjs';
export const pack = {
  meta: core.meta, page: core.page, templates: core.templates,
  ui: { ...core.ui, ...a.ui, ...b.ui, ...c.ui },
  runtimeMessages: { ...core.runtimeMessages, ...a.runtimeMessages, ...b.runtimeMessages, ...c.runtimeMessages },
  copy: { ...a.copy, ...b.copy, ...c.copy }, seo: { ...a.seo, ...b.seo, ...c.seo }, faq: { ...a.faq, ...b.faq, ...c.faq }, toolUi: core.toolUi,
};
