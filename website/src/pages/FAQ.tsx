import PageHero from '../components/PageHero'
import { GLOSSARY } from '../lib/glossary'

const QA: [string, string][] = [
  ['Why are some studies not in the tables?',
    'Studies are listed on the Studies page with the reason when their loci could not be extracted: subscription-only papers, bioRxiv preprints that refused automated access during compilation (HTTP 429/1015), or papers that give no map positions. Their loci can be added once the text is available.'],
  ['How were positions converted between assemblies?',
    'Each species has one target assembly: A. hypochondriacus v3 (GCA_977020195.1), A. tuberculatus hap1 (GCA_054443085.1) and A. palmeri hap1 (GCA_051800445.1). Within one accession (A. hypochondriacus v2.0/v2.2 → v3) the chromosome sequences are aligned whole with minimap2 (asm5) and each position is lifted through the alignment. Between different plants, 20 kb of source sequence around each position is aligned to the target (asm10) and the position read off the alignment. Intervals whose ends land on different chromosomes, or convert at one end only, are flagged. Chromosome numbers differ between assemblies of one species.'],
  ['Why are A. tricolor loci drawn on the A. hypochondriacus genome?',
    'The A. tricolor and multi-species GWAS panels were genotyped against the A. hypochondriacus reference by their authors, so their published positions are on that axis.'],
  ['How were the meta-QTL computed?',
    'Loci of each trait group on the A. hypochondriacus axis (v2.2 positions first converted to v2.1) were merged per study within 2 Mb, so each study contributes one observation per locus. A Gaussian mixture in which each observation keeps its own positional variance (Goffinet & Gerber 2000, the BioMercator model, applied to physical positions) was fitted with k chosen by BIC, and a component was kept when at least two independent studies support it. Positions are given on v2.1 and v3.'],
  ['What is a suggestive association?',
    'Some GWAS report associations at 0.001 < P ≤ 0.01 in their supplements. They are kept and marked suggestive, drawn faintly in the figures, and left out of multi-trait clusters.'],
  ['Why is there no consensus linkage map?',
    'A consensus map needs at least two maps of one species with published marker positions and shared markers. Only the waterhemp F2 map publishes its marker positions; the grain-amaranth maps give per-chromosome totals only.'],
  ['What makes a PCR marker "validated"?',
    'The assay was tested by its authors on plants of known phenotype or genotype (bioassay, sequencing, known sex or segregating progeny). Primer sequences were copied only from open-access papers and each was checked character by character against its source.'],
]

export default function FAQ() {
  return (
    <div>
      <PageHero eyebrow="Help" title="FAQ and methods" subtitle="How the data were compiled, converted and analysed, and what the terms in the tables mean." variant="side" />
      <div className="max-w-4xl space-y-4">
        {QA.map(([q, a]) => (
          <div key={q} className="card">
            <h3 className="font-semibold text-wheat-900">{q}</h3>
            <p className="mt-1 text-sm leading-relaxed text-wheat-700">{a}</p>
          </div>
        ))}
        <div className="card">
          <h3 className="font-semibold text-wheat-900">Glossary</h3>
          <dl className="mt-2 space-y-2 text-sm text-wheat-700">
            {Object.entries(GLOSSARY).map(([k, v]) => <div key={k}><dd>{v}</dd></div>)}
          </dl>
        </div>
      </div>
    </div>
  )
}
