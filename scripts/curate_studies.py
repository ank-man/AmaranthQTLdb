#!/usr/bin/env python3
"""Curate Amaranthus QTL, GWAS (MTA/QTN), BSA and sex-linked loci into one table.

Every record comes from a table or sentence in a paper that was read for this compilation;
`source` names the table, supplementary file or passage, so each value can be checked against
the paper. Numbers are copied as published (positions in bp on the reference the authors used).

Writes data/curated/loci.csv and data/curated/studies.csv.
Usage: python3 scripts/curate_studies.py
"""
import csv
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIT = os.path.join(ROOT, "data", "literature", "papers")
OUT = os.path.join(ROOT, "data", "curated")
csv.field_size_limit(10_000_000)

COLS = ["locus_id", "study_id", "record_type", "species", "population", "trait", "trait_category",
        "trait_original", "locus_name", "chromosome", "start_bp", "end_bp", "peak_bp", "reference_genome",
        "position_cM", "lod", "p_value", "pve", "additive_effect", "dominance_effect", "marker",
        "environment", "method", "candidate_gene", "source", "note"]

# -------------------------------------------------------------------------------------------
# Studies. `extracted` says whether loci were taken from it; if not, `why_not` says why.
STUDIES = [
    dict(study_id="Zaelani2025", year=2025, authors="Zaelani A et al.", journal="Breeding Science 75:392-399",
         title="QTL mapping of key phenological and morphological traits in grain amaranth (Amaranthus hypochondriacus L.)",
         doi="10.1270/jsbbs.25032", pmcid="PMC13129576", species="Amaranthus hypochondriacus",
         design="QTL mapping, F2 (Golden x Pygmy Torch), 3 trials, RAD-seq linkage maps", reference_genome="A. hypochondriacus v2.2"),
    dict(study_id="Werle2025", year=2025, authors="Werle IS et al.", journal="Pest Management Science 81:3464-3473",
         title="Different nontarget-site mechanisms underlie resistance to dicamba and 2,4-D in an Amaranthus tuberculatus population",
         doi="10.1002/ps.8712", pmcid="PMC12159393", species="Amaranthus tuberculatus",
         design="QTL mapping, 188 F2 (CHR x WUS), multiple interval mapping", reference_genome="A. tuberculatus reference (AmaTu_Ref)"),
    dict(study_id="Rigon2025", year=2025, authors="Rigon CAG et al.", journal="Journal of Experimental Botany 76(10)",
         title="Function of cytochrome P450 CYP72A1182 in metabolic herbicide resistance evolution in Amaranthus palmeri populations",
         doi="10.1093/jxb/eraf114", pmcid="PMC12223498", species="Amaranthus palmeri",
         design="QTL mapping, pseudo-F2 (two crosses), HPPD-inhibitor (tembotrione) resistance", reference_genome="A. palmeri draft (Montgomery et al. 2020)"),
    dict(study_id="Lightfoot2017", year=2017, authors="Lightfoot DJ et al.", journal="BMC Biology 15:74",
         title="Single-molecule sequencing and Hi-C-based proximity-guided assembly of amaranth (Amaranthus hypochondriacus) chromosomes provide insights into genome evolution",
         doi="10.1186/s12915-017-0412-4", pmcid="PMC5577786", species="Amaranthus hypochondriacus",
         design="Linkage mapping of stem colour (betalain locus), RIL F5:6 (PI 642741 x PI 481125)", reference_genome="A. hypochondriacus PGA2 (v2.1)"),
    dict(study_id="Stetter2020", year=2020, authors="Stetter MG et al.", journal="Molecular Biology and Evolution 37(5):1407",
         title="Parallel seed color adaptation during multiple domestication attempts of an ancient New World grain",
         doi="10.1093/molbev/msz304", pmcid="", species="Amaranthus caudatus x A. quitensis; A. hypochondriacus complex",
         design="F2 QTL (224 F2 plants, 206 genotyped), BSA (2 x 100) and GWAS (116 accessions) for seed colour", reference_genome="A. hypochondriacus v2.1"),
    dict(study_id="Jamalluddin2022", year=2022, authors="Jamalluddin N et al.", journal="PLoS ONE 17:e0267752",
         title="Genetic diversity analysis and marker-trait associations in Amaranthus species",
         doi="10.1371/journal.pone.0267752", pmcid="PMC9098028", species="Amaranthus spp. (16 species); A. tricolor",
         design="GWAS (DArTseq SNPs), 188 accessions of 16 species and 118 A. tricolor", reference_genome="A. hypochondriacus v2.1"),
    dict(study_id="Lin2022", year=2022, authors="Lin YP et al.", journal="The Plant Genome 15:e20206",
         title="De novo SNP calling reveals the genetic differentiation and morphological divergence in genus Amaranthus",
         doi="10.1002/tpg2.20206", pmcid="PMC12806986", species="Amaranthus spp. (grain amaranth complex); A. tricolor",
         design="GWAS of days to flowering, interspecific and A. tricolor subgroup", reference_genome="A. hypochondriacus v2.1"),
    dict(study_id="Singh2025", year=2025, authors="Singh R et al.", journal="BMC Plant Biology 25:1281",
         title="Development and validation of a high-density 'Amahysnp' genotyping array in grain amaranth (Amaranthus hypochondriacus)",
         doi="10.1186/s12870-025-07367-z", pmcid="PMC12487340", species="Amaranthus hypochondriacus",
         design="GWAS (SL- and ML-GWAS), 540 accessions, days to flowering, 2 environments", reference_genome="A. hypochondriacus v2.1"),
    dict(study_id="Prabhakaran2026", year=2026, authors="Prabhakaran S et al.", journal="BMC Genomics 27:287",
         title="Deciphering the genetic determinants of calcium, iron, magnesium and zinc accumulation in grain amaranth (Amaranthus hypochondriacus) through a multi environment GWAS approach",
         doi="10.1186/s12864-026-12595-0", pmcid="PMC13005450", species="Amaranthus hypochondriacus",
         design="Multi-locus GWAS, 192 accessions, 2 environments", reference_genome="A. hypochondriacus v2 (Phytozome)"),
    dict(study_id="Chauhan2026", year=2026, authors="Chauhan R et al.", journal="Frontiers in Nutrition 13:1758193",
         title="Genetic architecture of seed protein composition in grain amaranth (Amaranthus hypochondriacus): a multi-environment genome-wide association study",
         doi="10.3389/fnut.2026.1758193", pmcid="PMC13008625", species="Amaranthus hypochondriacus",
         design="GWAS, 192 accessions, 41,931 SNPs, 2 environments", reference_genome="A. hypochondriacus v2.1"),
    dict(study_id="Kreiner2023FT", year=2023, authors="Kreiner JM et al.", journal="PLoS Genetics 19:e1010865",
         title="Quantifying the role of genome size and repeat content in adaptive variation and the architecture of flowering time in Amaranthus tuberculatus",
         doi="10.1371/journal.pgen.1010865", pmcid="PMC10775983", species="Amaranthus tuberculatus",
         design="GWA of flowering time (SNPs; 10% FDR)", reference_genome="A. tuberculatus (Kreiner et al. 2019 assembly)"),
    dict(study_id="Raiyemo2025", year=2025, authors="Raiyemo DA et al.", journal="BMC Genomics 26:988",
         title="Analyses of contiguous reference genomes of Amaranthus tuberculatus highlight the landscape of the sex-associated region and PEBP gene family diversity",
         doi="10.1186/s12864-025-12181-w", pmcid="PMC12581244", species="Amaranthus tuberculatus",
         design="GWA (RAD-seq, 353 individuals) and FST for sex", reference_genome="A. tuberculatus Hap1 (Raiyemo et al. 2025)"),
    dict(study_id="Kreiner2025Sex", year=2025, authors="Kreiner JM et al.", journal="PLoS Biology 23:e3003254",
         title="The evolution of separate sexes in waterhemp is associated with surprising chromosomal diversity and complexity",
         doi="10.1371/journal.pbio.3003254", pmcid="PMC12237273", species="Amaranthus tuberculatus",
         design="GWA (SNP and read-depth) for sex", reference_genome="A. tuberculatus Atub_193 hap2"),
    dict(study_id="Montgomery2021", year=2021, authors="Montgomery JS et al.", journal="New Phytologist 229:3522-3533",
         title="Male-specific Y-chromosomal regions in waterhemp (Amaranthus tuberculatus) and Palmer amaranth (Amaranthus palmeri)",
         doi="10.1111/nph.17108", pmcid="", species="Amaranthus tuberculatus; Amaranthus palmeri",
         design="Male-specific sequences used to define candidate MSY regions", reference_genome="species assemblies (contigs)"),
    dict(study_id="Neves2020", year=2020, authors="Neves CJ et al.", journal="Journal of Heredity 111:606-612",
         title="Male linked genomic region determines sex in dioecious Amaranthus palmeri",
         doi="10.1093/jhered/esaa047", pmcid="PMC7846199", species="Amaranthus palmeri",
         design="Sex-specific k-mers / coverage, male-specific region assembly", reference_genome="A. palmeri draft"),
]
STUDIES += [
    dict(study_id="Murphy2021", year=2021, authors="Murphy BP et al.", journal="Pest Management Science 77:4884-4891",
         title="Genetic architecture underlying HPPD-inhibitor resistance in a Nebraska Amaranthus tuberculatus population",
         doi="10.1002/ps.6560", pmcid="", species="Amaranthus tuberculatus",
         design="QTL-seq (BSA) + marker validation, pseudo-F2 (24 intermated F1; N = 276)", reference_genome="A. tuberculatus female reference (Kreiner et al. 2019)"),
    dict(study_id="Winkler2024", year=2024, authors="Winkler TS et al.", journal="New Phytologist 243:1082-1100",
         title="Isoform-resolved genome annotation enables mapping of tissue-specific betalain regulation in amaranth",
         doi="10.1111/nph.19736", pmcid="", species="Amaranthus hypochondriacus",
         design="Bulked segregant analysis of flower colour and whole-plant colour, two F2 populations", reference_genome="A. hypochondriacus v2.2"),
    dict(study_id="Ludwig2026", year=2026, authors="Ludwig E et al.", journal="bioRxiv (preprint)",
         title="The grain amaranth pangenome reveals domestication-associated changes in diversity and function of structural variation",
         doi="10.64898/2026.01.08.698315", pmcid="", species="Amaranthus hypochondriacus",
         design="Flowering-time QTL mapping, 449 lines of PI 558499 x PI 604581", reference_genome="A. hypochondriacus v3"),
    dict(study_id="Winkler2026", year=2026, authors="Winkler TS et al.", journal="bioRxiv (preprint)",
         title="Pleiotropy and repeated mutation drove convergent domestication of grain amaranth",
         doi="10.64898/2026.02.26.708151", pmcid="", species="Amaranthus hypochondriacus",
         design="F2 QTL mapping (PI 604581 x PI 558499) of seed colour and dormancy; GWAS of 144 accessions", reference_genome="A. hypochondriacus v3"),
    dict(study_id="LinY2026", year=2026, authors="Lin Y et al.", journal="bioRxiv (preprint)",
         title="Integrated GWAS and transcriptome analyses reveal candidate genes associated with betalain-related pigmentation",
         doi="10.64898/2026.10.05.756862", pmcid="", species="Amaranthus tricolor",
         design="GWAS of betalain absorbance indices, 95-line core collection, two seasons", reference_genome="A. tricolor cv. Bayam (ATR1.0)"),
]

