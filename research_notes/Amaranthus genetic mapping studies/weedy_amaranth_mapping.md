# Genetic mapping of traits in weedy amaranths (A. palmeri, A. tuberculatus, A. retroflexus, A. hybridus, A. powellii, A. spinosus, A. blitoides, A. albus, A. viridis)

Search date: 2026-10-14. Sources searched: Europe PMC REST API (PubMed + preprints + theses), Crossref API, Europe PMC full-text XML of open-access papers, WSSA abstract books 2021 and 2025 (full-text grep), web search (IDEALS, Mountain Scholar, Cambridge, Wiley). Studies already in the AmaranthQTLdb (listed in the brief) are not re-reported except where they give context or a correction.

Ranking key used throughout:
- **Tier 1**: chromosome + bp (or cM) positions printed in the paper or supplement. Ready to curate.
- **Tier 2**: chromosome or region named, but no bp table (or the positions sit only in figures or supplements I did not open).
- **Tier 3**: locus placed physically (FISH, synteny, eccDNA) or a marker assay, with no trait-mapping statistic.
- **Not mapping**: mechanism or inheritance studies, listed so they are not chased again.

---

## Q1. Herbicide-resistance QTL / BSA / GWAS / fine-mapping studies not already included

### Takeaway
I found **one new, high-value resistance GWAS with bp positions**: Laforest et al. 2026 (mesotrione/HPPD, Quebec waterhemp; 11 SNPs on the AmaTu_v01 IWGC reference). Its precursor is a 2025 WSSA abstract. I found **two more population-genomic papers by Kreiner with TSR/EPSPS sweep loci**: eLife 2022 and Science 2022. Beyond these, the literature on glufosinate, PPO, S-metolachlor, atrazine, paraquat and ALS consists of mechanism or inheritance studies with no mapped loci. I found no published QTL/BSA/GWAS for any species other than A. tuberculatus and A. palmeri.

### Cited Findings

**Tier 1: new, curatable now**

- **Laforest M, Bessette M, Gagnon G, Flores-Mejia S, Soufiane B, Goulet MC, Michaud D. 2026.** "Integrated genomic and transcriptomic approaches reveal oxidative stress adaptation mechanisms in a mesotrione-resistant *Amaranthus tuberculatus* biotype." *Pest Management Science* 82: 6387–6398. DOI 10.1002/ps.70721. Open access (PMC13240694). — [Europe PMC record/abstract](https://europepmc.org/article/MED/10.1002/ps.70721); [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)
  - Species and population: A. tuberculatus, Canadian (Quebec) biotype 714. **GWAS on 152 individuals** using GAPIT 3.4.0 with the BLINK, MLMM and FarmCPU models. Trait: mesotrione (HPPD, Group 27) resistance. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)
  - Reference: reads were mapped to **AmaTu_v01**, the IWGC A. tuberculatus reference from weedpedia.weedgenomics.org. Gene IDs take the form AmaTu_RefChr13g209310. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)
  - Positions (Table 1): the lead SNP is **Chr13:21,037,430** (P = 1.77E−26, BLINK, explains up to 88.56% of variance; LD block 20,980,775–21,037,511, genes AmaTu_RefChr13g209310/209320/209330/209380). Other SNPs:
    - Chr14:25,693,063 (BLINK and FarmCPU)
    - Chr12:4,941,960 and Chr13:11,306,035 (MLMM)
    - Chr00:4,555,459, Chr00:4,605,586, Chr06:69,381, Chr08:8,328,744, Chr08:12,751,902, Chr09:19,488,907 and Chr12:20,355,278 (FarmCPU)
    
    The paper also reports 187 DEGs (Table S2) and WGCNA modules. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)
  - Conference precursor: Laforest M. "Set Up of Genetic Marker Tests To Detect and Manage Herbicide Resistant Weeds," WSSA/CWSS 2025 annual meeting, abstract no. 281. It describes a GWAS on a Quebec waterhemp population resistant to Group 27 herbicides. — [WSSA 2025 abstracts PDF](https://wssa.net/wp-content/uploads/WSSA_2025-abstracts_6.20.25.pdf)

- **Raiyemo DA, Montgomery JS, Cutti L, et al., Tranel PJ. 2025.** *Plant Journal* 121: e70027. DOI 10.1111/tpj.70027. Open access (PMC11850965). This is a sex study, listed fully under Q2. It also places **EPSPS (native) on A. palmeri Hap1 chromosome 7**, near the single-copy UDP-glucuronate gene AmaPaChr07Ag122840. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/)

