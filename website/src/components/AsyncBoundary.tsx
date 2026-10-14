import { ReactNode } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface Props {
  loading: boolean
  error: string | null
  children: ReactNode
  empty?: boolean
  emptyMessage?: string
}

export default function AsyncBoundary({ loading, error, empty, emptyMessage, children }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded border border-wheat-200 bg-wheat-50 p-6 text-wheat-700">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-start gap-2 rounded border border-red-300 bg-red-50 p-4 text-red-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <div>
          <div className="font-semibold">Failed to load data</div>
          <div className="text-sm">{error}</div>
          {/* A visitor sees this, not a developer: the table failing to load
              is a network or deployment problem, never something they can fix
              by putting a file somewhere. Telling them to "add your CSV files
              to public/data" is both useless and alarming - it reads as if the
              database were empty. */}
          <div className="mt-2 text-xs opacity-80">
            This is a problem loading the page, not missing data. Reloading usually fixes it;
            if it persists, please let us know via the Contact page.
          </div>
          <button className="btn mt-3 text-xs" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    )
  }
  if (empty) {
    return (
      <div className="rounded border border-wheat-200 bg-wheat-50 p-6 text-wheat-700">
        {emptyMessage ?? 'No data yet.'}
      </div>
    )
  }
  return <>{children}</>
}
