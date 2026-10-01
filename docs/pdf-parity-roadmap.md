# UsefulVerse PDF suite — parity audit and implementation contract

Audit date: 2026-10-01. Reference: the public iLovePDF tool catalogue and the language menu shown by the owner.

## Product constraints

- Keep file processing in the visitor's browser/device. No conversion API, Pages Function, Worker, R2 bucket, upload endpoint, or per-file backend workload.
- Load heavy libraries only on the tool that needs them. Tell people when a slower computer is recommended; do not promise every file/device will work or call the service “100% secure”.
- Never overwrite the chosen source. Offer a separate result and explain quality, editability, signatures, metadata, and security changes before processing.
- Redaction must remove original page objects from the exported copy. Drawing a black rectangle over selectable text is not redaction.
- Password removal must require the current password. Do not offer bypasses.
- Do not claim PDF/A conformance, certified/identity-verified signatures, layout-faithful Office conversion, AI translation, or AI summaries unless they are actually implemented and validated to that standard.

## iLovePDF catalogue comparison

| iLovePDF capability | UsefulVerse baseline | Local path / acceptance |
|---|---|---|
| Merge, split/extract, compress | Implemented | Keep original unchanged; test ranges, passwords, large inputs, and both compression modes. |
| Organize, rotate, remove pages, page numbers, watermark | Implemented in PDF Page Organizer | Crop is now a separate local page tool; visible warning says CropBox does not erase hidden page content. |
| JPG/images to PDF; PDF to JPG/PNG | Implemented | Extend image-to-PDF with camera capture where supported; preserve explicit device limits. |
| OCR scanned PDF | Implemented, text export only | Keep model lazy-loaded; never imply that it rebuilds a searchable PDF. |
| PDF ↔ Word | Implemented as text-first conversion | Keep the loss-of-layout warning prominent; this is not a layout-faithful Office round trip. |
| Fill PDF forms and add signature | Implemented partially | Signature is visual only, not a certificate-backed or identity-verified e-signature. |
| Compare PDFs | Implemented as selectable-text comparison | Do not imply pixel/visual or legal comparison. |
| PDF to Markdown | Implemented | Keep text-first limitations. |
| Protect/unlock with password | Implemented in this branch | QPDF/WASM in a browser worker; AES-256; removal requires the current password. Round-trip and wrong-password tests pass. |
| Repair PDF | Implemented in this branch | Best-effort QPDF rewrite and structural check; not guaranteed recovery. |
| Crop PDF | Implemented in this branch | Local CropBox margins in mm across pages, with 100 MB/300-page limits; rejects rotated pages and warns this is not secure redaction. |
| Permanent redaction | Implemented in this branch; basic browser smoke passed, broader security QA pending | Rebuild every page from a PDF.js render with opaque masks; the output is a new image-only PDF. A synthetic two-page browser run confirmed the marked text is visually covered, the result opens and the original phrase is absent from text extraction. This is not an adversarial-document audit. Input capped at 50 MB/100 pages and 40 MP total at selected DPI. Searchable text, forms, links, layers, metadata, old signatures and accessibility structure are lost. The original stays unchanged. |
| Edit visible text/images | Partial, implemented as a visual replacement | The local editor can cover a selected page area and place new text or an image. Saving rasterizes edited pages, so the old content is not an editable PDF object and page text/searchability/accessibility can be lost. Selection errors can leave old marks visible or cover nearby content. This is not native in-place editing; the source file remains unchanged. |
| Scan to PDF | Implemented as basic camera capture | Image-to-PDF can capture a photo on supported browsers. It does not automatically correct perspective or promise scanner-grade cleanup. |
| HTML to PDF | Implemented | Sanitized, user-supplied HTML is previewed locally and handed to the browser print dialog; remote URLs are not fetched and no server conversion occurs. |
| PDF ↔ PowerPoint / Excel | Implemented as limited local conversions, not faithful Office round trips | PDF→Excel groups selectable PDF text by approximate line/position; it does not infer table structure, formulas, or OCR scanned pages. PDF→PowerPoint creates one image-only slide per page (up to 100 pages, 30 MP total and 100 MB of rendered images). Excel→PDF reconstructs cell values in a browser print view (up to 20 sheets, 2,000 rows and 200 columns per sheet); formulas are not recalculated and styling/charts can be lost. PowerPoint→PDF reconstructs supported text/image shapes in a print view, not full PowerPoint rendering. Office-to-PDF requires the visitor to use the browser's Save as PDF. Keep source files and review every result; this is not equivalent to desktop Office or iLovePDF fidelity. |
| PDF/A archival conversion | Implemented as a local PDF/A-1b visual-copy route; sample-validated | Browser renders each page to an opaque image, then PDFKit emits XMP and an sRGB OutputIntent. Synthetic samples and a two-page output created through the real browser UI passed veraPDF 1b. Each visitor's result is not individually validated; the UI tells them to validate it when compliance matters. Searchable text, forms, links, existing signatures, metadata and accessibility structure are lost. This is not certification or a guarantee for every input. |
| AI summary / AI translation | Not present; browser inference is possible but model choice is unresolved | Could download a commercial-use-licensed model lazily and run in WASM/WebGPU, with significant first-download and device limits. Do not use NLLB-200 for this ad-supported project: its model card lists CC-BY-NC-4.0. No API or silent remote fallback. See `docs/pdf-parity-zero-cost-research.md`. |
| Workflow automation, Drive/Dropbox, mobile/desktop apps, team features | Out of scope | These require accounts, integrations, or separate applications and are not prerequisites for a free static site. |

