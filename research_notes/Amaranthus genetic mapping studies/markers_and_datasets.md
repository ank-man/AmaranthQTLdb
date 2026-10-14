# Validated PCR markers and mapped-locus datasets for Amaranthus (AmaranthQTLdb)

Search date: 2026-10-14. Sources searched: Europe PMC REST API (abstracts plus open-access full-text XML), Crossref API, Zenodo API, Dryad API v2, Figshare API, NCBI E-utilities (BioProject), WeedPedia (weedgenomics.org), AmaranthGDB/PopAmaranth, and web search.
Verification levels used below:
- **[V-FT]**: assay type and primer/probe sequences confirmed in the open-access full text.
- **[V-ABS]**: assay type confirmed from the abstract only. Primer availability was not checked because the paper is paywalled.
- **[UNVERIFIED]**: lead seen only in a search snippet.

## Key Question 1: Which validated PCR marker assays exist beyond those already included?

### Takeaway
At least 14 new trait-linked PCR assays have published sequences or a confirmed assay type. The most useful for the table are listed below; the rest are in the ranked inventory.
- Spaunhorst 2019 TaqMan for ALS Trp574Leu, with primers and probes in an open-access paper.
- Rangani 2019 RsaI CAPS for PPO2 G399A, with primers in an open-access paper.
- Sarangi 2019 KASP for ΔG210 in waterhemp.
- Pyrosequencing panels for PPO2 (Porri 2022, Noguera 2021, Dhaka 2026).
- Gaines 2010 EPSPS copy-number qPCR, the standard method reused by many papers.
- TaqMan and digital PCR copy-number assays for GS2.
- The 2026 CRISPR-Cas12a/RPA species assays, which have primers in an open-access paper.

One entry in the "already included" list is wrong: DOI 10.1017/wsc.2017.68 belongs to Varanasi et al. 2018, not Salas-Perez. Salas-Perez 2017 is a separate paper (10.1017/wsc.2017.41).

### Cited Findings

