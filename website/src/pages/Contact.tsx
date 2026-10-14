import { Github } from 'lucide-react'
import PageHero from '../components/PageHero'

export default function Contact() {
  return (
    <div>
      <PageHero eyebrow="Get in touch" title="Contact" subtitle="Corrections, missing studies and data contributions are welcome." variant="side" />
      <div className="card max-w-2xl space-y-3 text-sm leading-relaxed text-wheat-700">
        <p>To report a wrong record, give its ID (for example <code>AQ00012</code>) and what the source paper says. Missing studies are best reported with a DOI.</p>
        <p>AmaranthQTLdb is compiled and maintained by <strong>Ankush Sharma</strong>, University of Georgia.</p>
        <p className="flex items-center gap-2">
          <Github className="h-4 w-4 text-wheat-600" />
          <a className="underline" href="https://github.com/ank-man/AmaranthQTLdb/issues" target="_blank" rel="noreferrer">github.com/ank-man/AmaranthQTLdb</a>
          <span className="text-wheat-500">- open an issue</span>
        </p>
      </div>
    </div>
  )
}
