#!/usr/bin/env python3
"""Curate Amaranthus RNA-seq / transcriptome studies and link them to the major mapped traits.

Inputs (from scripts/rnaseq_search.py and scripts/rnaseq_sra.py):
  data/literature/rnaseq_candidates.tsv     Europe PMC records (title + abstract)
  data/literature/rnaseq_crossref_extra.json  papers found only through Crossref
  data/literature/rnaseq_sra_projects.tsv   every Amaranthus RNA-seq BioProject in SRA

For every included paper:
  * trait group (same groups as the QTL tables) from title + abstract keywords;
  * tissues mentioned in the abstract, number of DEGs quoted from the abstract, and the abstract
    sentences that report the main result (quoted verbatim, so nothing is paraphrased);
  * BioProject accession(s): from NCBI's BioProject -> PubMed links, from accessions printed in the
    open-access full text, or from a close title match (marked as such);
  * for the traits with meta-QTL (betalain pigmentation, seed coat colour, flowering time), whether the
    open-access full text names the meta-QTL candidate genes, with the sentence quoted.
BioProjects that could not be linked to any paper are listed as datasets.

Writes data/curated/rnaseq_studies.csv, rnaseq_datasets.csv and rnaseq_metaqtl_support.csv.
Usage: python3 scripts/curate_rnaseq.py
"""
import csv
import json
import os
import re
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIT = os.path.join(ROOT, "data", "literature")
CUR = os.path.join(ROOT, "data", "curated")
UA = {"User-Agent": "AmaranthQTLdb/1.0 (academic)"}

