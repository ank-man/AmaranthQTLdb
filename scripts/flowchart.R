#!/usr/bin/env Rscript
# Database flowchart: sources -> curation & verification -> data and analyses -> website features.
# Drawn with DiagrammeR (Graphviz); counts are read from the current curated tables.
# Writes figures/database_flowchart.{svg,png}; the JPEG is made from the PNG by scripts/flowchart_jpeg.py.
# Usage: Rscript scripts/flowchart.R
suppressPackageStartupMessages({ library(DiagrammeR); library(DiagrammeRsvg); library(rsvg); library(data.table); library(jsonlite) })

s   <- fromJSON("website/public/data/summary.json")$counts
loc <- fread("data/curated/loci.csv")
stu <- fread("data/curated/studies.csv")
lm  <- fread("data/curated/linkage_maps.csv")
pcr <- fread("data/curated/validated_pcr_markers.csv")
rna <- fread("data/curated/rnaseq_studies.csv")
rds <- fread("data/curated/rnaseq_datasets.csv")
aud <- fread("data/curated/audit_loci.csv")
f <- function(x) format(x, big.mark = ",")

n_qtl  <- sum(loc$record_type %in% c("QTL", "BSA locus", "Mendelian locus"))
n_gwas <- sum(grepl("^GWAS", loc$record_type))
n_other <- nrow(loc) - n_qtl - n_gwas
n_sp   <- length(unique(sub(" \\(.*", "", loc$species)))

# HTML-like node label: bold title, muted detail line(s)
lab <- function(title, detail, big = NULL) {
  b <- if (!is.null(big)) sprintf("<FONT POINT-SIZE='22' COLOR='#9B1B4A'><B>%s</B></FONT><BR/>", big) else ""
  sprintf("<%s<FONT POINT-SIZE='13'><B>%s</B></FONT><BR/><FONT POINT-SIZE='10' COLOR='#5A545A'>%s</FONT>>", b, title, detail)
}

