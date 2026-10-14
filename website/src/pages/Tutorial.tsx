import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

const STEPS: { title: string; to: string; cta: string; text: string }[] = [
  { title: '1. Find the loci for a trait', to: '/search?trait=Phenology', cta: 'Search phenology',
    text: 'In Advanced search choose a trait category and then a trait (e.g. Days to flowering). Narrow by species, chromosome, minimum PVE, or tick “Significant only” to hide suggestive GWAS associations. Export the result as CSV.' },
  { title: '2. See them on the genome', to: '/map', cta: 'Open the map',
    text: 'The Genome map draws loci and meta-QTL on the current assembly of each species. Pick the genome (grain amaranth, waterhemp or Palmer amaranth), switch between ideogram and Circos, highlight trait categories and export the figure.' },
  { title: '3. Use replicated regions', to: '/data/metaqtl', cta: 'Open meta-QTL',
    text: 'Meta-QTL are loci supported by two or more independent studies, with their 95% interval on v2.1 and v3 and the candidate genes the studies proposed. Multi-trait clusters list regions shared by different traits.' },
  { title: '4. Convert coordinates', to: '/assemblies', cta: 'Open assemblies',
    text: 'Every locus keeps its published position and assembly. The Assemblies page gives its position on the current assembly of its species and says how well it converted.' },
  { title: '5. Get a marker for the lab', to: '/markers', cta: 'Open PCR markers',
    text: 'Validated PCR markers (KASP, allele-specific PCR, HRM, sex-specific PCR) with primer sequences checked against their source.' },
  { title: '6. Go back to the source', to: '/literature', cta: 'Open studies',
    text: 'Every record links to its paper and names the table it was copied from. The Studies page lists all screened studies, including those whose loci could not be extracted and why.' },
]

export default function Tutorial() {
  return (
    <div>
      <PageHero eyebrow="Documentation" title="Tutorial" subtitle="Six common tasks, each a couple of clicks." variant="side" />
      <div className="space-y-4">
        {STEPS.map((s) => (
          <div key={s.title} className="card flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-wheat-900">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-wheat-700">{s.text}</p>
            </div>
            <Link to={s.to} className="btn flex-shrink-0">{s.cta}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
