import { ColumnDef } from '@tanstack/react-table'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { clip } from '../components/cells'
import { useCSV } from '../lib/useCSV'

type R = Record<string, string>
const columns: ColumnDef<R, any>[] = [
  { accessorKey: 'year', header: 'Year' },
  { accessorKey: 'species', header: 'Species', cell: clip(200) },
  { accessorKey: 'trait', header: 'Trait', cell: clip(240) },
  { accessorKey: 'inheritance_statements', header: 'Inheritance (quoted from the abstract)', cell: clip(520) },
  { accessorKey: 'first_author', header: 'First author' },
  { accessorKey: 'journal', header: 'Journal', cell: clip(200) },
  {
    accessorKey: 'title', header: 'Title',
    cell: ({ row }) => <a className="underline" href={`https://doi.org/${row.original.doi}`} target="_blank" rel="noreferrer"><span className="block truncate" style={{ maxWidth: 360 }} title={row.original.title}>{row.original.title}</span></a>,
  },
]

export default function InheritancePage() {
  const { data, loading, error } = useCSV<R>('inheritance.csv')
  return (
    <div>
      <PageHero
        eyebrow="Data"
        title="Classical inheritance studies"
        subtitle="Segregation analyses that report how a trait is inherited (single dominant gene, maternal, polygenic …) without a genomic position. The statements are quoted verbatim from each abstract."
        variant="side"
      />
      <AsyncBoundary loading={loading} error={error}>
        <DataTable data={data} columns={columns} filename="amaranthqtldb_inheritance.csv" />
      </AsyncBoundary>
    </div>
  )
}
