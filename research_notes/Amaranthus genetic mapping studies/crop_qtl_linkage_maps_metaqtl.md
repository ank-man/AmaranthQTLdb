# QTL, BSA, fine-mapping, linkage maps and meta-QTL in crop and vegetable amaranths (searched 2026-10-14)

Scope note: these are additions to the AmaranthQTLdb list. Studies already included (Zaelani 2025; Lightfoot 2017; Stetter 2020; Winkler 2024; Ludwig 2026; Winkler 2026; Maughan 2011; Mallory 2008; Kulakow 1987; Peters 1987) are not repeated. The one exception is a possible error flagged under Gaps.

Searches run:
- Europe PMC REST API, full text and TITLE_ABS. Queries combined amaranth*/Amaranthus with: QTL; "linkage map"/"genetic map"/"linkage group"; "bulked segregant"/QTL-seq/MutMap/BSA-seq/BSA; "fine map*"/"map-based cloning"; "mapping population"/"recombinant inbred"/F2/MAGIC; "meta-QTL"/"meta-analysis of QTL"/"consensus map"; waxy/GBSSI/amylose; dwarf/male sterility/shattering/inheritance/allozyme. Also a preprint-only query (SRC:PPR).
- Crossref bibliographic API, 16 queries.
- Semantic Scholar API.
- Web searches in English, Chinese (苋菜 遗传图谱 QTL 定位; 苋菜 叶色 基因定位 BSA) and Spanish (amaranto mapeo genético QTL tesis).
- Repository checks: BYU ScholarsArchive, White Rose eTheses (York), KUPS (Cologne), and the Hohenheim/Stetter thesis queries.

## Which QTL / BSA / fine-mapping studies exist beyond those already included?

### Takeaway
I found only one new peer-reviewed mapping study with physical positions: Kondo et al. 2024 (Euphytica), which maps the seed-shattering locus *Acsh* in *A. cruentus* to about 15.2–16.0 Mb on "Chromosome 2B". There is also one thesis-level QTL result: the York MAGIC population, with leaf-yield loci on Chr 9 and Chr 10 but no positions published. Every other relevant item is a classical inheritance study (no markers) or a GWAS rather than a biparental QTL or BSA study. I found no amaranth MutMap, QTL-seq, fine-mapping or map-based cloning study outside the already-included papers.

### Cited Findings

