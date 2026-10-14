/** One linkage-mapping QTL record (public/data/qtl.csv). */
export interface QTLRecord {
  id: string
  species: string
  /** Trait category (one of TRAIT_CATEGORIES). */
  trait: string
  /** Harmonised trait name. */
  parameter?: string
  trait_original?: string
  qtl_name: string
  chromosome: string
  position_interval?: string
  /** 'bp' or 'cM' */
  position_unit?: string
  /** Position projected onto the TM-1 UTX v2.1 axis, used by the map. */
  map_bp?: string
  ref_genome?: string
  associated_markers?: string
  lod?: string
  pve?: number | string
  neg_log10_p?: string
  candidate_gene?: string
  cross?: string
  population?: string
  environment?: string
  reference?: string
  doi?: string
  source?: string
  /** 'database' (curated by the source database) or 'auto-extracted' (parsed from a paper table). */
  evidence?: string
  locus_id?: string
  hotspot_id?: string
  subtype?: string
  /** QTL, GWAS MTA, GWAS QTN, Mendelian locus, Sex-linked region */
  record_type?: string
  /** Genome the locus is drawn on (Ahyp_v3, Atub_hap1, Apal_hap1) and its converted position there. */
  genome?: string
  map_chromosome?: string
  map_start?: string
  map_end?: string
  position_cm?: string
  p_value?: string
  additive_effect?: string
  method?: string
  study_id?: string
  year?: string
  note?: string
}

/** One GWAS locus (public/data/gwas.csv): the lead association of a cluster of co-localising SNPs. */
export interface GWASRecord extends QTLRecord {
  n_associations?: string
  n_studies?: string
}

export interface MetaQTLRecord {
  id: string
  species: string
  trait: string
  parameter?: string
  trait_original?: string
  mqtl_name: string
  chromosome: string
  position_interval?: string
  position_unit?: string
  associated_markers?: string
  lod?: string
  pve?: number | string
  candidate_gene?: string
  population?: string
  reference?: string
  doi?: string
  source?: string
  evidence?: string
}

/** One meta-QTL computed by AmaranthQTLdb on the common physical axis (public/data/mqtl.csv). */
export interface MQTLRecord {
  mqtl_id: string
  trait: string
  category: string
  genome?: string
  chromosome: string
  position_mb: string
  ci_start_mb: string
  ci_end_mb: string
  ci_width_mb: string
  v21_chromosome?: string
  v21_position_mb?: string
  v21_ci_mb?: string
  n_studies: string
  studies?: string
  n_observations: string
  n_loci?: string
  traits?: string
  record_types?: string
  recurrent_candidate_genes: string
  species: string
  confidence: string
}

export interface ClusterRecord extends QTLRecord {}

export interface EpistaticRecord {
  id: string
  species: string
  trait: string
  parameter?: string
  trait_original?: string
  locus1: string
  chromosome: string
  pos1_bp?: string
  markers1?: string
  chromosome2?: string
  pos2_bp?: string
  markers2?: string
  locus2: string
  lod?: string
  neg_log10_p?: string
  pve?: number | string
  effect?: string
  /** 'physical' (both loci have bp positions), 'chromosome only', or 'unplaced' */
  placement?: string
  population?: string
  reference?: string
  doi?: string
  evidence?: string
}

/** One linkage map (public/data/maps.csv); its loci are in public/data/maps/<map_id>.csv. */
export interface LinkageMapRecord {
  map_id: string
  marker_positions?: string
  name: string
  source: string
  map_type: string
  species: string
  population: string
  parents: string
  n_linkage_groups: string
  n_loci: string
  length_cm: string
  marker_types: string
  n_qtl: string
  reference: string
  doi: string
}

export interface MapLocus {
  marker: string
  marker_type: string
  linkage_group: string
  chromosome: string
  position_cm: string
  primers?: string
}

/** One trait-linked marker (public/data/markers.csv). */
export interface MarkerRecord {
  marker: string
  trait: string
  category: string
  marker_type: string
  chromosome: string
  n_studies: string
  primers: string
  evidence: string
  context: string
  species: string
  reference: string
  doi: string
}

export interface MTLRecord {
  id: string
  species: string
  trait: string
  parameter?: string
  trait_original?: string
  qtl_name: string
  reference?: string
  doi?: string
  citation?: string
}

export interface HotspotRecord {
  hotspot_id: string
  chromosome: string
  start: string
  end: string
  size_mb: string
  n_studies: string
  peak_window_studies: string
  min_q: string
  n_loci: string
  n_records: string
  n_qtl_records: string
  n_gwas_records: string
  n_traits: string
  n_trait_categories: string
  top_traits: string
  trait_categories: string
  dominant_category: string
  species: string
  sources: string
  example_qtl: string
  recurrent_candidate_genes: string
  pmids: string
}

export interface WindowRecord {
  chromosome: string
  start: string
  end: string
  n_studies: string
  n_loci: string
  n_traits: string
  q: string
  significant: string
}

export interface LiteratureRecord {
  pmid: string
  pmcid: string
  year: string
  title: string
  authors: string
  journal: string
  study_type: string
  open_access: string
  records_extracted: string
  doi: string
}

export interface Summary {
  built: string
  counts: Record<string, number>
  by_species: Record<string, number>
  by_category: Record<string, { qtl: number; gwas: number }>
  by_record_type: Record<string, number>
  top_traits: Record<string, number>
  per_chromosome: { genome: string; chromosome: string; length_mb: number; loci: number }[]
  studies_per_year: { year: number; studies: number }[]
  by_study: { study_id: string; year: string; species: string; records: number }[]
  lift: { target: string; status: string; n: number }[]
}
