# Seven positioned studies await AmaranthQTLdb curation

Searches of Europe PMC, Crossref, bioRxiv, NCBI, Dryad, Zenodo, Figshare, WSSA abstract books and thesis repositories, run on 14 October 2026, found **seven peer-reviewed studies with positioned loci that AmaranthQTLdb has not yet curated**. The most valuable is **Laforest et al. 2026**, a mesotrione-resistance GWAS in *A. tuberculatus* with 11 SNPs given as base-pair positions. It is followed by **Raiyemo et al. 2025 (*Plant J*)**, an *A. palmeri* sex GWA with four positioned SNPs and a 2.84 Mb male-specific region on Chr3. **Kondo et al. 2024** maps the seed-shattering locus *Acsh* in *A. cruentus* to about 15.2–16.0 Mb on "Chr 2B". **Carvalho-Moore et al. 2025** places the native GS2 genes at *A. palmeri* Chr15:9.24–9.28 Mb. The other three are the Kreiner 2019 and 2022 glyphosate and target-site selective-sweep papers and the **Tranel et al. 2017** ALS–PPX2 linkage (7.5 cM). Below these come a second tier: an *A. palmeri* phenology GWAS (Cao 2026), a York PhD thesis with the first vegetable-amaranth MAGIC loci, a set of 2023–2026 sex-genomics papers, and at least 14 validated PCR assays not yet in the marker table. **No *Amaranthus* meta-QTL analysis, QTL meta-analysis or consensus linkage map has ever been published.** Every search for one returned only crops from other genera, so the physical meta-QTL layer AmaranthQTLdb is already building would be the first for the genus. The researchers also found several corrections: a misattributed DOI in the marker brief, a GWAS label on a paper that has no GWAS, unresolved species metadata for Mallory 2008, and two papers that were downloaded into the pipeline but never curated.

## Herbicide-resistance and sex studies dominate the positioned backlog

The field remains small, and new trait-locus data now come mostly from weed science. **Laforest et al. 2026** is the only new study with a complete position table ready to load. The authors genotyped 152 plants of the Québec waterhemp population 714 (85 resistant, 67 susceptible) by triple-digest GBS, kept 373,458 SNPs after filtering, and mapped them to the IWGC **AmaTu_v01** reference using the GAPIT BLINK, MLMM and FarmCPU models. **Main-text Table 1 lists 11 SNPs**. The lead SNP is **Chr13:21,037,430 (P = 1.77E−26)**; others sit on Chr00, 06, 08, 09, 12, 13 and 14. The paper is open access under CC BY ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/)). Its precursor is WSSA 2025 abstract 281 ([WSSA 2025](https://wssa.net/wp-content/uploads/WSSA_2025-abstracts_6.20.25.pdf)).

**Raiyemo et al. 2025, *Plant J*** (DOI 10.1111/tpj.70027) is a different paper from the Raiyemo 2025 *BMC Genomics* study already in the database. It ran a sex GWA on 234,066 variants from 52 female and 53 male *A. palmeri* against a new haplotype-resolved Hap1 assembly. The top hits were **Chr3:24,609,596 (P = 1.75e−20), Chr3:24,595,358, Chr4:13,423,105 and Chr16:7,114,501**. The paper defines a **2.84 Mb hemizygous male-specific region at the distal end of Chr3** containing 37 genes, with RF1 and TLC as candidates. This replaces the roughly 1.3 Mb region from Montgomery 2021. The exact start and end coordinates of the region are in Tables S10–S12, which have not been opened. The same paper places native EPSPS on *A. palmeri* Hap1 Chr7 and provides the first chromosome-level *A. retroflexus* and *A. hybridus* assemblies ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/)). Male-specific regions now sit on **different chromosomes in different species**: Chr3 in *A. palmeri* and Chr1 in *A. tuberculatus*. They should therefore be curated as separate sex-determining-region records.