## Language coverage

The screenshot contains **26** iLovePDF languages: English, Spanish, French, German, Italian, Portuguese, Japanese, Russian, Korean, Simplified Chinese, Traditional Chinese, Arabic, Bulgarian, Catalan, Dutch, Greek, Hindi, Indonesian, Malay, Polish, Swedish, Thai, Turkish, Ukrainian, Vietnamese, and Kiswahili.

UsefulVerse has 16 core locale routes. The 12 additional PDF-only locales are Italian, Traditional Chinese, Bulgarian, Catalan, Dutch, Greek, Malay, Polish, Swedish, Thai, Ukrainian, and Kiswahili. Bengali and Urdu are existing extras, so the PDF suite now covers **28** languages total. The additional locales are deliberately scoped to PDF tools and must not be represented as full-site translations.

New locale pages must have translated PDF tool UI, title/description/FAQ, correct `lang`/`dir`, canonical, reciprocal `hreflang`, and sitemap entries. If a non-PDF tool is not translated for a new locale, do not publish a translated-looking URL that silently contains English; scope that locale's catalog explicitly instead.

The 1,609-URL release was merged through PR #23 and deployed to Cloudflare Pages on 2026-10-01. Post-deploy checks returned HTTP 200 for English, Italian, Traditional Chinese and Kiswahili PDF routes; the public sitemap returned 1,609 `<loc>` entries and `robots.txt` points to it. Camera capture, HTML-to-PDF, PDF/A-1b visual-copy export, the visual replacement editor, and the four limited PDF↔Excel/PowerPoint paths run locally in the browser. Their limitations above are part of the product contract, not promises of native editing or layout-perfect conversion. QES/certified signatures, cloud sync and broad local AI are not included or implied by the local feature set.

## Release acceptance

- All implemented actions run in a browser worker or browser APIs; no server-side file processing is introduced.
- Every operation is covered by tests for normal input, invalid/empty input, and a security or memory edge case.
- Tests and production build pass; generated locale routes and sitemap alternates point only to existing, genuinely localized pages.
- Every new UI path is manually exercised in a real browser on desktop and a narrow/mobile viewport before claiming it works. PDF→Excel, PDF→PowerPoint and both Office print-view directions have been smoke-tested locally with synthetic sample files; this is not exhaustive compatibility or security testing.
- Production is not called “at parity” while any capability above remains missing, partial, or not responsibly reproducible.