# Screening decisions (title fragment -> reason), made by reading each title and abstract.
EXCLUDE = {
    "N9-substituted derivatives of kinetin": "amaranth used only as a cytokinin bioassay",
    "Salt stress-induced alterations in the root proteome": "proteomics, no RNA-seq",
    "Lunasin": "immunological assay, no RNA-seq",
    "beet webworm": "insect transcriptome",
    "Cyanobacteria is uniquely enriched": "root microbiome",
    "Healthy and Resilient Cereals": "review",
    "quinoa seed filling": "quinoa",
    "coronavirus": "off-topic",
    "genome assembly of spinach": "spinach",
    "Caffeic Acid, an Allelochemical": "amaranth only a test weed; transcriptome not of amaranth",
    "Herbicide resistance in Amaranthus tuberculatus": "review",
    "single-cell C4": "Suaeda; amaranth only for comparison",
    "Natural product drupacine": "protein target identification, no RNA-seq",
    "Response of Quinoa Seedlings": "quinoa",
    "Single-Cell Transcript Assembly": "software named Amaranth",
    "single-cell transcript assembly": "software named Amaranth",
    "PPR Genes Modulation by Ahyp-miR0005": "in-silico analysis only",
    "Circle-Sequencing and Transcriptome": "not an amaranth dataset",
    "WUSCHEL-Related Homeobox (WOX) Gene Family in Quinoa": "quinoa",
    "Mutagenic Potential of Lead Nitrate": "no RNA-seq",
    "aureonitol": "mode-of-action study; transcriptome not stated in the abstract",
    "D-pinitol": "protein target identification, no RNA-seq",
    "carbon mobilization": "expression of selected genes (qRT-PCR), no RNA-seq",
}
DUPLICATE_OF = {  # preprint DOI -> published DOI
    "10.1101/2023.12.13.571468": "10.1093/jxb/eraf114",
    "10.1101/2024.05.30.596720": "10.1186/s12864-025-12181-w",
    "10.1101/2024.09.18.613719": "10.1111/tpj.70027",
    "10.1101/2025.01.03.631130": "10.1002/pld3.70105",
    "10.21203/rs.3.rs-110761/v1": "10.1038/s41598-021-85486-x",
    "10.64898/2026.02.06.704380": "10.1017/wsc.2026.10111",
}
# Trait group assigned by reading each title (keyword rules on abstracts mis-assign several papers).
GROUP_BY_TITLE = [
    ("Heat Shock Factors", "Abiotic stress"), ("NAC transcription factors", "Abiotic stress"),
    ("cadmium", "Abiotic stress"), ("salt adaptation", "Abiotic stress"), ("thermotolerance", "Abiotic stress"),
    ("wild and cultivated amaranth", "Abiotic stress"), ("RNA-binding and a small, unknown function", "Abiotic stress"),
    ("high-throughout paired-end sequencing", "Betalain pigmentation"), ("microRNAs in the green and red sectors", "Betalain pigmentation"),
    ("betalain", "Betalain pigmentation"), ("Betalain", "Betalain pigmentation"), ("AtrDODA", "Betalain pigmentation"),
    ("WRKY gene family", "Betalain pigmentation"), ("Red Amaranth Hypocotyl", "Betalain pigmentation"),
    ("colored Amaranthus hypochondriacus seeds", "Seed coat colour / seed traits"), ("convergent domestication", "Seed coat colour / seed traits"),
    ("Seed Development", "Seed coat colour / seed traits"), ("Nutritional quality", "Seed coat colour / seed traits"),
    ("male and females", "Sex determination"), ("sex-associated region", "Sex determination"),
    ("de novo transcriptome for waterhemp", "Genome / reference transcriptome"), ("454 pyrosequencing", "Genome / reference transcriptome"),
    ("Caryophyllales", "Genome / reference transcriptome"), ("draft genome and transcriptome", "Genome / reference transcriptome"),
    ("Genome and Transcriptome of Amaranth Species", "Genome / reference transcriptome"), ("The Amaranth Genome", "Genome / reference transcriptome"),
    ("Chromosome-level assemblies", "Genome / reference transcriptome"),
    ("Isoform-resolved genome annotation", "Betalain pigmentation"), ("Chromosome-scale Amaranthus tricolor genome", "Betalain pigmentation"),
]
GROUPS = [
    ("Herbicide resistance / herbicide response", r"herbicid|glyphosate|glufosinate|hppd|ppo-|ppo |protoporphyrinogen|dicamba|2,4-d|mcpa|bentazone|tembotrione|mesotrione|cyanamide|resistan"),
    ("Sex determination", r"\bsex\b|dioecious|male|female"),
    ("Betalain pigmentation", r"betalain|betacyanin|pigment|red |colou?r(ed)? |anthocyan|flavonoid|hypocotyl"),
    ("Seed coat colour / seed traits", r"seed colou?r|seed development|seed filling|grain colou?r|seed"),
    ("Flowering time", r"flower|photoperiod|heading"),
    ("Abiotic stress", r"salt|salinity|drought|heat|thermo|cadmium|\bcd\b|light stress|stress|defoliation"),
    ("Genome / reference transcriptome", r"genome|transcriptome of|de novo transcriptome|reference transcriptome|transcriptomic analysis of grain amaranth|caryophyllales|annotation"),
]
TISSUES = ["leaf", "leaves", "root", "stem", "seed", "flower", "inflorescence", "hypocotyl", "shoot", "seedling", "panicle", "cotyledon", "meristem"]


def classify(text):
    t = text.lower()
    for g, pat in GROUPS:
        if re.search(pat, t):
            return g
    return "Other"


def sentences(ab, pat, n=2):
    ss = [s.strip() for s in re.split(r"(?<=[.!?])\s+", ab) if re.search(pat, s, re.I)]
    return " ".join(ss[:n])[:700]


def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
            return r.read()
    except Exception:  # noqa: BLE001
        return b""


def fulltext(pmcid):
    if not pmcid:
        return ""
    p = os.path.join(LIT, "papers", pmcid, "fulltext.xml")
    if os.path.exists(p):
        return open(p, errors="ignore").read()
    d = os.path.join(LIT, "rnaseq_fulltext")
    os.makedirs(d, exist_ok=True)
    f = os.path.join(d, f"{pmcid}.xml")
    if not os.path.exists(f):
        x = get(f"https://www.ebi.ac.uk/europepmc/webservices/rest/{pmcid}/fullTextXML")
        open(f, "wb").write(x)
        time.sleep(0.3)
    return open(f, errors="ignore").read()


