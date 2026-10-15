import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { clip } from '../components/cells'
import { useCSV } from '../lib/useCSV'

type R = Record<string, string>
const studies: ColumnDef<R, any>[] = [
  { accessorKey: 'trait_group', header: 'Trait group', cell: clip(200) },
  { accessorKey: 'year', header: 'Year' },
  {
    accessorKey: 'title', header: 'Title',
    cell: ({ row }) => <a className="underline" href={`https://doi.org/${row.original.doi}`} target="_blank" rel="noreferrer"><span className="block truncate" style={{ maxWidth: 380 }} title={row.original.title}>{row.original.title}</span></a>,
  },
  { accessorKey: 'species', header: 'Species', cell: clip(180) },
  { accessorKey: 'tissues', header: 'Tissues (abstract)', cell: clip(160) },
  { accessorKey: 'degs_in_abstract', header: 'DEGs (abstract)' },
  { accessorKey: 'key_results_quoted', header: 'Key results (quoted from the abstract)', cell: clip(460) },
  { accessorKey: 'bioprojects', header: 'BioProject', cell: clip(240) },
  { accessorKey: 'open_access', header: 'OA' },
  { accessorKey: 'is_preprint', header: 'Preprint' },
  { accessorKey: 'journal', header: 'Journal', cell: clip(180) },
]
const datasets: ColumnDef<R, any>[] = [
  { accessorKey: 'bioproject', header: 'BioProject', cell: ({ row }) => <a className="underline" href={row.original.url} target="_blank" rel="noreferrer">{row.original.bioproject}</a> },
  { accessorKey: 'registered', header: 'Registered' },
  { accessorKey: 'organisms', header: 'Species', cell: clip(220) },
  { id: 'runs', header: 'Runs', accessorFn: (r) => Number(r.runs) },
  { accessorKey: 'strategies', header: 'Library', cell: clip(140) },
  { accessorKey: 'title', header: 'Title', cell: clip(420) },
  { accessorKey: 'linked_paper', header: 'Linked paper' },
]
const support: ColumnDef<R, any>[] = [
  { accessorKey: 'trait_group', header: 'Trait group' },
  { accessorKey: 'gene', header: 'Meta-QTL candidate gene' },
  { accessorKey: 'title', header: 'RNA-seq study', cell: ({ row }) => <a className="underline" href={`https://doi.org/${row.original.doi}`} target="_blank" rel="noreferrer"><span className="block truncate" style={{ maxWidth: 320 }}>{row.original.title}</span></a> },
  { accessorKey: 'sentence_quoted', header: 'Sentence (quoted from the full text)', cell: clip(560) },
]

export default function RNASeqPage() {
  const s = useCSV<R>('rnaseq_studies.csv')
  const d = useCSV<R>('rnaseq_datasets.csv')
  const m = useCSV<R>('rnaseq_metaqtl_support.csv')
  const [group, setGroup] = useState('')
  const groups = useMemo(() => Array.from(new Set(s.data.map((x) => x.trait_group))).sort(), [s.data])
  const rows = useMemo(() => (group ? s.data.filter((x) => x.trait_group === group) : s.data), [s.data, group])
  return (
    <div>
      <PageHero
        eyebrow="Expression"
        title="RNA-seq studies"
        subtitle="Transcriptome studies of Amaranthus, grouped by the trait they address, with their NCBI BioProjects, and every RNA-seq dataset deposited in SRA. Results are quoted from the abstracts; the last table lists RNA-seq papers that report expression of the candidate genes of the meta-QTL."
        variant="side"
      />
      <AsyncBoundary loading={s.loading || d.loading || m.loading} error={s.error ?? d.error ?? m.error}>
        <div className="space-y-10">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
              <select className="input w-auto" value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Trait group">
                <option value="">All trait groups</option>
                {groups.map((g) => <option key={g}>{g}</option>)}
              </select>
              <span className="text-wheat-600">{s.data.length} studies · {s.data.filter((x) => x.bioprojects).length} with a BioProject</span>
            </div>
            <DataTable data={rows} columns={studies} filename="amaranthqtldb_rnaseq_studies.csv" />
          </div>
          <div>
            <h3 className="mb-2 font-serif text-xl text-wheat-900">RNA-seq evidence for meta-QTL candidate genes</h3>
            <DataTable data={m.data} columns={support} filename="amaranthqtldb_rnaseq_metaqtl_support.csv" pageSize={10} />
          </div>
          <div>
            <h3 className="mb-2 font-serif text-xl text-wheat-900">RNA-seq datasets in NCBI SRA</h3>
            <p className="mb-3 text-sm text-wheat-700">Every Amaranthus BioProject with transcriptomic runs ({d.data.reduce((a, x) => a + Number(x.runs || 0), 0)} runs). Datasets without a linked paper are unpublished or not yet connected to their publication in NCBI.</p>
            <DataTable data={d.data} columns={datasets} filename="amaranthqtldb_rnaseq_datasets.csv" />
          </div>
        </div>
      </AsyncBoundary>
    </div>
  )
}
