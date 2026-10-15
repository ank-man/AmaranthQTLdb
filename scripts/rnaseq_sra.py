#!/usr/bin/env python3
"""Every Amaranthus RNA-seq run in NCBI SRA (library source TRANSCRIPTOMIC), grouped by BioProject,
with the linked publications (PubMed IDs) where NCBI records them.
Writes data/literature/rnaseq_sra_projects.tsv. Usage: python3 scripts/rnaseq_sra.py"""
import csv, io, json, os, re, time, urllib.parse, urllib.request
from collections import defaultdict
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
E = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"


def get(url):
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "AmaranthQTLdb/1.0"}), timeout=120) as r:
                return r.read().decode("utf-8", "ignore")
        except Exception:  # noqa: BLE001
            time.sleep(3 * (k + 1))
    return ""


term = 'Amaranthus[Organism] AND "transcriptomic"[Source]'
s = json.loads(get(E + "esearch.fcgi?db=sra&retmax=0&usehistory=y&retmode=json&term=" + urllib.parse.quote(term)))["esearchresult"]
n, web, qk = int(s["count"]), s["webenv"], s["querykey"]
print("SRA transcriptomic experiments:", n)
projects = defaultdict(lambda: {"runs": 0, "organisms": set(), "titles": set(), "platforms": set(), "strategies": set()})
for start in range(0, n, 500):
    txt = get(f"{E}efetch.fcgi?db=sra&rettype=runinfo&retmode=text&WebEnv={web}&query_key={qk}&retstart={start}&retmax=500")
    for r in csv.DictReader(io.StringIO(txt)):
        if not r.get("BioProject"):
            continue
        p = projects[r["BioProject"]]
        p["runs"] += 1
        p["organisms"].add(r.get("ScientificName", ""))
        p["platforms"].add(r.get("Platform", ""))
        p["strategies"].add(r.get("LibraryStrategy", ""))
    time.sleep(0.4)
print("BioProjects:", len(projects))
acc = sorted(projects)
for i in range(0, len(acc), 100):
    ids = json.loads(get(E + "esearch.fcgi?db=bioproject&retmode=json&retmax=200&term=" + urllib.parse.quote(" OR ".join(f"{a}[Project Accession]" for a in acc[i:i + 100]))))
    ids = ids.get("esearchresult", {}).get("idlist", [])
    if not ids:
        continue
    sm = json.loads(get(E + "esummary.fcgi?db=bioproject&retmode=json&id=" + ",".join(ids))).get("result", {})
    for k, v in sm.items():
        if k == "uids":
            continue
        a = v.get("project_acc")
        if a in projects:
            projects[a]["title"] = v.get("project_title", "")
            projects[a]["description"] = re.sub(r"\s+", " ", v.get("project_description", ""))[:500]
            projects[a]["registered"] = v.get("registration_date", "")[:10]
            projects[a]["uid"] = k
    time.sleep(0.4)
# linked PubMed records
for a, p in projects.items():
    if not p.get("uid"):
        continue
    l = json.loads(get(E + f"elink.fcgi?dbfrom=bioproject&db=pubmed&retmode=json&id={p['uid']}"))
    ls = [x for ls in l.get("linksets", []) for d in ls.get("linksetdbs", []) for x in d.get("links", [])]
    p["pmids"] = ";".join(ls)
    time.sleep(0.35)
out = os.path.join(ROOT, "data", "literature", "rnaseq_sra_projects.tsv")
with open(out, "w", newline="") as fh:
    w = csv.writer(fh, delimiter="\t")
    w.writerow(["bioproject", "registered", "organisms", "runs", "strategies", "platforms", "pmids", "title", "description"])
    for a, p in sorted(projects.items(), key=lambda kv: kv[1].get("registered", "")):
        w.writerow([a, p.get("registered", ""), "; ".join(sorted(x for x in p["organisms"] if x)), p["runs"], "; ".join(sorted(p["strategies"])),
                    "; ".join(sorted(p["platforms"])), p.get("pmids", ""), p.get("title", ""), p.get("description", "")])
print("wrote", out)
