#!/usr/bin/env python3
"""Species-by-species sweep: every Amaranthus species name x mapping terms, in Europe PMC
(title/abstract, all sources incl. AGRICOLA and preprints) and Crossref (titles).
Lists candidates not already in data/curated/studies.csv -> data/literature/species_sweep.tsv
Usage: python3 scripts/species_sweep.py"""
import csv, json, os, re, time, urllib.parse, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPECIES = ["hypochondriacus", "cruentus", "caudatus", "quitensis", "hybridus", "tricolor", "blitum", "lividus", "viridis",
           "dubius", "spinosus", "retroflexus", "powellii", "palmeri", "tuberculatus", "rudis", "albus", "blitoides",
           "graecizans", "deflexus", "thunbergii", "graecizans", "mangostanus", "gangeticus", "edulis", "cannabinus",
           "arenicola", "standleyanus", "acanthochiton", "greggii", "watsonii", "crassipes", "polygonoides"]
TERMS = ('(QTL OR QTLs OR "quantitative trait" OR GWAS OR "genome-wide association" OR "association mapping" OR '
         '"marker-trait" OR "linkage map" OR "genetic map" OR "bulked segregant" OR "BSA-seq" OR "QTL-seq" OR '
         '"fine mapping" OR "candidate gene" OR "sex-linked" OR "sex determination" OR "genetic architecture" OR '
         '"major gene" OR "inheritance" OR "allelic variation")')
UA = {"User-Agent": "AmaranthQTLdb/1.0 (academic)"}
MAP = re.compile(r"qtl|quantitative trait|gwas|genome[- ]wide association|association (mapping|analys|stud)|marker[- ]trait|"
                 r"linkage map|genetic map|bulk(ed)? segregant|bsa|fine[- ]mapp|sex[- ](linked|determin|specific)|"
                 r"genetic architecture|major gene|inheritance|mapping|allelic", re.I)


def get(url):
    for k in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return json.load(r)
        except Exception:  # noqa: BLE001
            time.sleep(3)
    return {}


have = {r["doi"].lower() for r in csv.DictReader(open(os.path.join(ROOT, "data", "curated", "studies.csv")))}
found = {}
for sp in dict.fromkeys(SPECIES):
    q = f'(TITLE_ABS:"Amaranthus {sp}" OR TITLE_ABS:"A. {sp}") AND TITLE_ABS:{TERMS}'
    d = get("https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&pageSize=200&resultType=lite&query="
            + urllib.parse.quote(q))
    n = 0
    for r in d.get("resultList", {}).get("result", []):
        t = re.sub(r"<[^>]+>|&lt;.*?&gt;", "", r.get("title", ""))
        key = (r.get("doi") or r.get("id")).lower()
        if key in have:
            continue
        found.setdefault(key, {"species": sp, "source": "EuropePMC:" + r.get("source", ""), "year": r.get("pubYear"),
                               "doi": r.get("doi", ""), "pmcid": r.get("pmcid", ""), "title": t,
                               "title_has_mapping": "yes" if MAP.search(t) else ""})
        n += 1
    c = get("https://api.crossref.org/works?rows=60&select=DOI,title,issued&query.bibliographic="
            + urllib.parse.quote(f"Amaranthus {sp} QTL GWAS association mapping linkage genetic"))
    for it in c.get("message", {}).get("items", []):
        t = " ".join(it.get("title") or [])
        if sp.lower() not in t.lower() or not MAP.search(t) or it["DOI"].lower() in have:
            continue
        found.setdefault(it["DOI"].lower(), {"species": sp, "source": "Crossref", "doi": it["DOI"],
                                            "year": ((it.get("issued") or {}).get("date-parts") or [[""]])[0][0],
                                            "pmcid": "", "title": t, "title_has_mapping": "yes"})
        n += 1
    print(f"{sp:15s} {n}", flush=True)
    time.sleep(0.3)
out = os.path.join(ROOT, "data", "literature", "species_sweep.tsv")
with open(out, "w", newline="") as fh:
    w = csv.DictWriter(fh, ["species", "source", "year", "doi", "pmcid", "title_has_mapping", "title"], delimiter="\t")
    w.writeheader()
    w.writerows(sorted(found.values(), key=lambda r: (r["title_has_mapping"] != "yes", r["species"], str(r["year"]))))
print("candidates:", len(found), "->", out)
