import { useMemo, useState } from 'react'
import { CircleDot } from 'lucide-react'
import {
  MapItem,
  MetaQTLItem,
  QTLItem,
  EpistaticLink,
  TRAIT_CATEGORIES,
  TRAIT_COLORS,
  TraitCategory,
  CHROMOSOME_LENGTHS,
  GENOMES,
  CURRENT_GENOME,
  GENOME_COLOR_CLASS,
  chromosomeLength,
  chromosomeSortKey,
} from '../lib/map'

interface CircosMapProps {
  items: MapItem[]
  links: EpistaticLink[]
  showQTL: boolean
  showMetaQTL: boolean
  showLinks: boolean
  selectedTraits: string[]
  search?: string
  svgRef?: React.RefObject<SVGSVGElement>
  compact?: boolean
  showLabels?: boolean
  /** Restrict the karyotype ring to one subgenome; other chromosomes drop out entirely. */
  genomeFilter?: 'all' | 'A' | 'D'
}

const SIZE = 900
const COMPACT_VIEW = 720
const CX = SIZE / 2
const CY = SIZE / 2

// Ring radii, outermost first. Both the MetaQTL and QTL bands are split into
// one thin track per trait category - matching the manuscript circos figure
// (scripts/metaqtl_circos_figure.R), which plots MetaQTL this way - rather
// than one shared ring, so a bar's/tick's radial position also encodes its
// trait, not just its colour.
const R_CHROM_OUT = 372
const R_CHROM_IN = 352
const R_HEAT_OUT = 348
const R_HEAT_IN = 336
const R_METATRACKS_OUT = 332
const R_METATRACKS_IN = 200
const R_QTLTRACKS_OUT = 196
const R_QTLTRACKS_IN = 70
const R_CHORD = 64

const GAP_DEG = 1.4
const HEAT_BINS = 60
const MAX_CHORDS = 1500

type Hover =
  | { kind: 'item'; x: number; y: number; item: MapItem }
  | { kind: 'link'; x: number; y: number; link: EpistaticLink }
  | { kind: 'chr'; x: number; y: number; chr: string; qtl: number; meta: number }

const deg2rad = (d: number) => (d * Math.PI) / 180

