import { assignSecretSanta } from './logic.mjs';
import { announce, clearResult, copyText, randomIndex, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="secret-santa-generator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const revealName = root.querySelector('[data-reveal-name]');
  const pairList = root.querySelector('[data-pair-list]');
  const revealButton = root.querySelector('[data-action="reveal"]');
  const nextButton = root.querySelector('[data-action="next"]');
  const copyButton = root.querySelector('[data-action="copy"]');
  const downloadButton = root.querySelector('[data-action="download"]');
  let pairs = [];
  let position = -1;

  function setFinished(canExport) {
    copyButton.disabled = !canExport;
    downloadButton.disabled = !canExport;
  }

  function exclusionsFromText(raw, names) {
    const exclusions = {};
    for (const line of raw.split(/\r?\n/u).map((part) => part.trim()).filter(Boolean)) {
      const separator = line.indexOf(':');
      if (separator < 1) throw new SyntaxError();
      const giver = line.slice(0, separator).trim();
      const recipients = line.slice(separator + 1).split(',').map((part) => part.trim()).filter(Boolean);
      if (!names.some((name) => name.toLocaleLowerCase() === giver.toLocaleLowerCase()) || !recipients.length) throw new SyntaxError();
      if (Object.hasOwn(exclusions, giver)) throw new SyntaxError();
      exclusions[giver] = recipients;
    }
    return exclusions;
  }

  function revealNext() {
    if (position + 1 >= pairs.length) return;
    position += 1;
    revealButton.hidden = true;
    const pair = pairs[position];
    revealName.textContent = copy.messages.privatePair.replace('{giver}', pair.giver).replace('{recipient}', pair.recipient);
    nextButton.disabled = position + 1 >= pairs.length;
    if (position + 1 === pairs.length) {
      const items = pairs.map(({ giver, recipient }) => {
        const item = document.createElement('li');
        item.textContent = `${giver} → ${recipient}`;
        return item;
      });
      pairList.replaceChildren(...items);
      pairList.hidden = false;
      setFinished(true);
      nextButton.disabled = true;
      announce(root, copy.messages.allRevealed, 'success');
    } else {
      nextButton.disabled = false;
    }
  }

  function generate(event) {
    event?.preventDefault();
    clearResult(root);
    pairList.replaceChildren();
    pairList.hidden = true;
    revealName.textContent = '';
    setFinished(false);
    position = -1;
    try {
      const names = form.elements.namedItem('names').value.split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
      const exclusions = exclusionsFromText(form.elements.namedItem('exclusions').value, names);
      pairs = assignSecretSanta(names, exclusions, (limit) => randomIndex(limit));
      root.querySelector('[data-result]').hidden = false;
      revealButton.hidden = false;
      nextButton.disabled = true;
      announce(root, copy.messages.drawReady, 'success');
    } catch {
      pairs = [];
      announce(root, copy.messages.checkNamesAndRules, 'error');
    }
  }

  form.addEventListener('submit', generate);
  form.addEventListener('reset', () => {
    setTimeout(() => {
      pairs = []; position = -1; clearResult(root); pairList.replaceChildren(); pairList.hidden = true;
      revealName.textContent = ''; revealButton.hidden = false; nextButton.disabled = true; setFinished(false); announce(root, '');
    }, 0);
  });
  revealButton.addEventListener('click', revealNext);
  nextButton.addEventListener('click', revealNext);
  copyButton.addEventListener('click', () => {
    if (position + 1 === pairs.length && pairs.length) copyText(root, pairs.map(({ giver, recipient }) => `${giver} → ${recipient}`).join('\n'), copy);
  });
  downloadButton.addEventListener('click', () => {
    if (position + 1 !== pairs.length || !pairs.length) return;
    const blob = new Blob([pairs.map(({ giver, recipient }) => `${giver} → ${recipient}`).join('\n')], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'secret-santa.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
  setFinished(false);
}
