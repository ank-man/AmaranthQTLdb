import Papa from 'papaparse'

const cache = new Map<string, unknown[]>()

export async function loadCSV<T>(path: string): Promise<T[]> {
  if (cache.has(path)) return cache.get(path) as T[]
  const url = `${import.meta.env.BASE_URL}data/${path}`

  // Opening the built index.html straight from disk is the one failure mode
  // that looks like broken data but is not: on file:// every fetch of a
  // relative path is blocked by the browser's origin rules, so every table on
  // every page reports a load failure while the CSVs sit there intact. Say so,
  // rather than letting it surface as an opaque "Failed to fetch".
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    throw new Error(
      'This page was opened directly from a file, and browsers block pages ' +
      'served that way from reading data files. Serve the folder over HTTP ' +
      'instead - "npm run preview" in the project, or ' +
      '"python3 -m http.server" inside dist/ - and open the address it prints.'
    )
  }

  let res: Response
  try {
    res = await fetch(url)
  } catch (e) {
    throw new Error(`Could not reach ${url} (${e instanceof Error ? e.message : String(e)})`)
  }
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
  const text = await res.text()
  const parsed = Papa.parse<T>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (h) => h.trim(),
  })
  if (parsed.errors.length) {
    const first = parsed.errors[0]
    throw new Error(`Invalid CSV in ${path} at row ${first.row ?? '?'}: ${first.message}`)
  }
  const rows = (parsed.data as T[]).filter(Boolean)
  cache.set(path, rows as unknown[])
  return rows
}

export function toCSV<T extends object>(rows: T[]): string {
  return Papa.unparse(rows)
}

export function downloadCSV(filename: string, rows: object[]) {
  const csv = toCSV(rows as Record<string, unknown>[])
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
