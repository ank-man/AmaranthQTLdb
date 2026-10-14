import { ColumnDef } from '@tanstack/react-table'
import GlossaryHeader from './GlossaryHeader'
import { referenceUrl } from '../lib/map'

/** Reference column shared by every data table: short citation linked to its DOI / PubMed page. */
export function referenceColumn<T extends { reference?: string; doi?: string }>(): ColumnDef<T, any> {
  return {
    accessorKey: 'reference',
    header: 'Reference',
    cell: ({ row }) => {
      const r = row.original
      const url = referenceUrl(r)
      return url ? (
        <a className="underline" href={url} target="_blank" rel="noreferrer">{r.reference || 'link'}</a>
      ) : (r.reference || '')
    },
  }
}

export function evidenceColumn<T extends { evidence?: string }>(): ColumnDef<T, any> {
  return {
    accessorKey: 'evidence',
    header: () => <GlossaryHeader label="Evidence" term="evidence" />,
    cell: ({ getValue }) => {
      const v = String(getValue() ?? '')
      return <span className={`badge ${v.startsWith('suggestive') ? '' : 'border-accent/30 bg-wheat-50 text-accent'}`}>{v.startsWith('suggestive') ? 'suggestive' : v}</span>
    },
  }
}

/** Long free-text cell clipped to one line, full text on hover. */
export function clip(max = 280) {
  return ({ getValue }: { getValue: () => unknown }) => {
    const v = String(getValue() ?? '')
    return <span className="block truncate" style={{ maxWidth: max }} title={v}>{v}</span>
  }
}
