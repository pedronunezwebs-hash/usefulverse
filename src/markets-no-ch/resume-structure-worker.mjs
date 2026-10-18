import { analyzeResume } from './resume-structure.mjs';
import { readResumeDocx } from './resume-docx-archive.mjs';

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'analyze-docx') return;
  try {
    const parsed = readResumeDocx(new Uint8Array(event.data.bytes));
    const report = analyzeResume({ ...parsed, jobText: event.data.jobText ?? '' });
    self.postMessage({ type: 'complete', report });
  } catch (error) {
    self.postMessage({ type: 'error', message: String(error?.message ?? '') });
  }
});
