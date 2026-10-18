# DXF parser source and redistribution record

- Package: `dxf-parser` 1.1.2, pinned in `package.json` and `package-lock.json`.
- License: MIT; verbatim package license is `DXF-PARSER-MIT-LICENSE.txt`.
- Exact npm tarball: `https://registry.npmjs.org/dxf-parser/-/dxf-parser-1.1.2.tgz`.
- npm integrity: `sha512-GPTumUvRkounlIazLIyJMmTWt+nlg+ksS0Hdm8jWvejmZKBTz6gvHTam76wRm4PQMma5sgKLThblQyeIJcH79Q==`.
- Upstream source: `https://github.com/gdsestimating/dxf-parser/tree/4a164a1dcdbc7dbaae714fae9c2997157c1b5c13` (MIT).
- Runtime dependency `loglevel` 1.9.2 (MIT) is included in the local esbuild worker bundle; its notice is `LOGLEVEL-MIT-LICENSE.txt`. The production page does not request npm/CDN assets at runtime.
- Upstream package documentation describes support for most 2D entities, layers, blocks and text, with gaps for 3D solids and less common entities. This product intentionally draws only LINE, CIRCLE, ARC and straight 2D polylines; all other entity types are reported and excluded from measured/exported geometry.
- The upstream package is old (latest release 1.1.2); guardrails here include a 10 MB file cap, 200,000 group-record cap, a dedicated terminable worker, strict numeric/planarity checks, and no network-capable loader or entity execution.
- Binary DXF and DWG are intentionally unsupported. Export is rebuilt from the supported geometry primitives; untrusted DXF markup, scripts, links, fonts, images and external references are never embedded or fetched.
