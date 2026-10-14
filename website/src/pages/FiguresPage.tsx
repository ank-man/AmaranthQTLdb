import PageHero from '../components/PageHero'

const SPECIES: [string, string, string][] = [
  ['A_hypochondriacus', 'Amaranthus hypochondriacus (grain amaranth)', 'A. hypochondriacus v3. Black triangles / bars: meta-QTL.'],
  ['A_tricolor', 'Amaranthus tricolor (vegetable amaranth)', 'Drawn on A. hypochondriacus v3, the reference the panel was genotyped against.'],
  ['Amaranthus_spp_panels', 'Amaranthus spp. panels and interspecific crosses', 'Multi-species GWAS panels and the A. caudatus × A. quitensis cross, on A. hypochondriacus v3.'],
  ['A_tuberculatus', 'Amaranthus tuberculatus (waterhemp)', 'A. tuberculatus hap1.'],
  ['A_palmeri', 'Amaranthus palmeri (Palmer amaranth)', 'A. palmeri hap1.'],
]
const src = (f: string) => `${import.meta.env.BASE_URL}figures/${f}.png`

export default function FiguresPage() {
  return (
    <div>
      <PageHero
        eyebrow="Analysis"
        title="Figures"
        subtitle="Karyotypes (RIdeogram) and Circos plots (circlize) for every species, drawn on the current assembly of each with real chromosome lengths, plus the waterhemp linkage map with its QTL (LinkageMapView). Click an image for the full-size file."
        variant="side"
      />
      <figure className="card mb-8">
        <a href={src('summary_loci_by_species')} target="_blank" rel="noreferrer"><img src={src('summary_loci_by_species')} alt="Loci by species and trait category" className="w-full" /></a>
        <figcaption className="mt-2 text-sm text-wheat-700">Mapped loci per species and trait category.</figcaption>
      </figure>
      <div className="space-y-10">
        {SPECIES.map(([k, title, note]) => (
          <section key={k}>
            <h2 className="font-serif text-2xl italic text-wheat-900">{title}</h2>
            <p className="mt-1 text-sm text-wheat-600">{note} Karyotype: grey shading = locus density per 1 Mb; squares = QTL / mapped loci, circles = GWAS loci, coloured by trait group (suggestive associations omitted).</p>
            <div className="mt-4 grid gap-6 xl:grid-cols-2">
              <a href={src(`${k}_karyotype`)} target="_blank" rel="noreferrer" className="card block"><img src={src(`${k}_karyotype`)} alt={`${title} karyotype`} loading="lazy" className="w-full" /></a>
              <a href={src(`${k}_circos`)} target="_blank" rel="noreferrer" className="card block"><img src={src(`${k}_circos`)} alt={`${title} Circos plot`} loading="lazy" className="w-full" /></a>
            </div>
          </section>
        ))}
        <section>
          <h2 className="font-serif text-2xl text-wheat-900">Waterhemp linkage map with herbicide-resistance QTL</h2>
          <p className="mt-1 text-sm text-wheat-600">F2 CHR × WUS (Werle et al. 2025): linkage groups carrying a QTL, shaded by marker density, with the dicamba (orange) and 2,4-D (blue) QTL support intervals in cM.</p>
          <a href={src('linkage_map_A_tuberculatus_QTL')} target="_blank" rel="noreferrer" className="card mt-4 block"><img src={src('linkage_map_A_tuberculatus_QTL')} alt="Waterhemp linkage map with QTL" loading="lazy" className="w-full" /></a>
        </section>
      </div>
    </div>
  )
}
