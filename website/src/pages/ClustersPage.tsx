import { ColumnDef } from '@tanstack/react-table'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { clip } from '../components/cells'
import { useCSV } from '../lib/useCSV'

type C = Record<string, string>
const columns: ColumnDef<C, any>[] = [
  { accessorKey: 'cluster', header: 'Cluster' },
  { accessorKey: 'chromosome', header: 'Chr (v2.1)' },
  { id: 'region', header: 'Region (Mb, v2.1)', accessorFn: (r) => `${(Number(r.start_bp) / 1e6).toFixed(2)}–${(Number(r.end_bp) / 1e6).toFixed(2)}` },
  { accessorKey: 'trait_groups', header: 'Trait groups', cell: clip(320) },
  { id: 'n', header: 'Trait groups (n)', accessorFn: (r) => Number(r.n_trait_groups) },
  { id: 'loci', header: 'Loci', accessorFn: (r) => Number(r.loci) },
  { accessorKey: 'studies', header: 'Studies', cell: clip(300) },
  { accessorKey: 'locus_ids', header: 'Locus IDs', cell: clip(260) },
]

export default function ClustersPage() {
  const { data, loading, error } = useCSV<C>('clusters.csv')
  return (
    <div>
      <PageHero
        eyebrow="Analysis"
        title="Multi-trait clusters"
        subtitle="Regions of the grain-amaranth genome where significant loci of two or more trait groups overlap, supported by at least two studies or by a QTL from a mapping population. They are candidate pleiotropic or tightly linked regions, not replicated loci of one trait."
        variant="side"
      />
      <AsyncBoundary loading={loading} error={error}>
        <DataTable data={data} columns={columns} filename="amaranthqtldb_clusters.csv" />
      </AsyncBoundary>
    </div>
  )
}
