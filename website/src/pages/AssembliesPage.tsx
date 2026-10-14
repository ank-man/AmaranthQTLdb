import { ColumnDef } from '@tanstack/react-table'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { clip } from '../components/cells'
import { useCSV } from '../lib/useCSV'
import { GENOMES } from '../lib/map'

type R = Record<string, string>
const asm: ColumnDef<R, any>[] = [
  { accessorKey: 'assembly_key', header: 'Key' },
  { accessorKey: 'species', header: 'Species', cell: clip(200) },
  { accessorKey: 'assembly', header: 'Assembly', cell: clip(320) },
  { accessorKey: 'source', header: 'Source', cell: clip(260) },
  { accessorKey: 'used_as_target_for', header: 'Target of', cell: clip(320) },
]
const conv: ColumnDef<R, any>[] = [
  { accessorKey: 'locus_id', header: 'Locus' },
  { accessorKey: 'study_id', header: 'Study' },
  { accessorKey: 'source_assembly', header: 'Published on' },
  { accessorKey: 'source_chromosome', header: 'Chr' },
  { id: 'src', header: 'Published position', accessorFn: (r) => (r.source_start ? `${r.source_start}-${r.source_end}` : r.source_peak) },
  { accessorKey: 'target_assembly', header: 'Converted to' },
  { accessorKey: 'target_chromosome', header: 'Chr' },
  { id: 'tgt', header: 'Converted position', accessorFn: (r) => (r.target_start ? `${r.target_start}-${r.target_end}` : r.target_peak) },
  { accessorKey: 'status', header: 'Status', cell: clip(320) },
]

export default function AssembliesPage() {
  const a = useCSV<R>('assemblies.csv')
  const c = useCSV<R>('coordinates_lifted.csv')
  return (
    <div>
      <PageHero
        eyebrow="Genomes"
        title="Assemblies and coordinate conversion"
        subtitle="Positions are kept as published and converted to one current chromosome-level assembly per species. Within an accession the assemblies are aligned whole with minimap2 and each position is lifted through the alignment; between different plants, 20 kb of sequence around each position is aligned to the target. Conversions that split across chromosomes or convert at one end only are flagged, not forced."
        variant="side"
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {Object.entries(GENOMES).map(([k, g]) => (
          <div key={k} className="card">
            <div className="eyebrow">{k}</div>
            <h3 className="mt-1 font-semibold text-wheat-900">{g.label}</h3>
            <p className="mt-1 text-sm text-wheat-700">{g.assembly} · <a className="underline" href={`https://www.ncbi.nlm.nih.gov/datasets/genome/${g.accession}/`} target="_blank" rel="noreferrer">{g.accession}</a></p>
            <p className="mt-1 text-sm text-wheat-600">{Object.keys(g.chromosomes).length} chromosomes, {(Object.values(g.chromosomes).reduce((x, y) => x + y, 0) / 1e6).toFixed(0)} Mb. Used for: {g.covers}.</p>
          </div>
        ))}
      </div>
      <AsyncBoundary loading={a.loading || c.loading} error={a.error ?? c.error}>
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 font-serif text-xl text-wheat-900">Assemblies used</h3>
            <DataTable data={a.data} columns={asm} filename="amaranthqtldb_assemblies.csv" pageSize={10} />
          </div>
          <div>
            <h3 className="mb-2 font-serif text-xl text-wheat-900">Converted coordinates</h3>
            <DataTable data={c.data} columns={conv} filename="amaranthqtldb_coordinates_lifted.csv" />
          </div>
        </div>
      </AsyncBoundary>
    </div>
  )
}
