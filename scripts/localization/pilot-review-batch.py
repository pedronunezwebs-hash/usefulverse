#!/usr/bin/env python3
"""Read existing S/F/B evidence for 1–5 locales; never infer, grade or approve."""
import argparse
from collections import Counter
import hashlib
import importlib.util
import json
from pathlib import Path

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
LOW_RESOURCE = frozenset({'ha', 'am', 'te', 'gu', 'ta', 'mr', 'sw'})


def prepare(checkpoint, locales, source_snapshot=None):
    if not 1 <= len(locales) <= 5 or len(locales) != len(set(locales)) or 'en' in locales:
        raise ValueError('Choose 1–5 distinct destination locales')
    raw = Path(checkpoint).read_bytes()
    available = {}
    for line in raw.decode('utf-8').splitlines():
        row = json.loads(line)
        pilot.validate_record(row)
        identity = row['record_id']
        if identity in available and available[identity] != row:
            raise ValueError('Conflicting duplicate checkpoint record')
        available[identity] = row
    missing = set(locales) - {row['locale'] for row in available.values()}
    if missing:
        raise ValueError('No existing records for: ' + ', '.join(sorted(missing)))
    pilot.v24_quantity_contracts()  # Checks the frozen corpus against its actual source files.
    profile = pilot.POLICIES['context-v24']['numeric_profile']
    manifest_raw = (pilot.ROOT / profile['manifest']).read_bytes()
    if hashlib.sha256(manifest_raw).hexdigest() != profile['manifest_sha256']:
        raise ValueError('Changed canonical source manifest')
    manifest = json.loads(manifest_raw)
    snapshot = source_snapshot or pilot.ROOT / 'docs/quality/translation-pilot/numeric-sources/context-v24/source-snapshot.json'
    source_raw = Path(snapshot).read_bytes()
    if hashlib.sha256(source_raw).hexdigest() != manifest['source_snapshot_sha256']:
        raise ValueError('Changed canonical source/context snapshot')
    units = {unit['key']: unit for unit in json.loads(source_raw)['units']}
    rows = []
    for locale in locales:
        for row in sorted((r for r in available.values() if r['locale'] == locale), key=lambda r: (r['key'], r['candidate'], r['record_id'])):
            unit = units.get(row['key'])
            if unit is None or any(row[field] != unit[field] for field in ('source', 'source_hash')) or row.get('context', unit['context']) != unit['context']:
                raise ValueError('Existing evidence differs from the canonical source/context')
            rows.append({'record_id': row['record_id'], 'record_sha256': pilot.digest(row),
                         'canonical_context': unit['context'],
                         'warnings': [key for key, failed in pilot.record_flags(row).items() if failed],
                         'evidence': row})
    counts = {locale: dict(Counter(r['evidence']['candidate'] for r in rows if r['evidence']['locale'] == locale)) for locale in locales}
    requirements = {locale: {'minimum_model_source_units': 80 if locale in LOW_RESOURCE else 40,
                             'existing_distinct_model_sources': len({r['evidence']['source_hash'] for r in rows if r['evidence']['locale'] == locale and r['evidence']['candidate'] == 'model'}),
                             'review_and_full_gate_still_required': True} for locale in locales}
    return {'schema_version': 1, 'purpose': 'Direct review of existing source/forward/back evidence; no new inference or approval',
            'checkpoint_sha256': hashlib.sha256(raw).hexdigest(), 'locales': locales, 'counts': counts,
            'source_snapshot_sha256': hashlib.sha256(source_raw).hexdigest(),
            'reference_requirements': requirements,
            'inference_calls': 0, 'approved_locales': [], 'review_required': True, 'rows': rows}


def markdown(batch):
    lines = ['# Revisión de evidencia existente', '',
             'Fuente/ida/vuelta sin inferencia nueva. Cada idioma conserva su evaluación independiente.',
             'Todos los avisos requieren decisión explícita; no hay notas ni aprobaciones automáticas.',
             'Checkpoint SHA256: ' + batch['checkpoint_sha256'], '']
    for locale, required in batch['reference_requirements'].items():
        lines += [locale + ': ' + str(required['existing_distinct_model_sources']) + ' fuentes modelo existentes; mínimo requerido ' + str(required['minimum_model_source_units']) + '. Revisión y puerta completa pendientes.', '']
    for item in batch['rows']:
        row = item['evidence']
        lines += ['## ' + row['locale'] + ' · ' + row['candidate'] + ' · ' + row['key'], '',
                  'Registro: ' + item['record_id'] + ' · SHA256: ' + item['record_sha256'],
                  'Contexto canónico: ' + item['canonical_context'],
                  'Fuente SHA256: ' + row['source_hash'],
                  'Motor: ' + row['engine'] + ' · revisión: ' + row['engine_revision'],
                  'Avisos: ' + ', '.join(item['warnings']), '',
                  'Fuente:', '```json', json.dumps(row['source'], ensure_ascii=False), '```',
                  'Ida:', '```json', json.dumps(row['translation'], ensure_ascii=False), '```',
                  'Vuelta:', '```json', json.dumps(row['back_translation'], ensure_ascii=False), '```', '']
    return '\n'.join(lines) + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--checkpoint', type=Path, default=pilot.ROOT / 'docs/quality/translation-pilot/checkpoints/madlad.jsonl')
    parser.add_argument('--locales', required=True, help='1–5 existing destinations, e.g. bn,ru,ur')
    parser.add_argument('--format', choices=['json', 'markdown'], default='markdown')
    args = parser.parse_args()
    batch = prepare(args.checkpoint, args.locales.split(','))
    print(json.dumps(batch, ensure_ascii=False, indent=2) if args.format == 'json' else markdown(batch), end='\n')


if __name__ == '__main__':
    main()
