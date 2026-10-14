#!/bin/sh
# Re-download the open-access papers and supplements that curate_studies.py, build_linkage_maps.py,
# compile_pcr_markers.py and meta-data steps read (they are not kept in the repository).
set -e
cd "$(dirname "$0")/.."
python3 scripts/fetch_pmc.py data/literature \
  PMC13129576 PMC12159393 PMC12223498 PMC5577786 PMC7846199 PMC12581244 PMC9098028 PMC13008625 PMC13005450 \
  PMC12487340 PMC12806986 PMC10775983 PMC12237273 PMC9940365 PMC6800383 PMC9860533 PMC11858902 PMC9314999
for z in data/literature/papers/*/supplementary/*.zip; do [ -f "$z" ] && unzip -o -q "$z" -d "$(dirname "$z")/unz"; done
.venv/bin/python scripts/extract_supplements.py data/literature
