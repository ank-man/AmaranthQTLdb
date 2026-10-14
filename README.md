# AmaranthQTLdb — a compilation of *Amaranthus* QTL, GWAS loci, meta-QTL, linkage maps and PCR markers

Compiled October 2026 from the published literature and public data repositories. Every record
points back to the table, supplementary file or sentence it was taken from (`source` column), and
every study's DOI, first author and title was checked against Crossref.

## What is in it

| Table (`data/curated/`) | Content |
|---|---|
| `studies.csv` | 26 studies: 15 with loci extracted, 11 listed with the reason they could not be (paywall, preprint server rate limit, no map positions) |
| `loci.csv` | **307 mapped loci**: 57 QTL, 222 GWAS marker–trait associations, 22 GWAS QTNs, 1 Mendelian locus, 5 sex-linked regions |
| `inheritance_studies.csv` | 14 classical inheritance studies (mode of inheritance, no map position), statements quoted from the abstracts |
| `linkage_maps.csv`, `linkage_groups.csv`, `maps/` | 8 genetic maps of 4 taxa; marker-level positions for the *A. tuberculatus* F2 map (1,612 SNPs, 16 LGs), per-linkage-group summaries for 4 *A. hypochondriacus* maps, catalogue entries for the rest |
| `consensus_status.csv` | consensus-map check per species (none possible yet — see below) |
| `assemblies.csv`, `coordinates_lifted.csv` | every position converted between assembly versions (see *Coordinate conversion*) |
| `meta_qtl.csv`, `meta_qtl_members.csv`, `meta_qtl_trait_coverage.csv` | meta-QTL computed here (none had been published for *Amaranthus*) |
| `qtl_clusters.csv` | multi-trait regions (candidate pleiotropic / linked loci) |
| `validated_pcr_markers.csv` | 15 validated PCR assays (19 primer sequences, each verified verbatim against its source) |

Figures (`figures/`): RIdeogram karyotype and circlize Circos of the *A. hypochondriacus* loci and
meta-QTL, and a LinkageMapView plot of the *A. tuberculatus* F2 map with its herbicide-resistance QTL.

### Loci by species and trait

| Species | Loci | Traits |
|---|---|---|
| *A. hypochondriacus* (grain amaranth) | 104 | flowering, plant architecture, pigmentation, seed coat colour, seed protein, grain Ca/Fe/Mg/Zn |
| *A. tricolor* (vegetable amaranth) | 112 | leaf/petiole/stem pigmentation, inflorescence colour, flowering |
| *Amaranthus* spp. panels | 29 | branching, inflorescence colour, leaf shape, flowering |
| *A. tuberculatus* (waterhemp) | 50 | dicamba and 2,4-D resistance, flowering time, sex |
| *A. palmeri* (Palmer amaranth) | 10 | HPPD-inhibitor resistance, sex |
| *A. caudatus* × *A. quitensis* | 2 | seed coat colour |

Other species (*A. cruentus, A. caudatus, A. hybridus, A. retroflexus, A. viridis, A. blitum,
A. dubius, A. spinosus, A. powellii, A. albus* …) were searched one by one; for them only
classical inheritance or target-site herbicide-resistance studies exist, no mapped QTL or GWAS loci.

## Meta-QTL and clusters

No meta-QTL analysis had been published for any *Amaranthus* species, so one was built
(`scripts/meta_qtl.py`): loci of each trait group on the *A. hypochondriacus* v2.0/v2.1 axis (v2.2
positions converted first), one observation per study per locus, a Gaussian mixture with known
variances (Goffinet & Gerber 2000; the BioMercator model applied to physical positions), k by BIC,
and a component kept when **≥ 2 independent studies** support it. Three meta-QTL result:

| Meta-QTL | Chr | Position (v2.1) | Studies | Candidate genes |
|---|---|---|---|---|
| MQTL-BET-16.1 betalain pigmentation | 16 | ~5.5 Mb | Zaelani 2025, Lightfoot 2017 | CYP76AD1 (AH2023178), DODA1 (AH2023177) |
| MQTL-FT-4.1 flowering time | 4 | ~21.6 Mb | Zaelani 2025, Singh 2025, Lin 2022 | |
| MQTL-SCC-9.1 seed coat colour | 9 | ~14.5 Mb | Zaelani 2025, Stetter 2020 | AmMYBL1 |

Traits measured in a single study (seed protein, the four grain minerals, plant height, stem
diameter, nodes, leaf shape) cannot have a meta-QTL; `meta_qtl_trait_coverage.csv` says why for
each. Multi-trait clusters (`qtl_clusters.csv`) need ≥ 2 trait groups and either ≥ 2 studies or a
QTL from a mapping population; the clearest are chr 4 (~11–22 Mb: flowering, plant height, stem
diameter, nodes, branching) and chr 10 (~13–17 Mb).

## Linkage maps and consensus maps

