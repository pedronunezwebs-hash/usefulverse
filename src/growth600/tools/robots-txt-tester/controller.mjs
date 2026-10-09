import { announce, clearResult, readToolCopy } from '../controller-helpers.mjs';
import { evaluateRobots, ROBOTS_LIMITS } from './logic.mjs';

const root = document.querySelector('[data-tool="robots-txt-tester"]');
if (root) {
  const form = root.querySelector('#tool-form'); const copy = readToolCopy(root);
  const robotsField = form.elements.namedItem('robotsText'); const agentField = form.elements.namedItem('userAgent'); const urlsField = form.elements.namedItem('urls');
  const result = root.querySelector('[data-result]'); const content = root.querySelector('[data-result-content]');

  function render(output) {
    const summary = document.createElement('p');
    summary.textContent = `${output.userAgent} · ${output.selectedAgentGroup ? `${copy.fields.agentGroup}: ${output.selectedAgentGroup}` : copy.fields.noSpecificGroup} · ${copy.fields.ruleCount}: ${output.ruleCount}`;
    const note = document.createElement('p'); note.className = 'hint';
    note.textContent = `${copy.fields.diagnostics}: ${output.ignoredDirectives} ${copy.fields.ignored}, ${output.malformedLines} ${copy.fields.malformed}.`;
    const list = document.createElement('div'); list.className = 'robots-txt-tester__decision';
    for (const item of output.results) {
      const card = document.createElement('article'); card.dataset.decision = item.allowed ? 'allowed' : 'blocked';
      const verdict = document.createElement('h3'); verdict.textContent = item.allowed ? copy.fields.allowed : copy.fields.blocked;
      const url = document.createElement('p'); url.textContent = item.url;
      const rule = document.createElement('p'); rule.textContent = item.matchedDirective === 'default' ? copy.fields.defaultRule : `${copy.fields.winningRule}: ${item.matchedRule}`; rule.className = 'robots-txt-tester__matched-rule';
      card.append(verdict, url, rule); list.append(card);
    }
    content.replaceChildren(summary, note, list); result.hidden = false;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault(); clearResult(root); announce(root, '');
    try {
      const urls = urlsField.value.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
      if (urls.length > ROBOTS_LIMITS.urls) throw new Error('tooManyUrls');
      render(evaluateRobots({ robotsText: robotsField.value, userAgent: agentField.value, urls }));
      announce(root, copy.messages.evaluated, 'success');
    } catch (error) {
      result.hidden = true; content.replaceChildren(); announce(root, copy.messages[error.message] ?? copy.messages.invalid, 'error');
    }
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    robotsField.value = copy.exampleRobots; agentField.value = 'Googlebot'; urlsField.value = `${location.origin}/private/report\n${location.origin}/private/public/article`;
    form.requestSubmit();
  });
  form.addEventListener('reset', () => queueMicrotask(() => { clearResult(root); announce(root, ''); }));
}
