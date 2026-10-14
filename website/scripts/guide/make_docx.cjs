/**
 * Build public/CottonQTLome_User_Guide.docx from src/lib/guide.json and the
 * annotated screenshots in public/images/guide/.
 */
const fs = require('fs')
const path = require('path')
const {
  Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, Footer, PageNumber,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak, TabStopType,
} = require('docx')

const ROOT = path.join(__dirname, '..', '..')
const guide = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'lib', 'guide.json'), 'utf8'))
// headline numbers for the introduction, from the same summary the site reads
const counts = (() => {
  const f = path.join(ROOT, 'public', 'data', 'summary.json')
  if (!fs.existsSync(f)) return null
  const c = JSON.parse(fs.readFileSync(f, 'utf8')).counts || {}
  return Object.fromEntries(Object.entries(c).map(([k, v]) => [k, typeof v === 'number' ? v.toLocaleString('en-US') : v]))
})()

const FONT = 'Arial'
const INK = '19191C', MUTED = '57575F', GREEN = '15803D', RED = 'D92D20', RULE = 'D1D1D6'
const PAGE_W = 11906, MARGIN = 1134            // A4, 2 cm margins (DXA)
const CONTENT_W = PAGE_W - 2 * MARGIN          // 9638 DXA = 17 cm
const IMG_W = 642                              // px at 96 dpi = 17 cm

const text = (t, o = {}) => new TextRun({ text: t, font: FONT, size: 21, color: INK, ...o })
const para = (children, o = {}) => new Paragraph({ spacing: { after: 120, line: 300 }, ...o, children: [].concat(children) })
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const line = { style: BorderStyle.SINGLE, size: 4, color: RULE }

function calloutTable(callouts) {
  const NUM_W = 620
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [NUM_W, CONTENT_W - NUM_W],
    rows: callouts.map((c, i) => new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: NUM_W, type: WidthType.DXA },
          borders: { top: none, left: none, right: none, bottom: i === callouts.length - 1 ? none : line },
          margins: { top: 90, bottom: 90, left: 0, right: 80 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: RED },
            children: [new TextRun({ text: String(c.n), font: FONT, size: 21, bold: true, color: 'FFFFFF' })],
          })],
        }),
        new TableCell({
          width: { size: CONTENT_W - NUM_W, type: WidthType.DXA },
          borders: { top: none, left: none, right: none, bottom: i === callouts.length - 1 ? none : line },
          margins: { top: 90, bottom: 90, left: 120, right: 0 },
          children: [para([text(c.label + '. ', { bold: true }), text(c.text)], { spacing: { after: 0, line: 290 } })],
        }),
      ],
    })),
  })
}

const children = [
  new Paragraph({ spacing: { before: 2400, after: 120 }, children: [
    new TextRun({ text: 'Cotton', font: FONT, size: 64, bold: true, color: INK }),
    new TextRun({ text: 'QTLome', font: FONT, size: 64, bold: true, color: GREEN }),
  ] }),
  new Paragraph({ spacing: { after: 360 }, children: [new TextRun({ text: 'User guide', font: FONT, size: 40, color: GREEN })] }),
  para(text('A step-by-step tour of the database: how to search it, browse and export its tables, use its genome maps, hotspots and linkage maps, and read its statistics. Each screenshot is numbered; the list under it explains every numbered item.', { size: 24, color: MUTED }), { spacing: { after: 360, line: 340 } }),
  para(text('This guide is also available on the site under About → Tutorial.')),
]
if (counts) {
  children.push(para(text(`At the time this guide was generated the database held ${counts.qtl} linkage QTL, ${counts.gwas_loci} GWAS loci (${counts.gwas_associations} associations), ${counts.mqtl} computed meta-QTL, ${counts.epistatic} epistatic QTL pairs and ${counts.hotspots} hotspot regions, from ${counts.studies_with_data} studies; ${counts.papers_indexed} papers are indexed.`, { color: MUTED })))
}
children.push(
  new Paragraph({ spacing: { before: 480, after: 160 }, children: [new TextRun({ text: 'Contents', font: FONT, size: 28, bold: true, color: INK })] }),
  ...guide.map((s, i) => para(text(`${i + 1}.  ${s.title}`), { spacing: { after: 60 } })),
)

guide.forEach((s, i) => {
  const img = fs.readFileSync(path.join(ROOT, 'public', 'images', 'guide', s.image))
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 140 }, children: [new TextRun({ text: `${i + 1}.  ${s.title}`, font: FONT, size: 32, bold: true, color: INK })] }),
    para(text(s.intro, { color: MUTED }), { spacing: { after: 200, line: 300 } }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new ImageRun({ type: 'png', data: img, transformation: { width: IMG_W, height: Math.round(IMG_W * s.height / s.width) },
        altText: { title: s.title, description: `Screenshot of the ${s.title} page with numbered arrows`, name: s.id } })],
    }),
    calloutTable(s.callouts),
  )
})

const doc = new Document({
  creator: 'CottonQTLome',
  title: 'CottonQTLome user guide',
  description: 'Annotated guide to the CottonQTLome website',
  styles: { default: { document: { run: { font: FONT, size: 21 } } } },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    footers: { default: new Footer({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
      children: [new TextRun({ text: 'CottonQTLome user guide', font: FONT, size: 16, color: MUTED }),
        new TextRun({ children: ['\t', PageNumber.CURRENT], font: FONT, size: 16, color: MUTED })],
    })] }) },
    children,
  }],
})

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(ROOT, 'public', 'CottonQTLome_User_Guide.docx')
  fs.writeFileSync(out, buf)
  console.log(`wrote ${path.relative(ROOT, out)}  (${guide.length} sections, ${(buf.length / 1048576).toFixed(1)} MB)`)
})
