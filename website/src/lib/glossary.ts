// Single source of truth for terminology used as column-header tooltips (GlossaryHeader) and on the FAQ page.
export const GLOSSARY = {
  qtl: 'Quantitative Trait Locus (QTL): a chromosomal region associated with a measurable trait, identified by linkage between markers and phenotype in a segregating population (interval mapping).',
  mta: 'GWAS locus: a SNP significantly associated with a trait in a diversity panel (marker-trait association, MTA; or quantitative trait nucleotide, QTN, in multi-locus models).',
  metaqtl: 'Meta-QTL (MQTL): a consensus locus for one trait group supported by loci from at least two independent studies, computed here on the A. hypochondriacus physical axis with a Gaussian mixture model (each locus keeps its own positional variance; number of components chosen by BIC). Position = precision-weighted mean; interval = 95% confidence interval.',
  confidence: 'Confidence: moderate = supported by 3 or more independent studies, low = 2.',
  trait: 'Trait category: the broad class (phenology, pigmentation, plant architecture, seed protein, seed minerals, herbicide resistance, sex determination).',
  parameter: 'Trait: the harmonised trait name (e.g. "Days to flowering", "Leaf pigmentation").',
  trait_original: 'Original trait: the trait name exactly as given in the paper.',
  chromosome: 'Chr: chromosome as published (Chr01 = chromosome / scaffold 1 of the assembly in the Assembly column).',
  position_interval: 'Position / interval: as published, in bp on the assembly named in the Assembly column. A range is the support interval; a single value is the peak SNP.',
  position_unit: 'Unit: bp = physical position on a genome assembly; cM = genetic position on that study’s linkage map.',
  ref_genome: 'Assembly: the reference genome the published coordinates refer to. Converted positions on the current assembly of each species are in the Map position column and on the Assemblies page.',
  map_bp: 'Map position: the locus converted to the current assembly of its species (A. hypochondriacus v3, A. tuberculatus hap1, A. palmeri hap1) by whole-genome or flanking-sequence alignment; used by the genome map.',
  associated_markers: 'Marker: the lead SNP or marker of the locus.',
  pve: 'PVE / R² (phenotypic variance explained): the percentage of phenotypic variation attributed to the locus - an effect size, not a significance measure.',
  lod: 'LOD score: strength of linkage (or multi-locus GWAS) evidence for the locus.',
  neg_log10_p: '−log10(P): significance of the association, computed from the published P value.',
  candidate_gene: 'Candidate gene: gene(s) proposed by the source as underlying the locus - not necessarily validated.',
  population: 'Population / panel: the mapping population or GWAS panel.',
  evidence: 'Evidence: "significant" = reported at the study’s significance threshold; "suggestive" = reported by the study at 0.001 < P ≤ 0.01 (kept, but not used for clusters).',
  n_studies: 'Studies: number of independent studies contributing at least one locus.',
  record_type: 'Type: QTL (linkage mapping), GWAS MTA / QTN, Mendelian locus (single-gene trait mapped on a linkage map), or sex-linked region.',
} as const

export type GlossaryTerm = keyof typeof GLOSSARY
