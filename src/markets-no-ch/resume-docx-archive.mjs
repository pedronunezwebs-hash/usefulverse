import { unzipSync } from 'fflate';
import { inspectOfficePackage, OFFICE_PACKAGE_LIMITS } from '../office-package-logic.mjs';
import { parseDocxStructure } from './resume-structure.mjs';

export function readResumeDocx(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const checked = inspectOfficePackage(bytes, 'docx');
  if (checked.expandedSize > 80 * 1024 * 1024 || checked.expandedSize > OFFICE_PACKAGE_LIMITS.expandedBytes) {
    throw new RangeError('The expanded DOCX is above the 80 MB local safety limit.');
  }
  const parts = unzipSync(bytes);
  const document = parts['word/document.xml'];
  if (!document || document.byteLength > 8 * 1024 * 1024) throw new RangeError('The DOCX main text is missing or exceeds the local safety limit.');
  const relationships = parts['word/_rels/document.xml.rels'];
  return parseDocxStructure(new TextDecoder('utf-8', { fatal: false }).decode(document), relationships ? new TextDecoder('utf-8', { fatal: false }).decode(relationships) : '');
}