**Tier 2: population-genomic loci and selective sweeps (A. tuberculatus); positions in supplements/GitHub**

- **Kreiner JM, Giacomini DA, Bemm F, Waithaka B, Regalado J, Lanz C, Hildebrandt J, Sikkema PH, Tranel PJ, Weigel D, Stinchcombe JR, Wright SI. 2019.** "Multiple modes of convergent adaptation in the spread of glyphosate-resistant *Amaranthus tuberculatus*." *PNAS* 116: 21076–21084. DOI 10.1073/pnas.1900870116. Open access (PMC6800383).
  - The paper built the first A. tuberculatus reference: 663 Mb, contig N50 1.7 Mb, CoGe id 54057.
  - It resequenced 163 glyphosate-resistant and susceptible individuals from Canada and the US.
  - It found a hard selective sweep around **EPSPS on chromosome 5** linked to EPSPS copy-number increase, with an XP-EHH sweep signal in Walpole individuals.
  - Data: ENA PRJEB31711; code at github.com/jkreinz/Amaranthus-population-genomics. — [Europe PMC](https://europepmc.org/article/MED/31570613); [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC6800383/)
  - Note: Kreiner 2021 *Mol Ecol* (already included) is the GWA follow-up on the same samples.
- **Kreiner JM, Sandler G, Stern AJ, Tranel PJ, Weigel D, Stinchcombe JR, Wright SI. 2022.** "Repeated origins, widespread gene flow, and allelic interactions of target-site herbicide resistance mutations." *eLife* 11: e70242. DOI 10.7554/eLife.70242. Open access (PMC8798060).
  - 158 agricultural samples from 19 populations, mapped to the Kreiner 2019 reference (CoGe 54057).
  - Variation found at seven characterized TSR loci.
  - The ALS Ser-653-Asn resistant haplotype shows an XP-EHH sweep of nearly 10 Mb. The EPSPS-amplification sweep spans 6.5 Mb.
  - Code at github.com/jkreinz/TSRevolution. — [Europe PMC](https://europepmc.org/article/MED/10.7554/elife.70242); [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC8798060/)
- **Kreiner JM, Latorre SM, Burbano HA, Stinchcombe JR, Otto SP, Weigel D, Wright SI. 2022.** "Rapid weed adaptation and range expansion in response to agriculture over the past two centuries." *Science* 378: 1079–1085. DOI 10.1126/science.abo7293. Not open access; preprint DOI 10.1101/2022.02.25.482047.
  - Herbarium plus contemporary genomes. Reports allele-frequency shifts at agriculture-associated loci since the 1960s.
  - Whether a curatable locus table exists is unverified (supplement not opened). — [Europe PMC](https://europepmc.org/article/MED/10.1126/science.abo7293); [Crossref record](https://api.crossref.org/works/10.1126/science.abo7293)
- **Kreiner J., WSSA 2025 abstract no. 279**, "The Importance of Polygenic Contributions to Herbicide Resistance Across the Landscape in *Amaranthus tuberculatus*." It reports a GWA that recovers the target gene and, after controlling for two TSR mechanisms, about 250 additional NTSR genes across all 16 chromosomes. This appears to restate Kreiner 2021 *Mol Ecol* (already included), so it is likely not a new dataset. — [WSSA 2025 abstracts PDF](https://wssa.net/wp-content/uploads/WSSA_2025-abstracts_6.20.25.pdf)

**Conference abstracts matching already-included papers (for provenance only)**
- I. Schlegel Werle et al., WSSA 2025 abstract no. 180, "Genetic Overlap in *Amaranthus tuberculatus* Resistance to Dicamba and 2,4-D." F2 from CHR × WUS, 188 cloned F2 individuals. This corresponds to Werle 2025 PMS (included). — [WSSA 2025 abstracts PDF](https://wssa.net/wp-content/uploads/WSSA_2025-abstracts_6.20.25.pdf)
- C. Rigon, WSSA 2025 abstract no. 275. QTL on **chromosome 4, about 3 Mb upstream of CYP72A1182** (tembotrione, A. palmeri). This corresponds to Rigon 2025 JXB (included). — [WSSA 2025 abstracts PDF](https://wssa.net/wp-content/uploads/WSSA_2025-abstracts_6.20.25.pdf)
- Murphy BP and Tranel PJ, WSSA 2021 abstract (HPPD BSA, 5 putative QTL, 2 validated, H² = 0.556) and NCWSS 2020. QTLs on Scaffold 4 and Scaffold 12. These correspond to Murphy 2021 PMS (included). — [WSSA 2021 abstracts PDF](https://wssa.net/wp-content/uploads/WSSA-Virtual-Annual-Meeting-all-abstracts-updated-4-12-2021ab_FINAL.pdf); [NCWSS 2020 unofficial proceedings](https://ncwss.org/wp-content/uploads/NCWSS-2020-Unofficial-Proceedings.pdf)

**Not mapping, but recent and likely to come up (do not add as QTL)**
- Faleco FA, Werle IS, Lopez AJ, Raiyemo DA, Tranel PJ, et al. 2026. *PMS* 82: 5695–5706. DOI 10.1002/ps.70672. Open access. Wisconsin waterhemp with multiple resistance (2,4-D, atrazine, glyphosate, fomesafen, mesotrione). Mechanisms: EPSPS amplification, P106S, ΔG210, and P450/GST inhibitor assays. No mapping. — [Europe PMC](https://europepmc.org/article/MED/10.1002/ps.70672)
- Lopez AJ, Henry RS, Jacobs KE, Raiyemo DA, Werle IS, Tranel PJ. 2026. *PMS* 82: 6864–6876. DOI 10.1002/ps.70766. Open access. Studies AtuGSTF2 (atrazine metabolic resistance) gene structure and regulation, but no mapping statistic. — [Europe PMC](https://europepmc.org/article/MED/10.1002/ps.70766)
- Kerr DR, Concepcion JCT, Riechers DE, et al. 2023. "Inheritance of resistance to S-metolachlor in a waterhemp population from central Illinois." *Weed Science* 71: 549–556. DOI 10.1017/wsc.2023.63. This is an inheritance study not on the user's inheritance list: single dominant nuclear gene, with a possible recessive modifier. The full author list was not verified beyond the first three. — [Crossref](https://api.crossref.org/works/10.1017/wsc.2023.63); [Cambridge](https://www.cambridge.org/core/journals/weed-science/article/inheritance-of-resistance-to-smetolachlor-in-a-waterhemp-amaranthus-tuberculatus-population-from-central-illinois/4A0A4F199E3BFA876BF2501814784C2D)
- Aicklen I, Jugulam M, Gaines T, Kramer W, Laforest M, Robinson D, Sikkema P, Tardif F. 2025. "Determination of the Mechanisms of MCPA Resistance in *Amaranthus powellii*." *Plant Direct* 9: e70105. Open access.
  - Found an **ARF9 Leu→Phe SNP** from RNA-seq. This is a candidate target-site variant, not mapped.
  - It is the only A. powellii genetic-variant study found. — [Europe PMC](https://europepmc.org/article/MED/10.1002/pld3.70105)
- Zhang Z, Ban Y, Wei J, Wu Q, Dong L, Feng Z. 2025. "Rapid Resistance Detection of *Amaranthus retroflexus* to Fomesafen via KASP." *Plants* 14: 515. DOI 10.3390/plants14040515. A KASP marker for a PPO target-site mutation (Tier 3 marker resource for A. retroflexus). — [Europe PMC](https://europepmc.org/article/MED/10.3390/plants14040515)
- Liu C et al. 2026. *PMS* 82: 8019–8027. DOI 10.1002/ps.70865. Bentazone resistance in A. retroflexus via psbA overexpression plus ArCYP71A1. Transcriptomic, not mapping. — [Europe PMC](https://europepmc.org/article/MED/10.1002/ps.70865)
- Küpper A. 2018. PhD dissertation, Colorado State University (advisor T. Gaines). "Molecular genetics of herbicide resistance in Palmer amaranth: metabolic tembotrione resistance and geographic origin of glyphosate resistance." It contains RNA-seq on pseudo-F2 individuals (candidates CYP72A219, CYP81E8) but no QTL; it is the precursor to Rigon 2025. — [Mountain Scholar PDF](https://api.mountainscholar.org/server/api/core/bitstreams/f30f6469-0fe1-438c-a238-55cddaa7ba89/content)
- Strom SA et al. 2020. *PMS* 76: 3139–3148. DOI 10.1002/ps.5868. S-metolachlor metabolic resistance (P450). Not mapping. — [Crossref](https://api.crossref.org/works/10.1002/ps.5868)
- Noe et al. 2026 (bioRxiv/new preprint server). DOI 10.64898/2026.02.06.704380. Glufosinate-resistant waterhemp, confirmation plus transcriptomics. Not mapping; title seen only in Crossref, abstract not read. — [Crossref](https://api.crossref.org/works/10.64898/2026.02.06.704380)

### Inferences
- Laforest 2026 is the only new resistance GWAS I could verify with a full bp table. It uses the IWGC AmaTu_v01 coordinate system. That may differ from the assembly used by Werle 2025, Murphy 2021 (Montgomery 2020 draft scaffolds) and Kreiner (CoGe 54057), so lift-over will be needed before the loci are merged.
- The Kreiner eLife and PNAS papers are best curated as "selective sweep / TSR haplotype" loci, not QTL. Their coordinates are on the 2019 contig-level reference, so they will need conversion.

### Gaps
- No QTL/BSA/GWAS was found for glufosinate, PPO (fomesafen/lactofen), S-metolachlor/VLCFA, atrazine or paraquat in any weedy amaranth. Searches of Europe PMC, Crossref and the web returned only mechanism or inheritance papers.
- Only the 2021 and 2025 WSSA abstract books could be machine-searched. The 2022–2024 and 2026 WSSA books, NCWSS (except 2020), SWSS, NEWSS and PAG abstract books were not retrieved, so unpublished BSA/QTL abstracts from Kansas State, Arkansas, Mississippi State, Nebraska, Purdue and Guelph may exist that I could not see.
- K-REx (Kansas State), ScholarWorks@UARK and Nebraska DigitalCommons were not searched item by item. A web search for Jugulam-lab mapping populations returned only mechanism papers.
- The Kreiner 2022 *Science* supplementary locus tables were not inspected.

---

## Q2. Sex-determination mapping studies not already included

### Takeaway
Three sex-mapping studies are not on the included list. **Raiyemo et al. 2025 *Plant J*** is Tier 1: an A. palmeri sex GWA with bp positions, and a 2.84 Mb MSY on Chr3 of Hap1. **Raiyemo et al. 2023 *BMC Biol*** gives coverage-based male-specific candidate genes across dioecious species. **Raiyemo et al. 2026 preprint** has A. spinosus and dioecious relatives with chromosome-level assemblies and Rf1 homologs on Chr3. Theses by Sadeque (2019) and Raiyemo (2024) are precursors of included or listed papers.

### Cited Findings
- **Raiyemo DA, Montgomery JS, Cutti L, Abdollahi F, Llaca V, Fengler K, Lopez AJ, Morran S, Saski CA, Nelson DR, Patterson EL, Gaines TA, Tranel PJ. 2025.** "Chromosome-level assemblies of *Amaranthus palmeri*, *Amaranthus retroflexus*, and *Amaranthus hybridus* allow for genomic comparisons and identification of a sex-determining region." *Plant Journal* 121: e70027. DOI 10.1111/tpj.70027. Open access (PMC11850965). Preprint: bioRxiv 10.1101/2024.09.18.613719. — [Europe PMC](https://europepmc.org/article/MED/10.1111/tpj.70027); [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/)
  - Data: a RAD-seq dataset re-filtered to 52 females and 53 males from six accessions, mapped to the new haplotype-resolved A. palmeri Hap1. Sex GWA on 234,066 variants. **Tier 1 positions**:
    - **Chr3: 24,609,596 bp (P = 1.75e−20)**
    - **Chr3: 24,595,358 bp (P = 6.85e−17)**
    - **Chr4: 13,423,105 (P = 1.03e−8)**
    - **Chr16: 7,114,501 (P = 1.07e−17)**
    
    Bonferroni −log10 P = 6.67. FST between the sexes also peaks at the distal end of Chr3. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/)
  - MSY: about **2.84 Mb hemizygous region near the end of Chr3 (Hap1)**, containing 37 genes. Of that region, 65.35% (1,857,183 bp) is gaps. Candidate genes: RF1 (AmaPaChr03Ag063970) and TLC (AmaPaChr03Ag063980), plus a PPR gene AmaPaChr03gA063950. This supersedes the 1.3 Mb MSY of Montgomery 2021. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/)
  - Also provides chromosome-level A. retroflexus and A. hybridus assemblies. These are the first reference coordinates for those two species. The A. palmeri FST scan spans 17 chromosomes; chromosome counts for A. retroflexus and A. hybridus were not verified here. The paper notes that A. palmeri and A. retroflexus Chr7 correspond to Chr5 in A. hybridus and the grain amaranths. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/)
- **Raiyemo DA, Bobadilla LK, Tranel PJ. 2023.** "Genomic profiling of dioecious *Amaranthus* species provides novel insights into species relatedness and sex genes." *BMC Biology* 21: 37. DOI 10.1186/s12915-023-01539-9. Open access (PMC9940365). **Tier 2**.
  - Read-coverage analysis across 7 newly sequenced dioecious species found 11 candidate male-enriched gene models within the A. palmeri MSY.
  - It also found female-enriched regions on scaffold 19, and a PPR gene on MSY scaffold 20 that is male-specific in A. watsonii.
  - The A. tuberculatus MSY FT copy is male-enriched in close relatives. — [Europe PMC](https://europepmc.org/article/MED/10.1186/s12915-023-01539-9)
- **Raiyemo DA, Werle Noe I, Kaur R, Whitt L, Carey SB, Hale H, Lewis KJ, Womack L, Harkess A, Llaca V, Fengler K, Patterson EL, Gaines TA, Tranel PJ. 2026 (preprint).** "Chromosome-level genome assemblies and annotations of *Amaranthus spinosus*, *A. acanthochiton*, *A. arenicola*, and *A. floridanus*." DOI 10.64898/2026.08.21.746229. Not peer reviewed. **Tier 3 for sex**.
  - Multiple Rf1 homologs on Chr3 of monoecious A. spinosus.
  - The Chr1 inversions and Robertsonian fusion seen in A. tuberculatus (its SDR chromosome) are conserved in A. acanthochiton.
  - Also gives the first A. spinosus reference genome. — [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.64898%2F2026.08.21.746229%22)
- Bobadilla LK, Baek Y, Tranel PJ. 2023. "Comparative transcriptomic analysis of male and females in the dioecious weeds *Amaranthus palmeri* and *Amaranthus tuberculatus*." *BMC Plant Biol* 23. DOI 10.1186/s12870-023-04286-9. Open access. Expression only, not mapping; PPR247 is male-upregulated within the MSY. — [Europe PMC](https://europepmc.org/article/MED/10.1186/s12870-023-04286-9); [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10291800/)
- Theses (Illinois, Tranel lab):
  - **Sadeque A. 2019**, "Understanding gender determination in dioecious Amaranthus weeds…" (RAD-seq sex markers; precursor of Montgomery 2019). — [IDEALS](https://www.ideals.illinois.edu/items/113859)
  - **Raiyemo DA. 2024**, PhD, "Resolution of sex chromosomes in waterhemp and Palmer amaranth" (the Plant J and BMC Genomics papers). — [IDEALS](https://www.ideals.illinois.edu/items/132761)
  - **Kopecky Bobadilla L. 2023**, PhD, "The evolution of dioecy and herbicide resistance: a genomic and transcriptomic exploration of Amaranthus species". — [IDEALS](https://www.ideals.illinois.edu/items/128615)
- Murphy BP and Tranel PJ, WSSA 2021 abstract, "Identification of Candidate Sex Determining Genes in *Amaranthus tuberculatus* Through Genomic Approaches." Gene models unique to the MSY were identified by comparison with the female genome. No positions are given in the abstract. — [WSSA 2021 abstracts PDF](https://wssa.net/wp-content/uploads/WSSA-Virtual-Annual-Meeting-all-abstracts-updated-4-12-2021ab_FINAL.pdf)
- Preprint versions of included papers, to avoid double entry:
  - bioRxiv 10.1101/2024.05.30.596720 = Raiyemo 2025 BMC Genomics (31.8 Mb SDR on Chr1).
  - bioRxiv 10.1101/2024.09.17.613486 = Kreiner 2025 PLoS Biol.
  - bioRxiv 10.1101/2020.05.25.113597 = Neves 2020 J Hered.
  
  — [Europe PMC search results](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=Amaranthus%20sex-determining)
- Possible related item: bioRxiv 10.1101/769935, "Sex Lability and Dimorphism in Dioecious Palmer Amaranth" (2019). It is phenotypic; I did not confirm whether it contains any mapping. — [Europe PMC](https://europepmc.org/search?query=10.1101%2F769935)

### Inferences
- The Raiyemo 2025 Plant J GWA SNPs (4 SNPs) and the 2.84 Mb MSY interval are the most curatable new sex loci. Exact MSY start and end bp should be taken from Tables S10–S12 of that paper.
- Male-specific chromosome assignments now differ by species: A. palmeri Chr3 (Plant J 2025) versus A. tuberculatus Chr1 (BMC Genomics 2025, included). This supports curating them as separate SDR records.

### Gaps
- I did not find exact start and end coordinates of the Chr3 MSY in the main text. They are in the supplementary tables, which I did not open.
- No sex-mapping study was found for A. retroflexus, A. hybridus, A. powellii, A. blitoides, A. albus or A. viridis. All are monoecious, so none is expected.

---

## Q3. Linkage maps (with marker positions) for weedy amaranths

### Takeaway
I found no stand-alone linkage map publication for any weedy amaranth. The only genetic (cM) maps are embedded in QTL papers that are already included: Werle 2025 (F2 CHR × WUS, eight QTL on seven chromosomes), Rigon 2025, and possibly Murphy 2021. Chromosome-scale physical references now exist for A. tuberculatus, A. palmeri, A. retroflexus, A. hybridus and (as a preprint) A. spinosus, and these are what should anchor positions.

### Cited Findings
- Werle 2025 (included) built its map from an F2 mapping population of CHR × WUS with 188 cloned F2 individuals. A web summary of the paper reports "eight QTL regions mapped to seven A. tuberculatus chromosomes." — [WSSA 2025 abstracts PDF](https://wssa.net/wp-content/uploads/WSSA_2025-abstracts_6.20.25.pdf); [PubMed 39966088](https://pubmed.ncbi.nlm.nih.gov/39966088/)
- Europe PMC searches combining Amaranthus, waterhemp or Palmer amaranth with "linkage map" or "genetic map" returned no weedy-amaranth linkage-map paper. Linkage maps in the genus exist only for grain amaranth (A. hypochondriacus), which is outside this scope. — [Europe PMC query](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=Amaranthus%20%22linkage%20map%22)
- Reference assemblies available for coordinates:
  - **A. tuberculatus**: Kreiner 2019 (CoGe 54057); Montgomery 2020 GBE draft genomes (A. tuberculatus, A. hybridus, A. palmeri; DOI 10.1093/gbe/evaa177); IWGC AmaTu_v01 (used by Laforest 2026); Raiyemo 2025 BMC Genomics phased male assembly.
  - **A. palmeri, A. retroflexus, A. hybridus**: Raiyemo 2025 Plant J.
  - **A. spinosus**: Raiyemo 2026 preprint.
  
  — [PNAS PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6800383/); [Europe PMC GBE](https://europepmc.org/article/MED/10.1093/gbe/evaa177); [Laforest PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/); [Plant J PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/)

### Inferences
- For the database, "linkage map" entries for weedy amaranths will in practice be the F2/pseudo-F2 maps inside Werle 2025, Rigon 2025 and Murphy 2021. Their supplements should be checked for marker cM tables.

### Gaps
- I could not confirm whether Murphy 2021 or Rigon 2025 published a full marker-cM linkage map (as opposed to BSA intervals or physical QTL intervals) without opening their supplements.

---

## Q4. Physical locations of EPSPS amplicon / eccDNA, GS2 amplification and other resistance genes

### Takeaway
Native gene positions are now known on chromosome-level references:
- **A. palmeri EPSPS: Chr7** (Raiyemo 2025 Hap1).
- **A. palmeri GS2: Chr15:9,240,010–9,283,115**, with GS2.1 and GS2.2 in tandem (Carvalho-Moore 2025).
- **A. tuberculatus EPSPS: chromosome 5** of the Kreiner 2019 assembly.

The amplified copies themselves sit on eccDNA, which tethers randomly to chromosomes, so the amplified copies have no fixed chromosomal position.

### Cited Findings
- **Carvalho-Moore P, Borgato EA, Cutti L, Porri A, Meiners I, Lerchl J, Norsworthy JK, Patterson EL. 2025.** "A rearranged *Amaranthus palmeri* extrachromosomal circular DNA confers resistance to glyphosate and glufosinate." *Plant Cell* 37: koaf069. DOI 10.1093/plcell/koaf069. Open access (PMC11985328). Preprint: bioRxiv 10.1101/2024.10.08.617243. **Tier 1 physical positions**:
  - The eccDNA GS2 insert matches the **native GS2 locus on Chr15: 9,240,010–9,283,115 bp**, with both GS2 isoforms in tandem at that native location.
  - EPSPS on the eccDNA is syntenic to its **native location on Chromosome 7**, inserted with 5,572 bp upstream and 1,124 bp downstream.
  - Accession MSR2 (glufosinate- and glyphosate-resistant). The genome and annotation are the IWGC A. palmeri genome (Montgomery et al. 2024; Raiyemo et al. 2025).
  
  — [Europe PMC](https://europepmc.org/article/MED/10.1093/plcell/koaf069); [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC11985328/)
- **Noguera MM, Albert PS, Saski CA, Birchler JA, Porri A, Meiners I, Lerchl J, Roma-Burgos N. 2024 (bioRxiv).** "Extrachromosomal DNA-mediated glutamine synthetase 2 (GS2) amplification enables glufosinate resistance in *Amaranthus palmeri*." DOI 10.1101/2024.12.13.628355. Not peer reviewed (as of search).
  - FISH shows chromosomal insertions of GS2 plus eccDNA, distributed across multiple chromosomes.
  - Amplified copies show non-Mendelian inheritance. **Tier 3**.
  
  — [Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1101%2F2024.12.13.628355%22)
- Noguera MM, Porri A, Werle IS, et al. 2022. "Involvement of glutamine synthetase 2 (GS2) amplification and overexpression in *Amaranthus palmeri* resistance to glufosinate." *Planta*. DOI 10.1007/s00425-022-03968-2. Copy number only. — [Europe PMC](https://europepmc.org/article/MED/10.1007/s00425-022-03968-2)
- **Raiyemo et al. 2025 Plant J**: the genomic EPSPS copy is on **Chr7 of Hap1**, near AmaPaChr07Ag122840. The canonical 399 kb EPSPS eccDNA (Molin 2020) has little synteny with Hap1. A contiguous eccDNA was assembled. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/)
- **Molin WT, Yaguchi A, Blenner M, Saski CA. 2020.** "The EccDNA Replicon: A Heritable, Extranuclear Vehicle That Enables Gene Amplification and Glyphosate Resistance in *Amaranthus palmeri*." *Plant Cell*. DOI 10.1105/tpc.20.00099. 399 kb eccDNA assembly. — [Europe PMC](https://europepmc.org/article/MED/10.1105/tpc.20.00099)
- **Molin WT, Wright AA, Lawton-Rauh A, Saski CA. 2017.** *BMC Genomics* 18: 91. DOI 10.1186/s12864-016-3336-4. Open access. A 297 kb "EPSPS cassette" from BAC sequencing. — [Europe PMC](https://europepmc.org/article/MED/10.1186/s12864-016-3336-4)
- **Koo DH, Molin WT, Saski CA, Jiang J, Putta K, Jugulam M, Friebe B, Gill BS. 2018.** *PNAS* 115: 3332–3337. DOI 10.1073/pnas.1719354115. Open access. Amplified EPSPS is on eccDNAs tethered to mitotic and meiotic chromosomes. — [Europe PMC](https://europepmc.org/article/MED/10.1073/pnas.1719354115)
- **Koo DH, Sathishraj R, Nakka S, Ju Y, Nandula VK, Jugulam M, Friebe B, Gill BS. 2023.** *Plant Physiol* 193: 229–233. DOI 10.1093/plphys/kiad281. Open access. The EPSPS eccDNA replicon moves into A. tuberculatus × A. palmeri hybrids, and is present in **A. spinosus** through natural hybridization. FISH shows random chromosome anchoring. — [Europe PMC](https://europepmc.org/article/MED/10.1093/plphys/kiad281)
- **Dillon A, Varanasi VK, Danilova TV, Koo DH, Nakka S, Peterson DE, Tranel PJ, Friebe B, Gill BS, Jugulam M. 2017.** "Physical Mapping of Amplified Copies of the EPSPS Gene in Glyphosate-Resistant *Amaranthus tuberculatus*." *Plant Physiol* 173: 1226–1234. DOI 10.1104/pp.16.01427. Not open access. FISH physical mapping of amplified EPSPS (author list beyond the first eight taken from memory; verify). — [Europe PMC](https://europepmc.org/article/MED/10.1104/pp.16.01427)
- **Sathishraj R, Ju Y, Gill BS, Koo DH. 2025.** *Chromosome Research* 33: 9. DOI 10.1007/s10577-025-09768-0. A transient heteromorphic large chromosome in glyphosate-resistant A. tuberculatus. It lacks EPSPS and carries a 5S rDNA duplication. — [Europe PMC](https://europepmc.org/article/MED/10.1007/s10577-025-09768-0)
- **Han LH, Dungey KF, Yakimowski SB. 2026.** "Departures from Mendelian inheritance of EPSPS gene copies in a herbicide-resistant weed." *Proc R Soc B* 293: 20260685. DOI 10.1098/rspb.2026.0685. Preprint 10.1101/2025.05.12.653577. Inheritance of copy number, threshold at about 33 copies. — [Europe PMC](https://europepmc.org/article/MED/10.1098/rspb.2026.0685)
- Kreiner 2019 PNAS: **EPSPS on chromosome 5 of the A. tuberculatus reference**, with a 6.5 Mb sweep around the amplification (per eLife 2022). — [PMC6800383](https://pmc.ncbi.nlm.nih.gov/articles/PMC6800383/); [PMC8798060](https://pmc.ncbi.nlm.nih.gov/articles/PMC8798060/)
- Other eccDNA papers, with no positions:
  - Spier Camposano H, Molin WT, Saski CA 2022 *PLoS One*, DOI 10.1371/journal.pone.0260906.
  - Manicardi A et al. 2025 *PMS*, DOI 10.1002/ps.70034 (Spanish A. palmeri carry American eccDNA).
  - Gaines TA et al. 2013 *PLoS One*, DOI 10.1371/journal.pone.0065819.
  - Gaines TA et al. 2010 *PNAS*, DOI 10.1073/pnas.0906649107.
  
  — [Europe PMC search](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=Amaranthus%20eccDNA)

### Inferences
- For curation, place "EPSPS (native)" at A. palmeri Hap1 Chr7 and "GS2.1/GS2.2 (native)" at Chr15:9.24–9.28 Mb. Flag the resistance as eccDNA-borne copy-number variation, not an allelic variant at those positions.
- The A. tuberculatus EPSPS chromosome number (5) refers to the Kreiner 2019 reference. Chromosome naming differs between assemblies (A. palmeri 17 chromosomes, A. tuberculatus 16), so convert through synteny before comparing.

### Gaps
- I did not obtain the bp coordinate of the native EPSPS gene on A. palmeri Chr7 or on A. tuberculatus chromosome 5. They are probably in the annotation (AmaPaChr07Ag…) or the supplementary data.
- No chromosomal location was found for PPX2 (ΔG210), ALS, psbA (chloroplast) or HPPD on the new chromosome-level assemblies in the papers reviewed. These could be derived from the IWGC annotations rather than from the literature.
- No mapping studies were found for flowering (beyond Kreiner 2023, included), growth, seed dormancy or other life-history traits in any weedy amaranth. Lin et al. 2022 *Plant Genome* (DOI 10.1002/tpg2.20206) and Jamalluddin et al. 2022 *PLoS One* (DOI 10.1371/journal.pone.0267752) ran genus-wide GWAS on germplasm panels that may include weedy species such as A. viridis. Both are mapped to A. hypochondriacus and are dominated by grain or vegetable accessions, so their relevance to weedy amaranths is marginal. Cao et al. 2026 *J Ecol* (A. palmeri common garden, China) is phenotypic; I did not confirm whether it contains genomic association analyses. — [Europe PMC Lin 2022](https://europepmc.org/article/MED/10.1002/tpg2.20206); [Europe PMC Jamalluddin 2022](https://europepmc.org/article/MED/10.1371/journal.pone.0267752)
