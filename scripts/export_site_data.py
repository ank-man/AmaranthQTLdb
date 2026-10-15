#!/usr/bin/env python3
"""Export the curated tables to the files the AmaranthQTLdb website reads (website/public/data/),
and copy the figures to website/public/figures/.

Map positions: each locus is drawn on its species' current assembly through the converted
coordinates of scripts/liftover.py (A. hypochondriacus, A. tricolor and multi-species panels on
A. hypochondriacus v3; A. tuberculatus on hap1; A. palmeri on hap1). Published positions stay in
`position_interval` / `ref_genome`.

Usage: python3 scripts/export_site_data.py
"""
import csv
import glob
import json
import math
import os
import re
import shutil
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUR = os.path.join(ROOT, "data", "curated")
OUT = os.path.join(ROOT, "website", "public", "data")
FIG = os.path.join(ROOT, "website", "public", "figures")
LIB = os.path.join(ROOT, "website", "src", "lib")

GENOMES = {
    "Ahyp_v3": {"label": "Grain amaranth (A. hypochondriacus v3)", "species": "Amaranthus hypochondriacus",
                "assembly": "Ahypochondriacus_v3", "accession": "GCA_977020195.1",
                "covers": "A. hypochondriacus, A. tricolor and multi-species panels (genotyped on the A. hypochondriacus reference)"},
    "Atub_hap1": {"label": "Waterhemp (A. tuberculatus hap1)", "species": "Amaranthus tuberculatus",
                  "assembly": "Amaranthus_tuberculatus.hap1.v01", "accession": "GCA_054443085.1", "covers": "A. tuberculatus"},
    "Apal_hap1": {"label": "Palmer amaranth (A. palmeri hap1)", "species": "Amaranthus palmeri",
                  "assembly": "Amaranthus_palmeri.hap1.genome.v01", "accession": "GCA_051800445.1", "covers": "A. palmeri"},
}


def rd(name):
    return list(csv.DictReader(open(os.path.join(CUR, name), newline="")))


def wr(name, rows, cols=None):
    cols = cols or (list(rows[0]) if rows else ["id"])
    with open(os.path.join(OUT, name), "w", newline="") as fh:
        w = csv.DictWriter(fh, cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)


def chrname(n):
    return f"Chr{int(n):02d}" if str(n).isdigit() else ""


def genome_of(species):
    if species == "Amaranthus tuberculatus":
        return "Atub_hap1"
    if species == "Amaranthus palmeri":
        return "Apal_hap1"
    return "Ahyp_v3"


