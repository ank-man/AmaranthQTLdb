import { ReactNode } from 'react'

/** A static analysis figure (PNG shown, SVG/PNG downloadable) with its takeaway and caption. */
export default function Figure({ name, title, children }: { name: string; title: string; children: ReactNode }) {
  const base = `${import.meta.env.BASE_URL}figures/${name}`
  return (
    <figure className="card">
      <img src={`${base}.png`} alt={title} loading="lazy" className="w-full rounded border border-wheat-200" />
      <figcaption className="mt-3 text-sm leading-relaxed text-wheat-700">{children}</figcaption>
      <div className="mt-2 text-xs text-wheat-500">
        Download: <a className="underline" href={`${base}.svg`} download>SVG</a> ·{' '}
        <a className="underline" href={`${base}.png`} download>PNG</a>
      </div>
    </figure>
  )
}
