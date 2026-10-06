# Asset budgets

These limits guard the shared shell and deferred code bundles; they are not a
PageSpeed score and do not replace testing a tool's behavior. They are based on
the current minified build and leave room for incremental changes. The build
fails if a listed bundle exceeds its cap, so a new dependency cannot silently
inflate code sent to every visitor.

| Asset | Observed bytes | Build cap |
| --- | ---: | ---: |
| `app.js` | 60,777 | 72 KiB |
| `styles.css` | 45,137 | 54 KiB |
| `new-tools.js` | 25,631 | 32 KiB |
| `expanded-tools.js` | 30,070 | 40 KiB |
| `advanced-tools.js` | 40,853 | 52 KiB |
| `media-tools.js` | 9,583 | 16 KiB |
| `plan-tools.js` | 43,326 | 55 KiB |
| `tool-suite-tools.js` | 116,772 | 150 KiB |
| `opportunity-runtime.js` | 99,235 | 128 KiB |
| each locale runtime | 280,881 max (Tamil) | 320 KiB |

Three small tool-logic bundles are capped at 16 KiB each. Independent large
engines and model/WASM assets are intentionally excluded from these JavaScript
budgets: they have separate lazy-loading and Cloudflare's per-file Pages limit.
If a legitimate feature needs to exceed a budget, split it behind an explicit
user action or document and review the exception rather than silently raising
the shared payload.