| Map | Population | Markers | Length |
|---|---|---|---|
| AT_Werle2025_CHRxWUS | *A. tuberculatus* F2 (188) | 1,612 SNPs (positions published) | 2,575.5 cM |
| AH_Lightfoot2017_RIL | *A. hypochondriacus* RIL | 3,510 SNPs | 1,414 cM |
| AH_Zaelani2025_F2 (×3 trials) | Golden × Pygmy Torch F2 | 3,478–4,234 SNPs | 5,640–6,960 cM |
| AH_Maughan2011_F2 | *A. hypochondriacus* × *A. caudatus* F2 | 411 SNPs | 1,288 cM |
| (catalogue) Stetter 2020, Murphy 2021 | | | |

A consensus map (LPmerge, `scripts/consensus_maps.R`) needs at least two maps of one species with
marker-level positions and shared markers. Only one map (waterhemp) publishes its marker positions;
the grain-amaranth maps give per-chromosome summaries only. No consensus could therefore be built;
the script runs automatically once a second marker-level map is added to `data/curated/maps/`.

## Coordinate conversion

Positions are kept as published, with the assembly recorded in `reference_genome`, and converted in
`coordinates_lifted.csv` to one current chromosome-level reference per species:

| Species | Published on | Converted to |
|---|---|---|
| *A. hypochondriacus* | v2.0 sequence / v2.1 annotation (PGA2, Lightfoot 2017); v2.2 (polished) | v3 (GCA_977020195.1); and v2.2 → v2.0 for the meta-analysis |
| *A. tuberculatus* | Kreiner 2019 female reference (CoGe 54057); Atub_193 Walpole hap2 (GCA_060155655.1) | Raiyemo 2025 hap1 (GCA_054443085.1) |
| *A. palmeri* | BASF male draft scaffolds (Montgomery 2020; CoGe 55760) | IWGC hap1 (GCA_051800445.1) |

Method (`scripts/liftover.py`): within an accession, the chromosome-scale sequences are aligned whole
with minimap2 (asm5, base level; primary alignments ≥ 10 kb, MAPQ ≥ 5) and each position is lifted by
walking the alignment CIGAR. Between different plants (waterhemp, Palmer amaranth), 20 kb of source
sequence centred on each position is aligned to the target (asm10, base level) and the position read
off that alignment. Intervals whose ends land on different chromosomes, or only one end converts, are
flagged rather than forced.

Result: all 247 grain-amaranth positions converted to v3 (and the 39 v2.2 positions to v2.0, a shift
of a few kb); 42 of 50 waterhemp loci converted to hap1 (6 Kreiner 2019 SNPs lie in sequence that does
not align to hap1, 1 interval converted at one end only); 5 of 8 Palmer amaranth QTL fully converted
(2 at one end, 1 split across chromosomes). Chromosome numbers differ between assemblies of the same
species (each numbers its own chromosomes), so always read `target_chromosome`. The three sex-linked
regions given only as contigs (Neves 2020, Montgomery 2021) have no position to convert. Meta-QTL are
given on both v2.1 and v3 (`meta_qtl.csv`).

## Validated PCR markers

`validated_pcr_markers.csv` lists assays tested against plants of known phenotype/genotype:
ALS Trp-574 allele-specific PCR (*A. hybridus*), PPO2 Arg-128-Gly KASP (*A. retroflexus*),
male-specific markers MU-976 / MU-657.2 / MU-533 / WHMS (*A. tuberculatus*, located on chr 1 of
hap1), the HRM marker AH002 for the chr 4 QTL cluster (grain amaranth), and catalogue entries (no
sequences; papers not open access) for PPX2 ΔG210, R128G/M dCAPS and TaqMan assays and an ALS LAMP
assay.

## What could not be extracted

Paywalled or blocked: Murphy 2021 (HPPD QTL, waterhemp), Kreiner 2021 (glyphosate GWA), Winkler
2024 (AhMYB2 flower colour BSA), Boro 2026 (core collection), Maughan 2011 map positions. Preprints
on bioRxiv (pangenome flowering QTL, betalain GWAS, convergent domestication) were rate-limited
(HTTP 429/1015) during compilation. Their loci can be added by extending `scripts/curate_studies.py`.

Searched and found nothing to import: GWAS Atlas (no *Amaranthus*), AGRDB (genes/SSRs/SNPs only),
Dryad, Zenodo and Figshare (phenotype and population data only).

## Caveats

- 52 *A. tricolor* / multi-species associations are suggestive (0.001 < P ≤ 0.01); they are kept,
  marked in `method`, drawn faintly, and left out of clusters.
- Grain-amaranth GWAS panels of different species (*A. tricolor*, multi-species) were mapped to the
  *A. hypochondriacus* reference by their authors; positions are as published.
- Stetter 2020 chr 9 start is printed as "1405000" and read as 14,050,000 (consistent with the
  ~600-kb interval); noted in the record.
- Kreiner 2023 flowering-time values in `p_value` are FDR q-values (noted per record).

## Rebuild

```
python3 -m venv .venv && .venv/bin/pip install openpyxl pypdf numpy   # supplements
scripts/fetch_sources.sh                                                 # open-access papers + supplements
./run_all.sh                                                             # curation -> figures
```
Literature harvesting scripts (network): `scripts/literature_harvest.py`, `crossref_search.py`,
`species_sweep.py`, `pcr_marker_search.py`, `fetch_pmc.py`, `extract_supplements.py`. Genomes for the
liftover are downloaded into `data/genomes/` (not kept in version control).