**Rank 1: chromosome and bp position reported**
- **Kondo F, Mikoshiba T, Fujihara R, Matsushima K, Nemoto K (2024).** "Identification of inheritance manner and responsible locus (*Acsh*) related to seed-shattering in grain amaranthus (*Amaranthus cruentus*)." *Euphytica* 220(8): article 136. DOI 10.1007/s10681-024-03390-7. Metadata verified via Crossref — [Crossref](https://api.crossref.org/works/10.1007/s10681-024-03390-7); [Springer](https://link.springer.com/article/10.1007/s10681-024-03390-7)
  - Species: *A. cruentus*. Type: biparental F2 inheritance study plus locus mapping.
  - Cross: shattering cultivar 'New Aztec' × non-shattering accession DB9350. F2 segregation fit 3:1, so shattering is a dominant single-gene trait.
  - Locus *Acsh*: 15.2–16.0 Mbp on "Chromosome 2B". These details come from a search-engine summary of the Springer abstract; I could not open the Springer page because it blocked automated access — [Springer](https://link.springer.com/article/10.1007/s10681-024-03390-7)
  - Not yet checked: F2 size, marker platform, and which reference genome uses the name "2B".
  - Access: Springer licence is TDM only, so the paper is likely not open access — [Crossref](https://api.crossref.org/works/10.1007/s10681-024-03390-7)
  - Zaelani et al. 2025 cite it as a locus-identification study in *A. cruentus* — [Zaelani 2025 PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13129576/)
  - The 2025 TAG review by Stetter, Joshi and Singh says the gene could speed up breeding of non-shattering cultivars — [TAG review](https://link.springer.com/article/10.1007/s00122-025-04940-w)

**Rank 2: chromosome only, no published positions (thesis)**
- **de Kinderen MAJ (2025).** "Exploiting an Amaranth MAGIC population and diversity set for improvement of leafy vegetable traits." PhD thesis, University of York; supervisors K. Denby and D. Jeffares. Open access (CC BY-NC-ND 4.0) — [White Rose eTheses](https://etheses.whiterose.ac.uk/id/eprint/38163/)
  - Population: an inter-specific MAGIC population from 8 founders (4 *A. cruentus*, 4 *A. hypochondriacus*), built by the World Vegetable Center.
  - Leaf yield associated with two loci, on Chr 9 and Chr 10. 51 offspring lines were selected.
  - The thesis also includes a metabolite GWAS on a 90-accession diversity set, with 81 metabolite–genome associations.
  - The record page gives no physical positions. The reference used is a graph pangenome built from the founders plus reference genomes — [White Rose eTheses](https://etheses.whiterose.ac.uk/id/eprint/38163/)
- **de Kinderen MAJ et al. (2026).** "An inter-specific *Amaranthus* pangenome captures genetic variation potentially underlying key leafy vegetable traits in this underutilised crop." *New Phytologist* 250(6): 3540–3558. DOI 10.1111/nph.71183 — [Crossref](https://api.crossref.org/works/10.1111/nph.71183)
  - It describes the MAGIC founder genomes and the pangenome.
  - The abstract reports no QTL; it says the pangenome will "facilitate usage of SVs in trait mapping". The MAGIC QTL appear to be unpublished in a journal so far.

**Rank 3: Mendelian inheritance only (no markers or positions)** — useful as trait/locus metadata, not as mapped QTL
- **Gudu S, Gupta VK (1988).** "Male-sterility in the grain amaranth (*Amaranthus hypochondriacus* ex-Nepal) variety Jumla." *Euphytica* 37(1): 23–26. DOI 10.1007/bf00037218 — [Crossref](https://api.crossref.org/works/10.1007/bf00037218)
- **Gupta VK, Gudu S (1990).** "Inheritance of some morphological traits in grain amaranthus." *Euphytica* 46(1): 79–84. DOI 10.1007/bf00057621. Cited for simple inheritance of colour traits — [Crossref](https://api.crossref.org/works/10.1007/bf00057621); [Zaelani 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC13129576/)
- **Mishra MC, Chatterjee S, Sagar P, Singh AK, Tiwari JK (2026).** "Inheritance Study for Different Qualitative Traits in Grain Amaranth." Research Square preprint, DOI 10.21203/rs.3.rs-10363540/v1, CC BY 4.0. Earlier 2023 version: "Analysing the Segreggation Ratio of Grain Amaranth Cross (Suvarna X Ga2)," DOI 10.21203/rs.3.rs-3143009/v1 — [Crossref](https://api.crossref.org/works/10.21203/rs.3.rs-10363540/v1)
  - Cross: Suvarna × GA2 F2, IGKV Ambikapur (India).
  - 9 traits: leaf colour, stem colour, red leaf margin, panicle colour, inflorescence shape and compactness, growth habit, spininess, flowering time. No markers.
- **Genetics of grain amaranths 4 (1987).** "Variation and early generation response to selection in *A. cruentus*." *Theor Appl Genet*. DOI 10.1007/bf00290093. Quantitative genetics, no mapping — [Europe PMC](https://europepmc.org/article/MED/24241466)
- **"Genetic studies of yield contributing traits in *Amaranthus*" (1984).** *Theor Appl Genet*. DOI 10.1007/bf00252326. Quantitative genetics, no mapping — [Europe PMC search result](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1007/bf00252326)

**Rank 3b: Waxy/GBSSI papers (gene-based, no mapping populations)**
These are useful for a "cloned/validated gene" layer, not as QTL.
- **Park YJ, Nemoto K, Nishikawa T, Matsushima K (2009/2010).** "Waxy strains of three amaranth grains raised by different mutations in the coding region." *Mol Breed*. DOI 10.1007/s11032-009-9360-1 — [Crossref search](https://api.crossref.org/works/10.1007/s11032-009-9360-1)
- **Park et al. (2010/2012).** "Origin and evolution of the waxy phenotype in *A. hypochondriacus*: evidence from the genetic diversity in the Waxy locus." *Mol Breed*. DOI 10.1007/s11032-010-9533-y — [Crossref](https://api.crossref.org/works/10.1007/s11032-010-9533-y)
- **Park et al. (2011/2012).** "The molecular basis of mutations at the Waxy locus from *Amaranthus caudatus* L." *Mol Breed*. DOI 10.1007/s11032-011-9640-4 — [Crossref](https://api.crossref.org/works/10.1007/s11032-011-9640-4)
- **Park et al. (2017).** "Characterization of a new granule-bound starch synthase gene found in amaranth grains (*A. cruentus*)." *Mol Breed*. DOI 10.1007/s11032-017-0712-y — [Crossref](https://api.crossref.org/works/10.1007/s11032-017-0712-y)
- **Park YJ, Nishikawa T (2012).** "Rapid identification of *A. caudatus* and *A. hypochondriacus* by sequencing and PCR–RFLP analysis of two starch synthase genes." *Genome*. DOI 10.1139/g2012-050 — [Crossref](https://api.crossref.org/works/10.1139/g2012-050)
- **"Genetic diversity and expression analysis of granule bound starch synthase I gene in the new world grain amaranth (*A. cruentus*)" (2011).** *J Cereal Sci*. DOI 10.1016/j.jcs.2011.01.011 — [Europe PMC/AGRICOLA record](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1016/j.jcs.2011.01.011)

**Out of scope but found: GWAS / MTA studies**
These are association studies, not QTL/BSA/fine-mapping. They are listed so other compilers can de-duplicate.
- Lin et al. 2022. *Plant Genome*. DOI 10.1002/tpg2.20206. Interspecific GWAS for days to flowering; 7 regions — [Zaelani 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC13129576/)
- Jamalluddin et al. 2022. *PLoS One*. DOI 10.1371/journal.pone.0267752. MTAs — [Europe PMC](https://europepmc.org/article/MED/35552555)
  - The PMID was not verified; the DOI comes from the Europe PMC result list.
- 2026 *BMC Genomics*. DOI 10.1186/s12864-026-12595-0. Ca/Fe/Mg/Zn in *A. hypochondriacus*, multi-environment GWAS. From the Europe PMC result list.
- 2026 *Front Nutr*. DOI 10.3389/fnut.2026.1758193. Seed protein composition, multi-environment GWAS — [Frontiers](https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2026.1758193/full)
- 2026 bioRxiv. DOI 10.64898/2026.10.05.756862. *A. tricolor*: GWAS plus transcriptome for betalain pigmentation under heat. From the Europe PMC result list.
- 2025 bioRxiv. DOI 10.1101/2025.03.05.641739. *A. tricolor*: 'Bayam' reference plus 95-line core GWAS of betalain — [bioRxiv](https://www.biorxiv.org/content/10.1101/2025.03.05.641739.full.pdf)

### Inferences
- Biparental QTL/BSA mapping in amaranth is still very sparse. Apart from the already-included set, Kondo 2024 is the only locus-mapping paper I could find, and it gives a Mb interval. The Kondo et al. group (Shinshu University, Nemoto/Matsushima) and the Zaelani/Yoshioka group (Tsukuba) are the Japanese groups doing this work.
- "Chromosome 2B" suggests Kondo used an assembly with sub-chromosome naming. The *A. cruentus* genome of Ma et al. 2021 has 17 chromosomes because chromosome 2 split in two. That would fit "2B", but this is my inference; check it before converting coordinates — [Ma 2021 summary via repository](https://eprints.whiterose.ac.uk/id/eprint/173360/)
- The York MAGIC leaf-yield loci (Chr 9 and Chr 10) are probably the first vegetable-amaranth QTL. Positions would have to come from the thesis PDF, or from a later paper.

### Gaps
- **Kondo 2024:** F2 size, marker method, reference genome version and flanking markers are unverified because the full text was inaccessible. The "15.2–16.0 Mbp, Chr 2B" figure comes from a search-engine summary of the abstract, not from a page I read directly.
- **MAGIC thesis:** I did not read the full PDF, so the exact leaf-yield QTL intervals are unknown.
- **No QTL, BSA or mapping study found for:**
  - *A. tricolor* (other than GWAS)
  - *A. blitum/lividus*, *A. viridis*, *A. dubius* or *A. quitensis*
  - dwarfism, squalene, lysine, oil, disease or insect resistance
- **Chinese literature:** Chinese web searches returned no 苋菜 genetic-map or gene-mapping papers. CNKI itself was not searchable from this environment, so this is weak negative evidence.
- **Mexican, Peruvian and African theses:** a Spanish-language search found only ISSR/RAPD diversity work and no QTL theses. University repositories (Chapingo, UNAM, CINVESTAV, UNALM) were not searched directly.
- **Possible error in the existing entry for Mallory 2008:** Zaelani 2025 describes Mallory et al. 2008 as the first linkage map, built from an *A. cruentus* F2 population — [Zaelani 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC13129576/). My unverified recollection is that Mallory 2008 used an interspecific *A. hypochondriacus*-based F2. Check the population in the original paper before entering species metadata.

## Which genetic linkage maps exist and do they publish marker positions?

### Takeaway
Beyond Mallory 2008, Maughan 2011, Zaelani 2025 and Ludwig 2026, which are already included, I found two related linkage-map documents. Both are BYU write-ups that duplicate the Maughan 2011 SNP map, not new maps. I found no RAPD, AFLP, isozyme, SLAF or other GBS linkage maps for grain or vegetable amaranths. The *A. hypochondriacus* "physical map" of Clouse 2016 is a BioNano optical map, not a linkage map.

### Cited Findings
- **Smith SM (2013).** "Application of Genome Reduction, Next Generation Sequencing, and KASPar Genotyping in Development, Characterization, and Linkage Mapping of Single Nucleotide Polymorphisms in the Grain Amaranths and Quinoa." MS thesis, BYU (ETD 3548). PDF available — [BYU ScholarsArchive](https://scholarsarchive.byu.edu/etd/3548)
  - Amaranth linkage map: 16 linkage groups, 1,288 cM, about 3.1 cM per marker, using KASPar SNPs on Fluidigm.
  - It describes the same map as Maughan et al. 2011, which is already included — [BYU ScholarsArchive](https://scholarsarchive.byu.edu/etd/3548)
  - The thesis PDF may hold full marker tables (cM positions). Not checked.
- **Smith S, Maughan J (2014).** BYU *Journal of Undergraduate Research* report on SNP development and linkage mapping in grain amaranths — [BYU JUR](https://scholarsarchive.byu.edu/jur/vol2014/iss1/935). Not opened; a short report.
- **Clouse JW et al. (2016).** "The Amaranth Genome: Genome, Transcriptome, and Physical Map Assembly." *Plant Genome*. DOI 10.3835/plantgenome2015.07.0062. A BioNano physical map, not a genetic map — [Europe PMC](https://europepmc.org/article/MED/27898770)
- **Zaelani 2025 (already included), for the record:**
  - Three ddRAD-seq SNP maps: 3,692 / 3,478 / 4,234 markers; 5,640 / 5,970 / 6,960 cM; 16 linkage groups.
  - Physical anchoring to *A. hypochondriacus* v2.2.
  - Marker list in Supplementary Table 3; QTL in main-text Table 2 and Supplementary Table 4 — [Zaelani 2025 PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13129576/)
- **Reference genomes useful for converting map positions:**
  - Graf C, Winkler TS, Maughan PJ, Stetter MG (2025). "Domestication shaped the chromatin landscape of grain amaranth." *Nat Commun* 16: 10407. DOI 10.1038/s41467-025-66445-w. New high-quality assembly; CC BY — [Crossref](https://api.crossref.org/works/10.1038/s41467-025-66445-w)
  - Fang X, Liu Y, Zhang M, Jiao C, Chen Y (2026). "A chromosome-level genome assembly of the Ornamental Amaranth (*Amaranthus caudatus*)." *Sci Data*. DOI 10.1038/s41597-026-08383-w. CC BY-NC-ND — [Crossref](https://api.crossref.org/works/10.1038/s41597-026-08383-w)
  - Ma X et al. (2021). *A. cruentus* chromosome-level genome. *Plant J* 107(2): 613–628. DOI 10.1111/tpj.15298. About 370.9 Mb; n = 17 because chromosome 2 split. No linkage map reported in the summaries — [White Rose](https://eprints.whiterose.ac.uk/id/eprint/173360/)
  - *A. tricolor* chromosome-scale genome. *DNA Res* (2023). DOI 10.1093/dnares/dsac050. No linkage map — [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9847342/)
- **Population-development resource (no map):** "Crossing Methods and Cultivation Conditions for Rapid Production of Segregating Populations in Three Grain Amaranth Species" (Stetter et al., Hohenheim). *Front Plant Sci* 2016. DOI 10.3389/fpls.2016.00816. PeerJ preprint 10.7287/peerj.preprints.1951v1 — [Europe PMC result](https://europepmc.org/article/MED/27379117)
  - The PMID is unverified; the DOI comes from the Europe PMC result list.

### Inferences
- Linkage maps with downloadable marker positions are, in practice, Maughan 2011, Zaelani 2025 and Ludwig 2026 (all already included). The Smith 2013 thesis is a possible second source of the Maughan 2011 marker table.
- A consensus map could be built, because Maughan 2011, Zaelani 2025 and the pangenome QTL can all be anchored to the *A. hypochondriacus* assemblies (v2.2, Graf 2025). None has been published.

### Gaps
- Whether Mallory 2008 published SSR cM positions in a supplement was not re-checked (it is already included).
- I found no linkage map for *A. tricolor* or any vegetable amaranth, and no map from Chinese, Indian or African programmes.

## Theses and dissertations

### Takeaway
I found no thesis containing a new amaranth linkage map or QTL study at Hohenheim, Cologne or Washington State, or in Mexican or Peruvian repositories. Two theses carry mapping content: BYU Smith 2013 (SNP linkage map) and York de Kinderen 2025 (MAGIC leaf-yield loci).

### Cited Findings
- **BYU:** Smith 2013 MS (above) — [BYU](https://scholarsarchive.byu.edu/etd/3548). The BYU former-students page lists other amaranth theses advised by Maughan and Jellen, e.g. Clouse 2015 MS on the *A. hypochondriacus* genome, which is genome assembly, not mapping — [BYU PWS](https://pws.byu.edu/former-graduate-students)
- **Cologne:** Gonçalves-Dias JM (2024). "Uncovering and Popularizing the Genomic Mosaic of Grain Amaranth Domestication." PhD, Universität zu Köln; examiner Stetter. Population genomics, not QTL — [KUPS PDF](https://kups.ub.uni-koeln.de/73263/1/GoncalvesDias_PhD_dissertation.pdf)
- **York:** de Kinderen 2025 PhD (MAGIC; above) — [White Rose](https://etheses.whiterose.ac.uk/id/eprint/38163/)
- **BOKU Vienna:** Sandell FL (2025). "Comparative genomics in crops of the Amaranthaceae plant family." Comparative genomics, not mapping — [BOKU](https://forschung.boku.ac.at/en/publications/191288)
- **Hohenheim:** I found no Stetter dissertation record. Stetter, Müller and Schmid 2017 (*Mol Ecol*, incomplete domestication of *A. caudatus*, GBS of 119 accessions) is population genomics, not mapping — [bioRxiv](https://www.biorxiv.org/content/10.1101/025866v1)

### Inferences
- Theses at Hohenheim and Cologne are population-genomic rather than linkage/QTL work. The Stetter lab's mapping output is the already-included Stetter 2020, Winkler 2024 and 2026, and Ludwig 2026.

### Gaps
- I did not browse hohPublica, the WSU Research Exchange, Shodhganga (India), Chapingo/UNAM/CINVESTAV (Mexico), UNALM (Peru) or African repositories directly. Web searches against them returned nothing relevant, so absence is likely but not proven.
- The University of Tsukuba (Zaelani) and Shinshu University (Kondo/Nemoto) may hold related Japanese-language theses or conference abstracts (日本育種学会). These were not searched.

## Has any Amaranthus meta-QTL / QTL meta-analysis / consensus linkage map been published?

### Takeaway
No. Several independent searches found no meta-QTL analysis, QTL meta-analysis or consensus/integrated linkage map for any *Amaranthus* species, crop or weed.

### Cited Findings
- **Europe PMC full text,** amaranth* AND ("meta-QTL" OR "meta-analysis of QTL" OR "consensus map"): 14 hits. All were off-topic (wheat, sorghum, foxtail millet, oat, maize, etc.) and mention amaranth only incidentally — [Europe PMC REST](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=amaranth*%20AND%20(%22meta-QTL%22%20OR%20%22meta-analysis%20of%20QTL%22%20OR%20%22consensus%20map%22)&format=json)
- **Europe PMC title/abstract,** Amaranthus/amaranth AND (QTL OR linkage/genetic map OR BSA OR fine map OR mapping population OR RIL OR F2 OR meta-QTL OR consensus map): 20 hits. The only amaranth mapping papers were Zaelani 2025, Lin 2022 (GWAS) and Ludwig 2026; none was a meta-analysis — [Europe PMC REST](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=(TITLE_ABS:amaranth*%20OR%20TITLE_ABS:Amaranthus)%20AND%20TITLE_ABS:QTL&format=json)
- **Crossref,** "amaranth meta-QTL": hits were generic meta-QTL methods papers, soybean/wheat/maize meta-QTL, and Zaelani 2025. No amaranth meta-QTL — [Crossref](https://api.crossref.org/works?query.bibliographic=amaranth%20meta-QTL)
- **Web search,** "meta-QTL" Amaranthus OR amaranth OR Amaranthaceae (extended mode): only single-population amaranth QTL/GWAS papers and a common-bean meta-QTL paper.
- **Recent literature still treats amaranth mapping as early-stage:**
  - Zaelani 2025 says genetic studies are "limited" and not as advanced as in major crops — [Zaelani 2025 PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13129576/)
  - The 2025 TAG review discusses diversity mining, not QTL integration — [TAG review](https://link.springer.com/article/10.1007/s00122-025-04940-w)

### Inferences
- With only about four or five biparental QTL datasets in total, a formal meta-QTL analysis (BioMercator-style) would be thin. A physical "meta-QTL / QTL-cluster" compilation anchored to *A. hypochondriacus* v2.2 or v3 would therefore be novel. The datasets are Zaelani 2025 F2 ×3 trials, Ludwig 2026, Kondo 2024 (*A. cruentus* coordinates would need lift-over), Stetter 2020, Winkler 2024 and 2026, and Lightfoot 2017.
- Kondo's *A. cruentus* coordinates (Chr 2B) need a cross-species lift-over or synteny step to *A. hypochondriacus* before they can be integrated.

### Gaps
- Google Scholar, CNKI, J-STAGE full text and Scopus were not queried directly. Grey literature (conference posters, Japanese-language reports) could exist, but I found no indexed evidence of it.
