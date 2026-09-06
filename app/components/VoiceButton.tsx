'use client'

import { useRef, useState } from 'react'

type Props = { onText: (text: string) => void; disabled?: boolean }

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  onresult: ((event: { results?: ArrayLike<{ 0?: { transcript?: string } }> }) => void) | null
  start: () => void
  stop: () => void
}

export default function VoiceButton({ onText, disabled = false }: Props) {
  const [listening, setListening] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const toggle = () => {
    if (disabled) return
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const browser = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionLike
      webkitSpeechRecognition?: new () => SpeechRecognitionLike
    }
    const SpeechRecognition = browser.SpeechRecognition || browser.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setUnsupported(true)
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'ja-JP'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = event => {
      const text = event.results?.[0]?.[0]?.transcript ?? ''
      if (text) onText(text)
    }
    recognition.start()
  }

  return (
    <div className="voice-wrap">
      <button
        type="button"
        className={`mic-btn ${listening ? 'is-listening' : ''}`}
        onClick={toggle}
        disabled={disabled}
        aria-pressed={listening}
        aria-label={listening ? '音声入力を停止' : '音声入力'}
      >
        <span aria-hidden="true">{listening ? '■' : '🎤'}</span>
        <span>{listening ? '停止' : '音声'}</span>
      </button>
      {unsupported && <span className="field-error">このブラウザは音声入力に対応していません。</span>}
    </div>
  )
}
