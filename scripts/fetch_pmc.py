#!/usr/bin/env python3
"""Fetch full text, tables and supplementary files for a list of PMC IDs (reuses literature_harvest).
Usage: fetch_pmc.py OUT_DIR PMCID [PMCID ...]"""
import sys
sys.path.insert(0, __import__("os").path.dirname(__file__))
from literature_harvest import process_paper  # noqa: E402
out = sys.argv[1]
for pmc in sys.argv[2:]:
    row = process_paper(out, {"pmcid": pmc, "pmid": "", "is_open_access": "Y"})
    print(row[:5], row[5][:150])
