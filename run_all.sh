#!/bin/sh
# Rebuild the Amaranthus QTL compilation from the downloaded literature.
# Literature harvesting (network) is separate: scripts/literature_harvest.py, scripts/crossref_search.py,
# scripts/species_sweep.py, scripts/pcr_marker_search.py, scripts/fetch_pmc.py, scripts/extract_supplements.py.
set -e
cd "$(dirname "$0")"
PY=${PYTHON:-python3}
$PY scripts/curate_studies.py          # loci.csv, studies.csv
$PY scripts/inheritance_studies.py     # inheritance_studies.csv (network: abstracts)
$PY scripts/build_linkage_maps.py      # linkage_maps.csv, linkage_groups.csv, maps/
$PY scripts/liftover.py                # coordinates_lifted.csv, assemblies.csv (needs genomes + minimap2)
$PY scripts/meta_qtl.py                # meta_qtl*.csv, qtl_clusters.csv
Rscript scripts/consensus_maps.R       # consensus_status.csv (+ consensus maps when >= 2 marker-level maps)
$PY scripts/compile_pcr_markers.py     # validated_pcr_markers.csv
Rscript scripts/plots.R                # karyotype, circos, linkage map figures
$PY scripts/finish_figures.py
