import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useJSON } from '../lib/useJSON'
import { useCSV } from '../lib/useCSV'
import { Summary, MQTLRecord } from '../lib/types'
import { TRAIT_CATEGORIES, TRAIT_COLORS } from '../lib/map'

const SPECIES_NOTE: Record<string, string> = {
  'Amaranthus hypochondriacus': 'grain amaranth',
  'Amaranthus tricolor': 'vegetable amaranth',
  'Amaranthus tuberculatus': 'waterhemp',
  'Amaranthus palmeri': 'Palmer amaranth',
  'Amaranthus spp.': 'multi-species panels',
  'A. caudatus x A. quitensis': 'interspecific cross',
}
const TRY = ['flowering', 'betalain', 'seed coat', 'dicamba', 'zinc', 'MYB']

export default function Home() {
  const { data } = useJSON<Summary>('summary.json')
  const mq = useCSV<MQTLRecord>('mqtl.csv')
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const c = data?.counts
  const n = (v?: number) => (v !== undefined ? v.toLocaleString() : '—')
  const contents: [string, number | undefined, string, string][] = [
    ['Mapped loci', c?.loci, '/search', `${n(c?.qtl)} QTL & mapped · ${n(c?.gwas)} GWAS`],
    ['Meta-QTL', c?.mqtl, '/data/metaqtl', 'computed here, ≥ 2 studies'],
    ['Multi-trait clusters', c?.clusters, '/data/clusters', 'candidate pleiotropic regions'],
    ['Linkage maps', c?.maps, '/linkage-maps', `${n(c?.map_markers)} markers`],
    ['PCR markers', c?.pcr_markers, '/markers', 'validated assays'],
    ['Inheritance studies', c?.inheritance, '/data/inheritance', 'segregation analyses'],
    ['Studies', c?.studies_listed, '/literature', `${n(c?.studies_extracted)} with loci`],
    ['Species groups', c?.species, '/figures', 'figures for each'],
  ]
  const cats = TRAIT_CATEGORIES.filter((t) => data?.by_category[t])
  const tot = (t: string) => (data ? data.by_category[t].qtl + data.by_category[t].gwas : 0)
  const maxCat = Math.max(1, ...cats.map(tot))
  const species = data ? Object.entries(data.by_species) : []
  const maxSp = Math.max(1, ...species.map(([, v]) => v))

  return (
    <div className="space-y-8">
      <section className="panel relative overflow-hidden px-5 py-12 sm:px-10 sm:py-16">
        <img src={`${import.meta.env.BASE_URL}images/amaranth-grain-kiwicha.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgb(var(--n-50) / 0.90) 0%, rgb(var(--n-50) / 0.84) 60%, rgb(var(--n-50) / 0.74) 100%)' }} />
        <a href="https://commons.wikimedia.org/wiki/File:Amaranthus_kiwicha.jpg" target="_blank" rel="noreferrer"
          className="absolute bottom-2 right-3 z-10 rounded bg-wheat-50/80 px-2 py-0.5 text-[11px] text-wheat-700 hover:underline">
          Photo: grain amaranth (kiwicha) seed · Crops for the Future · CC BY-SA 3.0
        </a>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="badge animate-fade-up !rounded-full !px-3 !py-1">
            <span className="mr-1.5 inline-flex h-2 w-2 rounded-full bg-accent" />
            {data ? `Release ${data.built}` : 'Release'} · QTL of <em className="ml-1">Amaranthus</em>
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-wheat-900 animate-fade-up sm:text-6xl">
            Amaranth<span className="text-accent">QTL</span>db
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-wheat-800 animate-fade-up" style={{ animationDelay: '.06s' }}>
            Published <strong>QTL</strong>, <strong>GWAS loci</strong>, <strong>meta-QTL</strong>, <strong>linkage maps</strong> and{' '}
            <strong>validated PCR markers</strong> of grain, vegetable and weedy amaranths, each traced to its source table and
            placed on the current genome of its species.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search') }}
            className="mt-8 flex w-full max-w-2xl items-center gap-2 border border-wheat-200 bg-wheat-50 p-2 shadow-lg animate-fade-up"
            style={{ borderRadius: 'calc(var(--radius) + 4px)', animationDelay: '.12s' }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search locus, trait, marker, gene, author…"
              className="flex-1 bg-transparent px-3 py-2 text-base text-wheat-900 outline-none placeholder:text-wheat-500" aria-label="Search AmaranthQTLdb" />
            <button type="submit" className="btn-primary">Search</button>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-wheat-700">
            <span>Try:</span>
            {TRY.map((t) => (
              <button key={t} onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                className="rounded-full border border-wheat-300 bg-wheat-50 px-3 py-1 transition hover:border-accent hover:text-accent">{t}</button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Link to="/data" className="btn-primary">Browse data</Link>
            <Link to="/map" className="btn">Genome map</Link>
            <Link to="/data/metaqtl" className="btn">Meta-QTL</Link>
            <Link to="/figures" className="btn">Figures</Link>
          </div>
          {data && <p className="mt-5 text-sm font-medium text-wheat-800">{n(c?.loci)} loci · {c!.studies_extracted} studies · {c!.traits} traits · {c!.species} species groups</p>}
        </div>
      </section>

      <section className="panel grid grid-cols-2 overflow-hidden sm:grid-cols-4 2xl:grid-cols-8">
        {contents.map(([label, value, to, note]) => (
          <Link key={label} to={to} className="group -mb-px -mr-px border-b border-r border-wheat-200 p-4 transition hover:bg-accent-soft sm:p-5">
            <div className="font-serif text-3xl text-wheat-900 2xl:text-4xl">{n(value)}</div>
            <div className="mt-1 font-medium text-accent group-hover:underline">{label}</div>
            <div className="text-sm text-wheat-500">{note}</div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-6">
          <h2 className="font-serif text-2xl text-wheat-900">Trait categories</h2>
          <p className="mt-1 text-sm text-wheat-600">Loci per category; select one to search it.</p>
          <div className="mt-4 space-y-2.5">
            {cats.map((t) => (
              <button key={t} onClick={() => navigate(`/search?trait=${encodeURIComponent(t)}`)} className="grid w-full grid-cols-[150px_1fr_48px] items-center gap-3 text-left text-sm hover:text-accent">
                <span>{t}</span>
                <span className="h-2.5 rounded-full bg-wheat-100"><span className="block h-2.5 rounded-full" style={{ width: `${(tot(t) / maxCat) * 100}%`, background: TRAIT_COLORS[t] }} /></span>
                <span className="text-right tabular-nums text-wheat-700">{tot(t)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="panel p-6">
          <h2 className="font-serif text-2xl text-wheat-900">Species</h2>
          <p className="mt-1 text-sm text-wheat-600">Loci per species or panel; select one to search it.</p>
          <div className="mt-4 space-y-2.5">
            {species.map(([sp, v]) => (
              <button key={sp} onClick={() => navigate(`/search?species=${encodeURIComponent(sp)}`)} className="grid w-full grid-cols-[minmax(0,240px)_1fr_48px] items-center gap-3 text-left text-sm hover:text-accent">
                <span className="truncate"><em>{sp}</em> <span className="text-wheat-500">{SPECIES_NOTE[sp] ?? ''}</span></span>
                <span className="h-2.5 rounded-full bg-wheat-100"><span className="block h-2.5 rounded-full bg-accent" style={{ width: `${(v / maxSp) * 100}%` }} /></span>
                <span className="text-right tabular-nums text-wheat-700">{v}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl text-wheat-900">Meta-QTL of grain amaranth</h2>
          <Link to="/data/metaqtl" className="text-sm underline">All meta-QTL and trait coverage</Link>
        </div>
        <p className="mt-1 text-sm text-wheat-600">No meta-analysis had been published for Amaranthus; these are computed here, each supported by two or more independent studies.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {mq.data.map((m) => (
            <div key={m.mqtl_id} className="rounded border border-wheat-200 p-4">
              <div className="font-medium text-wheat-900">{m.trait} <span className="text-xs text-wheat-500">{m.mqtl_id}</span></div>
              <div className="mt-1 font-serif text-xl text-accent">{m.chromosome} · {Number(m.position_mb).toFixed(1)} Mb (v3)</div>
              <div className="mt-1 text-sm text-wheat-600">{m.n_studies} studies: {m.studies?.replace(/;/g, ',')}</div>
              {m.recurrent_candidate_genes && <div className="mt-1 truncate text-xs text-wheat-500" title={m.recurrent_candidate_genes}>{m.recurrent_candidate_genes}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl text-wheat-900">Where the loci are</h2>
          <Link to="/figures" className="text-sm underline">Karyotype and Circos for every species</Link>
        </div>
        <img src={`${import.meta.env.BASE_URL}figures/A_hypochondriacus_circos.png`} alt="Circos plot of grain amaranth loci" className="mx-auto mt-4 w-full max-w-3xl" loading="lazy" />
      </section>

      <p className="border-t border-wheat-200 pt-5 text-sm leading-relaxed text-wheat-700">
        <strong>Reliability.</strong> Every value was copied from a table, supplement or sentence of the source paper (the
        Source table column says which) and every study was checked against Crossref. Associations reported at
        0.001 &lt; P ≤ 0.01 are marked <span className="badge">suggestive</span>. See <Link className="underline" to="/faq">Methods and limits</Link>.
      </p>
    </div>
  )
}
