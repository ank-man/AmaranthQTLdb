import PageHero from '../components/PageHero'

const LINKS: [string, string, string][] = [
  ['Phytozome - Amaranthus hypochondriacus v2.1', 'https://phytozome-next.jgi.doe.gov/info/Ahypochondriacus_v2_1', 'Reference genome and annotation (Lightfoot et al. 2017).'],
  ['NCBI - A. hypochondriacus v3', 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_977020195.1/', 'Current chromosome-level assembly used as the grain-amaranth map axis.'],
  ['NCBI - A. tuberculatus hap1', 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_054443085.1/', 'Waterhemp reference (Raiyemo et al. 2025).'],
  ['NCBI - A. palmeri hap1', 'https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_051800445.1/', 'Palmer amaranth reference (International Weed Genomics Consortium).'],
  ['CoGe', 'https://genomevolution.org/coge/', 'Older amaranth assemblies (PGA2, v2.2, Kreiner 2019 waterhemp, BASF Palmer amaranth).'],
  ['Amaranth Genomic Resource Database (paper)', 'https://doi.org/10.3389/fpls.2023.1203855', 'Genes, SSRs and SNPs of five amaranth species.'],
  ['PopAmaranth (paper)', 'https://doi.org/10.1093/g3journal/jkab103', 'Population-genetic genome browser for grain amaranths and wild relatives.'],
  ['International Weed Genomics Consortium', 'https://www.weedgenomics.org/', 'Weed genome assemblies including Amaranthus.'],
]

export default function UsefulLinks() {
  return (
    <div>
      <PageHero eyebrow="Resources" title="Related resources" subtitle="Genomes and databases used for, or complementary to, AmaranthQTLdb." variant="side" />
      <div className="max-w-4xl">
        {LINKS.map(([t, u, d]) => (
          <div key={t} className="grid gap-2 border-b border-wheat-200 py-3 sm:grid-cols-[320px_1fr]">
            <a className="underline" href={u} target="_blank" rel="noreferrer">{t}</a>
            <span className="text-sm text-wheat-700">{d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