**Correction to the "already included" list**
- 10.1017/wsc.2017.68 is **Varanasi VK, Brabham C, Norsworthy JK, Nie H, Young BG, Houston M, Barber T, Scott RC (2018)**, "A Statewide Survey of PPO-Inhibitor Resistance and the Prevalent Target-Site Mechanisms in Palmer amaranth (Amaranthus palmeri) Accessions from Arkansas", Weed Sci. It is this paper that used "a TaqMan qPCR assay … to confirm the presence of the ΔG210 codon deletion or the R128G/M" across 167 accessions: ΔG210 in 49%, R128G in 28%, R128M in 3 accessions. Paywalled. — [Europe PMC record](https://europepmc.org/search?query=DOI%3A%2210.1017%2Fwsc.2017.68%22); [Crossref](https://api.crossref.org/works/10.1017/wsc.2017.68)
- **Salas-Perez RA, Burgos NR, Rangani G, … Scott RC (2017)**, "Frequency of Gly-210 Deletion Mutation among Protoporphyrinogen Oxidase Inhibitor-Resistant Palmer Amaranth Populations", Weed Sci 65:718–731. DOI **10.1017/wsc.2017.41**. The abstract describes a ΔG210 survey and PPX2L sequencing; it does not mention TaqMan. Paywalled. [V-ABS] — [Crossref](https://api.crossref.org/works/10.1017/wsc.2017.41); the citation details are confirmed in the reference list of [Dhaka 2026 (PMC13569166)](https://europepmc.org/article/PMC/PMC13569166)

**Rank A: open access, primer or probe sequences in the paper, validated on plants of known phenotype**
1. **Spaunhorst DJ, Nie H, Todd JR, Young JM, Young BG, Johnson WG (2019)**, PLoS One 14:e0214458. DOI 10.1371/journal.pone.0214458 (PMC6435131). *A. palmeri*. [V-FT]
   - TaqMan allele-specific qPCR for **ALS Trp574Leu**:
     - Mutant probe 5′-ATCGATCTTCCAATTGAA-3′ (VIC)
     - Wild-type probe 5′-TCGATCTTCCCATTGAA-3′ (FAM)
     - Forward primer 5′-CCGGTTAAAATCATGCTCTTGAACAAT-3′
     - Reverse primer 5′-TGTGCCCGGTTAGCTTTGTAAA-3′
   - The same study screened ΔG210 using the allele-specific probes of Giacomini et al., and EPSPS copy number by the Gaines et al. 2010 method (≥10 copies = amplified).
   - Validation: plants that survived chlorimuron, fomesafen or glyphosate were genotyped. 37% of chlorimuron survivors lacked Trp574Leu.
   - [PMC6435131](https://europepmc.org/article/PMC/PMC6435131)
2. **Rangani G, Salas-Perez RA, Aponte RA, Knapp M, Craig IR, Mietzner T, Langaro AC, Noguera MM, Porri A, Roma-Burgos N (2019)**, "A Novel Single-Site Mutation in the Catalytic Domain of Protoporphyrinogen Oxidase IX (PPO) Confers Resistance to PPO-Inhibiting Herbicides", Front Plant Sci 10:568. DOI 10.3389/fpls.2019.00568 (PMC6530635). *A. palmeri*. [V-FT]
   - **CAPS marker for PPO2 G399A**: GGT→GCT abolishes an RsaI site.
   - Primers: RsaIF 5′-CGTACCCCTTTCCGTTATGA-3′ and RsaIR 5′-CCGGGAAGATCTTTTTCCAT-3′, giving a 691-bp amplicon.
   - Full-length PPO2 sequencing primers are also given (Apx2-1F/1R, 2F/2R, 3F/3R).
   - Applied to resistant and susceptible plants.
   - [PMC6530635](https://europepmc.org/article/PMC/PMC6530635)
3. **Galindo-González L, Dupras AA (2026)**, "CRISPR-Cas12a fluorescence assays identify weedy Amaranthus species", Sci Rep. DOI 10.1038/s41598-026-49454-7 (PMC13324167). [V-FT]
   - **RPA + CRISPR-Cas12a species-ID assays** for three targets: the *A. palmeri* + *A. watsonii* clade, *A. palmeri* versus *A. watsonii*, and *A. tuberculatus*.
   - RPA primers are printed in the paper, e.g. *A. palmeri*+*watsonii* forward CACTAATCAAGACTAGAATATTTGGAGGACTCTTC and reverse TAAATGCCAAAGGCTGAGTCGACGACCTAC.
   - 100% accurate on blind samples of 14 Amaranthus species.
   - This is species identification, not a trait marker; species status is relevant to regulation and herbicide resistance.
   - [PMC13324167](https://europepmc.org/article/PMC/PMC13324167)
4. **Xu H, Pan X, Wang C, Chen Y, Chen K, Zhu S, van Klinken RD (2020)**, "Species identification, phylogenetic analysis and detection of herbicide-resistant biotypes of Amaranthus based on ALS and ITS", Sci Rep 10:11735. DOI 10.1038/s41598-020-68541-x (PMC7366686). [V-FT]
   - **Sequencing-based** (not allele-specific) ALS and ITS diagnostics across 26 species and 153 samples.
   - ALS primers are in the paper (e.g. 5F 5′-ATTCCTCCGCARTATGCSATT-3′, 6R 5′-CCTACAAAAAGCTTCTCCTCTATAAG-3′).
   - Detected Ala122Asn, Pro197Ser/Thr/Ile, Trp574Leu and Ser653Thr/Asn/Lys.
   - Useful for primers, but it is not a closed-tube genotyping assay.
   - [PMC7366686](https://europepmc.org/article/PMC/PMC7366686)
5. **Gonçalves Netto A, Ribeiro VHV, Nicolai M, Lopez Ovejero RF, Silva VFV, Junior GJP, Brunharo C (2025)**, Pest Manag Sci. DOI 10.1002/ps.8893 (PMC12332117). *A. hybridus*, Brazil. [V-FT]
   - ALS **Trp574Leu and Asp376Glu** found by amplicon sequencing.
   - Primers in the paper: forward 5′-ATGGCGTCCACTTCAACAAACC-3′, reverse 5′-CTAATAAGCCCTTCTTCCATCACCC-3′, plus four sequencing primers.
   - Includes population-genomics SNP data.
   - Sequencing-based, not allele-specific.
   - [PMC12332117](https://europepmc.org/article/PMC/PMC12332117)
6. **Mikulka J, Sen MK, … Soukup J (2024)**, "Molecular Mechanisms of Resistance against PSII-Inhibiting Herbicides in Amaranthus retroflexus from the Czech Republic", Genes 15:904. DOI 10.3390/genes15070904 (PMC11275581). [V-FT]
   - **psbA Ser264Gly** found by Sanger sequencing with primers 5′-GCTATTATTCCTACTTCTGC-3′ and 5′-CCATTTGTAGATGGAGC-3′.
   - Chlorophyll fluorescence was proposed as a rapid phenotypic test.
   - No allele-specific PCR.
   - [PMC11275581](https://europepmc.org/article/PMC/PMC11275581)

**Rank B: validated assay with assay type confirmed, primers in a paywalled paper, in supplementary tables, or proprietary**

7. **Sarangi D, Stephens T, Barker AL, Patterson EL, Gaines TA, Jhala AJ (2019)**, Weed Sci 67. DOI 10.1017/wsc.2019.29. *A. tuberculatus*, Nebraska. [V-ABS]
   - "A Kompetitive Allele Specific PCR (KASP) assay was developed and performed for rapid and robust detection of the **ΔG210** mutation."
   - All plants of the resistant biotype tested positive.
   - Primer location not verified; paywalled.
   - [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1017%2Fwsc.2019.29%22)
8. **Porri A, Noguera MM, Betz M, Sälinger D, Brändle F, Bowe SJ, et al. (2022)**, "Can double PPO mutations exist in the same allele and are such mutants functional?", Pest Manag Sci 78:2258–2264. DOI 10.1002/ps.6850 (PMC9314999). [V-FT]
   - **Pyrosequencing** (PyroMark Q24) of PPX2 R128, ΔG210 and G399A, run by IDENTXX GmbH.
   - The paper says the "specific sequencing primers" belong to IDENTXX. Primer sequences were not found in the text scan; they may be proprietary.
   - Validated across F1 and F2 crosses.
   - [PMC9314999](https://europepmc.org/article/PMC/PMC9314999)
9. **Noguera MM, Rangani G, Heiser J, … Porri A, … Roma-Burgos N (2021)**, "Functional PPO2 mutations: co-occurrence in one plant or the same ppo2 allele of herbicide-resistant Amaranthus palmeri in the US mid-south", Pest Manag Sci. DOI 10.1002/ps.6111. [V-ABS]
   - 115 accessions genotyped for four PPO2 target-site mutations (ΔG210, R128G, G399A, and others). 74% carried at least one.
   - Paywalled; assay type not stated in the abstract.
   - [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1002%2Fps.6111%22)
10. **Dhaka P, Rangani G, Porri A, Meiners I, Scott RC, Roma-Burgos N (2026)**, "Persistence of PPO mutations and dynamics of Amaranthus palmeri resistance to PPO-inhibitor herbicides in a decade", Pest Manag Sci. DOI 10.1002/ps.71056 (PMC13569166). Open access. [V-FT]
    - Survivors genotyped by **pyrosequencing** for ΔG210, R128G, G399A and V361A, following Porri 2022 and Rangani 2019.
    - PPO1/PPO2 copy number by qPCR (2^−ΔΔCt, Actin reference).
    - Mutation frequencies are in Table S1.
    - [PMC13569166](https://europepmc.org/article/PMC/PMC13569166)
11. **Nie H, Harre NT, Young BG (2023)**, "A New V361A Mutation in Amaranthus palmeri PPX2 Associated with PPO-Inhibiting Herbicide Resistance", Plants 12:1886. DOI 10.3390/plants12091886 (PMC10181388). Open access. [V-FT]
    - 1,828 plants from 9 states screened for ΔG210 with a TaqMan qPCR (adapted from earlier work), and for R128G/M with two dCAPS assays (citing Giacomini 2017).
    - New mutation **V361A**, validated in a bacterial complementation system. No new allele-specific assay for V361A.
    - PPX2 CDS primers are in the paper.
    - [PMC10181388](https://europepmc.org/article/PMC/PMC10181388)
12. **Gaines TA, Zhang W, Wang D, … Tranel PJ, … Westra P (2010)**, "Gene amplification confers glyphosate resistance in Amaranthus palmeri", PNAS 107:1029. DOI 10.1073/pnas.0906649107 (PMC2824275). [V-ABS]
    - **qPCR EPSPS relative copy number**: 5- to >160-fold in resistant plants.
    - Heritable, and co-segregated with resistance in pseudo-F2 populations.
    - It is the reference copy-number method reused by Spaunhorst 2019 and others.
    - [Europe PMC](https://europepmc.org/article/PMC/PMC2824275)
13. **Noguera MM, Porri A, … (2022)**, "Involvement of glutamine synthetase 2 (GS2) amplification and overexpression in Amaranthus palmeri resistance to glufosinate", Planta. DOI 10.1007/s00425-022-03968-2 (PMC9374794). Open access. [V-FT]
    - **Multiplex TaqMan qPCR** for GS1 isoforms and GS2 against Actin, run on gDNA for copy number and on cDNA for expression.
    - Primers and probes are in **Table S1** (supplement; contents not opened).
    - [PMC9374794](https://europepmc.org/article/PMC/PMC9374794)
14. **Carvalho-Moore P, Borgato EA, Cutti L, Porri A, Meiners I, Lerchl J, Norsworthy JK, Patterson EL (2025)**, Plant Cell. DOI 10.1093/plcell/koaf069 (PMC11985328). Open access. [V-FT]
    - **Digital PCR plus TaqMan** copy number for GS2.1, GS2.2 and EPSPS on a rearranged eccDNA.
    - Validated on glufosinate-resistant accessions MSR1 and MSR2.
    - [PMC11985328](https://europepmc.org/article/PMC/PMC11985328)
15. **Porri A, Sudhakar S, Noguera MM, … Norsworthy J (2026)**, Pest Manag Sci. DOI 10.1002/ps.70827 (PMC13352219). Open access. [V-ABS]
    - Digital PCR for GS copy number.
    - Found GS2.2 **G255D**, but it did *not* confer glufosinate tolerance when expressed in Arabidopsis.
    - Note it as a negative-validation entry, not a diagnostic marker.
    - [Europe PMC](https://europepmc.org/article/PMC/PMC13352219)
16. **Murphy BP, Plewa DE, Phillippi E, Bissonnette SM, Tranel PJ (2017)**, "A quantitative assay for Amaranthus palmeri identification", Pest Manag Sci. DOI 10.1002/ps.4632. [V-ABS]
    - **qPCR on ITS SNPs** specific to *A. palmeri*, distinguishing it from 12 other Amaranthus species.
    - Detects 1 seed in 100. Species ID only.
    - Paywalled; primers not verified.
    - [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1002%2Fps.4632%22)
17. **Brusa A, Patterson EL, Gaines TA, Dorn K, Westra P, Sparks CD, Wyse D (2021)**, "A needle in a seedstack: an improved method for detection of rare alleles in bulk seed testing through KASP", Pest Manag Sci. DOI 10.1002/ps.6278. [V-ABS]
    - **Three KASP assays** built from GBS-derived species-specific SNPs for *A. palmeri*.
    - Sensitivity 99.8–100%, specificity 99.59–100%; validated on 20 *A. palmeri* populations and 8 other species. Detects 1 seed in 200.
    - Also reports "a comprehensive GBS dataset"; where it was deposited is not verified.
    - Paywalled.
    - [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1002%2Fps.6278%22)
18. **Milani A, Scarabel L, Sattin M (2020)**, "A family affair…", Pest Manag Sci. DOI 10.1002/ps.5667. [V-ABS]
    - Uses "a species-specific molecular marker" to confirm botanical identification of *A. retroflexus*, *A. tuberculatus* and *A. hybridus*.
    - ALS Asp376Glu found in *A. retroflexus*; Trp574Leu and the novel **Trp574Met** in *A. hybridus*.
    - Type of species marker and primers not verified; paywalled.
    - It is the predecessor of the already-included Milani 2023 PASA paper.
19. **Tranel PJ, Wu C, Sadeque A (2017)**, "Target-Site Resistances to ALS and PPO Inhibitors Are Linked in Waterhemp", Weed Sci. DOI 10.1614/ws-d-16-00090.1. [V-ABS]
    - Molecular-marker analysis showed **ALS and PPX2 linked at 7.5 cM, about 195 kb apart** in the grain-amaranth genome.
    - Marker types not stated in the abstract.
    - Directly relevant as a mapped locus pair.
20. **Bell MS, Hager AG, Tranel PJ (2013)**, Weed Sci. DOI 10.1614/ws-d-12-00166.1. [V-ABS]
    - Molecular confirmation of ALS W574L and PPO ΔG210 in multiple-resistant Illinois waterhemp.
    - Assay type not stated in the abstract.
21. **Park YJ, Nishikawa T (2012)**, "Rapid identification of Amaranthus caudatus and Amaranthus hypochondriacus by sequencing and PCR-RFLP analysis of two starch synthase genes", Genome 55. DOI 10.1139/g2012-050. [V-ABS]
    - **PCR-RFLP**: SSSI amplicon (423 bp) cut with EcoRI identifies *A. caudatus*; GBSSI (waxy locus) amplicon (627/635 bp) cut with TaqI identifies *A. hypochondriacus*.
    - Validated on 126 accessions.
    - This is the only grain-amaranth starch-gene PCR assay found. It identifies species, not the waxy phenotype.
    - Paywalled.

**Target-site resistance reports without a dedicated assay (sequencing only), for completeness of the target-gene matrix**
- ALS **Pro197Ile** (new for *A. palmeri*), with Trp574Leu and Ser653Asp, in Shandong, China. Found by Sanger sequencing; no allele-specific assay. — [Ji M et al. 2025 Plants 14:525, 10.3390/plants14040525](https://europepmc.org/article/PMC/PMC11859721)
- Eight ALS alleles, including Pro197Ile, plus eccDNA-borne EPSPS amplification in Spanish *A. palmeri*. — [Manicardi et al. 2025 PMS, 10.1002/ps.70034](https://europepmc.org/article/PMC/PMC12441762)
- EPSPS copy-number qPCR (mean 12.7 copies in the Bujaraloz population); ALS mutations by sequencing. — [Trebol-Aizpurua et al. 2025 Plants 14:1505, 10.3390/plants14101505](https://europepmc.org/article/PMC/PMC12115111)
- Arkansas *A. palmeri*: Trp574Leu in all resistant plants tested, plus Ala122Thr, Pro197Ala and Ser653Asn. — [Singh S et al. 2019 PMS, 10.1002/ps.5232](https://europepmc.org/search?query=DOI%3A%2210.1002%2Fps.5232%22)
- *A. hybridus* (Argentina): EPSPS **TAP-IVS** triple substitution and ALS Ser653Asn. — [García MJ et al. 2020 Sci Rep, 10.1038/s41598-020-74430-0](https://europepmc.org/article/PMC/PMC7572458)
- Redroot pigweed and tall waterhemp: ALS W574L. — [Nandula, Giacomini, Ray 2020 PLoS One, 10.1371/journal.pone.0235394](https://europepmc.org/article/PMC/PMC7323944)
- Waterhemp ALS S653N and S653T (sequencing; dose-response on derived lines). — [Patzoldt & Tranel 2007 Weed Sci, 10.1614/ws-06-213.1](https://europepmc.org/search?query=DOI%3A%2210.1614%2Fws-06-213.1%22)
- Waterhemp: EPSPS amplification plus **P106S**; PPO ΔG210 found with resequencing and pooled reads. — [Faleco et al. 2026 PMS, 10.1002/ps.70672](https://europepmc.org/article/PMC/PMC13158449)
- **TUB**: no known α- or β-tubulin SNPs and no copy-number change in trifluralin-resistant Arkansas *A. palmeri*; resistance appears GST-mediated. — [González-Torralva & Norsworthy 2021 Genes, 10.3390/genes12081225](https://europepmc.org/article/PMC/PMC8394034)
- Preprints (not peer reviewed):
  - Türkiye *A. palmeri*, 96 accessions screened for ALS Pro197Ser, Trp574Leu and Ser653Asn plus EPSPS copy number. — [Erbaş et al. 2026, 10.64898/2026.09.21.753262](https://europepmc.org/search?query=DOI%3A%2210.64898%2F2026.09.21.753262%22)
  - Israel *A. palmeri*: Trp574Leu, and no psbA mutation. — [Matzrafi et al. 2026, 10.64898/2026.09.07.749782](https://europepmc.org/search?query=DOI%3A%2210.64898%2F2026.09.07.749782%22)
- Trifludimoxazin was tested on biotypes carrying ΔG210, R128G (waterhemp) and V361A (Palmer). — [Steppig, Johnson, Young 2025 Weed Sci, 10.1017/wsc.2024.103](https://api.crossref.org/works/10.1017/wsc.2024.103)

**Sex markers (beyond Montgomery 2019)**
- **Montgomery JS, Giacomini DA, Weigel D, Tranel PJ (2021)**, "Male-specific Y-chromosomal regions in waterhemp and Palmer amaranth", New Phytol 229:3522–3533. DOI 10.1111/nph.17108.
  - Defines MSY regions: about 1.3 Mb in *A. palmeri* and about 4.6 Mb in *A. tuberculatus*.
  - Contains the 572-bp male-specific marker later located on hap1 of the A. tuberculatus assembly.
  - Paywalled.
  - [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1111%2Fnph.17108%22); [BMC Genomics 2025 (PMC12581244)](https://europepmc.org/article/PMC/PMC12581244)
- **BMC Genomics 2025**, "Analyses of contiguous reference genomes of Amaranthus tuberculatus highlight the landscape of the sex-associated region…". DOI 10.1186/s12864-025-12181-w (PMC12581244).
  - The primer sets **MU-976, MU-657.2 and MU-533**, and the 572-bp marker (at 33,273,720–33,274,292 bp on Hap1), all map inside the candidate SDR on Chr1 (Table S5).
  - This places the already-included markers at physical coordinates.
  - [PMC12581244](https://europepmc.org/article/PMC/PMC12581244)
- **Neves CJ, Matzrafi M, Thiele M, Lorant A, Mesgaran MB, Stetter MG (2020)**, J Hered. DOI 10.1093/jhered/esaa047 (PMC7846199).
  - Male-specific k-mers and contigs (about 2 Mb), with 90% mapping to one scaffold of the *A. palmeri* draft genome.
  - The full-text scan found no PCR marker validation.
  - [PMC7846199](https://europepmc.org/article/PMC/PMC7846199)
- **PLoS Biol 2025**, "The evolution of separate sexes in waterhemp is associated with surprising chromosomal diversity and complexity". DOI 10.1371/journal.pbio.3003254.
  - Coverage-based GWA of sex in the Chr1 sex-linked region.
  - Reports **genotype–phenotype mismatch** of sex in an independent dataset (Figshare S20). This is relevant to how reliable the sex markers are.
  - [Figshare items](https://api.figshare.com/v2/articles/search)

**Patents (leads only)**
- US 11866793, "Assay for detecting palmer amaranth DNA in individual and mixed samples". [UNVERIFIED] — [USPTO PDF](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11866793)
- US 9963750, "High throughput method to genotype plants". A search snippet says it describes a KASP assay on an ALS SNP that separates waterhemp from Palmer, spiny, Powell amaranth and redroot pigweed. [UNVERIFIED] — [USPTO PDF](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9963750)

### Inferences
- Suggested priority for the "validated PCR markers" table:
  1. Spaunhorst 2019 TaqMan W574L
  2. Rangani 2019 CAPS G399A
  3. Sarangi 2019 KASP ΔG210
  4. Varanasi 2018 TaqMan ΔG210/R128 (corrected attribution)
  5. Gaines 2010 EPSPS qPCR
  6. GS2 TaqMan and dPCR copy number (Noguera 2022; Carvalho-Moore 2025)
  7. Pyrosequencing panels (Porri 2022, Noguera 2021, Dhaka 2026)
  8. Species-ID assays (Brusa 2021 KASP, Murphy 2017 qPCR, Galindo-González 2026 Cas12a, Park & Nishikawa 2012 PCR-RFLP)
- V361A (PPO2), Pro197Ile (ALS), Asp376Glu (ALS), Trp574Met (ALS) and TAP-IVS (EPSPS) are validated resistance *mutations*, but no allele-specific PCR assay has been published for them. They belong in a "known mutations" table rather than the "validated assays" table.
- No HPPD target-site mutation and no HPPD diagnostic PCR was found for Amaranthus. HPPD resistance in *A. palmeri* and *A. tuberculatus* is consistently attributed to metabolism (P450s such as CYP72A1182).
- For psbA Ser264Gly in Amaranthus, only sequencing-based detection was found among recent papers.

### Gaps
- No published allele-specific PCR assay was found for **grain amaranth traits**: waxy/GBSSI phenotype, seed colour MYB on Chr9, betalain, or flowering. Stetter et al. 2020 MBE (10.1093/molbev/msz304) mapped seed colour to Chr3 and Chr9 (a MYB-like gene) but did not report a PCR marker in its abstract.
- Not checked because of paywalls: primer sequences in Sarangi 2019, Varanasi 2018, Murphy 2017, Brusa 2021, Noguera 2021, Milani 2020 and Salas-Perez 2017. Gaines 2010 is in PMC (PMC2824275), but its full text was not scanned for primers either.
- Older classic papers (e.g. Whaley et al. 2007 on the smooth pigweed ALS mutation; Patzoldt et al. 2005 PCR assays) were not retrievable through these APIs and remain unverified leads.
- psbA, TUB and HPPD: no Amaranthus diagnostic PCR found. This may be a true absence or a search limitation in older Weed Science issues that are not indexed in full text.

## Key Question 2: Which repositories hold Amaranthus linkage maps, QTL, GWAS results or genotype data?

### Takeaway
No repository holds curated Amaranthus QTL or GWAS summary statistics in a database form; GWAS Atlas and AGRDB have none, as stated in the brief. The usable sources fall into three kinds:
- Supplementary significant-SNP tables on Figshare (Frontiers) and Springer, e.g. the seed-protein GWAS (Front Nutr 2026), the mineral GWAS (BMC Genomics 2026) and the Zaelani 2025 QTL maps.
- Raw genotype data in NCBI SRA and ENA: the GBS panel PRJNA1208757 and the seed-colour mapping populations PRJEB30531.
- Genome and annotation portals: WeedPedia, CoGe, Phytozome and PopAmaranth.

Dryad holds four or five Amaranthus population-genetic datasets. None is a QTL table.

### Cited Findings

**Datasets with marker positions or significant-SNP tables (highest priority)**
- **Figshare (Frontiers supplement)**, "Genetic architecture of seed protein composition in grain amaranth (A. hypochondriacus): a multi-environment GWAS", Front Nutr 2026. DOI 10.3389/fnut.2026.1758193.
  - Supplementary Tables 1–5 have DOIs 10.3389/fnut.2026.1758193.s001 to .s006.
  - Raw data are in NCBI SRA PRJNA1208757.
  - Open access.
  - [Figshare API search](https://api.figshare.com/v2/articles/search); [PMC13008625](https://europepmc.org/article/PMC/PMC13008625)
- **BMC Genomics 2026**, "Deciphering the genetic determinants of calcium, iron, magnesium and zinc accumulation in grain amaranth (A. hypochondriacus)". DOI 10.1186/s12864-026-12595-0 (PMC13005450).
  - GWAS with **41,931 SNPs** on the Phytozome A. hypochondriacus v2 reference.
  - Phenotypic and analytical data are in "Supplementary Material 1–6".
  - Raw data: PRJNA1208757. Open access.
  - [PMC13005450](https://europepmc.org/article/PMC/PMC13005450)
- **Zaelani A, Isobe S, Shirasawa K, Yoshioka Y (2025)**, "QTL mapping of key phenological and morphological traits in grain amaranth", Breed Sci. DOI 10.1270/jsbbs.25032 (PMC13129576).
  - F2 of Golden × Pygmy Torch genotyped by ddRAD.
  - Three linkage maps (5640, 5970.3 and 6960.2 cM) and 12 stable QTLs on Chr 4, 6, 9, 10 and 16 (e.g. AhPH6, AhSTD4, AhSCC9).
  - Open access.
  - [PMC13129576](https://europepmc.org/article/PMC/PMC13129576)
- **Maughan PJ et al. (2011)**, "Development, Characterization, and Linkage Mapping of Single Nucleotide Polymorphisms in the Grain Amaranths (Amaranthus sp.)", The Plant Genome. DOI 10.3835/plantgenome2010.12.0027.
  - SNP linkage map; marker positions expected in the paper or supplement (not opened).
  - [Crossref](https://api.crossref.org/works/10.3835/plantgenome2010.12.0027)
- **Stetter MG, Vidal-Villarejo M, Schmid KJ (2020)**, "Parallel Seed Color Adaptation during Multiple Domestication Attempts of an Ancient New World Grain", Mol Biol Evol. DOI 10.1093/molbev/msz304.
  - 121 resequenced crop and wild individuals.
  - Seed-colour loci on **Chr3 and Chr9** (MYB-like gene), mapped in three populations.
  - ENA **PRJEB30531** ("Repeated domestication attempts… genetic control of seed color adaptation").
  - [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1093%2Fmolbev%2Fmsz304%22); [NCBI BioProject](https://www.ncbi.nlm.nih.gov/bioproject/?term=PRJEB30531)
- **Kreiner JM, Giacomini DA, … Tranel PJ, Weigel D, … (2019)**, PNAS. DOI 10.1073/pnas.1900870116 (PMC6800383).
  - *A. tuberculatus* genome plus 163 resequenced glyphosate-resistant and susceptible individuals.
  - A **GWA follow-up** (Kreiner et al. 2020, bioRxiv 10.1101/2020.08.19.257972) reports 250 non-target-site genes associated with glyphosate resistance across 16 chromosomes.
  - Raw reads likely in ENA PRJEB31711 ("Short read sequencing of glyphosate resistant and sensitive Amaranthus tuberculatus"). The link between paper and accession is inferred from the title, not confirmed.
  - [PMC6800383](https://europepmc.org/article/PMC/PMC6800383)
- **NCBI PRJNA1012341**, "QTL mapping HPPD-resistant Palmer" (registered 2023-09-02). Raw data for an HPPD QTL study. The associated paper was not identified. — [NCBI BioProject](https://www.ncbi.nlm.nih.gov/bioproject/PRJNA1012341)
- **NCBI PRJNA1193012**, "Amaranthus cruentus and Amaranthus hypochondriacus MAGIC population parent line genome sequencing and assembly" (2024-12-02). Indicates a MAGIC mapping population. — [NCBI BioProject](https://www.ncbi.nlm.nih.gov/bioproject/PRJNA1193012)
- **NCBI PRJNA1236290**, "Research on grain color in Amaranthus hypochondriacus" (2025-03-14). Paper not identified. — [NCBI BioProject](https://www.ncbi.nlm.nih.gov/bioproject/PRJNA1236290)

**Genotype and raw-data repositories (usable for re-mapping)**
- **NCBI SRA PRJNA1208757**: GBS of a 192-accession *A. hypochondriacus* diversity panel (384 SRA records). Shared by the 2025 Sci Rep population-structure paper, the 2026 seed-protein GWAS and the 2026 mineral GWAS. — [PMC12485120](https://europepmc.org/article/PMC/PMC12485120)
- Other NCBI BioProjects:
  - PRJNA636388: "GBS sequencing of Amaranthus populations"
  - PRJNA1314426: "Amaranthus spp. raw dart data", likely the DArTseq data behind the 2022 PLoS One study (link not confirmed)
  - PRJNA878842: *A. tuberculatus* herbarium WGS
  - PRJNA1271454: WGS of *A. tuberculatus* individuals
  - PRJNA1381560: drought adaptation in *A. tuberculatus*
  - PRJDB12448: *A. tricolor* genome-wide SNP diversity
  - ENA PRJEB13013: *A. caudatus* incomplete domestication
  - ENA PRJEB18745: Amaranthus GBS phylogeny
  - ENA PRJEB88670: chromatin landscape during domestication
  - In total, 146 BioProjects match Amaranthus[Organism] as of 2026-10-14.
  - [NCBI E-utilities query](https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=bioproject&term=Amaranthus%5BOrganism%5D)
- **Jamalluddin N, Massawe FJ, Mayes S, Ho WK, Symonds RC (2022)**, "Genetic diversity analysis and marker-trait associations in Amaranthus species", PLoS One. DOI 10.1371/journal.pone.0267752 (PMC9098028).
  - DArTSeq on 188 accessions of 18 species: 74,303 SNP alleles, 63,821 placed on the A. hypochondriacus genome.
  - Marker-trait associations, with *A. tricolor* as the focus.
  - Open access.
  - [PMC9098028](https://europepmc.org/article/PMC/PMC9098028)
- **Singh R, Mahato AK, … (2025)**, "Development and validation of a high-density 'AmahySNP' genotyping array", BMC Plant Biol. DOI 10.1186/s12870-025-07367-z (PMC12487340).
  - 64,069-SNP Affymetrix Axiom array on the A. hypochondriacus genome; SNP positions are a platform resource.
  - Open access.
  - [PMC12487340](https://europepmc.org/article/PMC/PMC12487340)

**Dryad (full Amaranthus hit list, 26 hits, relevant ones listed)**
- 10.5061/dryad.43874: interspecific hybridization transfers a glyphosate-resistance mechanism (2011)
- 10.5061/dryad.1bv83: Amaranthus GBS phylogeny and genome size (Stetter & Schmid 2017)
- 10.5061/dryad.m5kk3: incomplete domestication of *A. caudatus* (2016)
- 10.5061/dryad.156j4: Amaranthus phylogeny from low-copy nuclear and chloroplast loci (2019)
- 10.5061/dryad.jp13f: waterhemp population genetics and origin (2015)
- **10.5061/dryad.sbcc2frjv**: "Departures from Mendelian inheritance of EPSPS gene copies in a herbicide-resistant weed" (2026; paper Proc R Soc B 10.1098/rspb.2026.0685). EPSPS copy-number segregation data. New, not in the checked list.
- Already checked per the brief: 8kprr4xwg, vdncjsxr6, pzgmsbcmw.
- Source: [Dryad API search](https://datadryad.org/api/v2/search?q=Amaranthus)

**Zenodo**
- No Amaranthus QTL or GWAS datasets. Hits are mostly taxonomy figures and code.
- Example: "maxwelco/palmer_adaptation" software, 10.5281/zenodo.5236831. Its link to a paper was not verified.
- Source: [Zenodo API](https://zenodo.org/api/records?q=waterhemp)

**Genome and annotation portals**
- **WeedPedia (International Weed Genomics Consortium)** lists *A. hybridus*, *A. retroflexus*, *A. palmeri* and *A. tuberculatus*.
  - *A. palmeri* AmaPa_v01 and hap2: GCA_051800445.1; JBEFMX000000000 and JBEFMY000000000; BioProject PRJNA1120405; annotation via a SharePoint folder.
  - No variant, marker or QTL tracks are listed.
  - [WeedPedia species page](https://www.weedgenomics.org/species/amaranthus-palmeri/)
- **CoGe genome IDs**:
  - *A. palmeri* Hap1 68302 and Hap2 68303; *A. retroflexus* 68315; *A. hybridus* 68316 (Raiyemo 2025)
  - *A. tuberculatus* IWGC 69059 and 69062 (BMC Genomics 2025)
  - [PMC11850965](https://europepmc.org/article/PMC/PMC11850965); [PMC12581244](https://europepmc.org/article/PMC/PMC12581244)
- **PopAmaranth / AmaranthGDB (University of Cologne)**: Gonçalves-Dias & Stetter 2021, G3, DOI 10.1093/g3journal/jkab103.
  - Population-genetic statistics, selection scans, annotation and variant calls from WGS of 88 accessions, on the A. hypochondriacus reference.
  - Covers A. hypochondriacus, A. cruentus, A. caudatus, A. hybridus and A. quitensis.
  - Has a downloads page (contents not inspected) and a diversity explorer.
  - [AmaranthGDB](https://amaranthgdb.uni-koeln.de); [PopAmaranth info](https://amaranthgdb.uni-koeln.de/popamainfo.html)
- **Phytozome**: A. hypochondriacus v2.1 (Lightfoot et al. 2017, BMC Biol, 10.1186/s12915-017-0412-4). It is the reference used by the 2026 GWAS papers. The page is JavaScript-rendered and could not be scraped, so contents are unverified. — [Phytozome info page](https://phytozome-next.jgi.doe.gov/info/Ahypochondriacus_v2_1)
- **AGRDB**: Amaranth Genomic Resource Database (Front Plant Sci 2023, 10.3389/fpls.2023.1203855). Already checked per the brief: genes, SSRs and SNPs only.

### Inferences
- The highest-yield import targets for AmaranthQTLdb are, in order:
  1. Zaelani 2025 QTL tables and linkage maps
  2. The seed-protein GWAS supplementary tables (Figshare) and the mineral GWAS supplements
  3. Stetter 2020 seed-colour loci
  4. Maughan 2011 SNP linkage map
  5. Jamalluddin 2022 DArTseq marker-trait associations
  6. Kreiner 2019/2020 glyphosate GWA genes
- PRJNA1208757 underpins at least three papers. Using it for re-analysis would let these GWAS be harmonised on one reference (Phytozome v2).
- PRJNA1012341 (HPPD QTL in Palmer), PRJNA1193012 (MAGIC parents) and PRJNA1236290 (grain colour) point to mapping studies that were either unpublished or not found by these searches.

### Gaps
- Not checked: USDA GRIN (no genotype/QTL API was queried), T3 and GrainGenes-type breeding databases (no Amaranthus instance was found or searched), GEO (not queried), and CoGe browsing beyond the published IDs.
- The contents of the PopAmaranth downloads page and the Phytozome v2.1 data files (e.g. whether any linkage-map track exists) were not verified.
- Which paper uses PRJEB31711, PRJNA636388 and PRJNA1314426 was inferred from titles only.

## Key Question 3: Are there marker-trait datasets in the supplements of genome papers?

### Takeaway
The genome papers mostly supply assemblies and annotations, not marker-trait tables. Two exceptions are useful:
- The A. tuberculatus BMC Genomics 2025 paper anchors the published sex markers to Chr1 coordinates (Table S5).
- The A. tricolor DNA Research 2023 paper localises betalain genes (DODAα1 and CYP76ADα1 on Chr16).

Ma 2021 (A. cruentus) and Raiyemo 2025 Plant J describe gene-family and comparative analyses; no QTL or GWAS tables were found in the abstract and data statements.

### Cited Findings
- **Ma X, Vaistij FE, Li Y, … Van Deynze A, … (2021)**, "A chromosome-level Amaranthus cruentus genome assembly highlights gene family evolution and biosynthetic gene clusters…", Plant J. DOI 10.1111/tpj.15298.
  - 370.9 Mb genome. The abstract covers gene-family and biosynthetic-cluster analyses, with no mapping or GWAS.
  - Paywalled; supplements not checked.
  - [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1111%2Ftpj.15298%22)
- **Wang H, Xu D, … Fan W (2023)**, "Chromosome-scale Amaranthus tricolor genome provides insights into the evolution of the genus Amaranthus and the mechanism of betalain biosynthesis", DNA Res. DOI 10.1093/dnares/dsac050 (PMC9847342).
  - 520 Mb, 17 chromosomes.
  - **DODAα1 and CYP76ADα1 sit in one TAD on Chr16** and are more highly expressed in red leaves. These are candidate-gene positions, not markers.
  - Open access.
  - [PMC9847342](https://europepmc.org/article/PMC/PMC9847342)
  - A second A. tricolor assembly exists: DDBJ PRJDB14451, "De novo genome assembly of Amaranthus tricolor". [NCBI](https://www.ncbi.nlm.nih.gov/bioproject/PRJDB14451)
- **Raiyemo DA et al. (2025)**, "Chromosome-level assemblies of Amaranthus palmeri, Amaranthus retroflexus, and Amaranthus hybridus allow for genomic comparisons…", Plant J. DOI 10.1111/tpj.70027 (PMC11850965). Open access.
  - Data: NCBI PRJNA1120405, PRJNA1120413 and the *A. hybridus* project.
  - WGS: JBEFMX, JBEFMY, JBEFNP and JBELOC.
  - CoGe 68302, 68303, 68315 and 68316; also on WeedPedia.
  - No marker-trait table was found in the data statement.
  - [PMC11850965](https://europepmc.org/article/PMC/PMC11850965)
- **A. tuberculatus IWGC haplotype-resolved genomes**: BMC Genomics 2025, DOI 10.1186/s12864-025-12181-w.
  - Data: BioProject PRJNA1089550; CoGe 69059 and 69062.
  - Table S5 maps MU-976, MU-657.2, MU-533 and the 572-bp male marker into the candidate sex-determining region on Chr1 Hap1. This is the best physical anchor for the sex markers already in the table.
  - [PMC12581244](https://europepmc.org/article/PMC/PMC12581244)
- **PLoS Biol 2025**, waterhemp sex chromosomes (DOI 10.1371/journal.pbio.3003254). Six haplotype-phased assemblies from three males. Figshare supplements S15–S25 include a coverage-based GWA of sex and inversion lists. — [Figshare search](https://api.figshare.com/v2/articles/search)
- **Lightfoot DJ et al. (2017)**, A. hypochondriacus Hi-C chromosome assembly, BMC Biol. DOI 10.1186/s12915-017-0412-4. This is the reference for Phytozome v2.1; it was not checked for linkage-map supplements. — [Crossref](https://api.crossref.org/works/10.1186/s12915-017-0412-4)
- Newer assemblies seen in BioProject and Crossref, not examined for trait data:
  - *A. caudatus*: Sci Data 2026, 10.1038/s41597-026-08383-w
  - *A. cruentus* 'Hop Red': PRJNA1227196
  - *A. hypochondriacus* 'Plainsman' and IC-38040: PRJNA1340408 and PRJNA1341186
  - Grain amaranth pangenome preprint: 10.64898/2026.01.08.698315
  - [Crossref](https://api.crossref.org/works/10.1038/s41597-026-08383-w); [NCBI BioProject](https://www.ncbi.nlm.nih.gov/bioproject/?term=Amaranthus%5BOrganism%5D)

### Inferences
- For AmaranthQTLdb, the genome papers mainly provide **coordinate frameworks**: A. hypochondriacus v2.1 for grain-amaranth GWAS and QTL, IWGC assemblies for the weedy species, and CoGe IDs for liftover. They are not a source of trait loci.
- The A. tuberculatus Table S5 sex-marker coordinates should be imported to place the already-included sex markers.

### Gaps
- Not opened: the supplements of Ma 2021 (paywalled), Lightfoot 2017, the 2026 *A. caudatus* Sci Data paper and the pangenome preprint. Any marker-trait tables in them remain unconfirmed.
- No standalone *A. tricolor* genome paper by Hoshikawa et al. was verified. Only the DDBJ project PRJDB14451 was found, and its publication link was not confirmed.
