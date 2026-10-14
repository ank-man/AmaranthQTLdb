import { useEffect, useMemo, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import AsyncBoundary from './AsyncBoundary'
import { useCSV } from '../lib/useCSV'
import { MapLocus } from '../lib/types'
import { exportSVG } from '../lib/exportMap'
import { rampColor as themedRamp, rampStops, useTheme } from '../lib/ramp'

// Layout in the manner of the R package LinkageMapView: linkage groups as bars
// shaded by local marker density, and - for one group at a time - every locus
// labelled with its position (left) and marker name (right), labels spread
// apart and joined to their locus by a connector.
const COL = 58
const BAR = 14
const TOP = 36
const HEIGHT = 440
const MAX_LABELS = 140
const LABEL_GAP = 11
const natural = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })

interface Locus { cm: number; marker: string }
interface Group { lg: string; loci: Locus[]; min: number; max: number }
interface Hover { x: number; y: number; title: string; lines: string[] }

/** Loci per cM in `n` equal slices of [from, to]. */
function densityBins(loci: Locus[], from: number, to: number, n: number): number[] {
  // a group with one locus (or all loci at one position) has no length: treat it as 1 cM
  const span = Math.max(to - from, 1)
  const counts = new Array(n).fill(0)
  loci.forEach((l) => {
    if (l.cm < from || l.cm > to) return
    counts[Math.min(n - 1, Math.floor(((l.cm - from) / span) * n))] += 1
  })
  return counts.map((c) => c / (span / n))
}

/** Push label positions apart so that neighbours are at least `gap` px apart. */
function spread(ys: number[], gap: number, lo: number, hi: number): number[] {
  const out = ys.slice()
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + gap)
  const overflow = out.length ? out[out.length - 1] - hi : 0
  if (overflow > 0) {
    out[out.length - 1] -= overflow
    for (let i = out.length - 2; i >= 0; i--) out[i] = Math.min(out[i], out[i + 1] - gap)
  }
  return out.map((y) => Math.max(lo, y))
}

