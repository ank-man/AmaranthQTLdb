#!/usr/bin/env Rscript
# Per-species figures on each species' current assembly, using the converted coordinates of
# scripts/liftover.py (data/curated/coordinates_lifted.csv) and real chromosome lengths
# (data/curated/chromosome_lengths.csv):
#   figures/species/<slug>_karyotype.{svg,png,pdf}   RIdeogram: locus density heatmap + QTL / GWAS / meta-QTL markers
#   figures/species/<slug>_circos.{png,pdf}          circlize: density, one track per trait group, meta-QTL, clusters
#   figures/species/summary_loci_by_species.{png,pdf} loci per species x trait category
# A. tricolor and the multi-species panels were genotyped against the A. hypochondriacus reference by
# their authors, so they are drawn on A. hypochondriacus v3.
# Usage: Rscript scripts/plots_species.R

suppressPackageStartupMessages({ library(data.table); library(RIdeogram); library(circlize); library(ggplot2) })
dir.create("figures/species", recursive = TRUE, showWarnings = FALSE)
loci <- fread("data/curated/loci.csv", colClasses = "character")
lift <- fread("data/curated/coordinates_lifted.csv", colClasses = "character")
lens <- fread("data/curated/chromosome_lengths.csv")
mq   <- fread("data/curated/meta_qtl.csv", colClasses = "character")
cl   <- fread("data/curated/qtl_clusters.csv", colClasses = "character")

GROUP <- function(trait, cat) fcase(
  grepl("Heading|Anthesis|flowering|Flowering", trait), "Flowering time",
  trait == "Seed coat color", "Seed coat color",
  cat == "Pigmentation", "Betalain pigmentation",
  cat == "Plant architecture", "Plant architecture",
  cat == "Seed protein", "Seed protein",
  cat == "Seed minerals", "Seed minerals",
  cat == "Herbicide resistance", "Herbicide resistance",
  cat == "Sex determination", "Sex determination",
  default = "Other")
COL <- c("Flowering time" = "#0072B2", "Betalain pigmentation" = "#CC79A7", "Seed coat color" = "#8C510A",
         "Plant architecture" = "#009E73", "Seed protein" = "#E69F00", "Seed minerals" = "#56B4E9",
         "Herbicide resistance" = "#D55E00", "Sex determination" = "#882255", "Other" = "#8A8A93")

SPECIES <- list(
  list(slug = "A_hypochondriacus", label = "Amaranthus hypochondriacus", asm = "Ahyp_v3", lens = "Ahyp_v3",
       pick = function(d) d$species == "Amaranthus hypochondriacus"),
  list(slug = "A_tricolor", label = "Amaranthus tricolor", asm = "Ahyp_v3", lens = "Ahyp_v3",
       pick = function(d) d$species == "Amaranthus tricolor"),
  list(slug = "Amaranthus_spp_panels", label = "Amaranthus spp. (multi-species panels and interspecific crosses)", asm = "Ahyp_v3", lens = "Ahyp_v3",
       pick = function(d) grepl("spp\\.|quitensis", d$species)),
  list(slug = "A_tuberculatus", label = "Amaranthus tuberculatus (waterhemp)", asm = "Atub_hap1", lens = "Atub_hap1",
       pick = function(d) d$species == "Amaranthus tuberculatus"),
  list(slug = "A_palmeri", label = "Amaranthus palmeri (Palmer amaranth)", asm = "Apal_hap1", lens = "Apal_hap1",
       pick = function(d) d$species == "Amaranthus palmeri"))

num <- function(x) suppressWarnings(as.numeric(x))
asm_label <- c(Ahyp_v3 = "A. hypochondriacus v3 (GCA_977020195.1)", Atub_hap1 = "A. tuberculatus hap1 (GCA_054443085.1)",
               Apal_hap1 = "A. palmeri hap1 (GCA_051800445.1)")

