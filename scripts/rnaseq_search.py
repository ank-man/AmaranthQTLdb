#!/usr/bin/env python3
"""Find Amaranthus RNA-seq / transcriptome studies (Europe PMC) and RNA-seq BioProjects (NCBI).
Writes data/literature/rnaseq_candidates.tsv and data/literature/rnaseq_bioprojects.tsv.
Usage: python3 scripts/rnaseq_search.py"""
import csv, json, os, re, time, urllib.parse, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "AmaranthQTLdb/1.0 (academic)"}
TAXON = '(Amaranthus OR amaranth OR amaranths OR waterhemp OR "Palmer amaranth" OR pigweed OR "grain amaranth")'
RNA = ('("RNA-seq" OR "RNA seq" OR RNAseq OR "RNA sequencing" OR transcriptome OR transcriptomic OR transcriptomics OR '
       '"differentially expressed genes" OR "gene expression profiling" OR "de novo assembly" OR "Iso-Seq" OR "full-length transcript")')


def get(url):
    for k in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except Exception:  # noqa: BLE001
            time.sleep(3)
    return b"{}"


rows, cursor = {}, "*"
q = f"TITLE_ABS:{TAXON} AND TITLE_ABS:{RNA}"
while True:
    d = json.loads(get("https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&pageSize=1000&cursorMark="
                       + urllib.parse.quote(cursor) + "&query=" + urllib.parse.quote(q)))
    res = d.get("resultList", {}).get("result", [])
    for r in res:
        t = re.sub(r"<[^>]+>|&lt;.*?&gt;", "", r.get("title", ""))
        ab = re.sub(r"<[^>]+>", "", r.get("abstractText", "") or "")
        if not re.search(r"amaranth|waterhemp|pigweed", t + " " + ab, re.I):
            continue
        key = (r.get("doi") or r.get("id")).lower()
        rows.setdefault(key, {"year": r.get("pubYear"), "source": r.get("source"), "doi": r.get("doi", ""), "pmcid": r.get("pmcid", ""),
                              "open_access": r.get("isOpenAccess", ""), "pub_type": "; ".join((r.get("pubTypeList") or {}).get("pubType", []) or []),
                              "title": t, "journal": ((r.get("journalInfo") or {}).get("journal") or {}).get("title", ""),
                              "authors": (r.get("authorString") or "")[:160], "abstract": ab[:3000],
                              "taxon_in_title": "yes" if re.search(r"amaranth|waterhemp|pigweed", t, re.I) else ""})
    nxt = d.get("nextCursorMark")
    if not res or not nxt or nxt == cursor:
        break
    cursor = nxt
print("Europe PMC candidates:", len(rows))
out = os.path.join(ROOT, "data", "literature", "rnaseq_candidates.tsv")
cols = ["year", "source", "doi", "pmcid", "open_access", "pub_type", "taxon_in_title", "journal", "authors", "title", "abstract"]
with open(out, "w", newline="") as fh:
    w = csv.DictWriter(fh, cols, delimiter="\t")
    w.writeheader()
    w.writerows(sorted(rows.values(), key=lambda r: (str(r["year"]), r["title"])))

# NCBI BioProjects with RNA-seq data for Amaranthus
term = 'Amaranthus[Organism] AND ("transcriptome"[Title] OR "RNA-seq" OR "RNA-Seq"[All Fields] OR transcriptom*[All Fields] OR "Transcriptome or Gene expression"[Filter])'
ids = json.loads(get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=bioproject&retmax=500&retmode=json&term=" + urllib.parse.quote(term)))
ids = ids.get("esearchresult", {}).get("idlist", [])
bp = []
for i in range(0, len(ids), 100):
    s = json.loads(get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=bioproject&retmode=json&id=" + ",".join(ids[i:i + 100])))
    for k, v in s.get("result", {}).items():
        if k == "uids":
            continue
        bp.append({"accession": v.get("project_acc"), "organism": v.get("organism_name"), "title": v.get("project_title"),
                   "data_type": v.get("project_data_type"), "registered": v.get("registration_date", "")[:10],
                   "description": re.sub(r"\s+", " ", v.get("project_description", ""))[:400]})
    time.sleep(0.4)
with open(os.path.join(ROOT, "data", "literature", "rnaseq_bioprojects.tsv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, ["accession", "organism", "registered", "data_type", "title", "description"], delimiter="\t")
    w.writeheader()
    w.writerows(sorted(bp, key=lambda r: r["registered"]))
print("NCBI BioProjects:", len(bp))
