#!/usr/bin/env python3
"""Find Amaranthus papers that publish PCR-based diagnostic / trait-linked markers (primer sequences):
KASP, CAPS/dCAPS, SCAR, HRM, allele-specific PCR, sex-specific PCR, TaqMan, pyrosequencing assays.
Writes data/literature/pcr_marker_papers.tsv. Usage: python3 scripts/pcr_marker_search.py"""
import csv, json, os, re, time, urllib.parse, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = ('(Amaranthus OR amaranth OR waterhemp OR "Palmer amaranth" OR pigweed)')
ASSAY = ('(KASP OR "Kompetitive allele" OR CAPS OR dCAPS OR "derived cleaved" OR SCAR OR "high-resolution melting" OR '
         '"allele-specific PCR" OR "sex-specific marker" OR "sex-specific markers" OR "PCR marker" OR "PCR-based marker" OR '
         '"molecular marker" OR "diagnostic assay" OR "genotyping assay" OR TaqMan OR pyrosequencing OR "PCR assay" OR "marker-assisted")')
TRAIT = ('(resistance OR resistant OR sex OR male OR female OR "seed color" OR betalain OR flowering OR mutation OR '
         'ALS OR PPX2 OR PPO OR EPSPS OR psbA OR HPPD OR "target-site" OR trait)')
q = f"TITLE_ABS:{SP} AND TITLE_ABS:{ASSAY} AND TITLE_ABS:{TRAIT}"
rows, cursor = [], "*"
while True:
    url = ("https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&pageSize=500&cursorMark="
           + urllib.parse.quote(cursor) + "&query=" + urllib.parse.quote(q))
    d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "AmaranthQTLdb/1.0"}), timeout=60))
    res = d["resultList"]["result"]
    for r in res:
        t = re.sub(r"<[^>]+>|&lt;.*?&gt;", "", r.get("title", ""))
        if not re.search(r"amaranth|pigweed|waterhemp", t + (r.get("abstractText") or ""), re.I):
            continue
        rows.append({"year": r.get("pubYear"), "source": r.get("source"), "doi": r.get("doi", ""), "pmcid": r.get("pmcid", ""),
                     "open_access": r.get("isOpenAccess"), "title": t,
                     "assay": "; ".join(sorted({m.lower() for m in re.findall(r"KASP|dCAPS|CAPS|SCAR|HRM|high-resolution melting|allele-specific|TaqMan|pyrosequencing|sex-specific", (r.get("abstractText") or "") + t, re.I)}))})
    if not res or d.get("nextCursorMark") in (None, cursor):
        break
    cursor = d["nextCursorMark"]
    time.sleep(0.3)
rows.sort(key=lambda r: (str(r["year"]), r["title"]))
with open(os.path.join(ROOT, "data", "literature", "pcr_marker_papers.tsv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, list(rows[0]), delimiter="\t"); w.writeheader(); w.writerows(rows)
print(len(rows), "papers;", sum(1 for r in rows if r["pmcid"] and r["open_access"] == "Y"), "open access in PMC")
for r in rows: print(r["year"], r["pmcid"] or "-", (r["assay"] or "-")[:25].ljust(25), r["title"][:110])
