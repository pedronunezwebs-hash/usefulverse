# Local translation queue

> **Ejecución vigente · 20-oct-2026:** modelos y traducción pesada **solo en GitHub Actions del repo público**;
> nunca descargar pesos ni ejecutar este setup en el Mac de Pedro (AGENTS y RUNBOOK §3/§8).
> El piloto reanudable ya existe: [evidencia y comandos](../../docs/quality/translation-pilot.md).
> Los comandos de instalación locales de abajo describen el mecanismo histórico para una máquina de cómputo desechable;
> no autorizan a usarlos en el Mac. Las salidas actuales del piloto siguen en `machine-draft`, sin idiomas aprobados.

This runner implements the SQLite memory and resumable M2M100 draft stages from
`docs/planning/usefulverse-1000-2026-10-19/METODO-TRADUCCION.md`. It has no
hosted translation API. Generated text remains a draft until it has passed
human review and is imported with `status=approved`.

## Local setup

Keep the Python environment, Hugging Face cache, converted weights, and database
inside the temporary checkout. The defaults are ignored by Git:

```sh
python3 -m venv .translation-env
.translation-env/bin/pip install -r scripts/localization/translation-requirements.txt
mkdir -p .hf-cache .translation-models
HF_HOME="$PWD/.hf-cache" .translation-env/bin/ct2-transformers-converter \
  --model facebook/m2m100_418M \
  --revision 55c2e61bbf05dfb8d7abccdc3fae6fc8512fd636 \
  --output_dir "$PWD/.translation-models/m2m100-418M-int8" \
  --quantization int8 --low_cpu_mem_usage
```

The model repository does not contain `tokenizer.json`; the queue reads its
SentencePiece model and vocabulary from the pinned Hugging Face snapshot in the
task-local `.hf-cache`. The runner defaults to that cache even when `HF_HOME`
is unset.

The first conversion downloads the pinned M2M100 source weights. It does not
call a paid provider. Telugu is excluded from M2M100 and must use the separately
pinned MADLAD path after its pilot. `zh-TW` applies OpenCC `s2twp` after M2M100;
that changes script and common regional forms but is not a substitute for review.

For the separate Telugu pilot, convert the pinned MADLAD T5 checkpoint locally:

```sh
HF_HOME="$PWD/.hf-cache" .translation-env/bin/ct2-transformers-converter \
  --model google/madlad400-3b-mt \
  --revision fa184c675da0b5c9e1c8694fccd4e12e2d422094 \
  --output_dir "$PWD/.translation-models/madlad400-3b-int8" \
  --quantization int8 --low_cpu_mem_usage
```

The runner accepts that model only as a separate `translate te` job so the 3B
model is never resident alongside M2M100. MADLAD uses the `<2te>` target tag;
translate a small reviewed sample and measure peak memory before queuing more.

## Work cycle

The product has 37 locales in total: canonical English plus 36 translated
destinations, including Norwegian Bokmål (`nb-NO`) for the extra `/nb` tool
routes.

The input is a UTF-8 JSON array or `{ "units": [...] }` with stable `key`,
English `source`, semantic `context`, and optional product `locales` per row.
Placeholders, URLs, inline code, HTML tags, and numbers are masked before
translation and checked after restoration. The key is stable within the owning
tool; memory reuse additionally requires exact source hash, semantic context,
locale, and protected-token signature.

```sh
.translation-env/bin/python scripts/localization/translation-queue.py extract units.json
.translation-env/bin/python scripts/localization/translation-queue.py extract-batch .translation-data/*-active.json
node scripts/localization/import-pending-tool-drafts.mjs .translation-data/pending-tool-drafts.jsonl
.translation-env/bin/python scripts/localization/translation-queue.py extract-batch .translation-data/current-candidate-sources/*.json
.translation-env/bin/python scripts/localization/translation-queue.py import-drafts .translation-data/pending-tool-drafts.jsonl
HF_HOME="$PWD/.hf-cache" USEFULVERSE_M2M100_THREADS=4 .translation-env/bin/python scripts/localization/translation-queue.py translate es --limit 250
.translation-env/bin/python scripts/localization/translation-queue.py review-export review.csv
# Prepare one reviewer CSV per candidate and required auxiliary copy pack.
python3 scripts/localization/export-review-packages.py
# Export one candidate's current machine drafts and source hashes for focused review.
.translation-env/bin/python scripts/localization/translation-queue.py review-export .translation-data/review-chemical-name-resolver.csv --tool chemical-name-resolver
# Review the translations in the CSV and mark only accepted rows as "approved".
.translation-env/bin/python scripts/localization/translation-queue.py review-import review.csv
# Import approved rows from all reviewed tool packets in one resumable pass.
.translation-env/bin/python scripts/localization/translation-queue.py review-import .translation-data/review-packets-by-tool/
.translation-env/bin/python scripts/localization/translation-queue.py validate
.translation-env/bin/python scripts/localization/translation-queue.py revalidate-drafts
node scripts/localization/extract-tool-copy-units.mjs src/growth600/locales/pending-tools.en.mjs pendingToolEnglishCopy fancy-text-generator .translation-data/fancy-text.json
node scripts/localization/export-approved-tool-copy.mjs .translation-data/fancy-text.json fancy-text-generator src/growth600/locales/fancy-text-final.mjs
```

By default, `translate` processes every pending key for each selected locale in
one model session, committing bounded SQLite batches. Use `--limit` to cap rows
per locale for a pilot. If interrupted, run it again: only pending keys are read.
A translation run can include several tool packages by repeating `--tool slug`;
this keeps one local model session open while it processes the selected prefixes.
The default beam width is two; `--beam-size 1` is available when CPU throughput
matters more and remains an unapproved machine draft in the review packets.
A local CPU run can set `USEFULVERSE_M2M100_THREADS`; it is capped at the host's
logical CPU count and defaults to four threads. Tune it to the available machine
while leaving enough capacity for the rest of the desktop session.
A translation that loses a protected marker is moved to `needs-review`. Source
changes invalidate the old draft and requeue that key.
Numeric token boundaries use ASCII identifier characters so adjacent letters in
non-Latin writing systems do not hide an otherwise preserved number. The
`revalidate-drafts` command reconciles machine-only placeholder flags in both
directions: it clears false positives and sends newly detected token mismatches
to review. It never records review provenance or approves a row.
The CSV import requires a current source hash, an explicit approved status, an
exact protected-token signature, a reviewer identifier, and an ISO date for the
review. Review identity is self-reported and is not authenticated, so exported
locale metadata records that identifier and never claims the site owner approved
the translation. Do not fill review fields for machine drafts that have not
actually been checked.

`export-review-packages.py` snapshots available candidate and required auxiliary
rows into one CSV per tool under `.translation-data/review-packets-by-tool/`.
Each packet contains all 36 destination locales alongside the English source, with status counts in
`manifest.json` and an import guide in `REVIEW-README.md`. The optional
`--group-by locale` exports the same rows as one CSV per destination language.
Rerun the export after new copy is extracted or draft translation batches finish;
a prior snapshot does not include later queue changes. Candidates without source
copy are listed in the manifest and cannot be reviewed or published yet.

`validate` is deliberately strict: machine drafts are not release-ready. It
fails while any row is pending, failed, under review, or not explicitly
approved. Export to product locale modules should happen only after this gate
passes and all 37 product locales have complete approved rows.