STUDIES += [
    dict(study_id="Laforest2026", year=2026, authors="Laforest M et al.", journal="Pest Management Science 82:6387-6398",
         title="Integrated genomic and transcriptomic approaches reveal oxidative stress adaptation mechanisms in a mesotrione-resistant Amaranthus tuberculatus population",
         doi="10.1002/ps.70721", pmcid="PMC13240694", species="Amaranthus tuberculatus",
         design="GWAS (GBS, 373,458 SNPs; BLINK / MLMM / FarmCPU), 152 plants (85 R, 67 S)", reference_genome="A. tuberculatus reference (AmaTu_Ref)"),
    dict(study_id="Raiyemo2025PJ", year=2025, authors="Raiyemo DA et al.", journal="The Plant Journal 121:e70027",
         title="Chromosome-level assemblies of Amaranthus palmeri, Amaranthus retroflexus, and Amaranthus hybridus allow for genomic comparisons and identification of a sex-determining region",
         doi="10.1111/tpj.70027", pmcid="PMC11850965", species="Amaranthus palmeri",
         design="GWA for sex (RAD-seq, 234,066 variants) and hemizygosity on Hap1", reference_genome="A. palmeri Hap1 (Raiyemo et al. 2025)"),
    dict(study_id="CarvalhoMoore2025", year=2025, authors="Carvalho-Moore P et al.", journal="The Plant Cell 37:koaf069",
         title="A rearranged Amaranthus palmeri extrachromosomal circular DNA confers resistance to glyphosate and glufosinate",
         doi="10.1093/plcell/koaf069", pmcid="PMC11985328", species="Amaranthus palmeri",
         design="Long-read assembly of a resistance eccDNA and its native source loci", reference_genome="A. palmeri Hap1 (Raiyemo et al. 2025)"),
]

