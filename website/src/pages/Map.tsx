import { useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw, Download, Image as ImageIcon, FileImage, Search, SlidersHorizontal, Moon, Sun } from 'lucide-react'
import PageHero from '../components/PageHero'
import IdeogramMap from '../components/IdeogramMap'
import CircosMap from '../components/CircosMap'
import AsyncBoundary from '../components/AsyncBoundary'
import { useCSV } from '../lib/useCSV'
import { QTLRecord, GWASRecord, MQTLRecord } from '../lib/types'
import { prepareItems, TRAIT_CATEGORIES, TRAIT_COLORS, GENOMES, DEFAULT_GENOME, setGenome } from '../lib/map'
import { exportSVG, exportRaster } from '../lib/exportMap'

export default function Map() {
  const qtl = useCSV<QTLRecord>('qtl.csv')
  const gwas = useCSV<GWASRecord>('gwas.csv')
  const mq = useCSV<MQTLRecord>('mqtl.csv')
  const [genome, setGenomeKey] = useState<string>(DEFAULT_GENOME)
  // the chromosome set of the map components follows the selected genome
  setGenome(genome)

  const [showQTL, setShowQTL] = useState(true)
  const [showMetaQTL, setShowMetaQTL] = useState(true)
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [view, setView] = useState<'ideogram' | 'circos'>('ideogram')
  const [search, setSearch] = useState('')
  const [compact, setCompact] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showItemLabels, setShowItemLabels] = useState(false)
  const [plotDark, setPlotDark] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const loci = useMemo<QTLRecord[]>(() => [...qtl.data, ...gwas.data], [qtl.data, gwas.data])
  const allItems = useMemo(() => prepareItems(loci, [], mq.data), [loci, mq.data, genome])

  // Only records with a physical position on an allotetraploid chromosome can
  // be drawn; say how many are left out so the map isn't read as exhaustive.
  const placed = useMemo(() => allItems.filter((i) => i.type === 'qtl').length, [allItems])
  const onGenome = useMemo(() => loci.filter((r) => r.genome === genome).length, [loci, genome])
  const items = allItems

  const reset = () => {
    setShowQTL(true)
    setShowMetaQTL(true)
    setSelectedTraits([])
    setSearch('')
    setCompact(true)
    setShowLabels(true)
    setShowItemLabels(false)
  }

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
    )
  }

  const selectableTraits = TRAIT_CATEGORIES

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = parseInt(e.key, 10)
      if (isNaN(idx) || idx < 1 || idx > selectableTraits.length) return
      const trait = selectableTraits[idx - 1]
      if (trait) toggleTrait(trait)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectableTraits])

  const handleExport = (format: 'svg' | 'png' | 'jpeg') => {
    if (!svgRef.current) return
    if (format === 'svg') {
      exportSVG(svgRef.current)
    } else {
      exportRaster(svgRef.current, format)
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Visualization"
        title="Physical QTL map"
        subtitle="QTL, GWAS loci and meta-QTL on the current genome assembly of each species, coloured by trait category. Choose the genome below."
        variant="side"
      />

      <AsyncBoundary loading={qtl.loading || gwas.loading || mq.loading} error={qtl.error ?? gwas.error ?? mq.error}>
        <div className={`space-y-6 ${plotDark ? 'dark' : ''}`}>
          {/* Controls */}
          <div className="card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-wheat-600"
                    checked={showQTL}
                    onChange={(e) => setShowQTL(e.target.checked)}
                  />
                  <span className="text-sm font-medium">QTL / GWAS loci</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-wheat-600"
                    checked={showMetaQTL}
                    onChange={(e) => setShowMetaQTL(e.target.checked)}
                  />
                  <span className="text-sm font-medium">Meta-QTL track</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-wheat-600"
                    checked={compact}
                    onChange={(e) => setCompact(e.target.checked)}
                  />
                  <span className="text-sm font-medium">Compact</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-wheat-600"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                  />
                  <span className="text-sm font-medium">Labels</span>
                </label>
                {view === 'ideogram' && (
                  <>
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-wheat-600"
                        checked={showItemLabels}
                        onChange={(e) => setShowItemLabels(e.target.checked)}
                      />
                      <span className="text-sm font-medium">Region labels</span>
                    </label>
                  </>
                )}
              </div>

              <div className="flex items-center rounded border border-wheat-200 dark:border-ink-700 bg-wheat-50 dark:bg-ink-900/40 p-1">
                <button
                  onClick={() => setView('ideogram')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    view === 'ideogram'
                      ? 'bg-wheat-50 dark:bg-ink-800 text-wheat-800 dark:text-wheat-100 shadow-sm'
                      :'text-wheat-600 dark:text-wheat-400 hover:text-wheat-800'
                  }`}
                >
                  Ideogram
                </button>
                <button
                  onClick={() => setView('circos')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    view === 'circos'
                      ? 'bg-wheat-50 dark:bg-ink-800 text-wheat-800 dark:text-wheat-100 shadow-sm'
                      :'text-wheat-600 dark:text-wheat-400 hover:text-wheat-800'
                  }`}
                >
                  Circos
                </button>
              </div>
              <button
                onClick={() => setPlotDark(!plotDark)}
                className="btn text-xs"
                title="Toggle dark theme for the plot"
                aria-pressed={plotDark}
              >
                {plotDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {plotDark ? 'Light plot' : 'Dark plot'}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-wheat-600 dark:text-wheat-400">Export:</span>
                <button onClick={() => handleExport('svg')} className="btn text-xs" title="Download SVG">
                  <Download className="h-3.5 w-3.5" />
                  SVG
                </button>
                <button onClick={() => handleExport('png')} className="btn text-xs" title="Download PNG">
                  <ImageIcon className="h-3.5 w-3.5" />
                  PNG
                </button>
                <button onClick={() => handleExport('jpeg')} className="btn text-xs" title="Download JPEG">
                  <FileImage className="h-3.5 w-3.5" />
                  JPEG
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wheat-500 dark:text-wheat-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, trait, parameter or candidate gene…"
                  className="input w-full pl-9"
                />
              </div>
              <div className="flex items-center gap-3 rounded border border-wheat-200 dark:border-ink-700 bg-wheat-50 dark:bg-ink-900/40 px-3 py-2">
                <SlidersHorizontal className="h-4 w-4 text-wheat-500 dark:text-wheat-400" />
                <span className="text-xs font-medium text-wheat-600 dark:text-wheat-400">Genome:</span>
                <select className="input w-auto flex-1 text-sm" value={genome} onChange={(e) => { setGenome(e.target.value); setGenomeKey(e.target.value) }} aria-label="Genome">
                  {Object.entries(GENOMES).map(([k, g]) => <option key={k} value={k}>{g.label}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-wheat-700 dark:text-wheat-300">
                  Highlight traits (click or press 1-{Math.min(9, selectableTraits.length)} to toggle)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTraits([...selectableTraits])}
                    className="text-xs font-medium text-wheat-600 dark:text-wheat-400 underline-offset-2 hover:text-wheat-800 hover:underline"
                  >
                    Select all
                  </button>
                  <span className="text-wheat-300 dark:text-wheat-600">|</span>
                  <button
                    onClick={() => setSelectedTraits([])}
                    className="text-xs font-medium text-wheat-600 dark:text-wheat-400 underline-offset-2 hover:text-wheat-800 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectableTraits.map((trait, idx) => {
                  const active = selectedTraits.includes(trait)
                  return (
                    <button
                      key={trait}
                      onClick={() => toggleTrait(trait)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? 'border-wheat-600 dark:border-wheat-500 bg-wheat-600 text-white'
                          :'border-wheat-300 dark:border-ink-700 bg-wheat-50 dark:bg-ink-800 text-wheat-700 dark:text-wheat-300 hover:bg-wheat-100'
                      }`}
                      title={`Toggle ${trait} (${idx < 9 ? `key ${idx + 1}` : ''})`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: TRAIT_COLORS[trait] }}
                      />
                      {trait}
                    </button>
                  )
                })}
                <button onClick={reset} className="btn text-xs">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-wheat-500 dark:text-wheat-400">
            {placed.toLocaleString()} of the {onGenome.toLocaleString()} loci of this genome are drawn on {GENOMES[genome].assembly} ({GENOMES[genome].accession});
            it covers {GENOMES[genome].covers}. Published positions were converted to this assembly by sequence alignment
            (see Assemblies); loci that did not convert remain in the data tables.
          </p>

          {view === 'ideogram' ? (
            <IdeogramMap
              key={genome}
              items={items}
              showQTL={showQTL}
              showMetaQTL={showMetaQTL}
              selectedTraits={selectedTraits}
              search={search}
              svgRef={svgRef}
              compact={compact}
              showLabels={showLabels}
              showItemLabels={showItemLabels}
              genomeFilter="all"
              genomeColor={false}
            />
          ) : (
            <CircosMap
              key={genome}
              items={items}
              links={[]}
              showQTL={showQTL}
              showMetaQTL={showMetaQTL}
              showLinks={false}
              selectedTraits={selectedTraits}
              search={search}
              svgRef={svgRef}
              compact={compact}
              showLabels={showLabels}
              genomeFilter="all"
            />
          )}

          {/* Legend / explanation */}
          <div className="card">
            <h3 className="mb-3 text-lg font-semibold text-wheat-900 dark:text-wheat-50">
              How to read this {view === 'ideogram' ? 'ideogram' : 'circos plot'}
            </h3>
            {view === 'ideogram' ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-medium text-wheat-800 dark:text-wheat-100">Chromosomes</p>
                  <p className="text-sm leading-relaxed text-wheat-700 dark:text-wheat-300">
                    The chromosomes of the selected assembly (16 in A. hypochondriacus and A. tuberculatus, 17 in A. palmeri). Height is proportional to physical length against the Mb scale on the left. Centromeres are not drawn.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-wheat-800 dark:text-wheat-100">Locus density strip</p>
                  <p className="text-sm leading-relaxed text-wheat-700 dark:text-wheat-300">
                    Loci are binned along the chromosome; strip length is proportional to the local count, coloured by the bin's most frequent trait category.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-wheat-800 dark:text-wheat-100">Region brackets</p>
                  <p className="text-sm leading-relaxed text-wheat-700 dark:text-wheat-300">
                    Meta-QTL (bracket = 95% confidence interval of the consensus position), coloured by trait category; grain amaranth only. Enable “Region labels” to print their IDs.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-wheat-800 dark:text-wheat-100">Trait highlights</p>
                  <p className="text-sm leading-relaxed text-wheat-700 dark:text-wheat-300">
                    Click a trait button (or press keys 1–9) to highlight one or several traits. Use the search box to narrow results further.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-medium text-wheat-800 dark:text-wheat-100">Chromosomes</p>
                  <p className="text-sm leading-relaxed text-wheat-700 dark:text-wheat-300">
                    Arc length is proportional to physical length on the selected assembly.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-wheat-800 dark:text-wheat-100">Locus density</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-3 w-24 rounded bg-gradient-to-r from-[hsl(48,90%,82%)] via-[hsl(24,90%,65%)] to-[hsl(0,90%,44%)]" />
                    <span className="text-xs text-wheat-600 dark:text-wheat-400">low → high</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-wheat-800 dark:text-wheat-100">Region tracks</p>
                  <p className="text-sm leading-relaxed text-wheat-700 dark:text-wheat-300">
                    Meta-QTL are drawn as bars on the ring of their trait category.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-wheat-800 dark:text-wheat-100">QTL / GWAS tracks</p>
                  <p className="text-sm leading-relaxed text-wheat-700 dark:text-wheat-300">
                    Each trait category gets its own thin ring too (same order as the trait legend below), so a tick's radial position and colour both encode its trait.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AsyncBoundary>
    </div>
  )
}
