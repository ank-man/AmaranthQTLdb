#!/usr/bin/env python3
"""Chromosome lengths of the target assemblies (from the sequences downloaded for liftover.py).
Writes data/curated/chromosome_lengths.csv (assembly_key, species, chromosome, sequence, length_bp).
Usage: python3 scripts/chromosome_lengths.py"""
import csv, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LO = os.path.join(ROOT, "data", "liftover")
TARGETS = {"Ahyp_v3": "Amaranthus hypochondriacus", "Atub_hap1": "Amaranthus tuberculatus", "Apal_hap1": "Amaranthus palmeri"}
rows = []
for key, sp in TARGETS.items():
    fa = os.path.join(LO, f"{key}.chrom.fa")
    if not os.path.exists(fa + ".fai"):
        subprocess.run(["samtools", "faidx", fa], check=True)
    lab = dict(csv.reader(open(os.path.join(LO, f"{key}.names.tsv")), delimiter="\t"))
    for l in open(fa + ".fai"):
        name, length = l.split("\t")[:2]
        if lab.get(name, "").isdigit():                 # numbered chromosomes only
            rows.append({"assembly_key": key, "species": sp, "chromosome": lab[name], "sequence": name, "length_bp": length})
with open(os.path.join(ROOT, "data", "curated", "chromosome_lengths.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, list(rows[0]))
    w.writeheader()
    w.writerows(rows)
print({k: sum(1 for r in rows if r["assembly_key"] == k) for k in TARGETS})