NOT_EXTRACTED = [
    ("Kondo2024", 2024, "Kondo F et al.", "Euphytica 220:136", "Identification of inheritance manner and responsible locus (Acsh) related to seed-shattering in grain amaranthus (Amaranthus cruentus)",
     "10.1007/s10681-024-03390-7", "Amaranthus cruentus", "F2 mapping of the seed-shattering locus Acsh", "subscription access; locus position seen only in a search summary, not verified"),
    ("Cao2026", 2026, "Cao J et al.", "Journal of Ecology", "Asymmetric adaptation across a core-periphery climate gradient drives rapid phenological evolution and range expansion in an invasive plant",
     "10.1111/1365-2745.70312", "Amaranthus palmeri", "Common garden + GWAS of flowering time (candidate PTM)", "subscription access (HTTP 403); loci not verified"),
    ("deKinderen2025", 2025, "de Kinderen MAJ", "PhD thesis, University of York", "Exploiting an Amaranth MAGIC population and diversity set for improvement of leafy vegetable traits",
     "https://etheses.whiterose.ac.uk/id/eprint/38163/", "A. cruentus x A. hypochondriacus MAGIC", "MAGIC QTL and metabolite GWAS (leaf yield loci on Chr 9 and 10)", "thesis PDF not yet curated; positions are in its supplement"),
    ("Kreiner2021Gly", 2021, "Kreiner JM et al.", "Molecular Ecology 30:5373", "The genetic architecture and population genomic signatures of glyphosate resistance in Amaranthus tuberculatus",
     "10.1111/mec.15920", "Amaranthus tuberculatus", "GWA of glyphosate resistance (>100 genes on all 16 chromosomes)",
     "paywalled; preprint not retrievable (bioRxiv rate limit)"),
    ("CoreGWAS2026", 2026, "Boro J et al.", "Molecular Genetics and Genomics", "Unravelling genetic diversity in grain amaranth (Amaranthus hypochondriacus L.) core accessions using genome-wide SNPs",
     "10.1007/s00438-026-02464-6", "Amaranthus hypochondriacus", "Diversity and population structure (248 accessions, ~285,000 SNPs)", "no GWAS: the abstract lists association mapping only as future work"),
    ("Maughan2011", 2011, "Maughan PJ, Smith SM, Fairbanks DJ, Jellen EN", "The Plant Genome 4:92-101", "Development, characterization, and linkage mapping of single nucleotide polymorphisms in the grain amaranths (Amaranthus sp.)",
     "10.3835/plantgenome2010.12.0027", "A. hypochondriacus x A. caudatus", "SNP linkage map: 411 markers, 16 LGs, 1288 cM", "marker positions not openly retrievable (publisher 403)"),
    ("Mallory2008", 2008, "Mallory MA et al.", "Crop Science 48:1098", "Development and characterization of microsatellite markers for the grain amaranths",
     "10.2135/cropsci2007.08.0457", "A. cruentus", "SSR markers; 37 polymorphic in a mapping population", "no published map positions found"),
    ("Montgomery2019", 2019, "Montgomery JS et al.", "Weed Science 67", "Sex-specific markers for waterhemp (Amaranthus tuberculatus) and Palmer amaranth (Amaranthus palmeri)",
     "10.1017/wsc.2019.27", "A. tuberculatus; A. palmeri", "Sex-specific PCR markers", "markers not positioned on a genome"),
    ("Shyam2021", 2021, "Shyam C et al.", "ACS Agricultural Science & Technology", "Genetic basis of chlorsulfuron, atrazine, and mesotrione resistance in a Palmer amaranth population",
     "10.1021/acsagscitech.1c00005", "Amaranthus palmeri", "Inheritance / mechanism study", "no mapped loci"),
]

CATEGORY = [
    ("Phenology", r"flower|heading|anthesis|dtf|photoperiod"),
    ("Seed dormancy", r"dormancy|germination"),
    ("Pigmentation", r"colou?r|pigment|betalain|betacyanin|betaxanthin|anthocyan"),
    ("Plant architecture", r"height|stem diameter|node|branch|leaf shape"),
    ("Seed protein", r"albumin|globulin|glutelin|prolamin|protein"),
    ("Seed minerals", r"calcium|iron|magnesium|zinc|^ca$|^fe$|^mg$|^zn$"),
    ("Herbicide resistance", r"dicamba|2,4-d|hppd|tembotrione|glyphosate|glufosinate|mesotrione|resistan"),
    ("Sex determination", r"\bsex\b"),
    ("Seed dormancy", r"dormancy|germination"),
]


def category(trait):
    for c, pat in CATEGORY:
        if re.search(pat, trait, re.I):
            return c
    return "Other"


def num(x):
    x = (x or "").replace(",", "").replace("−", "-").replace("–", "-").strip()
    return x


def sci(x):
    """'5.19 × 10−9' -> '5.19e-9'."""
    x = (x or "").replace("−", "-").replace(" ", "")
    m = re.match(r"^([\d.]+)[×x]10([-\d]+)$", x)
    return f"{m.group(1)}e{m.group(2)}" if m else x


