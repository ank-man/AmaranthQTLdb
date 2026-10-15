#!/usr/bin/env python3
"""Audit every curated locus against its source.

For each record in data/curated/loci.csv, every numeric value (start, end, peak, LOD, PVE, P value,
effect, cM) must occur in the text of the study it came from: the downloaded full text, typeset
tables and supplements of the paper (data/literature/papers/<PMCID>/), or, for studies read on a
web page, the verbatim quotes saved in data/literature/quotes/<study_id>.txt.

Numbers are compared as numbers (thousands separators, thin spaces and unicode minus removed; a
value matches if it equals a number in the source to the precision printed), and positions given
in Mb in the source are accepted for bp values that are whole multiples of 10 kb.

Writes data/curated/audit_loci.csv (one row per record and field) and prints a summary.
Usage: python3 scripts/audit_loci.py [--traits Phenology,Pigmentation,...]
"""
import argparse
import csv
import glob
import math
import os
import re
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUR = os.path.join(ROOT, "data", "curated")
LIT = os.path.join(ROOT, "data", "literature")
FIELDS = ["start_bp", "end_bp", "peak_bp", "lod", "pve", "p_value", "additive_effect", "dominance_effect", "position_cM"]
# values derived by the curation rather than copied (documented in the record's note / method)
DERIVED = {("Prabhakaran2026", "p_value"), ("Chauhan2026", "p_value"), ("Jamalluddin2022", "pve")}


def norm_text(t):
    t = re.sub(r"<[^>]+>", " ", t)
    for ch in ("\u2212", "\u2010", "\u2011", "\u2013"):
        t = t.replace(ch, "-")
    t = t.replace("\u00a0", " ")
    # thousands separators: commas and thin spaces between 3-digit groups ...
    t = re.sub(r"(?<=\d)[,\u2009\u202f](?=\d{3}(?!\d))", "", t)
    # ... and ordinary spaces only inside a whole space-grouped number (1 234 567), so that
    # neighbouring table columns ("15053781 100") are not glued together
    t = re.sub(r"(?<![\d.,])\d{1,3}(?: \d{3})+(?![\d.])", lambda m: m.group(0).replace(" ", ""), t)
    return t


def numbers(text):
    out = set()
    # a minus sign only counts when not preceded by a digit (so "15620178-19903179" is a range)
    for m in re.finditer(r"(?:(?<![\d.])-)?\d+(?:\.\d+)?(?:[eE]-?\d+)?", text):
        s = m.group(0)
        try:
            out.add((float(s), len(s.split(".")[1].split("e")[0].split("E")[0]) if "." in s else 0))
        except ValueError:
            pass
    return out


def corpus(study, pmcid):
    parts = []
    if pmcid:
        d = os.path.join(LIT, "papers", pmcid)
        for f in [os.path.join(d, "fulltext.xml")] + glob.glob(os.path.join(d, "tables", "*.tsv")) + glob.glob(os.path.join(d, "supp_tables", "*")):
            if os.path.isfile(f):
                parts.append(open(f, errors="ignore").read())
    q = os.path.join(LIT, "quotes", f"{study}.txt")
    if os.path.exists(q):
        parts.append(open(q, errors="ignore").read())
    return norm_text("\n".join(parts))


