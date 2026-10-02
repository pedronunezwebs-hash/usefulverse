#!/usr/bin/env python3
"""Create local-only Argos drafts from the structured translation input."""

import json
import re
import sys
from collections import Counter
from pathlib import Path

import ctranslate2
import argostranslate.translate
import argostranslate.settings
from opencc import OpenCC


TARGETS = {
    "it": "it", "zh_tw": "zh", "bg": "bg", "ca": "ca", "nl": "nl", "el": "el",
    "ms": "ms", "pl": "pl", "sv": "sv", "th": "th", "uk": "uk", "sw": "sw",
}
PROTECTED = re.compile(
    r"\{[A-Za-z][A-Za-z0-9_]*\}"
    r"|https?://[^\s<>]+"
    r"|`[^`]*`"
    r"|<\/?[A-Za-z][^>]*>"
    r"|PDF/A(?:-1b)?|PDF|PNG|JPEG|JPG|WebP|SVG|GIF|TIFF|TIF|HEIC|AVIF|DOCX|DOC|XLSX|XLS|PPTX|PPT|ODT|ODS|ODP|RTF|CSV|JSON|YAML|HTML|CSS|SQL|Markdown|MP3|MP4|M4A|WAV|OGG|Opus|WebM|UUID|SHA-256|Base64|QR|SEO|URL|WPM|GPA|Open Graph|Google Docs|Microsoft Word|PowerPoint|Excel|UsefulVerse|Code 128|veraPDF|sRGB|US Letter|A4|MB|MiB|dpi"
    r"|(?<!\w)\d+(?:[.,]\d+)*(?:%|°)?",
    re.IGNORECASE,
)
PLACEHOLDER = re.compile(r"\{[A-Za-z][A-Za-z0-9_]*\}")


def prose_bounds(text: str) -> tuple[str, str, str]:
    leading = re.match(r"^\s*", text).group(0)
    trailing = re.search(r"\s*$", text).group(0)
    content = text[len(leading):len(text) - len(trailing) if trailing else len(text)]
    return leading, content, trailing


