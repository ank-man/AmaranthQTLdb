import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { useJSON } from '../lib/useJSON'
import { Summary } from '../lib/types'

export default function DataIndex() {
  const { data } = useJSON<Summary>('summary.json')
  const c = data?.counts
  const n = (v?: number) => (v ?? 0).toLocaleString()
  const rows: [string, string, string][] = [
    ['QTL and mapped loci', '/data/qtl', `${n(c?.qtl)} QTL, Mendelian loci and sex-linked regions.`],
    ['GWAS loci', '/data/gwas', `${n(c?.gwas)} marker-trait associations and QTNs (${n(c?.suggestive)} suggestive).`],
    ['Meta-QTL', '/data/metaqtl', `${n(c?.mqtl)} consensus loci computed across studies, with the coverage of every trait group.`],
    ['Multi-trait clusters', '/data/clusters', `${n(c?.clusters)} regions where loci of two or more trait groups overlap.`],
    ['Inheritance studies', '/data/inheritance', `${n(c?.inheritance)} segregation analyses without map positions.`],
    ['Validated PCR markers', '/markers', `${n(c?.pcr_markers)} assays tested against known phenotypes, with verified primer sequences.`],
    ['Linkage maps', '/linkage-maps', `${n(c?.maps)} genetic maps, ${n(c?.map_markers)} markers; consensus-map status per species.`],
    ['Assemblies and coordinate conversion', '/assemblies', 'Every published position converted to the current assembly of its species.'],
    ['Studies', '/literature', `${n(c?.studies_listed)} studies screened, ${n(c?.studies_extracted)} with extracted loci, the rest with the reason.`],
    ['Figures', '/figures', 'RIdeogram karyotypes and Circos plots for every species, and the waterhemp linkage map with QTL.'],
    ['Statistics', '/statistics', 'Counts by trait, species, record type, chromosome and study.'],
  ]
  return (
    <div>
      <PageHero eyebrow="Data tables" title="Browse the database" subtitle="Every table is sortable, searchable and exportable as CSV. Each record names the table or passage of the paper it was copied from." variant="side" />
      <div className="max-w-5xl">
        {rows.map(([t, to, d]) => (
          <div key={t} className="grid gap-2 border-b border-wheat-200 py-3 sm:grid-cols-[260px_1fr]">
            <Link to={to} className="underline underline-offset-4">{t}</Link>
            <span className="text-wheat-700">{d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