placed <- function(sp) {
  d <- loci[sp$pick(loci)]
  l <- lift[target_assembly == sp$asm & grepl("^ok|^partial", status) & target_chromosome != ""]
  d <- merge(d, l[, .(locus_id, target_chromosome, target_start, target_end, target_peak)], by = "locus_id")
  d[, `:=`(s = num(target_start), e = num(target_end), p = num(target_peak))]
  d[, pos := fifelse(!is.na(p), p, fifelse(!is.na(s) & !is.na(e), (s + e) / 2, fifelse(!is.na(s), s, e)))]
  d[is.na(s), s := pos][is.na(e), e := pos]
  d[, group := GROUP(trait, trait_category)]
  d[, weak := grepl("0.001 < P", method, fixed = TRUE)]
  d[, chr := paste0("Chr", target_chromosome)]
  d[!is.na(pos)]
}

summ <- list()
for (sp in SPECIES) {
  d <- placed(sp)
  allsp <- loci[sp$pick(loci)]
  summ[[sp$slug]] <- allsp[, .N, by = .(trait_category)][, species := sp$label]
  if (!nrow(d)) { cat("no placed loci for", sp$label, "\n"); next }
  L <- lens[assembly_key == sp$lens][order(as.integer(chromosome))]
  kary <- data.frame(Chr = paste0("Chr", L$chromosome), Start = 0, End = L$length_bp)
  # --- RIdeogram ---
  win <- 1e6
  dens <- rbindlist(lapply(seq_len(nrow(kary)), function(i) {
    br <- seq(0, kary$End[i] + win, by = win)
    x <- d[chr == kary$Chr[i] & weak == FALSE, pos]
    data.table(Chr = kary$Chr[i], Start = head(br, -1), End = tail(br, -1) - 1,
               Value = as.integer(table(cut(x, br, right = FALSE))))
  }))
  if (max(dens$Value) == 0) dens$Value[1] <- 0
  mk <- d[weak == FALSE, .(Type = group, Shape = ifelse(record_type %in% c("QTL", "Mendelian locus", "Sex-linked region"), "box", "circle"),
                           Chr = chr, Start = round(pos), End = round(pos) + 1, color = sub("#", "", COL[group]))]
  if (sp$asm == "Ahyp_v3" && "v3_position_bp" %in% names(mq) && sp$slug == "A_hypochondriacus") {
    m3 <- mq[v3_position_bp != ""]
    if (nrow(m3)) mk <- rbind(mk, m3[, .(Type = "Meta-QTL", Shape = "triangle", Chr = paste0("Chr", v3_chromosome),
                                         Start = num(v3_position_bp), End = num(v3_position_bp) + 1, color = "111111")])
  }
  mk <- unique(mk)
  old <- setwd("figures/species")
  f <- paste0(sp$slug, "_karyotype")
  ideogram(karyotype = kary, overlaid = as.data.frame(dens), label = as.data.frame(mk), label_type = "marker",
           colorset1 = c("#f7f7f7", "#bdbdbd", "#252525"), width = 170, Lx = 80, Ly = 25, output = paste0(f, ".svg"))
  convertSVG(paste0(f, ".svg"), file = f, device = "png", dpi = 600)
  convertSVG(paste0(f, ".svg"), file = f, device = "pdf")
  setwd(old)
  # --- Circos ---
  groups <- names(COL)[names(COL) %in% unique(d$group)]
  draw <- function() {
    circos.clear()
    circos.par(start.degree = 90, gap.after = c(rep(1.2, nrow(kary) - 1), 8), cell.padding = c(0, 0, 0, 0),
               track.margin = c(0.004, 0.004))
    circos.genomicInitialize(kary, plotType = NULL)
    circos.track(ylim = c(0, 1), track.height = 0.05, bg.border = NA, panel.fun = function(x, y) {
      circos.rect(CELL_META$xlim[1], 0, CELL_META$xlim[2], 1, col = "#D9D9DE", border = "#8A8A93", lwd = 0.5)
      circos.text(CELL_META$xcenter, 2.4, sub("Chr", "", CELL_META$sector.index), cex = 0.62, facing = "inside", niceFacing = TRUE)
      circos.axis(h = "top", major.at = seq(0, CELL_META$xlim[2], by = 10e6), labels = NULL, major.tick.length = 0.4, minor.ticks = 0, lwd = 0.4)
    })
    dd <- as.data.frame(dens)
    circos.genomicTrack(dd, ylim = c(0, max(1, dd$Value)), track.height = 0.08, bg.border = NA,
      panel.fun = function(region, value, ...) circos.genomicRect(region, value, ytop.column = 1, ybottom = 0, col = "#4D4D57", border = NA))
    for (g in groups) {
      dg <- d[group == g]
      circos.track(ylim = c(0, 1), track.height = max(0.035, 0.27 / length(groups)), bg.border = "#ECECF0", bg.lwd = 0.3, bg.col = "#FBFBFC",
        panel.fun = function(x, y) {
          sub <- dg[chr == CELL_META$sector.index]
          iv <- sub[e > s + 1]
          if (nrow(iv)) circos.rect(iv$s, 0.2, iv$e, 0.8, col = adjustcolor(COL[g], 0.85), border = NA)
          pt <- sub[!(e > s + 1)]
          if (nrow(pt)) circos.points(pt$pos, rep(0.5, nrow(pt)), pch = 16, cex = ifelse(pt$weak, 0.22, 0.34),
                                      col = ifelse(pt$weak, adjustcolor(COL[g], 0.45), COL[g]))
        })
    }
    if (sp$slug == "A_hypochondriacus") {
      m3 <- mq[v3_position_bp != ""]
      circos.track(ylim = c(0, 1), track.height = 0.05, bg.border = NA, panel.fun = function(x, y) {
        m1 <- m3[paste0("Chr", v3_chromosome) == CELL_META$sector.index]
        if (nrow(m1)) {
          circos.rect(num(m1$v3_ci_start_bp), 0, num(m1$v3_ci_end_bp), 1, col = "#111111", border = NA)
          circos.text(num(m1$v3_position_bp), -1.2, sub("MQTL-", "", m1$meta_qtl), cex = 0.45, facing = "clockwise", niceFacing = TRUE, adj = c(1, 0.5))
        }
      })
    }
    text(0, 0.03, sp$label, cex = 0.7, font = 3)
    text(0, -0.06, asm_label[sp$asm], cex = 0.5, col = "#55555C")
    leg <- c("Locus density (1 Mb)", groups, if (sp$slug == "A_hypochondriacus") "Meta-QTL (95% CI)")
    legend(x = 1.12, y = 0.55, bty = "n", cex = 0.7, xjust = 0, legend = leg,
           fill = c("#4D4D57", COL[groups], if (sp$slug == "A_hypochondriacus") "#111111"), border = NA,
           title = "Tracks, outside to inside", title.adj = 0)
    circos.clear()
  }
  png(sprintf("figures/species/%s_circos.png", sp$slug), width = 9.4, height = 7.2, units = "in", res = 600, bg = "white")
  par(mar = c(0.3, 0.3, 0.3, 15), xpd = NA); draw(); invisible(dev.off())
  pdf(sprintf("figures/species/%s_circos.pdf", sp$slug), width = 9.4, height = 7.2)
  par(mar = c(0.3, 0.3, 0.3, 15), xpd = NA); draw(); invisible(dev.off())
  cat(sprintf("%-32s %3d of %3d loci placed on %s\n", sp$slug, nrow(d), nrow(allsp), sp$asm))
}

# --- summary: loci per species x trait category ---
s <- rbindlist(summ)
s[, species := factor(species, levels = rev(unique(species)))]
CAT <- c("Phenology" = "#0072B2", "Pigmentation" = "#CC79A7", "Plant architecture" = "#009E73", "Seed protein" = "#E69F00",
         "Seed minerals" = "#56B4E9", "Herbicide resistance" = "#D55E00", "Sex determination" = "#882255")
p <- ggplot(s, aes(N, species, fill = trait_category)) +
  geom_col(width = 0.62, colour = "white", linewidth = 0.4) +
  scale_fill_manual(values = CAT, name = NULL) + guides(fill = guide_legend(nrow = 2)) +
  labs(x = "Mapped loci", y = NULL, title = "Amaranthus QTL and GWAS loci by species and trait category") +
  theme_minimal(base_size = 9) +
  theme(panel.grid.major.y = element_blank(), legend.position = "bottom", plot.title.position = "plot",
        axis.text.y = element_text(face = "italic"))
ggsave("figures/species/summary_loci_by_species.png", p, width = 8.2, height = 3.6, dpi = 600, bg = "white")
ggsave("figures/species/summary_loci_by_species.pdf", p, width = 8.2, height = 3.6)
cat("wrote figures/species/\n")
