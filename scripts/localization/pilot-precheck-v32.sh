#!/usr/bin/env bash
set -euo pipefail
if [ "${PILOT_POLICY:-}" = "context-v32" ]; then
  PYTHONPATH=scripts/localization python -m unittest \
    test_translation_russian_v32 \
    test_translation_english_memo_v31 \
    test_translation_balanced_runner \
    test_translation_parallel_runner \
    test_translation_pilot.TranslationPilotTest.test_observed_semantic_errors_are_rejected_even_when_tokens_survive \
    test_translation_bengali_v29.BengaliV29Test.test_adapter_keeps_generic_assertions_and_only_three_workflow_edits \
    test_translation_bengali_v28.BengaliV28Test.test_workflow_only_adds_the_v28_choice_and_description_without_cost_or_publish_changes
else
  bash scripts/localization/pilot-precheck-v31.sh
fi