def rows(path):
    with open(path, newline="") as fh:
        return list(csv.reader(fh, delimiter="\t"))


def P(*parts):
    return os.path.join(LIT, *parts)


REC = []


def add(**kw):
    r = {c: "" for c in COLS}
    r.update({k: ("" if v is None else str(v)) for k, v in kw.items()})
    if not r["trait_category"]:
        r["trait_category"] = category(r["trait"])
    REC.append(r)


# --- Zaelani 2025: per-trial QTL (Supplemental Table 4, PDF text) ---------------------------
def zaelani():
    txt = open(P("PMC13129576", "supp_tables", "75_392_s2.pdf.txt")).read()
    block = txt[txt.find("Supplemental Table 4"):txt.find("Supplemental Table 5")]
    trial, trait = "", ""
    names = {"HD": "Heading date", "AD": "Anthesis date", "PH": "Plant height", "STD": "Stem diameter",
             "NN": "Number of nodes", "BI": "Branching index", "HC": "Hypocotyl color", "IFC": "Inflorescence color",
             "SCC": "Seed coat color"}
    for line in block.splitlines():
        m = re.match(r"^(Summer 2023|Autumn 2023|Spring 2024)\s+(.*)$", line)
        if m:
            trial, line = m.group(1), m.group(2)
        m = re.search(r"(Ah([A-Z]+)(\d+))\s+(\d+)\s+([\d.]+)\s+([\d,]+)-([\d,]+)\s+([\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)", line)
        if not m:
            continue
        qid, abbr, _, chrom, lod, s, e, pve, a, d = m.groups()
        add(study_id="Zaelani2025", record_type="QTL", species="Amaranthus hypochondriacus",
            population="F2, Golden x Pygmy Torch", trait=names[abbr], trait_original=names[abbr],
            locus_name=qid, chromosome=chrom, start_bp=num(s), end_bp=num(e), reference_genome="A. hypochondriacus v2.2",
            lod=lod, pve=pve, additive_effect=a, dominance_effect=d, environment=trial,
            method="Haley-Knott interval mapping (R/qtl), 1.5-LOD support interval",
            source="Supplemental Table 4 (75_392_s2.pdf)")


# --- Werle 2025: dicamba / 2,4-D QTL (Table 1) ----------------------------------------------
def werle():
    for r in rows(P("PMC12159393", "tables", "table_01.tsv"))[2:]:
        if len(r) < 11:
            continue
        ph, marker, chrom, cm, mb, lod, ngenes, pve, F, chi, p = r[:11]
        a, b = [float(x) for x in num(mb).split("-")]
        add(study_id="Werle2025", record_type="QTL", species="Amaranthus tuberculatus",
            population="F2 (188 plants), CHR x WUS", trait=f"{ph.replace(chr(0x2010), "-")} resistance", trait_original=ph,
            locus_name=f"q{ph.replace(',', '').replace('‐', '').replace('-', '')}-{chrom}", chromosome=chrom,
            start_bp=int(a * 1e6), end_bp=int(b * 1e6), reference_genome="A. tuberculatus reference (AmaTu_Ref)",
            position_cM=num(cm), lod=lod, p_value=re.sub(r"\*+", "", p), pve=pve, marker=marker,
            method="Multiple interval mapping", note=f"{ngenes} genes in CI", source="Table 1")


# --- Concepcion 2025: Palmer amaranth HPPD QTL (Supplementary Table S6) --------------------
def rigon():
    t = rows(P("PMC12223498", "supp_tables", "eraf114_suppl_supplementary_figures_s1-s16_tables_s1-s6.docx.t06.tsv"))
    cross, current = "", None
    blocks = []
    for r in t[1:]:
        if r and r[0].startswith(("Cross B", "combined")):
            cross = r[0]
            continue
        if len(r) < 7:
            continue
        lo, hi = int(r[3]), int(r[4])
        # a new QTL starts at a named scaffold whose interval does not overlap the current block
        if r[0] and (current is None or current["cross"] != cross or r[0] != current["scaffold"]
                     or hi < current["lo"] or lo > current["hi"]):
            current = {"cross": cross, "scaffold": r[0], "rows": [], "chr": r[5], "pve": r[7].replace(" ", ""), "lo": lo, "hi": hi}
            blocks.append(current)
        current["rows"].append(r)
        current["lo"], current["hi"] = min(current["lo"], lo), max(current["hi"], hi)
    for b in blocks:
        top = max(b["rows"], key=lambda r: float(r[1]))
        starts = [int(r[3]) for r in b["rows"]]
        ends = [int(r[4]) for r in b["rows"]]
        add(study_id="Rigon2025", record_type="QTL", species="Amaranthus palmeri",
            population=f"pseudo-F2, {b['cross']}", trait="HPPD-inhibitor (tembotrione) resistance",
            trait_original="HPPD resistance", locus_name=f"qHPPD-{b['scaffold']}", chromosome=b["chr"],
            start_bp=min(starts), end_bp=max(ends), peak_bp=top[2], reference_genome="A. palmeri draft (Montgomery et al. 2020)",
            lod=top[1], pve=b["pve"].rstrip("%") or "", method="R/qtl2, permutation thresholds",
            note=f"draft scaffold {b['scaffold']}; {len(b['rows'])} peak(s) in block",
            source="Supplementary Table S6 (eraf114 supplementary docx)")


# --- Lightfoot 2017: betalain (stem colour) locus ------------------------------------------
def lightfoot():
    add(study_id="Lightfoot2017", record_type="Mendelian locus", species="Amaranthus hypochondriacus",
        population="RIL F5:6, PI 642741 (red) x PI 481125 (green)", trait="Stem color (betalain)",
        trait_original="stem color / betalain locus", locus_name="Betalain locus", chromosome="16",
        start_bp=5302418, end_bp=5632023, reference_genome="A. hypochondriacus PGA2 (v2.1)", position_cM="33.1",
        method="Linkage mapping of a qualitative trait", candidate_gene="AH2023178 (CYP76AD1); AH2023177 (DODA1)",
        source="Results text + Fig. 3; Additional file 5 Table S4")


