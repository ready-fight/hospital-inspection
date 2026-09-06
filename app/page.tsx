'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ConnectionBanner from '@/components/ConnectionBanner'
import ProgressBar from '@/components/ProgressBar'
import SignaturePad from '@/components/SignaturePad'
import VoiceButton from '@/components/VoiceButton'
import { createInitialDraft } from '@/lib/defaults'
import { loadLatestDraft, saveDraft } from '@/lib/offline-db'
import { syncDraft, syncPendingDrafts } from '@/lib/sync'
import type { InspectionDraft, InspectionResult } from '@/lib/types'

export default function Home() {
  const [draft, setDraft] = useState<InspectionDraft | null>(null)
  const [online, setOnline] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let alive = true
    const initialise = async () => {
      const saved = await loadLatestDraft().catch(() => null)
      if (!alive) return
      setDraft(saved ?? createInitialDraft())
      setOnline(navigator.onLine)
      setHydrated(true)
    }
    void initialise()
    return () => { alive = false }
  }, [])

  const syncAll = useCallback(async () => {
    if (!navigator.onLine) return
    const synced = await syncPendingDrafts()
    if (synced.length > 0) {
      setMessage({ type: 'success', text: `${synced.length}件の未送信報告を送信しました。` })
      setDraft(current => current && synced.some(item => item.id === current.id) ? synced.find(item => item.id === current.id)! : current)
    }
  }, [])

  useEffect(() => {
    const onOnline = () => {
      setOnline(true)
      void syncAll()
    }
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [syncAll])

  useEffect(() => {
    if (!hydrated || !draft || draft.syncState === 'submitted' || draft.syncState === 'syncing') return
    const timer = window.setTimeout(async () => {
      setSaving(true)
      const next = { ...draft, updatedAt: new Date().toISOString() }
      await saveDraft(next).catch(() => setMessage({ type: 'error', text: '端末への自動保存に失敗しました。' }))
      setSaving(false)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [draft, hydrated])

  const completed = useMemo(() => draft?.items.filter(item => item.result !== null).length ?? 0, [draft])
  const readonly = draft?.syncState === 'submitted' || draft?.syncState === 'syncing'

  const update = (mutator: (current: InspectionDraft) => InspectionDraft) => {
    setMessage(null)
    setDraft(current => current ? mutator({ ...current, syncState: current.syncState === 'failed' ? 'draft' : current.syncState, lastError: null }) : current)
  }

  const updateResult = (id: string, result: InspectionResult) => update(current => ({
    ...current,
    items: current.items.map(item => item.id === id ? { ...item, result } : item)
  }))

  const updateComment = (id: string, comment: string) => update(current => ({
    ...current,
    items: current.items.map(item => item.id === id ? { ...item, comment } : item)
  }))

  const validate = () => {
    if (!draft) return '点検データを読み込めませんでした。'
    if (completed !== draft.items.length) return 'すべての点検項目を入力してください。'
    if (!draft.inspectorName.trim()) return '点検担当者名を入力してください。'
    if (!draft.signatureDataUrl) return '確認サインを入力してください。'
    return null
  }

  const submit = async () => {
    if (!draft) return
    const error = validate()
    if (error) {
      setMessage({ type: 'error', text: error })
      return
    }

    const queued: InspectionDraft = {
      ...draft,
      syncState: 'queued',
      lastError: null,
      updatedAt: new Date().toISOString()
    }
    setDraft(queued)
    await saveDraft(queued)

    if (!navigator.onLine) {
      setMessage({ type: 'info', text: 'オフラインのため提出待ちとして端末に保存しました。通信復旧時に自動送信します。' })
      return
    }

    try {
      setDraft({ ...queued, syncState: 'syncing' })
      const submitted = await syncDraft(queued.id)
      setDraft(submitted)
      setMessage({ type: 'success', text: '点検報告を提出しました。' })
    } catch (syncError) {
      const failed: InspectionDraft = { ...queued, syncState: 'failed', lastError: syncError instanceof Error ? syncError.message : '送信に失敗しました。' }
      setDraft(failed)
      setMessage({ type: 'error', text: `${failed.lastError} 入力内容は端末に保持されています。` })
    }
  }

  const startNext = async () => {
    const next = createInitialDraft()
    await saveDraft(next)
    setDraft(next)
    setMessage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!hydrated || !draft) {
    return <main className="app-shell"><div className="loading-card">点検データを読み込んでいます…</div></main>
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="m8 12 2.2 2.2L16 8.7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <div><strong>設備保守点検システム</strong><small>Maintenance Inspection</small></div>
        </div>
        <div className="topbar-actions">
          <span className="demo-badge">DEMO</span>
          <Link href="/reports" className="header-link">報告履歴</Link>
          <ConnectionBanner online={online} />
        </div>
      </header>

      <section className="summary-card">
        <div className="summary-topline">
          <div>
            <p className="eyebrow">定期保守点検報告書</p>
            <h1>{draft.hospitalName}</h1>
            <p className="equipment-name">{draft.equipmentName}</p>
          </div>
          <span className={`report-status ${draft.syncState === 'submitted' ? 'is-complete' : ''}`}>
            <span className="status-dot" />{draft.syncState === 'submitted' ? '提出済み' : '作業中'}
          </span>
        </div>
        <div className="summary-divider" />
        <div className="summary-bottom">
          <div className="meta-grid">
            <div className="meta-cell"><span>点検日</span><strong>{draft.inspectionDate}</strong></div>
            <div className="meta-cell"><span>設備ID</span><strong>{draft.equipmentId}</strong></div>
            <div className="meta-cell"><span>報告番号</span><strong>IR-2026-0905-001</strong></div>
          </div>
          <ProgressBar value={completed} max={draft.items.length} />
        </div>
      </section>

      {message && <div className={`notice notice-${message.type}`} role="alert">{message.text}</div>}
      {draft.syncState === 'failed' && draft.lastError && <div className="notice notice-error">前回の送信エラー: {draft.lastError}</div>}

      <section className="section-card">
        <div className="section-heading">
          <div className="section-title-group"><span className="step-badge">01</span><div><p className="step-label">INSPECTION</p><h2>点検結果</h2><p className="section-description">各項目を確認し、点検結果を選択してください。</p></div></div>
          <span className={`autosave ${saving ? 'is-saving' : ''}`}><span className="autosave-dot" />{saving ? '保存中…' : '端末に自動保存'}</span>
        </div>
        <div className="inspection-list">
          {draft.items.map((item, index) => (
            <article className={`inspection-item ${item.result ? 'is-answered' : ''}`} key={item.id}>
              <div className="item-heading"><span className="item-number">{String(index + 1).padStart(2, '0')}</span><div className="item-title-wrap"><h3>{item.label}</h3><span>{item.result ? '入力済み' : '未入力'}</span></div></div>
              <div className="result-row" role="group" aria-label={`${item.label}の点検結果`}>
                <button disabled={readonly} className={`result-btn result-ok ${item.result === 'ok' ? 'active' : ''}`} onClick={() => updateResult(item.id, 'ok')}>✓ 正常</button>
                <button disabled={readonly} className={`result-btn result-ng ${item.result === 'ng' ? 'active' : ''}`} onClick={() => updateResult(item.id, 'ng')}>! 異常</button>
                <button disabled={readonly} className={`result-btn result-na ${item.result === 'na' ? 'active' : ''}`} onClick={() => updateResult(item.id, 'na')}>− 対象外</button>
              </div>
              <div className="comment-block">
                <label htmlFor={`comment-${item.id}`}>補足・点検結果</label>
                <div className="note-row">
                  <textarea id={`comment-${item.id}`} disabled={readonly} value={item.comment} onChange={event => updateComment(item.id, event.target.value)} placeholder="必要に応じて状態や対応内容を入力" />
                  <VoiceButton disabled={readonly} onText={text => updateComment(item.id, item.comment ? `${item.comment} ${text}` : text)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div className="section-title-group"><span className="step-badge">02</span><div><p className="step-label">CONFIRMATION</p><h2>確認・サイン</h2><p className="section-description">点検内容を確認し、担当者情報とサインを入力してください。</p></div></div>
        </div>
        <div className="field-grid">
          <label className="field-label">点検担当者名<input disabled={readonly} value={draft.inspectorName} onChange={event => update(current => ({ ...current, inspectorName: event.target.value }))} placeholder="例）山田 太郎" autoComplete="name" /></label>
        </div>
        <div className="signature-label-row"><div><strong>確認サイン</strong><p className="help-text">タブレット画面上に指またはペンでサインしてください。</p></div><span className="required-badge">必須</span></div>
        <SignaturePad disabled={readonly} value={draft.signatureDataUrl} onChange={signatureDataUrl => update(current => ({ ...current, signatureDataUrl }))} />
      </section>

      <section className="submit-card">
        {draft.syncState === 'submitted' ? (
          <div className="submitted-state"><span className="submitted-icon">✓</span><div><strong>提出済み</strong><p>{draft.submittedAt ? new Date(draft.submittedAt).toLocaleString('ja-JP') : ''}</p></div><button className="secondary-btn" onClick={startNext}>次の点検を開始</button></div>
        ) : (
          <>
            <div className="submit-copy"><span className="submit-shield" aria-hidden="true">✓</span><div><strong>入力内容は端末に安全に保存されています</strong><p>{online ? '内容を確認のうえ、点検報告を提出してください。' : '現在オフラインです。提出内容は通信復旧後に送信されます。'}</p></div></div>
            <button className="primary-btn" onClick={submit} disabled={draft.syncState === 'syncing'}>{draft.syncState === 'syncing' ? '送信中…' : '点検報告を提出'}</button>
          </>
        )}
      </section>

      <footer><span>設備保守点検システム</span><span>端末内自動保存・オフライン対応</span></footer>
    </main>
  )
}
