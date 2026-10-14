#!/usr/bin/env Rscript
# Figures for the Amaranthus QTL compilation.
#   1. RIdeogram karyotype of A. hypochondriacus: locus density (1-Mb windows) as a heatmap on the
#      chromosomes; QTL (boxes), GWAS loci (circles) and meta-QTL (triangles) beside them, coloured by
#      trait group.
#   2. Circos (circlize) of A. hypochondriacus: chromosome ideogram, locus density, one track per
#      trait category, multi-trait clusters and meta-QTL.
#   3. LinkageMapView of the A. tuberculatus F2 map (Werle et al. 2025) with its dicamba and 2,4-D
#      QTL support intervals in cM.
# Chromosome lengths for A. hypochondriacus v2.x are not published with the sources used here, so each
# chromosome is drawn to its furthest mapped locus + 1 Mb.
# Usage: Rscript scripts/plots.R      (from the project root)

suppressPackageStartupMessages({
  library(data.table); library(RIdeogram); library(circlize); library(LinkageMapView); library(rsvg)
})
dir.create("figures", showWarnings = FALSE)
loci <- fread("data/curated/loci.csv", colClasses = "character")
mq   <- fread("data/curated/meta_qtl.csv", colClasses = "character")
cl   <- fread("data/curated/qtl_clusters.csv", colClasses = "character")

group_of <- c(
  "Heading date" = "Flowering time", "Anthesis date" = "Flowering time", "Days to flowering" = "Flowering time",
  "Hypocotyl color" = "Betalain pigmentation", "Inflorescence color" = "Betalain pigmentation",
  "Stem pigmentation" = "Betalain pigmentation", "Leaf pigmentation" = "Betalain pigmentation",
  "Petiole pigmentation" = "Betalain pigmentation", "Stem color (betalain)" = "Betalain pigmentation",
  "Seed coat color" = "Seed coat color", "Plant height" = "Plant architecture", "Stem diameter" = "Plant architecture",
  "Number of nodes" = "Plant architecture", "Branching index" = "Plant architecture", "Leaf shape" = "Plant architecture",
  "Seed albumin" = "Seed protein", "Seed globulin" = "Seed protein", "Seed glutelin" = "Seed protein",
  "Seed total protein" = "Seed protein", "Grain calcium" = "Seed minerals", "Grain iron" = "Seed minerals",
  "Grain magnesium" = "Seed minerals", "Grain zinc" = "Seed minerals")
# Okabe-Ito based, fixed order
COL <- c("Flowering time" = "#0072B2", "Betalain pigmentation" = "#CC79A7", "Seed coat color" = "#8C510A",
         "Plant architecture" = "#009E73", "Seed protein" = "#E69F00", "Seed minerals" = "#56B4E9")

ah <- loci[startsWith(reference_genome, "A. hypochondriacus") & grepl("^[0-9]+$", chromosome)]
ah[, group := group_of[trait]]
ah <- ah[!is.na(group)]
num <- function(x) suppressWarnings(as.numeric(x))
ah[, `:=`(s = num(start_bp), e = num(end_bp), p = num(peak_bp))]
ah[, pos := fifelse(!is.na(p), p, fifelse(!is.na(s), (s + e) / 2, NA_real_))]
ah[is.na(s), `:=`(s = pos, e = pos)]
ah[, chrn := as.integer(chromosome)]
ah[, weak := grepl("0.001 < P", method, fixed = TRUE)]

chr_len <- ah[, .(End = max(c(e, pos), na.rm = TRUE) + 1e6), by = chrn][order(chrn)]
kary <- data.frame(Chr = paste0("Chr", chr_len$chrn), Start = 0, End = round(chr_len$End))

# ---- 1. RIdeogram ---------------------------------------------------------------------------
win <- 1e6
dens <- rbindlist(lapply(seq_len(nrow(chr_len)), function(i) {
  ch <- chr_len$chrn[i]; br <- seq(0, chr_len$End[i] + win, by = win)
  x <- ah[chrn == ch & weak == FALSE, pos]
  data.table(Chr = paste0("Chr", ch), Start = head(br, -1), End = tail(br, -1) - 1,
             Value = as.integer(table(cut(x, br, right = FALSE))))
}))
shape_of <- function(rt) ifelse(rt == "QTL" | rt == "Mendelian locus", "box", "circle")
mk <- ah[weak == FALSE, .(Type = group, Shape = shape_of(record_type), Chr = paste0("Chr", chrn),
                  Start = round(pos), End = round(pos) + 1, color = sub("#", "", COL[group]))]