def norm_words(t):
    return {w for w in re.findall(r"[a-z]{4,}", (t or "").lower())} - {"amaranthus", "amaranth", "analysis", "transcriptome", "sequencing", "reveals"}


def main():
    cands = list(csv.DictReader(open(os.path.join(LIT, "rnaseq_candidates.tsv")), delimiter="\t"))
    extra = json.load(open(os.path.join(LIT, "rnaseq_crossref_extra.json")))
    for doi, (yr, jr, title) in extra.items():
        r = json.loads(get("https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&query="
                           + urllib.parse.quote(f'DOI:"{doi}"')) or b"{}").get("resultList", {}).get("result", [{}])
        r = r[0] if r else {}
        cands.append({"year": str(yr), "doi": doi, "pmcid": r.get("pmcid", ""), "open_access": r.get("isOpenAccess", ""),
                      "journal": jr, "authors": r.get("authorString", "")[:160], "title": title,
                      "abstract": re.sub(r"<[^>]+>", "", r.get("abstractText", "") or "")})
    projects = list(csv.DictReader(open(os.path.join(LIT, "rnaseq_sra_projects.tsv")), delimiter="\t"))
    pmid_to_bp = {}
    for p in projects:
        for pm in filter(None, p["pmids"].split(";")):
            pmid_to_bp.setdefault(pm, []).append(p["bioproject"])

    studies, seen_title = [], set()
    for c in cands:
        title = c["title"]
        reason = next((v for k, v in EXCLUDE.items() if k.lower() in title.lower()), None)
        if reason or c["doi"].lower() in DUPLICATE_OF:
            continue
        key = re.sub(r"\W+", " ", title.lower()).strip()
        if key in seen_title:
            continue
        seen_title.add(key)
        ab = c.get("abstract", "")
        text = title + " " + ab
        pm = ""
        r = json.loads(get("https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=lite&query="
                           + urllib.parse.quote(f'DOI:"{c["doi"]}"')) or b"{}").get("resultList", {}).get("result", []) if c["doi"] else []
        if r:
            pm = r[0].get("pmid", "")
        # included when the abstract names an RNA-seq method, or NCBI links the paper to an RNA-seq BioProject
        if not (re.search(r"rna-?seq|transcriptom|small rna|microrna|mirna|iso-?seq|isoform|full-length transcript|expression atlas", text, re.I)
                or pm in pmid_to_bp):
            continue
        ft = fulltext(c.get("pmcid", ""))
        ftp = re.sub(r"<[^>]+>", " ", ft)
        bps = set(re.findall(r"PRJ(?:NA|EB|DB)\d+", ftp))
        link = []
        for b in sorted(bps):
            link.append(f"{b} (cited in full text)")
        for b in pmid_to_bp.get(pm, []):
            if b not in bps:
                link.append(f"{b} (NCBI link)")
        if not link:
            tw = norm_words(title)
            best = max(projects, key=lambda p: len(tw & norm_words(p["title"] + " " + p["description"])) / max(1, len(tw)))
            score = len(tw & norm_words(best["title"] + " " + best["description"])) / max(1, len(tw))
            if score >= 0.85:
                link.append(f"{best['bioproject']} (probable: title match {score:.0%})")
        degs = re.findall(r"(\d[\d,]*)\s+(?:differentially expressed genes|DEGs|differentially expressed transcripts)", ab)
        EPITHETS = r"(hypochondriacus|cruentus|caudatus|quitensis|hybridus|tricolor|blitum|lividus|viridis|dubius|spinosus|retroflexus|powellii|palmeri|tuberculatus|rudis|albus|blitoides|mangostanus|gangeticus)"
        sp = sorted(set(re.findall(r"Amaranthus\s+" + EPITHETS, text)))
        sp = [f"Amaranthus {e}" for e in sp]
        studies.append({
            "year": c["year"], "doi": c["doi"], "pmcid": c.get("pmcid", ""), "open_access": c.get("open_access", ""),
            "title": title, "journal": c.get("journal", ""), "authors": c.get("authors", ""),
            "species": "; ".join(dict.fromkeys(s.replace("Amaranthus ", "A. ") for s in sp)) or "Amaranthus",
            "trait_group": next((g for k, g in GROUP_BY_TITLE if k.lower() in title.lower()), None) or classify(title),
            "tissues": "; ".join(t for t in TISSUES if re.search(rf"\b{t}\b", ab, re.I)),
            "degs_in_abstract": "; ".join(degs),
            "key_results_quoted": sentences(ab, r"differentially expressed|DEG|upregulat|up-regulat|downregulat|candidate gene|key gene|pathway|identified"),
            "bioprojects": "; ".join(link),
            "is_preprint": "yes" if c["doi"].startswith(("10.1101/", "10.64898/", "10.21203/")) else "",
        })
    studies.sort(key=lambda s: (s["trait_group"], s["year"]))
    cols = list(studies[0])
    with open(os.path.join(CUR, "rnaseq_studies.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, cols)
        w.writeheader()
        w.writerows(studies)

    used = {re.match(r"(PRJ\w+)", x).group(1) for s in studies for x in s["bioprojects"].split("; ") if x}
    ds = []
    for p in projects:
        ds.append({"bioproject": p["bioproject"], "registered": p["registered"], "organisms": p["organisms"], "runs": p["runs"],
                   "strategies": p["strategies"], "title": p["title"], "trait_group": classify(p["title"] + " " + p["description"]),
                   "linked_paper": "yes" if p["bioproject"] in used else "", "pmids": p["pmids"],
                   "url": f"https://www.ncbi.nlm.nih.gov/bioproject/{p['bioproject']}"})
    with open(os.path.join(CUR, "rnaseq_datasets.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, list(ds[0]))
        w.writeheader()
        w.writerows(ds)

    # meta-QTL candidate genes named in RNA-seq papers of the same trait
    MQ = {"Betalain pigmentation": ["CYP76AD1", "CYP76AD2", "DODA", "MYB2", "AhMYB2", "cDOPA5GT", "B5GT"],
          "Seed coat colour / seed traits": ["MYBL1", "AmMYBL1"],
          "Flowering time": ["FLOWERING LOCUS T", "FT", "TOE2", "TOE"]}
    sup = []
    for s in studies:
        genes = MQ.get(s["trait_group"])
        if not genes or not s["pmcid"]:
            continue
        ft = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fulltext(s["pmcid"])))
        for g in genes:
            hit = [x for x in re.split(r"(?<=[.!?])\s+", ft) if re.search(rf"\b{re.escape(g)}\b", x)
                   and re.search(r"express|up-?regulat|down-?regulat|DEG|transcript", x, re.I)]
            if hit:
                sup.append({"trait_group": s["trait_group"], "gene": g, "doi": s["doi"], "title": s["title"][:120],
                            "sentence_quoted": hit[0][:500], "n_sentences": len(hit)})
    with open(os.path.join(CUR, "rnaseq_metaqtl_support.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, ["trait_group", "gene", "doi", "title", "sentence_quoted", "n_sentences"])
        w.writeheader()
        w.writerows(sup)
    from collections import Counter
    print(f"{len(studies)} RNA-seq studies; {sum(1 for s in studies if s['bioprojects'])} linked to BioProjects")
    print(Counter(s["trait_group"] for s in studies))
    print(f"{len(ds)} BioProjects, {sum(1 for d in ds if d['linked_paper'])} linked to a paper")
    print(f"{len(sup)} meta-QTL candidate-gene mentions in RNA-seq papers")


if __name__ == "__main__":
    main()
