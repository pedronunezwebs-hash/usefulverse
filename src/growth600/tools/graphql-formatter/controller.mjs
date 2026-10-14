import { formatGraphQLSource, validateGraphQLSource } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="graphql-formatter"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const source = form.elements.namedItem('source');
  const output = form.elements.namedItem('output');
  const result = root.querySelector('[data-graphql-result]');
  let formatterPromise;

  function formatterModule() {
    if (!formatterPromise) {
      const url = new URL('/assets/vendor/prettier-graphql-3.9.9.mjs', location.origin).href;
      formatterPromise = import(url);
    }
    return formatterPromise;
  }

  function showSyntaxError(error) {
    result.hidden = false;
    output.value = '';
    const line = error?.loc?.start?.line;
    const column = error?.loc?.start?.column;
    const message = line && column
      ? `${copy.messages.syntaxError} ${copy.messages.location.replace('{line}', String(line)).replace('{column}', String(column))}`
      : copy.messages.syntaxError;
    announce(root, message, 'error');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    output.value = '';
    result.hidden = true;
    try {
      validateGraphQLSource(source.value);
      announce(root, copy.messages.loading, 'info');
      const module = await formatterModule();
      output.value = await formatGraphQLSource(source.value, module.formatGraphQL);
      result.hidden = false;
      announce(root, copy.messages.formatted, 'success');
    } catch (error) {
      if (error?.message === 'empty') announce(root, copy.messages.empty, 'error');
      else if (error?.message === 'tooLong') announce(root, copy.messages.tooLong, 'error');
      else if (error?.message === 'formatterUnavailable') announce(root, copy.messages.formatterUnavailable, 'error');
      else showSyntaxError(error);
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    source.value = 'query GetUser($id: ID!) { user(id: $id) { id name email } }\n\ntype User { id: ID! name: String! email: String }';
    output.value = '';
    result.hidden = true;
    source.focus();
    announce(root, copy.messages.exampleLoaded, 'info');
  });

  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    output.value = '';
    result.hidden = true;
    announce(root, '');
  });

  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (output.value) copyText(root, output.value, copy);
    else announce(root, copy.messages.formatFirst, 'error');
  });

  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!output.value) { announce(root, copy.messages.formatFirst, 'error'); return; }
    const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'formatted.graphql';
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
}
