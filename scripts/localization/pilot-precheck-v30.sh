#!/usr/bin/env bash
set -euo pipefail
# Full suite remains in every PR/final CI. Old profiles keep their full precheck.
# V30 checks the new contracts and unchanged historical runtime before inference.
if [ "${PILOT_POLICY:-}" = "context-v30" ]; then
  PYTHONPATH=scripts/localization python -m unittest \
    test_translation_russian_v30 \
    test_translation_balanced_runner \
    test_translation_parallel_runner \
    test_translation_bengali_v29.BengaliV29Test.test_adapter_keeps_generic_assertions_and_only_three_workflow_edits \
    test_translation_bengali_v28.BengaliV28Test.test_workflow_only_adds_the_v28_choice_and_description_without_cost_or_publish_changes
else
  python scripts/localization/run-translation-tests.py --jobs 4
fi
