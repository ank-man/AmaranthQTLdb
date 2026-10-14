import { HelpCircle } from 'lucide-react'
import { GLOSSARY, GlossaryTerm } from '../lib/glossary'

/** Column header label with a hover-defined term, so PVE, LOD, cM/bp etc.
 * are defined once (lib/glossary.ts) and explained right where a reader
 * meets them in a data table, not only buried in the FAQ. */
export default function GlossaryHeader({ label, term }: { label: string; term: GlossaryTerm }) {
  return (
    <span className="inline-flex items-center gap-1" title={GLOSSARY[term]}>
      {label}
      <HelpCircle className="h-3 w-3 flex-shrink-0 text-wheat-400" aria-hidden="true" />
    </span>
  )
}
