import { ColumnDef } from '@tanstack/react-table'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import GlossaryHeader from '../components/GlossaryHeader'
import { clip } from '../components/cells'
import { useCSV } from '../lib/useCSV'
import { MQTLRecord } from '../lib/types'

const columns: ColumnDef<MQTLRecord, any>[] = [
  { accessorKey: 'mqtl_id', header: () => <GlossaryHeader label="Meta-QTL" term="metaqtl" /> },
  { accessorKey: 'trait', header: 'Trait group' },
  { accessorKey: 'chromosome', header: 'Chr (v3)' },
  { id: 'pos', header: 'Position v3 (Mb)', accessorFn: (r) => Number(r.position_mb) },
  { id: 'ci', header: '95% CI v3 (Mb)', accessorFn: (r) => `${r.ci_start_mb}–${r.ci_end_mb}` },
  { id: 'v21', header: 'Position v2.1 (Mb)', accessorFn: (r) => `${r.v21_chromosome} ${r.v21_position_mb} (${r.v21_ci_mb})` },
  { id: 'n_studies', header: () => <GlossaryHeader label="Studies" term="n_studies" />, accessorFn: (r) => Number(r.n_studies) },
  { accessorKey: 'studies', header: 'Supporting studies', cell: clip(260) },
  { accessorKey: 'n_loci', header: 'Member loci' },
  { accessorKey: 'traits', header: 'Traits', cell: clip(260) },
  { accessorKey: 'record_types', header: 'Evidence types', cell: clip(200) },
  { accessorKey: 'recurrent_candidate_genes', header: 'Candidate genes', cell: clip(300) },
  { accessorKey: 'confidence', header: () => <GlossaryHeader label="Confidence" term="confidence" /> },
]
const cov: ColumnDef<Record<string, string>, any>[] = [
  { accessorKey: 'trait_group', header: 'Trait group' },
  { accessorKey: 'loci', header: 'Loci' },
  { accessorKey: 'studies', header: 'Studies' },
  { accessorKey: 'study_ids', header: 'Study IDs', cell: clip(300) },
  { accessorKey: 'meta_qtl', header: 'Meta-QTL' },
  { accessorKey: 'reason_if_none', header: 'Why none', cell: clip(300) },
]

export default function MetaQTLPage() {
  const mq = useCSV<MQTLRecord>('mqtl.csv')
  const c = useCSV<Record<string, string>>('mqtl_trait_coverage.csv')
  return (
    <div>
      <PageHero
        eyebrow="Analysis"
        title="Meta-QTL"
        subtitle="No meta-QTL analysis had been published for any Amaranthus species, so AmaranthQTLdb computes them: loci of each trait group on the A. hypochondriacus physical axis, one observation per study per locus, a Gaussian mixture with known variances (Goffinet & Gerber 2000), and a meta-QTL kept when at least two independent studies support it."
        variant="side"
      />
      <AsyncBoundary loading={mq.loading || c.loading} error={mq.error ?? c.error}>
        <div className="space-y-8">
          <DataTable data={mq.data} columns={columns} filename="amaranthqtldb_meta_qtl.csv" pageSize={10} />
          <div>
            <h3 className="mb-2 font-serif text-xl text-wheat-900">Trait coverage</h3>
            <p className="mb-3 max-w-4xl text-sm text-wheat-700">Every trait group on the grain-amaranth axis, with the reason it has no meta-QTL. A trait measured in one study cannot be replicated, so it cannot form a meta-QTL.</p>
            <DataTable data={c.data} columns={cov} filename="amaranthqtldb_meta_qtl_coverage.csv" pageSize={25} />
          </div>
        </div>
      </AsyncBoundary>
    </div>
  )
}
