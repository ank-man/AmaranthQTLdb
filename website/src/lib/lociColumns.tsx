import { ColumnDef } from '@tanstack/react-table'
import GlossaryHeader from '../components/GlossaryHeader'
import { clip, evidenceColumn, referenceColumn } from '../components/cells'
import { QTLRecord } from './types'

const mapPos = (r: QTLRecord) =>
  r.map_bp ? `${r.map_chromosome} ${(Number(r.map_bp) / 1e6).toFixed(2)} Mb` : ''

/** Columns shared by the QTL, GWAS and search tables. */
export function lociColumns(opts: { type?: boolean } = {}): ColumnDef<QTLRecord, any>[] {
  return [
    ...(opts.type ? [{ accessorKey: 'record_type', header: () => <GlossaryHeader label="Type" term="record_type" /> } as ColumnDef<QTLRecord, any>] : []),
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'species', header: 'Species', cell: clip(200) },
    { accessorKey: 'trait', header: () => <GlossaryHeader label="Category" term="trait" /> },
    { accessorKey: 'parameter', header: () => <GlossaryHeader label="Trait" term="parameter" />, cell: clip(180) },
    { accessorKey: 'qtl_name', header: 'Locus', cell: clip(170) },
    { accessorKey: 'chromosome', header: () => <GlossaryHeader label="Chr" term="chromosome" /> },
    { accessorKey: 'position_interval', header: () => <GlossaryHeader label="Position (bp)" term="position_interval" /> },
    { accessorKey: 'ref_genome', header: () => <GlossaryHeader label="Assembly" term="ref_genome" />, cell: clip(170) },
    { id: 'map', header: () => <GlossaryHeader label="Map position" term="map_bp" />, accessorFn: mapPos },
    { accessorKey: 'lod', header: () => <GlossaryHeader label="LOD" term="lod" /> },
    { accessorKey: 'neg_log10_p', header: () => <GlossaryHeader label="−log10(P)" term="neg_log10_p" /> },
    { accessorKey: 'pve', header: () => <GlossaryHeader label="PVE %" term="pve" /> },
    { accessorKey: 'associated_markers', header: () => <GlossaryHeader label="Marker" term="associated_markers" />, cell: clip(170) },
    { accessorKey: 'candidate_gene', header: () => <GlossaryHeader label="Cand. gene" term="candidate_gene" />, cell: clip(180) },
    { accessorKey: 'population', header: () => <GlossaryHeader label="Population" term="population" />, cell: clip(180) },
    { accessorKey: 'environment', header: 'Environment', cell: clip(140) },
    { accessorKey: 'method', header: 'Method', cell: clip(200) },
    { accessorKey: 'source', header: 'Source table', cell: clip(200) },
    evidenceColumn<QTLRecord>(),
    referenceColumn<QTLRecord>(),
  ]
}