def present(value, nums):
    v = value.replace("−", "-").replace("‐", "-").strip()
    if not v:
        return None
    try:
        x = float(v)
    except ValueError:
        parts = re.findall(r"-?\d+(?:\.\d+)?", v)
        return all(present(p, nums) for p in parts) if parts else None
    for (y, dec) in nums:
        if y == x or (y == -x):   # effects are stored signed (direction), papers often print magnitudes
            return True
        if dec and abs(y - x) <= 0.5 * 10 ** (-dec) + 1e-12:
            return True
        if x != 0 and y != 0 and abs(x) < 1e-3 and math.isclose(x, y, rel_tol=5e-3):
            return True
        if x >= 1e4 and dec and abs(x / 1e6 - y) <= 0.5 * 10 ** (-dec) + 1e-12 and x % 10 ** (6 - dec) == 0:
            return True   # bp value given as Mb in the source (to the printed precision)
        if x >= 1e4 and x % 10000 == 0 and math.isclose(x / 1e6, y, rel_tol=1e-9):
            return True
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--traits", default="")
    a = ap.parse_args()
    wanted = set(t for t in a.traits.split(",") if t)
    studies = {s["study_id"]: s for s in csv.DictReader(open(os.path.join(CUR, "studies.csv")))}
    loci = list(csv.DictReader(open(os.path.join(CUR, "loci.csv"))))
    cache, rows = {}, []
    for r in loci:
        if wanted and r["trait_category"] not in wanted:
            continue
        sid = r["study_id"]
        if sid not in cache:
            txt = corpus(sid, studies.get(sid, {}).get("pmcid", ""))
            cache[sid] = (txt, numbers(txt))
        txt, nums = cache[sid]
        for f in FIELDS:
            v = r[f].strip()
            if not v:
                continue
            if (sid, f) in DERIVED:
                status = "derived (see note)"
            elif not txt:
                status = "NO SOURCE TEXT"
            else:
                ok = present(v, nums)
                status = "found" if ok else ("found (text value)" if ok is None else "NOT FOUND")
            rows.append({"locus_id": r["locus_id"], "study_id": sid, "trait": r["trait"], "field": f, "value": v, "status": status})
    with open(os.path.join(CUR, "audit_loci.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, ["locus_id", "study_id", "trait", "field", "value", "status"])
        w.writeheader()
        w.writerows(rows)
    by = defaultdict(Counter)
    for x in rows:
        by[x["study_id"]][x["status"]] += 1
    print(f"{len(rows)} values checked")
    for sid, c in sorted(by.items()):
        print(f"  {sid:20s} " + "  ".join(f"{k}={v}" for k, v in c.items()))
    bad = [x for x in rows if x["status"] in ("NOT FOUND", "NO SOURCE TEXT")]
    for x in bad[:60]:
        print("  !!", x)
    print(f"{len(bad)} values not found in their source")


if __name__ == "__main__":
    main()


def row_check():
    """Second check: for each record with a position, the source row/line holding that position must
    also carry the record's chromosome (as 4, 04, Chr04, Chr. 4, Scaffold_4 ...)."""
    studies = {s["study_id"]: s for s in csv.DictReader(open(os.path.join(CUR, "studies.csv")))}
    out = Counter()
    bad = []
    lines_cache = {}
    for r in csv.DictReader(open(os.path.join(CUR, "loci.csv"))):
        pos = r["peak_bp"] or r["start_bp"]
        if not pos or not r["chromosome"].isdigit():
            continue
        sid = r["study_id"]
        if sid not in lines_cache:
            lines_cache[sid] = [norm_text(l) for l in corpus(sid, studies.get(sid, {}).get("pmcid", "")).splitlines()]
        p = str(int(float(pos)))
        hits = [l for l in lines_cache[sid] if re.search(rf"(?<!\d){p}(?!\d)", l)]
        if not hits:
            out["position only in Mb / prose"] += 1
            continue
        c = int(r["chromosome"])
        pat = rf"(?:^|[\s\t|:_(]|Chr\.?\s?|CH|chromosome\s|Scaffold_?)0?{c}(?![\d.])"
        if any(re.search(pat, l, re.I) for l in hits):
            out["chromosome on the same row"] += 1
        else:
            out["CHROMOSOME NOT ON ROW"] += 1
            bad.append((r["locus_id"], sid, r["chromosome"], p, hits[0][:140]))
    print("row check:", dict(out))
    for b in bad[:20]:
        print("  ??", b)


if __name__ == "__main__":
    row_check()