mq_mk <- mq[, .(Type = "Meta-QTL", Shape = "triangle", Chr = paste0("Chr", chromosome),
                Start = as.numeric(position_bp), End = as.numeric(position_bp) + 1, color = "111111")]
mk <- unique(rbind(mk, mq_mk))
old <- setwd("figures")
ideogram(karyotype = kary, overlaid = as.data.frame(dens), label = as.data.frame(mk), label_type = "marker",
         colorset1 = c("#f7f7f7", "#bdbdbd", "#252525"), width = 170, Lx = 80, Ly = 25,
         output = "karyotype_A_hypochondriacus.svg")
convertSVG("karyotype_A_hypochondriacus.svg", file = "karyotype_A_hypochondriacus", device = "png", dpi = 600)
convertSVG("karyotype_A_hypochondriacus.svg", file = "karyotype_A_hypochondriacus", device = "pdf")
setwd(old)
cat("wrote figures/karyotype_A_hypochondriacus.{svg,png,pdf}\n")

# ---- 2. Circos ------------------------------------------------------------------------------
draw_circos <- function() {
  circos.clear()
  circos.par(start.degree = 90, gap.after = c(rep(1.2, nrow(kary) - 1), 8), cell.padding = c(0, 0, 0, 0),
             track.margin = c(0.004, 0.004))
  circos.genomicInitialize(kary, plotType = NULL)
  # chromosome ring with labels and Mb ticks
  circos.track(ylim = c(0, 1), track.height = 0.05, bg.border = NA, panel.fun = function(x, y) {
    circos.rect(CELL_META$xlim[1], 0, CELL_META$xlim[2], 1, col = "#D9D9DE", border = "#8A8A93", lwd = 0.5)
    circos.text(CELL_META$xcenter, 2.4, sub("Chr", "", CELL_META$sector.index), cex = 0.62, facing = "inside", niceFacing = TRUE)
    circos.axis(h = "top", major.at = seq(0, CELL_META$xlim[2], by = 10e6), labels = NULL, major.tick.length = 0.4,
                minor.ticks = 0, lwd = 0.4)
  })
  # locus density
  dd <- as.data.frame(dens[, .(Chr, Start, End, Value)])
  circos.genomicTrack(dd, ylim = c(0, max(dd$Value)), track.height = 0.08, bg.border = NA,
    panel.fun = function(region, value, ...) {
      circos.genomicRect(region, value, ytop.column = 1, ybottom = 0, col = "#4D4D57", border = NA)
    })
  # one track per trait category: QTL/intervals as bars, SNPs as points
  for (g in names(COL)) {
    d <- ah[group == g & weak == FALSE]
    circos.track(ylim = c(0, 1), track.height = 0.045, bg.border = "#ECECF0", bg.lwd = 0.3, bg.col = "#FBFBFC",
      panel.fun = function(x, y) {
        sub <- d[paste0("Chr", chrn) == CELL_META$sector.index]
        iv <- sub[e > s + 1]
        if (nrow(iv)) circos.rect(iv$s, 0.2, iv$e, 0.8, col = adjustcolor(COL[g], 0.85), border = NA)
        pt <- sub[!(e > s + 1)]
        if (nrow(pt)) circos.points(pt$pos, rep(0.5, nrow(pt)), pch = 16, cex = 0.32, col = COL[g])
      })
  }
  # clusters and meta-QTL
  circos.track(ylim = c(0, 1), track.height = 0.05, bg.border = NA, panel.fun = function(x, y) {
    c1 <- cl[paste0("Chr", chromosome) == CELL_META$sector.index]
    if (nrow(c1)) circos.rect(as.numeric(c1$start_bp), 0, as.numeric(c1$end_bp), 1, col = adjustcolor("#F2C14E", 0.7), border = NA)
    m1 <- mq[paste0("Chr", chromosome) == CELL_META$sector.index]
    if (nrow(m1)) {
      circos.rect(as.numeric(m1$ci_start_bp), 0, as.numeric(m1$ci_end_bp), 1, col = "#111111", border = NA)
      circos.text(as.numeric(m1$position_bp), -1.2, sub("MQTL-", "", m1$meta_qtl), cex = 0.45, facing = "clockwise",
                  niceFacing = TRUE, adj = c(1, 0.5))
    }
  })
  text(0, 0, expression(italic("A. hypochondriacus")), cex = 0.75, font = 3)
  text(0, -0.08, "QTL, GWAS loci and meta-QTL", cex = 0.55, col = "#55555C")
  legend(x = 1.12, y = 0.55, bty = "n", cex = 0.7, xjust = 0,
         legend = c("Locus density (1 Mb)", names(COL), "Multi-trait cluster", "Meta-QTL (95% CI)"),
         fill = c("#4D4D57", COL, adjustcolor("#F2C14E", 0.7), "#111111"), border = NA,
         title = "Tracks, outside to inside", title.adj = 0)
  circos.clear()
}
# square plot region on the left, legend in the right margin
png("figures/circos_A_hypochondriacus.png", width = 9.4, height = 7.2, units = "in", res = 600, bg = "white")
par(mar = c(0.3, 0.3, 0.3, 15), xpd = NA); draw_circos(); invisible(dev.off())
pdf("figures/circos_A_hypochondriacus.pdf", width = 9.4, height = 7.2)
par(mar = c(0.3, 0.3, 0.3, 15), xpd = NA); draw_circos(); invisible(dev.off())
cat("wrote figures/circos_A_hypochondriacus.{png,pdf}\n")

