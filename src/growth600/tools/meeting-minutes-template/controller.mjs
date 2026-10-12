import { announce } from '../controller-helpers.mjs';
import { createMeetingMinutes, renderMeetingMinutesMarkdown } from './logic.mjs';

const root = document.querySelector('[data-tool="meeting-minutes-template"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const output = root.querySelector('[data-minutes-preview]');
  let markdown = '';
  function preview(event) {
    event?.preventDefault();
    try {
      const minutes = createMeetingMinutes({
        title: form.elements.namedItem('title').value,
        date: form.elements.namedItem('date').value,
        facilitator: form.elements.namedItem('facilitator').value,
        attendees: form.elements.namedItem('attendees').value,
        agenda: form.elements.namedItem('agenda').value,
        decisions: form.elements.namedItem('decisions').value,
        actions: form.elements.namedItem('actions').value,
      });
      markdown = renderMeetingMinutesMarkdown(minutes); output.textContent = markdown; output.hidden = false;
      announce(root, copy.messages.previewReady, 'success');
    } catch { markdown = ''; output.textContent = ''; output.hidden = true; announce(root, copy.messages.checkInputs, 'error'); }
  }
  form.addEventListener('submit', preview);
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!markdown) preview();
    if (!markdown) return;
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'meeting-minutes.md'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0);
    announce(root, copy.messages.downloaded, 'success');
  });
  root.querySelector('[data-action="print"]')?.addEventListener('click', () => { if (!markdown) preview(); if (markdown) window.print(); });
  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => { markdown = ''; output.textContent = ''; output.hidden = true; announce(root, copy.messages.cleared, 'success'); });
  form.addEventListener('input', () => { markdown = ''; output.textContent = ''; output.hidden = true; announce(root, ''); });
}
