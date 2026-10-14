# Amaranthus GWAS / MTA / association-mapping studies: what is not yet in AmaranthQTLdb (search date 2026-10-14)

Search methods: Europe PMC REST queries on title, abstract and full text (17, 39 and 58 hits; all screened), Crossref and bioRxiv APIs, and web searches on species, regions and theses (Krishikosh, Africa, China in Chinese, Japan, Mexico). Primary pages were fetched where possible. The Wiley/BES pages for Cao 2026 returned HTTP 403, so details below that come only from that paper's abstract are marked as such.

## 1. New GWAS / MTA studies beyond the already-included list, ranked by usefulness

### Takeaway
Two new peer-reviewed GWAS papers and one PhD thesis with GWAS are not in the included list:
- **Laforest et al. 2026, Pest Manag Sci** (A. tuberculatus mesotrione resistance). This is the most useful: it gives 11 SNPs with chromosome and bp positions in main Table 1, and it is open access.
- **Cao et al. 2026, J Ecol** (A. palmeri flowering phenology GWAS in China). It names one candidate gene, PTM. Positions are not verified.
- **de Kinderen 2025 PhD thesis, Univ. York** (vegetable amaranth MAGIC population and diversity set). Leaf-yield loci on Chr 9 and Chr 10, plus 81 metabolite-GWAS associations. Open access.

The searches found no amaranth genomic-selection (genomic prediction) study.

### Cited Findings

**Rank 1: Laforest M, Bessette M, Gagnon G, Flores-Mejia S, Soufiane B, Goulet M-C, Michaud D. 2026.** "Integrated genomic and transcriptomic approaches reveal oxidative stress adaptation mechanisms in a mesotrione-resistant *Amaranthus tuberculatus* biotype." *Pest Manag Sci* 82(7):6387–6398. DOI 10.1002/ps.70721; PMC13240694; PMID 41813605. Open access (CC BY 4.0). — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)
- Species: A. tuberculatus, population 714 from Québec. 865 plants were screened at 100.6 g ha⁻¹ mesotrione. Of 158 genotyped plants, 152 were kept for GWAS (85 resistant, 67 susceptible). — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)
- Markers: triple-digest GBS (3D-GBS) sequenced on AVITI. 5,373,097 SNPs called, 373,458 after filtering (MAF 0.05). Reference genome: AmaTu_v01 (International Weed Genomics Consortium). Models: GAPIT 3.4.0 BLINK, MLMM and FarmCPU. — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)
- Trait: survival/damage after mesotrione (HPPD-inhibitor), scored on the Brown & Farmer scale.
- Results: 11 unique significant SNPs, listed in main-text Table 1. BLINK alone identified 2 SNPs.

  | Chromosome | Position (bp) | Note |
  |---|---|---|
  | Chr00 (unplaced) | 4,555,459 | |
  | Chr00 (unplaced) | 4,605,586 | |
  | Chr06 | 69,381 | |
  | Chr08 | 8,328,744 | |
  | Chr08 | 12,751,902 | |
  | Chr09 | 19,488,907 | |
  | Chr12 | 4,941,960 | |
  | Chr12 | 20,355,278 | |
  | Chr13 | 11,306,035 | |
  | Chr13 | 21,037,430 | Strongest signal, P = 1.77E-26 (BLINK) |
  | Chr14 | 25,693,063 | |

  — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)
- Supplementary Table S1 gives GO enrichment of genes near the GWAS hits. RNA-seq found 187 DEGs (Table S2). Raw data are available only on request. — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)

