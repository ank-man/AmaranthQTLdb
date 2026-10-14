import { ReactNode, useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  BarChart3, BookOpen, Crosshair, Database, Dna, Flame, Flower2, GitBranch, GraduationCap, HelpCircle, Home, Info,
  Layers, Lightbulb, Link2, Mail, Map as MapIcon, Network, PanelLeftClose, PanelLeftOpen, Quote, Radar, Route, Search,
} from 'lucide-react'

type Item = { to: string; label: string; icon: typeof Home; end?: boolean }

// Every destination lives in the sidebar, grouped the way the resource is used.
const SECTIONS: { title: string; items: Item[] }[] = [
  { title: 'Explore', items: [
    { to: '/', label: 'Overview', icon: Home, end: true },
    { to: '/search', label: 'Advanced search', icon: Search },
    { to: '/data', label: 'All data tables', icon: Database, end: true },
  ] },
  { title: 'Loci', items: [
    { to: '/data/qtl', label: 'QTL & mapped loci', icon: Database },
    { to: '/data/gwas', label: 'GWAS loci', icon: Radar },
    { to: '/data/metaqtl', label: 'Meta-QTL', icon: GitBranch },
    { to: '/data/clusters', label: 'Multi-trait clusters', icon: Layers },
    { to: '/data/inheritance', label: 'Inheritance studies', icon: Dna },
    { to: '/markers', label: 'PCR markers', icon: Crosshair },
  ] },
  { title: 'Maps', items: [
    { to: '/map', label: 'Genome map', icon: MapIcon },
    { to: '/linkage-maps', label: 'Linkage maps', icon: Route },
    { to: '/assemblies', label: 'Assemblies & conversion', icon: Network },
  ] },
  { title: 'Analysis', items: [
    { to: '/figures', label: 'Figures', icon: Flame },
    { to: '/statistics', label: 'Statistics', icon: BarChart3 },
    { to: '/literature', label: 'Studies', icon: BookOpen },
  ] },
  { title: 'About', items: [
    { to: '/about', label: 'About & sources', icon: Info },
    { to: '/faq', label: 'FAQ & methods', icon: HelpCircle },
    { to: '/tutorial', label: 'Tutorial', icon: GraduationCap },
    { to: '/credits', label: 'How to cite', icon: Quote },
    { to: '/links', label: 'Related resources', icon: Link2 },
    { to: '/contact', label: 'Contact', icon: Mail },
  ] },
]

function SideNav() {
  return (
    <nav className="h-full overflow-y-auto px-5 py-6">
      {SECTIONS.map((s) => (
        <div key={s.title} className="mb-6">
          <div className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-wheat-500">{s.title}</div>
          {s.items.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={{ borderRadius: 'calc(var(--radius) - 2px)' }}
              className={({ isActive }) =>
                `-mx-2 block px-3 py-1.5 text-[15px] leading-snug transition ${
                  isActive ? 'bg-accent-soft font-semibold text-accent' : 'text-wheat-700 hover:bg-wheat-100 hover:text-wheat-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}

const THEMES: [string, string, string][] = [
  ['amaranth', 'Amaranth', '#9b1b4a'],
  ['wheat', 'WheatQTLdb', '#15803d'],
  ['harvest', 'Harvest', '#cc9d3f'],
  ['cotton', 'Forest', '#1f4d3a'],
  ['ocean', 'Ocean', '#0f5b6e'],
  ['indigo', 'Indigo', '#3730a3'],
  ['neon', 'Neon (dark)', '#0b1220'],
]

function ThemePicker() {
  const [theme, setTheme] = useState(() => localStorage.getItem('aq-theme') || 'amaranth')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('aq-theme', theme)
    window.dispatchEvent(new Event('aq-theme'))
  }, [theme])
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Colour theme">
      {THEMES.map(([id, label, color]) => (
        <button
          key={id}
          role="radio"
          aria-checked={theme === id}
          title={`${label} theme`}
          onClick={() => setTheme(id)}
          className="h-5 w-5 rounded-full transition"
          style={{ background: color, boxShadow: theme === id ? '0 0 0 2px rgb(var(--bar)), 0 0 0 4px rgb(var(--bar-ink))' : '0 0 0 1px rgb(var(--bar-ink) / 0.25)' }}
        />
      ))}
    </div>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  // open by default on screens wide enough to hold it beside the content
  const [open, setOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth >= 768))
  const location = useLocation()
  // on small screens the sidebar is an overlay: close it after choosing a page
  useEffect(() => { if (window.innerWidth < 768) setOpen(false) }, [location.pathname])

  return (
    <div className="min-h-screen bg-page">
      <header className="site-bar fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-4 px-4 sm:px-5" style={{ background: 'rgb(var(--bar))', borderBottom: '1px solid rgb(var(--bar-line))', color: 'rgb(var(--bar-ink))' }}>
        <button className="p-1 opacity-80 hover:opacity-100" onClick={() => setOpen(!open)} aria-label={open ? 'Hide menu' : 'Show menu'} aria-expanded={open}>
          {open ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </button>
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-serif text-[22px] tracking-tight">Amaranth<span className="bar-accent">QTL</span>db</span>
          <span className="hidden text-sm opacity-70 md:inline">QTL, GWAS loci and meta-QTL of <em>Amaranthus</em></span>
        </Link>
        <span className="flex-1" />
        <ThemePicker />
        <span className="mx-1 hidden h-5 w-px sm:block" style={{ background: 'rgb(var(--bar-ink) / 0.2)' }} />
        <Link to="/search" className="text-sm underline-offset-4 hover:underline">Search</Link>
        <Link to="/data" className="hidden text-sm underline-offset-4 hover:underline sm:inline">Data</Link>
        <Link to="/about" className="hidden text-sm underline-offset-4 hover:underline sm:inline">About</Link>
      </header>

      {/* sidebar: beside the content from 768 px, an overlay below that */}
      <aside
        className={`fixed bottom-0 left-0 top-14 z-30 w-64 border-r border-wheat-200 bg-wheat-50 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SideNav />
      </aside>
      {open && <div className="fixed inset-0 top-14 z-20 bg-black/30 md:hidden" onClick={() => setOpen(false)} />}

      <div className={`flex min-h-screen flex-col pt-14 ${open ? 'md:pl-64' : ''}`}>
        <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</main>
        <footer className="border-t border-wheat-200 bg-wheat-50">
          <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-wheat-600 sm:px-6 lg:px-10">
            <span>© {new Date().getFullYear()} AmaranthQTLdb · compiled by Ankush Sharma, University of Georgia</span>
            <span className="flex flex-wrap gap-4">
              <Link className="hover:underline" to="/faq">Methods and limits</Link>
              <Link className="hover:underline" to="/credits">How to cite</Link>
              <Link className="hover:underline" to="/contact">Contact</Link>
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
