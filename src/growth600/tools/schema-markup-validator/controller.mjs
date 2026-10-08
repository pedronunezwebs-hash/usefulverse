import { validateSchemaMarkup, MAX_SCHEMA_MARKUP_CHARS } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="schema-markup-validator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const input = form.elements.namedItem('markup');
  const result = root.querySelector('[data-validation-result]');
  const summary = root.querySelector('[data-validation-summary]');
  const issuesList = root.querySelector('[data-validation-issues]');
  let vocabularyPromise = null;
  let latestSummary = '';
  const schemaContext = 'https:' + '/'.repeat(2) + 'schema.org';

  async function loadVocabulary() {
    if (!vocabularyPromise) {
      vocabularyPromise = fetch(new URL('/assets/schemaorg-v30.1.json', location.origin), { credentials: 'omit', cache: 'force-cache' })
        .then((response) => {
          if (!response.ok) throw new Error('Vocabulary asset is unavailable.');
          return response.json();
        })
        .then((vocabulary) => {
          if (vocabulary.version !== '30.1' || !Array.isArray(vocabulary.types) || !Array.isArray(vocabulary.properties)) throw new Error('Vocabulary version check failed.');
          return vocabulary;
        })
        .catch((error) => { vocabularyPromise = null; throw error; });
    }
    return vocabularyPromise;
  }

  function localizedIssue(issue) {
    if (issue.code === 'invalid-json') return issue.message;
    if (issue.code === 'root-not-object') return copy.messages.rootNotObject;
    if (issue.code === 'unknown-type') return `${copy.messages.unknownType} ${issue.term} — ${issue.path}`;
    if (issue.code === 'unknown-property') return `${copy.messages.unknownProperty} ${issue.term} — ${issue.path}`;
    if (issue.code === 'no-typed-entity') return copy.messages.noTypedEntity;
    return issue.message;
  }

  function showIssues(issues) {
    const fragment = document.createDocumentFragment();
    for (const issue of issues.slice(0, 100)) {
      const item = document.createElement('li');
      item.dataset.severity = issue.severity;
      item.textContent = localizedIssue(issue);
      fragment.append(item);
    }
    if (issues.length > 100) {
      const item = document.createElement('li');
      item.textContent = `${issues.length - 100} more findings are not shown.`;
      fragment.append(item);
    }
    issuesList.replaceChildren(fragment);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const source = input.value;
    input.removeAttribute('aria-invalid');
    result.hidden = true;
    if (source.length > MAX_SCHEMA_MARKUP_CHARS) {
      input.setAttribute('aria-invalid', 'true');
      announce(root, copy.messages.inputTooLarge, 'error');
      input.focus();
      return;
    }
    announce(root, copy.messages.loadingVocabulary, 'info');
    try {
      const vocabulary = await loadVocabulary();
      const report = validateSchemaMarkup(source, vocabulary);
      showIssues(report.issues);
      const hasBlockingIssue = report.issues.some(({ severity }) => severity === 'error');
      const statusText = report.jsonValid && !hasBlockingIssue ? copy.messages.valid : copy.messages.invalid;
      const warningCount = report.issues.filter(({ severity }) => severity === 'warning').length;
      const counts = `Schema.org ${report.vocabularyVersion} · ${report.entityCount} typed entities · ${report.typesChecked} types and ${report.propertiesChecked} properties checked · ${warningCount} warnings`;
      summary.textContent = `${statusText} ${counts}`;
      latestSummary = `${summary.textContent}${report.issues.length ? `\n${report.issues.map(localizedIssue).join('\n')}` : ''}`;
      result.hidden = false;
      if (!report.jsonValid || hasBlockingIssue) input.setAttribute('aria-invalid', 'true');
      announce(root, statusText, hasBlockingIssue ? 'error' : 'success');
    } catch {
      announce(root, copy.messages.vocabularyUnavailable, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    input.value = JSON.stringify({ '@context': schemaContext, '@type': 'Organization', name: 'UsefulVerse', url: location.origin, sameAs: [] }, null, 2);
    input.removeAttribute('aria-invalid');
    result.hidden = true;
    input.focus();
    announce(root, copy.messages.exampleLoaded, 'info');
  });

  root.querySelector('[data-action="copy-summary"]')?.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable.');
      await navigator.clipboard.writeText(latestSummary);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });

  form.addEventListener('reset', () => {
    input.removeAttribute('aria-invalid');
    result.hidden = true;
    summary.textContent = '';
    issuesList.replaceChildren();
    latestSummary = '';
    announce(root, '');
  });
}
