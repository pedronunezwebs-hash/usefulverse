# NO032 STEP importer source and notices

NO032 uses the unmodified npm distribution of `occt-import-js` 0.0.23 and Open CASCADE Technology 7.6.1. The STEP engine is stored separately and is loaded only after the visitor selects a STEP file and chooses display units.

- `occt-import-js` release tag: `0.0.23`, commit `c2148e54b456b571238d35cac037d304053d64b2`
- npm package: `occt-import-js@0.0.23`, integrity `sha512-RFfYQXYFX5C1mB1Aywm0ShcUKzXOr/VzTnlzhBSDJOR6YCAPt1HYCzeXWg1vwwjn/cUxwqRNhhtf1dlewoZYCQ==`
- Embedded Open CASCADE source tag: `V7_6_1`, commit `d2abb6d844231cb8f29be6894440874a4700e4a5`
- Source: [occt-import-js 0.0.23](https://github.com/kovacsv/occt-import-js/tree/0.0.23), [Open CASCADE V7_6_1](https://github.com/Open-Cascade-SAS/OCCT/tree/V7_6_1)
- The importer is LGPL-2.1. OCCT is LGPL-2.1 with the Open CASCADE exception. The license texts and exception are shipped beside the generated tool assets.
- Upstream distribution hashes (SHA-256):
  - `occt-import-js.js`: `3fb44ce11d00611f9b3f3c5775d520ebab48930c1f08279b7b1316f05f0d3379`
  - `occt-import-js.wasm`: `33391fc9d94ea5c869a6718488bf0a9a464222bac9bdc764dfe1690cef281952`
- The upstream glue and WASM files are not modified or minified. NO032's separate worker source is in `src/markets-no-ch/model3d-step-worker.js` and can be served/replaced independently. The worker points to the separately loaded WASM through `locateFile`.
- The upstream npm registry did not contain version `0.0.24`; do not silently switch to the unreleased repository head. A future upgrade must pin a release/commit, update both source links and notices, verify hashes, and rerun the STEP fixtures.

This records the technical source chain and redistribution notices for this local build; it is not a legal opinion.
