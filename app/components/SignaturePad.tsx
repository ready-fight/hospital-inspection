'use client'

import { useCallback, useEffect, useRef } from 'react'

type Props = {
  value: string | null
  onChange: (dataUrl: string | null) => void
  disabled?: boolean
}

export default function SignaturePad({ value, onChange, disabled = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  const configureCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    if (!rect.width) return
    const ratio = window.devicePixelRatio || 1
    canvas.width = Math.round(rect.width * ratio)
    canvas.height = Math.round(220 * ratio)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.lineWidth = 2.6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#172033'
    if (value) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, 220)
      img.src = value
    }
  }, [value])

  useEffect(() => {
    configureCanvas()
    const onResize = () => configureCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [configureCanvas])

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return
    drawing.current = true
    const ctx = e.currentTarget.getContext('2d')
    const p = point(e)
    ctx?.beginPath()
    ctx?.moveTo(p.x, p.y)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || !drawing.current) return
    const ctx = e.currentTarget.getContext('2d')
    const p = point(e)
    ctx?.lineTo(p.x, p.y)
    ctx?.stroke()
  }

  const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || !drawing.current) return
    drawing.current = false
    onChange(e.currentTarget.toDataURL('image/png'))
  }

  const clear = () => {
    if (disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
    onChange(null)
  }

  return (
    <div>
      <div className={`signature-wrap ${disabled ? 'is-disabled' : ''}`}>
        <canvas
          ref={canvasRef}
          aria-label="確認者サイン入力欄"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
        {!value && <span className="signature-hint">こちらにサイン</span>}
      </div>
      <button type="button" className="text-button" onClick={clear} disabled={disabled || !value}>サインを消去</button>
    </div>
  )
}
