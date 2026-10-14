#!/usr/bin/env python3
"""Second literature source: Crossref bibliographic search, which also covers journals that
Europe PMC / PubMed do not index (Crop Science, Weed Science, Euphytica, ...).

Keeps works whose TITLE names an amaranth and a mapping term. Writes
data/literature/crossref_candidates.tsv.
Usage: crossref_search.py
"""
import csv, json, os, re, time, urllib.parse, urllib.request

OUT = os.path.join(os.path.dirname(__file__), "..", "data", "literature", "crossref_candidates.tsv")
UA = "AmaranthQTLdb/1.0 (academic data collection; mailto:research@example.org)"
SPECIES = r"amaranth|amaranthus|waterhemp|pigweed|palmer amaranth"
MAPPING = (r"\bqtls?\b|quantitative trait|gwas|genome[- ]wide association|association (mapping|study|analysis)|"
           r"marker[- ]trait|linkage map|genetic map|fine[- ]mapp|bulk(ed)? segregant|bsa|qtl-seq|"
           r"sex[- ](determin|linked|chromosome|specific)|male[- ]specific|resistance (locus|gene|loci)|"
           r"genetic architecture|inheritance|genetic basis|mapping")
TERMS = ["QTL mapping", "genome-wide association", "linkage map", "marker-trait association",
         "bulked segregant", "genetic architecture resistance", "sex-linked region"]
NAMES = ["Amaranthus", "grain amaranth", "waterhemp", "Palmer amaranth"]


def get(url):
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
                return json.load(r)
        except Exception:  # noqa: BLE001
            time.sleep(3 * (k + 1))
    return None


rows = {}
for n in NAMES:
    for t in TERMS:
        q = urllib.parse.quote(f"{n} {t}")
        d = get(f"https://api.crossref.org/works?query.bibliographic={q}&rows=60&select=DOI,title,container-title,issued,author,type")
        for it in (d or {}).get("message", {}).get("items", []):
            title = re.sub(r"<[^>]+>|\s+", " ", " ".join(it.get("title") or [])).strip()
            if not (re.search(SPECIES, title, re.I) and re.search(MAPPING, title, re.I)):
                continue
            if it.get("type") not in ("journal-article", "posted-content", "proceedings-article", "book-chapter", "dissertation"):
                continue
            doi = it["DOI"].lower()
            yr = ((it.get("issued") or {}).get("date-parts") or [[None]])[0][0]
            au = it.get("author") or []
            rows.setdefault(doi, {"doi": doi, "year": yr or "", "title": title,
                                  "journal": " ".join(it.get("container-title") or []),
                                  "first_author": (au[0].get("family", "") if au else ""), "type": it.get("type")})
        time.sleep(0.2)
    print(n, len(rows), flush=True)

with open(OUT, "w", newline="") as fh:
    w = csv.DictWriter(fh, ["doi", "year", "first_author", "title", "journal", "type"], delimiter="\t")
    w.writeheader()
    w.writerows(sorted(rows.values(), key=lambda r: (str(r["year"]), r["title"])))
print("candidates:", len(rows))