# ---- 3. LinkageMapView: A. tuberculatus F2 map with QTL --------------------------------------
mp <- fread("data/curated/maps/AT_Werle2025_CHRxWUS.csv")
mp <- mp[, .(group = paste0("LG", linkage_group), position = position_cM, locus = marker)]
setorder(mp, group, position)
q <- loci[study_id == "Werle2025"]
q[, c("lo", "hi") := tstrsplit(gsub("[–‐−]", "-", position_cM), "-", fixed = TRUE)]
q[, `:=`(lo = as.numeric(lo), hi = as.numeric(hi))]
qtldf <- data.frame(chr = paste0("LG", q$chromosome), qtl = sub(" resistance", "", q$trait),
                    so = q$lo, si = q$lo, ei = q$hi, eo = q$hi,
                    col = ifelse(grepl("Dicamba", q$trait), "#D55E00", "#0072B2"), stringsAsFactors = FALSE)
lgs <- unique(qtldf$chr)
lgs <- lgs[order(as.integer(sub("LG", "", lgs)))]
mp_sub <- as.data.frame(mp[group %in% lgs])
mp_sub$group <- factor(mp_sub$group, levels = lgs)
mp_sub <- mp_sub[order(mp_sub$group, mp_sub$position), ]
# density-shaded bars, few marker labels (positions labelled every ~20 cM to stay legible)
keep <- unlist(lapply(split(mp_sub, mp_sub$group), function(d) d$locus[!duplicated(round(d$position / 20))]))
lmv.linkage.plot(mp_sub, outfile = "figures/linkage_map_A_tuberculatus_QTL.pdf", mapthese = lgs,
                 denmap = TRUE, qtldf = qtldf, showonly = keep, lcex = 0.45, rcex = 0.45, cex.lgtitle = 0.9, lgperrow = 7,
                 lgtitles = lgs, pdf.width = 16, pdf.height = 11, main = "A. tuberculatus F2 (CHR x WUS): dicamba and 2,4-D QTL")
# raster copy (macOS Quick Look renders the PDF at full size); flattened onto white in finish_figures.py
system("qlmanage -t -s 4800 -o figures figures/linkage_map_A_tuberculatus_QTL.pdf >/dev/null 2>&1")
file.rename("figures/linkage_map_A_tuberculatus_QTL.pdf.png", "figures/linkage_map_A_tuberculatus_QTL.png")
cat("wrote figures/linkage_map_A_tuberculatus_QTL.{pdf,png}\n")
