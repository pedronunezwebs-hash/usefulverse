import * as prettier from 'prettier/standalone';
import * as htmlPlugin from 'prettier/plugins/html';

const blockElements = new Set('address article aside blockquote body dd details dialog div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hr html li main nav ol optgroup option p pre section summary table tbody td tfoot th thead tr ul'.split(' '));

function compactHtml(source) {
  const parsed = new DOMParser().parseFromString(source, 'text/html');
  const visit = (parent) => {
    const children = [...parent.childNodes];
    const elementChildren = children.filter((node) => node.nodeType === Node.ELEMENT_NODE);
    const canDropGaps = elementChildren.length > 0
      && elementChildren.every((node) => blockElements.has(node.localName));
    for (const node of children) {
      if (canDropGaps && node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) node.remove();
      else if (node.nodeType === Node.ELEMENT_NODE) visit(node);
    }
  };
  visit(parsed);
  const doctype = parsed.doctype ? `<!DOCTYPE ${parsed.doctype.name}>` : '';
  return `${doctype}${parsed.documentElement.outerHTML}`;
}

export async function processHtml(source, mode) {
  if (mode === 'format') {
    return prettier.format(source, {
      parser: 'html', plugins: [htmlPlugin], htmlWhitespaceSensitivity: 'strict',
      embeddedLanguageFormatting: 'off', printWidth: 100,
    });
  }
  return compactHtml(source);
}
