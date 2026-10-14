import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import PageHero from '../components/PageHero'
import DataTable from '../components/DataTable'
import AsyncBoundary from '../components/AsyncBoundary'
import LinkageMapViewer from '../components/LinkageMapViewer'
import { clip } from '../components/cells'
import { useCSV } from '../lib/useCSV'
import { LinkageMapRecord } from '../lib/types'

type G = { map_id: string; linkage_group: string; markers: string; length_cM: string }

export default function LinkageMapsPage() {
  const { data, loading, error } = useCSV<LinkageMapRecord & { marker_positions?: string }>('maps.csv')
  const lg = useCSV<G>('linkage_groups.csv')
  const cons = useCSV<Record<string, string>>('consensus_status.csv')
  const [selected, setSelected] = useState<string | null>(null)
  const [source, setSource] = useState('')
  const viewable = data.filter((m) => m.marker_positions === 'yes')
  const current = data.find((m) => m.map_id === (selected ?? viewable[0]?.map_id))
  const groups = lg.data.filter((g) => g.map_id === current?.map_id)
  const rows = useMemo(() => data.filter((m) => !source || m.source === source), [data, source])
  const sources = useMemo(() => Array.from(new Set(data.map((m) => m.source))), [data])

  const columns = useMemo<ColumnDef<LinkageMapRecord, any>[]>(() => [
    {
      id: 'view', header: 'View', enableSorting: false,
      cell: ({ row }) => (
        <button className="btn !px-2 !py-1 text-xs" onClick={() => { setSelected(row.original.map_id); document.getElementById('viewer')?.scrollIntoView({ behavior: 'smooth' }) }}>
          <Eye className="h-3.5 w-3.5" />View
        </button>
      ),
    },
    {
      id: 'download', header: 'Marker positions', enableSorting: false,
      cell: ({ row }) => row.original.marker_positions === 'yes' ? (
        <a className="underline" href={`${import.meta.env.BASE_URL}data/maps/${row.original.map_id}.csv`} download={`${row.original.map_id}_linkage_map.csv`}>CSV</a>
      ) : <span className="text-xs text-wheat-500" title={row.original.marker_positions}>not published</span>,
    },
    { accessorKey: 'map_id', header: 'ID' },
    { accessorKey: 'name', header: 'Map', cell: clip(300) },
    { accessorKey: 'source', header: 'Source' },
    { accessorKey: 'map_type', header: 'Type' },
    { accessorKey: 'species', header: 'Species', cell: clip(220) },
    { accessorKey: 'parents', header: 'Parents', cell: clip(240) },
    { id: 'n_linkage_groups', header: 'Linkage groups', accessorFn: (r) => Number(r.n_linkage_groups) },
    { id: 'n_loci', header: 'Loci', accessorFn: (r) => Number(r.n_loci) },
    { id: 'length_cm', header: 'Length (cM)', accessorFn: (r) => Number(r.length_cm) },
    { accessorKey: 'marker_types', header: 'Marker types', cell: clip(160) },
    { accessorKey: 'n_qtl', header: 'QTL on map' },
    {
      accessorKey: 'reference', header: 'Reference',
      cell: ({ row }) => {
        const r = row.original
        const inner = <span className="block truncate" style={{ maxWidth: 380 }} title={r.reference}>{r.reference}</span>
        return r.doi ? <a className="underline" href={r.doi} target="_blank" rel="noreferrer">{inner}</a> : inner
      },
    },
  ], [])

  return (
    <div>
      <PageHero
        eyebrow="Linkage maps"
        title="Genetic linkage maps"
        subtitle="Genetic maps of grain amaranth, waterhemp and interspecific crosses. Maps with published marker positions can be viewed and downloaded; for the others the per-linkage-group totals are shown."
        variant="side"
      />
      <AsyncBoundary loading={loading} error={error}>
        <div className="space-y-6">
          <div className="card" id="viewer">
            {current && (
              <>
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-wheat-900">{current.name}</h3>
                  <p className="text-sm text-wheat-600">
                    {current.map_id} · {current.source}{current.species ? ` · ${current.species}` : ''}{current.parents ? ` · ${current.parents}` : ''}
                  </p>
                </div>
                {current.marker_positions === 'yes' ? (
                  <LinkageMapViewer mapId={current.map_id} name={current.name} />
                ) : groups.length ? (
                  <div>
                    <p className="mb-3 text-sm text-wheat-600">Marker positions of this map are not published; the source gives these per-linkage-group totals.</p>
                    <div className="flex items-end gap-2 overflow-x-auto pb-2">
                      {(() => { const max = Math.max(...groups.map((g) => Number(g.length_cM) || 0)); return groups.map((g) => (
                        <div key={g.linkage_group} className="flex flex-col items-center gap-1" title={`LG${g.linkage_group}: ${g.markers} markers, ${g.length_cM} cM`}>
                          <span className="text-[10px] text-wheat-500">{Number(g.length_cM).toFixed(0)}</span>
                          <div className="w-5 rounded-full border border-wheat-400 bg-accent-soft" style={{ height: `${Math.max(8, (Number(g.length_cM) / max) * 220)}px` }} />
                          <span className="text-xs text-wheat-700">{g.linkage_group}</span>
                        </div>
                      )) })()}
                    </div>
                    <p className="text-xs text-wheat-500">Bar height ∝ length (cM, value above); hover for marker counts.</p>
                  </div>
                ) : <p className="text-sm text-wheat-600">Catalogue entry only: neither marker positions nor per-group totals could be retrieved ({current.marker_positions}).</p>}
              </>
            )}
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <select className="input w-auto" value={source} onChange={(e) => setSource(e.target.value)} aria-label="Source">
                <option value="">All sources</option>
                {sources.map((s) => <option key={s}>{s}</option>)}
              </select>
              <span className="text-sm text-wheat-600">
                {data.length} maps · {data.reduce((a, m) => a + (Number(m.n_loci) || 0), 0).toLocaleString()} markers in total
              </span>
            </div>
            <DataTable data={rows} columns={columns} filename="amaranthqtldb_linkage_maps.csv" pageSize={10} />
          </div>
          <div className="card">
            <h3 className="font-semibold text-wheat-900">Consensus maps</h3>
            <p className="mt-1 text-sm text-wheat-700">A consensus map (LPmerge) needs at least two maps of one species with published marker positions and shared markers. Status per species:</p>
            <ul className="mt-2 space-y-1 text-sm text-wheat-700">
              {cons.data.map((c) => <li key={c.species}><em>{c.species}</em>: {c.consensus_built === 'TRUE' ? 'built' : 'not possible'} - {c.note}</li>)}
            </ul>
          </div>
        </div>
      </AsyncBoundary>
    </div>
  )
}
