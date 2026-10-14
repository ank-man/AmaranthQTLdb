import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Tutorial from './pages/Tutorial'
import Statistics from './pages/Statistics'
import Contact from './pages/Contact'
import UsefulLinks from './pages/UsefulLinks'
import DataIndex from './pages/DataIndex'
import QTLPage from './pages/QTLPage'
import GWASPage from './pages/GWASPage'
import MetaQTLPage from './pages/MetaQTLPage'
import ClustersPage from './pages/ClustersPage'
import InheritancePage from './pages/InheritancePage'
import Map from './pages/Map'
import LiteraturePage from './pages/LiteraturePage'
import LinkageMapsPage from './pages/LinkageMapsPage'
import MarkersPage from './pages/MarkersPage'
import AssembliesPage from './pages/AssembliesPage'
import FiguresPage from './pages/FiguresPage'
import AdvancedSearch from './pages/AdvancedSearch'
import Credits from './pages/Credits'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/data" element={<DataIndex />} />
        <Route path="/data/qtl" element={<QTLPage />} />
        <Route path="/data/gwas" element={<GWASPage />} />
        <Route path="/data/metaqtl" element={<MetaQTLPage />} />
        <Route path="/data/clusters" element={<ClustersPage />} />
        <Route path="/data/inheritance" element={<InheritancePage />} />
        <Route path="/literature" element={<LiteraturePage />} />
        <Route path="/linkage-maps" element={<LinkageMapsPage />} />
        <Route path="/markers" element={<MarkersPage />} />
        <Route path="/assemblies" element={<AssembliesPage />} />
        <Route path="/figures" element={<FiguresPage />} />
        <Route path="/map" element={<Map />} />
        <Route path="/search" element={<AdvancedSearch />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/links" element={<UsefulLinks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