function polar(r: number, angleDeg: number) {
  // 0deg at 12 o'clock, increasing clockwise
  const a = deg2rad(angleDeg - 90)
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

function arcPath(r0: number, r1: number, a0: number, a1: number) {
  const largeArc = a1 - a0 > 180 ? 1 : 0
  const p0 = polar(r1, a0)
  const p1 = polar(r1, a1)
  const p2 = polar(r0, a1)
  const p3 = polar(r0, a0)
  return [
    `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
    `A ${r1} ${r1} 0 ${largeArc} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `A ${r0} ${r0} 0 ${largeArc} 0 ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

function heatColor(t: number) {
  const h = 48 - t * 48
  const l = 82 - t * 38
  return `hsl(${h}, 90%, ${l}%)`
}

const RIBBON_HALF_DEG = 0.16

// Filled ribbon band between two loci, matching circlize's circos.genomicLink
// style used in the manuscript figure (scripts/metaqtl_circos_figure.R) -
// a translucent band that bows through a shared control point, rather than a
// single hairline stroke.
function ribbonPath(a1: number, a2: number, ctrl: { x: number; y: number }) {
  const p1a = polar(R_CHORD, a1 - RIBBON_HALF_DEG)
  const p1b = polar(R_CHORD, a1 + RIBBON_HALF_DEG)
  const p2a = polar(R_CHORD, a2 - RIBBON_HALF_DEG)
  const p2b = polar(R_CHORD, a2 + RIBBON_HALF_DEG)
  return [
    `M ${p1a.x.toFixed(2)} ${p1a.y.toFixed(2)}`,
    `Q ${ctrl.x.toFixed(2)} ${ctrl.y.toFixed(2)} ${p2b.x.toFixed(2)} ${p2b.y.toFixed(2)}`,
    `L ${p2a.x.toFixed(2)} ${p2a.y.toFixed(2)}`,
    `Q ${ctrl.x.toFixed(2)} ${ctrl.y.toFixed(2)} ${p1b.x.toFixed(2)} ${p1b.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

export default function CircosMap({
  items,
  links,
  showQTL,
  showMetaQTL,
  showLinks,
  selectedTraits,
  search = '',
  svgRef,
  compact = false,
  showLabels = true,
  genomeFilter = 'all',
}: CircosMapProps) {
  const [hover, setHover] = useState<Hover | null>(null)
  const [interOnly, setInterOnly] = useState(false)

  // Full wheat karyotype by default, but a subgenome filter drops the other
  // chromosomes out of the ring entirely (rather than leaving empty arcs),
  // so the remaining 7 chromosomes re-fill the circle proportionally.
  const chromosomes = useMemo(() => {
    const all = Object.keys(CHROMOSOME_LENGTHS).sort((a, b) => chromosomeSortKey(a) - chromosomeSortKey(b))
    return genomeFilter === 'all' ? all : all.filter((c) => c.startsWith(genomeFilter))
  }, [genomeFilter])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((item) => {
      if (item.type === 'qtl' && !showQTL) return false
      if (item.type === 'metaqtl' && !showMetaQTL) return false
      if (selectedTraits.length > 0 && !selectedTraits.includes(item.trait)) return false
      if (q) {
        const hay = `${item.name} ${item.trait} ${item.raw.parameter || ''} ${item.raw.candidate_gene || ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, showQTL, showMetaQTL, selectedTraits, search])

  const filteredLinks = useMemo(() => {
    if (!showLinks) return []
    const valid = links.filter((l) => {
      if (selectedTraits.length > 0 && !selectedTraits.includes(l.trait)) return false
      if (interOnly && l.chromosome1 === l.chromosome2) return false
      return chromosomes.includes(l.chromosome1) && chromosomes.includes(l.chromosome2)
    })
    return valid.slice(0, MAX_CHORDS)
  }, [links, showLinks, selectedTraits, chromosomes, interOnly])

  // Angular layout: each chromosome gets a slice proportional to its length
  const layout = useMemo(() => {
    const total = chromosomes.reduce((s, c) => s + chromosomeLength(c), 0)
    const usable = 360 - GAP_DEG * chromosomes.length
    const map = new Map<string, { start: number; end: number }>()
    let cursor = 0
    chromosomes.forEach((chr) => {
      const span = (chromosomeLength(chr) / total) * usable
      map.set(chr, { start: cursor, end: cursor + span })
      cursor += span + GAP_DEG
    })
    return map
  }, [chromosomes])

  const angleFor = (chr: string, pos: number) => {
    const slice = layout.get(chr)
    if (!slice) return 0
    const len = chromosomeLength(chr)
    const ratio = Math.max(0, Math.min(pos / len, 1))
    return slice.start + ratio * (slice.end - slice.start)
  }

  // QTL density per chromosome bin, for the heatmap ring
  const heat = useMemo(() => {
    const byChr = new Map<string, number[]>()
    chromosomes.forEach((chr) => byChr.set(chr, Array(HEAT_BINS).fill(0)))
    filtered.forEach((item) => {
      if (item.type !== 'qtl') return
      const bins = byChr.get(item.chromosome)
      if (!bins) return
      const len = chromosomeLength(item.chromosome)
      const b = Math.min(Math.floor((item.point / len) * HEAT_BINS), HEAT_BINS - 1)
      bins[Math.max(0, b)]++
    })
    let max = 1
    byChr.forEach((bins) => bins.forEach((c) => (max = Math.max(max, c))))
    return { byChr, max }
  }, [filtered, chromosomes])


  const qtlCount = filtered.filter((i) => i.type === 'qtl').length
  const metaCount = filtered.filter((i) => i.type === 'metaqtl').length

  if (chromosomes.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <CircleDot className="h-10 w-10 text-wheat-400 dark:text-wheat-500" />
        <p className="mt-3 text-wheat-700 dark:text-wheat-300">No QTLs or regions match the current filters.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="card overflow-hidden">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <CircleDot className="h-5 w-5 text-wheat-600 dark:text-wheat-400" />
            <h3 className="text-lg font-semibold text-wheat-900 dark:text-wheat-50">Circos genome view</h3>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-sm text-wheat-700 dark:text-wheat-300">
              <span className="font-semibold text-wheat-900 dark:text-wheat-50">{qtlCount.toLocaleString()}</span> loci ·{' '}
              <span className="font-semibold text-wheat-900 dark:text-wheat-50">{metaCount.toLocaleString()}</span> meta-QTL
              {links.length > MAX_CHORDS && showLinks && (
                <span className="ml-2 text-xs text-amber-600">(capped at {MAX_CHORDS.toLocaleString()})</span>
              )}
            </div>
            {showLinks && (
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-wheat-600"
                  checked={interOnly}
                  onChange={(e) => setInterOnly(e.target.checked)}
                />
                <span className="text-wheat-700 dark:text-wheat-300">Inter-chromosomal only</span>
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <svg
            ref={svgRef}
            width={compact ? COMPACT_VIEW : SIZE}
            height={compact ? COMPACT_VIEW : SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="max-w-full"
          >
            <defs>
              <filter id="circosGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Epistatic chords, drawn first so rings sit on top */}
            <g>
              {filteredLinks.map((l) => {
                const a1 = angleFor(l.chromosome1, l.point1)
                const a2 = angleFor(l.chromosome2, l.point2)
                // Control radius runs from the rim (adjacent loci) to the centre
                // (diametrically opposed loci), so chords bow proportionally.
                let sep = Math.abs(a2 - a1)
                if (sep > 180) sep = 360 - sep
                const ctrlR = R_CHORD * (1 - sep / 180)
                // Midpoint angle must follow the shorter way around the circle
                let midAngle = (a1 + a2) / 2
                if (Math.abs(a2 - a1) > 180) midAngle = (midAngle + 180) % 360
                const ctrl = polar(ctrlR, midAngle)
                const color = TRAIT_COLORS[l.trait as TraitCategory] ?? '#9e9e9e'
                const isHovered = hover?.kind === 'link' && hover.link.id === l.id
                return (
                  <path
                    key={l.id}
                    d={ribbonPath(a1, a2, ctrl)}
                    fill={color}
                    fillOpacity={isHovered ? 0.85 : 0.32}
                    stroke={color}
                    strokeOpacity={isHovered ? 0.9 : 0.4}
                    strokeWidth={0.4}
                    className="cursor-pointer"
                    onMouseEnter={(e) => setHover({ kind: 'link', x: e.clientX, y: e.clientY, link: l })}
                    onMouseMove={(e) => setHover({ kind: 'link', x: e.clientX, y: e.clientY, link: l })}
                    onMouseLeave={() => setHover(null)}
                  />
                )
              })}
            </g>

            {/* QTL ticks, one thin track per trait category */}
            {showQTL && (
              <g>
                {TRAIT_CATEGORIES.map((trait) => {
                  const trackH = (R_QTLTRACKS_OUT - R_QTLTRACKS_IN) / TRAIT_CATEGORIES.length
                  const idx = TRAIT_CATEGORIES.indexOf(trait)
                  const r1 = R_QTLTRACKS_OUT - idx * trackH
                  const r0 = r1 - trackH * 0.8
                  return (
                    <g key={trait}>
                      {chromosomes.map((chr) => {
                        const slice = layout.get(chr)!
                        return (
                          <path
                            key={chr}
                            d={arcPath(r0, r1, slice.start, slice.end)}
                            fill="currentColor"
                            className="text-wheat-50 dark:text-ink-700"
                          />
                        )
                      })}
                    </g>
                  )
                })}
                {filtered
                  .filter((i): i is QTLItem => i.type === 'qtl')
                  .map((q) => {
                    const a = angleFor(q.chromosome, q.point)
                    const trackH = (R_QTLTRACKS_OUT - R_QTLTRACKS_IN) / TRAIT_CATEGORIES.length
                    const idx = TRAIT_CATEGORIES.indexOf(q.trait as TraitCategory)
                    const r1 = R_QTLTRACKS_OUT - idx * trackH
                    const r0 = r1 - trackH * 0.8
                    const p0 = polar(r0, a)
                    const p1 = polar(r1, a)
                    const color = TRAIT_COLORS[q.trait as TraitCategory] ?? '#9e9e9e'
                    return (
                      <line
                        key={q.id}
                        x1={p0.x}
                        y1={p0.y}
                        x2={p1.x}
                        y2={p1.y}
                        stroke={color}
                        strokeWidth={1.1}
                        strokeOpacity={0.75}
                        className="cursor-pointer"
                        onMouseEnter={(e) => setHover({ kind: 'item', x: e.clientX, y: e.clientY, item: q })}
                        onMouseMove={(e) => setHover({ kind: 'item', x: e.clientX, y: e.clientY, item: q })}
                        onMouseLeave={() => setHover(null)}
                      />
                    )
                  })}
              </g>
            )}

            {/* MetaQTL interval bars, one thin track per trait category (mirrors
                the manuscript circos figure, which plots MetaQTL this way) */}
            {showMetaQTL && (
              <g>
                {TRAIT_CATEGORIES.map((trait) => {
                  const trackH = (R_METATRACKS_OUT - R_METATRACKS_IN) / TRAIT_CATEGORIES.length
                  const idx = TRAIT_CATEGORIES.indexOf(trait)
                  const r1 = R_METATRACKS_OUT - idx * trackH
                  const r0 = r1 - trackH * 0.8
                  return (
                    <g key={trait}>
                      {chromosomes.map((chr) => {
                        const slice = layout.get(chr)!
                        return (
                          <path
                            key={chr}
                            d={arcPath(r0, r1, slice.start, slice.end)}
                            fill="currentColor"
                            className="text-wheat-50 dark:text-ink-700"
                          />
                        )
                      })}
                    </g>
                  )
                })}
                {filtered
                  .filter((i): i is MetaQTLItem => i.type === 'metaqtl')
                  .map((m) => {
                    const trackH = (R_METATRACKS_OUT - R_METATRACKS_IN) / TRAIT_CATEGORIES.length
                    const idx = TRAIT_CATEGORIES.indexOf(m.trait as TraitCategory)
                    const r1 = R_METATRACKS_OUT - idx * trackH
                    const r0 = r1 - trackH * 0.8
                    const a0 = angleFor(m.chromosome, Math.min(m.start, m.end))
                    const a1 = angleFor(m.chromosome, Math.max(m.start, m.end))
                    const color = TRAIT_COLORS[m.trait as TraitCategory] ?? '#9e9e9e'
                    // Point-like (or very narrow) intervals need a small visible
                    // width, but as a fraction of THIS chromosome's own angular
                    // span (mirroring the ~0.5%-of-chromosome-length pad in the
                    // manuscript R figure) rather than a fixed absolute degree
                    // value - a flat constant is a large fraction of a short
                    // chromosome's span and a tiny sliver of a long one, which
                    // is what made every MetaQTL render as a long bar instead
                    // of a small scatter-like mark.
                    const slice = layout.get(m.chromosome)!
                    const minWidth = (slice.end - slice.start) * 0.004
                    return (
                      <path
                        key={m.id}
                        d={arcPath(r0, r1, a0, Math.max(a1, a0 + minWidth))}
                        fill={color}
                        fillOpacity={0.85}
                        stroke={color}
                        strokeWidth={0.5}
                        className="cursor-pointer"
                        onMouseEnter={(e) => setHover({ kind: 'item', x: e.clientX, y: e.clientY, item: m })}
                        onMouseMove={(e) => setHover({ kind: 'item', x: e.clientX, y: e.clientY, item: m })}
                        onMouseLeave={() => setHover(null)}
                      />
                    )
                  })}
              </g>
            )}

            {/* QTL density heat ring */}
            {showQTL && (
            <g>
              {chromosomes.map((chr) => {
                const bins = heat.byChr.get(chr) ?? []
                const slice = layout.get(chr)!
                const step = (slice.end - slice.start) / HEAT_BINS
                return bins.map((count, i) => (
                  <path
                    key={`${chr}-h-${i}`}
                    d={arcPath(R_HEAT_IN, R_HEAT_OUT, slice.start + i * step, slice.start + (i + 1) * step + 0.02)}
                    fill={heatColor(count / heat.max)}
                    stroke="none"
                  />
                ))
              })}
            </g>
            )}

            {/* Chromosome arcs + labels */}
            <g>
              {chromosomes.map((chr) => {
                const slice = layout.get(chr)!
                const mid = (slice.start + slice.end) / 2
                const label = polar(R_CHROM_OUT + 22, mid)
                const chrQtl = filtered.filter((i) => i.chromosome === chr && i.type === 'qtl').length
                const chrMeta = filtered.filter((i) => i.chromosome === chr && i.type === 'metaqtl').length
                return (
                  <g key={chr}>
                    <path
                      d={arcPath(R_CHROM_IN, R_CHROM_OUT, slice.start, slice.end)}
                      fill="currentColor"
                      className={`cursor-pointer ${GENOME_COLOR_CLASS[chr.slice(0, 1)] ?? 'text-wheat-200 dark:text-wheat-700'}`}
                      stroke="currentColor"
                      strokeWidth={0.75}
                      filter="url(#circosGlow)"
                      onMouseEnter={(e) =>
                        setHover({ kind: 'chr', x: e.clientX, y: e.clientY, chr, qtl: chrQtl, meta: chrMeta })
                      }
                      onMouseMove={(e) =>
                        setHover({ kind: 'chr', x: e.clientX, y: e.clientY, chr, qtl: chrQtl, meta: chrMeta })
                      }
                      onMouseLeave={() => setHover(null)}
                    />
                    {showLabels && (
                      <text
                        x={label.x}
                        y={label.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none fill-current text-[13px] font-bold"
                      >
                        {chr}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>

            {/* Centre caption */}
            <text
              x={CX}
              y={CY - 8}
              textAnchor="middle"
              className="pointer-events-none fill-current text-[15px] font-semibold opacity-80"
            >
              AmaranthQTLdb
            </text>
            <text
              x={CX}
              y={CY + 14}
              textAnchor="middle"
              className="pointer-events-none fill-current text-[11px] opacity-55"
            >
              {chromosomes.length} chromosomes · {GENOMES[CURRENT_GENOME]?.assembly}
            </text>
          </svg>
        </div>

        {/* Ring legend */}
        <div className="mt-4 grid gap-4 border-t border-wheat-200 dark:border-ink-700 pt-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-wheat-800 dark:text-wheat-100">Ring 1 — Chromosomes</p>
            <p className="text-wheat-600 dark:text-wheat-400">Arc length is proportional to physical length on the selected assembly.</p>
          </div>
          <div>
            <p className="font-semibold text-wheat-800 dark:text-wheat-100">Ring 2 — QTL density</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-3 w-24 rounded bg-gradient-to-r from-[hsl(48,90%,82%)] via-[hsl(24,90%,65%)] to-[hsl(0,90%,44%)]" />
              <span className="text-wheat-600 dark:text-wheat-400">low → high</span>
            </div>
          </div>
          <div>
            <p className="font-semibold text-wheat-800 dark:text-wheat-100">Meta-QTL tracks</p>
            <p className="text-wheat-600 dark:text-wheat-400">One thin ring per trait category; bars are meta-QTL 95% intervals (grain amaranth).</p>
          </div>
          <div>
            <p className="font-semibold text-wheat-800 dark:text-wheat-100">QTL tracks</p>
            <p className="text-wheat-600 dark:text-wheat-400">One thin ring per trait category, same order as the legend below.</p>
          </div>
        </div>

        {/* Trait legend */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-wheat-200 dark:border-ink-700 pt-4">
          {TRAIT_CATEGORIES.map((trait) => {
            const active = selectedTraits.length === 0 || selectedTraits.includes(trait)
            return (
              <div
                key={trait}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition ${
                  active
                    ? 'border-wheat-200 dark:border-ink-700 bg-wheat-50 dark:bg-ink-800 text-wheat-800 dark:text-wheat-100'
                    :'border-transparent bg-wheat-100 dark:bg-ink-700 text-wheat-400 dark:text-wheat-500 opacity-60'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TRAIT_COLORS[trait] }} />
                <span className="max-w-[10rem] truncate">{trait}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tooltip */}
      {hover && (
        <div
          className="fixed z-50 max-w-xs rounded border border-wheat-200 dark:border-ink-700 bg-wheat-50 dark:bg-ink-800 p-3 text-xs shadow-xl"
          style={{ left: hover.x + 14, top: hover.y + 14 }}
        >
          {hover.kind === 'chr' && (
            <>
              <div className="mb-1 font-semibold text-wheat-900 dark:text-wheat-50">Chromosome {hover.chr}</div>
              <div className="text-wheat-700 dark:text-wheat-300">
                <div>{(chromosomeLength(hover.chr) / 1_000_000).toFixed(1)} Mb</div>
                <div>{hover.qtl.toLocaleString()} QTLs · {hover.meta.toLocaleString()} regions</div>
              </div>
            </>
          )}
          {hover.kind === 'item' && (
            <>
              <div
                className="mb-2 rounded-md px-2 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: TRAIT_COLORS[hover.item.trait as TraitCategory] }}
              >
                {hover.item.type === 'qtl' ? 'QTL' : 'Region'} · {hover.item.name}
              </div>
              <div className="space-y-0.5 text-wheat-700 dark:text-wheat-300">
                <div><span className="font-medium">Chromosome:</span> {hover.item.chromosome}</div>
                <div><span className="font-medium">Trait:</span> {hover.item.trait}</div>
                <div><span className="font-medium">Position:</span> {(hover.item.point / 1_000_000).toFixed(2)} Mb</div>
                {hover.item.raw.pve && <div><span className="font-medium">PVE / R²:</span> {hover.item.raw.pve}</div>}
              </div>
            </>
          )}
          {hover.kind === 'link' && (
            <>
              <div
                className="mb-2 rounded-md px-2 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: TRAIT_COLORS[hover.link.trait as TraitCategory] }}
              >
                Epistatic · {hover.link.name}
              </div>
              <div className="space-y-0.5 text-wheat-700 dark:text-wheat-300">
                <div>
                  <span className="font-medium">Locus 1:</span> {hover.link.chromosome1} @ {(hover.link.point1 / 1_000_000).toFixed(2)} Mb
                </div>
                <div>
                  <span className="font-medium">Locus 2:</span> {hover.link.chromosome2} @ {(hover.link.point2 / 1_000_000).toFixed(2)} Mb
                </div>
                <div><span className="font-medium">Trait:</span> {hover.link.trait}</div>
                {hover.link.raw.lod && <div><span className="font-medium">LOD:</span> {hover.link.raw.lod}</div>}
                {hover.link.raw.pve && <div><span className="font-medium">PVE:</span> {hover.link.raw.pve}</div>}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
