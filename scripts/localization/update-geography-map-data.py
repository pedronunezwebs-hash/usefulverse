#!/usr/bin/env python3
"""Refresh the compact, public-domain Natural Earth country outline module."""
from __future__ import annotations
import io
import json
import math
import struct
import urllib.request
import zipfile
from datetime import date
from pathlib import Path

URL = 'https://naturalearth.s3.amazonaws.com/50m_cultural/ne_50m_admin_0_map_units.zip'
OUT = Path(__file__).resolve().parents[2] / 'src/markets-no-ch/geography-quiz-data.mjs'


def dbf_records(raw: bytes) -> list[dict[str, str]]:
    count = struct.unpack_from('<I', raw, 4)[0]
    header_len, record_len = struct.unpack_from('<HH', raw, 8)
    fields = []
    pos = 32
    while raw[pos] != 13:
        descriptor = raw[pos:pos + 32]
        name = descriptor[:11].split(b'\0', 1)[0].decode('ascii').strip()
        width = descriptor[16]
        fields.append((name, width))
        pos += 32
    records = []
    for row in range(count):
        data = raw[header_len + row * record_len:header_len + (row + 1) * record_len]
        if not data or data[0] == 42:
            records.append({})
            continue
        offset = 1
        values = {}
        for name, width in fields:
            values[name] = data[offset:offset + width].decode('latin-1').replace('\0', '').strip()
            offset += width
        records.append(values)
    return records


def simplify(points: list[tuple[float, float]], tolerance: float = 0.16) -> list[tuple[float, float]]:
    if len(points) < 5:
        return points
    keep = {0, len(points) - 1}
    stack = [(0, len(points) - 1)]
    while stack:
        first, last = stack.pop()
        ax, ay = points[first]; bx, by = points[last]
        dx, dy = bx - ax, by - ay
        denom = dx * dx + dy * dy
        best, best_i = 0.0, -1
        for i in range(first + 1, last):
            px, py = points[i]
            if denom:
                t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / denom))
                distance = math.hypot(px - (ax + t * dx), py - (ay + t * dy))
            else:
                distance = math.hypot(px - ax, py - ay)
            if distance > best:
                best, best_i = distance, i
        if best_i >= 0 and best > tolerance:
            keep.add(best_i); stack.extend(((first, best_i), (best_i, last)))
    result = [points[i] for i in sorted(keep)]
    return result if len(result) >= 4 else points[:4]


def svg_point(lon: float, lat: float) -> tuple[float, float]:
    x = (lon + 180.0) * (1200.0 / 360.0)
    y = (85.0 - max(-85.0, min(85.0, lat))) * (600.0 / 170.0)
    return round(x, 1), round(y, 1)


def shp_shapes(raw: bytes) -> list[list[list[tuple[float, float]]]]:
    shapes = []
    pos = 100
    while pos + 8 <= len(raw):
        content_words = struct.unpack_from('>I', raw, pos + 4)[0]
        length = content_words * 2
        body = raw[pos + 8:pos + 8 + length]
        shape_type = struct.unpack_from('<I', body, 0)[0]
        rings = []
        if shape_type == 5:
            parts_n, points_n = struct.unpack_from('<II', body, 36)
            parts = struct.unpack_from('<' + 'I' * parts_n, body, 44)
            points_pos = 44 + 4 * parts_n
            coords = [struct.unpack_from('<dd', body, points_pos + i * 16) for i in range(points_n)]
            starts = list(parts) + [points_n]
            for start, end in zip(starts, starts[1:]):
                ring = simplify(coords[start:end])
                if len(ring) >= 4:
                    rings.append(ring)
        shapes.append(rings)
        pos += 8 + length
    return shapes


def path_for(rings: list[list[tuple[float, float]]]) -> str:
    commands = []
    for ring in rings:
        coords = [svg_point(lon, lat) for lon, lat in ring]
        if len(coords) < 4:
            continue
        commands.append(f'M{coords[0][0]} {coords[0][1]}' + ''.join(f'L{x} {y}' for x, y in coords[1:]) + 'Z')
    return ''.join(commands)


def main() -> None:
    request = urllib.request.Request(URL, headers={'User-Agent': 'UsefulVerse local geography data refresh'})
    with urllib.request.urlopen(request, timeout=45) as response:
        archive = zipfile.ZipFile(io.BytesIO(response.read()))
    shp_name = next(name for name in archive.namelist() if name.endswith('.shp'))
    dbf_name = next(name for name in archive.namelist() if name.endswith('.dbf'))
    shapes, properties = shp_shapes(archive.read(shp_name)), dbf_records(archive.read(dbf_name))
    if len(shapes) != len(properties) or len(shapes) < 150:
        raise SystemExit('Unexpected Natural Earth country table geometry count; output left untouched.')
    features = []
    seen = set()
    for rings, row in zip(shapes, properties):
        if not rings:
            continue
        a3 = row.get('ISO_A3_EH') or row.get('ISO_A3') or row.get('ADM0_A3') or ''
        if len(a3) != 3 or a3 == '-99':
            a3 = row.get('ADM0_A3') or row.get('SU_A3') or ''
        if len(a3) != 3 or a3 == '-99':
            a3 = 'NE'
        feature_id = a3 if a3 not in seen else f"{a3}-{row.get('NE_ID') or len(features)}"
        seen.add(feature_id)
        a2 = row.get('ISO_A2_EH') or row.get('ISO_A2') or ''
        if len(a2) != 2 or a2 == '-99':
            a2 = ''
        path = path_for(rings)
        if path:
            features.append({'id': feature_id, 'iso2': a2, 'name': row.get('NAME_EN') or row.get('NAME') or row.get('ADMIN') or feature_id,
                'continent': row.get('CONTINENT') or '', 'subregion': row.get('SUBREGION') or '', 'path': path})
    if len(features) < 240 or not any(item['iso2'] == 'NO' for item in features) or not any(item['iso2'] == 'CH' for item in features):
        raise SystemExit('Unexpected country coverage; output left untouched.')
    payload = json.dumps(features, ensure_ascii=False, separators=(',', ':'))
    source = f"// Natural Earth 5.1.1 Admin 0 map units; public-domain vector geometry. Downloaded {date.today().isoformat()}.\nexport const geographyMapUpdatedAt = '{date.today().isoformat()}';\nexport const geographyMapSource = 'Natural Earth 5.1.1 · Admin 0 Map Units · public domain';\nexport const geographyMapFeatures = Object.freeze({payload});\n"
    temp = OUT.with_suffix('.mjs.tmp')
    temp.write_text(source, encoding='utf-8')
    temp.replace(OUT)
    print(f'Wrote {len(features)} outline features ({len(payload)} JSON characters) to {OUT}')


if __name__ == '__main__':
    main()