g <- sprintf('
digraph db {
  graph [rankdir = LR, bgcolor = "white", fontname = "Helvetica", nodesep = 0.28, ranksep = 0.75, pad = 0.4,
         splines = spline, newrank = true, compound = true, label = <%s>, labelloc = t, labeljust = l, fontsize = 12]
  node  [shape = box, style = "rounded,filled", fontname = "Helvetica", color = "#D9D3D8", fillcolor = "white",
         penwidth = 1.1, margin = "0.18,0.10", width = 2.6]
  edge  [color = "#BDB2BA", arrowsize = 0.6, penwidth = 1.2]

  subgraph cluster_src  { label = <<B>1  SOURCES</B>>; CLUSTER
    lit [label = %s]; db [label = %s] }
  subgraph cluster_cur  { label = <<B>2  CURATION</B>>; CLUSTER
    ft [label = %s]; cur [label = %s]; ver [label = %s] }
  subgraph cluster_data { label = <<B>3  DATA</B>>; CLUSTER
    loci [label = %s, color = "#9B1B4A", penwidth = 1.7]; maps [label = %s]; mark [label = %s]; rna [label = %s] }
  subgraph cluster_ana  { label = <<B>4  ANALYSES</B>>; CLUSTER
    lift [label = %s]; mqtl [label = %s, color = "#9B1B4A", penwidth = 1.7]; cons [label = %s] }
  subgraph cluster_web  { label = <<B>5  WEBSITE</B>>; CLUSTER
    srch [label = %s]; gmap [label = %s]; figs [label = %s]; dl [label = %s] }

  { rank = same; lit; db }
  { rank = same; ft; cur; ver }
  { rank = same; loci; maps; mark; rna }
  { rank = same; lift; mqtl; cons }
  { rank = same; srch; gmap; figs; dl }
  ft -> cur -> ver [constraint = false]
  lift -> mqtl [constraint = false]

  lit -> ft [ltail = cluster_src, lhead = cluster_cur]
  ver -> loci [ltail = cluster_cur, lhead = cluster_data]
  loci -> lift [ltail = cluster_data, lhead = cluster_ana]
  mqtl -> gmap [ltail = cluster_ana, lhead = cluster_web]
}',
  "<FONT POINT-SIZE='22'><B>Amaranth<FONT COLOR='#9B1B4A'>QTL</FONT>db</B></FONT><BR/><FONT POINT-SIZE='11' COLOR='#5A545A'>Source-traced QTL, GWAS loci, meta-QTL, linkage maps, PCR markers and RNA-seq of <I>Amaranthus</I></FONT><BR/>",
  lab("Literature", "Europe PMC · Crossref<BR/>33-species sweep · web<BR/>bioRxiv full texts"),
  lab("Databases &amp; genomes", "NCBI SRA · NCBI &amp; CoGe assemblies<BR/>Dryad · Zenodo · Figshare<BR/>GWAS Atlas"),
  lab("Full text &amp; supplements", "tables · Word / Excel · PDF"),
  lab("Curated schema", "each record traced to its<BR/>source table or sentence", sprintf("%s studies", f(nrow(stu)))),
  lab("Verification", sprintf("citations checked in Crossref<BR/>%s values audited in the papers", f(nrow(aud)))),
  lab("Mapped loci", sprintf("%s QTL / BSA · %s GWAS · %s other<BR/>%d species groups", f(n_qtl), f(n_gwas), f(n_other), n_sp), f(nrow(loc))),
  lab("Linkage maps", sprintf("%s maps · %s markers", f(nrow(lm)), f(s$map_markers))),
  lab("Validated PCR markers", sprintf("%s assays · primers verified", f(length(unique(pcr$marker))))),
  lab("RNA-seq", sprintf("%s studies · %s SRA BioProjects", f(nrow(rna)), f(nrow(rds)))),
  lab("Coordinate conversion", "minimap2 liftover<BR/>8 assemblies to 3 references"),
  lab("Meta-QTL &amp; clusters", sprintf("Gaussian mixture, &#8805; 2 studies<BR/>%s multi-trait clusters", f(s$clusters)), f(s$mqtl)),
  lab("Consensus maps", "LPmerge, per species"),
  lab("Search &amp; tables", "species · trait · chromosome · PVE"),
  lab("Genome map", "ideogram &amp; Circos, 3 genomes"),
  lab("Figures", "RIdeogram · circlize · LinkageMapView"),
  lab("Open data", "CSV export · GitHub · scripts")
)
g <- gsub("CLUSTER", "fontcolor = \"#9B1B4A\"; fontsize = 12; color = \"#EFE9ED\"; style = \"rounded,filled\"; fillcolor = \"#FBF8FA\"; margin = 14;", g)

gr <- grViz(g)
svg <- export_svg(gr)
dir.create("figures", showWarnings = FALSE)
# Graphviz positions each coloured run of the title with approximate font metrics, which leaves
# uneven gaps; merge the runs into one <text> with coloured <tspan>s so the renderer spaces them,
# and left-align the title with the subtitle.
runs <- regmatches(svg, gregexpr('<text[^>]*font-size="22.00"[^>]*>[^<]*</text>', svg))[[1]]
if (length(runs) >= 2) {
  y <- sub('.* y="([^"]+)".*', "\\1", runs[1])
  runs <- runs[sub('.* y="([^"]+)".*', "\\1", runs) == y]   # title line only
  sx <- sub('.* x="([^"]+)".*', "\\1", regmatches(svg, regexpr('<text[^>]*font-size="11.00"[^>]*>', svg)))
  tsp <- paste0(vapply(runs, function(r) sprintf('<tspan fill="%s">%s</tspan>', sub('.* fill="([^"]+)".*', "\\1", r),
                                                 trimws(gsub("&#8201;", "", sub(".*>([^<]*)</text>", "\\1", r)))), ""), collapse = "")
  merged <- sprintf('<text text-anchor="start" x="%s" y="%s" font-family="Helvetica,sans-Serif" font-weight="bold" font-size="22.00">%s</text>', sx, y, tsp)
  svg <- sub(runs[1], merged, svg, fixed = TRUE)
  for (r in runs[-1]) svg <- sub(r, "", svg, fixed = TRUE)
}
writeLines(svg, "figures/database_flowchart.svg")
rsvg_png(charToRaw(svg), "figures/database_flowchart.png", width = 4000)
cat("wrote figures/database_flowchart.svg / .png\n")
