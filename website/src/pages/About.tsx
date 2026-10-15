import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

export default function About() {
  return (
    <div>
      <PageHero eyebrow="About" title="About AmaranthQTLdb" subtitle="An open, source-traceable compilation of the genetic mapping results published for Amaranthus." variant="side" />
      <figure className="card mb-6">
        <a href={`${import.meta.env.BASE_URL}figures/database_flowchart.svg`} target="_blank" rel="noreferrer">
          <img src={`${import.meta.env.BASE_URL}figures/database_flowchart.png`} alt="AmaranthQTLdb: sources, curation, data, analyses and website features" className="w-full" />
        </a>
        <figcaption className="mt-2 text-xs text-wheat-600">How the database is built: sources, curation and verification, data, analyses and the website. Click for the SVG.</figcaption>
      </figure>
      <div className="card max-w-4xl space-y-4 text-sm leading-relaxed text-wheat-700">
        <p>
          Amaranths include pseudocereal grain crops (<em>A. hypochondriacus</em>, <em>A. cruentus</em>, <em>A. caudatus</em>),
          leafy vegetables (<em>A. tricolor</em>) and some of the most damaging herbicide-resistant weeds (<em>A. tuberculatus</em>,
          waterhemp; <em>A. palmeri</em>, Palmer amaranth). Their mapping results are scattered across crop, weed-science and
          genomics journals and across several genome assemblies. AmaranthQTLdb brings them together.
        </p>
        <h3 className="font-semibold text-wheat-900">What it contains</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Mapped loci</strong>: QTL, GWAS marker-trait associations and QTNs, Mendelian loci and sex-linked regions, each with the table or sentence it came from (<Link className="underline" to="/data">data tables</Link>).</li>
          <li><strong>Meta-QTL and multi-trait clusters</strong> computed here, since none had been published (<Link className="underline" to="/data/metaqtl">Meta-QTL</Link>).</li>
          <li><strong>Linkage maps</strong> and the consensus-map status of each species (<Link className="underline" to="/linkage-maps">Linkage maps</Link>).</li>
          <li><strong>Coordinate conversion</strong> of every position to the current assembly of its species (<Link className="underline" to="/assemblies">Assemblies</Link>).</li>
          <li><strong>Validated PCR markers</strong> with verified primer sequences (<Link className="underline" to="/markers">PCR markers</Link>), and classical inheritance studies.</li>
        </ul>
        <h3 className="font-semibold text-wheat-900">Sources searched</h3>
        <p>
          Europe PMC (PubMed, PMC, AGRICOLA, preprints) and Crossref, by genus and common names and one by one for 33 species
          epithets; targeted web searches by trait; data repositories (Dryad, Zenodo, Figshare); GWAS Atlas; the Amaranth
          Genomic Resource Database; NCBI and CoGe genome assemblies. Open-access full texts and supplementary files were
          downloaded and every locus table was curated by hand into one schema. Studies that could not be read (subscription
          only, or preprint servers that refused automated access) are listed on the <Link className="underline" to="/literature">Studies</Link> page with the reason.
        </p>
        <h3 className="font-semibold text-wheat-900">Code and data</h3>
        <p>
          All scripts, curated tables and figures are open at{' '}
          <a className="underline" href="https://github.com/ank-man/AmaranthQTLdb" target="_blank" rel="noreferrer">github.com/ank-man/AmaranthQTLdb</a>.
          The website is adapted from the CottonQTLome and WheatQTLdb V3.0 sites.
        </p>
      </div>
    </div>
  )
}
