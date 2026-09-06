'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { demoReports } from '@/lib/demo-reports'
import { getSubmittedDrafts } from '@/lib/offline-db'
import type { InspectionDraft } from '@/lib/types'

const REVIEW_KEY = 'hospital-inspection-reviewed-reports'

type ReviewMap = Record<string, string>

function reportNumber(report: InspectionDraft) {
  if (report.id.startsWith('demo-')) return `IR-${report.inspectionDate.replaceAll('-', '')}-${report.id.slice(-3)}`
  return `IR-${report.inspectionDate.replaceAll('-', '')}-${report.id.slice(-4).toUpperCase()}`
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(`${date}T00:00:00`))
}

function formatDateTime(value: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(new Date(value))
}

export default function ReportsPage() {
  const [localReports, setLocalReports] = useState<InspectionDraft[]>([])
  const [selectedId, setSelectedId] = useState(demoReports[0]?.id ?? '')
  const [reviews, setReviews] = useState<ReviewMap>({})
  const [query, setQuery] = useState('')

  useEffect(() => {
    void getSubmittedDrafts().then(setLocalReports).catch(() => setLocalReports([]))
    try {
      setReviews(JSON.parse(localStorage.getItem(REVIEW_KEY) ?? '{}'))
    } catch {
      setReviews({})
    }
  }, [])

  const reports = useMemo(() => {
    const localIds = new Set(localReports.map(item => item.id))
    return [...localReports, ...demoReports.filter(item => !localIds.has(item.id))]
      .sort((a, b) => (b.submittedAt ?? b.updatedAt).localeCompare(a.submittedAt ?? a.updatedAt))
  }, [localReports])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return reports
    return reports.filter(report => [
      report.hospitalName, report.equipmentName, report.equipmentId, report.inspectorName, reportNumber(report), report.inspectionDate,
    ].some(value => value.toLowerCase().includes(normalized)))
  }, [query, reports])

  const selected = reports.find(item => item.id === selectedId) ?? filtered[0] ?? reports[0]
  const abnormalCount = selected?.items.filter(item => item.result === 'ng').length ?? 0
  const reviewedAt = selected ? reviews[selected.id] : undefined

  const confirmReview = () => {
    if (!selected || reviewedAt) return
    const next = { ...reviews, [selected.id]: new Date().toISOString() }
    setReviews(next)
    localStorage.setItem(REVIEW_KEY, JSON.stringify(next))
  }

  return (
    <main className="app-shell reports-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="m8 12 2.2 2.2L16 8.7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <div><strong>設備保守点検システム</strong><small>Maintenance Inspection</small></div>
        </div>
        <div className="topbar-actions">
          <span className="demo-badge">DEMO</span>
          <Link href="/" className="header-link">点検入力へ</Link>
        </div>
      </header>

      <section className="reports-hero">
        <div>
          <p className="eyebrow">REPORT MANAGEMENT</p>
          <h1>点検報告・確認</h1>
          <p>提出済みの点検報告を確認し、確認済みとして管理できます。</p>
        </div>
        <div className="report-kpis">
          <div><span>報告件数</span><strong>{reports.length}</strong></div>
          <div><span>確認待ち</span><strong>{reports.filter(report => !reviews[report.id]).length}</strong></div>
          <div><span>異常あり</span><strong>{reports.filter(report => report.items.some(item => item.result === 'ng')).length}</strong></div>
        </div>
      </section>

      <section className="reports-layout">
        <aside className="report-list-panel">
          <div className="report-list-head">
            <div><h2>報告履歴</h2><span>{filtered.length}件</span></div>
            <label className="report-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="病院名・設備名で検索" /></label>
          </div>

          <div className="report-list">
            {filtered.map(report => {
              const hasNg = report.items.some(item => item.result === 'ng')
              const isReviewed = Boolean(reviews[report.id])
              return (
                <button key={report.id} className={`report-row ${selected?.id === report.id ? 'is-selected' : ''}`} onClick={() => setSelectedId(report.id)}>
                  <div className="report-row-top">
                    <strong>{report.hospitalName}</strong>
                    <span className={`review-chip ${isReviewed ? 'is-reviewed' : ''}`}>{isReviewed ? '確認済み' : '確認待ち'}</span>
                  </div>
                  <p>{report.equipmentName}</p>
                  <div className="report-row-meta"><span>{formatDate(report.inspectionDate)}</span><span>{report.inspectorName}</span>{hasNg && <span className="abnormal-tag">異常あり</span>}</div>
                </button>
              )
            })}
            {filtered.length === 0 && <div className="empty-reports">該当する報告はありません。</div>}
          </div>
        </aside>

        {selected && (
          <article className="report-detail-panel">
            <div className="report-detail-head">
              <div>
                <div className="detail-status-line"><span className={`review-chip ${reviewedAt ? 'is-reviewed' : ''}`}>{reviewedAt ? '確認済み' : '確認待ち'}</span>{abnormalCount > 0 && <span className="abnormal-tag">異常 {abnormalCount}件</span>}</div>
                <h2>{selected.hospitalName}</h2>
                <p>{selected.equipmentName}</p>
              </div>
              <div className="report-number"><span>報告番号</span><strong>{reportNumber(selected)}</strong></div>
            </div>

            <div className="detail-meta-grid">
              <div><span>点検日</span><strong>{formatDate(selected.inspectionDate)}</strong></div>
              <div><span>設備ID</span><strong>{selected.equipmentId}</strong></div>
              <div><span>点検担当者</span><strong>{selected.inspectorName}</strong></div>
              <div><span>提出日時</span><strong>{formatDateTime(selected.submittedAt)}</strong></div>
            </div>

            <section className="detail-section">
              <div className="detail-section-title"><h3>点検結果</h3><span>{selected.items.length}項目</span></div>
              <div className="review-items">
                {selected.items.map((item, index) => (
                  <div className="review-item" key={item.id}>
                    <span className="review-item-number">{String(index + 1).padStart(2, '0')}</span>
                    <div className="review-item-main"><strong>{item.label}</strong>{item.comment && <p>{item.comment}</p>}</div>
                    <span className={`result-pill is-${item.result}`}>{item.result === 'ok' ? '正常' : item.result === 'ng' ? '異常' : item.result === 'na' ? '対象外' : '未入力'}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-section review-signature-section">
              <div className="detail-section-title">
                <h3>確認サイン</h3>
              </div>
              <div className="review-signature-card">
                {selected.signatureDataUrl ? (
                  <img src={selected.signatureDataUrl} alt={`${selected.inspectorName}の確認サイン`} />
                ) : (
                  <div className="review-signature-empty">署名データはありません</div>
                )}
              </div>
            </section>

            <section className="review-footer-card">
              <div>
                <span className="review-footer-icon">✓</span>
                <div><strong>{reviewedAt ? 'この報告は確認済みです' : '報告内容の確認'}</strong><p>{reviewedAt ? `${formatDateTime(reviewedAt)} に確認されました。` : '点検内容に問題がなければ「確認済みにする」を押してください。'}</p></div>
              </div>
              <button className="primary-btn review-button" onClick={confirmReview} disabled={Boolean(reviewedAt)}>{reviewedAt ? '確認済み' : '確認済みにする'}</button>
            </section>
          </article>
        )}
      </section>
    </main>
  )
}
