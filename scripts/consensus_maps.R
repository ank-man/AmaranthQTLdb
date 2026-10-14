#!/usr/bin/env Rscript
# Consensus linkage maps per species (LPmerge; Endelman & Plomion 2014).
#
# A consensus map needs >= 2 maps of one species with marker-level positions and shared markers
# (markers are matched by name; SNPs named by physical position, e.g. S01_3701509, are matched across
# maps after lifting to a common assembly). For each species the script reports which maps qualify and,
# where at least two do, merges them linkage group by linkage group, choosing the LPmerge maximum
# interval by the lowest RMSE.
#
# Writes data/curated/consensus/<species>_consensus.csv and data/curated/consensus_status.csv.
# Usage: Rscript scripts/consensus_maps.R
suppressPackageStartupMessages({ library(data.table); library(LPmerge) })
idx <- fread("data/curated/linkage_maps.csv")
dir.create("data/curated/consensus", showWarnings = FALSE)
status <- list()
for (sp in unique(idx$species)) {
  m <- idx[species == sp]
  files <- file.path("data/curated/maps", paste0(m$map_id, ".csv"))
  ok <- m[file.exists(files) & marker_positions == "yes"]
  why <- if (nrow(ok) >= 2) "" else sprintf(
    "%d map(s) of this species; %d with published marker-level positions (%s). A consensus needs >= 2 such maps with shared markers.",
    nrow(m), nrow(ok), if (nrow(ok)) paste(ok$map_id, collapse = ", ") else "none")
  if (nrow(ok) >= 2) {
    maps <- lapply(ok$map_id, function(id) fread(file.path("data/curated/maps", paste0(id, ".csv"))))
    out <- rbindlist(lapply(sort(unique(unlist(lapply(maps, `[[`, "linkage_group")))), function(lg) {
      parts <- lapply(maps, function(d) { x <- d[linkage_group == lg, .(marker, position_cM)]; setnames(x, c("marker", "position")); as.data.frame(x) })
      parts <- parts[sapply(parts, nrow) > 1]
      shared <- Reduce(union, lapply(parts, `[[`, "marker"))
      if (length(parts) < 2) return(NULL)
      res <- LPmerge(parts, max.interval = 1:3)
      best <- res[[which.min(sapply(res, function(r) mean(r$RMSE, na.rm = TRUE)))]]
      data.table(linkage_group = lg, marker = best$marker, consensus_cM = best$consensus)
    }))
    fwrite(out, sprintf("data/curated/consensus/%s_consensus.csv", gsub("[^A-Za-z]+", "_", sp)))
    why <- sprintf("built from %s", paste(ok$map_id, collapse = " + "))
  }
  status[[sp]] <- data.table(species = sp, maps = nrow(m), maps_with_marker_positions = nrow(ok),
                             consensus_built = nrow(ok) >= 2, note = why)
}
st <- rbindlist(status)
fwrite(st, "data/curated/consensus_status.csv")
print(st)
