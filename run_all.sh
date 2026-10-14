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
$PY scripts/chromosome_lengths.py      # chromosome_lengths.csv of the target assemblies
$PY scripts/meta_qtl.py                # meta_qtl*.csv, qtl_clusters.csv
Rscript scripts/consensus_maps.R       # consensus_status.csv (+ consensus maps when >= 2 marker-level maps)
$PY scripts/compile_pcr_markers.py     # validated_pcr_markers.csv
Rscript scripts/plots.R                # grain-amaranth karyotype / circos (v2.1) and linkage map figure
Rscript scripts/plots_species.R        # karyotype + circos for every species on its current assembly
$PY scripts/finish_figures.py
$PY scripts/export_site_data.py        # website/public/data, figures, src/lib/genomes.json
(cd website && npm run build)          # website/dist
