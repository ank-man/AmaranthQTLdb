import { useMemo, useRef, useState } from 'react'
import { MapIcon } from 'lucide-react'
import {
  MapItem,
  MetaQTLItem,
  QTLItem,
  TraitCategory,
  TRAIT_COLORS,
  TRAIT_CATEGORIES,
  CHROMOSOME_LENGTHS,
  GENOME_COLOR_CLASS,
  chromosomeLength,
  chromosomeSortKey,
  genomeOf,
} from '../lib/map'

interface IdeogramMapProps {
  items: MapItem[]
  showQTL: boolean
  showMetaQTL: boolean
  selectedTraits: string[]
  search?: string
  svgRef?: React.RefObject<SVGSVGElement>
  compact?: boolean
  showLabels?: boolean
  /** Show mqtl_name text beside MetaQTL brackets, thinning them out to avoid overlap. */
  showItemLabels?: boolean
  /** Restrict the chromosome skeleton to one subgenome. */
  genomeFilter?: 'all' | 'A' | 'D'
  /** Colour bars by subgenome (A/B/D); off falls back to a neutral wheat tone. */
  genomeColor?: boolean
}

const MARGIN = { top: 24, right: 90, bottom: 40, left: 48 }
const COMPACT_MARGIN = { top: 18, right: 70, bottom: 32, left: 38 }
const CHROM_WIDTH = 30
const COMPACT_CHROM_WIDTH = 22
// Relative scale: the longest chromosome in view is always exactly this
// tall; every other bar is sized proportionally to it (not an absolute
// px-per-Mb), so the figure has a fixed, bounded height.
const MAX_BAR_HEIGHT = 1300
const COMPACT_MAX_BAR_HEIGHT = 920
// MapChart-style side lanes: a QTL density strip immediately right of the
// bar, then a stack of MetaQTL interval brackets further out - both beside
// the chromosome rather than drawn on top of it, so the karyotype colour
// stays legible underneath.
const QTL_LANE = 52
const COMPACT_QTL_LANE = 38
const META_LANE_WIDTH = 13
const COMPACT_META_LANE_WIDTH = 10
const MAX_META_LANES = 4
const QTL_BINS = 60
// Minimum vertical gap (px, in unscaled viewBox units) between two labels in
// the same column - "space aware": a label is only drawn when it won't
// collide with the previous one, rather than printing every name.
const MIN_LABEL_GAP = 13
// Reserved horizontal room for the name-label text column. Only added to the
// column spacing when labels are actually on, so inter-chromosome distance
// adapts to whether labels need the space instead of always paying for it.
const LABEL_WIDTH = 78
const COMPACT_LABEL_WIDTH = 58
const COL_GAP = 56 + QTL_LANE + META_LANE_WIDTH * MAX_META_LANES
const COMPACT_COL_GAP = 40 + COMPACT_QTL_LANE + COMPACT_META_LANE_WIDTH * MAX_META_LANES
// Scale ruler ticks, every N Mb.
const SCALE_STEP_MB = 100

type Hover =
  | { kind: 'item'; x: number; y: number; item: MapItem }
  | { kind: 'chr'; x: number; y: number; chr: string }

