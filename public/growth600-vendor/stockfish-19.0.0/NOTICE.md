# Stockfish.js 19.0.0 — Lite, single-threaded WASM

These unmodified engine files are distributed under GNU GPL version 3.0. The
complete license is in `LICENSE-GPL-3.0.txt`.

- Upstream project and corresponding source: https://github.com/nmrugg/stockfish.js/tree/v19.0.0
- Upstream engine source: https://github.com/official-stockfish/Stockfish/tree/sf_19
- Release containing the exact browser build: https://github.com/nmrugg/stockfish.js/releases/tag/v19.0.0
- Package: `stockfish@19.0.0`, files `stockfish-19-lite-single.js` and
  `stockfish-19-lite-single.wasm`.

The engine is a separate, lazily started Web Worker. UsefulVerse does not bundle
it into its page controller or send positions to a server. The lite engine is
single-threaded and its analysis strength is lower than the full Stockfish
engine.