# --- Stetter 2020: seed colour (text of MBE article) ---------------------------------------
def stetter():
    common = dict(study_id="Stetter2020", trait="Seed coat color", trait_original="seed color",
                  reference_genome="A. hypochondriacus v2.1")
    add(record_type="QTL", species="A. caudatus x A. quitensis", population="F2 (206 plants), Oscar Blanco x PI 490705",
        locus_name="Seed color QTL chr3", chromosome="3", start_bp=5881516, end_bp=5966304,
        method="R/qtl; BSA (G') and GWAS (116 accessions, P < 1e-5) agree", source="MBE article text (haplotype region chr 3)",
        note="interval is the haplotype-plot region given for the chr 3 QTL", **common)
    add(record_type="QTL", species="A. caudatus x A. quitensis", population="F2 (206 plants), Oscar Blanco x PI 490705",
        locus_name="Seed color QTL chr9", chromosome="9", start_bp=14050000, end_bp=14709000,
        method="R/qtl; BSA (G') and GWAS (~600 kb of associated SNPs)", candidate_gene="AmMYBL1 (MYB-like transcription factor)",
        source="MBE article text (haplotype region chr 9)",
        note="start printed as '1405000'; read as 14,050,000, consistent with the ~600-kb GWAS interval", **common)


# --- Jamalluddin 2022: DArTseq MTAs ---------------------------------------------------------
# Main Tables 2-3 hold the P <= 0.001 MTAs; S2 Table the further MTAs at P <= 0.01. Table 2 prints
# some positions rounded by a spreadsheet (e.g. 1.1E+07); those are taken from the same SNP in
# Table 3 or S2 where it appears, otherwise kept and flagged as approximate.
def jamalluddin():
    exact, recs = {}, []
    def read(path, pop, source, main):
        trait = ""
        for r in rows(path)[1:]:
            r = [str(c).strip() for c in r]
            if not any(r) or r[0] == "Trait":
                continue
            if "|" in r[0]:                       # trait cell empty: columns shifted left
                r = [trait] + r
            elif r[0]:
                trait = r[0]
            if len(r) < 6 or "|" not in r[1]:
                continue
            snp = r[1].split("|")[0]
            if "E+" not in r[3].upper():
                exact[snp] = r[3]
            recs.append((pop, trait, snp, r, source, main))
    d = P("PMC9098028", "supp_tables")
    read(P("PMC9098028", "tables", "table_02.tsv"), "188 accessions of 16 Amaranthus species", "Table 2", True)
    read(P("PMC9098028", "tables", "table_03.tsv"), "118 A. tricolor accessions", "Table 3", True)
    read(os.path.join(d, "pone.0267752.s002.xlsx.16_species.tsv"), "188 accessions of 16 Amaranthus species", "S2 Table", False)
    read(os.path.join(d, "pone.0267752.s002.xlsx.118_A_tricolor_accessions.tsv"), "118 A. tricolor accessions", "S2 Table", False)
    for pop, trait, snp, r, source, main in recs:
        pos, note = r[3], ""
        if "E+" in pos.upper():
            pos, note = (exact[snp], "position from the same SNP elsewhere in the paper") if snp in exact else \
                        (str(int(float(pos))), "position printed rounded in the source (approximate)")
        pve = r[5]
        pve = f"{float(pve) * 100:.2f}" if pve and float(pve) <= 1 else pve
        cand = " ".join(x for x in r[6:8] if x and x != "-") if main else ""
        add(study_id="Jamalluddin2022", record_type="GWAS MTA",
            species="Amaranthus tricolor" if "tricolor" in pop else "Amaranthus spp.", population=pop,
            trait=trait.strip(), trait_original=trait.strip(), locus_name=snp, marker=r[1], chromosome=r[2],
            peak_bp=pos, reference_genome="A. hypochondriacus v2.1", p_value=r[4], pve=pve,
            method="GLM/MLM (TASSEL); " + ("P <= 0.001" if main else "0.001 < P <= 0.01"),
            candidate_gene=cand, note=note, source=source)


# --- Lin 2022: days-to-flowering GWAS (Tables 5, 6) ----------------------------------------
def lin():
    for tab, pop in [("table_05.tsv", "grain amaranth complex (interspecific)"), ("table_06.tsv", "A. tricolor subgroup I")]:
        for r in rows(P("PMC12806986", "tables", tab))[2:]:
            if len(r) < 8 or not r[4].startswith("Scaffold"):
                continue
            add(study_id="Lin2022", record_type="GWAS MTA",
                species="Amaranthus tricolor" if "tricolor" in pop else "Amaranthus spp. (grain amaranths)", population=pop,
                trait="Days to flowering", trait_original="days to flowering", locus_name=f"SNP{r[0]}",
                chromosome=r[4].replace("Scaffold_", ""), start_bp=min(int(num(r[5])), int(num(r[6]))),
                end_bp=max(int(num(r[5])), int(num(r[6]))), reference_genome="A. hypochondriacus v2.1",
                p_value=sci(r[2]), method=f"GWAS ({r[1]}); FDR {sci(r[3])}", candidate_gene=r[7].replace("‐", "-"),
                source=f"Table {tab[6:8].lstrip('0')}")


# --- Amahysnp 2025: DTF QTNs (Supplementary Table 8) ---------------------------------------
def amahysnp():
    import glob
    for f in sorted(glob.glob(P("PMC12487340", "supp_tables", "*MOESM2*.tsv"))):
        t = rows(f)
        if not t or "QTN" not in " ".join(t[0]):
            continue
        for r in t[1:]:
            if len(r) < 10 or not r[2].startswith("qDTF"):
                continue
            add(study_id="Singh2025", record_type="GWAS QTN", species="Amaranthus hypochondriacus",
                population="540 accessions", trait="Days to flowering", trait_original="DTF", locus_name=r[2],
                chromosome=r[3], peak_bp=r[4], reference_genome="A. hypochondriacus v2.1", lod=r[5], pve=r[6],
                additive_effect=r[7], environment=r[1], method=f"SL-/ML-GWAS (methods {r[8]})",
                candidate_gene=r[9], source="Supplementary Table 8 (MOESM2)")
        break


