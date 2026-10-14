import { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  image?: string
  variant?: 'cover' | 'side'
  children?: ReactNode
}

/** Page title block: section name, title, one-paragraph description, then a rule. */
export default function PageHero({ eyebrow, title, subtitle, children }: Props) {
  return (
    <header className="panel mb-6 border-l-4 border-l-accent px-6 py-5">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1 className="mt-1 font-serif text-3xl text-wheat-900 sm:text-[2.1rem]">{title}</h1>
      {subtitle && <p className="mt-2 max-w-5xl leading-relaxed text-wheat-700">{subtitle}</p>}
      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </header>
  )
}
