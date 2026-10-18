import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeResume, parseDocxStructure, pdfItemsToStructure } from './resume-structure.mjs';

const docxXml = `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>
<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>Ada &amp; Grace</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Work Experience</w:t></w:r></w:p>
<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/></w:numPr></w:pPr><w:r><w:t>Built privacy tools</w:t></w:r><w:hyperlink r:id="rId1"><w:r><w:t>Portfolio</w:t></w:r></w:hyperlink></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Education</w:t></w:r></w:p>
<w:p><w:r><w:t>ada@example.test</w:t></w:r></w:p></w:body></w:document>`;

test('DOCX parser preserves headings, bullets, XML text and only resolved hyperlinks', () => {
  const result = parseDocxStructure(docxXml, '<Relationships><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="https://example.test/portfolio" TargetMode="External"/></Relationships>');
  assert.equal(result.source, 'docx');
  assert.deepEqual(result.blocks.map(({ text, heading, bullet }) => [text, heading, bullet]), [
    ['Ada & Grace', 1, false], ['Work Experience', 1, false], ['Built privacy toolsPortfolio', null, true], ['Education', 1, false], ['ada@example.test', null, false],
  ]);
  assert.deepEqual(result.links, ['https://example.test/portfolio']);
});

test('DOCX parser refuses malformed/oversized main XML instead of returning misleading empty text', () => {
  assert.throws(() => parseDocxStructure('<w:document><w:body>'), /missing|malformed|large/u);
  assert.throws(() => parseDocxStructure(`<w:document><w:body>${'x'.repeat(8 * 1024 * 1024 + 1)}</w:body></w:document>`), /missing|malformed|large/u);
});

test('PDF.js text items become approximate visual lines and mark prominent text as heading candidates', () => {
  const result = pdfItemsToStructure([[{ str: 'Ada Example', transform: [1, 0, 0, 20, 10, 700], height: 20 }, { str: 'Software Engineer', transform: [1, 0, 0, 20, 125, 700], height: 20 }, { str: 'Built browser tools', transform: [1, 0, 0, 10, 10, 670], height: 10 }]]);
  assert.deepEqual(result.blocks.map(({ text, heading }) => [text, heading]), [['Ada Example Software Engineer', 2], ['Built browser tools', null]]);
});

test('report detects practical structure and compares job terms as counts, never a hiring score', () => {
  const parsed = parseDocxStructure(docxXml, '<Relationships/>');
  const result = analyzeResume({ ...parsed, jobText: 'privacy privacy JavaScript accessibility teamwork' });
  assert.equal(result.sections.find(({ key }) => key === 'experience').found, true);
  assert.equal(result.sections.find(({ key }) => key === 'education').found, true);
  assert.equal(result.emailPresent, true);
  assert.equal(result.bullets, 1);
  assert.equal(result.jobTerms.find(({ term }) => term === 'privacy').inJob, 2);
  assert.equal(result.jobTerms.find(({ term }) => term === 'privacy').inResume, 1);
  assert.equal(Object.hasOwn(result, 'score'), false);
  assert.equal(Object.hasOwn(result, 'text'), false);
  assert.equal(Object.hasOwn(result, 'email'), false);
});

test('empty/scanned-only text and invalid inputs are reported explicitly', () => {
  assert.throws(() => analyzeResume({ blocks: [] }), /no selectable resume text/i);
  assert.throws(() => analyzeResume({ blocks: 'not an array' }), /invalid or too large/i);
  assert.throws(() => pdfItemsToStructure([]), /no pages with selectable text/i);
});
