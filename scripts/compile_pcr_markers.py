#!/usr/bin/env python3
"""Validated PCR markers for Amaranthus (separate from the QTL/GWAS compilation).

A marker is listed when a paper reports a PCR-based assay (allele-specific PCR, KASP, CAPS/dCAPS,
TaqMan, HRM, sex-specific PCR, copy-number qPCR) AND tested it against plants of known phenotype
or genotype (bioassay, sequencing, sex, or segregating progeny). `validation` quotes how.

Primer sequences are copied only from open-access full texts and supplements read for this
compilation; `primers_available` = "in source" marks assays whose primers are published in a paper
that could not be read here (the sequences are NOT reproduced from memory).

Writes data/curated/validated_pcr_markers.csv.
Usage: python3 scripts/compile_pcr_markers.py
"""
import csv
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COLS = ["marker", "species", "trait", "target", "assay", "primer_name", "sequence_5_3", "chromosome", "position",
        "reference_genome", "validation", "primers_available", "doi", "source"]
M = []


def add(**kw):
    M.append({c: kw.get(c, "") for c in COLS})


# 1. ALS Trp-574 allelic variants, A. hybridus (Milani et al. 2023, Plants 12:332) - PASA
for name, seq, alle in [("UTR3", "TGGCTGATGAAAGGCAACAC", "common reverse"),
                        ("AS-Trp", "ACATTTAGGTATGGTTGTTCACTG", "wild type Trp574"),
                        ("AS-Leu", "ACATTTAGGTATGGTTGTTCACTT", "resistant Leu574"),
                        ("AS-Met", "ACATTTAGGTATGGTTGTTCACAT", "resistant Met574")]:
    add(marker="ALS-574 PASA", species="Amaranthus hybridus", trait="ALS-inhibitor (thifensulfuron-methyl) resistance",
        target=f"ALS codon 574 ({alle})", assay="Allele-specific PCR (PASA)", primer_name=name, sequence_5_3=seq,
        validation="Assay results matched Sanger sequencing; applied to seed DNA of 51 resistant accessions (Leu574 in 20, Met574 in 22, both in 9)",
        primers_available="yes", doi="10.3390/plants12020332",
        source="Table 1 (PMC9860533); the base before the 3' end is a deliberate mismatch, printed separated in the source")
add(marker="ALS-574 amplicon", species="Amaranthus hybridus", trait="ALS-inhibitor resistance", target="ALS partial (337 bp) for sequencing",
    assay="PCR + Sanger sequencing", primer_name="AMA-2F", sequence_5_3="TCCCGGTTAAAATCATGCTC",
    validation="Used to genotype position 574 by sequencing", primers_available="yes", doi="10.3390/plants12020332", source="Methods (PMC9860533)")
add(marker="ALS-574 amplicon", species="Amaranthus hybridus", trait="ALS-inhibitor resistance", target="ALS partial (337 bp) for sequencing",
    assay="PCR + Sanger sequencing", primer_name="AMA-2R", sequence_5_3="CTTCTTCCATCACCCTCTGT",
    validation="Used to genotype position 574 by sequencing", primers_available="yes", doi="10.3390/plants12020332", source="Methods (PMC9860533)")

# 2. PPO2 Arg-128-Gly, A. retroflexus (2025, Plants 14:515) - KASP (genomic DNA assay)
for name, seq in [("F-DNA-HEX (HEX tail + allele 1)", "GAAGGTCGGAGTCAACGGATTTATCTTCTGTCACAGCCAATTTCACAAAATAAAAG"),
                  ("F-DNA-FAM (FAM tail + allele 2)", "GAAGGTGACCAAGTTCATGCTTCTTCTGTCACAGCCAATTTCACAAAATAAAGG"),
                  ("R2 (common)", "ACTTACTAGCACCGGAAGACCAT")]:
    add(marker="PPO2-R128G KASP", species="Amaranthus retroflexus", trait="PPO-inhibitor (fomesafen) resistance",
        target="PPO2 Arg-128-Gly", assay="KASP", primer_name=name, sequence_5_3=seq,
        validation="Genotype calls consistent with whole-plant dose-response and DNA sequencing (Table S1)",
        primers_available="yes", doi="10.3390/plants14040515",
        source="Methods 4.5 (PMC11858902); tail sequences are the standard KASP FAM/HEX tails")
