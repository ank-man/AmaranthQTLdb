import { ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageHero from '../components/PageHero'
import AsyncBoundary from '../components/AsyncBoundary'
import { useJSON } from '../lib/useJSON'
import { Summary } from '../lib/types'
import { TRAIT_CATEGORIES, TRAIT_COLORS, GENOMES } from '../lib/map'

const S1 = '#0072B2'
const S2 = '#E69F00'
const AXIS = { fontSize: 11, fill: 'rgb(var(--n-600))' }
const tip = { fontSize: 12, borderRadius: 6, border: '1px solid #e7e7ea' }

function Panel({ title, note, legend, height = 300, children }: { title: string; note?: string; legend?: [string, string][]; height?: number; children: ReactNode }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-wheat-900">{title}</h3>
      {note && <p className="mt-1 text-sm text-wheat-600">{note}</p>}
      {legend && (
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-wheat-600">
          {legend.map(([l, c]) => <span key={l} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />{l}</span>)}
        </div>
      )}
      <div className="mt-3" style={{ height }}><ResponsiveContainer width="100%" height="100%">{children as any}</ResponsiveContainer></div>
    </div>
  )
}

export default function Statistics() {
  const { data, loading, error } = useJSON<Summary>('summary.json')
  return (
    <div>
      <PageHero eyebrow="Overview" title="Database statistics" subtitle="Counts by record type, trait, species, chromosome and study, computed from the current data." variant="side" />
      <AsyncBoundary loading={loading} error={error}>{data && <Charts s={data} />}</AsyncBoundary>
    </div>
  )
}

function Charts({ s }: { s: Summary }) {
  const c = s.counts
  const tiles: [number, string][] = [
    [c.loci, 'Mapped loci'], [c.qtl, 'QTL, Mendelian and sex-linked'], [c.gwas, 'GWAS loci'], [c.suggestive, 'of them suggestive'],
    [c.placed, 'Placed on a current assembly'], [c.mqtl, 'Meta-QTL'], [c.clusters, 'Multi-trait clusters'], [c.maps, 'Linkage maps'],
    [c.pcr_markers, 'Validated PCR assays'], [c.studies_extracted, 'Studies with loci'], [c.studies_listed, 'Studies listed'], [c.traits, 'Traits'],
  ]
  const cats = TRAIT_CATEGORIES.filter((t) => s.by_category[t]).map((t) => ({ name: t, QTL: s.by_category[t].qtl, GWAS: s.by_category[t].gwas }))
  const species = Object.entries(s.by_species).map(([name, v]) => ({ name: name.replace('Amaranthus', 'A.'), v }))
  const types = Object.entries(s.by_record_type).map(([name, v]) => ({ name, v }))
  const traits = Object.entries(s.top_traits).map(([name, v]) => ({ name, v }))
  const studies = [...s.by_study].sort((a, b) => b.records - a.records)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-x-10 border-y border-wheat-200 sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map(([v, l]) => (
          <div key={l} className="flex items-baseline gap-3 border-b border-wheat-200 py-2">
            <span className="w-16 text-right font-serif text-lg font-semibold text-wheat-900">{(v ?? 0).toLocaleString()}</span>
            <span className="text-sm text-wheat-700">{l}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Loci by trait category" legend={[['QTL & mapped loci', S1], ['GWAS loci', S2]]}>
          <BarChart data={cats} margin={{ left: 0, right: 8, bottom: 40 }}>
            <CartesianGrid vertical={false} stroke="#ececf0" />
            <XAxis dataKey="name" tick={AXIS} angle={-25} textAnchor="end" interval={0} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="QTL" stackId="a" fill={S1} />
            <Bar dataKey="GWAS" stackId="a" fill={S2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </Panel>
        <Panel title="Loci by species / panel">
          <BarChart data={species} layout="vertical" margin={{ left: 40, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="#ececf0" />
            <XAxis type="number" tick={AXIS} />
            <YAxis type="category" dataKey="name" tick={{ ...AXIS, fontStyle: 'italic' }} width={170} />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="v" name="Loci" fill={S1} radius={[0, 4, 4, 0]} />
          </BarChart>
        </Panel>
        <Panel title="Most mapped traits" note="Loci per harmonised trait (top 20)." height={420}>
          <BarChart data={traits} layout="vertical" margin={{ left: 40, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="#ececf0" />
            <XAxis type="number" tick={AXIS} />
            <YAxis type="category" dataKey="name" tick={AXIS} width={210} interval={0} />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="v" name="Loci" fill={S1} radius={[0, 4, 4, 0]} />
          </BarChart>
        </Panel>
        <Panel title="Loci by record type">
          <BarChart data={types} margin={{ left: 0, right: 8, bottom: 40 }}>
            <CartesianGrid vertical={false} stroke="#ececf0" />
            <XAxis dataKey="name" tick={AXIS} interval={0} angle={-20} textAnchor="end" />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="v" name="Loci" fill={S1} radius={[4, 4, 0, 0]} />
          </BarChart>
        </Panel>
        {Object.keys(GENOMES).map((g) => (
          <Panel key={g} title={`Loci per chromosome: ${GENOMES[g].label}`} note={`Placed loci on ${GENOMES[g].assembly} (${GENOMES[g].accession}).`} height={240}>
            <BarChart data={s.per_chromosome.filter((r) => r.genome === g)} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#ececf0" />
              <XAxis dataKey="chromosome" tick={AXIS} interval={0} tickFormatter={(v) => v.replace('Chr', '')} />
              <YAxis tick={AXIS} allowDecimals={false} />
              <Tooltip contentStyle={tip} />
              <Bar dataKey="loci" name="Loci" radius={[4, 4, 0, 0]}>
                {s.per_chromosome.filter((r) => r.genome === g).map((r) => <Cell key={r.chromosome} fill={S1} />)}
              </Bar>
            </BarChart>
          </Panel>
        ))}
        <Panel title="Studies by year" note="Year of the studies listed (with or without extracted loci).">
          <BarChart data={s.studies_per_year} margin={{ left: 0, right: 8 }}>
            <CartesianGrid vertical={false} stroke="#ececf0" />
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="studies" name="Studies" fill={S2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </Panel>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-wheat-900">Loci per study</h3>
        <div className="mt-3 space-y-1.5">
          {studies.map((x) => (
            <div key={x.study_id} className="grid grid-cols-[170px_1fr_44px] items-center gap-3 text-sm">
              <span className="truncate" title={x.species}>{x.study_id}</span>
              <span className="h-2 rounded-full bg-wheat-100"><span className="block h-2 rounded-full" style={{ width: `${(x.records / studies[0].records) * 100}%`, background: TRAIT_COLORS.Phenology }} /></span>
              <span className="text-right tabular-nums">{x.records}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
