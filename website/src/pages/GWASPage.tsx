import { useMemo, useState } from 'react'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import { useCSV } from '../lib/useCSV'
import { QTLRecord } from '../lib/types'
import { lociColumns } from '../lib/lociColumns'

const columns = lociColumns({ type: true })

export default function GWASPage() {
  const { data, loading, error } = useCSV<QTLRecord>('gwas.csv')
  const [sigOnly, setSigOnly] = useState(false)
  const rows = useMemo(() => (sigOnly ? data.filter((r) => r.evidence === 'significant') : data), [data, sigOnly])
  return (
    <div>
      <PageHero
        eyebrow="Data"
        title="GWAS loci"
        subtitle="Marker-trait associations (MTA) and quantitative trait nucleotides (QTN) from genome-wide association studies of grain, vegetable and weedy amaranths."
        variant="side"
      />
      <AsyncBoundary loading={loading} error={error}>
        <label className="mb-3 inline-flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-wheat-600" checked={sigOnly} onChange={(e) => setSigOnly(e.target.checked)} />
          Significant associations only (hide 0.001 &lt; P ≤ 0.01)
        </label>
        <DataTable data={rows} columns={columns} filename="amaranthqtldb_gwas.csv" />
      </AsyncBoundary>
    </div>
  )
}