for name, seq in [("Ar/ppo/partialDNA/F", "ACAGAAAGTGAGGCAGAGGTCTC"), ("Ar/ppo/partialDNA/R", "GATTTTGCTGAAAGGATATTGCTCGTGA")]:
    add(marker="PPO2-R128 amplicon", species="Amaranthus retroflexus", trait="PPO-inhibitor (fomesafen) resistance",
        target="PPO2 fragment flanking codon 128", assay="PCR + sequencing", primer_name=name, sequence_5_3=seq,
        validation="Used to confirm KASP calls by sequencing", primers_available="yes", doi="10.3390/plants14040515", source="Methods (PMC11858902)")

# 3. Male-specific markers, A. tuberculatus (Montgomery et al. 2019 Weed Sci 67:412); primers as
#    re-published and located on the genome by Raiyemo et al. 2025 (Table S5)
for name, f, r, hit in [("MU-976", "ATTGGGCAGCAGTGT", "CAAGACTCGGTCGAA", "Chr01:33,382,693-33,382,748"),
                        ("MU-657.2", "GATGACCTACTTTCAAAATG", "GGTTGTGCGTTCCAAA", "Chr01:15,029,117-15,029,173"),
                        ("MU-533", "CATTGTTTGGTGTTCTACTG", "GTGACAGCAAAAACTGTG", "Chr01:15,116,286-15,116,343")]:
    for side, seq in (("F", f), ("R", r)):
        add(marker=name, species="Amaranthus tuberculatus", trait="Sex (male-specific)", target="male-specific region (MSY)",
            assay="Sex-specific PCR", primer_name=f"{name}-{side}", sequence_5_3=seq, chromosome="1",
            position=hit.split(":")[1], reference_genome="A. tuberculatus Hap1 (Raiyemo et al. 2025)",
            validation="Developed and tested on plants of known sex (Montgomery et al. 2019); best BLAST hits fall in the candidate SDR (Raiyemo et al. 2025)",
            primers_available="yes", doi="10.1017/wsc.2019.27", source="Raiyemo et al. 2025 Table S5 (PMC12581244)")
add(marker="WHMS", species="Amaranthus tuberculatus", trait="Sex (male-specific)", target="male-specific region",
    assay="Sex-specific PCR", chromosome="1", position="33,273,720-33,274,292 (572 bp)", reference_genome="A. tuberculatus Hap1 (Raiyemo et al. 2025)",
    validation="Male-specific amplification (Montgomery et al. 2019); located by BLAST in Raiyemo et al. 2025",
    primers_available="in source", doi="10.1017/wsc.2019.27", source="Raiyemo et al. 2025 text; primers in Montgomery et al. 2019")
add(marker="Palmer male-specific markers", species="Amaranthus palmeri", trait="Sex (male-specific)", target="male-specific region",
    assay="Sex-specific PCR", validation="Tested on male and female plants (Montgomery et al. 2019)",
    primers_available="in source", doi="10.1017/wsc.2019.27", source="Montgomery et al. 2019 (subscription)")