def nlp(p):
    try:
        v = float(p)
        return f"{-math.log10(v):.2f}" if 0 < v < 1 else ""
    except (TypeError, ValueError):
        return ""


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(os.path.join(OUT, "maps"), exist_ok=True)
    loci = rd("loci.csv")
    studies = {s["study_id"]: s for s in rd("studies.csv")}
    lifted = defaultdict(dict)
    for x in rd("coordinates_lifted.csv"):
        if x.get("target_assembly"):
            lifted[x["locus_id"]][x["target_assembly"]] = x

    def ref(sid):
        s = studies.get(sid, {})
        return f"{s.get('authors', '')} ({s.get('year', '')}) {s.get('journal', '')}".strip()

    qtl, gwas = [], []
    for r in loci:
        g = genome_of(r["species"])
        x = lifted.get(r["locus_id"], {}).get(g)
        mbp = mstart = mend = mchr = ""
        if x and re.match(r"^(ok|partial)", x["status"]) and x["target_chromosome"].isdigit():
            vals = [float(v) for v in (x["target_start"], x["target_end"], x["target_peak"]) if v]
            if vals:
                mchr = chrname(x["target_chromosome"])
                mbp = x["target_peak"] or (str(int((float(x["target_start"]) + float(x["target_end"])) / 2))
                                           if x["target_start"] and x["target_end"] else str(int(vals[0])))
                mstart, mend = x["target_start"], x["target_end"]
        pos = ""
        if r["start_bp"] and r["end_bp"]:
            pos = f"{r['start_bp']}-{r['end_bp']}"
        elif r["peak_bp"]:
            pos = r["peak_bp"]
        s = studies.get(r["study_id"], {})
        rec = {
            "id": r["locus_id"], "species": r["species"], "trait": r["trait_category"], "parameter": r["trait"],
            "trait_original": r["trait_original"], "qtl_name": r["locus_name"], "record_type": r["record_type"],
            "chromosome": chrname(r["chromosome"]) or r["chromosome"], "position_interval": pos,
            "position_unit": "bp" if pos else ("cM" if r["position_cM"] else ""), "position_cm": r["position_cM"],
            "ref_genome": r["reference_genome"], "genome": g, "map_chromosome": mchr, "map_bp": mbp,
            "map_start": mstart, "map_end": mend, "associated_markers": r["marker"], "lod": r["lod"],
            "p_value": r["p_value"], "neg_log10_p": nlp(r["p_value"]), "pve": r["pve"],
            "additive_effect": r["additive_effect"], "candidate_gene": r["candidate_gene"],
            "population": r["population"], "environment": r["environment"], "method": r["method"],
            "study_id": r["study_id"], "reference": ref(r["study_id"]), "year": s.get("year", ""),
            "doi": f"https://doi.org/{s['doi']}" if s.get("doi") else "", "source": r["source"],
            "evidence": "suggestive (0.001 < P <= 0.01)" if "0.001 < P" in r["method"] else "significant",
            "note": r["note"], "locus_id": r["locus_id"],
        }
        (gwas if r["record_type"].startswith("GWAS") else qtl).append(rec)
    cols = list(qtl[0])
    wr("qtl.csv", qtl, cols)
    wr("gwas.csv", gwas, cols)

    # meta-QTL on v3 (map) with the v2.1 position kept
    mq = []
    for m in rd("meta_qtl.csv"):
        v3 = m.get("v3_position_bp")
        mq.append({
            "mqtl_id": m["meta_qtl"], "trait": m["trait_group"], "category": {
                "Flowering time": "Phenology", "Betalain pigmentation": "Pigmentation", "Seed coat color": "Pigmentation"}.get(
                m["trait_group"], m["trait_group"]),
            "genome": "Ahyp_v3", "chromosome": chrname(m.get("v3_chromosome") or m["chromosome"]),
            "position_mb": f"{float(v3) / 1e6:.3f}" if v3 else "", "ci_start_mb": f"{float(m['v3_ci_start_bp']) / 1e6:.3f}" if v3 else "",
            "ci_end_mb": f"{float(m['v3_ci_end_bp']) / 1e6:.3f}" if v3 else "",
            "ci_width_mb": f"{(float(m['v3_ci_end_bp']) - float(m['v3_ci_start_bp'])) / 1e6:.2f}" if v3 else "",
            "v21_chromosome": chrname(m["chromosome"]), "v21_position_mb": f"{float(m['position_bp']) / 1e6:.3f}",
            "v21_ci_mb": f"{float(m['ci_start_bp']) / 1e6:.2f}-{float(m['ci_end_bp']) / 1e6:.2f}",
            "n_studies": m["studies"], "studies": m["study_ids"], "n_observations": m["observations"], "n_loci": m["loci"],
            "traits": m["traits"], "record_types": m["record_types"], "recurrent_candidate_genes": m["candidate_genes"],
            "species": "Amaranthus hypochondriacus", "confidence": "moderate" if int(m["studies"]) >= 3 else "low",
        })
    wr("mqtl.csv", mq)
    wr("mqtl_members.csv", rd("meta_qtl_members.csv"))
    wr("mqtl_trait_coverage.csv", rd("meta_qtl_trait_coverage.csv"))
    wr("clusters.csv", rd("qtl_clusters.csv"))

    # linkage maps
    lm = rd("linkage_maps.csv")
    groups = rd("linkage_groups.csv")
    qtl_cm = Counter(r["study_id"] for r in loci if r["position_cM"])
    maps = []
    for m in lm:
        has = m["marker_positions"] == "yes"
        maps.append({"map_id": m["map_id"], "name": f"{m['population']} ({m['study_id']})", "source": "Literature",
                     "map_type": "genetic", "species": m["species"], "population": m["population"],
                     "parents": m["population"].split(", ")[-1] if "x" in m["population"] else "",
                     "n_linkage_groups": m["linkage_groups"], "n_loci": m["markers"], "length_cm": m["total_cM"],
                     "marker_types": m["marker_type"], "n_qtl": qtl_cm.get(m["study_id"], 0),
                     "reference": m["study_id"], "doi": f"https://doi.org/{m['doi']}" if m["doi"] else "",
                     "marker_positions": m["marker_positions"], "source_note": m["source"]})
        if has:
            src = os.path.join(CUR, "maps", f"{m['map_id']}.csv")
            loc = [{"marker": x["marker"], "marker_type": "SNP", "linkage_group": f"LG{x['linkage_group']}",
                    "chromosome": chrname(x["chromosome"]), "position_cm": x["position_cM"], "primers": ""}
                   for x in csv.DictReader(open(src))]
            wr(f"maps/{m['map_id']}.csv", loc)
    wr("maps.csv", maps)
    wr("linkage_groups.csv", groups)
    wr("consensus_status.csv", rd("consensus_status.csv"))

    wr("markers.csv", rd("validated_pcr_markers.csv"))
    wr("rnaseq_studies.csv", rd("rnaseq_studies.csv"))
    wr("rnaseq_datasets.csv", rd("rnaseq_datasets.csv"))
    wr("rnaseq_metaqtl_support.csv", rd("rnaseq_metaqtl_support.csv"))
    wr("inheritance.csv", rd("inheritance_studies.csv"))
    lit = []
    for s in studies.values():
        lit.append({**s, "doi_url": f"https://doi.org/{s['doi']}" if s.get("doi") else "",
                    "records": s.get("records", "0")})
    lit.sort(key=lambda s: (-int(s["year"] or 0), s["study_id"]))
    wr("literature.csv", lit)
    wr("assemblies.csv", rd("assemblies.csv"))
    conv = rd("coordinates_lifted.csv")
    wr("coordinates_lifted.csv", conv)

    # genomes for the map
    lens = rd("chromosome_lengths.csv")
    genomes = {}
    for k, v in GENOMES.items():
        genomes[k] = {**v, "chromosomes": {chrname(x["chromosome"]): int(x["length_bp"]) for x in lens if x["assembly_key"] == k}}
    json.dump(genomes, open(os.path.join(LIB, "genomes.json"), "w"), indent=1)

    # summary
    allrec = qtl + gwas
    by_sp = Counter(r["species"] for r in allrec)
    by_cat = defaultdict(lambda: {"qtl": 0, "gwas": 0})
    for r in qtl:
        by_cat[r["trait"]]["qtl"] += 1
    for r in gwas:
        by_cat[r["trait"]]["gwas"] += 1
    by_type = Counter(r["record_type"] for r in allrec)
    top = Counter(r["parameter"] for r in allrec).most_common(20)
    per_chr = []
    for g, info in genomes.items():
        for c, L in sorted(info["chromosomes"].items()):
            n = sum(1 for r in allrec if r["genome"] == g and r["map_chromosome"] == c)
            per_chr.append({"genome": g, "chromosome": c, "length_mb": round(L / 1e6, 2), "loci": n})
    yrs = Counter(int(s["year"]) for s in studies.values() if s.get("year"))
    summary = {
        "built": __import__("datetime").date.today().isoformat(),
        "counts": {"loci": len(allrec), "qtl": len(qtl), "gwas": len(gwas), "studies_extracted": sum(1 for s in studies.values() if s["extracted"] == "yes"),
                   "studies_listed": len(studies), "mqtl": len(mq), "clusters": len(rd("qtl_clusters.csv")), "maps": len(maps),
                   "map_markers": sum(int(m["n_loci"] or 0) for m in maps), "pcr_markers": len({m["marker"] for m in rd("validated_pcr_markers.csv")}),
                   "inheritance": len(rd("inheritance_studies.csv")), "rnaseq_studies": len(rd("rnaseq_studies.csv")),
                   "rnaseq_bioprojects": len(rd("rnaseq_datasets.csv")), "species": len(by_sp), "traits": len({r["parameter"] for r in allrec}),
                   "placed": sum(1 for r in allrec if r["map_bp"]), "suggestive": sum(1 for r in allrec if r["evidence"].startswith("suggestive"))},
        "by_species": dict(by_sp.most_common()), "by_category": dict(by_cat), "by_record_type": dict(by_type),
        "top_traits": dict(top), "per_chromosome": per_chr,
        "studies_per_year": [{"year": y, "studies": yrs[y]} for y in sorted(yrs)],
        "by_study": [{"study_id": s["study_id"], "year": s["year"], "species": s["species"], "records": int(s.get("records") or 0)}
                     for s in studies.values() if s["extracted"] == "yes"],
        "lift": dict(Counter((x.get("target_assembly", ""), x["status"].split(";")[0].split(":")[0]) for x in conv).items()) and
                [{"target": k[0], "status": k[1], "n": v} for k, v in Counter((x.get("target_assembly", ""), x["status"].split(";")[0].split(":")[0]) for x in conv).items()],
    }
    json.dump(summary, open(os.path.join(OUT, "summary.json"), "w"), indent=1)

    # figures
    # web-sized copies (the full-resolution files stay in figures/)
    from PIL import Image
    shutil.rmtree(FIG, ignore_errors=True)
    os.makedirs(FIG, exist_ok=True)
    for f in glob.glob(os.path.join(ROOT, "figures", "species", "*.png")) + [os.path.join(ROOT, "figures", "linkage_map_A_tuberculatus_QTL.png"),
                                                                      os.path.join(ROOT, "figures", "database_flowchart.png")]:
        im = Image.open(f).convert("RGB")
        im.thumbnail((2200, 2200))
        im.save(os.path.join(FIG, os.path.basename(f)), optimize=True)
    if os.path.exists(os.path.join(ROOT, "figures", "database_flowchart.svg")):
        shutil.copy(os.path.join(ROOT, "figures", "database_flowchart.svg"), FIG)
    print(f"qtl {len(qtl)}, gwas {len(gwas)}, mqtl {len(mq)}, maps {len(maps)}, placed {summary['counts']['placed']}; "
          f"{len(glob.glob(os.path.join(FIG, '*.png')))} figures -> website/public")


if __name__ == "__main__":
    main()