export default function IdeogramMap({
  items,
  showQTL,
  showMetaQTL,
  selectedTraits,
  search = '',
  svgRef,
  compact = false,
  showLabels = true,
  showItemLabels = false,
  genomeFilter = 'all',
  genomeColor = true,
}: IdeogramMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<Hover | null>(null)

  // Full wheat chromosome skeleton by default; a subgenome filter drops the
  // other chromosomes out entirely instead of leaving empty columns. All
  // chromosomes are plotted in a single row, side by side.
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

  // QTLs are far too numerous per chromosome (thousands) to draw as individual
  // marks legibly, so bin them along the physical length and draw a density
  // strip instead - bar length is proportional to local count, colour is the
  // bin's dominant trait.
  const qtlDensity = useMemo(() => {
    const byChr = new Map<string, { count: number; traits: Map<string, number>; only: QTLItem | null }[]>()
    chromosomes.forEach((c) =>
      byChr.set(c, Array.from({ length: QTL_BINS }, () => ({ count: 0, traits: new Map<string, number>(), only: null })))
    )
    filtered.forEach((item) => {
      if (item.type !== 'qtl') return
      const bins = byChr.get(item.chromosome)
      if (!bins) return
      const len = chromosomeLength(item.chromosome)
      const idx = Math.min(QTL_BINS - 1, Math.max(0, Math.floor((item.point / len) * QTL_BINS)))
      const bin = bins[idx]
      bin.count++
      bin.traits.set(item.trait, (bin.traits.get(item.trait) ?? 0) + 1)
      // Only worth a name label when the bin resolves to exactly one QTL -
      // once a second lands here there's no single name left to print.
      bin.only = bin.count === 1 ? item : null
    })
    let max = 1
    byChr.forEach((bins) => bins.forEach((b) => { if (b.count > max) max = b.count }))
    return { byChr, max }
  }, [filtered, chromosomes])

  const dominantTrait = (traits: Map<string, number>): string => {
    let best = ''
    let bestCount = -1
    traits.forEach((c, t) => { if (c > bestCount) { bestCount = c; best = t } })
    return best
  }

  // Stack overlapping MetaQTL intervals into side-by-side bracket lanes, per
  // chromosome, so overlapping intervals don't collide.
  const metaLanes = useMemo(() => {
    const lanes = new Map<string, number>()
    const lastEndByChrLane = new Map<string, number[]>()
    filtered
      .filter((i): i is MetaQTLItem => i.type === 'metaqtl')
      .slice()
      .sort((a, b) => a.start - b.start)
      .forEach((m) => {
        const ends = lastEndByChrLane.get(m.chromosome) ?? []
        let lane = ends.findIndex((end) => m.start >= end)
        if (lane === -1) {
          lane = ends.length
          ends.push(0)
        }
        ends[lane] = m.end
        lastEndByChrLane.set(m.chromosome, ends)
        lanes.set(m.id, Math.min(lane, MAX_META_LANES - 1))
      })
    return lanes
  }, [filtered])

  const margin = compact ? COMPACT_MARGIN : MARGIN
  const chromWidth = compact ? COMPACT_CHROM_WIDTH : CHROM_WIDTH
  const labelWidth = showItemLabels ? (compact ? COMPACT_LABEL_WIDTH : LABEL_WIDTH) : 0
  const colGap = (compact ? COMPACT_COL_GAP : COL_GAP) + labelWidth
  const maxBarHeight = compact ? COMPACT_MAX_BAR_HEIGHT : MAX_BAR_HEIGHT
  const qtlLane = compact ? COMPACT_QTL_LANE : QTL_LANE
  const metaLaneWidth = compact ? COMPACT_META_LANE_WIDTH : META_LANE_WIDTH

  const pxPerMb = useMemo(() => {
    const longestMb = Math.max(...chromosomes.map((c) => chromosomeLength(c) / 1_000_000))
    return maxBarHeight / longestMb
  }, [chromosomes, maxBarHeight])

  const svgWidth = margin.left + chromosomes.length * colGap + margin.right
  const svgHeight = margin.top + maxBarHeight + margin.bottom

  const yFor = (chr: string, value: number) => {
    const len = chromosomeLength(chr)
    const h = (len / 1_000_000) * pxPerMb
    const ratio = Math.max(0, Math.min(1, value / len))
    return h - ratio * h
  }

  const qtlCount = filtered.filter((i) => i.type === 'qtl').length
  const metaCount = filtered.filter((i) => i.type === 'metaqtl').length

  if (chromosomes.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <MapIcon className="h-10 w-10 text-wheat-400 dark:text-wheat-500" />
        <p className="mt-3 text-wheat-700 dark:text-wheat-300">No chromosomes match the current genome filter.</p>
      </div>
    )
  }

  const scaleTicks = []
  for (let mb = 0; mb <= 900; mb += SCALE_STEP_MB) scaleTicks.push(mb)

  return (
    <div className="card overflow-hidden">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-wheat-600 dark:text-wheat-400" />
          <h3 className="text-lg font-semibold text-wheat-900 dark:text-wheat-50">Ideogram view</h3>
          <span className="text-sm text-wheat-600 dark:text-wheat-400">
            — {chromosomes.length} chromosome{chromosomes.length === 1 ? '' : 's'}, drawn to scale
          </span>
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <div className="text-sm text-wheat-700 dark:text-wheat-300">
            <span className="font-semibold text-wheat-900 dark:text-wheat-50">{qtlCount.toLocaleString()}</span> loci ·{' '}
            <span className="font-semibold text-wheat-900 dark:text-wheat-50">{metaCount.toLocaleString()}</span> meta-QTL
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] lg:justify-end">
            {TRAIT_CATEGORIES.map((trait) => (
              <span key={trait} className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TRAIT_COLORS[trait] }} />
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex justify-center overflow-x-auto">
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          className="block h-auto"
          style={{ width: svgWidth, maxWidth: chromosomes.length > 10 ? undefined : '100%' }}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="ideoShadow" x="-30%" y="-5%" width="160%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity={0.12} />
            </filter>
          </defs>

          {/* Mb scale ruler on the left */}
          <g>
            {scaleTicks.map((mb) => {
              const y = margin.top + maxBarHeight - mb * pxPerMb
              if (y < margin.top - 2) return null
              return (
                <g key={mb}>
                  <line
                    x1={margin.left - 8}
                    x2={margin.left - 3}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth={0.75}
                    className="text-wheat-400 dark:text-wheat-500"
                  />
                  <text
                    x={margin.left - 11}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-current text-[9px] text-wheat-500 dark:text-wheat-400"
                  >
                    {mb}
                  </text>
                </g>
              )
            })}
            <text
              x={margin.left - 11}
              y={margin.top - 10}
              textAnchor="end"
              className="fill-current text-[9px] font-semibold text-wheat-500 dark:text-wheat-400"
            >
              Mb
            </text>
          </g>

          {chromosomes.map((chr, idx) => {
            const cx = margin.left + idx * colGap + colGap / 2
            const len = chromosomeLength(chr)
            const h = (len / 1_000_000) * pxPerMb
            const rowTop = margin.top + (maxBarHeight - h)
            const half = chromWidth / 2
            const genome = genomeOf(chr)
            const colorClass = genomeColor
              ? GENOME_COLOR_CLASS[genome] ?? 'text-wheat-400 dark:text-wheat-500'
              :'text-wheat-300 dark:text-wheat-600'
            const qtlBins = qtlDensity.byChr.get(chr) ?? []
            const metaqtls = filtered.filter((i): i is MetaQTLItem => i.type === 'metaqtl' && i.chromosome === chr)
            // Shared label column for both QTL and MetaQTL name labels, past
            // all the side lanes.
            const labelX = cx + half + qtlLane + MAX_META_LANES * metaLaneWidth + 4

            return (
              <g key={chr}>
                <rect
                  x={cx - half}
                  y={rowTop}
                  width={chromWidth}
                  height={h}
                  rx={half}
                  ry={half}
                  fill="currentColor"
                  className={`cursor-pointer ${colorClass}`}
                  stroke="currentColor"
                  strokeOpacity={0.35}
                  strokeWidth={1}
                  filter="url(#ideoShadow)"
                  onMouseEnter={(e) => setHover({ kind: 'chr', x: e.clientX, y: e.clientY, chr })}
                  onMouseMove={(e) => setHover({ kind: 'chr', x: e.clientX, y: e.clientY, chr })}
                  onMouseLeave={() => setHover(null)}
                />
                {/* QTL density strip: bar length proportional to local count,
                    colour is the bin's dominant trait. A bin that resolves to
                    exactly one QTL can carry its name (space aware, like
                    MetaQTL below) - a bin with several QTLs has no single
                    name to print. */}
                {showQTL &&
                  (() => {
                    let lastLabelY = -Infinity
                    return qtlBins.map((bin, i) => {
                      if (bin.count === 0) return null
                      const yTop = rowTop + h * (1 - (i + 1) / QTL_BINS)
                      const yMid = yTop + (h / QTL_BINS) / 2
                      const binH = h / QTL_BINS
                      const trait = dominantTrait(bin.traits)
                      const color = TRAIT_COLORS[trait as TraitCategory] ?? '#888'
                      // Minimum length is deliberately generous (not just a
                      // couple of px) - a bin with even one QTL needs to read
                      // as a visible mark next to dozens of chromosome bars,
                      // not disappear at this zoomed-out, side-by-side scale.
                      const barLen = Math.max(6, (bin.count / qtlDensity.max) * qtlLane)
                      const canLabel = showItemLabels && bin.only && Math.abs(yMid - lastLabelY) >= MIN_LABEL_GAP
                      if (canLabel) lastLabelY = yMid
                      const name = bin.only && bin.only.name.length > 16 ? `${bin.only.name.slice(0, 15)}…` : bin.only?.name
                      return (
                        <g key={i}>
                          <rect
                            x={cx + half}
                            y={yTop}
                            width={barLen}
                            height={Math.max(binH, 3.5)}
                            fill={color}
                            fillOpacity={0.92}
                            stroke={color}
                            strokeOpacity={0.5}
                            strokeWidth={0.5}
                          >
                            <title>{`${bin.count.toLocaleString()} QTL(s), mostly ${trait}`}</title>
                          </rect>
                          {canLabel && (
                            <>
                              <line
                                x1={cx + half + barLen}
                                x2={labelX}
                                y1={yMid}
                                y2={yMid}
                                stroke={color}
                                strokeWidth={0.6}
                                strokeOpacity={0.5}
                                className="pointer-events-none"
                              />
                              <text
                                x={labelX}
                                y={yMid + 2.5}
                                className="fill-current text-[7px] text-wheat-700 dark:text-wheat-300"
                              >
                                {name}
                              </text>
                            </>
                          )}
                        </g>
                      )
                    })
                  })()}

                {/* MetaQTL brackets: stacked in lanes beside the bar, with a
                    thin leader line back to the bar at the interval's midpoint.
                    Labels share one text column past the lanes and are
                    "space aware": a name is only printed when it won't
                    collide with the previous label on this chromosome. */}
                {showMetaQTL &&
                  (() => {
                    let lastLabelY = -Infinity
                    return metaqtls.map((m) => {
                      const yStart = rowTop + yFor(chr, m.start)
                      const yEnd = rowTop + yFor(chr, m.end)
                      const yMid = (yStart + yEnd) / 2
                      const lane = metaLanes.get(m.id) ?? 0
                      const laneX = cx + half + qtlLane + lane * metaLaneWidth
                      const color = TRAIT_COLORS[m.trait as TraitCategory] ?? '#888'
                      const canLabel = showItemLabels && Math.abs(yMid - lastLabelY) >= MIN_LABEL_GAP
                      if (canLabel) lastLabelY = yMid
                      const name = m.name.length > 16 ? `${m.name.slice(0, 15)}…` : m.name
                      return (
                        <g key={m.id}>
                          <line
                            x1={cx + half}
                            x2={canLabel ? labelX : laneX}
                            y1={yMid}
                            y2={yMid}
                            stroke={color}
                            strokeWidth={0.75}
                            strokeOpacity={0.5}
                            className="pointer-events-none"
                          />
                          <rect
                            x={laneX}
                            y={yEnd}
                            width={metaLaneWidth - 2}
                            height={Math.max(yStart - yEnd, 5)}
                            rx={1.5}
                            fill={color}
                            fillOpacity={0.7}
                            stroke={color}
                            strokeWidth={0.75}
                            className="cursor-pointer hover:fill-opacity-95"
                            onMouseEnter={(e) => setHover({ kind: 'item', x: e.clientX, y: e.clientY, item: m })}
                            onMouseLeave={() => setHover(null)}
                            onMouseMove={(e) => setHover({ kind: 'item', x: e.clientX, y: e.clientY, item: m })}
                          />
                          {canLabel && (
                            <text
                              x={labelX}
                              y={yMid + 2.5}
                              className="fill-current text-[7px] text-wheat-700 dark:text-wheat-300"
                            >
                              {name}
                            </text>
                          )}
                        </g>
                      )
                    })
                  })()}

                {showLabels && (
                  <text
                    x={cx}
                    y={margin.top + maxBarHeight + 18}
                    textAnchor="middle"
                    className="fill-current text-xs font-semibold text-wheat-900 dark:text-wheat-50"
                  >
                    {chr}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-wheat-200 dark:border-ink-700 pt-4 text-xs">
        {null}
        <span className="text-wheat-500 dark:text-wheat-400">
          Bars: real physical length on the selected assembly. Beside each bar: QTL density strip (length ∝ local count) and region brackets, both coloured by trait.
        </span>
      </div>

      {hover && (
        <div
          className="fixed z-50 max-w-xs rounded border border-wheat-200 dark:border-ink-700 bg-wheat-50 dark:bg-ink-800 p-3 text-xs shadow-xl"
          style={{ left: hover.x + 14, top: hover.y + 14 }}
        >
          {hover.kind === 'chr' && (
            <>
              <div className="font-semibold text-wheat-900 dark:text-wheat-50">Chromosome {hover.chr}</div>
              <div className="text-wheat-700 dark:text-wheat-300">
                {(chromosomeLength(hover.chr) / 1_000_000).toFixed(1)} Mb
              </div>
            </>
          )}
          {hover.kind === 'item' && (
            <>
              <div
                className="mb-2 rounded-md px-2 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: TRAIT_COLORS[hover.item.trait as TraitCategory] ?? '#888' }}
              >
                {hover.item.type === 'qtl' ? 'QTL' : 'Region'} · {hover.item.name}
              </div>
              <div className="space-y-0.5 text-wheat-700 dark:text-wheat-300">
                <div><span className="font-medium">Chromosome:</span> {hover.item.chromosome}</div>
                <div><span className="font-medium">Trait:</span> {hover.item.trait}</div>
                {hover.item.type === 'metaqtl' && (
                  <div>
                    <span className="font-medium">Interval:</span>{' '}
                    {(hover.item.start / 1_000_000).toFixed(2)} – {(hover.item.end / 1_000_000).toFixed(2)} Mb
                  </div>
                )}
                <div><span className="font-medium">Position:</span> {(hover.item.point / 1_000_000).toFixed(2)} Mb</div>
                {hover.item.raw.parameter && (
                  <div><span className="font-medium">Parameter:</span> {hover.item.raw.parameter}</div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
