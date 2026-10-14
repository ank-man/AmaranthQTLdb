import PageHero from '../components/PageHero'

export default function Credits() {
  return (
    <div>
      <PageHero eyebrow="Citation" title="How to cite" subtitle="Please cite the original studies for any locus you use, and the database for the compilation, meta-QTL and coordinate conversion." variant="side" />
      <div className="card max-w-3xl space-y-3 text-sm leading-relaxed text-wheat-700">
        <p><strong>Database:</strong> Sharma A. AmaranthQTLdb: a compilation of Amaranthus QTL, GWAS loci, meta-QTL, linkage maps and validated PCR markers. https://github.com/ank-man/AmaranthQTLdb</p>
        <p><strong>Original studies:</strong> every record links to its paper in the Reference column; the full list is on the Studies page.</p>
        <p><strong>Genome assemblies:</strong> Lightfoot et al. 2017 (BMC Biology 15:74), A. hypochondriacus v3 (GCA_977020195.1), Raiyemo et al. 2025 (BMC Genomics 26:988), and the IWGC A. palmeri assembly (GCA_051800445.1).</p>
        <p><strong>Photo:</strong> Amaranthus kiwicha seed, Crops for the Future, CC BY-SA 3.0, via Wikimedia Commons.</p>
      </div>
    </div>
  )
}
