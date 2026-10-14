import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { clip } from '../components/cells'
import { useCSV } from '../lib/useCSV'

type M = Record<string, string>
const columns: ColumnDef<M, any>[] = [
  { accessorKey: 'marker', header: 'Marker / assay', cell: clip(200) },
  { accessorKey: 'species', header: 'Species', cell: clip(180) },
  { accessorKey: 'trait', header: 'Trait', cell: clip(240) },
  { accessorKey: 'target', header: 'Target', cell: clip(220) },
  { accessorKey: 'assay', header: 'Assay' },
  { accessorKey: 'primer_name', header: 'Primer' },
  { accessorKey: 'sequence_5_3', header: "Sequence (5'→3')", cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue() ?? '')}</span> },
  { accessorKey: 'chromosome', header: 'Chr' },
  { accessorKey: 'position', header: 'Position', cell: clip(180) },
  { accessorKey: 'reference_genome', header: 'Assembly', cell: clip(180) },
  { accessorKey: 'validation', header: 'How it was validated', cell: clip(380) },
  { accessorKey: 'primers_available', header: 'Primers' },
  {
    accessorKey: 'doi', header: 'Reference',
    cell: ({ row }) => (row.original.doi.startsWith('10.') ? <a className="underline" href={`https://doi.org/${row.original.doi}`} target="_blank" rel="noreferrer">{row.original.doi}</a> : row.original.doi),
  },
]

export default function MarkersPage() {
  const { data, loading, error } = useCSV<M>('markers.csv')
  const [withSeq, setWithSeq] = useState(false)
  const rows = useMemo(() => (withSeq ? data.filter((m) => m.sequence_5_3) : data), [data, withSeq])
  const n = new Set(data.map((m) => m.marker)).size
  return (
    <div>
      <PageHero
        eyebrow="Markers"
        title="Validated PCR markers"
        subtitle="PCR assays (allele-specific PCR, KASP, CAPS/dCAPS, TaqMan, HRM, sex-specific PCR) that their authors tested against plants of known phenotype or genotype. Every primer sequence was checked character by character against the paper it was copied from; assays published only behind a paywall are listed without sequences."
        variant="side"
      />
      <AsyncBoundary loading={loading} error={error}>
        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm">
          <span className="text-wheat-700">{n} assays · {data.filter((m) => m.sequence_5_3).length} primer sequences</span>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-wheat-600" checked={withSeq} onChange={(e) => setWithSeq(e.target.checked)} />
            With primer sequences only
          </label>
        </div>
        <DataTable data={rows} columns={columns} filename="amaranthqtldb_pcr_markers.csv" />
      </AsyncBoundary>
    </div>
  )
}