**Rank 2: Cao J, Qian Y, Guo J, Zhang Z, Wan F, Wang R. 2026.** "Asymmetric adaptation across a core–periphery climate gradient drives rapid phenological evolution and range expansion in an invasive plant." *Journal of Ecology* 114. DOI 10.1111/1365-2745.70312 (published 2026-04-20). Wiley standard licence, so probably not open access (unverified). — [Crossref](https://api.crossref.org/works/10.1111/1365-2745.70312); [J Ecol blog](https://jecologyblog.com/tag/invasive-species/)
- Species: Amaranthus palmeri, invasive in China (21–49° N). Design: a 5-year reciprocal-transplant common garden, plus QST–FST comparison, GWAS, a genome-wide FST scan and expression validation. — [Crossref abstract](https://api.crossref.org/works/10.1111/1365-2745.70312)
- Traits: flowering time and flowering duration. Northern populations flowered 2.5–18.9 days earlier, and their flowering lasted 5.7–18.2 days longer. — [Crossref abstract](https://api.crossref.org/works/10.1111/1365-2745.70312)
- Main result: PTM is the top GWAS candidate gene for flowering phenology. It falls in the top 5% of the FST distribution, shows signs of a selective sweep, and is more highly expressed in northern populations. — [Crossref abstract](https://api.crossref.org/works/10.1111/1365-2745.70312)
- Not verified (the full text returned HTTP 403): panel size, SNP number, reference genome, number of significant SNPs, positions, and supplementary tables.

**Rank 3: de Kinderen MAJ. 2025 (deposited 16 Feb 2026).** "Exploiting an Amaranth MAGIC population and diversity set for improvement of leafy vegetable traits." PhD thesis, University of York (supervisors K. Denby and D. Jeffares). Open access, CC BY-NC-ND 4.0. No DOI. — [White Rose eTheses](https://etheses.whiterose.ac.uk/id/eprint/38163/)
- Material: a 90-accession diversity set and a MAGIC population (51 offspring lines selected). Vegetable amaranth; the thesis also discusses the status of A. hybridus as a species.
- Reference: an inter-specific graph pan-genome built from the MAGIC founders and existing reference genomes (SV-based).
- Results:
  - leaf-yield associations at two loci, on Chr 9 and Chr 10;
  - 81 metabolite–genome associations from mGWAS on the diversity set;
  - 43 putative biosynthetic gene clusters.
- SNP association tables are reported to be in the supplementary files. — [White Rose eTheses](https://etheses.whiterose.ac.uk/id/eprint/38163/)
- This appears to be work from the Denby lab at York, a vegetable-amaranth programme with African partners (inference).

**Lower priority: sex-association studies in A. palmeri and A. tuberculatus (to add only if the sex locus is in scope)**
- **Montgomery JS, Sadeque A, Giacomini DA, Brown PJ, Tranel PJ. 2019.** "Sex-specific markers for waterhemp (*Amaranthus tuberculatus*) and Palmer amaranth (*Amaranthus palmeri*)." *Weed Science* 67:412–418. DOI 10.1017/wsc.2019.27. — [Crossref](https://api.crossref.org/works/10.1017/wsc.2019.27)
  - About 200 plants of each sex per species, RAD-seq.
  - 345 male-specific sequences in A. palmeri; 2,754 male-specific and 723 population-specific female-specific sequences in A. tuberculatus.
  - Tags are not positioned on a chromosome-level genome.
- An Illinois thesis (IDEALS item 115813, Montgomery) describes a GWAS of maleness in both species. It estimates the size of the male-specific Y (MSY) region. — [IDEALS](https://ideals.illinois.edu/items/115813)
- The A. palmeri MSY was later characterised by k-mer analysis. A 2023 BMC Biology paper by Raiyemo, Bobadilla & Tranel reports 11 candidate gene models in it, and finds that 78% of the region is repeats. — [bioRxiv 2020.05.25.113597](https://www.biorxiv.org/content/10.1101/2020.05.25.113597.full.pdf); [DOAJ](https://doaj.org/article/641624341ed041b68c76853c5a1034a3)
- Raiyemo et al. 2025 *Plant J* (DOI 10.1111/tpj.70027): chromosome-level A. palmeri, A. retroflexus and A. hybridus genomes, plus identification of a sex-determining region. Check whether it overlaps the Raiyemo 2025 BMC Genomics sex-GWA paper already included. — [Europe PMC listing](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1111/tpj.70027)

**Environmental / agricultural-association scan (borderline; no phenotype GWAS)**
- **Kreiner JM, Latorre SM, Burbano HA, Stinchcombe JR, Otto SP, Weigel D, Wright SI. 2022.** "Rapid weed adaptation and range expansion in response to agriculture over the past two centuries." *Science* 378:1079–1085. DOI 10.1126/science.abo7293. — [Crossref](https://api.crossref.org/works/10.1126/science.abo7293); [author PDF](https://stinchcombe.eeb.utoronto.ca/files/2023/01/science.abo7293.pdf)
  - A. tuberculatus, comparing agricultural with natural habitats in contemporary and herbarium samples.
  - 403 SNPs show strong signals of environment-associated (antagonistic) selection.
  - The PPO210 deletion has the highest agricultural-vs-natural FST in the genome (about 0.21). EPSPS amplification ranks 20th. — [bioRxiv 2022.02.25.482047](https://www.biorxiv.org/content/10.1101/2022.02.25.482047.full.pdf)
  - The loci are environment-associated, not trait GWAS. Include them only if habitat-associated loci are wanted.

### Inferences
- Laforest 2026 is the only new study with a complete, ready-to-load position table. Its coordinates are on AmaTu_v01, so it needs conversion if the database standardises on the Raiyemo 2025 phased A. tuberculatus assembly.
- Cao 2026 probably reports a GWAS on an A. palmeri reference (likely the Raiyemo/Montgomery assemblies). The full text or supplement needs to be read through institutional access before any loci are entered.

### Gaps
- Cao 2026: panel size, SNP count, reference, significant-SNP count, positions and PTM coordinates are unverified (full text blocked).
- de Kinderen thesis: marker numbers, exact positions and the trait list for the 81 mGWAS hits are not yet extracted; the PDF needs to be downloaded.
- A Queen's University (QSpace) thesis turned up in search results but could not be fetched (redirect). It may be from the Kreiner/Wright circle and is unverified.

## 2. Corrections and verification of already-included or adjacent items

### Takeaway
Boro & Yadav 2026 does **not** contain a GWAS according to its abstract: it is a diversity and population-structure study. GWAS is mentioned only as future work. Several other candidate papers found by the searches turned out to contain no trait-association results.

### Cited Findings
- **Boro J, Yadav HK. 2026.** "Unravelling genetic diversity in grain amaranth (*Amaranthus hypochondriacus* L.) core accessions using genome-wide SNP markers." *Mol Genet Genomics*. DOI 10.1007/s00438-026-02464-6. — [Europe PMC record](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1007/s00438-026-02464-6&resultType=core&format=json)
  - Whole-genome sequencing of 248 core accessions, about 285,000 high-quality SNPs, 6 subpopulations, moderate LD.
  - 17,350 SNP-associated genes annotated, meaning SNPs that fall inside genes, not trait associations.
  - The abstract says the work "supports future genome-wide association studies".
  - Paywalled. The full text was not checked for a hidden GWAS, but the abstract gives no hint of one.
- No trait GWAS was found in these candidates:
  - **Singh A, Stetter MG 2025, *Evol Appl*** (10.1111/eva.70124): only selection scans on more than 300 WGS accessions from India. — [Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1111/eva.70124&resultType=core&format=json)
  - **Siamey et al. 2025, *PLoS One*** (10.1371/journal.pone.0328567): 21 accessions, 6 SSR and 4 ISSR markers, Ghana. Diversity only. — [Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1371/journal.pone.0328567&resultType=core&format=json)
  - **Sulub-Tun et al. 2025 bioRxiv** (10.1101/2025.11.27.690906): A. cruentus domestication, 138 WGS accessions, Mexico. Population genomics only. — [bioRxiv API](https://api.biorxiv.org/details/biorxiv/10.1101/2025.11.27.690906)
  - **Hoshikawa et al. 2022, *Sci Hortic*** (10.1016/j.scienta.2022.111428): 465 A. tricolor accessions, ddRAD, 5,638 SNPs, a 105-accession core collection. No GWAS. — [JIRCAS](https://www.jircas.go.jp/en/release/2022/press202209)
- **Ludwig E, Winkler TS, Stetter MG 2026, bioRxiv 10.64898/2026.01.08.698315** (grain amaranth pangenome): not a GWAS. It is biparental QTL mapping of flowering time in 449 F3 lines with more than 230,000 SNPs:
  - **Chr10, 11,911,867–12,485,518 bp.** Candidate AHq016812, a TOE2 ortholog; −16.4 days.
  - **Chr6, 20,322,569–24,290,483 bp.** Candidate AHq011814, an FT ortholog; −11.5 days.

  Pass it to the QTL compiler if it is not already captured. — [bioRxiv](https://www.biorxiv.org/content/10.64898/2026.01.08.698315v2.full)
- **Zaelani A, Isobe S, Shirasawa K, Yoshioka Y. 2025.** "QTL mapping of key phenological and morphological traits in grain amaranth." *Breed Sci* 75:392–399 (10.1270/jsbbs.25032). This is QTL mapping from a Japanese group, not GWAS. An HRM marker from a Chr4 SNP was associated with heading date, anthesis date, plant height, stem diameter and node number. — [Crossref](https://api.crossref.org/works/10.1270/jsbbs.25032); [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13129576/)
- The seed-colour preprint already included as "Winkler 2026" appears to be "Pleiotropy and repeated mutation drove convergent domestication of grain amaranth," bioRxiv 10.64898/2026.02.26.708151. It is a GWAS on 144 A. hypochondriacus accessions (GAPIT CMLM). Check that the DOI matches the included entry. — [bioRxiv](https://www.biorxiv.org/content/10.64898/2026.02.26.708151v1.full)
- The Lin 2022 Plant Genome GWAS also exists as bioRxiv 10.1101/2021.10.05.463269 (2021). This is a duplicate; do not add it twice. — [Europe PMC listing](https://www.biorxiv.org/content/10.1101/2021.10.05.463269v1.full)
- The Kreiner 2021 *Mol Ecol* glyphosate GWA paper has a bioRxiv preprint, 10.1101/2020.08.19.257972. Also a duplicate. — [bioRxiv](https://www.biorxiv.org/content/10.1101/2020.08.19.257972.full.pdf)

### Inferences
- Boro & Yadav 2026 should be recorded as "diversity/population structure, no significant loci." The panel and SNPs could support a future GWAS by the same group (NBRI Lucknow).

### Gaps
- The Boro 2026 full text was not inspected (paywalled). Its "no GWAS" status rests on the abstract only.

## 3. Regional coverage (India, Africa, China, Japan, Mexico, Europe) and databases

### Takeaway
- **India:** the ICAR-NBPGR, GBPUAT Pantnagar and NBRI papers found are already included or contain no GWAS.
- **Africa:** no amaranth GWAS was found for Kenya, Nigeria, Benin, South Africa or Burkina Faso. The closest is the York thesis (vegetable amaranth).
- **China:** one new GWAS, Cao 2026 on A. palmeri. Nothing was found for A. tricolor apart from the included Lin Y 2026 preprint.
- **Japan:** Hoshikawa 2022 (core collection, no GWAS) and Zaelani 2025 (QTL, not GWAS).
- **Mexico:** Sulub-Tun 2025 (no GWAS).
- **Europe:** Stetter lab (already included) and the York thesis (new).
- **GWAS Atlas** does not include Amaranthus.

### Cited Findings
- **India:**
  - Krishikosh searches returned only variability and correlation theses, e.g. Rathure 2023 (RVSKVV, A. tricolor), Raut 2013 (MPKV), Panda 2015 (OUAT). None has marker-trait association. — [Krishikosh item](https://krishikosh.egranth.ac.in/items/ec850310-d6a3-4f39-82bb-b9310fce89f4)
  - Chauhan et al. 2025 *Sci Rep* (10.1038/s41598-025-01626-7) is a GBS diversity and population-structure paper on the same GBPUAT/NBPGR panel used in the included Prabhakaran 2026 and Chauhan 2026 GWAS. It has no association results in its abstract. — [Nature](https://www.nature.com/articles/s41598-025-01626-7)
- **Africa:**
  - A Burkina Faso SSR+GBS diversity preprint (bioRxiv 10.64898/2026.01.09.697177) shows no GWAS component. — [bioRxiv](https://www.biorxiv.org/content/10.64898/2026.01.09.697177v1.full)
  - A Benin multi-environment trial of 10 genotypes has no markers. — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12329764/)
  - The 2026 review "Amaranth as an opportunity crop in Africa" (Mkpuma et al., *Front Plant Sci*, 10.3389/fpls.2026.1841633) is a review with Benin and KALRO authors. — [PubMed](https://pubmed.ncbi.nlm.nih.gov/42231898/)
- **Chinese-language search:** no Chinese-language amaranth (苋菜) GWAS was found. Results returned spinach and other crops. — [search result example](https://www.casb.org.cn/CN/Y2023/V39/I22/23)
- **Nottingham:** the Jamalluddin PhD thesis (University of Nottingham), "Genetic diversity analysis and trait phenotyping for drought tolerance in Amaranth," is the thesis behind the included Jamalluddin 2022 PLoS ONE paper. It may hold additional drought MTAs; this was not verified. — [Nottingham eprints](https://eprints.nottingham.ac.uk/60530); [Nottingham repository](https://nottingham-repository.worktribe.com/output/8049740)
- **Herbicide-resistance weeds:**
  - Apart from Laforest 2026 and the included Kreiner 2021, no GWAS was found for herbicide resistance in A. palmeri, A. retroflexus, A. hybridus or A. spinosus. Existing work is mechanism-based (EPSPS eccDNA, ALS and PPX2L mutations). — [PMC7366686](https://pmc.ncbi.nlm.nih.gov/articles/PMC7366686/); [Plant Cell 2025](https://academic.oup.com/plcell/article/37/4/koaf077/8103790)
  - Werle et al. 2025 *Pest Manag Sci* (10.1002/ps.8712, dicamba/2,4-D in A. tuberculatus) appeared in the full-text query. Its abstract describes non-target-site mechanisms; whether it includes an association analysis was not verified. — [Europe PMC listing](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1002/ps.8712)
- **Genomic selection:** none found. The DBT brochure on the 64K grain amaranth SNP chip reports 99.7% validation accuracy but no genomic-prediction results. — [DBT brochure](https://dbtindia.gov.in/sites/default/files/Amaranth%20broucher%20final%20%281%29.pdf)
- **GWAS Atlas (NGDC):** 21 plant species are listed, and Amaranthus is not among them. — [GWAS Atlas](https://ngdc.cncb.ac.cn/gwas/)

### Inferences
- The field is small. With the included list plus Laforest 2026, Cao 2026 and the de Kinderen thesis, the inventory of Amaranthus GWAS/MTA studies is probably close to complete for indexed literature up to October 2026. The main remaining risk is untranslated Chinese-journal papers and unindexed African or Indian MSc/PhD theses.

### Gaps
- No search of CNKI or Wanfang (not accessible), J-STAGE beyond Breeding Science, or African university repositories (e.g. JKUAT, UNISA).
- Indian J Genet Plant Breed was not searched directly; none of the general searches surfaced an amaranth MTA paper from it.
- Werle 2025 and the Queen's QSpace thesis were not checked in full.
