Vendored browser files from the `cubejs` npm package, version 1.3.2.

- Upstream: https://github.com/ldez/cubejs
- License: MIT, retained in `LICENSE`.
- `cube.js` is imported by the page controller for facelet parsing and legality checks.
- `package.json` marks the copied upstream `.js` files as CommonJS so the local browser bundler can interoperate with the original package format.
- `worker.js`, `cube.js`, and `solve.js` are also copied to versioned static assets by `scripts/build-growth600.mjs`; the worker builds its lookup tables off the UI thread.
- The upstream source files are copied unmodified.
