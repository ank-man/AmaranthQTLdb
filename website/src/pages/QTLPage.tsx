import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { useCSV } from '../lib/useCSV'
import { QTLRecord } from '../lib/types'
import { lociColumns } from '../lib/lociColumns'

const columns = lociColumns({ type: true })

export default function QTLPage() {
  const { data, loading, error } = useCSV<QTLRecord>('qtl.csv')
  return (
    <div>
      <PageHero
        eyebrow="Data"
        title="QTL and mapped loci"
        subtitle="QTL from bi-parental and pseudo-F2 mapping populations, Mendelian loci mapped on linkage maps, and sex-linked regions. Positions are as published; the Map position column gives each locus on the current assembly of its species."
        variant="side"
      />
      <AsyncBoundary loading={loading} error={error}>
        <DataTable data={data} columns={columns} filename="amaranthqtldb_qtl.csv" />
      </AsyncBoundary>
    </div>
  )
}
