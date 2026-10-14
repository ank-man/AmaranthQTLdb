import { useEffect, useState } from 'react'

const cache = new Map<string, unknown>()

export function useJSON<T>(path: string) {
  const [data, setData] = useState<T | null>((cache.get(path) as T) ?? null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cache.has(path)) return
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/${path}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${path}: ${r.status}`)
        return r.json()
      })
      .then((j) => {
        cache.set(path, j)
        if (!cancelled) setData(j as T)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      cancelled = true
    }
  }, [path])

  return { data, loading: !data && !error, error }
}
