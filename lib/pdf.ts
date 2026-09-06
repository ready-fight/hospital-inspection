'use client'

export type PdfBuildOptions = {
  filename?: string
  marginMm?: number
  scale?: number
}

async function renderElementToPdfBlob(element: HTMLElement, options: PdfBuildOptions = {}) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  if ('fonts' in document) {
    try { await document.fonts.ready } catch {}
  }

  // html2canvas cannot capture display:none nodes, so the PDF source is rendered
  // off-screen at its real A4-ish width instead.
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: options.scale ?? Math.min(2, Math.max(1.5, window.devicePixelRatio || 1.5)),
    useCORS: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pageWidthMm = 210
  const pageHeightMm = 297
  const marginMm = options.marginMm ?? 10
  const contentWidthMm = pageWidthMm - marginMm * 2
  const contentHeightMm = pageHeightMm - marginMm * 2
  const pixelsPerMm = canvas.width / contentWidthMm
  const pageHeightPx = Math.max(1, Math.floor(contentHeightMm * pixelsPerMm))

  let y = 0
  let pageIndex = 0

  while (y < canvas.height) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - y)
    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = sliceHeight

    const context = pageCanvas.getContext('2d')
    if (!context) throw new Error('PDF canvas context could not be created.')

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
    context.drawImage(
      canvas,
      0,
      y,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    )

    if (pageIndex > 0) pdf.addPage()

    const imageData = pageCanvas.toDataURL('image/jpeg', 0.94)
    const renderedHeightMm = sliceHeight / pixelsPerMm
    pdf.addImage(
      imageData,
      'JPEG',
      marginMm,
      marginMm,
      contentWidthMm,
      renderedHeightMm,
      undefined,
      'FAST',
    )

    y += sliceHeight
    pageIndex += 1
  }

  return pdf.output('blob')
}

export async function createPdfBlob(elementId: string, options: PdfBuildOptions = {}) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error(`PDF source element not found: ${elementId}`)
  return renderElementToPdfBlob(element, options)
}

export async function createPdfObjectUrl(elementId: string, options: PdfBuildOptions = {}) {
  const blob = await createPdfBlob(elementId, options)
  return URL.createObjectURL(blob)
}

export async function downloadPdf(elementId: string, filename: string) {
  const blob = await createPdfBlob(elementId)
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export async function openPdf(elementId: string) {
  const popup = window.open('', '_blank')
  const url = await createPdfObjectUrl(elementId)

  if (popup) {
    popup.location.href = url
  } else {
    window.location.href = url
  }

  // Do not revoke immediately: the PDF viewer still needs the blob URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