# 4. Grain amaranth HRM marker linked to the chr 4 QTL cluster (Zaelani et al. 2025)
for side, seq in (("F", "ACACCTCCAAAGCGGTTAGG"), ("R", "TGCAGAACCTCCTCTGTGTG")):
    add(marker="AH002", species="Amaranthus hypochondriacus", trait="Heading/anthesis date, plant height, stem diameter, nodes, branching (chr 4 QTL)",
        target="A/T SNP in the AhHD4/AhPH4/AhNN4 region", assay="HRM", primer_name=f"AH002-{side}", sequence_5_3=seq,
        chromosome="4", position="19,967,495", reference_genome="A. hypochondriacus v2.2",
        validation="ANOVA of marker genotype vs trait in the F2 (Supplemental Table 5: P < 0.001 for HD, AD, PH, STD, NN)",
        primers_available="yes", doi="10.1270/jsbbs.25032", source="Supplemental Tables 2 and 5 (PMC13129576)")

# 5. Validated assays published in papers not readable here (catalogue only, no sequences).
#    DOIs and titles from data/literature/pcr_marker_papers.tsv (Europe PMC records).
for marker, sp, trait, target, assay, val, doi in [
    ("PPX2 dG210 allele-specific PCR", "Amaranthus tuberculatus", "PPO-inhibitor resistance", "PPX2 Gly210 deletion",
     "Allele-specific PCR", "Prevalence of the mechanism in resistant populations (Weed Sci 2008)", "10.1614/ws-07-194.1"),
    ("PPX2 dG210 improved assay", "Amaranthus tuberculatus", "PPO-inhibitor resistance", "PPX2 Gly210 deletion",
     "Allele-specific PCR / TaqMan", "Distribution survey of Illinois populations with an improved molecular assay (Weed Sci 2015)", "10.1614/ws-d-15-00037.1"),
    ("PPX2 R128G/M dCAPS", "Amaranthus palmeri", "PPO-inhibitor resistance", "PPX2 Arg128Gly / Arg128Met",
     "dCAPS", "Mutations associated with resistance (Pest Manag Sci 2017)", "10.1002/ps.4581"),
    ("PPX2 target-site TaqMan survey", "Amaranthus palmeri", "PPO-inhibitor resistance", "PPX2 dG210 and R128 mutations",
     "TaqMan", "Statewide survey of resistant accessions (Weed Sci 2018)", "10.1017/wsc.2017.68"),
    ("ALS LAMP assay", "Amaranthus spp. (three weed species)", "ALS-inhibitor resistance", "ALS target-site mutations",
     "LAMP (isothermal; not PCR)", "Rapid detection assay for three Amaranthus weeds (J Sci Food Agric 2024)", "10.1002/jsfa.13385"),
]:
    add(marker=marker, species=sp, trait=trait, target=target, assay=assay, validation=val, primers_available="in source",
        doi=doi, source="catalogue entry: paper not open access - check DOI")

# every sequence must occur verbatim (ignoring spaces) in the text or table it was copied from
import glob, re
LIT = os.path.join(ROOT, "data", "literature", "papers")
def corpus(pmc):
    t = open(os.path.join(LIT, pmc, "fulltext.xml"), errors="ignore").read()
    for f in glob.glob(os.path.join(LIT, pmc, "supp_tables", "*")):
        t += open(f, errors="ignore").read()
    return re.sub(r"<[^>]+>|\s+", "", t).upper()
src = {"10.3390/plants12020332": "PMC9860533", "10.3390/plants14040515": "PMC11858902",
       "10.1017/wsc.2019.27": "PMC12581244", "10.1270/jsbbs.25032": "PMC13129576"}
cache = {}
for m in M:
    if m["sequence_5_3"]:
        pmc = src[m["doi"]]
        cache.setdefault(pmc, corpus(pmc))
        if m["sequence_5_3"].upper() not in cache[pmc]:
            raise SystemExit(f"sequence not found verbatim in {pmc}: {m['primer_name']} {m['sequence_5_3']}")
print("all primer sequences verified against their source text")

out = os.path.join(ROOT, "data", "curated", "validated_pcr_markers.csv")
with open(out, "w", newline="") as fh:
    w = csv.DictWriter(fh, COLS)
    w.writeheader()
    w.writerows(M)
print(f"{len(M)} primer/assay rows, {len({m['marker'] for m in M})} markers -> {out}")
