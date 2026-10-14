#!/usr/bin/env python3
"""Classical inheritance studies (segregation analysis, no map position) for Amaranthus traits.

These report how a trait is inherited (e.g. single dominant nuclear gene, maternal, polygenic)
but no genomic position, so they are kept apart from loci.csv. For each DOI the abstract is read
from Europe PMC and the sentences stating the mode of inheritance are kept verbatim; first author,
journal and year come from Crossref.
Writes data/curated/inheritance_studies.csv.
Usage: python3 scripts/inheritance_studies.py"""
import csv, json, os, re, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "AmaranthQTLdb/1.0 (academic)"}
STUDIES = [  # doi, species, trait
    ("10.1093/oxfordjournals.jhered.a110390", "Amaranthus caudatus", "Determinance, panicle orientation, dwarfism, embryo colour"),
    ("10.1093/oxfordjournals.jhered.a110377", "Grain amaranths (A. hypochondriacus, A. cruentus, A. caudatus)", "Genetics of grain amaranths I (see title)"),
    ("10.1111/j.1365-3180.1985.tb00612.x", "Amaranthus hybridus", "Triazine (atrazine) resistance"),
    ("10.1614/ws-d-13-00028.1", "Amaranthus palmeri", "Glyphosate resistance"),
    ("10.1007/s00425-013-1972-3", "Amaranthus palmeri", "Glyphosate resistance (EPSPS amplification)"),
    ("10.1017/wsc.2018.65", "Amaranthus palmeri", "Glyphosate resistance (EPSPS amplification)"),
    ("10.1038/s41598-022-25686-1", "Amaranthus palmeri", "2,4-D resistance"),
    ("10.1002/pei3.10154", "Amaranthus palmeri", "Glufosinate resistance"),
    ("10.1021/acsagscitech.1c00005", "Amaranthus palmeri", "Chlorsulfuron, atrazine and mesotrione resistance"),
    ("10.1079/ssr2006250", "Amaranthus tuberculatus", "Seed dormancy"),
    ("10.1614/ws-d-15-00055.1", "Amaranthus tuberculatus", "Atrazine and mesotrione resistance (non-target-site)"),
    ("10.3389/fpls.2018.00060", "Amaranthus tuberculatus", "Mesotrione resistance"),
    ("10.1016/j.plantsci.2018.06.004", "Amaranthus tuberculatus", "HPPD-inhibitor resistance"),
    ("10.1017/wsc.2021.76", "Amaranthus tuberculatus", "Dicamba resistance"),
]
KEY = re.compile(r"inherit|dominan|recessive|single (nuclear )?gene|monogenic|polygenic|maternal|segregat|"
                 r"gene action|additive|major gene|nuclear|cytoplasm|quantitative", re.I)


def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
            return json.load(r)
    except Exception:  # noqa: BLE001
        return {}


rows = []
for doi, sp, trait in STUDIES:
    e = get("https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&query="
            + urllib.parse.quote(f'DOI:"{doi}"'))
    rec = (e.get("resultList", {}).get("result") or [{}])[0]
    ab = re.sub(r"<[^>]+>", "", rec.get("abstractText", "") or "")
    sents = [s.strip() for s in re.split(r"(?<=[.!?])\s+", ab) if KEY.search(s)]
    c = get("https://api.crossref.org/works/" + urllib.parse.quote(doi)).get("message", {})
    au = c.get("author") or []
    first = (au[0].get("family", "") + " " + "".join(x[0] for x in au[0].get("given", "").split())).strip() if au else ""
    rows.append({"doi": doi, "year": ((c.get("issued") or {}).get("date-parts") or [[rec.get("pubYear", "")]])[0][0],
                 "first_author": first + (" et al." if len(au) > 1 else ""), "journal": (c.get("container-title") or [""])[0],
                 "title": re.sub(r"<[^>]+>", "", (c.get("title") or [rec.get("title", "")])[0]),
                 "species": sp, "trait": trait,
                 "inheritance_statements": " ".join(sents)[:1500] or "(no abstract available)"})
    time.sleep(0.4)
out = os.path.join(ROOT, "data", "curated", "inheritance_studies.csv")
with open(out, "w", newline="") as fh:
    w = csv.DictWriter(fh, list(rows[0]))
    w.writeheader()
    w.writerows(rows)
for r in rows:
    print(r["year"], r["first_author"][:22].ljust(22), r["trait"][:40].ljust(40), "|", r["inheritance_statements"][:160])
