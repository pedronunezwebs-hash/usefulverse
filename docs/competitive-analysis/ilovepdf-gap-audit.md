# iLovePDF capability audit and UsefulVerse implementation plan

Research date: 2026-10-01. Scope: public iLovePDF feature catalog and pricing page, compared with UsefulVerse's current 88-tool, 16-language static build. This is a product-fit audit, not a claim that the two products are equivalent.

## What iLovePDF offers

Its public catalog groups the work into organize, optimize, convert, edit, security and intelligence:

- Organize: merge, split, remove/extract pages, reorder, and scan to PDF.
- Optimize: compression, repair and OCR.
- Convert: JPG/Word/PowerPoint/Excel/HTML to PDF; PDF to JPG/Word/PowerPoint/Excel/PDF-A.
- Edit: rotate, page numbers, watermarks, crop, edit and PDF forms.
- Security: unlock, protect, sign, redact and compare.
- Intelligence: summarization, translation and PDF-to-Markdown.
- Product workflow: web, desktop/mobile apps, cloud-storage integrations, batches, team workflows, accounts and paid plans.

## UsefulVerse baseline and product decision

UsefulVerse already had PDF merge/split/compression, images-to-PDF, PDF-to-images, common image conversions, local Office-package recompression, and media compression/transcription. The local branch has added PDF workflow routes for editing/organizing, form filling and visual signatures, compare, OCR/text extraction, text-first Word workflows, PDF-to-Markdown, password protection/unlock, repair, crop, permanent redaction, HTML-to-PDF and PDF/A-1b image-copy export. These routes are in the existing 16 languages; the branch remains unmerged and unpublished:

1. PDF page organizer/editor: reorder, rotate, extract and remove pages; add page numbers and text/image watermarks.
2. PDF form filling and drawn signature placement on supported forms. The signature is visual, not a certified or identity-verified e-signature.
3. PDF comparison by selectable text and page; it does not compare rendered pixels, annotations or signatures.
4. PDF text extraction and scanned-page OCR. It exports recognized text, not a reconstructed searchable PDF; OCR can be wrong and first-use language data is served as static files.
5. Text-first PDF↔DOCX workflows. They do not preserve complex layout, tables, fonts or artwork and do not support legacy DOC.
6. ZIP creation and extraction with file-count and expanded-size caps. ZIP64, encrypted/password archives and unsupported methods are rejected.
7. Audio/video conversion and trimming where browser codecs allow it. There is no universal format promise; memory, speed and codec support vary by device.
8. Scientific, loan and compound-interest calculators, with tested formulas and financial caveats.
9. Local invoice and CV builders with print-to-PDF; drafts are not uploaded or saved to a server.
10. Optional portrait background removal using a pinned, locally hosted Apache-2.0 model. It is person-focused matting, not a universal object cutout.
11. PDF-to-Markdown text extraction with page headings, reusing the existing PDF reader; scanned pages need OCR and layout, tables and images are not reconstructed.

The catalog and sitemap are generated at build time; the production sitemap lists every localized route after deployment. This local branch builds 1,609 URLs: 88 core tools × 16 locales (1,408), 16 core home pages, 15 PDF-suite tools × 12 additional PDF-only locales (180), and 5 English guides. These counts do not describe production until a release is intentionally merged and deployed.

## Not in the zero-backend scope

Do not copy iLovePDF's account/cloud workflows, team collaboration, paid API, or remote signature requests by default. A local cryptographic signature using a certificate supplied by the visitor is different from a certified/QES signature; do not make an identity or legal-effect claim without validation and jurisdictional review. A browser-based model is possible only after checking model license, size, quality and device behavior. Do not call a reconstructed raster document “editable Word,” a black overlay “secure redaction,” or an output PDF/A a certified result. UsefulVerse's PDF/A-1b visual-copy route passed veraPDF on synthetic development samples and a file emitted by the browser workflow, but it does not validate every visitor's output. The PDF editor offers visual cover-and-replace, not native editing of text/image objects; edited pages are rasterized. PDF↔Excel/PowerPoint routes now exist as explicitly limited local conversions: text-position extraction to spreadsheets, image-only slides, and browser print views for office files—not full-fidelity Office round trips. These paths were smoke-tested with synthetic browser samples; exhaustive compatibility/security testing remains separate. A two-page synthetic browser redaction run produced a structurally readable PDF whose text extraction was empty and whose masked content rendered as opaque black; broader security QA against hostile and complex PDFs remains required. Camera capture and HTML-to-PDF have browser-local implementations; camera support does not automatically correct perspective. Password protection/unlock (AES-256, current password required) and best-effort repair still need release/browser verification before being described as published. See `docs/pdf-parity-zero-cost-research.md` for the cost-free implementation paths and conditions.

## Release checklist

The current local branch build generates 1,609 URLs: 88 core tools × 16 languages, 16 core home pages, 15 PDF-suite tools × 12 additional PDF-only languages, and 5 English guides. Its checks verify canonicals, reciprocal `hreflang`, localized visible UI, tool FAQs, contextual related-tool links, sitemap URL counts and Cloudflare Pages' per-file 25 MiB asset limit. Unit tests cover calculators, malicious ZIP cases, QPDF operations, Office packages and raster safety budgets. Local browser smoke tests exercised the PDF page editor, PDF→Excel, PDF→PowerPoint, Excel→PDF print view and PowerPoint→PDF print view using synthetic files; they do not guarantee support for every real-world file. A synthetic PDF was also converted through the browser UI, reopened with PDF.js, and passed veraPDF's PDF/A-1b profile. Before production release, inspect the complete diff, run the release regression/security review, intentionally merge through GitHub, wait for the existing Pages workflow, and check published routes and sitemap. IndexNow acceptance is a crawl notification, not proof of indexing. The 12 additional languages cover the PDF cluster only, not all UsefulVerse tools.

## User-facing guarantees and limits

State that selected files are processed in the browser when that is true, and that our server does not receive the file. Do not say “100% secure” or promise an infinite file size: the browser, memory, storage, codecs and device remain practical constraints. The 25 MiB Cloudflare Pages asset limit applies to files we publish (including models), not to user-selected files processed locally. Any model is optional and loads only when that tool is used. Static delivery currently has no per-file conversion charge, but hosting/provider terms can change; GitHub Actions has its own included-minute/billing terms.

## Sources

- [iLovePDF feature catalog](https://www.ilovepdf.com/features)
- [iLovePDF pricing and usage limits](https://www.ilovepdf.com/pricing)
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Transformers.js MODNet model](https://huggingface.co/Xenova/modnet)
- [Tesseract.js PDF FAQ](https://github.com/naptha/tesseract.js/blob/master/docs/faq.md)
- [fflate](https://github.com/101arrowz/fflate)
