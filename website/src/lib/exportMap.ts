function inlineSvgStyles(svg: SVGSVGElement): SVGSVGElement {
  const clone = svg.cloneNode(true) as SVGSVGElement
  const originalNodes = svg.querySelectorAll('*')
  const clonedNodes = clone.querySelectorAll('*')
  if (originalNodes.length !== clonedNodes.length) return clone

  const relevant = new Set([
    'fill',
    'stroke',
    'stroke-width',
    'stroke-opacity',
    'stroke-linecap',
    'stroke-linejoin',
    'opacity',
    'font-size',
    'font-weight',
    'font-family',
    'text-anchor',
  ])

  originalNodes.forEach((orig, i) => {
    const copy = clonedNodes[i] as HTMLElement
    const computed = window.getComputedStyle(orig)
    const style = copy.style
    relevant.forEach((prop) => {
      const value = computed.getPropertyValue(prop)
      if (value && value !== 'none' && value !== 'auto' && value !== 'normal') {
        style.setProperty(prop, value)
      }
    })
  })
  return clone
}

function svgToString(svg: SVGSVGElement): string {
  const serializer = new XMLSerializer()
  return serializer.serializeToString(svg)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportSVG(svg: SVGSVGElement, filename = 'amaranth-qtl-map.svg') {
  const str = svgToString(svg)
  const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' })
  downloadBlob(blob, filename)
}

export function exportRaster(
  svg: SVGSVGElement,
  format: 'png' | 'jpeg',
  filename = `amaranth-qtl-map.${format}`,
  scale = 2
) {
  const styled = inlineSvgStyles(svg)
  const rect = svg.getBoundingClientRect()
  const width = rect.width * scale
  const height = rect.height * scale

  const serializer = new XMLSerializer()
  const svgStr = serializer.serializeToString(styled)
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
    }
    ctx.drawImage(img, 0, 0, width, height)
    URL.revokeObjectURL(url)
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, filename)
    }, format === 'png' ? 'image/png' : 'image/jpeg', 0.95)
  }
  img.src = url
}
