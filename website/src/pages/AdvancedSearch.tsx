import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, RotateCcw } from 'lucide-react'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { useCSV } from '../lib/useCSV'
import { QTLRecord } from '../lib/types'
import { TRAIT_CATEGORIES, TRAIT_GROUPS, normalizeTrait } from '../lib/map'
import { lociColumns } from '../lib/lociColumns'

const columns = lociColumns({ type: true })
interface F { q: string; type: string; species: string; trait: string; parameter: string; chromosome: string; pveMin: string; sigOnly: boolean; hasGene: boolean; placedOnly: boolean }
const EMPTY: F = { q: '', type: '', species: '', trait: '', parameter: '', chromosome: '', pveMin: '', sigOnly: false, hasGene: false, placedOnly: false }
const uniq = (rows: QTLRecord[], k: keyof QTLRecord) => Array.from(new Set(rows.map((r) => String(r[k] ?? '')).filter(Boolean))).sort()

export default function AdvancedSearch() {
  const qtl = useCSV<QTLRecord>('qtl.csv')
  const gwas = useCSV<QTLRecord>('gwas.csv')
  const [params, setParams] = useSearchParams()
  const [f, setF] = useState<F>(() => ({ ...EMPTY, q: params.get('q') ?? '', trait: params.get('trait') ?? '', species: params.get('species') ?? '' }))
  useEffect(() => {
    const n = new URLSearchParams()
    ;(['q', 'trait', 'species'] as const).forEach((k) => { if (f[k]) n.set(k, f[k]) })
    setParams(n, { replace: true })
  }, [f.q, f.trait, f.species, setParams])

  const rows = useMemo(() => [...qtl.data, ...gwas.data], [qtl.data, gwas.data])
  const species = useMemo(() => uniq(rows, 'species'), [rows])
  const types = useMemo(() => uniq(rows, 'record_type'), [rows])
  const chroms = useMemo(() => uniq(rows, 'chromosome').filter((c) => c.startsWith('Chr')), [rows])
  const params2 = useMemo(() => {
    const cats = f.trait ? (TRAIT_GROUPS[f.trait] ?? [f.trait]) : null
    return uniq(rows.filter((r) => !cats || cats.includes(normalizeTrait(r))), 'parameter')
  }, [rows, f.trait])

  const filtered = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    const cats = f.trait ? (TRAIT_GROUPS[f.trait] ?? [f.trait]) : null
    const pmin = f.pveMin ? parseFloat(f.pveMin) : null
    return rows.filter((r) => {
      if (f.type && r.record_type !== f.type) return false
      if (f.species && r.species !== f.species) return false
      if (cats && !cats.includes(normalizeTrait(r))) return false
      if (f.parameter && r.parameter !== f.parameter) return false
      if (f.chromosome && r.chromosome !== f.chromosome) return false
      if (f.sigOnly && r.evidence !== 'significant') return false
      if (f.hasGene && !r.candidate_gene) return false
      if (f.placedOnly && !r.map_bp) return false
      if (pmin !== null && !(parseFloat(String(r.pve)) >= pmin)) return false
      if (q) {
        const hay = [r.qtl_name, r.parameter, r.trait_original, r.associated_markers, r.candidate_gene, r.reference, r.population, r.species, r.study_id].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [rows, f])

  const set = <K extends keyof F>(k: K, v: F[K]) => setF((p) => ({ ...p, [k]: v }))
  const sel = (label: string, k: keyof F, opts: string[], all: string) => (
    <label className="text-xs text-wheat-700">{label}
      <select className="input mt-1 w-full" value={f[k] as string} onChange={(e) => set(k, e.target.value as never)}>
        <option value="">{all}</option>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
  return (
    <div>
      <PageHero eyebrow="Search" title="Advanced search" subtitle="Filter QTL, GWAS loci, Mendelian loci and sex-linked regions together by species, trait, chromosome, effect size and evidence." variant="side" />
      <AsyncBoundary loading={qtl.loading || gwas.loading} error={qtl.error ?? gwas.error}>
        <div className="card mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-wheat-900"><Filter className="h-4 w-4" />Filters</h3>
            <button className="btn text-xs" onClick={() => setF(EMPTY)}><RotateCcw className="h-3.5 w-3.5" />Reset</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-wheat-700">Keyword
              <input className="input mt-1 w-full" placeholder="Locus, marker, gene, author…" value={f.q} onChange={(e) => set('q', e.target.value)} />
            </label>
            {sel('Record type', 'type', types, 'All types')}
            {sel('Species', 'species', species, 'All species')}
            {sel('Trait category', 'trait', [...Object.keys(TRAIT_GROUPS), ...TRAIT_CATEGORIES], 'All categories')}
            {sel('Trait', 'parameter', params2, 'All traits')}
            {sel('Chromosome (as published)', 'chromosome', chroms, 'All chromosomes')}
            <label className="text-xs text-wheat-700">Minimum PVE (%)
              <input className="input mt-1 w-full" placeholder="e.g. 10" value={f.pveMin} onChange={(e) => set('pveMin', e.target.value)} />
            </label>
            <div className="space-y-1.5 pt-1 text-sm">
              {([['sigOnly', 'Significant only (hide suggestive)'], ['hasGene', 'Has a candidate gene'], ['placedOnly', 'Placed on the current assembly']] as const).map(([k, l]) => (
                <label key={k} className="flex cursor-pointer items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-wheat-600" checked={f[k]} onChange={(e) => set(k, e.target.checked)} />{l}</label>
              ))}
            </div>
          </div>
        </div>
        <DataTable data={filtered} columns={columns} filename="amaranthqtldb_search.csv" />
      </AsyncBoundary>
    </div>
  )
}
