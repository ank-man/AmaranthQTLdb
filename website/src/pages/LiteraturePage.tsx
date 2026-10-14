import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { clip } from '../components/cells'
import { useCSV } from '../lib/useCSV'

type S = Record<string, string>
const columns: ColumnDef<S, any>[] = [
  { accessorKey: 'year', header: 'Year' },
  {
    accessorKey: 'title', header: 'Title',
    cell: ({ row }) => <a className="underline" href={row.original.doi_url} target="_blank" rel="noreferrer"><span className="block truncate" style={{ maxWidth: 420 }} title={row.original.title}>{row.original.title}</span></a>,
  },
  { accessorKey: 'authors', header: 'Authors', cell: clip(160) },
  { accessorKey: 'journal', header: 'Journal', cell: clip(200) },
  { accessorKey: 'species', header: 'Species', cell: clip(220) },
  { accessorKey: 'design', header: 'Design', cell: clip(320) },
  { accessorKey: 'reference_genome', header: 'Assembly', cell: clip(200) },
  { id: 'records', header: 'Loci', accessorFn: (r) => Number(r.records || 0) },
  { accessorKey: 'extracted', header: 'Extracted' },
  { accessorKey: 'why_not', header: 'Why not extracted', cell: clip(320) },
]

export default function LiteraturePage() {
  const { data, loading, error } = useCSV<S>('literature.csv')
  const [only, setOnly] = useState(false)
  const rows = useMemo(() => (only ? data.filter((s) => s.extracted === 'yes') : data), [data, only])
  return (
    <div>
      <PageHero
        eyebrow="Literature"
        title="Studies"
        subtitle="Every Amaranthus mapping study found by the Europe PMC, Crossref, species-by-species and web searches. Studies whose loci could not be extracted are listed with the reason, so the gaps are visible."
        variant="side"
      />
      <AsyncBoundary loading={loading} error={error}>
        <label className="mb-3 inline-flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-wheat-600" checked={only} onChange={(e) => setOnly(e.target.checked)} />
          Only studies with loci in the database
        </label>
        <DataTable data={rows} columns={columns} filename="amaranthqtldb_studies.csv" />
      </AsyncBoundary>
    </div>
  )
}