**Carvalho-Moore et al. 2025** show that a rearranged eccDNA carrying GS2 matches the native **GS2.1/GS2.2 tandem locus at Chr15:9,240,010–9,283,115** in *A. palmeri*, and that the EPSPS on the eccDNA is syntenic to its native site on Chr7 ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11985328/)). These are gene positions, not allelic QTL. Resistance comes from copy number carried on eccDNA, which tethers to chromosomes at random, so the amplified copies have no fixed position ([Koo 2018](https://europepmc.org/article/MED/10.1073/pnas.1719354115)). Curators should flag these records as copy-number variation, not as allelic variants.

The **Kreiner papers** give selective-sweep loci rather than QTL. **Kreiner 2019 (*PNAS*)** built the first *A. tuberculatus* reference (CoGe 54057) and resequenced 163 resistant and susceptible plants. It found a hard sweep around **EPSPS on chromosome 5** ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6800383/)). **Kreiner 2022 (*eLife*)** found variation at seven target-site resistance loci in 158 agricultural samples. The resistant **ALS Ser653Asn haplotype has a sweep of nearly 10 Mb**, and the EPSPS sweep spans **6.5 Mb** ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8798060/)). **Kreiner 2022 (*Science*)** reports **403 SNPs under environment-associated selection**, and the PPO210 deletion has the highest agricultural-versus-natural FST in the genome (about 0.21). These are habitat associations, not trait GWAS ([bioRxiv](https://www.biorxiv.org/content/10.1101/2022.02.25.482047.full.pdf)).

**Tranel et al. 2017** linked ALS and PPX2 target-site resistances at **7.5 cM, about 195 kb apart**. This is a rare genetic-distance measurement in a weedy amaranth, but the marker types have been seen only in the abstract ([Crossref](https://api.crossref.org/works/10.1614/ws-d-16-00090.1)).

No QTL, BSA or GWAS was found for glufosinate, PPO, S-metolachlor, atrazine or paraquat resistance in any species. Nor was any found for *A. retroflexus*, *A. hybridus*, *A. powellii*, *A. spinosus*, *A. blitoides*, *A. albus* or *A. viridis*.

## Crop amaranth adds one Mb-scale locus and an unpublished MAGIC population

On the crop side, the only new locus-mapping paper is **Kondo et al. 2024 (*Euphytica* 220:136)**. In an *A. cruentus* F2 from 'New Aztec' × DB9350, seed shattering segregated 3:1, showing a single dominant gene. The locus **_Acsh_ maps to 15.2–16.0 Mb on "Chromosome 2B"** ([Springer](https://link.springer.com/article/10.1007/s10681-024-03390-7); [Crossref](https://api.crossref.org/works/10.1007/s10681-024-03390-7)). This interval has not been verified against the paper itself: it comes from a search-engine summary of a paywalled abstract. The F2 size, marker platform and assembly are also unknown. The "2B" naming fits the 17-chromosome *A. cruentus* assembly of Ma et al. 2021, in which chromosome 2 is split, but this is inference ([White Rose](https://eprints.whiterose.ac.uk/id/eprint/173360/)). Integrating the locus will need a synteny-based lift-over to *A. hypochondriacus*.

**de Kinderen 2025**, a University of York PhD thesis (open access, CC BY-NC-ND), describes an 8-founder MAGIC population (4 *A. cruentus*, 4 *A. hypochondriacus*). It reports **leaf-yield loci on Chr9 and Chr10**, plus **81 metabolite–genome associations** from a 90-accession diversity set ([White Rose eTheses](https://etheses.whiterose.ac.uk/id/eprint/38163/)). These are probably the first vegetable-amaranth QTL. No positions appear on the record page; they have to come from the thesis PDF. The companion *New Phytologist* 2026 pangenome paper reports no QTL ([Crossref](https://api.crossref.org/works/10.1111/nph.71183)).

Beyond these, the crop literature holds only classical inheritance work and gene-level waxy studies. The inheritance papers include Gudu and Gupta 1988 on male sterility, Gupta and Gudu 1990 on morphology, and the 2026 Mishra preprint on nine qualitative traits in Suvarna × GA2 ([Crossref](https://api.crossref.org/works/10.21203/rs.3.rs-10363540/v1)). The waxy studies are the Park et al. GBSSI papers of 2009–2017 ([Crossref](https://api.crossref.org/works/10.1007/s11032-017-0712-y)). Both groups belong in the inheritance and cloned-gene layers, not the QTL table.

No QTL or BSA study was found for *A. tricolor* (beyond GWAS), *A. blitum*, *A. viridis* or *A. dubius*, or for squalene, lysine, oil, disease or insect resistance.

## Ranked inventory of uncurated studies

Tier 1 entries report chromosome plus bp or cM positions. Tier 2 entries name a chromosome or region without a table. Tier 3 entries are physical placements, marker resources or inheritance only. "Unverified" marks details the researchers could not confirm in the primary text.

| Rank | Citation | DOI / URL | Species | Type | Population | Traits | Where positions are | Reference | Open access | Flags |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Laforest M et al. 2026, *Pest Manag Sci* 82:6387 | [10.1002/ps.70721](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240694/) | *A. tuberculatus* | GWAS (BLINK/MLMM/FarmCPU) | 152 plants, Québec pop. 714 | Mesotrione (HPPD) resistance | Main Table 1, 11 SNPs bp; GO in Table S1 | AmaTu_v01 (IWGC) | Yes, CC BY | Raw data on request only |
| 2 | Raiyemo DA et al. 2025, *Plant J* 121:e70027 | [10.1111/tpj.70027](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850965/) | *A. palmeri* (+ *A. retroflexus*, *A. hybridus* genomes) | Sex GWA + FST; MSY definition | 52 F / 53 M, 6 accessions | Sex | 4 SNPs bp in text; MSY bounds Tables S10–S12 | *A. palmeri* Hap1 (CoGe 68302) | Yes | MSY start/end not yet extracted |
| 3 | Kondo F et al. 2024, *Euphytica* 220:136 | [10.1007/s10681-024-03390-7](https://link.springer.com/article/10.1007/s10681-024-03390-7) | *A. cruentus* | F2 inheritance + locus mapping | New Aztec × DB9350 F2 | Seed shattering (*Acsh*) | Abstract: Chr 2B, 15.2–16.0 Mb | Unverified (likely Ma 2021) | No (TDM licence) | Interval from search summary; F2 size and markers unknown |
| 4 | Carvalho-Moore P et al. 2025, *Plant Cell* 37:koaf069 | [10.1093/plcell/koaf069](https://pmc.ncbi.nlm.nih.gov/articles/PMC11985328/) | *A. palmeri* | Physical locus of resistance genes | Accessions MSR1/MSR2 | Glufosinate + glyphosate resistance (eccDNA) | Text: GS2 Chr15:9,240,010–9,283,115; EPSPS Chr7 | IWGC *A. palmeri* | Yes | Copy number, not allelic |
| 5 | Kreiner JM et al. 2022, *eLife* 11:e70242 | [10.7554/eLife.70242](https://pmc.ncbi.nlm.nih.gov/articles/PMC8798060/) | *A. tuberculatus* | Target-site sweep / haplotype analysis | 158 plants, 19 populations | ALS, EPSPS, PPO target-site resistance | Figures; code at GitHub TSRevolution | Kreiner 2019 (CoGe 54057) | Yes | Exact sweep bp needs extraction |
| 6 | Kreiner JM et al. 2019, *PNAS* 116:21076 | [10.1073/pnas.1900870116](https://pmc.ncbi.nlm.nih.gov/articles/PMC6800383/) | *A. tuberculatus* | Selective-sweep scan + reference genome | 163 resequenced plants | Glyphosate resistance | EPSPS chr5 sweep; SI PDF (already downloaded locally) | Kreiner 2019 | Yes | Data ENA PRJEB31711 (link inferred) |
| 7 | Tranel PJ, Wu C, Sadeque A 2017, *Weed Sci* | [10.1614/ws-d-16-00090.1](https://api.crossref.org/works/10.1614/ws-d-16-00090.1) | *A. tuberculatus* | Two-locus linkage | Not verified | ALS + PPO resistance | Abstract: 7.5 cM, ~195 kb | Grain-amaranth genome | No | Markers unverified |
| 8 | Cao J et al. 2026, *J Ecol* 114 | [10.1111/1365-2745.70312](https://api.crossref.org/works/10.1111/1365-2745.70312) | *A. palmeri* (invasive, China) | GWAS + FST + common garden | Populations 21–49° N | Flowering time and duration | Candidate gene PTM; positions unverified | Unverified | Probably no | Full text blocked (HTTP 403) |
| 9 | de Kinderen MAJ 2025, PhD thesis, Univ. York | [etheses 38163](https://etheses.whiterose.ac.uk/id/eprint/38163/) | *A. cruentus* × *A. hypochondriacus* MAGIC; diversity set | MAGIC QTL + metabolite GWAS | 8 founders; 90 accessions | Leaf yield; 81 metabolite traits | Chr9, Chr10; tables in thesis supplement | Graph pangenome | Yes, CC BY-NC-ND | Positions not yet extracted |
| 10 | Kreiner JM et al. 2022, *Science* 378:1079 | [10.1126/science.abo7293](https://api.crossref.org/works/10.1126/science.abo7293) | *A. tuberculatus* | Environment-association scan | Herbarium + contemporary | Agricultural adaptation (403 SNPs) | Supplement (not opened) | Kreiner 2019 | No (preprint free) | Borderline scope |
| 11 | Raiyemo DA, Bobadilla LK, Tranel PJ 2023, *BMC Biol* 21:37 | [10.1186/s12915-023-01539-9](https://europepmc.org/article/MED/10.1186/s12915-023-01539-9) | 7 dioecious *Amaranthus* spp. | Coverage-based sex-gene profiling | Species panel | Sex | 11 candidate gene models; draft scaffolds | *A. palmeri* draft | Yes | Scaffold-level only |
| 12 | Raiyemo DA et al. 2026, preprint | [10.64898/2026.08.21.746229](https://europepmc.org/search?query=DOI%3A%2210.64898%2F2026.08.21.746229%22) | *A. spinosus*, *A. acanthochiton*, *A. arenicola*, *A. floridanus* | Genomes; Rf1 homologs | n/a | Sex (comparative) | Chr3 Rf1 homologs | New assemblies | Preprint | Not peer reviewed |
| 13 | Raiyemo 2024; Sadeque 2019; Kopecky Bobadilla 2023 (Illinois theses) | [IDEALS 132761](https://www.ideals.illinois.edu/items/132761), [113859](https://www.ideals.illinois.edu/items/113859), [128615](https://www.ideals.illinois.edu/items/128615) | *A. palmeri*, *A. tuberculatus* | Theses behind published sex papers | — | Sex, resistance | Duplicates published work | — | Yes | Provenance only |
| 14 | Smith SM 2013, MS thesis, BYU | [ETD 3548](https://scholarsarchive.byu.edu/etd/3548) | Grain amaranths | SNP linkage map (= Maughan 2011) | Interspecific F2 | — | Thesis PDF may hold cM table | — | Yes | Not opened |
| 15 | Kerr DR et al. 2023, *Weed Sci* 71:549 | [10.1017/wsc.2023.63](https://api.crossref.org/works/10.1017/wsc.2023.63) | *A. tuberculatus* | Inheritance | Central Illinois | S-metolachlor resistance | None (single dominant gene) | — | No | Add to inheritance table |
| 16 | Gudu & Gupta 1988; Gupta & Gudu 1990, *Euphytica*; Mishra et al. 2026 preprint | [10.1007/bf00037218](https://api.crossref.org/works/10.1007/bf00037218), [10.1007/bf00057621](https://api.crossref.org/works/10.1007/bf00057621), [10.21203/rs.3.rs-10363540/v1](https://api.crossref.org/works/10.21203/rs.3.rs-10363540/v1) | *A. hypochondriacus*; grain amaranth | Inheritance | Jumla; Suvarna × GA2 F2 | Male sterility; colour and morphology | None | — | Preprint yes | Add to inheritance table |

Three further items are worth noting. **Han, Dungey and Yakimowski 2026 (*Proc R Soc B*)** report non-Mendelian inheritance of EPSPS copy number, with a threshold near 33 copies. Their data are on Dryad (10.5061/dryad.sbcc2frjv) ([Europe PMC](https://europepmc.org/article/MED/10.1098/rspb.2026.0685)). **Aicklen et al. 2025** report an ARF9 Leu→Phe candidate variant behind MCPA resistance in *A. powellii*, which is the only genetic-variant study found for that species ([Europe PMC](https://europepmc.org/article/MED/10.1002/pld3.70105)). **Wang et al. 2023** place the betalain genes DODAα1 and CYP76ADα1 together in one TAD on *A. tricolor* Chr16 ([PMC](https://europepmc.org/article/PMC/PMC9847342)). All three can go in a candidate-gene layer.

No amaranth genomic-selection study exists. The DBT 64K SNP chip brochure reports validation accuracy only ([DBT](https://dbtindia.gov.in/sites/default/files/Amaranth%20broucher%20final%20%281%29.pdf)), and GWAS Atlas lists no *Amaranthus* species ([GWAS Atlas](https://ngdc.cncb.ac.cn/gwas/)).

## At least 14 validated PCR assays and several datasets fill the marker layer

The marker table currently holds PASA, KASP, HRM and sex-PCR entries, plus five catalogue-only rows. The researchers found at least 14 more assays. Four of them come with open-access primer sequences:

- **Spaunhorst et al. 2019** give a TaqMan allele-specific qPCR for ALS Trp574Leu in *A. palmeri*, with probes and primers printed in the text. Notably, 37% of chlorimuron survivors lacked the mutation ([PMC6435131](https://europepmc.org/article/PMC/PMC6435131)).
- **Rangani et al. 2019** give an RsaI CAPS assay for PPO2 G399A (691 bp amplicon) ([PMC6530635](https://europepmc.org/article/PMC/PMC6530635)).
- **Galindo-González and Dupras 2026** give RPA-Cas12a species-identification assays that were 100% accurate on blind samples of 14 species ([PMC13324167](https://europepmc.org/article/PMC/PMC13324167)).
- **Noguera et al. 2022** give a multiplex TaqMan copy-number assay for GS2, with primers in Table S1 ([PMC9374794](https://europepmc.org/article/PMC/PMC9374794)).

Other assays have a confirmed assay type, but their primers are paywalled or proprietary:

- Sarangi 2019, KASP for ΔG210 ([Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1017%2Fwsc.2019.29%22))
- Gaines 2010, EPSPS copy-number qPCR, the reference method that later papers reuse ([Europe PMC](https://europepmc.org/article/PMC/PMC2824275))
- Brusa 2021, three species-specific KASPs that detect 1 *A. palmeri* seed in 200 ([Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1002%2Fps.6278%22))
- Murphy 2017, ITS qPCR ([Europe PMC](https://europepmc.org/search?query=DOI%3A%2210.1002%2Fps.4632%22))
- Pyrosequencing panels from Porri 2022, Noguera 2021 and Dhaka 2026 ([PMC13569166](https://europepmc.org/article/PMC/PMC13569166))
- Park and Nishikawa 2012, a PCR-RFLP on starch-synthase genes that tells *A. caudatus* from *A. hypochondriacus* (species identification, not the waxy phenotype)

Two caveats apply. V361A, Pro197Ile, Asp376Glu, Trp574Met and EPSPS TAP-IVS are validated mutations with **no published allele-specific assay**, so they belong in a "known mutations" table. **No PCR marker exists for any grain-amaranth trait**: waxy, seed colour, betalain or flowering. Two patents, US 11866793 and US 9963750, remain unverified leads ([USPTO](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9963750)).

No repository holds curated *Amaranthus* QTL or GWAS summary statistics. The usable sources are supplementary tables and raw reads:

- NCBI PRJNA1208757 holds GBS data for the 192-accession *A. hypochondriacus* panel. It underlies three papers, two of them the already-included Chauhan 2026 and Prabhakaran 2026 ([PMC12485120](https://europepmc.org/article/PMC/PMC12485120)).
- PRJNA1193012 holds the MAGIC parent genomes.
- PRJNA1236290 is an unpublished grain-colour project ([NCBI](https://www.ncbi.nlm.nih.gov/bioproject/PRJNA1193012)).
- PRJNA1012341 ("QTL mapping HPPD-resistant Palmer") was flagged by the researchers as a possibly unpublished study. A check of the locally downloaded full text resolves it: the project is cited in the data statement of **Rigon 2025 (*J Exp Bot*, 10.1093/jxb/eraf114)**, which is already included (`data/literature/papers/PMC12223498/fulltext.xml`). It is not a new study.

Among conference abstracts, WSSA 2025 abstracts 180, 275 and 279 and the WSSA 2021 Murphy abstracts all correspond to papers already in the database (Werle 2025, Rigon 2025, Kreiner 2021, Murphy 2021). Laforest's abstract 281 is the only abstract-level precursor of a new paper ([WSSA 2025](https://wssa.net/wp-content/uploads/WSSA_2025-abstracts_6.20.25.pdf)).

## No meta-QTL or consensus map exists for the genus

Europe PMC full-text searches combining amaranth* with "meta-QTL", "meta-analysis of QTL" or "consensus map" returned 14 hits. All were wheat, sorghum, millet, oat or maize papers that mention amaranth only in passing ([Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=amaranth*%20AND%20(%22meta-QTL%22%20OR%20%22meta-analysis%20of%20QTL%22%20OR%20%22consensus%20map%22)&format=json)). Crossref queries also found no amaranth meta-QTL ([Crossref](https://api.crossref.org/works?query.bibliographic=amaranth%20meta-QTL)). Zaelani 2025 still describes amaranth genetic studies as "limited" ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13129576/)). Google Scholar, CNKI, J-STAGE full text and Scopus were not queried, so this answer is strong but not exhaustive.

The project's own files explain why no consensus map has been possible. `data/curated/consensus_status.csv` shows that only one of eight curated maps, Werle 2025, publishes marker-level positions. The Smith 2013 BYU thesis PDF is the best unexplored route to marker positions for Maughan 2011 ([BYU](https://scholarsarchive.byu.edu/etd/3548)). No new linkage map was found for weedy amaranths, *A. tricolor*, or any Indian, Chinese or African programme.

The five physical meta-QTL in `data/curated/meta_qtl.csv` already form the first such synthesis for the genus. They include MQTL-BET-16.1, a betalain cluster supported by three studies, and MQTL-FT-4.1, a flowering-time cluster on Chr4. Adding Kondo, Ludwig and the MAGIC loci would extend this layer within the grain amaranths. Adding Laforest would extend it across the weedy species, though only after a lift-over through synteny, because *A. palmeri* has 17 chromosomes and *A. tuberculatus* has 16.

## Corrections to the existing compilation

**Uncurated papers already in the pipeline.** Laforest 2026 and Raiyemo 2025 *Plant J* both appear in `data/literature/literature_index.tsv`, and their full texts have been downloaded, yet neither has a row in `studies.csv`. The screening step dropped them.

**Kreiner2021Gly has no records.** Its listed reason is a bioRxiv rate limit. The preprint (10.1101/2020.08.19.257972) is still a valid route ([bioRxiv](https://www.biorxiv.org/content/10.1101/2020.08.19.257972.full.pdf)), and the Kreiner 2019 SI text, which is already local, may share loci with it.

**CoreGWAS2026 (Boro and Yadav 2026) is mislabelled.** Its abstract describes a 248-accession diversity and structure study and mentions GWAS only as future work ([Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1007/s00438-026-02464-6&resultType=core&format=json)). The study ID and the design field "possible GWAS" should be relabelled. This rests on the abstract alone, because the full text is paywalled.

**DOI 10.1017/wsc.2017.68 belongs to Varanasi et al. 2018, not Salas-Perez.** Varanasi 2018 is the TaqMan survey of 167 accessions ([Crossref](https://api.crossref.org/works/10.1017/wsc.2017.68)). Salas-Perez 2017 is a separate paper, 10.1017/wsc.2017.41. The curated marker row already carries the correct title, but any author field or brief that cites Salas-Perez for this DOI should be fixed.

**Mallory 2008 species metadata is unresolved.** The database records *A. cruentus*, which matches how Zaelani 2025 describes the paper. One researcher recalled, without verification, that the population was an interspecific *A. hypochondriacus*-based F2. Check the original paper.

**Stetter 2020 has two internal mismatches.**
- The raw-read accession is PRJEB30533 in `linkage_maps.csv`, but the researchers found the seed-colour project under PRJEB30531 ([NCBI](https://www.ncbi.nlm.nih.gov/bioproject/?term=PRJEB30531)). Both may exist.
- The F2 is described as 224 plants in `studies.csv` and 206 plants in `linkage_maps.csv` and `loci.csv`.

**Duplicate records to avoid.** The following preprints duplicate papers already included:
- bioRxiv 10.1101/2021.10.05.463269 (Lin 2022)
- 10.1101/2024.05.30.596720 (Raiyemo 2025 *BMC Genomics*)
- 10.1101/2024.09.17.613486 (Kreiner 2025)
- 10.1101/2020.05.25.113597 (Neves 2020)

The 2025 *A. tricolor* heat-stress preprint (10.1101/2025.03.05.641739) is a predecessor of LinY2026, not an independent GWAS.

## Recommended next curation actions

1. Load Laforest 2026 Table 1 (11 SNPs, AmaTu_v01) and the four Raiyemo 2025 *Plant J* SNPs. Then open Tables S10–S12 for the bounds of the 2.84 Mb Chr3 male-specific region.
2. Get the Kondo 2024 full text to confirm the *Acsh* interval, the assembly and the markers before lifting it to *A. hypochondriacus*.
3. Download the de Kinderen thesis PDF and extract the MAGIC leaf-yield intervals and the 81 metabolite associations.
4. Extract sweep coordinates from Kreiner 2019 (SI already local) and Kreiner 2022 *eLife*, add GS2 and EPSPS as copy-number gene records, and retry the Kreiner 2021 preprint.
5. Add Spaunhorst 2019, Rangani 2019, Galindo-González 2026 and Noguera 2022 to `validated_pcr_markers.csv` with their sequences. Add Kerr 2023, Gudu 1988, Gupta 1990 and Mishra 2026 to `inheritance_studies.csv`.
6. Apply the corrections above: relabel Boro, fix the Varanasi attribution, settle Mallory's species, and reconcile the Stetter accession and F2 size.
7. Search the sources not yet covered: CNKI/Wanfang, J-STAGE, the WSSA/NCWSS abstract books for 2022–2024 and 2026, Shodhganga, and the Mexican and African university repositories.

## Conclusion

Amaranth mapping data are now weed-led. Five of the seven Tier 1 studies concern herbicide resistance or sex in *A. tuberculatus* and *A. palmeri*. Meanwhile the crop side gains only one Mb-scale locus (Kondo) and one unpublished MAGIC population. This makes the coordinate framework decisive. The new loci sit on at least four assemblies (AmaTu_v01, Kreiner 2019, *A. palmeri* Hap1 and an *A. cruentus* "2B" build), so lift-over and synteny will shape the database's value more than any single extra study.

Because no meta-QTL or consensus map has ever been published for *Amaranthus*, AmaranthQTLdb's physical meta-QTL layer is publishable as a first. Its strength will come mainly from synthesis across studies, because few loci remain uncurated. The largest gap for a consensus map is marker-level cM tables, and these are most likely to come from theses (BYU, York), not from journals.