# --- Minerals 2026: stable MTAs (Tables 3 and 4) -------------------------------------------
def prabhakaran():
    t4 = {(r[0], r[1]): r for r in rows(P("PMC13005450", "tables", "table_04.tsv"))[1:] if len(r) >= 5}
    full = {"Ca": "Grain calcium", "Fe": "Grain iron", "Mg": "Grain magnesium", "Zn": "Grain zinc"}
    for r in rows(P("PMC13005450", "tables", "table_03.tsv"))[1:]:
        if len(r) < 6:
            continue
        x = t4.get((r[0], r[3]), [""] * 5)
        add(study_id="Prabhakaran2026", record_type="GWAS MTA", species="Amaranthus hypochondriacus",
            population="192 accessions", trait=full.get(r[3], r[3]), trait_category="Seed minerals", trait_original=r[3],
            locus_name=r[0], chromosome=r[1], peak_bp=num(r[2]), reference_genome="A. hypochondriacus v2 (Phytozome)",
            lod=x[2], p_value=f"{10 ** -float(x[3]):.3g}" if x[3] else "", additive_effect=num(x[4]),
            environment="Almora; Pantnagar (stable)", method=f"Multi-locus GWAS ({r[5]})",
            note="stable MTA; additive effect in mg/100 g; p_value = 10^-(average -log10 P)", source="Tables 3 and 4")


# --- Chauhan 2026: seed protein stable MTAs (Table 3) --------------------------------------
def chauhan():
    for r in rows(P("PMC13008625", "tables", "table_03.tsv"))[1:]:
        if len(r) < 7 or ":" not in r[1]:
            continue
        trait = re.sub(r"\s*\(.*", "", r[0]).strip()
        sc, pos = r[1].split(":")
        add(study_id="Chauhan2026", record_type="GWAS MTA", species="Amaranthus hypochondriacus",
            population="192 accessions", trait=f"Seed {trait.lower()}" if trait != "Total Protein" else "Seed total protein",
            trait_original=r[0], locus_name=r[1], chromosome=sc.replace("Scaffold_", ""), peak_bp=pos,
            reference_genome="A. hypochondriacus v2.1", lod=r[3], p_value=f"{10 ** -float(r[4]):.3g}", pve=r[2], additive_effect=r[5],
            environment="2 environments (stable)", method="Multi-locus GWAS", note=f"MAF {r[6]}", source="Table 3")


# --- Kreiner 2023: flowering time GWA genes (S11 Table) ------------------------------------
def kreiner_ft():
    for r in rows(P("PMC10775983", "supp_tables", "pgen.1010865.s011.xlsx.Sheet1.tsv"))[1:]:
        if len(r) < 4 or not r[0].startswith("Scaffold"):
            continue
        add(study_id="Kreiner2023FT", record_type="GWAS MTA", species="Amaranthus tuberculatus",
            population="common-garden families (Kreiner et al. 2019 collection)", trait="Flowering time",
            trait_original="flowering time", locus_name=r[3], chromosome=r[0].replace("Scaffold_", ""), peak_bp=r[1],
            reference_genome="A. tuberculatus (Kreiner et al. 2019 assembly)", p_value=r[2],
            method="SNP GWA with relatedness matrix; value is FDR-corrected (10% FDR)",
            candidate_gene=f"{r[3]} ({r[4]})" if len(r) > 4 else r[3], note="p_value column holds the FDR q-value",
            source="S11 Table (pgen.1010865.s011.xlsx)")


# --- Sex-linked regions --------------------------------------------------------------------
def sex():
    add(study_id="Raiyemo2025", record_type="Sex-linked region", species="Amaranthus tuberculatus",
        population="353 individuals (RAD-seq, Montgomery et al.)", trait="Sex (male/female)", locus_name="candidate SDR",
        chromosome="1", start_bp=14020000, end_bp=45810000, peak_bp=16139826, reference_genome="A. tuberculatus Hap1 (Raiyemo et al. 2025)",
        method="GWA (BLINK) and FST", note="peak = single significant BLINK SNP; region ~31.79 Mb", source="Results text")
    add(study_id="Kreiner2025Sex", record_type="Sex-linked region", species="Amaranthus tuberculatus",
        population="diversity panel (whole-genome resequencing)", trait="Sex (male/female)", locus_name="primary SLR",
        chromosome="1", start_bp=40000000, end_bp=43500000, reference_genome="A. tuberculatus Atub_193 hap2 (proto-Y)",
        method="SNP and sequence-depth GWA", note="~3 Mb presence/absence region", source="Results text; Fig 1, S5 Fig")
    add(study_id="Neves2020", record_type="Sex-linked region", species="Amaranthus palmeri",
        population="male and female pools", trait="Sex (male/female)", locus_name="male-specific region (MSY)",
        chromosome="", reference_genome="A. palmeri draft", method="sex-specific sequence assembly",
        note="~2 Mb male-specific contigs; not placed on a chromosome", source="Abstract and Results")
    add(study_id="Montgomery2021", record_type="Sex-linked region", species="Amaranthus palmeri", population="male-specific sequences",
        trait="Sex (male/female)", locus_name="candidate MSY", chromosome="", reference_genome="A. palmeri genome assembly",
        method="male-specific sequence mapping", note="contiguous ~1.3 Mb candidate MSY region, 121 gene models; no synteny with A. tuberculatus MSY",
        source="Abstract (New Phytologist 229:3522)")
    add(study_id="Montgomery2021", record_type="Sex-linked region", species="Amaranthus tuberculatus", population="male-specific sequences",
        trait="Sex (male/female)", locus_name="candidate MSY", chromosome="", reference_genome="A. tuberculatus genome assembly",
        method="male-specific sequence mapping", note="several contigs, combined ~4.6 Mb, 147 gene models", source="Abstract (New Phytologist 229:3522)")


# --- Studies read through the bioRxiv full text (sentences quoted verbatim before curation) --
BIORXIV = "bioRxiv full text (sentence quoted verbatim)"