export default function LinkageMapViewer({ mapId, name }: { mapId: string; name: string }) {
  const { data, loading, error } = useCSV<MapLocus>(`maps/${mapId}.csv`)
  const theme = useTheme()
  const RAMP = rampStops(theme)
  const rampColor = (t: number) => themedRamp(theme, t)
  const [query, setQuery] = useState('')
  const [hover, setHover] = useState<Hover | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const overviewRef = useRef<SVGSVGElement>(null)
  const detailRef = useRef<SVGSVGElement>(null)

  useEffect(() => { setSelected(null); setFrom(''); setTo(''); setQuery('') }, [mapId])

  const groups = useMemo<Group[]>(() => {
    const by = new Map<string, Locus[]>()
    data.forEach((d) => {
      const cm = parseFloat(d.position_cm)
      if (!Number.isFinite(cm)) return
      if (!by.has(d.linkage_group)) by.set(d.linkage_group, [])
      by.get(d.linkage_group)!.push({ cm, marker: d.marker })
    })
    return Array.from(by.entries())
      .map(([lg, loci]) => {
        loci.sort((a, b) => a.cm - b.cm)
        return { lg, loci, min: loci[0].cm, max: loci[loci.length - 1].cm }
      })
      .sort((a, b) => natural(a.lg, b.lg))
  }, [data])

  const q = query.trim().toLowerCase()
  const isHit = (m: string) => q !== '' && m.toLowerCase().includes(q)
  const maxLen = Math.max(1, ...groups.map((g) => g.max - g.min))
  const scale = HEIGHT / maxLen

  // Density per linkage group in ~6-px slices; one colour scale for the whole map.
  const overview = useMemo(() => groups.map((g) => {
    const n = Math.max(1, Math.round(((g.max - g.min) * scale) / 6))
    return densityBins(g.loci, g.min, g.max, n)
  }), [groups, scale])
  const maxDensity = useMemo(() => {
    const v = overview.flat().filter((d) => d > 0).sort((a, b) => a - b)
    return v.length ? v[Math.min(v.length - 1, Math.floor(v.length * 0.98))] : 1
  }, [overview])
  // square-root scale keeps sparse regions visible beside very dense ones
  const shade = (d: number) => (d <= 0 ? 'rgb(var(--n-50))' : rampColor(Math.sqrt(d / maxDensity)))

  const current = groups.find((g) => g.lg === (selected ?? groups[0]?.lg))
  const width = Math.max(320, groups.length * COL + 70)

  // ---- detail of one linkage group
  const detail = useMemo(() => {
    if (!current) return null
    const lo = from !== '' && Number.isFinite(parseFloat(from)) ? parseFloat(from) : current.min
    const hi = to !== '' && Number.isFinite(parseFloat(to)) ? parseFloat(to) : current.max
    const a = Math.min(lo, hi)
    const b = Math.max(lo, hi)
    const inRange = current.loci.filter((l) => l.cm >= a && l.cm <= b)
    // label every locus when they fit; otherwise an even sample plus all search hits
    let labelled = inRange
    if (inRange.length > MAX_LABELS) {
      const step = inRange.length / MAX_LABELS
      const keep = new Set<number>()
      for (let i = 0; i < MAX_LABELS; i++) keep.add(Math.floor(i * step))
      labelled = inRange.filter((l, i) => keep.has(i) || isHit(l.marker))
    }
    const h = Math.max(520, labelled.length * LABEL_GAP + 20)
    const span = Math.max(b - a, 1e-9)
    const y = (cm: number) => TOP + ((cm - a) / span) * h
    const labelY = spread(labelled.map((l) => y(l.cm)), LABEL_GAP, TOP, TOP + h)
    const bins = densityBins(inRange, a, b, Math.max(1, Math.round(h / 6)))
    return { a, b, inRange, labelled, h, y, labelY, bins }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, from, to, q])

  const detailMax = detail ? Math.max(1e-9, ...detail.bins) : 1
  const longest = detail ? Math.max(8, ...detail.labelled.map((l) => l.marker.length)) : 8
  const detailWidth = 250 + Math.min(longest, 40) * 6.2

  return (
    <AsyncBoundary loading={loading} error={error} empty={!loading && !groups.length} emptyMessage="This map has no positioned loci.">
      <div className="flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Highlight marker…" aria-label="Highlight marker" />
        {q && <span className="badge">{data.filter((d) => isHit(d.marker)).length.toLocaleString()} matching loci</span>}
        <span className="text-xs text-wheat-500">{groups.length} linkage groups · {data.length.toLocaleString()} loci · longest {maxLen.toFixed(0)} cM</span>
        <span className="flex-1" />
        <a className="btn text-xs" href={`${import.meta.env.BASE_URL}data/maps/${mapId}.csv`} download={`${mapId}_linkage_map.csv`}>
          <Download className="h-3.5 w-3.5" />Map CSV
        </a>
        <button className="btn text-xs" onClick={() => overviewRef.current && exportSVG(overviewRef.current, `${mapId}_density_map.svg`)}>
          <Download className="h-3.5 w-3.5" />Density map SVG
        </button>
      </div>

      {/* ---- density map of all linkage groups */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-wheat-600">
        <span className="font-medium text-wheat-800">Marker density</span>
        <span>sparse</span>
        <span className="h-2.5 w-40 rounded-sm border border-wheat-200" style={{ background: `linear-gradient(to right, ${RAMP.join(',')})` }} />
        <span>dense (≥ {maxDensity.toFixed(maxDensity < 10 ? 1 : 0)} loci per cM)</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm border border-wheat-300 bg-wheat-50" />no marker</span>
        {q && <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t-2 border-[#e34948]" />search hit</span>}
      </div>
      <div className="mt-2 overflow-x-auto rounded border border-wheat-200 bg-wheat-50">
        <svg ref={overviewRef} width={width} height={HEIGHT + TOP + 34} role="img" aria-label={`Marker density map of ${name}`}>
          {Array.from({ length: Math.floor(maxLen / 50) + 1 }, (_, i) => i * 50).map((t) => (
            <g key={t}>
              <line x1={44} x2={width} y1={TOP + t * scale} y2={TOP + t * scale} stroke="rgb(var(--n-200))" strokeWidth={1} />
              <text x={40} y={TOP + t * scale + 3} textAnchor="end" className="fill-wheat-500 text-[10px]">{t}</text>
            </g>
          ))}
          <text x={8} y={16} className="fill-wheat-500 text-[10px]">cM</text>
          {groups.map((g, i) => {
            const cx = 70 + i * COL
            const h = Math.max(3, (g.max - g.min) * scale)
            const bins = overview[i]
            const bh = h / bins.length
            const active = current?.lg === g.lg
            const clip = `clip-${mapId}-${i}`
            return (
              <g key={g.lg} className="cursor-pointer" onClick={() => { setSelected(g.lg); setFrom(''); setTo('') }}>
                <clipPath id={clip}><rect x={cx - BAR / 2} y={TOP} width={BAR} height={h} rx={BAR / 2} /></clipPath>
                <text x={cx} y={TOP - 12} textAnchor="middle" className={`text-[10px] font-semibold ${active ? 'fill-accent' : 'fill-wheat-800'}`}>
                  {g.lg.length > 8 ? `${g.lg.slice(0, 7)}…` : g.lg}
                </text>
                <g clipPath={`url(#${clip})`}>
                  {bins.map((d, k) => <rect key={k} x={cx - BAR / 2} y={TOP + k * bh} width={BAR} height={bh + 0.5} fill={shade(d)} />)}
                </g>
                <rect x={cx - BAR / 2} y={TOP} width={BAR} height={h} rx={BAR / 2} fill="none" stroke={active ? 'rgb(var(--n-900))' : 'rgb(var(--n-500))'} strokeWidth={active ? 2 : 1} />
                {q && g.loci.filter((l) => isHit(l.marker)).map((l, k) => (
                  <line key={k} x1={cx - BAR / 2 - 6} x2={cx + BAR / 2 + 6} y1={TOP + (l.cm - g.min) * scale} y2={TOP + (l.cm - g.min) * scale} stroke="#e34948" strokeWidth={1.6} />
                ))}
                <rect x={cx - COL / 2} y={TOP} width={COL} height={h} fill="transparent"
                  onMouseMove={(e) => {
                    const rect = (e.currentTarget as SVGRectElement).getBoundingClientRect()
                    const k = Math.min(bins.length - 1, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * bins.length)))
                    const w = (g.max - g.min) / bins.length
                    const a = g.min + k * w
                    const inBin = g.loci.filter((l) => l.cm >= a && l.cm <= a + w)
                    setHover({
                      x: e.clientX, y: e.clientY,
                      title: `${g.lg} · ${a.toFixed(1)}–${(a + w).toFixed(1)} cM`,
                      lines: [`${inBin.length} loci · ${bins[k].toFixed(2)} per cM`, ...inBin.slice(0, 6).map((l) => l.marker), ...(inBin.length > 6 ? [`+ ${inBin.length - 6} more`] : []), 'Click to label this group'],
                    })
                  }}
                  onMouseLeave={() => setHover(null)} />
                <text x={cx} y={TOP + h + 14} textAnchor="middle" className="fill-wheat-500 text-[9px]">{g.loci.length}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-wheat-500">
        Each bar is a linkage group drawn to the cM scale and shaded by local marker density; the number below is its locus count.
        Click a group to see its markers by name.
      </p>

      {/* ---- one linkage group with marker names */}
      {current && detail && (
        <div className="mt-6">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <h4 className="font-semibold text-wheat-900">Linkage group {current.lg}</h4>
              <p className="text-xs text-wheat-500">
                {current.loci.length.toLocaleString()} loci · {current.min.toFixed(1)}–{current.max.toFixed(1)} cM
                {detail.labelled.length < detail.inRange.length && (
                  <> · labelling {detail.labelled.length} of {detail.inRange.length.toLocaleString()} loci in view - narrow the cM range to label all</>
                )}
              </p>
            </div>
            <span className="flex-1" />
            <label className="text-xs text-wheat-700">Group
              <select className="input mt-1 w-auto" value={current.lg} onChange={(e) => { setSelected(e.target.value); setFrom(''); setTo('') }}>
                {groups.map((g) => <option key={g.lg} value={g.lg}>{g.lg} ({g.loci.length})</option>)}
              </select>
            </label>
            <label className="text-xs text-wheat-700">From (cM)
              <input className="input mt-1 w-24" inputMode="decimal" value={from} onChange={(e) => setFrom(e.target.value)} placeholder={current.min.toFixed(0)} />
            </label>
            <label className="text-xs text-wheat-700">To (cM)
              <input className="input mt-1 w-24" inputMode="decimal" value={to} onChange={(e) => setTo(e.target.value)} placeholder={current.max.toFixed(0)} />
            </label>
            <button className="btn text-xs" onClick={() => detailRef.current && exportSVG(detailRef.current, `${mapId}_${current.lg}_linkage_group.svg`)}>
              <Download className="h-3.5 w-3.5" />Group SVG
            </button>
          </div>
          <div className="mt-2 max-h-[80vh] overflow-auto rounded border border-wheat-200 bg-wheat-50">
            <svg ref={detailRef} width={detailWidth} height={detail.h + TOP + 24} role="img" aria-label={`Linkage group ${current.lg} of ${name} with marker names`}>
              <text x={125} y={18} textAnchor="middle" className="fill-wheat-900 text-[12px] font-semibold">{current.lg}</text>
              {/* density-shaded bar */}
              <clipPath id={`clip-detail-${mapId}`}><rect x={118} y={TOP} width={BAR} height={detail.h} rx={BAR / 2} /></clipPath>
              <g clipPath={`url(#clip-detail-${mapId})`}>
                {detail.bins.map((d, k) => (
                  <rect key={k} x={118} y={TOP + (k * detail.h) / detail.bins.length} width={BAR} height={detail.h / detail.bins.length + 0.5}
                    fill={d <= 0 ? 'rgb(var(--n-50))' : rampColor(Math.sqrt(d / detailMax))} />
                ))}
              </g>
              <rect x={118} y={TOP} width={BAR} height={detail.h} rx={BAR / 2} fill="none" stroke="rgb(var(--n-500))" strokeWidth={1} />
              {/* locus ticks for everything in view */}
              {detail.inRange.map((l, k) => (
                <line key={k} x1={118} x2={118 + BAR} y1={detail.y(l.cm)} y2={detail.y(l.cm)} stroke={isHit(l.marker) ? '#e34948' : 'rgb(var(--n-900))'} strokeWidth={isHit(l.marker) ? 1.4 : 0.5} strokeOpacity={isHit(l.marker) ? 1 : 0.45} />
              ))}
              {/* labels: position on the left, marker name on the right, joined to the locus */}
              {detail.labelled.map((l, k) => {
                const y0 = detail.y(l.cm)
                const y1 = detail.labelY[k]
                const hit = isHit(l.marker)
                const ink = hit ? '#e34948' : 'rgb(var(--n-500))'
                return (
                  <g key={k}>
                    <polyline points={`118,${y0} 104,${y0} 92,${y1} 84,${y1}`} fill="none" stroke={ink} strokeWidth={0.6} />
                    <polyline points={`${118 + BAR},${y0} ${132 + BAR},${y0} ${144 + BAR},${y1} ${152 + BAR},${y1}`} fill="none" stroke={ink} strokeWidth={0.6} />
                    <text x={80} y={y1 + 3} textAnchor="end" className="fill-wheat-600 text-[9px]">{l.cm.toFixed(1)}</text>
                    <text x={156 + BAR} y={y1 + 3} className={`text-[9px] ${hit ? 'fill-[#e34948] font-semibold' : 'fill-wheat-900'}`}>
                      {l.marker.length > 40 ? `${l.marker.slice(0, 39)}…` : l.marker}
                      <title>{`${l.marker} · ${l.cm.toFixed(2)} cM`}</title>
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
          <p className="mt-2 text-xs text-wheat-500">
            Positions in cM are on the left and marker names on the right; where loci are crowded, labels are moved apart and joined to
            their locus by a connector. The bar keeps the density shading, rescaled to this group.
          </p>
        </div>
      )}

      {hover && (
        <div className="pointer-events-none fixed z-40 max-w-xs rounded-md border border-wheat-200 bg-wheat-50 px-3 py-2 text-xs shadow" style={{ left: hover.x + 14, top: hover.y + 10 }}>
          <div className="font-semibold text-wheat-900">{hover.title}</div>
          {hover.lines.map((m, i) => <div key={i} className={i === hover.lines.length - 1 ? 'mt-1 text-wheat-500' : ''}>{m}</div>)}
        </div>
      )}
    </AsyncBoundary>
  )
}
