# iLovePDF capability audit and UsefulVerse implementation plan

Research date: 2026-10-01. Scope: public iLovePDF feature catalog and pricing page, compared with UsefulVerse's 82-tool, 16-language static build. This is a product-fit audit, not a claim that the two products are equivalent.

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

UsefulVerse already had PDF merge/split/compression, images-to-PDF, PDF-to-images, common image conversions, local Office-package recompression, and media compression/transcription. The 14 additions below are now implemented as static, browser-local tools and have their own localized routes in all 16 site languages:

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

There are 14 catalog additions because page editing and page stamping share one URL, filling/signing share one URL, and PDF-to-Markdown is a separate text-only workflow. The catalog and sitemap are generated at build time; the production sitemap lists every localized route after deployment.

## Not in the zero-backend scope

Do not copy iLovePDF's account/cloud workflows, team collaboration, paid API, remote signature requests, AI summarization/translation, or claim certified e-signatures. Do not call a reconstructed raster document “editable Word,” a black overlay “secure redaction,” or an output PDF/A without a validator and conformance proof. PDF page cropping and direct text editing still need a dedicated visual editor; protect/unlock, repair, Excel/PowerPoint conversion and high-fidelity Office rendering require separate compatibility/security validation; a shortcut that can damage files is worse than an honest missing feature.

## Release checklist

The static build generates 82 tools in 16 languages plus localized home pages and the existing English guides. Its checks verify canonicals, reciprocal `hreflang`, localized visible UI, tool FAQs, contextual related-tool links, sitemap URL counts and Cloudflare Pages' per-file 25 MiB asset limit. Unit tests cover calculator math, a restricted scientific-expression parser and malicious ZIP cases. Before calling the release complete, run browser-based smoke tests, all repository checks, inspect the final diff, merge through GitHub, wait for the existing Cloudflare Pages workflow, and check the published pages and sitemap. IndexNow acceptance is a crawl notification, not proof of indexing.

## User-facing guarantees and limits

State that selected files are processed in the browser when that is true, and that our server does not receive the file. Do not say “100% secure” or promise an infinite file size: the browser, memory, storage, codecs and device remain practical constraints. The 25 MiB Cloudflare Pages asset limit applies to files we publish (including models), not to user-selected files processed locally. Any model is optional and loads only when that tool is used. Static delivery currently has no per-file conversion charge, but hosting/provider terms can change; GitHub Actions has its own included-minute/billing terms.

## Sources

- [iLovePDF feature catalog](https://www.ilovepdf.com/features)
- [iLovePDF pricing and usage limits](https://www.ilovepdf.com/pricing)
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Transformers.js MODNet model](https://huggingface.co/Xenova/modnet)
- [Tesseract.js PDF FAQ](https://github.com/naptha/tesseract.js/blob/master/docs/faq.md)
- [fflate](https://github.com/101arrowz/fflate)