def preprints():
    for chrom, s_, e_, eff, cand, note in [
            ("10", 11911867, 12485518, "-16.4", "AHq016812 (TOE2 ortholog)", "one-LOD range, 44 genes; early-parent allele 16.4 days earlier than the population mean"),
            ("6", 20322569, 24290483, "-11.5", "AHq011814 (FT ortholog); AHq011570 (KHZ1 ortholog)", "one-LOD range, 382 genes; early-parent allele 11.5 days earlier")]:
        add(study_id="Ludwig2026", record_type="QTL", species="Amaranthus hypochondriacus",
            population="449 lines, PI 558499 x PI 604581 (Cologne 2025)", trait="Days to flowering", trait_original="flowering time",
            locus_name=f"qFT{chrom}", chromosome=chrom, start_bp=s_, end_bp=e_, reference_genome="A. hypochondriacus v3",
            additive_effect=eff, method="Linkage mapping", candidate_gene=cand, note=note, source=BIORXIV + "; Results")
    for trait, chrom, s_, e_, cand, note in [
            ("Seed coat color", "9", 17655000, 17971000, "AmMYBL1 (AHq015545)", "dark vs white seed; F2 n = 511 phenotyped"),
            ("Seed coat color", "3", None, None, "", "brown seed colour QTL; interval not given in the text"),
            ("Seed dormancy", "9", 17791000, 17971000, "AmMYBL1 (AHq015545)", "major dormancy QTL, one-LOD support interval; overlaps the seed colour QTL"),
            ("Seed dormancy", "6", None, None, "", "minor dormancy QTL; interval not given in the text"),
            ("Seed dormancy", "11", None, None, "", "minor dormancy QTL; interval not given in the text")]:
        add(study_id="Winkler2026", record_type="QTL", species="Amaranthus hypochondriacus",
            population="F2, PI 604581 (dark) x PI 558499 (white)", trait=trait, trait_original=trait.lower(),
            locus_name=f"q{''.join(w[0] for w in trait.split()).upper()}{chrom}", chromosome=chrom, start_bp=s_, end_bp=e_,
            reference_genome="A. hypochondriacus v3", method="Linkage mapping (95% LOD threshold, 1000 permutations)",
            candidate_gene=cand, note=note, source=BIORXIV + "; Results")
    add(study_id="Winkler2026", record_type="GWAS MTA", species="Amaranthus hypochondriacus", population="144 accessions",
        trait="Seed coat color", trait_original="seed color", locus_name="seed colour GWAS peak", chromosome="9",
        reference_genome="A. hypochondriacus v3", method="GWAS", candidate_gene="AmMYBL1 (AHq015545)",
        note="highest association on chromosome 9; peak position given only in a figure", source=BIORXIV + "; Results")
    add(study_id="Winkler2024", record_type="BSA locus", species="Amaranthus hypochondriacus",
        population="F2 from PI 686465 x a green-flowered parent; 69 plants per bulk", trait="Inflorescence color",
        trait_original="flower colour (regulator BSA)", locus_name="flower colour BSA QTL", chromosome="16",
        start_bp=1, end_bp=5244109, reference_genome="A. hypochondriacus v2.2", method="BSA (G' > 3)",
        candidate_gene="AhMYB2 (AHp022773)", source="bioRxiv v2 of the New Phytologist paper (sentence quoted verbatim)")
    add(study_id="Winkler2024", record_type="BSA locus", species="Amaranthus hypochondriacus",
        population="F2, PI 686465 x PI 576485; 80 green vs 80 red plants", trait="Stem pigmentation",
        trait_original="whole-plant colour (biosynthesis BSA)", locus_name="whole-plant colour BSA QTL", chromosome="16",
        start_bp=1080628, end_bp=14358251, peak_bp=3205818, reference_genome="A. hypochondriacus v2.2", method="BSA (G' > 3)",
        candidate_gene="AhCYP76AD2; AhDODAalpha1", note="two peaks: 3,205,818 and 7,425,588 bp",
        source="bioRxiv v2 of the New Phytologist paper (sentence quoted verbatim)")
    for snp, trait, season, cand in [
            ("ATR1.0CH03_5131103", "Leaf pigmentation (betacyanin)", "winter", "ATR1.0ch03g000565"),
            ("ATR1.0CH06_11090793", "Leaf pigmentation (betacyanin)", "winter", ""),
            ("ATR1.0CH13_174259", "Leaf pigmentation (betacyanin)", "winter", ""),
            ("ATR1.0CH17_6168377", "Leaf pigmentation (betacyanin, betaxanthin)", "winter", ""),
            ("ATR1.0CH00_181109920", "Leaf pigmentation (betacyanin, betaxanthin)", "summer", ""),
            ("ATR1.0CH12_6719988", "Leaf pigmentation (betacyanin, betaxanthin)", "summer", "")]:
        ch, pos = re.match(r"ATR1\.0CH(\d+)_(\d+)", snp).groups()
        add(study_id="LinY2026", record_type="GWAS MTA", species="Amaranthus tricolor", population="95-line core collection",
            trait="Leaf pigmentation", trait_original=trait, locus_name=snp, marker=snp,
            chromosome=str(int(ch)) if int(ch) else "unplaced", peak_bp=pos, reference_genome="A. tricolor cv. Bayam (ATR1.0)",
            environment=season, method="GWAS (FarmCPU / BLINK)", candidate_gene=cand,
            note="position from the SNP ID (chromosome_position, as in the paper's SNP table); 6 of the 45 significant SNPs are named in the text",
            source=BIORXIV + "; Results")
    for sc, eff, act in [("4", "0.09 g biomass", "dominant"), ("12", "0.06 g biomass per allele", "additive")]:
        add(study_id="Murphy2021", record_type="QTL", species="Amaranthus tuberculatus",
            population="pseudo-F2 from intermated R x S F1 (N = 276)", trait="HPPD-inhibitor (tembotrione) resistance",
            trait_original="HPPD-inhibitor resistance", locus_name=f"qHPPD-Sc{sc}", chromosome=sc,
            reference_genome="A. tuberculatus female reference (Kreiner et al. 2019)", additive_effect=eff,
            method="QTL-seq (QTLseqr) + marker validation", note=f"{act}; scaffold-level only, interval given in a table not in the text",
            source="bioRxiv full text of the preprint (10.1101/2021.06.11.448079)")


