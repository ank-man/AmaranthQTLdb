#!/usr/bin/env python3
"""Compile Amaranthus genetic linkage maps.

  data/curated/linkage_maps.csv         one row per map (population, markers, length, what is available)
  data/curated/linkage_groups.csv       one row per linkage group where the source gives per-group numbers
  data/curated/maps/<map_id>.csv        marker-level positions where the source publishes them

Usage: python3 scripts/build_linkage_maps.py
"""
import csv
import os
import re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIT = os.path.join(ROOT, "data", "literature", "papers")
OUT = os.path.join(ROOT, "data", "curated")
MAPS = os.path.join(OUT, "maps")


def rows(path):
    with open(path, newline="") as fh:
        return list(csv.reader(fh, delimiter="\t"))


def main():
    os.makedirs(MAPS, exist_ok=True)
    index, groups = [], []

    # 1. Werle et al. 2025 - A. tuberculatus F2, marker-level (Table S1)
    markers = []
    for r in rows(os.path.join(LIT, "PMC12159393", "supp_tables", "PS-81-3464-s001.xlsx.Table_S1.tsv"))[3:]:
        m = re.match(r"^S(\d+)_(\d+)$", (r[0] if r else "").strip())
        if m and len(r) > 1 and r[1] != "":
            markers.append({"marker": r[0], "linkage_group": str(int(m.group(1))), "position_cM": f"{float(r[1]):.3f}",
                            "chromosome": str(int(m.group(1))), "physical_bp": m.group(2)})
    mid = "AT_Werle2025_CHRxWUS"
    with open(os.path.join(MAPS, f"{mid}.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, ["marker", "linkage_group", "position_cM", "chromosome", "physical_bp"])
        w.writeheader()
        w.writerows(markers)
    by = defaultdict(list)
    for m in markers:
        by[m["linkage_group"]].append(float(m["position_cM"]))
    for lg in sorted(by, key=int):
        groups.append({"map_id": mid, "linkage_group": lg, "markers": len(by[lg]), "length_cM": f"{max(by[lg]) - min(by[lg]):.1f}"})
    index.append({"map_id": mid, "study_id": "Werle2025", "species": "Amaranthus tuberculatus",
                  "population": "F2 (188 plants), CHR x WUS", "marker_type": "SNP (GBS, named by physical position)",
                  "markers": len(markers), "linkage_groups": len(by),
                  "total_cM": f"{sum(max(v) - min(v) for v in by.values()):.1f}",
                  "reference_genome": "A. tuberculatus reference (AmaTu_Ref)", "marker_positions": "yes",
                  "doi": "10.1002/ps.8712", "source": "Supplementary Table S1 (PS-81-3464-s001.xlsx)"})

    # 2. Lightfoot et al. 2017 - A. hypochondriacus RIL GBS map, per-chromosome summary (Table S2)
    tot_m, tot_cm = 0, 0.0
    mid = "AH_Lightfoot2017_RIL"
    for r in rows(os.path.join(LIT, "PMC5577786", "supp_tables", "12915_2017_412_MOESM3_ESM.docx.t01.tsv"))[1:]:
        if r and r[0].isdigit():
            groups.append({"map_id": mid, "linkage_group": r[0], "markers": r[1], "length_cM": r[4]})
            tot_m += int(r[1])
            tot_cm += float(r[4])
    index.append({"map_id": mid, "study_id": "Lightfoot2017", "species": "Amaranthus hypochondriacus",
                  "population": "RIL, PI 642741 x PI 481125", "marker_type": "SNP (GBS)", "markers": tot_m,
                  "linkage_groups": 16, "total_cM": f"{tot_cm:.1f}", "reference_genome": "A. hypochondriacus PGA2 (v2.1)",
                  "marker_positions": "no (per-chromosome summary only)", "doi": "10.1186/s12915-017-0412-4",
                  "source": "Additional file 3 Table S2"})

    # 3. Zaelani et al. 2025 - three F2 maps (one per trial), per-LG summary (Supplemental Table 3)
    txt = open(os.path.join(LIT, "PMC13129576", "supp_tables", "75_392_s2.pdf.txt")).read()
    block = txt[txt.find("Supplemental Table 3"):txt.find("Supplemental Table 4")]
    trials = ["Summer2023", "Autumn2023", "Spring2024"]
    per = {t: [] for t in trials}
    for line in block.splitlines():
        v = line.split()
        if len(v) == 13 and v[0].isdigit() and 1 <= int(v[0]) <= 16:
            for k, t in enumerate(trials):
                per[t].append((v[0], int(v[1 + k]), float(v[4 + k])))
    for t in trials:
        mid = f"AH_Zaelani2025_F2_{t}"
        for lg, n, cm in per[t]:
            groups.append({"map_id": mid, "linkage_group": lg, "markers": n, "length_cM": cm})
        index.append({"map_id": mid, "study_id": "Zaelani2025", "species": "Amaranthus hypochondriacus",
                      "population": f"F2, Golden x Pygmy Torch ({t})", "marker_type": "SNP (ddRAD-seq)",
                      "markers": sum(n for _, n, _ in per[t]), "linkage_groups": len(per[t]),
                      "total_cM": f"{sum(cm for _, _, cm in per[t]):.1f}", "reference_genome": "A. hypochondriacus v2.2",
                      "marker_positions": "no (per-LG summary only)", "doi": "10.1270/jsbbs.25032",
                      "source": "Supplemental Table 3 (75_392_s2.pdf)"})

    # 4. Catalogue entries: maps described in the literature without retrievable positions
    for e in [
        dict(map_id="AH_Maughan2011_F2", study_id="Maughan2011", species="A. hypochondriacus x A. caudatus",
             population="interspecific F2", marker_type="SNP (KASPar)", markers=411, linkage_groups=16, total_cM="1288",
             reference_genome="", marker_positions="no (publisher access blocked)", doi="10.3835/plantgenome2010.12.0027",
             source="abstract"),
        dict(map_id="AC_Stetter2020_F2", study_id="Stetter2020", species="A. caudatus x A. quitensis",
             population="F2 (206 plants), Oscar Blanco x PI 490705", marker_type="SNP (GBS)", markers="", linkage_groups="",
             total_cM="", reference_genome="A. hypochondriacus v2.1", marker_positions="no (raw reads ENA PRJEB30533)",
             doi="10.1093/molbev/msz304", source="article text"),
        dict(map_id="AT_Murphy2021_pseudoF2", study_id="Murphy2021", species="Amaranthus tuberculatus",
             population="pseudo-F2 (Nebraska HPPD-resistant population)", marker_type="SNP", markers="", linkage_groups="",
             total_cM="", reference_genome="", marker_positions="no (paper not accessible)", doi="10.1002/ps.6560",
             source="abstract"),
    ]:
        index.append(e)

    cols = ["map_id", "study_id", "species", "population", "marker_type", "markers", "linkage_groups", "total_cM",
            "reference_genome", "marker_positions", "doi", "source"]
    with open(os.path.join(OUT, "linkage_maps.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, cols)
        w.writeheader()
        w.writerows(index)
    with open(os.path.join(OUT, "linkage_groups.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, ["map_id", "linkage_group", "markers", "length_cM"])
        w.writeheader()
        w.writerows(groups)
    for e in index:
        print(f"{e['map_id']:28s} markers={e['markers']!s:>6} LG={e['linkage_groups']!s:>3} cM={e['total_cM']}")


if __name__ == "__main__":
    main()
