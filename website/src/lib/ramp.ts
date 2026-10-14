import { useEffect, useState } from 'react'

// Sequential ramps for "how much": always low = recedes into the surface, high = stands out.
// On the dark theme that means dark -> bright; on light themes, pale -> dark.
const LIGHT = ['#eef4fc', '#c6dcf6', '#93bdee', '#5a9ae3', '#2a78d6', '#1a57a6', '#0d2f5c']
const DARK = ['#101c30', '#123250', '#135a78', '#168c9a', '#2dd4bf', '#8cf0df', '#eafffb']

export const isDarkTheme = (theme: string) => theme === 'neon'

/** Current theme id; re-renders the caller when the picker changes it. */
export function useTheme(): string {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'wheat')
  useEffect(() => {
    const on = () => setTheme(document.documentElement.dataset.theme || 'wheat')
    window.addEventListener('cq-theme', on)
    return () => window.removeEventListener('cq-theme', on)
  }, [])
  return theme
}

export function rampStops(theme: string): string[] {
  return isDarkTheme(theme) ? DARK : LIGHT
}

export function rampColor(theme: string, t: number): string {
  const stops = rampStops(theme)
  const x = Math.max(0, Math.min(1, t)) * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(x))
  const f = x - i
  const a = stops[i].match(/\w\w/g)!.map((h) => parseInt(h, 16))
  const b = stops[i + 1].match(/\w\w/g)!.map((h) => parseInt(h, 16))
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`
}