def normalize(text: str, language: str) -> str:
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\s+(['’])\s*", r"\1", text)
    if language in {"zh", "zh_tw"}:
        text = re.sub(r"\s+([，。！？；：、])", r"\1", text)
        text = re.sub(r"([，。！？；：、])\s+", r"\1", text)
    return text.strip()


def translate_many(texts: list[str], translation) -> list[str]:
    """Run Argos/CTranslate2 once for a whole batch instead of once per phrase."""
    cached_translation = translation
    package_translation = cached_translation.underlying
    if hasattr(package_translation, "underlying"):
        package_translation = package_translation.underlying
    pkg = package_translation.pkg
    if package_translation.translator is None:
        package_translation.translator = ctranslate2.Translator(
            str(pkg.package_path / "model"),
            device=argostranslate.settings.device,
            inter_threads=argostranslate.settings.inter_threads,
            intra_threads=argostranslate.settings.intra_threads,
            compute_type=argostranslate.settings.compute_type,
        )

    groups = []
    tokenized_sentences = []
    for text in texts:
        line_groups = []
        for line in text.split("\n"):
            if not line.strip():
                line_groups.append(None)
                continue
            sentences = package_translation.sentencizer.split_sentences(line) or [line]
            indexes = []
            for sentence in sentences:
                indexes.append(len(tokenized_sentences))
                tokenized_sentences.append(pkg.tokenizer.encode(sentence))
            line_groups.append(indexes)
        groups.append(line_groups)

    if not tokenized_sentences:
        return texts[:]
    target_prefix = [[pkg.target_prefix]] * len(tokenized_sentences) if pkg.target_prefix else None
    batches = package_translation.translator.translate_batch(
        tokenized_sentences,
        target_prefix=target_prefix,
        replace_unknowns=True,
        max_batch_size=argostranslate.settings.batch_size,
        batch_type="tokens",
        beam_size=max(1, argostranslate.settings.beam_size),
        num_hypotheses=1,
        length_penalty=0.2,
        return_scores=True,
    )

    output = []
    for line_groups in groups:
        translated_lines = []
        for indexes in line_groups:
            if indexes is None:
                translated_lines.append("")
                continue
            tokens = [token for index in indexes for token in batches[index].hypotheses[0]]
            value = pkg.tokenizer.decode(tokens)
            if pkg.target_prefix and value.startswith(pkg.target_prefix):
                value = value[len(pkg.target_prefix):]
            if value.startswith(" "):
                value = value[1:]
            translated_lines.append(value)
        output.append("\n".join(translated_lines))
    return output


def mask_source(text: str) -> tuple[str, list[tuple[str, str]]]:
    spans = list(PROTECTED.finditer(text))
    markers = [f"QZXVPH{index:04d}QXZV" for index in range(len(spans))]
    chunks = []
    cursor = 0
    for marker, match in zip(markers, spans):
        chunks.extend((text[cursor:match.start()], marker))
        cursor = match.end()
    chunks.append(text[cursor:])
    return "".join(chunks), list(zip(markers, [match.group(0) for match in spans]))


def resolve_markers(value, translations):
    if isinstance(value, list):
        return [resolve_markers(item, translations) for item in value]
    if isinstance(value, dict):
        if "$translate" in value:
            result = {"$value": translations[value["$translate"]]}
            if "$count" in value:
                result["$count"] = value["$count"]
            return result
        return {key: resolve_markers(item, translations) for key, item in value.items()}
    return value


def main() -> None:
    if len(sys.argv) not in (3, 4):
        raise SystemExit("usage: translate-28-locale-drafts.py INPUT.json OUTPUT.json [LANGUAGE]")
    source_path, output_path = map(Path, sys.argv[1:3])
    only_language = sys.argv[3] if len(sys.argv) == 4 else None
    if only_language is not None and only_language not in TARGETS:
        raise SystemExit(f"unsupported target language: {only_language}")
    data = json.loads(source_path.read_text(encoding="utf-8"))
    results = {}
    opencc = OpenCC("s2twp")

    targets = {key: value for key, value in TARGETS.items() if only_language is None or key == only_language}
    for language, argos_code in targets.items():
        translator = argostranslate.translate.get_translation_from_codes("en", argos_code)
        if translator is None:
            raise RuntimeError(f"No installed offline model for {language} ({argos_code})")
        target = data["targets"][language]
        sources = list(dict.fromkeys(target["units"].values()))
        masked_sources = [mask_source(source) for source in sources]
        print(f"{language}: batching {len(sources)} unique strings", flush=True)
        first_pass = translate_many([masked for masked, _ in masked_sources], translator)
        translated_sources = {}
        fallback_plans = {}
        fallback_texts = []

        for source, (masked, protected), translated in zip(sources, masked_sources, first_pass):
            if all(marker in translated for marker, _ in protected):
                for marker, original in reversed(protected):
                    translated = translated.replace(marker, original)
                translated_sources[source] = normalize(translated, language)
                continue

            plan = []
            cursor = 0
            for match in PROTECTED.finditer(source):
                prose = source[cursor:match.start()]
                leading, content, trailing = prose_bounds(prose)
                if content and any(character.isalpha() for character in content):
                    plan.append(("translate", len(fallback_texts), leading, trailing))
                    fallback_texts.append(content)
                else:
                    plan.append(("literal", prose))
                plan.append(("literal", match.group(0)))
                cursor = match.end()
            prose = source[cursor:]
            leading, content, trailing = prose_bounds(prose)
            if content and any(character.isalpha() for character in content):
                plan.append(("translate", len(fallback_texts), leading, trailing))
                fallback_texts.append(content)
            else:
                plan.append(("literal", prose))
            fallback_plans[source] = plan

        if fallback_texts:
            print(f"{language}: safely retrying {len(fallback_texts)} protected text fragments", flush=True)
            fallback_translations = translate_many(fallback_texts, translator)
            for source, plan in fallback_plans.items():
                chunks = []
                for item in plan:
                    if item[0] == "literal":
                        chunks.append(item[1])
                    else:
                        _, index, leading, trailing = item
                        chunks.append(f"{leading}{fallback_translations[index].strip()}{trailing}")
                translated_sources[source] = normalize("".join(chunks), language)

        for source, result in translated_sources.items():
            if Counter(PLACEHOLDER.findall(result)) != Counter(PLACEHOLDER.findall(source)):
                raise RuntimeError(f"A protected placeholder changed in {language}: {source!r} => {result!r}")

        replacements = {unit_id: translated_sources[source] for unit_id, source in target["units"].items()}
        for unit_id, source in target["units"].items():
            if unit_id.startswith("template."):
                count = re.search(r"\d+", source)
                if count and not re.search(r"\d", replacements[unit_id]):
                    replacements[unit_id] = f"{count.group(0)} {replacements[unit_id]}"
        pack = resolve_markers(target["pack"], replacements)

        if language == "zh_tw":
            def convert_traditional(value):
                if isinstance(value, str):
                    return opencc.convert(value)
                if isinstance(value, list):
                    return [convert_traditional(item) for item in value]
                if isinstance(value, dict):
                    return {key: convert_traditional(item) for key, item in value.items()}
                return value
            pack = convert_traditional(pack)

        results[language] = pack
        print(f"{language}: translated {len(replacements)} units from {len(sources)} unique source strings", flush=True)

    Path(output_path).write_text(json.dumps(results, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Wrote static locale drafts to {output_path}; no network translation service was used.", flush=True)


if __name__ == "__main__":
    main()