def mineral_genes():
    """Candidate genes the mineral GWAS lists per stable MTA (Additional file 6)."""
    import glob
    genes = {}
    for f in glob.glob(P("PMC13005450", "supp_tables", "*MOESM6*.tsv")):
        for r in rows(f)[1:]:
            if len(r) >= 4 and ":" in r[0]:
                genes.setdefault((r[0], r[1]), []).append(f"{r[2]} ({r[3][:40]})")
    for rec in REC:
        if rec["study_id"] == "Prabhakaran2026":
            g = genes.get((rec["locus_name"], rec["trait_original"]))
            if g:
                rec["candidate_gene"] = "; ".join(g)


def new_2026_research():
    """Studies found by the deep literature review (October 2026)."""
    best = {}
    for r in rows(P("PMC13240694", "tables", "table_01.tsv"))[1:]:
        if len(r) < 7 or not r[1].startswith("Chr"):
            continue
        pos = r[2].replace(" ", "").replace("\u202f", "")
        key = (r[1], pos)
        pval = float(r[3].replace("\u2212", "-").replace("E\u2212", "E-").replace("−", "-"))
        cur = best.get(key)
        if cur is None or pval < cur["p"]:
            best[key] = {"p": pval, "pve": r[6], "maf": r[4], "models": set(), "block": r[7] if len(r) > 7 else "",
                         "genes": r[8] if len(r) > 8 else "", "annot": r[9] if len(r) > 9 else ""}
        best[key]["models"].add("FarmCPU" if r[5] == "armCPU" else r[5])
    for (chrom, pos), b in sorted(best.items()):
        c = str(int(chrom.replace("Chr", "")))
        add(study_id="Laforest2026", record_type="GWAS MTA", species="Amaranthus tuberculatus",
            population="152 plants of population 714 (85 resistant, 67 susceptible), Quebec", trait="Mesotrione (HPPD) resistance",
            trait_original="mesotrione resistance", locus_name=f"{chrom}_{pos}", marker=f"{chrom}_{pos}",
            chromosome=c if c != "0" else "unplaced", peak_bp=pos, reference_genome="A. tuberculatus reference (AmaTu_Ref)",
            p_value=f"{b['p']:.3g}", pve=b["pve"], method="GWAS (" + ", ".join(sorted(b["models"])) + "); lowest P shown",
            candidate_gene=" ".join(b["genes"].split()[:6]), note=f"MAF {b['maf']}; linkage block {b['block']}".strip(),
            source="Table 1")
    for chrom, pos, p in [("3", 24609596, "1.7481e-20"), ("3", 24595358, "6.8453e-17"), ("4", 13423105, "1.0254e-08"), ("16", 7114501, "1.0704e-17")]:
        add(study_id="Raiyemo2025PJ", record_type="GWAS MTA", species="Amaranthus palmeri", population="RAD-seq panel of known-sex plants",
            trait="Sex (male/female)", trait_original="sex", locus_name=f"Chr{chrom}_{pos}", chromosome=chrom, peak_bp=pos,
            reference_genome="A. palmeri Hap1 (Raiyemo et al. 2025)", p_value=p, method="GWA, Bonferroni threshold",
            source="Results text (sentence copied from the full text)")
    add(study_id="Raiyemo2025PJ", record_type="Sex-linked region", species="Amaranthus palmeri", population="male Hap1 vs Hap2",
        trait="Sex (male/female)", trait_original="sex-determining region", locus_name="MSY (hemizygous SDR)", chromosome="3",
        start_bp=22994134, end_bp=25836006, reference_genome="A. palmeri Hap1 (Raiyemo et al. 2025)",
        method="hemizygosity + GWA", candidate_gene="AmaPaChr03Ag063970 (RF1); AmaPaChr03Ag063980 (TLC)",
        note="~2.84 Mb, 37 genes; replaces the ~1.3 Mb draft MSY", source="Results text")
    add(study_id="CarvalhoMoore2025", record_type="Resistance gene locus", species="Amaranthus palmeri", population="glufosinate- and glyphosate-resistant MSR2",
        trait="Glufosinate resistance", trait_original="GS2 native locus (amplified on eccDNA)", locus_name="GS2.1/GS2.2 native locus",
        chromosome="15", start_bp=9240010, end_bp=9283115, reference_genome="A. palmeri Hap1 (Raiyemo et al. 2025)",
        method="long-read assembly of eccDNA, synteny to the genome", candidate_gene="GS2.1; GS2.2 (tandem)",
        note="source region copied onto the resistance eccDNA; EPSPS native locus on Chr07 (position not given)", source="Results text")


def main():
    for f in (zaelani, werle, rigon, lightfoot, stetter, jamalluddin, lin, amahysnp, prabhakaran, chauhan, kreiner_ft, sex, preprints, mineral_genes, new_2026_research):
        before = len(REC)
        f()
        print(f"{f.__name__:12s} {len(REC) - before:4d} records")
    for i, r in enumerate(REC, 1):
        r["locus_id"] = f"AQ{i:05d}"
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "loci.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, COLS)
        w.writeheader()
        w.writerows(REC)
    n = {}
    for r in REC:
        n[r["study_id"]] = n.get(r["study_id"], 0) + 1
    scols = ["study_id", "year", "authors", "title", "journal", "doi", "pmcid", "species", "design",
             "reference_genome", "records", "extracted", "why_not"]
    with open(os.path.join(OUT, "studies.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, scols)
        w.writeheader()
        for s in STUDIES:
            w.writerow({**s, "records": n.get(s["study_id"], 0), "extracted": "yes", "why_not": ""})
        for sid, yr, au, jo, ti, doi, sp, de, why in NOT_EXTRACTED:
            w.writerow(dict(study_id=sid, year=yr, authors=au, title=ti, journal=jo, doi=doi, pmcid="", species=sp,
                            design=de, reference_genome="", records=0, extracted="no", why_not=why))
    print("total records:", len(REC))


if __name__ == "__main__":
    main()
