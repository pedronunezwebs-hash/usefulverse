import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="graphql-formatter"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const editor = form.elements.namedItem('document');
  const result = root.querySelector('[data-graphql-result]');
  const formatted = root.querySelector('[data-graphql-output]');
  const definitions = root.querySelector('[data-graphql-definitions]');
  let enginePromise;

  function engine() {
    if (!enginePromise) enginePromise = import(new URL('/assets/vendor/graphql-formatter-16.11.0.mjs', location.origin).href);
    return enginePromise;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    result.hidden = true;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const report = await (await engine()).formatGraphQL(editor.value);
      formatted.textContent = report.formatted;
      definitions.textContent = copy.fields.definitionCount.replace('{count}', String(report.definitions.length));
      result.hidden = false;
      editor.removeAttribute('aria-invalid');
      announce(root, copy.messages.formatted, 'success');
    } catch (error) {
      editor.setAttribute('aria-invalid', 'true');
      result.hidden = true;
      const location = error?.locations?.[0];
      const message = location
        ? copy.messages.invalidAt.replace('{line}', String(location.line)).replace('{column}', String(location.column))
        : error?.message?.includes('512 KiB') ? copy.messages.tooLarge : copy.messages.invalidSyntax;
      announce(root, message, 'error');
    } finally {
      submit.disabled = false;
    }
  });

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    editor.value = 'query FindUser($id: ID!) { user(id: $id) { id name email } }';
    editor.removeAttribute('aria-invalid');
    editor.focus();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="clear"]').addEventListener('click', () => {
    form.reset(); result.hidden = true; formatted.textContent = ''; definitions.textContent = '';
    editor.removeAttribute('aria-invalid'); announce(root, '', ''); editor.focus();
  });
  root.querySelector('[data-action="copy"]').addEventListener('click', async () => {
    if (!formatted.textContent) return announce(root, copy.messages.empty, 'error');
    await copyText(root, formatted.textContent, copy);
  });
}
