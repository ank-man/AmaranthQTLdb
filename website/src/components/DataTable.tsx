import { useMemo, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, HelpCircle, Search } from 'lucide-react'
import { downloadCSV } from '../lib/csv'

interface Props<T extends object> {
  data: T[]
  columns: ColumnDef<T, any>[]
  filename?: string
  searchableKeys?: (keyof T)[]
  pageSize?: number
}

export default function DataTable<T extends object>({
  data,
  columns,
  filename = 'data.csv',
  searchableKeys,
  pageSize = 25,
}: Props<T>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const filtered = useMemo(() => {
    if (!globalFilter) return data
    const q = globalFilter.toLowerCase()
    const keys = searchableKeys ?? (Object.keys(data[0] ?? {}) as (keyof T)[])
    return data.filter((row) =>
      keys.some((k) => String((row as any)[k] ?? '').toLowerCase().includes(q)),
    )
  }, [data, globalFilter, searchableKeys])

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-wheat-500" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search across all fields…"
            className="input pl-8"
          />
        </div>
        <span className="badge">{filtered.length.toLocaleString()} rows</span>
        <span className="hidden text-xs text-wheat-500 sm:inline">Hover a column's <HelpCircle className="inline h-3 w-3 align-text-bottom" /> for its definition</span>
        <button
          className="btn"
          onClick={() => downloadCSV(filename, filtered)}
          disabled={!filtered.length}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="max-h-[72vh] overflow-auto rounded border border-wheat-200 bg-wheat-50">
        <table className="min-w-full divide-y divide-wheat-200 text-sm">
          <thead className="sticky top-0 z-[5] border-b border-wheat-300 bg-wheat-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="cursor-pointer whitespace-nowrap px-3 py-2 text-left text-[13px] font-semibold text-wheat-800"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                      {h.column.getIsSorted() === 'asc' && ' ▲'}
                      {h.column.getIsSorted() === 'desc' && ' ▼'}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-wheat-100 bg-wheat-50">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-wheat-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-3 py-1.5 align-top text-wheat-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {!table.getRowModel().rows.length && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-wheat-600">
                  No matching records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input w-auto"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100, 250].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          <button className="btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
