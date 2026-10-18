#!/usr/bin/env python3
"""Build small Bokmål word banks from Norsk Ordbank's CC BY lexicon archive.

The source archive is supplied by the maintainer and is not committed here.
The generated lists are an adapted data extract, not a dictionary or spellchecker.
"""

import argparse
import tarfile
import unicodedata
from pathlib import Path


ATTRIBUTION = (
    "Norsk Ordbank, Bokmål, Språkbanken / National Library of Norway; "
    "data licensed CC BY 4.0. Adapted: filtered to five-letter alphabetic "
    "forms, lowercased and deduplicated. Source archive: ordbanken-2026-05-21."
)


def valid_word(raw: str) -> str | None:
    word = unicodedata.normalize("NFC", raw.strip()).lower()
    if len(word) != 5 or not word.isalpha():
        return None
    return word


def extract(archive: Path, member: str, lemma: bool) -> list[str]:
    words: set[str] = set()
    with tarfile.open(archive, mode="r:xz") as tar:
        stream = tar.extractfile(member)
        if stream is None:
            raise FileNotFoundError(f"Missing {member} in {archive}")
        for line in stream:
            columns = line.decode("utf-8").rstrip("\r\n").split("\t")
            if len(columns) < 2 or columns[0].startswith("LEMMA_ID"):
                continue
            if lemma:
                raw = columns[1]
            else:
                if len(columns) < 8 or columns[-1] != "normert":
                    continue
                tags = columns[2].split()
                if "prop" in tags or "fork" in tags:
                    continue
                raw = columns[1]
            word = valid_word(raw)
            if word:
                words.add(word)
    return sorted(words)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path, help="Norsk Ordbank 2026-05-21 .tar.xz")
    parser.add_argument("output", type=Path, help="Output directory")
    args = parser.parse_args()

    accepted = extract(args.archive, "ordbanken/fullformsliste_nb.txt", lemma=False)
    targets = extract(args.archive, "ordbanken/lemma_nb.txt", lemma=True)
    accepted_set = set(accepted)
    targets = [word for word in targets if word in accepted_set]
    args.output.mkdir(parents=True, exist_ok=True)
    for name, words in (("nb-accepted.txt", accepted), ("nb-targets.txt", targets)):
        (args.output / name).write_text("\n".join(words) + "\n", encoding="utf-8")
    (args.output / "ATTRIBUTION.txt").write_text(ATTRIBUTION + "\n", encoding="utf-8")
    print(f"Generated {len(accepted)} accepted forms and {len(targets)} lemma targets.")


if __name__ == "__main__":
    main()
